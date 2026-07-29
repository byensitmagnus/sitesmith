# Round 3 — the rebuild raised the floor and did not clear the bar

> Three sites built from empty directories, five real photographs generated and approved, every
> frozen gate green, and two blind reviewers who scored them 6.5, 4 and 5 against a threshold
> of 8. The one permitted fix round is spent. This stops here and names what is left.

## The verdict

| label | subject | reviewer G | reviewer H | median | threshold |
| --- | --- | --- | --- | --- | --- |
| SHEET-B4 | 01 chandlery | 7 | 6 | **6.5** | 8 |
| SHEET-K7 | 02 foundry | 4 | 4 | **4** | 8 |
| SHEET-R9 | 03 cask console | 6 | 4 | **5** | 8 |

Across the three rounds the same three pilots have scored:

| | round 1 | round 2 | round 3 |
| --- | --- | --- | --- |
| chandlery | 5.5 | 6 | **6.5** |
| foundry | 6 | 6.5 | **4** |
| cask console | 2 | 6 | **5** |

The chandlery has moved a point in three rounds. The other two went backwards from round 2,
and the reason is not that the pages are worse — the reason is below.

## What both reviewers agreed on, unprompted

**One shared component kit.** G: "one studio, one method, one component kit — not one template:
grounds, display faces, imagery and page skeletons genuinely differ." H: "one studio applying
one kit, with genuine per-subject art direction on two of the three." Both then named the same
inventory: a single humanist body sans, an identical letterspaced small-caps label layer, a
coloured-rule confirmation echo, an identical control-plus-value-plus-primary-button action row,
and a two-paragraph "this is invented" footer.

They disagree about which pair is closest — G says B4 and R9 share a row anatomy under the
colour, H says B4 and K7 share a photographic method — which is itself the finding: **every pair
is close on something.**

**One shared bug, and it was mine.** Both found it and H named the mechanism exactly: "an empty
number rendering as a lone comma on both B4 and K7, which is shared code rather than
coincidence." It was. Clearing em-dashes for the conformance ratchet replaced two that were not
punctuation — the nil marker in the chandlery's refused cut price and in the foundry's Nominal
metal-off cell. On pages whose whole job is turning a quantity into a number, the number became
a comma at the exact moment each page explains itself.

## The fix round, and why the scores do not show it

The single permitted fix round is commit `503e87c`. It closed, at source:

- the lone comma in both pages, restored to an en dash, which is the right character for nil in
  a table and is not the banned one;
- the foundry's mobile hero, where an overflowing brass CTA pushed the first line of the
  headline off the screen — both reviewers made this their primary or second criticism, and it
  is what took K7 from 6.5 to 4. The headline now runs 211 to 342 of an 844px screen and the
  call to action closes at 577;
- the cask board's four white buttons, which were the brightest objects on a screen whose
  premise is *late first*, so the eye landed on the actions before the one red row;
- the cask board printing a booking twice in two matching green-ruled blocks — G's primary
  criticism — where one of them was a screen-reader status line wearing the same clothes as a
  record;
- the count numeral touching its unit, and the gallons orphaning to a second line.

**Both reviews scored the sheets as they were before that round.** The medians above are honest
for what was reviewed and are not a measurement of what is in the repository now. There is no
review of the current pages, and this phase permits no further round to obtain one. That is the
precise position, stated plainly rather than argued around.

## What is left, from findings the fix round did not touch

Neither reviewer's remaining findings are cosmetic and none of them is a gate failure.

**Chandlery.** The ticket rail takes a quarter of the desktop width and is empty on a first
visit, so from the second screen down the page is a 520px column beside 400px of blank cream.
The hero is a hard letterbox in which the rope is a cropped sliver while the brass rule takes
the frame. There is no address, telephone or email anywhere on a shop that says "cut at the
counter". The ticket dead-ends after the total with no control.

**Foundry.** Section junctions lose their padding on mobile; the footer hairline runs flush
against the send button; two words orphan onto their own lines on desktop. G called the desktop
page the strongest of the three, "which is what makes the mobile break so costly" — and the
mobile break is fixed, unreviewed.

**Cask console.** The four hues are not disjoint in meaning: amber is *due today* and the error
ring, red is *late* and the error sentence, green is *booked* and the button on the row that
just refused. Each desktop row carries ~354px of nothing between the state pill and the
condition label. On mobile the validation message sits after the submit button rather than under
its field.

## The precise remaining blocker

**A shared component kit is a portfolio-level property, and it cannot be fixed inside one
targeted round on three pages.** Both reviewers, independently, named the same five shared
devices. `portfolio-diversity.mjs` passes all three because it measures ground, display family,
imagery share, mono, hairlines and layout signature — and every one of those genuinely differs.
What it does not measure is the label layer, the action-row anatomy, the confirmation echo and
the footer shape, which is exactly the list two humans produced without being asked to look for
it.

Closing that needs three separately-conceived component vocabularies, not three skins over one.
That is a redesign, not a fix, and this phase forbids it. Adding a gate for it is also
forbidden, and would be the wrong move regardless: the gate would be written to match findings
already in hand.

## What is true regardless of the score

- Three sites were built from empty directories, with nothing carried over from the versions
  that failed rounds 1 and 2 — no palette, class name, table, drawing or disclosure.
- Every frozen gate is green on all three: verify at 375, 768 and 1440 in both schemes with zero
  axe violations, journeys of 20, 22 and 24 assertions, production-gate in modes E, M and P,
  direction-fidelity, token-drift, conformance, and portfolio-diversity three ways.
- Five photographs were generated, judged against the factual risk each plan named, and two were
  regenerated for a stated reason. One line has no photograph because the honest one does not
  exist yet, and the page says so.
- The evidence chain is complete for the first time: sheets committed before dispatch, both
  reviews bound to a checkable `sheet-sha256`, key opened after both were locked.
- No reviewer in round 3 made the generic-template answer their primary criticism.

The three pilots are not showcase work. They are not claimed as showcase work anywhere, the
gallery is not built, and the public page still says v1.0 is in visual preflight.
