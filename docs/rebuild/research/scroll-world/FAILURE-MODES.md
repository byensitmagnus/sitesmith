---
title: FAILURE-MODES — scroll-world
ai_generated: "(C)"
---

# 1. The skill's whole value proposition is one fixed aesthetic, reused verbatim per build

`SKILL.md:100-122` fixes art direction to a shared "style preamble" reused byte-for-byte
in every scene prompt (`prompts.md:3-4,33-43`), and `SKILL.md:268-322` fixes camera
behavior to a 3-way roster (fly-through / walkthrough / locked-iso) applied uniformly for
the whole film. This is genuinely why one build's scenes look cohesive with each other —
but it is the same mechanism shape (a small fixed menu of looks, reused verbatim) that our
own three-site convergence test measured as a liability at the level of SiteSmith's whole
output (showcase 0/8). Here the risk is scoped to one narrow genre (scroll-cinematic
diorama sites) rather than everything SiteSmith produces, but if this skill's aesthetic
became SiteSmith's default answer to "scroll storytelling," the same convergence risk
reappears at that genre's scale. See `single-aesthetic-camera-roster` in
`MECHANISMS.json` and `VERDICT.md`.

# 2. Most of the "mechanism" is single-vendor CLI wiring, not technique

The Monid/Higgsfield integration is the majority of the file by volume (Steps 0, 2, 4, 5
and most of Step 1; all of `pipeline.md` except §5-6) and none of it is a durable
technique — it's argument names, endpoint paths, and billing math for two specific paid
services. The source acknowledges this instability directly: "the seedance endpoints
were text-to-video-only until late July 2026 — re-`inspect` before each build; the
catalog moves in both directions" (`SKILL.md:355-356`), and "Monid schema changed since
last build → it happens... re-run the Step 4 qualification probes" (`SKILL.md:735-738`).
A skill this coupled to one vendor's CLI schema is guaranteed to go stale in exactly the
parts that look most like "mechanism" — this is a strong argument for never porting the
paid-pipeline half wholesale, even if SiteSmith someday adds a generative-video capability
with a different backend.

# 3. No automated verification anywhere in the repo

Every quality gate described — cohesion review of stills (`SKILL.md:248-250`), per-leg
last-frame eyeballing (`SKILL.md:423-426`), seam continuity (`SKILL.md:613-626`) — is a
prose instruction to look at something and judge it, not a script. There is no
`verify.mjs`-equivalent, no CI config, no test file anywhere in the 12-file repo (`find`
confirms this). Full treatment in `TESTING.md`.

# 4. The "graceful fallback" is thinner than it's presented

`prefers-reduced-motion` correctly degrades to stills-only cross-dissolve
(`scrub-engine.js:199-201`), and the engine works with `clip`/`connectors` alone (no
mobile variants required). But the *interview* (Step 1) has no path for "no paid backend
available, or budget doesn't allow it" that produces a coherent lesser deliverable — Step
0.1 says "fall back to rendering the chain on Higgsfield credits instead," i.e. the only
fallback for "can't afford Monid" is "pay a different way," not "here's a non-video
version of this same page." The skill's entire premise assumes video generation will
happen one way or another; it has no truly video-free success path baked into the
interview itself.

# 5. Camera-grammar re-roll cost is treated as acceptable, not bounded

`SKILL.md:422-427` states expressive mid-leg camera moves raise re-roll odds and budgets
"~1 extra re-roll per expressive leg" as simply a cost of doing business, with no cap or
escalation path if a leg fails repeatedly beyond the budgeted re-roll. Combined with the
NSFW-false-positive gotcha (bedroom/pool/spa contexts trip Seedance's filter,
`SKILL.md:668-679`), a real build can hit an unbounded loop of re-rolls with only "try a
different provider for that one clip" as the exit — itself introducing the render-
character mismatch the skill otherwise works hard to avoid. Not applicable to SiteSmith
directly, but worth noting as a designed-in cost/loop-termination gap in the source.
