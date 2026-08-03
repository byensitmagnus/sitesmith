---
title: VERDICT — scroll-world
ai_generated: "(C)"
---

# The single most valuable thing to steal

`references/scrub-engine.js` in full, and specifically the combination of the segment/
scene data model (`86-101`), blob-based scrubbing (`198-220`), and the mobile-hardening
bundle (`66-73,273-323`). This is a complete, self-contained, dependency-free front-end
mechanism that solves real, named browser bugs (byte-range-less hosts freezing scrub,
iOS Safari's blank-muted-video quirk, phone seek pile-up, URL-bar resize jumps) with
specific, verifiable fixes — and it has zero coupling to how the video clips were
produced. It would work identically wired to a client's own product-demo footage as it
does wired to Higgsfield/Monid output. This is squarely on the "pure front-end technique"
side of this autopsy's brief, and it's good, hard-won engineering independent of the
AI-generation premise the rest of the skill is built around.

# The single most dangerous thing to copy

Treating the skill's *aesthetic* mechanism — a shared style preamble reused verbatim
across every scene, plus a 3-way fixed camera-architecture roster — as a model for how
SiteSmith should approach any kind of visual cohesion. It is genuinely why one build's
scenes look like one world, but it is the same mechanism shape (small fixed menu of
looks, applied uniformly) that this project's own three-site convergence test measured
as a liability (showcase 0/8) — just operating at the scale of one genre instead of
SiteSmith's whole output. Adopting this shape anywhere in SiteSmith's reasoning about
visual identity, even scoped to "scroll-cinematic sites specifically," would be
re-importing the exact failure mode already measured, dressed up as a narrower use case.

# One-line verdict

Genuinely two different packages bolted together: a well-engineered, portable
scroll-scrub front-end (adopt outright) glued to a single-vendor paid video-generation
pipeline and a fixed-aesthetic creative template (both reject) — take the engine, leave
everything that assumes a Monid/Higgsfield account and a diorama.

# Confidence and what would change it

High confidence (0.8+) on the engine mechanisms — they're small, self-contained, and
independently verifiable by inspection regardless of this project's own testing. Lower
confidence (0.4-0.6) on the "adapt" mechanisms (open-question interview framing,
capability-gating discipline) since their value depends on how SiteSmith's own interview/
build steps are actually structured, which this autopsy did not have visibility into
beyond the CLAUDE.md summary. Nothing here would change with more reading — the whole
repo was read in full; the uncertainty is about SiteSmith's other half, not this source.
