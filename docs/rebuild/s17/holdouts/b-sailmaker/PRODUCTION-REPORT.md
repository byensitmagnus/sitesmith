# Production report, storm jib order sheet

Built with `skills/sitesmith-v3`, surface `buy`, stack `static`.

Scenario: buy

## Files opened

- `skills/sitesmith-v3/SKILL.md`
- `skills/sitesmith-v3/run.md`
- `skills/sitesmith-v3/floor/buy.md`
- `skills/sitesmith-v3/stacks/static.md`

## Where the facts came from

Prices, lead time, cloth weight and construction are the loft's own, in DKK excluding VAT.
What is deliberately absent: reviews, customer counts, a guarantee period and any claim
about performance in a named wind, because the order sheet states none of them.

## Run notes

- viewports: 375, 768 and 1440 all rendered, none skipped
- axe both schemes: ran in light and dark
- live server: a local static server, not a file:// URL
- anti-slop linter: `gate.mjs` ran over this directory with a browser present
- fallbacks: none taken

## Mechanical findings

- missing-main-landmark: the first render refused with no <main> landmark
- sum-announced: the running total changes without a page load and had to be announced
- failure-path: the commit had no failure path in the first draft

## Reconciliation

- missing-main-landmark: confirmed, fixed by making the order sheet itself the main landmark rather than a div
- sum-announced: confirmed, fixed with role="status" on the acknowledgement line, so the change is spoken rather than only seen
- failure-path: confirmed, fixed. Sending without a measurement now refuses, names the missing thing, gives the phone number and moves focus to the control that fixes it

Nothing on this list is still open.

## Draft state

draft: yes

release: no

This build is a draft for one reason, and it is named rather than hidden: **no photograph
of the subject exists in the brief.** look.md section 3 puts a client photograph at the top
of the asset ladder and a drawing at the bottom, and it says a page about a physical
subject with no photograph of it is a draft. This is one.

What is missing, precisely: one photograph of the Dacron 340 cloth at close range showing the triple zigzag, and one of a hand-sewn thimble at the clew.

What happens next: ask for it. The drawings on this page are correct for what they are, a
section and a diagram, and they are the wrong answer for a thing that could be
photographed. Nothing here should be replaced by a generated image.
