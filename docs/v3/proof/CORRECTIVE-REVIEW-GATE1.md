---
status: fail
range: 5ffc2cb..4d8037b
head: 4d8037b
date: 2026-07-31
reviewer: independent-subagent
---

# Corrective Review — Gate 1

## Verdict

FAIL — CORRECTIVE BLOCKERS REMAIN

## Rubric (18)

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Canonical pins match everywhere | **pass** | `docs/v3/CANONICAL-UPSTREAM-PINS.json`: taste `e988add20dab0fa97d7a76781c48961c8184288e`, uupm `4857a2c5ef989794751a0f66b8545a4a49566286`, frontend-design `b29e7cf65e5cb78a5ac33d582270551bc74a14eb`, impeccable `6b342244e915d64b0d6e84d5eec448fd196ce6bb`. Same SHAs in `docs/v3/UPSTREAM-CAPABILITY-LEDGER.json` `frozenSources` + capability `sourceCommit` fields; `docs/v2/CAPABILITY-MANIFEST.json` `competitors.*.sha` and all `competitorSha` rows (frontend/impeccable updated in this range); `docs/v3/FOUNDATION-DECISION.md`, `docs/v3/proof/UPSTREAM-COMPARISON.md`, `docs/v3/proof/HEAD-TO-HEAD-PROTOCOL.md`. Stale `2235be7…` / `1cf7d7…` appear **only** in `tools/test-proof-integrity.mjs` forbid list (intentional). Repo grep of lock/docs JSON+MD shows no other active uses. Runtime `engine-result.json` route rows carry matching `upstreamCommit` for those sources. |
| 2 | Proof summaries match committed runs | **pass** | `DIRECTION-RESULTS.json` cards worldIds for `01-leather-goods` = `poster-type, statement-object, split-evidence` — matches `docs/v3/proof/runs/01-leather-goods/engine-result.json` `direction.cards[].worldId`. Same pattern for atelier/passage summaries vs runs. Each committed run has `proofMeta.inputHash` + `policyVersion`. `tools/test-proof-integrity.mjs` asserts summary↔run worldIds and live re-run `inputHash` equality for leather. CI step added in `.github/workflows/verify.yml`. Note: committed `engineCommit` is `ade84174…` (regeneration commit), not necessarily range head `4d8037b` — integrity gate keys off `inputHash`/cards, not HEAD SHA. |
| 3 | Router uses real brief and evidence | **pass** | Pre-range router was mode+policy only. Corrective `router.mjs` builds from `MODE_BASE` then `input.signals` extracted in `input.mjs` from brief+evidence+brand+assets+constraints (subject, audience, primaryAction, antiRefs, commerce/operational/editorial, imageless, plates, constraints). `decisionHash` includes those signal fields, stack, ablation, retrieval hit meta — not mode alone. Test fixture pair ecommerceA vs ecommerceB (same mode, different evidence) expects distinct `decisionHash`. |
| 4 | UUPM/domain retrieval claim only when consulted | **pass** | `runDomainRetrieval`: `consulted: false` if no CSV; else keyword scan. Capability `uupm.lookup.domain-knowledge` added only when `retrieval.consulted && retrieval.hits.length`; otherwise stripped. `domainRetrieval.claimAllowed = consulted && hitCount > 0`. Card evidence summary via `summariseEvidence` appends `domain-knowledge: consulted (N hits)` only when `claimAllowed`, else `not consulted`. Proof runs show `consulted: true` + `claimAllowed: true` with matching evidence string (data present under `skills/sitesmith/data/products.csv`). Not always-on base required (removed from MODE_BASE required lists). |
| 5 | Anti-references affect candidate eligibility | **pass** (narrow) | `worldEligible` reads `signals.antiRefs`; if anti text matches `/purple\|saas gradient\|handshake\|fintech/i`, rejects seeds whose **colour** has bare `\bpurple\b` without “not/no purple”. Router also loads anti-default caps when antiRefs present. **Caveat:** current `WORLD_LIBRARY` has no affirmative-purple colour (poster-type says “not purple gradient”), so anti-ref colour gate is effectively inert on the live seed set. Test #2 in `test-direction-engine.mjs` exercises **imageless** eligibility, not anti-ref colour. Residual, not a hard fail of the check’s letter. |
| 6 | Assets affect imagery strategy | **pass** | `applyGroupSemantics`: imageless forces imageless imagery; plates reinforce object-led plate copy; missing plates rewrite plate imagery to diagram slots. `worldEligible` gates photography/plate seeds on assets. Leather run imagery includes “using declared product plates from asset plan”. |
| 7 | Constraints affect results | **pass** | `signals.constraints` from `userConstraints`; `applyGroupSemantics` maps “no motion/static” → static interaction and “light mode only/no dark” → light ground colour. Router adds `TASTE-CAP-004` when constraints present. Test #4 requires static/light treatment on ecommerceB. |
| 8 | Stack affects only relevant capabilities | **pass** | Stack guidance forced only when `stack !== 'html'` **and** mode is `product-ui` or `component` (`router.mjs` ~229–239). Ecommerce/html does not force it. Test #5: nextjs product-ui includes `uupm.lookup.stack-guidance`; html product-ui does not. |
| 9 | Route-hash salting removed | **pass** | `assignSeeds` / `generateDirectionCards` entropy = `randomSeed ?? projectName` only. Comment: “NOT route hash (no artificial ablation diversity)”. No `decisionHash` in seed path. Ablation differences come from capability-group filtering + `applyGroupSemantics`. Documented in `ABLATION-RESULTS.md`. |
| 10 | Worlds only as seed material | **pass** | `WORLD_LIBRARY` labeled seed templates; cards carry `seed: { source: 'local-world-library-seed', … }`; `seedProvenance` on DesignSpec. Docs/protocol forbid scoring world-ID churn as quality. Worlds are not claimed as product quality in `PROOF-VERDICT.md`. |
| 11 | Mode-fit before diversity | **pass** | `generateDirectionCards`: eligibility filter → seed pick → sort by `briefFitScore` → select with brief-fit floor **then** `isStructurallyDifferent` pairwise. Fallback still requires brief-fit ≥ 1. Product-ui mode gates out material-board/editorial-bleed without plates; poster-type only when imageless. Critic also flags mode-misfit. |
| 12 | Blind packet leaks no identity/provenance | **fail** | `blindCandidates` strips top-level `worldId`/`internalId`/`seed`/`capabilityProvenance`/`groupsApplied`/`semanticGroupEffects`, and `assertNoBlindLeakage` only checks those keys. **But** blind fields still embed seed identity: (1) `signatureElement` = `` `${subjectToken}-${world.worldId}` `` e.g. `northline-statement-object`; (2) `differenceNote` lists peer worldIds e.g. `Differs from poster-type, split-evidence…`. Committed proof: `docs/v3/proof/runs/01-leather-goods/engine-result.json` blinded L1–L3. Evaluator can recover seed catalog IDs from the blind packet. Contradicts `PROOF-VERDICT.md` claim #7 (“Blind packet strips identity/provenance”). |
| 13 | Local scorer not claimed context-isolated without evidence | **pass** | Default `critiqueBlindedCards`: `independence: 'deterministic-preflight'`, `role: 'deterministic-preflight'`, notes say “not an independent critic verdict”. `context-isolated` only if `options.externalRunEvidence === true`. Blind claim string: “local keyword preflight only — not context-isolated external critic”. Committed runs: `independence: "deterministic-preflight"`, `externalRunEvidence: false`. Integrity test fails if run claims isolation without evidence. |
| 14 | Invalid choice fails closed | **pass** | `resolveChoice`: unknown `userChoiceBlindId` → `status: 'error'`, `problems: ['unknown blind id: …']`, no selection. `runDirectionEngine` returns `ok: false`, stage `choice` — not handoff-ready. Tests: resolveChoice L9; engine L99. |
| 15 | handoff-ready requires DesignSpec + handoff | **pass** | Stage `handoff-ready` only after successful `compileDesignSpec` + `validateDesignSpec` + `buildHandoffPackage`; explicit guard requires selectedCard, spec, handoff, selectedInternalId. Missing any → stage/error, not handoff-ready. |
| 16 | Dials not hardcoded | **pass** | Hardcoded `visual-density: 5` / motion 3 / boldness 6 removed. `extractDials` from brief/evidence; `dialLine` writes values or `unknown`. Leather axis record shows density 6, motion 2, boldness 6 from brief. Test asserts no hardcoded 5 when brief says 6. |
| 17 | Tests can fail on realistic regressions | **pass** (with soft spots) | Non-tautological cases: same-mode different route hashes; stack nextjs vs html; blind key leakage keys; invalid choice; isolation claim; product-ui seed rejection; LF/CRLF inputHash parity; handoff dials. Soft/tautological: asset test #3 always `ok` if g1 succeeds (both branches call ok); anti-ref test is imageless not anti-colour. Still sufficient to fail real regressions on choice, isolation, routing, product-ui fit. |
| 18 | No full M0–M10 runtime sneaked in | **pass** | Slice remains `direction-engine` modules + proof regen/integrity tools. Policy id `direction-engine-v3-slice-1.0.0`. No M0–M10 module runtime, no v2.3 build rewrite, no full architecture implementation in this range. `PROOF-VERDICT` / `CURRENT-REPO-TRUTH` still withhold full M0–M10 approval. CLI: route → cards → preflight → DesignSpec → handoff only. |

## Blockers (if any)

1. **Blind packet identity leak (rubric 12).** `signatureElement` and `differenceNote` embed seed `worldId` values in the public blind packet (`blindCandidates` + committed `engine-result.json` for all three proof briefs). `assertNoBlindLeakage` does not detect substring/field-content leaks. Fix before freeze: strip or re-key signatures/difference notes for blind evaluation (opaque IDs only); extend leakage assert to ban known `WORLD_LIBRARY` ids and internal tokens in any string field of the blind card.

## Residual risks (non-blocking)

1. Anti-reference eligibility gate is almost dead code against the current seed library (only bare-purple colour); handshake/fintech anti-refs do not filter seeds by themselves.
2. Subject extraction leaves a trailing quote artifact (`Northline Leather Goods\"`) visible in theses and signatures — pollutes grounding quality, not the isolation claim.
3. Asset/imagery unit test can pass without proving imagery change; strengthen before relying on CI alone for asset regressions.
4. `HEAD-TO-HEAD-PROTOCOL.md` still says “`8aee864` or later” while this review range head is `4d8037b` — stale gate phrase, not a pin mismatch.
5. Mechanical ablation remains non-aesthetic; green unit tests still do **not** mean direction quality vs upstreams (correctly stated as PROOF FAILED — DIRECTION QUALITY).

## Tests run

- `node tools/test-direction-engine.mjs` — **not executed in this subagent session** (no shell/exec tool available). Reviewed test source + engine implementation for failability and coverage.
- `node tools/test-proof-integrity.mjs` — **not executed**; reviewed assertions against live files (pins, stale forbid list, summary↔run worldIds, critic independence fields, inputHash presence). Static consistency of leather summary worldIds vs `engine-result.json` checked by direct file read.

Parent should re-run both commands on head `4d8037b` before any freeze ceremony.

## Notes

- Product status in docs correctly remains **`PROOF FAILED — DIRECTION QUALITY`**. This Gate 1 review does **not** start head-to-head and does **not** claim proof passed.
- Most corrective themes (pins, signal-aware router, honest retrieval, salt removal, preflight critic labeling, fail-closed choice, dials, handoff validation) are implemented and evidenced.
- Single hard blocker is blind-packet seed-ID leakage; until fixed, “ready to freeze head-to-head” is false because a frozen blind arm would still expose SiteSmith seed catalog identity to evaluators (and the corrective claim in `PROOF-VERDICT.md` is overstated).
- After blind fix: regenerate proof runs/summaries, re-run integrity + direction-engine tests, re-review #12 only if other files unchanged.
