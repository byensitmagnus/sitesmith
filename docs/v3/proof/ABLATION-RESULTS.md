---
title: Ablation results
status: mechanical-pass-semantic-limited
ai_generated: "(C)"
---

# Ablation results

Machine data: [`ABLATION-RESULTS.json`](./ABLATION-RESULTS.json).

Brief: `01-leather-goods` · seed: `ablation-leather`.

## Policy

Route-hash salting that forced different card IDs without semantic change is **removed**.

Ablation differences are only meaningful when `semanticGroupEffects` or grounded treatments change for a documented reason (e.g. without frontend → conservative type; without UUPM retrieval → no domain-knowledge claim).

## Interpretation

1. **Router has value:** decision hashes change with capability sets and project signals.
2. **Card-ID churn alone is not a win.** Prefer treatment-level diffs in JSON arms.
3. **This is mechanical ablation only** — not aesthetic superiority.

See also `PROOF-VERDICT.md`.
