---
title: SiteSmith v1.0 release map
ai_generated: "(C)"
---

# SiteSmith v1.0 release map

SiteSmith has two surfaces. They share source code, but they do not share a daily workflow.

## Product

Everything installed into a user's project:

- `skills/sitesmith/` — the skill, progressive guidance, blocks, stack data and gates.
- `bin/sitesmith.mjs` — install, update, doctor and generated provider packs.
- `README.md`, `NOTICE.md`, `LICENSE*` and `SECURITY.md` — public product documentation.

The normal website journey has three user commands:

| Command | User outcome | Internal work |
| --- | --- | --- |
| `init` | A truthful brief and one chosen direction | inspect, evidence, brand, assets, contrasting directions, contract |
| `build` | The site works in its detected stack | structure, stack adapter, implementation, journeys, fast render loop |
| `audit` | The site is ready to hand over or names why it is not | technical verification, fidelity, production gate, shared direction memory, visual critique, report |

`harden`, `polish` and `doctor` remain targeted commands. They are not mandatory phases in every
build. A product build never runs portfolio comparison, assignment-blinded review or benchmark
isolation unless the user explicitly asks for benchmark work.

## Lab

Evidence about SiteSmith itself, excluded from the installed product and ordinary build loop:

- `bench/` and `benchmarks/v2/` — isolated A/B harness and its briefs.
- `benchmarks/`, `pilots/` and `results/` — retained rendered evidence and controls.
- `docs/v2/preflight/` — review ceremonies, sealed mappings and historical rounds.
- `tools/bench*.mjs`, `tools/preflight*.mjs` and `tools/open-key.mjs` — lab-only machinery.

The lab runs on an explicit benchmark task or release claim. It may prove transfer, isolation and
portfolio diversity. It may not lengthen the loop used to build one customer website.

## Old and new loop

```text
old: init -> shape -> build -> audit -> harden -> polish -> repeated full gates
new: init -> build -> audit
                    |-> harden only on a failed functional/production gate
                    |-> polish only on a specific visual criticism
lab: explicit benchmark request -> isolated runs -> review -> claim
```

## v1.0 acceptance

1. A clean install provides the skill and executable gates.
2. `init`, `build` and `audit` are the documented default journey generated from `PIPELINE.json`.
3. Next.js, React/Vite and Astro projects select one matching stack adapter deterministically.
4. The chosen direction records density, motion, boldness and four visual-grammar decisions;
   the finished render is checked against the known SiteSmith recipe and earlier projects.
5. Repository status documents agree, all existing gates stay green, and the research corpus is
   unchanged.
