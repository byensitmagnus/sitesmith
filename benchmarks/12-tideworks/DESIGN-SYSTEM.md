# DESIGN-SYSTEM — Tideworks duty board

Written **from the winning comp**, `directions/a/`. Its ground, its single monospace, its
hairline rhythm and its two-part window bar are what the tokens below record.

Mode **P**, product UI. One page.

---

## 1. Tokens

```css contract
:root{
  /* spacing — one step of 4px (dense product UI), ramp 0.5 1 1.5 2 3 4 6 8 12 × step */
  --step:4px;
  --space-1:2px;  --space-2:4px;  --space-3:6px;  --space-4:8px;  --space-5:12px;
  --space-6:16px; --space-7:24px; --space-8:32px; --space-9:48px;

  /* type — base 15px, ratio 1.2, rounded to the nearest pixel. Roles, not sizes. */
  --text-micro:0.6875rem;   /* 11 — section markers, axis ticks, units */
  --text-small:0.8125rem;   /* 13 — table cells, secondary lines */
  --text-body:0.9375rem;    /* 15 — the board's default */
  --text-lead:1.125rem;     /* 18 — the status line's prose */
  --text-h3:1.375rem;       /* 22 — the figures inside the status line */
  --text-h2:1.625rem;       /* 26 — h1 */
  --text-h1:1.9375rem;      /* 31 — reserved; unused on this page, see part 5 */
  --text-display:2.3125rem; /* 37 — reserved; unused on this page, see part 5 */
  --leading-tight:1.15; --leading-body:1.45; --leading-status:1.7;
  --measure:70ch;

  /* shape — inner is tighter than outer; nothing here is a card */
  --radius-inner:1px;   /* the window bars inside a lane track */
  --radius-outer:2px;   /* inputs, selects, the one button */
  --radius-full:999px;  /* status dots only */

  /* elevation — none, deliberately. See part 2, "Elevation and layering". */
  --elev-0:none; --elev-1:none; --elev-2:none;

  /* container and grid */
  --container:1360px; --gutter:clamp(16px,3vw,28px); --grid-columns:12;
  --lane-label:152px;   /* the lock-name column of the instrument at >=720px */
  --lane-tail:112px;    /* its shuts-at column */

  /* colour — the night sheet is the default, because the shift starts at 04:40 in the dark */
  --bg:#0B0F12; --surface:#11171B; --surface-2:#151D22;
  --line:#232E35;        /* decorative hairline */
  --line-strong:#5A6C77; /* meaningful stroke: the elapsed part of a window, the shut rule */
  --ink:#E6EDF1; --ink-2:#9AAAB4;
  --accent:#4FD07A; --on-accent:#06130B;
  --go:#4FD07A; --warn:#F0B429; --bad:#FF6B5E;

  /* families — one, and it is a monospace */
  --font-mono:ui-monospace,"Cascadia Mono","Cascadia Code",Consolas,"SF Mono",Menlo,"DejaVu Sans Mono",monospace;
  --font-display:var(--font-mono); --font-body:var(--font-mono);

  /* motion */
  --motion-fast:110ms; --motion-base:180ms; --motion-slow:280ms;
  --ease:cubic-bezier(.2,.6,.2,1);
}
:root[data-sheet="day"]{
  color-scheme:light;
  --bg:#E9ECEC; --surface:#DDE2E3; --surface-2:#FAFCFC;
  --line:#C7CFD1; --line-strong:#6E7C84;
  --ink:#0E1519; --ink-2:#4C5A63;
  --accent:#15693A; --on-accent:#FFFFFF;
  --go:#15693A; --warn:#7A4F00; --bad:#B3231A;
}
```

**Two sheets, and why the switch is a control rather than a media query.** The brief fixes both
the reading condition — 04:40, a hut, the light on, "assume the light is bad" — and the
obligation to work in both colour schemes. Those two pull against each other in a browser,
because a browser that has been told nothing reports `prefers-color-scheme: light`. A board
whose palette is driven by that query therefore opens *paper-white at 04:40*, which is the one
thing the brief's reading condition rules out.

So the sheet is a **control in the chrome bar**, the way a bridge display has Day / Dusk / Night
rather than an operating-system preference. The board opens on the **night sheet**, because a
shift that starts at 04:40 starts in the dark; the keeper switches to the day sheet when the sun
comes up, and the choice is remembered on that machine. This is the controlled-environment case
core rule D7 names, and this paragraph is the statement it asks for.

Both sheets are fully designed and both are checked: `verify.mjs` is run against `/` and again
against `/?sheet=day`, and axe reports zero violations on each. The day sheet is **designed, not
inverted**: on the night sheet the chrome bar and the input surfaces sit *above* the ground
(`--surface` is lighter than `--bg`); on the day sheet they sit *below* it (`--surface` is a
tinted bar, `--surface-2` is near-white paper for fields). Both mean "separated from the
ground", and the signal colours are re-picked to hold AA on paper rather than dimmed.

**Contrast, measured in both schemes.** `--ink` on `--bg` 16.3:1 dark / 14.1:1 light;
`--ink-2` on `--bg` 8.1:1 / 6.0:1; `--go` 9.8:1 / 5.7:1; `--warn` 10.3:1 / 6.0:1; `--bad`
6.9:1 / 5.6:1; `--on-accent` on `--accent` 9.7:1 / 6.7:1. `--line-strong`, which carries
meaning as the elapsed part of a window, clears 3:1 in both (3.5:1 / 3.6:1).

## 2. Components

**Density.** `--space-2` to `--space-5` are the working range; `--space-7` separates sections
and `--space-9` appears once, above the footer. A lane in the instrument is 34px and a table row
is 32px, because six locks plus six waiting boats — one shift's working unit — has to be on
screen at 1440 without scrolling past the log form.

**The one accent, and the semantic group.** `--accent` means one thing: **workable now.** It
paints an open window's remaining bar, the current focus ring, and the primary button — which is
the action that works a boat through an open lock, so the meanings agree rather than compete.
Separate from it, the semantic group names three lock states, each with a word and a dot as well
as a colour: `--go` open · `--warn` closing (under two hours of window left) · `--bad` shut.
Nothing else on the board is coloured.

**Buttons.** One variant, `primary`, used once: *Log the passage*.
rest — `--accent` fill, `--on-accent` label, `--radius-outer`, 44px tall, `--space-6` inline
padding · hover — fill lightens by mixing 12% `--ink` in, 110ms · `:focus-visible` — the project
focus treatment · active — fill mixes 12% `--bg` in, no translation · disabled — never used; the
button is always enabled and validation reports on submit, because a dead button with no reason
is a dead end · loading — **not implemented, and not drawn.** The log is written into the page
synchronously with no request, so a loading state has no way in; a state with no way in is
deleted rather than faked.

Secondary controls are the two links in the footer conventions; they are underlined `--ink-2`
text and nothing else.

**Form controls.** `select` and `input[type=text]`: `--surface-2` ground, 1px `--line` border,
`--radius-outer`, 40px tall (44px including the 2px focus offset ring), `--space-4` inline
padding, `--text-body`. Label above the field in `--text-micro` uppercase `--ink-2`, letter-space
0.12em. Hint directly under the label in `--text-small` `--ink-2`. Error under the field in
`--text-small` `--bad`, prefixed by a filled square glyph, and wired with `aria-describedby`.
A field in error also takes a 2px `--bad` left border.

**Focus treatment — one for the whole project.** `outline:2px solid var(--accent);
outline-offset:2px`. Nothing else changes on focus. It is the same on the button, the selects,
the inputs, the skip link and the scrollable table region.

**Header and footer.** The chrome bar is 56px at every width — 44px of control plus 6px either
side — and it is not sticky, because the board is short and a sticky bar costs 56px of a 375px
screen. `--surface` ground, one hairline under it. It carries the mark and the words *Middle
Level & tidal Ouse* at the left, and *as at 04:40* plus the sheet button at the right; below
640px the subtitle drops and the mark, the time and the button stay. The sheet button is the
only secondary control on the board: transparent ground, 1px `--line-strong` border, `--ink-2`
label that goes to `--ink` on hover, and its label is the sheet it switches *to*. The footer is the board's
conventions — what "closing" means, what the sill figure is measured from, the priority order —
set at `--text-small` in `--ink-2`, on the same ground, above a hairline. Both are identical on
every page of this site, which is one page.

**Elevation and layering.** There is none, and that is a decision: the board is one continuous
field of hairline rules, in the lineage of a printed tide table, and a shadow would put a card
on it. All three `--elev-*` tokens are `none`. Nothing overlaps, so there is no z-index order.

**The instrument.** `figure.tidechart` — caption, an axis row, then six `li.lane` rows of 34px.
Each lane is a three-column grid (`--lane-label` / `minmax(0,1fr)` / `--lane-tail`); under 720px
it becomes two rows, name and shuts-at above, the track full width below, and the ruler keeps its
full width so the lanes stay comparable. Within a track: `.bar--gone` 4px `--line-strong`,
`.bar--left` 14px state colour, `.rule--now` 2px `--ink`, `.rule--hw` 1px dashed `--ink-2`.

## 3. Voice

**Image treatment.** None. `DIRECTION.md` declares `imagery: deliberately imageless`; the only
drawn things are the mark's glyph and the instrument, and the instrument is data. See
`ASSET-PLAN.md` for what was considered and cut, and why nothing stands in.

**Copy register.** Sentence case everywhere except section markers and field labels, which are
uppercase at `--text-micro` with 0.14em tracking. Present tense, no first person, no second
person, no hedging. Times are 24-hour with a colon — `05:42`. Durations are `1 h 02`. Depths are
one decimal and a unit — `0.4 m` — and a depth never appears without its datum: `sill 0.4 m at
MLW`. Boat names are italic. The reader is "the keeper" and is never addressed.

Three strings to pattern-match:
- heading — *Workable windows this tide — ordered by when they shut*
- button — *Log the passage*
- error — *Denver's windows today are 01:12–09:12 and 13:38–21:38. 23:15 is outside both.*

**Iconography.** No icon set. Two drawn glyphs exist in the whole project: the mark, and the 7px
status dot. The mark is the signature in miniature — a thin elapsed line, a heavy "now" rule, a
solid remaining bar — so the device that identifies the board is the same device the board is
built from. It is the only authored SVG on the page, it is `aria-hidden` because the wordmark
beside it is the accessible name, and it appears once.

**Motion.** Three things move, all of them state-change feedback under `--motion-fast`: a
control's fill on hover, a newly logged row fading in, and the status message appearing. Nothing
moves on scroll, nothing moves on load, and nothing moves while the keeper is typing — the log
row is inserted after submit, never during entry. All of it is off under
`prefers-reduced-motion: reduce`.

## 4. Page inventory

| Page | Purpose | Primary action | Blocks |
| --- | --- | --- | --- |
| `/` | The whole board: what the tide is doing, which of six locks can be worked in the next four hours, which boats are waiting and in what order | **Log the passage** — write a boat, a lock, a time and initials into the shift's log | chrome bar, status line, tide instrument, lock table, priority queue, passage log with its empty state, log form with error summary, conventions footer |

## 5. One-off values

| Value | Where | Why it is not a token |
| --- | --- | --- |
| `4px` / `14px` | the two heights of a window bar | they are the instrument's own scale: 4px reads as a line and 14px as a bar at 34px lane height, and the pair *is* the signature. Neither is a spacing value. |
| `2px` | the "now" rule | 1px disappears against a 14px bar; 3px starts to cover the minute it marks |
| `7px` | the status dot | the optical match for a 13px cell of monospace; `--space-3` at 6px reads as a speck and `--space-4` at 8px as a bullet |
| `0.14em` / `0.12em` / `0.18em` | tracking on section markers, field labels and the wordmark | tracking is not on the spacing ramp and is set per role |
| `34px` / `26px` | lane height at ≥720px and below it | derived in part 2 from the working unit: six locks and six boats on one 1440 screen; below 720px the lane splits into two rows so the track can be shorter |
| `56px` | the chrome bar | 44px of touch target plus 6px either side. Not a spacing value — it is the control height plus its surround. |
| `44px` | the minimum height of every control | the platform accessibility floor, not a design choice |
| `43.137%` and the other window percentages | the instrument's geometry | computed from the brief's clock times against the 01:00–09:30 ruler, not chosen. `EVIDENCE.md` section 8 is the source. |
| `520px` / `334px` / `190px` / `960px` | the lock table's minimum width, the status sidenote column, the form's minimum field width, the form's maximum width | layout thresholds. Each is the width at which a specific piece of content stops fitting, measured rather than picked; they belong to the composition and not to a ramp. |
| `26px` / `14px` gradients | the scroll shadow on `.scroller--wide` | the shadow is 14px so it is narrower than the narrowest cell it sits over; the cover panel is 26px so its opaque part fully hides the shadow when there is nothing to scroll. Only the lock table carries it — the log table fits at 375 and an affordance for a scroll that cannot happen is a lie. |
| `9ch` | the `morning` / `evening` label column inside a window cell | a `ch` measure, so the two clock times align under each other whatever the figure |

`--text-h1` and `--text-display` are declared and unused: this board's largest type is its `h1`
at `--text-h2`, because a masthead taking a third of the first screen is a fault. They stay in
the contract so a second screen in this system has them, and `token-drift` reports them as
unused rather than as drift.
