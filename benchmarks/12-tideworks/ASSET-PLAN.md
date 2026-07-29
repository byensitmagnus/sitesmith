# ASSET-PLAN — what each drawn thing is for

Written after `EVIDENCE.md` and `BRAND.md`, before anything was drawn.

`EVIDENCE.md` section 7 records the finding this plan is built on: **this subject has no
pictures.** No photography exists, none is owned, and none is needed — the reader has stood at
these six locks for years and does not need to be shown what a lock looks like at 04:40. So
`DIRECTION.md` declares `imagery: deliberately imageless` and means it: there is no photograph
on this page, no illustration, no icon set, and no decorative mark.

What the page does need is one **instrument**. `v2/modes/product-ui.md` section 5 is explicit
that charts are not imagery — they are data — and that is the distinction this plan turns on.
The tide-window ruler is planned, drawn and recorded here exactly as a photograph would be,
because it carries the visitor's primary job; it is drawn in CSS rather than as an SVG or an
image so that its labels stay at reading size at 375, 768 and 1440 instead of scaling to four
pixels on a phone in a hut.

Three assets. Two of them are the mark and the favicon, which cannot be designed out.

---

## `tide-window-instrument`

- kind: product
- carries: that the five workable locks lose their windows in a fixed order, and how much of each window is left right now, without the keeper ranking five durations in their head at 04:40
- job: know which of six locks can be worked in the next four hours, and which are about to close
- use: full width of the container, directly under the status line and above every table; six lanes on one shared 01:00–09:30 ruler; each window drawn twice — the elapsed part as a 4px line, the remaining part as a 14px solid bar — cut by a 2px "now" rule and a dashed high-water rule
- comparative: yes — all six locks and both rules in one frame, on one axis, at one scale
- without-it: the board becomes five sentences that each say "shuts in 1 h 02", "1 h 32", "2 h 32", and the ranking work goes back to the keeper, which is the one job the brief says to take off them
- evidence: EVIDENCE.md section 8, "Windows today, from HW 05:12 and HW 17:38", and "At 04:40"

## `mark-tideworks`

- kind: brand
- carries: that this screen is the duty board and not one of the other things on the hut computer, by showing the board's own instrument — elapsed line, now rule, remaining bar — at 24px in the corner of the eye
- job: read the board at the start of a shift and work from it for twelve hours
- use: 24px glyph plus the word TIDEWORKS at 13px, once, at the left of the 56px chrome bar and nowhere else; never larger, never centred, never repeated in a footer
- comparative: no
- without-it: the chrome bar carries a bare line of text and the board is not identifiably anything, which matters on a machine that also runs other screens
- evidence: none — brand asset

## `favicon`

- kind: brand
- carries: which tab is the duty board when the hut machine has several open, at 16px and with no words available
- job: come back to the board through the day without hunting for the right tab
- use: the same drawn glyph as the mark, 32×32, the three strokes only, no wordmark at that size
- comparative: no
- without-it: the tab shows the browser's default document icon and the board is indistinguishable from anything else open
- evidence: none — brand asset

---

## Considered and cut

**A long-section of each lock**, drawing the chamber, the sill and the boat's draught against
it — direction C built one. Cut, and the reason matters: the brief gives sill depths at *mean
low water* and gives no tide heights whatever, so any water line in such a drawing is
indicative. A scale drawing captioned "indicative", used for a go/no-go decision, invites a
keeper to trust a measurement the board does not have. The comparison is carried in words
instead — "0.8 m over a 0.4 m sill at MLW — needs 0.4 m of tide" — which is exactly as much as
is known and no more.

**A per-boat draught bar** next to each queue row. Cut on the plan's own test: its honest
`carries:` line would have been "it makes the column easier to skim", and an expert reading six
rows does not need a picture to see that 0.8 is more than 0.4.

**A tide curve.** Cut for the same reason as the long-section: drawing a curve requires
heights, and there are none. The board shows *times*, which it has.

**Photography of the locks, the boats, the hut.** Cut before it was considered. Nothing exists,
nobody would take it, and it would carry nothing at 04:40.

## How this squares with the direction

`asset-plan.mjs` notes that the direction declares imagery is not load-bearing while the plan
carries a `product` asset, and asks whether the two still agree. They do, and the distinction
is deliberate:

- **No imagery.** No photograph, no illustration, no stock, no decorative glyph. The page is
  carried by type, hairline rule and one accent, which is what `imagery: deliberately imageless`
  claims and what the rendered page delivers — measured asset share on the first screen is under
  1%.
- **One instrument, which is data.** Planned to the same standard as a photograph would be, and
  recorded in the manifest. If it were cut, the page would still stand up and would be worse at
  the job; that is what `without-it` says, and it is why it is here.
