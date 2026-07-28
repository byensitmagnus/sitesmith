# Final competitor audit

One audit, four repositories, no fifth. Conducted **2026-07-28**, against the exact commits
below. Every claim here comes from the repository trees and files, not from the READMEs.

| Repo | Commit audited | Dated | Licence |
| --- | --- | --- | --- |
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | `e988add20dab0fa97d7a76781c48961c8184288e` | 2026-07-23 | MIT (`LICENSE`, 1,065 B) |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | `4857a2c5ef989794751a0f66b8545a4a49566286` | 2026-07-28 | MIT (`LICENSE`, 1,075 B) + OFL for bundled fonts |
| [anthropics/skills → skills/frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | `2235be7c60b551f5de82ade908fd3816455afcda` | 2026-06-09 | Apache 2.0 (`LICENSE.txt`, 10,174 B) |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | `1cf7d7ab0f1ac0bb3319fd20be389a3009f4037d` | 2026-07-28 | Apache 2.0 (`LICENSE`, 10,766 B) + `NOTICE.md` |

SiteSmith is audited at `48aa17c76540f2207df0bf22af8b85346de0bf11`.

---

## 1. What each repository actually is

The single most useful thing this audit did was read the trees rather than the prose. Three
of the four are much smaller as *implementations* than they read as documents.

### taste-skill — thirteen markdown skills, no user-facing code

```
skills/taste-skill/SKILL.md         87,253 B   ← the whole product
skills/image-to-code-skill/SKILL.md 36,442 B
skills/imagegen-frontend-web/…      36,854 B
skills/brandkit/SKILL.md            15,992 B
… 9 more SKILL.md files
scripts/                            4 .mjs files — README banner and sponsor-badge builders
skill.sh                            897 B — the installer
```

There are **no data files, no tests, no commands directory, and no scripts a user ever
runs**. The four `.mjs` files convert README images to webp and compose the sponsor row.
`image-to-code`, `brandkit` and the image-generation skills are instructions to a model, not
pipelines. That is a legitimate design, and it is worth being precise about: taste-skill's
strength is *authorial* — 87KB of opinionated art-direction writing and a genuinely simple
`npx`-style install — not architectural.

**Better than SiteSmith:** the writing on guided variation and image-first work; brandkit as a
first-class step; installation in one line; a specialised skill per aesthetic family so the
model is not asked to hold every style at once.

**Where SiteSmith is ahead:** everything downstream of the instruction. Nothing in taste-skill
measures its own output.

### ui-ux-pro-max — the data and distribution repo

```
.claude/skills/ui-ux-pro-max/data/   13 CSV + 25 stack CSVs, ~1.4 MB (google-fonts.csv 743 KB)
.claude/skills/*/scripts/            ~25 Python/Node files, with tests
.github/workflows/                   4 (asset sync, release, smoke-stacks, tests)
cli/                                 npm entry point mirroring .claude/skills
```

Seven skill modules (`banner-design`, `brand`, `design-system`, `design`, `slides`,
`ui-styling`, `ui-ux-pro-max`). Real Python: `design_system.py` is 59.4 KB, `core.py` 18.8 KB.
Real tests. Real release automation. Bundled fonts under OFL.

**Better than SiteSmith:** the breadth of structured data; stack adapters as a first-class
concept; a CLI that installs and updates; provider packaging driven from one tree; CI that
smoke-tests the stacks.

**Where SiteSmith is ahead:** SiteSmith already vendors this repo's `data/` and `scripts/`
(MIT, attributed) and has *replaced its selection logic* — `search.py --candidates` returns
three deliberately contrasting rows with confidence, displaced near-misses and cross-project
anti-repeat, where upstream returns the top three by score, which are near each other by
construction.

### frontend-design — one file

```
SKILL.md      8,260 B
LICENSE.txt  10,174 B
```

That is the entire skill. No scripts, no data, no tests, no commands. It is also, per line,
the strongest writing of the four on *why* a page should look like anything at all: design
from the subject's own world, one aesthetic thesis, one controlled risk, the hero as the
argument.

**Better than SiteSmith:** concision, and the insistence on a single thesis. SiteSmith's v2
layer is roughly 1,900 lines against this 8 KB.

**Where SiteSmith is ahead:** it turns those positions into checkable artefacts —
`EVIDENCE.md`, three comps, `direction-fidelity.mjs`. frontend-design cannot tell whether the
page it produced has a thesis.

### impeccable — the product

```
.agents/skills/impeccable/scripts/    ~60 .mjs modules
  detector/rules/checks.mjs                       249 KB
  detector/detect-antipatterns-browser.js         364 KB
  detector/browser/injected/index.mjs              81 KB
  detector/design-system.mjs                       35 KB
  live-*.mjs                          ~17 modules: browser, server, poll, inject, accept,
                                      resume, manual-edit evidence, copy-edit agent
  doctor.mjs  detect.mjs  palette.mjs  pin.mjs  hook*.mjs
.claude/skills/impeccable/            full mirror
.cursor/skills/impeccable/            full mirror
.codex/hooks.json  .claude-plugin/    provider configuration
command-metadata.json                 7.9 KB — the command vocabulary, declared as data
reference/                            40+ command documents
```

This is the only one of the four that is a product rather than a document set. A live browser
session that injects into a running dev server, applies manual edits and commits them; a
deterministic anti-pattern detector; `doctor`; hooks; and three provider trees generated from
one source with a `skills-lock.json`.

**Better than SiteSmith:** by a wide margin — the command vocabulary as data, `doctor`, the
detector, live feedback, provider packaging, and a workflow for improving *existing* sites.

**Where SiteSmith is ahead:** proof. Impeccable has no benchmark, no isolation harness, and
no measured claim that its output is better than its absence. It also has no tests directory.

---

## 2. Area-by-area

| Area | taste | pro-max | frontend-design | impeccable | SiteSmith |
| --- | --- | --- | --- | --- | --- |
| Brief inference | prose | prose | prose | `init` + surface briefs | `BRIEF.md` in the pipeline |
| **Evidence pack** | — | — | prose ("subject's world") | — | **`05-evidence.md`, seven sections, produced per project** |
| Art direction / thesis | strong prose | data-led | **strongest prose** | `shape` | comps + `DIRECTION.md` |
| **Three structural comps** | — | — | — | — | **`20-direction-lab.md` + `direction-check.mjs`, measured** |
| Design dials | **strong** | style CSVs | — | `overdrive`, `quieter` | mode files, outcome-based |
| **Anti-repeat** | prose | — | — | — | **cross-project history with render fingerprint** |
| Brandkit / reference boards | **`brandkit/SKILL.md`** | `brand/` + 5 scripts | — | `palette.mjs` | manifest only — **gap** |
| Asset inventory, focal points | prose | `validate-asset.cjs` | — | asset-producer agent | `ASSET-MANIFEST.md` with focal + state |
| Design-system generator | — | **`design_system.py` 59 KB** | — | `design-system.mjs` 35 KB | contract written from the winning comp |
| Search / data engine | — | **1.4 MB CSV + BM25** | — | catalogues | vendored + **contrasting selection** |
| Stack-specific implementation | — | **25 stack CSVs, adapters** | — | Svelte/SvelteKit/TanStack adapters | **gap — mode files are stack-agnostic** |
| Typography / colour / motion | strong | data | strong | `typeset`, `colorize`, `animate` | core + modes |
| Components / states / responsive | — | shadcn helper | — | catalogues | 22 blocks, states in the contract |
| **Interaction journeys** | — | — | — | live edit loop | **`40-interaction.md` + Playwright journeys** |
| A11y / performance / semantics | prose | prose | prose | detector rules | **`verify.mjs`: axe both schemes, 3 widths, overflow, font-stress** |
| Critique / harden / polish | `redesign-skill` | — | — | **`critique`, `harden`, `polish`, `audit`** | `50-critique.md` + `critique-gate.mjs` |
| Cross-page consistency | — | tokens | — | design-system module | `token-drift.mjs` contract |
| **Install / update / doctor** | `skill.sh` | **`cli/` npm** | — | **`doctor.mjs`, hooks, lock file** | **gap — none** |
| Detector / live | — | — | — | **364 KB detector + live** | **gap — none** |
| Provider packages | plugin.json | marketplace + cli | — | **Claude, Codex, Cursor from one source** | **gap — Claude only** |
| **Benchmark / measured effect** | — | — | — | — | **isolation runner, two gates, 42 fixtures** |
| E-commerce discipline | — | product CSVs | — | — | mode E + factual rules in the pilot |

---

## 3. The honest summary

**SiteSmith leads on:** evidence before design, three measured comps, anti-repeat across
projects, journeys that are executed rather than painted, technical verification, and
reproducible proof. Nothing in the other four measures its own output at all.

**SiteSmith trails on:** the product layer. impeccable has a command vocabulary, a doctor, a
detector, live feedback and three provider trees; pro-max has a CLI, stack adapters and
release automation; taste has one-line installation and a brandkit workflow. SiteSmith has
none of install, update, doctor, or provider generation.

**What is documentation rather than capability:** taste-skill's 87 KB SKILL.md and pro-max's
743 KB `google-fonts.csv` are both large without being pipelines. Volume is not a gap, and
this audit does not treat it as one.

**Licence position:** all four permit reuse with attribution. SiteSmith already vendors
taste-skill, ui-ux-pro-max, frontend-design and impeccable material under
[`NOTICE.md`](../../NOTICE.md) and [`LICENSE-AUDIT.md`](../../LICENSE-AUDIT.md). impeccable
carries its own `NOTICE.md` crediting `ehmo/platform-design-skills` (MIT), which is carried
forward. Nothing new is copied by this audit; the gaps below are to be implemented, not
lifted.
