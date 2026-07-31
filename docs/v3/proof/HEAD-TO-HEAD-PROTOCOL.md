---
title: Locked head-to-head direction comparison protocol
status: binding-next-phase
ai_generated: "(C)"
---

# Head-to-head protocol (obligatory next phase)

**Purpose:** Prove or disprove whether SiteSmith Direction Engine produces better
design directions than the four locked upstreams. This is the primary quality
gate — not internal fixtures, unit tests, or documentation volume.

**Current product status remains:**

```text
PROOF FAILED — DIRECTION QUALITY
```

until this comparison is executed and judged.

Head-to-head must **not** start until the PR #2 corrective pass (`8aee864` or
later on `codex/v3-direction-engine-proof`) has been reviewed. Comparing
upstreams to a pre-correction thin slice wastes credits and biases the result.

## Order of work

```text
fix the thin slice (corrective pass)
→ review the fixes
→ lock all five systems
→ run fair blind head-to-head
→ build only if SiteSmith matches or wins
```

## Before head-to-head may be approved

1. **One canonical commit per upstream**, identical in:

   - capability manifest (`docs/v2/CAPABILITY-MANIFEST.json` competitors)
   - v3 ledger (`docs/v3/UPSTREAM-CAPABILITY-LEDGER.json` / `CANONICAL-UPSTREAM-PINS.json`)
   - runtime provenance
   - proof-plan / this protocol
   - PR description

   Canonical pins (v3 ledger, post-corrective pass):

   | System | Commit |
   | --- | --- |
   | taste-skill | `e988add20dab0fa97d7a76781c48961c8184288e` |
   | ui-ux-pro-max | `4857a2c5ef989794751a0f66b8545a4a49566286` |
   | frontend-design | `b29e7cf65e5cb78a5ac33d582270551bc74a14eb` |
   | impeccable | `6b342244e915d64b0d6e84d5eec448fd196ce6bb` |

2. **SiteSmith must not receive advantages:**

   - more context
   - better assets
   - longer runtime
   - more iterations
   - access to upstream results

3. **All systems receive the same:**

   - brief
   - evidence pack
   - brand materials
   - assets
   - constraints
   - model class
   - token budget
   - time budget

4. Each system runs in a **fresh, isolated** context.

5. No candidate may know:

   - other candidates
   - other systems’ outputs
   - the evaluator rubric
   - its position in the comparison

## Protocol

### Briefs (minimum three)

```text
1. Sensory e-commerce
2. Characterful marketing / portfolio
3. Functional product UI
```

Use the existing synthetic packs under `docs/v3/proof/briefs/` (or
hash-locked successors with the same jobs). Do not cherry-pick after scores
are known.

### Arms (five per brief)

```text
A. taste-skill
B. ui-ux-pro-max
C. frontend-design
D. impeccable
E. SiteSmith Direction Engine
```

### Direction packet (comparable fields)

Each system produces a comparable direction packet with at least:

```text
design thesis
subject grounding
composition
hierarchy
typography
colour/material model
imagery/asset strategy
interaction concept
signature element
primary risk
implementation guidance
```

If an upstream normally produces code or comps, it may use its **normal
workflow**. SiteSmith must not win by forcing upstreams into an artificially
reduced format.

### Blind evaluation

Randomise all outputs and strip:

```text
system name
repo
commit
file names
capability IDs
generator IDs
provenance
known phrasing that reveals the system
```

Use **at least two independent evaluator contexts**.

Score each candidate on:

```text
brief fit
subject specificity
originality
composition
hierarchy
typography
materiality
asset strategy
interaction
signature
anti-cliché
implementability
```

Evaluators also answer:

```text
Which candidate would you actually choose to build the project?
Which candidate feels most generic?
Which candidate is best grounded in the subject?
Which candidate has the strongest overall creative direction?
```

### Result reporting

Report:

```text
score per criterion
overall score
win / loss / tie per brief
evaluator agreement
critical qualitative comments
```

### Advancement rules

SiteSmith may proceed to three full v2.3 builds **only if** it:

```text
matches or beats the best upstream on at least 2 of 3 briefs
```

and has no serious regression in:

```text
brief fit
subject grounding
implementability
```

Outcome labels:

| Result | Status |
| --- | --- |
| Clear loss | `PROOF FAILED — UPSTREAM SUPERSET` |
| Mixed / evaluator disagreement | `PROOF FAILED — DIRECTION QUALITY` |
| Match or win on ≥2/3 briefs | `DIRECTION COMPARISON PASSED — BUILD PROOF REQUIRED` |

`DIRECTION COMPARISON PASSED` is **not** `PROOF PASSED`.

Full proof-pass still requires three real builds through v2.3, fidelity gates,
and portfolio diversity. Showcase remains **0/8** until then.

## Forbidden

The comparison must not:

- use only SiteSmith-generated fixtures as the quality bar
- score world-ID differences as quality
- award points for documentation volume
- award points for capability count
- let SiteSmith evaluate itself
- change upstream prompts after results are seen
- select only briefs where SiteSmith does well
- declare victory from mechanical tests alone

Internal tests prove the system works **mechanically**. The external
comparison is the **primary quality gate**.
