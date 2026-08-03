---
title: WORKFLOW-MAP — sitesmith-current autopsy
ai_generated: "(C)"
---

# Step order, and the file that drives each step

Source of truth: `PIPELINE.json` steps 88-369. `SKILL.md` §1-2 is the human-readable
restatement of the same graph.

## Route (SKILL.md:24-46, before any command)

1. Which mode — Marketing / E-commerce / Product UI — decided **per page**, not per project
   (SKILL.md:28). Opens `v2/modes/<mode>.md`.
2. Which task — SETUP / NEW / REDESIGN / COMPONENT / AUDIT — a lookup table, no scoring.

## `init` (PIPELINE.json:31-47) — decide what will be built

| # | step id | reads | produces | gate |
|---|---|---|---|---|
| 1 | brief | v2/00-done.md | BRIEF.md | — |
| 2 | inspect | (agent judgement) | — | — |
| 3 | stack | — | .sitesmith/STACK.md | `stack-router.mjs detect . --write` |
| 4 | evidence | v2/05-evidence.md | EVIDENCE.md | — |
| 5 | brand | v2/15-brand.md, v2/25-assets.md | BRAND.md, ASSET-MANIFEST.md | — |
| 6 | asset-plan | v2/24-asset-plan.md, EVIDENCE.md, BRAND.md | ASSET-PLAN.md | `asset-plan.mjs check` |
| 7 | visual-plan | v2/26-visual-assets.md, v2/25-assets.md | VISUAL-SOURCE-PLAN.md | `visual-assets.mjs check` |
| 8 | visual-assets | v2/26-visual-assets.md, VISUAL-SOURCE-PLAN.md | assets on disk, manifest rows | `visual-assets.mjs record` |
| 9 | directions | v2/20-direction-lab.md | directions/{a,b,c}/NOTE.md | — (tool: `search.py --candidates`) |
| 10 | comps | v2/20-direction-lab.md | directions/{a,b,c}/index.html | `direction-check.mjs directions/` |
| 11 | choose | v2/20-direction-lab.md | DIRECTION.md | `direction-history.mjs check` |
| 12 | contract | v2/30-contract.md | DESIGN-SYSTEM.md | — |
| 13 | interactions | v2/40-interaction.md | INTERACTIONS.md | — |

Order is asserted as load-bearing, not incidental: PIPELINE.json:9-13 states plainly that
fixing tokens (step 12) before a direction is chosen (step 11) is *the specific mechanism*
that made unrelated subjects converge on one look, citing two internal audits by name.

## `build` (PIPELINE.json:49-57)

| # | step id | reads | produces | gate |
|---|---|---|---|---|
| 14 | structure | v2/modes/<mode>.md | — | — |
| 15 | implement | blocks/README.md, .sitesmith/STACK.md, data/stacks/<stack>.csv | the site | `token-drift.mjs --contract DESIGN-SYSTEM.md` |
| 16 | journeys | v2/40-interaction.md | journeys/*.spec.mjs | `journey.mjs journeys/ --base <url>` |
| 17 | preview | — | .sitesmith/shots/preview/ | `verify.mjs <url> --no-axe` (axe explicitly waived, preview-only) |

## `audit` (PIPELINE.json:58-68)

| # | step id | reads | produces | gate |
|---|---|---|---|---|
| 18 | verify | — | .sitesmith/shots/ | `verify.mjs <url>` (axe included) |
| 19 | fidelity | — | — | `direction-fidelity.mjs DIRECTION.md <url>` |
| (lab-only) | diversity | — | — | `portfolio-diversity.mjs <url> <url> <url>` — scope: benchmark lab, not a per-site step |
| 20 | production | v2/25-assets.md, v2/24-asset-plan.md | — | `asset-plan.mjs check --manifest --direction` + `production-gate.mjs --production` |
| 21 | novelty | — | ~/.sitesmith/direction-history.jsonl | `direction-history.mjs commit` |
| 22 | critique | v2/50-critique.md | CRITIQUE.md | — (mandatory ceremony only for lab benchmark work, per v2/50-critique.md:141-155) |
| 23 | report | v2/00-done.md | PRODUCTION-REPORT.md | — |

## Non-default commands (targeted tools, never mandatory phases)

- `harden` = {journeys, production} re-run — closes whatever `audit` failed.
- `polish` = {critique, targeted-polish} — one round, driven by a named criticism.
- `doctor` = {} — installation/path/version-drift self-check, no build steps.

## Where the mechanical-vs-model-judgement line actually falls

- **Mechanical / scripted**: stack detection, direction candidate search (BM25 + Jaccard —
  `scripts/candidates.py`), direction-check/fidelity/history/token-drift/production-gate/
  journey/portfolio-diversity (all DOM measurement + regex, zero LLM calls).
- **Model judgement, unassisted by any script**: writing `BRIEF.md`, `EVIDENCE.md`, choosing
  among the three candidates and arguing the choice in `DIRECTION.md`, writing
  `DESIGN-SYSTEM.md` prose parts 2-3, the visual critique itself (`v2/50-critique.md`).
- The candidate-search step (#9) is the one place a script's output is fed back as the literal
  starting vocabulary for a creative decision — see MECHANISMS.json entries `direction-candidate-search`
  and FAILURE-MODES.md.
