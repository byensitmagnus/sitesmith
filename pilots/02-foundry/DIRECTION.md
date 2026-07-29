# DIRECTION — Marrow & Kell, bellfounders

- signature-selector: .hero__figure
- signature-min-share: 30

Measured share of the first screen at 1440x900: **34.3 %**.

---

## The direction in one sentence

**The page is a tuning book with the lights off**: a near-black foundry ground, three
photographs of the process at long lens, and one instrument in the middle of the page where the
five partials physically retract toward true while the pounds of metal fill in beside them.

The visual argument is subtraction. Everything the page does, it does by taking something away
and showing you the hole: the headline is a subtraction claim, the hero photograph is metal
leaving a bell, the chart is five bars getting shorter, and the accent colour only ever marks
what we cut.

## Why this and not the obvious thing

`EVIDENCE.md` section 6 names the nearest miss precisely: **the dark luxury landing page, black
ground with thin gold serif, centred**, tempting because bell metal really is gold-coloured.
Three deliberate defences against it:

1. **No serif anywhere.** Display is a heavy grotesque set in wide capitals with tight leading,
   which is the letterform of a cast inscription, not of a watch advertisement. Every figure is
   monospaced and tabular, because a tuning book is a table.
2. **Radius nought, everywhere.** Nothing on this page is soft. The work is cast and turned.
3. **The accent is a working lamp, not gilding.** `#f0a63c` is the casting pit at pour, which
   `EVIDENCE.md` section 4 calls the only bright thing in the building. It has exactly one
   meaning on this page: *our intervention*. It appears on the primary action, on the 2019 bars
   and their metal-off weights, and on the focus ring. Nowhere else. Take it out and the page
   loses the ability to say which figures are ours.

Also refused, from the same section: the heritage-craft brochure (no sepia hands, no "four
generations"), and any hero photograph of a church exterior.

## The five axes

| Axis | Value |
| --- | --- |
| 1. First-screen composition | Split down a hard vertical edge: statement left, one process photograph full-bleed right, floor to ceiling |
| 2. Typographic system | One system grotesque plus one monospace. Statements in wide-tracked capitals at 0.045em with 0.94 leading; every measured quantity in tabular mono. Three levels above body |
| 3. Colour and ground | One continuous green-black ground `#0b0d0c` from the patina in the photographs, bone `#e8e3d7` ink, one lamp-amber accent. No band ever changes colour |
| 4. Role of imagery | Photography-led and load-bearing. Three photographs, one treatment: long lens, one hard source, everything unlit falling to near-black. Two of the three are full-bleed and break their container |
| 5. Rhythm and edge | One field, hairline rules between sections, and the rhythm carried by **column structure changing** rather than background: split, three-up, asymmetric split, rail-and-pane, split again. Hard corners, no shadow |

## The two that lost

### B — "The height scale"

The whole page organised as a vertical descent from crown to lip, with a fixed rail showing
where you are on the bell and each section pinned to the height its partial sounds from.

**What it did well.** It was the most specific idea of the three, and nothing else in any
category could have used it. It made "five heights" structural rather than stated.

**Why it lost.** The primary action is an enquiry, and an enquiry sits at the lip, at the bottom
of a descent by construction. Every version of it either broke its own metaphor to put the
enquiry in the first screen or buried the one thing the site is for. It also collapsed at 390,
where a fixed vertical rail is a stripe stealing a quarter of a phone. The graft survives: the
`.heights` index in "One bell, five notes, five heights" is B's rail, reduced to a five-line
typographic scale that costs no layout and no SVG.

### C — "Weight"

Near-black, huge type, figures at 120px, photographs monumental and edge to edge, the whole page
arguing mass because everything in the trade is about mass.

**What it did well.** It looked the best in thumbnail and it had the strongest first screen of
the three.

**Why it lost.** It could be rebadged in twenty minutes. Strip the copy and it is a dark bold
studio site, which is criterion 1 of the choosing rules and scores zero there regardless of how
it looks. It also had nowhere to put the tierce, and the tierce is the most valuable paragraph
on the page: a foundry publishing the partial it failed to bring in. C had no room for an
admission, only for assertions.

## What carries it

`.hero__figure` — the swarf photograph, full-bleed right, floor to ceiling, 34 % of the first
screen. It is the page's claim photographed: bronze leaving a bell and not going back. The
headline states it, the picture proves it, and the chart measures it.

The second load-bearing element is **the tuning book** at `#bench`. Two states, 1904 and 2019.
Switching to 2019 retracts every bar toward the true datum, leaves a pale mark and a grey shadow
where the partial started, and fills the metal-off column in amber. The improvement and the
price move together in one gesture, which is the honest way to sell an irreversible process.

## Contract, in brief

- **Ground** `--pit #0b0d0c`, panels `--floor #111412` and `--bench #161a17`, rules `--rule #333a34`.
- **Ink** `--bone #e8e3d7` (15.2:1), `--loam #a8a294` (7.7:1), `--ghost #8b8578`.
- **Control boundary** `--edge #7c7c72`: 4.6:1 on the ground, 4.2:1 on the darkest panel it is
  ever drawn on. Computed, not eyeballed; the requirement is 3:1.
- **Accent** `--lamp #f0a63c`, 9.5:1 both ways against `--on-lamp #0b0d0c`.
- **Space** one step, ramp `0.5 / 1 / 1.5 / 2.25 / 3.5 / 5 / 7 rem`.
- **Radius** 0. **Motion** 140 / 320 / 520 ms, one easing curve.
- **Single controlled theme.** Declared under core rule D7: the subject is a bell in a tower with
  one window, and a light scheme would be a different building. `color-scheme: dark` is set, no
  `prefers-color-scheme` branch exists, so the page renders identically in both schemes and axe
  passes in both by construction rather than by luck.

### Motion budget

One moment: the tuning book's state change. No entrance animation anywhere, because an opacity
ramp on the hero would gate the primary action at first paint. `prefers-reduced-motion` collapses
every transition to 1 ms.

### Navigation

Three in-page anchors plus the action at 1000px and up. Below that the header carries the
wordmark and the action only: this is one page with four sections, and a hamburger holding three
anchors is furniture. The action is visible at every width.

## One thing to know about the evidence

`BRIEF.md` states that the published cents figures and metal-off weights are St Æthelburga's
tenor, that they appear in `EVIDENCE.md`, and that they are invented for this exercise. The
section was missing from the pack, so it has been written back as `EVIDENCE.md` section 8 with
the tuning table, the 1,568 lb arithmetic on 14 cwt, and the twelve-bell bound that
`JOURNEY-INTENT.md` requires the form to explain. Every figure on the page now resolves to that
file. Nothing was published that is not in it.

## Axis record

<!-- The machine-readable block direction-fidelity.mjs reads. Transcribed from the prose
     above and from what the built page measures; the page is unchanged. -->

- composition: a full-bleed photograph floor to ceiling, then a two-state tuning book beside the argument
- type: system sans display over a system sans body, mono reserved for cents and kilograms
- colour: near-black ground, one metal accent that only ever marks metal removed
- imagery: photography-led, three process photographs, one lighting treatment
- rhythm: one continuous field, sections divided by a single hairline
