---
title: "Impeccable — Good Patterns"
ai_generated: "(C)"
---

Evidence-first: every claim below cites a file:line.

## 1. Selection is forced externally; generation stays entirely with the model

`skill/scripts/concept-seed.mjs:1-73` (comment block), `:290-303` (buildIndex math). The model derives its own grounded candidate list from cultural/product research — the script never proposes an idea. It only SHA-256-hashes a session key to force a non-top-ranked index (3..7) so the model can't ship its own argmax every time (`concept-seed.mjs:16-21,295`). Re-rolls exclude everything shown in prior rounds (`concept-seed.mjs:473-477`). This is the cleanest example in the repo of a mechanism that fights convergence without moving creative judgment into a script — squarely the right side of the brief's C-no-mechanical-creativity axis.

## 2. A "refuse list" framed as defaults-to-override, not absolute style

`skill/reference/craft-floor.md:18-48`. Gradient text, hero-metric templates, same-size icon+heading+text cards, glassmorphism, side-stripe borders, bounce easing — all named, all explained in one line each, and explicitly scoped as "the category's defaults, not bans: the brief's own words can earn any of them" (line 20), with only a couple of true hard bans called out separately (eyebrow labels, line 26). Short (55 lines), loaded once right before editing, cheap.

## 3. Deterministic linting kept entirely out of the model's reasoning path

`cli/engine/registry/antipatterns.mjs:1-140` (59 named rules), `skill/scripts/detect.mjs:1-21` (the 21-line shim the skill actually calls). The 5,580-line rule-matching implementation (`cli/engine/rules/checks.mjs`) never has to enter a model's context — it's a Bash tool call returning JSON. This is the correct architecture for anything mechanical: keep it as code, not prompt.

## 4. Isolation is a hard invariant with a mandatory failure disclosure

`skill/reference/critique.md:5-9`. Two sub-agents (LLM design review vs. detector+browser evidence) "MUST run as two isolated sub-agents" and "running them inline... is NOT permitted... is a degraded run." Crucially, degradation is not silently allowed — "If you degrade for any reason, the report's first line MUST be a banner: `⚠️ DEGRADED: single-context (<reason>)`. A silent degraded critique is a failed critique" (lines 8-9). This pattern — hard invariant + mandatory disclosure on fallback — is reusable well beyond critique.

## 5. A bounded, evidence-scored finish loop instead of open-ended self-QA

`skill/agents/impeccable-finish-reviewer.md:38-48`. The reviewer's disposition (`rebuild`/`fix`/`ship`) is explicitly "derived, never felt" and calibrated "against the approved comp and the world's quality bar, never against the effort visible in the build" (line 40). Material fixes are capped at 8, ordered most-material-first. A verdict pass after one fix batch scores each fix `resolved/partial/unresolved` against the recaptured screenshot, not the parent's narration of what it fixed ("The parent's narration of what was fixed is not evidence", line 48). Two rounds, full stop.

## 6. Documentation written from the artifact, never from intention, with an explicit anti-canonization check

`skill/agents/impeccable-documenter.md:17,30-31`. "Ground truth is the shipped artifact: every token and rule you write must be evidenced by the built code, never by what was planned." And separately: "an element the floor bans... is recorded in your not-canonized line as a defect the build carries, never as a design-system rule for future surfaces to inherit" — citing a real observed failure where a documenter had previously written banned kickers into DESIGN.md, turning one mistake into house style. This is a direct, named defense against the exact failure mode C-no-house-style warns about.

## 7. A per-surface "mode" vocabulary that a script never touches

`skill/SKILL.src.md:31-40`. Persuade / Operate / Read / Experience, chosen "from the requested surface, not the product." This is judgment work correctly left to the model — cheap, clear, and it improves fit without constraining the actual visual choices within a mode.

## 8. "Visual authority is evidence, not a filename"

`skill/SKILL.src.md:29`, `skill/reference/new-work.md:5-14`. A missing DESIGN.md never licenses inventing a new look on a codebase that already has one; the code itself is read as evidence before any preserve/redesign decision is made. Cheap, sharp, and closes an obvious hole (LLM sees no metadata file, assumes greenfield, redesigns a branded product uninvited).

## 9. Never-auto-run routing recommendation

`skill/reference/routing.md:1-19`. The no-argument path gathers cheap real signals (git dirty files, dev-server running, existing critique score) and reasons over them to *suggest* 2-3 commands, but "Never auto-run a command; the recommendation is a suggestion the user confirms" is stated as an explicit, repeated rule. Preserves user agency without sacrificing a helpful default.
