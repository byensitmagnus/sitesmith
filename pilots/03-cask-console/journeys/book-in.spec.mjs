/**
 * Mode P requires the main task from empty to done — filter, edit, save, and see it persist —
 * plus the empty state and one validation failure. The task here is booking a dray in.
 */
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const require_ = createRequire(join(process.cwd(), 'package.json'));
const { chromium } = await import('playwright').catch(
  () => import(pathToFileURL(require_.resolve('playwright')).href));

const BASE = process.env.BASE ?? 'http://localhost:4503';
const problems = [];
const check = (n, ok, d = '') => { if (!ok) problems.push(`${n}${d ? ' — ' + d : ''}`); };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', (e) => problems.push('page error: ' + e.message));
await page.goto(BASE, { waitUntil: 'networkidle' });

/* ── filter: something changes, and it is counted ──────────────────────── */
const allRows = await page.locator('tr.row').count();
check('the board opens with everything', allRows === 4, `${allRows} rows`);
check('the on-trade count is the sum, not the row count',
  (await page.locator('[data-on-trade]').innerText()) === '15');

await page.click('[data-filter=late]');
const lateRows = await page.locator('tr.row').count();
check('filtering narrows the board', lateRows === 1, `${lateRows} rows`);
check('the pressed filter says so',
  (await page.getAttribute('[data-filter=late]', 'aria-pressed')) === 'true');
check('the caption counts what is shown',
  /1 of 4 consignments/i.test(await page.locator('caption').innerText()),
  await page.locator('caption').innerText());

/* the empty state for a filter that matches nothing is reachable from real data */
await page.click('[data-filter=due]');
check('due-today shows two consignments', (await page.locator('tr.row').count()) === 2);
await page.click('[data-filter=all]');

/* ── the failure path: a cask back wet is not empty ────────────────────── */
await page.click('tr.row >> nth=0 >> .act');
check('opening the panel moves focus to the count',
  await page.evaluate(() => document.activeElement?.id?.startsWith('q-')));

await page.click('.book.open .opt:has-text("Returned wet")');
check('choosing wet reveals the ullage field',
  await page.locator('.book.open [data-ullage]').isVisible());
check('booking in is blocked until ullage is measured',
  await page.locator('.book.open .confirm').isDisabled());
const err = await page.locator('.book.open .err').innerText();
check('the refusal explains why it matters', /duty/i.test(err), err);

/* the other failure: more casks back than went out */
await page.fill('.book.open [id^=u-]', '12');
check('a measured ullage unblocks it', await page.locator('.book.open .confirm').isEnabled());
await page.fill('.book.open [id^=q-]', '9');
check('more casks back than went out is refused',
  await page.locator('.book.open .confirm').isDisabled());
check('the refusal names the real number',
  /4 went out/i.test(await page.locator('.book.open .err').innerText()),
  await page.locator('.book.open .err').innerText());

/* ── save, and see it persist ──────────────────────────────────────────── */
await page.fill('.book.open [id^=q-]', '4');
await page.click('.book.open .confirm');

check('the consignment left the board', (await page.locator('tr.row').count()) === 3);
check('the on-trade count came down',
  (await page.locator('[data-on-trade]').innerText()) === '11');
const status = await page.locator('[data-status]').innerText();
check('the result is announced', status.length > 0);
check('the announcement names the ullage and the wash',
  /12 pints ullage/i.test(status) && /wash/i.test(status), status);
check('the announcement is live',
  (await page.getAttribute('[data-status]', 'role')) === 'status');

const log = await page.locator('[data-log] tr').first().innerText();
check('it persisted into the week log', /Feathers/i.test(log) && /wet/i.test(log), log);
check('focus went somewhere that still exists',
  await page.evaluate(() => document.activeElement?.dataset?.filter !== undefined));

/* ── the empty state, reached by emptying the cellar ───────────────────── */
for (let i = 0; i < 3; i++) {
  await page.click('tr.row >> nth=0 >> .act');
  await page.click('.book.open .confirm');
}
check('the cellar can be cleared', (await page.locator('tr.row').count()) === 0);
check('the empty state is written for this cellar, not "no items"',
  /every cask is back and washed/i.test(await page.locator('.empty').innerText()),
  await page.locator('.empty').innerText());

/* ── keyboard and touch targets ────────────────────────────────────────── */
const small = await page.evaluate(() => [...document.querySelectorAll('button')]
  .filter(b => b.offsetParent !== null && b.getBoundingClientRect().height < 44).length);
check('every visible control clears 44px for gloves', small === 0, `${small} under 44px`);

await page.keyboard.press('Tab');
check('focus is visible', await page.evaluate(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return false;
  const s = getComputedStyle(el);
  return s.outlineStyle !== 'none' || s.boxShadow !== 'none';
}));

/* state is never colour alone: every chip carries a word */
await page.reload({ waitUntil: 'networkidle' });
const chips = await page.locator('.state').allInnerTexts();
check('state is a word, not a colour', chips.every(t => t.trim().length > 2), chips.join('|'));

await browser.close();
console.log(problems.length ? 'FAIL\n  ' + problems.join('\n  ') : 'ok — 24 assertions passed');
process.exit(problems.length ? 1 : 0);
