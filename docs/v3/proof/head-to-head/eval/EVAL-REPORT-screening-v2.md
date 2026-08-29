---
title: Blind head-to-head evaluation report
status: complete
ai_generated: "(C)"
---

# Blind evaluation report

**Verdict:** `PROOF FAILED — DIRECTION QUALITY`

SiteSmith match/win briefs: **0/3**

## Per brief

### 01-leather-goods — **loss**

| Rank | Arm | Avg total | A | B |
| --- | --- | --- | --- | --- |
| 1 | `frontend-design` | 59.5 | 59 | 60 |
| 2 | `impeccable` | 58.0 | 58 | 58 |
| 3 | `taste-skill` | 56.0 | 54 | 58 |
| 4 | `sitesmith` | 38.5 | 34 | 43 |
| 5 | `ui-ux-pro-max` | 23.5 | 24 | 23 |

- Best upstream: `frontend-design` (59.5)
- SiteSmith avg: 38.5
- Evaluator top-1 agree: true
- wouldBuild A→`frontend-design` B→`frontend-design`

### 02-atelier-printworks — **loss**

| Rank | Arm | Avg total | A | B |
| --- | --- | --- | --- | --- |
| 1 | `frontend-design` | 59.5 | 59 | 60 |
| 2 | `impeccable` | 59.0 | 59 | 59 |
| 3 | `taste-skill` | 53.0 | 51 | 55 |
| 4 | `sitesmith` | 39.0 | 36 | 42 |
| 5 | `ui-ux-pro-max` | 24.0 | 25 | 23 |

- Best upstream: `frontend-design` (59.5)
- SiteSmith avg: 39.0
- Evaluator top-1 agree: false
- wouldBuild A→`frontend-design` B→`frontend-design`

### 03-passage-console — **loss**

| Rank | Arm | Avg total | A | B |
| --- | --- | --- | --- | --- |
| 1 | `frontend-design` | 59.5 | 59 | 60 |
| 2 | `impeccable` | 59.0 | 59 | 59 |
| 3 | `taste-skill` | 56.5 | 55 | 58 |
| 4 | `sitesmith` | 41.0 | 37 | 45 |
| 5 | `ui-ux-pro-max` | 22.5 | 20 | 25 |

- Best upstream: `frontend-design` (59.5)
- SiteSmith avg: 41.0
- Evaluator top-1 agree: true
- wouldBuild A→`frontend-design` B→`frontend-design`

## Advancement rule

SiteSmith needs match/win on ≥2/3 briefs vs best upstream.
Result: **0/3** → `PROOF FAILED — DIRECTION QUALITY`

## Not done

- Replication round (optional unless required by mixed protocol)
- Three v2.3 builds
- Showcase (still 0/8)

## vs round 1 (honest delta)

| Brief | SiteSmith v1 avg | SiteSmith v2 avg | Delta | Still rank |
| --- | --- | --- | --- | --- |
| leather | 28.5 | 38.5 | +10 | 4/5 |
| atelier | 29.5 | 39.0 | +9.5 | 4/5 |
| passage | 34.5 | 41.0 | +6.5 | 4/5 |

- Engine remediation **moved the needle** (~+7–10 points) but **did not change outcomes** (still 0/3 match/win).
- frontend-design remains best upstream on all briefs; wouldBuild unanimous for frontend-design.
- UUPM improved slightly with pack-grounded synthesis but stays last.
- Round-1 artifacts under 
uns/screening + val/blind remain the frozen loss record.
- Round-2 is additive under 
uns/screening-v2 + val/blind-screening-v2.

## Decision

Do **not** start builds. Direction engine still not competitive with creative upstreams on blind quality.
Next product step is architectural (LLM creative layer bound to evidence + DesignSpec), not more template tuning alone.

