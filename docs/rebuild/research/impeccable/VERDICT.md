---
title: "Impeccable — Verdict"
ai_generated: "(C)"
---

## The single most valuable thing to steal

The **forced-index direction roll** (`skill/scripts/concept-seed.mjs`): let the model do 100% of the creative derivation (its own grounded shortlist of directions), then use a cheap, non-generative external tie-breaker — a hash-forced non-top-ranked index — to keep it from always shipping its own argmax. This is the one mechanism in the repo aimed squarely, deliberately, and by measurement (30/35 identical concepts across 16 framings when left unassisted) at the exact failure this project's brief names: three independently briefed sites converging on the same five moves. It passes the C-no-mechanical-creativity test cleanly because the script never proposes an idea — it only vetoes the convergent choice — and it is cheap and reproducible without needing the private catalog/API half of the mechanism to work.

Runner-up worth stealing alongside it: the paired **craft-floor ban list + deterministic detector** (`craft-floor.md` + `cli/engine/registry/antipatterns.mjs`), because it attacks the *same* sameness problem from the opposite end — not "pick a different idea" but "don't reach for the same dozen surface habits regardless of idea" — and the detector half is genuine, cheap, reusable static analysis that never has to touch model context.

## The single most dangerous thing to copy

The **prose-only guardrail pattern**: mandatory disclosure banners, "derived not felt" dispositions, "no authority to soften it" instructions — none of it is code-enforced, all of it is the model policing itself, and the repo's own admitted failure ("the last two live sessions shipped five kickers past a reviewer that never looked") proves this class of guardrail silently fails in production. If SiteSmith copies the *shape* of these bounded-loop/isolation mechanisms without also building at least a lightweight structural check (e.g. actually verifying a banner or disposition token is present in the output before proceeding, not just instructing the model to produce one), we'd inherit the same false sense of safety the source repo demonstrably has.

A close second danger: porting the exact craft-floor ban list (specific font names, specific palette descriptions) as if it were durable truth. It's a correct snapshot of one moment's AI-tell aesthetic and will need continuous re-curation — copying it wholesale without a maintenance plan just relocates the staleness risk into our own repo.

## One-line verdict

Impeccable's real contribution is architectural, not aesthetic: force selection externally while leaving all generation to the model, verify in hard-bounded fresh-eyes passes instead of open loops, and document only from the shipped artifact — steal that shape, rewrite the content, and don't trust its prose-only enforcement to actually hold.
