#!/usr/bin/env node
/**
 * assign.mjs — external assignment of a direction. LAB ONLY.
 *
 * SiteSmith's §4 says never build your first thesis, and ledger.mjs checks that a runner-up
 * was argued. Neither stops the model choosing its own favourite and writing a fluent case
 * for the one it was going to build anyway. This script takes the choice away: the model
 * proposes and validates, a hash assigns.
 *
 * Two things separate it from a hash over a list.
 *
 * The hash draws from the *viable* set, never the whole list. Viability is truth, task fit
 * and feasibility, judged per candidate and written down BEFORE the key is drawn, so a
 * selector can never land on a direction that lies about the subject or cannot be built.
 * Order matters and is enforced: `validate` refuses once an assignment exists.
 *
 * The default is excluded by name, not by position. §5 already makes the model describe the
 * page it would produce on autopilot; a candidate the model itself marks as that page is out
 * of the draw. Excluding index 0 and 1 would only move the default down the list.
 *
 * Not wired into any command. `SITESMITH_LAB=1` or `--lab` is required, and the exit code
 * follows the declared contract: 0 done, 1 measured defect, 2 usage, 3 not ready.
 *
 * ponytail: the viability verdicts are the model's own, unaudited. A verdict that says
 * "truth: yes" about an invented fact assigns a lie. The gate that would catch it is
 * gate.mjs's honesty class, downstream, on the built page.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { createHash, randomBytes } from 'node:crypto'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseDirection } from './ledger.mjs'

const MIN_CANDIDATES = 5
const MAX_CANDIDATES = 7
const MAX_REROLLS = 2

/* Words that name a preference rather than a defect. Impeccable states the same rule in
   prose and never reads it back; this refuses on it. The list is short on purpose: a
   reason has to fail on what it says, not on a word it happens to contain, so each entry
   is matched as a whole word and a reason that also names something concrete passes. */
const TASTE = ['ugly', 'boring', 'bland', 'dull', 'nicer', 'prettier', 'cleaner', 'prefer',
  'preferred', 'like', 'dislike', 'love', 'hate', 'feel', 'feels', 'vibe', 'meh', 'weak']

const norm = (s) => String(s).toLowerCase().replace(/\s+/g, ' ').trim()

export function candidateHash(theses) {
  return createHash('sha256').update(theses.map((t) => `${t.n}:${norm(t.text)}`).join('\n'), 'utf8').digest('hex')
}

/* One 32-bit draw, same shape as the digest read everywhere else in this package. The
   divisor is 0x100000000 rather than 0xffffffff so an all-ones digest cannot round up to
   an index past the end of the pool. */
export function draw(key, listHash, reroll) {
  const d = createHash('sha256').update(`${key}:${listHash}:reroll-${reroll}`, 'utf8').digest()
  return d.readUInt32BE(0) / 0x100000000
}

export function parseViability(md) {
  const out = new Map()
  const section = md.split(/^##+\s*viability\s*$/im)[1]
  if (!section) return out
  for (const line of section.split('\n')) {
    if (/^##+\s/.test(line)) break
    const m = line.match(/^\s*(\d+)[.)]\s+(.*)$/)
    if (!m) continue
    const body = m[2]
    const field = (name) => {
      const f = body.match(new RegExp(`\\b${name}\\s*:\\s*([^|]+)`, 'i'))
      return f ? f[1].trim() : null
    }
    const yes = (v) => v !== null && /^(yes|ja)\b/i.test(v)
    const truth = field('truth'); const task = field('task'); const feasible = field('feasible')
    const autopilot = field('autopilot')
    out.set(Number(m[1]), {
      truth, task, feasible, autopilot,
      viable: yes(truth) && yes(task) && yes(feasible),
      isAutopilot: autopilot !== null && /^(yes|ja)\b/i.test(autopilot),
      missing: [['truth', truth], ['task', task], ['feasible', feasible], ['autopilot', autopilot]]
        .filter(([, v]) => v === null).map(([k]) => k),
    })
  }
  return out
}

function load(dir) {
  const path = join(dir, '.sitesmith', 'direction.md')
  if (!existsSync(path)) return { problems: [`no direction record at ${path}`] }
  const md = readFileSync(path, 'utf8')
  const record = parseDirection(md)
  const viability = parseViability(md)
  const problems = []

  if (record.theses.length < MIN_CANDIDATES) {
    problems.push(`${record.theses.length} theses; lab assignment needs ${MIN_CANDIDATES} to ${MAX_CANDIDATES}. `
      + 'Three is enough to argue a runner-up and too few to assign one: with three, excluding the '
      + 'autopilot and one unviable candidate leaves a draw with a single outcome.')
  }
  if (record.theses.length > MAX_CANDIDATES) {
    problems.push(`${record.theses.length} theses; lab assignment takes at most ${MAX_CANDIDATES}. `
      + 'Past seven the list stops being a set of considered directions and becomes a spread '
      + 'that makes any assignment defensible.')
  }
  const ns = record.theses.map((t) => t.n)
  if (new Set(ns).size !== ns.length) problems.push(`thesis numbers repeat: ${ns.join(', ')}`)

  for (const t of record.theses) {
    const v = viability.get(t.n)
    if (!v) { problems.push(`thesis ${t.n} has no Viability line`); continue }
    if (v.missing.length) problems.push(`thesis ${t.n} Viability is missing ${v.missing.join(', ')}`)
  }
  const marked = record.theses.filter((t) => viability.get(t.n)?.isAutopilot)
  if (viability.size && !marked.length) {
    problems.push('no candidate is marked autopilot: yes. Section 5 asks for the page you would '
      + 'produce if you were not trying, so one of these is it, or it is missing from the list '
      + 'and should be added as a candidate and marked.')
  }
  return { path, md, record, viability, problems }
}

function pool(record, viability) {
  return record.theses.map((t) => {
    const v = viability.get(t.n) ?? {}
    const out = []
    if (!v.viable) out.push('not viable')
    if (v.isAutopilot) out.push('autopilot')
    return { ...t, viable: !!v.viable, isAutopilot: !!v.isAutopilot, excluded: out }
  })
}

function tasteWords(reason) {
  const words = new Set(norm(reason).replace(/[^a-zæøå ]/g, ' ').split(/\s+/))
  return TASTE.filter((w) => words.has(w))
}

const assignmentPath = (dir) => join(dir, '.sitesmith', 'assignment.json')

function readAssignment(dir) {
  const p = assignmentPath(dir)
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null
}

function writeAssignment(dir, data) {
  mkdirSync(join(dir, '.sitesmith'), { recursive: true })
  writeFileSync(assignmentPath(dir), `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

function report(dir) {
  const { problems, record, viability } = load(dir)
  if (problems.length && !record) { for (const p of problems) console.log(`  ${p}`); return null }
  const cands = pool(record, viability)
  console.log(`candidates : ${cands.length}`)
  for (const c of cands) {
    const tag = c.excluded.length ? `EXCLUDED (${c.excluded.join(', ')})` : 'in the draw'
    console.log(`  ${c.n}. ${c.text.slice(0, 68)}${c.text.length > 68 ? '…' : ''}`)
    console.log(`     ${tag}`)
  }
  const drawable = cands.filter((c) => !c.excluded.length)
  console.log(`in the draw: ${drawable.length} of ${cands.length}`)
  if (problems.length) { console.log(''); for (const p of problems) console.log(`  ${p}`) }
  return { cands, drawable, problems, record, viability }
}

function cmdValidate(dir) {
  if (readAssignment(dir)) {
    console.log('an assignment already exists. Viability is judged before the key is drawn, or it is')
    console.log('judged knowing which candidate it would rule out, which is the thing this prevents.')
    console.log('Delete .sitesmith/assignment.json to start over, and say in the record that you did.')
    return 1
  }
  const r = report(dir)
  if (!r) return 3
  if (r.problems.length) return 1
  if (r.drawable.length < 2) {
    console.log('')
    console.log(`only ${r.drawable.length} candidate(s) left after exclusions. A draw with one outcome is`)
    console.log('not a draw. Write more directions, or say why the ones you wrote are not viable.')
    return 1
  }
  writeAssignment(dir, {
    v: 1, stage: 'validated', when: new Date().toISOString(),
    candidateCount: r.cands.length,
    candidateListHash: candidateHash(r.record.theses),
    drawable: r.drawable.map((c) => c.n),
    excluded: r.cands.filter((c) => c.excluded.length).map((c) => ({ n: c.n, because: c.excluded })),
    rerolls: [],
  })
  console.log('')
  console.log('validated. Nothing is assigned yet. Next: assign --key <hex>, or assign to draw a key.')
  return 0
}

function cmdAssign(dir, { key, because }) {
  const a = readAssignment(dir)
  if (!a) { console.log('nothing validated yet. Run: assign.mjs validate <dir>'); return 3 }
  const { record, viability, problems } = load(dir)
  if (problems.length) { for (const p of problems) console.log(`  ${p}`); return 1 }

  const listHash = candidateHash(record.theses)
  if (listHash !== a.candidateListHash) {
    console.log('the thesis list changed after it was validated.')
    console.log(`  validated : ${a.candidateListHash}`)
    console.log(`  now       : ${listHash}`)
    console.log('Editing the list after seeing an assignment is how a hash becomes a formality.')
    console.log('Run validate again, and the record should say the list was rewritten.')
    return 1
  }

  const isReroll = a.stage === 'assigned'
  if (isReroll) {
    if (!because) {
      console.log('this is a re-roll and it needs --because "<reason>".')
      console.log('A re-roll is for a candidate that cannot be built, not for one you would rather not build.')
      return 2
    }
    const taste = tasteWords(because)
    if (taste.length) {
      console.log(`the reason names taste, not a defect: ${taste.join(', ')}`)
      console.log('Say what stops this direction being built: a fact it needs and the brief does not have,')
      console.log('a control the stack cannot render, an accessibility floor it cannot meet.')
      return 1
    }
    if (a.rerolls.length >= MAX_REROLLS) {
      console.log(`${a.rerolls.length} re-rolls already; the cap is ${MAX_REROLLS}.`)
      console.log('Past two, the assignment is being shopped. Build the one you have, or write a new list')
      console.log('and validate it, which is a decision that leaves a trace.')
      return 1
    }
  }

  const runKey = key ?? randomBytes(4).toString('hex')
  if (!/^[0-9a-f]{8}$/i.test(runKey)) { console.log(`key must be 8 hex characters, got "${runKey}"`); return 2 }

  const reroll = isReroll ? a.rerolls.length + 1 : 0
  const previous = new Set(isReroll ? [a.assignedThesis, ...a.rerolls.map((r) => r.was)] : [])
  const drawable = a.drawable.filter((n) => !previous.has(n))
  if (!drawable.length) {
    console.log('every drawable candidate has been assigned and re-rolled away. There is nothing left')
    console.log('to draw. Write a new list and validate it.')
    return 1
  }

  const u = draw(runKey, listHash, reroll)
  const idx = Math.min(drawable.length - 1, Math.floor(u * drawable.length))
  const n = drawable[idx]
  const chosen = record.theses.find((t) => t.n === n)

  const next = {
    ...a, stage: 'assigned', when: new Date().toISOString(),
    runKey, reroll, assignedThesis: n, assignedIndex: idx, poolAtDraw: drawable,
    rerolls: isReroll ? [...a.rerolls, { was: a.assignedThesis, because, key: a.runKey }] : [],
  }
  writeAssignment(dir, next)

  console.log(`ASSIGNED   : thesis ${n}`)
  console.log(`             ${chosen.text}`)
  console.log('')
  console.log(`run key    : ${runKey}`)
  console.log(`list hash  : ${listHash}`)
  console.log(`candidates : ${a.candidateCount}, ${a.drawable.length} viable and not autopilot`)
  console.log(`drawn from : ${drawable.join(', ')}  (index ${idx})`)
  console.log(`re-rolls   : ${next.rerolls.length} of ${MAX_REROLLS}`)
  console.log('')
  console.log(`reproduce  : node scripts/assign.mjs assign ${dir} --key ${runKey}`)
  console.log('')
  console.log('This is the direction. Write the Built line for it, and argue the runner-up against it')
  console.log('as usual. The assignment replaces your choice, not your case.')
  return 0
}

function cmdShow(dir) {
  const a = readAssignment(dir)
  if (!a) { console.log('no assignment'); return 3 }
  console.log(JSON.stringify(a, null, 2))
  return 0
}

const USAGE = `usage: assign.mjs <validate|assign|show> <dir> [--key <8 hex>] [--because "<reason>"]

  validate   judge every candidate viable or not, before any key is drawn
  assign     draw a key and assign one viable, non-autopilot candidate
  show       print the assignment record

LAB ONLY. Set SITESMITH_LAB=1 or pass --lab. Not part of any command.`

export function main(argv) {
  const lab = process.env.SITESMITH_LAB === '1' || argv.includes('--lab')
  if (!lab) {
    console.log('assign.mjs is a lab experiment and is not part of the pipeline.')
    console.log('Set SITESMITH_LAB=1 to run it. Nothing in run.md calls it.')
    return 2
  }
  const args = argv.filter((a) => a !== '--lab')
  const cmd = args[0]
  const dir = args[1] && !args[1].startsWith('--') ? resolve(args[1]) : null
  const flag = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : null }

  if (!cmd || cmd === '--help' || cmd === '-h') { console.log(USAGE); return 2 }
  if (!dir) { console.log(USAGE); return 2 }

  if (cmd === 'validate') return cmdValidate(dir)
  if (cmd === 'assign') return cmdAssign(dir, { key: flag('key'), because: flag('because') })
  if (cmd === 'show') return cmdShow(dir)
  console.log(USAGE)
  return 2
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exit(main(process.argv.slice(2)))
}
