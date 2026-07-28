#!/usr/bin/env node
/**
 * The production-ready gate. Original work, MIT.
 *
 *   node scripts/production-gate.mjs "dist/**\/*.html" --manifest ASSET-MANIFEST.md
 *   node scripts/production-gate.mjs "dist/**\/*.html" --manifest ASSET-MANIFEST.md --production
 *
 * Draft mode reports. Production mode exits non-zero.
 *
 * This is deliberately separate from verify.mjs. That script asks whether the page works —
 * contrast, focus, overflow, dead links. This one asks whether the page is finished, which
 * is a different question and one a page can fail while passing every technical check.
 *
 * The failure it exists to catch: a hatched box captioned "Photograph would sit here"
 * occupying half a first viewport, and an empty coloured square presented as a logo. Both
 * shipped in a set that passed every technical gate it had.
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

/* Placeholder language. Kept here, next to the code that uses it, so a documented list and
   an enforced list cannot drift apart. Matched against visible text and against comments. */
const PLACEHOLDER_TEXT = [
  /\bplaceholder\b/i,
  /\bwould (?:sit|go|appear) here\b/i,
  /\bimage (?:goes|to go) here\b/i,
  /\bphoto(?:graph)? (?:goes|to go|would)\b/i,
  /\bcoming soon\b/i,
  /\bto be (?:added|supplied|confirmed)\b/i,
  /\bTBC\b/,
  /\blorem ipsum\b/i,
  /\bdolor sit amet\b/i,
  /\bjohn doe\b/i, /\bjane doe\b/i,
  /\bacme (?:corp|inc|ltd)\b/i,
  /\byour (?:logo|company|text) here\b/i,
  /\bsample (?:text|image|content)\b/i,
  /\bdummy (?:text|content|data)\b/i,
  /\bnot included in this\b/i,
  /\bis not real\b/i,
  /\bexample\.com\b/i,
  /\bunlock your potential\b/i,
];

/* What a visitor actually reads. Three things are deliberately excluded:
   an input's placeholder attribute, which is a real UI affordance; the contents of <style>
   and <script>, where "an honest render placeholder, labelled as such" is a code comment
   about the page rather than text on it; and HTML comments, for the same reason. */
const visibleText = (html) => html
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<(style|script)\b[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<[^>]*>/g, ' ');

/* Markup only. Two things are removed before any element check runs, and both were found by
   the gate reporting them as defects when they were not:

   — Comments. A page whose comment explains why it does *not* use `<img src>` was reported
     for shipping two images with no manifest id. Both of them were sentences.
   — Script bodies. A page that builds its rows from a template literal containing
     `data-asset="${L.asset}"` was reported for an asset literally named `${L.asset}`.

   Removing script bodies means a statically-scanned page is only checked on the markup it
   ships. That is a real blind spot for a page that renders its content with JavaScript, and
   the answer is not to guess: pass a URL instead of a directory and the gate reads the
   rendered DOM, where those rows exist as elements. */
const markup = (html) => html
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ');

const args = process.argv.slice(2);
const production = args.includes('--production');
const manifestIdx = args.indexOf('--manifest');
const manifestPath = manifestIdx >= 0 ? args[manifestIdx + 1] : 'ASSET-MANIFEST.md';
// The manifest's own path looks like a positional argument. Left in, the gate scans the
// manifest as though it were a page and reports it for having no favicon.
const patterns = args.filter((a, i) => !a.startsWith('--') && i !== manifestIdx + 1);

if (!patterns.length) {
  console.error('usage: production-gate.mjs "<html glob or directory>" [--manifest ASSET-MANIFEST.md] [--production]');
  process.exit(2);
}

/* ── a small glob, so this has no dependencies ─────────────────────────── */

async function walk(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) await walk(full, out);
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

async function resolveFiles(pattern) {
  const bare = pattern.replace(/[/\\]?\*\*.*$/, '').replace(/[/\\]?\*.*$/, '') || '.';
  const s = await stat(bare).catch(() => null);
  if (s?.isDirectory()) return walk(bare);
  if (s?.isFile()) return [bare];
  return [];
}

/* ── the manifest ──────────────────────────────────────────────────────── */

function parseManifest(md) {
  const rows = [];
  for (const line of md.split('\n')) {
    if (!line.trim().startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 6) continue;
    if (/^-+$/.test(cells[0].replace(/[: ]/g, '-'))) continue;
    if (/^id$/i.test(cells[0])) continue;
    const state = (cells[5] ?? '').replace(/\*/g, '').toLowerCase();
    if (!['ready', 'needed', 'substitute'].includes(state)) continue;
    rows.push({ id: cells[0].replace(/`/g, ''), what: cells[1], where: cells[2],
                source: cells[3], licence: cells[4], state, focal: cells[6] ?? '', treatment: cells[7] ?? '' });
  }
  return rows;
}

/* ── checks ────────────────────────────────────────────────────────────── */

const findings = [];
const add = (severity, file, what, detail) => findings.push({ severity, file, what, detail });

function checkPlaceholders(file, html) {
  const text = visibleText(html);
  for (const re of PLACEHOLDER_TEXT) {
    const m = text.match(re);
    if (m) {
      const at = text.indexOf(m[0]);
      add('block', file, 'placeholder language in visible text',
        `"${text.slice(Math.max(0, at - 40), at + m[0].length + 40).replace(/\s+/g, ' ').trim()}"`);
    }
  }
}

function checkEmptyBrandMark(file, html) {
  // An element inside a header/brand link with no text and no child image is a coloured box
  // standing in for an identity. Three legacy pages shipped exactly this.
  const brandBlocks = markup(html).match(/<a[^>]*class="[^"]*\b(logo|mark|brand)\b[^"]*"[\s\S]{0,400}?<\/a>/gi) ?? [];
  for (const block of brandBlocks) {
    const empties = block.match(/<(i|span|div|b)\b[^>]*>\s*<\/\1>/gi) ?? [];
    if (empties.length) {
      add('block', file, 'an empty element is standing in for the brand mark',
        empties[0].replace(/\s+/g, ' '));
    }
  }
}

function checkFavicon(file, html) {
  // Attribute-aware: an inline SVG data URI contains `>` characters, so [^>]* truncates the
  // tag halfway through the href and the icon never gets inspected.
  const tags = markup(html).match(/<link\b(?:"[^"]*"|'[^']*'|[^>"'])*>/gi) ?? [];
  const links = tags.filter((t) => /\brel\s*=\s*["'][^"']*icon/i.test(t));
  if (!links.length) { add('block', file, 'no favicon declared', ''); return; }
  for (const l of links) {
    // The generic app-icon construction: one filled rect, one or two strokes, nothing else.
    if (/data:image\/svg\+xml/i.test(l)) {
      const rects = (l.match(/<rect/gi) ?? []).length;
      const paths = (l.match(/<(path|circle|line|polyline|polygon|text)/gi) ?? []).length;
      if (rects === 1 && paths <= 1) {
        add('warn', file, 'the favicon is a filled rectangle with at most one stroke',
          'the generic app-icon construction; see v2/25-assets.md');
      }
    }
  }
}

function checkImages(file, html, manifest) {
  const src = markup(html);
  // Both kinds count. Checking only <img> left a whole category unmanifested, which is
  // exactly what happens when drawings are inlined so that currentColor works — and
  // inlining is the correct technique, so the gate has to follow it.
  const imgs = src.match(/<img\b[^>]*>/gi) ?? [];
  const svgs = (src.match(/<svg\b[^>]*>/gi) ?? [])
    .filter((t) => !/aria-hidden\s*=\s*["']true["']/i.test(t));
  const assets = [...imgs, ...svgs];
  for (const el of assets) {
    const kind = el.startsWith('<img') ? 'an image' : 'an inline svg';
    const id = (el.match(/data-asset=["']([^"']+)["']/) ?? [])[1];
    if (!id) {
      add('block', file, `${kind} with no data-asset id`, el.replace(/\s+/g, ' ').slice(0, 110));
      continue;
    }
    const row = manifest.find((r) => r.id === id);
    if (!row) add('block', file, `asset "${id}" is not in the manifest`, '');
    else if (row.state !== 'ready') add('block', file, `asset "${id}" is ${row.state}`, row.what);
  }
  return assets.length;
}

/* ── run ───────────────────────────────────────────────────────────────── */

/* A URL is checked against the rendered DOM, which is the only way to see a page whose rows
   are built by script. A path is checked against the file as shipped. */
const urls = patterns.filter((p) => /^https?:\/\//.test(p));
const paths = patterns.filter((p) => !/^https?:\/\//.test(p));

const sources = [];   // { label, html }
for (const f of (await Promise.all(paths.map(resolveFiles))).flat()) {
  sources.push({ label: relative(process.cwd(), f).split(sep).join('/'), html: await readFile(f, 'utf8') });
}
if (urls.length) {
  const { createRequire } = await import('node:module');
  const { pathToFileURL } = await import('node:url');
  const requireFromCwd = createRequire(join(process.cwd(), 'package.json'));
  let chromium;
  try {
    const pw = await import('playwright').catch(
      () => import(pathToFileURL(requireFromCwd.resolve('playwright')).href));
    chromium = pw.chromium ?? pw.default?.chromium;
  } catch {
    console.error('a URL was given but playwright is not installed, so the rendered DOM cannot be read');
    process.exit(2);
  }
  const browser = await chromium.launch();
  for (const u of urls) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(u, { waitUntil: 'networkidle' });
    sources.push({ label: u, html: await page.content(), rendered: true });
    await page.close();
  }
  await browser.close();
}

const files = sources.map((s) => s.label);
if (!sources.length) { console.error(`no HTML found for ${patterns.join(' ')}`); process.exit(2); }

const manifestRaw = await readFile(manifestPath, 'utf8').catch(() => null);
if (manifestRaw === null) {
  add('block', manifestPath, 'no asset manifest', 'every project needs one; see v2/25-assets.md');
}
const manifest = manifestRaw ? parseManifest(manifestRaw) : [];

if (manifestRaw && !manifest.length) {
  add('block', manifestPath, 'the manifest has no readable rows',
    'expected a table with id | what | where | source | licence | state | focal | treatment');
}
for (const row of manifest) {
  if (row.state !== 'ready') add('block', manifestPath, `asset "${row.id}" is ${row.state}`, row.what);
  if (!row.licence) add('block', manifestPath, `asset "${row.id}" has no licence`, '');
}
if (manifest.length && !manifest.some((r) => /logo/i.test(r.id))) {
  add('block', manifestPath, 'no logo row in the manifest', 'a mark is an asset, not a detail');
}

let totalImages = 0;
for (const { label, html } of sources) {
  checkPlaceholders(label, html);
  checkEmptyBrandMark(label, html);
  checkFavicon(label, html);
  totalImages += checkImages(label, html, manifest);
}

/* Journeys: a site with none has not been tested for behaviour. */
const journeys = await readdir('journeys').catch(() => null);
const specs = (journeys ?? []).filter((n) => n.endsWith('.spec.mjs'));
if (!specs.length) {
  add('block', 'journeys/', 'no interaction journey exists',
    'at least one per surface; see v2/40-interaction.md');
}

/* ── report ────────────────────────────────────────────────────────────── */

const blocks = findings.filter((f) => f.severity === 'block');
const warns = findings.filter((f) => f.severity === 'warn');

console.log(`\n  production gate — ${files.length} page(s), ${manifest.length} manifest row(s), ` +
  `${totalImages} image(s), ${specs.length} journey(s)\n`);

for (const f of [...blocks, ...warns]) {
  console.log(`  ${f.severity === 'block' ? 'BLOCK' : 'warn '}  ${f.file}`);
  console.log(`         ${f.what}${f.detail ? '\n         ' + f.detail : ''}`);
}
if (!findings.length) console.log('  nothing found\n');

if (production) {
  console.log(`\n  ${blocks.length ? `NOT PRODUCTION-READY — ${blocks.length} blocking finding(s)` : 'production-ready'}\n`);
  process.exit(blocks.length ? 1 : 0);
}
console.log(`\n  draft mode: ${blocks.length} finding(s) would block production. Re-run with --production to enforce.\n`);
process.exit(0);
