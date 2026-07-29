# PRODUCTION-REPORT.md — Falkner & Vane

The honest record, failures included.

## The fourteen

| # | Item | State |
| --- | --- | --- |
| 1 | Business goal and primary action | Falkner & Vane sells hides to the trade and cannot publish a price, so the site's job is to get a specified enquiry rather than an order. One primary action: **Write the enquiry**. It is the heaviest interactive element on the page and it appears twice, in the masthead and at the end of the argument. |
| 2 | Audience and brand direction | A bookbinder choosing between 1.2 mm and 1.4 mm, in a drawn technical register closer to a materials data sheet than to a heritage brand page. Written down in `DIRECTION.md` before a colour was picked. If the accent were a different hue the *today* line on the calendar would stop being the same thing as the enquiry button, and the page would lose its only signal for "now". |
| 3 | Sitemap and hierarchy | One page. Order: the plate, the specification, the pits, buying, the enquiry. The three that matter most, in order: the plate, the calendar, the enquiry. |
| 4 | Content and asset plan | `ASSET-PLAN.md`, written before anything was drawn, then `ASSET-MANIFEST.md`. Every figure on the page traces to `BRIEF.md` via `EVIDENCE.md`. Nothing on the page is a placeholder. |
| 5 | Page inventory | `site/DESIGN-SYSTEM.md` §4. |
| 6 | Done for this project | All five named gates green, at 375 / 768 / 1440, in both colour schemes, with no price, no named customer, no certification and no environmental claim anywhere. |
| 7 | Design-system contract | `site/DESIGN-SYSTEM.md`, derived from comp A. |
| 8 | Tokens | One 8px step, a 17px base at 1.25, zero radius as a system, elevation explicitly none, one accent with `--on-accent` flipping per scheme. `token-drift` reports **0 undeclared values**. |
| 9 | Header and footer | Contracted in §2 of the contract. Same mark, same tally, both ends. |
| 10 | Component inventory | Contract §2 and §4. |
| 11 | States | `INTERACTIONS.md`. Five of the six control states are drawn and reachable; **loading is deliberately not drawn**, because nothing here is asynchronous and a styled state with no way in is a picture of a state. |
| 12 | Responsive | Stated per width in the contract, rendered and looked at, at all three, and again under `--font-stress`. |
| 13 | Visual signature | The plate: six hides drawn edge on, on one baseline, against rules a millimetre apart. Measured at **32.6% of the first screen** against the 20% the direction claims. |
| 14 | Cross-page consistency | One page, so nothing to drift against yet. The contract exists so that the second page cannot. |

## Gate results

| Gate | Verdict |
| --- | --- |
| `asset-plan.mjs check` (with manifest and direction) | PASS, 4 assets, each carrying something |
| `verify.mjs` at 375 / 768 / 1440 | PASS, **0 axe violations** across both colour schemes, 0 console errors, 0 failed requests, 0 broken links, 0 horizontal overflow |
| `verify.mjs --font-stress` | PASS, no overflow under a deliberately wider font |
| `direction-fidelity.mjs` | PASS, all five axes delivered in the default colour scheme |
| `journey.mjs` | PASS, 2 of 2 |
| `production-gate.mjs --mode M --production` | **production-ready**, nothing found |
| `token-drift.mjs` (not required, run anyway) | PASS, 0 undeclared values |
| `tools/conformance.mjs` (the repository's own ratchet, run anyway) | PASS, 0 new violations |

## What could not be done

1. **No contact detail appears on the page, because none was supplied.** The brief gives Walsall
   and the Thursday appointment and nothing else. A telephone number, an email address or a
   street would have been an invention, so the enquiry ends in a written note the visitor takes
   to the yard rather than in a send button. This is the single thing a reviewer is most likely
   to call missing, and it is missing on purpose.

2. **The Shropshire coppice is not named.** The brief says it is named; it does not say what the
   name is. The page says "one coppice in Shropshire" and stops.

3. **The goat's eleven months does not reconcile with its pit date, and the page does not
   pretend it does.** Nine to fourteen months from August 2025 closes in October 2026; the
   eleven months quoted from July 2026 lands in June 2027. The calendar draws both facts and
   the caption states the arithmetic. Any explanation of *why* would be invented, so there is
   none. See `EVIDENCE.md` §8.

4. **No photography, and there never will be any on this build.** There is no image budget of
   any kind. Every asset is drawn from a measured value. Two of the four drawings are notations
   rather than measurements (the temper overhang and the grain rhythm) and the page says so, in
   the key, in the words "It is not a measurement" and "A notation, not a picture of a hide".

5. **The blind critique in `v2/50-critique.md` could not be run.** It requires two independent
   reviewers who do not see each other's scores and a sealed key. One builder working alone
   cannot supply that, so what was done instead was the mechanical half: render at all three
   widths in both schemes, open the screenshots, and correct what was wrong. Four things were
   found and fixed that way, and are recorded here because they would otherwise be invisible:
   the plate started 740px down the page and has been raised to 476; the figure column at 375
   was landing below the drawing instead of beside the name, because the grid rows were
   implicit; the calendar caption was set in mono micro and ran to thirteen lines; and the
   drawings' baseline ran straight through the drape, which read as the hide passing through a
   rule rather than hanging over a bench edge.

6. **`DESIGN-SYSTEM.md` sits in `site/`, not at the project root.** The repository's CI runs
   `token-drift.mjs` on `benchmarks/*/DESIGN-SYSTEM.md` against `$(dirname)/index.html`, and
   this build's page is at `site/index.html` because that is what the assignment specifies. A
   contract at the project root would point the check at a file that does not exist and turn
   the repository red. It sits beside the page it governs instead.
