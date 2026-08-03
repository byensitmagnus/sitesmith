---
title: "Task-Contracts Autopsy — Routing"
ai_generated: "(C)"
---

# Routing

How each source decides *whether* and *how much* of itself to engage — not what it says once
engaged.

## ai-dev-tasks: no routing, always full engagement

There is no applicability check anywhere in either file. `create-prd.md` and `generate-tasks.md`
assume every request that reaches them warrants the full PRD → task-list pipeline, including the
mandatory task 0.0 (`generate-tasks.md:17`) and all nine PRD sections (`create-prd.md:53-65`). The
README's own workflow diagram (`README.md:17-79`) treats "build a feature" as a single case with a
single path. This is consistent with the package's real scope — it is a human-paste-into-chat
prompt pair for one class of task (net-new feature development), not a skill meant to self-select
when to engage.

## before-implementing: explicit applicability gate, then internal branching

Two-level routing:

1. **Whole-skill gate** — an explicit "When to Use" list (unfamiliar codebase/API, vague product
   direction, long-running subagent launch, failed prior attempt, plan needing pressure-testing —
   `SKILL.md:29-36`) paired with an explicit "Do not use when" list (trivial/mechanical tasks,
   explicit immediate-execution requests with low assumption-risk, single-tool-call-verifiable
   answers — `SKILL.md:38-42`). This is a real proportionality check: the skill can decline to
   engage at all.

2. **Internal branch selection**, once engaged:
   - Unknown-unknowns → blindspot pass, itself gated on "unfamiliar domain... or high-stakes
     integration" (`SKILL.md:136`), not run for every engagement.
   - Unknown-knowns → prototype/reference route instead of a question (`SKILL.md:157-165`).
   - Known-unknowns → the grill loop with its own budget/fatigue-valve exit (`SKILL.md:92-126`).
   - Subagent launch → launch packet + role split, gated on "before spawning a subagent or external
     coding agent" (`SKILL.md:201-203`), not part of a solo-session engagement.
   - Domain modeling → gated on "reveals fuzzy terminology... or durable... decisions"
     (`references/domain-modeling-add-on.md:3`).

Each branch has its own named trigger rather than one flag turning on the whole package — this is
the shape that makes proportional planning possible at all: a trivial task can engage the skill and
immediately exit through "Do not use when," while a complex multi-agent build engages several
branches at once.

## Implication for the SiteSmith rebuild

The rebuild should carry an equivalent two-level gate:

- A whole-skill-equivalent proportionality check up front — most SiteSmith intake instructions
  currently assume every brief gets the same treatment; `SKILL.md:27-42`'s explicit "when not to
  engage deeply" list is the pattern to adopt (see `MECHANISMS.json:blocking-question-template-with-budget`
  and `blindspot-pass` for the two branches this gate protects).
- Named triggers per optional branch (blindspot pass, domain-modeling files, subagent role split,
  formal quiz) rather than an implicit "always do the full thing" default — this is what keeps the
  `CONTEXT-STRATEGY.md` file-sprawl risk in check.

Neither source offers a routing mechanism for the one thing SiteSmith actually needs most routing
help with: deciding *which visual/style direction* applies to a given brief. That gap is
`notApplicable` territory — see `VERDICT.md`.
