#!/usr/bin/env node
/**
 * One append-only direction history across every SiteSmith project. Original work, MIT.
 *
 *   node scripts/direction-history.mjs check  DIRECTION.md <url> --project <name>
 *   node scripts/direction-history.mjs commit DIRECTION.md <url> --project <name>
 *   node scripts/direction-history.mjs record DIRECTION.md <url> --project <name>
 *
 * `check` is the pre-build gate. `commit` re-checks the finished render and records it only
 * when it is new. `record` is the evidence-only escape hatch: it records what happened even
 * when it clashes. Future records contain no URL; the ledger describes a design, not a client.
 */

import { readFile, appendFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { join, dirname } from 'node:path';
import {
  AXES, GRAMMAR, directionRecordProblems, parseDirectionRecord,
} from './direction-record.mjs';

export const DEFAULT_HISTORY = join(homedir(), '.sitesmith', 'direction-history.jsonl');
export { AXES, GRAMMAR };

/** This is the measured SiteSmith recipe that passed three page-level reviews in round 8 and
 * still made three unrelated sites read as one house style. It must be blocked even on a clean
 * install whose personal history is empty. */
export const KNOWN_RECIPES = [{
  id: 'technical-editorial-flat',
  name: 'the flat technical-editorial SiteSmith recipe',
  devices: [
    'mono-uppercase-labels',
    'hairline-separators',
    'tabular-figure-motif',
    'flat-surfaces',
  ],
}];

const requireFromCwd = createRequire(join(process.cwd(), 'package.json'));
async function loadPlaywright() {
  try { return await import('playwright'); }
  catch { return await import(pathToFileURL(requireFromCwd.resolve('playwright')).href); }
}

export const parseRecord = parseDirectionRecord;

export const parseAxes = (md) => parseRecord(md).axes;
export const recordProblems = directionRecordProblems;

export function devicesFromFingerprint(f = {}) {
  const devices = new Set();
  const legacy = String(f.deviceKey ?? '').split('+');
  if (Number(f.monoCaps) >= 4 || legacy.includes('monocaps')) devices.add('mono-uppercase-labels');
  if (Number(f.hairlines) >= 20 || legacy.includes('hairlines')) devices.add('hairline-separators');
  if (Number(f.strokeOnlySvgs) >= 1 && Number(f.rasterImages) === 0) devices.add('line-only-imagery');
  if (f.displayClass === 'system-sans' || /^(ui-sans-serif|system-ui|-apple-system|ui-monospace)/i.test(f.displayFamily ?? '')) {
    devices.add('system-display');
  }
  if (Number(f.tabularNums) >= 3) devices.add('tabular-figure-motif');
  if (Number(f.shadowed) === 0) devices.add('flat-surfaces');
  if (Number(f.cards) >= 3) devices.add('rounded-card-grid');
  return devices;
}

export const deviceKey = (f) => [...devicesFromFingerprint(f)].sort().join('+') || 'none';

/** The coarse shape of what a page actually looks like. Deliberately blunt: matching it is
 * evidence of the same rendered direction even when the prose is different. */
export const fingerprintKey = (f) =>
  [f.groundBand, f.displayClass, f.imageryBand, f.layout, f.deviceKey ?? deviceKey(f)].join('|');

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
  const f = String(family).toLowerCase();
  if (/mono/.test(f)) return 'mono';
  if (/(georgia|palatino|iowan|optima|garamond|times|book antiqua|serif)/.test(f) && !/sans/.test(f)) return 'serif';
  if (/(narrow|condensed)/.test(f)) return 'condensed';
  if (/^(ui-sans-serif|system-ui|-apple-system|segoe|roboto|arial|helvetica)/.test(f)) return 'system-sans';
  return 'sans';
}

export async function fingerprint(url) {
  const pw = await loadPlaywright();
  const chromium = pw.chromium ?? pw.default?.chromium;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
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
      const strokeOnlySvgs = [...document.querySelectorAll('svg:not([aria-hidden="true"])')]
        .filter((svg) => {
          const children = [...svg.querySelectorAll('*')];
          return children.length > 0 && children.every((child) => {
            const s = getComputedStyle(child);
            return s.fill === 'none' || s.fill === 'rgba(0, 0, 0, 0)' || parseFloat(s.fillOpacity) < 0.4;
          });
        }).length;
      return {
        ground: body.backgroundColor,
        luminance: Number(lum(body.backgroundColor).toFixed(3)),
        displayFamily: (h1 ? getComputedStyle(h1).fontFamily : body.fontFamily)
          .split(',')[0].replace(/["']/g, '').trim(),
        assetShare: Number((assets.reduce((a, el) => a + area(el.getBoundingClientRect()), 0) / (W * H) * 100).toFixed(2)),
        rasterImages: document.querySelectorAll('img[src]:not([src$=".svg"]), picture, video').length,
        strokeOnlySvgs,
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
        tabularNums: all.filter((el) => /tabular-nums/.test(getComputedStyle(el).fontVariantNumeric)).length,
        shadowed: all.filter((el) => getComputedStyle(el).boxShadow !== 'none').length,
        cards: all.filter((el) => {
          const s = getComputedStyle(el);
          return parseFloat(s.borderTopLeftRadius) >= 4 &&
            (s.backgroundColor !== 'rgba(0, 0, 0, 0)' || s.boxShadow !== 'none') &&
            el.getBoundingClientRect().height > 60;
        }).length,
      };
    });
    const enriched = {
      ...raw,
      groundBand: bandOf(raw.luminance),
      displayClass: displayClass(raw.displayFamily),
      imageryBand: imageryBand(raw.assetShare),
      layout: [raw.hasTable ? 'table' : 'prose', raw.columns >= 2 ? `split${raw.columns}` : 'single'].join('+'),
    };
    return { ...enriched, deviceKey: deviceKey(enriched) };
  } finally {
    await browser.close();
  }
}

export async function readHistory(historyPath = DEFAULT_HISTORY) {
  let raw;
  try {
    raw = await readFile(historyPath, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
  return raw.split('\n').filter((line) => line.trim()).map((line, index) => {
    try { return JSON.parse(line); }
    catch { throw new Error(`${historyPath}:${index + 1} is not valid JSON — direction history cannot be trusted`); }
  });
}

export function compareWithHistory({ project, record, fingerprint: fp, history }) {
  const problems = [...recordProblems(record)];
  const devices = devicesFromFingerprint(fp);
  const recipeClashes = KNOWN_RECIPES.filter((recipe) =>
    recipe.devices.every((name) => devices.has(name)));
  for (const recipe of recipeClashes) {
    problems.push(`matches ${recipe.name}: ${recipe.devices.join(', ')}. Change the visual grammar, not the copy.`);
  }

  const others = history.filter((entry) => entry.project !== project);
  const exactClashes = others.filter((entry) => fingerprintKey(entry.fingerprint ?? {}) === fingerprintKey(fp));
  for (const clash of exactClashes) {
    problems.push(`renders the same as "${clash.project}" recorded ${clash.when}: ${fingerprintKey(fp)}. The words may be new; the page is not.`);
  }

  const deviceClashes = [];
  for (const entry of others) {
    if (exactClashes.includes(entry)) continue;
    const shared = [...devices].filter((name) => devicesFromFingerprint(entry.fingerprint).has(name));
    if (shared.length < 4) continue;
    deviceClashes.push({ entry, shared });
    problems.push(`shares ${shared.length} house-style devices with "${entry.project}": ${shared.join(', ')}`);
  }

  const wordClashes = others.filter((entry) => AXES.every((axis) =>
    String(entry.axes?.[axis] ?? '').toLowerCase() === String(record.axes?.[axis] ?? '').toLowerCase()));
  for (const clash of wordClashes) {
    if (!exactClashes.includes(clash)) problems.push(`declares the same five macro axes as "${clash.project}"`);
  }

  return { problems, recipeClashes, exactClashes, deviceClashes, wordClashes, devices };
}

export function historyEntry({ project, record, fingerprint: fp, clashedWith = [], when }) {
  return {
    project,
    when: when ?? new Date().toISOString().slice(0, 10),
    axes: record.axes,
    grammar: record.grammar,
    fingerprint: fp,
    clashedWith,
  };
}

/* ── CLI ───────────────────────────────────────────────────────────────── */

const invokedDirectly = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;

if (invokedDirectly) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const dirPath = args[1];
  const url = args[2];
  const option = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
  const project = option('--project');
  const historyPath = option('--history') ?? DEFAULT_HISTORY;

  if (!['record', 'check', 'commit'].includes(cmd) || !dirPath || !url || !project) {
    console.error('usage: direction-history.mjs <check|commit|record> <DIRECTION.md> <url> --project <name> [--history file]');
    process.exit(2);
  }

  const record = parseRecord(await readFile(dirPath, 'utf8'));
  const fp = await fingerprint(url);
  const history = await readHistory(historyPath);
  const verdict = compareWithHistory({ project, record, fingerprint: fp, history });

  console.log(`\n  ${project} — ${url}`);
  console.log(`  render fingerprint: ${fingerprintKey(fp)}`);
  console.log(`    ground ${fp.ground} (${fp.groundBand}, lum ${fp.luminance})`);
  console.log(`    display ${fp.displayFamily} (${fp.displayClass})`);
  console.log(`    imagery ${fp.assetShare}% (${fp.imageryBand})`);
  console.log(`    layout ${fp.layout}`);
  console.log(`    devices ${[...verdict.devices].join(', ') || 'none'}`);
  console.log(`  history: ${history.length} entr${history.length === 1 ? 'y' : 'ies'} across ` +
    `${new Set(history.map((entry) => entry.project)).size} project(s)\n`);

  for (const problem of verdict.problems) console.log(`  FAIL  ${problem}`);

  if (cmd === 'check' || cmd === 'commit') {
    if (verdict.problems.length) {
      console.log(`\n  FAIL — ${verdict.problems.length} novelty problem(s)\n`);
      process.exit(1);
    }
    if (cmd === 'check') {
      console.log('\n  PASS — this render is new to the portfolio\n');
      process.exit(0);
    }
  }

  const alreadyRecorded = history.some((entry) => entry.project === project &&
    fingerprintKey(entry.fingerprint ?? {}) === fingerprintKey(fp) &&
    AXES.every((axis) => String(entry.axes?.[axis] ?? '').toLowerCase() ===
      String(record.axes?.[axis] ?? '').toLowerCase()));
  if (alreadyRecorded) {
    console.log('\n  PASS — this project and render are already recorded\n');
    process.exit(0);
  }

  await mkdir(dirname(historyPath), { recursive: true });
  await appendFile(historyPath, JSON.stringify(historyEntry({
    project, record, fingerprint: fp,
    clashedWith: [
      ...verdict.exactClashes.map((entry) => entry.project),
      ...verdict.deviceClashes.map(({ entry }) => entry.project),
    ],
  })) + '\n');
  console.log(`\n  ${cmd === 'commit' ? 'PASS — checked and recorded' : 'recorded as evidence'}\n`);
  process.exit(0);
}
