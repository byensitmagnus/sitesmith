#!/usr/bin/env node
// The test of the render gate.
//
// A gate that cannot fail is decoration, and a gate that cannot pass is noise. verify.mjs
// is the strongest asset in this package and it is also the easiest to quietly soften:
// one relaxed threshold and it keeps printing PASS on pages it used to catch. So every
// case below fixes its expected exit code in advance, and this runner exits non-zero the
// moment one of them disagrees.
//
// The control group is the load-bearing case. benchmarks/06-redesign/before/ is the
// deliberately generic page the whole package exists to catch. If it ever exits 0 the
// gate has been broken, not improved.
//
//   node skills/sitesmith-v3/scripts/test-verify.mjs
//
// verify.mjs resolves playwright from its working directory, so this runner spawns it
// from wherever the pinned devDependencies of skills/sitesmith/scripts/package.json are
// installed. Point SITESMITH_DEPS_DIR at that directory if it is not the repository root.
// If they are absent, no verdict is available and this runner says so and exits 2 rather
// than reporting cases it never ran.

import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { readFile, mkdtemp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize, sep } from 'node:path';
import { tmpdir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..', '..');
const script = join(here, 'verify.mjs');
const depsDir = process.env.SITESMITH_DEPS_DIR ? normalize(process.env.SITESMITH_DEPS_DIR) : root;

// Withhold, never assume. A missing browser dependency is not a failing gate and it is
// certainly not a passing one, so it gets its own exit code and its own sentence.
try {
  createRequire(join(depsDir, 'package.json')).resolve('playwright');
} catch {
  console.error(`verdict withheld: playwright is not resolvable from ${depsDir}`);
  console.error('  install the pinned set from skills/sitesmith/scripts/package.json,');
  console.error('  or set SITESMITH_DEPS_DIR to the directory that has them.');
  process.exit(2);
}

/** A static server over the repository, so fixtures and the control group share an origin. */
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.gif': 'image/gif', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = join(root, path);
    if (path.endsWith('/')) file = join(file, 'index.html');
    // Refuse to serve outside the repository. The fixtures reference relative paths only,
    // so anything climbing out is a bug in a case, not a page under test.
    if (!normalize(file).startsWith(root + sep)) {
      res.writeHead(403).end('outside the repository');
      return;
    }
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' }).end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/html' }).end('<!doctype html><title>404</title>not found');
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const base = `http://127.0.0.1:${port}`;

/** A port nothing is listening on, for the case that must report "could not run". */
const deadPort = await new Promise((r) => {
  const s = createServer();
  s.listen(0, '127.0.0.1', () => {
    const p = s.address().port;
    s.close(() => r(p));
  });
});

const shots = await mkdtemp(join(tmpdir(), 'sitesmith-verify-test-'));
const FIX = '/docs/rebuild/s10/fixtures/scripts/verify';

const CASES = [
  {
    name: 'must pass',
    args: [`${base}${FIX}/pass/`],
    expect: 0,
    why: 'a page that clears every check the gate makes; if this fails the gate has become noise',
    expectOutput: ['PASS, nothing blocking'],
  },
  {
    name: 'must pass, measurements never become verdicts',
    args: [`${base}${FIX}/measured-not-judged/`],
    expect: 0,
    why: 'four radii, three families, a wrapped label, duplicate intents, small targets and a suppressed focus ring are all reported and none of them may move the exit code',
    expectOutput: [
      'control label wraps onto',
      'controls, same label',
      'same target, different labels',
      '4 distinct corner radii',
      '3 distinct type families',
      'under the 44px floor',
      'under the 24px floor',
      'no visible focus indicator',
      'PASS, nothing blocking',
    ],
  },
  {
    name: 'must keep failing, motion survives the preference',
    args: [`${base}${FIX}/fail-motion/`],
    expect: 1,
    why: 'identical to the passing fixture except that the animation keeps running and the clip is fetched anyway',
    expectOutput: [
      'motion payload requested under reduced motion',
      'animation still running under reduced motion',
      'transition over 100ms under reduced motion',
    ],
  },
  {
    name: 'must keep failing, the control group',
    args: [`${base}/benchmarks/06-redesign/before/`],
    expect: 1,
    why: 'the deliberately generic page this package exists to catch; a green here means the gate was broken',
    expectOutput: ['FAIL,'],
  },
  {
    name: 'could not run, no url',
    args: [],
    expect: 2,
    why: 'bad arguments are a setup problem and must never read as a clean page',
  },
  {
    name: 'could not run, nothing listening',
    args: [`http://127.0.0.1:${deadPort}/`],
    expect: 2,
    why: 'an unreachable server is not a passing page and not a failing one',
  },
];

// spawn, not spawnSync: the fixture server lives in this process, and a synchronous child
// blocks the event loop that would answer its requests. The first version of this runner
// did exactly that and reported every page as unreachable.
function run(args, out) {
  return new Promise((done) => {
    const child = spawn(process.execPath, [script, ...args, '--out', out], { cwd: depsDir });
    let text = '';
    child.stdout.on('data', (d) => (text += d));
    child.stderr.on('data', (d) => (text += d));
    const kill = setTimeout(() => child.kill('SIGKILL'), 180000);
    child.on('close', (status) => {
      clearTimeout(kill);
      done({ status, text });
    });
  });
}

let failed = 0;
for (const [i, c] of CASES.entries()) {
  const out = join(shots, String(i));
  const r = await run(c.args, out);
  const text = r.text;
  const missing = (c.expectOutput ?? []).filter((s) => !text.includes(s));
  const ok = r.status === c.expect && missing.length === 0;
  if (!ok) failed++;
  console.log(`${ok ? '  ok  ' : '  FAIL'} ${c.name} -> exit ${r.status}, expected ${c.expect}  (${c.why})`);
  if (missing.length) console.log(`        output never said: ${missing.join(' | ')}`);
  if (!ok && r.status !== c.expect) console.log(text.split('\n').slice(-30).join('\n'));
}

server.close();
console.log(failed ? `\n${failed} case(s) failed` : '\nall clear');
process.exit(failed ? 1 : 0);
