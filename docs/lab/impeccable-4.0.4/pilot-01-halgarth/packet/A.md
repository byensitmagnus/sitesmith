## Thesis

A weighbridge, not a shopfront. The page's whole job is to weigh the
caller's rotor against Halgarth's fixed limits before they ever pick up the
phone, and only then walk the ones who pass to the form.

## Subject grounding

Halgarth Rotor Balancing: two people, Ray Halgarth (balancing, welding) and
Tomás Iriarte (grinding, machining, transport), working from Unit 7, Ferrand
Lane Works, Kilnhurst. They take worn industrial fan impellers off site,
regrind and re-weld the blade tips, and rebalance the rotor on their own
horizontal soft-bearing machine, returning it with a printed certificate of
residual unbalance, before and after, per plane. The reader is a maintenance
engineer or works fitter on a phone in a plant room, often with the
impeller already on a pallet, who needs three things fast: is my rotor in
scope, what does it cost, when do I get it back. Nouns the design is built from: journal spacing, soft-bearing machine,
residual unbalance in g·mm per plane, ISO 21940-11 grades G6.3 and G2.5,
the blade-tip regrind jig (backward-curved and radial-paddle only), leading
edge, weld build-up and dress, hub bore skim, keyway clean-up, the overhead
gantry and van tail lift, "off the shaft," "dry and free of process
build-up," a condemned rotor, scrap disposal, the printed certificate kept
six years, a job reference read aloud over the phone, ATEX/spark-resistant,
the line-down slot, bank transfer with no card machine, "day zero"
counting.

## First viewport

The object that owns the first screen is an operating-envelope panel: a
drawn, ruled plate, not a photograph, sitting beside the H1 and primary
CTA. It states, in this order:

- Rotor mass: up to 900 kg
- Rotor diameter: up to 2,200 mm
- Journal spacing: 350 to 1,900 mm
- Balancing speed: 180 to 1,100 rpm
- Standard grade: ISO 21940-11 *G6.3* (G2.5 on request, +£140, +1 working day)

H1: "Take it off the shaft. Send us the numbers. We'll tell you if it
fits." Primary CTA directly beneath it: "Book an impeller in" (the brief's
own phrase, used exactly), secondary line: "or ring 01709 000114." A small
line-drawn silhouette of a backward-curved impeller wheel (a simple closed
SVG path, single colour, no gradient or photographic pretence) sits small
and quiet beside the H1, under 48px tall on desktop, reused later as the
end-caps on the plane-1/plane-2 diagram in the signature. Painted matter: the envelope panel is a bordered, ruled object occupying
roughly 40 to 45% of the hero's width on desktop (full width, stacked below
the CTA, on narrow viewports), not running text. No dead field: the hero's
ground carries the faint ruled texture described under Visual and material
system, so empty margin still reads as considered rather than unfinished. Unmistakably this subject: the exact combination of kg/mm/rpm figures and
the G6.3/G2.5 citation, plus the word "impeller," rules out every other
trade.

## Visual and material system

Seven colours, each named after a mark this trade actually leaves. No
colour is assigned a UI role in the abstract; each is used where its
material sense applies. - `--chalk: #F3EFE5`, the page ground. Chalk marking and certificate paper:
  warm, not clinical white. - `--mill-scale: #24262B`, primary ink. The blue-black oxide skin on rolled
  steel. Body text, headings, dark panel fills. - `--swarf: #6E7178`, steel turnings. Rules, borders, dividers, and large
  secondary text only (see contrast note below); never small body copy. - `--weld-straw: #B9832A`, the first heat-tint band on a fresh weld pass. Large numerals (prices, plate values at 1.25rem/700 or bigger),
  underlines, borders. Not small text. - `--weld-blue: #3E6B78`, the cooler heat-tint band further from the weld. Links, the focus ring on light grounds, the "what we don't know" panel's
  top rule. - `--caution: #E8A722`, hazard-plate yellow. Reserved for the ATEX/refusal
  moments only: the refusals panel's top rule, used as a chip background
  with `--mill-scale` text on top, never spent decoratively elsewhere. - `--rust: #954226`, a condemned rotor's oxidation. The two error states
  only: field outline, left border on the error message, the error text
  itself (dark enough on `--chalk` to stand as body text without a
  separate ink colour). Contrast, reasoned by eye and to be confirmed with a checker before ship:
`--mill-scale` and `--rust` on `--chalk` both clear 4.5:1 comfortably (dark
on light). `--weld-blue` on `--chalk` clears 4.5:1. `--weld-straw` on
`--chalk` sits nearer 3:1: large text and borders only, never a paragraph. `--caution` is only ever a background under `--mill-scale` text, which is
safe by a wide margin. Focus ring: `outline: 3px solid var(--weld-blue);
outline-offset: 2px` on light grounds; swap the ring to `--caution` where
it would sit on a `--mill-scale` fill, so it keeps 3:1 against both the
control and the page behind it. Materiality: one texture, used everywhere, cheap enough to notice only if
removed. Two crossed `repeating-linear-gradient` washes in `--swarf` at 3
to 4% opacity over `--chalk`, spaced to suggest a technical pad's faint
grid, not a literal ruled ledger. No photography exists and none is
implied; every drawn element (the envelope panel, the impeller silhouette,
the plane diagram) is a labelled schematic, not a stand-in for a photo of
the real unit.

## Typography strategy

Three roles, self-hosted (no third-party font fetch):

- *Big Shoulders Display* (OFL): headings and plate labels. Chosen for
  its civic/engineering-signage lineage (Chicago title-block lettering)
  over the reach-for-first industrial pairing (Oswald, Poppins). Weights
  500/600/700. H1 `clamp(2.25rem, 5vw + 1rem, 4rem)`, weight 700. H2
  `clamp(1.5rem, 3vw + 1rem, 2.25rem)`, weight 600. Plate/panel labels
  1.125 to 1.25rem, weight 600, uppercase only for lead-ins of two to four
  words (never a full sentence in caps). - *IBM Plex Sans*: body copy, form labels, running text. Weight 400 body
  (1.0625rem / 17px, line-height 1.5), 500 for emphasis and field labels,
  600 sparingly for the refusal/unknown row lead-ins where they sit inline
  rather than in Big Shoulders. - *IBM Plex Mono*: every number (prices, mm, kg, rpm, g·mm, dates, the
  phone number, the job reference). Weight 400 inline with body text at
  1em, 500 for standalone plate and table values (1.125 to 1.25rem), 600
  for the job reference on the success page (2.5rem). Chosen paired with
  Plex Sans specifically so the numeric material reads as a matched
  documentation family, not a borrowed developer-tool font. Inputs are set at 16px minimum (Plex Sans 400) to meet the floor and avoid
mobile zoom-on-focus.

## Composition and layout

One long page, not a set of separate marketing pages: the five required
states are five renderings of this same page's lower section, sharing an
identical hero, envelope panel, capability/price table, turnaround block
and refusals/unknowns pair, differing only in the form and what sits at
the mass or ATEX field. The first screen is built around the envelope
panel, named above, because it is the one object that lets a reader
self-qualify without reading a word of running text. ```
┌──────────────────────────────────────────────────────┐
│ THIS BUSINESS IS FICTIONAL. IT IS A BUILD EXERCISE.   │  permanent strip,
│ NOTHING ON THIS PAGE MAY BE RELIED ON.                │  every viewport
├──────────────────────────────────────────────────────┤
│ HALGARTH ROTOR BALANCING        01709 000114  works@… │  header
├──────────────────────────────────────────────────────┤
│  [wheel]  TAKE IT OFF THE SHAFT.      ┌──────────────┐│
│  SEND US THE NUMBERS.                 │ mass  ≤900kg ││  first
│  WE'LL TELL YOU IF IT FITS.           │ dia  ≤2200mm ││  viewport
│                                        │ jrnl 350-1900││
│  [Book an impeller in]                │ speed180-1100││
│  or ring 01709 000114                 │ grade G6.3   ││
│                                        └──────────────┘│
├──────────────────────────────────────────────────────┤
│ WHAT IT COSTS, EX VAT                                 │
│ Inspection and assessment ..................... £95   │
│ Single-plane balance .......................... £280  │
│ Two-plane balance .............................. £420  │
│ Blade-tip regrind, up to 12 blades ............ £340   │
│  ...(merged capability + price rows continue)...      │
├──────────────────────────────────────────────────────┤
│ IF IT LANDS ON OUR FLOOR MONDAY 10 AUGUST 2026        │
│ day 0 Mon 10 arrives    day 1 Tue 11 assessed         │
│ day 5 Mon 17 standard return  (line-down slot: Wed 12)│
├───────────────────────────┬────────────────────────────┤
│ WHAT WE REFUSE            │ WHAT WE DON'T KNOW         │
│ (caution top rule)        │ (weld-blue top rule)       │
│ - ATEX / spark-resistant  │ - why it went out of       │
│ - on site                 │   balance                  │
│ - cracked hub weld/casting│ - how long a balance holds │
│ - another shop's repair   │ - whether the fan suited   │
│ - unknown coating/asbestos│   the duty                 │
├───────────────────────────┴────────────────────────────┤
│ BOOK AN IMPELLER IN  (docket-style, 12 fields)         │
│ Name ________  Company ________                       │
│ Mass (kg) ____  Diameter (mm) ____  Journal (mm) ____  │
│ ... ATEX / hub / line-down / collection ...            │
│ [Book an impeller in]                                  │
├──────────────────────────────────────────────────────┤
│ Unit 7 Ferrand Lane Works, Kilnhurst DN12 4RQ          │
│ Mon-Thu 07:00-16:30, Fri 07:00-12:30                   │
│ This business is fictional. Build exercise. (repeat)   │
└──────────────────────────────────────────────────────┘
```

Below roughly 700px the envelope panel drops beneath the H1/CTA instead of
sitting beside it, and the refuse/don't-know pair stacks to one column. Nothing scrolls horizontally at any width from 320 to 1440. Structural devices and what each claims: the envelope panel claims "these
are hard limits, not marketing" (true: they are the machine's own
figures). The merged capability/price table claims "this is one document,
not a features pitch with pricing bolted on" (true, and the reason the two
were combined rather than kept as separate sections; see Honest risk). The
day list claims "this exact sequence of dates is what you get for a rotor
arriving on the stated reference date" (true, sourced directly from the
Facts' worked example, and no other date appears anywhere on the page). One device considered and cut: numbering "grind, weld and dress, balance"
as a claimed 1-2-3 process. The Facts list these as separate line items,
not a promised sequence, and a numbered process reads as a claim a
customer could hold Halgarth to ("you said you always do X before Y"). They are listed instead as a plain, unordered set of what the workshop
does to a rotor. No motion beyond instant, native state changes: a same-frame colour swap
on hover/focus, no timed transition longer than the browser default. `prefers-reduced-motion: reduce` removes even that. No control waits on a
click; no form field animates in.

## Signature element

The refusals panel, paired with the "what we don't know" panel beside it:
two plates of equal typographic weight, one stating hard boundaries, one
stating honest gaps, standing where most trade sites would put
reassurance. Kind: a document, specifically a rating plate turned to list
exclusions instead of capacities, deliberately not an instrument reading,
which is the kind this subject and this medium would reach for first (a
gauge or dial showing a live value). Built from CSS alone: a bordered
panel on `--chalk`, `border-top: 4px solid var(--caution)` for the refusals
half and `var(--weld-blue)` for the unknowns half, five (and three) plain
rows each with a Big Shoulders uppercase lead-in of two or three words
("ATEX:", "ON SITE:", "CRACKED HUB:") followed by the Facts' own sentence
in Plex Sans, a thin `--swarf` rule between rows, no icon font or external
asset. Content is copied near-verbatim from the Facts' "What they refuse"
and "What they do not know" lists; nothing here is invented, which is the
point: the page is exactly as confident about its limits as it is about
its prices. This is the second reading as well as the signature: the first screen's
envelope panel reads a numeric fact (mass, diameter, journal, speed,
grade); this panel, well below the fold, reads a categorical fact
(exclusions and unknowns), a different kind of measurement of the same
subject, not the same drawing twice. The impeller-wheel silhouette from
the first viewport reappears once more here, small, as the end-caps of a
plane-1/plane-2 line diagram placed above the two panels, captioned with
the real journal-spacing figures, the only other place that mark is used.

## Visitor path

The site is one page at `/book/`, and the other four required states are
that same page with an unchanged hero, envelope panel, price table,
turnaround block and refusals/unknowns pair. Only the form section
differs. - *Cold arrival, `/book/`.* Reads the disclosure strip, checks their
  rotor's numbers against the envelope panel, skims the merged price
  table and the reference turnaround dates, checks themselves against the
  refusals panel. A visitor who stops here still knows whether they're in
  scope, what it costs, and when it would come back: the brief's own bar
  for a visitor who leaves without booking. Those still qualified scroll
  to the form and submit. - *`/book/slots-full.html`.* Identical top content. The line-down
  control carries the native `disabled` attribute (no JS needed to block
  selection) and its label is replaced with the required copy in full
  contrast, not greyed out to the point of being hard to read. The reason
  has to stay legible, not just the fact that it's off. The rest of the
  form still submits. - *`/book/error.html`.* Booking A's twelve answers pre-filled exactly
  as given, including 1,240 in the mass field. That field carries the
  required `autofocus` attribute (native HTML, no script) so keyboard and
  screen-reader focus lands there on load. The error text sits directly
  under that one field, in `--rust`, with a `--rust` left border on the
  field itself; no banner at the top of the form repeats it. - *`/book/error-atex.html`.* Booking B's twelve answers pre-filled,
  `autofocus` on the ATEX control, the required copy directly under it,
  no other field marked. - *`/book/success.html`.* Job reference HB-2617 set in Plex Mono 600 at
  2.5rem, directly under an H1 that echoes the action taken ("Booked in"),
  matching the interface's own voice. The read-aloud line ("Read it out
  as: aitch bee, two six one seven.") sits immediately beside it, not
  buried in a paragraph. Drop-off address and hours, "off the shaft,"
  "dry," the two computed dates (assessment Tuesday 11 August, return
  Monday 17 August), and payment by bank transfer follow as a plain list. Keyboard and structure: DOM order matches visual order throughout; every
control meets a 44px touch target with at least 24px between adjacent
ones; every input is 16px. No JavaScript is required for any of this: the
five states are five static files, `disabled` and `autofocus` carry the
two dynamic-feeling behaviours natively, and the brief's own constraint
(fully usable with JavaScript off) is met by default rather than as a
fallback to engineer.

## Honest risk

The whole page bets on density reading as precision rather than clutter. Where most trade-services sites would break "what we do" and "price" into
separate, breathing sections with icons and cards, this plan merges them
into one spec-sheet table, sets every number in a mono face, and puts a
ruled rating plate above the fold instead of a photograph or a headline
alone. For the stated reader, a maintenance engineer scanning fast on a
works phone in a plant room, that bet is that document-density scans
faster and lands as more trustworthy than a friendlier, whitespace-heavy
layout would. It could go the other way: at 320px, a merged table with a
label column and a right-aligned mono price column is tight, and if it is
not reflowed carefully (stacking to label-over-value pairs rather than
shrinking two columns until they clip) it will read as cramped rather than
precise, which is the one failure mode that would sink this direction
outright. The fix if it happens is not to add whitespace back piecemeal
but to check the stacked reflow specifically, since that is where the bet
actually gets tested.
