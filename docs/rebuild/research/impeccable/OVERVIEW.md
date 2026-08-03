---
title: "Impeccable — Overview"
ai_generated: "(C)"
---

# What it is

`pbakaus/impeccable` (Apache-2.0) is a multi-runtime frontend-design skill/CLI hybrid, not a single skill file. It installs itself into ~14 different agent-tool directories (`.claude`, `.agents`, `.codex`, `.cursor`, `.gemini`, `.kiro`, `.opencode`, `.pi`, `.qoder`, `.rovodev`, `.trae`, `.vibe`, ...) that all mirror the same source in `skill/`. The canonical source lives at `skill/SKILL.src.md` + `skill/reference/*.md` + `skill/scripts/*.mjs`, and a template compiler stamps out the per-tool copies (`{{scripts_path}}`, `{{command_prefix}}` placeholders in the source, resolved at install time — see `skill/SKILL.src.md:4-9`).

# Size

- Repo total: 59M / 2967 files, but almost all of that is the `cli/` (1.1M), `plugin/` (3.3M), `tests/` (3.4M) and per-tool install mirrors, not the skill's own logic.
- The skill core a rebuilder actually needs: `skill/SKILL.src.md` (11,190 chars), `skill/reference/*.md` (~40 files), `skill/scripts/*.mjs` (~40 Node scripts, largest is `hook-lib.mjs` at 2,100 lines and `cli/engine/rules/checks.mjs` at 5,580 lines — the mechanical antipattern detector).
- `NOTICE.md` (Apache-2.0 third-party notice) — one derivative source declared: `ios.md`/`android.md` distilled from `ehmo/platform-design-skills` (MIT).

# Entry point

`skill/SKILL.src.md` — the only file every invocation reads. Frontmatter names the trigger description and `allowed-tools` (`Bash(npx impeccable *)`, `Bash(node {{scripts_path}}/*)`). Body is a ~90-line dispatcher: Setup (3 steps) → How to design (4 rules) → Modes (4 registers) → Commands table (20 named sub-commands, each pointing at its own `reference/*.md`) → Routing rules → Pin/Hooks/Doctor pointers.

# Shape of the package

1. **Skill layer** (`skill/`): the markdown playbook + Node helper scripts a coding agent runs as `Bash` tool calls. This is the part worth reverse-engineering.
2. **CLI/engine layer** (`cli/`): a standalone `npx impeccable` Node CLI. Contains the actual mechanical antipattern detector (`cli/engine/rules/checks.mjs`, 5,580 lines / 59 registered rules in `cli/engine/registry/antipatterns.mjs`), a static-HTML analysis engine, a CSS-cascade resolver, and a headless-browser detector variant. The skill's `scripts/detect.mjs` is a 21-line shim that `import()`s this engine.
3. **Plugin layer** (`plugin/`): Claude-Code-plugin packaging (`plugin/.claude-plugin/plugin.json`, `plugin/hooks/hooks.json`) — wraps the same agents/hooks as an installable plugin instead of a skill.
4. **External service dependency**: several mechanisms (`concept-seed.mjs`, `serve-question.mjs`, update-check) call `https://impeccable.style/api/*` for catalog data (concept/composition libraries) that "does not ship with the skill" (`concept-seed.mjs:97`). Offline/degraded fallbacks exist but are explicitly weaker.

# What matters most (per the brief)

- Routing: `SKILL.src.md` §Commands/Routing + `reference/routing.md` (context-aware menu, never auto-runs).
- Modes: `SKILL.src.md` §Modes (Persuade/Operate/Read/Experience).
- Preserve vs redesign: `SKILL.src.md` §How to design + `reference/new-work.md` §1.
- Critique: `reference/critique.md` (dual isolated sub-agents, mandatory detector, persisted snapshot + trend).
- Audit: `reference/audit.md` (5-dimension scored report, no fixing).
- Bounded polish: `reference/polish.md` + `new-work.md` §7 (2-round finish ceiling).
- Hardening: `reference/harden.md` (i18n/edge-case checklist).
- Craft floor: `reference/craft-floor.md` (verify list + refuse/ban list).
- Responsive adaptation: `reference/adapt.md` (context-rethink, not scaling).

See `WORKFLOW-MAP.md`, `MECHANISMS.json`, `LOOPS.md`, `ROUTING.md` for the traced detail.
