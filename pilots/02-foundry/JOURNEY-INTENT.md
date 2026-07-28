# JOURNEY INTENT — Marrow & Kell

> What must be **testable** after the rebuild. Names no selector and no class: the old spec
> bound to a form that failed review. The new build writes its own spec against its own markup.

## The one journey: enquire about a ring

1. **The enquiry is reachable from the first screen** — not only from the bottom of the page.
2. **A field the foundry needs is required, and saying why is part of the requirement.** A ring
   of more than twelve bells is rare enough that the foundry rings rather than emails, so the
   number of bells is bounded and the bound is explained, not merely enforced.
3. **An invalid submission does not clear the form.** It names the field, names what is wrong,
   moves focus to it, and leaves everything else the visitor typed in place.
4. **A valid submission produces a real success state** that repeats back what was sent, so the
   sender can tell it arrived and what it said.
5. **The faculty question is asked**, because whether the tower is mid-application changes what
   the foundry can usefully do first.

## The before-and-after must be a change, not a table

The page argues that tuning is a real, measurable alteration. Its evidence is five partials with
a before value, an after value and a weight of metal removed. That has to be **visible as a
change** — something the visitor can see move, compare, or step through — not only five rows of
figures beside a static drawing.

## What the technical gate must still see

- No console errors, no failed requests, no dead links, no horizontal overflow at 375, 768 and
  1440, and no serious or critical axe violation in either colour scheme.
- Every published figure sourced in `EVIDENCE.md`.
- Every asset in `ASSET-MANIFEST.md` at state `ready`.

## Known failures that must not return

Recorded from two blind review rounds against the old implementation, kept as negative
references only:

- One line drawing held the left half of every screen, unchanged, and never drew the "after" the
  page was arguing for.
- The enquiry form had near-invisible field borders and dim labels on the page whose job is
  sending an enquiry, and one control was the operating system's rather than the page's.
- On mobile the drawing and its caption took the whole first screen, pushing the wordmark 600px
  down and clipping the headline.
- A reviewer named the bell glyph itself as generic.
