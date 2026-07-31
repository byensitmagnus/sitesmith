---
title: Architecture — SiteSmith as direction orchestrator
status: active
ai_generated: "(C)"
date: 2026-07-31
---

# SiteSmith direction architecture (post H2H)

## Decision

After three head-to-head rounds SiteSmith **lost** direction quality vs upstreams
(`PROOF FAILED — UPSTREAM SUPERSET` / still 0/3 on v2–v3 remediations).

**Product position (locked):**

```text
SiteSmith = evidence + structure + fidelity + browser proof
         + optional creative pass (rules or LLM)
         ≠ claim that the mechanical engine alone beats taste/frontend/impeccable
```

## Pipeline

```text
BRIEF / EVIDENCE / BRAND / ASSETS / CONSTRAINTS
        │
        ▼
┌───────────────────┐
│ Direction Engine  │  route capabilities, seeds, brief-fit,
│ (structure)       │  blind preflight, DesignSpec skeleton
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Creative pass     │  rules (offline)  OR  LLM (when enabled)
│ (optional)        │  same packet schema as H2H
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Evidence guard    │  fail-closed: no invented products, prices,
│                   │  awards, testimonials, assets not in pack
└─────────┬─────────┘
          │
          ▼
  DesignSpec + HANDOFF → v2.3 build / audit / verify
```

## Creative pass modes

| Mode | When | Network |
| --- | --- | --- |
| `off` | Ablation / structure-only tests | no |
| `rules` | Default CI / offline (creative-layer.mjs) | no |
| `llm` | Product direction quality path | yes (provider) |

LLM mode uses a **pluggable provider**. Default provider: xAI Chat Completions when
`XAI_API_KEY` (or `GROK_API_KEY`) is set (process env **or** gitignored `.env` /
`.env.local` via `load-local-env.mjs` — fill-only, never logs values). Without a key,
`llm` **fails closed** to `rules` and records `creativePassFallback: true` (no silent
“we used the model”). Provider classifies auth/timeout/rate-limit and retries once on
429/5xx.

## Evidence guard (non-negotiable)

Any creative output is scanned against the pack:

- Allowed: tokens from brief/evidence/brand/assets/constraints + structural design language
- Forbidden invent: testimonials, awards, museums, free shipping, fake ratings, undeclared assets
- Fail → discard LLM packet, keep skeleton/rules, status notes the failure

## What we do not claim

- That SiteSmith won the v1–v3 H2H rounds
- That rules creative layer equals frontend-design
- Showcase eligibility (still 0/8 until real builds pass gates)

## Mini proof status (2026-07-31)

One brief mini-comparison **completed offline**:

```text
SiteSmith (structure + rules creative + guard)  vs  frozen frontend-design (screening-v2)
Brief: 01-leather-goods
Result: MINI FAIL — rules avg 40 vs FD 59 (see eval/MINI-1-LEATHER-REPORT.md)
LLM path: blocked without XAI_API_KEY / GROK_API_KEY (mini-proof/LLM-BLOCKED.md)
```

When a key exists, re-run **one** llm mini on the same brief — still not a 15-run circus.
