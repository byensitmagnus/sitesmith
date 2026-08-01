---
title: "Impeccable — Testing"
ai_generated: "(C)"
---

## What it verifies, and how

| What | Mechanism | Real or asserted? |
|---|---|---|
| AI-slop antipatterns (gradient text, cream palette, nested cards, overused fonts, etc.) | `cli/engine/rules/checks.mjs` (5,580 lines) parsing static HTML/CSS or rendered-page computed styles against `cli/engine/registry/antipatterns.mjs`'s 59 named rules. Deterministic, exit code 0/2, JSON output with file:line. | **Real.** This is genuine static analysis, independently re-runnable, no model in the loop. |
| Contrast, accessibility, responsive, theming, implementation-integrity (audit) | `reference/audit.md` — five dimensions scored 0-4 by the model reading code + the same detector for dimension 5. | **Mixed.** Dimension 5 (Implementation Integrity) reuses the real detector; dimensions 1-4 are model judgment against a rubric, not measured against any ground truth or automated check (no axe-core, no Lighthouse integration found in this checkout for the *audit* command itself — see gap below). |
| UX/heuristic quality (critique) | Nielsen's 10 heuristics scored 0-4 by an isolated LLM sub-agent + the same deterministic detector as a second, isolated sub-agent; synthesis calls out agreement/disagreement/false-positives. | **Mixed, structurally honest.** The detector half is real; the heuristic-scoring half is asserted model judgment, but the design explicitly frames the detector as ground truth against which the LLM's judgment is checked, not the reverse ("note where the detector caught issues the LLM missed", `critique.md:102`). |
| Finished-build fidelity to its own contract/comp/quality-bar | `impeccable-finish-reviewer.md` — a fresh sub-agent scores against screenshots, an approved comp, and a quality-bar reference image, producing a derived (not felt) disposition. | **Asserted, not measured.** No code checks that the reviewer's judgment is calibrated correctly; the guarantee is entirely that the reviewer is freshly spawned with no inherited framing, plus explicit instructions not to be swayed by effort. |
| Whether isolation/degradation rules were actually followed (critique, finish-review) | A mandatory disclosure banner the model must print as literally the first line of its report. | **Asserted, not enforced.** Nothing in code verifies the banner was printed or that the model didn't run inline anyway; it is a prose promise. The repo's own admitted failure case ("the last two live sessions shipped five kickers past a reviewer that never looked") shows this class of guardrail does fail silently in the wild. |
| Whether a design-system rule being recorded is real vs. a canonized mistake | The documenter's explicit cross-check against `craft-floor.md`'s ban list before writing DESIGN.md. | **Asserted.** One documented past failure motivates the rule; no automated check verifies the documenter actually performed the cross-check on a given run. |
| Whether new-work's direction-roll step was actually run (not skipped) | The finish-reviewer's contract check requires the FORM block to carry "the seed key the concept roll printed"; a missing or uncorroborated seed key is itself flagged as a material fix ahead of any craft point (`finish-reviewer.md:32`). | **Real, but only retroactively.** This is a genuinely verifiable artifact (the printed seed key), checked after the fact by the fresh reviewer — the one case in this repo where "was the process actually followed" has an auditable trace rather than only a prose promise. |
| Screenshot capture itself (desktop/mobile viewports, both color schemes, console errors, dead links, overflow) | `benchmarks/06-redesign` and the repo's own `scripts/verify.mjs`-equivalent testing infra (per project CLAUDE.md context, not directly re-read in this pass) — not part of the `skill/` runtime path itself; this lives in the repo's own CI, not in what an installed skill runs against a user's project. | Out of scope for the skill mechanism itself; noted for completeness. |

## Notable gap: `audit.md` claims 5 measurable dimensions but only one (#5) is backed by the real detector

`reference/audit.md:57-61` explicitly separates "deterministic findings" from "visual judgment" for dimension 5 alone; dimensions 1-4 (A11y, Performance, Theming, Responsive) are scored entirely by the model reading code and/or a rendered page, with no axe-core/Lighthouse/contrast-calculator integration visible in the `skill/scripts/` directory for the audit flow specifically (the detector does include some contrast checking per `cli/engine/engines/visual/screenshot-contrast.mjs`, but `audit.md` itself doesn't explicitly route through it the way `critique.md` explicitly routes through `detect.mjs`). This means three-quarters of the audit's "score" is unverified model self-assessment dressed in a rubric table, not measurement.

## Notable strength: the mechanical detector is genuinely reusable and reused

The same `detect.mjs` → `cli/engine/detect-antipatterns.mjs` path is invoked identically from `critique.md` (Assessment B), `audit.md` (dimension 5), `routing.md` (no-argument menu signal), and the editor hook (`hook-before-edit.mjs`) — one implementation, four call sites, rather than four divergent re-implementations of "check for slop." This is worth copying structurally regardless of which specific rules SiteSmith ends up encoding.

## What we could not verify in this pass

- Whether the claimed "30/35 identical concepts across 16 prompt framings" measurement (`concept-seed.mjs:12`) has a linked methodology/dataset in this checkout — no such file was found under `skill/`, `cli/`, or `tests/` during this pass; it reads as an internal claim without an attached reproducible test.
- The actual precision/recall of the 59-rule detector against real AI-generated vs. human-designed pages — no evaluation harness or labeled test set for the detector itself was located in the portions of `tests/` sampled.
