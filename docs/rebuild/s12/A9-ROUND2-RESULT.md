---
title: A9 round two — the tell moved onto the fix
state: S12_CRITIQUE_AND_REVISION
status: complete
verdict: FAIL, and the failure mode is now structural rather than editorial
ai_generated: "(C)"
---

# Round two failed, and it failed more informatively than round one

Same three sealed briefs. Fixed skill. Three fresh builders, blocked from reading round
one, blind to each other. One judge, rendering at 1440 and 375 and reading every line of
CSS.

```text
VERDICT: FAIL. Round two is a different house style from round one, and a narrower one.
```

## The four fixes did work, on the axes they named

| Fix | Round one | Round two |
| --- | --- | --- |
| Palette count and roles from the trade | 1 saturated colour in every build | **4, 2 and 3.** Blue and green appear for the first time. One cool grey where all three were olive |
| Signature kind named before building | Three CSS gauges wearing three costumes | Three different kinds: a machine part drawn head on, stamped drawing marks, a worn surface. One builder rejected a dashed stitching border explicitly as the kind the medium reaches for |
| Autopilot description | did not exist | All three wrote one, all three different, and all three visibly avoided it |
| Second swap changes the trade | did not exist | All three recorded a change. A's is visible in the output: the part-exchange block is the only mirrored one on the page because it is the only thing moving back toward the workshop |

Luminance spread widened from 0.301 to 0.387 and build C left the light band entirely at
0.415. That is the largest genuine gain in the set.

## And the convergence moved, tighter than before

| Measure | Round one | Round two |
| --- | ---: | ---: |
| Ground hue arc across three unrelated trades | 18.0° | **4.1°** |
| Raised surface arc | 6.0° | **3.0°** |
| Most emphatic accent, saturation band | 18.6 wide | **4.5 wide** |
| Near-black inks | one cool among three | **three warm within 19.3° and 1.4 lightness points** |

The family moved from desaturated yellow-green to warm beige and closed by 77 percent.
Two builds with nothing in common, neither asked for blue, both chose one: 208.7° and
213.7°, five degrees apart.

## The sentence that matters

> **The tell did not die. It moved from the default onto the fix.**

No build declares a one-accent doctrine any more. All three declare the same *anti*
doctrine instead, in almost the same words:

- A: "The count came out at ten by asking what is physically in there, not by deciding a
  number first."
- B: "Fem farver, og tallet faldt ud af rørets tværsnit, **ikke af en liste over roller**."
- C: "Spørgsmålet er ikke, hvor mange farver siden skal have, og heller ikke hvilke roller
  de skal have. Tallet faldt derfor ud som syv."

Three-way verbatim agreement, exactly as in round one, on the sentence I wrote to prevent
round one. And four of six palette slots still line up one to one.

## What two rounds establish

Round one killed five moves and grew seven. Round two killed or halved most of those
seven and grew a tighter set. Each fix worked on the axis it named and tightened an axis
it did not.

That is not an editorial problem, and a third rewrite should not be attempted. It is
structural: **every build reads the same instruction surface, so every build converges on
how it answers that surface.** The more precisely an instruction forbids something, the
more precisely it specifies the space builds move into. Writing "not a list of roles"
produced three sites agreeing that theirs was not a list of roles, in one voice.

## What would actually break it, and why it is allowed

The mechanism already exists in this rebuild and was adopted for exactly one thing.
`impeccable/forced-index-direction-roll`: the model produces its own grounded shortlist,
and a cheap external tie-breaker forbids its own argmax. The script never proposes an
idea; it only vetoes the convergent one. That is why it passes
`C-no-mechanical-creativity`, and it is why it was adopted for the thesis.

It was never extended to colour, and colour is where every measured convergence lives.

The change: `ledger.mjs check` already fingerprints a render and refuses a repeat. Give
it the ground hue and the emphatic-accent hue, and let it refuse a build whose ground
lands within a set arc of a recent one. The script proposes nothing. It says *not there*,
and the model chooses again, from its own nouns.

This is the difference between telling three builders to be different and making one
region unavailable to the third.

## Honest limits of this result

- Three builds per round, one judge, two rounds. Small.
- Both rounds used the same three briefs. The briefs themselves may carry a shared
  quality that pulls toward warm neutrals, though sewing machines, district heating and
  church organs is about as wide as three Danish trades get.
- Every build came from one model class. This measures the instruction, not the model.
- Round two's builds were blocked from reading round one, which is the right control, but
  it means round two could not learn from it either. A human studio would have.

Recorded as `result:a9-round2-fail-tell-moved-to-the-fix` and
`decision:extend-forced-veto-to-colour`.
