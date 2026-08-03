---
title: CONTEXT-STRATEGY — ai-website-cloner-template
ai_generated: "(C)"
---

# Always-loaded vs conditional

`SKILL.md` (474 lines) is the entire always-loaded body once `/clone-website` triggers — there is
no internal progressive disclosure, no "read section X only if Y" branch inside the file itself. The
frontmatter `description` (`SKILL.md:3`) is the only pre-load signal, operating at the harness's
skill-selection layer, same as every other source in this research set.

What *is* conditional, unusually, is not inside the skill file but generated per run onto the
filesystem: `docs/research/BEHAVIORS.md`, `docs/research/PAGE_TOPOLOGY.md`, and one
`docs/research/components/<name>.spec.md` per component are all produced during execution and then
read back into builder-agent prompts as inline content (`SKILL.md:112,385-390`). This is a
progressive-disclosure pattern turned inside-out: instead of the skill selectively loading
pre-written reference material, the agent selectively writes new reference material as it goes,
then immediately inlines exactly the slice each builder needs — no builder ever reads a shared
document, each gets only its own spec file's contents.

`docs/research/INSPECTION_GUIDE.md` (80 lines) is the one piece of genuinely static conditional
content: it is not read by `/clone-website` at all, but is imported wholesale into `AGENTS.md` via
`@docs/research/INSPECTION_GUIDE.md` (`AGENTS.md:65`), which itself loads into whichever
platform's always-on project-instruction context that platform uses (`CLAUDE.md`, `.clinerules`,
`.continue/rules/project.md`, etc.). This makes it *always*-loaded for any agent that reads project
instructions, not conditionally loaded — and, per `FAILURE-MODES.md`, describing an output shape the
actual skill doesn't produce.

# Token cost estimate

Method: character count / 4 (rough tokens-per-character heuristic).

- `.claude/skills/clone-website/SKILL.md`: 474 lines. Character count not independently reduced to a
  precise figure here, but at the file's own line density this is a large multi-thousand-token
  always-loaded body once the skill triggers — an order of magnitude larger than `frontend-design`'s
  55-line, ~2,079-token file, for a fundamentally different task shape (a five-phase extraction
  pipeline with a literal spec-file template versus a single-pass design lens).
- `docs/research/INSPECTION_GUIDE.md`: 80 lines, always inlined into every platform's project
  instructions via `AGENTS.md:65` — genuinely always-loaded overhead for a document that (per
  `FAILURE-MODES.md`) no longer matches the active pipeline.
- Per-run generated content (`BEHAVIORS.md`, `PAGE_TOPOLOGY.md`, per-component `.spec.md` files) is
  variable and scales with the target site's complexity — a large multi-section marketing site could
  generate many thousands of tokens of spec content across the run, each slice inlined only into its
  own builder's prompt rather than shared globally.

# Implication for our design

The core idea worth keeping is real progressive disclosure by *generation*: instead of a fixed
reference library the model consults selectively, the audit step writes exactly the reference
material each downstream consumer needs and inlines only that slice — no consumer ever holds more
context than its own unit of work requires. This is different in kind from SiteSmith's own rejected
630k-token static package: a generated, per-target, per-component spec is bespoke measured content,
not a pre-baked style library applied uniformly regardless of target. The risk to avoid is the
`INSPECTION_GUIDE.md` failure mode — a static reference file that gets imported into always-on
project instructions and then silently drifts out of sync with what the active pipeline actually
does; any reference content SiteSmith keeps must be checked against its current workflow, not
grandfathered in because it was once correct.
