# Damgaard Estrik

Booking site for a fictional structural-drying and screed contractor (see `BRIEF.md` — the
company does not exist; this is a build exercise). Next.js App Router, TypeScript, no CSS
framework. No database: bookings are appended to a local log file.

## Run it

```bash
npm install
npm run build
npm start -- -p 3417     # production server, http://localhost:3417
```

`npm run dev` also works for local editing (`http://localhost:3000`).

## Routes

| Route | What it is |
| --- | --- |
| `/` | Home — who this is for, the 75 km limit and the three refusals, price summary, how the drying process works |
| `/priser` | Full price list, service-area detail, the complete refusal/unknown lists |
| `/bestil` | The 12-field booking form. `GET` is the Tom state; submitting invalid data (e.g. `postnummer=2200`, or `kloakvand=ja`) re-renders the Fejl state at the same URL |
| `/kvittering` | The Kvittering state — reachable directly, or by redirect after a valid booking |

The form works with JavaScript disabled: it is a real Next.js Server Action, so an unmodified
browser POST is handled server-side and returns full HTML, including the `autofocus` attribute
on the field that failed validation.

## Checks

```bash
npm test                              # lib/validation.js self-check (node:assert)
npm run build && npm start -- -p 3417 # then, in another shell:
BASE=http://localhost:3417 npm run verify    # screenshots, axe, links, touch targets
BASE=http://localhost:3417 npm run journey   # the booking flow end to end, incl. keyboard
```

`npm run verify` writes screenshots to `.sitesmith/shots/` (gitignored) at 320/375/768/1024/
1440px, in both colour schemes.

## Source of truth for content

Every fact on every page is transcribed once, in `lib/content.js`, from `BRIEF.md`. Pages
import from it rather than repeating numbers, so a price or rule can't drift between pages.
`lib/validation.js` is the same idea for the two required error texts and the booking rules —
plain CommonJS on purpose, so it can be `require()`d directly by `node` in
`lib/validation.test.mjs` without a build step.

See `DIRECTION.md` and `DESIGN-SYSTEM.md` for the visual system, `EVIDENCE.md` for the research
behind it, `ASSET-MANIFEST.md` for the three drawn diagrams (there is no photography — see
`BRIEF.md`, Constraints), and `INTERACTIONS.md` for the interaction contract.
