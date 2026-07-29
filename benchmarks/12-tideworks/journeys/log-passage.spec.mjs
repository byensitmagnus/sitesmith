// journeys/log-passage.spec.mjs
// The one thing this board exists to cause: a passage written into the shift's log.
// Empty to done, with a pointer, asserting every observable change INTERACTIONS.md claims.
import { chromium } from 'playwright';

const base = process.env.BASE ?? 'http://localhost:4703';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const problems = [];
const check = (name, ok, detail = '') => { if (!ok) problems.push(`${name}${detail ? ': ' + detail : ''}`); };

page.on('pageerror', (e) => problems.push(`page error: ${e.message}`));
await page.goto(`${base}/`, { waitUntil: 'networkidle' });

/* ── before ─────────────────────────────────────────────────────────── */

check('the log opens empty and says why',
  /No passages logged this shift/.test(await page.locator('#log-empty').innerText()));
check('the log table is not shown while it is empty',
  await page.locator('#log-wrap').isHidden());

const boatsBefore = await page.locator('#queue .q').count();
check('six boats are waiting', boatsBefore === 6, `found ${boatsBefore}`);
check('the section marker counts them',
  (await page.locator('#queue-count').innerText()).trim().toLowerCase() === '6 boats');
check("Salter's Lode shows one boat waiting",
  (await page.locator('[data-waiting="salters-lode"]').innerText()).trim() === '1 waiting');
check('Denver shows three',
  (await page.locator('[data-waiting="denver"]').innerText()).trim() === '3 waiting');

/* The instrument is on the first screen and is the largest thing on it. */
const chart = await page.locator('.tidechart').boundingBox();
check('the tide instrument sits inside the first screen', chart && chart.y + chart.height < 900,
  chart ? `bottom at ${Math.round(chart.y + chart.height)}px` : 'no .tidechart');

/* ── the task ───────────────────────────────────────────────────────── */

await page.selectOption('#f-boat', 'marigold');
check('choosing a boat fills in the lock she is waiting for',
  (await page.locator('#f-lock').inputValue()) === 'salters-lode',
  await page.locator('#f-lock').inputValue());

await page.fill('#f-time', '05:06');
await page.fill('#f-initials', 'mo');
await page.getByRole('button', { name: /log the passage/i }).click();

/* ── after ──────────────────────────────────────────────────────────── */

check('the empty state is gone', await page.locator('#log-empty').isHidden());
check('the log table is shown', await page.locator('#log-wrap').isVisible());

const rows = await page.locator('#log-body tr').count();
check('one passage is logged', rows === 1, `found ${rows}`);
const row = (await page.locator('#log-body tr').first().innerText()).replace(/\s+/g, ' ');
check('the row carries the time', /05:06/.test(row), row);
check('the row carries the boat', /Marigold/.test(row), row);
check('the row carries the lock', /Salter/.test(row), row);
check('the row carries the initials, upper-cased', /\bMO\b/.test(row), row);

const boatsAfter = await page.locator('#queue .q').count();
check('the boat has left the queue', boatsAfter === 5, `found ${boatsAfter}`);
check('Marigold specifically', await page.locator('#queue [data-boat="marigold"]').count() === 0);
check('the queue renumbered to five',
  (await page.locator('#queue-count').innerText()).trim().toLowerCase() === '5 boats');
check("Salter's Lode now shows none waiting",
  (await page.locator('[data-waiting="salters-lode"]').innerText()).trim() === 'none waiting');
check('Denver is untouched',
  (await page.locator('[data-waiting="denver"]').innerText()).trim() === '3 waiting');
check('she is no longer offered in the boat list',
  await page.locator('#f-boat option[value="marigold"]').count() === 0);

const status = (await page.locator('#log-status').innerText()).replace(/\s+/g, ' ');
check('the change is announced', status.length > 0, 'role=status is empty');
check('the announcement names the boat, the lock and the time',
  /Marigold/.test(status) && /Salter/.test(status) && /05:06/.test(status), status);
check('the announcement gives the new queue depth', /5 boats waiting/.test(status), status);
check('focus lands on the announcement',
  await page.evaluate(() => document.activeElement?.id) === 'log-status');
check('the form is cleared for the next passage',
  (await page.locator('#f-time').inputValue()) === '' &&
  (await page.locator('#f-initials').inputValue()) === '');

/* ── keyboard: focus is visible ─────────────────────────────────────── */

await page.keyboard.press('Tab');
check('focus is visible after tabbing', await page.evaluate(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return false;
  const s = getComputedStyle(el);
  return s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0;
}));

await browser.close();
console.log(problems.length ? 'FAIL\n  ' + problems.join('\n  ') : 'ok — the passage was logged');
process.exit(problems.length ? 1 : 0);
