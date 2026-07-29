# ASSET-MANIFEST — The Cleeve Seed Library

Every non-text thing the site needs. All six are **drawn for this project**: `EVIDENCE.md` §7
records that no photograph, logo or diagram exists for this subject, none can be taken, and
there is no image-generation budget. One treatment throughout, stated once in
`DESIGN-SYSTEM.md` §3 and repeated in the last column: **ink line on paper, no colour, square
frame, drawn at a 100-unit square and scaled, `currentColor` so it inverts with the scheme.**

| id | what | where | source | licence | state | focal | treatment |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `seed-portraits` | Nine seed drawings — runner bean, pea, tomato, lettuce, French bean, kale, squash, beetroot, carrot. Five drawn solid (come back true), four as a broken outline (do not). Shapes from the botany of each crop; no colour, because no seed colour is verified | key across the first screen at 115px; head of each index row at 44px; each slip line at 16px | drawn for this project, inline SVG, 100×100 viewBox each | owned | **ready** | 50% 50% | ink line on paper, `currentColor`, solid fill or 7/5 broken outline — the two states are the site's signature |
| `pollen-key` | Two-panel drawing of the two pollination mechanisms: pollen that stays inside its own flower, and pollen arriving from off the frame a mile away | above the index, spanning both difficulty groups | drawn for this project, inline SVG | owned | **ready** | 50% 55% | as above; the arriving arrow is the only broken line, matching the four broken seeds |
| `borrow-year` | The borrowing year drawn left to right — spring, summer, autumn — with the return curving back beneath the line to the drawer it started in | head of "What you are promising" | drawn for this project, inline SVG | owned | **ready** | 50% 50% | as above, plus the one stamp red on the return arc only |
| `returns-2025` | 412 marks on a 28-wide grid; the 96 members who returned seed in autumn 2025 filled and grouped top-left | head of "Ninety-six of four hundred and twelve" | drawn for this project, inline SVG, counts from `EVIDENCE.md` §5 | owned | **ready** | 20% 20% | as above; filled marks in the stamp red, empty marks hairline ink |
| `mark-czar` | The site's mark: a runner bean 'Czar' seed drawn solid with its hilum, sitting on the same hairline every seed portrait sits on, beside the wordmark set in the display serif | masthead, footer | drawn for this project, inline SVG, 44×32 viewBox | owned | **ready** | 50% 50% | as above at 34px; the hilum is cut in the paper colour so it reads as a scar, not a stripe |
| `favicon` | The mark at 32px — bean, hilum and shelf rule, fuzz and wordmark dropped | browser tab | `site/favicon.svg`, derived from `mark-czar` | owned | **ready** | 50% 45% | ink on paper, fixed colours (a tab has no colour scheme to follow) |

## Not in this manifest, on purpose

- **Marks for Bishop's Cleeve Allotment Society and Woodmancote Growers Association.** Both
  agreed in writing, in March 2026, to be **named**. Neither supplied a logo file and neither
  was asked for one (`EVIDENCE.md` §5, §7). A drawn stand-in would be a fabricated
  endorsement, and there is no `substitute` state for someone else's mark. They appear on the
  page in type, with the date of their letters and a line saying no mark was requested.
- **Any photograph.** None exists of this library, this branch, these volunteers or these
  drawers. See `ASSET-PLAN.md`, "What deliberately has no asset".
- **Icons.** There is no icon set. The only authored SVG on this site is the six rows above,
  and every one of them carries information.

## Cropping, for whoever maintains this

Each drawing is authored in a square (or, for `borrow-year` and `returns-2025`, a fixed
landscape box) and is **never cropped** — it is scaled. That is the whole reason the pictures
are drawings: at 16px on a slip line and at 115px in the key, a photograph would need two
different crops and would lose its subject in one of them, whereas a 100-unit square scales to
both and keeps the hilum. The `focal` column is filled for completeness and, apart from
`returns-2025`, nothing here has a focal point that a crop could remove.

`returns-2025` is the one asset where a crop would lie: its filled block sits top-left, so any
crop from the top or the left changes the proportion the drawing exists to show. It is
rendered whole at every width, and at 375 the grid narrows by shrinking the marks, never by
dropping rows.
