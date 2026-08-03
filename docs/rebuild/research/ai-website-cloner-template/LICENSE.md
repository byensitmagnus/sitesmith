---
title: LICENSE — ai-website-cloner-template
ai_generated: "(C)"
---

# Licence file present

`LICENSE` (25 lines) is present at the repo root: the full, unmodified MIT License text, copyright
"(c) 2025 JCodesMore" (`LICENSE:3`). `package.json` also declares `"license": "MIT"`
(`package.json:6`), and the README badge confirms it (`README.md:3`). No NOTICE file, no separate
attribution file — MIT does not require one.

# SPDX identifier

`MIT`, confirmed in three independent places (`LICENSE:1`, `package.json:6`, `README.md:3`) — no
ambiguity here, unlike some sources where the SPDX id has to be inferred from license body text
alone.

# Terms

MIT is permissive with minimal obligations (`LICENSE:5-13`):

- Permission is granted, free of charge, to use, copy, modify, merge, publish, distribute,
  sublicense, and/or sell copies, without restriction (`LICENSE:5-8`).
- The **only** condition: "the above copyright notice and this permission notice shall be included
  in all copies or substantial portions of the Software" (`LICENSE:11-12`).
- No warranty, no liability (`LICENSE:14-19`) — standard MIT disclaimer, no modification.

Unlike Apache-2.0 (see `frontend-design/LICENSE.md` for comparison), MIT has:
- No explicit requirement to mark modified files as changed.
- No patent grant clause.
- No NOTICE-file propagation requirement (there is no NOTICE file to propagate).

# What we may copy verbatim vs. must re-express

Per this repo's own hard rule (project `CLAUDE.md`: only `taste-skill`/`ui-ux-pro-max` (MIT) and
`frontend-design`/`impeccable` (Apache-2.0) may be redistributed) — `ai-website-cloner-template` is
supplied here as a **research source only**, not one of the four licensed-for-redistribution
sources. The task framing ("MIT/Apache: text may be redistributed with notice") governs this
specific analysis pass, but the project's own hard rule is the tighter, controlling constraint for
what actually ships in the rebuilt SiteSmith skill:

- **Legally permitted under MIT, with attribution:** verbatim reproduction of any part of `SKILL.md`,
  `AGENTS.md`, or the sync scripts, provided the MIT copyright notice and permission text travel with
  the copy.
- **Project convention (the tighter constraint):** re-express every mechanism catalogued in
  `MECHANISMS.json` in original prose describing the same *technique*, rather than copying `SKILL.md`
  sentences into the rebuilt skill — this source is not on the four-source redistribution allowlist,
  so nothing from it should ship as literal copied text in SiteSmith regardless of what MIT itself
  would permit.
- **If any verbatim fragment is ever retained** (e.g., quoting the exact wording of the
  "150 lines" rule or the "foreman walking the job site" framing, as this research does under
  short-quote-with-attribution): the MIT copyright notice and permission statement must accompany
  that fragment per `LICENSE:11-12`.
- **Do not use:** "JCodesMore" or the project name as branding in describing our own derived
  mechanism — MIT grants no trademark rights, only copyright permission.
