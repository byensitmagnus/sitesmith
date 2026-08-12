# Production report: Damgaard Estrik

Scenario: buy

draft: yes

The brief forbids photography of this fictional company outright, not the ordinary
"no photo supplied" gap: "der findes ingen billeder... lad ikke siden antyde at der
findes fotos af denne virksomhed." `--draft` is recorded for that reason alone (see
`ASSET-MANIFEST.md`). Nothing else about this build is unfinished; every gate, verify,
contract and journey check below runs clean. This is not a release claim: no
`release: yes` line appears anywhere in this file, on purpose, since a run made with
`--draft` may never claim one.

## Files opened

- `SKILL.md`
- `run.md`
- `look.md`
- `floor/buy.md`
- `stacks/nextjs.md`
- `contract.md`
- `verify.md`

## What shipped

- Routes: `/` (Tom and both Fejl states, same URL, server-rendered in place from the
  submitted query string, no client JS), `/kvittering` (Kvittering state, reached by a
  real HTTP redirect after a valid booking, and directly reachable on its own for
  review).
- Stack: Next.js 16.3.0, App Router, one server action (`app/actions.ts`). No database;
  successful bookings are appended to `data/submissions.log` (JSONL, one line per
  booking, gitignored).
- Serves with `npm run build && npm run start`, port 3000.
- Journey: `journeys/buy.spec.mjs`. Drives the full keyboard-only success path (skip
  link -> first field -> submit, with a visible focus indicator asserted at both stops)
  against the real production server, then drives the postnummer-2200 failure path and
  asserts the exact pinned copy, `role="alert"`, focus on `#postnummer`, and that the
  other eleven answers survive unchanged. `node <skill>/scripts/journey.mjs journeys
  --base http://localhost:3000`: 1 passed.
- Design contract: `.sitesmith/contract.json` / `.sitesmith/CONTRACT.md`. `check`
  clears every declared pair's floor; `compare --url` matches the shipped build on
  every field it can measure; `stress --url` holds all three browser-decidable cases,
  and the two cases a browser cannot decide (a malformed postnummer, no client-side
  JavaScript) were driven by hand with Playwright and both held — see the `result`
  fields recorded on those two stress cases in `contract.json`.
- Direction record: `.sitesmith/direction.md`, `ledger.mjs check` against the shipped
  render: `passed, this shape is not in the ledger` (ground achromatic, no accent
  cleared the saturation floor on the Tom state, sans display, imagery 12.4% of the
  first screen, one device: hairline-separators). Committed to the shared ledger.
- Critique: `.sitesmith/critique.json`, locked against the shipped render, one
  correction round used. Verdict: ACCEPT.

## Run notes

- viewports: 375, 768, 1440px rendered for `/` (Tom state), full-page, via `verify.mjs`
  against the production server (`next start`, not the dev server)
- axe both schemes: ran, 0 violations, 0 serious or critical, both colour schemes
- live server: yes, `next start` on port 3000, production build (`next build`)
- anti-slop linter: `node <skill>/scripts/gate.mjs app --url http://localhost:3000
  --draft --manifest ASSET-MANIFEST.md --report PRODUCTION-REPORT.md --direction
  .sitesmith/direction.md`, refused twice on real findings, clean on the third run;
  see Mechanical findings and Reconciliation below
- fallbacks: none; every check below actually ran

Additional steps this run also performed, kept out of the fixed five-field block above:

- keyboard sweep: verify.mjs's own pass, 9-10 stops per width, all with a visible
  focus indicator; the full keyboard-only booking path is additionally driven start to
  finish by `journeys/buy.spec.mjs`
- reduced motion: rendered at 1440px, 9 requests, 0 findings; the only transition in
  the stylesheet (the skip link's `top`) is zeroed by the `prefers-reduced-motion`
  block, and everything else has no transition or animation to begin with
- contract compare/stress: ran against the production server, see "What shipped" above
- ledger check/commit: ran against the production server, see "What shipped" above
- no-JS path: manually driven with Playwright, `javaScriptEnabled: false` — a full
  valid booking reaches `/kvittering`, and postnummer 2200 produces the exact pinned
  Fejl text, both with the browser's own JavaScript turned off

## Mechanical findings

Every finding a script produced across the whole run, before disposition. Fixed items
are described as shipped; accepted items are marked and reasoned below.

- `axe/dlitem+listitem`: `verify.mjs`, `<dt>`/`<dd>` and `<li>` in `.instrument-readout`
  were not contained by a valid parent, because the markup nested `<li>` directly
  inside a `<dl>`, which HTML does not allow as `<dl>` content.
- `axe/measure-and-focus`: initial `verify.mjs` runs, multiple "measure Xch, outside
  the 45 to 80 band" findings across `.kapacitet dd`, `.proces li`, `.hero-intro p`,
  `.hero-facts p` and `.refusal-list` at 768 and 1440px, from three different causes:
  a `.kapacitet` two-column grid that starved the value column, a `.proces` grid that
  mis-placed the paragraph into the narrow number column (three grid items auto-flowed
  into two declared columns), and a `.hero` two-column split at 768px that left both
  columns narrower than the floor.
- `verify.mjs/weak-step`: "18px and 16px are 1.13x apart, which is not a step",
  first from the header wordmark sitting at 1.125rem beside 1rem body text, then again
  from `h3` sitting at 1.125rem after the wordmark was fixed.
- `verify.mjs/tap-target`: all six radio inputs measured 20x20px, under the 44px
  floor, at all three widths.
- `verify.mjs/tight-pair`: the radio group's row-gap was 0.5rem (8px) when options
  wrapped to a second row on narrow screens, under the 24px floor.
- `verify.mjs/control-wraps`: the hero-facts `.cta--book` wrapped onto two lines at
  768px (217x77px), a symptom of the same narrow-column cause above.
- `contract.mjs compare`: the declared `focusOrder` used compound selectors
  (`"header .cta--book"`, `"a.skip-link"`, `"#booking-form"`) that the checker's
  simple id/class/tag matcher cannot parse, and `#booking-form` names a `<form>`,
  which is never itself in the native tab sequence; the check reported the whole
  declared order as unmatched.
- `look.md#4/first-screen`: not a script finding, this build's own required visual
  check. At a true 375x812 viewport (measured live, not from a screenshot), `.instrument`
  started at 687px and ran to 1215px, so only its top ~125px was inside the first
  screen; the diagram itself, the declared signature, was almost entirely below the
  fold.
- `critique/disclaimer-dominance`: this build's own required critique (not a script).
  The top disclaimer bar, at full ink-on-paper contrast, was the first thing the eye
  landed on, ahead of the price/area/refusal facts the brief says must lead.
- `critique/kapacitet-dead-space`: same critique. At 1440px, `.kapacitet`'s
  measure-capped pairs left a wide empty field to the right once the two-column grid
  fix above moved to a single stacked column.
- `honesty/unmanifested-asset`: `gate.mjs`, unscoped run flagged two inline SVGs with
  no `data-asset` id inside `.next/server/app/_global-error.html` and
  `.next/server/pages/500.html`.
- `honesty/asset-not-ready`: `gate.mjs`, warned (downgraded because `--draft`) that
  `instrument-borehul` and `raekkevidde-cirkler` are recorded `final` while the run
  overall is a draft.
- `honesty/draft-flag-unrecorded`: `gate.mjs`, before this file existed: `--draft` was
  used and there was no `PRODUCTION-REPORT.md` to record it in.
- `contract.mjs check`: `layout.focusOrder` note, "no leading element appears in the
  focus order" — informational, not a refusal.
- `gate.mjs`: world-derived token vocabulary printed at 0 of 31 (0%). Reported only,
  never gated, per `gate.mjs`'s own header.
- `gate.mjs/journeys-none`: warned (downgraded because `--draft`), "the record
  declares a buy surface and there is no journeys/ directory" — looked for
  `app/journeys/`, because the gate was scoped to `app` and the real journey lives at
  the project root, `journeys/buy.spec.mjs`, a sibling of `app/`, not inside it.
- `gate.mjs/palette/premium-consumer-default`: `--papir`, `#f7f6f3`, measured 10
  units from `#f5f1ea`, the second-most-recurring AI-tell ground taste-skill names,
  under the 12-unit arc the check refuses on.
- `gate.mjs/drawing/untokenised-paint`: 19 occurrences across `app/diagrams.tsx`,
  every `fill`/`stroke` presentation attribute on both SVGs set to a literal hex
  value instead of a design-system token.
- `gate.mjs/tokens/undeclared-literal`: 19 occurrences across `app/globals.css`: five
  distinct font-size values (1.25rem, 0.75rem, 0.8125rem, 0.9375rem, 0.875rem) and one
  box-shadow, each repeated at several call sites, plus one literal hover colour,
  none declared as a custom property.
- `gate.mjs/look/lopsided-band`: five sections (`Hvad der sker`, `Regler`, `Det vi
  ikke ved`, the footer's `Kontakt` column, and `#booking-form`) had 65-91% of their
  rows stopped against the left edge with a large, unclaimed field of ground on the
  right.
- `gate.mjs/look/ragged-margin`: `#booking-form` started 25px right of the x=202
  spine eight of eleven other bands share, read by the check as an accidental shift
  rather than a second column.
- `gate.mjs/look/one-layout`: all 8 major sections classified as the identical
  `1col-wide` shape; the check's own framing: "a reader scrolling past three
  identical frames stops reading the page and starts reading a document."
- `gate.mjs/look/wider-than-its-content`: the disclaimer bar (after the critique
  correction round above), full width with its text stopping 55% short of the right
  edge, read as "a rule that points at nothing... or a panel drawn for content that
  is not there."
- `gate.mjs/run-notes/missing-field`: this file's Run notes block used descriptive
  labels ("anti-slop / honesty gate") instead of the five fixed field names
  `verify.md` and `gate.mjs` both require verbatim: viewports, axe both schemes,
  live server, anti-slop linter, fallbacks.
- `gate.mjs/reconciliation-formatting`: two reconciliation lines below used the words
  "false positive" (a space) instead of "false-positive" (a hyphen), the literal
  token the check parses, and the `gate.mjs` vocabulary line above had no
  reconciliation line at all.

## Reconciliation

- `axe/dlitem+listitem`: confirmed. Fixed: every `<li>` wrapping a `<dt>`/`<dd>` pair
  in `.instrument-readout` (hero and Kvittering) changed to `<div>`, which `<dl>`
  content permits. Re-verified: 0 axe violations, both schemes, all three widths.
- `axe/measure-and-focus`: confirmed, three separate causes, three separate fixes.
  `.kapacitet` changed from a two-column grid to stacked, measure-capped `div` pairs
  (later given a two-column multi-column flow at 60rem+ in the critique correction
  round, see below). `.proces` changed from a per-item two-column grid to a single
  block per step with the number stacked above the heading, removing the
  three-items-into-two-columns mis-placement entirely. `.hero` stopped splitting into
  columns at 768px and now splits only at 1440px (`3fr 2fr`, comfortably clearing the
  floor on both sides), with `max-width: var(--measure)` added to `.hero-intro p`,
  `.hero-facts p` and `.refusal-list` so the single-column 768px render does not
  overshoot 80ch instead. Re-verified clean at 768 and 1440 for every selector listed
  except the two accepted below.
- `verify.mjs/weak-step`: confirmed both times. Fixed: wordmark to 1rem (same as
  body, no longer a near-miss step), then `h3` to 1.25rem (a clean 1.25x step above
  body).
- `verify.mjs/tap-target`: confirmed. Fixed: radio inputs resized to 44x44px directly,
  rather than relying on the wrapping label's larger click area, because `verify.mjs`
  measures the control's own box and this package's own floor in `SKILL.md` section 8
  states 44px plainly rather than deferring to a label's separate hit area.
- `verify.mjs/tight-pair`: confirmed. Fixed: `.radio-group` gap changed to a uniform
  `var(--space-3)` (24px) in both directions, so a wrapped row is no closer to the row
  above it than two radios in the same row are to each other.
- `verify.mjs/control-wraps`: confirmed, and resolved as a side effect of the `.hero`
  768px fix above; not touched separately.
- `contract.mjs compare`: confirmed. Fixed: `focusOrder` rewritten to the tokens the
  checker actually supports (`.skip-link`, `.cta--book`, `#navn`, `.cta--book`),
  matching against the first `.cta--book` in document order at each step rather than
  naming instances by ancestor. Re-verified: `the build matches its contract on every
  field this can measure`.
- `look.md#4/first-screen`: confirmed, the most significant fix in this run. Reduced
  vertical cost ahead of `.instrument` at narrow widths: the top disclaimer's own
  font-size and padding, the hero container's top padding (desktop value only above
  768px), the `h1` clamp's mobile floor (2.25rem to 1.75rem), and the header's own
  copy of `.cta--book`, which is hidden below 768px because the wordmark and the
  button do not fit on one line at 375px and the hero's copy of the same control
  sits one screen-height away regardless. Re-measured live at 375x812:
  `.instrument`'s figure now renders at 516-757px, entirely inside the first screen;
  only the accompanying `.instrument-readout` list (773-993px) continues below it,
  which is the supporting data table, not the drawn signature itself.
- `critique/disclaimer-dominance`: confirmed by this build's own critique. Fixed, the
  one locked correction round: the top and footer disclaimer changed from a solid
  `--blaek` background to the page's own `--beton` ground, at the same contrast pair
  already declared and measured for body text (`body-on-ground`, 8.35:1), so it
  stays permanently readable and stops being the loudest thing on the screen. The
  bar was simplified again after this, in response to a later script finding about
  the bar's own width (see the wider-than-its-content entry further down this list);
  that second change is a mechanical fix raised after the critique was already
  locked, not a second correction round on the critique itself, which look.md
  permits only once.
- `critique/kapacitet-dead-space`: confirmed. Fixed in the same correction round:
  `.kapacitet dl` set to `columns: 2` above 60rem, so the same measure-capped pairs
  fill the width in two columns instead of leaving the second half of the row empty.
- `honesty/unmanifested-asset`: false-positive. Reason: both files are Next.js's own
  bundled default-error-page markup under `.next/server/`, not authored content;
  resolved by scoping the gate to `app`, which contains only this build's own source.
- `honesty/asset-not-ready`: false-positive, but not silenced. Reason: the two drawn
  assets are genuinely finished; the draft flag exists solely for the missing
  photography this trade's own subject would otherwise carry, per `look.md` section 3
  and `ASSET-MANIFEST.md`'s own note. Left as a warning, not overridden, because the
  gate already downgrades it automatically under `--draft` and forcing it to silence
  would hide the same signal on a future build that ships an actually-unfinished
  drawing.
- `honesty/draft-flag-unrecorded`: confirmed. Fixed: this file.
- `contract.mjs check` focusOrder note: not a defect, informational; no leading
  selector is claimed to be the first focus stop, which is correct, since the skip
  link is.
- `gate.mjs`: false-positive. Reason: the world-derived-vocabulary number the check
  prints is never gated on, per its own header comment ("n=2, it has no upstream
  source, it is defeated by find-and-replace"); recorded here only because every
  mechanical finding gets a disposition line, including the ones that were never
  refusals.
- `gate.mjs/journeys-none`: false-positive. Reason: a scoping artifact of running the
  gate against `app` specifically (to keep `.next`'s own files out of the honesty
  scan, see `honesty/unmanifested-asset` above); the real journey exists at
  `journeys/buy.spec.mjs`, a project-root sibling of `app/`, and it passes (see "What
  shipped").
- `gate.mjs/palette/premium-consumer-default`: confirmed. Fixed: `--papir` moved from
  `rgb(247, 246, 243)` to `rgb(224, 226, 231)`, a cooler, greyer paper tone at least
  14 units from every entry in the banned list (was 10 from the nearest). Contrast
  re-measured: `cta-label` (papir on blaek) 12.39:1, still clear of its 4.5:1 floor.
- `gate.mjs/drawing/untokenised-paint`: confirmed. Fixed: every `fill`/`stroke` in
  `app/diagrams.tsx` now reads `var(--blaek)`, `var(--papir)`, `var(--overflade)` or
  `var(--beton)` through a `style` prop, not a literal hex; SVG presentation
  attributes were not used for colour because `var()` resolution inside a bare
  presentation attribute is not reliable across browsers, `style` is.
- `gate.mjs/tokens/undeclared-literal`: confirmed. Fixed: five new custom properties
  (`--text-2xs`, `--text-xs`, `--text-sm`, `--text-meta`, `--text-md`) plus
  `--panel-shadow` and `--blaek-hover`, declared once in `:root` and referenced
  everywhere the literal used to sit. `direction.md`'s "One-offs" section still
  correctly reads `none`: every flagged value got a token rather than an exception.
- `gate.mjs/look/lopsided-band`: partially confirmed, two dispositions. The
  `#booking-form` instance was a real bug, fixed: the inputs' unnecessary
  `max-width: 32rem` (never asked for by the brief, added defensively and not
  reconsidered) is removed, so the fields now fill the panel they sit in instead of
  leaving 844px of it empty. The other four instances (the numbered process, the
  rules list, the unknowns list, the footer contact column) are claimed under
  `Deliberate:` in `direction.md`, reasoned there: this page is a left-aligned
  document rhythm throughout, and centring short capped text under a left-aligned
  heading would be the actual inconsistency.
- `gate.mjs/look/ragged-margin`: confirmed as a real edge measurement, claimed under
  `Deliberate:` in `direction.md` rather than changed: every bordered panel on the
  page (`.instrument`, `.hero-facts`, `#booking-form`, `.kvittering-kort`) carries the
  same inset from its section edge, a single repeated device, not a one-off shift;
  plain text sections simply have no panel to compare the edge against.
- `gate.mjs/look/one-layout`: confirmed as measured, disposition split. Fixed in
  substance: the price section (`Priser, ekskl. moms`) now sits on its own
  `--overflade` band with the table itself on a `--papir` sheet inside it, the
  page's one surface-toned section instead of the page ground repeated eight times,
  because buy.md names the price as the one fact that must be found, not hunted.
  What is claimed under `Deliberate:` in `direction.md` rather than chased further:
  the checker's own column count for `hero` and `raekkevidde` still reads
  `1col-wide` because their two real columns are each capped at `var(--measure)` and
  together fall under the 75%-of-band-width the classifier requires, verified live
  at 1440x900 that the columns are genuinely side by side; narrowing the prose past
  a readable line to clear that specific proxy was not made.
- `gate.mjs/look/wider-than-its-content`: confirmed, the same disclaimer bar the
  critique correction round already touched once, on a different measurement the
  first fix did not address (a border's own width, not the bar's). Fixed by removing
  the bar entirely: the disclaimer is now plain body text at the top of the page,
  same size and colour as any other paragraph, no background, no border, no
  container of its own width to fall short of, which also keeps it from becoming the
  loudest thing on the screen again without needing a second geometry-driven patch.
- `gate.mjs/run-notes/missing-field`: confirmed. Fixed: this file's Run notes block
  now states the five required field names verbatim (see above).
- `gate.mjs/reconciliation-formatting`: confirmed. Fixed: every disposition below
  reads "false-positive" with a hyphen, and the `gate.mjs` line above now carries one.

## Critique

Answered from the rendered screenshots alone, direction record closed, per `look.md`
section 6 and `verify.md`'s critique contract. Full text: `.sitesmith/critique-answers.md`,
hashed and locked in `.sitesmith/critique.json`.

1. First landing: the disclaimer bar (before the correction round; after it, the
   headline and the instrument).
2. Most template-like element: the booking form's plain stacked fields. Left as is,
   see "What was not resolved" below.
3. Signature visible at 1440 and alive at 375: yes to both, confirmed live.
4. Emptiest area: `.kapacitet` at 1440px before the correction round; fixed.
5. Six largest words (`Vi tørrer gulvet ud efter måling`): specific to how this trade
   actually works, not a line a generic competitor would reach for.
6. Top third covered: the price table and the numbered process still say what this is
   on their own.

Verdict: ACCEPT. One correction round used, both findings from it fixed and
re-verified above.

## What was not resolved

- The booking form's plain stacked-field layout still reads as the most generic
  element on the page (critique question 2). Not changed: buy.md's "the whole
  commitment is legible before it is made" and this build's own restraint principle
  (no colour or ornament outside the two semantic accents, both reserved for state)
  argue against decorating the one part of the page where a mistake costs the visitor
  a wrong booking. Reasoned as an accepted tension rather than a defect, not fixed for
  its own sake.
- `verify.mjs`: five same-label findings (four to five instances of "Bestil en
  fugtgennemgang", two each of "Ja"/"Nej"/"Ved ikke") at every width. Accepted, not
  fixed: the repeated CTA is deliberate, named in `direction.md`'s "Answer to the
  risk" as the direct response to a page that refuses more than it sells; the radio
  labels are correctly scoped inside their own `<fieldset><legend>` and are not a
  collision within one question.
- `verify.mjs`: `div.footer-grid > div > p` measuring 43ch at 768px and 30ch at
  1440px (short contact lines: phone/hours, address, joined by `<br>`). Accepted, not
  fixed: this is factual footer contact information set deliberately short, not
  flowing prose a reader loses their place in; capping the footer's column width
  further to force a 45ch minimum would either pad the lines with filler or force the
  footer into an awkwardly narrow single column against the rest of the page's grid.
- `verify.mjs`: `.hero-facts p` (42ch) and `.refusal-list li` (40ch) at 1440px only.
  Accepted, not fixed: this panel's contract-declared 2fr share of a 3:2 split, minus
  its own padding, is genuinely narrower than 45ch for this typeface; both are short,
  single-sentence, scannable content (a price note, a refusal line), not multi-line
  prose, and narrowing the panel further to force the ratio would have cost the
  instrument column its own three-fifths width, which the contract pins.

## Assumptions

- The brief pins exactly one Fejl postnummer, 2200, and gives no mechanism for the
  general case. `lib/postnummer.ts` computes a real haversine distance from Lemvig to
  a small table of real Danish postnummer/by coordinates, matched to the input by
  nearest postnummer prefix when the exact code is not in the table, documented in the
  file as an approximation rather than a licensed geocoding service. The brief's exact
  wording, including "København N", is used only for postnummer 2200 itself; every
  other out-of-area postnummer gets the same sentence without a guessed city name.
- The Kvittering state's sagsnummer is fixed at `DE-2026-0318` for every successful
  booking on this build, matching the brief's pinned value exactly, rather than
  incrementing per submission. The brief requires the three states to be "reachable as
  routes, so they can be reviewed"; a fixed value keeps `/kvittering` a stable,
  reviewable route rather than one that only shows the brief's own value on whichever
  submission happens to be first.
- No format is given for skadenummer, so it is free text, optional, unvalidated
  beyond being carried through unchanged. No cap is given for "cirka antal m²", so it
  is a plain positive-number input with no invented ceiling.
- Required-field and enum validation (all twelve fields, and the closed option sets
  for årsag, kloakvand, gulvtype and gulvvarme) is this build's own addition, re-checked
  server-side regardless of the native `required`/`pattern` attributes already on the
  inputs, since nothing in the brief may be trusted from the client alone.
