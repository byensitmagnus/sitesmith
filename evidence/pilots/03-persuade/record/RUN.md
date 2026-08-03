# Run manifest

Written by `sitesmith build`. It resolves what a command can resolve and names what
the agent does next. It is not a plan: the plan is the direction record.

- surface: **read**
- stack: **astro**, adapter `stacks/astro.md` (detected)
- brief: `./BRIEF.md`

## Knowledge Index

Building blocks, not a template. They go through the subject, thesis, autopilot,
swap and originality flow before anything is built. The full text is here so the
corpus itself stays outside the read manifest.

### `evi-asset-provenance-ladder`  (0.719)

- **job**: Decide where each visual on the page comes from before writing any code
- **problem**: Images are chosen while building, so licences are never recorded and a drawing gets used for a thing that could simply have been photographed
- **works when**: Every build, written as a table before the first line of code
- **avoid when**: Never; a page with no assets still records that decision
- **mechanism**: List every visual element with what it contributes, its source, its licence and its state. Climb the ladder from the top. First, supplied by the client, because a real photograph of the real thing beats anything you can make. Second, licensed and sourced, with the licence recorded before the file is used. Third, drawn here, which is the right answer for a thing that cannot be photographed and the wrong answer for a thing that exists.
- risk: A photograph with no traceable licence used because it looks right
- risk: Drawing a schematic of an object that could have been photographed, which describes the subject instead of showing it
- mobile: Each row records the aspect ratio it will occupy so the mobile stack reserves space rather than shifting
- accessibility: Each row records what its alt text will say, which forces the question of what the asset is doing there
- accessibility: A decorative asset is recorded as decorative rather than left to be guessed at markup time
- genericness risk: low

### `lay-navigation-earns-its-place`  (0.69)

- **job**: Give the page a shell that says who this is, where they are, and one thing to do
- **problem**: Navigation is either absent, on the theory that a single page does not need it, or it is a full site menu on a page with three sections. The cleanest correlation in this repository’s own cold builds was this one: the rejected pages had one anchor each, the skip link, and no nav and no footer between them.
- **works when**: Every page, including the ones that are one screen long
- **avoid when**: Never entirely, though the answer can be four anchors and a footer rather than a menu
- **mechanism**: Decide what the shell is: who this is, where the reader is, and one thing they can do. Anchors to the page’s own sections count. A footer with the real address, the real hours and the real telephone number is a shell.
- risk: A menu that wraps three and one at 375, which reads as a missing item rather than as a wrap
- risk: A sticky header that eats a quarter of a small screen
- mobile: A wrapped menu is set deliberately, two by two or one per line, rather than left to wrap
- mobile: The skip link is the first focusable thing and is visible when focused
- accessibility: The current section is marked, not only coloured
- accessibility: A menu that opens is a disclosure with a name, an expanded state, and a way back out on the keyboard
- genericness risk: medium

### `cmp-every-state-exists-and-is-reachable`  (0.64)

- **job**: Build the states a component has beyond its successful one
- **problem**: Only the populated success state is built, so empty, loading, partial and error appear first in production and are designed by whoever is on call
- **works when**: Any component that renders data it did not create
- **avoid when**: Never; a component with unreachable states is unfinished, not simple
- **mechanism**: Empty, loading, error and partial are all built and all reachable in the running page. Partial ranks with the others: a half-succeeded bulk action says which half. Empty states are an invitation rather than an apology, and error states say what happened and what to do about it.
- risk: Building the states but leaving no route to them, so nobody has ever seen them render
- risk: A loading state whose shape does not match the loaded one, which shows as a jump
- mobile: Each state is checked at 375px; empty states with illustrations are the ones that overflow
- mobile: An error that appears above the fold on desktop can appear below it on mobile
- accessibility: State changes are announced, not only rendered
- accessibility: An empty state is readable text, not an image of text
- accessibility: Error text meets 4.5:1 and is bound to the thing that failed
- genericness risk: low


## Read, in this order

- `<skill>/SKILL.md`
- `<skill>/run.md`
- `<skill>/look.md`
- `<skill>/stacks/astro.md`
- `<skill>/contract.md`
- `<skill>/verify.md`

## Write

- `.sitesmith/direction.md`
- `.sitesmith/contract.json`
- `the site itself, in the detected stack`
- `ASSET-MANIFEST.md`
- `PRODUCTION-REPORT.md`

## Commands

- **direction**: `node <skill>/scripts/ledger.mjs new . read`
- **contract**: `node <skill>/scripts/contract.mjs new read`
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
