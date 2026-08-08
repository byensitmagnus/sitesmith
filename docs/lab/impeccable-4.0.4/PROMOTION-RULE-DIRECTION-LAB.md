# Promotion rule, frozen before the first judge saw anything

Sealed 2026-08-08, before any direction artifact existed and before any judge was spawned.
Committed ahead of the run so the git timestamp is the proof of order.

## The three arms

| arm | what it is |
| --- | --- |
| A | SiteSmith at pin `15a7aa6`, current direction formation: subject, nouns, at least three theses, autopilot description, argued runner-up, two swaps. The model chooses. |
| B | Identical to A, plus `assign.mjs`: 5 to 7 candidates, per-candidate viability written before the key is drawn, a hash assigns one viable non-autopilot candidate. |
| C | Impeccable 4.0.4 at pin `9a949fb`, its actual procedure: grounded candidates validated for viability before the roll, `concept-seed.mjs` assigns an index and deals challengers, the assigned direction leads. |

Arm C runs against the live catalogue. A test roll at this pin returned `source: api`,
`281/531 human-approved`, three challengers with full system grammar. If any run in the lab
returns a degraded roll, that run is recorded DEGRADED and excluded from every claim about
beating full Impeccable 4.0.4, and the exclusion is stated in the report with its count.

## Conditions, all four required

`assign.mjs` is promoted to full-build testing only if every one of these holds:

1. **Brief-majority winner on at least 10 of 16 briefs.** A brief is won by the arm that
   takes at least two of its three judges' first preferences. A brief where no arm takes two
   is a tie and counts for nobody.
2. **Beats both A and C in aggregate**, on total first preferences across all 48 judgements.
3. **No increase in truth, task-fit or feasibility failures** relative to A. Measured on the
   judges' diagnostic scores for those three dimensions, and on any direction a judge marks
   as making a claim the brief does not support.
4. **Does not systematically lose an entire surface mode.** Losing every brief of any one of
   buy, operate, read or experience blocks promotion regardless of the total.

## The three outcomes

- **PROMOTE TO FULL BUILD** — all four conditions hold. Then: stop before the builds and
  close defect D1 first, as correctness work, not as a design improvement.
- **REJECT** — B loses. Then: explain why from the evidence, change one mechanism, test
  again. No challengers, no catalogues, no new gates, no new rules.
- **INCONCLUSIVE** — B neither clearly wins nor clearly loses. Same rule as REJECT: one
  mechanism, tested again.

If A beats both B and C, that is a result and not a disappointment: the experiment is
deleted and the simpler system stays.

## Judging

Three independent fresh judges per brief, no builder context, no sight of each other. Arm
order randomised independently in every packet, so a judge who saw the winner first in one
packet does not see it first in the next.

Primary question, and it is the result:

> If you were paying to have one of these directions built for this brief, which direction
> would you choose?

A single winner is required unless the judge genuinely cannot tell them apart.

Diagnostics collected separately, and they are the diagnosis, not the result: subject and
product specificity, audience identification, task and product clarity, distinctiveness,
feasibility, category-default risk.

**No weighted composite score is computed.** A composite that can override the stated
preference would let the dimensions decide an outcome the buyer question already decided.

## What may not happen after this point

- `assign.mjs` is not modified after judging starts.
- No direction artifact is edited, discarded or re-run for a better result.
- Every raw direction and every judge verdict is preserved, including the losses.
- No new feature is built during the experiment.
- Nothing is merged.
