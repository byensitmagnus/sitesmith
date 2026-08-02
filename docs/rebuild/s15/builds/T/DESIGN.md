---
name: Klinke & Datter
description: A trade parts catalogue rendered as a website for a two-person player-piano workshop.
colors:
  catalogue-green: "#0e4636"
  catalogue-green-deep: "#0a3428"
  card-stock: "#e6e6e0"
  card-stock-light: "#f1f1ec"
  press-ink: "#15181a"
  press-ink-soft: "#4a4f4d"
  tab-yolk: "#e8b304"
  tab-yolk-lift: "#f5c522"
  rule-stock: "#b4b6ac"
  rule-green: "#3d6d5c"
  tint-on-green: "#a9c5b9"
  tint-on-green-strong: "#d3e0d9"
typography:
  display:
    fontFamily: "Archivo, 'Archivo Narrow', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(2.9rem, 12.6vw, 5.6rem)"
    fontVariation: "'wdth' 66, 'wght' 850"
    lineHeight: 0.94
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Archivo, 'Archivo Narrow', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.55rem, 4.2vw, 2.7rem)"
    fontVariation: "'wdth' 78, 'wght' 800"
    lineHeight: 0.94
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Archivo, 'Archivo Narrow', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.02rem, 2.3vw, 1.2rem)"
    fontVariation: "'wdth' 78, 'wght' 800"
    lineHeight: 0.94
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo, 'Archivo Narrow', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1rem, 0.96rem + 0.2vw, 1.075rem)"
    fontVariation: "'wdth' 100, 'wght' 420"
    lineHeight: 1.62
  label:
    fontFamily: "'Azeret Mono', ui-monospace, 'Courier New', monospace"
    fontSize: "0.71rem"
    fontWeight: 500
    letterSpacing: "0.05em"
    fontFeature: "'tnum' 1"
rounded:
  none: "0"
  marker: "50%"
spacing:
  row: "0.6rem"
  block: "1.15rem"
  section: "clamp(2.5rem, 5.6vw, 4.6rem)"
  gutter: "clamp(1.15rem, 4.4vw, 4rem)"
components:
  plate-primary:
    backgroundColor: "{colors.tab-yolk}"
    textColor: "{colors.press-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.7rem 1.05rem"
  plate-primary-hover:
    backgroundColor: "{colors.tab-yolk-lift}"
  plate-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.card-stock}"
    rounded: "{rounded.none}"
    padding: "0.7rem 1.05rem"
  plate-ghost-hover:
    backgroundColor: "{colors.card-stock}"
    textColor: "{colors.catalogue-green}"
  plate-ink:
    backgroundColor: "{colors.press-ink}"
    textColor: "{colors.tab-yolk}"
    rounded: "{rounded.none}"
    padding: "0.7rem 1.05rem"
  tab:
    backgroundColor: "transparent"
    textColor: "{colors.card-stock}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: "46px"
  tab-active:
    backgroundColor: "{colors.tab-yolk}"
    textColor: "{colors.press-ink}"
  section-number:
    backgroundColor: "transparent"
    textColor: "{colors.press-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.3rem 0.55rem"
---

# Design System: Klinke & Datter

## Overview

**Creative North Star: "The Spares Catalogue"**

The system is a mid-century trade parts catalogue that happens to be a web page. Not a
workshop's brochure and not an artisan's portfolio: the printed book a supplier sends to
people who need a specific part and need to know what it costs. That governs everything.
Content arrives as numbered sections with thumb tabs, entries sit in ruled rows with a code
in the margin, prices print on a second-colour plate, and the back page is the order page.

Density is high and unapologetic. Ink is flat: no gradient, no shadow, no radius, no
imitation of paper grain or letterpress bite. Depth comes only from tonal layering — a green
field, a stock field, a yolk plate — and from 1px and 2px rules. The page is printed, not
rendered, and printing has no z-axis.

The confirmed anti-reference is the warm-cream, serif-display, sepia-photo craft-workshop
landing page and its mirror image, the stark all-caps luxury atelier. Neither is allowed
back in through a side door.

**Key Characteristics:**
- Numbered sections that are navigation, not decoration
- Flat spot colour at page scale, never as an accent sprinkle
- Ruled rows instead of cards
- Keyline part drawings as the only illustration
- Tabular mono reserved for codes, prices, times and phone numbers

## Colors

Two flat spot inks printed on tinted card stock, in the register of a trade catalogue rather
than a brand palette.

### Primary
- **Catalogue Green** (`#0e4636`): the flood colour. It owns whole regions — the cover, the
  offer section, the roll section, the order page — never an outline or a small accent. Body
  text on it is card stock; secondary text is a green-derived tint, never grey.
- **Deep Catalogue Green** (`#0a3428`): the rail's underline and the colophon band. Used only
  where green must sit on green and still separate.

### Secondary
- **Tab Yolk** (`#e8b304`): the second ink. It marks exactly three things — the contents tab,
  a price plate, and the active or primary action. Black sets on it; it never carries small
  text on a light ground.

### Neutral
- **Card Stock** (`#e6e6e0`): the paper. The default page ground and the text colour on green.
- **Light Sheet** (`#f1f1ec`): the inset sheet, used only for a row's hover state.
- **Press Ink** (`#15181a`): body and display text on stock. Slightly cool, never pure black.
- **Soft Press Ink** (`#4a4f4d`): entry descriptions and margin codes on stock. Measured at
  6.66:1 on card stock.
- **Stock Rule** (`#b4b6ac`) and **Green Rule** (`#3d6d5c`): the 1px separators on each ground.
- **Green Tint** (`#a9c5b9`) and **Strong Green Tint** (`#d3e0d9`): secondary text on green,
  at 5.84:1 and 7.92:1.

### Named Rules
**The Second Ink Rule.** Yolk is a second printing plate, not a highlight. It appears on the
contents tab, price plates, and the active action — nowhere else. If a fourth use appears,
one of the four is wrong.

**The Tint-Follows-Ground Rule.** Secondary text is tinted from its own ground's hue: green
tints on green, soft press ink on stock. A tint used across grounds is the defect that
shipped once already — a green tint on card stock measured below 2:1.

**The Flood Rule.** Green is committed at page scale, carrying roughly 40% of the document as
whole sections. A page where green survives only as borders and icons has lost the world.

## Typography

**Display Font:** Archivo (variable, `wdth` 62–125, `wght` 400–900), with Archivo Narrow,
Helvetica Neue and Arial as fallbacks.
**Body Font:** Archivo at normal width.
**Label/Mono Font:** Azeret Mono, with ui-monospace and Courier New as fallbacks.

**Character:** One industrial grotesque doing three jobs by width axis alone — compressed and
heavy for catalogue headings, normal for reading, and a square mono alongside it for
everything that is a number. The catalogue discipline is that the family never changes; only
the width and weight do.

### Hierarchy
- **Display** (`wdth` 66 / `wght` 850, clamp 2.9–5.6rem, 0.94): the wordmark on the cover,
  set in nowrap lines so it always breaks as "Klinke" / "& Datter".
- **Headline** (`wdth` 78 / `wght` 800, clamp 1.55–2.7rem, 0.94, uppercase): section titles.
- **Title** (`wdth` 78 / `wght` 800, clamp 1.02–1.2rem, uppercase): entry names inside a
  ruled row.
- **Body** (`wdth` 100 / `wght` 420, clamp 1–1.075rem, 1.62): running text, held to roughly
  64ch; entry descriptions cap at 40ch so a two-column spread does not force a re-read.
- **Label** (Azeret Mono 500–700, 0.68–0.9rem, `tnum` on, uppercase for keys): part codes,
  spec keys, durations, prices, phone numbers, opening hours.

### Named Rules
**The Numbers Are Mono Rule.** Anything a reader would copy down — a price, a code, a phone
number, a time, a count — is set in the mono face with tabular figures. Anything they would
read aloud is set in the grotesque. Mono never used to make prose look technical.

**The Width-Axis Rule.** Emphasis comes from the `wdth` axis before it comes from size.
Compression is the catalogue's voice; a heading that reads timid is under-compressed, not
too small.

## Layout

A single centred measure of 1360px with a fluid gutter (`clamp(1.15rem, 4.4vw, 4rem)`).
Sections are separated by a 2px ink rule and stacked in a fixed numbered order; each carries
`scroll-margin-top` equal to the sticky rail so an anchor never lands under it.

The cover is a three-track grid at ≥960px — wordmark column, drawing plate, contents tab —
with `align-items: stretch` so all three columns terminate on the same line; below that it
stacks in reading order (wordmark, promise, actions, specification block). Content sections
use a two-track split of running text plus a data panel at ≥940px. The fault list is a single
ruled column that becomes two at ≥1000px.

Vertical rhythm: `clamp(2.5rem, 5.6vw, 4.6rem)` above a section and slightly more below it,
0.6rem inside a ruled row, and more space above a heading than below it throughout. Rows are
tight; sections are generous. Breakpoints in use: 660, 768, 820, 860, 940, 1000, 1120, 960.

## Elevation & Depth

There are no shadows anywhere in this system, and none may be added. Depth is entirely tonal
and linear: a flooded field sits "above" the stock ground, a plate sits above the field, and
rules divide within a field. Elevation is declared exactly once per element — a 2px keyline
*or* a filled ground, never both plus a shadow.

### Named Rules
**The Printed Surface Rule.** If an effect could not survive a two-colour printing press —
shadow, blur, glass, gradient, glow — it does not exist here. A raised look is achieved by
changing the ground colour, not by lifting the box.

## Shapes

Zero radius on every rectangle: plates, tabs, panels, rows, section markers. The single
exception is the numbered callout marker on a drawing, which is a true circle (`50%`) because
that is what a parts drawing uses.

Borders are 2px for a structural edge (section rule, plate keyline, panel) and 1px for a
separator inside a field (row divider, contents list). Nothing is clipped, masked or
rotated. The recurring silhouette is the ruled rectangle, and the recurring texture — the
only one — is the perforated roll edge, a repeating two-row radial-gradient hole field used
as a horizontal divider.

## Components

### Plates (buttons)
- **Shape:** hard rectangle (0 radius), 2px keyline in its own colour, `0.7rem 1.05rem`.
- **Primary:** yolk ground, press-ink text, mono 700. An optional second line carries an
  uppercase mono subtitle at 0.72rem.
- **Ghost:** transparent with a card-stock keyline, for the secondary action on a green
  ground; inverts to stock ground with green text on hover.
- **Ink:** press-ink ground with yolk text, used when a plate must sit *on* yolk.
- **Hover / Focus:** background lifts to `#f5c522` over 0.3s on `cubic-bezier(.16,.84,.28,1)`;
  focus-visible draws a 3px yolk outline at 3px offset, switching to ink on yolk grounds.

### Thumb-tab rail (navigation)
- Sticky, full-bleed green, 46px rising to 54px at ≥768px, with a 2px deep-green underline.
- Each tab is a mono number with an uppercase grotesque name that appears at ≥660px; the
  house name appears at the left end at ≥1120px; the phone plate is pinned to the right end
  and never collapses.
- **Active:** driven by `:has()` and `:target` in CSS alone — jumping to a section prints
  both its tab and its section-number marker in yolk. No script is involved.

### Ruled rows (the card replacement)
- **Corner style:** none; rows are separated by a 1px rule and have no container.
- **Background:** transparent, lifting to the light sheet on hover.
- **Internal padding:** `clamp(0.9rem, 2vw, 1.25rem)` vertical, no horizontal inset.
- Rows never nest and never acquire a border-left accent.

### Data panels
Flat green or stock fields with a 2px keyline, holding a mono key, a large value, and an
optional plate. Two variants exist: the price plate (yolk) and the measurement panel (green
with a yolk-filled scale bar).

### Keyline part drawings
The system's only illustration. Authored SVG, flat orthographic, no perspective, no shading,
no figures: strictly constructible geometry. One stroke weight per drawing (2.4 on stock,
2–3 on green), press ink on stock and card stock on green, with a single yolk mark per
drawing indicating the fault or the callout. Callouts are numbered circles with a legend
beneath, never labels floating at the frame edge.

## Do's and Don'ts

### Do:
- **Do** flood green at whole-section scale, so it carries roughly 40% of the document.
- **Do** set every price, code, count, duration and phone number in Azeret Mono with `tnum`.
- **Do** tint secondary text from its own ground — `#a9c5b9` on green, `#4a4f4d` on stock.
- **Do** separate content with 1px rules inside a field and 2px rules between fields.
- **Do** draw new icons as flat orthographic keylines at one stroke weight, with numbered
  callouts and a legend.
- **Do** keep the primary action and the phone number inside the first viewport at 375, 768
  and 1440.

### Don't:
- **Don't** add a shadow, gradient, blur, glass or radius anywhere. The system has none.
- **Don't** put a card around a list item; ruled rows are the container.
- **Don't** use yolk for a fourth purpose beyond contents tab, price plate and active action.
- **Don't** carry a tint across grounds; that is the exact defect this build shipped and fixed.
- **Don't** set body copy in the mono face to signal "technical".
- **Don't** introduce a second type family; the width axis is the variety.
