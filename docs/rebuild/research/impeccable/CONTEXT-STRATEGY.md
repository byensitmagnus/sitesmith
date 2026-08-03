---
title: "Impeccable — Context Strategy"
ai_generated: "(C)"
---

Method: character count via `wc -c` on the source files, divided by 4 to estimate tokens (stated per the task instructions — this is a rough heuristic, not a tokenizer run).

## Always loaded (every invocation, every command)

- `skill/SKILL.src.md` — 11,190 chars ≈ **2,798 tokens**. This is the only file guaranteed to load on every single invocation; it dispatches everything else.
- `node scripts/context.mjs` output — dynamic, not a static skill cost: PRODUCT.md + DESIGN.md (when present) + the matching surface brief + native-platform guidance, sized by the target project, not the skill. Zero cost on a from-scratch project (prints `NO_PRODUCT_MD:` instead).

**Always-loaded skill-authored total: ~2,800 tokens.** This is lean and appropriate for a dispatcher.

## Loaded conditionally, but on almost every real edit

- `skill/reference/craft-floor.md` — 6,623 chars ≈ **1,656 tokens**. Loaded "immediately before editing UI" (`SKILL.src.md:23`), i.e. on effectively every build/redesign/polish/refine command, but explicitly skipped for "planning-only work." In practice this behaves like a second near-always-loaded file for any command that touches code.

Combined always+near-always: **~4,450 tokens** before any command-specific reference is read.

## Loaded conditionally, one at a time, per command

35 files in `skill/reference/*.md` totalling 321,555 chars (~80,389 tokens), but the routing rule (`SKILL.src.md:70-77`) loads **exactly one** reference doc per resolved command (two if a native variant applies). Measured range across the ones read in depth:

| File | Chars | Tokens (÷4) |
|---|---|---|
| `routing.md` | 2,916 | 729 |
| `polish.md` | 5,280 | 1,320 |
| `craft-floor.md` (cross-cutting) | 6,623 | 1,656 |
| `audit.md` | 7,335 | 1,834 |
| `harden.md` | 8,892 | 2,223 |
| `adapt.md` | 10,636 | 2,659 |
| `new-work.md` | 29,455 | 7,364 |
| `critique.md` | 43,562 | 10,891 |

So the per-command marginal cost varies by more than **15x** depending which command is picked (729 tokens for a bare no-arg menu vs. ~10,900 tokens for `critique`). `new-work.md` and `critique.md` are outliers — both are "mega-reference" files that inline what used to be separate files (critique.md explicitly says so at line 297-299: "previously separate reference files... live inline now so the critique flow has all its deep context in one place"). That design choice trades fewer file-load round-trips for a much larger single load.

## Loaded rarely / only for specific sub-flows

- Agent definition files (`skill/agents/*.md`) are only read by the sub-agent itself when spawned, not by the parent's context: `impeccable-finish-reviewer.md` (9,006 chars ≈ 2,252 tokens), `impeccable-documenter.md` (3,330 chars ≈ 833 tokens). These never enter the primary build thread's context at all — a deliberate isolation choice (see `MECHANISMS.json: bounded-finish-review-loop`), which is also good context hygiene: the parent thread never pays for the reviewer's own reasoning tokens.
- `cli/engine/rules/checks.mjs` (5,580 lines) and `cli/engine/registry/antipatterns.mjs` (617 lines) — the mechanical detector's full implementation — **never enters model context at all**. It's invoked as a Bash tool call (`node scripts/detect.mjs --json <target>`) and only its JSON output (findings, counts, file:line) is read back. This is the correct pattern for anything mechanical: keep the deterministic logic in code, pay only for its structured output.
- Native-platform references (`ios.md`, `android.md`, `audit.native.md`, `adapt.native.md`) are loaded only when `context.mjs` reports the project's platform as `ios`/`android`/`adaptive` — zero cost for web projects, which are presumably the common case.

## Net assessment

The layering (dispatcher → cross-cutting floor → one command reference → rarely-touched agent/native files) is a reasonable shape, but two files (`new-work.md`, `critique.md`) blow past the "small, single-purpose reference" pattern the rest of the set follows, at 3-4x the size of the next largest file. For a from-scratch SiteSmith rebuild, the always+near-always core (~4,450 tokens) is a good target ceiling; the per-command references should each stay closer to the 1,500-3,000 token range this repo's smaller files demonstrate is achievable, rather than the critique.md/new-work.md outliers.
