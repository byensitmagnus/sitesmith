---
title: "UI/UX Pro Max — Good Patterns"
ai_generated: "(C)"
---

Ranked by how much of it is worth re-expressing in SiteSmith.

## 1. Real-browser, evidence-based design review (best thing here)

`stack/.claude/agents/design-review.md:12-21` states the operating principle plainly: *"You do not
guess from the code; you open the page in a real browser and observe it... Screenshots and
observed behavior are your primary evidence."* The 7 phases (`design-review.md:29-64`) go beyond a
static checklist — Phase 1 exercises the actual interaction flow (click, open modals, submit valid
*and* invalid forms), Phase 5 stress-tests edge cases (long strings, empty data, slow network).
Rule at line 94-95: *"If you could not open the page, say so plainly... never invent findings."*

`stack/scripts/design-audit.mjs:51-133` backs this with real DOM measurement, not guesses:
`el.focus()` + `getComputedStyle` to find genuinely non-visible focus indicators
(`design-audit.mjs:82-93`), `getBoundingClientRect()` for actual tap-target sizes and overflow
(`design-audit.mjs:58-79`), and a WCAG relative-luminance contrast formula run over up to 120
sampled text nodes (`design-audit.mjs:113-131`) — openly labelled approximate, not a verdict.

## 2. Honesty about zero-result search

`search.py:64-74` refuses to let an empty search look like a match: *"No matches. This is not a
match with an empty value... Retry... before falling back to general defaults, and say explicitly
that no database match was found if you do fall back."* Paired with `_suggest_terms()`
(`core.py:292-316`), which surfaces real vocabulary near the failed query so the retry has
something concrete to try. This closes a specific, plausible hallucination path (presenting a
built-in default as if it were data-backed) for near-zero cost.

## 3. Safe, idempotent persistence

`design_system.py:710-762`: writes are skipped by default if `MASTER.md` already exists (returns a
structured `skipped_exists` status instead of clobbering), only proceed with an explicit `--force`,
and project/page names are passed through a whitelist slugifier (`safe_slug`, only `[a-z0-9_-]`
survives) specifically so a crafted name can't path-traverse out of `design-system/`. Good defensive
engineering, independent of anything to do with design quality.

## 4. Static UX/accessibility rule tables as knowledge, not decisions

`references/quick-reference.md` and `references/pro-rules.md` are exactly what "make the model
think better" should look like: concrete, checkable facts (contrast ratios, touch-target minimums,
animation timing windows, safe-area rules) organized by priority, loaded only on demand
(`SKILL.md:33`, `pro-rules.md:3`), never prescribing *what a page should look like* — only whether
it's correct. They don't compete with the model's own creative judgement; they inform it.

## 5. The project's own workflow doc names the thing to avoid

`stack/docs/WORKFLOW.md:19-24` is worth reading precisely because it's an admission against
interest: it tells users to run a *separate* taste-oriented skill on top of `ui-ux-pro-max`'s output
specifically to *"explicitly reject the cream+serif and acid-on-black defaults"* the design-system
generator produces. That's the project's own maintainers naming the sameness problem and routing
around it rather than fixing the generator — see `FAILURE-MODES.md` and `VERDICT.md`.
