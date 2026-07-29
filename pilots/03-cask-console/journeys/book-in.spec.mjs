/**
 * JOURNEY — book a consignment back in.
 *
 *   BASE=http://127.0.0.1:8787 node journeys/book-in.spec.mjs
 *
 * Drives JOURNEY-INTENT.md end to end and exits non-zero with a list of
 * problems. Names no colour and no pixel value: it asserts behaviour and
 * ordering, which is what the brief made non-negotiable.
 */
const { chromium } = await import('playwright');

const BASE = process.env.BASE || 'http://127.0.0.1:8787';
const problems = [];
const fail = (m) => problems.push(m);
const ok = (cond, m) => { if (!cond) fail(m); };

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage({ viewport: { width: 1440, height: 900 } });
await page.setViewportSize({ width: 1440, height: 900 });

page.on('console', (m) => { if (m.type() === 'error') fail(`console error: ${m.text()}`); });
page.on('pageerror', (e) => fail(`page error: ${e.message}`));
page.on('requestfailed', (r) => fail(`failed request: ${r.url()}`));

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.evaluate(() => window.localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });

/* ── 1. the overdue consignment is first, and the band is the loudest thing ── */
const order = await page.$$eval('#late-rows .row .pub', (n) => n.map((e) => e.textContent.trim()));
ok(order.length === 3, `expected 3 late consignments, saw ${order.length}`);
ok(order[0] === 'The Royal Oak', `first late row should be the latest one, saw "${order[0]}"`);

const daysLate = await page.$$eval('#late-rows .row .late-n .n', (n) => n.map((e) => Number(e.textContent)));
for (let i = 1; i < daysLate.length; i++) {
  ok(daysLate[i - 1] >= daysLate[i], `late rows out of order: ${daysLate.join(', ')}`);
}

const blocks = await page.$$eval('main > section', (s) => s.map((e) => e.id));
ok(
  blocks.join(',') === 'late,due,trade,record',
  `severity order must be overdue, due today, on trade; saw ${blocks.join(', ')}`
);

const loud = await page.evaluate(() => {
  const b = document.querySelector('.band--late').getBoundingClientRect();
  const visible = Math.max(0, Math.min(b.bottom, innerHeight) - Math.max(b.top, 0)) * Math.min(b.width, innerWidth);
  return {
    share: (visible / (innerWidth * innerHeight)) * 100,
    stateSize: parseFloat(getComputedStyle(document.querySelector('#late-h')).fontSize),
    dueSize: parseFloat(getComputedStyle(document.querySelector('#due-h')).fontSize)
  };
});
ok(loud.share >= 40, `the late band holds ${loud.share.toFixed(1)}% of the first screen, wanted 40`);
ok(loud.stateSize > loud.dueSize * 1.5, 'the late heading must dominate the due heading');

/* ── 2. the controls are on the page, not behind a disclosure ─────────── */
const hidden = await page.$$eval('details, [aria-expanded], dialog', (n) => n.length);
ok(hidden === 0, `${hidden} disclosure control(s) found; the controls must already be on the page`);

const firstRow = page.locator('#late-rows .row').first();
for (const [sel, what] of [
  ['input[name="casks"]', 'the cask count'],
  ['input[name="ullage"]', 'the ullage'],
  ['input[type="radio"]', 'the condition'],
  ['button[type="submit"]', 'the book-in button']
]) {
  ok(await firstRow.locator(sel).first().isVisible(), `${what} is not visible on the first late row`);
}

/* the action outranks anything that only reports state */
const weight = await page.evaluate(() => {
  const row = document.querySelector('#late-rows .row');
  const area = (el) => { const r = el.getBoundingClientRect(); return r.width * r.height; };
  return { button: area(row.querySelector('button')), days: area(row.querySelector('.late-n')) };
});
ok(weight.button >= weight.days, 'the book-in button must be at least as prominent as the days-late figure');

/* the whole journey is reachable without scrolling */
const inFold = await page.evaluate(() => {
  const b = document.querySelector('#late-rows .row button').getBoundingClientRect();
  return b.bottom <= innerHeight;
});
ok(inFold, 'the first book-in button is below the fold; the brief says no scrolling');

/* ── 3. a booking without condition and ullage is refused, and says what ── */
await firstRow.locator('button[type="submit"]').click();
const err = firstRow.locator('~ .err').first();
const errText = (await page.locator('#err-c1').textContent()).toLowerCase();
ok(await page.locator('#err-c1').isVisible(), 'a booking with nothing entered was not refused');
ok(errText.includes('condition'), `the refusal must name the condition, saw "${errText}"`);
ok(errText.includes('ullage'), `the refusal must name the ullage, saw "${errText}"`);
ok(
  (await page.locator('#late-rows .row').count()) === 3,
  'a refused booking must not remove the row'
);

/* ── 4. an invalid entry keeps the values already in the row ───────────── */
await page.fill('#casks-c1', '4');
await page.check('#late-rows .row input[value="wet"]');
await page.fill('#ull-c1', '0');           /* wet with nil ullage: not possible */
await firstRow.locator('button[type="submit"]').click();
const wetErr = (await page.locator('#err-c1').textContent()).toLowerCase();
ok(await page.locator('#err-c1').isVisible(), 'a wet cask with nil ullage was accepted');
ok(wetErr.includes('wet'), `the refusal must explain the wet rule, saw "${wetErr}"`);
ok((await page.inputValue('#casks-c1')) === '4', 'a refused booking cleared the cask count');
ok(
  await page.isChecked('#late-rows .row input[value="wet"]'),
  'a refused booking cleared the condition already chosen'
);

/* an ullage larger than the casks can hold is refused too */
await page.fill('#ull-c1', '999');
await firstRow.locator('button[type="submit"]').click();
ok(await page.locator('#err-c1').isVisible(), 'an impossible ullage was accepted');

/* ── 5. a good booking changes the board ───────────────────────────────── */
const before = await page.textContent('#standing-casks');
await page.fill('#casks-c1', '6');
await page.fill('#ull-c1', '5');
await firstRow.locator('button[type="submit"]').click();
await page.waitForTimeout(60);

const nowLate = await page.$$eval('#late-rows .row .pub', (n) => n.map((e) => e.textContent.trim()));
ok(!nowLate.includes('The Royal Oak'), 'the booked consignment is still in the late list');
ok(nowLate[0] === 'The Feathers', `after booking, the next latest should lead, saw "${nowLate[0]}"`);

const after = await page.textContent('#standing-casks');
ok(before === '33 casks' && after === '27 casks', `standing count did not move: ${before} to ${after}`);

const tally = await page.textContent('#late-tally');
ok(/5 casks/.test(tally), `the late tally did not move, saw "${tally}"`);

const topRecord = await page.$$eval('#record-rows tr:first-child td', (n) => n.map((e) => e.textContent.trim()));
ok(/Royal Oak/.test(topRecord.join(' ')), 'the booking is not first in the week record');
ok(/wet/i.test(topRecord.join(' ')), 'the condition was not recorded');
ok(/\b5\b/.test(topRecord[topRecord.length - 1]), `the ullage was not recorded, saw "${topRecord.join(' | ')}"`);

const last = await page.textContent('#last-action');
ok(/Royal Oak/.test(last), 'the desk does not say what was just booked in');

/* ── 6. it survives a reload ───────────────────────────────────────────── */
await page.reload({ waitUntil: 'networkidle' });
const afterReload = await page.$$eval('#late-rows .row .pub', (n) => n.map((e) => e.textContent.trim()));
ok(!afterReload.includes('The Royal Oak'), 'the booking was forgotten on reload');
ok(
  (await page.textContent('#standing-casks')) === '27 casks',
  'the standing count was forgotten on reload'
);
const recAfter = await page.textContent('#record-rows');
ok(/Royal Oak/.test(recAfter), 'the record was forgotten on reload');

/* ── 7. the primary task completes from the keyboard alone ─────────────── */
await page.evaluate(() => window.localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });
await page.focus('#casks-c1');
await page.keyboard.press('Tab');                       /* ullage */
await page.keyboard.type('2');
await page.keyboard.press('Tab');                       /* condition, first radio */
await page.keyboard.press('ArrowRight');                /* wet */
await page.keyboard.press('Tab');                       /* book in */
const onButton = await page.evaluate(() => document.activeElement.tagName + ':' + document.activeElement.type);
ok(onButton === 'BUTTON:submit', `keyboard order broken, focus landed on ${onButton}`);
await page.keyboard.press('Enter');
await page.waitForTimeout(60);
ok(
  !(await page.$$eval('#late-rows .row .pub', (n) => n.map((e) => e.textContent))).some((t) => /Royal Oak/.test(t)),
  'the booking could not be completed from the keyboard alone'
);

/* ── 8. no horizontal overflow, at every width the brief names ─────────── */
for (const w of [375, 390, 768, 1440]) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.waitForTimeout(80);
  const m = await page.evaluate(() => ({
    doc: document.documentElement.scrollWidth,
    win: window.innerWidth,
    offenders: [...document.querySelectorAll('body *')]
      .filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1)
      .slice(0, 4)
      .map((e) => e.tagName.toLowerCase() + '.' + String(e.className).slice(0, 30))
  }));
  ok(m.doc <= m.win, `horizontal overflow at ${w}: ${m.doc} > ${m.win} (${m.offenders.join(', ')})`);
}

/* ── 9. no dead links ──────────────────────────────────────────────────── */
const links = await page.$$eval('a[href]', (n) => n.map((e) => e.getAttribute('href')));
for (const href of links) {
  if (href === '#' || href === '') fail(`dead link: ${href}`);
  if (href.startsWith('#') && href.length > 1) {
    const found = await page.$(href);
    if (!found) fail(`link ${href} points at nothing`);
  }
}

await browser.close();

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  problems.forEach((p) => console.error(' - ' + p));
  process.exit(1);
}
console.log('book-in journey: all checks passed');
