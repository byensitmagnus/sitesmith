---
title: VERDICT — ai-website-cloner-template
ai_generated: "(C)"
---

# The single most valuable thing to steal

The `getComputedStyle()` extraction script paired with the two-snapshot behavioral diff
(`SKILL.md:239-283,285-296`, `MECHANISMS.json` → `computed-style-extraction-script`,
`exhaustive-state-capture`). This is the one mechanism in the whole 61-file repo that is a genuine
*measurement*, not an assertion — a real DOM walk producing real computed values, and a real
before/after diff for stateful elements. It is also the mechanism most obviously relevant to
SiteSmith's actual need here: a REDESIGN task that must audit an existing site's true current state
*before* touching it. Nothing about this mechanism pushes the model toward a fixed look — it
measures whatever is actually there — so it sits cleanly on the safe side of both measured facts:
it doesn't replace judgment with a lookup table (it's a measurement tool feeding judgment, not a
decision itself), and it can't converge sites toward a house style (its output is entirely
target-dependent).

# The single most dangerous thing to copy

The Visual QA Diff (`SKILL.md:415-429`, `MECHANISMS.json` → `visual-qa-diff-unmeasured`) and the
git-worktree parallel-builder-dispatch machinery (`SKILL.md:377-403`,
`MECHANISMS.json` → `git-worktree-parallel-builder-dispatch`) — for two different reasons. The
Visual QA Diff is dangerous because it's invisible: everything upstream is measured so rigorously
that a reader assumes the fidelity claim at the end carries the same weight, when in fact it's the
same self-graded, unfalsifiable "look and decide" loop this research set has already flagged in
`frontend-design`, applied to a claim (does A match B) that is actually measurable and therefore has
no excuse for staying narrative. The worktree-dispatch machinery is dangerous for the opposite
reason — it's visible, impressive, and easy to want to import wholesale, but it solves a problem
SiteSmith's audit-before-redesign task doesn't have: it exists to parallelize *construction* of a
brand-new codebase, not to *measure* an existing one. Importing it would add real orchestration
complexity (concurrent sub-agents, git worktree management, merge-conflict judgment) with no
corresponding gain for a task that doesn't build a parallel target in the first place.

# Judged against the two measured facts

This source is not in tension with the frontend-design-vs-SiteseSmith finding (55 lines beating
630k tokens) in the way a creative-direction skill would be, because this is not a creative-direction
task. Its job is fidelity to an external, already-fixed target — there is no "house style" for a
faithful clone to converge toward, because the target itself dictates the style. The house-style
warning from the three-sites-converged finding therefore does not indict this source's *purpose*;
it does indict two of its mechanisms for unrelated reasons — the unmeasured QA step (asserts a claim
that should be measured) and the worktree-dispatch step (adds orchestration weight disproportionate
to what an audit needs). Where this source earns adoption, it earns it the same way the winning
55-line skill did: by giving the model concrete, falsifiable things to check (an exact `getComputedStyle`
value, a named failure class, a bounded state-diff) rather than a vague instruction to "extract
everything" — the same "make the model's judgment sharper, don't replace it with a script" principle,
just applied to measurement discipline instead of aesthetic taste.

# One-line verdict

The extraction discipline here is genuinely the strongest in this research set and should anchor
SiteSmith's audit-before-redesign step almost unmodified; the fidelity *check* at the end of the
pipeline, and the heavy multi-agent construction machinery built around it, both belong to a
different product (a from-scratch site cloner) than the one SiteSmith is building (an in-place
redesign auditor), and should not follow the extraction mechanisms into the rebuild.
