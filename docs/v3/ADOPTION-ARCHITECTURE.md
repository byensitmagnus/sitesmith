---
title: "SiteSmith v3 adoption architecture"
status: complete
generated: 2026-07-30
ai_generated: "(C)"
---

# SiteSmith v3 adoption architecture

## 1. Category, primary user, and promise

**Exact category:** an **agent-native open-source website design/build quality system**.

**Primary user:** a developer or product engineer who uses a coding agent to ship a production website or web application and needs grounded design direction, controlled implementation, and release evidence without becoming the workflow orchestrator.

**One-sentence promise:** Give SiteSmith a truthful brief, a supported repository, and a declared
conformant local or network provider for model-owned work; the local core will guide the run from
evidence-grounded direction to a locked design contract and browser-validated release bundle without
inventing product facts. This is the proposed product contract, not current implemented behaviour.

The category deliberately excludes three misleading labels:

| Not the category | Why |
|---|---|
| Autonomous website compiler | A provider agent performs non-deterministic design and build work; the deterministic core owns contracts, state, budgets, and gates. |
| Template marketplace | Reusable schemas and examples are allowed, but visual recipes must not become a house style. |
| Prompt collection | The product boundary is typed artifacts, provider adapters, resumable state, and executable proof—not concatenated instructions. |

The implementation boundary remains the one defined in [FOUNDATION-DECISION.md](./FOUNDATION-DECISION.md). Completion of this adoption document is not evidence that v3 is implemented.

## 2. Why choose it: a testable proposition

The adoption proposition is not “SiteSmith is better than every upstream.” It is:

> For the same frozen brief, repository, provider/model class, budget, and run conditions, SiteSmith
> should make truth, direction choice, implementation constraints, and release evidence more explicit
> and reproducible while preserving every explicitly non-rejected StrengthAssertion. Deliberately
> rejected strengths are named losses, not silently counted as preserved.

The exclusion-only set is closed at four rows: `TASTE-CAP-013` loses “App-native
flow/readability consistency”, `TASTE-CAP-019` loses “Small understandable transformations”,
`uupm.bundle.sibling-skills` loses “broader creative workflow from one install”, and `IMP-015`
loses “Tæt visuel feedbackloop”. Each has successor `none`; its exact negative fixture proves
absence only and cannot establish preservation, replacement, or non-inferiority. The four clean-room
reimplementations in this correction—`TASTE-CAP-014`, `TASTE-CAP-016`, `TASTE-CAP-017`, and
`uupm.classify.product-reasoning`—instead require both positive successor proof for the retained
outcome and a separate negative fixture for the old source mechanism.

That proposition is falsifiable:

| Comparison dimension | SiteSmith proposition | Required evidence before saying it worked |
|---|---|---|
| Taste-style authorial guidance | Preserve strong brief reading, meaning-first intake, legible aesthetic extremes, deliverable counting, visual discipline, and craft constraints inside typed decisions rather than one long prompt. | The relevant rows in the [supremacy matrix](./CAPABILITY-SUPREMACY-MATRIX.md) pass their positive successor QC tests, while the three corrected Taste clean-room rows separately prove their old source mechanisms absent. |
| UI/UX Pro Max-style retrieval | Keep useful offline knowledge retrieval and 192-category coverage as bounded evidence/confidence signals, but expose sources, conflicts, and the rule that top-1 retrieval cannot choose the visual world. | Frozen relevance/coverage corpus, provenance output, deterministic ranking tests, direction-selection separation, positive signal-extractor proof, and a separate negative fixture for the old top-one stereotype mechanism. |
| frontend-design-style subject grounding | Derive the visual language from the subject and prove that the result is not a generic style label with different copy. | QC-CREATIVE-01 plus assignment-blinded subject-grounding review on frozen fixtures. |
| Impeccable-style workflow and detection | Keep routable workflow, executable checks, and multi-perspective review while adding state, isolation, failure semantics, and replay. Impeccable Live/tight feedback is deliberately rejected from core and not claimed carried. | Provider conformance, recovery fixtures, browser proof, reviewer-provenance records, and an `IMP-015` negative fixture that proves exclusion only. |
| Whole-system outcome | Connect evidence → distinct choices → locked specification → supported build → proof bundle. | A preregistered matched-output benchmark under the protocol in [FOUNDATION-DECISION.md](./FOUNDATION-DECISION.md), including failed runs and limitations. |

Until that evidence exists, public language may describe mechanisms and verified test results only. It may not use “best,” “superior,” “beats,” or an equivalent overall quality claim.

## 3. North star and operating principles

**100,000 GitHub stars is a multi-year distribution north star.** It is not a forecast, deadline, quality metric, evidence source, release gate, funding assumption, or reason to change a benchmark verdict. No milestone in this document promises a star count.

The north star is useful only as a forcing function for:

- a product category that a new user can repeat accurately;
- a five-minute first useful result after prerequisites;
- trustworthy public proof instead of marketing screenshots;
- low-friction contribution and extension boundaries;
- respectful participation in the upstream ecosystem.

Stars must never be purchased, exchanged, gated behind product actions, used to rank contributors, or presented as proof that generated websites are good.

## 4. Explicit adoption scorecard

The six tracks are independent. A green distribution track cannot hide red product quality, and a technically novel engine cannot substitute for adoption.

| Track | Question | Primary measures | Current evidence baseline | Readiness threshold | Invalid proxy |
|---|---|---|---|---|---|
| Product quality | Does the system produce truthful, useful, accessible, distinctive websites? | QC pass rate; severe defect rate; spec fidelity; assignment-blinded quality; portfolio diversity; failed-run rate | v2 has real browser checks, but the public showcase is correctly **0/8** after portfolio failure: [record](../v2/preflight/round-8/RESULT.md). v3 is unbuilt. | Every required QC gate passes on frozen controls; private pilots pass individual review and the portfolio gate; failures remain public. | Stars, screenshots selected after the fact, or the agent saying “done.” |
| Technical differentiation | Is the mechanism materially different, traceable, and reproducible? | 59-capability non-regression coverage; artifact/event replay; deterministic hashes; provider isolation; recovery tests | The [59-row matrix](./CAPABILITY-SUPREMACY-MATRIX.md) specifies the contract; it is not shipped behaviour. | All release-scope capability rows have executable tests, stable schemas, replay evidence, and no unresolved licence blocker. | Lines of code, number of agents, or number of prompts. |
| Developer experience | Can the primary user install, understand, recover, and reach value quickly? | Clean-machine install success; p50/p95 time to first validated artifact; commands to recovery; uninstall residue; support requests per activated user | A source installer and three provider pack generators exist in [bin/sitesmith.mjs](../../bin/sitesmith.mjs); the v3 release command is not frozen. | One-command release install passes the clean-machine contract; first useful artifact is ≤5 minutes p95; documented recovery works without source edits. | A maintainer's warm laptop or an edited demo video. |
| Distribution | Can the right user discover, evaluate, and install the real release safely? | Qualified documentation visits; quickstart completion; verified command success; release-note reach; source-to-activation conversion | Public README and project page exist; there is no approved v3 release surface. | One canonical landing path, signed release metadata, reproducible demos, searchable docs, and no contradictory install commands. | Raw impressions, launch-day traffic, or stars. |
| Community | Can external people improve the system without degrading evidence or safety? | RFC cycle time; review latency; external test-bearing contributions; maintainer coverage; security response compliance | [CONTRIBUTING.md](../../CONTRIBUTING.md) and [SECURITY.md](../../SECURITY.md) provide a base; v3 RFC and extension governance are not implemented. | Published ownership, RFC states, code of conduct, security path, contributor fixtures, and at least one complete external contribution cycle. | Issue count, chat size, or unreviewed plugin count. |
| Adoption | Do external users activate and return because the system helps them ship? | Consented external activations; validated-run completion; 30-day repeat use; release-bundle export; churn reason | No verified v3 user cohort exists. | A preregistered external beta cohort with auditable activation and repeat-use definitions; no core telemetry requirement. Provider telemetry/retention is separately disclosed and consented or the provider path is blocked. | Downloads, clones, stars, or self-reported “interest.” |

Every public status page must show all six tracks, their measurement window, sample size, exclusions, and last verified release.

## 5. Installation and release contract

The release contract is **one copy-paste command per supported shell**, shown on the canonical release page and generated from signed release metadata. The command may invoke a trusted package manager, but it must not require a prior repository clone or a sequence the user has to assemble.

**No command syntax, package namespace, registry package, or download URL is frozen or claimed here.** The current source installer is evidence of a baseline, not the v3 distribution promise. Syntax may freeze only after all three proof groups pass:

| Proof group | Mandatory evidence |
|---|---|
| Namespace and provenance | Namespace ownership is verified; release artifacts map to the repository commit; version, SHA-256, signature/provenance, SBOM, licence manifest, and revocation path are published together. |
| Security | Threat model reviewed; no unpinned remote shell execution; arguments use native process arrays; archive traversal, symlink/junction escape, command injection, dependency confusion, downgrade, and tamper fixtures fail closed. |
| Clean machine | Fresh supported Windows and Linux images, an unprivileged user, empty target, declared prerequisites only, cold download, install, doctor, second-install idempotency, update, rollback, and uninstall all pass. Any additional OS is claimed only after the same proof. |

The one command must:

1. print the exact version, target, provider adapters, network actions, and files it will own;
2. refuse an unknown or conflicting destination before mutation;
3. verify downloaded bytes before execution and record an ownership manifest;
4. run doctor and return a non-zero exit when required capabilities are unavailable;
5. provide a symmetric uninstall that deletes no unowned file.

Documentation CI must compare the displayed command with the signed release manifest. A release is blocked if README, release page, shell variants, and the manifest disagree.

## 6. Five-minute first useful artifact SLO

The first useful validated artifact is a schema-valid **ValidatedBrief** containing the task, audience, primary job, product facts with sources, explicit unknowns, repository/stack evidence, selected workflow, provider identity/mode, policy version, expected disposition and a proof entry. A truthful blocked ValidatedBrief that names genuinely missing material information is useful in the separately reported incomplete-brief cohort; fabricated completion is not.

**SLO:** after prerequisites pass, the ValidatedBrief must be produced within **5 minutes p95**.

Measurement boundaries are binding:

| Boundary | Rule |
|---|---|
| Prerequisites | Runtime installation, browser download, provider application installation, and provider authentication are measured and reported separately. They are not hidden inside the five-minute number. |
| Start | Timer starts when the user submits the fixed complete brief to init in a clean project with doctor already green. |
| Stop | In the fixed complete-brief cohort, timer stops only at a hash-ledgered, openable `validated_ready` artifact with every precommitted material field resolved and the fixture-oracle disposition matched. A gratuitous `blocked`, `needs_input`, unsupported-provider result, schema failure or wrong disposition counts as slower than five minutes. Incomplete-brief blocked-artifact timing is a separate metric and cannot satisfy this SLO. |
| Sample | At least 30 cold project starts per claimed provider/OS/mode cell; fixed provider/model version, declared local/network mode, hardware/region, empty SiteSmith cache, and no discarded warm-up failures. |
| Included time | Provider latency, retries, repository inspection, validation, and artifact write are included. A timeout, crash, manual source edit, gratuitous blocker or schema failure counts as slower than five minutes. |
| Interactive ambiguity | User think time is excluded from the automated complete-brief SLO. A separate incomplete-brief cohort freezes missing inputs and expected blockers; it reports correct-block rate and time-to-truthful-block without being pooled into time to usable direction. |
| Reporting | Publish p50, p95, maximum, success rate, sample size, cache state, provider/model, cost/usage when exposed, and every exclusion. Unknown data stays unknown. |

The SLO is about reaching a correctly disposed decision-quality artifact, not installing prerequisites,
completing a website in five minutes, or proving a full offline website flow.

## 7. Provider tiers and conformance

Claude, Codex, and Cursor are the only current proven **packaging baseline** because the existing pipeline generates their entry points and tests the shared product flow in [test-product-flow.mjs](../../tools/test-product-flow.mjs). This proves packaging behaviour, not v3 semantic parity or website quality.

| Tier | Meaning | Public label | Entry gate |
|---|---|---|---|
| P0 — packaging baseline | Current Claude, Codex, or Cursor pack can be generated and installed by the v2 baseline. | baseline, never v3 supported | Existing pack and install fixtures pass. |
| P1 — candidate | A typed v3 adapter exists and can exchange required artifacts. | experimental | Adapter schema, permissions, failure mapping, and local fake-provider suite pass. |
| P2 — conformant | Normalised decisions and artifacts pass the provider contract on clean runs. | conformant | QC-INSTALL-01, QC-TRUTH-01, QC-BUILD-01, QC-PROOF-01, isolation, cancellation, retry, and cost/usage-unknown fixtures pass. |
| P3 — release-supported | The exact provider/model line passes release and SLO cells on supported operating systems. | supported for the named release | Signed conformance report, clean-machine install, p95 SLO, end-to-end ProofBundle, and known-failure fixtures pass. |

Other providers are not rejected, but they earn P1–P3 through the same public conformance suite. A community adapter cannot gain a supported badge from a README claim, successful import, or one demo.

Provider reports must name provider, exposed model identifier, adapter, host version, permissions,
operational `IsolationClass`, `local-provider` or `network-provider` mode, endpoints/data classes,
external telemetry/training/retention/deletion controls or `unknown`, cost visibility and known
limitations. Core does not claim control over external provider processing. Unknown or unacceptable
data handling fails the affected policy; a provider upgrade invalidates the report until rerun.

No provider badge may say “offline website building” unless that exact local provider/model line has
passed truth, creative, direction, build, craft and end-to-end proof on every named OS. A local pack or
offline deterministic core alone does not earn that label.

## 8. Documentation information architecture

The public documentation must have one route to installation and one route to evidence:

| IA node | Required content | Acceptance test |
|---|---|---|
| Start | Category, primary user, honest status, prerequisites, the one release command when approved, five-minute quickstart, uninstall, and first failure recovery. | A new-user test finds the correct release and produces a ValidatedBrief without repository knowledge. |
| Concepts | Truth boundary, direction worlds/cards, DesignSpec, artifact ledger, provider boundary, proof bundle, and what remains non-deterministic. | Every term links to one canonical definition and schema version. |
| Workflows | New build, existing-site redesign, audit-only, blocked run, reroll/reject, resume, and explicit stop. | Each workflow declares inputs, outputs, mutation scope, stop states, and a runnable fixture. |
| Reference | CLI, configuration, artifacts/events, errors, provider/stack capability matrices, extension API, and compatibility policy. | Reference is generated or contract-tested against implementation metadata. |
| Proof and results | QC definitions, benchmark protocol, raw result browser, limitations, failed controls, showcase eligibility, and historical evidence. | A result can be traced to exact inputs, versions, commands, hashes, and reviewers. |
| Ecosystem | Templates, examples, adapters, compatibility badges, licence/provenance, and deprecation state. | Every listed item has an owner, source pin, licence, test status, and supported-version range. |
| Governance | Contribution path, RFCs, security, maintainers, release policy, code of conduct, upstream credits, and decision log. | All contacts and response expectations are current and checked once per release. |

The current [README](../../README.md), [security policy](../../SECURITY.md), and [contribution guide](../../CONTRIBUTING.md) remain evidence inputs. They do not become v3-canonical merely by being older.

## 9. Public benchmark and results schema

Every public comparison or demo result must use one versioned **PublicResultRecord** schema. The record contains:

| Group | Required fields |
|---|---|
| Identity | Schema version, result ID, run ID/epoch, treatment, exact source revision, release candidate, fixture/brief ID and hash. |
| Environment | OS/image digest, CPU/RAM, provider/model/host/adapter versions, context/isolation class, network policy, cache state, locale, and declared prerequisites. |
| Method | Preregistered protocol ID, randomised order, seed commitment and disclosure state, budgets, commands, time boundaries, retry policy, and deviations. |
| Usage | Start/end timestamps, wall time, attempts, token/cost data or unknown, network calls, manual interventions, and failure/disposition. |
| Artifacts | Artifact envelopes, event-chain root, DesignSpec, build manifest, screenshots, raw gate outputs, proof bundle, and content hashes. |
| Evaluation | Mechanical gate results, reviewer IDs/pseudonyms, assignment blinding, rubric/version, adjudication, portfolio result, separate rendered-outcome result, separate workflow-evidence result, and contract result. |
| Integrity | Signature/provenance, licence manifest, publication timestamp, supersedes link, exclusions, known limitations, and reproduction command manifest. |

Publication rules:

- preregister the protocol and analysis before outputs are opened;
- publish all valid assigned runs, including failures, timeouts, blocked states, and null results;
- keep raw artifacts immutable and publish corrections as superseding records;
- separate diagnostic metrics from the declared verdict;
- never combine rendered preference/quality with the SiteSmith-shaped workflow-evidence composite
  into one “overall builder” rank;
- refuse cross-provider/model aggregation that the protocol did not authorise.

The benchmark protocol in [FOUNDATION-DECISION.md](./FOUNDATION-DECISION.md) is the governing comparison method. The [upstream forensics](./UPSTREAM-FORENSICS.md) define frozen mechanisms; neither document is a substitute for matched output results.

## 10. Reproducible demos, showcase, templates, and examples

Three demo classes establish the adoption ladder:

| Demo | Purpose | Reproduction contract | Public claim allowed |
|---|---|---|---|
| Brief-only fixture | Prove truth handling, unknowns, stack evidence, and the five-minute SLO without building a site. | Frozen repository/brief, clean state, exact versions, expected schema invariants and proof-hash rules. | Workflow and timing facts only. |
| No-build direction fixture | Prove grounded alternatives, rendered-card difference, selection, reject/reroll, and locked specification. | Frozen corpus, preregistered N/K policy, equal render budget, deterministic card renderer, blinded critique, and raw artifacts. | Direction-mechanism facts only. |
| Synthetic end-to-end fixture | Prove isolated build, native checks, browser proof, failure retention, and replay. | Invented non-commercial subject, clean supported stack, Windows/Linux cells, injected failures, and self-validating ProofBundle. | Release-system facts only; never showcase quality. |

A website enters the public showcase only after:

1. its exact run reaches release_ready with a valid ProofBundle;
2. assignment-blinded reviewers pass the preregistered individual rubric;
3. the candidate set passes the rendered portfolio-diversity gate;
4. the public manifest records source, licence, run/result IDs, limitations, and reproduction status.

The gate preserves the correction already encoded by the current [showcase manifest](../../gallery/showcase.json) and [portfolio-diversity checker](../../skills/sitesmith/scripts/portfolio-diversity.mjs). No maintainer may promote a favourite page by replacing the evaluated portfolio after scores are known.

Templates are contract starters, not visual themes. Initial template classes are truthful-brief, existing-site-baseline, direction-policy, DesignSpec, provider-adapter, stack-adapter, verifier, and PublicResultRecord. Examples must pair at least one passing fixture with a nearby failing or blocked fixture and explain the difference.

## 11. Extension API and compatibility

The extension surface is typed and allowlisted:

| Extension type | May provide | May not own |
|---|---|---|
| Provider adapter | Capability declaration, WorkOrder transport, typed submission, cancellation, usage/unknown report, and isolation evidence. | Core state transitions, acceptance, hidden fallback, or release verdict. |
| Stack adapter | Detection evidence, native install/build/typecheck/test commands, workspace rules, and required journeys. | Provider selection, truth policy, or proof waivers. |
| Knowledge pack | Versioned rows, stable IDs, provenance, licence, confidence/freshness fields, and retrieval fixtures. | Automatic world selection or uncited factual claims. |
| Direction lens | Typed constraints, compatibility, evidence requirements, difference features, and renderer hints. | Secret weighting, automatic approval, or truth overrides. |
| Verifier | Declared inputs, deterministic result schema, raw evidence, severity, waivers, and known false-positive fixtures. | Mutation, auto-remediation, or a green result when it could not run. |
| Renderer/exporter | Deterministic presentation of approved typed artifacts. | Semantic generation, selection, or mutation of canonical artifacts. |

Extensions declare API range, permissions, network use, files read/written, dependencies, source pin, licence, maintainer, data handling, and conformance report. Discovery never executes unknown code automatically. Installation requires explicit opt-in and a planned diff.

Compatibility uses semantic API versions plus capability negotiation. A missing required capability blocks or uses a declared fallback; it never silently degrades. Deprecation requires one minor-cycle warning, a migration fixture, and a recorded removal release. The core may remain closed to an extension class until its sandbox and threat model are proven.

## 12. Contribution, RFC, security, maintainer, and community model

Contribution paths are proportional to risk:

| Change class | Path | Required evidence |
|---|---|---|
| Documentation, fixture, or detector correction | Issue or pull request | Reproduction, scoped change, link/schema checks, and updated fixture. |
| New knowledge, lens, adapter, verifier, or template | Capability proposal plus pull request | Provenance/licence, typed contract, positive and negative fixtures, conformance result, and owner. |
| State, artifact, provider, extension, benchmark, security, or governance contract | Public RFC before implementation | Problem, alternatives, compatibility, threat model, migration, rejected options, measurable exit gate, and decision record. |

RFC states are draft → review → accepted or rejected → implemented → superseded. Acceptance records who decided, evidence considered, conflicts, expiry/revisit trigger, and implementation gate. Discussion volume is not consensus.

The maintainer model assigns named roles per release:

- release steward: signs artifacts and verifies the release matrix;
- security steward: receives private reports and coordinates disclosure;
- benchmark steward: protects preregistration, blinding, raw results, and controls;
- community steward: triages issues/RFCs and keeps contributor guidance current;
- upstream/provenance steward: reviews derivation, licences, credits, and source updates.

One person may hold multiple roles during early development, but the role map must say so. Security-sensitive installer/runtime changes and benchmark verdict changes require an independent evidence review before release. If no reviewer is available, the release waits; authorship is not review.

Before public beta, publish a code of conduct, issue/RFC templates, scope labels, support boundaries, archival policy, and a quarterly governance health record. The existing private reporting route in [SECURITY.md](../../SECURITY.md) remains mandatory.

## 13. Release cadence and upstream relationship

Cadence is evidence-driven, not calendar-forced:

| Release type | Target cadence | Gate |
|---|---|---|
| Security patch | As needed after coordinated validation | Exploit regression, affected clean-machine cells, provenance/signature, advisory, and rollback pass. |
| Patch | Batched when fixes are ready | Full affected QC set, no schema break, updated result and known-issue records. |
| Minor | No more often than monthly during beta | All launch gates for changed modules/providers, migration notes, compatibility matrix, and release-candidate soak. |
| Major | Only after public RFC and migration rehearsal | At least 30 days of RFC review, two release-candidate migrations, deprecation closure, clean installs/upgrades/rollbacks, and updated benchmark protocol. |

This cadence is a target, not a support SLA or promise to release when evidence is red.

Upstream treatment is respectful and operational:

- name the exact repository, commit, licence, copied/derived spans, and local successor;
- retain required notices and mark modifications;
- send generally useful fixes upstream before carrying a permanent fork when practical;
- publish an “upstream changed” notice when a monitored pin moves or a material capability/licence changes;
- never frame an upstream weakness as marketing proof that SiteSmith is superior.

[LICENSE-DERIVATION-AUDIT.md](./LICENSE-DERIVATION-AUDIT.md) is the provenance authority, and [UPSTREAM-FORENSICS.md](./UPSTREAM-FORENSICS.md) is the mechanism authority. Upstream update notices do not change a frozen benchmark treatment; they create a new candidate revision and rerun requirement.

## 14. Staged adoption milestones

No stage promises stars. Each stage has an evidence exit and can stop without invalidating earlier work.

| Stage | Scope | Exit evidence | Adoption signal |
|---|---|---|---|
| A0 — foundation integrity | Approve architecture, close licence blockers, freeze schemas and QC contracts. | Canonical docs agree; local links/schema checks pass; 59 capability treatments are bound; no historical evidence changes. | Maintainers can explain the category and stop conditions consistently. |
| A1 — internal runtime | Artifact/event core, one provider candidate, ValidatedBrief, recovery, and clean install prototype. | Replay/crash/security fixtures and first-artifact p95 pass on declared cells. | Internal users complete repeated runs without maintainer source edits. |
| A2 — no-build direction | Grounded worlds/cards, critique, selection/reject/reroll, locked DesignSpec, and compact/v2/full no-build ablation. | `QC-CREATIVE-01`, `QC-DIVERSITY-01`, `QC-DIRECTION-02`, spec, stale-selection, isolation, cost and SLO gates pass on frozen fixtures; an inconclusive/failed ablation reopens the architecture before website build. | Users can choose among meaningfully different directions and understand why without unbounded ceremony. |
| A3 — synthetic end-to-end | One supported stack and provider path through isolated build and ProofBundle. | Positive and injected-failure runs reproduce on Windows/Linux; failures stay red. | A non-maintainer reproduces the run from docs. |
| A4 — private pilots | Three risk-separated real projects under consent: brand-led marketing, asset-led commerce, and stateful product UI. | Individual proof, assignment-blinded review, combined portfolio diversity, consented case records, and no unresolved critical defect. | At least ten consented external beta activations and five second validated runs within 30 days. |
| A5 — public beta | Safe release command, provider badges, docs IA, public result browser, RFC/community operations. | Every beta launch gate in section 16 passes; limitations and unsupported providers are explicit. | Activation, completion, repeat use, support load, and churn reasons are measurable without required telemetry. |
| A6 — stable ecosystem | Stable extension API, compatibility policy, sustainable maintenance, matched benchmark where authorised. | Upgrade/rollback history, external extension conformance, security practice, and reproducible public results across release cycles. | Independent maintained extensions and repeated production use without weakening quality gates. |

## 15. Risks and anti-gaming controls

| Risk | How it could fool the project | Control |
|---|---|---|
| Showcase cherry-picking | Generate many pages, publish only the visually strongest, and hide failures. | Preregister assignments and budgets; publish all valid runs; require individual plus frozen-portfolio review. |
| Benchmark overfitting | Tune prompts, fixtures, or thresholds after seeing competitor outputs. | Freeze protocol, treatments, rubric, order, and analysis first; keep holdout briefs and supersede rather than rewrite results. |
| Provider drift | A silent model update changes quality, cost, external data handling or failure behaviour while the badge remains. | Pin/report exact versions and local/network mode where possible; timestamp unknown versions/retention; invalidate and rerun affected conformance. |
| Timing manipulation | Exclude retries, warm caches, slow failures, dependency work, or user repair from the p95. | Enforce section 6 boundaries, publish raw durations and exclusions, and count failed runs as over-SLO. |
| Popularity gaming | Buy stars, coordinate reciprocal starring, or treat launch traffic as product proof. | Never gate features on stars; exclude stars from quality/adoption gates; disclose campaigns and suspicious discontinuities. |
| House-style convergence | Reusable templates make every output look like SiteSmith. | Templates contain contracts, not themes; run subject grounding, rendered difference, and portfolio-diversity gates. |
| Badge inflation | List many providers/extensions that merely install. | Tier labels are machine-checked and release-specific; no conformance report means experimental or unlisted. |
| Hidden manual labour | Maintainers repair artifacts or select outputs while presenting an automated result. | Record every intervention, actor, artifact mutation, retry, and adjudication in the public result. |
| Supply-chain compromise | The one-command installer becomes the easiest path to execute malicious code. | Signed provenance, SBOM, pinning, unprivileged install, path confinement, security review, and revocation/rollback. |
| Community overload | Adoption grows faster than review/security capacity, causing unsafe merges or abandoned users. | Publish support boundaries, cap release scope, measure queue age, recruit role owners, and pause new extension classes when coverage is red. |

## 16. Measurable launch gates

Public beta is **NO-GO** until every applicable gate is green:

| Gate | Pass condition |
|---|---|
| Positioning | Five target-user comprehension tests identify the category, primary user, expected first artifact, and “not autonomous compiler” boundary without coaching; no superiority language appears. |
| Integrity | Architecture approved; 59/59 capability rows linked to implementation tests or explicitly deferred; licence/provenance audit has no release blocker; historical evidence is immutable. |
| Installation | One-command syntax has passed namespace/security proof and 30/30 clean-machine install/update/uninstall runs per claimed OS shell; no unowned deletion or privilege requirement. |
| Time to value | In the fixed complete-brief cohort, `validated_ready` p95 ≤5 minutes with at least 30 cold runs per claimed provider/OS/mode cell, at least 95% correct-ready completion, raw boundaries published, and wrong/gratuitously blocked runs counted over-SLO. Incomplete-brief correct-block timing is separate. |
| Provider truth | At least one provider is P3; every displayed provider badge links to a release-specific conformance record; Claude/Codex/Cursor are not promoted beyond earned tiers. |
| Product proof | Release-scope QC gates pass; known-bad controls remain failing; one synthetic end-to-end fixture reproduces on Windows/Linux; failed audit cannot become green through prose or waiver omission. |
| Results | PublicResultRecord validates all demos and benchmarks; raw artifacts, failed runs, deviations, usage unknowns, blinding, limitations, and supersession are visible. |
| Showcase | No page appears until exact-run proof, assignment-blinded individual review, portfolio-diversity gate, rights/provenance, and public manifest all pass. Zero showcase entries is valid. |
| Documentation and recovery | IA pages, reference metadata, local/external link checks, quickstart user test, blocked/resume/stop recovery, uninstall, and unsupported-state guidance pass. |
| Security and governance | Private reporting works; threat model, signed provenance, SBOM, code of conduct, RFC process, named release roles, independent sensitive-change review, and rollback/revocation drill are complete. |

Stable 1.0 additionally requires:

- at least two consecutive beta release cycles with successful upgrade and rollback evidence;
- the consented external cohort and repeat-use gate from A4, with churn reasons published in aggregate;
- one externally authored test-bearing contribution through the complete review/RFC path;
- extension compatibility and deprecation fixtures across two minor versions;
- no unresolved critical security issue or benchmark-integrity incident.

Passing these gates permits a release claim about the tested system and boundary. Rendered outcomes,
workflow evidence and contract status remain separate. Passing does not prove universal website
quality, upstream superiority, full offline generation, market adoption, or progress toward 100,000
stars.
