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
