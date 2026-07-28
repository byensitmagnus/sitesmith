# Release gap plan

Eight P0 gaps stand between `48aa17c` and version 1.0. Four P1 items are recorded and
deferred. No new architecture: every P0 is a missing part of the pipeline that already
exists, and the gate layer is frozen.

Source: [`CAPABILITY-MANIFEST.json`](CAPABILITY-MANIFEST.json), audited against the four
competitor commits in [`FINAL-COMPETITOR-AUDIT.md`](FINAL-COMPETITOR-AUDIT.md).

---

## P0 — required for 1.0

| # | Gap | Status | Where it lands | Done when |
| --- | --- | --- | --- | --- |
| 1 | **aesthetic-thesis** — a signature that can be shown to exist | partial | `DIRECTION.md` gains `signature-selector` and `signature-min-share` in all three pilots | `direction-fidelity.mjs` reports the selector present at or above its declared share |
| 2 | **visual-relevance-and-dominance** — imagery that carries the page | partial | pilot revisions | asset share of the first screen clears what the declared imagery commits to: 12 % object-led, 4 % diagram-led |
| 3 | **brandkit-and-reference-board** — inventory an existing brand | missing | a `brand` step before the direction lab | a supplied logo and palette are recorded and reused rather than reinvented |
| 4 | **ecommerce-factual-discipline** — never invent commerce facts | partial | production gate | a page asserting a price, review count, delivery promise or certification with no source in `EVIDENCE.md` fails |
| 5 | **command-vocabulary** — named commands, declared as data | missing | one canonical source | `init, shape, build, audit, harden, polish, doctor` exist and are bound to pipeline steps |
| 6 | **install-update-doctor** | missing | `tools/` + canonical source | one documented command installs into a fresh temporary directory; `update` and `doctor` work |
| 7 | **provider-packages** — Claude, Codex, Cursor from one source | missing | generator over the canonical source | all three trees regenerate identically and a drift check fails when they do not |
| 8 | **measured-proof** — the 18 isolated generations | partial | the frozen runner at `f73fb89` | both probes green, 18 runs reported with medians, no token count used as quality |

### Ordering

Gaps 1 and 2 are inside the pilot revision, which is the next action. Gap 4 is a production-gate
rule and rides with it. Gaps 5, 6 and 7 are the product layer and belong after the benchmark,
in phase 8. Gap 8 is the benchmark itself.

That gives the sequence the mission already sets: revise the pilots → blind preflight →
freeze → benchmark → product layer → release. Nothing here reorders it.

---

## P1 — after 1.0, recorded so it is not lost

| Gap | Decision | Why it waits |
| --- | --- | --- |
| **stack-specific-implementation** | adapt | Real, and no exit gate depends on it: the three pilots and all three benchmark briefs are plain HTML and CSS. The 25 stack CSVs are vendored and unused; routing to them is a v1.1 feature. |
| **guided-variation-dials** | adapt | taste-skill exposes density, motion and boldness as dials. SiteSmith's variation currently comes only from the direction lab, which works but gives the user nothing to turn. |
| **deterministic-antipattern-detector** | adapt | `tools/conformance.mjs` checks text over files; impeccable checks computed style in a browser. Worth having, not worth blocking a release. |
| **redesign-existing-site** | adapt | The v2 pipeline is written for a new build. Inventorying an existing component library and reusing it is a distinct workflow. |

## Intentionally rejected

**live-feedback.** impeccable's live mode is roughly seventeen modules plus framework adapters
for Svelte, SvelteKit and TanStack, a session store, and a manual-edit commit path. It is a
product in its own right. It does not serve the closed loop SiteSmith is claiming — evidence,
direction, contract, journeys, verification, proof — and a thinner copy of it would cost the
release without strengthening the position. Recorded as rejected with the reason, not omitted.

---

## What this audit did not find

No fifth competitor was consulted and none is needed. Two findings are worth stating plainly
because they change what "catching up" means:

**Volume is not capability.** taste-skill's 87 KB `SKILL.md` and pro-max's 743 KB
`google-fonts.csv` are large without being pipelines. Neither is a gap, and this plan does not
treat them as one.

**No competitor measures its own output.** None of the four has a benchmark, an isolation
harness, or a claim about its effect that a reader could check. That is SiteSmith's strongest
position and it is currently unproven — which is exactly why gap 8 is P0 and not P1.
