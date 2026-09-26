---
title: "SiteSmith v3 adversarial review D"
status: fail
blockerCount: 2
findingCount: 4
reviewer: OpenAI Codex
modelIdentifier: not-exposed
contextIsolation: fork_turns=none
originalRecommendationKnown: no
date: 2026-07-30
ai_generated: "(C)"
---

# SiteSmith v3 adversarial review D

Structured verdict: **FAIL**. Two open critical integrity findings prevent a readiness conclusion. The locked documents correctly limit product, benchmark, and superiority claims, but the machine gate can still produce false-green evidence on duplicate JSON keys and unavailable upstream source objects.

## 1. Received and withheld material

Received as the complete evidentiary set: `docs/v3/UPSTREAM-FORENSICS.md`; `docs/v3/UPSTREAM-CAPABILITY-LEDGER.json`; `docs/v3/UPSTREAM-CAPABILITY-LEDGER.md`; `docs/v3/CAPABILITY-SUPREMACY-MATRIX.md`; `docs/v3/DERIVATION-ARCHITECTURE.md`; `docs/v3/QUALITY-CONTRACT.md`; `docs/v3/STRENGTH-ASSERTIONS.json`; `docs/v3/ADOPTION-ARCHITECTURE.md`; `docs/v3/LICENSE-DERIVATION-AUDIT.md`; `skills/sitesmith/THIRD-PARTY-PROVENANCE.json`; and `tools/check-v3-docs.mjs`.

Withheld from evidentiary review: `docs/v3/FOUNDATION-DECISION.md`, every pre-existing file under `docs/v3/reviews/`, chat history, previous recommendations, and substantive agent messages. Coordination instructions disclosed neither an original recommendation nor another review's conclusions.

## 2. Method, attacks, and limitations

- SHA-256 was computed for all 11 locked artifacts before inspection and again after the report was completed. JSON was independently strict-parsed, with duplicate-key mutations held in memory.
- The checker was inspected as executable policy. Attacks targeted declared/self digests, source pins and blobs, spans, licence carriage, paths, overlaps, review verdict parsing, StrengthAssertion seals, routing parity, reject semantics, exact-once mapping, and claim boundaries.
- Read-only Git object-existence checks tested whether declared source blobs were actually available. No tracked source file was mutated; attempted fixtures were in memory or isolated temporary state only.
- This is process-isolated only (`fork_turns=none`) and uses the same provider/model family. It is **not model-independent**. No product build, provider execution, human benchmark, or superiority experiment was run.

## 3. Locked artifact SHA-256

| Artifact | SHA-256 |
|---|---|
| `docs/v3/UPSTREAM-FORENSICS.md` | `6355c3c5b641fdcf458b12253460f3915d8a1a5c337a3d716b0f525cba69b811` |
| `docs/v3/UPSTREAM-CAPABILITY-LEDGER.json` | `c2c0a4885c80545fcd81081f2dc846b23c7393ab099df78b2f42825e1d27a844` |
| `docs/v3/UPSTREAM-CAPABILITY-LEDGER.md` | `90796a22473c7d44b14630b81dfc3cd3992b3f575192ab2562565a9a8f2e035b` |
| `docs/v3/CAPABILITY-SUPREMACY-MATRIX.md` | `ac11b77b0802fe31f8f10ae8aaaa735017407cedab7f19b5b368b141ac5a3007` |
| `docs/v3/DERIVATION-ARCHITECTURE.md` | `4ea185153be5e5ab85ab20e7cd186237ead24254dfbb90b8b7c0cdbff884598e` |
| `docs/v3/QUALITY-CONTRACT.md` | `197276bef1fa369623ea107aa8bd2adc2df053b0e52698d563aa537883a5a22b` |
| `docs/v3/STRENGTH-ASSERTIONS.json` | `623e3975c2fee543f8dfce1c70a4edcbf473c405f4548c2c84ab58d97f483f80` |
| `docs/v3/ADOPTION-ARCHITECTURE.md` | `a656428e9388fd2f90a8eb36446769be751c90bad1bdaf7fcb736bb3e14f09b9` |
| `docs/v3/LICENSE-DERIVATION-AUDIT.md` | `7b501f0176b8b6c60966cdaab2c5aaebfa09398f0d42709b8017bf23d7a3f048` |
| `skills/sitesmith/THIRD-PARTY-PROVENANCE.json` | `1580635046d34d11eb1fdd9ef4dff55b09bf98be8ddd7666b463f1fc7b6a3428` |
| `tools/check-v3-docs.mjs` | `6d344aa8e112efd430469668e06fce9aa4705f5076df5954a517f28e8dfa5246` |

## 4. Exact attack outcomes

| Attack | Outcome | Evidence |
|---|---|---|
| Manifest-declared digest tampering | **FALSE GREEN / open critical** | The manifest's self-hash is recomputable by the same party changing the manifest. More importantly, source verification is conditional on `gitBlobContents(...)` returning a blob; absence adds no problem. Seven of 32 declared source blobs are currently absent locally, so a syntactically valid replacement source blob/SHA remains unanchored. |
| Duplicate JSON keys | **FALSE GREEN / open critical** | The provenance manifest and review envelope use `parseStrictJson`, but the capability ledger and strength contract use `JSON.parse`. In-memory duplicate `schemaVersion` fixtures were accepted by the parser used on those two contracts and rejected by the checker's strict parser. |
| Exact 26-field ledger schema and human counts | **Current artifact passes; duplicate-key bypass remains** | Strict parsing of the current ledger found 59 capabilities. Current prose reports exactly 26 fields, 59/59 records with 26/26 fields, source counts 19/15/10/15, and total 59. Exact object-key comparison is sound only after strict parsing is applied. |
| Source revision/path/blob/source SHA drift | **Partial reject, partial false green** | Revisions and path syntax are pinned, and present blobs are rehashed. Missing Git objects are silently skipped rather than rejected; 7/32 declared blobs were absent. |
| UUPM per-file revision override | **Rejected** | Data/Python groups require one audited group revision; per-file override and plural-revision fallback are explicitly rejected and covered by self-test. |
| Frontend-design heading/span fabrication | **FALSE GREEN / open critical** | The declared frontend source blob is one of the absent objects. The checker compares the local span hash to the manifest's claimed source-span hash, but cannot recompute the selector/span from upstream; therefore a local heading or fabricated source span can be re-labeled and rehashed together. |
| Impeccable 32 repoints and terminal LF | **Rejected on drift** | Reconstruction requires exactly 32 reference repoints, the named derivation transform, terminal-LF behavior, per-file reconstructed hashes, and the reconstructed source-tree hash. |
| Apache substitution/truncation and Appendix completeness | **Rejected** | The complete Apache-2.0 canonical text is pinned to `cfc7749…523d30`; substitution is a self-test negative control. The full-file digest includes the Appendix, so truncation or Appendix removal changes the digest. |
| Path escape and overlapping spans | **Rejected** | POSIX-relative syntax, lexical containment, realpath containment, the sole allowed overlapping file, group identities, and disjoint local ranges are checked. Escape and overlap mutations are negative self-tests. |
| Review prose/frontmatter/fence/count/status bypass | **Bypasses tested are rejected; faithful FAIL is unsupported** | Duplicate/case-variant verdict fields, contradictory prose/counts, duplicate or malformed findings fences, duplicate JSON keys, and open critical findings under PASS are rejected. Separately, the validator hard-codes canonical status `pass` and blocker count zero, so a truthful FAIL report cannot itself satisfy the full review validator. |
| Strength seal and policy drift | **Partial reject, duplicate-key false green** | Canonical predicate hashes bind current policy file SHA values and semver history. A semantic policy mutation changes the seal, but duplicate keys in the strength contract are normalized by `JSON.parse` before those checks. |
| Route to packet to submission parity | **Textual gate only / open major** | Required fields and parity language are matched by broad regular expressions and string presence. This is useful document linting but not executable evidence that independent route, packet, work-order, and submission implementations preserve identical sets and digests. |
| Reject semantics and exact-once capability mapping | **Rejected on tested drift** | Rejects require successor `none`, exclusion-only placement, named loss, no preservation wording, and matching rejection IDs. Matrix and readable ledger coverage require each of 59 capability IDs exactly once; architecture disposition requires 55 carried and four rejected. |
| Product, benchmark, and superiority claims | **Boundary preserved** | The reviewed material describes proposed architecture and an unexecuted quality contract. It does not supply a product result, completed benchmark, independent outcome, or superiority proof; none should be inferred from this review. |

## 5. Required closure

1. Parse both canonical JSON contracts with the existing strict parser before any schema, seal, count, or mapping check.
2. Fail closed when any declared source revision/blob/path cannot be resolved, and recompute every source file/span from that resolved object rather than equating two manifest-declared hashes.
3. Add a tamper fixture that changes local source text plus all descendant file/span/tree/self digests and prove an independently pinned upstream digest rejects it.
4. Separate review schema validity from approval policy so a structurally valid FAIL report remains valid while readiness still fails.

```review-findings
{"schemaVersion":1,"findings":[{"id":"D-001","severity":"critical","disposition":"open","summary":"The ledger and StrengthAssertion contracts are parsed with JSON.parse, so duplicate keys can be normalized away before exact-schema and seal checks."},{"id":"D-002","severity":"critical","disposition":"open","summary":"Upstream source verification fails open when a declared Git blob is unavailable; 7 of 32 declared blobs are absent, including frontend-design, leaving source spans and related digest claims self-declared."},{"id":"D-003","severity":"major","disposition":"open","summary":"The review validator hard-codes PASS and zero blockers, so it cannot validate a structurally correct, truthful FAIL review."},{"id":"D-004","severity":"major","disposition":"open","summary":"Route-to-packet-to-submission parity is enforced by document regex and string presence rather than executable cross-boundary proof."}]}
```
