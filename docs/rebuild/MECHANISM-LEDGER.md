---
title: Mechanism ledger
state: S3_MECHANISM_GRAPH
status: generated
generator: tools/build-mechanism-ledger.mjs
ai_generated: "(C)"
---

# Mechanism ledger

Generated. Do not hand-edit.

243 mechanisms from 19 sources. Red team: 85 confirmed, 14 refuted, 144 unchallenged. Decisions after refutation is applied: 128 adopt, 62 adapt, 13 investigate, 40 reject.

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


### ai-website-cloner-template/appearance-and-behavior-taxonomy

Claimed: Requires appearance (getComputedStyle) AND behavior (trigger, before/after, transition) for every element, backed by a 13-category illustrative behavior list.

**Refuted:** The appearance/behavior requirement itself is real (line 65: 'For every element, extract its appearance (exact computed CSS via getComputedStyle()) AND its behavior...'). But the claimed '13-category' list is a miscount: the illustrative bullet list at lines 68-79 was counted by hand and contains exactly 12 items, not 13. Per the numeric-verification rule, a wrong count refutes the claim as stated.

Checked at: `.claude/skills/clone-website/SKILL.md:68-79`

Decision was `adopt`, now `investigate`.

### ai-website-cloner-template/computed-style-extraction-script

Claimed: Reusable JS snippet: depth-4 DOM walk, getComputedStyle against ~40 named properties per element, filters out default/no-op values.

**Refuted:** The script, the depth-4 recursion guard ('if (depth > 4) return null' at line 269), and the default-value filtering (line 265: filters out 'none'/'normal'/'auto'/'0px'/'rgba(0, 0, 0, 0)') are all real and confirmed. However the claimed property count is wrong: I counted the literal strings in the props array (lines 248-260) and got 61 named properties, not '~40' as claimed - a 50%+ overstatement of the actual count, which fails the numeric-verification check.

Checked at: `.claude/skills/clone-website/SKILL.md:247-261`

Decision was `adopt`, now `investigate`.

### scroll-world/mobile-scrub-hardening-bundle

Claimed: Four bundled fixes behind one isMobile() check: seek-coalescing (skip re-queuing currentTime while still seeking), iOS priming (muted play/pause on first touch, wait for 'seeked' not just 'loadedmetadata'), resize-gating (ignore height-only resize on touch), coarser mobile seek epsilon.

**Refuted:** 3 of 4 sub-parts check out inside the cited ranges: seek-coalescing at line 281 (if s.video.seeking continue), resize-gating at 317-320, coarser epsilon at line 274 — all within 273-323. But the 'wait for seeked not just loadedmetadata' detail actually lives in loadClip() at line 216, outside the cited 66-73,273-323 ranges entirely. The additional CSS citation (413-435) is generic mobile layout media queries (nav hiding, copy anchoring, route dot hit-area) and contains none of the four described JS fixes — it doesn't support the claim at all. The claim merges code from an uncited location and an unrelated CSS block into one citation.

Checked at: `skills/scroll-world/references/scrub-engine.js:66-73,216,273-323; CSS 413-435 (does not contain the described fixes)`

Decision was `adopt`, now `investigate`.

### scroll-world/progressive-disclosure-file-split

Claimed: SKILL.md is the only always-loaded file; it names each reference file by relative path at the exact step it's needed, none pre-loaded speculatively.

**Refuted:** The cited lines 752-762 are just the final '## References' summary list at the end of SKILL.md — a bare enumeration of the reference files with one-line descriptions, not evidence of just-in-time referencing throughout the steps. The claim's own whyItWorks concedes this 'matches the general skill-authoring principle' — i.e. this is standard Claude-skill structure (SKILL.md as sole entry point, references loaded on demand), not a distinctive mechanism of scroll-world. Treated as a platitude dressed up as a mechanism; the citation doesn't show what's actually being claimed (loading discipline at each step) — that would require citing the scattered inline 'See references/X' pointers throughout Steps 1-8, not the closing list.

Checked at: `skills/scroll-world/SKILL.md:752-762`

Decision was `adapt`, now `investigate`.

### ai-dev-tasks/prd-non-goals-and-success-metrics

Claimed: Of 9 mandated PRD sections, Non-Goals (Out of Scope) and Success Metrics carry real weight for scope control and a concrete definition of done.

**Refuted:** The section count is accurate (lines 57-65 list exactly 9 numbered sections, Non-Goals is #5, Success Metrics is #8), but the claim overstates what the source does with them: Non-Goals gets one generic bullet ('Clearly state what this feature will not include to manage scope') with zero elaboration, examples, or emphasis distinguishing it from the other 7 sections. The whyItWorks goes further and speculates 'Directly counters house-style convergence IF do-not-converge-on-last-brief is stated as a non-goal' -- this is the claiming agent's own hypothetical, not anything create-prd.md instructs or exemplifies. This is rule-3's exact failure mode: a template heading treated as a targeted anti-convergence mechanism.

Checked at: `/c/Users/Usmo1/AppData/Local/Temp/claude/C--Users-Usmo1-Documents-sitesmith/60a368a9-e3a0-4ebc-aadf-386ee1a4a75a/scratchpad/upstream/ai-dev-tasks/create-prd.md`

Decision was `adapt`, now `investigate`.

### before-implementing/blocking-question-template-with-budget

Claimed: Every question must be material, grounded, and answerable, delivered via a template (question/why it matters/evidence/recommended default); ~5-question budget; fatigue valve stops interviewing on short/impatient answers and batches remaining unknowns as one assumptions list; ban on asking users to verbalize taste they can only recognize when shown.

**Refuted:** The mechanism itself is real -- SKILL.md lines 92-126 confirm Material/Grounded/Answerable (92-96), the bad-question ban on verbalizing taste (103), the blocking-question template (110-118), the ~5-question budget and fatigue valve (122-126). However the whyItWorks overstates its provenance: it asserts 'The package's own CHANGELOG documents this as a deliberate 0.1.2 fix for real user-exhaustion feedback -- a tested fix, not a speculative addition.' Opening CHANGELOG.md shows the 0.1.2 entry only says 'Anti-exhaustion release -- addresses the failure mode where grilling primes an agent to over-question to the point of user exhaustion,' with no named user, no cited feedback, no 'reported by' -- unlike the 0.1.1 entry two sections down which explicitly credits '@mattpocock's feedback that the skill was long, costly in tokens, and hard to review.' Claiming CHANGELOG-documented 'real user-exhaustion feedback' and calling it 'tested' misrepresents a self-described anti-pattern fix as empirically validated user research.

Checked at: `/c/Users/Usmo1/AppData/Local/Temp/claude/C--Users-Usmo1-Documents-sitesmith/60a368a9-e3a0-4ebc-aadf-386ee1a4a75a/scratchpad/upstream/before-implementing/CHANGELOG.md`

Decision was `adopt`, now `investigate`.

### agency-agents/orch-01-finish-gate-design-contract

Claimed: Single-pass review procedure: write a one-paragraph product lens (user, job, first-read object), collect 3-5 comparable reference patterns, fill a Design Contract naming density/hierarchy/interaction-model/forbidden-defaults, then audit the implementation against it and return a hard PASS or HOLD verdict (never a soft list of nice-to-haves).

**Refuted:** Opened agency-agents/design/design-ui-finish-gate-reviewer.md in full. The cited range (106-165) only contains Steps 3-5 (Design Contract template, implementation audit, PASS/HOLD report). Two of the five components the claim describes live outside that range: the 'one-paragraph product lens' is Step 1 at lines 85-97 ('Write a one-paragraph lens before critiquing pixels'), and 'collect 3-5 comparable reference patterns' is Step 2 at lines 98-105 ('Build a short evidence set with 3-5 screens or patterns'). The 'never a soft list of nice-to-haves' qualifier is also not in the cited range -- it's at lines 56-57 in the earlier 'Run a Hard Finish Gate' section ('do not soften a hold into a vague list of nice-to-haves'). The underlying five-step workflow is real, but the claim merges three separate sections (Core Mission lines 56-57, Step 1 lines 85-97, Step 2 lines 98-105) into a citation window that covers none of them, only Steps 3-4-5.

Checked at: `scratchpad/upstream/agency-agents/design/design-ui-finish-gate-reviewer.md:56-57,85-105 (outside the cited 106-165 range)`

Decision was `adapt`, now `investigate`.

### graph-engineering/orch-04-fresh-context-review

Claimed: Verify in a separate context from the one that produced the work -- even without any other agent or fleet, a second pass with no memory of writing the code catches errors a same-context self-review does not.

**Refuted:** Opened graph-engineering/graph-engineering/references/task-graphs.md (actual path requires an extra nested 'graph-engineering/' directory not present in the sourcePath as given). Lines 40-44 do say 'verify in a separate context... a model grading its own work in its own context misses most of its own mistakes' -- but this sentence sits inside the 'Diamond Pattern' section, which is explicitly a multi-worker graph (worker 1/2/3 -> verify -> merge, per the diagram at lines 34-38). Nothing in the cited lines, or anywhere in the file, states the principle is 'agent-count-independent' or holds 'even without any other agent or fleet' -- that generalization is invented, not sourced. Additionally, the claim's whyItWorks attributes support to 'a controlled multi-agent study (DeepMind x MIT, 180 configs)', but that study (with the 80%/39-70%/17.2x/4.4x figures) appears in the separate 'Stop Rule' section at lines 46-52, about coordination overhead and when NOT to split work -- it says nothing about self-grading blindness. The claim misattributes a different section's evidence to this mechanism.

Checked at: `scratchpad/upstream/graph-engineering/graph-engineering/references/task-graphs.md:30-52 (diamond pattern + stop rule sections)`

Decision was `adapt`, now `investigate`.

### awesome-claude-code-subagents/orch-09-design-bridge-checklist

Claimed: Fixed extraction checklist run before any implementation: visual theme/atmosphere, colour palette with named roles + hover/active states, typography rules, component stylings, layout/spacing rules, elevation/shadow system, responsive breakpoints. Treats a missing category as a question to ask, not an assumption to invent.

**Refuted:** Opened awesome-claude-code-subagents/categories/01-core-development/design-bridge.md. The extraction checklist items (Visual Theme, Color Palette & Roles with hover/active states, Typography, Component Stylings, Layout Principles, Depth & Elevation, Responsive Behavior) genuinely match at lines 46-55 and 83-90 -- that part checks out. But the claim's second half, 'treats a missing category as a question to ask, not an assumption to invent,' is not in either cited range. That behavior is stated at lines 35 ('Ask before assuming') and 43 ('Don't: ... Guess missing info'), inside the separate 'Do's and Don'ts' block (lines 31-44) -- entirely outside the cited 46-55/83-90 windows. Also worth noting: this agent is scoped to translating one specific external repo (VoltAgent/awesome-design-md DESIGN.md files), not a general brand-matching checklist independent of that tool, which the whyItWorks framing ('the checklist shape, not the tool, is portable') glosses over.

Checked at: `scratchpad/upstream/awesome-claude-code-subagents/categories/01-core-development/design-bridge.md:31-44 (outside the cited 46-55,83-90 ranges)`

Decision was `adapt`, now `investigate`.

### agent-elements-21st/agent-elements-companion-skill-reference

Claimed: A short static SKILL.md ships alongside the shadcn registry, listing every component's exact props, exact file path, and an explicit 'never import from a barrel' rule. No design opinions encoded, only API ground truth.

**Refuted:** Opened the file in full (278 lines via wc -l, i.e. not 'short' by any standard set elsewhere in this same claim set — compare the 47-line remotion-best-practices/SKILL.md called 'short' in a sibling claim). The cited range 104-166,240-250 does NOT contain the barrel-import rule or the per-component file-path listing at all — those live at lines 53-91 (Paths section) and line 93 ('Import rule: always import from the exact file, never from a barrel.'), outside the cited lines. The claim stitches together three separate sections (Paths, Component catalog, Theming) and attributes all of it to the cited range. The catalog (104-166) lists prop *names* for some components but not 'every component's exact props' — SendButton/AttachmentButton/FileAttachment get zero prop documentation ('usable standalone if you're building a custom composer'). Most importantly, the cited range itself contradicts 'no design opinions encoded': lines 249-250 read 'Customising a component is just editing the installed file. Prefer that over wrapping — the code is yours now,' which is an explicit workflow/design opinion, not API ground truth.

Checked at: `C:\Users\Usmo1\AppData\Local\Temp\claude\C--Users-Usmo1-Documents-sitesmith\60a368a9-e3a0-4ebc-aadf-386ee1a4a75a\scratchpad\upstream\agent-elements-21st\skills\agent-elements\SKILL.md (lines 53-102 for paths/barrel rule; 104-166 for catalog; 240-250 for theming/opinion; 278 lines total via wc -l)`

Decision was `adapt`, now `investigate`.

### remotion-skills/remotion-router-skill

Claimed: One short SKILL.md (48 lines), a one-paragraph-per-topic table of contents, each a relative markdown link to that topic's own entry file, loaded only when relevant.

**Refuted:** Opened and counted the file directly: `wc -l` reports 47 lines, not 48 as claimed — a guessed/wrong count per the verification rule. The structural description (headed sections each with a short blurb and a relative link like './remotion-create/REFERENCE.md') is accurate, so the shape itself is real, but the claim's 'whyItWorks' rests on an unverifiable cross-reference ('Same shape as the 55-line frontend-design file that beat SiteSmith's 630k-token package') — neither the 55-line file nor the 630k-token package figure is present in, or verifiable from, the cited sourcePath. That comparison is imported from outside evidence and asserted as fact without a citable source in this file.

Checked at: `C:\Users\Usmo1\AppData\Local\Temp\claude\C--Users-Usmo1-Documents-sitesmith\60a368a9-e3a0-4ebc-aadf-386ee1a4a75a\scratchpad\upstream\remotion-skills\skills\remotion-best-practices\SKILL.md (47 lines via wc -l, not 48)`

Decision was `adopt`, now `investigate`.

## Adopt (128)

| mechanism | source | context cost | red team | what it solves |
| --- | --- | --- | --- | --- |
| `em-dash-absolute-ban` | taste-skill | low | confirmed | The most-violated stylistic tell kept recurring under softer 'use sparingly' phrasing. |
| `buy-every-claim-maps-to-a-spec-line` | sitesmith-modes | low | unchallenged | Product pages accumulate benefit copy that nothing on the page substantiates, which is marketing that wandered onto a co |
| `operate-arrangement-from-work-shape` | sitesmith-modes | low | unchallenged | A layout picked from a menu of dashboard conventions rather than derived from how the work is actually done. |
| `operate-entry-is-quiet` | sitesmith-modes | low | unchallenged | Movement in peripheral vision while a person is typing figures or counting stock breaks the count. It is the one motion  |
| `delete-the-design-argument-test` | sitesmith-modes | low | unchallenged | A page that looks persuasive but says nothing. Design carries an empty argument and every review passes it because the r |
| `preservation-contract` | sitesmith-modes | low | unchallenged | A redesign silently changes things that were never the designer's to change: the router, brand marks, URLs, form field n |
| `brief-inference-design-read` | taste-skill | low | confirmed | Models jump straight to a default aesthetic instead of reasoning about who the site is for and what it should feel like. |
| `structurally-different-direction-gate` | sitesmith-current | medium | confirmed | Three comps sharing layout but differing in hue is one direction rendered three times; round-8 sites passed a 5-axis che |
| `buy-decision-and-control-together` | sitesmith-modes | low | unchallenged | A marketing hero above a product inserts a screen of scrolling between wanting the object and being able to buy it; a ca |
| `buy-total-commitment-legible` | sitesmith-modes | low | unchallenged | Delivery cost, delivery time and return terms discovered inside checkout are the classic abandonment cause; the buyer co |
| `buy-specification-is-complete` | sitesmith-modes | low | unchallenged | Six specs shown when twelve exist: the buyer who cares finds out and reads the omission as concealment. |
| `buy-proof-shows-its-shape` | sitesmith-modes | low | unchallenged | A mean rating with no count and no negatives is indistinguishable from a filtered one, and buyers correctly assume it is |
| `buy-nothing-moves-near-money` | sitesmith-modes | low | unchallenged | A number that animates is a number the buyer re-checks; motion near a price reads as the price being manipulated. |
| `buy-scale-is-stated` | sitesmith-modes | low | unchallenged | A photograph cannot convey size, and size is the most common cause of a return. |
| `buy-name-the-free-axis` | sitesmith-modes | low | unchallenged | A craft floor that answers every question converges, because the answers it gives are the same answers on every project. |
| `operate-unit-of-work-density` | sitesmith-modes | low | unchallenged | Density picked as taste ('this feels tight enough') produces a screen where a real unit of the operator's job does not f |
| `operate-exceptions-before-inventory` | sitesmith-modes | low | unchallenged | A screen that shows every record with equal weight has done none of the operator's sorting, so the operator does it by e |
| `operate-listing-reconciles` | sitesmith-modes | low | unchallenged | A grid with no total makes the user do arithmetic, and arithmetic done by hand on screen data is where operator errors c |
| `operate-multi-step-form-contract` | sitesmith-modes | low | unchallenged | Long data entry where the operator cannot tell how far in they are, cannot find what is wrong, and cannot check their an |
| `operate-state-legible-over-time` | sitesmith-modes | low | unchallenged | An operated surface where the user cannot tell what was saved, what is pending, what failed or how old the number is. 'A |
| `operate-keyboard-reach-complete-and-discoverable` | sitesmith-modes | low | unchallenged | A scroller no key reaches, a grid that cannot be traversed, and a shortcut that exists and is documented nowhere. 'Nothi |
| `operate-blocked-control-says-why` | sitesmith-modes | low | unchallenged | A dead button with no explanation, which leaves the operator hunting the screen for what they did wrong. |
| `operate-destructive-separated-by-position` | sitesmith-modes | low | unchallenged | Destructive and constructive actions adjacent and distinguished only by colour, which fails for anyone who does not see  |
| `first-screen-from-strongest-material` | sitesmith-modes | medium | unchallenged | Every marketing brief gets the same hero because a default arrangement exists to be reached for. |
| `proof-strength-ladder-with-nothing-as-a-rung` | sitesmith-modes | low | unchallenged | A page needs a proof band, no real proof exists, so proof is invented. Invented proof is the clearest single tell that a |
| `no-motion-between-intent-and-result` | sitesmith-modes | low | unchallenged | Animation placed where a user is committing to something: a form that animates while being filled, a button whose transi |
| `stack-decision-gate` | sitesmith-modes | low | unchallenged | A design task installs a framework into a project that already has one, or adds a second styling system, turning a scope |
| `forgotten-surfaces-checklist` | sitesmith-modes | low | unchallenged | Generated sites are consistently missing the same six things, and each one is the difference between a mockup and a site |
| `impeccable/run-notes-skip-accounting` | sitesmith-modes | low | unchallenged | Directly the rebuild's third measured fact: prose guardrails the model polices itself with fail silently. This file has  |
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
| `explicit-never-simplify-carveouts` | ponytail | low | confirmed | A bare 'write less' instruction cuts validation/security/accessibility along with real bloat. |
| `blob-seek-scrubbing` | scroll-world | low | confirmed | Setting video.currentTime from scroll silently fails on hosts without HTTP byte-range support: seekable pins to [0,0] an |
| `four-quadrant-unknowns-taxonomy` | before-implementing | low | confirmed | An agent treats all uncertainty the same way (ask a question), when some is a fact to look up, some is unverbalized tast |
| `unknown-knowns-prototypes` | before-implementing | low | confirmed | The user has taste they recognize when shown but can't specify up front; asking them to verbalize it drives a generic de |
| `buy-absent-proof-is-declared` | sitesmith-modes | low | unchallenged | An empty proof slot invites fabrication, and a buyer is one search away from checking. |
| `buy-committed-actions-answer-immediately` | sitesmith-modes | low | unchallenged | An add-to-basket that does not confirm makes the buyer press it twice, and a filter that does not acknowledge makes them |
| `buy-result-set-is-navigable` | sitesmith-modes | low | unchallenged | Filters built from the warehouse's categories, an unstated result count, and an empty result that is a dead end. |
| `buy-missing-image-names-itself` | sitesmith-modes | low | unchallenged | Generated product imagery that will not match the shipped catalogue, produced because an empty image slot looks unfinish |
| `buy-helping-or-in-the-way` | sitesmith-modes | low | unchallenged | Product pages accumulate elements that nobody can defend, and there is no test for removing them. |
| `operate-action-at-the-object` | sitesmith-modes | low | unchallenged | Actions in a toolbar three sections away force the operator to hold the target in memory while travelling to the control |
| `operate-no-editorial-subsetting` | sitesmith-modes | low | unchallenged | A designer hiding data to keep an operated screen calm. 'The user came for the data and hiding it to keep the screen cal |
| `operate-partial-is-a-state` | sitesmith-modes | low | unchallenged | A bulk action where some rows succeeded and some did not, reported as either success or failure. It is the state an oper |
| `never-default-styled-generated-components` | sitesmith-modes | low | unchallenged | Component generators ship a complete, recognisable visual language. Installed and used unmodified, that language is the  |
| `read-score-repair-phasing` | sitesmith-modes | low | unchallenged | Fixing while reading produces a scattered diff and hides systemic problems behind local ones. Forty files change and not |
| `one-imagery-treatment-per-site` | sitesmith-modes | low | unchallenged | Two photographic treatments on one page reads as two brands, and it is the most common way a site assembled from mixed s |
| `imagery-provenance-ladder` | sitesmith-modes | low | unchallenged | Imagery is the layer where a page most easily starts lying: a rendered fake of the product's interface, a stock photogra |
| `phone-navigation-obligations` | sitesmith-modes | low | unchallenged | A phone navigation that hides the primary action behind a menu, or that gives no indication of where the visitor current |
| `impeccable/three-way-evidence-reconciliation` | sitesmith-modes | low | unchallenged | This is the file's answer to critic-vs-critic disagreement, and it is the thing the coverage gap most obviously cost us. |
| `applicability-scope-notice-on-rule-blocks` | sitesmith-modes | low | unchallenged | A reference corpus is retrieved by keyword, so rules true in one context get pulled into a build where they are false —  |
| `form-error-recovery-and-announcement-contract` | sitesmith-modes | low | unchallenged | Generated forms fail correctly and unhelpfully: the error exists in the DOM, is not announced, does not say how to fix i |
| `two-gate-separation-technical-vs-visual` | sitesmith-current | low | confirmed | Merging 'works' and 'good' is how PASS came to be read as 'this is good'. |
| `contract-after-direction-plus-token-drift` | sitesmith-current | low | confirmed | Not one of nine legacy pages had a spacing/type scale; every value chosen ad hoc at point of use. |
| `official-design-system-honesty-rule` | taste-skill | low | confirmed | Models claim hand-rolled CSS is an official platform technology (e.g. calling glassmorphism 'Apple Liquid Glass'). |
| `zero-result-honesty` | ui-ux-pro-max | low | confirmed | Stopping the model from presenting a failed search as a real recommendation. |
| `craft-floor-ban-list` | impeccable | low | confirmed | LLMs default to a recognizable handful of AI-slop surface habits regardless of brief. |
| `mechanical-antipattern-detector` | impeccable | medium | confirmed | Design critique/floor rules are useless without something actually checking shipped code against them. |
| `mode-based-visitor-registers` | impeccable | low | confirmed | Applying one aesthetic/behavior register to every surface produces surfaces that fight their own purpose. |
| `interaction-journeys` | sitesmith-current | medium | confirmed | Nine legacy pages had zero <script> tags; every interactive state was drawn but never reachable. |
| `seven-rung-simplicity-ladder` | ponytail | low | confirmed | Agents default to writing new code before checking cheaper layers exist (existing code, stdlib, native feature). |
| `segment-interleave-scene-model` | scroll-world | low | confirmed | A scroll-scrubbed multi-scene film needs a single flat timeline (scroll position -> which clip, and how far into it) bui |
| `clarifying-questions-before-spec` | ai-dev-tasks | low | confirmed | Agent starts writing a spec/plan on an underspecified request and locks in a wrong interpretation before the user can co |
| `buy-structure-follows-the-buyer` | sitesmith-modes | low | unchallenged | Category trees that mirror how stock is organised rather than how buyers ask for things. |
| `buy-related-states-the-relation` | sitesmith-modes | low | unchallenged | Undifferentiated 'you may also like' rails that serve neither the buyer who is in the wrong place nor the buyer who is i |
| `verify-imports-against-manifest` | sitesmith-modes | low | unchallenged | A hallucinated import fails at build time and costs a full cycle, and it is a failure mode specific to the agent writing |
| `named-z-index-scale` | sitesmith-modes | low | unchallenged | Stacking becomes an arms race. z-index: 9999 means the scale was lost, and every later overlay has to outbid it. |
| `transitions-on-transform-and-opacity-only` | sitesmith-modes | low | unchallenged | Animating width, height, top or left forces layout on every frame, so the motion is janky on exactly the devices least a |
| `content-variance-check` | sitesmith-modes | low | unchallenged | Identical timestamps across a blog roll, or one photograph reused for four people. Real content is untidy; generated con |
| `sufficient-stack-definition` | sitesmith-modes | low | unchallenged | Tooling accretes during a design task. A page ends up with a state library, a component library and three styling system |
| `no-key-gated-service-in-setup` | sitesmith-modes | low | unchallenged | A design task quietly acquires a paid dependency or writes a credential into a config file on the user's behalf. |
| `impeccable/score-inflation-calibration-anchor` | sitesmith-modes | low | unchallenged | A self-scoring model grades generously. Without an external anchor a 0-4 scale collapses toward 3-4 and the score stops  |
| `impeccable/severity-tiebreak-question` | sitesmith-modes | low | unchallenged | Severity labels drift. Without a tie-breaker, P1 and P2 are assigned by mood and the priority ordering that the whole do |
| `dependency-declared-optional-with-named-prose-fallback` | sitesmith-modes | low | unchallenged | A skill whose retrieval layer needs a runtime that may be absent either fails hard, or silently installs software on the |
| `animation-interruptible-and-never-blocking` | sitesmith-modes | low | unchallenged | Motion that owns the user: a transition that must finish before the next tap registers, or an entrance animation that sw |
| `subject-grounding-mandate` | frontend-design | low | confirmed | Vague briefs cause generic output because the model has nothing specific to differentiate against. |
| `two-pass-token-system` | frontend-design | low | confirmed | Jumping to code causes ad hoc, uncritiqued design decisions. |
| `single-clarifying-question-cap` | taste-skill | low | confirmed | Agents either guess wrong silently or dump multi-question interrogations before doing work. |
| `stack-never-assume` | ui-ux-pro-max | low | confirmed | Preventing every downstream recommendation from silently targeting the wrong framework. |
| `document-after-build-not-before` | impeccable | low | confirmed | A design-system doc written before the build describes intentions and can silently canonize a shipped mistake as a rule  |
| `self-validating-llm-judge` | ponytail | medium | confirmed | An unvalidated LLM judge for a non-deterministic quality axis (over-engineering) is an opinion, not evidence. |
| `interaction-model-identification-first` | ai-website-cloner-template | low | confirmed | Named as the single most expensive cloning mistake: building click-based UI when the original is scroll-driven, or vice  |
| `spec-file-inline-only-contract` | ai-website-cloner-template | medium | unchallenged | A builder told to consult a referenced doc either doesn't read it or the reference drifts; a builder given a short promp |
| `distance-based-seam-crossfade` | scroll-world | low | confirmed | Even frame-matched clip boundaries need a visual handoff rather than an instantaneous cut between video elements. |
| `blindspot-pass` | before-implementing | medium | confirmed | Constraints or failure modes nobody has considered yet, which asking about known unknowns will never surface. |
| `calibration-over-under-constrain` | before-implementing | low | unchallenged | Over-specified plans make the agent follow instructions even when a pivot is better; under-specified plans make it defau |
| `remotion-technique-independence` | remotion-skills | low | confirmed | Multiple mutually-exclusive implementation techniques for the same feature need presenting without forcing the model to  |
| `icon-coherence` | sitesmith-modes | low | unchallenged | Icons drawn from three families at three stroke weights, or emoji standing in for icons and rendering differently on eve |
| `impeccable/findings-grounded-followup-questions` | sitesmith-modes | low | unchallenged | Post-audit questioning defaults to generic discovery ('who is your audience?'), which wastes the user's time and produce |
| `hero-as-thesis` | frontend-design | low | confirmed | Hero sections default to stat-block+gradient regardless of subject. |
| `brief-primacy-override` | frontend-design | low | confirmed | Anti-cliché rule could wrongly override an explicit client request matching a named cliché. |
| `self-critique-loop` | frontend-design | low | confirmed | A model's first idea is disproportionately likely to be its most generic idea. |
| `full-output-enforcement` | taste-skill | low | unchallenged | Models truncate long code output with placeholder comments or premature stop. |
| `context-aware-no-argument-routing` | impeccable | low | confirmed | A static command menu forces users to already know which command they want; auto-picking removes user control. |
| `mode-based-routing-not-defaults` | sitesmith-current | low | unchallenged | v1 issued global rules and then contradicted itself when context demanded otherwise. |
| `honest-benchmark-correction` | ponytail | low | confirmed | Inflated published numbers tend to survive even after being shown flawed. |
| `exhaustive-state-capture` | ai-website-cloner-template | medium | confirmed | Extracting only the default on-load state misses every other tab/scroll/hover state. |
| `linger-ease-pacing` | scroll-world | low | confirmed | A linear scroll-to-time mapping gives no way to make a scene's best/most narratively important frame coincide with the m |
| `reduced-motion-full-degrade` | scroll-world | low | confirmed | prefers-reduced-motion should stop clip loading entirely, not just disable visible animation while still fetching/decodi |
| `css-layer-theme-override` | scroll-world | low | confirmed | A component injecting default CSS custom properties needs a host page's own theme rules to win without predicting every  |
| `map-vs-territory-framing` | before-implementing | low | confirmed | Agent conflates its internal model of the problem with the actual codebase/product/constraints and never notices the gap |
| `deviation-policy` | before-implementing | low | unchallenged | Mid-build, reality contradicts the plan and the agent either barrels ahead wrongly or halts on every tiny surprise. |
| `self-contained-packaging-lesson` | before-implementing | low | unchallenged | A skill silently depending on other skills being installed gives almost nothing to an agent that only loads the headline |
| `structure-as-information` | frontend-design | low | confirmed | Numbered markers and other structural devices get applied decoratively regardless of whether content is sequential. |
| `signature-element-restraint` | frontend-design | low | unchallenged | Undisciplined creativity spreads boldness evenly, reading as busy or unfocused; conversely over-restraint fails to take  |
| `copy-as-design-material` | frontend-design | low | unchallenged | Generic/placeholder copy signals templated design even when visuals are original. |
| `tool-agnostic-preflight-detection` | ai-website-cloner-template | low | confirmed | Hard-coding one browser-automation tool breaks in any environment with a different one. |
| `layered-asset-vigilance` | ai-website-cloner-template | low | confirmed | A section that looks like one image is often multiple stacked layers; missing an overlay makes the rebuild look empty. |
| `asset-enumeration-and-batched-download` | ai-website-cloner-template | low | unchallenged | Manually finding and downloading every asset one at a time is slow and easy to under-count. |
| `scrub-video-encoding-recipe` | scroll-world | low | confirmed | Naive assumptions about scrub smoothness (all-intra encoding, quality downscaling) are backwards; the real levers are se |
| `persona-framing` | frontend-design | low | confirmed | Default LLM output for 'build a UI' regresses to safe, generic templates because there is no evaluative pressure. |
| `typography-as-personality` | frontend-design | low | confirmed | Type pairing defaults to the same 'safe' families regardless of project. |
| `deliberate-motion` | frontend-design | low | confirmed | Motion is either absent or scattered across hover effects with no orchestration. |
| `scope-defaults-block` | ai-website-cloner-template | low | confirmed | Ambiguous fidelity/scope forces either a clarifying question every time or silent scope drift. |
| `no-guessing-completeness-mandate` | ai-website-cloner-template | low | confirmed | A builder given an incomplete spec fills gaps by invisible guessing. |
| `pre-dispatch-checklist-gate` | ai-website-cloner-template | low | unchallenged | Without an explicit stopping point, extraction can feel 'done enough' and dispatch happens on an incomplete spec. |
| `named-failure-log` | ai-website-cloner-template | low | unchallenged | Generic 'be careful' guidance doesn't transfer lessons from actual past mistakes. |

## Adapt (62)

| mechanism | source | context cost | red team | what it solves |
| --- | --- | --- | --- | --- |
| `buy-one-unmistakable-purchase-control` | sitesmith-modes | low | unchallenged | When the acquire control has the same weight as three other controls, the buyer hesitates over which one commits them. |
| `buy-reference-price-is-real` | sitesmith-modes | low | unchallenged | Invented 'was' prices are the most common commerce lie and in several jurisdictions they are illegal. |
| `comparison-axis-alignment` | sitesmith-modes | low | unchallenged | Things the reader is comparing do not line up: prices jitter between rows, card CTAs sit at three different heights, pri |
| `impeccable/licensed-empty-slot` | sitesmith-modes | low | unchallenged | A report template with fixed quota slots manufactures content to fill them. This file is the case study for both halves: |
| `bm25-csv-retrieval` | ui-ux-pro-max | low | confirmed | Fetching relevant reference rows from a flat CSV corpus by free-text query without an embeddings service or network call |
| `forced-index-direction-roll` | impeccable | low | confirmed | A single model's resonance ranking over its own grounded concept list is deterministic — repo's own measurement: 30/35 i |
| `buy-price-is-found-not-hunted` | sitesmith-modes | low | unchallenged | A price the buyer has to search for is read as a price being hidden. |
| `buy-purchase-control-is-always-in-reach` | sitesmith-modes | low | unchallenged | A buyer who decides while reading the specification has to scroll back up to act, and some do not. |
| `buy-availability-is-stated-in-words` | sitesmith-modes | low | unchallenged | Stock, offer and delivery state are the facts that decide whether the buyer acts now, and they are routinely encoded as  |
| `buy-the-way-back-to-the-set` | sitesmith-modes | low | unchallenged | The most common next action after rejecting a product is returning to the set it came from, and a lost filter state make |
| `operate-orientation-before-work` | sitesmith-modes | low | unchallenged | An operator who must read a whole screen to learn whether it needs them pays that cost on every visit, a thousand times. |
| `operate-compared-figures-do-not-shift` | sitesmith-modes | low | unchallenged | A column whose digits move under each other cannot be scanned, and at operate row heights it is the smallest text on the |
| `operate-shape-promises-only-what-it-delivers` | sitesmith-modes | low | unchallenged | A shape that reads as a control and is not one costs a click and a moment of doubt every time it is seen, which in this  |
| `operate-motion-reports-state-only` | sitesmith-modes | low | unchallenged | Motion used for character on a working surface is a cost with no return, and scroll-driven effects make a data surface u |
| `operate-latency-is-narrated` | sitesmith-modes | low | unchallenged | An action that takes longer than perception with no acknowledgement gets clicked twice, and a whole-screen spinner destr |
| `six-states-enumerated` | sitesmith-modes | medium | unchallenged | Interactive elements ship with rest and hover and nothing else. Missing states read as unfinished work and are then defe |
| `argument-shape-six-beats` | sitesmith-modes | low | unchallenged | A persuade surface with a beautiful first screen and no argument beneath it: three feature cards standing in for the fou |
| `impeccable/na-renormalized-scoring` | sitesmith-modes | low | unchallenged | A fixed rubric applied to a surface it was not designed for silently punishes the surface for lacking checks that cannot |
| `three-dial-system` | taste-skill | low | confirmed | Gives shared vocabulary for how experimental/animated/dense a design should be instead of vague words. |
| `self-administered-preflight-checklist` | taste-skill | high | confirmed | Prevents shipping known defects (bad contrast, wrapped CTAs, duplicate CTA intent, mixed radii). |
| `gsap-canonical-code-skeletons` | taste-skill | low | confirmed | Scroll-pin/hijack GSAP patterns are easy to get subtly wrong (trigger fires mid-scroll instead of pinning at top). |
| `buy-the-basket-is-never-out-of-reach` | sitesmith-modes | low | unchallenged | A buyer who cannot see what they have accumulated stops accumulating. |
| `buy-image-set-is-consistent` | sitesmith-modes | low | unchallenged | A catalogue photographed inconsistently reads as a reseller's scrape, and a single angle hides what the buyer needs to s |
| `operate-image-earns-identification` | sitesmith-modes | low | unchallenged | Decorative imagery on a surface the operator sees a thousand times costs them a little each time and identifies nothing. |
| `operate-signal-colour-is-reserved` | sitesmith-modes | low | unchallenged | A colour that means something and is also used for decoration stops meaning anything, and the operator learns to ignore  |
| `operate-navigation-shallow-invariant-persistent` | sitesmith-modes | low | unchallenged | Navigation that moves between screens, goes more than two deep, or vanishes at narrow widths, on a surface the operator  |
| `signature-swap-falsifier` | sitesmith-modes | low | unchallenged | A page that is technically correct and tonally interchangeable. Every check passes and no direction was chosen. |
| `bias-correction-bans-with-override-paths` | taste-skill | high | confirmed | Blocklisting known LLM-default tells without permanently outlawing them for briefs that genuinely want them. |
| `dual-isolated-critique-subagents` | impeccable | medium | confirmed | A single context doing both subjective and mechanical review anchors on whichever ran first. |
| `assignment-blinded-critique-gate` | sitesmith-current | medium | confirmed | A blind review only described in prose is a blind review that will not happen. |
| `buy-comparison-is-a-glance` | sitesmith-modes | low | unchallenged | Irregular repeated units read as a rendering bug, and figures that shift under their own digits force the buyer to compa |
| `operate-signal-verified-in-every-context` | sitesmith-modes | medium | unchallenged | A state colour checked once, on one surface, in one scheme, and then used as text on a light ground where it is illegibl |
| `scoring-rubric-with-resumption` | sitesmith-modes | medium | unchallenged | A redesign ends with no statement of what improved and no statement of what is still broken, so the next session starts  |
| `one-intent-one-label` | sitesmith-modes | low | unchallenged | Two controls with the same intent carrying different labels, and the reader has to work out whether they do the same thi |
| `impeccable/cross-run-score-trend` | sitesmith-modes | medium | unchallenged | A critique that leaves no comparable trace cannot tell you whether the last round of fixes helped. Without a stable iden |
| `orientation-and-text-scale-as-verification-axes` | sitesmith-modes | low | unchallenged | A responsive verification matrix that only varies width passes layouts that break when the viewport is short or when the |
| `domain-auto-detect` | ui-ux-pro-max | low | confirmed | Routing a free-text query to the right CSV when --domain is omitted. |
| `impeccable/user-owned-ignore-list` | sitesmith-modes | low | unchallenged | A repeat critique re-raises findings the user has already considered and dismissed, which trains the user to ignore the  |
| `impeccable/countable-cognitive-load-checks` | sitesmith-modes | medium | unchallenged | 'Too complex' and 'cluttered' are unfalsifiable review verdicts. The model will assert them or not assert them with no r |
| `model-facing-vs-machine-facing-declaration` | sitesmith-modes | low | unchallenged | A knowledge file that a script parses must answer every field it declares; a file only the model reads may leave things  |
| `modal-foreground-must-be-isolated` | sitesmith-modes | low | unchallenged | A modal or sheet whose backdrop still competes visually, so the user cannot tell what is now interactive and the dialog  |
| `native-first-justified-by-checkable-accessibility` | sitesmith-modes | low | unchallenged | A prose 'prefer native' rule is unenforceable and fails silently, because its stated justification (dependency decay) is |
| `image-first-generation-discipline` | taste-skill | high | unchallenged | Coded output visually drifts from a strong generated reference image. |
| `impeccable/adversarial-persona-walkthrough` | sitesmith-modes | high | unchallenged | A single 'design director' viewpoint has consistent blind spots — it evaluates the happy path at desktop width with full |
| `design-dials` | ui-ux-pro-max | low | confirmed | Letting a caller nudge the deterministic generator toward more/less bold, motion, or density. |
| `surface-brief-scoping` | impeccable | low | confirmed | Global product/design docs get bloated with one-off route-specific strategy, or that strategy is never written down. |
| `complexity-budget-rule` | ai-website-cloner-template | low | confirmed | A single agent given an entire complex section approximates rather than nailing exact values. |
| `checkbox-state-in-file` | ai-dev-tasks | low | confirmed | Losing track of which sub-steps of a multi-step build are done across a long/resumed session. |
| `post-implementation-explainer` | before-implementing | low | unchallenged | A reviewer receiving a finished build with no record of what was decided, assumed, or verified. |
| `impeccable/issue-to-remedy-command-mapping` | sitesmith-modes | low | unchallenged | A critique that ends in observations leaves the user to translate 'weak hierarchy' into an action. The opposite failure  |
| `skill-applicability-self-gate-with-skip-list` | sitesmith-modes | low | unchallenged | A broadly-described skill triggers on work it cannot help with, spending context and inserting design opinions into back |
| `counter-rows-inside-the-rule-table` | sitesmith-modes | low | unchallenged | A stated preference hardens into dogma and gets applied where it is wrong, because the guidance never shows a case where |
| `private-reasoning-before-reveal` | frontend-design | low | confirmed | Showing half-formed ideas too early anchors the conversation on a weak draft. |
| `model-specific-rendition-prior-correction` | impeccable | low | confirmed | A specific model has a measured, named default rendering bias for certain subjects that a general 'be original' warning  |
| `interleaved-extract-and-build` | ai-website-cloner-template | low | confirmed | Strict inspect-then-build sequencing delays feedback and lets extraction gaps accumulate silently across a whole page. |
| `open-subject-question-not-fabricated-menu` | scroll-world | low | confirmed | A fabricated multiple-choice list of subjects at intake biases the user and reads as the assistant deciding their busine |
| `two-phase-approval-gate` | ai-dev-tasks | low | confirmed | Agent generates a huge granular breakdown before the user agrees with the high-level shape. |
| `domain-modeling-context-adr` | before-implementing | medium | confirmed | Vocabulary drift and undocumented hard-to-reverse decisions confusing future readers. |
| `launch-packet-role-split` | before-implementing | medium | unchallenged | Spawning a subagent with an underspecified prompt so it re-derives context badly or misses taste work already done. |
| `orch-02-persona-walkthrough` | agency-agents | medium | confirmed | Design decisions justified by taste rather than by how a real visitor with a specific intent would actually read the pag |
| `css-specificity-caution` | frontend-design | low | confirmed | Narrow implementation bug: type-based and element-based CSS selectors cancelling each other out. |
| `capability-gate-before-commit` | scroll-world | low | unchallenged | Silently substituting an incompatible tool/model for a user's stated preference produces a broken result without explana |

## Investigate (13)

| mechanism | source | context cost | red team | what it solves |
| --- | --- | --- | --- | --- |
| `named-cliche-calibration` | frontend-design | low | refuted | Model has no internal reference for what current generic AI design looks like, so can't recognize its own output matchin |
| `remotion-router-skill` | remotion-skills | low | refuted | A body of knowledge too large to load in full needs to be reachable without bloating every invocation. |
| `computed-style-extraction-script` | ai-website-cloner-template | low | refuted | Hand-measuring CSS properties one at a time is slow and invites estimation errors. |
| `blocking-question-template-with-budget` | before-implementing | low | refuted | Agents that grill relentlessly exhaust the user, or ask vague/unanswerable questions like 'what does modern mean to you? |
| `mobile-scrub-hardening-bundle` | scroll-world | low | refuted | Scroll-scrubbed video has several distinct phone failure modes: fast-flick seek pileup, iOS blank-muted-video quirk, URL |
| `orch-01-finish-gate-design-contract` | agency-agents | low | refuted | Generic, interchangeable UI shipping without anyone naming why it is generic or what would make it product-specific. |
| `appearance-and-behavior-taxonomy` | ai-website-cloner-template | medium | refuted | Static-CSS-only extraction looks right in a screenshot but feels dead in use. |
| `agent-elements-companion-skill-reference` | agent-elements-21st | low | refuted | Model hallucinates component names, prop shapes, and import paths when a component library is only known from training d |
| `progressive-disclosure-file-split` | scroll-world | low | refuted | Heavy reference material inlined into a main procedure file bloats context on every invocation even for steps a build ne |
| `prd-non-goals-and-success-metrics` | ai-dev-tasks | low | refuted | Scope creep and no shared definition of done for a build. |
| `orch-04-fresh-context-review` | graph-engineering | low | refuted | A model reviewing its own freshly-written output in the same context misses most of its own mistakes. |
| `buy-the-object-is-the-subject` | sitesmith-modes | low | unchallenged | Card chrome, badges and framing that compete with the photograph of the thing being sold. |
| `orch-09-design-bridge-checklist` | awesome-claude-code-subagents | low | refuted | Faithfully matching a specific existing product/brand's look when a brief explicitly asks to emulate it, without guessin |

## Reject (40)

| mechanism | source | context cost | red team | what it solves |
| --- | --- | --- | --- | --- |
| `orch-07-ruflo-swarm-platform` | ruflo | high | unchallenged | Coordinated multi-agent swarms, persistent semantic memory, learned model routing, and plugin ecosystem for large multi- |
| `orch-11-graph-engineering-kg-pipeline` | graph-engineering | low | unchallenged | Building knowledge graphs (ontology, entity/relation/event extraction, fusion, GraphRAG serving) as agent memory. |
| `magic-21st-hosted-proxy` | magic-21st | low | unchallenged | Backward compatibility for old MCP configs after the service moved to a paid hosted endpoint. |
| `twelve-slot-appearance-questionnaire` | sitesmith-modes | low | unchallenged | Nothing. It was meant to make each surface kind answer the same design questions consistently. |
| `one-accent-colour-system` | sitesmith-modes | low | unchallenged | Claimed: accent inflation, a screen where everything is emphasised. Actual: it pre-decides the colour system for every o |
| `gpt-fake-rng` | taste-skill | low | confirmed | Attempts to break the LLM default-to-first-option failure across repeated calls. |
| `design-system-generator` | ui-ux-pro-max | medium | confirmed | Producing one coherent design-system recommendation from a single query in one command. |
| `direction-candidate-search` | sitesmith-current | medium | confirmed | Naive top-3 BM25 search returns three near-identical rows. |
| `orch-03-noun-list-antipattern` | awesome-claude-code-subagents | high | unchallenged | N/A -- this is a negative example, not a mechanism to adopt. |
| `orch-06-agents-orchestrator-pipeline` | agency-agents | high | unchallenged | Coordinating a PM -> Architect -> Dev/QA loop -> Integration pipeline across separately-spawned specialist agents. |
| `orch-10-agency-agents-role-taxonomy` | agency-agents | high | unchallenged | Giving a fleet of specialist agents distinct personas/specialties to route work to. |
| `agent-elements-full-catalog` | agent-elements-21st | medium | unchallenged | Rendering an AI agent's own tool calls inside a chat transcript. |
| `generator-mandated-in-prose-and-reroll-as-remedy` | sitesmith-modes | low | unchallenged | Claimed: the model needs a single deterministic entry point so every build starts from a complete, coherent design syste |
| `native-first-capability-lookup-table` | sitesmith-modes | high | unchallenged | An agent reaches for a package before checking whether the platform already ships the capability. |
| `fixed-aesthetic-template-skills` | taste-skill | low | refuted | Gives a user who already chose a direction a ready-made fully-specified rule set instead of an open brief. |
| `ui-reasoning-category-table` | ui-ux-pro-max | low | refuted | Giving ~30 product categories a starting style/color/typography/effects bundle. |
| `orch-05-diamond-fanout-pattern` | graph-engineering | high | unchallenged | Coordinating independent work across multiple agents (research, drafting, verification) in a fleet. |
| `remotion-embedded-skill-duplication` | remotion-skills | high | unchallenged | A sub-skill needs to be reachable both standalone and nested inside a router skill, without the harness double-registeri |
| `defaults-to-alternatives-table` | sitesmith-modes | medium | unchallenged | Nominally: replacing generic component patterns with less generic ones. |
| `round-numbers-read-as-fake` | sitesmith-modes | low | unchallenged | Nominally: detecting fabricated statistics, which are tidy in a way real data is not. |
| `impeccable/nielsen-band-text-verbatim` | sitesmith-modes | high | unchallenged | Nothing this rebuild has. It is a full restatement of Nielsen's ten heuristics with a check-for list and a five-row 0-4  |
| `concrete-hex-inside-a-token-example` | sitesmith-modes | low | unchallenged | Nothing — this is the convergence hazard appearing in the wild, recorded so we do not reproduce it. |
| `uncited-laziness-research-essay` | taste-skill | low | unchallenged | Attempts to justify output-skill's claims with cited research. |
| `multi-copy-sync-architecture` | ui-ux-pro-max | low | confirmed | Shipping identical data/scripts to three consumption paths from one source of truth. |
| `design-system-py-legacy-generator` | sitesmith-current | high | confirmed | Nothing — dead v1 code never called by the current pipeline. |
| `mandatory-branch-task` | ai-dev-tasks | low | unchallenged | Work happening on the wrong git branch. |
| `website-builder-setup-numbers-as-authority` | website-builder-setup | low | unchallenged | Making an unverified external dependency sound credible to a non-technical user during onboarding. |
| `impeccable/thumb-zone-placement-rule` | sitesmith-modes | low | unchallenged | Claims to solve one-handed mobile reachability. |
| `cross-platform-portability-plumbing` | ponytail | high | unchallenged | Getting one ruleset in front of ~20 different agent hosts. |
| `visual-qa-diff-unmeasured` | ai-website-cloner-template | low | unchallenged | Nominally, confirming the finished rebuild matches the source. |
| `junior-dev-audience-framing` | ai-dev-tasks | low | unchallenged | A human junior developer misreading a spec. |
| `combinatorial-variation-picklists` | taste-skill | medium | unchallenged | Same repetitive-output problem as gpt-fake-rng, applied to the image-generation-first workflow. |
| `git-worktree-parallel-builder-dispatch` | ai-website-cloner-template | high | unchallenged | Building every section serially blocks extraction of later sections on completion of earlier builds. |
| `orch-08-ruflo-vector-memory` | ruflo | high | unchallenged | Cross-session recall of what an agent previously did/decided, via HNSW-indexed semantic vector memory. |
| `multi-platform-single-source-sync` | ai-website-cloner-template | low | unchallenged | Supporting 13 different AI agent platforms with native instruction formats would mean hand-maintaining 13 near-duplicate |
| `single-aesthetic-camera-roster` | scroll-world | low | unchallenged | Frames 'cohesion' as fixing art direction to a small enumerated set (clay diorama/papercraft/glossy toy/claymation/neon- |
| `website-builder-setup-stepwise-onboarding` | website-builder-setup | low | unchallenged | A multi-step external-dependency install flow needs to survive individual step failures without stalling. |
| `border-flood-fill-knockout` | scroll-world | low | unchallenged | Removing a flat background from a still while preserving interior regions that happen to match the background colour. |
| `budget-before-spend-gate` | scroll-world | low | unchallenged | Metered, real-money generation needs informed user consent on cost before rendering, since mid-run failure is recoverabl |
| `frame-identical-seam-chaining` | scroll-world | medium | unchallenged | Two independently-generated video clips meant to connect won't visually match because every generation renders slightly  |

## Full records

### agency-agents/orch-01-finish-gate-design-contract — `investigate`

**Solves:** Generic, interchangeable UI shipping without anyone naming why it is generic or what would make it product-specific.

**Mechanism:** Single-pass review procedure: write a one-paragraph product lens (user, job, first-read object), collect 3-5 comparable reference patterns, fill a Design Contract naming density/hierarchy/interaction-model/forbidden-defaults, then audit the implementation against it and return a hard PASS or HOLD verdict (never a soft list of nice-to-haves).

**Why it works:** Forces the model to state product-specific constraints and explicitly name forbidden generic defaults before judging the UI, converting vague taste critique into checkable claims tied to visible states.

**In SiteSmith:** Add as an optional self-review pass in SiteSmith's audit stage: produce the one-paragraph product lens + forbidden-defaults list before generation, then re-check the rendered output against it as a PASS/HOLD gate alongside scripts/verify.mjs.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `design/design-ui-finish-gate-reviewer.md:106-165` | low | 0.75 | refuted | Run the gate on a generated page and confirm it produces a PASS/HOLD with named forbidden-default violations, not generic praise/criticism. |

Failure modes:
- Reviewer invents forbidden defaults not grounded in real evidence
- Could become a rubber-stamp if run in the same context that wrote the code

Conflicts: ui-designer.md (awesome-claude-code-subagents) demonstrates the noun-list failure mode this procedure explicitly avoids

> Downgraded to investigate: the red team refuted the claim as stated. Re-read the source before adopting.

### agency-agents/orch-02-persona-walkthrough — `adapt`

**Solves:** Design decisions justified by taste rather than by how a real visitor with a specific intent would actually read the page.

**Mechanism:** Build one persona profile (search query, psychology, attachment style, fears), then simulate a scroll-by-scroll first read producing two voices per fold: raw persona monologue plus a framework-grounded analyst note (LIFT / Cialdini / Fogg), ending in a scored verdict and prioritised, fold-specific recommendations.

**Why it works:** Forces concrete, falsifiable claims per fold instead of adjective-only critique, and ties every recommendation to a specific fold and framework rather than a generic aesthetic judgment.

**In SiteSmith:** Offer as an optional post-build QA step for conversion-oriented briefs (landing pages, e-commerce, lead-gen) -- not mandatory for every site type.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `design/design-persona-walkthrough.md:59-188` | medium | 0.55 | confirmed | Run against one real brief's landing page and check whether at least one finding maps to a fold + framework citation the team did not already know. |

Failure modes:
- Qualitative simulation only -- source file itself flags this is not statistical evidence
- Low value if the persona is generic instead of specific to the brief

### agency-agents/orch-06-agents-orchestrator-pipeline — `reject`

**Solves:** Coordinating a PM -> Architect -> Dev/QA loop -> Integration pipeline across separately-spawned specialist agents.

**Mechanism:** A dedicated orchestrator agent that spawns other agent files, tracks pipeline phase/state, enforces retry limits and quality gates between phases via JSON handoffs.

**Why it works:** Only pays off when multiple distinct agent processes actually need coordinating; a single skill run once per build has no phases to hand off between.

**In SiteSmith:** none

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `specialized/agents-orchestrator.md:9-16,60` | high | 0.9 | unchallenged | N/A |

Failure modes:
- Pure overhead with nothing to orchestrate

### agency-agents/orch-10-agency-agents-role-taxonomy — `reject`

**Solves:** Giving a fleet of specialist agents distinct personas/specialties to route work to.

**Mechanism:** ~200 agent persona files across 15 divisions, each following Identity/Mission/Rules/Workflow/Deliverables/Communication-Style template, installed individually into an agent runtime and addressed by name.

**Why it works:** Valid for a multi-agent product (this is literally what the repo is for); has no role in a single skill that has no other agents to route to or personas to switch between.

**In SiteSmith:** none

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `README.md:110-507` | high | 0.9 | unchallenged | N/A |

Failure modes:
- N/A -- out of scope by construction

### agent-elements-21st/agent-elements-companion-skill-reference — `investigate`

**Solves:** Model hallucinates component names, prop shapes, and import paths when a component library is only known from training data.

**Mechanism:** A short static SKILL.md ships alongside the shadcn registry, listing every component's exact props, exact file path, and an explicit 'never import from a barrel' rule. No design opinions encoded, only API ground truth.

**Why it works:** Answers a factual question (what does this API look like) rather than a judgement question, removing a class of hallucination without moving a design decision out of the model.

**In SiteSmith:** If SiteSmith ever bundles/references a fixed component set, ship a short regenerated-on-change reference of exact paths/props rather than relying on model memory.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/agent-elements/SKILL.md:104-166,240-250` | low | 0.7 | refuted | Generate code against the registry with and without the reference doc loaded; count import/prop errors. |

Failure modes:
- Goes stale if registry changes and reference doc isn't regenerated alongside it

> Downgraded to investigate: the red team refuted the claim as stated. Re-read the source before adopting.

### agent-elements-21st/agent-elements-full-catalog — `reject`

**Solves:** Rendering an AI agent's own tool calls inside a chat transcript.

**Mechanism:** 26 pre-built React components (AgentChat, MessageList, InputBar, tool cards) installed via shadcn CLI from a hosted registry.

**Why it works:** n/a — not applicable to ordinary websites.

**In SiteSmith:** Not a default dependency; only relevant when a brief explicitly calls for an embedded agent/chat UI.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `lib/agent-ui/components/tools/*.tsx; README.md:15-21` | medium | 0.9 | unchallenged | n/a |

Failure modes:
- Becoming a default dependency of every SiteSmith build regardless of whether the site has a chat interface

Conflicts: Any site with no agent/chat surface

### ai-dev-tasks/checkbox-state-in-file — `adapt`

**Solves:** Losing track of which sub-steps of a multi-step build are done across a long/resumed session.

**Mechanism:** The task list markdown file is itself the state: each sub-task line flips '- [ ]' to '- [x]' after every sub-task, not batched per parent task.

**Why it works:** A single small state file is cheap; the risk is the exact shape that sank the old SiteSmith package if multiplied across many files — kept to one file it's fine.

**In SiteSmith:** One flat task-state file per build, checked off per sub-step; never more than one state file for a single site build.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `generate-tasks.md:43-50` | low | 0.6 | confirmed | Interrupt a build mid-task-list and resume; confirm no redoing of completed sub-tasks. |

Failure modes:
- Proliferating into a state file per phase/world, mirroring the 139-file sprawl that already lost once
- Checkbox state drifting out of sync if updates are batched

Conflicts: None direct; complements existing WORKFLOW-STATE.json pattern in this repo

### ai-dev-tasks/clarifying-questions-before-spec — `adopt`

**Solves:** Agent starts writing a spec/plan on an underspecified request and locks in a wrong interpretation before the user can correct it.

**Mechanism:** Cap clarifying questions at 3-5, ask only where the prompt is ambiguous or missing essential context, present lettered options so the user answers in one line, and forbid starting implementation before questions are answered.

**Why it works:** A thinking aid, not a lookup table: changes what the model asks itself before acting. Independently corroborated by grill-for-unknowns' material/grounded/answerable bar (SKILL.md:92-118) — two unrelated sources converging on 'ask fewer, sharper questions' is stronger signal than either alone.

**In SiteSmith:** Pre-build question gate: max 2-3 lettered questions, asked only when the brief is silent on something that changes layout/scope/brand feel.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `create-prd.md:9-10,14-23,77-81` | low | 0.8 | confirmed | Run the same ambiguous brief twice; confirm it asks <=5 questions once, then doesn't re-ask already-answered material. |

Failure modes:
- Turns into an exhaustive questionnaire if the cap/ambiguity guard is dropped
- Lettered options can railroad the user if not genuinely representative

Conflicts: Magnus's house rule 'Beslut, spørg ikke' — resolve by keeping the cap very small and only asking when it changes scope/architecture

### ai-dev-tasks/junior-dev-audience-framing — `reject`

**Solves:** A human junior developer misreading a spec.

**Mechanism:** Both files instruct writing for a 'junior developer': explicit, unambiguous, jargon-free.

**Why it works:** Rejected: the audience for SiteSmith is always a capable model reading a compact instruction, not a junior human. Adopting this would add explanatory padding that Fact 1 shows is counterproductive — the winning 55-line skill is terse and assumes a capable reader, the opposite of this framing.

**In SiteSmith:** none

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `create-prd.md:67-69, generate-tasks.md:68-70` | low | 0.75 | unchallenged | N/A |

Failure modes:
- Optimizing prose for a human reader who doesn't exist in an agent-to-agent handoff wastes tokens

Conflicts: Fact 1: the winning skill is terse, the opposite of 'explain for a junior dev'

### ai-dev-tasks/mandatory-branch-task — `reject`

**Solves:** Work happening on the wrong git branch.

**Mechanism:** Task generation always inserts a hardcoded '0.0 Create feature branch' as the first task regardless of context, unless the user opts out.

**Why it works:** Rejected: exactly the class of mechanism Fact 1 warns against — a step executed unconditionally from a rule rather than judged from context, conflicting with Magnus's own solo-dev direct-to-branch workflow. SiteSmith's own project CLAUDE.md already governs git workflow per-repo.

**In SiteSmith:** none

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `generate-tasks.md:17` | low | 0.8 | unchallenged | N/A |

Failure modes:
- Fires even when no branch is wanted, forcing an opt-out every time instead of reading context

Conflicts: Magnus's 'Solo-udvikler, intet PR-flow' house rule; Fact 1: decision moved into a fixed rule rather than model judgment

### ai-dev-tasks/prd-non-goals-and-success-metrics — `investigate`

**Solves:** Scope creep and no shared definition of done for a build.

**Mechanism:** Of 9 mandated PRD sections, Non-Goals (Out of Scope) and Success Metrics carry real weight for scope control and a concrete definition of done.

**Why it works:** Cheap, model-facing constraint rather than a rendering rule (Fact 1). Directly counters house-style convergence if 'do not converge on the same layout as the last brief' is stated as a non-goal.

**In SiteSmith:** Two required lines in brief-intake: 'will not look like <named prior site>' and 'done means <concrete criterion>'.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `create-prd.md:53-65` | low | 0.6 | refuted | Check a completed brief for an explicit Non-Goals line and Success Metrics line; confirm the build was checked against both. |

Failure modes:
- Non-goals left as boilerplate 'N/A'
- Success metrics stated only in engineering terms, missing the visual-sameness failure mode

Conflicts: The full 9-section PRD template this is extracted from

> Downgraded to investigate: the red team refuted the claim as stated. Re-read the source before adopting.

### ai-dev-tasks/two-phase-approval-gate — `adapt`

**Solves:** Agent generates a huge granular breakdown before the user agrees with the high-level shape.

**Mechanism:** Generate only parent tasks first, present them, and pause for the user to say 'Go' before generating sub-tasks.

**Why it works:** Cheap two-step confirmation before committing to detail; converges with grill-for-unknowns' 'Ask for confirmation before build' (SKILL.md:61) — a sequencing discipline, not new content-generation logic.

**In SiteSmith:** One gate: show proposed site structure/sections before writing code; proceed automatically if the brief already authorized full autonomy, otherwise wait.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `generate-tasks.md:17-18` | low | 0.55 | confirmed | Verify the skill produces a short parent-task list and stops until an explicit go-ahead signal exists. |

Failure modes:
- Literal string-match on 'Go' is brittle outside a live chat turn; needs generalizing in a non-interactive agent context

Conflicts: Long-run/autonomous-agent house rules that say don't stop-and-wait mid-mission unless irreversible or genuinely ambiguous

### ai-website-cloner-template/appearance-and-behavior-taxonomy — `investigate`

**Solves:** Static-CSS-only extraction looks right in a screenshot but feels dead in use.

**Mechanism:** Requires appearance (getComputedStyle) AND behavior (trigger, before/after, transition) for every element, backed by a 13-category illustrative behavior list.

**Why it works:** Gives the agent a concrete scanning checklist instead of relying on incidental noticing.

**In SiteSmith:** Reuse the appearance-plus-behavior split and re-expressed behavior checklist as the audit step's definition of 'fully extracted.'

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:61-79` | medium | 0.7 | refuted | Asserted only for completeness; extraction itself is measured |

Failure modes:
- List is explicitly non-exhaustive; treating it as closed misses behaviors outside the 13 categories

> Downgraded to investigate: the red team refuted the claim as stated. Re-read the source before adopting.

### ai-website-cloner-template/asset-enumeration-and-batched-download — `adopt`

**Solves:** Manually finding and downloading every asset one at a time is slow and easy to under-count.

**Mechanism:** Single DOM-query script enumerates every img/video/background-image/font/favicon in one JSON dump; batched download (4 parallel) with error handling.

**Why it works:** One enumeration pass produces a complete inventory before downloading starts.

**In SiteSmith:** Reuse the enumerate-then-batch-download pattern, hardened as an actual checked-in script rather than re-derived each run.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:189-227` | low | 0.65 | unchallenged | Enumeration is a real DOM measurement; download completeness has no post-download verification |

Failure modes:
- The download script itself is re-authored from scratch each run; no checked-in tested version exists in the repo

### ai-website-cloner-template/complexity-budget-rule — `adapt`

**Solves:** A single agent given an entire complex section approximates rather than nailing exact values.

**Mechanism:** Mechanical numeric threshold (~150 lines of spec content) forces splitting into one agent per sub-component, explicitly overriding 'but it's all related.'

**Why it works:** Removes judgment from exactly the point where judgment tends to be optimistic.

**In SiteSmith:** Keep the numeric-ceiling-forces-split principle for any sub-agent handoff; re-derive the actual number for SiteSmith's own spec format.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:43-49,444,458` | low | 0.6 | confirmed | Asserted only |

Failure modes:
- 150 is an arbitrary constant tuned to this pipeline's spec verbosity

### ai-website-cloner-template/computed-style-extraction-script — `investigate`

**Solves:** Hand-measuring CSS properties one at a time is slow and invites estimation errors.

**Mechanism:** Reusable JS snippet: depth-4 DOM walk, getComputedStyle against ~40 named properties per element, filters out default/no-op values.

**Why it works:** One script call replaces dozens of manual inspections; default-value filtering keeps output signal-dense.

**In SiteSmith:** Port this script's structure as SiteSmith's standard truth-extraction tool for the audit step, extending the property list.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:239-283` | low | 0.8 | refuted | This is itself a real measurement tool, not an estimate |

Failure modes:
- Depth-4/20-child caps silently truncate deep or wide trees with no warning
- Fixed property list misses CSS features outside it (clip-path, mask, container queries)

> Downgraded to investigate: the red team refuted the claim as stated. Re-read the source before adopting.

### ai-website-cloner-template/exhaustive-state-capture — `adopt`

**Solves:** Extracting only the default on-load state misses every other tab/scroll/hover state.

**Mechanism:** Click every tab and capture content/styles per state; for scroll-dependent elements, capture at position 0 and past the trigger, then diff the two captures.

**Why it works:** Turns 'document what changes' into a mechanical two-snapshot-and-diff procedure with exact before/after values.

**In SiteSmith:** Adopt the two-snapshot-diff procedure as SiteSmith's standard method for documenting stateful elements.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:93-108,285-296,349-358,451` | medium | 0.7 | confirmed | This is a real measurement — two actual getComputedStyle snapshots compared |

Failure modes:
- Cost scales with number of states; no stopping guidance for very large state spaces

### ai-website-cloner-template/git-worktree-parallel-builder-dispatch — `reject`

**Solves:** Building every section serially blocks extraction of later sections on completion of earlier builds.

**Mechanism:** Every builder works in its own git worktree branch; foreman doesn't wait, merges as worktrees complete, rebuilding after each merge.

**Why it works:** Git worktrees enable isolated parallel edits without collision; a single foreman vantage point enables intelligent conflict resolution.

**In SiteSmith:** Do not adopt for the audit step; revisit only if a future SiteSmith mode reconstructs sites from scratch.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:377-403; AGENTS.md MOST IMPORTANT NOTES` | high | 0.7 | unchallenged | Asserted only |

Failure modes:
- Requires orchestration capability not every host provides
- Merge-conflict quality depends entirely on foreman judgment with no described gate

Conflicts: Conflicts with SiteSmith's redesign task shape: audit measures an existing site, it does not need parallel construction agents against a fresh scaffold

### ai-website-cloner-template/interaction-model-identification-first — `adopt`

**Solves:** Named as the single most expensive cloning mistake: building click-based UI when the original is scroll-driven, or vice versa.

**Mechanism:** Strict order: scroll first and watch for unprompted change; only test click/hover if nothing changes on scroll. Interaction model must be written into the spec before any builder prompt.

**Why it works:** Counters availability bias — click-testing is the habitual first move, but scroll-driven behavior is invisible unless scrolled first.

**In SiteSmith:** Make scroll-before-click a mandatory ordered step in SiteSmith's audit pass.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:81-91,450` | low | 0.75 | confirmed | Asserted only, but named from the source's own retrospective of past failures |

Failure modes:
- Relies on the agent actually following the order; nothing external gates it

### ai-website-cloner-template/interleaved-extract-and-build — `adapt`

**Solves:** Strict inspect-then-build sequencing delays feedback and lets extraction gaps accumulate silently across a whole page.

**Mechanism:** Explicitly framed as NOT two-phase: a 'foreman' inspects one section, writes its spec, hands it to a builder, keeps walking — extraction and construction interleave section by section.

**Why it works:** Keeps units of work small and independently checkable; failures stay local to a section instead of compounding.

**In SiteSmith:** Keep the extract-fully-before-moving-on discipline for the audit step; drop the parallel-worktree-builder half.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:14` | low | 0.55 | confirmed | Asserted only |

Failure modes:
- Requires true parallel dispatch capability; no fallback given for hosts without it

Conflicts: SiteSmith's redesign task edits in place; it has no fresh-clone target to build into

### ai-website-cloner-template/layered-asset-vigilance — `adopt`

**Solves:** A section that looks like one image is often multiple stacked layers; missing an overlay makes the rebuild look empty.

**Mechanism:** Explicit instruction to walk the full DOM tree of a container and enumerate every img and background-image, including absolutely-positioned overlays.

**Why it works:** Names a specific, easy-to-miss pattern concretely enough to check for directly.

**In SiteSmith:** Carry the specific DOM-tree-walk check into SiteSmith's asset-extraction step verbatim.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:51-55,298,452` | low | 0.65 | confirmed | Asserted only |

Failure modes:
- Covers image layering only, not layered CSS effects without an img tag

### ai-website-cloner-template/multi-platform-single-source-sync — `reject`

**Solves:** Supporting 13 different AI agent platforms with native instruction formats would mean hand-maintaining 13 near-duplicate files.

**Mechanism:** Two single-source files (AGENTS.md, SKILL.md) plus two regeneration scripts producing 4 and 9 generated platform files respectively, with an @file import syntax resolved at generation time.

**Why it works:** Treats platform config as a generated build artifact rather than hand-maintained parallel copies, eliminating drift by construction.

**In SiteSmith:** Not applicable to the current rebuild goal; revisit only if SiteSmith is ever repackaged for multi-platform distribution, with a CI staleness check added.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `AGENTS.md; scripts/sync-agent-rules.sh:1-70; scripts/sync-skills.mjs:1-113` | low | 0.55 | unchallenged | No automated test suite for the sync scripts themselves |

Failure modes:
- No CI check that generated files are current
- CHANGELOG 0.3.1 documents this exact staleness class already breaking once (CRLF import resolution failure on Windows)

Conflicts: Not applicable: SiteSmith is being unified into one skill for this project's own tool trio, not distributed as a 13-platform template

### ai-website-cloner-template/named-failure-log — `adopt`

**Solves:** Generic 'be careful' guidance doesn't transfer lessons from actual past mistakes.

**Mechanism:** 12-item 'What NOT to Do' list framed explicitly as lessons from previous failed clones, each costing hours of rework.

**Why it works:** Names specific, concrete observed failures rather than an abstract principle — same technique as frontend-design's named-cliché list.

**In SiteSmith:** Keep a similarly concrete failure list for SiteSmith's audit step, treated explicitly as a living document.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:446-462` | low | 0.6 | unchallenged | Asserted only |

Failure modes:
- No mechanism actually captures and appends new failures; frozen at whatever was known when last edited

### ai-website-cloner-template/no-guessing-completeness-mandate — `adopt`

**Solves:** A builder given an incomplete spec fills gaps by invisible guessing.

**Mechanism:** States: if a builder has to guess anything, extraction has already failed — extract one more property rather than ship incomplete.

**Why it works:** Names the actual failure condition concretely rather than a vague 'be thorough' instruction.

**In SiteSmith:** Reuse as a self-check question at the end of SiteSmith's audit-extraction step.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:39-41` | low | 0.6 | confirmed | Asserted only |

Failure modes:
- Self-applied, no external check that guessing was avoided

### ai-website-cloner-template/pre-dispatch-checklist-gate — `adopt`

**Solves:** Without an explicit stopping point, extraction can feel 'done enough' and dispatch happens on an incomplete spec.

**Mechanism:** 9-item checklist that must be fully satisfied before any builder is dispatched.

**Why it works:** Consolidates scattered completeness requirements into one checkable moment, restated as yes/no items.

**In SiteSmith:** Reuse the pattern of one explicit pre-handoff checklist, re-derived for whatever SiteSmith's audit step hands off.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:431-444` | low | 0.6 | unchallenged | Asserted only, though each item is individually checkable in principle |

Failure modes:
- Self-applied and self-graded; nothing confirms it was actually run item-by-item

### ai-website-cloner-template/scope-defaults-block — `adopt`

**Solves:** Ambiguous fidelity/scope forces either a clarifying question every time or silent scope drift.

**Mechanism:** States explicit default fidelity level and in/out-of-scope lists up front, overridable by the user's own instructions.

**Why it works:** Converts an implicit assumption into an explicit, overridable statement without a Q&A round trip.

**In SiteSmith:** Give SiteSmith's audit entry point the same default-fidelity/scope block, overridable by user words.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:16-25` | low | 0.6 | confirmed | Asserted only |

Failure modes:
- Users who don't read defaults may be surprised by silent exclusions

### ai-website-cloner-template/spec-file-inline-only-contract — `adopt`

**Solves:** A builder told to consult a referenced doc either doesn't read it or the reference drifts; a builder given a short prompt guesses to fill gaps.

**Mechanism:** Every component gets a template-shaped spec file; its full contents, not a pointer, are pasted inline into the builder's prompt.

**Why it works:** The template forces exhaustive extraction; inlining removes any chance the builder skips a referenced file.

**In SiteSmith:** Adopt persistent template-shaped spec artifacts, always inlined in full, for any SiteSmith handoff step.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:110-118,302-375,385-390,456,462` | medium | 0.75 | unchallenged | Asserted for 'no guessing'; the template structure itself is checkable |

Failure modes:
- Nothing enforces the inlined copy stays identical to the file on disk if either is edited later

### ai-website-cloner-template/tool-agnostic-preflight-detection — `adopt`

**Solves:** Hard-coding one browser-automation tool breaks in any environment with a different one.

**Mechanism:** Detects any of several browser MCP tools, prefers Chrome MCP, asks the user how to connect one if none found.

**Why it works:** Detect-and-degrade beats hard dependency; explicit ask avoids silent failure.

**In SiteSmith:** Apply the same detect-preferred-then-ask pattern to SiteSmith's audit step.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:29` | low | 0.65 | confirmed | Asserted only |

Failure modes:
- Fixed tool-name list will go stale as new MCPs appear

### ai-website-cloner-template/visual-qa-diff-unmeasured — `reject`

**Solves:** Nominally, confirming the finished rebuild matches the source.

**Mechanism:** Side-by-side screenshot comparison at two viewports, narrated section by section; discrepancies traced to spec-wrong or builder-deviated and fixed accordingly.

**Why it works:** It doesn't measure anything — same self-graded shape as frontend-design's critique loop, applied to fidelity instead of originality.

**In SiteSmith:** Do not adopt as SiteSmith's fidelity gate; use an actual measured comparison (structural CSS/DOM diff or a real perceptual-diff tool) instead.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:415-429` | low | 0.75 | unchallenged | Asserted only — confirmed by direct inspection, no diff-computing script exists anywhere in the repo |

Failure modes:
- No pixel-diff tool, similarity score, or threshold anywhere in the repo
- Upstream extraction rigor creates a false impression the whole pipeline is measured

Conflicts: Directly violates the 'REDESIGN audits before touching, fidelity should be measured not asserted' principle this task is scoped against

### awesome-claude-code-subagents/orch-03-noun-list-antipattern — `reject`

**Solves:** N/A -- this is a negative example, not a mechanism to adopt.

**Mechanism:** Long bullet lists of nouns with no concrete technique, threshold, or worked example, plus a mandatory first step of querying a 'context-manager' subagent.

**Why it works:** It doesn't -- this is exactly the token-heavy, decision-in-a-list shape that the 55-line frontend-design skill beat 59-40. Cited as evidence, not adopted.

**In SiteSmith:** none

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `categories/01-core-development/ui-designer.md:12-172` | high | 0.9 | unchallenged | N/A |

Failure modes:
- Padding masquerading as expertise
- Hard dependency on a non-existent subagent for context gathering

Conflicts: Directly contradicts the frontend-design vs SiteSmith measured result

### awesome-claude-code-subagents/orch-09-design-bridge-checklist — `investigate`

**Solves:** Faithfully matching a specific existing product/brand's look when a brief explicitly asks to emulate it, without guessing at missing details.

**Mechanism:** Fixed extraction checklist run before any implementation: visual theme/atmosphere, colour palette with named roles + hover/active states, typography rules, component stylings, layout/spacing rules, elevation/shadow system, responsive breakpoints. Treats a missing category as a question to ask, not an assumption to invent.

**Why it works:** Grounds a 'match this brand' brief in a specific external reference rather than the model's internal default aesthetic -- the checklist shape (not the tool) is what's portable.

**In SiteSmith:** Optional pre-generation step, own wording only: when a brief names a specific site/brand to emulate, extract these categories from what's actually observable before writing code; ask rather than invent for anything not observed.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `categories/01-core-development/design-bridge.md:46-55,83-90` | low | 0.5 | refuted | Give the brief a named reference site and confirm the extracted checklist has no invented/guessed values in categories not actually observed. |

Failure modes:
- Source depends on an external repo SiteSmith does not have and should not assume exists
- Multi-agent JSON handoff protocol around the checklist is not portable and must be dropped

> Downgraded to investigate: the red team refuted the claim as stated. Re-read the source before adopting.

### before-implementing/blindspot-pass — `adopt`

**Solves:** Constraints or failure modes nobody has considered yet, which asking about known unknowns will never surface.

**Mechanism:** Before interviewing, search relevant docs/source/tests — including documented limits and failure modes of load-bearing dependencies — for risks that could materially change the plan; output a ranked list with why-it-matters/evidence/cheap-resolution/decision-owner.

**Why it works:** Directly operationalizes 'investigate-before-asking' — the clearest match to the requester's contract term. Bounded to unfamiliar-domain/high-stakes work so it doesn't fire on trivial tasks.

**In SiteSmith:** Bounded pre-build check: scan named platform/CMS/library docs for hard constraints, triggered only when the brief names an unfamiliar target.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `plugins/grill-for-unknowns/SKILL.md:134-155` | medium | 0.75 | confirmed | Point at a brief involving an unfamiliar CMS/integration; confirm it surfaces a documented limit before asking the user anything. |

Failure modes:
- Can become an unbounded research spiral without the stated trigger condition limiting when it runs

Conflicts: None found

### before-implementing/blocking-question-template-with-budget — `investigate`

**Solves:** Agents that grill relentlessly exhaust the user, or ask vague/unanswerable questions like 'what does modern mean to you?'

**Mechanism:** Every question must be material, grounded, and answerable, delivered via a template (question/why it matters/evidence/recommended default); ~5-question budget; fatigue valve stops interviewing on short/impatient answers and batches remaining unknowns as one assumptions list; ban on asking users to verbalize taste they can only recognize when shown.

**Why it works:** The package's own CHANGELOG documents this as a deliberate 0.1.2 fix for real user-exhaustion feedback — a tested fix, not a speculative addition. Stays on the thinking side of Fact 1 since the quality bar is a judgment criterion, not a script.

**In SiteSmith:** Question-quality bar and fatigue valve become the intake gate's only question-asking rule, replacing open-ended 'anything else?' prompting.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `plugins/grill-for-unknowns/SKILL.md:92-126` | low | 0.8 | refuted | Run a session with one-word answers twice in a row; confirm the agent stops asking and presents one batched assumptions list. |

Failure modes:
- Budget/fatigue valve is advisory text; without an explicit counter an agent can drift past 5 questions unnoticed

Conflicts: None — reinforces Magnus's 'Beslut, spørg ikke' house rule

> Downgraded to investigate: the red team refuted the claim as stated. Re-read the source before adopting.

### before-implementing/calibration-over-under-constrain — `adopt`

**Solves:** Over-specified plans make the agent follow instructions even when a pivot is better; under-specified plans make it default to generic best practices.

**Mechanism:** One paragraph naming both failure directions and their fix: define goal/constraints/stop-continue rules but leave room for judgment; provide references/taste-examples/acceptance-criteria against under-specifying.

**Why it works:** A near-exact post-hoc explanation of both of SiteSmith's own measured failures at once — under-constraining plausibly produced house-style convergence, over-constraining plausibly produced the loss to the 55-line skill. Extremely cheap, extremely high signal.

**In SiteSmith:** State this calibration paragraph near the top of the rebuilt skill as an explicit editorial principle for every future addition.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `plugins/grill-for-unknowns/SKILL.md:213-216` | low | 0.75 | unchallenged | Audit whether new instructions each state a constraint+goal or instead dictate a specific rendered answer. |

Failure modes:
- Doesn't self-enforce as a one-paragraph principle; needs a concrete review step to actually bite

Conflicts: None; resolves the tension the task brief poses between the two measured facts

### before-implementing/deviation-policy — `adopt`

**Solves:** Mid-build, reality contradicts the plan and the agent either barrels ahead wrongly or halts on every tiny surprise.

**Mechanism:** Three-way rule: low-risk/local issues get a conservative choice, logged, and continue; architecture/data/security/cost/user-facing changes stop and ask; docs contradicting the plan win over the original plan.

**Why it works:** A short, three-branch judgment rule — cheap, and the model reasoning about risk level rather than a table mapping situations to actions. Matches 'stop-on-invalidated-assumption' precisely.

**In SiteSmith:** Same three-branch rule: silently substitute-and-log for invisible/internal surprises, stop-and-ask for anything changing the visible design or brand promise.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `plugins/grill-for-unknowns/SKILL.md:182-186` | low | 0.7 | unchallenged | Inject a mid-build contradiction; confirm the agent stops for a user-facing change but substitutes-and-logs for a low-risk internal one. |

Failure modes:
- 'Low-risk and local' is a judgment call; without examples an agent may misjudge a user-facing visual change as local

Conflicts: None; complements Magnus's 'default to fix, not diagnose' house rule

### before-implementing/domain-modeling-context-adr — `adapt`

**Solves:** Vocabulary drift and undocumented hard-to-reverse decisions confusing future readers.

**Mechanism:** Lazily-created CONTEXT.md glossary of canonical terms with an 'Avoid' field; offer an ADR only when a decision is hard to reverse, surprising without context, and a real trade-off.

**Why it works:** Cheap when actually lazy; becomes overhead if applied to every small build. The three-part ADR gate is a good judgment rule, but the file infrastructure only pays for its cost on multi-page or long-lived builds.

**In SiteSmith:** Keep the ADR gate as a judgment rule for the SiteSmith rebuild's own engineering decisions; do not generate CONTEXT.md/ADR files in the standard single-site build flow.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `plugins/grill-for-unknowns/SKILL.md:128-132; references/domain-modeling-add-on.md:1-95` | medium | 0.55 | confirmed | Run a one-page build and a multi-page build; confirm files are created in proportion to actual complexity, not by default. |

Failure modes:
- Creating CONTEXT.md/ADR files by default for every build reintroduces the file-sprawl that already lost once

Conflicts: Fact 1 directly, if applied unconditionally

### before-implementing/four-quadrant-unknowns-taxonomy — `adopt`

**Solves:** An agent treats all uncertainty the same way (ask a question), when some is a fact to look up, some is unverbalized taste, and some is an unnamed risk.

**Mechanism:** Classify gaps into known-knowns (cite/restate), known-unknowns (ask or default), unknown-knowns (resolve via prototypes/contrasting references, not questions), and unknown-unknowns (resolve via a blindspot pass over docs/source/tests).

**Why it works:** Pure thinking-mechanism, one short table, no external lookup. Maps directly onto the showcase 0/8 failure: convergence is the signature of an agent that only handles known-unknowns and silently defaults on unknown-knowns instead of routing them to prototypes/contrast.

**In SiteSmith:** Quadrant table in intake instructions, with the unknown-knowns row routing to 'produce 2-3 contrasting layout/style directions, do not silently pick one'.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `plugins/grill-for-unknowns/SKILL.md:65-74` | low | 0.85 | confirmed | Feed three unrelated site briefs; confirm the unknown-knowns branch produces 2-3 contrasting directions per brief rather than one default per brief. |

Failure modes:
- Classifying everything as known-unknown anyway if not enforced with a concrete routing rule per quadrant

Conflicts: None found

### before-implementing/launch-packet-role-split — `adapt`

**Solves:** Spawning a subagent with an underspecified prompt so it re-derives context badly or misses taste work already done.

**Mechanism:** Assemble a launch packet (goal, map, territory to inspect, unknowns categories, deviation policy, verification gates); split roles across docs scout, codebase scout, prototype scout (exposes unknown-knowns), implementer, reviewer.

**Why it works:** The prototype-scout role is the fan-out equivalent of the unknown-knowns mechanism, applied to a multi-agent architecture — directly relevant to fanning out a build without losing taste-extraction.

**In SiteSmith:** Fold the prototype-scout concept into existing context-diamond fan-out rather than adding a second protocol; keep launch-packet fields as the minimum context a spawned worker needs.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `plugins/grill-for-unknowns/SKILL.md:201-211; templates/launch-packet.md` | medium | 0.55 | unchallenged | Spawn a prototype-scout-equivalent worker with only its launch packet; confirm it produces contrasting directions without re-asking resolved questions. |

Failure modes:
- Five distinct roles for every build is overkill for a single landing page

Conflicts: context-diamond skill's own fan-out procedure — should be reconciled, not run side by side as a second competing protocol

### before-implementing/map-vs-territory-framing — `adopt`

**Solves:** Agent conflates its internal model of the problem with the actual codebase/product/constraints and never notices the gap.

**Mechanism:** Name the two things separately — 'the map' (prompt, plan, assumptions) vs 'the territory' (real codebase, constraints, docs, user taste, failure modes) — so 'unknowns' has a crisp definition: the gap between them.

**Why it works:** One paragraph, zero lookup tables, purely a naming device that primes checking assumptions against reality before acting — cheapest possible thinking aid, squarely on the winning side of Fact 1.

**In SiteSmith:** One line in system framing: 'the brief is the map, live constraints are the territory — check the gap before designing.'

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `plugins/grill-for-unknowns/SKILL.md:19-21` | low | 0.7 | confirmed | Not independently testable; test via the mechanisms that operationalize it. |

Failure modes:
- Framing without a concrete follow-up action is just vocabulary with no behavior change

Conflicts: None found

### before-implementing/post-implementation-explainer — `adapt`

**Solves:** A reviewer receiving a finished build with no record of what was decided, assumed, or verified.

**Mechanism:** After implementation: what changed and why, which unknowns were resolved, which assumptions remain, docs/source evidence, real verification results, and for complex work a quiz/checklist answerable from the report itself.

**Why it works:** Cheap summary discipline; the 'answerable from the report' rule is a good self-check against padding, but the quiz format only pays off on complex/reviewed work.

**In SiteSmith:** Keep the summary (changed/assumed/verified) as the standard build report; drop the formal quiz format entirely.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `plugins/grill-for-unknowns/SKILL.md:188-199` | low | 0.6 | unchallenged | Check that a completed build's report states real verification results, not just an assertion that things work. |

Failure modes:
- Producing a formal quiz for a trivial one-page site is pure padding, the opposite of Fact 1's terse-and-effective lesson

Conflicts: Magnus's ADHD-reader house format (conclusion-first, max 5 bullets) is a better fit than a formal quiz

### before-implementing/self-contained-packaging-lesson — `adopt`

**Solves:** A skill silently depending on other skills being installed gives almost nothing to an agent that only loads the headline file.

**Mechanism:** grill-with-docs (upstream) depended on two other skills; grill-for-unknowns inlines the grilling loop and domain-modeling rules so the whole behavior ships in one self-contained file.

**Why it works:** A packaging lesson, not a runtime mechanism, but direct first-party evidence for this rebuild's own stated goal of one unified skill — an unrelated author independently reached the same conclusion after shipping the fragmented version first.

**In SiteSmith:** Keep the core loop (question bar, unknowns routing, deviation policy, calibration principle) inline in the single SKILL.md; reference files only for material genuinely out of the hot path.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `README.md:159-165; plugins/grill-for-unknowns/references/upstream-lineage.md:51-57` | low | 0.7 | unchallenged | Load only the top-level SKILL.md with no reference files present; confirm the core behavior is still present, not just referenced. |

Failure modes:
- A single file that then requires several external reference files to be read 'first' for basic behavior recreates the same failure under a different layout

Conflicts: None; corroborating evidence for the rebuild's own architecture

### before-implementing/unknown-knowns-prototypes — `adopt`

**Solves:** The user has taste they recognize when shown but can't specify up front; asking them to verbalize it drives a generic default.

**Mechanism:** Ban asking the user to verbalize unshowable taste; build cheap prototypes with genuinely contrasting directions (not tiny variations), or point to in-repo/external references and ask which to match, then distill the reaction into a rubric that becomes the verification gate.

**Why it works:** The mechanism most directly aimed at SiteSmith's own measured failure — showcase 0/8 house-style convergence. Cheap (a short instruction, not a style lookup table), so it improves thinking without adding a fixed decision table — wins on both measured facts at once.

**In SiteSmith:** Required step before layout/style commitment: propose 2-3 contrasting directions per brief; never silently default to one look without a captured user-reaction rubric.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `plugins/grill-for-unknowns/SKILL.md:104,157-165` | low | 0.85 | confirmed | Re-run the three briefs that previously converged; confirm intake proposes 2-3 visually distinct directions before committing to one. |

Failure modes:
- 'Contrasting directions' can become superficial (same layout, different color) if 'meaningful contrast' is not enforced

Conflicts: None found

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

### graph-engineering/orch-04-fresh-context-review — `investigate`

**Solves:** A model reviewing its own freshly-written output in the same context misses most of its own mistakes.

**Mechanism:** Verify in a separate context from the one that produced the work -- even without any other agent or fleet, a second pass with no memory of writing the code catches errors a same-context self-review does not.

**Why it works:** Cited from a controlled multi-agent study (DeepMind x MIT, 180 configs) but the specific claim about self-grading blindness is agent-count-independent: it is about context continuity, not fleet size.

**In SiteSmith:** Run the audit/finish-gate step as a fresh invocation with only the rendered output as input, not appended to the generation transcript.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `graph-engineering/references/task-graphs.md:40-44` | low | 0.6 | refuted | Compare defect catch-rate of same-context self-review vs a fresh-context re-read on the same generated page. |

Failure modes:
- Easy to accidentally carry over context and lose the benefit
- Not a substitute for scripts/verify.mjs's objective checks

Conflicts: The diamond/fan-out framing this point is embedded in is out of scope

> Downgraded to investigate: the red team refuted the claim as stated. Re-read the source before adopting.

### graph-engineering/orch-05-diamond-fanout-pattern — `reject`

**Solves:** Coordinating independent work across multiple agents (research, drafting, verification) in a fleet.

**Mechanism:** Split independent work into parallel workers, verify in a separate context per worker, merge under one owner; the 'stop rule' says only split work whose pieces never read each other's results.

**Why it works:** Valid mechanism for genuine multi-agent fleets; irrelevant to a single skill invoked once per site build, and duplicates the project's own context-diamond skill.

**In SiteSmith:** none

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `graph-engineering/references/task-graphs.md:30-59` | high | 0.85 | unchallenged | N/A |

Failure modes:
- Orchestration overhead with no fleet to coordinate

Conflicts: Already implemented by this project's context-diamond skill; nothing new to import even if in scope

### graph-engineering/orch-11-graph-engineering-kg-pipeline — `reject`

**Solves:** Building knowledge graphs (ontology, entity/relation/event extraction, fusion, GraphRAG serving) as agent memory.

**Mechanism:** 9-stage pipeline for turning text into a queryable knowledge graph.

**Why it works:** Not applicable -- a website-building skill has no entities/relations/events to extract, model, or fuse.

**In SiteSmith:** none

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `graph-engineering/SKILL.md:11-15,44-102` | low | 0.95 | unchallenged | N/A |

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

### magic-21st/magic-21st-hosted-proxy — `reject`

**Solves:** Backward compatibility for old MCP configs after the service moved to a paid hosted endpoint.

**Mechanism:** A ~220-line stdio-to-HTTP relay with no component data, generation logic, or registry present locally.

**Why it works:** n/a — no mechanism to evaluate; the real capability is invisible, behind the remote paid endpoint.

**In SiteSmith:** No role in SiteSmith.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `src/index.ts:1-16,118-153; README.md:1-3` | low | 0.95 | unchallenged | n/a |

Failure modes:
- Total dependency on a paid third-party service with no local fallback
- Latches into permanent failure after one 401

Conflicts: Any offline, license-clean, redistributable design principle

### ponytail/cross-platform-portability-plumbing — `reject`

**Solves:** Getting one ruleset in front of ~20 different agent hosts.

**Mechanism:** 13 near-duplicate copies of the same ruleset text across per-host rule files and plugin manifests, synced only by a CI drift-checker comparing 7 files byte-for-byte plus 8 invariant substrings.

**Why it works:** Works for an open-source project targeting every agent host; irrelevant to a single-platform skill.

**In SiteSmith:** N/A — do not add per-platform adapters SiteSmith doesn't target; the drift-check *technique* (canary substrings) is reusable if ever needed, the 13-copy structure is not.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `README.md:108-271; 13 adapter directories at repo root` | high | 0.75 | unchallenged | `check-rule-copies.js`: byte-equality + 8 invariant substring checks |

Failure modes:
- Duplication is self-inflicted complexity that then requires a drift-detector to manage
- Canary-substring check can miss drift that doesn't touch a chosen phrase

Conflicts: Directly conflicts with proportionality: SiteSmith targets one platform, replicating this would reintroduce unrequested scope

### ponytail/explicit-never-simplify-carveouts — `adopt`

**Solves:** A bare 'write less' instruction cuts validation/security/accessibility along with real bloat.

**Mechanism:** Named exception list in the same file as the ladder: never cut trust-boundary validation, data-loss error handling, security, accessibility, or explicit requests.

**Why it works:** Exception is co-located with the instruction it limits rather than trusting inference.

**In SiteSmith:** Pair any SiteSmith simplicity instruction with a named never-cut list (accessibility, responsive correctness, semantic HTML) in the same breath.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/ponytail/SKILL.md:90-105` | low | 0.85 | confirmed | Adversarial exploit scripts executed against produced functions in the safety tier |

Failure modes:
- Finite named list; categories not listed have no equivalent protection

### ponytail/honest-benchmark-correction — `adopt`

**Solves:** Inflated published numbers tend to survive even after being shown flawed.

**Mechanism:** Publishes the original inflated number, names the critique that found the flaw (chatty bare-model baseline), rebuilds against a fair baseline, publishes the corrected smaller number next to the original with the correction explicit; also documents catching its own contamination bug (hook firing on baseline arm) mid-project.

**Why it works:** Process discipline: keep the uncomfortable number visible and explain why the old one was wrong, don't quietly delete it.

**In SiteSmith:** When SiteSmith publishes any benchmark, keep prior numbers visible and name the flaw a critique found rather than replacing the claim silently.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `benchmarks/results/2026-06-18-agentic.md:1-24,40-47,200-212` | low | 0.7 | confirmed | Per-arm process isolation (--setting-sources, --plugin-dir) plus per-task tables so aggregates can't hide outliers |

Failure modes:
- Correction was manual/issue-driven, nothing self-triggers a re-audit on the next critique

### ponytail/self-validating-llm-judge — `adopt`

**Solves:** An unvalidated LLM judge for a non-deterministic quality axis (over-engineering) is an opinion, not evidence.

**Mechanism:** Fixed judge model at temp 0, published rubric, must rank a known-over-engineered reference above a known-minimal one before any real run is scored; refuses to run if it can't.

**Why it works:** Gates the judge's own discriminating power before trusting its verdict on ambiguous real cases.

**In SiteSmith:** Build a self-validating judge for SiteSmith's house-style/genericness problem: must rank a templated reference below a distinctive one before scoring real builds.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `benchmarks/agentic/judge.py:28-39,89-137` | medium | 0.75 | confirmed | `judge.py --selftest` pass/fail gate before `--run` proceeds |

Failure modes:
- Reference pairs are hand-written by the same team, so selftest could pass without real-world reliability
- Judge could drift version-to-version between runs

### ponytail/seven-rung-simplicity-ladder — `adopt`

**Solves:** Agents default to writing new code before checking cheaper layers exist (existing code, stdlib, native feature).

**Mechanism:** 7-step ordered checklist run before writing code: YAGNI, reuse, stdlib, native, installed dep, one-line, minimum code — explicitly run after understanding the problem, not instead of it.

**Why it works:** Pure prose reasoning scaffolding the model applies with judgment, not a mechanical classifier.

**In SiteSmith:** Add a short prose reasoning ladder to SiteSmith's build phase; never convert to a routing script.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/ponytail/SKILL.md:32-48` | low | 0.8 | confirmed | Agentic benchmark: real Claude Code sessions, git-diff LOC, n=4/cell |

Failure modes:
- Model can skip the ladder under pressure since it's prompt-only, not enforced
- Rung 2 requires an actual codebase search a model might skip

Conflicts: A mechanical script implementing the same ladder would violate the no-mechanical-creativity constraint

### remotion-skills/remotion-embedded-skill-duplication — `reject`

**Solves:** A sub-skill needs to be reachable both standalone and nested inside a router skill, without the harness double-registering it.

**Mechanism:** Dev-time symlinking of sub-skill folders into the parent, plus a publish-time rename of the embedded copy's SKILL.md to REFERENCE.md and link rewriting.

**Why it works:** Solves a real problem, but only the problem a multi-skill monorepo has; verified via git ls-tree that what ships is physical duplicate trees (not symlinks), and a repo-wide md5sum pass found 83 files sharing only 62 unique hashes.

**In SiteSmith:** Do not adopt the symlink+rename+duplicate pipeline; only the router idea (separate mechanism) is worth keeping.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `scripts/sync-embedded-skills.ts:37-90; scripts/prepare-embedded-skills.ts:78-110` | high | 0.85 | unchallenged | n/a for a single-skill target |

Failure modes:
- Drift between canonical and embedded copies if sync script is skipped
- Triple-copy nesting (remotion-maps appears 3 times in this checkout)

Conflicts: SiteSmith is one skill; the double-registration problem this solves does not exist for a single-skill package.

### remotion-skills/remotion-router-skill — `investigate`

**Solves:** A body of knowledge too large to load in full needs to be reachable without bloating every invocation.

**Mechanism:** One short SKILL.md (48 lines), a one-paragraph-per-topic table of contents, each a relative markdown link to that topic's own entry file, loaded only when relevant.

**Why it works:** Same shape as the 55-line frontend-design file that beat SiteSmith's 630k-token package: small root, expand only on need.

**In SiteSmith:** SiteSmith's SKILL.md should stay a short entry point linking to on-demand reference files, treating the 500-line cap as router-file discipline, not just a size limit.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/remotion-best-practices/SKILL.md:9-47` | low | 0.85 | refuted | Link-validation script in CI confirming every router entry resolves. |

Failure modes:
- Router entries go stale if a linked file moves and the link isn't updated

> Downgraded to investigate: the red team refuted the claim as stated. Re-read the source before adopting.

### remotion-skills/remotion-technique-independence — `adopt`

**Solves:** Multiple mutually-exclusive implementation techniques for the same feature need presenting without forcing the model to load all of them.

**Mechanism:** Instructs the model to select exactly one technique matching the brief and load only that technique's own doc; each technique directory is a stated-independent, individually removable unit.

**Why it works:** A genuine one-of-N judgement call left to the model, not a script pre-selecting for it.

**In SiteSmith:** For any SiteSmith topic with mutually exclusive implementation paths, use 'pick exactly one, load only that one, each independently removable' instead of one file covering all options.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/remotion-best-practices/remotion-maps/REFERENCE.md:9-10` | low | 0.75 | confirmed | Delete one technique directory; confirm the others still resolve. |

Failure modes:
- None specific; risk shifts to whether technique docs are actually independent

### ruflo/orch-07-ruflo-swarm-platform — `reject`

**Solves:** Coordinated multi-agent swarms, persistent semantic memory, learned model routing, and plugin ecosystem for large multi-session engineering work.

**Mechanism:** npm package 'claude-flow': hierarchical/mesh agent swarms with 60+ specialized agents, 314 MCP tools, a 3-tier deterministic->Haiku->Sonnet/Opus router, 30+ plugins.

**Why it works:** Genuinely built for large, multi-agent, multi-session engineering platforms. Its own SKILL.md explicitly disclaims one-shot/single-agent use.

**In SiteSmith:** none

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:8-21,36-47; package.json:9` | high | 0.95 | unchallenged | N/A |

Failure modes:
- Orchestration overhead the source itself warns against for this exact use case

Conflicts: Self-disclaiming: SKILL.md:21 rules out the SiteSmith use case in the source's own words

### ruflo/orch-08-ruflo-vector-memory — `reject`

**Solves:** Cross-session recall of what an agent previously did/decided, via HNSW-indexed semantic vector memory.

**Mechanism:** mcp__claude-flow__memory_* tools store and semantically retrieve prior decisions/patterns across sessions.

**Why it works:** Sounds attractive as 'don't repeat mistakes,' but for a design tool it means letting past design choices leak into unrelated new briefs -- the same mechanism class implicated in SiteSmith's own measured house-style convergence.

**In SiteSmith:** none

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `SKILL.md:15,40` | high | 0.7 | unchallenged | N/A -- reasoned rejection, not empirically tested here. |

Failure modes:
- Cross-project memory becomes an implicit house-style engine

Conflicts: Directly conflicts with the showcase 0/8 finding this rebuild is meant to fix

### scroll-world/blob-seek-scrubbing — `adopt`

**Solves:** Setting video.currentTime from scroll silently fails on hosts without HTTP byte-range support: seekable pins to [0,0] and every seek clamps to frame 0.

**Mechanism:** loadClip() fetches each clip via fetch().then(blob) and plays it from URL.createObjectURL(blob) instead of a direct network src.

**Why it works:** Sidesteps the root cause (server range support) entirely by scrubbing an in-memory object; this is why all-intra encoding is unnecessary.

**In SiteSmith:** Standard technique for any SiteSmith build scrubbing video by scroll position: fetch-to-blob before scrubbing, assume static-host byte-range gaps by default.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/scroll-world/references/scrub-engine.js:198-220; skills/scroll-world/SKILL.md:528-534` | low | 0.85 | confirmed | Asserted only; well-known browser behavior, independently verifiable. |

Failure modes:
- Loads whole clip into memory before scrubbable — fine for short clips, wouldn't scale to long-form video.
- Silent catch on fetch failure permanently skips that clip for the session.

### scroll-world/border-flood-fill-knockout — `reject`

**Solves:** Removing a flat background from a still while preserving interior regions that happen to match the background colour.

**Mechanism:** Samples corner pixels as background colour, flood-fills from the image border inward within an RGB-distance tolerance, so only border-connected pixels are knocked out; blurs the alpha mask edge.

**Why it works:** Border-connectivity is correct for this pipeline's exact 'floating island on solid background' framing — a small, correctly-scoped algorithm, not a general background remover.

**In SiteSmith:** No current SiteSmith use case — serves the AI-diorama pipeline's own visual convention, which SiteSmith isn't adopting. Revisit only if a specific feature needs solid-background cutout.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/scroll-world/references/knockout.py:1-89` | low | 0.4 | unchallenged | None automated; visual inspection only. |

Failure modes:
- Tolerance-based matching can eat into subject pixels near the background colour.
- Assumes a genuinely flat corner-sampled background; fails silently on gradient/textured backgrounds.

### scroll-world/budget-before-spend-gate — `reject`

**Solves:** Metered, real-money generation needs informed user consent on cost before rendering, since mid-run failure is recoverable but ugly.

**Mechanism:** Presents render tiers with a cost table, computes an estimated total from actual scene count/mobile choice, calibrates against live balance, requires explicit go-ahead.

**Why it works:** State the number, get consent, then act — sound wherever an action has irreversible metered cost.

**In SiteSmith:** No coherent role in SiteSmith today. Revisit only if a paid generation backend is wired in as a build-time dependency.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/scroll-world/SKILL.md:151-198` | low | 0.3 | unchallenged | Asserted only. |

Failure modes:
- No analogue at all when there is no paid, metered generation step in the build.

Conflicts: Conflicts with SiteSmith's current scope: no metered paid-generation backend exists to protect against.

### scroll-world/capability-gate-before-commit — `adapt`

**Solves:** Silently substituting an incompatible tool/model for a user's stated preference produces a broken result without explanation.

**Mechanism:** States the selection rule as a hard capability check, directing that an out-of-roster request be declined with a one-line reason rather than silently substituted.

**Why it works:** Fail-loud-with-reason beats silent substitution or silent failure.

**In SiteSmith:** General engineering discipline, not a discrete feature: verify a requested library/API/font actually supports the plan before committing, say so if not. Low priority to formalize.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/scroll-world/SKILL.md:200-203,278-297` | low | 0.4 | unchallenged | Asserted only; no automated check in-repo. |

Failure modes:
- Entirely dependent on a capability-introspection command existing for the tool in question.

### scroll-world/css-layer-theme-override — `adopt`

**Solves:** A component injecting default CSS custom properties needs a host page's own theme rules to win without predicting every selector or using !important.

**Mechanism:** The engine's injected stylesheet is wrapped in @layer sw; unlayered page CSS always outranks @layer-wrapped CSS regardless of specificity or order.

**Why it works:** Native platform feature doing what a specificity hack would otherwise require, order-independent.

**In SiteSmith:** Wrap any SiteSmith-authored component's default CSS custom properties in @layer, leave host page theme rules unlayered.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/scroll-world/references/scrub-engine.js:438-444` | low | 0.7 | confirmed | None automated; a verifiable CSS-cascade fact. |

Failure modes:
- No fallback noted for browsers without @layer support.

### scroll-world/distance-based-seam-crossfade — `adopt`

**Solves:** Even frame-matched clip boundaries need a visual handoff rather than an instantaneous cut between video elements.

**Mechanism:** read() computes pixel distance to each segment's start/end and maps it through a smoothstep to set opacity/z-index, cross-dissolving over a configurable crossfade band around each seam.

**Why it works:** A short dissolve masks small residual mismatch at a seam without requiring perfect asset continuity; complements frame-matching rather than replacing it.

**In SiteSmith:** Generic rule for SiteSmith: any two adjacent scroll-bound media segments cross-dissolve over N vh at their shared boundary, regardless of media source.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/scroll-world/references/scrub-engine.js:222-242` | low | 0.75 | confirmed | None automated; verified by eye per the source's own QA step. |

Failure modes:
- Content-agnostic — will mask a genuinely mismatched pair of clips just as readily as a well-matched one.

### scroll-world/frame-identical-seam-chaining — `reject`

**Solves:** Two independently-generated video clips meant to connect won't visually match because every generation renders slightly differently.

**Mechanism:** Requires a connector's conditioning images be the ACTUAL last/first frame extracted from already-rendered neighbouring clips, never the original source still, so seams are frame-identical by construction.

**Why it works:** A generalizable idea (condition on your own actual prior output, not the original input, to prevent drift across a generative chain) but only actionable with a generative backend that supports image conditioning.

**In SiteSmith:** Not applicable to SiteSmith today. The abstract idea (condition on actual own output, not original input) is worth remembering but has no concrete SiteSmith use case.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/scroll-world/SKILL.md:467-520; skills/scroll-world/references/pipeline.md:85-117` | medium | 0.3 | unchallenged | Manual screenshot diffing; no automated frame-comparison tool ships in the repo. |

Failure modes:
- Zero applicability without a generative video backend — there is no 'next frame' to extract when clips aren't generated in a chain.

Conflicts: SiteSmith has no generative video backend, so there is no chain to keep frame-identical.

### scroll-world/linger-ease-pacing — `adopt`

**Solves:** A linear scroll-to-time mapping gives no way to make a scene's best/most narratively important frame coincide with the moment its copy peaks.

**Mechanism:** lingerEase(x, L) is a monotone cubic remap that flattens the middle of a segment's range and steepens the edges as L rises, while preserving f(0)=0 and f(1)=1 exactly.

**Why it works:** A single per-section parameter changes pacing without touching the clip or breaking the seam guarantee.

**In SiteSmith:** Reusable as-is: boundary-preserving cubic ease with a single linger parameter per scroll-bound section.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/scroll-world/references/scrub-engine.js:175-178,232` | low | 0.7 | confirmed | None automated. |

Failure modes:
- L close to 1 with a short scroll distance can feel stuck; source recommends L<=0.6 but doesn't enforce it.

### scroll-world/mobile-scrub-hardening-bundle — `investigate`

**Solves:** Scroll-scrubbed video has several distinct phone failure modes: fast-flick seek pileup, iOS blank-muted-video quirk, URL-bar resize scroll jump, heavier decode budget.

**Mechanism:** Four bundled fixes behind one isMobile() check: seek-coalescing (skip re-queuing currentTime while still seeking), iOS priming (muted play/pause on first touch, wait for 'seeked' not just 'loadedmetadata'), resize-gating (ignore height-only resize on touch), coarser mobile seek epsilon.

**Why it works:** Each fix targets one concrete, named bug, independently testable and removable, matched to the source's own Gotchas list.

**In SiteSmith:** Adopt all four as a standard checklist for any SiteSmith scroll-video build; none depend on how the video was produced.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/scroll-world/references/scrub-engine.js:66-73,273-323; CSS at 413-435` | low | 0.75 | refuted | None automated; source recommends manual CPU-throttled and real-device iOS testing. |

Failure modes:
- coarse pointer check captured once at mount, never re-evaluated (acknowledged intentional).

> Downgraded to investigate: the red team refuted the claim as stated. Re-read the source before adopting.

### scroll-world/open-subject-question-not-fabricated-menu — `adapt`

**Solves:** A fabricated multiple-choice list of subjects at intake biases the user and reads as the assistant deciding their business for them.

**Mechanism:** Instructs asking the subject as an open plain-prose question, reserving structured multiple-choice for genuinely enumerable, lower-stakes choices later, always with an 'Other' escape hatch.

**Why it works:** A reasoning/prompting instruction about when structured choice helps versus constrains — the same category as the frontend-design skill's winning mechanisms.

**In SiteSmith:** Extract the general rule for SiteSmith's own interview step: ask identity-defining questions as open prose, reserve structured choice for genuinely enumerable, lower-stakes decisions with an explicit 'describe your own' option.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/scroll-world/SKILL.md:80-93` | low | 0.55 | confirmed | Asserted only. |

Failure modes:
- No mechanism verifies the model actually asked openly rather than defaulting to a menu under time pressure.

### scroll-world/progressive-disclosure-file-split — `investigate`

**Solves:** Heavy reference material inlined into a main procedure file bloats context on every invocation even for steps a build never reaches.

**Mechanism:** SKILL.md is the only always-loaded file; it names each reference file by relative path at the exact step it's needed, none pre-loaded speculatively.

**Why it works:** Matches the general skill-authoring principle of separating procedure from heavy reference data.

**In SiteSmith:** Keep the pattern but apply more strictly: move vendor-pricing/model-capability tables out of the main procedure file into a reference file.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/scroll-world/SKILL.md:752-762 and references/ file structure` | low | 0.6 | refuted | Verified directly by reading SKILL.md and confirming reference files are named only at point of use. |

Failure modes:
- SKILL.md still inlines ~150 lines of volatile vendor pricing/schema tables that belong in a deferred reference file instead.

> Downgraded to investigate: the red team refuted the claim as stated. Re-read the source before adopting.

### scroll-world/reduced-motion-full-degrade — `adopt`

**Solves:** prefers-reduced-motion should stop clip loading entirely, not just disable visible animation while still fetching/decoding video.

**Mechanism:** reduce is read once at mount; loadClip() short-circuits immediately if true, leaving only stills that cross-dissolve via the same opacity math used for seams.

**Why it works:** Full degrade at the fetch layer, not a cosmetic override — no wasted bandwidth/decode, reuses existing code paths for the fallback.

**In SiteSmith:** Gate any generated/heavy media fetch behind the same check used to gate its motion, so accessibility and 'no backend available' share one code path.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/scroll-world/references/scrub-engine.js:199-201; CSS at 436` | low | 0.7 | confirmed | None automated; testable by toggling the OS setting. |

Failure modes:
- Only triggers on OS-level preference; no separate opt-in for bandwidth/low-end-device reasons.

### scroll-world/scrub-video-encoding-recipe — `adopt`

**Solves:** Naive assumptions about scrub smoothness (all-intra encoding, quality downscaling) are backwards; the real levers are seekability and keyframe distance.

**Mechanism:** Native resolution, crf ~20, small GOP (-g 8, not all-intra), stripped audio, +faststart, light unsharp; a tighter mobile profile (-g 4, 720p, crf 23) trades keyframes for cheaper phone-decoder seeks.

**Why it works:** Ties every setting to a stated cause rather than folklore, with two calibrated presets instead of one compromise.

**In SiteSmith:** Carry as reference documentation for any SiteSmith scroll-video build regardless of asset source.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/scroll-world/SKILL.md:523-559; skills/scroll-world/references/pipeline.md:119-171` | low | 0.65 | confirmed | None automated in-repo; asserted from experience, not measured in this codebase. |

Failure modes:
- Tuned for short (5-10s) clips; not claimed to hold for longer-form video.

### scroll-world/segment-interleave-scene-model — `adopt`

**Solves:** A scroll-scrubbed multi-scene film needs a single flat timeline (scroll position -> which clip, and how far into it) built from a designer's per-section config, without hand-computing pixel ranges.

**Mechanism:** Builds a flat SEGMENTS array by walking SECTIONS and interleaving a dive segment per section with an optional conn segment between consecutive sections (skipped when connectors[i] is falsy). Each segment carries a scroll-width weight; layout() turns weights into cumulative pixel start/end offsets.

**Why it works:** Decouples 'what media exists and in what order' (editable config) from 'how much scroll height that requires' (computed) and 'what is currently active' (derived per scroll tick).

**In SiteSmith:** Reuse this shape for any SiteSmith scroll-scrubbed hero: ordered scene array with optional connector slots, flattened to a weighted timeline at layout time, independent of clip source.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/scroll-world/references/scrub-engine.js:86-101` | low | 0.8 | confirmed | No automated test in repo; correctness implied by rest of engine working. |

Failure modes:
- No validation that connectors.length === sections.length - 1; a mismatch silently misaligns connectors.

### scroll-world/single-aesthetic-camera-roster — `reject`

**Solves:** Frames 'cohesion' as fixing art direction to a small enumerated set (clay diorama/papercraft/glossy toy/claymation/neon-night) and camera behavior to a 3-way roster, reused verbatim across a build.

**Mechanism:** A shared style preamble composed once at intake is reused byte-for-byte in every scene prompt; camera behavior is selected once from a fixed roster and applied uniformly.

**Why it works:** Genuinely produces per-build cohesion, but the same mechanism shape (small fixed menu of looks reused verbatim) is what this project's own three-site convergence test flagged as a liability, just scoped to one genre instead of SiteSmith's whole output.

**In SiteSmith:** Do not adopt the fixed style-roster shape. If a scroll-cinematic capability is ever offered, treat art direction/camera behavior as brief-driven creative decisions reasoned per project, not a preset menu.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/scroll-world/SKILL.md:100-122,268-322` | low | 0.55 | unchallenged | Not tested for cross-build convergence in the source. |

Failure modes:
- Every build necessarily looks like a member of the same small family by design — no mechanism for the model to invent a genuinely novel treatment per subject.
- Two unrelated businesses choosing the same defaults converge on similar sites for structural reasons, not coincidence.

Conflicts: Directly in tension with the measured fact that a fixed-look mechanism is a liability even when each output is individually good.

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

### sitesmith-modes/animation-interruptible-and-never-blocking — `adopt`

**Solves:** Motion that owns the user: a transition that must finish before the next tap registers, or an entrance animation that swallows input for its duration.

**Mechanism:** Two rules stated as absolutes rather than preferences. 'interruptible - Animations must be interruptible; user tap/gesture cancels in-progress animation immediately' (185) and 'no-blocking-animation - Never block user input during an animation; UI must stay interactive' (186), both attributed to Apple HIG.

**Why it works:** It is an obligation about control, not about look — it constrains what motion may cost the user without saying anything about what the motion is. That makes it survivable across every visual direction, unlike the surrounding motion rules in the same section (stagger 30-50ms, exit at 60-70% of enter, press scale 0.95-1.05) which are appearance values dressed as standards.

**In SiteSmith:** Fold into SiteSmith's motion obligations alongside the existing transform/opacity-only and no-motion-between-intent-and-result rules, which govern what animates and where — neither governs whether the user can cut it short. Explicitly leave the numeric motion values in this section behind; they are house style.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `src/ui-ux-pro-max/templates/base/quick-reference.md:185-186` | low | 0.8 | unchallenged | not stated |

### sitesmith-modes/applicability-scope-notice-on-rule-blocks — `adopt`

**Solves:** A reference corpus is retrieved by keyword, so rules true in one context get pulled into a build where they are false — mobile-only rules (safe areas, haptics, bottom nav, Dynamic Type) applied to a desktop web page.

**Mechanism:** Rule blocks carry an inline applicability declaration rather than assuming universality. Line 282: 'Scope notice: The rules below are for App UI (iOS/Android/React Native/Flutter), not desktop-web interaction patterns.' Repeated verbatim above the pre-delivery checklist (347). Step 1 names the exclusions concretely up front: 'Several sections below are scoped to App UI ... safe areas, haptics, bottom nav and Dynamic Type are mobile-only concerns' (48-50).

**Why it works:** It converts a silent misapplication into a visible mismatch. The model can only decline a rule it knows the boundary of; an unscoped rule list reads as universally binding, and a keyword retriever will happily surface a Material bottom-nav rule for a marketing page. This is knowledge-injection hygiene, not decision automation — it raises the standard without prescribing output.

**In SiteSmith:** Every reference block SiteSmith loads on demand declares what it applies to (surface mode, platform, stack) in its first line, and the loader prints that line with the block. A rule cited in a review must be quoted with its scope; a rule whose scope does not match the current build is inadmissible.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `src/ui-ux-pro-max/templates/base/skill-content.md:48-50,281-282,346-347` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/argument-shape-six-beats — `adapt`

**Solves:** A persuade surface with a beautiful first screen and no argument beneath it: three feature cards standing in for the four questions the reader actually has.

**Mechanism:** The page is an argument in a fixed order: what this is, why it matters to you, how it works, why believe it, what it costs, what to do next. Six sections is a complete page; nine is a page hiding an argument it has not made. Not answering the cost question is answering it badly.

**Why it works:** It is an ordering of information, not of layout, so it survives any visual language. It also falsifies the architecture's claim that a persuade-specific floor could only hold universals or looks: this is neither, because an operate surface has no argument to make.

**In SiteSmith:** SKILL.md section 7, three lines. Not a fourth floor file: section 9 routes decide surfaces to sections 1 to 8 and there is deliberately no floor/decide.md.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/marketing.md:27-42` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/buy-absent-proof-is-declared — `adopt`

**Solves:** An empty proof slot invites fabrication, and a buyer is one search away from checking.

**Mechanism:** Where proof does not exist, its absence is stated plainly with the reason. It is never manufactured.

**Why it works:** Naming the absence converts a suspicious gap into a disclosed fact, and it removes the pressure that produces invented reviews. It is the commerce instance of SKILL.md:157-159 ('when you need the sentence and lack the fact, ask for it or cut the sentence').

**In SiteSmith:** floor/buy.md, proof obligations, cross-referenced to SKILL.md section 7.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:138-139` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/buy-availability-is-stated-in-words — `adapt`

**Solves:** Stock, offer and delivery state are the facts that decide whether the buyer acts now, and they are routinely encoded as a coloured dot with no text.

**Mechanism:** Stock, offer and delivery state are stated in words at the point of decision. They form an information group separate from any emphasis discipline, because they are information, not decoration.

**Why it works:** Separating semantic state from emphasis means an accent budget cannot suppress a fact the buyer needs. The 'never colour alone' half is a universal accessibility floor and is lifted out (see universalRules).

**In SiteSmith:** floor/buy.md. The word 'amber' at line 121 is a named-colour under floor-lint.mjs:31 and is a hard lint failure; rewrite the example without it.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:118-122` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/buy-committed-actions-answer-immediately — `adopt`

**Solves:** An add-to-basket that does not confirm makes the buyer press it twice, and a filter that does not acknowledge makes them assume it is broken.

**Mechanism:** Adding to the basket, applying a filter and recalculating delivery each produce visible feedback within 100ms, whatever the server takes.

**Why it works:** 100ms is a perception threshold, not an aesthetic value, so it pins nothing visual. It sharpens SKILL.md:167-169's 'every interactive state exists' into three named commerce actions with a deadline.

**In SiteSmith:** floor/buy.md, states section.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:110-112` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/buy-comparison-is-a-glance — `adapt`

**Solves:** Irregular repeated units read as a rendering bug, and figures that shift under their own digits force the buyer to compare arithmetically instead of visually.

**Mechanism:** Repeated units in a set are consistent enough, and compared figures aligned enough, that comparing two objects is a glance rather than a task.

**Why it works:** The obligation is comparability. Tabular figures are one rendition of it; decimal alignment and a one-object-per-screen layout that carries figures forward are two others that share no visual language with it.

**In SiteSmith:** floor/buy.md. This is what remains of section 3 after the spacing ramp (66-67), the type rank (67-68) and the scale ratio (71-73) are removed.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:62-69,71` | low | 0.75 | unchallenged | not stated |

### sitesmith-modes/buy-decision-and-control-together — `adopt`

**Solves:** A marketing hero above a product inserts a screen of scrolling between wanting the object and being able to buy it; a category band above the fold costs the first row of products.

**Mechanism:** States the requirement as an outcome, not an arrangement: on a product surface the object and the means of acquiring it are apprehensible together; on a listing the products start on the first screen.

**Why it works:** Stated as an outcome it constrains nothing visual, so the arrangement stays a direction decision while the buyer never pays a scroll to reach the control.

**In SiteSmith:** floor/buy.md, opening obligation. Keep lines 46-47; drop the 49-52 rationale, which argues by contrast with a deleted marketing mode and pins a 200px band.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:46-47` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/buy-every-claim-maps-to-a-spec-line — `adopt`

**Solves:** Product pages accumulate benefit copy that nothing on the page substantiates, which is marketing that wandered onto a commerce surface.

**Mechanism:** Every claim made about the object resolves to a specification line on the same surface. A benefit with no corresponding spec is cut.

**Why it works:** It makes SKILL.md:150-155's abstract 'a claim needs a source' mechanically checkable on this one surface, because the source is named and it is on the same page. It is also decidable locally, so it survives the deletion of the marketing mode file.

**In SiteSmith:** floor/buy.md, and cite it as the buy-surface instance of SKILL.md section 7's claim test.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:171-172` | low | 0.95 | unchallenged | not stated |

### sitesmith-modes/buy-helping-or-in-the-way — `adopt`

**Solves:** Product pages accumulate elements that nobody can defend, and there is no test for removing them.

**Mechanism:** Every element on the surface is either helping the purchase or in its way, and the audit is to name which for each one.

**Why it works:** It is a disposal test, not a construction rule, so it constrains nothing visual and produces a decision per element. It is the mode's actual thesis and it arrives on the last line of the file.

**In SiteSmith:** floor/buy.md, closing test. Use it as the buy-surface audit criterion in the verification phase.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:181-183` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/buy-image-set-is-consistent — `adapt`

**Solves:** A catalogue photographed inconsistently reads as a reseller's scrape, and a single angle hides what the buyer needs to see.

**Mechanism:** The object is shown from more than one angle, treated identically across the whole catalogue, with detail views wherever the material is part of the purchase.

**Why it works:** Consistency-of-treatment is the obligation; which treatment is a direction decision, and three catalogues can be internally consistent while looking nothing like each other.

**In SiteSmith:** floor/buy.md. Keep consistency per context; drop the named ratios at line 93 (square in grid, 4:3 or 3:2 on page).

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:92,95` | low | 0.8 | unchallenged | not stated |

### sitesmith-modes/buy-missing-image-names-itself — `adopt`

**Solves:** Generated product imagery that will not match the shipped catalogue, produced because an empty image slot looks unfinished.

**Mechanism:** Where the real photograph does not exist yet, a labelled placeholder states the shot required — subject, crop, ground — and that is a legitimate finished answer.

**Why it works:** It gives the build a permitted way to be honestly incomplete, which is the only thing that reliably stops fabrication. It is the imagery instance of SKILL.md:157-159.

**In SiteSmith:** floor/buy.md, imagery obligations, cross-referenced to SKILL.md section 7.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:98-100` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/buy-name-the-free-axis — `adopt`

**Solves:** A craft floor that answers every question converges, because the answers it gives are the same answers on every project. gallery/showcase.json records the result as portfolioDiversity: fail.

**Mechanism:** The file names which decisions it does NOT make, sends them to the direction, and states which axis the three comps must differ on. Section 2: 'gallery left or right, panel sticky or in flow... they are the axis the three comps must differ on.' Section 4: 'the value comes from the direction and the photography, not from this file.'

**Why it works:** An unnamed free axis gets spent on the nearest default (SKILL.md:96-98 says exactly this). Naming it converts a silent default into a required choice, and pointing the comps at it makes the choice observable.

**In SiteSmith:** This should govern how floor/buy.md is WRITTEN, not just appear inside it. Every obligation in the file names what it leaves open. It is also the answer to the twelve-topic template defect: four of the twelve mode topics (Density, Radius, Colour emphasis, half of Imagery) are appearance slots by construction, and floor/buy.md must not inherit that shape.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:53-57,80-82` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/buy-nothing-moves-near-money — `adopt`

**Solves:** A number that animates is a number the buyer re-checks; motion near a price reads as the price being manipulated.

**Mechanism:** Nothing animates on a price, in the basket, or at checkout.

**Why it works:** It is a prohibition rather than a prescription, so it constrains no look at all while removing a specific trust failure.

**In SiteSmith:** floor/buy.md. Drop the two-item allowlist and the '--motion-fast' token name at line 104 — a token from one design system has no business in a floor file.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:104,107-108` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/buy-one-unmistakable-purchase-control — `adapt`

**Solves:** When the acquire control has the same weight as three other controls, the buyer hesitates over which one commits them.

**Mechanism:** Exactly one control on the surface acquires the object and it cannot be confused with any other control. Secondary actions are secondary and look it.

**Why it works:** The obligation is distinguishability, which is achievable by fill, by isolation, by size, by position or by containment. The source file spent it on colour reservation, which is one rendition and the one that made three shops identical.

**In SiteSmith:** floor/buy.md. State as distinguishability and explicitly forbid colour reservation as the default answer, naming it as one option among several.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:115-116,158-159,181-183` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/buy-price-is-found-not-hunted — `adapt`

**Solves:** A price the buyer has to search for is read as a price being hidden.

**Mechanism:** The price is locatable without search on every surface the object appears on. Stated as an outcome; the file's own type-rank answer (second-largest type) is the appearance form and is discarded.

**Why it works:** Findability is a perceptual property with many solutions, so it can be met by position, by weight, by repetition or by language, none of which imply the others.

**In SiteSmith:** floor/buy.md. Replace 'price is the second-largest type on the page' with the outcome.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:62-63` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/buy-proof-shows-its-shape — `adopt`

**Solves:** A mean rating with no count and no negatives is indistinguishable from a filtered one, and buyers correctly assume it is filtered.

**Mechanism:** Proof is presented with its size, its spread and its worst cases intact, attributed to a verified purchase where the platform supports it. 4.6 from 300 and 4.6 from three are different facts and must read as different facts.

**Why it works:** It targets the information the buyer needs to weight the proof, not the shape of the proof block, so a histogram, a count and a raw list all satisfy it.

**In SiteSmith:** floor/buy.md, proof obligations.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:37,130-134` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/buy-purchase-control-is-always-in-reach — `adapt`

**Solves:** A buyer who decides while reading the specification has to scroll back up to act, and some do not.

**Mechanism:** From any point where the buyer might decide, the purchase control is reachable without hunting.

**Why it works:** Reachability is the obligation; stickiness is one implementation. NORDRIG-AB-FORENSICS.md:37-38 shows 'sticky buy panel, mobile bottom bar' listed as a line item in build B's method, which is precisely how a floor rule became a visual signature.

**In SiteSmith:** floor/buy.md. Drop 'sticky through the specification on desktop and pinned to the bottom of the viewport on a phone' entirely; keep reachability.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:155-157` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/buy-reference-price-is-real — `adapt`

**Solves:** Invented 'was' prices are the most common commerce lie and in several jurisdictions they are illegal.

**Mechanism:** A reduced price names the price it is reduced from, that reference is a price the object was actually sold at, and both numbers are readable.

**Why it works:** It binds a visual convention to a factual obligation: the strikethrough is optional, the truth of the reference is not.

**In SiteSmith:** floor/buy.md. Keep 'never invents a was price'; drop 'struck' as the mandated form.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:123-124` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/buy-related-states-the-relation — `adopt`

**Solves:** Undifferentiated 'you may also like' rails that serve neither the buyer who is in the wrong place nor the buyer who is in the right one.

**Mechanism:** Where other objects are shown, the page says what their relation is: an alternative if this one is wrong, a complement if it is right. Say which.

**Why it works:** 'Say which' is a labelling obligation with no layout attached, and it splits one rail into two distinct jobs that answer two different buyer states.

**In SiteSmith:** floor/buy.md, argument obligations.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:39` | low | 0.8 | unchallenged | not stated |

### sitesmith-modes/buy-result-set-is-navigable — `adopt`

**Solves:** Filters built from the warehouse's categories, an unstated result count, and an empty result that is a dead end.

**Mechanism:** The buyer can narrow the set on the terms they think in, always knows how many results they are looking at, and is never given a dead end: an empty result offers the nearest thing that exists.

**Why it works:** Three content obligations with no layout implied. The empty-result clause is the sharpest of them and is the commerce case of SKILL.md:167-169's 'empty state is an invitation'.

**In SiteSmith:** floor/buy.md, listing obligations. Drop 'a grid' (line 41) and 'sort is secondary to filter' (line 42) — a grid is one rendition and the sort ranking is not generally true.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:41-42` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/buy-scale-is-stated — `adopt`

**Solves:** A photograph cannot convey size, and size is the most common cause of a return.

**Mechanism:** Physical scale is established explicitly: dimensions, a hand, or a known object in frame.

**Why it works:** The source sentence supplies its own three unrelated renditions, which is the clearest proof in the file that it is an obligation rather than a look.

**In SiteSmith:** floor/buy.md, imagery obligations. Model floor-file sentence — it states the outcome and its alternatives in one line.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:96` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/buy-specification-is-complete — `adopt`

**Solves:** Six specs shown when twelve exist: the buyer who cares finds out and reads the omission as concealment.

**Mechanism:** Every specification that exists is shown. Group them if there are many; never curate the set.

**Why it works:** An omitted spec reads as a hidden one, and the buyer most likely to complete is the one who reads specs. Completeness is a content property, entirely independent of presentation.

**In SiteSmith:** floor/buy.md, proof section. Cut the unsourced 'buyers who read specs are the ones who complete' at line 135-136; it is a claim without a source in a package whose SKILL.md:150-155 forbids exactly that.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:35-36,176-178` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/buy-structure-follows-the-buyer — `adopt`

**Solves:** Category trees that mirror how stock is organised rather than how buyers ask for things.

**Mechanism:** Categories are named and grouped in the buyer's nouns, not the warehouse's.

**Why it works:** It is a naming and grouping obligation, orthogonal to how the structure is exposed — which is why the mega-menu prescription that follows it (145-147) is a separate thing and is appearance.

**In SiteSmith:** floor/buy.md, navigation obligations. This also connects to SKILL.md section 3: the category names should come from the subject's noun list.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:143` | low | 0.8 | unchallenged | not stated |

### sitesmith-modes/buy-the-basket-is-never-out-of-reach — `adapt`

**Solves:** A buyer who cannot see what they have accumulated stops accumulating.

**Mechanism:** What the buyer has committed to so far, and how many, is visible and reachable from every surface including narrow viewports.

**Why it works:** It states the fact that must be visible rather than the component that shows it, which is what lets a header icon, a side rail and a plain text line all count.

**In SiteSmith:** floor/buy.md. Drop the search/basket/account triad and the phone-collapse pattern from line 148-149; both are one navigation shape.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:148-149` | low | 0.8 | unchallenged | not stated |

### sitesmith-modes/buy-the-object-is-the-subject — `investigate`

**Solves:** Card chrome, badges and framing that compete with the photograph of the thing being sold.

**Mechanism:** On any surface where the object appears it is the largest and most legible thing there; chrome does not compete with it. This is the mode where imagery cannot be substituted.

**Why it works:** Relative dominance is achievable by scale, by isolation or by removal of the frame entirely.

**In SiteSmith:** floor/buy.md, imagery obligations — but only if it can be written without implying a card. It is derived from a section about corner radius and is one careless restatement away from becoming a chrome prescription. If it cannot be stated cleanly, drop it: the other imagery obligations do most of its work.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:77-78,90` | low | 0.55 | unchallenged | not stated |

### sitesmith-modes/buy-the-way-back-to-the-set — `adapt`

**Solves:** The most common next action after rejecting a product is returning to the set it came from, and a lost filter state makes the buyer redo the work or leave.

**Mechanism:** The buyer can return to the set they were choosing from with their filters intact.

**Why it works:** Stating it as return-with-state rather than as a component means it can be met by navigation, by a control, or by URL design with no control at all.

**In SiteSmith:** floor/buy.md. Replace 'breadcrumbs on every product and category page' with the obligation; breadcrumbs become one of three named renditions.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:151-152` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/buy-total-commitment-legible — `adopt`

**Solves:** Delivery cost, delivery time and return terms discovered inside checkout are the classic abandonment cause; the buyer commits to a number and then finds the real number.

**Mechanism:** Everything the buyer will actually pay and wait for is legible at the moment of commitment without navigating away. Logistics stated before checkout, never inside it.

**Why it works:** It ties disclosure to a moment rather than to a container, so any layout that reaches the moment satisfies it. 'A buyer should never scroll to check what they are about to pay' is the strongest line in the source file.

**In SiteSmith:** floor/buy.md, purchase obligations. Keep line 164's sentence; drop 'inside the panel' from 162-163.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/ecommerce.md:38,162-164` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/comparison-axis-alignment — `adapt`

**Solves:** Things the reader is comparing do not line up: prices jitter between rows, card CTAs sit at three different heights, pricing columns start their feature lists at different vertical positions. Comparison becomes work.

**Mechanism:** Anything the reader is asked to compare must not shift position on the axis of comparison. Figures in an aligned run hold their columns; actions repeated across peer items form one line; peer columns start their comparable content at the same point.

**Why it works:** It states the obligation as a property of the reader's task rather than as an implementation. The v2 phrasing hands over the implementation (tabular-nums, pin the CTA, fix the title block height) and tabular figures are one of the four devices the round-8 known-bad recipe is made of, so the implementation-shaped version smuggles the house style through the obligations door while passing the purity lint.

**In SiteSmith:** floor/buy.md and floor/operate.md, stated without naming tabular-nums or any CSS property.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/tasks/redesign-audit.md:59,92,93` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/concrete-hex-inside-a-token-example — `reject`

**Solves:** Nothing — this is the convergence hazard appearing in the wild, recorded so we do not reproduce it.

**Mechanism:** Line 42 illustrates 'Global design tokens / theming' with `CSS custom properties (--color-primary: #7c3aed)`. The row's job is to name a mechanism (custom properties); it ships a specific colour as the demonstration. #7c3aed is Tailwind violet-600.

**Why it works:** It is the same failure shape as the authoring schema with appearance slots, one line long: an instruction file that had no reason to have a colour in it now has one, and it is the colour every model already over-reaches for. A file obliged to demonstrate a token answered with a hex, exactly as a file obliged to answer 'Radius' answered with a radius. The example does not have to be prescriptive to be copied — it only has to be the nearest concrete value in context.

**In SiteSmith:** Ban concrete colour, radius, font and spacing values from illustrative examples anywhere in the rebuilt skill, including examples whose subject is not appearance. Demonstrate the mechanism with a non-visual name (--color-accent, or an ellipsis) and let the brief supply the value.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `docs/platform-native.md:42` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/content-variance-check — `adopt`

**Solves:** Identical timestamps across a blog roll, or one photograph reused for four people. Real content is untidy; generated content is uniform, and the uniformity is the tell.

**Mechanism:** Content that occurs in a series must vary the way real content varies: dates, authors, lengths and portraits differ across the set.

**Why it works:** It targets the statistical signature of generated content rather than any individual item, which is why it catches pages where every individual item passes review. It is a completeness rule about the set, and the set is what the reader perceives.

**In SiteSmith:** SKILL.md section 8, one line beside 'real content, no lorem'. Explicitly without the accompanying 'round numbers read as fake' line, which instructs more convincing fabrication.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/tasks/redesign-audit.md:134-135` | low | 0.8 | unchallenged | not stated |

### sitesmith-modes/counter-rows-inside-the-rule-table — `adapt`

**Solves:** A stated preference hardens into dogma and gets applied where it is wrong, because the guidance never shows a case where the preference loses.

**Mechanism:** The table contains rows that argue against its own thesis, in the same column that normally holds the replacement: `ms` — 'keep `ms`, it's genuinely useful and tiny' (138); `URLSession` — 'Alamofire earns it for complex retry/multipart at scale' (114); `urllib.request` — '`requests` for anything real' (165). Closed by the escape clause at 211: when native is genuinely insufficient (old browser support, edge cases it doesn't handle, ergonomics that matter at scale) the library earns its place — install it then, not before.

**Why it works:** The exception sits in the same visual position as the rule, so a model scanning the table cannot absorb the rule without absorbing its limit. Same family as the already-recorded `explicit-never-simplify-carveouts`, but a different carve-out class: that one protects validation/security/a11y from deletion, this one names the capability-insufficiency condition under which the cheaper layer is correctly skipped. Note the honest limit: 3 counter-rows against ~180 rule-rows is a thin inoculation, and the escape clause is one sentence at the very bottom where a truncated read never reaches it.

**In SiteSmith:** Wherever the rebuilt skill states a default, state the named condition under which the default loses, in the same sentence — not in a later caveats section. Applies to the native-first rule and to every other 'prefer X' line.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `docs/platform-native.md:114, 138, 165, 209-211` | low | 0.6 | unchallenged | not stated |

### sitesmith-modes/defaults-to-alternatives-table — `reject`

**Solves:** Nominally: replacing generic component patterns with less generic ones.

**Mechanism:** A ten-row table pairing each recognised default with a named replacement: squircles for circular avatars, a masonry wall for the testimonial carousel, a two-column list for the accordion, a slide-over for the modal, a tertiary text link for the filled-plus-ghost button pair.

**Why it works:** It does not. Applied on every project the alternatives become the new defaults, so three redesigns of three different generic sites converge on one non-generic site. This is the inverted-convergence failure already identified in the architecture review, where systematically inverting each category's default rotates the categories into one another. The left column is genuinely useful as a catalogue of recognisable defaults and belongs in a tells corpus; the right column is a house style delivered as a repair instruction.

**In SiteSmith:** Left column to corpora/tells; right column discarded. If a replacement is wanted, the obligation is 'name the default you are shipping and say why it is right here', which forces a per-subject answer instead of a global one.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/tasks/redesign-audit.md:137-151` | medium | 0.85 | unchallenged | not stated |

### sitesmith-modes/delete-the-design-argument-test — `adopt`

**Solves:** A page that looks persuasive but says nothing. Design carries an empty argument and every review passes it because the review looks at the design.

**Mechanism:** Delete every image and every panel from the page and read what is left as plain text. If the remaining words do not persuade, the design was carrying an empty page and the fix is content, not layout.

**Why it works:** It is a falsifier, not a preference. It separates the argument layer from the presentation layer by physically removing one of them, so the test cannot be satisfied by making the presentation better. It is the only rule in the three files that can fail a page that passes every other rule.

**In SiteSmith:** SKILL.md section 7 or run.md gate: one line, applied before the visual critique. 'Strip the page to its text. If it does not persuade, stop and fix the argument.'

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/marketing.md:188-191` | low | 0.95 | unchallenged | not stated |

### sitesmith-modes/dependency-declared-optional-with-named-prose-fallback — `adopt`

**Solves:** A skill whose retrieval layer needs a runtime that may be absent either fails hard, or silently installs software on the user's machine.

**Mechanism:** Two boundaries stated before any workflow step. First, the skill is forbidden from fixing the environment itself: 'If Python is not installed, **do not install it yourself**. Stop and ask the user ... Never run package-manager or system-modifying commands (`sudo`, `brew`, `apt`, `winget`, etc.) on the user's machine for this skill' (13). Second, a named degraded path: 'If the user prefers not to install Python, skip the CLI searches and rely on the Quick Reference sections above' (15).

**Why it works:** Line 15 is the most useful sentence in the file, and it is an admission: the package's entire retrieval layer is declared optional, and the prose alone is the supported fallback. That is the 55-line-prose-beats-630k-token-package result stated by the package's own authors. The no-install rule is separately correct — a design skill acquiring system state is a scope violation the user never approved.

**In SiteSmith:** State SiteSmith's tooling boundary in the same shape: name what verify.mjs needs, state that SiteSmith never installs it, and name what the model does when it is missing. Critically — if the honest fallback is 'the prose still works', that is an argument for the prose carrying the weight, not for adding more machinery behind it. Overlaps with ai-website-cloner-template/tool-agnostic-preflight-detection (detect-then-ask); what is new here is the explicit no-system-mutation ban and the declared prose-sufficient path.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `src/ui-ux-pro-max/templates/base/skill-content.md:5-18` | low | 0.8 | unchallenged | not stated |

### sitesmith-modes/first-screen-from-strongest-material — `adopt`

**Solves:** Every marketing brief gets the same hero because a default arrangement exists to be reached for.

**Mechanism:** State the outcome only (a stranger knows what this is and who it is for, the one action is reachable before scroll) and refuse to name a default arrangement. A table maps the subject's strongest true material to what the first screen is built around: owned photography, a statement only this client could make, the real interface, an index, a single object, or nothing yet. The arrangement is the axis the competing comps are required to differ on.

**Why it works:** It is generative rather than prescriptive: the input is the subject's evidence, so two subjects with different strongest material cannot arrive at the same first screen. The file states the causal claim itself at line 50: naming a default is how nine subjects end up with the same hero.

**In SiteSmith:** SKILL.md section 6, folded into the Layout step: the first screen is built around the subject's strongest true material, and that choice is written down before any code.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/marketing.md:44-69` | medium | 0.9 | unchallenged | not stated |

### sitesmith-modes/forgotten-surfaces-checklist — `adopt`

**Solves:** Generated sites are consistently missing the same six things, and each one is the difference between a mockup and a site.

**Mechanism:** Six named surfaces, added where they apply: a custom 404 offering a route back, privacy and terms links, a visible skip-to-content link as the first tab stop, client-side validation with messages tied to fields, a way back from every dead end, and an active state in the navigation.

**Why it works:** Completeness is what a floor is for, and this list is empirical rather than derived. It is conditional by construction ('add whichever apply'), so it cannot mandate a surface a brief does not have. None of the six names a look.

**In SiteSmith:** redesign.md and SKILL.md section 8, as a six-item completeness check run before delivery.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/tasks/redesign-audit.md:170-181` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/form-error-recovery-and-announcement-contract — `adopt`

**Solves:** Generated forms fail correctly and unhelpfully: the error exists in the DOM, is not announced, does not say how to fix itself, and leaves the user hunting for the field that failed.

**Mechanism:** Six WCAG/Material-cited rules that together form one contract: errors state cause plus fix, not 'Invalid input' (215); after a submit error, focus moves to the first invalid field (222); with multiple errors, a summary at the top anchor-links to each field (223); errors are announced via aria-live or role='alert' (227); toasts must not steal focus and use aria-live='polite' (226); error and success state colours meet 4.5:1 (228).

**Why it works:** These are answers, not decisions — each is verifiable and none constrains how the page looks. It is also the exact gap axe cannot close: axe will pass a form whose error message is invisible to a screen reader user because it was injected without a live region and without moving focus. The ledger's a11y coverage from sitesmith-modes is about disabled controls and keyboard reach; nothing there covers the post-submit failure path.

**In SiteSmith:** One short 'when a form fails' obligation block in the interaction reference, plus a real check: submit every form on the page empty and invalid, then assert focus landed on an invalid control and that an aria-live region or role='alert' received text. Prose and check, per the third measured fact.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `src/ui-ux-pro-max/templates/base/quick-reference.md:215-228` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/generator-mandated-in-prose-and-reroll-as-remedy — `reject`

**Solves:** Claimed: the model needs a single deterministic entry point so every build starts from a complete, coherent design system instead of improvising one.

**Mechanism:** The installed skill body makes the already-rejected generator compulsory in prose, not just available. Step 2 is titled 'Generate Design System (REQUIRED)' (52) and opens '**Always start with `--design-system`**' (54). The command is described as returning the finished answer — 'Applies reasoning rules from ui-reasoning.csv to select best matches' and 'Returns complete design system: pattern, style, colors, typography, effects' (62-63). The 'Common Sticking Points' table then names the only sanctioned remedy for a creative impasse: 'Can't decide on style/color | Re-run --design-system with different keywords' (260). Nothing anywhere in the 384-line body tells the model to decide, justify, or reject the script's output.

**Why it works:** It does not. This is the prose half of the mechanism the ledger already rejected at design_system.py:81-329, and it is worse than the script: the five-slot tuple (pattern / style / colors / typography / effects) is an authoring schema with appearance slots, and the body obliges the model to fill it before writing a line. That is exactly the shape that produced three unrelated briefs converging on one look. The re-roll instruction at 260 is the tell — when the deterministic answer feels wrong, the prescribed fix is another deterministic answer, never the model's own judgement.

**In SiteSmith:** No role. Record as the confirming evidence that ui-ux-pro-max's liability is not confined to its Python: the instruction the machinery serves mandates the machinery. If SiteSmith ever ships a retrieval step, its body must say 'retrieval returns candidates you argue with', and must never contain a step whose success condition is a filled slot.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `src/ui-ux-pro-max/templates/base/skill-content.md:52-69,247-266` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/icon-coherence — `adopt`

**Solves:** Icons drawn from three families at three stroke weights, or emoji standing in for icons and rendering differently on every platform.

**Mechanism:** One icon family, one stroke width, one optical size scale, decided once. Emoji are not icons: they render differently per platform and cannot be themed.

**Why it works:** The emoji clause is technical rather than aesthetic, which is what makes it survive the test. The one-family clause names no family, so it is satisfiable by any icon language including a hand-drawn one or none at all.

**In SiteSmith:** SKILL.md section 6, one line in the plan alongside type and colour.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/tasks/redesign-audit.md:152-153; v2/tasks/setup.md:84` | low | 0.75 | unchallenged | not stated |

### sitesmith-modes/imagery-provenance-ladder — `adopt`

**Solves:** Imagery is the layer where a page most easily starts lying: a rendered fake of the product's interface, a stock photograph presented as the client's work, a placeholder that reads as a claim.

**Mechanism:** A descending preference: real photography the client owns, then generated imagery art-directed to one treatment, then a seeded placeholder service so crop and colour are stable between loads, then an explicitly labelled slot stating what belongs there. A div-built fake product screenshot is banned outright; a typeset excerpt of real output is allowed and must be labelled as an excerpt.

**Why it works:** The seeded-placeholder rung is the non-obvious one: an unseeded placeholder changes between loads, so every screenshot and every review sees a different page and the layout can never be judged. The fake-screenshot ban is an honesty rule, not a taste rule, and it is the one case where the material and the claim are the same object.

**In SiteSmith:** floor file or SKILL.md section 7 alongside the claim rule. Drop the accompanying 'images are mandatory' and 'no decorative SVG blobs' lines, which are appearance.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/marketing.md:107-115` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/impeccable/adversarial-persona-walkthrough — `adapt`

**Solves:** A single 'design director' viewpoint has consistent blind spots — it evaluates the happy path at desktop width with full context, and never discovers what breaks for someone who cannot see hover states, is interrupted mid-flow, or pastes 400 characters into a name field.

**Mechanism:** Five archetypes defined by what they break rather than by demographics (power user, first-timer, screen-reader/keyboard user, edge-case stress tester, interrupted mobile user), each with test questions and a named red-flag list; 2-3 selected per surface from a lookup table; optionally 1-2 more derived from project context. The load-bearing rule is the output contract at line 171: name the exact elements and interactions that fail each persona, do not write generic persona descriptions — write what broke for them.

**Why it works:** Forced viewpoint-switching surfaces defects a single evaluation frame cannot see, and the 'name what broke' rule makes each walkthrough falsifiable rather than a character sketch. But most of the value is concentrated in two of the five: the accessibility persona largely duplicates what axe already checks mechanically, and the stress tester duplicates edge-case testing we do elsewhere.

**In SiteSmith:** Two adversarial walkthroughs per surface, chosen for the surface rather than fixed, each of which must return element-level failures or explicitly return none. Drop the accessibility persona entirely — it is already a mechanical check and a prose duplicate weakens it. Carry the archetypes as one line each, not as 150 lines of profile prose.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/reference/critique.md:160-171,635-790` | high | 0.65 | unchallenged | not stated |

### sitesmith-modes/impeccable/countable-cognitive-load-checks — `adapt`

**Solves:** 'Too complex' and 'cluttered' are unfalsifiable review verdicts. The model will assert them or not assert them with no reproducibility, and neither the builder nor the user can act on them.

**Mechanism:** An 8-item binary checklist scored by counting failures against fixed thresholds (0-1 low, 2-3 moderate, 4+ critical), plus a counting rule at decision points sourced to Cowan's revision of Miller (<=4 manageable, 5-7 boundary, 8+ overloaded). The checklist items that matter are the ones that reduce to a count a script could make: items per group, visible options at a decision point, top-level nav entries.

**Why it works:** It turns an aesthetic complaint into an integer with a threshold, which is the prose-plus-a-check shape the rebuild requires. It also does not say what the page should look like — only how many simultaneous decisions it may impose — so the same number is satisfiable by wildly different designs.

**In SiteSmith:** Extract only the countable subset into the static checker (visible interactive options per decision point, top-level nav count, competing same-weight elements) and discard the ~100 lines of intrinsic/extraneous/germane taxonomy and the eight named violations — the model reproduces that from memory. Keep one prose line stating the threshold, and let the checker enforce it.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/reference/critique.md:325-356` | medium | 0.7 | unchallenged | not stated |

### sitesmith-modes/impeccable/cross-run-score-trend — `adapt`

**Solves:** A critique that leaves no comparable trace cannot tell you whether the last round of fixes helped. Without a stable identity for 'the thing being reviewed', scores from different runs are not comparable at all, and dev-server URLs are not stable identities.

**Mechanism:** Target is resolved to a canonical source path in preference to a URL ('ports drift, paths do not'), slugged by a helper and never hand-written, and the report body is persisted with structured frontmatter — total_score, max_score, na list, p0_count, p1_count. A later run reads the last five entries and prints one trend line. Critically, the comparison is denominator-aware: when entries carry different applicable maxima it must print each score with its own denominator and state that the runs are not like-for-like. Persistence is fire-and-forget — a failure prints and moves on rather than blocking the critique.

**Why it works:** It gives the loop an objective, external measure of whether it is converging, which is the only honest basis for a stop decision beyond a round cap. The denominator-awareness rule is what stops it becoming a lie: it prevents a run that skipped two dimensions from appearing as an improvement over one that scored all of them.

**In SiteSmith:** Verification results persist as a small machine-readable record keyed by a canonical target path, carrying the score, the applicable maximum, and the defect counts. A subsequent run reads prior records and reports the delta, refusing to present a delta across differing applicable sets as like-for-like. Persistence failure never blocks the run.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/reference/critique.md:18,22-26,195-229` | medium | 0.75 | unchallenged | not stated |

### sitesmith-modes/impeccable/findings-grounded-followup-questions — `adopt`

**Solves:** Post-audit questioning defaults to generic discovery ('who is your audience?'), which wastes the user's time and produces answers the review already had. The opposite failure is asking nothing and proceeding on assumptions.

**Mechanism:** Every question must reference a specific finding from the report and offer 2-3 concrete options drawn from what was actually found; generic questions are named and banned; maximum 2-4 questions; and the whole step is skipped when findings are straightforward — but the skip must be printed as `Questions skipped: <reason>` rather than being silent. The four question archetypes are scoped: which category first, was the tonal mismatch intentional, how much scope, anything off-limits.

**Why it works:** It ties the interaction budget to evidence. A question that cannot cite a finding is not asked, so the cost of asking is bounded by the size of the finding set rather than by a fixed script, and the mandatory skip announcement means 'no questions' is a decision rather than an omission.

**In SiteSmith:** After a SiteSmith audit, any clarifying question must quote the finding that motivates it and offer concrete options; no findings means no questions and a printed reason. Never ask brief-discovery questions after a build — those belong before it.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/reference/critique.md:231-251` | low | 0.75 | unchallenged | not stated |

### sitesmith-modes/impeccable/issue-to-remedy-command-mapping — `adapt`

**Solves:** A critique that ends in observations leaves the user to translate 'weak hierarchy' into an action. The opposite failure is a boilerplate recommendation list where every available remedy appears whether or not it addresses anything found.

**Mechanism:** Every priority issue is tagged with a severity, a why-it-matters, a concrete fix, and the specific next command that would address it. The recommendation list is then derived: ordered by the user's stated priority then impact, each item carrying enough context that the receiving step knows what to focus on, with two hard filters — skip any remedy that would address zero issues, and exclude anything in a scope the user marked off-limits.

**Why it works:** The zero-issue filter is the part worth taking. It makes the recommendation list a function of the findings rather than a menu, so a clean page produces a short list and a broken one produces a long one. The 19-command roster itself is impeccable's product surface and does not transfer to a single unified skill.

**In SiteSmith:** Each finding carries its own remedy inline (file, change, expected effect). Any generated plan is derived strictly from the finding set — no step may appear that resolves zero findings, and scope exclusions stated by the user remove steps rather than annotating them.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/reference/critique.md:154-158,253-273` | low | 0.6 | unchallenged | not stated |

### sitesmith-modes/impeccable/licensed-empty-slot — `adapt`

**Solves:** A report template with fixed quota slots manufactures content to fill them. This file is the case study for both halves: it applies an escape hatch to the heuristic table (n/a) and to the follow-up questions ('Questions skipped: <reason>'), but leaves 'Highlight 2-3 things done well', 'the 3-5 most impactful design problems', and 'Auto-select 2-3 personas' as unconditional quotas. On a genuinely clean page the reviewer must invent three problems; on a genuinely broken one it caps at five; on a one-page portfolio it must produce persona red flags for personas that have no journey to fail.

**Mechanism:** Generalized from the file's two consistent slots: any obligatory report section must admit a licensed empty answer with a stated reason, and that reason must be recorded rather than the section silently disappearing. Line 251 is the sharpest instance — the visible response must either contain the questions or explicitly print `Questions skipped: <reason>`.

**Why it works:** This is the same lesson as the appearance-slot convergence, arriving from the critique side rather than the authoring side. A schema obliged to answer 'Radius' answered it; a report obliged to list three strengths lists three. The countermeasure is identical in both directions: make the null answer explicit, cheap, and recorded, so the honest response and the padded response are distinguishable after the fact.

**In SiteSmith:** No fixed-count quotas anywhere in our report contract. Every section is nullable-with-reason; a null without a reason fails validation; counts are reported as found, not as targets. Explicitly: never write 'list 3-5 issues' — write 'list every issue at or above severity X, or state that there are none'.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/reference/critique.md:129-133,148-152,160-171,249-251` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/impeccable/na-renormalized-scoring — `adapt`

**Solves:** A fixed rubric applied to a surface it was not designed for silently punishes the surface for lacking checks that cannot apply. Scoring a landing page on 'Help and Documentation' and 'Flexibility and Efficiency' guarantees a depressed score that carries no information, and a reviewer facing a mandatory numeric cell will invent a number rather than leave it blank.

**Mechanism:** Any dimension that genuinely cannot apply to the surface under review is scored `n/a` with a one-line reason instead of a number. The denominator is then recomputed as 4x the number of dimensions actually scored ('Never print /40 over a partial set'), the rating band is read off the percentage rather than the raw total (line 616: 90%+/70%+/50%+/30%+), and the persisted snapshot must record both the applicable maximum and which dimensions were skipped so a later run can tell a renormalized total from a full one.

**Why it works:** It removes the incentive to fabricate. The failure mode being patched is exactly the appearance-slot failure: a form field that demands an answer will get one whether or not the answer exists. The fix is not to delete the field but to make 'this does not apply, because X' a first-class, recorded answer that costs the scorer nothing.

**In SiteSmith:** Every scored dimension in our verification report carries an explicit applicability state: scored, or skipped-with-reason. The checker computes the denominator from the scored set only and refuses to emit a total against a denominator containing a skipped dimension. Skipped dimensions and their reasons are written into the machine-readable result, not just the prose.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/reference/critique.md:129-133,616 (actual: .agents/skills/impeccable/reference/critique.md)` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/impeccable/nielsen-band-text-verbatim — `reject`

**Solves:** Nothing this rebuild has. It is a full restatement of Nielsen's ten heuristics with a check-for list and a five-row 0-4 criteria table for each — roughly 205 of the file's 812 lines.

**Mechanism:** Ten sections, each with five bullet 'check for' items and a scoring table defining what 0 through 4 mean for that heuristic.

**Why it works:** It does not, for us. This is textbook material any current model restates accurately from memory, so carrying it buys no behavioural change and costs a fifth of the file. It is also the exact shape the 59-to-40 measurement condemns: instruction enumerating what the output should contain rather than raising the standard the model applies. The two genuinely non-obvious lines nearby — the population prior at 131 and the percentage-band renormalization at 616 — are captured separately as their own mechanisms.

**In SiteSmith:** none — name the heuristics, state the scale, state the base rate, and stop

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/reference/critique.md:396-601` | high | 0.85 | unchallenged | not stated |

### sitesmith-modes/impeccable/run-notes-skip-accounting — `adopt`

**Solves:** Directly the rebuild's third measured fact: prose guardrails the model polices itself with fail silently. This file has roughly a dozen steps that can be skipped for legitimate reasons (detector missing, browser unavailable, script injection blocked, slug null, sub-agents unavailable) and any one of them can be skipped for illegitimate reasons with an identical-looking report.

**Mechanism:** A mandatory Run Notes block enumerating a fixed field list — target slug, ignore list, assessment independence, CLI detector, browser visibility, overlay injection, live-server cleanup, temp-file cleanup, snapshot write, trend read. Every field carries a status, and for anything failed or skipped it must carry the concrete observed reason plus the fallback signal actually used. Paired with a hard anti-fabrication rule (line 14: do not claim a user-visible overlay exists unless injection actually succeeded in the page) and a cleanup obligation (line 13: any server started must have a recorded stop method and be stopped before reporting).

**Why it works:** It converts every soft, skippable step into a reported field, so silence becomes structurally impossible: the absence of a field is itself a detectable defect, whereas the absence of a self-policed prose behaviour is invisible. This is the cheapest available substitute for a real check on steps that genuinely cannot be automated, and it is machine-gradeable — a parser can assert the field set is complete without judging the content.

**In SiteSmith:** Every SiteSmith verification run emits a fixed provenance block covering each step that can degrade: which viewports were captured, whether axe ran in both schemes, whether a live server was reachable, whether the anti-slop linter ran, whether any step fell back. Missing field or missing reason on a non-run step fails the gate. No claim of a check having run may be made without the artifact it produces.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/reference/critique.md:9,13-14,76,82,88,92,182-185,212` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/impeccable/score-inflation-calibration-anchor — `adopt`

**Solves:** A self-scoring model grades generously. Without an external anchor a 0-4 scale collapses toward 3-4 and the score stops discriminating, which is the mechanism by which a review loop terminates early on work that is not good.

**Mechanism:** Three cheap lines rather than a system: an explicit population prior ('Most real interfaces score 20-32 out of 40'), a definition of the ceiling that resists reflexive use ('A 4 means genuinely excellent', repeated at 398 as 'not good enough'), and a delivery discipline block (187-193) — be specific, name the exact element not 'some elements', cut 'consider exploring...' entirely, do not soften criticism.

**Why it works:** This is instruction that raises the model's standard rather than enumerating what the output should contain — the class the rebuild's own 59-to-40 measurement says is worth paying for. The population prior is the load-bearing part: it makes a high score a claim the model must be willing to defend against a stated base rate, at a cost of one sentence.

**In SiteSmith:** Wherever SiteSmith asks the model to score its own output, state the expected distribution alongside the scale and define the top band as rare. Ban hedged remediation language ('consider', 'you might want to') in review output — that one is also mechanically greppable, so it gets prose plus a check.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/reference/critique.md:131,187-193,398,604-616` | low | 0.8 | unchallenged | not stated |

### sitesmith-modes/impeccable/severity-tiebreak-question — `adopt`

**Solves:** Severity labels drift. Without a tie-breaker, P1 and P2 are assigned by mood and the priority ordering that the whole downstream plan depends on becomes noise.

**Mechanism:** A four-level ladder defined by user consequence rather than by code area (blocking task completion / significant difficulty / annoyance with a workaround / no real impact), plus a single disambiguation test for the boundary case: 'Would a user contact support about this? If yes, it is at least P1.'

**Why it works:** It converts a subjective ranking into a semi-objective one by substituting a concrete, imaginable external event for an internal judgment. Costs one sentence, and it is the only part of the 200-line scoring apparatus that the model does not already reproduce from memory.

**In SiteSmith:** Adopt the ladder and the tie-break sentence verbatim in shape for SiteSmith finding severity, with our own external event substituted (would this make a visitor leave the page, or make the client ask us to fix it before launch).

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/reference/critique.md:620-631` | low | 0.8 | unchallenged | not stated |

### sitesmith-modes/impeccable/three-way-evidence-reconciliation — `adopt`

**Solves:** This is the file's answer to critic-vs-critic disagreement, and it is the thing the coverage gap most obviously cost us. Two independent assessments — one subjective, one mechanical — will disagree, and the default behaviour is to concatenate both and let the reader reconcile, which means neither is accountable.

**Mechanism:** Synthesis is explicitly forbidden to concatenate. The combined report must weave the two and disposition the disagreements into three named buckets: where the design review and the detector agree, where the detector caught something the review missed, and where the detector's findings are false positives. Ordering is enforced upstream (line 10): Assessment A must be finished before detector output enters the synthesis context, because deterministic output still anchors judgment. The specificity verdict then carries both an 'LLM assessment' and a 'Deterministic scan' subsection side by side (135-143) rather than one merged number.

**Why it works:** The machine is allowed to be wrong and the human critic is allowed to overrule it, but only out loud and per finding. That is the correct resolution shape: neither critic wins by default, and every mechanical finding leaves the run with a disposition attached. It also produces a free calibration signal over time — a detector rule that is repeatedly dispositioned false-positive is a rule to delete.

**In SiteSmith:** Where SiteSmith runs both a model critique and the static anti-slop/axe checks, the model forms its judgment before it sees the checker output, and the combined result must disposition every mechanical finding as confirmed, missed-by-the-model, or false-positive-with-reason. Unreconciled findings fail the gate. False-positive dispositions accumulate as evidence against the rule, not against the reviewer.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/reference/critique.md:10,96,135-143` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/impeccable/thumb-zone-placement-rule — `reject`

**Solves:** Claims to solve one-handed mobile reachability.

**Mechanism:** 'Uses thumb only; prefers bottom-of-screen actions' as a stated behaviour, 'Are primary actions in the thumb zone (bottom half of screen)?' as a test question, and 'Important actions positioned at the top of the screen (unreachable by thumb)' as a reportable red flag.

**Why it works:** It does not — it is a layout prescription wearing a persona's clothes, and it is the one item in this file with the shape the rebuild has already been burned by. A reviewer obliged to answer 'is the primary action in the bottom half' will push every mobile layout toward the same composition, for the same reason a schema slot named Radius produced the same radius three times. The adjacent items in the same block are genuine obligations — 44x44pt targets, state survives interruption, works on a slow connection — all satisfiable by unrelated designs. This one names a screen region.

**In SiteSmith:** none — if reachability matters, check reachability (target size, tap-target spacing, whether the primary action is reachable without a scroll), never a prescribed screen region

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/reference/critique.md:757,764,771` | low | 0.8 | unchallenged | not stated |

### sitesmith-modes/impeccable/user-owned-ignore-list — `adapt`

**Solves:** A repeat critique re-raises findings the user has already considered and dismissed, which trains the user to ignore the report. The opposite risk is a review that quietly inherits its own prior conclusions and stops looking.

**Mechanism:** A single user-owned suppression file whose matching findings are dropped silently — and the rule that it is 'the only prior-run input critique consumes'. Prior scores, prior reports and prior verdicts are deliberately not read into the assessment context, only the suppression list.

**Why it works:** Two things at once, and the second is the interesting one. The suppression file gives the user a durable veto without arguing with the reviewer. The exclusivity clause keeps the assessment genuinely fresh — a reviewer that reads its own last report anchors on it, which would quietly defeat the fresh-eyes property the dual-subagent mechanism is paying for. Note: this line falls inside the ledger's already-cited :5-46 range, but no ledger entry records it.

**In SiteSmith:** A user-owned dismissal list is the only prior-run state SiteSmith's audit reads. Prior scores may be read by the reporting layer for the trend line, but must not enter the assessment context.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skill/reference/critique.md:27` | low | 0.7 | unchallenged | not stated |

### sitesmith-modes/modal-foreground-must-be-isolated — `adapt`

**Solves:** A modal or sheet whose backdrop still competes visually, so the user cannot tell what is now interactive and the dialog reads as an overlay rather than a state change.

**Mechanism:** 'Scrim and modal legibility | Use a modal scrim strong enough to isolate foreground content (typically 40-60% black) | Weak scrim that leaves background visually competing' (327), repeated as a checklist item (368).

**Why it works:** The obligation — the foreground of a modal state must be unambiguously separated from what is behind it — is real and routinely missed, because a 20% scrim looks tasteful in a screenshot and fails in use. The '40-60% black' figure is not the mechanism; it is an appearance value, and carrying it verbatim is how a rule becomes a house style.

**In SiteSmith:** Keep the obligation in the interaction reference phrased as separation, not opacity, and say plainly that the number is deliberately not specified. If it needs enforcement, the check is contrast/legibility of the foreground against whatever is behind it, never a scrim-opacity threshold.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `src/ui-ux-pro-max/templates/base/skill-content.md:327,368` | low | 0.7 | unchallenged | not stated |

### sitesmith-modes/model-facing-vs-machine-facing-declaration — `adapt`

**Solves:** A knowledge file that a script parses must answer every field it declares; a file only the model reads may leave things open. When the two roles are mixed in one artifact, the schema wins and the open questions become slots.

**Mechanism:** A 10-row priority index (Priority / Category / Impact / Domain / Key Checks / Anti-Patterns) that explicitly declares its own consumer. Line 41: '供人工/AI 查阅：按 1→10 决定先关注哪类规则；需要细则时用 --domain <Domain> 查询。脚本不读取本表。' — 'For human/AI reference: use 1→10 to decide which class of rule to attend to first; query --domain for detail. Scripts do not read this table.' The ordering itself is a triage claim (Accessibility and Touch CRITICAL; Charts LOW), and each row carries must-haves and anti-patterns rather than values.

**Why it works:** The declaration is the mechanism, not the table. Naming a file as model-facing-only frees it from having to be complete or resolvable, which is precisely the pressure that turned ui-ux-pro-max's other data files into appearance schemas. The priority ordering then does something a flat rule dump cannot: it tells the model what to spend attention on first when it cannot read everything.

**In SiteSmith:** Split SiteSmith's reference material by consumer and say so in the file: files the verify script parses have a fixed schema and no aesthetic fields at all; files only the model reads are prose, may be incomplete, and carry an explicit 'nothing here is a value to fill in' line. Keep the attention-ordering idea, drop the ten-category taxonomy (SiteSmith already orders obligations by when the visitor meets them).

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `src/ui-ux-pro-max/templates/base/quick-reference.md:39-54` | low | 0.7 | unchallenged | not stated |

### sitesmith-modes/named-z-index-scale — `adopt`

**Solves:** Stacking becomes an arms race. z-index: 9999 means the scale was lost, and every later overlay has to outbid it.

**Mechanism:** A named z-index scale, declared once, with every stacking value drawn from it.

**Why it works:** It states the obligation as the existence of a system rather than as any particular value, so it is satisfiable at any depth budget. The named form is what makes it checkable: a raw number in a component is the violation, regardless of its magnitude.

**In SiteSmith:** SKILL.md section 8 or the redesign semantics pass, one line.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/tasks/redesign-audit.md:164` | low | 0.8 | unchallenged | not stated |

### sitesmith-modes/native-first-capability-lookup-table — `reject`

**Solves:** An agent reaches for a package before checking whether the platform already ships the capability.

**Mechanism:** Seven side-by-side tables ('You think you need' vs 'What the platform has') covering HTML form controls (13-26), CSS capabilities (34-50), JS/browser APIs (58-85), Swift/SwiftUI (93-123), Node stdlib (131-147), Python stdlib (156-170) and SQL (178-193). Roughly 180 rows, each naming a specific API as the replacement for a specific package or hand-rolled component.

**Why it works:** It does not work durably. This is a snapshot with no verification date, no 'last checked' marker, no baseline/caniuse instruction and no staleness owner anywhere in the 212 lines. The dating is visible in the content itself: `field-sizing: content` (25), `@container` (41), native nesting (49), `:has()` (50), `Object.groupBy` (62), vendor-prefixed `-webkit-line-clamp` (47), and hard version stamps 'Python 3.7+/3.9+/3.4' (157-168) plus 'six | drop it, Python 2 is gone' (160). Five of the seven tables (Swift, Node, Python, SQL, and most of JS) are irrelevant to a website-building skill outright. This is exactly the enumerate-the-contents shape that lost 40-59 to 2078 tokens of prose, at maybe 20x the context cost of the one-line rung it backs.

**In SiteSmith:** Do not port any of it. Rung 4 of the already-adopted ladder ('use the native platform feature') carries the entire durable payload in seven words; this file is the part that would date the skill and blow the budget. If a capability list is ever wanted, it needs a verification date and an owner, and it still would not earn its place.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `docs/platform-native.md:9-195` | high | 0.9 | unchallenged | not stated |

### sitesmith-modes/native-first-justified-by-checkable-accessibility — `adapt`

**Solves:** A prose 'prefer native' rule is unenforceable and fails silently, because its stated justification (dependency decay) is invisible in the shipped artifact.

**Mechanism:** The file justifies native-first purely from maintenance economics — the wrapper-decay chain at 201-207: platform team solves it, package author wraps it, you install the wrapper, the wrapper goes unmaintained, you debug the wrapper. It never once argues from accessibility, even where the rows are entirely about it (`<dialog>` + showModal at 21, `<details>/<summary>` at 22, `title`+CSS tooltip at 23, `<input list>`+`<datalist>` at 24 — native focus trapping, keyboard handling, IME and mobile affordances all come free).

**Why it works:** The a11y reframing is our addition, not the file's, and it is what converts an unpolicable preference into a rule with a check. 'Prefer native for maintenance reasons' has no signal in the output. 'Prefer native because rebuilt controls lose keyboard and focus behaviour' is directly measurable by the existing verify gate — axe in both colour schemes plus keyboard traversal already catches a hand-rolled div-modal or a JS accordion that a dependency-count check never would. Prose AND a check, from a file that supplied only prose.

**In SiteSmith:** One sentence in the build phase: when a browser control exists for the job, use it — a rebuilt control has to re-earn focus, keyboard and screen-reader behaviour, and verify.mjs will find out. No API list attached.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `docs/platform-native.md:21-24, 197-211` | low | 0.7 | unchallenged | not stated |

### sitesmith-modes/never-default-styled-generated-components — `adopt`

**Solves:** Component generators ship a complete, recognisable visual language. Installed and used unmodified, that language is the site's design, and it is the same language on every site that installed it.

**Mechanism:** You own the output. Never ship it at default styling.

**Why it works:** It names the one dependency whose default state is itself a house style, and it does so at the moment the dependency is added rather than at review time when the whole page is already built on it. It is anti-convergence stated as an install-time obligation.

**In SiteSmith:** SKILL.md section 8 or stacks/static.md: any generated or vendored component is restyled from the direction's own token layer before it ships.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/tasks/setup.md:83` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/no-key-gated-service-in-setup — `adopt`

**Solves:** A design task quietly acquires a paid dependency or writes a credential into a config file on the user's behalf.

**Mechanism:** Never install a paid or key-gated service as part of setup. If a component source or asset API needs an account, name it as an option and let the user decide. Do not ask for, store, or write API keys into config on the user's behalf.

**Why it works:** It is a safety boundary stated at the only point where it can be enforced cheaply, and it fails closed by naming the option rather than acting on it. Nothing in the current v3 package covers credential handling at all.

**In SiteSmith:** stacks/static.md and run.md, verbatim.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/tasks/setup.md:95-97` | low | 0.8 | unchallenged | not stated |

### sitesmith-modes/no-motion-between-intent-and-result — `adopt`

**Solves:** Animation placed where a user is committing to something: a form that animates while being filled, a button whose transition delays the click, a purchase control with a flourish.

**Mechanism:** Nothing moves in a form. Nothing delays a click. Motion never sits between an intent and its result.

**Why it works:** It draws the line by position rather than by duration or easing, so it survives any visual language. Every attempt to state it as a duration or a character becomes appearance immediately, which is what happened four lines earlier in the same section. Generalises Nordrig build B's 'no motion near money' to every commitment surface.

**In SiteSmith:** SKILL.md section 8, one sentence appended to the motion rule.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/marketing.md:128` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/one-accent-colour-system — `reject`

**Solves:** Claimed: accent inflation, a screen where everything is emphasised. Actual: it pre-decides the colour system for every operated surface the skill will ever produce.

**Mechanism:** 'One accent for the primary action and the current item', with semantic colour declared as a separate group so a three-state queue can be argued not to have broken the rule three times (112-116), and 'The rest of the screen is neutral' (126).

**Why it works:** The accent-inflation concern is real. The rule is not a floor: it mandates one accent plus a neutral field, which is precisely the arrangement NORDRIG-AB-FORENSICS.md:84-91 records the losing build defaulting into and PALETTE-ANALYSIS.md finding 4 flags as the monoculture risk. Lines 112-116 exist only to reconcile line 111 with reality, which is the signature of a rule that does not fit.

**In SiteSmith:** Replace with the obligation underneath it — a colour that carries meaning is not spent on decoration (mech signal-colour-is-reserved) — which permits a colourful field and therefore does not converge.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:111-116,126; marketing.md:133-135` | low | 0.95 | unchallenged | not stated |

### sitesmith-modes/one-imagery-treatment-per-site — `adopt`

**Solves:** Two photographic treatments on one page reads as two brands, and it is the most common way a site assembled from mixed sources gives itself away.

**Mechanism:** One treatment across the site: the same crop logic, the same aspect ratios, the same colour handling, everywhere.

**Why it works:** It constrains consistency without naming which treatment, so it is satisfiable by any treatment at all including none. It is the imagery equivalent of a token layer: one decision made once that answers every later instance.

**In SiteSmith:** SKILL.md section 6, one line in the plan: name the imagery treatment alongside colour and type.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/marketing.md:117-118` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/one-intent-one-label — `adapt`

**Solves:** Two controls with the same intent carrying different labels, and the reader has to work out whether they do the same thing.

**Mechanism:** One intent has one label everywhere it appears. Two labels for one intent is a page that could not decide.

**Why it works:** Section 7 already requires a control to keep the same word from action through to confirmation. This is the horizontal case of the same rule, across instances rather than across time, and it is the one that actually shows up on a persuade surface.

**In SiteSmith:** SKILL.md section 7, appended to the existing same-word rule as a clause rather than as a new paragraph.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/marketing.md:174-175` | low | 0.75 | unchallenged | not stated |

### sitesmith-modes/operate-action-at-the-object — `adopt`

**Solves:** Actions in a toolbar three sections away force the operator to hold the target in memory while travelling to the control, which is where wrong-row errors come from.

**Mechanism:** Row actions on the row, form actions at the end of the form. The control lives where the thing is.

**Why it works:** Co-location removes the memory step entirely rather than mitigating it.

**In SiteSmith:** Carry as co-location. Drop line 157's bulk-bar placement ('a bar that appears above the data... not floating over it') — that is one placement, not the obligation.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:38,156` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/operate-arrangement-from-work-shape — `adopt`

**Solves:** A layout picked from a menu of dashboard conventions rather than derived from how the work is actually done.

**Mechanism:** Rail and pane, master and detail, a single table, a board — the choice is argued from observed work. 'A dispatcher watching six things at once and a clerk working one record at a time do not get the same screen.'

**Why it works:** It is the only rule in the file that supplies its own unrelated renditions and refuses to pick between them. It is the model for how every other obligation should have been written.

**In SiteSmith:** Carry verbatim and cite it in the floor file as the pattern the other rules must match.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:52-55` | low | 0.95 | unchallenged | not stated |

### sitesmith-modes/operate-blocked-control-says-why — `adopt`

**Solves:** A dead button with no explanation, which leaves the operator hunting the screen for what they did wrong.

**Mechanism:** The primary action states its consequence and its blockers. 'A disabled control says why, or is not disabled.'

**Why it works:** It closes the loophole every accessibility checklist leaves open: SKILL.md:168 requires the disabled state to exist and be reachable, which a silent dead button satisfies. This requires it to be informative or absent.

**In SiteSmith:** Carry verbatim including the example. The either/or construction is what makes it enforceable.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:159-161` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/operate-compared-figures-do-not-shift — `adapt`

**Solves:** A column whose digits move under each other cannot be scanned, and at operate row heights it is the smallest text on the site.

**Mechanism:** Figures that are compared hold a fixed horizontal position between rows.

**Why it works:** The obligation is alignment, which is verifiable by looking at two adjacent rows; it does not require any particular typeface feature.

**In SiteSmith:** State as non-shifting comparison. Drop 'tabular everywhere' and drop the tabular-mono framing that NORDRIG-AB-FORENSICS.md:38 lists among B's production rules — the feature is one implementation of the obligation.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:71-72` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/operate-destructive-separated-by-position — `adopt`

**Solves:** Destructive and constructive actions adjacent and distinguished only by colour, which fails for anyone who does not see the difference and for anyone moving fast.

**Mechanism:** Destructive actions are separated from constructive ones by position, not only by colour, and they confirm.

**Why it works:** Already written in non-appearance terms by the original author — 'by position, not only by colour' names the mechanism and rejects the shortcut in the same clause.

**In SiteSmith:** Carry verbatim. It needs no rewriting, which makes it the only rule in the file that was already floor-shaped.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:163-164` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/operate-entry-is-quiet — `adopt`

**Solves:** Movement in peripheral vision while a person is typing figures or counting stock breaks the count. It is the one motion failure that costs data rather than polish.

**Mechanism:** 'Nothing animates while the user is typing or counting. This is absolute in this mode.'

**Why it works:** It is stated as absolute, names the exact condition, and is satisfiable in any visual language including one with no motion at all. SKILL.md:169 has 'one deliberate moment or none' but nothing about entry.

**In SiteSmith:** Carry verbatim, keep it absolute. Highest-value single line in the file.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:99,103` | low | 0.95 | unchallenged | not stated |

### sitesmith-modes/operate-exceptions-before-inventory — `adopt`

**Solves:** A screen that shows every record with equal weight has done none of the operator's sorting, so the operator does it by eye on every visit.

**Mechanism:** What needs deciding comes before what does not. 'A screen that shows everything equally has sorted nothing.'

**Why it works:** It moves the ranking work from the operator to the surface, once, and it is checkable by asking what is above the fold on a busy day.

**In SiteSmith:** Carry verbatim as an obligation. It names no arrangement and survives any visual language.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:33-34` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/operate-image-earns-identification — `adapt`

**Solves:** Decorative imagery on a surface the operator sees a thousand times costs them a little each time and identifies nothing.

**Mechanism:** An image is present because the image is the thing being identified or judged — a product row, an uploaded file, a photo attached to a report.

**Why it works:** Reframed as a job test rather than a quantity, it permits a wholly image-led console and forbids a single decorative one, which a budget cannot do.

**In SiteSmith:** State as the job test. Drop 'Almost none' (87) — a quantity is a look — and drop the 'small neutral glyph' empty-state illustration (92).

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:87-90` | low | 0.8 | unchallenged | not stated |

### sitesmith-modes/operate-keyboard-reach-complete-and-discoverable — `adopt`

**Solves:** A scroller no key reaches, a grid that cannot be traversed, and a shortcut that exists and is documented nowhere. 'Nothing looks wrong at any width, and the screen is unusable to the person who lives in it.'

**Mechanism:** Every destination, every scrollable region and every grid is reachable by key, and the key is visible somewhere on the screen.

**Why it works:** Two things nothing else in the package carries. SKILL.md:170 requires focus to be visible, which is a different property from a region being traversable — a scroll container with no focusable child passes a focus-visibility check and is reachable by nobody. And discoverability of shortcuts is rarely stated at all: 'a shortcut nobody can see is a shortcut nobody uses.'

**In SiteSmith:** Carry both halves — traversal and discoverability — as one obligation, and say explicitly that it is not the same requirement as visible focus.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:147-150,186-189` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/operate-latency-is-narrated — `adapt`

**Solves:** An action that takes longer than perception with no acknowledgement gets clicked twice, and a whole-screen spinner destroys the operator's place in the data.

**Mechanism:** Above a latency threshold the wait is acknowledged, specifically and locally, rather than by blanking the surface.

**Why it works:** The threshold makes it testable and the locality requirement preserves context, which is the actual harm a global spinner does.

**In SiteSmith:** Carry the threshold and the locality. Drop 'a skeleton that matches the shape of what is coming' (105-106) — one idiom, and one of the better-known generic tells.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:104-106` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/operate-listing-reconciles — `adopt`

**Solves:** A grid with no total makes the user do arithmetic, and arithmetic done by hand on screen data is where operator errors come from.

**Mechanism:** The surface answers what the rows add up to — totals, counts, what remains.

**Why it works:** It is a completeness obligation with an unambiguous failure test: if the operator reaches for a calculator, the screen is unfinished.

**In SiteSmith:** Carry verbatim.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:36-37` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/operate-motion-reports-state-only — `adapt`

**Solves:** Motion used for character on a working surface is a cost with no return, and scroll-driven effects make a data surface unreadable while it moves.

**Mechanism:** Motion exists to report a state change — a row saving, a value committing, a panel opening — and for nothing else. No scroll-driven anything.

**Why it works:** It ties every permitted animation to a system event, so 'is this motion allowed' has an answer that is not taste.

**In SiteSmith:** Carry the event-tie and the scroll ban. Drop '--motion-fast' (102) — a dead token from a contract file that does not exist in v3 — and state the duration in words or extend floor-lint's ALLOWED_NUMBERS.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:101-102,107` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/operate-multi-step-form-contract — `adopt`

**Solves:** Long data entry where the operator cannot tell how far in they are, cannot find what is wrong, and cannot check their answers before committing.

**Mechanism:** One question group per step, a visible position in the sequence, an error summary before the fields, and a review step showing every answer with a route back to each.

**Why it works:** Four separate failures each get a named remedy, and all four are structural rather than visual — position, summary placement, reversibility.

**In SiteSmith:** Carry all four as one obligation. This is the densest per-line value in the file.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:40-42` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/operate-navigation-shallow-invariant-persistent — `adapt`

**Solves:** Navigation that moves between screens, goes more than two deep, or vanishes at narrow widths, on a surface the operator uses daily.

**Mechanism:** Two levels at most, in the same place on every screen, and at the narrowest width it changes form rather than disappearing.

**Why it works:** Depth budget and invariance are structural properties, testable by walking the screens; neither implies a shape.

**In SiteSmith:** Carry depth, invariance and survival-at-narrow. Drop 'A top bar or a left rail — pick one' (142) and the rail-versus-bar decision rule (144-145): two options is not three unrelated ways, and it excludes command palettes, tab bars and spatial navigation. Drop 960px (152) — SKILL.md:174-179 owns the widths.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:142,152` | low | 0.8 | unchallenged | not stated |

### sitesmith-modes/operate-no-editorial-subsetting — `adopt`

**Solves:** A designer hiding data to keep an operated screen calm. 'The user came for the data and hiding it to keep the screen calm is a disservice.'

**Mechanism:** Nothing the operator needs is withheld; where there is genuinely too much, reduction is performed by the operator through filtering and sorting they control, not by a curated subset chosen in advance.

**Why it works:** It draws the line at who chooses, which is the actual issue, rather than at how much is shown — so it survives on a surface with three fields and one with three hundred.

**In SiteSmith:** Carry completeness plus operator-owned reduction as one rule. Drop 'High,' (168) — density as a register is a look; completeness is the obligation. Drop 'Prose is minimal' (172-173) — a word budget, and SKILL.md:132-143 already owns copy register.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:168-170,175-176` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/operate-orientation-before-work — `adapt`

**Solves:** An operator who must read a whole screen to learn whether it needs them pays that cost on every visit, a thousand times.

**Mechanism:** Within a second the operator knows the object, its state, and the one number that decides urgency.

**Why it works:** It sets a time budget rather than a layout, and the three required facts are checkable.

**In SiteSmith:** Carry the three facts and the one-second budget. Drop 'one line' (32) and drop 'a chrome bar... and under it the status line' (50-51) — that arrangement is the operate-mode equivalent of a hero.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:32,46-47` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/operate-partial-is-a-state — `adopt`

**Solves:** A bulk action where some rows succeeded and some did not, reported as either success or failure. It is the state an operated surface reaches on day one and the first one generated work leaves out.

**Mechanism:** Empty, error, partial and loading are all first-class states. Partial is named explicitly and separately.

**Why it works:** SKILL.md:168 lists loading, empty, error and disabled. Partial is not in that list and is not reducible to any of them — it is the state where the operator must know exactly which half went through.

**In SiteSmith:** Carry partial into the floor file as the fifth state, or add it to section 8's enumeration. Note that the reference to blocks/feedback/empty-state (185) is a dead path in v3.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:183-185` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/operate-shape-promises-only-what-it-delivers — `adapt`

**Solves:** A shape that reads as a control and is not one costs a click and a moment of doubt every time it is seen, which in this mode is constantly.

**Mechanism:** Anything that reads as operable is operable. 'A pill in a data grid reads as a control that can be clicked, so it must be one.'

**Why it works:** Affordance honesty is a behavioural contract, not a look — it constrains the relationship between appearance and behaviour without constraining either alone.

**In SiteSmith:** Carry the affordance contract. Discard the entire radius vocabulary around it (74-83) including 'full-round is for status dots' — that is a corner budget and it does not survive the test.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:76-77,82-83` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/operate-signal-colour-is-reserved — `adapt`

**Solves:** A colour that means something and is also used for decoration stops meaning anything, and the operator learns to ignore it.

**Mechanism:** A colour that carries meaning is not spent on decoration. 'A decorative use of it costs a real one.'

**Why it works:** Stated as reservation rather than as scarcity, it constrains the relationship between signal and field without constraining the field — which is what makes it a floor rather than a palette.

**In SiteSmith:** This is the replacement for the one-accent rule (111). Note that renditions (b) and (c) below let the screen be colourful, which line 126 forbids outright. That difference is exactly the difference between an obligation and a house style.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:126-127` | low | 0.8 | unchallenged | not stated |

### sitesmith-modes/operate-signal-verified-in-every-context — `adapt`

**Solves:** A state colour checked once, on one surface, in one scheme, and then used as text on a light ground where it is illegible.

**Mechanism:** A signal is verified in every context it actually renders in, and where it needs two treatments both are declared with their roles named.

**Why it works:** It catches the failure that a single contrast check misses: the same value used as fill and as text has two different contrast problems and only one gets tested.

**In SiteSmith:** State as per-context verification. Drop the specific treatments named in 123-124 ('dark chrome bar', 'saturated fill colour', 'darkened text colour', 'on paper') — they describe one palette.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:122-124` | medium | 0.75 | unchallenged | not stated |

### sitesmith-modes/operate-state-legible-over-time — `adopt`

**Solves:** An operated surface where the user cannot tell what was saved, what is pending, what failed or how old the number is. 'A dashboard that cannot say how fresh its data is has an unanswerable trust problem.'

**Mechanism:** Four answers are always available: what was saved and when; what is pending and what happens if the operator leaves; what failed, why and what to do; whether the number is current and as of when.

**Why it works:** SKILL.md:168 requires the interactive states to exist and be reachable. This is different and not carried anywhere: the legibility of system state across time, including data freshness, which no state enumeration reaches.

**In SiteSmith:** Carry all four verbatim as the operate-specific replacement for the marketing notion of proof. Freshness in particular has no equivalent in section 8.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:131-138` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/operate-unit-of-work-density — `adopt`

**Solves:** Density picked as taste ('this feels tight enough') produces a screen where a real unit of the operator's job does not fit, so they scroll to complete one task and lose the reconciliation.

**Mechanism:** A working unit of the operator's actual job — a shift's rows, a round's stops, a consignment's lines — must be visible without scrolling, and every dimension downstream is a consequence of that unit rather than a preference. One shared ramp; density selects which end of it is in play, not a second system (67-68).

**Why it works:** It converts a taste decision into a measurable one sourced from the subject's world, which is the same lever as SKILL.md section 3's nouns applied to spacing. Twelve lines fitting is checkable; 'dense' is not.

**In SiteSmith:** State the unit of work in the plan, then let it force the numbers. Never carry the file's own numbers (30px row, 8px ramp, lines 62-64) — they are that derivation already run once, for someone else.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:59-68` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/orientation-and-text-scale-as-verification-axes — `adapt`

**Solves:** A responsive verification matrix that only varies width passes layouts that break when the viewport is short or when the user has enlarged text — two of the commonest real-world failure conditions.

**Mechanism:** The pre-delivery checklist adds two axes beyond width. Orientation: 'Test on 375px (small phone) and landscape orientation' (273) and 'Verified on small phone, large phone, and tablet (portrait + landscape)' (374), backed by 'orientation-support - Keep layout readable and operable in landscape mode' (quick-reference:148). Text scale: 'Verify behavior with reduced-motion enabled and Dynamic Type at largest size' (273-274), 'Reduced motion and dynamic text size are supported without layout breakage' (383), backed by 'dynamic-type - Support system text scaling; avoid truncation as text grows' (quick-reference:69).

**Why it works:** Both are failure conditions the model cannot reason its way to — they must be rendered to be seen. A landscape phone is short, not narrow, so every vertically-centred hero and sticky bar fails there while passing at 375 wide. Enlarged text breaks fixed-height containers and truncates labels that read fine at 100%. SiteSmith's verify.mjs currently varies width only (375/768/1440), so both classes of defect ship undetected today.

**In SiteSmith:** Add two axes to verify.mjs: one short-viewport pass (roughly 812x375) reusing the existing overflow and sticky-element assertions, and one enlarged-text pass at 200% asserting no clipped or overlapping text. Take the axes, not the mobile framing — Dynamic Type is the iOS name for something browser text-zoom tests just as well.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `src/ui-ux-pro-max/templates/base/skill-content.md:272-275,374,383; quick-reference.md:69,148` | low | 0.75 | unchallenged | not stated |

### sitesmith-modes/phone-navigation-obligations — `adopt`

**Solves:** A phone navigation that hides the primary action behind a menu, or that gives no indication of where the visitor currently is.

**Mechanism:** On a phone: a real disclosure rather than a fake one, the current item marked, and the primary action visible without opening the menu.

**Why it works:** Three separable obligations, all behavioural, none naming a form. The current-item obligation is the same rule as the redesign audit's sixth forgotten surface, which is corroboration from a second file rather than duplication.

**In SiteSmith:** SKILL.md section 8, one line.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/marketing.md:165-166` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/preservation-contract — `adopt`

**Solves:** A redesign silently changes things that were never the designer's to change: the router, brand marks, URLs, form field names, analytics event names, priced claims, flagged experiments.

**Mechanism:** A named list of categories that are not yours to change unless the brief says so in words. If a fix requires breaking one, stop and say so rather than deciding it silently.

**Why it works:** It converts an implicit boundary into an explicit escalation. The failure mode it prevents is not aesthetic, it is a broken analytics funnel or an unhonoured guarantee, and those are invisible in any screenshot-based verification. Zero appearance content: it constrains what may change, never what it should become.

**In SiteSmith:** redesign.md, first section, before any pass. Verbatim shape with the five categories preserved.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/tasks/redesign-audit.md:38-48` | low | 0.95 | unchallenged | not stated |

### sitesmith-modes/proof-strength-ladder-with-nothing-as-a-rung — `adopt`

**Solves:** A page needs a proof band, no real proof exists, so proof is invented. Invented proof is the clearest single tell that a machine wrote the page.

**Mechanism:** A descending ladder of proof strength: a named customer with role and company saying something specific, then a dated attributable number, then a real logo wall, then a briefly told case. Use the strongest you actually have. The fifth rung is Nothing, and a page with no proof is stated to be honest.

**Why it works:** Most anti-fabrication rules only forbid. This one supplies a legal move at every level of available evidence, including zero, which is why it does not collapse under pressure. Making 'nothing' an explicit rung removes the incentive that produces the fabrication.

**In SiteSmith:** SKILL.md section 7, appended to the claim-needs-a-source rule: the ladder plus the explicit permission to ship with no proof section at all.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/marketing.md:142-155` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/read-score-repair-phasing — `adopt`

**Solves:** Fixing while reading produces a scattered diff and hides systemic problems behind local ones. Forty files change and nothing measurable improves.

**Mechanism:** Three phases in order, with no editing permitted during phase one. Read the stack and open the largest page and the smallest component. Score every finding with a file reference and fix nothing. Then repair in a fixed order, re-running the affected pass after each group. Four targeted changes beat forty files that improve nothing.

**Why it works:** Separating diagnosis from repair is what makes the systemic finding visible at all: a local fix applied during reading removes the evidence of the pattern it was an instance of. The re-run after each group keeps the judgement honest as the page changes underneath it.

**In SiteSmith:** redesign.md, as the run structure, with the repair order re-pointed at obligations rather than at the appearance-heavy passes.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/tasks/redesign-audit.md:23-36` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/round-numbers-read-as-fake — `reject`

**Solves:** Nominally: detecting fabricated statistics, which are tidy in a way real data is not.

**Mechanism:** 'Round numbers read as fake. Real data is untidy. 47.2% is believable; 50% is a guess.'

**Why it works:** As a detection heuristic it is correct. As an instruction to an author it says make your invented numbers more convincing, which directly contradicts SKILL.md section 7: facts are not yours to invent. It is one line above a rule forbidding invented metrics, in the same list, and the two cannot both be followed. Keep it only in a tells corpus where the reader is auditing rather than writing.

**In SiteSmith:** corpora/tells only, phrased as a detection signal, never as guidance to an author.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/tasks/redesign-audit.md:125` | low | 0.85 | unchallenged | not stated |

### sitesmith-modes/scoring-rubric-with-resumption — `adapt`

**Solves:** A redesign ends with no statement of what improved and no statement of what is still broken, so the next session starts from nothing.

**Mechanism:** Six dimensions scored 1, 3 or 5 before and after: hierarchy, originality, cohesion, responsiveness, usability, slop resistance. Anything still at 2 or below after the repair order is where the next session starts.

**Why it works:** The resumption clause is the load-bearing half: it converts a score into a work item. The dimensions are stated as observable outcomes rather than as visual preferences ('eye path is deliberate at every breakpoint', 'layout genuinely rethought per width').

**In SiteSmith:** redesign.md, with one addition that the original lacks. Originality at 5 reads 'could not be mistaken for another site', and all three round-8 sites passed that per-site test while the portfolio failed. The dimension must be scored against the studio's own previous builds, not against sites in general, or the rubric reproduces the failure with a number attached.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/tasks/redesign-audit.md:196-208` | medium | 0.75 | unchallenged | not stated |

### sitesmith-modes/signature-swap-falsifier — `adapt`

**Solves:** A page that is technically correct and tonally interchangeable. Every check passes and no direction was chosen.

**Mechanism:** Ask what the page would lose if its one distinguishing decision were replaced by the category's default. If the answer is nothing, no direction was chosen.

**Why it works:** Section 6 of the current SKILL.md asks for a Signature and a One risk but gives no way to fail either. This is that test. Stated as a swap rather than as a quality judgement it can be answered concretely, and it is cheap enough to run at the end of the plan rather than at the end of the build.

**In SiteSmith:** SKILL.md section 6, appended to the Signature step. Generalise away from the v2 phrasing, which asks about a different accent hue and therefore presumes an accent-based design.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/marketing.md:193-194` | low | 0.8 | unchallenged | not stated |

### sitesmith-modes/six-states-enumerated — `adapt`

**Solves:** Interactive elements ship with rest and hover and nothing else. Missing states read as unfinished work and are then defended as a stylistic choice.

**Mechanism:** Every interactive element owes six states with a definition each: rest, hover (never the only affordance, because touch has no hover), focus-visible, active, disabled (with the actual attribute, because something that looks pressable and does nothing is a bug), and loading (occupying the shape of what it replaces). Then three page-level states: empty as a composed first-run view, error inline next to its cause with a way forward, and partial.

**Why it works:** Section 8 of the current SKILL.md asserts the states exist. This enumerates them with the failure each one prevents, which is what makes it checkable. The hover-is-not-the-only-affordance clause and the error-placement clause are the two that are absent from v3 and both are behavioural, not visual.

**In SiteSmith:** SKILL.md section 8, expanded from one sentence to the enumeration, minus the skeleton and the scale(0.98) and the duration band.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/tasks/redesign-audit.md:96-112` | medium | 0.85 | unchallenged | not stated |

### sitesmith-modes/skill-applicability-self-gate-with-skip-list — `adapt`

**Solves:** A broadly-described skill triggers on work it cannot help with, spending context and inserting design opinions into backend, data or infrastructure tasks.

**Mechanism:** Three explicit bands — Primary Use Cases (9-15), Recommended (19-25), Skip (29-35, naming pure backend, API/database design, non-visual performance work, infra/DevOps, non-visual scripting) — closed by a single-sentence test at line 37: '判断准则：如果任务会改变某个功能看起来如何、使用起来如何、如何运动或如何被交互，就应该使用此 Skill' ('if the task changes how something looks, how it is used, how it moves, or how it is interacted with, use this skill').

**Why it works:** The Skip list is the working half. Most skill descriptions enumerate what they cover, which biases toward firing; enumerating what they do not cover, plus one falsifiable test, gives the model a way to decline. The test is phrased as an observable property of the change, not of the request wording.

**In SiteSmith:** SiteSmith's trigger description already lists a long set of positive triggers. Add the negative band and a one-line test in the skill body so an over-broad trigger can be declined in the first paragraph rather than after a mode is chosen. Do not carry the three-tier Primary/Recommended/Skip structure — one positive test plus a short Skip list is enough.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `src/ui-ux-pro-max/templates/base/quick-reference.md:1-37` | low | 0.6 | unchallenged | not stated |

### sitesmith-modes/stack-decision-gate — `adopt`

**Solves:** A design task installs a framework into a project that already has one, or adds a second styling system, turning a scoped visual change into an unbudgeted migration.

**Mechanism:** Five filesystem checks plus reading CLAUDE.md, AGENTS.md and README.md before proposing anything. Any single match means skip setup entirely and adopt what is there. A project that documents its stack has chosen its stack. If nothing matches, say so in one line and state what you are about to install before installing it.

**Why it works:** It is a cheap mechanical gate on the most expensive class of mistake in this skill, and it fails closed: the default outcome of the gate is to do nothing. Migrating stacks is named as a separate project with its own budget and risk, which removes the framing under which the mistake seems reasonable.

**In SiteSmith:** stacks/static.md and redesign.md, as the first executable step of any run against existing code.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/tasks/setup.md:17-34,88-93` | low | 0.9 | unchallenged | not stated |

### sitesmith-modes/sufficient-stack-definition — `adopt`

**Solves:** Tooling accretes during a design task. A page ends up with a state library, a component library and three styling systems, and nobody asked for any of them.

**Mechanism:** A stack is sufficient when four things are true: something renders HTML, styles are authored in one system, there is a dev server with hot reload, and there is a production build emitting static assets. Do not add beyond this without being asked. Verify by running dev and build before writing any design code, because a scaffold that does not build is not a scaffold. Every addition is a dependency someone must maintain, and if CSS can do it, use CSS.

**Why it works:** It defines sufficiency positively and closes the list, so additions have to be argued rather than assumed. The build-before-design ordering means the first failure is a stack failure rather than a design failure that turns out to be a stack failure.

**In SiteSmith:** stacks/static.md.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/tasks/setup.md:35-42,66-73,86` | low | 0.8 | unchallenged | not stated |

### sitesmith-modes/transitions-on-transform-and-opacity-only — `adopt`

**Solves:** Animating width, height, top or left forces layout on every frame, so the motion is janky on exactly the devices least able to hide it.

**Mechanism:** Transitions belong on transform and opacity. Geometry is not animated.

**Why it works:** It is a performance obligation stated as a property constraint, and it says nothing about duration, easing or character, which is where the same section immediately becomes appearance three lines later.

**In SiteSmith:** SKILL.md section 8, appended to the motion rule.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/tasks/redesign-audit.md:113-114` | low | 0.8 | unchallenged | not stated |

### sitesmith-modes/twelve-slot-appearance-questionnaire — `reject`

**Solves:** Nothing. It was meant to make each surface kind answer the same design questions consistently.

**Mechanism:** Twelve numbered slots, byte-identical in heading across all three mode files, each supplying 'an answer, not a range' (line 7). Five of the twelve — Density, Radius, Imagery, Motion, Colour emphasis — are named after appearance properties.

**Why it works:** It does not. It administers an appearance questionnaire and then supplies the answer, so every build inherits the same visual decisions before it has a thesis. The proof is that the two modes designed to be most unlike each other give the same answer on colour: product-ui.md:111 and marketing.md:133 are the same one-accent rule.

**In SiteSmith:** Do not carry the twelve headings. Order obligations by when the operator meets them — orientation, work surface, acting, state over time — and never ship a floor file where 'what colour' and 'what radius' are numbered questions a build must answer.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/modes/product-ui.md:7,13-24; cross-checked marketing.md:10-25,88-98,131-141 and ecommerce.md:11-27` | low | 0.95 | unchallenged | not stated |

### sitesmith-modes/verify-imports-against-manifest — `adopt`

**Solves:** A hallucinated import fails at build time and costs a full cycle, and it is a failure mode specific to the agent writing the code rather than to the design.

**Mechanism:** Verify every import against the dependency manifest before writing it.

**Why it works:** It is a pre-condition rather than a post-hoc check, so it costs one file read instead of one failed build and one diagnosis. Nothing in the current v3 package covers it, and it is the only rule in these three files aimed squarely at the author being a model.

**In SiteSmith:** run.md, in the build phase, one line.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `skills/sitesmith/v2/tasks/redesign-audit.md:165-166` | low | 0.8 | unchallenged | not stated |

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

### website-builder-setup/website-builder-setup-numbers-as-authority — `reject`

**Solves:** Making an unverified external dependency sound credible to a non-technical user during onboarding.

**Mechanism:** Specific-sounding counts of design styles, palettes, font pairings and components asserted as scripted dialogue, unbacked by any content in this repo.

**Why it works:** It doesn't, for the task's purposes — it's the lookup-table framing the frontend-design result argues against.

**In SiteSmith:** No role.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `website-builder-setup/SKILL.md:14,16; README.md:45,47` | low | 0.8 | unchallenged | n/a — no data in-repo to test |

Failure modes:
- Convergent output across unrelated projects sharing the identical closed catalog — the same failure class as SiteSmith's 0/8 showcase, potentially worse since shared across every user

Conflicts: Both measured facts in the brief

### website-builder-setup/website-builder-setup-stepwise-onboarding — `reject`

**Solves:** A multi-step external-dependency install flow needs to survive individual step failures without stalling.

**Mechanism:** Narrate one step at a time, never dump all instructions at once, and on failure acknowledge/give manual fallback/keep moving rather than halt.

**Why it works:** Generic UX resilience pattern for scripted multi-step flows with side effects.

**In SiteSmith:** SiteSmith has no comparable flow today; nothing to attach this to.

| source path | context cost | confidence | red team | test method |
| --- | --- | --- | --- | --- |
| `website-builder-setup/SKILL.md:137-143` | low | 0.5 | unchallenged | n/a — no analogous flow currently exists in SiteSmith |

Failure modes:
- None specific

