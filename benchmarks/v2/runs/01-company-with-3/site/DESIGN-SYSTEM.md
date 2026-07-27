# Kestrel Survey — design-system contract

> Items 7–13 of the definition of done. Derived from `BRIEF.md`, not from an example.
> The token block below is copied verbatim into `assets/site.css`.

## 1. Tokens

```css contract
:root{
  color-scheme:light dark;

  /* spacing — step 8px, ramp 0.5 1 1.5 2 3 4 6 8 12 × step */
  --step:8px;
  --space-1:4px;  --space-2:8px;  --space-3:12px; --space-4:16px; --space-5:24px;
  --space-6:32px; --space-7:48px; --space-8:64px; --space-9:96px;

  /* type — families */
  --font-display:"Iowan Old Style","Palatino Linotype",Palatino,"Book Antiqua",Georgia,"Times New Roman",serif;
  --font-body:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  --font-mono:ui-monospace,SFMono-Regular,"Cascadia Mono","Segoe UI Mono",Menlo,Consolas,monospace;

  /* type — roles, base 17px, ratio 1.25. Reuse a role; never invent a size. */
  --text-micro:0.75rem;    --text-small:0.875rem;  --text-body:1.0625rem;
  --text-lead:1.3125rem;   --text-h3:1.625rem;
  --text-h2:clamp(1.3125rem,1.05rem + 1.1vw,2.0625rem);
  --text-h1:clamp(1.625rem,1.15rem + 2vw,2.625rem);
  --text-display:clamp(2.0625rem,1.25rem + 3.4vw,3.25rem);
  --leading-display:1.06; --leading-tight:1.2; --leading-body:1.6;
  --measure:64ch; --tracking-ref:0.16em; --underline-offset:0.16em;

  /* shape — hard-edged. See part 2. */
  --radius-inner:0; --radius-outer:0;
  --rule-hairline:1px; --rule-strong:2px;

  /* elevation — one level, and it means one thing */
  --elev-0:none;
  --elev-1:0 var(--space-2) var(--space-5) rgb(27 24 21 / .16);

  /* container and grid */
  --container:1120px; --gutter:clamp(20px,5vw,40px); --grid-columns:12;

  /* colour — light */
  --bg:#f6f4f1; --surface:#fffefc; --surface-2:#edeae5;
  --line:#d8d3cb; --line-2:#8f8578;
  --ink:#1b1815; --ink-2:#554e46; --ink-3:#6f675d;
  --accent:#b4321f; --accent-hover:#8e2718; --on-accent:#fffefc;
  --ok:#2f5d3a; --bad:#a01f1f;

  /* focus — one treatment for the whole project */
  --focus-width:var(--rule-strong); --focus-offset:var(--rule-strong); --focus-ring:var(--ink);

  /* motion */
  --motion-fast:120ms; --motion-base:200ms; --motion-slow:320ms;
  --ease:cubic-bezier(.2,.6,.2,1);
}
@media (prefers-color-scheme:dark){
  :root{
    --bg:#14110f; --surface:#1c1917; --surface-2:#262220;
    --line:#3b3532; --line-2:#6d655e;
    --ink:#f2efea; --ink-2:#bab2a8; --ink-3:#968d83;
    --accent:#e8674a; --accent-hover:#f28468; --on-accent:#20100b;
    --ok:#7fc08f; --bad:#f08b7a;
    --elev-1:0 var(--space-2) var(--space-5) rgb(0 0 0 / .5);
  }
}
```

**Measured contrast**, both schemes, every pairing that appears on screen:

| Pair | Light | Dark |
| --- | --- | --- |
| `--ink` on `--bg` | 16.1 : 1 | 16.4 : 1 |
| `--ink-2` on `--surface-2` | 6.8 : 1 | 7.5 : 1 |
| `--ink-3` on `--surface-2` | 4.6 : 1 | 4.8 : 1 |
| `--accent` on `--bg` | 5.6 : 1 | 5.8 : 1 |
| `--on-accent` on `--accent` | 6.1 : 1 | 6.1 : 1 |
| `--on-accent` on `--accent-hover` | 8.8 : 1 | 7.3 : 1 |
| `--line-2` on `--surface` (control borders) | 3.6 : 1 | 3.1 : 1 |
| `--bad` on `--surface` (field errors) | 7.7 : 1 | 7.2 : 1 |

`--on-accent` flips: near-white in light, near-black in dark, because the accent inverts.

## 2. Components

**Buttons.** Two variants. Both `min-height:var(--space-7)` (48px) so the touch target
clears 44, both `--radius-inner` (square), both `--text-small` at weight 600.

| State | `.btn--primary` | `.btn--quiet` |
| --- | --- | --- |
| rest | `--accent` fill, `--on-accent` label, border `--accent` | transparent, `--ink` label, `1px --line-2` border |
| hover | fill → `--accent-hover` | border → `--ink`, background → `--surface-2` |
| `:focus-visible` | project focus ring (below) | project focus ring |
| active | `translateY(1px)`, no other change | same |
| disabled | `--surface-2` fill, `--ink-3` label, `cursor:not-allowed` | same |
| loading | `aria-busy="true"`, label replaced with the present participle, disabled for the duration | not used |

**Disabled is used in exactly one place on this site** — the contact form's submit, for the
moment between click and the mail client opening. It carries its own explanation because the
label changes to "Opening your email…". No other control is ever disabled, because a dead
control with no explanation is a dead end.

**Focus.** One treatment everywhere: `outline: var(--focus-width) solid var(--focus-ring)`
with `outline-offset: var(--focus-offset)`. The offset is what makes it work on the accent
button — the page ground shows through the gap, so the near-black ring never sits directly on
the accent fill.

**Form controls.** Input and textarea: `--surface` background, `1px solid var(--line-2)`
border, `--radius-inner`, `min-height: var(--space-7)`, padding `--space-3` × `--space-4`,
`--text-body`. Label **above** the field, always visible, never a placeholder. Hint below the
label, `--text-small`, `--ink-3`, wired with `aria-describedby`. Error below the field,
`--text-small`, `--bad`, prefixed with a `!` glyph so colour is not the only carrier, also
wired with `aria-describedby`. An invalid field gets `aria-invalid="true"` and a
`--rule-strong` `--bad` left border. On submit with more than one error, an error summary
appears first in the form, receives focus, and links to each field.

**Header and footer.** Identical markup on all seven pages.

- Header: sticky, `--surface`, hairline bottom rule. Wordmark (serif name + mono
  descriptor), five destinations, one action, in that order left to right. At 1180 and above
  it is one row and `min-height: var(--space-8)` — about 72px, under the 80px this mode
  allows. The current page is marked with `aria-current="page"`, `--ink` text and a
  `--rule-strong` `--accent` underline — shape and colour, not colour alone.
- **Below 1180px** the destinations collapse into a real disclosure: a `<button>` carrying
  `aria-expanded`, controlling the same `<nav>`. **The action button never collapses** — it
  stays in the bar at 375. With JavaScript off the nav renders open and the toggle does not
  exist at all, so it can never be a dead control.
- **Below 560px** the mono descriptor under the wordmark is dropped and the bar's vertical
  padding drops a step. The wordmark and the action need two rows at that width, and a
  sticky bar taller than an eighth of a phone screen is a bar in the way. The hero repeats
  the descriptor immediately below.
- **One text axis.** At 1000px and above the hero and the page head are indented by the
  reference column plus its gap, so every line of running text on the site starts at the
  same x. The reference column then reads as a sheet margin rather than as an indent only
  some sections have.
- **The closing band and the footer break out of the text axis** on purpose. Every `.sheet`
  keeps the reference margin; the CTA band and the footer use the full container. That is
  the signal that the document has ended and the chrome has begun, and it is the only place
  the axis is allowed to change.
- Footer: four columns at 1440, wrapping to two then one. Practice identity and regulated
  status, the three services, the other pages, and the contact facts. It carries the
  residential exclusion once more, because that is the sentence the practice repeats twenty
  times a week on the phone. Legal line at `--text-micro` but at `--ink-3`, which clears AA.

**Elevation and layering.** One level. `--elev-1` is used by exactly one component: the
phone navigation panel, which genuinely floats over the page content. Everything else is
separated by hairline rules, because this system is a ruled sheet and a shadow on a document
is a photocopy artefact. Z-index order: page content `auto`, sticky header `20`, nav panel
`30`. Nothing else overlaps.

**Density.** Marketing throughout, so the ramp is in play from the top: section padding
`--space-8`, gaps `--space-5` to `--space-7`, body measure 64ch. The only dense area is the
figure legend and the fact tables, which use `--space-2`/`--space-3`. One system, two ends of
one ramp.

## 3. Voice

**Image treatment.** Photography only, and only the practice's own photographs of buildings
it has surveyed. No stock, no people, no generated imagery. Landscape 3:2, one crop rule: the
building or the defect fills the frame, no sky padding.

Until the photographs arrive, every image position is a **labelled figure slot**: a hairline
frame, a 45° hatch at `--line` over `--surface-2`, a mono `FIG. NN` tag, and a legend that
states which photograph belongs there and at what crop. The slot is the imagery empty state
and it says what would fill it. It is never an unlabelled grey box.

**Copy register.** Sentence case for headings and buttons. Second person for the reader
("the building you manage"), first person plural for the practice. British spelling. Numbers
under ten in words except in tables and figure numbers; "about 180" not "180+". Dates as
`2004`. No exclamation marks, no "solutions", no "passionate".

Three strings to pattern-match:

- heading — *"What usually brings people here"*
- button — *"Talk to a surveyor"*
- error — *"Tell us the building type. It is the first thing the surveyor will ask."*

**Iconography.** None. No icon set is loaded and no decorative SVG is authored. The section
reference marks (`§ 01`) and the figure tags are set in the mono face; they are type, not
icons. The wordmark is type. This is deliberate: a surveyor's report has no icons in it.

**Motion.** Three things move, and each earns it:

1. `--motion-fast` on button and link colour, so a hover is felt rather than announced.
2. `--motion-base` on the phone nav panel's disclosure.
3. `--motion-base` on the contact form's error summary appearing.

Nothing animates on scroll. Nothing animates in the form's fields. No entrance animation:
the argument should be readable the instant the page paints, and a fade-in on a document is
a page pretending to be an app. `prefers-reduced-motion: reduce` removes all three.

## 4. Page inventory

See `BRIEF.md` item 5. The seven pages, their purposes, their primary actions and their
blocks are listed there so the plan and the system stay in one place each.

**Component inventory** — every component, defined once in `assets/site.css`, with its
variants:

| Component | Class | Variants | Pages |
| --- | --- | --- | --- |
| Skip link | `.skip` | — | all 7 |
| Site bar | `.bar` | `.bar--open` (phone, disclosed) | all 7 |
| Wordmark | `.mark` | — | all 7 |
| Button | `.btn` | `--primary`, `--quiet` | all 7 |
| Section sheet | `.sheet` | `--surface` (tinted), `--tight` | all 7 |
| Section reference | `.sheet__ref` | — | all 7 |
| Editorial hero | `.hero` | — | home |
| Page head | `.head` | — | 6 inner pages |
| Fact strip | `.facts` | — | home, about |
| Service row | `.rows`, `.row` | `.row--lead` | home |
| Ordered step list | `.steps` | — | 4 pages |
| Marker list | `.list` | `--tight` | all 7 |
| Building card | `.cards`, `.card` | — | home, buildings |
| Figure slot | `.figure` | — | 6 pages |
| Pull quote | `.quote` | — | home, about, defect diagnosis |
| Note panel | `.note` | `--warn` (the residential exclusion) | 5 pages |
| Pending panel | `.pending` | — | about, contact |
| CTA band | `.cta` | — | 6 pages |
| Contact panel | `.contact` | — | contact |
| Form field | `.field` | `--invalid` | contact |
| Error summary | `.summary` | — | contact |
| Footer | `.foot` | — | all 7 |

## 5. One-off values

| Value | Where | Why it is not a token |
| --- | --- | --- |
| `1px` | every hairline rule, control borders, the hatch line | the hairline itself; it is `--rule-hairline` and is also the CSS minimum, so it is written literally where a `calc()` would obscure it |
| `calc(var(--space-3) + 1px)` | the figure slot's hatch period | the hatch needs a 12px gap and a 1px line; the second stop is the first plus the hairline, so it is derived, not chosen |
| `1px` translate on `:active` | buttons | the smallest displacement that reads as a press; `--space-1` (4px) reads as a bug |
| `3fr 2fr` etc. | grid track ratios | ratios, not lengths — they carry no unit and cannot drift |
| `64ch`, `52ch` | prose measure and the hero measure | `--measure` is 64ch for body; the hero's 52ch is a one-off so the display headline breaks after two lines at 1440 rather than three |

Everything else on every page is a token above.

## 6. Responsive behaviour

Stated per width, not inherited.

| | 375 | 768 | 1440 |
| --- | --- | --- | --- |
| Header | two rows: wordmark, then action + toggle. No descriptor. Nav is a disclosed panel, one item per row, 48px tall | one row: wordmark + descriptor, action, toggle. Nav still a panel | one row: wordmark, five destinations, action. ~72px |
| Section sheet | reference above the body | reference above the body | 96px reference column beside the body |
| Hero | display type at 33px, actions stacked full-width | 40px, actions in a row | 52px, measure capped at 52ch, indented onto the shared text axis |
| Fact strip | one column | two columns | four columns |
| Service rows | stacked: title, then body | stacked | title column 1fr, body column 2fr |
| Building cards | one column | two columns | two columns |
| Footer | one column | two columns | four columns |
| Contact | phone, email, then form | same | contact panel 3fr, checklist 2fr |

Nothing disappears at any width. Nothing scrolls sideways; the only elements that could —
long email addresses and the mono reference codes — carry `overflow-wrap:anywhere`.

## 7. Visual signature

**A ruled sheet with a clause reference in the margin.** Every section opens with a hairline
rule across the full content width and a mono `§ 01 / LABEL` set in a fixed left column,
exactly where a survey report numbers its clauses. Square corners everywhere, no shadows, no
icons, warm stone neutrals, and one oxide-red annotation colour.

With the wordmark removed you would still know the second page belongs to the first, because
no other kind of site numbers its sections in the margin.
