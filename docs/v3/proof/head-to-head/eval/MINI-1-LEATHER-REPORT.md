---
title: Mini-1 leather — SiteSmith rules vs frozen frontend-design
status: complete
ai_generated: "(C)"
date: 2026-07-31
---

# Mini-1 leather report

**Scope:** one brief, two packets, two blind evaluators. **Not** a 15-run H2H.  
**Not claimed:** PROOF PASSED. Showcase still 0/8.

## Packets

| Label (blind) | Arm (revealed after score) | Source |
| --- | --- | --- |
| M | `sitesmith-rules` | orchestrator `creative=rules` → `mini-proof/01-leather-goods-rules/` |
| N | `frontend-design-frozen-v2` | frozen `runs/screening-v2/01-leather-goods/frontend-design/` |

LLM creative path: **blocked** — missing `XAI_API_KEY` and `GROK_API_KEY` (see `mini-proof/LLM-BLOCKED.md`). Mini uses rules, not llm.

## Blind scores

| Arm | Avg total | A | B |
| --- | --- | --- | --- |
| `frontend-design-frozen-v2` (N) | **59.0** | 59 | 59 |
| `sitesmith-rules` (M) | **40.0** | 39 | 41 |

- Gap (FD − SiteSmith): **+19.0**
- Evaluator top-1 agree: **true** (both N)
- wouldBuild A→N B→N
- strongestDirection A→N B→N
- mostGeneric A→M B→M

## Verdict (mini only)

`MINI FAIL — RULES STILL TRAILS FROZEN FRONTEND-DESIGN`

SiteSmith rules packet improved **thesis/signature** language (make-slot desk + Hide Grade Strip) relative to early H2H skeletons, but composition/interaction remain seed-thin (`type alone at scale`, `single decisive scroll cue`) and asset honesty is weaker than the frozen upstream. Orchestrator product claim stands: structure + evidence guard are real; **rules creative is not competitive** with frozen frontend-design on this brief.

## Architecture alignment

Canonical: `docs/v3/ARCH-DIRECTION-ORCHESTRATOR.md`  
Product position: SiteSmith = evidence + structure + fidelity + optional creative (rules|llm) — **not** a mechanical winner over frontend-design.

## What this does / does not authorize

| Do | Do not |
| --- | --- |
| Keep mock LLM + fail-closed guard | Re-open 15-arm H2H |
| When key exists: one llm mini re-run | Flip showcase 0/8 |
| Prefer v2.3 build path once creative quality is credible | Declare PROOF PASSED |

## Artifacts

- Eval pack: `eval/mini-1-leather/EVAL-PACK.json`
- Key: `eval/mini-1-leather/KEY.json`
- Scores: `eval/mini-1-leather/SCORES-A.json`, `SCORES-B.json`
- Rules proof: `mini-proof/01-leather-goods-rules/`
- Frozen FD: `mini-proof/01-leather-goods-frontend-design-frozen-v2/`
