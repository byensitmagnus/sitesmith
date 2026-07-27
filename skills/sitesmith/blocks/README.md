# Blocks

> Original work, MIT. Composition patterns for real websites, built on the project's tokens.

The upstream `09-block-library.md` has carried a folder layout, a frontmatter schema and the
sentence "Blocks will be added iteratively" since the day it was vendored. The folder it
names does not exist and never has. This is the folder.

## What a block is, and what it is not

A block carries exactly four things:

1. **Structure** — the arrangement of regions and what contains what.
2. **Semantics** — the right elements, landmarks, labels and relationships.
3. **States** — every state the pattern can be in, and the markup that expresses each.
4. **Responsive behaviour** — how the structure reflows, and where it stops working.

A block carries **none** of these: the direction, the palette, the typeface, the ground, the
rhythm of the page it sits in, or any decision about what this particular site should look
like. Those come from the direction lab and the contract, in that order.

**This is a hard boundary and it is new in v2.1.** The reason is measured. Nine legacy pages
share one hero arrangement, one font stack and one palette recipe, and the more that shape
lives in a reusable block, the more reliably the next site inherits it. A block library that
supplies art direction is a template with extra steps: it makes every site that uses it look
like every other site that uses it, which is the exact failure this skill exists to avoid.

So: a block tells you that a purchase panel needs the price, the variant controls, the stock
state, the action and the delivery promise, in a container that does not reflow the page when
the price changes. It does not tell you what that panel looks like.

## Format

One `.html` file per block. No build step, no framework: an agent translates this to JSX,
Vue or Svelte in one pass.

```html
<!--
name: hero-split
family: hero
modes: M E
structure: Statement region and asset region, side by side, statement first in source order.
semantics: <section> with an accessible name, one <h1>, the primary action as a real control.
states: no-asset (asset region collapses, statement gains the width) | long-headline | rtl
responsive: single column below the container query threshold; the asset never precedes the
  statement in the reading order at any width.
variants: media-right (default) | media-left | media-stacked
pairs: nav-bar, proof-logos, cta-band
not-with: hero-editorial, hero-product
tokens: --space-6 --space-8 --text-h1 --text-lead --measure --accent --on-accent
prevents: A headline that pushes the primary action below the fold at 1440.
-->
<style>/* every selector starts .block-hero-split */</style>
<section class="block-hero-split"> ... </section>
```

`name`, `family`, `modes`, `structure`, `semantics`, `states` and `responsive` are required.
`density` was a field here and has been removed: density is a property of the contract, which
is a property of the direction, and a block asserting one was a block asserting art direction.

**Selecting a block is not choosing a direction.** `hero-split` is a structure — a statement
region beside an asset region. Which arrangement this site's first screen uses is decided in
[`v2/20-direction-lab.md`](../v2/20-direction-lab.md) before any block is opened, and the
block is then the implementation of a decision already made. If a build reaches for
`hero-split` because it is there, the lab was skipped.

**Tokens only.** No colour, spacing, radius or font size as a literal, so a block dropped
into a project inherits that project's system rather than importing a second one. Values a
composition genuinely needs go in the contract's one-off table with a reason.

**Class prefix.** Every selector starts `.block-<name>` so two blocks on one page cannot
collide, and a project can find and rename them later.

**Variants are classes**, not forks: `.block-hero-split--media-left` modifies, it does not
duplicate.

## Families

| Family | Modes | Blocks |
| --- | --- | --- |
| `nav` | M E P | bar, mega-menu, mobile disclosure, breadcrumb |
| `hero` | M E | split, editorial, product-led, category band |
| `catalogue` | E | product grid, product card, filter rail |
| `product` | E | gallery, purchase panel, specification table |
| `content` | M | benefits, services, process, editorial, feature detail |
| `proof` | M E | logo wall, testimonial, review summary |
| `decide` | M E | pricing table, comparison table, FAQ |
| `form` | M E P | field, error summary, multi-step shell |
| `cta` | M E | band, mobile sticky bar |
| `footer` | M E P | full, compact |
| `data` | P | scrollable grid, empty state, rail and pane |

## Choosing one

The direction is already chosen before this list is opened. These steps implement it.

1. **`DIRECTION.md` gives the arrangement.** The mode file gives the argument shape. Neither
   of them is this folder.
2. Take blocks whose `modes` include yours and whose `family` matches the section you are
   implementing.
3. Check `not-with`: one hero per page, one mega-menu, one sticky CTA.
4. Pick the variant the direction requires. If no variant matches, **write the structure by
   hand** — bending the direction to fit an available block is how a library becomes a
   template.
5. Delete what the brief does not need. A block with two thirds removed is normal.
6. Style it entirely from the contract. If a block's own CSS survives into the site unchanged,
   check whether it was carrying a look rather than a structure.

## Verification

All blocks are assembled into one page and run through the same scripts as every benchmark:

```bash
node tools/build-block-harness.mjs
node skills/sitesmith/scripts/verify.mjs http://localhost:4321/blocks/
node skills/sitesmith/scripts/verify.mjs http://localhost:4321/blocks/ --font-stress --no-axe
node skills/sitesmith/scripts/token-drift.mjs benchmarks/blocks/index.html \
  --contract skills/sitesmith/blocks/CONTRACT.md
```

CI runs all four and fails if the harness is stale. A block that overflows at 375px, fails
axe in either scheme, or reaches for a literal fails the build, which is the difference
between this and a folder of snippets.
