# Pilot 01: one brief, three arms, one blind judge

Frozen. Nothing in here is regenerated, and the directions are not rerun for any reason.

```
brief:      halgarth-rotor-balancing, surface buy
arms:       A current SiteSmith · B SiteSmith with assign.mjs · C pinned Impeccable 4.0.4
result:     A > C > B, CLOSE, MEDIUM confidence
calls:      4, three generations and one judge
```

Read `RESULT.md` first. It carries the verdict, the decode and five named methodology
concerns. `VALIDATION.md` carries how the blinding was built and measured.

## What is here

| | |
| --- | --- |
| `brief/` | the sealed brief the three arms were given, with its hash |
| `A/ B/ C/` | each arm's raw direction and working notes, exactly as written |
| `C/SEED.txt` | the Impeccable roll, captured once, `--scope direction`, not degraded |
| `canonical/` | the three directions after canonical normalisation, which is what the judge read |
| `packet/` | the **superseded** first normalisation attempt, kept so the repair reads as a diff |
| `judge/` | the packet as the judge saw it, numbered, and the raw verdict |
| `*.mjs` | the instrument: canonical normaliser, leakage check, fidelity check, freeze |
| `*.json` | hashes, preconditions, the sealed mapping, the decode |

## The instrument

`canonical.mjs` parses each direction into blocks and re-emits every block in one form, so a
table row becomes labelled statements and a bullet becomes a sentence. It exists because the
first attempt scrubbed vocabulary with regular expressions and left the structure: one arm
carried eleven table rows and the other two carried none, which sorts them without reading a
word.

`leakage.mjs` measures eighteen axes and separates a **tell**, a property of the procedure,
from a **difference**, a property of what an arm decided. `fidelity.mjs` pulls every concrete
token out before and after and compares the sets; it caught two real defects in the normaliser,
a corrupted colour value and a design fact that left with a scrubbed paragraph.

## What may not be concluded from this directory

One brief, one judge, CLOSE, MEDIUM. It does not show that SiteSmith beats Impeccable 4.0.4,
that `assign.mjs` is harmful, or that any arm is generally better. `assign.mjs` is parked on
this evidence, not deleted and not changed.
