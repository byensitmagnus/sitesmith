#!/usr/bin/env node
/**
 * How generic does this page look, and may this judge be trusted to say? Original work, MIT.
 *
 *   node tools/genericness-judge.mjs --selftest
 *   node tools/genericness-judge.mjs --score <url> [<url> ...]
 *
 * The mechanism is `ponytail`'s and it is about the judge, not the subject: an unvalidated
 * judge on a non-deterministic quality axis is an opinion, not evidence. Upstream fixes it
 * by requiring the judge to rank a known-over-engineered reference above a known-minimal
 * one before any real run is scored, and refusing to run when it cannot.
 *
 * Two deliberate departures, both stated rather than hidden:
 *
 *   1. Upstream's judge is a language model at temperature zero against a published
 *      rubric. This one measures the rendered page instead. There is no API key in this
 *      repository and no paid spend is permitted, so an LLM judge here would be a file
 *      nobody could run. A deterministic judge is weaker at nuance and stronger at being
 *      reproducible, and its rubric is the source of this file rather than a prompt.
 *   2. The known pair is this repository's own control group. `benchmarks/06-redesign/before/`
 *      is the deliberately generic page every gate must keep refusing, and `after/` is the
 *      redesign of the same content. They differ in exactly the axis being judged, they are
 *      committed, and they are already load-bearing elsewhere.
 *
 * The restriction that makes this safe to keep: it is repo-side only. It never ships in the
 * bundle, the skill never invokes it, and its verdict may veto a showcase entry but may
 * never feed a colour, a typeface or a layout back into a build. A judge that suggests is a
 * generator, and a generator scoring its own output is the loop this whole product avoids.
 *
 * Exit codes: 0 scored or validated, 1 the judge is not trustworthy or a page scored above
 * the threshold, 2 the run was wrong, 3 verdict withheld because nothing could render.
 */

import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const requireFromCwd = createRequire(join(process.cwd(), 'package.json'));
async function load(name) {
  try {
    return await import(name);
  } catch {
    return await import(pathToFileURL(requireFromCwd.resolve(name)).href);
  }
}

const argv = process.argv.slice(2);
const SELFTEST = argv.includes('--selftest');
const SCORE = argv.includes('--score');
const BASE = (() => {
  const i = argv.indexOf('--base');
  return i >= 0 ? argv[i + 1] : 'http://localhost:4321';
})();
/* Skip the value of --base. It is a URL too, and an earlier version scored it as a page,
   which produced one "withheld" line per run and looked like a rendering failure. */
const baseIndex = argv.indexOf('--base');
const urls = argv.filter((a, i) => /^https?:\/\//.test(a) && i !== baseIndex + 1);

if (!SELFTEST && !SCORE) {
  console.error('usage: genericness-judge.mjs --selftest | --score <url> [--base <url>]');
  process.exit(2);
}

/* The rubric. Every line is a move this repository has watched a model make unprompted,
   and each carries the weight of how strongly it predicted a page nobody could tell apart
   from another. Weights are round numbers on purpose: pretending to three decimal places
   would claim a calibration that does not exist. */
const RUBRIC = [
  ['ground in the default band', 3, 'an off-white or near-black ground within 12 RGB units of the two most recurring defaults'],
  ['single saturated accent', 2, 'exactly one chromatic colour above a low chroma floor, doing every job'],
  ['centred hero stack', 2, 'a first screen that is a centred heading, a centred subhead and a centred button'],
  ['equal card grid', 2, 'three or more equal-width boxes in one row, each with the same radius and border'],
  ['icon tiles', 2, 'a repeated rounded square wrapping a small graphic, three or more times'],
  ['uppercase tracked label', 1, 'small uppercase text with positive letter-spacing used as a section marker'],
  ['gradient text', 2, 'a heading painted with background-clip: text'],
  ['one radius everywhere', 1, 'a single corner radius on every boxed element on the page'],
  ['no drawn mark', 1, 'no inline drawing, figure or diagram anywhere in the first two screens'],
];
const MAX = RUBRIC.reduce((n, r) => n + r[1], 0);

/* The threshold. Above this a page is indistinguishable from the default, and the number
   is set from the pair rather than chosen: the self-test prints both scores, and anything
   at or above the control's score is the control wearing different words. */
const THRESHOLD = 9;

const pw = await load('playwright').catch(() => null);
const chromium = pw?.chromium ?? pw?.default?.chromium;
if (!chromium) {
  console.error('verdict withheld: playwright is not resolvable from this directory');
  console.error('install it where you run this, or run from benchmarks/');
  process.exit(3);
}

async function measure(page, url) {
  const res = await page.goto(url, { waitUntil: 'load', timeout: 30000 }).catch(() => null);
  if (!res || res.status() >= 400) return null;
  await page.waitForTimeout(500);
  return page.evaluate(() => {
    const vis = (el) => el.getClientRects().length > 0;
    const all = [...document.querySelectorAll('*')].filter(vis).slice(0, 1500);
    const cs = (el) => getComputedStyle(el);
    const rgb = (s) => (String(s).match(/\d+/g) ?? []).slice(0, 3).map(Number);
    const chroma = (c) => (c.length < 3 ? 0 : Math.max(...c) - Math.min(...c));
    const dist = (a, b) => Math.round(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]));

    const groundEl = [document.documentElement, document.body].find(
      (el) => cs(el).backgroundColor && !/rgba\(0, 0, 0, 0\)/.test(cs(el).backgroundColor),
    ) ?? document.body;
    const ground = rgb(cs(groundEl).backgroundColor);
    const DEFAULT_GROUNDS = [[245, 241, 234], [250, 250, 250], [255, 255, 255], [10, 10, 10], [17, 17, 17]];
    const groundDefault = DEFAULT_GROUNDS.some((d) => dist(ground, d) <= 12);

    const accents = new Set();
    for (const el of all) {
      for (const prop of ['color', 'backgroundColor', 'borderTopColor']) {
        const c = rgb(cs(el)[prop]);
        if (c.length === 3 && chroma(c) > 40) accents.add(c.map((n) => Math.round(n / 24)).join(','));
      }
    }

    const firstScreen = all.filter((el) => el.getBoundingClientRect().top < window.innerHeight);
    const centred = firstScreen.filter((el) => cs(el).textAlign === 'center');
    const heroCentred = centred.some((el) => /^H[12]$/.test(el.tagName))
      && centred.some((el) => el.tagName === 'P')
      && firstScreen.some((el) => /^(A|BUTTON)$/.test(el.tagName) && cs(el).textAlign === 'center');

    const rowsOf = (els) => {
      const byTop = new Map();
      for (const el of els) {
        const t = Math.round(el.getBoundingClientRect().top / 8) * 8;
        byTop.set(t, [...(byTop.get(t) ?? []), el]);
      }
      return [...byTop.values()];
    };
    const boxes = all.filter((el) => {
      const s = cs(el);
      const r = el.getBoundingClientRect();
      return r.width > 120 && r.height > 80 && (parseFloat(s.borderTopWidth) > 0 || s.boxShadow !== 'none' || parseFloat(s.borderRadius) > 0);
    });
    const cardRow = rowsOf(boxes).some((row) => {
      if (row.length < 3) return false;
      const w = row.map((el) => Math.round(el.getBoundingClientRect().width));
      return Math.max(...w) - Math.min(...w) < 8;
    });

    const tiles = all.filter((el) => {
      const s = cs(el);
      const r = el.getBoundingClientRect();
      return r.width > 24 && r.width < 90 && Math.abs(r.width - r.height) < 8
        && parseFloat(s.borderRadius) >= 4 && el.querySelector('svg, img, i');
    });

    const tracked = all.some((el) => {
      const s = cs(el);
      return s.textTransform === 'uppercase' && parseFloat(s.letterSpacing) > 0.4
        && parseFloat(s.fontSize) <= 15 && (el.textContent || '').trim().length > 1;
    });

    const gradientText = all.some((el) => {
      const s = cs(el);
      return /text/.test(s.webkitBackgroundClip ?? '') && /gradient/.test(s.backgroundImage);
    });

    const radii = new Set(
      boxes.map((el) => Math.round(parseFloat(cs(el).borderRadius) || 0)).filter((n) => n > 0),
    );

    const drawn = [...document.querySelectorAll('svg, figure, canvas')].filter(
      (el) => vis(el) && el.getBoundingClientRect().top < window.innerHeight * 2
        && el.getBoundingClientRect().width > 80,
    ).length;

    return {
      hits: {
        'ground in the default band': groundDefault,
        'single saturated accent': accents.size === 1,
        'centred hero stack': heroCentred,
        'equal card grid': cardRow,
        'icon tiles': tiles.length >= 3,
        'uppercase tracked label': tracked,
        'gradient text': gradientText,
        'one radius everywhere': radii.size === 1 && boxes.length >= 4,
        'no drawn mark': drawn === 0,
      },
      detail: { ground, accents: accents.size, tiles: tiles.length, radii: [...radii], drawn, boxes: boxes.length },
    };
  });
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const score = async (url) => {
  const m = await measure(page, url);
  if (!m) return null;
  let total = 0;
  const fired = [];
  for (const [name, weight] of RUBRIC) {
    if (m.hits[name]) { total += weight; fired.push(name); }
  }
  return { url, total, fired, detail: m.detail };
};

if (SELFTEST) {
  const control = `${BASE}/06-redesign/before/`;
  const distinct = `${BASE}/06-redesign/after/`;
  const a = await score(control);
  const b = await score(distinct);
  await browser.close();

  if (!a || !b) {
    console.error(`verdict withheld: could not render ${!a ? control : distinct}`);
    console.error('serve benchmarks/ first, or pass --base');
    process.exit(3);
  }

  console.log('\n  judge self-test, against this repository\'s own control pair\n');
  console.log(`  control   ${String(a.total).padStart(2)}/${MAX}  ${control}`);
  console.log(`            ${a.fired.join(', ') || 'nothing fired'}`);
  console.log(`  redesign  ${String(b.total).padStart(2)}/${MAX}  ${distinct}`);
  console.log(`            ${b.fired.join(', ') || 'nothing fired'}`);

  if (a.total <= b.total) {
    console.log('\n  judge not trustworthy: it did not rank the known-generic page above the redesign.');
    console.log('  Nothing may be scored with it until the rubric or a measurement is fixed.\n');
    process.exit(1);
  }
  console.log(`\n  ranked correctly, by ${a.total - b.total} point(s). Threshold for a real page is ${THRESHOLD}.\n`);
  process.exit(0);
}

/* --score refuses to run without the self-test having passed in the same invocation,
   which is the whole point of the mechanism: a judge that will score anything is a judge
   nobody checked. */
const a = await score(`${BASE}/06-redesign/before/`);
const b = await score(`${BASE}/06-redesign/after/`);
if (!a || !b || a.total <= b.total) {
  await browser.close();
  console.error('refusing to score: the judge did not pass its own validation pair first');
  process.exit(a && b ? 1 : 3);
}

const results = [];
for (const u of urls) results.push(await score(u));
await browser.close();

console.log(`\n  genericness, validated judge, threshold ${THRESHOLD}/${MAX}\n`);
let bad = 0;
for (const r of results) {
  if (!r) { console.log('  withheld  a page did not render'); continue; }
  const over = r.total >= THRESHOLD;
  if (over) bad++;
  console.log(`  ${over ? 'OVER' : 'ok  '}  ${String(r.total).padStart(2)}/${MAX}  ${r.url}`);
  if (r.fired.length) console.log(`          ${r.fired.join(', ')}`);
}
console.log('');
process.exit(bad ? 1 : 0);
