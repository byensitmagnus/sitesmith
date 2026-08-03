---
title: LOOPS — scroll-world
ai_generated: "(C)"
---

# Every iterative/self-correction point in the source, and how it terminates

| Loop | Location | Trigger | Stop condition |
|---|---|---|---|
| Still cohesion review | `SKILL.md:248-250` | After generating all N stills | Human/agent eyeball judgment ("must read as one cohesive world — same angle, palette, light"); re-roll the off-style one, optionally locking style with `--image`. No count cap, no automated diff. |
| Per-leg handoff check (architecture A) | `SKILL.md:423-426`; `prompts.md:117-119` | After each leg renders, before chaining the next | Eyeball the last extracted frame — "should read as a frame from a calm forward glide." Re-roll if not. Explicitly budgeted at "~1 extra re-roll per expressive leg" but not capped if it keeps failing. |
| Locked-iso angle-drift check | `SKILL.md:433-435`; `prompts.md:102-104` | Same as above, locked-iso variant | Same eyeball method, checking rotation specifically ("Seedance drifts the angle slightly on long legs"). |
| NSFW false-positive re-roll | `SKILL.md:668-679` | A clip returns `status "nsfw"` | Ordered fallback ladder: (1) re-roll (often non-deterministic, passes 2nd-3rd try), (2) strip trigger words + add "empty, unoccupied..." qualifiers, (3) regenerate on `kling3_0` instead (accepts the render-character mismatch), (4) as last resort set the connector to `null` and let the engine's crossfade cover the gap. Terminates by design at step 4 — never truly unbounded, but steps 1-3 have no stated retry cap. |
| Monid/Higgsfield transient-failure re-roll | `SKILL.md:665-667`, Gotchas | 503 / `not_enough_credits` race on a concurrent batch | Re-roll just the individual failure; verify with `workspace list`/`monid balance` that it's not a real credit shortfall. No cap stated. |
| Seam QA (Step 8) | `SKILL.md:613-626` | After the whole page is assembled | Screenshot just before/after each seam in a headless browser, compare by composition (explicitly not raw PSNR — "a correctly frame-locked seam can read ~18-25 dB from detail shimmer alone"). If mismatched, root-cause to either wrong conditioning frames (redo Step 5) or too-short crossfade band. No automated diff tool provided — this is a described procedure, not a script. |
| Monid endpoint qualification probe | `SKILL.md:361-367`; `pipeline.md:281-288` | Before any build, or whenever the Monid input schema looks different from documented | Two cheap 480p probes (leg conditioning, then connector conditioning with a second image) checked against a PSNR threshold (~30 dB) and expected billing cell. Pass/fail is explicit and automatable in principle (it's a numeric threshold), but the repo ships no script that runs it — it's manual CLI + `jq` commands in prose. |

# What's missing across all of them

None of these loops have a scripted verifier. Every "pass" condition bottoms out in "look
at it and judge," even where a numeric threshold exists (PSNR ≳ 30 dB for Monid
qualification) — the threshold is stated as guidance for a human/agent reading a number
off a `jq` command, not enforced by a script that exits non-zero on failure. Contrast with
this project's own `scripts/verify.mjs`, which actually runs and gates on axe/console/
overflow checks rather than describing what a human should look for. See `TESTING.md` for
the full treatment of that gap.

None of the re-roll loops carry a hard cap. Several are explicitly budgeted in expected
*count* ("~1 extra re-roll per expressive leg," "~15% re-roll headroom" at the budget
stage, `SKILL.md:153`) but nothing stops a leg or clip that keeps failing beyond its
budget — the only stated exit for the worst case (NSFW-flagged interiors) is the
model-swap-or-null-connector ladder, and even that assumes the user is present to approve
each step rather than a fully autonomous loop.
