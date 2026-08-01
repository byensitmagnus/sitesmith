---
title: Plan for Vægtkontrol Nord, one-page site
build: Q
ai_generated: "(C)"
---

## 2. The subject, pinned

A two-person calibration outfit in Aalborg that puts industrial scales back on zero and
leaves a certificate and a seal on the instrument. It is for a shop owner who has just
been told by an inspector that a scale is out of verification. The page has one job: make
that person understand inside a minute that this can be fixed, roughly how long it takes,
and then get them to pick up the phone.

## 3. Nouns from the trade

Nulpunkt. Afvigelse. Tolerance. Referencelod, klasse F1. Loddesæt i kasse.
Kalibreringsbevis. Verifikationsmærke. Plombe. DANAK. Ikke-automatisk vægt.
Klasse III og IIII. Vejeplade. Vejecelle. Tarering. Aflæsning. Display i sort glas.
Recertificering hvert år. Varevogn. Tilkald. Bagerens brødvægt. Fiskehandlerens kasse.
Apotekets finvægt. Støbejern og poleret stål. Grebet på loddet. Filtfoer i loddekassen.
Den lille streg der markerer nul på en skala.

Marks the trade leaves behind: a seal on the housing, a signature on a certificate, a
scale that reads zero when nothing is on it.

## 4. Three theses, and the one I argued second

1. "Et kalibreringsbevis, du kan læse på forsiden." The site as the document the job ends
   with.
2. "En aflæsning mod nulpunktet." The site as the instrument's own logic: everything is
   positioned relative to a datum, and the page shows the movement back to zero.
3. "To teknikere og en varevogn i Nordjylland." The site as the people and the driving.

Ranking put 1 on top, so I built the case for 2 as if 1 did not exist.

**The case for 2.** The nouns in section 3 are not really about paperwork. The certificate
is the receipt; the work is the difference between what the display says and what the mass
actually is. Nulpunkt, afvigelse, tolerance, tarering, vejecelle: the whole trade lives on
one axis with a marked centre. That gives the page a structure, not just a texture. A
datum line can run the full height of the document, every section can hang off it as a
reading, and the hero can be the movement from outside tolerance back to zero, which is
literally the service being sold. Thesis 1, argued honestly, resolves to a serif display,
hairline rules and dense centred columns: one of the named defaults, arrived at by
association rather than by decision. Thesis 3 has warmth but no structure, and with no
photography and no permitted customer stories there is nothing to hang it on.

**Chosen: 2.** Axis: *structural fidelity to the measurement act* over *mimicry of the
document*. What it gets that the others do not is that the layout itself carries the
argument, so the visitor understands the service from the shape of the page before
reading a word of body copy.

## 6. The plan

### Colour, named from section 3

Six values. Light steel ground, one dark instrument panel, one seal accent.

- `--vejeplade` `#E9E7E2` The weighing deck. The ground the whole page sits on, and the
  text colour inside the dark readout.
- `--lod` `#1B1E20` Cast iron and polished steel. All headings and body text on the ground.
- `--nulpunkt` `#46555C` The zero line itself. Every rule, every tick, every mono label.
  Measured 6.2:1 on `--vejeplade`, so it is legible as text, not only as a line.
- `--plombe` `#8E2B1B` Sealing wax on the verification seal. Punctuation only: section
  numbers, the akut flag, link underlines, focus rings. Measured 6.8:1 on the ground and
  2.2:1 on the dark panel, so it is a light-ground accent and never appears on the panel.
  This is the palette rule the reference material warns about, applied.
- `--display` `#0F1416` The black glass of a scale readout. Used for one panel, never as
  the page ground.
- `--tolerance` `#A9B4B8` The acceptable band. Band fill and secondary text inside the
  dark panel, measured 8.8:1 there. Never used for text on the light ground.

### Type

- **Display: Bricolage Grotesque, 700.** Mechanical joints, slightly irregular widths.
  Reads like something stamped rather than set. Used for the h1 and the section headings,
  tight, and nowhere else.
- **Body: Atkinson Hyperlegible, 400 and 700.** Built for people reading under bad
  conditions, which is the actual visitor: someone reading a phone in a shop after an
  inspection. It carries the meaning of the subject without decorating it.
- **Readout: Martian Mono, 400 and 600.** Wide, technical, letterspaced. Only for scale
  labels, section numbers, hours and the phone number. It is the instrument's voice.

The pairing is deliberately not serif display over sans body. Scale: h1
clamp(2.1rem, 6.2vw, 4.15rem) at line-height 0.98, h2 clamp(1.5rem, 3.4vw, 2.3rem), body
1.0625rem to 1.1875rem at 1.6, mono labels 0.7rem at 0.09em tracking.

### Layout

A single hairline datum runs top to bottom through the whole document. Every section body
is attached to it with a left border, so the line is continuous by construction rather
than drawn. From 760px up, the mono section label sits in a column to the left of the
line, so the labels read as tick annotations and the content hangs off the datum
asymmetrically. Nothing is centred except inside the readout panel.

```
 375px                          1440px
+----------------------+      +---------------------------------------+
| Vægtkontrol   [Ring] |      | Vægtkontrol Nord            [Ring ...]|
+----------------------+      +---------------------------------------+
| 01 AFVIGELSE         |      | 01 AFVIGELSE │ Ude af verifikation?   |
|| Ude af             |      |              │ Vi fører vægten tilbage|
||  verifikation?     |      |              │ til nulpunktet.        |
||                    |      |              │                        |
||+------------------+|      |              │ +--------------------+ |
|||  før  |    0     ||      |              │ | før ¦   [band] 0   | |
|||  ¦  [==band==]▮  ||      |              │ | ¦        ====▮==== | |
||+------------------+|      |              │ +--------------------+ |
||                    |      |              │                        |
| 02 BESØGET          |      | 02 BESØGET   │ 1 Du ringer            |
|| 1 Du ringer        |      |              │ 2 Fast pris ...        |
|| 2 Fast pris ...    |      |              │                        |
| 03 TID OG PRIS      |      | 03 TID OG PRIS│ [normal] [akut]       |
| 04 AKKREDITERING    |      | 04 AKKREDIT. │ [loddesæt svg] [segl]  |
| 05 KONTAKT          |      | 05 KONTAKT   │ tlf / mail / åbningstid|
+----------------------+      +---------------------------------------+
   ^ datum at 20px               ^ datum at the label/content boundary
```

### Signature

The deviation readout. A black glass panel holding one horizontal scale: a tolerance band
around a marked zero, a dashed ghost marker sitting outside the band on the left, and a
solid marker that travels from the ghost position to zero once, on load, and stops. It is
the service, drawn. Around it everything stays quiet: no cards, no shadows, no second
accent. Built from four absolutely positioned spans and one keyframe.

Two supporting artefacts, both SVG, both from section 3: a row of five reference weights
in falling sizes with the knob grip drawn, and a crimped seal disc. No other decoration.

Motion: the marker is the one deliberate moment. Under `prefers-reduced-motion` the marker
is simply placed at zero and the animation is never declared, so the meaning survives
without the movement, carried by the ghost marker and the caption.

### One risk

The page has no hero headline block sitting over three soft cards, which is what the
category does. Instead the structural spine is a single hairline at a fixed offset with
every section hanging off it asymmetrically, and the loudest object on the page is a black
instrument readout that shows a fault being corrected rather than a promise. If a visitor
does not read the readout as a scale, the top of the page is a dark rectangle. The caption
under it is written to catch exactly that person.

## 6, second pass: the neighbour swap

Neighbouring brief: a refrigeration service company in the same region that services and
certifies commercial cold rooms, same size, same callout model.

What would survive unchanged: the datum line, the step list, the two callout speeds, the
phone-first header, the mono labels. That is most of the plan, and it means most of the
plan was about the category "regional technical service", not about this client. Even the
readout would survive, because a fridge also has a measured value inside a permitted band.

**Changed:** the readout is no longer a band with a marker anywhere inside it. It is a
band with a marked **zero**, and the marker lands exactly on the zero tick and stops there.
A cold room is correct across a range; a scale is correct at one point, and that point has
a name in the trade. The datum line is therefore called nulpunkt and is drawn as the zero
of the same scale, not as a decorative rule. The accreditation block is now the physical
`loddesæt` in class F1, an object a refrigeration technician does not own, and the section
labels are taken from the weighing vocabulary rather than from generic service words.
Those three changes cannot be transplanted to the neighbour.

## 8. The floor

Real Danish copy throughout, every fact traceable to the brief. Semantic landmarks, one
h1, ordered list for the visit sequence. No form, so no loading, empty or error states are
claimed to exist; the actions on the page are a phone link and a mail link, both with
hover, focus and active states. 320px upward with no horizontal scroll. Every focusable
element sits on the light ground, so the focus ring is 2px `--plombe` at 3px offset
throughout, measured 6.8:1 against that ground. Body text at least 4.5:1, all touch targets at
least 48px high with at least 24px between them, phone and mail links sized above 16px.
No claim on the page that is not in the brief: no customer names, no review scores, no job
counts, no prices, no numbers on the readout scale.
