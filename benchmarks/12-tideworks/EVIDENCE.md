# EVIDENCE — Tideworks, a lock keeper's duty board

Research, not design. Nothing here picks a colour. Every figure in section 1 comes from
`BRIEF.md` and nowhere else; category knowledge is marked `(inferred)`.

---

## 1. Artefacts

The things this job is made of, and whether any of them can appear on the board.

| artefact | where it is seen | on the board? |
| --- | --- | --- |
| The tide table for Denver — the times of high water | pinned in the hut, and in the keeper's head | **yes**, as figures: HW today 05:12 and 17:38; tomorrow 06:01 and 18:29 |
| The six locks themselves — Stanground, Ashline, Marmont, Salter's Lode, Denver, Welches Dam | on the cut | **yes**, as named rows |
| Each lock's workable window, expressed as hours either side of high water | the standing order every keeper works to | **yes** — Stanground −2:00/+2:00, Ashline −3:00/+3:00, Marmont −1:30/+1:00, Salter's Lode −0:45/+0:30, Denver −4:00/+4:00, Welches Dam closed |
| Each lock's sill depth at mean low water | the survey figure the standing order quotes | **yes** — 1.1, 1.6, 0.7, 0.4, 2.2 m; Welches Dam has none recorded |
| The boats waiting, with type, draught, the lock they want, and the time they reported | VHF, the phone, or a crew walking up to the hut | **yes** — six of them as at 04:40 |
| The passage log — a time and a set of initials per boat worked | the book on the desk, signed by the keeper on shift | **yes**, as the one thing the board is written into |
| The priority order — timed commercial cargo, then commercial, then leisure by waiting time | the standing order | **yes**, as the order of the queue |
| Welches Dam's closure notice, 2006 | the lock itself, and every keeper's memory | **yes** — it stays on the board because leaving it off makes people ask |
| The hut: one desk, one light, a kettle, a VHF set | 04:40, twelve hours | no — the board is the screen, not the room `(inferred)` |
| The guillotine gates at Salter's Lode and Denver, and the silt that builds behind them | the tidal end of the cut | no — the board carries the sill figure, not the structure `(inferred)` |

**What does not exist and must not be invented:** a date, a keeper's name, a tide *height*, a
weather note, a photograph of anything. The brief gives times and depths; it gives no calendar
day and no name, so the board says "today", "tomorrow", "as at 04:40", and "keeper on shift".

## 2. Vocabulary

Words the trade uses, taken from the brief where it uses them and from inland-waterway and
tidal-navigation usage where it does not `(inferred, category)`:

sill · draught · high water (HW) · window · workable · worked · a passage · penning through ·
lock through · the cut · the lode · the drain · the tidal doors · guillotine gate · chamber ·
tail · top gate · bottom gate · paddle · the ebb · the flood · slack water · silts · sounding ·
mean low water (MLW) · datum · commercial · leisure · timed cargo · aggregate · light (empty) ·
narrowboat · cruiser · barge · reported at · out of service · keeper on shift · initials.

Five the category's marketing uses and this trade does not: *seamless*, *real-time insights*,
*journey*, *experience*, *solution*.

Two usages the board must get right:

- **"Sill depth at MLW" is a depth over a datum, not the depth today.** The brief gives the
  sill figures at mean low water and gives no tide *heights*, so the board can prove a boat is
  clear at any state of tide (draught under the MLW figure) but cannot compute how much water
  is over the sill at 05:12. It says so rather than guessing.
- **"Window" is a clock time, not a rule.** A keeper does not want "HW −0:45"; they want
  "04:27 to 05:42". The arithmetic belongs on the board, once, done.

## 3. Materials and surfaces

Water, silt, brick, oak beam, galvanised steel, painted cast iron, a chart, a printed table, a
ruled book with a column of times down the left `(inferred, category)`. Nothing here is glossy
and nothing is soft. The nearest surface to this page is not a screen at all: it is a ruled
page in a ledger and a tide table set in columns — hairlines, tabular figures, no ornament, and
white space that is column gutter rather than composition.

## 4. Colour that is already true

There is no existing brand and none is claimed. What is already true of this world:

| colour | where it comes from |
| --- | --- |
| green / amber / red | the lock's own traffic signal — the only colour code every keeper on this cut already reads without thinking `(inferred, category)` |
| black and white | the balance beams and the gate paint `(inferred, category)` |
| ochre-brown | Fen silt and the tidal water at Salter's Lode `(inferred, category)` |
| near-black | the hut at 04:40, which is the actual lighting condition the brief specifies |

The brief supplies one hard environmental constraint that behaves like a colour fact: the board
is read at 04:40 with the light on, and the reader is told to be assumed expert and the light
bad.

## 5. Constraints already in force

- **The tide is not negotiable.** Every window on the board is derived from HW 05:12 / 17:38
  today and 06:01 / 18:29 tomorrow, and from the per-lock offsets. Nothing else sets them.
- **Draught against sill is a hard stop.** A boat whose draught exceeds the lock's sill depth
  at the time it would be worked cannot be worked at all, whatever its priority.
- **Priority is fixed by standing order**, not by the board: commercial with a timed cargo,
  then commercial, then leisure by waiting time.
- **Welches Dam stays listed.** Closed since 2006, and removing it generates questions.
- **375 px is a phone in a hut**, not a marketing breakpoint. Both colour schemes must work.
- **No build step, no framework, no external request.** One page.
- Accessibility floor: AA in both schemes, keyboard-complete, 44 px targets.

## 6. References and anti-references

**References**

1. **Admiralty tide tables.** A column of times, hairline rules, tabular figures, and a stated
   datum next to every depth. What to take: figures that align down the column, and the habit of
   printing the datum beside the number so nobody misreads a depth as today's depth.
2. **A railway working timetable.** Minute-precision, dense, ordered by when the thing happens
   rather than by name, and readable by one trade only. What to take: ordering rows by urgency,
   not alphabetically, and a single shared time ruler that every row hangs off.
3. **A nautical chart's drying heights.** A number that only means something with its datum.
   What to take: never print a depth without saying what it is measured from.

**Anti-references**

1. **The operations dashboard template** — KPI tiles, a donut of six things, a sparkline with no
   axis, a gauge. Named in the brief as a fault. It answers "how are we doing"; this board
   answers "what do I do in the next four hours", and the two are not the same screen.
2. **Consumer tide and fishing apps** — a blue gradient sky, a sine curve, a big friendly wave.
   They are for someone deciding whether to go out. The keeper is already out.
3. **The waterways-holiday marketing page** — warm photography of a narrowboat at dusk, a serif
   headline, a booking button. Everything it does well is wrong here: nobody is being persuaded,
   and a masthead taking a third of the first screen is a fault, not a flourish.

## 7. Asset reality

| item | exists? | owner | licence | condition |
| --- | --- | --- | --- | --- |
| Photography of the locks, the boats, the hut | **no**, none exists and none is needed | — | — | the reader knows what the locks look like |
| A logo or wordmark | **no** — nothing is owned; a mark is drawn for this project | project | owned | drawn as type plus one glyph |
| A favicon | **no** — derived from the mark | project | owned | drawn |
| The tide-window figures | **yes**, in `BRIEF.md` | brief | owned | complete; six locks, two high waters today, two tomorrow |
| The waiting-boat figures | **yes**, in `BRIEF.md` | brief | owned | complete; six boats as at 04:40 |
| Tide *heights* for today | **no**, and they are not in the brief | — | — | absent; the board must not compute over-sill depth without them |
| Any prior passage log for this shift | **no**, and none is in the brief | — | — | absent; the log opens empty and says so |

The honest summary: **this subject has no pictures.** It has figures, a standing order, and a
book. That is the input to `ASSET-PLAN.md`, and it is a finding rather than a gap.

## 8. Arithmetic derived from the brief

Not new facts — the brief's own figures with the clock arithmetic done, so the board never asks
the keeper to do it. Recorded here so every number on the page can be traced.

**Windows today, from HW 05:12 and HW 17:38**

| lock | morning window | evening window | sill at MLW |
| --- | --- | --- | --- |
| Salter's Lode | 04:27 – 05:42 | 16:53 – 18:08 | 0.4 m |
| Marmont | 03:42 – 06:12 | 16:08 – 18:38 | 0.7 m |
| Stanground | 03:12 – 07:12 | 15:38 – 19:38 | 1.1 m |
| Ashline | 02:12 – 08:12 | 14:38 – 20:38 | 1.6 m |
| Denver | 01:12 – 09:12 | 13:38 – 21:38 | 2.2 m |
| Welches Dam | — | — | — |

**At 04:40** — high water is 32 minutes off; all five working locks are inside their morning
window; the order in which they shut is Salter's Lode 05:42 (1 h 02 left), Marmont 06:12
(1 h 32), Stanground 07:12 (2 h 32), Ashline 08:12 (3 h 32), Denver 09:12 (4 h 32).

**Draught against the MLW sill figure**

| boat | draught | lock | sill at MLW | verdict |
| --- | --- | --- | --- | --- |
| *Wisbech Trader* | 1.6 m | Denver | 2.2 m | 0.6 m under — clear at any state of tide |
| *Kesteven* | 1.8 m | Denver | 2.2 m | 0.4 m under — clear at any state of tide |
| *Little Ouse* | 0.9 m | Denver | 2.2 m | 1.3 m under — clear at any state of tide |
| *Marigold* | 0.8 m | Salter's Lode | 0.4 m | 0.4 m **over** — needs 0.4 m of tide over the sill |
| *Corbie* | 0.6 m | Stanground | 1.1 m | 0.5 m under — clear at any state of tide |
| *Halcyon* | 1.0 m | Marmont | 0.7 m | 0.3 m **over** — needs 0.3 m of tide over the sill |

**Priority order**, from the standing order in the brief — timed commercial cargo, then
commercial, then leisure by waiting time; within commercial, by waiting time:

1. *Wisbech Trader* — commercial, timed cargo, reported 04:33
2. *Kesteven* — commercial, reported 03:10
3. *Little Ouse* — commercial, reported 04:05
4. *Marigold* — leisure, reported 22:40 yesterday, waiting 6 h 00
5. *Corbie* — leisure, reported 04:20
6. *Halcyon* — leisure, reported 04:38

**The tension the board must show and must not resolve:** the three highest-priority boats all
want Denver, whose window runs to 09:12. The two boats that need the top of the tide to clear a
sill — *Marigold* and *Halcyon* — are at the two locks that shut first, 05:42 and 06:12. The
board prints both facts next to each other. The keeper decides.
