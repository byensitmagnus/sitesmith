// journeys/price-a-cut.spec.mjs
// The one journey: price a cut, be refused, correct it in place, order it.
// Run: BASE=http://127.0.0.1:5199 node journeys/price-a-cut.spec.mjs

const { chromium } = await import('playwright');

const base = process.env.BASE ?? 'http://127.0.0.1:5199';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const problems = [];
const check = (name, ok, detail = '') => { if (!ok) problems.push(`${name}${detail ? ': ' + detail : ''}`); };

const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));

await page.goto(base + '/', { waitUntil: 'networkidle' });

const ticket = page.locator('#ticket');
const count = ticket.locator('[data-count]');
const total = ticket.locator('[data-total]');
const status = ticket.locator('[role=status]');

// ---------------------------------------------------------------- 1. empty
{
  const empty = (await ticket.locator('[data-empty]').innerText()).trim();
  check('the empty ticket explains itself in a sentence', empty.length > 60, `only ${empty.length} chars: "${empty}"`);
  check('the empty ticket says what will appear here', /add|length/i.test(empty), empty);
  check('the empty ticket says why it matters', /batch/i.test(empty), empty);
  check('a count is visible from the start', await count.isVisible() && (await count.innerText()).trim() === '0',
    await count.innerText());
  check('a total is visible from the start', await total.isVisible() && (await total.innerText()).trim() === '£0.00',
    await total.innerText());
}

// ------------------------------------------------- 2. a length prices itself
const row = page.locator('.line[data-line=ts12]');
const len = row.locator('input[type=text]');
const hint = row.locator('.cut-hint');
const err = row.locator('.cut-err');
const add = row.getByRole('button', { name: /add the cut/i });

{
  const before = (await hint.innerText()).trim();
  await len.fill('20');
  const after = (await hint.innerText()).trim();
  check('entering a length changes the readout', after !== before, `${before} -> ${after}`);
  check('the readout prices the cut before it is committed', after.includes('£48.00'), after);
  check('nothing was committed by typing', (await count.innerText()).trim() === '0',
    'ticket count moved without an add');

  // and the whipping charge is arithmetic on top of the same figure
  await row.locator('input[type=checkbox]').check();
  check('whipping is priced into the readout', (await hint.innerText()).includes('£49.80'), await hint.innerText());
  await row.locator('input[type=checkbox]').uncheck();
}

// ------------------------------------- 3. a refusal that names the real limit
{
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await len.fill('2');
  await add.click();
  const message = (await err.innerText()).trim();
  check('a length under the minimum is refused', message.length > 0, 'no error text');
  check('the refusal names the 3 m limit', /3\s?m/.test(message), message);
  check('the refusal repeats what was asked for', /\b2\b/.test(message), message);
  check('the refusal is not the word invalid', !/invalid/i.test(message), message);
  check('nothing reached the ticket', (await count.innerText()).trim() === '0');
  check('the error is wired to the field',
    (await len.getAttribute('aria-describedby') || '').includes(await err.getAttribute('id')));
  check('the field is marked invalid', await len.getAttribute('aria-invalid') === 'true');

  // 4. corrected in place: same line, same field, same scroll position, value intact
  check('the page did not jump', await page.evaluate(() => window.scrollY) === scrollBefore,
    `${scrollBefore} -> ${await page.evaluate(() => window.scrollY)}`);
  check('the length typed is still there', await len.inputValue() === '2', await len.inputValue());
  check('focus is still in the field that was refused',
    await page.evaluate(() => document.activeElement?.id) === await len.getAttribute('id'));

  await len.fill('20');
  check('correcting the length clears the refusal', (await err.innerText()).trim() === '', await err.innerText());
  check('the field is no longer marked invalid', await len.getAttribute('aria-invalid') === null);
}

// --------------------------------- a length longer than the coil is refused too
{
  await len.fill('900');
  await add.click();
  const message = (await err.innerText()).trim();
  check('a length longer than the coil is refused', message.length > 0);
  check('that refusal names what is on the coil', /184\s?m/.test(message), message);
  await len.fill('20');
}

// ---------------------------------------------- 5. adding the cut moves the order
{
  const totalBefore = (await total.innerText()).trim();
  await add.click();
  await page.waitForTimeout(50);
  check('the count moved', (await count.innerText()).trim() === '1', await count.innerText());
  check('the total moved', (await total.innerText()).trim() !== totalBefore, `${totalBefore} -> ${await total.innerText()}`);
  check('the total is the arithmetic', (await total.innerText()).trim() === '£48.00', await total.innerText());

  const line = ticket.locator('.ticket-lines li').first();
  const lineText = await line.innerText();
  check('the ticket line names the rope', /three-strand polyester/i.test(lineText), lineText);
  check('the ticket line names the batch it was cut from', /TS12-2431/.test(lineText), lineText);
  check('the ticket line shows the length and the rate', /20 m at £2\.40/.test(lineText), lineText);
  check('the empty state has stood down', !(await ticket.locator('[data-empty]').isVisible()));

  const announced = (await status.innerText()).trim();
  check('the change is announced', announced.length > 0, 'role=status is empty');
  check('the announcement carries the batch', /TS12-2431/.test(announced), announced);
  check('the announcement carries the new total', /£48\.00/.test(announced), announced);
}

// ------------------------------- 6. the out-of-stock line cannot be ordered
{
  const off = page.locator('.line[data-line=pp14]');
  check('the out-of-stock line has no way to order it', await off.locator('button').count() === 0);
  check('the out-of-stock line has no length field', await off.locator('input').count() === 0);
  const why = (await off.innerText()).trim();
  check('it says why rather than only disabling itself', why.length > 200, `${why.length} chars`);
  check('it explains the state of the next coil', /order/i.test(why) && /date/i.test(why), why);
  check('it offers a route rather than a dead end', await off.locator('a[href^="tel:"]').count() > 0);
  check('it does not publish an uncertified load as a batch figure', /uncertified/i.test(why), why);
}

// ------------------------------------------ the keyboard path, no pointer at all
{
  const db = page.locator('.line[data-line=db12] input[type=text]');
  await db.focus();
  const ringed = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return false;
    const s = getComputedStyle(el.closest('.cut-input') || el);
    return s.outlineStyle !== 'none' || s.boxShadow !== 'none';
  });
  check('focus is visible on the field', ringed);
  await page.keyboard.type('10');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(50);
  check('a cut can be added from the keyboard alone', (await count.innerText()).trim() === '2', await count.innerText());
  check('the keyboard cut is priced right', (await total.innerText()).trim() === '£89.50', await total.innerText());
}

// --------------------------------------------------------- the order reverses
{
  await ticket.locator('.btn-remove').first().click();
  await page.waitForTimeout(50);
  check('a cut can be taken back off', (await count.innerText()).trim() === '1', await count.innerText());
  check('the total follows it down', (await total.innerText()).trim() === '£41.50', await total.innerText());
  check('the removal is announced', /took/i.test(await status.innerText()), await status.innerText());
  check('focus was not thrown away', await page.evaluate(() => document.activeElement !== document.body));
}

// ---------------------------------------------------- the technical floor
{
  check('no console errors', consoleErrors.length === 0, consoleErrors.join(' | '));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('no horizontal overflow', overflow <= 1, `${overflow}px`);
  const dead = await page.evaluate(() => [...document.querySelectorAll('a[href]')]
    .map(a => a.getAttribute('href')).filter(h => h === '#' || h === ''));
  check('no dead links', dead.length === 0, dead.join(' '));
}

await browser.close();
console.log(problems.length
  ? 'FAIL (' + problems.length + ')\n  ' + problems.join('\n  ')
  : 'ok - price a cut, be refused, correct it, order it');
process.exit(problems.length ? 1 : 0);
