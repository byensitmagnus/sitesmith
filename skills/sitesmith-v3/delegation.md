# Delegation

Open this only when the work genuinely splits. One agent building one website is the
normal case and it stays the normal case: this file exists so that delegation, when it
happens, has a contract instead of a vibe.

## When it is worth it

Delegate when all three hold. Two out of three is not enough.

1. The parts are independent. Two agents editing the same file is slower than one.
2. Each part is describable in a paragraph a stranger could act on. If you cannot write
   the input contract, the split is in your head and not in the work.
3. The verification is separable. A part whose correctness can only be judged against the
   whole was never a part.

Do not delegate a design decision. Two agents choosing a colour produce two colours and a
meeting. The thesis, the palette and the signature are one agent's, always.

## The four roles

Each role gets exactly what its input contract names, and returns exactly what its output
contract names. A role that returns prose for a human has misunderstood the job: it is
returning a value.

**Builder.** In: the direction record, one surface, the stack adapter, the floor file.
Out: the files it wrote, as a list of paths, plus the one sentence it would tell the next
person. Never returns a summary of its own quality.

**Verifier.** In: a URL and the build directory. Out: the gate exit codes and the first
blocking reason, verbatim from the tool. Never re-words a refusal, because a re-worded
refusal is a second opinion about a measurement.

**Refuter.** In: one claim. Out: refuted or upheld, and the specific case that decides it.
"Might be a problem" is not a case and does not count. Runs in a context that never saw
the work being judged, which is the whole reason it is a separate agent rather than a
second pass.

**Scribe.** In: the run state. Out: the production report and the reconciliation table.
Writes nothing that is not already in the state or a gate's output.

## The handoff

Four lines, in this order, and nothing else:

```
role:     builder | verifier | refuter | scribe
input:    <the paths and the one question, absolute>
contract: <what a correct return looks like, in one sentence>
refuse:   <the condition under which you must return nothing rather than guess>
```

The fourth line is the one that gets dropped and it is the one that matters. An agent with
no refusal condition fills a gap with something plausible, and plausible is exactly what
this product exists to avoid.

## Single-agent fallback

Every role above is a procedure before it is an agent. On a host with no delegation, run
them in sequence in the same context, in this order: builder, verifier, refuter, scribe.
The one thing that cannot be faked is the refuter's fresh context. When you have to run it
yourself, say so in the production report: `refuter: same context, discount accordingly`.
An unmarked self-refutation reads as independent and is not.

Nothing in the run depends on delegation being available. If this file is open and you
decide against splitting, that decision goes in the run state as a node and the run
continues unchanged.

## What was taken, and from where

The role-and-contract shape is `awesome-claude-code-subagents`', re-expressed. Its useful
half is the insistence that a role carries an explicit output contract rather than a job
title. Its other half is a taxonomy of roughly two hundred personas across fifteen
divisions, which is the noun-list antipattern that same repository's own critique names:
long lists of roles with no technique, no threshold and no worked example. Four roles with
contracts beat two hundred with adjectives, and the count is the point rather than an
economy.
