---
title: OVERVIEW — ponytail
ai_generated: "(C)"
---

# What it is

`ponytail` (DietrichGebert/ponytail, MIT) is a "lazy senior dev" skill: a decision ladder for
*not* over-building, injected into an agent's context so it questions every line before writing
it. It is the closest thing in this research set to a mechanism built to solve exactly SiteSmith's
own failure — 630k tokens of package that lost to 55 lines of prose.

# Size

- Repo total: 156 files, 3.1 MB on disk (`du -sh .`).
- Core reasoning artifact: `skills/ponytail/SKILL.md`, 120 lines, 6,757 characters (~1,690 tokens
  at 4 chars/token).
- Five companion one-shot skills (`skills/ponytail-{review,audit,debt,gain,help}/SKILL.md`):
  41 + 44 + 50 + 71 + 57 = 263 lines total, each under 71 lines.
- Delivery/portability plumbing: `hooks/` (6 JS files, 788 lines), `scripts/` (6 files),
  `ponytail-mcp/`, `pi-extension/`, plus 13 platform-adapter directories
  (`.agents .claude-plugin .clinerules .codex-plugin .cursor .devin-plugin .kiro .openclaw
  .opencode .qoder .qoder-plugin .windsurf` + `.github/copilot-instructions.md`).
- `package.json` (root): 0 runtime `dependencies` (`grep -c "dependencies" package.json` → 0).
  `node --test` is the whole test runner.

# Entry point

`skills/ponytail/SKILL.md` is the model-facing entry point when installed as a Claude Code/Codex
plugin skill. For instruction-only hosts (Cursor, Windsurf, Kiro, Copilot, Amp, Jules, Junie …) the
same ruleset is duplicated into `AGENTS.md` and per-host rule files, kept in sync by
`scripts/check-rule-copies.js`.

# Shape of the package

Two clearly separable halves:

1. **The reasoning artifact** — one markdown skill (SKILL.md) encoding a 7-rung decision ladder
   (YAGNI → reuse → stdlib → native → installed dep → one-liner → minimum code), plus explicit
   "never simplify away" carve-outs (validation, error handling, security, accessibility) and a
   `ponytail:` comment convention for marking deliberate shortcuts. Five sibling skills apply the
   same lens to review, whole-repo audit, debt-ledger harvesting, and a benchmark scoreboard
   display — each single-purpose and one-shot.
2. **The delivery machinery** — hooks, plugin manifests, and per-platform rule-file copies whose
   only job is getting the *same* prose in front of ~20 different agent hosts. None of this
   machinery makes a design or code decision; it copies text and tracks a `lite/full/ultra/off`
   mode flag for a statusline badge (`hooks/ponytail-activate.js:34-39`,
   `hooks/ponytail-mode-tracker.js:64-81`).

# What is conspicuously present that SiteSmith lacks

- A **real, execution-based correctness gate** (`benchmarks/correctness.js`) that runs generated
  code against test cases per task, so "less code" claims cannot mean "broken code."
- A **self-validating LLM judge** (`benchmarks/agentic/judge.py:120-137`) that refuses to score a
  real run until it first proves it can rank a deliberately over-engineered reference above a
  minimal one for the same task.
- A published, walked-back **honesty correction**: the original single-shot benchmark (80-94% less
  code) was re-run against a real Claude Code agent instead of a chatty bare model after a critic
  (issue #126) pointed out the baseline was inflated; the corrected number (~54% mean, 0% on
  already-minimal code) is published alongside the original with the correction explained
  (`benchmarks/results/2026-06-18-agentic.md:1-24`, `README.md:64-71,84`).

# What is conspicuously absent

- No visual/design output at all — ponytail is a general coding-discipline skill, not a
  website-builder. Nothing here routes a stack, picks a palette, or lays out a page.
- No mechanism analogous to SiteSmith's "house style" problem: ponytail's success metric is line
  count and correctness, not visual distinctiveness, so it has nothing to say about convergent
  output — see `notApplicable`.
