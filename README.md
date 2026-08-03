# SiteSmith

[![verify](https://github.com/byensitmagnus/sitesmith/actions/workflows/verify.yml/badge.svg)](https://github.com/byensitmagnus/sitesmith/actions/workflows/verify.yml)
[![licence: MIT](https://img.shields.io/badge/licence-MIT-green.svg)](THIRD-PARTY-NOTICES.md)

**A browser release loop for coding agents that build websites.**

SiteSmith is a skill a coding agent installs. It chooses a visual direction, builds in the
detected stack, renders the result in a real browser, and refuses the defects it can
measure before it calls the site done.

**[Open the live project page](https://byensitmagnus.github.io/sitesmith/)** ·
**[Install](#install)** ·
**[What has been measured](#what-has-been-measured)** ·
**[The vertical pilot](evidence/pilot/README.md)**

![SiteSmith project page showing its browser release rig and a deliberately blocked control page](gallery/sitesmith-home.png)

## One product, one pipeline

| | |
|---|---|
| the skill | [`skills/sitesmith-v3/`](skills/sitesmith-v3/README.md) |
| the journey | [`product/pipeline.json`](product/pipeline.json), and nothing else defines one |
| the command line | `skills/sitesmith-v3/cli.mjs`, routed by `commands.mjs` |
| the installer | `bin/sitesmith.mjs install`, which writes every provider pack from the pipeline |

`skills/sitesmith/` is **v2**. It is history and explicit legacy support: it is reachable
only through `--legacy-v2`, it defines no current journey, and the evidence in `docs/v2/`
and `benchmarks/` was produced against it. [`docs/V3-TRUTH-TABLE.md`](docs/V3-TRUTH-TABLE.md)
lists what every entrypoint did before this was true and what it does now.

## Install

```bash
node bin/sitesmith.mjs install --to <dir> --provider claude
cd <dir>
npm i -D playwright @axe-core/playwright && npx playwright install chromium
node .claude/skills/sitesmith/cli.mjs init --name "<name>"
node .claude/skills/sitesmith/cli.mjs recommend "<one sentence about the job>" --surface buy
node .claude/skills/sitesmith/cli.mjs build --surface buy
node .claude/skills/sitesmith/scripts/verify.mjs <url>
node .claude/skills/sitesmith/scripts/gate.mjs --url <url>
```

`build` writes `.sitesmith/RUN.md`: the resolved brief, the surface, the stack and where the
stack was detected from, the retrieved knowledge in full, the files to read in order, the
artefacts to write, every command, the blockers, and the one next step. The agent builds
from that file.

Without Playwright and axe the skill still builds pages, and every check that has to render
withholds its verdict and names what is missing. It never prints a pass it did not earn.

### Providers

Status is a claim about what has been proved, not about whether a file with that name exists.

| provider | `--provider` | entry | status | proof |
|---|---|---|---|---|
| Claude Code | `claude` | `.claude/skills/sitesmith/SKILL.md` | supported | installed and driven end to end in [`evidence/pilot/`](evidence/pilot/README.md) |
| Codex | `codex` | `.agents/skills/sitesmith/AGENTS.md` | experimental | the pack generates and its entry parses; no end-to-end run on Codex |
| Cursor | `cursor` | `.cursor/rules/sitesmith/sitesmith.mdc` | experimental | the pack generates and its frontmatter parses; no end-to-end run in Cursor |
| OpenAI | `openai` | `.openai/skills/sitesmith/SKILL.md` | experimental | the pack and `openai.yaml` are emitted and shape-checked; the official validator has not been run |

`--provider all` writes all four. Every pack contains the same skill and the same generated
`JOURNEY.md`, rendered from `product/pipeline.json`;
[`tools/test-pipeline-drift.mjs`](tools/test-pipeline-drift.mjs) fails if any of them says
something the pipeline does not.

**Claude Code plugin**

```bash
claude plugin marketplace add byensitmagnus/sitesmith
claude plugin install sitesmith@sitesmith
```

## What has been measured

**Twelve cold builds.** Each by a fresh agent with an empty context window, the installed
skill, one brief and nothing else. Twelve blind reviewers, each cast as the person paying
for that site, each given the brief, four renders and the HTML, and never the builder's
journal, the gate output or another reviewer's answer.

| | |
|---|---|
| cold builds | **12** |
| rejected | **9** |
| accepted | **3** |
| the three accepted, individually | passed |
| the three accepted, as a set | did not pass the portfolio-diversity measurement |

The first nine were all rejected. The mechanism that changed it was the second reading: a
page has to hold a fact the first screen does not, and the direction record names it, and
the gate looks for it in the rendered DOM. Everything is in
[`evidence/cold-builds/`](evidence/cold-builds/README.md), unedited, including the nine
rejections.

**One vertical pilot.** A coding agent went from a clean install to a working, verified
Astro site with a real price calculator, on a fictional brief it had never seen. Production
build green, verify PASS, 44 journey assertions, a critique locked to the render that
shipped. It found **nine product defects** that no test in this repository could have found,
because each one lived between two things that worked alone. All nine were fixed at root
cause. [`evidence/pilot/README.md`](evidence/pilot/README.md).

**Showcase: 0/8.** Three Round 8 pages cleared the individual threshold and still looked
like one studio using one recipe: warm light grounds, uppercase mono labels, hairline
separators, tabular figures, no elevation. Both assignment-blinded reviewers reached the
portfolio finding independently. They stay committed as benchmark evidence and none is
presented as showcase work. [Diversity report](docs/v2/preflight/round-8/diversity/portfolio.json)
· [reviews and correction](docs/v2/preflight/round-8/RESULT.md)

New hard gates are frozen behind four conditions: [`docs/GATE-POLICY.md`](docs/GATE-POLICY.md).
A rubric change takes effect forward only, so no past verdict is rewritten by a later rule.

## The problem

Ask any coding agent for a landing page and you get the same page: a purple-to-blue gradient
hero, centred, two blurred orbs, three equal feature cards with emoji icons, "Unlock Your
Potential", four fabricated statistics and three testimonials from Jane Smith at Acme Corp.
It scores well in a diff and badly in a browser.

Three things cause it, and rule lists only fix the first:

1. **No direction was chosen.** The model reached for a default because nothing told it not to.
2. **The result was never looked at.** Contrast failures, mobile overflow and dead keyboard
   paths are invisible in source.
3. **Rules fire in the wrong context.** A dashboard does not want a cinematic hero; a
   portfolio does not want a settings panel.

## What SiteSmith does about it

**Commits to a direction before writing CSS, in writing.** `.sitesmith/direction.md` has
required headings, and three of them are the working mechanism: the **Signature**, the
**Answer to the risk**, and the **Second reading**. They are a fixed question, the builder's
own answer, and a script that looks for that answer in the rendered DOM.

**Refuses rather than decides.** `scripts/gate.mjs` stops a build for lopsided bands, a
ragged margin, one layout worn three times, a container wider than its content, a page with
nothing to do on the first screen, copy that narrates its own deletions, a critique that was
not taken, and more. Every refusal names the way past it. It never says the page is good;
that verdict belongs to the person who is shown it.

**Remembers what it already did.** An anti-repeat ledger fingerprints finished renders
across projects. A device that appears on this render and on every one of the last three is
refused, so a house style cannot form quietly.

**Locks the critique to the render.** Six questions answered from the images alone, with the
record closed, hashed to the build that ships. One correction round, and the second is
refused.

**Withholds instead of guessing.** A missing browser, an unreadable route, a stylesheet that
did not load: each is named and the verdict is withheld. Pilot defect nine was a gate that
measured an unstyled document and reported four confident, specific, false design defects.

**Treats anti-slop as judgement, not a ban list.** A purple gradient is slop when it is the
accent because no palette was chosen. It is correct when it is the brand.

## What the loop caught

Found in work that looked finished in the editor:

| Defect | Why review missed it |
| --- | --- |
| +55px horizontal overflow at 375px | An inline `style="display:contents"` silently beat the `display:none` media query |
| Body text at 4.37:1 | Looks fine. Fails AA by 0.13 |
| White button label at 1.83:1 in dark mode | The light-mode value was hardcoded |
| Scrollable table unreachable by keyboard | Nothing visually wrong at any width |
| +250px overflow from a `1fr` grid track | `1fr` resolves its minimum to `auto`, so the track grew instead of the grid scrolling |
| Hidden labels escaping a scroll container | Absolutely positioned with no positioned ancestor, so each 1px label sat 615px into the document |

Fifteen more across eight sites are in the
[legacy benchmark report](benchmarks/README.md#what-the-loop-actually-caught).

## The technical floor, and what it is not

The nine v1 builds pass the floor and the control does not:

| | Console | Broken links | Axe serious | Mobile overflow | Lighthouse a11y |
| --- | --- | --- | --- | --- | --- |
| Nine v1 builds | 0 | 0 | 0 | 0 | 100 (six measured) |
| Control (no skill) | 0 | 8 | 2 | 1 | 81 |

That is a real result about a real checker and **not** a result about the skill: a person
wrote those nine pages while reading the rules, and the control was written to be bad.
`benchmarks/06-redesign/before/` is the control group and is required to keep failing; CI
fails if it passes.

The proposed eighteen-run skill-versus-control study was retired before generation. Its
design is kept as historical methodology, not a pending promise. No transfer claim is made.

## Repository map

```
product/pipeline.json     the canonical journey. Every pack is generated from it
skills/sitesmith-v3/      the product
  SKILL.md                the skill, with its own reading map and context ceilings
  cli.mjs commands.mjs    the seven commands, one router
  scripts/                gate, verify, inspect, critique, journey, ledger, stack
  knowledge/              9 corpora, 129 posts, dependency-free retrieval
  floor/ stacks/          per-surface floors; Next.js, React/Vite, Astro, Shopify
bin/sitesmith.mjs         install, update, doctor, pack
tools/                    repo self-checks. Nothing here runs during a customer build
evidence/pilot/           one site built end to end, and the nine defects it found
evidence/cold-builds/     12 cold builds, 9 rejections, 3 accepts, the diversity report
docs/                     GATE-POLICY, V3-TRUTH-TABLE, rebuild research, v2 history
skills/sitesmith/         v2. Legacy, reachable only through --legacy-v2
```

## Credit

SiteSmith v1 was a composition of four openly licensed projects, credited in
[NOTICE.md](NOTICE.md):

- **[taste-skill](https://github.com/Leonxlnx/taste-skill)** (MIT), brief inference, dials, AI tells, motion, blocks
- **[ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)** (MIT), the datasets, the search engine, the UX rules
- **[frontend-design](https://github.com/anthropics/claude-plugins-official)** (Apache 2.0, Anthropic), aesthetic ambition
- **[impeccable](https://github.com/pbakaus/impeccable)** (Apache 2.0), the command vocabulary

If SiteSmith is useful, those four are why. Star them too.

Two further sources were evaluated and **rejected** as non-redistributable: one had no
licence, one had no traceable author. Their material was replaced with originally written
equivalents. The reasoning is in [LICENSE-AUDIT.md](LICENSE-AUDIT.md).

**Where the four are still ahead.** Impeccable has live browser iteration and framework
hooks SiteSmith has deliberately not copied. Taste-skill still has the broader image-first
workflow. Frontend-design remains the sharpest short statement of aesthetic ambition, and
ui-ux-pro-max is the upstream maintainer of the datasets.

## Contributing

[CONTRIBUTING.md](CONTRIBUTING.md). The short version: a rule that cannot be demonstrated on
a rendered page does not belong in the skill.

## Licence

[MIT](LICENSE) for our own work; bundled material keeps its original licence. See
[NOTICE.md](NOTICE.md) and the complete bundled
[Apache-2.0 text](skills/sitesmith/LICENSES/Apache-2.0.txt).
