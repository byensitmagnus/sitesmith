---
title: Ablation results
status: mechanical-pass
ai_generated: "(C)"
---

# Ablation results

Machine data: [`ABLATION-RESULTS.json`](./ABLATION-RESULTS.json).

Brief: `01-leather-goods` · seed: `ablation-leather`.

## Arms

| Arm | Capabilities loaded | Card set (world ids) | Pairwise diversity |
| --- | --- | --- | --- |
| full | 18 | statement-object, editorial-bleed, split-evidence | pass |
| without taste | 14 | material-board, split-evidence, poster-type | pass |
| without uupm | 14 | statement-object, index-first, material-board | pass |
| without frontend | 12 | index-first, statement-object, split-evidence | pass |
| without impeccable | 14 | poster-type, editorial-bleed, split-evidence | pass |
| all non-rejected | 55 | statement-object, poster-type, editorial-bleed | pass |

## Interpretation

1. **Router has value:** six distinct card sets under the same brief seed when capability groups change.
2. **Loading all 55 is not free quality:** different set, higher context cost, no automatic superiority claim.
3. **This is mechanical ablation only.** It does not prove aesthetic win over upstreams.
4. Early prototype with route-independent templates produced identical cards for every arm — that false green was fixed by salting seeds with the route hash and applying group pressure to treatments/thesis.
