#!/usr/bin/env node
/**
 * The exit contract, and a manifest that survives being moved. Original work, MIT.
 *
 *   node tools/test-commands-exit.mjs
 *
 * `build` returned 0 whether or not it had blockers, through a ternary with the same value
 * on both sides. An automated caller reading that went on to the next step with no brief and
 * no direction record. The contract in product/pipeline.json is the fix and this is what
 * holds it: 0 done, 1 defect, 2 usage, 3 not ready.
 *
 * The portability half is here rather than in its own file because it is the same run. A
 * manifest full of C:\Users\<person>\... is not a machine-readable order of work, it is one
 * machine's order of work, and it cannot be committed without putting somebody's name in the
 * repository.
 */

import { mkdtemp, mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir, homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CLI = join(ROOT, 'skills/sitesmith-v3/cli.mjs');
const LEDGER = join(ROOT, 'skills/sitesmith-v3/scripts/ledger.mjs');
const CONTRACT = join(ROOT, 'skills/sitesmith-v3/scripts/contract.mjs');

let failed = 0;
const check = (name, ok, detail = '') => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}${detail && !ok ? `\n          ${detail}` : ''}`);
  if (!ok) failed++;
};

const dir = await mkdtemp(join(tmpdir(), 'sitesmith-exit-'));
const run = (args, cwd = dir) =>
  spawnSync(process.execPath, [CLI, ...args, '--to', cwd], { cwd, encoding: 'utf8' });

console.log('\n  exit contract\n');

try {
  check('init: exit 0', run(['init', '--name', 'Exit contract']).status === 0);

  /* 3, not 0. Every one of these is a real state a build lands in, and each named its
     blocker in the report while telling the shell it had succeeded. */
  check('build with no surface: exit 3', run(['build']).status === 3);
  check('build with no brief and no direction record: exit 3', run(['build', '--surface', 'buy']).status === 3);

  /* 2 is the invocation, not the work. It comes before anything is written, because a
     manifest naming floor/nonsense.md is a wrong answer rather than a refusal. */
  const bad = run(['build', '--surface', 'nonsense']);
  check('build with an unknown surface: exit 2', bad.status === 2);
  check('and it names the four that exist', /buy, operate, read, experience/.test(bad.stdout), bad.stdout.trim());

  await writeFile(join(dir, 'BRIEF.md'),
    '---\nstack: astro\n---\n\n# A workshop\n\nCuts replacement glass panes to measure and prices them from the two measurements the buyer already has.\n');
  spawnSync(process.execPath, [LEDGER, 'new', '.', 'buy'], { cwd: dir, encoding: 'utf8' });

  /* The record `ledger.mjs new` writes is a blank template, and this file used to ask for
     exit 0 on it once a contract existed. That was the defect rather than the contract: a
     blank record means the direction step produced nothing, and exit 0 tells an automated
     caller to go on and build. Two 0-byte files passed the same way. RUN.md is still written
     in every one of these states, so an agent that needs the manifest to learn what to fill
     in is never locked out. */
  const blank = run(['build', '--surface', 'buy']);
  check('build on the blank record ledger.mjs new writes: exit 3', blank.status === 3, `exit ${blank.status}`);
  check('and it says the record is an empty template', /empty template/.test(blank.stdout), blank.stdout.slice(-300));
  check('the manifest is written anyway, so this is not a deadlock',
    existsSync(join(dir, '.sitesmith/RUN.md')));

  /* Fill it, then ask the contract question. Asked against a blank record the answer is
     "fill the record", which is right and is not what this next check is about. */
  const record = await readFile(join(dir, '.sitesmith/direction.md'), 'utf8');
  await writeFile(join(dir, '.sitesmith/direction.md'), record
    .replace(/^1\.\s*$/m, '1. A cutting list you price before you ring.')
    .replace(/^2\.\s*$/m, '2. The shop counter, with the buyer\'s two measurements on it.')
    .replace(/^Built:.*$/m, 'Built: 2, axis: the buyer already holds both numbers, because the counter is where they are read out'));

  /* The record is answered and the contract does not exist, so build still blocks, and it
     blocks on the next thing rather than on everything at once. Two unanswerable questions
     with no order between them is what the manifest exists to prevent. */
  const noContract = run(['build', '--surface', 'buy']);
  check('build with an answered record and no design contract: exit 3', noContract.status === 3, `exit ${noContract.status}`);
  check('and it names the contract as the next thing', /contract\.mjs new buy/.test(noContract.stdout),
    noContract.stdout.slice(-300));

  spawnSync(process.execPath, [CONTRACT, 'new', 'buy', '--to', dir], { cwd: dir, encoding: 'utf8' });

  const zeroByte = await mkdtemp(join(tmpdir(), 'sitesmith-zero-'));
  await mkdir(join(zeroByte, '.sitesmith'), { recursive: true });
  await writeFile(join(zeroByte, 'BRIEF.md'), '# A workshop\n\nCuts glass to measure.\n');
  await writeFile(join(zeroByte, '.sitesmith/direction.md'), '');
  await writeFile(join(zeroByte, '.sitesmith/contract.json'), '');
  const empty = run(['build', '--surface', 'buy'], zeroByte);
  check('build on two 0-byte files: exit 3, not 0', empty.status === 3, `exit ${empty.status}\n${empty.stdout.slice(-300)}`);
  await rm(zeroByte, { recursive: true, force: true });

  const broken = await mkdtemp(join(tmpdir(), 'sitesmith-broken-'));
  await mkdir(join(broken, '.sitesmith'), { recursive: true });
  await writeFile(join(broken, 'BRIEF.md'), '# A workshop\n\nCuts glass to measure.\n');
  await writeFile(join(broken, '.sitesmith/direction.md'), '## Subject\n\nA two-person glass shop.\n');
  await writeFile(join(broken, '.sitesmith/contract.json'), '{ not json');
  const bad2 = run(['build', '--surface', 'buy'], broken);
  check('build on a contract that is not JSON: exit 3', bad2.status === 3, `exit ${bad2.status}`);
  await rm(broken, { recursive: true, force: true });

  /* The state a real run passes through and the one worth naming precisely: candidates were
     written, nothing was chosen. Counting non-blank lines would have called this filled. */
  const noChoice = await mkdtemp(join(tmpdir(), 'sitesmith-nochoice-'));
  await mkdir(join(noChoice, '.sitesmith'), { recursive: true });
  await writeFile(join(noChoice, 'BRIEF.md'), '# A workshop\n\nCuts glass to measure.\n');
  await writeFile(join(noChoice, '.sitesmith/direction.md'),
    '## Theses\n\n1. A cutting list you price before you ring.\n2. The shop counter.\n\n## Built\n\nBuilt: <thesis number>, axis: <the axis>, because <reason>\n');
  await writeFile(join(noChoice, '.sitesmith/contract.json'), '{"v":1}');
  const unchosen = run(['build', '--surface', 'buy'], noChoice);
  check('build on theses with nothing chosen: exit 3', unchosen.status === 3, `exit ${unchosen.status}`);
  check('and it names the Built line as the placeholder it still is',
    /nothing chosen/.test(unchosen.stdout), unchosen.stdout.slice(-260));
  await rm(noChoice, { recursive: true, force: true });

  /* A written thesis and a real choice is all build asks for. Whether the record is any good
     belongs to ledger.mjs; duplicating that judgement here would let build refuse what the
     ledger allows. */
  const ok = run(['build', '--surface', 'buy']);
  check('build with brief, surface, an answered record and a contract: exit 0', ok.status === 0,
    `exit ${ok.status}\n${ok.stdout.slice(-400)}`);

  /* A brief long enough that the old 1200-character cut would have decided what the index
     saw. The retrieval fix is in the normaliser, so the whole file goes to the engine now,
     and a fact past the old cut can still reach it. */
  const filler = 'The workshop keeps its own words for the work and uses them on the page. '.repeat(30);
  await writeFile(join(dir, 'BRIEF.md'),
    `---\nstack: astro\n---\n\n# A workshop\n\n${filler}\n\nIt cuts replacement glass panes to measure and prices them from the two measurements the buyer already has.\n`);
  const long = run(['build', '--surface', 'buy']);
  check('a brief past 1200 characters still reaches the index', long.status === 0
    && /patterns: pat-|patterns: cro-/.test(long.stdout), long.stdout.slice(-300));

  /* Portability. skillRoot is allowed to be absolute: it is the one line that says where the
     installation is, and it is the only line a manifest moved to another machine needs. */
  const manifest = JSON.parse(await readFile(join(dir, '.sitesmith/RUN.json'), 'utf8'));
  const { skillRoot, ...rest } = manifest;
  const body = JSON.stringify(rest);
  check('RUN.json states skillRoot once, absolutely', typeof skillRoot === 'string' && skillRoot.length > 0);
  check('and nothing else in it is an absolute path',
    !/[A-Za-z]:\\\\|(^|["/ ])\/(Users|home)\//.test(body),
    (body.match(/[A-Za-z]:\\\\[^"]*/) ?? body.match(/\/(Users|home)\/[^"]*/) ?? [''])[0].slice(0, 160));
  check('and it does not contain this machine\'s home directory',
    !body.includes(homedir().replace(/\\/g, '\\\\')) && !body.includes(homedir()));
  check('every command is written against <skill>',
    Object.values(manifest.commands).every((c) => c.startsWith('node <skill>/scripts/')),
    JSON.stringify(manifest.commands));
  check('every file to read is <skill>-relative', manifest.read.every((f) => f.startsWith('<skill>/')));
  check('the brief is project-relative', manifest.brief === './BRIEF.md', manifest.brief);

  const md = await readFile(join(dir, '.sitesmith/RUN.md'), 'utf8');
  check('RUN.md carries no absolute path either', !md.includes(homedir()) && !/[A-Za-z]:\\/.test(md));
} finally {
  await rm(dir, { recursive: true, force: true });
}

console.log(`\n  ${failed ? `${failed} failing` : 'the contract holds'}\n`);
process.exit(failed ? 1 : 0);
