---
title: Astro, islands off by default
read: at run order step 4, after stack detection, before the first file is written
---

**Tokens go in one plain stylesheet imported from the base layout.** A component
`<style>` block is scoped by a compiler-generated attribute and only ships on routes that
render that component, so `:root` custom properties declared there exist on some pages
and vanish on others. The symptom is a direction that holds on the home page and reverts
on a subpage. Scoped styles remain the default for everything else, and `is:global` is
the exception you have a reason for.

**Routes are files in `src/pages/`, one `.astro` per URL, layouts in `src/layouts/`.**
Anything editorial goes in a content collection: schema in `src/content.config.ts`,
entries under `src/content/`, one `[slug].astro` driven by `getStaticPaths`. Skipping the
collection buys you a hand-maintained file per post.

**Fonts are self-hosted under `public/` and declared next to the tokens**, preloaded from
the single `<head>` the layout owns. A `@font-face` sitting in a scoped block starts
loading only after that component's CSS resolves, and that is a shift you see at 375px
and not on your machine.

**Verify runs against `npm run dev` on port 4321** with nothing built first. If the
project has an SSR adapter configured, build and use `astro preview` on 4322 instead,
because dev output and adapter output diverge. Run `astro sync` after you touch a
collection schema.

**Every island is a line in the direction record.** A component with no `client:*`
directive renders once at build and its script never runs: the control looks correct,
does nothing, and reports no error anywhere. The reverse costs more, because one
`client:load` on a single button pulls a whole framework runtime onto the page.

Two directives on the same component are two roots with separate state, so a header
toggle and a drawer built as separate islands disagree about whether the menu is open.

`new Date()` in the frontmatter evaluates at build and freezes into the HTML, so a
last-updated line shows the deploy date until someone deploys again.

Scoped selectors never reach markup injected with `set:html` or rendered from Markdown,
because the scoping attribute is added at compile time to elements the compiler can see.
