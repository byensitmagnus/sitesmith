---
title: FAILURE-MODES — sitesmith-current autopsy
ai_generated: "(C)"
---

# Where and how it breaks, degrades, or produces sameness

This source lost the head-to-head comparison (a rules/template direction generator scored 40
where an LLM reasoning natively from evidence scored 59 on the same brief). The failure modes
below are graded on that axis first, then on general engineering weaknesses.

## 1. Mechanical creativity: the direction candidate search (the probable root cause)

`scripts/candidates.py` + `scripts/core.py` + `scripts/search.py` implement BM25 keyword search
over fixed CSVs (`data/styles.csv`, `colors.csv`, `typography.csv`, etc. — authored once,
2024-vintage, from ui-ux-pro-max-skill) and a Jaccard-distance "pick three far-apart rows"
heuristic (candidates.py:228-249). `v2/20-direction-lab.md:42-48` instructs running this search
and treating its output as the seed for the direction lab's three candidates.

This is the textbook instance of "a mechanism that moves a creative decision into a script is a
liability" (this task's C-no-mechanical-creativity constraint). The three "candidates" a model
sees are three named rows from a closed, dated taxonomy — "Flat Design," "Brutalism,"
"Glassmorphism," whatever the CSV happens to contain — rather than anything derived from the
actual evidence pack. `detect_domain()` (core.py:201-221) keyword-matches the query into one of
11 fixed domains and silently falls back to `"style"` if nothing matches (core.py:221), so an
unusual subject is quietly mapped onto the generic style taxonomy rather than flagged as
uncovered. Confidence is reported ("low"/"medium"/"high") but is a property of vocabulary
distance in the CSV, not of fitness to the brief.

**This is very likely the single mechanism most responsible for the 40-vs-59 loss.** It
constrains the model's first move in the direction lab to picking among (or being anchored by)
a fixed menu, exactly where an unaided LLM reasoning from `EVIDENCE.md` would instead generate
an idea from the subject's actual world.

## 2. Dead mechanical-creativity code sitting one layer deeper

`scripts/design_system.py` (1151 lines — the largest script in the repo) implements a second,
even more mechanical generator: multi-domain BM25 search plus a CSV rule-matcher
(`ui-reasoning.csv`) that assembles a complete design-system recommendation procedurally, with
a persistence flow (`--persist`, `--page`). Grepping every `v2/*.md` file and `PIPELINE.json`
for `--design-system` or `generate_design_system` returns **zero hits** — nothing in the
current pipeline calls it. It survives purely because it was never deleted when v2 replaced the
v1 ui-ux-pro-max import. If ever invoked (by a curious agent poking at `scripts/`, or a future
maintainer wiring it back in "for convenience"), it reproduces the same mechanical-creativity
failure at the design-system level, directly contradicting `v2/30-contract.md`'s own stated
principle that the contract must be "derived from the brief, not from this file"
(30-contract.md:6-8).

## 3. Closed taxonomies wherever a regex has to classify prose

Both `direction-check.mjs` and `direction-fidelity.mjs` classify the four visual-grammar fields
(surface/labels/figures/depth) and the five macro axes with hand-written regexes over a fixed
vocabulary of English phrases (e.g. `surfaceExpectation`, direction-fidelity.mjs:95-102, only
recognises "hairline," "open/whitespace," "framed," "colour fields/bands"). A genuinely novel
treatment that isn't phrased in the recognised vocabulary becomes a "note" (unclassifiable) and
is silently excluded from enforcement rather than flagged as a taxonomy gap. This nudges
direction-writing prose toward whatever words the classifier already knows, which is a subtler
version of the same house-style pressure the mechanism is supposed to prevent.

## 4. House-style convergence was measured, not eliminated

`v2/README.md:35-46` and `v2/20-direction-lab.md:114-118` document that even after the five-axis
structural-difference gate existed, three round-8 sites (Tannery, seed library, tideworks) all
passed it AND passed individual review, and still shared "uppercase mono labels, hairline
separators, tabular figures as a motif, flat surfaces" — a fixed, four-item recipe now
hard-coded as `KNOWN_RECIPES` in `direction-history.mjs:29-38`. The four-visual-grammar-field
gate (v2.3) is a reaction to one measured failure, not a general solution — it guarantees
detection of *that* four-item recipe but has no mechanism for detecting a different
convergence pattern until it, too, ships and gets measured. The rebuild should not assume the
current four fields are exhaustive.

## 5. The BM25/CSV data corpus is a 2024 snapshot with no update mechanism

`data/` totals ~1.4MB across 16 domain CSVs and 16 stack CSVs, all inherited from
ui-ux-pro-max-skill v2.9.0/2.11.0 (per `LICENSE-AUDIT.md`). There is no refresh pipeline —
`data/_sync_all.py` exists but nothing in `PIPELINE.json` or `v2/*.md` schedules or requires
running it. Style names, font pairings, and stack-specific guidance are frozen at whatever was
true when the CSVs were authored; a stack-guideline row for a framework version that has since
changed idiom (e.g. React server-component conventions) is stale and is presented with the same
authority as everything else in the corpus.

## 6. The critique ceremony's real rigor only applies lab-side

The strongest anti-genericness machinery in the repo — `critique-gate.mjs`'s enforced
independent-reviewer, sealed-key, sha256-locked ceremony — is explicitly scoped to benchmark
work (`v2/50-critique.md:141-155`, `PIPELINE.json:346`: "Sealed mappings, two-reviewer locks and
critique-gate.mjs belong to explicit benchmark work, not to an ordinary customer-site audit").
For an ordinary single build, the visual critique (`v2/50-critique.md`'s rubric) is
self-administered by the same agent that built the page, with no independence enforcement at
all — the exact failure mode ("a reviewer who knows which page the skill produced will find
reasons for it to be better," 50-critique.md:95-97) that the lab ceremony was built to prevent
is undefended in ordinary use.

## 7. Verification has a real cold-start gap

`scripts/verify.mjs`, `direction-check.mjs`, `direction-fidelity.mjs`, `direction-history.mjs`,
`journey.mjs`, `production-gate.mjs`, and `portfolio-diversity.mjs` all require Playwright (and
axe-core, for verify.mjs) to be installed in the *target project*, not bundled with the skill.
`SKILL.md:181-182` acknowledges this directly: "If a browser tool is unavailable, open the page
manually and report that the mechanical release verdict is missing." On a brand-new project
(the SETUP task) there is a real window where none of the seven Playwright-backed gates can run
at all, and the fallback is an honest admission rather than a substitute check.

## 8. Token-drift only sees inline `<style>` blocks

`scripts/token-drift.mjs:55` extracts CSS only from `<style>` tags in the HTML passed to it. A
project styled via separate CSS files, CSS-in-JS, or a utility framework (Tailwind classes with
no literal hex/length values in markup) is effectively invisible to the drift checker unless the
caller separately points it at compiled/rendered output. Given the pipeline explicitly supports
Next.js/React/Vite/Astro stacks (`stack-router.mjs`), this is a real coverage gap for the
majority of stacks the skill claims to support, not an edge case.

## 9. Placeholder/dummy-identifier detection is a closed, hand-maintained list

`production-gate.mjs:24-55` matches visible text against ~20 hard-coded regexes (Lorem Ipsum,
John/Jane Doe, Acme Corp, 555-numbers, "Anytown," "coming soon," etc.). Any placeholder
phrasing not on this list — which will always exist, since it is enumerable only after the fact
— passes silently. The commerce-claim tracer (lines 294-306) does normalised substring matching
against `EVIDENCE.md`, so a price written in a different format than the evidence file
(`£1,299` vs `1299 GBP`) can false-positive as an untraceable claim.

## 10. Progressive disclosure is a norm the tooling cannot enforce

Nothing mechanically checks that an agent limited its reads to the `PIPELINE.json` step's
declared `reads` list. The discipline depends on the model choosing not to read
`references/impeccable/critique.md` (793 lines) or the full `data/` corpus out of curiosity —
`SKILL.md:15-16` states the rule ("references/... is not read during a build") but there is no
gate analogous to `token-drift.mjs` that could catch a violation after the fact.
