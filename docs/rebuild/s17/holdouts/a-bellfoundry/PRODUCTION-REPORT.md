# Production report, bell foundry open day

Built with `skills/sitesmith-v3`, surface `experience`, stack `static`.

Scenario: experience

## Files opened

- `skills/sitesmith-v3/SKILL.md`
- `skills/sitesmith-v3/run.md`
- `skills/sitesmith-v3/motion.md`
- `skills/sitesmith-v3/stacks/static.md`

## Where the facts came from

Every time, every temperature-free claim and every practical detail is from the foundry's
own day programme. What is deliberately absent: visitor numbers, ticket prices, parking,
years in operation and any description of the sound beyond the harmonic ratios, because
none of them is in the programme.

## Run notes

- viewports: 375, 768 and 1440 all rendered, none skipped
- axe both schemes: ran in light and dark
- live server: a local static server, not a file:// URL
- anti-slop linter: `gate.mjs` ran over this directory with a browser present
- fallbacks: none taken, no check was degraded or waived

## Mechanical findings

- reduced-motion-complete: the reduced-motion render was checked for content that exists only for a reader who scrolls
- no-blockers: the first render raised nothing

## Reconciliation

- reduced-motion-complete: confirmed. The preference sets the scroll number to 1 rather than shortening a duration, so every overtone bar is full and no content is missing
- no-blockers: confirmed as clean, and stated here rather than left as silence

Nothing on this list is still open.
