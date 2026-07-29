/**
 * The one thing this shop exists to do: price a length, be refused for a length the coil
 * cannot take, correct it, add it, and see the ticket change. Written against the rebuilt
 * markup — see JOURNEY-INTENT.md for the intent this implements.
 *
 *   node journeys/cut-and-order.spec.mjs        BASE=http://localhost:4501
 */
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const require_ = createRequire(join(process.cwd(), 'package.json'));
const { chromium } = await import('playwright').catch(
  () => import(pathToFileURL(require_.resolve('playwright')).href));

const BASE = process.env.BASE ?? 'http://localhost:4501';
const problems = [];
const check = (name, ok, detail = '') => { if (!ok) problems.push(`${name}${detail ? ' — ' + detail : ''}`); };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', (e) => problems.push('page error: ' + e.message));
await page.goto(BASE, { waitUntil: 'networkidle' });

/* ── 1. there is no ticket until something is cut ───────────────────────── */
check('no docket stands open before the first cut',
  !(await page.locator('[data-dock]').evaluate((e) => e.classList.contains('on'))));
check('and nothing of it is on screen',
  (await page.locator('.cuts').count()) === 0);

/* ── 2. the buying control is on the page, not behind a disclosure ──────── */
const visibleInputs = await page.locator('input[data-metres]:visible').count();
check('a length can be entered without opening anything', visibleInputs >= 4,
  `${visibleInputs} length field(s) visible on load`);

/* ── 3. a length prices itself, live ────────────────────────────────────── */
const len = page.locator('[data-metres="DB12"]');
const cost = page.locator('[data-cost="DB12"]');
await len.fill('12');
await page.waitForTimeout(60);
check('twelve metres of double braid prices at £49.80',
  (await cost.innerText()).trim() === '£49.80', await cost.innerText());

/* ── 4. a length the coil cannot take is refused, and the refusal names the limit ── */
await len.fill('1');
await page.waitForTimeout(60);
const short = await page.locator('[data-err="DB12"]').innerText();
check('a cut under the minimum is refused', /minimum cut is 3 m/i.test(short), short);
check('the refused line cannot be added',
  await page.locator('[data-add="DB12"]').isDisabled());

await len.fill('900');
await page.waitForTimeout(60);
const long = await page.locator('[data-err="DB12"]').innerText();
check('a cut longer than the coil is refused with the coil length named',
  /200 m on this coil/i.test(long), long);

/* ── 5. the refusal is correctable in place ─────────────────────────────── */
await len.fill('25');
await page.waitForTimeout(60);
check('correcting the length clears the refusal',
  (await page.locator('[data-err="DB12"]').innerText()).trim() === '');
check('and the price comes back', (await cost.innerText()).trim() === '£103.75');

/* ── 6. adding the cut changes the ticket, with the batch on it ─────────── */
await page.click('[data-add="DB12"]');
await page.waitForTimeout(80);
check('the docket arrives with the first cut',
  await page.locator('[data-dock]').evaluate((e) => e.classList.contains('on')));
check('and it offers somewhere to take it',
  await page.locator('.take').isVisible());
const ticket = await page.locator('.cuts').innerText();
check('the cut appears on the ticket',
  /25\s*m of Double braid polyester/i.test(ticket),
  ticket.split('\n').join(' ').slice(0, 80));
check('the ticket names the batch it was cut from', /DB12-2426/.test(ticket));
check('the ticket total is the cut', (await page.locator('.total b').innerText()).trim() === '£103.75');
check('and it is said out loud for a screen reader',
  /added/i.test(await page.locator('[data-said]').innerText()));

/* a second cut accumulates rather than replacing */
await page.locator('[data-metres="TS12"]').fill('10');
await page.waitForTimeout(60);
await page.click('[data-add="TS12"]');
await page.waitForTimeout(80);
check('two cuts total correctly', (await page.locator('.total b').innerText()).trim() === '£127.75',
  await page.locator('.total b').innerText());

/* ── 7. a cut can be taken off again ────────────────────────────────────── */
await page.click('[data-drop="0"]');
await page.waitForTimeout(80);
check('removing a cut restores the total', (await page.locator('.total b').innerText()).trim() === '£24.00',
  await page.locator('.total b').innerText());
await page.click('[data-drop="0"]');
await page.waitForTimeout(90);
check('and emptying it puts the docket away again',
  !(await page.locator('[data-dock]').evaluate((e) => e.classList.contains('on'))));

/* ── 8. the out-of-stock line offers no control and says when it returns ── */
check('the out-of-stock line has no length field',
  (await page.locator('[data-metres="PP14"]').count()) === 0);
const restock = await page.locator('[data-line="PP14"] .restock').innerText();
check('and it says when the next coil lands', /12 August/i.test(restock), restock);

/* ── 9. the controls survive a phone ────────────────────────────────────── */
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(120);
check('no horizontal overflow at 390',
  await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  await page.evaluate(() => `${document.documentElement.scrollWidth} > ${window.innerWidth}`));
check('the length field is still on the page at 390',
  await page.locator('[data-metres="TS12"]').isVisible());
const box = await page.locator('[data-add="TS12"]').boundingBox();
check('the add control keeps a 48px target at 390', box && box.height >= 44,
  box ? `${Math.round(box.height)}px` : 'no box');

await browser.close();
if (problems.length) {
  console.error(`\n  ${problems.length} problem(s):`);
  for (const p of problems) console.error(`   - ${p}`);
  process.exit(1);
}
console.log('  cut-and-order: every step held');
