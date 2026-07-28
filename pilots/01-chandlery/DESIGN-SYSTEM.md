# DESIGN-SYSTEM — Trelfall & Son

> Written **from direction A**, not before it. Every value below is either taken from the
> winning comp or derived from something in `EVIDENCE.md`. Where a value is a one-off, it is
> in section 5 with its reason.

## 1. Ground and colour

The ground is the buff of a printed chandler's catalogue, and the ink is the near-black of
tarred hemp — both from evidence section 4. There is one saturated colour, a stamp red, and
it is reserved for the safe-working-load warning, which is the only sentence on the site that
carries a legal consequence.

```css
:root{
  --paper:#f2ece0;        /* catalogue buff */
  --paper-2:#e8e0d0;      /* row hover, panel */
  --paper-3:#dbd1bd;      /* rule under a heading */
  --ink:#1d1913;          /* tarred hemp */
  --ink-2:#544c3e;        /* secondary copy */
  --ink-3:#635a49;        /* labels — darkened from #6d6453, which measured 4.45:1 at 11px on --paper-2 */
  --rule:#c3b8a3;
  --stamp:#8c2b18;        /* the warning, and nothing else */
  --stamp-soft:#f0ddd6;
  --ok:#2f5d34; --ok-soft:#e0ebdd;
  --focus:#1d1913;
}
@media (prefers-color-scheme:dark){
  :root{
    --paper:#161310; --paper-2:#1f1b16; --paper-3:#2b251d;
    --ink:#efe7d6; --ink-2:#bdb2a0; --ink-3:#9d9384;
    --rule:#3a332a; --stamp:#e8836a; --stamp-soft:#33201a;
    --ok:#8dc48f; --focus:#efe7d6;
  }
}
```

## 2. Type

Condensed for the copy, monospaced for every figure. The condensed face is from the printed
catalogue reference; the mono is not decoration — a specification table where the digits do
not line up cannot be scanned down a column, and scanning down the MBL column is the task.

```css
--font-display:'Helvetica Neue Condensed','Arial Narrow',ui-sans-serif,system-ui,sans-serif;
  --font-body:'Helvetica Neue Condensed','Arial Narrow',ui-sans-serif,system-ui,sans-serif;
--font-mono:ui-monospace,'SF Mono','Cascadia Mono','Segoe UI Mono',monospace;

--text-micro:.6875rem;   /* 11px — column labels, mono, .14em tracking, uppercase */
--text-small:.8125rem;   /* 13px — row subtitles */
--text-body:.9375rem;    /* 15px */
--text-lead:1.25rem;     /* 20px — the standing line at the top */
--text-h2:1.375rem;
--text-figure:1.5rem;    /* 24px — the running total */
--leading-tight:1.2; --leading-body:1.45; --measure:34ch;
```

Ratio ≈ 1.2 — many sizes, close together, most of them small, which mode E's density section
calls for and which a specification table forces.

**Every figure is `font-variant-numeric: tabular-nums`.** Not a preference: a price per metre
that shifts under its own digits is a price the buyer re-reads.

## 3. Space

```css
--step:4px;
--space-1:4px; --space-2:8px; --space-3:11px; --space-4:16px;
--space-5:22px; --space-6:30px; --space-7:44px; --space-8:64px;
--container:1180px; --gutter:26px;
```

A 4px step, not 8: the catalogue row is the unit of this site and it is about 64px tall, so an
8px ramp has too few usable stops inside it.

## 4. Edge, elevation, motion

```css
--radius-edge:2px;            /* one value. see below */
--radius-full:999px;     /* status dots only */
--elev-0:none;
--elev-1:0 1px 0 var(--rule);   /* a rule, not a shadow */
--motion-fast:110ms; --motion-base:170ms; --ease:cubic-bezier(.2,.6,.2,1);
```

**2px, effectively square. Elevation is `none` — the whole group, deliberately.** The reference is a printed table; a printed table has no rounded
corners. There is no elevation on this site at all — separation is done with hairlines,
because that is what the reference does and because a shadow on a buff ground goes muddy.

Motion: focus and hover transitions only. Nothing enters, nothing parallaxes. A price
updating is instant, because a delayed price reads as a page that is deciding what to charge.

## 5. Documented one-offs

| Value | Where | Why it is not from the ramp |
| --- | --- | --- |
| `72px` | cross-section drawing in a catalogue row | Below about 64px the difference between a double braid and a kernmantle stops being visible, which would make the signature decorative. Sized to the drawing's legibility, not to the ramp. |
| `2px` solid `--ink` | the rule above the running total | A hairline reads as another row; the total is the end of the ticket and needs a heavier line, exactly as a paper ticket does. |
| `.14em` | tracking on mono column labels | Uppercase mono at 11px sets too tight to scan without it. |

## 6. Header and footer contract

**Header**: mark plus wordmark left; one line of trade context right; a 2px rule under it.
No navigation bar — the catalogue *is* the navigation, and mode E says a category band above
about 200px costs the first row.

**Footer**: three links, the company line, and the standing safety sentence repeated. The
safety sentence appears twice on every page by design: once where the figures are, once at
the end, because it is the one thing a buyer must not miss.

## 7. Components

| Component | States |
| --- | --- |
| Catalogue row | default, hover, focus-within, expanded (cut controls open) |
| Length input | empty, valid, below minimum, above coil remaining, disabled (line out of stock) |
| Add-to-order button | default, hover, focus, disabled with reason |
| Order summary | empty, one line, many lines, updating |
| Line total | unset, calculated |

Six states per control, three per page (empty order, populated order, out-of-stock line), as
`v2/10-core.md` section F requires. Each is reachable — see `INTERACTIONS.md`.

## 8. The contract, in one block

`token-drift.mjs` reads this block and reports any value the pages use that is not declared
here.

```css contract
:root{
  --paper:#f2ece0; --paper-2:#e8e0d0; --paper-3:#dbd1bd;
  --ink:#1d1913; --ink-2:#544c3e; --ink-3:#635a49;
  --rule:#c3b8a3; --stamp:#8c2b18; --stamp-soft:#f0ddd6;
  --ok:#2f5d34; --focus:#1d1913;

  --font-display:'Helvetica Neue Condensed','Arial Narrow',ui-sans-serif,system-ui,sans-serif;
  --font-body:'Helvetica Neue Condensed','Arial Narrow',ui-sans-serif,system-ui,sans-serif;
  --font-mono:ui-monospace,'SF Mono','Cascadia Mono','Segoe UI Mono',monospace;
  --text-micro:.6875rem; --text-small:.8125rem; --text-body:.9375rem;
  --text-name:1rem; --text-lead:1.25rem; --text-h2:1.375rem; --text-figure:1.5rem;
  --leading-body:1.45; --measure:34ch;

  --space-1:4px; --space-2:8px; --space-3:11px; --space-4:16px;
  --space-5:22px; --space-6:30px; --space-7:44px; --space-8:64px;
  --container:1180px; --gutter:26px;

  --radius-edge:2px;
  --elev-0:none;   /* the elevation group: this site has none, deliberately */
  --motion-fast:110ms; --ease:cubic-bezier(.2,.6,.2,1);
}
@media (prefers-color-scheme:dark){
  :root{
    --paper:#161310; --paper-2:#1f1b16; --paper-3:#2b251d;
    --ink:#efe7d6; --ink-2:#bdb2a0; --ink-3:#9d9384;
    --rule:#3a332a; --stamp:#e8836a; --stamp-soft:#33201a;
    --ok:#8dc48f; --focus:#efe7d6;
  }
}
```
