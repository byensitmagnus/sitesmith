# Rubric — blind visual review

You are looking at contact sheets of a finished web page and nothing else. You did not build
it. You do not know who did, what tools were involved, or what the page was trying to prove.
Two panels per sheet: the first screen at actual size, and the whole page scaled to fit.

Answer the primary question **before** you score.

## The primary question

> In one sentence, what is the main thing wrong with this page?

Say the specific thing. "The price is the smallest figure on a page about price" is an answer.
"Feels generic" is not — if the page really is the category default rendered competently, say
which parts make it so, and name them.

## The seven criteria, scored 1–10

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

**5. Assets and craft.** Are the images real, one treatment, correctly cropped at every width?
Is the mark a mark? Are edges, spacing and alignment consistent enough to look deliberate and
varied enough to look composed?

**6. Hierarchy and rhythm.** Squint. Is something clearly first? Does the eye move in the order
the argument needs? Is the section rhythm doing anything, or is it alternating bands because
alternating bands is what pages do?

**7. Production-readiness.** Would you put this in front of this client's customers tomorrow,
under this client's name, without apologising for anything?

Every score under 7 needs one sentence naming the specific thing, with the view (desktop or
mobile) and the region. Score what you see. Do not be generous because a page is unusual, and
do not be harsh because it is plain — the question is whether it is *deliberate and finished*.

## Output format, exactly

One file per sheet. Frontmatter first, then the body. The `sha256` field is the SHA-256 of the
body — everything after the closing `---`, trimmed. Compute it, do not guess it.

```
---
reviewer: A
reviewer-id: <your agent id>
run-id: <the run id you were given>
label: <the sheet label>
locked: <ISO 8601 UTC timestamp, the moment you finished>
sha256: <hash of the body below>
brief-sha256: <hash of that label's BRIEF.md>
rubric-sha256: <hash of this file>
sheet-sha256: <the sheet-set hash you were given>
---
primary-criticism: <one sentence>
direction: 8
specificity: 9
type: 7
colour: 8
assets: 8
hierarchy: 7
production-readiness: 8

notes:
- direction — <one sentence per criterion you scored under 7>
- type — ...
```

## The portfolio question, asked once across all three sheets

After the three individual reviews, answer separately:

1. Do these three read as the work of one studio applying one template, or as three different
   pieces of work? Name the evidence either way.
2. Which two of the three are closest, and on what — ground, type, layout, imagery, spacing?
3. If you had to say what all three share, what is it?

Answer this honestly. Three pages that share a recipe is a finding worth more than three
flattering reviews.
