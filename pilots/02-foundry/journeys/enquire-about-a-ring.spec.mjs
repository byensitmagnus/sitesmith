/**
 * JOURNEY — enquire about a ring.
 *
 * Drives the one journey in JOURNEY-INTENT.md against site/index.html.
 * Collects every failure, prints them, and exits 1 if there are any.
 *
 *   BASE=http://127.0.0.1:4173/ node journeys/enquire-about-a-ring.spec.mjs
 */

const BASE = process.env.BASE || 'http://127.0.0.1:4173/';
const failures = [];
const fail = (what) => failures.push(what);

const { chromium } = await import('playwright');
const browser = await chromium.launch();

try {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    const label = `${viewport.width}x${viewport.height}`;
    const page = await browser.newPage({ viewport });

    const consoleErrors = [];
    const failedRequests = [];
    page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
    page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));
    page.on('requestfailed', (r) => failedRequests.push(r.url()));

    await page.goto(BASE, { waitUntil: 'networkidle' });

    /* ---- 1. the enquiry is reachable from the first screen ---------------- */
    const cta = page.locator('.hero__acts a[href="#enquiry"]');
    if ((await cta.count()) !== 1) {
      fail(`[${label}] the hero has no single link to #enquiry`);
    } else {
      const box = await cta.boundingBox();
      if (!box) fail(`[${label}] the hero enquiry link is not rendered`);
      else if (box.y + box.height > viewport.height) {
        fail(`[${label}] the hero enquiry link ends at ${Math.round(box.y + box.height)}px, ` +
             `below the ${viewport.height}px fold`);
      }
      if (!(await cta.isVisible())) fail(`[${label}] the hero enquiry link is not visible`);
    }

    const h1 = await page.locator('h1').boundingBox();
    if (h1 && h1.y + h1.height > viewport.height) {
      fail(`[${label}] the headline is clipped by the fold ` +
           `(ends at ${Math.round(h1.y + h1.height)}px)`);
    }

    await cta.click();
    await page.waitForTimeout(250);
    if (!(await page.locator('#enquiryForm').isVisible())) {
      fail(`[${label}] following the hero action does not reveal the enquiry form`);
    }

    /* ---- 2. the bound on the number of bells is explained, not just enforced */
    const bellsHint = (await page.locator('#bells-hint').textContent()) || '';
    if (!/twelve/i.test(bellsHint)) {
      fail(`[${label}] the bells field does not state its bound in visible text`);
    }
    if (!/(ring you|call you|rather talk|telephone)/i.test(bellsHint)) {
      fail(`[${label}] the bells field states the bound without saying why or what to do instead`);
    }
    const bellsEl = page.locator('#bells');
    if (await bellsEl.evaluate((el) => el.type === 'number')) {
      fail(`[${label}] the bells field is a native number input and will grow spinners`);
    }

    /* ---- 5. the faculty question is asked --------------------------------- */
    const legend = (await page.locator('#enquiryForm fieldset legend').first().textContent()) || '';
    if (!/faculty/i.test(legend)) fail(`[${label}] the faculty question is not asked`);
    if ((await page.locator('input[name="faculty"]').count()) < 3) {
      fail(`[${label}] the faculty question has fewer than three answers`);
    }

    /* ---- 3. an invalid submission does not clear the form ----------------- */
    const typed = {
      tower: 'St Æthelburga, Ballingdon',
      bells: '16',
      tenor: '14 cwt',
      notes: 'The fourth sounds sour against the fifth and the tenor is slow to come round.',
      name: 'A. Weir, tower captain',
    };
    for (const [id, value] of Object.entries(typed)) await page.fill('#' + id, value);
    await page.check('input[name="faculty"][value="Application with the diocese"]');

    await page.locator('#enquiryForm button[type="submit"]').click();
    await page.waitForTimeout(250);

    if (await page.locator('#receipt').isVisible()) {
      fail(`[${label}] an invalid submission produced a success state`);
    }
    for (const [id, value] of Object.entries(typed)) {
      const now = await page.inputValue('#' + id);
      if (now !== value) fail(`[${label}] the form cleared #${id} on an invalid submission ` +
                              `("${value}" became "${now}")`);
    }
    if (!(await page.locator('input[name="faculty"][value="Application with the diocese"]').isChecked())) {
      fail(`[${label}] the form cleared the faculty answer on an invalid submission`);
    }

    const summary = page.locator('[role="alert"]');
    if (!(await summary.count())) {
      fail(`[${label}] an invalid submission raised no error summary`);
    } else if (!/twelve/i.test((await summary.first().textContent()) || '')) {
      fail(`[${label}] the error summary does not name what is wrong with the bell count`);
    }

    const bellsError = (await page.locator('#bells-err').textContent()) || '';
    if (!bellsError.trim()) fail(`[${label}] the invalid field carries no message of its own`);
    if (!/twelve/i.test(bellsError)) {
      fail(`[${label}] the field message does not name the bound it broke`);
    }
    if ((await page.locator('#bells').getAttribute('aria-invalid')) !== 'true') {
      fail(`[${label}] the invalid field is not marked aria-invalid`);
    }
    const described = (await page.locator('#bells').getAttribute('aria-describedby')) || '';
    if (!described.includes('bells-err')) {
      fail(`[${label}] the field message is not wired to the field with aria-describedby`);
    }
    const focused = await page.evaluate(() => document.activeElement && document.activeElement.id);
    if (focused !== 'bells') {
      fail(`[${label}] focus did not move to the first invalid field (it is on "${focused}")`);
    }

    /* ---- a second failure mode: a missing required field ------------------ */
    await page.fill('#tower', '');
    await page.fill('#bells', '8');
    await page.locator('#enquiryForm button[type="submit"]').click();
    await page.waitForTimeout(250);
    if (!((await page.locator('#tower-err').textContent()) || '').trim()) {
      fail(`[${label}] an empty required field produced no message`);
    }
    if ((await page.evaluate(() => document.activeElement && document.activeElement.id)) !== 'tower') {
      fail(`[${label}] focus did not move to the newly invalid field`);
    }

    /* ---- 4. a valid submission produces a real success state -------------- */
    await page.fill('#tower', typed.tower);
    await page.fill('#email', 'a.weir@ballingdonpcc.org.uk');
    await page.locator('#enquiryForm button[type="submit"]').click();
    await page.waitForTimeout(250);

    if (!(await page.locator('#receipt').isVisible())) {
      fail(`[${label}] a valid submission produced no success state`);
    }
    const receipt = (await page.locator('#receipt').textContent()) || '';
    for (const echoed of [typed.tower, '8', typed.name, 'a.weir@ballingdonpcc.org.uk',
                          typed.notes, 'Application with the diocese']) {
      if (!receipt.includes(echoed)) {
        fail(`[${label}] the success state does not repeat back "${String(echoed).slice(0, 40)}"`);
      }
    }
    if (await page.locator('#enquiryForm').isVisible()) {
      fail(`[${label}] the form is still on screen behind the success state`);
    }
    if ((await page.evaluate(() => document.activeElement && document.activeElement.id)) !== 'receiptHead') {
      fail(`[${label}] focus did not move to the success state`);
    }

    /* ---- the before and after must be a change, not a table --------------- */
    const read = () => page.evaluate(() => ({
      cents: [...document.querySelectorAll('#book tbody .c-cents')].map((n) => n.textContent.trim()),
      metal: [...document.querySelectorAll('#book tbody .c-metal')].map((n) => n.textContent.trim()),
      bars: [...document.querySelectorAll('#book tbody .track__bar')]
        .map((n) => Math.round(n.getBoundingClientRect().width)),
      pressed: [...document.querySelectorAll('.switch button')]
        .map((b) => b.getAttribute('aria-pressed')),
    }));

    const before = await read();
    if (before.cents.length !== 5) fail(`[${label}] the tuning book does not show five partials`);
    if (before.pressed.join() !== 'true,false') {
      fail(`[${label}] the tuning book does not open on the 1904 state`);
    }
    if (!before.metal.every((m) => m === '–')) {
      fail(`[${label}] the 1904 state claims metal was already off the bell`);
    }

    await page.locator('.switch button[data-state="after"]').click();
    await page.waitForTimeout(700);
    const after = await read();

    if (after.pressed.join() !== 'false,true') {
      fail(`[${label}] the tuning book control does not report its state with aria-pressed`);
    }
    if (after.cents.join() === before.cents.join()) {
      fail(`[${label}] switching the tuning book changed no figures`);
    }
    if (!after.bars.every((w, i) => w < before.bars[i])) {
      fail(`[${label}] the bars did not retract toward true: ` +
           `${before.bars.join(',')} became ${after.bars.join(',')}`);
    }
    if (after.metal.join(' ') !== '2 lb 3 lb 4 lb 5 lb 9 lb') {
      fail(`[${label}] the metal-off column does not fill in with the published weights ` +
           `(got ${after.metal.join(', ')})`);
    }
    const total = (await page.locator('.bench__figure .fig').textContent()) || '';
    if (!total.includes('23')) fail(`[${label}] the metal-off total is not published`);

    /* the unflattering figure has to be on the page */
    const aside = (await page.locator('.bench__aside').textContent()) || '';
    if (!/tierce/i.test(aside) || !/5 cents flat/i.test(aside)) {
      fail(`[${label}] the page does not publish the partial that was not brought in`);
    }

    /* ---- the technical floor ---------------------------------------------- */
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 1) fail(`[${label}] the document scrolls sideways by ${overflow}px`);

    const dead = await page.evaluate(() => [...document.querySelectorAll('a[href]')]
      .map((a) => a.getAttribute('href'))
      .filter((h) => h === '#' || h === '' || /example\.com/.test(h) || /^javascript:/i.test(h)));
    if (dead.length) fail(`[${label}] dead links: ${dead.join(', ')}`);

    const orphanAnchors = await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')]
      .map((a) => a.getAttribute('href').slice(1))
      .filter((id) => id && !document.getElementById(id)));
    if (orphanAnchors.length) fail(`[${label}] anchors with no target: ${orphanAnchors.join(', ')}`);

    if (consoleErrors.length) fail(`[${label}] console errors: ${consoleErrors.join(' | ')}`);
    if (failedRequests.length) fail(`[${label}] failed requests: ${failedRequests.join(' | ')}`);

    await page.close();
  }
} catch (error) {
  fail('the journey threw: ' + error.message);
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`\nenquire-about-a-ring: ${failures.length} problem(s)\n`);
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log('enquire-about-a-ring: all checks passed at 1440x900 and 390x844');
