---
title: OVERVIEW — scroll-world
ai_generated: "(C)"
---

# What this is

`oso95/scroll-world`, MIT licence. A Claude Code / Codex agent skill (also shipped as a
Claude Code plugin via `.claude-plugin/marketplace.json` + `plugin.json`) that builds one
specific artifact: a scroll-scrubbed "fly through the world" landing page where a
pre-rendered camera dives into an AI-generated diorama scene per section and flies to the
next with no cuts.

Repo size: 291 KB, 12 files (`find … | wc -l` = 11 excluding `.git`, LICENSE/README add 2
more at the root). Nothing here is large — the whole thing was read in full.

```
scroll-world/
├── LICENSE                              MIT, (c) 2026 cyw
├── README.md
├── .claude-plugin/{marketplace,plugin}.json
└── skills/scroll-world/
    ├── SKILL.md                         762 lines / 50,306 chars — the entry point
    └── references/
        ├── prompts.md                   170 lines — intake checklist + prompt templates
        ├── pipeline.md                  306 lines — batch shell scripts (Higgsfield + Monid)
        ├── scrub-engine.js              448 lines — the portable front-end scrub engine
        ├── index-template.html          73 lines — minimal page that mounts the engine
        └── knockout.py                  89 lines — background-removal utility
```

# Entry point and routing

`skills/scroll-world/SKILL.md` is the sole entry point (`allowed-tools: Bash, Read, Write,
Edit, AskUserQuestion, Skill`). It is a linear 8-step procedure (Bootstrap → Interview →
Stills → Knockout → Camera architecture → Connectors → Encode → Assemble → QA) plus a
~110-line Gotchas section, and it routes out to the four reference files by name at the
point in the procedure where each is needed (progressive disclosure — see
`CONTEXT-STRATEGY.md`).

# The two halves

This skill's substance splits cleanly in two, and the split is the entire point of this
autopsy:

1. **The paid video-generation pipeline** — Higgsfield CLI (stills, `gpt_image_2`) and
   Monid CLI (video chain, `seedance_2_0` pay-per-clip; Higgsfield credits as fallback
   biller), the interview steps that negotiate camera architecture/mobile/budget, the
   frame-extraction-and-reconditioning "seam law," and the vendor-specific gotchas
   (NSFW filter false-positives, Monid's `sfs` file-system frame relay, endpoint
   qualification probes). None of this runs without a Monid or Higgsfield account and
   real USD/credit spend, and most of it is single-vendor CLI wiring that breaks the
   moment an endpoint schema changes (the skill says so itself — SKILL.md:735-738).
   **This half is not usable in SiteSmith.**
2. **The pure front-end scrub engine** (`scrub-engine.js`) and the encoding/serving
   knowledge that keeps it smooth (`SKILL.md` Step 6, `pipeline.md` §5-6) — a
   vanilla-JS, zero-dependency, config-driven engine that plays an ordered chain of
   video clips as one scroll-scrubbed flight, with mobile hardening, reduced-motion
   fallback, and CSS-variable theming. Nothing in this file assumes the clips were
   AI-generated; it would work identically with stock footage, real product photography
   video, or a client's own b-roll. **This half is genuinely portable.**

# Licence

MIT (`LICENSE`, `plugin.json:10`). Per project rule this repo is not one of the four
sources cleared for verbatim redistribution (`taste-skill`, `ui-ux-pro-max`,
`frontend-design`, `impeccable`) — see `LICENSE.md` for the full treatment.
