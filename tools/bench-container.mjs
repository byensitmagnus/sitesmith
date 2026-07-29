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
 * Three rules shape the whole file.
 *
 * The two arms differ by one read-only mount and by nothing else. Strip that mount from
 * the treatment invocation and it is byte-identical to the control's, argument for
 * argument and variable for variable. A container that can read which arm it is in has
 * been told the answer.
 *
 * Everything the environment is made of is committed before anything runs, in
 * bench/base.lock.json. What the build produces is an artifact under
 * benchmarks/v2/runs/, which is git-ignored, so no commit is needed between the gates
 * and the runs. After the build, nothing addresses the image by its tag: a tag is a
 * label that can be moved onto a different image, and every container is started from
 * the immutable image id instead.
 *
 * A gate is bound to the Docker runtime that produced it, not just to the source that
 * asked for it: image id and platform, network id and Internal flag, the proxy's
 * container, image, command, allowlist and mounts. If any of it moves, both gates are
 * void.
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

/* Both of these live under benchmarks/v2/runs/, which is git-ignored, and that is not
   tidiness. A gate verdict written anywhere else appears as an untracked file, and the
   next command's clean-tree check would then refuse to run — the runner would block on
   its own output and could never complete the sequence it requires. */
const BUILD_ARTIFACT = join(RUNS, 'image-build.json');
const GATE = join(RUNS, 'isolation-probe.json');

const die = (m) => { console.error(m); process.exit(2); };
const sha = (s) => createHash('sha256').update(s).digest('hex');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' }).trim();
/** Untrimmed. `git status --porcelain` puts two status columns before every path, and
 *  trimming eats the leading space of the first line only, which silently shortened the
 *  first offending path by one character. */
const gitRaw = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' });

/* ── the committed lock is the only source of these ────────────────────── */

const BASE_LOCK_TEXT = await readFile(BASE_LOCK_PATH, 'utf8').catch(() => die('bench/base.lock.json is missing.'));
const LOCK = JSON.parse(BASE_LOCK_TEXT);
for (const k of ['base', 'baseDigest', 'debianSnapshot', 'claudeVersion', 'claudeIntegrity',
                 'model', 'modelAccept', 'endpoint', 'platform']) {
  if (!LOCK[k]) die(`bench/base.lock.json has no ${k}`);
}
if (!/^sha256:[0-9a-f]{64}$/.test(LOCK.baseDigest)) die('baseDigest must be an immutable sha256 digest');
if (!/^sha512-[A-Za-z0-9+/=]+$/.test(LOCK.claudeIntegrity)) die('claudeIntegrity must be an sha512 subresource hash');
if (!/^\d{8}T\d{6}Z$/.test(LOCK.debianSnapshot)) die('debianSnapshot must be a snapshot.debian.org timestamp');
if (!/^[a-z0-9]+\/[a-z0-9]+$/.test(LOCK.platform)) die('platform must look like linux/amd64');

const BASE = LOCK.base;
const BASE_DIGEST = LOCK.baseDigest;
const DEBIAN_SNAPSHOT = LOCK.debianSnapshot;
const CLAUDE_VERSION = LOCK.claudeVersion;
const CLAUDE_INTEGRITY = LOCK.claudeIntegrity;
const MODEL = LOCK.model;
const ENDPOINT = LOCK.endpoint;
const PLATFORM = LOCK.platform;
/* Exact acceptance. An alias may be added to modelAccept only together with the dated
   id it resolved to; a prefix match would quietly accept a different model. */
const MODEL_ACCEPT = new Set(LOCK.modelAccept);

/* Neutral identifiers. Nothing here names the subject. The tag is a build-time label
   only; after the build every container is addressed by image id. */
const BUILD_TAG = 'bench-runner:3';
const NET = 'benchnet';
const PROXY = 'benchnet-egress';
const RUN_PREFIX = 'benchrun-';
const runName = (id) => `${RUN_PREFIX}${String(id).replace(/[^a-z0-9-]/gi, '')}`;

const MARK = 'sitesmith';
const SKILL_DIR = join(ROOT, 'skills', MARK);
const SKILL_DEST = `/home/bench/.claude/skills/${MARK}`;
const SKILL_MOUNT = `${SKILL_DIR}:${SKILL_DEST}:ro`;
const BLOCKED_URL = `https://raw.githubusercontent.com/byensitmagnus/${MARK}/main/skills/${MARK}/SKILL.md`;
const HOST_PATH = `/mnt/c/Users/Usmo1/Documents/${MARK}`;

const BRIEF_LIST = ['01-company', '02-shop', '03-console'];
const RUN_TIMEOUT_MS = 45 * 60 * 1000;
const MAX_TURNS = 220;
const MAX_COST_PER_RUN_USD = 12;
const MAX_DISCOVERY_USD = 1;
const MAX_TOTAL_COST_USD = 160;
const BUDGET = {
  maxCostPerRunUsd: MAX_COST_PER_RUN_USD,
  maxDiscoveryUsd: MAX_DISCOVERY_USD,
  maxTotalCostUsd: MAX_TOTAL_COST_USD,
  maxTurns: MAX_TURNS,
  timeoutMs: RUN_TIMEOUT_MS,
  enforcement: 'passed to the CLI as --max-budget-usd; the build refuses an image whose CLI lacks the flag',
};

function docker(args, opts = {}) {
  const r = spawnSync('docker', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...opts });
  if (r.error) die('docker is not installed or not running. See bench/README.md.');
  return r;
}

const inspectJson = (args, what) => {
  const r = docker(args);
  if (r.status !== 0) die(`could not inspect ${what}: ${(r.stderr || '').trim()}`);
  try { return JSON.parse(r.stdout)[0]; } catch { return die(`unparseable inspect output for ${what}`); }
};

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

export const DISCOVERY_PROMPT =
  'Output only a JSON array of the names of every skill available to you, for example ' +
  '["alpha","beta"]. If you have none, output []. No other text.';

/* ── pure rules ─────────────────────────────────────────────────────────────
   These exist so the self-test can call the real logic instead of grepping this
   file for strings. A regex that matches its own source proves nothing. */

/** The only reference the build is allowed to pull. Never a tag. */
export const basePullRef = () => `${BASE}@${BASE_DIGEST}`;
export const buildArgs = () => [
  'build', '--pull=false', '--platform', PLATFORM,
  '--build-arg', `BASE_DIGEST=${BASE_DIGEST}`,
  '--build-arg', `DEBIAN_SNAPSHOT=${DEBIAN_SNAPSHOT}`,
  '--build-arg', `CLAUDE_VERSION=${CLAUDE_VERSION}`,
  '--build-arg', `CLAUDE_INTEGRITY=${CLAUDE_INTEGRITY}`,
  '-t', BUILD_TAG, BENCH,
];

/** `claude --version` prints "2.1.220 (Claude Code)". Exact on the version token: a
 *  substring test would accept 2.1.2201. */
export const versionMatches = (out) => String(out).trim().split(/\s+/)[0] === CLAUDE_VERSION;

/** No `echo EXIT=$?`: that swallowed the CLI's status and made a failed run exit 0.
 *  --max-budget-usd is the cap the CLI enforces on itself while it spends. Checking a
 *  total afterwards is an audit, not a limit: by the time the number is known the money
 *  is already gone. */
export const generationCommand = (prompt) =>
  `claude -p ${JSON.stringify(prompt)} --model ${MODEL} --output-format json ` +
  `--max-turns ${MAX_TURNS} --max-budget-usd ${MAX_COST_PER_RUN_USD} ` +
  `> /work/agent.json 2> /work/agent.err`;

export const discoveryCommand = () =>
  `claude -p ${JSON.stringify(DISCOVERY_PROMPT)} --model ${MODEL} --output-format json ` +
  `--max-turns 3 --max-budget-usd ${MAX_DISCOVERY_USD} --debug ` +
  `> /work/disc.json 2> /work/disc.err`;

/** Structured, not a regex sweep of stderr. The CLI's debug output has no stable format
 *  and a loose word match there would accept the skill's name appearing in a file path,
 *  an error message or a stack trace. This reads the model's JSON result, parses the
 *  array it was asked for, and looks at its elements. */
export const parseSkillNames = (text) => {
  if (typeof text !== 'string') return [];
  const m = text.match(/\[[\s\S]*?\]/);
  if (!m) return [];
  try {
    const arr = JSON.parse(m[0]);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string').map((s) => s.trim()) : [];
  } catch { return []; }
};

/** An element naming the skill. The first token is enough — a model may append a
 *  description — but it must be an element of the parsed array, not text found anywhere. */
export const namesSkill = (names) =>
  names.some((n) => n.toLowerCase().split(/[^a-z0-9-]/)[0] === MARK);

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

/** The order the eighteen runs happen in.
 *
 *  The old order ran all three treatment replicates of a brief before any control
 *  replicate, so a slow provider hour or a cold start landed entirely on one arm. Here
 *  each (brief, replicate) pair runs its two arms back to back, so both arms of a pair
 *  meet the same conditions, and which arm goes first alternates across pairs so no
 *  position advantage accumulates. Briefs interleave across replicates as well, so
 *  drift over the session is spread rather than concentrated.
 *
 *  Nine pairs cannot split first-position evenly; it is 5/4 by construction, recorded
 *  rather than hidden. There is no randomness: the order is a function of the brief
 *  list, so it is identical on every machine and hashed into the fingerprint. */
export const runOrder = () => {
  const order = [];
  for (const replicate of [1, 2, 3]) {
    for (const [b, brief] of BRIEF_LIST.entries()) {
      const withFirst = (replicate + b) % 2 === 0;
      for (const arm of withFirst ? ['with', 'without'] : ['without', 'with']) {
        order.push({ index: order.length, brief, arm, run: replicate, pairWithFirst: withFirst });
      }
    }
  }
  return order;
};

/* ── the tree must not move between the gates and the runs ─────────────── */

export const dirtyPaths = (porcelain) =>
  porcelain.split('\n').filter((l) => l.length > 3).map((l) => l.slice(3).trim()).filter(Boolean);

function requireCleanTree(what) {
  const paths = dirtyPaths(gitRaw('status', '--porcelain'));
  if (paths.length) {
    die(`the working tree is not clean, so ${what} would not be reproducible from HEAD:\n` +
        paths.map((p) => '    ' + p).join('\n') +
        '\n  Commit or discard these, then re-run both gates.');
  }
}

/* ── the image is addressed by id, never by tag ────────────────────────── */

async function buildArtifact() {
  return readFile(BUILD_ARTIFACT, 'utf8').then(JSON.parse, () => null);
}

async function imageRef() {
  const a = await buildArtifact();
  if (!a?.imageId) die('no build artifact. Run `build` first.');
  return a.imageId;
}

/* ── the runtime a gate is bound to ────────────────────────────────────── */

/** Read from the daemon, not from configuration. The gate is a claim about a running
 *  system; if the image, the network or the proxy is not the one the probe passed
 *  against, the claim no longer covers anything. */
async function runtimeFacts() {
  const image = await imageRef();
  const img = inspectJson(['image', 'inspect', image], 'the generation image');
  const net = inspectJson(['network', 'inspect', NET], `network ${NET}`);
  const px = inspectJson(['container', 'inspect', PROXY], `proxy container ${PROXY}`);

  // Containers legitimately come and go on this network while the benchmark runs; the
  // benchmark's own are excluded by name. Anything else joining the isolated network is
  // exactly the change that must invalidate a gate.
  const attached = Object.values(net.Containers ?? {}).map((c) => c.Name)
    .filter((n) => n !== PROXY && !n.startsWith(RUN_PREFIX)).sort();

  return {
    imageId: img.Id,
    imagePlatform: `${img.Os}/${img.Architecture}`,
    networkId: net.Id,
    networkInternal: net.Internal === true,
    networkDriver: net.Driver,
    networkForeignContainers: attached,
    proxyId: px.Id,
    proxyImageId: px.Image,
    proxyRunning: px.State?.Running === true,
    proxyEntrypoint: px.Config?.Entrypoint ?? null,
    proxyCmd: px.Config?.Cmd ?? null,
    proxyAllow: (px.Config?.Env ?? []).filter((e) => e.startsWith('ALLOW=')).sort(),
    proxyMounts: (px.Mounts ?? []).map((m) => `${m.Destination}${m.RW ? '' : ':ro'}`).sort(),
    proxyNetworks: Object.keys(px.NetworkSettings?.Networks ?? {}).sort(),
  };
}

export const runtimeProblems = (f) => {
  const p = [];
  if (f.imagePlatform !== PLATFORM) p.push(`image platform is ${f.imagePlatform}, not ${PLATFORM}`);
  if (!f.networkInternal) p.push('the generation network is not --internal');
  if (f.networkForeignContainers.length) p.push(`foreign containers on the network: ${f.networkForeignContainers.join(', ')}`);
  if (!f.proxyRunning) p.push('the egress proxy is not running');
  if (f.proxyImageId !== f.imageId) p.push('the proxy runs a different image from the generations');
  if (JSON.stringify(f.proxyAllow) !== JSON.stringify([`ALLOW=${ENDPOINT}`])) {
    p.push(`the proxy allowlist is ${JSON.stringify(f.proxyAllow)}, not exactly ALLOW=${ENDPOINT}`);
  }
  if (JSON.stringify(f.proxyMounts) !== JSON.stringify(['/proxy.mjs:ro'])) {
    p.push(`the proxy has unexpected mounts: ${JSON.stringify(f.proxyMounts)}`);
  }
  if (!f.proxyNetworks.includes(NET)) p.push('the proxy is not attached to the generation network');
  return p;
};

async function assertRuntime(gate, phase) {
  const now = await runtimeFacts();
  const bad = runtimeProblems(now);
  if (bad.length) die(`the Docker runtime is not in the state a gate can cover, before ${phase}:\n` +
    bad.map((b) => '    ' + b).join('\n'));
  const was = gate?.runtime;
  const moved = Object.entries(now).filter(([k, v]) => JSON.stringify(was?.[k]) !== JSON.stringify(v));
  if (moved.length) {
    die(`the Docker runtime changed since the gates, before ${phase}: ${moved.map(([k]) => k).join(', ')}\n` +
        '  Both gates are void. Re-run `probe` and `discovery`.');
  }
  return now;
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

/** Everything in source that, if it changes, invalidates a green gate. The runtime half
 *  lives in runtimeFacts(). */
async function fingerprint() {
  const build = (await buildArtifact()) ?? {};
  return {
    runnerSha256: sha(await readFile(fileURLToPath(import.meta.url), 'utf8')),
    baseLockSha256: sha(BASE_LOCK_TEXT),
    dockerfileSha256: sha(await readFile(join(BENCH, 'Dockerfile'), 'utf8')),
    entrypointSha256: sha(await readFile(join(BENCH, 'entrypoint.sh'), 'utf8')),
    probeSha256: sha(await readFile(join(BENCH, 'probe.sh'), 'utf8')),
    proxySha256: sha(await readFile(join(BENCH, 'egress-proxy.mjs'), 'utf8')),
    toolsLockSha256: sha(await readFile(TOOLS_LOCK, 'utf8').catch(() => '')),
    baseDigest: BASE_DIGEST,
    debianSnapshot: DEBIAN_SNAPSHOT,
    platform: PLATFORM,
    claudeVersion: CLAUDE_VERSION,
    claudeIntegrity: CLAUDE_INTEGRITY,
    model: MODEL,
    egressAllowlist: [ENDPOINT],
    imageId: build.imageId ?? null,
    imageBuiltFromDigest: build.baseDigest ?? null,
    aptManifestSha256: build.aptManifestSha256 ?? null,
    skillCommit: git('rev-parse', 'HEAD'),
    skillPayloadSha256: await hashTree(SKILL_DIR),
    promptSha256: sha(GENERATION_PROMPT),
    discoveryPromptSha256: sha(DISCOVERY_PROMPT),
    runOrderSha256: sha(JSON.stringify(runOrder())),
    budgetSha256: sha(JSON.stringify(BUDGET)),
  };
}

const driftAgainst = (gate, fp) =>
  Object.entries(fp).filter(([k, v]) => JSON.stringify(gate?.fingerprint?.[k]) !== JSON.stringify(v));

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
  // First, before anything touches Docker. A build from a dirty tree cannot be traced
  // back to a commit, and every gate downstream is bound to this one's output.
  requireCleanTree('this build');

  for (const [p, what] of [[TOOLS_PKG, 'bench/tools-package.json'], [TOOLS_LOCK, 'bench/tools-package-lock.json']]) {
    if (!(await stat(p).then(() => true, () => false))) die(`${what} is missing. It is committed source, not generated here.`);
  }

  // The digest comes from the committed lock and nowhere else. There is deliberately no
  // path in this function that pulls a tag or reads RepoDigests: that is how a base image
  // silently changes under a gate that is already green.
  console.log(`  pulling ${basePullRef()} for ${PLATFORM}`);
  if (docker(['pull', '--platform', PLATFORM, basePullRef()], { stdio: 'inherit' }).status !== 0) {
    die('could not pull the pinned base image');
  }
  if (docker(buildArgs(), { stdio: 'inherit' }).status !== 0) die('docker build failed');

  const img = inspectJson(['image', 'inspect', BUILD_TAG], 'the freshly built image');
  const id = img.Id;
  const platform = `${img.Os}/${img.Architecture}`;
  if (platform !== PLATFORM) die(`the image is ${platform}, not the pinned ${PLATFORM}`);

  // From here on the tag is never used again. Everything addresses this id.
  const ver = docker(['run', '--rm', '--platform', PLATFORM, '--entrypoint', 'claude', id, '--version']).stdout.trim();
  if (!versionMatches(ver)) die(`the image reports CLI "${ver}" but the lock pins exactly ${CLAUDE_VERSION}.`);
  const apt = docker(['run', '--rm', '--platform', PLATFORM, '--entrypoint', 'cat', id, '/opt/apt-manifest.txt']).stdout;
  if (!apt.trim()) die('the image has no apt manifest, so what it installed cannot be recorded');

  // An artifact, not a source edit. benchmarks/v2/runs/ is git-ignored, so building does
  // not dirty the tree and no commit is needed between here and the eighteen runs.
  await mkdir(RUNS, { recursive: true });
  await writeFile(join(RUNS, 'apt-manifest.txt'), apt);
  await writeFile(BUILD_ARTIFACT, JSON.stringify({
    buildTag: BUILD_TAG, imageId: id, platform,
    tagNote: 'The tag was used to build and is not used again. Containers are started from imageId.',
    base: BASE, baseDigest: BASE_DIGEST, debianSnapshot: DEBIAN_SNAPSHOT,
    aptPackages: apt.trim().split('\n').length, aptManifestSha256: sha(apt),
    claudeVersion: ver, pinnedClaudeVersion: CLAUDE_VERSION, claudeVersionExact: true,
    claudeIntegrity: CLAUDE_INTEGRITY,
    claudeIntegrityVerified: 'in-image, before install; the build fails on a mismatch',
    hardBudgetFlag: 'verified present at build time', budget: BUDGET,
    model: MODEL, builtAt: new Date().toISOString(), builtFromCommit: git('rev-parse', 'HEAD'),
    note: 'Build output, machine-specific. Committed with the run results afterwards, never before.',
  }, null, 2) + '\n');

  console.log(`\n  platform ${platform}`);
  console.log(`  base     ${BASE_DIGEST}`);
  console.log(`  apt      ${apt.trim().split('\n').length} packages from snapshot ${DEBIAN_SNAPSHOT}`);
  console.log(`  cli      ${ver}, tarball integrity verified, budget flag present`);
  console.log(`  image id ${id}\n`);
  console.log(`  wrote ${BUILD_ARTIFACT.replace(ROOT, '')}\n  next: up, then probe\n`);
}

/* ── network ───────────────────────────────────────────────────────────── */

async function up() {
  const image = await imageRef();
  docker(['rm', '-f', PROXY]);
  docker(['network', 'rm', NET]);
  if (docker(['network', 'create', '--internal', NET], { stdio: 'inherit' }).status !== 0) die('network create failed');
  if (docker(['run', '-d', '--name', PROXY, '--platform', PLATFORM, '--network', 'bridge',
              '-e', `ALLOW=${ENDPOINT}`,
              '-v', `${join(BENCH, 'egress-proxy.mjs')}:/proxy.mjs:ro`,
              '--entrypoint', 'node', image, '/proxy.mjs'], { stdio: 'inherit' }).status !== 0) die('proxy start failed');
  if (docker(['network', 'connect', '--alias', 'egress', NET, PROXY], { stdio: 'inherit' }).status !== 0) die('proxy attach failed');

  const bad = runtimeProblems(await runtimeFacts());
  if (bad.length) die('the runtime came up wrong:\n' + bad.map((b) => '    ' + b).join('\n'));
  console.log(`\n  ${NET} is --internal: no route off the host except through the proxy`);
  console.log(`  allowlist: ${ENDPOINT}, exact host only`);
  console.log(`  proxy and generations both run image ${image}\n`);
}

function down() {
  docker(['rm', '-f', PROXY]);
  docker(['network', 'rm', NET]);
  console.log('  stopped; only the benchmark network and its proxy were touched\n');
}

/* ── the one invocation everything uses ────────────────────────────────── */

/** Control and treatment differ by the skill mount and by nothing else.
 *
 *  ARM used to be passed to every container. It told the model which arm it was in, in
 *  plain text, in its own environment — the treatment could read that it had help and
 *  the control could read that it did not. It now exists only while probing, where the
 *  shell script needs to know which assertions to make and no model is present. */
function containerArgs({ workspace, arm, name, image, probing = false }) {
  if (!image) die('containerArgs needs an image id');
  const args = [
    'run', '--rm', '-i', '--name', name,
    '--platform', PLATFORM,
    '--network', NET,
    '-e', 'HTTPS_PROXY=http://egress:8888',
    '-e', 'HTTP_PROXY=http://egress:8888',
    '-e', 'NO_PROXY=',
    '--memory', '4g', '--cpus', '2', '--pids-limit', '512',
    '-v', `${workspace}:/work`,
  ];
  if (probing) {
    // Present only while probing. A generation container never has this mount and never
    // sees these variables, which is what lets the probe scan the filesystem for the mark.
    args.push('-v', `${join(BENCH, 'probe.sh')}:/probe/probe.sh:ro`,
              '-e', `ARM=${arm}`, '-e', `ENDPOINT=${ENDPOINT}`,
              '-e', `MARK=${MARK}`, '-e', `BLOCKED_URL=${BLOCKED_URL}`, '-e', `HOST_PATH=${HOST_PATH}`);
  }
  if (arm === 'with') args.push('-v', SKILL_MOUNT);
  args.push(image);
  return args;
}

/** Strip the one permitted difference. What is left must be identical, or the arms
 *  differ by something other than the skill. */
export const withoutSkillMount = (args) => {
  const i = args.indexOf(SKILL_MOUNT);
  return i > 0 && args[i - 1] === '-v' ? [...args.slice(0, i - 1), ...args.slice(i + 1)] : [...args];
};

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
  /* The container is started with --rm, so a short-lived one can be gone before the first
     poll and this loop then spends its whole timeout looking for something already removed.
     That is a race in the runner, not a fact about the isolation: on the first real run of
     this gate the treatment arm reported "never appeared" with every isolation check inside
     it passing. Reporting it as a mount mismatch would have read as a broken experiment.

     Callers pre-read the table with mountsFromCreate() before starting the container, so
     this path now only reports what it actually is. */
  return { ok: false, reason: 'the container was gone before it could be inspected', raced: true };
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

/** Read the mount table the daemon *will* give this container, without racing it.
 *
 *  `docker create` applies the identical argument list and returns a container that exists
 *  and has not started, so its mounts can be read deterministically and then thrown away.
 *  The container under test is still started separately by `docker run` with the same
 *  arguments, so nothing about what is measured changes — this is a second, disposable
 *  container used only to ask the daemon what those arguments mean.
 *
 *  The alternative was dropping --rm from the run so the exited container could be inspected
 *  afterwards. That would have changed the invocation the two arms share, which is the one
 *  thing this runner is built to keep identical. */
function mountsFromCreate(args, arm, probing) {
  const createArgs = args.map((a) => (a === 'run' ? 'create' : a))
    .filter((a) => a !== '--rm' && a !== '-i');
  const i = createArgs.indexOf('--name');
  if (i >= 0) createArgs[i + 1] = `${createArgs[i + 1]}-mountcheck`;

  const made = docker(createArgs);
  if (made.status !== 0) {
    return { ok: false, reason: `could not create a container to read mounts: ${made.stderr.trim().slice(0, 200)}` };
  }
  const id = made.stdout.trim();
  try {
    const r = docker(['inspect', '--format', '{{json .Mounts}}', id]);
    if (r.status !== 0) return { ok: false, reason: 'created container would not inspect' };
    let mounts = [];
    try { mounts = JSON.parse(r.stdout.trim()); } catch { return { ok: false, reason: 'unparseable mount table' }; }
    const got = mounts.map((m) => `${m.Destination}${m.RW ? '' : ':ro'}`).sort();
    const want = expectedMounts(arm, probing);
    return { ok: JSON.stringify(got) === JSON.stringify(want), got, want, source: 'docker create' };
  } finally {
    docker(['rm', '-f', id]);
  }
}

async function freshWorkspace(id, files = {}) {
  const ws = join(LAB, id);
  await rm(ws, { recursive: true, force: true });
  await mkdir(ws, { recursive: true });
  for (const [name, content] of Object.entries(files)) await writeFile(join(ws, name), content);
  return ws;
}

/* ── gate 1: mechanical, unpaid ────────────────────────────────────────── */

async function probe() {
  requireCleanTree('this gate');
  const image = await imageRef();
  const runtime = await runtimeFacts();
  const bad = runtimeProblems(runtime);
  if (bad.length) die('the runtime is not in a state a gate can cover:\n' + bad.map((b) => '    ' + b).join('\n'));

  const results = {};
  for (const arm of ['without', 'with']) {
    const ws = await freshWorkspace(`probe-${arm}`, { 'BRIEF.md': 'Probe workspace. Build nothing.\n' });
    const name = runName(`probe-${arm}`);

    const args = containerArgs({ workspace: ws, arm, name, image, probing: true });
    /* Read what the daemon makes of these arguments before anything starts, so a container
       that exits quickly cannot make the check report a mount fault it does not have. */
    let mounts = mountsFromCreate(args, arm, true);
    const running = runContainer(args, 'bash /probe/probe.sh', null, 8 * 60 * 1000, name);
    if (!mounts.ok && !mounts.reason) mounts = await inspectMounts(name, arm, true);
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
  await mkdir(RUNS, { recursive: true });
  await writeFile(GATE, JSON.stringify({
    when: new Date().toISOString(),
    treeClean: true,
    fingerprint: await fingerprint(),
    runtime, runtimeSha256: sha(JSON.stringify(runtime)),
    budget: BUDGET,
    mechanicalProbe: { control: results.without, treatment: results.with, pass },
    modelProbe: null,
    note: 'No credential is used or recorded by the mechanical probe. Both gates must be green, ' +
          'against one unchanged fingerprint and one unchanged Docker runtime, before run-all.',
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
  await assertRuntime(gate, 'discovery');
  const image = await imageRef();

  const secret = await readSecret('two short calls');
  if (!secret) die('no key given');

  const out = {};
  for (const arm of ['without', 'with']) {
    // A fresh, empty workspace per arm. Reusing the probe workspaces left probe.log and
    // a probe write-test behind, so the two arms would not have started from the same
    // directory — a difference that has nothing to do with the skill.
    const ws = await freshWorkspace(`disc-${arm}`);
    const name = runName(`disc-${arm}`);
    const r = await runContainer(containerArgs({ workspace: ws, arm, name, image }),
      discoveryCommand(), secret, 5 * 60 * 1000, name);

    const raw = await readFile(join(ws, 'disc.json'), 'utf8').catch(() => '');
    const err = await readFile(join(ws, 'disc.err'), 'utf8').catch(() => '');
    let j = null;
    try { j = JSON.parse(raw); } catch { /* handled below */ }
    const modelReturned = j?.modelUsage ? Object.keys(j.modelUsage)[0] : (j?.model ?? null);
    const names = parseSkillNames(j?.result ?? '');
    out[arm] = {
      exit: r.code, isError: j?.is_error ?? null, modelReturned, modelAccepted: modelAccepted(modelReturned),
      sessionId: j?.session_id ?? null, costUsd: j?.total_cost_usd ?? null,
      skillNames: names, namesSkill: namesSkill(names),
      // Secondary evidence only. The debug channel has no stable format, so it is
      // recorded and never gates. The negative direction is different: any appearance of
      // the mark in the control is a leak regardless of where it came from.
      debugMentionsSkillPath: err.includes(SKILL_DEST),
      markOccurrencesAnywhere: ((j?.result ?? '') + err).toLowerCase().split(MARK).length - 1,
      resultHead: (j?.result ?? '').slice(0, 200),
    };
    console.log(`\n  discovery — ${arm}: exit ${r.code}, skills ${JSON.stringify(names).slice(0, 120)}`);
    console.log(`    names the skill ${out[arm].namesSkill}, mark seen ${out[arm].markOccurrencesAnywhere}x, model ${modelReturned ?? '?'}`);
  }

  const pass =
    out.with.namesSkill === true &&
    out.without.namesSkill === false && out.without.markOccurrencesAnywhere === 0 &&
    out.with.exit === 0 && out.without.exit === 0 &&
    out.with.isError !== true && out.without.isError !== true &&
    out.with.modelAccepted && out.without.modelAccepted;

  const discoveryCostUsd = (out.with.costUsd ?? 0) + (out.without.costUsd ?? 0);
  await writeFile(GATE, JSON.stringify({
    ...gate, fingerprint: fp,
    modelProbe: { control: out.without, treatment: out.with, pass, discoveryCostUsd, when: new Date().toISOString() },
  }, null, 2) + '\n');
  console.log(`\n  spent $${discoveryCostUsd.toFixed(2)}`);
  console.log(`  ${pass ? 'PASS — the treatment loads the skill and the control never sees it. run-all is unlocked.' : 'FAIL — do not run the generations'}\n`);
  process.exit(pass ? 0 : 1);
}

/* ── preflight ─────────────────────────────────────────────────────────── */

async function preflight() {
  const gate = await readFile(GATE, 'utf8').then(JSON.parse, () => null);
  const fp = await fingerprint();
  const drift = gate ? driftAgainst(gate, fp) : [];
  const dirty = dirtyPaths(gitRaw('status', '--porcelain'));
  const order = runOrder();

  console.log(`\n  planned: ${BRIEF_LIST.length} briefs x 2 arms x 3 = ${order.length} generations, in this order`);
  for (const s of order) console.log(`    ${String(s.index + 1).padStart(2)}  ${s.brief}-${s.arm}-${s.run}`);
  console.log(`\n  first position   ${order.filter((s) => s.index % 2 === 0 && s.arm === 'with').length} with, ` +
    `${order.filter((s) => s.index % 2 === 0 && s.arm === 'without').length} without (9 pairs cannot split evenly)`);
  console.log(`  model            ${MODEL}`);
  console.log(`  platform         ${PLATFORM}   (committed)`);
  console.log(`  base digest      ${BASE_DIGEST}   (committed)`);
  console.log(`  debian snapshot  ${DEBIAN_SNAPSHOT}   (committed)`);
  console.log(`  cli              ${CLAUDE_VERSION} exactly, integrity pinned   (committed)`);
  console.log(`  image id         ${fp.imageId ?? 'not built yet'}   (artifact, used instead of the tag)`);
  console.log(`  apt manifest     ${fp.aptManifestSha256?.slice(0, 16) ?? 'not built yet'}   (artifact)`);
  console.log(`  skill commit     ${fp.skillCommit}`);
  console.log(`  working tree     ${dirty.length ? 'DIRTY: ' + dirty.join(', ') : 'clean'}`);
  console.log(`  per run          ${RUN_TIMEOUT_MS / 60000} min, ${MAX_TURNS} turns, $${MAX_COST_PER_RUN_USD} enforced by the CLI`);
  console.log(`  total budget     $${MAX_TOTAL_COST_USD}, checked before each run starts`);
  console.log(`  discovery spend  ${gate?.modelProbe?.discoveryCostUsd != null ? '$' + gate.modelProbe.discoveryCostUsd.toFixed(2) : 'not run'}`);
  console.log(`  mechanical gate  ${gate?.mechanicalProbe?.pass === true ? 'green' : 'NOT GREEN'}`);
  console.log(`  discovery gate   ${gate?.modelProbe?.pass === true ? 'green' : 'NOT GREEN'}`);
  if (drift.length) console.log(`  DRIFT since the gates: ${drift.map(([k]) => k).join(', ')}`);

  let runtimeOk = false;
  if (gateReady(gate)) {
    await assertRuntime(gate, 'preflight');   // exits on any change
    runtimeOk = true;
    console.log('  docker runtime   unchanged since the gates');
  }
  console.log('');
  process.exit(gateReady(gate) && drift.length === 0 && dirty.length === 0 && runtimeOk ? 0 : 1);
}

/* ── run ───────────────────────────────────────────────────────────────── */

async function runOne(slot, secret, fp, gate, spentSoFar, image) {
  const { brief, arm, run: n } = slot;
  const runId = `${brief}-${arm}-${n}`;
  const name = runName(runId);
  const briefText = await readFile(join(BRIEFS, `${brief}.md`), 'utf8');
  const ws = await freshWorkspace(runId, { 'BRIEF.md': briefText });
  await mkdir(join(ws, 'site'), { recursive: true });

  // Re-read the daemon before every run, not once at the start. A network recreated or a
  // proxy restarted between run 4 and run 5 would otherwise pass unnoticed.
  const runtime = await assertRuntime(gate, `run ${slot.index + 1}`);

  const started = new Date().toISOString();
  const args = containerArgs({ workspace: ws, arm, name, image });
  /* Same as the probe: read the mount table off a created-but-unstarted copy so a fast exit
     cannot be mistaken for a mount fault. A generation run is long enough that the race has
     never fired here, but a check that is right by luck is not a check. */
  let mounts = mountsFromCreate(args, arm, false);
  const running = runContainer(args, generationCommand(GENERATION_PROMPT), secret, RUN_TIMEOUT_MS, name);
  if (!mounts.ok && !mounts.reason) mounts = await inspectMounts(name, arm, false);
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
    orderIndex: slot.index, pairWithFirst: slot.pairWithFirst,
    prompt: GENERATION_PROMPT, promptSha256: sha(GENERATION_PROMPT), briefSha256: sha(briefText),
    modelRequested: MODEL, modelReturned, modelAccepted: modelAccepted(modelReturned),
    sessionId: j?.session_id ?? null, usage: j?.usage ?? null, numTurns: j?.num_turns ?? null,
    costUsd: cost, isError: j?.is_error ?? null,
    platform: PLATFORM, imageId: image,
    budget: BUDGET, spentBeforeThisRunUsd: spentSoFar,
    discoveryCostUsd: gate?.modelProbe?.discoveryCostUsd ?? null,
    settings: { outputFormat: 'json', maxTurns: MAX_TURNS, permissionMode: 'default', timeoutMs: RUN_TIMEOUT_MS,
                budgetFlag: `--max-budget-usd ${MAX_COST_PER_RUN_USD}` },
    mounts: { expected: mounts.want ?? expectedMounts(arm, false), observed: mounts.got ?? null, ok: mounts.ok },
    armDifference: 'one read-only bind mount; container arguments and environment are otherwise identical',
    runtimeSha256: sha(JSON.stringify(runtime)),
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
  await assertRuntime(gate, 'the runs');
  const image = await imageRef();

  const secret = await readSecret('all 18 generations, asked once');
  if (!secret) die('no key given');

  const order = runOrder();
  console.log(`\n  order (counterbalanced, deterministic): ${order.map((s) => s.arm[0]).join('')}\n`);

  let spent = 0;
  for (const slot of order) {
    // Checked before the money is committed, not after it is reported.
    if (spent + MAX_COST_PER_RUN_USD > MAX_TOTAL_COST_USD) {
      die(`\n  stopping before run ${slot.index + 1}: $${spent.toFixed(2)} spent and the next run ` +
        `could take it past the $${MAX_TOTAL_COST_USD} budget.\n`);
    }
    const res = await runOne(slot, secret, fp, gate, spent, image);
    spent += res.cost;
    if (!res.ok) die(`\n  stopped at the first failure. $${spent.toFixed(2)} spent. ` +
      'The failed run is under INVALID-* and is not benchmark data.\n');
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
  ok('the platform is pinned everywhere it can be',
    buildArgs().includes('--platform') && buildArgs().includes(PLATFORM) &&
    containerArgs({ workspace: '/w', arm: 'without', name: 'n', image: 'sha256:x' }).includes(PLATFORM));
  ok('the CLI version is matched exactly, not by substring',
    versionMatches(`${CLAUDE_VERSION} (Claude Code)`) && !versionMatches(`${CLAUDE_VERSION}1 (Claude Code)`) &&
    !versionMatches('2.1.9 (Claude Code)'));
  ok('the image id is an artifact, not source',
    BUILD_ARTIFACT.includes('benchmarks') && BUILD_ARTIFACT.includes('runs') && !tracked('bench/image.lock.json'));

  // The runner must be able to finish its own sequence. Every file it writes between
  // `build` and the last run has to be git-ignored, or the next command's clean-tree
  // check refuses to proceed and the benchmark blocks on its own output.
  const ignored = (p) => spawnSync('git', ['check-ignore', '-q', p], { cwd: ROOT }).status === 0;
  const rel = (p) => p.replace(ROOT, '').replace(/\\/g, '/');
  for (const [what, p] of [
    ['the mechanical gate verdict', rel(GATE)],
    ['the discovery verdict', rel(GATE)],
    ['the build artifact', rel(BUILD_ARTIFACT)],
    ['the apt manifest', rel(join(RUNS, 'apt-manifest.txt'))],
    ['a run manifest', rel(join(RUNS, '01-company-with-1/manifest.json'))],
    ['a quarantined run', rel(join(RUNS, 'INVALID-01-company-with-1/manifest.json'))],
  ]) ok(`${what} cannot dirty the tree`, ignored(p), p);

  const dockerfile = await readFile(join(BENCH, 'Dockerfile'), 'utf8');
  // Comments are stripped first: this file explains why deb.debian.org is not used, and
  // a naive grep would read its own explanation as the thing it forbids.
  const instructions = dockerfile.split('\n').filter((l) => !l.trim().startsWith('#')).join('\n');
  ok('probe.sh is not baked into the image', !/COPY\s+probe\.sh/.test(instructions));
  ok('the Dockerfile takes the digest as a build argument', /FROM \S+@\$\{BASE_DIGEST\}/.test(instructions));
  ok('apt reads a frozen snapshot, not a moving mirror',
    /snapshot\.debian\.org\/archive\/debian\/%s/.test(instructions) && !/deb\.debian\.org/.test(instructions));
  ok('the CLI tarball is verified before it is installed',
    /npm pack "@anthropic-ai\/claude-code@\$\{CLAUDE_VERSION\}"/.test(instructions) &&
    /createHash\("sha512"\)/.test(instructions) && /npm install -g "\$TARBALL"/.test(instructions));
  ok('the build refuses a CLI without the budget flag', /max-budget-usd/.test(instructions));
  ok('what apt installed is recorded in the image', /dpkg-query -W .* > \/opt\/apt-manifest\.txt/.test(instructions));
  ok('the integrity hash is actually passed to the build',
    buildArgs().includes(`CLAUDE_INTEGRITY=${CLAUDE_INTEGRITY}`) &&
    buildArgs().includes(`DEBIAN_SNAPSHOT=${DEBIAN_SNAPSHOT}`));

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
    ![BUILD_TAG, NET, PROXY, runName('01-company-with-1')].some((s) => new RegExp(MARK, 'i').test(s)));

  /* The central claim: the two arms differ by one mount and by nothing else. */
  const IMG = 'sha256:0123456789abcdef';
  const ctl = containerArgs({ workspace: '/w', arm: 'without', name: 'n', image: IMG });
  const trt = containerArgs({ workspace: '/w', arm: 'with', name: 'n', image: IMG });
  ok('treatment minus the skill mount is byte-identical to control',
    JSON.stringify(withoutSkillMount(trt)) === JSON.stringify(ctl), `${trt.length} vs ${ctl.length} args`);
  ok('the skill mount is the only difference',
    trt.length === ctl.length + 2 && trt.includes(SKILL_MOUNT) && !ctl.includes(SKILL_MOUNT));
  ok('no generation or discovery container is told which arm it is in',
    !ctl.concat(trt).some((a) => /^ARM=/.test(String(a))));
  ok('the probe is the only container that gets ARM',
    containerArgs({ workspace: '/w', arm: 'with', name: 'n', image: IMG, probing: true }).includes('ARM=with'));
  ok('containers are started from an image id, not a tag',
    ctl[ctl.length - 1] === IMG && !ctl.includes(BUILD_TAG));

  const mountsOf = (a) => a.filter((_, i) => a[i - 1] === '-v');
  ok('a control generation mounts only the workspace',
    JSON.stringify(mountsOf(ctl)) === JSON.stringify(['/w:/work']));
  ok('a treatment generation adds only the read-only skill',
    mountsOf(trt).length === 2 && mountsOf(trt)[1].endsWith(':ro'));
  ok('no generation container carries a probe mount',
    !ctl.concat(trt).some((a) => String(a).includes('/probe/')));
  ok('no generation container carries the mark in its environment',
    !ctl.concat(trt).some((a) => /^(MARK|BLOCKED_URL|HOST_PATH)=/.test(String(a))));
  ok('no credential appears in any docker argument',
    !ctl.some((a) => /API_KEY|TOKEN|SECRET|sk-ant/i.test(String(a))));

  ok('the expected mount table is exact',
    JSON.stringify(expectedMounts('without', false)) === JSON.stringify(['/work']) &&
    expectedMounts('with', true).length === 3);
  ok('the real exit code is kept',
    !/echo EXIT=/.test(generationCommand('p')) && /2> \/work\/agent\.err/.test(generationCommand('p')));
  ok('the spend cap is handed to the process, not checked afterwards',
    generationCommand('p').includes(`--max-budget-usd ${MAX_COST_PER_RUN_USD}`) &&
    discoveryCommand().includes(`--max-budget-usd ${MAX_DISCOVERY_USD}`));

  /* Discovery evidence must be structured. */
  ok('skill discovery reads a parsed list, not stray text',
    namesSkill(parseSkillNames(`["alpha","${MARK}","beta"]`)) &&
    namesSkill(parseSkillNames(`["${MARK} — build websites"]`)) &&
    !namesSkill(parseSkillNames('["alpha","beta"]')) &&
    !namesSkill(parseSkillNames(`I could not find ${MARK} anywhere on disk`)) &&
    !namesSkill(parseSkillNames(`error at /opt/${MARK}/x.js`)));

  /* Runtime binding. */
  const goodRuntime = {
    imageId: IMG, imagePlatform: PLATFORM, networkId: 'n1', networkInternal: true, networkDriver: 'bridge',
    networkForeignContainers: [], proxyId: 'p1', proxyImageId: IMG, proxyRunning: true,
    proxyEntrypoint: ['node'], proxyCmd: ['/proxy.mjs'], proxyAllow: [`ALLOW=${ENDPOINT}`],
    proxyMounts: ['/proxy.mjs:ro'], proxyNetworks: [NET, 'bridge'].sort(),
  };
  ok('a correct runtime raises nothing', runtimeProblems(goodRuntime).length === 0);
  ok('a non-internal network is rejected',
    runtimeProblems({ ...goodRuntime, networkInternal: false }).length === 1);
  ok('a widened allowlist is rejected',
    runtimeProblems({ ...goodRuntime, proxyAllow: [`ALLOW=${ENDPOINT},example.com`] }).length === 1);
  ok('a foreign container on the network is rejected',
    runtimeProblems({ ...goodRuntime, networkForeignContainers: ['someone-elses'] }).length === 1);
  ok('a proxy on a different image is rejected',
    runtimeProblems({ ...goodRuntime, proxyImageId: 'sha256:other' }).length === 1);
  ok('an extra proxy mount is rejected',
    runtimeProblems({ ...goodRuntime, proxyMounts: ['/proxy.mjs:ro', '/host:ro'] }).length === 1);
  ok('the wrong platform is rejected',
    runtimeProblems({ ...goodRuntime, imagePlatform: 'linux/arm64' }).length === 1);

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
  ok('an uncommitted change is detected, with the path intact',
    JSON.stringify(dirtyPaths(' M bench/Dockerfile\n?? x.txt\nM  a/b.json\n')) ===
      JSON.stringify(['bench/Dockerfile', 'x.txt', 'a/b.json']) && dirtyPaths('').length === 0);

  const order = runOrder();
  const count = (f) => order.filter(f).length;
  ok('the run order is 18 slots, 9 per arm',
    order.length === 18 && count((s) => s.arm === 'with') === 9 && count((s) => s.arm === 'without') === 9);
  ok('every brief gets three of each arm',
    BRIEF_LIST.every((b) => ['with', 'without'].every((a) => count((s) => s.brief === b && s.arm === a) === 3)));
  ok('the two arms of a pair are adjacent',
    order.every((s, i) => i % 2 === 1 || (order[i + 1].brief === s.brief && order[i + 1].run === s.run &&
      order[i + 1].arm !== s.arm)));
  ok('first position is counterbalanced as far as nine pairs allow',
    Math.abs(count((s) => s.index % 2 === 0 && s.arm === 'with') -
             count((s) => s.index % 2 === 0 && s.arm === 'without')) <= 1);
  ok('briefs interleave rather than running in blocks',
    new Set(order.slice(0, 6).map((s) => s.brief)).size === BRIEF_LIST.length);
  ok('the order is deterministic, not seeded by chance',
    JSON.stringify(runOrder()) === JSON.stringify(runOrder()));
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
  console.log(`\n  ${failed === 0 ? `PASS — ${rows.length} checks, nothing was spent` : `FAIL — ${failed} problem(s)`}\n`);
  process.exit(failed === 0 ? 0 : 1);
}

const [cmd] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const cmds = { selftest, build, up, down, probe, discovery, preflight, 'run-all': runAll };
if (!cmds[cmd]) die('usage: bench-container.mjs <selftest|build|up|probe|discovery|preflight|run-all|down>');
await cmds[cmd]();
