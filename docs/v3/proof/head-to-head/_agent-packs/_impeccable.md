\n# new-work.md\n# New visual work

> Part of the **sitesmith** skill. Verbatim from [impeccable](https://github.com/pbakaus/impeccable) — Apache License 2.0, © Paul Bakaus.
> Reproduced without modification; only this header block and the file name are ours.

---

Use this flow when making a new surface or replacing a visual identity. PRODUCT.md owns product truth. DESIGN.md owns durable visual decisions. A surface brief keeps strategy that belongs only to one route or artifact. Complete [init.md](init.md) first when PRODUCT.md is missing; a missing DESIGN.md does not route back to init.

## 1. Decide what is already true

Read DESIGN.md, representative code, tokens, components, and assets.

- **Redesign:** preserve product truth, content, function, constraints, and explicit brand commitments; replace the old visual world rather than polishing it. The old look is evidence of what the subject is, not authority over what it becomes.
- **Established world:** inherit it. A missing DESIGN.md does not erase a coherent identity already present in code; document that identity instead of inventing a replacement.
- **Incomplete brand:** preserve confirmed assets and recognizable traits, then help the user expand the system for this new surface.
- **No visual authority:** create a new world with the user.

A section, component, feature, or state inside an established surface inherits that surface. Do not turn a local addition into a new identity exercise.

## 2. Ask what will change the work

Ask one round of two or three related questions through the structured question tool when available. Skip settled facts; a precise request may need only a compact confirmation.

- **Persuade:** clarify who must act, what they should believe, and which real proof, content, or assets can earn that belief.
- **Operate:** clarify the task, information, important states, frequency, and constraints.
- **Read:** clarify the reader's question, source material, structure, and wayfinding.
- **Experience:** clarify what leads, how exploration unfolds, and which interaction or transition matters.

Across modes, ask what success looks like, what must remain untouched, and what would make a polished result feel wrong. Do not ask for CSS values or canned aesthetic lanes.

## 3. Choose the right amount of invention

### Extend an existing surface

Inherit its world and composition. Resolve only the new purpose, content, hierarchy, states, interaction, and how the addition joins the surrounding experience. Do not run a concept tournament or change DESIGN.md unless the user approves a durable system change.

### Create a whole surface inside an established world

Keep the visual system fixed. Derive five to seven materially different structures from the content, task, and user behavior, ordered by resonance. For a genuinely open whole page, screen, or flow, run:

`node .claude/skills/impeccable/scripts/concept-seed.mjs --scope surface --mode <mode>`

The script assigns which structure gets built: your top-ranked structure is what every run would ship, and a single ranking is deterministic, so the dice come from outside. Dress its staging challengers in the committed identity and weigh them against your list before building. Never run the script for a local extension or a precisely specified narrow request; shape those directly.

### Create or replace the visual world

1. Name the product's unique mechanism in one sentence, the audience's real scene, its cultural home, and what this first surface must prove. Note the page this category always ships and its predictable opposite; name both as the rut and keep them out of the seven-candidate list, so no die face is spent on the page the category already ships. A brief that paints its own picture, a product name, a titled artifact, a governing metaphor, adds its literal reading to the rut: spend at most one candidate on it and derive the rest from elsewhere in the audience's world.
2. From that cultural world, list seven concrete visual systems, artifacts, places, or rituals the audience knows by heart, each with one line on why it resonates and can carry the mechanism, ordered by resonance. The audience's world includes its graphic and screen traditions, the notation, publications, identity programs, data graphics, and interfaces it reads daily, not only its physical objects; a nameable abstract system (a school of poster, a documentation standard, a data-graphic tradition) is as concrete a candidate as any artifact. What would this thing look like as a physical object; what did its world look like before the web? Near-duplicates count once. When more than three of the seven share one material family, the derivation stopped at the subject's most obvious artifact; the audience's world is larger than that, so dig until the list spans at least three families.
3. Turn that material into complete directions: each joins a reusable visual world to a concrete first-surface experience.
4. Run `node .claude/skills/impeccable/scripts/concept-seed.mjs --scope direction --mode <mode>` and follow what it prints. The script assigns which direction gets built and deals catalog challengers. Fuse each challenger before judging it: the challenger supplies the form and its system grammar, the product supplies every fact, and clarity wins conflicts. Weigh fused challengers against the assigned direction on exactly two axes, audience identification and product clarity; losing to strong grounded material is a valid outcome, and beating a thin or tool-monoculture list is the point.
5. Present one direction, fully committed: its world, first viewport, visitor path, signature interaction, cross-surface reach, and honest risk. Alongside it, offer the one or two fused challengers that survived the weighing as named alternates with a one-line case each, plus re-roll with an optional one-line steer. What you never present is a ranked menu of your own grounded candidates; a lineup of those invites the safest card, while dealt c\n\n# craft.md\n# Craft (deprecated alias)

> Part of the **sitesmith** skill. Verbatim from [impeccable](https://github.com/pbakaus/impeccable) — Apache License 2.0, © Paul Bakaus.
> Reproduced without modification; only this header block and the file name are ours.

---

`craft` is a deprecated alias for an ordinary request to make new visual work. It adds no setup, interview, checkpoint, tool, or quality behavior. Apply SKILL.md's normal routing: create missing PRODUCT.md through [init.md](init.md), then follow [new-work.md](new-work.md) for visual authority, world and surface decisions, implementation, and finish.

Do not tell users they need to invoke `craft`. Natural requests such as “build this feature,” “make a landing page,” or “redesign this screen” use the same flow.
\n\n# critique.md\n> Part of the **sitesmith** skill. Verbatim from [impeccable](https://github.com/pbakaus/impeccable) — Apache License 2.0, © Paul Bakaus.
> Reproduced without modification; only this header block and the file name are ours.

---

### Purpose

Resolve one stable target, run two independent assessments, synthesize a design critique, persist a snapshot, and ask the user what to improve next. The chat response is the primary deliverable; the snapshot is an archive/backlog for future commands.

### Hard Invariants

- Assessment A (design review) and Assessment B (detector/browser evidence) are both required.
- Assessment A and B MUST run as two isolated sub-agents whenever a sub-agent/Task tool is exposed. Running them inline in this context is "possible" but is NOT permitted; it is a degraded run. Inline is allowed ONLY when no sub-agent tool exists (or the user declined, on harnesses that ask).
- If you degrade for any reason, the report's first line MUST be a banner: `⚠️ DEGRADED: single-context (<reason>)`. A silent degraded critique is a failed critique.
- Assessment A must finish before detector findings enter the parent synthesis context. Detector output is deterministic, but it still anchors judgment.
- A skipped detector is a failed critique run unless `detect.mjs` is missing or crashes after a real attempt.
- Viewable targets require browser inspection when available.
- Any local server started only for critique visualization must run in the background, have a recorded stop method, and be stopped before final reporting unless the user asks to keep it.
- Do not claim a user-visible overlay exists unless script injection succeeded and the detector ran in the page.

### Setup

1. **Resolve the target** to a concrete file path or URL. Prefer a source path over a dev-server URL when both identify the same surface; ports drift, paths do not.
   - "the homepage" -> `site/pages/index.astro` or `index.html`
   - "the settings modal" -> the primary component file
   - "this page" -> the current URL or source file
2. **Confirm the target slugs cleanly**:
   ```bash
   node .claude/skills/impeccable/scripts/critique-storage.mjs slug "<resolved-path-or-url>"
   ```
   Every later command also accepts the resolved target directly and derives the same slug internally; never hand-write a slug. If this exits non-zero, skip persistence and trend for this run, but continue the critique.
3. **Read `.impeccable/critique/ignore.md`** if it exists. Drop matching findings silently; it is the only prior-run input critique consumes.

### Assessment Orchestration

Delegate Assessment A and Assessment B to separate sub-agents. They must not see each other's output. Do not show findings to the user until synthesis.

Sub-agent gate (all harnesses):
- Unless a harness-specific gate below overrides this, spawn A and B as two isolated, parallel sub-agents whenever a sub-agent/Task tool is exposed. This is the default and is mandatory; do not run them inline because it is faster.
- "Unavailable" means exactly one thing: no sub-agent/Task tool is exposed in this session (or, on harnesses that ask, the user declined). It does not mean inconvenient.
- If and only if sub-agents are unavailable, fall back sequentially: finish and record Assessment A, then run Assessment B, then synthesize, and emit the degraded banner.
- Whichever path you take, declare it in the report header (see Report header provenance). Skipping sub-agents without the banner is the most common failure of this command.

If browser automation is available, each assessment creates its own new tab. Never reuse an existing tab, even if it is already at the right URL.

### Assessment A: Design Review

Read relevant source files and visually inspect the live page when browser automation is available. Think like a design director.

Evaluate:
- **Design specificity**: Is the composition, interaction, and visual language grounded in this product, or could an unrelated product use it unchanged? Make this judgment before seeing detector output.
- **Holistic design**: hierarchy, IA, emotional fit, discoverability, composition, typography, color, accessibility, states, copy, and edge cases.
- **Cognitive load**: consult the [Cognitive Load Assessment](#cognitive-load-assessment) section below; report checklist failures and decision points with >4 visible options.
- **Emotional journey**: peak-end rule, emotional valleys, reassurance at high-stakes moments.
- **Nielsen heuristics**: consult the [Heuristics Scoring Guide](#heuristics-scoring-guide) section below; score all 10 heuristics 0-4, marking any heuristic the mode-applicability rule allows as `n/a` instead of forcing a number.

Return: design-specificity verdict, heuristic scores, cognitive load, emotional journey, 2-3 strengths, 3-5 priority issues, persona red flags, minor observations, and provocative questions.

### Assessment B: Detector + Browser Evidence

Run the bundled detector and browser visualization evidence. Assessment B is mandatory and must remain isolated from Assessment A until both are complete.

CLI scan:
```bash
node .claude/skills/impeccable/scripts/detect.mjs --json [target]
```

- Pass markup files/directories as `[target]`; do not pass CSS-only files.
- For URLs, skip CLI scan and use browser visualization.
- For very large trees (500+ scannable files), narrow scope or ask.
- Exit code 0 = clean; 2 = findings.
- If the detector entrypoint is missing or fails to load, report deterministic scan unavailable and continue with browser/manual review.

Browser visualization is required for a viewable target when browser automation is available. Use a localhost dev/static URL for local files; avoid `file://` unless the available browser explicitly supports this workflow. Overlay flow:

1. Create a fresh tab and navigate. Prefer the harness's native/browser-canvas screenshot path before hand-rolling a Playwright/Puppe\n\n# typeset.md\n> Part of the **sitesmith** skill. Verbatim from [impeccable](https://github.com/pbakaus/impeccable) — Apache License 2.0, © Paul Bakaus.
> Reproduced without modification; only this header block and the file name are ours.

---

Typography carries information, hierarchy, and voice. Improve it inside the established visual world; do not replace the identity unless the user asked to.

---

## Visitor mode

- **Persuade + Experience:** display type may carry the voice. Use decisive contrast and responsive scale when the composition benefits.
- **Operate + Read:** stability, scanability, and measure come first. A single well-tuned family and fixed role scale are often right.
- **Native:** follow [ios.md](ios.md) or [android.md](android.md), including platform scaling and accessibility behavior.

If typography replacement would create a new identity, route through [new-work.md](new-work.md) and update DESIGN.md. Otherwise preserve confirmed families and improve their use.

## Two isolated assessments

When a sub-agent tool is available and permitted, run these independently; otherwise run them yourself in this order. Do not let detector findings anchor the design assessment.

1. **Typographic assessment:** inspect representative pages and styles. Answer every question below with a file, selector, or computed value:
   - **Authority and fit:** Which faces, weights, and roles are established? Do they fit the product and selected world, or are they unexamined defaults? Is every family necessary?
   - **Hierarchy:** Can heading, body, label, metadata, and data roles be distinguished at a glance? Are adjacent sizes or weights too close to carry different jobs?
   - **Scale and consistency:** Is there a deliberate role scale, or a collection of arbitrary values? Do repeated roles stay identical across screens and states?
   - **Reading:** Does body copy stay within a comfortable 45–75 character measure? Are line height, paragraph rhythm, contrast, and tracking tuned to the actual face, width, language, and surface?
   - **Stress:** What happens with long headings, localization expansion, zoom, narrow containers, missing weights, and font fallback?
   - **Delivery:** Are only used assets loaded? Do fallback metrics, loading strategy, and variable-font settings avoid invisible text and disruptive reflow?
2. **Mechanical scan:** run:

```bash
node .claude/skills/impeccable/scripts/detect.mjs --json --scope type [target files or dirs]
```

Also inspect dynamic or arbitrary font values the detector cannot interpret. Synthesize both assessments before editing, noting what each caught alone. A clean scan is a floor, not proof of good typography.

## Set the system

Before editing, state:

- the roles the interface needs;
- the intended contrast between those roles;
- the reading measure and density;
- which existing faces and weights are authoritative;
- any performance, localization, or accessibility constraints.

Use the fewest roles and families that make the hierarchy unmistakable. Combine size, weight, space, and tone deliberately instead of asking size alone to do all the work. Role names and tokens should describe purpose rather than values.

## Apply

- Keep body copy comfortably readable and zoomable. Use 1rem / 16px as the ordinary web body floor unless a dense role, platform convention, or user setting justifies otherwise.
- Keep prose in the 45–75ch range. Tune line height inversely with measure: wider lines generally need more leading.
- Compensate light text on dark surfaces on all three perceptual axes: slightly more line height, a touch more tracking, and one step more weight when the face needs it.
- Tune line height to the face, width, language, and contrast, not a universal ratio.
- Keep repeated roles consistent across screens and states.
- Use numeric, tabular, code, and label features when their content benefits.
- Load only used font assets and weights. Provide metric-compatible fallbacks and avoid blocking text.
- Let marketing display type respond to available space when useful; keep dense product and reading surfaces spatially predictable.
- Preserve browser zoom, user font settings, Dynamic Type, and platform text scaling.
- Use paragraph spacing or first-line indentation as the primary paragraph rhythm; combining both usually double-marks the boundary.

Do not make type decorative at the expense of comprehension, or introduce a second family without a clear role it alone can perform.

## Verify

- Primary, secondary, body, and metadata roles are recognizable without reading the copy.
- Long text remains comfortable across relevant widths and languages.
- The typography belongs to the product and its established world.
- Loading does not create disruptive reflow or invisible text.
- Zoom, text scaling, focus, contrast, and reduced viewport paths remain usable.
- The final mechanical scan has no unexplained findings.

Answer each item with rendered or source evidence, then rerun the scan. Do not substitute a bare “yes” for verification.

When the hierarchy holds, hand off to `/impeccable polish`.

## Live-mode signature params

Every variant declares a coarse `scale` parameter and authors its type ramp against `var(--p-scale, 1)`.

```json
{"id":"scale","kind":"range","min":0.85,"max":1.3,"step":0.05,"default":1,"label":"Scale"}
```

Add at most one pairing or weight parameter when it represents a real system choice. Follow [live.md](live.md)'s parameter contract.
\n\n# layout.md\n> Part of the **sitesmith** skill. Verbatim from [impeccable](https://github.com/pbakaus/impeccable) — Apache License 2.0, © Paul Bakaus.
> Reproduced without modification; only this header block and the file name are ours.

---

Layout turns product priority into reading order, grouping, rhythm, and usable space. Diagnose the structural problem before moving boxes.

---

## Visitor mode

- **Persuade + Experience:** composition may be asymmetric, fluid, or intentionally disruptive when the selected world earns it.
- **Operate + Read:** predictable structure, stable density, and navigable linearity are affordances.
- **Native:** follow [ios.md](ios.md) or [android.md](android.md) for navigation, insets, adaptation, and touch targets.

Preserve the established visual world. A layout command changes structure inside it; identity replacement belongs to [new-work.md](new-work.md).

## Two isolated assessments

When a sub-agent tool is available and permitted, run these independently; otherwise run them yourself in this order.

1. **Layout assessment:** inspect representative states and viewports. Answer every question below with rendered or source evidence:
   - **Reading order:** Apply the squint test. With detail blurred, can you still identify the primary element, the secondary element, and the major groups in order?
   - **Grouping:** Are related items close and distinct groups separated, or are containers compensating for weak proximity?
   - **Rhythm:** Do tight and generous intervals create a deliberate cadence, or is one spacing value repeated until everything has equal weight?
   - **Structure:** Does the topology match the content and task? Are repeated cards, columns, or sections genuinely equivalent, or merely a framework default?
   - **Density:** Does the amount of information per region fit use frequency, decision complexity, and visitor mode?
   - **Adaptation:** At narrow, intermediate, wide, zoomed, and localized states, what reorders, collapses, wraps, scrolls, or remains fixed? Does DOM and focus order still agree with the visual order?
   - **Extremes:** Do long content, empty states, overlays, sticky elements, safe areas, and small touch targets expose structural failures?
2. **Mechanical scan:** run:

```bash
node .claude/skills/impeccable/scripts/detect.mjs --json --scope layout [target files or dirs]
```

Also inspect arbitrary spacing, overflow, stacking, and container behavior the detector cannot resolve. Keep mechanical evidence out of the first assessment, then synthesize both passes before editing. A clean scan cannot prove hierarchy or rhythm.

## Set the spatial thesis

Before editing, name:

- the primary reading or task path;
- what belongs together and what must separate;
- which element leads and which supports;
- the intended density and spacing rhythm;
- how the structure changes across containers, viewports, input modes, and content extremes.

Choose the simplest structural model that expresses those relationships. Use layout primitives according to the relationships they control, and name reusable spacing and container roles semantically.

## Apply

- Group by meaning. Use proximity before adding containers or decoration.
- Create rhythm through deliberate contrast between tight and generous intervals.
- Use a documented spacing scale rather than one-off values. A 4-unit base usually provides the useful middle steps that an 8-only scale misses.
- Let hierarchy follow product priority, not framework defaults.
- Keep distinct content visually distinct without turning every group into an isolated component.
- Make responsive behavior structural: reorder, collapse, reflow, or reveal based on what remains important.
- Prefer container-aware components when the same component appears in different contexts.
- Use `gap` for sibling rhythm when it expresses the relationship more directly than child margins.
- Keep touch targets usable even when their visible marks are small.
- Use depth only when it clarifies state or hierarchy.
- Make optical corrections only after inspecting the rendered result.

Variation is not a goal by itself. Repetition should support recognition; break it only when content or priority changes.

## Verify

- The squint test still reveals the primary, secondary, and major groups in order.
- The reading and task path remains clear at every supported size.
- Related content groups naturally; unrelated content does not blur together.
- Tight and generous spacing create intentional rhythm instead of monotonous repetition.
- Density matches use frequency and content complexity.
- Long text, empty states, localization, zoom, and dynamic content do not break the structure.
- Keyboard, touch, and assistive-technology order agree with the visual order.
- The final mechanical scan has no unexplained findings.

Answer each item with rendered or source evidence, then rerun the scan. Do not substitute a bare “yes” for verification.

When the structure holds, hand off to `/impeccable polish`.

## Live-mode signature params

Every variant declares a coarse `density` parameter and authors spacing against `var(--p-density, 1)`.

```json
{"id":"density","kind":"range","min":0.6,"max":1.4,"step":0.05,"default":1,"label":"Density"}
```

Add one structural parameter only when the topology genuinely branches. Follow [live.md](live.md)'s parameter contract.
