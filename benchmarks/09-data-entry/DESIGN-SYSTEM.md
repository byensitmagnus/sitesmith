# Kestrel WMS — design system

The contract for `benchmarks/09-data-entry/`. Format:
[`v2/30-contract.md`](../../skills/sitesmith/v2/30-contract.md).
Checked with:

```bash
node skills/sitesmith/scripts/token-drift.mjs benchmarks/09-data-entry/index.html \
  --contract benchmarks/09-data-entry/DESIGN-SYSTEM.md
```

**Direction.** A goods-in console for a warehouse team who type all day and rarely touch
the mouse. Dense, high-contrast, hi-vis on black where the bay's own signage already is.
Nothing decorative competes with a digit.

---

## 1. Tokens

```css contract
:root{
  /* spacing — 4px step, because a 30px row cannot afford an 8px ramp */
  --step:4px;
  --space-1:2px; --space-2:4px; --space-3:6px; --space-4:8px;
  --space-5:12px; --space-6:16px; --space-7:24px; --space-8:32px; --space-9:48px;

  /* type — 13px base, ratio 1.2, rounded to 0.0625rem. Dense product UI. */
  --text-micro:0.65rem; --text-small:0.72rem; --text-body:0.82rem;
  --text-lead:0.9rem; --text-h3:1rem; --text-h2:1.12rem;
  --text-h1:1.35rem; --text-display:1.62rem;
  --leading-tight:1.2; --leading-body:1.45;
  --measure:64ch;

  /* shape — controls sit inside panels, so inner is tighter than outer */
  --radius-inner:3px; --radius-outer:6px; --radius-full:999px;

  /* elevation — an app shell has no floating surfaces; the bar is a border, not a shadow */
  --elev-0:none;
  --elev-1:0 1px 0 rgb(0 0 0 / .06);
  --elev-2:0 8px 24px rgb(0 0 0 / .18);   /* reserved: no component uses it yet */

  /* container — full-bleed shell, the queue rail is a fixed track */
  --container:100%; --rail:322px; --gutter:12px; --grid-columns:1;

  /* colour */
  --bg:#f1f1ee; --surface:#ffffff; --surface-2:#f7f7f5;
  --line:#d6d5d0; --line-2:#bfbdb6;
  --ink:#16171a; --ink-2:#525760; --ink-3:#646973;
  --accent:#6d4a00; --on-accent:#ffffff;
  --accent-soft:#fdf3d6;
  /* the bay's hi-vis, for fills only — never for a letter on paper */
  --accent-signal:#f2b705; --on-signal:#16171a;
  --ok:#1c6238; --ok-soft:#e4f2e9;
  --bad:#a4231c; --bad-soft:#fbe9e7;
  --warn:#6d4a00;
  --chrome:#16171a; --chrome-2:#26282c; --chrome-line:#33363b;
  --chrome-ink:#e8e8e6; --chrome-ink-2:#9b9ea4;

  /* families */
  --font-display:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
  --font-body:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
  --font-mono:ui-monospace,'Cascadia Mono','SF Mono','Segoe UI Mono','Roboto Mono',monospace;

  /* motion — a data-entry screen should not animate while someone is counting */
  --motion-fast:80ms; --motion-base:120ms; --motion-slow:200ms;
  --ease:cubic-bezier(.2,.6,.2,1);
}
@media (prefers-color-scheme:dark){
  :root{
    --bg:#111214; --surface:#1a1c1f; --surface-2:#212429;
    --line:#2c3036; --line-2:#3d424a;
    --ink:#e9eaec; --ink-2:#a8adb5; --ink-3:#979ca4;
    --accent:#f2b705; --on-accent:#16171a; --accent-soft:#2e2408;
    --ok:#63c68e; --ok-soft:#0f2a1c;
    --bad:#ff8b81; --bad-soft:#2e1614;
    --warn:#f2b705;
    --chrome:#0b0c0d; --chrome-2:#1c1e22; --chrome-line:#2c3036;
  }
}
```

**On `--accent` and `--accent-signal`.** Hi-vis yellow is the bay's own colour and it is
correct on the black chrome bar, where it reads at 11:1. As *text on paper* it reads at
1.9:1, so the light scheme uses the darkened `--accent:#6d4a00` for anything with a letter
in it and keeps `--accent-signal` for fills on the dark bar only. In dark mode the two
converge and `--on-accent` flips to near-black.

## 2. Components

**Buttons.** `.b` uses `--surface`, `--line-2`, `--text-small`, `--radius-inner`,
`--space-3` / `--space-5` padding.

| State | Treatment |
| --- | --- |
| rest | `--surface` on `--line-2`, ink `--ink` |
| hover | border to `--ink-3`, no fill change |
| focus-visible | 2px `--accent` outline, 1px offset — same as every other control |
| active | `translateY(1px)`, no colour change |
| disabled | opacity .45, no transform, `not-allowed` |
| loading | not used; every action here is instant or a page navigation |

Primary (`.b--p`) swaps fill to `--chrome` with `--chrome-ink`. There is no destructive
variant: nothing on this screen deletes anything.

**Form controls.** Inline cell editors only. Border `1.5px --accent`, radius
`--radius-inner`, mono figures, right-aligned for numbers. The label is visually hidden and
names both the field and its row (`Counted quantity for PM-1153`) because the column header
alone is not a name. Errors are a row-level message under the row, not a per-field message,
because the failing rule is about the row.

**Header and footer.** The chrome bar is 46px, sticky, always dark, and carries app, bay,
shift and identity. The keyboard legend is fixed to the bottom, always visible, and drops to
three items below 820px. Neither collapses into a menu: both are status, not navigation.

**Elevation and layering.** `--elev-0` everywhere. The bar and the legend separate by border
and colour, not shadow. z-order: legend 15, bar 20, queue header 10.

**Density.** `--space-2` to `--space-5` only. `--space-7` and above are declared for the
empty and error states, which need air the grid does not.

## 3. Voice

**Image treatment.** None. The only graphic is the brand mark, three stacked pallet faces,
and it is the only authored SVG on the page.

**Copy register.** Sentence case. Second person, present tense. Times are 24-hour, `07:12`.
Quantities are bare integers; variances carry a sign. The user is "you"; the person who
signed in is named. SKUs and references are mono and never wrapped.

Examples: heading *"DN-40219 · Tavistock Paper Mills"* · button *"Book in (2 lines
unresolved)"* · error *"A shortage over 2 units needs a reason code before this consignment
can be booked in."*

**Iconography.** No icon set. Status is a coloured dot with a text label beside it, because
the room is lit badly and the screen is read at arm's length.

**Motion.** Button press only, `--motion-fast`. Nothing animates on scroll. Nothing fades.

## 4. Page inventory

| Page | Purpose | Primary action | Blocks |
| --- | --- | --- | --- |
| `/` | Book one consignment in against its delivery note | Book in | chrome-bar, queue-rail, line-grid, totals-strip, key-legend |

One page today. The rail, the grid and the legend are the blocks a second page would reuse.
