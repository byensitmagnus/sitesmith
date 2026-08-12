# What was measured on both sites, by the same external tools

Neither site's own tooling produced any of this. Both were served as production builds and
driven by identical code: every page crawled, every internal link followed, every page
rendered at 375, 768 and 1440 pixels, axe run against WCAG 2.1 AA on each page at each width.

The journey was defined from the brief and then driven through whatever controls each site
actually built. Different controls are allowed; the goal is the same on both.

## Candidate 1

- pages the site links to: 2
- pages that failed to load: 0
- links that lead nowhere: 0
- console errors: 0
- horizontal overflow at 375, 768 or 1440: 0
- text or controls clipped by their own container: 0
- accessibility violations, axe, WCAG 2.1 AA, every page at all three widths: 6
- facts the brief supplies that the site states: 9 of 9
- claims the brief forbids, asserted: 0
- the same claims stated as disclaimers, which the brief asks for: 5

The one journey the brief exists for, driven through this site's own controls:
- PASS: before filling anything in, a visitor can read the price, the 75 km limit and the refusals
- PASS: a postcode outside the area is refused on the postcode field, in the brief's own words, with the other answers kept
- PASS: sewage in the construction is refused on that field, in the brief's own words, with the other answers kept
- PASS: a complete booking produces the case number and the do-and-do-not list

## Candidate 2

- pages the site links to: 4
- pages that failed to load: 0
- links that lead nowhere: 0
- console errors: 0
- horizontal overflow at 375, 768 or 1440: 0
- text or controls clipped by their own container: 0
- accessibility violations, axe, WCAG 2.1 AA, every page at all three widths: 0
- facts the brief supplies that the site states: 9 of 9
- claims the brief forbids, asserted: 0
- the same claims stated as disclaimers, which the brief asks for: 14

The one journey the brief exists for, driven through this site's own controls:
- PASS: before filling anything in, a visitor can read the price, the 75 km limit and the refusals
- PASS: a postcode outside the area is refused on the postcode field, in the brief's own words, with the other answers kept
- PASS: sewage in the construction is refused on that field, in the brief's own words, with the other answers kept
- PASS: a complete booking produces the case number and the do-and-do-not list
