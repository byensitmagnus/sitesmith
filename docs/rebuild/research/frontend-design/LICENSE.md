---
title: LICENSE — frontend-design
ai_generated: "(C)"
---

# Licence file present

`LICENSE.txt` (177 lines) is present in the source directory, full Apache License 2.0 text, no
modifications, no NOTICE file alongside it.

# SPDX identifier

`Apache-2.0`. The `SKILL.md` frontmatter itself only says `license: Complete terms in LICENSE.txt`
(`SKILL.md:4`) — it does not state the SPDX id inline; the id is inferred from the license text
body, which is the standard, unmodified Apache License, Version 2.0, January 2004
(`LICENSE.txt:2-3`).

# Notice requirements

Apache-2.0 §4 (`LICENSE.txt:90-129`) governs redistribution:

- Must include a copy of the license with any redistribution (`LICENSE.txt:95-96`).
- Must mark any modified files with a prominent notice that they were changed (`LICENSE.txt:98-99`).
- Must retain existing copyright/patent/trademark/attribution notices from the source form
  (`LICENSE.txt:101-105`).
- If a NOTICE file were present, its attribution contents would need to be carried into any
  derivative — but no NOTICE file exists in this source, so this clause has nothing to carry
  (`LICENSE.txt:107-122`).
- We may add our own copyright statement and different terms for our own modifications, provided
  the underlying Apache-2.0 obligations for the original Work are still met (`LICENSE.txt:124-129`).

No trademark rights are granted (`LICENSE.txt:139-142`) — we must not use "Anthropic" or
"frontend-design" branding beyond what's needed to describe provenance.

# What we may copy verbatim vs. must re-express

Per this repo's own hard rule (`CLAUDE.md`: "kun fire kilder må videredistribueres" includes
`frontend-design` under Apache-2.0) and the task instruction not to redistribute long verbatim
passages:

- **May copy verbatim, with attribution:** short structural phrases already quoted in this research
  set (e.g. the three named cliché descriptions in `SKILL.md:31`, used here only as quotes under a
  line or two per file) — Apache-2.0 permits full verbatim redistribution of the Work itself, so
  copying is legally fine; our own project rule (re-express, don't copy long passages into the
  rebuilt skill) is the tighter constraint.
- **Must re-express in our own words for the rebuilt SiteSmith skill:** all six principle sections
  (subject-grounding, hero-as-thesis, typography, structure, motion, complexity-matching,
  brainstorm/critique process, restraint, writing guidance) — these are exactly the mechanisms
  catalogued in `MECHANISMS.json`, and per project convention they get rebuilt as original prose
  describing the same *mechanism*, not copied sentences.
- **Must carry forward if we do quote/retain any source text directly:** the Apache-2.0 license
  copy itself and a changed-files notice, per §4(a)-(b) above, should we ever include unmodified or
  lightly-modified fragments of `SKILL.md` rather than a full re-expression.
- **Do not use:** "Anthropic" branding/trademark in describing our derived skill beyond factual
  attribution of provenance (`LICENSE.txt:139-142`).
