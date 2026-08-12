# Damgaard Estrik

Five tradesmen who dry out water-damaged floor constructions, measure their way to knowing
when they are dry, and lay a new levelling layer or new screed once they are. For homeowners
and claims handlers who need the water out of a floor without guessing, in Lemvig and within
75 km of it. The site's single job: book a moisture inspection (fugtgennemgang), and turn
away everyone outside the 75 km radius or with category-3 sewage water in under thirty
seconds, without a phone call either way.

Fictional company, built as a construction exercise. The page itself must carry a visible,
permanent, unconditional line saying so — not behind a button, dialog or disclosure, readable
at every width.

## The subject's world

Kernemåling (core measurement, taken in a borehul at 40% of the construction's depth).
Borehul. Adsorptionsaffugter, kondensaffugter, sideblæser. Sideindblæsning i sandbælte —
one borehul per 1.2 m. Afretningslag, cementestrik (50-70mm), slidlag i flydemørtel. RF%
(relativ fugtighed — trægulv under 65%, klinker under 85%). CM% (cementestrik regnes tør
under 2,0). 16A gruppe, dokumenteret, one per adsorptionsaffugter. Håndholdt overflademåler
— used only to choose borehul points, never as documentation. Terrændæk. Skadenummer.
Taksator. Skadebehandler. Hverdages varsel (3 to 9 hverdage). Kategori 3 spildevand.
Kontrolmåling. m² berørt. Sagsnummer.

The measuring instrument and the borehul are this trade's real material: they do not repair
a floor, they measure one until a number crosses a threshold, then they act. Nothing is
declared dry on sight.

## Facts

The only facts. Nothing else may be stated as true on the page. Anything missing is asked
for, or the sentence is cut. Verbatim from BRIEF.md, the client-supplied and sealed brief at
the project root.

**The company**

- Damgaard Estrik ApS, CVR 41 55 08 12, stiftet 2016.
- Vestre Havnevej 11, 7620 Lemvig.
- Five employees: Jens Damgaard (owner), two måleteknikere, two estriklæggere.
- Phone 97 00 41 20, answered Monday to Friday 07:00-14:00.
- On-site working hours: Monday to Thursday 06:30-15:00, Friday 06:30-12:00.
- No night shift, no weekend shift.
- Service area: 75 km from Lemvig. Callout 14 kr/km beyond the first 40 km.

**Equipment and capacity**

- 2 adsorptionsaffugtere at 900 m3/h, 12 kondensaffugtere, 40 sideblæsere.
- Maximum 3 simultaneous job sites. A fourth is refused, with a date for when there is room.
- Each adsorptionsaffugter needs its own documented 16A group. No documented power, no
  machine set up.

**Prices, excl. moms (VAT)**

- Fugtgennemgang with kernemåling in a borehul: 2,400 kr. Deducted from orders over
  15,000 kr.
- Affugtning per room per døgn: 285 kr.
- Sideindblæsning i sandbælte, per borehul: 620 kr. One hole bored per 1.2 m.
- Opbrydning og ny cementestrik, 50-70mm: 985 kr/m2.
- Slidlag i flydemørtel: 420 kr/m2.
- Kontrolmåling undervejs, per visit: 950 kr.
- Minimum job 12 m2. Minimum price 9,800 kr.
- Payment: the insurer is billed directly once a skadenummer exists. Otherwise private
  payment, 8 days net.

**Times and measurements**

- A drying process typically takes 18 to 45 døgn.
- Measured every 7th døgn, each one logged with date, point and value.
- Kernemåling is taken in a borehul at 40% of the construction's depth.
- Trægulv is laid only once the construction measures under 65% RF.
- Klinker is laid only under 85% RF.
- Cementestrik counts as dry under 2.0 CM%.
- Håndholdt overflademåler is used only to choose borehul points. Never used as
  documentation, its numbers never appear in the report.
- Fugtgennemgang is typically booked 3 to 9 hverdage out.

**Rules for every job**

- They do not dry a floor they have not measured themselves first.
- Power access and room access are required for the whole process.
- The customer must not switch off affugtere or blæsere mid-process. If switched off, the
  process restarts from the beginning and the døgnpris still runs.
- No new floor is laid before the measured values are reached, whatever the customer wants.

**What they refuse**

- They do not touch damage involving kloakvand or other kategori-3 spildevand. Referred
  onward the same day.
- They do not touch floor coverings or adhesive from before 1990 without an asbestos/PCB
  analysis, ordered and paid for by the customer.
- No mould remediation, and no statement on mould.
- No electrical, plumbing or underfloor-heating-pipe work, and they do not fix the leak
  that caused the damage.
- No guarantee that an existing wooden floor can be saved, and no job where payment depends
  on that succeeding.

**What they do not know**

- They cannot say before measuring how far the water has reached into the insulation or
  under partition walls. The first measurement is the first time they know too.
- They do not know if there is mould. Samples go to a lab, billed directly to the customer;
  Damgaard does not interpret the result.
- They cannot say whether insurance covers it. That is the taksator's call, not theirs.
- They cannot say in advance whether a process will take 18 or 45 døgn.

## Constraints

- Stack: Next.js, App Router. The booking form is handled by a server action. No database —
  submissions are appended to a log file. The page must make sense with no client-side
  JavaScript, and the three required states must be reachable as routes so they can be
  reviewed directly.
- Widths 320px to 1440px, no horizontal scroll anywhere in that range. Assume most readers
  are on a phone, in the evening.
- Full keyboard reachability, sensible order, visible focus. On error, focus moves to the
  field that raised it.
- `prefers-reduced-motion: reduce` removes animation and transition entirely, not just
  shortens them.
- No photography exists of this company at all — not the crew, vans, machines, a damage
  site or a finished floor. No stock photography of water damage or tradespeople either,
  and nothing on the page may imply photos of this company exist.
- Never claimed: night or weekend call-out, insurer partnership or approval, any
  certification/authorisation/membership, experience in case counts or years beyond
  "stiftet 2016", mould competence, any guarantee (drying time, floor survival, insurance
  coverage), reviews/testimonials/stars — none exist and none may be invented.
- No cookie banner, no analytics, no third-party scripts. No cookies are set, so nothing
  needs consent.
- Language: Danish, du-form. Every price shown excl. moms, labelled as such at every
  place it appears. Correct æ, ø, å throughout.
