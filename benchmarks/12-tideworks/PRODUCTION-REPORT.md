# PRODUCTION REPORT — Tideworks duty board

One page, mode **P**, product UI. Static HTML and CSS with one inline script; no build step, no
framework, no external request.

---

## The done list, all fourteen

| # | item | where | state |
| --- | --- | --- | --- |
| 1 | business goal and primary action | `BRIEF.md`, `DESIGN-SYSTEM.md` §4 | **done** — one primary action, *Log the passage*; the sheet button is the only secondary control and looks it |
| 2 | audience and brand direction | `EVIDENCE.md`, `DIRECTION.md` | **done** — an expert at 04:40; take the accent off it and the board loses its one signal for "workable now", which is the whole read |
| 3 | sitemap and hierarchy | one page; order stated in `DESIGN-SYSTEM.md` §4 and below | **done** |
| 4 | content and asset plan | `ASSET-PLAN.md`, `ASSET-MANIFEST.md` | **done** — every figure traces to `BRIEF.md` or to the arithmetic in `EVIDENCE.md` §8 |
| 5 | page inventory | `DESIGN-SYSTEM.md` §4 | **done** |
| 6 | project definition of done | this file | **done** |
| 7 | design-system contract | `DESIGN-SYSTEM.md` | **done**, derived from the winning comp `directions/a/` |
| 8 | type, spacing, grid, colour, radius, elevation | `DESIGN-SYSTEM.md` §1 | **done**; elevation is declared `none` with the reason |
| 9 | header and footer contract | `DESIGN-SYSTEM.md` §2 | **done** |
| 10 | component inventory | `DESIGN-SYSTEM.md` §2 | **done** |
| 11 | buttons, forms, every state | `INTERACTIONS.md` | **done**; `loading` is deleted rather than faked, and the reason is written down |
| 12 | responsive behaviour | `DESIGN-SYSTEM.md` §2, and below | **done**, rendered and read at 375, 768, 1440 and under a wider font |
| 13 | a visual signature | the two-part window bar on a shared ruler, cut by the "now" rule — `.tidechart` | **done**, 31.4 % of the first screen against the 14 % it claims |
| 14 | cross-page consistency | one page | n/a, and the contract exists so a second one is cheap |

**Section order** — chrome bar; status line; the tide-window instrument; the lock table; the
waiting queue in priority order; the passage log with its empty state and the form; the board's
conventions. That is mode P's argument shape: where am I, what needs deciding, the work surface,
what it reconciles to, how to act on it.

## Gates

Server: `node serve.mjs 4703 12-tideworks/site` from `benchmarks/`.

| gate | result |
| --- | --- |
| `asset-plan.mjs check ASSET-PLAN.md --manifest --direction` | **PASS** — 3 assets, each carrying something. One note, answered in the plan's last section |
| `verify.mjs http://127.0.0.1:4703/` | **PASS** — 375/768/1440 all HTTP 200, no overflow, structure ok, 0 console errors, 0 failed requests, 0 broken links, **0 axe violations (0 serious)** |
| `verify.mjs http://127.0.0.1:4703/?sheet=day` | **PASS** — **0 axe violations**. Run separately because the sheet is a control, not a media query, so the default scan cannot reach the day palette |
| `verify.mjs … --font-stress --no-axe` | **PASS** — no overflow at any width under DejaVu Sans |
| `direction-fidelity.mjs DIRECTION.md http://127.0.0.1:4703/` | **PASS** — ground `rgb(11,15,18)` at luminance 0.005 against a declared near-black; display face measured mono; assets 0 % of the first screen against a declared `imageless` ceiling of 2 %; 2 distinct grounds against a continuous-field ceiling of 2; signature `.tidechart` at 31.35 % against the 14 % declared |
| `journey.mjs journeys/ --base …` | **PASS** — 2 of 2 |
| `production-gate.mjs "site/**/*.html" --manifest ASSET-MANIFEST.md --mode P --production` | **PASS** — production-ready; 1 page, 3 manifest rows, 0 `<img>`, 2 journeys |
| `token-drift.mjs "site/board.css" --contract DESIGN-SYSTEM.md` | **PASS** — no value on the page that the contract does not declare or document |

Nothing was weakened, no threshold was changed, and nothing under `skills/` or `tools/` was
touched.

## What changed after looking at the rendered page

Screenshots were taken at 375, 768 and 1440 in both sheets and read. Eight things were wrong and
were fixed:

1. **The status line had ragged leading**, because a 22px figure inside an 18px sentence made
   every other line box taller. Fixed with `--leading-status` on the paragraph and
   `--leading-tight` on the figures, so all lines are 30.6px whatever is in them.
2. **"Salter's Lode" broke across two lines** in the one sentence that has to be read at a
   glance. The lock name is now non-breaking.
3. **The h1 wrapped to two lines** in a 270px column. The status band is now 334px plus the rest,
   and the tide times moved under the title as a sidenote, which also filled a column that had
   been empty.
4. **The lock table's caption scrolled with the table at 375**, so the sentence explaining that
   sill depths are a datum was cut off mid-word — on the one point the board most needs to make
   honestly. The explanation is now a paragraph above the scroll region and the table keeps a
   visually-hidden caption for its accessible name.
5. **The state column was last**, so at 375 the first thing to scroll off was whether the lock is
   open. Columns are now Lock · At 04:40 · Sill at MLW · Windows today, and at 1440 the sill sits
   next to its state instead of 600px away from it.
6. **The scroll had no affordance.** The lock table now carries a scroll shadow that appears only
   when there is somewhere to scroll; the log table, which fits at 375, does not carry one.
7. **The mark was a lock chamber in plan and read as a ladder at 24px** — a shape that would have
   suited any waterway. It is now the board's own instrument in miniature: elapsed line, "now"
   rule, remaining bar.
8. **Two apostrophes and one unit broke across lines.** The script's lock names used typographic
   apostrophes while the markup used straight ones; draughts wrapped as "1.6 / m".

Also: at 768 the queue laid one field per line, so six boats took seven screens. It now pairs the
fields between 720 and 1040.

## What could not be done honestly inside the brief

1. **The board cannot say how much water is over a sill at a given hour.** The brief gives sill
   depths at mean low water and gives **no tide heights at all**. So the board proves what it can
   — a draught under the MLW figure is clear at any state of tide — and for *Marigold* and
   *Halcyon* it states the shortfall and stops: "0.8 m over a 0.4 m sill at MLW — needs 0.4 m of
   water over the sill; sound it, or work her close to high water." Direction C's scale drawing of
   the chamber was cut for exactly this reason: it would have had to be captioned "indicative" on
   a go/no-go decision.
2. **"Closing" is a convention, not a fact.** The brief asks for "which are about to close" and
   supplies no threshold. The board uses under two hours — half its own four-hour look-ahead —
   and says so in the conventions rather than presenting it as something the tide decided.
3. **No date and no keeper's name appear anywhere**, because the brief has neither. The board says
   "today", "tomorrow", "as at 04:40" and "keeper on shift", and the initials field is typed by
   whoever is on.
4. **The log opens empty.** The brief records no passages for this shift, so none were invented;
   the empty state says why and points at the form.
5. **The log form offers only the six boats on the queue.** A keeper also works boats that never
   queued, and this board cannot enter one. That is a real gap, and the field hint does not paper
   over it.
6. **Nothing persists.** There is no server, so the log lives in the page for as long as it is
   open. On a real board this is the first thing that would change, and it is why the *loading*
   control state is documented as unreachable rather than drawn.
7. **The colour-scheme trade-off is resolved with a control, not a media query.** A browser that
   has been told nothing reports `prefers-color-scheme: light`, so a board driven by that query
   opens paper-white in a hut at 04:40 — the one condition the brief fixes. The sheet is therefore
   a button in the chrome bar: night by default, day one click away, remembered on that machine.
   Both sheets are fully designed and both are axe-checked. The cost is that a keeper whose
   machine prefers light still gets the night sheet on the first load of a new machine, and has to
   press one button.

## One deviation from the runbook

The gate list supplied with the brief serves the benchmark directory: `node serve.mjs 4703
12-tideworks`. The deliverable is `site/index.html`, so `/` under that root is a 404 and the
server was started as `node serve.mjs 4703 12-tideworks/site` instead. Every other command is
exactly as given, and every URL in them is unchanged.
