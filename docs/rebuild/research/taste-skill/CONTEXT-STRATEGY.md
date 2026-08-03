---
title: taste-skill — Context Strategy
ai_generated: "(C)"
---

# Always-loaded vs conditional

This repo has no progressive-disclosure mechanism at the file level (no "load section on demand" system, no separate reference files the flagship skill pulls in lazily). Each `SKILL.md` is a single monolithic file; whatever skill is triggered, the entire file loads into context at once. "Conditional" here means *sections of prose that only become relevant if a particular design read is made*, not sections that are mechanically excluded from the context window.

## Flagship skill (`skills/taste-skill/SKILL.md`) — the always-loaded set

`wc -c` on the file: **88,459 characters**. Estimated token cost: 88,459 / 4 ≈ **22,115 tokens** (character-count-divided-by-4 heuristic, as instructed). That is what was measured — no tokenizer was run.

Everything in this file loads on every invocation, regardless of whether the brief needs it:

| Section | Approx. lines | Always relevant? |
|---|---|---|
| §0 Brief inference | 13-39 | Yes — every run |
| §1 Dials | 43-79 | Yes — every run |
| §2 Brief→system map | 82-119 | Loaded fully but only ~1 row of the table (§2.A) or ~1 row of §2.B actually applies to any given brief — the other ~15 rows are dead weight for that run |
| §3 Architecture defaults | 122-159 | Yes if the stack is React/Next/Tailwind (the file's own default); dead weight for any other stack |
| §4 Bias-correction (typography/color/layout/materiality/states/images/density/quotes/theme) | 161-349 | Mostly yes — this is the bulk of the anti-slop content |
| §5 Context-aware proactivity + 2 GSAP skeletons | 352-515 | **Conditionally relevant in principle** (glass/motion/GSAP only "when the design read calls for them") but structurally always loaded since it's the same file |
| §6 Perf/a11y | 519-549 | Yes |
| §7 Dial technical reference | 552-569 | Restates §1 in more detail — largely redundant with §1 |
| §8 Dark mode protocol | 572-591 | Yes |
| §9 AI tells (incl. em-dash ban) | 595-701 | Yes — this is ~106 lines of enumerated bans |
| §10 Reference vocabulary | 705-779 | Glossary — always loaded, rarely all used in one build |
| §11 Redesign protocol | 783-833 | **Only relevant for redesigns**, but always loaded even for greenfield builds |
| §12 Block library contract | 835-893 | Schema-only, no actual blocks exist; always loaded for no payoff (see FAILURE-MODES.md) |
| §13 Out of scope | 896-906 | Yes — cheap, useful |
| §14 Pre-flight checklist | 910-979 | Yes — restates rules from §4/§9 a second time in checklist form |
| Appendices A-C (install commands, doc links, Liquid Glass CSS) | 983-1206 | **Only relevant if a specific design system or Liquid Glass is chosen** — ~220 lines (roughly a fifth of the whole file) that apply to at most 1-2 of the ~11 named systems on any given run |

Rough estimate: of the ~22,115 tokens, perhaps **60-65%** (§0, §1, §4, §6, §8, §9, §13) is genuinely load-bearing on every run; the rest (§2's unused rows, §3 if off-stack, §7's restatement, §11 on a greenfield build, §12's empty schema, most of the appendices) is context spent on material that does not apply to the specific brief at hand.

## Other skills — mutually exclusive alternatives, not layered

Because each `skills/*/SKILL.md` is a complete standalone file rather than a module, none of them are "conditionally loaded" *underneath* the flagship skill — a user/router picks one file to install or trigger. Their individual sizes (character counts, `/4` for token estimate):

| Skill | Chars | Est. tokens |
|---|---|---|
| taste-skill (flagship, v2) | 88,459 | ~22,115 |
| image-to-code-skill | 37,670 | ~9,418 |
| taste-skill-v1 | 21,421 | ~5,355 |
| redesign-skill | 15,238 | ~3,810 |
| soft-skill | 10,659 | ~2,665 |
| brutalist-skill | 8,548 | ~2,137 |
| minimalist-skill | 7,986 | ~1,997 |
| gpt-tasteskill | 7,931 | ~1,983 |
| output-skill | 2,641 | ~660 |
| `skills/llms.txt` (index of all skill descriptions, used for install-time discovery) | 1,859 | ~465 |

`skills/llms.txt` is the one file genuinely designed for cheap, always-loaded discovery — one line per skill, used by the `npx skills add` CLI to list what's installable without loading any full `SKILL.md`.

## What this means for SiteSmith's rebuild

The flagship file pays a ~22k-token tax on every invocation for content that is frequently irrelevant to the specific brief (unused design-system rows, redesign protocol on greenfield builds, an empty Block Library schema, appendices for design systems not chosen). A rebuild should split along the axis this repo blurred: a small always-loaded core (brief inference + a short list of absolute bans like em-dash + scope boundary) and genuinely conditional reference material (per-design-system install/doc blocks, GSAP skeletons, redesign protocol) loaded only once the design read has determined it's needed — which requires an actual file-splitting/reference mechanism, not one giant markdown file.
