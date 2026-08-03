# DESIGN-SYSTEM — Klinke & Datter

> Derived from `DIRECTION.md` (comp A, Rullen), which was derived from `EVIDENCE.md`.
> Written before the page. `(C)` — AI-generated working document.

## 1. Tokens

```css contract
:root{
  color-scheme: light dark;

  /* spacing — one step of 8px, ramp = 0.5 1 1.5 2 3 4 6 8 12 × step */
  --step:8px;
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px;
  --space-5:24px; --space-6:32px; --space-7:48px; --space-8:64px; --space-9:96px;

  /* type — base 17px, ratio 1.25, seven roles. Reuse a role; never invent a size. */
  --text-small:0.9375rem; --text-body:1.0625rem;
  --text-lead:1.25rem; --text-h3:1.375rem; --text-h2:1.75rem; --text-h1:2.5rem;
  --text-display:clamp(2.375rem,5.4vw,4rem);
  --leading-tight:1.06; --leading-snug:1.3; --leading-body:1.6;
  --measure:62ch;

  /* shape — inside is tighter than outside; full only where the shape is the meaning */
  --radius-inner:2px; --radius-outer:5px; --radius-full:999px;
  --stroke:1.6px; --rule-thick:2px;

  /* elevation — nothing on this page floats; the only layer goes into the surface */
  --elev-0:none;
  --elev-1:none;
  --elev-inset:inset 0 2px 5px rgb(35 32 27 / .17);

  /* container and grid */
  --container:1000px; --gutter:clamp(20px,5vw,40px); --grid-columns:12;
  --rail:116px;

  /* the punch geometry — the signature, expressed as numbers */
  --slot-w:12px; --slot-tall:26px; --slot-pitch:44px;

  /* colour — buff paper, warm ink, one felt red */
  --bg:#f2e9d8; --surface:#fbf6ec; --surface-2:#e7dcc5; --line:#b9a67f;
  --ink:#23201b; --ink-2:#5b5449;
  --accent:#9e2a2b; --on-accent:#fdf8ef;
  --void:#2b2721; --slot-mark:#2b2721;

  /* families — two, no monospace */
  --font-display:Fraunces,Georgia,serif;
  --font-body:"IBM Plex Sans",system-ui,sans-serif;

  /* motion budget */
  --motion-fast:120ms; --motion-slow:360ms;
  --ease:cubic-bezier(.2,.6,.2,1);
}
@media (prefers-color-scheme:dark){
  :root{
    --bg:#191710; --surface:#211e16; --surface-2:#2b2719; --line:#4d4635;
    --ink:#ece2cd; --ink-2:#b6ab93;
    --accent:#e2836a; --on-accent:#1a140f;
    --void:#0d0b07; --slot-mark:#b6ab93;
    --elev-inset:inset 0 2px 5px rgb(0 0 0 / .5);
  }
}
```

**Why these values, and not a default set.** The ground is roll paper, so the neutral family is
warm and runs from `#fbf6ec` to `#2b2721` — one family, no cool grey anywhere. The accent is
the red of the felt inside a piano action (`EVIDENCE.md` §4), and it appears three times on the
page: the call button, the marker on the section you have navigated to, and the assessment
price. The radius pair is small because the page's geometry is cut paper, and a punched slot
is the only thing on the page that is `--radius-full`, because there the shape is the meaning.

**Dark mode is designed, not inverted.** In dark the ground becomes the inside of the case
rather than the paper: the roll band stays the lightest surface in the layout, the slots go to
near-black, and the accent lifts from `#9e2a2b` to `#e2836a` because a felt red at AA on paper
is not at AA on `#191710`. `--on-accent` flips with it. `--slot-mark` flips too, and for a
reason worth stating: a punched slot is a hole, and a hole is only visible where the ground
behind it is darker than the paper. On the rail that still holds in dark. On the section
numerals, where the slot sits directly on the page, it does not — so in dark the numeral slot
shows paper (`#b6ab93`) rather than a hole that would be invisible.

## 2. Components

### Visual grammar, copied verbatim from `DIRECTION.md`

- surface: punched paper edges and cut grounds — the instrument works by reading a hole in
  paper, so a cut edge is the separator this subject already owns and no ruled grid is needed
- labels: sentence case serif captions — the reader is a private person meeting five technical
  words for the first time, and a caption in the display face at reading size does not add a
  second voice to teach them in
- figures: functional tabular — three prices and two years are the only numbers on the page and
  the prices are compared, so tabular where the comparison happens and proportional everywhere
  else
- depth: inset — the slots are holes and the drawing is pressed into its ground, so the only
  layering on this page goes into the surface rather than floating above it

Which components enact each: **surface** — `.roll-rail`, `.num` and the disclosure
edges; the only 1px rules on the page are inside the price table, where a table needs them.
**labels** — `.caption`, `figcaption` and the section numerals, all `--font-display` at
`--text-small`, sentence case, no tracking. **figures** — `font-variant-numeric: tabular-nums`
is applied to the price column and nowhere else. **depth** — `--elev-inset` is used by exactly
two things, the drawing plate and the open disclosure, and `--elev-1` is `none` because nothing
on this page floats.

### Buttons

Two variants. Both are `--radius-inner`, both are `--font-body` at `--text-body` weight 500,
both have a minimum height of 48px.

**`.btn-primary`** — the call action. Rest: `--accent` ground, `--on-accent` label. Hover:
ground darkens by an inset ink wash (`--elev-inset`), label unchanged, `--motion-fast`.
`:focus-visible`: 3px `--accent` outline at 3px offset — the same treatment everywhere on the
page. Active: translated down 1px. Disabled: does not occur; the phone number is never
unavailable, so no disabled state is drawn. Loading: does not occur; a `tel:` link hands off to
the operating system and has no pending state. Both absences are deliberate, and `10-core.md`
F8 is satisfied because there is no dead control to explain.

**`.btn-quiet`** — the secondary link in the contact section. Rest: no ground, `--ink` label,
1px `--line` underline offset 4px. Hover: underline thickens to 2px. `:focus-visible`: as
above. Active: label to `--accent`. Disabled and loading: do not occur.

### Form controls

**There are none.** The brief gives a phone number and workshop opening hours and nothing to
submit to; a contact form here would need an address that was invented. If one is added later
it inherits: label above, hint beneath the label at `--text-small` `--ink-2`, error beneath the
field in `--accent` and wired with `aria-describedby`, and the one focus treatment above.

### Disclosures

The five failures are `<details>`. Summary: `--font-display`, `--text-h3`, a numeral in a
punched slot on the left, and a `+` / `−` mark on the right drawn in CSS. Open: the panel takes
`--surface` and `--elev-inset`, so an open item reads as pressed into the page rather than
raised off it. Focus lands on the summary and stays there when it opens; nothing scrolls.
`--motion-fast` on the mark only — the panel itself does not animate, because content that
grows under the pointer is what makes a list of five feel unstable.

### Header and footer

**Header**, on every width: the wordmark on the left, the five section links, and the call
action on the right. Not sticky — the page is short, and a sticky bar over a 116px rail eats
the signature. Height 72px at ≥760px; below that it becomes two rows (mark + call, then the
five links wrapping) and grows to about 128px. The section you have navigated to is marked by
its numeral turning `--accent` and gaining a slot rule, driven by `:target`.

**Footer**: the wordmark again, the address, the opening hours and the phone number. It is the
answer to "I closed the tab and need the number again", and nothing else is in it.

### Elevation and layering

`--elev-0` is the page. `--elev-1` is declared `none` on purpose: there is no floating layer,
no dropdown, no modal and no sticky bar in this design, and declaring a shadow nobody uses is
how the next page acquires cards. `--elev-inset` means *pressed into the paper* and is used by
the drawing plate and the open disclosure. Nothing overlaps, so there is no z-index order
beyond the skip link, which is the only positioned element that leaves the flow.

### Density

One page, marketing, dial `visual-density: 4`. In play: `--space-4` and `--space-5` inside
components, `--space-7` between a heading and its content, `--space-9` between sections at
≥760px and `--space-8` below that. `--space-1` to `--space-3` appear only inside the disclosure
summaries and the table cells.

## 3. Voice

**Image treatment.** No photography exists (`EVIDENCE.md` §7). Everything visual is drawn: two
inline SVGs and no `<img>` at all. One treatment for both — 1.6px ink strokes, no fill except
the punched slots, which are `--void`. The drawing sits in a plate with `--elev-inset` and a
`--radius-outer` corner; the rail has no corner because paper does not.

**Copy register.** Sentence case throughout, including headings. First person plural for the
workshop ("vi kommer hjem til dig"), second person singular for the reader ("du har arvet").
Present tense. Prices as `1.850 kr.` with a full stop as the thousands separator and the unit
spelled `kr.`; durations in words ("fire til ni måneder"); times as `09:00–16:00` with an en
dash; the phone number grouped `66 12 47 09`.

Three strings to pattern-match:

- heading — *De fem fejl, vi oftest støder på*
- button — *Ring 66 12 47 09*
- caption — *Tegningen er skematisk og viser, hvor de fem fejl sidder.*

Forbidden by the brief and absent from the page: customer names, testimonials, review scores,
counts of instruments restored. Forbidden by the evidence pack: løsninger, skræddersyet,
totalrenovering, univers.

**Iconography.** No icon set. The only authored SVG is the roll band and the cross-section, and
the only symbol is the `+` / `−` on a disclosure, drawn in CSS from two rules.

**Motion.** Dial `motion-intensity: 2`. One entrance: the three elements of the first screen
fade and rise 10px over `--motion-slow`, staggered by 80ms, once, on load. Everything else is
state feedback at `--motion-fast`: the button's inset wash, the disclosure mark, the underline.
Nothing animates on scroll. Nothing animates in the disclosure panel. All of it is inside
`@media (prefers-reduced-motion: no-preference)`.

## 4. Page inventory

| Page | Purpose | Primary action | Blocks |
| --- | --- | --- | --- |
| `index.html` | A person who has inherited a player piano learns what Klinke & Datter do, what it costs to find out whether it can be saved, and how to start | Ring 66 12 47 09 | skip-link, roll-rail, masthead, hero-statement, problem, mechanism (plate + five disclosures), people, price-table, contact, footer |

## 5. One-off values

| Value | Where | Why it is not a token |
| --- | --- | --- |
| `-0.015em` / `-0.01em` | tracking on `h1` at 1440 / below 760 | optical tracking belongs to one face at one size; a tracking value on the ramp would be applied to type it was not measured against |
| `0.06em` | tracking on the section numerals and the disclosure numerals | Fraunces sets numerals tight at `--text-small`; optical, at one size only |
| `10px` | the entrance rise distance | a motion amplitude, not a spacing value; putting it on the spacing ramp would tie the size of a gesture to the size of a gap |
| `80ms` / `160ms` | the entrance stagger on the second and third hero group | shorter than `--motion-fast`, because a stagger is an offset between two things and not the duration of either |
| `48px` | minimum height of both button variants | the 44px accessibility floor plus the 4px that keeps the label off the edge; a floor is a requirement, not a step on a ramp |
| `44px` | minimum height of a nav link | the WCAG touch-target floor exactly, quoted as itself so that changing the spacing ramp can never lower it |
| `3px` | the focus outline and its offset | the focus ring is an accessibility requirement measured against the outline it sits on, not a shape token; it must not move when the radius scale does |
| `1.6` | the disclosure summary line-height | between `--leading-snug` and `--leading-body`; the summary is one line of display face at reading size and sits wrong at both |
| `1px` | the translate on `:active` for the primary action | a press is one device pixel by definition |
| `340px` / `380px` / `520px` | the drawing column, the drawing at ≥900px, and the plate below 900px | the drawing has a fixed aspect ratio, so these are the three sizes at which its numerals stay legible; they are measurements of a picture, not layout steps |
| `132px` / `26px` | the roll pattern tile, vertical and horizontal | the tile is the repeat length of the signature; it is derived from `--slot-pitch` × 3 and `--slot-tall`, and is written out because SVG `patternUnits` takes a number, not a custom property |

**Unused tokens**, reported by `token-drift.mjs` and kept on purpose: `--step` (the number the
spacing ramp is derived from, kept so the derivation is legible), `--text-h1` (the role between
`--text-h2` and `--text-display`, unused on this page and reserved for page two),
`--elev-1` (declared `none`, which is the documented decision to have no floating layer) and
`--grid-columns` (declared because the contract requires a grid statement, even though this
page's two-column shell does not need a twelve-column grid).
