---
title: Direction Engine proof verdict
status: final
verdict: PROOF FAILED — DIRECTION QUALITY
ai_generated: "(C)"
---

# Proof verdict

## Single status line

```text
PROOF FAILED — DIRECTION QUALITY
```

## What is green (mechanical)

| Gate | Result |
| --- | --- |
| Repo truth documented | pass — `CURRENT-REPO-TRUTH.md` |
| Review integrity mechanical | pass — foundation no longer false-PASS; `test-review-integrity.mjs` green |
| Full M0–M10 approval | correctly **not ready** |
| Router loads subset | pass — 12–18 of 59; never default-all |
| Routing reproducible | pass — stable `decisionHash` |
| Direction pairwise diversity | pass — three briefs |
| Round-8 recipe avoided in cards | pass |
| Blinding / user choice / reject-all path | pass in unit tests |
| DesignSpec + handoff withhold losers/scores | pass |
| Ablation changes card sets | pass — 6 unique sets |
| Existing v2.3 shell rewritten | no — slice only |

## What is red / missing (blocks PROOF PASSED)

| Gate | Result |
| --- | --- |
| Blind visual comparison vs four frozen upstreams | **not executed** |
| SiteSmith matches or beats best upstream directionally | **unknown — not measured** |
| Two separate human/agent review contexts on rendered comps | **not executed** |
| Ablation proves aesthetic fusion value (not only card-id churn) | **partial — mechanical only** |
| Three v2.3 builds + fidelity + portfolio diversity | **not executed** |
| Showcase | still **0/8** |

## Why this verdict (not PROOF PASSED)

Success criteria require that **actual visual direction output** match or beat the best upstream under blinded comparison, then survive v2.3 build proof. Completeness of documentation and green unit tests are explicitly **not enough**.

Without upstream runs, claiming PROOF PASSED would recreate the same integrity failure we just fixed on the foundation document.

## Why not other stop labels

| Label | Why not |
| --- | --- |
| BLOCKED — REPO TRUTH MISMATCH | `dc00598` matched the v3 package |
| BLOCKED — REVIEW INTEGRITY FAILURE | defect found **and corrected**; gate is green |
| PROOF FAILED — ROUTING | routing gates pass |
| PROOF FAILED — UPSTREAM SUPERSET | we did not measure a loss; we did not measure at all |
| PROOF FAILED — DESIGNSPEC HANDOFF | handoff schema tests pass |
| PROOF FAILED — COMPLEXITY EXCEEDS VALUE | slice stayed small; not the failure mode |
| PROOF PASSED | forbidden without upstream blind win + builds |

## Next minimal step (if continuing)

1. Clone four locked upstream commits.
2. Run same three briefs through each + SiteSmith engine with comparable budgets.
3. Blind-score with two contexts.
4. Only on directional win/match: run three v2.3 builds.

Do **not** expand to M0–M10 to “fix” a missing comparison.
