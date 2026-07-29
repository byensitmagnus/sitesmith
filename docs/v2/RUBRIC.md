# Rubric — assignment-blinded visual review

> The canonical rubric. Rounds 1 to 7 each hold a frozen copy, because every review in those
> rounds is hash-bound to the file it was scored against and editing one would break the proof
> it carries. This is the copy that new rounds are run from.
>
> **Changed from the round-7 copy: criterion 5 only.** Same seven criteria, same 1–10 scale,
> same "under 7 needs a named finding" rule, same output format, same portfolio question. No
> threshold moved. Criterion 5 asked whether the images were real and correctly cropped, and
> answered nothing about whether they were doing anything — six reviews scored it 6 or 7 while
> naming, in prose, faults the criterion had no words for. It now asks the question those
> reviewers were already answering.

You are looking at contact sheets of a finished web page and nothing else. You did not build
it. You do not know who did, what tools were involved, or what the page was trying to prove.

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

**5. Assets — what the pictures are doing.** Not whether they exist. Whether they work.

Ask these in order, and let the answers set the score:

1. **Does each picture carry an argument?** For every significant image, say in one clause what
   the visitor learns or can do because it is there. An image you cannot finish that sentence
   for is decoration, however well shot.
2. **If the page asks the visitor to choose, can they?** When the job is to compare — options,
   sizes, grades, plans, states — at least one asset has to put the alternatives in one frame
   at one scale. Options a screen apart is a comparison mentioned, not made.
3. **Is the treatment one treatment?** One crop logic, one colour handling, one set of aspect
   ratios, and the focal point surviving at 375 as well as 1440.
4. **Is the mark a mark?** Something that would not fit a competitor equally well. A rounded
   rectangle in the accent colour is the shape of a mark, not a mark.
5. **Is anything borrowed?** Customer logos, partner marks, certification badges. These are
   the strongest proof a page can carry, and unless the page names whose they are they are the
   weakest — score accordingly, and say so.
6. **Is anything the generated default?** The centred hero on a soft gradient, the three-up
   grid of circular icons, the isometric abstract figures, the screenshot floating at an angle.
   These carry no information about this subject, which is the whole problem with them.

A page with **no** imagery is not thereby low: if the typography is carrying the argument and
doing it deliberately, that is a direction and it can score high. What scores low is a page
whose pictures are not doing the work its own layout implies they are.

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

## The portfolio question, asked once across all sheets

After the individual reviews, answer separately:

1. Do these read as the work of one studio applying one template, or as different pieces of
   work? Name the evidence either way.
2. Which two are closest, and on what — ground, type, layout, imagery, spacing?
3. If you had to say what they all share, what is it?

Answer this honestly. Pages that share a recipe is a finding worth more than flattering
reviews.
