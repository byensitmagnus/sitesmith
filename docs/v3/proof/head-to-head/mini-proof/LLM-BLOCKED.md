---
title: Mini-proof LLM creative pass blocked
status: blocked-api-key
ai_generated: "(C)"
date: 2026-07-31
updated: 2026-07-31T21:30:00.000Z
---

# LLM creative mini-proof — API key still blocked; host path completed

## Last API probe (loop tick)

| Check | Result | At (UTC) |
| --- | --- | --- |
| `XAI_API_KEY` process env | **missing** | 2026-07-31T21:30:00Z |
| `GROK_API_KEY` process env | **missing** | 2026-07-31T21:30:00Z |
| Repo `.env` / `.env.local` / `.env.xai` | **no file** | 2026-07-31T21:30:00Z |
| `ensureCreativeEnv` / `creativeKeyPresence` | `anyKey: false` | 2026-07-31T21:30:00Z |

No secret values logged.

## Host-LLM workaround (this tick — irreversible)

API path remains blocked, so the loop completed **B-equivalent** via host creative pass (same class as screening `host-llm`):

| Artefact | Path |
| --- | --- |
| Packet | `mini-proof/01-leather-goods-host-llm/DIRECTION-PACKET.json` |
| Guard | pass (`GUARD.json`) |
| Blind eval | `eval/mini-1-leather-llm/` |
| Report | `eval/MINI-1-LEATHER-LLM-REPORT.md` |

| Arm | Avg / 60 |
| --- | --- |
| SiteSmith rules (prior mini) | 40 |
| SiteSmith **host-llm** | **57.5** |
| Frozen frontend-design v2 | **59** |

Verdict: `MINI FAIL — HOST LLM STILL TRAILS FROZEN FRONTEND-DESIGN (NARROW)` (+17.5 vs rules, −1.5 vs FD).

**Not claimed:** PROOF PASSED, API provider proof, showcase.

## Loader (ready for true API)

| Piece | Path |
| --- | --- |
| Canonical loader | `skills/sitesmith/scripts/direction-engine/load-local-env.mjs` |
| Mini CLI | `tools/run-creative-mini-proof.mjs --creative llm` |
| Template | `.env.example` |

## Unblock true xAI API path

```bash
# PowerShell session or gitignored .env
$env:XAI_API_KEY = "xai-..."
node tools/run-creative-mini-proof.mjs --creative llm --brief 01-leather-goods
```

Re-blind only if API packet differs materially from host packet.
