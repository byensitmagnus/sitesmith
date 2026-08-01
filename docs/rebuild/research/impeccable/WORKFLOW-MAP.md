---
title: "Impeccable — Workflow Map"
ai_generated: "(C)"
---

# The actual step order a run takes

## 0. Every invocation, no matter the command

1. Run `node scripts/context.mjs [--target <path>]` once per session. (`skill/SKILL.src.md:21`)
   Implemented in `skill/scripts/context.mjs` (1,450 lines): resolves PRODUCT.md / DESIGN.md / matching surface brief / native-platform guidance by walking a path-resolution order (active project root → `.agents/context` or `docs` → monorepo root → `$IMPECCABLE_CONTEXT_DIR` → nothing-found default; `context.mjs:11-24`). Emits `NO_PRODUCT_MD:` when nothing exists, which is the branch signal the rest of the skill keys off (`context.mjs:5-9`).
2. Pick the one reference doc that "owns" the request: the Commands table row, or `reference/new-work.md` for a new/replacement surface. (`SKILL.src.md:22`)
3. Inspect the target and at least one incumbent-truth source (tokens/theme/CSS/component/asset) before editing. (`SKILL.src.md:22`)
4. Load `reference/craft-floor.md` immediately before editing UI (not for planning-only work). (`SKILL.src.md:23`)

## 1. No-argument path (`routing.md`)

- If `NO_PRODUCT_MD`: lead the menu with `init` as the top recommendation, still show the rest.
- Else: run `node scripts/context-signals.mjs` once, read the JSON (`context-signals.mjs`, 334 lines — computes `setup.hasDesign/hasCode`, `critique.latest`, `git.changedFiles`, `devServer.running`, `scan.targets`), and lead with 2-3 highest-value next commands with one-line reasons. Never auto-runs anything.
- If `scan.targets` non-empty and platform is web (not ios/android/adaptive): run `detect.mjs --json <targets>` once and fold hits into the picks.

## 2. New/replacement surface path (`new-work.md`)

1. **Decide what is already true**: redesign / established world / incomplete brand / no visual authority (`new-work.md:5-14`).
2. **Ask** one round of 2-3 mode-specific questions through a structured question tool (`new-work.md:16-25`).
3. **Choose invention amount**: local extension (inherit, no roll) vs whole-surface-in-established-world (`concept-seed.mjs --scope surface`) vs create/replace world (`concept-seed.mjs --scope direction`) (`new-work.md:27-57`).
   - For a new/replacement world, the direction-roll step is a **hard gate**: "writing artifact code before this script has run ... is a contract violation" (`new-work.md:46`).
   - The script (`concept-seed.mjs`) hashes a random/reproducible key to pick a forced index into the model's OWN resonance-ordered candidate list (never a challenger), deals up to 6 external "challenger" concepts from a catalog/API, and returns rendered instructions demanding the model build the assigned index, not its top pick.
   - Present the assigned direction + up to 3 challenger cards + a "canon"/standing-exit option through `serve-question.mjs` (spins up a local page, `--wait` polls for the answer) or a structured-question-tool fallback.
4. **Commit the world**: color strategy, typography (explicit ban-list of generic AI-default fonts), calibration self-check against known AI-look clusters (`new-work.md:61-69`), record a THESIS/OWN-WORLD/STORY/FIRST-VIEWPORT/FORM contract as an HTML comment in the shipped markup (`new-work.md:73`).
5. Update the surface brief (`surface-brief.mjs read/write`) if durable route-level strategy was set.
6. If image generation exists: visualize 3 compositional options before build (`visualize.md`).
7. **Build** with full commitment (`new-work.md:89-99`).
8. **Inspect and finish**: batched desktop+mobile screenshot round → fix → at most one more round → spawn `impeccable-finish-reviewer` fresh (no forked context) → apply fixes → recapture → spawn/rescore same reviewer for a verdict → stop after 2 rounds regardless of outcome → spawn `impeccable-documenter` to write DESIGN.md from the built artifact (`new-work.md:103-109`).

## 3. Command path (explicit/implied sub-command)

Load the matching `reference/<command>.md` (native variant when platform is ios/android/adaptive) and follow it. Two ambiguous commands → ask once.

Representative commands traced in depth: `critique.md`, `audit.md`, `polish.md`, `harden.md`, `adapt.md`, `craft-floor.md` (loaded as a cross-cutting gate, not a command).

## 4. Critique flow (`critique.md`)

1. Resolve target → slug it (`critique-storage.mjs slug`).
2. Read `.impeccable/critique/ignore.md` if present (the only prior-run input critique consumes).
3. Spawn **two isolated sub-agents in parallel**: Assessment A (design review, no detector output visible to it) and Assessment B (deterministic `detect.mjs --json` scan + browser-overlay injection). Sequential-with-degraded-banner is the only fallback, and only when no sub-agent tool exists.
4. Synthesize into one report: Nielsen 10-heuristic table, design-specificity verdict, priority issues (P0-P3), persona red flags, minor observations, questions.
5. Persist snapshot (`critique-storage.mjs write`) + read trend (`critique-storage.mjs trend ... 5`).
6. Ask 2-4 targeted questions tied to actual findings → present a Recommended-Actions command list ending in `polish`.

## 5. Audit flow (`audit.md`)

Score 5 dimensions (A11y, Performance, Theming, Responsive, Implementation Integrity) 0-4 each from static/rendered inspection + the same `detect.mjs` engine for dimension 5. Produces a report only — "Don't fix issues; document them for other commands to address" (`audit.md:1`).

## 6. Polish flow (`polish.md`)

Refinement only, never concealed redesign. Establish system → classify each drift (missing token / one-off implementation / conceptual mismatch / local defect) → gather evidence (optionally reads latest critique snapshot) → triage in a fixed severity order → fix whole path → verify with a fixed checklist → finish with a source diff.

## 7. Hardening / adaptation (`harden.md`, `adapt.md`)

Both are static checklists (extreme inputs, error scenarios, i18n; then device/context rethink for `adapt.md`) with no external tooling — pure prompt content, handed off to `polish` at the end.
