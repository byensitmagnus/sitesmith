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

import { mkdtemp, rm, writeFile, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir, homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CLI = join(ROOT, 'skills/sitesmith-v3/cli.mjs');
const LEDGER = join(ROOT, 'skills/sitesmith-v3/scripts/ledger.mjs');

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

  const ok = run(['build', '--surface', 'buy']);
  check('build with brief, surface and direction record: exit 0', ok.status === 0,
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
