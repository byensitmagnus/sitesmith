# DIRECTION — Marrow & Kell

**Chosen: A, the profile.** No graft.

## Scores

| | A profile | B inscription | C tuning book |
| --- | --- | --- | --- |
| 1. Comes from the subject | **5** | 4 | 4 |
| 2. Serves the primary action | 4 | 2 | **5** |
| 3. Buildable and maintainable | **5** | **5** | 4 |
| 4. Avoids the anti-references | 3 | 4 | **5** |
| 5. One thing worth defending | **5** | 4 | 3 |
| **Total** | **22** | 19 | 21 |

## The signature

**The half-section is page furniture, not an illustration.** It stays in the left column for
as long as the reader is on the page, with the five partials marked at the heights they sound
from. It is there because a bell genuinely cannot be photographed usefully — from the ground
you see the underside, from the chamber you see the frame — so the drawing is not a stand-in
for a photograph, it is the view the trade actually uses.

## What the revision changed

The direction was chosen and then not built. The dark palette sat in the CSS default and the
light one behind `prefers-color-scheme: light`, and the browser defaults to light — so the
page a visitor actually got was a limewash editorial page at luminance 0.823, and the drawing
occupied 4.47 % of the first screen.

Three changes, no new direction:

1. **Dark is now the only scheme.** v2 core D7 permits one controlled theme where the
   environment justifies it: a bell lives in a tower with one window, and a white line drawing
   needs a dark ground to read as a plate rather than a diagram. The light block is gone
   rather than adjusted, because a translation of a design is a second design.
2. **The column is a fixed 440px track** and the drawing fills it — 17.81 % of the first
   screen against the 12 % that "object-led" commits to.
3. **The fill deepened** from .13 to .22 so the section reads as cast metal with mass rather
   than as a wireframe.

One defect found doing it: the UA stylesheet gives `<figure>` a 40px side margin, so a 440px
track rendered a 360px drawing and the measurement sat at 11.93 % — just under the threshold,
and for a reason that had nothing to do with the design.

## The risk this direction takes, and what holds it back

A is the closest of the three to **anti-reference 2: the dark luxury landing page** — black
ground, gold, serif. That pairing is not decoration here: evidence section 4 records bell
metal against near-black as the truest colour in this world, because that is a bell in a
tower with one window. But being right about the source does not stop a page reading as a
whisky advert, so three things hold it apart, and if any of them goes the direction has
failed:

1. **Left-aligned, never centred.** The luxury trope is centred; this is a column.
2. **Wide capitals, not thin.** The reference is cast inscription lettering, which is heavy
   and unhurried because it is read from thirty feet below. A hairline serif would be the
   trope exactly.
3. **Figures everywhere.** Cents, hundredweight, dates. A luxury page has no numbers on it
   because numbers can be checked.

## Why C lost, and it was close

C answers the visitor's actual question first: a tower captain is not shopping for a founder,
they are trying to work out which of their eight bells is the problem. It scores highest on
serving the primary action and on avoiding every anti-reference.

It lost on the fifth criterion. Take the copy off C and it is a card grid — the same card
grid as any product listing, with a small mark repeated eight times. There is nothing in it a
second foundry could not copy in an afternoon, and nothing that could only be about bells.
The per-bell card survives into the build as a section; it is not the page.

## Why B lost

B is the one with the strongest single idea — setting the page as if it were the waist of a
bell, in letters sized to be read from a ringing chamber floor. It is also imageless in mode
M, which the mode allows only for an editorial manifesto, and a foundry taking commissions is
not that. It gives a visitor nothing to check and no way to start. Its lettering discipline
survives into the built site as the display face.

## The signature, as a thing on the page

- signature-selector: .standing
- signature-min-share: 12

The standing column is the signature and it is measurable: the half-section holds the left
edge of the document for its whole length, at a size where the wall thickening into the
soundbow is legible. If it ever shrinks to a thumbnail beside the type, the direction has
gone, and `direction-fidelity.mjs` says so.

## Axis record

- composition: full-height drawing in a fixed column, text scrolling beside it
- type: wide cast-inscription capitals over a system sans, mono for figures
- colour: near-black ground, bell metal, no second accent
- imagery: object-led, one drawing at full column height
- rhythm: asymmetric column running the whole page

Checked against `directions/HISTORY.md`: no earlier winner shares all five.
