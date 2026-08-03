#!/usr/bin/env node
/**
 * The run-state suite, including the one case that matters: a run survives the process
 * that opened it. Original work, MIT.
 *
 *   node scripts/test-state.mjs
 */

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(here, 'state.mjs');
const tmp = mkdtempSync(join(tmpdir(), 'sitesmith-state-test-'));

let failed = 0;
const results = [];

const run = (...args) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });

function expect(name, args, code, check) {
  const r = run(...args);
  const out = `${r.stdout ?? ''}${r.stderr ?? ''}`;
  const ok = r.status === code && (!check || check(out));
  if (!ok) failed++;
  results.push(`${ok ? '  ok  ' : '  FAIL'} ${name} -> exit ${r.status}, expected ${code}`);
  if (!ok) results.push(`        ${out.trim().split('\n').slice(0, 4).join('\n        ')}`);
  return out;
}

const A = join(tmp, 'run-a');

expect('resume before anything exists withholds rather than inventing', ['resume', A], 3);
expect('open starts a run', ['open', A, 'a two-person bindery in Odense'], 0);
expect('opening a second run over a live one is refused', ['open', A, 'something else'], 1,
  (o) => /already open/.test(o));

expect('a step becomes the active node', ['step', A, 'chose the ledger thesis', '--kind', 'decision'], 0);
expect('proof attaches to the active node', ['proof', A, 'node scripts/verify.mjs http://localhost:4321/'], 0,
  (o) => /proof/.test(o));
expect('a blocker names what it blocks', ['block', A, 'no photograph of the bench exists'], 0,
  (o) => /blocks/.test(o));
expect('check passes on a well-formed graph', ['check', A], 0);

/* The mechanism, stated as a test. Every command above ran in its own process and exited.
   Nothing was held in memory between them. This is the whole of what was taken from
   ruflo: the run outlives the process, and the next one can say what was happening. */
const resumed = expect('a new process can say what was happening', ['resume', A], 0,
  (o) => /was doing/.test(o) && /chose the ledger thesis/.test(o) && /BLOCKED/.test(o));
if (!/no photograph of the bench exists/.test(resumed)) {
  failed++;
  results.push('  FAIL resume did not carry the blocker text');
}

/* The graph half. A malformed edge, an unknown kind and an orphan blocker each have to be
   refused by name, or `check` is a file that always says yes. */
const B = join(tmp, 'run-b');
run('open', B, 'a subject');
const p = join(B, '.sitesmith', 'run-state.json');
const broken = JSON.parse(readFileSync(p, 'utf8'));
broken.nodes.push({ id: 'n02', kind: 'invented', label: 'x', active: false, closed: false });
broken.edges.push({ kind: 'sideways', from: 'n01', to: 'n02' });
broken.edges.push({ kind: 'after', from: 'n01', to: 'n99' });
broken.nodes.push({ id: 'n03', kind: 'blocker', label: 'blocks nothing', active: false, closed: false });
writeFileSync(p, JSON.stringify(broken, null, 2));
expect('check names an unknown node kind, an unknown edge kind, a dangling edge and an orphan blocker',
  ['check', B], 1,
  (o) => /unknown kind "invented"/.test(o) && /unknown kind "sideways"/.test(o)
    && /n99, which is not a node/.test(o) && /blocks nothing|blocker that blocks nothing/.test(o));

/* The cap. Twenty-five live nodes is the design, so the twenty-sixth has to be refused
   rather than accepted with a warning nobody reads. */
const C = join(tmp, 'run-c');
run('open', C, 'a subject');
const cp = join(C, '.sitesmith', 'run-state.json');
const full = JSON.parse(readFileSync(cp, 'utf8'));
for (let i = 2; i <= 25; i++) {
  full.nodes.push({ id: `n${String(i).padStart(2, '0')}`, kind: 'decision', label: `d${i}`, active: false, closed: false });
}
writeFileSync(cp, JSON.stringify(full, null, 2));
expect('the twenty-sixth live node is refused, with the cap named', ['step', C, 'one too many'], 1,
  (o) => /the cap is 25/.test(o));

/* Half-written state is worse than none, so the write goes through a rename. Proven by
   its absence: no .tmp file survives a successful run. */
const leftovers = existsSync(`${p}.tmp`);
if (leftovers) failed++;
results.push(`${leftovers ? '  FAIL' : '  ok  '} no half-written .tmp file is left behind`);

for (const r of results) console.log(r);
console.log(`\n${failed ? `${failed} case(s) failed` : `all ${results.length} cases agreed`}\n`);
console.log(`working files: ${tmp}`);
process.exit(failed ? 1 : 0);
