# Interaction contract — Damgaard Estrik

## Primary actions

| action | where | on success | on failure | reversible |
| --- | --- | --- | --- | --- |
| Book en fugtgennemgang | `/bestil` | redirect to `/kvittering`, which renders the fixed case number `DE-2026-0318`, price, booking window and the until-we-arrive list | field-level error inline (`role="alert"`, wired via `aria-describedby`), page re-renders at `/bestil` with focus moved to the offending field via `autofocus`, the other eleven answers preserved via `defaultValue`/`defaultChecked` from the resubmitted form data | n/a — no data is stored beyond an append-only log line; nothing to undo |
| Call outside opening hours / outside area | `/`, `/priser`, `/bestil` (Tom state) | the 75 km limit, the phone number and opening hours are readable without filling in anything, so a visitor outside the area can leave in under 30 seconds without submitting | n/a | n/a |

"On success" is observable in the DOM: the URL changes to `/kvittering` and the page renders
`DE-2026-0318` as page content, not a toast. "On failure" is observable: the specific field
carries `aria-invalid="true"`, an adjacent element with `role="alert"` states the exact
required text, and that field receives focus on page load.

## States per surface

**`/bestil` (the form).**
- *Tom* — reached by `GET /bestil`. Nothing pre-filled, nothing pre-selected. Reachable
  directly as a route.
- *Fejl (postnummer)* — reached by submitting the form with `postnummer=2200`. Rendered at
  the same `/bestil` route via the server action's returned state (works with or without
  JavaScript: without JS the browser does a normal full-page POST/response; with JS,
  `useActionState` does the same round trip without a full reload). Exit: correct the
  field and resubmit, or leave.
- *Fejl (kloakvand)* — reached by submitting the form with `kloakvand=ja`. Same mechanism.
- *Fejl (andet påkrævet felt mangler)* — reached by omitting any other required field.
  Same mechanism, generic per-field message. Not one of the brief's two named scenarios,
  but the trust-boundary validation a real booking form needs regardless.
- *Kvittering* — reached either by a valid POST (redirect) or directly by `GET
  /kvittering`. The content is identical either way because the brief fixes the case number
  rather than generating one — there is no database, so nothing else could vary it.

**Header disclosure strip.** No states. Always rendered, on every page, never collapsible,
never behind a control. This is a hard brief requirement, not a design choice with a
fallback.

## Keyboard and focus

- Tab order follows the visual order on every page: disclosure strip and header have no
  interactive elements before the "spring til indhold" skip link, which is the first
  focusable element.
- A `<a href="#main">Spring til indhold</a>` skip link is the first element in the DOM on
  every page, visually hidden until focused.
- On `/bestil`, tab order is: skip link → header nav → phone link → primary CTA (if header
  carries one) → each form field/radio group in the order the brief lists them (navn,
  telefon, e-mail, adresse, postnummer, skadedato, årsag, kloakvand, gulvtype, gulvvarme,
  m², skadenummer) → submit button → footer.
- Radio groups: arrow keys move within the group (native browser behaviour, no custom JS),
  Tab moves to the next control.
- After an error: focus lands on the field that caused it (`autofocus`, set server-side on
  the field the validation flagged), not on the top of the page and not on the submit
  button.
- After a successful booking: the browser navigates to `/kvittering`; focus lands on the
  page per normal navigation behaviour, and the `<h1>` is the first content landmark so a
  screen reader announces the page's purpose immediately.
- No keyboard shortcut is advertised anywhere on the site, so there is none to fail to
  implement.

## Journeys

`journeys/book-a-review.spec.mjs` — the primary action end to end:
1. Loads `/bestil`, asserts the Tom state (no field pre-filled).
2. Fills all twelve fields with valid data and submits; asserts the browser ends on
   `/kvittering` and the page contains `DE-2026-0318`.
3. Fills the form again with `postnummer=2200`; asserts the specific required error text is
   present, that the postnummer field carries `aria-invalid="true"`, and that focus is on
   that field.
4. Fills the form again with `kloakvand=ja`; asserts the second required error text and
   that focus is on that field's fieldset/radio.
5. Repeats the successful path using keyboard only (Tab/Space/Enter, no `.click()`), and
   asserts a visible focus outline exists at each step.

Run with `node journeys/book-a-review.spec.mjs` against a running `next start` server, or
via `node scripts/journey.mjs journeys/ --base <url>` if the sitesmith scripts are on
`PATH` for this workspace — they are not vendored into this project (no dependency was
added for a script that only wraps `node journeys/*.spec.mjs`), so the direct `node`
invocation is the one actually used in `PRODUCTION-REPORT.md`.
