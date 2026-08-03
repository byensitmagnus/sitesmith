---
title: taste-skill — Verdict
ai_generated: "(C)"
---

# Single most valuable thing to steal

**The brief-inference "Design Read" ordering** (`skills/taste-skill/SKILL.md:13-39`): read page kind, vibe words, references, audience, and quiet constraints; commit to one evidence-cited sentence naming the aesthetic family before writing any code; ask at most one clarifying question and only when it would materially change the build. This is the one mechanism in the entire repo that squarely lands on the "makes the model think better" side of the C-no-mechanical-creativity axis this evaluation is scored against — it is reasoning support, not a rules substitute, and it is cheap (a few hundred tokens, no lookup table required).

# Single most dangerous thing to copy

**The three fixed-aesthetic template skills (`soft-skill`, `minimalist-skill`, `brutalist-skill`) and `gpt-tasteskill`'s fabricated "Python RNG" step.** The templates hardcode exact hex codes, radii, and component patterns with no design-read step at all — every project built with one converges on the same palette and geometry by construction, which is the literal definition of the C-no-house-style failure this project's own memory already documented once (three briefed sites converging on five shared moves). The fake-RNG mechanism is worse in a different way: it dresses up a small fixed menu as objective randomization the model cannot actually perform, spending tokens on theater instead of reasoning — the purest example in this corpus of moving a creative decision into a script.

# One-line verdict

taste-skill's flagship file gets the *ordering* right (read the brief, reason, then apply constraints) but undermines its own thesis with lookup-table dials, zero real verification, and three sibling skills that are exactly the fixed-template convergence machine the brief warns against — worth stealing the reasoning-first shape and the ban+override pattern, worth rejecting everything that substitutes a table or a fake dice roll for that reasoning.
