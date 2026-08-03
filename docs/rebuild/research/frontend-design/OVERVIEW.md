---
title: OVERVIEW — frontend-design
ai_generated: "(C)"
---

# What it is

`frontend-design` is a single Markdown prompt (a Claude "skill") with no code, no scripts, no
reference files, and no conditional file tree. The entire mechanism is prose injected into the
model's context that reframes how it should reason about a UI/design task.

# Size

- `SKILL.md`: 55 lines, 8,315 characters (~2,079 tokens at 4 chars/token), including YAML frontmatter.
- `LICENSE.txt`: 177 lines, Apache-2.0 full text, no NOTICE file present.
- Total package: 24 KB on disk, 2 files, 0 subdirectories.

# Entry point

`SKILL.md` (`frontend-design/SKILL.md:1-55`) is the only entry point and the only file. There is no
manifest, no `scripts/`, no `references/`, no `assets/`. YAML frontmatter (`SKILL.md:1-5`) declares
`name`, `description`, and a `license` pointer to `LICENSE.txt`.

# Shape of the package

Six prose sections, read top to bottom, no branching:

1. Framing / persona ("design lead at a small studio") — `SKILL.md:9`
2. Ground it in the subject — `SKILL.md:11-13`
3. Design principles (hero, type, structure, motion, complexity, copy) — `SKILL.md:15-27`
4. Process: brainstorm → explore → plan → critique → build → critique again — `SKILL.md:29-39`
5. Restraint and self-critique — `SKILL.md:41-43`
6. More on writing in design — `SKILL.md:45-55`

Nothing here is a template, a script, or a lookup table. There is no decision tree the model
executes; there is no code the model calls. Every instruction is aimed at the model's own
judgment: "state your choice," "revise that part, say what you changed," "question if choices ...
actually make sense." This is the mechanism worth understanding — see `VERDICT.md`.

# What is conspicuously absent

- No verification script, no test harness, no screenshot pipeline shipped in the package itself
  (the SKILL text tells the model to take its own screenshots "if your environment supports it,"
  `SKILL.md:43`, but supplies no tool to do so).
- No token budget, no stack routing, no component library.
- No NOTICE file, despite Apache-2.0 permitting one.
