---
title: taste-skill — Routing
ai_generated: "(C)"
---

# How a path gets picked

There are two separate, unrelated routing layers in this repo. Neither is runtime code — both are prompt-text or install-time choices.

## Layer 1: which skill file loads at all (install-time / trigger-time)

- **Install-time:** `npx skills add https://github.com/Leonxlnx/taste-skill --skill "<install-name>"` copies exactly one `SKILL.md` into the target project (README.md:75-97). The install-name-to-folder mapping lives only in the README table (`README.md:115-136`) and in `skills/llms.txt` — there is no manifest file that enumerates it programmatically for a router to consult; `.claude-plugin/plugin.json` just names the whole repo as one plugin, it doesn't map sub-skills.
- **Trigger-time (if multiple installed):** each `SKILL.md`'s YAML frontmatter `description` (e.g. `skills/taste-skill/SKILL.md:3`, `skills/redesign-skill/SKILL.md:3`) is matched against the user's request by whatever host loaded them (Claude Code, Cursor, Codex). This is exactly the same frontmatter-description-matching mechanism SiteSmith itself already uses for its own skill.
- **On ambiguity:** nothing in the repo defines what happens if two installed skills' descriptions both plausibly match (e.g. both `taste-skill` and `soft-skill` describe "premium" UI). The README instead pushes disambiguation to the human at install time: "Start with taste-skill... Add soft-skill, minimalist-skill, or brutalist-skill when the visual direction is already chosen" (`README.md:140-147`) — i.e., the repo's own routing advice is "don't install the ambiguous combination, choose one deliberately before you start."

## Layer 2: routing inside the flagship skill's own reasoning (design-system map)

This is the closest thing to in-content routing logic:

`skills/taste-skill/SKILL.md:82-119` (§2) is a two-branch decision: does the brief match a named, officially-packaged design system (11 named systems in a table, `:88-100`), or is it "an aesthetic" with no owning package (9 named aesthetics in a second table, `:109-118`)? The signal used is purely the brief's own wording ("Brief reads as...") — matched by the model's judgment against the table's left column, not by any keyword-matching code.

- **Ambiguity handling:** "One system per project. Do not mix Fluent React with Carbon" (`:104`) — the rule resolves ambiguity by forbidding straddling two branches, not by defining a tie-break rule for *which* one to pick when a brief could plausibly read as either. This is left entirely to model judgment.
- **No-match case:** if a brief matches neither table (e.g., a completely novel product with no obvious design-system parallel and no clearly "aesthetic" descriptor), the file has no explicit fallback — the surrounding §3 "Default Architecture" (React/Next/Tailwind v4/Motion) becomes the de facto default by virtue of being unconditional, not because §2 routed there.

## Layer 3: redesign-mode routing

`:787-792` (§11.A) is the other real in-content branch: Greenfield / Preserve / Overhaul, detected as "the first action." On ambiguity it specifies the exact fallback: ask once — "Should this redesign preserve the existing brand, or are we starting visually from scratch?" This is the one place in the repo where ambiguity handling is a concrete, quoted question rather than "use judgment."

## What's missing

No layer in this repo handles **conflicting signals within one brief** (e.g., a brief that names both "GOV.UK-style trust" and "playful Awwwards energy" — §2.A's public-sector row and §2.B's experimental-aesthetic row would both plausibly apply, and nothing adjudicates which wins). The "quiet constraints override aesthetic preference" line in §0.A (`:23`) is the closest thing to a priority rule, but it is stated once in the brief-inference section and not cross-referenced from §2's routing table.
