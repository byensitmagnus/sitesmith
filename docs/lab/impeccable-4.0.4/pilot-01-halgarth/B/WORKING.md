# Working notes, Halgarth Rotor Balancing

## Subject, nouns, autopilot (skill sections 2 to 5)

Subject in one line: Halgarth Rotor Balancing, a two-person Kilnhurst workshop that
regrinds and rebalances industrial fan impellers pulled off site and returns them with a
before/after certificate. For a maintenance engineer already holding a rotor, the page's
one job is to get that rotor booked in, and to let the ones who will not be taken find
that out themselves before they ring.

Nouns gathered from the brief: impeller, blade tip, leading edge, hub bore, keyway,
journal, journal spacing, horizontal soft-bearing balancing machine, residual unbalance
(g·mm per plane), single-plane / two-plane balance, ISO 21940-11 grade G6.3 / G2.5,
backward-curved / radial-paddle jig, weld build-up and dress, overhead gantry (1,000 kg),
van tail lift (900 kg), pallet, working day, day zero, 48-hour line-down slot, certificate
kept six years, job reference read out letter by letter, bank transfer, Unit 7 Ferrand
Lane Works.

Autopilot description (written before any thesis, so the rest of the plan sits next to
what it must not become): on autopilot this becomes a trade-contractor brochure. A dark
steel-grey hero, a bold sans headline like "Precision Rotor Balancing You Can Trust" over
an abstract industrial gradient, three icon cards for Balancing / Regrinding /
Certification under a "services" eyebrow, a bullet list under "Why choose us", an orange
"Get a Quote" button leading to a vague contact form rather than the real booking form,
and a footer with a map. It reaches for a gear icon, chevron dividers and drop-shadowed
cards, and papers over the missing photography with a generic metal-texture gradient that
means nothing about this shop specifically. Swap the name and the copy and it is any
machine shop's website. This became thesis 1 below, and it was a real candidate, not a
straw man: it is buildable and mostly truthful, it just fails the brief's own requirement
that a non-booking visitor still leaves knowing scope, price and date, because that model
defers specifics to a "contact us" step by category habit.

## Theses (verbatim from `.sitesmith/direction.md`)

1. A trade contractor's brochure site with the booking form as a quote-request bolted on
   the end.
2. A capacity envelope the visitor holds their own rotor against, gridded in the
   balancing machine's own mass, diameter, journal-spacing and speed limits, before they
   ever reach the form.
3. A page shaped like the certificate it eventually issues: a before/after ledger in
   g·mm, with the booking form as the blank half still to be filled in.
4. A working-day tally, not a calendar: the whole site counts from day zero the same way
   the turnaround promise does, and shows no date that arithmetic did not produce.
5. A sequence of five refusal gates the visitor walks through in order, ATEX, in-situ,
   cracked hub, someone else's weld, unidentified coatings, arriving at the form only
   once every gate is passed.
6. A job travelling through a two-man shop the way its own docket does: arrival,
   assessment, regrind, balance, certificate, return, with the booking form as the first
   line of that docket.

## Viability, judged before the draw

1. truth: yes, nothing here needs an invented fact. task: no, a brochure-with-quote-CTA
   model defers scope, price and date to a "contact us" step by category habit, and the
   brief explicitly requires a visitor who leaves without booking to still know scope,
   price and return date. feasible: yes, trivial in plain HTML/CSS. autopilot: yes.
2. truth: yes, 900 kg / 2,200 mm / 350 to 1,900 mm / 180 to 1,100 rpm are stated facts.
   task: yes, this is the literal mechanism for "let the caller find the refusal
   themselves, before they ring". feasible: yes, a labelled range built from plain CSS
   bars. autopilot: no.
3. truth: yes, provided the before/after boxes stay labelled and empty rather than
   carrying an invented sample reading, since no example certificate exists in the Facts.
   task: yes, though it answers "what will I get back" more directly than "will they take
   it" or "what will it cost", the weakest task fit of the viable set. feasible: yes, a
   two-column ledger is a CSS grid. autopilot: no.
4. truth: yes, provided every date shown is one of the four fixed dates the brief allows
   and nothing reads a live clock, since the brief states the site has no clock. task:
   yes, the return date is one of the three things the brief says a visitor wants fast.
   feasible: yes, static day-boxes, no JS date logic needed or wanted. autopilot: no.
5. truth: yes, the five refusal rules are stated verbatim under "What they refuse". task:
   yes, the most literal reading of the brief's own problem statement, a self-administered
   refusal test before the phone call. feasible: yes, sequential sections or a CSS-only
   checklist, works with JS disabled. autopilot: no.
6. truth: yes, the sequence of arrival, one-working-day assessment, regrind/weld/balance,
   certificate and return is grounded in Facts. task: yes, it carries the turnaround and
   process trust the brief asks for, and the form becomes "starting the docket".
   feasible: yes, a stepped card layout in plain HTML/CSS. autopilot: no.

Drawable pool after exclusions: {2, 3, 4, 5, 6}, five of six. Thesis 1 excluded twice
over, marked autopilot and failing task fit on its own honest merits, which is the
correct outcome for the page this direction would produce without trying.

## Assignment

`validate` passed on the first attempt, no problems reported, five candidates in the draw.

`assign` (no `--key` passed, script drew its own):

```
ASSIGNED   : thesis 4
             A working-day tally, not a calendar: the whole site counts from day zero the same way

run key    : c50098ae
list hash  : ed2f4b26a2f6d6d1e5bccf83e6061747172efe967a057b981aa62a35bc2e03e8
candidates : 6, 5 viable and not autopilot
drawn from : 2, 3, 4, 5, 6  (index 2)
re-rolls   : 0 of 2
```

## Re-roll

None taken. Thesis 4 was judged truth: yes, task: yes, feasible: yes before the draw, and
nothing discovered while building the case reversed that judgement. There is no factual
defect to name, only the ordinary fact that two other candidates (2 and 5) would also have
been strong builds; preferring one of those over the assigned thesis is taste, and
`assign.mjs` correctly refuses a re-roll on taste. Built as assigned.

## The two swaps

**Swap 1, neighbouring business in the same trade.** Ran the plan against a two-person
prop-shaft and driveshaft dynamic-balancing shop for agricultural and marine customers.
What survives: the structural idea of counting turnaround in working days and showing a
capacity envelope for the machine is a balancing-industry pattern, not a Halgarth-specific
one; a neighbour would reasonably want both. What does not survive unchanged: the exact
numbers (900 kg, the four fixed dates, the five refusal rules, the price list) are
Halgarth's own facts. More importantly, the `--arc` accent is named for leading-edge weld
build-up, a line Halgarth actually sells; a shop that only balances and never welds has no
honest claim on "the colour of the welding arc" as its process accent and would need a
different material story. Change made: the Visual and material system section now states
this dependency explicitly ("this colour exists on this page because Halgarth welds"),
rather than presenting `--arc` as a generic engineering blue that any precision shop could
reuse without thinking about it.

**Swap 2, unrelated trade, different floor.** Handed the plan, shape only, to a two-person
violin bow rehairing and repair workshop: also two people, also appointment and
turnaround-driven, also has its own "will they take it" refusals (a cracked stick, for
instance), also hands back a receipt. The material story correctly fails to transfer:
nobody would use a welding-arc blue or an oxidised-steel red for a bow shop, and the
refusal list obviously would not read "ATEX or spark-resistant". But the abstract shape,
a static fixed-reference-date working-day tally as the signature, a spec envelope as the
second reading, a two-accent process/refusal system, a stencil face for job codes, held up
suspiciously well in outline, because almost any small appointment trade can be described
that way. That is the process-not-design failure the skill warns about. Change made: the
line-down track's `.slot-capacity` marks (the two dots for the two weekly slots, filled or
hollow) were added specifically because of this swap. A generic "turnaround tracker" does
not know it is only allowed two rush jobs a week with an 11:00 cutoff and a hard refusal
of a third; making that cap a visible mark on the tally, not only a sentence in the copy,
ties the signature back to a rule this specific enough that it would not silently fit the
bow shop too. Recorded per the skill: something changed on the second swap, so the plan
was not finished before it.
