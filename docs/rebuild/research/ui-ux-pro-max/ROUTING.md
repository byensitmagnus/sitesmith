---
title: "UI/UX Pro Max — Routing"
ai_generated: "(C)"
---

## Two separate routing decisions

**1. Skill-level trigger** — entirely up to the host model matching the task against the
frontmatter `description` string in `SKILL.md:3` (610 characters, listing every domain count: "84
styles, 192 color palettes, 74 font pairings..."). No code, no keyword gate; this is the same
mechanism every Claude Code skill uses.

**2. Domain routing inside the tool** — `detect_domain()` (`core.py:377-408`), used whenever
`--domain` is omitted from a `search.py` call.

## How domain routing actually works

1. A hand-written dict, `_domain_keywords()` (`core.py:352-365`), maps each of 12 domains to a
   keyword list (e.g. `color` → `["color", "palette", "hex", "#", "rgb", "token", "semantic",
   "accent", "destructive", "muted", "foreground"]`). The `product` domain's list is the odd one
   out: it's loaded **live** from `products.csv`'s own `Keywords` column at import time
   (`core.py:323-341`), not hand-maintained, specifically so it can't drift from the data it routes
   into.
2. Every keyword is regex-matched with word boundaries against the lowercased query
   (`core.py:391`); a match scores `max(1, number of words in the keyword phrase)` — multi-word
   phrases outweigh single generic words.
3. Domains are ranked by total score; ties are broken by a **fixed priority order**
   (`_DOMAIN_TIEBREAK_ORDER`, `core.py:371-374`: ux > product > style > color > typography >
   google-fonts > chart > landing > icons > gsap > react > web), not by dict/hash order, so results
   are reproducible run to run.
4. If nothing scores above 0, it silently defaults to `style` (`core.py:403`) — the one ambiguity
   case that is **not** self-reported to the caller (contrast with the zero-result-count case, which
   explicitly flags itself, `search.py:64-74`).
5. When a domain *is* auto-detected, the runner-up domain (if it also scored > 0) is surfaced in the
   result (`core.py:433-436`) and shown to the model in the formatted output
   (`search.py:56-60`: *"(auto-detected, runner-up: X)"*) — giving the model a chance to notice a
   close call and re-run with `--domain` explicit.

## What happens on ambiguity

- **Documented, known ambiguity** (`SKILL.md:137`): "font" hits both `typography` and
  `google-fonts" — the fix offered is procedural, not automatic: *"If results look off-topic, pass
  `--domain` explicitly."*
- **Undocumented, silent ambiguity**: the `style`-domain fallback when nothing scores. Nothing tells
  the model this happened; the returned rows look exactly like a normal successful `style` search.
- **Design-system generator ("Step 2") doesn't use `detect_domain` at all** — it always searches a
  fixed set of 5 domains in parallel (`product`, `style`, `color`, `landing`, `typography`,
  `SEARCH_CONFIG` in `design_system.py:38-44`), so ambiguity in that path is entirely about which
  *row* wins inside each domain (see `_select_best_match`, `design_system.py:166-201`), not which
  domain gets searched.

## Stack routing

Separate and simpler: `search_stack(query, stack)` (`core.py:442-464`) takes an explicit `stack`
string, which must be one of 22 keys in `STACK_CONFIG` (`core.py:88-111`) or it returns a
plain error listing the valid options — no auto-detection, no fuzzy matching. The model is
responsible for having detected the stack correctly in "Step 1" of the workflow (`SKILL.md:55`).
