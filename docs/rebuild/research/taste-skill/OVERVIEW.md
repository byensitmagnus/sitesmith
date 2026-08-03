---
title: taste-skill — Overview
ai_generated: "(C)"
---

# What it is

`Leonxlnx/taste-skill` @ `e988add` — a public MIT repo (no `packageManager` lockfile committed) distributing **12 independent Agent-Skill packages** plus 3 image-generation-only skills, installable individually via `npx skills add --skill <name>` or as a whole plugin (`.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`). It is not a single pipeline — each `skills/*/SKILL.md` is a standalone, self-contained prompt file. There is no runtime router, no shared code, no build step for the skills themselves (`scripts/*.mjs` only convert README banner images to webp).

Total repo: 3.4M on disk (mostly `.git` + `assets/*.webp` binaries + `examples/*.webp`). Real skill content is ~13 markdown files totaling ~4,900 lines.

## Entry point

`skills/taste-skill/SKILL.md` (1,207 lines) is the flagship / default skill, install name `design-taste-frontend`, currently **v2 (experimental)**. This is the file evaluated in depth below. It fully self-contains: brief inference → dial config → design-system routing → architecture defaults → bias-correction rules → performance/a11y → dark mode → AI-tell bans → pattern vocabulary → redesign protocol → block-library contract (unimplemented) → out-of-scope → a ~70-item pre-flight checklist → vendored install-command/doc-link appendices.

## Package shape

```
skills/
  taste-skill/SKILL.md          <- v2, the entry point (1207 lines)
  taste-skill-v1/SKILL.md       <- superseded predecessor (226 lines), kept for pinning
  gpt-tasteskill/SKILL.md       <- GPT/Codex-tuned variant, fake "Python RNG" gimmick (74 lines)
  redesign-skill/SKILL.md       <- flat audit checklist for existing codebases (178 lines)
  soft-skill/SKILL.md           <- fixed "premium calm" aesthetic template (98 lines)
  minimalist-skill/SKILL.md     <- fixed Notion/Linear-style template, hardcoded hex (85 lines)
  brutalist-skill/SKILL.md      <- fixed Swiss/military aesthetic template (92 lines)
  output-skill/SKILL.md         <- anti-truncation prompt-engineering only, not design (49 lines)
  stitch-skill/{SKILL,DESIGN}.md<- repackages the same rules as a DESIGN.md for Google Stitch
  image-to-code-skill/SKILL.md  <- image-gen-first workflow for Codex (1229 lines)
  imagegen-frontend-web/mobile, brandkit/SKILL.md <- image-generation-only, no code output
research/laziness/               <- background essay on why LLMs truncate output (asserted, uncited)
```

Each `SKILL.md` carries YAML frontmatter (`name`, `description`) used for auto-triggering; the README documents install names separately from folder names.

## What routes to what

There is no routing at runtime. "Routing" happens at **install time** (user picks a skill folder via `npx skills add --skill X`) or at **trigger time** (the model matches the user's request against each skill's frontmatter `description` if multiple are installed). The flagship `taste-skill/SKILL.md` does not call out to any other file in the repo — it is fully self-contained. The other skills are parallel alternatives, not sub-routines. See `ROUTING.md` and `WORKFLOW-MAP.md`.

## Licence

MIT, `Copyright (c) 2026 Leonxlnx` (`LICENSE`, `.claude-plugin/plugin.json`). Fully redistributable with notice — see `LICENSE.md` for what that means for SiteSmith.
