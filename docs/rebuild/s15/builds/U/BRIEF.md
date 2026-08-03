# BRIEF — Klinke & Datter

> Written from `docs/rebuild/s15/BRIEF.md` (the sealed holdout brief). Every fact below is
> traceable to that file. Nothing else on this site is stated as true.
> `(C)` — AI-generated working document.

## 1. Business goal and primary action

Klinke & Datter need the phone to ring from people who have inherited a pneumatic player
piano and do not know whether it is worth saving, because the assessment is the only door
into a restoration and they will not quote without it.

**The visitor's action: ring 66 12 47 09 and book a tilstandsvurdering.**

Secondary actions, and they look secondary: read what the five common failures are, read what
the assessment costs, find the workshop address and opening hours, read that music rolls are
cut and what one costs.

There is no form. The brief gives a phone number and workshop hours and nothing else to
submit to; inventing an email address or a booking form would be inventing a fact.

## 2. Audience and brand direction

A one-page marketing site, in Danish, for a private person in their forties to seventies who
has inherited an instrument in an unknown state, believes it is probably beyond help and
suspects that asking will be expensive. The visual language is the instrument's own paper and
ink: buff roll paper, punched slots, a drawn cross-section, warm near-black type. It belongs
to the family of workshop documents — a parts drawing and a written report — not to the
family of local-trade landing pages.

What the page would lose if the accent were a different hue: the felt red is the one colour
inside a piano action that is not wood, iron or leather, and it is what the eye already reads
as *inside the instrument*. Swapped for a blue, the page becomes a service company with a
brand colour; the punched band becomes decoration rather than the same material as the
product they sell.

### The three dials

| Dial | Value | Why |
| --- | --- | --- |
| `visual-density` | 4 | The reader is anxious and non-technical, and the page has five failure names and three prices to land. Open enough that each point is separate, dense enough that it reads as a workshop document rather than a poster. |
| `motion-intensity` | 2 | Two people in a workshop with a four-instrument queue. One short entrance on the first screen, state feedback everywhere else, nothing choreographed. Movement would undercut the only thing the page is selling, which is soberness. |
| `aesthetic-boldness` | 7 | The controlled risk is committing the whole page to one device — a perforated roll band that runs the length of it and carries the section numbers. It is unusual, it is not decoration, and no other trade could use it. |

## 3. Sitemap and information hierarchy

One page. Nothing is two clicks away, because the brief asks for one page and there is not
enough sourced material for a second.

The three things that matter most, in order:

1. What these two people do, and to which instruments.
2. What it costs to find out whether yours can be saved — 1.850 kr., half a day, at your home,
   with a written report either way.
3. How to start — the phone number, and when it is answered.

In-page navigation goes to five anchors: Arbejdet, Fejlene, De to, Priser, Kontakt. The
primary action sits in the header at every width and is repeated once at the end.

## 4. Content and asset plan

Copy: written here, in Danish, from the sealed brief only. No customer names, no
testimonials, no review scores, no counts of instruments restored — the brief forbids all
four, and the page is built so that it does not want them.

Numbers on the page, and their source, all from the sealed brief: 1.850 kr. (assessment),
340 kr. (one roll), 38 (titles in stock), 4–9 måneder (restoration), 4 (instruments at a
time), 1981 and 2011 (Verner and Liv), 66 12 47 09, 09:00–16:00 tirsdag–torsdag, Havnegade
22, 5000 Odense C.

Assets: no photography exists and none can be made. See `ASSET-PLAN.md` for what each drawn
thing carries and `ASSET-MANIFEST.md` for its state. The direction is diagram- and
object-led on drawn material; the page carries no `<img>` at all, and the two visual assets
are inline SVG plus one CSS-drawn band.

## 5. Page inventory

| Page | Purpose | Primary action | Blocks |
| --- | --- | --- | --- |
| `index.html` | A person with an inherited player piano understands what Klinke & Datter do, what an assessment costs, and how to start | Ring 66 12 47 09 | masthead (mark + anchor nav + call action), roll-rail, hero-statement, problem-band, mechanism (SVG section + five disclosures), people-band, price-plate, contact-close, footer |

## 6. Definition of done for this project

- Renders and is read at 375, 768 and 1440, and again at a 20 % wider font.
- axe clean in both colour schemes; no horizontal document scroll at 375.
- Every number traces to a line in the sealed brief; nothing else is asserted.
- The five failure names appear with the words the brief uses.
- The primary action completes from the keyboard alone, and the five disclosures open and
  close from the keyboard.
- No `<img>`, no external JS, one HTML file.
- Signed off by: whoever seals the holdout run.
