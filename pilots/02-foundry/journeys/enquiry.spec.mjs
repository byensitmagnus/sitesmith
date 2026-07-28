/**
 * Mode M requires two journeys: the primary action end to end, and the mobile navigation
 * actually opening, closing and returning focus. Both are here.
 */
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const require_ = createRequire(join(process.cwd(), 'package.json'));
const { chromium } = await import('playwright').catch(
  () => import(pathToFileURL(require_.resolve('playwright')).href));

const BASE = process.env.BASE ?? 'http://localhost:4502';
const problems = [];
const check = (n, ok, d = '') => { if (!ok) problems.push(`${n}${d ? ' — ' + d : ''}`); };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', (e) => problems.push('page error: ' + e.message));
await page.goto(BASE, { waitUntil: 'networkidle' });

/* ── the failure path first: an empty form must refuse, specifically ───── */
await page.click('button.send');
check('an empty enquiry is refused', await page.locator('#summary').isVisible());
const listed = await page.locator('#summary-list li').count();
check('every missing field is listed', listed === 4, `listed ${listed}`);
check('focus moves to the summary',
  await page.evaluate(() => document.activeElement?.id === 'summary'));
check('the first field is marked invalid',
  (await page.getAttribute('#tower', 'aria-invalid')) === 'true');
check('the message says what to write, not "required"',
  /dedication and a village/i.test(await page.locator('#tower-msg').innerText()));

/* a summary link takes you to the field it is about */
await page.click('#summary-list a >> nth=1');
check('a summary link moves focus to its field',
  await page.evaluate(() => document.activeElement?.id === 'bells'));

/* ── field-level validation, with the real limit named ─────────────────── */
await page.fill('#tower', "St Æthelburga's, Marram");
await page.fill('#bells', '20');
await page.selectOption('#faculty', 'applied');
await page.fill('#email', 'not-an-address');
await page.click('button.send');
check('an out-of-range ring is refused',
  /between 1 and 16/i.test(await page.locator('#bells-msg').innerText()));
check('a malformed email is refused',
  /email/i.test(await page.locator('#email-msg').innerText()));
check('nothing was submitted while invalid', !(await page.locator('#done').isVisible()));

/* ── correct it, and the enquiry completes ─────────────────────────────── */
await page.fill('#bells', '8');
await page.fill('#email', 'tower@marram-pcc.org.uk');
await page.click('button.send');

check('the confirmation appears', await page.locator('#done').isVisible());
check('the error summary is gone', !(await page.locator('#summary').isVisible()));
const detail = await page.locator('#done-detail').innerText();
check('the confirmation repeats what was sent',
  /8 bells/.test(detail) && /Marram/.test(detail) && /applied for/i.test(detail), detail);
check('the confirmation is a live region',
  (await page.getAttribute('#done', 'role')) === 'status');
check('focus moves to the confirmation',
  await page.evaluate(() => document.activeElement?.id === 'done'));
check('the send button cannot be pressed twice',
  await page.locator('button.send').isDisabled());
check('no field is left marked invalid',
  (await page.locator('[aria-invalid=true]').count()) === 0);

/* ── the mobile navigation ─────────────────────────────────────────────── */
const phone = await browser.newPage({ viewport: { width: 375, height: 780 } });
await phone.goto(BASE, { waitUntil: 'networkidle' });
check('the nav is closed on load', !(await phone.locator('#nav').isVisible()));
check('the toggle says so',
  (await phone.getAttribute('.navtoggle', 'aria-expanded')) === 'false');

await phone.click('.navtoggle');
check('the nav opens', await phone.locator('#nav').isVisible());
check('aria-expanded flips',
  (await phone.getAttribute('.navtoggle', 'aria-expanded')) === 'true');
check('focus enters the nav',
  await phone.evaluate(() => document.getElementById('nav').contains(document.activeElement)));

await phone.keyboard.press('Escape');
check('escape closes it', !(await phone.locator('#nav').isVisible()));
check('focus returns to the toggle',
  await phone.evaluate(() => document.activeElement?.classList.contains('navtoggle')));

/* the drawing is still present on a phone — it is the direction, not decoration */
check('the standing drawing survives at 375',
  await phone.locator('[data-asset=bell-profile]').isVisible());

await browser.close();
console.log(problems.length ? 'FAIL\n  ' + problems.join('\n  ') : 'ok — 21 assertions passed');
process.exit(problems.length ? 1 : 0);
