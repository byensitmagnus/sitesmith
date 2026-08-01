# SiteSmith

Builds and redesigns websites that do not look AI-generated, and proves it in a browser
rather than claiming it.

One skill. You activate it and nothing else.

## Install

```bash
node tools/install-sitesmith.mjs
```

That copies the skill into `~/.claude/skills/sitesmith/` and, if the directory exists,
`~/.agents/skills/sitesmith/`. It refuses to overwrite an existing install without
`--force`, and prints exactly what it wrote.

To install somewhere else:

```bash
node tools/install-sitesmith.mjs --to /path/to/skills
```

Then start a session in the project you want to build and say what you want. The skill
triggers on the ordinary things: build a landing page, redesign this, this looks generic,
make it responsive, review this UI.

## What it needs

Node 20 or newer. Nothing else to build a page.

To verify one in a browser you need Playwright and axe, which the skill's own scripts
call. If they are not installed, every check that needs them **withholds its verdict and
says so**. It never prints a pass it did not earn.

```bash
npm i -D playwright @axe-core/playwright && npx playwright install chromium
```

## What it does

Three phases. The whole run ends in a written report, never in a question.

**Build.** Name the subject. Go into its world and come back with concrete nouns, not
adjectives. Write down the page you would make on autopilot, then do not make it. Write
three theses about what the site *is*, argue one you did not rank first, and choose on a
named axis. Plan the colour, type, layout, structure, signature and one named risk before
any code. Then build from the plan exactly.

**Inspect.** Render it at 375, 768 and 1440, in both colour schemes, plus a
reduced-motion pass. Look at the screenshots. Open with one word: ship, fix, or rebuild.

**Release.** Run the gates. Write the report.

Every loop has an integer cap. There is no self-improvement loop.

## What is checked, and what it refuses

`scripts/gate.mjs` refuses, it never decides. It will stop a build for:

- placeholder copy, empty brand marks, unmanifested assets, invented facts
- a colour within 12 RGB units of the premium-consumer palette that upstream taste-skill
  names as the second-most-recurring AI tell
- the two display serifs and the default sans that taste-skill bans by name
- a saturated colour inside the AI-purple hue region
- two labels for one call-to-action intent on the same page
- em dashes, anywhere, absolutely
- token drift, and reads outside the declared manifest

Every one of those has an override path: write `<name>-pinned-by-brief:` with the
client's own words in the direction record and the check stands down. **The brief
outranks everything in this package.**

`scripts/ledger.mjs` remembers the shape of what you have already built and refuses a
repeat: a ground, an emphatic accent or a signature material too close in hue to a recent
one. It never proposes a colour. It names a closed region and you choose again from the
subject's own materials.

`scripts/verify.mjs` renders and reports what is actually on screen. A check that could
not run withholds its verdict.

## Honest limits

- **The creative method is re-expressed from Anthropic's `frontend-design` skill**, which
  beat this repository's previous version 59 to 40 on an identical brief. In a blind
  re-test our re-expression scored 135 against its 134, which is a tie, not a win. The
  original contribution here is the verification and the anti-repeat machinery, not taste.
- **The house-style problem is not solved.** Three portfolio tests of three unrelated
  briefs each found the set converging, in a different place each time. Every fix moved
  it rather than removing it, which is why the current defences are checks in code rather
  than more instruction. See `docs/rebuild/s13/`.
- **No site built with this has shipped to a real customer.** Every number here comes
  from two or three builds.

Full research trail, including everything that failed: `docs/rebuild/`.

## Licence

MIT. It vendors no upstream files; `tools/provenance-overlap.mjs` measures that claim
rather than asserting it. Attribution and what was taken from whom:
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
