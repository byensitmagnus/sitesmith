---
title: Capability matrix
state: S4_CAPABILITY_SYNTHESIS
status: complete
inputs: docs/rebuild/MECHANISM-LEDGER.json (140 mechanisms, 17 sources)
ai_generated: "(C)"
---

# Capability matrix

One row per capability the rebuilt skill needs. "Strongest" is the source whose
mechanism survived the red team with the highest confidence *and* fits the two
measured constraints — a script must not decide the design, and nothing may push
unrelated briefs toward one look.

Ledger keys are `source/mechanism-id` and resolve in
[MECHANISM-LEDGER.md](MECHANISM-LEDGER.md).

## How to read the "context cost" column

`always` — resident on every invocation. `step` — opened at its step, put down again.
`on-demand` — fetched only when a question needs it. The budget is fixed: `always`
must stay under about 5,000 estimated tokens in total, because the winning skill did
its whole job in 2,078 and v2.3 spent 6,546 and lost.

---

## 1. Intake and framing

| Capability | Sources | Strongest | Best mechanism | SiteSmith form | Cost | Test |
| --- | --- | --- | --- | --- | --- | --- |
| Brief inference | taste-skill, frontend-design, ai-dev-tasks | **taste-skill** | `taste-skill/brief-inference-design-read` (0.90) | Read who this is for and what it must feel like *before* any aesthetic move | always | a build with a thin brief still names audience and job |
| Subject grounding | frontend-design | **frontend-design** | `frontend-design/subject-grounding-mandate` (0.75) | If the brief does not pin the subject, pin it and state it. Distinctive choices come from the subject's own materials and vernacular | always | every DIRECTION names a concrete subject world |
| Question discipline | taste-skill, ai-dev-tasks, before-implementing | **before-implementing** | `before-implementing/four-quadrant-unknowns-taxonomy` (0.85) | Sort unknowns: look it up, prototype it, assume it, or ask. Only the last becomes a question, and at most one | always | ≤1 question per build; unknowns recorded with their quadrant |
| Taste you cannot verbalise | before-implementing | **before-implementing** | `before-implementing/unknown-knowns-prototypes` (0.85) | Show, don't interrogate. Where taste is unstated, build the smallest artifact that makes it choosable | step | REDESIGN and ambiguous briefs produce a comparison, not a questionnaire |
| Scope and fidelity defaults | ai-website-cloner-template | **cloner** | `ai-website-cloner-template/scope-defaults-block` (0.60) | State the default scope in the skill so ambiguity does not become either a question or silent drift | always | — |
| Evidence before direction | sitesmith-current | **sitesmith-current** | `sitesmith-current/evidence-before-direction` (0.85) | A brief alone can only look like its category. Gather the subject's real material first | step | DIRECTION cites EVIDENCE; a build with no evidence pass is flagged |

**Contested.** taste-skill caps clarifying questions at one; ai-dev-tasks wants a
two-phase approval gate; before-implementing wants a blind-spot pass. Resolved by
sequence, not by choosing: sort unknowns first (before-implementing), ask at most one
question (taste-skill), and reserve the approval gate for work above a size threshold
rather than every build (`ai-dev-tasks/two-phase-approval-gate`, adapted).

## 2. Creative direction — the layer that decided the last comparison

| Capability | Sources | Strongest | Best mechanism | SiteSmith form | Cost | Test |
| --- | --- | --- | --- | --- | --- | --- |
| Creative thesis | frontend-design | **frontend-design** | `frontend-design/two-pass-token-system` (0.75) | Plan a compact token system — 4–6 named colours, 2+ type roles, a layout concept, one signature — then review it against the brief before any code | always | DIRECTION exists before any CSS is written |
| Hero as thesis | frontend-design | **frontend-design** | `frontend-design/hero-as-thesis` (0.70) | Open with the most characteristic thing in the subject's world. The stat-block-plus-gradient is named as the template answer | always | — |
| Anti-default calibration | frontend-design, impeccable, taste-skill | **frontend-design** | `frontend-design/brief-primacy-override` (0.70) + named clusters | Name the defaults, do not ban them. The brief always wins, including into a named default | always | three briefs do not avoid the same things the same way |
| Anti-convergence, enforced | impeccable | **impeccable** | `impeccable/forced-index-direction-roll` (0.85) | Model produces its own grounded shortlist; a cheap external tie-breaker forbids its own argmax. The script never proposes an idea | step | measured: 30/35 identical concepts without it |
| Self-critique before build | frontend-design | **frontend-design** | `frontend-design/self-critique-loop` (0.70) | Re-derive from a similar prompt; if you would land somewhere similar, revise and say what changed | always | — |
| Structurally different comps | sitesmith-current | **sitesmith-current** | `sitesmith-current/structurally-different-direction-gate` (0.90) | Three comps that share a layout and differ in hue are one direction rendered three times | step | mechanical check on comp structure |
| Typographic identity | frontend-design, taste-skill | **frontend-design** | `frontend-design/typography-as-personality` (0.60) | Pair display and body deliberately; make the type treatment itself memorable | always | — |
| Signature restraint | frontend-design | **frontend-design** | `frontend-design/signature-element-restraint` (0.65) | Spend boldness in one place; remove one accessory before shipping | always | — |
| Structure encodes meaning | frontend-design | **frontend-design** | `frontend-design/structure-as-information` (0.65) | Numbering, eyebrows, dividers must encode something true. `01/02/03` only when the content is a sequence | always | — |
| Dials vocabulary | taste-skill, ui-ux-pro-max | **taste-skill** (adapted) | `taste-skill/three-dial-system` (0.80) | Density, motion, boldness as shared vocabulary the model *justifies* — never as a lookup that resolves a vibe word to a number | always | dials appear with reasons, not as table output |
| Register per surface | impeccable | **impeccable** | `impeccable/mode-based-visitor-registers` (0.80) | Marketing, commerce and product UI are different registers of one system, routed per page | step | — |
| Palette retrieval | ui-ux-pro-max, corpus | **ui-ux-pro-max** (adapted) | `ui-ux-pro-max/bm25-csv-retrieval` (0.85) | Retrieval surfaces *candidates with rationale*, never an auto-selected answer. The palette corpus is brief-gated | on-demand | 5 of 8 corpus palettes are dark+warm; ungated use reproduces the house style |

**Rejected here, and this is the important part.** Every mechanism that let a script
pick the creative answer is out: `sitesmith-current/direction-candidate-search`
(BM25 + Jaccard picking the menu the model creates from — the most plausible concrete
cause of the 40-vs-59 loss), `ui-ux-pro-max/design-system-generator`,
`ui-ux-pro-max/ui-reasoning-category-table`,
`taste-skill/combinatorial-variation-picklists`,
`taste-skill/fixed-aesthetic-template-skills`, and `taste-skill/gpt-fake-rng` — which
instructs the model to simulate a Python RNG and treat the fabricated number as
randomness.

## 3. Craft floor

| Capability | Sources | Strongest | Best mechanism | SiteSmith form | Cost | Test |
| --- | --- | --- | --- | --- | --- | --- |
| Named AI-slop habits | impeccable, taste-skill | **impeccable** | `impeccable/craft-floor-ban-list` (0.80) | A list of surface habits, paired with a detector — never prose alone | step | detector runs on built output |
| Detector, not exhortation | impeccable | **impeccable** | `impeccable/mechanical-antipattern-detector` (0.80) | Static analysis of shipped code against the floor | on-demand | the detector's own fixtures |
| The one absolute ban | taste-skill | **taste-skill** | `taste-skill/em-dash-absolute-ban` (0.95) | Softer phrasing measurably failed; this one is absolute | always | grep |
| Design system before code | sitesmith-current | **sitesmith-current** | `sitesmith-current/contract-after-direction-plus-token-drift` (0.82) | A scale, not ad hoc values. Drift scanner catches values invented at point of use | step | token-drift scan |
| Honesty about technology | taste-skill | **taste-skill** | `taste-skill/official-design-system-honesty-rule` (0.80) | Hand-rolled CSS is never described as an official platform technology | always | — |
| Copy as design material | frontend-design | **frontend-design** | `frontend-design/copy-as-design-material` (0.65) | Placeholder copy signals template even when visuals are original | always | — |
| Simplicity with carve-outs | ponytail | **ponytail** | `ponytail/explicit-never-simplify-carveouts` (0.85) | Any "write less" instruction carries its never-cut list in the same breath: validation, security, accessibility | always | measured 20/20 safety vs 95% without |
| Smallest correct build | ponytail | **ponytail** | `ponytail/seven-rung-simplicity-ladder` (0.80) | Prose ladder before writing code. Measured −54% lines. Never converted to a script | step | dependency count per build |

## 4. Verification — where SiteSmith already wins

| Capability | Sources | Strongest | Best mechanism | SiteSmith form | Cost | Test |
| --- | --- | --- | --- | --- | --- | --- |
| Render vs declaration | sitesmith-current | **sitesmith-current** | `sitesmith-current/direction-fidelity-render-check` (0.88) | A direction can be real on paper and absent on screen. Measure the render | on-demand | its own fixtures |
| Fail-closed gates | sitesmith-current | **sitesmith-current** | `sitesmith-current/verify-fail-closed-gates` (0.87) | A gate that did not run must never print PASS | on-demand | control group must keep failing |
| Technical vs visual verdicts | sitesmith-current | **sitesmith-current** | `sitesmith-current/two-gate-separation-technical-vs-visual` (0.83) | "Works" and "good" are separate verdicts. Merging them is how PASS came to mean "this is good" | on-demand | — |
| Honesty checks | sitesmith-current | **sitesmith-current** | `sitesmith-current/production-gate-honesty-checks` (0.85) | A page can pass every a11y check and still ship placeholder imagery | on-demand | — |
| Journeys | sitesmith-current | **sitesmith-current** | `sitesmith-current/interaction-journeys` (0.80) | Nine legacy pages had zero script tags; every state drawn, none reachable | on-demand | at least one journey per surface |
| Cross-project anti-repeat | sitesmith-current | **sitesmith-current** | `sitesmith-current/cross-project-anti-repeat-ledger` (0.85) | House style forms across projects, where per-project checks cannot see it. History vetoes, never proposes | on-demand | known-bad recipe must keep tripping |
| Portfolio diversity | sitesmith-current | **sitesmith-current** | `sitesmith-current/portfolio-diversity-gate` (0.85) | Individual passes can coexist with one studio look | on-demand | showcase currently 0/8 |
| Blind critique that happens | sitesmith-current, impeccable | **sitesmith-current** | `sitesmith-current/assignment-blinded-critique-gate` (0.75) | A blind review described only in prose is a blind review that will not happen | on-demand | — |
| Bounded review loop | impeccable | **impeccable** | `impeccable/bounded-finish-review-loop` (0.85) | Fresh eyes, hard bound, explicit stop | step | loop terminates in every build |
| Validated judge | ponytail | **ponytail** | `ponytail/self-validating-llm-judge` (0.75) | A judge must rank a known-templated reference below a known-distinctive one before it is trusted on real output | on-demand | self-test gate |
| Real UI audit | ui-ux-pro-max | **ui-ux-pro-max** | `ui-ux-pro-max/design-review-subagent-and-heuristic-audit` (0.85) | Verify built UI rather than assert completion | on-demand | — |
| Zero-result honesty | ui-ux-pro-max | **ui-ux-pro-max** | `ui-ux-pro-max/zero-result-honesty` (0.80) | A failed search is never presented as a recommendation | on-demand | — |

## 5. Redesign and reference work

| Capability | Sources | Strongest | Best mechanism | SiteSmith form | Cost | Test |
| --- | --- | --- | --- | --- | --- | --- |
| Preserve vs redesign | impeccable, taste-skill | **impeccable** | `impeccable/preserve-vs-redesign-semantics` (0.85) | Refinement and redesign are different jobs; ambiguity produces timid polish of a broken direction | step | — |
| Audit before touching | taste-skill | **taste-skill** | `taste-skill/redesign-mode-detection-and-audit-first` (0.85) | Redesigns treated as greenfield destroy SEO, brand and IA silently | step | — |
| Interaction model first | cloner | **cloner** | `ai-website-cloner-template/interaction-model-identification-first` (0.75) | Named as the most expensive cloning mistake: click-based rebuild of a scroll-driven original | step | — |
| All states, not the default one | cloner | **cloner** | `ai-website-cloner-template/exhaustive-state-capture` (0.70) | Extracting only the on-load state misses every tab, hover and scroll state | step | — |
| Spec inline, not by reference | cloner | **cloner** | `ai-website-cloner-template/spec-file-inline-only-contract` (0.75) | A builder told to consult a referenced doc either does not read it or the reference drifts | step | — |
| No silent guessing | cloner | **cloner** | `ai-website-cloner-template/no-guessing-completeness-mandate` (0.60) | Gaps get filled invisibly unless refusal is explicit | step | — |

**Rejected:** `ai-website-cloner-template/visual-qa-diff-unmeasured` — an eyeballed
diff presented as a fidelity gate. SiteSmith already has measured comparison; an
unmeasured one would be a downgrade wearing a gate's name.

## 6. Motion and experience

| Capability | Sources | Strongest | Best mechanism | SiteSmith form | Cost | Test |
| --- | --- | --- | --- | --- | --- | --- |
| Motion judgement | frontend-design | **frontend-design** | `frontend-design/deliberate-motion` (0.60) | One orchestrated moment beats scattered effects; extra animation is itself an AI tell | always | — |
| Reduced motion, fully | scroll-world | **scroll-world** | `scroll-world/reduced-motion-full-degrade` (0.70) | Stop loading the clips, not just the animation | on-demand | verification renders both modes |
| Scroll scene model | scroll-world | **scroll-world** | `scroll-world/segment-interleave-scene-model` (0.80) | One flat timeline mapping scroll position to clip and offset | on-demand | only when the brief calls for it |
| Scrub robustness | scroll-world | **scroll-world** | `scroll-world/blob-seek-scrubbing` (0.85) | Scroll-driven `currentTime` fails silently on hosts without byte-range support | on-demand | — |
| Pacing control | scroll-world | **scroll-world** | `scroll-world/linger-ease-pacing` (0.70) | Linear scroll-to-time cannot land the important frame where the reader is | on-demand | — |
| Theme-safe injection | scroll-world | **scroll-world** | `scroll-world/css-layer-theme-override` (0.70) | An injected component's defaults must lose to the host page's theme without `!important` | on-demand | — |
| GSAP correctness | taste-skill | **taste-skill** | `taste-skill/gsap-canonical-code-skeletons` (0.80) | Pin and hijack patterns are easy to get subtly wrong | on-demand | — |

**Rejected:** scroll-world's paid-generation pipeline, its fixed camera roster (a
style menu by another name), and its budget gate. The front-end technique is kept;
the art direction is not.

## 7. Stack, implementation and packaging

| Capability | Sources | Strongest | Best mechanism | SiteSmith form | Cost | Test |
| --- | --- | --- | --- | --- | --- | --- |
| Never assume the stack | ui-ux-pro-max, sitesmith | **ui-ux-pro-max** | `ui-ux-pro-max/stack-never-assume` (0.75) | Detect, then target. Every downstream recommendation depends on it | step | existing stack-router |
| Real design systems | taste-skill | **taste-skill** | `taste-skill/brief-to-design-system-router` (0.85) | Use the real package for Fluent/Material/Carbon/GOV.UK rather than imitating it in CSS | step | — |
| Canonical doc plus overrides | ui-ux-pro-max | **ui-ux-pro-max** | `ui-ux-pro-max/master-overrides-persistence` (0.85) | One canonical design doc; per-page overrides never clobbered by a re-run | step | — |
| Document after build | impeccable | **impeccable** | `impeccable/document-after-build-not-before` (0.75) | A doc written first describes intentions and can canonise a shipped mistake | step | — |
| Self-contained packaging | before-implementing | **before-implementing** | `before-implementing/self-contained-packaging-lesson` (0.70) | A skill that silently depends on other skills gives nothing to an agent that loaded only it | always | this is A1 |
| Tool-agnostic preflight | cloner | **cloner** | `ai-website-cloner-template/tool-agnostic-preflight-detection` (0.65) | Hard-coding one browser automation tool breaks elsewhere | on-demand | — |
| Progress state across sessions | ai-dev-tasks | **ai-dev-tasks** | `ai-dev-tasks/checkbox-state-in-file` (0.60) | A long build must survive being resumed | step | — |
| Technique independence | remotion-skills | **remotion-skills** (re-expressed) | `remotion-skills/remotion-technique-independence` (0.75) | Present mutually exclusive techniques without forcing one. **Licence forbids copying text** | on-demand | — |

**Rejected:** `ponytail/cross-platform-portability-plumbing` (13 duplicated adapter
trees plus a drift checker — the clearest example in the whole corpus of the over-build
this rebuild exists to avoid), `ai-website-cloner-template/multi-platform-single-source-sync`,
`ui-ux-pro-max/multi-copy-sync-architecture`, `magic-21st/magic-21st-hosted-proxy`, and
`agent-elements-21st/agent-elements-full-catalog` — the last kept as a reference for
briefs that explicitly ask for an agent interface, never as a dependency.

## 8. Orchestration — mostly not applicable, and that is the finding

Seven of the eleven mechanisms from agency-agents, ruflo, awesome-claude-code-subagents
and graph-engineering were rejected: swarm platforms, vector memory, role taxonomies
and fan-out patterns help when running a fleet, not when making one skill produce a
better website.

Three survive, all adapted:

| Capability | Source | Mechanism | Why it survives |
| --- | --- | --- | --- |
| Isolated critique | impeccable | `impeccable/dual-isolated-critique-subagents` (0.75) | Degradable: sub-agent when the host has one, inline checklist when it does not |
| Visitor walkthrough | agency-agents | `agency-agents/orch-02-persona-walkthrough` (0.55) | Justify decisions by how a real visitor with an intent moves, not by taste |
| Handoff packet | before-implementing | `before-implementing/launch-packet-role-split` (0.55) | When work is delegated, the packet carries the taste decisions already made |

## 9. Where nothing is strong enough yet

| Gap | Why it matters | Plan |
| --- | --- | --- |
| Judging "generic" automatically | Portfolio diversity is measured structurally, but no mechanism reliably scores *genericness* of a finished page | `ponytail/self-validating-llm-judge` is the shape; the reference pair must be built and the judge must pass its own self-test before any verdict is trusted |
| Imagery and asset sourcing | v2.3 has asset planning; no source has a strong mechanism for *getting* the right image without a paid API | Keep asset planning; treat generation as out of scope with no key present |
| Content architecture at scale | Every source assumes a small page set | Not solved; recorded rather than hidden |

---

## Always-loaded budget, derived from this matrix

Everything marked `always` above is: brief inference, subject grounding, question
discipline, scope defaults, the creative thesis rules, anti-default calibration,
self-critique, typography, signature restraint, structure-as-information, dials
vocabulary, the em-dash ban, technology honesty, copy as design material, simplicity
carve-outs and the self-contained packaging rule.

That is one document about taste and standard. Prose, second person, no tables of
values. The target is **under 5,000 estimated tokens**, against frontend-design's
2,078 and v2.3's 6,546. Everything else in this matrix is opened at its step or
fetched on demand.
