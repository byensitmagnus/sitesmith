# One-brief A/B/C pilot: result

```
instrument:          VALID
winner:              A
meaning:             current SiteSmith, no external assignment
distance:            CLOSE
confidence:          MEDIUM
verbosity influence: NO
model calls used:    4 of 4
```

Ranking, as the judge wrote it: candidate 2 first, candidate 1 "a genuinely close second",
candidate 3 "clearly third". Decoded:

**A > C > B.** Current SiteSmith first, pinned Impeccable 4.0.4 second, SiteSmith with
`assign.mjs` third.

One brief. This is a directional signal and nothing else.

## The decode, checked three ways

The mapping was sealed before the call, in its own file, away from the packet.

| the judge saw | is | |
| --- | --- | --- |
| candidate-1 | C | pinned Impeccable 4.0.4 |
| candidate-2 | A | current SiteSmith |
| candidate-3 | B | SiteSmith with `assign.mjs` |

1. **By hash.** Each packet file is byte-identical to the canonical artifact the sealed
   mapping names it as. Verified after the verdict landed, not before.
2. **By content.** The judge describes candidate 2 as "a weighbridge, not a shopfront", which
   is arm A's thesis verbatim from the generation record. Candidate 3's device is "the
   working-day tally", which is B's thesis. Candidate 1 is the blueprint-blue scribed plate,
   which is C's. All three match independently of the hashes.
3. **By permutation.** The order came from the artifacts' own hashes, permutation 4 of 6,
   recomputable by anyone holding the three files.

## What the judge said

**Why A won.** Its thesis is the most direct translation of the brief's own named problem: the
site exists to stop the wasted fifteen-minute refusal call, and "a weighbridge, not a
shopfront" states that job as one controlling idea rather than a mood. Its subject grounding
is the deepest of the three, its accent colour is defended with a business-specific reason,
and it explicitly considers and rejects numbering the workshop's steps as a 1-2-3 process
because that would claim more than the brief's facts license. The judge read that last move as
evidence of having internalised the constraints rather than the copy.

**Why C was close.** Its self-triage device is tied to the three numeric fields on the form
itself rather than sitting in the hero as decoration, and its hero fits both modelled refusal
cases above the fold. It lost narrowly on something its own honest-risk section had already
admitted, and which the judge says it flagged independently: a blueprint-blue scribed-and-
stamped register is a smaller step from generic industrial-B2B cliché than it first appears.

**Why B was third.** Its working-day tally is called "the most elegant, lowest-risk piece of
engineering in the packet", a static JS-free row of tiles that structurally cannot drift from
the brief's fixed dates. But the direction spends the whole first viewport on turnaround
timing, the least urgent of the brief's three named questions, so a reader cannot learn whether
their rotor is even in scope without scrolling. The brief's stated problem is the refusal, not
the return date.

## The length confound, and what the result did to it

The instrument could not equalise length without summarising decisions away, so it was
reported rather than removed and the judge was told explicitly not to reward it.

| | A | B | C |
| --- | --- | --- | --- |
| words | 2534 | 2438 | 3271 |
| result | **first** | third | second |

**The winner is neither the longest nor the shortest.** The longest arm came second and the
shortest came third, which is the pattern you would not see if length were driving the outcome.

The judge answered NO to verbosity influence and explained it unprompted: it noticed itself
being impressed by the longest entry's thoroughness partway through, went back to check
whether the other two were making equally substantive decisions in fewer words, found they
were, and chose the middle-length one over the longest. It also noted that the arm it ranked
last was the shortest, but that the reason was a structural choice stated with complete
clarity, not a gap it had to infer from missing detail.

That is the strongest evidence available from a single judge that the confound did not decide
the result. It is not proof.

## The uncomfortable part

`assign.mjs` came third of three, behind plain SiteSmith and behind Impeccable.

The mechanism assigned thesis 4 from a viable pool of five, and the direction it produced put
the least urgent of the brief's three questions in the first viewport. That is exactly the
failure mode an external assignment can cause: it removes the model's ranking rut, and it also
removes the model's judgement about which idea serves the reader first.

**One brief cannot establish that.** It is a hypothesis with one observation behind it, and the
honest next move is another brief, not a change to the mechanism.

## What may not be concluded

- Not that SiteSmith beats Impeccable 4.0.4. One brief, one judge, CLOSE, MEDIUM confidence.
- Not that `assign.mjs` is harmful. One brief, and it lost on a specific structural choice that
  a different assignment might not have produced.
- Not that the current SiteSmith is better than either. It won one comparison.

## Artifacts

| | sha256 |
| --- | --- |
| A raw direction | `c72d9d5fc3d84555bab833a82a6420cc2b3c9d69e04c3be9466ad7b685540b1f` |
| B raw direction | `503cd3c1915eca879483c88d3de6c037b8c9ea5e7edc9cf28dc1e6344b32b839` |
| C raw direction | `156b498027cda0de33293af5ebf7a17191b0c82747b2c580c658a80766027ae6` |
| canonical A | `f320d168f58d6233…` |
| canonical B | `f514f5f5889ad1a7…` |
| canonical C | `61ac9b7594c30e64…` |
| `canonical.mjs` | `984e2124ed64170d…` |
| `leakage.mjs` | `1b0bd346372f5cf1…` |
| `fidelity.mjs` | `5509d97d64d36b28…` |
| `VALIDATION.md` | `040ef0442ea8e8c7…` |
| raw verdict | `a451375b0f7b9306…` |

Worktree: `lab/beat-impeccable-4.0.4` at `42af8795`, with uncommitted changes recorded.
Impeccable pin `9a949fb543d44cfb406f61bcab99d95d7f12cf1d`, `--scope direction`, not degraded.

Full hashes in `FROZEN.json`, mapping in `SEALED-MAPPING.json`, verdict in
`judge/VERDICT-RAW.json`, decode in `RESULT.json`.

## Methodology concerns, stated rather than buried

1. **One judge, one brief.** No majority, no tie-breaker, and the judge itself said CLOSE. The
   distance between first and second is inside what a second judge could reverse.
2. **The length difference remains.** 34 per cent, not normalised because equalising it would
   have meant deleting design decisions. The result pattern argues against it having decided
   anything, and that is an argument rather than a control.
3. **The blinding was verified by measurement and by reading, not by a scrub agent.** No
   adversary tried to identify the arms from the packets. The eighteen measured axes are clean
   and I read all three myself, which is weaker than an independent attempt to defeat it.
4. **A and B share a worktree, C does not.** A and B differ only in the assignment mechanism,
   by construction. C differs in everything, which is the point of the comparison and also
   means any A-versus-C difference has many possible causes.
5. **Effort is unverified.** `max` was passed to all four calls. Whether the runtime honoured
   it is not observable from inside a run.

## Cost

| | |
| --- | --- |
| calls | 4 of 4 planned: three generations, one judge |
| model | `sonnet`, resolved id `claude-sonnet-5` per this session's environment |
| output tokens, generations | 577,937 across three calls |
| output tokens, judge | 151,801 |
| per call | not available: the harness reports a workflow total, not a per-agent split |
| cost | not available: no price is exposed to the run |
