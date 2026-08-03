// journeys/fejl-udfoldning.spec.mjs — the five failures open, announce, and close again.
import { chromium } from 'playwright';

const base = process.env.BASE ?? 'http://localhost:5199';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const problems = [];
const check = (name, ok, detail = '') => { if (!ok) problems.push(`${name}${detail ? ': ' + detail : ''}`); };

await page.goto(`${base}/index.html`, { waitUntil: 'networkidle' });

const summaries = page.locator('.faults summary');
const count = await summaries.count();
check('all five failures are present', count === 5, `${count} found`);
check('all five start closed', (await page.locator('.faults details[open]').count()) === 0);

// Open the second one from the keyboard alone.
const secondPanel = page.locator('.faults details').nth(1).locator('.panel');
const second = summaries.nth(1);
await second.focus();
const before = await secondPanel.isVisible();
await page.keyboard.press('Enter');
await page.waitForTimeout(150);
const after = await secondPanel.isVisible();

check('something changed: the panel became visible', before === false && after === true, `${before} -> ${after}`);

// The change has to be announced, not merely painted. A native <details> carries its own
// expanded state, and Chromium publishes it on the summary as a DisclosureTriangle with an
// `expanded` property rather than as a DOM attribute — so the accessibility tree is where
// it has to be read. This is the assertion that would catch someone rebuilding the
// disclosure out of divs.
const expandedInAX = async () => {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Accessibility.enable');
  const { nodes } = await cdp.send('Accessibility.getFullAXTree');
  await cdp.detach();
  const node = nodes.find((n) => n.name?.value?.includes('Mørt pouchlæder') && n.role?.value !== 'StaticText'
    && n.role?.value !== 'InlineTextBox');
  return { role: node?.role?.value ?? null,
    expanded: (node?.properties ?? []).find((x) => x.name === 'expanded')?.value?.value ?? null };
};
const ax = await expandedInAX();
check('the change is announced: the summary is a disclosure and reports itself expanded',
  ax.role === 'DisclosureTriangle' && ax.expanded === true, JSON.stringify(ax));
check('the panel says something specific about that fault', /pouch/i.test(await secondPanel.innerText()));
check('focus stayed on the summary it was on',
  (await page.evaluate(() => document.activeElement?.tagName.toLowerCase())) === 'summary');
check('focus is visible', await page.evaluate(() => {
  const s = getComputedStyle(document.activeElement);
  return s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2;
}));

// They are independent, not an accordion: a reader comparing two faults keeps both open.
await summaries.nth(3).focus();
await page.keyboard.press('Enter');
await page.waitForTimeout(150);
const openNow = await page.locator('.faults details[open]').count();
check('two can be open at once', openNow === 2, `${openNow} open`);

// And it is reversible.
await summaries.nth(1).focus();
await page.keyboard.press('Enter');
await page.waitForTimeout(150);
check('it closes again', (await secondPanel.isVisible()) === false);

await browser.close();
console.log(problems.length ? 'FAIL\n  ' + problems.join('\n  ') : 'ok — the five disclosures open, announce and close');
process.exit(problems.length ? 1 : 0);
