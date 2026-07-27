# DESIGN SYSTEM — Kestrel Survey

Items 7 to 13 of `00-done.md`. Derived from `BRIEF.md`, not from an example. The token block
below is copied verbatim into `styles.css`; it is not a description of the tokens, it is the
tokens.

---

## 1. Tokens

```css contract
:root{
  /* spacing — one 8px step, ramp 0.5 1 1.5 2 3 4 6 8 12 */
  --step:8px;
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px;
  --space-5:24px; --space-6:32px; --space-7:48px; --space-8:64px; --space-9:96px;

  /* type — base 17px, ratio 1.333, eight roles. Reuse a role; never invent a size. */
  --text-micro:0.75rem; --text-small:0.875rem; --text-body:1.0625rem;
  --text-h3:1.25rem; --text-lead:1.4375rem; --text-h2:1.875rem;
  --text-h1:2.5rem; --text-display:clamp(2.5rem,1.55rem + 3.6vw,3.375rem);
  --leading-tight:1.08; --leading-snug:1.3; --leading-body:1.6;
  --measure:68ch; --measure-tight:52ch;

  /* shape — square, both levels: the material is a printed report */
  --radius-inner:0; --radius-outer:0;

  /* elevation — one level, "attached". Nothing on this site floats. */
  --elev-1:0 1px 0 var(--line);

  /* container — no numeric column grid; the layout is a rail plus a measure */
  --container:1080px; --gutter:clamp(20px,5vw,40px);

  /* colour */
  --bg:#f4f2ee; --surface:#ffffff; --surface-2:#eae7e1;
  --line:#d8d4cc; --line-2:#8f8a81;
  --ink:#1c1a17; --ink-2:#55504a; --ink-3:#6b655d;
  --accent:#8c2f22; --on-accent:#ffffff; --accent-soft:#f0e5e1;
  --ok:#1c5d38; --bad:#c0102a; --bad-soft:#faeaec;

  /* families */
  --font-display:Georgia,'Iowan Old Style','Palatino Linotype','Times New Roman',serif;
  --font-body:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  --font-mono:ui-monospace,'Cascadia Mono','SF Mono','Segoe UI Mono','Liberation Mono',monospace;

  /* motion — one duration, because the site spends only one */
  --motion-fast:120ms;
  --ease:cubic-bezier(.2,.6,.2,1);
}
@media (prefers-color-scheme:dark){
  :root{
    --bg:#14100e; --surface:#1b1715; --surface-2:#231e1b;
    --line:#332c28; --line-2:#75706a;
    --ink:#eceae6; --ink-2:#b3aca4; --ink-3:#9d968d;
    --accent:#e8836b; --on-accent:#1a1210; --accent-soft:#2a1a15;
    --ok:#63c68e; --bad:#ff8b81; --bad-soft:#2e1614;
  }
}
```

**Deriving them.** Spacing step 8px, ramp `0.5 1 1.5 2 3 4 6 8 12 × step`. Type base 17px
because the site's job is to be read at length by someone in a hurry, ratio 1.333 because an
editorial ratio gives the four heading levels this site actually uses enough separation to be
told apart at a glance. Container 1080px: narrower than a marketing default, because a
document does not want a 1240px measure.

**Colour, in one line each.**

- `--accent` is a muted oxide brick, from the buildings this practice works on and from a
  surveyor's marking crayon. It is the only chromatic colour on the site.
- `--on-accent` flips: white on the brick in light, near-black on the clay in dark.
- Neutrals are one warm family — paper, not grey. There is no cool grey anywhere.
- `--line` is a hairline for grouping. `--line-2` is the *control* border and is the darker of
  the two because a form field border is meaningful non-text and has to clear 3:1.
- Semantic colours exist only on the enquiry form. `--bad` is a saturated rose red, chosen to
  sit clearly apart from the brick accent; even so, no error anywhere is carried by colour —
  every one is prefixed with the word *Error* and marked with a rule and `aria-describedby`.

**Contrast, measured rather than assumed.** Every pairing that appears clears AA in both
schemes: accent on bg 7.4:1 (dark 7.2), on-accent on accent 8.3:1 (dark 7.1), `--ink-2` on
`--surface-2` 6.5:1 (dark 7.4), `--ink-3` — the smallest text on the site — on `--surface-2`
4.7:1 (dark 5.6), `--line-2` against `--surface` 3.4:1 (dark 3.6).

**Radius.** `0` for both levels. This is the system, not the absence of one: the site's
material is a printed report and a report has square corners. Nothing is rounded, including
buttons, panels, form fields and focus rings, so the one thing that *is* curved anywhere would
read as a mistake — which is why there is no `--radius-full`.

## 2. Components

**Buttons.** Two variants and no third.

*Primary* (`.btn`) — `--accent` fill, `--on-accent` label, a 2px `--accent` border so it keeps
its shape when it inverts, `--space-3`/`--space-5` padding, `--radius-inner`, minimum height
`--space-7` (48px, clearing the 44px target with room).

| State | What happens |
| --- | --- |
| rest | brick fill, white label |
| hover | inverts to `--ink` fill with a `--bg` label, over `--motion-fast` |
| `:focus-visible` | 3px `--accent` outline, 2px offset — see *Focus* |
| active | `translateY(1px)`, no colour change |
| disabled | `opacity:.5`, no pointer, and the reason is printed next to it. No control on this site is disabled without one |
| loading | `aria-busy="true"`; the label is replaced with the present participle of what is happening and the control is inert. Used once, on the enquiry submit while the mail client opens |

*Quiet* (`.btn--quiet`) — transparent, `--ink` label, `--line-2` border. Same six states, with
hover filling `--surface-2` instead of inverting.

**Focus.** One treatment for the whole project: `outline: 3px solid var(--accent)` at
`outline-offset: 2px`. The offset puts the ring on the page background rather than on the
control, so it clears 7:1 against every surface on the site including the filled primary
button. Nothing anywhere removes an outline without replacing it.

**Form controls.** Used only on `contact.html`. Border 1px `--line-2`, background `--surface`,
`--radius-inner`, `--space-3` padding, minimum height `--space-7`. The label sits above the
field, always visible, never a placeholder. The hint sits between label and field in
`--text-small`/`--ink-3` and is wired with `aria-describedby`. The error sits directly under
the field, prefixed `Error:`, in `--bad`, with a 3px `--bad` rule down the left of the whole
field group, and is wired to the input with `aria-describedby` and `aria-invalid`.

**Error summary.** Any submit that fails more than one field puts a summary first in the
document inside `main`, headed *There is a problem*, listing every error as a link to its
field, and moves focus to it. `--bad-soft` panel, 3px `--bad` left rule.

**Header and footer.** Identical markup on all seven pages.

*Header* — one line, `--surface`, `box-shadow: var(--elev-1)`, `--space-8` (64px) minimum height
plus `--space-3` padding, so 72px at 1440 and 768. Contents at every width: the wordmark (a
`--space-3` accent square, then *Kestrel Survey* in the display face), five destinations, one
action. The current destination is marked with `aria-current="page"` and a 2px accent underline
drawn with an inset shadow, so the mark occupies no layout.

**At 940px and below** the five destinations collapse into a checkbox disclosure labelled
*Menu*; the action does not collapse with them and stays on the bar, because a phone header
that buries the one action behind a menu has hidden the point of the site. The disclosure is
CSS-only and works with scripting off.

**At 700px and below** the bar needs two rows — wordmark and *Menu*, then the action as a
full-width bar — and it stops being sticky. A 120px chrome on an 812px screen costs more than
it gives on a site made of long documents, and the action repeats at the end of every page.

*Footer* — four columns at 1440 and 768, auto-fitting to one at 375: the practice and its
placeholder contact details, Services, Practice, and a short note on why there are no client
names. Under a hairline, the legal row: the regulated-firm line, the missing registration
numbers named as missing, and the placeholder-details warning.

**Elevation and layering.** One level, and flat is the absence of it rather than a token.
`--elev-1` is *attached* — a 1px `--line` rule cast downward, used only by the sticky header so
that a page scrolled under it does not appear to touch it. There is no floating level and no
z-index stack beyond the header's `20`; the mobile menu pushes the page down rather than
covering it, so nothing on this site ever overlaps anything else. Panels declare
`--radius-outer` and controls `--radius-inner` even though both are `0`, because the
relationship is the system and a later change then has one place to happen.

**Density.** One density, from the top of the ramp. Section padding is asymmetric —
`--space-9` above the rule and `--space-7` below the content at 900 and above, `--space-8` and
`--space-6` below that — because the rule is the masthead of the section under it and belongs
nearer its own heading than to the section it has just left. Ruled rows use `--space-5`. The
enquiry form is the only place the bottom of the ramp appears (`--space-2`, `--space-3`), and
it is the same ramp.

**Component inventory.** Seventeen, each defined once in `styles.css` and referenced by every
page that needs it. Nothing is re-solved on a later page.

| Component | Variants | Where |
| --- | --- | --- |
| `masthead` | current item via `aria-current` | every page |
| `stamp` | rail (≥940) / inline (<940) | every section, every page |
| `hero` | default, `--home` (display size) | every page |
| `nope` | — | `index`, `about` |
| `facts` | — | `index`, `about` |
| `rows` | default, `is-lead` (the weighted first row) | `index`, three services, `contact` |
| `steps` | — | three service pages |
| `checks` | — | `buildings`, `contact` |
| `pair` | — | `buildings` |
| `slot` | — | `buildings` |
| `tbc` | — | `about`, `contact` |
| `quote` | — | `index`, `about` |
| `faq` | — | three service pages |
| `band` | — | every page except `contact`, which is the band |
| `btn` | default, `--quiet`, `--big` | every page |
| `field` / `summary` / `done` | — | `contact` |
| `footer` | — | every page |

## 3. Voice

**Image treatment.** Photography only, and only the practice's own photographs of buildings it
has surveyed. No stock, no illustration, no decorative SVG, no icons. Buildings are shot in
daylight, three-quarter or square-on, and cropped 3:2 landscape; a detail photograph is 1:1.
Photographs appear on `buildings.html` and nowhere else — the rest of the site is set type,
which is why the home hero is editorial rather than split.

Where a photograph does not exist yet, the slot is drawn as a `--surface-2` panel with a 1px
`--line` border, a `--text-micro` mono `PHOTOGRAPH` stamp, and a sentence naming the exact
image that belongs there: subject, viewpoint, aspect and light. That is the empty state, and
it says what would fill it. An unlabelled grey rectangle is not permitted anywhere.

**Copy register.** Sentence case throughout, including buttons. First person plural for the
practice, second person for the reader. Numbers under ten in words except in the facts list,
where they are numerals in the mono face with `font-variant-numeric: tabular-nums`. Dates are
*4 March 2026*. Money is *£1,200*, and there is none on this site. British spelling.

Three strings a writer can pattern-match:

- heading — *Nobody agrees whose fault it is*
- button — *Start an enquiry*
- error — *Error: tell us what kind of building it is, even roughly.*

**Iconography.** None. There is no icon set on this site and nothing decorative is drawn. The
only authored shape is the `--space-3` accent square in the wordmark, which is `aria-hidden`.
Marking a services list with three little icons is exactly the move that would make this
practice look like the four hundred others its reader is not choosing between.

**Motion.** Almost none, and that is the decision. Nothing animates on scroll, nothing animates
on load, nothing staggers, nothing parallaxes. The complete motion budget:

| What | Token | Why |
| --- | --- | --- |
| link and button colour | `--motion-fast` | feedback |
| `<details>` disclosure | native | state change |
| `translateY(1px)` on active | none | feedback |

There is one duration token, because the site spends one. `prefers-reduced-motion: reduce` sets
every transition to `0.01ms` and removes the active transform.

`--step` is the only token declared and never referenced: it is the number the whole spacing
ramp is derived from, and deleting it would delete the derivation. There is no `--warn` and no
`--radius-full`, because this site names two states and curves nothing.

## 4. Page inventory

In `BRIEF.md`, item 5.

## 5. One-off values

| Value | Where | Why it is not a token |
| --- | --- | --- |
| `3px` | the accent rule beside a pull quote and the refusal note; the `--bad` rule beside a form error | 1px disappears next to the 2px section rules and 2px repeats them, so the eye reads a section boundary in the wrong place |
| `9rem` | the reference rail column | the rail has to hold `SERVICE 01` on one line under a wider default font, and no value on the ramp does that without stealing a line from the heading beside it |

---

## The signature

**A 2px ruled band with a mono reference stamp in the left margin.** Every section on every
page opens with a full-container 2px `--ink` rule; under it, in the left column, a two-line
stamp in the mono face — a number and a single word (`03 / BUILDINGS`, `SERVICE 02 /
DILAPIDATIONS`) — and the heading sits to its right. Below 940px the stamp moves above the
heading and runs on one line.

The hero is the one section that carries the stamp without the rule, because the header's own
hairline is already sitting directly above it and two rules a hundred pixels apart read as a
mistake rather than as a system.

It is the front sheet of a survey report, and it is the thing a property manager would
recognise on the second page with the wordmark removed. Square corners, one warm neutral
family, one brick accent with four named jobs and no fifth, and nothing that moves.

## 6. Responsive behaviour

| | 375 | 768 | 1440 |
| --- | --- | --- | --- |
| header | not sticky; wordmark + *Menu*, then the action as a full-width bar | sticky, one line; wordmark + *Menu* + action | sticky, one line; wordmark, five destinations, action |
| reference stamp | above the heading, one line, `--space-3` below | above the heading | left rail, 9rem, two lines |
| ruled rows | one column, heading over body | one column | two columns, 1fr / 2fr |
| facts | one per row | two per row | four per row, auto-fit |
| footer | one column | two columns | four columns |
| photograph slots | full width, 3:2 | half width beside the text, 3:2 | half width beside the text, 3:2 |
| section padding | `--space-8` / `--space-6` | `--space-8` / `--space-6` | `--space-9` / `--space-7` |

Nothing is hidden at any width. Nothing scrolls sideways at any width, and the document never
scrolls sideways at all.
