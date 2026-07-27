# Result — brief 01, company site

> Automatic measurements only. **This is the floor, not the verdict.** The seven rubric
> dimensions that decide whether a site is any good are graded blind and are not in this
> file yet.

Six runs, one model (`claude-opus-5`), one brief handed verbatim to both arms, skill at
commit `0670f97`. Measured independently afterwards — not by the agents that produced them.

## The numbers

| run | pages | verify | wide font | headers | footers | tokens | BRIEF | SYSTEM | contract |
| --- | ---: | --- | --- | ---: | ---: | ---: | --- | --- | --- |
| with-1 | 8 | pass | pass | 1 | 1 | 43 | yes | yes | pass |
| with-2 | 7 | pass | pass | 1 | 1 | 48 | yes | yes | pass |
| with-3 | 7 | pass | pass | 1 | 2 | 58 | yes | yes | pass |
| without-1 | 8 | pass | pass | 1 | 2 | 20 | no | no | — |
| without-2 | 7 | **7 fail** | pass | 1 | 2 | 17 | no | no | — |
| without-3 | 9 | pass | pass | 1 | 3 | 18 | no | no | — |

`verify` is every page at 375/768/1440, axe in both colour schemes, links, console, overflow.
`headers`/`footers` count distinct markup across the pages of that run, ignoring the
current-page marker; 1 is consistent. `tokens` is custom properties declared, and in all six
runs every token was present on every page.

## What the automatic half says

**Three findings, and one non-finding.**

**1. The control shipped seven pages with no `<html>` element.** `without-2` starts every page
at `<meta charset>`: no doctype, no root element. Browsers recover silently, so it renders
correctly and looks finished. Its agent reported checking 662 text elements for contrast in
both schemes and finding zero failures — which was true, and which is why it did not notice.
It checked the thing it thought to check.

That is the whole argument for a fixed verification pass rather than an agent's own idea of
what to verify, and it is worth more than the token counts below.

**2. Token vocabulary is about 2.7× larger with the skill**: 43, 48, 58 against 20, 17, 18.
Both arms share every token across every page, so this is not a consistency difference — it
is a difference in how much of the design was decided in one place rather than at the call
site. 17 tokens is a palette. 48 is a system.

**3. The two done-artifacts appear only with the skill**: 3 of 3 against 0 of 3. That is a
skill instruction being followed and is not independent evidence of anything, but it is the
precondition for the contract check, which 3 of 3 passed.

**4. Only the skill arm looked at its own work.** Screenshots written during the build:

| with-1 | with-2 | with-3 | without-1 | without-2 | without-3 |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 52 | 24 | 21 | 0 | 0 | 0 |

Ninety-seven against nought. The control agents all reported verifying their work and did so
by reading their own markup and reasoning about it; none of them rendered a page and looked
at it. This is the step the skill exists to force, and it is the mechanism behind finding 1:
you cannot reason your way to noticing a missing root element, and axe finds it in a second.

**The non-finding: headers.** Every run in both arms produced one header across all its
pages. The skill made no difference here, and an earlier version of the measurement said
otherwise only because it counted the current-page marker as drift. Footers differ slightly
(1,1,2 against 2,2,3) on numbers too small to lean on.

## What this does not say

- **Nothing about quality.** Every claim above is mechanical. A site can pass all of it and
  be worthless, which is why `rubric.md` exists and why it is graded blind.
- **Nothing with a confidence interval.** Three runs per arm shows whether a difference
  survives variance. It is not a sample.
- **Nothing about a control that was actually isolated.** Both arms ran inside this
  repository; the control was instructed not to read `skills/`, not prevented. The strong
  control performance suggests the instruction held, but it is an instruction.

## Three bugs in the measurement, found before the numbers were believed

The first run of this measurement reported all 48 pages of all six runs as failing, which is
not a result, it is a broken instrument. Fixing it took three:

1. `verify.mjs` resolves playwright from the working directory, and it lives in
   `benchmarks/node_modules`. Run from the repository root it exited 2 — could not run — on
   every page, and the harness counted exit 2 the same as exit 1. Exit codes now mean what
   they say, and a 2 aborts the measurement rather than being recorded as a failing page.
2. The cross-page pass read only HTML, so every run appeared to declare zero tokens. These
   sites put their tokens in a linked stylesheet, as sites do.
3. The header comparison counted the current-page marker as drift, so a correctly built
   multi-page site scored worst. It now strips `aria-current` and active-state classes before
   comparing.

Recorded here because the same discipline applies to the numbers above: an instrument that
has never been wrong has never been checked.

## Reproduce

```bash
node tools/bench-measure-all.mjs 01-company
```

Raw per-run output: `measurements-01-company.json`. Every run, including the failing one, is
in `runs/`.
