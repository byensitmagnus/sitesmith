---
title: Blind review protocol and status
status: not-executed-for-upstream
ai_generated: "(C)"
---

# Blind review

## What the engine implements

- Separate critic function from generator
- Randomised candidate order
- Opaque `L1/L2/L3` labels
- No generator scores in critic input
- Tie and reject-all outcomes
- User choice required (adjudicator only with explicit `--adjudicate`)

Independence claim: **context-isolated** only.

## Upstream blind panel

**Not executed.** No two-reviewer scores, agreement matrix, or source-hidden portfolio exists for the four upstreams + SiteSmith.

## SiteSmith-only critic smoke

Engine critic returns tie/reject-all/advisory without auto-selecting a winner unless the user chooses a blind id. See per-run `engine-result.json` under `runs/`.
