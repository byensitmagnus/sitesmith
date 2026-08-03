# PRODUCTION-REPORT — Klinke & Datter

> One page, `index.html`, self-contained, no external JS. Served from a local static server at
> `http://localhost:5199/index.html` for every check below. `(C)` — AI-generated working
> document.

## Verdict

**Technically green, and not signed off.** Every mechanical gate passes. The visual gate ran
with one reviewer instead of two blinded ones, so its pass condition is not met and is not
claimed. See `CRITIQUE.md`.

## The mechanical gates, as run

| Gate | Command | Result |
| --- | --- | --- |
| Widths, axe both schemes, links, console | `verify.mjs <url> --out .sitesmith/shots` | **PASS** — 375/768/1440 all HTTP 200, structure ok, 0 console errors, 0 failed requests, 0 broken links, **0 axe violations** |
| Wider font | `verify.mjs <url> --font-stress --no-axe` | **PASS** — no overflow at any of the three widths. axe explicitly waived here and run unwaived above |
| Direction fidelity | `direction-fidelity.mjs DIRECTION.md <url>` | **PASS** — ground `rgb(242,233,216)` lum 0.821 against a declared buff ground; display face Fraunces against a declared serif; assets 8.06 % of the first screen against a declared diagram-led minimum of 4 %; 1 distinct ground against a declared continuous field; 0 uppercase mono labels against declared sentence-case labels; 6 shadowed elements against declared inset depth; signature `.roll-rail` at 8.06 % against a declared 6 % |
| Token drift | `token-drift.mjs "index.html" --contract DESIGN-SYSTEM.md` | **PASS** — 0 undeclared values |
| Journeys | `journey.mjs journeys/ --base http://localhost:5199` | **PASS** — 3 of 3 |
| Asset plan against manifest and direction | `asset-plan.mjs check ASSET-PLAN.md --manifest … --direction …` | **PASS** — 4 assets, each carrying something |
| Production gate | `production-gate.mjs "index.html" --manifest … --production` | **production-ready** — 4 manifest rows all `ready`, 2 drawn assets, 3 journeys, no placeholder language, a real mark, a real favicon |
| Shared direction history | `direction-history.mjs commit DIRECTION.md <url> --project klinke-datter` | **PASS — checked and recorded.** Fingerprint `light\|sans\|supporting\|table+split3\|hairline-separators+rounded-card-grid+tabular-figure-motif`; ledger had 0 prior entries, so this is the first record and the anti-repeat rule proved nothing yet |
| Three comps are three directions | `direction-check.mjs directions/` | **PASS** — pairwise 5 of 5 macro axes and 4 of 4 grammar fields between every pair |

One reported note, not a failure: **the surface grammar is not mechanically classifiable.**
"Punched paper edges and cut grounds" is not one of the four treatments the gate knows how to
measure, so it reports it for review instead of guessing. That is the documented behaviour for
an open vocabulary, and the choice is deliberate: the alternative phrasings the gate *can*
measure would have committed the page either to a ruled grid or to alternating bands, and the
direction wanted neither.

## The fourteen things

| # | Item | State |
| --- | --- | --- |
| 1 | Business goal and primary action | **Done.** `BRIEF.md` §1. One action — ring 66 12 47 09 — and it is the only filled element on the page. |
| 2 | Audience and brand direction | **Done.** `BRIEF.md` §2 with the three justified dials (4 / 2 / 7), carried unchanged into `DIRECTION.md`. The question "what would the page lose if the accent were a different hue" is answered there. |
| 3 | Sitemap and hierarchy | **Done, and small.** One page, five in-page destinations, nothing two clicks away. `BRIEF.md` §3 names the three things that matter most and in what order. |
| 4 | Content and asset plan | **Done.** Every number on the page traces to a line in the sealed brief; the list is in `BRIEF.md` §4. `ASSET-PLAN.md` states what each drawing carries before any of it was drawn. |
| 5 | Page inventory | **Done.** `DESIGN-SYSTEM.md` §4, and it matches what is built. |
| 6 | Project definition of done | **Done.** `BRIEF.md` §6. |
| 7 | Design-system contract | **Done.** `DESIGN-SYSTEM.md`, written from the winning comp, not from an example. The token block in the page is the block in the contract. |
| 8 | Type, spacing, grid, colour, radius, elevation | **Done.** One 8px step and a nine-value ramp; seven type roles from a 17px base at 1.25; a two-value radius plus `full` where the shape is the meaning; an elevation group that declares `--elev-1: none` with the reason rather than omitting itself. |
| 9 | Header and footer contract | **Done.** `DESIGN-SYSTEM.md` §2. One page, so cross-page drift is untested — stated, not hidden. |
| 10 | Component inventory | **Done**, and short: masthead, roll rail, hero, scope list, plate, disclosure, price table, facts list, two button variants, footer. Each defined once. |
| 11 | Buttons, forms, every state | **Partial, deliberately.** Four of the six control states exist for the primary action; disabled and loading do not exist and are not drawn, because a phone number is never unavailable and a `tel:` hand-off has no pending phase. There are no forms, so there are no field errors — the brief supplies no address to submit to, and inventing one would have been inventing a fact. Both absences are argued in `DESIGN-SYSTEM.md` and `INTERACTIONS.md`. |
| 12 | Responsive behaviour | **Done.** Stated per width in `DESIGN-SYSTEM.md`, rendered and read at 375, 768 and 1440 in both schemes, and again at a wider font. The rail turns from a full-height column into a top strip below 1000px; the numerals stop hanging into the margin at the same breakpoint; the drawing and the disclosures stack below 900px. |
| 13 | A visual signature | **Done.** The punched roll band, `.roll-rail`, present at every width, measured at 8.06 % of the first screen. |
| 14 | Cross-page consistency | **Not testable.** One page. The contract exists so that page two would be cheap; nothing proves it yet. |

## Failures and deviations, all of them

1. **The visual critique gate did not run as specified.** One reviewer, not two; not blinded;
   no sealed key. Its pass condition is unmet and unclaimed. This is the largest gap in the run.
2. **`40-interaction.md` asks marketing mode for "the enquiry submitted, validated, confirmed"
   and for a mobile navigation that opens, closes and traps focus. Neither journey exists.**
   There is no enquiry form and no mobile menu on this page. The nav is five always-visible
   links at every width, which is a deviation from mode M §9's "a real disclosure" on a phone —
   taken because five short labels wrap onto two rows at 375 and are then reachable without any
   disclosure at all, which serves the same outcome better than a hamburger over five items.
   Recorded rather than papered over.
3. **`--step`, `--text-h1`, `--elev-1` and `--grid-columns` are declared and unused.**
   `token-drift.mjs` reports them, and the reason each is kept is written into
   `DESIGN-SYSTEM.md` §5. None is a failure; all four are a prompt to delete that was answered
   with a reason instead.
4. **Item 14 and reading 3 of the done check are untestable at one page.** Stated above.
5. **The drawing is the weakest thing on the page.** `CRITIQUE.md` names it as the primary
   criticism and gives the next action.
6. **The dark scheme changes the brand's temperature.** `#9e2a2b` cannot clear AA on
   `#191710`, so the dark accent is `#e2836a`. Accessibility outranks aesthetics — that is
   precedence rule 1 — but the page is warmer and less severe in dark than in light, and a
   client should be shown both before signing anything off.

## What is deliberately absent

No testimonials, no customer names, no review scores, no counts of instruments restored — the
brief forbids all four. No logo wall, because the brief names no client, partner or
certification, and a stand-in customer logo is a fabricated endorsement. No photograph, because
none exists and none could be produced; the direction was chosen to be honest about that rather
than to hide it behind a labelled slot. No restoration price, because they will not quote before
the assessment, and the page says so where the number would otherwise be.
