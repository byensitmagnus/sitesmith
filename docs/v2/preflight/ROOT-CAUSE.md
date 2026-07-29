# Three rounds, one gate, flat at six. The root cause.

> Ten blind reviewers across five rounds. The rule is that a gate failing three times means the
> patching stops and the cause gets found. It has failed three times.

## The numbers

| | round 1 | round 2 | round 3 | round 4 | round 5 |
| --- | --- | --- | --- | --- | --- |
| chandlery | 5.5 | 6 | 6.5 | 7 | **6.5** |
| foundry | 6 | 6.5 | 4 | 6 | **6** |
| cask console | 2 | 6 | 5 | 6.5 | **6** |

Round 1 to 2 was worth doing: the cask console went from 2 to 6 and stayed there. Everything
after that is noise around six. Round 5 — the composition round — moved the chandlery *down*.

## The root cause, in the reviewers' own words

Round 3, reviewer G on the chandlery: the spec columns "hold position down every row so the page
is a comparison table without drawing one" — scored as a strength.

I then removed exactly that, in round 4, because both round-3 reviewers had named the tracked
small-caps label layer as one of five devices all three sites shared. The specs became run-in
sentences.

Round 5, reviewer Q on the same page, primary criticism: "every figure a rigger buys on is set
inline in a running sentence at body size, so no number is larger than any other, nothing aligns
down the column, and comparing five constructions means reading five paragraphs."

**That is the whole problem, and it is not a defect.** The device that makes a comparison page
good at comparing is a table of aligned figures. The device that makes three sites look like one
studio is a table of aligned figures on all three. Every move that satisfies one requirement
costs the other, and I have now paid that cost in both directions and landed in the same place.

The same trade shows up three more times:

- **The primary action.** Round 3: too quiet, invisible on all three. Round 4: raised. Round 5,
  reviewer P on the cask board: the status pill is still louder than the button. Reviewer Q, same
  page, same round: the button "reads disabled". But raising it further on a board whose premise
  is *late first* makes the action outshout the severity, which is what round 3 failed for.
- **The composition.** Round 4: all three ran a narrow measure in a wide container. Round 5: the
  cask board went edge to edge and P measured 1100px of empty slate per row; the chandlery went
  two columns and Q lost the comparison.
- **The empty rectangle.** Q: "one conspicuous empty rectangle below the fold on every page."
  Three different rectangles, three different causes, one shared symptom: a page sized for the
  state it is in most often, not the state it is in on arrival.

## What this means

**The gate is not wrong and the pages are not broken.** Eight reviewers have scored these
between 5 and 7 with consistent, specific, mostly-correct findings. What has not happened is any
round reaching 8, and the reason is that 8 means *no apology needed on any of the seven criteria
at once* — and the seven criteria include both "specific to this subject" and, via
portfolio-diversity, an implicit "and unlike its siblings".

Three subjects, one author, one working session each, and a hard requirement that no device
appear twice, is a constraint that costs more than it returns past about six. Two blind
reviewers in round 5 both said the sites are "one studio, three pieces of work — not one
template", which was the round-4 goal, and both still scored six.

## What I recommend, and what I will not do

**I will not run a round 6.** Three consecutive failures of the same gate is the stop condition,
and rounds 4 and 5 have already shown the oscillation: a device removed for diversity comes back
as a defect, and a defect fixed for one reviewer becomes the next reviewer's primary criticism.

Three options, and the first is the one I would take:

1. **Ship at six, with the numbers published.** The pilots are honest work that passes every
   frozen gate, and the review record is the strongest part of the repository — five rounds, ten
   reviewers, every score and every criticism committed. A skill that publishes "our own pilots
   score 6 to 7 out of 10 and here is every review" is worth more than one claiming a gallery it
   has not earned. The threshold of 8 stays in `critique-gate.mjs` as the bar for *client* work.
2. **Drop the same-author constraint.** Have three different agents build the three pilots
   independently, with no shared session and no sight of each other. The shared-method finding
   would then be a real measurement rather than an artefact of one author working in one sitting.
3. **Reduce to one pilot and take it to 8.** Most of the six-ness is spread thin: every round
   split its effort three ways. One subject, five rounds of the same attention, would very
   likely clear the bar — and would prove the pipeline just as well.

Whichever, the frozen gates, the visual asset engine, the product layer and the evidence chain
are finished and independent of this decision.
