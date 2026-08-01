---
title: Test strategy
state: S10_MECHANISM_TESTS onward
status: describes what was run, not what was planned
ai_generated: "(C)"
---

# Test strategy

Written after the fact, describing what actually ran. Where a planned test was not run,
it says so.

## The rule every test here obeys

**A gate that cannot fail is decoration, and a gate that cannot pass is noise.** Every
suite in this rebuild pins both: at least one fixture that must pass and one that must
keep failing, with the expected exit code fixed in advance and a written reason per case.

The rule exists because this repository already shipped a gate that could not fail. Three
architecture candidates cited `tools/context-budget.mjs` as the check that made acceptance
criterion A3 "measured", and it hard-coded three paths, applied no threshold and always
exited 0.

## Level 1 — mechanism smoke tests

Cheap, isolated, run against fixtures rather than real builds.

| Suite | Cases | What it pins |
| --- | ---: | --- |
| `tools/test-context-budget.mjs` | 5 | A scenario over its ceiling fails. A declared file that does not exist fails even when every number is under its ceiling, because a shrinking manifest is how a budget gate becomes decoration. A scenario with no ceiling fails. The pre-rebuild tree reports and never gates. |
| `tools/floor-lint.mjs --self-test` | 4 | Includes `v2/modes/product-ui.md` verbatim as a must-keep-failing regression. The first version of the lint passed that file at exit 0. |
| `skills/sitesmith-v3/scripts/test-stack.mjs` | 12 | Next.js and Astro outrank React. Two primaries at once refuses. A recognised-but-unsupported framework refuses by name. A malformed manifest withholds rather than letting the directory listing answer. |
| `skills/sitesmith-v3/scripts/test-ledger.mjs` | 33 | Record completeness, the seed recipe tripping on an empty ledger, and the hue veto against A9's real measured grounds of 41, 42 and 38 degrees. |
| `skills/sitesmith-v3/scripts/test-gate.mjs` | 14 | Six refusal classes, the draft downgrade, and that a build claiming release cannot have used `--draft`. |
| `skills/sitesmith-v3/scripts/test-verify.mjs` | 6 | Requires `SITESMITH_DEPS_DIR`; without it the suite exits 2 and withholds, which is correct rather than a failure. |
| `tools/provenance-overlap.mjs --check` | 11 sources | Asymmetric: a licensed source may show overlap, a source with no licence may not. |
| `tools/placement-coverage.mjs` | 190 mechanisms | Every adopted mechanism resolves to a named file, a surviving quote, or a written drop. |
| `tools/rebuild-graph.mjs validate` | 349 nodes | Every edge resolves; no duplicate ids. |
| `tools/check-repo.py` | 18 checks | The pre-existing CI gate, kept green throughout. |

**Not automated, and it matters:** `floor-lint` cannot tell three genuinely unrelated
renditions from three phrasings of one layout. It checks that three were written. A human
or an agent has to read them. That gap is stated in the tool's own header.

## Level 2 — adversarial passes

Every artefact of consequence was attacked by an agent whose brief was to break it, not
improve it. These found more than the suites did.

| Attack | Found |
| --- | --- |
| Red team on 140 mechanism claims | 14 refuted, including a hex code attributed to the wrong file and a "30-row CSV" with 161 rows |
| Red team plus feasibility on 3 architectures | Two candidates got `survives=false` from one reviewer; the winner had 2 fatal flaws and 4 constraint violations, all answered |
| Independent audit of 27 "already present" claims | 19 disputed; on resolution the auditor was upheld 20 times and overruled twice |
| Break-the-gates on the four scripts | Two false passes in `gate.mjs`, both fatal, both fixed and reproduced before and after |
| Coverage audit of every autopsy | One autopsy had skipped 919 lines; two more sources had their main instruction file unread |

## Level 3 — end to end

One brief, sealed before the build, never seen by the skill's authors.

**S10-1, the re-expression transfer test.** Two builders, same sealed brief. Arm P is
`frontend-design/SKILL.md` verbatim; arm Q is our re-expressed creative surface. Three
blind judges with different lenses. Result: P 134, Q 135 of 180, judges 2 to 1 for Q. The
pre-registered response to a material loss was to replace our sections with an Apache-2.0
verbatim include; there was no material loss, so that did not happen.

**The finding that outweighed the score:** arm Q invented three facts and arm P invented
none. Our claims rule enumerated the categories a claim could belong to, and all three
inventions fell outside the list. The rule became a test rather than a list.

**Contamination, checked rather than accepted.** Arm P disclosed seeing one screenshot of
arm Q's page. File mtimes put P's plan six minutes before Q's page existed and P's HTML
three minutes after. So the plan-level comparison is clean and the render-level comparison
is contaminated in P's favour. P lost anyway, but the contamination lands on the one axis
where P won, which weakens that argument rather than dismissing it.

## Level 4 — the portfolio test, A9

The acceptance criterion the whole rebuild exists to satisfy, and the one it has not yet
passed.

Three sealed briefs with nothing in common, one per floor: reconditioned industrial sewing
machines (buy), a district heating operations console (operate), a two-person church organ
workshop (read). Each brief carries a closed fact list, so the claims rule is under test at
the same time as the convergence rule.

| Round | Setup | Verdict |
| --- | --- | --- |
| One | three builders in parallel, blind | **FAIL.** Killed five old moves, grew seven new ones |
| Two | same, after four fixes to the instruction | **FAIL.** Fixes worked on the axes they named; ground arc tightened from 18.0 to 4.1 degrees and all three stated the new anti-role doctrine in almost the same words |
| Three | sequential against one shared ledger, colour veto live | running |

Rounds one and two together establish that instruction is shared, so the response to it
converges, and that rewriting the instruction relocates the tell rather than removing it.
Round three is the first attempt to make a region structurally unavailable instead.

## What was deliberately not tested

- **No new head-to-head across all upstreams.** The charter forbids it and the earlier
  15-arm attempt is frozen as historical evidence.
- **No paid third-party API.** No key is present and none is needed; the host model is the
  creative engine.
- **No judge validation gate.** `ponytail/self-validating-llm-judge` says a judge should
  rank a known-templated reference below a known-distinctive one before its verdict is
  trusted. That gate is designed and not built, and every judge verdict in this document
  should be read with that discount.
- **Statistical claims.** n is 2 or 3 everywhere. Every number here detects a large effect
  and nothing smaller.
