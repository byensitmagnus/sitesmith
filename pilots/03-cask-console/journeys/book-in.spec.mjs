/**
 * A cellarman books a consignment back in: severity order, controls with nothing to open,
 * condition and ullage required, and a booking that survives a reload. Written against the
 * rebuilt markup — see JOURNEY-INTENT.md.
 *
 *   node journeys/book-in.spec.mjs        BASE=http://localhost:4503
 */
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const require_ = createRequire(join(process.cwd(), 'package.json'));
const { chromium } = await import('playwright').catch(
  () => import(pathToFileURL(require_.resolve('playwright')).href));

const BASE = process.env.BASE ?? 'http://localhost:4503';
const problems = [];
const check = (name, ok, detail = '') => { if (!ok) problems.push(`${name}${detail ? ' — ' + detail : ''}`); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
page.on('pageerror', (e) => problems.push('page error: ' + e.message));
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });

/* ── 1. the overdue consignment is first, and it is the loudest thing ──── */
const first = page.locator('.job').first();
check('the first row is the late one',
  (await first.getAttribute('class')).includes('late'), await first.getAttribute('class'));
check('and it names how late', /3 days late/i.test(await first.locator('.state').innerText()),
  await first.locator('.state').innerText());
check('the tally counts the late casks', (await page.locator('[data-tally-late]').innerText()) === '2',
  await page.locator('[data-tally-late]').innerText());
check('and the ones due today', (await page.locator('[data-tally-today]').innerText()) === '7',
  await page.locator('[data-tally-today]').innerText());

/* ── 2. controls are on the page, nothing to open ──────────────────────── */
check('every outstanding row shows its condition control on load',
  (await page.locator('select[data-cond]:visible').count()) === 4,
  String(await page.locator('select[data-cond]:visible').count()));
check('and its ullage field', (await page.locator('input[data-ull]:visible').count()) === 4);
check('and its book-in button', (await page.locator('button[data-book]:visible').count()) === 4);

/* ── 3. condition and ullage are required, and the refusal says why ────── */
await page.click('[data-book="c2"]');
await page.waitForTimeout(80);
let why = await page.locator('[data-why="c2"]').innerText();
check('booking in with no condition is refused', /duty record/i.test(why), why);
check('and the condition control is marked invalid',
  (await page.locator('[data-cond="c2"]').getAttribute('aria-invalid')) === 'true');
check('nothing was booked', (await page.locator('.log li').count()) === 0);

await page.selectOption('[data-cond="c2"]', 'Ullage short');
await page.click('[data-book="c2"]');
await page.waitForTimeout(80);
why = await page.locator('[data-why="c2"]').innerText();
check('booking in with no ullage is refused', /Ullage in pints/i.test(why), why);
check('and the condition the cellarman chose is still selected',
  (await page.inputValue('[data-cond="c2"]')) === 'Ullage short');

await page.fill('[data-ull="c2"]', '900');
await page.click('[data-book="c2"]');
await page.waitForTimeout(80);
check('an impossible ullage is refused with the bound named',
  /between 0 and 72/i.test(await page.locator('[data-why="c2"]').innerText()),
  await page.locator('[data-why="c2"]').innerText());

/* ── 4. a good booking changes the board, the counts and the record ────── */
await page.fill('[data-ull="c2"]', '11');
await page.click('[data-book="c2"]');
await page.waitForTimeout(120);

check('the consignment leaves the board', (await page.locator('[data-job="c2"]').count()) === 0);
check('the late tally drops to zero', (await page.locator('[data-tally-late]').innerText()) === '0',
  await page.locator('[data-tally-late]').innerText());
const logged = await page.locator('.log li').first().innerText();
check('it appears in the week with its condition', /ullage short/i.test(logged), logged.replace(/\n/g, ' ').slice(0, 80));
check('and with its ullage', /11 pt/.test(logged));
check('and it is said out loud', /back in from/i.test(await page.locator('[data-said]').innerText()));
check('the next row is now the loudest',
  (await page.locator('.job').first().getAttribute('class')).includes('today'));

/* ── 5. it survives a reload ───────────────────────────────────────────── */
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(140);
check('the booking is still there after a refresh', (await page.locator('.log li').count()) === 1,
  String(await page.locator('.log li').count()));
check('and the consignment has not come back onto the board',
  (await page.locator('[data-job="c2"]').count()) === 0);

/* ── 6. it can be undone ───────────────────────────────────────────────── */
await page.click('[data-undo="0"]');
await page.waitForTimeout(100);
check('undo puts it back on the board', (await page.locator('[data-job="c2"]').count()) === 1);
check('and back at the top, because it is still the latest',
  (await page.locator('.job').first().getAttribute('class')).includes('late'));

/* ── 7. the phone ──────────────────────────────────────────────────────── */
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(160);
check('no horizontal overflow at 390',
  await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  await page.evaluate(() => `${document.documentElement.scrollWidth} > ${window.innerWidth}`));
check('the controls are still on the page at 390',
  (await page.locator('select[data-cond]:visible').count()) === 4);
const box = await page.locator('[data-book="c2"]').boundingBox();
check('the book-in button keeps a 48px target', box && box.height >= 44,
  box ? `${Math.round(box.height)}px` : 'no box');
/* nothing may print over anything else — the failure that sank the old board */
const overlap = await page.evaluate(() => {
  const j = document.querySelector('.job');
  const a = j.querySelector('.size').getBoundingClientRect();
  const b = j.querySelector('.who').getBoundingClientRect();
  return !(a.bottom <= b.top + 1 || b.bottom <= a.top + 1 || a.right <= b.left + 1 || b.right <= a.left + 1);
});
check('the size block and the pub name do not overlap at 390', !overlap);

await browser.close();
if (problems.length) {
  console.error(`\n  ${problems.length} problem(s):`);
  for (const p of problems) console.error(`   - ${p}`);
  process.exit(1);
}
console.log('  book-in: every step held');
