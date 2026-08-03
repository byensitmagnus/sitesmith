---
title: GOOD-PATTERNS — ai-website-cloner-template
ai_generated: "(C)"
---

# What it does better than anyone

## 1. A concrete, reusable extraction script instead of hand-measured values (`SKILL.md:239-283`)

Most guidance about "extract exact CSS" stays at the level of instruction. This source ships the
actual script: a depth-4 DOM walk, a fixed ~40-property `getComputedStyle()` call per node, and a
default-value filter so the output is signal (real, set values) rather than noise (every property
regardless of whether it matters). This is the one mechanism in the whole package that is a genuine
measurement, not an assertion — see `TESTING.md`.

## 2. Naming the exact failure class before it happens, not after (`SKILL.md:81-91`)

"The single most expensive mistake in cloning: building a click-based UI when the original is
scroll-driven, or vice versa" — and then a strict investigative order (scroll first, click second)
that structurally prevents the mistake rather than warning about it after the fact. Compare to
`frontend-design`'s named-cliché list: same technique (name the actual failure concretely), applied
here to a structural/technical mistake instead of an aesthetic one.

## 3. The diff-of-two-snapshots method for documenting behavior (`SKILL.md:285-296,349-358`)

"Capture styles at scroll position 0, then again past the trigger threshold, then diff the two — the
diff IS the behavior specification." This turns "document what changes" from a narrative description
into a mechanical procedure with a real, checkable output: two real snapshots and their delta.

## 4. Inline-only builder contracts, stated as a named anti-pattern twice (`SKILL.md:110-118,456,462`)

"Don't reference docs from builder prompts" and "Don't dispatch builders without a spec file" are
both explicit, both repeated, and both aimed at the same failure: a builder guessing to fill a gap
left by an indirect reference. The spec-file-inline-only pattern removes the builder's ability to
skip a step, rather than trusting it won't.

## 5. A mechanical, numeric split threshold instead of a judgment call (`SKILL.md:43-49`)

"If a builder prompt exceeds ~150 lines of spec content, the section is too complex for one agent...
This is a mechanical check — don't override it with 'but it's all related.'" Explicitly anticipates
and forecloses the rationalization that would otherwise erode the rule (see `MECHANISMS.json` →
`complexity-budget-rule`).

## 6. An illustrative-not-exhaustive framing for its own checklists (`SKILL.md:67`)

The 13-item behavior list is explicitly introduced as "illustrative, not exhaustive... the page may
do things not on this list, and you must catch those too." This is a small but important piece of
honesty: it gives the agent a starting point without letting the agent treat the list as complete
and stop looking once every named item is checked off.
