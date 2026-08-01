---
title: taste-skill — Licence
ai_generated: "(C)"
---

# Licence file present

`LICENSE` at repo root, 21 lines, standard MIT text, `Copyright (c) 2026 Leonxlnx`. Confirmed by full read.

# SPDX ID

`MIT` — also independently confirmed in `.claude-plugin/plugin.json:11` (`"license": "MIT"`) and referenced in `README.md:52,227-229` (`[MIT License](LICENSE)`).

# Notice requirements

MIT requires: "The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software." That is the only obligation — no attribution-in-UI requirement, no share-alike, no patent grant/retaliation clause, no trademark grant (the README's own disclaimer separately states the project has no official token/coin and that using the author's name/image for one is unaffiliated — not a licence term, just a scam-disclaimer).

# What we may copy verbatim vs. must re-express

Per this repo's own hard rule (`CLAUDE.md`, project instructions): "kun fire kilder må videredistribueres — taste-skill + ui-ux-pro-max (MIT), frontend-design + impeccable (Apache 2.0)." `taste-skill` is confirmed on that allow-list and is MIT, so it is legally redistributable with the copyright+permission notice retained.

That said, the task instructions for this specific autopsy are explicit and independent of the licence's legal permission: **quote at most a line or two to make a point, re-express everything else in our own words, do not redistribute long verbatim passages.** This document follows that instruction regardless of what MIT would technically allow, because the deliverable is a rebuild-by-understanding, not a fork.

Concretely, for the SiteSmith rebuild:

- **Facts are free to reuse outright, re-verified rather than copied:** install commands (`npm install @fluentui/react-components`, etc., Appendix A) and canonical doc URLs (Appendix B) are objective facts about third-party packages, not the source's creative expression. Copying a package's own install command isn't "redistributing taste-skill" in any meaningful sense — but versions drift, so re-verify at rebuild time rather than trusting the vendored snapshot.
- **The rule *shapes* (ban+override pattern, design-read-first ordering, redesign-mode detection, dial vocabulary minus the lookup tables) are exactly the kind of mechanism this task asks us to reverse-engineer and re-express in our own words** — that is what `MECHANISMS.json`'s `sitesmithForm` field does throughout this autopsy.
- **The specific named bans and enumerated lists** (exact hex codes for the banned premium-consumer palette, the specific serif rotation pool, the specific em-dash phrasing) can be paraphrased and re-derived rather than copied line-for-line — SiteSmith should decide its own specific ban list based on its own observed failure modes, informed by but not transcribed from this source.
- **Do not copy:** the fixed-template skills' literal hex/token values (`minimalist-skill`, `soft-skill`, `brutalist-skill`, `gpt-tasteskill`'s `#f9fafb`/`rounded-[2.5rem]` specifics) — not because of licence risk (MIT permits it) but because these are exactly the mechanism rejected in `MECHANISMS.json:fixed-aesthetic-template-skills`: copying them would import the house-style problem directly into SiteSmith.

# Bottom line

No licence risk for anything in this repo — it is fully MIT and on this project's own pre-approved allow-list. The constraint that matters here is the task's own re-expression instruction, not a legal one.
