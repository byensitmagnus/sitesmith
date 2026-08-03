---
title: "Entrypoints, before and after the v3 alpha hardening"
status: current
ai_generated: "(C)"
---

# What each entrypoint actually did, and does now

This table exists because the repository had two products in it and no file said which one
a stranger would get. It is the map the hardening round was fixed against, not a summary
written afterwards.

## Before

| entrypoint | installs | reads pipeline | generates provider packs | protected by | state |
|---|---|---|---|---|---|
| `tools/install-sitesmith.mjs` | v3 skill only | none | none | `test-product-flow` (indirect) | current, incomplete |
| `bin/sitesmith.mjs install` | delegated to v3 | none on that path | **none** | CI clean-install job (with `--v2`) | current, incomplete |
| `bin/sitesmith.mjs install --v2` | v2 | `skills/sitesmith/PIPELINE.json` | claude, codex, cursor | `test-product-flow` | legacy, unlabelled |
| `bin/sitesmith.mjs pack` | nothing | `skills/sitesmith/PIPELINE.json` | claude, codex, cursor | `test-product-flow` | legacy, reachable by default |
| `skills/sitesmith-v3/cli.mjs` | nothing | none | none | none | current, untested |
| `skills/sitesmith-v3/commands.mjs` | nothing | none | none | none | current, untested |
| `product/pipeline.json` | nothing | is the pipeline | **nothing generated from it** | reference check only | current, inert |
| `skills/sitesmith/PIPELINE.json` | nothing | is the pipeline | all packs | `test-product-flow` | legacy, unlabelled |
| root `README.md` | documents both | neither | n/a | `check-repo.py` | conflicted |
| `verify.yml` | v2 clean install | n/a | n/a | itself | current, wrong subject |
| `package-v3.yml` | v3 ZIP only | none | none | itself | current, content-only |

The two defects that mattered: **no provider pack came from the v3 contract**, and
`product/pipeline.json` was a document nothing read.

## After

| entrypoint | installs | reads pipeline | generates provider packs | protected by | state |
|---|---|---|---|---|---|
| `bin/sitesmith.mjs install [--provider]` | **v3** | `product/pipeline.json` | claude, codex, cursor, openai | `test-pipeline-drift`, CI v3 clean-package | **current** |
| `bin/sitesmith.mjs install --legacy-v2` | v2 | `skills/sitesmith/PIPELINE.json` | claude, codex, cursor | `test-product-flow` | **legacy, explicit only** |
| `tools/install-sitesmith.mjs` | v3 skill + provider entry | `product/pipeline.json` | as asked | `test-pipeline-drift` | current |
| `skills/sitesmith-v3/cli.mjs` | nothing | `product/pipeline.json` for help | none | `test-pipeline-drift` | current |
| `skills/sitesmith-v3/commands.mjs` | nothing | none | none | `test-commands-exit` | current |
| `product/pipeline.json` | nothing | **is the canonical pipeline** | every normal pack | `test-pipeline-drift` | **canonical** |
| `skills/sitesmith/PIPELINE.json` | nothing | legacy only | legacy packs | `test-product-flow` | **legacy, labelled in the file** |
| root `README.md` | one install, one quickstart | `product/pipeline.json` | n/a | `test-pipeline-drift` | current |
| `verify.yml` | v3 clean package + pilot | n/a | n/a | itself | current |
| `package-v3.yml` | deterministic ZIP, then a product flow from it | n/a | n/a | itself | current |
