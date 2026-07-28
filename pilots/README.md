# Pilots

Three sites, one per mode, each built through the whole v2.1 pipeline: evidence pack, asset
manifest, three structurally different comps, a chosen direction with both rejections
recorded, a design-system contract written *from* the winning comp, an interaction contract,
the build, at least one Playwright journey, and every gate.

They exist to answer one question before the paid benchmark runs: does the pipeline survive
contact with a build, and do three subjects taken through it come out looking like three
different sites rather than one template three times.

| | Subject | Mode | Direction chosen | Signature |
| --- | --- | --- | --- | --- |
| 01 | Trelfall & Son, rope and cordage | E | the counter | the cross-section is a column, not an illustration |
| 02 | Marrow & Kell, bellfounders | M | the profile | the half-section is page furniture for the whole document |
| 03 | Stalbridge cask desk | P | the board | state is a word in a bordered chip, readable at four feet |

## What each one has

```
EVIDENCE.md          the subject's world, before any visual decision
ASSET-MANIFEST.md    every non-text thing, each ready / needed / substitute
directions/a|b|c/    three comps, each with its five axis values
directions/HISTORY.md the anti-repeat record
DIRECTION.md         scores, the winner, the signature, both rejections with reasons
DESIGN-SYSTEM.md     written from the winning comp, with a machine-readable contract block
INTERACTIONS.md      primary actions, states and how each is reached, keyboard and focus
site/                the build
journeys/            Playwright journeys that drive the real page
```

## Running them

```bash
cd pilots/01-chandlery && node ../../benchmarks/serve.mjs 4501 site &
node ../../skills/sitesmith/scripts/verify.mjs http://localhost:4501/ --out .sitesmith/shots
node ../../skills/sitesmith/scripts/token-drift.mjs site/index.html --contract DESIGN-SYSTEM.md
node ../../skills/sitesmith/scripts/journey.mjs journeys --base http://localhost:4501
node ../../skills/sitesmith/scripts/production-gate.mjs http://localhost:4501/ \
  --manifest ASSET-MANIFEST.md --production
```

Ports: 4501, 4502, 4503. Each pilot needs `playwright` for its journeys; the directories are
git-ignored.

## Assets

All drawn for these projects. Image generation was unavailable, and for all three subjects a
drawing is the stronger answer anyway: a chandler's catalogue draws rope constructions because
a photograph of blue rope says nothing about whether it can be spliced; a bell cannot be
photographed usefully from any angle a visitor could stand in; and a cellar console is a
working screen, not a page about a brewery.

Nothing is a placeholder. Every manifest row across the three sites is `ready`.
