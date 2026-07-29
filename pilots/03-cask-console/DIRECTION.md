# DIRECTION — Stalbridge cask desk

## The direction, in one sentence

The desk is a whitewashed cellar log page, and the only place it goes black is where casks are
late.

## Why this and not something else

The screen is read standing, in gloves, at four feet, in poor light, with a dray outside. At
that distance a cellarman cannot read a chip, a hue or a digit. He can read **a black rectangle
on a pale wall**. So severity is carried by the ground and by mass: the late work sits in a
full-bleed ink band with the state set as one huge condensed word and rows at roughly twice the
height of everything under them. Due today returns to whitewash under a heavy rule. On trade is
a quiet index. The record closes the page.

That ordering is the brief's non-negotiable one, and here it is also the visual argument: the
page gets lighter and smaller as it gets less urgent. Nothing needs colour to say so, which is
the point, because evidence section 6 says a colour-only state means nothing under a cellar
light and nothing at all to a colourblind cellarman.

The one accent is the red of a condemned cask tag, the only colour that already means anything
in this world, and it carries one meaning: the exception. That is the days-late figure, a
condemned cask's destination in the record, and the border of a refused booking. It is never
used for a pressed control, a heading, a rule, a hover or a section.

## The five axes

- **Composition.** A dense index that starts immediately, with the top block inverted to a
  full-bleed ink band. No hero, no KPI row, no chart, no icon rail. The chrome bar is 72px and
  carries identity, freshness and the four jump links, and nothing else.
- **Type.** Two families and no UI face at all. A condensed grotesque, all caps, for pub names
  and state words, which is the departure board of evidence reference 2. A monospace, tabular,
  for every figure without exception, which is the weighbridge ticket of reference 3. Four
  sizes above body and they are far apart: 76 / 34 / 26 / 18 against a 15px body.
- **Colour and ground.** Warm whitewash `#EAE6DD` from the cellar's own brick, ink `#141310`,
  one stainless grey for secondary figures, and one red. Two declared tints of that red, one
  for the light ground and one for the band, because a red legible on paper is not legible on
  black. Single controlled theme, permitted by core rule D7 and taken deliberately: this is a
  wall-mounted screen under a fixed fluorescent tube, and a scheme that flips under someone
  else's operating system setting is a scheme this room did not ask for.
- **Imagery.** Almost none, on purpose. One drawing: a cask in profile with its shive, placed
  at three sizes whose heights are the cube roots of 9, 18 and 36 gallons, so a row of six
  kilderkins is visibly twice the beer of a row of six firkins before a digit is read. It is
  drawn once and used as the size glyph, the mark and the favicon. One cellar texture sits
  behind the standing bar at low contrast and behind no figure.
- **Rhythm and edge.** Three unequal blocks, graded row height, type size and rule weight:
  2px ink rule under the due heading, 1px stainless hairline in the index. Radius 2px, which is
  the largest a 44px control can carry without eating its own corner. No cards. No shadows. No
  left colour bars.

## Axis record

<!-- The machine-readable block direction-fidelity.mjs reads. Transcribed from the prose
     above and from what the built page measures; the page is unchanged. -->

- composition: a whitewashed log page that goes to ink only where casks are late
- type: condensed capitals display over a system sans, mono tabular figures throughout
- colour: light limewash ground, ink reserved for the late band, one condemned-tag red
- imagery: deliberately imageless, one drawn cask at three true volume ratios
- rhythm: three unequal blocks, graded row height and rule weight

## The signature

The **ink band** is the direction. It is full bleed, it carries the late work and its controls,
and it is the first and largest object on the screen.

- signature-selector: .band--late
- signature-min-share: 40

## Scores, out of 5 each

| | A, inverted band | B, tally wall | C, departure board |
| --- | --- | --- | --- |
| Comes from the subject | 5 | 3 | 4 |
| Serves the primary action | 5 | 3 | 2 |
| Buildable and maintainable | 5 | 4 | 5 |
| Avoids the anti-references | 5 | 1 | 1 |
| One thing worth defending | 5 | 3 | 2 |
| **Total** | **25** | **14** | **14** |

## The two that lost

**B, the tally wall.** It did one thing better than the winner: the standing tally answers "how
many casks are at each pub" at a glance, which is the brief's second requirement, and the bars
make gallons comparable without arithmetic. It lost because a permanent 320px column takes a
fifth of the width away from the only thing that matters at 06:40, and because the queue beside
it renders every consignment at the same height, so the late rows and the due rows are told
apart by a red left bar and a red numeral, which is the colour-only state the evidence forbids.
Rendered at 1440 it also lands squarely on anti-reference 1: a chart in a panel next to a list.

**C, the departure board.** It is the most literal reading of evidence reference 2 and the
monospace grid is genuinely handsome. It lost on the same sentence a blind reviewer already
wrote about the previous build: with the copy removed it is the stock dark operations table.
Equal-height rows mean a board cannot rank its own rows, so lateness is carried by an amber and
a red word alone; the book-in controls compress into a 280px gutter where the button ends up a
ghost outline, which is the exact failure the brief names; and dropping the glyphs throws away
the volume signal that is the whole argument for having a drawing at all.

## The graft

Taken from B: the standing tally. It is kept as data but not as furniture, appearing as one
tabular line in each block heading and one in the chrome bar, so the answer is on screen
without a column being spent on it.

Taken from C: state as a word at size, at the head of each block rather than in each row. That
is what lets the rows drop their status chips entirely, which is what lets the button be the
loudest thing in a row.

## Consequences recorded, so a later reader does not re-derive them

- **No per-row status chip.** State is the block. This is how the brief's rule that the action
  outranks any status is satisfied structurally rather than by tuning weights.
- **Controls on every outstanding row, including the quiet index.** A dray brings back what it
  brings back, including casks not yet due, so every row is bookable. The blocks differ by
  scale, not by capability.
- **Figures.** The board is the working week in `EVIDENCE.md` section 8. Anchors are the pack's
  own: gyle 214, four firkins at the Feathers, dropped Tuesday, two back dirty, and the trade's
  cask sizes. The rest of the week was constructed from those primitives and written into the
  evidence pack before it was drawn, so every figure on screen is sourced.
