---
title: "Task-Contracts Autopsy — Loops"
ai_generated: "(C)"
---

# Loops

Where each source defines a repeating cycle, its exit condition, and what happens if the exit
condition is never reached.

## ai-dev-tasks: one loop, human-paced, no automatic exit

The only loop is "one sub-task at a time" execution: the AI works a single sub-task, the user
reviews, and progress continues until the checklist is fully checked (`README.md:59-71`, implied by
`generate-tasks.md:43-50`'s per-sub-task checkbox update). There is no stated exit condition other
than "all boxes checked" — no budget, no fatigue valve, no proportionality check on how many
sub-tasks is too many. For a small feature this is fine; for a large one, the loop has no built-in
brake, relying entirely on the human reviewer to notice if it's off track.

## before-implementing: the grill loop, with a real, staged exit

This is the more interesting loop and the more directly reusable one:

```
while unknowns_ledger is not empty:
    ask ONE material+grounded+answerable question, with a recommended default (SKILL.md:106-118)
    if user answer is short/impatient (fatigue signal):
        break  →  batch remaining unknowns as one assumptions list for veto (SKILL.md:125-126)
    if questions_asked >= ~5:
        ask user whether to continue past budget (SKILL.md:124)
announce "N unknowns left" as the ledger shrinks (SKILL.md:48)
```

Three distinct exit paths, each explicit:
1. **Natural exit** — ledger empties because every material unknown was resolved, defaulted, or
   explicitly accepted (`SKILL.md:48`).
2. **Fatigue exit** — user signals impatience; loop stops early and converts remainder to a single
   batched decision instead of continuing to ask (`SKILL.md:125-126`). This is the loop's
   real safety brake — it exists specifically because the upstream `grilling` skill this was forked
   from had no such brake and over-questioned users (`CHANGELOG.md:13-25`, `before-implementing`).
3. **Budget exit** — a numeric cap (~5) forces an explicit continue/stop decision rather than
   silently running forever (`SKILL.md:124`).

A second, smaller loop exists for the post-alignment phase: "During Implementation" deviations are
logged and, per the deviation policy, either continued past or escalated (`SKILL.md:178-186`) — this
loop's exit is simply "implementation complete," with each iteration's branch decision (continue vs.
stop) made fresh each time a contradiction appears.

## What happens if the exit condition is never reached

For ai-dev-tasks: nothing bounds a stalled loop except the human; a user who never confirms "Go"
(`generate-tasks.md:17-18`) or never finishes reviewing sub-tasks leaves the task list in a
permanently half-checked state, which is an acceptable failure mode for a human-in-the-loop tool but
not for an autonomous one.

For before-implementing: the fatigue valve and budget cap both exist precisely to guarantee the loop
terminates even if the "natural" empty-ledger condition is slow to arrive — this is the strongest
loop-design lesson in either source, and it is documented as a *fix* for a real prior failure
(`CHANGELOG.md:13-25`), not a hypothetical safeguard.

## Implication for the SiteSmith rebuild

Reuse the three-exit-path shape (natural / fatigue / budget) for any interview-style loop in the
rebuilt skill — see `MECHANISMS.json:blocking-question-template-with-budget`. Do not reuse
ai-dev-tasks' unbounded "keep going until all boxes checked" loop as-is for an autonomous build;
pair it with an explicit stall detector or the same fatigue/budget pattern from the other source.
