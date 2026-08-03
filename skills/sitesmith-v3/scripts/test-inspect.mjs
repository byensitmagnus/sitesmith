#!/usr/bin/env node
// The test of the inspection pass.
//
// inspect.mjs is not a gate: it never refuses, so it cannot be tested by pinning an exit
// code to a defect. What it can get wrong is quieter and worse. It can miss a route and
// report the site as smaller than it is. It can find a form and not say so. It can hand a
// redesign a token list that never mentions the colours the client owns. And it can report
// a measurement it never took as a zero, which is the one failure that looks like good
// news.
//
// So every case below fixes what the run must find, by count, before the run happens. The
// last case is the load-bearing one: a route the server refuses to answer must come back as
// "did not run", never as a route with nothing on it.
//
//   node skills/sitesmith-v3/scripts/test-inspect.mjs
//
// inspect.mjs resolves playwright the way verify.mjs does, so this runner spawns it from
// wherever the pinned devDependencies are installed. Point SITESMITH_DEPS_DIR at that
// directory if it is not the repository root. If they are absent no verdict is available
// and this runner says so and exits 2 rather than reporting cases it never ran.

import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { readFile, mkdtemp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize, sep } from 'node:path';
import { tmpdir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..', '..');
const script = join(here, 'inspect.mjs');
const depsDir = process.env.SITESMITH_DEPS_DIR ? normalize(process.env.SITESMITH_DEPS_DIR) : root;

try {
  createRequire(join(depsDir, 'package.json')).resolve('playwright');
} catch {
  console.error(`verdict withheld: playwright is not resolvable from ${depsDir}`);
  console.error('  install the pinned set from skills/sitesmith/scripts/package.json,');
  console.error('  or set SITESMITH_DEPS_DIR to the directory that has them.');
  process.exit(2);
}

const FIX_DIR = join(root, 'docs', 'rebuild', 's10', 'fixtures', 'scripts', 'inspect');
const FIX_PATH = '/docs/rebuild/s10/fixtures/scripts/inspect/';

/** A static server over the repository, with one path that answers nothing at all. */
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.json': 'application/json; charset=utf-8',
};
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  // The unanswerable route. Not a 404, which is a page: the socket dies mid-request, so the
  // navigation throws and nothing about that route can be measured. This is the fixture for
  // the fail-closed rule.
  if (path === '/drop/' || path.startsWith('/drop/')) {
    req.socket.destroy();
    return;
  }
  try {
    let file = join(root, path);
    if (path.endsWith('/')) file = join(file, 'index.html');
    if (!normalize(file).startsWith(root + sep)) {
      res.writeHead(403).end('outside the repository');
      return;
    }
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' }).end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' }).end('<!doctype html><title>404</title>not found');
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const base = `http://127.0.0.1:${port}`;

const outRoot = await mkdtemp(join(tmpdir(), 'sitesmith-inspect-test-'));

/** Reads the two artefacts. A case that cannot read them has already failed. */
async function artefacts(out) {
  const json = JSON.parse(await readFile(join(out, 'inspection.json'), 'utf8'));
  const audit = await readFile(join(out, 'AUDIT.md'), 'utf8');
  return { json, audit, out };
}

const CASES = [
  {
    name: 'finds both routes, the tokens, the form and the table',
    args: [`${base}${FIX_PATH}`],
    expect: 0,
    why: 'the whole point of the pass: a site it under-reads hands a redesign a smaller site than the one that exists',
    async check({ json, audit, out }) {
      const bad = [];
      const routes = json.routes.map((r) => r.route);

      // 1. routes
      if (routes.length < 2) bad.push(`expected at least 2 routes, got ${routes.length}: ${routes.join(', ')}`);
      if (!routes.some((r) => r.endsWith('/inspect/'))) bad.push(`entry route missing from ${routes.join(', ')}`);
      if (!routes.some((r) => r.endsWith('/pricing.html'))) bad.push(`the nav link to pricing.html was not followed: ${routes.join(', ')}`);

      // 2. screenshots at the three fixed breakpoints, and a hash for each
      for (const r of json.routes) {
        for (const w of [375, 768, 1440]) {
          if (!r.widths[w]) bad.push(`${r.route} was not rendered at ${w}px`);
          else if (!existsSync(join(out, r.widths[w].screenshot))) bad.push(`${r.widths[w].screenshot} is in the report and not on disk`);
        }
      }
      if (json.baseline.images.length !== json.routes.length * 3) {
        bad.push(`expected ${json.routes.length * 3} baseline images, manifest has ${json.baseline.images.length}`);
      }
      if (json.baseline.images.some((i) => !/^[0-9a-f]{64}$/.test(i.sha256))) bad.push('a baseline image has no sha256');
      if (!existsSync(join(out, 'baseline', 'manifest.json'))) bad.push('baseline/manifest.json was not written');

      // 3. components and the six states
      const entry = json.routes.find((r) => r.route.endsWith('/inspect/'));
      const c = entry?.components?.['1440'];
      if (!c) bad.push('no component map at 1440px on the entry route');
      else {
        if (!c.navigation.length) bad.push('the nav element was not found');
        if (!c.footers.length) bad.push('the footer was not found');
        if (!c.forms.length) bad.push('the form was not found');
        else if (c.forms[0].fieldCount < 4) bad.push(`the form has 4 visible fields, inspect reported ${c.forms[0].fieldCount}`);
        if (!c.tables.length) bad.push('the table was not found');
        else {
          if (!c.tables[0].caption) bad.push('the table caption was not read');
          if (c.tables[0].columns < 3) bad.push(`the table has 4 columns, inspect reported ${c.tables[0].columns}`);
          if (c.tables[0].headerCells < 3) bad.push(`the table has 4 th cells, inspect reported ${c.tables[0].headerCells}`);
        }
        if (!c.cardGroups.length) bad.push('the repeated card group was not found');
        if (c.firstScreen.headings.length === 0) bad.push('the first screen at 1440px has an h1 and inspect found no heading in it');
      }
      const st = entry?.states;
      if (!st) bad.push('no state map on the entry route');
      else {
        for (const s of ['rest', 'hover', 'focus-visible', 'active', 'disabled', 'loading']) {
          if (!st.counts[s]) bad.push(`the fixture declares a ${s} state and inspect found evidence on 0 controls`);
        }
        if (!st.elements.some((e) => e.states.hover === 'driven')) bad.push('no hover was actually driven; every hover verdict is declaration only');
      }

      // 4. tokens. The brief asks for at least three; the fixture declares six custom
      // properties and two breakpoints, so anything less is a read that missed something.
      const props = json.preserve?.customProperties ?? [];
      if (props.length < 3) bad.push(`expected at least 3 design tokens, got ${props.length}`);
      for (const name of ['--paper', '--ink', '--accent']) {
        if (!props.some((p) => p.name === name)) bad.push(`custom property ${name} is declared in the fixture and missing from the report`);
      }
      if (!props.every((p) => p.computedValue)) bad.push('a custom property was listed with no computed value');
      const bps = entry?.css?.breakpoints ?? [];
      if (bps.length < 2) bad.push(`the fixture declares 2 min-width media queries, inspect found ${bps.length}`);
      const tokens = json.preserve?.siteTokens;
      if (!tokens || tokens.colours.length < 3) bad.push(`expected at least 3 measured colours, got ${tokens?.colours.length ?? 0}`);
      if (!tokens || tokens.typography.families.length < 2) bad.push('the fixture uses a serif and a sans, and inspect found fewer than 2 families');

      // 5. brand assets
      if (!json.preserve?.brandMark) bad.push('the brand mark was not identified');
      else if (!/logo\.svg/.test(json.preserve.brandMark.src ?? '')) bad.push(`the brand mark resolved to ${json.preserve.brandMark.src}, not logo.svg`);
      const imgs = entry?.assets?.images ?? [];
      if (!imgs.some((i) => /field\.svg/.test(i.declaredSrc))) bad.push('the content image was not inventoried');
      if (!imgs.every((i) => i.alt !== null)) bad.push('an image was inventoried without reading its alt attribute');

      // 6. the audit artefact says what it measured
      for (const heading of ['## Stack and routes', '## Screens captured', '## Components and states', '## Design tokens', '## Brand assets', '## What has to survive a redesign', '## Findings', '## Not measured']) {
        if (!audit.includes(heading)) bad.push(`AUDIT.md has no ${heading} section`);
      }
      if (!audit.includes('--accent')) bad.push('AUDIT.md never names a token it found');
      return bad;
    },
  },

  {
    name: 'a route that cannot be loaded is reported as not measured, never as zero',
    args: [`${base}${FIX_PATH}`, '--routes', `${FIX_PATH},/drop/`],
    expect: 0,
    why: 'the fail-closed rule. A route record full of zeros reads as "inspected, nothing there", which is the most expensive lie this script could tell a redesign',
    async check({ json, audit }) {
      const bad = [];
      if (!json.routeDiscovery.inspected.includes('/drop/')) bad.push('/drop/ was asked for and never attempted');
      if (json.routes.some((r) => r.route === '/drop/')) bad.push('/drop/ produced a route record, so an unmeasurable route was reported as measured');
      const notes = json.notMeasured.filter((n) => n.check.includes('/drop/'));
      if (!notes.length) bad.push('/drop/ is missing from notMeasured entirely');
      if (!notes.some((n) => n.check === 'route /drop/')) bad.push('the route itself was never withheld, only its individual viewports');
      if (!json.baseline.images.some((i) => i.route.endsWith('/inspect/'))) bad.push('the route that did load produced no baseline');
      if (json.baseline.images.some((i) => i.route === '/drop/')) bad.push('a baseline image was recorded for a route that never rendered');
      if (!audit.includes('## Not measured')) bad.push('AUDIT.md has no Not measured section');
      if (!/\*\*route \/drop\/\*\* did not run/.test(audit)) bad.push('AUDIT.md never says the route did not run');
      return bad;
    },
  },

  {
    name: 'a local directory: stack.mjs names the stack and the file listing names the routes',
    args: [FIX_DIR],
    expect: 0,
    why: 'the local half of the pass. Detection stays in stack.mjs; inspect only has to serve the folder and report what stack.mjs said',
    async check({ json }) {
      const bad = [];
      if (json.kind !== 'directory') bad.push(`expected kind "directory", got ${json.kind}`);
      if (json.stack?.detected !== 'static') bad.push(`expected stack "static" from stack.mjs, got ${JSON.stringify(json.stack)}`);
      const routes = json.routes.map((r) => r.route).sort();
      if (routes.join(',') !== '/,/pricing.html') bad.push(`expected / and /pricing.html, got ${routes.join(', ') || 'nothing'}`);
      if (!(json.diskHtmlFiles ?? []).includes('pricing.html')) bad.push('the file listing did not find pricing.html');
      if (!json.routes.every((r) => Object.keys(r.widths).length === 3)) bad.push('a route was not rendered at all three breakpoints');
      return bad;
    },
  },

  {
    name: 'could not run, no target',
    args: [],
    expect: 2,
    why: 'bad arguments are a setup problem and must never read as an inspected site',
    expectOutput: ['usage: node inspect.mjs'],
  },
];

function run(args, out) {
  return new Promise((done) => {
    const child = spawn(process.execPath, [script, ...args, '--out', out], { cwd: depsDir });
    let text = '';
    child.stdout.on('data', (d) => (text += d));
    child.stderr.on('data', (d) => (text += d));
    const kill = setTimeout(() => child.kill('SIGKILL'), 300000);
    child.on('close', (status) => {
      clearTimeout(kill);
      done({ status, text });
    });
  });
}

let failed = 0;
for (const [i, c] of CASES.entries()) {
  const out = join(outRoot, String(i));
  const r = await run(c.args, out);
  const problems = [];
  if (r.status !== c.expect) problems.push(`exit ${r.status}, expected ${c.expect}`);
  for (const s of c.expectOutput ?? []) if (!r.text.includes(s)) problems.push(`output never said: ${s}`);
  if (c.check && r.status === c.expect) {
    try {
      problems.push(...(await c.check(await artefacts(out))));
    } catch (e) {
      problems.push(`artefacts unreadable: ${String(e).split('\n')[0]}`);
    }
  }
  if (problems.length) failed++;
  console.log(`${problems.length ? '  FAIL' : '  ok  '} ${c.name}  (${c.why})`);
  for (const p of problems) console.log(`        ${p}`);
  if (problems.length && r.status !== c.expect) console.log(r.text.split('\n').slice(-25).join('\n'));
}

server.close();
console.log(failed ? `\n${failed} case(s) failed` : '\nall clear');
process.exit(failed ? 1 : 0);
