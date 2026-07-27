# The design-system contract

> Original work, MIT. Open at step 5, before any page exists. Every page is checked against
> it afterwards.
>
> **Derived from the brief, not from this file.** The example below shows the shape. A
> contract that reuses its values has skipped the only step that mattered.

---

## Contents

- [Why this file exists](#why-this-file-exists)
- [The contract](#the-contract)
- [1. Tokens — the machine-readable half](#1-tokens--the-machine-readable-half)
- [2. Components — the contract the tokens cannot carry](#2-components--the-contract-the-tokens-cannot-carry)
- [3. Voice — what the tokens say nothing about](#3-voice--what-the-tokens-say-nothing-about)
- [4. Page inventory](#4-page-inventory)
- [Deriving the scales](#deriving-the-scales)
- [Checking a page against the contract](#checking-a-page-against-the-contract)
- [Worked example](#worked-example)

---

## Why this file exists

Measured across the nine benchmark builds, the gallery and the control: **not one page has
a spacing scale, and not one has a type scale.** Every gap and every font size was chosen
where it was used. The control — written to be bad — is no worse on either count.

That is not a discipline problem. It is a missing artifact. `SKILL.md` step 5 asks for
"type scale, spacing step, grid, radius scale, elevation scale… written as tokens, not as
values scattered through components", and until this file there was nothing that held them
and nothing that checked them.

One page can survive without a system. A site cannot: there is nothing for page two to be
consistent *with*.

## The contract

Write `DESIGN-SYSTEM.md` at the project root **before the first page**. It has five parts.
Parts 1, 4 and 5 are checked mechanically. Parts 2 and 3 are checked by reading.

A page uses values the contract declares, **or a one-off the contract documents**. Anything
else is drift.

### On one-offs

A token set is a vocabulary, not a cage. Real compositions need values a nine-step ramp does
not carry: an optical offset that makes a mark sit right, a hero measure that belongs to one
headline, a hairline that is 1.5px because the rule reads wrong at 1 and heavy at 2.

Those are decisions. Record them in part 5 with the reason, and the checker accepts them.

What is not a one-off is the twenty-seventh spacing value on a page, arrived at by nudging.
The test is whether you can write the reason in a clause. If the reason is "it looked
better", the ramp is the answer; if the reason is "the counter of the mark is 3px low at this
size", it is a one-off and belongs in the record.

**Consistency is not the same as quality.** A site where every value came from the ramp and
nothing was composed is consistent and dead. The contract exists so composition is
deliberate, not so composition stops.

---

## 1. Tokens — the machine-readable half

One fenced `css` block, labelled `contract`. This block is copied verbatim into the page or
the stylesheet; it is not a description of the tokens, it **is** the tokens.

````markdown
```css contract
:root{
  /* spacing — one step, everything derived. See "Deriving the scales". */
  --step:8px;
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px;
  --space-5:24px; --space-6:32px; --space-7:48px; --space-8:64px; --space-9:96px;

  /* type — named roles, not sizes. A role may be reused; a size may not be invented. */
  --text-micro:0.75rem; --text-small:0.875rem; --text-body:1rem;
  --text-lead:1.125rem; --text-h3:1.25rem; --text-h2:1.5rem;
  --text-h1:2.25rem; --text-display:3.5rem;
  --leading-tight:1.15; --leading-body:1.55;
  --measure:66ch;

  /* shape — a scale with a stated relationship, not one value everywhere */
  --radius-inner:4px;   /* inputs, chips, things inside a container */
  --radius-outer:10px;  /* panels, cards, the containers themselves */
  --radius-full:999px;  /* only where the shape is the meaning: avatars, dots */

  /* elevation — each level must say what it means */
  --elev-0:none;                              /* flat on the page */
  --elev-1:0 1px 2px rgb(0 0 0 / .06);        /* raised, still attached */
  --elev-2:0 8px 24px rgb(0 0 0 / .10);       /* floating over content */

  /* container and grid */
  --container:1180px; --gutter:clamp(16px,4vw,32px); --grid-columns:12;

  /* colour — every colour the project may use, and no others */
  --bg:#…; --surface:#…; --surface-2:#…; --line:#…;
  --ink:#…; --ink-2:#…;              /* --ink-2 must clear AA on --surface-2 */
  --accent:#…; --on-accent:#…;       /* --on-accent flips with the scheme */
  --ok:#…; --warn:#…; --bad:#…;

  /* type families */
  --font-display:…; --font-body:…; --font-mono:…;

  /* motion budget */
  --motion-fast:120ms; --motion-base:200ms; --motion-slow:320ms;
  --ease:cubic-bezier(.2,.6,.2,1);
}
@media (prefers-color-scheme:dark){
  :root{ /* every colour token that changes, and nothing else */ }
}
```
````

**Required groups.** A contract missing any of these is incomplete: spacing, type, shape,
elevation, container, colour, families, motion. A project that genuinely needs no elevation
declares `--elev-1:none` and says why in part 2 — it does not omit the group.

**`--on-accent` is not optional.** An accent that is light in dark mode and dark in light
mode cannot carry one fixed label colour. This is the single most common contrast failure
in this repository's own history.

## 2. Components — the contract the tokens cannot carry

Prose, but specific. Each heading below is required.

**Buttons.** For each variant (primary, secondary, quiet, destructive): which tokens it
uses, and what happens at rest, hover, `:focus-visible`, active, disabled and loading. Six
states, named. "Standard hover" is not an answer.

**Form controls.** Input, select, checkbox, radio, textarea: border, background, height,
the label position, the hint position, the error position, and the focus treatment. One
focus treatment for the whole project, so it is learned once.

**Header and footer.** What is in them, at every width, on every page. This is the contract
that makes a site feel like one site. State the height, whether it is sticky, what collapses
below which width, and which item is marked current.

**Elevation and layering.** What each `--elev-*` level means and which components may use
it. A z-index order for anything that overlaps.

**Density.** Which page kinds are dense and which are not, expressed as which spacing tokens
are in play. A dashboard using `--space-2` and `--space-3` and a marketing page using
`--space-6` and `--space-7` is one system, not two.

## 3. Voice — what the tokens say nothing about

**Image treatment.** Photography or illustration or neither; crop, aspect ratios, treatment
(duotone, full-bleed, inset), and what stands in when an asset is missing. A labelled
placeholder is an acceptable answer; an unlabelled grey box is not.

**Copy register.** Sentence case or title case. Person and tense. How numbers, dates,
currency and units are written. What the product calls its user. Three example strings a
writer can pattern-match: one heading, one button, one error.

**Iconography.** Which set, which weight, which size. Whether a brand mark exists and
whether it is the only authored SVG.

**Motion.** What is allowed to move and why. Which of the three motion tokens applies to
which interaction. Whether anything animates on scroll at all.

## 4. Page inventory

A table: every page in the project, its purpose, its primary action, and the blocks it
uses. This is what makes cross-page consistency checkable — two pages claiming the same
block must render it the same way.

| Page | Purpose | Primary action | Blocks |
| --- | --- | --- | --- |
| `/` | … | … | header, hero-split, proof-row, footer |

---

## Deriving the scales

The parts of a design system that are arithmetic should be arithmetic. Taste goes into the
accent, the families and the density — not into whether the seventh spacing value is 44 or
48.

**Spacing.** Pick one step (4px for dense product UI, 8px for most things). The ramp is
`0.5, 1, 1.5, 2, 3, 4, 6, 8, 12 × step`. Nine values is enough for any page; if a tenth is
needed, the layout is arguing with the grid.

**Type.** Pick a base (16px for body text, 14px for dense product UI) and a ratio: 1.2
(dense, utilitarian), 1.25 (default), 1.333 (editorial), 1.5 (display-led, few sizes). Round
to the nearest 0.0625rem. Eight roles is enough. **Do not add a size; reuse a role.**

**Radius.** Two values plus optionally `full`. Inner is smaller than outer, because a
control inside a panel that shares the panel's radius reads as a mistake. A project may
legitimately choose `0` for both — that is a system, and "everything is 8px" is not.

**Elevation.** Two levels plus flat. A third is almost always a z-index problem wearing a
shadow.

---

## 5. One-off values

A table. Empty is a legitimate state for a small site; long is a sign the ramp is wrong.

| Value | Where | Why it is not a token |
| --- | --- | --- |
| `1.5px` | the rule under the masthead | 1px disappears against the ground, 2px reads as a border |
| `-3px` | the brand mark's optical offset | the counter sits low at 26px and only at 26px |

The checker reads this table and accepts what it lists. Anything else on the page that is
not a token fails.

## Checking a page against the contract

```bash
node scripts/token-drift.mjs "<pages>" --contract DESIGN-SYSTEM.md
```

The gate reports, per page:

- **undeclared** — a colour, length, radius or shadow literal that is neither a token nor a
  documented one-off. Every one of these is a decision made at the call site and forgotten.
- **missing** — a required token group the contract does not declare.
- **unused** — tokens the project declares and no page uses. Not a failure; a prompt to
  delete them.

A page passes when it introduces no undeclared value. Utility values are exempt and listed
in the tool: `0`, `1px` hairlines, `50%`, `100%`, `auto`, and anything inside a
`@supports`/`@media` feature test. Values listed in part 5 are accepted with their reason.

---

## Worked example

`benchmarks/09-data-entry/` uses sixteen distinct spacing values and six radii, none of them
behind a token. Under a contract with `--step:4px` its real vocabulary is five spacing
values and two radii. The other nineteen values are not design decisions; they are the
absence of one.

Write the contract first and that page cannot be built loosely — there is nothing to be
loose with.
