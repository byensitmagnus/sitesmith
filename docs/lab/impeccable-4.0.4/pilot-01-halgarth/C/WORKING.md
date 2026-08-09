# Working notes — Halgarth Rotor Balancing direction

## 0. Deepening PRODUCT.md from the brief

PRODUCT.md is the thin index; the brief is where the real texture lives. Facts I'm
designing against that PRODUCT.md doesn't carry on its own:

- Two named people with two distinct trades under one roof: Ray Halgarth (balancing,
  welding) and Tomás Iriarte (grinding, machining, transport). Not "a team" — two men.
- The whole site exists to kill a 15-minute qualifying phone call. The visitor is
  standing next to a pulled rotor on a pallet, on a works phone, in a plant room.
- Three questions only: in scope? what does it cost? when back?
- Everything is dated off one fixed reference date (Mon 10 Aug 2026), not "today" —
  Tue 11 Aug (assessment), Mon 17 Aug (standard return), Wed 12 Aug (line-down return).
- Five required states are five separate static files under /book/, not client-side
  states — empty, slots-full, error (mass), error-atex, success.
- Hard refusals: ATEX/spark-resistant, in-situ, cracked hub (assessed + condemned +
  charged, not repaired), re-blading another shop's weld, unidentified coatings/asbestos
  without paid analysis.
- No photography exists or may be implied. No testimonials, star ratings, logos, ISO
  9001, ATEX competence, 24/7, or guaranteed outcomes may be invented.
- No cookie banner, no analytics, no privacy policy — because none of those exist for
  this firm. Inventing any of them is itself a truth violation, not a safe default.
- Fictional-business disclosure must be permanently visible at every viewport, never
  behind interaction.

## 1. Naming the mechanism (new-work.md §3, "create or replace the world", step 1)

**Unique mechanism, one sentence:** Halgarth measures exactly how far a spinning rotor
is out of true, removes precisely that much imbalance by hand-grinding, welding and
machine correction, and hands back a certificate proving the number before and the
number after.

**Audience's real scene:** a maintenance engineer or works fitter, phone in hand, next
to a pulled impeller on a pallet in a loud plant room, trying to self-qualify before
picking up the landline.

**Cultural home:** UK light-industrial subcontract engineering — goods-in tags, works
dockets, calibration certificates, machine data plates, ISO tolerance-grade charts,
toolroom surface plates and layout dye, tail-lift delivery paperwork. Trade-directory
territory, not SaaS territory.

**What this first surface must prove:** that a *specific* rotor either fits inside
Halgarth's *specific* limits or doesn't — self-service triage against hard numbers —
and, if it fits, the exact price and the exact date back, with nothing invented.

**The rut (excluded from the 7):** the generic "industrial services" template — stock
factory-floor photo hero (also independently banned by the brief), "Precision You Can
Trust" headline, three-icon "why choose us" grid, testimonial carousel, blue/orange
corporate palette, gear/cog icon, contact form bolted on at the bottom.

**The rut's predictable opposite (also excluded):** a shiny SaaS treatment applied to a
two-man shed business — gradient-mesh backgrounds, glassmorphic cards, big rounded
illustration of an abstract turbine, animated blob hero. Craft-floor bans (glass/blur
as decoration, gradient text) independently rule most of this out anyway.

## 2. Seven grounded candidates, ordered by resonance

Resonance = how hard the audience recognises the object *and* how completely it can
carry the measure/correct/prove mechanism across a whole site (nav, dense facts, a
12-field form, five required states) — not just a pretty hero.

1. **Calibration / balance certificate register** — ruled ledger, serial numbers,
   before/after unbalance table, stamped seal. Resonance: it is the literal object
   Halgarth hands back on every job; an insurance assessor in the audience has filed
   one. Carries hero, facts-as-ledger-entries, form-as-certificate-in-progress, and all
   five states (success = completed certificate; errors = a referred/circled line)
   cleanly. Material family: formal print / ruled ledger.
2. **Stamped data plate + prohibition pictogram** — rivet-holed brass/steel plate with
   embossed limits, paired with a plain "not permitted" mark for ATEX. Resonance:
   bolted to every fan casing this audience already owns. Strong for read-only facts,
   weaker for a 12-field data-entry form (plates display, they don't collect). Material
   family: engraved/stamped metal + pictogram.
3. **Go/no-go gauge & snap-gauge rack** — a machinist's binary pass/fail ring gauge.
   Resonance: shop-floor shorthand for "does it fit our limit," a near-literal reading
   of the self-triage task. Weaker at representing pricing or the certificate output.
   Material family: precision tool-steel gauge.
4. **Balancing-machine amplitude & phase dial** — twin analog dials, needle sweeping to
   a zero-arc, strobe tick. Resonance: it's the actual machine in the workshop; strong
   hero drama ("shaking" becoming "true"). Weak as an input-form language (dials read
   out, they don't take twelve typed fields) and shares its material family with
   Challenger 5 below, so building it invites exactly the confusion the roll exists to
   avoid. Material family: analog instrument gauge.
5. **ISO G-grade tolerance chart** — log-log chart, diagonal grade lines (G6.3, G2.5), a
   plotted point. Resonance: the exact standard named in the brief, but reading a
   log-log chart at a glance on a works phone asks more of the visitor than the page
   can afford. Material family: technical chart / graph paper.
6. **Goods-in travel tag** — carbon-copy string tag, perforated stub, hand-stamped
   IN/OUT and date. Resonance: universal receiving paperwork in this trade; good for
   the form's twelve fields as tag lines, weak for dramatizing the measure/correct
   drama itself or for holding a full price schedule. Material family: carbon-copy tag.
7. **Surface plate + engineer's blue marking dye + scribed lines** — a precision-ground
   inspection table smeared with marking compound; a straightedge or scriber reveals
   true against not-true in bright contrast. Resonance: less universally hands-on than
   a goods-in tag (more toolroom-specific), but the material itself *is* "true vs not
   true" made visible, which is the whole business. The plate's own T-slot/witness-mark
   grid gives an honest, non-generic structural system for a whole site — hero ground,
   fact panels, a ruled form, and five states as stages of one layout job. Material
   family: machinist bench / scribed steel.

Material-family spread check: formal print, stamped metal, tool-steel gauge, analog
dial, chart/graph, carbon-copy tag, scribed bench — seven candidates, six distinct
families (dial and the closest challenger share one, noted above). Well past the
three-family floor.

## 3. Assigned index

**ASSIGNED INDEX: 7** (from SEED.txt, key `17ccb1bc`). Build candidate 7 of the list
above: **surface plate + engineer's blue marking dye + scribed lines.**

This is deliberately my *lowest*-resonance pick, not my first choice — which is the
seed's whole point (refuse the model's own ranking rut). Checked seriously against
"every direction the roll can land on must already be viable": does it hold at full
surface scale?

- Hero: plate ground + scribed headline + a small inset "rating plate" strip carrying
  the three hard limits. Works.
- Dense facts (prices, rules, refusals): a ruled/scribed schedule on a paler plate-steel
  inset — this is exactly what dense technical data on a marking-out table looks like.
  Works.
- The 12-field form: fields as scribed layout lines with witness-mark dots; the three
  numeric fields (mass, diameter, journal spacing) get a literal scale-ruler with the
  limit scribed as a stop-line — the mechanism made into the input pattern itself, not
  fought against it. Works, and works *better* than several higher-resonance candidates
  which are read-only registers.
- Five states: chalk note (slots-full), red stamp mark on the offending line (errors,
  focus landed via plain HTML `autofocus` on the pre-rendered page — no JS required),
  completed layout stamped with the job reference (success). Works.
- No photography implied anywhere; the whole world is flat scribed/stamped graphic
  material, which sidesteps the brief's photography ban entirely rather than fighting
  it.

No factual failure found. Proceeding to build it, not re-rolling on taste.

## 4. Challengers — fused and weighed on audience identification × product clarity

Per new-work.md: fuse the challenger's *form and system grammar* onto Halgarth's
*facts*, then weigh on exactly two axes. A fused challenger that wins **both** axes
becomes the build instead of the assignment.

**1. eBoy pixorama metropolis** (isometric pixel-art city, zoomable, hidden jokes).
Fused: pixel-art isometric workshop block, tiny pixel Ray/Tomás, zoom-to-discover.
- Identification: low. Candy-saturated, playful, exploratory register is the opposite
  of a time-pressured works-phone triage; actively undercuts trust for the insurance-
  assessor persona in the audience.
- Clarity: low. Spatial/exploratory grid does not hold a dense pass/fail form; visitor
  has to hunt for what a plain page would hand them in one glance.
- Verdict: loses both axes. Fuses poorly because the whole grammar rewards *exploring*,
  and this page's job is letting someone leave in under a minute.

**2. Backyard loteria night** (carnival card deck, tabla grids, beans, multiplayer call).
Fused: rotor-facts as icon cards, form fields as tabla cells.
- Identification: low. Festive, communal-game register with no relationship to UK
  industrial trades.
- Clarity: low. Card/tabla topology has no natural mapping onto sequential form-filling
  or numeric limit-checking; multiplayer sync is irrelevant to a solo booking task.
- Verdict: loses both axes decisively.

**3. Sleeping city fold** (surreal dream-quilt city, folding streets, embroidered stars).
Fused: night-navy dreaming plant, facts as folded districts.
- Identification: low. Poetic/whimsical register fights the brief's plainness and
  urgency outright.
- Clarity: low. Deformable dream geometry has no honest mapping onto hard numeric
  limits or tolerance grades; would be decoration wearing the product's clothes.
- Verdict: loses both axes decisively.

**4. Paper folds / orizuru crane sequence** (vermilion washi, 32 numbered folds, discrete
recoverable states).
Fused: booking flow as a numbered fold sequence; turnaround days as fold steps.
- Identification: low. Washi/kanji/sumi-ink craft register has zero connection to a
  Kilnhurst engineering shed — would read as costume, not identity.
- Clarity: moderate, but only for one sliver: numbered discrete steps do echo the
  form's field order and the day-1-to-day-5 turnaround count. That structural idea
  doesn't need this challenger's material to work — any numbered list can do it.
- Verdict: loses identification badly; the one real strength (numbered states) isn't
  exclusive to this challenger, so it doesn't carry the fusion. Not a contender.

**5. Night-flight instrument six-pack** (matte-black panel, luminous dials, damped
needles, fixed cross-check reading order). **Closest challenger — weighed seriously.**
Fused: facts panel as six gauges (capability, price, time, rules...), needle pinned
into a red arc for a refusal.
- Identification: moderate-to-high. Analog dial gauges are genuinely native to this
  audience's daily environment (pressure gauges, tachometers on shop plant), arguably
  on par with or slightly ahead of the assigned plate/dye world on sheer recognisability
  — though the *specific* source frame is a pilot's night-flight trust-through-cloud
  drama, which belongs to aviation, not a fitter; stripping that frame to fit the plant
  leaves a generic "gauge panel," which is its own well-worn industrial-website cliché.
- Clarity: loses. The six-pack's grammar is read-out native — fixed dials, each owning
  one static truth. Halgarth's core task is a 12-field *data-entry* form, and the brief
  requires it fully usable with JavaScript disabled, keyboard-only. Forcing typed input
  through a dial-setting metaphor is a poor, custom-widget-heavy pattern that fights
  that constraint directly; the assigned world's plain scribed input lines don't have
  this problem.
- Verdict: does not win both axes — ties or narrowly leads on identification, loses
  clearly on clarity because of the input-form mismatch. Named as the strongest
  alternate, not adopted.

**6. Dial-up BBS ANSI nightboard** (CP437 block chars, 16-colour terminal, numbered
menu lines, streamed reveal).
Fused: site as a numbered-menu text terminal; form fields as numbered prompts.
- Identification: low. Retro-modem nostalgia is a specific hobbyist niche with no tie
  to fan-impeller maintenance trades; risks reading as a hacker/prank page to an
  assessor who needs to trust it.
- Clarity: moderate on one axis only — numbered menu lines are genuinely keyboard-
  native and echo the 12 numbered fields — but the blinking-presence, green-phosphor
  character fights the calm, plain register the brief's exact error/success copy
  requires, and there's no honest way to show a rating-plate limit inside a pure
  character grid without breaking it.
- Verdict: loses identification badly; the keyboard-native structural idea is real but
  doesn't need this challenger's costume to exist. Not a contender.

## 5. Conclusion

None of the six dealt challengers wins both axes against the assignment. The night-
flight six-pack is the one serious contest — plausible identification, but it loses
clearly on product clarity because its native grammar is read-out, not data-entry, and
this product's one required action is a twelve-field form that must work with
JavaScript off. Assigned candidate 7 — surface plate, engineer's blue, scribed lines —
stands as the build. It is also checked against the rut and its opposite (§1) and
matches neither.

Built direction written to DIRECTION.md.
