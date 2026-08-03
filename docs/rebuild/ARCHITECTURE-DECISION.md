---
title: Architecture decision — SiteSmith v3
state: S5_ARCHITECTURE
status: decided
candidates: docs/rebuild/ARCHITECTURE-CANDIDATES.md
supersedes: skills/sitesmith/v2/
ai_generated: "(C)"
---

# The decision

**Build MINIMAL, with fifteen recorded attacks answered rather than inherited.** It is
the only candidate that survived both its red team and its feasibility review, and it
is the closest reading of the one measurement this repository has: 2,078 tokens of
prose that raised the model's standard beat 6,546 tokens that described the model's
output, 59 to 40. Three things change from the candidate as submitted. First, the two
new scripts that reached into the design layer are demoted — the token-vocabulary check
becomes a printed measurement rather than a release gate, and the ledger keeps only the
one *measured* known-bad seed instead of also banning a palette region its own cited
source calls correct for whole categories — because the precedence ladder says the
client's explicit brief wins and no script may outrank it. Second, nothing that the
measurement never indicted gets deleted: the corpora, blocks and verbatim references
stop shipping in the bundle by **moving to `docs/upstream/`**, which keeps the licence
audit trail intact, keeps every per-file provenance hash valid, and converts a 31-file
amputation into a path-scope change. Third, the routine token budget is recomputed
honestly including the two files the candidate omitted, `PIPELINE.json` and the
installer are kept, and `verify.mjs` gains the one thing all three candidates left
unbuilt — the `prefers-reduced-motion` render that `CONFLICT-MATRIX` C4 resolved on
and nobody implemented. From the runners-up it takes verb-based per-surface routing and
one fetched stack adapter (layered), the floor-purity and three-renditions authoring
lint that both runners-up independently arrived at, the fake-edge test, and the
pre-registered contingency that replaces our re-expressed creative prose with
`frontend-design/SKILL.md` verbatim if the smoke test says our phrasing lost the power.

---

## 1. The final shape

### File tree

```text
skills/sitesmith/
├── SKILL.md                  ~240 lines · ~11,230 B · ~2,810 est tokens · ALWAYS LOADED
├── floor/
│   ├── buy.md                money or a price is on this surface            ~5,600 B
│   └── operate.md            the visitor is operating a tool                ~5,600 B
├── redesign.md               code already exists                            ~4,000 B
├── verify.md                 release commands, journey contract,
│                             asset-manifest contract, degraded mode         ~2,800 B
├── stacks/
│   ├── nextjs.md  react-vite.md  astro.md  static.md    one fetched, ~1,400 B each
├── scripts/
│   ├── verify.mjs            v2.3 + one reduced-motion pass
│   ├── journey.mjs           v2.3, one pointer string corrected
│   ├── gate.mjs              NEW — six refusals plus one printed measurement
│   ├── ledger.mjs            NEW — direction-record parse + render-fingerprint veto
│   ├── stack.mjs             stack-router.mjs, adapter target CSV → md
│   └── package.json          pinned playwright/axe versions, unchanged
├── PIPELINE.json             KEPT — the installer generates every provider pack from it
├── THIRD-PARTY-NOTICES.md
├── THIRD-PARTY-PROVENANCE.json
└── LICENSES/{Apache-2.0.txt, MIT.txt}

repo, not shipped in the bundle:
docs/upstream/                the 75 provenance-covered files, MOVED not deleted
tools/provenance-build.mjs    NEW — the generator that does not exist today
tools/floor-lint.mjs          NEW — floor purity + three renditions
tools/context-budget.mjs      REWRITTEN — declared manifest, thresholds, non-zero exit
tools/portfolio-diversity.mjs MOVED from skills/ — A9 and the showcase only
tools/critique-gate.mjs       MOVED from skills/ — benchmark lab only
```

11 shipped files plus two licence texts, down from 139. 6 markdown fetched at named
steps, down from 67. 5 scripts, down from 20. 0 CSVs and 0 HTML blocks in the bundle.

### What is always loaded, recomputed

Estimated tokens = bytes / 4, the same estimator as `BASELINE-CONTEXT-BUDGET.json`.
These are **targets and CI ceilings for files that do not exist yet**, not measurements
of files that do. That distinction is why MINIMAL's headline number was wrong and it is
stated here so nobody quotes 2,810 as a measurement.

| `SKILL.md` section | Bytes | Est. tokens |
| --- | ---: | ---: |
| frontmatter (name, trigger description, licence) | 730 | 183 |
| §1 persona with stakes and a prior rejection | 500 | 125 |
| §2 pin the subject and commit | 450 | 113 |
| §3 go into the subject's world — concrete nouns, not adjectives | 800 | 200 |
| §4 three or more theses, one built, chosen on a named axis | 750 | 188 |
| §5 the named defaults, including our own measured recipe | 900 | 225 |
| §6 two-pass token system, one signature, one risk, originality self-test | 1,500 | 375 |
| §7 copy as design material | 900 | 225 |
| §8 the universal craft floor + eight numeric accessibility facts | 1,100 | 275 |
| §9 routing — what is the visitor doing on this surface | 500 | 125 |
| §10 run order: build / inspect / release, with every loop cap | 1,800 | 450 |
| §11 precedence ladder and the brief-primacy waiver | 700 | 175 |
| §12 degraded mode and attribution | 600 | 150 |
| **ALWAYS** | **11,230** | **≈2,810** |

CI ceiling **ALWAYS ≤ 3,100**. That is 290 tokens of headroom — deliberately ~10 %,
because a ceiling with 148 tokens of headroom fires on the first wording fix, which is
a finding that landed against the layered candidate.

| Scenario | Files opened | Est. tokens |
| --- | --- | ---: |
| Marketing or editorial build (most common) | SKILL + one stack adapter + verify.md | **≈3,860** |
| Shop build | + `floor/buy.md` | **≈5,260** |
| Shop redesign (worst realistic) | + `redesign.md` | **≈6,260** |
| v2.3 always-loaded, for comparison | SKILL + v2/README + v2/10-core | 6,546 |
| v2.3 routine, for comparison | + largest mode + largest task | 11,934 |

CI ceilings **ROUTINE ≤ 6,000** and **REDESIGN ≤ 7,000**, both failing non-zero. The
honest claim, which MINIMAL's version was not: *the worst realistic run of the new skill
costs less than the always-loaded floor of the old one, and about half its routine run.*

### What is fetched, and when

| File | Opened when | Why it is not always loaded |
| --- | --- | --- |
| `stacks/<stack>.md` | once, after `stack.mjs` writes the adapter name, before the first file is written | four stacks in one always-loaded file is three stacks of dead weight per run |
| `floor/buy.md` | money or a price appears on this surface | commerce obligations are an answer to a question, not a shaper of taste (C10) |
| `floor/operate.md` | the visitor is operating a tool — tables, forms, consoles, dashboards | same |
| `redesign.md` | code already exists | REDESIGN is a minority of runs |
| `verify.md` | at release | it is a command list and two contracts, not judgement |

There is deliberately **no `floor/decide.md`**. A craft floor for the surface where the
visitor is deciding whether to care could only contain rules that are either universal
— in which case they belong in §8 — or a look. Shipping a file of looks for the most
common kind of surface is precisely how three unrelated briefs came to share five moves:
`v2/modes/marketing.md` has twelve numbered decisions and six of them are appearance,
including a literal "fade-and-rise staggered by no more than three elements". Deciding
surfaces are served by the always-loaded creative surface, which is where taste belongs.

### What each script does

Every script can refuse and none can author. That is the test, and it is structural
now rather than promised, because the 86 KB Python direction engine that scored 40 is
gone.

**`verify.mjs`** — kept from v2.3 with one addition. Screenshots at 375/768/1440; axe in
both colour schemes with a missing scan treated as blocking unless `--no-axe` is
explicit; raw-HTML structural checks, because the live DOM auto-repairs a missing root
and hides the defect; same-origin dead-link crawl; console errors; failed requests;
horizontal overflow; `--font-stress`. **New: one `emulateMedia({ reducedMotion:
'reduce' })` pass** that screenshots at 1440 and asserts zero running CSS animations and
no transform/opacity transition longer than 100 ms. This is not an invented mechanism —
`scroll-world/reduced-motion-full-degrade` is adopt/confirmed in the ledger and
`CONFLICT-MATRIX` C4 states this exact test as its resolution. It was simply never
built. ~25 lines. `benchmarks/06-redesign/before/` must keep failing.

**`journey.mjs`** — kept byte-for-byte except line 27, which today prints a pointer to
`v2/40-interaction.md`, a file that stops existing. It points at `verify.md`, which now
carries the journey contract.

**`gate.mjs`** — one command, six refusals, one measurement.

1. placeholder and dummy-identifier scan — Lorem, "John Doe", "Acme Corp", empty brand
   marks, placeholder prices
2. unsourced-claim scan — governs **claims**, never **voice** (C9). A fixture proves
   diegetic `PROC-03`-style labels do not trip it
3. asset manifest — every shipped image is manifested and `ready`; its authoring
   contract moves into `verify.md` so the gate is not orphaned from its instructions
4. token drift — values in the shipped CSS the direction file never declared
5. **journey coverage — one journey per surface listed in `.sitesmith/direction.md`**,
   not v2.3's "at least one exists". This is the mitigation for deleting `blocks/`, and
   unlike MINIMAL's version it is actually in the spec
6. antipattern lint, ~12 rules, **absolutes only** — defects with no legitimate use.
   Never an aesthetic ban list; that would re-import the wall whose shape C1 resolved
   against, with CI behind it

Plus one thing it prints and never fails on: the share of CSS custom-property names
drawn from a fixed generic vocabulary (`bg`, `surface`, `fg`, `muted`, `border`,
`accent`, `primary`, `card`, `ring`, `input`, `destructive`, `radius`, `shadow`). It
goes into `PRODUCTION-REPORT.md` and into the A9 fingerprint. Why measured and not
gated: see §3.

**`ledger.mjs`** — three jobs, all refusals.

- `parse` — validates `.sitesmith/direction.md`: at least three candidate theses
  recorded in the order they were written, exactly one marked built, and a non-empty
  one-sentence reason naming the axis on which it beats the others. It refuses an
  incomplete artifact and has no opinion about which thesis. This is a completeness
  check on a file, the same class as refusing a build with no asset manifest.
- `check` / `commit` — render fingerprint against append-only
  `~/.sitesmith/renders.jsonl`, plus one hard-coded seed: the measured round-8 recipe
  (`mono-uppercase-labels` + `hairline-separators` + `tabular-figure-motif` +
  `flat-surfaces`), which must trip on an empty ledger. Veto only, never proposes (C7).
  No client URL is stored.
- honours the brief-primacy waiver below.

**`stack.mjs`** — `stack-router.mjs` with the adapter target changed from
`data/stacks/<stack>.csv` to `stacks/<stack>.md` and a `static` adapter added. It keeps
its refuse-to-guess property (`ui-ux-pro-max/stack-never-assume`): when nothing matches
it exits non-zero rather than picking one.

**Repo tools, not shipped, zero product cost:** `tools/portfolio-diversity.mjs` (A9 and
the showcase only — never during a customer build, because a single site cannot be
measured for a property that only exists across a set); `tools/floor-lint.mjs`;
`tools/provenance-build.mjs`; the rewritten `tools/context-budget.mjs`;
`tools/critique-gate.mjs` (benchmark lab).

---

## 2. What produces the creative direction

**The host model, reasoning in thinking, from §1–§7 of `SKILL.md`, before any script
runs except stack detection and before any fetched file is opened.** No script
participates. There is no direction engine, no candidate search, no CSV, no comp
renderer, no dials, and no hash that picks an index.

Six steps, one artifact. An implementer reading this section should be able to write
§1–§7 without further interpretation.

1. **Pin the subject.** If the brief does not say what the thing is, name a concrete
   subject, its audience, and this page's single job, and commit. Vagueness is converted
   into a commitment, not absorbed as freedom.
   (`frontend-design/subject-grounding-mandate`, adopt/confirmed.)
2. **Go into that subject's world and write down concrete nouns.** Its materials,
   instruments, artifacts, units, documents, vernacular, and what it is afraid of.
   *Nouns, not adjectives* — this is the operational form and it is load-bearing.
   Adjectives are category-level, so "industrial", "technical" and "archival" produce
   the same answer for every brief in a category; "bone folder", "sizing drum" and
   "slack water" are not available to any other brief.
   (`sitesmith-current/evidence-before-direction`, adopt/confirmed, compressed from a
   6 KB file to a paragraph.)
3. **Write at least three one-line theses naming what this site IS. Build one, and it
   may not be the first one you wrote unless you can say in one sentence the axis on
   which it beats the others.** All of them are recorded in `.sitesmith/direction.md` in
   the order written, with the chosen one marked and the reason attached.
   (`impeccable/forced-index-direction-roll`, adapt/confirmed — this is exactly the
   re-expression its own ledger `sitesmithForm` field prescribes: "model produces its
   own ranked shortlist, a simple non-LLM tie-breaker forces a non-top-1 pick, no
   external catalog/API dependency" — with the tie-breaker replaced by an audited
   artifact. See §3 for why the hash was rejected and why this is stronger than the
   prose-only version both other candidates settled for.)
4. **Check the plan against the named defaults.** Three clusters from
   `frontend-design/SKILL.md:31` plus **our own measured round-8 recipe**. All are named,
   none is banned, and the brief always wins — including into a named default (C1,
   `frontend-design/brief-primacy-override`). The only forbidden thing is arriving
   somewhere without choosing it.
5. **Two passes over a compact token system.** Pass one: four to six CSS custom
   properties whose *names* are words from step 2; two type roles with a real display
   face distinct from body; a layout concept as ASCII; one signature element with
   everything around it quiet; one named risk against this category's own default.
   Pass two is the originality self-test: work a neighbouring brief for a minute, and if
   you would land in the same place, change something structural and write down what
   changed. (`frontend-design/two-pass-token-system`, `typography-as-personality`,
   `signature-element-restraint`, `hero-as-thesis`, `self-critique-loop`, all
   adopt/confirmed.)
6. **Write `.sitesmith/direction.md`, then build from it.** The contract comes strictly
   after the direction. A design system fixed before anyone asked what the page should
   be is the mechanism that made nine subjects arrive at one ramp.
   (`sitesmith-current/contract-after-direction-plus-token-drift`, adopt/confirmed.)

`.sitesmith/direction.md` is the **only** state file the skill ever writes
(`ai-dev-tasks/checkbox-state-in-file`, adapt). Its shape:

```text
Subject:      <one line>
World nouns:  <6-12 concrete nouns from step 2>
Theses:       1. <line>  2. <line>  3. <line>   [more allowed]
Built:        <n>  because <one sentence naming the axis>
Palette:      --name #hex  x4-6
Type:         <display family> / <body family>
Signature:    <one sentence>
Risk:         <one sentence, against this category's default>
Surfaces:     <list — this is what journey coverage is checked against>
Brief-pinned: "<verbatim quote>"   [optional, 0-n lines]
```

---

## 3. What stops three unrelated briefs converging

Seven devices. **Four are persuasion and three are enforcement, and this document says
which is which**, because the failure being fixed is a skill that claimed mechanical
anti-slop and delivered a house style.

### Persuasion — always-loaded prose

| # | Device | Section |
| --- | --- | --- |
| P1 | The generative rule is indexed on **this** subject's world, so it has a different answer per brief by construction. Operational form: concrete nouns, not adjectives | §3 |
| P2 | At least three theses, one built, the choice justified on a named axis, all recorded | §4 |
| P3 | The named defaults include **SiteSmith's own measured round-8 recipe** alongside frontend-design's three clusters. Naming your own house style in the file that is always in context costs ~90 tokens and is the single cheapest anti-convergence move available | §5 |
| P4 | The originality self-test against a neighbouring brief, with a written record of what changed | §6 |

### Enforcement — scripts and CI, with the exact check named

| # | Mechanism | The check | Where it runs |
| --- | --- | --- | --- |
| E1 | Render-fingerprint veto seeded with the one *measured* house style | `ledger.mjs check` fails on the round-8 device set **on an empty ledger**, and on an exact fingerprint match or ≥4 shared devices against `~/.sitesmith/renders.jsonl`. Veto only; it never proposes a colour, a face or a layout (C7) | per build, at release |
| E2 | The craft floor cannot become a look | `tools/floor-lint.mjs` fails CI if `floor/*.md` contains a hex, an `rgb/hsl/oklch`, a font family, a radius, a shadow, a font-size or a letter-spacing, **or** if any non-obvious outcome lacks a `## Three ways` section showing it satisfied three visually unrelated ways. Two fixtures — one impure, one pure — and the impure one must keep failing, the same discipline as `benchmarks/06-redesign/before/` | repo CI, every commit |
| E3 | Diversity is measured across builds, never inside one | `tools/portfolio-diversity.mjs` across the holdout plus the two prototypes: ground-luminance clustering inside 0.18, no device used by all three, imagery load-bearing somewhere, no layout-signature collision. A9 only | benchmark lab |

E2 is the mechanism the nordrig forensics named and no candidate shipped as a check:
*"a rule that can only be satisfied one way is a house style with a compliance report
attached."* Both runners-up arrived at it independently — Routed Modular as a route
purity gate, the layered candidate as a three-renditions lint — which is the strongest
convergent signal in the review set. It is taken as one lint over two files the
maintainer writes, so it is cheap and it attacks convergence at its source rather than
after a completed build.

### The brief-primacy waiver

Any E1 veto, and the antipattern lint, is overridable by a line in the brief quoted
verbatim into `.sitesmith/direction.md` as `Brief-pinned: "<quote>"`. The waiver is
printed into `PRODUCTION-REPORT.md`. It **never** applies to `gate.mjs`'s honesty checks
or to accessibility.

This closes the sharpest finding against MINIMAL: its §13 gave the client's explicit
request precedence "including a request that lands on a named default" while its §12
forbade editing a check to make it pass, twelve lines apart in the same always-loaded
file. A client asking for a dark technical console with conventional token names had a
build that was correct under one section and unshippable under the other. The waiver is
not a new mechanism — `frontend-design/brief-primacy-override` is adopt/confirmed, and
the `CONFLICT-MATRIX` precedence ladder already puts the brief above skill defaults for
design and never above facts.

### What was demoted, and why the honesty matters

**The token-vocabulary check is printed, not gated.** MINIMAL made it check 5 of
`gate.mjs` with hard release authority: fail any build whose custom-property names are
≥80 % generic. Four reasons it is a measurement here instead:

1. It has no upstream source and no red team. It is derived from `NORDRIG-AB-FORENSICS`
   §1, and that document says in its own words that a thesis step is **"not proven"** to
   cause the win in general — n=1, one subject, one pair of builds, same host model
   writing both. Turning an n=2 observation into a release gate is the exact class of
   error this repo's red team keeps catching in other people's claims.
2. It cannot distinguish "no decision was made" from "a decision was made to use
   conventional names", which is correct for a shadcn or Tailwind theme deliverable
   under C6, for a redesign whose preserve-list pins the existing vocabulary under C5,
   and for an internal console where C2 says convention wins.
3. It is defeated by find-and-replace. Renaming `--bg` to `--paper` satisfies it and
   changes nothing about the design.
4. Mandating it makes it a shared move on every build — which is C1's own stated failure
   test: *"if all three avoid the same three clusters by using the same fourth thing,
   the rule has become a style."*

Measuring it costs 30 lines and cannot be wrong. Gating on it can.

**The ledger keeps one seed, not two.** MINIMAL also hard-coded a dark-ground /
one-saturated-accent veto attributed to `PALETTE-ANALYSIS.md` finding 4. Re-read at
source, finding 4 says the risk is a property of retrieval — *"If the corpus is
retrieved without a brief-fit filter, it will push everything toward the same
amber-on-near-black look"* — and this architecture ships no corpus, so the mechanism is
already gone. The same document's fit table lists dark grounds as the **correct** answer
for whole categories (P03 dev tools, data, gaming; P06 marine, cooling, audio). And its
own rule is relative, not absolute: *"If two consecutive builds land in the same region
of this corpus, that is the house-style signal, and the second one has to justify itself
or move"* — which is what the append-only ledger already does without a hard-coded ban.
So one seed survives: the round-8 recipe, which is a measured SiteSmith house style with
a recorded `portfolio.json`.

### The convergence risk that is not closed

There is **no per-build, pre-render mechanical guarantee** against convergence, and
this architecture deliberately does not invent one. E1 fires at release, which is the
most expensive point to discover the direction was typical. E2 is authoring-time and
can check that three renditions were written, not that they are visually unrelated. E3
needs three finished builds to exist. That is the honest state, and it is better than
the alternative: the one candidate that built a pre-render gate had no source for it, no
red team, no brief input and no override, and it manufactured a shared move across every
build in the name of preventing shared moves.

### The exemplar collision, named rather than hidden

`PROC-03` is simultaneously the best evidence in the repository for what
subject-grounding produces at the copy layer (`NORDRIG-AB-FORENSICS` §5) **and** the
first item on SiteSmith's own measured house style (`v2/README.md`, round 8). Both are
true. MINIMAL's §4 banned it and its §6 taught it eight lines later; the layered
candidate was killed for the same collision at larger scale.

`SKILL.md` §5 states the collision as the rule: *use diegetic labelling if this world
genuinely has it, and then you owe a different move on the other three devices —
because three of four is the recipe.* That is C1-consistent, it is checkable at E1 (the
seed needs all four devices), and it does not pretend the problem is solved. It is the
actual open problem the rebuild has not solved, and it is now visible in the file where
the decision gets made instead of in a post-render veto.

---

## 4. What was taken from each runner-up

### From Standard / Floor / Machine (the layered candidate)

| Taken | Why |
| --- | --- |
| **Verb-based per-surface routing** — what is the visitor *doing* here | Naming floors by the verb rather than the site category forces per-surface routing without anyone having to notice that a shop's About page is "marketing". MINIMAL's two-row table already routed this way; the layered naming makes it unmissable. Adopted with two floors, not three — see §1 for why there is no `decide.md` |
| **One fetched stack adapter, not a four-stack file** | A straight progressive-loading win and the direct fix for MINIMAL's routine-budget breach: a Next.js build should not carry Astro and Vite craft in context |
| **The three-renditions floor-authoring rule** | The direct mechanisation of `mech:craft-floor-without-look`. It is E2 |
| **The pre-registered contingency for the smoke test** | Its best idea, and both red teams said so. If our re-expressed §1–§7 loses, we ship `frontend-design/SKILL.md` verbatim — Apache-2.0 permits it — plus §5's default-naming addition and §8's floor. The architecture is unchanged: Floor and Machine are untouched and one file is swapped. **With its licence bug fixed:** the frontmatter cannot declare MIT over an Apache-2.0 verbatim include, so the swap carries a per-section licence note and a NOTICE entry |
| **The layering axis stated as "who decides and when"** | The same cut MINIMAL reached by asking "does this file's output constitute a design decision?". Two candidates converging on one axis is worth recording as a finding, not a preference |

### From Routed Modular

| Taken | Why |
| --- | --- |
| **Floor purity as a lint** — no appearance value may appear in a floor file | The mechanical half of E2. Its scope is honestly narrower than the candidate claimed: it catches syntax, not semantics, and a synonym routes around it. It is worth having anyway, over two files, at ~40 lines |
| **The floor admission test as an authoring rule** | "Can this line be satisfied in at least three visually unrelated ways? If not it is a house style with a compliance report, and it goes in as an obligation or nowhere" |
| **The fake-edge test** | A brief fitting none of the routes — a museum wall-label generator, a wedding RSVP microsite, a school timetable board — asserting the run names the mismatch, picks the closest surface with a written reason, and neither stalls nor invents a third floor. MINIMAL had no such test |
| **The honesty-versus-taste split of the ban list** | Its `tells.csv` relocation overturned C1 by giving the aesthetic ban list CI enforcement, and that half is rejected. But it is right that a ban existing only as prose ships anyway. The split adopted here: **absolutes with no legitimate use** (fabricated proof, Lorem, "Acme Corp", empty brand marks, unsourced numbers) are honesty and live in `gate.mjs`; **aesthetic clusters** are named, never banned, and live in §5 |
| **Its diagnosis of v2.3, quoted from the code** | Six of twelve numbered decisions in `v2/modes/marketing.md` are appearance. That is why there is no `floor/decide.md` |

### Taken from the reviews rather than the candidates

- **Do not start with the deletion.** Deleting `data/` alone makes `check-repo.py`
  unimportable at line 646, so the repo loses its own self-check before a replacement
  exists and eleven CI steps go red at once with no green baseline to bisect.
- **Roughly 40 % of the work is CI, provenance and installer plumbing.** All three
  candidates budgeted it at zero. It is sequenced first here.

---

## 5. Rejected alternatives, each with its reason

| Rejected | Reason |
| --- | --- |
| **Routed Modular's four route modules, `route-lint` over routes, `route-swap`** | The router's marginal value over one conditional obligations file is unproven by the candidate's own admission, and its two enforcement scripts do not work: `route-swap`'s invariance and sensitivity assertions are mutually exclusive and it has no same-route control arm, so a diff between two model generations cannot be attributed to the route. With route-swap gone, "the router routes duties, not taste" is an assertion again — and the assertion is what produced 0/8 |
| **`pick.mjs` (hash selects the thesis index)** | Violates `C-no-mechanical-creativity` and A4 literally — selecting is a fourth verb, and §2 made the output binding. It is also unauditable and bypassable: the candidate list is never persisted, and the script takes only `--subject` and `--count`, so a model can run it first and author its list around the answer. Replaced by the same mechanism made auditable: the model chooses, all candidates are recorded in the order written, and `ledger.mjs parse` refuses the file if fewer than three exist or the reason is empty |
| **`schema/state.schema.json` + `state-fields-consumed.mjs`** | The lint does not work as specified — the scripts take CLI arguments, not state fields, so four of its `consumedBy` annotations are false. A typed contract over a file one skill writes, policed by a lint that proves a different piece of ceremony is not ceremony |
| **`data/font-families.txt` (~1,800 Google Font names)** | No script consumes it and no rule references it. If the model reads it, it is a seeded menu shaping the type layer — the thing that got `static-ux-knowledge-tables` and `typography.csv` dropped, only worse, because a bare name list carries no reasoning. It is also an undisclosed derived work of a ui-ux-pro-max CSV the same candidate deletes |
| **The token-vocabulary check as a release gate** | See §3. Demoted to a printed measurement, not dropped |
| **The hard-coded dark-ground / warm-accent veto** | Misreads its cited source, and pre-bans a documented best-fit region for two of the eight palettes. See §3 |
| **Merging `portfolio-diversity.mjs` into `ledger.mjs`** | It runs only for A9 and the showcase. Coupling a benchmark instrument to the path every customer build calls buys nothing and risks a customer build blocking on a portfolio property |
| **Deleting `data/`, `blocks/` and `references/` from the repository** | The measurement indicts the always-loaded surface. `BASELINE-CONTEXT-BUDGET.json` records `data/` at 57.2 % of the package and 0 % of a routine run, so they cannot have caused a 40-vs-59 loss and deleting them cannot be credited with fixing it. They stop **shipping**; they move to `docs/upstream/`. Deleting them would also force a 31-of-75-file provenance regeneration and take the licence audit trail with it |
| **Deleting `PIPELINE.json`** | `bin/sitesmith.mjs:130` generates every provider pack from it, `:235` is the only automated `playwright install` path, and the clean-install CI job asserts its presence. Deleting it silently degrades A7 to "the mechanical release verdict is missing" on every fresh machine |
| **`sitesmith-current/structurally-different-direction-gate`, declared half** | Adopt/confirmed at 0.9, and the drop is partial and evidence-led. Its rendered-measurement half is kept as E1. Its declared half — five macro axes plus four grammar fields, mechanically diffed — is dropped, because round 8 is the standing evidence that all three comps cleared that gate while the portfolio failed, and because the ledger's own `failureModes` field says unrecognised phrasing silently becomes a skipped note. Routed Modular reached the same conclusion independently: measure the render, do not vet the declaration. Recorded as adopt → adapt against A6 |
| **`taste-skill/three-dial-system`, `ui-ux-pro-max/design-dials`** | Dials are a steering vocabulary for a generator. There is no generator. Keeping them leaves a mechanical-creativity surface with nothing behind it. A number standing in for a decision; §6's one named risk does the same job in a sentence and cannot be consumed by a script |
| **`taste-skill/bias-correction-bans-with-override-paths` (70+ bans)** | C1 resolved naming over banning. A wall has a shape, and the source's own autopsy flags the list as the mechanical rules-execution its thesis argues against |
| **`ui-ux-pro-max/bm25-csv-retrieval`, `domain-auto-detect`, `static-ux-knowledge-tables` as shipped corpora** | Nothing left in the bundle to retrieve from, and ranked retrieval over a fixed corpus returns the same top rows for similar queries — convergence with a search engine attached. The eight numeric accessibility facts survive inlined in §8, ~40 words |
| **`taste-skill/self-administered-preflight-checklist`** | Duplicates `gate.mjs` in prose. Instruction budget spent restating a program is the failure the measurement indicts |
| **`taste-skill/image-first-generation-discipline`** | Requires a paid image API. Charter third-party spend is 0 |
| **`taste-skill/gsap-canonical-code-skeletons`** | C3: add a dependency only when the platform cannot do the thing. CSS scroll-driven animations and View Transitions cover the common cases, and a dependency-specific skeleton in a general skill is how every experience site starts to look like the same demos |
| **`scroll-world` scrub/seam/pacing/encoding mechanisms (6)** | One technique for one kind of site. Six mechanisms of it in a general website skill is the catalogue anti-goal. Only `reduced-motion-full-degrade` generalises, and it is now the one thing added to `verify.mjs` |
| **`before-implementing` unknowns taxonomy, blindspot pass, map-vs-territory, calibration (4)** | Each costs more tokens to explain than the behaviour it produces, and the combined output collapses into two clauses already in §2 and §3. A taxonomy of kinds of not-knowing is a description of the model's own process |
| **`ai-website-cloner-template` fan-out machinery (5)** | All presuppose dispatching sub-builders. There is no fan-out, so there is no handoff to specify, gate or budget (C8: delegation is an optimisation, never a requirement) |
| **`agency-agents/orch-02-persona-walkthrough`** | Confidence 0.55, and a second critique framework competing with the one that actually happens. §10's "write a specific criticism of each breakpoint" is the same instrument at a twentieth of the cost |
| **`ai-dev-tasks/two-phase-approval-gate`** | A hard stop-and-wait breaks non-interactive hosts. Reduced to L1: at most two questions, each with a recommended default, silence is an answer |
| **`ponytail/self-validating-llm-judge`** | Validating a judge needs a labelled set this repo does not have. An unvalidated judge presented as evidence is worse than no judge |
| **`sitesmith-current/assignment-blinded-critique-gate` as a default step** | Moved to `tools/`, not deleted. Its own form note: opt-in for portfolio and benchmark claims, never a default single-site step |
| **`blocks/` shipped in the bundle** | Shared starting shapes produce shared shapes. Replaced by C6 stated in one sentence plus named WAI-ARIA APG patterns in `floor/operate.md`. This is the riskiest call in the document — see §7 |
| **All 12 ledger `investigate` mechanisms** | Each was refuted as claimed. Adopting a refuted claim before re-reading the source is how a wrong count becomes a rule |
| **All 31 ledger `reject` mechanisms** | Already rejected with written reasons; nothing here revisits them |

---

## 6. How each acceptance criterion is met

| # | Criterion | How it is met, and what checks it |
| --- | --- | --- |
| **A1** | One skill, the user types one thing | No step names another skill. `SKILL.md` §12 is attribution, not instruction. Checked by a CI grep for skill-invocation phrasing with zero matches permitted |
| **A2** | `SKILL.md` is a control plane, under 500 lines | Target ~240 lines. `tools/check-repo.py::_skill_length`, unchanged and already passing today |
| **A3** | Progressive loading; a routine task never loads the whole rule set | ALWAYS ≈2,810 / ROUTINE ≈5,260 / REDESIGN ≈6,260 est tokens. **`tools/context-budget.mjs` is rewritten** to read a declared ALWAYS/ROUTINE manifest from `SKILL.md` frontmatter instead of hard-coding `v2/` paths, to apply thresholds (3,100 / 6,000 / 7,000) and to exit non-zero. Today it hard-codes three v2 paths, has no threshold and always exits 0 — which is why all three candidates could claim A3 was "measured" while proposing a gate that would have measured nothing |
| **A4** | Creative decisions made by the host model, not a script | The direction engine is gone, so this is structural for the mechanism that scored 40. No shipped script selects: `ledger.mjs parse` checks a file is complete, `ledger.mjs check` refuses a fingerprint, `gate.mjs` refuses six defect classes and *prints* the seventh measurement. Checked by unit tests asserting each script's input surface, plus review |
| **A5** | Every adopted mechanism traces to source, commit and licence | `SOURCE-REGISTRY.json` + `MECHANISM-LEDGER` + `THIRD-PARTY-NOTICES.md`, all retained. The 75 provenance-covered files **move rather than delete**, so every `canonicalFileSha256` stays valid; only the six group `treeSha256` values, the coverage tree hash and the manifest self-hash are regenerated, by `tools/provenance-build.mjs`. Re-expressed mechanisms from MIT and licence-unconfirmed sources are listed individually in the notices rather than swept under "everything else is original work, MIT" |
| **A6** | Every rejected mechanism has a written reason | §5 above, plus the ledger's `decision` field. The one adopt→adapt demotion (`structurally-different-direction-gate`) is written out in full rather than recorded as a drop |
| **A7** | Browser verification works and is honest | `verify.mjs` kept, plus the reduced-motion pass that closes C4's own unbuilt test. Fail-closed: a check that could not run withholds the verdict and the report must state that the mechanical release verdict is missing. `benchmarks/06-redesign/before/` must keep failing — reported FAIL with 13 blocking issues by the feasibility review against the unmodified script; **re-confirm in step 1 before anything is touched** (C-evidence-over-frontmatter) |
| **A8** | One holdout build ≥ the strongest relevant baseline | One unseen brief sealed before the build. Baseline: `frontend-design/SKILL.md` verbatim plus a manual production pass — the strongest relevant arm and the only one that has beaten SiteSmith. Full site both sides, screenshots at three widths, blind adjudication, **no new head-to-head arms** (C-no-new-h2h). If it loses, the number is published as it landed and there is no re-run without a changed hypothesis (`ponytail/honest-benchmark-correction`) |
| **A9** | No house style across the holdout plus two prototypes | `tools/portfolio-diversity.mjs` across the three, with the round-8 seed still tripping on a clean install. **The A9 axes are not pinned by the architecture** — because the token-vocabulary check is a report rather than a mandate, the vocabulary axis can vary, which was a live finding against MINIMAL |
| **A10** | Loops terminate | Seven loops, seven integer caps, no loop whose exit is "until it is good". L1 clarifying questions: 1 round, ≤2 questions, each with a default, silence is an answer. L2 thesis revision after the originality self-test: **cap 1** — this is one of the two loops MINIMAL left uncapped. L3 direction veto: cap 2, then report the collision and the theses tried, and do not try another. L4 build/edit on one defect: cap 2, then report unresolved. L5 inspection: 2 rounds, each opening with one word — ship, fix or rebuild — and **at most one rebuild round per run**, which closes MINIMAL's legal "inspect twice, fix nothing" path. L6 release rerun: cap 2, then write the failure into the report and never edit a check to make it pass. L7 self-improvement: does not exist; the anti-goals forbid it. The run always terminates in a written `PRODUCTION-REPORT.md`, never in a question |

---

## 7. Surviving risks

Stated in the order they are likely to bite.

1. **The re-expression may not transfer.** This is the charter's own open
   `risk:reexpression-may-not-transfer` and it is not eliminated, only made cheap to
   lose: the pre-registered contingency swaps §1–§7 for `frontend-design/SKILL.md`
   verbatim, leaving Floor, Machine and the control plane untouched. The smoke test is
   n=1 and cannot detect a set-level failure — which was a landed attack on MINIMAL and
   is accepted here, because the set-level question is A9 and it needs three builds that
   do not exist yet. The mitigation is sequencing, not statistics: run the smoke test
   before anything is deleted, and treat a loss as a file swap rather than a rebuild.
2. **The anti-argmax step is audited, not forced.** A model can write three theses and
   justify the one it wanted. `ledger.mjs parse` proves the list exists and the reason
   is non-empty; it cannot prove the list was written before the choice.
   `impeccable`'s measured 30-of-35 identical concepts says unassisted argmax converges,
   so this is a real residual. **Accepted rather than fixed**, because the only stronger
   mechanism proposed was a hash that selects the design, which violates a hard
   constraint literally and was unauditable in exactly the same place.
3. **Deleting `blocks/` from the bundle is the riskiest call in this document.** A model
   authoring an accessible combobox or a focus-trapped mega-menu from memory will
   sometimes get it wrong. `floor/operate.md` names the requirement and points at the
   WAI-ARIA APG; nothing supplies an implementation. `gate.mjs` check 5 (one journey per
   surface in `direction.md`) catches *absence of testing*, not absence of correctness,
   and journeys are author-written — so a behaviour nobody thought to test is invisible
   to the gate meant to catch it. This is MINIMAL's own stated weakest point, kept, with
   the mitigation actually written into the gate spec this time.
4. **The ledger is a home-directory file.** `~/.sitesmith/renders.jsonl` is empty on any
   fresh machine, CI runner or second developer, so E1 reduces to the single seeded
   recipe there. Accepted: the alternative is committing render fingerprints of client
   work into a public repository. The ledger's own recorded failure mode says exactly
   this and it has never been solved.
5. **`floor-lint` checks that three renditions were written, not that they are visually
   unrelated.** It is a maintainer-discipline check, not a proof. Accepted; it still
   attacks convergence earlier and cheaper than anything else available.
6. **A9 needs three builds to exist.** Until the holdout and the two prototypes are
   built, the portfolio gate is unexercised and the house-style claim is unproven. This
   is why A9 sits at the end of the build order and not in the middle.
7. **2,810 est tokens is 1.35× the 2,078 that won.** The delta is control plane required
   by A1 and A10. If the smoke test shows the control plane diluting the creative
   surface, the fallback is stated now: the control plane moves out of `SKILL.md` into a
   `run.md` fetched at step 1, taking ALWAYS to roughly 1,900 and making the always-loaded
   surface almost purely creative. That fallback is cheap because it is a cut, not a
   rewrite.
8. **The CI, provenance and installer bill is real: 30–45 hours.** Two independent
   feasibility reviews found it against all three candidates. It is not reduced here,
   only sequenced first and made cheaper by moving rather than deleting the covered
   files. `check-repo.py`'s vacuous-pass class is the dangerous part — four checks that
   glob `references/*.md` would silently pass on an empty set and stop guarding the
   licence trail while CI stayed green. Moving rather than deleting is what keeps them
   meaningful; each must still be repointed and each repoint verified against a
   deliberately broken fixture.
9. **`gate.mjs` at ~18 KB absorbing four scripts totalling 75 KB is an unbuilt
   compression claim.** If it lands at 40 KB the maintenance argument for merging
   disappears. Accepted as a risk to the estimate, not to the architecture: the checks
   are independently fixtured either way.

---

## 8. The first three implementation steps

Nothing is deleted, moved or renamed in any of these. CI stays green throughout.

**Step 1 — the creative surface, and the test that decides whether any of this is
right. ~10–16 h.**
Write `SKILL.md` §1–§8 (creative method plus the universal floor) as a standalone file.
Run smoke test S10-1 first, before anything else exists: same brief, same host model,
same evidence; arm A is `frontend-design/SKILL.md` verbatim, arm B is our §1–§8 with the
control plane stripped. Blind-scored on the existing rubric. Two builds, not a study
(C-no-new-h2h). The response is pre-registered: if arm B loses materially, §1–§7 are
replaced by an Apache-2.0 verbatim include with a per-section licence note and a NOTICE
entry, and the architecture does not change. While the models run, re-confirm
`benchmarks/06-redesign/before/` still fails the unmodified `verify.mjs` — that is A7's
control group and it is the one thing that must be true before and after everything.

**Step 2 — teach the repository the new shape while the old shape is still on disk.
~20–30 h.**
Write `tools/provenance-build.mjs`, the generator that does not exist today — three
readers, zero writers. Make `check-repo.py`'s `SKILL`/`REFS`/`DATA` roots configurable
so the six group globs can point at `docs/upstream/` without a manifest rewrite, and
add a per-group root to `THIRD-PARTY-PROVENANCE.json`. Add a deliberately broken fixture
for each of the four checks that currently glob `references/*.md`, so a vacuous pass
fails CI instead of going green on an empty set. Regenerate the six group `treeSha256`
values, the coverage tree hash and the manifest self-hash; every per-file
`canonicalFileSha256` is unchanged because no content changes.

**Step 3 — make A3 a number a gate can fail on. ~4–6 h.**
Rewrite `tools/context-budget.mjs` to read a declared `always:` / `routine:` manifest
from `SKILL.md` frontmatter instead of the hard-coded `['SKILL.md','v2/README.md',
'v2/10-core.md']`, apply the three thresholds, and exit non-zero on a breach. Wire it
into `.github/workflows/verify.yml` next to `check-repo.py`. Then re-measure the step-1
`SKILL.md` against the 3,100 ceiling with the real byte count rather than this
document's estimate, and correct the estimate here if it is wrong.

Only after those three does anything move: the files relocate to `docs/upstream/`, then
the scripts are written alongside the old ones, then `verify.yml` is rewired, then —
last — the old tree is removed in one commit with CI already expecting the new shape.
