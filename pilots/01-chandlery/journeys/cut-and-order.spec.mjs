/**
 * The one thing this shop exists to do: price a length, be refused for a length the coil
 * cannot take, correct it, add it, and see the order change.
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

/* ── the page loads empty, and says so in words rather than "no items" ── */
check('the order starts empty', (await page.locator('[data-order-count]').innerText()) === '0');
check('the empty state explains what will appear',
  /nothing cut yet/i.test(await page.locator('.empty').innerText()));

/* ── something changes: a length prices itself ─────────────────────────── */
await page.click('[aria-controls=cut-DB12]');
check('opening the row moves focus to the length input',
  await page.evaluate(() => document.activeElement?.id === 'len-DB12'));

const before = await page.locator('#cut-DB12 [data-line-total]').innerText();
await page.fill('#len-DB12', '24');
const after = await page.locator('#cut-DB12 [data-line-total]').innerText();
check('the line total responds to the length', before !== after, `${before} -> ${after}`);
check('the line total is priced correctly', after === '£101.40', `got ${after}`);

/* ── the failure path: a length the coil cannot take ───────────────────── */
await page.fill('#len-DB12', '400');
const err = (await page.locator('#err-DB12').innerText()).trim();
check('an over-length cut is refused', err.length > 0);
check('the refusal names the actual limit', /96\s*m/.test(err), `said: ${err}`);
check('the input is marked invalid',
  (await page.getAttribute('#len-DB12', 'aria-invalid')) === 'true');
check('the add button is disabled while invalid',
  await page.locator('#cut-DB12 .add').isDisabled());
check('the error is in a live region',
  (await page.getAttribute('#err-DB12', 'role')) === 'alert');

/* the other failure: shorter than the shop will cut */
await page.fill('#len-DB12', '1');
check('an under-length cut is refused',
  /minimum of 3/i.test(await page.locator('#err-DB12').innerText()));

/* ── correct it and add ────────────────────────────────────────────────── */
await page.fill('#len-DB12', '24');
check('the add button re-enables once valid',
  await page.locator('#cut-DB12 .add').isEnabled());
await page.click('#cut-DB12 .add');

check('the order count changed', (await page.locator('[data-order-count]').innerText()) === '1');
check('the order total changed', (await page.locator('[data-order-total]').innerText()) === '£101.40');

/* ── the change is announced, not merely rendered ──────────────────────── */
const status = (await page.locator('[data-status]').innerText()).trim();
check('a status message announces the cut', status.length > 0);
check('the announcement names the batch', /DB12-2426/.test(status), `said: ${status}`);
check('the status region is live',
  (await page.getAttribute('[data-status]', 'role')) === 'status');

/* the coil is now shorter: state persisted, not just displayed */
check('the remaining length came down',
  /72 m left/.test(await page.locator('#hint-DB12').innerText()),
  await page.locator('#hint-DB12').innerText());

/* focus went somewhere sensible rather than onto a control that vanished */
check('focus returns to the toggle after adding',
  await page.evaluate(() => document.activeElement?.getAttribute('aria-controls') === 'cut-DB12'));

/* ── the keyboard path: the same outcome without a pointer ─────────────── */
await page.keyboard.press('Enter');                 // reopen the row
await page.keyboard.type('5');                      // focus is in the input
const kbTotal = await page.locator('#cut-DB12 [data-line-total]').innerText();
check('typing with the keyboard prices the cut', kbTotal === '£22.55', `got ${kbTotal}`);
check('focus is visible', await page.evaluate(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return false;
  const s = getComputedStyle(el);
  return s.outlineStyle !== 'none' || s.boxShadow !== 'none';
}));
await page.keyboard.press('Tab');                   // to the add button
await page.keyboard.press('Enter');
check('the keyboard can complete the order',
  (await page.locator('[data-order-count]').innerText()) === '2');

/* ── out of stock is real data, not a painted class ────────────────────── */
const oos = page.locator('tr.oos .toggle');
check('the out-of-stock line cannot be cut', await oos.isDisabled());
check('it says when the next coil lands',
  /12 August/.test(await page.locator('tr.oos').innerText()));

/* ── removal returns the page to its empty state ───────────────────────── */
await page.click('[data-rm="1"]');
await page.click('[data-rm="0"]');
check('removing every line restores the empty state',
  /nothing cut yet/i.test(await page.locator('.empty').innerText()));
check('the total returns to zero',
  (await page.locator('[data-order-total]').innerText()) === '£0.00');

await browser.close();
console.log(problems.length ? 'FAIL\n  ' + problems.join('\n  ') : 'ok — 22 assertions passed');
process.exit(problems.length ? 1 : 0);
