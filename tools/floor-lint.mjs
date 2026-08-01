#!/usr/bin/env node
// The floor files say what any site of a kind must DO. The moment one of them says what
// a site must LOOK LIKE, it stops being a floor and becomes a house style with a
// compliance report attached — which is the defect this whole rebuild exists to fix
// (gallery/showcase.json: three briefs, one look, portfolioDiversity fail).
//
// Two checks:
//   purity      no appearance values may appear in a floor file
//   renditions  each floor file must show three visually unrelated ways to satisfy it
//
//   node tools/floor-lint.mjs <skill-dir>
//   node tools/floor-lint.mjs --self-test
//
// Fixtures under docs/rebuild/s10/fixtures/floor/ pin the expected verdict. The impure
// fixture must keep failing; a green impure fixture means the lint stopped working.

import { readFileSync, existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'
import { spawnSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// Appearance is a value someone could copy into a stylesheet. Structure and behaviour
// are not. Numbers that are accessibility minima are explicitly allowed, because a floor
// that cannot say 44px cannot state the floor.
const BANNED = [
  { id: 'hex', re: /#[0-9a-fA-F]{3,8}\b/g, says: 'a colour value' },
  { id: 'colour-fn', re: /\b(rgb|rgba|hsl|hsla|oklch|lab|color-mix)\s*\(/g, says: 'a colour value' },
  { id: 'named-colour', re: /\b(cream|terracotta|charcoal|slate|navy|teal|amber|coral|sage|ivory|mint|blush)\b/gi, says: 'a named colour' },
  { id: 'font-family', re: /\b(font-family|Inter|Roboto|Helvetica|Georgia|Poppins|Montserrat|Playfair|Space Grotesk|IBM Plex|Archivo)\b/g, says: 'a typeface' },
  { id: 'radius', re: /\bborder-radius\b|\bradius:\s*\d/g, says: 'a corner radius' },
  { id: 'shadow', re: /\bbox-shadow\b|\bdrop-shadow\b/g, says: 'a shadow' },
  { id: 'type-scale', re: /\bfont-size\s*:|\bletter-spacing\b|\bline-height\s*:\s*\d/g, says: 'a type scale' },
  { id: 'gradient', re: /\b(linear|radial|conic)-gradient\b/g, says: 'a gradient' },
]

// Accessibility minima are obligations, not looks. Without this the lint would forbid
// the floor from stating the floor.
const ALLOWED_NUMBERS = /\b(4\.5:1|3:1|44px|24px|16px|320px|48px|1\.5)\b/g

const RENDITION_HINT = /three (visually )?(unrelated|different|distinct) (ways|renditions)|^###\s+Three ways/im

async function floorFiles(skillDir) {
  const out = []
  for (const sub of ['floor']) {
    const d = join(skillDir, sub)
    if (!existsSync(d)) continue
    for (const e of await readdir(d, { withFileTypes: true })) {
      if (e.isFile() && e.name.endsWith('.md')) out.push(join(d, e.name))
    }
  }
  return out
}

function lintOne(path) {
  const raw = readFileSync(path, 'utf8')
  // Fenced code and inline code are where a floor legitimately shows an example of
  // markup or an ARIA attribute. Appearance is still banned there, so only the
  // rendition prose is exempted — nothing is stripped before the purity scan.
  const problems = []
  const lines = raw.split(/\r?\n/)

  lines.forEach((line, i) => {
    const withoutAllowed = line.replace(ALLOWED_NUMBERS, '')
    for (const b of BANNED) {
      b.re.lastIndex = 0
      const m = withoutAllowed.match(b.re)
      if (m) problems.push({ line: i + 1, id: b.id, says: b.says, found: [...new Set(m)].slice(0, 3).join(', ') })
    }
  })

  const hasRenditions = RENDITION_HINT.test(raw)
  return { path, problems, hasRenditions }
}

function report(results, label) {
  let failed = 0
  for (const r of results) {
    const rel = relative(root, r.path).replace(/\\/g, '/')
    if (r.problems.length) {
      failed++
      console.log(`  FAIL ${rel}`)
      for (const p of r.problems.slice(0, 8)) {
        console.log(`         line ${p.line}: ${p.says} (${p.id}) — ${p.found}`)
      }
      if (r.problems.length > 8) console.log(`         ...and ${r.problems.length - 8} more`)
    } else if (!r.hasRenditions) {
      failed++
      console.log(`  FAIL ${rel}`)
      console.log(`         no rendition section. A floor rule must be shown satisfied three visually unrelated ways,`)
      console.log(`         or nobody can tell it apart from a house style.`)
    } else {
      console.log(`  ok   ${rel}`)
    }
  }
  console.log(failed ? `\n${label}: ${failed} file(s) failed` : `\n${label}: all clear`)
  return failed
}

if (process.argv.includes('--self-test')) {
  const FIX = 'docs/rebuild/s10/fixtures/floor'
  const CASES = [
    { dir: `${FIX}/pure`, expect: 0, why: 'states obligations, shows three renditions, names no appearance value' },
    { dir: `${FIX}/impure`, expect: 1, why: 'names a colour and a typeface; MUST KEEP FAILING' },
    { dir: `${FIX}/no-renditions`, expect: 1, why: 'pure but never shows the rule satisfied more than one way' },
  ]
  let bad = 0
  for (const c of CASES) {
    const r = spawnSync(process.execPath, ['tools/floor-lint.mjs', c.dir], { cwd: root, encoding: 'utf8' })
    const ok = r.status === c.expect
    if (!ok) bad++
    console.log(`${ok ? '  ok  ' : '  FAIL'} ${c.dir} -> exit ${r.status}, expected ${c.expect}  (${c.why})`)
  }
  console.log(bad ? `\n${bad} self-test case(s) failed` : '\nself-test: all clear')
  process.exit(bad ? 1 : 0)
}

const skillDir = process.argv[2]
if (!skillDir) {
  console.error('usage: node tools/floor-lint.mjs <skill-dir> | --self-test')
  process.exit(2)
}
const files = await floorFiles(skillDir)
if (!files.length) {
  console.error(`no floor/*.md under ${skillDir} — nothing to lint, which is not the same as passing`)
  process.exit(1)
}
process.exit(report(files.map(lintOne), 'floor-lint') ? 1 : 0)
