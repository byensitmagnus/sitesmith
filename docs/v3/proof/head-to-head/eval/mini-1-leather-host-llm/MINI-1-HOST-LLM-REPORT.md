---
title: Mini-1 host-LLM vs frozen frontend-design
status: complete
ai_generated: "(C)"
---

# Mini-1 host-LLM (leather)

## Method

SiteSmith creative pass used the **same prompt** as `creative-llm.mjs`, filled by the **interactive host LLM** (this session), not a separate API key. Packet ran through `runDirectionEngineAsync` + **evidence guard** (PASS).

Compare target: frozen `frontend-design` packet from screening-v2 (same brief).

## Scores (A+B)

| Arm | A | B | Avg / 60 |
| --- | --- | --- | --- |
| frontend-design (P) | 59 | 59 | **59** |
| sitesmith host-LLM (Q) | 55 | 55 | **55** |

- wouldBuild: frontend-design (both)
- mostGeneric: sitesmith host-LLM (both)

## vs earlier SiteSmith paths (same brief)

| Path | Approx avg |
| --- | --- |
| Engine v1 | ~28 |
| Rules polish v2 | ~39 |
| Rules mini-1 | ~34–40 |
| **Host LLM creative pass** | **~55** |
| Frozen frontend-design | ~59 |

## Interpretation

- User was right: **no separate API required** when the host agent *is* the model.
- Host-LLM path is **competitive** (gap ~4 points), not the old ~20–30 point hole.
- Still **slight lose** on this one-brief blind; not PROOF PASSED.
- Does **not** reopen full 15-arm H2H or showcase claims.

## Artifacts

- `mini-proof/01-leather-goods-host-llm/`
- `tools/run-host-llm-mini.mjs`
