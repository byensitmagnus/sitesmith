/**
 * journeys/choose-a-hide.spec.mjs
 *
 * The first half of the visitor's job: choose a hide. The page claims that any two of the six
 * can be laid over each other on one baseline, so this drives that claim and asserts what
 * changed in the DOM, what was announced, what happens on the one wrong input there is, and
 * that the whole thing works without a pointer.
 */
import { chromium } from 'playwright';

const base = process.env.BASE ?? 'http://127.0.0.1:4701';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const problems = [];
const check = (name, ok, detail = '') => { if (!ok) problems.push(`${name}${detail ? ': ' + detail : ''}`); };

await page.goto(`${base}/`, { waitUntil: 'networkidle' });

/* ── the resting state ─────────────────────────────────────────────────── */
const resting = await page.locator('[data-out]').innerText();
check('the comparison starts with an instruction, not a result',
  /lay any two/i.test(resting), resting.slice(0, 80));
check('nothing is picked before a choice is made',
  (await page.locator('.row[data-picked]').count()) === 0);
check('Clear is disabled while there is nothing to clear',
  await page.locator('[data-clear]').isDisabled());

/* ── the comparison the brief asks for: 1.2 mm goat against 1.4 mm calf ── */
await page.selectOption('#cmp-a', 'goat');
await page.selectOption('#cmp-b', 'calf');

const after = await page.locator('[data-out]').innerText();
check('the readout changed', after !== resting, `${resting.slice(0, 40)} -> ${after.slice(0, 40)}`);
check('the readout states the difference in millimetres', /0\.2 mm/.test(after), after);
check('the readout also compares temper', /firm/.test(after) && /soft/.test(after), after);
check('the readout gives both lead times',
  /11 months/.test(after) && /4 weeks/.test(after), after);

/* The announcement. A change only a sighted mouse user notices is half built. */
check('the readout is a live region',
  (await page.locator('[data-out]').getAttribute('role')) === 'status');

/* What changed in the drawing. */
check('exactly two rows are marked', (await page.locator('.row[data-picked]').count()) === 2);
check('the goat row is one of them',
  (await page.locator('.row[data-row=goat]').getAttribute('data-picked')) !== null);
check('the plate dims the four that were not chosen',
  (await page.locator('#the-plate').getAttribute('data-active')) !== null);
check('both marked rows carry a visible A or B tag',
  (await page.locator('.row[data-picked] .row__tag:not([hidden])').count()) === 2);

/* The overlay is the whole point: the other leather drawn on this one's baseline. */
const ghost = await page.locator('.row[data-row=goat] .sec__ghost').evaluate((el) => ({
  y: Number(el.getAttribute('y')), h: Number(el.getAttribute('height')),
  shown: getComputedStyle(el).visibility,
}));
check('the goat row carries an overlay at the calf thickness',
  Math.abs(ghost.h - 1.4 * 22) < 0.5, `height ${ghost.h}, expected ${1.4 * 22}`);
check('the overlay stands on the same baseline',
  Math.abs((ghost.y + ghost.h) - 84) < 0.5, `foot at ${ghost.y + ghost.h}`);
check('the overlay is visible', ghost.shown === 'visible', ghost.shown);

/* Choosing on the plate carries into the enquiry: it is the same decision. */
check('the enquiry form is prefilled with the leather that was chosen',
  (await page.locator('#enq-leather').inputValue()) === 'goat');

/* ── the failure path ──────────────────────────────────────────────────── */
await page.selectOption('#cmp-b', 'goat');
const bad = await page.locator('[data-out]').innerText();
check('laying a hide over itself is refused', /different/i.test(bad), bad);
check('the refusal is marked as an error state',
  (await page.locator('[data-out]').getAttribute('data-state')) === 'error');
check('and the overlay is taken off the plate',
  (await page.locator('.row[data-picked]').count()) === 0);
check('but Clear is still offered as the way out',
  !(await page.locator('[data-clear]').isDisabled()));

/* ── the same outcome without a pointer ────────────────────────────────── */
await page.locator('#cmp-a').focus();
await page.locator('#cmp-a').selectOption('sheep');
await page.keyboard.press('Tab');                     // to the second select
await page.locator('#cmp-b').selectOption('shoulder');
const kb = await page.locator('[data-out]').innerText();
check('the keyboard reaches the same comparison', /2\.4 mm/.test(kb), kb);

await page.keyboard.press('Tab');                     // to Clear
const focused = await page.evaluate(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const s = getComputedStyle(el);
  return { tag: el.tagName, label: (el.textContent || '').trim().slice(0, 20),
           ring: s.outlineStyle !== 'none' || s.boxShadow !== 'none' };
});
check('focus lands on Clear', focused && /clear/i.test(focused.label), JSON.stringify(focused));
check('and the focus ring is visible', focused && focused.ring);

await page.keyboard.press('Enter');
check('Enter on Clear puts the plate back',
  (await page.locator('#the-plate').getAttribute('data-active')) === null);
check('and the readout returns to its instruction',
  /lay any two/i.test(await page.locator('[data-out]').innerText()));
check('and focus moves back to the first select',
  await page.evaluate(() => document.activeElement?.id === 'cmp-a'));

await browser.close();
console.log(problems.length ? 'FAIL\n  ' + problems.join('\n  ') : 'ok — choosing a hide works end to end');
process.exit(problems.length ? 1 : 0);
