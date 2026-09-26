---
title: Adversarial Review C
status: fail
blockerCount: 3
reviewer: OpenAI Codex
modelIdentifier: not-exposed
contextIsolation: fork_turns=none
originalRecommendationKnown: no
date: 2026-07-30
ai_generated: "(C)"
---

# Adversarial Review C

Verdict: **FAIL** — three gate-integrity defects still permit a false green result.

Blocker count: 3

## Required closures

1. **Provenance digests are trusted, not verified by the locked checker.** `check-v3-docs.mjs` treats a group as hash-covered when `treeSha256` and each `canonicalFileSha256` merely match a 64-hex regex. It does not recompute vendored file hashes, span hashes, group trees, the 75-file coverage tree, reconstructed-source trees, carriage hashes, or the manifest self-hash. A stale or fabricated manifest can therefore satisfy the vendored-evidence test. Required closure: recompute every declared digest according to the manifest's named modes, validate path containment and the single disjoint-span overlap, and make any mismatch fail before a vendored matrix row is accepted.

2. **Thirty-one UI/UX Pro Max files lack an exact source revision in the machine-readable manifest.** The `uupm-data` group has 28 files and `uupm-python` has 3 files, but neither group nor its files binds a `sourceRevision`; the source record only supplies four possible `derivationRevisions`. This contradicts the licence gate's exact source commit/path/hash requirement and prevents deterministic source reconstruction from the manifest alone. Required closure: bind the correct revision at group or file level, validate it belongs to the source's declared derivation revisions, and verify the source file/span hash at that exact revision.

3. **A pass review can contain a contradictory finding without failing the verdict gate.** `reviewVerdictProblems` searches a finite set of status/count/blocker phrases; prose such as `Critical unresolved integrity defect: provenance is unverifiable and approval must wait.` is neither a recognised status nor a recognised blocker marker, so `status: pass` plus `blockerCount: 0` remains accepted. Required closure: replace prose inference with a structured findings collection whose severity/disposition is schema-validated, require zero open blocking/critical findings for pass, and retain the current textual checks only as defence in depth.

The reject/exclusion contracts, route-to-packet-to-submission carriage requirements, policy-hash sealing/version-bump rule, missing/inconclusive denominator, no-build-before-direction boundary, process-isolated same-provider wording, and result/superiority claim boundaries are internally explicit. That does not offset the three false-green paths above.

## Locked artifact hashes

| Artifact | SHA-256 |
| --- | --- |
| `docs/v3/UPSTREAM-FORENSICS.md` | `068a59ec4e0ff16960668ea91b82e6d4a3b473beeddc16a3a235eb5f72cef938` |
| `docs/v3/UPSTREAM-CAPABILITY-LEDGER.json` | `c2c0a4885c80545fcd81081f2dc846b23c7393ab099df78b2f42825e1d27a844` |
| `docs/v3/UPSTREAM-CAPABILITY-LEDGER.md` | `0ed859204633bfebeead8400d50c2b3b37f5c54ecacbd3b8fd75387745711abf` |
| `docs/v3/CAPABILITY-SUPREMACY-MATRIX.md` | `ac11b77b0802fe31f8f10ae8aaaa735017407cedab7f19b5b368b141ac5a3007` |
| `docs/v3/DERIVATION-ARCHITECTURE.md` | `4ea185153be5e5ab85ab20e7cd186237ead24254dfbb90b8b7c0cdbff884598e` |
| `docs/v3/QUALITY-CONTRACT.md` | `197276bef1fa369623ea107aa8bd2adc2df053b0e52698d563aa537883a5a22b` |
| `docs/v3/STRENGTH-ASSERTIONS.json` | `7acad4d93fd14f95f1d48e4a28d15590ad9b51a00def1af665fd1f049d5696dc` |
| `docs/v3/ADOPTION-ARCHITECTURE.md` | `a656428e9388fd2f90a8eb36446769be751c90bad1bdaf7fcb736bb3e14f09b9` |
| `docs/v3/LICENSE-DERIVATION-AUDIT.md` | `7e1d039794d6bf2527ed76c2da588da936141990d87bcf5ab7a5ddb86d7b822c` |
| `skills/sitesmith/THIRD-PARTY-PROVENANCE.json` | `269cac770d10d57f1e281de4062084972116c1206102400b652f26969f3b0db5` |
| `tools/check-v3-docs.mjs` | `4135c109bb5015349133e2f49e42e978fab4807ec693a7d54530aeca46e178dc` |
