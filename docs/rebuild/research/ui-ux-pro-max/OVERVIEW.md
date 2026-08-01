---
title: "UI/UX Pro Max — Overview"
ai_generated: "(C)"
---

# What it is

`nextlevelbuilder/ui-ux-pro-max-skill` @ `4857a2c5` is a Claude Code **plugin bundle**, not a single
skill: `.claude-plugin/marketplace.json` + `.claude-plugin/plugin.json` register six skills
(`ui-ux-pro-max`, `ui-styling`, `design`, `design-system`, `brand`, `slides`, `banner-design`). The
one matching this task's brief (product categories, style/palette/font databases, UX rules, stack
guidance, design-system generation) is **`ui-ux-pro-max`** — the rest are adjacent tools (shadcn/
Tailwind reference, brand-guideline templates, slide decks, banners) bundled in the same repo and
out of scope here except where they touch the same mechanism.

Repo size: 23 MB total, but 6.2 MB is a git pack and ~15 MB is bundled `.ttf`/`.png` font/screenshot
assets for the *sibling* `ui-styling` and `slides` skills. The `ui-ux-pro-max` skill itself is small:
`.claude/skills/ui-ux-pro-max/{SKILL.md,data/*.csv,scripts/*.py,references/*.md}` — the data files
total ~180 KB of CSV (2,989 non-header rows across 22 files, `google-fonts.csv` alone is 1,924 rows
/ 728 KB and is really a Google Fonts export, not curated content).

## Entry point

`.claude/skills/ui-ux-pro-max/SKILL.md` (197 lines). Frontmatter `description` is the trigger the
host model matches against; the body is a workflow doc, not code.

## Package shape

The repo has **three parallel copies** of the same `data/` + `scripts/`, kept in sync by a build
step, not by symlinks (symlinks break on git-for-Windows checkouts, per `CLAUDE.md:77-80`):

- `src/ui-ux-pro-max/` — source of truth (edited directly)
- `cli/assets/` — bundled into the `ui-ux-pro-max-cli` npm package (`uipro init`)
- `.claude/skills/ui-ux-pro-max/` — the actual Claude Code skill folder, mirrored by
  `cli/scripts/sync-assets.mjs` and checked by a "Check asset sync" CI job

`src/ui-ux-pro-max/templates/` also generates 17 other `platforms/*.json` configs (Cursor, Copilot,
Windsurf, Gemini CLI, etc.) from the same base content — this is a multi-IDE distribution mechanism,
not a design mechanism, and out of scope.

## Core mechanism, one sentence

A BM25 keyword search (`scripts/core.py`) over 12 flat CSV "databases" plus 22 per-stack CSVs,
composed by `scripts/design_system.py` into one deterministic recommendation object (pattern +
style + colors + typography + effects + anti-patterns), rendered to ASCII/Markdown and optionally
persisted as `design-system/<project>/MASTER.md`.

## What's genuinely separate and worth noting

`stack/` (root-level, not inside `.claude/skills/`) is a **different artifact**: a starter repo
showing how a *consuming* project would wire `ui-ux-pro-max` together with a `design-review`
subagent (real Playwright browser review) and a `design-audit.mjs` heuristic script. It is the
closest thing in this repo to a verification loop — see `LOOPS.md` and `TESTING.md`.

## Licence

Root `LICENSE` = MIT, "Next Level Builder", 2024. Matches the brief's `licence: MIT` field —
verified against the actual file, not assumed. See `LICENSE.md`.
