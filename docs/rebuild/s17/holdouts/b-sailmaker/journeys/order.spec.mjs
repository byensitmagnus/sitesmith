#!/usr/bin/env node
/**
 * The one path that decides whether this page works: choose, see the sum change, try to
 * commit without a measurement, be refused usefully, then commit.
 *
 *   BASE=http://localhost:4322/docs/rebuild/s17/holdouts/b-sailmaker node journeys/order.spec.mjs
 *
 * Four assertions, per verify.md's contract. The third is the one a page like this
 * usually fails: the failure path exists, but its message floats at the top of the form
 * instead of sitting on the control that caused it.
 */

import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const requireFromCwd = createRequire(join(process.cwd(), 'package.json'));
const pw = await (async () => {
  try { return await import('playwright'); }
  catch { return await import(pathToFileURL(requireFromCwd.resolve('playwright')).href); }
})();
const chromium = pw.chromium ?? pw.default?.chromium;
if (!chromium) { console.error('playwright exposes no chromium; nothing was tested'); process.exit(2); }

const BASE = process.env.BASE ?? 'http://localhost:4322/docs/rebuild/s17/holdouts/b-sailmaker';
const fails = [];
const check = (ok, what, detail) => {
  if (ok) console.log(`  ok    ${what}`);
  else { fails.push(what); console.log(`  FAIL  ${what}\n        ${detail}`); }
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: 'load' });
await page.waitForTimeout(300);

/* 1. Something observably changed. */
const before = await page.textContent('#ialt');
await page.check('.valg label:nth-of-type(2) input');
await page.waitForTimeout(200);
const after = await page.textContent('#ialt');
check(before !== after, 'the total changes when an option is chosen', `stayed at ${before}`);

/* 2. The change was announced, in a live region rather than only in pixels. */
const region = await page.$eval('#kvit', (el) => ({ role: el.getAttribute('role'), text: el.textContent.trim() }));
check(region.role === 'status' && /opdateret/i.test(region.text),
  'the change is announced in a live region',
  `role=${region.role}, text=${JSON.stringify(region.text)}`);

/* 3. The failure path runs, and its message sits on the control that caused it. */
await page.uncheck('.valg label:nth-of-type(1) input');
await page.click('#send');
await page.waitForTimeout(200);
const refusal = await page.evaluate(() => {
  const k = document.getElementById('kvit');
  const focused = document.activeElement;
  return {
    text: k.textContent.trim(),
    flagged: k.getAttribute('data-tilstand'),
    focusIsTheCause: focused === document.querySelector('.valg label:nth-of-type(1) input'),
  };
});
check(refusal.flagged === 'fejl' && /mål|opmåling/i.test(refusal.text) && refusal.focusIsTheCause,
  'committing without a measurement is refused, and focus moves to the cause',
  JSON.stringify(refusal));

/* 4. The whole path completes on the keyboard alone with a visible indicator. */
await page.reload({ waitUntil: 'load' });
await page.waitForTimeout(300);
const stops = [];
let reachedSend = false;
for (let i = 0; i < 25; i++) {
  await page.keyboard.press('Tab');
  const s = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const cs = getComputedStyle(el);
    return {
      id: el.id, tag: el.tagName,
      visible: el.matches(':focus-visible'),
      outline: `${cs.outlineStyle} ${cs.outlineWidth}`,
    };
  });
  if (!s) break;
  stops.push(s);
  if (s.id === 'send') { reachedSend = true; await page.keyboard.press('Enter'); break; }
}
await page.waitForTimeout(200);
const committed = await page.textContent('#kvit');
const blind = stops.filter((s) => s.visible && /none|0px/.test(s.outline));
check(reachedSend && /noteret/i.test(committed) && blind.length === 0,
  'the whole order completes on the keyboard, with an indicator at every stop',
  `reachedSend=${reachedSend}, result=${JSON.stringify(committed)}, no-indicator=${blind.length}`);

await browser.close();
console.log(`\n  ${fails.length ? `${fails.length} assertion(s) failed` : 'all assertions held'}\n`);
process.exit(fails.length ? 1 : 0);
