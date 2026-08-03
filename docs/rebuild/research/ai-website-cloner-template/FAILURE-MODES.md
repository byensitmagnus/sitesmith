---
title: FAILURE-MODES — ai-website-cloner-template
ai_generated: "(C)"
---

# Where and how it breaks

## The final fidelity gate is unmeasured, despite everything upstream being measured (`SKILL.md:415-429`)

Phases 1-3 are unusually rigorous about real measurement: `getComputedStyle()` extraction
(`SKILL.md:239-283`), before/after diffing (`SKILL.md:285-296`), DOM-enumerated asset lists
(`SKILL.md:193-225`). Phase 5, "Visual QA Diff" — the step that actually confirms the clone matches
the source — is pure narrative: "compare section by section... for each discrepancy found... fix
the spec or fix the component." No pixel-diff tool, no similarity score, no threshold exists
anywhere in the 61-file repo. Confirmed by direct inspection: `scripts/` contains only
`sync-agent-rules.sh`, `sync-skills.mjs`, and a `.gitkeep`. The rigor upstream creates a false
impression that the whole pipeline is measured; the one step that matters most for the stated goal
(fidelity) is asserted, exactly like `frontend-design`'s self-critique loop, just applied to a
different claim. See `TESTING.md`.

## Asset-download and enumeration scripts are re-authored from scratch every run (`SKILL.md:189-227`)

The DOM-enumeration snippet is real, but the instruction is to "write a download script" from it
each time (`SKILL.md:186,227`) — confirmed: no `download-assets.mjs` exists in the repo, only
`scripts/.gitkeep`. A pattern that doesn't change between runs (enumerate assets, batch-download 4
at a time, handle errors) is being re-derived by the agent every single invocation instead of
hardened once as a real, tested script. Any bug in one run's ad hoc script (e.g. mishandling a
redirect, missing a CORS-blocked asset) has no chance to be fixed once and stay fixed.

## The multi-platform sync system has already broken once, silently (`CHANGELOG.md`, "0.3.1")

`sync-agent-rules.sh` failed to resolve `@file` imports on Windows due to CRLF line endings,
meaning "platform instruction files" for Cline/Continue/Amazon Q/GitHub Copilot silently contained
literal `<!-- Import not found -->` markers instead of the actual Inspection Guide content, for some
period before it was caught and fixed. There is no CI check that generated files are current with
their source — this class of drift can recur with no automated detection.

## `docs/research/INSPECTION_GUIDE.md` describes an output structure the actual pipeline doesn't produce

`INSPECTION_GUIDE.md` (imported wholesale into `AGENTS.md` via `@docs/research/INSPECTION_GUIDE.md`,
`AGENTS.md:65`) instructs producing `DESIGN_TOKENS.md`, `COMPONENT_INVENTORY.md`,
`LAYOUT_ARCHITECTURE.md`, `INTERACTION_PATTERNS.md`, `TECH_STACK_ANALYSIS.md`
(`INSPECTION_GUIDE.md:74-80`) — a five-document output shape. `SKILL.md`, the actual entry point,
produces a different shape entirely: `BEHAVIORS.md`, `PAGE_TOPOLOGY.md`, and per-component
`.spec.md` files (`SKILL.md:166,176,306`), and explicitly forbids referencing separate docs files
from builder prompts (`SKILL.md:456`) — directly contradicting `INSPECTION_GUIDE.md`'s own
"see DESIGN_TOKENS.md" output model. This is vestigial content, inlined into every generated
platform file via the `@file` import mechanism, that no longer matches what the skill it's attached
to actually does.

## The 150-line complexity threshold is an unvalidated constant (`SKILL.md:49,444,458`)

Stated three times as a hard, mechanical rule, but never justified with a measurement — no evidence
in the repo that 150 lines is the actual point past which builder quality degrades, versus 100 or
250. Porting the number verbatim to a differently-shaped spec format (different verbosity per line)
would carry over an arbitrary constant without re-deriving why it was 150 here.

## The behavior checklist and failure log are framed as living documents but have no update mechanism

Both the 13-category behavior list (`SKILL.md:67-79`) and the 12-item "What NOT to Do" list
(`SKILL.md:446-462`, explicitly sourced from "previous failed clones") are static committed prose.
Nothing in the repo captures a new failure when one presumably occurs on a future run and appends it
— the same staleness risk documented for `frontend-design`'s named-cliché list, here applied to
technical rather than aesthetic failure classes.

## No accessibility, performance, or SEO auditing, by explicit design choice (`SKILL.md:22`)

Not a bug — an intentional scope exclusion. But worth naming because SiteSmith's own audit-before-
redesign task likely needs at least some of these (accessibility state, current SEO signals) as part
of "truth before touching," and this source offers zero mechanism for any of them.
