#!/usr/bin/env node
/**
 * sitesmith verify: renders a page and reports what a diff cannot show.
 *
 *   node verify.mjs <url> [--out DIR] [--widths 375,768,1440] [--no-axe] [--json]
 *                         [--font-stress]
 *
 * Captures a full-page screenshot at each width, collects console errors and failed
 * network requests, checks every same-origin link for a dead target, runs an axe
 * accessibility scan in both colour schemes, renders one more pass with
 * prefers-reduced-motion set, and measures the floor items that axe does not cover.
 *
 * Exit 0 clean · 1 blocking defect found (bad HTTP status, console error, broken link,
 * serious axe violation, horizontal overflow, motion that survives the reduced-motion
 * preference, or a check whose verdict is missing) · 2 could not run (bad arguments,
 * missing dependency, server unreachable).
 *
 * This script measures. It does not choose. Nothing here ranks a palette, suggests a
 * radius or prefers a typeface: it counts what is on screen and hands the count to the
 * reader. Where a number appears in a threshold it comes from SKILL.md section 8 or from
 * WCAG, never from taste.
 *
 * Requires: npm i -D playwright @axe-core/playwright && npx playwright install chromium
 * MIT, part of https://github.com/byensitmagnus/sitesmith
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

/**
 * Playwright lives in the project being tested, not next to this script. Try the
 * normal specifier first, then resolve from the working directory.
 */
const requireFromCwd = createRequire(join(process.cwd(), 'package.json'));
async function load(name) {
  try {
    return await import(name);
  } catch {
    return await import(pathToFileURL(requireFromCwd.resolve(name)).href);
  }
}

const USAGE =
  'usage: node verify.mjs <url> [--out DIR] [--widths 375,768,1440] [--no-axe] [--json] [--font-stress]';

/**
 * --font-stress substitutes a deliberately wide font pair before measuring.
 *
 * A layout that fits only under the developer's system font is not responsive, it
 * is lucky, and the luck runs out on the first machine with a wider default. This
 * repository has now paid for that twice: +10px on a dashboard and +20px on the
 * block library, both green locally and red on the Linux runner, both invisible to
 * an element-by-element scan because the text spills while every box still fits.
 * Running the check locally is the difference between a class of bug and a bug.
 */
const STRESS_CSS = `
  *{font-family:'DejaVu Sans',Verdana,Tahoma,sans-serif !important}
  code,pre,kbd,samp,tt{font-family:'DejaVu Sans Mono','Liberation Mono',monospace !important}
`;

/** Floor numbers from SKILL.md section 8. Quoted, never invented here. */
const TOUCH_MIN_PX = 44;
const TOUCH_GAP_PX = 24;
const INDICATOR_CONTRAST = 3;
/** Placement threshold: a transform or opacity transition longer than this survives the preference. */
const REDUCED_MOTION_MAX_MS = 100;
/** The reduced-motion pass renders at the desktop width so a lazy clip has room to be requested. */
const REDUCED_MOTION_WIDTH = 1440;

const argv = process.argv.slice(2);
// Flags that consume the next argument. Anything else starting with -- is a switch,
// so the token after it is still a candidate for the URL.
const VALUE_FLAGS = new Set(['out', 'widths']);
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};
const has = (name) => argv.includes(`--${name}`);

let url;
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--')) {
    if (VALUE_FLAGS.has(argv[i].slice(2))) i++; // skip the flag's value
    continue;
  }
  url = argv[i];
  break;
}
if (!url) {
  console.error(USAGE);
  process.exit(2);
}
try {
  new URL(url);
} catch {
  console.error(`not a valid URL: ${url}\n${USAGE}`);
  process.exit(2);
}

const outDir = resolve(flag('out', '.sitesmith/shots'));
const widths = flag('widths', '375,768,1440')
  .split(',')
  .map((n) => parseInt(n.trim(), 10));
if (!widths.length || widths.some((n) => !Number.isFinite(n) || n < 200)) {
  console.error(`--widths must be a comma-separated list of pixel values >= 200\n${USAGE}`);
  process.exit(2);
}
const asJson = has('json');

let chromium, AxeBuilder;
try {
  // CommonJS resolved by file path exposes its exports under `default`.
  const pw = await load('playwright');
  chromium = pw.chromium ?? pw.default?.chromium;
  if (!chromium) throw new Error('playwright loaded but exposes no chromium export');
} catch {
  console.error('playwright is not installed in this project.\n  npm i -D playwright && npx playwright install chromium');
  process.exit(2);
}
if (!has('no-axe')) {
  try {
    const ax = await load('@axe-core/playwright');
    AxeBuilder = ax.default?.default ?? ax.default ?? ax.AxeBuilder;
  } catch {
    console.error('note: @axe-core/playwright not installed, skipping accessibility scan');
  }
}

await mkdir(outDir, { recursive: true });

const report = {
  url,
  fontStress: has('font-stress'),
  widths: {},
  structure: [],
  consoleErrors: [],
  failedRequests: [],
  brokenLinks: [],
  axe: null,
  reducedMotion: null,
  // Measurements, not verdicts. run.md step 7 is where a human accepts or justifies each.
  measures: { perWidth: {}, focus: {} },
  // Every check that could not run, with the reason. Empty is the only clean value.
  notMeasured: [],
};

/* ------------------------------------------------------------------ *
 * Colour maths, used only to report the contrast of a focus indicator
 * against the surface it lands on. axe scores text, not outlines, so a
 * 1px grey ring on a grey card passes every scan and is invisible.
 * ------------------------------------------------------------------ */
function parseColour(s) {
  if (!s) return null;
  const m = String(s).match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
  if (parts.length < 3 || parts.slice(0, 3).some((n) => !Number.isFinite(n))) return null;
  return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 && Number.isFinite(parts[3]) ? parts[3] : 1 };
}
function over(fg, bg) {
  if (!fg) return null;
  if (fg.a >= 1 || !bg) return fg;
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  };
}
function luminance(c) {
  const ch = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(c.r) + 0.7152 * ch(c.g) + 0.0722 * ch(c.b);
}
function contrast(a, b) {
  const ca = parseColour(a);
  const cb = parseColour(b);
  if (!ca || !cb) return null;
  const fa = over(ca, cb);
  const l1 = luminance(fa);
  const l2 = luminance(cb);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return Number(((hi + 0.05) / (lo + 0.05)).toFixed(2));
}

/**
 * One helper bundle installed in the page, shared by every later evaluate. Defining
 * these twice is how the accessible-name rule and the duplicate-intent rule drift apart
 * and start disagreeing about what counts as a control.
 */
async function installProbes(page) {
  await page.evaluate(() => {
    const INTERACTIVE =
      'a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="button"], [role="link"], [contenteditable="true"], [tabindex]:not([tabindex="-1"])';

    const visible = (el) => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };

    const sel = (el) => {
      if (el.id) return `#${el.id}`;
      const parts = [];
      let n = el;
      for (let i = 0; n && n.nodeType === 1 && i < 3; i++) {
        let s = n.tagName.toLowerCase();
        if (n.classList.length) s += '.' + [...n.classList].slice(0, 2).join('.');
        parts.unshift(s);
        n = n.parentElement;
      }
      return parts.join(' > ');
    };

    // A deliberately plain accessible-name computation. It is not the full accname
    // algorithm and does not pretend to be: it exists to spot controls with no name at
    // all, which is the failure that reaches production.
    const nameOf = (el) => {
      const by = el.getAttribute('aria-labelledby');
      if (by) {
        const t = by
          .split(/\s+/)
          .map((id) => document.getElementById(id)?.textContent || '')
          .join(' ')
          .trim();
        if (t) return t;
      }
      const aria = el.getAttribute('aria-label');
      if (aria && aria.trim()) return aria.trim();
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)) {
        if (el.id) {
          const l = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
          if (l && l.textContent.trim()) return l.textContent.trim();
        }
        const wrap = el.closest('label');
        if (wrap && wrap.textContent.trim()) return wrap.textContent.trim();
        if (el.value && ['submit', 'button', 'reset'].includes(el.type)) return String(el.value).trim();
      }
      const txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (txt) return txt;
      const img = el.querySelector('img[alt]');
      if (img && img.alt.trim()) return img.alt.trim();
      const title = el.getAttribute('title');
      if (title && title.trim()) return title.trim();
      return '';
    };

    const surfaceOf = (start) => {
      let n = start;
      while (n && n.nodeType === 1) {
        const c = getComputedStyle(n).backgroundColor;
        if (c && !/^rgba\(0, 0, 0, 0\)$/.test(c) && c !== 'transparent') return c;
        n = n.parentElement;
      }
      return 'rgb(255, 255, 255)';
    };

    window.__ss = { INTERACTIVE, visible, sel, nameOf, surfaceOf };
  });
}

/**
 * The countable defects, reported per viewport as findings rather than as pass or fail.
 * Whether a wrapped button label or a third corner radius is wrong is a design question
 * and this script has no standing to answer it. It reports the count and the element.
 */
async function measureViewport(page) {
  return page.evaluate(
    ({ TOUCH_MIN_PX, TOUCH_GAP_PX }) => {
      const { INTERACTIVE, visible, sel, nameOf } = window.__ss;
      const controls = [...document.querySelectorAll(INTERACTIVE)].filter(visible).slice(0, 400);

      const describe = (el) => {
        const r = el.getBoundingClientRect();
        return {
          selector: sel(el),
          name: nameOf(el).slice(0, 60),
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      };

      // Label wrapping. Counted from the rendered line boxes, so it reflects this
      // viewport and this font, not the markup.
      const wrappedLabels = [];
      for (const el of controls) {
        const inlineOnly = [...el.children].every((c) =>
          ['inline', 'inline-block', 'contents', 'none'].includes(getComputedStyle(c).display),
        );
        if (!inlineOnly || !el.textContent.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(el);
        const tops = new Set();
        for (const rect of range.getClientRects()) if (rect.width > 0 && rect.height > 0) tops.add(Math.round(rect.top));
        if (tops.size > 1) wrappedLabels.push({ ...describe(el), lines: tops.size });
      }

      // Two controls carrying one intent. Same visible label, or same destination under
      // two labels. Both are reported; neither is called wrong.
      const byLabel = new Map();
      const byTarget = new Map();
      for (const el of controls) {
        const n = nameOf(el).toLowerCase().replace(/[^\p{L}\p{N} ]+/gu, '').replace(/\s+/g, ' ').trim();
        if (n) {
          if (!byLabel.has(n)) byLabel.set(n, []);
          byLabel.get(n).push(describe(el));
        }
        const href = el.getAttribute('href');
        if (href && !href.startsWith('#')) {
          if (!byTarget.has(href)) byTarget.set(href, []);
          byTarget.get(href).push(describe(el));
        }
      }
      const duplicateIntents = [];
      for (const [label, els] of byLabel) if (els.length > 1) duplicateIntents.push({ kind: 'same label', key: label, count: els.length, elements: els.slice(0, 4) });
      for (const [href, els] of byTarget) {
        if (els.length < 2) continue;
        const labels = new Set(els.map((e) => e.name.toLowerCase()));
        if (labels.size > 1) duplicateIntents.push({ kind: 'same target, different labels', key: href, count: els.length, elements: els.slice(0, 4) });
      }

      // Vocabulary counts. Reported only past two, because two is the point at which a
      // third value stops being a system and starts being an accident. The script does
      // not say which value to drop.
      const all = [...document.querySelectorAll('*')].slice(0, 4000).filter(visible);
      const radii = new Map();
      const families = new Map();
      for (const el of all) {
        const cs = getComputedStyle(el);
        const r = cs.borderTopLeftRadius;
        const hasBox =
          cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== 'none';
        if (r && r !== '0px' && hasBox && !radii.has(r)) radii.set(r, sel(el));
        const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (hasText) {
          const f = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
          if (f && !families.has(f)) families.set(f, sel(el));
        }
      }

      // Tap targets and the space between them. WCAG 2.2 target size, and the 44/24
      // pair named in SKILL.md section 8.
      const rects = controls.map((el) => ({ el, r: el.getBoundingClientRect() }));
      const smallTargets = [];
      for (const { el, r } of rects) {
        const min = Math.round(Math.min(r.width, r.height));
        if (min < TOUCH_MIN_PX) smallTargets.push({ ...describe(el), smallestSidePx: min });
      }
      const tightPairs = [];
      for (let i = 0; i < rects.length && tightPairs.length < 40; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          const a = rects[i].r;
          const b = rects[j].r;
          if (rects[i].el.contains(rects[j].el) || rects[j].el.contains(rects[i].el)) continue;
          const dx = Math.max(0, Math.max(a.left, b.left) - Math.min(a.right, b.right));
          const dy = Math.max(0, Math.max(a.top, b.top) - Math.min(a.bottom, b.bottom));
          if (dx === 0 && dy === 0) continue; // overlapping or nested, not an adjacency
          const gap = Math.round(Math.hypot(dx, dy));
          if (gap < TOUCH_GAP_PX) {
            tightPairs.push({ a: describe(rects[i].el), b: describe(rects[j].el), gapPx: gap });
            if (tightPairs.length >= 40) break;
          }
        }
      }

      const namelessControls = controls.filter((el) => !nameOf(el)).map(describe);

      return {
        controlCount: controls.length,
        wrappedLabels,
        duplicateIntents,
        radii: [...radii].map(([value, example]) => ({ value, example })),
        families: [...families].map(([value, example]) => ({ value, example })),
        smallTargets,
        tightPairs,
        namelessControls,
      };
    },
    { TOUCH_MIN_PX, TOUCH_GAP_PX },
  );
}

/**
 * Keyboard sweep. The indicator is read from a real Tab, not from a programmatic
 * focus() call, because focus() does not always match :focus-visible and a script that
 * checked the wrong pseudo-class would report indicators nobody can see.
 */
async function measureFocus(page) {
  await page.evaluate(() => {
    const { INTERACTIVE, visible } = window.__ss;
    const props = [
      'outlineStyle',
      'outlineWidth',
      'outlineColor',
      'outlineOffset',
      'boxShadow',
      'borderTopColor',
      'borderTopWidth',
      'backgroundColor',
      'color',
      'textDecorationLine',
      'filter',
    ];
    window.__ssFocus = { props, rest: [] };
    [...document.querySelectorAll(INTERACTIVE)]
      .filter(visible)
      .slice(0, 200)
      .forEach((el, i) => {
        el.setAttribute('data-ss-focus', String(i));
        const cs = getComputedStyle(el);
        const snap = {};
        for (const p of props) snap[p] = cs[p];
        window.__ssFocus.rest.push(snap);
      });
  });

  await page.evaluate(() => window.scrollTo(0, 0));
  const stops = [];
  const seen = new Set();
  for (let i = 0; i < 80; i++) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate(() => {
      const { sel, nameOf, surfaceOf } = window.__ss;
      const el = document.activeElement;
      if (!el || el === document.body || el === document.documentElement) return null;
      const idx = el.getAttribute('data-ss-focus');
      const cs = getComputedStyle(el);
      const now = {};
      for (const p of window.__ssFocus.props) now[p] = cs[p];
      const rest = idx === null ? null : window.__ssFocus.rest[Number(idx)];
      const changed = rest ? window.__ssFocus.props.filter((p) => rest[p] !== now[p]) : null;

      // "Something in the computed style changed" is not the same as "the reader can see
      // it". Chromium's own :focus-visible rule moves outline-offset even on an element
      // whose outline the page has set to none, and an earlier version of this sweep
      // counted that as an indicator and cleared the benchmark control group. A change
      // only counts when it can put pixels on the screen.
      const outlinePaints = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
      const outlineIsNew =
        outlinePaints &&
        rest &&
        (rest.outlineStyle === 'none' || rest.outlineWidth !== now.outlineWidth || rest.outlineColor !== now.outlineColor);
      const PAINTS = ['boxShadow', 'borderTopColor', 'borderTopWidth', 'backgroundColor', 'color', 'textDecorationLine', 'filter'];
      const paintChanged = changed ? changed.filter((p) => PAINTS.includes(p) && !(p === 'boxShadow' && now.boxShadow === 'none')) : null;
      const visibleChange = changed === null ? null : Boolean(outlineIsNew || paintChanged.length);

      let indicator = null;
      if (outlineIsNew) indicator = cs.outlineColor;
      else if (paintChanged && paintChanged.includes('boxShadow')) indicator = (now.boxShadow.match(/rgba?\([^)]*\)/) || [])[0] || null;
      else if (paintChanged && paintChanged.includes('backgroundColor')) indicator = now.backgroundColor;
      else if (paintChanged && paintChanged.includes('borderTopColor')) indicator = now.borderTopColor;
      return {
        idx,
        selector: sel(el),
        name: nameOf(el).slice(0, 60),
        changed,
        paintChanged,
        visibleChange,
        indicator,
        surface: surfaceOf(el.parentElement || el),
        focusVisible: el.matches(':focus-visible'),
      };
    });
    if (!stop) break; // tab order left the document, so the sweep is complete
    if (stop.idx !== null && seen.has(stop.idx)) break;
    if (stop.idx !== null) seen.add(stop.idx);
    stops.push(stop);
  }

  await page.evaluate(() => {
    for (const el of document.querySelectorAll('[data-ss-focus]')) el.removeAttribute('data-ss-focus');
  });

  const noIndicator = [];
  const weakIndicator = [];
  for (const s of stops) {
    if (s.visibleChange === false) {
      noIndicator.push({
        selector: s.selector,
        name: s.name,
        measurement: s.changed.length
          ? `only ${s.changed.join(', ')} changed on Tab, none of which paints`
          : 'no computed style changed on Tab',
      });
      continue;
    }
    if (!s.indicator) continue;
    const ratio = contrast(s.indicator, s.surface);
    if (ratio !== null && ratio < INDICATOR_CONTRAST) {
      weakIndicator.push({ selector: s.selector, name: s.name, contrast: ratio, indicator: s.indicator, surface: s.surface });
    }
  }
  return { stops: stops.length, noIndicator, weakIndicator };
}

/**
 * The reduced-motion pass.
 *
 * The preference is set on the context, so it is in force before the first byte of the
 * navigation. That ordering is the whole point: a page that downloads the clip and then
 * hides it has honoured the paint and not the preference, and the reader on a metered
 * connection or a vestibular disorder still paid for it. Setting the preference after
 * load would measure only the paint and would report that page as clean.
 */
async function reducedMotionPass(browser) {
  const context = await browser.newContext({
    viewport: { width: REDUCED_MOTION_WIDTH, height: Math.round(REDUCED_MOTION_WIDTH * 1.9) },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  try {
    const page = await context.newPage();
    const requests = [];
    page.on('request', (r) => requests.push({ url: r.url(), type: r.resourceType() }));
    const consoleErrors = [];
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 300));
    });

    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    if (has('font-stress')) await page.addStyleTag({ content: STRESS_CSS });
    await page.waitForTimeout(600); // the same settle the other passes use

    const shot = `${outDir}/reduced-motion-${REDUCED_MOTION_WIDTH}.png`;
    await page.screenshot({ path: shot, fullPage: true });

    const MOTION_FILE = /\.(gif|apng|mp4|m4v|webm|mov|ogv)(\?|#|$)/i;
    const LOTTIE = /lottie/i;
    const motionRequests = requests
      .filter((r) => r.type === 'media' || MOTION_FILE.test(r.url) || LOTTIE.test(r.url))
      .map((r) => ({
        url: r.url.slice(0, 200),
        why: r.type === 'media' ? 'media resource request' : LOTTIE.test(r.url) ? 'lottie payload' : 'animation file extension',
      }));

    await installProbes(page);
    const inPage = await page.evaluate(
      ({ maxMs }) => {
        const { sel } = window.__ss;
        const running = document
          .getAnimations()
          .filter((a) => a.playState === 'running')
          .slice(0, 30)
          .map((a) => {
            const target = a.effect && a.effect.target ? sel(a.effect.target) : '(no target)';
            const timing = a.effect ? a.effect.getComputedTiming() : {};
            return {
              selector: target,
              kind: a.constructor.name,
              name: a.animationName || a.transitionProperty || '(unnamed)',
              durationMs: Math.round(Number(timing.duration) || 0),
              iterations: timing.iterations === Infinity ? 'infinite' : timing.iterations,
            };
          });

        // getAnimations only sees what is playing right now. A transform transition that
        // fires on hover is declared, not running, and would be missed. Read the
        // declaration too.
        const declared = [];
        for (const el of [...document.querySelectorAll('*')].slice(0, 4000)) {
          const cs = getComputedStyle(el);
          const props = cs.transitionProperty.split(',').map((s) => s.trim());
          const durs = cs.transitionDuration.split(',').map((s) => {
            const n = parseFloat(s);
            return Number.isFinite(n) ? (s.includes('ms') ? n : n * 1000) : 0;
          });
          props.forEach((p, i) => {
            const ms = durs[i % durs.length] || 0;
            if (ms > maxMs && ['transform', 'opacity', 'all'].includes(p)) {
              if (declared.length < 20) declared.push({ selector: sel(el), property: p, ms: Math.round(ms) });
            }
          });
        }
        return { running, declared };
      },
      { maxMs: REDUCED_MOTION_MAX_MS },
    );

    return {
      width: REDUCED_MOTION_WIDTH,
      screenshot: `reduced-motion-${REDUCED_MOTION_WIDTH}.png`,
      status: response?.status() ?? null,
      requestCount: requests.length,
      motionRequests,
      runningAnimations: inPage.running,
      longTransitions: inPage.declared,
      consoleErrors,
    };
  } finally {
    await context.close();
  }
}

const browser = await chromium.launch();
try {
  for (const width of widths) {
    const context = await browser.newContext({
      viewport: { width, height: Math.round(width * 1.9) },
      deviceScaleFactor: 2,
      isMobile: width < 768,
    });
    const page = await context.newPage();

    page.on('console', (m) => {
      if (m.type() === 'error') report.consoleErrors.push({ width, text: m.text().slice(0, 300) });
    });
    page.on('requestfailed', (r) => {
      report.failedRequests.push({ width, url: r.url().slice(0, 200), error: r.failure()?.errorText });
    });

    let response;
    try {
      response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    } catch (e) {
      // A dev server that is not up is a setup problem, not a page defect. Say so
      // plainly and exit 2 rather than dumping a Playwright stack trace.
      console.error(`could not load ${url}\n  ${String(e).split('\n')[0]}`);
      console.error('  is the dev server running, and is the port right?');
      await browser.close();
      process.exit(2);
    }
    if (has('font-stress')) await page.addStyleTag({ content: STRESS_CSS });
    await page.waitForTimeout(600); // let entrance animations settle before capturing

    // Store the file name only. An absolute path in a committed report leaks the
    // machine it was produced on and makes the report non-portable.
    const shot = `${outDir}/${width}.png`;
    await page.screenshot({ path: shot, fullPage: true });

    // Horizontal overflow is invisible in code review and fatal on phones.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );

    // Document structure. A page can be missing its root element entirely and still
    // render correctly, because the parser invents one, seven pages shipped that
    // way in this repository's own benchmark and every contrast check on them
    // passed. The DOM cannot show it after the fact, so read the source.
    if (width === Math.min(...widths)) {
      const src = await (await context.request.get(url)).text();
      const structure = [];
      if (!/^\s*<!doctype\s+html/i.test(src)) structure.push('no <!doctype html>');
      if (!/<html\b/i.test(src)) structure.push('no <html> element');
      else if (!/<html[^>]*\slang\s*=/i.test(src)) structure.push('<html> has no lang attribute');
      if (!/<head\b/i.test(src)) structure.push('no <head> element');
      if (!/<body\b/i.test(src)) structure.push('no <body> element');
      const h1 = (src.match(/<h1[\s>]/gi) ?? []).length;
      if (h1 === 0) structure.push('no <h1>');
      else if (h1 > 1) structure.push(`${h1} <h1> elements`);
      if (!/<main\b/i.test(src)) structure.push('no <main> landmark');
      if (structure.length) report.structure = structure;
    }

    report.widths[width] = {
      status: response?.status() ?? null,
      screenshot: `${width}.png`,
      horizontalOverflowPx: overflow,
      title: await page.title(),
    };

    await installProbes(page);

    // Countable defects at this viewport. A measurement that throws is recorded as
    // missing rather than as an empty result, because an empty result reads as clean.
    try {
      report.measures.perWidth[width] = await measureViewport(page);
    } catch (e) {
      report.notMeasured.push({ check: `floor measures at ${width}px`, reason: String(e).split('\n')[0].slice(0, 160) });
    }
    try {
      report.measures.focus[width] = await measureFocus(page);
    } catch (e) {
      report.notMeasured.push({ check: `focus sweep at ${width}px`, reason: String(e).split('\n')[0].slice(0, 160) });
    }

    // Link and axe checks only need to run once; the narrowest viewport is the strictest.
    if (width === Math.min(...widths)) {
      const links = await page.$$eval('a[href]', (as) =>
        as.map((a) => ({ href: a.href, text: (a.textContent || '').trim().slice(0, 60) })),
      );
      const origin = new URL(url).origin;
      const seen = new Set();
      for (const link of links) {
        if (link.href.startsWith('mailto:') || link.href.startsWith('tel:')) continue;
        if (/#$/.test(link.href) || link.href.endsWith('#')) {
          report.brokenLinks.push({ ...link, reason: 'placeholder href="#"' });
          continue;
        }
        if (!link.href.startsWith(origin) || seen.has(link.href)) continue;
        seen.add(link.href);
        try {
          const res = await context.request.get(link.href, { timeout: 15000 });
          if (res.status() >= 400) report.brokenLinks.push({ ...link, reason: `HTTP ${res.status()}` });
        } catch (e) {
          report.brokenLinks.push({ ...link, reason: String(e).slice(0, 120) });
        }
      }

      if (AxeBuilder) {
        // Both colour schemes. A palette that passes in light routinely fails in dark,
        // and testing one and inferring the other is how that ships.
        const scan = async (scheme) => {
          await page.emulateMedia({ colorScheme: scheme });
          await page.waitForTimeout(150);
          const r = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();
          return r.violations.map((v) => ({ ...v, scheme }));
        };
        try {
          const found = [...(await scan('light')), ...(await scan('dark'))];
          await page.emulateMedia({ colorScheme: null });
          const results = { violations: found, passes: [] };
          report.axe = {
            violations: results.violations.map((v) => ({
              id: v.id,
              scheme: v.scheme,
              impact: v.impact,
              help: v.help,
              nodes: v.nodes.length,
              // Without the offending selectors a violation count is not actionable.
              examples: v.nodes.slice(0, 4).map((n) => ({
                target: n.target.join(' '),
                detail: (n.any?.[0]?.message ?? n.failureSummary ?? '').split('\n')[0].slice(0, 160),
              })),
            })),
            passes: results.passes.length,
          };
        } catch (e) {
          // An axe run that threw halfway is not a clean scan of one scheme, it is no
          // scan at all. Leaving report.axe null routes it through the fail-closed gate.
          report.notMeasured.push({ check: 'axe scan', reason: String(e).split('\n')[0].slice(0, 160) });
        }
      }
    }

    await context.close();
  }

  try {
    report.reducedMotion = await reducedMotionPass(browser);
  } catch (e) {
    report.notMeasured.push({ check: 'reduced-motion pass', reason: String(e).split('\n')[0].slice(0, 160) });
  }
} finally {
  await browser.close();
}

await writeFile(`${outDir}/report.json`, JSON.stringify(report, null, 2));

const serious = (report.axe?.violations ?? []).filter((v) => v.impact === 'critical' || v.impact === 'serious');
const overflowing = Object.entries(report.widths).filter(([, w]) => w.horizontalOverflowPx > 1);
// A 404 that happens to be clean and accessible is still not the page under test.
// Without this, pointing the script at a wrong path reports PASS.
const badStatus = Object.entries(report.widths).filter(([, w]) => (w.status ?? 0) >= 400);

/* A gate that cannot run its accessibility check and still says PASS is worse than no gate: it
   tells you the thing was checked. @axe-core/playwright was not installed by `sitesmith install`,
   built in a fresh project reported "axe violations: not run" and passed, and the builder had no
   reason to look twice: not run is not failed, and it read as fine.
   This fails closed. `--no-axe` is the only way past it, it has to be typed, and it prints what
   it is buying. */
const axeSkipped = !report.axe;
const axeWaived = has('no-axe');
const axeBlocks = axeSkipped && !axeWaived ? 1 : 0;

const rm = report.reducedMotion;
const rmMissing = !rm;
// Motion that outlives the preference. No waiver flag exists for this one on purpose:
// the reader who set the preference cannot type a flag.
const motionFindings = rm
  ? [
      ...rm.motionRequests.map((r) => ({ kind: 'motion payload requested under reduced motion', detail: `${r.url} (${r.why})` })),
      ...rm.runningAnimations.map((a) => ({
        kind: 'animation still running under reduced motion',
        detail: `${a.selector} : ${a.name} (${a.kind}, ${a.durationMs}ms, ${a.iterations} iterations)`,
      })),
      ...rm.longTransitions.map((t) => ({
        kind: `transition over ${REDUCED_MOTION_MAX_MS}ms under reduced motion`,
        detail: `${t.selector} : ${t.property} ${t.ms}ms`,
      })),
    ]
  : [];

const blocking =
  report.consoleErrors.length +
  report.brokenLinks.length +
  serious.length +
  overflowing.length +
  badStatus.length +
  axeBlocks +
  report.structure.length +
  motionFindings.length +
  (rmMissing ? 1 : 0) +
  report.notMeasured.filter((n) => n.check !== 'reduced-motion pass').length;

/* One ranked list. Blockers first, then what was measured and left to the reader, then
   the verdicts that are missing, and last what is working. Every entry names its element
   and the measurement it came from, because a finding without either is an opinion. */
function ranked() {
  const lines = [];
  const say = (s) => lines.push(s);

  say('  BLOCKERS');
  let n = 0;
  for (const [w, d] of badStatus) say(`    ${++n}. HTTP ${d.status} at ${w}px : this is not the page under test`);
  for (const s of report.structure) say(`    ${++n}. document structure : ${s}`);
  for (const [w, d] of overflowing) say(`    ${++n}. horizontal overflow at ${w}px : +${d.horizontalOverflowPx}px past the viewport`);
  for (const v of serious) {
    say(`    ${++n}. axe ${v.impact} [${v.scheme}] ${v.id} : ${v.help} (${v.nodes} nodes)`);
    for (const ex of v.examples ?? []) say(`         ${ex.target}\n           ${ex.detail}`);
  }
  for (const m of motionFindings) say(`    ${++n}. ${m.kind} : ${m.detail}`);
  for (const l of report.brokenLinks.slice(0, 10)) say(`    ${++n}. dead link "${l.text}" : ${l.reason}`);
  if (report.brokenLinks.length > 10) say(`       and ${report.brokenLinks.length - 10} more dead links, see report.json`);
  for (const c of report.consoleErrors.slice(0, 10)) say(`    ${++n}. console error at ${c.width}px : ${c.text}`);
  if (report.consoleErrors.length > 10) say(`       and ${report.consoleErrors.length - 10} more console errors, see report.json`);
  if (axeBlocks) {
    say(`    ${++n}. accessibility scan did not run and was not waived`);
    say('         install it where this runs: npm i -D @axe-core/playwright axe-core');
  }
  if (n === 0) say('    none');

  say('');
  say('  MEASURED, NOT JUDGED   (run.md step 7 accepts or justifies each)');
  let m = 0;
  for (const [w, d] of Object.entries(report.measures.perWidth)) {
    for (const x of d.wrappedLabels) say(`    ${++m}. ${w}px  control label wraps onto ${x.lines} lines : ${x.selector} "${x.name}" (${x.w}x${x.h}px)`);
    for (const x of d.duplicateIntents) say(`    ${++m}. ${w}px  ${x.count} controls, ${x.kind} : "${x.key}" at ${x.elements.map((e) => e.selector).join(', ')}`);
    if (d.radii.length > 2) say(`    ${++m}. ${w}px  ${d.radii.length} distinct corner radii : ${d.radii.map((r) => `${r.value} (${r.example})`).join(', ')}`);
    if (d.families.length > 2) say(`    ${++m}. ${w}px  ${d.families.length} distinct type families : ${d.families.map((f) => `${f.value} (${f.example})`).join(', ')}`);
    for (const x of d.smallTargets.slice(0, 8)) say(`    ${++m}. ${w}px  tap target ${x.smallestSidePx}px, under the ${TOUCH_MIN_PX}px floor : ${x.selector} "${x.name}"`);
    if (d.smallTargets.length > 8) say(`       and ${d.smallTargets.length - 8} more small targets at ${w}px, see report.json`);
    for (const x of d.tightPairs.slice(0, 6)) say(`    ${++m}. ${w}px  ${x.gapPx}px between targets, under the ${TOUCH_GAP_PX}px floor : ${x.a.selector} and ${x.b.selector}`);
    if (d.tightPairs.length > 6) say(`       and ${d.tightPairs.length - 6} more tight pairs at ${w}px, see report.json`);
    for (const x of d.namelessControls.slice(0, 8)) say(`    ${++m}. ${w}px  interactive element with no accessible name : ${x.selector} (${x.w}x${x.h}px)`);
  }
  for (const [w, f] of Object.entries(report.measures.focus)) {
    for (const x of f.noIndicator) say(`    ${++m}. ${w}px  no visible focus indicator : ${x.selector} "${x.name}" (${x.measurement})`);
    for (const x of f.weakIndicator) say(`    ${++m}. ${w}px  focus indicator at ${x.contrast}:1 against its surface, under ${INDICATOR_CONTRAST}:1 : ${x.selector} "${x.name}"`);
  }
  if (m === 0) say('    none');

  say('');
  say('  VERDICT WITHHELD');
  if (report.notMeasured.length === 0) say('    none, every check produced a result');
  for (const nm of report.notMeasured) say(`    ${nm.check} did not run : ${nm.reason}`);
  if (rmMissing) say('    reduced-motion pass did not run');

  say('');
  say('  WORKING');
  say(`    viewports rendered : ${Object.keys(report.widths).join(', ')}px`);
  say(`    axe both schemes   : ${report.axe ? `ran, ${report.axe.violations.length} violations, ${serious.length} serious or critical` : axeWaived ? 'waived with --no-axe, so this page is unchecked for accessibility' : 'did not run'}`);
  say(`    reduced motion     : ${rm ? `rendered at ${rm.width}px, ${rm.requestCount} requests, ${motionFindings.length} findings` : 'did not run'}`);
  say(`    floor measures     : ${Object.keys(report.measures.perWidth).length} of ${widths.length} viewports measured`);
  say(`    keyboard sweep     : ${Object.entries(report.measures.focus).map(([w, f]) => `${w}px ${f.stops} stops`).join(', ') || 'did not run'}`);
  say(`    links checked      : ${report.brokenLinks.length} dead of the same-origin set`);
  say(`    failed requests    : ${report.failedRequests.length}`);
  return lines.join('\n');
}

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`\n  ${report.url}${report.fontStress ? '   [wide-font stress]' : ''}\n`);
  for (const [w, d] of Object.entries(report.widths)) {
    const ok = d.horizontalOverflowPx <= 1 ? 'ok' : `OVERFLOW +${d.horizontalOverflowPx}px`;
    const status = (d.status ?? 0) >= 400 ? `HTTP ${d.status} <-` : `HTTP ${d.status}`;
    console.log(`  ${String(w).padStart(4)}px  ${status}  ${ok}  -> ${d.screenshot}`);
  }
  if (rm) console.log(`  ${String(rm.width).padStart(4)}px  reduced motion        -> ${rm.screenshot}`);
  console.log('');
  console.log(ranked());
  console.log(`\n  ${blocking === 0 ? 'PASS, nothing blocking' : `FAIL, ${blocking} blocking issue(s)`}\n`);
}

process.exit(blocking === 0 ? 0 : 1);
