#!/usr/bin/env node
// A floor file says what any site of a kind must DO. The moment it says what a site must
// LOOK LIKE, it stops being a floor and becomes a house style with a compliance report
// attached — which is the measured failure this rebuild exists to fix
// (gallery/showcase.json: three briefs, one look, portfolioDiversity fail).
//
// THE FIRST VERSION OF THIS FILE DID NOT WORK, AND IT WAS PROVEN, NOT ARGUED.
// It banned CSS tokens: hex values, colour functions, typeface names, border-radius.
// An extraction agent copied skills/sitesmith/v2/modes/product-ui.md verbatim into a
// floor file and this lint returned exit 0 — on a file that says "One accent for the
// primary action", "full-round is for status dots" and "a top bar or a left rail".
// Appearance written in English is invisible to a regex over CSS syntax. And the round-8
// convergence used #0f1218 and #3dd6c6, values appearing in no v2 file at all: the sites
// converged by executing a prescribed structure written in prose.
//
// So detection is inverted. The primary check is no longer "does this text contain a
// value" but "is every obligation shown satisfied three visually unrelated ways". A rule
// that is really appearance cannot produce three unrelated renditions — "one accent for
// the primary action" already is one rendition — so the requirement finds the appearance
// that a word list cannot. The value bans stay as a cheap second line.
//
//   node tools/floor-lint.mjs <skill-dir>
//   node tools/floor-lint.mjs --self-test
//
// REQUIRED SHAPE. Every obligation is a "### " section containing prose and then a
// renditions list of at least three items introduced by a line matching /^Three ways/i.
// Nothing else is enforced about the writing.

import { readFileSync, existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'
import { spawnSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// Accessibility minima are obligations, not looks. Without this exemption the floor
// cannot state the floor.
const ALLOWED_NUMBERS = /\b(4\.5:1|3:1|44px|24px|16px|320px|48px|1\.5|55|75)\b/g

// Tier 1: a value someone could paste into a stylesheet. Cheap, exact, and by itself
// insufficient — see the header.
const VALUES = [
  { id: 'hex', re: /#[0-9a-fA-F]{3,8}\b/, says: 'a colour value' },
  { id: 'colour-fn', re: /\b(rgb|rgba|hsl|hsla|oklch|lab|color-mix)\s*\(/, says: 'a colour value' },
  { id: 'named-colour', re: /\b(cream|terracotta|charcoal|slate|navy|teal|amber|coral|sage|ivory|mint|blush|off-black|off-white)\b/i, says: 'a named colour' },
  { id: 'typeface', re: /\b(font-family|Inter|Roboto|Helvetica|Georgia|Poppins|Montserrat|Playfair|Space Grotesk|IBM Plex|Archivo|Bricolage|Atkinson)\b/, says: 'a typeface' },
  { id: 'css-prop', re: /\b(border-radius|box-shadow|drop-shadow|letter-spacing|font-size)\s*:/, says: 'a CSS declaration' },
  { id: 'gradient', re: /\b(linear|radial|conic)-gradient\b/, says: 'a gradient' },
  { id: 'pinned-dimension', re: /\b\d+(px|rem|em|vw|vh)\b|\b\d+\s*:\s*\d+\s+(crop|ratio)\b/, says: 'a pinned dimension' },
]

// Tier 2: appearance written in English. These do not fail on their own, because a floor
// legitimately names the surfaces a user operates. They are reported next to the section
// they sit in, so a reviewer can see whether the renditions under that heading are real
// alternatives or three descriptions of the same picture.
const PROSE_SIGNALS = [
  { id: 'device', re: /\b(pill|full-round|rounded corners|card|left rail|top bar|sidebar|sticky|drawer|carousel|hero section|badge|chip)\b/i },
  { id: 'accent-budget', re: /\b(one accent|the accent (appears|works|is reserved)|accent for the)\b/i },
  { id: 'type-rank', re: /\b((second|third)-largest type|largest type on the page|smallest type)\b/i },
  { id: 'density-word', re: /\b(generous|airy|tight|dense) (spacing|padding|gutters|ramp|leading)\b/i },
  { id: 'motion-character', re: /\b(fast|slow|snappy|subtle|springy) (motion|transition|ease|animation)\b/i },
]

const RENDITION_OPENER = /^\s*Three ways\b/i
const RULE_HEADING = /^###\s+(.+)$/

function lintOne(path) {
  const raw = readFileSync(path, 'utf8')
  const lines = raw.split(/\r?\n/)
  const problems = []
  const signals = []

  // Value scan, whole file, frontmatter excluded.
  let inFm = false
  lines.forEach((line, i) => {
    if (i === 0 && line.trim() === '---') return (inFm = true)
    if (inFm) {
      if (line.trim() === '---') inFm = false
      return
    }
    const text = line.replace(ALLOWED_NUMBERS, '')
    for (const v of VALUES) {
      const m = text.match(v.re)
      if (m) problems.push({ line: i + 1, kind: 'value', says: `${v.says} (${v.id})`, found: m[0] })
    }
    for (const s of PROSE_SIGNALS) {
      const m = line.match(s.re)
      if (m) signals.push({ line: i + 1, id: s.id, found: m[0] })
    }
  })

  // Section scan. Each "### " heading is an obligation and owes three renditions.
  const sections = []
  let cur = null
  lines.forEach((line, i) => {
    const h = line.match(RULE_HEADING)
    if (h) {
      if (cur) sections.push(cur)
      cur = { title: h[1].trim(), line: i + 1, renditionOpener: false, items: 0 }
      return
    }
    if (!cur) return
    if (RENDITION_OPENER.test(line)) cur.renditionOpener = true
    else if (cur.renditionOpener && /^\s*(\d+\.|[-*])\s+\S/.test(line)) cur.items++
  })
  if (cur) sections.push(cur)

  if (!sections.length) {
    problems.push({
      line: 1,
      kind: 'shape',
      says: 'no "### " obligation sections. A floor file is a list of obligations, each shown satisfied three ways.',
      found: '',
    })
  }
  for (const s of sections) {
    if (!s.renditionOpener) {
      problems.push({ line: s.line, kind: 'renditions', says: `"${s.title}" has no "Three ways" list`, found: '' })
    } else if (s.items < 3) {
      problems.push({ line: s.line, kind: 'renditions', says: `"${s.title}" lists ${s.items} rendition(s), needs 3`, found: '' })
    }
  }

  return { path, problems, signals, sections: sections.length }
}

function report(results) {
  let failed = 0
  for (const r of results) {
    const rel = relative(root, r.path).replace(/\\/g, '/')
    if (r.problems.length) {
      failed++
      console.log(`  FAIL ${rel}  (${r.sections} obligation section(s))`)
      for (const p of r.problems.slice(0, 10)) {
        console.log(`         line ${p.line}: ${p.says}${p.found ? ` — ${p.found}` : ''}`)
      }
      if (r.problems.length > 10) console.log(`         ...and ${r.problems.length - 10} more`)
    } else {
      console.log(`  ok   ${rel}  (${r.sections} obligation section(s))`)
    }
    if (r.signals.length) {
      console.log(`         ${r.signals.length} prose-appearance signal(s) — check the renditions under each are real alternatives:`)
      for (const s of r.signals.slice(0, 6)) console.log(`           line ${s.line}: ${s.id} — "${s.found}"`)
      if (r.signals.length > 6) console.log(`           ...and ${r.signals.length - 6} more`)
    }
  }
  return failed
}

if (process.argv.includes('--self-test')) {
  const FIX = 'docs/rebuild/s10/fixtures/floor'
  const CASES = [
    { dir: `${FIX}/pure`, expect: 0, why: 'obligations with three unrelated renditions each, no values' },
    { dir: `${FIX}/impure`, expect: 1, why: 'names a colour and a typeface; MUST KEEP FAILING' },
    { dir: `${FIX}/no-renditions`, expect: 1, why: 'pure prose that never shows a rule satisfied more than one way' },
    { dir: `${FIX}/regression-v2-productui`, expect: 1, why: 'v2 product-ui.md verbatim. The previous lint passed this file at exit 0. MUST KEEP FAILING — it is the proof the lint works.' },
  ]
  let bad = 0
  for (const c of CASES) {
    const r = spawnSync(process.execPath, ['tools/floor-lint.mjs', c.dir], { cwd: root, encoding: 'utf8' })
    const ok = r.status === c.expect
    if (!ok) bad++
    console.log(`${ok ? '  ok  ' : '  FAIL'} ${c.dir} -> exit ${r.status}, expected ${c.expect}\n         ${c.why}`)
  }
  console.log(bad ? `\n${bad} self-test case(s) failed` : '\nself-test: all clear')
  process.exit(bad ? 1 : 0)
}

const skillDir = process.argv[2]
if (!skillDir) {
  console.error('usage: node tools/floor-lint.mjs <skill-dir> | --self-test')
  process.exit(2)
}
const d = join(skillDir, 'floor')
const files = existsSync(d)
  ? (await readdir(d, { withFileTypes: true })).filter((e) => e.isFile() && e.name.endsWith('.md')).map((e) => join(d, e.name))
  : []
if (!files.length) {
  console.error(`no floor/*.md under ${skillDir} — nothing to lint, which is not the same as passing`)
  process.exit(1)
}
const failed = report(files.map(lintOne))
console.log(failed ? `\nfloor-lint: ${failed} file(s) failed` : '\nfloor-lint: all clear')
process.exit(failed ? 1 : 0)
