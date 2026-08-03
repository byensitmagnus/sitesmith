---
title: "UI/UX Pro Max — Verdict"
ai_generated: "(C)"
---

## Single most valuable thing to steal

The **evidence-based design-review loop** (`stack/.claude/agents/design-review.md` +
`stack/scripts/design-audit.mjs`): a 7-phase model-driven review that opens a real browser and
reports only what it observed, backed by a heuristic script that measures actual DOM/CSSOM state
(computed focus styles by really focusing 25 elements, real `getBoundingClientRect()` overflow and
tap-target checks, a WCAG contrast pass over sampled text nodes) rather than asserting quality. It's
the only mechanism in the repo that makes the model check its own work against reality instead of
against a lookup table — directly extend SiteSmith's `scripts/verify.mjs` with the tap-target and
real-focus checks it's missing.

## Single most dangerous thing to copy

The **design-system generator** (`design_system.py:generate()` + `data/ui-reasoning.csv`): a fully
deterministic, no-LLM-in-the-loop pipeline that maps ~30 fixed product categories to one hardcoded
style/color/typography tuple each. It is, mechanically, the exact thing the brief's own benchmark
scored 40 against an LLM's 59 on the same task — and the project's own `WORKFLOW.md` names the
symptom ("cream+serif and acid-on-black defaults") and routes around it with a separate taste skill
rather than fixing the generator. Porting this mechanism into SiteSmith would import both failure
modes the brief warns about — mechanical creativity and house-style convergence — in one file.

## One-line verdict

Good retrieval plumbing and a genuinely strong verification loop wrapped around a creative-decision
engine that mistakes a lookup table for design judgement — steal the search-and-verify shape,
discard the auto-picking generator, and re-express the static UX/accessibility knowledge as
reference material the model reasons over, not as a script that reasons for it.
