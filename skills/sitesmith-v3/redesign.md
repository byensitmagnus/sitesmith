---
title: Redesign, when the code already exists
read: at run.md step 1, before section 2 and before any edit
---

## The preservation contract

Five categories are not yours to change unless the brief says so in words. URLs, their
titles and their redirects. Brand marks and legal copy. Every journey that currently
completes. Form field names and analytics or consent event names. Priced or guaranteed
claims.

If a repair requires breaking one, stop and say so rather than deciding it silently.
Where the brief authorises a break, name it in `PRODUCTION-REPORT.md` with a reason.
`scripts/gate.mjs` fails the run when a URL, title or legal string present in `before/`
is absent from the build without a matching line in that report.

## Classify the job in writing, first

**Preserve** means the direction is right and the execution is not. **Overhaul** keeps
the content and the working journeys and replaces the direction. **Rebuild** is only
when the client has said both are going.

The old look is evidence of what the subject is, never authority over what it becomes.
A missing design document does not make this greenfield, so read the tokens, the shared
components and two representative pages before concluding there is no identity to
preserve. If the job sits between two classifications, write the split into
`.sitesmith/direction.md` first. If both readings would produce different builds, that
is your one question from run.md step 1.

Then run `node scripts/stack.mjs detect .` and read CLAUDE.md, AGENTS.md and README.md.
Any single match means adopt what is there. Migrating stacks is a separate project with
its own budget.

## Read, score, repair, in that order

You may not edit during the read. Score every finding with a file reference and fix
nothing yet. Then repair in obligation order, contract first, then floor, then structure,
re-running the affected pass after each group. A fix applied while reading destroys the
evidence of the pattern it belonged to.

## What the audit has to contain

Record the interaction model of every section before touching it. Scroll slowly first
and watch for anything that moves without you; only when nothing does do you click and
hover. Clicking first is how a scroll-driven original comes back as a carousel with
arrows, right in a screenshot and wrong everywhere else. `scripts/gate.mjs` fails an
audit with a section that has no interaction-model line.

Audit the states, not the load. Drive every tab, toggle and accordion and record what
changes. For scroll-reactive elements, capture the computed values at position zero and
again past the trigger; that difference is the behaviour specification.

Inventory the assets in one pass into `.sitesmith/assets.json`: every `img` src and
srcset, every video source, every computed `background-image`, the fonts actually loaded
and the favicon set, each with the selector it came from. An asset in that file and
missing from the new page is a deletion you must be able to say you chose.

The audit is done when nobody would have to guess: could someone else rebuild a section
without inventing a value? Measure anything they would infer. `scripts/gate.mjs`
refuses an audit carrying `~`, `approx`, `about` or `TBD` in a value position.

**Layer the CSS you add.** Wrap your own defaults in `@layer sitesmith { ... }` and
leave the existing rules unlayered. Unlayered CSS outranks layered CSS at any
specificity and load order, so the client's theme keeps winning without `!important`.
`scripts/gate.mjs` refuses a redesign that adds `!important` to a declaration that did
not already have it.

## Score before and after

Score six dimensions at 1, 3 or 5 before the repair and after: hierarchy, originality,
cohesion, responsiveness, usability, slop resistance. Anything still at or below 2 is a
work item and where the next session starts.

Score originality against this studio's own previous builds, not against sites in
general. Three sites once passed that test one at a time while the portfolio failed on
sameness, and the loose reading reproduces that failure with a number attached.
