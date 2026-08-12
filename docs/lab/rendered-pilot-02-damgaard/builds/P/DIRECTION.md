# Direction — Damgaard Estrik

> Scope note: this is a single-agent build against a sealed benchmark brief, not a
> multi-day studio process. I reasoned through three structurally different candidates
> below and scored them against the brief before building, but I did not render three
> throwaway HTML comps or run them through `direction-check.mjs` / `direction-history.mjs`
> — both write outside the assigned workspace directory (the latter to a cross-project
> ledger at `~/.sitesmith/`), which the task explicitly restricts. The scoring and the
> rejection reasons below are real; the comps themselves are not separate files.

## The three visible dials

- **visual-density: 4** — the audience reads this at night, anxious, on a phone. Low
  density, generous space between the argument's steps. Not a 1: there is real tabular
  content (a price list, a measurement table) that earns tighter spacing locally.
- **motion-intensity: 2** — near-static. The reader is not here to be impressed; a
  technician who explicitly won't run equipment unattended and won't promise a drying time
  is not a business that should feel kinetic. One quiet entrance on the hero, nothing else.
- **aesthetic-boldness: 6** — bold in structure (an instrument/measurement visual language
  instead of a trades-site template), restrained in colour and ornament. The boldness is in
  what the page is built from, not in how loud it is.

## Candidates considered

**A — Instrument/measurement register (chosen).** First screen is the words plus one drawn
diagram, not a photograph or an icon grid. Numbers throughout are set as read values, not
as decoration. The site's argument is literally "we measure before we do anything," so the
strongest true material is the measuring itself, drawn.

**B — Document/dossier register.** The page as a stack of paper: a written overslag, a form,
a receipt, rendered as literal paper sheets with drop shadows and a rubber-stamp motif for
the case number. Scored well on distinctiveness, lost on maintainability and on the brief's
own request for a page that "kan gennemses uden at ringe" in under thirty seconds — a
skeuomorphic paper metaphor adds visual noise between the reader and the one fact they need
(are they inside 75 km), and the "rubber stamp" idiom risks reading as informal/cute for a
company that explicitly gives no guarantees.

**C — Blueprint/plan register.** Dark, cyan-line technical-drawing ground throughout, like
an architectural plan. Strong signature, but the whole site living on a dark ground fights
the brief's own instruction to design for someone reading in a hurry at night — a dark UI a
stressed reader has to squint at to find a phone number is worse, not more serious. Kept the
underlying idea (line-drawn diagrams) and dropped the all-dark ground; that graft is why
Candidate A's diagrams are technical-drawing line art rather than icon illustrations.

**Scoring (5 criteria from `20-direction-lab.md`, 1–5 each, higher wins)**

| | Comes from the subject | Serves the primary action | Buildable now | Avoids anti-refs | Defensible signature |
|---|---|---|---|---|---|
| A | 5 | 5 | 5 | 5 | 5 |
| B | 4 | 3 | 3 | 4 | 4 |
| C | 4 | 2 | 4 | 5 | 4 |

A wins outright. Graft taken from C: line-drawn technical diagrams instead of any
illustrative icon set.

## Axis record

- direction-version: 2.3
- composition: the words and one drawn measurement diagram, side by side above the fold; no photograph, no icon grid, no stock illustration
- type: IBM Plex Sans Condensed display over IBM Plex Sans body, with figures set in IBM Plex Mono
- colour: warm paper ground, one amber/ochre accent reserved for the primary action and for a value that has not yet cleared its threshold
- imagery: deliberately imageless, diagram-led — three line-drawn technical diagrams (borehole depth, drying timeline against thresholds, service-area radius), same stroke weight and colour logic throughout
- rhythm: open space between argument sections; a hairline rule appears only inside a table or a diagram, where a number is being read or compared

- surface: open space as the primary separator, hairline rules confined to tables and diagrams — a technical drawing's construction line appears where a value is being read, not between sections generally
- labels: sentence-case labels in the body face for navigation and section eyebrows; the mono face is reserved for figures and reference codes (prices, percentages, dates-as-logged, the case number, the CVR number) — not a blanket uppercase-mono house style
- figures: functional tabular — mono, tabular-nums, used specifically where a number is measured, priced or compared (the price list, the threshold table, the log); a number inside a sentence stays in the body face
- depth: flat, with one deliberate exception — the booking confirmation is the one surface that lifts slightly, because it is the one thing on the site meant to read as a kept record rather than an argument

- visual-density: 4
- motion-intensity: 2
- aesthetic-boldness: 6

- signature-selector: [data-diagram]
- signature-min-share: 20

## Signature

The one thing a visitor would recognise on a second page with the logo removed: every
number that has been measured, priced, logged or dated is set in mono tabular figures, and
the three facts that most determine whether someone should bother reading further — the
borehole depth rule, the drying timeline against its thresholds, the 75 km / 40 km service
radius — are drawn as plain technical diagrams instead of illustrated, photographed or left
as a bullet list. The page reads like something a measuring company would actually produce,
not like a trades-site template with this company's name typed into it.
