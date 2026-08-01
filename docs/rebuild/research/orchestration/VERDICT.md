---
title: Verdict — orchestration sources for SiteSmith v3
ai_generated: "(C)"
---

# Verdict

**Headline: this whole group is mostly not applicable.** All four sources are
built for coordinating multiple agents (a "fleet") or for a domain unrelated to
website building (knowledge graphs). SiteSmith v3 is one skill run by one host
agent per site. Judged against the two measured facts — the 55-line
frontend-design skill beat SiteSmith's 630k-token package 59-40, and three
unrelated SiteSmith briefs converged on one house style (showcase 0/8) — the
verdict is:

- Mechanisms that make the model **think better in one pass** (a review
  checklist, a self-review procedure, a fresh-context re-read): **adapt**, small
  and cheap.
- Mechanisms that only work **across multiple coordinated agents or sessions**
  (swarms, orchestrators, persistent cross-session memory, role taxonomies):
  **reject**, out of scope by the brief's own framing, and in the case of
  persistent memory, actively pointed at the wrong side of the house-style
  problem.
- Mechanisms that are **long noun-lists standing in for judgment** (most of
  `awesome-claude-code-subagents`' `ui-designer.md`): **reject**, direct
  supporting evidence for why the small skill won.

## Adopt / adapt (4)

1. **Finish-Gate design contract** (`agency-agents/design/design-ui-finish-gate-reviewer.md`)
   — a one-paragraph product lens + named forbidden-defaults list + PASS/HOLD
   gate. Cheap, single-pass, and aimed directly at the convergence problem
   SiteSmith already measured against itself.
2. **Persona walkthrough** (`agency-agents/design/design-persona-walkthrough.md`)
   — scroll-by-scroll first-read simulation against LIFT/Cialdini/Fogg. Useful
   as an optional QA step for conversion-oriented briefs specifically, not every
   site type.
3. **Fresh-context review** (`graph-engineering/references/task-graphs.md:40-44`)
   — run the audit pass without the generation transcript in context. Free to
   do, no fleet required, strengthens the existing `scripts/verify.mjs` gate
   rather than replacing it.
4. **Design-bridge extraction checklist** (`awesome-claude-code-subagents/.../design-bridge.md`)
   — when a brief names a specific existing product to emulate, extract theme/
   palette/typography/components/layout/elevation/responsive rules from what is
   actually observable before writing code, and ask rather than invent for gaps.
   Narrowest of the four: only fires on "match this specific brand" briefs.

## Reject (7), with reason

- **ruflo / claude-flow** (whole platform) — its own `SKILL.md:21` says not to
  use it for tasks "a single agent can complete in one turn." Textbook
  out-of-scope by the source's own admission.
- **ruflo's persistent vector memory** — separated out for emphasis: this is
  not neutral-but-unnecessary, it is actively the wrong direction. Cross-session
  memory of "what a site should look like" is the mechanism class that produced
  showcase 0/8 the first time.
- **agency-agents' `agents-orchestrator.md`** — PM→Architect→Dev/QA pipeline
  across spawned agents. Nothing to orchestrate with one skill.
- **agency-agents' ~200-file role taxonomy** — persona files meant to be
  addressed by name in a multi-agent runtime; no role for a persona system in a
  single skill.
- **`awesome-claude-code-subagents` category 09 (meta-orchestration)** — six
  files (agent-organizer, multi-agent-coordinator, task-distributor,
  workflow-orchestrator, context-manager, codebase-orchestrator), all fleet
  machinery, rejected as a category.
- **`awesome-claude-code-subagents/.../ui-designer.md`** — kept only as a
  negative example: bullet-list padding with no concrete technique or
  threshold, plus a hard dependency on a "context-manager" subagent that
  doesn't exist in a single-skill setup. Direct evidence for the measured
  result, not a mechanism to import.
- **graph-engineering's knowledge-graph half and its diamond/fan-out half** —
  the KG pipeline has no object to act on in a website-building skill (no
  entities/relations to extract); the diamond/fan-out pattern is fleet
  machinery that, even if in scope, duplicates this project's own
  `context-diamond` skill exactly.

## Bottom line

Four sources, four small extractable ideas, none of them structural. The
group's real value to this rebuild is negative-space confirmation: every one of
these repos assumes a fleet or a memory store exists, and none of that changes
what a single skill should do when a host agent calls it once per site.
