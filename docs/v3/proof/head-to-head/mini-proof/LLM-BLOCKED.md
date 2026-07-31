---
title: Mini-proof LLM creative pass blocked
status: blocked
ai_generated: "(C)"
date: 2026-07-31
---

# LLM creative mini-proof — blocked

## Missing env

Neither of these was present when the mini-proof ran:

| Variable | Present |
| --- | --- |
| `XAI_API_KEY` | **no** (process env) |
| `GROK_API_KEY` | **no** (process env) |
| `.env` in repo root | **no** file |

No secret values were logged. Presence-only check.

## Consequence

- Could not run: `node tools/run-creative-mini-proof.mjs --creative llm --brief 01-leather-goods`
- Engine behaviour: `creativePass: 'llm'` **fails closed** to rules when key missing (`creativePassFallback: true` / mock path for tests)
- Mini-1 comparison uses **SiteSmith rules** packet + frozen **frontend-design** (screening-v2), not an LLM packet

## Mock / offline path (still green)

- `node tools/test-direction-engine.mjs` — includes `llm creative pass with mock succeeds under guard` and fail-closed invent path
- `node tools/run-creative-mini-proof.mjs --creative rules --brief 01-leather-goods` → `docs/v3/proof/head-to-head/mini-proof/01-leather-goods-rules/`

## Unblock

Set **one** of `XAI_API_KEY` or `GROK_API_KEY` in the shell (or load into env without committing `.env`), then:

```bash
node tools/run-creative-mini-proof.mjs --creative llm --brief 01-leather-goods
```

Re-run mini blind only if the LLM packet differs materially from rules; do **not** open a new 15-run H2H.
