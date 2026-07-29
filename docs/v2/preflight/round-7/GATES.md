# Round 7 — the frozen gates, run from outside

Every gate at the version frozen before the three independent builds. No threshold moved and
no page was touched to produce these numbers. Servers on 4611/4612/4613 serving
`pilots/0*/site` directly from the working tree.

Two of these gates fail. They are recorded here failing.

## What passes

| gate | 01-chandlery | 02-foundry | 03-cask-console |
| --- | --- | --- | --- |
| `verify` — console, links, status, overflow, structure | PASS | PASS | PASS |
| axe, both colour schemes, 375/768/1440 | **0 violations** | **0 violations** | **0 violations** |
| `direction-fidelity` | PASS | PASS | PASS |
| `journey` | 1 passed | 1 passed | 1 passed |

`verify` now fails closed when axe does not run, so "0 violations" is a measurement rather
than the absence of one. That was blocker 3 and it is the reason the row can be read at all.

`direction-fidelity` passing on all three was blocker 2. Two of the three could not be parsed
before this round, so two of the three had never actually been checked against their own
directions. The gate now says the record is unreadable instead of failing the page.

Two of the three raise `note the rhythm axis is not classifiable`. A note is not a failure and
is left standing rather than tuned away.

## Token discipline

Reported, not gated. Distinct values over loose literals.

| pilot | tokens | colour | radius | spacing | font-size | shadow | families |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01-chandlery | 31 | 32/2 | 1/1 | 16/14 | 20/20 | 2/0 | 0 |
| 02-foundry | 34 | 14/3 | 0/0 | 19/18 | 6/6 | 0/0 | 0 |
| 03-cask-console | 32 | 12/0 | 0/0 | 5/4 | 18/18 | 0/0 | 0 |

Spacing and font-size are chosen at the call site far more often than colour is. Three agents
who never met all tokenised their palette and all improvised their scale.

## What fails — 1: production-gate, all three

Run from each pilot's own root, which is where `journeys/` sits beside `site/`.

| pilot | blocking |
| --- | --- |
| 01-chandlery | 1 — no logo row in `ASSET-MANIFEST.md` |
| 02-foundry | 2 — no logo row; one inline `<svg>` with no `data-asset` id |
| 03-cask-console | 1 — no logo row in `ASSET-MANIFEST.md` |

Every one of the three built a mark. Not one of them recorded it as an asset. Three agents
with no contact with each other made the same omission, which makes it an instruction fault
rather than three oversights: the skill asks for a mark and does not say that the mark is a
row in the manifest like any other picture.

Not fixed here. The pilots are not to be patched while the review is in flight, and the fix
belongs in the skill's wording, not in three manifests.

## What fails — 2: portfolio-diversity, 5 findings

```
site    ground              lum    display               assets  mono  hair  layout
site 1  rgb(235, 226, 204)  0.764  Bahnschrift           22.2%      0    75  table+split4+object
site 2  rgb(11, 13, 12)     0.004  system-ui             68.7%     18   112  table+split4+object
site 3  rgb(234, 230, 221)  0.793  Bahnschrift Condense   0.0%    118   245  table+split3
```

- palette: sites 1 and 3 share the light-warm ground within 0.029 luminance
- device: all three use hairline borders as the separator
- device: all three use tabular figures as a motif
- device: all three use no elevation anywhere
- layout: sites 1 and 2 build the first screen the same way

This is the finding of the round.

The three sites were built by three agents in separate contexts, with no shared conversation,
no shared workspace, no shared screenshots, and no sight of each other's work. They were given
the same skill and three unrelated trades. They converged anyway.

A blind reviewer who saw only the sheets, and who could not read this table, arrived at the
same place unprompted: *"one studio and one method, three real executions — the shared hand
shows in structure, not styling."* That reviewer named the hairlines, the tabular figures, the
single accent, the square buttons, and the same rhetorical move of headlining a refusal. Two
instruments that cannot see each other agree.

So the convergence is not agents copying agents. It is the skill having a house style and not
knowing it. That is a real finding about SiteSmith, it is worth more than a passing gate, and
it is not repairable by editing three pages — which is exactly why the pages stay as they are.
