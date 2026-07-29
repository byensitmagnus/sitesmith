// journeys/validation-and-keyboard.spec.mjs
// The three paths a happy-path test never walks: the failure, the domain rule, and the
// keyboard. The domain rule is the reason the board exists — a passage logged outside the
// lock's window is the mistake the whole page is arranged to prevent.
import { chromium } from 'playwright';

const base = process.env.BASE ?? 'http://localhost:4703';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const problems = [];
const check = (name, ok, detail = '') => { if (!ok) problems.push(`${name}${detail ? ': ' + detail : ''}`); };

page.on('pageerror', (e) => problems.push(`page error: ${e.message}`));
await page.goto(`${base}/`, { waitUntil: 'networkidle' });

/* Tab until the given id has focus, so every keyboard assertion is really a keyboard one. */
async function tabTo(id, limit = 30) {
  for (let i = 0; i < limit; i++) {
    if (await page.evaluate(() => document.activeElement?.id) === id) return true;
    await page.keyboard.press('Tab');
  }
  return await page.evaluate(() => document.activeElement?.id) === id;
}

/* ── a lock that cannot be chosen says why ──────────────────────────── */

const welches = page.locator('#f-lock option[value="welches-dam"]');
check('Welches Dam is on the board', await welches.count() === 1);
check('and it cannot be chosen',
  await page.locator('#f-lock').evaluate((s) => s.querySelector('option[value="welches-dam"]').disabled));
check('and it says why', /out of service since 2006/i.test(await welches.innerText()),
  await welches.innerText());

/* ── submit with nothing filled in ──────────────────────────────────── */

await page.getByRole('button', { name: /log the passage/i }).click();

check('nothing was logged', await page.locator('#log-body tr').count() === 0);
check('the log is still empty and still says why', await page.locator('#log-empty').isVisible());
check('an error summary appears', await page.locator('#errsum').isVisible());
check('focus moves to the summary',
  await page.evaluate(() => document.activeElement?.id) === 'errsum');

const items = await page.locator('#errsum-list li').count();
check('every unfilled field is listed', items === 4, `found ${items}`);
const first = await page.locator('#errsum-list li a').first();
check('each item links to its field', (await first.getAttribute('href')) === '#f-boat',
  await first.getAttribute('href'));

check('the field is marked invalid',
  (await page.locator('#f-boat').getAttribute('aria-invalid')) === 'true');
check('and its error is wired to it',
  /\be-boat\b/.test(await page.locator('#f-boat').getAttribute('aria-describedby') ?? ''),
  await page.locator('#f-boat').getAttribute('aria-describedby'));
check('the message is specific, not "required"',
  /Choose the boat/i.test(await page.locator('#e-boat').innerText()),
  await page.locator('#e-boat').innerText());

/* ── the domain rule: a time outside both of the lock's windows ─────── */

await page.selectOption('#f-boat', 'kesteven');
check('the lock followed the boat', (await page.locator('#f-lock').inputValue()) === 'denver');
await page.fill('#f-time', '23:15');
await page.fill('#f-initials', 'JR');
await page.getByRole('button', { name: /log the passage/i }).click();

check('still nothing logged', await page.locator('#log-body tr').count() === 0);
const timeErr = (await page.locator('#e-time').innerText()).replace(/\s+/g, ' ');
check('the error names the first window', /01:12/.test(timeErr) && /09:12/.test(timeErr), timeErr);
check('and the second', /13:38/.test(timeErr) && /21:38/.test(timeErr), timeErr);
check('and quotes the time it rejected', /23:15/.test(timeErr), timeErr);
check('only the time is in error now',
  await page.locator('#errsum-list li').count() === 1,
  `${await page.locator('#errsum-list li').count()} items`);

/* A malformed time is a different message from an out-of-window one. */
await page.fill('#f-time', '25:99');
await page.getByRole('button', { name: /log the passage/i }).click();
check('a malformed time is told apart from an out-of-window time',
  /24-hour/.test(await page.locator('#e-time').innerText()),
  await page.locator('#e-time').innerText());

/* ── the whole task, keyboard only ──────────────────────────────────── */

await page.reload({ waitUntil: 'networkidle' });
await page.evaluate(() => document.body.focus());

check('the boat list is reachable by Tab', await tabTo('f-boat'));
check('focus is visible when it gets there', await page.evaluate(() => {
  const s = getComputedStyle(document.activeElement);
  return s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0;
}));

for (let i = 0; i < 6; i++) await page.keyboard.press('ArrowDown');   // — choose — → Halcyon
check('a boat was chosen without a pointer',
  (await page.locator('#f-boat').inputValue()) === 'halcyon',
  await page.locator('#f-boat').inputValue());
check('and its lock came with it',
  (await page.locator('#f-lock').inputValue()) === 'marmont',
  await page.locator('#f-lock').inputValue());

await page.keyboard.press('Tab');            // lock
await page.keyboard.press('Tab');            // time
await page.keyboard.type('05:30');           // inside Marmont's 03:42–06:12
await page.keyboard.press('Tab');            // keeper
await page.keyboard.type('jr');
await page.keyboard.press('Enter');          // submit

const row = (await page.locator('#log-body tr').first().innerText() ?? '').replace(/\s+/g, ' ');
check('the passage was logged from the keyboard alone',
  await page.locator('#log-body tr').count() === 1, row);
check('with the right time, boat, lock and initials',
  /05:30/.test(row) && /Halcyon/.test(row) && /Marmont/.test(row) && /\bJR\b/.test(row), row);
check('and the announcement followed',
  /Halcyon/.test(await page.locator('#log-status').innerText()));

/* ── the two sheets ─────────────────────────────────────────────────── */

const nightGround = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
await page.getByRole('button', { name: /day sheet/i }).click();
const dayGround = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
check('the day sheet changes the ground', nightGround !== dayGround, `${nightGround} -> ${dayGround}`);
check('and the board opens on the night sheet', /rgb\(11, 15, 18\)/.test(nightGround), nightGround);
check('the button now offers the way back',
  /night sheet/i.test(await page.locator('#sheet-btn').innerText()),
  await page.locator('#sheet-btn').innerText());
await page.getByRole('button', { name: /night sheet/i }).click();
check('and it goes back',
  (await page.evaluate(() => getComputedStyle(document.body).backgroundColor)) === nightGround);

await browser.close();
console.log(problems.length ? 'FAIL\n  ' + problems.join('\n  ') : 'ok — errors, the window rule, the keyboard and both sheets');
process.exit(problems.length ? 1 : 0);
