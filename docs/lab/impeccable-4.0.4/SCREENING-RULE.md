# Screening round, and why the full round is not simply shrunk

Fixed 2026-08-09, before any C2 direction existed and before any valid judge ran.

## The problem with just running fewer

The frozen promotion rule asks for a brief-majority win on at least 10 of 16 briefs. Running
6 briefs instead and reading "4 of 6" as the same evidence would be a quieter version of moving
the goalposts: a 4-2 result on six briefs is one brief away from a coin toss, and a rule written
for sixteen does not transfer to six by scaling the fraction.

So the round is split instead of shrunk.

## Two stages

**Stage 1, screening. 6 briefs, 3 judges, 18 judgements.** Cheap enough to be worth spending
before anything is known. It can credibly kill the hypothesis and it deliberately cannot
confirm it.

**Stage 2, confirmatory. The full 16 briefs under the unchanged frozen promotion rule.** Runs
only if stage 1 clears the gate below.

The asymmetry is the point. A small sample is good evidence that something is *not* clearly
better and poor evidence that it is. Stage 1 is allowed to conclude REJECT. It is not allowed
to conclude PROMOTE.

## The gate, fixed before any judge

Stage 1 counts brief-majority wins across its 6 briefs, exactly as the full rule defines them:
a brief goes to whichever arm takes at least two of its three judges' first preferences.

| stage 1 outcome | what happens |
| --- | --- |
| B wins 3 or more of 6 | stage 2 runs: the full 16 briefs, full frozen rule |
| B wins 2 of 6 | INCONCLUSIVE. One mechanism changes, and stage 1 is rerun on the other briefs |
| B wins 0 or 1 of 6 | REJECT. `assign.mjs` does not proceed. Explain from the evidence, change one mechanism, test again |

If A wins stage 1 outright, that is a result: the experiment is deleted and the simpler system
stays. If C2 wins stage 1 outright, that is also a result and it is the one worth knowing early.

## No double counting

Stage 1's 18 judgements are recorded and reported in full. **They do not count toward stage 2's
statistics.** Stage 2 judges all 16 briefs fresh, including the 6 from stage 1, with new judges.
Reusing stage 1's verdicts inside stage 2 would let a lucky screening result carry into the
confirmatory number it was supposed to gate.

## The six briefs, and how they were picked

Picked mechanically before any C2 direction existed: alphabetically first within each surface,
weighted to the two surfaces that have the most briefs, so no judgement of mine entered the
selection.

| brief | surface |
| --- | --- |
| bredo-rebslageri | buy |
| damgaard-estrik | buy |
| bracken-hill-marks-bench | experience |
| halloran-machine-spares | operate |
| kilnbrook-floor-maltings | operate |
| bjerrea-vandlobslaug | read |

All four surfaces are present. The systematic-surface-loss condition in the frozen rule cannot
be evaluated on one brief per surface and is therefore **not** evaluated at stage 1; it belongs
to stage 2 and is not silently dropped.

## Cost

| | agents |
| --- | --- |
| voided three-arm run | 128 |
| full C2 run as designed | 96 |
| this screening round | 36 |

A and B directions already exist for all 16 briefs and are reused at both stages, verified by
hash. Only C2 is generated new, and at stage 1 only for these six.
