---
title: LOOPS — ai-website-cloner-template
ai_generated: "(C)"
---

# Every loop in this package

There are two structurally distinct loops, one nested inside the other, plus one narrower
diff-and-refine loop.

## Loop 1: the extract → spec → dispatch → merge cycle (`SKILL.md:229-403`)

- **Trigger:** one iteration per section in the page topology, top to bottom (`SKILL.md:168-176`).
- **Step order:** extract (screenshot, computed styles, state diffs, content, assets, complexity
  assessment) → write the spec file → dispatch builder(s) → (foreman moves on immediately, does not
  wait) → merge completed worktrees as they finish, reverifying `npm run build` after each
  (`SKILL.md:395-403`).
- **Who checks each iteration:** the same foreman agent, using the Pre-Dispatch Checklist
  (`SKILL.md:431-444`) as the per-iteration gate before moving from "extract" to "dispatch."
- **Stop condition:** the loop ends when every section in the topology has been extracted, specced,
  built, and merged — a fixed, enumerable stop condition (bounded by the number of sections), unlike
  an open-ended refinement loop.
- **Can the whole cycle be rejected mid-run?** No explicit rollback described — a merge conflict is
  resolved, not undone; if a builder's output is bad, the described recovery path is Phase 5 (fix the
  spec or fix the component), not re-running this loop from scratch for that section.

## Loop 2: per-component state capture (nested inside Loop 1's "extract" step, `SKILL.md:93-108,285-296`)

- **Trigger:** any element identified as having multiple states (tab content, scroll-position-
  dependent styling, hover).
- **Step order:** capture state A → trigger the state change (click/scroll/hover) → capture state B →
  diff A and B → the diff becomes the documented behavior.
- **Stop condition:** bounded by the actual number of distinct states the component has (all tabs
  clicked, both scroll positions captured) — not an arbitrary iteration count, but also not
  self-terminating by a quality check; it terminates when the enumerable states run out.
- **Does it improve output?** This is one of the few loops in the whole research set that produces a
  real measurement each iteration (an actual `getComputedStyle()` snapshot), not a self-graded
  narrative judgment — see `TESTING.md`.

## Loop 3: Visual QA Diff discrepancy-fixing (`SKILL.md:415-429`)

- **Trigger:** after full assembly, comparing clone screenshots against the original, section by
  section, at 1440px then 390px.
- **Step order:** find a discrepancy → diagnose (spec wrong, or spec right but builder deviated) →
  fix (re-extract and update spec, or fix the component directly) → implicitly re-compare (not
  explicitly stated as "repeat until zero discrepancies," but the structure implies iterating per
  discrepancy found).
- **Who checks:** the same foreman agent, self-graded, no external critic, no second model — same
  shape as `frontend-design`'s single-voice critique loop.
- **Stop condition:** narrative only — "only after this visual QA pass is the clone complete"
  (`SKILL.md:429`). No numeric threshold, no "repeat until pixel-diff < X%," because no pixel-diff
  tool exists at all (see `FAILURE-MODES.md`). The loop terminates when the agent's own visual
  judgment says it's done, exactly the same unfalsifiable stop condition `frontend-design`'s
  self-critique loop uses ("only show ideas when you have higher confidence it'll delight them").

# What is notably absent

- No adversarial second agent anywhere in any of the three loops — the foreman that extracts is the
  same foreman that specs, dispatches, merges, and QA-diffs. Builder agents build; they do not
  critique their own or each other's output against the source.
- No numeric convergence criterion for Loop 3 despite the entire point of the pipeline being fidelity
  to a measurable target (the live site) — an image-diff percentage or DOM-structural-diff score
  would be a natural, buildable stop condition here and none exists.
- No loop-level retry budget or escalation path (e.g., "if a section fails QA twice, flag for human
  review") — Loop 3 is described as running until subjectively satisfied, with no cap.

# Implication for SiteSmith

Loop 2 (state-capture-and-diff) is the model worth reusing directly: bounded by real, countable
states, producing a real measured diff each pass. Loop 3 (visual QA) is the one to *not* reuse as
specified — it is exactly the same self-graded, unfalsifiable-stop-condition shape criticized
elsewhere in this research set (see `frontend-design/LOOPS.md`), except applied here to a claim
(fidelity to a specific existing target) that is far more measurable in principle than "does this
look generic." SiteSmith's own redesign-audit step should replace Loop 3's narrative comparison with
an actual measured diff wherever the target property is measurable, reserving self-graded narrative
judgment for properties that genuinely have no objective test.
