# Brief — Tideworks, a lock-keeper's duty board

An internal tool. Not a marketing page, not a shop. The duty board a lock keeper on a tidal
river reads at the start of a shift, and works from for twelve hours.

## What the visitor came to do

**A keeper coming on shift needs to know what the tide is doing, which of six locks can be
worked in the next four hours, and which boats are waiting.**

This is a page that gets read at 04:40 in a hut with the light on, by someone who has done the
job for years and needs the numbers, not an explanation of them. Two things follow:

1. **The tide is the constraint everything else hangs off.** A lock can be worked only within a
   window either side of high water, and the window differs per lock because the sills differ.
   A keeper does not want a tide chart and a lock list; they want to know which locks are
   workable now, which are about to close, and how long they have.
2. **Waiting boats have a priority order** and it is not first come first served. A commercial
   barge on a tide outranks a leisure cruiser that can wait for the next one. Getting this
   wrong costs someone their tide.

## What is true

- Six locks: Stanground, Ashline, Marmont, Salter's Lode, Denver, Welches Dam.
- Each has a workable window expressed as hours either side of high water:

  | lock | window | sill depth at MLW | notes |
  | --- | --- | --- | --- |
  | Stanground | HW −2:00 to HW +2:00 | 1.1 m | narrow, one boat |
  | Ashline | HW −3:00 to HW +3:00 | 1.6 m | |
  | Marmont | HW −1:30 to HW +1:00 | 0.7 m | shallowest sill on the cut |
  | Salter's Lode | HW −0:45 to HW +0:30 | 0.4 m | tidal, silts, shortest window |
  | Denver | HW −4:00 to HW +4:00 | 2.2 m | the long window, and the busy one |
  | Welches Dam | closed | — | out of service since 2006 |

- High water today, at Denver: 05:12 and 17:38. Tomorrow: 06:01 and 18:29.
- Six boats waiting, as at 04:40:

  | boat | type | draught | for | waiting since |
  | --- | --- | --- | --- | --- |
  | *Kesteven* | commercial barge, aggregate | 1.8 m | Denver | 03:10 |
  | *Little Ouse* | commercial barge, empty | 0.9 m | Denver | 04:05 |
  | *Marigold* | leisure cruiser | 0.8 m | Salter's Lode | 22:40 yesterday |
  | *Corbie* | leisure narrowboat | 0.6 m | Stanground | 04:20 |
  | *Wisbech Trader* | commercial, timed cargo | 1.6 m | Denver | 04:33 |
  | *Halcyon* | leisure cruiser | 1.0 m | Marmont | 04:38 |

- Priority: commercial with a timed cargo, then commercial, then leisure by waiting time. A
  boat whose draught exceeds a lock's sill depth at the time it would be worked cannot be
  worked at all, regardless of priority.
- The keeper on shift logs each passage with a time and initials.
- Welches Dam has been closed since 2006 and every keeper knows it. It stays on the board
  because leaving it off makes people ask.

## What must not happen

- No invented tide time, boat, lock or measurement.
- No branding exercise. This is an internal board and a masthead that takes a third of the
  first screen is a fault, not a flourish.
- No "dashboard" decoration: no sparkline that means nothing, no donut chart of six locks, no
  gauge, no card grid of KPIs nobody asked for.

## Constraints

- One page, static HTML and CSS. No build step, no framework, no external requests.
- Must work at 375, 768 and 1440, in both colour schemes. The 375 case is a phone in a hut.
- Assume the reader is expert and the light is bad.
- The page is read at a glance and then read closely. Both have to work.
