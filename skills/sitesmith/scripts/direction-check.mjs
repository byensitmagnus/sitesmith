#!/usr/bin/env node
/**
 * Are the three comps actually three directions? Original work, MIT.
 *
 *   node scripts/direction-check.mjs directions/
 *   node scripts/direction-check.mjs directions/ --serve http://localhost:5173/directions
 *
 * Reads the declared macro axes and visual grammar from each comp's NOTE.md, checks pairwise
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
import {
  AXES, GRAMMAR, directionRecordProblems, grammarTreatment, parseDirectionRecord,
} from './direction-record.mjs';

/** Playwright lives in the project being checked, not next to this script. Same loader as
 *  verify.mjs: the bare specifier first, then CommonJS resolution from the working
 *  directory, because ESM does not consult NODE_PATH. */
const requireFromCwd = createRequire(join(process.cwd(), 'package.json'));
async function loadPlaywright() {
  try { return await import('playwright'); }
  catch { return await import(pathToFileURL(requireFromCwd.resolve('playwright')).href); }
}

const args = process.argv.slice(2);
const root = args.find((a) => !a.startsWith('--')) ?? 'directions';
const serveAt = (() => { const i = args.indexOf('--serve'); return i >= 0 ? args[i + 1] : null; })();

const die = (m) => { console.error(m); process.exit(2); };

/* ── declared axes ─────────────────────────────────────────────────────── */

/** A NOTE.md carries a list like `- composition: statement and artefact`. */
function parseNote(md) {
  const parsed = parseDirectionRecord(md);
  return {
    ...parsed,
    axes: Object.fromEntries(Object.entries(parsed.axes).map(([key, value]) => [key, value.toLowerCase()])),
    grammar: Object.fromEntries(Object.entries(parsed.grammar).map(([key, value]) => [key, value.toLowerCase()])),
  };
}

const dirs = (await readdir(root, { withFileTypes: true }).catch(() => die(`no ${root}/ directory`)))
  .filter((e) => e.isDirectory()).map((e) => e.name).sort();

if (dirs.length < 3) die(`the lab needs three comps; found ${dirs.length} in ${root}/`);

const comps = [];
for (const name of dirs) {
  const notePath = join(root, name, 'NOTE.md');
  const note = await readFile(notePath, 'utf8').catch(() => null);
  if (note === null) die(`${notePath} is missing — every comp states its direction record`);
  const parsed = parseNote(note);
  const { axes, grammar, version } = parsed;
  const missing = AXES.filter((a) => !axes[a]);
  if (missing.length) die(`${notePath} does not declare: ${missing.join(', ')}`);
  if ((version ?? 0) >= 2.3) {
    const missingGrammar = GRAMMAR.filter((field) => !grammar[field]);
    if (missingGrammar.length) die(`${notePath} does not declare visual grammar: ${missingGrammar.join(', ')}`);
    const malformed = directionRecordProblems(parsed).filter((problem) => /must be/.test(problem));
    if (malformed.length) die(`${notePath}: ${malformed.join('; ')}`);
  }
  const html = join(root, name, 'index.html');
  if (!(await stat(html).then(() => true, () => false))) die(`${html} is missing — a comp is a rendered page`);
  comps.push({ name, version, axes, grammar, html });
}

if (comps.some((comp) => (comp.version ?? 0) >= 2.3) &&
    comps.some((comp) => (comp.version ?? 0) < 2.3)) {
  die('direction lab mixes legacy and 2.3 notes — all three comps must use the same current record');
}

/* ── pairwise difference ───────────────────────────────────────────────── */

const problems = [];
const pairs = [];
for (let i = 0; i < comps.length; i++) {
  for (let j = i + 1; j < comps.length; j++) {
    const a = comps[i], b = comps[j];
    const differing = AXES.filter((ax) => a.axes[ax] !== b.axes[ax]);
    const grammarDiffering = GRAMMAR.filter((field) =>
      grammarTreatment(field, a.grammar[field]) !== grammarTreatment(field, b.grammar[field]));
    const macroOk = differing.length >= 3 && differing.includes('composition');
    const grammarRequired = (a.version ?? 0) >= 2.3 || (b.version ?? 0) >= 2.3;
    const grammarOk = !grammarRequired || grammarDiffering.length >= 2;
    const ok = macroOk && grammarOk;
    pairs.push({ a: a.name, b: b.name, differing, grammarDiffering, grammarRequired, ok });
    if (!macroOk) {
      problems.push(`${a.name} and ${b.name} differ on ${differing.length} axis/axes ` +
        `(${differing.join(', ') || 'none'})` +
        (differing.includes('composition') ? '' : ' and share a first-screen composition'));
    }
    if (!grammarOk) {
      problems.push(`${a.name} and ${b.name} differ on ${grammarDiffering.length} visual-grammar field(s) ` +
        `(${grammarDiffering.join(', ') || 'none'}); direction 2.3 needs at least 2 of surface, labels, figures and depth`);
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
        monoCaps: [...document.querySelectorAll('body *')].filter((el) => {
          const s = getComputedStyle(el);
          return /mono/i.test(s.fontFamily) && s.textTransform === 'uppercase' && el.textContent.trim();
        }).length,
        hairlines: [...document.querySelectorAll('body *')].reduce((n, el) => {
          const s = getComputedStyle(el);
          return n + ['Top', 'Bottom', 'Left', 'Right'].filter((side) => {
            const w = parseFloat(s[`border${side}Width`]);
            return w > 0 && w <= 1.5;
          }).length;
        }, 0),
        tabularNums: [...document.querySelectorAll('body *')]
          .filter((el) => /tabular-nums/.test(getComputedStyle(el).fontVariantNumeric)).length,
        shadowed: [...document.querySelectorAll('body *')]
          .filter((el) => getComputedStyle(el).boxShadow !== 'none').length,
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

      const ca = comps.find((comp) => comp.name === a.name);
      const cb = comps.find((comp) => comp.name === b.name);
      if ((ca.version ?? 0) >= 2.3 && (cb.version ?? 0) >= 2.3) {
        const shared = [
          ['uppercase mono labels', (m) => m.monoCaps >= 4],
          ['hairline separators', (m) => m.hairlines >= 20],
          ['tabular figures as a motif', (m) => m.tabularNums >= 3],
          ['flat surfaces', (m) => m.shadowed === 0],
        ].filter(([, test]) => test(a) && test(b)).map(([name]) => name);
        if (shared.length >= 3) {
          problems.push(`${a.name} and ${b.name} render the same micro-recipe: ${shared.join(', ')}`);
        }
      }
    }
  }
}

/* ── anti-repeat ───────────────────────────────────────────────────────── */

const history = await readFile(join(root, 'HISTORY.md'), 'utf8').catch(() => '');
for (const c of comps) {
  const fields = (c.version ?? 0) >= 2.3 ? [...AXES, ...GRAMMAR] : AXES;
  const signature = fields.map((field) => c.axes[field] ?? c.grammar[field]).join(' · ');
  if (history.toLowerCase().includes(signature)) {
    problems.push(`${c.name} repeats a previous winner on all ${fields.length} direction fields: ${signature}`);
  }
}

/* ── report ────────────────────────────────────────────────────────────── */

console.log(`\n  direction lab — ${comps.length} comps in ${root}/\n`);
for (const c of comps) {
  console.log(`  ${c.name}`);
  for (const a of AXES) console.log(`      ${a.padEnd(12)} ${c.axes[a]}`);
  if ((c.version ?? 0) >= 2.3) {
    for (const field of GRAMMAR) console.log(`      ${field.padEnd(12)} ${c.grammar[field]}`);
  }
  const m = measured?.find((x) => x.name === c.name);
  if (m) {
    console.log(`      ${'measured'.padEnd(12)} ground ${m.ground} (lum ${m.groundLuminance}), ` +
      `display ${m.displayFamily ?? '—'}, ${m.distinctSizes} sizes, ${m.distinctRadii} radii, ` +
      `${m.images + m.backgroundImages} images, ${m.bandSignature} bands; ` +
      `mono ${m.monoCaps}, hair ${m.hairlines}, tabular ${m.tabularNums}, shadows ${m.shadowed}`);
  }
}

console.log('\n  pairwise structural difference (needs 3 of 5, including composition)\n');
for (const p of pairs) {
  console.log(`  ${p.ok ? 'ok  ' : 'FAIL'}  ${p.a} vs ${p.b}: ${p.differing.length} — ${p.differing.join(', ') || 'nothing'}`);
  if (p.grammarRequired) {
    console.log(`        grammar: ${p.grammarDiffering.length} — ${p.grammarDiffering.join(', ') || 'nothing'} (needs 2 of 4)`);
  }
}

if (!measured) console.log('\n  note: playwright is unavailable, so nothing was measured — declared axes only');

console.log(`\n  ${problems.length ? `FAIL — ${problems.length} problem(s)` : 'PASS — three directions were put on the table'}`);
for (const p of problems) console.log(`    ${p}`);
console.log('');
process.exit(problems.length ? 1 : 0);
