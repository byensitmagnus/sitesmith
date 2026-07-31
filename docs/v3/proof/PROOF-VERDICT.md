---
title: Direction Engine proof verdict
status: final
verdict: PROOF FAILED — DIRECTION QUALITY
ai_generated: "(C)"
---

# Proof verdict (corrective pass)

## Single status line

```text
PROOF FAILED — DIRECTION QUALITY
```

## Corrective pass (post PR #2 review)

Addressed on this branch:

1. Canonical upstream pins locked in `docs/v3/CANONICAL-UPSTREAM-PINS.json` (= v3 ledger).
2. Proof summaries regenerated mechanically from runs; CI validates match.
3. Router uses brief/evidence/audience/action/anti-refs/assets/constraints/stack.
4. Artificial route-hash ablation salt removed; group effects are semantic.
5. Worlds are seeds with mode-fit / evidence gates; brief-fit before diversity.
6. Critic is deterministic preflight (not `context-isolated` without external run).
7. Blind packet strips identity/provenance; invalid choice fails closed.
8. handoff-ready requires DesignSpec + handoff + selectedInternalId; dials from input.

## Still not proven (blocks PROOF PASSED)

| Gate | Result |
| --- | --- |
| Blind head-to-head vs four frozen upstreams | **not executed** — **primary quality gate** |
| SiteSmith matches or beats best upstream directionally | **unknown** |
| Three v2.3 builds + portfolio diversity | **not executed** |
| Showcase | still **0/8** |

The external comparison is **obligatory** and is not a side task. Protocol:
[HEAD-TO-HEAD-PROTOCOL.md](./HEAD-TO-HEAD-PROTOCOL.md).

Internal tests only prove mechanical function. They do **not** prove better
direction quality than taste-skill, ui-ux-pro-max, frontend-design, or impeccable.

## Advancement

```text
corrective pass reviewed
→ lock pins + five arms
→ blind head-to-head on 3 briefs
→ only then: three v2.3 builds if SiteSmith matches/wins ≥2/3
```

Outcome labels after head-to-head (not yet run):

- clear loss → `PROOF FAILED — UPSTREAM SUPERSET`
- mixed / disagreement → `PROOF FAILED — DIRECTION QUALITY`
- match/win ≥2/3 → `DIRECTION COMPARISON PASSED — BUILD PROOF REQUIRED` (still not full PROOF PASSED)

## Status

**PROOF FAILED — DIRECTION QUALITY**
