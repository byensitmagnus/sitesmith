#!/usr/bin/env node
// Builds docs/rebuild/MECHANISM-LEDGER.{json,md} and the graph records for every
// mechanism found in the repo autopsies.
//
// The ledger's job is to make three things impossible to lose:
//   1. a mechanism claimed but refuted by the red team stays visible, marked refuted,
//      rather than quietly disappearing or quietly surviving
//   2. every adopt/adapt/reject decision carries its reason
//   3. every mechanism keeps its source and path, so attribution is mechanical
//
//   node tools/build-mechanism-ledger.mjs
//   node tools/build-mechanism-ledger.mjs --check
//   node tools/build-mechanism-ledger.mjs --graph   # emit JSONL graph records to stdout

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
// Wave 1 autopsied one source per agent, so the source id lives on the group. Wave 2
// grouped several sources per agent, so the source id lives on each mechanism. Both
// waves are read here; nothing else in the file needs to know which wave a row is from.
// Wave 3 is the correction: the first autopsy of this repository cited not one line of
// v2/modes/ or v2/tasks/, so 919 lines holding the entire craft floor were re-extracted
// separately. Its records carry isAppearance and threeRenditions and omit some fields.
const WAVES = [
  'docs/rebuild/research/_mechanisms/RAW-AUTOPSIES.json',
  'docs/rebuild/research/_mechanisms/RAW-AUTOPSIES-WAVE2.json',
  'docs/rebuild/research/_mechanisms/RAW-MODE-FLOOR.json',
]
const raw = { result: WAVES.flatMap((p) => JSON.parse(readFileSync(join(root, p), 'utf8')).result) }

const rows = []
for (const r of raw.result) {
  const challenges = new Map((r.challenge?.challenges ?? []).map((c) => [c.mechanismId, c]))
  for (const m of r.autopsy?.mechanisms ?? r.mechanisms ?? []) {
    const ch = challenges.get(m.id)
    const source = r.sourceId ?? (r.key ? 'sitesmith-modes' : null) ?? m.source ?? r.groupKey
    rows.push({
      key: `${source}/${m.id}`,
      id: m.id,
      source,
      sourcePath: m.sourcePath,
      problemSolved: m.problemSolved,
      mechanism: m.mechanism,
      whyItWorks: m.whyItWorks,
      requiredContext: m.requiredContext ?? [],
      contextCost: m.contextCost ?? 'low',
      outputImpact: m.outputImpact ?? '',
      failureModes: m.failureModes ?? [],
      conflicts: m.conflicts ?? [],
      testMethod: m.testMethod ?? 'not stated',
      decision: m.decision,
      sitesmithForm: m.sitesmithForm,
      confidence: m.confidence,
      // Red team status. "unchallenged" is not the same as "confirmed" and is kept distinct.
      redTeam: ch ? (ch.refuted ? 'refuted' : 'confirmed') : 'unchallenged',
      redTeamReason: ch?.reason ?? '',
      redTeamEvidence: ch?.evidencePath ?? '',
    })
  }
}

// A refuted mechanism cannot keep an adopt decision on the strength of the autopsy alone.
for (const row of rows) {
  if (row.redTeam === 'refuted' && row.decision !== 'reject') {
    row.decisionBeforeRefutation = row.decision
    row.decision = 'investigate'
    row.decisionNote = 'Downgraded to investigate: the red team refuted the claim as stated. Re-read the source before adopting.'
  }
}

const byDecision = (d) => rows.filter((r) => r.decision === d)
const counts = {
  total: rows.length,
  adopt: byDecision('adopt').length,
  adapt: byDecision('adapt').length,
  reject: byDecision('reject').length,
  investigate: byDecision('investigate').length,
  confirmed: rows.filter((r) => r.redTeam === 'confirmed').length,
  refuted: rows.filter((r) => r.redTeam === 'refuted').length,
  unchallenged: rows.filter((r) => r.redTeam === 'unchallenged').length,
  lowContextCost: rows.filter((r) => r.contextCost === 'low').length,
  highContextCost: rows.filter((r) => r.contextCost === 'high').length,
}

const ledger = {
  schemaVersion: 1,
  generatedBy: 'tools/build-mechanism-ledger.mjs',
  generatedFrom: 'docs/rebuild/research/_mechanisms/RAW-AUTOPSIES.json',
  doNotEditByHand: true,
  counts,
  mechanisms: rows,
}

if (process.argv.includes('--graph')) {
  const out = []
  for (const r of rows) {
    const id = `mech:${r.source}/${r.id}`
    out.push(JSON.stringify({
      kind: 'node',
      type: 'Mechanism',
      id,
      label: r.mechanism.slice(0, 200),
      source: r.source,
      path: r.sourcePath,
      status: r.decision,
      confidence: r.redTeam === 'refuted' ? Math.min(r.confidence, 0.3) : r.confidence,
      notes: `${r.contextCost} context cost; red team ${r.redTeam}`,
      evidence: 'docs/rebuild/MECHANISM-LEDGER.json',
    }))
    out.push(JSON.stringify({ kind: 'edge', type: 'ADAPTED_FROM', from: id, to: `source:${r.source}` }))
    if (r.decision === 'reject') {
      out.push(JSON.stringify({ kind: 'edge', type: 'REJECTED_DUE_TO', from: id, to: 'constraint:no-house-style', why: r.sitesmithForm || r.whyItWorks }))
    }
  }
  console.log(out.join('\n'))
  process.exit(0)
}

const md = []
md.push('---')
md.push('title: Mechanism ledger')
md.push('state: S3_MECHANISM_GRAPH')
md.push('status: generated')
md.push('generator: tools/build-mechanism-ledger.mjs')
md.push('ai_generated: "(C)"')
md.push('---')
md.push('')
md.push('# Mechanism ledger')
md.push('')
md.push('Generated. Do not hand-edit.')
md.push('')
md.push(`${counts.total} mechanisms from ${new Set(rows.map((r) => r.source)).size} sources. Red team: ${counts.confirmed} confirmed, ${counts.refuted} refuted, ${counts.unchallenged} unchallenged. Decisions after refutation is applied: ${counts.adopt} adopt, ${counts.adapt} adapt, ${counts.investigate} investigate, ${counts.reject} reject.`)
md.push('')
md.push('"Unchallenged" means the red team did not examine it, which is weaker than "confirmed" and is kept as a separate state on purpose.')
md.push('')

const REFUTED = rows.filter((r) => r.redTeam === 'refuted')
if (REFUTED.length) {
  md.push('## Refuted — do not build on these without re-reading the source')
  md.push('')
  for (const r of REFUTED) {
    md.push(`### ${r.key}`)
    md.push('')
    md.push(`Claimed: ${r.mechanism}`)
    md.push('')
    md.push(`**Refuted:** ${r.redTeamReason}`)
    md.push('')
    md.push(`Checked at: \`${r.redTeamEvidence}\``)
    md.push('')
    if (r.decisionBeforeRefutation) md.push(`Decision was \`${r.decisionBeforeRefutation}\`, now \`${r.decision}\`.`)
    md.push('')
  }
}

for (const [heading, decision] of [
  ['Adopt', 'adopt'],
  ['Adapt', 'adapt'],
  ['Investigate', 'investigate'],
  ['Reject', 'reject'],
]) {
  const list = byDecision(decision)
  if (!list.length) continue
  md.push(`## ${heading} (${list.length})`)
  md.push('')
  md.push('| mechanism | source | context cost | red team | what it solves |')
  md.push('| --- | --- | --- | --- | --- |')
  for (const r of list.sort((a, b) => b.confidence - a.confidence)) {
    md.push(`| \`${r.id}\` | ${r.source} | ${r.contextCost} | ${r.redTeam} | ${r.problemSolved.slice(0, 120)} |`)
  }
  md.push('')
}

md.push('## Full records')
md.push('')
for (const r of rows.sort((a, b) => a.source.localeCompare(b.source) || a.id.localeCompare(b.id))) {
  md.push(`### ${r.key} — \`${r.decision}\``)
  md.push('')
  md.push(`**Solves:** ${r.problemSolved}`)
  md.push('')
  md.push(`**Mechanism:** ${r.mechanism}`)
  md.push('')
  md.push(`**Why it works:** ${r.whyItWorks}`)
  md.push('')
  md.push(`**In SiteSmith:** ${r.sitesmithForm}`)
  md.push('')
  md.push(`| source path | context cost | confidence | red team | test method |`)
  md.push(`| --- | --- | --- | --- | --- |`)
  md.push(`| \`${r.sourcePath}\` | ${r.contextCost} | ${r.confidence} | ${r.redTeam} | ${r.testMethod} |`)
  md.push('')
  if (r.failureModes.length) {
    md.push('Failure modes:')
    for (const f of r.failureModes) md.push(`- ${f}`)
    md.push('')
  }
  if (r.conflicts.length) {
    md.push(`Conflicts: ${r.conflicts.join('; ')}`)
    md.push('')
  }
  if (r.decisionNote) {
    md.push(`> ${r.decisionNote}`)
    md.push('')
  }
}

const jsonPath = join(root, 'docs/rebuild/MECHANISM-LEDGER.json')
const mdPath = join(root, 'docs/rebuild/MECHANISM-LEDGER.md')
const jsonOut = JSON.stringify(ledger, null, 2) + '\n'
const mdOut = md.join('\n') + '\n'

if (process.argv.includes('--check')) {
  const stale = [[jsonPath, jsonOut], [mdPath, mdOut]].filter(([p, want]) => {
    try {
      return readFileSync(p, 'utf8') !== want
    } catch {
      return true
    }
  })
  if (stale.length) {
    console.error(`stale: ${stale.map(([p]) => p).join(', ')} — run node tools/build-mechanism-ledger.mjs`)
    process.exit(1)
  }
  console.log('mechanism ledger is current')
} else {
  writeFileSync(jsonPath, jsonOut)
  writeFileSync(mdPath, mdOut)
  console.log(JSON.stringify(counts, null, 2))
}
