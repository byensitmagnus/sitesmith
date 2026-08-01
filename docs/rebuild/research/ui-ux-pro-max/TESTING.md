---
title: "UI/UX Pro Max — Testing"
ai_generated: "(C)"
---

Two entirely separate things get "tested" in this repo, at very different levels of rigor.

## 1. The retrieval tool itself — real but narrow

`scripts/tests/test_core.py` (134 lines, stdlib `unittest`, no pytest dependency by design — see
its own docstring) tests:
- Tokenizer correctness: short domain tokens (`ui`, `3d`, `ai`) survive; stopwords are stripped;
  synonym normalization (`e-commerce`↔`ecommerce`, `dark-mode`↔`dark`) produces identical token
  streams.
- "Known query → expected top domain" sanity checks per the file's own comment: *"not exact-row
  pinning, since data can grow; these assert the engine still finds *something* relevant."*
- `generate_design_system()` / `persist_design_system()` branch coverage (skip-exists vs. force vs.
  fresh write).

This is **real, executable, CI-run** (`.github/workflows/tests.yml:32-33`: `pytest .claude/skills
-v`) — genuine proof that the search plumbing works, not asserted-and-forgotten. But it proves the
*mechanism* runs without crashing and returns *something* plausible; it does not grade retrieval
*quality* (precision/recall against a labeled query set) or output *diversity*.

## 2. The data itself — schema-only

`scripts/validate_data.py` (114 lines, also stdlib-only, designed to run pre-publish/CI) checks,
per CSV: the file exists, every column referenced by `search_cols`/`output_cols` is present in the
header, no duplicate `No` index values, and any `Decision_Rules`-style column parses as valid JSON.
This is integrity, not correctness — it would happily pass a CSV where every "SaaS" row said the
exact same thing (which, per `FAILURE-MODES.md`, is close to what actually happens), because
uniqueness of *content* is never checked, only uniqueness of the numeric `No` key.

## 3. The generated CLI / npm package — e2e smoke only

`cli/tests/e2e/preview.spec.ts` + `cli/playwright.config.ts`, run in CI
(`.github/workflows/tests.yml:41-43`: `npx playwright test`) — this tests the `uipro init` CLI's
generated preview, not the design-quality of any generated site.

## 4. The one place real design-output verification exists: `stack/`

`stack/examples/juniper-audit/` is a **real run** of `design-audit.mjs` against a live marketing
site (not a synthetic fixture) — `report.md`, `report.json`, and six actual PNG screenshots
(360/390/768/1024/1440/1920) are committed. This is the one piece of proof-by-demonstration in the
repo that is genuinely evidence-based: real DOM measurements against a real deployed site, not a
claim.

**Is that proof asserted or real, overall?** Mixed, and it splits cleanly by layer:
- BM25 tokenizer/plumbing: **real** (unit-tested, CI-run).
- Data schema integrity: **real but shallow** (structural only, not content-quality).
- Whether the design-system generator's output is actually *good* or *varied*: **untested, and
  the project's own workflow doc effectively concedes it isn't** (see `FAILURE-MODES.md` #2 — the
  documented mitigation is "run a different skill afterward to reject the defaults," which is an
  admission, not a test).
- The `design-review`/`design-audit.mjs` layer: **real, evidence-based, but narrow in scope**
  (functional/accessibility defects only, not sameness) and only demonstrated once
  (`juniper-audit`), not run as a suite across varied briefs.
