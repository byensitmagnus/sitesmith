// journeys/phone-slip.spec.mjs
// On a phone there is no disclosure to open: the masthead is four items that fit, and the
// only one that changes is the slip counter. So the counter *is* the navigation, and this
// asserts it reports, it links, and nothing tips the document sideways while it does.
import { chromium } from 'playwright';

const base = process.env.BASE ?? 'http://localhost:5173';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 375, height: 712 }, isMobile: true, hasTouch: true });
const problems = [];
const check = (name, ok, detail = '') => { if (!ok) problems.push(`${name}${detail ? ': ' + detail : ''}`); };

await page.goto(`${base}/`, { waitUntil: 'networkidle' });

const overflow = () => page.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth);

check('the document does not scroll sideways on load', (await overflow()) <= 1);

/* The masthead counter, which is the whole navigation for the slip on a phone. */
const counter = page.locator('.counter');
check('the counter is visible without opening anything', await counter.isVisible());
check('the counter reads zero', /\b0\b/.test(await counter.innerText()), await counter.innerText());
check('the counter links to the slip', await counter.getAttribute('href') === '#slip');
check('the slip it links to exists', await page.locator('#slip').count() === 1);

const box = await counter.boundingBox();
check('the counter clears the 44px touch target', box && box.height >= 44, JSON.stringify(box));

/* Every add button is a real target at this width. */
const addBox = await page.locator('[data-add="pea"]').boundingBox();
check('the primary action clears the 44px touch target', addBox && addBox.height >= 44, JSON.stringify(addBox));

/* Adding from a row updates the masthead, which is two screens away from the slip. */
await page.locator('[data-add="pea"]').click();
check('the masthead counter followed the slip', /\b1\b/.test(await counter.innerText()), await counter.innerText());
check('the slip itself agrees',
  (await page.locator('.slip [data-slip-count]').innerText()).trim() === '1');
check('still no sideways scroll after adding', (await overflow()) <= 1);

/* The nine key drawings stay on the first screen's terms at 375: three across, all present,
   and each one still a real target. */
const keyCells = await page.locator('.key__cell a').count();
check('all nine seeds are still in the key at 375', keyCells === 9, String(keyCells));
const seedBox = await page.locator('.key__cell a').first().boundingBox();
check('a key seed is still a real target at 375', seedBox && seedBox.height >= 44, JSON.stringify(seedBox));

/* Following the counter reaches the slip. */
await counter.click();
await page.waitForTimeout(200);
const slipOnScreen = await page.evaluate(() => {
  const r = document.getElementById('slip').getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
});
check('following the counter puts the slip on screen', slipOnScreen);
check('the slip line survived the trip', await page.locator('.slipline').count() === 1);

await browser.close();
console.log(problems.length ? 'FAIL\n  ' + problems.join('\n  ') : 'ok — journey passed');
process.exit(problems.length ? 1 : 0);
