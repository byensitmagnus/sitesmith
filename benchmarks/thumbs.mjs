#!/usr/bin/env node
/**
 * Regenerates the gallery thumbnails and the contact sheet. Original work, MIT.
 *
 *   cd benchmarks && node serve.mjs 4321 . &
 *   node thumbs.mjs
 *
 * Thumbnails are the first 1280x800 of each page, not a full-page capture: the
 * gallery is answering "what does this look like", and a 5,000px strip scaled to
 * a card answers nothing. Output goes to ../gallery/thumbs/.
 */

import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { chromium } from 'playwright';

const ORIGIN = process.argv[2] ?? 'http://localhost:4321';
const OUT = fileURLToPath(new URL('../gallery/thumbs/', import.meta.url));

const PAGES = [
  ['01-saas-landing', '01-saas-landing'],
  ['02-product-page', '02-product-page'],
  ['03-dashboard', '03-dashboard'],
  ['04-local-service', '04-local-service'],
  ['05-editorial', '05-editorial'],
  ['06-redesign/after', '06-redesign-after'],
  ['07-multistep-form', '07-multistep-form'],
  ['08-documentation', '08-documentation'],
  ['09-data-entry', '09-data-entry'],
  ['06-redesign/before', '06-redesign-before'],
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5 });

try {
  for (const [path, name] of PAGES) {
    const page = await context.newPage();
    const res = await page.goto(`${ORIGIN}/${path}/`, { waitUntil: 'networkidle', timeout: 45000 });
    if (!res || res.status() >= 400) throw new Error(`${path} returned HTTP ${res?.status()}`);
    await page.waitForTimeout(500);
    await page.screenshot({ path: join(OUT, `${name}.png`) });
    await page.close();
    console.log(`  ${name}.png`);
  }

  // The contact sheet is a page like any other, so it is captured the same way
  // rather than assembled by hand — which is why it used to drift.
  const sheet = await context.newPage();
  await sheet.setViewportSize({ width: 1500, height: 1000 });
  await sheet.goto(`${ORIGIN}/contact-sheet.html`, { waitUntil: 'networkidle' });
  await sheet.waitForTimeout(700);
  await sheet.screenshot({ path: 'results/contact-sheet.png', fullPage: true });
  console.log('  results/contact-sheet.png');
} finally {
  await browser.close();
}
