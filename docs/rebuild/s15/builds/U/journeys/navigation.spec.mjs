// journeys/navigation.spec.mjs — every nav link lands somewhere, and marks where it landed.
import { chromium } from 'playwright';

const base = process.env.BASE ?? 'http://localhost:5199';
const browser = await chromium.launch();
const problems = [];
const check = (name, ok, detail = '') => { if (!ok) problems.push(`${name}${detail ? ': ' + detail : ''}`); };

const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
await page.goto(`${base}/index.html`, { waitUntil: 'networkidle' });

const hrefs = await page.locator('.nav a').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
check('the nav has five destinations', hrefs.length === 5, `${hrefs.length}`);

for (const href of hrefs) {
  const id = String(href).replace('#', '');
  const found = await page.evaluate((x) => !!document.getElementById(x), id);
  check(`#${id} exists in the document`, found);
}

// Nothing about this layout makes the document scroll sideways on a phone.
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
check('no horizontal document scroll at 375', overflow <= 0, `${overflow}px over`);

// The failure path this page actually has: a fragment naming no section must leave every
// numeral unmarked rather than marking the wrong one.
await page.goto(`${base}/index.html#findes-ikke`, { waitUntil: 'networkidle' });
const marked = await page.evaluate(() => {
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  const rgb = (() => { const d = document.createElement('span'); d.style.color = accent; document.body.append(d);
    const c = getComputedStyle(d).color; d.remove(); return c; })();
  return [...document.querySelectorAll('.num')].filter((n) => getComputedStyle(n).color === rgb).length;
});
check('an unknown fragment marks nothing', marked === 0, `${marked} marked`);

// Keyboard: tab to a nav link, activate it, and the section it names becomes the target.
await page.goto(`${base}/index.html`, { waitUntil: 'networkidle' });
const before = await page.evaluate(() => document.querySelectorAll('section:target').length);
await page.locator('.nav a[href="#priser"]').focus();
await page.keyboard.press('Enter');
await page.waitForTimeout(250);
const after = await page.evaluate(() => document.querySelector('section:target')?.id ?? null);
check('something changed: the target section is now #priser', before === 0 && after === 'priser', `${before} -> ${after}`);
check('the change is visible: the numeral took the accent', await page.evaluate(() => {
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  const d = document.createElement('span'); d.style.color = accent; document.body.append(d);
  const rgb = getComputedStyle(d).color; d.remove();
  const num = document.querySelector('#priser .num');
  return !!num && getComputedStyle(num).color === rgb;
}));

await browser.close();
console.log(problems.length ? 'FAIL\n  ' + problems.join('\n  ') : 'ok — the five section links resolve and mark');
process.exit(problems.length ? 1 : 0);
