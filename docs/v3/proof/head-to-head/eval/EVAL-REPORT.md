---
title: Blind head-to-head evaluation report
status: complete
ai_generated: "(C)"
---

# Blind evaluation report

**Verdict:** `PROOF FAILED — UPSTREAM SUPERSET`

SiteSmith match/win briefs: **0/3**

## Per brief

### 01-leather-goods — **loss**

| Rank | Arm | Avg total | A | B |
| --- | --- | --- | --- | --- |
| 1 | `frontend-design` | 58.5 | 59 | 58 |
| 2 | `impeccable` | 56.5 | 57 | 56 |
| 3 | `taste-skill` | 48.0 | 46 | 50 |
| 4 | `sitesmith` | 28.5 | 28 | 29 |
| 5 | `ui-ux-pro-max` | 13.5 | 14 | 13 |

- Best upstream: `frontend-design` (58.5)
- SiteSmith avg: 28.5
- Evaluator top-1 agree: true
- wouldBuild A→`frontend-design` B→`frontend-design`

### 02-atelier-printworks — **loss**

| Rank | Arm | Avg total | A | B |
| --- | --- | --- | --- | --- |
| 1 | `frontend-design` | 59.0 | 59 | 59 |
| 2 | `impeccable` | 56.0 | 56 | 56 |
| 3 | `taste-skill` | 51.0 | 47 | 55 |
| 4 | `sitesmith` | 29.5 | 29 | 30 |
| 5 | `ui-ux-pro-max` | 13.5 | 14 | 13 |

- Best upstream: `frontend-design` (59.0)
- SiteSmith avg: 29.5
- Evaluator top-1 agree: true
- wouldBuild A→`frontend-design` B→`frontend-design`

### 03-passage-console — **loss**

| Rank | Arm | Avg total | A | B |
| --- | --- | --- | --- | --- |
| 1 | `frontend-design` | 59.0 | 59 | 59 |
| 2 | `taste-skill` | 57.5 | 57 | 58 |
| 3 | `impeccable` | 50.5 | 50 | 51 |
| 4 | `sitesmith` | 34.5 | 32 | 37 |
| 5 | `ui-ux-pro-max` | 13.0 | 13 | 13 |

- Best upstream: `frontend-design` (59.0)
- SiteSmith avg: 34.5
- Evaluator top-1 agree: true
- wouldBuild A→`frontend-design` B→`frontend-design`

## Advancement rule

SiteSmith needs match/win on ≥2/3 briefs vs best upstream.
Result: **0/3** → `PROOF FAILED — UPSTREAM SUPERSET`

## Not done

- Replication round (optional unless required by mixed protocol)
- Three v2.3 builds
- Showcase (still 0/8)

## Method notes (honest)

- **frontend-design / taste / impeccable**: isolated full-LLM direction prose under native skill framing.
- **sitesmith**: Direction Engine vertical slice (structured cards + handoff) — thinner literary density than full creative skills.
- **ui-ux-pro-max**: mechanical search.py --design-system only (no second-pass LLM synthesis) — expected weak on originality/subject specificity; treats retrieval as native core.
- Blind labels scrubbed; two independent evaluators; full top-1 agreement on all three briefs.
- **No replication** (not required after clear 0/3 loss).
- **No builds / showcase** (still 0/8).

This is a quality gate result on **direction packets as run**, not a claim that SiteSmith can never beat upstreams after a thicker creative layer.

