---
title: WORKFLOW-MAP — frontend-design
ai_generated: "(C)"
---

# Step order a run actually takes

There is one file, so every "step" below is a paragraph range inside `SKILL.md`, not a separate
file or script. The workflow is entirely narrated, not orchestrated.

| # | Step | Driven by | What happens |
|---|------|-----------|--------------|
| 1 | Adopt persona | `SKILL.md:9` | Model is told to act as "the design lead at a small studio known for giving every client a visual identity" — sets an evaluative frame (client rejected templated work) before any content exists. |
| 2 | Pin the subject | `SKILL.md:11-13` | If brief is vague, model must invent a concrete subject, audience, and page job itself, and state the choice out loud. No fallback subject is provided — the model is the fallback. |
| 3 | Apply design principles as a lens | `SKILL.md:15-27` | Hero-as-thesis, typography-as-personality, structure-as-information, motion-as-deliberate-choice, complexity-matched-to-vision, copy-as-design-material. These are heuristics, not steps — read once, applied throughout. |
| 4 | Brainstorm a design plan | `SKILL.md:33` | Model produces a compact token system in its own reasoning: 4-6 named hex colors, 2+ typefaces by role, a layout concept (prose + ASCII wireframe), and one signature element. |
| 5 | Self-critique the plan against the "default look" calibration | `SKILL.md:31, 35` | Model is shown three named AI-design clichés (cream/serif/terracotta; near-black/acid accent; broadsheet hairlines) and told to check its own plan against them, revise, and say what changed. This is the pivotal step — see `LOOPS.md`. |
| 6 | Build | `SKILL.md:35, 37` | Only after the plan survives step 5 does code get written, "following the revised plan exactly." A CSS-specificity caution is dropped here (class vs element selectors cancelling out, `SKILL.md:37`). |
| 7 | Critique again / quality floor | `SKILL.md:41-43` | Responsive down to mobile, visible keyboard focus, reduced motion respected, screenshot-based self-review, "remove one accessory" restraint check. |
| 8 | Copy pass | `SKILL.md:45-55` | Treated as a distinct concern applied throughout, not gated behind the earlier steps — could run in parallel with 3-4 in practice. |

# What routes the process

Nothing routes it mechanically. There is no `if/else`, no stack detection, no file-type branch.
The entire "routing" is the model being told a two-pass process ("Work in two passes," `SKILL.md:33`)
and trusted to execute it in its own reasoning before emitting code ("Try to do a lot of this
planning and iteration in your thinking, and only show ideas to the user when you have higher
confidence it'll delight them," `SKILL.md:39`). See `ROUTING.md` for why this is a feature, not a gap.
