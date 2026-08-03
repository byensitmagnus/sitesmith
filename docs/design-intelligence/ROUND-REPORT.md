---
title: "Design Intelligence Deepening Round: what was taken, what was rejected, and what it cost"
status: current
branch: feat/design-contract-v1
ai_generated: "(C)"
---

# Design Intelligence Deepening Round

The aim was not to know more things. It was to turn the right knowledge into a
project-specific direction and then prove the direction was actually implemented.

This is what happened, including the parts that went the other way.

## The one-sentence result

SiteSmith now writes a machine-readable design contract after the direction is chosen and
before implementation begins, checks every colour pair against its own contrast floor before
a line of code exists, and compares the built page back against the contract in a browser.
Three pilots on three surfaces produced three contracts that share no palette strategy, no
ground, no action colour, no typeface, no signature and no density, and all three pass their
own gates.

## What was compared, and what had moved

| upstream | pinned | current head | changed | what was reopened |
|---|---|---|---|---|
| Anthropic `frontend-design` | `b29e7cf6` | `b29e7cf6` | no | nothing. The instruction was to reopen only if it had changed. |
| `pbakaus/impeccable` | `6b342244` | `69b63d36` | 68 commits, 260 files | three mechanisms. The 260 figure is one change replicated across fifteen provider directories. |
| `nextlevelbuilder/ui-ux-pro-max-skill` | `4857a2c5` | `4d140cf8` | 4 commits, 51 files | one mechanism. The rest is a Next.js gallery, which is a website about the skill. |

The full nineteen-dimension matrix is in
[`MECHANISM-GAP-MATRIX.json`](MECHANISM-GAP-MATRIX.json). It was written against
`docs/rebuild/SOURCE-REGISTRY.json`, `MECHANISM-LEDGER.json` and `PLACEMENT.json` rather than
by repeating the source research those files already carry.

## Imported, adapted, lab-only, rejected

The round asked for these four to be told apart precisely. They are.

### Adapted, and shipping

| mechanism | from | what was taken | what was left |
|---|---|---|---|
| Semantic colour roles | ui-ux-pro-max (MIT) | the role vocabulary and the idea of foreground/background pairing, as **structure** | the category-to-palette lookup that fills them. Every value comes from the subject's materials. |
| A two-layer design document | impeccable (Apache-2.0) | machine-readable data plus prose, with a coverage report | the section list, and the rule that it is written after the build. The contract exists **before** implementation, which is the whole point of comparing a build to it. |
| Cheap staleness as a proxy | impeccable (Apache-2.0) | count commits touching visual source since the record was written, report it as a proxy, never rewrite the user's document | everything else in that file: git-walking workspaces, hook manifests, ignore-list validation |
| Colour in more than one notation | impeccable (Apache-2.0) | the idea that a record carries the authored value **and** its rendered form | the parser itself |

### Written here, because no upstream had it

Typography delivery and stress, layout transformation per width, focus order as a checkable
list, the squint test as an ink-density measurement, state coverage with what carries a state
besides colour, and the translucent-backdrop rule. None of the three upstreams carries any of
these; the gap matrix records that as SiteSmith's own gap rather than as an import.

### Lab only, not promoted

Impeccable's external concept assignment, where a hash forces one of the model's own
candidate directions. It is recorded in the gap matrix as `test-in-lab` with the reason:
SiteSmith already lost 40 to 59 to a generator once, and it does not come back without new
blind evidence. **No lab run was performed in this round**, so it is neither promoted nor
refuted. That is stated rather than quietly dropped.

### Rejected, with the reason

| mechanism | why |
|---|---|
| ui-ux-pro-max's design-system generator | It matches a product category and reads a palette off a table. That gives every glazier the same page, which is the failure the whole product answers. |
| ui-ux-pro-max's domain auto-detect | The input side of the same table. |
| ui-ux-pro-max's design dials | A dial that biases a lookup is only as good as the lookup, and the lookup is rejected. |
| ui-ux-pro-max font pairings as defaults | A trade answer produces a trade look. They may appear as candidates carrying a genericness risk, never as an answer. |
| impeccable's hooks | A second way for the product to act, in a second place, per provider. That is an orchestration surface and this round was explicitly not building one. |
| impeccable's live browser editor | Already declined in the README and still declined. |

## Design Contract v1

`skills/sitesmith-v3/contract/schema.json`, validated by
`skills/sitesmith-v3/scripts/contract.mjs`, written to `.sitesmith/contract.json` and
`.sitesmith/CONTRACT.md`.

```bash
node <skill>/scripts/contract.mjs new <surface>
node <skill>/scripts/contract.mjs check --write
node <skill>/scripts/contract.mjs compare --url <url> --write
```

**It is not the direction record.** The record explains a decision and is prose, and prose is
right for a decision. Nothing in it can be compared against a build: a record can say *warm
ground, one cold accent* while the page ships its body text at 3.9:1, and the record and the
gate are both content. The contract is the same decision as values.

**What it carries.** Colour strategy and why; source colours with the material each was taken
from; primitives with their rendered fallback; the role vocabulary; pairs with a state and a
floor, measured; what changes in each state and what carries it besides colour; light and dark
answered from the use scene; data-visualisation requirements; genericness risk; and departures
from the record. Typography carries family, source, licence, weights, axes, fallback stack,
metric compatibility, language coverage, loading strategy, scale, line height and prose
measure, plus stress cases written before they are run and then run:
`contract.mjs stress --url <url> --write` answers the three a browser can decide, and every
other case keeps the words **not run**. Layout carries the reading path,
leading and supporting elements, grouping, density, rhythm, topology, the first viewport
object, the signature, what the layout **becomes** at 375, 768 and 1440, container behaviour,
focus order and the squint test.

**It is provider-neutral and it travels.** `tools/test-pipeline-drift.mjs` unpacks a real
install for all four providers and asserts `scripts/contract.mjs`, `scripts/colour.mjs`,
`contract/schema.json` and `contract.md` are in every pack, and the ZIP check does the same.

**It is not a hard gate.** `gate.mjs` is unchanged and gained no refusal class.
`contract.mjs check` refuses on its own command with exit 3. `docs/GATE-POLICY.md` asks for a
user-affecting defect, two independent reproductions and a low-false-positive measurement
before anything becomes a hard gate, and the contract has three pilots and one round behind it.

## What the contract caught before a line of code existed

This is the part that justifies writing it before implementation rather than after.

| pilot | what the contract refused | what happened |
|---|---|---|
| lock console | the record's rust `#b4462a` measured 2.91 against the chamber concrete, below the 4.5 floor for the error text it carries | wet rust under a lamp is lighter than dry rust, so the material was looked at again: `#dd7050`, 4.93 |
| lock console | a focus ring pair that named the wrong background | the ring sits at 3px offset, so it is painted on the panel behind the button and not on the button. The contract was wrong about the page, and `compare` said so. |
| seed bank | the unbleached paper ground sat five units from a cream in the anti-tell palette | the brief names the grey dune as one of its two landscape types. The material changed; the check was not waived. |
| seed bank | the disabled field's sentence measured 3.1 against a 4.5 floor | WCAG exempts a disabled control and does not exempt the sentence telling a reader what would make it usable. That is a message, and it is now full ink. |

Every one of those is a defect that would otherwise have been found by a person looking at a
finished page, or not found at all.

## The three pilots

| | 01 glazier, buy | 02 lock keeper, operate | 03 seed bank, read |
|---|---|---|---|
| palette strategy | committed | drenched | restrained |
| ground | `#dbe3dd` float glass | `#0f1a1f` canal water at night | `#dfe3d6` grey dune |
| action | `#16584a` glass seen edge on | `#c9a227` brass on the motor housing | `#4a5535` marram in August |
| type | Bahnschrift + Sitka Text | Cascadia Mono + Segoe UI Variable Text | Palatino Linotype + Corbel |
| signature | a measured drawing of the bench | a time ribbon with a hole in it | one morning as a timeline |
| density | measured | packed | sparse |
| scheme | light | dark, from the use scene | light |
| gate | one refusal, `look/no-photograph`, claimed | clean | clean, one waiver claimed |

`tools/test-portfolio-contracts.mjs` fails if any two ever converge on any of those, and it
runs in CI. Round 8 of the cold builds failed on exactly this while passing every individual
check, which is why the check exists rather than the intention.

**The differences come from the briefs.** The lock console is dark because one keeper walks
out into the rain with a torch every hour and a bright screen costs them their night vision.
The seed bank is sparse because a page asking a stranger for access to their land has to leave
room to say no. The glazier is committed because the ground is the material every order is
made of. All three briefs are committed next to their contracts so a reader can check that
claim rather than take it.

## Eleven product defects, found by using the product

Numbers 1 to 10 are in [`evidence/pilot/README.md`](../../evidence/pilot/README.md). This
round added these:

7. **The dark-scheme check assumed light was the base.** It looked for the word *dark* in a
   pair, which is right when a light page adds a dark scheme and wrong when the page **is**
   dark. The lock console has no light scheme, every pair in it is a dark pair, and not one
   of them says so. Named pairs are now required only when both schemes are claimed, and one
   scheme owes its reason from the use scene.
8. **`look.md` documented a five-column asset manifest and `gate.mjs` reads six**, and no file
   in the package mentioned `data-asset`, which the gate also requires. A build that followed
   `look.md` exactly could not pass the gate. Same class as pilot defect 8: two files in one
   package disagreeing about their own file format.
9. **`contract.mjs` could not find playwright from an installed package.** A bare import
   resolves from the skill's path and not from the project, so `compare` withheld a verdict it
   could have earned.
10. **And it destructured `chromium` from a CommonJS module**, which exports under `default`,
    so it read `.launch` of undefined.
11. **`display: grid` beats the browser's own `[hidden]`.** The seed bank's form stayed
    visible next to its own success state. No mechanical check would have caught it: the
    journey did, because a journey asserts what a visitor sees after acting.

## The rule registry

`product/rules.json`, generated by `tools/build-rule-registry.mjs` from the strings
`gate.mjs` actually passes to `refuse()`. The judgement lives in `product/rule-notes.json`,
hand-written, and the generator refuses to build a registry for a class that has no note.

- 59 rules, 17 categories.
- 16 have a measured false-positive risk, because a pilot exercised them.
- 43 are `unassessed`, which is a statement about the evidence and not about the rule.
- 2 are `high`: `honesty/narrated-absence` matched a construction rather than a meaning, and
  `palette/premium-consumer-default` has no notion of what a colour is used for and fired on
  two of three pilots. Both pages improved by obeying them, and both rules were right for the
  wrong reason.

**No rule's semantics changed.** The registry describes what already runs.

## Knowledge Index

12 new posts, 141 total, 30/30 checks. Only what Design Contract v1 asks builders and the
index could not answer: semantic colour systems, dark and light from the use scene, pairs
rather than colours, typography delivery and fallbacks, language coverage, responsive
transformation, form states, navigation, data visualisation, icon systems, motion systems, and
a reading's age. Every post carries provenance, confidence, genericness risk, worksWhen,
avoidWhen, failure modes, mobile rules and accessibility rules. The hard rule is unchanged:
retrieval never returns a finished look.

One post exists because a pilot needed it and the index could not help:
`ops-a-number-owes-its-age`.

## Context budget

| scenario | before | after | ceiling |
|---|---|---|---|
| ALWAYS | 3130 | 3142 | 3160 |
| BUY | 8342 | 8355 | 8600 |
| OPERATE | 8262 | 8275 | 8600 |
| EXPERIENCE | 8791 | 8804 | 8820 |
| CONTRACT | n/a | 4948 | 5200 |

The contract is its own scenario rather than an addition to the build scenarios, because it is
read at its own step and put down again. Two ceilings were raised by 20 tokens between them,
and the cost is the two manifest lines that declare the new scenario. `look.md` gained the
corrected manifest columns and the `data-asset` rule and was tightened elsewhere to pay for it,
so every build scenario is within a few tokens of where it started.

## Tests and CI

New: `skills/sitesmith-v3/scripts/test-contract.mjs` (10 colour checks, 16 validator fixtures),
`tools/test-portfolio-contracts.mjs`, `tools/build-rule-registry.mjs --check`.
Extended: `tools/test-pipeline-drift.mjs` and `tools/test-commands-exit.mjs`.

CI now runs eleven jobs: the five from the alpha release plus the contract fixtures, the
registry check, two pilot jobs on a matrix, and the portfolio check.

## Known limits

- **The lab experiment was not run.** External concept assignment is recorded as
  `test-in-lab` and nothing was measured. It is not promoted.
- **`palette/premium-consumer-default` and `honesty/narrated-absence` are high-risk and
  unchanged.** Both distorted a pilot before improving it. The round's own rules forbid
  changing an existing gate's semantics without evidence, and two pilots is the beginning of
  that evidence rather than the end.
- **43 of 59 rules have never fired in this repository.** They are enforced and unmeasured.
- **Three pilots is three.** They were built by one agent reading the skill, not by three cold
  agents with empty context windows. The cold loop is the harder test and this was not it.
- **Five of the eight stress cases per pilot are still `not run`.** A browser can decide a
  long heading, 200 per cent zoom and a blocked face; it cannot decide whether a face carries
  the Danish alphabet, or what an empty console looks like at the start of a shift. Those are
  written down with what is expected and no result, which is the honest value.
- **The squint test is an ink-density proxy on painted boxes**, not a rendering. It is
  reported and never gated, and a page can be right and fail it.
- **`verify.mjs` measures prose measure on the element that carries the text**, which is the
  wrong box for a grid row. It cost the lock console one documented false positive, and the
  layout that satisfies both it and the gate was found by measuring two alternatives that
  each failed a different check.
