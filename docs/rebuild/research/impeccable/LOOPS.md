---
title: "Impeccable — Loops"
ai_generated: "(C)"
---

Every loop found, its critic, its stop condition, and whether it demonstrably improves output (per available evidence — the repo asserts improvement in several places but rarely proves it with a controlled test).

## 1. New-work finish loop (build → inspect → fix → verify)

- **Where**: `skill/reference/new-work.md:103-109`.
- **Critic**: a freshly spawned, non-forked sub-agent, `impeccable-finish-reviewer` (`fork_turns: 0`, explicitly "no inherited conversation history... a reviewer that inherits your transcript inherits your framing, your optimism, and your abstractions").
- **Iterations**: hard cap of **2 rounds**. Round 1: batched desktop+mobile screenshots → reviewer's first pass → one fix batch. Round 2: recapture the same viewports → same reviewer scores each fix `resolved/partial/unresolved` against the new screenshots (not the parent's description of what it fixed) → at most one more fix batch. After round 2, "the build thread's polishing is over: no further defect hunts, micro-edit scripts, or rebuilds here."
- **Can the whole direction be rejected?** Yes — if the reviewer's first material fix is a rebuild directive (fidelity failed wholesale, not in patches), the fix-batch step is skipped entirely and the verdict goes straight to the user as a choice between re-derivation and shipping as-is (`new-work.md:107`).
- **Stop condition**: round count (hard: 2) OR "the moment a round resolves nothing" (whichever is reached first) OR the user, when the ceiling is reached with open items, chooses to stop or fund a third round themselves — the model never unilaterally continues past round 2.
- **Does it demonstrably improve output?** Partially evidenced: the reviewer's own spec insists its disposition is "derived, never felt," which is a structural safeguard against rubber-stamping, but there is no measured before/after quality delta in this checkout — the improvement claim rests on the review criteria being sound, not on a demonstrated score change.

## 2. Critique's dual-assessment "loop" (not iterative — a fixed 2-pass fan-out)

- **Where**: `skill/reference/critique.md:29-46`.
- **Critic**: two separate sub-agents (Assessment A: LLM design review; Assessment B: deterministic detector + browser evidence), each blind to the other.
- **Iterations**: exactly one round each, run in parallel, then a single synthesis pass. This is not a loop in the retry sense — there's no re-run, re-score, or convergence check. It's better described as a fixed two-source fan-in.
- **Can the whole assessment be rejected?** No explicit rejection mechanism; a degraded (single-context, sequential) fallback exists only when sub-agents are unavailable, and it must be disclosed with a banner, never silently substituted.
- **Stop condition**: both assessments returning is the only condition; there is no retry-on-low-quality step.
- **Does it demonstrably improve output?** The design intent (avoid one context anchoring on the other's output) is sound reasoning, but no measurement of critique quality with vs. without isolation is present in this checkout.

## 3. Concept-seed re-roll loop (direction/composition selection)

- **Where**: `skill/scripts/concept-seed.mjs:30-33` (comment), `new-work.md:47` (re-roll rules).
- **Critic**: the user, primarily; the model may self-re-roll only "on named factual grounds, when the assigned direction cannot carry the product's truth or task; taste is never grounds."
- **Iterations**: unbounded in principle (each re-roll is `--reroll <n>`, recomputing what rounds 0..n-1 drew and excluding all of it — `concept-seed.mjs:30-33`), but capped by a social/process rule: "after two consecutive re-rolls, ask what quality is missing" (`new-work.md:47`). This is a soft stop (a question), not a hard cutoff.
- **Can the whole direction be rejected?** Yes, explicitly and by design — re-roll "eliminates every direction already shown, grounded and challenger alike"; the user "may re-roll freely." There's also a parallel opt-out ("the standing exit... the category standard, played straight") that's never itself subject to the roll or re-roll mechanics — a pure user escape hatch.
- **Stop condition**: user satisfaction, or the 2-consecutive-reroll question forcing an explicit named gap before continuing.
- **Does it improve output?** This is the mechanism the repo most directly claims evidence for: "30/35 identical concepts across 16 prompt framings" when the model is left to pick its own top-ranked idea unassisted (`concept-seed.mjs:12`) — i.e. the claimed problem (mode collapse) is measured, even if the fix's own effectiveness isn't independently re-measured in this checkout.

## 4. Hook-based per-edit mechanical check (not a review loop — a trigger)

- **Where**: `skill/scripts/hook-before-edit.mjs` (516 lines, not fully read in this pass), referenced by `craft-floor.md:3`: "When the design hook is active it already enforces the mechanical checks below as you edit: act on its findings instead of re-auditing each rule."
- **Critic**: the same deterministic detector engine (`cli/engine/rules/checks.mjs`), invoked automatically after UI file edits rather than as a discrete command.
- **Iterations**: one per file edit, not a converging loop — it's an event-triggered single check, and its explicit purpose is to let the craft-floor's manual verify list be skipped when the hook already covers it mechanically.
- **Stop condition**: N/A — it's not iterative, it's a trigger.

## Overall loop philosophy in this repo

Every bounded loop in this codebase caps at exactly **2 rounds** (finish-review, concept-seed's soft 2-reroll checkpoint) and pushes any further iteration decision explicitly to the user rather than letting the model decide unilaterally to keep going. The repeated phrase across files is a variant of "this is the ceiling; whoever is deciding, stop the moment a round resolves nothing" (`new-work.md:107`). No mechanism in this repo runs an open-ended "keep improving until score X" loop — that pattern is explicitly named and rejected in `SKILL.src.md:17`: "Verify in bounded passes, not a loop... Open-ended self-QA burns the user's money doing worse what the finish handoffs do better."
