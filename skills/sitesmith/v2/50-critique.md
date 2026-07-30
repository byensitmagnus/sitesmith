# 50 — the visual critique gate

> Original work, MIT. Run after the technical gate is green, on screenshots, never on source.
> Output: `CRITIQUE.md`.

Two gates, deliberately separate.

**The technical gate** — `verify.mjs`, `token-drift.mjs`, `production-gate.mjs`,
`journey.mjs` — answers *does it work*. Contrast, focus, overflow, dead links, console
errors, undeclared values, placeholders, behaviour. It is mechanical, it is not a matter of
opinion, and it is a floor.

**The visual critique gate** answers *is it any good*. It is a judgement, it is made by
looking, and it can only be made after the technical gate is green — a page with a broken
layout cannot be assessed for art direction, because every criticism collapses into the
broken layout.

Merging them is how "PASS" came to mean "no defects found" and got read as "this is good".

---

## Contents

- [1. What it runs on](#1-what-it-runs-on)
- [2. The rubric](#2-the-rubric)
- [3. Assignment-blinded review](#3-assignment-blinded-review)
- [4. The primary-criticism test](#4-the-primary-criticism-test)
- [5. What a failure produces](#5-what-a-failure-produces)
- [6. The public-portfolio gate](#6-the-public-portfolio-gate)

---

## 1. What it runs on

Screenshots, at 1440, 768 and 375, in both colour schemes, produced by `verify.mjs`. Plus the
three direction comps, so the reviewer can see what was rejected.

Not the source. A reviewer reading CSS is assessing the implementation; a reviewer looking at
a picture is assessing what a visitor gets. The second is the one being gated here.

The reviewer does not get: the brief, the direction rationale, the name of the skill, or
whether the page was built with help. Those are all reasons to be generous.

## 2. The rubric

Seven criteria, scored 1 to 10. The scores are recorded individually; the headline number is
the **median across reviewers of production-readiness**, criterion 7.

**1. Direction.** Is there one, and is it legible in the first screen? Could you describe the
page's visual argument in a sentence that is not a list of components?

**2. Specificity to the subject.** Take the logo and the copy off. Could this page be a
different company in the same category? If yes, cap this criterion at 3.

**3. Type.** Are the faces chosen or inherited? Is the scale used with intent — few sizes,
used hard — or is it a ramp applied evenly? Is there anything in the setting that would be
recognisable on a second page?

**4. Colour and ground.** Does the palette come from somewhere, or is it an off-white with a
rotated accent? Does the ground do work? Does the accent appear where it matters and nowhere
else?

**5. Assets and craft.** Are the images real, one treatment, correctly cropped at every
width? Is the mark a mark? Are edges, spacing and alignment consistent enough to look
deliberate and varied enough to look composed?

**6. Hierarchy and rhythm.** Squint. Is something clearly first? Does the eye move in the
order the argument needs? Is the section rhythm doing anything, or is it alternating bands
because alternating bands is what pages do?

**7. Production-readiness.** Would you put this in front of the client's customers tomorrow,
under this client's name, without apologising for anything? This is the criterion the gate
thresholds on.

Each score under 7 requires one sentence naming the specific thing, with the screenshot and
region. "Feels generic" is not a finding. "Every section is a centred column of the same
width on the same ground, so the page has no rhythm below the hero" is.

## 3. Assignment-blinded review

**Two independent reviewers.** Neither sees the other's scores until both are written and
locked.

- Screenshots are presented with **randomised labels** — the mapping from label to page is
  written to a sealed key that the reviewers do not read.
- Where a comparison is being made (with the skill against without, or this version against
  the last), both arms are in the same set under the same randomisation, so a reviewer cannot
  score the arm they expect to be better.
- Each reviewer writes `CRITIQUE-<reviewer>.md` and it is **locked** — written, hashed,
  recorded — before the key is opened.
- Disagreement of 3 or more points on criterion 7 is not averaged away. Both scores stand,
  the median is taken, and the disagreement is quoted in `CRITIQUE.md`, because two competent
  reviewers disagreeing by 3 about whether a page is ready is itself the finding.

The reason for the ceremony is narrow and specific: a reviewer who knows which page the skill
produced will find reasons for it to be better. This is not a hypothetical failure mode; it
is the ordinary one.

## 4. The primary-criticism test

One question, asked of both reviewers, answered before the scores:

> **In one sentence, what is the main thing wrong with this page?**

If either answer is a variant of *"it looks like a generic AI-generated template"* — a
standard hero, an OS font stack, an off-white ground with one accent, three equal cards, no
photography — the gate **fails regardless of the numeric scores**.

That failure mode is the one the whole layer exists to prevent, and it is the one that
survives every other improvement. A page can score 8 on six criteria and still be the
category default rendered competently. The test is there so that a good average cannot hide
it.

## 5. What a failure produces

`CRITIQUE.md` records, for each page: both reviewers' seven scores, both primary criticisms,
the median production-readiness, and the pass or fail.

**Pass** requires all of:

- median production-readiness ≥ **8**,
- no criterion scoring 1–3 from either reviewer,
- neither primary criticism is the generic-template answer,
- both reviews locked before the key was opened,
- the technical gate still green on the same commit.

**A failure names the next action, not a rating.** Which criterion, which region, and which
step to go back to:

| Failing criterion | Go back to |
| --- | --- |
| 1 direction, 6 hierarchy | [`20-direction-lab.md`](20-direction-lab.md) — the direction was not chosen, or the wrong one won |
| 2 specificity | [`05-evidence.md`](05-evidence.md) — the evidence pack was thin, so the page could only be generic |
| 3 type, 4 colour | [`30-contract.md`](30-contract.md) — the contract did not come from the winning comp |
| 5 assets | [`25-assets.md`](25-assets.md) — rows are not `ready` |
| 7 alone, with 1–6 healthy | usually finish work: crops, alignment, one state, one width |

Going back to the direction lab after a build is expensive and is supposed to be. That cost
is the reason the lab comes first.

## 6. The public-portfolio gate

Passing the page gate makes one page eligible for further review. It does **not** make the page
showcase material. A public portfolio is a separate product surface and must prove that the skill
does not keep applying one recognisable studio method to unrelated briefs.

Before any benchmark case enters the public showcase, run `portfolio-diversity.mjs` on the full
candidate set and ask both assignment-blinded reviewers the portfolio question: *with the copy and
logos removed, could the closest pair be the same site?* The portfolio fails if either reviewer
answers yes, describes one studio or one method, or the mechanical diversity gate fails. Numeric
page scores cannot average that failure away.

The public manifest must then agree with the rendered report. A failed group remains evidence, but
none of its pages is an approved showcase case. This lab-only rule does not run for an ordinary
single customer website; it is mandatory whenever this repository publishes a multi-site claim.
