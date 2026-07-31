---
title: Corrective Review Gate 1
status: pass
blockerCount: 0
range: 5ffc2cb..db8977d
head: db8977d
date: 2026-07-31
reviewer: independent-subagent
prior_fail_head: 4d8037b
ai_generated: "(C)"
---

# Corrective Review — Gate 1

## Verdict

PASS — READY TO FREEZE HEAD-TO-HEAD

## Rubric (18)

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Canonical pins match everywhere | **pass** | `docs/v3/CANONICAL-UPSTREAM-PINS.json`: taste `e988add…`, uupm `4857a2c…`, frontend-design `b29e7cf…`, impeccable `6b34224…`. Spot-check: leather `engine-result.json` route rows carry matching `upstreamCommit` for taste. No pin drift observed vs prior Gate 1 pass on #1. |
| 2 | Proof summaries match committed runs | **pass** | `DIRECTION-RESULTS.json` leather cards worldIds `poster-type, statement-object, split-evidence` match `runs/01-leather-goods/engine-result.json` `direction.cards[].worldId`. Summaries still list same signatures (`northline-sig-1/2/3`). `proofMeta.inputHash` + `policyVersion` present. Committed `engineCommit` remains `4d8037b…` (pre-blind-fix regen) while HEAD is `db8977d` — integrity still keys off inputHash/cards, not HEAD SHA. |
| 3 | Router uses real brief and evidence | **pass** | Spot-check unchanged: `router.mjs` / `input.mjs` signal path (subject, audience, primaryAction, antiRefs, assets, constraints); `decisionHash` includes signal fields. Leather route `whyRelevant` embeds subject+action, not mode-only. |
| 4 | UUPM/domain retrieval claim only when consulted | **pass** | `claimAllowed = consulted && hits.length`; evidence summary appends consulted only when allowed. Leather blind evidence string: `domain-knowledge: consulted (5 hits)` with retrieval path present. |
| 5 | Anti-references affect candidate eligibility | **pass** (narrow) | `worldEligible` + anti-default caps when antiRefs present. Same residual: live seed library has no affirmative bare-purple colour, so colour anti-gate is inert on current catalog. Not a hard fail. |
| 6 | Assets affect imagery strategy | **pass** | Leather imagery: “using declared product plates from asset plan”; atelier missing plates → “diagram-led evidence slots until plates exist”; passage imageless → chrome/type carry first screen. |
| 7 | Constraints affect results | **pass** | Signal path + `applyGroupSemantics` for motion/dark constraints still present (prior evidence; no regression in range head). |
| 8 | Stack affects only relevant capabilities | **pass** | Stack guidance forced only when `stack !== 'html'` and mode is `product-ui` or `component` (`router.mjs`). |
| 9 | Route-hash salting removed | **pass** | `generateDirectionCards` comment + entropy = `randomSeed ?? projectName` only — “NOT route hash”. |
| 10 | Worlds only as seed material | **pass** | Cards carry `seed.source: local-world-library-seed`; worlds not claimed as product quality in `PROOF-VERDICT.md`. |
| 11 | Mode-fit before diversity | **pass** | Eligibility → brief-fit sort → pairwise diversity. Product-ui still gates marketing-bleed seeds. |
| 12 | Blind packet leaks no identity/provenance | **pass** | **Prior blocker fixed at `db8977d`.** Code: `blindCandidates` re-keys `signatureElement` to `${subjectToken}-sig-${label}` (L1…) and fills `differenceNote` with peer **blindIds** only; strips `worldId`/`internalId`/`seed`/`capabilityProvenance`/`groupsApplied`/`semanticGroupEffects`. `assertNoBlindLeakage` now bans (1) those keys, (2) every `WORLD_LIBRARY` id substring, (3) `\bW[1-9]\d*\b`, (4) capability-id patterns, (5) `local-world-library-seed`. Tests assert no catalog ids in JSON.stringify(blind), signature contains blindId, differenceNote uses `Differs from L\d`. **Committed blinded packets (all 3 runs):** e.g. leather `northline-sig-L1/L2/L3`, notes `Differs from L2, L3…` — **no** `poster-type`/`statement-object`/`split-evidence`/W#/capability ids inside `blinding.blinded[]`. Internal `direction.cards[].differenceNote` still uses W# (expected; not the blind packet). `blinding.key` L→W is the experimenter reveal map, not evaluator blind content. |
| 13 | Local scorer not claimed context-isolated without evidence | **pass** | Committed critic: `independence: "deterministic-preflight"`, `externalRunEvidence: false`, notes “not an independent critic verdict”. |
| 14 | Invalid choice fails closed | **pass** | `resolveChoice` unknown blind id → error; engine not handoff-ready (tests + code path unchanged). |
| 15 | handoff-ready requires DesignSpec + handoff | **pass** | Explicit guard in `index.mjs`; all three proof runs stage `handoff-ready` with both artifacts present. |
| 16 | Dials not hardcoded | **pass** | `extractDials` from input; leather axis still density 6 / motion 2 style values from brief (prior + DesignSpec path). |
| 17 | Tests can fail on realistic regressions | **pass** (with soft spots) | Blind test #8 now content-aware (substring + signature/differenceNote shape). Soft spots remain: asset test always-ok branch; anti-ref colour not unit-tested. Sufficient for choice/isolation/routing/product-ui/blind regressions. |
| 18 | No full M0–M10 runtime sneaked in | **pass** | Slice remains direction-engine + proof tools. Policy `direction-engine-v3-slice-1.0.0`. `PROOF-VERDICT` still `PROOF FAILED — DIRECTION QUALITY`. Head-to-head **not** executed. |

## Blockers (if any)

None.

## Residual risks (non-blocking)

1. Anti-reference colour eligibility gate is almost dead code against the current seed library (only bare-purple); handshake/fintech anti-refs do not filter seeds by themselves.
2. Subject extraction still leaves trailing quote artifact (`Northline Leather Goods\"`, `Atelier Møn Printworks\"`, `Passage Log Console\"`) in theses/grounding — grounding quality, not isolation.
3. Asset/imagery unit test can pass without proving imagery change.
4. Committed proof `engineCommit` / summary `engineCommit` still pin `4d8037b…` while HEAD is `db8977d` (blind-strip commit). Integrity does not require HEAD equality; optional regen hygiene before freeze ceremony.
5. Mechanical ablation remains non-aesthetic; green Gate 1 does **not** mean direction quality vs upstreams. Product status correctly remains **PROOF FAILED — DIRECTION QUALITY** until head-to-head runs.

## Tests run

- `node tools/test-direction-engine.mjs` — **not executed in this subagent session** (static review of test + implementation). Blind case #8 source requires clean leakage + L-form signatures/notes.
- `node tools/test-proof-integrity.mjs` — **not executed**; static check of summary↔run worldIds and critic independence fields.

Parent should run both on HEAD `db8977d` before freeze ceremony.

## Notes

- Range head verified: `.git/refs/heads/codex/v3-direction-engine-proof` = `db8977dfd35db79e4b7e15e5e8d0486f6f57f51e` (`fix: strip worldId from blind signature and difference notes`).
- Prior sole hard blocker (#12 blind identity leak in `signatureElement` / `differenceNote`) is closed in code, tests, and committed `blinding.blinded` for all three briefs.
- This review does **not** start head-to-head and does **not** claim PROOF PASSED.
- Gate 1 freeze readiness means: corrective mechanical claims are review-clean; external quality gate is still obligatory and open.
