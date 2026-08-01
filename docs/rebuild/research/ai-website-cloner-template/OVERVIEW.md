---
title: OVERVIEW — ai-website-cloner-template
ai_generated: "(C)"
---

# What it is

`ai-website-cloner-template` (JCodesMore/ai-website-cloner-template, MIT) is a GitHub template repo
for a pre-scaffolded Next.js 16 + shadcn/ui + Tailwind v4 project (`package.json:1-49`) whose entire
purpose is to host one slash-command skill, `/clone-website`. The skill's job is not to design a
new site — it is to reverse-engineer an existing live URL, section by section, into a fresh
Next.js codebase, dispatching parallel "builder" sub-agents in git worktrees as extraction proceeds
(`.claude/skills/clone-website/SKILL.md:14`). This is the closest thing in the research set to a
reference-extraction pipeline: the whole file is about *measuring* an existing site accurately, not
about generating an original one.

# Size

- `.claude/skills/clone-website/SKILL.md`: 474 lines — the entire mechanism.
- Repo total: 61 files (excluding `.git`), 2.7 MB on disk (`du -sh`).
- No `src/` implementation of the extraction/build pipeline exists — `src/` is just the bare
  Next.js/shadcn scaffold (`layout.tsx`, `page.tsx`, one `button.tsx`, `globals.css`, `utils.ts`).
  There is no compiled tool, no extraction library, no pixel-diff script anywhere in the repo.

# Entry point

`.claude/skills/clone-website/SKILL.md` is the canonical source. Everything else in the repo that
looks like a "different platform's version" of the skill (`.codex/skills/clone-website/SKILL.md`,
`.github/skills/clone-website/SKILL.md`, `.cursor/commands/clone-website.md`,
`.windsurf/workflows/clone-website.md`, `.gemini/commands/clone-website.toml`,
`.opencode/commands/clone-website.md`, `.augment/commands/clone-website.md`,
`.continue/commands/clone-website.md`, `.amazonq/cli-agents/clone-website.json`) is a generated copy,
produced by `scripts/sync-skills.mjs`, which logs "9 platform command files generated from source
skill" (`scripts/sync-skills.mjs:112`). A second, parallel sync system
(`scripts/sync-agent-rules.sh`) regenerates project-instruction files (`.github/copilot-instructions.md`,
`.clinerules`, `.continue/rules/project.md`, `.amazonq/rules/project.md`) from `AGENTS.md`, resolving
a Claude-Code-style `@file` import syntax (`AGENTS.md:65` imports `docs/research/INSPECTION_GUIDE.md`)
into inlined content (`scripts/sync-agent-rules.sh:34-49`).

# Shape of the package

Five sequential phases inside `SKILL.md`, framed explicitly as *not* two-phase ("inspect then
build") but interleaved — a "foreman walking the job site" who writes a spec, hands it to a builder,
and keeps walking (`SKILL.md:14`):

1. **Pre-Flight** — browser-MCP tool detection, URL validation, directory setup (`SKILL.md:27-33`).
2. **Reconnaissance** — screenshots at 2 viewports, global token extraction (fonts/colors/favicons),
   a mandatory scroll/click/hover/responsive "interaction sweep," and a page-topology map
   (`SKILL.md:120-176`).
3. **Foundation Build** — sequential, non-delegated: fonts, `globals.css` tokens, TypeScript types,
   deduplicated SVG icon components, an asset-download script (`SKILL.md:178-227`).
4. **Component Specification & Dispatch** — the core loop: extract → write a per-component spec
   file → dispatch a builder agent in a git worktree → merge (`SKILL.md:229-403`).
5. **Assembly & Visual QA Diff** — wire sections into `page.tsx`, then a side-by-side comparison pass
   against the live site (`SKILL.md:405-429`).

Bookended by a mechanical "Pre-Dispatch Checklist" gate (`SKILL.md:431-444`) and a named list of
"lessons from previous failed clones" (`SKILL.md:446-462`).

# What is conspicuously absent

- **No automated fidelity measurement.** Phase 5 ("Visual QA Diff") is pure prose instruction to
  look at two screenshots and compare them by eye (`SKILL.md:415-429`) — there is no pixel-diff
  tool, no similarity score, no threshold, anywhere in the 61 files of this repo.
- **No pre-built extraction tooling.** The `getComputedStyle()` extraction snippet
  (`SKILL.md:239-283`) and the asset-enumeration snippet (`SKILL.md:193-225`) are JavaScript the
  *agent* is instructed to construct and run live via browser MCP each time — nothing is checked
  into `scripts/` except the two sync scripts and empty `.gitkeep` placeholders.
- **No accessibility, SEO, or performance auditing** — explicitly out of scope by the skill's own
  defaults (`SKILL.md:22`).
