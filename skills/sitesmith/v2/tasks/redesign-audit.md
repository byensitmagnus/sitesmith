# Redesign audit

> Original work, MIT. Written for sitesmith — not derived from any third-party skill.
> Use when the target already exists. For greenfield work, follow the `init` route in `SKILL.md`.

## Contents

- [How to run this](#how-to-run-this)
- [Preservation contract](#preservation-contract)
- [Pass 1 — Typography](#pass-1--typography)
- [Pass 2 — Colour and surface](#pass-2--colour-and-surface)
- [Pass 3 — Layout and rhythm](#pass-3--layout-and-rhythm)
- [Pass 4 — States and interaction](#pass-4--states-and-interaction)
- [Pass 5 — Content and copy](#pass-5--content-and-copy)
- [Pass 6 — Components](#pass-6--components)
- [Pass 7 — Code and semantics](#pass-7--code-and-semantics)
- [Pass 8 — The forgotten surfaces](#pass-8--the-forgotten-surfaces)
- [Repair order](#repair-order)
- [Scoring](#scoring)

---

## How to run this

Three phases, in order. Do not start editing during phase one.

1. **Read.** Identify the framework, the styling method, the design token source (if any), and the
   build tooling. Open the largest page and the smallest component. Note which of the two is more
   representative of the codebase.
2. **Score.** Walk passes 1–8. Write down every finding with a file reference. Do not fix anything
   yet — fixing while reading produces a scattered diff and hides systemic problems behind local
   ones.
3. **Repair.** Work the repair order at the bottom. Re-run the affected pass after each group.

A redesign that touches forty files and improves nothing measurable is worse than four targeted
changes. Prefer the four.

## Preservation contract

These are not yours to change unless the brief says so in words:

- The framework, the router, the styling system and the state library.
- Brand marks, registered colours, and legally required text.
- URLs, route names, form field names, and analytics event names.
- Copy that carries a claim — prices, guarantees, certifications, availability.
- Anything behind a feature flag or an A/B test.

If a fix requires breaking one of these, stop and say so. Do not decide it silently.

## Pass 1 — Typography

| Look for | Why it reads as unfinished | Repair |
| --- | --- | --- |
| One typeface doing every job | No hierarchy signal beyond size | Introduce a second face for headings, or a second optical size of the same family |
| Only 400 and 700 weights | Hierarchy jumps instead of stepping | Add 500 and 600; use them for labels and subheads |
| Headings at body letter-spacing | Large text looks loose and weak | Tighten tracking as size grows; loosen it for small caps and labels |
| Paragraphs wider than ~75 characters | The eye loses the line return | Constrain the measure, not the container |
| Line-height identical at every size | Display text looks airy, body text looks cramped | Scale line-height inversely with font size |
| Numbers in proportional figures | Columns and timers jitter | `font-variant-numeric: tabular-nums` on any aligned numeric run |
| A single word alone on the last line | Reads as a typo | `text-wrap: balance` on headings, `pretty` on body |
| Title Case Everywhere | Dated and shouty | Sentence case, except where the brand demands otherwise |

## Pass 2 — Colour and surface

| Look for | Why | Repair |
| --- | --- | --- |
| Pure `#000` or pure `#fff` as the page ground | Maximum contrast reads as unrefined and strains the eye | Shift a few points off the extreme and tint toward the accent's hue |
| More than one accent colour | Nothing is emphasised when everything is | Pick one. Demote the rest to neutrals |
| Warm and cool greys in the same tree | Surfaces look dirty without an obvious cause | Choose one grey family and tint all neutrals consistently |
| Accents above roughly 80% saturation | Vibrates against text, fails on projectors and cheap panels | Desaturate and compensate with weight or size |
| `box-shadow: 0 4px 6px rgba(0,0,0,.1)` repeated verbatim | The default. Instantly recognisable | Tint the shadow with the background hue; vary the scale by elevation |
| Shadows implying different light sources | Subconsciously wrong | Audit every shadow to one direction |
| One dark section dropped into a light page | Looks like a paste accident | Commit to the mode, or step within the same palette |
| Perfectly even 45° linear gradients | The most common generated surface | Radial, mesh, or a flat fill with texture |
| Zero texture anywhere | Sterile at large sizes | A low-opacity noise layer, `pointer-events: none`, fixed |

Contrast is not negotiable: body text at 4.5:1, large text and UI glyphs at 3:1, in **both** modes.
Verify with a tool, not by eye.

## Pass 3 — Layout and rhythm

| Look for | Repair |
| --- | --- |
| Everything centred, everything symmetrical | Offset one axis. Left-align headings over centred content, or break one element out of the grid |
| Three equal cards as the feature row | Two-column zig-zag, an asymmetric grid, or a horizontal scroller |
| `height: 100vh` | `min-height: 100dvh` — `100vh` jumps when mobile browser chrome retracts |
| Percentage flexbox arithmetic for columns | CSS Grid |
| No max-width on the outer container | Constrain to roughly 1200–1440px with auto margins |
| Identical border-radius on every element | Tighter inside, softer outside |
| Elements sitting flat beside each other | Overlap with negative margin to create depth |
| Equal top and bottom section padding | Optical balance usually wants slightly more below |
| Cards in a row with buttons at different heights | Pin CTAs to the card bottom so they form one line |
| Comparison columns whose lists start at different Y | Fix the height of the title and price block above the list |
| Spacing values with no shared origin | Adopt a 4px or 8px step and use only multiples |

## Pass 4 — States and interaction

Every interactive element owes you six states. Missing any of them is unfinished work, not a
stylistic choice.

1. **Rest** — the default.
2. **Hover** — background, elevation or transform shift. Never the only affordance; touch has no hover.
3. **Focus-visible** — a ring that survives a dark background. Removing the outline without
   replacing it is an accessibility defect.
4. **Active** — a small compression, around `scale(0.98)` or a 1px downward nudge.
5. **Disabled** — reduced emphasis, `cursor: not-allowed`, and the actual `disabled` attribute.
   Something that looks pressable and does nothing is a bug.
6. **Loading** — a skeleton shaped like the content it replaces, not a spinner in the void.

Then the page-level states: **empty** (a composed first-run view, not a blank panel), **error**
(inline, next to the cause, with a way forward), and **partial** (some data arrived, some did not).

Transitions belong on `transform` and `opacity` only. Animating `width`, `height`, `top` or `left`
forces layout on every frame. Durations 150–300ms for micro-interactions; ease-out entering,
ease-in leaving; exits roughly two-thirds the length of entrances. All of it wrapped in
`@media (prefers-reduced-motion: reduce)`.

## Pass 5 — Content and copy

Fabricated specifics are the fastest way to destroy trust, and the easiest thing to generate.

- **Never invent** testimonials, customer names, logos, user counts, prices, ratings or awards. If
  the real ones are not available, build the layout with a visible placeholder that cannot be
  mistaken for a claim.
- **Round numbers read as fake.** Real data is untidy. `47.2%` is believable; `50%` is a guess.
- **Placeholder names give it away.** No "John Doe", no "Acme Corp", no "Nexus", no "SmartFlow".
- **Retire the vocabulary of generated marketing:** elevate, seamless, unleash, unlock, empower,
  next-gen, game-changer, delve, tapestry, "in today's fast-paced world", "take it to the next
  level". If a sentence would fit any company in any industry, it says nothing.
- **No Lorem Ipsum.** Write real draft copy. Wrong copy is fixable; fake copy hides layout problems.
- **Confidence over volume.** "Saved." not "Saved!". "Connection failed. Try again." not "Oops!
  Something went wrong."
- **Active voice.** "We couldn't save your changes", never "an error occurred".
- **Vary dates and avatars.** Identical timestamps across a blog roll, or one photo reused for four
  people, break the illusion instantly.

## Pass 6 — Components

| Default | Why it is a default | Alternative |
| --- | --- | --- |
| Card = border + shadow + white fill | Three elevation signals doing one job | Pick one. Or none — use spacing |
| One filled button beside one ghost button | Every generated page has this pair | Add a tertiary text link and drop one of the two |
| Pill badges for "New" and "Beta" | Ubiquitous | Square tags, a flag, or plain coloured text |
| Accordion FAQ | Hides content from search and from scanning | A two-column list, or inline disclosure |
| Three-card testimonial carousel with dots | Nobody clicks the dots | A masonry wall, or one quote with real weight |
| Three-column pricing with a taller middle | Height alone is a weak signal | Emphasise the recommendation with colour and copy |
| Modal for everything | Interrupts and traps focus | Inline editing, or a slide-over |
| Circular avatars only | Uniform and forgettable | Squircles or rounded squares |
| Sun/moon toggle | Ignores the system preference | Detect `prefers-color-scheme`, offer an override in settings |
| Four-column footer link farm | Dilutes every link | Primary paths and required legal links |

Icons: one family, one stroke width, one optical size scale. Emoji are not icons — they render
differently per platform and cannot be themed. Avoid the obvious metaphors (rocket for launch,
shield for security); they are the visual equivalent of "unlock your potential".

## Pass 7 — Code and semantics

- Replace `<div>` scaffolding with `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`,
  `<aside>`, `<footer>`. Screen readers navigate by landmark.
- One `<h1>` per page. No skipped heading levels.
- Every meaningful image needs `alt` that describes the content. Decorative images need `alt=""`.
- No inline styles mixed into a project that has a styling system.
- Relative units for anything that must adapt. Hardcoded pixel widths break at the extremes.
- A named z-index scale. `z-index: 9999` means the scale was lost.
- Verify every import against the dependency manifest before writing it. A hallucinated import
  fails at build time and wastes a cycle.
- `<title>`, `<meta name="description">`, `og:title`, `og:description`, `og:image`, and a favicon.
- Remove commented-out code and debug logging before shipping.

## Pass 8 — The forgotten surfaces

Generated sites are consistently missing the same six things:

1. A custom 404 that offers a route back.
2. Privacy policy and terms links in the footer.
3. A visible "skip to content" link as the first tab stop.
4. Client-side form validation with messages tied to fields.
5. A way back from every dead end.
6. An active state in the navigation so the user knows where they are.

Add whichever apply. They cost minutes and they are the difference between a mockup and a site.

## Repair order

Work top to bottom. Each step is cheap relative to its visual return, and each one makes the next
easier to judge.

1. **Typeface and scale** — the largest perceived change for the smallest diff.
2. **Palette reduction** — one accent, one grey family, fixed contrast.
3. **States** — hover, focus, active, disabled. The page starts feeling alive here.
4. **Spacing and container** — one scale, one max-width, consistent rhythm.
5. **Component replacement** — swap the two or three most generic patterns.
6. **Empty, loading and error views** — this is where it stops looking like a demo.
7. **Typographic detail** — tracking, measure, orphans, tabular figures.

## Scoring

Score each dimension 1–5 before and after. Anything still at 2 or below after the repair order is
where the next session starts.

| Dimension | 1 | 3 | 5 |
| --- | --- | --- | --- |
| Hierarchy | Everything competes | Clear primary action | Eye path is deliberate at every breakpoint |
| Originality | Recognisably templated | Some considered choices | Could not be mistaken for another site |
| Cohesion | Mixed idioms | Mostly consistent | One visual language throughout |
| Responsiveness | Breaks or scrolls sideways | Works at all three widths | Layout genuinely rethought per width |
| Usability | States missing | Core states present | All six states, keyboard complete |
| Slop resistance | Reads as generated | A few defaults remain | No pattern present without a reason |
