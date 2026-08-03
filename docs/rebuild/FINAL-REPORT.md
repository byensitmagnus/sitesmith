---
title: Final report
state: S15_PACKAGE_AND_DOCUMENT
status: complete for this pass
branch: rebuild/sitesmith-unified
ai_generated: "(C)"
---

# Final report

## What was asked, and what was built

Rebuild SiteSmith as one skill that reverse-engineers the best mechanisms from the
strongest upstream repositories rather than chaining to them, builds complete websites,
and proves quality in a browser.

What exists now, on `rebuild/sitesmith-unified`, 39 commits, nothing pushed:

| | v2.3 | v3 |
| --- | ---: | ---: |
| Files in the shipped package | 139 | 17 |
| Scripts | 20 | 4 |
| Always-loaded instruction | 6,546 est tok | 3,085 |
| Worst realistic run | 11,934 | 7,109 |
| Stack adapters | 1 (CSV) | 5 |
| Gates that can fail | 1 | 9 |
| Installable | no | `node tools/install-sitesmith.mjs` |

## The research, and what it cost

19 sources resolved with commit and licence, every resolution independently re-derived by
an agent instructed to refute it. 243 mechanisms extracted across four waves, 190 adopted
or adapted, **every one accounted for**: 136 scheduled into a named file, 14 dropped with
a written reason, the rest already present or reference-only. `tools/placement-coverage.mjs`
fails the run if any is unaccounted.

16 multi-agent workflows. Roughly 12 million subagent tokens. **Zero third-party API
spend**, because no key is present and the host model is the creative engine.

## The five findings that changed the product

1. **The winner was 55 lines.** `frontend-design` is one markdown file, ~2,078 est tokens,
   no scripts and no data, and it beat v2.3's 630,000-token package 59 to 40 on an
   identical brief. More instruction did not buy better design.
2. **A blind A/B said our re-expression carries.** 135 against 134, judges 2 to 1. That is
   a tie, not a win, and it is reported as a tie.
3. **The house style has a mechanical cause.** `v2/modes/README.md` obliged every mode
   file to answer twelve fixed topics and four of them were appearance slots by
   construction. A file required to answer "Radius" answers it.
4. **The tell moves onto the fix.** Three portfolio tests, three failures, and each fix
   relocated the convergence. Round two's ground arc across three unrelated trades was
   4.1 degrees *after* four fixes, tighter than round one's 18. Every build reads the same
   instruction surface, so every build converges on how it answers that surface.
5. **taste-skill had already named our house style by hex.** Its premium-consumer palette
   ban lists `#1a1714` where round two produced `#1b1a17`, and brass and oxblood accents
   where round two produced `#8f5a14` and `#b3243b`. That mechanism was marked adapt and
   never carried, because conflict C1 resolved that naming beats banning. C1 was right
   about abstract looks and wrong at hex level.

## What is unfinished, stated plainly

- **A9 has not passed.** Three rounds, three fails. The defences are now checks in code
  rather than instruction, and the one build the ledger refused in round three produced
  every widening in that round, but no fourth round has been run.
- **The creative method is borrowed.** The original contribution here is verification and
  anti-repeat machinery, not taste.
- **144 of 243 mechanisms are `unchallenged`.** Waves three and four had no red team.
- **No site has shipped to a customer.** n is 2 or 3 everywhere.
- **The judge validation gate is designed and not built.** `ponytail`'s own measurement
  says a judge should rank a known-templated reference below a known-distinctive one
  before its verdict is trusted. Every judge verdict here should carry that discount.
- **The old `skills/sitesmith/` tree is untouched.** Migration, provenance regeneration
  and CI rewiring are the remaining 20 to 30 hours, and none of it is needed to *use* the
  skill, only to publish it.

## Six defects the adversarial passes found that the test suites did not

Recorded because the ratio is the point: attacking artefacts found more than testing them.

1. `gate.mjs` scoped eight honesty checks to `.html` only, so a Next.js source tree with
   nine declared defects printed "every check ran and none refused".
2. `gate.mjs --url` rendered any page in the world while attributing the verdict to the
   build directory.
3. `floor-lint.mjs` passed `v2/modes/product-ui.md` verbatim at exit 0, a file that says
   "One accent for the primary action".
4. Fourteen literal backspace characters sat inside regexes in `gate.mjs`, so two checks
   were silently dead while reporting cleanly.
5. `portfolio-diversity.mjs` read `document.body.backgroundColor`, so a site grounding on
   `<html>` measured as dark and the tool graded a fiction.
6. One autopsy skipped 919 lines holding the entire craft floor, and nothing caught it
   until a downstream file ended up with zero placements scheduled into it.

## What would change the picture

A fourth portfolio round against the colour and signature vetoes, which are now live and
were not when any of the three rounds ran. If the arcs stay wide, the structural approach
works and the remaining question is packaging. If they close again in a fourth place, the
honest conclusion is that a single skill produces a family resemblance no check can
remove, and the criterion should be restated rather than the skill rebuilt again.

Full trail, including everything that failed, in `docs/rebuild/`. The three portfolio
rounds are in `s11/`, `s12/` and `s13/`.
