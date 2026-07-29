#!/usr/bin/env node
/**
 * sitesmith verify — renders a page and reports what a diff cannot show.
 *
 *   node verify.mjs <url> [--out DIR] [--widths 375,768,1440] [--no-axe] [--json]
 *                         [--font-stress]
 *
 * Captures a full-page screenshot at each width, collects console errors and failed
 * network requests, checks every same-origin link for a dead target, and runs an axe
 * accessibility scan.
 *
 * Exit 0 clean · 1 blocking defect found (bad HTTP status, console error, broken link,
 * serious axe violation, horizontal overflow) · 2 could not run (bad arguments, missing
 * dependency, server unreachable).
 *
 * Requires: npm i -D playwright @axe-core/playwright && npx playwright install chromium
 * MIT — part of https://github.com/byensitmagnus/sitesmith
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
    console.error('note: @axe-core/playwright not installed — skipping accessibility scan');
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
};

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
    // render correctly, because the parser invents one — seven pages shipped that
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
      }
    }

    await context.close();
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
   tells you the thing was checked. axe-core is not installed by `sitesmith install`, so a page
   built in a fresh project reported "axe violations: not run" and passed, and the builder had no
   reason to look twice — not run is not failed, and it read as fine.
   This fails closed. `--no-axe` is the only way past it, it has to be typed, and it prints what
   it is buying. */
const axeSkipped = !report.axe;
const axeWaived = process.argv.includes('--no-axe');
const axeBlocks = axeSkipped && !axeWaived ? 1 : 0;

const blocking =
  report.consoleErrors.length +
  report.brokenLinks.length +
  serious.length +
  overflowing.length +
  badStatus.length +
  axeBlocks +
  report.structure.length;

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`\n  ${report.url}${report.fontStress ? '   [wide-font stress]' : ''}\n`);
  for (const [w, d] of Object.entries(report.widths)) {
    const ok = d.horizontalOverflowPx <= 1 ? 'ok' : `OVERFLOW +${d.horizontalOverflowPx}px`;
    const status = (d.status ?? 0) >= 400 ? `HTTP ${d.status} ←` : `HTTP ${d.status}`;
    console.log(`  ${String(w).padStart(4)}px  ${status}  ${ok}  → ${d.screenshot}`);
  }
  console.log('');
  console.log(`  structure      : ${report.structure.length === 0 ? 'ok' : report.structure.join(', ')}`);
  console.log(`  console errors : ${report.consoleErrors.length}`);
  console.log(`  failed requests: ${report.failedRequests.length}`);
  console.log(`  broken links   : ${report.brokenLinks.length}`);
  console.log(`  axe violations : ${report.axe ? `${report.axe.violations.length} (${serious.length} serious/critical)`
    : axeWaived ? 'NOT RUN — waived with --no-axe, so this page is unchecked for accessibility'
    : 'NOT RUN — axe-core is missing, and an unchecked page does not pass'}`);
  if (axeBlocks) {
    console.log('      install it where this runs: npm i -D axe-core, or `sitesmith doctor` to see what else is absent');
  }
  for (const v of serious) {
    console.log(`      [${v.scheme ?? '?'}] ${v.impact.padEnd(8)} ${v.id} — ${v.help} (${v.nodes} nodes)`);
    for (const ex of v.examples ?? []) console.log(`          ${ex.target}\n            ${ex.detail}`);
  }
  for (const l of report.brokenLinks.slice(0, 10)) console.log(`      link "${l.text}" — ${l.reason}`);
  for (const c of report.consoleErrors.slice(0, 10)) console.log(`      console: ${c.text}`);
  console.log(`\n  ${blocking === 0 ? 'PASS — nothing blocking' : `FAIL — ${blocking} blocking issue(s)`}\n`);
}

process.exit(blocking === 0 ? 0 : 1);
