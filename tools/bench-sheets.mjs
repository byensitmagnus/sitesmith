#!/usr/bin/env node
/**
 * One desktop and one mobile contact sheet per run. Original work, MIT.
 *
 *   node tools/bench-sheets.mjs 01-company
 *
 * The blind graders see these and nothing else, so the sheet has to show the whole
 * site rather than flatter it: every page, in file order, same crop, same scale, no
 * captions beyond the file name. Output is JPEG because the previous benchmark put
 * 88MB of full-page PNGs in a git repository, which is 88MB nobody will ever open.
 *
 * Raw per-page screenshots stay in the workspace and are not committed.
 */

import { mkdir, writeFile, readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join, relative } from 'node:path';
import { chromium } from '../benchmarks/node_modules/playwright/index.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const LAB = join(tmpdir(), 'wsbench');
const OUT = join(ROOT, 'benchmarks/v2/sheets');
const SHOTS = join(tmpdir(), 'wsbench-shots');
const PORT = 8199;

const brief = process.argv[2];
if (!brief) {
  console.error('usage: bench-sheets.mjs <brief>');
  process.exit(2);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function htmlPages(dir, base = dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) await htmlPages(full, base, out);
    else if (e.name.endsWith('.html')) out.push(relative(base, full).replace(/\\/g, '/'));
  }
  return out;
}

const VIEWS = {
  desktop: { width: 1280, height: 900 },
  mobile: { width: 390, height: 844 },
};

await mkdir(OUT, { recursive: true });
const runs = (await readdir(LAB, { withFileTypes: true }))
  .filter((e) => e.isDirectory() && e.name.startsWith(`${brief}-`))
  .map((e) => e.name)
  .sort();

const browser = await chromium.launch();
const hashes = {};

for (const run of runs) {
  const site = join(LAB, run, 'site');
  const pages = (await htmlPages(site).catch(() => [])).sort();
  if (!pages.length) {
    console.log(`  ${run}: no pages, skipped`);
    continue;
  }

  const server = spawn(process.execPath, [join(LAB, run, 'serve.mjs'), String(PORT), site], { stdio: 'ignore' });
  for (let i = 0; i < 40; i++) {
    try {
      if ((await fetch(`http://localhost:${PORT}/${pages[0]}`)).ok) break;
    } catch {
      /* not up */
    }
    await sleep(200);
  }

  for (const [view, size] of Object.entries(VIEWS)) {
    const shotDir = join(SHOTS, run, view);
    await mkdir(shotDir, { recursive: true });
    const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: 1, isMobile: view === 'mobile' });
    const files = [];
    for (const p of pages) {
      const page = await ctx.newPage();
      try {
        await page.goto(`http://localhost:${PORT}/${p}`, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(400);
        const f = join(shotDir, p.replace(/[\\/]/g, '-').replace(/\.html$/, '') + '.png');
        await page.screenshot({ path: f, fullPage: true });
        files.push({ name: p, file: f });
      } catch {
        /* a page that will not load is itself a measurement, recorded elsewhere */
      }
      await page.close();
    }
    await ctx.close();

    // The sheet: every page, same width, top-aligned, cropped to a common height so
    // one very long page cannot dominate the grid.
    const cols = view === 'desktop' ? 3 : 5;
    const crop = view === 'desktop' ? 760 : 900;
    const sheet = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
      body{margin:0;background:#141416;font:12px/1.4 ui-sans-serif,system-ui,sans-serif;color:#b9b7b2;padding:18px}
      .g{display:grid;grid-template-columns:repeat(${cols},1fr);gap:14px}
      figure{margin:0;background:#1d1d20;border:1px solid #2c2c30;border-radius:6px;overflow:hidden}
      .f{display:block;height:${crop}px;overflow:hidden;background:#fff}
      .f img{width:100%;display:block}
      figcaption{padding:6px 9px;border-top:1px solid #2c2c30;font-size:11px;color:#8d8b86;
        white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    </style></head><body><div class="g">
      ${files
        .map(
          (f) =>
            `<figure><span class="f"><img src="${pathToFileURL(f.file).href}" alt=""></span><figcaption>${f.name}</figcaption></figure>`,
        )
        .join('')}
    </div></body></html>`;

    const sheetFile = join(SHOTS, run, `${view}.html`);
    await writeFile(sheetFile, sheet);
    const sp = await browser.newPage({ viewport: { width: cols * (view === 'desktop' ? 430 : 250) + 60, height: 1000 } });
    await sp.goto(pathToFileURL(sheetFile).href, { waitUntil: 'networkidle' });
    await sp.waitForTimeout(500);
    const outFile = join(OUT, `${run}-${view}.jpg`);
    await sp.screenshot({ path: outFile, fullPage: true, type: 'jpeg', quality: 72 });
    await sp.close();

    hashes[`${run}-${view}.jpg`] = createHash('sha256').update(await readFile(outFile)).digest('hex').slice(0, 32);
    console.log(`  ${run.padEnd(24)} ${view.padEnd(8)} ${files.length} pages`);
  }

  server.kill();
  await sleep(150);
}

await browser.close();
await writeFile(join(OUT, `hashes-${brief}.json`), JSON.stringify(hashes, null, 2) + '\n');
console.log(`\n  sheets in benchmarks/v2/sheets, hashes in hashes-${brief}.json\n`);
