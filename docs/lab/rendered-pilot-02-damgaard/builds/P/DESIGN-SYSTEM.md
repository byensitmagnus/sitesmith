# Design system — Damgaard Estrik

Derived from `BRIEF.md` and `DIRECTION.md`. Every value a page uses is either a token below
or a documented one-off in §5.

## 1. Tokens

```css contract
:root{
  /* spacing — 8px step, everything derived */
  --step:8px;
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px;
  --space-5:24px; --space-6:32px; --space-7:48px; --space-8:64px; --space-9:96px;

  /* type — named roles. base 16px, ratio 1.333 (editorial), rounded. */
  --text-micro:0.75rem;    /* 12px — fine print, mono labels, reference codes */
  --text-small:0.875rem;   /* 14px — hints, meta, captions */
  --text-body:1rem;        /* 16px — prose */
  --text-lead:1.125rem;    /* 18px — intro paragraphs */
  --text-h3:1.25rem;       /* 20px — card/section sub-headings */
  --text-h2:1.75rem;       /* 28px — section headings */
  --text-h1:clamp(2rem,1.55rem + 1.9vw,2.75rem);   /* 32px -> 44px — page headings */
  --text-display:clamp(2.5rem,1.7rem + 3.3vw,4rem); /* 40px -> 64px — hero only */
  --leading-tight:1.15;
  --leading-body:1.6;
  --measure:68ch;

  /* shape */
  --radius-inner:3px;   /* inputs, chips, tags */
  --radius-outer:6px;   /* panels, cards */
  --radius-full:999px;  /* the ekskl.-moms tag, the case-number badge */

  /* elevation — flat by default; see contract note below */
  --elev-0:none;
  --elev-1:0 2px 6px rgb(32 28 22 / .12), 0 1px 1px rgb(32 28 22 / .06);

  /* container and grid */
  --container:1180px; --gutter:clamp(16px,4vw,32px); --grid-columns:12;

  /* colour — light (default) */
  --bg:#F0ECE3; --surface:#FAF7F1; --surface-2:#ECE7DC; --line:#D8D1C2;
  --ink:#201C16; --ink-2:#5B5245;
  --accent:#8A4A12; --on-accent:#FCFAF6;
  --ok:#39653A; --bad:#9C2B1F;

  /* type families */
  --font-display:'IBM Plex Sans Condensed',ui-sans-serif,system-ui,sans-serif;
  --font-body:'IBM Plex Sans',ui-sans-serif,system-ui,sans-serif;
  --font-mono:'IBM Plex Mono',ui-monospace,'SFMono-Regular',Menlo,monospace;

  /* motion budget */
  --motion-fast:120ms; --motion-base:200ms; --motion-slow:320ms;
  --ease:cubic-bezier(.2,.6,.2,1);
}
@media (prefers-color-scheme:dark){
  :root{
    --bg:#16130F; --surface:#201A13; --surface-2:#2A231A; --line:#3A3226;
    --ink:#F2EDE3; --ink-2:#C7BEAE;
    --accent:#E2954A; --on-accent:#16130F;
    --ok:#8FC793; --bad:#F0917F;
    --elev-1:0 2px 8px rgb(0 0 0 / .40), 0 1px 1px rgb(0 0 0 / .30);
  }
}
@media (prefers-reduced-motion: reduce){
  *, *::before, *::after{
    animation:none !important;
    transition:none !important;
    scroll-behavior:auto !important;
  }
}
```

All colour pairs above were checked against WCAG AA before being written down (both
schemes): ink/bg 14.4:1 and 15.9:1 (light), 15.9:1 and 14.8:1 (dark); ink-2/surface-2
6.2:1 and 8.4:1; accent/bg 5.8:1 (light) and 7.6:1 (dark), passing body-text AA in both
directions, not just the 3:1 large-text minimum. `--on-accent` is the pair that actually
flips: light-mode accent is dark enough to carry a light label; dark-mode accent is light
enough that it needs the dark ink colour on it, not white — white-on-dark-accent measured
2.4:1 and was rejected.

## 2. Components

**Visual grammar** (from `DIRECTION.md`, verbatim):
- surface: open space as the primary separator, hairline rules confined to tables and
  diagrams — enacted by `.rule-table`, `[data-diagram]` and the price list, which are the
  only places `--line` appears as a border. Section boundaries elsewhere are space only.
- labels: sentence-case in the body face for nav/eyebrows; mono reserved for figures and
  reference codes — enacted by `.figure` (mono, tabular-nums) applied only to priced,
  measured, dated or logged numbers, never to a section label.
- figures: functional tabular — `.figure` sets `font-variant-numeric: tabular-nums` and
  `--font-mono`; used in the price list, the threshold table, the receipt and the case
  number, not decoratively elsewhere.
- depth: flat (`--elev-0`) everywhere except `.receipt-panel`, which alone uses `--elev-1`.

**Buttons.** One primary, one secondary/quiet (nav link styled as a button-adjacent link
uses the quiet treatment).
- Primary: `background:var(--accent); color:var(--on-accent); border:1px solid transparent;
  border-radius:var(--radius-inner)`. Hover: background darkens 8% (light) / lightens 8%
  (dark) via `filter:brightness()`. `:focus-visible`: `outline:3px solid var(--accent);
  outline-offset:2px` (light) / the accent already reads on dark so the same rule holds.
  Active: `filter:brightness(0.92)`, no movement. Disabled: not used — the booking form has
  no client-side "disable while invalid" state, because the whole point is that it works
  without JavaScript; validation happens server-side on submit. Loading: not used for the
  same reason — a full page navigation is the "loading" state and the browser's own chrome
  carries it.
- Secondary/quiet: `background:transparent; color:var(--ink); border:1px solid var(--line)`.
  Hover: `border-color:var(--ink-2)`. Same focus ring as primary.

**Form controls.** Text/email/tel/date/number inputs: `background:var(--surface);
border:1px solid var(--line); border-radius:var(--radius-inner); min-height:44px;
padding:var(--space-3) var(--space-4)`. Label sits above the field, `--text-small`,
`color:var(--ink)`, `font-weight:600`. A hint (where the answer is not obvious — postal
code format, "må stå tomt") sits below the label and above the field, `--text-small`,
`color:var(--ink-2)`. An error replaces the hint's position, `--text-small`,
`color:var(--bad)`, prefixed with a text glyph (not colour alone) and wired to the field
with `aria-describedby`; the field also gets `aria-invalid="true"` and, when it is the
field that caused the error, the `autofocus` attribute — chosen specifically because it
moves focus without any client-side JavaScript. Radio groups (årsag, kloakvand, gulvtype,
gulvvarme): native `<fieldset>` + `<legend>` + `<input type=radio>`, each option a full-row
label with a visible outer ring, 44px min touch target, `--space-2` between options. One
focus treatment for the whole project: `:focus-visible{outline:3px solid var(--accent);
outline-offset:2px}` on every interactive element, nothing else removes or replaces it.

**Header and footer.** Header: two rows collapse to one — a thin top strip (always
present, all widths) carrying the fictional-company line, then the main bar carrying the
wordmark, phone number and the primary action. Height: 40px strip + 64px bar at ≥768px;
same two rows stacked slightly tighter under 768px, never hidden, never behind a toggle.
Not sticky — a sticky header on a form this short adds complexity the brief does not ask
for and a sticky bar would have to also carry the disclosure line to satisfy "permanent,"
which crowds a phone screen. Current nav item marked with `aria-current="page"` and an
underline in `--accent`. Footer: company facts block (CVR, address, phone, hours, area),
nav repeat, and the same disclosure line again — present at the end of every page for
anyone who scrolled straight past the header.

**Elevation and layering.** `--elev-0` (none) is the default for every surface. `--elev-1`
is used exactly once, on `.receipt-panel`. No z-index stacking exists in this project: no
modal, no dropdown, no toast — the brief explicitly rules out chat, login and a price
calculator, and the fictional-company line is required to never sit behind a dialog, so no
overlay surface was built at all.

**Density.** Marketing pages (`/`, `/priser`) use `--space-6`/`--space-7` between sections.
The form (`/bestil`) and the price/threshold tables use `--space-3`/`--space-4` — denser,
because a form and a comparison table are read differently from an argument.

## 3. Voice

**Image treatment.** None. Deliberately imageless per `DIRECTION.md`; the three diagrams
(`[data-diagram]`) are drawn line art (inline SVG), stroke-only, using `--line` for
construction lines, `--ink` for labels and `--accent` for the one measured value being
called out. Same stroke width (1.5px) and the same colour logic across all three.

**Copy register.** Danish, du-form, sentence case. Prices always written `2.400 kr.
ekskl. moms` with the "ekskl. moms" mark repeated at every price, never assumed from
context. Dates as `18.–45. døgn` / `3 til 9 hverdage`. The company calls the visitor "du,"
never "kunden" in body copy. Three patterns:
- Heading: "Hvem vi ikke kan hjælpe" (describes the section, not a slogan).
- Button: "Book en fugtgennemgang" (the outcome, not "Send" or "Submit").
- Error: "Er der kloakvand eller spildevand i konstruktionen, må vi ikke røre den." (states
  the rule and the consequence, not "Ugyldigt input").

**Iconography.** No icon set. The only authored marks are the wordmark and the three
diagrams; no decorative icons anywhere (core rule A-adjacent: nothing stands in for a fact
that isn't there). Where a yes/no/don't-know state needs a non-colour carrier (D4), it is
carried by a text glyph and position, not a coloured dot.

**Motion.** Hero only: a 200ms fade-and-rise on the headline, subhead and primary action,
staggered by 60ms, on first paint, via CSS `@keyframes` (no JavaScript, no
IntersectionObserver). Everywhere else: only `:hover`/`:focus-visible` transitions on
interactive elements, `--motion-fast`. Nothing animates inside the form. Reduced motion
removes all of it — `animation:none; transition:none` — not a shortened duration.

## 4. Page inventory

| Page | Purpose | Primary action | Blocks |
| --- | --- | --- | --- |
| `/` | Establish who this is, who is served, what it costs, and get the visitor to the booking form | Book en fugtgennemgang | disclosure-strip, header, hero, area-check, how-it-works (diagram), price-summary, refusals, footer |
| `/priser` | Full written overslag reference for husejere, taksatorer and skadebehandlere | Book en fugtgennemgang | disclosure-strip, header, price-table, threshold-table (diagram), refusals-detail, unknowns, footer |
| `/bestil` | Collect the 12-field booking form; Tom and Fejl states live here | Send booking (server action) | disclosure-strip, header, form, error-summary, footer |
| `/kvittering` | Kvittering state — confirmation, case number, what to do until arrival | Ring 97 00 41 20 (only if something is unclear) | disclosure-strip, header, receipt-panel, footer |

## 5. One-off values

| Value | Where | Why it is not a token |
| --- | --- | --- |
| `1.5px` | diagram stroke width (`[data-diagram] path/line`) | `1px` disappears on a hairline construction line at small viewport scale; `2px` reads as a UI border rather than a drawn line |
| `40%` / `65%` / `85%` / `2.0` marker positions inside the diagrams | the three `[data-diagram]` SVGs | these are measured facts from `BRIEF.md` plotted at their real proportional position, not a design choice |
| `60ms` stagger | hero entrance animation-delay | one specific offset for a three-element stagger, not a reusable duration — the durations themselves are `--motion-base` |
