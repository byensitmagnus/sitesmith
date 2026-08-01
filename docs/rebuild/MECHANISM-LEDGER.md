---
title: Mechanism ledger
state: S3_MECHANISM_GRAPH
status: generated
generator: tools/build-mechanism-ledger.mjs
ai_generated: "(C)"
---

# Mechanism ledger

Generated. Do not hand-edit.

67 mechanisms from 5 sources. Red team: 55 confirmed, 3 refuted, 9 unchallenged. Decisions after refutation is applied: 42 adopt, 15 adapt, 1 investigate, 9 reject.

"Unchallenged" means the red team did not examine it, which is weaker than "confirmed" and is kept as a separate state on purpose.

## Refuted — do not build on these without re-reading the source

### frontend-design/named-cliche-calibration

Claimed: Names three specific observed AI-design clusters (cream/serif/terracotta; near-black/acid accent; broadsheet hairline layout) verbatim and requires the model to check its plan against them before building; brief's explicit request always wins.

**Refuted:** The three clusters (cream/serif/terracotta; near-black/acid accent; broadsheet hairline) are confirmed verbatim at line 31. But line 31 itself only presents them 'for calibration' and says not to spend free axes on them — it does not contain an instruction to check a plan against this specific list before building. The actual 'review your plan, revise if generic' instruction lives in a separate paragraph (line 35, already captured by the distinct 'self-critique-loop' claim) and does not reference the three named clusters at all. Citing line 31 alone for a 'requires checking against them' mechanism conflates two paragraphs into one over-stated claim.

Checked at: `skills/frontend-design/SKILL.md:31`

Decision was `adopt`, now `investigate`.

### taste-skill/fixed-aesthetic-template-skills

Claimed: Each hardcodes a complete design system directly in the prompt: exact hex codes, exact radii, exact font-stack priority, numbered component construction methods (e.g. minimalist-skill's #FFFFFF/#F7F6F3/#EAEAEA and four pastel accents; gpt-tasteskill's mandatory #f9fafb background with no override).

**Refuted:** Partially fabricated evidence. soft-skill/SKILL.md (1-98), minimalist-skill/SKILL.md (1-85), and brutalist-skill/SKILL.md (1-93) do genuinely hardcode hex-level design systems as described - minimalist-skill's #FFFFFF/#F7F6F3/#EAEAEA + four pastel accents is verified verbatim (lines 33-40). However, gpt-tasteskill/SKILL.md (checked in full, all 75 lines) contains NO mention of '#f9fafb' or any mandatory background hex at all - it uses picsum.photos placeholder images and CSS filters, not a fixed palette. The string '#f9fafb' actually exists in a different file entirely: skills/taste-skill-v1/SKILL.md:197 ('Background in #f9fafb'). The claim misattributes evidence from one skill file to another, so the specific example given for gpt-tasteskill does not exist at the cited path.

Checked at: `skills/gpt-tasteskill/SKILL.md:1-75 (no #f9fafb present); actual match at skills/taste-skill-v1/SKILL.md:197`


### ui-ux-pro-max/ui-reasoning-category-table

Claimed: 30-row CSV: category -> pattern, style priority, color mood, typography mood, effects, decision-rules JSON, anti-patterns, severity; resolved by near-exact then substring then keyword match.

**Refuted:** The column-schema and 3-tier match logic (_find_reasoning_rule: exact -> substring -> keyword) are real and match the code. But the file is NOT a 30-row CSV -- csv.DictReader on the actual file returns 161 data rows (162 lines including header), more than 5x the claimed size. The citation 'ui-reasoning.csv:1-2' only shows the header plus first row, suggesting the '30-row' figure was guessed rather than verified against the actual file.

Checked at: `.claude/skills/ui-ux-pro-max/data/ui-reasoning.csv (162 lines total; csv.DictReader confirms 161 data rows, not 30)`


## Adopt (42)

| mechanism | source | context cost | red team | what it solves |
| --- | --- | --- | --- | --- |
| `em-dash-absolute-ban` | taste-skill | low | confirmed | The most-violated stylistic tell kept recurring under softer 'use sparingly' phrasing. |
| `brief-inference-design-read` | taste-skill | low | confirmed | Models jump straight to a default aesthetic instead of reasoning about who the site is for and what it should feel like. |
| `structurally-different-direction-gate` | sitesmith-current | medium | confirmed | Three comps sharing layout but differing in hue is one direction rendered three times; round-8 sites passed a 5-axis che |
| `direction-fidelity-render-check` | sitesmith-current | medium | confirmed | A declared direction can be real on paper and absent on screen (dark-mode-only direction rendering light by default). |
| `verify-fail-closed-gates` | sitesmith-current | medium | unchallenged | A gate that silently 'did not run' and still prints PASS is worse than no gate; layouts fitting only under the developer |
| `brief-to-design-system-router` | taste-skill | medium | confirmed | LLMs hand-roll bad imitation CSS for Fluent/Material/Carbon/GOV.UK instead of using real packages, or treat pure aesthet |
| `redesign-mode-detection-and-audit-first` | taste-skill | medium | confirmed | Redesigns treated identically to greenfield builds, silently destroying SEO/brand/IA. |
| `master-overrides-persistence` | ui-ux-pro-max | low | confirmed | Keeping one canonical design doc plus per-page overrides without a re-run silently clobbering prior decisions. |
| `static-ux-knowledge-tables` | ui-ux-pro-max | medium | confirmed | Giving the model concrete UX/accessibility/performance facts to reason against. |
| `design-review-subagent-and-heuristic-audit` | ui-ux-pro-max | medium | confirmed | Actually verifying built UI instead of asserting it's done. |
| `bounded-finish-review-loop` | impeccable | medium | confirmed | Open-ended self-QA loops burn budget without a stop condition, and a build thread reviewing itself inherits its own blin |
| `preserve-vs-redesign-semantics` | impeccable | low | confirmed | Ambiguity about refinement vs redesign leads to timid polish of a broken direction or unrequested visual rewrites. |
| `progressive-disclosure-manifest` | sitesmith-current | low | confirmed | Pulling the whole rule corpus + 1.4MB of CSV data into context on every task burns budget and dilutes attention. |
| `evidence-before-direction` | sitesmith-current | low | confirmed | A brief alone can only look like its category; a page designed from it alone converges with peers. |
| `cross-project-anti-repeat-ledger` | sitesmith-current | low | confirmed | Per-project novelty checks cannot see repetition across projects, which is where house style forms. |
| `production-gate-honesty-checks` | sitesmith-current | medium | confirmed | A page can pass every a11y/layout check and still ship placeholder imagery or an empty logo box. |
| `portfolio-diversity-gate` | sitesmith-current | medium | unchallenged | Individual-page gates can all pass while a set of sites still reads as one studio's work. |
| `two-gate-separation-technical-vs-visual` | sitesmith-current | low | confirmed | Merging 'works' and 'good' is how PASS came to be read as 'this is good'. |
| `contract-after-direction-plus-token-drift` | sitesmith-current | low | confirmed | Not one of nine legacy pages had a spacing/type scale; every value chosen ad hoc at point of use. |
| `official-design-system-honesty-rule` | taste-skill | low | confirmed | Models claim hand-rolled CSS is an official platform technology (e.g. calling glassmorphism 'Apple Liquid Glass'). |
| `zero-result-honesty` | ui-ux-pro-max | low | confirmed | Stopping the model from presenting a failed search as a real recommendation. |
| `craft-floor-ban-list` | impeccable | low | confirmed | LLMs default to a recognizable handful of AI-slop surface habits regardless of brief. |
| `mechanical-antipattern-detector` | impeccable | medium | confirmed | Design critique/floor rules are useless without something actually checking shipped code against them. |
| `mode-based-visitor-registers` | impeccable | low | confirmed | Applying one aesthetic/behavior register to every surface produces surfaces that fight their own purpose. |
| `interaction-journeys` | sitesmith-current | medium | confirmed | Nine legacy pages had zero <script> tags; every interactive state was drawn but never reachable. |
| `subject-grounding-mandate` | frontend-design | low | confirmed | Vague briefs cause generic output because the model has nothing specific to differentiate against. |
| `two-pass-token-system` | frontend-design | low | confirmed | Jumping to code causes ad hoc, uncritiqued design decisions. |
| `single-clarifying-question-cap` | taste-skill | low | confirmed | Agents either guess wrong silently or dump multi-question interrogations before doing work. |
| `stack-never-assume` | ui-ux-pro-max | low | confirmed | Preventing every downstream recommendation from silently targeting the wrong framework. |
| `document-after-build-not-before` | impeccable | low | confirmed | A design-system doc written before the build describes intentions and can silently canonize a shipped mistake as a rule  |
| `hero-as-thesis` | frontend-design | low | confirmed | Hero sections default to stat-block+gradient regardless of subject. |
| `brief-primacy-override` | frontend-design | low | confirmed | Anti-cliché rule could wrongly override an explicit client request matching a named cliché. |
| `self-critique-loop` | frontend-design | low | confirmed | A model's first idea is disproportionately likely to be its most generic idea. |
| `full-output-enforcement` | taste-skill | low | unchallenged | Models truncate long code output with placeholder comments or premature stop. |
| `context-aware-no-argument-routing` | impeccable | low | confirmed | A static command menu forces users to already know which command they want; auto-picking removes user control. |
| `mode-based-routing-not-defaults` | sitesmith-current | low | unchallenged | v1 issued global rules and then contradicted itself when context demanded otherwise. |
| `structure-as-information` | frontend-design | low | confirmed | Numbered markers and other structural devices get applied decoratively regardless of whether content is sequential. |
| `signature-element-restraint` | frontend-design | low | unchallenged | Undisciplined creativity spreads boldness evenly, reading as busy or unfocused; conversely over-restraint fails to take  |
| `copy-as-design-material` | frontend-design | low | unchallenged | Generic/placeholder copy signals templated design even when visuals are original. |
| `persona-framing` | frontend-design | low | confirmed | Default LLM output for 'build a UI' regresses to safe, generic templates because there is no evaluative pressure. |
| `typography-as-personality` | frontend-design | low | confirmed | Type pairing defaults to the same 'safe' families regardless of project. |
| `deliberate-motion` | frontend-design | low | confirmed | Motion is either absent or scattered across hover effects with no orchestration. |

## Adapt (15)

| mechanism | source | context cost | red team | what it solves |
| --- | --- | --- | --- | --- |
| `bm25-csv-retrieval` | ui-ux-pro-max | low | confirmed | Fetching relevant reference rows from a flat CSV corpus by free-text query without an embeddings service or network call |
| `forced-index-direction-roll` | impeccable | low | confirmed | A single model's resonance ranking over its own grounded concept list is deterministic — repo's own measurement: 30/35 i |
| `three-dial-system` | taste-skill | low | confirmed | Gives shared vocabulary for how experimental/animated/dense a design should be instead of vague words. |
| `self-administered-preflight-checklist` | taste-skill | high | confirmed | Prevents shipping known defects (bad contrast, wrapped CTAs, duplicate CTA intent, mixed radii). |
| `gsap-canonical-code-skeletons` | taste-skill | low | confirmed | Scroll-pin/hijack GSAP patterns are easy to get subtly wrong (trigger fires mid-scroll instead of pinning at top). |
| `bias-correction-bans-with-override-paths` | taste-skill | high | confirmed | Blocklisting known LLM-default tells without permanently outlawing them for briefs that genuinely want them. |
| `dual-isolated-critique-subagents` | impeccable | medium | confirmed | A single context doing both subjective and mechanical review anchors on whichever ran first. |
| `assignment-blinded-critique-gate` | sitesmith-current | medium | confirmed | A blind review only described in prose is a blind review that will not happen. |
| `domain-auto-detect` | ui-ux-pro-max | low | confirmed | Routing a free-text query to the right CSV when --domain is omitted. |
| `image-first-generation-discipline` | taste-skill | high | unchallenged | Coded output visually drifts from a strong generated reference image. |
| `design-dials` | ui-ux-pro-max | low | confirmed | Letting a caller nudge the deterministic generator toward more/less bold, motion, or density. |
| `surface-brief-scoping` | impeccable | low | confirmed | Global product/design docs get bloated with one-off route-specific strategy, or that strategy is never written down. |
| `private-reasoning-before-reveal` | frontend-design | low | confirmed | Showing half-formed ideas too early anchors the conversation on a weak draft. |
| `model-specific-rendition-prior-correction` | impeccable | low | confirmed | A specific model has a measured, named default rendering bias for certain subjects that a general 'be original' warning  |
| `css-specificity-caution` | frontend-design | low | confirmed | Narrow implementation bug: type-based and element-based CSS selectors cancelling each other out. |

## Investigate (1)

| mechanism | source | context cost | red team | what it solves |
| --- | --- | --- | --- | --- |
| `named-cliche-calibration` | frontend-design | low | refuted | Model has no internal reference for what current generic AI design looks like, so can't recognize its own output matchin |

## Reject (9)

| mechanism | source | context cost | red team | what it solves |
| --- | --- | --- | --- | --- |
| `gpt-fake-rng` | taste-skill | low | confirmed | Attempts to break the LLM default-to-first-option failure across repeated calls. |
| `design-system-generator` | ui-ux-pro-max | medium | confirmed | Producing one coherent design-system recommendation from a single query in one command. |
| `direction-candidate-search` | sitesmith-current | medium | confirmed | Naive top-3 BM25 search returns three near-identical rows. |
| `fixed-aesthetic-template-skills` | taste-skill | low | refuted | Gives a user who already chose a direction a ready-made fully-specified rule set instead of an open brief. |
| `ui-reasoning-category-table` | ui-ux-pro-max | low | refuted | Giving ~30 product categories a starting style/color/typography/effects bundle. |
| `uncited-laziness-research-essay` | taste-skill | low | unchallenged | Attempts to justify output-skill's claims with cited research. |
| `multi-copy-sync-architecture` | ui-ux-pro-max | low | confirmed | Shipping identical data/scripts to three consumption paths from one source of truth. |
| `design-system-py-legacy-generator` | sitesmith-current | high | confirmed | Nothing — dead v1 code never called by the current pipeline. |
| `combinatorial-variation-picklists` | taste-skill | medium | unchallenged | Same repetitive-output problem as gpt-fake-rng, applied to the image-generation-first workflow. |

## Full records

### frontend-design/brief-primacy-override — `adopt`

**Solves:** Anti-cliché rule could wrongly override an explicit client request matching a named cliché.

**Mechanism:** Single clause: brief's own words always win, even if it asks for one of the named looks.

**Why it works:** Scopes anti-cliché pressure only to axes the brief left open, preventing it from becoming its own rigid rule.

**In SiteSmith:** Keep this override adjacent to any cliché list adopted.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:31` | low | 0.7 | confirmed | Asserted only |

Failure modes:
- Requires correctly classifying 'pinned down' vs 'free', no check provided

### frontend-design/copy-as-design-material — `adopt`

**Solves:** Generic/placeholder copy signals templated design even when visuals are original.

**Mechanism:** Treats words as design material: user-facing vocabulary not system internals, active voice with persistent verb identity across a flow, error/empty states in interface voice, tone tuned to brand/audience.

**Why it works:** Generalizes the anti-genericism pressure from visuals to language with concrete, checkable rules.

**In SiteSmith:** Port the concrete copy rules as an explicit checklist alongside the visual token system.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:27,45-55` | low | 0.65 | unchallenged | Asserted only |

Failure modes:
- No test for tone appropriateness
- Persistent verb identity across a flow isn't verified across a build

### frontend-design/css-specificity-caution — `adapt`

**Solves:** Narrow implementation bug: type-based and element-based CSS selectors cancelling each other out.

**Mechanism:** Single warning sentence naming the failure pattern.

**Why it works:** Specific and names a real recurring bug class, not a creative-reasoning mechanism.

**In SiteSmith:** Not a priority; gate behind stack detection if kept.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:37` | low | 0.4 | confirmed | Asserted only |

Failure modes:
- Only relevant for hand-rolled class-based cascades, less so for utility-first CSS

Conflicts: Stack-dependent; less relevant under Tailwind/CSS-in-JS which SiteSmith mostly targets

### frontend-design/deliberate-motion — `adopt`

**Solves:** Motion is either absent or scattered across hover effects with no orchestration.

**Mechanism:** Frames motion as a subject-tied choice, prefers one orchestrated moment, and explicitly warns extra animation reads as AI-generated.

**Why it works:** Counters the overcorrection where models sprinkle micro-interactions to seem polished.

**In SiteSmith:** One-line principle: pick zero or one orchestrated motion moment, not scattered defaults.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:23` | low | 0.6 | confirmed | Asserted only |

Failure modes:
- No check that chosen motion respects reduced-motion or performance

### frontend-design/hero-as-thesis — `adopt`

**Solves:** Hero sections default to stat-block+gradient regardless of subject.

**Mechanism:** Hero must be 'a thesis' — the most characteristic thing in the subject's world; names the stat-block pattern as the template answer to be justified, not defaulted to.

**Why it works:** Naming the default out loud converts an unconscious habit into an effortful, arguable choice.

**In SiteSmith:** Keep a short list of default hero patterns requiring justification before use.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:17` | low | 0.7 | confirmed | Asserted only |

Failure modes:
- Still permits the cliché when 'truly best', which a weak rationalization can invoke

### frontend-design/named-cliche-calibration — `investigate`

**Solves:** Model has no internal reference for what current generic AI design looks like, so can't recognize its own output matching it.

**Mechanism:** Names three specific observed AI-design clusters (cream/serif/terracotta; near-black/acid accent; broadsheet hairline layout) verbatim and requires the model to check its plan against them before building; brief's explicit request always wins.

**Why it works:** The only mechanism giving the model a concrete, checkable self-test for house-style convergence instead of a vague originality mood.

**In SiteSmith:** Carry a living, periodically-updated cliché list as a mandatory pre-build self-check.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:31` | low | 0.85 | refuted | Asserted only; externally corroborated by blind-test result |

Failure modes:
- List will go stale with no refresh mechanism
- Only catches the three named patterns, not a fourth unnamed one

Conflicts: Tension with hard brand-lock requirements, resolved only via the brief-primacy override

> Downgraded to investigate: the red team refuted the claim as stated. Re-read the source before adopting.

### frontend-design/persona-framing — `adopt`

**Solves:** Default LLM output for 'build a UI' regresses to safe, generic templates because there is no evaluative pressure.

**Mechanism:** Opens by assigning the model a persona ('design lead at a small studio') plus a fictional client who already rejected templated proposals.

**Why it works:** Persona + adversarial backstory changes the model's implicit self-evaluation criterion mid-generation, before any design decision is made.

**In SiteSmith:** Open direction-setting with a short persona+adversarial-client sentence.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:9` | low | 0.6 | confirmed | Asserted only |

Failure modes:
- Persona alone doesn't guarantee follow-through without the later self-critique step

### frontend-design/private-reasoning-before-reveal — `adapt`

**Solves:** Showing half-formed ideas too early anchors the conversation on a weak draft.

**Mechanism:** Instructs doing planning/iteration in private thinking, only showing ideas once confident.

**Why it works:** Pushes brainstorm-critique into a private reasoning trace so the visible output is already past self-rejection.

**In SiteSmith:** Keep as runtime-agnostic instruction to iterate before presenting.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:39` | low | 0.55 | confirmed | Asserted only |

Failure modes:
- Assumes a runtime feature that may not exist everywhere

Conflicts: Runtime-dependent value

### frontend-design/self-critique-loop — `adopt`

**Solves:** A model's first idea is disproportionately likely to be its most generic idea.

**Mechanism:** After drafting the plan, model reviews it against the brief and against 'what a similar brief would produce', revises and states what changed, only then writes code.

**Why it works:** Forces an explicit counterfactual comparison rather than a vague self-check; enforces the cliché-list mechanism.

**In SiteSmith:** Mandatory single self-critique pass against the living cliché list; log the 'what changed and why' note for auditability.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:35` | low | 0.7 | confirmed | Asserted only, no rubric |

Failure modes:
- Single iteration, self-graded, no external check
- Can be skipped under pressure since nothing external gates it

### frontend-design/signature-element-restraint — `adopt`

**Solves:** Undisciplined creativity spreads boldness evenly, reading as busy or unfocused; conversely over-restraint fails to take a risk.

**Mechanism:** Concentrate boldness in the one signature element; hold everything else to a quiet, disciplined quality floor (responsive, keyboard focus, reduced motion) without announcing it.

**Why it works:** Operationalizes 'elegance' as a resource-allocation rule rather than a vague aesthetic goal.

**In SiteSmith:** Keep the resource-allocation framing and pair with SiteSmith's real verify.mjs-equivalent gate rather than leaving it as an assertion.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:41-43` | low | 0.65 | unchallenged | Asserted for aesthetics; quality-floor items are checkable but no tool is named |

Failure modes:
- No tooling to verify the quality floor was actually met
- Screenshot self-critique is conditional and unenforced

### frontend-design/structure-as-information — `adopt`

**Solves:** Numbered markers and other structural devices get applied decoratively regardless of whether content is sequential.

**Mechanism:** States structural devices should encode something true about content; numbered markers legitimate only if content is truly a sequence, and instructs questioning the choice.

**Why it works:** Gives a testable condition instead of a vague 'avoid clichés' instruction, targeting one of the most recognizable AI-template tells.

**In SiteSmith:** Generalize the test ('does this structural device encode something true?') to all structural devices.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:21` | low | 0.65 | confirmed | Asserted only |

Failure modes:
- Only names one structural device; doesn't generalize explicitly to other decorative structures

### frontend-design/subject-grounding-mandate — `adopt`

**Solves:** Vague briefs cause generic output because the model has nothing specific to differentiate against.

**Mechanism:** If brief is thin, model must invent a concrete subject/audience/page-job itself and state the choice, drawing distinctiveness from the subject's own materials/vernacular.

**Why it works:** Directly counters house-style convergence by forcing domain-specific texture that can't be identical across subjects.

**In SiteSmith:** Mandatory explicit subject/audience/job statement before token system.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:11-13` | low | 0.75 | confirmed | Asserted only |

Failure modes:
- Invented subject can itself be generic; no verification it was used throughout

### frontend-design/two-pass-token-system — `adopt`

**Solves:** Jumping to code causes ad hoc, uncritiqued design decisions.

**Mechanism:** Requires a compact token system before code: 4-6 named hex colors, 2+ typefaces by role, layout concept (prose+ASCII), and one signature element.

**Why it works:** Externalizes the decision into a small reviewable artifact the self-critique step can operate on.

**In SiteSmith:** Reuse the four-part token system as SiteSmith's direction-phase output contract.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:33` | low | 0.75 | confirmed | Asserted only |

Failure modes:
- ASCII wireframes hide real layout problems
- Nothing requires showing the plan to the user before building

### frontend-design/typography-as-personality — `adopt`

**Solves:** Type pairing defaults to the same 'safe' families regardless of project.

**Mechanism:** Requires deliberate display/body pairing specific to the brief and a clear intentional type scale, framed as memorable, not neutral.

**Why it works:** Elevates typography to design-decision status equal to color.

**In SiteSmith:** Require token system to justify the type pairing per subject.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:19` | low | 0.6 | confirmed | Asserted only |

Failure modes:
- No guidance on sourcing non-default pairs; model may still reach for its usual 'safe' fonts

### impeccable/bounded-finish-review-loop — `adopt`

**Solves:** Open-ended self-QA loops burn budget without a stop condition, and a build thread reviewing itself inherits its own blind spots.

**Mechanism:** Finish is capped at two inspection rounds; a fresh, non-forked sub-agent reviews against a fixed 6-check order and must open with a derived disposition (rebuild/fix/ship); material_fixes capped at 8; a rebuild disposition skips the fix batch entirely; a verdict pass after one fix batch scores each fix resolved/partial/unresolved against new screenshots only.

**Why it works:** Structural stop condition (round count + a reviewer with no stake in continuing) rather than a vague 'iterate until good' instruction.

**In SiteSmith:** Adopt the two-round cap + fresh-eyes reviewer + derived disposition pattern directly for SiteSmith's build-verification step.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/reference/new-work.md:107; skill/agents/impeccable-finish-reviewer.md:1-49` | medium | 0.85 | confirmed | No automated calibration test; enforcement is prose ('has no authority to soften it'). |

Failure modes:
- Depends on genuinely fresh sub-agent spawn; weaker fallback otherwise
- Reviewer has no browser, blind to anything screenshots don't show
- Two rounds is a default an attended user can always override

### impeccable/context-aware-no-argument-routing — `adopt`

**Solves:** A static command menu forces users to already know which command they want; auto-picking removes user control.

**Mechanism:** A script gathers cheap real signals (design/code presence, critique score history, git dirty files, dev-server state, a fast detector scan) and the model reasons over them (no formula) to lead with 2-3 recommendations with one-line reasons, always followed by the full menu; never auto-runs.

**Why it works:** Cheap deterministic signal-gathering feeding a model judgment call, preserving user agency by construction.

**In SiteSmith:** Adopt the shape (cheap signals → model-reasoned, non-executing recommendation) for SiteSmith's no-argument entry point.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/reference/routing.md:1-19; skill/scripts/context-signals.mjs` | low | 0.7 | confirmed | None found; a UX judgment call. |

Failure modes:
- Reasoning over ad-hoc signals means runs could reasonably differ in their top pick
- Detector scan explicitly skipped for native platforms

### impeccable/craft-floor-ban-list — `adopt`

**Solves:** LLMs default to a recognizable handful of AI-slop surface habits regardless of brief.

**Mechanism:** A short reference loaded once before UI edits: a Verify checklist of measurable floor properties plus a Refuse list of named category-default patterns framed mostly as overridable defaults, with a couple of true hard bans; includes model-specific addenda blocks.

**Why it works:** Narrow, mechanically-checkable blocklist that removes convergent defaults without dictating a replacement style — cheap and testable.

**In SiteSmith:** Adopt as a short, model-agnostic refuse list loaded right before implementation, paired with (not duplicating) a mechanical detector.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/reference/craft-floor.md:18-48` | low | 0.8 | confirmed | Partly enforced by the mechanical detector encoding overlapping rules; no controlled study of the ban list itself found. |

Failure modes:
- Relies on model judgment for which brief 'earns back' a banned default
- Model-specific addenda suggest a generic list may mis-fire per model

### impeccable/document-after-build-not-before — `adopt`

**Solves:** A design-system doc written before the build describes intentions and can silently canonize a shipped mistake as a rule for future surfaces.

**Mechanism:** DESIGN.md is written only at finish, by a separate fresh sub-agent whose only input is the shipped artifact plus the direction contract; explicitly cross-checks every rule about to be recorded against the craft-floor ban list and logs anything deliberately excluded as a defect, not a rule.

**Why it works:** Ground-truths documentation against the artifact and adds a second line of defense against banned patterns becoming house style.

**In SiteSmith:** Write our own design-system-of-record only after a build ships, from the artifact, cross-checked against our own anti-slop list before writing.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/reference/new-work.md:75; skill/agents/impeccable-documenter.md:1-35` | low | 0.75 | confirmed | Anecdotal (cites a real prior failure); not a formal test. |

Failure modes:
- Only guards against already-known-banned patterns, not novel bad patterns
- Degraded fallback presumably weaker isolation

### impeccable/dual-isolated-critique-subagents — `adapt`

**Solves:** A single context doing both subjective and mechanical review anchors on whichever ran first.

**Mechanism:** Two isolated sub-agents (LLM design review vs detector+browser evidence) run in parallel with no visibility into each other; synthesis afterward; degraded (inline/sequential) runs must print a mandatory first-line banner, never silent.

**Why it works:** Keeps qualitative judgment separate from deterministic evidence and forces disclosure whenever isolation breaks.

**In SiteSmith:** Adopt isolation + mandatory degraded-disclosure for our own critique/audit command, scoped to when the 2x cost is worth it.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/reference/critique.md:5-46` | medium | 0.75 | confirmed | No automated isolation-quality test found; enforcement is entirely prose. |

Failure modes:
- Doubles token/run cost
- Degraded banner is a prose promise, not code-enforced
- Codex carve-out adds an extra permission round-trip

Conflicts: Requires harness sub-agent capability

### impeccable/forced-index-direction-roll — `adapt`

**Solves:** A single model's resonance ranking over its own grounded concept list is deterministic — repo's own measurement: 30/35 identical concepts across 16 prompt framings.

**Mechanism:** Model derives its own grounded candidate directions; a SHA-256 hash of a session key then forces a non-top-ranked index (3..7) into that same list, never substituting a script-authored idea. Re-rolls exclude all prior rounds. Up to 6 external 'challenger' concepts are dealt from a catalog/API and must beat the assigned direction on two named axes to win.

**Why it works:** Attacks argmax convergence at the selection step only, leaving 100% of generation to the model — the exact shape C-no-mechanical-creativity asks for.

**In SiteSmith:** Re-express as a lightweight decision-forcing step: model produces its own ranked shortlist, a simple non-LLM tie-breaker (e.g. hash of session/time) forces a non-top-1 pick, no external catalog/API dependency.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/scripts/concept-seed.mjs:1-73,257-303,350-369` | low | 0.85 | confirmed | Asserted by repo comment (30/35 identical concepts across 16 framings); no linked methodology file found in this checkout. |

Failure modes:
- Richest version depends on a private, unshipped catalog/API
- Still bounded by the quality of the model's own shortlist
- Real workflow overhead, explicitly gated off for small/narrow requests

Conflicts: Hard-gates on PRODUCT.md existing; Forbids presenting a ranked lineup to the user

### impeccable/mechanical-antipattern-detector — `adopt`

**Solves:** Design critique/floor rules are useless without something actually checking shipped code against them.

**Mechanism:** 59-rule deterministic registry of named AI-tell patterns each mapped to a static-HTML/CSS or rendered-page check; invoked as a Bash tool call from critique, audit, routing, and an editor hook, sharing one implementation.

**Why it works:** Pure static analysis, no model call, fully reproducible — cannot itself cause convergence, only flags known-bad patterns.

**In SiteSmith:** Build a small equivalent static linter invoked as a deterministic Bash step, kept separate from and complementary to model-driven critique.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `cli/engine/registry/antipatterns.mjs:1-140; cli/engine/rules/checks.mjs (5580 lines); skill/scripts/detect.mjs:1-21` | medium | 0.8 | confirmed | Exit 0/2 gate used across flows; no accuracy/precision study found in this checkout. |

Failure modes:
- Static-HTML path can't see runtime-computed values without a live server
- Explicitly not proof of quality, only defect evidence
- Frozen snapshot of one aesthetic era

### impeccable/mode-based-visitor-registers — `adopt`

**Solves:** Applying one aesthetic/behavior register to every surface produces surfaces that fight their own purpose.

**Mechanism:** Four named modes (Persuade/Operate/Read/Experience) chosen from the requested surface, not the product category, persisted only in that surface's own brief.

**Why it works:** A model-judgment classification, not a script decision — improves per-surface fit without constraining actual visual choices within a mode.

**In SiteSmith:** Adopt directly as vocabulary for SiteSmith's routing/brief-writing step.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/SKILL.src.md:31-40` | low | 0.8 | confirmed | None found; a taxonomy. |

Failure modes:
- Coarse taxonomy; blended-mode surfaces (e.g. pricing pages) aren't well covered
- No check catches a wrong classification

### impeccable/model-specific-rendition-prior-correction — `adapt`

**Solves:** A specific model has a measured, named default rendering bias for certain subjects that a general 'be original' warning doesn't stop.

**Mechanism:** A model-tagged block names the exact bias in second person, instructs treating that palette as already spent, and to reread the model's own just-written output for named trigger words before coding.

**Why it works:** Specificity plus a self-check step targeted at a documented failure mode is more likely to catch the bias than a generic exhortation.

**In SiteSmith:** Adapt the technique (name a specific convergent output, instruct a targeted reread-and-check) for patterns our own evaluators actually observe, not this exact example.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/reference/new-work.md:67-69` | low | 0.55 | confirmed | Asserted, not demonstrated in this checkout. |

Failure modes:
- Model-specific and will rot as models change
- Only covers one named subject cluster; doesn't scale without ongoing measurement

### impeccable/preserve-vs-redesign-semantics — `adopt`

**Solves:** Ambiguity about refinement vs redesign leads to timid polish of a broken direction or unrequested visual rewrites.

**Mechanism:** Binary distinction: Refinement preserves everything outside scope; Redesign preserves product truth but replaces the old look, treating it as anti-reference. Missing DESIGN.md is explicitly not sufficient evidence of greenfield — the code itself is the evidence.

**Why it works:** Closes a common failure where an LLM treats 'no design doc' as license to invent a new look on an already-branded product.

**In SiteSmith:** Adopt the vocabulary and 'evidence not filename' rule as one of the first questions our routing step answers.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/SKILL.src.md:27-29; skill/reference/new-work.md:5-14` | low | 0.85 | confirmed | None found; a definitional rule. |

Failure modes:
- Judgment call with no mechanical check
- The 'incomplete brand' middle case is harder to get right than the two clean buckets

### impeccable/surface-brief-scoping — `adapt`

**Solves:** Global product/design docs get bloated with one-off route-specific strategy, or that strategy is never written down.

**Mechanism:** A third, narrower per-route 'surface brief' artifact stores only scope/mode/audience/job/constraints/chosen direction, explicitly excluding global product truth or DESIGN.md tokens.

**Why it works:** Cleanly separates three tiers of durable memory by scope, avoiding both context bloat and lost route-specific decisions.

**In SiteSmith:** Adapt the three-tier scoping idea into SiteSmith's own context files, sized to our actual document count.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/reference/new-work.md:77-83` | low | 0.6 | confirmed | None found. |

Failure modes:
- A third document type is one more thing that can drift stale

### sitesmith-current/assignment-blinded-critique-gate — `adapt`

**Solves:** A blind review only described in prose is a blind review that will not happen.

**Mechanism:** Enforces reviewer!=builder, shared brief/rubric/screenshot hashes, opaque labels, >=2 independent reviewers, sha256-locked unedited reviews, key-opened-after-lock ordering, sentence-level generic-tell scan with negation grammar, median/floor scoring with disagreement reported not averaged.

**Why it works:** Targets specific, named prior ceremony failures (self-review, post-hoc editing, early key-open, buried criticism) rather than a generic 'be rigorous' instruction.

**In SiteSmith:** Keep ceremony available as explicit opt-in for portfolio/benchmark claims, not a default single-site step.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/scripts/critique-gate.mjs:1-289; v2/50-critique.md:79-97,141-155` | medium | 0.75 | confirmed | real hash+timestamp+regex verification of an actual artifact trail |

Failure modes:
- Negation-detection regex grammar can miss unanticipated praise phrasing
- Cannot prove two reviewer identities are cognitively independent, only that the mechanics happened

Conflicts: Applying ceremony overhead to every ordinary build would be disproportionate — source itself gates it lab-only

### sitesmith-current/contract-after-direction-plus-token-drift — `adopt`

**Solves:** Not one of nine legacy pages had a spacing/type scale; every value chosen ad hoc at point of use.

**Mechanism:** Contract written after the winning comp is chosen, deriving values from it; required 8 token groups + documented one-off escape hatch; token-drift scans literals against declared tokens/one-offs.

**Why it works:** Ordering fix for the same convergence bug diagnosed in the direction lab; makes 'token or documented exception' a mechanically enforced property.

**In SiteSmith:** Keep contract-after-direction ordering and 8-group token block; extend scanner beyond inline styles.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/30-contract.md:1-252; scripts/token-drift.mjs:1-304` | low | 0.82 | confirmed | real static/DOM analysis against written contract |

Failure modes:
- Only scans inline <style> blocks, blind to separate CSS/CSS-in-JS/Tailwind
- One-off table trusted verbatim, no check it's genuinely rare

### sitesmith-current/cross-project-anti-repeat-ledger — `adopt`

**Solves:** Per-project novelty checks cannot see repetition across projects, which is where house style forms.

**Mechanism:** Append-only cross-project ledger (~/.sitesmith/direction-history.jsonl); checks exact fingerprint match, hard-coded known-bad recipe (fails even on empty ledger), >=4 shared devices with another project, identical macro axes; stores no client URL.

**Why it works:** Only cross-project memory can catch a habit the model doesn't know it has.

**In SiteSmith:** Keep append-only no-URL cross-project fingerprint ledger with fixed known-recipe blocklist seeded from measured patterns.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/scripts/direction-history.mjs:1-294; v2/20-direction-lab.md:195-210` | low | 0.85 | confirmed | real fingerprinting against persisted ledger |

Failure modes:
- Ledger is local to one machine, doesn't travel with repo/team
- Thresholds hand-tuned to one measured episode

### sitesmith-current/design-system-py-legacy-generator — `reject`

**Solves:** Nothing — dead v1 code never called by the current pipeline.

**Mechanism:** Multi-domain BM25 + CSV rule-matcher assembling a full design system procedurally.

**Why it works:** N/A, unreachable.

**In SiteSmith:** Do not carry forward.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/scripts/design_system.py:1-80 (1151 lines); zero references in v2/*.md or PIPELINE.json` | high | 0.8 | confirmed | none |

Failure modes:
- Silent dead code
- Reproduces mechanical-creativity failure at design-system level if invoked

Conflicts: Contradicts v2/30-contract.md's 'derived from the brief, not from this file'

### sitesmith-current/direction-candidate-search — `reject`

**Solves:** Naive top-3 BM25 search returns three near-identical rows.

**Mechanism:** BM25 over fixed style/color/typography CSVs, greedy Jaccard-distance-maximizing pick of 3 rows, anti-repeat history exclusion.

**Why it works:** Good as pure search diversity technique.

**In SiteSmith:** Do not port; let the model generate three directions from EVIDENCE.md reasoning, optional CSV lookup as background reference only.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/scripts/candidates.py:1-322; core.py:107-166; search.py:107-126; v2/20-direction-lab.md:42-48` | medium | 0.9 | confirmed | asserted only |

Failure modes:
- Directions pulled toward a fixed 2024 vocabulary
- detect_domain silently defaults to 'style' on no match
- distance-from-chosen is a proxy for structural difference, not a measure of it

Conflicts: Contradicts v2/05-evidence.md's 'nothing here decides a colour'; Textbook C-no-mechanical-creativity violation

### sitesmith-current/direction-fidelity-render-check — `adopt`

**Solves:** A declared direction can be real on paper and absent on screen (dark-mode-only direction rendering light by default).

**Mechanism:** Renders in default colour scheme, measures luminance/font/asset-share/bands/device-counts/signature-share, checks against classified expectations from DIRECTION.md.

**Why it works:** Measures what a reviewer actually sees, not what the CSS source intends.

**In SiteSmith:** Keep as canonical shipped-vs-declared check, default colour scheme, no exceptions.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/scripts/direction-fidelity.mjs:1-452` | medium | 0.88 | confirmed | real DOM measurement against written contract |

Failure modes:
- Classifier regexes recognise only a fixed vocabulary of axis phrasing
- Malformed DIRECTION.md format fails the whole check before any visual judgement

### sitesmith-current/evidence-before-direction — `adopt`

**Solves:** A brief alone can only look like its category; a page designed from it alone converges with peers.

**Mechanism:** Seven-section research artifact (artefacts, vocabulary, materials, true colour, constraints, references/anti-references, asset reality), strict sourcing preference, (inferred)/(needed) markers.

**Why it works:** Grounds the model in real subject-specifics before any visual decision — improves model reasoning, not mechanical.

**In SiteSmith:** Keep as required pre-direction research pass with same seven sections.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/05-evidence.md:1-127` | low | 0.85 | confirmed | asserted only |

Failure modes:
- No mechanical check that EVIDENCE.md content influenced DIRECTION.md
- 'stated as unknown' has no forcing function against skipping research

### sitesmith-current/interaction-journeys — `adopt`

**Solves:** Nine legacy pages had zero <script> tags; every interactive state was drawn but never reachable.

**Mechanism:** Playwright journeys asserting: something observably changed, change is announced (role=status/alert/focus), a failure path is handled and field-attached, keyboard-only path works with visible focus.

**Why it works:** A much higher bar than 'click didn't throw', catches exactly the styled-but-unwired defect class.

**In SiteSmith:** Keep four-part assertion contract as the definition of a valid journey; keep empty-journeys-fails-production-gate rule.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/40-interaction.md:1-156; scripts/journey.mjs:1-51` | medium | 0.8 | confirmed | real browser automation against live page |

Failure modes:
- Journey quality depends entirely on hand-authoring; no generator or coverage check
- Fixed 120s timeout with no per-journey override

### sitesmith-current/mode-based-routing-not-defaults — `adopt`

**Solves:** v1 issued global rules and then contradicted itself when context demanded otherwise.

**Mechanism:** Two ordered routing questions: mode (3 rows, decided per page not per project) then task (5 rows); mode files state outcomes deliberately, not defaults.

**Why it works:** Separates 'what kind of page' from 'what task', removing the contradiction pattern; refusing defaults removes what an agent reaches for under pressure.

**In SiteSmith:** Keep per-page mode routing as first decision; keep mode files as outcomes not defaults.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/SKILL.md:28-46; v2/README.md:79-83` | low | 0.7 | unchallenged | asserted only |

Failure modes:
- No tie-break mechanism for a genuinely ambiguous page (part-marketing, part-configurator)

### sitesmith-current/portfolio-diversity-gate — `adopt`

**Solves:** Individual-page gates can all pass while a set of sites still reads as one studio's work.

**Mechanism:** Measures a set of rendered URLs: ground-luminance clustering within a band, shared-device-across-set counts (>2 of 3 flagged), imagery-load-bearing-anywhere threshold, layout-signature collisions, display-face diversity.

**Why it works:** Measures a set-level property no single-site gate can see by construction; directly targets C-no-house-style.

**In SiteSmith:** Keep as mandatory pre-showcase/portfolio gate, not a per-site step.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/scripts/portfolio-diversity.mjs:1-251; v2/50-critique.md:141-155` | medium | 0.85 | unchallenged | real cross-site DOM measurement and comparison |

Failure modes:
- Thresholds hand-tuned to one measured episode; a differently-shaped convergence (e.g. shared motion/copy cadence) is invisible
- Only runs when explicitly invoked, not part of ordinary single-site pipeline

### sitesmith-current/production-gate-honesty-checks — `adopt`

**Solves:** A page can pass every a11y/layout check and still ship placeholder imagery or an empty logo box.

**Mechanism:** Regex scan for placeholder language/dummy identifiers, empty brand-mark detection, manifest cross-reference for every image/svg (state=ready required), traceable commerce-claim checking in mode E against EVIDENCE.md, borrowed-logo evidencing, journey-existence check.

**Why it works:** Operationalizes honesty checks invisible to accessibility/layout tooling via text/DOM pattern matching plus manifest cross-reference.

**In SiteSmith:** Keep as distinct finished/honest gate separate from a11y/layout gate; keep draft vs production modes.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/scripts/production-gate.mjs:1-519` | medium | 0.85 | confirmed | real regex/DOM scan against manifest and evidence file |

Failure modes:
- Static scan misses client-script-rendered content unless a URL is passed
- Closed hand-maintained placeholder regex list
- Commerce-claim tracing uses fragile substring matching

### sitesmith-current/progressive-disclosure-manifest — `adopt`

**Solves:** Pulling the whole rule corpus + 1.4MB of CSV data into context on every task burns budget and dilutes attention.

**Mechanism:** A machine-readable step->reads manifest; only SKILL.md + v2/10-core.md + one mode file are alwaysLoaded.

**Why it works:** Converts a discipline into a router property instead of a thing the model must remember.

**In SiteSmith:** Router + one universal rule file + one mode file always loaded; explicit reads-manifest per phase.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/PIPELINE.json:14-16,24-28; SKILL.md:18-20,129-148` | low | 0.85 | confirmed | asserted only |

Failure modes:
- Nothing verifies an agent actually limited reads to the manifest
- Ad-hoc tasks fall back to informal routing

### sitesmith-current/structurally-different-direction-gate — `adopt`

**Solves:** Three comps sharing layout but differing in hue is one direction rendered three times; round-8 sites passed a 5-axis check and still shared one recipe.

**Mechanism:** Fixed parseable record (5 macro axes + 4 visual-grammar fields + 3 dials); mechanical pairwise-difference check on declared axes AND rendered DOM measurement, with hard-coded known-bad-recipe detection.

**Why it works:** Measurement over declaration closes the gap between claimed and rendered difference.

**In SiteSmith:** Keep declared-record + rendered-measurement double check and hard-coded known-recipe blocklist.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/20-direction-lab.md:55-134,246-293; scripts/direction-check.mjs:1-266` | medium | 0.9 | confirmed | real render + DOM measurement |

Failure modes:
- Fixed taxonomy of recognised axis/grammar values; unrecognised phrasing becomes a skipped 'note'
- Requires playwright, degrades to declared-only

### sitesmith-current/two-gate-separation-technical-vs-visual — `adopt`

**Solves:** Merging 'works' and 'good' is how PASS came to be read as 'this is good'.

**Mechanism:** Technical gate must be green before visual critique runs; 7-criterion rubric scored on screenshots only; mandatory primary-criticism sentence answered before scores seen; generic-template answer fails regardless of scores; specificity capped at 3 if rebadgeable.

**Why it works:** Separates floor from ceiling; primary-criticism test targets genericness directly rather than averaging it away.

**In SiteSmith:** Keep hard order (technical green first) and primary-criticism generic-tell test with score-override rule.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/50-critique.md:1-155; v2/README.md:75-77` | low | 0.83 | confirmed | asserted for ordinary builds; enforced mechanically only in lab variant |

Failure modes:
- Ordinary-build reviewer is the same agent that built the page — no independence guarantee
- Specificity cap has no mechanical proxy in ordinary path

### sitesmith-current/verify-fail-closed-gates — `adopt`

**Solves:** A gate that silently 'did not run' and still prints PASS is worse than no gate; layouts fitting only under the developer's own font shipped broken elsewhere invisibly.

**Mechanism:** Screenshots at 3 widths with axe-core in both colour schemes; missing axe scan is a blocking failure unless --no-axe is explicitly passed; reads raw HTML source (not live DOM) for structural defects since the DOM auto-repairs a missing root element; --font-stress mode swaps a deliberately wide font before measuring overflow.

**Why it works:** Every check targets a real, previously-shipped, previously-invisible defect class named in the code's own comments.

**In SiteSmith:** Keep dual-scheme axe scanning, fail-closed-on-missing-scan, raw-source structural checks, font-stress mode, and the preview-vs-release distinction.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/scripts/verify.mjs:1-313` | medium | 0.87 | unchallenged | real browser automation, real axe-core engine, real HTTP checks |

Failure modes:
- Requires target project to have playwright installed; fresh projects can't run it at all yet
- --no-axe preview mode depends on the agent re-running the full check before claiming done

### taste-skill/bias-correction-bans-with-override-paths — `adapt`

**Solves:** Blocklisting known LLM-default tells without permanently outlawing them for briefs that genuinely want them.

**Mechanism:** Every ban stated as 'discouraged/banned as DEFAULT' with an explicit 'Override:' clause naming exactly when it's acceptable again.

**Why it works:** A ban with a stated override is falsifiable/revisitable; bare bans get ignored (per file's own claim) or, if absolute (em-dash), become machine-checkable.

**In SiteSmith:** Split into (1) short list of absolute, script-checkable bans and (2) a short list of judgment principles with one example each, not a recited blocklist.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/taste-skill/SKILL.md:161-349,595-701` | high | 0.75 | confirmed | em-dash ban states a mechanical test (grep); nothing else does |

Failure modes:
- banning specific named clichés only holds until the next wave emerges — whack-a-mole, needs re-curation
- only the absolute em-dash ban is reliably enforceable; everything else depends on correct model judgment of its own override condition

Conflicts: 70+ enumerated bans risk becoming the mechanical rules-execution the file's own thesis argues against

### taste-skill/brief-inference-design-read — `adopt`

**Solves:** Models jump straight to a default aesthetic instead of reasoning about who the site is for and what it should feel like.

**Mechanism:** Before any code, read five signal types (page kind, vibe words, references, audience, quiet constraints); emit one committed sentence: 'Reading this as: <page kind> for <audience>, with a <vibe> language, leaning toward <system/aesthetic family>.' Ask at most ONE clarifying question only if the read genuinely diverges; otherwise commit and proceed.

**Why it works:** Forces externalized evidence-based judgment before generation — matches the 'reasoning natively from evidence' behavior scored 59 vs 40 for template generation in the C-no-mechanical-creativity brief.

**In SiteSmith:** Keep as mandatory first move: one committed, evidence-cited sentence before any file is written. Do not turn it into a dropdown form — the value is forced prose reasoning.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/taste-skill/SKILL.md:13-39` | low | 0.9 | confirmed | asserted only — checklist line 916 asks 'declared?' not quality |

Failure modes:
- a bad design read propagates silently with nothing downstream to catch it
- no mechanism forces revisiting the read if later sections contradict it

### taste-skill/brief-to-design-system-router — `adopt`

**Solves:** LLMs hand-roll bad imitation CSS for Fluent/Material/Carbon/GOV.UK instead of using real packages, or treat pure aesthetics as having an official source.

**Mechanism:** Two-bucket router: named enterprise/gov system → install official package, never mix two systems; pure aesthetic (bento, brutalism, glassmorphism) → native CSS, label honestly, including explicit note that Apple Liquid Glass has no public web package.

**Why it works:** Grounding mechanism preventing a specific hallucination class (invented framework, false official-status claims) via a checkable fact table.

**In SiteSmith:** Port the two-bucket logic and honesty rule as-is; re-verify install commands/doc links at rebuild time rather than copying verbatim.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/taste-skill/SKILL.md:82-119,987-1109` | medium | 0.85 | confirmed | none in-repo, trivially checkable against real registries |

Failure modes:
- vendored package names/APIs go stale since this is static text, not a live doc fetch

### taste-skill/combinatorial-variation-picklists — `reject`

**Solves:** Same repetitive-output problem as gpt-fake-rng, applied to the image-generation-first workflow.

**Mechanism:** 'Choose 1' from each of 5 enumerated category lists (theme, background, typography, hero architecture, section system) plus 'choose exactly 4' components and 'choose exactly 2' motion cues, then commit consistently.

**Why it works:** Unlike gpt-fake-rng, honestly presented as a menu, not a fake dice roll; genuinely helps within-project consistency.

**In SiteSmith:** Do not port the fixed menus. Keep only the one-sentence instruction: pick a coherent direction and commit to it across every section.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/image-to-code-skill/SKILL.md:415-488` | medium | 0.7 | unchallenged | none |

Failure modes:
- substitutes a brief-agnostic menu selection for reasoning grounded in the specific brief — two unrelated 'premium tech startup' briefs draw from identical menus
- no mechanism ties the choice back to why THIS brief calls for one option over another

Conflicts: partially conflicts with C-no-mechanical-creativity — better than fake RNG but still menu selection, not evidence-grounded reasoning

### taste-skill/em-dash-absolute-ban — `adopt`

**Solves:** The most-violated stylistic tell kept recurring under softer 'use sparingly' phrasing.

**Mechanism:** Zero em-dashes anywhere, no override, phrased fully binary — a single instance anywhere visible fails the pre-flight check.

**Why it works:** The only rule phrased as fully binary and mechanically testable via a single regex scan.

**In SiteSmith:** Copy verbatim as a style fact; wire into SiteSmith's verify.mjs as a real automated check instead of leaving it to self-report.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/taste-skill/SKILL.md:685-701,920` | low | 0.95 | confirmed | regex over rendered output; automatable, not automated here |

Failure modes:
- none as written — cleanest mechanism in the repo

### taste-skill/fixed-aesthetic-template-skills — `reject`

**Solves:** Gives a user who already chose a direction a ready-made fully-specified rule set instead of an open brief.

**Mechanism:** Each hardcodes a complete design system directly in the prompt: exact hex codes, exact radii, exact font-stack priority, numbered component construction methods (e.g. minimalist-skill's #FFFFFF/#F7F6F3/#EAEAEA and four pastel accents; gpt-tasteskill's mandatory #f9fafb background with no override).

**Why it works:** For a one-off build where the user explicitly wants exactly this look, a fully-specified template produces a coherent result quickly.

**In SiteSmith:** Do not port as skills or presets. Fold descriptive vocabulary (what 'brutalist' connotes) into a reference-vocabulary glossary and let the design-read reasoning pick fresh specifics every time.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/soft-skill/SKILL.md:1-98; skills/minimalist-skill/SKILL.md:1-85; skills/brutalist-skill/SKILL.md:1-93; skills/gpt-tasteskill/SKILL.md:1-75` | low | 0.85 | refuted | none |

Failure modes:
- this IS the C-no-house-style failure mode in its purest form — three independently-briefed sites using the same skill would necessarily share the same tokens
- gpt-tasteskill's mandatory hex has no override path at all, unlike the flagship's ban+override pattern

Conflicts: directly conflicts with C-no-house-style

### taste-skill/full-output-enforcement — `adopt`

**Solves:** Models truncate long code output with placeholder comments or premature stop.

**Mechanism:** Banned-pattern list for code and prose, a three-step scope/build/cross-check process, and a defined pause/resume protocol for token-limited responses.

**Why it works:** Orthogonal general-purpose prompt engineering against a known laziness failure mode, backed (per this repo's own uncited essay) by asserted effects.

**In SiteSmith:** Fold the banned-pattern list and scope-lock process into general execution discipline if truncation is an observed problem; skip pause/resume unless the harness supports it.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/output-skill/SKILL.md:1-49` | low | 0.7 | unchallenged | none |

Failure modes:
- pause/resume protocol assumes the host harness sends back a literal keyword and resumes state correctly — not guaranteed

### taste-skill/gpt-fake-rng — `reject`

**Solves:** Attempts to break the LLM default-to-first-option failure across repeated calls.

**Mechanism:** Instructs the model to 'simulate a Python script execution,' narrate a mock RNG output derived from prompt-character-count modulo arithmetic, and treat that fabrication as a deterministic selector across four small enumerated menus.

**Why it works:** It doesn't work as claimed — no code actually executes; the model hallucinates a plausible-looking output and trusts its own fabrication. Does not decorrelate outputs across separate conversations and adds token cost for zero real signal.

**In SiteSmith:** Do not port. Real variance should come from the design read citing brief-specific evidence, not fabricated dice rolls.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/gpt-tasteskill/SKILL.md:13-20,67-74` | low | 0.9 | confirmed | none — and none possible since the Python execution never runs |

Failure modes:
- textbook example of moving a creative decision into a fake script rather than making the model think — exactly the losing side (40 vs 59) of C-no-mechanical-creativity
- adds token cost and false rigor with no output-quality gain
- menus are small enough that even genuine randomization would converge quickly

Conflicts: directly conflicts with C-no-mechanical-creativity

### taste-skill/gsap-canonical-code-skeletons — `adapt`

**Solves:** Scroll-pin/hijack GSAP patterns are easy to get subtly wrong (trigger fires mid-scroll instead of pinning at top).

**Mechanism:** Two complete working React components (StickyStack, HorizontalPan) with exact ScrollTrigger config called out as 'critical points,' plus a lighter Motion-only whileInView alternative for simple reveals.

**Why it works:** Real, specific engineering knowledge delivered as working code for a well-known failure mode, loaded conditionally.

**In SiteSmith:** Re-express in SiteSmith's chosen animation stack; keep the 'critical points' callout pattern since that's the load-bearing content.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/taste-skill/SKILL.md:365-473` | low | 0.8 | confirmed | none in-repo; visually verifiable by checking pin offset |

Failure modes:
- tied to GSAP+Motion specifically; needs re-authoring if stack differs

### taste-skill/image-first-generation-discipline — `adapt`

**Solves:** Coded output visually drifts from a strong generated reference image.

**Mechanism:** Mandatory ordering (generate reference → deeply analyze text/type/spacing/color/components → implement to match); hard rule against cropping sections from a larger composite (regenerate fresh instead); explicit 'Anti-Drift' rule naming concrete drift symptoms to check against.

**Why it works:** Targets a real, specific, named failure mode with a concrete countermeasure rather than a vague 'make it look nice.'

**In SiteSmith:** Port the ordering discipline and named anti-drift symptom list as a lightweight principle; skip the Codex-specific image-count escalation rules.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/image-to-code-skill/SKILL.md:112-230,860-895` | high | 0.65 | unchallenged | 21-item self-administered 'Clarity Check' — same weakness as the flagship checklist |

Failure modes:
- depends entirely on image-gen tool availability/quality with no defined fallback
- 'deeply analyze' step is still self-report with no independent check

### taste-skill/official-design-system-honesty-rule — `adopt`

**Solves:** Models claim hand-rolled CSS is an official platform technology (e.g. calling glassmorphism 'Apple Liquid Glass').

**Mechanism:** Install official packages when a real system is matched, never recreate 90% by hand; when no official source exists (Liquid Glass named specifically), label any implementation as an approximation in code comments.

**Why it works:** Factual/labeling discipline costing nothing to the design read, preventing user-facing misrepresentation.

**In SiteSmith:** State the general principle once rather than copying the specific CSS skeleton verbatim.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/taste-skill/SKILL.md:102-104,1113-1138` | low | 0.8 | confirmed | none |

Failure modes:
- none identified

### taste-skill/redesign-mode-detection-and-audit-first — `adopt`

**Solves:** Redesigns treated identically to greenfield builds, silently destroying SEO/brand/IA.

**Mechanism:** First action is mode classification (Greenfield/Preserve/Overhaul), ask once if ambiguous; Preserve/Overhaul require a documented audit before any change, plus a fixed 'never change silently' list.

**Why it works:** Process/ordering mechanism preventing destructive mistakes independent of aesthetic choice.

**In SiteSmith:** Port the three-mode classification and audit-before-fix ordering directly; make the 'never change silently' list a literal pre-merge diff check where feasible.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/taste-skill/SKILL.md:783-833` | medium | 0.85 | confirmed | none automated; could diff the 'never change silently' list against the actual diff |

Failure modes:
- audit is a self-produced artifact; nothing forces a second pass to confirm it was acted on

### taste-skill/self-administered-preflight-checklist — `adapt`

**Solves:** Prevents shipping known defects (bad contrast, wrapped CTAs, duplicate CTA intent, mixed radii).

**Mechanism:** ~70-item Yes/No checklist the generating model runs against its own output right before delivery.

**Why it works:** Checklists catch mechanically-describable defects when the model actually re-reads its output against them.

**In SiteSmith:** Split: automate the mechanically-countable items in verify.mjs; keep judgment items as prompts for a genuinely separate critic pass, not a self-administered box.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/taste-skill/SKILL.md:910-979` | high | 0.8 | confirmed | self-report only, no external verification anywhere in repo |

Failure modes:
- single-pass same-model self-grading is the weakest verification form
- no external critic, no defined stop condition beyond 'honestly ticked'
- mechanical count-based items are strongest; aesthetic-judgment items are weakest (rubber-stamping risk)

### taste-skill/single-clarifying-question-cap — `adopt`

**Solves:** Agents either guess wrong silently or dump multi-question interrogations before doing work.

**Mechanism:** Ask exactly one question, only when the design read genuinely diverges; otherwise infer confidently and proceed.

**Why it works:** Bounds the interrogation failure mode without removing the ability to ask when it matters.

**In SiteSmith:** State plainly: one question max, only when two plausible reads would produce materially different builds.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/taste-skill/SKILL.md:33-36` | low | 0.75 | confirmed | none |

Failure modes:
- no criterion given for 'genuinely diverges' beyond model judgment — unfalsifiable

### taste-skill/three-dial-system — `adapt`

**Solves:** Gives shared vocabulary for how experimental/animated/dense a design should be instead of vague words.

**Mechanism:** Three named 1-10 scales (VARIANCE/MOTION/DENSITY) with baseline 8/6/4 and two lookup tables assigning numeric ranges from vibe words or use-case presets.

**Why it works:** Useful as shared vocabulary; as a decision mechanism it's a table lookup, not reasoning — the liability side of C-no-mechanical-creativity when it substitutes for judgment.

**In SiteSmith:** Keep the three named concepts as reasoning vocabulary in prose; drop the numeric 1-10 scale and lookup tables entirely.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/taste-skill/SKILL.md:43-79,552-569` | low | 0.8 | confirmed | none — checklist only asks if reasoned, cannot verify |

Failure modes:
- stateless lookup tables produce identical numbers for the same vibe words across unrelated projects — a structural driver of C-no-house-style convergence
- numeric dials give false precision for a qualitative judgment

Conflicts: C-no-house-style: deterministic vibe-word→number tables are a rules engine, not a design read

### taste-skill/uncited-laziness-research-essay — `reject`

**Solves:** Attempts to justify output-skill's claims with cited research.

**Mechanism:** Names five studies by short label (EmotionPrompt, LazyBench, Compounding Error Avoidance, Seasonal Behavior Analysis, '2025 Controlled Laziness Experiments') with no links, no locatable authors, no DOIs.

**Why it works:** Doesn't establish anything verifiable — most citations are not independently locatable, and specific numbers (+45%, +115%, 34%→80%) cannot be traced from the repo.

**In SiteSmith:** Do not port citations or percentage claims; state any anti-truncation rationale as observed practical behavior without inventing statistics.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `research/laziness/findings/empirical-results.md:1-58; research/laziness/findings/references.md:1-20` | low | 0.8 | unchallenged | none — no links, unverifiable from the repo alone |

Failure modes:
- asserted-not-verifiable research re-published as if verified
- precise percentage claims manufacture false confidence

### ui-ux-pro-max/bm25-csv-retrieval — `adapt`

**Solves:** Fetching relevant reference rows from a flat CSV corpus by free-text query without an embeddings service or network call.

**Mechanism:** Stdlib-only BM25 over per-domain CSV files, tokenized with a stopword list and synonym dict, with mtime-based caching.

**Why it works:** Pure retrieval, not decision-making; cheap, deterministic, testable in isolation.

**In SiteSmith:** Reuse only for pulling stimulus material the model reasons over (UX rules, stack idioms), never for auto-selecting a creative decision.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `.claude/skills/ui-ux-pro-max/scripts/core.py:161-289` | low | 0.85 | confirmed | unittest tokenizer + known-query-to-domain sanity checks (structural, not accuracy-graded) |

Failure modes:
- BM25 is overkill machinery for ~100-row CSVs
- silent domain misrouting if --domain omitted and keywords overlap

### ui-ux-pro-max/design-dials — `adapt`

**Solves:** Letting a caller nudge the deterministic generator toward more/less bold, motion, or density.

**Mechanism:** Three optional 1-10 flags bucketed into low/mid/high tiers biasing the style query, pulling a motion.csv row, or swapping the spacing-scale dict.

**Why it works:** Cheap, explainable, degrades gracefully when unset.

**In SiteSmith:** Repurpose the shape (named sliders mapping to prose tiers) as vocabulary handed to the model to reason with, not as auto-selector inputs.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `.claude/skills/ui-ux-pro-max/scripts/design_system.py:46-77,230-262` | low | 0.6 | confirmed | none beyond generate() smoke tests |

Failure modes:
- still a script making the final pick
- only 3-5 bias keywords per tier against an 84-row style CSV

Conflicts: C-no-mechanical-creativity

### ui-ux-pro-max/design-review-subagent-and-heuristic-audit — `adopt`

**Solves:** Actually verifying built UI instead of asserting it's done.

**Mechanism:** A 233-line Playwright heuristic script (6 viewports, real focus/contrast/overflow/tap-target measurement) plus a 7-phase model-driven review subagent forbidden from inventing findings, reporting ranked Blockers/High/Medium/Nitpicks plus what's working.

**Why it works:** The one mechanism in the repo that is genuinely evidence-based rather than asserted or templated — observes real DOM/CSSOM state.

**In SiteSmith:** Fold tap-target, real-focus-visibility, and accessible-name checks into SiteSmith's own verify.mjs; consider a documented model-driven review pass.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `stack/.claude/agents/design-review.md (97 lines); stack/scripts/design-audit.mjs (233 lines)` | medium | 0.85 | confirmed | is itself the test method for the rest of the repo; one worked example (juniper-audit) as proof |

Failure modes:
- single-pass single-reviewer, may share blind spots with the building model
- contrast check explicitly approximate
- no code enforces the fix-then-reverify loop, it's a documented habit

### ui-ux-pro-max/design-system-generator — `reject`

**Solves:** Producing one coherent design-system recommendation from a single query in one command.

**Mechanism:** BM25-match a product category, look it up verbatim in ui-reasoning.csv for a pre-written style/color/typography tuple, bias further searches toward those keywords, auto-pick the top row per domain, render to ASCII/Markdown/JSON. No LLM call anywhere in the path.

**Why it works:** Fast and complete-looking, which is exactly the danger: this is the deterministic template-generator shape the brief's benchmark scored 40 against an LLM's 59.

**In SiteSmith:** Do not port the auto-selecting generator; surface top-3 candidates per dimension as options-with-rationale for the model to choose and justify.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `.claude/skills/ui-ux-pro-max/scripts/design_system.py:81-329` | medium | 0.9 | confirmed | unittest checks non-empty output and persistence branches; nothing tests output diversity/quality |

Failure modes:
- every project mapped to the same product category gets the identical style/color/type tuple
- project's own WORKFLOW.md admits this and tells users to run a separate taste skill to reject its defaults
- Decision_Rules JSON looks conditional but is never branched on

Conflicts: C-no-mechanical-creativity; C-no-house-style

### ui-ux-pro-max/domain-auto-detect — `adapt`

**Solves:** Routing a free-text query to the right CSV when --domain is omitted.

**Mechanism:** Hand-authored keyword-list-per-domain dict scored by regex word-boundary match, multi-word phrases weighted higher, ties broken by fixed priority order, falls back to 'style' if nothing scores.

**Why it works:** Deterministic and debuggable; product-domain keywords self-update from products.csv so they can't drift from the data.

**In SiteSmith:** Worth keeping if we retain a multi-file reference corpus; surface the runner-up domain as this repo does.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `.claude/skills/ui-ux-pro-max/scripts/core.py:344-408` | low | 0.7 | confirmed | unittest sanity checks only, no adversarial query suite |

Failure modes:
- documented overlap ('font' hits typography and google-fonts)
- silent style-domain fallback on zero score, unlike the zero-result path which self-reports

### ui-ux-pro-max/master-overrides-persistence — `adopt`

**Solves:** Keeping one canonical design doc plus per-page overrides without a re-run silently clobbering prior decisions.

**Mechanism:** Skip-write-unless-force when MASTER.md exists, structured skipped_exists status, whitelist slugifier preventing path traversal via project/page names.

**Why it works:** Defensive engineering independent of the creativity debate; idempotent by default.

**In SiteSmith:** Reuse verbatim shape for any persisted SiteSmith artifact.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `.claude/skills/ui-ux-pro-max/scripts/design_system.py:709-789` | low | 0.85 | confirmed | unittest covers skip/force/fresh-write branches directly |

Failure modes:
- override-precedence logic is plain-English instruction only, not enforced programmatically

### ui-ux-pro-max/multi-copy-sync-architecture — `reject`

**Solves:** Shipping identical data/scripts to three consumption paths from one source of truth.

**Mechanism:** Physically-synced copies (no symlinks, they break on git-for-Windows) plus a CI drift-check.

**Why it works:** Solves a real distribution problem this project has that SiteSmith doesn't.

**In SiteSmith:** Not applicable; note only as an anti-pattern to avoid building prematurely.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `CLAUDE.md:41-101; cli/scripts/sync-assets.mjs; .github/workflows/check-asset-sync.yml` | low | 0.8 | confirmed | CI diff-check between source and mirrors |

Failure modes:
- real maintenance surface for a distribution problem SiteSmith does not have

Conflicts: adds complexity without value for our form factor

### ui-ux-pro-max/stack-never-assume — `adopt`

**Solves:** Preventing every downstream recommendation from silently targeting the wrong framework.

**Mechanism:** One instruction: detect stack from project files; ask or default only if undetectable; names the failure mode explicitly.

**Why it works:** Cheap, names the exact failure it prevents rather than just asserting a rule.

**In SiteSmith:** Keep the phrasing style for our own stack-detection instruction.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `.claude/skills/ui-ux-pro-max/SKILL.md:55` | low | 0.75 | confirmed | none, prose only |

Failure modes:
- purely instructional, nothing enforces the detection step actually happened

### ui-ux-pro-max/static-ux-knowledge-tables — `adopt`

**Solves:** Giving the model concrete UX/accessibility/performance facts to reason against.

**Mechanism:** Two static markdown files, loaded only on demand, terse rule-id + standard + rationale organized by priority category.

**Why it works:** Knowledge injection, not decision automation — squarely the 'makes the model think better' side of the axis.

**In SiteSmith:** Re-express as SiteSmith's own on-demand accessibility/interaction reference, gated the same way.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `references/quick-reference.md (240 lines); references/pro-rules.md (109 lines)` | medium | 0.85 | confirmed | none, reference prose |

Failure modes:
- dated platform citations without version numbers
- correctness rules only, cannot fix genericness alone

### ui-ux-pro-max/ui-reasoning-category-table — `reject`

**Solves:** Giving ~30 product categories a starting style/color/typography/effects bundle.

**Mechanism:** 30-row CSV: category -> pattern, style priority, color mood, typography mood, effects, decision-rules JSON, anti-patterns, severity; resolved by near-exact then substring then keyword match.

**Why it works:** As a checklist of questions it would help; as implemented it's a fixed lookup with no branching actually exercised.

**In SiteSmith:** Re-express as prose heuristics the model reads and questions, not a keyed table a script resolves.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `.claude/skills/ui-ux-pro-max/data/ui-reasoning.csv:1-2` | low | 0.85 | refuted | schema-only validation (validate_data.py), never checked for branching correctness |

Failure modes:
- one category = one style pairing = structural sameness
- Decision_Rules JSON parsed but never read to branch output

Conflicts: C-no-house-style

### ui-ux-pro-max/zero-result-honesty — `adopt`

**Solves:** Stopping the model from presenting a failed search as a real recommendation.

**Mechanism:** Explicit no-match sentence plus vocabulary-nearness suggestions for retry, mirrored as a 3-step protocol in SKILL.md.

**Why it works:** Makes the model behave more honestly rather than mechanically; costs nothing.

**In SiteSmith:** Adopt the instruction pattern verbatim for any retrieval step SiteSmith keeps.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `.claude/skills/ui-ux-pro-max/scripts/search.py:64-74; core.py:292-316` | low | 0.8 | confirmed | not unit-tested directly |

Failure modes:
- prefix/suffix suggestion matching can surface lexically close but semantically unrelated terms

