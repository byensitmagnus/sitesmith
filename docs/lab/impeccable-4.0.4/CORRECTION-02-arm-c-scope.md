# Correction 2: arm C ran in the wrong scope, and it was my instruction that did it

Found while the laboratory was running, before any judge returned a verdict. No result
existed when this was written.

## What happened

The arm C prompt told the agent to run:

```
node concept-seed.mjs --scope surface --mode <the right mode for this brief>
```

Three arm C agents independently flagged that as wrong in their own problem reports, and
followed the literal instruction while disclosing the mismatch rather than silently
substituting their own reading. They were right. I checked the source.

`reference/new-work.md` at pin `9a949fb` routes the two scopes to different situations:

**Line 34, heading: "Create a whole surface inside an established world"**

> Keep the visual system fixed. Derive five to seven materially different structures from
> the content, task, and user behavior, ordered by resonance. For a genuinely open whole
> page, screen, or flow, run: `concept-seed.mjs --scope surface --mode <mode>`

**Line 46, under creating or replacing a visual world**

> Run `concept-seed.mjs --scope direction --mode <mode>` and follow what it prints. This
> step has no substitute and no skip condition.

Every one of the 16 briefs is a brand-new fictional company with no existing design system
and no incumbent code. That is the second case, not the first. `--scope surface` keeps the
visual system fixed and rolls only the *structure*; `--scope direction` is what rolls the
world.

So arm C was run in the mode that assigns less: structure inside a system that, for these
briefs, does not exist.

## What it does to the round

**Arm C's artifacts are not a fair representation of Impeccable 4.0.4 on greenfield briefs.**
The agents report compensating, deriving seven grounded candidates each with a real palette
and composition, but the seed they were dealt came from the surface scope: a different scope
key, a different assignment text, and challengers dealt against a different question.
Compensation by the agent is not the same as running the procedure.

The promotion rule requires B to beat both A and C in aggregate. That condition cannot be
honestly evaluated against a handicapped C.

## What is being done about it

1. The current run finishes and is reported in full, including every C verdict. Nothing is
   discarded. The A versus B comparison is unaffected: both SiteSmith arms ran their own
   procedure correctly.
2. Every result involving arm C from this run is labelled **C-SURFACE-SCOPE** and may not be
   used to support any claim about beating full Impeccable 4.0.4.
3. Arm C is re-run with `--scope direction` and re-judged, as **C2**, against the same frozen
   briefs and the same promotion rule.
4. Both C runs are kept. The wrong one is evidence of the error, not something to delete.

## Why this is not moving the goalposts

No verdict existed when this was found. The defect is in my instrumentation, not in a
criterion, and the correction makes the competitor arm **stronger**, not weaker. The rule it
is measured against is unchanged and was committed before the laboratory opened.

## Second finding, recorded and not acted on

`concept-seed.mjs` crashes on process exit on this machine after its output has fully
flushed:

```
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 76
```

Node v24.15.0 on Windows 11. It fires after stdout is complete, so the roll itself is not
affected. Agents worked around it by reproducing the identical roll deterministically with
`--from <key>` and capturing stdout and stderr separately. That is the correct handling: the
output was verified complete rather than re-rolled until it looked clean.

This is a defect in a pinned third-party tool on this platform. It is recorded here and
nothing in this repository is changed because of it.

---

## Run stopped and voided, 2026-08-09

The three-arm run was stopped mid-judging and voided in full. Judges compared all three
directions inside one packet, so a handicapped C can move relative A/B preference: the
A-versus-B result from that run is not salvageable either, and no result was computed from it.

**Label: INVALID-C-SURFACE-SCOPE. Nothing deleted.**

Preserved at `scratchpad/lab/INVALID-C-SURFACE-SCOPE/`:

| what | count |
| --- | --- |
| judge verdicts, with brief and arm order reconstructed from each judge's own prompt | 24 |
| normalisation and scrub results | 85 |
| normalised packet files the judges actually read, with hashes | 48 |
| workflow journal and 400 agent transcripts, left in place | `wf_fa140a24-f59` |

The 24 verdicts carry a `wouldHaveWon` field, reconstructed for the record. It is not a result
and is excluded from every promotion statistic, permanently.

**The raw A and B artifacts are reused, not regenerated.** Their generation never touched the
C routing defect. All 48 direction files were re-hashed against `ARTEFACTS.json` before reuse:
48 of 48 match, none changed, none missing.

**C2** replaces arm C. The prompt now carries no scope at all: the agent reads new-work.md's
own routing, decides where a greenfield brief goes, and reports the scope it used. Handing it
the answer is what caused this defect, so it is not handed the answer again.

Judging restarts from zero and runs as four checkpointed batches of four briefs. Each judge
writes its own verdict file before finishing, so a session limit costs one batch rather than a
run. No interim tally is computed, logged or acted on between batches.

Blinding is now measured rather than assumed: the scrub names which procedure produced each
direction, scored against ground truth, and judging is refused outright if accuracy reaches
50 per cent against a chance rate of 33. That threshold was fixed before the run started.
