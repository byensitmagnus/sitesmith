---
title: Mini-proof LLM creative pass blocked
status: blocked
ai_generated: "(C)"
date: 2026-07-31
updated: 2026-07-31T22:05:00.000Z
---

# LLM creative mini-proof — blocked

## Last probe (loop tick)

| Check | Result | At (UTC) |
| --- | --- | --- |
| `XAI_API_KEY` process env | **missing** | 2026-07-31T22:05:00Z |
| `GROK_API_KEY` process env | **missing** | 2026-07-31T22:05:00Z |
| Repo `.env` / `.env.local` / `.env.xai` | **no file** | 2026-07-31T22:05:00Z |
| Common user paths (profile `.env`, mission-control `.env.local`) | no key lines found | 2026-07-31T22:05:00Z |

No secret values were logged. Presence-only check.

## Loader (now in tree)

| Piece | Path |
| --- | --- |
| Canonical loader | `skills/sitesmith/scripts/direction-engine/load-local-env.mjs` |
| Wired into engine async | `runDirectionEngineAsync` → `ensureCreativeEnv` |
| Wired into provider | `xaiChatProvider` → `resolveApiKey` → `ensureCreativeEnv` |
| Mini-proof CLI | `tools/run-creative-mini-proof.mjs` |
| Tools wrapper | `tools/load-env.mjs` |
| Template (safe) | `.env.example` (committed) |
| Gitignore | `.env`, `.env.*`, `!.env.example` |

## Consequence

- Cannot run a real LLM mini: `node tools/run-creative-mini-proof.mjs --creative llm --brief 01-leather-goods`
- Engine: `creativePass: 'llm'` **fails closed** to rules when key missing (`creativePassFallback: true`, `fallbackReason: 'no-api-key'`)
- Mini-1 comparison remains **SiteSmith rules** vs frozen **frontend-design** (screening-v2)

## Mock / offline path (still green)

- `node tools/test-direction-engine.mjs` — mock LLM + env-loader unit tests
- `node tools/run-creative-mini-proof.mjs --creative rules --brief 01-leather-goods` → `mini-proof/01-leather-goods-rules/`

## Unblock (one step)

```bash
# Option A: shell (session only)
$env:XAI_API_KEY = "xai-..."   # PowerShell

# Option B: local file (gitignored)
copy .env.example .env
# edit .env — set XAI_API_KEY=...

node tools/run-creative-mini-proof.mjs --creative llm --brief 01-leather-goods
```

Re-run mini blind only if the LLM packet differs materially from rules; do **not** open a new 15-run H2H.
