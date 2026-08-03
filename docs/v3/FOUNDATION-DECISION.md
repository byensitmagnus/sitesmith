---
title: "SiteSmith v3 foundation decision"
status: not-ready-review-round-outstanding
date: 2026-07-30
baseline: 80d4030780a4cab18f3baa16dfd354269f83971c
ai_generated: "(C)"
---

# SiteSmith v3 foundation decision

## Contents

- [1. Decision](#1-decision)
- [2. Evidence boundary](#2-evidence-boundary)
- [3. Frozen comparison units](#3-frozen-comparison-units)
- [4. Red-team change log](#4-red-team-change-log)
- [5. Complete derivation record](#5-complete-derivation-record)
- [6. Architecture ruling](#6-architecture-ruling)
- [7. SiteSmith-specific innovation hypothesis](#7-sitesmith-specific-innovation-hypothesis)
- [8. Licence ruling](#8-licence-ruling)
- [9. Quality, adoption, and review gates](#9-quality-adoption-and-review-gates)
- [10. Approval boundary](#10-approval-boundary)

## 1. Decision

The original architecture approval is rejected. The slogan-level comparison and the earlier
1,000-plus-line candidate have been replaced by a capability-derived decision set.

The reviewed proposal is a SiteSmith v3 **superset architecture** with eleven binding modules,
`M0` through `M10`. It carries all 59 recorded upstream capabilities through an explicit retain,
adapt, reimplement, integrate, or reject decision. Both process-isolated reviews now pass the same
hash-locked revision with zero blockers, so the proposal is ready for an explicit architecture-
approval decision. Approval would mean only that this system is coherent enough to implement and
test.

It does **not** mean that v3 exists, works, produces better websites, is production-ready, beats an
upstream, has passed its benchmark, or merits a release. It authorises no website build, migration,
merge, push, customer work, showcase, or comparative claim.

## 2. Evidence boundary

The decision uses three labels:

- **Source fact:** frozen upstream source, observed safe runtime behaviour, a local repository fact,
  or a reproducible test result.
- **Interpretation:** a reasoned consequence of source facts; never represented as upstream truth.
- **Architecture decision:** a proposed contract for v3; never represented as shipped behaviour.

Each material conclusion must resolve to at least one locked commit plus file/line evidence,
observed runtime behaviour, a test, or an explicitly named hypothesis. Citation count is not used as
a quality metric. The canonical evidence lives in the
[upstream forensics](./UPSTREAM-FORENSICS.md) and the
[26-field JSON ledger](./UPSTREAM-CAPABILITY-LEDGER.json).

The isolated audit clones were inspection fixtures only. No upstream repository was mutated. A safe
dry-run or minimal non-visual fixture was used where runtime behaviour could be observed without
building a website. Documentation-only claims remain labelled as such.

## 3. Frozen comparison units

| System | Frozen revision | Comparison boundary |
| --- | --- | --- |
| Taste | [`e988add20dab0fa97d7a76781c48961c8184288e`](https://github.com/Leonxlnx/taste-skill/tree/e988add20dab0fa97d7a76781c48961c8184288e) | Complete relevant skill family, installer surfaces, sibling workflows, prompt mechanisms, and licence. |
| UI/UX Pro Max | [`4857a2c5ef989794751a0f66b8545a4a49566286`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/4857a2c5ef989794751a0f66b8545a4a49566286) | Skill/provider builds, generator/search runtime, datasets, templates, tests, assets, and distinct licence surfaces. |
| Anthropic frontend-design | [`b29e7cf65e5cb78a5ac33d582270551bc74a14eb`](https://github.com/anthropics/skills/tree/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design) | The complete compact creative skill and its Apache-2.0 licence boundary. |
| Impeccable | [`6b342244e915d64b0d6e84d5eec448fd196ce6bb`](https://github.com/pbakaus/impeccable/tree/6b342244e915d64b0d6e84d5eec448fd196ce6bb) | Installer/provider builds, init and design context, commands, hooks, detectors, browser/live runtime, tests, network behaviour, and notices. |

These revisions are comparison units, not claims that each project is internally perfect or that a
newer mutable branch behaves identically.

## 4. Red-team change log

| Earlier assumption | Binding correction |
| --- | --- |
| Four repository summaries were enough. | Replaced by four equal-depth activation/runtime forensics and 59 stable capability records. |
| Taste was mainly one large prompt. | Its Design Read, dials, anti-repetition, preflight, redesign, image/reference, and sibling workflows are separate mechanisms. |
| UI/UX Pro Max was mainly dataset search. | Generator composition, classification, ranking, data/versioning, provider builds, tests, and stereotype/conflict risks are separate mechanisms. |
| frontend-design was merely prompt-only. | Its compactness, creative thesis, subject grounding, signature move, anti-default pressure, and direct implementation are protected strengths. |
| Impeccable was mainly a direction workflow. | Init, shared context, commands, hooks, detectors, browser iteration, state, providers, telemetry/network, tests, and recovery are separately mapped. |
| SiteSmith v2 proof plus a new Direction Engine was the centre. | Rejected. Every module is derived from ledger rows, and every row has a non-regression path into architecture and QC. |
| Workflow infrastructure could precede creative proof. | Rejected. Creative thesis, real structural difference, adjudication, and locked-spec fidelity have explicit pre-build gates. |
| Seven worlds and three cards were architectural constants. | Rejected. Candidate and shortlist counts are versioned experimental policy, not assumed truth. |
| Two same-family passes were independent reviews. | Rejected. Fresh contexts using the same provider/model family are only process-isolated review-passes. |
| Licensing could be closed near release. | Rejected. File-level derivation, integration category, full Apache text, notices, and installer carriage are architecture inputs. |
| 100,000 stars supported the technical case. | Rejected. It is a multi-year adoption north star and never product-quality evidence. |

## 5. Complete derivation record

| Artifact | What it decides | Current document state |
| --- | --- | --- |
| [Upstream forensics](./UPSTREAM-FORENSICS.md) | Fifteen-step activation flow, mechanisms, artifacts, runtime, tests, failure, network, and licence for all four sources. | Complete source analysis; not product proof. |
| [Capability ledger, JSON](./UPSTREAM-CAPABILITY-LEDGER.json) and [readable view](./UPSTREAM-CAPABILITY-LEDGER.md) | Canonical 26-field records: 19 Taste, 15 UI/UX Pro Max, 10 frontend-design, and 15 Impeccable. | 59/59 records complete. |
| [Supremacy matrix](./CAPABILITY-SUPREMACY-MATRIX.md) | v2 match, successor, improvement, measurable regression, integration, licence, module, and QC assignment. | 59/59 IDs assigned exactly once. |
| [Strength assertions](./STRENGTH-ASSERTIONS.json) | Hash-bound, row-addressable child verdict, negative control, fixture, result path, and binary rule for every capability. | 59/59 assertions preregistered; no result executed. |
| [Derivation architecture](./DERIVATION-ARCHITECTURE.md) | Product surface, DecisionProofGraph, typed boundaries, state, modules, recovery, security, and conditional sequence. | Eleven modules cover 59/59 capabilities. |
| [Quality contract](./QUALITY-CONTRACT.md) | Pre-registered non-inferiority, superiority, diversity, proof, recovery, cost, time, provider, and publication gates. | Contract complete; benchmark not executed. |
| [Adoption architecture](./ADOPTION-ARCHITECTURE.md) | Category, promise, one-command release goal, five-minute useful artifact SLO, docs, demos, community, and staged adoption. | Product/go-to-community contract complete; no adoption claim. |
| [Licence and derivation audit](./LICENSE-DERIVATION-AUDIT.md) | Exact current derivation, attribution, integration categories, update policy, Apache/NOTICE carriage, and exclusions. | Mapped architecture blocker closed; future imports reopen review. |

The binding chain is:

```text
upstream capability
→ documented strength
→ SiteSmith successor
→ required improvement
→ M0–M10 architecture module
→ verification method
→ QC/benchmark criterion
```

A capability may disappear only through an explicit reject decision that names the deliberate
strength loss, sets successor to `none`, states why exclusion is safer, binds an exact negative
fixture, and makes no preservation, replacement, or non-inferiority claim. The four current
exclusion-only decisions are `TASTE-CAP-013`, `TASTE-CAP-019`,
`uupm.bundle.sibling-skills`, and `IMP-015`. Silent capability loss blocks implementation and
release.

A reimplementation retains its named observable outcome through positive successor proof. When its
integration category is clean-room, a separate negative fixture must also prove the old source
mechanism absent; neither verdict substitutes for the other, and upstream code, data expression,
runtime expression, and prompt expression remain outside the implementation boundary.

## 6. Architecture ruling

The architecture is not four prompts concatenated and not SiteSmith v2 with a state machine placed
around it. It is one local, agent-hosted workflow whose short user path remains:

```text
sitesmith init → sitesmith build → sitesmith audit
```

The eleven modules have distinct responsibilities:

| Modules | Responsibility |
| --- | --- |
| `M0-provider-runtime`, `M9-artifact-ledger` | Provider-neutral activation, typed WorkOrders, local install/doctor, hashes, append-only events, replay, invalidation, and recovery. |
| `M1-truth-brief`, `M2-knowledge-engine` | Truth/unknowns, product and stack evidence, UX/design knowledge, versioned data, conflicts, and source provenance. |
| `M3-creative-director`, `M4-direction-lab` | Subject-grounded creative thesis, controlled dials, externally assigned seeds/lenses, structurally different directions, isolated critique, reject-all, and selection. |
| `M5-design-contract`, `M6-build-adapters` | Locked machine-readable DesignSpec, field provenance, creative fidelity, supported stack planning, and bounded implementation. |
| `M7-craft-loop`, `M8-proof-runner` | Continuous detectors and semantic craft review, then browser, journey, accessibility, fidelity, responsive, console, link, overflow, asset, and performance proof. |
| `M10-release-benchmark` | Release matrix, frozen comparison arms, public evidence, claim policy, and benchmark result. |

Deterministic core code owns state, schemas, permissions, budgets, hashes, transitions, detectors,
and gates. Model/provider actors own typed creative or implementation work only inside explicit
WorkOrders. No actor advances state by assertion. No hidden winner is selected. A material revision
creates a new epoch and invalidates descendants without deleting history.

## 7. SiteSmith-specific innovation hypothesis

The proposed **DecisionProofGraph** is the material innovation hypothesis: it links locked truth to
structurally different creative candidates, isolated eligibility/adjudication, an exact selection, a
field-provenance DesignSpec, a bounded build, continuous detectors, and final browser/journey proof
through content-addressed edges.

None of the four frozen upstreams demonstrates that complete evidence-to-proof chain as one
provider-neutral, replayable, offline-first contract. That is a factual gap in the frozen comparison;
it is not proof that SiteSmith's proposed composition is novel in every market, useful in practice,
or aesthetically superior. The hypothesis fails if the Quality Contract cannot show every
non-rejected upstream strength retained, all four deliberate losses exactly excluded, real direction
distance, selection-to-build fidelity, recovery, and reproducible proof within the pre-registered
time/cost bounds.

## 8. Licence ruling

SiteSmith-original work remains MIT. Redistributed MIT and Apache-2.0 material retains its own terms;
the root MIT licence does not relicense it. The audit maps copied/excerpted/derived files to exact
historical sources, corrects inaccurate “verbatim” labels, records transformations, and preserves
the required owners and notices.

The complete Apache-2.0 text and bundled third-party notices now live inside the installable skill.
Repository checks and an isolated provider-install test verify that recipients receive them. The
identified Apache §4(a) and modified-file-notice defects are closed for the mapped files.

This is an engineering compliance decision, not legal advice or blanket clearance. Every future
upstream refresh, dependency, font, image, template, provider asset, or newly copied expression
requires a new file-level derivation decision before implementation.

## 9. Quality, adoption, and review gates

The Quality Contract freezes five systems, twelve materially different briefs, two runs per system
per brief, comparable model/budget conditions, isolated workspaces, external blinded evaluation,
mechanical browser gates, per-capability non-inferiority, and pre-declared statistical outcomes. Its
120 assigned runs and evaluation plan are a future benchmark contract, not completed evidence.

The adoption contract separates product quality, technical differentiation, developer experience,
distribution, community, and GitHub adoption. One-command installation and a validated first useful
artifact within five minutes are release targets that require measured conformance; no invented
package name or mutable URL is presented as already available. The 100,000-star ambition is only a
multi-year north star.

Two process-isolated reviews now pass the same final hash revision:

- [Traceability review](./reviews/TRACEABILITY-REVIEW-C.md): **PASS, 0 blockers** after auditing all
  59 chains, their unique child gates, integration categories, module carriage, and source hashes.
- [Adversarial review](./reviews/ADVERSARIAL-REVIEW-C.md): **PASS, 0 blockers** after attempting to
  disprove readiness, fairness, licensing closure, creative balance, subgate integrity, and claim
  discipline.

Both use OpenAI Codex in separate `fork_turns=none` contexts. The deployed model identifier is not
exposed. They are not model-independent, their candidates are not blinded, and they are not called
fully independent. Each report records received/withheld artifacts, prompt, provider/model boundary,
method, exact hashes, remediation history, findings, and verdict. Earlier review revisions found
real blockers and are retained as superseded history; only the final shared hash revision supports
this status. Any future blocker or reviewed-artifact hash drift returns this decision to the matching
NOT READY status.

## 10. Approval boundary

Architecture readiness requires all of the following at the same revision:

1. The four forensics and all 59 ledger records remain complete and commit-pinned.
2. Every capability appears exactly once in the matrix and exactly once in its assigned M0–M10
   module, with a present QC criterion.
3. Licence and installed-notice gates pass for the mapped distributed material.
4. The Quality Contract is document-complete and internally executable, while still labelled
   unexecuted.
5. Both process-isolated reviews report zero architecture blockers, and all repository/document
   integrity checks pass after any resulting corrections.

All five conditions hold for the current documentation revision, so it is ready for architecture
approval. This readiness status is not approval itself: a separate explicit approval is required
before v3 implementation begins. Website builds, showcases, customer work, migration, benchmark
execution, merge, push, release, and quality claims remain outside this decision.

NOT READY — REVIEW ROUND OUTSTANDING
