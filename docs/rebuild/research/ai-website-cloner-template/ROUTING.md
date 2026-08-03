---
title: ROUTING — ai-website-cloner-template
ai_generated: "(C)"
---

# How it picks a path

Task routing (which skill fires) happens one level up, the same as every source in this set: the
frontmatter `description` (`SKILL.md:3`) is matched by the host harness against the user's request
("clone", "replicate", "rebuild", "reverse-engineer", "pixel-perfect clone" are the named trigger
phrases). Inside the skill body there is exactly one real fork, and it is complexity-driven, not
content- or stack-driven: the 150-line spec-content threshold decides whether a section gets one
builder or a wrapper-plus-sub-component split (`SKILL.md:43-49,381-383`).

Everything else is single-path regardless of what kind of site is being cloned. There is no
stack-detection branch (WordPress vs. Webflow vs. hand-rolled React all funnel through the same
`getComputedStyle()`-and-screenshot pipeline), no CMS-specific extraction logic, no different
handling for e-commerce vs. marketing vs. dashboard pages.

# What signals it uses

Beyond the frontmatter description, the only other explicit routing-like decision is posed directly
to the user rather than resolved internally: when multiple URLs are given, the skill asks whether to
run them in parallel (recommended, if resources allow) or sequentially to avoid overload
(`SKILL.md:33`). This is the one place in the whole file where the skill defers a decision rather
than making it unilaterally — notable given the rest of the package is otherwise built around the
foreman making calls autonomously (complexity splits, merge conflict resolution, when a discrepancy
is spec-wrong vs. builder-wrong).

# What happens on ambiguity

Ambiguity in the *target* is handled explicitly: invalid URLs are flagged back to the user before
proceeding (`SKILL.md:30`); a missing browser-automation tool triggers an explicit question rather
than a silent failure (`SKILL.md:29`). Ambiguity in *scope* is handled by the Scope Defaults block
(`SKILL.md:16-25`) — pixel-perfect fidelity, named in/out-of-scope lists, overridable by the user's
own explicit instructions. There is no ambiguity-handling for *interaction model* — that's not
treated as something to ask the user about, but something to determine empirically by scrolling
before clicking (`SKILL.md:81-91`), which is the correct choice: it's a factual property of the live
page, not a preference to elicit.

# What this means for SiteSmith

This source has one genuinely portable routing idea: separate "what am I uncertain about" into two
buckets, and handle each the way its nature demands. Facts about the live target (interaction model,
what's actually in the DOM) get resolved by investigation, never by asking. Facts about desired
scope/fidelity (how faithful, what's in/out of scope) get a stated default plus an explicit
user-override path. SiteSmith's audit-before-redesign step faces the same two buckets — what the
existing site actually does (investigate, don't ask) versus how aggressively to redesign it (state a
default, let the user override) — and should route the same way. The complexity-threshold-driven
sub-agent-split fork does not transfer, since it's coupled to the git-worktree builder-dispatch
mechanism this research rejects for SiteSmith's audit task (see `MECHANISMS.json` →
`git-worktree-parallel-builder-dispatch`).
