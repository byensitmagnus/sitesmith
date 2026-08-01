---
title: TESTING — ai-website-cloner-template
ai_generated: "(C)"
---

# What it verifies, and how

Two genuinely different verification regimes coexist in this package, and they should not be
confused with each other.

**Real, tool-backed verification:**
- `npx tsc --noEmit` after every builder agent finishes, and `npm run build` after every worktree
  merge and after Phase 4 assembly (`SKILL.md:118,187,390,400,413`). This is a real, binary,
  externally-checkable gate — the build either compiles or it doesn't.
- The `getComputedStyle()` extraction script (`SKILL.md:239-283`) and the before/after state-diff
  procedure (`SKILL.md:285-296`) are real measurements: actual computed CSS values captured from the
  live DOM, not estimates.

**Narrative, self-graded "verification":**
- The Pre-Dispatch Checklist (`SKILL.md:431-444`) — 9 yes/no items, all self-applied by the same
  agent that wrote the spec being checked.
- The Visual QA Diff (`SKILL.md:415-429`) — the step that is supposed to confirm the clone matches
  the source, and is pure narrative: "compare section by section... for each discrepancy found...".

| Claimed check | Source line | Tool provided? |
|---|---|---|
| TypeScript compiles | `SKILL.md:118,390` | Yes — `npx tsc --noEmit` |
| Production build succeeds | `SKILL.md:187,400,413` | Yes — `npm run build` |
| Computed CSS values are exact | `SKILL.md:239-283` | Yes — the extraction script itself |
| Before/after behavior diff is accurate | `SKILL.md:285-296` | Yes — real two-snapshot diff |
| Spec file is complete (no guessing) | `SKILL.md:431-444` | No — self-applied checklist |
| Clone visually matches source | `SKILL.md:415-429` | No — narrated screenshot comparison |
| Interactive behaviors work in the finished clone | `SKILL.md:426` | No — manual re-walk, no recorded pass/fail |

# Is the proof real or asserted?

Split, and the split matters. **Inputs to the build are measured** — this is genuinely one of the
more rigorous sources in this research set on that front, because `getComputedStyle()` values and
build-compile status are both real, objective, tool-checked facts. **The thing the whole pipeline
exists to guarantee — that the output actually matches the source — is asserted**, exactly like
`frontend-design`'s self-critique loop, via the same mechanism: the same single agent looks at two
screenshots and decides whether they match closely enough.

This is a more dangerous version of the same problem than in `frontend-design`, precisely because
the earlier phases' real rigor creates the impression that the whole pipeline is measured. A user
reading `SKILL.md` sees exact computed styles, DOM enumeration, and diffed before/after states, and
could reasonably assume the final fidelity claim carries the same weight — it does not. Confirmed by
direct inspection: no file in this 61-file repo computes an image diff, DOM-structural diff, or CSS
diff between the source site and the built output.

# Implication

For SiteSmith's own audit-before-redesign step, borrow the measured half unreservedly (the
`getComputedStyle()` extraction pattern, the two-snapshot behavioral diff, build-compiles-or-not as a
hard gate) — these are genuine, portable, tool-backed checks. Do not borrow Phase 5's Visual QA Diff
as specified. Where SiteSmith needs to confirm an output matches an existing target (which is
exactly what an audit-before-redesign task needs to do, repeatedly), it should use an actual measured
comparison — this is a case where the target property (does A match B) is objectively measurable in
principle, unlike "does this look generic," so there is no excuse to leave it to narrative assertion
the way this source does.
