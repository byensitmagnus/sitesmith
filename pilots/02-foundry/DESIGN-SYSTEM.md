# DESIGN-SYSTEM — Marrow & Kell

> Written **from direction A**. The ground, the display face and the column come from the
> winning comp; the light scheme is a translation of that design and not a second one.

## 1. Ground and colour

Bell metal against near-black, which evidence section 4 records as the truest pairing in this
world — a bell in a tower with one window. There is no second accent. Where a page needs to
say something is wrong, it uses a red that is nowhere else on the site.

**The light scheme is limewash**, from the ringing-chamber wall, not a warm cream. That
distinction is load-bearing: a warm cream ground with dark ink is a different design, and a
site whose identity survives only in one colour scheme has an identity in one colour scheme.

## 2. Type

Wide capitals for display, a system sans for reading, mono for every figure.

The display face is set in capitals with positive tracking because the reference is cast
inscription lettering, which is heavy and open — it is cut to be read from a ringing chamber
floor thirty feet down in bad light. A thin high-contrast serif would be the anti-reference
exactly, and would also be the first thing anyone reaches for on a dark ground.

Ratio ≈ 1.33 at the top of the scale and much tighter below it: one display size, one heading
size, and three small sizes that do most of the work.

## 3. Space and rhythm

An 8px-based ramp with a large top end — `--space-7` and `--space-8` — because the page is one
column of continuous reading beside a fixed drawing, and the only thing separating sections is
space. There are no bands and no cards on this site.

## 4. Edge, elevation, motion

`--radius-edge: 0`. Every corner on the site is square. A bell is cast, turned and cut; the
one radius in this subject's world is the profile itself, and putting an 8px corner on a form
field next to that drawing is two ideas about edges on one page.

`--elev-0: none` — the whole elevation group, deliberately. Separation is a hairline.

Motion: opacity on hover, and nothing else. Nothing enters, nothing moves on scroll. The
drawing is sticky, which is position rather than motion.

## 5. Documented one-offs

| Value | Where | Why |
| --- | --- | --- |
| `100vh` | the standing column | It is a standing column: it holds the drawing at eye height for the whole page. Not a spacing value. |
| `min(58vh, 460px)` → removed | — | An explicit height letterboxed the SVG box and left a gap above the caption. The drawing now takes the column width and its own aspect ratio. Recorded because it is the kind of thing that looks like a spacing bug and is not. |
| `.26em` | the wordmark | Mono capitals at 13px set too tight to read as a mark without it. |

## 6. Header and footer contract

**Header** sits inside the reading column, not above the whole page, because the drawing owns
the left edge from the top of the document. Wordmark, three destinations, one rule under it.

**Footer** is one paragraph: who this is and the standing declaration that the figures are
invented. On a site whose whole argument is "we publish the figures", saying which figures are
real is not a disclaimer, it is the same argument.

## 7. Components and states

| Component | States |
| --- | --- |
| Mobile nav disclosure | closed, open, focus inside, closed by Escape |
| Text and number fields | empty, valid, invalid with a named limit |
| Select | unchosen, chosen, invalid |
| Error summary | hidden, shown with one or more entries, each linking to its field |
| Send button | default, hover, focus, disabled after a successful send |
| Confirmation | hidden, shown, announced |

## 8. The contract, in one block

```css contract
:root{
  --ground:#1a1512; --ground-2:#221c17; --ground-3:#2b241d;
  --metal:#c9ab6d; --metal-dim:#8d7748;
  --ink:#ece5d6; --ink-2:#a99e88; --ink-3:#8b8170;
  --rule:#332e27; --rule-2:#463f35;
  --bad:#e08b73; --bad-soft:#2e1a15; --ok:#9bc48a; --focus:#c9ab6d;

  --font-display:'Optima','Palatino Linotype','Iowan Old Style',Georgia,serif;
  --font-body:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
  --font-mono:ui-monospace,'SF Mono','Cascadia Mono','Segoe UI Mono',monospace;
  --text-micro:.6875rem; --text-small:.8125rem; --text-body:1rem; --text-lead:1.0625rem;
  --text-h3:1.125rem; --text-h2:1.5rem; --text-display:clamp(2rem,4.4vw,3.2rem);
  --leading-body:1.62; --measure:54ch;

  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:20px;
  --space-5:32px; --space-6:48px; --space-7:72px; --space-8:112px;
  --container:1220px; --gutter:28px;

  --radius-edge:0px;
  --elev-0:none;
  --motion-fast:120ms; --motion-base:200ms; --ease:cubic-bezier(.2,.6,.2,1);
}
```
