---
title: "Verdict — packaging/UI sources"
ai_generated: "(C)"
---

# Verdict

Two adoptable ideas, both structural, neither a content asset: (1) a companion
reference doc that documents an API surface's exact shape to stop
hallucination, without encoding taste — from agent-elements; (2) a small
router file that links out to on-demand, mutually-independent reference docs
instead of inlining everything — from remotion-skills. Everything else here
either doesn't apply to SiteSmith's problem (agent-chat components, on a
target that has no agent/chat interface) or actively repeats the failure mode
the two measured facts warn against (a shared fixed catalog nudging every
output toward the same look; a lookup table standing in for judgement).

## Per-source

### agent-elements-21st
**Verdict:** Sound engineering, wrong domain by default. The registry +
companion-reference pattern (short doc, exact prop shapes, "no barrel
imports") is a legitimate anti-hallucination mechanism — it answers factual
questions about an API, not design questions, so it doesn't compete with the
model's judgement the way a design lookup table would.
**Best thing to steal:** the pairing of a real, buildable component source
with a short static reference doc that only documents shape, not taste.
**Most dangerous thing to copy:** treating "agent chat UI" as something every
SiteSmith build should be able to reach for. The task's own constraint is
correct: these 26 components render tool calls, plans, and MCP invocations —
they have no role on a site without an embedded agent interface, and pulling
them in as a default would be adding a dependency with no measurable value for
the overwhelming majority of briefs.

### remotion-skills
**Verdict:** The router pattern is elegant; the embedding machinery that
supports it is a maintenance liability, and the two are separable. Read
literally, the question "elegant composition or maintenance disaster" has two
different correct answers depending on which layer you're looking at.
**Best thing to steal:** a tiny top-level file (48 lines here) that is
nothing but a table of contents to on-demand reference docs, plus the
explicit design rule that each leaf technique is self-contained and
independently removable. This is the same shape as the 55-line
frontend-design file that beat SiteSmith's 630k-token package — small root,
expand only on demand.
**Most dangerous thing to copy:** the symlink-then-rename-to-REFERENCE.md
build pipeline that lets one sub-skill be embedded inside more than one
parent. Verified by content hash that ~25% of the shipped tree is duplicate
bytes of files that exist elsewhere in the same tree, held consistent only by
a script whose own `--check` mode exists because drift is an anticipated
failure. This solves a monorepo-of-many-skills problem SiteSmith does not
have, since SiteSmith is being rebuilt as one skill.

### magic-21st
**Verdict:** Contributes nothing. The repository is a ~220-line stdio↔HTTP
compatibility shim to a deprecated, now-paid, hosted API; there is no
component-generation logic, registry, or design data present to trace a
mechanism to. Confirmed by reading the entire source in full — `src/index.ts`
is the whole package's substance.
**Best thing to steal:** nothing.
**Most dangerous thing to copy:** depending on it at all — it hard-fails
permanently after one authentication rejection and has no offline fallback.

### website-builder-setup
**Verdict:** Two files, and that's the honest total: a README and a
144-line onboarding-wizard SKILL.md. No design content, no component data —
just shell commands to install three external dependencies (an unverifiable
global npm package, Framer Motion, and the deprecated 21st Magic proxy above),
with specific-sounding marketing counts (of palettes, font pairings, and
pre-built components) that describe those external dependencies, not
anything present in this repo.
**Best thing to steal:** the narrow onboarding-UX rule — one step at a time,
manual fallback on failure, don't halt the whole flow — if SiteSmith ever
grows a comparable external-install step. Nothing exists to attach it to
today.
**Most dangerous thing to copy:** presenting a large fixed external catalog
as the reason the output will look designed rather than generic. That is
precisely the lookup-table mechanism the frontend-design result argues
against, and a
catalog shared identically across every user of the skill is a more acute
version of the exact convergence problem (0/8 showcase) that motivated this
rebuild.

## Cross-cutting call

None of these four sources produced a mechanism that changes how well the
model reasons about a design brief — the thing that actually matters per the
two measured facts. The two adopted mechanisms are packaging hygiene (prevent
import hallucination; keep the entry file small and route on demand). That is
a legitimate, if modest, contribution. Nothing here should expand SiteSmith's
footprint, and nothing here should be treated as evidence for or against any
particular visual style.
