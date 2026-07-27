# 40 — the interaction contract

> Original work, MIT. Written with the design-system contract, satisfied before delivery.
> Output: `INTERACTIONS.md` and at least one journey under `journeys/`.

`DESIGN-SYSTEM.md` says what a control looks like in each of its states. It does not say how a
person gets from one state to the next, and a state that is styled but unreachable is a
picture of a state.

Across the nine legacy pages there are zero `<script>` tags. The product page's radios do not
change its price. The dashboard's filters do not filter. The form is permanently step 3 of 4.
The goods-in console prints a keyboard legend for keys that do nothing. Every one of those
states is *drawn correctly* — and none of them has ever been entered.

---

## Contents

- [1. What the contract contains](#1-what-the-contract-contains)
- [2. Journeys](#2-journeys)
- [3. What a journey must assert](#3-what-a-journey-must-assert)
- [4. How many](#4-how-many)
- [5. Running them](#5-running-them)

---

## 1. What the contract contains

`INTERACTIONS.md` has three sections.

### Primary actions

Every action the site exists to enable, with what happens. One row each.

| action | where | on success | on failure | reversible |
| --- | --- | --- | --- | --- |
| Add to basket | product page | basket count increments, panel confirms, focus moves to the confirmation | out-of-stock variant disables the button and says why | yes, remove from basket |
| Request a survey | contact | inline confirmation with what happens next and when | field-level errors, summary at the top, focus to the first error | n/a |
| Filter the queue | console | table narrows, count updates, filter state visible and clearable | no matches shows the empty state with a way back | yes, Clear |

"On success" must name something observable in the DOM. "The form submits" is not
observable; "a `role=status` element announces the reference number" is.

### States per surface

For each interactive surface: the states it can be in, what puts it there, and what gets it
out. The six control states and three page states from [`10-core.md`](10-core.md) section F
are the vocabulary; this section says which of them this surface actually has and how they
are reached.

A state listed here with no way in is the defect this file exists to catch. Either wire it or
delete it from the page.

### Keyboard and focus

Every action reachable by keyboard, in an order that matches the visual one. Where focus goes
after each transition — after opening a disclosure, after submitting, after an error, after
closing a dialog. Any keyboard shortcut the interface advertises, and whether it works.

If the page prints `R  reason code` at the bottom of the screen, pressing R does something.
Advertising a shortcut that does nothing is worse than not advertising it.

## 2. Journeys

A journey is a Playwright script that drives the real page as a person would and asserts what
changed. It lives in `journeys/<name>.spec.mjs` and it is committed with the site.

```js
// journeys/configure-and-add.spec.mjs — the one thing this page exists to do.
import { chromium } from 'playwright';

const base = process.env.BASE ?? 'http://localhost:5173';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const problems = [];
const check = (name, ok, detail = '') => { if (!ok) problems.push(`${name}${detail ? ': ' + detail : ''}`); };

await page.goto(`${base}/products/rx/`, { waitUntil: 'networkidle' });

// The price the page opens with.
const opening = await page.locator('[data-total]').innerText();

// Choose the upgrade. This is the whole point of a configurable product.
await page.getByRole('radio', { name: /2 TB NVMe/ }).check();
const upgraded = await page.locator('[data-total]').innerText();
check('the total responds to the configuration', upgraded !== opening, `${opening} -> ${upgraded}`);

// The unavailable option cannot be chosen, and says why.
const oos = page.getByRole('radio', { name: /4 TB NVMe/ });
check('the out-of-stock option is disabled', await oos.isDisabled());
check('it says why', /out of stock/i.test(await oos.locator('xpath=ancestor::label').innerText()));

// Add it, and confirm something observable happened.
await page.getByRole('button', { name: /add to basket/i }).click();
await page.waitForSelector('[role=status]', { timeout: 4000 }).catch(() => {});
const status = await page.locator('[role=status]').innerText().catch(() => '');
check('a status message announces the result', status.length > 0, 'no role=status text');
check('the basket count changed', (await page.locator('[data-basket-count]').innerText()) !== '0');

// Keyboard: the same thing, without a mouse.
await page.keyboard.press('Tab');
check('focus is visible after tabbing',
  await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return false;
    const s = getComputedStyle(el);
    return s.outlineStyle !== 'none' || s.boxShadow !== 'none';
  }));

await browser.close();
console.log(problems.length ? 'FAIL\n  ' + problems.join('\n  ') : 'ok — journey passed');
process.exit(problems.length ? 1 : 0);
```

## 3. What a journey must assert

Not that a click did not throw. Four things:

1. **Something changed** — a value, a count, a URL, a visible region. Compare before and
   after; do not assume.
2. **The change is announced** — a `role=status`, a `role=alert`, a heading change, or a
   focus move. A change only a sighted mouse user notices is half-built.
3. **The failure path** — one deliberate wrong input, or one unavailable option, asserting
   the error is specific and attached to the field it belongs to.
4. **The keyboard path** — the same outcome reached without a pointer, with focus visible.

A journey that only walks the happy path is worth having and is not sufficient. The states
that go wrong in production are the other three.

## 4. How many

**At least one per surface, covering that surface's primary action.** From the mode:

| Mode | The journey that must exist |
| --- | --- |
| **M** marketing | The primary action end to end — the enquiry submitted, validated, confirmed. Plus the mobile navigation actually opening, closing, and trapping focus while open. |
| **E** e-commerce | Configure or choose a variant, add to basket, see the basket reflect it. Plus one unavailable state. |
| **P** product UI | The main task from empty to done — filter, edit, save, and see it persist. Plus the empty state and one validation failure. |

Beyond that, one journey per state in `INTERACTIONS.md` that would cost real money or real
trust if it silently broke.

## 5. Running them

```bash
node scripts/journey.mjs journeys/ --base http://localhost:5173
```

Runs every `*.spec.mjs` in the directory, reports pass and fail per journey, exits non-zero
if any failed. It is a thin runner: the journeys are plain scripts, so a single one can be run
directly with `node journeys/x.spec.mjs` while working on it.

**A site with no journey has not been tested for behaviour**, whatever the technical gate
says. `scripts/production-gate.mjs --production` fails when `journeys/` is empty or when the
runner reports a failure.
