# JOURNEY INTENT — Stalbridge cask desk

> What must be **testable** after the rebuild. Names no selector and no class: the old spec
> bound to a row anatomy that failed review. The new build writes its own spec against its own
> markup.

## The one journey: book a consignment back in

1. **The overdue consignment is first in the list and is the loudest thing on the screen.**
   Testable as an ordering assertion, not a matter of taste: the first row is the latest one.
2. **The book-in controls are visible without opening anything.** No disclosure, no accordion,
   no "click to reveal". A cellarman in gloves gets the controls, not a button that produces
   controls.
3. **Condition and ullage are recorded with the booking**, and a booking missing them is
   refused with a message that names what is missing.
4. **An invalid entry does not clear the row** and does not lose the other values.
5. **A successful book-in changes the board**: the consignment leaves the outstanding list, the
   standing counts move, and the booking appears in the week's record with its condition and
   ullage.
6. **The booking persists across a reload.** A cellar desk that forgets what was booked when the
   screen is refreshed is not a tool.

## What the technical gate must still see

- No console errors, no failed requests, no dead links, no horizontal overflow at 375, 768 and
  1440, and no serious or critical axe violation in either colour scheme.
- Every published figure sourced in `EVIDENCE.md`.
- Every asset in `ASSET-MANIFEST.md` at state `ready`.

## Known failures that must not return

Recorded from two blind review rounds against the old implementation, kept as negative
references only:

- Every mobile row printed its own data on top of its own illustration; the list was unreadable.
- The state that was not yet a problem was the loudest thing in the row, and the only real
  control was the dimmest.
- One accent colour marked both a pressed filter and a cask state.
- Rows sat in no order at all — not state, not due date, not gyle, not alphabetical.
- The lower third of the page was an empty six-column table.
- A reviewer said that with the copy removed it was the stock dark operations table, and named
  the same row anatomy the rope counter used.
