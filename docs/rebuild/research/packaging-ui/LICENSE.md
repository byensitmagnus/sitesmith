---
title: "Licence status — packaging/UI sources"
ai_generated: "(C)"
---

# Licence status

| Source | Licence (as verified) | Redistribution | Evidence |
|---|---|---|---|
| agent-elements-21st | MIT | Text may be redistributed with notice | `LICENSE:1-3` — "MIT License / Copyright (c) 2026 21st.dev" |
| remotion-skills | None | **Forbidden** — read for understanding only | No LICENSE file found in the checkout; per task instruction, treated as all-rights-reserved |
| magic-21st | ISC | **Forbidden** by task instruction despite permissive licence text | `package.json:35` — `"license": "ISC"`. Task brief marked this source "ISC-unverified... LICENCE FORBIDS COPYING" — licence field is now verified as ISC, but the no-copying instruction from the task is followed regardless, since ISC still requires attribution/notice handling this autopsy was not scoped to perform |
| website-builder-setup | None | **Forbidden** — read for understanding only | No LICENSE file among the two files in the repo |

## What this autopsy did

- **agent-elements-21st:** quoted short structural facts (component names,
  file paths, line-range citations) and one short verbatim phrase
  ("always import from the exact file, never a barrel" — paraphrased, not
  quoted verbatim, in OVERVIEW.md/MECHANISMS.json) is under 15 words and
  attributed; this is MIT-licensed text and redistribution is permitted with
  notice, which this document provides via source/path citations throughout.
- **remotion-skills, magic-21st, website-builder-setup:** every mechanism
  description in OVERVIEW.md, MECHANISMS.json, and VERDICT.md was written in
  this autopsy's own words. No verbatim text longer than a few words was
  reproduced from any of the three, no closely-paraphrased structure was
  copied, and no file layout, prose sequence, or heading structure was
  mirrored. Where a file's exact content mattered as evidence (e.g. the "load
  [Remotion Maps](./remotion-maps/REFERENCE.md)" link syntax, or the shell
  commands `npm install -g uipro-cli`), only the minimal literal fragment
  needed to identify the mechanism precisely was cited, with a path/line
  reference so the fragment can be checked against the source directly rather
  than trusted on paraphrase alone.

## Consequence for SiteSmith

Nothing from remotion-skills, magic-21st, or website-builder-setup may be
copied into SiteSmith's own skill text, even in adapted/paraphrased form
close to the original. Where this autopsy recommends adopting a *structural
idea* from remotion-skills (the router-file pattern; see VERDICT.md), that
idea must be re-implemented in SiteSmith's own words and file layout — not
by copying or lightly editing any remotion-skills file. agent-elements-21st
content may be reused with attribution to 21st.dev under MIT terms if a
future decision brings any of it into SiteSmith directly, but per VERDICT.md
no such reuse is currently recommended, since the components are out of
scope for ordinary websites.
