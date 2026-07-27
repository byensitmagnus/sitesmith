#!/usr/bin/env node
/**
 * The containerised benchmark runner. Original work, MIT.
 *
 *   node tools/bench-container.mjs selftest   # unpaid: syntax, refusals, hashes
 *   node tools/bench-container.mjs build      # pinned image, writes image.lock.json
 *   node tools/bench-container.mjs up         # internal network + egress proxy
 *   node tools/bench-container.mjs probe      # UNPAID mechanical isolation gate
 *   node tools/bench-container.mjs probe-model  # optional paid supplement
 *   node tools/bench-container.mjs preflight  # show the 18 runs, spend nothing
 *   node tools/bench-container.mjs run <brief> <arm> <n>
 *   node tools/bench-container.mjs down
 *
 * The gate is mechanical. A model's own account of what it could reach is a useful
 * supplement and a worthless gate: a subject reporting on its own confinement can be
 * wrong or agreeable, and a shell either connects or it does not.
 *
 * The credential is asked for at run time with the echo off and piped to the
 * container's stdin. It is never an argument, an -e variable, a file or a layer, so
 * `docker inspect` cannot show it, and it is never written to a log or a manifest.
 */

import { readFile, writeFile, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync, spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BENCH = join(ROOT, 'bench');
const LAB = join(tmpdir(), 'wsbench');
const RUNS = join(ROOT, 'benchmarks/v2/runs');
const BRIEFS = join(ROOT, 'benchmarks/v2/briefs');
const LOCK = join(BENCH, 'image.lock.json');
const GATE = join(ROOT, 'benchmarks/v2/isolation-probe.json');

const IMAGE = 'sitesmith-bench:2';
const NET = 'sitesmith-bench-net';
const PROXY = 'sitesmith-bench-egress';

/* Canonical benchmark mode: one host, exactly. No telemetry hosts, no --allow, no
   subdomains. Anything else and "the control cannot reach the skill" stops being a
   property of the network. */
const ENDPOINT = 'api.anthropic.com';
const MODEL = 'claude-opus-4-5-20251101';
const CLAUDE_VERSION = '2.1.220';
const BASE = 'node:22-bookworm-slim';

const BRIEF_LIST = ['01-company', '02-shop', '03-console'];
const RUN_TIMEOUT_MS = 45 * 60 * 1000;
const MAX_TURNS = 220;

const die = (m) => {
  console.error(m);
  process.exit(2);
};
const sha = (s) => createHash('sha256').update(s).digest('hex');
const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' }).trim();

function docker(args, opts = {}) {
  const r = spawnSync('docker', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...opts });
  if (r.error) die('docker is not installed or not running. See bench/README.md.');
  return r;
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

/** Everything that, if changed, invalidates a green probe. */
async function fingerprint() {
  const lock = await readFile(LOCK, 'utf8').then(JSON.parse, () => ({}));
  return {
    runnerSha256: sha(await readFile(fileURLToPath(import.meta.url), 'utf8')),
    dockerfileSha256: sha(await readFile(join(BENCH, 'Dockerfile'), 'utf8')),
    entrypointSha256: sha(await readFile(join(BENCH, 'entrypoint.sh'), 'utf8')),
    probeSha256: sha(await readFile(join(BENCH, 'probe.sh'), 'utf8')),
    proxySha256: sha(await readFile(join(BENCH, 'egress-proxy.mjs'), 'utf8')),
    dependencyLockSha256: sha(await readFile(join(BENCH, 'tools-package-lock.json'), 'utf8').catch(() => '')),
    baseDigest: lock.baseDigest ?? null,
    imageId: lock.imageId ?? null,
    claudeVersion: lock.claudeVersion ?? CLAUDE_VERSION,
    egressAllowlist: [ENDPOINT],
    model: MODEL,
    skillCommit: git('rev-parse', 'HEAD'),
    skillPayloadSha256: await hashTree(join(ROOT, 'skills', 'sitesmith')),
    promptSha256: sha(GENERATION_PROMPT),
  };
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

/* ── secret ────────────────────────────────────────────────────────────── */

/** Asked for at run time, echo off, held in memory, piped to stdin. Never stored. */
function readSecret(purpose) {
  return new Promise((res) => {
    process.stdout.write(`\n  API key (${purpose}) — input hidden, not stored: `);
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    const out = rl.output;
    out.write = ((w) => (s, ...a) => (/\n/.test(s) ? w.call(out, s, ...a) : true))(process.stdout.write.bind(process.stdout));
    rl.question('', (answer) => {
      rl.close();
      process.stdout.write('\n');
      res(answer.trim());
    });
  });
}

/* ── build ─────────────────────────────────────────────────────────────── */

async function build() {
  await writeFile(
    join(BENCH, 'tools-package.json'),
    JSON.stringify(
      { name: 'bench-tools', private: true, type: 'module',
        dependencies: { playwright: '1.49.1', '@axe-core/playwright': '4.10.1' } },
      null, 2,
    ) + '\n',
  );
  if (!(await stat(join(BENCH, 'tools-package-lock.json')).then(() => true, () => false))) {
    const r = spawnSync('npm', ['install', '--package-lock-only', '--prefix', BENCH], {
      encoding: 'utf8', shell: process.platform === 'win32',
    });
    if (r.status !== 0) die('could not generate the tools lockfile:\n' + r.stderr);
  }

  // Resolve the base by digest and pin it, so a later rebuild is the same image.
  docker(['pull', BASE], { stdio: 'inherit' });
  const insp = docker(['inspect', '--format', '{{index .RepoDigests 0}}', BASE], { encoding: 'utf8' });
  const digest = (insp.stdout ?? '').trim().split('@')[1];
  if (!digest?.startsWith('sha256:')) die('could not resolve a digest for ' + BASE);

  const b = docker(
    ['build', '--build-arg', `BASE_DIGEST=${digest}`, '--build-arg', `CLAUDE_VERSION=${CLAUDE_VERSION}`,
     '-t', IMAGE, BENCH],
    { stdio: 'inherit' },
  );
  if (b.status !== 0) die('docker build failed');

  const id = docker(['image', 'inspect', '--format', '{{.Id}}', IMAGE], { encoding: 'utf8' }).stdout.trim();
  const ver = docker(['run', '--rm', '--entrypoint', 'claude', IMAGE, '--version'], { encoding: 'utf8' }).stdout.trim();
  await writeFile(
    LOCK,
    JSON.stringify({ base: BASE, baseDigest: digest, claudeVersion: ver, requestedClaudeVersion: CLAUDE_VERSION,
                     imageId: id, builtAt: new Date().toISOString() }, null, 2) + '\n',
  );
  console.log(`\n  ${IMAGE}\n  base   ${digest}\n  cli    ${ver}\n  id     ${id}\n`);
}

/* ── network ───────────────────────────────────────────────────────────── */

function up() {
  docker(['rm', '-f', PROXY]);
  docker(['network', 'rm', NET]);
  if (docker(['network', 'create', '--internal', NET], { stdio: 'inherit' }).status !== 0) die('network create failed');
  const r = docker(
    ['run', '-d', '--name', PROXY, '--network', 'bridge', '-e', `ALLOW=${ENDPOINT}`,
     '-v', `${join(BENCH, 'egress-proxy.mjs')}:/proxy.mjs:ro`,
     '--entrypoint', 'node', IMAGE, '/proxy.mjs'],
    { stdio: 'inherit' },
  );
  if (r.status !== 0) die('proxy start failed');
  if (docker(['network', 'connect', '--alias', 'egress', NET, PROXY], { stdio: 'inherit' }).status !== 0) die('proxy attach failed');
  console.log(`\n  ${NET} is internal: no route off the host except the proxy`);
  console.log(`  allowlist: ${ENDPOINT} (exact host only)\n`);
}

function down() {
  docker(['rm', '-f', PROXY]);
  docker(['network', 'rm', NET]);
  console.log('  stopped\n');
}

/* ── the one invocation everything uses ────────────────────────────────── */

function containerArgs({ workspace, arm, name, extra = [] }) {
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
    ...extra,
  ];
  if (arm === 'with') {
    args.push('-v', `${join(ROOT, 'skills', 'sitesmith')}:/home/bench/.claude/skills/sitesmith:ro`);
  }
  args.push(IMAGE);
  return args;
}

/** Runs a container, optionally feeding the secret as the first stdin line. */
function runContainer(args, command, secret, timeoutMs = 10 * 60 * 1000) {
  return new Promise((res) => {
    const child = spawn('docker', [...args, command], { stdio: ['pipe', 'pipe', 'pipe'] });
    let out = '';
    const killer = setTimeout(() => child.kill('SIGKILL'), timeoutMs);
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (out += d));
    child.stdin.write(secret ? secret + '\n' : '\n');
    child.stdin.end();
    child.on('close', (code) => {
      clearTimeout(killer);
      res({ code, out });
    });
  });
}

/* ── the gate: mechanical, unpaid ──────────────────────────────────────── */

async function probe() {
  const results = {};
  for (const arm of ['without', 'with']) {
    const ws = join(LAB, `probe-${arm}`);
    await rm(ws, { recursive: true, force: true });
    await mkdir(ws, { recursive: true });
    await writeFile(join(ws, 'BRIEF.md'), 'Probe workspace. Build nothing.\n');

    // No secret is piped: the mechanical probe never talks to the model.
    const { code, out } = await runContainer(
      containerArgs({ workspace: ws, arm, name: `bench-probe-${arm}` }),
      'bash /usr/local/bin/probe.sh',
      null,
    );
    await writeFile(join(ws, 'probe.log'), out);
    const line = out.trim().split('\n').filter((l) => l.trim().startsWith('{')).pop();
    let parsed = null;
    try { parsed = JSON.parse(line); } catch { /* unparseable is a fail */ }
    results[arm] = { exit: code, verdict: parsed?.verdict ?? 'unparseable', failed: parsed?.failed ?? null, checks: parsed?.checks ?? null };

    console.log(`\n  mechanical probe — ${arm}`);
    if (!parsed) console.log(out.trim().split('\n').slice(-14).map((l) => '    ' + l).join('\n'));
    else {
      for (const [k, v] of Object.entries(parsed.checks)) console.log(`    ${k.padEnd(20)} ${v}`);
      console.log(`    ${'verdict'.padEnd(20)} ${parsed.verdict} (${parsed.passed} passed, ${parsed.failed} failed)`);
    }
  }

  const fp = await fingerprint();
  const verdict = {
    when: new Date().toISOString(),
    kind: 'mechanical',
    fingerprint: fp,
    control: results.without,
    treatment: results.with,
    pass: results.without?.verdict === 'pass' && results.with?.verdict === 'pass',
    note: 'No credential is recorded here or anywhere. The probe never uses one.',
  };
  await mkdir(join(ROOT, 'benchmarks/v2'), { recursive: true });
  await writeFile(GATE, JSON.stringify(verdict, null, 2) + '\n');
  console.log(`\n  ${verdict.pass ? 'PASS — isolation proven mechanically' : 'FAIL — do not run the paid generations'}\n`);
  process.exit(verdict.pass ? 0 : 1);
}

/* ── optional paid supplement: does the CLI actually load the skill ────── */

async function probeModel() {
  const gate = await readFile(GATE, 'utf8').then(JSON.parse, () => null);
  if (gate?.pass !== true) die('run the mechanical probe first.');
  const secret = await readSecret('one short call per arm');
  if (!secret) die('no key given');

  const out = {};
  for (const arm of ['without', 'with']) {
    const ws = join(LAB, `probe-${arm}`);
    const cmd =
      `claude -p "List the names of every skill available to you, then stop. If none, say NONE." ` +
      `--model ${MODEL} --output-format json --max-turns 3 --debug 2>&1`;
    const r = await runContainer(containerArgs({ workspace: ws, arm, name: `bench-model-${arm}` }), cmd, secret);
    const json = (() => {
      const m = r.out.match(/\{[\s\S]*"result"[\s\S]*\}/);
      try { return JSON.parse(m?.[0] ?? ''); } catch { return null; }
    })();
    const loaded = /sitesmith/i.test(r.out);
    out[arm] = {
      exit: r.code,
      skillReferenced: loaded,
      modelReturned: json?.modelUsage ? Object.keys(json.modelUsage)[0] : (json?.model ?? null),
      sessionId: json?.session_id ?? null,
      usage: json?.usage ?? null,
      resultHead: (json?.result ?? '').slice(0, 300),
    };
    console.log(`\n  model probe — ${arm}: skill referenced ${loaded}, model ${out[arm].modelReturned ?? '?'}`);
  }
  const pass = out.with.skillReferenced === true && out.without.skillReferenced === false;
  const merged = { ...gate, modelProbe: { ...out, pass, when: new Date().toISOString() } };
  await writeFile(GATE, JSON.stringify(merged, null, 2) + '\n');
  console.log(`\n  ${pass ? 'PASS — treatment loads the skill, control does not' : 'FAIL — skill discovery not demonstrated'}\n`);
  process.exit(pass ? 0 : 1);
}

/* ── preflight ─────────────────────────────────────────────────────────── */

async function preflight() {
  const gate = await readFile(GATE, 'utf8').then(JSON.parse, () => null);
  const fp = await fingerprint();
  const drift = gate ? Object.entries(fp).filter(([k, v]) => JSON.stringify(gate.fingerprint?.[k]) !== JSON.stringify(v)) : [];
  console.log(`\n  planned: ${BRIEF_LIST.length} briefs x 2 arms x 3 = ${BRIEF_LIST.length * 6} generations`);
  for (const b of BRIEF_LIST) for (const arm of ['with', 'without']) for (const n of [1, 2, 3]) console.log(`    ${b}-${arm}-${n}`);
  console.log(`\n  model            ${MODEL}`);
  console.log(`  image            ${fp.imageId ?? 'not built'}`);
  console.log(`  base digest      ${fp.baseDigest ?? 'not built'}`);
  console.log(`  cli              ${fp.claudeVersion}`);
  console.log(`  skill commit     ${fp.skillCommit}`);
  console.log(`  timeout per run  ${RUN_TIMEOUT_MS / 60000} min, max turns ${MAX_TURNS}`);
  console.log(`  gate             ${gate?.pass === true ? 'green' : 'NOT GREEN'}`);
  if (drift.length) console.log(`  DRIFT since probe: ${drift.map(([k]) => k).join(', ')}`);
  console.log('');
  process.exit(gate?.pass === true && drift.length === 0 ? 0 : 1);
}

/* ── run ───────────────────────────────────────────────────────────────── */

async function run([brief, arm, n], secretIn) {
  if (!brief || !['with', 'without'].includes(arm) || !n) die('usage: run <brief> <with|without> <n>');
  const gate = await readFile(GATE, 'utf8').then(JSON.parse, () => null);
  if (gate?.pass !== true) die('isolation not proven. Run `probe` first.');

  const fp = await fingerprint();
  const drift = Object.entries(fp).filter(([k, v]) => JSON.stringify(gate.fingerprint?.[k]) !== JSON.stringify(v));
  if (drift.length) die(`the environment changed since the probe: ${drift.map(([k]) => k).join(', ')}. Re-run probe.`);

  const secret = secretIn ?? (await readSecret('generation'));
  if (!secret) die('no key given');

  const runId = `${brief}-${arm}-${n}`;
  const ws = join(LAB, runId);
  const briefText = await readFile(join(BRIEFS, `${brief}.md`), 'utf8').catch(() => die(`no such brief: ${brief}`));
  await rm(ws, { recursive: true, force: true });
  await mkdir(join(ws, 'site'), { recursive: true });
  await writeFile(join(ws, 'BRIEF.md'), briefText);

  const cmd =
    `claude -p ${JSON.stringify(GENERATION_PROMPT)} --model ${MODEL} ` +
    `--output-format json --max-turns ${MAX_TURNS} > /work/agent.json 2>/work/agent.err; echo EXIT=$?`;

  const started = new Date().toISOString();
  const r = await runContainer(containerArgs({ workspace: ws, arm, name: `bench-${runId}` }), cmd, secret, RUN_TIMEOUT_MS);
  const finished = new Date().toISOString();

  const raw = await readFile(join(ws, 'agent.json'), 'utf8').catch(() => '');
  let j = null;
  try { j = JSON.parse(raw); } catch { /* handled below */ }
  const modelReturned = j?.modelUsage ? Object.keys(j.modelUsage)[0] : (j?.model ?? null);

  const manifest = {
    runId, brief, arm, run: Number(n),
    prompt: GENERATION_PROMPT, promptSha256: sha(GENERATION_PROMPT), briefSha256: sha(briefText),
    modelRequested: MODEL, modelReturned,
    sessionId: j?.session_id ?? null, usage: j?.usage ?? null, numTurns: j?.num_turns ?? null,
    settings: { outputFormat: 'json', maxTurns: MAX_TURNS, permissionMode: 'default', timeoutMs: RUN_TIMEOUT_MS },
    ...fp,
    isolationProbe: 'pass',
    started, finished, durationMs: Date.parse(finished) - Date.parse(started),
    containerExit: r.code,
    credential: 'read at run time, piped to container stdin; never stored, logged or in docker inspect',
  };
  await mkdir(join(RUNS, runId), { recursive: true });
  await writeFile(join(RUNS, runId, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

  // Fail fast: an unverifiable run is worse than a missing one.
  if (!modelReturned) die(`${runId}: the provider returned no model id. Run discarded.`);
  if (!modelReturned.startsWith(MODEL.split('-').slice(0, 3).join('-'))) {
    die(`${runId}: model mismatch. asked ${MODEL}, got ${modelReturned}. Run discarded.`);
  }
  console.log(`  ${runId}  ${modelReturned}  ${Math.round(manifest.durationMs / 1000)}s  turns ${manifest.numTurns ?? '?'}`);
}

/* ── unpaid self-test ──────────────────────────────────────────────────── */

async function selftest() {
  const checks = [];
  const ok = (n, v, d = '') => checks.push([v ? 'ok  ' : 'FAIL', n, d]);

  for (const f of ['Dockerfile', 'entrypoint.sh', 'probe.sh', 'egress-proxy.mjs', 'probe-prompt.txt']) {
    ok(`bench/${f} present`, await stat(join(BENCH, f)).then(() => true, () => false));
  }
  const ep = await readFile(join(BENCH, 'entrypoint.sh'), 'utf8');
  ok('secret arrives on stdin', /read -r -t \d+ _S/.test(ep));
  ok('secret never echoed', !/echo .*_S|printf .*_S/.test(ep));
  ok('telemetry disabled in entrypoint', /DISABLE_TELEMETRY=1/.test(ep));

  const proxy = await readFile(join(BENCH, 'egress-proxy.mjs'), 'utf8');
  ok('proxy matches exact host only', /ALLOW\.includes\(h\)/.test(proxy) && !/endsWith\('\.' \+ a\)/.test(proxy));

  const self = await readFile(fileURLToPath(import.meta.url), 'utf8');
  // Assert against the actual argument list rather than by grepping the source: a
  // pattern loose enough to catch the mistake was also loose enough to match the
  // line that stated it.
  const sample = containerArgs({ workspace: '/tmp/x', arm: 'with', name: 'selftest' });
  const envFlags = sample.filter((a, i) => sample[i - 1] === '-e');
  ok('no credential in docker args', !sample.some((a) => /API_KEY|TOKEN|SECRET|sk-ant/i.test(String(a))));
  ok('env flags carry no secret', envFlags.every((v) => /^(HTTPS?_PROXY|NO_PROXY|ENDPOINT|ARM)=/.test(v)), envFlags.join(' '));
  ok('workspace mounted, skill read-only', sample.includes('-v') && sample.some((a) => /skills[\\/]sitesmith:ro$/.test(String(a))));
  ok('allowlist is the endpoint only', /ALLOW=\$\{ENDPOINT\}/.test(self) || /`ALLOW=\$\{ENDPOINT\}`/.test(self));
  ok('model passed to the CLI', /--model \$\{MODEL\}/.test(self));
  ok('structured output requested', /--output-format json/.test(self));
  ok('run refuses without a green gate', /isolation not proven/.test(self));
  ok('run refuses on fingerprint drift', /the environment changed since the probe/.test(self));
  ok('run fails on model mismatch', /model mismatch/.test(self));

  const probeSh = await readFile(join(BENCH, 'probe.sh'), 'utf8');
  for (const c of ['workspace_write', 'host_path_win', 'direct_endpoint', 'proxy_github', 'proxy_subdomain',
                   'proxy_endpoint', 'home_no_history', 'env_no_sitesmith', 'skill_readonly']) {
    ok(`probe checks ${c}`, probeSh.includes(c));
  }
  ok('probe needs no credential', !/ANTHROPIC_API_KEY/.test(probeSh));

  const fp = await fingerprint();
  console.log('\n  unpaid self-test\n');
  for (const [s, n, d] of checks) console.log(`  ${s}  ${n}${d ? '  ' + d : ''}`);
  console.log(`\n  fingerprint (what a green probe will be bound to):`);
  for (const [k, v] of Object.entries(fp)) console.log(`    ${k.padEnd(22)} ${typeof v === 'string' ? v.slice(0, 64) : JSON.stringify(v)}`);
  const failed = checks.filter(([s]) => s.startsWith('FAIL')).length;
  console.log(`\n  ${failed === 0 ? 'PASS — runner is consistent; nothing was spent' : `FAIL — ${failed} problem(s)`}\n`);
  process.exit(failed === 0 ? 0 : 1);
}

const [cmd, ...rest] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const cmds = { selftest, build, up, down, probe, 'probe-model': probeModel, preflight, run };
if (!cmds[cmd]) die('usage: bench-container.mjs <selftest|build|up|probe|probe-model|preflight|run|down> ...');
await cmds[cmd](rest);
