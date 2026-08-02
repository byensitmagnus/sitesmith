# Production report, Klokkestøberiet Hjelm

Built with a clean install of `skills/sitesmith-v3`, surface `experience`, stack `static`.

Scenario: experience

## Files opened

- `skills/sitesmith-v3/SKILL.md`
- `skills/sitesmith-v3/run.md`
- `skills/sitesmith-v3/look.md`
- `skills/sitesmith-v3/motion.md`
- `skills/sitesmith-v3/stacks/static.md`
- `skills/sitesmith-v3/verify.md`

## Where the facts came from

Every time, name, ratio and instruction on this page is in the foundry's own day
programme, which is the same brief the rejected S17 build used. Nothing was added.

Deliberately absent: an address, a price, visitor numbers, parking, years in operation, the
foundry's history, how many bells it has cast, and any description of the sound beyond the
seven published ratios. None of them is in the programme. The visible note at the foot of
the page says so, and it also says the two drawings are schematic, because a reader could
otherwise take the section for a measured drawing of a particular bell.

## Run notes

- viewports: 375, 768 and 1440 rendered by `verify.mjs`; 1440 and 390 captured separately for review
- axe both schemes: ran, 0 violations
- live server: a local static server, not a `file://` URL
- anti-slop linter: `gate.mjs` ran over this directory with a browser present
- motion: captured as a frame sequence at 1440, `motion/` beside this file
- fallbacks: none taken

## Mechanical findings

- unmanifested-texture: the turbulence filter in the ground had no `data-asset` id
- banned-accent: the cold bronze `#9a6a2e` sat 6 units from a banned accent
- banned-ink: the paper white `#f3e4d2` sat 12 units from a banned ground
- no-record: the build reached the gate before the direction record was written
- caption-collision: the caption under 11.14 overlapped the paragraph below it

## Reconciliation

- unmanifested-texture: confirmed, fixed by giving the filter an id and a manifest row. It is an asset even though it is three lines of SVG in a data URI
- banned-accent: confirmed, moved to `#8a5a1c`. The subject has plenty of bronze and none of it had to be that one
- banned-ink: confirmed, moved to `#f7ded8`
- no-record: confirmed. The record was written from `LOOK.md` after the first render, which is the wrong order and is recorded here rather than tidied away. The look file was written first, before any code, which is the part `look.md` actually requires
- caption-collision: confirmed, fixed with a line height and a margin

## The critique round

`CRITIQUE.md` beside this file holds the five sentences written against the first render.
Its second finding was that the drawing did not read as a bell, and the correction round
did not fix it: redrawing the profile produced two wall sections side by side, which is
what a cutaway looks like when the back wall is missing.

That was completed in the same round rather than opened as a second one, and the
distinction is worth stating plainly rather than hiding: the correction specified in the
critique was "redraw the bell as a real section", and a section without its interior is not
a section. Adding the back wall finished the specified correction. It was not a second pass
at taste. The report says this here because a reader is entitled to check the claim that
only one round happened.

## What is still weak

- The bell is cropped by the right edge, and at 1440 there is still a band of ground
  between the headline column and the drawing that is doing nothing. It is inside the
  gate's dead-field ceiling and it is not what a designer would have left there.
- The mobile first screen puts the type above the drawing, so the drawing is half below the
  fold at 390. That is a reasonable ordering for reading and a weaker one for impact.
- There is no photograph, and this page would be better with one. The correct fix is not a
  generated image; it is asking the foundry for a photograph of the floor.
- The page is one screen deep in argument and four sections long. It is a complete
  experience surface for this brief and it is not a large site.

## Draft state

draft: yes

release: no

This build is a draft for one reason, and it is named rather than hidden: **no photograph
of the subject exists in the brief.** look.md section 3 puts a client photograph at the top
of the asset ladder and a drawing at the bottom, and it says a page about a physical
subject with no photograph of it is a draft. This is one.

What is missing, precisely: one photograph of the foundry floor, ideally during a pour, and one of a finished bell in the tuning frame.

What happens next: ask for it. The drawings on this page are correct for what they are, a
section and a diagram, and they are the wrong answer for a thing that could be
photographed. Nothing here should be replaced by a generated image.

## Det typografiske gulv, målt og besvaret

`verify.mjs` måler nu måltebredde, linjeafstand mod måltebredde, knibningsgulv,
display-loft, skalatrin og lys-tekst-på-mørk-grund. Tallene er impeccables craft-floor
(Apache-2.0), båret som målinger frem for som råd. Hvad den fandt på denne side, og hvad
der skete:

| Fund | Svar |
| --- | --- |
| lys tekst på mørk grund ved vægt 400 | kompenseret på tre akser: linjeafstand 1,68, knibning +0,006em, vægt 500 |
| undertiden målte 33ch | udvidet til 46ch |
| tonernes brødtekst målte 43ch | udvidet til 54ch |
| to overskriftsstørrelser 1,06x fra hinanden | h2 hævet, h3 sænket, så trinnet er tydeligt |

To trin-fund står tilbage ved 375 og 768 på 1,12 og 1,13. De er accepteret: de opstår
mellem to clamp-kurver der krydser hinanden på netop de bredder, og at jage dem ville
låse typen til faste størrelser i stedet for til viewporten. Målingen rapporterer og
dømmer ikke, hvilket er det rigtige for et håndværksspørgsmål med et tal bag.
