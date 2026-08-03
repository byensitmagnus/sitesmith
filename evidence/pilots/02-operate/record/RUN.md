# Run manifest

Written by `sitesmith build`. It resolves what a command can resolve and names what
the agent does next. It is not a plan: the plan is the direction record.

- surface: **operate**
- stack: **astro**, adapter `stacks/astro.md` (declared in the brief; nothing is built yet to detect)
- brief: `./BRIEF.md`

## Knowledge Index

Building blocks, not a template. They go through the subject, thesis, autopilot,
swap and originality flow before anything is built. The full text is here so the
corpus itself stays outside the read manifest.

### `mot-motion-reports-state-not-scroll`  (0.779)

- **job**: Use motion on an operating surface without disturbing someone doing work
- **problem**: A console animates on scroll and on refresh, so a person reading a column of figures has the column move under them
- **works when**: Any surface someone works in for a sustained period
- **avoid when**: Never on an operating surface; entertainment motion belongs on other surfaces
- **mechanism**: Motion reports state changes only, never scroll, and it stops while anyone is typing or counting. A row that has changed may mark itself in place; the listing around it stays still. A wait past a tenth of a second is acknowledged locally rather than by blanking the surface.
- risk: A live-updating list reordering itself under the pointer, which turns a click into the wrong click
- risk: Marking every update, so the mark stops meaning anything
- mobile: At 375px an in-place mark competes with less space; prefer a word in the row over a coloured flash
- accessibility: A change announced through a polite live region, never an assertive one, unless it is an error
- accessibility: Reduced motion removes the mark's animation and leaves the changed value and its label
- genericness risk: low

### `srf-operate-fit-one-working-unit`  (0.767)

- **job**: Design a console, dashboard or admin screen someone works in all day
- **problem**: The screen is argued from dashboard conventions rather than from the work, so a dispatcher watching six things and a clerk working one record get the same layout
- **works when**: The visitor operates rather than decides: monitoring, dispatching, reconciling, editing records, running a shift
- **avoid when**: A marketing page that shows a screenshot of a tool; that page is a read or buy surface, not an operate one
- **mechanism**: Name the job's working unit first, a shift's rows or a round's stops, and fit one whole unit on screen. Measurements follow from the unit rather than from a grid you picked. Within a second the operator knows the object, its state, and the number that decides urgency. What needs deciding sorts to the top, because a screen showing everything equally has sorted nothing.
- risk: Curating a subset for the operator instead of giving them filters they control
- risk: Sorting by recency because it is easy, when urgency is the axis the job actually runs on
- mobile: If the working unit cannot fit at 375px, say which unit was split and why, rather than reflowing silently into a card list
- mobile: Compared figures keep their position across widths so a column comparison does not become a stack
- accessibility: Every grid, scroll region and destination is reachable by key, and the key is shown on screen
- accessibility: A region with no focusable child passes a naive focus check and reaches nobody, so check the child, not the region
- genericness risk: low

### `lay-form-states-are-decided-before-they-are-built`  (0.74)

- **job**: Have every state a form can be in exist, be reachable, and be understood without colour
- **problem**: Empty, loading, partial, error and success are written down as a requirement and built as an afterthought, so the empty state is a zero, the error is a red border with no message, and the success state is the form again with the fields cleared.
- **works when**: Anything the visitor types into, chooses from, or waits for
- **avoid when**: A page with nothing to operate, which should say so rather than inventing a control
- **mechanism**: Decide each state before implementation and say what changes and what carries it besides colour. Empty says what it will show rather than zero. Loading holds the shape of the answer so nothing jumps. Error sits on the field that caused it and names the value and the limit. Success is the thing the visitor came for, not a confirmation that a form was submitted.
- risk: One error region at the top of the form, which is a summary and not an error on the field that caused it
- risk: A disabled submit button as the whole validation story, which tells a visitor nothing about what is wrong
- mobile: An error message under a field must not be hidden behind the on-screen keyboard; scroll it into view
- mobile: Do not rely on hover for anything a state depends on
- accessibility: The message is programmatically associated with its field, and the field is marked invalid
- accessibility: A state change is announced once, and not on every keystroke
- accessibility: Colour alone is not a state: a border that thickens, a mark, or a weight change carries it too
- genericness risk: low


## Read, in this order

- `<skill>/SKILL.md`
- `<skill>/run.md`
- `<skill>/look.md`
- `<skill>/floor/operate.md`
- `<skill>/stacks/astro.md`
- `<skill>/contract.md`
- `<skill>/verify.md`

## Write

- `.sitesmith/direction.md`
- `.sitesmith/contract.json`
- `the site itself, in the detected stack`
- `ASSET-MANIFEST.md`
- `PRODUCTION-REPORT.md`
- `journeys/*.spec.mjs`

## Commands

- **direction**: `node <skill>/scripts/ledger.mjs new . operate`
- **contract**: `node <skill>/scripts/contract.mjs new operate`
- **contractCheck**: `node <skill>/scripts/contract.mjs check --write`
- **contractCompare**: `node <skill>/scripts/contract.mjs compare --url <url> --write`
- **verify**: `node <skill>/scripts/verify.mjs <url-or-dir>`
- **critiquePacket**: `node <skill>/scripts/critique.mjs packet`
- **critiqueLock**: `node <skill>/scripts/critique.mjs lock --file <answers.md>`
- **journey**: `node <skill>/scripts/journey.mjs journeys --base <url>`
- **gate**: `node <skill>/scripts/gate.mjs`

## Blockers

- none

## Next

build from the direction record, then verify, critique, journey, gate
