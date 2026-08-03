---
title: "Task-Contracts Autopsy — Context Strategy"
ai_generated: "(C)"
---

# Context Strategy

How each source manages what the model has to hold in its head, and at what token cost.

## ai-dev-tasks: two static prompt files, no progressive loading

There is no progressive-disclosure mechanism at all — `create-prd.md` (81 lines) and
`generate-tasks.md` (70 lines) are each loaded whole, every time, regardless of task size
(`ai-dev-tasks/create-prd.md:1-81`, `generate-tasks.md:1-70`). The only context-cost control is
external to the files themselves: the two-phase gate (`generate-tasks.md:17-18`) delays generating
the expensive, detailed sub-task content until the cheap parent-task list is confirmed. That is a
*sequencing* discipline, not a loading discipline — both files are still fully in context from the
start of each phase.

State persistence is minimal and cheap: the task list markdown file itself carries all execution
state via checkbox flips (`generate-tasks.md:43-50`), with no separate database or JSON. For a
package this small (151 lines of instruction total across both files), the context cost is
negligible regardless of loading strategy — this is not a mechanism to imitate for cost control, it
just never had a cost problem to solve.

## before-implementing: conditional depth via "when to use" gating and lazy file creation

`SKILL.md` (239 lines) is the only file guaranteed to load. Everything else is genuinely
conditional:

- `references/domain-modeling-add-on.md` and the ADR/CONTEXT.md templates load only "when a
  grill-for-unknowns session reveals fuzzy terminology... or durable architectural/product
  decisions" (`references/domain-modeling-add-on.md:3`) — and the files themselves are created
  lazily, "do not add ... until there is something worth recording" (line 34).
- `templates/grill-session.md` loads only "when the session is complex enough to need a durable
  working doc" (`SKILL.md:54`).
- `templates/launch-packet.md` loads only "before spawning a subagent or external coding agent"
  (`SKILL.md:201-203`).
- The blindspot pass itself only runs "when the user is entering an unfamiliar domain, unfamiliar
  part of the codebase, or high-stakes integration" (`SKILL.md:136`).
- The whole skill has an explicit off-switch: "Do not use when: the task is trivial, mechanical, or
  already has unambiguous acceptance criteria... You can verify the right answer directly with a
  single tool call and no interview is needed" (`SKILL.md:38-42`).

This is a real progressive-loading pattern: one compact entry point plus several genuinely optional
extensions, each gated on a stated trigger condition rather than always-loaded. It is also the
opposite shape from the losing 630k-token SiteSmith package, which the task brief describes as
139 files — the difference is not "fewer files" per se, it's that every optional file here has an
explicit, checkable trigger for why it loaded, rather than being part of an always-on package.

## Implication for the SiteSmith rebuild

Adopt the trigger-gated shape (`SKILL.md:27-42, 54, 136, 201-203`), not the file count. A single
compact `SKILL.md`-equivalent should carry the whole hot-path loop (question bar, unknowns routing,
deviation policy, calibration principle — see `MECHANISMS.json:self-contained-packaging-lesson`),
with reference material (detailed ADR formatting, multi-agent launch packets, formal quiz templates)
split into files that only load when their own stated trigger condition is true. The `checkbox-state-in-file`
and `domain-modeling-context-adr` mechanisms (see `MECHANISMS.json`) are the two highest-risk items
for silently drifting back into always-on file sprawl if the trigger conditions are dropped during
implementation — see `FAILURE-MODES.md` for both.
