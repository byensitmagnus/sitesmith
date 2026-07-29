# INTERACTIONS — Stalbridge cask desk

One screen, one action, and every state below has a way in.

## The primary action

**Book in**, on the row the consignment sits on. There is one per outstanding consignment and
nothing else on the page competes with it: no row carries a status chip, because the state is
the block the row is in and the block says it in a word at size.

Observable outcome, all four at once:

1. the consignment leaves the outstanding list, or its count drops if only part of it came back;
2. the block tally and the standing count in the bar recompute;
3. the movement appears first in this week's record with its condition, its gallons, its ullage
   and where the cask goes next;
4. the line under the standing bar says what was just booked in.

## The controls, all of them on the page

| control | type | notes |
| --- | --- | --- |
| Casks back | `input type=number`, 1 to what is still out | pre-filled with the whole consignment, because most of the time the lot comes back |
| Ullage, gallons | `input type=number`, 0 to what those casks hold | deliberately **not** pre-filled. A duty record should not carry a number nobody entered |
| Condition | four radios in a segmented set: Sound, Wet, Dirty, Condemn | the trade's own words, from evidence section 2 |
| Book in | `button type=submit` | one per row, the heaviest object in that row |

Nothing opens. There is no accordion, no drawer, no modal, no "edit" that produces a field. A
cellarman in gloves gets the control, not a button that makes one.

## Refusals, and what each says

A booking is a duty-relevant record, so it is refused rather than guessed at.

| what is wrong | the message |
| --- | --- |
| no condition chosen | Not booked in. Enter the condition they came back in. |
| ullage left blank | Not booked in. Enter the ullage in gallons, nil is 0. |
| both | Not booked in. Enter the condition they came back in and the ullage in gallons, nil is 0. |
| cask count out of range | Needs how many casks came back, 1 to *n*. |
| ullage larger than the casks hold | Needs an ullage of 0 to *n* gallons, which is what these casks hold. |
| Wet chosen with nil ullage | Needs an ullage above nil, because a cask returned wet still has beer in it. |

The refusal appears in the row, `role="alert"`, and every field in that row points at it with
`aria-describedby`. The offending fields take `aria-invalid` and a 2.5px red border. **A refusal
never clears the row**: the count, the condition and the ullage already entered all stay, and
focus moves to the first field that needs attention.

## States, and how each is reached

| state | how you get there | what it shows |
| --- | --- | --- |
| board as delivered | first load | 3 late, 2 due today, 4 on trade, 4 movements recorded |
| part returned | book in fewer casks than are out | the row stays with the remainder, and the record gains the part that came back |
| nothing late | book in all three late consignments | the band stays a band and says Nothing late back, then names what is back next |
| nothing due today | book in both due consignments | Nothing due today, and it points at the list below |
| nothing on trade | book everything in | Every cask that left the brewery is back |
| refused | submit an incomplete or impossible booking | above |
| reloaded | refresh, or come back tomorrow | identical, because bookings are stored on the screen |

There is no loading state, because nothing on this screen waits on a network. There is no
disabled control, because a dead button with no explanation is a dead end.

There is no undo, and that is the domain rather than an omission: duty is paid at the duty
point, so the record is added to and never edited. The footer says so.

## Keyboard

The whole task completes from the keyboard alone, and the journey spec asserts it.

- Tab order is the reading order in every row: casks, ullage, condition, Book in.
- The condition set is a real radio group, so arrow keys move between Sound, Wet, Dirty and
  Condemn and the group is one tab stop.
- Enter in any field submits that row.
- One focus treatment everywhere: a 3px outline in the opposite ink of whatever surface the
  control is on, offset 2px, so it is visible on the black band and on the whitewash.
- After a booking, focus goes to the cask field of the row if it is still there, and to the
  heading of the block it was in if it has gone. The viewport does not jump.
- The four links in the standing bar reach every block without the mouse.
- The record scrolls sideways only below 900px, and it is a focusable region with a name.

## Freshness

The standing bar states what the board is as at, and what is still out. The line beneath it
states the last movement recorded and when. A desk that cannot say how current it is has an
unanswerable trust problem, which is why both are on screen and neither is behind anything.
