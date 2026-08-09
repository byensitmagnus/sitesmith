#!/usr/bin/env node
/**
 * `release` executes the contract it says it executes. Original work, MIT.
 *
 *   node tools/test-release-integrity.mjs
 *
 * `sitesmith release` was written to make `product/pipeline.json`'s release contract
 * executable. It ran four checks in order and committed only on a clean sweep, which is the
 * shape of the contract. Three things about the detail were wrong, and all three are the
 * same mistake: the command approximated the requirement instead of reading it.
 *
 * The contract says "a journey for buy, operate and redesign". Release demanded one for every
 * surface, so a reading page could not ship for want of a journey the contract never asked it
 * to have. It says "a compare against the build that ships", and release ran `contract check`
 * and not `compare`, so a requirement was reported as met by a step that does not test it.
 * And release ran `verify` against the target it was given while `journey` fell back to its
 * own default, so one release could measure two different servers.
 *
 * Every case watches invocation. Stubs record their argv, so what is under test is what
 * release actually calls and with what, not what it prints.
 */

import { mkdtemp, rm, writeFile, mkdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const COMMANDS = join(ROOT, 'skills/sitesmith-v3/commands.mjs');
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

/* Every engine stubbed and clean, so the only thing a case changes is the state of the
   project and the argument release was given. */
async function releaseRun({ surface = null, target = undefined, exits = {} } = {}) {
  const dir = await mkdtemp(join(tmpdir(), 'sitesmith-relint-'));
  scratch.push(dir);
  const skill = join(dir, 'skill', 'scripts');
  const project = join(dir, 'project');
  const log = join(dir, 'calls.jsonl');
  await mkdir(skill, { recursive: true });
  await mkdir(join(project, '.sitesmith'), { recursive: true });
  await writeFile(log, '', 'utf8');
  const all = { 'verify.mjs': 0, 'journey.mjs': 0, 'contract.mjs': 0, 'gate.mjs': 0, 'ledger.mjs': 0, ...exits };
  for (const [name, exit] of Object.entries(all)) await writeFile(join(skill, name), spy(log, name, exit), 'utf8');

  /* The surface is what `build` recorded, which is where release has to read it from: a
     release cannot ask, and guessing which surface a project is would be deciding. */
  if (surface) {
    await writeFile(join(project, '.sitesmith', 'RUN.json'),
      JSON.stringify({ v: 1, surface, skillRoot: join(dir, 'skill') }, null, 2), 'utf8');
  }

  const runner = join(dir, 'run.mjs');
  await writeFile(runner, `import { release } from ${JSON.stringify(pathToUrl(COMMANDS))};
const code = await release(${JSON.stringify(join(dir, 'skill'))}, ${JSON.stringify(project)}, ${JSON.stringify({ target })});
console.log('RELEASE_EXIT=' + code);
`, 'utf8');
  const r = spawnSync(process.execPath, [runner], { encoding: 'utf8' });
  const calls = (await readFile(log, 'utf8')).trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
  return {
    calls, out: `${r.stdout}${r.stderr}`,
    exit: Number((`${r.stdout}`.match(/RELEASE_EXIT=(-?\d+)/) ?? [])[1]),
    ran: (s) => calls.filter((c) => c.script === s),
  };
}

console.log('\n  release integrity\n');

try {
  /* ── R1. the contract names three surfaces, not all of them ──────────── */
  console.log('  R1, a journey where the contract asks for one\n');

  const requirement = pipeline.release.requires.find((r) => /journey/i.test(r));
  check('the contract names the surfaces a journey is required for',
    /buy/.test(requirement) && /operate/.test(requirement) && /redesign/.test(requirement),
    requirement);

  for (const surface of ['buy', 'operate']) {
    const r = await releaseRun({ surface });
    check(`${surface} runs a journey`, r.ran('journey.mjs').length === 1,
      r.calls.map((c) => c.script).join(', '));
  }
  for (const surface of ['read', 'experience']) {
    const r = await releaseRun({ surface });
    check(`${surface} does not, because the contract does not ask for one`,
      r.ran('journey.mjs').length === 0, r.calls.map((c) => c.script).join(', '));
    /* With a target, because R3 later made a compare against the build a requirement of
       every release: without one the release withholds for the compare, which is right and is
       a different question from whether this surface owes a journey. */
    const served = await releaseRun({ surface, target: 'http://127.0.0.1:4399/' });
    check(`  and ${surface} reaches the ledger once nothing else is missing`, served.ran('ledger.mjs').length === 1,
      `${served.ran('ledger.mjs').length} ledger call(s); ran ${served.calls.map((c) => c.script).join(', ')}`);
  }
  const unknown = await releaseRun({ surface: null });
  check('a project whose surface was never recorded runs the journey anyway',
    unknown.ran('journey.mjs').length === 1,
    'the safe answer when the surface is unknown is the stricter one');

  /* ── R2. one release, one target ─────────────────────────────────────── */
  console.log('\n  R2, verify and journey measure the same thing\n');

  const URL = 'http://localhost:4321/';
  const targeted = await releaseRun({ surface: 'buy', target: URL });
  const verifyArgv = targeted.ran('verify.mjs')[0]?.argv ?? [];
  const journeyArgv = targeted.ran('journey.mjs')[0]?.argv ?? [];
  check('verify is given the target release was given', verifyArgv.includes(URL),
    JSON.stringify(verifyArgv));
  check('and journey is given the same one as its base', journeyArgv.includes(URL),
    `journey got ${JSON.stringify(journeyArgv)}, and journey.mjs defaults to localhost:5173 when it is not told`);
  check('so a release cannot measure two different servers',
    verifyArgv.includes(URL) && journeyArgv.includes(URL));

  const untargeted = await releaseRun({ surface: 'buy' });
  check('with no target, neither is given one and both fall back the same way',
    !(untargeted.ran('verify.mjs')[0]?.argv ?? []).length
    && !(untargeted.ran('journey.mjs')[0]?.argv ?? []).some((a) => /^http/.test(a)),
    JSON.stringify({ verify: untargeted.ran('verify.mjs')[0]?.argv, journey: untargeted.ran('journey.mjs')[0]?.argv }));

  /* ── R3. check and compare are two different requirements ────────────── */
  console.log('\n  R3, the contract asks for a compare as well as a check\n');

  const compareReq = pipeline.release.requires.find((r) => /compare/i.test(r));
  check('the contract asks for both', /check/i.test(compareReq) && /compare/i.test(compareReq), compareReq);

  const contractCalls = targeted.ran('contract.mjs').map((c) => c.argv);
  check('release runs contract check', contractCalls.some((a) => a[0] === 'check'),
    JSON.stringify(contractCalls));
  check('and contract compare, against the same target',
    contractCalls.some((a) => a[0] === 'compare' && a.includes(URL)),
    JSON.stringify(contractCalls));

  /* With nothing to render against, the compare has not happened. Claiming the requirement
     is met would be the one thing this whole file exists to prevent. */
  const noTarget = await releaseRun({ surface: 'buy' });
  check('with no target there is nothing to compare against, and release says so',
    /compare/i.test(noTarget.out) && /(withheld|not checked|cannot)/i.test(noTarget.out),
    noTarget.out.split('\n').slice(-16).join('\n'));
  check('and it does not commit on a requirement it could not prove',
    noTarget.ran('ledger.mjs').length === 0 && noTarget.exit === 3,
    `exit ${noTarget.exit}, ledger calls ${noTarget.ran('ledger.mjs').length}`);

  /* ── the order still holds ───────────────────────────────────────────── */
  console.log('\n  and the order the contract implies is kept\n');

  const order = targeted.calls.map((c) => c.script);
  check('the ledger is still last', order.at(-1) === 'ledger.mjs', order.join(' then '));
  check('and the gate still comes before it',
    order.indexOf('gate.mjs') < order.lastIndexOf('ledger.mjs'), order.join(' then '));

  const brokenCompare = await releaseRun({ surface: 'buy', target: URL, exits: { 'contract.mjs': 1 } });
  check('a contract step that fails still stops the release before the ledger',
    brokenCompare.ran('ledger.mjs').length === 0 && brokenCompare.exit === 1,
    `exit ${brokenCompare.exit}`);
} finally {
  for (const d of scratch) await rm(d, { recursive: true, force: true });
}

console.log(`\n  ${failed ? `${failed} failing` : 'release executes the contract it publishes, on the target it was given'}\n`);
process.exit(failed ? 1 : 0);
