#!/usr/bin/env node
/**
 * One append-only history of chosen directions, across every project. Original work, MIT.
 *
 *   node scripts/direction-history.mjs record <DIRECTION.md> <url> --project <name>
 *   node scripts/direction-history.mjs check  <DIRECTION.md> <url> --project <name>
 *
 * A per-project `directions/HISTORY.md` cannot see the other projects, which is exactly where
 * repetition lives: three pilots each checked their own history, each found nothing, and all
 * three shipped the same off-white technical-editorial page.
 *
 * So the history is one file, `docs/v2/direction-history.jsonl`, committed and append-only,
 * and it stores two things per entry: the direction as declared, and the **measured render
 * fingerprint** of the site that direction produced. The second is the one that matters. A
 * direction can be described in fresh words and still render as the last one.
 */

import { readFile, appendFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const HISTORY = fileURLToPath(new URL('../../../docs/v2/direction-history.jsonl', import.meta.url));

const requireFromCwd = createRequire(join(process.cwd(), 'package.json'));
async function loadPlaywright() {
  try { return await import('playwright'); }
  catch { return await import(pathToFileURL(requireFromCwd.resolve('playwright')).href); }
}

const AXES = ['composition', 'type', 'colour', 'imagery', 'rhythm'];

export function parseAxes(md) {
  const axes = {};
  for (const line of md.split('\n')) {
    const m = line.match(/^\s*[-*]\s*(composition|type|colour|color|imagery|rhythm)\s*:\s*(.+?)\s*$/i);
    if (m) axes[m[1].toLowerCase().replace('color', 'colour')] = m[2].trim();
  }
  return axes;
}

/** The coarse shape of what a page actually looks like. Deliberately blunt: two entries with
 *  the same fingerprint are the same page whatever their words claim. */
export const fingerprintKey = (f) =>
  [f.groundBand, f.displayClass, f.imageryBand, f.layout, f.deviceKey].join('|');

export function bandOf(lum) {
  if (lum < 0.2) return 'dark';
  if (lum < 0.45) return 'mid-dark';
  if (lum < 0.7) return 'mid';
  return 'light';
}
export function imageryBand(share) {
  if (share < 2) return 'imageless';
  if (share < 8) return 'incidental';
  if (share < 20) return 'supporting';
  return 'dominant';
}
export function displayClass(family) {
  const f = family.toLowerCase();
  if (/mono/.test(f)) return 'mono';
  if (/(georgia|palatino|iowan|optima|garamond|times|book antiqua|serif)/.test(f) && !/sans/.test(f)) return 'serif';
  if (/(narrow|condensed)/.test(f)) return 'condensed';
  if (/^(ui-sans-serif|system-ui|-apple-system|segoe|roboto|arial|helvetica)/.test(f)) return 'system-sans';
  return 'sans';
}

async function fingerprint(url) {
  const pw = await loadPlaywright();
  const chromium = pw.chromium ?? pw.default?.chromium;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  const raw = await page.evaluate(() => {
    const W = 1440, H = 900;
    const lum = (s) => {
      const [r, g, b] = (s.match(/\d+/g) ?? [255, 255, 255]).map(Number)
        .map((v) => { const x = v / 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const area = (r) => Math.max(0, Math.min(r.bottom, H) - Math.max(r.top, 0)) *
                        Math.max(0, Math.min(r.right, W) - Math.max(r.left, 0));
    const body = getComputedStyle(document.body);
    const all = [...document.querySelectorAll('body *')];
    const h1 = document.querySelector('h1');
    const assets = [...document.querySelectorAll('img, picture, svg:not([aria-hidden="true"]), video')];
    const edges = new Set(all.map((el) => el.getBoundingClientRect())
      .filter((r) => r.top < H && r.width > 200 && r.height > 120)
      .map((r) => Math.round(r.left / 40) * 40));
    return {
      ground: body.backgroundColor,
      luminance: Number(lum(body.backgroundColor).toFixed(3)),
      displayFamily: (h1 ? getComputedStyle(h1).fontFamily : body.fontFamily)
        .split(',')[0].replace(/["']/g, '').trim(),
      assetShare: Number((assets.reduce((a, el) => a + area(el.getBoundingClientRect()), 0) / (W * H) * 100).toFixed(2)),
      hasTable: !!document.querySelector('table'),
      columns: edges.size,
      monoCaps: all.filter((el) => {
        const s = getComputedStyle(el);
        return /mono/i.test(s.fontFamily) && s.textTransform === 'uppercase' && el.textContent.trim();
      }).length,
      hairlines: all.reduce((n, el) => {
        const s = getComputedStyle(el);
        return n + ['Top', 'Bottom', 'Left', 'Right'].filter((side) => {
          const w = parseFloat(s[`border${side}Width`]);
          return w > 0 && w <= 1.5;
        }).length;
      }, 0),
    };
  });
  await browser.close();

  return {
    ...raw,
    groundBand: bandOf(raw.luminance),
    displayClass: displayClass(raw.displayFamily),
    imageryBand: imageryBand(raw.assetShare),
    layout: [raw.hasTable ? 'table' : 'prose', raw.columns >= 2 ? `split${raw.columns}` : 'single'].join('+'),
    deviceKey: [raw.monoCaps >= 4 ? 'monocaps' : '', raw.hairlines >= 20 ? 'hairlines' : ''].filter(Boolean).join('+') || 'none',
  };
}

export async function readHistory() {
  const raw = await readFile(HISTORY, 'utf8').catch(() => '');
  return raw.split('\n').filter((l) => l.trim()).map((l) => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean);
}

/* ── run ───────────────────────────────────────────────────────────────── */

const args = process.argv.slice(2);
const cmd = args[0];
const [dirPath, url] = args.slice(1).filter((a) => !a.startsWith('--'));
const pIdx = args.indexOf('--project');
const project = pIdx >= 0 ? args[pIdx + 1] : null;

if (!['record', 'check'].includes(cmd) || !dirPath || !url || !project) {
  console.error('usage: direction-history.mjs <record|check> <DIRECTION.md> <url> --project <name>');
  process.exit(2);
}

const axes = parseAxes(await readFile(dirPath, 'utf8'));
const fp = await fingerprint(url);
const key = fingerprintKey(fp);
const history = await readHistory();

const clashes = history.filter((h) => h.project !== project && fingerprintKey(h.fingerprint) === key);
const wordClashes = history.filter((h) => h.project !== project &&
  AXES.every((a) => (h.axes[a] ?? '').toLowerCase() === (axes[a] ?? '').toLowerCase()));

console.log(`\n  ${project} — ${url}`);
console.log(`  render fingerprint: ${key}`);
console.log(`    ground ${fp.ground} (${fp.groundBand}, lum ${fp.luminance})`);
console.log(`    display ${fp.displayFamily} (${fp.displayClass})`);
console.log(`    imagery ${fp.assetShare}% (${fp.imageryBand})`);
console.log(`    layout ${fp.layout}, devices ${fp.deviceKey}`);
console.log(`  history: ${history.length} entr${history.length === 1 ? 'y' : 'ies'} across ` +
  `${new Set(history.map((h) => h.project)).size} project(s)\n`);

const problems = [];
for (const c of clashes) {
  problems.push(`renders the same as "${c.project}" recorded ${c.when}: ${key}. ` +
    `The words may be new; the page is not.`);
}
for (const c of wordClashes) {
  if (!clashes.includes(c)) problems.push(`declares the same five axes as "${c.project}"`);
}

if (cmd === 'check') {
  for (const p of problems) console.log(`  FAIL  ${p}`);
  console.log(`\n  ${problems.length ? `FAIL — ${problems.length} clash(es)` : 'PASS — this render is new to the portfolio'}\n`);
  process.exit(problems.length ? 1 : 0);
}

/* record: append even when it clashes, and say so. The history is a record of what happened,
   not a record of what we would like to have happened. */
await mkdir(dirname(HISTORY), { recursive: true });
await appendFile(HISTORY, JSON.stringify({
  project, url, when: new Date().toISOString().slice(0, 10), axes, fingerprint: fp,
  clashedWith: clashes.map((c) => c.project),
}) + '\n');
console.log(`  recorded${clashes.length ? ` — and it clashes with ${clashes.map((c) => c.project).join(', ')}` : ''}\n`);
process.exit(0);
