#!/usr/bin/env node
/**
 * The containerised benchmark runner. Original work, MIT.
 *
 *   node tools/bench-container.mjs build              # image + tools lockfile
 *   node tools/bench-container.mjs up                 # internal network + egress proxy
 *   node tools/bench-container.mjs probe              # prove the isolation, both arms
 *   node tools/bench-container.mjs run <brief> <arm> <n>
 *   node tools/bench-container.mjs down
 *
 * Isolation, and why each piece is there:
 *
 *   fresh container    no inherited conversation, agent context or working directory
 *   internal network   `docker network create --internal` gives the generation no
 *                      route off the host at all
 *   egress proxy       the one container on both networks, allowlisting the model
 *                      endpoint. github.com is not on it, so "the control cannot
 *                      fetch the public repo" is a network fact, not a promise
 *   mounts             control gets the workspace and nothing else; treatment gets
 *                      the same plus the skill read-only at ~/.claude/skills
 *   identical prompt   both arms are given the same words. The skill difference is
 *                      the mount, never the text
 *
 * The API key is read from the host environment at run time and passed with -e. It
 * is never written to the image, the manifest, the logs or this repository.
 */

import { readFile, writeFile, mkdir, readdir, rm, cp, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BENCH = join(ROOT, 'bench');
const LAB = join(tmpdir(), 'wsbench');
const RUNS = join(ROOT, 'benchmarks/v2/runs');
const BRIEFS = join(ROOT, 'benchmarks/v2/briefs');

const IMAGE = 'sitesmith-bench:1';
const NET = 'sitesmith-bench-net';
const PROXY = 'sitesmith-bench-egress';

const die = (m) => {
  console.error(m);
  process.exit(2);
};
const flag = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i === -1 ? d : process.argv[i + 1];
};
const sha = (s) => createHash('sha256').update(s).digest('hex');
const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' }).trim();

function docker(args, opts = {}) {
  const r = spawnSync('docker', args, { encoding: 'utf8', ...opts });
  if (r.error) die('docker is not installed or not on PATH. See bench/README.md.');
  return r;
}
function dockerOrDie(args, what) {
  const r = docker(args, { stdio: 'inherit' });
  if (r.status !== 0) die(`docker ${what} failed`);
}

/** The model endpoint, from the host env, never hardcoded and never logged in full. */
function allowlist() {
  const extra = flag('allow', '');
  const base = process.env.ANTHROPIC_BASE_URL;
  const hosts = new Set(['api.anthropic.com', 'statsig.anthropic.com', 'sentry.io']);
  if (base) {
    try {
      hosts.add(new URL(base).hostname);
    } catch {
      /* not a URL; ignore rather than guess */
    }
  }
  for (const h of extra.split(',').map((s) => s.trim()).filter(Boolean)) hosts.add(h);
  return [...hosts];
}

/* ── build ─────────────────────────────────────────────────────────────── */

async function build() {
  // The tools both arms get, pinned, so the dependency hash in the manifest is real.
  await writeFile(
    join(BENCH, 'tools-package.json'),
    JSON.stringify(
      {
        name: 'bench-tools',
        private: true,
        type: 'module',
        dependencies: { playwright: '1.49.1', '@axe-core/playwright': '4.10.1' },
      },
      null,
      2,
    ) + '\n',
  );
  if (!(await stat(join(BENCH, 'tools-package-lock.json')).then(() => true, () => false))) {
    console.log('  generating tools-package-lock.json …');
    const r = spawnSync('npm', ['install', '--package-lock-only', '--prefix', BENCH], {
      encoding: 'utf8',
      shell: process.platform === 'win32',
    });
    if (r.status !== 0) die('could not generate the tools lockfile:\n' + r.stderr);
  }
  dockerOrDie(['build', '-t', IMAGE, BENCH], 'build');
  console.log(`\n  image ${IMAGE} built\n`);
}

/* ── up / down ─────────────────────────────────────────────────────────── */

function up() {
  const hosts = allowlist();
  docker(['network', 'rm', NET]);
  dockerOrDie(['network', 'create', '--internal', NET], 'network create');
  // The proxy sits on the internal network and on the default bridge. It is the
  // only path out, and it only connects to the allowlist.
  docker(['rm', '-f', PROXY]);
  dockerOrDie(
    [
      'run', '-d', '--name', PROXY, '--network', 'bridge',
      '-e', `ALLOW=${hosts.join(',')}`,
      '-v', `${join(BENCH, 'egress-proxy.mjs')}:/proxy.mjs:ro`,
      '--entrypoint', 'node', IMAGE, '/proxy.mjs',
    ],
    'proxy start',
  );
  dockerOrDie(['network', 'connect', '--alias', 'egress', NET, PROXY], 'proxy attach');
  console.log(`\n  network ${NET} is internal — no route off the host except the proxy`);
  console.log(`  egress allowlist: ${hosts.join(', ')}\n`);
}

function down() {
  docker(['rm', '-f', PROXY]);
  docker(['network', 'rm', NET]);
  console.log('  stopped\n');
}

/* ── the one invocation both probe and run use ─────────────────────────── */

function containerArgs({ workspace, arm, name }) {
  const key = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_CODE_OAUTH_TOKEN;
  if (!key) die('no ANTHROPIC_API_KEY or CLAUDE_CODE_OAUTH_TOKEN in the environment. See bench/README.md.');
  const keyVar = process.env.ANTHROPIC_API_KEY ? 'ANTHROPIC_API_KEY' : 'CLAUDE_CODE_OAUTH_TOKEN';

  const args = [
    'run', '--rm', '--name', name,
    '--network', NET,
    // Every request goes through the allowlisting proxy or nowhere.
    '-e', 'HTTPS_PROXY=http://egress:8888',
    '-e', 'HTTP_PROXY=http://egress:8888',
    '-e', 'NO_PROXY=',
    // Secret by reference: docker reads it from this process's environment and it
    // never appears in an image layer, a log line or a manifest.
    '-e', keyVar,
    '--memory', '4g', '--cpus', '2',
    '-v', `${workspace}:/work`,
  ];
  if (process.env.ANTHROPIC_BASE_URL) args.push('-e', 'ANTHROPIC_BASE_URL');
  if (arm === 'with') {
    // The normal skill path, read-only. This is the entire difference between arms.
    args.push('-v', `${join(ROOT, 'skills', 'sitesmith')}:/home/bench/.claude/skills/sitesmith:ro`);
  }
  args.push(IMAGE);
  return args;
}

/* ── probe ─────────────────────────────────────────────────────────────── */

async function probe() {
  const prompt = await readFile(join(BENCH, 'probe-prompt.txt'), 'utf8');
  const results = {};
  for (const arm of ['without', 'with']) {
    const ws = join(LAB, `probe-${arm}`);
    await rm(ws, { recursive: true, force: true });
    await mkdir(ws, { recursive: true });
    await writeFile(join(ws, 'BRIEF.md'), 'Probe workspace. Build nothing.\n');

    const cmd = `claude -p ${JSON.stringify(prompt)} --output-format text 2>&1`;
    const r = docker([...containerArgs({ workspace: ws, arm, name: `bench-probe-${arm}` }), cmd], {
      encoding: 'utf8',
    });
    const out = (r.stdout ?? '') + (r.stderr ?? '');
    await writeFile(join(ws, 'probe.log'), out);

    const line = out.trim().split('\n').filter((l) => l.trim().startsWith('{')).pop();
    let p = null;
    try {
      p = JSON.parse(line);
    } catch {
      /* no parseable answer is a fail, not an absence of evidence */
    }
    const pass =
      p !== null &&
      p.workspace_read === 'ok' &&
      p.workspace_write === 'ok' &&
      p.local_outside === 'denied' &&
      p.github_fetch === 'denied' &&
      p.general_fetch === 'denied' &&
      p.context_leak === 'none' &&
      typeof p.cwd === 'string' &&
      !p.cwd.toLowerCase().includes('sitesmith');
    results[arm] = { reported: p, pass, exit: r.status };

    console.log(`\n  probe — ${arm}\n`);
    if (!p) console.log(out.trim().split('\n').slice(-14).map((l) => '    ' + l).join('\n'));
    else for (const [k, v] of Object.entries(p)) console.log(`  ${k.padEnd(16)} ${v}`);
    console.log(`  ${'verdict'.padEnd(16)} ${pass ? 'PASS' : 'FAIL'}`);
  }

  // The treatment arm must find the skill, or the benchmark measures nothing.
  const skillSeen = docker([
    ...containerArgs({ workspace: join(LAB, 'probe-with'), arm: 'with', name: 'bench-probe-mount' }),
    'test -r /home/bench/.claude/skills/sitesmith/SKILL.md && echo MOUNTED || echo MISSING',
  ], { encoding: 'utf8' });
  const mounted = /MOUNTED/.test(skillSeen.stdout ?? '');
  const writable = docker([
    ...containerArgs({ workspace: join(LAB, 'probe-with'), arm: 'with', name: 'bench-probe-ro' }),
    'touch /home/bench/.claude/skills/sitesmith/x 2>&1 || echo READONLY',
  ], { encoding: 'utf8' });
  const readOnly = /READONLY|Read-only/.test((writable.stdout ?? '') + (writable.stderr ?? ''));

  const verdict = {
    when: new Date().toISOString(),
    image: IMAGE,
    network: NET,
    egressAllowlist: allowlist(),
    skillCommit: git('rev-parse', 'HEAD'),
    control: results.without,
    treatment: results.with,
    treatmentSkillMounted: mounted,
    treatmentSkillReadOnly: readOnly,
    pass: results.without?.pass === true && results.with?.pass === true && mounted && readOnly,
    note: 'No credential is recorded here by design. Only whether one was present at run time.',
    credentialPresentAtRunTime: Boolean(process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_CODE_OAUTH_TOKEN),
  };
  await mkdir(join(ROOT, 'benchmarks/v2'), { recursive: true });
  await writeFile(join(ROOT, 'benchmarks/v2/isolation-probe.json'), JSON.stringify(verdict, null, 2) + '\n');

  console.log(`\n  skill mounted in treatment : ${mounted}`);
  console.log(`  skill mount is read-only   : ${readOnly}`);
  console.log(`\n  ${verdict.pass ? 'PASS — isolation proven, the 18 runs may start' : 'FAIL — do not run the paid generations'}\n`);
  process.exit(verdict.pass ? 0 : 1);
}

/* ── run ───────────────────────────────────────────────────────────────── */

async function run([brief, arm, n]) {
  if (!brief || !['with', 'without'].includes(arm) || !n) {
    die('usage: bench-container.mjs run <brief> <with|without> <n>');
  }
  const gate = join(ROOT, 'benchmarks/v2/isolation-probe.json');
  const proven = await readFile(gate, 'utf8').then((t) => JSON.parse(t).pass === true, () => false);
  if (!proven) die('isolation has not been proven. Run `probe` first; it writes benchmarks/v2/isolation-probe.json.');

  const runId = `${brief}-${arm}-${n}`;
  const ws = join(LAB, runId);
  const briefText = await readFile(join(BRIEFS, `${brief}.md`), 'utf8').catch(() => die(`no such brief: ${brief}`));

  await rm(ws, { recursive: true, force: true });
  await mkdir(join(ws, 'site'), { recursive: true });
  await writeFile(join(ws, 'BRIEF.md'), briefText);

  // Identical for both arms, and it does not mention that a skill exists.
  const prompt = [
    'Read BRIEF.md in your working directory. It is your entire brief.',
    'Build the website it describes. Write every file you produce into the site/ subdirectory.',
    'Static HTML and CSS that serve from a directory: no build step, no npm install,',
    'no framework that needs compiling. Playwright and @axe-core/playwright are available',
    'via NODE_PATH if you want to render or check anything.',
    '',
    'Finish with at most five lines: the pages you produced, and anything the brief asked',
    'for that you did not do.',
  ].join('\n');
  await writeFile(join(ws, 'prompt.txt'), prompt);

  const started = new Date().toISOString();
  const cmd = `claude -p ${JSON.stringify(prompt)} --output-format text 2>&1 | tee /work/agent.log`;
  const r = docker([...containerArgs({ workspace: ws, arm, name: `bench-${runId}` }), cmd], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  const finished = new Date().toISOString();

  const lock = await readFile(join(BENCH, 'tools-package-lock.json'), 'utf8').catch(() => '');
  const skillPayload = await hashTree(join(ROOT, 'skills', 'sitesmith'));
  const cliVersion = docker([...containerArgs({ workspace: ws, arm, name: `bench-ver-${runId}` }), 'claude --version'], { encoding: 'utf8' }).stdout?.trim();

  await mkdir(join(RUNS, runId), { recursive: true });
  await writeFile(
    join(RUNS, runId, 'manifest.json'),
    JSON.stringify(
      {
        runId, brief, arm, run: Number(n),
        prompt, promptSha256: sha(prompt), briefSha256: sha(briefText),
        modelRequested: flag('model', 'default'),
        cliVersion,
        settings: { permissionMode: 'default', outputFormat: 'text' },
        skillCommit: git('rev-parse', 'HEAD'),
        skillPayloadSha256: arm === 'with' ? skillPayload : null,
        dependencyLockSha256: sha(lock),
        image: IMAGE, network: NET, egressAllowlist: allowlist(),
        isolationProbe: JSON.parse(await readFile(gate, 'utf8')).pass,
        started, finished,
        durationMs: Date.parse(finished) - Date.parse(started),
        containerExit: r.status,
        credential: 'injected from the host environment at run time; never stored',
      },
      null,
      2,
    ) + '\n',
  );
  console.log(`  ${runId}  exit ${r.status}  ${Math.round((Date.parse(finished) - Date.parse(started)) / 1000)}s`);
}

async function hashTree(dir) {
  const h = createHash('sha256');
  const walk = async (d) => {
    for (const e of (await readdir(d, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
      const full = join(d, e.name);
      if (e.isDirectory()) await walk(full);
      else h.update(e.name).update(await readFile(full));
    }
  };
  await walk(dir);
  return h.digest('hex');
}

const [cmd, ...rest] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const cmds = { build, up, down, probe, run };
if (!cmds[cmd]) die('usage: bench-container.mjs <build|up|probe|run|down> ...');
await cmds[cmd](rest);
