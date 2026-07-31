---
title: SiteSmith v3 review status matrix
status: authoritative
generatedAt: 2026-07-31
sourceCommit: dc00598cce2af92435a749856393e287506753bc
ai_generated: "(C)"
---

# Review status matrix

Machine-readable twin: [`REVIEW-STATUS.json`](./REVIEW-STATUS.json).

Readiness is **derived** from each review file’s frontmatter `status` and `blockerCount`, never from the filename alone.

## Architecture readiness (derived)

| Field | Value |
| --- | --- |
| Status | **`not-ready-for-architecture-approval`** |
| Why | No adversarial review is `pass` with `blockerCount=0` |
| Traceability | Only `TRACEABILITY-REVIEW-C.md` is PASS |
| Same hash set | C-series and E-series hash-lock different artifact bytes |

## Integrity defect on `dc00598`

`FOUNDATION-DECISION.md` stated that both process-isolated reviews were **PASS, 0 blockers**, and cited `ADVERSARIAL-REVIEW-C.md` as PASS.

The file itself says:

```yaml
status: fail
blockerCount: 3
```

That is a **blocking integrity defect** (`INT-FOUNDATION-FALSE-PASS`). The foundation status must be corrected; historical false readiness must stay visible in the history section of `FOUNDATION-DECISION.md`.

## Per-review matrix

| File | Reviewer | Isolation | Status | Blockers | Blocker IDs | Superseded | Closes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TRACEABILITY-REVIEW-C.md` | OpenAI Codex | `fork_turns=none` (context-isolated only) | **pass** | 0 | — | no | — |
| `ADVERSARIAL-REVIEW-C.md` | OpenAI Codex | `fork_turns=none` | **fail** | 3 | ADV-C-001…003 (prose) | no | — |
| `ADVERSARIAL-REVIEW-D.md` | OpenAI Codex | `fork_turns=none` | **fail** | 2 | D-001, D-002 | no | — |
| `ADVERSARIAL-REVIEW-E.md` | OpenAI Codex | `fork_turns=none` | **fail** | 1 | E-001 | no | E-002 resolved-in-report-only |
| `TRACEABILITY-REVIEW-E.md` | OpenAI Codex | `fork_turns=none` | **fail** | 1 | INPUT-DRIFT-001 | no | — |

## Claim audit (what people / docs said vs files)

| Claim | Actual | Match |
| --- | --- | --- |
| TRACEABILITY-REVIEW-C = PASS | pass / 0 | yes |
| ADVERSARIAL-REVIEW-C = PASS | **fail / 3** | **no** |
| ADVERSARIAL-REVIEW-D = PASS | fail / 2 | no |
| ADVERSARIAL-REVIEW-E = PASS | fail / 1 | no |
| TRACEABILITY-REVIEW-E = PASS | fail / 1 | no |

## Isolation language

All five reviews use the same provider/model family with `fork_turns=none`.

- Allowed description: **context-isolated**
- Forbidden description: **model-independent**

## Input artifacts (common locked set)

All reviews claim the same eleven paths as the locked set. Hash *values* differ across C vs D/E snapshots; do not treat them as one revision without matching SHA-256 rows.

## Direction Engine scope implication

Full architecture approval remains **not ready**. Work continues only on the approved vertical slice: Direction Engine proof on the v2.3 shell. Failed reviews and historical benchmarks stay in the tree as evidence; they must not be rewritten.
