---
title: Architecture candidates and the attacks against them
state: S5_ARCHITECTURE
status: complete
inputs: docs/rebuild/candidates/{minimal,routed,layered}.md, red team + feasibility reviews
decision: docs/rebuild/ARCHITECTURE-DECISION.md
ai_generated: "(C)"
---

# Three candidates, six attacks

Three architects wrote candidates blind to each other. Each was then attacked twice:
once by a red team looking for constraint violations and convergence, once by a
feasibility reviewer with the repository open, costing the build.

This file records all three fairly and every attack against the candidate it hit,
**including the attacks on the candidate that was chosen**. The decision is in
[ARCHITECTURE-DECISION.md](ARCHITECTURE-DECISION.md).

Nothing here is a summary of a summary. Where an attack asserted a fact about the
repository, that fact was re-checked against the code before being recorded, and the
result of that re-check is noted.

---

## Side by side

| | **MINIMAL** | **Routed Modular** | **Standard / Floor / Machine** |
| --- | --- | --- | --- |
| Thesis | One file of taste, four scripts of proof. Delete every file whose job is to describe output | Keep the router, strip it of creative authority: it routes duties, never appearance | Layer by *when* a decision is made and *who* makes it |
| Always-loaded files | 1 | 3 | 1 |
| Claimed always-loaded tokens | 3,172 | 4,352 | 3,352 |
| Fetched markdown | 5 | ~19 (4 routes, 4 adapters, 10 references) + 4 corpora | 8 (4 floors, 4 stacks) |
| Scripts shipped | 4 | 9 | 10 |
| Corpora shipped | 0 | 4 CSVs incl. 745 KB fonts | 1 font-name list |
| Blocks shipped | 0 | 0 | 0 |
| Routing | one two-row table; often opens nothing | four route modules on a fixed 7-heading schema | three verbs — decide / buy / operate — plus a redesign overlay |
| Anti-argmax device | prose: "argue for the second thesis" | prose: five directions, four killed | `pick.mjs`: `sha256(subject+date) mod (n-1) + 1` |
| Novel enforcement | `gate.mjs` token-vocabulary check | `route-lint.mjs` purity gate + `route-swap.mjs` render test | `floor-lint.mjs` three-renditions rule + `vocabulary.mjs` |
| Red team verdict | **survives** | **killed** | **killed** |
| Feasibility verdict | buildable, 80–130 h | buildable, 110–170 h | buildable, 95–170 h |

All three agreed on more than they disagreed on, and the agreement is worth recording
because it is what the evidence actually forced:

- the creative method is prose, produced by the host model, in one always-loaded place
- the 86 KB Python direction engine is deleted, which makes `C-no-mechanical-creativity`
  structural rather than promised
- `verify.mjs` survives essentially unchanged and the control group keeps failing
- the craft floor splits: universal judgement always loaded, surface-specific fetched
- the anti-repeat ledger vetoes and never proposes
- SiteSmith's own measured round-8 recipe is named in the always-loaded file
- `taste-skill`'s three dials and `ui-ux-pro-max`'s design dials are dropped by all three
- portfolio diversity is a set-level measurement, never a per-build gate

---

## MINIMAL — one file of taste, four scripts of proof

**Shape.** Three layers separated by one test: does this file's output constitute a
design decision? Taste prose in one always-loaded `SKILL.md`; answer prose in five
fetched files; executables that cost zero context and can only refuse. Everything else
in v2.3 is deleted — 126 of 139 files, all 12 CSVs, all 20 blocks, all 18 `v2/` files,
16 of 20 scripts, the 86 KB Python engine. No router: one two-row table asks what the
visitor is doing on this surface, and often opens nothing.

**Its own stated weakest point.** Deleting `blocks/` is the riskiest deletion and it
cannot prove it is right; a model authoring an accessible combobox from memory will
sometimes get it wrong, and journeys are author-written so an untested behaviour is
invisible to the gate meant to catch it. Close behind: the anti-argmax step is
self-graded prose that can be rubber-stamped in one sentence.

**Its own stated reason it might lose.** The measurement indicts the *always-loaded*
surface. Data corpora and block libraries are not always-loaded — only 1.9 % of the
package loads on a routine run — so deleting 1.44 MB of CSVs cannot be credited with
fixing a 40-vs-59 loss they did not cause. And 3,172 is not 2,078.

### Attacks on MINIMAL — red team

Verdict: **survives, but not as written.** No fatal flaw. The creative thesis holds;
the enforcement layer is where it breaks.

| # | Finding | Re-checked |
| --- | --- | --- |
| M-R1 | The ROUTINE figure omits `verify.md` and `stacks.md`, both of which `SKILL.md` makes unconditional. True floor for any build ≈ 4,922; routine commerce ≈ 6,422, breaching its own proposed 6,000 gate; commerce redesign ≈ 7,672, above v2.3's always-loaded 6,546 — which falsifies its headline claim | accepted |
| M-R2 | The proposed context-budget gate is vacuous. `tools/context-budget.mjs:55` hard-codes `declared = ['SKILL.md','v2/README.md','v2/10-core.md']` and derives ROUTINE from `v2/modes/` and `v2/tasks/`. Under MINIMAL those paths are gone, so ROUTINE collapses to ALWAYS and the gate passes trivially | **verified in code.** The tool also has no threshold and always exits 0 |
| M-R3 | Deleting `PIPELINE.json` breaks the only dependency installer (`bin/sitesmith.mjs:130`, `:235`) and the new `SKILL.md` has no install step, so `verify.mjs` exits 2 on a fresh machine and every default run ships with "the mechanical release verdict is missing". A7 nominally satisfied, practically waived | accepted |
| M-R4 | `journey.mjs` is kept "byte-for-byte" while the file it points at is deleted (`journey.mjs:27` → `v2/40-interaction.md`), and the justification is false: the header defines the *runner* contract, not what a journey asserts | **verified in code**, both halves |
| M-R5 | The mitigation for its own riskiest deletion is absent from its own spec. It claims `gate.mjs` fails a build with no journey for an interactive surface; `gate.mjs` is enumerated as six checks and journey presence is not one of them. v2.3's `production-gate.mjs:496` blocks on "no interaction journey exists" — and that is "at least one", not "one per surface" | **verified in code** |
| M-R6 | `gate.mjs` check 5 and `ledger.mjs` can veto a build the skill's own precedence ladder requires. §13 gives the client's explicit request precedence "including a request that lands on a named default"; §12 forbids editing a check to pass. A dark technical UI with conventional token names, a shadcn theme deliverable, or a redesign whose preserve-list pins existing tokens is correct under §13 and unshippable under §12. The always-loaded control plane contradicts itself twelve lines apart | accepted — **this is the sharpest finding against MINIMAL** |
| M-R7 | The dark-ground veto misreads its cited source. `PALETTE-ANALYSIS.md` finding 4 says the risk is a property of *unfiltered retrieval* — and MINIMAL deletes the corpus, removing the mechanism. The same document's fit table lists dark grounds as correct for whole categories (P03 dev tools/data/gaming, P06 marine/cooling) | **verified in source.** Finding 4 reads "If the corpus is retrieved without a brief-fit filter…". The document's own rule is relative, not absolute: "If two consecutive builds land in the same region… the second one has to justify itself or move" |
| M-R8 | The always-loaded file seeds the device it bans. §4 names the measured house style as "uppercase mono labels, hairline separators, tabular figures, flat surfaces"; §6, eight lines later, teaches exactly that device by example — `PROC-03`, `SLACK WATER` — as the exemplar of good voice, with detection deferred to post-render | accepted |
| M-R9 | The A9 metric has axes pinned constant by the architecture. `ledger.mjs` fingerprints on six fields including display-face presence and token-vocabulary class; §5 mandates a display face on every build and check 5 mandates world-derived names, so two of six fields cannot vary. The pass condition is ≥3 of 6 differing | accepted |
| M-R10 | Anti-house-style enforcement is machine-local and empty by default. `~/.sitesmith/renders.jsonl` is empty on any fresh machine, CI runner or second developer, so device 4 of four reduces to the hard-coded recipes | **verified** — `direction-history.mjs:23` already uses `homedir()`, and the ledger's own recorded failure mode is "local to one machine, doesn't travel with repo/team" |
| M-R11 | The CI rewrite is presented as a repoint and is not. `check-repo.py` binds to deleted material in at least five independent checks | **verified in code** — see the feasibility table below, which enumerates them |
| M-R12 | Test 0 is the go/no-go and cannot detect the failure it matters for. It is one brief, two builds, single-site scored — and round 8 is the standing evidence that single-site scoring passes while the portfolio fails. MINIMAL states the principle itself and then stakes its creative half on a single-site comparison | accepted — **the second sharpest finding** |
| M-R13 | Token drift is "folded in" but its input format is deleted; `production-gate.mjs`'s asset checks point at `v2/24-asset-plan.md` and `v2/25-assets.md` at five call sites that become dead pointers | accepted |
| M-R14 | "126 of 139 files deleted" conflates moved with deleted — ~40 reference files are relocated | accepted |
| M-R15 | `C-no-unlicensed-text` enforcement by string scan needs the banned text in the repo to scan against, and a string scan cannot detect paraphrase anyway | accepted |

Over-engineering called out: the six-field render fingerprint has four bespoke visual
detectors with no defined algorithm ("signature share of viewport" requires mapping a
free-text sentence to a DOM subtree — the exact failure MINIMAL cites as its reason to
shrink `direction-fidelity.mjs`, reimplemented smaller and called a cure); `gate.mjs`
at ~18 KB claims a 4:1 compression over 75 KB while adding two capabilities; the
30-line generic-token blocklist is defeated by find-and-replace.

Constraint violations claimed: `C-no-mechanical-creativity`/A4 via `gate.mjs` check 5
enforcing a *positive* property of the layer the forensics calls decisive;
`C-no-house-style` via the §4/§6 collision and via mandating the same fourth thing on
every build; A10 partially, because two revise-and-recheck loops with subjective exits
are omitted from the five-loop table.

### Attacks on MINIMAL — feasibility

Verdict: **buildable, every hard constraint holds, and the candidate's account of what
building it costs is dishonest by omission.** 80–130 h.

Two findings were rated fatal:

1. **`tools/check-repo.py` does not pass.** Six of its checks hard-fail or crash.
   `_runtime_task_routes:143` requires `v2/tasks/setup.md`, `v2/tasks/redesign-audit.md`,
   a parseable `PIPELINE.json` and a `## 1. Route` section linking both.
   `_third_party_provenance:288-620` is ~330 lines wired to an exact 75-file set with
   hard-coded group counts (`taste-references` 7, `frontend-design-span` 1,
   `uupm-references` 2, `uupm-data` 28, `uupm-python` 3, `impeccable-provider-output`
   35), a 75-unique/76-membership coverage assertion, per-file and per-span SHA-256s,
   six group tree hashes and a manifest self-hash. `_datasets_reachable:643` does
   `from core import CSV_CONFIG` — ImportError. Same for `_search_smoke:781` and
   `_design_system_smoke:804`. `_doc_counts:659` opens deleted CSVs.
2. **Seven further `verify.yml` steps break** — `test-product-flow.mjs`,
   `test-direction-format.mjs`, `test-direction-history.mjs`, `gate-fixtures.mjs`
   (six of seven scripts it spawns are deleted; five of six fixture trees go dead),
   `showcase-gate.mjs`, the block-harness steps, and the clean-install assertion on
   `PIPELINE.json`. Roughly 30–45 h of unbudgeted plumbing.

**Re-checked.** All of this is accurate. I ran `python tools/check-repo.py` on the
current tree: every structural check passes today and the only failures are 14 dead
links, 12 of them inside the candidate documents themselves. So the checker is a live
gate, not a dormant one, and it will go red on the first deletion.

Other confirmed facts from the feasibility pass: `SKILL.md` at 242 lines clears the
500-line cap (current is 196); `verify.mjs` is exactly 13,431 B and `journey.mjs`
1,910 B as claimed; the four scripts `gate.mjs` replaces total 75,193 B; the three
`ledger.mjs` replaces total 28,622 B; the Python engine totals 85,765 B; the NORDRIG §1
token finding is quoted accurately and nothing in v2.3 checks it. The reviewer served
`benchmarks/` and ran the unmodified `verify.mjs` against
`benchmarks/06-redesign/before/` — **FAIL, 13 blocking issues**, so `C-control-group`
survives intact.

Its build-order warning is the one operational instruction worth lifting verbatim:
**do not start with the deletion.** Deleting `data/` alone makes `check-repo.py`
unimportable at line 646, so the repo loses its own self-check before a replacement
exists, and one commit turns eleven CI steps red with no green baseline to bisect.

---

## Routed Modular — the duty router

**Shape.** Three always-loaded files (control plane, creative surface, craft floor),
four fetched route modules on a fixed seven-heading schema, fetched
adapters/references/corpora, nine scripts. The router is a table the model applies by
judgement; no script routes. Its distinguishing claim is that routing decides *duties*
— obligations, journeys, gates, behaviour references — and never appearance, enforced
three ways: a schema with no place to write an appearance value, a `route-lint.mjs`
purity gate with a must-keep-failing impure fixture, and `route-swap.mjs`, which
rebuilds a surface under a deliberately wrong route and asserts both invariance of the
look and sensitivity of the duties.

**Its best material.** The diagnosis of v2.3 is the most precise in the set, quoted
from the code: `v2/modes/marketing.md` has twelve numbered decisions and six of them
are appearance, including a literal "fade-and-rise staggered by no more than three
elements" and "three places on a page". Every marketing brief entering that bucket got
the same answer to all six before the subject was consulted. And v2.3 had *already*
tried prose self-restraint and still produced 0/8 — which is the strongest argument in
any of the three candidates for mechanising rather than instructing. Its floor is the
best-written artifact in the set. Its pre-registered A/B response ("if our re-expression
scores materially lower we ship the original verbatim with attribution") is disciplined.

### Attacks on Routed Modular — red team

Verdict: **killed.** Two fatal flaws, neither of which is the router itself.

1. **A9 is unreachable by construction.** `direction-history.mjs:26-38` hard-codes the
   round-8 recipe as exactly four devices — mono-uppercase-labels,
   hairline-separators, tabular-figure-motif, flat-surfaces. The candidate's
   always-loaded `direction.md` steers to three of them ("a ruled ground, a margin
   rule, a numbering system", "the numbering the trade actually uses", "real units",
   "three lines of CSS and no asset") and its routed layer mandates the fourth:
   `routes/commerce.md` obligation 1 requires prices "in a figure that lines up between
   rows", and `routes/product-ui.md` requires keyboard-operable tables with honest data
   density. Both pass `route-lint` cleanly, because neither is a hex, a length or a
   banned adjective. The loop table then lets a `diversity.mjs` veto be survived: one
   re-entry, then "the collision is reported and the build proceeds with the collision
   named". The skill instructs the recipe, mandates part of it, vetoes the combination
   in a script, and ships it with a note.
   **Re-checked.** `KNOWN_RECIPES` and `devicesFromFingerprint` are exactly as quoted
   (`monoCaps>=4`, `hairlines>=20`, `tabularNums>=3`, `shadowed===0`), and
   `portfolio-diversity.mjs` RULES/devices match. The finding stands.
2. **`route-swap.mjs` cannot pass.** Its sensitivity assertion (journeys, form/table
   semantics and obligations must differ) guarantees the component sets differ, which
   guarantees the invariance assertion (same computed colours, radii, background
   layers, signature element) fails. Loosen the tolerance until it passes and the test
   reduces to `contract.mjs`, already in the script list, needing no second build.
   There is also no same-route control arm, so a diff between two LLM generations
   cannot be attributed to the route. Because §8 makes a route-swap failure a
   non-retryable release blocker and §12 requires both verdicts on the holdout, **A8
   has no path to a release verdict either.**

Serious problems recorded: the purity gate covers `routes/*.md` only — the
script-selected `adapters/*.md`, ten `references/`, and four corpora are unlinted;
the release path has no terminal state (two fix rounds, a red purchase-path journey
refuses release, route-swap failure is not retryable, and nothing says what happens
next); seven ledger-`unchallenged` mechanisms are treated as confirmed including the
load-bearing `sitesmith-current/mode-based-routing-not-defaults` (confidence 0.7,
inherited from the 0/8 build) while `taste-skill/full-output-enforcement` is dropped
explicitly for being unchallenged; the direction loop's only stop condition is
self-graded, in a candidate that drops the preflight checklist because "a
self-administered checklist is a self-graded checklist"; `corpora/fonts.csv` through
BM25 is a seeded menu for the type layer, which §2 says no routed artifact may decide;
`tells.csv` + `tells.mjs` overturns the resolved C1 ("naming beats banning") by giving
the ban list CI enforcement; the ROUTINE budget is computed for one route module when
a shop needs two or three; `SKILL.md` is stated as 131 lines and the embedded file is
138; the ~700-token saving from relocating the ban list is measured against a file
this candidate does not have.

Licence bookkeeping was wrong in two places: `scroll-world/reduced-motion-full-degrade`
is annotated "not redistributable" while `SOURCE-REGISTRY.json` resolves scroll-world
as MIT; and §7 asserts "everything else is original work, MIT" while ~eight adopted
mechanisms are re-expressions of five other sources, one of which
(`before-implementing`) the registry marks licence NOT confirmed.

### Attacks on Routed Modular — feasibility

Verdict: **buildable, 110–170 h**, with three findings rated fatal, all of them the
same class as MINIMAL's: `THIRD-PARTY-PROVENANCE.json` has three readers and zero
writers so it cannot be regenerated without first writing a generator that does not
exist; deleting `blocks/` and `PIPELINE.json` breaks five CI steps; `gate-fixtures.mjs`
invokes seven scripts of which five are deleted, orphaning ~25 negative-fixture
directories — the repo already runs the must-keep-failing-fixture discipline at ~25×
the scale the candidate reintroduces as novel.

Also confirmed by the reviewer, and important for every candidate: **`verify.mjs` does
NOT do a reduced-motion render.** The candidate lists it as existing machinery. It
emulates `colorScheme` only.

Its predicted first failure is worth quoting because it is the router thesis meeting
reality on day two: writing `commerce.md`'s obligations without appearance.
`font-variant-numeric: tabular-nums` is not a hex, a font-family, a radius, a shadow or
a length, so it passes every purity pattern — and `portfolio-diversity.mjs` counts
tabular figures as one of the five shared devices that produced the round-8 house style.

---

## Standard / Floor / Machine — the layered candidate

**Shape.** Cut by who decides and when. STANDARD: always-loaded prose aimed at
judgement, owning taste and a six-item universal floor. FLOOR: one fetched file stating
what this kind of surface must *do*, never how it looks. MACHINE: scripts, schema and
one fact list, contributing zero always-loaded instruction tokens. CONTROL PLANE:
routing, four passes, stop conditions, precedence — the stated price of A1 and A10.
Routing is by verb — decide / buy / operate — plus a redesign overlay.

**Its best material.** The argument for cutting *inside* the craft floor rather than
around it is correct and better reasoned than the topic split: about eight floor items
shape judgement continuously and belong always-loaded; the rest answer a question at a
moment and are fetched. Its three-renditions floor-authoring rule is the direct
mechanisation of the nordrig conclusion. And its designed-in contingency — if the
re-expression smoke test loses by more than 4 points, §1–§5 are replaced by a verbatim
Apache-2.0 include of `frontend-design/SKILL.md`, architecture unchanged — is the best
structural answer to the rebuild's core hypothesis that any candidate offered.

### Attacks on the layered candidate — red team

Verdict: **killed.** Three fatal flaws.

1. **`pick.mjs` violates `C-no-mechanical-creativity` and A4 literally, and buys an
   unverifiable benefit.** The charter enumerates the permitted verbs — "scripts
   verify, retrieve and gate". Selecting is a fourth. §2 makes the output binding
   ("It returns an index that is never 0 … Build that one"), with one override per
   build; once the override is spent, a hash is the final authority on the thesis, and
   the thesis determines token vocabulary, signature, typographic identity and risk.
   Worse, the §9 schema stores `candidates_written` (a count) and `picked_index` and
   never the list, so nothing can tell whether the model wrote its candidates before or
   after reading the index — and since `pick.mjs` takes only `--subject` and `--count`,
   a model can run it first and author its list so its favourite sits at that index.
   Defeated by reordering two steps, undetectably.
2. **The anti-house-style veto cannot fire.** §8 runs `history.mjs check` at THESIS;
   §7.2 defines the fingerprint over *rendered* properties; `direction-history.mjs`
   derives every device of the round-8 recipe from DOM counts. The candidate deleted
   v2.3's declared surface/labels/figures/depth grammar fields and its rendered comps
   and added no replacement to the schema. So the one mechanism aimed at the repo's one
   measured house style checks for it at the only moment it is uncomputable, and the CI
   requirement that the recipe "must keep tripping on a clean install" passes forever
   against a synthetic fixture while never firing in a real build.
3. **The always-loaded file teaches the style it forbids.** §1's exemplar token layer,
   §4's exemplar signature and §5's exemplar copy are all nordrig build A —
   `--paper/--grid/--caution`, a three-line CSS texture, `PROC-03`. §3 cluster 3 and
   `KNOWN_RECIPES.technical-editorial-flat` name that same device set as SiteSmith's
   forbidden house style. A model that follows the creative sections *well* produces
   the artifact the ledger is seeded to veto, burns both re-rolls, and by §10 ships
   "the least-colliding candidate" — the worse idea, by design.

Serious problems recorded: per-surface routing plus a one-floor budget gives ~7,102 est
tokens on an ordinary shop against its own 6,500 ceiling; `state-fields-consumed.mjs`
does not work as specified because the scripts take CLI arguments, not state fields, so
four of its annotations are false; `vocabulary.mjs` punishes correct design on operate
surfaces by blocklisting `--border`, `--muted`, `--card`, which §7 says convention
should keep, and its pass threshold is never stated; `antipattern.mjs` is a fixed
appearance ban list exempt from `floor-lint` and invisible to portfolio diversity;
`floor-lint` bans appearance *values* but not structural prescriptions, so nordrig B's
whole list passes; the MIT frontmatter cannot carry a verbatim Apache-2.0 include; the
n=1 4-point decision rule for the smoke test is statistically meaningless; there is no
small-request path, so "fix my pricing table" runs all four passes including inventing
a thesis; nine ledger-`unchallenged` mechanisms are treated as confirmed; and the
three-mode routing is coarser than the four-register mechanism it cites, so a landing
page, an editorial magazine, a documentation site and every About page load one file.

Two write-up claims were caught as arithmetic errors: "package falls to ~45k est
tokens" silently excludes `references/` (121,839 est tokens) while the file tree
retains it and the 630k baseline includes it — recomputed with `references/` kept, it
is ~172k, off by 3.8×.

### Attacks on the layered candidate — feasibility

Verdict: **buildable, 95–170 h**, with the same three fatal CI/provenance findings, and
one additional finding that matters: `vocabulary.mjs`'s unit-test fixtures do not exist
on the rebuild branch. The 80 nordrig artifacts live only on a local branch that was
never pushed, and no shadcn CSS fixture exists anywhere, so CI would have nothing to
assert against. Also: `production-gate.mjs` survives while `ASSET-MANIFEST.md`'s
authoring guidance is deleted, leaving a gate that blocks on an artifact nothing
explains how to write; `stack.mjs` and `history.mjs` are rewrites, not renames; and
`data/font-families.txt` is an undisclosed derived work of a ui-ux-pro-max
MIT-covered CSV that the same candidate deletes.

Its estimate breakdown is the most useful number in the whole review set: **~40 % of
the work — 35–60 h — is provenance regeneration, `check-repo.py` surgery, CI demolition
and the installer question, all budgeted at zero. The creative surface everyone argues
about is maybe 20 h.**

---

## What the attacks revealed about all three

Three findings landed against every candidate. They are recorded here and fixed in the
decision.

**1. `verify.mjs` has no reduced-motion pass, and C4's own stated test therefore does
not exist.** `CONFLICT-MATRIX.md` C4 resolves motion with "Test: verification renders
with and without `prefers-reduced-motion`". Grepping `verify.mjs` returns
`page.emulateMedia({ colorScheme })` and nothing else. MINIMAL keeps the file
byte-for-byte and inherits the gap; the layered candidate puts reduced-motion in prose
with no check; Routed Modular *asserts the check already exists*. A resolved conflict
whose test was never built is a resolution on paper.

**2. All three costed the CI, provenance and installer demolition at zero.** Both
feasibility reviewers found this independently against all three. The shared shape:
`check-repo.py` has 19 checks, of which ~6 hard-fail and ~4 pass *vacuously* under any
of these restructurings; `THIRD-PARTY-PROVENANCE.json` has three readers and zero
writers; `PIPELINE.json` is the installer's single source of truth;
`tools/gate-fixtures.mjs` covers ~25 negative-fixture trees against scripts all three
delete. The vacuous-pass class is the dangerous one — the licence audit trail stops
being checked while CI stays green, which is the exact failure impeccable's own record
describes.

**3. All three conflated "the always-loaded surface is the problem" with "the package
is the problem".** `BASELINE-CONTEXT-BUDGET.json` records `ratioRoutineOfTotal` 0.0189
and `data/` at 57.2 % of the package and 0 % of a routine run. MINIMAL says this itself
under *whyItMightLose* and ships the deletion anyway. The measurement indicts what the
always-loaded tokens were *spent on*. It says nothing about files that are never loaded.

A fourth, weaker but real: all three proposed a ROUTINE token gate while the tool that
would measure it hard-codes `v2/` paths, has no threshold, and always exits 0. All
three then listed A3 as "measured".

---

## Where the decision landed

MINIMAL is the base — it is the only candidate that survived both its red team and its
feasibility review, and it is the closest reading of the one measurement this repo has.
It is taken with fifteen recorded attacks answered, not inherited: the two scripts that
reached into the design layer are demoted or reseeded, the precedence contradiction is
closed with a brief-primacy waiver, the routine budget is recomputed honestly including
the files it omitted, and the deletions that the evidence never indicted are converted
into *unshipping* rather than deleting.

From Routed Modular: the floor purity rule, the floor admission test, the fake-edge
test, and the honesty-versus-taste split of the ban list. From the layered candidate:
verb-based per-surface routing, one fetched stack adapter instead of a four-stack file,
the three-renditions floor-authoring lint, and the pre-registered contingency for the
re-expression smoke test.

Full reasoning, file tree, token arithmetic, A1–A10 rows, rejected alternatives and
surviving risks: [ARCHITECTURE-DECISION.md](ARCHITECTURE-DECISION.md).
