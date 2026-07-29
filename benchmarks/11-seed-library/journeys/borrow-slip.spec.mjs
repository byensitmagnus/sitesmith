// journeys/borrow-slip.spec.mjs
// The one thing this page exists to do: build a slip of up to six packets and understand,
// while you build it, what each one is asking of you in autumn.
import { chromium } from 'playwright';

const base = process.env.BASE ?? 'http://localhost:5173';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const problems = [];
const check = (name, ok, detail = '') => { if (!ok) problems.push(`${name}${detail ? ': ' + detail : ''}`); };

const consoleErrors = [];
page.on('pageerror', (e) => consoleErrors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });

await page.goto(`${base}/`, { waitUntil: 'networkidle' });

const count = page.locator('.slip [data-slip-count]');
const status = page.locator('[data-status]');
const add = (id) => page.locator(`[data-add="${id}"]`);

/* ── the empty state says why it is empty and offers what fills it ───── */

check('the slip opens empty', (await count.innerText()).trim() === '0');
const empty = await page.locator('.slip__empty').innerText();
check('the empty state explains itself', /add up to six packets/i.test(empty), empty.slice(0, 60));
check('the empty state offers a way out of it',
  await page.locator('.slip__empty a[href="#row-runner-bean"]').count() === 1);

/* ── 1. something changed ────────────────────────────────────────────── */

await add('runner-bean').click();
check('the count changed', (await count.innerText()).trim() === '1');
check('the button became its own undo',
  /take it off/i.test(await add('runner-bean').innerText()));
const firstLine = await page.locator('.slipline').first().innerText();
check('the slip line carries the crop', /Runner bean/.test(firstLine), firstLine.replace(/\s+/g, ' '));
check('the slip line carries what to do in autumn',
  /rattle/i.test(firstLine), firstLine.replace(/\s+/g, ' '));
check('the slip line carries the seed drawing',
  await page.locator('.slipline .seed--slip').count() === 1);

/* ── 2. the change is announced ──────────────────────────────────────── */

const said = (await status.innerText()).trim();
check('a status message announces the result', /Runner bean/.test(said) && /1 of 6/.test(said), said);

/* ── the hard crops say so, on the slip, in the library's own words ──── */

await add('kale').click();
const kaleLine = await page.locator('.slipline--cross').first().innerText();
check('a crossing crop is marked as one on the slip',
  /within a mile/i.test(kaleLine), kaleLine.replace(/\s+/g, ' '));
check('the crossing note is not carried by colour alone',
  await page.locator('.slipline--cross .slipline__do').innerText().then((t) => t.trim().length > 10));

/* ── 3. the failure path: six a visit, and it says why ───────────────── */

for (const id of ['pea', 'tomato', 'lettuce', 'french-bean']) await add(id).click();
check('six packets are on the slip', (await count.innerText()).trim() === '6');
check('the full state is stated', /that is a visit/i.test(await page.locator('.slip__full').innerText()));

const seventh = add('squash');
check('the seventh add is marked unavailable',
  await seventh.getAttribute('aria-disabled') === 'true');
check('the seventh add is still reachable by keyboard',
  await seventh.evaluate((el) => !el.disabled && el.tabIndex >= 0));
// force: the button is aria-disabled rather than disabled, so a real pointer or Enter still
// reaches it — that is the point, because a disabled control cannot tell you why it is dead.
// Playwright's actionability guard honours aria-disabled, so it has to be told.
await seventh.click({ force: true });
check('the count did not move past six', (await count.innerText()).trim() === '6');
const capped = (await status.innerText()).trim();
check('the cap explains itself', /six packets a visit/i.test(capped), capped);

/* ── reversible, and focus goes somewhere sensible ───────────────────── */

await page.locator('[data-off="kale"]').click();
check('taking one off decrements the count', (await count.innerText()).trim() === '5');
check('the un-capped button is available again',
  await add('squash').getAttribute('aria-disabled') === 'false');
check('focus moved to the slip heading, because the control it was on is gone',
  await page.evaluate(() => document.activeElement?.id === 'slip-h'));

await page.locator('[data-clear]').click();
check('clearing empties the slip', (await count.innerText()).trim() === '0');
check('the empty state comes back', await page.locator('.slip__empty').count() === 1);
check('clearing is announced', /cleared/i.test(await status.innerText()));
check('every row button reset',
  await page.locator('[data-add].is-on').count() === 0);

/* ── 4. the keyboard path, with focus visible ────────────────────────── */

// Reached by Tab, not by script: :focus-visible is a keyboard heuristic, and a ring that
// only a programmatic focus() can produce is not a ring anybody sees.
await add('pea').focus();
await page.keyboard.press('Tab');
check('Tab moves from one entry\'s action to the next',
  await page.evaluate(() => document.activeElement?.getAttribute('data-add')) === 'tomato');
const ring = await page.evaluate(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const s = getComputedStyle(el);
  return { outline: s.outlineStyle, width: s.outlineWidth, colour: s.outlineColor };
});
check('focus is visible on the primary action', ring && ring.outline !== 'none', JSON.stringify(ring));
await page.keyboard.press('Enter');
check('Enter adds the packet', (await count.innerText()).trim() === '1');
check('focus stayed on the button, so the next Enter is an undo',
  await page.evaluate(() => document.activeElement?.getAttribute('data-add') === 'tomato'));
await page.keyboard.press('Enter');
check('a second Enter undoes it rather than double-adding',
  (await count.innerText()).trim() === '0');

/* ── the key at the top is navigation, and it lands on the entry ─────── */

await page.locator('.key__cell a[href="#row-beetroot"]').click();
await page.waitForTimeout(120);
check('jumping from the key focuses the entry itself',
  await page.evaluate(() => document.activeElement?.id === 'row-beetroot'));

check('no page errors', consoleErrors.length === 0, consoleErrors.join(' | '));

await browser.close();
console.log(problems.length ? 'FAIL\n  ' + problems.join('\n  ') : 'ok — journey passed');
process.exit(problems.length ? 1 : 0);
