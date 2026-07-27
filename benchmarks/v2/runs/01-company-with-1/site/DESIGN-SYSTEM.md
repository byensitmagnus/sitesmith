# Kestrel Survey — design system

Items 7–13 of the sitesmith definition of done. Derived from `BRIEF.md`, not from an example.
Part 1 is copied verbatim into the top of `styles.css`; it is the tokens, not a description of
them.

---

## 1. Tokens

```css contract
:root{
  /* spacing — one step, 8px. Ramp: 0.5 1 1.5 2 3 4 6 8 12 × step. */
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px;
  --space-5:24px; --space-6:32px; --space-7:48px; --space-8:64px; --space-9:96px;

  /* type — base 17px, ratio 1.333. Roles, not sizes: reuse a role, never invent a size. */
  --text-micro:0.8125rem; --text-small:0.9375rem; --text-body:1.0625rem;
  --text-lead:1.25rem; --text-h3:1.4375rem; --text-h2:1.875rem;
  --text-h1:2.5rem; --text-display:clamp(2.5rem,6.4vw,3.375rem);
  --leading-tight:1.08; --leading-body:1.62;
  --measure:64ch;

  /* shape — square, because the identity is a ruled page and not a card. */
  --radius-inner:0; --radius-outer:0;

  /* elevation — none. Surfaces separate by rule and paper tone; see part 2. */
  --elev-0:none; --elev-1:none;

  /* container */
  --container:1120px; --gutter:clamp(20px,5vw,40px);

  /* colour — warm paper and ink, one accent. */
  --bg:#f6f2ea; --surface:#fffdf8; --surface-2:#ece5d8; --line:#d5ccbb;
  --ink:#17150f; --ink-2:#4a443a; --ink-3:#665c4c;
  --accent:#9a2e15; --on-accent:#fff6ef;

  /* families */
  --font-display:"Iowan Old Style","Palatino Linotype",Palatino,"Book Antiqua",Georgia,"Times New Roman",serif;
  --font-body:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  --font-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;

  /* motion */
  --motion-fast:120ms; --motion-base:200ms;
  --ease:cubic-bezier(.2,.6,.2,1);
}
@media (prefers-color-scheme:dark){
  :root{
    --bg:#131211; --surface:#1a1817; --surface-2:#232019; --line:#38322a;
    --ink:#f3eee5; --ink-2:#c8c0b3; --ink-3:#9c9384;
    --accent:#e8836a; --on-accent:#2a0e05;
  }
}
```

**Derivation.** Spacing from one 8px step. Type from 17px at 1.333, rounded to the nearest
pixel — an editorial ratio, because this site has few sizes and uses them hard. Eight roles;
`--text-display` appears on the home page and nowhere else.

**Contrast, measured in both schemes** (lowest pairing in each column):

| | on `--bg` | on `--surface` | on `--surface-2` |
| --- | --- | --- | --- |
| `--ink` light / dark | 16.4 / 16.2 | 18.0 / 15.3 | 14.6 / 14.1 |
| `--ink-2` light / dark | 8.6 / 10.4 | 9.5 / 9.8 | 7.7 / 9.0 |
| `--ink-3` light / dark | 5.9 / 6.2 | 6.5 / 5.8 | 5.2 / 5.4 |
| `--accent` light / dark | 6.8 / 7.0 | 7.4 / 6.6 | 6.0 / 6.1 |

`--on-accent` on `--accent` is 7.1 light, 6.8 dark. Every pairing clears AA for body text, so
no role is restricted to large sizes. `--on-accent` flips with the scheme: near-white on the
oxide red in light, near-black on the lighter clay in dark.

**Dark mode is designed, not inverted.** The light scheme is warm paper with black-brown ink.
The dark scheme is not its negative: the ground is a warm near-black, surfaces step *up* in
lightness, and the accent lightens to a clay so it stays legible without glowing.

## 2. Components

**Buttons.** Two variants, both square, both `--text-small`, weight 650, padding
`--space-3 --space-5`, no shadow in any state.

| State | Primary | Quiet |
| --- | --- | --- |
| rest | `--accent` ground, `--on-accent` label, 1px accent border | transparent ground, `--ink` label, 1px `--line` border |
| hover | ground lightens via a 10% white overlay; label unchanged | border becomes `--ink-3`, ground `--surface-2` |
| `:focus-visible` | 2px `--accent` outline, 2px offset — the one focus treatment | same |
| active | translates down 1px, no colour change | same |
| disabled | `--surface-2` ground, `--ink-3` label, `cursor:not-allowed`, and the reason is written next to it | same |
| loading | label replaced by "Working…", `aria-busy="true"`, pointer events off | same |

The current pages contain no disabled or loading control, because they contain no form. Both
states are defined in `styles.css` so that the first one added inherits them rather than
inventing them.

**Form controls.** None on the site, by decision — see `BRIEF.md` item 1. If one is added:
label above the field, hint below the label, error below the field wired with
`aria-describedby`, 1px `--line` border, `--surface` ground, `--radius-inner`, and the same
2px accent focus outline as everything else. Never a placeholder in place of a label.

**Masthead.** On every page, at every width. Sticky, `--surface` ground, 1px `--line` rule
under it, `box-shadow:var(--elev-1)` — which is `none`, and is written that way so a later
scrolled state has somewhere to go. One row, 75px measured at 1440: the wordmark with its 3px
accent underline sits left, five destinations right, the one action last. Below 1120px the
destinations collapse into a keyboard-operable disclosure and **the action stays outside it**
— a phone header that hides the only action behind a menu has hidden the point of the site.
It also stops being sticky there: two rows is 128px, which is a sixth of a phone screen to
give up permanently, and the action is repeated in the band at the foot of every page.
The current page is marked with `aria-current="page"` and an accent underline (a left bar in
the collapsed menu, where there is no room for an underline to read).

The wordmark carries no strapline. It was measured with one: at 1440 the five destinations,
the action and a 284px mark exactly fill the 1040px of available width, which collapses under
any wider font. "Chartered building surveyors" belongs to the home page's first line and to
the footer, both of which have room for it.

**Call-to-action band.** The last thing on every page except contact, which is itself the
call. Reversed — `--ink` ground, `--bg` text — and the only dark block on a light page. It
exists because an editorial page of warm paper has no natural anchor at the bottom, and
because the one action deserves the one moment of contrast. Inside it the primary button
inverts too (`--bg` ground, `--ink` label, 16:1) and the focus ring switches to `--bg` so it
stays visible on the dark ground. In the dark scheme the band inverts with everything else and
becomes the one light block.

**Footer.** On every page. Three columns at 1440, stacked below 720px: the practice and its
facts, the four site destinations, the contact details. Below them a legal line carrying the
copyright and the standing note that the contact details are placeholders. The footer is for
orientation and for the two details a reader may have come back to find.

**Elevation and layering.** Two levels, both `none`. Nothing on this site floats: surfaces are
told apart by paper tone (`--surface` above `--bg`) and by a 1px rule. The only stacked layer
is the sticky masthead at `z-index:20`, and the collapsed menu sits inside it, not over it.
A drop shadow on a page whose whole argument is "this is a document" would be the first thing
that reads as a website pretending to be one.

**Density.** Spacious throughout: section rhythm from `--space-8` and `--space-9`, block
rhythm from `--space-5` and `--space-6`, inline from `--space-2` and `--space-3`. There is no
dense page in this project; if an admin view is ever added it uses the same ramp from the
other end rather than a second system.

## 3. Voice

**The signature, in one line.** *A surveyed page: every section carries a mono reference
number in a left-hand rail, every division is a hairline rule rather than a card, and every
image is a numbered plate with a caption.* It is on all eight pages, it is what a reader would
recognise with the wordmark removed, and it comes from the only object this practice actually
sells — a report with numbered sections and numbered plates. Nothing on the site is rounded,
nothing casts a shadow, and the one dark block on each page is the one action.

**Image treatment.** Photographs of buildings the practice has surveyed — never people, never
stock. Every image is presented as a **plate**: 3:2, full-bleed inside a 1px rule, with a mono
caption beneath giving the plate number and the subject. Until the files arrive each plate is
an explicitly labelled slot naming the building type, the view and the crop, on `--surface-2`.
A labelled slot is an honest answer; an unlabelled grey rectangle is not.

**Copy register.** British English, sentence case, first person plural, present tense. Say
what the work is before saying why it is good. Numbers as digits ("four chartered surveyors"
is the exception — small counts of people read as words). No exclamation marks, no
superlatives, no "solutions", no "passionate".

Three strings to pattern-match:

- Heading: *"When nobody agrees whose fault it is"*
- Button: *"Talk to a surveyor"*
- Note: *"Tell us the building type and the deadline. We will call you back."*

**Iconography.** None. There is no icon set on this site and no decorative SVG. The only
authored mark is the wordmark, which is type. Numbers, rules and captions do the work icons
would have done badly.

**Motion.** One entrance: the home page's headline, lede and action rise 8px and fade in over
`--motion-base`, staggered by two steps, once, on load. Everything else is state feedback on
hover and focus at `--motion-fast`. Nothing animates on scroll, nothing moves after the page
has settled, and `prefers-reduced-motion: reduce` removes all of it.

## 4. Page inventory

The table in `BRIEF.md` item 5 is the inventory. Two blocks are shared by every page — the
masthead and the footer — and are byte-identical across all eight files apart from the
`aria-current` attribute and the page's own `<title>`, description and Open Graph tags.

## 5. One-off values

| Value | Where | Why it is not a token |
| --- | --- | --- |
| `3px` | inset rule under the masthead wordmark, and the accent bar left of a pull quote | the double rule needs a weight between the 1px hairline and the 8px step; at 2px it reads as a border, at 8px as a block |

Everything else on every page is a token or a utility value (`0`, `1px`, `2px`, `auto`,
`100%`).

## 6. Responsive behaviour

| | 375 | 768 | 1440 |
| --- | --- | --- | --- |
| Masthead | wordmark + burger + action, two rows, not sticky; menu opens as a ruled column | same as 375 | one row, five destinations inline, 75px, sticky |
| Home hero | single column; display type at its `clamp()` floor | single column, wider measure | single column, display at ceiling, lede held to `--measure` |
| Sections | stacked; the mono section number sits above its heading | stacked | two columns — number and heading in a 12rem rail, prose right |
| Plates | one per row | two per row | two per row, or four across on `buildings` |
| Footer | one column | two columns | three columns |

The breakpoints are 720px (footer goes to two columns), 1000px (the section rail appears, and
the contact and call-to-action blocks go side by side) and 1120px (the navigation stops
collapsing). Each was set where a specific layout stops working, measured — the last one
because the five destinations plus the action need 1040px of container and only have it at
1120px, and still fit when a wider font is substituted for the whole page.
