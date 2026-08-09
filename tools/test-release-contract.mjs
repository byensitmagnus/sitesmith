#!/usr/bin/env node
/**
 * `sitesmith release` executes the contract, not an approximation of it. Original work, MIT.
 *
 *   node tools/test-release-contract.mjs
 *
 * The contract in `product/pipeline.json` is specific in three places the first release
 * command was not:
 *
 *   "a journey for buy, operate and redesign"   — three surfaces, not every surface
 *   "a compare against the build that ships"    — check and compare, not check alone
 *
 * and, implied by both, that every check in one release measures the same build. A release
 * that verifies one URL and journeys another has checked two things and shipped one.
 *
 * Every case here watches invocation. The engines are stubs that record their own argv, so a
 * case can ask what release ran and with which arguments, rather than reading its prose.
 */

import { mkdtemp, rm, writeFile, mkdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const pipeline = JSON.parse(await readFile(join(ROOT, 'product/pipeline.json'), 'utf8'));

let failed = 0;
const check = (name, ok, detail = '') => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}${ok || !detail ? '' : `\n          ${detail}`}`);
  if (!ok) failed++;
};

const spy = (log, name, exit) => `#!/usr/bin/env node
import { appendFileSync } from 'node:fs';
appendFileSync(${JSON.stringify(log)}, JSON.stringify({ script: ${JSON.stringify(name)}, argv: process.argv.slice(2) }) + '\\n');
process.exit(${exit});
`;

const pathToUrl = (p) => new URL(`file:///${p.replace(/\\/g, '/')}`).href;
const scratch = [];

/* One release, with every engine stubbed. `surfaces` is what `build` records in state.json,
   and `target` is the argument a person passes to `release`. */
async function releaseRun({ surfaces = ['buy'], target = null, exits = {} } = {}) {
  const dir = await mkdtemp(join(tmpdir(), 'sitesmith-relc-'));
  scratch.push(dir);
  const skill = join(dir, 'skill', 'scripts');
  const project = join(dir, 'project');
  const log = join(dir, 'calls.jsonl');
  await mkdir(skill, { recursive: true });
  await mkdir(join(project, '.sitesmith'), { recursive: true });
  await writeFile(log, '', 'utf8');
  await writeFile(join(project, '.sitesmith', 'state.json'),
    JSON.stringify({ v: 1, name: 'Bench', surfaces }, null, 2), 'utf8');

  const all = { 'verify.mjs': 0, 'journey.mjs': 0, 'contract.mjs': 0, 'gate.mjs': 0, 'ledger.mjs': 0, ...exits };
  for (const [name, exit] of Object.entries(all)) await writeFile(join(skill, name), spy(log, name, exit), 'utf8');

  const runner = join(dir, 'run.mjs');
  await writeFile(runner, `import { release } from ${JSON.stringify(pathToUrl(join(ROOT, 'skills/sitesmith-v3/commands.mjs')))};
const code = await release(${JSON.stringify(join(dir, 'skill'))}, ${JSON.stringify(project)}, { target: ${JSON.stringify(target)} });
console.log('RELEASE_EXIT=' + code);
`, 'utf8');

  const r = spawnSync(process.execPath, [runner], { encoding: 'utf8' });
  const calls = (await readFile(log, 'utf8')).trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
  return {
    calls, out: `${r.stdout}${r.stderr}`,
    exit: Number((`${r.stdout}`.match(/RELEASE_EXIT=(-?\d+)/) ?? [])[1]),
    of: (name) => calls.filter((c) => c.script === name),
  };
}

console.log('\n  the release contract, as published\n');

try {
  /* The contract is read from the file that publishes it. A test carrying its own copy of
     "buy, operate and redesign" would pass while the published promise drifted. */
  const requires = pipeline.release?.requires ?? [];
  const journeyLine = requires.find((r) => /journey/i.test(r)) ?? '';
  const compareLine = requires.find((r) => /compare/i.test(r)) ?? '';
  check('the contract names the surfaces a journey is required for',
    /buy/.test(journeyLine) && /operate/.test(journeyLine) && /redesign/.test(journeyLine),
    JSON.stringify(journeyLine));
  check('and it asks for a compare against the build, not only a check',
    /compare/i.test(compareLine) && /check/i.test(compareLine), JSON.stringify(compareLine));

  /* ── R1, the journey is required of three surfaces, not of every surface ── */
  console.log('\n  R1, a journey where the contract asks for one\n');

  for (const surface of ['buy', 'operate', 'redesign']) {
    const r = await releaseRun({ surfaces: [surface] });
    check(`${surface}: the journey runs`, r.of('journey.mjs').length === 1,
      `${r.of('journey.mjs').length} call(s); ran ${r.calls.map((c) => c.script).join(', ')}`);
  }
  for (const surface of ['read', 'experience']) {
    const r = await releaseRun({ surfaces: [surface] });
    check(`${surface}: the journey does not run, because the contract does not ask for one`,
      r.of('journey.mjs').length === 0,
      `ran ${r.calls.map((c) => c.script).join(', ')}`);
    /* With a target, so the compare requirement is met and the only thing that could still
       block this surface is the journey requirement. Without one the release withholds for
       the compare, which is right and is a different question. */
    const served = await releaseRun({ surfaces: [surface], target: 'http://127.0.0.1:4399/' });
    check(`  and ${surface} reaches the ledger once nothing else is missing`,
      served.of('ledger.mjs').length === 1 && served.exit === 0,
      `${served.of('ledger.mjs').length} ledger call(s), exit ${served.exit}; ran ${served.calls.map((c) => c.script).join(', ')}`);
  }
  const mixed = await releaseRun({ surfaces: ['read', 'operate'] });
  check('a project with one surface that needs a journey runs it',
    mixed.of('journey.mjs').length === 1, `ran ${mixed.calls.map((c) => c.script).join(', ')}`);

  const unknown = await releaseRun({ surfaces: [] });
  check('a project whose surface was never recorded runs the journey rather than assuming',
    unknown.of('journey.mjs').length === 1,
    `an unrecorded surface is not evidence that no journey is owed; ran ${unknown.calls.map((c) => c.script).join(', ')}`);

  /* ── R2, one release measures one build ─────────────────────────────────── */
  console.log('\n  R2, every check measures the same build\n');

  const url = 'http://127.0.0.1:4399/';
  const targeted = await releaseRun({ surfaces: ['buy'], target: url });
  const jArgv = targeted.of('journey.mjs')[0]?.argv ?? [];
  check('the journey is given the release target as its base',
    jArgv.includes('--base') && jArgv[jArgv.indexOf('--base') + 1] === url,
    `journey.mjs ${JSON.stringify(jArgv)}; without --base it falls back to localhost:5173 and `
    + 'the release verifies one build and journeys another');
  const vArgv = targeted.of('verify.mjs')[0]?.argv ?? [];
  check('and verify is given the same target', vArgv.includes(url), JSON.stringify(vArgv));

  /* ── R3, check and compare ──────────────────────────────────────────────── */
  console.log('\n  R3, the contract is checked and compared\n');

  const contractCalls = targeted.of('contract.mjs').map((c) => c.argv);
  check('contract.mjs check runs', contractCalls.some((a) => a[0] === 'check'),
    JSON.stringify(contractCalls));
  check('and contract.mjs compare runs against the release target',
    contractCalls.some((a) => a[0] === 'compare' && a.includes('--url') && a[a.indexOf('--url') + 1] === url),
    JSON.stringify(contractCalls));

  /* With nothing to render against, the requirement is not met and must not be reported as
     met. The published contract already has a code for that. */
  const noTarget = await releaseRun({ surfaces: ['buy'], target: null });
  const withoutTarget = noTarget.of('contract.mjs').map((c) => c.argv);
  check('with no renderable target, compare does not run',
    !withoutTarget.some((a) => a[0] === 'compare'), JSON.stringify(withoutTarget));
  check('and the release says the requirement is not proved rather than passing quietly',
    noTarget.exit === 3, `exit ${noTarget.exit}\n          ${noTarget.out.split('\n').slice(-10).join('\n          ')}`);
  check('and nothing is recorded in the ledger', noTarget.of('ledger.mjs').length === 0,
    `${noTarget.of('ledger.mjs').length} ledger call(s)`);

  /* A failing compare stops the release exactly as a failing check does. */
  const badCompare = await releaseRun({ surfaces: ['buy'], target: url, exits: { 'contract.mjs': 1 } });
  check('a contract that does not compare clean is not released',
    badCompare.of('ledger.mjs').length === 0 && badCompare.exit === 1,
    `exit ${badCompare.exit}, ${badCompare.of('ledger.mjs').length} ledger call(s)`);
} finally {
  for (const d of scratch) await rm(d, { recursive: true, force: true });
}

console.log(`\n  ${failed ? `${failed} failing` : 'release executes the contract product/pipeline.json publishes'}\n`);
process.exit(failed ? 1 : 0);
