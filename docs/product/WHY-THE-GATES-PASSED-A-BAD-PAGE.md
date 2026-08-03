---
title: Why every gate was green and the page was not good
state: S18_VISUAL_RECOVERY
status: diagnosis
ai_generated: "(C)"
---

# Why every gate was green and the page was not good

Short answer: **every gate in this package is a refusal gate, and nothing anywhere asked
for anything to be there.** A blank page with a heading and a rule passes all of them.

## The four specific holes

**1. Nothing requires an asset.** `gate.mjs` refuses an image that is not in
`ASSET-MANIFEST.md`. It has never refused a page for having no images. The manifest's
honesty check is satisfied by a row that says `none`, and all three S17 holdouts wrote
exactly that. The asset check is a check on *lying about assets*, not on *having* any.

**2. Nothing looks at the first viewport.** `verify.mjs` renders at three widths and
measures tap targets, contrast, overflow, radii and type families. Every one of those is a
defect count. None of them asks what is on the first screen, how much of it is painted
rather than empty, or whether anything carries an image, a texture or a drawn form.
`tools/portfolio-diversity.mjs` does measure first-screen asset share, and it reported
0.0% for all three, and it is a repo-side portfolio tool that runs after three builds
exist. It cannot refuse one build.

**3. There is no floor for the marketing and experience surface.** `floor/buy.md` has
eight obligations, `floor/operate.md` has five. A brief routed to experience opens
`motion.md` and nothing else, so the only obligations in force are the eight sections of
`SKILL.md`, which are about not being generic. Not being generic is not the same as being
good, and the difference is exactly what the three screenshots show.

**4. Nothing renders and then looks.** `run.md` step 7 accepts or justifies each item in
the `MEASURED, NOT JUDGED` list. That list is machine measurements. No step in the whole
workflow says: open the screenshot, look at it, and say what is wrong with it as a piece
of design. The package proves a page in a browser and never sees it.

## The pattern behind all four

Each of the four is the same shape: **a rule about what must not happen, standing in for a
requirement about what must happen.** No em dashes, no banned palette, no undeclared
literal, no gradient text, no unmanifested asset, no contrast failure. Every one is
correct. Together they describe a page with nothing wrong with it, which is not the same
object as a page worth looking at.

`tools/genericness-judge.mjs` is the clearest case. It scored the three holdouts at 3 of
16 against a control at 10, and the score is real: they genuinely lack the tells. What it
measures is the absence of the default. A page can score 0 and still be a heading, a rule
and four paragraphs on a flat ground, because the rubric contains no line that fires when
a page is empty.

## What this diagnosis does not say

It does not say the gates were wrong. They caught, in this round alone, a missing `<main>`
landmark, a 3.91:1 action colour, three grounds inside the banned band and a shared
micro-typographic device across three unrelated trades. All four are real defects and a
human review would have found none of them as fast.

It says the gates were **incomplete in one direction**, and that the direction they were
missing is the one the product is sold on. PRD section 8.8 now states it as a requirement
rather than leaving it implicit, and section 5 principle 11 names the failure: avoidance
rules and automated genericness scores are guardrails, not evidence that a website is
professionally designed.
