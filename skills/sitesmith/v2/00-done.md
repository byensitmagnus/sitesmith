# Definition of done

> Original work, MIT. The first file. Read it before the brief, and again before you claim
> the work is finished.

A website is done when it has all fourteen of the things below. Not when the code compiles,
not when the checks pass — the checks are a floor, and a floor is not a building.

This file is positive on purpose. The upstream material sitesmith grew from carries 735
prohibitions against 185 requirements, and an agent reading four bans for every requirement
has one dominant move available: do less. Muted colours, thin rules, wide margins, nothing
risked and nothing made. **Reach for the fourteen. Consult a prohibition only when it is in
tension with something you are reaching for.**

---

## Contents

- [The two artifacts](#the-two-artifacts)
- [Plan: what the site is for](#plan-what-the-site-is-for)
- [System: what the site is made of](#system-what-the-site-is-made-of)
- [Proof: that it holds together](#proof-that-it-holds-together)
- [The done check](#the-done-check)

---

## The two artifacts

Everything below lives in one of two files, written before the first page and updated as the
work changes. Both are markdown; both are read by a human and half-checked by a script.

| File | Carries |
| --- | --- |
| `BRIEF.md` | items 1 to 6 — what the site is for and what goes on it |
| `DESIGN-SYSTEM.md` | items 7 to 13 — what it is made of and how it behaves |

Item 14 is the check that both are true of the built pages.

A one-page site still writes both. They will be short. Writing them is how the second page
becomes cheap instead of becoming a redesign.

---

## Plan: what the site is for

### 1. Business goal and primary action

One sentence naming what the business gets, and one naming what the visitor does. Per page,
exactly one primary action — the thing the page exists to cause. Secondary actions are
allowed and must look secondary.

*"Marchbrook needs pavement licences applied for correctly the first time, because a returned
application costs three weeks. The applicant's action is: upload the insurance schedule and
continue."*

**Not done if:** the page has two things competing to be the primary action, or the primary
action is not the heaviest interactive element on screen.

### 2. Audience and brand direction

Who reads this, what they already believe, and what visual language answers that. One line,
stated before any colour is chosen, naming the page kind, the audience, the language and the
family it belongs to.

*"B2B incident tooling for engineers who distrust marketing pages, in a restrained editorial
language closer to a technical journal than a SaaS site."*

**Not done if:** you cannot say what the page would lose if the accent were a different hue.
That means no direction was chosen and the page is an average of everything the model has
seen.

### 3. Sitemap and information hierarchy

Every page, its parent, and what a visitor is meant to do next from it. Which three things
matter most on the home page, in order. What is one click from the entry point and what is
deliberately two.

**Not done if:** navigation was decided page by page, or a page exists that nothing links to.

### 4. Content and asset plan

For every page: who writes the copy, where the numbers come from, which images exist and
which do not yet. Real content, or content explicitly marked as a sample on the page it
appears on.

Assets get named treatment: photography or illustration or neither, crop, aspect ratios,
and what stands in when an asset is missing. A labelled placeholder is a legitimate answer.
An unlabelled grey rectangle is not.

**Not done if:** any number, price, name, logo or quotation on the site cannot be traced to a
source. A page with three real facts beats one with twelve invented ones, and the invented
ones are exactly what makes work read as machine-made.

### 5. Page inventory

A table: page, purpose, primary action, and the blocks it uses.

| Page | Purpose | Primary action | Blocks |
| --- | --- | --- | --- |
| `/` | … | … | header, hero-split, proof-row, cta-band, footer |

This is the artifact that makes cross-page consistency checkable at all: two pages claiming
the same block must render it the same way.

**Not done if:** the inventory disagrees with what the pages actually contain.

### 6. Definition of done for this project

The generic list is this file. The project adds what is specific to it: which browsers,
which locales, which legal text, which analytics, what "launched" means, and who signs it
off.

**Not done if:** nobody can say what would make this finished, in which case it never will be.

---

## System: what the site is made of

### 7. Design-system contract

A `DESIGN-SYSTEM.md` **generated from the brief**, not from a default. It carries the token
groups in item 8 and the component contracts in items 9 to 11.

Tokens are the vocabulary, not a cage. A composition that genuinely needs a value the ramp
does not carry may use one, **documented in the contract with the reason**. Consistency is
not the same as quality: a site where every value came from a nine-step ramp and nothing was
composed is consistent and dead.

**Not done if:** the contract was copied from an example rather than derived from this brief,
or a one-off value exists that the contract does not mention.

### 8. Typography, spacing, grid, colour, radius, elevation

Named, related and written as tokens.

- **Spacing** — one step, and a ramp derived from it.
- **Type** — a base, a ratio, and roles rather than sizes. Reuse a role; do not invent a size.
- **Grid** — container width, gutter, column count, and what happens between breakpoints.
- **Colour** — a palette, plus semantic colours kept separate from the accent. One accent;
  as many status colours as the product has states to name.
- **Radius** — a scale with a stated relationship, not one value everywhere. What is inside a
  container is tighter than the container.
- **Elevation** — levels that each mean something, or a documented decision to have none.

**Not done if:** a page uses a spacing value, font size, radius or colour that is neither a
token nor a documented one-off.

### 9. Header and footer contract

What is in them, on every page, at every width. Height, sticky or not, what collapses below
which width, which item is marked current, and what the footer is actually for.

**Not done if:** two pages solve the header differently. That drift is what "the site feels
unfinished" usually means when the individual pages are fine.

### 10. Component inventory

Every component the site uses, once, with its variants. A component that appears on three
pages is defined in one place and referenced three times.

**Not done if:** a component was re-solved on a later page, or a variant exists that the
inventory does not list.

### 11. Buttons, forms and every state

Per control: rest, hover, `:focus-visible`, active, disabled, loading. Per page: empty,
error and partial.

One focus treatment for the whole project, so it is learned once. Form fields carry label,
hint and error, and the error is wired to the field. The empty state says why it is empty and
what would fill it.

**Not done if:** you cannot name the six control states for the primary action, or the empty
state is a sentence with no way out of it.

### 12. Responsive behaviour

Stated, not hoped for. What each layout does at 375, 768 and 1440, which elements reorder,
which disappear and why. "It uses flexbox" is not a behaviour.

**Not done if:** the page has not been rendered at all three widths, or it fits only under
the font on the machine that built it.

### 13. A visual signature that is this brand's

The one thing a visitor would recognise on a second page with the logo removed. A ruled
editorial frame, a hi-vis signal colour on black, a particular photographic crop, a heavy
civic underline. Specific to this brand, present on every page, and describable in one line.

This is the item most often missing from technically correct work. A site can pass every
check and be indistinguishable from four hundred others.

**Not done if:** the signature is "clean and modern", which is not a signature.

---

## Proof: that it holds together

### 14. Cross-page consistency

The same header, footer, components and tokens across every page. The page inventory matches
what is built. Nothing drifted.

**Not done if:** the header markup differs between two pages, or two pages use different
values for the same purpose.

---

## The done check

Mechanical, and run before claiming anything:

```bash
node scripts/verify.mjs <url> --out .sitesmith/shots       # widths, axe both schemes, links
node scripts/verify.mjs <url> --font-stress --no-axe       # widths under a wider font
node scripts/token-drift.mjs "<pages>" --contract DESIGN-SYSTEM.md
```

Then by reading, which no script replaces:

1. Squint at the 1440 screenshot. Is something clearly first, and one thing only?
2. Delete every image and panel from the copy. Does the argument still stand?
3. Open page two. Would you know it was the same site with the logo removed?
4. Point at any number. Where did it come from?
5. Tab through the primary task. Does it complete?

**A green check is a floor.** Passing it means nothing is broken; it does not mean anything
was built. Items 2, 4 and 13 are the ones that decide whether the work is good, and no
script has an opinion about any of them.
