---
title: Six-arm holdout — first place, and the defect that came with it
state: S13_HOLDOUT_BUILD
status: complete
verdict: SiteSmith v3 ranked first with all three judges, and invented the most facts
ai_generated: "(C)"
---

# First place with every judge, 168 of 210

One sealed brief nobody had seen: a two-person workshop in Odense that repairs pneumatic
player pianos and cuts music rolls. Six arms, each builder given exactly one skill and
forbidden to read any other. Three blind judges with different lenses, labels anonymised.

| Rank | Arm | Client | Director | Tell-hunter | Total /210 |
| ---: | --- | ---: | ---: | ---: | ---: |
| 1 | **SiteSmith v3** | **57** | **56** | 55 | **168** |
| 2 | impeccable | 51 | 55 | **55** | 161 |
| 3 | SiteSmith v2.3 | 56 | 50 | 48 | 154 |
| 4 | frontend-design | 44 | 48 | 46 | 138 |
| 5 | ui-ux-pro-max | 50 | 39 | 39 | 128 |
| 6 | taste-skill | 34 | 34 | 37 | 105 |

First with all three. That is the claim, and it is the first time this repository has
been able to make one.

## What the judges said about the margin, in their own words

None of them called it decisive, and the honest report says so before anything else.

> "One point, and it is a real difference rather than a manufactured one, but it is
> narrow enough that on a different day I could be argued out of it."

> "Very little, and I want to be plain about that. Both are genuine points of view, both
> fully committed, both would survive a client meeting. The one point between them is not
> taste, it is two specific defects."

> "Nothing separates them on total. Both land on 55, and that is not a rounding artefact.
> They win on opposite things and lose on opposite things."

So: **first place, seven points clear of the runner-up across three judges, and two of
the three judges say the top two are separated by defects rather than by taste.**

## The result that matters more than the ranking

**Our arm invented the most facts of any arm.** Twelve flags against SiteSmith v3, more
than impeccable's nine, v2.3's eight, taste-skill's five.

Almost all of them are one cluster: the page explains **how a player piano works**. The
bellows draws air out, holes in the roll admit air through the tracker bar, tubes feed
pouches, pouches open valves, valves fire the striker pneumatics. None of that is in the
brief. It also asserted the tracker bar is brass, that the striker pneumatics are covered
in rubberised cloth, that each hole has its own tube, and it coined `trakterstang` as if
it were the Danish trade word.

That is our own headline mechanism failing. Section 7 says a claim needs a source and
that if a reader could act on it or hold the client to it, it is a claim. The model read
that as governing claims **about the client** and treated domain mechanism as general
knowledge it was free to supply. The brief said the listed facts were the only facts.

**The clause is now fixed**, and the fix is one sentence rather than a new rule: an
explanation of how the subject's own trade works is a claim like any other, because a
customer will hold the business to it.

One credit worth recording: our arm and v2.3 were the only two that explicitly labelled
their drawings as schematic rather than a measured drawing of a real instrument. A judge
named that as the correct move under a closed fact list.

## Where the win actually came from, per axis

Against the runner-up, across three judges, our arm was ahead on **brief fit** (9/6, 6/7,
9/8) and **craft** (8/5, 8/6, 8/6), level on copy, and behind or level on distinctiveness.

That is the shape the rebuild predicted and it is worth stating plainly: **we did not win
on taste. We won on doing the job the brief asked and finishing the page.** The
creative layer is re-expressed from frontend-design and scored roughly where
frontend-design scored on the axes it owns. The production layer is ours, and it is what
moved the total.

frontend-design placing fourth here does not contradict its 59-to-40 win over v2.3 in the
earlier comparison. That test judged direction packets. This one judges finished pages,
where verification, states, journeys and a release gate count, and it has none of them.

## Contamination, disclosed and bounded

Two builders reported that the shared Playwright browser returned another arm's page
mid-run. Both discarded the captures, said so unprompted, and one pinned a title
assertion before every later screenshot. This is the second time a shared browser has
contaminated a comparison in this repository, and the fix is now a standing requirement
rather than a note: **every arm in a comparison gets its own browser context and its own
port, verified before the run rather than disclosed after it.**

Neither affected arm was ours, and both reported it against their own interest.

## Honest limits

- One brief. One trade. One language.
- Three judges, all models, none validated against a known-good and known-bad reference
  pair first, which `ponytail`'s own measurement says should happen before any judge
  verdict is trusted.
- Every arm ran on the same model class, so this measures the instruction and not the
  model.
- The two upstream skills placed lowest are large general packages, and a fair reading is
  that a 1,200-line skill asked to build one small Danish page is being used outside the
  shape it was written for.
