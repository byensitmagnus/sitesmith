#!/usr/bin/env node
/**
 * Do the finished sites look like different sites? Original work, MIT.
 *
 *   node scripts/portfolio-diversity.mjs <url> <url> <url> [--labels a,b,c] [--out DIR]
 *
 * direction-check asks whether three comps differed. direction-fidelity asks whether one
 * site delivered the direction it chose. This asks the question a viewer asks when they see
 * the portfolio: are these three the same page with different words on it?
 *
 * It exists because the answer was yes and nobody noticed. Three pilots with genuinely
 * different evidence packs, three different modes, three different chosen directions — and
 * all three rendered off-white grounds inside a 0.031 luminance band, with letterspaced
 * uppercase mono labels, hairline borders and line drawings occupying under five per cent of
 * the first screen. Every existing gate passed.
 *
 * Every signal here is measured from the rendered page. None of it reads a direction file.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const requireFromCwd = createRequire(join(process.cwd(), 'package.json'));
async function loadPlaywright() {
  try { return await import('playwright'); }
  catch { return await import(pathToFileURL(requireFromCwd.resolve('playwright')).href); }
}

/* ── the thresholds, and why each one is where it is ───────────────────── */

export const RULES = {
  // Three grounds inside this band are one palette family however different the hues are.
  groundBand: 0.18,
  // A device used by every site in the portfolio is the portfolio's device, not the site's.
  sharedDeviceLimit: 2,      // at most 2 of 3 may use any one device
  // Imagery has to be load-bearing somewhere. If no site clears this, the portfolio is
  // carried entirely by type and rules, which is what "technical editorial" means.
  imageryLeaderMin: 12,
  // Two sites whose first screens are built the same way are one layout twice.
  layoutSignatureLimit: 2,
};

/** A coarse family for a ground: light or dark, warm or cool. Two sites in the same cell
 *  with luminance inside the band are the same ground. */
export const groundFamily = (m) => {
  const [r, g, b] = m.groundRgb;
  const warm = r - b;
  return `${m.luminance > 0.5 ? 'light' : 'dark'}-${warm > 6 ? 'warm' : warm < -6 ? 'cool' : 'neutral'}`;
};

/** How the first screen is built, as a coarse shape. */
export const layoutSignature = (m) =>
  [m.firstScreen.hasTable ? 'table' : '',
   m.firstScreen.columns >= 2 ? `split${m.firstScreen.columns}` : 'single',
   m.firstScreen.heroTextShare > 12 ? 'bigtype' : '',
   m.firstScreen.largestAssetShare > 12 ? 'object' : '',
   m.cards >= 3 ? 'cards' : ''].filter(Boolean).join('+') || 'plain';

export function compare(sites) {
  const problems = [];
  const notes = [];

  /* palette family */
  const fams = sites.map((s) => ({ label: s.label, family: groundFamily(s.m), lum: s.m.luminance }));
  const byFamily = {};
  for (const f of fams) (byFamily[f.family] ??= []).push(f);
  for (const [family, group] of Object.entries(byFamily)) {
    if (group.length < 2) continue;
    const spread = Math.max(...group.map((g) => g.lum)) - Math.min(...group.map((g) => g.lum));
    if (spread <= RULES.groundBand) {
      problems.push(`palette: ${group.map((g) => g.label).join(', ')} share the ${family} ` +
        `ground family within ${spread.toFixed(3)} luminance. That is one palette recipe with ` +
        `the hue rotated, which is what the legacy set did nine times.`);
    }
  }

  /* devices used across the whole portfolio */
  const devices = [
    ['letterspaced uppercase mono labels', (m) => m.monoCaps >= 4],
    ['hairline borders as the separator', (m) => m.hairlines >= 20],
    ['line drawings as the only imagery', (m) => m.strokeOnlySvgs >= 1 && m.rasterImages === 0],
    ['a system font stack for display', (m) => /^(ui-sans-serif|system-ui|-apple-system|ui-monospace)/.test(m.displayFamily)],
    ['tabular figures as a motif', (m) => m.tabularNums >= 3],
    ['no elevation anywhere', (m) => m.shadowed === 0],
  ];
  for (const [name, test] of devices) {
    const users = sites.filter((s) => test(s.m)).map((s) => s.label);
    if (users.length > RULES.sharedDeviceLimit) {
      problems.push(`device: all ${users.length} sites use ${name} (${users.join(', ')}). ` +
        `A device every site shares belongs to the portfolio, not to any of them.`);
    } else if (users.length === RULES.sharedDeviceLimit) {
      notes.push(`${users.join(' and ')} both use ${name}`);
    }
  }

  /* imagery has to matter somewhere */
  const leader = Math.max(...sites.map((s) => s.m.assetShare));
  if (leader < RULES.imageryLeaderMin) {
    problems.push(`imagery: the most image-led site gives assets ${leader.toFixed(1)}% of its ` +
      `first screen. No site in the portfolio is carried by anything but type and rules.`);
  }

  /* layout */
  const sigs = sites.map((s) => ({ label: s.label, sig: layoutSignature(s.m) }));
  const bySig = {};
  for (const s of sigs) (bySig[s.sig] ??= []).push(s.label);
  for (const [sig, group] of Object.entries(bySig)) {
    if (group.length >= RULES.layoutSignatureLimit) {
      problems.push(`layout: ${group.join(', ')} build the first screen the same way (${sig})`);
    }
  }

  /* display faces */
  const faces = new Set(sites.map((s) => s.m.displayFamily.toLowerCase()));
  if (faces.size < sites.length) {
    problems.push(`type: ${sites.length} sites share ${faces.size} display face(s): ` +
      `${[...faces].join(', ')}`);
  }

  return { pass: problems.length === 0, problems, notes, sigs, fams };
}

/* ── measure ───────────────────────────────────────────────────────────── */

async function measure(page) {
  return page.evaluate(() => {
    const W = 1440, H = 900;
    const rgb = (s) => (s.match(/\d+/g) ?? [255, 255, 255]).map(Number).slice(0, 3);
    const lum = (s) => {
      const [r, g, b] = rgb(s).map((v) => { const x = v / 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const area = (r) => Math.max(0, Math.min(r.bottom, H) - Math.max(r.top, 0)) *
                        Math.max(0, Math.min(r.right, W) - Math.max(r.left, 0));

    const body = getComputedStyle(document.body);
    /* A9 measured a fiction here: a site painting its ground on <html> and leaving
       <body> transparent scored rgba(0,0,0,0), luminance 0, and was filed as a dark
       site when its real ground was light. The ground is whatever is actually behind
       the page, so fall through when body is unpainted. */
    const TRANSPARENT = /^(transparent|rgba\(0, 0, 0, 0\))$/;
    const paintedGround = TRANSPARENT.test(body.backgroundColor)
      ? getComputedStyle(document.documentElement).backgroundColor
      : body.backgroundColor;
    const all = [...document.querySelectorAll('body *')];
    const h1 = document.querySelector('h1');
    const assets = [...document.querySelectorAll('img, picture, svg:not([aria-hidden="true"]), video')];
    const assetArea = assets.reduce((a, el) => a + area(el.getBoundingClientRect()), 0);
    const largest = Math.max(0, ...assets.map((el) => area(el.getBoundingClientRect())));

    const strokeOnly = [...document.querySelectorAll('svg:not([aria-hidden="true"])')]
      .filter((s) => {
        const kids = [...s.querySelectorAll('*')];
        return kids.length > 0 && kids.every((k) => {
          const cs = getComputedStyle(k);
          return cs.fill === 'none' || cs.fill === 'rgba(0, 0, 0, 0)' || parseFloat(cs.fillOpacity) < 0.4;
        });
      }).length;

    // Heading text as a share of the first screen: how much of it is big type.
    const heroText = [...document.querySelectorAll('h1, h2')]
      .filter((el) => parseFloat(getComputedStyle(el).fontSize) >= 24)
      .reduce((a, el) => a + area(el.getBoundingClientRect()), 0);

    // Columns in the first screen: distinct left edges of large blocks.
    const edges = new Set(all
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.top < H && r.width > 200 && r.height > 120)
      .map((r) => Math.round(r.left / 40) * 40));

    return {
      groundRgb: rgb(paintedGround),
      ground: paintedGround,
      luminance: Number(lum(paintedGround).toFixed(3)),
      displayFamily: (h1 ? getComputedStyle(h1).fontFamily : body.fontFamily)
        .split(',')[0].replace(/["']/g, '').trim(),
      assetShare: Number((assetArea / (W * H) * 100).toFixed(2)),
      rasterImages: document.querySelectorAll('img[src]:not([src$=".svg"]), picture, video').length,
      strokeOnlySvgs: strokeOnly,
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
      firstScreen: {
        hasTable: !!document.querySelector('table'),
        columns: edges.size,
        heroTextShare: Number((heroText / (W * H) * 100).toFixed(1)),
        largestAssetShare: Number((largest / (W * H) * 100).toFixed(2)),
      },
    };
  });
}

/* ── run ───────────────────────────────────────────────────────────────── */

const args = process.argv.slice(2);
const urls = args.filter((a) => !a.startsWith('--') && /^https?:/.test(a));
const labelIdx = args.indexOf('--labels');
const labels = labelIdx >= 0 ? args[labelIdx + 1].split(',') : urls.map((u, i) => `site ${i + 1}`);
const outIdx = args.indexOf('--out');
const out = outIdx >= 0 ? args[outIdx + 1] : null;

if (urls.length < 2) {
  console.error('usage: portfolio-diversity.mjs <url> <url> [<url>…] [--labels a,b,c] [--out DIR]');
  process.exit(2);
}

const pw = await loadPlaywright();
const chromium = pw.chromium ?? pw.default?.chromium;
const browser = await chromium.launch();
const sites = [];
for (const [i, url] of urls.entries()) {
  /* Default colour scheme, deliberately: this is the portfolio a viewer sees. */
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  sites.push({ label: labels[i] ?? url, url, m: await measure(page) });
  await page.close();
}
await browser.close();

const v = compare(sites);

console.log('\n  portfolio diversity — measured in the browser default colour scheme\n');
console.log(`  ${'site'.padEnd(16)} ${'ground'.padEnd(20)} lum    display               assets  mono  hair  layout`);
for (const s of sites) {
  console.log(`  ${s.label.padEnd(16)} ${s.m.ground.padEnd(20)} ${String(s.m.luminance).padEnd(6)} ` +
    `${s.m.displayFamily.slice(0, 20).padEnd(21)} ${String(s.m.assetShare + '%').padEnd(7)} ` +
    `${String(s.m.monoCaps).padStart(4)} ${String(s.m.hairlines).padStart(5)}  ${layoutSignature(s.m)}`);
}
console.log('');
for (const p of v.problems) console.log(`  FAIL  ${p}`);
for (const n of v.notes) console.log(`  note  ${n}`);

if (out) {
  await mkdir(out, { recursive: true });
  await writeFile(join(out, 'portfolio.json'),
    JSON.stringify({ sites, verdict: v }, null, 2) + '\n');
}

console.log(`\n  ${v.pass ? 'PASS — these read as different sites' : `FAIL — ${v.problems.length} way(s) in which they are one site`}\n`);
process.exit(v.pass ? 0 : 1);
