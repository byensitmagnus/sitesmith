---
title: Licence notes — orchestration sources
ai_generated: "(C)"
---

# Licence notes

All four sources in this group are MIT-licensed, confirmed against each
repository's `LICENSE` file:

| Source | Licence file | Copyright line |
|---|---|---|
| agency-agents (msitarzewski/agency-agents) | `LICENSE` | MIT License, Copyright (c) 2025 AgentLand Contributors |
| ruflo (ruvnet/ruflo) | `LICENSE` | MIT License, Copyright (c) 2024-2026 ruvnet |
| awesome-claude-code-subagents (VoltAgent) | `LICENSE` | MIT License, Copyright (c) 2025 VoltAgent |
| graph-engineering (codejunkie99/graph-engineering) | `LICENSE` | MIT License, Copyright (c) 2026 codejunkie99 |

MIT permits redistribution with attribution and notice. Per the project's own
hard rule (`CLAUDE.md`), text may be redistributed with notice from these four
sources — unlike the previously-audited `website-builder-setup` (no licence)
and `redesign-skill` (no traceable authorship), which must never be copied.

Per this project's convention, none of the four sources are quoted verbatim
in `OVERVIEW.md`, `MECHANISMS.json`, or `VERDICT.md` beyond the single explicit
short quotation from `ruflo/SKILL.md:21` ("Do NOT suggest ruflo for one-shot
edits, simple bug fixes, or tasks a single agent can complete in one turn — the
orchestration overhead isn't worth it.") — reproduced because it is the source's
own explicit scope disclaimer and directly supports the reject verdict for that
mechanism. All other mechanism descriptions are written in this report's own
words with line-range citations back to the source file for verification.

If any adopted mechanism (finish-gate design contract, persona walkthrough,
fresh-context review, design-bridge checklist) is implemented in SiteSmith's
skill files, attribute it in that file's history/changelog as adapted from the
named MIT source, consistent with how `taste-skill` and `ui-ux-pro-max`
attribution is already handled elsewhere in this repo's `LICENSE-AUDIT.md`.
