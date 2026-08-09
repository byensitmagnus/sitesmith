## Thesis

A working-day tally, not a calendar: the whole site counts from day zero the same way the turnaround promise does, and shows no date that arithmetic did not produce.
This is the only one that organises it around the fact the brief itself treats as load-bearing and single-sourced: one fixed reference date, counted forward in working days only, with weekends and the Christmas closure simply absent from the count rather than shown and excluded. It answers "when will I get it back" as a rendered object, not a sentence, without ever touching a real clock.

## Subject grounding

Halgarth Rotor Balancing counts turnaround in working days, not calendar days, and says so explicitly: "counting starts on the first working day after the rotor arrives. The day it lands on their floor is day zero." Standard turnaround is 5 working days from arrival. The brief fixes exactly four dates the page may ever show, and no others: Monday 10 August 2026 (today, the only "now" this build has), Tuesday 11 August 2026 (assessment, one working day after a reference-date arrival), Monday 17 August 2026 (standard return, day 5 of that arrival), and Wednesday 12 August 2026 (the return date if the 48-hour line-down slot is taken instead). The line-down slot itself is capped at two per week, must be booked before 11:00, and the page must say plainly when both are gone rather than pretend to take a third.
This direction is built entirely from those numbers. It shows no date arithmetic could not produce, and it treats "day zero does not count" and "weekends and the closure are not working days" as the two facts worth building a visible object around, because they are the two facts a maintenance engineer doing mental arithmetic on a works phone is most likely to get wrong.

## First viewport

Three fixed elements sit above everything else, in this order, and none of them is inside a dialog or behind a toggle:
.disclosure-strip, full width, permanent: "Halgarth Rotor Balancing is a fictional business built for a design exercise. Nothing on this page may be relied on." Set in Public Sans 600, --iron on --swarf, present at 320px and at 1440px alike.
A slim identity bar: "Halgarth Rotor Balancing, Kilnhurst" and the landline, with a static open/closed word derived from the stated hours (no clock reads it; it is written as part of the page).
The hero, carrying the one object that owns the first screen: .day-tally, the working-day tile row, at its largest size. Above it, the headline states the brief's own three questions back in the interface's voice: "Will we take it. What it costs. When it's back." Beneath the tally, one sentence of real dates: "A rotor dropped off Monday 10 August 2026 is assessed by email Tuesday 11 August, and back Monday 17 August, standard turnaround. With the 48-hour line-down slot instead, it is back Wednesday 12 August." The primary control, "Book your rotor in", sits directly under that sentence.
Painted matter: .day-tally is a row of drawn tiles with stencilled numerals, not a photograph and not decoration behind text, occupying a real share of the first screen at every width from 320px up. No dead field: the hero ground carries a single low-opacity material texture (below, under Visual and material system) rather than flat colour or a gradient standing in for a photograph that does not exist. Unmistakably this subject: the tally's dates and the "day zero does not count" absence are Halgarth's own arithmetic; a competitor's site cropped to this frame would show either the wrong dates or a plain countdown, not this shape.

## Visual and material system

Five named values, no more. Paper and swarf are the two warm neutrals a workshop actually sits in; iron is the ink; arc and condemned are the only two saturated colours, each carrying one job that does not overlap the other.
--paper: #f2efe4 (ground). Taken from the certificate paper and the docket sheet: every figure Halgarth hands back, before and after, is printed on something this colour.
--iron: #21252b (body text, rules, ink). Taken from the cast-iron bed of the horizontal soft-bearing balancing machine. Contrast on paper: 13.4:1.
--swarf: #d8d2c2 (dividers, unfilled tally tiles, quiet fills, never text). Taken from steel swarf and grinding dust off the blade-tip jig, the pale grey-tan of the cuttings that collect on the bench. Not used for text; contrast on paper is 1.3:1, decorative only.
--arc: #0a6b7c (the one "process" accent: filled tally tiles, the single link colour, the one filled control). Taken from the blue-cyan flash of the welding arc used for leading-edge weld build-up, the way it reads through a welder's shade lens. This colour exists on this page because Halgarth welds; a shop that only balanced and never welded would need a different accent, and that is deliberate, not incidental. Contrast on paper: 5.35:1. Paper text on an arc fill: 5.35:1.
--condemned: #8f3016 (the one "stop" accent: the two error states, the refused/ condemned language). Taken from oxidised steel, literally what is left on a rotor Halgarth "condemns in writing" and will not repair. Contrast on paper: 7.0:1.
Materiality: the hero and the section grounds carry one texture, a repeating linear gradient in --swarf at 3% opacity, 2px band width, 45 degrees, reading as swarf grain or an engine-turned dial face at a strength you would only notice if it were removed. Used consistently across every page; nowhere else does a second texture appear.
No dark theme is authored. The five values above are fixed regardless of prefers-color-scheme, so a reader testing both schemes gets the same, already-verified contrast rather than a second palette invented for the occasion; this is a stated decision against the default, not an oversight.

## Typography strategy

Two roles, two real faces, both self-hostable under an open licence so nothing is fetched from a third-party origin.
Display: Big Shoulders Stencil, weight 700. Used only for standalone numerals, never for a sentence: the digit inside each .day-tally tile (--step-numeral-tile, clamp(1.25rem, 3.5vw, 1.75rem)), and the job reference on the success page (--step-numeral-lg, clamp(3rem, 9vw, 5.5rem), letter-spacing 0.04em so the counters in "6" and "8" stay open at small sizes). Stencil lettering is grounded in the trade itself: part tags and pallet crates are stencilled, not set in a text face, and stencils only ever carry short codes, which is the same restraint the brief's own job reference needs.
Body and UI: Public Sans, weights 400 and 600. Used for every sentence, label, button and form field. 400 for running copy, --step-body: 1rem, line-height 1.55. 600 for labels, captions and the day-tally's tile captions ("arrives", "assessed", "back mon 17 aug"), --step-meta: 0.875rem, letter-spacing 0.02em. Public Sans carries font-variant-numeric: tabular-nums wherever figures sit in a column: the price list, the capacity-envelope numbers, the g·mm figures on the certificate description. It is designed for plain-language government forms, which is the same job this booking form has: no theatrics, just a field that is legible on a works phone.
H1: Public Sans 700, clamp(1.75rem, 4.5vw, 2.75rem). H2: Public Sans 700, clamp(1.25rem, 2.5vw, 1.625rem). Buttons: Public Sans 600, 1rem, never uppercase, and the word matches its result exactly ("Book this rotor in" resolves to a success page that states the booking, not a generic "thank you").

## Composition and layout

Single column throughout, document-like rather than a marketing template of alternating full-bleed bands. Content max-width 720px for prose sections; the tally, the envelope and the price table sit in a wider 960px band because they are instruments, not paragraphs. Base spacing unit 8px; sections separated by a dashed rule, border-top: 2px dashed var(--swarf), not a solid hairline, standing for the tear line on a perforated docket pad rather than a generic divider. Breakpoints: single column and a 2-line wrapped nav under 600px, horizontal nav and a one-row tally from 600px, 3rem side gutters beyond the 960px band from 1200px. No horizontal scroll is introduced at any width because the tally uses grid-template-columns: repeat(auto-fit, minmax(2.75rem, 1fr)) and shrinks rather than overflows.
Home page, in document order:
Sketch:
disclosure strip (always visible)
identity bar: name, Kilnhurst, phone, open/closed word
┌───────────────────────────────────────────────┐
│  Will we take it. What it costs. When it's     │
│  back.                                         │
│                                                 │
│   ┌──┐ ╌╌ ┌──┐┌──┐┌──┐┌──┐┌──┐                │  <- .day-tally, standard track
│   │0 │    │1 ││2 ││3 ││4 ││5 │                │     0 hollow, 1-5 filled --arc
│   └──┘    └──┘└──┘└──┘└──┘└──┘                │
│  arrives   assessed          back Mon 17 Aug   │
│  Mon 10 Aug  Tue 11 Aug                        │
│                                                 │
│   ┌──┐ ╌╌ ┌──┐        ●○ 2 slots left this week│  <- line-down track + .slot-capacity
│   │0 │    │2 │        back Wed 12 Aug          │
│   └──┘    └──┘                                 │
│                                                 │
│  [ Book your rotor in ]                        │
└───────────────────────────────────────────────┘
 Will Halgarth take it? (.refusal-list, 5 lines)
 ─╌╌╌─
 The machine (.capacity-envelope) -- see below,
 placed here as the page's second reading
 ─╌╌╌─
 Prices, ex. VAT (.price-table, tabular-nums)
 ─╌╌╌─
 What the certificate will not tell you: the
 subject's own unknown, set in body type at body
 size, not smaller: "Erosion, deposit build-up, a
 bent shaft and a failing bearing all look the
 same on the machine. We state what we measured,
 not what caused it."
 ─╌╌╌─
 footer: address, hours, email, what happens to
 the form data, "Book your rotor in" repeated
.capacity-envelope is the page's second reading: three horizontal ranges (mass 0 to 900 kg, diameter 0 to 2,200 mm, journal spacing 350 to 1,900 mm), each a labelled CSS bar with the limit written in numerals at its end, tabular-nums. It renders a different fact than the tally (physical capacity, not turnaround) and it does not sit in the first screen; it sits here, roughly a third of the way down, immediately before the price list, because it answers "will they take it" the way the tally answers "when is it back."
/book/ repeats the identity bar and disclosure strip, then the twelve-field form in one column, each of the mass, diameter and journal-spacing fields carrying its limit in --step-meta type directly beneath the input, and the line-down radio carrying "2 slots left this week" (or, on /book/slots-full.html, the exact required copy with that option disabled). /book/success.html reuses .day-tally, now captioned "your job" instead of the generic example, filled with job reference HB-2617 set in --step-numeral-lg, and the phonetic read-out line verbatim beneath it.

## Signature element

.day-tally: a row of <li> tiles, one per working day from day 0 to the return day, built as a plain ordered list, no canvas and no JavaScript. Day 0 is drawn hollow (outline only, --iron on --paper, no fill) because it does not count toward the five. Days 1 through 5 are filled --arc with a small tick and their stencilled numeral. The mechanism that makes this a tally and not a calendar: a calendar draws seven boxes a week and greys out the two that do not count. This draws exactly as many tiles as there are working days and stops, so Saturday, Sunday, and every day inside the two-week Christmas closure simply do not exist as tiles at all, the same way they do not exist in Halgarth's own counting rule. Each tile still carries the real calendar date in a datetime attribute for assistive tech, even though the visible caption reads "day 3"; nothing on the page ever computes a date live, every value is written once as static markup, because the brief's own premise is that this business's page has no clock.
The 48-hour line-down track reuses the same tile component at two tiles instead of five, with .slot-capacity next to it: two small dots, filled or hollow for each of the two weekly slots, so the "at most two, and we say no to a third" rule is a mark on the page, not only a sentence.
Nothing in .day-tally animates, at any point, with or without prefers-reduced-motion. The tiles are correct on first paint. A business whose whole premise is "no clock" should not ship a component that ticks.

## Visitor path

A visitor lands on works Wi-Fi or 4G in a plant room, phone in one hand, rotor on a pallet somewhere behind them. The disclosure strip and identity bar orient them in under a second; the hero tally answers "when" without scrolling; "Book your rotor in" is reachable from the hero and is repeated at the close of every section beneath it, per the buying floor's "one control, reachable from anywhere the buyer might decide." Scrolling once answers "will they take it" (.refusal-list, then .capacity-envelope) and "what it costs" (.price-table, VAT-excl labelled at every figure), so a visitor who never submits the form still leaves knowing all three things the brief requires, without hunting.
Choosing "Book your rotor in" reaches /book/ (Empty): twelve fields, limits printed beside the three that have them, line-down availability stated plainly, nothing pre-filled except defaults. Three static outcomes exist as their own URLs and are reached by submitting the two example bookings from the Facts: a rotor over the mass limit lands on /book/error.html, keyboard focus on the mass field, the exact required copy sitting directly under that field and nowhere else; an ATEX rotor lands on /book/error-atex.html, focus on the ATEX field, no mass error present because none of Booking B's numbers are out of range; a rotor that clears every gate lands on /book/success.html, job reference HB-2617 in both the stencil numeral and the phonetic read-out line, verbatim, plus the filled tally and the restated drop-off, payment and turnaround facts. /book/slots-full.html is the same empty form with the line-down option disabled and the required copy in its place, reachable as its own bookmarkable state rather than something a script toggles. Every field, radio and link is reachable in source order by keyboard alone, with a visible --arc focus outline (3px, 2px offset, 5.35:1 against paper) that holds on every background it sits over. Nothing animates on submission or on error; the next state is simply the next page.

## Honest risk

The category would write "5 working days" as a sentence and move on. This direction instead spends its one bold move on a device whose entire meaning sits in what is missing: the tally has no Saturday tile, no Sunday tile, and no tile for 23 December to 6 January, and that absence is the whole argument. The floor's own 44px minimum and the tabular-nums captions help, but they do not remove the risk; a device this quiet about its own logic can read as broken before it reads as considered, and there is no test in this package that catches "understood" versus "merely rendered."
