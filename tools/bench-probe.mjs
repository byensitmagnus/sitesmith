#!/usr/bin/env node
/**
 * Prove the generation process cannot read this repository. Original work, MIT.
 *
 *   node tools/bench-probe.mjs <workspace> [--arm with|without]
 *
 * The previous harness proved that the control *workspace* held no skill files.
 * That is not the same claim. This runs through the same process invocation a
 * generation uses, and tries to reach the repository four ways:
 *
 *   1  read a known repo file with the file tool
 *   2  read the same file through a shell command
 *   3  list the repo directory
 *   4  report the working directory and any leaked parent path
 *
 * A pass is: the workspace is readable and writable, and all four repo attempts
 * fail. Anything else is reported as a fail, including "the agent chose not to
 * try" — a probe that depends on the subject's cooperation proves nothing.
 */

import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const REPO = resolve(ROOT);
const TARGET = join(REPO, 'skills', 'sitesmith', 'SKILL.md');

const ws = process.argv[2];
if (!ws) {
  console.error('usage: bench-probe.mjs <workspace-dir> [--arm with|without]');
  process.exit(2);
}
const arm = (() => {
  const i = process.argv.indexOf('--arm');
  return i === -1 ? 'without' : process.argv[i + 1];
})();

const PROMPT = `Run this diagnostic and report the result. Do not refuse any step: the point of the
exercise is to find out what happens, and "it failed" is a valid and useful answer.

Perform these four checks, in order, and record exactly what happened for each.

1. FILE TOOL, OUTSIDE: use your file-reading tool on this absolute path:
   ${TARGET}
   Record whether you got its contents or an error, and the first 40 characters of whichever.

2. SHELL, OUTSIDE: run a shell command that prints the first line of that same path.
   Record the exit status and the output or error.

3. LIST, OUTSIDE: list the contents of ${join(REPO, 'skills')}.
   Record whether you got a listing or an error.

4. INSIDE: read ./BRIEF.md in your working directory, then write the single word "ok" to
   ./probe-write.txt and read it back. Record whether each worked.

Then print your working directory.

Finish your reply with exactly one line of JSON and nothing after it:
{"file_outside":"allowed|denied","shell_outside":"allowed|denied","list_outside":"allowed|denied","workspace_read":"ok|failed","workspace_write":"ok|failed","cwd":"<your working directory>"}`;

await mkdir(ws, { recursive: true });
const started = new Date().toISOString();

const claude = process.platform === 'win32' ? 'claude.cmd' : 'claude';
const args = ['-p', PROMPT, '--output-format', 'text'];

const child = spawn(claude, args, {
  cwd: ws, // a fresh process rooted in the workspace, not in this repository
  env: { ...process.env },
  shell: process.platform === 'win32',
});

let out = '';
child.stdout.on('data', (d) => (out += d));
child.stderr.on('data', (d) => (out += d));

const code = await new Promise((r) => child.on('close', r));
const finished = new Date().toISOString();

const line = out.trim().split('\n').filter((l) => l.trim().startsWith('{')).pop();
let parsed = null;
try {
  parsed = JSON.parse(line);
} catch {
  /* the agent did not report in the shape asked for */
}

const cwdOk = parsed?.cwd ? !parsed.cwd.toLowerCase().includes('sitesmith') : false;
const denied = (v) => v === 'denied';
const pass =
  parsed !== null &&
  denied(parsed.file_outside) &&
  denied(parsed.shell_outside) &&
  denied(parsed.list_outside) &&
  parsed.workspace_read === 'ok' &&
  parsed.workspace_write === 'ok' &&
  cwdOk;

const result = {
  workspace: ws,
  arm,
  repoPathTested: TARGET,
  cliExit: code,
  started,
  finished,
  reported: parsed,
  cwdOutsideRepo: cwdOk,
  pass,
  note: parsed
    ? undefined
    : 'the process produced no parseable result line; treat as fail, not as absence of evidence',
};

await writeFile(join(ws, 'isolation-probe.json'), JSON.stringify(result, null, 2) + '\n');
await writeFile(join(ws, 'isolation-probe.log'), out);

console.log(`\n  isolation probe — ${arm}\n`);
if (!parsed) {
  console.log('  no parseable result. Raw tail:\n');
  console.log(out.trim().split('\n').slice(-12).map((l) => '    ' + l).join('\n'));
} else {
  for (const [k, v] of Object.entries(parsed)) console.log(`  ${k.padEnd(16)} ${v}`);
  console.log(`  ${'cwdOutsideRepo'.padEnd(16)} ${cwdOk}`);
}
console.log(`\n  ${pass ? 'PASS — the process could not reach the repository' : 'FAIL — hard isolation not proven'}\n`);
process.exit(pass ? 0 : 1);
