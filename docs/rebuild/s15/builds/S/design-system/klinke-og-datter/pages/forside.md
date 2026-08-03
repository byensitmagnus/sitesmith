# Forside Page Overrides

> **PROJECT:** Klinke og Datter
> **Generated:** 2026-08-02 (search.py --design-system --persist --page forside), then revised by hand
> **Page Type:** Single-page service site (one page is the whole site)

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`../MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Step 1 — Requirement analysis (input to every override below)

- **Product type:** Tool/service — a two-person specialist workshop that repairs pneumatic
  player pianos and pianolas. Not a SaaS, not e-commerce (the rolls are a side line).
- **Target audience:** One person, one situation: someone who has inherited a player piano
  and does not know whether it is scrap or savable. Mixed age, non-expert, slightly anxious
  about a big unknown bill, probably reading on a phone in a room with the instrument in it.
- **The reader's three questions** (straight from the brief): *what do these people do*,
  *what does it cost to find out*, *how do I start*. Every section must serve one of them.
- **Style keywords:** archival, plain, warm, workshop, precise, unhurried. Not luxury,
  not startup, not playful.
- **Stack:** single self-contained HTML file, plain CSS, no framework, no JS. Google Fonts
  allowed. **No stack rules loaded** — `--stack html-tailwind` was rejected because Tailwind
  cannot be used here (no build step, no CDN script).
- **Platform:** desktop/mobile web. The Master's App-UI-scoped sections (safe areas, haptics,
  bottom nav, Dynamic Type) are out of scope per the skill's own scope notice. Touch-target
  and contrast rules still apply.

---

## Page-Specific Rules

### Pattern override — Trust & Authority, with the proof rebuilt

Master pattern **Trust & Authority + Conversion** is kept. Its proof step is **not** usable
as written: the brief forbids testimonials, review scores, customer names and any count of
instruments restored, and this workshop has no logos, certs or stats. "Security badges,
case studies" would have to be invented, which is a hard failure.

Proof is therefore rebuilt out of what is actually true and verifiable in the brief:

| Master's proof device | Replaced by |
|---|---|
| Client logos | Two named people with start years (Verner 1981, Liv 2011) |
| Certifications | A named, narrow scope — what they do *and* what they refuse |
| Stats / case studies | Five named failure modes, in the trade's own words |
| "Transparent pricing" | Kept, and made the spine of the page: 1.850 kr., half a day, written report either way, and an explicit refusal to quote the restoration before the assessment |
| Low-friction form | Replaced by phone. The brief gives a phone number and opening hours and no email or form; inventing an inbox would be inventing a fact. |

**Section order (overrides Master's 4-step order):**

1. Hero — the reader's own question as the H1, price + duration + outcome directly under it,
   phone CTA above the fold.
2. Hvad vi laver — scope in / scope out (this is credibility for this trade, and it saves the
   wrong reader a phone call).
3. Sådan starter du — the four steps, with the 1.850 kr. assessment as step 2.
4. Det vi typisk finder — the five named failures.
5. Musikruller — 38 titles, 340 kr.
6. Værkstedet — the two people, four instruments at a time, the wait.
7. Kontakt — phone, hours, address, repeated.

### Layout overrides

- **Max width:** 1120px content column, 68ch measure for prose. **Not** 1400px/full-width —
  the Master's 1400px comes from a data-dashboard assumption; this page is 90% prose and
  `line-length-control` (60–75 chars desktop) wins.
- **Grid:** 12-column at ≥1024px, but used as an *asymmetric editorial* grid (label column
  + content column), not a symmetric card grid. Single column at 375, two at 768.
- **Density:** **Spacious, not high.** Master's forside stub says "High — optimize for
  information display"; that is wrong for an anxious reader with seven questions. Section
  rhythm 64/96/128px, prose blocks 24px.

### Typography overrides

Master says Inter/Inter (Swiss, neutral). Overridden: a workshop that cuts paper rolls from
original masters should not read like an admin panel, and with no photography available,
type is the only visual material there is.

- **Headings + prose:** Newsreader (`--domain typography` result "News Editorial" —
  "designed for long-form reading, trustworthy"). Weight 400–600, not 900.
- **Labels, numbers, UI:** Public Sans (from the "Magazine Style" pairing) with
  `font-variant-numeric: tabular-nums` on every price, year and phone number
  (`number-tabular` rule).
- **Rejected:** the Master's Exaggerated Minimalism effect block
  (`clamp(3rem, 10vw, 12rem)`, weight 900, tracking -0.05em). At 12rem a headline crowds out
  the price, and this is not a fashion brand. Kept from that style: single accent only,
  massive whitespace, high contrast. H1 is `clamp(2.1rem, 6vw, 3.9rem)`.

### Color overrides

Master's navy/blue B2B palette is replaced. Navy + blue CTA reads as a bank or a council;
this is a workshop that works in wood, leather, felt and paper. Palette is taken from the
`--domain color` "Brewery/Winery" row (deep burgundy + craft warmth), reduced to the
Exaggerated-Minimalism rule of **one accent only**.

| Role | Light | Dark | Verified contrast |
|---|---|---|---|
| Background | `#FAF7F1` | `#14110E` | — |
| Surface | `#FFFFFF` | `#1E1A16` | — |
| Foreground | `#1A1512` | `#F5F0E8` | 16.93 / 16.58 (AAA) |
| Muted foreground | `#5C534B` | `#B0A69A` | 7.03 / 7.85 (AAA) |
| Accent (single) | `#7C2D12` | `#E9A178` | 8.76 / 8.81 (AAA) |
| On accent | `#FFFFFF` | `#14110E` | 9.37 / 8.81 (AAA) |
| Border | `#C4B5A0` | `#55493F` | ~1.9 vs surface — visible in **both** modes |

Dark mode uses a lighter, desaturated tonal variant of the burgundy, not an inversion
(`color-dark-mode`). Both themes were computed independently, not inferred from light.

### Component overrides

- **Radius:** 2px, not 8/12/16px. Rounded cards read as SaaS.
- **Shadows:** none. Master's `--shadow-md/lg` and `translateY(-2px)` card hovers are dropped —
  `layout-shifting hovers` is on the Master's own forbidden list, and a paper-surface page
  should separate with rule lines and background tone, not elevation.
- **Cards are not clickable**, so they get no `cursor:pointer` and no hover lift. Only the two
  links and the phone buttons are interactive.
- **Primary CTA:** solid accent, ≥48px tall. **Secondary:** 2px accent underline offset 4px
  (from the "Bold Typography" style's underline-CTA pattern), not an outlined pill.
- **Focus:** 3px accent outline, 3px offset, on every focusable element. Never removed.

### Motion overrides

Master attaches a GSAP `stagger` snippet. **Not used** — no external JS is allowed, and the
skill's own Don't for scroll reveal is "don't reveal content as invisible-by-default without a
no-JS fallback". A JS-free page cannot have that fallback, so there is no entrance motion at
all. Motion is limited to 160–200ms colour/underline transitions on hover, focus and active
(`duration-timing`, `transform-performance`), all disabled under
`prefers-reduced-motion: reduce`.

### Imagery

No photography exists. All visual material is CSS/SVG and is `aria-hidden`:

1. **Perforated roll** — an SVG band of punched holes on paper, used once in the hero and as
   the section divider. It is the literal product they cut, so it is the only honest mark.
2. **Key strip** — a CSS-only black/white key pattern closing the contact section.
3. Failure cards get no diagram. A drawn cross-section would assert an anatomy the brief does
   not give; the five parts are named in type instead.

---

## Page-Specific Components

- `.roll` — SVG perforated music roll, decorative, `aria-hidden="true"`.
- `.price-block` — the 1.850 kr. figure with its three qualifying facts, tabular figures.
- `.step` — numbered process item with a rule line, ordered list semantics.
- `.fact-row` — definition list for phone / hours / address, tabular figures.

---

## Verified against (Master checklist + Quick Reference §1–§3)

- [x] No emojis as icons — SVG only
- [x] `cursor:pointer` on the elements that are actually clickable, and only those
- [x] Hover/focus transitions 160–200ms
- [x] Light **and** dark text contrast ≥ 4.5:1 (all pairs measured above, all ≥ 7:1)
- [x] Focus states visible, 3px, never `outline:none` without a replacement
- [x] `prefers-reduced-motion` respected
- [x] 375 / 768 / 1024 / 1440 — no horizontal scroll at 375
- [x] Touch targets ≥ 44px on every link and button
- [x] Heading hierarchy h1 → h2 → h3, no skips; skip link to `#indhold`
- [x] `font-display: swap` via Google Fonts `&display=swap`
- [x] No content hidden behind fixed bars — the header is static, not fixed

### How it was verified

Served locally and measured in the browser at **375 / 768 / 1440**, each with a fresh load so
`clamp()` and the colour-scheme media query were evaluated at that width, and each in **light
and dark** independently:

- `documentElement.scrollWidth` equals the viewport at all three widths → no horizontal scroll.
- Every element's right edge measured against `clientWidth` → zero overflowing elements.
- Every `a[href]`/`button` measured → zero targets under 44px tall (three were caught at 25px,
  24px and 32px on the first pass and fixed: the wordmark, an inline phone link inside a
  paragraph, and the contact-list links).
- Dark mode confirmed applied, not inferred: `body` resolves to `rgb(20,17,14)` on
  `rgb(245,240,232)`, accent `rgb(233,161,120)`, CTA ink-on-accent — the measured pairs.
- Console: no messages. Internal anchors: 9, none dead. `lang="da"`, exactly one `h1`,
  heading order `h1 → h2 → h3` with no skipped level.
- Fonts: Newsreader 400/500/600 and Public Sans 400/500/600/700 all reported `loaded`.

**Not done:** no screenshot. The browser pane was not displayed in this environment, so the
page never composited a frame and every screenshot attempt timed out. Everything above is
measured from the live DOM, not looked at. Optical judgements — whether the perforated roll
reads as paper at 39px tall on a phone, whether the burgundy is right — are unverified.
