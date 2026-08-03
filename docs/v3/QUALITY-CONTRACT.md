---
title: SiteSmith v3 quality and release contract
status: contract-complete-not-executed
date: 2026-07-30
contractVersion: 1.3.0
ai_generated: "(C)"
---

# SiteSmith v3 quality and release contract

## 1. Claim boundary

This contract is binding on v3. SiteSmith may not be described as **better**, **production-ready**,
**the ultimate website builder**, or superior to any frozen upstream until every required gate in
this document passes and the public result bundle can be reproduced. Architecture approval means
only that the proposed system is coherent enough to implement; it is not a quality result.

The contract evaluates three claims that may not be pooled into one score:

1. **Capability non-regression:** every non-rejected strength in the
   [59-row supremacy matrix](./CAPABILITY-SUPREMACY-MATRIX.md) passes its own preregistered
   assertion; an average or cluster score may not hide one regressed row. Every rejected mechanism
   passes its exclusion/negative fixture. A rejected strength is not carried and receives no
   non-inferiority claim merely because its source mechanism stays excluded.
2. **Rendered outcome:** on the preregistered corpus, preference, absolute visual/UX ratings,
   completion, mechanical website quality, cost and time are estimated against each named arm.
   Only this estimand can support the narrowly worded rendered-result claim in section 14.
3. **Workflow evidence outcome:** truth provenance, decision provenance, implementation-constraint
   fidelity and replayable proof are reported separately as product-mechanism outcomes. Their own
   floor is a SiteSmith release gate, but comparative advantage on this SiteSmith-shaped composite
   is never folded into rendered preference or called better website quality.

No star count, repository size, citation count, command count or internal test count is outcome
evidence.

## 2. Normative gate IDs

Every capability row already names one of these gates. A gate ID is stable; changing its meaning
requires a versioned contract change before results are observed.

| Gate | Required outcome |
| --- | --- |
| `QC-INSTALL-01` | One-command release install, transactional provider materialisation, licence/notice carriage, doctor output and provider conformance. |
| `QC-TRUTH-01` | Brief, claims, product facts, unknowns, assets and redesign constraints are source-linked; unsupported production claims fail closed. |
| `QC-KNOWLEDGE-01` | Versioned UX/stack knowledge returns ranked, provenance-bearing records, exposes conflicts/fallbacks and never chooses art direction by top-one lookup. |
| `QC-CREATIVE-01` | A clear subject-grounded thesis, characteristic signature, intentional type/composition/motion and non-generic interface writing survive blind review. |
| `QC-DIVERSITY-01` | Candidate directions and repeated runs are structurally different without becoming random, opposite-default or lower-quality. |
| `QC-SPEC-01` | The approved direction compiles to a locked, machine-readable DesignSpec with field provenance, approval and fidelity checks. |
| `QC-BUILD-01` | The supported stack builds, type-checks and preserves the locked contract, truthful content, asset rights and required journeys. |
| `QC-CRAFT-01` | Critique, polish, hardening and continuous detectors improve craft without silent redesign or unbounded loops. |
| `QC-PROOF-01` | Browser, accessibility, responsive, console, link, overflow, journey, asset and production gates emit replayable evidence. |
| `QC-RECOVERY-01` | Append-only state, invalidation and crash recovery are idempotent and preserve every accepted artifact and decision. |
| `QC-BENCHMARK-01` | Frozen systems, equal budgets, blind external evaluation, mechanical measurement, statistics and public artifacts satisfy the win rules below. |

The matrix's lower-level subchecks are binding children, not aliases that disappear into a parent:

| Subgate | Parent gate(s) | Reproducible fixture and pass threshold |
| --- | --- | --- |
| `QC-ROUTING-01` | `QC-INSTALL-01` | Frozen surface × page-job × task table including standard complete, forbidden-capability and ambiguous cases; identical normalised input plus registry version yields an identical decision hash, selected/excluded form a justified 59/59 partition, 100% required capabilities are selected, zero forbidden capabilities are selected, every standard task selects `1–58` capabilities, and ambiguity emits no WorkOrder. For every valid route, `CapabilityPacketManifest` carries exactly the selected set, every required capability and zero excluded/forbidden capabilities; packet, WorkOrder and submission quote identical route/manifest/instruction digests, and provider capability evidence proves the same sets before output validation. An all-59 standard-task fallback, silent ambiguity guess, required omission, or excluded/forbidden/full-registry instruction injection after valid routing fails and stays in the denominator. |
| `QC-DIRECTION-01` | `QC-DIVERSITY-01` | Frozen default/opposite-default labelled corpus; balanced accuracy `≥ 0.80`, each class recall `≥ 0.75`, and no increase in blind seven-point quality worse than the row-level `−0.25` non-inferiority margin. |
| `QC-DIRECTION-02` | `QC-DIVERSITY-01`, `QC-SPEC-01` | The no-build compact/v2/full ablation in §5.1; schema/structural assertions are exact binary, selection-ready success is `≥ 95%`, time-to-direction p95 is `≤ 12 min`, and the full-flow paired median token, monetary-cost and wall-time ratios are each `≤ 1.5×` both compact controls. |
| `QC-FIDELITY-01` | `QC-SPEC-01`, `QC-BUILD-01` | Two independently assigned builders receive the same locked spec; normative-field drift is zero, all compiled acceptance assertions pass, and blind fidelity is non-inferior with adjusted lower bound `> −0.25` on seven-point ratings. |
| `QC-MOTION-01` | `QC-CRAFT-01`, `QC-PROOF-01` | Frozen motion-purpose fixtures plus browser traces; every motion has a declared purpose, reduced-motion disables non-essential motion, cleanup leak count is zero, and no long-task/performance hard gate regresses. |
| `QC-UX-01` | `QC-CREATIVE-01`, `QC-PROOF-01` | Semantic-structure fixtures; every repeated marker maps to a typed content relation, screen-reader order matches visual hierarchy, and blind IA rating is non-inferior with adjusted lower bound `> −0.25`. |
| `QC-CREATIVE-02` | `QC-CREATIVE-01` | Thesis-trace fixture on B01–B12; 100% of hero theses cite page job plus evidence or an explicit creative origin, zero contradicted claims render, hero-specificity mean is `≥ 4.5/7`, and the adjusted lower bound versus each applicable upstream is `> −0.25`. |
| `QC-CREATIVE-03` | `QC-CREATIVE-01`, `QC-PROOF-01` | Typography fixture on B01–B12; 100% font provenance/fallback coverage, zero missing-font or fallback-overflow screenshots, at least two semantically distinct type roles, and blind typography-identity non-inferiority lower bound `> −0.25`. |
| `QC-CREATIVE-04` | `QC-CREATIVE-01`, `QC-CRAFT-01` | Frozen clutter/signature corpus plus B01–B12; zero untraced decorative invariants, one declared characteristic signature survives, mean coherence/restraint is `≥ 4.5/7`, and adjusted non-inferiority lower bound is `> −0.25`. |
| `QC-UX-02` | `QC-TRUTH-01`, `QC-CREATIVE-01`, `QC-PROOF-01` | State-copy fixture; 100% required loading/empty/error/success/action states exist, factual statements link to ClaimLedger, action vocabulary conflicts are zero, and blinded task/action comprehension is `≥ 80%` with adjusted binary non-inferiority lower bound `> −5` percentage points. |

The canonical, versioned preregistration is
[STRENGTH-ASSERTIONS.json](./STRENGTH-ASSERTIONS.json). It contains exactly 59 assertions, one per
ledger/matrix capability ID, including exact ledger strength, exact matrix rendering where wording
differs, frozen source baseline, fixture, applicable cases, observable measure, benefit direction,
margin or exact-binary rule, parent QC, subgate, result path, negative control, rejection treatment
and `preregistered-not-executed` status. Assertion presence is not a result.

For a clean-room reimplementation, the row-level result contains two independent verdicts: a
positive successor fixture for the retained observable outcome and a separate negative fixture for
the old source mechanism. Both must pass. Source-mechanism absence alone is not outcome retention,
and positive outcome proof cannot authorise copied code, data expression, runtime behaviour, or
prompt expression.

When a capability has no named lower-level QC in its canonical verification method, its subgate is
`SA::<capabilityId>`: a binary, assertion-specific child of the matrix row's parent QC gate. This
identifier does not create a second test; it makes the row-level verdict addressable and prevents a
parent aggregate from hiding a missing capability result.

## 3. Frozen systems and comparison arms

The primary benchmark has five arms:

| Arm | Frozen comparison unit | Native entry boundary |
| --- | --- | --- |
| Taste | [`Leonxlnx/taste-skill@e988add`](https://github.com/Leonxlnx/taste-skill/tree/e988add20dab0fa97d7a76781c48961c8184288e) | Default website-design skill selected through its documented install/activation route. |
| UI/UX Pro Max | [`nextlevelbuilder/ui-ux-pro-max-skill@4857a2c`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/4857a2c5ef989794751a0f66b8545a4a49566286) | `ui-ux-pro-max` default skill plus its required local generator/search runtime. |
| frontend-design | [`anthropics/skills@b29e7cf`](https://github.com/anthropics/skills/tree/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design) | The compact `frontend-design` skill from the `example-skills` bundle. |
| Impeccable | [`pbakaus/impeccable@6b34224`](https://github.com/pbakaus/impeccable/tree/6b342244e915d64b0d6e84d5eec448fd196ce6bb) | Default new-surface path using its documented PRODUCT/direction/build/finish route. |
| SiteSmith v3 | The release-candidate commit recorded in the preregistration | Public default `init → build → audit`; no hidden lab-only assistance. |

The primary comparison runs all five arms on the same exact host, provider/model release and tool
class. Before preregistration, a qualification fixture must prove that every frozen arm activates
through its documented native boundary without source edits, translated instructions, hidden
tools or arm-specific system prompts. A minimal loader may mount the frozen files and invoke the
native entry point; its bytes, arguments and permissions are identical in role, hashed and public.

If any arm cannot run on the common host without semantic change, that comparison is
**NOT COMPARABLE** and the five-arm primary study is blocked. Incompatibility is not an arm loss, a failed
website or permission to switch only that arm to a friendlier model. Provider-native runs are a
separate sensitivity study and may not replace, repair or be pooled into the primary result.

## 4. Twelve-brief benchmark corpus

All cases are synthetic and non-customer. Each brief ships a frozen evidence pack, content truth,
licensed assets or explicit asset gaps, stack target, acceptance journeys and prohibited
fabrications. The full packs are hashed before preregistration.

| Brief | Category | Surface and hard design problem |
| --- | --- | --- |
| `B01` | Marketing | Industrial monitoring launch: technical trust, one clear conversion path and dense proof without a generic SaaS gradient. |
| `B02` | Marketing | Independent music festival: expressive identity, schedule/ticket hierarchy, motion restraint and mobile urgency. |
| `B03` | Marketing | Climate nonprofit campaign: evidence-heavy narrative, donation journey and no invented impact claims. |
| `B04` | E-commerce | Premium tea catalogue/PDP/cart: sensory differentiation, variants, delivery facts and accessible purchase states. |
| `B05` | E-commerce | Refurbished gaming-PC category/configuration/support: comparison density, trust, compatibility and financing copy. |
| `B06` | E-commerce | Independent furniture collection/PDP: editorial imagery, material details, lead time and high-consideration conversion. |
| `B07` | Portfolio | Architecture studio index/case study: plan/drawing vernacular, project navigation and image-led restraint. |
| `B08` | Portfolio | Documentary photographer archive/story: sequencing, captions, rights, keyboard gallery and low-chrome identity. |
| `B09` | Editorial | Research publication issue/article: long-form hierarchy, citations, figures, footnotes and reading progress. |
| `B10` | Editorial | Local culture magazine home/article/newsletter: mixed recency, sections, author identity and subscription journey. |
| `B11` | Product UI | Warehouse operations dashboard: dense tables, exceptions, filters, keyboard actions and empty/error/loading states. |
| `B12` | Product UI | Healthcare appointment/onboarding flow: calm trust, form recovery, validation, accessibility and privacy-sensitive copy. |

Marketing, commerce, portfolio, editorial and product UI are all represented. No corpus case may
be swapped after seeing system output. A broken evidence pack invalidates that brief for every arm,
not just the arm that exposed it.

Each pack also freezes the same starter repository, target stack/version, route and component
scope, required states, user journeys, asset bytes, dependency policy and output boundary for all
five arms. A brief may test multiple states, but it may not quietly require a larger site from one
arm. Corpus results support only these five categories and the declared stack boundary; they are
not evidence for arbitrary industries, stacks or redesigns.

## 5. Runs, budgets and isolation

Each system receives **two fresh assigned runs per brief**:
`12 briefs × 5 systems × 2 runs = 120 assigned runs`. “Assigned” is deliberate: blocked, failed,
timed-out and no-output runs remain in the denominator and are not relabelled as builds. The two
runs use preregistered matched run keys (`R1` with `R1`, `R2` with `R2`) and isolated contexts; a
system may ignore the key, but it may not inherit another run's conversation, files, cache or
selected direction. No additional generation may replace a weak assigned output.

Primary execution controls are:

- exact model build, provider, sampling settings and tool inventory recorded and equal;
- maximum 60,000 billable model tokens, 45 minutes wall time, three build/repair passes and two
  generated-image calls with a common four-megapixel total budget per run;
- identical local brief/evidence/assets, dependency cache policy, network allowlist and target
  stack; no open-ended web search;
- system-native scripts are allowed and logged; extra SiteSmith scripts are not given to upstream
  generation arms;
- every run starts in a newly created workspace outside all repositories and receives a random
  neutral candidate ID;
- one infrastructure retry is allowed only for a preregistered provider outage class, using the
  exact same input. It may supply the candidate only when the first attempt produced no usable
  output, and both attempts remain public. Model or design failure is not retried away.

A scripted neutral user protocol is frozen with every brief. Factual questions receive only the
precommitted answer-key response. Optional preference questions receive the same “no additional
preference” response. If a native arm exposes a visual choice surface, selection is made by a
separate assignment-blinded selector under one fixed brief-fit rubric; the choice, time and any
model cost count against that arm. Maintainers and final outcome evaluators may not select
candidates. SiteSmith's selection mode and actor/isolation label are fixed before runs begin.

Install time is measured separately from build time. The neutral measurement harness runs after
generation for every arm and does not reveal its rubric during generation beyond the common brief
acceptance criteria.

### 5.1 Preregistered no-build compact/v2/full ablation

Before phase 3 implementation begins, the protocol, packets, evaluator rubric, analysis and run keys
for this ablation are hash-locked. It uses B01–B12 with two matched run keys: `12 × 3 arms × 2 = 72`
assigned no-build runs. All arms receive the same locked evidence, provider/model build, sampling,
tool class and no-build budget. They stop at an anonymous builder-ready direction/spec packet:

| Arm | Frozen treatment | Permitted output |
| --- | --- | --- |
| `A0-compact` | The frozen compact frontend-design plan → one self-critique → direct builder packet. | One compact plan/signature and builder packet; no SiteSmith graph, card shortlist or ledger advantage. |
| `A1-v2` | Frozen SiteSmith v2 direction path at its recorded baseline. | Its native direction artifact and normalized builder packet. |
| `A2-full` | Proposed v3 truth refs → CreativePlan → worlds → isolated qualification → equal cards → selected direction → locked DesignSpec. | Direction/proof artifacts plus one normalized builder packet; infrastructure fields are withheld from creative raters. |

Assignment-blinded external raters score subject grounding, thesis/signature coherence, implementable
specificity, useful choice and avoidable ceremony. The normalized packets have equal visual/text
budgets. `A2-full` may proceed to website implementation only if it passes `QC-DIRECTION-02`: it is
non-inferior to both controls on each seven-point creative outcome (`adjusted lower bound > −0.25`),
selection-ready success is `≥ 95%`, p95 evidence-lock→selection-ready time is `≤ 12 min`, and paired
median tokens, exposed monetary cost and wall time are each `≤ 1.5×` each control. At least 18/24
matched pairs per control must be estimable; unknown cost, insufficient power or any failed floor is
`INCONCLUSIVE/FAIL`, reopens M3/M4's architecture decision and blocks phase 4. It cannot be repaired
by changing policy after identified outputs exist.

## 6. Blind external evaluation

At least five external evaluators with declared frontend/UX competence and no contribution to the
candidate systems are recruited before unblinding. Conflicts are published. Candidate pages are
served under neutral paths, stripped of generator metadata and shown in random order.

For each brief and matched run key, SiteSmith is compared separately with the same-key output from
all four upstreams; cross-pairing or choosing the stronger of two runs is prohibited. The design has
`12 × 2 × 4 × 3 = 288` assigned pairwise outcome slots. A renderable pair gets three independent
blinded judgements; a missing/unservable candidate gets three explicit mechanical-loss records, not
invented human ratings. Each of the 120 assigned candidates likewise has three absolute-rating
slots (360 total); missing candidates receive failure records. Every slot is accounted for, and
human versus mechanical outcomes remain distinguishable. Mechanical-loss records are analysed in
completion/hard-gate outcomes and are not inserted into the human preference model as if three
people had viewed a page. Each renderable pair is rated by three different evaluators. Assignment
is balanced so no evaluator sees only one system or a fixed left/right order.

Evaluators receive desktop/mobile renders, the interactive page and the user-facing brief. They do
not receive system identity, prompts, source repository, runtime cost, prior scores or the original
architecture recommendation. The identity key is opened only after signed ratings and mechanical
results are immutable.

“External” excludes maintainers, contributors, upstream authors, prompt/fixture authors, selectors
and anyone who saw identified benchmark output. Compensation, recruitment source and conflicts are
published. Evaluators record suspected system recognition; those ratings stay in the primary
analysis and a preregistered recognition-excluded sensitivity result is reported. Attention-rule
replacement assignments are completed while the identity key remains sealed.

Any model-based review is secondary. Its record must state provider, exposed model identifier,
prompt, artifacts received/withheld, context isolation, candidate blinding and knowledge of the
original recommendation. A fresh prompt to the same model is **process-isolated**, not
model-independent.

Internal semantic work uses the normative `IsolationClass` contract in
[DERIVATION-ARCHITECTURE.md](./DERIVATION-ARCHITECTURE.md). `IS0-same-context` is advisory only;
direction qualification requires at least `IS1-process-isolated`, disputed adjudication requires
`IS2-actor-distinct` or `IS3-human-assignment-blinded`, and the external benchmark uses `IS3`.
Unknown or self-asserted isolation below the required class fails closed. None of these labels is a
claim of model-independence.

## 7. Human outcome rubric

The primary human outcome is forced pairwise overall preference for the brief. Ties are permitted
and count as half a win in the descriptive rate; the preregistered statistical model treats them
explicitly.

Absolute seven-point ratings cover:

1. subject and brand grounding;
2. originality and resistance to recognisable AI defaults;
3. visual coherence and strength of one characteristic signature;
4. typography, colour, composition and motion judgement;
5. information architecture, usability and interface writing;
6. perceived trust, completeness and production readiness; and
7. fit to the evidence, audience and page job rather than evaluator taste alone.

Evaluators must write one evidence-bearing reason for every score of 1, 2, 6 or 7. Raters failing
attention/calibration fixtures are excluded by a rule fixed before unblinding; their assignments
are rerun without revealing identity.

## 8. Structural variation and anti-default measurement

Human originality is paired with a frozen structural signature. For two outputs `a` and `b`,
distance `D(a,b)` is a weighted value in `[0,1]`:

```text
D = 0.30 section/landmark sequence
  + 0.20 layout topology
  + 0.15 hero grammar
  + 0.15 typography-role vector
  + 0.10 palette distribution
  + 0.10 interaction/motion plan
```

Token renaming, reordered class names and colour hue alone cannot create structural distance. The
extractor and thresholds are frozen against a separate labelled calibration set before benchmark
identities are opened.

`QC-DIVERSITY-01` requires, without lower human quality:

- all 24 assigned SiteSmith runs produce valid candidates; within each brief, the two have
  `D ≥ 0.30`;
- across those 24 candidates, median cross-brief distance is `≥ 0.45`;
- no more than two builds share the same hero-grammar plus landmark-sequence signature; and
- no unexplained device in the preregistered anti-default vocabulary appears in more than one-third
  of SiteSmith candidates across three or more categories; a brief-grounded exception is declared
  before scoring, and the relevant blind rating must remain non-inferior.

These are regression floors, not proof that maximum visual difference is desirable.

## 9. Mechanical website gates

The neutral harness applies the same page-level commands, thresholds, browser build and frozen
starter-repository baseline to every assigned candidate. A missing/unservable output is a hard run
failure, not an exclusion. SiteSmith must additionally emit its own equivalent raw evidence and
ProofBundle; an upstream arm is not penalised for lacking SiteSmith-specific artifacts except in
the separately named evidence-to-proof system outcome. Each final SiteSmith candidate must satisfy
all hard gates after its permitted repair passes:

- successful production build and the common scaffold's type-check/lint/tests; no new
  high/critical dependency advisory relative to the frozen starter baseline and audit database;
- Chromium renders at 375×812, 768×1024 and 1440×900, with both light and dark preference emulation;
- zero serious/critical axe violations, zero known unwaived WCAG A/AA failure, visible keyboard
  focus and complete keyboard journeys;
- zero unexpected console/page errors, dead internal links, horizontal overflow or missing required
  route;
- 100% of the brief's purchase, form, navigation, error and recovery journeys pass;
- every non-trivial claim maps to evidence in the ClaimLedger; a visible citation is required only
  when the brief/genre requires it, while unresolved production claims fail rather than ship TODOs;
- every asset has source/provider, rights, checksum, dimensions, alt decision and usage status;
- DesignSpec tokens, structure, copy claims and selected signature pass fidelity checks; and
- on fixed hardware and network profile, three cold-navigation repetitions per candidate have
  median LCP `≤ 2.5 s`, CLS `≤ 0.10` and total blocking time `≤ 200 ms`, with cache/network/profile,
  harness version and the preregistered brief asset budget recorded.

Minor advisory findings remain public and contribute to continuous scores. A waiver must name
owner, reason, scope and expiry; a waiver cannot override a claim, journey, licence or
serious/critical accessibility failure.

## 10. Truth, knowledge, spec and craft gates

The following system-level outcomes sit beside rendered-page measurement:

- `QC-TRUTH-01`: gold fixtures cover explicit, missing, contradictory and malicious evidence;
  unsupported claims and fake social proof are blocked with calibrated unknown states.
- `QC-KNOWLEDGE-01`: every lookup returns record ID, dataset/version/hash, score, conflicts and
  fallback; 66 known duplicate-key UI/UX reasoning cells are rejected rather than silently parsed.
- `QC-CREATIVE-01`: with brand names, category labels, unique numeric facts and exact copied phrases
  masked in both candidate and answer cards, an evaluator sees one render and all twelve B01–B12
  brief summaries in independently randomised order and selects exactly one. Chance is `1/12 =
  8.33%`, not 25%. Point accuracy must be `≥ 50%` and its preregistered 95% Wilson lower bound must
  exceed `8.33%`; a simulation before generation must show `≥ 80%` power at the 50% design point
  after the declared multiplicity correction, otherwise evaluator assignments increase before the
  identity key exists. Prompt authors, selectors and anyone who saw identified output cannot rate;
  OCR/exact-phrase overlap is reported as leakage, candidates remain in the denominator, and a
  recognition-excluded sensitivity analysis may not replace the primary result. Thesis/signature
  fields plus `QC-CREATIVE-02/03/04` and `QC-UX-01/02` must also pass.
- `QC-SPEC-01`: every required DesignSpec field has origin (`observed`, `user-approved`,
  `creative`), source pointer where applicable, schema version and approval hash; round-trip drift
  is zero for normative fields.
- `QC-BUILD-01`: each supported stack passes a gold build/route/journey fixture and changes outside
  the WorkOrder are zero.
- `QC-CRAFT-01`: on a frozen labelled corpus each release detector has precision `≥ 0.90`, recall
  `≥ 0.80` and false-positive rate `≤ 5%`; polish may not change locked direction without a new
  decision event. Corpus size, class balance and confidence intervals are published.

All 59 supremacy rows now have one versioned `StrengthAssertion` in
[STRENGTH-ASSERTIONS.json](./STRENGTH-ASSERTIONS.json). The file is frozen before fixtures or outputs
are generated. Its current status is `preregistered-not-executed`; it supplies test contracts and
planned result paths, not passing evidence. The assertion contract binds this document's exact
`contractVersion` and SHA-256; `IMP-002` also binds the exact derivation-architecture version and
SHA-256. Each row's canonical `verdictPredicate` seals its measure, fixtures/cases, comparison mode
and margin, gate/subgate, negative control, result path, and the missing/inconclusive/waiver/
denominator failure semantics. Any change to one of those inputs or either bound policy produces a
new semantic hash, requires a higher assertion version against the Git base revision, and forces a
new preregistration before any output identity is opened. An unchanged semantic hash may not receive
a cosmetic version bump. An initial seal is invalid if any planned result artifact already exists.

Every non-rejected row must link to its own passing result. Deterministic/runtime strengths pass an
exact source-baseline and v3 fixture; human outcome strengths pass their row-level comparative rule
in section 13. Each clean-room row additionally passes its separate old-source-mechanism negative
fixture. Rejected mechanisms pass only the matrix's exact exclusion fixture. A row that is not
meaningfully exercised by the 12 websites is tested in its install/provider/recovery/system
fixture—it is not marked “not applicable” and hidden. Cluster summaries are diagnostic only; one
unexplained, missing or regressed material row fails capability non-regression and the release.
The four explicit exceptions to preservation are `TASTE-CAP-013` (loss: “App-native
flow/readability consistency”), `TASTE-CAP-019` (loss: “Small understandable transformations”),
`uupm.bundle.sibling-skills` (loss: “broader creative workflow from one install”), and `IMP-015`
(loss: “Tæt visuel feedbackloop”). Each negative fixture proves exact exclusion only. None proves
its strength carried, preserved, replaced, or non-inferior; no such claim is permitted without a
new architecture, capability, and licence decision.

## 11. Reproducibility, crash recovery and provider gates

`QC-RECOVERY-01` fault-injects a process stop before and after every state transition, plus provider
timeout/cancellation, malformed response, truncated artifact, unavailable network and failed
atomic rename/disk write at the relevant boundaries. Resume must preserve accepted artifact
hashes, append one explicit recovery event, avoid duplicate side effects and recompute only
invalidated descendants. A nondeterministic provider retry creates a new attempt artifact; it never
overwrites history. Crash tests assert both final state and absence of duplicate external writes.

Given the same committed inputs, policy versions and run key, all deterministic artifacts, state
transitions, lookup rankings and manifests must be byte-stable after canonical path/newline
normalisation on every claimed OS (Windows and Linux are the minimum release cells; macOS is named
only after it passes). Model output need not be byte-identical, but its prompt, provider/model
identifier, budgets, dependencies, decisions and output hashes must be replayable.

`QC-INSTALL-01` requires:

- one copy-paste release command from a clean documented prerequisite state;
- `QC-ROUTING-01` passes the frozen routing corpus with a deterministic, justified
  `selectedCapabilities`/`excludedCapabilities` partition, 100% required coverage, zero forbidden
  selection, a proper subset for standard tasks, and fail-closed ambiguity without a WorkOrder;
- route→packet→submission parity passes: the sealed capability manifest and instruction digest
  carry exactly the selected set, all required capabilities and zero excluded/forbidden
  capabilities; otherwise-valid routes seeded with a missing required instruction or an
  excluded/forbidden/full-registry instruction remain red through provider submission;
- `QC-ROUTING-01` remains unexecuted in this foundation. Static document consistency cannot pass
  it; the result requires the executable routing corpus and four independent boundary
  implementations named above;
- 30/30 cold install → doctor → second-install idempotency → update/rollback → uninstall passes per
  claimed OS/shell cell, with no privilege requirement or unowned deletion;
- p95 install plus doctor `≤ 180 s` across those cold runs on the declared CI network profile;
- p95 first ValidatedBrief (ProductBrief plus RunContext envelope) `≤ 5 min` over at least 30 cold
  starts per claimed provider/OS cell after prerequisites, using the exact timing/exclusion rules in
  [ADOPTION-ARCHITECTURE.md](./ADOPTION-ARCHITECTURE.md);
- transactional rollback on interruption and no mutation outside declared provider roots;
- offline operation of the deterministic local core after pinned dependencies/catalogues are
  present; model-owned direction/build stages use the declared local or network provider mode and
  no full-offline website-flow claim is allowed until a local provider passes the same end-to-end
  conformance suite;
- complete local licences/notices; and
- provider failure fixtures for denial, timeout, cancellation, malformed output, usage/cost
  unavailable and unsupported capability; and
- identical command/event types, artifact schemas, validation, failure semantics and permission
  boundaries on every claimed provider. Creative content and direction choices need not match.

Claude, Codex and Cursor are packaging baselines, not automatic v3 support claims. Each receives
only the tier it earns under the conformance contract. Additional providers are not supported
merely because files can be generated for them; they need the same public suite and capability
matrix.

## 12. Time, cost and documentation

Every run publishes input/output tokens, model cost, image/tool cost, wall time, repair count,
network requests and time to first useful artifact. Unknown provider usage remains `unknown`; it is
never imputed as zero. Cost and time are compared on preregistered matched brief/run pairs where
both candidates reach the neutral build/render floor. For each upstream separately, the median
SiteSmith/upstream ratio for both total cost and wall time must be `≤ 1.5×`. Failed and blocked runs
remain in completion/failure outcomes and may not become cheap efficiency references.

At least 18 of 24 matched pairs per upstream must reach that neutral floor for its relative
efficiency result to be estimable. Fewer pairs, unknown monetary cost, a ratio above the ceiling or
an absolute token/time budget breach prevents **RENDERED WIN**; actual measurements are still published,
but no efficiency or broad benchmark-win claim follows.

`QC-DIRECTION-02` separately measures compact-flow preservation before build. Time starts at a
hash-valid `evidence_locked` event and stops only when all equal DirectionCards are openable and a
current selection command can produce a schema-valid builder-ready locked spec. Failed, blocked,
timed-out and gratuitously unresolved runs count as slower than 12 minutes. Across at least 30 cold
no-build starts per claimed provider/OS mode, selection-ready success must be `≥ 95%` and p95 time
must be `≤ 12 min`. In the 24 matched ablation pairs per control, median full/control ratios for
tokens, exposed monetary cost and wall time must each be `≤ 1.5×`; unknown monetary cost blocks that
cost claim rather than becoming zero.

At least five external fresh users, distributed across only providers that have earned a release
tier, must follow the frozen public README and documentation for fixed tasks. At least four of five
must complete install, first ValidatedBrief and doctor without maintainer intervention; any unsafe
command, false support statement or unowned mutation fails the gate regardless of completion rate.
Sessions, time, errors and interventions are recorded before docs are changed, and every confusion
becomes a tracked defect. Commands, paths, provider badges and output examples are mechanically
tested against release metadata.

## 13. Statistical decision rules

Analysis code, estimands, margins, exclusions and a simulation-based power/estimability check are
preregistered before any candidate identity is opened. The primary pairwise preference model is a
Davidson/Bradley–Terry mixed-effects model that represents loss, tie and win explicitly, with system
as the fixed comparison and brief, matched run key and evaluator as blocking/random effects. Ties
count as half only in descriptive preference percentages, never inside the fitted model. A
brief-clustered bootstrap is the sensitivity analysis. Holm correction covers the four overall
SiteSmith-versus-upstream preference comparisons. Confidence intervals are 95%.

Non-inferiority is decided **per StrengthAssertion**, not by an average cluster:

- a deterministic, install, provider, recovery, schema or exclusion assertion must pass its exact
  binary fixture; no statistical average can compensate for failure;
- a comparative seven-point human assertion passes only when its multiplicity-adjusted lower bound
  is greater than `−0.25` points;
- a comparative binary pass-rate assertion passes only when its adjusted lower bound is greater
  than `−5` percentage points;
- the applicable brief subset, margin rationale and one-sided model are frozen per row, with Holm
  correction across the family of comparative strength assertions for that upstream; and
- every one of the 59 rows must resolve `PASS` or tested `REJECTED`. `INCONCLUSIVE`, missing,
  underpowered and unmeasurable rows do not establish non-regression.

If the fixed 120-run/ratings design cannot estimate the preregistered margins in simulation, the
study does not start. Evaluator count may be increased before generation and preregistration; run
count, briefs, margins and analysis may not be changed after outputs exist to rescue a result.

SiteSmith is **superior in overall preference** to one upstream only when its point preference is
at least `55%` and the Holm-adjusted lower confidence bound is above `50%`. It must satisfy this
against all four upstreams.

The workflow evidence composite awards one point each for complete truth provenance, distinct
decision provenance, implementation-constraint fidelity and replayable final proof. The neutral
request describes those four outcomes without requiring SiteSmith filenames or schemas from an
upstream. SiteSmith must pass at least `90%` of its available points as an own release floor. Its
adjusted difference from each upstream is reported as a separate workflow-mechanism estimand with
confidence intervals; it is not a condition for, component of, or explanation of rendered preference.
Missing required evidence scores zero; it is not “not applicable”.

No optional stopping, post-hoc subgroup replacement, evaluator removal after identity opening or
silent failed-run deletion is permitted.

## 14. Rendered result, contract result and publication

Validity is decided before product outcome. A common-host failure, leaked identity, broken evidence
pack, missing assigned ratings, post-output protocol change, corrupted key or irreproducible
analysis produces **INVALID / NO RESULT**. It is neither an arm loss nor a tie, and the affected
study must be rerun from sealed inputs. Validity is followed by two separately named results; no
single combined “overall builder win” is computed:

| Result | Exact rule | Maximum public wording |
| --- | --- | --- |
| **RENDERED WIN** | The study is valid; all SiteSmith rendered/mechanical hard gates and absolute budgets pass; all applicable non-rejected comparative StrengthAssertions are non-inferior; paired relative cost/time gates pass; and overall preference clears `55%` with Holm-adjusted lower bound above `50%` against all four. | “Within the preregistered 12-brief, 120-assignment common-host benchmark, SiteSmith v3 achieved the defined rendered-outcome win against the four frozen arms.” No workflow-evidence, universal or future-version claim. |
| **NO RENDERED WIN** | The study is valid but preference superiority or paired relative cost/time is not established. This label is used whether workflow evidence is strong or weak. | Publish rendered measures and say that the benchmark did not establish a rendered-outcome win. Do not call it a statistical tie unless a separate equivalence test passed. |
| **CONTRACT PASS / FAIL** | Independently, SiteSmith passes only when every own hard gate, documentation task, install/provider/recovery requirement, own `90%` workflow-evidence floor and all 59 assertions pass or have tested rejections. Any failed, missing or inconclusive required assertion is FAIL. | Name the contract result and each failed gate. It does not establish or negate rendered superiority. |

To control spend without weakening the final evidence, deterministic contract/licence/fixture
gates run first. A three-brief pilot may test the harness only; its briefs and outputs are excluded
from the primary corpus. The full 120-assignment study runs only after those gates pass.

Publication includes preregistration, prompts, frozen commits, evidence packs where rights permit,
container/host manifests, run logs, costs, all successful and failed outputs, neutral-ID mapping
after unblinding, raw ratings, analysis code, mechanical reports, waivers and result hashes. The
contract is complete; it has **not been executed**, so no current superiority or production-ready
claim follows from this document.
