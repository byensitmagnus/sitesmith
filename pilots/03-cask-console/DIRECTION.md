# DIRECTION — Stalbridge cask desk

**Chosen: A, the board.** Graft from C: the pub is the scope of the working task, so booking
a dray in filters to one account.

## Scores

| | A board | B log book | C rail and pane |
| --- | --- | --- | --- |
| 1. Comes from the subject | **5** | 4 | 3 |
| 2. Serves the primary action | **5** | 2 | 4 |
| 3. Buildable and maintainable | **5** | **5** | 4 |
| 4. Avoids the anti-references | **5** | 4 | 2 |
| 5. One thing worth defending | **5** | 3 | 2 |
| **Total** | **25** | 18 | 15 |

## The signature

**State is a word in a bordered chip, at a size you can read from four feet.** Evidence
section 3 records the one fact that decides this interface: it is used standing up, on a
wall-mounted screen, in gloves, in poor light, with a dray waiting. Everything follows from
that — five columns, type at departure-board scale, no hover anywhere, and never colour on
its own, because a red row means nothing under a cellar light to a colourblind cellarman.

## Why B lost

B is the most faithful to the artefact: the cellar log exists, it looks like this, and one
line per movement with the week on a page is genuinely how the trade thinks.

It lost on the same fact that decided A. Thirteen-point mono is unreadable at four feet, and
it is a record rather than a working surface — there is nowhere in it to say "two came back
wet". Its column discipline survives into the built site as the history section, at the
bottom, where somebody sitting down reads it.

## Why C lost

C is the one that looks most like software, and that is its problem: it is anti-reference 1
with the KPI cards removed. A rail of accounts beside a stack of rounded cards is what every
inventory product looks like, the cards are sized for a mouse, and scoping to one pub hides
the thing the cellar actually needs on screen — everything due back today, across all pubs,
at once.

Its scoping idea was right and is grafted in: booking a dray in narrows the board to that
pub, because that is the moment when one account is the whole job.

## The signature, as a thing on the page

- signature-selector: .state
- signature-min-share: 3

The state chip is the signature and it is the one thing that has to survive four feet, a
cellar light and a scratched screen. It is a filled block carrying a word, repeated once per
consignment, with the same state echoed as a bar on the row's left edge so the board is
scannable before any word is read. If it ever shrinks back to a bordered label in the fifth
column, the instrument has become a table again.

## What the revision changed

The direction was chosen and then not built. The cellar palette sat in the CSS default and
the light one behind `prefers-color-scheme: light`, so the screen a viewer got was a pale
office dashboard at luminance 0.853, with the silhouettes at 0.55 % of the first screen and
the state a small bordered word.

Four changes, no new direction:

1. **Dark is the only scheme.** A wall-mounted screen in a cellar is a controlled
   environment, which is the case v2 core D7 permits one theme for. The light block is gone,
   not adjusted.
2. **Status dominates.** The chip is a filled block at 17px, 800 weight, minimum eleven
   characters wide, and every row carries a 6px bar of the same state on its left edge.
   Colour is still never the only signal — the word is inside the block.
3. **The figures are instrument-sized.** Cask counts went from 26px to 40px.
4. **The silhouette is sized for the distance it is read at** — 128px, taking assets from
   0.55 % to 5.08 % against the 4 % diagram-led commits to.

## Axis record

- composition: a single table at read-across-the-room scale, no chrome above it
- type: large system sans with very large mono figures, four sizes total
- colour: near-black ground, one amber, red reserved for late
- imagery: cask silhouettes carrying size, one per row
- rhythm: one continuous field with heavy rules

No earlier winner in `directions/HISTORY.md` shares all five.
