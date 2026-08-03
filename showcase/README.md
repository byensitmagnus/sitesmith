# The cold corpus

Twelve websites, built by twelve fresh agents that had this skill and one brief and nothing
else. Twelve blind reviewers, each cast as the person paying for that site, each given the
brief, four renders and the HTML, and never the builder's own journal, the production
report, the gate output or another reviewer's answer.

**Nine were rejected. Three were accepted.** All twelve are here, because a showcase that
only shows the wins is the thing this repository exists not to be.

```
round 1   sålmageri, vintertjenestens konsol, vandværket        0 of 3
round 2   dronningeavl, logbogsarkivet, brovagtens panel        0 of 3
round 3   orgelbyggeriet, slusen, tørvemosen                    0 of 3
round 4   savværket, kornmodtagelsen, fyret                     3 of 3
```

## Round 4, and what the reviewers wrote

| | surface | verdict | the reviewer's own sentence |
|---|---|---|---|
| [savværket](round-4/savvaerket/) | buy | ACCEPT | "tallene stemmer indbyrdes overalt, og bestillingssedlen lyver ikke om hvad den kan" |
| [kornmodtagelsen](round-4/kornmodtagelsen/) | operate | ACCEPT | "skærmen modsiger ikke sig selv ét eneste sted" |
| [fyret](round-4/fyret/) | read | ACCEPT | "alt på den er sandt, og tegningerne er vores fyr og ikke et museums" |

Each directory holds the brief it was built from, the page, the four renders the reviewer
saw, the blind review verbatim, and the build's own record: the direction it argued, the
critique hashed to the render that shipped, and the production report.

## These are evidence. They are not a showcase.

The three pages were run through `tools/portfolio-diversity.mjs` after they were accepted,
and **the set failed on two devices**: every one of them uses hairline separators, and every
one of them sets its figures tabular.

```
FAIL  device: all 3 sites use hairline borders as the separator
FAIL  device: all 3 sites use tabular figures as a motif
FAIL — 2 way(s) in which they are one site
```

That is the round-8 finding again in a new costume: pages that clear their own review one at
a time and still read as one studio. Three individual accepts are not a portfolio claim, and
none of these is presented as showcase work.

What it exposed was a real hole, and it is now closed: the anti-repeat ledger compared each
build against one prior record at a time and wanted four shared devices before it objected.
Across the set each pair shared only two, so nothing spoke. `ledger.mjs` now also refuses a
device carried by every one of the last three records, whoever the subject was.

## What all three accepts stand on

Both of the reviewers who were asked what would have overturned their verdict answered the
same way: **if anything had been invented.** A scale that did not hold, a send button that
went nowhere, a claim the brief never made.

Every accepted page carries measured drawings of the subject's own numbers as its
load-bearing elements — plank thicknesses on one floor at one scale, a 920 mm focal length,
154 steps drawn one by one, silo cells whose drawn area is their tonnage — and a second such
reading below the first screen that the reviewer found without being told to look.
