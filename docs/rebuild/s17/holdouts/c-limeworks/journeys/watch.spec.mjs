#!/usr/bin/env node
/**
 * The shift path: acknowledge a shaft that is over band, adjust a damper, and have both
 * appear in the log and be spoken.
 *
 *   BASE=http://localhost:4322/docs/rebuild/s17/holdouts/c-limeworks node journeys/watch.spec.mjs
 *
 * The fourth assertion is the one that matters on a control screen and is usually
 * skipped: state must survive the colour being taken away. An operator who cannot
 * separate the hues has to read the same board.
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

const BASE = process.env.BASE ?? 'http://localhost:4322/docs/rebuild/s17/holdouts/c-limeworks';
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

/* 1. Something observably changed: the acknowledgement column and the log. */
const logBefore = await page.$$eval('#log li', (l) => l.length);
await page.click('[data-kvit="2"]');
await page.waitForTimeout(200);
const logAfter = await page.$$eval('#log li', (l) => l.length);
const ackText = await page.$eval('[data-kvit="2"]', (b) => b.closest('.skakt').querySelectorAll('.raek b')[2].textContent.trim());
check(logAfter === logBefore + 1 && /A\.B\./.test(ackText),
  'acknowledging writes the log and fills the acknowledgement column',
  `log ${logBefore} -> ${logAfter}, ack ${JSON.stringify(ackText)}`);

/* 2. The change was announced. */
const spoken = await page.$eval('#status', (el) => ({ role: el.getAttribute('role'), text: el.textContent.trim() }));
check(spoken.role === 'status' && /skakt 2/i.test(spoken.text),
  'the action is spoken in a live region, not only drawn',
  JSON.stringify(spoken));

/* 3. The failure path: a control that has done its job refuses to do it twice. This is
      the version of a failure path a watch desk actually has, and a double-press from a
      gloved hand is the exact thing it is guarding against. */
const second = await page.$eval('[data-kvit="2"], .skakt:nth-child(2) .kn', (b) => ({
  disabled: b.disabled, label: b.textContent.trim(),
}));
check(second.disabled === true && /kvitteret/i.test(second.label),
  'the same acknowledgement cannot be pressed twice',
  JSON.stringify(second));

/* 4. State survives the colour. Strip every colour and require the state to still read. */
const readable = await page.evaluate(() => {
  const s = document.createElement('style');
  s.textContent = '*{color:#000 !important;background:#fff !important;border-color:#000 !important}';
  document.head.appendChild(s);
  const chips = [...document.querySelectorAll('.tilstand')];
  return {
    count: chips.length,
    words: chips.map((c) => c.textContent.trim()),
    allBordered: chips.every((c) => parseFloat(getComputedStyle(c).borderTopWidth) > 0),
  };
});
check(readable.count === 4 && readable.allBordered && new Set(readable.words).size >= 3,
  'with every colour removed, each shaft still states its condition in words',
  JSON.stringify(readable));

/* 5. Keyboard alone, with an indicator at every stop. */
await page.reload({ waitUntil: 'load' });
await page.waitForTimeout(300);
const blind = [];
let reached = 0;
for (let i = 0; i < 20; i++) {
  await page.keyboard.press('Tab');
  const s = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const cs = getComputedStyle(el);
    return { tag: el.tagName, disabled: el.disabled === true, visible: el.matches(':focus-visible'), outline: `${cs.outlineStyle} ${cs.outlineWidth}` };
  });
  if (!s) break;
  if (s.tag === 'BUTTON' && !s.disabled) reached++;
  if (s.visible && /none|0px/.test(s.outline)) blind.push(s.tag);
}
check(reached >= 4 && blind.length === 0,
  'every live control is reachable by keyboard with a visible indicator',
  `live buttons reached=${reached}, no-indicator=${blind.length}`);

await browser.close();
console.log(`\n  ${fails.length ? `${fails.length} assertion(s) failed` : 'all assertions held'}\n`);
process.exit(fails.length ? 1 : 0);
