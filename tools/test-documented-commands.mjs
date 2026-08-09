#!/usr/bin/env node
/**
 * Every command the skill documents can be run verbatim. Original work, MIT.
 *
 *   node tools/test-documented-commands.mjs
 *
 * `run.md` told the agent to run `ledger.mjs new <surface>`. The CLI wants a directory first,
 * so typed literally it printed usage and did nothing. An agent following the file exactly
 * got no direction record and no reason why. The instance is one word; this file is here for
 * the class, because the same slip in any of the other documented commands is invisible until
 * somebody follows it.
 *
 * A command is documented if it appears in backticks in one of the skill's own markdown files
 * and starts with `node`. Placeholders are substituted with the obvious real value. A command
 * that then prints its own usage line has failed: the documentation and the CLI disagree, and
 * the documentation is what a reader has.
 */

import { mkdtemp, rm, writeFile, readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join, basename } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SKILL = join(ROOT, 'skills/sitesmith-v3');

let failed = 0;
const check = (name, ok, detail = '') => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}${detail && !ok ? `\n          ${detail}` : ''}`);
  if (!ok) failed++;
};

/* What a placeholder means, so a documented template can be executed rather than only read.
   A placeholder with no entry here makes the command untestable, and that is reported rather
   than skipped silently: an unrunnable instruction is the defect this file exists for. */
const FILL = {
  '<surface>': 'buy',
  '<dir>': '.',
  '<skill-dir>': SKILL,
  '<skill>': SKILL,
  '<url>': 'http://127.0.0.1:1/',

};

/* Commands that cannot be run in a scratch directory in a unit test, with the reason. Each
   one still has its script existence and its argument shape checked below. */
const CANNOT_RUN = {
  'journey.mjs': 'needs a live server at --base',
  'provenance-overlap.mjs': 'reads the licence corpus, not a project',
};

async function documentedCommands() {
  const files = [];
  for (const entry of await readdir(SKILL, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.md')) files.push(join(SKILL, entry.name));
    else if (entry.isDirectory() && ['floor', 'stacks'].includes(entry.name)) {
      for (const f of await readdir(join(SKILL, entry.name))) {
        if (f.endsWith('.md')) files.push(join(SKILL, entry.name, f));
      }
    }
  }
  const found = new Map();
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    for (const m of text.matchAll(/`(node\s+[^`]+)`/g)) {
      const cmd = m[1].replace(/\s+/g, ' ').trim();
      if (cmd.includes('…')) continue;           /* an elision, not a command */
      if (!found.has(cmd)) found.set(cmd, basename(file));
    }
  }
  return [...found].map(([cmd, file]) => ({ cmd, file }));
}

const dir = await mkdtemp(join(tmpdir(), 'sitesmith-docs-'));
console.log('\n  documented commands run verbatim\n');

try {
  await writeFile(join(dir, 'package.json'), '{"name":"scratch","private":true}\n', 'utf8');
  await writeFile(join(dir, 'BRIEF.md'), '# A workshop\n\nCuts glass to measure.\n', 'utf8');

  const commands = await documentedCommands();
  check('the skill documents at least five node commands', commands.length >= 5, `found ${commands.length}`);

  for (const { cmd, file } of commands) {
    /* Substitute inside a token, not only whole ones. `<skill-dir>/scripts/journey.mjs` is
       one argument with a placeholder in front of it, and matching whole tokens left it
       untouched and unreported: the test passed by not testing. */
    let argv = cmd.split(' ').slice(1);

    /* A placeholder in the directory is a real command written portably; a placeholder in the
       script name is a pattern the prose goes on to explain. Running the second one is a test
       of nothing, and failing it would push someone to rewrite a correct sentence. */
    if (/<[^>]+>[^/\\]*\.mjs$/.test(argv[0])) {
      check(`${file}: ${cmd} (a pattern, not a command)`, true);
      continue;
    }

    const unfilled = [];
    argv = argv.map((a) => {
      let out = a;
      for (const [k, v] of Object.entries(FILL)) out = out.split(k).join(v);
      for (const m of out.matchAll(/<[^>]+>/g)) unfilled.push(m[0]);
      return out;
    });
    if (unfilled.length) {
      check(`${file}: ${cmd}`, false, `placeholder with no known value: ${[...new Set(unfilled)].join(', ')}`);
      continue;
    }

    /* A path is written relative to wherever the file saying it lives: the skill's own docs
       mean the skill directory, and THIRD-PARTY-NOTICES.md names a tool in the repository
       root. Try both rather than assuming one. */
    const script = [argv[0], join(SKILL, argv[0]), join(ROOT, argv[0])].find((p) => existsSync(p)) ?? join(SKILL, argv[0]);
    const rest = argv.slice(1);
    const name = basename(script);

    if (CANNOT_RUN[name]) {
      const exists = existsSync(script);
      check(`${file}: ${cmd} (not run: ${CANNOT_RUN[name]})`, exists, 'the script it names does not exist');
      continue;
    }

    const r = spawnSync(process.execPath, [script, ...rest], { cwd: dir, encoding: 'utf8' });
    const out = `${r.stdout ?? ''}${r.stderr ?? ''}`;

    /* Usage is the tell. A command that prints its own usage was called wrongly, and the
       caller here is the documentation. Exit code is not enough on its own: one script
       printed usage and still exited 0. */
    const printedUsage = /^\s*usage:/mi.test(out);
    check(`${file}: ${cmd}`, !printedUsage && r.status !== 2,
      printedUsage ? `printed its own usage line, so the file and the CLI disagree:\n          ${out.split('\n').find((l) => /usage:/i.test(l))}`
        : `exit ${r.status}\n          ${out.trim().split('\n').slice(0, 3).join('\n          ')}`);
  }
} finally {
  await rm(dir, { recursive: true, force: true });
}

console.log(`\n  ${failed ? `${failed} failing` : 'all passed'}\n`);
process.exit(failed ? 1 : 0);
