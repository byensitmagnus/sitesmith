---
title: VERDICT — frontend-design
ai_generated: "(C)"
---

# The single most valuable thing to steal

The named-cliché calibration list (`SKILL.md:31`, `MECHANISMS.json` → `named-cliche-calibration`):
naming three concrete, current AI-design patterns by their actual visual specifics (colors, type
contrast, layout structure) and requiring the model to diff its own plan against them before
building. This is the only mechanism in the package that converts "be original" from an
unfalsifiable mood into something the model can actually test against. It is squarely on the
model-reasoning side of the C-no-mechanical-creativity axis (it makes the model think harder, it
does not move a decision into a script), and it is the most direct, most portable countermeasure to
the C-no-house-style failure our own three-site convergence test documented. Paired mechanisms that
make it work — the four-part token system that gives the critique something concrete to review
(`SKILL.md:33`), and the single self-critique pass that actually applies the list (`SKILL.md:35`) —
should be adopted alongside it, not the list alone.

# The single most dangerous thing to copy

Treating the cliché list, or the whole package, as a static, one-time-committed artifact. The list
is a frozen snapshot of a moving target: new AI-design defaults will emerge, and this file has no
mechanism to notice or refresh itself (see `FAILURE-MODES.md`). If we port this mechanism and then
never touch it again, we will eventually be defending against clichés from 2025 while the actual
current defaults have moved on — and worse, a version of this exact list, having been trained on
by future models, could itself become a new cliché to defend against. The mechanism must be
adopted as a *living list we maintain*, not a document we copy once.

# One-line verdict

This source wins by replacing rules with a sharpened, falsifiable sense of taste — one concrete
self-test (the cliché list) plus one disciplined critique pass — and it wins entirely inside the
model's own reasoning, with zero scripts, zero templates, and zero mechanical output generation;
the risk is treating either the list or the two-pass loop as permanently finished rather than as
living, maintained judgment tools.
