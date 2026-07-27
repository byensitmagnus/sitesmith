#!/usr/bin/env node
/**
 * The containerised benchmark runner. Original work, MIT.
 *
 *   node tools/bench-container.mjs selftest     # unpaid, asserts the runner's own rules
 *   node tools/bench-container.mjs build        # builds from the committed base lock
 *   node tools/bench-container.mjs up           # internal network + egress proxy
 *   node tools/bench-container.mjs probe        # UNPAID mechanical gate
 *   node tools/bench-container.mjs discovery    # PAID gate, two short calls
 *   node tools/bench-container.mjs preflight    # plan + drift check, spends nothing
 *   node tools/bench-container.mjs run-all      # the 18: one key prompt, stop on first failure
 *   node tools/bench-container.mjs down
 *
 * Two rules shape the whole file.
 *
 * Everything the environment is made of is committed before anything runs, in
 * bench/base.lock.json: base image digest, CLI version, model. The build consumes
 * those values and is never allowed to resolve its own, because a mutable tag can
 * change the base under a gate that is already green. What the build produces — the
 * machine-specific image id — is an artifact under benchmarks/v2/runs/, not a source
 * edit, so no commit is needed between the gates and the runs.
 *
 * Names are neutral throughout. A control container that can read the subject's name
 * off an image tag, a container name or a mount path has been told the one thing it
 * was supposed not to know.
 */

import { readFile, writeFile, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync, spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BENCH = join(ROOT, 'bench');
const LAB = join(tmpdir(), 'wsbench');
const RUNS = join(ROOT, 'benchmarks/v2/runs');
const BRIEFS = join(ROOT, 'benchmarks/v2/briefs');
const BASE_LOCK_PATH = join(BENCH, 'base.lock.json');
const TOOLS_PKG = join(BENCH, 'tools-package.json');
const TOOLS_LOCK = join(BENCH, 'tools-package-lock.json');
const BUILD_ARTIFACT = join(RUNS, 'image-build.json');
const GATE = join(ROOT, 'benchmarks/v2/isolation-probe.json');

const die = (m) => { console.error(m); process.exit(2); };
const sha = (s) => createHash('sha256').update(s).digest('hex');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' }).trim();

/* ── the committed lock is the only source of these ────────────────────── */

const BASE_LOCK_TEXT = await readFile(BASE_LOCK_PATH, 'utf8').catch(() => die('bench/base.lock.json is missing.'));
const LOCK = JSON.parse(BASE_LOCK_TEXT);
for (const k of ['base', 'baseDigest', 'claudeVersion', 'model', 'modelAccept', 'endpoint']) {
  if (!LOCK[k]) die(`bench/base.lock.json has no ${k}`);
}
if (!/^sha256:[0-9a-f]{64}$/.test(LOCK.baseDigest)) die('baseDigest must be an immutable sha256 digest');

const BASE = LOCK.base;
const BASE_DIGEST = LOCK.baseDigest;
const CLAUDE_VERSION = LOCK.claudeVersion;
const MODEL = LOCK.model;
const ENDPOINT = LOCK.endpoint;
/* Exact acceptance. An alias may be added to modelAccept only together with the dated
   id it resolved to; a prefix match would quietly accept a different model. */
const MODEL_ACCEPT = new Set(LOCK.modelAccept);

/* Neutral identifiers. Nothing here names the subject. */
const IMAGE = 'bench-runner:3';
const NET = 'benchnet';
const PROXY = 'benchnet-egress';
const runName = (id) => `benchrun-${String(id).replace(/[^a-z0-9-]/gi, '')}`;

const MARK = 'sitesmith';
const SKILL_DIR = join(ROOT, 'skills', MARK);
const SKILL_DEST = `/home/bench/.claude/skills/${MARK}`;
const BLOCKED_URL = `https://raw.githubusercontent.com/byensitmagnus/${MARK}/main/skills/${MARK}/SKILL.md`;
const HOST_PATH = `/mnt/c/Users/Usmo1/Documents/${MARK}`;

const BRIEF_LIST = ['01-company', '02-shop', '03-console'];
const RUN_TIMEOUT_MS = 45 * 60 * 1000;
const MAX_TURNS = 220;
const MAX_COST_PER_RUN_USD = 12;
const MAX_TOTAL_COST_USD = 160;

function docker(args, opts = {}) {
  const r = spawnSync('docker', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...opts });
  if (r.error) die('docker is not installed or not running. See bench/README.md.');
  return r;
}

const GENERATION_PROMPT = [
  'Read BRIEF.md in your working directory. It is your entire brief.',
  'Build the website it describes. Write every file you produce into the site/ subdirectory.',
  'Static HTML and CSS that serve from a directory: no build step, no npm install,',
  'no framework that needs compiling. Playwright and @axe-core/playwright are available',
  'via NODE_PATH if you want to render or check anything.',
  '',
  'Finish with at most five lines: the pages you produced, and anything the brief asked',
  'for that you did not do.',
].join('\n');

/* ── pure rules ─────────────────────────────────────────────────────────────
   These exist so the self-test can call the real logic instead of grepping this
   file for strings. A regex that matches its own source proves nothing. */

/** The only reference the build is allowed to pull. Never a tag. */
export const basePullRef = () => `${BASE}@${BASE_DIGEST}`;
export const buildArgs = () => [
  'build', '--pull=false',
  '--build-arg', `BASE_DIGEST=${BASE_DIGEST}`,
  '--build-arg', `CLAUDE_VERSION=${CLAUDE_VERSION}`,
  '-t', IMAGE, BENCH,
];

/** No `echo EXIT=$?`: that swallowed the CLI's status and made a failed run exit 0. */
export const generationCommand = (prompt) =>
  `claude -p ${JSON.stringify(prompt)} --model ${MODEL} --output-format json ` +
  `--max-turns ${MAX_TURNS} > /work/agent.json 2> /work/agent.err`;

export const discoveryCommand = () =>
  `claude -p "List the names of every skill available to you, then stop. If none, say NONE." ` +
  `--model ${MODEL} --output-format json --max-turns 3 --debug > /work/disc.json 2> /work/disc.err`;

/** Exactly what the daemon must report. Anything else fails, in either direction. */
export const expectedMounts = (arm, probing) => {
  const m = ['/work'];
  if (probing) m.push('/probe/probe.sh:ro');
  if (arm === 'with') m.push(`${SKILL_DEST}:ro`);
  return m.sort();
};

export const modelAccepted = (m) => MODEL_ACCEPT.has(m ?? '');
export const gateReady = (g) => g?.mechanicalProbe?.pass === true && g?.modelProbe?.pass === true;
export const runDirName = (runId, problems) => (problems.length ? `INVALID-${runId}` : runId);
export const killPlan = (name) => [['kill', name], ['rm', '-f', name]];

export const budgetProblems = (cost, spentSoFar) => {
  const p = [];
  if (typeof cost !== 'number') p.push('no cost reported, so the budget cannot be enforced');
  else if (cost > MAX_COST_PER_RUN_USD) p.push(`cost $${cost.toFixed(2)} over the $${MAX_COST_PER_RUN_USD} per-run cap`);
  if (spentSoFar + (typeof cost === 'number' ? cost : 0) > MAX_TOTAL_COST_USD) {
    p.push(`total spend would exceed the $${MAX_TOTAL_COST_USD} benchmark budget`);
  }
  return p;
};

/* ── the tree must not move between the gates and the runs ─────────────── */

/** Anything uncommitted is a source change the fingerprint's HEAD cannot see.
 *  benchmarks/v2/runs/ is git-ignored, so build artifacts and run output never
 *  make the tree dirty and no commit is needed mid-benchmark. */
export const dirtyPaths = (porcelain) =>
  porcelain.split('\n').map((l) => l.slice(3).trim()).filter(Boolean);

function requireCleanTree(what) {
  const paths = dirtyPaths(git('status', '--porcelain'));
  if (paths.length) {
    die(`the working tree is not clean, so ${what} would not be reproducible from HEAD:\n` +
        paths.map((p) => '    ' + p).join('\n') +
        '\n  Commit or discard these, then re-run both gates.');
  }
}

/* ── fingerprint ───────────────────────────────────────────────────────── */

async function hashTree(dir) {
  const h = createHash('sha256');
  const walk = async (d) => {
    const entries = (await readdir(d, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name));
    for (const e of entries) {
      const full = join(d, e.name);
      if (e.isDirectory()) await walk(full);
      else h.update(e.name).update(await readFile(full));
    }
  };
  await walk(dir);
  return h.digest('hex');
}

/** Everything that, if it changes, invalidates a green gate. */
async function fingerprint() {
  const build = await readFile(BUILD_ARTIFACT, 'utf8').then(JSON.parse, () => ({}));
  return {
    runnerSha256: sha(await readFile(fileURLToPath(import.meta.url), 'utf8')),
    baseLockSha256: sha(BASE_LOCK_TEXT),
    dockerfileSha256: sha(await readFile(join(BENCH, 'Dockerfile'), 'utf8')),
    entrypointSha256: sha(await readFile(join(BENCH, 'entrypoint.sh'), 'utf8')),
    probeSha256: sha(await readFile(join(BENCH, 'probe.sh'), 'utf8')),
    proxySha256: sha(await readFile(join(BENCH, 'egress-proxy.mjs'), 'utf8')),
    toolsLockSha256: sha(await readFile(TOOLS_LOCK, 'utf8').catch(() => '')),
    baseDigest: BASE_DIGEST,
    claudeVersion: CLAUDE_VERSION,
    model: MODEL,
    egressAllowlist: [ENDPOINT],
    imageId: build.imageId ?? null,
    imageBuiltFromDigest: build.baseDigest ?? null,
    skillCommit: git('rev-parse', 'HEAD'),
    skillPayloadSha256: await hashTree(SKILL_DIR),
    promptSha256: sha(GENERATION_PROMPT),
  };
}

function driftAgainst(gate, fp) {
  return Object.entries(fp).filter(([k, v]) => JSON.stringify(gate?.fingerprint?.[k]) !== JSON.stringify(v));
}

/* ── secret ────────────────────────────────────────────────────────────── */

function readSecret(purpose) {
  return new Promise((res) => {
    process.stdout.write(`\n  API key (${purpose}) — input hidden, held in memory only: `);
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl.output.write = () => true; // no echo
    rl.question('', (a) => { rl.close(); process.stdout.write('\n'); res(a.trim()); });
  });
}

/* ── build ─────────────────────────────────────────────────────────────── */

async function build() {
  for (const [p, what] of [[TOOLS_PKG, 'bench/tools-package.json'], [TOOLS_LOCK, 'bench/tools-package-lock.json']]) {
    if (!(await stat(p).then(() => true, () => false))) die(`${what} is missing. It is committed source, not generated here.`);
  }

  // The digest comes from the committed lock and nowhere else. There is deliberately no
  // path in this function that pulls a tag or reads RepoDigests: that is how a base image
  // silently changes under a gate that is already green.
  console.log(`  pulling ${basePullRef()}`);
  if (docker(['pull', basePullRef()], { stdio: 'inherit' }).status !== 0) die('could not pull the pinned base image');

  if (docker(buildArgs(), { stdio: 'inherit' }).status !== 0) die('docker build failed');

  const id = docker(['image', 'inspect', '--format', '{{.Id}}', IMAGE]).stdout.trim();
  const ver = docker(['run', '--rm', '--entrypoint', 'claude', IMAGE, '--version']).stdout.trim();
  if (!ver.includes(CLAUDE_VERSION)) {
    die(`the image reports CLI "${ver}" but the lock pins ${CLAUDE_VERSION}. Not proceeding.`);
  }

  // An artifact, not a source edit. benchmarks/v2/runs/ is git-ignored, so building does
  // not dirty the tree and no commit is needed between here and the eighteen runs.
  await mkdir(RUNS, { recursive: true });
  await writeFile(BUILD_ARTIFACT, JSON.stringify({
    imageTag: IMAGE, imageId: id,
    base: BASE, baseDigest: BASE_DIGEST,
    claudeVersion: ver, pinnedClaudeVersion: CLAUDE_VERSION,
    model: MODEL,
    builtAt: new Date().toISOString(),
    builtFromCommit: git('rev-parse', 'HEAD'),
    note: 'Build output, machine-specific. Committed with the run results afterwards, never before.',
  }, null, 2) + '\n');

  console.log(`\n  image ${IMAGE}\n  base  ${BASE_DIGEST}\n  cli   ${ver}\n  id    ${id}`);
  console.log(`\n  wrote ${BUILD_ARTIFACT.replace(ROOT, '')}\n  next: up, then probe\n`);
}

/* ── network ───────────────────────────────────────────────────────────── */

function up() {
  docker(['rm', '-f', PROXY]);
  docker(['network', 'rm', NET]);
  if (docker(['network', 'create', '--internal', NET], { stdio: 'inherit' }).status !== 0) die('network create failed');
  if (docker(['run', '-d', '--name', PROXY, '--network', 'bridge', '-e', `ALLOW=${ENDPOINT}`,
              '-v', `${join(BENCH, 'egress-proxy.mjs')}:/proxy.mjs:ro`,
              '--entrypoint', 'node', IMAGE, '/proxy.mjs'], { stdio: 'inherit' }).status !== 0) die('proxy start failed');
  if (docker(['network', 'connect', '--alias', 'egress', NET, PROXY], { stdio: 'inherit' }).status !== 0) die('proxy attach failed');
  console.log(`\n  ${NET} is --internal: no route off the host except through the proxy`);
  console.log(`  allowlist: ${ENDPOINT}, exact host only\n`);
}

function down() {
  docker(['rm', '-f', PROXY]);
  docker(['network', 'rm', NET]);
  console.log('  stopped; only the benchmark network and its proxy were touched\n');
}

/* ── the one invocation everything uses ────────────────────────────────── */

function containerArgs({ workspace, arm, name, probing = false }) {
  const args = [
    'run', '--rm', '-i', '--name', name,
    '--network', NET,
    '-e', 'HTTPS_PROXY=http://egress:8888',
    '-e', 'HTTP_PROXY=http://egress:8888',
    '-e', 'NO_PROXY=',
    '-e', `ENDPOINT=${ENDPOINT}`,
    '-e', `ARM=${arm}`,
    '--memory', '4g', '--cpus', '2', '--pids-limit', '512',
    '-v', `${workspace}:/work`,
  ];
  if (probing) {
    // Present only while probing. A generation container never has this mount and never
    // sees these variables, which is what lets the probe scan the filesystem for the mark.
    args.push('-v', `${join(BENCH, 'probe.sh')}:/probe/probe.sh:ro`,
              '-e', `MARK=${MARK}`, '-e', `BLOCKED_URL=${BLOCKED_URL}`, '-e', `HOST_PATH=${HOST_PATH}`);
  }
  if (arm === 'with') args.push('-v', `${SKILL_DIR}:${SKILL_DEST}:ro`);
  args.push(IMAGE);
  return args;
}

/** Read the container's real bind mounts from the daemon while it runs. A mount table
 *  reported from inside the container would be asking the thing under test to grade
 *  itself. */
async function inspectMounts(name, arm, probing, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const r = docker(['inspect', '--format', '{{json .Mounts}}', name]);
    if (r.status === 0) {
      let mounts = [];
      try { mounts = JSON.parse(r.stdout.trim()); } catch { return { ok: false, reason: 'unparseable mount table' }; }
      const got = mounts.map((m) => `${m.Destination}${m.RW ? '' : ':ro'}`).sort();
      const want = expectedMounts(arm, probing);
      return { ok: JSON.stringify(got) === JSON.stringify(want), got, want };
    }
    await sleep(400);
  }
  return { ok: false, reason: 'the container never appeared for inspection' };
}

function runContainer(args, command, secret, timeoutMs, name) {
  return new Promise((res) => {
    const child = spawn('docker', [...args, command], { stdio: ['pipe', 'pipe', 'pipe'] });
    let out = '';
    let timedOut = false;
    const killer = setTimeout(() => {
      timedOut = true;
      // Killing the docker client leaves the container running and still spending.
      for (const plan of killPlan(name)) docker(plan);
      child.kill('SIGKILL');
    }, timeoutMs);
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (out += d));
    child.stdin.write(secret ? secret + '\n' : '\n');
    child.stdin.end();
    child.on('close', (code) => {
      clearTimeout(killer);
      if (!timedOut) return res({ code, out, timedOut: false, containerGone: true });
      const left = docker(['ps', '-a', '--filter', `name=^${name}$`, '--format', '{{.Names}}']).stdout.trim();
      res({ code: 124, out, timedOut: true, containerGone: left === '' });
    });
  });
}

function requireBuilt() {
  return stat(BUILD_ARTIFACT).then(() => true, () => die('no build artifact. Run `build` first.'));
}

/* ── gate 1: mechanical, unpaid ────────────────────────────────────────── */

async function probe() {
  await requireBuilt();
  requireCleanTree('this gate');

  const results = {};
  for (const arm of ['without', 'with']) {
    const ws = join(LAB, `probe-${arm}`);
    await rm(ws, { recursive: true, force: true });
    await mkdir(ws, { recursive: true });
    await writeFile(join(ws, 'BRIEF.md'), 'Probe workspace. Build nothing.\n');
    const name = runName(`probe-${arm}`);

    const running = runContainer(containerArgs({ workspace: ws, arm, name, probing: true }),
      'bash /probe/probe.sh', null, 8 * 60 * 1000, name);
    const mounts = await inspectMounts(name, arm, true);
    const { code, out } = await running;

    await writeFile(join(ws, 'probe.log'), out);
    const line = out.trim().split('\n').filter((l) => l.trim().startsWith('{')).pop();
    let parsed = null;
    try { parsed = JSON.parse(line); } catch { /* unparseable is a failure */ }

    results[arm] = {
      exit: code, verdict: parsed?.verdict ?? 'unparseable',
      failed: parsed?.failed ?? null, checks: parsed?.checks ?? null, mounts,
      pass: parsed?.verdict === 'pass' && mounts.ok === true,
    };

    console.log(`\n  mechanical probe — ${arm}`);
    if (!parsed) console.log(out.trim().split('\n').slice(-14).map((l) => '    ' + l).join('\n'));
    else for (const [k, v] of Object.entries(parsed.checks)) console.log(`    ${k.padEnd(18)} ${v}`);
    console.log(`    ${'bind mounts'.padEnd(18)} ${mounts.ok ? 'exactly as expected' : 'UNEXPECTED ' + JSON.stringify(mounts.got ?? mounts.reason)}`);
    console.log(`    ${'verdict'.padEnd(18)} ${results[arm].pass ? 'pass' : 'FAIL'}`);
  }

  const pass = results.without.pass && results.with.pass;
  await mkdir(join(ROOT, 'benchmarks/v2'), { recursive: true });
  await writeFile(GATE, JSON.stringify({
    when: new Date().toISOString(),
    treeClean: true,
    fingerprint: await fingerprint(),
    mechanicalProbe: { control: results.without, treatment: results.with, pass },
    modelProbe: null,
    note: 'No credential is used or recorded by the mechanical probe. Both gates must be green, ' +
          'against one unchanged fingerprint, before run-all.',
  }, null, 2) + '\n');
  console.log(`\n  ${pass ? 'PASS — next: discovery, which is also a gate' : 'FAIL — stop here'}\n`);
  process.exit(pass ? 0 : 1);
}

/* ── gate 2: skill discovery, paid, two short calls ────────────────────── */

async function discovery() {
  const gate = await readFile(GATE, 'utf8').then(JSON.parse, () => null);
  if (gate?.mechanicalProbe?.pass !== true) die('run `probe` first; it costs nothing.');
  requireCleanTree('this gate');
  const fp = await fingerprint();
  const drift = driftAgainst(gate, fp);
  if (drift.length) die(`the environment changed since the mechanical probe: ${drift.map(([k]) => k).join(', ')}`);

  const secret = await readSecret('two short calls');
  if (!secret) die('no key given');

  const out = {};
  for (const arm of ['without', 'with']) {
    const ws = join(LAB, `probe-${arm}`);
    const name = runName(`disc-${arm}`);
    const r = await runContainer(containerArgs({ workspace: ws, arm, name }), discoveryCommand(), secret, 5 * 60 * 1000, name);
    const raw = await readFile(join(ws, 'disc.json'), 'utf8').catch(() => '');
    const err = await readFile(join(ws, 'disc.err'), 'utf8').catch(() => '');
    let j = null;
    try { j = JSON.parse(raw); } catch { /* handled below */ }
    const modelReturned = j?.modelUsage ? Object.keys(j.modelUsage)[0] : (j?.model ?? null);
    out[arm] = {
      exit: r.code, isError: j?.is_error ?? null, modelReturned, modelAccepted: modelAccepted(modelReturned),
      sessionId: j?.session_id ?? null, costUsd: j?.total_cost_usd ?? null,
      skillReferenced: new RegExp(MARK, 'i').test((j?.result ?? '') + err),
      resultHead: (j?.result ?? '').slice(0, 200),
    };
    console.log(`\n  discovery — ${arm}: exit ${r.code}, skill referenced ${out[arm].skillReferenced}, model ${modelReturned ?? '?'}`);
  }

  const pass = out.with.skillReferenced === true && out.without.skillReferenced === false &&
               out.with.exit === 0 && out.without.exit === 0 &&
               out.with.isError !== true && out.without.isError !== true &&
               out.with.modelAccepted && out.without.modelAccepted;

  await writeFile(GATE, JSON.stringify({
    ...gate, fingerprint: fp,
    modelProbe: { control: out.without, treatment: out.with, pass, when: new Date().toISOString() },
  }, null, 2) + '\n');
  console.log(`\n  ${pass ? 'PASS — the treatment loads the skill and the control never sees it. run-all is unlocked.' : 'FAIL — do not run the generations'}\n`);
  process.exit(pass ? 0 : 1);
}

/* ── preflight ─────────────────────────────────────────────────────────── */

async function preflight() {
  const gate = await readFile(GATE, 'utf8').then(JSON.parse, () => null);
  const fp = await fingerprint();
  const drift = gate ? driftAgainst(gate, fp) : [];
  const dirty = dirtyPaths(git('status', '--porcelain'));
  console.log(`\n  planned: ${BRIEF_LIST.length} briefs x 2 arms x 3 = ${BRIEF_LIST.length * 6} generations`);
  for (const b of BRIEF_LIST) for (const arm of ['with', 'without']) for (const n of [1, 2, 3]) console.log(`    ${b}-${arm}-${n}`);
  console.log(`\n  model            ${MODEL}`);
  console.log(`  base digest      ${BASE_DIGEST}   (committed)`);
  console.log(`  cli              ${CLAUDE_VERSION}   (committed)`);
  console.log(`  image id         ${fp.imageId ?? 'not built yet'}   (artifact)`);
  console.log(`  skill commit     ${fp.skillCommit}`);
  console.log(`  working tree     ${dirty.length ? 'DIRTY: ' + dirty.join(', ') : 'clean'}`);
  console.log(`  per run          ${RUN_TIMEOUT_MS / 60000} min, ${MAX_TURNS} turns, $${MAX_COST_PER_RUN_USD} cap`);
  console.log(`  total budget     $${MAX_TOTAL_COST_USD}`);
  console.log(`  mechanical gate  ${gate?.mechanicalProbe?.pass === true ? 'green' : 'NOT GREEN'}`);
  console.log(`  discovery gate   ${gate?.modelProbe?.pass === true ? 'green' : 'NOT GREEN'}`);
  if (drift.length) console.log(`  DRIFT since the gates: ${drift.map(([k]) => k).join(', ')}`);
  console.log('');
  process.exit(gateReady(gate) && drift.length === 0 && dirty.length === 0 ? 0 : 1);
}

/* ── run ───────────────────────────────────────────────────────────────── */

async function runOne(brief, arm, n, secret, fp, spentSoFar) {
  const runId = `${brief}-${arm}-${n}`;
  const ws = join(LAB, runId);
  const name = runName(runId);
  const briefText = await readFile(join(BRIEFS, `${brief}.md`), 'utf8');
  await rm(ws, { recursive: true, force: true });
  await mkdir(join(ws, 'site'), { recursive: true });
  await writeFile(join(ws, 'BRIEF.md'), briefText);

  const started = new Date().toISOString();
  const running = runContainer(containerArgs({ workspace: ws, arm, name }),
    generationCommand(GENERATION_PROMPT), secret, RUN_TIMEOUT_MS, name);
  const mounts = await inspectMounts(name, arm, false);
  const r = await running;
  const finished = new Date().toISOString();

  const raw = await readFile(join(ws, 'agent.json'), 'utf8').catch(() => '');
  let j = null;
  try { j = JSON.parse(raw); } catch { /* a problem is recorded below */ }
  const modelReturned = j?.modelUsage ? Object.keys(j.modelUsage)[0] : (j?.model ?? null);
  const cost = typeof j?.total_cost_usd === 'number' ? j.total_cost_usd : null;
  const produced = (await readdir(join(ws, 'site')).catch(() => [])).length;

  const problems = [];
  if (r.timedOut) problems.push(`timed out after ${RUN_TIMEOUT_MS / 60000} min` +
    (r.containerGone ? '; container killed and removed' : '; CONTAINER MAY STILL BE RUNNING'));
  if (r.code !== 0) problems.push(`cli exit ${r.code}`);
  if (!j) problems.push('no parseable JSON result');
  if (j?.is_error === true) problems.push('result is_error true');
  if (!modelReturned) problems.push('the provider returned no model id');
  else if (!modelAccepted(modelReturned)) problems.push(`model mismatch: asked ${MODEL}, got ${modelReturned}`);
  if (produced === 0) problems.push('site/ is empty');
  if (!mounts.ok) problems.push(`unexpected bind mounts: ${JSON.stringify(mounts.got ?? mounts.reason)}`);
  problems.push(...budgetProblems(cost, spentSoFar));

  const manifest = {
    runId, brief, arm, run: Number(n),
    prompt: GENERATION_PROMPT, promptSha256: sha(GENERATION_PROMPT), briefSha256: sha(briefText),
    modelRequested: MODEL, modelReturned, modelAccepted: modelAccepted(modelReturned),
    sessionId: j?.session_id ?? null, usage: j?.usage ?? null, numTurns: j?.num_turns ?? null,
    costUsd: cost, isError: j?.is_error ?? null,
    settings: { outputFormat: 'json', maxTurns: MAX_TURNS, permissionMode: 'default', timeoutMs: RUN_TIMEOUT_MS },
    mounts: { expected: mounts.want ?? expectedMounts(arm, false), observed: mounts.got ?? null, ok: mounts.ok },
    ...fp,
    gates: { mechanical: 'pass', discovery: 'pass' },
    started, finished, durationMs: Date.parse(finished) - Date.parse(started),
    containerExit: r.code, timedOut: r.timedOut, filesProduced: produced,
    valid: problems.length === 0, problems,
    credential: 'read at run time, piped to container stdin; never stored, logged, or visible to docker inspect',
  };

  const dir = join(RUNS, runDirName(runId, problems));
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  await writeFile(join(dir, 'prompt.txt'), GENERATION_PROMPT);
  await writeFile(join(dir, 'brief.md'), briefText);

  console.log(`  ${runId.padEnd(24)} ${problems.length ? 'INVALID' : 'ok     '} ` +
    `${modelReturned ?? '?'} ${Math.round(manifest.durationMs / 1000)}s ` +
    `${cost !== null ? '$' + cost.toFixed(2) : '$?'}${problems.length ? '  ' + problems.join('; ') : ''}`);
  return { ok: problems.length === 0, cost: cost ?? 0 };
}

async function runAll() {
  const gate = await readFile(GATE, 'utf8').then(JSON.parse, () => null);
  if (!gateReady(gate)) die('both gates must be green. Run `probe`, then `discovery`.');
  requireCleanTree('these runs');
  const fp = await fingerprint();
  const drift = driftAgainst(gate, fp);
  if (drift.length) die(`the environment changed since the gates: ${drift.map(([k]) => k).join(', ')}. Re-run both.`);

  const secret = await readSecret('all 18 generations, asked once');
  if (!secret) die('no key given');

  let spent = 0;
  for (const brief of BRIEF_LIST) {
    for (const arm of ['with', 'without']) {
      for (const n of [1, 2, 3]) {
        const res = await runOne(brief, arm, n, secret, fp, spent);
        spent += res.cost;
        if (!res.ok) die(`\n  stopped at the first failure. $${spent.toFixed(2)} spent. ` +
          'The failed run is under INVALID-* and is not benchmark data.\n');
      }
    }
  }
  console.log(`\n  18/18 complete, $${spent.toFixed(2)} spent.\n`);
}

/* ── unpaid self-test ──────────────────────────────────────────────────── */

async function selftest() {
  const rows = [];
  const ok = (n, v, d = '') => rows.push([v ? 'ok  ' : 'FAIL', n, d]);
  const tracked = (p) => spawnSync('git', ['ls-files', '--error-unmatch', p], { cwd: ROOT, stdio: 'ignore' }).status === 0;

  ok('the base lock is committed', tracked('bench/base.lock.json'));
  ok('the tools lockfile is committed', tracked('bench/tools-package-lock.json'));
  ok('the tools manifest is committed', tracked('bench/tools-package.json'));
  ok('the base is pinned to an immutable digest', /^sha256:[0-9a-f]{64}$/.test(BASE_DIGEST));
  ok('the build pulls the digest, never a tag',
    basePullRef() === `${BASE}@${BASE_DIGEST}` && basePullRef().includes('@sha256:'));
  ok('the build passes that same digest to the image',
    buildArgs().includes(`BASE_DIGEST=${BASE_DIGEST}`) && buildArgs().includes('--pull=false'));
  ok('the digest in use is the one on disk',
    BASE_DIGEST === JSON.parse(await readFile(BASE_LOCK_PATH, 'utf8')).baseDigest);
  ok('the image id is an artifact, not source',
    BUILD_ARTIFACT.includes('benchmarks') && BUILD_ARTIFACT.includes('runs') && !tracked('bench/image.lock.json'));
  const ignored = (p) => spawnSync('git', ['check-ignore', '-q', p], { cwd: ROOT }).status === 0;
  ok('run output and build artifacts cannot dirty the tree',
    ignored('benchmarks/v2/runs/image-build.json') && ignored('benchmarks/v2/runs/01-company-with-1/manifest.json'));

  const dockerfile = await readFile(join(BENCH, 'Dockerfile'), 'utf8');
  ok('probe.sh is not baked into the image', !/COPY\s+probe\.sh/.test(dockerfile));
  ok('the Dockerfile takes the digest as a build argument', /FROM \S+@\$\{BASE_DIGEST\}/.test(dockerfile));

  const ep = await readFile(join(BENCH, 'entrypoint.sh'), 'utf8');
  ok('the secret arrives on stdin', /read -r -t \d+ _S/.test(ep));
  ok('the entrypoint never names the subject', !new RegExp(MARK, 'i').test(ep));

  const proxy = await readFile(join(BENCH, 'egress-proxy.mjs'), 'utf8');
  ok('the proxy matches exact hosts only', /ALLOW\.includes\(h\)/.test(proxy));

  const probeSh = await readFile(join(BENCH, 'probe.sh'), 'utf8');
  ok('the probe takes the mark as input', /MARK="\$\{MARK:\?/.test(probeSh));
  ok('the probe scans the readable filesystem', /\/work \/home \/opt \/usr \/etc \/tmp \/var/.test(probeSh));
  ok('the probe needs no credential', !/ANTHROPIC_API_KEY/.test(probeSh));

  ok('image, network and container names are neutral',
    ![IMAGE, NET, PROXY, runName('01-company-with-1')].some((s) => new RegExp(MARK, 'i').test(s)));

  const gen = containerArgs({ workspace: '/tmp/x', arm: 'without', name: 'n' });
  const treat = containerArgs({ workspace: '/tmp/x', arm: 'with', name: 'n' });
  const mountsOf = (a) => a.filter((_, i) => a[i - 1] === '-v');
  ok('a control generation mounts only the workspace',
    JSON.stringify(mountsOf(gen)) === JSON.stringify(['/tmp/x:/work']));
  ok('a treatment generation adds only the read-only skill',
    mountsOf(treat).length === 2 && mountsOf(treat)[1].endsWith(':ro'));
  ok('no generation container carries a probe mount',
    !gen.concat(treat).some((a) => String(a).includes('/probe/')));
  ok('no generation container carries the mark in its environment',
    !gen.concat(treat).some((a) => /^(MARK|BLOCKED_URL|HOST_PATH)=/.test(String(a))));
  ok('no credential appears in any docker argument',
    !gen.some((a) => /API_KEY|TOKEN|SECRET|sk-ant/i.test(String(a))));

  ok('the expected mount table is exact',
    JSON.stringify(expectedMounts('without', false)) === JSON.stringify(['/work']) &&
    expectedMounts('with', true).length === 3);
  ok('the real exit code is kept',
    !/echo EXIT=/.test(generationCommand('p')) && /2> \/work\/agent\.err/.test(generationCommand('p')));
  ok('the model must match exactly',
    modelAccepted(MODEL) && !modelAccepted('claude-sonnet-4-5-20250929') && !modelAccepted(null));
  ok('a timeout kills and removes the container',
    JSON.stringify(killPlan('c')) === JSON.stringify([['kill', 'c'], ['rm', '-f', 'c']]));
  ok('the budget is enforced per run and in total',
    budgetProblems(1, 0).length === 0 && budgetProblems(99, 0).length > 0 &&
    budgetProblems(null, 0).length > 0 && budgetProblems(5, MAX_TOTAL_COST_USD).length > 0);
  ok('both gates are required before a run',
    !gateReady(null) && !gateReady({ mechanicalProbe: { pass: true } }) &&
    !gateReady({ mechanicalProbe: { pass: true }, modelProbe: { pass: false } }) &&
    gateReady({ mechanicalProbe: { pass: true }, modelProbe: { pass: true } }));
  ok('an uncommitted change is detected',
    dirtyPaths(' M tools/bench-container.mjs\n?? x.txt\n').length === 2 && dirtyPaths('').length === 0);
  ok('a failed run is quarantined rather than counted',
    runDirName('a', []) === 'a' && runDirName('a', ['x']) === 'INVALID-a');

  const fp = await fingerprint();
  console.log('\n  unpaid self-test — no container, no model, no key\n');
  for (const [s, n, d] of rows) console.log(`  ${s}  ${n}${d ? '  — ' + d : ''}`);
  console.log('\n  the fingerprint the gates bind to:');
  for (const [k, v] of Object.entries(fp)) {
    console.log(`    ${k.padEnd(22)} ${typeof v === 'string' ? v.slice(0, 71) : JSON.stringify(v)}`);
  }
  const failed = rows.filter(([s]) => s.startsWith('FAIL')).length;
  console.log(`\n  ${failed === 0 ? 'PASS — nothing was spent' : `FAIL — ${failed} problem(s)`}\n`);
  process.exit(failed === 0 ? 0 : 1);
}

const [cmd] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const cmds = { selftest, build, up, down, probe, discovery, preflight, 'run-all': runAll };
if (!cmds[cmd]) die('usage: bench-container.mjs <selftest|build|up|probe|discovery|preflight|run-all|down>');
await cmds[cmd]();
