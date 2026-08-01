---
title: "Candidate: MINIMAL — one file of taste, four scripts of proof"
state: S5_ARCHITECTURE_CANDIDATES
status: proposal
candidate: minimal
author: blind architect (candidate 1 of 3)
ai_generated: "(C)"
---

# Candidate: MINIMAL

## One-line thesis

The 2,078 tokens that won were spent raising the model's standard; the 6,546 that lost were
spent describing the model's output — so delete every file whose job is to describe output,
keep every file that executes, and put the entire creative method in one always-loaded page.

## The distinction this candidate is built on

The forensics is usually read as "small beats big". That reading is wrong and would delete
`verify.mjs`, which loses A7 immediately. The measured claim is narrower and sharper:

| Kind of thing | Costs context | Decides the design | Measured verdict |
| --- | --- | --- | --- |
| Prose that raises the standard | yes | no (the model does) | **won**, 59 |
| Prose that describes the output | yes | effectively yes | **lost**, 40 |
| Data corpora and generators | no, until fetched | yes, when consulted | produced the 0/8 house style |
| Executable checks | **zero** | no, they only refuse | frontend-design has none; it was judged not production-ready |

So the cut is not by size. It is by **whether a file's output is a design decision**. Three
groups follow, and MINIMAL treats them differently:

1. **Taste prose** — one file, always loaded, ~3.2k tokens. Nothing else is always loaded.
2. **Answer prose** — five small files, fetched at a named step, put down after.
3. **Executables** — four scripts. They cost nothing until run and they only ever say *no*.

Everything in v2.3 that is none of those three is deleted. That is 126 of 139 files.

---

## What goes

v2.3 is 139 files, 2,520,401 bytes, ~630,100 estimated tokens. MINIMAL is 13 shipped files.

### data/ — all 20 files, 1,442,621 bytes, 57.2% of the package. Deleted.

`google-fonts.csv` (745 KB), `styles.csv`, `typography.csv`, `colors.csv`, `ui-reasoning.csv`,
`landing.csv`, `products.csv`, `app-interface.csv`, `charts.csv`, `icons.csv`,
`ux-guidelines.csv`, `react-performance.csv`, `stacks/*.csv` (16 files), `_sync_all.py`.

Reason: a retrieval corpus answers "what are the options for a site like this?", and every
brief that lands in the same bucket gets the same answer. That is the convergence engine
described in `INSTRUCTION-BUDGET-VS-QUALITY.md` ("two situations that fall in the same bucket
get the same answer") wired to a search index. `ui-reasoning-category-table` is already
`reject` in the ledger; its red team also found the row count was guessed, which is what a
corpus nobody reads looks like. `bm25-csv-retrieval` and `domain-auto-detect` are dropped with
it because there is nothing left to retrieve from.

**Honest carve-out.** `ui-ux-pro-max/static-ux-knowledge-tables` is `adopt`/confirmed and I am
not deleting the part of it that is a *fact*. Eight numeric values that models genuinely get
wrong (4.5:1, 3:1, 24px, 44px, 16px input, 320px, focus-indicator contrast, reduced-motion
must stop the work not just the animation) are inlined into section 7 of `SKILL.md`, about 40
words. The rest of those tables was style suggestion, and style suggestion is the thing that
converged.

### references/ — 40 files, 487,356 bytes, 19.3%. Removed from the shipped skill.

Not deleted from the repository: moved to `docs/upstream/` and kept for the licence audit and
`SOURCE-REGISTRY.json`. `SKILL.md` itself already says they are "not read during a build", and
a skill bundle should not carry a fifth of its weight in files it never opens.

Licence check: MIT (taste-skill, ui-ux-pro-max) requires the copyright and permission notice
to travel with the distribution; Apache-2.0 (frontend-design, impeccable) requires the licence,
the NOTICE and a statement of changes. All four obligations are discharged by
`THIRD-PARTY-NOTICES.md` plus `LICENSES/`, both of which stay in the bundle. Shipping the
upstream *source* was never the obligation. `tools/check-repo.py` currently asserts `REFS`
exists inside the skill; that assertion is repointed at `docs/upstream/`, which is a
relocation of a structural check, not a relaxation of a behavioural one.

### v2/ — all 18 files, 146,320 bytes. Deleted, with triage.

| v2 file | fate |
| --- | --- |
| `00-done.md` (10 KB) | the fourteen items collapse to the seven-line floor in `SKILL.md` §7 plus what `gate.mjs` already checks. Nine of the fourteen were things a script measures; a prose list of them is instruction budget spent restating a program. |
| `10-core.md` (7.8 KB, "the sixty") | deleted. Sixty rules is the description-of-output surface the measurement indicts. What survives: five lines in §7, one line in §6, one line in §8. |
| `05-evidence.md` (6 KB) | one paragraph, `SKILL.md` §2. |
| `20-direction-lab.md` (14 KB) | one paragraph, `SKILL.md` §3 and §5. Three *built* comps become three *one-line* theses. |
| `30-contract.md` (11.5 KB) | five lines of `.sitesmith/direction.md` in §5. |
| `40-interaction.md` (7.3 KB) | two sentences in §10 plus `journey.mjs`, which already contains the definition. |
| `50-critique.md` (7.7 KB) | §11, seventeen lines. |
| `15-brand.md`, `24-asset-plan.md`, `25-assets.md`, `26-visual-assets.md` (29 KB) | deleted. Asset discipline survives as one clause in §2 and one check in `gate.mjs` (unmanifested image → fail). Four files to say "plan what a picture carries" is the failure mode. |
| `modes/marketing.md` (8.7 KB) | **deleted outright.** Every rule in it is either universal (already in §7) or a look. A marketing-specific floor that is not the universal floor *is* a house style with a filename. |
| `modes/ecommerce.md` (8.2 KB) | survives, compressed, as `floor/commerce.md`. Nordrig proved this content earns its keep. |
| `modes/product-ui.md` (8.3 KB) | survives, compressed, as `floor/app.md`. |
| `tasks/redesign-audit.md` (12.9 KB) | survives, compressed ~2.5:1, as `redesign.md`. |
| `tasks/setup.md` (4.4 KB) | folded into `stacks.md`. |
| `README.md`, `modes/README.md` | deleted. A README for a directory of two files is the sprawl. |

### blocks/ — 22 files, 106,483 bytes. Deleted.

The block library is structure-only by its own `CONTRACT.md`, which is the right contract and
does not save it. A shared starting shape produces shared shapes: a `hero/split.html` that
twelve projects begin from is a house style delivered as scaffolding, and the nordrig winner
used none of it. What replaces it is C6's rule stated in one sentence in §8 — *reuse the
behaviour, author the appearance* — and, in `floor/app.md`, the named accessible behaviours
(combobox, dialog, disclosure, focus trap, roving tabindex) pointing at WAI-ARIA APG by name
rather than at our markup. **This is the deletion I am least sure of; see "Where smallness
stops working", item 2.**

### scripts/ — 20 files, 254,101 bytes → 4 files + `package.json`.

| v2.3 script | Fate | Why |
| --- | --- | --- |
| `verify.mjs` (13.4 KB) | **kept, byte-for-byte** | A7. Every check in it exists because a real defect shipped; its comments say so. The control group depends on it unchanged. |
| `journey.mjs` (1.9 KB) | **kept, byte-for-byte** | 50 lines, no dependencies of its own, and it is the only thing that distinguishes a reachable state from a painted one. |
| `production-gate.mjs` (25.6 KB) | folded into `gate.mjs` | |
| `token-drift.mjs` (12.7 KB) | folded into `gate.mjs` | |
| `direction-fidelity.mjs` (23.2 KB) | reduced to 3 checks, folded into `gate.mjs` | its own ledger record names the failure: "classifier regexes recognise only a fixed vocabulary of axis phrasing". Three checks against five declared lines cannot have that problem at 23 KB's scale. |
| `direction-history.mjs` (13.1 KB) | folded into `ledger.mjs` | |
| `portfolio-diversity.mjs` (11.9 KB) | folded into `ledger.mjs --set` | |
| `direction-record.mjs` (3.7 KB) | folded into `ledger.mjs commit` | |
| `direction-check.mjs` (13.8 KB) | **deleted** | it gates three rendered comps. MINIMAL does not render three comps, so there is nothing to gate. Its job moves to §3 prose plus the end-of-run ledger veto. |
| `critique-gate.mjs` (13.4 KB) | **moved to `tools/`** | the ledger's own form note for `assignment-blinded-critique-gate` says "opt-in for portfolio/benchmark claims, not a default single-site step". A benchmark instrument does not belong in a customer-facing bundle. |
| `search.py` + `candidates.py` + `core.py` + `design_system.py` (~86 KB Python) | **deleted** | this is the direction engine that scored 40. `design-system-py-legacy-generator` and `direction-candidate-search` are both already `reject`. Deleting them is also what makes `C-no-mechanical-creativity` structurally true rather than promised. |
| `stack-router.mjs` (3.8 KB) | **deleted** | detection is four file-existence tests and one precedence rule. `stacks.md` states the precedence and the model runs `ls`. A script is not needed to read a directory. |
| `asset-plan.mjs` (12.7 KB), `visual-assets.mjs` (18.8 KB) | **deleted** | asset *planning* is a judgement, so a script must not do it; asset *honesty* (unmanifested image, empty brand mark) is already in `gate.mjs`. |

### Root

`PIPELINE.json` deleted — it exists to generate command vocabulary and provider packages,
which is `multi-copy-sync-architecture` (`reject`). One skill, one entry point.
`THIRD-PARTY-PROVENANCE.json` (41.9 KB) moves to `docs/` with the upstream copies.
`THIRD-PARTY-NOTICES.md` and `LICENSES/` stay in the bundle, non-negotiable.

---

## File tree

```text
skills/sitesmith/
├── SKILL.md                    242 lines · 12,689 B · ~3,172 est tokens · ALWAYS LOADED
├── floor/
│   ├── commerce.md             fetched when money or a price is on the page      ~6 KB
│   └── app.md                  fetched when the visitor operates a tool          ~6 KB
├── redesign.md                 fetched when code already exists                  ~5 KB
├── stacks.md                   fetched once, before the first file is written    ~4 KB
├── verify.md                   fetched at release                                ~3 KB
├── scripts/
│   ├── verify.mjs              unchanged from v2.3                            13,431 B
│   ├── journey.mjs             unchanged from v2.3                             1,910 B
│   ├── gate.mjs                new · production-gate + token-drift + fidelity + antipattern
│   ├── ledger.mjs              new · direction-history + portfolio-diversity + record
│   └── package.json
├── THIRD-PARTY-NOTICES.md
└── LICENSES/
    ├── Apache-2.0.txt
    └── MIT.txt

repo, not shipped in the bundle:
docs/upstream/                  the 40 verbatim reference files, for the licence audit trail
tools/critique-gate.mjs         assignment-blinded ceremony, benchmark lab only
```

**13 shipped files** (excluding the two licence texts: 15 with them), down from 139.
**6 markdown files**, down from 67. **4 scripts**, down from 20. **0 CSVs**, down from 12.
**0 HTML blocks**, down from 20.

---

## Context budget

Method: **bytes ÷ 4**, the same estimator `BASELINE-CONTEXT-BUDGET.json` and
`INSTRUCTION-BUDGET-VS-QUALITY.md` use. Not a real tokeniser. `SKILL.md` was written in full
and measured with `wc -c`; the five fetched files are estimates from their v2.3 sources with
the stated compression ratio applied.

| | ALWAYS | ROUTINE (always + one floor file + stacks.md) | all instruction | whole bundle |
| --- | ---: | ---: | ---: | ---: |
| frontend-design | 2,078 | 2,078 | 2,078 | 2,078 |
| **MINIMAL** | **3,172** | **~5,672** | **~9,200** | **~17,000** |
| SiteSmith v2.3 | 6,546 | 11,934 | 164,621 | 630,100 |

Measured breakdown of the always-loaded file: 12,689 bytes total, of which 773 bytes is YAML
frontmatter (193 est tokens, mostly the trigger description that the skill index needs) and
11,908 bytes is body (2,977 est tokens).

Two numbers matter more than the totals:

- **MINIMAL's routine run (~5,672) is smaller than v2.3's always-loaded set (6,546).** The
  worst case of the new skill is cheaper than the best case of the old one.
- **MINIMAL is 1.53× frontend-design, not 0.3×.** I am not claiming to match 2,078. The extra
  ~1,100 tokens buy exactly four things frontend-design does not have and A7/A8 require: the
  craft floor (§7), the release control plane (§10–12), the two-row routing table (§8), and a
  trigger description. If a reviewer wants those 1,100 tokens back, the only honest way to get
  them is to give up a criterion, and I would rather state the price than hide it.

---

## What is in SKILL.md

The whole file, as it would ship. 242 lines, verified under the 500-line CI gate.

````markdown
---
name: sitesmith
description: "Design, build, redesign and audit websites and web apps that do not look
AI-generated. Use for landing pages, marketing sites, product and e-commerce pages, SaaS
sites, dashboards, web apps, local business sites, portfolios and editorial sites, and for
improving existing React, Next.js, Astro, Vue, Tailwind, shadcn or plain HTML/CSS projects.
Triggers on: build a website, make a landing page, design a page, redesign this, make it look
better, fix the design, improve the UI, this looks generic, choose colours or fonts, pick a
style, add animations, make it responsive, add dark mode, accessibility pass, hero section,
pricing table, dashboard layout, product page, component styling, design system, design
review, UI audit."
license: MIT
---

# sitesmith

You are the design lead at a studio whose work is recognised on sight and never mistaken for
anyone else's. This client came to you after rejecting a set of templated proposals. They
will recognise a template again.

Everything below is either a standard you hold yourself to or a machine that checks you.
Nothing below tells you what the page should look like. That is your job, and it is the
whole job.

## 1. Pin the subject

First, in one sentence: what this thing is, who it is for, and the single job this page has
to do. If the brief says, quote it. If the brief is vague, choose a concrete subject and
commit to it rather than designing for the vague version. A vague brief is not permission to
be general; it is a decision that has been handed to you.

Ask at most two questions, and only where the answer changes structure or scope. Ask them
once, in one message, each with a recommended default so that silence is a usable answer.
Then proceed. Never ask a client to describe taste in words. Show them instead.

## 2. Go and look at the world

The distinctive choices live in the subject's own world and nowhere else. Spend a real pass
on its materials, its instruments, the paperwork it generates, how its people write and
abbreviate, what it is measured in.

Write down concrete nouns, not adjectives. "Kraft interleaving paper, bone folder, sizing
drum, hide grades stamped in ink" is usable. "Artisanal, warm, authentic" is not: every
category produces the same adjectives, which is exactly why sites in different categories
end up looking the same.

If real material exists (a URL, a photograph, a price list, an existing brand), open it and
use it. If it does not, name what you are assuming and mark it as an assumption. The
assumptions go in the final report.

## 3. Three theses, and do not take the first

Write three one-line theses. A thesis names what this site *is*, not what it looks like: a
drawing-office sheet, a tide table, a seed-packet drawer. Rank them.

Now argue the case for the second as if the first did not exist. Your first idea is your most
typical idea, because it is the one the largest number of briefs would also produce. If after
arguing you still prefer the first, build it, and write one line naming what the second would
have given you that the first will not.

## 4. Name the defaults you are standing near

These are where current AI design lands. They are named so you can notice you have arrived at
one, not because they are forbidden. Each is right for some brief, and where the brief asks
for one, the brief wins and you build it well.

- Cream ground, high-contrast serif display, terracotta accent, generous whitespace.
- Near-black ground, one saturated accent, everything else neutral grey.
- Broadsheet: hairline rules, wide letter-spaced small caps, a thin visible grid.
- **Ours, measured.** Uppercase mono labels, hairline separators, tabular figures used as a
  motif, flat surfaces throughout. Three unrelated sitesmith briefs converged on precisely
  this combination and the portfolio failed as a portfolio. If your plan has three of those
  four, you have arrived at our house style, which is not a design.

The only thing forbidden is arriving somewhere without choosing it.

## 5. The token system, before any markup

Two passes. Do the first in thinking, not on the client's screen.

**Pass one.** Write down:

- Four to six colours as named CSS custom properties, and take the names from the subject's
  world rather than from the framework. `--paper --ink --caution --print` steers every later
  decision, because once a variable is called `--caution` the world has already answered
  where it goes. `--bg --surface --accent --muted` steers nothing, so every later decision
  gets made again from zero, and zero has a house style.
- At least two type roles, with a display face that is not the body face at a larger size.
  Type carries more personality than colour and it defaults harder.
- The layout idea, as an ASCII sketch. Not a list of sections.
- One signature element: the thing someone would describe to a colleague from memory.
  Everything around it stays quiet. Boldness is spent once.
- One risk taken against your category's own default, named in a line. A gaming shop on warm
  paper. A law firm that is not navy.

**Pass two.** Read pass one against the brief. Then take a neighbouring brief in the same
category and work it through for thirty seconds. If you would arrive somewhere similar, you
have designed the category rather than the client: change something structural and state what
changed and why.

Then write `.sitesmith/direction.md`, five lines, exactly this shape:

```text
thesis:    <one sentence>
palette:   --name #hex  (four to six)
type:      display <family> / body <family>
signature: <one sentence>
risk:      <one sentence>
```

That file is the only state this skill keeps, and it is what the finished render is measured
against. If you resume an interrupted build, it is the first thing you read.

## 6. Copy is design material

Write the words before or while you style them, never after. Placeholder copy produces
placeholder design, and a generic headline is the fastest route by which a distinctive layout
reverts to a template. The voice comes from the same world as the palette: a drawing office
numbers its sections `PROC-03`, a tide clock says `SLACK WATER`. Eyebrows, labels, empty
states, button text, error messages and the 404 are all design surface.

Two hard rules on copy, and only two. No em dashes. And no fabricated fact: a number, a
testimonial, a customer count, a certification, a delivery time or a price needs a source in
the brief or the evidence, and without one it does not go on the page, whatever it would do
for the composition. Tone, metaphor, rhythm and invented internal vocabulary are free.

## 7. The floor

This holds in every visual language. It is a floor, not a look. If a rule here can only be
satisfied one way, it is written wrong and should be rewritten.

- Works from 320px up. Nothing scrolls sideways at any width.
- Everything interactive is reachable by keyboard and visibly focused, with an indicator that
  is not the browser default and is 3:1 against whatever it sits on.
- Text contrast 4.5:1, large text and UI boundaries 3:1. Touch targets 24px minimum and 44px
  for anything primary. Form inputs at 16px or larger, or iOS zooms on focus.
- `prefers-reduced-motion` removes the motion and the work behind it, not just the visible
  part.
- Every state that exists is reachable: loading, empty, error, success, disabled, the
  long-name case, the zero-results case. A state you styled but nobody can enter is a picture
  of a state.
- Semantic HTML, one h1, a real heading order, real form labels, alt text that says what the
  image is doing there.
- Motion is one orchestrated moment or none. Scattered hover effects read as a machine.

**Never simplify these away.** Cut for simplicity, and you should: reach for the platform
before a library and a library before your own implementation of a solved problem. But the
floor above, the validation on any form that crosses a trust boundary, and anything the
client asked for by name are never the thing you cut.

## 8. Convention where the visitor operates

Originality is spent where the visitor is deciding: hero, section rhythm, typography,
imagery, texture, voice. Where the visitor is operating, follow the convention they already
know: navigation, forms, tables, checkout, search, error recovery. A memorable checkout is a
lost sale. Reuse the behaviour of a solved component; author its appearance yourself, from
the tokens in section 5. A site that looks like its component library has no design.

Open one of these when the page has that surface, and put it down afterwards:

| The visitor is | Open |
| --- | --- |
| Buying, or looking at a price | [floor/commerce.md](floor/commerce.md) |
| Operating a tool: dashboards, admin, tables, consoles | [floor/app.md](floor/app.md) |
| Reading or deciding only | nothing. Section 7 is the whole floor. |

## 9. Existing code

If code already exists, read [redesign.md](redesign.md) before changing one line. In short:
audit first; list what has to survive (brand marks, legal text, working journeys, URLs,
anything that ranks); and treat everything you extract as a description of the problem, never
as the target. The one exception is an explicit "clone this" in the client's own words. It is
never inferred.

## 10. Build

Read [stacks.md](stacks.md) once, before the first file, to establish what you are in and
what it wants. Never infer a stack from the brief.

While building, render what you changed:

```bash
node scripts/verify.mjs <url> --out .sitesmith/shots/preview --no-axe
```

That waiver buys iteration speed and can never produce a release verdict. Fix what it
reports. Two attempts on the same defect, then stop and report it unresolved rather than
trying a third thing.

Write at least one journey per interactive surface: a script that drives the real page and
asserts what changed, run by `node scripts/journey.mjs journeys/ --base <url>`. A state with
no journey has been drawn, not built.

## 11. Look at it

When it works, read [verify.md](verify.md), run the release checks, then open the screenshots
and write a specific criticism of each breakpoint before writing anything else. Not "the
spacing could be tighter". "At 375 the hero pushes the price below the fold and the eyebrow
is the same weight as the h1."

If your host can run an isolated reviewer, hand it the screenshots and the brief and nothing
else. If it cannot, do the same inline and open the critique with the literal line
`CRITIQUE: inline, not isolated`, so that nobody reads it as an independent opinion.

Two inspection rounds, maximum. Open each round with one word: `ship`, `fix` or `rebuild`. A
`rebuild` round does not also apply fixes. After the second round, whatever is still wrong
goes into the report and the loop ends.

## 12. Release

```bash
node scripts/verify.mjs <url> --out .sitesmith/shots
node scripts/journey.mjs journeys/ --base <url>
node scripts/gate.mjs "<pages>" --direction .sitesmith/direction.md --production
node scripts/ledger.mjs check <url> --project <name>
```

`gate.mjs` fails on placeholder copy, an unsourced claim, an empty brand mark, a value the
direction never declared, and a custom-property vocabulary made entirely of generic names.
`ledger.mjs` fingerprints the finished render against every site this skill has built before
and against a known-bad recipe that fails even on an empty ledger. It can only veto. It never
proposes anything, and it never stores a client URL.

On a veto: return to section 3, strike the vetoed thesis, build a different one. Two vetoes
and the run stops and reports rather than trying again.

When it is all green, run `node scripts/ledger.mjs commit <url> --project <name>` and write
`PRODUCTION-REPORT.md` naming every check that ran, every one that failed, and every
assumption from section 2 that is still unverified. A report with no failures and no
assumptions is a report nobody wrote.

Never edit a check so that it passes.

## 13. When two things disagree

1. Accessibility and platform requirements. Not a design decision, so not yours to trade.
2. What the client explicitly asked for, including a request that lands on a named default.
3. Facts. The brief decides the look; it never authorises a claim.
4. Existing brand and hard constraints.
5. Evidence gathered for this task.
6. General principles, and everything else in this file.

## 14. Attribution

Method re-expressed, not copied, from `frontend-design` and `impeccable` (Apache-2.0) and
`taste-skill` and `ui-ux-pro-max` (MIT). Notices and full licences travel with the bundle in
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

A line enters this file only by displacing one.
````

---

## Routing

There is **no router**. v2.3's router asked two questions (which mode, which task) and opened
one of eight files. MINIMAL asks one question, in one two-row table, and often opens nothing.

| v2.3 route | MINIMAL |
| --- | --- |
| Mode M (marketing) | no file. §7 is the whole floor for a page the visitor only reads. |
| Mode E (e-commerce) | `floor/commerce.md` |
| Mode P (product UI) | `floor/app.md` |
| Task SETUP | `stacks.md`, which every build reads anyway |
| Task NEW | the default path, §1→§12 |
| Task REDESIGN | `redesign.md` |
| Task COMPONENT | the default path. A pricing table is a page with one section. |
| Task AUDIT | §11 + `verify.md`, skipping §1–§6 |

The deletion of mode M is deliberate and is the argument in miniature: a marketing-specific
craft floor could only contain rules that are either universal or a look, and shipping a
file of looks for the most common kind of site is precisely how three unrelated briefs came
to share five moves.

Routing is by **what the visitor is doing on this surface**, per page not per project, which
is `impeccable/mode-based-visitor-registers` (adopt) reduced from four registers to two,
because Read and Persuade both resolve to "§7 and nothing else".

---

## How the creative direction is actually produced

By the host model, in thinking, from §1–§5 of `SKILL.md`. No script participates. The chain is
six steps and produces one five-line artifact:

1. **Pin the subject** (`frontend-design/subject-grounding-mandate`). Vagueness is converted
   into a commitment instead of absorbed as freedom.
2. **Look at the subject's world** (`sitesmith-current/evidence-before-direction`, reduced
   from a 6 KB file to a paragraph). Output constraint that does the actual work: **concrete
   nouns, not adjectives.** Adjectives are category-level and therefore convergent by
   construction; "bone folder" and "sizing drum" are not available to any other brief.
3. **Three theses, ranked, then argue for the second**
   (`impeccable/forced-index-direction-roll`, adapted to prose). See the honest note below.
4. **Check against the named defaults** (`frontend-design/named-cliche-calibration`, corrected;
   `impeccable/model-specific-rendition-prior-correction`, retargeted). Named, never banned,
   per C1.
5. **Two-pass token system** (`frontend-design/two-pass-token-system`,
   `typography-as-personality`, `signature-element-restraint`, `hero-as-thesis`). Pass one
   produces the palette, the type roles, the ASCII layout, the one signature and the one named
   risk. Pass two is the originality self-test (`frontend-design/self-critique-loop`).
6. **Write the five lines** and build from them
   (`sitesmith-current/contract-after-direction-plus-token-drift`: contract strictly after
   direction, which is the ordering the 0/8 convergence violated).

**On the anti-argmax step, honestly.** `forced-index-direction-roll` is measured — impeccable
found 30 of 35 identical concepts across 16 framings when the model picked its own top-ranked
idea. The measured fix is a hash-forced non-top-1 index. I have re-expressed it as prose
("argue for the second as if the first did not exist") rather than as a script, for two
reasons: a hash roll needs a script in the creative path, which is exactly the surface A4
polices even though selection is not design; and a script that picks the second item cannot be
audited for whether the model then quietly re-ranked to put its favourite second. The prose
version is weaker than the measured version and I am not going to pretend otherwise. Its
backstop is mechanical and end-of-run: the ledger veto in §12, which cannot be argued with.

---

## What stops three unrelated briefs converging

Four devices, in increasing hardness. Only the last two are mechanical, and I am stating which
is which because a candidate that claims all four are enforcement is lying.

**1. The generative rule diverges by construction (not enforceable).** "Derive from *this*
subject's world" has a different answer for a tannery, a tide clock and a seed library, and
"nouns not adjectives" is the operational form of that. This is the primary mechanism and it
is a persuasion, not a gate.

**2. The named defaults include our own measured recipe (self-checked).** §4 names the
round-8 combination — uppercase mono labels, hairline separators, tabular figures as motif,
flat surfaces — as *ours*, with the outcome attached. This is
`impeccable/model-specific-rendition-prior-correction` retargeted from their measured bias to
ours, which is what its ledger form note asks for: "adapt the technique for patterns our own
evaluators actually observe, not this exact example."

**3. World-derived token vocabulary (mechanical, cheap, new).** This is the highest-leverage
finding in `NORDRIG-AB-FORENSICS.md` §1 and nothing in v2.3 checks it. `gate.mjs` collects
every `--custom-property` name declared in the build's CSS and compares the set against a
fixed generic vocabulary:

```text
bg background surface surface-2 fg foreground text muted border accent primary
secondary card popover ring input destructive radius shadow
```

If ≥80% of declared names come from that list, the build fails with: *your token names came
from a framework, not from the subject.* This does not decide anything — it refuses a build
that never made a decision. It costs about thirty lines of code and it is the only check in
the design that attacks convergence *before* the render rather than after.

New mechanism, recorded as `minimal/world-derived-token-vocabulary-check`, derived from
`result:nordrig-ab` §1. It has no upstream source and needs its own red-team pass.

**4. The cross-project ledger, veto only (mechanical, end-of-run).**
`sitesmith-current/cross-project-anti-repeat-ledger` (adopt, confirmed) kept whole in shape and
smaller in code. `ledger.mjs check <url>` renders and fingerprints on six fields: ground
luminance band, display-face presence and class, token-vocabulary class, device counts
(uppercase-mono labels, hairline rules, tabular-figure blocks, flat-surface ratio), signature
share of viewport, macro-layout signature. It compares against (a) the hard-coded round-8
recipe, which fails even on an empty ledger, (b) the dark-ground/one-saturated-accent
monoculture from `PALETTE-ANALYSIS.md` finding 4, and (c) `~/.sitesmith/renders.jsonl`,
append-only, no client URLs.

**History may veto, never propose** (C7). The ledger has no path by which a stored fingerprint
becomes an input to a new design; it only ever returns pass or a named collision.

**5. Set-level diversity, on demand.** `ledger.mjs --set a.html b.html c.html` is
`sitesmith-current/portfolio-diversity-gate` (adopt). It runs for A9 and before anything enters
the showcase. It never runs during a customer build, because a single site cannot be measured
for a property that only exists across a set.

---

## Where the craft floor lives

Split three ways by whether the rule is universal, surface-specific, or executable.

| Rule class | Where | Cost | Example |
| --- | --- | --- | --- |
| Universal, judgement | `SKILL.md` §7, always loaded | ~250 tokens | "a state you styled but nobody can enter is a picture of a state" |
| Universal, numeric | `SKILL.md` §7, inline | ~40 words | 4.5:1, 3:1, 24px, 44px, 16px, 320px |
| Surface-specific | `floor/commerce.md`, `floor/app.md`, fetched | ~1,500 tokens each | sticky buy panel and mobile bottom bar; no motion near money; prices in tabular figures; trust strip carries only sourced claims |
| Executable | `verify.mjs`, `gate.mjs`, `journey.mjs` | 0 until run | axe in both schemes, overflow, dead links, console errors, placeholder scan, unmanifested images |

The writing rule for every prose line in the floor, stated inside §7 so it polices itself: *if
a rule here can only be satisfied one way, it is written wrong.* That is
`mech:craft-floor-without-look` from the nordrig forensics, and it is the difference between a
floor and a signature.

`floor/commerce.md` is where nordrig build B's list survives essentially intact — the purchase
path owning the accent, prices in tabular figures, sticky buy panel with mobile bottom bar,
trust strip with sourced claims only, no motion near money. Those rules lost the *creative*
comparison and won the *commerce* one, and the forensics is explicit that both builds were
judged not production-ready. Deleting them to be small would be the exact mistake the
counter-evidence section of `INSTRUCTION-BUDGET-VS-QUALITY.md` warns against.

---

## What the scripts do

Four. None of them can produce a design; each of them can only refuse one. That is
`C-no-mechanical-creativity` made structural rather than promised — there is no code left in
the bundle that emits a colour, a font, a layout or a direction.

### `verify.mjs` — unchanged, 13,431 bytes

Kept byte-for-byte from v2.3. Screenshots at 375/768/1440, axe in both colour schemes with a
missing scan treated as a blocking failure unless `--no-axe` is explicit, raw-HTML structural
checks (the live DOM auto-repairs a missing root and hides the defect), same-origin dead-link
crawl, console errors, failed requests, horizontal overflow, and `--font-stress`. Exit 0 clean
/ 1 blocking defect / 2 could not run.
(`sitesmith-current/verify-fail-closed-gates`, adopt.)

**This is the one place where smallness stops.** Every check in it exists because a real defect
shipped, its own comments name each episode, `benchmarks/06-redesign/before/` is a genuine
test-of-the-test, and A7 is stated in terms of this file. It is 13 KB and costs zero context.
There is no honest version of this candidate that shrinks it.

### `journey.mjs` — unchanged, 1,910 bytes

50 lines. Runs `journeys/*.spec.mjs` against a base URL and exits non-zero on the first
failure. The definition of a journey lives in the script's own header, which is why the 7.3 KB
`v2/40-interaction.md` could be deleted.
(`sitesmith-current/interaction-journeys`, adopt.)

### `gate.mjs` — new, replaces four scripts (~74 KB → ~18 KB)

One command, one release verdict on *honesty and fidelity*, kept separate from `verify.mjs`'s
verdict on *correctness* (`sitesmith-current/two-gate-separation-technical-vs-visual`, adopt).
Six checks:

1. **Placeholder and dummy-identifier scan** — Lorem Ipsum, "John Doe", "Acme", "Your Company",
   "Unlock your potential", placeholder image hosts, `<svg>` brand marks with no path data.
2. **Unsourced claim scan** — numeric, testimonial, certification, guarantee and delivery
   claims cross-referenced against `--evidence`; a numeric claim absent from the brief and the
   evidence fails. Governs claims only, never voice (C9): diegetic labels like `PROC-03` and
   invented section codes must not trip it, and the fixture set includes one to prove it.
3. **Token drift** — literal colour, spacing, radius and type-size values that no custom
   property declared.
4. **Direction fidelity, three checks only** — the hexes declared in `.sitesmith/direction.md`
   account for the majority of rendered area; the declared display family is loaded *and*
   applied to headings; the declared signature appears at all. Rendered in the default colour
   scheme, no exceptions (`sitesmith-current/direction-fidelity-render-check`, adopt, reduced
   from 23 KB to three assertions against five declared lines).
5. **World-derived token vocabulary** — the new check described above.
6. **Antipattern lint** — about twelve static rules, not impeccable's fifty-nine. The ledger's
   own failure note for `mechanical-antipattern-detector` says the registry is "a frozen
   snapshot of one aesthetic era"; fifty-nine frozen rules is a house style with a linter
   attached, so only the rules with no legitimate use survive
   (`impeccable/craft-floor-ban-list`, adopt, reduced).

`--production` is the strict mode; without it, draft state is tolerated and the exit message
says so.

### `ledger.mjs` — new, replaces three scripts (~29 KB → ~14 KB)

```text
ledger.mjs check  <url> --project <name>     render, fingerprint, compare, veto or pass
ledger.mjs commit <url> --project <name>     append the fingerprint, store no URL
ledger.mjs --set  <url> <url> <url>          set-level diversity, for A9 and the showcase
```

Described in full under "What stops three unrelated briefs converging".

### Degradation, and what happens with no browser

`tool-agnostic-preflight-detection` (adopt): `verify.md` states the preflight and the fallback
in one paragraph. If Playwright is absent, `verify.mjs` and `ledger.mjs check` exit 2, and the
skill must open the page manually and write, in the report, that **the mechanical release
verdict is missing**. It must never print a pass it did not earn
(`ui-ux-pro-max/zero-result-honesty`, adopt). A run without a browser produces a build and an
explicitly incomplete report, not a quieter success.

---

## Every loop, and its stop condition (A10)

| # | Loop | Trigger | Stop condition | If the stop fires |
| --- | --- | --- | --- | --- |
| L1 | Clarifying questions | brief silent on something that changes structure or scope | **one round, at most two questions**, each with a default | proceed on the defaults, record them as assumptions in §2 |
| L2 | Direction veto | `ledger.mjs check` returns a collision | **two vetoes** | run stops, reports the collision and the two theses tried; does not try a third |
| L3 | Build/edit | `verify.mjs --no-axe` reports a defect on the changed surface | **two attempts on the same defect** | report it unresolved and move on; it reappears at L4 |
| L4 | Inspection | screenshots exist | **two rounds**, each opening with `ship`/`fix`/`rebuild`; a `rebuild` round applies no fixes | whatever is still wrong goes into `PRODUCTION-REPORT.md`; the loop ends |
| L5 | Release | any of the four release commands fails | **two reruns** | write the failure into the report; never edit a check to make it pass |

Five loops, five hard integer caps, no loop whose exit depends on a subjective "until it is
good". Total worst case: 2 + 2 + 2 + 2 = one bounded run, and the run always terminates in a
written report rather than in a question.

`impeccable/bounded-finish-review-loop` (adopt) supplies L4's shape — round cap plus a
disposition declared before the work, so "keep polishing" is not reachable.

---

## Sub-agents, and hosts that do not have them (C8)

One sentence in §11 and nothing else. If the host can run an isolated reviewer, the critique
runs there with only the screenshots and the brief. If it cannot, the same critique runs
inline and must open with the literal line `CRITIQUE: inline, not isolated`
(`impeccable/dual-isolated-critique-subagents`, adapt, with the mandatory degraded-disclosure
banner). No other step in the skill mentions delegation. The acceptance test is that the
entire flow runs with sub-agents disabled and the only observable difference is that banner.

---

## Acceptance criteria, checked

| # | Criterion | How MINIMAL satisfies it |
| --- | --- | --- |
| A1 | one skill, one invocation | `SKILL.md` names no other skill to run. §14 credits upstream projects as *sources of method*, and the wording is "re-expressed, not copied", never "run". |
| A2 | control plane under 500 lines | **242 lines**, measured. |
| A3 | progressive loading | ALWAYS = 1 file / 3,172 est. ROUTINE ≈ 5,672, below v2.3's ALWAYS of 6,546. |
| A4 | creative decisions by the host model | no script in the bundle emits a colour, font, layout or direction. The four remaining scripts return pass/fail only. The direction engine (86 KB of Python) is deleted, so this is structural. |
| A5 | traceability | every adopted mechanism named by ledger key throughout this document; `SOURCE-REGISTRY.json` and `THIRD-PARTY-NOTICES.md` unchanged; the verbatim upstream copies stay in the repo under `docs/upstream/`. |
| A6 | rejected mechanisms have written reasons | the drop table below, plus the per-file deletion reasons above. |
| A7 | browser verification honest | `verify.mjs` byte-for-byte unchanged; `benchmarks/06-redesign/before/` still fails and CI asserts the non-zero exit. |
| A8 | holdout ≥ strongest baseline | procedure below. Unchanged from the charter: one unseen brief, one baseline, blind. |
| A9 | no house style across three builds | `ledger.mjs --set` over holdout + two prototypes. |
| A10 | loops terminate | five loops, five integer caps, table above. |

---

## How it is tested

**Test 0, first and cheapest: the re-expression smoke test.** The charter's own open risk is
`risk:reexpression-may-not-transfer` — frontend-design's power may live in its phrasing, not
its structure. Same brief, same model, two arms: our `SKILL.md` §1–§7 versus the upstream
55-line file. Blind-scored by two reviewers on the existing rubric. **If our re-expression
scores below the original, this candidate's premise is dead and no amount of production layer
rescues it.** It costs one brief and two builds. Run it before anything else is built.

**Repository gates (CI):**

| Gate | Asserts |
| --- | --- |
| `tools/check-repo.py` | `SKILL.md` < 500 lines; notices and licence texts present and hash-matched; no text traceable to `website-builder-setup` or `redesign-skill` (`C-no-unlicensed-text`) — extended with a string scan, since the paraphrase ban cannot be checked by file presence |
| `tools/context-budget.mjs` | ALWAYS ≤ 3,300 est tokens and ROUTINE ≤ 6,000 est tokens; either failing fails CI. A budget without a gate is a note. |
| `verify.mjs` on `benchmarks/06-redesign/before/` | **still exits non-zero.** CI fails if the control group passes. `C-control-group`. |
| `gate.mjs` fixtures | a page with only generic token names fails; a page with world-derived names passes; a fabricated testimonial fails; a page using `PROC-03`-style diegetic labels **passes**, proving the claim guard does not fire on voice (C9) |
| `ledger.mjs` fixtures | the round-8 recipe fails on an **empty** ledger; two builds differing on ≥3 fingerprint fields both pass; the same build committed twice is vetoed the second time |
| no-subagent run | the full flow completes with delegation disabled; the critique carries the `inline, not isolated` banner |

**Product-level tests:**

- **A8 holdout.** One unseen brief, chosen and sealed before the build. Baseline: upstream
  frontend-design plus a manual production pass, which is the strongest relevant arm and the
  only one that beat SiteSmith. Full site both sides, screenshots at three widths, blind
  adjudication. No new head-to-head arms (`C-no-h2h`).
- **A9 diversity.** `ledger.mjs --set` across the holdout and the two prototypes. The three
  briefs must be unrelated by construction, and the fingerprint fields must differ on at least
  three of six for every pair.
- **Honest-benchmark rule** (`ponytail/honest-benchmark-correction`, adopt): if the holdout
  loses, the number is published as it landed. No re-run without a changed hypothesis, per the
  charter's budget line of zero.

---

## Mechanisms adopted, by ledger key

Creative surface — all in `SKILL.md`:
`frontend-design/persona-framing`, `subject-grounding-mandate`, `hero-as-thesis`,
`two-pass-token-system`, `typography-as-personality`, `signature-element-restraint`,
`copy-as-design-material`, `self-critique-loop`, `brief-primacy-override`, `deliberate-motion`,
`structure-as-information`, `private-reasoning-before-reveal` (adapt),
`named-cliche-calibration` (investigate → adopted in corrected form: I name the clusters *and*
state the check against them explicitly, which is precisely what the red team found the source
did not do);
`impeccable/model-specific-rendition-prior-correction` (adapt, retargeted at our measured
recipe), `forced-index-direction-roll` (adapt, prose form),
`mode-based-visitor-registers` (reduced 4→2);
`taste-skill/brief-inference-design-read`, `em-dash-absolute-ban`,
`single-clarifying-question-cap`;
`sitesmith-current/evidence-before-direction`,
`contract-after-direction-plus-token-drift`, `mode-based-routing-not-defaults`;
`ai-dev-tasks/clarifying-questions-before-spec`;
`ponytail/seven-rung-simplicity-ladder` (reduced to one line: platform → library → own),
`explicit-never-simplify-carveouts`.

Craft floor:
`impeccable/craft-floor-ban-list` (reduced to absolutes with no legitimate use),
`preserve-vs-redesign-semantics`, `context-aware-no-argument-routing`;
`ui-ux-pro-max/static-ux-knowledge-tables` (reduced to eight numeric facts),
`stack-never-assume`, `master-overrides-persistence`;
`scroll-world/reduced-motion-full-degrade`;
`taste-skill/official-design-system-honesty-rule` (in `stacks.md`),
`redesign-mode-detection-and-audit-first` (in `redesign.md`);
`ai-website-cloner-template/interaction-model-identification-first`,
`exhaustive-state-capture`, `layered-asset-vigilance`, `no-guessing-completeness-mandate`,
`scope-defaults-block` (all in `redesign.md`).

Production layer:
`sitesmith-current/verify-fail-closed-gates`, `production-gate-honesty-checks`,
`interaction-journeys`, `two-gate-separation-technical-vs-visual`,
`direction-fidelity-render-check` (reduced to 3), `cross-project-anti-repeat-ledger`,
`portfolio-diversity-gate`, `progressive-disclosure-manifest`;
`impeccable/mechanical-antipattern-detector` (reduced 59→~12),
`bounded-finish-review-loop`, `dual-isolated-critique-subagents` (adapt, degraded disclosure),
`document-after-build-not-before`;
`ui-ux-pro-max/zero-result-honesty`;
`ai-website-cloner-template/tool-agnostic-preflight-detection`;
`ai-dev-tasks/checkbox-state-in-file` (adapt: exactly one state file, ever);
`before-implementing/self-contained-packaging-lesson`;
`ponytail/honest-benchmark-correction`.

New, no upstream source: `minimal/world-derived-token-vocabulary-check`. Needs its own red team.

---

## Mechanisms dropped from the adopt/adapt lists, with reasons

| Ledger key | Was | Dropped because |
| --- | --- | --- |
| `sitesmith-current/structurally-different-direction-gate` | adopt, confirmed | it gates **three rendered comps**, and round 8 is the evidence against it: all three passed the five-axis gate and the portfolio still failed. The fixed taxonomy of five axes plus four grammar fields is itself the shape that becomes a signature; its own record concedes "unrecognised phrasing becomes a skipped note". Kept as §3 prose plus the ledger's render fingerprint. **My most contestable drop.** |
| `ui-ux-pro-max/bm25-csv-retrieval` | adapt, confirmed | nothing left to retrieve from. Ranked retrieval over a fixed corpus returns the same top rows for similar queries; that is convergence with a search engine attached. |
| `ui-ux-pro-max/domain-auto-detect` | adapt | routes a query to a CSV. No CSVs. |
| `taste-skill/three-dial-system` + `ui-ux-pro-max/design-dials` | adapt ×2 | the dials were the *input to the direction engine that scored 40*. "Boldness 8" is a number that stands in for a decision. §5's one named risk does the same job in a sentence and cannot be consumed by a script. |
| `taste-skill/bias-correction-bans-with-override-paths` | adapt, contextCost **high** | C1 resolved naming over banning. Seventy-plus bans is the wall whose shape becomes the house style, and the source's own autopsy flags it. |
| `taste-skill/self-administered-preflight-checklist` | adapt, contextCost **high** | duplicates `gate.mjs` in prose. Instruction budget spent restating a program is the exact failure the measurement indicts. |
| `taste-skill/image-first-generation-discipline` | adapt, high | requires a paid image API. Charter budget for third-party spend is 0. |
| `taste-skill/gsap-canonical-code-skeletons` | adapt | C3: add a dependency only when the platform cannot do the thing. CSS scroll-driven animations and View Transitions cover the common cases; shipping GSAP skeletons pre-decides the answer. |
| `impeccable/mechanical-antipattern-detector` at full size | adopt | kept, reduced 59→~12. Its own record calls the registry "a frozen snapshot of one aesthetic era"; fifty-nine frozen rules is a house style enforced by a linter. |
| `sitesmith-current/assignment-blinded-critique-gate` | adapt | moved to `tools/`, not deleted. Its own form note: "opt-in for portfolio/benchmark claims, not a default single-site step". |
| `ai-dev-tasks/two-phase-approval-gate` | adapt | a hard stop-and-wait breaks non-interactive hosts and conflicts with the long-run rule. Reduced to L1: at most two questions, each with a default, silence is an answer. |
| `before-implementing/four-quadrant-unknowns-taxonomy`, `blindspot-pass`, `map-vs-territory-framing`, `deviation-policy`, `calibration-over-under-constrain` | adopt ×5 | each costs more tokens to explain than the behaviour it produces. Their combined output collapses to two clauses already in §1 and §2: ask at most two questions, and name what you are assuming. A taxonomy of kinds of not-knowing is a description of the model's own process. |
| `ai-website-cloner-template/asset-enumeration-and-batched-download` | adopt, unchallenged | a fifth script to maintain for a thing the model can do with one DOM query it writes at the time. Its own failure note admits no checked-in version exists. |
| `ai-website-cloner-template/spec-file-inline-only-contract`, `pre-dispatch-checklist-gate`, `complexity-budget-rule`, `git-worktree-parallel-builder-dispatch`, `interleaved-extract-and-build` | adopt/adapt | all presuppose dispatching sub-builders. MINIMAL has no fan-out, so there is no handoff to specify, gate or budget. C8: delegation is an optimisation, never a requirement. |
| `agency-agents/orch-02-persona-walkthrough` | adapt | a scroll-by-scroll two-voice persona simulation per fold is a large prose procedure whose output is an opinion. §11's "write a specific criticism of each breakpoint" is the same instrument at a twentieth of the cost. |
| `before-implementing/domain-modeling-context-adr`, `launch-packet-role-split`, `post-implementation-explainer` | adapt ×3 | documentation artifacts for a multi-agent handoff that does not exist here. `PRODUCTION-REPORT.md` is the single record, written after the build (`document-after-build-not-before`). |
| `scroll-world/*` scrub, seam, pacing, encoding mechanisms | adopt ×6 | scroll-scrubbed video is one technique for one kind of site. Six mechanisms of it in a general website skill is the catalogue anti-goal. `reduced-motion-full-degrade` is the only one that generalises, and it is kept. |
| `taste-skill/full-output-enforcement` | adopt, unchallenged | "do not truncate code with placeholder comments" is a host-behaviour instruction, not a design mechanism, and `gate.mjs`'s placeholder scan catches the artifact it produces. |
| v2.3 `blocks/` (not a ledger mechanism) | — | shared starting shapes produce shared shapes. Replaced by C6 stated in one sentence and by named ARIA APG patterns in `floor/app.md`. |

---

## Where smallness stops working

Six places, in descending confidence that I have got the call right.

**1. The production layer cannot shrink, and I did not shrink it.** `verify.mjs` stays
byte-for-byte. Any candidate that deletes it fails A7 on the day it is written. This is the
boundary the thesis genuinely does not cross, and the counter-evidence section of
`INSTRUCTION-BUDGET-VS-QUALITY.md` says so before I did.

**2. Deleting `blocks/` is my riskiest deletion and I cannot prove it is right.** A model
authoring a mega-menu with a correct focus trap, or an accessible combobox, from memory will
sometimes get it wrong. `floor/app.md` names the requirement and points at APG; nothing
supplies an implementation. The failure is partly detectable by journeys — but journeys are
author-written, so a behaviour nobody thought to test is invisible to the gate that is supposed
to catch it. The mitigation I have is weak: `gate.mjs` fails a build with no journey for an
interactive surface, which catches *absence of testing*, not *absence of correctness*.

**3. Deleting 1.44 MB of CSVs buys maintenance, not quality, and I should say so plainly.**
Those files are never in context on a routine run — 1.9% of the package loads, per the baseline
measurement. Therefore they *cannot* have caused the 40-vs-59 loss, and deleting them cannot be
credited with fixing it. The argument for deleting them is about the direction engine that
consumed them, which I have also deleted, and about not shipping half a megabyte of font names
to answer a question the model can already answer. That is a real argument. It is not a
measured one, and a reviewer is entitled to call this deletion decorative.

**4. The anti-argmax step is self-graded prose.** "Argue for the second thesis" can be
rubber-stamped in one sentence and nobody would know. The measured mechanism —
impeccable's hash-forced index, backed by 30-of-35 identical concepts — is strictly stronger
and I traded it for A4 purity and one fewer script. The ledger veto is the backstop, but it
fires at the end of a completed build, which is the most expensive possible place to discover
the direction was typical.

**5. One always-loaded file has no slack.** Every future lesson has to displace an existing
line. I have written that rule into `SKILL.md` itself, which makes it a governance promise, not
a mechanism. Governance promises in this repository have a mixed record: v2 also promised "a
rule enters the core only by displacing one", and the core still reached sixty rules.

**6. `redesign.md` compresses 12.9 KB of real procedure into ~5 KB.** The redesign audit is the
most procedural part of v2.3 and some of that procedure was earned — preserve-lists, ranking
URLs, journeys that must survive. A 2.5:1 compression will lose some of it. I have prioritised
the four extraction mechanisms that survive without a script and the preserve-list, and I have
no measurement telling me which of the rest mattered.

---

## Why this candidate might lose

**The evidence supports "spend the instruction budget differently", and I have also spent it
on deleting things the evidence never indicted.** The measurement is about the always-loaded
surface. Data corpora, block libraries and reference copies are not always-loaded. A candidate
that keeps them and only rewrites the always-loaded surface would satisfy every number in
`INSTRUCTION-BUDGET-VS-QUALITY.md` just as well, at lower risk. My extra deletions rest on a
mechanism argument — corpora feed convergence, shared shapes produce shared shapes — that is
plausible, forensically supported at n=1, and not measured.

**A single always-loaded file is a single point of failure.** If the re-expression smoke test
comes back negative, a candidate with a routed creative layer can swap one route and re-test.
MINIMAL has one surface; a negative result invalidates the whole creative half at once, and the
production half was never in dispute.

**Coverage is visibly thinner and reviewers reward coverage.** No blocks. No Vue, Svelte,
Angular, Flutter or React Native adapters. One commerce file where v2.3 had a mode file plus a
block library plus a products CSV. Against a candidate that keeps breadth, MINIMAL looks like a
promise that a capable model will fill the gaps, and that promise is exactly what
frontend-design made when it shipped a build that was judged not production-ready.

**I dropped a confirmed, adopt-rated mechanism (`structurally-different-direction-gate`) on a
reading of the round-8 evidence rather than on a measurement.** It is defensible that three
comps that all passed and still converged means the gate does not work. It is also defensible
that the gate was too coarse and should have been made finer. I picked the reading that
supports my thesis, and a red team should press on exactly that.

**3,172 is not 2,078.** The headline of this candidate is minimalism, and the number is 1.53×
the thing that won. If a rival candidate lands closer to 2,078 while still satisfying A7 and
A8, it beats MINIMAL at MINIMAL's own game.
