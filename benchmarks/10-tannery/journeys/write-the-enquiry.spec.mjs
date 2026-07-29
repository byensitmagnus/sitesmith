/**
 * journeys/write-the-enquiry.spec.mjs
 *
 * The page's one primary action. Mode M asks for the primary action end to end: submitted,
 * validated, confirmed. The failure path is exercised first, because a form that has never
 * been submitted empty is a form whose error states are pictures.
 */
import { chromium } from 'playwright';

const base = process.env.BASE ?? 'http://127.0.0.1:4701';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const problems = [];
const check = (name, ok, detail = '') => { if (!ok) problems.push(`${name}${detail ? ': ' + detail : ''}`); };

await page.goto(`${base}/`, { waitUntil: 'networkidle' });

/* ── the failure path first ────────────────────────────────────────────── */
await page.locator('[data-submit]').click();

check('an error summary appears', await page.locator('#enq-summary').isVisible());
check('it is announced', (await page.locator('#enq-summary').getAttribute('role')) === 'alert');
check('focus moves to it', await page.evaluate(() => document.activeElement?.id === 'enq-summary'));

const items = await page.locator('#enq-summary li a').count();
check('the summary lists every unfinished field', items === 3, `${items} listed, expected 3`);

const first = await page.locator('#enq-summary li a').first();
check('each entry says what is actually wrong, not "required"',
  /choose one of the six leathers/i.test(await first.innerText()), await first.innerText());

check('the leather field is marked invalid',
  (await page.locator('#enq-leather').getAttribute('aria-invalid')) === 'true');
const err = await page.locator('#enq-leather-err').innerText();
check('and the error is attached to the field', /choose one of the six/i.test(err), err);
check('the error is wired with aria-describedby',
  (await page.locator('#enq-leather').getAttribute('aria-describedby') ?? '').includes('enq-leather-err'));
check('no enquiry has been written', await page.locator('#enq-note').isHidden());

/* The summary link takes you to the field it names. */
await first.click();
check('the summary entry moves focus to its field',
  await page.evaluate(() => document.activeElement?.id === 'enq-leather'));

/* One more wrong input: hides has to be a whole number of one or more. */
await page.selectOption('#enq-leather', 'calf');
await page.fill('#enq-hides', '0');
await page.fill('#enq-for', 'quarter-bound octavo, 210 by 135');
await page.fill('#enq-who', 'R. Hallam, bookbinder');
await page.locator('[data-submit]').click();
check('an order of nought hides is refused',
  /one or more/i.test(await page.locator('#enq-hides-err').innerText()));
check('and the leather error has cleared now it is answered',
  await page.locator('#enq-leather-err').isHidden());

/* ── the happy path, from the keyboard ─────────────────────────────────── */
await page.locator('#enq-hides').focus();
await page.keyboard.press('Control+a');
await page.keyboard.type('2');
await page.keyboard.press('Tab');   // what it is for
await page.keyboard.press('Tab');   // your name and trade
await page.keyboard.press('Tab');   // Write the enquiry
const onButton = await page.evaluate(() => (document.activeElement?.textContent ?? '').trim());
check('the submit button is reachable by tabbing', /write the enquiry/i.test(onButton), onButton);
await page.keyboard.press('Enter');

check('the summary is gone', await page.locator('#enq-summary').isHidden());
check('the enquiry is written out', await page.locator('#enq-note').isVisible());
check('it is announced', (await page.locator('#enq-note').getAttribute('role')) === 'status');
check('focus moves to it', await page.evaluate(() => document.activeElement?.id === 'enq-note'));

const note = await page.locator('#enq-note').innerText();
check('the note names the leather chosen', /Oak-tanned calf/.test(note), note.slice(0, 120));
check('it carries the measured thickness', /1\.4 mm/.test(note));
check('it carries the lead time for that leather', /4 weeks from order/.test(note), note);
check('it dates the lead time', /July 2026/.test(note));
check('it says the price is still to be quoted', /to be quoted/i.test(note));
check('it invents no price', !/[£$€]/.test(note), note);
check('the quantity is carried through', /2 hides/.test(note), note);

/* Reversible: there is a way back out of the finished state. */
await page.locator('[data-reset]').click();
check('starting again clears the note', await page.locator('#enq-note').isHidden());
check('and empties the form', (await page.locator('#enq-for').inputValue()) === '');
check('and puts focus back at the first field',
  await page.evaluate(() => document.activeElement?.id === 'enq-leather'));

/* Nothing on the page may carry a price, at any state. */
const body = await page.locator('body').innerText();
check('no price appears anywhere on the page', !/[£$€]\s?\d/.test(body));

await browser.close();
console.log(problems.length ? 'FAIL\n  ' + problems.join('\n  ') : 'ok — the enquiry is written, validated and confirmed');
process.exit(problems.length ? 1 : 0);
