# Direction record

## Surface

buy

## Subject

Damgaard Estrik ApS: five people who dry out water-damaged floor constructions by
measurement, not by guesswork, and lay a new levelling layer or screed only once a
measured number crosses a stated line. The page's one job is a booking form for a
fugtgennemgang (moisture inspection), and its second job, done in under thirty seconds
and without a form, is telling everyone outside a 75 km radius or with kategori-3
sewage water to stop reading and call a different company. Fictional, sealed brief,
built as a construction exercise; the page must carry a permanent, unconditional line
saying so.

## Constraints in force

Next.js App Router, one server action, no database, works with no client JS, three
states reachable as routes/URLs. 320-1440px, no horizontal scroll. Full keyboard
reachability, focus moves to the field that raised an error. `prefers-reduced-motion`
removes animation and transition entirely. No photography exists of this company and
none may be implied to exist; every visual element is drawn. Nothing on the forbidden
list (night/weekend cover, insurer partnership, any certification, case-count
experience, mould competence, any guarantee, reviews/stars). No cookie banner, no
analytics, no third-party script. Danish, du-form, æøå correct throughout, every price
excl. moms and labelled so at every appearance.

## Assets that exist

None supplied and none may be sourced or generated; the brief forbids photography of
this company outright. Per `look.md` section 3 and `floor/buy.md`'s buy-with-no-photo
route, every visual element is drawn here, in original inline SVG, and recorded in
`ASSET-MANIFEST.md`. The run ships `--draft` for that reason alone.

## Nouns

Kernemåling. Borehul, drilled to 40% of the construction's depth. Adsorptionsaffugter,
kondensaffugter, sideblæser. Sideindblæsning i sandbælte, one hole per 1.2 m.
Afretningslag. Cementestrik, 50-70 mm. Slidlag i flydemørtel. RF% (trægulv under 65%,
klinker under 85%). CM% (cementestrik dry under 2.0). Håndholdt overflademåler, used
only to choose a borehul point, never as documentation. 16A gruppe, one dedicated
circuit per adsorptionsaffugter. Hver 7. døgn: dato, punkt, værdi. Terrændæk.
Skadenummer. Taksator. Kategori 3 spildevand. Hverdages varsel, 3 to 9. The 75 km
radius and the 40 km flat-rate ring, both centred on Vestre Havnevej 11, 7620 Lemvig.

## Theses

1. A measuring instrument that happens to also take a booking.
2. A map that decides who is even allowed to ask.
3. A logbook of a drying process, opened before day one exists.

## Case for the runner-up

For: 2

The area triage is not a footnote in this brief, it is named as the actual cost: a
måletekniker loses a quarter of an hour in the car for every call from outside the 75
km ring, and the brief's own opening problem statement puts the radius before the
price. A page organised as a map first would put "are you even in range" ahead of
everything else, including the instrument, and would make the thirty-second exit the
whole first screen rather than one fact on it. That is arguably the more honest
ordering of this brief's stated priorities: refusal before persuasion.

## Built

Built: 1, axis: what the page is organised around, because this company will not write down a number it has not measured itself, so the page has to read like it was built by people who take readings, not by people who write advertising, and a map-first page would serve the excluded 10% well while under-serving the 90% who still need the measured, staged process explained.

## Colour

- `--beton`: rgb(188, 187, 182), cured screed under a work light. Background: the page
  ground everywhere.
- `--overflade`: rgb(214, 213, 207), the drier top layer of the same slab. Surface: the
  form panel, the receipt panel, the price table's band.
- `--blaek`: rgb(35, 33, 30), grease-pencil ink a måletekniker writes a reading in.
  Foreground: body text, headings. Action: the one filled control's background.
  FocusRing: the outline every focusable element gets on both `--beton` and
  `--overflade`.
- `--papir`: rgb(224, 226, 231), the pale field on a measurement log, cool rather than
  warm so it reads as technical paper, not a premium-consumer cream (gate.mjs's
  palette check, `palette/premium-consumer-default`, flagged the original warmer
  value as 10 units from a named AI-tell ground; this value clears every entry in
  that list by at least 14). OnAction: text on the filled control. OnSurface pairs
  with `--blaek`, not `--papir`.
- `--graense`: rgb(140, 138, 132), a pencil line, not a rule from a kit. Border:
  hairline dividers, input borders at rest.
  `--toerret`: rgb(52, 110, 55), the green band on a moisture meter's face once a
  reading is dry enough to act on. Success: the small "inden for området" mark in the
  raekkevidde diagram only, never a large fill.
- `--fugtig`: rgb(150, 62, 38), the same meter's red band, still wet. Destructive: the
  two Fejl states' text and border, and the refusal-list marker. It never paints on the
  Tom state; nothing on this page is wrong until a visitor makes it so.

## Type

- display: "Space Grotesk", set for h1/h2, the instrument's own numbers and the nav
  wordmark. A geometric grotesk with a drawn-not-typeset character, closer to a
  stencilled site sign than to a magazine face.
- body: "Source Serif 4", set for running text, labels, legends, list items. A working
  serif with plain numerals, chosen so the display face is not fighting a second sans
  for the same job; the pairing most category pages reach for is the reverse of this.

## Density, motion and boldness

Density 6: this page carries more facts per screen than a typical marketing page on
purpose, because the brief's whole argument is that withholding a number is the thing
that costs a visitor a wasted evening. Motion 1: functionally none; the brief bans nothing
moving near money and the tone throughout is a company that does not perform urgency.
Boldness 5: bold in typographic scale and in the diagrams' commitment to real
technical drawing, never in colour or ornament.

## Structure

A numbered process list is used once, for the five real ordered steps between booking
and a finished floor, because that sequence is genuinely ordered and nothing else on
the page is. No eyebrows, no decorative dividers beyond the hairline `--graense` rule,
which marks an actual section change every time it appears, not a rhythm device.

## First screen

Owned by `.instrument`: a drawn cross-section of a floor construction with a borehul
through it, the 40%-depth measurement point marked, and the two live threshold values
(RF% and CM%) set as a label:value pair in the same type the rest of the page's facts
use. Beside it, the fiction disclaimer, the fugtgennemgang price, the 75 km limit and
the three refusals, all readable with nothing scrolled and nothing filled in.

## Imagery treatment

No photograph exists or may be implied. Every image is an original inline SVG drawn as
a technical instrument or plan: the borehul cross-section (signature) and the
raekkevidde radius diagram (second reading), both in `--blaek` line work on
`--overflade`, no raster, no gradient standing in for a material it is not.

## Argument order

Disclaimer and instrument first. Who this is for and the one action second. The
booking form third. What happens after booking, numbered, fourth. Full price table
fifth. Capacity and power honesty sixth. Rules and refusals seventh. What the company
does not know eighth, set in the instrument's own label:value type. The raekkevidde
diagram and the out-of-area detail ninth. Contact, hours and the repeated disclaimer in
the footer last.

## Signature

`.instrument`, the borehul cross-section. It is this trade's one unambiguous act: a
hole drilled to a stated depth, read against a stated threshold, before anything else
happens. Nobody adjacent to this trade has that specific drawing.

## Risk

Three refusal lists, an unknowns section spelled out in full, and a form that can fail
two ways before it succeeds once: on a category where every competitor page is
wall-to-wall reassurance, a page this willing to say no may read as smaller, less
confident, or simply unfinished, especially skimmed at 375px on a phone at 23:00.

## Answer to the risk

The risk above is answered by `.cta--book`, which repeats the one filled, unmistakable
commit control at the close of every major section, so however long the refusal lists
run, the one action a qualifying visitor came to take is never more than one section
away.

## Second reading

`.raekkevidde` renders the 75 km and 40 km rings from Vestre Havnevej 11, Lemvig, below
the first screen, from a different fact than the signature: not how a floor is
measured, but who the measurement is even offered to.

## The shell

Who: a husejer or skadebehandler with a wet floor, reading on a phone, often the same
evening the water arrived. Where: no physical place, a page read wherever the visitor
is standing when they look up the number. Do: book a fugtgennemgang via `.cta--book`,
repeated through the page, or self-exclude in under thirty seconds from the instrument
section's price, radius and refusals with nothing scrolled and nothing filled in.

## Assumptions

The brief specifies exactly one Fejl postnummer (2200) and gives no mechanism for the
general case. A form that only special-cases 2200 is not honest software: it would
pass the one written test and fail for every other out-of-area visitor, which is the
exact daily cost the brief opens with. The build computes an actual haversine distance
from Lemvig to a small table of real Danish postnummer/by coordinates, matched to the
input by nearest postnummer prefix when the exact code is not in the table, and
documents this as an approximation, not a claim of a licensed geocoding service. No
skadenummer format is given, so the field is free text, optional, and unvalidated
beyond length. No cap on "cirka antal m²" is given, so it is a plain positive number
input with no invented ceiling.

## Originality pass

Swap 1, same brief, a neighbouring business (a well-drilling firm 20 km away): the
borehul-as-signature survives, because it is this trade's real object, but the
five-step numbered process and the price table would not change shape at all, which is
about the category rather than this client, so the price table's band colour and the
process step count are revised to come from this client's own numbers (12 m² minimum,
9,800 kr minimum, the specific five actions this specific company performs) rather
than a generic three-step "book, we come, done" shape.

Swap 2, same plan, an unrelated trade on a different floor (a violin restorer):
does the shape still work, same colour count doing the same jobs, same kind of
signature, same closing move? A violin restorer has no equivalent of a 75 km refusal
radius or a documented electrical circuit requirement, so a page built from this plan
for that trade would have no raekkevidde diagram and no capacity/power section at
all, and its "signature" would have to be a different kind of drawn object entirely, a
tool or a repair rather than a threshold crossed. The shape does not transplant, which
is the point of the swap: what is left after both is specific to a trade that measures
before it acts and refuses work outside a stated line, not to "local tradesperson" in
general.

## One-offs
- `none` no literal length or shadow is written at a call site

## Deliberate
- `lopsided-band` this page is a left-aligned instrument/document reading order, not a centred marketing page: every heading, every list and the signature itself sit against the same left edge. gate.mjs's own scan found the booking form's copy of this pattern too, and that one was a real bug (an unnecessary 32rem cap on the inputs inside an already-bordered panel) and is fixed, not claimed. What remains, in the numbered process, the rules list, the unknowns list and the footer's contact column, is short, left-aligned, measure-capped prose sitting under a left-aligned heading; centring the text alone while the heading above it stays left-aligned would be the actual inconsistency.
- `one-layout` the price section (`.priser`) was given the page's only surface-toned
  band, `--overflade` with the table itself on a `--papir` sheet, specifically so it
  would not read as identical to the seven plain-ground sections around it, and it
  does not, to an eye reading the actual render. The hero and raekkevidde sections
  are genuinely two columns side by side at their declared widths, verified live at
  1440x900 (hero-intro 194-744px, hero-facts 826-1231px, same top). The checker's own
  column-detection requires a row's combined ink to cover 75% of the outer section's
  full width including its edge padding; both of those columns are deliberately
  capped at `var(--measure)` so their prose does not stretch past a readable line
  length, which is why the measurement falls short of that particular threshold even
  though the columns are real. Keeping the columns narrow enough to read is not
  something this build will trade away to clear a geometry proxy.
- `ragged-margin` every panel on this page (`.instrument`, `.hero-facts`, `#booking-form`, `.kvittering-kort`) uses the same border-plus-padding inset from its section edge, a single consistent device repeated four times, not an accidental one-off shift on the form alone. Plain text sections have no such panel and so nothing to compare their edge against; giving every section a matching bordered panel just to sit on one spine would erase the exact device that tells a panel apart from running text.
