---
title: Head-to-head cost estimate
status: planning-estimate
ai_generated: "(C)"
---

# Cost estimate (planning bounds — not invoices)

**Uncertainty:** high. Provider list prices, cache hits, host tool overhead, and Grok credit metering are **not** measured in this repo. Figures below are deliberate upper-bound **planning** estimates for approval, not billable totals.

## Shared assumptions

| Parameter | Value |
| --- | --- |
| Token budget / run | 120 000 (input+output combined ceiling) |
| Wall-clock / run | 45 minutes ceiling |
| Iterations / run | 1 primary path (+ at most 1 infra retry) |
| Model class | frontier coding agent (host-dependent) |

## Screening (15 runs)

| Metric | Estimate | Uncertainty |
| --- | --- | --- |
| Runs | 15 | exact |
| Tokens (sum of ceilings) | ≤ 1 800 000 | high (actual often much lower) |
| Wall-clock sequential | ≤ 11.25 h | medium (parallelism may reduce calendar time) |
| Wall-clock if 3-way parallel | ~4 h calendar | medium |
| Provider / credit cost | **unknown** without host billing | cannot claim DKK/$ |
| Credentials required | Host with skill install rights; network for upstream install if not vendored; **no** SiteSmith production secrets | — |

## Replication (optional, +15 runs)

| Metric | Estimate | Uncertainty |
| --- | --- | --- |
| Runs | 15 additional | exact if approved |
| Tokens (ceilings) | ≤ 1 800 000 additional | high |
| Wall-clock sequential | ≤ 11.25 h additional | medium |
| Provider / credit cost | **unknown** | cannot claim DKK/$ |

## Evaluators (not included in the 15× arms)

Blind evaluation uses ≥2 independent evaluator contexts. Token/cost **not** included above; budget separately if evaluators are paid model calls.

## What is **not** claimed

- Exact OpenAI / Anthropic / xAI invoice amounts
- That Grok subscription credits equal the token ceilings
- That dry-run consumed paid credits (it must not)

## Approval gate

No screening or replication model calls until explicit user approval of this estimate and fairness freeze.
