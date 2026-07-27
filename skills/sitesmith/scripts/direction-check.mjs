#!/usr/bin/env node
/**
 * Are the three comps actually three directions? Original work, MIT.
 *
 *   node scripts/direction-check.mjs directions/
 *   node scripts/direction-check.mjs directions/ --serve http://localhost:5173/directions
 *
 * Reads the declared axis values from each comp's NOTE.md, checks pairwise structural
 * difference, then measures the rendered pages and checks the measurements against what was
 * declared. Where they disagree the measurement wins: a comp whose note claims a dark ground
 * and renders #faf8f4 has not made the choice it says it made.
 *
 * Playwright is optional. Without it the declared axes are still checked, and the report says
 * that nothing was measured.
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

/** Playwright lives in the project being checked, not next to this script. Same loader as
 *  verify.mjs: the bare specifier first, then CommonJS resolution from the working
 *  directory, because ESM does not consult NODE_PATH. */
const requireFromCwd = createRequire(join(process.cwd(), 'package.json'));
async function loadPlaywright() {
  try { return await import('playwright'); }
  catch { return await import(pathToFileURL(requireFromCwd.resolve('playwright')).href); }
}

const AXES = ['composition', 'type', 'colour', 'imagery', 'rhythm'];
const args = process.argv.slice(2);
const root = args.find((a) => !a.startsWith('--')) ?? 'directions';
const serveAt = (() => { const i = args.indexOf('--serve'); return i >= 0 ? args[i + 1] : null; })();

const die = (m) => { console.error(m); process.exit(2); };

/* ── declared axes ─────────────────────────────────────────────────────── */

/** A NOTE.md carries a list like `- composition: statement and artefact`. */
function parseNote(md) {
  const axes = {};
  for (const line of md.split('\n')) {
    const m = line.match(/^\s*[-*]\s*(composition|type|colour|color|imagery|rhythm)\s*:\s*(.+?)\s*$/i);
    if (m) axes[m[1].toLowerCase().replace('color', 'colour')] = m[2].toLowerCase();
  }
  return axes;
}

const dirs = (await readdir(root, { withFileTypes: true }).catch(() => die(`no ${root}/ directory`)))
  .filter((e) => e.isDirectory()).map((e) => e.name).sort();

if (dirs.length < 3) die(`the lab needs three comps; found ${dirs.length} in ${root}/`);

const comps = [];
for (const name of dirs) {
  const notePath = join(root, name, 'NOTE.md');
  const note = await readFile(notePath, 'utf8').catch(() => null);
  if (note === null) die(`${notePath} is missing — every comp states its five axis values`);
  const axes = parseNote(note);
  const missing = AXES.filter((a) => !axes[a]);
  if (missing.length) die(`${notePath} does not declare: ${missing.join(', ')}`);
  const html = join(root, name, 'index.html');
  if (!(await stat(html).then(() => true, () => false))) die(`${html} is missing — a comp is a rendered page`);
  comps.push({ name, axes, html });
}

/* ── pairwise difference ───────────────────────────────────────────────── */

const problems = [];
const pairs = [];
for (let i = 0; i < comps.length; i++) {
  for (let j = i + 1; j < comps.length; j++) {
    const a = comps[i], b = comps[j];
    const differing = AXES.filter((ax) => a.axes[ax] !== b.axes[ax]);
    const ok = differing.length >= 3 && differing.includes('composition');
    pairs.push({ a: a.name, b: b.name, differing, ok });
    if (!ok) {
      problems.push(`${a.name} and ${b.name} differ on ${differing.length} axis/axes ` +
        `(${differing.join(', ') || 'none'})` +
        (differing.includes('composition') ? '' : ' and share a first-screen composition'));
    }
  }
}

/* ── measurement ───────────────────────────────────────────────────────── */

let measured = null;
try {
  const pw = await loadPlaywright();
  const chromium = pw.chromium ?? pw.default?.chromium;
  if (!chromium) throw new Error('no chromium export');
  const browser = await chromium.launch();
  measured = [];
  for (const c of comps) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const url = serveAt ? `${serveAt}/${c.name}/index.html` : pathToFileURL(c.html).href;
    await page.goto(url, { waitUntil: 'networkidle' });
    const m = await page.evaluate(() => {
      const lum = (rgb) => {
        const [r, g, b] = (rgb.match(/\d+/g) ?? [255, 255, 255]).map(Number)
          .map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const body = getComputedStyle(document.body);
      const sizes = new Set(), families = new Set(), radii = new Set();
      for (const el of document.querySelectorAll('body *')) {
        const s = getComputedStyle(el);
        if (el.textContent?.trim()) { sizes.add(s.fontSize); families.add(s.fontFamily.split(',')[0].replace(/["']/g, '').trim()); }
        if (s.borderTopLeftRadius !== '0px') radii.add(s.borderTopLeftRadius);
      }
      const h1 = document.querySelector('h1');
      // A crude but stable signature of section rhythm: the sequence of distinct section
      // background colours down the page.
      const bands = [...document.querySelectorAll('body > *, main > *')]
        .map((el) => getComputedStyle(el).backgroundColor)
        .filter((c) => c && c !== 'rgba(0, 0, 0, 0)');
      return {
        groundLuminance: Number(lum(body.backgroundColor).toFixed(3)),
        ground: body.backgroundColor,
        displayFamily: h1 ? getComputedStyle(h1).fontFamily.split(',')[0].replace(/["']/g, '').trim() : null,
        distinctFamilies: [...families].length,
        distinctSizes: [...sizes].length,
        distinctRadii: [...radii].length,
        images: document.querySelectorAll('img, picture, svg:not([aria-hidden="true"])').length,
        backgroundImages: [...document.querySelectorAll('body *')]
          .filter((el) => getComputedStyle(el).backgroundImage !== 'none').length,
        bandSignature: [...new Set(bands)].length,
      };
    });
    measured.push({ name: c.name, ...m });
    await page.close();
  }
  await browser.close();
} catch {
  measured = null;
}

/* ── declared against measured ─────────────────────────────────────────── */

if (measured) {
  for (const c of comps) {
    const m = measured.find((x) => x.name === c.name);
    const declaredDark = /\bdark\b/.test(c.axes.colour);
    const declaredImageless = /\b(imageless|no imagery|typographic|type[- ]only)\b/.test(c.axes.imagery);
    if (declaredDark && m.groundLuminance > 0.4) {
      problems.push(`${c.name} declares a dark ground and renders ${m.ground} (luminance ${m.groundLuminance})`);
    }
    if (!declaredDark && /\blight\b/.test(c.axes.colour) && m.groundLuminance < 0.4) {
      problems.push(`${c.name} declares a light ground and renders ${m.ground} (luminance ${m.groundLuminance})`);
    }
    if (!declaredImageless && m.images + m.backgroundImages === 0) {
      problems.push(`${c.name} declares imagery "${c.axes.imagery}" and renders none`);
    }
  }
  // Two comps whose measured ground, display family and image count all match are the same
  // comp whatever their notes say.
  for (let i = 0; i < measured.length; i++) {
    for (let j = i + 1; j < measured.length; j++) {
      const a = measured[i], b = measured[j];
      const same = Math.abs(a.groundLuminance - b.groundLuminance) < 0.03 &&
        a.displayFamily === b.displayFamily &&
        (a.images + a.backgroundImages === 0) === (b.images + b.backgroundImages === 0) &&
        a.distinctSizes === b.distinctSizes;
      if (same) problems.push(`${a.name} and ${b.name} measure identically: same ground, same display face, ` +
        `same size count, same imagery presence`);
    }
  }
}

/* ── anti-repeat ───────────────────────────────────────────────────────── */

const history = await readFile(join(root, 'HISTORY.md'), 'utf8').catch(() => '');
for (const c of comps) {
  const signature = AXES.map((a) => c.axes[a]).join(' · ');
  if (history.toLowerCase().includes(signature)) {
    problems.push(`${c.name} repeats a previous winner on all five axes: ${signature}`);
  }
}

/* ── report ────────────────────────────────────────────────────────────── */

console.log(`\n  direction lab — ${comps.length} comps in ${root}/\n`);
for (const c of comps) {
  console.log(`  ${c.name}`);
  for (const a of AXES) console.log(`      ${a.padEnd(12)} ${c.axes[a]}`);
  const m = measured?.find((x) => x.name === c.name);
  if (m) {
    console.log(`      ${'measured'.padEnd(12)} ground ${m.ground} (lum ${m.groundLuminance}), ` +
      `display ${m.displayFamily ?? '—'}, ${m.distinctSizes} sizes, ${m.distinctRadii} radii, ` +
      `${m.images + m.backgroundImages} images, ${m.bandSignature} bands`);
  }
}

console.log('\n  pairwise structural difference (needs 3 of 5, including composition)\n');
for (const p of pairs) {
  console.log(`  ${p.ok ? 'ok  ' : 'FAIL'}  ${p.a} vs ${p.b}: ${p.differing.length} — ${p.differing.join(', ') || 'nothing'}`);
}

if (!measured) console.log('\n  note: playwright is unavailable, so nothing was measured — declared axes only');

console.log(`\n  ${problems.length ? `FAIL — ${problems.length} problem(s)` : 'PASS — three directions were put on the table'}`);
for (const p of problems) console.log(`    ${p}`);
console.log('');
process.exit(problems.length ? 1 : 0);
