---
title: Repo truth before the unified SiteSmith rebuild
state: S0_REPO_TRUTH
status: verified
verifiedAt: 2026-08-01
method: live git + gh commands, not chat history
ai_generated: "(C)"
---

# Repo truth — verified 2026-08-01

Every row below came from a live command in this session. Nothing is carried over
from chat memory or from an earlier document's claim about itself.

## 1. Branches and SHAs

| Ref | SHA | Note |
| --- | --- | --- |
| `origin/main` | `80d4030780a4cab18f3baa16dfd354269f83971c` | last pushed state of `main` |
| `main` (local) | `dc00598cce2af92435a749856393e287506753bc` | **1 ahead of `origin/main`, never pushed** |
| `origin/codex/v3-foundation-audit` | `dc00598cce2af92435a749856393e287506753bc` | identical to local `main` |
| `codex/v3-direction-engine-proof` | `b92cdabad98c4d23ff79b74d6881e6b7129325a4` | frozen proof SHA used by the H2H freeze |
| `codex/v3-direction-head-to-head` | `bb4be560f3845bfca3408e9a1b8d8c3af1c9e6ce` | H2H branch, +2 local commits over origin |
| `origin/codex/v3-direction-head-to-head` | `d9a8359ae53f9b2a2d7bd82ca98c346482a9cdcb` | |
| **`rebuild/sitesmith-unified`** | branched from `dc00598` | **this rebuild, isolated from the failed research branches** |

`codex/v3-direction-head-to-head` was 27 commits ahead of `main` and 0 behind.
None of that lineage is merged into `main`.

## 2. Working tree at rebuild start

Two untracked files were left over from earlier sessions and were **not** committed
by the previous workstream: `AGENTS.md`, `CLAUDE.md` (project instructions).
`.playwright-mcp/` is a local MCP cache and is now gitignored on this branch.

Before branching, this session committed the previously-uncommitted evidence to
`codex/v3-direction-head-to-head` as `bb4be56` so nothing was lost:

- `docs/v3/proof/head-to-head/WORKFLOW-STATE.json` (moved to `BENCHMARK_PERMANENTLY_FROZEN`)
- `docs/v3/proof/head-to-head/STATE-HISTORY.jsonl`
- `docs/v3/proof/head-to-head/BENCHMARK-FROZEN.md`
- `docs/v3/PRODUCT-PIPELINE.md`
- `docs/v3/proof/product-e2e/nordrig/**` (80 files, 4.7 MB — the A/B build evidence)

## 3. Open pull requests

| PR | Title | Branch | State |
| --- | --- | --- | --- |
| 3 | Draft: SiteSmith H2H v1-v3 — still FAIL | `codex/v3-direction-head-to-head` | DRAFT |
| 2 | Draft: Direction Engine v3 proof — direction quality not proven | `codex/v3-direction-engine-proof` | DRAFT |
| 1 | Draft: SiteSmith v3 foundation — architecture not approved | `codex/v3-foundation-audit` | DRAFT |

All three are drafts. All three are titled as failures by their own authors. None are merged.

## 4. CI status

Last 15 `verify` runs on PR #3: 3 success, 12 failure. The most recent failure
(`30666894416`) is **not** a product regression — it is `tools/check-repo.py`
reporting dead relative links inside the copied upstream agent packs:

```text
docs/v3/proof/head-to-head/_agent-packs/_impeccable.md:59: dead link -> new-work.md
docs/v3/proof/head-to-head/_agent-packs/_frontend-design.md:14: dead link -> ios.md
```

The packs are verbatim upstream excerpts whose relative links point at files that
were never copied. The rebuild must not inherit this: verbatim upstream copies do
not belong in a link-checked docs tree.

## 5. What is actually proven, and what is only a claim

### Proven (artifacts exist, reproducible)

| Claim | Evidence | Verdict |
| --- | --- | --- |
| v2.3 verification gate works | `skills/sitesmith/scripts/verify.mjs`, screenshots at 375/768/1440, axe in both schemes, console, dead links, overflow | real |
| Showcase is **0/8** | `gallery/showcase.json` → `"status": "reset"`, `"approved": []` | real |
| Round-8 house style is blocked | same file: `individualReview: pass`, `portfolioDiversity: fail` | real |
| H2H screening ran 15 arms × 3 briefs | `SCREENING-SUMMARY.json` — 15/15 completed, 9 paid model calls | real |
| SiteSmith's rules engine loses to frontend-design | `eval/MINI-1-LEATHER-LLM-REPORT.md` — SiteSmith host-LLM 57.5, frontend-design frozen 59 | real, narrow |
| SiteSmith's *mechanical* direction engine loses badly | same trail: rules-only mini-1 scored **40** vs 59 | real, wide |
| An end-to-end A/B build was run | `docs/v3/proof/product-e2e/nordrig/` — two full sites, A vs B | real |
| Neither A/B build was production-ready | `nordrig/ACCEPTED-VERDICT.md` | real, accepted by Magnus |

### Claim only (not proven)

| Claim | Status |
| --- | --- |
| Blind head-to-head vs all four frozen upstreams | **never executed** — `PROOF-VERDICT.md` says so itself |
| SiteSmith matches or beats best upstream directionally | **unknown** |
| Three v2.3 builds + portfolio diversity pass | **not executed** |
| Any superiority claim from unit-test counts or capability counts | explicitly forbidden by `docs/v3/PRODUCT-PIPELINE.md` |

### Integrity defect found and recorded by the previous workstream

`docs/v3/FOUNDATION-DECISION.md` once claimed architecture readiness while four of
five review files carried `status: fail`. That is documented in
`docs/v3/CURRENT-REPO-TRUTH.md` §"Integrity note". The rebuild inherits the lesson,
not the claim: **a document's own frontmatter is not evidence.**

## 6. The decision the previous workstream landed on — and why it conflicts with this rebuild

`docs/v3/PRODUCT-PIPELINE.md` (committed in `bb4be56`, status `canonical`) sets a
**five-skill chain**: taste-skill → ui-ux-pro-max → **frontend-design as mandatory
creative director** → impeccable → SiteSmith as production spine only.

The master prompt for this rebuild explicitly forbids that shape (§15: "Den nye
skill må ikke være fire skills i kæde"). The rebuild therefore supersedes
`PRODUCT-PIPELINE.md` as *architecture*, but it must **not** discard the evidence
underneath it:

> A mechanical rules/template engine scored **40** where frontend-design's
> LLM-native creative method scored **59** on the same brief with the same evidence.

Operational consequence for the rebuild, carried forward as a hard constraint:

- The unified skill must absorb frontend-design's *method* (creative thesis in the
  host model's own reasoning) rather than re-implement a deterministic direction
  generator.
- Scripts may verify, retrieve and gate. Scripts may not decide the design.

This is registered as `CONSTRAINT:no-mechanical-creativity` in the context graph.

## 7. Current skill size baseline

| Item | Value |
| --- | --- |
| `skills/sitesmith/SKILL.md` | 196 lines (CI limit: 500) |
| `skills/sitesmith/v2/` | 18 files — the actual skill body today |
| `skills/sitesmith/references/` | 10 top-level files + a verbatim `impeccable/` tree |
| `skills/sitesmith/data/` | 12 CSVs (~1.4 MB retrieval corpus) |
| `skills/sitesmith/scripts/` | 20 scripts (`.mjs` + `.py`) |
| Total `skills/sitesmith/` | 2.9 MB |

## 8. Environment facts relevant to the plan

| Fact | Value |
| --- | --- |
| Network to github.com | working (`git ls-remote` succeeded) |
| `gh` auth | logged in as `byensitmagnus` via `GH_TOKEN` |
| Node | v24.15.0 |
| Python | 3.11.9 |
| Third-party LLM API keys (`XAI_API_KEY` / `GROK_API_KEY`) | **absent** — the previous workstream was blocked on this and worked around it with a host-LLM path |

The absent third-party key is not a blocker for this rebuild: the host model *is*
the creative engine, which is the architecture the evidence points to anyway.

## 9. Push policy on this branch

- Work directly on `rebuild/sitesmith-unified`.
- No force-push. No merge to `main`. No rewriting of the three draft PRs' history.
- Push only after Magnus approves it once for this branch.
