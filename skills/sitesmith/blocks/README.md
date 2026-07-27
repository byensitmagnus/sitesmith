# Blocks

> Original work, MIT. Written for sitesmith.

Working implementations, not a schema. `references/09-block-library.md` has carried a
folder layout, a frontmatter format and the sentence "Blocks will be added iteratively"
since the day it was vendored; the folder it points at does not exist and never has. This
is the folder.

## The rule

**A block earns its place by naming the defect it prevents.**

Every block here encodes something that was found by rendering a page, not by reading one —
mostly in this repository, at the cost of a failing build. A block that is only a tidy way
to lay out three cards is not worth a file: the agent can write that, and writing it fresh
each time costs nothing. What the agent cannot reliably reproduce is the `min-width: 0` that
stops a nowrap flex row spilling text past the viewport, or the `tabindex="0"` that makes a
horizontal scroller reachable without a mouse.

This keeps the library small on purpose. Nine good blocks beat forty that restate the
obvious.

## Format

One `.html` file per block. No build step, no framework — semantic HTML and CSS over the
project's design tokens, which any agent can translate to JSX, Vue or Svelte in one pass.

```html
<!--
name: scrollable-grid
category: data
use: A table wider than its column. Any admin, any report.
avoid: Fewer than five rows, or content that reflows — use a definition list.
tokens: --space-3 --space-5 --line --line-2 --surface --surface-2 --ink-3 --text-micro
prevents: A horizontal scroller that no keyboard can reach, and a 1fr parent
          track that widens instead of letting the child scroll.
-->
<style>/* scoped to .block-scrollable-grid */</style>
<div class="block-scrollable-grid"> … </div>
```

`prevents:` is required. If a block cannot name a defect, it does not go in.

**Tokens only.** A block may not contain a colour, spacing value, radius or font size as a
literal. It reads them from the contract in
[`references/12-design-system.md`](../references/12-design-system.md), so a block dropped
into a project inherits that project's system instead of importing a second one.

**Class prefix.** Every selector starts `.block-<name>` so two blocks on one page cannot
collide, and so a project can find and rename them later.

## Verification

The blocks are assembled into one page and run through the same script as every benchmark:

```bash
node tools/build-block-harness.mjs         # writes benchmarks/blocks/index.html
node skills/sitesmith/scripts/verify.mjs http://localhost:4321/blocks/
node skills/sitesmith/scripts/token-drift.mjs benchmarks/blocks/index.html \
  --contract skills/sitesmith/blocks/CONTRACT.md
```

CI runs all three. A block that breaks at 375px, fails axe in either scheme, or reaches for
a literal fails the build — which is the difference between this and a folder of snippets.

## Using one

Copy the markup and the style, drop it in, and delete what the brief does not need. The
blocks assume the token names in `CONTRACT.md`; if a project uses different names, rename
them once at the top rather than editing every rule.
