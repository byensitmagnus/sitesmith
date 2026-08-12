# Rendered Product Value Pilot 02 — result

**SiteSmith: LOSS.** Second pilot, second loss, and this one is not close.

Brief `damgaard-estrik`, surface `buy`, Next.js App Router. Product frozen at
`3d19e7cb0d7c9e91653abef6bee6c43b2e1bbc28` and untouched for the duration.

## Quality

One blind judge, sealed candidate order, cost information withheld.

| | S — SiteSmith | P — plain Sonnet |
| --- | --- | --- |
| **verdict** | | **winner, "clear"** |
| design, 1–10 | 5 | 8 |
| does the job the brief describes | yes | yes |
| honest about what the firm may claim | yes | yes |

The judge's own summary of what the loss costs a visitor: on P the second thing on the page is
a card headed "Uden for 75 km fra Lemvig" with the coverage circle under it; on S the same fact
is one sentence inside a price card, and the map that makes it unmistakable is the last section
before the footer, about 8,300 px down a 9,350 px mobile page, after the whole twelve-field
form.

## The external checks, same code against both

| | S | P |
| --- | --- | --- |
| pages | 2 | 4 |
| HTTP failures, broken links, console errors | 0 | 0 |
| horizontal overflow, 375/768/1440 | 0 | 0 |
| content clipped by its own container | 0 | 0 |
| **axe, WCAG 2.1 AA, every page every width** | **6 serious** | **0** |
| brief facts stated | 9 of 9 | 9 of 9 |
| forbidden claims asserted | 0 | 0 |
| the booking journey, 4 goals | 4 PASS | 4 PASS |

Both sites complete the journey the brief exists for. Both are honest. The separation is
design and defects.

## Economics, reported separately and not normalised away

| | S | P | multiple |
| --- | --- | --- | --- |
| output tokens | 1,633,489 | 528,869 | **3.1x** |
| tool calls | 828 | 272 | 3.0x |
| wall clock | 3 h 45 m | 1 h 29 m | 2.5x |

Pilot 01 was 2.2x tokens on a loss. Pilot 02 is 3.1x on a bigger loss. The multiplier went up
and the result went down.

Roughly half of arm S's spend produced nothing: it deleted its own finished build partway
through and rebuilt from the brief. Why is in `EVENTS.md`, and it is a product defect, not bad
luck.

## Four deterministic defects, all provable in code

Every one of these was confirmed by measurement, not inferred from the judge. None needs a
model call to reproduce.

**D-A. The clipping check cannot see SVG text.** The judge's headline visual complaint was
S's signature diagram ending mid-word: "40 % af konstruktionens dybde: kernemåling tages h".
Measured: the `<text>` node extends 16 px past its `<svg>`, which has `overflow: hidden`, so
the last characters are cut. `clipping.mjs` — shipped days ago as the repair for pilot 01's
identical failure — watches HTML elements only and returned 0 clipped elements for this page.
**Pilot 01 was lost to a clipped form control; pilot 02 was lost, in part, to clipped drawing
text, past the check built to stop it.** The drawings SiteSmith's own direction produces are
inline SVG, so this blind spot sits directly on the product's main output.

**D-B. Verification never renders a page the entry does not link to.** S's report says
`verify.mjs` finished at 0 axe violations. The external run found 6 serious violations, all on
`/kvittering`: `dlitem` and `listitem`, from
`<dl class="instrument-readout"><li><dt>…</dt><dd>…</dd></li>` — the exact invalid nesting the
build's own notes claim it fixed. It fixed it on `/` and left it on the receipt. `/` does not
link to `/kvittering`; the receipt is reachable only by completing the booking. **The page a
customer sees immediately after they commit was never rendered by the tool that certified the
site.** This checker only caught it because of the single change made after pilot 01: whatever
page the journey ends on gets the same static checks as everything the crawl found.

**D-C. Two sibling skill trees named for the product cost half an arm's budget.** The builder
read `skills/sitesmith/`, took it for the current pipeline, and on that premise deleted a
complete build in its own workspace — `app/`, `lib/`, `journeys/`, the `.sitesmith` state, the
production report — unrecoverably. `skills/sitesmith/` is the legacy v2 tree, reachable only
through `install --legacy-v2`; the default install pulls `skills/sitesmith-v3` through
`product/pipeline.json`. Two directories, both named for the product, one live and one behind
a flag, is a layout that invites exactly this reading.

**D-D. Nothing measures adjacent text running together.** Measured:
`<a class="wordmark">Damgaard Estrik<small>Udtørring og estrik, Lemvig</small></a>`,
`display: flex`, `gap: normal` — the two texts abut at x=328 with a 0 px gap on the same line,
so the masthead reads "Damgaard EstrikUdtørring og estrik, Lemvig" on every page at every
width. The gate ran six iterations, from 51 refused defects down to 0, and shipped it.

D-A and D-B are the same failure class as pilot 01 and they are the ones to fix first: not a
wrong measurement, an unmeasured surface.

## What this does not say

It does not say plain AI beats SiteSmith. Two briefs, one judge each, one surface family. It
says that on two rendered product tests SiteSmith has not yet bought the visitor anything for
its three-times cost, and that both losses turned on defects the product's own verification
could not see. That is evidence about where the product is weak. It is not proof about which
tool is better.

## Pool

`ordway-farriery` is the only unspent `buy` brief. A third buy pilot exhausts the surface.
