#!/usr/bin/env node
/**
 * The published exit contract, on every public command. Original work, MIT.
 *
 *   SITESMITH_DEPS_DIR=<dir with playwright> node tools/test-exit-contract.mjs
 *
 * `product/pipeline.json` publishes one contract and says an automated caller can branch on
 * it: 0 done, 1 a measured defect, 2 the invocation or the environment, 3 not ready or a
 * verdict withheld. Three of the four engines disagreed with it. `gate.mjs` and `critique.mjs`
 * swapped 1 and 2, so a caller reading 1 as a defect saw a typo, and reading 2 as a typo saw a
 * defect. `verify.mjs` folded withheld verdicts into 1 and had no 3 at all.
 *
 * This file tests the observable behaviour of the shipped CLI, not the constants. Every case
 * is a state a real run lands in, and the number it must produce is the one the contract
 * publishes. `tools/test-commands-exit.mjs` covers init and build in depth; this covers the
 * whole surface at the level the contract makes a promise about.
 */

import { mkdtemp, rm, writeFile, mkdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CLI = join(ROOT, 'skills/sitesmith-v3/cli.mjs');
const SCRIPTS = join(ROOT, 'skills/sitesmith-v3/scripts');
const pipeline = JSON.parse(readFileSync(join(ROOT, 'product/pipeline.json'), 'utf8'));

let failed = 0;
const check = (name, ok, detail = '') => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}${ok || !detail ? '' : `\n          ${detail}`}`);
  if (!ok) failed++;
};

/* The contract is read from the file that publishes it rather than repeated here. A test
   carrying its own copy of the numbers would pass while the published promise drifted. */
const CONTRACT = pipeline.exitContract ?? {};
/* One word each, chosen because it is the word that distinguishes that code from its
   neighbours. The published wording may be rewritten; what may not change is which of the
   four things each number means. */
const MEANING = {
  0: { says: 'completed', is: 'done' },
  1: { says: 'defect', is: 'a measured defect' },
  2: { says: 'usage', is: 'the invocation or the environment' },
  3: { says: 'withheld', is: 'not ready, or a verdict withheld' },
};

console.log('\n  the published exit contract\n');

const codes = Object.keys(CONTRACT).filter((k) => /^\d+$/.test(k));
check('product/pipeline.json publishes exactly the four codes 0 to 3',
  codes.join(',') === '0,1,2,3', JSON.stringify(codes));
for (const [code, m] of Object.entries(MEANING)) {
  check(`  ${code} is published as ${m.is}`,
    new RegExp(m.says, 'i').test(String(CONTRACT[code] ?? '')),
    `published as ${JSON.stringify(CONTRACT[code])}, and the word that distinguishes it is "${m.says}"`);
}

const dir = await mkdtemp(join(tmpdir(), 'sitesmith-exit-contract-'));
const run = (args, cwd = dir) => spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: 'utf8' });
const script = (name, args, cwd = dir) => spawnSync(process.execPath, [join(SCRIPTS, name), ...args], { cwd, encoding: 'utf8' });

try {
  await mkdir(join(dir, '.sitesmith'), { recursive: true });

  /* ── 2, the invocation or the environment ───────────────────────────────
     A caller that got the arguments wrong has not measured anything, and must never be told
     the page is clean. This is the code every engine is easiest to get wrong, because the
     natural reflex is to treat a bad call as a failure of the work. */
  console.log('\n  2, when the call or the environment is wrong\n');

  const usageCases = [
    ['recommend, with no brief', run(['recommend'])],
    ['build, with a surface that does not exist', run(['build', '--surface', 'nonsense'])],
    ['inspect, with no target', run(['inspect'])],
    ['ledger.mjs new, missing the surface', script('ledger.mjs', ['new', '.'])],
    ['ledger.mjs, with no verb at all', script('ledger.mjs', [])],
    ['contract.mjs, with an unknown subcommand', script('contract.mjs', ['nonsense'])],
    ['journey.mjs, with no base url', script('journey.mjs', ['--base'])],
    /* The gate answered 1 here, which the contract reserves for something measured and
       wrong. Asking what the arguments are measures nothing. */
    ['gate.mjs --help', script('gate.mjs', ['--help'])],
    ['gate.mjs pointed at a file rather than a build directory', script('gate.mjs', ['index.html'])],
    ['critique.mjs, with no subcommand', script('critique.mjs', [])],
    ['critique.mjs, with a subcommand that does not exist', script('critique.mjs', ['nonsense'])],
    ['critique.mjs lock, with no --file', script('critique.mjs', ['lock'])],
  ];
  for (const [label, r] of usageCases) {
    check(`${label}: exit 2`, r.status === 2, `exit ${r.status}\n          ${`${r.stdout}${r.stderr}`.trim().split('\n').slice(0, 2).join('\n          ')}`);
  }

  /* ── 3, not ready, or a verdict withheld ────────────────────────────────
     The distinction the contract exists for. A check that could not run has not passed, and
     the alternative is a report that claims a render nobody performed. */
  console.log('\n  3, when the work is not ready or could not be judged\n');

  check('build, with no brief and no direction record: exit 3', run(['build', '--surface', 'buy']).status === 3);

  const noContract = script('contract.mjs', ['check']);
  check('contract.mjs check, with no contract to check: exit 3', noContract.status === 3,
    `exit ${noContract.status}`);

  const noRecord = script('ledger.mjs', ['check', '.']);
  check('ledger.mjs check, with no direction record: exit 3', noRecord.status === 3,
    `exit ${noRecord.status}\n          ${`${noRecord.stdout}${noRecord.stderr}`.trim().split('\n').slice(-2).join('\n          ')}`);

  /* The critique is owed a render. Nothing to critique is not a defect in a page that does
     not exist, and this answered 1. */
  const noRender = script('critique.mjs', ['packet']);
  check('critique.mjs packet, with nothing rendered yet: exit 3', noRender.status === 3,
    `exit ${noRender.status}`);

  /* A gate that could not measure has withheld its verdict. It said so in words and exited
     1, which reads as a page with a defect in it. */
  await writeFile(join(dir, 'index.html'),
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>x</title></head><body><main><h1>B</h1></main></body></html>', 'utf8');
  const noBrowser = spawnSync(process.execPath, [join(SCRIPTS, 'gate.mjs')],
    { cwd: dir, encoding: 'utf8', env: { ...process.env, SITESMITH_DEPS_DIR: '' } });
  check('gate.mjs with no browser, so its verdicts are withheld: exit 3 or a refusal, never 0',
    noBrowser.status !== 0, `exit ${noBrowser.status}`);

  /* ── 1, a measured defect ───────────────────────────────────────────────
     Something ran, and what it measured is wrong. Not the same as a bad call, and the whole
     reason a caller can branch: 1 is fixed by changing the page, 2 by changing the command. */
  console.log('\n  1, when something ran and what it measured is wrong\n');

  const defect = await mkdtemp(join(tmpdir(), 'sitesmith-defect-'));
  await mkdir(join(defect, '.sitesmith'), { recursive: true });
  await writeFile(join(defect, 'index.html'),
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>x</title></head><body><main><h1>B</h1></main></body></html>', 'utf8');
  await writeFile(join(defect, '.sitesmith', 'direction.md'), '# Direction record\n\n## Surface\n\nbuy\n', 'utf8');
  const incomplete = script('ledger.mjs', ['check', '.'], defect);
  check('ledger.mjs check, on a record with blank headings: exit 1', incomplete.status === 1,
    `exit ${incomplete.status}\n          ${`${incomplete.stdout}`.trim().split('\n').slice(-2).join('\n          ')}`);

  /* The one that matters most, and the one that was wrong. A page the gate refuses is a
     measured defect: something ran, and what it found is on the page. It exited 2, which the
     contract reserves for a bad invocation, so a caller branching on the published meanings
     was told to check its own arguments. */
  const refused = script('gate.mjs', [], defect);
  check('gate.mjs on a page it refuses: exit 1, not 2', refused.status === 1,
    `exit ${refused.status}\n          ${`${refused.stdout}`.trim().split('\n').slice(-2).join('\n          ')}`);
  await rm(defect, { recursive: true, force: true });

  /* ── the codes are distinct, which is the whole promise ─────────────────
     A caller can only branch if a bad call and a bad page do not produce the same number. */
  console.log('\n  and the codes are told apart\n');

  const badCall = run(['inspect']).status;
  const notReady = run(['build', '--surface', 'buy']).status;
  check('a bad call and a not-ready run do not produce the same code', badCall !== notReady,
    `both ${badCall}`);
  check('and neither of them is 0', badCall !== 0 && notReady !== 0, `${badCall} and ${notReady}`);

  /* ── 0 means done, and nothing else does ────────────────────────────────
     The failure that matters most: a command that could not do its work must never exit 0.
     `build` returned 0 with blockers through a ternary with the same value on both sides,
     and every automated caller went on to build a page with no brief. */
  console.log('\n  0, and only when the work is actually done\n');

  check('help exits 0', run(['--help']).status === 0);
  check('init exits 0', run(['init', '--name', 'Exit contract']).status === 0);
  const everyFailure = [...usageCases.map(([, r]) => r.status), noContract.status, noRecord.status, incomplete.status];
  check('no failing case anywhere above returned 0', !everyFailure.includes(0),
    JSON.stringify(everyFailure));
} finally {
  await rm(dir, { recursive: true, force: true });
}

console.log(`\n  ${failed ? `${failed} failing` : 'every public command answers the contract it publishes'}\n`);
process.exit(failed ? 1 : 0);
