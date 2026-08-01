#!/usr/bin/env node
// Builds docs/rebuild/SOURCE-REGISTRY.{json,md} from two inputs:
//   1. the four upstream pins this repo already froze (docs/rebuild/research/_resolution/INHERITED-UPSTREAM-PINS.json)
//   2. the raw multi-agent resolution evidence (docs/rebuild/research/_resolution/RAW-RESOLUTION.json)
//
// The registry is generated, never hand-edited, so a claim in it can always be traced
// back to the agent output that produced it. Redistribution status is derived here in
// one place, because that is the decision that carries legal weight and it must not be
// re-argued per file.
//
//   node tools/build-source-registry.mjs
//   node tools/build-source-registry.mjs --check   # fail if the committed files are stale

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'))

const pins = read('docs/rebuild/research/_resolution/INHERITED-UPSTREAM-PINS.json').pins
const raw = read('docs/rebuild/research/_resolution/RAW-RESOLUTION.json')

// The four sources this repo already audited and froze. Their licences were checked in
// LICENSE-AUDIT.md; they are the only sources cleared for verbatim redistribution before
// this rebuild started.
const PINNED = [
  { id: 'frontend-design', name: 'Anthropic frontend-design', repoUrl: 'https://github.com/anthropics/skills', path: 'skills/frontend-design', licence: 'Apache-2.0', licenceFilePresent: true, role: 'creative direction — thesis, typography, signature, composition', whyRelevant: 'Beat SiteSmith 59 to 40 on an identical brief in a blind test. The single most important source in the rebuild.' },
  { id: 'taste-skill', name: 'taste-skill', repoUrl: 'https://github.com/Leonxlnx/taste-skill', path: '', licence: 'MIT', licenceFilePresent: true, role: 'brief inference, design read, dials, anti-slop', whyRelevant: 'Turns a vague request into density/motion/boldness settings a designer can act on.' },
  { id: 'ui-ux-pro-max', name: 'UI/UX Pro Max', repoUrl: 'https://github.com/nextlevelbuilder/ui-ux-pro-max-skill', path: '', licence: 'MIT', licenceFilePresent: true, role: 'structured retrieval — patterns, palettes, font pairings, UX rules', whyRelevant: 'The retrieval corpus SiteSmith already vendors as data/.' },
  { id: 'impeccable', name: 'impeccable', repoUrl: 'https://github.com/pbakaus/impeccable', path: '', licence: 'Apache-2.0', licenceFilePresent: true, role: 'routing, critique, bounded polish, craft floor, hardening', whyRelevant: 'The only upstream with an explicit preserve-vs-redesign router and bounded loops.' },
]

const ROLES = {
  'scroll-world': 'scroll-driven scene storytelling, camera logic, graceful fallback',
  'remotion-skills': 'skill routing, progressive references, timeline and scene composition',
  ponytail: 'proportionality — smallest correct implementation, reuse before invention, dependency discipline',
  'ai-website-cloner-template': 'URL intake, design-token and asset extraction, section mapping, reconstruction fidelity',
  'agency-agents': 'specialist agent roles, delegation, handoff, responsibility boundaries',
  ruflo: 'shared memory, orchestration, long workflows, state persistence',
  'awesome-claude-code-subagents': 'role taxonomy, reusable subagent contracts',
  'ai-dev-tasks': 'idea to PRD to tasks, sequential execution, acceptance criteria, scope control',
  'before-implementing': 'investigate-before-asking contract, blocking questions, assumptions, proportional planning',
  'graph-engineering': 'typed nodes, directional relationships, durable shared context, experiment lineage',
  'agent-elements-21st': 'agent UI primitives — plans, approvals, tool renderers, streaming',
  'magic-21st': 'component generation and registry used by website builder setups',
  'website-builder-setup': 'installation, onboarding, dependency setup, packaging',
}

// Redistribution is a function of evidence, not of convenience.
function redistribution(licence, filePresent, notes) {
  const l = (licence || '').toUpperCase()
  if (!l || l === 'NONE') {
    return { status: 'forbidden', reason: 'No licence declared anywhere. All rights reserved by default. Read for understanding; never copy or closely paraphrase the text.' }
  }
  if (!filePresent) {
    return { status: 'forbidden', reason: `Licence "${licence}" is declared only in package metadata, with no LICENSE file and a null GitHub licence field. That is weaker provenance than a licence file, so treat as unresolved risk and do not redistribute.` }
  }
  if (l === 'MIT' || l === 'APACHE-2.0') {
    return { status: 'allowed-with-notice', reason: `${licence} permits redistribution provided the notice travels with the copy. Add to THIRD-PARTY-NOTICES.md before copying a single line.` }
  }
  return { status: 'review-required', reason: `Licence "${licence}" is neither MIT nor Apache-2.0. A human must read it before anything is copied.` }
}

const resolved = []
for (const batch of raw.result) {
  const verdicts = new Map((batch.verdicts ?? []).map((v) => [v.id, v]))
  for (const r of batch.results ?? []) {
    const v = verdicts.get(r.id)
    const c = r.chosen ?? {}
    const licence = v?.agrees === false && v.correctedLicence ? v.correctedLicence : c.licence
    const repoUrl = v?.agrees === false && v.correctedRepoUrl ? v.correctedRepoUrl : c.repoUrl
    const headCommit = v?.agrees === false && v.correctedHeadCommit ? v.correctedHeadCommit : c.headCommit
    resolved.push({
      id: r.id,
      name: c.name || r.id,
      repoUrl,
      path: '',
      defaultBranch: c.defaultBranch ?? '',
      headCommit,
      licence: licence || '',
      licenceFilePresent: Boolean(c.licenceFilePresent),
      relevantPaths: c.relevantPaths ?? [],
      role: ROLES[r.id] ?? '',
      whyRelevant: c.whyRelevant ?? '',
      claimsToVerify: c.claimsToVerify ?? [],
      resolutionStatus: r.status,
      independentlyVerified: v ? v.agrees : null,
      alternatives: (r.candidates ?? []).filter((x) => x.url !== repoUrl).map((x) => ({ name: x.name, url: x.url, confidence: x.confidence })),
      notes: r.notes ?? '',
      redistribution: redistribution(licence, c.licenceFilePresent, r.notes),
      provenance: 'resolved by workflow wf_ffb0513f-0ef; independently re-derived by a second agent instructed to refute',
    })
  }
}

const pinned = PINNED.map((p) => ({
  ...p,
  defaultBranch: 'main',
  headCommit: pins[p.id] ?? '',
  relevantPaths: [],
  claimsToVerify: [],
  resolutionStatus: 'pinned',
  independentlyVerified: true,
  alternatives: [],
  notes: 'Pinned before this rebuild in docs/rebuild/research/_resolution/INHERITED-UPSTREAM-PINS.json and audited in LICENSE-AUDIT.md. Reused rather than re-resolved.',
  redistribution: redistribution(p.licence, p.licenceFilePresent, ''),
  provenance: 'docs/rebuild/research/_resolution/INHERITED-UPSTREAM-PINS.json',
}))

const sources = [...pinned, ...resolved]

const registry = {
  schemaVersion: 1,
  generatedBy: 'tools/build-source-registry.mjs',
  generatedFrom: ['docs/rebuild/research/_resolution/INHERITED-UPSTREAM-PINS.json', 'docs/rebuild/research/_resolution/RAW-RESOLUTION.json'],
  doNotEditByHand: true,
  counts: {
    total: sources.length,
    resolved: sources.filter((s) => s.resolutionStatus === 'resolved' || s.resolutionStatus === 'pinned').length,
    ambiguous: sources.filter((s) => s.resolutionStatus === 'ambiguous').length,
    unresolved: sources.filter((s) => s.resolutionStatus === 'unresolved').length,
    redistributable: sources.filter((s) => s.redistribution.status === 'allowed-with-notice').length,
    forbidden: sources.filter((s) => s.redistribution.status === 'forbidden').length,
  },
  sources,
}

const md = []
md.push('---')
md.push('title: Canonical source registry')
md.push('state: S1_SOURCE_RESOLUTION')
md.push('status: generated')
md.push('generator: tools/build-source-registry.mjs')
md.push('ai_generated: "(C)"')
md.push('---')
md.push('')
md.push('# Source registry')
md.push('')
md.push('Generated. Do not hand-edit — change the generator or the evidence instead.')
md.push('')
md.push(`${registry.counts.total} sources: ${registry.counts.resolved} resolved or pinned, ${registry.counts.ambiguous} ambiguous, ${registry.counts.unresolved} unresolved. ${registry.counts.redistributable} may be redistributed with notice; ${registry.counts.forbidden} may not be copied at all.`)
md.push('')
md.push('## Redistribution status is the first thing to read')
md.push('')
md.push('| Source | Licence | Licence file | May we copy text? |')
md.push('| --- | --- | --- | --- |')
for (const s of sources) {
  const mark = s.redistribution.status === 'allowed-with-notice' ? 'yes, with notice' : s.redistribution.status === 'forbidden' ? '**no**' : 'review first'
  md.push(`| ${s.id} | ${s.licence || '(none)'} | ${s.licenceFilePresent ? 'yes' : 'no'} | ${mark} |`)
}
md.push('')
md.push('## Sources')
md.push('')
for (const s of sources) {
  md.push(`### ${s.id}`)
  md.push('')
  md.push(`| | |`)
  md.push(`| --- | --- |`)
  md.push(`| repository | ${s.repoUrl}${s.path ? ` (path \`${s.path}\`)` : ''} |`)
  md.push(`| commit | \`${s.headCommit || 'NOT PINNED'}\` |`)
  md.push(`| licence | ${s.licence || '**none declared**'} |`)
  md.push(`| redistribution | **${s.redistribution.status}** — ${s.redistribution.reason} |`)
  md.push(`| role in SiteSmith | ${s.role} |`)
  md.push(`| resolution | ${s.resolutionStatus}${s.independentlyVerified === true ? ', independently confirmed' : s.independentlyVerified === false ? ', **disputed by verifier**' : ''} |`)
  if (s.alternatives.length) md.push(`| alternatives considered | ${s.alternatives.map((a) => `${a.name} (${a.confidence})`).join(', ')} |`)
  md.push('')
  if (s.whyRelevant) md.push(`${s.whyRelevant}`)
  md.push('')
  if (s.relevantPaths.length) {
    md.push(`Paths that matter: ${s.relevantPaths.slice(0, 10).map((p) => `\`${p}\``).join(', ')}`)
    md.push('')
  }
  if (s.claimsToVerify.length) {
    md.push('Claims an autopsy must test:')
    for (const c of s.claimsToVerify.slice(0, 5)) md.push(`- ${c}`)
    md.push('')
  }
  if (s.resolutionStatus === 'ambiguous') {
    md.push(`> **Ambiguous.** ${s.notes.slice(0, 900)}`)
    md.push('')
  }
}

const jsonPath = join(root, 'docs/rebuild/SOURCE-REGISTRY.json')
const mdPath = join(root, 'docs/rebuild/SOURCE-REGISTRY.md')
const jsonOut = JSON.stringify(registry, null, 2) + '\n'
const mdOut = md.join('\n') + '\n'

if (process.argv.includes('--check')) {
  const stale = [
    [jsonPath, jsonOut],
    [mdPath, mdOut],
  ].filter(([p, want]) => {
    try {
      return readFileSync(p, 'utf8') !== want
    } catch {
      return true
    }
  })
  if (stale.length) {
    console.error(`stale: ${stale.map(([p]) => p).join(', ')} — run node tools/build-source-registry.mjs`)
    process.exit(1)
  }
  console.log('source registry is current')
} else {
  writeFileSync(jsonPath, jsonOut)
  writeFileSync(mdPath, mdOut)
  console.log(`${registry.counts.total} sources -> SOURCE-REGISTRY.json + .md`)
  console.log(`  redistributable: ${registry.counts.redistributable}`)
  console.log(`  forbidden:       ${registry.counts.forbidden}`)
  console.log(`  ambiguous:       ${registry.counts.ambiguous}`)
}
