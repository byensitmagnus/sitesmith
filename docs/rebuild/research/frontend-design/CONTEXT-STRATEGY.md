---
title: CONTEXT-STRATEGY — frontend-design
ai_generated: "(C)"
---

# Always-loaded vs conditional

There is no conditional loading in this package at all. It is one file, 8,315 characters including
YAML frontmatter, and the entire file is the skill body — there are no `references/`, no
`scripts/`, no "read this section only if X" branches anywhere in the text.

**Always loaded:** the entirety of `SKILL.md` (all 55 lines / 8,315 characters), whenever the skill
triggers. This includes the YAML frontmatter (`name`, `description`, `license` pointer,
`SKILL.md:1-5`), which is what a routing layer would use to decide *whether* to trigger the skill
in the first place — meaning even the trigger-decision step and the full-body load are effectively
the same cost, since there's no smaller "index" file to check first.

**Conditionally loaded:** nothing. `LICENSE.txt` (177 lines, 10,351 characters) is never read by
the model at runtime — it exists purely for redistribution compliance (a human or a packaging
process would consult it before republishing the skill), not as context the model reasons over.

# Token cost estimate

Method: character count of the file, divided by 4 (the standard rough tokens-per-character
heuristic), stated explicitly per the instruction to show the method.

- `SKILL.md`: 8,315 characters / 4 ≈ **2,079 tokens**, all always-loaded.
- `LICENSE.txt`: 10,351 characters, but **0 tokens of runtime cost** — not loaded into model
  context during a design task.

Total always-loaded runtime cost: **≈2,079 tokens**, a single flat cost with no variation by task
type, stack, or brief content.

# Implication for our design

This is the cheapest possible context strategy: no progressive disclosure, no routing overhead, no
risk of loading the wrong reference file, because there is only one file and one load path. The
tradeoff is that it cannot specialize — the same ~2K tokens are spent whether the brief is a
one-line request or a 500-line spec, and there is no mechanism to shed weight for simple tasks or
add weight for complex ones. For SiteSmith, adopting the concrete mechanisms (named-cliché list,
token system, self-critique instruction) at a similar flat cost is cheap and low-risk; the thing to
avoid is bolting this onto our existing progressive-disclosure structure in a way that makes it
*always* load regardless of whether a design-direction step is actually in play.
