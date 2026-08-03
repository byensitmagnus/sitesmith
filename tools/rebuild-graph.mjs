#!/usr/bin/env node
// Validator and query surface for docs/rebuild/CONTEXT-GRAPH.jsonl.
//
// The graph earns its place only if it answers questions the prose cannot. The
// queries below are the ones the rebuild charter actually asks. If a query here
// stops being asked, delete it rather than keeping it for tidiness.
//
//   node tools/rebuild-graph.mjs validate
//   node tools/rebuild-graph.mjs solves <problem-id>
//   node tools/rebuild-graph.mjs overlap
//   node tools/rebuild-graph.mjs conflicts
//   node tools/rebuild-graph.mjs unevidenced
//   node tools/rebuild-graph.mjs validates <capability-id>
//   node tools/rebuild-graph.mjs weak [threshold]
//   node tools/rebuild-graph.mjs removable
//   node tools/rebuild-graph.mjs attribution
//   node tools/rebuild-graph.mjs stats

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const graphPath = join(root, 'docs/rebuild/CONTEXT-GRAPH.jsonl')
const schemaPath = join(root, 'docs/rebuild/CONTEXT-GRAPH.schema.json')

const schema = JSON.parse(readFileSync(schemaPath, 'utf8'))
const NODE_TYPES = new Set(schema.node.types)
const EDGE_TYPES = new Set(schema.edge.types)

function load() {
  const nodes = new Map()
  const edges = []
  const problems = []
  const lines = readFileSync(graphPath, 'utf8').split('\n')

  lines.forEach((raw, i) => {
    const line = raw.trim()
    if (!line) return
    const at = `line ${i + 1}`
    let rec
    try {
      rec = JSON.parse(line)
    } catch (err) {
      problems.push(`${at}: not valid JSON — ${err.message}`)
      return
    }
    if (rec.kind === 'node') {
      if (!rec.id) return problems.push(`${at}: node without id`)
      if (!NODE_TYPES.has(rec.type)) problems.push(`${at}: unknown node type "${rec.type}"`)
      if (!rec.label) problems.push(`${at}: node ${rec.id} has no label`)
      if (nodes.has(rec.id)) problems.push(`${at}: duplicate node id "${rec.id}"`)
      nodes.set(rec.id, { ...rec, line: i + 1 })
    } else if (rec.kind === 'edge') {
      if (!EDGE_TYPES.has(rec.type)) problems.push(`${at}: unknown edge type "${rec.type}"`)
      if (!rec.from || !rec.to) problems.push(`${at}: edge missing from/to`)
      edges.push({ ...rec, line: i + 1 })
    } else {
      problems.push(`${at}: record kind must be "node" or "edge", got "${rec.kind}"`)
    }
  })

  for (const e of edges) {
    if (e.from && !nodes.has(e.from)) problems.push(`line ${e.line}: edge from unknown node "${e.from}"`)
    if (e.to && !nodes.has(e.to)) problems.push(`line ${e.line}: edge to unknown node "${e.to}"`)
  }

  return { nodes, edges, problems }
}

const out = (rows) => {
  if (!rows.length) return console.log('(none)')
  for (const r of rows) console.log(r)
}
const label = (nodes, id) => (nodes.get(id)?.label ?? '??').slice(0, 110)

const commands = {
  validate({ nodes, edges, problems }) {
    console.log(`${nodes.size} nodes, ${edges.length} edges`)
    if (problems.length) {
      console.log(`\nFAIL — ${problems.length} problem(s):`)
      out(problems.map((p) => `  ${p}`))
      process.exit(1)
    }
    console.log('OK')
  },

  // Which mechanism solves this problem?
  solves({ nodes, edges }, id) {
    if (!id) return console.error('usage: solves <problem-id>'), process.exit(2)
    out(
      edges
        .filter((e) => e.type === 'SOLVES' && e.to === id)
        .map((e) => `${e.from}  —  ${label(nodes, e.from)}${e.why ? `\n    why: ${e.why}` : ''}`),
    )
  },

  // Which mechanisms overlap, and therefore compete for the same slot?
  overlap({ nodes, edges }) {
    out(
      edges
        .filter((e) => e.type === 'OVERLAPS')
        .map((e) => `${e.from} <-> ${e.to}\n    ${label(nodes, e.from)}\n    ${label(nodes, e.to)}${e.why ? `\n    why: ${e.why}` : ''}`),
    )
  },

  // Which rules conflict?
  conflicts({ nodes, edges }) {
    out(
      edges
        .filter((e) => e.type === 'CONFLICTS_WITH')
        .map((e) => `${e.from} >< ${e.to}\n    ${label(nodes, e.from)}\n    ${label(nodes, e.to)}${e.why ? `\n    why: ${e.why}` : ''}`),
    )
  },

  // Which decisions rest on nothing?
  unevidenced({ nodes, edges }) {
    const validated = new Set(edges.filter((e) => e.type === 'VALIDATED_BY').map((e) => e.from))
    out(
      [...nodes.values()]
        .filter((n) => n.type === 'Decision' || n.type === 'Mechanism')
        .filter((n) => !validated.has(n.id) && !n.evidence)
        .map((n) => `${n.id}  —  ${n.label}`),
    )
  },

  // Which tests validate this capability?
  validates({ nodes, edges }, id) {
    if (!id) return console.error('usage: validates <capability-id>'), process.exit(2)
    out(
      edges
        .filter((e) => (e.type === 'VALIDATED_BY' || e.type === 'TESTED_BY') && e.from === id)
        .map((e) => `${e.to}  —  ${label(nodes, e.to)}`),
    )
  },

  // Which modules stand on a weak assumption?
  weak({ nodes, edges }, threshold = '0.6') {
    const limit = Number(threshold)
    const shaky = new Set([...nodes.values()].filter((n) => typeof n.confidence === 'number' && n.confidence < limit).map((n) => n.id))
    out(
      edges
        .filter((e) => (e.type === 'DEPENDS_ON' || e.type === 'REQUIRES' || e.type === 'ADAPTED_FROM') && shaky.has(e.to))
        .map((e) => `${e.from} depends on ${e.to} (confidence ${nodes.get(e.to).confidence})`),
    )
  },

  // What can be deleted without breaking anything?
  removable({ nodes, edges }) {
    const referenced = new Set(edges.flatMap((e) => [e.from, e.to]))
    out(
      [...nodes.values()]
        .filter((n) => !referenced.has(n.id) && n.type !== 'WorkflowState')
        .map((n) => `${n.id}  —  ${n.label}`),
    )
  },

  // Who must be credited?
  attribution({ nodes, edges }) {
    const licenceOf = new Map(edges.filter((e) => e.type === 'REQUIRES').map((e) => [e.from, e.to]))
    out(
      [...nodes.values()]
        .filter((n) => n.type === 'Source')
        .map((n) => `${n.id}  ${n.source ?? '(no repo)'}@${(n.commit ?? '').slice(0, 8) || '?'}  licence=${licenceOf.get(n.id) ?? 'UNKNOWN'}`),
    )
  },

  stats({ nodes, edges }) {
    const count = (list, key) =>
      [...list.reduce((m, x) => m.set(x[key], (m.get(x[key]) ?? 0) + 1), new Map())]
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => `  ${String(v).padStart(4)}  ${k}`)
    console.log('nodes by type:')
    out(count([...nodes.values()], 'type'))
    console.log('edges by type:')
    out(count(edges, 'type'))
  },
}

const [cmd, ...args] = process.argv.slice(2)
const fn = commands[cmd]
if (!fn) {
  console.error(`unknown command "${cmd ?? ''}". one of: ${Object.keys(commands).join(', ')}`)
  process.exit(2)
}
fn(load(), ...args)
