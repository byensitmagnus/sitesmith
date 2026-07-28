# Round 1 — every finding, and what was done with it

> The blind reviews are in [`round-1/`](round-1/), one directory per label, each with both
> locked reviews and the key. `critique-gate.mjs` fails all three. This is the ledger of what
> the two reviewers found, whether it reproduced, and what changed.

## The verdict

| label | subject | median production-readiness | gate |
| --- | --- | --- | --- |
| SHEET-B4 | 02 foundry | 6 | FAIL — under the threshold of 8 |
| SHEET-K7 | 03 cask console | 2 | FAIL — 7 problems, four criteria below the floor of 4 |
| SHEET-R9 | 01 chandlery | 5.5 | FAIL — under the threshold of 8 |

The cask console also tripped the generic-template test, which the gate scans across the whole
review rather than only the headline: reviewer B's specificity note said that with the copy
removed it is a generic dark operations table. That fails regardless of the scores, and reading
only the primary criticism would have let it through.

## Every finding

Each was reproduced before anything was changed. Two did not reproduce and were not acted on.

| # | Raised by | Finding | Reproduced | Action |
| --- | --- | --- | --- | --- |
| K1 | A + B (both primary) | At 390 every cask row prints its data on top of its own drawing; "Book in" overflows its box | **yes** | The revision took the drawings to 128px and the mobile grid still gave them a 44px column. Column is now 96px, drawing 84px, action moved into the data column. |
| K2 | A + B | White DUE TODAY outshouts coral OVERDUE; the only control is the dimmest thing in the row | **yes** | Loudness now follows urgency: overdue solid, due today amber, on trade outlined. Left-edge bars follow. The action gained weight, size and elevation. |
| K3 | A | One amber marks both the selected filter and the ON TRADE state | **yes** | Amber is a status here, so the control stopped borrowing it. A pressed filter is inverted. |
| K4 | A | The DUE BACK column mixes sans ("Today") and mono ("3 d late") | **no** | Measured: all four cells compute to the same `ui-monospace` stack. Not changed. |
| K5 | B | The lower third of the desktop page is an empty six-column table | **yes** | A column head over nothing is a promise unkept. Empty weeks say so in a sentence; the head returns with the first row. |
| B1 | A + B (both primary) | The desktop grid fills its left column once, then leaves it empty for two thirds of a 2,837px page | **no — instrument** | The drawing is `position:sticky` and stays beside the text at every scroll position in a real browser. A full-page screenshot expands the viewport to the document height, so sticky has nowhere to travel and renders pinned at the top with dead ground below. **The page was right and the sheet was wrong.** See below. |
| B2 | A + B | At 390 the drawing takes about three quarters of the first screen; the wordmark lands ~594px down and the H1 is clipped at the fold | **yes** | On a page with no column to stand beside, the drawing cannot also be the masthead. Mobile order is now name and navigation, then the drawing at contained height, then the title — which now ends at 712px of an 844px screen. |
| B3 | A | The "Menu" button is the only sans on the page | **yes** | Set in the display face with the same tracking as every other label. |
| B4 | A | The "Faculty position" select is an unstyled native control | **yes** | `appearance:none` and a drawn mark, so it sits in the same column of dark fields as everything else. |
| R1 | A + B (both primary) | It announces "5 of 61 lines" then offers no filter, sort, search or route to the other 56 | **yes** | Neither obvious repair is honest: a "full stock list" link would point at a page that does not exist, and a diameter picker would need breaking loads and batch numbers for fifty-six lines that were never certified. So the promise went instead of the delivery — the caption now states what is true and whole, and a line under the table says other diameters are cut to order against the coil's own certificate. |
| R2 | A | Figure columns are centre-aligned, so "4 %" sits offset from "14 %" | **no** | Measured: every `td.n` computes `text-align: right` and all five share a right edge at x=897. Not changed. |
| R3 | A + B | At 390 the header strap is clipped — the R of ROPE at the left edge, the last digit of £0.00 at the right | **yes, as something worse** | Not clipping. `.bar` carries both `sheet` and `bar`, and `.bar`'s `padding` shorthand overwrote the horizontal gutter `.sheet` had just set — so the masthead ran to the viewport edge at *every* width while the whole page below it sat in the gutter. Now `padding-block`, and header and table share an edge at 26px and 76px. |
| R4 | A + B | The mobile out-of-stock note wraps one word per line | **yes** | The note is a block inheriting `.sub` inside the narrow half of the row. It now takes its own full-width line under the button. |
| R5 | A | "Your order" is the faintest box on the page with ~800px of empty cream beside it | **yes** | It was a dashed hairline sized to the prose measure while the list that replaces it is 720px, so the panel shrank and then grew. It is now the width it will be, with the ink top rule the summary carries. |
| P1 | A + B | The three share a fingerprint; K7 and R9 are "very nearly one template" — same header strap with a running total, same counted caps section label, same illustrated-left-column ruled table, same written empty state, same disclosure footer sentence | **yes** | Four of the five named devices changed at source: the counted caps label is gone from the chandlery, the two empty states are now different shapes, the disclosure sentence is written three different ways, and the cask's strap stopped being a running total and became a status line that names how many are late. The illustrated-left-column table remains in both — a rope catalogue and a cask board really are both tables, and that is the subject rather than a recipe. |

## The instrument was wrong once, and it cost a real review

B1 is the finding worth keeping. Two independent reviewers, working from the same sheets,
independently made the same primary criticism of the foundry — and both were wrong, because
the sheet showed them something the page does not do.

`preflight-sheets.mjs` rendered a "whole page" panel with `fullPage: true`. Playwright expands
the viewport to the document height for that capture, which means a `position: sticky` element
has no scroll left to travel and renders pinned at the top with empty ground beneath it for the
rest of the page. The foundry's drawing is sticky by design — its `DIRECTION.md` says "text
scrolling beside it" — so the one panel meant to show the rhythm showed the exact opposite of
the rhythm.

The sheet is now a **scroll strip**: the page captured one viewport at a time, in order, which
is what a visitor gets and which cannot make that mistake. Frames carry their scroll position.

Two things follow, and both are worth saying plainly. A blind review is only as good as what
the reviewers are shown, so the harness is part of the evidence and has to be audited like the
rest of it. And a reviewer finding is a hypothesis, not a verdict — of fifteen findings here,
two did not reproduce at all and one reproduced as a defect in the measurement rather than the
thing measured. Acting on all fifteen would have made the foundry worse.
