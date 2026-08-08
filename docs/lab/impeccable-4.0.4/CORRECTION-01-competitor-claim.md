# Correction 1: what assign.mjs actually changes

Written before the direction laboratory opened, and before any judge saw anything.

## The claim that was wrong

The commit message for `assign.mjs` and the summary that followed it carried a comparison
table with this row:

| | Impeccable 4.0.4 | assign.mjs |
| --- | --- | --- |
| can land on something unbuildable | yes | no, viability judged before the key |

That is not what the source says. `skill/reference/new-work.md:55` at pin
`9a949fb543d44cfb406f61bcab99d95d7f12cf1d`:

> Every direction the roll can land on must already be viable: every relationship and claim
> it visualizes true, a real palette and component family, a distinctive composition with one
> product-specific experience, workable at full-surface scale within the available assets,
> tools, and performance budget. A candidate that fails on truth is replaced before the roll,
> never rescued by it.

Viability before the roll, covering truth, task fit and feasibility, is Impeccable's stated
rule. The row asserted the opposite of its source and is withdrawn.

## The other two rows were overstated the same way

**Re-roll on taste.** `new-work.md:49`: "You may re-roll on your own only on named factual
grounds, when the assigned direction cannot carry the product's truth or task; taste is never
grounds." Impeccable has the rule. The difference is that `assign.mjs` reads the reason back
and refuses on it.

**Re-roll cap.** `new-work.md:49`: "after two consecutive re-rolls, ask what quality is
missing", and "Re-roll eliminates every direction already shown". Impeccable has both the
soft limit and the no-return rule. `assign.mjs` counts them in a file.

## What is actually different

The policies are close to identical. What differs is where they are enforced.

| | Impeccable 4.0.4 | assign.mjs |
| --- | --- | --- |
| candidates must be viable before the roll | stated in the procedure the agent follows | refused in code; `validate` writes a per-candidate verdict and `assign` will not run without it |
| viability judged before the outcome is known | implied by the order of the procedure | enforced: `validate` exits 1 once an assignment exists |
| the list may not change after assignment | not stated | refused: the candidate-list hash is compared |
| re-roll reasons exclude taste | stated | refused on a word list, exit 1 |
| re-roll cap | "after two, ask what quality is missing" | counted in the file, exit 1 at two |
| what the draw excludes | index 0 and 1 by arithmetic | the candidate the model marks as its own autopilot |

Only the last row is a difference in policy rather than in enforcement, and even that is a
difference of mechanism for the same intent: both exist to keep the model off its own
default. Impeccable's arithmetic exclusion is positional and cannot be gamed by reordering,
because the model does not know the index in advance. `assign.mjs`'s exclusion is semantic
and can in principle be gamed by mislabelling the autopilot candidate, which is a real
weakness of the approach and is why the direction laboratory has to measure it rather than
assume it.

## What this does to the round

The honest claim for `assign.mjs` is narrow: **it makes a policy both products already hold
machine-checkable rather than procedural.** Whether that changes the design a buyer prefers
is exactly what has not been shown, and is what the laboratory is for.

Nothing about this correction changes the experiment, the briefs, the promotion rule or the
judging. It changes what the round is allowed to say it is testing.
