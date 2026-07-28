# Round 2 — still failing, and the precise blocker

> Round 1 failed. One targeted fix round was applied ([`ROUND-1-FINDINGS.md`](ROUND-1-FINDINGS.md)).
> Round 2 put the revised pilots in front of two reviewers who had seen none of it. It fails.
> Per the rule for a second failure: this stops here and names the blocker.

## The verdict

| label | subject | reviewer C | reviewer D | median | gate |
| --- | --- | --- | --- | --- | --- |
| SHEET-T6 | 01 chandlery | 6 | 6 | **6** | FAIL — under the threshold of 8 |
| SHEET-R9 | 02 foundry | 7 | 6 | **6.5** | FAIL — threshold, plus a retained generic tell |
| SHEET-M2 | 03 cask console | 6 | — | **6** | FAIL — one reviewer, and under the threshold |

Round 1 medians were 5.5 / 6 / 2. Round 2 is 6 / 6.5 / 6. The cask console moved eleven points
of criteria and four points of production-readiness; the other two moved half a point and none.
**The fix round repaired defects and did not raise the ceiling.**

## Blocker 1 — the product blocker, and it is one finding

Four reviewers across two rounds, none of whom saw each other's work, converge on the same
thing. Reviewer C stated it as a property of all three at once:

> the action the visitor came to perform is the visually lightest thing on every page, and on
> two of the three it feeds an empty panel

That is the blocker, and it is not a matter of taste. On the chandlery it is severe enough that
**both round-2 reviewers independently concluded the site has no length field at all** —

> there is no length field anywhere, so the visitor's actual task dead-ends at a button and an
> order panel that is empty on both views — reviewer D
>
> "Cut a length" is the lightest element in every row, no length can be entered anywhere on the
> page — reviewer C

The field exists. Driven in a browser, `.toggle` reveals `input#len-TS12`, labelled "Length,
metres", and `journeys/cut-and-order.spec.mjs` passes against it. But it is behind a 1px
outlined button that is the quietest element in its row, and the panel it feeds shows an empty
state until it is used. Two careful reviewers looked hard and concluded the feature was absent.

**A primary action that two experts cannot find is a hierarchy defect, whatever the DOM says.**
It is criterion 6, it is the reason criterion 7 sits at 6, and it is the same shape on all
three pilots: the pages are built to *explain* well and finish the *transaction* thinly.

Fixing it is a design change to the primary action on three pages — the disclosure pattern
itself, the weight of the control, and what the panel shows before it is used. That is a second
fix round, which the rule for this phase does not permit, and it is the right thing to stop on.

## Blocker 2 — a static sheet cannot show a page's own interaction

Round 1's instrument defect was `position: sticky` rendering pinned in a full-page capture.
That is fixed: the sheet is now a scroll strip. Round 2 exposes the next one, and it is the
same shape.

A contact sheet shows the page as it first paints. Any control that *reveals* another control —
a disclosure, an accordion, a row that expands — is invisible to it, so the reviewer scores a
page that appears to have no way to do the thing it is for. That is what happened on the
chandlery, twice.

The correct repair is that the sheet should include the states the journeys already drive: the
journey knows how to open the cut control, and the frame after it is the one a reviewer needs.
That is a change to the preflight harness, not to any frozen gate, and it is written down here
rather than made now, because making it would be a third round.

Note carefully what it does **not** excuse. Blocker 1 survives it. The reviewers were wrong
that the field is absent and right that it is invisible, and only the first half was the
instrument's fault.

## Blocker 3 — the evidence chain for round 2 is broken

The round-2 contact sheets were written to the session scratchpad. Partway through both
reviews, something outside the run deleted that directory: reviewer C had read five of the six
sheets, reviewer D had read four. Both said so unprompted and neither guessed at the missing
pages — C scored the cask console on its desktop view alone and recorded the caveat, D wrote no
review for it at all.

So round 2 is **not audit-complete**, independently of its scores:

- The `sheet-sha256` in all five surviving reviews cannot be checked against the images that
  were scored, because those bytes no longer exist and JPEG re-encoding will not reproduce
  them. `round-2/RUN.json` records `"sheets-present": false`.
- One label has one reviewer. `critique-gate.mjs` fails it on that alone, correctly.

This is a process defect and it is mine. Evidence that a gate binds to by hash has to be
committed before the reviewers are dispatched. Round 1 survived only because it was staged into
the repository before the wipe. The fix is one line of sequencing — commit the sheets, then
review — and it is a precondition for round 3, not an argument about it.

## What round 2 did establish

Not everything here is a failure, and the fix round is not nothing.

- The cask console went from median 2 with four criteria below the floor to median 6 with none
  below it. The mobile overprinting, the inverted state hierarchy and the empty six-column
  table are gone, and no reviewer raised any of them again.
- The foundry's sticky drawing is now seen for what it is. Reviewer C's criticism of it changed
  from "the left column is empty" to "the same section holds all four screens, unchanged, never
  drawing the after" — which is a real design argument about a page that is *about* before and
  after, and a much better criticism than the one the broken instrument produced.
- No reviewer in round 2 made the generic-template answer their primary criticism. One genuine
  tell survives in the body of D's foundry review, about the bell glyph.
- Every mechanical gate is green on all three: verify, journey, production-gate,
  direction-fidelity, token-drift, and portfolio-diversity with no pair over the shared-device
  limit.

## One gate changed, and why that was allowed

`critique-gate.mjs` failed three reviews for sentences that **deny** the generic-template
failure — "that is the behaviour of a business that sells off coils, not a generic disabled
state", and "the ground is warm rather than neutral, which is the difference between a foundry
and a template". The whole-review scan matched the word and never read the clause, and it read
lines rather than sentences, so a clause split across a wrap lost its negation entirely.

That is a reproduced implementation error, so it is fixed rather than tolerated:

- the scan reads **sentences**, joining wrapped lines within a paragraph;
- a match whose clause is negated or contrastive does not count against the review;
- "not just generic" and "not only a template" are deliberately not negations — they concede
  the failure and add to it;
- a denial is **reported as a note**, never silently dropped, because a gate quietly deciding a
  sentence does not count is the failure this file exists to prevent.

The primary-criticism test is untouched and still unconditional. Three fixtures cover it, and
the pass case fails without the fix — verified by reverting it. Round 1's real buried tell on
the cask console still fails, and both round-1 medians are unchanged.

## The three things that must happen before round 3

1. **Raise the primary action on all three pilots** — its weight, and what its panel shows
   before it is used. This is a design round, not a repair round.
2. **Teach the preflight sheet to show the states the journeys drive**, so a disclosure control
   is scored as a control rather than as an absence.
3. **Commit the sheets before dispatching reviewers**, so the hash a review binds to is always
   checkable afterwards.
