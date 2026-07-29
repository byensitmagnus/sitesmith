# DESIGN-SYSTEM.md — Falkner & Vane

Derived from comp A, the winning direction, and from nothing else. It sits beside
`index.html` rather than at the project root because `token-drift.mjs` reads the page next to
the contract, and the page this contract governs is `site/index.html`.

## 1. Tokens

Copied verbatim into the `<style>` block at the head of `site/index.html`. This is the
vocabulary, not a description of it.

```css contract
:root{
  /* spacing: one step of 8px, ramp 0.5 1 1.5 2 3 4 6 8 12 */
  --step:8px;
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px;
  --space-5:24px; --space-6:32px; --space-7:48px; --space-8:64px; --space-9:96px;

  /* type: base 17px, ratio 1.25, eight roles */
  --text-micro:0.6875rem; --text-small:0.8125rem; --text-body:1.0625rem;
  --text-lead:1.25rem; --text-h3:1.3125rem; --text-h2:1.75rem;
  --text-h1:2.5rem; --text-display:3.25rem;
  --leading-tight:1.08; --leading-body:1.58;
  --measure:64ch;

  /* shape: hard corners, both values zero. Pit copings, bench, a ruled page. */
  --radius-inner:0; --radius-outer:0;

  /* elevation: none. Separation is by rule and by ground. */
  --elev-0:none; --elev-1:none; --elev-2:none;

  /* container and grid */
  --container:1120px; --gutter:clamp(20px,5vw,40px); --grid-columns:12;

  /* colour */
  --bg:#e6dcc6; --surface:#efe7d6;
  --line:#b9a882; --rule:#9c8a5f;
  --ink:#241a11; --ink-2:#5a4a34;
  --accent:#8f3a16; --on-accent:#f6efdf;
  --bad:#8f2216;

  /* the reversed inset: the pit section, and only that */
  --pit-bg:#16110a; --pit-ink:#e7ddc7; --pit-ink-2:#a99a80;
  --pit-line:#3d3220; --pit-rule:#57482f;
  --pit-accent:#e0954f; --pit-on-accent:#16110a;

  /* families */
  --font-display:Georgia,"Iowan Old Style","Palatino Linotype","Book Antiqua",serif;
  --font-body:Georgia,"Iowan Old Style","Palatino Linotype","Book Antiqua",serif;
  --font-mono:"DejaVu Sans Mono",ui-monospace,"SFMono-Regular",Menlo,Consolas,"Liberation Mono",monospace;

  /* motion */
  --motion-fast:120ms; --motion-base:200ms;
  --ease:cubic-bezier(.2,.6,.2,1);

  color-scheme:light dark;
}
@media (prefers-color-scheme:dark){
  :root{
    --bg:#17110a; --surface:#1e170e;
    --line:#4d3f2a; --rule:#6a583a;
    --ink:#e8dec8; --ink-2:#b2a17f;
    --accent:#e0954f; --on-accent:#17110a;
    --bad:#e08a7c;
    --pit-bg:#e6dcc6; --pit-ink:#241a11; --pit-ink-2:#5a4a34;
    --pit-line:#b9a882; --pit-rule:#9c8a5f;
    --pit-accent:#8f3a16; --pit-on-accent:#f6efdf;
  }
}
```

**Where the colour comes from.** `EVIDENCE.md` §4 records that everything this subject is
surrounded by is brown, and that the palette therefore has to earn its contrast from value
rather than hue. `--bg` is the buff of undyed vegetable-tanned leather. `--ink` is oak liquor
at strength. `--accent` is the russet an oak-tanned hide reaches, which is why it is the one
colour on the page that is not simply a value of the ground.

**One accent, one meaning: now, and the thing you do now.** It appears in exactly three
places: the primary action, the nav item you are currently in, and the line marked *today,
July 2026* on the pit calendar. The focus ring uses it too, on the same logic. The compare
control deliberately does **not** use it: a chosen row is marked by weight, by an A or B tag
and by the four others dimming, so the accent is not diluted into a fourth job.

**`--on-accent` flips with the scheme.** Light: pale buff on russet. Dark: near-black on amber.

**Radius is zero, everywhere.** This is a system, not an absence of one: pit copings, bench
edges, a ruled page in a yard book. Two values are declared because the relationship is the
rule (inner tighter than outer) and a second page will need it stated; `full` is not declared,
because there is no avatar and no dot on this site.

**Semantic colour is one value, `--bad`.** The only status this page can be in is invalid, so
`--ok` and `--warn` are not declared. A page with a real success or warning state adds them
here rather than inventing them at the call site.

**Elevation is none, declared rather than omitted.** Nothing on this page floats. Every
separation is a hairline rule, a change of ground or space. A shadow would put a drawn section
on a card, and the drawings are meant to be on the page rather than on top of it.

## 2. Components

**Buttons.** Two variants. `.btn` (primary): 1.5px `--accent` border, `--accent` ground,
`--on-accent` label, mono at `--text-small` in capitals with 0.13em tracking, 44px minimum
height. *Rest* as described; *hover* inverts to a transparent ground with the accent as the
label, which reads as the ink coming forward rather than the panel lighting up; *focus-visible*
adds the project focus ring, 2px `--accent` offset 3px, outside the border; *active* translates
1px down; *disabled* drops to a `--line` border, no fill, `--ink-2` at 62 per cent, and
`not-allowed`. `.btn--quiet` (secondary: Clear, Start again) is the same geometry with a
`--rule` border and an `--ink-2` label.

*Loading is deliberately absent.* Nothing on this page is asynchronous, and
`v2/40-interaction.md` says a state with no way in is deleted rather than styled. The
disabled state, by contrast, is genuinely reached: Clear is disabled until there is a
comparison to clear, and re-enabled the moment there is one, including in the error state,
so it is never a dead end.

**Form controls.** `select`, `text` and `number` share one treatment: `--surface` ground,
1.5px `--rule` border, zero radius, 44px minimum height, body serif at `--text-body`. Label
above in mono micro capitals; hint below in `--text-small`, `--ink-2`; error below the hint in
mono `--text-small`, `--bad`, wired with `aria-describedby` and `aria-invalid`. `number` is set
in the monospace and is 9ch wide, because a quantity is a figure.

**One focus treatment for the whole project:** `outline: 2px solid var(--accent)` at 3px
offset. Learned once, on the nav, and recognised on the drawings, the selects and the buttons.

**Header and footer.** Header: the drawn mark at 30px (22px below 620px), the primary action
opposite it, the four-item nav on a second line, the tally rule below the wordmark. It is not
sticky: the page is short and a sticky bar over a scale drawing would cover the thing being
read. Footer: the same mark at 20px, the standing facts, and the same tally. The current nav
item is marked with `aria-current` and a 2px accent underline, set by an IntersectionObserver.

**Density.** This page runs at the open end of the ramp, `--space-6` to `--space-9` between
sections and `--space-2` to `--space-4` inside a plate row. A second page that was denser
would move down the same ramp and would not introduce a second one.

## 3. Voice

**Image treatment.** Everything is drawn, in ink on the ground, from a measured value. One
treatment across all four assets: hard ends, no fill gradients, no radius, hairlines at 1 to
1.5 units, and a caption under any drawing that states what it is drawn from and what it is
not. Aspect ratios: the plate rows are 560 by 132 units, the yard is 220 by 116, and the
calendar takes the full measure of the pit section. There is no photography and there is no
placeholder standing in for photography; the direction says imagery is diagram-led and the
manifest carries no row that is not `ready`.

**Copy register.** Sentence case everywhere except mono labels, which are capitals. First
person plural, present tense: *we tan*, *we sell*, *we do not sell to the public*. Figures are
written as they are measured, with the unit spaced: `1.4 mm`, `11 months`, `3 weeks`. Dates are
`July 2026`. No price is ever written, in any form. Three strings a writer can pattern-match:

- heading: *Nine to fourteen months. Nothing changes that.*
- button: *Write the enquiry*
- error: *Choose one of the six leathers.*

**Iconography.** None. There is no icon set on this page and there will not be one; the four
drawings and the tally are the entire authored vocabulary. The mark is the only place the
wordmark is set in the display face with a deliberate adjustment (0.16em tracking at 21 units).

**Motion.** Two transitions and no more: the plate dimming when a comparison is made
(`--motion-base`, a state change) and the button ground on hover (`--motion-fast`, feedback).
Nothing animates on scroll, nothing animates on entrance, and nothing animates in the form.
`prefers-reduced-motion` collapses both to 1ms.

## 4. Page inventory

| Page | Purpose | Primary action | Blocks |
| --- | --- | --- | --- |
| `/` | Let a bookbinder choose one of six leathers on substance, temper and grain, and see when it can ship | Write the enquiry | masthead, opening, plate, key, compare, spec-table, pit-inset (yard, calendar), terms, enquiry, footer |

## 5. One-off values

| Value | Where | Why it is not a token |
| --- | --- | --- |
| `22` units per millimetre | the plate drawings | the drawing scale. It is a property of the plate, not of the type or the grid, and it is shared between the SVG generator and the overlay script so the two cannot drift |
| `84` units | the plate baseline | the same reason: the one line every strip stands on |
| `4.1667%` | the calendar track gridlines | one month of a twenty-four month axis. Arithmetic, not a spacing decision |
| `45.8%`, `20.8%`, `62.5%` and the rest | the calendar bars | positions on that axis, computed by `tools/draw-plate.mjs --cal` from the dates in the brief |
| `30.44` days | the calendar caption | the mean month, used to place the three lead times quoted in weeks. Stated on the page rather than hidden |
| `1.5px` | the tally strokes and the plate baseline | 1px disappears against the buff ground and 2px reads as a border |
| `280px` | the tally rule | 28 strokes at a 10px pitch. The width is the count |
