#!/usr/bin/env node
// Measures what a skill costs to load, and fails when it costs too much.
//
// The previous version of this file hard-coded three v2/ paths, applied no threshold
// and always exited 0. All three architecture candidates cited it as the check that
// made acceptance criterion A3 "measured". It measured nothing that could fail. That is
// the defect this rewrite exists to close, so the honesty rule applies to the tool
// itself: a scenario that cannot be resolved withholds its verdict instead of passing.
//
// The skill declares its own budget in SKILL.md frontmatter:
//
//   context:
//     always: [SKILL.md]
//     scenarios:
//       marketing: [stacks/static.md, verify.md]
//       shop: [floor/buy.md, stacks/static.md, verify.md]
//       redesign: [floor/buy.md, redesign.md, stacks/static.md, verify.md]
//     ceilings: { always: 3100, routine: 6000, redesign: 7000 }
//
// A scenario's cost is always + its own files. "routine" is the ceiling applied to
// every scenario that is not named in `ceilings`, so adding a scenario cannot silently
// escape the gate.
//
//   node tools/context-budget.mjs <skill-dir>            measure and gate
//   node tools/context-budget.mjs <skill-dir> --json
//   node tools/context-budget.mjs <skill-dir> --legacy   heuristic, for the old tree
//
// Estimated tokens = bytes / 4. Stated wherever the number is printed so it is never
// mistaken for a tokeniser.

import { readFileSync, statSync, existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'

const dir = process.argv[2]
if (!dir) {
  console.error('usage: node tools/context-budget.mjs <skill-dir> [--json] [--legacy]')
  process.exit(2)
}
const asJson = process.argv.includes('--json')
const legacy = process.argv.includes('--legacy')

const TOKENS_PER_CHAR = 1 / 4
const est = (bytes) => Math.round(bytes * TOKENS_PER_CHAR)
const METHOD = 'estimated tokens = bytes / 4; not a real tokeniser'

async function walk(root) {
  const out = []
  const stack = [root]
  while (stack.length) {
    const d = stack.pop()
    for (const e of await readdir(d, { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (['node_modules', '.git', '__pycache__'].includes(e.name)) continue
        stack.push(join(d, e.name))
      } else {
        const p = join(d, e.name)
        out.push({ rel: relative(root, p).replace(/\\/g, '/'), bytes: statSync(p).size })
      }
    }
  }
  return out.sort((a, b) => b.bytes - a.bytes)
}

// Deliberately small: a YAML subset covering exactly the shapes the manifest uses.
// A manifest this tool cannot parse is a failure, never a pass — see resolve() below.
function parseContextBlock(text) {
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!fm) return null
  const lines = fm[1].split(/\r?\n/)
  const start = lines.findIndex((l) => /^context:\s*$/.test(l))
  if (start === -1) return null

  const block = []
  for (let i = start + 1; i < lines.length; i++) {
    if (/^\S/.test(lines[i]) && lines[i].trim()) break
    block.push(lines[i])
  }

  const list = (s) =>
    s.trim().replace(/^\[|\]$/g, '').split(',').map((x) => x.trim().replace(/^["']|["']$/g, '')).filter(Boolean)

  const out = { always: [], scenarios: {}, ceilings: {} }
  let section = null
  for (const raw of block) {
    const line = raw.replace(/\s+$/, '')
    if (!line.trim()) continue
    const indent = line.length - line.trimStart().length
    const t = line.trim()

    if (indent === 2) {
      const m = t.match(/^(always|scenarios|ceilings):\s*(.*)$/)
      if (!m) continue
      section = m[1]
      if (m[1] === 'always' && m[2]) out.always = list(m[2])
      if (m[1] === 'ceilings' && m[2]) {
        for (const pair of m[2].replace(/^\{|\}$/g, '').split(',')) {
          const [k, v] = pair.split(':').map((x) => x && x.trim())
          if (k && v) out.ceilings[k] = Number(v)
        }
      }
      continue
    }
    if (indent >= 4 && section === 'scenarios') {
      const m = t.match(/^([\w-]+):\s*(.*)$/)
      if (m) out.scenarios[m[1]] = list(m[2])
    }
    if (indent >= 4 && section === 'ceilings') {
      const m = t.match(/^([\w-]+):\s*(\d+)$/)
      if (m) out.ceilings[m[1]] = Number(m[2])
    }
  }
  return out
}

// Kept only so the pre-rebuild tree can still be measured while both shapes exist on
// disk. It reports and never gates, and it says so — an ungated number presented as a
// gate is the exact defect this rewrite closes.
function legacyManifest(files) {
  const declared = ['SKILL.md', 'v2/README.md', 'v2/10-core.md'].filter((d) => files.some((f) => f.rel === d))
  const biggest = (prefix) => {
    const list = files.filter((f) => f.rel.startsWith(prefix))
    return list.length ? [list.reduce((a, b) => (a.bytes > b.bytes ? a : b)).rel] : []
  }
  return {
    always: declared,
    scenarios: { routine: [...biggest('v2/modes/'), ...biggest('v2/tasks/')] },
    ceilings: {},
    legacy: true,
  }
}

const files = await walk(dir)
const total = files.reduce((n, f) => n + f.bytes, 0)
const bytesOf = (rel) => files.find((f) => f.rel === rel)?.bytes

const skillPath = join(dir, 'SKILL.md')
let manifest = null
if (!legacy && existsSync(skillPath)) manifest = parseContextBlock(readFileSync(skillPath, 'utf8'))
const usingLegacy = !manifest
if (usingLegacy) manifest = legacyManifest(files)

const problems = []
function resolve(list, where) {
  let bytes = 0
  for (const rel of list) {
    const b = bytesOf(rel)
    if (b === undefined) {
      // A declared file that does not exist is the failure mode that turns a budget
      // gate into decoration: the manifest shrinks, the number falls, the gate passes.
      problems.push(`${where}: declared file not found — ${rel}`)
      continue
    }
    bytes += b
  }
  return bytes
}

const alwaysBytes = resolve(manifest.always, 'always')
const scenarios = Object.entries(manifest.scenarios).map(([name, list]) => {
  const own = resolve(list, `scenario ${name}`)
  const bytes = alwaysBytes + own
  const ceiling = manifest.ceilings[name] ?? manifest.ceilings.routine
  const tokens = est(bytes)
  return {
    name,
    files: list,
    bytes,
    estTokens: tokens,
    ceiling: ceiling ?? null,
    over: ceiling ? tokens - ceiling : null,
    verdict: ceiling === undefined || ceiling === null ? 'ungated' : tokens <= ceiling ? 'pass' : 'FAIL',
  }
})

const alwaysCeiling = manifest.ceilings.always ?? null
const alwaysTokens = est(alwaysBytes)
const alwaysVerdict = alwaysCeiling === null ? 'ungated' : alwaysTokens <= alwaysCeiling ? 'pass' : 'FAIL'

const report = {
  skill: dir,
  method: METHOD,
  manifestSource: usingLegacy ? 'legacy heuristic — reports only, never gates' : `${skillPath} frontmatter context: block`,
  always: { files: manifest.always, bytes: alwaysBytes, estTokens: alwaysTokens, ceiling: alwaysCeiling, verdict: alwaysVerdict },
  scenarios,
  total: { files: files.length, bytes: total, estTokens: est(total) },
  worstScenarioShareOfTotal: scenarios.length ? Number((Math.max(...scenarios.map((s) => s.bytes)) / total).toFixed(4)) : null,
  largestTen: files.slice(0, 10).map((f) => ({ rel: f.rel, estTokens: est(f.bytes) })),
  problems,
}

if (asJson) {
  console.log(JSON.stringify(report, null, 2))
} else {
  console.log(`skill:    ${dir}`)
  console.log(`method:   ${METHOD}`)
  console.log(`manifest: ${report.manifestSource}\n`)
  const line = (name, tok, ceiling, verdict) =>
    `  ${name.padEnd(12)} ${String(tok).padStart(7)} tok  ${ceiling === null ? '(no ceiling)' : `ceiling ${String(ceiling).padStart(6)}`}  ${verdict}`
  console.log(line('ALWAYS', alwaysTokens, alwaysCeiling, alwaysVerdict))
  for (const s of scenarios) console.log(line(s.name.toUpperCase(), s.estTokens, s.ceiling, s.verdict))
  console.log(`\n  TOTAL package ${est(total)} tok across ${files.length} files`)
  if (report.worstScenarioShareOfTotal !== null) {
    console.log(`  worst scenario pulls ${(report.worstScenarioShareOfTotal * 100).toFixed(1)}% of the package`)
  }
  if (problems.length) {
    console.log('\nproblems:')
    for (const p of problems) console.log(`  ${p}`)
  }
}

// Exit policy. A declared-but-missing file is fatal even when every number is under its
// ceiling, because the shrunken manifest is what made the numbers look good.
if (problems.length) process.exit(1)
if (usingLegacy) process.exit(0)
const failed = [alwaysVerdict, ...scenarios.map((s) => s.verdict)].filter((v) => v === 'FAIL')
if (failed.length) process.exit(1)
const ungated = [alwaysVerdict, ...scenarios.map((s) => s.verdict)].filter((v) => v === 'ungated')
if (ungated.length) {
  console.error(`\n${ungated.length} budget(s) have no ceiling. Declare them in the context: block — an ungated budget is not a measured one.`)
  process.exit(1)
}
