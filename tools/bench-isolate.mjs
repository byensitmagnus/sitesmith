#!/usr/bin/env node
/**
 * Prepare an isolated workspace for one benchmark run. Original work, MIT.
 *
 *   node tools/bench-isolate.mjs prepare 01-company with 1 --model claude-opus-5
 *   node tools/bench-isolate.mjs verify        # prove the control workspaces are clean
 *   node tools/bench-isolate.mjs collect       # copy finished sites back into the repo
 *
 * The first benchmark ran both arms inside this repository and told the control
 * not to read `skills/`. That is an instruction, not isolation, and it had a worse
 * problem: telling an agent not to look at something tells it the something is
 * there. The control now works in a directory outside the repository that contains
 * no skill files, and its prompt never mentions that a skill exists.
 *
 * What this does not do: prevent an agent from reading an absolute path elsewhere
 * on the machine. That is stated in the results rather than claimed away.
 */

import { mkdir, writeFile, readFile, cp, rm, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join, resolve, relative } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
// Deliberately neutral: nothing in the path names the skill or the project.
const LAB = join(tmpdir(), 'wsbench');
const RUNS = join(ROOT, 'benchmarks/v2/runs');
const BRIEFS = join(ROOT, 'benchmarks/v2/briefs');

const die = (m) => {
  console.error(m);
  process.exit(2);
};
const flag = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i === -1 ? d : process.argv[i + 1];
};
const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' }).trim();
const sha = (s) => createHash('sha256').update(s).digest('hex').slice(0, 16);

/** A plain static server. Both arms get this; neither arm's is the skill's. */
const SERVER = `import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';
const ROOT = resolve(process.argv[3] ?? '.');
const PORT = Number(process.argv[2] ?? 8080);
const T = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png',
  '.jpg':'image/jpeg', '.webp':'image/webp', '.json':'application/json' };
createServer(async (req, res) => {
  try {
    let p = join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    const s = await stat(p).catch(() => null);
    if (s?.isDirectory()) p = join(p, 'index.html');
    const body = await readFile(p);
    res.writeHead(200, { 'content-type': T[extname(p)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    res.end('<!doctype html><title>404</title><h1>404</h1>');
  }
}).listen(PORT, () => console.log('serving ' + ROOT + ' on http://localhost:' + PORT));
`;

async function prepare([brief, arm, n]) {
  if (!brief || !['with', 'without'].includes(arm) || !n) {
    die('usage: bench-isolate.mjs prepare <brief> <with|without> <n> --model M');
  }
  const model = flag('model') ?? die('--model is required');

  const dirty = git('status', '--porcelain')
    .split('\n')
    .filter(Boolean)
    .filter((l) => !l.slice(3).replace(/^"|"$/g, '').startsWith('benchmarks/v2/runs/'));
  if (dirty.length) die('the skill is uncommitted:\n' + dirty.map((l) => `  ${l}`).join('\n'));

  const runId = `${brief}-${arm}-${n}`;
  const ws = join(LAB, runId);
  await rm(ws, { recursive: true, force: true });
  await mkdir(join(ws, 'site'), { recursive: true });

  const briefText = await readFile(join(BRIEFS, `${brief}.md`), 'utf8').catch(() =>
    die(`no such brief: ${brief}`),
  );
  await writeFile(join(ws, 'BRIEF.md'), briefText);
  await writeFile(join(ws, 'serve.mjs'), SERVER);

  // Both arms get the same rendering capability as a dependency. Only the
  // treatment arm gets the process that says what to do with it.
  await cp(join(ROOT, 'benchmarks/node_modules'), join(ws, 'node_modules'), { recursive: true });
  await writeFile(
    join(ws, 'package.json'),
    JSON.stringify({ name: 'workspace', private: true, type: 'module' }, null, 2) + '\n',
  );

  if (arm === 'with') {
    await cp(join(ROOT, 'skills/sitesmith'), join(ws, 'skill'), { recursive: true });
  }

  await mkdir(join(RUNS, runId), { recursive: true });
  await writeFile(
    join(RUNS, runId, 'manifest.json'),
    JSON.stringify(
      {
        runId,
        brief,
        arm,
        run: Number(n),
        model,
        skillLoaded: arm === 'with',
        skillCommit: git('rev-parse', 'HEAD'),
        promptSha256_16: sha(briefText),
        workspace: ws,
        isolation: 'own directory outside the repository; control workspace contains no skill files',
      },
      null,
      2,
    ) + '\n',
  );

  console.log(ws);
}

/** Prove it rather than assert it. */
async function verifyIsolation() {
  const dirs = await readdir(LAB, { withFileTypes: true }).catch(() => []);
  if (!dirs.length) die(`no workspaces under ${LAB}`);

  const NEEDLES = [/sitesmith/i, /\bv2\/00-done/i, /block-hero-split/i, /design-system contract/i];
  let bad = 0;
  console.log(`\n  workspace isolation — ${LAB}\n`);
  for (const d of dirs.filter((e) => e.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const ws = join(LAB, d.name);
    const arm = d.name.includes('-without-') ? 'without' : 'with';
    const files = [];
    const walk = async (dir) => {
      for (const e of await readdir(dir, { withFileTypes: true })) {
        if (e.name === 'node_modules') continue;
        const full = join(dir, e.name);
        if (e.isDirectory()) await walk(full);
        else files.push(full);
      }
    };
    await walk(ws);
    let hits = 0;
    if (arm === 'without') {
      for (const f of files) {
        if (/\.(html|css|js|mjs|md|json|txt)$/i.test(f)) {
          const text = await readFile(f, 'utf8').catch(() => '');
          if (NEEDLES.some((rx) => rx.test(text)) || NEEDLES.some((rx) => rx.test(f))) hits++;
        }
      }
    }
    const hasSkillDir = await stat(join(ws, 'skill')).then(() => true, () => false);
    const ok = arm === 'with' ? hasSkillDir : !hasSkillDir && hits === 0;
    if (!ok) bad++;
    console.log(
      `  ${ok ? 'ok  ' : 'FAIL'}  ${d.name.padEnd(24)} ${arm.padEnd(8)} ` +
        `skill/ ${hasSkillDir ? 'present' : 'absent '}  files ${String(files.length).padStart(4)}` +
        (arm === 'without' ? `  skill traces ${hits}` : ''),
    );
  }
  console.log(
    `\n  Workspaces live outside the repository and are named neutrally. The control\n` +
      `  prompt does not mention that a skill exists, so it has no pointer to follow.\n` +
      `  This does not prevent reading an absolute path elsewhere on the machine.\n`,
  );
  process.exit(bad === 0 ? 0 : 1);
}

/** Copy the produced sites back in, so the evidence is in the repository. */
async function collect() {
  const dirs = (await readdir(LAB, { withFileTypes: true }).catch(() => []))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
  for (const runId of dirs) {
    const src = join(LAB, runId, 'site');
    const dest = join(RUNS, runId, 'site');
    const files = await readdir(src).catch(() => []);
    if (!files.length) {
      console.log(`  ${runId.padEnd(24)} empty, skipped`);
      continue;
    }
    await rm(dest, { recursive: true, force: true });
    await cp(src, dest, { recursive: true });
    console.log(`  ${runId.padEnd(24)} ${files.length} entries copied`);
  }
}

const [cmd, ...rest] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const cmds = { prepare, verify: verifyIsolation, collect };
if (!cmds[cmd]) die('usage: bench-isolate.mjs <prepare|verify|collect> ...');
await cmds[cmd](rest);
