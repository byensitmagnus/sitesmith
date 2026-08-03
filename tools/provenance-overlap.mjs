#!/usr/bin/env node
// THIRD-PARTY-NOTICES.md claims this package vendors no upstream text. That is the kind
// of claim a repository asserts once and then quietly stops being true, so it is
// measured rather than asserted: every shipped markdown file is compared against every
// source and each shared run of N or more consecutive words is reported.
//
// Word runs, not characters, because normal English prose about the same subject shares
// short phrases all the time. Eight consecutive words in common is not coincidence.
//
//   node tools/provenance-overlap.mjs             report
//   node tools/provenance-overlap.mjs --check     fail if a forbidden source shows any overlap
//   node tools/provenance-overlap.mjs --n 6       tighter window
//
// The gate is asymmetric on purpose. A licensed source may show overlap, because MIT and
// Apache permit it with notice. A source with no licence may not show any, because there
// is no permission to rely on and an accidental paraphrase is still a copy.

import { readFileSync, existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const UP = 'C:/Users/Usmo1/AppData/Local/Temp/claude/C--Users-Usmo1-Documents-sitesmith/60a368a9-e3a0-4ebc-aadf-386ee1a4a75a/scratchpad/upstream'
const SKILL = join(root, 'skills/sitesmith-v3')

const nArg = process.argv.indexOf('--n')
const N = nArg > -1 ? Number(process.argv[nArg + 1]) : 8
const CHECK = process.argv.includes('--check')

// licence: what the source permits. "none" means an overlap is a defect, not a notice item.
const SOURCES = [
  { id: 'frontend-design', licence: 'Apache-2.0', path: `${UP}/anthropic-skills/skills/frontend-design` },
  { id: 'impeccable', licence: 'Apache-2.0', path: `${UP}/impeccable/.agents/skills/impeccable` },
  { id: 'taste-skill', licence: 'MIT', path: `${UP}/taste-skill/skills` },
  { id: 'ui-ux-pro-max', licence: 'MIT', path: `${UP}/ui-ux-pro-max/src` },
  { id: 'ponytail', licence: 'MIT', path: `${UP}/ponytail/skills` },
  { id: 'ai-website-cloner-template', licence: 'MIT', path: `${UP}/ai-website-cloner-template` },
  { id: 'scroll-world', licence: 'MIT', path: `${UP}/scroll-world/skills` },
  { id: 'ai-dev-tasks', licence: 'Apache-2.0', path: `${UP}/ai-dev-tasks` },
  { id: 'remotion-skills', licence: 'none', path: `${UP}/remotion-skills/skills` },
  { id: 'magic-21st', licence: 'none', path: `${UP}/magic-21st` },
  { id: 'website-builder-setup', licence: 'none', path: `${UP}/website-builder-setup` },
]

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()
const runs = (text) => {
  const w = norm(text).split(' ')
  const out = new Set()
  for (let i = 0; i + N <= w.length; i++) out.add(w.slice(i, i + N).join(' '))
  return out
}

async function mdUnder(dir) {
  if (!existsSync(dir)) return []
  const out = []
  const stack = [dir]
  while (stack.length) {
    const d = stack.pop()
    let entries
    try {
      entries = await readdir(d, { withFileTypes: true })
    } catch {
      continue
    }
    for (const e of entries) {
      if (e.isDirectory()) {
        if (!['node_modules', '.git', '__pycache__'].includes(e.name)) stack.push(join(d, e.name))
      } else if (/\.mdx?$/i.test(e.name)) out.push(join(d, e.name))
    }
  }
  return out
}

/* The notices file quotes upstream phrases on purpose, to show what survived. Scanning it
   would inflate the very number it reports. */
const shipped = (await mdUnder(SKILL)).filter((f) => !/THIRD-PARTY-NOTICES\.md$/.test(f))
if (!shipped.length) {
  console.error(`no markdown under ${SKILL} — nothing to compare, which is not the same as passing`)
  process.exit(1)
}
const oursText = shipped.map((f) => readFileSync(f, 'utf8')).join('\n')
const ours = runs(oursText)

console.log(`comparing ${shipped.length} shipped file(s) against ${SOURCES.length} source(s), window ${N} words\n`)

let fatal = 0
for (const s of SOURCES) {
  const files = await mdUnder(s.path)
  if (!files.length) {
    console.log(`  ${s.id.padEnd(28)} ${'(source not on disk)'.padEnd(12)} verdict withheld`)
    if (CHECK && s.licence === 'none') fatal++
    continue
  }
  const theirs = runs(files.map((f) => readFileSync(f, 'utf8')).join('\n'))
  const shared = [...theirs].filter((g) => ours.has(g))
  const bad = s.licence === 'none' && shared.length > 0
  if (bad) fatal++
  console.log(
    `  ${s.id.padEnd(28)} ${String(shared.length).padStart(4)} shared run(s)   ${s.licence.padEnd(11)} ${bad ? 'FORBIDDEN SOURCE, OVERLAP IS A DEFECT' : shared.length ? 'permitted with notice' : 'clean'}`,
  )
  for (const g of shared.slice(0, 3)) console.log(`      "${g}"`)
}

if (CHECK) {
  if (fatal) {
    console.error(`\n${fatal} source(s) with no licence show overlap, or could not be checked. Both fail.`)
    process.exit(1)
  }
  console.log('\nno overlap with any unlicensed source')
}
