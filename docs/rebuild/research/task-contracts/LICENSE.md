---
title: "Task-Contracts Autopsy — Licence"
ai_generated: "(C)"
---

# Licence

## ai-dev-tasks — Apache License 2.0

Full text at `ai-dev-tasks/LICENSE` (200 lines, standard Apache-2.0 boilerplate). No `NOTICE` file
is present in the repo. Redistribution requires: including the license, marking modified files as
changed, and retaining existing copyright/attribution notices (Apache-2.0 §4). No copyright header
is present in either `create-prd.md` or `generate-tasks.md` themselves — only the repo-level
`LICENSE` file carries the grant. Safe to adapt/redistribute mechanism descriptions with attribution
to `snarktank/ai-dev-tasks`; safe to quote short fragments verbatim with attribution per the
Apache-2.0 grant, though this autopsy paraphrases throughout rather than quoting.

## before-implementing (grill-for-unknowns) — MIT

Two-layer copyright, both preserved correctly:

- Repo-root `LICENSE` (`before-implementing/LICENSE:1-4`): `Copyright (c) 2026 Matt Pocock` and
  `Copyright (c) 2026 Nico Bailon` on separate lines — because the package is an explicit
  adaptation/fork of Matt Pocock's `grilling`/`domain-modeling`/`grill-with-docs` skills, not an
  original work, and the license text says so is preserved intentionally
  (`before-implementing/README.md:167-171`).
- Plugin-scoped `plugins/grill-for-unknowns/LICENSE` mirrors the same two-name notice at the
  plugin level.
- `NOTICE.md` (`before-implementing/NOTICE.md:1-11`) names the three specific upstream skills and
  the one external article (Thariq's) that the package draws from, with links, satisfying MIT's
  practice (not requirement) of a clear attribution trail.
- `references/upstream-lineage.md:1-57` goes further than either LICENSE or NOTICE requires: it
  documents exactly which upstream skill contributed which behavior, and includes maintainer-only
  authoring notes explicitly marked as "guidance for future edits... not runtime behavior for the
  skill itself" (`upstream-lineage.md:51-57`) — a clean separation between attribution/lineage and
  the actual skill instructions.

**Full lineage chain, for SiteSmith's own attribution if any mechanism here is adapted:**
`grill-for-unknowns` (Nico Bailon, MIT) ← adapts `grilling` + `domain-modeling` +
`grill-with-docs` (Matt Pocock, MIT, `github.com/mattpocock/skills`) ← incorporates strategy from
Thariq's "A Field Guide to Fable: Finding Your Unknowns" (X article, no stated license — treat as
idea/strategy attribution only, not text to redistribute).

## Consequence for this rebuild

Per this project's own `CLAUDE.md`, only four sources may be redistributed into SiteSmith:
`taste-skill` + `ui-ux-pro-max` (MIT) and `frontend-design` + `impeccable` (Apache-2.0). Neither
`ai-dev-tasks` nor `grill-for-unknowns` is on that list. Both are permissively licensed (Apache-2.0
and MIT respectively) and *could* legally be added to the list, but this autopsy takes no position
on whether they should be added — that is a licensing-policy decision for the maintainer, not an
autopsy finding. What this autopsy does deliver: every mechanism above is described in original
words, cites its source precisely, and is designed to be re-implemented from scratch in SiteSmith's
own house style rather than copied — so the question of adding these two repos to the redistribution
allowlist does not block adopting the *mechanisms*, only blocks copying their *text*.
