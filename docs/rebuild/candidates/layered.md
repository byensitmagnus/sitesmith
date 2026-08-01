---
title: Candidate — LAYERED (working name "Standard / Floor / Machine")
state: S5_ARCHITECTURE_CANDIDATES
status: proposal
author: independent architect, blind to the other two candidates
ai_generated: "(C)"
---

# Candidate: Standard / Floor / Machine

**Thesis in one line.** Layer by *when a decision is made and who makes it*, not by
topic: one always-loaded file that raises the model's standard and never tells it what
to produce; one fetched floor file that states what this kind of surface must *do*;
and unbounded machinery that measures, vetoes and gates but never authors.

That is a layering, so this is the layered candidate. But the layers are not the ones
in the assignment's suggestion, and section 2 says why the difference matters.

---

## 1. What the evidence forces, before any design

Four measurements, and what each one rules out.

| Measurement | What it rules out |
| --- | --- |
| frontend-design: 1 file, 2,078 est. tokens, beat 630k/139 files at 59–40 | Any architecture whose creative instruction lives in a file tree, a routing table, a CSV or a generator |
| v2.3 always-loaded 6,546 tokens; routine run pulls 1.9% of the package | "Load less" as the fix. Progressive loading already worked. The always-loaded *content* was wrong, not its size |
| 3 briefs → 1 style; `portfolioDiversity: fail`, showcase 0/8 | A craft floor with no thesis. Also: any single anti-convergence mechanism, since v2.3's five-axis direction gate *passed* while the portfolio failed |
| impeccable: 30/35 identical concepts across 16 framings | Trusting the model's own top-ranked idea. Convergence is inside one model, not just across briefs |

And two counter-measurements that stop this becoming "just ship frontend-design":

- nordrig build A won creatively and was **also** judged not production-ready: no
  verification, no journeys, no states, no commerce discipline, no stack detection,
  no release gate.
- v2.3's `verify.mjs` and its still-failing control group in
  `benchmarks/06-redesign/before/` are the only genuine test-of-a-test in the repo.

So: the winning creative method and the winning production machinery are in different
repositories and have never run in the same build. That is the whole opportunity.

---

## 2. The decomposition, and the two I rejected

### The axis I chose: **who decides, and at what moment**

| Layer | Who decides | When it is in context | Form | Budget |
| --- | --- | --- | --- | --- |
| **Standard** | the model, continuously | always | prose, second person, aimed at judgement | ~1,400 est. tokens |
| **Floor** | the model, but the outcome is not negotiable | fetched once, at BUILD, one file | prose stating outcomes, never appearance | ~800–1,000 est. tokens per file, one loaded |
| **Machine** | nothing; it measures and vetoes | never as instruction, only as output | scripts, schema, one fact list | 0 always-loaded tokens |

The control plane (routing, four passes, stop conditions, scripts table, precedence)
also lives in the always-loaded file, because a pointer that is not in context is not
a pointer. It is ~1,900 est. tokens and it is the price of A1 (one skill, no chaining).

### Rejected decomposition A: split by *topic* (creative / craft / production)

This is the split the S2 forensics proposes and it is nearly right, but it puts the
*whole* craft floor always-loaded. Measured against the actual failure that is
backwards. The craft floor is where convergence came from: `10-core.md` is sixty
rules and it is one of the three files v2.3 keeps permanently open. Sixty always-open
rules about what a page must contain is a description of a page, and three unrelated
briefs got the same page.

The correct cut is *inside* the floor, not around it. About eight floor items shape
judgement continuously and cost 155 tokens (section 6 of `SKILL.md`: responsive,
focus, reduced motion, states reachable, no placeholders, no unsourced claims). The
rest — purchase path, trust discipline, price formatting, table density, empty
states, form recovery — answer a question at a specific moment and are fetched then.
This is C10's own rule applied honestly: *anything that shapes taste is always
loaded; anything that answers a question is fetched.* Most of a craft floor answers
questions.

### Rejected decomposition B: split by *capability* (build / redesign / audit / component)

Task-shaped decomposition is what v2.3 has, and it produces `v2/tasks/*` plus
`blocks/` plus modes: three orthogonal routing dimensions, and the model has to hold
its position in all three. It also makes the creative surface a *step* rather than a
*standing condition*, which is precisely the mistake — a thesis you read once at step
4 and put down is not in mind when you name the fourth colour at step 11.

REDESIGN survives as a single overlay file, because `preserve-vs-redesign-semantics`
is real and cheap. COMPONENT and AUDIT do not survive as separate routes: a component
request is a BUILD with one surface, an audit is a VERIFY with no BUILD. Collapsing
them removes two routes and loses nothing measurable.

---

## 3. File tree

```
skills/sitesmith/
├── SKILL.md                      249 lines, 13,409 bytes, ~3,352 est. tokens  [ALWAYS]
├── floors/
│   ├── decide.md                 visitor deciding whether to care             [fetched, 1]
│   ├── buy.md                    visitor deciding whether to buy              [fetched, 1]
│   ├── operate.md                visitor already committed, now working       [fetched, 1]
│   └── redesign.md               overlay, read before touching existing code  [fetched, 0-1]
├── stacks/
│   ├── nextjs.md                 app router, RSC boundaries, font loading     [fetched, 1]
│   ├── react-vite.md                                                          [fetched, 1]
│   ├── astro.md                                                               [fetched, 1]
│   └── static.md                 no framework; also the fallback              [fetched, 1]
├── scripts/
│   ├── stack.mjs                 detect framework, write adapter name
│   ├── pick.mjs                  non-zero index into a list the model wrote
│   ├── history.mjs               render-fingerprint veto ledger (~/.sitesmith/)
│   ├── verify.mjs                screenshots 375/768/1440, axe both schemes, console, links, overflow
│   ├── journey.mjs               drives the real page, asserts state changed
│   ├── token-drift.mjs           values in CSS the state file never declared
│   ├── vocabulary.mjs            share of custom-property names from the subject's world   [NEW]
│   ├── antipattern.mjs           static AI-tell detector over shipped HTML/CSS
│   ├── production-gate.mjs       placeholders, unmanifested images, empty marks, unsourced claims
│   └── state.mjs                 validates .sitesmith/state.json
├── schema/
│   └── state.schema.json         every field names its consuming script
├── data/
│   └── font-families.txt         ~1,800 real Google Fonts family names, one per line, no metadata
├── references/                   verbatim upstream, provenance only, never read at build
├── LICENSES/
└── THIRD-PARTY-NOTICES.md

repo-level (not shipped in the skill):
tools/
├── context-budget.mjs            reports ALWAYS and ROUTINE; CI fails over ceiling
├── floor-lint.mjs                every floors/*.md has a "Three ways" section        [NEW]
├── state-fields-consumed.mjs     every schema field is read by a named script        [NEW]
├── portfolio-diversity.mjs       across the last N recorded builds; gates the skill, never a build
└── check-repo.py                 existing: SKILL.md < 500 lines, licence gate
```

**Deleted from v2.3:** `data/google-fonts.csv` (745 KB), `data/styles.csv`,
`data/ui-reasoning.csv`, `data/typography.csv`, `data/products.csv`,
`data/stacks/*.csv`, `scripts/design_system.py`, `scripts/search.py`,
`scripts/candidates.py`, `scripts/core.py`, `blocks/`, `v2/20-direction-lab.md`,
`scripts/direction-check.mjs`, `scripts/direction-record.mjs`,
`scripts/asset-plan.mjs`, `scripts/visual-assets.mjs`, `PIPELINE.json`.
Reasons are in section 12. Package total falls from ~630k est. tokens to roughly 45k,
of which ~3.4k is ever always-loaded.

---

## 4. What is always loaded, measured

I wrote the candidate `SKILL.md` in full (section 5 below), saved it, and counted its
bytes with `wc -c`, then divided by four. That is the method — the same method
`BASELINE-CONTEXT-BUDGET.json` uses, and it is not a real tokeniser.

| Segment | bytes | est. tokens |
| --- | ---: | ---: |
| frontmatter + title + preamble | 1,111 | 277 |
| §1 design from the subject | 1,230 | 307 |
| §2 non-argmax selection | 882 | 220 |
| §3 name the defaults | 982 | 245 |
| §4 spend boldness once | 930 | 232 |
| §5 copy is design material | 901 | 225 |
| §6 universal floor | 622 | 155 |
| §7 routing | 1,184 | 296 |
| §8 four passes | 3,000 | 750 |
| §9 one state file | 438 | 109 |
| §10 precedence | 300 | 75 |
| §11 scripts | 1,270 | 317 |
| §12 attribution | 559 | 139 |
| **total always-loaded** | **13,409** | **3,352** |

Read against the two benchmarks: **1.61× frontend-design's entire skill, 0.51× v2.3's
always-loaded set.** The creative surface proper (§1–§5) is **1,229 est. tokens**,
which is 59% of frontend-design's 2,078 — smaller, not larger, because the parts of
frontend-design that this candidate does not need to carry in prose (screenshot
advice, "responsive without announcing it") are carried by machinery instead.

The overage above frontend-design is entirely §7–§11: routing, four passes with stop
conditions, the state file and the scripts table. That is the literal cost of A1 and
A10. I am not going to pretend it away, and I would not trade it: a skill with no
control plane is the skill that was already judged not production-ready.

A routine run loads `SKILL.md` + one floor + one stack adapter ≈ **5,100 est.
tokens**, or roughly 11% of a 45k package. v2.3's routine run was 11,934 tokens and
1.9% of 630k. Both ratios are fine; only one of the absolute numbers is.

---

## 5. `SKILL.md`, in full

This is the candidate, not a sketch. 249 lines.

````markdown
---
name: sitesmith
description: "Design, build, redesign, audit and polish websites and web apps that do not look AI-generated. Use for landing pages, marketing sites, product and e-commerce pages, SaaS sites, dashboards, web apps, local business sites, portfolios and editorial sites, and for improving existing React, Next.js, Astro, Vue, Tailwind, shadcn or plain HTML/CSS projects. Triggers on: build a website, make a landing page, design a page, redesign this, make it look better, fix the design, improve the UI, this looks generic, choose colours or fonts, pick a style, add animations, make it responsive, add dark mode, accessibility pass, hero section, pricing table, dashboard layout, product page, component styling, design system, design review, UI audit."
license: MIT
---

# sitesmith

You are the design lead at a studio whose work is recognised because no two of its
sites look related to each other. This client has already rejected one templated
proposal. They will recognise the second one.

This file stays open for the whole job. Everything else is opened at one step and
closed again.

## 1. Design from the subject, not from the category

A brief tells you what category the site is in. Category is where every generic
site comes from, because every site in a category has the same brief.

So before anything visual, find the subject's own world: the materials it is made
of, the instruments the trade uses, the artefacts it produces, the words its people
say to each other and nobody else. That world is where the colours, the typeface
roles, the texture, the section labels and the microcopy come from. If your palette
would fit a competitor's site without editing, you designed the category.

The test that this actually happened is in the code: **the names of your CSS custom
properties are words from the subject's world.** `--paper --grid --caution --steel`
is a drawing office. `--bg --surface --accent` is any dark UI, and it will steer
nothing, because every decision after it has to be made again from nothing.
`scripts/vocabulary.mjs` reports the ratio; it never suggests a name.

If the brief does not say what the thing actually is, name it yourself: one concrete
subject, one audience, one job the page has to do. Commit and say so. Vagueness is
not freedom, it is the shortest path to the category.

## 2. Where your first idea comes from, and why it is not the one to build

Your first ranked idea is your most generic idea. It is the one every framing of
this brief produces.

So: in thinking, write **five to seven** candidate theses, each one a sentence naming
a concept from the subject's world and what it does to the page. Then run

```bash
node scripts/pick.mjs --subject "<subject>" --count <n>
```

It returns an index that is never 0. It reads nothing you wrote and it invents
nothing; it only decides which of your own candidates you build. Build that one.

You may override it, once, by writing one sentence naming the axis on which the
forced candidate is worse for this brief. The override is recorded. If you find
yourself overriding often, the number is telling you your list was one idea and six
decorations of it, which is the failure this step exists to catch.

## 3. Name the defaults. Do not ban them.

These are the places design lands when nobody chose:

- cream ground, large serif display, terracotta accent, generous whitespace
- near-black ground, one saturated accent, everything else neutral grey
- broadsheet layout, hairline rules, uppercase mono labels, tabular figures as a motif
- purple-to-blue gradients, blurred colour orbs, glass panels, bento grids
- three equal feature cards, pill shapes everywhere, decorative icons, centred hero

Every one of them is right for some brief. If the brief asks for one, give it to
them exactly, with conviction, and stop reading this section. What is not allowed is
*arriving* there without choosing. The third and fourth entries are this skill's own
past output; if your page is drifting toward them, it is drifting toward a house
style, which is the same failure as a template with different steps in front of it.

A brand colour is never slop. The tell is a gradient nobody decided on.

## 4. Spend boldness once

One signature element, executed properly and repeated with discipline. Everything
around it is quiet so that it reads. A blueprint grid costs three lines of CSS and
is unmistakable; five competing effects cost a week and read as noise.

Match the means to the ambition, never the ambition to the means. Take the smallest
implementation that achieves the direction you chose. Add a dependency only when the
platform cannot do the thing at all, and name in the state file which native API it
replaces.

Headings do not have to speak in the body's voice. Motion earns its place only when
the static page loses meaning without it; one orchestrated moment beats scattered
hover effects, which are themselves a tell. Numbered markers and rules and eyebrows
are structure, so use them only where the content is actually sequential, actually
divided, actually subordinate.

Before you build, remove one thing.

## 5. Copy is design material

Placeholder copy makes original visuals look templated, and it is where a page most
easily reverts to a template. Write the real words. Let the subject's vocabulary into
the labels, the eyebrows, the empty states, the button verbs. A section labelled
`PROC-03` only makes sense if the page is pretending to be a drawing sheet, and that
is exactly what grounding produces when it reaches the copy layer.

No em dashes in page copy, in any form. No Lorem Ipsum, no "John Doe", no "Acme
Corp", no "Unlock your potential".

Voice is free. Claims are not. A number, a testimonial, a certification, a customer
count, a guarantee, a delivery time: each needs a source you were given. Without one,
you write around it or you leave it out. The brief can ask for any look, including
one the evidence argues against, and you give it to them. The brief can never
authorise a fact.

## 6. The floor, everywhere, without announcing it

Every page you ship, in every direction, regardless of look:

- works from 360px up, without horizontal scroll at any width
- keyboard reachable, with a focus ring you can actually see on your own background
- honours `prefers-reduced-motion` by not loading the motion, not by hiding it
- has every state the surface can be in, and each one reachable by a real interaction
- has no placeholder image, no empty brand mark, no dead link in the shipped build
- says nothing it cannot source

The rest of the floor depends on what the visitor is doing, and it is one file.

## 7. Route: what is the visitor doing on this surface?

Route per surface, not per project. A shop's About page is `decide`; its order
console is `operate`. One design system across all of them.

| The visitor is | Floor | Open |
| --- | --- | --- |
| deciding whether to care | `decide` | `floors/decide.md` |
| deciding whether to buy, and from whom | `buy` | `floors/buy.md` |
| already committed, and now working | `operate` | `floors/operate.md` |

Originality is spent on surfaces where the visitor is *deciding*: hero, section
transitions, imagery, typography, texture, copy voice. Convention is kept on
surfaces where the visitor is *operating*: checkout, forms, navigation, tables,
errors. Novelty there costs money and trust, and it is not where anyone remembers
you from.

Existing code in the repository? Read `floors/redesign.md`
first, before you touch anything. What is extracted from the old site describes what
is being replaced and lists what must survive. It never decides what to build. The
one exception is a request that uses the words clone, match or replicate, which is
never inferred.

## 8. Four passes

**READ.** The brief, the repository, the subject. Run `node scripts/stack.mjs detect .`
and never assume a framework. Separate what you do not know into: facts you can look
up, questions only the client can answer, taste they will recognise but cannot
describe, and things nobody has thought of yet. Look up the first. Ask at most three
of the second, lettered, in one message, once. Show the third rather than asking for
it. Say the fourth out loud. Then write the state file.
*Stop:* state file validates. *If the user does not answer:* proceed on written
assumptions, listed in the state file. There is no second round of questions.

**THESIS.** Sections 1 to 5, in thinking. Show the user the direction only once it is
one you would defend. Then `node scripts/history.mjs check` against your own past
builds. A match is a veto and you move; it is never a suggestion, and it never
contributes a colour, a typeface or a layout.
*Stop:* thesis, four to six named tokens with hex values, two or more type roles, one
signature, one deliberate risk, all written to the state file. *Cap:* two vetoes.
On the third, record the collision in the state file and build the least-colliding
candidate rather than looping.

**BUILD.** Open the floor file and the stack adapter named in the state file. Nothing
else. Build the whole thing: no truncation, no "rest unchanged", no comment standing
in for code. Reuse behaviour, author appearance: take an accessible combobox or focus
trap from wherever it is solved, and give it your tokens, never its own. Write at
least one journey per surface that drives the real page and asserts what changed.
While iterating, render only what you changed:

```bash
node scripts/verify.mjs <url> --out .sitesmith/shots/preview --no-axe
```

*Stop:* every surface in the state file is built and every state in it is reachable.
*If reality contradicts the plan:* small contradictions, adapt and note it; a
contradiction that changes the thesis, stop and say so.

**VERIFY.** Two gates, in this order, and never merged.

```bash
node scripts/verify.mjs <url> --out .sitesmith/shots
node scripts/journey.mjs journeys/ --base <url>
node scripts/token-drift.mjs "<pages>" --state .sitesmith/state.json
node scripts/vocabulary.mjs "<pages>" --state .sitesmith/state.json
node scripts/antipattern.mjs "<pages>"
node scripts/production-gate.mjs "<pages>" --state .sitesmith/state.json --production
```

Then, and only then, the second gate: open the screenshots and write what is wrong
with the page *before* re-reading your own thesis. Compare afterwards. Where the
critique and the thesis disagree, the screenshots win. If the host offers an isolated
agent, give it the screenshots and not the thesis and let it write that critique
instead.
*Stop:* the report is written. *Cap:* two fix rounds. Anything still failing after
two is written into the report by name. A skill that reports its own failures is
worth more than one that loops until it can claim a pass.

## 9. One state file

`.sitesmith/state.json`, validated by `node scripts/state.mjs`. It exists because
scripts read it. Every field in `schema/state.schema.json` names the script that
consumes it; a field no script reads is deleted rather than documented. There is no
second state file, no per-phase file and no design-system document written before the
design exists. Write the design system down *after* the build, from what shipped.

## 10. Precedence

1. the user's explicit brief
2. factual truth, for anything a reader would treat as a claim
3. existing brand marks, legal copy and working journeys in a redesign
4. accessibility and platform floors in section 6
5. the floor file for this surface
6. everything else in this file

## 11. Scripts

Scripts verify, retrieve and gate. No script decides the design.

| Script | What it does |
| --- | --- |
| `scripts/stack.mjs` | Detects Next.js, Astro, React/Vite or plain static; writes the adapter name |
| `scripts/pick.mjs` | Returns a non-zero index into a list you wrote |
| `scripts/history.mjs` | Vetoes a render fingerprint you have shipped before |
| `scripts/verify.mjs` | Screenshots at 375/768/1440, axe in both schemes, console, dead links, overflow |
| `scripts/journey.mjs` | Drives the real page and asserts the state changed |
| `scripts/token-drift.mjs` | Values in the CSS the state file never declared |
| `scripts/vocabulary.mjs` | Share of custom-property names drawn from the subject's world |
| `scripts/antipattern.mjs` | Static check for known AI tells in the shipped HTML and CSS |
| `scripts/production-gate.mjs` | Placeholders, unmanifested images, empty brand marks, unsourced claims |
| `scripts/state.mjs` | Validates the state file against the schema |

Every one of them fails closed. A check that could not run says so and does not print
a pass. If no browser is available, say that the mechanical verdict is missing rather
than describing the page as verified. If a lookup returns nothing, say it returned
nothing.

## 12. Attribution

Mechanisms in this file descend from [frontend-design](https://github.com/anthropics/claude-plugins-official)
(Apache-2.0) and [impeccable](https://github.com/pbakaus/impeccable) (Apache-2.0),
[taste-skill](https://github.com/Leonxlnx/taste-skill) (MIT) and
[ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (MIT).
Notices and licence copies in `THIRD-PARTY-NOTICES.md`,
verbatim upstream text in references/ (`references/README.md`), which is provenance and
is not read during a build.
````

---

## 6. What actually produces the creative direction

The host model, reasoning in thinking, against §1–§5 of `SKILL.md` — 1,229 estimated
tokens of prose. Nothing else. There is no direction engine, no candidate search, no
CSV lookup, no comp renderer and no dial.

The generative step is concrete and has three named outputs, so it is falsifiable:

1. **A subject world.** Materials, instruments, artefacts, vernacular of *this*
   subject. Not the category. (`frontend-design/subject-grounding-mandate`,
   `sitesmith-current/evidence-before-direction`.)
2. **Four to six tokens whose names are words from that world.** This is the part
   nordrig proves in code: A's `--paper --grid --caution --steel` steered every later
   decision; B's `--bg --surface --accent` steered nothing. The token layer is
   written before the components, so a subject-grounded token layer is the mechanism,
   not a symptom of one.
3. **One signature and one deliberate risk**, both named in the state file.
   (`frontend-design/signature-element-restraint`, and nordrig A's explicit
   "one aesthetic risk" line item.)

**`vocabulary.mjs` is the new mechanism that makes (2) checkable without deciding
anything.** It reads the shipped CSS, collects the custom-property names, and reports
what share of them appear in the noun list the model itself wrote into
`state.thesis.world_nouns`, versus a fixed generic list (`bg`, `surface`, `accent`,
`primary`, `secondary`, `muted`, `border`, `card`, `foreground`, `ring`, `input`,
`popover`, `destructive`). It never proposes a name, never rejects a hex, and never
knows what the site is about. It reports a ratio and fails below a floor. That
converts the single strongest finding in `NORDRIG-AB-FORENSICS.md` from an anecdote
into a gate, and I have not seen it proposed anywhere in the ledger.

Failure mode I have to state: the model can game it by renaming `--bg` to `--slate`
and calling slate a world noun. The mitigation is that the noun list is written at
THESIS, before the CSS exists, and `state.mjs` freezes it; renaming after the fact
requires editing a frozen field, which `state.mjs` rejects. It is still gameable by a
model that plans to game it. I would rather ship a gameable measurement than an
unmeasured claim.

---

## 7. What stops three unrelated briefs from converging

Four mechanisms, at four different points, with four different failure modes. One is
not enough and v2.3 proved it: its five-axis direction gate **passed** on tannery,
tideworks and seed library while the portfolio failed. A single anti-convergence gate
is a gate you learn to satisfy.

### 7.1 At idea selection, inside one run — non-argmax pick

`impeccable/forced-index-direction-roll` (adapt). The model writes 5–7 grounded
candidates in thinking. `pick.mjs` takes `sha256(subject + YYYY-MM-DD)`, reduces it
mod `n-1`, adds 1, and prints an index that is never 0. The model builds that
candidate.

Justification is measured, not aesthetic: 30 of 35 concepts identical across 16
framings when the model picked its own top-ranked idea. Argmax over a model's own
ranking is deterministic; the ranking is the convergence.

**Why this does not violate `C-no-mechanical-creativity`:** the script has no
knowledge of the design. It receives a subject string and a count. Every candidate on
the list was authored by the model. The script chooses *which of the model's designs*
is built, not *what* is built. That is the same class of decision as a coin toss
between two of your own sketches.

**Honest exposure:** an adjudicator could still read "a hash chose the design" as
mechanical creativity. I would defend it and I would not be certain of winning. The
override path exists partly for that reason, and partly because forcing index 4 on a
list where 4 is genuinely wrong is a real cost. Overrides are counted in the state
file, and if override rate across builds exceeds 50%, the mechanism has failed and
CI says so rather than the mechanism quietly persisting.

### 7.2 Across runs — a fingerprint ledger that may only veto

`sitesmith-current/cross-project-anti-repeat-ledger`, resolved by C7 as
**history may veto, never propose.** `history.mjs check` fingerprints the *rendered*
page — palette buckets, display/body type class, surface treatment, label treatment,
figure treatment, depth treatment — against an append-only `~/.sitesmith/history.jsonl`
that stores no client URLs. A match blocks; the model moves to another candidate. The
ledger never returns a colour, a typeface or a layout, because a history that
proposes is a house style with a database.

The hard-coded known-bad seed is retained and extended: the round-8 recipe (uppercase
mono labels + hairline separators + tabular figures as motif + flat surfaces) and the
warm-accent-on-near-black arrangement flagged as finding 4 in `PALETTE-ANALYSIS.md`
must keep tripping on a clean installation, and CI fails if they stop.

### 7.3 In the always-loaded surface — name the defaults, including our own

`frontend-design/brief-primacy-override` plus the naming discipline read directly from
`frontend-design/SKILL.md:31`. (I am not citing `named-cliche-calibration`: the red
team refuted that claim as stated, and it conflated two paragraphs. What I adopt is
the naming paragraph itself, which is real, and the self-critique paragraph, which is
`self-critique-loop`.)

The important addition: **two of the five named clusters are SiteSmith's own past
output.** Naming your own house style in the surface that is always in context is the
cheapest anti-convergence move available and it costs 245 tokens. A ban list would
have the same effect for one round and then become the new signature, which is C1's
whole argument.

### 7.4 As a release gate on the skill, never on a build

`sitesmith-current/portfolio-diversity-gate`. `tools/portfolio-diversity.mjs` runs in
repo CI across the last N recorded fingerprints. **A customer build never blocks on
it** — a shop is not responsible for what a portfolio looks like. It is the
measurement that tells us whether 7.1–7.3 are working, and it is the acceptance
criterion A9 that the whole rebuild is judged on.

### Why these four and not more

Because every additional gate is a thing to satisfy, and satisfying gates is how the
house style formed. Three of the four cost nothing at build time; the fourth costs one
hash.

---

## 8. Where the craft floor lives, and how it avoids being a look

Split in two, by C10's own rule.

**Universal floor — 6 bullets, 155 est. tokens, always loaded (§6).** Responsive,
focus visible, reduced motion honoured by not loading motion, every state reachable,
nothing placeholder in the shipped build, nothing unsourced. These are true of every
site in every visual language, they shape judgement continuously, and they are one
sentence each. `scroll-world/reduced-motion-full-degrade` is why the motion bullet is
phrased as "not loading" rather than "not animating".

**Surface floor — one fetched file at BUILD.** Three files, routed by what the visitor
is doing (`impeccable/mode-based-visitor-registers`,
`sitesmith-current/mode-based-routing-not-defaults`). Naming them by the verb rather
than the site category is deliberate: it forces per-surface routing without anyone
having to notice that a shop's About page is "marketing".

- `decide.md` — the argument's shape, evidence placement, what the hero must resolve,
  scannability, contact and conversion paths, editorial rhythm.
- `buy.md` — the purchase path, price formatting and tabular figures, trust discipline
  with locked claims only, stock and delivery truth, no motion near money, cart and
  checkout states, mobile purchase affordance.
- `operate.md` — density and scanning, table and list behaviour, empty/loading/error/
  partial states, destructive-action confirmation, keyboard-first operation,
  persistence and recovery, real design systems used as packages rather than
  imitated in hand-rolled CSS (`taste-skill/brief-to-design-system-router`, relocated
  here from always-loaded).

**The authoring constraint that keeps a floor from being a look — the three-renditions
rule.** Every floor file must contain a `## Three ways` section in which each
non-obvious outcome is shown satisfied in three visually unrelated ways. Example, from
`buy.md`:

> **Outcome: the price is unambiguous and comparable at a glance.**
> Three ways: tabular lining figures in a mono face on a flat surface; a large
> humanist numeral with the currency set as a superscript in the display face; the
> figure set in the body face inside a bordered spec block that also carries delivery
> and warranty, so comparison happens by row rather than by weight.

`tools/floor-lint.mjs` fails CI if a floor file has no `## Three ways` section or if
any listed outcome has fewer than three renditions. This is authoring discipline made
mechanical. It is the direct answer to the nordrig conclusion that *a rule which can
only be satisfied one way is a house style with a compliance report attached.*

Everything about appearance is banned from floor files by the same lint: no hex
values, no font names, no radius values, no spacing scale. A floor file that contains
a hex value fails the build of the skill.

---

## 9. Typed state: earned, but only under one rule

**Verdict: earned, at one file, under a consumption rule. The phase-machine version is
ceremony.**

A typed `brief → thesis → design system → build → verified` pipeline as a *sequence of
documents* is exactly what v2.3 shipped — `BRIEF.md`, `DIRECTION.md`,
`DESIGN-SYSTEM.md`, `INTERACTIONS.md`, `ASSET-MANIFEST.md`, `STACK.md`,
`PRODUCTION-REPORT.md` — and the ledger's own note on `checkbox-state-in-file` names
the risk: "proliferating into a state file per phase, mirroring the 139-file sprawl
that already lost once."

But state cannot be deleted, because the machinery that makes this candidate
production-grade is machinery that reads state. `token-drift.mjs` needs declared
tokens. `vocabulary.mjs` needs the world-noun list. `history.mjs` needs a fingerprint.
`production-gate.mjs` needs the claim inventory. Remove state and every gate becomes a
prose assertion, which is the thing frontend-design's build was faulted for.

**The rule that separates the two: a state field exists only if a script reads it.**
`schema/state.schema.json` carries a `consumedBy` annotation on every property, and
`tools/state-fields-consumed.mjs` greps the scripts for each field name and fails CI
on any field nothing reads. That makes "is this ceremony?" a test rather than an
argument.

The whole thing, one file, roughly forty lines:

```jsonc
{
  "subject": "…",                    // consumedBy: pick.mjs, history.mjs
  "audience": "…",                   // consumedBy: (none) → would be DELETED by the lint
  "job": "…",                        // consumedBy: (none) → DELETED
  "stack": "astro",                  // consumedBy: stack.mjs (written), SKILL.md §8 (read)
  "surfaces": [
    { "path": "/", "floor": "decide", "states": ["default", "no-js"] },
    { "path": "/p/[slug]", "floor": "buy", "states": ["in-stock", "sold-out", "error"] }
  ],                                 // consumedBy: journey.mjs, production-gate.mjs
  "thesis": {
    "sentence": "…",                 // consumedBy: (none as text) → kept ONLY as the blinded-critique comparand
    "world_nouns": ["paper", "grid", "caution", "steel", "plate"],  // consumedBy: vocabulary.mjs
    "candidates_written": 6,         // consumedBy: pick.mjs, portfolio-diversity.mjs
    "picked_index": 4,               // consumedBy: pick.mjs
    "override": null                 // consumedBy: tools/portfolio-diversity.mjs (override-rate check)
  },
  "tokens": { "--paper": "#f4f1e8", "--caution": "#e2600a" },  // consumedBy: token-drift.mjs
  "type_roles": { "display": "Syne", "body": "IBM Plex Sans", "mono": "IBM Plex Mono" }, // consumedBy: token-drift.mjs, production-gate.mjs
  "signature": "blueprint grid, 24px, 4% ink",  // consumedBy: (none) → kept as critique comparand
  "risk": "light paper ground on a gaming-PC shop",  // consumedBy: (none) → critique comparand
  "claims": [
    { "text": "2 years warranty", "source": "brief line 14" }
  ],                                 // consumedBy: production-gate.mjs
  "dependencies": [
    { "name": "none", "replaces": null }
  ],                                 // consumedBy: (reported only)
  "assumptions": ["…"],              // consumedBy: (reported only)
  "fingerprint": null                // consumedBy: history.mjs (written at VERIFY)
}
```

Note what the lint does to that draft: `audience` and `job` have no consumer and are
deleted from the schema. They still matter, and they still get written — into the
model's own thinking and into the report prose. They do not become typed state, because
typed state that nothing reads is a form to fill in. `thesis.sentence`, `signature` and
`risk` survive only because the blinded critique in VERIFY reads them *after* writing
its critique, which is a named consumer.

I am deliberately not making the state a phase machine. There is no `phase` field, no
transition validation and no resume protocol. A build that is interrupted is restarted
by reading the state file and looking at what exists on disk, the way a person would.

---

## 10. Every loop, and what stops it

| Loop | Where | Cap | What happens at the cap |
| --- | --- | --- | --- |
| Clarifying questions | READ | 1 round, ≤3 lettered questions | Proceed on written assumptions recorded in the state file. No second round, ever |
| Candidate re-roll after a history veto | THESIS | 2 vetoes | Record the collision, build the least-colliding candidate, say so in the report |
| Pick override | THESIS | 1 per build | None available; the forced index stands |
| Preview render while editing | BUILD | none, but `--no-axe` output can never produce a verdict | n/a — this loop is bounded by the model finishing the surfaces in the state file, not by a counter |
| Deviation when reality contradicts the plan | BUILD | small deviations unbounded and noted; a thesis-level contradiction stops immediately | Stop and report, do not re-thesis silently |
| Fix rounds after VERIFY | VERIFY | 2 | Remaining failures written into the report **by name**; the report is delivered as HOLD |
| Critique-driven polish | VERIFY | folded into the 2 fix rounds | Same |
| Self-improvement of the skill | none exists | n/a | There is no loop that edits the skill. The charter's anti-goal list forbids it |

A10 is satisfied because every row has a cap and a stated consequence. The row that
usually gets faked is the last one in a VERIFY loop: most designs say "iterate until
it passes", which is unbounded. This one says the report ships with named failures, and
`sitesmith-current/verify-fail-closed-gates` plus `zero-result-honesty` are what make
that a real outcome rather than an embarrassing one.

---

## 11. Working with no sub-agents

`C8` requires it and this candidate has exactly one place where delegation would be
natural: the blinded critique.

Degradation is written into `SKILL.md` §8 rather than into a capability table:
**write the critique from the screenshots before re-reading your own thesis, then
compare.** Sequencing gives most of the benefit of blinding on a host with no
sub-agents, because the anchor being defended against is the model's own stated
intention, and not reading it is achievable in one context. Where an isolated agent
exists, hand it the screenshots and withhold the state file, which is strictly better.

Nothing else in the design has a delegation-shaped step. No orchestrator, no fan-out,
no worker roles, no launch packets. Every `orch-*` mechanism in the ledger that
requires a fleet is rejected in section 12.

---

## 12. Mechanisms

### Adopted, with ledger keys

**Creative surface (§1–§5).** `frontend-design/persona-framing`,
`frontend-design/subject-grounding-mandate`, `frontend-design/hero-as-thesis`,
`frontend-design/two-pass-token-system`, `frontend-design/self-critique-loop`,
`frontend-design/brief-primacy-override`, `frontend-design/signature-element-restraint`,
`frontend-design/typography-as-personality`, `frontend-design/deliberate-motion`,
`frontend-design/structure-as-information`, `frontend-design/copy-as-design-material`,
`frontend-design/private-reasoning-before-reveal`, `taste-skill/em-dash-absolute-ban`,
`taste-skill/brief-inference-design-read`, `ponytail/seven-rung-simplicity-ladder`
(as "match the means to the ambition"), `ponytail/explicit-never-simplify-carveouts`
(the §6 floor is the never-cut list), `impeccable/forced-index-direction-roll`,
`impeccable/craft-floor-ban-list` (only the absolutes: fabricated proof, Lorem Ipsum,
placeholder names).

**Control plane (§7–§11).** `sitesmith-current/mode-based-routing-not-defaults`,
`impeccable/mode-based-visitor-registers`, `impeccable/preserve-vs-redesign-semantics`,
`taste-skill/redesign-mode-detection-and-audit-first`,
`ui-ux-pro-max/stack-never-assume`,
`ai-website-cloner-template/tool-agnostic-preflight-detection`,
`ai-dev-tasks/clarifying-questions-before-spec`,
`taste-skill/single-clarifying-question-cap`,
`before-implementing/four-quadrant-unknowns-taxonomy`,
`before-implementing/unknown-knowns-prototypes`,
`before-implementing/deviation-policy`,
`before-implementing/map-vs-territory-framing`,
`before-implementing/self-contained-packaging-lesson`,
`sitesmith-current/progressive-disclosure-manifest`,
`ai-website-cloner-template/scope-defaults-block`,
`ai-website-cloner-template/no-guessing-completeness-mandate`,
`taste-skill/full-output-enforcement`,
`ui-ux-pro-max/master-overrides-persistence` and
`ai-dev-tasks/checkbox-state-in-file` (both collapsed into the one state file),
`impeccable/document-after-build-not-before`,
`impeccable/bounded-finish-review-loop`,
`sitesmith-current/two-gate-separation-technical-vs-visual`,
`sitesmith-current/assignment-blinded-critique-gate` and
`impeccable/dual-isolated-critique-subagents` (both in the degradable form of §11),
`ui-ux-pro-max/zero-result-honesty`,
`taste-skill/official-design-system-honesty-rule`.

**Machine.** `sitesmith-current/verify-fail-closed-gates`,
`sitesmith-current/production-gate-honesty-checks`,
`sitesmith-current/interaction-journeys`,
`sitesmith-current/direction-fidelity-render-check` (folded into `vocabulary.mjs` and
the token-drift check against the state file, rather than a separate script),
`sitesmith-current/contract-after-direction-plus-token-drift`,
`sitesmith-current/cross-project-anti-repeat-ledger`,
`sitesmith-current/portfolio-diversity-gate`,
`impeccable/mechanical-antipattern-detector`,
`sitesmith-current/evidence-before-direction`,
`ai-website-cloner-template/exhaustive-state-capture` and
`interaction-model-identification-first` (both inside `floors/redesign.md`),
`scroll-world/reduced-motion-full-degrade`,
`frontend-design/css-specificity-caution` (relocated into `stacks/*.md`),
`taste-skill/brief-to-design-system-router` (relocated into `floors/operate.md`),
`ponytail/honest-benchmark-correction` (a repo practice, not a skill file).

New, not from the ledger: **token-vocabulary derivation check** (`vocabulary.mjs`),
**three-renditions floor lint** (`floor-lint.mjs`), **state-field consumption lint**
(`state-fields-consumed.mjs`).

### Dropped from the adopt list, with reasons

| Mechanism | Why it is not in this candidate |
| --- | --- |
| `sitesmith-current/structurally-different-direction-gate` | Measured to **pass** on tannery, tideworks and seed library while the portfolio failed. Three rendered comps per build is the single most expensive step in v2.3 and it bought a gate that was satisfiable without diverging. Replaced by 7.1 + 7.2, which cost one hash and one lookup |
| `ui-ux-pro-max/static-ux-knowledge-tables` | Measure, do not memorise. `verify.mjs` measures contrast, target size, focus and overflow on the real render; a table telling the model the thresholds is 1.4 MB of package that a browser check makes redundant, and `PALETTE-ANALYSIS.md` finding 4 shows a retrieved corpus is itself a convergence risk |
| `ui-ux-pro-max/design-review-subagent-and-heuristic-audit` | The sub-agent half breaks C8 portability. The heuristic half survives as `antipattern.mjs` |
| `taste-skill/three-dial-system` and `ui-ux-pro-max/design-dials` | Dials are a vocabulary for steering a generator. There is no generator. Keeping them would leave a mechanical-creativity surface with nothing behind it |
| `taste-skill/bias-correction-bans-with-override-paths` | C1: naming beats banning. A 70-item ban list with override paths is high context cost and is the exact mechanism that turns anti-slop into a signature |
| `taste-skill/self-administered-preflight-checklist` | High context cost, and a checklist the model administers to itself is the thing `antipattern.mjs` does for real |
| `taste-skill/image-first-generation-discipline` | Requires image generation. No paid API is available and none will be added |
| `taste-skill/gsap-canonical-code-skeletons` | A dependency-specific code recipe. Belongs in a stack adapter at most; GSAP is rarely the smallest implementation |
| `ponytail/self-validating-llm-judge` | Validating a judge needs a labelled set this repo does not have. An unvalidated judge presented as evidence is worse than no judge |
| `ai-dev-tasks/two-phase-approval-gate` | Conflicts with autonomy and with the project's own "decide, do not ask" rule. Replaced by writing the surface list into the state file before BUILD, which is reviewable without stopping |
| `agency-agents/orch-02-persona-walkthrough` | Medium context cost, confidence 0.55, and it is a second critique framework competing with the blinded screenshot critique. One critique that happens beats two that are optional |
| `before-implementing/launch-packet-role-split`, `domain-modeling-context-adr` | Both assume delegation or a long-lived engineering artefact. Neither survives C8 or the one-state-file rule |
| `ai-website-cloner-template/asset-enumeration-and-batched-download`, `layered-asset-vigilance`, `spec-file-inline-only-contract`, `pre-dispatch-checklist-gate`, `named-failure-log`, `complexity-budget-rule`, `interleaved-extract-and-build` | Clone-pipeline machinery. C5: extraction informs, the brief decides, and a clone is a request stated in those words. `floors/redesign.md` carries only the two that matter for a redesign |
| All `scroll-world` video mechanisms (`blob-seek-scrubbing`, `segment-interleave-scene-model`, `linger-ease-pacing`, `distance-based-seam-crossfade`, `scrub-video-encoding-recipe`, `css-layer-theme-override`) | Scroll-scrubbed video is one brief in a hundred, no acceptance criterion touches it, and shipping it is how a package reaches 630k tokens. Dropped from the package, not merely from always-loaded |
| `remotion-skills/remotion-technique-independence` | `remotion-skills` may not be copied at all, and the principle is already carried by the floors' three-renditions rule |
| `frontend-design/named-cliche-calibration` | Refuted as stated by the red team. §3 is built from the naming paragraph read directly at `frontend-design/SKILL.md:31`, not from the refuted composite claim |
| All 12 `investigate` mechanisms | Each was refuted as claimed. Adopting a refuted claim before re-reading the source is how a wrong count becomes a rule |
| All 31 `reject` mechanisms | Already rejected in the ledger; nothing here revisits them |

---

## 13. How it avoids becoming a house style

Named explicitly, because "we will be careful" is not a mechanism.

1. **The skill has no defaults to reach for.** No default hero, no default radius, no
   default spacing scale, no palette corpus, no style CSV, no comp templates, no
   blocks with art direction. There is nothing in the package that could be the same
   twice, because there is nothing in the package that is a design.
2. **Floors are lint-checked to contain no appearance.** A hex value, a font name, a
   radius or a spacing scale in `floors/*.md` fails CI.
3. **Floors must demonstrate three renditions** of every non-obvious outcome, or CI
   fails. A rule shown satisfiable three ways cannot be a look.
4. **Two of the five named default clusters are our own past output.** The house style
   we already have is written into the always-loaded surface as a thing to notice.
5. **The known-bad recipes must keep tripping the ledger** on a clean install, as the
   control group in `benchmarks/06-redesign/before/` must keep failing `verify.mjs`.
6. **Diversity is measured across builds, never inside one.** A build is never
   penalised for resembling a good site; the skill is penalised for producing a set
   that resembles itself.

---

## 14. How it is tested

### Against the charter's acceptance criteria

| # | Criterion | How this candidate is checked |
| --- | --- | --- |
| A1 | One skill | `tools/check-repo.py` greps `SKILL.md` and `floors/*` for "run the X skill" / "invoke"; the word count of skill-invocation phrasing must be zero |
| A2 | Control plane under 500 lines | 249 lines measured with `wc -l`; existing CI gate |
| A3 | Progressive loading | `tools/context-budget.mjs` reports ALWAYS = 3,352 and ROUTINE ≈ 5,100; CI fails above 4,000 / 6,500 |
| A4 | Creative decisions by the model | Every script's stdout is inspected in review; `pick.mjs` takes a subject string and a count and nothing else, `vocabulary.mjs` takes a noun list the model wrote. Enforced by a review checklist plus a unit test asserting each script's input surface |
| A5 | Traceable mechanisms | Section 12 keys map into `MECHANISM-LEDGER.json`; `SOURCE-REGISTRY.json` and `THIRD-PARTY-NOTICES.md` carry commit and licence |
| A6 | Rejections have reasons | Section 12's second table |
| A7 | Honest verification | `benchmarks/06-redesign/before/` must keep failing `verify.mjs`; CI fails if it passes. `verify.mjs` fails closed and `--no-axe` prints "unchecked" |
| A8 | Holdout ≥ baseline | One unseen brief, blind-scored against the strongest relevant baseline, screenshots kept |
| A9 | No house style | `tools/portfolio-diversity.mjs` across the holdout plus the two prototypes |
| A10 | Loops terminate | Section 10's table; each cap has a unit test on the script side and a written consequence on the prose side |

### The test that decides whether this candidate is right at all

`CONFLICT-MATRIX.md` records the open risk honestly: the re-expression may not
transfer. frontend-design's power may live in its specific phrasing.

**Smoke test S10-1, run before anything else is built.** Same brief, same host model,
same evidence pack, two arms:

- arm A: `frontend-design/SKILL.md` verbatim
- arm B: §1–§6 of this candidate's `SKILL.md`, alone, with the control plane stripped

Blind-scored by the existing evaluation protocol. Cost: two builds, no new head-to-head
arms in the charter's sense, because it is a mechanism smoke test on one brief and not
a fifteen-arm study.

**The designed-in contingency, decided now rather than argued later.** If arm B loses
by more than 4 points, §1–§5 are replaced by a verbatim include of
`frontend-design/SKILL.md`, which Apache-2.0 permits with notice, plus this
candidate's §3 default-naming addition and §6 floor appended after it. The
architecture does not change: the Standard layer is still one always-loaded prose
surface, and the Floor and Machine layers are untouched. This candidate is designed so
that losing its own creative prose costs one file swap and nothing structural. I would
rather ship someone else's better words inside my architecture than defend my own.

### Unit-level tests

- `pick.mjs`: same subject and date returns the same index; index is never 0; a list of
  1 errors rather than returning 0.
- `history.mjs`: the round-8 recipe and the warm-on-near-black arrangement trip on a
  clean install. Regression test, must never be softened.
- `vocabulary.mjs`: a CSS file with shadcn's default token names scores 0; nordrig
  build A's `site.css` scores above the floor. Both are real files in the repo, so this
  test has genuine fixtures.
- `floor-lint.mjs`: a floor file containing `#f4f1e8` fails; one with two renditions
  fails; one with three passes.
- `state-fields-consumed.mjs`: adding an unread field to the schema fails CI.
- `verify.mjs`: the existing control group keeps failing.

---

## 15. Where this candidate is weakest

Stated as an argument against myself, not as a caveat.

**1. The re-expression risk is not mitigated, it is only made cheap to lose.** I do
not know whether my §1–§5 carries frontend-design's power. I have designed a swap that
costs one file, which is the best available answer, but "we have a plan for when the
core hypothesis fails" is not the same as evidence that it will not.

**2. `pick.mjs` is the most attackable thing here.** A reader who takes
`C-no-mechanical-creativity` at its strongest can say a hash function is choosing the
design. My distinction — chooses among the model's designs, authors none — is real but
it is a distinction, and distinctions lose to slogans in adjudication. If it is struck,
7.1 disappears and only the cross-build ledger and the naming discipline are left
fighting in-run convergence, which is measurably the harder direction (30/35).

**3. `vocabulary.mjs` measures a proxy and can be gamed.** Token names correlate with
subject grounding in exactly one observed pair of builds. n=1. A model that renames its
generic tokens to plausible nouns defeats it entirely, and I cannot detect that
mechanically.

**4. Three floor files may themselves converge.** The three-renditions lint constrains
the *authoring* of the floors, not their *effect*. If every `buy.md` build ends up with
a sticky panel and a trust strip because those are the two things the floor spends most
of its words on, I have moved the house style down one layer and hidden it behind a
lint. The only detector for this is A9, which runs after three builds exist.

**5. Deleting the corpora is irreversible in review terms.** I remove 57% of the
package on the argument that retrieval is a convergence risk and that the browser
measures what the tables assert. If an adjudicator values the accessibility tables or
the font metadata, this candidate has nothing to fall back on and looks reckless rather
than disciplined. I think it is right. I would not be shocked to be wrong about
`data/typography.csv` specifically.

**6. The always-loaded budget is 61% above the winner's.** 3,352 against 2,078. I
argue the delta is control plane and that A1 and A10 require it. But the one
measurement this repo has says more instruction did not buy better design, and a
candidate that spends 1,900 tokens on process is making an argument the measurement
does not support. The honest position is that 2,078 tokens of pure creative surface
beat 6,546 tokens of mixed surface, and nobody has measured 1,229 creative + 1,900
process against either.

**7. n=1 underneath the whole thesis.** Nordrig is one subject, one pair of builds,
one host model writing both. `NORDRIG-AB-FORENSICS.md` says so itself. The token-name
finding that I turned into a gate is the single most load-bearing observation in this
design and it has a sample size of two files.

**8. No answer for the very small request.** "Fix my pricing table" runs READ, THESIS,
BUILD, VERIFY, which is absurd overhead. §8 has no small-request bypass, and adding one
is a route that decides how serious a request is, which is a judgement I would rather
the model made — but I have not written that down, and a reviewer would be right to
call it a gap.
