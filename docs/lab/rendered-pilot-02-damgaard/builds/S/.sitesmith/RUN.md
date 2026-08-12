# Run manifest

Written by `sitesmith build`. It resolves what a command can resolve and names what
the agent does next. It is not a plan: the plan is the direction record.

- surface: **buy**
- stack: **nextjs**, adapter `stacks/nextjs.md` (detected)
- brief: `./BRIEF.md`

## Knowledge Index

Building blocks, not a template. They go through the subject, thesis, autopilot,
swap and originality flow before anything is built. The full text is here so the
corpus itself stays outside the read manifest.

### `col-roles-come-after-the-colours`  (0.237)

- **job**: Turn a set of colours found in the subject into a system a page can be built from
- **problem**: A palette is a list of colours, and a page needs to know which one is the action, which is the focus ring, and which foreground goes on which background. Reaching for role names first produces a primary and a secondary before anyone has looked at the subject.
- **works when**: The colours already exist, taken from the subject’s own materials, and the question is what each is for
- **avoid when**: Nothing has been found yet. Naming roles first is how a category palette gets in through the back door.
- **mechanism**: Find the colours in the subject first. Then give each a role from a fixed, small vocabulary: background, foreground, action, onAction, focusRing, border, and the optional ones the page actually has. The vocabulary is fixed so a script can check it; the values are not, because they came from the subject.
- risk: A role that points at nothing, so the page has an action colour nobody chose and the browser picks it
- risk: Ten roles filled from six colours by repeating one, which is a system on paper and one colour doing four jobs on the page
- mobile: Roles do not change with width. A layout that needs a different action colour at 375 has two actions, not one.
- accessibility: Every foreground role owes a background role it is measured against, and the measurement is per pair, not per colour
- accessibility: focusRing is a required role. A focus ring nobody chose is the browser default, on a ground it was never picked against.
- genericness risk: low

### `next-warm-every-route-before-capturing`  (0.226)

- **job**: Capture screenshots of a Next.js site that show the page rather than the compiler
- **problem**: The development server compiles on first request, so the first capture of each route is a screenshot of a page that is still being built
- **works when**: Any verification pass against the development server
- **avoid when**: A production build served by the production server, where the compile has already happened
- **mechanism**: Request every route once before the render matrix runs. Capture against the development server on its own port. Optimised images are only served by a running server, so the asset manifest records the optimiser's request URLs rather than the paths under the public directory.
- risk: A capture that looks broken and is only uncompiled, which sends the run into fixing a design that is fine
- risk: Running the matrix against static file paths and concluding the images are missing
- mobile: Warm the routes once per viewport if the route renders differently by width
- accessibility: Automated checks against an uncompiled page report absences that do not exist, so warming is a precondition for trusting the results
- genericness risk: low

### `next-hydration-and-image-failure-modes`  (0.222)

- **job**: Recognise the three Next.js failures that look like design problems
- **problem**: A page renders correctly and the markup you inspected is gone, an image collapses to nothing, or every image on a route returns an error, and each of them looks like a styling bug
- **works when**: Diagnosing a Next.js page that renders differently than the source suggests
- **avoid when**: Never; these three account for a large share of the stack's confusing symptoms
- **mechanism**: A date, a random value or anything read from the window renders on the server and again on the client, mismatches, and the server HTML is discarded silently. An optimised image without width and height, or filling a parent with no height, collapses to nothing. A remote image host missing from the configured patterns returns an error for every image on the route. The development server also tolerates what the production build refuses, so run the build once before calling a page finished.
- risk: Fixing the symptom in CSS, which leaves the mismatch in place to recur
- risk: Shipping a page that only the development server accepts
- mobile: A collapsed image is easier to miss at 375px where the layout is a single column and the gap reads as spacing
- accessibility: Discarded server HTML takes its heading structure and landmarks with it, so an accessibility pass on the server output proves nothing about what the user gets
- genericness risk: low


## Read, in this order

- `<skill>/SKILL.md`
- `<skill>/run.md`
- `<skill>/look.md`
- `<skill>/floor/buy.md`
- `<skill>/stacks/nextjs.md`
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

- **direction**: `node <skill>/scripts/ledger.mjs new . buy`
- **contract**: `node <skill>/scripts/contract.mjs new buy`
- **contractCheck**: `node <skill>/scripts/contract.mjs check --write`
- **contractCompare**: `node <skill>/scripts/contract.mjs compare --url <url> --write`
- **verify**: `node <skill>/scripts/verify.mjs <url-or-dir>`
- **critiquePacket**: `node <skill>/scripts/critique.mjs packet`
- **critiqueLock**: `node <skill>/scripts/critique.mjs lock --file <answers.md>`
- **journey**: `node <skill>/scripts/journey.mjs journeys --base <url>`
- **gate**: `node <skill>/scripts/gate.mjs`

## Blockers

- no direction record: run `node <skill>/scripts/ledger.mjs new . buy`

## Next

no direction record: run `node <skill>/scripts/ledger.mjs new . buy`
