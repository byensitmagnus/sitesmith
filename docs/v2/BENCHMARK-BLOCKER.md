# The isolated benchmark cannot run on this machine

> **Archived decision, 30 July 2026.** The paid study described below was retired before
> generation. The runner and unpaid CI isolation probe remain reproducibility evidence, but
> `discovery` and `run-all` are not pending work or release blockers.

> **Update, 2026-07-29. The isolation now runs — in CI, not here.** The machine below still has
> no container runtime, and everything in this file about *this machine* is still true. What
> changed is that the GitHub runner has Docker, so the mechanical gate stopped being an
> assertion about untested code and became a green check.
>
> `.github/workflows/verify.yml`, job **the benchmark isolation holds**, on every push: build
> from the committed base lock, bring up the `--internal` network and the egress proxy, probe
> both arms, tear down. Both arms report `verdict pass` and `bind mounts exactly as expected`.
> The control cannot see the skill (`skill_absent denied`); the treatment can and cannot write
> to it (`skill_present ok`, `skill_readonly denied`); neither can reach any host but the one
> allowed endpoint, read a host path, or find the marker in its filesystem or environment.
>
> The first run of that job **failed**, and the failure was the runner rather than the
> isolation: containers run with `--rm`, so a short-lived one was removed before the mount
> inspection could poll it, and the gate reported "the container never appeared for
> inspection" while every isolation check inside it passed. Fixed by reading the mount table
> off a created-but-unstarted copy, which is deterministic. That bug had never fired locally
> because the gate had never been able to run locally at all.
>
> **Retired and unpaid:** `discovery` and `run-all` spend model credits. The eighteen generations
> are absent from CI and are no longer planned. No benchmark figure is claimed anywhere.

> Checked, not assumed. This is the one thing in the release plan that is blocked, and it is
> blocked on the environment rather than on the code.

## What was checked

```
docker            not on PATH
C:\Program Files\Docker\Docker\resources\bin\docker.exe    absent
C:\Program Files\Docker Desktop                            absent
C:\ProgramData\DockerDesktop                               absent
C:\Users\Usmo1\AppData\Local\Docker                        absent
wsl --status      "Windows-undersystem til Linux er ikke installeret"
podman            absent
nerdctl           absent
containerd        absent
```

There is no container runtime and no WSL to host one.

## What that blocks

`tools/bench-container.mjs` is the runner for the eighteen isolated generations and the twelve
competitor runs. Its whole design is that the two arms differ by **one read-only mount and
nothing else**, on an `--internal` network behind an exact-host CONNECT proxy, from a pinned
base digest. None of that is expressible without a container runtime, and simulating it would
produce a number that looks like a benchmark result and is not one.

So phases 6 and 7 are **not started**, and no benchmark figure is claimed anywhere in this
repository.

## What is not blocked, and is done

The runner itself is finished and its self-test passes without spending anything:

```
node tools/bench-container.mjs selftest     →  PASS — 63 checks, nothing was spent
```

Those 63 checks assert the rules that make the run meaningful — arms identical but for the
mount, image addressed by immutable id rather than a movable tag, network Internal flag,
proxy allowlist, apt manifest, budget ceiling, counterbalanced run order, clean tree. They run
on this machine today. What cannot run is the part that needs Docker to exist.

## What it would take

1. Docker Desktop with the WSL 2 backend, or any OCI runtime that supports `--internal`
   networks and `--platform linux/amd64`.
2. `node tools/bench-container.mjs build` — from the committed `bench/base.lock.json`.
3. `probe` (unpaid, mechanical isolation) and `discovery` (two short paid calls).
4. `run-all` — eighteen generations, three briefs × three with × three without.

Steps 3 and 4 spend model credits, and the budget for them has not been approved. The runner
refuses to start without both an explicit budget and a clean tree, so nothing can begin by
accident.

## What this means for the release

v1.0 ships with the pilots, the gates, the visual asset engine and the product layer, and it
ships **without a benchmark claim**. The README says so in those words. A skill that says "we
have not measured this yet" is worth more than one that reports a number produced by a
simulation of isolation, which is the failure this whole layer was built to prevent.
