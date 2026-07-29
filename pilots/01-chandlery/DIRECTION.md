# DIRECTION: Trelfall & Son

Chosen: **B, "The rack."** The page is the coil rack seen from above. Five ropes lie parallel
across one bench, in one light, at one scale, and each carries its own tag: price a metre,
breaking load, batch, what is left on the coil. You buy by pointing at a rope and saying a
number of metres, which is what happens at the counter.

---

## The three directions

### A. The cut ticket

The page as a carbon-copy docket. Buff ground, a ruled ledger, every line a row of figures with
the picture reduced to a thumbnail at the left. The order builds as a second docket beside it.

- **first-screen composition**: a dense index that starts immediately, ledger rules across
- **typographic system**: mono throughout, one family, size doing all the work
- **colour and ground**: buff paper, tar ink, red stamp, one continuous field
- **role of imagery**: data-led, images incidental at 64 px
- **rhythm and edge**: ruled lines every row, no radius, very tight

**What it did well.** It was the most honest about what the business is: a price list you can
read in one pass, with nothing between you and the figures. The mono setting made every column
scan.

**Why it lost.** The buyer's decision in this trade is *which construction*, and A answered it
with a word. At 64 px you cannot tell a laid rope from a braided one, and two of the four
photographs stop earning their place. A page that renders its own product photography
decorative has misread the brief.

### B. The rack  *(chosen)*

Each line is a horizontal band: a strip of the rope lying across the bench, then the name and
what the construction does to you, then the tag, then the length field and the cut button. Five
bands stacked. The pictures were all shot on one bench under one window, so stacked they read
as one rack, and two rows are in the eye at once at 1440 and one and a half at 390.

- **first-screen composition**: a horizontal rack of full-width bands that starts immediately
- **typographic system**: an industrial condensed sans (DIN lineage) against a printed-catalogue
  serif, with a monospace carrying every figure
- **colour and ground**: manila buff paper, tarred-hemp ink, one stamp red on the purchase path
- **role of imagery**: photography-led and load-bearing: the strips are the comparison
  instrument, and removing them removes the argument
- **rhythm and edge**: one continuous field, hairline under each band, square corners, one
  full-bleed picture at the top and one tar band at the foot

### C. The counter, split

A hard vertical rule down the middle. Left: the bench photograph full-bleed and fixed, the rule
and the hot knife always in view. Right: a scrolling column of lines and the ticket.

- **first-screen composition**: a split down a hard vertical rule
- **typographic system**: serif display at scale, sans only for labels
- **colour and ground**: tarred ground, straw type, the photograph carrying all the light
- **role of imagery**: object-led, one image doing the atmospheric work
- **rhythm and edge**: asymmetric column running the length of the page

**What it did well.** The best first impression of the three. The bench held still while the
lines scrolled past it, and it felt like standing at a counter.

**Why it lost.** Half the width went to one photograph that never changes, so the four rope
studies were reduced to 180 px thumbnails in a narrow column and the figures wrapped. It also
put the fixed picture where the comparison should be: you cannot hold two constructions in the
eye at once when only one column is scrolling, which is the single thing the brief asks for.

---

## Scoring

| criterion | A | B | C |
| --- | --- | --- | --- |
| Comes from the subject | 4 | 5 | 4 |
| Serves the primary action | 4 | 5 | 3 |
| Buildable, assets exist | 5 | 5 | 4 |
| Avoids the anti-references | 5 | 5 | 3 |
| One thing worth defending | 3 | 5 | 4 |
| **total** | **21** | **25** | **18** |

Anti-references, by name from `EVIDENCE.md` §6: no lifestyle photograph with three benefit
cards and a testimonial band (there is no testimonial band and no rating anywhere, because none
has been measured); no black-and-gold heritage styling (the ground is catalogue buff, the type
is an engineering face, nothing is gilded); no harbour at sunset (the only wide picture is a
bench, cropped to a band, with no horizon in it).

**The graft.** B takes A's fixed figure column. In every band the tag sits in the same place at
the same width, so the four prices, the four breaking loads and the four batch numbers line up
down the page and can be read as a column even though each belongs to a row. That is A's whole
idea, kept.

---

## The axes, as built

- **composition**: a horizontal rack of bands, measured starting 383 px down at 1440 and 419 px
  down at 390. Two complete bands, both pictures, both prices and both cut buttons are on the
  first screen at 1440x900; at 390x844 the first band's length field and cut button land at
  y 711 and y 765, clear of the 50 px ticket bar at the foot.
- **type**: Bahnschrift / DIN Alternate condensed for names, labels and the headline;
  Constantia / Iowan Old Style for prose; Cascadia Mono / Consolas for every figure, tabular so
  columns of prices do not shift under their own digits. Three families, the third carrying
  data, which is the only reason a third is allowed. No font is fetched: an industrial DIN and
  a print serif are both already on the machine, and a page that waits on a network for its
  type is a page that flashes. The one setting that would be recognisable with the words
  removed is the numerals: prose runs old-style figures, which sit in the line like a printed
  catalogue, and every figure that is compared runs lining and tabular in the mono. A number
  that a buyer has to weigh looks different from a number in a sentence, on purpose.
- **colour**: `#EBE2CC` manila catalogue paper, `#211A13` tarred hemp, `#9E2B17` certificate
  stamp red used on the purchase path and nowhere else. Dark scheme is the same counter under
  the tar: `#14110D` ground, `#E8DBBA` straw type. Every pairing computed, not eyeballed.
- **imagery**: four rope studies cropped to a 2:1 band and stacked so the benches align, plus
  one bench photograph full-bleed at 132 px tall. The eight-plait study was shot on a cooler
  board and carries a warming grade so the five bands read as one bench.
- **rhythm**: one continuous paper field from masthead to footer, hairline under each band
  only (never above and below), square corners throughout, one full-bleed picture at the head
  and one tar band at the foot. Nothing alternates.

## The one thing I would defend

The bands. Four ropes photographed on the same oak under the same north window, cropped to the
same strip and stacked, so the lay of the three-strand and the braid of the double braid are
the same size on the screen, 190 px apart, at the same diameter. That is the comparison a
chandler makes by putting two coils next to each other on the counter, and it is not available
to any site in this category that runs a three-card feature row.

- signature-selector: .rack
- signature-min-share: 32

## Figures that are not in EVIDENCE.md

Every price, breaking load and batch number on the page is from `EVIDENCE.md` §8. Two other
classes of number appear and are marked in the markup with `data-source`:

- **What is left on each coil** (184 m, 96 m, 147 m, 118 m). Required by `JOURNEY-INTENT.md`
  §3, which asks that a length above what is on the coil be refused by name. These are stock
  counts, not prices, loads or batch numbers, and each carries
  `data-source="counter stock count, not a published figure"`. They are deliberately not round,
  because a coil that has been cut from is not a round number.
- **The order total and every line total**, which are arithmetic on the published per-metre
  figures and the £1.80 whipping charge, and carry `data-source="arithmetic on the per-metre
  figure"`.

No rating, review count, delivery date, warranty or certification appears anywhere, because
none has been measured. The out-of-stock line publishes no restock date for the same reason and
says so in the words.
