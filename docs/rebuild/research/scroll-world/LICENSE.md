---
title: LICENSE — scroll-world
ai_generated: "(C)"
---

# Licence facts

- Repo `LICENSE` file: MIT, copyright (c) 2026 cyw. Full standard MIT text, no
  modification, no additional restriction clause.
- `skills/scroll-world/.claude-plugin/plugin.json:10`: `"license": "MIT"`.
- `.claude-plugin/marketplace.json`: owner `cyw` (`cyw@cywang.me`), no separate licence
  field but references the same plugin.

MIT permits redistribution (including verbatim) with the copyright notice and permission
notice retained — no attribution-in-a-specific-place requirement beyond that, no
share-alike, no patent grant complication.

# How this interacts with this project's rules

This project's `CLAUDE.md` / `LICENSE-AUDIT.md` clears exactly four sources for
verbatim redistribution: `taste-skill` and `ui-ux-pro-max` (MIT), `frontend-design` and
`impeccable` (Apache 2.0). `scroll-world` is not one of them — it was supplied for this
autopsy as a research source, not as a pre-cleared redistribution source. That said,
being MIT means there is no *legal* barrier to reusing its text or code verbatim with
notice, unlike the two sources this project has already flagged as unsafe
(`website-builder-setup`, no licence; `redesign-skill`, no traceable authorship). If any
concrete asset from this repo is copied into SiteSmith rather than reimplemented in our
own words — most plausibly `scrub-engine.js`, which is a self-contained, substantial file
worth keeping close to verbatim rather than rewriting — it should carry an MIT notice
crediting `cyw`/`oso95/scroll-world`, consistent with the licence's own requirement.

# What this autopsy actually did

Per this task's instructions, mechanisms are described in this autopsy's own words with
path/line citations rather than quoted at length, regardless of the MIT permission to
reproduce — the autopsy's job is to characterize mechanisms for a rebuild decision, not
to stage a copy of the source. Any subsequent adoption decision (see `VERDICT.md`,
`MECHANISMS.json`) is where the actual copy-vs-reimplement choice, and the accompanying
notice, should be made.
