---
title: Direction Engine v3 proof plan
status: active
ai_generated: "(C)"
---

# Proof plan — Direction Engine vertical slice

## Approved scope

```text
evidence artifacts
→ capability routing (subset of 59)
→ creative direction generation
→ diversity filtering
→ direction cards
→ context-isolated critic + user choice
→ DesignSpec
→ handoff to existing v2.3 build/audit
```

## Explicitly out of scope

Full M0–M10, 120-run benchmark, WP/Woo adapter, showcase approval, customer sites, superiority marketing claims, merge to main.

## Fixtures

| Brief | Path | Mode |
| --- | --- | --- |
| Sensory ecommerce | `briefs/01-leather-goods` | ecommerce |
| Marketing/portfolio | `briefs/02-atelier-portfolio` | marketing |
| Product UI journey | `briefs/03-passage-console` | product-ui |

## Mechanical gates (executed on proof branch)

1. `node tools/test-review-integrity.mjs`
2. `node tools/test-direction-engine.mjs`
3. Engine runs per brief → `DIRECTION-RESULTS.json`, `ROUTING-RESULTS.json`
4. Ablation on leather brief → `ABLATION-RESULTS.json`

## Human / provider gates (required for PROOF PASSED)

1. Produce direction outputs from frozen upstream commits in the ledger for the same three briefs.
2. Blind review with ≥2 separate contexts.
3. Only then: three minimal builds through v2.3 verify/fidelity/novelty/diversity.

Until step 1–2 complete, **PROOF PASSED is forbidden**.

## Isolation language

Local critic is **deterministic preflight** unless a separate external run is
recorded. It is **not** model-independent and must not be labelled
context-isolated without execution evidence.

## Obligatory next phase (not optional)

Fair blind head-to-head vs the four locked upstreams is the **primary quality
gate**. Protocol: [HEAD-TO-HEAD-PROTOCOL.md](./HEAD-TO-HEAD-PROTOCOL.md).

```text
corrective pass review
→ lock five systems
→ blind head-to-head
→ builds only if SiteSmith matches or wins
```

Until that comparison runs, status stays:

```text
PROOF FAILED — DIRECTION QUALITY
```

Do not replace head-to-head with more internal fixtures or docs.
