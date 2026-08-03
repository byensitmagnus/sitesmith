#!/usr/bin/env node
// Did each autopsy actually read its source, or only the part it found first?
//
// This exists because one did not. The autopsy of SiteSmith v2.3 extracted fifteen
// mechanisms and cited not one line of v2/modes/ or v2/tasks/ — 919 lines holding the
// entire craft floor, and the layer the nordrig comparison identified as this
// repository's genuine strength. Nothing caught it. The gap surfaced only because a
// downstream file, floor/buy.md, ended up with zero placements scheduled into it.
//
// So: compare what each autopsy cited against what its source actually contains, and
// report the instruction-bearing files nobody looked at.
//
//   node tools/autopsy-coverage.mjs
//   node tools/autopsy-coverage.mjs --json
//
// A file being uncited is not automatically a defect. A 500-file component library does
// not need every file read. What matters is uncited files that plausibly carry
// instruction: markdown, SKILL files, prompts, rules. Those are what an autopsy is for.

import { readFileSync, existsSync, statSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const UP = 'C:/Users/Usmo1/AppData/Local/Temp/claude/C--Users-Usmo1-Documents-sitesmith/60a368a9-e3a0-4ebc-aadf-386ee1a4a75a/scratchpad/upstream'

// Where each ledger source actually lives on disk.
const ROOTS = {
  'frontend-design': `${UP}/anthropic-skills/skills/frontend-design`,
  'taste-skill': `${UP}/taste-skill`,
  'ui-ux-pro-max': `${UP}/ui-ux-pro-max`,
  impeccable: `${UP}/impeccable`,
  'sitesmith-current': join(root, 'skills/sitesmith'),
  'sitesmith-modes': join(root, 'skills/sitesmith/v2'),
  ponytail: `${UP}/ponytail`,
  'ai-website-cloner-template': `${UP}/ai-website-cloner-template`,
  'scroll-world': `${UP}/scroll-world`,
  'ai-dev-tasks': `${UP}/ai-dev-tasks`,
  'before-implementing': `${UP}/before-implementing`,
  'agency-agents': `${UP}/agency-agents`,
  ruflo: `${UP}/ruflo`,
  'awesome-claude-code-subagents': `${UP}/awesome-claude-code-subagents`,
  'graph-engineering': `${UP}/graph-engineering`,
  'agent-elements-21st': `${UP}/agent-elements-21st`,
  'remotion-skills': `${UP}/remotion-skills`,
  'magic-21st': `${UP}/magic-21st`,
  'website-builder-setup': `${UP}/website-builder-setup`,
}

// Files that plausibly carry instruction rather than implementation or data.
const INSTRUCTION = /\.(md|mdx|txt)$/i
const SKIP_DIR = new Set(['node_modules', '.git', '__pycache__', 'dist', 'build', '.next', 'coverage'])
const SKIP_NAME = /^(CHANGELOG|LICENSE|LICENCE|NOTICE|CODE_OF_CONDUCT|CONTRIBUTING|SECURITY|README\.zh)/i

async function walk(dir) {
  const out = []
  if (!existsSync(dir)) return out
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
        if (!SKIP_DIR.has(e.name)) stack.push(join(d, e.name))
      } else if (INSTRUCTION.test(e.name) && !SKIP_NAME.test(e.name)) {
        const p = join(d, e.name)
        out.push({ rel: relative(dir, p).replace(/\\/g, '/'), bytes: statSync(p).size })
      }
    }
  }
  return out
}

const ledger = JSON.parse(readFileSync(join(root, 'docs/rebuild/MECHANISM-LEDGER.json'), 'utf8'))

const bySource = {}
for (const m of ledger.mechanisms) {
  bySource[m.source] ??= new Set()
  // A sourcePath can name several files and line ranges. Take every path-looking token.
  for (const tok of String(m.sourcePath).split(/[;,\s]+/)) {
    const clean = tok.replace(/:.*$/, '').replace(/^\.\//, '').trim()
    if (clean && /\.[a-z]{2,4}$/i.test(clean)) bySource[m.source].add(clean)
  }
}

const rows = []
for (const [source, dir] of Object.entries(ROOTS)) {
  const files = await walk(dir)
  if (!files.length) continue
  const cited = bySource[source] ?? new Set()
  // A citation matches a file when it ends with the same path tail.
  const isCited = (rel) => [...cited].some((c) => rel === c || rel.endsWith('/' + c) || c.endsWith('/' + rel) || c === rel)
  const uncited = files.filter((f) => !isCited(f.rel)).sort((a, b) => b.bytes - a.bytes)
  const citedBytes = files.filter((f) => isCited(f.rel)).reduce((n, f) => n + f.bytes, 0)
  const totalBytes = files.reduce((n, f) => n + f.bytes, 0)
  rows.push({
    source,
    instructionFiles: files.length,
    citedFiles: files.length - uncited.length,
    coverageByBytes: totalBytes ? Number((citedBytes / totalBytes).toFixed(3)) : 0,
    mechanisms: ledger.mechanisms.filter((m) => m.source === source).length,
    largestUncited: uncited.slice(0, 5).map((f) => ({ rel: f.rel, bytes: f.bytes })),
  })
}

rows.sort((a, b) => a.coverageByBytes - b.coverageByBytes)

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ note: 'coverage is over instruction-bearing files only (.md/.mdx/.txt), excluding changelogs and licences', rows }, null, 2))
} else {
  console.log('Autopsy coverage — instruction-bearing files cited, per source. Low is not automatically wrong;')
  console.log('a large repo has material an autopsy need not read. It is a place to look.\n')
  console.log('  cov%  cited/files  mechs  source')
  for (const r of rows) {
    console.log(
      `  ${String(Math.round(r.coverageByBytes * 100)).padStart(4)}  ${String(r.citedFiles).padStart(5)}/${String(r.instructionFiles).padEnd(5)}  ${String(r.mechanisms).padStart(5)}  ${r.source}`,
    )
  }
  console.log('\nLargest uncited instruction files, for the four lowest-coverage sources:')
  for (const r of rows.slice(0, 4)) {
    console.log(`\n  ${r.source}`)
    for (const f of r.largestUncited) console.log(`    ${String(f.bytes).padStart(7)} B  ${f.rel}`)
  }
}
