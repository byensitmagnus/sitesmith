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
  /\bunlock your potential\b/i,
];

/* Reserved and example identifiers. A page carrying one of these is not finished, whatever
   else is true of it: the address, the number or the domain is a stand-in that survived. */
const DUMMY_IDENTIFIERS = [
  [/\bexample\.(com|org|net)\b/i, 'a reserved example domain'],
  [/\b(your|company|yourdomain)\.(com|co\.uk)\b/i, 'a stand-in domain'],
  [/\b[\w.+-]+@(example|test|domain|email|yourcompany)\.[a-z.]{2,}/i, 'a stand-in email address'],
  [/\b555[-\s]?\d{3}[-\s]?\d{4}\b/, 'a North American 555 fictional telephone number'],
  [/\b123 (Main|High) (St|Street|Road)\b/i, 'a stand-in street address'],
  [/\b(01234|12345)\s?567\s?89\d\b/, 'a stand-in telephone number'],
  [/\b\+1 \(555\)/, 'a 555 telephone number'],
  [/\bAnytown\b/i, 'a stand-in place name'],
];

/* Mode M and E cannot ship without something to look at. Mode P usually should not have one.
   The gate only enforces the first half: a marketing or commerce page whose only asset is
   its own logo has no visual argument, which is the legacy set's central failure. */
const MODES = { M: 'marketing', E: 'e-commerce', P: 'product UI' };

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
const modeIdx = args.indexOf('--mode');
const mode = modeIdx >= 0 ? String(args[modeIdx + 1] ?? '').toUpperCase() : null;
if (mode && !MODES[mode]) { console.error(`--mode must be one of ${Object.keys(MODES).join(', ')}`); process.exit(2); }
// A flag's value looks like a positional argument. Left in, the gate scans the manifest as
// though it were a page and reports it for having no favicon. The `idx < 0` guards matter:
// indexOf returns -1 when the flag is absent, so an unguarded `i !== idx + 1` silently
// swallows argument 0 — which is the only positional argument in the common case.
const evIdx = args.indexOf('--evidence');
const isFlagValue = (i) => (manifestIdx >= 0 && i === manifestIdx + 1) ||
  (modeIdx >= 0 && i === modeIdx + 1) || (evIdx >= 0 && i === evIdx + 1);
const patterns = args.filter((a, i) => !a.startsWith('--') && !isFlagValue(i));

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

function checkDummyIdentifiers(file, html) {
  const text = visibleText(html);
  for (const [re, what] of DUMMY_IDENTIFIERS) {
    const m = text.match(re);
    if (m) {
      add('block', file, `${what} is still on the page`,
        `"${text.slice(Math.max(0, text.indexOf(m[0]) - 40), text.indexOf(m[0]) + m[0].length + 40).replace(/\s+/g, ' ').trim()}"`);
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

/* Other people's marks: customer logos, partner logos, certification badges.
   The strongest proof a page can carry and the easiest to fabricate, so it is permitted only
   where the evidence pack names who lent it. Absent that, the page does not have a logo wall
   — which is usually a better page, because it has to make its case some other way. */
function checkBorrowedMarks(file, html, evidence, manifest) {
  const m = markup(html);
  const walls = m.match(
    /<[^>]*class="[^"]*\b(client|customer|partner|logo-?wall|logos|accreditation|certification|badges)\b[^"]*"[\s\S]{0,2000}?<\/(section|div|ul)>/gi) ?? [];
  if (!walls.length) return;

  for (const wall of walls) {
    /* Who is claimed. An alt or an aria-label on each borrowed mark is the only place a name
       lives once the image is a logo rather than a word. */
    const names = [...wall.matchAll(/(?:alt|aria-label|title)=["']([^"']{2,80})["']/gi)]
      .map((x) => x[1].trim())
      .filter((n) => !/^(logo|client logo|partner logo|customer logo|badge|icon)$/i.test(n));

    if (!names.length) {
      add('block', file, 'a row of borrowed marks that names nobody',
        'each customer, partner or certification mark states whose it is, or it is not evidence');
      continue;
    }
    if (evidence === null) {
      add('block', file, `borrowed marks with no evidence pack: ${names.slice(0, 4).join(', ')}`,
        'a logo wall is permitted only where EVIDENCE.md names who lent each mark');
      continue;
    }
    for (const name of names) {
      /* Match on the distinctive words of the name, so "Ashby & Rowe Ltd" still matches
         an evidence line that writes "Ashby and Rowe". */
      const words = name.split(/[^\p{L}\p{N}]+/u).filter((w) => w.length > 3);
      const found = words.length
        ? words.some((w) => new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(evidence))
        : new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(evidence);
      if (!found) {
        add('block', file, `"${name}" appears as a borrowed mark and is nowhere in EVIDENCE.md`,
          'never an invented endorsement; see v2/24-asset-plan.md');
      }
    }
  }

  /* And no stand-ins, at any state. A substitute customer logo is a fabricated endorsement
     whatever the manifest row calls it, so this one is not covered by the general state rule. */
  for (const row of manifest) {
    if (!/\b(client|customer|partner|certification|accreditation|badge)\b/i.test(row.id)) continue;
    if (row.state === 'substitute' || row.state === 'needed') {
      add('block', file, `"${row.id}" is ${row.state}`,
        'there is no stand-in for someone else\'s endorsement');
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

/* An inline SVG data URI is markup inside an attribute value. Scanning for elements without
   removing it counts the favicon as an unmanifested asset on the page, which it is not — the
   favicon has its own check. */
const stripDataUris = (s) => s
  .replace(/(href|src|content)\s*=\s*"data:[^"]*"/gi, '$1="data:"')
  .replace(/(href|src|content)\s*=\s*'data:[^']*'/gi, "$1='data:'");

function assetElements(html) {
  const src = stripDataUris(markup(html));
  return [
    ...(src.match(/<img\b[^>]*>/gi) ?? []),
    ...(src.match(/<svg\b[^>]*>/gi) ?? []).filter((t) => !/aria-hidden\s*=\s*["']true["']/i.test(t)),
  ];
}


/* Commerce claims that must be traceable. A shop may only state a figure it can point at:
   an invented price, review count, delivery promise, stock level, warranty or certification
   is the one failure mode that turns a design exercise into a false statement about a real
   business. Mode E's prose already forbids it; nothing mechanical checked it until now.

   Each entry is [pattern, what it is]. A match is only a finding when the same claim cannot
   be found in EVIDENCE.md, or carried on the element as data-source. */
const COMMERCE_CLAIMS = [
  [/[£$€]\s?\d[\d,.]*/g, 'a price'],
  [/\b\d[\d,]*\s*(?:\+\s*)?(?:reviews?|ratings?|customers?|clients?)\b/gi, 'a review or customer count'],
  [/\b\d(?:\.\d)?\s*(?:out of|\/)\s*5\b/gi, 'a star rating'],
  [/\b(?:next[- ]day|same[- ]day|24[- ]hour|free)\s+(?:delivery|shipping|dispatch)\b/gi, 'a delivery promise'],
  [/\bships?\s+(?:today|tomorrow|within\s+\d+)/gi, 'a dispatch promise'],
  [/\b\d+\s+(?:left|remaining|in stock)\b/gi, 'a stock figure'],
  [/\b(?:\d+[- ]year|lifetime)\s+(?:guarantee|warranty)\b/gi, 'a warranty'],
  [/\b(?:ISO|BS EN|EN)\s?\d{3,}[\d:-]*/g, 'a standard or certification'],
  [/\b(?:CE|UKCA)[- ]marked\b/gi, 'a conformity mark'],
  [/\bcertified\s+(?:to|by|under)\s+\S+/gi, 'a certification'],
];

/** Is this claim traceable? Either the evidence pack contains the same string, or the element
 *  carries a data-source attribute naming where it came from. */
function claimIsSourced(claim, evidence, html) {
  if (evidence && evidence.includes(claim)) return true;
  const normalised = claim.replace(/[\s,]/g, '');
  if (evidence && evidence.replace(/[\s,]/g, '').includes(normalised)) return true;
  /* The escape hatch: a figure that is arithmetic rather than a published price may carry a
     `data-source` saying so. The replacement string here had been clobbered with a stray
     function signature, so every escaped character expanded to that text and the pattern could
     never match — the hatch was documented and did not exist. */
  const near = new RegExp('data-source=["\'][^"\']*["\'][^>]*>[^<]*' +
    claim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  return near.test(html);
}

function checkCommerceClaims(file, html, evidence) {
  if (mode !== 'E') return;
  const text = visibleText(html);
  const seen = new Set();
  for (const [re, what] of COMMERCE_CLAIMS) {
    for (const m of text.matchAll(re)) {
      const claim = m[0].trim().replace(/[.,;:]+$/, '');
      if (seen.has(claim)) continue;
      seen.add(claim);
      if (claimIsSourced(claim, evidence, html)) continue;
      add('block', file, `${what} with no source: "${claim}"`,
        'a shop may only state a figure it can point at. Put it in EVIDENCE.md, or carry a ' +
        'data-source on the element, or take it off the page.');
    }
  }
}

function checkImages(file, html, manifest) {
  // Both kinds count. Checking only <img> left a whole category unmanifested, which is
  // exactly what happens when drawings are inlined so that currentColor works — and
  // inlining is the correct technique, so the gate has to follow it.
  const assets = assetElements(html);
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

const evidenceIdx = args.indexOf('--evidence');
const evidencePath = evidenceIdx >= 0 ? args[evidenceIdx + 1] : 'EVIDENCE.md';
const evidenceRaw = await readFile(evidencePath, 'utf8').catch(() => null);

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
/* Two rules that both get called "the logo rule" and are opposites.

   One: the site's own mark. If the page renders one — and nearly every page does — it is an
   asset and it belongs in the manifest. Three independently built sites all drew a mark and
   none of the three recorded it, which is a missing instruction rather than three oversights.
   This used to demand a logo row from every manifest unconditionally, which is wrong the
   other way: it would fail a page that deliberately has no mark, and it said nothing about
   whether the mark the page actually renders was ever recorded.

   Two: other people's marks — customers, partners, certifications. Those are permitted only
   when the brief carries real named evidence, and where they appear they must never be a
   substitute, because a stand-in endorsement is a fabricated endorsement. That half is
   checked in checkBorrowedMarks below, against EVIDENCE.md. */
if (manifest.length) {
  const BRAND = /<a[^>]*class="[^"]*\b(brand|logo|mark|ident|wordmark|masthead__link)\b[^"]*"[\s\S]{0,1200}?<\/a>/i;
  for (const { label, html } of sources) {
    const el = markup(html).match(BRAND);
    if (!el) continue;

    /* Where the mark carries a data-asset, that id is the answer and nothing is inferred:
       the row either exists or it does not. Matching on the *word* "logo" appearing in some
       id was the old rule, and it failed three builds that had each recorded their mark
       correctly under the name `mark`. A gate that reports a fault the work does not have
       costs more than one that reports nothing. */
    const ids = [...el[0].matchAll(/data-asset=["']([^"']+)["']/g)].map((m) => m[1]);
    if (ids.length) {
      for (const id of ids) {
        if (!manifest.some((r) => r.id === id)) {
          add('block', manifestPath, `the mark renders as "${id}" and the manifest has no such row`,
            'a mark is an asset like any other picture — see v2/24-asset-plan.md');
        }
      }
      continue;
    }

    /* No data-asset on the mark. Then the question is whether *any* row plausibly records it,
       and a miss here is reported as a warning, because the gate is now inferring. */
    const looksLikeMark = manifest.some((r) => /\b(logo|wordmark|mark|ident|brand)\b/i.test(r.id));
    if (!looksLikeMark) {
      add('block', manifestPath, 'the page renders a brand mark that the manifest does not list',
        'a mark is an asset like any other picture — see v2/24-asset-plan.md');
    } else {
      add('warn', label, 'the brand mark carries no data-asset id',
        'without one the gate cannot tell which manifest row is the mark, and neither can a reader');
    }
  }
}

let totalImages = 0;
for (const { label, html } of sources) {
  checkPlaceholders(label, html);
  checkDummyIdentifiers(label, html);
  checkCommerceClaims(label, html, evidenceRaw);
  checkEmptyBrandMark(label, html);
  checkBorrowedMarks(label, html, evidenceRaw, manifest);
  checkFavicon(label, html);
  totalImages += checkImages(label, html, manifest);
}

if (mode === 'E' && evidenceRaw === null) {
  add('block', evidencePath, 'a shop with no evidence pack',
    'mode E checks every price, rating, delivery promise, stock figure, warranty and ' +
    'certification against EVIDENCE.md. Without it, none of them can be traced.');
}

/* A marketing or commerce page whose only asset is its own logo has no visual argument.
   That is the legacy set's central failure — a roofing company with no photograph of a roof
   and a product page whose product is a hatched box — so it is a blocking finding, not a
   warning, when the mode is declared. */
if (mode === 'M' || mode === 'E') {
  const nonLogo = manifest.filter((r) => !/logo|favicon|icon/i.test(r.id));
  if (!nonLogo.length) {
    add('block', manifestPath,
      `a ${MODES[mode]} page with no asset other than its own mark`,
      'mode ' + mode + ' cannot substitute for imagery; see v2/modes/ and v2/25-assets.md');
  } else if (!nonLogo.some((r) => r.state === 'ready')) {
    add('block', manifestPath,
      `a ${MODES[mode]} page whose only ready asset is its own mark`, '');
  }
  const rendered = new Set();
  for (const { html } of sources) {
    for (const el of assetElements(html)) {
      const id = (el.match(/data-asset=["']([^"']+)["']/) ?? [])[1];
      if (id) rendered.add(id);
    }
  }
  if (![...rendered].some((id) => !/logo|favicon|icon/i.test(id))) {
    add('block', 'the pages', `nothing but the mark is rendered on a ${MODES[mode]} page`,
      `rendered: ${[...rendered].join(', ') || 'nothing'}`);
  }
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
