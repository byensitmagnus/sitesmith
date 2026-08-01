---
title: taste-skill — Testing
ai_generated: "(C)"
---

# What it verifies, and whether the proof is real

## No automated verification exists in this repo

Confirmed by inventory (`find ... -type f`, all non-`.git` files listed in OVERVIEW.md): the only executable scripts in the repo are:

- `scripts/convert-readme-assets-webp.mjs`, `scripts/process-readme-buttons.mjs`, `scripts/process-sponsor-badge.mjs`, `scripts/build-emil-sponsor-row.mjs` — all four convert/process README marketing images to `.webp`. Confirmed by reading the first lines of `convert-readme-assets-webp.mjs` (imports `sharp`, defines a `pngToWebp` list of README button assets). None touch generated output.
- `skill.sh` — a 25-line bash associative array mapping install-names to file paths, printed to stdout for `npx`-style lookup (`skill.sh:1-25`). It runs no tests and executes no generated code.

There is no `verify.mjs`, no Playwright/Puppeteer harness, no axe-core invocation, no Lighthouse CI config, no screenshot pipeline, no CSS/contrast linter, no accessibility test of any kind, anywhere in this repo.

## Every "verification" claim in the skill content is a prompt instruction, not a script

| Claim | Location | What actually happens |
|---|---|---|
| "Run Lighthouse before declaring a page done." | `skills/taste-skill/SKILL.md:541` | Nothing runs Lighthouse. The model is told to say it did. |
| "Test in both modes during development. Do not ship a page you've only seen in one mode." | `:590-591` | No screenshot or rendering step is invoked by anything in this repo; this is a prompt instruction with no supporting tool call. |
| Full Pre-Flight Check (~70 items) | `:910-979` | Self-administered by the same model that generated the page. See `LOOPS.md`. |
| "count instances of `uppercase tracking`... If count > ceil(sectionCount / 3), the output fails" | `:256,933` | This is the one item phrased as *mechanically countable* — but the count is still performed by the model re-reading its own output, not by a script. Trivially automatable (grep the rendered HTML for the CSS signature) but not automated here. |
| "If your output contains a single — or – anywhere visible... the output fails" | `:697-699` | Same: mechanically definable (a regex over rendered text), asserted as a rule, never wired to an actual check in this repo. |
| Image-to-code "Clarity Check" (21 items) | `skills/image-to-code-skill/SKILL.md:1083-1109` | Same self-report pattern as the flagship checklist. |
| Core Web Vitals targets (LCP < 2.5s, INP < 200ms, CLS < 0.1) | `skills/taste-skill/SKILL.md:537-541` | Stated as targets with no measurement mechanism attached. |

## The `research/laziness/` essay is asserted, not sourced

`research/laziness/findings/references.md:1-20` names five "studies" by short label only — no links, no authors beyond project-style names, no venue, no DOI. Specific percentage claims elsewhere in the same directory (`findings/empirical-results.md:44-58`: "+45% output quality," "+115% overall performance," "34% to 80%" accuracy, a "Winter Break Hypothesis" about seasonal ChatGPT laziness) cannot be traced back to a locatable source from anything in this repo. "EmotionPrompt" corresponds to a real, independently findable paper by that informal name; "LazyBench," the "2025 Controlled Laziness Experiments," and the "Compounding Error Avoidance" and "Seasonal Behavior Analysis" citations are not independently verifiable from the citation given. This essay backs `output-skill`'s rules but is decoration, not evidence — see `MECHANISMS.json:uncited-laziness-research-essay`.

## Comparison to what SiteSmith already requires of itself

This repo's own `CLAUDE.md` states: `scripts/verify.mjs` is the proof for any change — screenshots at 375/768/1440px, axe in both color schemes, console errors, dead links, horizontal overflow — and that `benchmarks/06-redesign/before/` must keep failing that script. taste-skill has nothing structurally equivalent: no benchmark corpus that must keep failing, no automated accessibility check, no screenshot-based visual regression, no CI gate at all for the skill content itself (CI in this repo, if any, would only cover the README image-processing scripts, not the SKILL.md rule content).

## Verdict

Every proof-of-quality claim in this repo is **asserted, not tested**. The rules are well-reasoned prose describing what a script *could* check (em-dash presence, eyebrow density, layout-family diversity are all mechanically well-defined), but nothing in the repo actually runs that script. SiteSmith's rebuild should treat the mechanically-definable items from taste-skill's checklists as a to-do list for real automated checks, not reuse the checklist-as-prompt pattern as if it were verification.
