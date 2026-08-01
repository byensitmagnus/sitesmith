---
title: Orchestration sources — scan for SiteSmith v3 rebuild
ai_generated: "(C)"
---

# Orchestration group — proportionate scan

Question asked of every source: does anything here make a SINGLE skill produce a
better website? Delegation machinery that only pays off when running a fleet of
agents is out of scope by the brief and is rejected on sight, with the reason
stated. All four sources here are, at their core, fleet/role-taxonomy platforms —
so the honest finding for this group is mostly **not applicable**, with a small
number of genuinely portable techniques pulled out where they exist independent
of the delegation machinery around them.

## agency-agents (msitarzewski/agency-agents, MIT)

343 files, 6.8 MB. Entry point: `README.md` — a catalogue of ~200 "agent
personality" markdown files across 15 divisions (engineering, design, marketing,
sales, security, specialized, game-development, academic, gis, …), installed via
`scripts/install.sh` into `~/.claude/agents/` for Claude Code, Cursor, Codex, etc.
`specialized/agents-orchestrator.md` (366 lines) is the coordinator: it runs a
`PM → ArchitectUX → [Dev ↔ QA Loop] → Integration` pipeline, spawning other agent
files as subagents with JSON status handoffs and retry limits
(`specialized/agents-orchestrator.md:9-16`, `:60`). This is fleet machinery by
design — reject wholesale, reason: only pays off across multiple coordinated
agent processes, not inside one skill.

Most of the `design/` division's ten agent files follow the same template
(Identity → Mission → Critical Rules → Workflow → Deliverables → Communication
Style) built for a *persona a human addresses directly* ("Hey Claude, activate
Frontend Developer mode"), not for a skill a host agent loads silently. Two files
break that pattern and contain a genuine single-pass procedure with no
delegation dependency:

- **`design/design-ui-finish-gate-reviewer.md`** (218 lines) — a pre-ship review
  protocol built specifically to catch generic, interchangeable UI: write a
  one-paragraph "product lens" (who/what job/what repeats), collect 3-5
  comparable reference patterns, fill a **Design Contract** template naming the
  density decision, hierarchy, interaction model, and explicit **forbidden
  defaults** for this product (`:106-123`), then run a pass/fail **Finish Gate**
  against the implementation (`:125-165`) with a hard PASS/HOLD verdict, never a
  vague list. This is a solo procedure — one context, one pass, no other agent
  required to execute it. It targets exactly the failure SiteSmith already
  measured (showcase 0/8, convergent house style): naming the product-specific
  choices and the forbidden generic defaults is a countermeasure to convergence,
  not a lookup table that produces it.
- **`design/design-persona-walkthrough.md`** (273 lines) — a structured
  cognitive-walkthrough technique: build one persona profile (psychology,
  search intent, attachment style), then simulate a scroll-by-scroll reading of
  the page producing two voices per fold — raw persona monologue and a
  framework-grounded analyst note (LIFT, Cialdini, Fogg) — ending in a scored
  verdict and prioritised recommendations (`:59-152`). This is likewise a
  single-agent role-play technique, not a delegation mechanism; a solo skill can
  run this as a self-review pass after generating a page.

Everything else in `design/` (`design-ui-designer.md` is absent here but the
sibling repo below has an equivalent — see next section) and the other 13
divisions (marketing, sales, finance, game-development, spatial-computing,
academic, gis, …) has no bearing on building one website — it is role content
for unrelated domains, or restates the same identity/workflow template with
different nouns. Not applicable, not reproduced.

## ruflo (ruvnet/ruflo / "claude-flow", MIT)

122 MB, 5,491 files — the largest source, scanned only to its entry point per
instructions. `SKILL.md` (83 lines) and `package.json` are the mechanism: ruflo
is npm package `claude-flow`, described in its own manifest as "Enterprise AI
agent orchestration for Claude Code. Deploy 60+ specialized agents in
coordinated swarms with self-learning, fault-tolerant consensus, vector memory,
and MCP integration" (`package.json:9`). `SKILL.md:10-19` lists what it's for:
coordinated swarms, cross-agent handoffs, 314 MCP tools for swarm/agent-spawn/
hooks/task lifecycle, hierarchical/mesh swarm topology, a learned 3-tier model
router (deterministic codemod → Haiku → Sonnet/Opus), and 30+ plugins. Its own
documentation states the disqualifier for this project in plain text:

> "Do NOT suggest ruflo for one-shot edits, simple bug fixes, or tasks a single
> agent can complete in one turn — the orchestration overhead isn't worth it."
> (`SKILL.md:21`)

SiteSmith-as-rebuilt is exactly that: one skill, one agent, one turn per site.
Reject wholesale, reason given by the source itself.

One piece deserves a explicit, deliberate rejection rather than silent
omission: ruflo's persistent **vector memory** (`mcp__claude-flow__memory_*`,
HNSW-indexed semantic search across sessions, `SKILL.md:40`) sounds superficially
useful — "remember what worked last time." It is the opposite of useful here.
SiteSmith's own measured failure (three unrelated briefs converging on one house
style, showcase 0/8) is a symptom of exactly this pattern: past design choices
leaking into new, unrelated projects. Cross-session memory of "what a website
looks like" is a house-style engine, not a mitigation for one. Do not adopt any
form of persistent style/decision memory across unrelated site builds.

## awesome-claude-code-subagents (VoltAgent, MIT)

189 files, 2.1 MB. Entry point: `README.md` → `categories/`, ten numbered
categories (core-development, language-specialists, infrastructure,
quality-security, data-ai, developer-experience, specialized-domains,
business-product, **09-meta-orchestration**, research-analysis), each a plugin
with its own `.claude-plugin/plugin.json`. Category 09 is explicit fleet
machinery — `agent-organizer.md`, `multi-agent-coordinator.md`,
`task-distributor.md`, `workflow-orchestrator.md`, `context-manager.md`,
`codebase-orchestrator.md` — reject wholesale as a category, same reason as
ruflo and agency-agents' orchestrator.

`categories/01-core-development/ui-designer.md` (174 lines) is a useful negative
example rather than a source to adopt from: it is almost entirely noun-list
padding — "Motion design: Animation principles, Timing functions, Duration
standards, Sequencing patterns, Performance budget…" (`:104-112`), repeated for
dark mode, cross-platform consistency, QA, deliverables — with no concrete
technique, threshold, or worked example anywhere in the file, and its first
mandatory step is querying a "context-manager" subagent that does not exist in
a single-skill setup (`:12-25`). This is the token-heavy, lookup-table shape the
593-token frontend-design skill beat 59-40; it is direct supporting evidence for
"mechanisms that move a decision into a list are suspect," not a mechanism to
carry forward.

`categories/01-core-development/design-bridge.md` (128 lines) is the one file
in this repo with a portable idea, though it is built for multi-agent handoff
and depends on an external repo we do not have (VoltAgent/awesome-design-md).
Its actual technique, described in our own words rather than copied: when asked
to match an existing product's visual identity, extract a fixed checklist of
categories — visual theme/atmosphere, colour palette with named roles and
hover/active states, typography rules, component stylings, layout/spacing
rules, elevation/shadow system, responsive breakpoints — *before* writing any
implementation code, and treat guessing a missing category as an error rather
than an assumption to fill in silently (`:46-55`, `:83-90`). The checklist shape
is adoptable as an optional pre-generation step for "match this specific
reference site" briefs; the DESIGN.md external-repo dependency, the JSON status
protocol, and the handoff-to-other-agents framing are not (`:63-72`, `:122-127`).

## graph-engineering (codejunkie99/graph-engineering, MIT)

10 files, 206 KB — smallest source, read in full. `graph-engineering/SKILL.md`
declares two unrelated halves: (1) a 9-stage knowledge-graph pipeline (ontology
→ extraction → fusion → GraphRAG serving), a distillation of a university KG
course, entirely about entity/relation memory graphs — **not applicable**, a
website-building skill has no entities to model, extract, or fuse; and (2)
`references/task-graphs.md`, agent-orchestration patterns: fake-edge detection,
the "diamond pattern" (parallel workers → separate verifier → merge), the "stop
rule" (only split work that never reads its own siblings' results — sequential
work loses 39-70% of the time when split across agents, per the cited DeepMind ×
MIT study, `task-graphs.md:48-52`), and the human gate.

The diamond/fan-out pattern itself is fleet machinery and out of scope here —
notably, it is also already the exact mechanism behind this project's own
`context-diamond` skill, so there is nothing new to import even if it were in
scope. Reject as duplicate + out of scope. One narrower point inside it is worth
keeping separate from the fan-out framing, because it needs no fleet at all: "a
model grading its own work in its own context misses most of its own mistakes"
(`task-graphs.md:42-43`) — i.e., a second pass in a *fresh context* catches what
a same-context self-review does not. A single skill can act on this without
spawning any other agent — run the generation pass, then run a review pass
(e.g. the finish-gate procedure above) with a clean context and no memory of
having written the code. This is consistent with, not a source of, SiteSmith's
existing `scripts/verify.mjs` gate.
