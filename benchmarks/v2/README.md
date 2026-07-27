# v2 benchmark — does the skill change what an agent produces?

> Original work, MIT.

The v1 benchmarks measured nine pages a person wrote while consulting the skill. That
answers "can these pages pass a checker", which is not the question anyone has. The question
is whether an agent handed a brief produces a better website with the skill than without it,
and reliably enough that the difference is not luck.

**Nothing in this directory is evidence until the runs exist.** The harness is here; the
result is not claimed.

## Method

Three briefs, six runs each way, one model.

| | |
| --- | --- |
| Briefs | `briefs/01-company.md` (multi-page company site), `briefs/02-shop.md` (e-commerce), `briefs/03-console.md` (product UI) |
| Treatment | three runs **with** the skill loaded |
| Control | three runs **without** it, same model, same settings, same brief text |
| Recorded | the full prompt, model and version, settings, and the skill commit |
| Output | every file the agent wrote, screenshots at three widths, and the measurement report |
| Grading | blind, by rubric, treatment and control shuffled and unlabelled |

Three runs per arm is the minimum that shows variance. One run of each proves nothing about
a stochastic system, and the failure mode of a single flattering run is exactly what this
benchmark exists to rule out.

## Directory layout

```
benchmarks/v2/
  briefs/            the three briefs, verbatim, as handed to the agent
  rubric.md          the grading rubric and the blind procedure
  runs/
    <brief>-<arm>-<n>/
      manifest.json  model, version, settings, skill commit, timestamps
      prompt.txt     exactly what the agent was given
      site/          every file it wrote
      shots/         375, 768, 1440 per page
      report.json    measurements
      grade.json     written after grading, never before
```

A run is complete only with all six. A run missing `manifest.json` is not a data point,
because it cannot be repeated.

## What is measured

Automatic, per page — the v1 floor, kept:

- HTTP status, console errors, failed requests, dead links
- axe in both colour schemes
- horizontal overflow at 375, 768, 1440, and again under a wider font
- values used that the project's own contract never declared

Automatic, per site — new, because a site is not its pages:

- **Cross-page consistency.** Is the header markup identical across pages? The footer? Do
  all pages draw from one token set, or did page three invent a second?
- **Component reuse.** How many components are defined once and referenced, versus
  re-solved per page.
- **Artifact presence.** Does `BRIEF.md` exist, and `DESIGN-SYSTEM.md`, and do they describe
  what was actually built?

By reading, blind, on the rubric — because no script has an opinion about these:

- Brand fit, visual quality, content quality, asset handling, state coverage, completion.

The automatic columns are a floor. A site can pass every one of them and be worthless, which
is the entire reason the rubric exists.

## Running it

```bash
node tools/bench.mjs init  <brief> <arm> <n>     # scaffold a run, write the manifest
node tools/bench.mjs measure <run-dir>            # verify + contract + cross-page
node tools/bench.mjs grade  <brief>               # shuffle, strip labels, open for grading
```

`init` refuses to scaffold without a clean git tree, because a run whose skill commit is
"main, roughly" is not reproducible.

## Honesty conditions

Three, and the benchmark is void if any is broken.

1. **The control gets the same brief.** Same words, same length, same attachments. A control
   handed a thinner prompt is a straw man, and the v1 control — hand-written to be bad — was
   one.
2. **The grader does not know which arm they are reading.** `grade` strips the labels and
   shuffles. If the same person built the skill and grades the output, say so in the result;
   it does not invalidate the automatic columns and it does qualify the rubric ones.
3. **Every run is published, including the bad ones.** Six runs where two were discarded is
   a four-run benchmark with a selection story.
