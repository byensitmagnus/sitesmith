# Core rules

> Original work, MIT. Sixty rules that hold for every website sitesmith builds, in every
> mode. Anything that changes with context is not here — it is in
> [modes/](modes/README.md), which gives one answer per mode instead of one answer for
> everything.

Sixty is the budget. A rule enters only by displacing one, because a set nobody can hold in
their head is a set nobody applies. Where a rule has a legitimate exception it says so; a
prohibition without its exception is one the first real brief will break, and then they all
look optional.

Mode notes read **M** marketing, **E** e-commerce, **P** product UI.

---

## Contents

- [A. Truth and content](#a-truth-and-content)
- [B. Structure](#b-structure)
- [C. Type](#c-type)
- [D. Colour](#d-colour)
- [E. Space and layout](#e-space-and-layout)
- [F. Components and states](#f-components-and-states)
- [G. Motion](#g-motion)
- [H. Accessibility floor](#h-accessibility-floor)
- [I. Delivery](#i-delivery)

---

## A. Truth and content

**A1.** Every number, price, name, logo and quotation is real, or marked as a sample on the
page it appears on.

**A2.** One primary action per page, and it is the heaviest interactive element that is not
the headline.

**A3.** Copy is written for someone who has never heard of this. The first screen says what
this is, not why it is exciting.

**A4.** Headings describe the section under them. A heading that could sit above any section
is a label, not a heading.

**A5.** A placeholder is labelled as one. An unlabelled grey rectangle claims to be content.

**A6.** Sample data is plausible and specific. Round numbers, sequential IDs and alphabetical
names read as filler even when the design is good.

## B. Structure

**B1.** One `<h1>`, headings in order, no level skipped for size — size comes from the type
scale.

**B2.** Landmarks present: `header`, `nav`, `main`, `footer`. One `main`.

**B3.** Lists are lists, tables are tables, and a table has a caption or an accessible name.

**B4.** Interactive things are `<button>` or `<a>`. A `<div>` with a click handler is not
either.

**B5.** A link goes somewhere. `href="#"` is a placeholder that shipped.

**B6.** Section order follows the argument, not a template. State the order before writing
markup.

**B7.** Page structure is the same across the site: the header, the footer and the shell do
not move between pages.

## C. Type

**C1.** A base size and a ratio, chosen once. Roles, not sizes — reuse a role rather than
inventing a size.

**C2.** Body measure stays under about 75 characters. **P:** dense tables are exempt; a data
cell is not prose.

**C3.** Two families at most, three when a monospace carries data. A third display face needs
a reason in the contract.

**C4.** Line height is set per role: tight for headings, comfortable for body. One global
value serves neither.

**C5.** Numbers that are compared are tabular. A column of figures that shifts under its own
digits is unreadable.

**C6.** The type scale is visible in the page: at least three clearly different levels above
body, or the hierarchy is doing nothing.

**C7.** Long unbroken tokens — URLs, file paths, SKUs — get `overflow-wrap`. They are wider
under someone else's font than under yours.

## D. Colour

**D1.** One accent, used for one meaning. **P:** semantic status colours are a separate group
and do not count against this.

**D2.** `--on-accent` flips with the scheme. A fixed label colour on an accent that changes
is the most common contrast failure there is.

**D3.** Neutrals come from one family. Two greys with different temperatures read as a
mistake.

**D4.** Colour is never the only carrier of meaning. Pair it with text, shape or position.

**D5.** Every colour pairing that appears on screen meets AA in **both** schemes, tested
rather than assumed.

**D6.** Dark mode is designed, not inverted. Surfaces get their own elevation logic.

**D7.** A single controlled theme is legitimate when the environment is controlled — a kiosk,
a console under fixed lighting. State which and why in the contract.

## E. Space and layout

**E1.** One spacing step, and a ramp derived from it. Density is which end of the ramp is in
play, not a second system.

**E2.** Space groups. Related things sit closer to each other than to anything else, and this
is visible without borders.

**E3.** A grid track that can contain something wider than itself is `minmax(0,1fr)`, never
`1fr`.

**E4.** Anything that scrolls sideways scrolls inside its own container, and the document
never does.

**E5.** Vertical rhythm comes from the ramp. A section gap picked by eye is a value the next
page will not know about.

**E6.** Layouts are stated per width, not inherited from a framework default.

**E7.** Full-bleed elements are a deliberate decision recorded in the contract, not a side
effect of a container that was forgotten.

## F. Components and states

**F1.** Six control states exist and are distinguishable: rest, hover, `:focus-visible`,
active, disabled, loading.

**F2.** One focus treatment for the whole project, learned once and recognised everywhere.

**F3.** Page-level empty, error and partial states exist wherever the data can be absent,
wrong or incomplete.

**F4.** An empty state says why it is empty and offers the thing that would fill it.

**F5.** Form fields carry a label, a hint where the answer is not obvious, and an error wired
to the field with `aria-describedby`.

**F6.** A form that can fail on more than one field gets an error summary, first in the
document, linking to each field.

**F7.** A component that appears twice is defined once and listed in the inventory.

**F8.** Disabled controls say why, or are not disabled. A dead button with no explanation is
a dead end.

## G. Motion

**G1.** Every animation is justifiable in one sentence: hierarchy, feedback, state change or
continuity. Decoration is not one of them.

**G2.** Durations come from the motion tokens. Three values are enough.

**G3.** `prefers-reduced-motion` is honoured for everything that moves.

**G4.** Nothing animates while the user is entering data. **P:** this is absolute. **M/E:**
it applies to forms and checkout.

**G5.** Motion never delays the primary action. An entrance that gates a click is a bug.

## H. Accessibility floor

**H1.** The primary task completes from the keyboard alone.

**H2.** Focus order follows reading order, and focus is never trapped.

**H3.** Scrollable regions are focusable and named.

**H4.** Images carry alt text that says what the image contributes; decorative images carry
`alt=""`.

**H5.** Touch targets are at least 44 by 44, with space between them.

**H6.** Text contrast meets AA: 4.5:1 for body, 3:1 for large text and meaningful non-text.

**H7.** A visible label accompanies every input. Placeholder text is not a label.

**H8.** Icon-only controls carry an accessible name.

## I. Delivery

**I1.** Rendered and checked at 375, 768 and 1440, and again under a wider font.

**I2.** Zero console errors and zero failed requests.

**I3.** Images declare dimensions. Layout does not shift as they load.

**I4.** `<title>`, meta description and Open Graph tags are written per page, not templated.

**I5.** The design-system contract exists, is derived from this brief, and every value on the
page is either a token or a documented one-off.

---

## What is deliberately not here

Radius, imagery, hero shape, social proof, density, pricing presentation and the shape of the
argument all change with the mode, and a single global answer to any of them produces the
wrong page two thirds of the time. They live in [modes/](modes/README.md).

The upstream reference set is kept in [`../references/`](../references/README.md) as
documented provenance. It is not read by default, and it does not decide output.
