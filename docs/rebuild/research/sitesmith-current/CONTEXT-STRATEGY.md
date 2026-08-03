---
title: CONTEXT-STRATEGY — sitesmith-current autopsy
ai_generated: "(C)"
---

# Always-loaded vs conditional

## The declared contract

`PIPELINE.json:24-28` declares the standing cost explicitly as an array:

```
"alwaysLoaded": ["SKILL.md", "v2/10-core.md", "one file from v2/modes/"]
```

`SKILL.md:18-20` restates this in prose: "What is always in context is this file, the sixty
core rules, and one mode file. Everything else is read at its step and put down again."

## Measured cost of the always-loaded set

Method: `wc -c` on each file (byte count of UTF-8 text, no markup stripped), divided by 4 as a
standard characters-per-token estimate. This is an estimate, not a tokenizer run.

| File | Bytes | Est. tokens (÷4) |
|---|---|---|
| `SKILL.md` | 11,160 | ~2,790 |
| `v2/10-core.md` | 7,833 | ~1,958 |
| `v2/modes/marketing.md` (one mode, marketing case) | 8,692 | ~2,173 |
| `v2/modes/ecommerce.md` (one mode, e-commerce case) | 8,227 | ~2,057 |
| `v2/modes/product-ui.md` (one mode, product-UI case) | 8,327 | ~2,082 |

**Standing cost is ~27,000–28,000 characters (~6,800–7,000 tokens)**, depending on which single
mode file is loaded — the three mode files are within ~6% of each other in size, so the choice
of mode does not materially change the budget.

This is the entire fixed overhead PIPELINE.json guarantees for *any* task, from a one-page
brief to a nine-page site: it does not grow with project size, because the manifest attaches
`reads` to steps, not to pages.

## What is loaded conditionally, and its size

Everything else in `v2/` is read only at its named step and is not part of the standing cost:

| File | Read when (PIPELINE.json step) | Size |
|---|---|---|
| `v2/00-done.md` | `brief` (init) and `report` (audit) | 240 lines |
| `v2/05-evidence.md` | `evidence` (init) | 127 lines |
| `v2/15-brand.md`, `v2/25-assets.md` | `brand` (init) | not sized here |
| `v2/24-asset-plan.md` | `asset-plan` (init) | not sized here |
| `v2/26-visual-assets.md` | `visual-plan`, `visual-assets` (init) | not sized here |
| `v2/20-direction-lab.md` | `directions`, `comps`, `choose` (init) | 293 lines |
| `v2/30-contract.md` | `contract` (init) | 252 lines |
| `v2/40-interaction.md` | `interactions` (init), `journeys` (build) | 156 lines |
| `blocks/README.md` | `implement` (build) | not sized here |
| `data/stacks/<detected>.csv` | `implement` (build) — exactly one of 16 stack files | ~varies |
| `v2/50-critique.md` | `critique` (audit) | 155 lines |
| `v2/tasks/redesign-audit.md` | REDESIGN task only | 208 lines |

None of these overlap with any other step's window in the ordinary `init → build → audit`
journey — each is read once and, per the stated discipline, "put down again."

## What is never read during an ordinary build

- `references/` (four upstream skills' original material, ~793 lines in
  `references/impeccable/critique.md` alone, plus 30+ more files) — explicitly "provenance, not
  authority" (SKILL.md:127) and "not read during a build" (v2/README.md:109-111).
- `data/*.csv` outside the one detected stack file and whatever domain(s) `search.py --candidates`
  queries — the ~1.4MB total corpus is never bulk-loaded; it is queried by a script (BM25 over a
  CSV) whose *output* (a handful of matched rows) is what actually reaches context, not the file
  itself.
- Benchmark-lab-only material (`portfolio-diversity.mjs`, `critique-gate.mjs`'s ceremony files,
  `docs/v2/*AUDIT*`) — scoped out of the ordinary customer-build path by `SKILL.md:110-114` and
  `v2/50-critique.md:141-155`.

## Assessment

The mechanism (a machine-readable step→reads manifest, with a small enumerated always-loaded
set) is sound and directly portable: it turns "progressive disclosure" from a norm the model
has to remember into a property of the router. Its weakness (see FAILURE-MODES.md item 10) is
that nothing mechanically verifies an agent actually honoured the manifest — there is no
drift-checker analogous to `token-drift.mjs` for context discipline itself.
