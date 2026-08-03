---
title: taste-skill — Loops
ai_generated: "(C)"
---

# Every loop, its critic, its stop condition

There is exactly **one** iteration mechanism anywhere in this repo, and it appears in three near-identical forms across three different skills. In every case the critic is the *same model instance that produced the output*, running a single pass, with no second agent, no adversarial persona, and no defined maximum/minimum iteration count.

## 1. Flagship pre-flight checklist
- **File:** `skills/taste-skill/SKILL.md:910-979`
- **Critic:** the generating model itself, self-administered, immediately before delivering output.
- **Iterations:** exactly one stated pass ("Run this matrix before outputting code. This is the last filter," `:912`). Re-running is implied only by "if any box fails, the output is not done. Fix it before delivering" (`:979`) — there is no stated loop count, no maximum retries, and no instruction for what to do if the same box keeps failing.
- **Can the whole direction be rejected?** No. The checklist only checks specific, local defects (contrast, wrap, em-dash, layout repetition). Nothing in it asks "is the overall design read still the right call" — there is no path back to §0 to reconsider the brief inference itself. A design that ticks all 70 boxes but answered the wrong brief passes cleanly.
- **Stop condition:** "all boxes honestly ticked." Unenforceable beyond the model's own self-report — see FAILURE-MODES.md #6.
- **Does it actually improve output?** Partially, and unevenly. The mechanically-countable items (eyebrow density, layout-family count, bento cell count, em-dash presence) are genuinely checkable by re-reading the output and counting — these likely do catch real defects. The judgment items ("Copy Self-Audit," "Serif discipline... with explicit brand justification") ask the model to grade its own creative choices, which is the weakest possible form of critique: the same reasoning that produced the choice is asked to approve it.

## 2. gpt-tasteskill pre-output checklist
- **File:** `skills/gpt-tasteskill/SKILL.md:86-98`
- **Critic/iterations/stop condition:** identical shape to #1 — single self-administered pass, no second critic, "This is the last filter" (`:87`).
- **Difference from #1:** smaller (9 items vs ~70), and one item ("A Vibe Archetype and Layout Archetype... were consciously selected and applied," `:89`) checks that the fabricated-RNG step (see `MECHANISMS.json:gpt-fake-rng`) was performed at all, not that it produced a good result — the loop verifies procedure-was-followed, not outcome-was-good.

## 3. image-to-code-skill "Clarity Check"
- **File:** `skills/image-to-code-skill/SKILL.md:1083-1109`
- **Critic:** same model, same single pass, before finalizing.
- **Difference from #1/#2:** this one does include a genuine sub-loop within the workflow before the final checklist — "If something is unclear, generate another image before coding" (`:308`) and "if a section is still unclear, generate an additional detail image" (§7, `:259-286`) describe a real iterate-until-clear image-generation loop, with the critic still being the same model judging its own generated image's legibility. The stop condition is "clear enough to extract from," which is more concrete than "honestly ticked" but still self-assessed with no external verification that extraction was actually accurate.

## What's absent entirely

- **No independent critic persona anywhere in the repo.** No skill instructs spawning a second reasoning pass explicitly told to attack or find fault with the first pass's output (contrast with this environment's own `verification-loop` / `ultrareview` skills, which exist specifically to supply that).
- **No mechanism to reject the whole direction.** Every loop found operates *within* an already-chosen design read/aesthetic, checking for local defects. None of them can conclude "the design read from §0 was wrong, start over."
- **No stated iteration bound.** Neither a minimum ("critique at least twice") nor a maximum ("stop after 3 rounds") appears anywhere.
- **No logged critique.** All three checklists are meant to be run and then discarded — there is no instruction to output the checklist results themselves, so even the one verification step that does exist leaves no artifact a human or a later process could inspect.

## Conclusion for SiteSmith's rebuild

If SiteSmith wants a real verification loop (which this repo's own `context-diamond` skill already models: fan-out, verify with a fresh agent, synthesize), none of taste-skill's checklist mechanisms should be copied as "the" verification step — they are a useful *checklist of things to check*, not a verification *process*. The countable items (em-dash scan, layout-family diversity, bento cell count, CTA wrap) are worth porting as real automated checks. The judgment items are worth porting as prompts for a genuinely separate critic pass, not as a self-administered box to tick.
