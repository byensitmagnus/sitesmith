---
title: "Task-Contracts Autopsy — Overview"
ai_generated: "(C)"
---

# Overview

This autopsy covers two sources checked out under one temp directory. All citations below use paths
relative to that root:

```
BASE = C:\Users\Usmo1\AppData\Local\Temp\claude\C--Users-Usmo1-Documents-sitesmith\
       60a368a9-e3a0-4ebc-aadf-386ee1a4a75a\scratchpad\upstream\
```

So `ai-dev-tasks/create-prd.md:9-13` means `BASE\ai-dev-tasks\create-prd.md` lines 9-13.

## Source 1 — `ai-dev-tasks`

- Repo: `snarktank/ai-dev-tasks`, licence Apache-2.0 (full text at `ai-dev-tasks/LICENSE`).
- **Total footprint: 4 files, 130 KB, of which 3 are markdown text** (`create-prd.md` 81 lines,
  `generate-tasks.md` 70 lines, `README.md` 131 lines) plus `LICENSE`. No code, no scripts, no config.
- Entry point: `README.md` describes a 3-step human workflow (PRD → tasks → sequential
  implementation with review checkpoints). The two markdown files are the actual "prompts" a human
  pastes into an AI coding tool — they are not invoked programmatically; there is no router, no
  manifest, no frontmatter. This is a **prompt pair**, not a skill package.
- Read in full: `create-prd.md`, `generate-tasks.md`, `README.md`, `LICENSE`.

## Source 2 — `before-implementing`

- Local folder name is `before-implementing`, but its actual content is one plugin:
  `nicobailon/grill-for-unknowns` v0.1.3, licence MIT.
- **Total footprint: 18 files, 204 KB.** Layout: repo-root distribution wrapper
  (`.claude-plugin/marketplace.json`, `package.json`, `README.md`, `CHANGELOG.md`, `NOTICE.md`,
  `LICENSE`) around one plugin at `plugins/grill-for-unknowns/` containing `SKILL.md` (239 lines,
  the entry point), a plugin-scoped `README.md`/`LICENSE`, `.claude-plugin/plugin.json`, two
  reference files (`references/upstream-lineage.md`, `references/domain-modeling-add-on.md`), and
  five templates (`ADR.md`, `CONTEXT.md`, `grill-session.md`, `implementation-notes.md`,
  `launch-packet.md`).
- Entry point read in full: `plugins/grill-for-unknowns/SKILL.md`. It routes explicitly to
  `references/domain-modeling-add-on.md` (for `CONTEXT.md`/ADR rules) and to the five files under
  `templates/` (for session ledgers, launch packets, implementation notes). All were read in full.
  `references/upstream-lineage.md` documents its own lineage and includes maintainer-only authoring
  notes (explicitly marked "not runtime behavior").

### Is this the artifact the requester meant?

The task brief names the contract as "investigate-before-asking, goal restatement, blocking
questions, assumptions, proportional planning, approval gates, stop-on-invalidated-assumption" and
flags `grill-for-unknowns` as an unconfirmed candidate. Having read the whole package: **yes, this
is a genuine, direct implementation of that contract, not something wearing a similar name.**
Concrete matches, each with a citation:

| Contract term | Where it lives |
| --- | --- |
| investigate-before-asking | "Gather evidence first" step, `SKILL.md:78-88` |
| goal restatement | "Restate the map" step 1, `SKILL.md:52` |
| blocking questions | Blocking-question template, `SKILL.md:110-118` |
| assumptions | "Resolved assumptions" ledger + defaults, `SKILL.md:57-58`, `templates/grill-session.md:81-83` |
| proportional planning | "When to Use" / "Do not use when" scoping, `SKILL.md:27-42` |
| approval gates | "Ask for confirmation before build", `SKILL.md:61` |
| stop-on-invalidated-assumption | Deviation policy, `SKILL.md:182-186` |

It is a fork/adaptation (not an original invention) of three Matt Pocock skills
(`grill-with-docs`, `grilling`, `domain-modeling`) plus one uncredentialed public article by Thariq
— this lineage is disclosed by the package itself in `references/upstream-lineage.md:1-22` and
`README.md:141-165`, and the MIT `LICENSE` correctly carries both Matt Pocock's and Nico Bailon's
copyright lines. Nothing about the naming is misleading once the content is read; the confusion is
purely that the local folder name (`before-implementing`) differs from the package/repo name
(`grill-for-unknowns`).

## Files in this autopsy

`WORKFLOW-MAP.md`, `MECHANISMS.json`, `GOOD-PATTERNS.md`, `FAILURE-MODES.md`,
`CONTEXT-STRATEGY.md`, `ROUTING.md`, `LOOPS.md`, `TESTING.md`, `LICENSE.md`, `VERDICT.md`.
