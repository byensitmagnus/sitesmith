---
title: Mini-1 leather host-LLM vs frozen frontend-design
status: complete
ai_generated: "(C)"
date: 2026-07-31
---

# Mini-1 leather — host LLM creative pass

## Path

| Item | Value |
| --- | --- |
| API key | **absent** (`XAI_API_KEY` / `GROK_API_KEY`) |
| Creative path | **host-llm-same-class** (agent prose → `guardCreativePacket`) |
| Packet | `mini-proof/01-leather-goods-host-llm/DIRECTION-PACKET.json` |
| Baseline | frozen frontend-design screening-v2 |
| Guard | pass (0 problems) |

This is **not** an xAI API call. Same evidence-guard contract as the product LLM path. Documented because API remains blocked in this environment.

## Blind scores (P/Q)

| Arm | A | B | Avg / 60 |
| --- | --- | --- | --- |
| sitesmith-host-llm (P) | 58 | 57 | **57.5** |
| frontend-design-frozen-v2 (Q) | 59 | 59 | **59** |

## Trail (SiteSmith leather)

| Run | Avg |
| --- | --- |
| Rules mini-1 | 40 |
| Host-LLM mini-1 | 57.5 |
| FD frozen v2 | 59 |

## Verdict

`MINI FAIL — HOST LLM STILL TRAILS FROZEN FRONTEND-DESIGN (NARROW)`

Delta vs rules: **+17.5**. Delta vs FD: **-1.5**.

## What moved

- Composition upgraded from poster seed (“type alone / artefact below fold”) to mobile desk stack + sticky rail
- Interaction upgraded from “single decisive scroll cue” to Hide Grade Strip radiogroup + make-slot summary
- Assets honest: named `field-tote.webp` / `belt-no-2.webp`, needed `stitch-macro.webp`, strap text until have
- Unknowns declared (grades, stitch, strap plate, calendar slots)

## What still loses to FD (narrow)

- Material tokens: FD has hex + edge-bone/soot companions; host packet stays descriptive cream/ink/brass
- Implementability hair-split on paint-by-numbers density

## Claims we do **not** make

- PROOF PASSED / full 15-arm H2H win
- That host-llm equals production xAI provider proof
- Showcase eligibility

## Unblock true API path

Set key in env or gitignored `.env`, then:

```bash
node tools/run-creative-mini-proof.mjs --creative llm --brief 01-leather-goods
```

Only re-blind if API packet differs materially from host packet.
