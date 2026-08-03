# Run manifest

Written by `sitesmith build`. It resolves what a command can resolve and names what
the agent does next. It is not a plan: the plan is the direction record.

- surface: **buy**
- stack: **astro**, adapter `stacks/astro.md` (detected)
- brief: `.\BRIEF.md`

## Knowledge Index

Building blocks, not a template. They go through the subject, thesis, autopilot,
swap and originality flow before anything is built. The full text is here so the
corpus itself stays outside the read manifest.

### `pat-configurator-prices-from-the-buyers-own-numbers`  (0.468)

- **job**: Let a buyer price a made-to-measure or configured product from measurements and options they already hold, before contacting anyone
- **problem**: A made-to-order trade hides price behind call for a quote, so the buyer rings, describes the job badly, and is told a number they cannot check against anything
- **works when**: The price is a function of inputs the buyer can supply without expertise: dimensions, a material choice, a quantity, a delivery choice
- **avoid when**: The price genuinely needs a survey, a site visit or a drawing, in which case the page states what the visit decides rather than faking a total
- **mechanism**: Put the configurator where the object is, not on a separate quote page, and carry the running total from the first input rather than revealing it at the end. Compute in the browser so the figure answers inside a tenth of a second and needs no network. Every input names the trade's own unit and says how to take it. The total states its own arithmetic, area or quantity and rate, so the buyer can check it against the price list on the same page. The result is a written specification the seller can work from, and it says plainly what is and is not being charged at that moment.
- risk: A total that animates or recalculates visibly reads as a slot machine near money
- risk: Rounding that is not stated, so the buyer's arithmetic and the page's disagree by a krone
- risk: Hiding the rate so the total cannot be checked, which converts a calculator into a quote
- mobile: Numeric inputs use inputmode numeric so the phone keypad appears
- mobile: The running total stays visible while the fields are filled, docked or repeated, never only above the fold
- mobile: Field labels and their units sit on one line at 375 or the unit moves into the field's own hint
- accessibility: The total is announced with role=status when it changes, so it is not a silent visual update
- accessibility: Every validation message sits on the field that caused it and is referenced by aria-describedby
- accessibility: The whole configurator completes on the keyboard alone with a visible indicator at each stop
- genericness risk: medium

### `cro-no-invented-urgency`  (0.376)

- **job**: Decide what to do when the brief has no scarcity, stock pressure or countdown to show
- **problem**: A page feels flat without urgency, so a counter, a low-stock badge or a limited-run line gets added from nothing, and it is a claim the customer can hold the business to
- **works when**: Every commerce build where real scarcity data does not exist
- **avoid when**: Real, current scarcity exists and is readable from the client's own system, where stating it is honest
- **mechanism**: If it is not in the brief or the evidence, it does not go on the page, not as a placeholder and not as a plausible example. When the sentence is needed and the fact is missing, ask for it or cut the sentence. A page with no scarcity claim is honest and an invented one is not. Voice is yours to invent, facts are not.
- risk: Treating a plausible number as a placeholder that someone will replace later, which nobody does
- risk: Softening the invention into a vague phrase, which is the same claim with less to check
- mobile: No mobile-specific exception; a badge that only appears at 375px is the same invention
- accessibility: A real scarcity statement is text with its as-of time, not a colour or an animated counter
- genericness risk: low

### `evi-a-claim-needs-a-source`  (0.367)

- **job**: Decide whether a sentence on the page is allowed to be there
- **problem**: Delivery times, guarantees, capabilities and how the trade works are written because they read as helpful, and each of them is something a customer will hold the business to
- **works when**: Every sentence on every page, applied as a test rather than as a list of obvious cases
- **avoid when**: Never; voice is yours to invent, facts are not
- **mechanism**: If a reader could act on it, or hold the client to it, it is a claim. Ask that question of every sentence before it ships. The obvious cases are numbers, guarantees, delivery times, certifications and testimonials. The ones that get through are quieter: what the customer may do while they wait, what a document contains, what is enough to get started, and how the trade itself works. If it is not in the brief or the evidence it does not go on the page, not as a placeholder and not as a plausible example.
- risk: Marking an invented sentence as a placeholder, which nobody replaces
- risk: Softening the claim into a vaguer sentence, which is the same claim with less to check
- mobile: No mobile exception; a claim that only appears at one width is still a claim
- accessibility: A claim's supporting figure is text, not an image of text, so it can be read out and enlarged
- genericness risk: low


## Read, in this order

- `<skill>/SKILL.md`
- `<skill>/run.md`
- `<skill>/look.md`
- `<skill>/floor/buy.md`
- `<skill>/stacks/astro.md`
- `<skill>/verify.md`

## Write

- `.sitesmith/direction.md`
- `the site itself, in the detected stack`
- `ASSET-MANIFEST.md`
- `PRODUCTION-REPORT.md`
- `journeys/*.spec.mjs`

## Commands

- **direction**: `node C:\Users\Usmo1\Documents\sitesmith-pilot\sitesmith\scripts\ledger.mjs new . buy`
- **verify**: `node C:\Users\Usmo1\Documents\sitesmith-pilot\sitesmith\scripts\verify.mjs <url-or-dir>`
- **critiquePacket**: `node C:\Users\Usmo1\Documents\sitesmith-pilot\sitesmith\scripts\critique.mjs packet`
- **critiqueLock**: `node C:\Users\Usmo1\Documents\sitesmith-pilot\sitesmith\scripts\critique.mjs lock --file <answers.md>`
- **journey**: `node C:\Users\Usmo1\Documents\sitesmith-pilot\sitesmith\scripts\journey.mjs journeys --base <url>`
- **gate**: `node C:\Users\Usmo1\Documents\sitesmith-pilot\sitesmith\scripts\gate.mjs`

## Blockers

- none

## Next

build from the direction record, then verify, critique, journey, gate
