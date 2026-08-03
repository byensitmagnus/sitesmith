---
title: "UI/UX Pro Max — Loops"
ai_generated: "(C)"
---

## Inside `.claude/skills/ui-ux-pro-max/` itself: no loop

There is no iteration, no critique pass, and no rejection mechanism anywhere in the skill's own
workflow (`SKILL.md`). `design_system.py:generate()` runs once, top to bottom, and returns a single
answer per call — there is no "generate N candidates, score them, keep the best" structure, and
nothing that can reject its own output and try again. The closest thing to a loop is the model being
told, on a **zero-result search only**, to retry once with broader keywords before falling back
(`SKILL.md:151-154`) — that is a retrieval retry, not a design critique loop, and it only fires when
the BM25 search returns nothing at all, never when it returns a low-quality or generic match.

**Stop condition:** immediate — one search, one design-system call, done. There is no configured
number of iterations because there is no iteration.

**Who critiques:** no one, inside this skill.

**Can the whole direction be rejected:** no. Nothing in `design_system.py` or `SKILL.md` has a
concept of rejecting the generated style/color/typography bundle and producing a different one —
the model would have to do that entirely on its own initiative, outside anything the skill
instructs.

## Outside the skill, in the sibling `stack/` starter repo: one real loop

`stack/docs/WORKFLOW.md:1-84` documents an actual **plan → commit → build → see → review** loop,
but it is a documented human/model workflow across *separate tools*, not a mechanism inside
`ui-ux-pro-max`:

1. **Plan** — `/design-plan` calls `ui-ux-pro-max --design-system` (the deterministic generator
   from `LOOPS.md`'s first section).
2. **Commit to a look** — a *different* skill, `frontend-design` (not in this repo — referenced by
   name only, `stack/CLAUDE.md`/`WORKFLOW.md:19-24`), is invoked specifically to reject the
   generator's own defaults ("cream+serif and acid-on-black").
3. **Build.**
4. **See** — open the real page in Playwright, screenshot, interact (`WORKFLOW.md:31-41`). This is
   presented as *"the step that matters"* — catches things like a missing focus ring or a badge
   overlapping a card border, and the model "fixes each and re-screenshots" (`WORKFLOW.md:41`).
5. **Review** — `/design-review` invokes the 7-phase subagent (`stack/.claude/agents/design-review.md`,
   see `MECHANISMS.json`'s `design-review-subagent-and-heuristic-audit` entry), which returns ranked
   Blockers/High/Medium/Nitpicks plus a "What's working" section.

**Who critiques:** the `design-review` subagent — one persona ("senior product design reviewer"),
a single pass, not a panel and not adversarial to itself across multiple runs.

**Can the whole direction be rejected:** functionally yes, in that a "Needs work" verdict with
Blockers is meant to block "done," but this is a **documented convention**, not enforced code — the
subagent's own report format (`design-review.md:66-88`) has no field that halts a merge or a
delivery; `WORKFLOW.md:83` states the rule in prose only: *"Blockers/High gate merging."*

**Stop condition:** the loop stops when a human/model decides the verdict is "Ship" or "Ship with
fixes" and the fixes are applied — again, a documented habit (`WORKFLOW.md:84`: *"Re-screenshot
after every fix"*), not a re-run-until-clean script. `design-audit.mjs` does exit non-zero on any
`high`-severity finding (`design-audit.mjs:229`), which is real and CI-gateable, but nothing in this
repo actually wires that exit code into an automatic retry — a human/CI step would have to do that.

**Does the loop actually improve output:** for the specific things it checks (contrast, overflow,
focus rings, tap targets, console errors, heading structure), yes, because those are checked against
real rendered/computed state, not asserted. For the sameness/genericness problem the brief cares
about, there's no evidence either way in this repo — the loop was never evaluated against that axis,
only demonstrated on functional defects.
