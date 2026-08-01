---
title: "Impeccable — License"
ai_generated: "(C)"
---

## Licence file present

Yes. `LICENSE` at repo root — full Apache License 2.0 text, copyright line: "Copyright 2025 Paul Bakaus." Confirmed as SPDX `Apache-2.0` in `package.json` (`"license": "Apache-2.0"`). `skill/SKILL.src.md:9` frontmatter also states `license: Apache 2.0` on the skill itself.

## SPDX ID

`Apache-2.0`. Matches the brief's own list of the four sources cleared for reuse (taste-skill + ui-ux-pro-max under MIT, frontend-design + impeccable under Apache-2.0).

## Notice requirements

`NOTICE.md` exists and is short — it discloses exactly one derivative inclusion:

> `skill/reference/ios.md` and `skill/reference/android.md`... distilled from ehmo's `platform-design-skills`... rewritten in Impeccable's voice. Original license: MIT. Author: ehmo.

Per Apache-2.0 §4(d), a NOTICE file's attribution content must be preserved in redistributions "within such NOTICE file, excluding those notices that do not pertain to any part of the Derivative Works." Since we are not redistributing Impeccable's files verbatim (we are re-expressing mechanisms, per this task's rules), the operative obligation for our own repo is narrower: if we ever quote or closely paraphrase Impeccable's own text, §4(a)-(c) requires we (a) give recipients a copy of the Apache-2.0 license, (b) mark any files we modified as changed, and (c) retain copyright/attribution/NOTICE content from the original in any of our own NOTICE-equivalent file. We are not currently doing either (we're re-expressing mechanisms in our own words per the task brief), so no obligation is triggered by this research pass itself — but if SiteSmith's shipped skill later ports any of Impeccable's literal wording (not just the mechanism), that quote and its provenance must be attributed the same way our existing `LICENSE-AUDIT.md` covers the other three cleared sources.

## What we may copy verbatim vs. must re-express

- **Apache-2.0 permits verbatim copying** of Impeccable's own code/prose with attribution (this is a permissive licence, not copyleft) — so verbatim reuse would be legally fine with proper NOTICE credit.
- **This task's own rules are stricter than the licence requires**: "Do NOT copy long verbatim passages from the source into our repo — quote at most a line or two... We re-express, we do not redistribute." All files in this delivery follow that instruction: quotes in `GOOD-PATTERNS.md` and `FAILURE-MODES.md` are single short phrases with file:line citations, not reproduced blocks; `MECHANISMS.json`'s `mechanism`/`whyItWorks` fields are written in our own words describing what the code does, not copied prose.
- **What we may NOT copy regardless of licence**: the `ios.md`/`android.md` content is itself a third-generation derivative (MIT-original → Impeccable's Apache-2.0 rewrite) — porting it again would require carrying forward BOTH the MIT notice (for `ehmo/platform-design-skills`) AND Impeccable's own Apache-2.0 NOTICE, a compounding attribution chain worth avoiding by simply not reusing that specific file's content directly; if SiteSmith wants native-platform guidance, author it fresh from the primary HIG/Material sources instead.

## Bottom line for SiteSmith

Impeccable (Apache-2.0) is licence-clean to draw mechanisms from, exactly as the project's `LICENSE-AUDIT.md` already lists it as one of the four permitted sources. This research file itself introduces no new licence risk: it contains no reproduced blocks of Impeccable's text, only short attributed quotes and independent re-description of mechanisms.
