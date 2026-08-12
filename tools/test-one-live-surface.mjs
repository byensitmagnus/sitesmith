#!/usr/bin/env node
/**
 * One live product surface, and no second thing that looks like it. Original work, MIT.
 *
 *   node tools/test-one-live-surface.mjs
 *
 * Rendered pilot 02's treatment arm read `skills/sitesmith/`, took it for the current
 * pipeline, and deleted a finished build on that premise. It was not being careless. Three
 * things pointed there at once:
 *
 *   `skills/sitesmith/SKILL.md` declared `name: sitesmith` with the same trigger sentence as
 *   the live one, so a scanner walking `skills/` found two skills claiming the same name.
 *
 *   `CLAUDE.md` and `AGENTS.md` — the first files any agent reads in this repository — said
 *   the skill lives in `skills/sitesmith/`. That stopped being true when v3 landed.
 *
 *   `product/pipeline.json` says `packageRoot: skills/sitesmith-v3` and marks the other tree
 *   legacy, but nothing enforced the agreement between the three.
 *
 * Legacy v2 is not dead code — CI still runs its `verify.mjs` and `token-drift.mjs`, and
 * `benchmarks/package.json` has a script pointing at it — so deleting it would break twelve
 * places for a naming problem. It stays. What it may not do is *present itself* as the live
 * product.
 *
 * This file is red before that is fixed and green after, and it fails again the moment a
 * second loadable `name: sitesmith` appears anywhere under `skills/`.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))

let failed = 0
const check = (name, ok, detail = '') => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}${ok || !detail ? '' : `\n          ${detail}`}`)
  if (!ok) failed += 1
}

/** The frontmatter of a SKILL.md, as the flat key/value block it is. */
function frontmatter(path) {
  const text = readFileSync(path, 'utf8')
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return {}
  const out = {}
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/)
    if (kv) out[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '')
  }
  return out
}

const pipeline = JSON.parse(readFileSync(join(ROOT, 'product/pipeline.json'), 'utf8'))
const liveRoot = pipeline.packageRoot

console.log('\n  exactly one live SiteSmith surface\n')

check('product/pipeline.json names a package root that exists',
  typeof liveRoot === 'string' && existsSync(join(ROOT, liveRoot)),
  String(liveRoot))

/* ── every SKILL.md under skills/, and what it claims to be ─────────────── */

const roots = readdirSync(join(ROOT, 'skills'), { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => `skills/${e.name}`)
  .filter((r) => existsSync(join(ROOT, r, 'SKILL.md')))

const claiming = roots.filter((r) => frontmatter(join(ROOT, r, 'SKILL.md')).name === 'sitesmith')

check('exactly one skill root claims the product name',
  claiming.length === 1,
  claiming.length ? `claimed by: ${claiming.join(', ')}` : 'no root claims it')

check('and the one that claims it is the package root the product installs from',
  claiming.length === 1 && claiming[0] === liveRoot,
  `claimed by ${claiming.join(', ') || 'nobody'}, package root is ${liveRoot}`)

for (const r of roots.filter((x) => x !== liveRoot)) {
  const fm = frontmatter(join(ROOT, r, 'SKILL.md'))
  check(`${r} says in its own frontmatter that it is not live`,
    String(fm.legacy) === 'true',
    `legacy: ${fm.legacy ?? 'absent'} — a reader has nothing to tell it apart from the live root`)
  check(`${r} does not answer to the product's name`,
    fm.name !== 'sitesmith',
    `name: ${fm.name}`)
}

/* ── the files an agent reads before anything else ──────────────────────── */

/* Any mention of a skills root that is not the live one has to arrive with the word "legacy"
   on the same line. That is enough to stop a reader following it, and loose enough that
   history and reference material can still be written about.
   The match is anchored to the start of a path, because `.claude/skills/sitesmith` is the
   directory the product installs *into* and is correctly named that on every provider. The
   first version of this check flagged the quickstart in README.md for it. */
const otherRoots = roots.filter((r) => r !== liveRoot)
for (const doc of ['CLAUDE.md', 'AGENTS.md', 'README.md']) {
  const path = join(ROOT, doc)
  if (!existsSync(path)) continue
  const lines = readFileSync(path, 'utf8').split(/\r?\n/)
  const bad = []
  lines.forEach((line, i) => {
    for (const other of otherRoots) {
      const rx = new RegExp(`(^|[\\s\`'"(\\[])${other.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`)
      /* A citation of bundled licence text is not an instruction pointer, and the Apache-2.0
         text happens to live only under the legacy tree. That it does is worth moving one
         day; it is not what sent a build agent down the wrong path. */
      const licenceOnly = /LICENSES\//.test(line)
      if (rx.test(line) && !licenceOnly && !/legacy/i.test(line)) bad.push(`${doc}:${i + 1}  ${line.trim().slice(0, 90)}`)
    }
  })
  check(`${doc} does not send a reader to a root that is not live`,
    bad.length === 0,
    bad.slice(0, 3).join('\n          '))
}

check('CLAUDE.md names the live root at least once',
  readFileSync(join(ROOT, 'CLAUDE.md'), 'utf8').includes(liveRoot))

/* ── the legacy route is the one the product says it is ─────────────────── */

check('the pipeline still describes how legacy is reached, and it is behind a flag',
  /--legacy-v2/.test(pipeline.legacy?.reachableBy ?? ''),
  JSON.stringify(pipeline.legacy ?? null))

check('and the legacy pipeline file the product names is really there',
  existsSync(join(ROOT, pipeline.legacy?.v2Pipeline ?? 'nowhere')),
  String(pipeline.legacy?.v2Pipeline))

console.log(`\n  ${failed ? `${failed} failing` : 'one live surface, and the other roots say what they are'}\n`)
process.exit(failed ? 1 : 0)
