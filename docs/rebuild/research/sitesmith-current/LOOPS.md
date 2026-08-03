---
title: LOOPS — sitesmith-current autopsy
ai_generated: "(C)"
---

# Every loop, its critic, its stop condition, whether it actually improves output

## 1. The direction lab (three comps → one chosen, two rejected with reasons)

- **Critic**: the model itself, scoring its own three comps against 5 named criteria
  (`v2/20-direction-lab.md:158-172`): comes from the subject, serves the primary action, can be
  built/maintained, avoids the anti-references, has a defensible signature.
- **Iterations**: exactly one round. Three comps are produced once; the highest score wins; ties
  break on subject-specificity then rebadge-difficulty (20-direction-lab.md:171-173). There is no
  second round of comps if all three score poorly — the process assumes three comps is enough.
- **Can the whole direction be rejected?** No explicit "reject all three, start over" path is
  described. The nearest thing is the anti-repeat gate (`direction-history.mjs check`) failing
  the *winner* post-hoc, which forces picking a different winner or re-arguing, but does not
  re-trigger comp generation.
- **Stop condition**: `direction-history.mjs check DIRECTION.md <url> --project <name>` passes
  (novel enough) AND `direction-check.mjs directions/` passed pairwise-difference earlier.
- **Does it improve output?** The scoring rubric (specificity, buildability, anti-reference
  avoidance) is a real forcing function for the *comparison*, but the comps being compared can
  still all be mediocre if the candidate-search seed (see FAILURE-MODES #1) anchored them to a
  narrow menu. The loop improves relative selection quality, not absolute idea quality.

## 2. Direction-check / direction-fidelity (declare → render → measure → fail-and-fix)

- **Critic**: entirely mechanical — `direction-check.mjs` (comps) and `direction-fidelity.mjs`
  (finished page) parse the declared axis record and measure the rendered DOM, no model
  judgement in the loop itself.
- **Iterations**: unbounded in principle — SKILL.md does not cap re-runs; the workflow is
  "the ordinary edit loop renders only the changed surface" (SKILL.md:79-84) and `audit` re-runs
  the canonical check "once" (SKILL.md:91), implying the loop is meant to terminate before audit,
  not during it.
- **Can it reject everything?** Yes, functionally: if the built page never matches its declared
  direction, `direction-fidelity.mjs` exits 1 indefinitely until the code or the declaration
  changes — there is no score threshold to average past, every named axis either matches or
  fails (direction-fidelity.mjs:359).
- **Stop condition**: exit code 0 — `v.pass ? 0 : 1` (direction-fidelity.mjs:450) — all
  declared axes measured true, plus the signature selector clears its minimum area share.
- **Does it improve output?** Yes, demonstrably — this is real measurement against a written
  contract, not self-report, and it was written specifically because a real defect (dark-mode-
  only direction) shipped past every other check. This loop is one of the strongest verification
  mechanisms in the repo (see GOOD-PATTERNS #1).

## 3. Token drift (contract → scan → fix undeclared values)

- **Critic**: mechanical — `token-drift.mjs --contract` scans inline `<style>` blocks for
  literals not in the declared token set or one-off table.
- **Iterations**: unbounded, implicitly one per edit ("Structure the argument... the edit loop
  renders only the changed surface," SKILL.md:79). No loop count is specified because the tool
  is meant to run continuously during `build`, not as a fixed number of passes.
- **Can it reject everything?** No — it can only report undeclared values; it never says the
  *contract itself* is wrong, only that a page disagrees with whatever contract exists.
- **Stop condition**: `drift === 0 && !missing.length` (token-drift.mjs:277).
- **Does it improve output?** Yes for what it measures (token discipline), but it is blind to
  non-inline-CSS styling (see FAILURE-MODES #8), so the loop can report "PASS" on a page that is
  actually just as undisciplined in a stylesheet file the tool never read.

## 4. Interaction journeys (write journey → run → fix wiring → rerun)

- **Critic**: mechanical — `journey.mjs` spawns each `*.spec.mjs` and reports pass/fail; the
  spec itself asserts four specific properties (changed / announced / failure-path /
  keyboard-path, `v2/40-interaction.md:115-129`).
- **Iterations**: unbounded, one journey at a time — "a single one can be run directly with
  `node journeys/x.spec.mjs` while it is being written" (journey.mjs:9-10) — this is explicitly
  designed as a tight edit-run loop during `build`, not a single audit-time check.
- **Can it reject everything?** Functionally yes: `production-gate.mjs --production` fails
  outright if `journeys/` is empty (production-gate.mjs:492-498) — there is no partial-credit
  path.
- **Stop condition**: all spec files exit 0 (journey.mjs:50).
- **Does it improve output?** Yes — it is the only mechanism in the repo that proves an
  interactive state is reachable rather than merely styled, and it was written directly against
  a measured defect (zero `<script>` tags across nine legacy pages).

## 5. The visual critique / targeted-polish loop (ordinary build)

- **Critic**: the model itself, self-scoring against the 7-criterion rubric
  (`v2/50-critique.md:44-77`) on its own screenshots, only after the technical gate is green.
- **Iterations**: `polish` is explicitly "one round, driven by a specific screenshot criticism"
  (SKILL.md:106-107) — "Not a second design pass" (PIPELINE.json:79). The pipeline is explicit
  that this is a single targeted correction, not an iterate-until-good loop.
- **Can it reject everything?** Yes in principle — the primary-criticism test fails the gate
  outright regardless of numeric scores if the page reads as generic (50-critique.md:99-112) —
  but for an ordinary build there is no independent second reviewer, so "reject" here is the
  same agent that built the page deciding to fail its own work.
- **Stop condition**: none formally enforced for ordinary builds — `PRODUCTION-REPORT.md`
  records "every failure" (SKILL.md:95) but there is no script gating on the critique's outcome
  the way `production-gate.mjs --production` gates on placeholders/assets/journeys.
- **Does it improve output?** Only as well as self-critique ever does — this is the loop with
  the weakest independence guarantee in the whole pipeline for ordinary (non-benchmark) work.
  See MECHANISMS.json `two-gate-separation-technical-vs-visual` and FAILURE-MODES #6.

## 6. The benchmark-lab critique ceremony (lab-only, NOT part of the ordinary loop)

- **Critic**: two *independent* reviewers, enforced by `critique-gate.mjs` (not the model
  grading itself) — reviewer identity checked against the builder's identity
  (critique-gate.mjs:145-156), reviews locked by hash before a sealed key is opened.
- **Iterations**: exactly one locked round per reviewer; disagreement of 3+ points is reported as
  a finding, not resolved by a second round (critique-gate.mjs:254-259, "not averaged away").
- **Can it reject everything?** Yes, unconditionally, via multiple independent failure paths:
  self-review detected, hash mismatch (post-lock edit), key opened early, generic-template tell
  in either review, median below threshold 8, any criterion below floor 4.
- **Stop condition**: `judge().pass` — every one of the above clears (critique-gate.mjs:139-263).
- **Does it improve output?** This is the one loop in the repo with a real independence
  guarantee, but it is scoped by the source itself to benchmark/portfolio work
  (`v2/50-critique.md:141-155`) — it does not run for an ordinary customer site, so its
  improvement-of-output claim only applies to the narrow case it is actually used for.
