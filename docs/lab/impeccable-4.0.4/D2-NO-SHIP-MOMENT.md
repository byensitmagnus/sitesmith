# D2, the half that has no home: there is no moment where a version ships

Stopped and reported rather than invented, under the standing stop condition about
architecture changes and about tests needing more than a local deterministic fixture.

## What is closed

**`ledger check` now runs on the canonical path.** `audit` was inspect then gate; it is now
inspect, gate, then `ledger.mjs check`, and the ledger's exit is carried into audit's. Proven
by invocation rather than by documentation: `tools/test-ledger-invoked.mjs` builds a skill
directory whose scripts are stubs that record their own argv, runs the real `audit` against
it, and reads the log. Ten checks. Five of them are red without the wiring.

The check runs only when the gate is clean. The two answer different questions, and a run
that prints both gets a list where the second is noise until the first is fixed. When it is
skipped the run says so rather than being silent.

## What is not closed, and why

**`ledger commit` must only record a version that ships. Nothing in the architecture can say
that a version ships.**

The requirement is exact: a build that fails verify, contract compare, journey or gate must
never enter the anti-repeat ledger, because every later build is measured against what is in
it. Today `commit` appends whenever the direction record is complete and no veto fires. A
build the gate refuses can append.

Three things were checked before stopping.

**There is no release command.** The public surface is init, recommend, build, inspect,
redesign, contract, audit, verify. `audit` is inspect plus gate. No command means "this
version ships", and no state records it: `state.json` holds the project name and its
surfaces, `decisions.jsonl` is an append-only log of which commands ran.

**`product/pipeline.json` declares a release contract and nothing executes it.** Six
requirements: verify passes or names its withheld verdicts, a critique locked to the render
that ships, a journey for buy, operate and redesign, a clean gate, a production build, and a
design contract that checks clean with a compare against the build. They are prose in a JSON
file. No command evaluates them.

**The gate writes no artifact.** It prints and exits. So there is nothing on disk that says
"the gate passed on this render", and `commit` has nothing to require.

## The guard that was written, and why it is not in the tree

`commit` was made to spawn `gate.mjs` in the build directory and refuse anything but exit 0,
including a withheld verdict, on the ground that a release nobody could check is not a
release. It works. Four invocation checks passed against the real script, and all four are
red without it.

It is not committed because of what it does to every other test of `commit`. The guard makes
a gate pass a precondition, so any fixture that commits must now also satisfy the gate:
`ASSET-MANIFEST.md`, a critique locked to the render, journeys, a production report. That is
a release fixture, not a unit-test fixture, and four existing cases in `test-ledger.mjs` go
red because their fixture passes the ledger and was never meant to pass the gate.

Two ways out, both a decision rather than a fix:

1. **A release command.** `sitesmith release` evaluates the six requirements
   `product/pipeline.json` already declares, and only a clean pass may commit. This makes the
   declared contract executable, which it is not today. It is a new command on the public
   surface.
2. **A gate artifact.** `gate.mjs` writes a small pass record carrying the render's hash;
   `commit` requires it and requires the hash to match. Smaller, and it adds a new file
   contract between two engines plus a staleness failure mode neither has today.

Option 1 is the one that matches what the product already says about itself. Option 2 is
fewer lines and quieter.

Either way `commit` stays reachable only by typing it, which is the honest state until one of
them is chosen: nothing calls it, and nothing should, because nothing yet knows that a version
ships.

## What was verified about `commit` in passing

Idempotence is already real and is now tested: the guard `commit` uses to skip a shape it
already holds matches on both the surface id and the fingerprint key, so a rerun on the same
build appends nothing and prints `skipped_exists`. That was the one part of the commit
requirement that did not need a ship moment.
