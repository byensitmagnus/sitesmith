# Round 8 — assets stopped being the worst thing on the page

Three new builds from three unrelated briefs, by three agents who never met, using the skill
after the asset-plan step was added. Two assignment-blinded reviewers, the same seven criteria,
the same 1–10 scale, the same threshold of 8. No threshold moved and no gate was made easier.

**8.21 across the portfolio. 3 of 3 reach 8.** Round 7 was 7.67 and 0 of 3.

| label | subject | W | X | combined | |
| --- | --- | --- | --- | --- | --- |
| SHEET-K7 | tannery | 8.29 | 8.86 | **8.57** | meets 8 |
| SHEET-B4 | tideworks | 7.86 | 8.29 | **8.07** | meets 8 |
| SHEET-W1 | seed library | 8.00 | 8.00 | **8.00** | meets 8 |

Reviewers 0.57, 0.43 and 0.00 apart. On the seed library they agreed on all seven criteria
independently.

## The criterion this round was about

| criterion | round 7, six reviews | round 8, six reviews | mean |
| --- | --- | --- | --- |
| direction | 9 8 9 9 9 9 | 9 9 9 10 9 9 | 8.83 → 9.17 |
| specificity | 8 9 8 9 9 9 | 8 9 9 10 9 9 | 8.67 → 9.00 |
| type | 9 8 8 8 8 8 | 8 8 8 9 8 8 | 8.17 → 8.17 |
| colour | 9 8 8 8 8 8 | 8 9 9 9 7 7 | 8.17 → 8.17 |
| **assets** | **7 6 6 6 6 6** | **8 8 9 9 9 9** | **6.17 → 8.67** |
| hierarchy | 7 6 7 8 6 6 | 7 7 8 9 7 7 | 6.67 → 7.50 |
| production-readiness | 8 8 7 6 6 7 | 7 8 6 6 7 7 | 7.00 → 6.83 |

Assets moved 2.5 points and was the lowest criterion in round 7 on every page. It is now the
highest. Nothing else moved more than half a point, and production-readiness went slightly
*down* — which is the shape you want in a result like this, because it means the gain is not
reviewers being warmer across the board.

What the reviewers said about the assets, unprompted and to each other's independent agreement:

- **tannery** — six hides drawn edge on, in one treatment, encoding thickness as height, temper
  as the droop past the drawn bench edge and grain as the notch rhythm on the top edge. Both
  reviewers noted the lay/over control makes the 1.2 mm against 1.4 mm comparison *in one
  frame* rather than mentioning it. That is the exact failure round 7 led on, on an unrelated
  subject, reversed.
- **seed library** — solid outline means the seed comes back true, broken outline means it will
  not, at one scale across the first screen. W called the borrowed-proof handling the best of
  the three: two associations named in type with an explicit printed note that no badge was
  asked for.
- **tideworks** — deliberately imageless, declared in `DIRECTION.md` and argued in
  `ASSET-PLAN.md`, and scored 8 by both. The rubric says a page with no imagery is not thereby
  low if the typography carries the argument, and two reviewers applied that as written.

## What is still wrong, in their words

Meeting the threshold is not the same as being finished, and both reviewers named faults.

- **tannery, production-readiness 6 from both.** On mobile the Specification block sits in a
  horizontal scroller with no affordance, cutting its own prose mid-word and pushing LEAD TIME
  off the right edge. Both found it independently. X added that the copy claims all six stand
  on one baseline while the drawing puts them in six banded rows. This is the page's highest
  score and its worst defect at once.
- **seed library, colour 7 from both.** Nine full-width brick-red "Add to slip" buttons make
  the accent the dominant mass; four fit in one mobile viewport. The accent that carries the
  page's one idea is spent nine more times.
- **tideworks, hierarchy 7 from both.** The passage-log form puts four controls on three
  baselines because each column's help text is a different depth, and after three dense screens
  the right half of a 1280 viewport is abandoned.

**The tannery's mobile fault is worth dwelling on.** `verify` reports zero horizontal overflow
at 375, 768 and 1440, and it is right: the container is `overflow-x: auto`, so nothing is
broken and the user can scroll. What neither reviewer could do is scroll, because they had a
screenshot — which is exactly the position a visitor is in for the first second. A scrollable
table with no affordance passes every gate this repository has and fails two readers. That is
not an argument for a new gate; it is the case for keeping both instruments.

## The portfolio question

Both reviewers, independently: one studio and one method, three genuinely different executions.
Both named the same shared devices — mono eyebrows, single hairline dividers, label/value
tables, no photograph, no gradient, no rounded card, no icon grid, and a closing appendix in the
same voice about what the page will not claim. Both picked the same closest pair, and W put it
best: *"the grounds, type systems and chart ideas are argued from each subject, not restyled
from one template… B4 differs mainly in surface while sharing the same bones."*

So the round-7 finding stands and is not repaired: the skill has a hand of its own. What
changed is that this time three agents used it to make three arguments rather than three
decorations. X noticed the sharper version of it — *"the rarer habit of printing the number
that damages them (96 of 412, eleven months and a closed window, a lock dead since 2006) with
a sentence saying why it was not rounded"* — which is a house style worth having.

## Integrity

Assignment-blinded, on the same terms as round 7 and with the same limits stated.

The key was generated into the tree, moved out before either reviewer was dispatched, and is
committed here only after both locks. `find` over both reviewer workspaces returns zero files
matching a key. The sheets were committed before dispatch, so every `sheet-sha256` remains
checkable. Each review carries the run id, the rubric, sheet and brief hashes, a hash of its
own body and the time it locked, and `open-key.mjs` verified all of it before releasing the
mapping.

Locks at 18:52:03Z and 18:58:43Z. Key opened at 19:02:56Z.

**Not technical blindness.** The reviewers ran on this host with shell access and could have
reached the sealed key had they gone looking. What is enforced is a withheld assignment and
hash-bound, unedited reviews. Isolation that a reviewer cannot defeat needs the review to run
where the key is unreachable, and that is not done.

## The three pilots are untouched

`pilots/01-chandlery`, `02-foundry` and `03-cask-console` are byte-identical to what their build
agents left, and their round-7 reviews are unedited. They are the failed control group: 7.67,
0 of 3, assets 6 on five of six reviews. That number is what makes this one mean anything.
