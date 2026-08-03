# Direction record

## Autopilot, written first so the rest is written next to it

The page I would make without trying: a near-black night ground, one warm amber accent, a
huge geometric-sans wordmark over a CSS lighthouse silhouette with a conic-gradient beam
sweeping the screen on a 30 second loop, an eyebrow reading SIDEN 1863 in wide-tracked
uppercase mono, three rounded cards headed Lyset, Tårnet and Besøg, a two-column
definition list in tabular figures, and a footer with the address. The clever move would
be the rotating beam.

That page is the category. It is also this repository's own round-8 recipe (near-black
ground, one saturated accent, wide-tracked uppercase) in a lighthouse costume, and its
accent is amber when the brief states the light is white. It is not built. The page built
here is in daylight, and it has no beam, no silhouette against a sky and no night.

## Surface

read

## Subject

Hirtshals Fyr, a working lighthouse with one room open to the public, run by two keepers
under the maritime authority. The reader has seen the light from the beach or from a boat
and wants three things: what its flashes mean, how far it reaches, and whether they can go
up. Nothing is for sale. The one thing this page must do is let that reader match what
they saw against this light's own character, and then tell them whether they can climb.

## Constraints in force

- Danish copy throughout.
- No photography exists. Anything visual is CSS, SVG or type.
- One self-contained HTML file, no framework, no external JS. Google Fonts allowed.
- Only the brief's facts may be stated. No invented history, no invented ranges, no claim
  about the view or about the experience of being up there.
- Works at 375, 768 and 1440.

## Assets that exist

None were supplied. No photograph of the tower, of the lantern room, of the optic or of
the two keepers. Everything visual on the page is drawn here. The missing photograph is
named in ASSET-MANIFEST.md and asked for, and this build ships as a draft for that reason.

## Nouns

From the light: kending, blink, mørkeperiode, formørkelse, hvidt lys, nominel lysvidde,
sømil, fyrliste, 1. ordens Fresnellinse, prismeringe, brændvidde, kviksølvbad, lanterne,
lampen, den optiske akse, snit, målsat, terræn.

From the tower and the visit: trin, vindeltrappe, spindel, galleri, omgang, rækværk,
kalket murværk, ingen elevator, meter over havet, kote, vind i meter i sekundet.

From the fog: tågesignal, stød, stilhed, sigtbarhed, sømil, vejret.

From the duty: fyrpasser, vagt, åbningstid, efter aftale, telefon, søfartsmyndigheden,
Fyrvej 27.

Materials, which is where the colour comes from: kalk på murværk, tykt linseglas set på
kanten, kviksølv, jern, og ét hvidt lys. The only colour the brief actually states is W,
white.

## Theses

1. En fyrlisteoptegnelse man kan stå inde i: the official row for this light, expanded.
2. Et ur der tilfældigvis er en bygning: this light is identified by a rhythm in time and
   the visit by a climb in metres, so the page is two instruments with two reading
   directions.
3. En vagtplan med et tårn på: opening hours, the wind limit, the fog trigger, two names.

## Case for the runner-up

For: 1

A light list row is the artefact a mariner actually reaches for, and it is the only
document in this trade whose form is already agreed: position, character, elevation,
range, fog signal, in that order, with no prose between them. Building the page as that
row expanded would hand the reader the exact shape they will meet again on a chart or in a
pilot book, which is worth more than an interpretation of it. It also refuses the
temptation to explain, and this subject punishes explanation: nearly everything a page
would want to say about a lighthouse is either already in the brief or invented, and a
list has nowhere to put an invented sentence.

Against it, and this is why it was not built: the row has the same shape for every light
in the world, so the page would be about the genre of light lists rather than about this
light, and the reader's first question, what did those flashes mean, would arrive as a
cell in a table instead of as the thing they saw.

## Built

Built: 2, axis: time against place, because this light is identified by a rhythm rather
than by a shape, so the page can be built with the light read around seconds and the visit
read down metres and treads.

## Colour

Taken from the materials in the Nouns list, not from a set of roles. The count fell out of
the materials: this subject has chalk, glass, mercury, iron and one white light. Nothing
here is an accent, because the only colour the brief states is white, and it is the light.

- kalk: rgb(222, 230, 224), limewashed masonry, cool and chalky, the page ground
- mørke: rgb(20, 26, 25), the unlit inside of the lantern, the ground of the drawing
- blik: rgb(255, 255, 255), the light. Fl(3) W, and W is the only stated colour
- kviksølv: rgb(154, 163, 166), the mercury the optic floats on, used only on the dark
- glas: rgb(74, 107, 99), thick lens glass seen on the edge, the prisms and the hatching
- blæk: rgb(29, 38, 36), ink for text, measured at 12.2:1 on kalk
- dæmp: rgb(77, 91, 87), secondary ink, measured at 5.6:1 on kalk
- linje: rgb(182, 193, 187), quiet rules
- mål: rgb(111, 127, 121), dimension lines and meaningful rules, 3.3:1 on kalk

No saturated value anywhere, deliberately. A lighthouse in daylight is chalk, glass, iron
and mercury, and its light is white by the definition of its own character.

## Type

Two faces, two jobs, both from Google Fonts, and neither is a pairing this studio would
reach for on another project.

- display: "Marcellus", for the wordmark, the headings and the character string only. An
  inscriptional roman, the register of a cast plate bolted to a tower rather than a
  fashionable display serif. One weight, 400, so it stays quiet at large sizes.
- body: "Archivo", a grotesque out of the signage and table tradition, 400 and 500, with
  tabular figures switched on for every measured value so the numbers stack the way they
  do in a light list.

Scale, fluid with clamp between 375 and 1440: body 17 to 18px, label 13 to 14px, h2 28 to
40px, h1 40 to 64px, the character string 44 to 88px. Tracking is left alone except on the
13px capital labels, which take 0.08em.

## Density, motion and boldness

Dense in the values, open around the two drawings. Every measured value sits in a labelled
row, and the rows are the densest thing on the page.

Nothing moves, and that is a decision with a reason. The one moment of motion this page
wanted was the character running in real time, and the brief's stated intervals do not sum
to its stated period: 0,3 plus 3 plus 0,3 plus 3 plus 0,3 plus 21,1 is 28,0 seconds, not
30. Any animation would have to pick a number the client did not state. The numbers are
printed as given, and nothing on this page asserts a timing through its geometry.

Boldness is spent on the optic section, which is large, dark and dimensioned, and on the
character string at display size. Everything else is quiet.

## Structure

Two coordinate systems, and the page says which one it is in. Each section heading carries
its own unit on the right of the same rule: Lyset is read in sekunder, Tågesignalet in
sekunder, Besøg in meter og trin. That device encodes something true, which is that the
light is a measurement in time and the visit is a measurement in height.

No step numbers, no eyebrows, no 01/02/03. Nothing on this page is ordered, so nothing
claims to be.

The character string is decoded in place, four parts with a label under each, because
decoding the notation is literally the job the brief handed the page.

## First screen

The object that owns it is the optic drawn in section: a first-order Fresnel on its
mercury bath, dark, about 600px square at 1440, dimensioned at 920 mm from the optical
axis to the inner face of the lens. It is the strongest true material this subject has,
because it is the only part of the brief that describes a physical thing rather than a
schedule.

```
1440 x 900
+----------------------------------------------------------------+
| Hirtshals Fyr   Fyrvej 27, 9850 Hirtshals   Lyset Tågen Besøg   |
+----------------------------------------------------------------+
| +---------------------+  Hirtshals Fyr                          |
| |                     |                                         |
| |   OPTIKKEN I SNIT   |  Fl(3)   W   30s                        |
| |   dark field        |  blink tre hvidt perioden               |
| |   |<--- 920 mm      |  ------------------------------------   |
| |   prismeringe       |  Blinket              0,3 sekund        |
| |   lampen på aksen   |  Mellem blinkene      3 sekunder        |
| |   kviksølvbadet     |  Mørket efter         21,1 sekunder     |
| +---------------------+  Perioden             30 sekunder       |
|  billedtekst, én linje   Nominel lysvidde     18 sømil          |
+----------------------------------------------------------------+
```

## Imagery treatment

Two drawings, both technical, both in the page's own token colours, and neither of them a
picture of a place. The optic is a section, because a section is the honest drawing for a
thing that has an inside. The tower is an elevation with a dimension line and a level
callout, because that is how a height is stated without claiming a view.

Materiality is a printed dot screen at 3px pitch and very low opacity across the whole
ground, so the page reads as a sheet that came off a press rather than as a screen. It is
two declarations.

## Argument order

1. What you saw, named: the character string, decoded.
2. What makes it, beside it: the optic in section.
3. The numbers behind the character, as labelled values.
4. The other signal, which is sound rather than light: the fog signal and its trigger.
5. Whether you can go up: hours, 154 trin, no lift, the wind limit, the telephone.
6. Who this is: two keepers, the address, the authority.

## Signature

`.optik`, the first-order Fresnel drawn in section on its mercury bath, with the 920 mm
focal length dimensioned from the optical axis to the inner face of the lens, at one
drawing unit per millimetre so the 920 is a real distance on the page rather than a
caption.

Its kind is a sectional drawing of a machine. That is not the kind this medium reaches for
on a lighthouse: the medium reaches for a silhouette against a sky, or for a beam. What
the page would lose if the signature were that default is the only thing on it that is
specific to this light rather than to lighthouses in general, because a silhouette says
where a light is and a section says what this one is made of. The caption says that only
the focal length is dimensioned, because only the focal length is stated.

## Risk

The page never shows the lighthouse. No tower against a sky, no beam, no night and no
photograph. Every page in this category leads with the building. A reader who came for a
picture of the thing they saw gets two engineering drawings and a page of measurements.

## Answer to the risk

The risk above is answered by `.rejsning`, the tower drawn in elevation in the visit
section: the shaft, the gallery and the lanterne, with a 35 m dimension line down its side
and a level callout reading 57 m over havet at the lantern. The tower is on the page,
drawn as what it measures rather than as a portrait, which is the only version of it this
brief supports.

## Second reading

`.trappen` renders the 154 trin as 154 drawn treads, one stroke each, turning up the
inside of the shaft at seventeen to a revolution. It sits below the first screen, in the
visit section, and it reads a different fact from the signature: the signature carries
920 mm and the optic, and this carries the count of the stair and the wind that closes it.
Standing next to it, in the same type as the values, is the thing this subject does not
know, which is whether the gallery is open today: the wind on the day decides it and the
page cannot say.

## The shell

Who: Hirtshals Fyr, in the header wordmark and again in the footer, where the two keepers
are named. Where: Fyrvej 27, 9850 Hirtshals, in the header line and in the footer. Do:
telephone 98 94 22 71, carried by a tel: link in the visit section and in the footer,
which is the only action the brief supports. A three item nav moves between the light, the
fog signal and the visit.

## Assumptions

- Fl(3) W 30s is read as three white flashes, so the flash colour on the page is white. W
  is the light list abbreviation for white and the brief writes it.
- The light is drawn at the top of the 35 m tower, which is what "the tower is 35 m and
  the light sits 57 m above sea level" implies. The ground line in the elevation is left
  unlabelled rather than given a figure, so no number is stated that the brief did not.
- A first-order Fresnel with 920 mm focal length is drawn with a lens 1840 mm across,
  which is the same fact twice. Its vertical extent is a drawing proportion, it is not
  dimensioned, and the caption says so.
- Google Fonts was checked as reachable before the two faces were chosen.
- The brief's intervals do not sum to its period. The four figures are printed exactly as
  the brief gives them and nothing resolves the difference. The question is in the report.

## Originality pass

First pass produced the plan above. Two swaps followed.

Swap the brief, to a neighbouring lighthouse that is also open to the public: character,
height, tread count and keeper names all survive unchanged, so that much of the plan is
about the category. What changed: the signature stopped being a period dial, which any
light could carry, and became this optic dimensioned at its own 920 mm, which no other
light has.

Swap the trade, to a night-shift bakery: one measurement made circular, one made vertical
and one made as a count would transfer intact, which means the first plan was a process
and not a design. What changed, and this is the change that made the page: the two
readings stopped being two figures in one document and became two coordinate systems with
their own reading directions, time across and height down, each owning a band and a unit
label. The dial went and a to-scale section replaced it, which also removed the animation,
because a to-scale period cannot be drawn from numbers that do not sum to their own
period.

Ledger: run before release, no veto.

## One-offs

- `none` every colour, length, radius and family at a call site is a custom property or a
  clamp, and the literals that remain are utility values

## Deliberate

- `none` this build claims no antipattern on purpose
