#!/usr/bin/env node
/**
 * Durable run state, as a small typed graph. Original work, MIT.
 *
 *   node scripts/state.mjs open   <dir> <subject>     start a run, or refuse if one is open
 *   node scripts/state.mjs step   <dir> <node> --kind <kind> [--after <id>] [--why <text>]
 *   node scripts/state.mjs block  <dir> <text>        record what is stopping the active node
 *   node scripts/state.mjs proof  <dir> <path-or-cmd> attach evidence to the active node
 *   node scripts/state.mjs done   <dir> [--note <text>]
 *   node scripts/state.mjs resume <dir> [--json]      what was happening, and what is next
 *   node scripts/state.mjs check  <dir>               validate the graph
 *
 * Two upstream mechanisms meet here, and they are different mechanisms even though they
 * share a file.
 *
 * From `ruflo`: a long run must survive being interrupted. Its answer is a swarm platform
 * with a vector store, which is the wrong size for a skill that builds one website, so
 * what is taken is the property rather than the machinery: state that outlives the
 * process, and a resume that tells the next session what was happening rather than making
 * it re-derive that from the files on disk.
 *
 * From the graph-engineering material: state as typed nodes and typed edges rather than a
 * log, so that "why did this happen" is a traversal and not a search. What is taken is the
 * typing and the edge kinds. What is not taken is the nine-stage extraction pipeline and
 * the graph database, because a run has tens of nodes, not millions.
 *
 * The cap is the design. Twenty-five live nodes, and `open` refuses to start a run whose
 * graph is already full, because a state file that grows without bound becomes a second
 * project to maintain and then nobody reads it. A run that needs more than twenty-five
 * nodes is a run that should have been two runs.
 *
 * Exit codes: 0 fine, 1 refused, 2 the invocation was wrong, 3 nothing to report.
 */

import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

const MAX_LIVE_NODES = 25;

/* The node kinds. Short and closed on purpose: an open vocabulary is a log wearing a
   schema. Each one is a thing a later session needs to find by kind. */
export const NODE_KINDS = new Set([
  'brief',      // what was asked, in the client's words
  'decision',   // a choice that closed off alternatives
  'build',      // a file or set of files produced
  'check',      // a gate that ran, with its verdict
  'blocker',    // something that stopped progress
  'handoff',    // work passed to another agent or another session
]);

/* The edge kinds. `after` is sequence, `because` is causation, `blocks` is an obstruction,
   `proves` attaches evidence. Causation and sequence are separate because a run does
   things in an order that is not always the order that explains them. */
export const EDGE_KINDS = new Set(['after', 'because', 'blocks', 'proves']);

const pathOf = (dir) => join(dir, '.sitesmith', 'run-state.json');

const die = (code, ...lines) => {
  for (const l of lines) console.error(l);
  process.exit(code);
};

async function read(dir) {
  const p = pathOf(dir);
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(await readFile(p, 'utf8'));
  } catch (e) {
    die(1, `run-state.json at ${p} is not readable JSON: ${String(e.message).split('\n')[0]}`);
  }
  return null;
}

/* Written through a temporary file and renamed. A run state that is half-written after an
   interrupted process is worse than none: the next session reads it, believes it, and
   carries on from a state that never existed. */
async function write(dir, state) {
  const p = pathOf(dir);
  await mkdir(dirname(p), { recursive: true });
  const tmp = `${p}.tmp`;
  await writeFile(tmp, `${JSON.stringify(state, null, 2)}\n`);
  await rename(tmp, p);
}

const nextId = (state) => `n${String(state.nodes.length + 1).padStart(2, '0')}`;

export function validate(state) {
  const problems = [];
  if (!state || typeof state !== 'object') return ['not an object'];
  if (!Array.isArray(state.nodes)) problems.push('nodes is not an array');
  if (!Array.isArray(state.edges)) problems.push('edges is not an array');
  if (problems.length) return problems;

  const ids = new Set();
  for (const n of state.nodes) {
    if (!n.id) problems.push('a node has no id');
    if (ids.has(n.id)) problems.push(`duplicate node id ${n.id}`);
    ids.add(n.id);
    if (!NODE_KINDS.has(n.kind)) problems.push(`${n.id}: unknown kind ${JSON.stringify(n.kind)}`);
    if (!n.label) problems.push(`${n.id}: no label`);
  }
  for (const e of state.edges) {
    if (!EDGE_KINDS.has(e.kind)) problems.push(`edge ${e.from}->${e.to}: unknown kind ${JSON.stringify(e.kind)}`);
    if (!ids.has(e.from)) problems.push(`edge from ${e.from}, which is not a node`);
    if (!ids.has(e.to)) problems.push(`edge to ${e.to}, which is not a node`);
  }

  const live = state.nodes.filter((n) => !n.closed);
  if (live.length > MAX_LIVE_NODES) {
    problems.push(`${live.length} live nodes, over the cap of ${MAX_LIVE_NODES}. Close some, or this was two runs.`);
  }

  const active = state.nodes.filter((n) => n.active);
  if (active.length > 1) problems.push(`${active.length} active nodes; exactly one may be active`);
  if (!state.done && active.length === 0 && state.nodes.length) problems.push('no active node and the run is not done');

  /* A blocker with nothing blocked is a note, and a node blocked by nothing is a claim.
     Both are the kind of half-recorded state that makes a resume misleading. */
  for (const n of state.nodes.filter((x) => x.kind === 'blocker')) {
    if (!state.edges.some((e) => e.kind === 'blocks' && e.from === n.id)) {
      problems.push(`${n.id} is a blocker that blocks nothing`);
    }
  }
  return problems;
}

const argv = process.argv.slice(2);
const verb = argv[0];
const dir = argv[1];
const rest = argv.slice(2);
const flag = (name) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? rest[i + 1] : null;
};
const positional = rest.filter((a, i) => !a.startsWith('--') && !(i > 0 && rest[i - 1].startsWith('--')));
const JSON_OUT = argv.includes('--json');

const USAGE = 'usage: state.mjs <open|step|block|proof|done|resume|check> <dir> ...';
if (!verb || !dir) die(2, USAGE);

const state = await read(dir);

if (verb === 'open') {
  const subject = positional.join(' ').trim();
  if (!subject) die(2, 'open needs a subject: what is being built, in the client\'s words');
  if (state && !state.done) {
    die(1, `a run is already open in ${dir} on "${state.subject}".`,
      'Finish it with `done`, or resume it. Two open runs in one directory is how state stops being trusted.');
  }
  const fresh = {
    v: 1,
    subject,
    opened: null,          // stamped by the caller if it wants a time; this script has no clock it trusts
    done: false,
    nodes: [{ id: 'n01', kind: 'brief', label: subject, active: true, closed: false }],
    edges: [],
  };
  await write(dir, fresh);
  console.log(`opened a run on "${subject}" in ${pathOf(dir)}`);
  process.exit(0);
}

if (!state) die(3, `no run state in ${dir}. Start one with: node scripts/state.mjs open ${dir} "<subject>"`);

if (verb === 'step') {
  const label = positional.join(' ').trim();
  const kind = flag('kind') ?? 'decision';
  if (!label) die(2, 'step needs a label');
  if (!NODE_KINDS.has(kind)) die(2, `--kind must be one of: ${[...NODE_KINDS].join(', ')}`);
  const live = state.nodes.filter((n) => !n.closed);
  if (live.length >= MAX_LIVE_NODES) {
    die(1, `${live.length} live nodes already, and the cap is ${MAX_LIVE_NODES}.`,
      'Close what is finished before opening more. A state file nobody can read is a state file nobody reads.');
  }
  const prev = state.nodes.find((n) => n.active);
  const id = nextId(state);
  for (const n of state.nodes) n.active = false;
  state.nodes.push({ id, kind, label, active: true, closed: false, why: flag('why') ?? null });
  const after = flag('after') ?? prev?.id;
  if (after) state.edges.push({ kind: 'after', from: after, to: id });
  if (flag('why') && prev) state.edges.push({ kind: 'because', from: id, to: prev.id });
  if (prev && kind !== 'blocker') prev.closed = true;
  await write(dir, state);
  console.log(`${id}  ${kind}  ${label}`);
  process.exit(0);
}

if (verb === 'block') {
  const text = positional.join(' ').trim();
  if (!text) die(2, 'block needs a description of what is stopping the work');
  const active = state.nodes.find((n) => n.active);
  if (!active) die(1, 'nothing is active, so there is nothing to block');
  const id = nextId(state);
  state.nodes.push({ id, kind: 'blocker', label: text, active: false, closed: false });
  state.edges.push({ kind: 'blocks', from: id, to: active.id });
  await write(dir, state);
  console.log(`${id}  blocker  ${text}\n     blocks ${active.id} ${active.label}`);
  process.exit(0);
}

if (verb === 'proof') {
  const what = positional.join(' ').trim();
  if (!what) die(2, 'proof needs a path or a command');
  const active = state.nodes.find((n) => n.active);
  if (!active) die(1, 'nothing is active, so there is nothing to attach evidence to');
  const id = nextId(state);
  state.nodes.push({ id, kind: 'check', label: what, active: false, closed: true });
  state.edges.push({ kind: 'proves', from: id, to: active.id });
  await write(dir, state);
  console.log(`${id}  proof  ${what}  ->  ${active.id}`);
  process.exit(0);
}

if (verb === 'done') {
  state.done = true;
  for (const n of state.nodes) { n.active = false; n.closed = true; }
  if (flag('note')) state.note = flag('note');
  await write(dir, state);
  console.log(`closed the run on "${state.subject}", ${state.nodes.length} node(s)`);
  process.exit(0);
}

if (verb === 'check') {
  const problems = validate(state);
  if (JSON_OUT) {
    console.log(JSON.stringify({ problems, nodes: state.nodes.length, edges: state.edges.length }, null, 2));
    process.exit(problems.length ? 1 : 0);
  }
  if (!problems.length) {
    console.log(`\n  run state valid: ${state.nodes.length} node(s), ${state.edges.length} edge(s), ${state.nodes.filter((n) => !n.closed).length} live\n`);
    process.exit(0);
  }
  console.log('\n  REFUSED\n');
  for (const p of problems) console.log(`    ${p}`);
  console.log('');
  process.exit(1);
}

if (verb === 'resume') {
  const active = state.nodes.find((n) => n.active);
  const blockers = state.nodes.filter((n) => n.kind === 'blocker' && !n.closed);
  const proofs = state.edges.filter((e) => e.kind === 'proves');
  if (JSON_OUT) {
    console.log(JSON.stringify({ subject: state.subject, done: state.done, active, blockers, proofs }, null, 2));
    process.exit(0);
  }
  console.log(`\n  ${state.subject}\n`);
  console.log(`  ${state.nodes.length} node(s), ${state.edges.length} edge(s), ${state.nodes.filter((n) => !n.closed).length} live`);
  if (state.done) {
    console.log(`\n  the run is closed${state.note ? `: ${state.note}` : ''}\n`);
    process.exit(0);
  }
  if (active) {
    console.log(`\n  was doing   ${active.id}  ${active.kind}  ${active.label}`);
    const because = state.edges.filter((e) => e.kind === 'because' && e.from === active.id);
    for (const e of because) {
      const n = state.nodes.find((x) => x.id === e.to);
      if (n) console.log(`  because     ${n.label}`);
    }
    const mine = proofs.filter((e) => e.to === active.id);
    for (const e of mine) {
      const n = state.nodes.find((x) => x.id === e.from);
      if (n) console.log(`  proved by   ${n.label}`);
    }
  }
  if (blockers.length) {
    console.log('');
    for (const b of blockers) console.log(`  BLOCKED     ${b.label}`);
  }
  console.log('');
  process.exit(0);
}

die(2, USAGE);
