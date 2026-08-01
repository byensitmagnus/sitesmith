#!/usr/bin/env node
// The direction record parser and the anti-repeat veto.
//
// This script may refuse. It may not choose. Nothing in here selects, ranks, seeds or
// suggests a colour, a face, a layout or a thesis, and no prior record is ever read back
// into a proposal. That restriction is not stylistic: in the blind head-to-head on this
// repository a deterministic direction generator scored 40 against 59 for a model
// reasoning from the brief, and the generator is the most plausible cause of the loss.
// So the ledger describes what it measured and says no. The design stays with whoever is
// reading the brief.
//
//   node scripts/ledger.mjs new     <dir> <surface> [--force]
//   node scripts/ledger.mjs parse   <dir> [--json]
//   node scripts/ledger.mjs measure <page> [--out file]
//   node scripts/ledger.mjs check   <dir> [--page x] [--measurement f] [--ledger f]
//   node scripts/ledger.mjs commit  <dir> [--page x] [--measurement f] [--ledger f]
//
// Exit codes, fixed so a caller can act on them:
//   0  passed, or passed under a written waiver
//   1  refused, with the reasons printed
//   2  the invocation was wrong
//   3  verdict withheld, because the check could not be run at all
//
// Exit 3 exists because the alternative is worse. A gate with no browser that prints a
// pass has told the report a render was inspected when none was. Matches the exit policy
// of tools/context-budget.mjs: an unmeasurable budget fails rather than reporting clean.

import { readFile, writeFile, appendFile, mkdir, rename } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { createHash, randomBytes } from 'node:crypto'
import { homedir } from 'node:os'
import { join, dirname, resolve, isAbsolute } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'

export const DEFAULT_LEDGER = join(homedir(), '.sitesmith', 'renders.jsonl')

/* ── the direction record ──────────────────────────────────────────────── */

// The order is run.md step 2's field list, with the runner-up block inserted where it is
// argued. Every one of these must carry text. A blank heading is the failure this list
// exists to catch, because a record with blank headings still looks filled in a diff.
export const REQUIRED = [
  'Surface',
  'Subject',
  'Constraints in force',
  'Assets that exist',
  'Nouns',
  'Theses',
  'Case for the runner-up',
  'Built',
  'Colour',
  'Type',
  'Density, motion and boldness',
  'Structure',
  'First screen',
  'Imagery treatment',
  'Argument order',
  'Signature',
  'Risk',
  'Assumptions',
  'Originality pass',
]

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9æøå]+/g, ' ').trim()

const STOPWORDS = new Set(('a an and are as at be because but by for from has have in into is it its of on or '
  + 'that the their them they this to was were what which who will with would you your it s not no').split(' '))

const contentWords = (text) => new Set(
  String(text).toLowerCase().match(/[a-zæøå0-9]{3,}/g)?.filter((w) => !STOPWORDS.has(w)) ?? [],
)

function jaccard(a, b) {
  if (!a.size || !b.size) return 0
  let shared = 0
  for (const w of a) if (b.has(w)) shared++
  return shared / (a.size + b.size - shared)
}

export function parseDirection(md) {
  const text = String(md).replace(/\r\n/g, '\n')
  const sections = new Map()
  let current = null
  for (const line of text.split('\n')) {
    const heading = line.match(/^\s{0,3}#{1,6}\s+(.+?)\s*$/)
    if (heading) {
      current = norm(heading[1])
      if (!sections.has(current)) sections.set(current, [])
      continue
    }
    if (current) sections.get(current).push(line)
  }

  const body = (name) => (sections.get(norm(name)) ?? [])
    .filter((l) => !/^\s*(<!--|>\s*format:)/.test(l))
    .join('\n').trim()

  const theses = []
  for (const line of body('Theses').split('\n')) {
    const m = line.match(/^\s*(\d+)[.)]\s+(\S.*)$/)
    if (m) theses.push({ n: Number(m[1]), text: m[2].trim() })
  }

  // Counted across the whole file, not inside the Built block. A second Built line pasted
  // somewhere else is exactly the edit that makes two theses look chosen.
  const builtLines = [...text.matchAll(/^\s*Built:\s*(.*)$/gm)].map((m) => m[1].trim())

  const runnerUpBody = body('Case for the runner-up')
  const runnerUpFor = runnerUpBody.match(/^\s*For:\s*(\d+)/m)

  const pinned = text.match(/^\s*Brief-pinned:\s*(.+)$/m)

  return {
    present: [...sections.keys()],
    body,
    theses,
    builtLines,
    built: parseBuiltLine(builtLines[0] ?? ''),
    runnerUp: {
      forThesis: runnerUpFor ? Number(runnerUpFor[1]) : null,
      argument: runnerUpBody.replace(/^\s*For:\s*\d+.*$/m, '').trim(),
    },
    briefPinned: pinned ? pinned[1].trim() : null,
  }
}

function parseBuiltLine(line) {
  if (!line) return null
  const n = line.match(/^\s*(\d+)\b/)
  const axis = line.match(/axis:\s*([^,;]+)/i)
  const reason = line.replace(/^\s*\d+\b\s*,?\s*/, '').replace(/axis:\s*[^,;]+[,;]?\s*/i, '')
    .replace(/^\s*because\s+/i, '').trim()
  return {
    thesis: n ? Number(n[1]) : null,
    axis: axis ? axis[1].trim() : null,
    reason,
    raw: line,
  }
}

export function directionProblems(record) {
  const problems = []

  for (const name of REQUIRED) {
    if (!record.present.includes(norm(name))) problems.push(`the record has no "${name}" section`)
    else if (!record.body(name)) problems.push(`"${name}" is a blank heading`)
  }

  // Three is the floor because one thesis is a reflex and two is a coin toss. The ledger
  // has no opinion about which of them is right; it only refuses a record that never had
  // anything to choose between.
  if (record.theses.length < 3) {
    problems.push(`only ${record.theses.length} thesis/theses are written down, and the record needs at least three`)
  }
  const order = record.theses.map((t) => t.n)
  if (order.some((n, i) => n !== i + 1)) {
    problems.push(`the theses are numbered ${order.join(', ')} and must run 1 to ${order.length} in the order they were written`)
  }

  if (record.builtLines.length === 0) problems.push('there is no "Built:" line, so no thesis was marked built')
  if (record.builtLines.length > 1) {
    problems.push(`${record.builtLines.length} "Built:" lines are present and exactly one thesis may be marked built`)
  }

  const built = record.built
  if (built) {
    if (built.thesis === null) problems.push('the "Built:" line names no thesis number')
    else if (record.theses.length && !record.theses.some((t) => t.n === built.thesis)) {
      problems.push(`the "Built:" line names thesis ${built.thesis}, which is not in the list`)
    }
    if (!built.axis) problems.push('the "Built:" line names no axis')
    if (contentWords(built.reason).size < 3) problems.push('the "Built:" line has an empty reason clause')
  }

  // The anti-argmax check. A model asked to pick the best idea from its own list picks its
  // own top rank almost every time, so the only evidence that the ranking was judgement is
  // a case argued for something else. An absent block is the common failure; a block that
  // paraphrases the winning reason is the interesting one.
  const ru = record.runnerUp
  if (!ru.forThesis || !ru.argument) {
    problems.push('runner-up was never argued: the "Case for the runner-up" block needs "For: <thesis number>" and an argument')
  } else {
    if (built?.thesis !== null && ru.forThesis === built?.thesis) {
      problems.push(`runner-up was never argued: the case is made for thesis ${ru.forThesis}, which is the one marked built`)
    }
    if (record.theses.length && !record.theses.some((t) => t.n === ru.forThesis)) {
      problems.push(`runner-up was never argued: thesis ${ru.forThesis} is not in the list`)
    }
    const sentences = ru.argument.split(/[.!?](?:\s|$)/).map((s) => s.trim()).filter(Boolean)
    if (sentences.length < 2) {
      problems.push(`runner-up was never argued: the case runs to ${sentences.length} sentence(s) and needs at least two`)
    }
    if (built && jaccard(contentWords(ru.argument), contentWords(built.reason)) >= 0.5) {
      problems.push('runner-up was never argued: the case restates the chosen thesis\'s reason in other words')
    }
  }

  // Named entries, not prose, because a colour block with one line and a type block with
  // one line is what a record looks like when the decisions were never separated out.
  const named = (name) => (record.body(name).match(/^\s*[-*]?\s*(--)?[\wæøå][\wæøå -]*:/gm) ?? []).length
  if (named('Colour') < 2) problems.push('the "Colour" section names fewer than two values, written as "name: what it is for"')
  if (named('Type') < 2) problems.push('the "Type" section names fewer than two roles, written as "role: face and how it is used"')

  return problems
}

/* ── the render fingerprint ────────────────────────────────────────────── */

export function groundBand(lum) {
  if (lum < 0.2) return 'dark'
  if (lum < 0.45) return 'mid-dark'
  if (lum < 0.7) return 'mid'
  return 'light'
}

export function imageryBand(sharePercent) {
  if (sharePercent < 2) return 'imageless'
  if (sharePercent < 8) return 'incidental'
  if (sharePercent < 20) return 'supporting'
  return 'dominant'
}

export function displayClass(family) {
  const f = String(family).toLowerCase()
  if (/mono/.test(f)) return 'mono'
  if (/(georgia|palatino|iowan|optima|garamond|times|book antiqua|serif)/.test(f) && !/sans/.test(f)) return 'serif'
  if (/(narrow|condensed)/.test(f)) return 'condensed'
  if (/^(ui-sans-serif|system-ui|-apple-system|segoe|roboto|arial|helvetica)/.test(f)) return 'system-sans'
  return 'sans'
}

// Blunt on purpose. Each device is a thing a reader would notice as a habit if they saw it
// twice, and the thresholds are the ones the v2 ledger settled on after the round-8 sites
// each passed their own review and still read as one house.
export function devicesOf(raw = {}) {
  const d = new Set()
  if (Number(raw.monoCaps) >= 4) d.add('mono-uppercase-labels')
  if (Number(raw.hairlines) >= 20) d.add('hairline-separators')
  if (Number(raw.strokeOnlySvgs) >= 1 && Number(raw.rasterImages) === 0) d.add('line-only-imagery')
  if (displayClass(raw.displayFamily) === 'system-sans') d.add('system-display')
  if (Number(raw.tabularNums) >= 3) d.add('tabular-figure-motif')
  if (Number(raw.shadowed) === 0) d.add('flat-surfaces')
  if (Number(raw.cards) >= 3) d.add('rounded-card-grid')
  return [...d].sort()
}

export function fingerprintOf(raw = {}) {
  return {
    ground: groundBand(Number(raw.luminance)),
    display: displayClass(raw.displayFamily),
    imagery: imageryBand(Number(raw.assetShare)),
    devices: devicesOf(raw),
  }
}

export const fingerprintKey = (f) => [f.ground, f.display, f.imagery, f.devices.join('+') || 'none'].join('|')

// One recipe, hard-coded, and it is not a style anyone should be talked out of in general.
// It is the specific combination three unrelated SiteSmith briefs converged on in round 8:
// every page passed its own review and the portfolio failed on sameness. It is here rather
// than in the ledger file because the ledger on a fresh machine is empty, and a gate that
// passes everything on a clean install is decoration.
export const SEED_RECIPE = {
  name: 'the flat technical-editorial recipe that three unrelated round-8 briefs converged on',
  devices: ['mono-uppercase-labels', 'hairline-separators', 'tabular-figure-motif', 'flat-surfaces'],
}

/* ── the ledger file ───────────────────────────────────────────────────── */

export async function readLedger(path) {
  let raw
  try {
    raw = await readFile(path, 'utf8')
  } catch (error) {
    if (error?.code === 'ENOENT') return []
    throw error
  }
  return raw.split('\n').filter((l) => l.trim()).map((line, i) => {
    try {
      return JSON.parse(line)
    } catch {
      // Fail closed. A ledger that half-parses silently forgets the entries after the bad
      // line, and a forgetful anti-repeat gate is worse than none: it says new when it does
      // not know.
      const err = new Error(`${path}:${i + 1} is not valid JSON, so the ledger cannot be trusted`)
      err.withheld = true
      throw err
    }
  })
}

// The ledger stores no URL, no client name and no path. It needs one thing beyond that: a
// way to tell this surface's own earlier entry apart from someone else's, or the second run
// of a project vetoes itself and people learn to skip the gate. The compromise is a digest
// of the absolute directory under a random per-ledger salt. It compares equal to itself and
// reverses to nothing without the salt, which never leaves this machine.
async function surfaceId(dir, ledgerPath) {
  const saltPath = `${ledgerPath}.salt`
  let salt
  try {
    salt = (await readFile(saltPath, 'utf8')).trim()
  } catch {
    salt = randomBytes(16).toString('hex')
    await mkdir(dirname(saltPath), { recursive: true })
    await writeFile(saltPath, `${salt}\n`, { flag: 'wx' }).catch(async () => {
      salt = (await readFile(saltPath, 'utf8')).trim()
    })
  }
  return createHash('sha256').update(`${salt}:${resolve(dir)}`).digest('hex').slice(0, 16)
}

/* ── the veto ──────────────────────────────────────────────────────────── */

export function judge({ fingerprint, ledger, selfId }) {
  const vetoes = []
  const key = fingerprintKey(fingerprint)
  const mine = new Set(fingerprint.devices)

  if (SEED_RECIPE.devices.every((name) => mine.has(name))) {
    vetoes.push(`this render is ${SEED_RECIPE.name}: ${SEED_RECIPE.devices.join(', ')}`)
  }

  const others = ledger.filter((entry) => !selfId || entry.id !== selfId)

  for (const entry of others) {
    if (fingerprintKey({ devices: [], ...entry.fingerprint }) === key) {
      vetoes.push(`a record from ${entry.when} has the same fingerprint: ${key}`)
    }
  }

  for (const entry of others) {
    const theirs = new Set(entry.fingerprint?.devices ?? [])
    if (fingerprintKey({ devices: [], ...entry.fingerprint }) === key) continue
    const shared = [...mine].filter((name) => theirs.has(name))
    if (shared.length >= 4) {
      vetoes.push(`${shared.length} devices are shared with a record from ${entry.when}: ${shared.join(', ')}`)
    }
  }

  return vetoes
}

/* ── measuring a built page ────────────────────────────────────────────── */

const requireFromCwd = createRequire(join(process.cwd(), 'package.json'))
async function loadPlaywright() {
  try {
    return await import('playwright')
  } catch {
    return await import(pathToFileURL(requireFromCwd.resolve('playwright')).href)
  }
}

export async function measure(target) {
  const url = /^[a-z]+:\/\//i.test(target) ? target : pathToFileURL(resolve(target)).href
  const pw = await loadPlaywright()
  const chromium = pw.chromium ?? pw.default?.chromium
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  try {
    await page.goto(url, { waitUntil: 'networkidle' })
    return await page.evaluate(() => {
      const W = 1440
      const H = 900
      const lum = (s) => {
        const [r, g, b] = (s.match(/\d+/g) ?? [255, 255, 255]).map(Number).map((v) => {
          const x = v / 255
          return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
        })
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
      }
      const area = (r) => Math.max(0, Math.min(r.bottom, H) - Math.max(r.top, 0))
        * Math.max(0, Math.min(r.right, W) - Math.max(r.left, 0))
      const bodyStyle = getComputedStyle(document.body)
      const all = [...document.querySelectorAll('body *')]
      const h1 = document.querySelector('h1')
      const assets = [...document.querySelectorAll('img, picture, svg:not([aria-hidden="true"]), video')]
      const strokeOnlySvgs = [...document.querySelectorAll('svg:not([aria-hidden="true"])')].filter((svg) => {
        const kids = [...svg.querySelectorAll('*')]
        return kids.length > 0 && kids.every((kid) => {
          const s = getComputedStyle(kid)
          return s.fill === 'none' || s.fill === 'rgba(0, 0, 0, 0)' || parseFloat(s.fillOpacity) < 0.4
        })
      }).length
      return {
        luminance: Number(lum(bodyStyle.backgroundColor).toFixed(3)),
        displayFamily: (h1 ? getComputedStyle(h1).fontFamily : bodyStyle.fontFamily)
          .split(',')[0].replace(/["']/g, '').trim(),
        assetShare: Number((assets.reduce((a, el) => a + area(el.getBoundingClientRect()), 0) / (W * H) * 100).toFixed(2)),
        rasterImages: document.querySelectorAll('img[src]:not([src$=".svg"]), picture, video').length,
        strokeOnlySvgs,
        monoCaps: all.filter((el) => {
          const s = getComputedStyle(el)
          return /mono/i.test(s.fontFamily) && s.textTransform === 'uppercase' && el.textContent.trim()
        }).length,
        hairlines: all.reduce((n, el) => {
          const s = getComputedStyle(el)
          return n + ['Top', 'Bottom', 'Left', 'Right'].filter((side) => {
            const w = parseFloat(s[`border${side}Width`])
            return w > 0 && w <= 1.5
          }).length
        }, 0),
        tabularNums: all.filter((el) => /tabular-nums/.test(getComputedStyle(el).fontVariantNumeric)).length,
        shadowed: all.filter((el) => getComputedStyle(el).boxShadow !== 'none').length,
        cards: all.filter((el) => {
          const s = getComputedStyle(el)
          return parseFloat(s.borderTopLeftRadius) >= 4
            && (s.backgroundColor !== 'rgba(0, 0, 0, 0)' || s.boxShadow !== 'none')
            && el.getBoundingClientRect().height > 60
        }).length,
      }
    })
  } finally {
    await browser.close()
  }
}

/* ── the record template ───────────────────────────────────────────────── */

// An explicit allowlist rather than a deny list, because the argument reaches a filename.
// Danish letters stay: transliterating them to ae, oe and aa is banned in this codebase.
export const slugify = (s) => String(s).toLowerCase().normalize('NFC')
  .replace(/[^a-z0-9æøå]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'surface'

export function template(surface) {
  const out = ['# Direction record', '']
  for (const name of REQUIRED) {
    out.push(`## ${name}`, '')
    if (name === 'Surface') out.push(surface, '')
    if (name === 'Theses') out.push('1.', '2.', '3.', '')
    if (name === 'Case for the runner-up') out.push('For:', '')
    if (name === 'Built') out.push('Built: <thesis number>, axis: <the axis>, because <reason in this subject\'s terms>', '')
  }
  return `${out.join('\n').trimEnd()}\n`
}

/* ── CLI ───────────────────────────────────────────────────────────────── */

const invokedDirectly = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url
if (!invokedDirectly) { /* imported for its parts; nothing runs */ } else {
  const argv = process.argv.slice(2)
  const flag = (name) => {
    const i = argv.indexOf(name)
    return i >= 0 ? argv[i + 1] : null
  }
  const has = (name) => argv.includes(name)
  const positional = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && argv[i - 1].startsWith('--') && flag(argv[i - 1]) === a))

  const verb = positional[0]
  const usage = 'usage: ledger.mjs <new|parse|measure|check|commit> ... (see the header of this file)'

  const die = (code, lines) => {
    for (const l of [].concat(lines)) console.error(l)
    process.exit(code)
  }

  const withheld = (why) => {
    console.log(`verdict: withheld, because ${why}`)
    console.log('no pass is reported for a check that did not run. Record this in the run notes.')
    process.exit(3)
  }

  const dirOf = (i) => {
    const d = positional[i]
    if (!d) die(2, usage)
    return isAbsolute(d) ? d : resolve(process.cwd(), d)
  }

  const readDirection = async (dir) => {
    const path = join(dir, '.sitesmith', 'direction.md')
    if (!existsSync(path)) withheld(`there is no direction record at ${path}`)
    return { path, record: parseDirection(await readFile(path, 'utf8')) }
  }

  const obtainRaw = async (dir) => {
    const fromFile = flag('--measurement')
    if (fromFile) {
      if (!existsSync(fromFile)) withheld(`the measurement file ${fromFile} does not exist`)
      const parsed = JSON.parse(await readFile(fromFile, 'utf8'))
      // Said as read, never as measured. A report may not claim a render that this run did
      // not perform, and the word is the only thing carrying that distinction.
      return { raw: parsed.raw ?? parsed, source: `read from ${fromFile}` }
    }
    const page = flag('--page') ?? join(dir, 'index.html')
    if (!/^[a-z]+:\/\//i.test(page) && !existsSync(page)) withheld(`there is no built page at ${page}`)
    try {
      return { raw: await measure(page), source: `rendered ${page} at 1440x900` }
    } catch (error) {
      withheld(`the page could not be rendered here: ${error.message.split('\n')[0]}`)
    }
    return null
  }

  if (verb === 'new') {
    const dir = dirOf(1)
    const surface = positional.slice(2).join(' ').trim()
    if (!surface) die(2, 'usage: ledger.mjs new <dir> <surface> [--force]')
    const path = join(dir, '.sitesmith', 'direction.md')
    if (existsSync(path) && !has('--force')) {
      console.log(`skipped_exists ${path}`)
      console.log('nothing was written. The first run\'s decisions are still there. Pass --force to replace them.')
      process.exit(0)
    }
    if (existsSync(path)) {
      const previous = parseDirection(await readFile(path, 'utf8'))
      const filled = REQUIRED.filter((n) => previous.body(n)).length
      const kept = join(dir, '.sitesmith', `direction.replaced-${slugify(surface)}-${Date.now()}.md`)
      await rename(path, kept)
      console.log(`replaced a record with ${filled} of ${REQUIRED.length} headings filled; the old one is at ${kept}`)
    }
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, template(surface))
    console.log(`wrote ${path} with ${REQUIRED.length} empty headings. Fill every one of them before any code.`)
    process.exit(0)
  }

  if (verb === 'parse') {
    const dir = dirOf(1)
    const { path, record } = await readDirection(dir)
    const problems = directionProblems(record)
    if (has('--json')) {
      console.log(JSON.stringify({
        path,
        verdict: problems.length ? 'refused' : 'complete',
        theses: record.theses,
        built: record.built,
        runnerUp: record.runnerUp,
        problems,
      }, null, 2))
      process.exit(problems.length ? 1 : 0)
    }
    console.log(`record:   ${path}`)
    if (problems.length) {
      console.log(`verdict:  refused, ${problems.length} problem(s)\n`)
      for (const p of problems) console.log(`  FAIL  ${p}`)
      console.log('\nthe ledger has no opinion about which thesis is right. It refuses a record that is not finished.')
      process.exit(1)
    }
    console.log('verdict:  complete\n')
    console.log('echo this block into PRODUCTION-REPORT.md:\n')
    for (const t of record.theses) console.log(`  thesis ${t.n}: ${t.text}`)
    console.log(`  built: thesis ${record.built.thesis} on the axis of ${record.built.axis}`)
    console.log(`  reason: ${record.built.reason}`)
    console.log(`  runner-up argued: thesis ${record.runnerUp.forThesis}`)
    console.log(`  signature: ${record.body('Signature').split('\n')[0]}`)
    console.log(`  risk: ${record.body('Risk').split('\n')[0]}`)
    console.log(`  originality pass: ${record.body('Originality pass').split('\n')[0]}`)
    process.exit(0)
  }

  if (verb === 'measure') {
    const page = positional[1]
    if (!page) die(2, 'usage: ledger.mjs measure <page-or-url> [--out file]')
    let raw
    try {
      raw = await measure(page)
    } catch (error) {
      withheld(`the page could not be rendered here: ${error.message.split('\n')[0]}`)
    }
    const out = { measuredAt: new Date().toISOString(), page, raw }
    if (flag('--out')) {
      await mkdir(dirname(resolve(flag('--out'))), { recursive: true })
      await writeFile(flag('--out'), `${JSON.stringify(out, null, 2)}\n`)
      console.log(`wrote ${flag('--out')}`)
    } else {
      console.log(JSON.stringify(out, null, 2))
    }
    process.exit(0)
  }

  if (verb === 'check' || verb === 'commit') {
    const dir = dirOf(1)
    const ledgerPath = flag('--ledger') ?? DEFAULT_LEDGER
    const { path: recordPath, record } = await readDirection(dir)

    // A render veto against an unfinished record means nothing, so completeness is settled
    // first and never waived: an empty heading is not a design choice the brief can pin.
    const recordProblems = directionProblems(record)

    const { raw, source } = await obtainRaw(dir)
    const fingerprint = fingerprintOf(raw)

    let ledger
    try {
      ledger = await readLedger(ledgerPath)
    } catch (error) {
      withheld(error.message)
    }

    const selfId = await surfaceId(dir, ledgerPath).catch(() => null)
    const vetoes = judge({ fingerprint, ledger, selfId })

    console.log(`record:      ${recordPath}`)
    console.log(`measurement: ${source}`)
    console.log(`fingerprint: ${fingerprintKey(fingerprint)}`)
    console.log(`  ground     ${fingerprint.ground} (relative luminance ${raw.luminance})`)
    console.log(`  display    ${fingerprint.display}`)
    console.log(`  imagery    ${fingerprint.imagery} (${raw.assetShare}% of the first screen)`)
    console.log(`  devices    ${fingerprint.devices.join(', ') || 'none measured'}`)
    console.log(`ledger:      ${ledger.length} record(s) at ${ledgerPath}${existsSync(ledgerPath) ? '' : ' (absent, and the seed recipe still applies)'}`)
    console.log('')

    for (const p of recordProblems) console.log(`  FAIL  ${p}`)
    for (const v of vetoes) console.log(`  VETO  ${v}`)

    // The waiver reaches the render vetoes only. It exists because the brief's own words
    // outrank everything, including this gate, and it is deliberately expensive: a quote,
    // verbatim, printed into the report where a reader can check it.
    let waiver = null
    if (vetoes.length && record.briefPinned) {
      const quoted = record.briefPinned.match(/["“”'](.{10,}?)["“”']/)
      if (!quoted) {
        console.log('\n  FAIL  Brief-pinned needs the brief\'s own words in quotes, at least ten characters')
        recordProblems.push('Brief-pinned carries no quote')
      } else {
        waiver = quoted[1]
      }
    }

    if (recordProblems.length) {
      console.log(`\nverdict: refused, the direction record is not complete. Run parse for the full list.`)
      process.exit(1)
    }

    if (vetoes.length && !waiver) {
      console.log(`\nverdict: refused, ${vetoes.length} veto(es).`)
      console.log('the ledger names what repeats and stops there. What to build instead is not its decision.')
      process.exit(1)
    }

    if (waiver) {
      console.log('\nWAIVED. Copy this block into PRODUCTION-REPORT.md verbatim:\n')
      console.log(`  Anti-repeat veto waived on ${new Date().toISOString().slice(0, 10)}.`)
      for (const v of vetoes) console.log(`    waived: ${v}`)
      console.log(`  Brief-pinned: "${waiver}"`)
      console.log('  The ledger cannot check this quote against the brief. A reader must.')
    }

    if (verb === 'check') {
      console.log(`\nverdict: ${waiver ? 'passed under the waiver above' : 'passed, this shape is not in the ledger'}`)
      process.exit(0)
    }

    const entry = {
      v: 1,
      when: new Date().toISOString().slice(0, 10),
      id: selfId,
      fingerprint,
      waived: Boolean(waiver),
    }
    const already = ledger.some((e) => e.id === entry.id
      && fingerprintKey({ devices: [], ...e.fingerprint }) === fingerprintKey(fingerprint))
    if (already) {
      console.log(`\nskipped_exists ${ledgerPath}`)
      console.log('this shape is already recorded for this surface. Nothing was appended.')
      process.exit(0)
    }
    await mkdir(dirname(ledgerPath), { recursive: true })
    await appendFile(ledgerPath, `${JSON.stringify(entry)}\n`)
    console.log(`\nrecorded in ${ledgerPath}: fingerprint and date only, no name, no path, no URL`)
    process.exit(0)
  }

  die(2, usage)
}
