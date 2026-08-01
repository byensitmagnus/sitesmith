---
title: "Impeccable — Failure Modes"
ai_generated: "(C)"
---

## The flagship mechanism partially depends on a private, unshipped service

`skill/scripts/concept-seed.mjs:62-66,97`: challenger-concept data resolves "a local catalog directory (the private service repo, evals, and tests set IMPECCABLE_CATALOG_DIR), then the roll API at impeccable.style, then a degraded assignment-only seed when both are unavailable... The full catalog does not ship with the skill." The forced-index anti-argmax mechanism (the strongest single idea in the repo, see `MECHANISMS.json: forced-index-direction-roll`) still works offline, but the richer "challenger" half — 6 outside forms per roll, weighted by human-approval ratings, quality-bar reference images — only exists behind a hosted API this public repo doesn't include the data for. A clean-room rebuild inherits the weaker, degraded path by default.

## Telemetry phones home to a third-party domain by default

`concept-seed.mjs:171-194` (`pingChosen`) POSTs the chosen challenger id to `impeccable.style/api/chosen` unless `DO_NOT_TRACK` or `IMPECCABLE_NO_TELEMETRY` is set, and `context.mjs:76-81` performs a daily update-check network call to the same host. Both are opt-out, not opt-in, and both are undisclosed in the SKILL.md the model reads (`SKILL.src.md` never mentions telemetry) — a rebuild inheriting this pattern uncritically would silently create the same undisclosed-network-call surface.

## Extremely dense, run-on prose likely tuned to one model's parsing, not general legibility

`skill/reference/new-work.md:46-53` are single "paragraphs" running 300-500+ words each, densely packed with nested conditionals and exceptions (e.g. the direction-roll instruction in one ~300-word sentence covering assignment, fusion, weighing axes, hand size, dropped-challenger disclosure, re-roll pool, and the standing-exit interaction, all in one breath). This reads like content iteratively hardened against one specific model's failure modes rather than authored for cross-model clarity — a real risk given SiteSmith explicitly targets model-agnostic reasoning. The `<claude>`/`<codex>`/`<gemini>` conditional blocks scattered through `craft-floor.md` and `new-work.md` confirm the authors found meaningfully different failure modes per model and patched each with bespoke prose rather than a shared principle.

## Reference files are individually huge, undermining progressive loading

`critique.md` is 43,562 characters (~10,900 tokens) and `new-work.md` is 29,455 characters (~7,360 tokens) — each loaded in full for a single command. Compare to `SKILL.src.md` itself at 11,190 characters. A routing system that's supposed to load only what's needed per command still pulls in five-figure-character files per invocation; this is a real context-cost problem for anyone trying to keep an agent's working context lean (see `CONTEXT-STRATEGY.md`).

## Guardrails are prose promises, not code-enforced

The mandatory `⚠️ DEGRADED` banner (`critique.md:8-9`), the finish reviewer's "disposition... derived, never felt... the parent... has no authority to soften it" (`impeccable-finish-reviewer.md:40`), and the documenter's anti-canonization check (`impeccable-documenter.md:30-31`) are all enforced entirely by instructing the model to police itself — there is no code check that the parent agent actually printed the banner, respected the disposition word, or skipped canonizing a banned pattern. Given the repo's own admission that "the last two live sessions shipped five kickers past a reviewer that never looked" (context inside `craft-floor.md`'s surrounding material), these guardrails demonstrably do fail in practice and the fix is another prose instruction layered on top, not a structural one.

## The anti-slop ban list is a frozen snapshot of one aesthetic era

`cli/engine/registry/antipatterns.mjs:22-30,51-67` names specific fonts (Inter, Roboto, Fraunces, Geist, Plus Jakarta Sans, Space Grotesk) and specific palettes (purple/violet gradients, cyan-on-dark, cream/beige) as "the" AI tells. This is exactly right for the moment this snapshot was taken, and exactly the kind of list that goes stale as soon as the next wave of models converges on a *different* handful of defaults — the mechanism has no self-updating property; it must be hand-maintained indefinitely or it will eventually ban yesterday's tells while missing today's.

## Hardcoded, unexplained numeric choices baked into the roll mechanism

`concept-seed.mjs:295`: `const buildIndex = 3 + Math.floor(unit(indexSalt) * (candidateCount - 2))` — the assigned index is always ≥3 (never the model's #1 or #2 pick) and candidateCount is clamped to 5-7 (`:287-289`). These specific numbers are asserted, not derived or explained anywhere in the file's own extensive comments — a rebuild copying the formula without understanding why "3" and "5-7" were chosen inherits an arbitrary constant.

## Twenty commands plus aliases is real routing surface, by the repo's own admission

`SKILL.src.md:75`: "`craft` is a deprecated alias for ordinary new-work and adds nothing" — a command that ships in the table (line 46) purely as legacy cruft the model must still recognize and route around. `teach` similarly aliases `init`. This is the kind of accreted surface area the brief's simplicity concerns (elsewhere in this project) explicitly want SiteSmith to avoid; it did not stay lean over the repo's own iteration.

## Native-platform and web-only gating is scattered, not centralized

Multiple reference files (`routing.md:13`, `audit.md:5`, `adapt.md:5`) each separately state "Web only... native platforms route to X.native.md instead" — the same conditional repeated per file rather than resolved once at the entry point. A rebuild should centralize this dispatch rather than copy the repeated-per-file pattern.
