# JOURNEY INTENT — Trelfall & Son

> What must be **testable** after the rebuild. Deliberately names no selector, no class and no
> element: the old spec bound to `[aria-controls=cut-DB12]` and `.empty`, and those belong to a
> design that failed. The new build writes its own spec against its own markup.

## The one journey: price a cut, be refused, correct it, order it

1. **The order starts empty and says so in words.** Not "no items" — a sentence that tells the
   visitor what will appear here and why. A count and a total are both visible from the start.
2. **A length prices itself.** Entering a number of metres against a line shows what that cut
   costs, before anything is committed. The price is arithmetic on the published per-metre
   figure, not a second published price.
3. **A length the coil cannot take is refused, and the refusal names the limit.** Below the 3 m
   minimum, or above what is on the coil. "Invalid" is a failure; "the minimum cut is 3 m" is
   the requirement.
4. **The refusal can be corrected in place** without losing the line, the length or the
   position on the page.
5. **Adding the cut changes the order** — the count, the total, and a line that names the batch
   the length was cut from, so the ticket matches the coil.
6. **An out-of-stock line cannot be ordered**, and says when the next coil lands rather than
   only disabling itself.

## What the technical gate must still see

- No console errors, no failed requests, no dead links, no horizontal overflow at 375, 768 and
  1440, and no serious or critical axe violation in either colour scheme.
- Every published figure sourced in `EVIDENCE.md`.
- Every asset in `ASSET-MANIFEST.md` at state `ready`.

## Known failures that must not return

Recorded from two blind review rounds against the old implementation, kept as negative
references only:

- The primary action was the lightest element in its row, and **two independent reviewers
  concluded the site had no length field at all**. The control existed behind a 1px outlined
  button.
- The order panel showed an empty state and never anything else on first visit.
- The masthead lost the page gutter at every width.
- A "5 of 61 lines" claim with no route to the other 56.
