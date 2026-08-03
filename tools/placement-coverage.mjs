#!/usr/bin/env node
// Every mechanism extracted from every upstream repository must end up in one of three
// states: it is in the artifact, it is scheduled into a named file, or it was dropped
// with a written reason. Silence is not a fourth state.
//
// This is the check that keeps the research honest. A rebuild that studies seventeen
// repositories and then ships an artifact drawing on fifteen mechanisms has not
// combined anything; it has written a bibliography. This tool makes the gap visible.
//
//   node tools/placement-coverage.mjs            report + gate
//   node tools/placement-coverage.mjs --json
//   node tools/placement-coverage.mjs --by-source
//
// Inputs:
//   docs/rebuild/MECHANISM-LEDGER.json   what was extracted
//   docs/rebuild/PLACEMENT.json          where each adopted mechanism goes

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ledgerPath = join(root, 'docs/rebuild/MECHANISM-LEDGER.json')
const placementPath = join(root, 'docs/rebuild/PLACEMENT.json')

const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8'))
if (!existsSync(placementPath)) {
  console.error('docs/rebuild/PLACEMENT.json does not exist yet — run the placement pass first')
  process.exit(1)
}
const placement = JSON.parse(readFileSync(placementPath, 'utf8'))

// Only adopt and adapt need a home. reject already carries its reason in the ledger,
// and investigate is explicitly unresolved.
const needsHome = ledger.mechanisms.filter((m) => m.decision === 'adopt' || m.decision === 'adapt')
const placedBy = new Map((placement.placements ?? []).map((p) => [p.key, p]))

const NON_FILE = new Set(['already-present', 'drop', 'reference-only'])

const rows = needsHome.map((m) => {
  const p = placedBy.get(m.key)
  return {
    key: m.key,
    source: m.source,
    decision: m.decision,
    redTeam: m.redTeam,
    target: p?.target ?? null,
    kind: !p ? 'UNACCOUNTED' : NON_FILE.has(p.target) ? p.target : 'scheduled',
    estTokenCost: p?.estTokenCost ?? 0,
    disputed: Boolean(p?.disputed),
  }
})

const unaccounted = rows.filter((r) => r.kind === 'UNACCOUNTED')

/* A placement that names a file which is not in the tree is a plan, not a placement, and
   this tool reported "all accounted for" over four of them for the whole rebuild:
   tools/genericness-judge.mjs, tools/self-contained-lint.mjs, tools/critique-gate.mjs and
   tools/portfolio-diversity.mjs have zero commits between them in any branch. Accounting
   by string match asks whether somebody wrote a destination down, which is not the
   question. The question is whether the mechanism landed. */
const phantom = rows.filter((r) => r.kind === 'scheduled' && !existsSync(join(root, r.target)))
const disputed = rows.filter((r) => r.disputed)
const orphanPlacements = (placement.placements ?? []).filter((p) => !needsHome.some((m) => m.key === p.key))

const byKind = rows.reduce((m, r) => ((m[r.kind] = (m[r.kind] ?? 0) + 1), m), {})
const byTarget = rows
  .filter((r) => r.kind === 'scheduled')
  .reduce((m, r) => ((m[r.target] = (m[r.target] ?? 0) + 1), m), {})

// Budget pressure on the one file with a hard ceiling.
const skillAdds = rows.filter((r) => r.target && r.target.includes('SKILL.md'))
const skillTokens = skillAdds.reduce((n, r) => n + r.estTokenCost, 0)

const report = {
  ledger: { total: ledger.counts.total, needingHome: needsHome.length },
  byKind,
  byTarget,
  skillMdPressure: { placements: skillAdds.length, estTokens: skillTokens, headroom: placement.skillHeadroomTokens ?? null },
  unaccounted: unaccounted.map((r) => ({ key: r.key, source: r.source })),
  disputedAlreadyPresent: disputed.map((r) => r.key),
  orphanPlacements: orphanPlacements.map((p) => p.key),
  phantomTargets: phantom.map((r) => ({ key: r.key, target: r.target })),
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(report, null, 2))
} else if (process.argv.includes('--by-source')) {
  const bySource = {}
  for (const r of rows) {
    bySource[r.source] ??= {}
    bySource[r.source][r.kind] = (bySource[r.source][r.kind] ?? 0) + 1
  }
  for (const [src, kinds] of Object.entries(bySource).sort()) {
    const parts = Object.entries(kinds).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${v} ${k}`)
    console.log(`${src.padEnd(28)} ${parts.join(', ')}`)
  }
} else {
  console.log(`${needsHome.length} adopted or adapted mechanisms need a home (of ${ledger.counts.total} extracted).\n`)
  for (const [k, v] of Object.entries(byKind).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(v).padStart(3)}  ${k}`)
  }
  if (Object.keys(byTarget).length) {
    console.log('\nscheduled into:')
    for (const [t, v] of Object.entries(byTarget).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${String(v).padStart(3)}  ${t}`)
    }
  }
  console.log(`\nSKILL.md pressure: ${skillAdds.length} placements, ~${skillTokens} est tokens${report.skillMdPressure.headroom !== null ? ` against ${report.skillMdPressure.headroom} of headroom` : ''}`)
  if (unaccounted.length) {
    console.log(`\nUNACCOUNTED (${unaccounted.length}) — extracted, adopted, and then nothing:`)
    for (const r of unaccounted) console.log(`  ${r.key}`)
  }
  if (disputed.length) {
    console.log(`\nDISPUTED already-present (${disputed.length}) — an auditor could not find them in the artifact:`)
    for (const r of disputed) console.log(`  ${r.key}`)
  }
  if (orphanPlacements.length) {
    console.log(`\nORPHAN placements (${orphanPlacements.length}) — placed but not adopted in the ledger:`)
    for (const k of orphanPlacements) console.log(`  ${k}`)
  }
  if (phantom.length) {
    console.log(`\nPHANTOM targets (${phantom.length}) — scheduled into a file that is not in the tree:`)
    for (const r of phantom) console.log(`  ${r.key}  ->  ${r.target}`)
  }
}

const fatal = unaccounted.length + disputed.length + orphanPlacements.length + phantom.length
if (fatal) {
  console.error(`\n${fatal} problem(s). Every adopted mechanism needs a file, a quote proving it is already there, or a written drop.`)
  process.exit(1)
}
console.log('\nall accounted for')
