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
| 1 | `frontend-design` | 59.0 | 59 | 59 |
| 2 | `impeccable` | 56.5 | 57 | 56 |
| 3 | `taste-skill` | 50.5 | 50 | 51 |
| 4 | `sitesmith` | 42.5 | 41 | 44 |
| 5 | `ui-ux-pro-max` | 22.5 | 22 | 23 |

- Best upstream: `frontend-design` (59.0)
- SiteSmith avg: 42.5
- Evaluator top-1 agree: true
- wouldBuild A→`frontend-design` B→`frontend-design`

### 02-atelier-printworks — **loss**

| Rank | Arm | Avg total | A | B |
| --- | --- | --- | --- | --- |
| 1 | `impeccable` | 59.0 | 59 | 59 |
| 2 | `frontend-design` | 59.0 | 59 | 59 |
| 3 | `taste-skill` | 56.5 | 57 | 56 |
| 4 | `sitesmith` | 27.5 | 27 | 28 |
| 5 | `ui-ux-pro-max` | 22.5 | 23 | 22 |

- Best upstream: `impeccable` (59.0)
- SiteSmith avg: 27.5
- Evaluator top-1 agree: true
- wouldBuild A→`frontend-design` B→`frontend-design`

### 03-passage-console — **loss**

| Rank | Arm | Avg total | A | B |
| --- | --- | --- | --- | --- |
| 1 | `frontend-design` | 59.0 | 59 | 59 |
| 2 | `impeccable` | 58.0 | 57 | 59 |
| 3 | `taste-skill` | 57.0 | 56 | 58 |
| 4 | `sitesmith` | 28.5 | 28 | 29 |
| 5 | `ui-ux-pro-max` | 23.5 | 22 | 25 |

- Best upstream: `frontend-design` (59.0)
- SiteSmith avg: 28.5
- Evaluator top-1 agree: true
- wouldBuild A→`frontend-design` B→`frontend-design`

## Advancement rule

SiteSmith needs match/win on ≥2/3 briefs vs best upstream.
Result: **0/3** → `PROOF FAILED — UPSTREAM SUPERSET`

## Not done

- Replication round (optional unless required by mixed protocol)
- Three v2.3 builds
- Showcase (still 0/8)

## Creative layer round (v3)

Added evidence-bound creative-layer.mjs (no invented facts; director-grade composition from pack signals).

| Brief | v1 | v2 | v3 (creative layer) | Rank v3 |
| --- | --- | --- | --- | --- |
| leather | 28.5 | 38.5 | **42.5** | 4/5 |
| atelier | 29.5 | 39.0 | **27.5** | 4/5 |
| passage | 34.5 | 41.0 | **28.5** | 4/5 |

- Leather improved again (+4 vs v2) with Hide Grade Strip / make-slot desk language.
- Atelier + passage **regressed** vs v2 — rule-based creative layer is **mode-brittle** and still far from frontend/impeccable (~59).
- Peers copied from screening-v2 (only sitesmith re-generated) so delta isolates the layer.
- **Still 0/3 match/win.** Verdict: PROOF FAILED — UPSTREAM SUPERSET.

### Product conclusion

Mechanical/rule creative enrichment is **not** a substitute for a true model creative step bound to DesignSpec + evidence. Next architecture work: optional LLM enricher with fail-closed evidence checks, not more template rules alone.

