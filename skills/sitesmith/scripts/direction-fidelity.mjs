#!/usr/bin/env node
/**
 * Does the finished site render the direction it says it chose? Original work, MIT.
 *
 *   node scripts/direction-fidelity.mjs <DIRECTION.md> <url> [--out DIR]
 *
 * direction-check.mjs asks whether three *comps* were different. This asks the question that
 * comes after, and the one that actually decides what a visitor sees: the site was built, so
 * does it look like the direction that won?
 *
 * The failure it was written for is not hypothetical. Two pilots declared "near-black ground,
 * bell metal" and "near-black ground, one amber", put the dark palette in the CSS default and
 * the light one behind `prefers-color-scheme: light` — and Chromium's default is light. Both
 * rendered as off-white editorial pages at luminance 0.82 and 0.85. The declared direction was
 * real, the built site did not have it, and every gate in the repository passed.
 *
 * So this measures the DEFAULT render, with no colour-scheme override, because that is what a
 * screenshot shows and what a blind reviewer scores. A direction that only exists in the
 * non-default scheme is a direction most viewers never see.
 */

import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import {
  AXES, GRAMMAR, directionRecordProblems, grammarParts, parseDirectionRecord,
} from './direction-record.mjs';

const requireFromCwd = createRequire(join(process.cwd(), 'package.json'));
async function loadPlaywright() {
  try { return await import('playwright'); }
  catch { return await import(pathToFileURL(requireFromCwd.resolve('playwright')).href); }
}

export { GRAMMAR };

/* ── what a declared value commits the page to ─────────────────────────── */

export const groundExpectation = (colour) => {
  const c = String(colour).toLowerCase();
  if (/\b(dark|near-black|black|ink ground|inverted)\b/.test(c)) return { want: 'dark', max: 0.25 };
  if (/\b(light|paper|white|limewash|off-white|buff|cream|stone|grey ground)\b/.test(c)) {
    return { want: 'light', min: 0.55 };
  }
  return null;
};

export const familyClass = (stack) => {
  const s = String(stack).toLowerCase();
  if (/mono/.test(s)) return 'mono';
  if (/serif/.test(s) && !/sans-serif/.test(s)) return 'serif';
  if (/(georgia|palatino|iowan|optima|garamond|times|book antiqua)/.test(s)) return 'serif';
  if (/(narrow|condensed)/.test(s)) return 'condensed';
  return 'sans';
};

export const typeExpectation = (type) => {
  // The axis usually names two faces — "wide cast capitals over a system sans" — and the
  // measurement is of the display face. Read the clause before "over".
  const t = String(type).toLowerCase().split(/\bover\b/)[0];
  if (/\b(serif|inscription|palatino|iowan|optima)\b/.test(t) && !/sans/.test(t)) return 'serif';
  if (/\bcondensed\b/.test(t)) return 'condensed';
  if (/\bmono(space)?\b/.test(t) && /throughout|only|entirely/.test(t)) return 'mono';
  return 'sans';
};

/** How much of the first screen the imagery must actually occupy. A direction that calls
 *  itself object-led and renders a 40px icon is not object-led. */
export const imageryExpectation = (imagery) => {
  const i = String(imagery).toLowerCase();
  if (/\b(imageless|no imagery|figures only|type[- ]only|typographic)\b/.test(i)) {
    return { kind: 'imageless', maxShare: 2 };
  }
  if (/\b(photograph|full[- ]bleed|photography-led)\b/.test(i)) return { kind: 'photographic', minShare: 22 };
  if (/\bobject-led\b/.test(i) || /\bplate scale\b/.test(i) || /full[- ]?(column )?height\b/.test(i)) {
    return { kind: 'object-led', minShare: 12 };
  }
  if (/\bdiagram-led\b/.test(i) || /\bdrawings?\b/.test(i) || /\bsilhouettes?\b/.test(i)) {
    return { kind: 'diagram-led', minShare: 4 };
  }
  return null;
};

export const rhythmExpectation = (rhythm) => {
  const r = String(rhythm).toLowerCase();
  if (/\balternating bands?\b/.test(r) || /\bbanded\b/.test(r)) return { want: 'bands', minBands: 3 };
  if (/\bone continuous field\b/.test(r) || /\bcontinuous\b/.test(r)) return { want: 'continuous', maxBands: 2 };
  if (/\bcard grid\b/.test(r) || /\bcards\b/.test(r)) return { want: 'cards', minCards: 3 };
  return null;
};

/** The four micro-grammar fields are open prose, but promises with a measurable meaning are
 * enforced. Unclassifiable values remain visible as notes instead of being guessed. */
export const surfaceExpectation = (surface) => {
  const s = String(grammarParts(surface)?.treatment ?? surface).toLowerCase();
  if (/\b(hairline|thin rules?|ruled)\b/.test(s)) return { want: 'hairlines', min: 8 };
  if (/\b(open|whitespace|borderless|rule[- ]free|no repeated rules?)\b/.test(s)) return { want: 'open', max: 12 };
  if (/\b(framed|heavy frame|thick border|block border)\b/.test(s)) return { want: 'frames', min: 4 };
  if (/\b(colou?r fields?|alternating grounds?|bands?)\b/.test(s)) return { want: 'bands', min: 3 };
  return null;
};

export const labelExpectation = (labels) => {
  const s = String(grammarParts(labels)?.treatment ?? labels).toLowerCase();
  if (/\bmono(space)?\b/.test(s) && /\b(uppercase|caps|all-caps)\b/.test(s)) return { want: 'mono-caps', min: 4 };
  if (/\b(sentence case|mixed case|body case|no uppercase|not uppercase)\b/.test(s)) return { want: 'not-mono-caps', max: 3 };
  return null;
};

export const figureExpectation = (figures) => {
  const s = String(grammarParts(figures)?.treatment ?? figures).toLowerCase();
  if (/\btabular\b/.test(s) && /\b(motif|display|visual language)\b/.test(s)) return { want: 'tabular-motif', min: 3 };
  if (/\b(absent|proportional|no numeric motif|not a motif)\b/.test(s)) return { want: 'not-tabular-motif', max: 2 };
  if (/\bfunctional\b/.test(s) && /\btabular\b/.test(s)) return { want: 'functional-tabular' };
  return null;
};

export const depthExpectation = (depth) => {
  const s = String(grammarParts(depth)?.treatment ?? depth).toLowerCase();
  if (/\b(flat|no elevation|no shadows?|zero elevation)\b/.test(s)) return { want: 'flat', max: 0 };
  if (/\b(elevated|shadowed|raised|floating|inset)\b/.test(s)) return { want: 'elevated', min: 1 };
  return null;
};

/* ── DIRECTION.md ──────────────────────────────────────────────────────── */

export function parseDirection(md) {
  const { version, axes, grammar } = parseDirectionRecord(md);
  const sig = md.match(/^\s*[-*]?\s*signature-selector\s*:\s*(.+?)\s*$/im);
  const share = md.match(/^\s*[-*]?\s*signature-min-share\s*:\s*([\d.]+)\s*$/im);
  const dial = (name) => {
    const match = md.match(new RegExp(`^\\s*[-*]?\\s*${name}\\s*:\\s*(.+?)\\s*$`, 'im'));
    if (!match) return null;
    const value = Number(match[1]);
    return Number.isInteger(value) ? value : match[1].trim();
  };
  return {
    version,
    axes,
    grammar,
    dials: {
      visualDensity: dial('visual-density'),
      motionIntensity: dial('motion-intensity'),
      aestheticBoldness: dial('aesthetic-boldness'),
    },
    signature: sig?.[1]?.trim() ?? null,
    signatureMinShare: share ? Number(share[1]) : 6,
  };
}

/** Validate only the document contract. Historical directions remain readable. Version 2.2
 * added the three dials; 2.3 adds the four micro-grammar decisions. */
export function directionContractProblems(dir) {
  const problems = directionRecordProblems(dir).map((problem) =>
    problem.startsWith('direction record is missing:')
      ? `the axis record is missing or not in the documented form: no ${problem.split(': ')[1]}`
      : problem);
  if ((dir.version ?? 0) >= 2.2) {
    const dials = [
      ['visual-density', dir.dials?.visualDensity],
      ['motion-intensity', dir.dials?.motionIntensity],
      ['aesthetic-boldness', dir.dials?.aestheticBoldness],
    ];
    for (const [name, value] of dials) {
      if (!Number.isInteger(value) || value < 1 || value > 10) {
        problems.push(`${name} must be an integer between 1 and 10`);
      }
    }
  }
  return problems;
}

/* ── measure ───────────────────────────────────────────────────────────── */

async function measure(page, width, height) {
  return page.evaluate(({ W, H }) => {
    const lum = (rgb) => {
      const [r, g, b] = (rgb.match(/\d+/g) ?? [255, 255, 255]).map(Number)
        .map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const inFirst = (r) => Math.max(0, Math.min(r.bottom, H) - Math.max(r.top, 0)) *
                           Math.max(0, Math.min(r.right, W) - Math.max(r.left, 0));

    const body = getComputedStyle(document.body);
    const h1 = document.querySelector('h1');
    const display = h1 ? getComputedStyle(h1).fontFamily : body.fontFamily;

    // Imagery: every non-decorative asset element, by the area it actually occupies on the
    // first screen. Pixels, not intentions.
    const assets = [...document.querySelectorAll('img, picture, svg:not([aria-hidden="true"]), video')];
    const assetArea = assets.reduce((a, el) => a + inFirst(el.getBoundingClientRect()), 0);
    const largest = assets.reduce((best, el) => {
      const a = inFirst(el.getBoundingClientRect());
      return a > best.a ? { a, tag: el.tagName.toLowerCase() } : best;
    }, { a: 0, tag: null });

    // Rhythm: distinct painted section grounds down the page.
    const bands = [...document.querySelectorAll('body > *, main > *, .wrap > *, .sheet > *')]
      .map((el) => getComputedStyle(el).backgroundColor)
      .filter((c) => c && c !== 'rgba(0, 0, 0, 0)');
    const cards = [...document.querySelectorAll('body *')].filter((el) => {
      const s = getComputedStyle(el);
      return parseFloat(s.borderTopLeftRadius) >= 4 &&
             (s.backgroundColor !== 'rgba(0, 0, 0, 0)' || s.boxShadow !== 'none') &&
             el.getBoundingClientRect().height > 60;
    }).length;

    // What sits in the first screen, and where.
    const firstScreen = [...document.querySelectorAll('body *')]
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter(({ r }) => r.top < H && r.bottom > 0 && r.width > 40 && r.height > 20);
    const table = document.querySelector('table');
    const tableShare = table ? inFirst(table.getBoundingClientRect()) / (W * H) * 100 : 0;

    return {
      ground: body.backgroundColor,
      luminance: Number(lum(body.backgroundColor).toFixed(3)),
      displayFamily: display.split(',')[0].replace(/["']/g, '').trim(),
      displayStack: display,
      assetShare: Number((assetArea / (W * H) * 100).toFixed(2)),
      largestAssetShare: Number((largest.a / (W * H) * 100).toFixed(2)),
      assetCount: assets.length,
      bands: [...new Set(bands)].length,
      cards,
      tableShare: Number(tableShare.toFixed(1)),
      firstScreenElements: firstScreen.length,
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
      heavyBorders: [...document.querySelectorAll('body *')].reduce((n, el) => {
        const s = getComputedStyle(el);
        return n + ['Top', 'Bottom', 'Left', 'Right'].filter((side) =>
          parseFloat(s[`border${side}Width`]) >= 2).length;
      }, 0),
      tabularNums: [...document.querySelectorAll('body *')]
        .filter((el) => /tabular-nums/.test(getComputedStyle(el).fontVariantNumeric)).length,
      shadowed: [...document.querySelectorAll('body *')]
        .filter((el) => getComputedStyle(el).boxShadow !== 'none').length,
    };
  }, { W: width, H: height });
}

/* ── judge ─────────────────────────────────────────────────────────────── */

export function judge(dir, m, sigShare) {
  const problems = [];
  const notes = [];

  /* Before judging the page, check that the document is readable. Two independent builders
     wrote considered directions as prose headings, the parser read every axis as undefined, and
     the gate failed their pages for "declaring undefined" — which reads as a design fault and
     is a formatting one. A builder following that signal changes the typeface of a page that
     was never wrong. Say what is actually the matter. */
  const contractProblems = directionContractProblems(dir);
  if (contractProblems.length) {
    problems.push(`${contractProblems.join('; ')}. ` +
      'It is five macro-axis lines plus four grammar lines, each "- <field>: <value>" — see ' +
      'v2/20-direction-lab.md, "The axis record, verbatim". Prose headings such as ' +
      '"- **Type and scale.** …" do not parse, and ' +
      'nothing below this line is a judgement about the page.');
    return { pass: false, problems, notes, m, sigShare, unreadable: true };
  }

  const g = groundExpectation(dir.axes.colour ?? '');
  if (!g) notes.push('the colour axis does not state a ground, so it cannot be checked');
  else if (g.want === 'dark' && m.luminance > g.max) {
    problems.push(`ground: declares "${dir.axes.colour}" and the default render is ` +
      `${m.ground} at luminance ${m.luminance}. A direction that only exists in the ` +
      `non-default colour scheme is one most viewers never see.`);
  } else if (g.want === 'light' && m.luminance < g.min) {
    problems.push(`ground: declares "${dir.axes.colour}" and renders ${m.ground} ` +
      `at luminance ${m.luminance}`);
  }

  const wantFamily = typeExpectation(dir.axes.type ?? '');
  const gotFamily = familyClass(m.displayStack);
  if (wantFamily !== gotFamily) {
    problems.push(`type: declares "${dir.axes.type}" (${wantFamily}) and the display face ` +
      `renders as ${gotFamily} — ${m.displayFamily}`);
  }

  const img = imageryExpectation(dir.axes.imagery ?? '');
  if (!img) notes.push('the imagery axis is not classifiable, so dominance cannot be checked');
  else if (img.kind === 'imageless' && m.assetShare > img.maxShare) {
    problems.push(`imagery: declares "${dir.axes.imagery}" and assets occupy ` +
      `${m.assetShare}% of the first screen`);
  } else if (img.minShare && m.assetShare < img.minShare) {
    problems.push(`imagery: declares "${dir.axes.imagery}" (${img.kind}, needs ` +
      `≥${img.minShare}% of the first screen) and assets occupy ${m.assetShare}%. ` +
      `Largest single asset: ${m.largestAssetShare}%.`);
  }

  const r = rhythmExpectation(dir.axes.rhythm ?? '');
  if (!r) notes.push('the rhythm axis is not classifiable');
  else if (r.want === 'bands' && m.bands < r.minBands) {
    problems.push(`rhythm: declares "${dir.axes.rhythm}" and renders ${m.bands} distinct band(s)`);
  } else if (r.want === 'continuous' && m.bands > r.maxBands) {
    problems.push(`rhythm: declares "${dir.axes.rhythm}" and renders ${m.bands} distinct grounds`);
  } else if (r.want === 'cards' && m.cards < r.minCards) {
    problems.push(`rhythm: declares "${dir.axes.rhythm}" and renders ${m.cards} card-like blocks`);
  }

  const surface = surfaceExpectation(dir.grammar?.surface ?? '');
  if (!surface) notes.push('the surface grammar is not mechanically classifiable');
  else if (surface.want === 'hairlines' && m.hairlines < surface.min) {
    problems.push(`surface: declares "${dir.grammar.surface}" and renders ${m.hairlines} hairline edge(s)`);
  } else if (surface.want === 'open' && m.hairlines > surface.max) {
    problems.push(`surface: declares "${dir.grammar.surface}" and renders ${m.hairlines} hairline edge(s)`);
  } else if (surface.want === 'frames' && m.heavyBorders < surface.min) {
    problems.push(`surface: declares "${dir.grammar.surface}" and renders ${m.heavyBorders} heavy frame edge(s)`);
  } else if (surface.want === 'bands' && m.bands < surface.min) {
    problems.push(`surface: declares "${dir.grammar.surface}" and renders ${m.bands} distinct ground(s)`);
  }

  const labels = labelExpectation(dir.grammar?.labels ?? '');
  if (!labels) notes.push('the label grammar is not mechanically classifiable');
  else if (labels.want === 'mono-caps' && m.monoCaps < labels.min) {
    problems.push(`labels: declares "${dir.grammar.labels}" and renders ${m.monoCaps} uppercase mono label(s)`);
  } else if (labels.want === 'not-mono-caps' && m.monoCaps > labels.max) {
    problems.push(`labels: declares "${dir.grammar.labels}" and renders ${m.monoCaps} uppercase mono label(s)`);
  }

  const figures = figureExpectation(dir.grammar?.figures ?? '');
  if (!figures) notes.push('the figure grammar is not mechanically classifiable');
  else if (figures.want === 'tabular-motif' && m.tabularNums < figures.min) {
    problems.push(`figures: declares "${dir.grammar.figures}" and renders ${m.tabularNums} tabular-number element(s)`);
  } else if (figures.want === 'not-tabular-motif' && m.tabularNums > figures.max) {
    problems.push(`figures: declares "${dir.grammar.figures}" and renders ${m.tabularNums} tabular-number element(s)`);
  }

  const depth = depthExpectation(dir.grammar?.depth ?? '');
  if (!depth) notes.push('the depth grammar is not mechanically classifiable');
  else if (depth.want === 'flat' && m.shadowed > depth.max) {
    problems.push(`depth: declares "${dir.grammar.depth}" and renders ${m.shadowed} shadowed element(s)`);
  } else if (depth.want === 'elevated' && m.shadowed < depth.min) {
    problems.push(`depth: declares "${dir.grammar.depth}" and renders no elevation`);
  }

  if (!dir.signature) {
    problems.push('DIRECTION.md names no `signature-selector`. The signature is the one thing ' +
      'a visitor would recognise on a second page, so it has to be a thing on the page.');
  } else if (sigShare === null) {
    problems.push(`signature: nothing matches \`${dir.signature}\` in the rendered page`);
  } else if (sigShare < dir.signatureMinShare) {
    problems.push(`signature: \`${dir.signature}\` occupies ${sigShare}% of the first screen, ` +
      `under the ${dir.signatureMinShare}% this direction claims for it`);
  }

  return { pass: problems.length === 0, problems, notes };
}

/* ── run ───────────────────────────────────────────────────────────────────
   Only when this file is what was invoked. Every function above is exported so the axis
   contract can be tested directly against the documentation, and without this guard the
   import printed a usage line and exited 2 before the test could ask a single question. */

const invokedDirectly = process.argv[1] &&
  pathToFileURL(process.argv[1]).href === import.meta.url;

const args = process.argv.slice(2);
const [dirPath, url] = args.filter((a) => !a.startsWith('--'));
const outIdx = args.indexOf('--out');
const out = outIdx >= 0 ? args[outIdx + 1] : null;

if (!invokedDirectly) {
  // Imported as a library. The parser and the expectations are the API; the CLI is not.
} else {

if (!dirPath || !url) {
  console.error('usage: direction-fidelity.mjs <DIRECTION.md> <url> [--out DIR]');
  process.exit(2);
}

const dir = parseDirection(await readFile(dirPath, 'utf8'));

/* Read the document before opening a browser. An unreadable axis record is a fact about the
   file, and launching Chromium to discover it wastes a minute and then reports a page defect
   that is not one. */
{
  const contractProblems = directionContractProblems(dir);
  if (contractProblems.length) {
    console.log('\n  direction fidelity\n');
    for (const problem of contractProblems) console.log(`  FAIL  ${problem}.`);
    console.log('        It is five macro-axis lines plus four grammar lines — see v2/20-direction-lab.md,');
    console.log('        "The axis record, verbatim". Prose headings such as "- **Type and scale.** …"');
    console.log('        do not parse, and nothing here is a judgement about the page.\n');
    process.exit(1);
  }
}

const pw = await loadPlaywright();
const chromium = pw.chromium ?? pw.default?.chromium;
const browser = await chromium.launch();

/* No colorScheme option: the browser default is what a screenshot and a reviewer get. */
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
const m = await measure(page, 1440, 900);

let sigShare = null;
if (dir.signature) {
  sigShare = await page.evaluate((sel) => {
    const els = [...document.querySelectorAll(sel)];
    if (!els.length) return null;
    const area = els.reduce((a, el) => {
      const r = el.getBoundingClientRect();
      return a + Math.max(0, Math.min(r.bottom, 900) - Math.max(r.top, 0)) *
                 Math.max(0, Math.min(r.right, 1440) - Math.max(r.left, 0));
    }, 0);
    return Number((area / (1440 * 900) * 100).toFixed(2));
  }, dir.signature).catch(() => null);
}

if (out) {
  await mkdir(out, { recursive: true });
  await page.screenshot({ path: join(out, 'default-scheme-1440.png') });
  await writeFile(join(out, 'measured.json'), JSON.stringify({ url, ...m, sigShare }, null, 2) + '\n');
}
await browser.close();

const v = judge(dir, m, sigShare);

console.log(`\n  direction fidelity — ${url}`);
console.log(`  measured in the browser's default colour scheme, which is what a reviewer sees\n`);
for (const a of AXES) console.log(`    ${a.padEnd(12)} ${dir.axes[a] ?? '—'}`);
for (const field of GRAMMAR) console.log(`    ${field.padEnd(12)} ${dir.grammar[field] ?? '—'}`);
console.log(`    ${'signature'.padEnd(12)} ${dir.signature ?? '— none declared —'}` +
  (sigShare !== null ? ` (${sigShare}% of the first screen)` : ''));
console.log(`\n    ground        ${m.ground}  luminance ${m.luminance}`);
console.log(`    display       ${m.displayFamily}`);
console.log(`    assets        ${m.assetShare}% of the first screen, largest ${m.largestAssetShare}%, ${m.assetCount} element(s)`);
console.log(`    rhythm        ${m.bands} distinct ground(s), ${m.cards} card-like block(s)`);
console.log(`    devices       mono caps ${m.monoCaps}, hairlines ${m.hairlines}, ` +
  `heavy edges ${m.heavyBorders}, tabular ${m.tabularNums}, shadowed ${m.shadowed}`);

console.log('');
for (const p of v.problems) console.log(`  FAIL  ${p}`);
for (const n of v.notes) console.log(`  note  ${n}`);
console.log(`\n  ${v.pass ? 'PASS — the site renders the direction it chose' : `FAIL — ${v.problems.length} axis/axes not delivered`}\n`);
process.exit(v.pass ? 0 : 1);

} // end: invoked directly
