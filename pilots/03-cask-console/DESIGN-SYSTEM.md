# DESIGN SYSTEM — Stalbridge cask desk

Written from the winning comp, not from a contract that existed first. Every value on the page
is one of these tokens or a one-off recorded at the bottom.

## Scheme

**Single controlled theme.** Core rule D7. The screen is wall mounted in a cellar under a fixed
fluorescent tube; it is not a document being read on somebody's laptop, and a ground that flips
under an operating-system setting is a ground the room did not choose. `color-scheme: light` is
declared so form controls do not invert underneath the design. The page is byte for byte the
same in both schemes, which is why the accessibility audit passes in both.

## Ground and ink

| token | value | what it is | measured |
| --- | --- | --- | --- |
| `--wash` | `#EAE6DD` | whitewashed brick, the page ground | relative luminance 0.793 |
| `--wash-2` | `#E1DCD0` | the standing bar, one step down | |
| `--ink` | `#141310` | the late band, all primary ink | relative luminance 0.0065 |
| `--ink-2` | `#2A261F` | field fill on the band | wash text on it 12.4:1 |
| `--ink-rule` | `#3A362E` | hairline on the band | |
| `--dim-on-ink` | `#CFC9BB` | secondary figures on the band | 11.3:1 on ink |
| `--steel` | `#5E5A51` | secondary figures on the wash | 5.5:1 on wash |
| `--hair` | `#BEB8A8` | hairline on the wash | |
| `--late` | `#B3121F` | the condemned-tag red, on light | 5.6:1 on wash |
| `--late-on-ink` | `#FF6A5C` | the same signal, on the band | 6.6:1 on ink |

Two declared tints of one accent, as mode P section 7 requires: a colour legible on paper is not
legible on black, so both are named and it is said which is which. There is no second accent and
no amber, because evidence section 4 says red is the only colour in this room that already means
something.

**Surfaces.** Two classes carry the whole control set: `.on-ink` and `.on-wash` set
`--sfc-bg / fg / dim / edge / field / rule / late / focus / btn-bg / btn-fg`, and every control
is defined once against those. That is why the same button, field and segment work on a black
band and on whitewash without a second component.

**Measured floor, computed rather than eyeballed** (`contrast.mjs`): smallest control boundary
against what sits behind it 14.9:1, smallest control text 12.1:1, smallest text of any kind
5.0:1. The requirement was 3.0 and 4.5.

## Type

Two families. No operating-system UI face appears anywhere on the page.

| role | family | size | use |
| --- | --- | --- | --- |
| state | condensed, 700, caps | `clamp(46px,5.9vw,78px)` | the block a row is in: Late back, Due today, On trade, This week |
| pub, large | condensed, 700, caps | `clamp(26px,2.5vw,34px)` | a late consignment |
| pub, medium | condensed, 700, caps | `clamp(21px,1.9vw,26px)` | a consignment due today |
| pub, small | condensed, 700, caps | `19px` | a consignment on trade, and the record |
| days late | mono, 700 | `40px` | the one figure that decides urgency |
| button | condensed, 700, caps | `21 / 19 / 17px` | Book in, at three densities |
| body and data | mono | `15px` | everything countable |
| meta | mono | `14 / 13px` | gyle, sizes, dates |
| label | mono, caps, `.12em` | `11px` | field labels and column heads |

- `--cond`: `Bahnschrift Condensed, Arial Narrow, Helvetica Neue Condensed, Liberation Sans
  Narrow, DejaVu Sans Condensed`. Condensed caps are the departure board of evidence
  reference 2, read at distance in few columns.
- `--mono`: `Consolas, Cascadia Mono, SF Mono, DejaVu Sans Mono`. Every figure is monospaced and
  `font-variant-numeric: tabular-nums` is set on `body`, so a column of counts does not shift
  under its own digits. That is the weighbridge ticket of reference 3.
- No web font is loaded. The page makes no external request of any kind.

## Space

One step, `4px`, and a ramp: `4 / 8 / 12 / 16 / 24 / 32 / 48`. Page padding is
`clamp(14px, 2.2vw, 32px)`. Density is which end of the ramp is in play and nothing else.

Row heights follow the work, as mode P section 3 requires: three late consignments and their
controls must fit above the fold on a 900px screen, which sets the large row at roughly 130px,
which sets the 34px pub, which sets the 52px field.

## Edge

Radius `2px` everywhere. At a 46px control a generous radius eats the corner of the content, and
this is an instrument. No shadow anywhere. No card. No coloured left bar on any row: severity is
the block, not a stripe.

Rule weights are the hierarchy: `3px` ink under Due today, `1.5px` steel under On trade and This
week, `1px` `--ink-rule` inside the band, `1px` `--hair` between rows on the wash.

## Controls

| state | treatment |
| --- | --- |
| rest | solid fill inverted from its own surface for the button; 1.5px surface-edge border for fields and segments |
| hover | button `opacity .86`; segment gets a 14% wash of the surface ink. Nothing depends on hover, because gloves |
| focus-visible | `3px solid` in the surface's opposite ink, `2px` offset. One treatment, learned once, on every control |
| active | button `opacity .72` |
| selected | segment fills with the surface ink and takes the surface ground as its text |
| invalid | `2.5px` border in the surface's red, plus a bordered message that names what is missing |
| disabled | not used. Nothing on this screen is disabled without a reason, so nothing is disabled |

Minimum target 44px; the working sizes are 56, 52 and 46px tall. Fields are `type="number"` with
the spinners removed, because a spinner is a 12px target in a glove.

## Motion

`--fast: 90ms`, used on one property: button opacity. Nothing else moves. Nothing animates while
a cellarman is entering a count, which mode P section 6 makes absolute.
`prefers-reduced-motion` zeroes even that.

## One-offs, recorded

- `.chrome::before` opacity `.17` and `grayscale(.55)` on the cellar texture. Tuned by eye
  against the bar's own `#E1DCD0`, which is what the contrast is measured against.
- `.casks svg { opacity: .92 }` so a row of six glyphs does not out-weigh the pub name beside it.
- Record table column widths `11 / 24 / 17 / 11 / 22 / 15 %`, so a five-line ledger fills 1440px
  instead of stranding its figures at the two edges.
- `transform: scale(.86)` on the glyphs below 720px. The ratio between the three sizes is
  preserved, which is the only thing about them that may not change.
