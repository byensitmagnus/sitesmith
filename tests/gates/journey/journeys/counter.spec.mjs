/**
 * The four things a journey must assert: something changed, the change was announced, the
 * failure path, and the keyboard path. Run against the working page it passes; against the
 * painted page — which is pixel-identical in a screenshot — every one of them fails.
 */
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
const require_ = createRequire(join(process.cwd(), 'package.json'));
const { chromium } = await import('playwright').catch(
  () => import(pathToFileURL(require_.resolve('playwright')).href));

const BASE = process.env.BASE;
const problems = [];
const check = (n, ok, d = '') => { if (!ok) problems.push(`${n}${d ? ' — ' + d : ''}`); };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(BASE, { waitUntil: 'load' });

// 1. something changed
const before = await page.locator('[data-total]').innerText();
await page.fill('#len', '24');
const after = await page.locator('[data-total]').innerText();
check('the total responds to the length', before !== after, `${before} -> ${after}`);

// 2. the failure path, with the real limit named
await page.fill('#len', '400');
const err = (await page.locator('#err').innerText()).trim();
check('an over-length cut is refused', err.length > 0);
check('the refusal names the limit', /96/.test(err), err || '(nothing said)');
check('the field is marked invalid',
  (await page.getAttribute('#len', 'aria-invalid')) === 'true');
check('the action is blocked while invalid', await page.locator('[data-add]').isDisabled());

// 3. the change is announced
await page.fill('#len', '24');
await page.click('[data-add]');
const status = (await page.locator('[data-status]').innerText()).trim();
check('a status message announces the result', status.length > 0);
check('the announcement is specific', /24 m/.test(status), status || '(silent)');

// 4. the keyboard path
await page.focus('#len');
await page.keyboard.type('12');
check('typing prices the cut',
  (await page.locator('[data-total]').innerText()) === '£51.60',
  await page.locator('[data-total]').innerText());
check('focus is visible', await page.evaluate(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return false;
  const s = getComputedStyle(el);
  return s.outlineStyle !== 'none' || s.boxShadow !== 'none';
}));

await browser.close();
console.log(problems.length ? 'FAIL\n  ' + problems.join('\n  ') : 'ok — 9 assertions passed');
process.exit(problems.length ? 1 : 0);
