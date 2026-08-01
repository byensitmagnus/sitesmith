---
title: "UI/UX Pro Max — Failure Modes"
ai_generated: "(C)"
---

## 1. The design-system generator is a mechanical-creativity engine by construction

`design_system.py:207-329` (`DesignSystemGenerator.generate()`) never calls a model. It: BM25-matches
one `Product Type` row, looks that category up **verbatim** in `ui-reasoning.csv`
(`design_system.py:108-130`), and returns whatever `Style_Priority`/`Color_Mood`/`Typography_Mood`
string sits in that row. There are only 30 rows in `ui-reasoning.csv`
(`data/ui-reasoning.csv`, `wc -l` = 162 lines / ~30 categories × header) — every project the product
search maps to "SaaS (General)" gets the identical tuple: *"Glassmorphism + Flat Design"*,
*"Trust blue + Accent contrast"*, *"Professional + Hierarchy"* (`data/ui-reasoning.csv:2`). This is
structurally the same failure the brief's benchmark measured: a deterministic template generator
(40) vs. an LLM reasoning from evidence (59) on the same brief.

## 2. The project's own docs admit the sameness problem, then route around it instead of fixing it

`stack/docs/WORKFLOW.md:19-24`: after running `ui-ux-pro-max`'s design-system generator, the
documented next step is to apply a *different* skill (`frontend-design`) whose job is to *"commit
to a look... reject the cream+serif and acid-on-black defaults."* That phrase — "defaults" — is the
project's own maintainers naming the exact output their generator tends to produce, and their fix
is procedural discipline in a separate tool, not a change to the generator itself. If a user only
has `ui-ux-pro-max` installed (it is marketed and shippable standalone via its own CLI, `cli/`), the
mitigation never happens.

## 3. `Decision_Rules` JSON looks conditional but isn't read conditionally

Every `ui-reasoning.csv` row carries a `Decision_Rules` column like
`{"if_ux_focused": "prioritize-minimalism", "if_data_heavy": "add-glassmorphism"}`
(`data/ui-reasoning.csv:2`). `_apply_reasoning()` (`design_system.py:132-164`) parses this JSON and
puts it in the output dict's `decision_rules` key — but nothing in `generate()` ever branches on it.
The appearance of situational reasoning ("if data-heavy, add X") exists in the data model without
existing in the code path. A caller reading the JSON output could be misled into thinking the
generator actually conditioned its pick on UX-focus or data-density; it did not.

## 4. Domain auto-detection can silently answer the wrong question

`SKILL.md:137` documents its own known miss: *"'font' matches both typography and google-fonts."*
More generally, `detect_domain()` (`core.py:377-408`) falls back to the `style` domain whenever no
domain scores above 0 (`core.py:403`) — a query about, say, chart accessibility with unusual
phrasing could silently return style-CSV rows that are real, well-formed, and completely off-topic,
with nothing in the output flagging that the fallback path was taken (contrast with the zero-result
path, which *does* self-report).

## 5. `google-fonts.csv` is a raw export, not curated content

1,924 rows / 728 KB (`data/google-fonts.csv`) — by far the largest data file, three orders of
magnitude bigger than `motion.csv` (17 rows) or `landing.csv` (35 rows). It reads as a bulk Google
Fonts metadata dump repurposed as a "database," which inflates the skill's stated "104 icon
entries... 25 chart types" framing (`SKILL.md:3`) with what is mostly an unweighted lookup table
rather than curated design guidance.

## 6. No loop enforces the fix→re-verify cycle

`stack/docs/WORKFLOW.md:84`: *"Re-screenshot after every fix"* is a documented **habit**, not code.
Nothing in `design-audit.mjs` or the `design-review` subagent re-runs itself automatically after a
fix is applied; the process-exit code (`design-audit.mjs:229`, non-zero on any high finding) could
gate CI, but nothing in this repo wires that exit code into an actual retry loop — see `LOOPS.md`.

## 7. Overengineered distribution for what the *design* mechanism needs

Three physically-synced copies of the same data/scripts (`src/` → `cli/assets/` →
`.claude/skills/ui-ux-pro-max/`), a Node sync script, and a CI job that fails PRs on drift
(`CLAUDE.md:73-101`, `.github/workflows/check-asset-sync.yml`) — all to serve 17 non-Claude IDE
targets (`src/ui-ux-pro-max/templates/platforms/*.json`) plus an npm CLI installer. None of this
affects output quality; it's real maintenance surface for a distribution problem SiteSmith (a single
unified skill) does not have.

## 8. Outdated/unversioned platform citations

`references/pro-rules.md` and `quick-reference.md` cite "Apple HIG" and "Material Design" as
sources for numeric rules (44×44pt targets, 150-300ms timing) without version/year, so a rule that
was correct at authoring time has no mechanism to flag itself as possibly superseded by newer
platform guidance.
