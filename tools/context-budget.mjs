#!/usr/bin/env node
// Measures what a skill actually costs to load, so "progressive disclosure" stops
// being a claim in a heading and becomes a number a gate can fail on.
//
// Estimation: characters / 4. That is a rough proxy for English-plus-markdown tokens.
// It is stated wherever the number is used so nobody mistakes it for a real tokeniser.
//
//   node tools/context-budget.mjs <skill-dir> [--json]
//
// Three figures matter:
//   ALWAYS   what enters context on every single invocation
//   ROUTINE  always + the one mode file and one task file a typical run adds
//   TOTAL    the whole package, i.e. the worst case if progressive loading fails

import { readFileSync, statSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join, relative, extname } from 'node:path'

const dir = process.argv[2]
if (!dir) {
  console.error('usage: node tools/context-budget.mjs <skill-dir> [--json]')
  process.exit(2)
}
const asJson = process.argv.includes('--json')

const TOKENS_PER_CHAR = 1 / 4
const est = (bytes) => Math.round(bytes * TOKENS_PER_CHAR)

async function walk(root) {
  const out = []
  const stack = [root]
  while (stack.length) {
    const d = stack.pop()
    for (const e of await readdir(d, { withFileTypes: true })) {
      const p = join(d, e.name)
      if (e.isDirectory()) {
        if (e.name === 'node_modules' || e.name === '.git' || e.name === '__pycache__') continue
        stack.push(p)
      } else {
        out.push({ path: p, rel: relative(root, p).replace(/\\/g, '/'), bytes: statSync(p).size })
      }
    }
  }
  return out.sort((a, b) => b.bytes - a.bytes)
}

// A file is "always loaded" if the skill's own entry point says so. We do not guess:
// we read SKILL.md and take the files it names as mandatory reading before routing.
function alwaysLoaded(files, root) {
  const entry = files.find((f) => f.rel === 'SKILL.md')
  if (!entry) return []
  const text = readFileSync(entry.path, 'utf8')
  const linked = [...text.matchAll(/\]\(([^)]+\.md)\)/g)].map((m) => m[1].replace(/^\.\//, ''))
  // SKILL.md states its own always-loaded set in prose. These are the ones it names.
  const declared = ['SKILL.md', 'v2/README.md', 'v2/10-core.md']
  const present = new Set(declared.filter((d) => files.some((f) => f.rel === d)))
  return { files: [...present], linkedFromEntry: [...new Set(linked)] }
}

const files = await walk(dir)
const total = files.reduce((n, f) => n + f.bytes, 0)

const always = alwaysLoaded(files, dir)
const alwaysBytes = always.files.reduce((n, rel) => n + (files.find((f) => f.rel === rel)?.bytes ?? 0), 0)

// A routine run adds one mode file and one task file.
const modeFiles = files.filter((f) => f.rel.startsWith('v2/modes/'))
const taskFiles = files.filter((f) => f.rel.startsWith('v2/tasks/'))
const biggestMode = Math.max(0, ...modeFiles.map((f) => f.bytes))
const biggestTask = Math.max(0, ...taskFiles.map((f) => f.bytes))
const routineBytes = alwaysBytes + biggestMode + biggestTask

const byDir = new Map()
for (const f of files) {
  const top = f.rel.includes('/') ? f.rel.split('/')[0] : '(root)'
  byDir.set(top, (byDir.get(top) ?? 0) + f.bytes)
}

const report = {
  skill: dir,
  method: 'estimated tokens = bytes / 4; not a real tokeniser',
  always: { files: always.files, bytes: alwaysBytes, estTokens: est(alwaysBytes) },
  routine: {
    note: 'always + largest mode file + largest task file',
    bytes: routineBytes,
    estTokens: est(routineBytes),
  },
  total: { files: files.length, bytes: total, estTokens: est(total) },
  ratioRoutineOfTotal: Number((routineBytes / total).toFixed(4)),
  byTopLevel: [...byDir.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => ({ dir: k, bytes: v, estTokens: est(v), pctOfTotal: Number(((v / total) * 100).toFixed(1)) })),
  largestTen: files.slice(0, 10).map((f) => ({ rel: f.rel, bytes: f.bytes, estTokens: est(f.bytes) })),
}

if (asJson) {
  console.log(JSON.stringify(report, null, 2))
} else {
  console.log(`skill: ${dir}`)
  console.log(`method: ${report.method}\n`)
  console.log(`ALWAYS   ${String(report.always.estTokens).padStart(8)} tok  (${report.always.files.join(', ')})`)
  console.log(`ROUTINE  ${String(report.routine.estTokens).padStart(8)} tok  (${report.routine.note})`)
  console.log(`TOTAL    ${String(report.total.estTokens).padStart(8)} tok  across ${report.total.files} files`)
  console.log(`\nroutine run pulls ${(report.ratioRoutineOfTotal * 100).toFixed(1)}% of the package\n`)
  console.log('by top-level directory:')
  for (const d of report.byTopLevel) {
    console.log(`  ${String(d.estTokens).padStart(8)} tok  ${String(d.pctOfTotal).padStart(5)}%  ${d.dir}`)
  }
  console.log('\nlargest files:')
  for (const f of report.largestTen) console.log(`  ${String(f.estTokens).padStart(8)} tok  ${f.rel}`)
}
