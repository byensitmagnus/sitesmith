# DESIGN-SYSTEM — The Cleeve Seed Library

Derived from the winning comp in `DIRECTION.md` (comp A, the specimen sheet), not from an
example. One page today; the contract exists so the second one — a printed guide, a page per
crop — costs nothing to be consistent with.

---

## 1. Tokens

```css contract
:root{
  color-scheme:light dark;

  /* spacing — one step of 8px; ramp is 0.5 1 1.5 2 3 4 6 8 12 × step */
  --step:8px;
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px;
  --space-5:24px; --space-6:32px; --space-7:48px; --space-8:64px; --space-9:96px;

  /* type — base 1rem; heading roles are ×1.333 each step, rounded to 0.0625rem */
  --text-micro:0.75rem; --text-small:0.875rem; --text-body:1rem; --text-lead:1.125rem;
  --text-h3:1.3125rem; --text-h2:1.75rem; --text-h1:2.3125rem; --text-display:3.1875rem;
  --leading-tight:1.06; --leading-heading:1.2; --leading-body:1.6;
  --measure:64ch;

  /* families — two, plus a monospace that carries the figures */
  --font-display:'Iowan Old Style','Palatino Linotype',Palatino,'Book Antiqua',Georgia,serif;
  --font-body:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  --font-mono:ui-monospace,'Cascadia Mono','Segoe UI Mono',Consolas,'DejaVu Sans Mono',monospace;

  /* shape — square at both ends of the scale. This is a system, not an omission: see §2. */
  --radius-inner:0; --radius-outer:0;

  /* elevation — three levels, all of them none. Paper does not cast a shadow: see §2. */
  --elev-0:none; --elev-1:none; --elev-2:none;

  /* rules — the only separator this page owns */
  --rule-hair:1px; --rule-hard:2px;

  /* container and grid */
  --container:1180px; --gutter:clamp(16px,4vw,32px); --grid-columns:12;

  /* colour — buff paper, ink, one stamp red. Light is the default scheme. */
  --paper:#f1e8d8;
  --paper-2:#e8ddc9;
  --line:#cbbda4;
  --ink:#1d1a15;
  --ink-2:#57503f;
  --accent:#a32b17;
  --on-accent:#f6efe1;

  /* motion */
  --motion-fast:120ms; --motion-base:200ms; --motion-slow:320ms;
  --ease:cubic-bezier(.2,.6,.2,1);
}
@media (prefers-color-scheme:dark){
  :root{
    --paper:#15120f;
    --paper-2:#1e1a15;
    --line:#3b342b;
    --ink:#efe6d5;
    --ink-2:#b0a48e;
    --accent:#f0876b;
    --on-accent:#1a1511;
  }
}
```

**Where the colours come from.** `EVIDENCE.md` §4: the library owns no brand colour, so
nothing is being overridden. `--paper` is the buff of manila card and kraft seed envelopes;
`--ink` is graphite; `--accent` is the printed red of a library date stamp, the one mark in a
branch library that means *this comes back*. All three are marked `(inferred)` in the evidence
pack as properties of the trade rather than of this library, which is why they decide a
palette and are never stated on the page as fact.

**Measured contrast, both schemes** (the pairs that actually appear):

| pair | light | dark |
| --- | --- | --- |
| `--ink` on `--paper` | 13.7:1 | 15.1:1 |
| `--ink-2` on `--paper` | 6.6:1 | 7.6:1 |
| `--ink-2` on `--paper-2` | 6.0:1 | 7.2:1 |
| `--accent` on `--paper` | 5.8:1 | 7.4:1 |
| `--on-accent` on `--accent` | 6.2:1 | 7.2:1 |

`--on-accent` flips with the scheme: paper on red in light, ink on coral in dark.

**No semantic status group.** There is no form on this page, nothing is submitted, and nothing
can succeed or fail on the network. The one state that needs announcing — the slip at its
six-packet limit — is carried by `--accent` plus a sentence, never by colour alone (core D4).
Adding `--ok/--warn/--bad` here would be three tokens nothing uses.

---

## 2. Components

**Buttons.** One variant, `.btn`, plus a quiet `.btn--quiet` for *Take it off* and *Clear the
slip*.

| state | `.btn` | how it is reached |
| --- | --- | --- |
| rest | `--accent` ground, `--on-accent` label, square, `--space-3`/`--space-4` padding, min-height 44px | — |
| hover | ground darkens by a `color-mix` of 12% `--ink`; cursor pointer | pointer |
| `:focus-visible` | 2px `--accent` outline at 3px offset, on `--paper` so it reads outside the button | Tab |
| active | translate 1px down, no colour change | pointer or Space/Enter |
| aria-disabled (the cap) | `--paper-2` ground, `--ink-2` label, 1px `--line` border, still focusable, still clickable; clicking announces *why* in the status region | six packets already on the slip |
| loading | **does not exist.** Nothing on this page waits on anything. Declared absent rather than styled and unreachable (`v2/40`). | — |

`.btn--quiet`: no ground, `--ink-2` label, 1px `--line` underline, same focus treatment, same
44px minimum.

**Form controls.** None. There is no input, select, checkbox, radio or textarea on this site —
nothing is submitted, and the library takes no details. The focus treatment above is therefore
the project's only one, and it is the same on buttons and links.

**Header and footer.** Header: `mark-czar` at 34px + wordmark in `--font-display`, three
in-page destinations, and the slip counter (`--font-mono`, tabular). Height 64px, **not
sticky** — a sheet of paper does not follow you down the page. Below 700px the three
destinations wrap under the wordmark and the counter stays on the first line, because the
counter is the only one that changes. No disclosure, no hamburger: four items that all fit.
The current section is marked with `aria-current="true"` and a 2px `--accent` underline.
Footer: the same mark, the opening hours repeated, and the drawing note. Both are separated
from `main` by `--rule-hard`.

**Elevation and layering.** All three levels are `none` and that is the decision, not an
omission: the direction is one continuous sheet of paper, and the moment something floats
above it the page becomes a dashboard. Two things overlap on this page — the sticky slip
column above 1100px and the focus ring — and neither uses a shadow. `z-index` is declared
once: slip column `1`, focus ring `2`, nothing else.

**The ruled pair.** Four things on this page are the same component with different content:
`.facts`, `.terms`, `.hours__list` and `.crosslist`. A `<dl>` where each `<div>` is one row —
a monospace small-capital key on the left, the answer on the right, a hairline under every row
and a 2px ink rule over the first. It collapses to one column below 700px (900px for
`.facts`). Anything on this site that is *a label and a value* uses it; nothing else does.
`.note` is the same idea for a single paragraph with a key beside it.

**The key.** `5fr auto 4fr` at ≥1100px — five drawings, a 2px ink rule, four drawings, one
frame. Below that the two groups stack with the rule turning horizontal, and each group's grid
goes to three columns below 620px. The group headings are the same `.eyebrow` component, and
the one over the four crossing crops has a **dashed** bottom rule, matching the broken outline
of the drawings beneath it. That is the whole legend.

**Density.** Marketing, so the open end of the ramp: `--space-7`/`--space-8` between sections,
`--space-4`/`--space-5` inside them. The index is the exception and is deliberately tighter —
`--space-3` between rows — because nine entries a visitor is comparing want to be readable in
one movement of the eye, and a ledger that breathes is a ledger you have to scroll.

---

## 3. Voice

**Image treatment.** Drawn, never photographed. Ink line on paper, no colour except the stamp
red on the return arc of `borrow-year` and the 96 filled marks of `returns-2025`. Authored at
a 100-unit square (or a fixed landscape box) and **scaled, never cropped**. `currentColor`
throughout, so every drawing inverts with the scheme and there is one treatment, not two.
Two states only: solid fill means the seed comes back true, a 7/5 broken outline means it does
not. Nothing stands in when an asset is missing, because nothing is missing — see
`ASSET-MANIFEST.md`.

**Copy register.** Sentence case everywhere, including buttons. Second person, present tense,
and the volunteers speak as *we*. Numbers: figures always, in `--font-mono`, tabular, never
spelled out except in a heading. Times as `14:00–18:00` with an en dash. Cultivar names in
italic inside single quotes — *'Czar'*, *'Pentland Brig'* — which is how a seed list sets them
and how the brief sets them. Never *shop*, *basket*, *collection*, *curated*, *free of charge*
(`EVIDENCE.md` §2).

Three strings to pattern-match against:

- heading — *"Four that will not come back the same"*
- button — *"Add to slip"*
- the cap — *"Six packets a visit. Take something off the slip first."*

**Iconography.** There is no icon set and nothing on this page is decorated. Every SVG on the
site is one of the five manifest rows, and each carries information. A seventh drawing would
need its own `ASSET-PLAN.md` block before it could be added.

**Motion.** One entrance, once: the nine key seeds fade and rise 6px over `--motion-base`,
staggered across three groups, on first paint — justified because the key is the one thing the
eye must land on and the stagger says *these are separate objects*. Everything else on the
page is still. State changes on buttons and slip lines use `--motion-fast`. Nothing animates
on scroll. All of it is inside `@media (prefers-reduced-motion:no-preference)`, so reduced
motion gets a page with no animation at all rather than a shortened one.

---

## 4. Page inventory

| Page | Purpose | Primary action | Blocks |
| --- | --- | --- | --- |
| `/` | A first-time borrower picks up to six packets they can actually save, and learns what returning means | **Add to slip** (nine instances, one per crop) | masthead, statement + `.facts`, section-head, seed-key + `.eyebrow` ×2, `.note`, pollen-key + `.crosslist`, drawer-index (nine `.row`), borrowing-slip, borrow-year + `.terms`, returns-figure, volunteers, `.hours__list`, footer |

---

## 5. One-off values

| Value | Where | Why it is not a token |
| --- | --- | --- |
| `5fr auto 4fr` | the key at ≥1100px | the nine drawings have to sit in one frame at one scale, cut by a rule between the fifth and the sixth. A fixed cell width from the ramp would leave a ragged column and break the single frame the whole comparison depends on, so the cell is whatever nine equal fractions of the container come to (≈112px at 1440) |
| `44px` | the minimum height of every button, nav link and the counter | this is the accessibility floor from core H5, not a design value. It outranks the ramp and it is stated here so nobody "tidies" it back to `--space-5` |
| `320px` | the slip column at ≥1100px | a content measurement: six lines of "crop, cultivar, and the one sentence it wants in autumn" without the cultivar name wrapping |
| `34px` | `mark-czar` in the masthead and footer | the mark is optically correct against a 19px wordmark at 34, and 32 reads small against the display serif's cap height |
| `18px` | the seed drawing on a slip line | the smallest size at which solid and broken are still two different things; below it both read as a dot, and the signature stops working exactly where the promise is being made |
| `7 5` | the broken-outline dash on the four hard seeds | a dash pattern is a drawing decision, not a length; 7/5 is the coarsest that still reads as one seed at 16px on a slip line |
| `0.06em` | letter-spacing on monospace small capitals | the mono faces in the stack are set tight for code; the eyebrow labels need air at 12px and the tracking is per-face optical, not a scale value |
