---
title: taste-skill — Workflow Map
ai_generated: "(C)"
---

# Step order of a single run (flagship `skills/taste-skill/SKILL.md`)

There is no external orchestration; the numbered sections of the one file **are** the step order the model is instructed to follow, top to bottom, on every invocation.

| # | Step | Drives from | What happens |
|---|------|-------------|---------------|
| 1 | Brief inference | `SKILL.md:13-39` (§0) | Model reads page kind, vibe words, references, audience, quiet constraints; states a one-line "Design Read"; asks **at most one** clarifying question only if genuinely ambiguous (`:33-36`); otherwise proceeds. |
| 2 | Set dials | `:43-79` (§1) | `DESIGN_VARIANCE` / `MOTION_INTENSITY` / `VISUAL_DENSITY`, baseline `8/6/4`, overridden by a lookup table keyed on vibe words (§1.A) or use-case presets (§1.B). |
| 3 | Pick foundation | `:82-119` (§2) | Branches on whether the brief matches a known official design system (Fluent/Material/Carbon/Polaris/Atlaskit/Primer/GOV.UK/USWDS/Bootstrap/Radix/shadcn/Tailwind) or is "an aesthetic" (glassmorphism, bento, brutalism, etc. — no official package, build honest native CSS). |
| 4 | Apply stack defaults | `:122-159` (§3) | React/Next RSC, Tailwind v4, Motion, icon-library allowlist, dependency verification against `package.json` before any import. |
| 5 | Apply bias-correction rules | `:161-349` (§4) | The bulk of the file: typography, color, layout, materiality, interactive states, hero discipline, image strategy, content density, quotes, theme lock — each with an explicit override path. |
| 6 | Redesign-mode detection (if applicable) | `:787-833` (§11) | Only fires for existing sites: classify Greenfield / Preserve / Overhaul, audit brand tokens + IA + patterns before touching anything, apply modernisation levers in priority order. |
| 7 | Context-aware proactivity | `:352-515` (§5) | Optional techniques (glass, magnetic hover, perpetual motion, GSAP skeletons) gated on the dials set in step 2 — "none of these fire automatically." |
| 8 | Performance/a11y guardrails | `:519-593` (§6, §8) | Hardware-accelerated animation only, reduced-motion mandatory above motion 3, dark-mode dual-token strategy. |
| 9 | AI-tell sweep | `:595-701` (§9) | Explicit ban list, including the absolute em-dash ban (§9.G). |
| 10 | Pre-flight checklist | `:910-979` (§14) | ~70-item self-administered checklist, single pass, same model grading its own output — no independent critic (see `LOOPS.md`). |
| 11 | Ship | — | If any checkbox fails, "the page is not done" — no further process defined for what happens next beyond "fix it." |

Appendices (§A-C, lines 983-1206) are not steps — they are reference material (install commands, canonical doc links, one labeled CSS approximation for Apple Liquid Glass) pulled in only when a step above needs grounding.

# How other skills fit around this

None of the other 12 skills are invoked *by* the flagship file. They are alternative entry points a user or router picks instead of, or on top of, `taste-skill`:

- `redesign-skill` duplicates the audit-first idea of §11 above as a flatter, code-agnostic checklist (no dials, no design-system routing) — a competing implementation of the same job, not a step within it.
- `soft-skill` / `minimalist-skill` / `brutalist-skill` are meant to be layered in *after* a direction is already chosen (README: "Add ... when the visual direction is already chosen") — each hardcodes its own full palette/type/motion system, effectively replacing steps 2-5 above with a fixed answer.
- `gpt-tasteskill` replaces step 2 with a fabricated "Python RNG" ritual (see `MECHANISMS.json` id `gpt-fake-rng`) and step 3-5 with its own archetype-and-hero rules.
- `output-skill` is orthogonal — an anti-truncation prompt add-on with no design content.
- `image-to-code-skill` / `imagegen-frontend-*` / `brandkit` replace the whole workflow with an image-generation-first pipeline (generate reference images → analyze → implement), aimed at Codex specifically.
- `stitch-skill` re-emits the same rule content as a `DESIGN.md` file for Google Stitch's screen generator, a different downstream tool entirely.

# Missing-input behaviour

The skill never defines a hard-fail path for missing input. If the brief is thin, §0.C says: ask exactly one question only when the design read "genuinely diverges" — otherwise **infer and proceed without asking**. There is no fallback content, no default site, no error state defined anywhere in the file for "no brief at all." The dial baseline (`8/6/4`) is the only concrete fallback, and it is described as "reasoned from the brief," which the checklist (`:917`) claims to verify but cannot actually enforce (see `FAILURE-MODES.md`).
