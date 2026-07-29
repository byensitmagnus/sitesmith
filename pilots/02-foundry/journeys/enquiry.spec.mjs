/**
 * A parish enquires about a ring, gets it wrong, keeps what it typed, and gets a real success
 * state. Plus the thing the page argues: before and after has to be a change you can watch,
 * not two columns of figures. Written against the rebuilt markup — see JOURNEY-INTENT.md.
 *
 *   node journeys/enquiry.spec.mjs        BASE=http://localhost:4502
 */
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const require_ = createRequire(join(process.cwd(), 'package.json'));
const { chromium } = await import('playwright').catch(
  () => import(pathToFileURL(require_.resolve('playwright')).href));

const BASE = process.env.BASE ?? 'http://localhost:4502';
const problems = [];
const check = (name, ok, detail = '') => { if (!ok) problems.push(`${name}${detail ? ' — ' + detail : ''}`); };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', (e) => problems.push('page error: ' + e.message));
await page.goto(BASE, { waitUntil: 'networkidle' });

/* ── 1. the enquiry is reachable from the first screen ──────────────────── */
const cta = page.locator('.cta');
check('an enquiry route is above the fold', await cta.isVisible());
const ctaBox = await cta.boundingBox();
check('and it is within the first screen', ctaBox && ctaBox.y < 900,
  ctaBox ? `${Math.round(ctaBox.y)}px` : 'no box');

/* ── 2. before and after is a change, not two static columns ───────────── */
const hum = page.locator('[data-v="0"]');
check('the hum starts 38 cents flat', /−38/.test(await hum.innerText()), await hum.innerText());
const beforeWidth = await page.locator('[data-bar="0"] i').evaluate((e) => e.style.width);
const beforeSum = await page.locator('.sum').innerText();
check('the summary names the worst partial before', /37|38/.test(beforeSum), beforeSum);

await page.click('[data-state="after"]');
await page.waitForTimeout(550);
check('after tuning the hum reads 2 cents flat', /−2/.test(await hum.innerText()), await hum.innerText());
const afterWidth = await page.locator('[data-bar="0"] i').evaluate((e) => e.style.width);
check('and the bar actually moved', beforeWidth !== afterWidth, `${beforeWidth} -> ${afterWidth}`);
check('the summary changes with it',
  /gone for good/.test(await page.locator('.sum').innerText()));
check('the switch records which state is shown',
  (await page.locator('[data-state="after"]').getAttribute('aria-pressed')) === 'true');

/* ── 3. an invalid submission names the field and keeps what was typed ─── */
await page.fill('#tower', 'St Æthelburga, Bishopsgate');
await page.fill('#bells', '19');
await page.fill('#email', 'not-an-address');
await page.click('.send');
await page.waitForTimeout(90);

check('a ring of nineteen is refused with the bound named',
  /Between 1 and 16/i.test(await page.locator('[data-msg="bells"]').innerText()),
  await page.locator('[data-msg="bells"]').innerText());
check('the bad email is named too',
  (await page.locator('[data-msg="email"]').innerText()).length > 0);
check('the faculty question is required',
  (await page.locator('[data-msg="faculty"]').innerText()).length > 0);
check('the tower the parish typed is still there',
  (await page.inputValue('#tower')) === 'St Æthelburga, Bishopsgate', await page.inputValue('#tower'));
check('focus moved to the first field that is wrong',
  (await page.evaluate(() => document.activeElement?.id)) === 'bells',
  await page.evaluate(() => document.activeElement?.id));
check('nothing was reported as sent',
  !(await page.locator('[data-sent]').evaluate((e) => e.classList.contains('on'))));

/* ── 4. a valid submission produces a success state that repeats it back ─ */
await page.fill('#bells', '8');
await page.fill('#email', 'warden@example.org');
await page.selectOption('#faculty', 'applied');
await page.fill('#wrong', 'The third sounds sour.');
await page.click('.send');
await page.waitForTimeout(120);

check('the enquiry reports itself sent',
  await page.locator('[data-sent]').evaluate((e) => e.classList.contains('on')));
const echo = await page.locator('[data-echo]').innerText();
check('the success state repeats the tower', /Bishopsgate/.test(echo), echo.slice(0, 60));
check('and the number of bells', /\b8\b/.test(echo));
check('and where the faculty stands', /Applied for, waiting/i.test(echo));
check('and what the parish said was wrong', /sounds sour/i.test(echo));
check('the invalid markers are cleared',
  (await page.locator('[data-msg="bells"]').innerText()).trim() === '');

/* ── 5. the phone ───────────────────────────────────────────────────────── */
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(140);
check('no horizontal overflow at 390',
  await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  await page.evaluate(() => `${document.documentElement.scrollWidth} > ${window.innerWidth}`));
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(160);
const mCta = await page.locator('.cta').boundingBox();
check('the enquiry route is still on the first screen at 390',
  mCta && mCta.y < 844, mCta ? `${Math.round(mCta.y)}px` : 'no box');
const h1 = await page.locator('h1').boundingBox();
check('and the headline is not clipped by the fold', h1 && h1.y + h1.height < 844,
  h1 ? `${Math.round(h1.y + h1.height)}px` : 'no box');

await browser.close();
if (problems.length) {
  console.error(`\n  ${problems.length} problem(s):`);
  for (const p of problems) console.error(`   - ${p}`);
  process.exit(1);
}
console.log('  enquiry: every step held');
