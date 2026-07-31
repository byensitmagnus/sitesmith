---
title: Fairness contract — upstream direction head-to-head
status: frozen
ai_generated: "(C)"
---

# Fairness contract

**Status:** frozen for screening (and replication if approved).  
**Proof status remains:** `PROOF FAILED — DIRECTION QUALITY` until comparison completes.

## Equal inputs

- Same context pack per brief for all five arms.
- Same model/provider class within a round when technically possible.
- Same token budget per run.
- Same wall-clock budget per run.
- Same iteration count (one primary generation path; upstream-native loops allowed only if that is their documented normal workflow and still within budgets).
- Same tool-access level (read brief pack + arm-native tools only).
- Fresh context per run.
- Fresh workspace per run.
- No cross-run memory.
- Randomized run order.
- No live scoring during generation.
- At most one retry, only for documented infrastructure failure.
- Poor quality is not a retry reason.
- No prompt changes after first output is seen.
- No cherry-picking briefs or arms after scores exist.

## Native workflows allowed

| Arm | Allowed native behaviour |
| --- | --- |
| taste-skill | Design Read and dials |
| ui-ux-pro-max | Actual retrieval + design-system generator |
| frontend-design | Creative thesis, plan, self-critique |
| impeccable | Concept seed, challengers, reroll, normal decision process |
| SiteSmith | Frozen Direction Engine + v2.3 handoff |

Upstreams must **not** be artificially reduced to inflate SiteSmith.

SiteSmith must **not** receive extra context, assets, time, iterations, or access to upstream outputs.

## Normalization

See `OUTPUT-SCHEMA.json`. Extract/structure/reformat only.

## Isolation

- No candidate knows other candidates, other outputs, evaluator rubric, or rank position.
- Evaluator contexts are separate and blind.

## Invalidation

Any change to packs, pins, fairness rules, budgets, or SiteSmith/upstream code after freeze invalidates the round.
