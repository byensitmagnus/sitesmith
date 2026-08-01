---
title: "Impeccable — Routing"
ai_generated: "(C)"
---

## Signals used

Routing is entirely model-reasoned over explicit signals; there is no scoring formula or decision tree in code. The signals, gathered by two small Node scripts:

1. **`context.mjs`** (run once per session, always first): does PRODUCT.md exist? Does DESIGN.md exist? What does the matching surface brief say? What platform is recorded (web / ios / android / adaptive)? Emits a `NO_PRODUCT_MD:` sentinel string when nothing is found — this single string is the branch signal the rest of the skill keys off (`SKILL.src.md:21`, `context.mjs:5-9`).
2. **`context-signals.mjs`** (run only for the no-argument path): `setup.hasDesign` / `setup.hasCode`, `critique.latest` (null, or a score + P0/P1 counts), `git.changedFiles`, `devServer.running`, `scan.targets` + `scan.via` (which files a subsequent `detect.mjs` pass should scan, and why they were picked: `git-changes`, `source-dir`, `html`, or `root`) (`routing.md:5-16`).

## How it picks a path

Three cases, checked in this order (`SKILL.src.md:70-77`):

1. **No argument at all** → load `reference/routing.md`, present its context-aware menu. Never auto-run anything.
2. **Explicit or clearly implied command** → load that command's own reference file (native variant if the recorded platform is ios/android/adaptive). If two commands plausibly fit, ask once.
3. **Otherwise (general design request, no named command)** → branch on whether PRODUCT.md exists:
   - Missing PRODUCT.md + it's a new surface or a replacement-world request → route through `init` first, then `new-work`.
   - Missing PRODUCT.md + it's a narrow refinement of existing code → proceed directly on the incumbent implementation as context, and merely *offer* init afterward — never block on it.

Two names are pure aliases with no independent behavior: `teach` → `init`; `craft` → an ordinary new-work request, explicitly called out as adding nothing (`SKILL.src.md:75`). After `init` writes PRODUCT.md, execution resumes without re-running `context.mjs`, and `init` itself loads the native-platform reference directly when applicable (`SKILL.src.md:77`).

## What happens on ambiguity

- **Two commands both plausibly match the request** → ask the user once, then proceed (`SKILL.src.md:73`). No silent guess.
- **No command AND no PRODUCT.md, but a clearly narrow request** ("fix the padding on this card") → does NOT force `init`; proceeds directly on the existing code, offering `init` as a follow-up rather than a blocker. This is a deliberate carve-out against a project without PRODUCT.md always being force-routed through greenfield setup (`SKILL.src.md:74`).
- **No argument, ambiguous priorities** → `routing.md` explicitly instructs "reason over the signals; there is no score to obey" and to keep the final recommendation to 2-3 picks, always ending with the full menu as a fallback (`routing.md:7,18`). The system tolerates genuine ambiguity by degrading to "show the whole menu" rather than guessing wrong.
- **`scan.targets` detector pass errors, or the tree is too large/slow** → skip it silently and recommend the user run `audit` themselves; "never block the suggestion on it" (`routing.md:16`).
- **A `CONTEXT_STALE` directive appears in `context.mjs` output** (drift between the project's Impeccable artifacts and what the current skill version reads) → reported, never auto-repaired, unless the finding is specifically marked `auto` (`SKILL.src.md:83,85`). This is a routing-adjacent ambiguity rule worth noting: staleness is surfaced but action requires either an explicit user ask or an unambiguous auto-flag, never inferred.

## Notable property: recommendation vs. execution is a hard boundary

Both the no-argument menu (`routing.md:5,18`) and the general-design-request fallback treat "what should happen next" and "do it" as two separate steps the user always gets to approve between. There is no code enforcement of this — it's a stated rule the model is expected to follow — but it is stated repeatedly and explicitly enough (three separate places: `SKILL.src.md:72`, `routing.md:5`, `routing.md:18`) that it reads as a deliberately reinforced design principle rather than an incidental phrasing.
