---
title: ROUTING — sitesmith-current autopsy
ai_generated: "(C)"
---

# How it picks a path

## Two questions, fixed order (SKILL.md:24-46)

**1. Which mode is this page?** A lookup table of three rows (Marketing / E-commerce / Product
UI), each keyed to "the visitor is [doing X]" plus one file to open. Explicitly decided **per
page, not per project** — SKILL.md:28 gives the canonical example: "a shop's About page is
marketing and its order admin is product UI. One design system across all of them." There is no
scoring function; the model reads the three one-line descriptions and picks.

**2. Which task is this?** A second lookup table of five rows (SETUP / NEW / REDESIGN /
COMPONENT / AUDIT), each mapped to a situation description ("Empty directory, no frontend
stack" / "'Build a site / page / portfolio'" / "Existing code, 'redesign / make it better'" /
etc.) and a starting file. Again no scoring — the situations are meant to be mutually
recognisable from the user's request.

Only the `stack` step (detecting Next.js/React-Vite/Astro) is a scripted decision:
`scripts/stack-router.mjs detect . --write` inspects project files and writes one adapter to
`.sitesmith/STACK.md` (PIPELINE.json:110-117). This is the one routing decision in the whole
system that is mechanical rather than judgement-based, and it is scoped narrowly (which
implementation adapter, not which design mode).

## What signals are used

- **Mode routing**: what the page is *for*, expressed as "the visitor is [deciding whether to
  care / deciding whether to buy / already committed and working]" — a task-oriented signal, not
  a URL pattern, page name, or content-type heuristic.
- **Task routing**: the state of the repository (empty vs existing code) plus the literal
  phrasing of the user's ask ("build a site" vs "redesign" vs "review this UI").
- **Stack routing**: file-system evidence only — `stack-router.mjs` inspects "project files" per
  PIPELINE.json:117 (framework config files, dependency manifests) and explicitly favours an
  established stack: "An established stack is a decision already made. Adopt it"
  (PIPELINE.json:107). Next.js and Astro are stated to outrank an optional React dependency
  co-installed alongside them (SKILL.md:29, PIPELINE.json:117) — i.e. a fixed precedence rule for
  one specific ambiguous case (a Next.js or Astro project that also has `react` in
  `package.json`), not a general confidence score.

## What happens on ambiguity

- **Mode ambiguity**: no formal tie-break mechanism exists. The routing table is a lookup, not a
  classifier with a confidence score or a fallback rule for a page that is genuinely split
  between two visitor intents (e.g. a pricing page that is part-marketing, part-configurator).
  This is a real gap — see FAILURE-MODES / MECHANISMS (`mode-based-routing-not-defaults`).
- **Stack ambiguity**: PIPELINE.json:117 states the router "reports an unknown or ambiguous
  stack instead of guessing" — i.e. the one place routing IS mechanical, ambiguity produces an
  explicit failure/report rather than a silent default. This is the opposite failure mode from
  the direction-candidate search (which silently defaults to `"style"` domain on no keyword
  match, per `core.py:201-221`) — the two routers in this repo disagree on how to handle "I
  don't know," and the stack router's fail-loud behaviour is the better pattern.
- **Domain-detection ambiguity (BM25 search)**: `core.py:detect_domain()` scores a query against
  11 fixed keyword lists and returns whichever domain scores highest, defaulting to `"style"` if
  every domain scores zero (core.py:219-221). This is a silent, un-flagged fallback — the
  opposite of the stack router's explicit "report ambiguous" behaviour, and worth noting as an
  inconsistency to fix rather than inherit.

## Assessment for the rebuild

The two-question, ordered, judgement-based mode/task router is simple and legible — worth
keeping as a pattern (ask "what kind of page" before "what kind of task," per-page not
per-project). The one place this repo does mechanical routing (stack detection) correctly fails
loud on ambiguity; the one place it does mechanical routing badly (BM25 domain detection)
silently defaults. If any mechanical routing is kept in the rebuild, adopt the fail-loud pattern
uniformly.
