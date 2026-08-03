---
title: Shopify, Liquid theme
read: at run order step 4, after stack detection, before the first file is written
---

**Liquid renders on Shopify's servers, and logic belongs in sections and snippets.** A
template names which sections appear; a `{% for %}` or a nested `{% if %}` grown inside
one strands that behaviour where the merchant cannot reorder or reuse it. Move it to the
section owning the markup, or a snippet.

**A section with a `{% schema %}` is editable and hardcoded markup is not.** Anything the
merchant plausibly changes — heading, image, link, colour — is a setting with a default;
content they repeat is `blocks`, looped over `section.blocks` and carrying
`{{ block.shopify_attributes }}` so the editor can select and drag it. Ship the brief's
copy as schema defaults; a literal in the markup becomes a support ticket.

**Snippets are reused markup, blocks are repeated content.** A product card on four
templates is `{% render 'product-card', product: product %}`; three value props inside
one section are blocks. Backwards gives markup nobody can edit, or twelve near-identical
settings. Use `render`; `include` leaks scope.

**`templates/*.json` lists sections, `templates/*.liquid` is markup you own.** The JSON
form stores order and settings per theme and is edited in the customiser, so it is the
default. A `.liquid` template quietly removes that page from the editor: reach for one
only when sections cannot express it, and say why in the plan.

**HARD RULE: never hardcode into `layout/theme.liquid` when a section, block, snippet or
theme app extension is the right mechanism.** `theme.liquid` is only for what is truly
global: the document shell, `{{ content_for_header }}`, `{{ content_for_layout }}`, one
stylesheet link. A hero, banner or one-page script put there renders on every route and
cannot be switched off.

**Functionality a merchant installs is a theme app extension, not theme code.** App
blocks and embeds live in the app and survive a theme update; the same logic in the theme
dies with it.

**Tokens live in `config/settings_schema.json`.** Declare colour and type there, emit them
once as custom properties in the layout, and reference only those after. A hex literal in
a stylesheet is a value the merchant sees in the editor and cannot change.

**Work in a duplicate, and add assets rather than edit them.** A file you add to `assets/`
is yours and resolves through `{{ 'name.css' | asset_url }}`; an edit inside the theme's
own asset is gone at its update. Duplicate the live theme and build there; publishing is
the merchant's, never a build step.

**Verify needs a URL, because nothing renders locally.** Liquid only resolves against a
store, so run `shopify theme dev` (port 9292) against the duplicate, or the unpublished
theme's preview link, and pass that origin to `scripts/verify.mjs`. Never at the published
storefront.
