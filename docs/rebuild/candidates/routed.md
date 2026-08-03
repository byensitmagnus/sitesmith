---
title: Candidate — Routed Modular ("the duty router")
state: S5_ARCHITECTURE_CANDIDATES
status: proposal
candidate: routed
constraints_checked: C-no-skill-chain, C-no-mechanical-creativity, C-no-house-style, C-licence, C-no-unlicensed-text, C-control-group
ai_generated: "(C)"
---

# Routed Modular — the duty router

## One-line thesis

Keep the router, and strip it of every creative authority: routing decides **duties**
(obligations, journeys, gates, behaviour references), never **appearance**, and a CI lint
plus a route-swap render test make that separation measurable rather than promised.

---

## 1. The attack this candidate has to survive, answered first

The attack: *routing by page category is exactly what produced the house style — three
briefs, one bucket, one look.*

That attack is correct about v2.3, and the evidence is specific. Open
`skills/sitesmith/v2/modes/marketing.md`. It has twelve numbered decisions. Six of them are
appearance decisions:

| # | Heading | What it is |
| --- | --- | --- |
| 2 | The first screen | arrangement of the hero |
| 3 | Density | measure, section rhythm |
| 4 | Radius | corner treatment |
| 5 | Imagery | photographic treatment, ordered preference |
| 6 | Motion | entrance character, stagger count, `--motion-base` |
| 7 | Colour emphasis | accent count and where the accent goes |

Section 6 says, in the file, *"Entrance only, and once. A short fade-and-rise on first view,
staggered by no more than three elements."* Section 7 says *"Three places on a page."* Every
marketing brief that ever entered that bucket got the same answer to all six. Tannery, seed
library and tideworks did not converge because a model is unimaginative. They converged
because **a shared file answered the appearance questions before the subject was consulted**,
and the answer was identical for all three by construction. `gallery/showcase.json` records
the outcome: `individualReview: pass`, `portfolioDiversity: fail`, showcase 0/8.

Note that v2.3 had already *noticed* this — sections 2, 3 and 4 of the marketing file were
rewritten to say "the outcome, not the default" and to explicitly refuse a default hero. It
did not work, and that is the important part. **Prose self-restraint inside a routed file is
not a mechanism.** The file still exists, it is still shared across every brief in the
bucket, and it still discusses hero arrangement, density and radius. Under pressure the
model reads a paragraph about radius in a shared file and reaches a shared conclusion.

So this candidate does not tell the route modules to behave. It removes their capacity to
misbehave, three ways:

1. **A fixed seven-heading schema.** A route module has exactly these headings: Job,
   Obligations, Operable surfaces, Required journeys, Gate profile, Failure modes, Fetch
   when needed. There is no heading under which a palette, a hero arrangement, a radius or a
   motion character can be written. `scripts/route-lint.mjs` fails CI on an eighth heading.
2. **A purity lint on content.** `route-lint.mjs` also rejects, inside any route module: hex
   colours, `rgb(`/`hsl(`/`oklch(`, named font families, `px`/`rem` values outside a
   viewport width or a WCAG target size, `border-radius`, `box-shadow`, `font-size`,
   `letter-spacing`, gradient functions, and a small banned-adjective list
   (`minimal`, `bold`, `clean`, `modern`, `premium`, `airy`, `dense`, `editorial`,
   `brutalist`) used as an instruction. A fixture at `tests/fixtures/impure-route.md`
   contains one violation of each class and **must keep failing** — the same
   test-of-the-test discipline as `benchmarks/06-redesign/before/` under `C-control-group`.
3. **A route-swap render test.** `scripts/route-swap.mjs` renders one surface twice from the
   same `DIRECTION.md`, once under its correct route and once under a deliberately wrong
   one, and diffs two things separately:
   - **Invariance:** the computed token layer (colour values in use, font families, radius
     values, background layers) and the signature element must be materially identical
     across the two routes. If the look changed when only the route changed, **the router
     decided the design** and the release fails.
   - **Sensitivity:** the obligation surface (present journeys, form semantics, required
     disclosures, operable-surface conventions) must differ. If nothing changed, the router
     is doing nothing and should be deleted rather than defended.

   Both directions are asserted, because a router that is safe by being inert is not a
   router. This converts `C-no-mechanical-creativity` from a rule an architect asserts into
   a property a script measures on real renders.

That is the direct answer. The router may decide what the surface **owes**. It may not
decide what the surface **is**.

---

## 2. Shape

Three always-loaded files — a control plane, a creative surface, a craft floor — plus four
route modules fetched one at a time, plus stack adapters, behaviour references and corpora
fetched at their step. Nine scripts, all of which retrieve, verify or gate.

```
skills/sitesmith/
  SKILL.md                       ALWAYS   control plane: routing table, run order,
                                          the decide/never-decide contract, loops, scripts
  direction.md                   ALWAYS   the creative surface — the whole design method
  floor.md                       ALWAYS   craft floor, written to be satisfiable many ways

  routes/                        FETCH one per surface
    marketing.md
    commerce.md
    product-ui.md
    experience.md

  adapters/                      FETCH one per build, chosen by scripts/stack.mjs
    next.md
    react-vite.md
    astro.md
    plain.md

  references/                    FETCH by name, only when a route module points at one
    commerce/purchase-path.md          cart drawer, sticky panel, mobile bar — states only
    commerce/money-format.md           currency, tax presentation, locale
    product-ui/table-and-filter.md     sorting, pagination, bulk select, empty states
    product-ui/forms.md                validation timing, error recovery, autofill
    experience/scroll-scrub.md         scroll-driven sequencing, decode budget, degrade path
    experience/media.md                video/canvas loading, poster, reduced-motion abort
    marketing/proof.md                 sourced proof forms, ordered by strength
    common/behaviour.md                combobox, dialog, disclosure, focus trap — behaviour only
    common/redesign.md                 audit-before-touching, what must be preserved
    common/journeys.md                 journey file format and assertions

  corpora/                       FETCH row-wise via scripts/fetch.py, never whole
    ux.csv                             accessibility and interaction facts
    stacks.csv                         framework idioms, one row per idiom
    fonts.csv                          family, class, licence, real fallback metrics
    tells.csv                          the mechanical AI-tell registry (shared with tells.mjs)

  scripts/
    stack.mjs  fetch.py  verify.mjs  journeys.mjs  contract.mjs
    tells.mjs  diversity.mjs  route-lint.mjs  route-swap.mjs

  tests/
    fixtures/impure-route.md           control: must keep failing route-lint
    fixtures/pure-route.md             control: must keep passing
    route-lint.test.mjs
    fetch.test.py
    schema.test.mjs

  THIRD-PARTY-NOTICES.md
  LICENSES/
```

### Always loaded, measured

Estimated tokens = bytes ÷ 4. I wrote the three files in full, ran `wc -c` on them, and
divided. This is the same method as `BASELINE-CONTEXT-BUDGET.json`, so the numbers are
comparable to the 6,546 and 2,078 already on record.

| File | Bytes | Est. tokens |
| --- | ---: | ---: |
| `SKILL.md` (incl. 697-byte frontmatter) | 8,072 | 2,018 |
| `direction.md` | 6,010 | 1,502 |
| `floor.md` | 3,326 | 831 |
| **Always loaded** | **17,408** | **4,352** |

| Scenario | Est. tokens |
| --- | ---: |
| Always | 4,352 |
| Routine run (always + one route module + one adapter) | ≈ 5,640 |
| v2.3 always, for comparison | 6,546 |
| frontend-design entire skill, for comparison | 2,078 |

Read those honestly. This candidate is **34% lighter than v2.3's always-loaded set and 2.1×
heavier than the skill that beat it**. The delta over frontend-design is the router table
plus the run order plus the floor — roughly 2,270 tokens of machinery that frontend-design
does not have and that the nordrig forensics say frontend-design *needed* (no verification,
no journeys, no states, no commerce, no stack detection, no release gate). The creative
surface alone, `direction.md` at 1,502 tokens, sits **under** the charter's 2,500 target and
under frontend-design's own 2,078 — so if the re-expression transfers, this candidate spends
less on taste and more on production than the winner did, which is the whole claim.

A CI gate (`tools/context-budget.mjs`) fails the build if ALWAYS exceeds 4,500 or ROUTINE
exceeds 7,000 estimated tokens. The budget is a gate, not an aspiration.

---

## 3. `SKILL.md` in full

131 lines, under the 500-line CI ceiling with a wide margin.

````markdown
---
name: sitesmith
description: "Design, build, redesign and audit websites and web apps that do not look
AI-generated. Landing pages, marketing sites, shops and product pages, dashboards and admin,
scroll experiences, portfolios and editorial. Also improves existing React, Next.js, Astro,
Vue, Tailwind, shadcn or plain HTML/CSS work. Triggers on: build a website, make a landing
page, design a page, redesign this, make it look better, fix the design, improve the UI,
this looks generic, pick colours or fonts, add animations, make it responsive, add dark
mode, accessibility pass, hero, pricing table, dashboard layout, product page, design
system, design review, UI audit."
license: MIT
---

# SiteSmith

Read `direction.md` and `floor.md` before anything else. They are short, they are always
in context, and between them they are the whole standard. This file is the control plane:
it says what order things happen in, what may be decided where, and when to stop.

Nothing in this skill asks the user to run a different skill. If a step needs material, it
fetches a file; it never delegates to a tool the user has to install or invoke.

## 1. Route every surface

A route is a claim about **what the visitor is doing on that surface**, not about what kind
of company the client is. Route per surface. A shop's About page is `marketing`; the same
shop's order admin is `product-ui`. One direction spans all of them.

| Route | The visitor is | Fetch |
| --- | --- | --- |
| `marketing` | deciding whether to care | `routes/marketing.md` |
| `commerce` | deciding whether to buy, and from whom | `routes/commerce.md` |
| `product-ui` | already committed, and now working | `routes/product-ui.md` |
| `experience` | being taken through something in an order you control | `routes/experience.md` |

You choose the route. No script chooses it. If a surface sits between two — a pricing page,
a configurator, an editorial piece that sells — name both, fetch both, and write down which
obligations you took from which. A blend is normal and must be stated, not averaged away.

If no route fits, say so, pick the closest, and record the mismatch in `REPORT.md`. Do not
invent a fifth route.

## 2. What a route decides, and what it may never decide

This is the constraint that makes routing safe, and it is enforced by
`scripts/route-lint.mjs` in CI, not by good intentions.

**A route module may decide:** what must be true on that surface; which surfaces are
operable rather than expressive; which interaction journeys must exist and pass; which
verification runs and at what threshold; which behaviour references to fetch; the named
ways this kind of surface fails.

**A route module may never decide:** any colour, ground or palette; any typeface or type
role; any radius, spacing step, shadow or texture; the arrangement of a hero or any
expressive section; the character of motion beyond the safety floor; copy voice, labels or
tone; the signature element; the one risk. Those come from `direction.md`, from this
subject, and they differ for every brief by construction.

Route modules have a fixed seven-heading schema. There is no eighth heading. The moment a
route module can hold an appearance value, three briefs in one bucket get one look — that
is the recorded failure this shape exists to prevent (`gallery/showcase.json`, 0/8).

## 3. The run

**`init` — commit to a direction before writing any CSS.**
Inventory the surfaces and route each one. Detect the stack with `scripts/stack.mjs`; never
assume it. Then work `direction.md` end to end and write `DIRECTION.md`: subject, world,
token vocabulary, type roles, signature, the one risk, the four shortlisted directions you
killed and why. Only then write `DESIGN-SYSTEM.md` from the winning direction — never
before it, because a contract written first is a contract written from the category.

**`build` — make it real in the detected stack.**
Fetch one route module per surface plus the stack adapter. Keep `BUILD.md` as one flat
checklist and tick sub-steps as you finish them; one state file for the whole build, never
one per phase. Take the smallest implementation that reaches the chosen direction — reuse
before writing, native before dependency, one line before a helper. Never simplify away
accessibility, semantic HTML, responsive correctness, input validation, or anything the
brief asked for by name. Ambition is set by the brief; only the means are minimised.

Render as you go: `node scripts/verify.mjs <url> --out .sitesmith/preview --no-axe`. That
waiver is for iteration only and can never produce a release verdict.

**`release` — one decision, with evidence.**
Run the full gate, then critique the screenshots, then write `REPORT.md` including every
failure you did not fix. `PASS` from a script means it works. Whether it is any good is a
separate judgement made after, on the renders, against `direction.md`.

## 4. Loops, and where each one stops

| Loop | Cap | Stop condition |
| --- | --- | --- |
| Direction revision | 1 | The counterfactual test in `direction.md` passes, or one revision is spent — then commit and record what changed |
| Build per surface | — | Every obligation in that surface's route module is ticked in `BUILD.md` |
| Fix after verify | 2 rounds | Green, or two rounds spent — remaining failures go in `REPORT.md` as blockers, never a third attempt |
| Critique | exactly 1 | One subjective pass and one mechanical pass, synthesised once |
| Polish | 0 or 1 | Only on an explicit request, and only against a named criticism of a specific screenshot |
| Route-swap audit | 1 | Runs once at release; never repeats |

No loop here is open-ended and none of them may be restarted by their own output.

## 5. Scripts

Scripts retrieve, verify and gate. **No script output is a design decision.** If a script
appears to be choosing what the page looks like, that is a bug in this skill.

| Script | Does | Needs |
| --- | --- | --- |
| `stack.mjs` | Detect Next.js / React+Vite / Astro / plain, write `.sitesmith/STACK.json` | Node 18+ |
| `fetch.py` | BM25 lookup into a corpus, returns rows to reason over; prints `NO MATCH` rather than a guess | Python 3.10+ |
| `verify.mjs` | Screenshots at 375/768/1440, axe in both schemes, console errors, dead links, horizontal overflow, font stress, reduced-motion render | Node 18+, Playwright |
| `journeys.mjs` | Drives the journeys the route module requires and asserts what changed | Node 18+, Playwright |
| `contract.mjs` | Values used that `DESIGN-SYSTEM.md` never declared | Node 18+ |
| `tells.mjs` | Static and rendered check for known AI tells, placeholders, unmanifested images, empty brand marks, unsourced claims | Node 18+ |
| `diversity.mjs` | Fingerprints this build against previous ones; vetoes a repeat, proposes nothing | Node 18+ |
| `route-lint.mjs` | Route modules match the seven-heading schema and contain no appearance value | Node 18+ |
| `route-swap.mjs` | Re-renders one surface under a deliberately wrong route and diffs tokens against obligations | Node 18+, Playwright |

A gate that could not run reports that it could not run. It never prints a pass.

## 6. Precedence

1. The brief, explicitly.
2. Factual truth. The brief may ask for any look; it may never authorise a claim.
3. Existing brand marks, legal copy and working journeys.
4. Accessibility and platform floor — `floor.md`.
5. The route module's obligations.
6. `direction.md`.

Rows 1 to 4 are not aesthetic questions and are not negotiable by taste. Everything about
how the page looks is decided at row 6, from the subject, and nowhere else.

## 7. Attribution

Mechanisms re-expressed here descend from taste-skill and ui-ux-pro-max (MIT) and from
frontend-design and impeccable (Apache-2.0); notices and full licences travel with the
bundle in `THIRD-PARTY-NOTICES.md`. Everything else in this skill is original work, MIT.
Where a mechanism came from a source we may not redistribute, it was re-derived from its
behaviour and is credited in `MECHANISM-LEDGER.md` without quoting the source.
````

Two things in that file are load-bearing and worth naming. **Precedence row 6 is the
lowest row and is where every appearance decision lives** — which means appearance is
decided last, from the subject, after every obligation is already known, and never by a row
above it. And **the routing table gives no examples of company types.** It describes what
the visitor is *doing*. "A shop's About page is marketing" is in the file precisely to break
the company→bucket reflex that produced the convergence.

---

## 4. The creative layer: `direction.md`

This is where the design is actually produced, and it is produced entirely by the host
model. 107 lines, 1,502 estimated tokens, always loaded, route-independent. It is a
re-expression, in our own words, of the method the measurement says wins — which the
Apache-2.0 licence permits either way and which `decision:resolve-central-conflict-by-
reexpression` requires.

````markdown
# Direction

You are the design lead at a studio people come to when they want work that could not be
mistaken for anyone else's. This client has already turned down two proposals that looked
like they came off a shelf. That is the standard you are working at. Do all of the thinking
below privately and show the user a direction you have already committed to — not a menu.

## Pin the subject

Name, in one sentence each: what this thing actually is, who is looking at it, and the one
job this page has to do. If the brief does not say, choose — a specific plausible subject, a
specific audience, a specific job — and state what you chose. A vague brief is not licence
to be vague; it is the point at which you commit and become answerable for the commitment.

## Go into its world

Everything distinctive comes from here, and this is the only generative rule in the skill.

Spend a few minutes inside the subject's actual world. What does it make and what does that
thing physically look like. What instruments, tools or machines are in the room. What
documents does this trade produce — a spec sheet, a tide table, a case file, a cutting list,
a lab result, a setlist. What does it measure and in what units. What does it print, stamp,
label or number. What does its vernacular sound like when two people in the trade talk to
each other. What does it get wrong, and what is it afraid of.

Write down three artifacts from that world you could photograph. Those three are your
material. If you cannot name three, you have not gone into the world yet; you have named a
category, and categories all look the same.

## Let the world name your tokens

Name the design tokens after things in the subject's world, not after their role in a
framework. `--bg --surface --border --text --accent` is a description of any dark UI ever
made, so every later decision has to be invented from nothing. `--paper --ink --caution
--grid --steel` is a drawing office, and once a variable is called `--caution` the world
answers the next question for you: caution orange goes on the control you must not press by
accident. Write the token layer before the components, because it steers everything after it.

Four to six named values is a system. Twelve is a palette nobody made a decision about.

## Give it a voice

Choose type as identity, not as a safe stack. A display voice that differs from the body
voice, or one voice used at one size with such conviction that the sameness is obviously the
point — say which, and why this subject wants it.

## One signature, and one risk

**One signature element** carries the identity and everything around it stays quiet. Prefer
the signature that costs three lines of CSS and no asset: a ruled ground, a margin rule, a
numbering system, a rhythm in the section breaks. Something you can only do because of what
this subject is.

**One risk against your own category.** Say out loud what a site in this category defaults
to — the gaming shop goes dark with one saturated accent, the clinic goes soft blue and
rounded, the agency goes black-and-white with huge type — then take a different position on
one axis and hold it, or state plainly why the default is genuinely right here. Spending the
risk somewhere specific is what makes the rest of the page allowed to be calm.

Then, before you leave: take one thing off. The version with one fewer effect is almost
always the one that reads as designed rather than decorated.

## Name the defaults; do not ban them

Three clusters are where machine-made design currently lands: cream ground with a serif
display and a terracotta accent; near-black with one acid accent and everything else
neutral; the hairline-ruled broadsheet grid with an oversized wordmark. All three are
legitimate design. If the brief asks for one, give it exactly, without hedging.

What is not allowed is *arriving* at one of them. If your direction is in one of those
clusters, you must be able to say which line of the brief or which artifact from the world
put it there. "It felt right" means you found the default, not the subject.

Nothing here is banned. A ban list has a shape, and after enough builds the shape is the
house style — which is precisely the failure this skill was rebuilt to fix.

## Do not build your first idea

Your first idea is your most typical idea. Write five directions, all grounded in the world
you just went into, then say what specifically kills each of the four you are not building —
a real reason, tied to this subject, not "less strong". If you cannot kill the other four
with specific reasons, you did not generate five directions; you generated one and dressed
it four ways.

Then the counterfactual. Take a neighbouring brief — a different business in the same
category — and spend one minute on where you would land. If you would land in the same
place, what you found is the category, not this subject. Change one structural thing, not
the hue, and write down what changed and why. This costs nothing and it is the cheapest
convergence test that exists.

## Copy is design material

The world reaches the copy or the design is a costume. Diegetic labels, real units, the
numbering the trade actually uses, an eyebrow only this business could write. A page can be
visually original and still announce that a machine wrote it, and it will always announce it
through the words first.

Voice is free. Claims are not. Any number, testimonial, certification, customer count,
guarantee or delivery time needs a source, and without one it does not go on the page —
at any precedence level, including an explicit instruction to invent it.

## What you commit to

Before any CSS: subject, audience, page job, the three artifacts, the token vocabulary with
its names, the type roles, the signature, the risk, the four killed directions, and the
counterfactual note. That is `DIRECTION.md`. Everything downstream is derived from it, and
anything in the build that cannot be traced back to it is decoration.
````

### What produces the creative direction

The host model, reasoning from `direction.md`, from the subject's own world, before any
route module is fetched and before any script has run except stack detection. No script
produces, ranks, seeds, or filters a design idea at any point in this candidate. The only
script that touches direction at all is `diversity.mjs`, and it can only say *no* — never
*try this instead* (`sitesmith-current/cross-project-anti-repeat-ledger`, C7: history may
veto, never propose).

### What stops three unrelated briefs from converging

Six layers, three of them measured rather than instructed:

| # | Layer | Kind | Mechanism |
| --- | --- | --- | --- |
| 1 | The generative rule is indexed on the subject's world, so it has a different answer per subject by construction | instructed | `frontend-design/subject-grounding-mandate` |
| 2 | Tokens are named from the world, so the token layer — which is written first and steers everything after — cannot be shared between briefs | instructed | derived from `result:nordrig-ab` §1 |
| 3 | Five grounded directions, four killed with subject-specific reasons; you may not build #1 by default | instructed | `impeccable/forced-index-direction-roll`, re-expressed without hash, catalogue or API |
| 4 | The counterfactual: work a neighbouring brief, and if you land in the same place, change one structural thing | instructed | `frontend-design/self-critique-loop` |
| 5 | The routed layer physically cannot contain a shared appearance value | **measured** — `route-lint.mjs` + schema + failing fixture | new, this candidate |
| 6 | Cross-build fingerprint veto and portfolio diversity across the last builds | **measured** — `diversity.mjs` | `sitesmith-current/cross-project-anti-repeat-ledger`, `portfolio-diversity-gate` |
| 7 | Route-swap invariance: changing only the route must not change the look | **measured** — `route-swap.mjs` | new, this candidate |

Layers 1–4 are the same class of thing that beat SiteSmith 59–40, so their expected value is
the measured one. Layers 5–7 exist because v2.3 proves that instruction alone did not hold:
the marketing mode file *already said* "there is no default hero" and three sites still
shared one recipe.

---

## 5. The craft floor: `floor.md`

51 lines, 831 estimated tokens, always loaded. Every line is written so that a hundred
different-looking sites can satisfy it. The test for admitting a line to this file: **can it
be met in at least three visually unrelated ways?** If not, it is a house style with a
compliance report attached and it goes in a route module as an obligation, or nowhere.

````markdown
# Floor

The floor is what any site must clear, whatever it looks like. Every line here is written so
that a hundred different-looking sites can all satisfy it. If a rule here can only be met one
way, it is a house style with a compliance report attached and it does not belong in this file.

**Reachable.** Keyboard reaches every control in a sensible order and focus is visible —
visible in your own design language, not the browser default you forgot to replace. Text
meets contrast in both colour schemes if you ship two. Touch targets are big enough to hit
on a phone. Labels are attached to their inputs. Landmarks and headings describe the real
structure of the page.

**Honest about motion.** `prefers-reduced-motion` is honoured completely — not visually
suppressed while the work still happens underneath. Nothing moves in a form. Nothing delays
a click. One orchestrated moment beats effects scattered over every hover.

**Reachable states, not painted ones.** Every state you designed can actually be entered:
loading, empty, error, success, disabled, too-long, too-many. A state that exists only in a
mockup is a picture of a state. If a surface has no script, ask how any of its states were
supposed to happen.

**Real at every width.** 375, 768 and 1440 all render without horizontal overflow and
without a layout that only works at the width you happened to develop at. Text reflows at
200% zoom. Long words, long names and long prices do not break the box.

**Made of true things.** No fabricated testimonial, invented customer logo, made-up metric,
placeholder price, Lorem Ipsum, John Doe or Acme Corp. Every image is either real, or
generated on purpose and recorded as such, or an explicitly labelled slot saying what belongs
there. A labelled placeholder is honest and is still not finished. Do not call hand-rolled
CSS an official platform technology.

**Proportionate.** Take the smallest implementation that reaches the chosen direction: reuse
what is there, then the platform's own feature, then a dependency — and a dependency names
which native API it is replacing. Never cut accessibility, semantic HTML, responsive
correctness, input validation, error handling that prevents data loss, or anything the brief
asked for by name. Simplicity applies to the means and never to the ambition.

**Reused behaviour, authored appearance.** Take the solved accessible implementation of a
combobox, a date picker, a focus trap, a dialog. Its colours, type, spacing, radii and motion
come from your design system, which came from the direction. A component shipping with its
library's default tokens is how a site ends up looking like its component library.

**Convention where people operate, originality where people decide.** Checkout, forms,
navigation, tables, filters and error states follow what people already know, because novelty
there costs money and trust. The hero, the section rhythm, imagery, typography, texture and
voice are where the direction is spent. This is not a compromise between two goals; it is
where each one is actually cheap.

**Verified, not asserted.** The build is not done because it compiles and it is not done
because a gate printed PASS. It is done when it has been rendered, looked at, measured and
corrected — and when what is still wrong has been written down.
````

Note what is *not* in the floor: no ban list of visual tells. The em-dash rule, the purple
gradient, the blurred orb, the bento grid, the three equal feature cards — all of that is in
`corpora/tells.csv` and checked by `tells.mjs` against shipped code. **A ban that only exists
as prose is a ban that ships anyway.** impeccable's own record shows five banned elements
getting past a reviewer that never looked. Moving the ban list from instruction to detector
does two things at once: it removes ~700 tokens of prose from the always-loaded budget, and
it makes the ban actually fire.

---

## 6. A route module, in full

`routes/commerce.md`, 68 lines, 886 estimated tokens. The other three have the same seven
headings and comparable size. This is what a route module is allowed to look like.

````markdown
# Route: commerce

## Job

The visitor is deciding whether to buy, and whether to buy from you. They are simultaneously
shopping and assessing risk, and every unanswered question is resolved in favour of leaving.
Nothing on this surface may be ambiguous about money, availability or what happens next.

## Obligations

1. The price is unambiguous: currency, tax status and what is included, stated once, in a
   figure that lines up between rows. If a price varies by option, the displayed price
   changes when the option changes — never after checkout.
2. Availability is truthful. If stock is not known, the surface says so rather than implying
   availability by silence.
3. Delivery, returns and warranty are answerable before the purchase control, not only in a
   footer link.
4. The purchase control is reachable at every width without hunting, and its label says what
   happens when it is pressed.
5. Cart state survives navigation and reload, and the count is the same everywhere it appears.
6. Every trust element is a real one. No badge, guarantee, review count or customer number
   without a source.
7. Nothing animates, moves, delays or reveals near price, cart or checkout controls.
8. Options that are unavailable are visibly unavailable before they are clicked, with the
   reason.
9. Errors in a checkout field are recoverable without losing entered data.

## Operable surfaces

Cart, checkout, address and payment forms, option selectors, quantity controls, filters,
sort, search, order status. These follow the conventions people already know. Originality is
spent on the catalogue's presentation, the product story, imagery treatment, section rhythm
and voice — never on the mechanics of paying.

## Required journeys

- `browse-to-cart` — land on a listing, open a product, choose an option, add to cart,
  assert the cart count and the line total.
- `cart-persistence` — add, navigate away, return, reload; assert the cart survived.
- `checkout-validation` — submit an incomplete form; assert the error is announced,
  focusable, and that entered data survived.
- `unavailable-option` — select an out-of-stock variant; assert it cannot be purchased and
  that the reason is visible.

## Gate profile

`verify.mjs` full, including axe in both schemes. `journeys.mjs` — all four above must pass;
a skipped journey fails the release. `tells.mjs` with the claim check on, treating every
number near a purchase control as a claim needing a source. `contract.mjs` on all commerce
templates. A release is refused if any purchase-path journey is red, regardless of the
visual verdict.

## Failure modes

1. **Trust theatre.** Badges, guarantees and review counts nobody can source. The single
   clearest tell, and it survives every visual improvement.
2. **A beautiful catalogue with a broken path.** Everything renders, nothing can be bought,
   because no journey ever drove the real page.
3. **Price ambiguity absorbed into design.** Tax status, shipping and option deltas left
   unstated because stating them looked untidy.
4. **The purchase panel eating the direction.** The commerce mechanics get built first, the
   direction gets applied as a colour swap afterwards, and the result is a template.

## Fetch when needed

`references/commerce/purchase-path.md` — behaviour of cart drawers, sticky panels and mobile
purchase bars, structure and states only. `references/commerce/money-format.md` — formatting
and tax presentation by locale. `fetch.py --corpus ux --query "<question>"` for anything else.
````

Compare this against v2.3's `modes/ecommerce.md` sibling and the difference is the whole
candidate: **nothing in this file has an opinion about what the page looks like.** "Prices in
tabular mono" — the v2.3 rule from the nordrig B build — is gone; the obligation is "a figure
that lines up between rows", which tabular figures satisfy and so does a fixed-width column
with right alignment and so does a monospaced display face chosen from the subject's world.
"Sticky buy panel, mobile bottom bar" is gone from the module and lives in a fetched
behaviour reference as *states and structure*, which is where `C6` (reuse behaviour, author
appearance) puts it.

### The other three routes, in one line each

- **`marketing`** — the visitor is deciding whether to care. Obligations are about the
  *argument* existing (what this is, why it matters, how it works, why believe it, what it
  costs, what to do next), proof being sourced or absent, and one primary action. Journeys:
  nav disclosure on mobile, contact-form validation and recovery, any disclosure widget.
  Nothing about hero arrangement, density, radius, imagery treatment, motion character or
  accent count — all six of v2.3's convergence engines are deleted from this file and live in
  `direction.md`, answered per subject.
- **`product-ui`** — the visitor is already committed and now working. Obligations: every
  state reachable including empty/loading/error/permission-denied, destructive actions
  confirmable and reversible, tables keyboard-operable and sortable without losing position,
  data density honest about truncation, no layout shift on data arrival. Journeys: filter and
  restore, bulk select, form error recovery, empty→populated transition.
- **`experience`** — the visitor is being taken through something in an order you control.
  Obligations: the whole thing must be comprehensible with motion off, media must fully abort
  under `prefers-reduced-motion` rather than being hidden while still downloading, no state
  may be reachable only by scrolling, and the decode/bandwidth budget must be declared.
  Journeys: reduced-motion full run, keyboard-only progression, slow-network first paint.
  This route exists precisely because its obligations look nothing like the other three's,
  which is the sensitivity half of the route-swap test.

Note the honest consequence: **four routes is still a taxonomy, and blended surfaces are
real.** A pricing page is `marketing` + `commerce`. The skill's answer is to name both, fetch
both, and record which obligations came from which — which is more honest than v2.3's
single-mode assignment, and is still a judgement the skill can get wrong with nothing
checking it.

---

## 7. Scripts, precisely

Every script here answers a question or refuses a release. None of them chooses.

**`stack.mjs`** — reads `package.json`, lockfiles and config files; writes
`.sitesmith/STACK.json` naming exactly one adapter. Next.js and Astro outrank their
transitive React dependency. Refuses to guess: an unrecognised stack writes `plain` and says
so. (`ui-ux-pro-max/stack-never-assume`)

**`fetch.py`** — stdlib-only BM25 over one named corpus. `--corpus ux --query "focus
visible on a dark ground"` returns rows; the model reasons over them. Never returns a
recommendation, never picks between rows, and prints `NO MATCH` rather than the nearest bad
row. (`ui-ux-pro-max/bm25-csv-retrieval` adapted to retrieval-only;
`ui-ux-pro-max/zero-result-honesty`)

**`verify.mjs`** — the existing script, kept. Screenshots at 375/768/1440, axe in light and
dark, console errors, dead links, horizontal overflow, font-stress substitution, and a
`prefers-reduced-motion` render. Fail-closed: a check that could not run reports that it
could not run and the release verdict is withheld.
(`sitesmith-current/verify-fail-closed-gates`) The control group at
`benchmarks/06-redesign/before/` must keep failing (`C-control-group`).

**`journeys.mjs`** — runs the journeys the route module named, against the real page, and
asserts what changed rather than that the page loaded. A route's required journey that is
absent is a failure, not a skip. (`sitesmith-current/interaction-journeys`)

**`contract.mjs`** — reports values used in shipped CSS that `DESIGN-SYSTEM.md` never
declared. Catches the design system silently becoming a suggestion.
(`sitesmith-current/contract-after-direction-plus-token-drift`)

**`tells.mjs`** — the mechanical detector. Reads `corpora/tells.csv` (one rule per row: name,
static pattern or rendered check, severity, legitimate-use note) and runs each against the
built output and the rendered DOM. Also carries the honesty checks: unmanifested images,
empty brand marks, placeholder prices, Lorem, and numbers presented as claims without a
source in `EVIDENCE.md`. (`impeccable/mechanical-antipattern-detector`,
`sitesmith-current/production-gate-honesty-checks`)

**`diversity.mjs`** — fingerprints the finished render (macro layout, ground luminance,
accent count, type-role structure, surface/label/figure/depth grammar) into an append-only
`~/.sitesmith/history.jsonl` with no client URL. Fails on: exact fingerprint match, the
hard-coded known-bad recipe (fails even on an empty ledger, so a fresh install is still
protected), ≥4 shared devices with another project, or identical macro axes. **It vetoes and
never proposes.** (`sitesmith-current/cross-project-anti-repeat-ledger`,
`sitesmith-current/portfolio-diversity-gate`, resolving C7)

**`route-lint.mjs`** — the schema and purity gate over `routes/*.md`. Checks: exactly the
seven canonical headings, in order, nothing else; no hex/rgb/hsl/oklch literal; no
`font-family` or named font; no `border-radius`, `box-shadow`, `font-size`,
`letter-spacing`, `linear-gradient`, `backdrop-filter`; no numeric CSS length except a
viewport width or a WCAG minimum target size; no banned adjective used as an instruction.
Runs in CI over every route module and over both fixtures — `pure-route.md` must pass and
`impure-route.md` must fail. If the impure fixture ever passes, the lint has been weakened
and CI fails.

**`route-swap.mjs`** — takes one built surface, its `DIRECTION.md`, and two route names.
Rebuilds the surface under the second route from the same direction, renders both, and
emits two verdicts. Invariance: the set of computed colour values, font families, radius
values and background layers, plus the presence of the declared signature element, must
match within a tolerance that allows different content but not a different look. Sensitivity:
the journey set, the form/table semantics and the declared obligations must differ. Both must
hold. Either failing is a release blocker on the holdout.

### Degradation without sub-agents

Everything above is a local process. The only mechanism that wants a sub-agent is the
critique, and it degrades explicitly: if the host offers isolation, one agent does the
subjective read of the screenshots and another runs `tells.mjs` plus the browser evidence,
neither seeing the other, and a synthesis follows. If the host does not, both passes run
inline in sequence and the report's **first line** must state that isolation was
unavailable. Silent degradation is the failure mode, so the disclosure is mandatory and
printed. (`impeccable/dual-isolated-critique-subagents` adapted, resolving C8)

No paid third-party API appears anywhere in this candidate. `fetch.py` is stdlib BM25 over
local CSVs; there is no embedding service, no image generation dependency and no hosted
registry.

---

## 8. Loops and stop conditions, in full

Every loop in this candidate has an integer cap and a written stop condition, and no loop
may be restarted by its own output. This is A10.

| Loop | Cap | Stop condition | What happens at the cap |
| --- | ---: | --- | --- |
| Direction revision | 1 | Counterfactual test in `direction.md` passes | Commit the current direction; record what changed and why in `DIRECTION.md` |
| Five-direction shortlist | 1 pass | Four killed with subject-specific reasons | If four cannot be killed, the shortlist was one idea in four costumes — go back into the world once, then commit regardless |
| Build per surface | none | Every obligation in that route module ticked in `BUILD.md` | n/a — bounded by a finite checklist, not by a quality judgement |
| Fix after `verify.mjs` | 2 | All gates green | Remaining failures are written into `REPORT.md` as named blockers. A third attempt is forbidden |
| Critique | exactly 1 | Synthesis written | n/a — the round is fixed at one by construction |
| Polish | 0 or 1 | The named screenshot criticism is addressed | Only entered on an explicit user request naming a specific criticism |
| Route-swap audit | 1 | Both verdicts emitted | Failure is a release blocker, not a retry trigger |
| `diversity.mjs` veto | 1 | Fingerprint is new | A veto sends control back into the direction loop, which has already spent its own cap — so at most one re-entry, then the collision is reported and the build proceeds with the collision named |

The last row is the only cross-loop edge and it is deliberately capped, because a veto
loop that can re-trigger a direction loop that can re-trigger a veto is exactly the
"infinite self-improvement loop" the charter lists as an anti-goal.

---

## 9. Mechanisms adopted, with ledger keys

**Creative layer** (always loaded, prose, model-executed):
`frontend-design/persona-framing`, `frontend-design/subject-grounding-mandate`,
`frontend-design/two-pass-token-system`, `frontend-design/typography-as-personality`,
`frontend-design/signature-element-restraint`, `frontend-design/hero-as-thesis`,
`frontend-design/brief-primacy-override`, `frontend-design/self-critique-loop`,
`frontend-design/copy-as-design-material`, `frontend-design/structure-as-information`,
`frontend-design/private-reasoning-before-reveal`, `frontend-design/deliberate-motion`,
`impeccable/forced-index-direction-roll` (re-expressed: model's own five-item shortlist, four
killed with specific reasons; **no hash, no catalogue, no API** — a hash choosing the index
would be a script deciding the design), `sitesmith-current/evidence-before-direction`
(compressed from a seven-section artifact into the "go into its world" prose, because a
seven-section template is itself a convergence surface),
`taste-skill/brief-inference-design-read`, `ui-ux-pro-max/master-overrides-persistence`
(one `DIRECTION.md` plus per-surface notes), plus the token-vocabulary rule derived from
`result:nordrig-ab` §1 and the one-risk rule derived from `result:nordrig-ab` §3.

**Craft floor** (always loaded, look-agnostic):
`sitesmith-current/two-gate-separation-technical-vs-visual`,
`ponytail/seven-rung-simplicity-ladder` (compressed to one sentence),
`ponytail/explicit-never-simplify-carveouts` (co-located in the same sentence, which is the
mechanism's whole point), `scroll-world/reduced-motion-full-degrade` (re-expressed —
scroll-world is not redistributable), `impeccable/craft-floor-ban-list` (moved from prose to
`tells.csv`; see §5), `taste-skill/official-design-system-honesty-rule`,
C2 and C6 from the conflict matrix stated directly.

**Routed layer** (fetched, duties only):
`impeccable/mode-based-visitor-registers` (this is the routing vocabulary — "chosen from the
requested surface, not the product category" is exactly the fix),
`sitesmith-current/mode-based-routing-not-defaults`,
`impeccable/surface-brief-scoping`, `sitesmith-current/interaction-journeys`,
`ai-website-cloner-template/interaction-model-identification-first` (re-expressed, in the
`experience` route), `ai-website-cloner-template/exhaustive-state-capture` (re-expressed, in
`product-ui` and in REDESIGN), `ai-website-cloner-template/named-failure-log` (re-expressed
as the mandatory Failure modes heading).

**Scripts and gates**:
`sitesmith-current/verify-fail-closed-gates`,
`sitesmith-current/production-gate-honesty-checks`,
`sitesmith-current/portfolio-diversity-gate`,
`sitesmith-current/cross-project-anti-repeat-ledger`,
`sitesmith-current/contract-after-direction-plus-token-drift`,
`sitesmith-current/structurally-different-direction-gate` (**adapted**: the declared-record
half is dropped, the rendered-measurement half is kept in `diversity.mjs`; see §10),
`impeccable/mechanical-antipattern-detector`, `impeccable/dual-isolated-critique-subagents`
(degradable, mandatory banner), `ui-ux-pro-max/bm25-csv-retrieval` (retrieval only),
`ui-ux-pro-max/domain-auto-detect` (as an explicit `--corpus` default, not a silent guess),
`ui-ux-pro-max/zero-result-honesty`, `ui-ux-pro-max/static-ux-knowledge-tables` (as a fetched
corpus, never always-loaded), `ui-ux-pro-max/stack-never-assume`,
`ai-dev-tasks/checkbox-state-in-file` (exactly one `BUILD.md`),
`before-implementing/post-implementation-explainer` (re-expressed as `REPORT.md`),
`ponytail/honest-benchmark-correction` (repo process, applied to §12).

**Process**:
`before-implementing/four-quadrant-unknowns-taxonomy` — re-expressed and compressed into two
lines of `direction.md`: known-unknowns get one question or a stated default;
**unknown-knowns get the five-direction shortlist rather than a question**, because asking a
user to verbalise taste they can only recognise is what produces a generic default.
`ai-dev-tasks/clarifying-questions-before-spec` and
`taste-skill/single-clarifying-question-cap` — collapsed into: ask at most two questions,
only where the answer changes scope or architecture, otherwise commit and state the
assumption.

---

## 10. Mechanisms dropped from the adopt list, and why

| Ledger key | Ledger says | Dropped because |
| --- | --- | --- |
| `taste-skill/em-dash-absolute-ban` | adopt | Correct rule, wrong location. A punctuation ban in the always-loaded surface spends instruction budget on something `tells.mjs` checks for free — and impeccable's own record shows prose bans shipping past a reviewer that never looked. Moved to `corpora/tells.csv`. |
| `taste-skill/brief-to-design-system-router` | adopt | Routing a brief to Material/Fluent/Carbon is a taste route wearing a compliance badge, and it is the exact convergence engine this candidate exists to remove. Only its honesty half survives, in `floor.md`: do not call hand-rolled CSS an official platform technology. |
| `taste-skill/three-dial-system` | adapt (prose only) | Dropped entirely, including the prose vocabulary. The ledger's own failure note is decisive: stateless vibe-word→number tables produce identical numbers for unrelated projects. Even as vocabulary, "density 4 / motion 6" is one more shared surface where taste can accrete across briefs. `direction.md` asks for a position on this subject, not a number on a scale. |
| `ui-ux-pro-max/design-dials` | adapt | Same reason, plus it feeds a deterministic generator this candidate does not have. |
| `sitesmith-current/direction-candidate-search` (`search.py --candidates`) | reject | Confirmed. A script producing three contrasting starts is a script deciding the design — `C-no-mechanical-creativity`, and the 40-vs-59 loss is what it cost. |
| `sitesmith-current/structurally-different-direction-gate` (declared half) | adopt | Half dropped. The rendered-measurement half is kept in `diversity.mjs`. The declared-record half — a fixed parseable taxonomy of five macro axes plus four grammar fields — is dropped, because a fixed enumeration of allowed values *is* a menu, unrecognised phrasing silently becomes a "note", and asking the model to declare against a taxonomy pulls the direction toward the taxonomy's vocabulary. Measure the render; do not vet the declaration. |
| `taste-skill/self-administered-preflight-checklist` | adapt (high cost) | Moved wholesale into `tells.mjs` and `verify.mjs`. A self-administered checklist is a self-graded checklist. |
| `taste-skill/bias-correction-bans-with-override-paths` | adapt (high cost) | The 70+ ban list is dropped from prose. C1 resolves naming over banning, and a wall has a shape. What survives is three named clusters in `direction.md` and a detector reading `tells.csv`. |
| `taste-skill/image-first-generation-discipline` | adapt (high cost) | Requires an image-generation tool that may not exist in the host, and the charter forbids depending on a paid provider. Assets are handled by the manifest and the honesty gate instead. |
| `ai-dev-tasks/two-phase-approval-gate` | adapt | The stop-and-wait is dropped. It conflicts with a single-invocation skill and with the operator's own autonomy rules. What survives: state the surface inventory and the routes before building, and do not wait for a reply. |
| `taste-skill/gsap-canonical-code-skeletons` | adapt | A dependency-specific code skeleton in a general skill is how every experience site starts to look like GSAP demos. Behaviour lives in `references/experience/scroll-scrub.md`, framework-agnostic. |
| `taste-skill/full-output-enforcement` | adopt (unchallenged) | Dropped from the always-loaded surface: it is a harness behaviour, not a design mechanism, and it was never red-teamed. |
| `agent-elements-21st/*`, `remotion-skills/*`, `magic-21st/*`, `website-builder-setup/*` | mixed | Licence. Not copied, not paraphrased closely, not referenced as text. |
| `impeccable/model-specific-rendition-prior-correction` | adapt | Dropped: it hard-codes a named model's measured bias, which goes stale silently and would need re-measuring per model. The general counterfactual in `direction.md` covers the same failure without the staleness. |
| `frontend-design/named-cliche-calibration` | investigate (refuted) | Not adopted as claimed. The red team showed the "check your plan against these three" instruction does not exist in the source as one paragraph. This candidate uses its own three clusters, derived from `PALETTE-ANALYSIS.md` finding 4 and from the nordrig B build's default, and states the check itself in `direction.md` — so the mechanism is ours and the refutation does not apply to it. |

---

## 11. How REDESIGN works, since it is a different flow

Redesign is not a fifth route; it is a prefix to the same run. `references/common/redesign.md`
is fetched first and it does three things: audit before touching anything (extract the
existing tokens, journeys, brand marks and legal copy); write the **preserve list** — what
must survive the redesign and why; and classify the request as *preserve-and-refine* versus
*redesign*, because doing the second when the user meant the first is an unrequested visual
rewrite. (`taste-skill/redesign-mode-detection-and-audit-first`,
`impeccable/preserve-vs-redesign-semantics`)

The extraction is input, never target. C5's rule holds verbatim: extraction describes what
exists; the brief decides what to build. A literal clone is the one case where fidelity is
the goal and the user must have said clone/match/replicate in those words — it is never
inferred. The release adds one assertion: the rebuilt surface must differ measurably from
`before/` on the expressive surfaces while every item on the preserve list is intact.

---

## 12. How it is tested

**Gates that run in CI on every commit to the skill:**

1. `tools/check-repo.py` — `SKILL.md` under 500 lines. Currently 131. (A2)
2. `tools/context-budget.mjs` — fails if ALWAYS > 4,500 or ROUTINE > 7,000 estimated tokens.
   Currently 4,352 and ≈5,640. (A3)
3. `route-lint.mjs` over all four route modules **and both fixtures**. `impure-route.md` must
   fail; if it ever passes, the lint was weakened and CI fails on that alone.
4. `verify.mjs` over `benchmarks/06-redesign/before/` — **must keep failing**. (A7,
   `C-control-group`)
5. Unit tests: BM25 tokeniser, corpus routing, route schema parser, journey file parser.
6. A grep gate over the whole skill for the phrase pattern "run the X skill" — zero matches
   permitted. (A1, `C-no-skill-chain`)

**Tests that run against builds:**

7. **Route-swap invariance and sensitivity** on the holdout, both verdicts required. (§1)
8. **Portfolio diversity** across the holdout plus the two prototypes — the A9 criterion —
   using `diversity.mjs`, plus a human read of the three sets of screenshots side by side.
   The known-bad round-8 recipe must still trip on a clean install.
9. **No-sub-agent run**: the full flow executed with sub-agents disabled, confirming the
   critique degrades with a printed first-line banner rather than silently. (C8)
10. **The re-expression A/B** — this is the candidate's own core-hypothesis test, and it is
    cheap. One brief, one model, two arms: `direction.md` as written above, versus
    frontend-design's original `SKILL.md` verbatim (which Apache-2.0 permits us to ship).
    Blind-scored. If the re-expression scores materially below the original, the honest
    response is to ship the original verbatim with attribution and keep our routed layer —
    not to argue that our phrasing is better. That decision is pre-registered here so it
    cannot be relitigated after seeing the number. (`risk:reexpression-may-not-transfer`;
    `ponytail/honest-benchmark-correction` applies to how the result is published)
11. **The fake-edge test.** Feed a brief that fits none of the four routes — a museum
    wall-label generator, a wedding RSVP microsite, a school timetable board. Assert the run
    names the mismatch, picks the closest route with a stated reason, records it in
    `REPORT.md`, and does not silently invent a fifth route or stall. A router that only
    works on the four cases it was designed for is a router that fails in production.
12. **The blend test.** A pricing page. Assert both `marketing` and `commerce` obligations
    appear in `BUILD.md` with their source named, rather than one being silently dropped.
13. **The holdout** — one unseen brief, complete multi-page build, blind comparison against
    the strongest relevant baseline, screenshots. (A8, and `C-no-new-h2h`: one holdout, one
    baseline, no new arms.)

---

## 13. Where this candidate is weakest

Six honest ones, roughly in order of how much they should worry an adjudicator.

**1. The router's marginal value over one conditional floor file is unproven.** If route
modules contain no appearance and no taste, then what they contain is production QA — and
production QA does not obviously need to be *routed*. A single `obligations.md` with
conditional sections ("if money changes hands: …", "if the user is operating data: …") would
deliver the same duties, save the router table (~350 always-loaded tokens), the four-file
split, the purity lint and the swap test. My answer is that the four flows genuinely differ
in bulk — a checkout journey set has nothing in common with a dashboard's empty-state
coverage — and separate files are what let each be complete without being always-loaded. But
that is an argument about file size, not about correctness, and a reviewer is entitled to
call the router ceremony.

**2. The purity lint catches syntax, not semantics.** "The surface should feel spacious and
considered" contains no hex, no px, no font name, passes every check I have specified, and
is a taste instruction. The banned-adjective list is a patch, not a fix, and it is trivially
routed around by a synonym. The seven-heading schema is the stronger half of the defence —
there is no heading where that sentence belongs — but a determined author could smuggle taste
into the Job paragraph, which is prose by necessity. The lint raises the cost of the failure;
it does not make it impossible.

**3. Four routes is still a bucket taxonomy, and blends are real.** Pricing pages,
configurators, editorial-that-sells, marketing dashboards. The skill names both routes and
records the split, which is more honest than v2.3's single assignment, but nothing checks
that the blend was correct. impeccable's own ledger record flags exactly this: "blended-mode
surfaces aren't well covered; no check catches a wrong classification."

**4. Route-swap is a release test, not a per-build guarantee.** It requires building one
surface twice. That is affordable on the holdout and on a prototype; it is not affordable on
every customer build. So the strongest measurement in this candidate runs periodically, which
makes it an audit rather than a guarantee. Between audits, purity rests on the lint — see
weakness 2.

**5. The five-direction shortlist is prose-enforced and nothing checks it.** impeccable's
original used a hash to force a non-top-1 index; I dropped the hash because a hash choosing
the direction is a script deciding the design, which `C-no-mechanical-creativity` forbids. The
cost of that principled drop is that the anti-argmax mechanism is now a discipline the model
can quietly skip under pressure, and `DIRECTION.md` can contain four killed directions that
were reverse-engineered after the winner was already chosen. There is no test that
distinguishes genuine generation from retrospective justification.

**6. Diversity protection needs history it does not have on day one.** `diversity.mjs` can
only veto against builds it has seen. The known-bad recipe is hard-coded so a fresh install
is not defenceless, but that blocklist was seeded from round 8 — it protects against the
last house style, not the next one. The first two customers of a new install get layers 1–5
and 7, but not layer 6.

---

## 14. Why this candidate might lose the adjudication

The single measurement that should drive this decision says the winner had **one file, no
router, no scripts, no data**. This candidate reintroduces a router — the precise structure
that `gallery/showcase.json` records as producing 0/8 — and defends it with a schema, a lint
and a swap test. Every one of those defences is new code that has never run. An adjudicator
comparing three candidates has a clean line to take: *the flat candidate needs no defence
because it has no attack surface; the routed candidate spends its budget building a fence
around a thing whose absence would be simpler and cheaper.*

Second, the arithmetic is against me on the one axis that was actually measured. 4,352
always-loaded tokens is 2.1× the entire skill that won. I believe most of that delta buys
production capability frontend-design demonstrably lacked, and `direction.md` at 1,502 tokens
is genuinely leaner on taste than the winner. But if the true mechanism behind 59-vs-40 was
*attention concentration* rather than *what the tokens said*, then any candidate carrying a
router table and a floor into the always-loaded context is diluting the thing that won, and
the flattest candidate wins on exactly the axis the repo measured.

Third, "the router routes duties, not taste" is a distinction an adjudicator may reasonably
refuse. Required journeys imply mechanisms; mechanisms imply components; components imply
layout. If a reviewer decides that "cart persistence, sticky purchase control, four required
commerce journeys" already determines most of what a shop page looks like, then the purity
claim is a relabelling and the house style comes back through the obligations door. I think
the nordrig forensics argue the other way — build B had every one of those rules and still
had a *choosable* look, it simply never chose one — but that is an interpretation of an n=1
comparison, and I have said so.
