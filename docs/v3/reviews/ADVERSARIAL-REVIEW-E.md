---
title: SiteSmith v3 adversarial review E
status: fail
blockerCount: 1
findingCount: 2
reviewer: OpenAI Codex
modelIdentifier: not-exposed
contextIsolation: fork_turns=none
originalRecommendationKnown: no
date: 2026-07-30
ai_generated: "(C)"
---

# SiteSmith v3 adversarial review E

Review status: FAIL

Blocker count: 1

The review cannot establish readiness because two locked inputs changed after the initial hashes were
recorded. The current checker closes the source-coordinate false green reproduced against the
starting checker, but that repair occurred inside the review window and therefore cannot turn this
process-isolated run into an immutable review of one evidence set.

## Received and withheld evidence

Received as the complete locked review set:

- `docs/v3/UPSTREAM-FORENSICS.md`
- `docs/v3/UPSTREAM-CAPABILITY-LEDGER.json`
- `docs/v3/UPSTREAM-CAPABILITY-LEDGER.md`
- `docs/v3/CAPABILITY-SUPREMACY-MATRIX.md`
- `docs/v3/DERIVATION-ARCHITECTURE.md`
- `docs/v3/QUALITY-CONTRACT.md`
- `docs/v3/STRENGTH-ASSERTIONS.json`
- `docs/v3/ADOPTION-ARCHITECTURE.md`
- `docs/v3/LICENSE-DERIVATION-AUDIT.md`
- `skills/sitesmith/THIRD-PARTY-PROVENANCE.json`
- `tools/check-v3-docs.mjs`

Withheld from the evidentiary review:

- `docs/v3/FOUNDATION-DECISION.md`
- every pre-existing file under `docs/v3/reviews/`
- prior recommendations, review conclusions, and substantive agent messages
- chat history beyond the isolated task envelope and non-substantive orchestration status

The reviewer is from the same provider/model family as the producing system. Isolation was
process-level through `fork_turns=none`; this is not model-independent review.

## Method, attacks, and limitations

I recorded full SHA-256 values before reading, inspected only the received artifacts as review
evidence, and used read-only commands plus in-memory, canonically resealed fixtures. No tracked file
was mutated other than this owned report. The attack set covered strict JSON parsing, provenance
coordinates and digests, schema/count projections, source availability, transformation
reconstruction, licence carriage, path containment, review-verdict integrity, StrengthAssertion
seals/history, routing carriage, rejection semantics, exact-once mappings, and claim boundaries.

The required command `node tools/check-v3-docs.mjs --self-test` completed successfully against the
current checker and printed its PASS line for review verdict, strict JSON, strength seal,
disposition, and provenance-digest self-tests. That self-test result does not repair input drift and
does not execute the expressly unexecuted routing, product, or benchmark contracts.

Limitations:

- Network resolution is point-in-time; redirects were configured to fail and injected 404 paths
  failed closed, but this does not prove permanent upstream availability.
- Static route → packet → WorkOrder → submission binding is documentation proof only. The reviewed
  contracts explicitly keep runtime routing proof unexecuted.
- No product build, human benchmark, comparative superiority study, or release run was executed.
- The mid-review input replacement prevents one coherent before/after conclusion even where the
  current checker now rejects an attack that the starting checker accepted.

## Current locked-artifact hashes

These are the full current SHA-256 values used in the report. They are not presented as the unchanged
start set.

| Artifact | SHA-256 |
| --- | --- |
| `docs/v3/UPSTREAM-FORENSICS.md` | `6355c3c5b641fdcf458b12253460f3915d8a1a5c337a3d716b0f525cba69b811` |
| `docs/v3/UPSTREAM-CAPABILITY-LEDGER.json` | `c2c0a4885c80545fcd81081f2dc846b23c7393ab099df78b2f42825e1d27a844` |
| `docs/v3/UPSTREAM-CAPABILITY-LEDGER.md` | `90796a22473c7d44b14630b81dfc3cd3992b3f575192ab2562565a9a8f2e035b` |
| `docs/v3/CAPABILITY-SUPREMACY-MATRIX.md` | `ac11b77b0802fe31f8f10ae8aaaa735017407cedab7f19b5b368b141ac5a3007` |
| `docs/v3/DERIVATION-ARCHITECTURE.md` | `fd81283077287d5ab63741b937545c43c322bdf82f29924341a65642d62c1944` |
| `docs/v3/QUALITY-CONTRACT.md` | `0fe85b30bcf0ab918dbc5e0eba3adff253e17c9170c2d354c2ee896684eee4cb` |
| `docs/v3/STRENGTH-ASSERTIONS.json` | `8e97dfb4a3087346bcb0d85dc328878f580021e8e8c40f82b7a86ebd0a244485` |
| `docs/v3/ADOPTION-ARCHITECTURE.md` | `a656428e9388fd2f90a8eb36446769be751c90bad1bdaf7fcb736bb3e14f09b9` |
| `docs/v3/LICENSE-DERIVATION-AUDIT.md` | `e03a4cc6fc1e0e133917e3011fccf8cb4ed3ecaa06655ec40ebf38fcea09a789` |
| `skills/sitesmith/THIRD-PARTY-PROVENANCE.json` | `1580635046d34d11eb1fdd9ef4dff55b09bf98be8ddd7666b463f1fc7b6a3428` |
| `tools/check-v3-docs.mjs` | `bd57b6c25034684e51c946b017985a60df0e2ffe51da55108d8f799a5f5166a2` |

## Exact attack outcomes

1. **Locked-input immutability — FAIL.** The licence audit changed from
   `56e8de61ef81f5c7c6a802b972954a0bf1ec02504e31bf589a37ec8b7028ed8e` to
   `e03a4cc6fc1e0e133917e3011fccf8cb4ed3ecaa06655ec40ebf38fcea09a789`.
   The checker changed from
   `a32a8075129e0499ee815544a88e73b67bb3f166c6839d87b09aacfadd5dbc2e` to
   `8e954e7a60749af72f3dda8488fed57ce72c89390fdf8c5baca09d8d2da56430` and then
   `bd57b6c25034684e51c946b017985a60df0e2ffe51da55108d8f799a5f5166a2`.
   The other nine locked hashes remained stable at the final check.

2. **Locally substituted source without revision:path proof — false green reproduced, then closed
   by the changed checker.** Against the starting checker, canonically resealed manifest fixtures
   repointed one Taste source path and one Impeccable source path to syntactically valid nonexistent
   paths; both returned zero validation problems. Against the current checker, independently
   resealed nonexistent-path fixtures for Taste, UI/UX Pro Max references, and Impeccable were all
   rejected through pinned upstream resolution. The current repair is real for those fixtures but
   cannot retroactively make this one immutable review run.

3. **Duplicate keys — rejected.** Nested duplicate-object-key fixtures were rejected by the strict
   parser for the ledger, StrengthAssertions, provenance manifest, and the canonical review envelope.

4. **Digest tampering — rejected.** File, span, source, reconstructed-source, group-tree,
   global-coverage, carriage, Apache-text, and manifest-self-digest mutations failed. A manifest or
   descendant digest could not be changed in isolation and remain green.

5. **Schema and count drift — rejected.** Capability records are constrained to exactly 26 keys,
   59 records, frozen per-source counts, one matrix row per capability, twelve matrix columns, and
   the human projections `26` and `59/59`. Extra, missing, duplicated, or 24-field projections do not
   satisfy the current predicates.

6. **Repository/revision/path/blob/SHA and availability drift — rejected by the current checker.**
   Frozen repository and capability revisions are exact; UUPM group-level revisions cannot be
   overridden; full source blobs and canonical SHA values are checked where declared; pinned fetches
   reject redirects, 404s, malformed coordinates, and unresolved revision:path pairs. The earlier
   source-path exception is the resolved finding described above.

7. **Frontend and Impeccable transformation fabrication — rejected.** Frontend source-body
   extraction requires the exact selector, pinned source blob, canonical source SHA, and local/source
   span equality; a fabricated heading cannot enter the source body. Impeccable reconstruction
   requires the exact attribution removal, exactly 32 link repoints, terminal-LF reversal, exact
   upstream revision:path equality, and reconstructed tree digest.

8. **Licence and filesystem attacks — rejected.** Substituting an abbreviated Apache text, omitting
   the Appendix, changing required carriage, escaping a declared root, introducing a symlink escape,
   or creating undeclared/overlapping coverage fails. The single allowed overlap must use the named
   path, exact two groups, and explicit disjoint spans.

9. **Review-verdict bypasses — rejected.** Duplicate/case-variant frontmatter, alternate verdicts,
   non-integer or contradictory counts, missing/duplicate/noncanonical findings fences, duplicate
   JSON keys, extra envelope/finding keys, status/count drift, and blocker prose under PASS all fail.
   A truthful FAIL envelope is structurally accepted while still refusing to open readiness.

10. **Strength seal/history and routing binding — bounded, not product proof.** Policy hashes,
    canonical verdict predicates, semantic hashes, version history, failure semantics, negative
    controls, rejection classifications, and exact route/manifest/instruction digest vocabulary are
    bound. The documents explicitly label every StrengthAssertion and `QC-ROUTING-01` unexecuted;
    static consistency cannot satisfy runtime proof.

11. **Reject semantics, exact-once mapping, and result overclaim — rejected/bounded.** Four rejects
    remain exclusion-only with named losses and no successor/preservation claim; all 59 capabilities
    map exactly once across ledger, matrix, architecture placement, assertion, and QC references.
    The quality/adoption contracts prohibit present product, benchmark, production-readiness, or
    superiority conclusions, and the reviewed set contains no executed result that could support one.

## Finding

`E-001` remains open: repeat the independent review only after the complete eleven-artifact set is
frozen for the entire review window. `E-002` records the source-coordinate false green as resolved in
the current checker, not as evidence that this drifted review can pass.

```review-findings
{"schemaVersion":1,"findings":[{"id":"E-001","severity":"critical","disposition":"open","summary":"Two locked artifacts changed after initial hashing, so the review did not evaluate one immutable evidence set and cannot establish readiness."},{"id":"E-002","severity":"critical","disposition":"resolved","summary":"The starting checker accepted canonically resealed nonexistent source paths for Taste and Impeccable; the current changed checker rejects pinned revision:path substitution for Taste, UI/UX Pro Max references, and Impeccable."}]}
```
