---
title: OVERVIEW — sitesmith-current autopsy
ai_generated: "(C)"
---

# What it is

A Claude-Code skill package (`skills/sitesmith/`) for building/redesigning/auditing websites.
MIT-licensed own work plus bundled MIT/Apache excerpts from four upstream repos (taste-skill,
ui-ux-pro-max-skill, frontend-design, impeccable). Entry point declared in
`SKILL.md` frontmatter (`name: sitesmith`), routed by Claude's skill-matching on the
`description` field.

## Size

- Total checkout: 2.9 MB.
- `data/` (BM25 CSVs: styles, colors, fonts, per-stack guideline tables): ~1.4 MB of the total —
  this is the "1.4 MB of data" `SKILL.md`:20 explicitly says must never be pulled into context.
- `references/impeccable/critique.md` alone is 793 lines; the whole `references/` tree (upstream
  provenance, not read during a build) is the single biggest source-line contributor.
- Largest own-work files: `scripts/design_system.py` (1151 lines), `scripts/production-gate.mjs`
  (519), `scripts/direction-fidelity.mjs` (452), `scripts/candidates.py` (371),
  `scripts/verify.mjs` (313), `scripts/token-drift.mjs` (303).

## Entry point and shape

`SKILL.md` (196 lines, ~11.2 KB) is the router. It does not contain the build rules itself —
it points to `v2/` ("**Read v2/. That is the skill.**", SKILL.md:13) and to `PIPELINE.json`,
which is the single machine-readable source the command vocabulary, SKILL.md's own build
section, and (per PIPELINE.json:1-16) the provider packages for Claude/Codex/Cursor are all
generated from.

Package layout:
- `v2/` — the only prose the agent reads during a build: `00-done.md` (definition of done),
  `05-evidence.md`, `10-core.md` (60 rules), `modes/{marketing,ecommerce,product-ui}.md`,
  `20-direction-lab.md`, `24/25/26-asset*.md`, `30-contract.md`, `40-interaction.md`,
  `50-critique.md`, `tasks/{setup,redesign-audit}.md`.
- `scripts/` — 15 Node/Python programs: a BM25 style-search engine (`search.py`/`core.py`/
  `candidates.py`/`design_system.py`), stack detection, and seven Playwright/DOM-measurement
  gates (`verify`, `direction-check`, `direction-fidelity`, `direction-history`, `token-drift`,
  `journey`, `production-gate`, `portfolio-diversity`, `critique-gate`, `asset-plan`,
  `visual-assets`).
- `blocks/` — 18 HTML structural partials (nav, hero, pricing, footer, etc.) plus
  `CONTRACT.md`, a neutral placeholder token set they render against.
- `data/` — 16 domain CSVs (style, color, chart, landing, product, ux, typography, icons,
  react, web, google-fonts) + 16 per-stack CSVs. This is the BM25 corpus.
- `references/` — the four upstream skills' original material, kept for attribution,
  explicitly "not read during a build" (SKILL.md:16, v2/README.md:109-116).
- `PIPELINE.json` (402 lines) — canonical step graph: 6 commands (`init`, `build`, `audit`,
  `harden`, `polish`, `doctor`), 19 steps, each with `reads`/`produces`/`gate`.
- `THIRD-PARTY-NOTICES.md` + `LICENSES/Apache-2.0.txt` — travels with every installed bundle.

## What the package is for, in one line

Route (mode × task) → `init` (evidence → three mechanically-contrasted directions → chosen
direction → design-system contract) → `build` (stack-specific implementation + journeys) →
`audit` (mechanical gates + visual critique + production report). Two hard-separated gate
families: technical ("does it work" — verify/token-drift/production-gate/journey) and visual
("is it any good" — human critique, only after the technical gate is green).
