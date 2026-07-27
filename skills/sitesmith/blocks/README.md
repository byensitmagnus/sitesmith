# Blocks

> Original work, MIT. Composition patterns for real websites, built on the project's tokens.

The upstream `09-block-library.md` has carried a folder layout, a frontmatter schema and the
sentence "Blocks will be added iteratively" since the day it was vendored. The folder it
names does not exist and never has. This is the folder.

## What a block is

A working section of a real website — a header, a hero, a product grid, a pricing table — in
semantic HTML and CSS over the design tokens, with **variants** and **compatibility
metadata** so it fits the mode and the direction instead of imposing one.

Blocks are not a template. A library that produces the same site twice has replaced one
generic look with another. Every block declares which modes it suits, which variants it has,
and what it does not go with, so the composition stays a decision.

## Format

One `.html` file per block. No build step, no framework: an agent translates this to JSX,
Vue or Svelte in one pass.

```html
<!--
name: hero-split
family: hero
modes: M E
use: The default marketing hero. Statement left, one asset right.
avoid: Product pages, where the gallery and the purchase panel own the first screen.
variants: media-right (default) | media-left | media-stacked
pairs: nav-bar, proof-logos, cta-band
not-with: hero-editorial, hero-product
tokens: --space-6 --space-8 --text-h1 --text-lead --measure --accent --on-accent
density: spacious
prevents: A headline that pushes the primary action below the fold at 1440.
-->
<style>/* every selector starts .block-hero-split */</style>
<section class="block-hero-split"> ... </section>
```

`name`, `family`, `modes`, `use` and `variants` are required. `prevents` is optional: it was
required when this library held only defect-preventing infrastructure, and a composition
pattern earns its place by being a good composition.

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

1. The mode file gives you the argument shape and the hero family.
2. Take blocks whose `modes` include yours and whose `family` matches the section.
3. Check `not-with`: one hero per page, one mega-menu, one sticky CTA.
4. Pick the variant that fits the direction, not the first one listed.
5. Delete what the brief does not need. A block with two thirds removed is normal.

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
