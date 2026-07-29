# DIRECTION — Tideworks duty board

Three comps under `directions/`, rendered with real copy from `EVIDENCE.md`.
`direction-check.mjs` reports pairwise structural difference of 5, 5 and 5 on the five axes.

---

## Axis record

- composition: a 56px chrome bar, one status line beside the title, then a six-lane shared time ruler at full width above the ruled tables and the log
- type: one monospace throughout, because every column on this board is a time, a depth or a set of initials, and figures come out tabular by construction
- colour: near-black continuous ground for a hut at 04:40, switched to a designed day sheet from the chrome bar rather than from a machine preference, with one accent — signal green — reserved for a window that is still open and for the passage the keeper is about to log
- imagery: deliberately imageless, no photograph and no illustration; the one drawn thing is the tide-window instrument, which is data
- rhythm: one continuous field, sections separated by full-width hairline rules with the section marker set small above each

- signature-selector: .tidechart
- signature-min-share: 14

---

## The winner — A, the shared ruler

The tide is one thing and all six locks hang off it, so the board draws **one time ruler** and
lays the locks across it as lanes, ordered by when their window shuts rather than by name. Each
window is drawn in two parts: the part already gone is a 4 px line, the part still to come is a
14 px solid bar. The keeper reads the solid lengths and knows, without arithmetic, the order in
which they will lose them — *Salter's Lode* is a stub, *Denver* runs off to the right.

Scores, out of the five criteria in `20-direction-lab.md`:

| criterion | A | B | C |
| --- | --- | --- | --- |
| comes from the subject (not rebadgeable) | 5 | 4 | 2 |
| serves the primary action | 5 | 3 | 3 |
| buildable and maintainable | 5 | 5 | 3 |
| avoids the anti-references | 5 | 4 | 1 |
| one thing worth defending | 5 | 3 | 3 |
| **total** | **25** | **19** | **12** |

**The signature:** the two-part window bar on a shared ruler — gone as a hairline, remaining as
a solid — with a 2 px "now" rule and a dashed high-water rule cutting through all six lanes.
Remove the wordmark and that instrument still says which board this is.

**The graft, from B:** the paired *morning / evening* window columns in the lock table, and B's
discipline of printing the datum beside every depth — "sill at MLW", never a bare "0.4 m". That
habit is why the board can say a boat is clear at any state of tide and can also say, honestly,
that it does not know how much water is over the sill at 05:12.

**One controlled risk:** the whole page is set in one monospace, including the running prose.
That is defensible here and would not be on a page with paragraphs — mode P keeps prose to a
line of context, an error and a note, and everything else is figures that must align.

**One thing this direction had to decide that the axes do not cover.** The board must work in
both colour schemes *and* open dark at 04:40, and those cannot both come from
`prefers-color-scheme`, because a browser told nothing reports `light`. Driving the palette from
that query makes the board open paper-white in a dark hut. So the sheet is a control in the
chrome bar — night by default, day one click away, remembered on the machine — which is how a
ship's bridge display does it and is the controlled-environment case core rule D7 allows.
`DESIGN-SYSTEM.md` carries the full argument; both sheets are axe-checked separately.

## Rejected — B, the printed tide table

**What it did well.** It is the most beautiful of the three and the most faithful to the
reference set: an Admiralty column, a serif head, figures that align down the page. The datum
convention that the winner grafted came from here, and its lock table is better than A's first
attempt was.

**Why it lost.** It has no instrument, so the keeper reads *"shuts in 1 h 02"*, *"1 h 32"*,
*"2 h 32"*, *"3 h 32"*, *"4 h 32"* and ranks five strings in their head at 04:40 — which is the
one piece of work the brief says to take off them. Second: a paper ground in a hut with the
light on is the wrong instrument at the wrong hour. B's ground measures luminance 0.878; the
board is read at 04:40 and the brief says to assume the light is bad.

## Rejected — C, master and detail

**What it did well.** The long-section drawing is the only comp that makes draught-against-sill
a picture rather than a subtraction, and the priority queue as a left rail with the selected
boat marked is a genuinely good console pattern.

**Why it lost.** Two specific reasons. First, master-and-detail shows one boat at a time, and
the keeper's actual question — *which of six locks can be worked in the next four hours* — is
a six-at-once question; a rail that answers it one row at a time has changed the job to suit
the layout. Second, and worse, **the drawing cannot be honest.** The brief gives sill depths at
mean low water and gives no tide heights at all, so the water line in that section is
indicative, and a scale drawing that has to be captioned "indicative" on a go/no-go decision is
a picture that invites a keeper to trust it. Its own caption is the argument against it. The
rounded cards are also the dashboard furniture the brief names by name.
