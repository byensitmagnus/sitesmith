---
title: Budget triage — what stays resident, what is fetched, what is dropped
state: S5_PLACEMENT
status: decided
inputs: docs/rebuild/PLACEMENT.json, docs/rebuild/CONFLICT-MATRIX.md, docs/rebuild/research/_forensics/INSTRUCTION-BUDGET-VS-QUALITY.md, docs/rebuild/BASELINE-CONTEXT-BUDGET.json
method: estimated tokens = bytes / 4
measured: ALWAYS 2838 is a real measurement of the real SKILL.md now in the repository
reserved: every scenario figure was measured against placeholder files stubbed to their caps, so those are budget reservations, not measurements. tools/context-budget.mjs currently exits 1 on this package and names each declared file that does not exist yet, which is the correct state
ai_generated: "(C)"
---

# Budget triage

## The decision

Hold the creative surface at **2,838 est tokens** — 82 above the surface that tied
frontend-design in the blind re-test, 262 below the ceiling, and nowhere near the 4,049
the unfiltered placement would have produced. Nine of the nineteen SKILL.md placements
are admitted, and every one of them changes a judgement the model makes before it writes
code; the other ten are enumerations, consistency rules or authoring rules with
mechanical checks behind them, and they go to the checks. Seventeen of the forty run.md
placements stay in `run.md` (1,423 est tokens), twenty-two are redirected — eleven of
them into a new `verify.md` that takes the whole Inspect and Release phase out of the
design-time load — and one is dropped outright. Two structural moves make the topology
survive growth: `run.md` stops enumerating the direction record and `scripts/ledger.mjs
new <surface>` emits its headings instead, so the seven placements that all wanted to
add a field cost nothing and the eighth one next month also costs nothing; and
`verify.md` is declared in the manifest for the first time, under a new `inspect`
scenario, so the 3,131 est tokens of critique material accumulating in a file the budget
gate cannot see is capped at 1,600 and has to be triaged rather than dumped.
The ceiling itself is treated as a boundary, not a target: the 262 spare is reserve, and
a future taste addition must name what it displaces rather than spend it.

## Why not the other two postures

**Against cutting to 2,487.** The purist case is that 2,755 tied 2,078, so the extra 678
tokens bought nothing and are unearned. The reasoning is sound and the conclusion is
wrong, for one reason: **the blind test validated a text, not a byte count.** The 2,755
that tied was a specific set of sentences. Any composition change invalidates the
specific result and leaves only the coarse finding — a small dense creative surface beat
a large one. Given that, cutting below the tested point is not "returning to the proven
configuration"; it is moving to a different untested configuration, in the direction
where there is no data at all, while deleting the material the forensics identifies as
the reason we are better than frontend-design on the axes it lost. §7's claim test is on
that list: `no factual guard on invented claims` is a named frontend-design gap
(INSTRUCTION-BUDGET-VS-QUALITY.md:102). Trimming the claim enumeration to save 24 tokens
trades a measured advantage for an unmeasured one.

**Against spending to 3,100.** The same argument runs the other way and is why the
answer is 2,838 rather than 3,050. There is no evidence of headroom above 2,755. Every
token above it is an extrapolation, and 3,100 is a boundary the gate enforces, not a
budget the triage is entitled to fill. +82 is roughly 3%, which is inside the noise of a
bytes/4 estimator that is not a tokeniser.

**The tie-break that actually decided the contested calls** was neither elegance nor
asceticism. It was the second settled rule read strictly: *a rule that has a check does
not need to be resident.* Applied literally that rule disposes of ten of the nineteen
SKILL.md placements and 22 of the 40 run.md placements. Applied carelessly it also
disposes of §8's numbers, and that is where all three triages went wrong — see the next
paragraph.

**One correction all three inputs got wrong: the §8 numbers must stay resident.** Every
triage evacuated `4.5:1 / 3:1 / 44px / 24px / 16px / 320px` to `verify.md` or
`gate.mjs`, and every one of them named it as a top cost. The rule is *fetch at the step
that needs it*, and the step that needs a contrast ratio is the step that picks a
colour, not the step that measures one. Moving those numbers to the inspect phase is not
fetching at the step that needs them; it is deferring past it, and the remedy that comes
back is a repaint rather than a fix. What is genuinely a lookup is the *justification*
(`so mobile browsers do not zoom`, `minimum` six times over), and that is what got cut.
The six thresholds stay resident at 45 est tokens instead of 61.

## Final SKILL.md, section by section

| § | Section | Old | New | Δ | What changed |
| --- | --- | ---: | ---: | ---: | --- |
| — | frontmatter + manifest | 253 | 264 | **+11** | `inspect` scenario declared; `inspect: 4600` ceiling added |
| — | preamble | 84 | 81 | **−3** | corrected: the file has no sections 10 to 12, `run.md` does |
| 1 | Who you are on this job | 138 | 138 | 0 | untouched |
| 2 | Name the subject, then commit | 122 | 122 | 0 | untouched |
| 3 | Subject's world, come back with nouns | 216 | 216 | 0 | untouched |
| 4 | More than one direction, never your first | 255 | 255 | 0 | untouched |
| 5 | The looks that mean you stopped choosing | 228 | 253 | **+25** | `hero-as-thesis` as a fifth named default |
| 6 | Plan the design before writing code | 425 | 625 | **+200** | Structure step (+62); first-screen sentence (+34); motion, intent/result and swap falsifier on Signature (+94); accent finding relocated in from §8 (+37); build-from-plan tail out (−38) |
| 7 | The words are design material | 395 | 464 | **+69** | strip-to-text test (+49); proof permission (+25); em-dash justification tightened (−2) |
| 8 | The floor, which is not the design | 410 | 337 | **−73** | numbers compressed and the accent finding relocated to §6 (−51); motion sentence to §6 (−25); state roster out (−11); never-cut carve-outs in (+13) |
| 9 | How the run is operated | 145 + 86 | 86 | **−145** | §9 and §10 merged; routing table to `run.md` step 4; one judgement sentence kept |
| | **Total** | **2,756** | **2,838** | **+82** | |

Section totals are measured on the drafted candidate and are authoritative; the
component figures in the last column are the individual edits and carry rounding, so
they sum to within a few tokens of each section delta rather than exactly. Per-section
rounding also makes the column sum to 2,757 and 2,839 against whole-file measurements of
2,756 and 2,838. Ceiling 3,100.

**Arithmetic.** Current file 11,023 bytes → 11,351 bytes = **+328 bytes = +82 est
tokens**, 262 under the ceiling. The full cut and add decomposition is in *What was cut
from the current SKILL.md* below. Of the 1,482 est tokens of placements aimed at
SKILL.md, **351 admitted, 1,131 redirected**. The net is +82 rather than +351 because 269
est tokens came out of text that was already there — the budget was re-earned, not
extended.

The 262 is not spendable. It is the gap between a configuration close to one that has
been blind-tested and one that has not, and it is the only slack `ALWAYS` has.

## Every placement, and where it ended up

Fifty-nine placements were aimed at `SKILL.md` or `run.md`. The other 131 in
`PLACEMENT.json` keep their existing targets and are untouched by this triage.

**A correction to the brief's figures.** `PLACEMENT.json` has **40** placements aimed at
`run.md` totalling **4,992 est tokens**, not 26 totalling 2,357. The missing 14 are the
wave-3 `sitesmith-modes/*` items and they carry 2,635 est tokens — more than the figure
the triage was briefed against. They are included below.

### SKILL.md — 9 admitted

| Placement | Placed | Taken | Final home | Why it earns residence |
| --- | ---: | ---: | --- | --- |
| `frontend-design/deliberate-motion` | 6 | −29/+94† | §6 Signature | A relocation, not an addition. §8 opens `none of it is a look`, so a design decision was filed under compliance. C4 gives motion judgement to the model and reduced-motion to verification; §8 now keeps exactly the half C4 assigns it. |
| `frontend-design/hero-as-thesis` | 26 | 25 | §5, fifth bullet | Inherits §5's frame and brief-primacy override for no new scaffolding. §5 works by recognition — it is the mirror the model holds up before committing — and C1 forbids the ban that would replace it. No check can tell a true headline number from a decorative one. |
| `frontend-design/structure-as-information` | 55 | 62 | §6 Structure | Generative, not enumerative: `01/02/03` claims the content is ordered, and the answer differs for every page. That is the property the forensics says makes instruction diverge instead of converge. The gate catches one device; the rule governs dividers, tabs, eyebrows and step markers too. |
| `sitesmith-modes/no-motion-between-intent-and-result` | 40 | ~22 | §6 Signature | Rides on the motion sentence already being written. Constrains what gets *designed*: by the time a gate could see an animated form submit, the fix is a rebuild rather than an edit. |
| `sitesmith-modes/signature-swap-falsifier` | 83 | ~37 | §6 Signature | The third falsifier in the file, beside §4's argue-the-runner-up and §6's neighbouring-brief swap. Falsifiers are the one class where prose beats a check, because the answer is a judgement about the model's own output that no script can compute. |
| `sitesmith-modes/first-screen-from-strongest-material` | 154 | 34 | §6 Layout, outcome sentence only | The load-bearing join between §3 (come back with nouns) and §6 (plan the layout). Without it the noun list is gathered and then not spent. The six-row table of arrangements is redirected — see below. |
| `sitesmith-modes/delete-the-design-argument-test` | 91 | ~49 | §7 | Running it after the build only reports that the build was wrong. A model that knows its page will be stripped to text writes differently, and that anticipation is the mechanism. |
| `sitesmith-modes/proof-strength-ladder-with-nothing-as-a-rung` | 110 | ~25 | §7, bottom rung only | §7 already refuses unsourced proof; what it lacked was the *permission* to ship with no proof section at all. A refusal without a permission leaves a hole the model fills, and that hole is where invented testimonials come from. The four rungs above it go to `floor/buy.md`. |
| `ponytail/explicit-never-simplify-carveouts` | 30 | 13 | §8, existing paragraph rewritten | `anything the brief asked for by name` cannot be checked, because the gate cannot see the brief. It fires exactly when the model is under pressure and looking for something to drop. Rewriting the existing paragraph rather than adding one costs 13 instead of 30. |

† `deliberate-motion` removes 29 from §8 and its expanded form contributes to the +94 of
Signature additions; it is net-negative on its own and is counted inside the §6 and §8
deltas above.

### SKILL.md — 10 redirected

| Placement | Placed | New home | Why it is not resident |
| --- | ---: | --- | --- |
| `sitesmith-modes/six-states-enumerated` | 144 | `verify.md` (roster) + `scripts/gate.mjs` (assertions) | The clearest case in the set. §8 keeps `every interactive state exists and is reachable` as the obligation; the roster is what a renderer asserts. Naming six states the gate will enumerate for you is paying twice. |
| `sitesmith-modes/transitions-on-transform-and-opacity-only` | 30 | `scripts/gate.mjs` | A CSS property allowlist. Scan computed `transition-property`, refuse anything outside transform and opacity. No judgement to hold in mind. |
| `sitesmith-modes/content-variance-check` | 77 | `scripts/gate.mjs` | Repeated shapes, uniform lengths and matched syntax are measurable on built HTML, beside the lorem check §8 already implies. The `round numbers read as fake` line stays dropped, in the check's failure text too — it teaches more convincing fabrication. |
| `sitesmith-modes/icon-coherence` | 55 | `scripts/gate.mjs` | One family, one stroke width, no emoji as UI icons: three counts over the built markup. The model does not design differently for knowing it, it just gets it right or wrong. |
| `sitesmith-modes/one-intent-one-label` | 53 | `scripts/gate.mjs` | §7 already resident: `keeps the same word all the way through, so a button that says Publish produces a message that says Published`. The increment is a string diff across nav, button, heading and URL. |
| `sitesmith-modes/one-imagery-treatment-per-site` | 52 | `scripts/ledger.mjs` heading | A consistency rule whose entire enforcement is writing the treatment down once. The record is the enforcement, so the record is where it lives. |
| `sitesmith-modes/imagery-provenance-ladder` | 138 | `scripts/ledger.mjs` heading + `scripts/gate.mjs` | The ladder answers `what image goes here`. As a per-slot heading the model is forced through it at the step that needs it; the div-built fake product screenshot is a hard ban and therefore a check. `images are mandatory` and `no decorative SVG blobs` stay dropped — C6 makes appearance authored. |
| `sitesmith-modes/argument-shape-six-beats` | 109 | `scripts/ledger.mjs` heading | A six-beat page skeleton is the purest answer in the set, and templates converge — that is the `portfolioDiversity: fail` mechanism. As an `argument order` heading it fires at plan time on every surface including decide surfaces, which open no floor file. |
| `sitesmith-modes/phone-navigation-obligations` | 41 | `scripts/verify.mjs` | Reachable, closable, focus-trapped mobile nav is asserted at the 375px render that already exists. |
| `sitesmith-modes/counter-rows-inside-the-rule-table` | 188 | `tools/check-v3-docs.mjs` | Not instruction for the designing model at all — an authoring rule about how this package's own prose is written. 188 always-loaded tokens spent on documentation hygiene, on every design run, forever. A lint reads text more reliably than a model remembers to. |

### run.md — 17 kept in run.md

| Placement | Placed | Step | Note |
| --- | ---: | --- | --- |
| `ai-dev-tasks/clarifying-questions-before-spec` | 25 | 1 | merged into the question filter |
| `scroll-world/open-subject-question-not-fabricated-menu` | 125 | 1 | merged with the two below into ~110; a fabricated multiple-choice menu launders the model's own defaults into an apparent client choice |
| `before-implementing/unknown-knowns-prototypes` | 136 | 1 | merged; survives as the concrete instruction — two directions differing in structure rather than hue |
| `ui-ux-pro-max/zero-result-honesty` | 45 | 1 | an empty look-up moves to the assumption pile in those words |
| `sitesmith-modes/skill-applicability-self-gate-with-skip-list` | 192 | 1 | compressed to ~18: a negative band in the frontmatter would spend always-loaded budget on a case that almost never fires |
| `ai-website-cloner-template/scope-defaults-block` | 118 | 1 | one clause; the defaults themselves are prefilled by `ledger.mjs` |
| `impeccable/surface-brief-scoping` | 91 | 2 | one entry per surface, not per project |
| `scroll-world/capability-gate-before-commit` | 75 | 2 | confirm before code, not after; the font-weight assertion in `gate.mjs` is the backstop |
| `ai-dev-tasks/two-phase-approval-gate` | 75 | 2 | ~24 tokens for a real behaviour |
| `before-implementing/blindspot-pass` | 114 | 3 | compressed to ~30; the trigger is a platform with no adapter, so it cannot live in the adapter |
| `ui-ux-pro-max/stack-never-assume` | 85 | 3 | |
| `sitesmith-current/mode-based-routing-not-defaults` | 80 | 4 | absorbs SKILL.md §9's routing table and its no-match tail |
| `ponytail/seven-rung-simplicity-ladder` | 99 | 5 | compressed to ~40; C3's own test is already mechanical |
| `sitesmith-modes/native-first-justified-by-checkable-accessibility` | 184 | 5 | ~30 tokens; naming the enforcement in the sentence is what makes the short form work |
| `before-implementing/deviation-policy` | 143 | §11 | replaces the weaker single-branch sentence already there |
| `ai-website-cloner-template/spec-file-inline-only-contract` | 93 | §12 | merged with the row below into one ~55-token clause |
| `before-implementing/launch-packet-role-split` | 100 | §12 | merged; same failure mode stated from two directions |

### run.md — 22 redirected

| Placement | Placed | New home | Why |
| --- | ---: | --- | --- |
| `frontend-design/typography-as-personality` | 20 | `scripts/ledger.mjs` | field of the direction record |
| `sitesmith-current/evidence-before-direction` | 90 | `scripts/ledger.mjs` | `constraints in force` and `assets that exist` are fields; run.md's step order already enforces evidence-before-direction |
| `taste-skill/three-dial-system` | 76 | `scripts/ledger.mjs` | three fields; the never-as-numbers guard sits in the prompt text where the field is filled |
| `impeccable/mode-based-visitor-registers` | 55 | `scripts/ledger.mjs` | the record's first field, and `ledger.mjs new <surface>` takes it as its argument |
| `impeccable/model-specific-rendition-prior-correction` | 52 | `scripts/ledger.mjs` | C7 already adopts the v2.3 fingerprint ledger with its hard-coded known-bad recipe. Pointing it at the *record* catches the house-style words before any code — earlier than the prose could. Asking the model to grep its own prose from memory is strictly worse than the grep. |
| `sitesmith-current/two-gate-separation-technical-vs-visual` | 155 | `verify.md` | fires between render and verdict |
| `impeccable/dual-isolated-critique-subagents` | 111 | `verify.md` | inspect-phase, and C8's degradation branch is procedure for the moment of critique |
| `impeccable/bounded-finish-review-loop` | 108 | `verify.md` | a check describing its own rerun protocol |
| `agency-agents/orch-02-persona-walkthrough` | 120 | `verify.md` | nothing about it applies before there is a page |
| `ai-website-cloner-template/tool-agnostic-preflight-detection` | 115 | `verify.md` | merged with the row below; splitting a detection rule from the rule for what to do when detection fails is how degraded mode goes wrong |
| `sitesmith-modes/dependency-declared-optional-with-named-prose-fallback` | 253 | `verify.md` | merged with preflight detection |
| `sitesmith-modes/impeccable/adversarial-persona-walkthrough` | 215 | `verify.md` | accessibility persona stays dropped — already a mechanical check |
| `sitesmith-modes/impeccable/severity-tiebreak-question` | 132 | `verify.md` | findings do not exist until inspect |
| `sitesmith-modes/impeccable/score-inflation-calibration-anchor` | 177 | `verify.md` + `scripts/gate.mjs` | distribution anchor is prose at the scoring step; the ban on `consider` and `you might want to` is greppable |
| `sitesmith-modes/impeccable/issue-to-remedy-command-mapping` | 177 | `verify.md` | report-shaping, applies once findings exist |
| `sitesmith-modes/impeccable/findings-grounded-followup-questions` | 183 | `verify.md` | its whole point is that it applies after a build |
| `sitesmith-modes/orientation-and-text-scale-as-verification-axes` | 237 | `scripts/verify.mjs` | two render axes; always machinery |
| `sitesmith-modes/form-error-recovery-and-announcement-contract` | 183 | `floor/operate.md` (one line) + `scripts/verify.mjs` | prose and check, as the placement itself specifies |
| `sitesmith-modes/animation-interruptible-and-never-blocking` | 155 | `floor/operate.md` (one line) + `scripts/gate.mjs` | operating surfaces are where a blocking animation costs something; numeric motion values stay dropped as house style |
| `sitesmith-modes/modal-foreground-must-be-isolated` | 126 | `floor/operate.md` | phrased as separation, number deliberately unspecified, so not checkable by a number |
| `sitesmith-modes/applicability-scope-notice-on-rule-blocks` | 190 | `tools/check-v3-docs.mjs` | a format contract on the package, enforced at authoring time, zero run-time cost |
| `sitesmith-modes/model-facing-vs-machine-facing-declaration` | 231 | `tools/check-v3-docs.mjs` | same class; the ten-category taxonomy stays dropped |

### run.md — 1 dropped

| Placement | Placed | Reason |
| --- | ---: | --- |
| `before-implementing/map-vs-territory-framing` | 51 | Dropped, not redirected. `The brief is the map; the subject's real material and the platform's real limits are the territory` is what §2 and §3 already are, stated worse and later. §3 *is* the territory instruction. The charter reason is the measurement that set the ceiling: the file that lost spent its budget re-expressing mechanisms it already had. An opening flourish before `Read the brief` is 51 tokens of framing on a step whose framing is already the mechanism. If it turns out the framing does work the four-pile sort does not, this is the one call here that is a judgement about writing rather than placement, and it is the one I am least sure of. |

## What was cut from the current SKILL.md

| Cut | Bytes | Est | Where it went |
| --- | ---: | ---: | --- |
| §9 routing table, the three rows and the no-match tail | −419 | −105 | `run.md` step 4, which already read `Open the floor file section 9 selected`. Two files were each holding half a routing rule. The judgement sentence — route per surface, not per project — stays resident. |
| §10 body: the four-item table of contents for a file the model is told to read in the next breath | −252 | −63 | Deleted. §9 and §10 merge into one section, which also removes the §9/§10 seam and the `SKILL §10` / `run.md §10` numbering collision. |
| §8 numbers paragraph, compressed from 489 to 284 bytes: the guessing preamble, `so mobile browsers do not zoom`, `minimum` repeated six times, and the accent finding | −205 | −51 | The six thresholds **stay resident** in short form. The accent finding moves to §6 Colour, where a palette decision is actually made. `verify.md` gains the pointer to the rest of the floor. |
| §6 closing: `Then build from the plan exactly. Every colour and type decision in the code comes from it. Changing your mind mid build means changing the plan first.` | −153 | −38 | `run.md` step 5, which already opened `Build from the plan exactly`. Two thirds was a duplicate paying rent in the always-loaded file. |
| §8 motion sentence: `Motion is one deliberate moment or none, because scattered hover effects read as machine made, and ` | −99 | −25 | §6 Signature, expanded. §8 keeps `prefers-reduced-motion`, which is the half C4 assigns to verification. |
| §8 state roster: `, including loading, empty, error and disabled` | −46 | −11 | `verify.md` roster + `scripts/gate.mjs` assertions. The obligation stays; the enumeration goes. |
| Preamble: `Sections 9 to 12 are how the run is operated` and `and do not read it again mid-build`, replaced by an accurate pointer | −12 | −3 | Rewritten in place. There are no sections 10 to 12 in this file; they are in `run.md`. An inaccurate map of the file is worse than no map. |
| §7: `than this` in the em-dash rule | −10 | −2 | Deleted. Noted only because it is the rule's own sentence. |

**Arithmetic, measured on the drafted candidate.** Cuts total **−1,196 bytes**. Admitted
and replacement prose totals **+1,524 bytes** — the nine admits plus the §8 never-cut
paragraph rewritten in place (+53 bytes, which absorbs
`ponytail/explicit-never-simplify-carveouts` at 13 est tokens instead of 30) plus the
accent finding relocated into §6 Colour. 11,023 − 1,196 + 1,524 = **11,351 bytes = 2,838
est tokens**, confirmed by `tools/context-budget.mjs`. A word-level diff of the two files
reports 255 words removed and 301 added against 1,642 in common, so 87% of the file is
untouched — which is the intended shape of a triage that re-earns a budget rather than
rewriting a surface that tied.

**One cut deliberately not made.** `run.md`'s attribution block is compressed from 248 to
176 bytes but not moved to `THIRD-PARTY-NOTICES.md`. Apache-2.0 notice obligations
travel with the distribution, and a skill directory gets copied around on its own. 44
est tokens is not worth a licence question, and `LICENSE-AUDIT.md` is the standing
constraint on this repo. Separately: `SKILL.md` frontmatter declares `license: MIT` while
the package re-expresses Apache-2.0 material. That is out of this triage's scope and is
flagged, not fixed.

**One defect found while measuring.** `run.md:4` contained an em dash, in the package
whose §7 says `No em dashes. Ever. ... It applies to this file too.` The sentence is the
prose; there was no check; the violation shipped in the file that states the rule. It is
corrected in the candidate, and the em-dash grep in `scripts/gate.mjs` must cover the
package's own files, not only the build. This is the single best demonstration available
that prose is never the enforcement, and it argues for adding the check rather than
cutting the sentence.

## Final scenario budgets

Measured with `tools/context-budget.mjs` against the drafted candidates and stubs at the
caps below. The tool computes each scenario as `always + its own declared files`.

```
  ALWAYS          2838 tok  ceiling   3100  pass   (262 reserve)
  READ            4877 tok  ceiling   6000  pass  (1123 reserve)
  BUY             5827 tok  ceiling   6000  pass   (173 reserve)
  OPERATE         5827 tok  ceiling   6000  pass   (173 reserve)
  REDESIGN        6877 tok  ceiling   7000  pass   (123 reserve)
  INSPECT         4438 tok  ceiling   4600  pass   (162 reserve)
```

| File | Today | Placed | Cap set here | Status |
| --- | ---: | ---: | ---: | --- |
| `SKILL.md` | 2,756 | 4,238 | **2,838** | decided, drafted, measured |
| `run.md` | 941 | 5,933 | **1,423** | decided, drafted, measured |
| `verify.md` | — | 1,074 + 1,746 redirected from `run.md` + ~311 moved in | **1,600** | **must be triaged: ~1,531 over** |
| `floor/buy.md` | — | 1,731 + ~85 | **950** | **must be triaged: ~866 over** |
| `floor/operate.md` | — | 1,789 + ~120 | **950** | **must be triaged: ~959 over** |
| `redesign.md` | — | 1,747 | **1,050** | **must be triaged: ~697 over** |
| `stacks/*.md` | — | 616 | **620 each** | at cap as placed |

The manifest change that produces the `INSPECT` row is two lines in `SKILL.md`
frontmatter:

```yaml
  scenarios:
    ...
    inspect: [verify.md]        # new
  ceilings:
    ...
    inspect: 4600               # new
```

> **Measured versus reserved, stated plainly.** Only `ALWAYS` is a measurement of real
> content. `READ`, `BUY`, `OPERATE`, `REDESIGN` and `INSPECT` were computed against
> placeholder files stubbed to the caps in the table above, because `floor/buy.md`,
> `floor/operate.md`, `redesign.md`, `verify.md` and `stacks/static.md` are not written
> yet. They are the budget those files must be written to fit, not evidence that they do.
> `node tools/context-budget.mjs skills/sitesmith-v3` exits 1 today and lists each
> missing declared file. That refusal is the gate working: a scenario total computed over
> a manifest whose files are absent is exactly the decoration the tool exists to prevent.

**Reproducing these numbers.** Draft the two candidate files, stub the five downstream
files at the caps in the table above, and run
`node tools/context-budget.mjs <dir>`. Every figure in the block above came from that
run, not from arithmetic in this document.

**The `verify.md` declaration is the change that makes this honest.** `verify.md` is
named in `run.md` step 6 and carries 1,074 est tokens of placements today, and it is
declared in no scenario, so `context-budget.mjs` cannot see it. That is precisely the
defect the tool's own header says it exists to close: *a declared file that does not
exist is the failure mode that turns a budget gate into decoration*. An undeclared file
is the same defect with the manifest shrunk instead of the file. The tool's own
documented example declares `verify.md` in every scenario
(`tools/context-budget.mjs:15-17`), so the current omission is drift, not design.

Declaring it in every scenario is arithmetically impossible at any plausible sizes, and
would also be wrong: `verify.md` opens at step 6, after the last design decision, and the
ceiling exists because of a measurement about creative quality under instruction load at
design time. So it gets its own `inspect` scenario and its own ceiling. **The 4,600
figure is a discipline number with no measurement behind it and must not be cited as
one.** Its rationale is falsifiable and stated: `verify.md` stays smaller than the
creative surface, because a critique file larger than the design instruction is the
signal that the production layer has grown back into the run — which is what 6,546
always-loaded tokens were.

**The routine ceiling is policy, not measurement.** v2.3's routine load was 11,934 est
tokens (`BASELINE-CONTEXT-BUDGET.json`), and 6,000 is roughly half it, exactly as 3,100
is roughly half 6,546. Only `ALWAYS` has evidence behind it: 2,078 beat 6,546. The
pressure `ROUTINE` puts on the floor files below is a policy consequence, and if it
proves unmeetable it is the number to re-derive — never `ALWAYS`.

**Where the downstream cuts come from.** The floor files are where the check rule is most
under-used, far more than SKILL.md ever was. `floor/buy.md`'s 26 placements are
price-is-found-not-hunted, purchase-control-always-in-reach, total-commitment-legible,
nothing-moves-near-money, cart and result-set state coverage — page-composition
obligations that are DOM assertions on a built page. `verify.md`'s overflow is
concentrated in six overlapping impeccable critique mechanisms (severity ladder, score
calibration, issue-to-remedy, findings-grounded questions, adversarial personas, persona
walkthrough) totalling 1,004 est tokens that should merge into one critique protocol of
roughly 400.

## The topology, and why it survives next month

Every capped file has a named cap and a named overflow target, and there is exactly one
uncapped growth path.

| A new mechanism that… | Goes to | Cap | If the cap is full |
| --- | --- | ---: | --- |
| raises the standard the model holds itself to | `SKILL.md` | 2,838 | **it must name what it displaces.** The 262 reserve is not budget. |
| is procedure before or during the build | `run.md` | 1,423 | compress or push to a script |
| judges a finished artefact | `verify.md` | 1,600 | merge with an overlapping critique mechanism |
| is an obligation of one surface | `floor/*.md` | 950 | turn it into a check |
| is a fact about a stack | `stacks/*.md` | 620 | it belongs in the adapter's own docs |
| a regex or a DOM assertion can decide | `scripts/*.mjs` | **none** | — |
| is a rule about how this package is written | `tools/check-v3-docs.mjs` | **none** | — |

The last two rows are the answer. **Scripts and lints are never loaded into context, so
they are the only place growth is free.** Three of the five largest redirects in this
triage — `counter-rows` at 188, `model-facing-vs-machine-facing` at 231 and
`applicability-scope-notice` at 190 — are authoring rules that were about to buy
themselves permanent residence in the design surface. 609 est tokens, on every design
run, forever, spent on documentation hygiene.

The second survival property is the direction record. Seven placements all wanted to add
a field to the list `run.md` was enumerating in prose. `node scripts/ledger.mjs new
<surface>` emits the headings and a blank heading fails the ledger check, so the list
costs zero and the eighth field next month also costs zero — and the enforcement gets
stronger, because prose asks and the check refuses. `run.md` keeps a bare fallback list
of heading words (~85 est tokens) for hosts that cannot run node, which C8 requires: a
skill that only works where node runs is not portable, and portability was a stated goal.

## What this costs

**1. The scripts do not exist, and this plan is an IOU until they do.** `run.md`'s own
notice says `stack.mjs`, `gate.mjs` and `ledger.mjs` are not written. Twenty-two of the
thirty-two redirects land in `gate.mjs`, `ledger.mjs`, `verify.mjs` or `verify.md`, none
of which exist. Until they land, those mechanisms are not redirected — they are deleted,
and the deletion is invisible because the prose that would have carried them was never
written. **This is a hard shipping gate: the budget triage must not land before
`scripts/` and `verify.md` do.** If it must ship early, restore the state roster to §8
first (11 est tokens) and the `verify.md` pointer second, because those are the two cuts
whose replacement is furthest from existing.

**2. States get retrofitted instead of designed.** §8 still says every interactive state
must exist and is reachable, but no longer names loading, empty, error and disabled. This
is exactly what a model forgets at plan time and a gate catches at the end, when adding
an empty state means re-cutting a grid that assumed content. **First situation where it
hurts: the first `floor/operate.md` build — a dashboard or an admin console — where the
layout is decided around populated tables and the empty and error states arrive at step
6 under a cap of 2 edit attempts per defect.** A missing empty state discovered there is
plausibly written down as unresolved rather than fixed.

**3. Copy and structure discipline is thinner at the moment of writing.** The six-beat
argument shape and the imagery provenance ladder are now direction-record headings, and
one-intent-one-label is a gate check. A heading prompts a sentence; a resident standard
is held while thinking. Copy will be rewritten more often, and structural copy problems
will be found after the copy is written rather than prevented. The mitigation is that
both fire at plan time via the record rather than at inspect, which is the best available
compromise — but it is a compromise.

**4. The degraded path is weaker than the normal path, and I have made it weaker.** On a
host with no node and no browser, the state roster, icon coherence, content variance,
transform-only transitions and phone navigation are nowhere in context and the model has
nothing to do by hand. This is why the §8 numbers were kept resident and why the fallback
heading list was kept in `run.md`: those two decisions are the entire mitigation, and
they do not cover the floor roster. **First situation where it hurts: a plain chat
surface with no tooling, which C8 explicitly requires to work.**

**5. Four downstream files are over the caps this triage sets for them, and I made two of
them worse.** `floor/operate.md` gains ~120 est tokens from three wave-3 redirects and
`floor/buy.md` gains ~85 from the proof ladder, on top of files that were already 781 and
839 over. `verify.md` is ~1,531 over. `redesign.md` is ~697 over. None of that is fixed
here, and the scenario numbers above are conditional on those caps being met. If the
floor-file triage does not apply the same check rule, this triage will look like it
passed when the package does not.

**6. What I did not spend.** 262 est tokens of `ALWAYS` reserve, 1,123 in `READ`. Someone
triaging the same budget who spends the reserve lands eight or nine more mechanisms than
this. If the 135-to-134 result is read as headroom rather than as a tie, this version is
leaving capability on the table. It is read here as a tie, and 4,049 always-loaded tokens
is the shape of the thing that lost by 19 points.

## What would change the decision

1. **A blind re-test of the final 2,838-token text.** This is the only thing that
   converts the decision from reasoned to measured, and it is cheap — same brief, same
   model, our surface against `frontend-design`'s 55 lines, blind-scored, exactly as
   `CONFLICT-MATRIX.md:236-240` already specifies as the S10 smoke test. If it loses,
   §6 is where to cut first: it grew by 200 and is now the largest section in the file at
   625. If it wins by more than noise, the reading that 2,755 had no headroom is wrong
   and the reserve is spendable.
2. **The scripts not landing.** If `gate.mjs` and `ledger.mjs` are cut from the rebuild,
   this triage is void as written and must be redone with prose carrying what the checks
   were going to carry. That is a different file and a bigger one, and the honest version
   of it probably breaches `ALWAYS`.
3. **`verify.md` proving un-triageable below 1,600.** If the six impeccable critique
   mechanisms genuinely cannot merge, the `inspect` ceiling has to be re-derived with a
   stated rationale rather than quietly raised — or the critique material has to move
   into `scripts/critique-gate.mjs`, which already exists as a target in
   `PLACEMENT.json` at 215 est tokens.
4. **The floor files proving un-triageable below 950.** Then `ROUTINE` is the number to
   re-derive, because it is policy — a 2× tightening of v2.3's 11,934 — and not
   measurement. `ALWAYS` is not available for the same treatment, because 2,078 beating
   6,546 is the one thing here that was actually measured.
5. **Evidence that `run.md` competes with the creative surface.** The entire always/
   routine split rests on the claim that instruction read once at the start and put down
   does not degrade design the way resident instruction does. That claim is untested. If
   a test shows procedural tokens degrade creative output at the same rate, the split is
   invalid, `SKILL.md + run.md` must be triaged against a single combined ceiling near
   3,100, and roughly 1,200 est tokens have to come out of the two files together. That
   is the finding that would invalidate this triage most completely, and nothing in the
   repo currently tests for it.
