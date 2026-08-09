#!/usr/bin/env node
/**
 * One fresh install, in an empty directory, through the public path. Original work, MIT.
 *
 *   SITESMITH_DEPS_DIR=<dir with playwright> node tools/test-fresh-install-e2e.mjs
 *
 * Every other test in this repository runs against the source tree. This one installs the
 * package into an empty directory the way a stranger would, and then walks the normal user
 * journey through the installed copy: init, build, write a direction record, write a
 * contract, run the release contract. No internal imports and no special fixtures. The
 * things it proves are the things a stranger finds out on day one, and they are the things
 * a source-tree test cannot see: whether the install puts the files where the commands look
 * for them, whether the commands can find each other from a project directory, and whether a
 * deliberate defect is refused rather than reported as success.
 */

import { mkdtemp, rm, writeFile, mkdir, readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const INSTALLER = join(ROOT, 'bin/sitesmith.mjs');

let failed = 0;
const step = (n) => console.log(`\n  ── ${n} ${'─'.repeat(Math.max(0, 56 - n.length))}\n`);
const check = (name, ok, detail = '') => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}${ok || !detail ? '' : `\n          ${detail}`}`);
  if (!ok) failed++;
};

const project = await mkdtemp(join(tmpdir(), 'sitesmith-e2e-'));
const run = (bin, args, opts = {}) => spawnSync(process.execPath, [bin, ...args],
  { cwd: project, encoding: 'utf8', ...opts });

console.log('\n  fresh install, empty directory, public path\n');

try {
  /* ── 1. the install ─────────────────────────────────────────────────── */
  step('install');
  const install = run(INSTALLER, ['install', '--to', project, '--provider', 'claude']);
  check('the installer exits 0 in an empty directory', install.status === 0,
    `exit ${install.status}\n          ${`${install.stdout}${install.stderr}`.trim().split('\n').slice(-6).join('\n          ')}`);

  const cli = join(project, '.claude/skills/sitesmith/cli.mjs');
  check('and the entry point the skill tells an agent to run exists', existsSync(cli), cli);
  for (const f of ['SKILL.md', 'run.md', 'look.md', 'verify.md', 'scripts/gate.mjs', 'scripts/ledger.mjs', 'scripts/contract.mjs']) {
    check(`  ${f} was installed`, existsSync(join(project, '.claude/skills/sitesmith', f)));
  }

  /* ── 2. the journey a stranger takes ────────────────────────────────── */
  step('init');
  const init = run(cli, ['init', '--name', 'Bench notes']);
  check('init exits 0', init.status === 0, `exit ${init.status}`);
  check('and writes the state directory', existsSync(join(project, '.sitesmith/PROJECT.md')));

  step('build, before there is anything to build from');
  const bare = run(cli, ['build', '--surface', 'buy']);
  check('build refuses with 3 when there is no brief and no direction record', bare.status === 3,
    `exit ${bare.status}`);
  check('and it writes the run manifest anyway, so the agent knows what to do next',
    existsSync(join(project, '.sitesmith/RUN.md')));

  await writeFile(join(project, 'BRIEF.md'),
    '# Bench notes\n\nA two-person glass shop that cuts replacement panes to measure and prices them\nfrom the two measurements the buyer already has.\n', 'utf8');

  step('the direction record');
  const newRecord = spawnSync(process.execPath,
    [join(project, '.claude/skills/sitesmith/scripts/ledger.mjs'), 'new', '.', 'buy'],
    { cwd: project, encoding: 'utf8' });
  check('ledger.mjs new exits 0 and writes the record', newRecord.status === 0
    && existsSync(join(project, '.sitesmith/direction.md')), `exit ${newRecord.status}`);

  const blank = run(cli, ['build', '--surface', 'buy']);
  check('build still refuses while the record is a blank template', blank.status === 3,
    `exit ${blank.status}`);
  check('and it names what is missing rather than only refusing',
    /empty template|nothing chosen/i.test(blank.stdout), blank.stdout.split('\n').slice(-4).join('\n'));

  /* Answered the way run.md asks, which is the point: the journey is the documented one. */
  const record = await readFile(join(project, '.sitesmith/direction.md'), 'utf8');
  await writeFile(join(project, '.sitesmith/direction.md'), record
    .replace(/^1\.\s*$/m, '1. A cutting list you price before you ring.')
    .replace(/^2\.\s*$/m, '2. The shop counter, with the buyer\'s two measurements on it.')
    .replace(/^Built:.*$/m, 'Built: 2, axis: the buyer already holds both numbers, because the counter is where they are read out'), 'utf8');

  step('the design contract');
  const newContract = spawnSync(process.execPath,
    [join(project, '.claude/skills/sitesmith/scripts/contract.mjs'), 'new', 'buy', '--to', project],
    { cwd: project, encoding: 'utf8' });
  check('contract.mjs new exits 0', newContract.status === 0, `exit ${newContract.status}`);
  check('and the contract is bound to the record, because the record came first',
    !/carries no hash/i.test(`${newContract.stdout}`), newContract.stdout.split('\n').slice(-4).join('\n'));

  const ready = run(cli, ['build', '--surface', 'buy']);
  check('build now exits 0: a brief, a surface, an answered record and a contract',
    ready.status === 0, `exit ${ready.status}\n          ${ready.stdout.split('\n').slice(-6).join('\n          ')}`);

  /* ── 3. the checks are actually invoked ─────────────────────────────── */
  step('release, on a page with a deliberate defect');
  await writeFile(join(project, 'index.html'),
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Bench notes</title></head>'
    + '<body><main><h1>Bench notes</h1><p>Lorem ipsum dolor sit amet.</p></main></body></html>', 'utf8');

  const released = run(cli, ['release'], { env: { ...process.env } });
  const out = `${released.stdout}${released.stderr}`;
  check('release refuses a page that is not ready, rather than reporting success',
    released.status !== 0, `exit ${released.status}`);
  check('and its exit is one the published contract defines',
    [1, 2, 3].includes(released.status), `exit ${released.status}`);
  check('it prints the release contract it evaluated',
    /release contract/i.test(out), out.split('\n').slice(-16).join('\n'));
  check('it names the requirement it cannot check rather than dropping it',
    /production build/i.test(out) && /not checked/i.test(out));
  check('nothing was recorded in the anti-repeat ledger',
    /nothing was recorded|not a release/i.test(out) || !existsSync(join(project, '.sitesmith/renders.jsonl')));

  const decisions = await readFile(join(project, '.sitesmith/decisions.jsonl'), 'utf8');
  const entries = decisions.trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
  check('and the refusal is written into the project\'s own decision log',
    entries.some((e) => e.at === 'release' && e.shipped === false),
    JSON.stringify(entries.filter((e) => e.at === 'release')));

  /* ── 4. the shape of the whole thing ────────────────────────────────── */
  step('what a stranger is left with');
  const written = await readdir(join(project, '.sitesmith'));
  check('the run left its artifacts where the skill says they are',
    ['PROJECT.md', 'DESIGN.md', 'RUN.md', 'RUN.json', 'direction.md', 'contract.json', 'decisions.jsonl', 'state.json']
      .every((f) => written.includes(f)),
    written.join(', '));

  const manifest = JSON.parse(await readFile(join(project, '.sitesmith/RUN.json'), 'utf8'));
  check('and the manifest is portable: one absolute path, and it is the install',
    typeof manifest.skillRoot === 'string'
    && !/[A-Za-z]:\\|\/Users\//.test(JSON.stringify({ ...manifest, skillRoot: undefined })),
    JSON.stringify(manifest).slice(0, 200));
} finally {
  await rm(project, { recursive: true, force: true });
}

console.log(`\n  ${failed ? `${failed} failing` : 'a stranger can install this and be refused for the right reasons'}\n`);
process.exit(failed ? 1 : 0);
