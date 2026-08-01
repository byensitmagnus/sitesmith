---
title: ROUTING — frontend-design
ai_generated: "(C)"
---

# How it picks a path

It doesn't — there is no path to pick. There is exactly one file and no branching logic of any
kind: no stack detection, no "if React do X, if Astro do Y," no conditional section based on brief
content. The `description` field in the YAML frontmatter (`SKILL.md:3`) is the only routing
signal that exists, and it operates one level up, at the skill-invocation layer (the harness
deciding *whether* to load this skill at all for a given user message), not inside the skill.

# What signals it uses

The skill-level trigger is the frontmatter `description`: "Guidance for distinctive, intentional
visual design when building new UI or reshaping an existing one. Helps with aesthetic direction,
typography, and making choices that don't read as templated defaults." (`SKILL.md:3`). This is a
single natural-language description matched against the user's request by whatever mechanism the
host harness uses (semantic match against skill descriptions) — the skill itself has no say in
this and provides no additional signal.

Once loaded, there is no further routing: the same 55 lines apply whether the task is a new landing
page, a redesign, a dashboard, or a component restyle. The word "reshaping an existing one" in the
description is the only acknowledgment that redesign and greenfield are different tasks, and the
body text never distinguishes them again after that.

# What happens on ambiguity

There is no ambiguity-handling mechanism because there is nothing to disambiguate between — one
skill, one body of instructions, applied uniformly. The closest thing to ambiguity-handling in the
body itself is the subject-grounding mandate (`SKILL.md:11-13`): when the *brief* is ambiguous or
thin, the model is told to resolve that ambiguity itself by inventing a concrete subject and stating
the choice. That's ambiguity-handling for the content of the task, not for which part of the skill
applies — because the whole skill always applies.

# What this means for SiteSmith

This source offers zero evidence about routing strategy because it has none to offer — it is a
single always-on prompt, not a router. Any routing mechanism SiteSmith needs (stack detection,
build-vs-redesign branching, complexity tiers) has to come from elsewhere in our own design; this
source's contribution is purely to the *content* of the design-direction step, not to *when or how*
that step gets selected. Do not mistake the absence of routing complexity here for evidence that
routing is unnecessary — it's evidence that this particular package chose to be small and universal
rather than to specialize, which is a defensible choice for a narrowly-scoped skill but not
necessarily for a larger orchestrated tool like SiteSmith that legitimately does need to route
between stacks.
