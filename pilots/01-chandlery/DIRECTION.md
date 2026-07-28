# DIRECTION — Trelfall & Son

**Chosen: A, the counter.** Graft from C: the cut-length control and the running total, moved
inside the row.

## Scores

| | A counter | B coil | C ticket |
| --- | --- | --- | --- |
| 1. Comes from the subject | **5** | 4 | 2 |
| 2. Serves the primary action | 3 | 1 | **5** |
| 3. Buildable and maintainable | **5** | 3 | **5** |
| 4. Avoids the anti-references | **5** | 2 | 2 |
| 5. One thing worth defending | **5** | 4 | 3 |
| **Total** | **23** | 14 | 17 |

## The signature

**The cross-section is a column, not an illustration.** Every row of the catalogue opens with
a drawing of the rope's construction at a size where a lay is distinguishable from a braid,
because choosing between three-strand and double braid *is* the purchase decision in this
trade and every competitor buries it in a paragraph.

## Why B lost

The plate at scale is the strongest single image in the three comps, and on a dark ground the
white line drawing reads exactly like the technical plate a chandler's catalogue would print.
It lost on two things.

It is one product per screen in a shop with sixty-one lines, so the comparison the buyer came
to make cannot happen. And the dark ground with a large serif lands close to anti-reference 2
— "premium" heritage styling — which is a distillery's costume, not a trade counter's.

## Why C lost

C serves the transaction better than either of the others: it is the only comp where the
total is the largest figure on the page, which is correct, because a length priced per metre
has no knowable price until the buyer says how long.

It lost because it is the generic configurable-product page with the photograph removed. Take
the copy off and it could sell blinds, worktops or fencing — which is anti-reference 1 almost
exactly, and mode E is the one mode where imagery cannot be substituted. A rope shop that
shows no rope has thrown away its only visual argument.

## The graft, and why it is not a compromise

C's cut ticket is right about the transaction and A is right about the comparison, and they do
not fight: the ticket becomes a control **inside** the catalogue row rather than a separate
page. The buyer sets a length against the row they are already looking at, and the total
appears in the row's last column. Nothing about A's structure changes; one column gains an
input.

## The signature, as a thing on the page

- signature-selector: .sec, .bench
- signature-min-share: 5

Two drawings and one rule: the cross-section is a column of the table, and the bench rule
runs the full width above it. Both are instruments rather than illustrations — the section is
what a chandler compares before buying, the rule is what the transaction is settled by. If
either shrinks back to an icon beside the type, the direction has gone.

## What the revision changed

The catalogue idea was right and under-built: the page measured 2.06 % imagery, which is to
say it was carried by type and hairlines with a small diagram in the first column.

Two changes, no new direction:

1. **The bench rule.** A boxwood metre rule, graduated, brass end-cap worn, running the full
   width above the catalogue. Rope is sold by the metre and this is the instrument the whole
   transaction is settled by — every price below is a price per one of these. It is the
   materiality the page was missing, at the size the object actually is.
2. **The cross-sections went from 72px to 112px**, where the lay, the braid and the parallel
   core are readable rather than merely present.

Together: 7.74 % of the first screen against the 4 % that diagram-led commits to.

## Axis record

- composition: dense index starting immediately, no hero
- type: condensed sans with tabular mono figures
- colour: warm paper ground, one stamp red used once
- imagery: diagram-led, drawings inline in the table at row scale
- rhythm: one continuous field divided by hairlines

Appended to `directions/HISTORY.md`.

## What the comps taught the build

`currentColor` does not cross an `<img>` boundary. Comp B rendered its drawing black on a
near-black ground until the SVG was inlined, and the comp read as a failure of the direction
when it was a failure of the loading mechanism. **Every drawing in the built site is inlined**,
which also makes it stylable per context — the same section can be ink on paper in the table
and paper on ink in the summary.
