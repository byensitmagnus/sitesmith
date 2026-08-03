---
title: ROUTING — ponytail
ai_generated: "(C)"
---

# There is no stack/domain router

Ponytail is domain-agnostic by design — the same ladder applies to Python, JS, Swift, SQL, or any
other target, and `docs/platform-native.md` simply carries one lookup table per domain the model
consults if relevant. There is no code anywhere that inspects a repo and picks which subset of
rules applies; the model is trusted to recognize which rung and which native-equivalent row fits
its current language/framework. This is the opposite of a "stack router" — it is one universal
ruleset with domain-specific reference tables the model self-selects from.

# The only real "routing" is host detection, not task/domain detection

`hooks/ponytail-runtime.js` (referenced from `ponytail-activate.js:13-19` and
`ponytail-mode-tracker.js:6`) exposes `isCodex`, `isCopilot`, `isQoder` flags that change *hook
behavior* (e.g. Qoder gets ruleset injection on every `UserPromptSubmit` because it has no
`SessionStart` event, `ponytail-mode-tracker.js:91-113`). This routes *how the same content is
delivered* per host, never *what content* is delivered — content is identical everywhere modulo
the intensity-level filter.

# Mode selection is a flat enum, not a decision tree

`lite | full | ultra | off` (plus the independent `review` one-shot mode) is the entire routing
surface a user or session can select, set via slash command, env var
(`PONYTAIL_DEFAULT_MODE`), or config file (`~/.config/ponytail/config.json`) — three input paths
converging on one four-way switch (`hooks/ponytail-config.js`, referenced in
`ponytail-activate.js:24`). No cascading logic beyond "look up the mode, filter the text."

# Relevance to SiteSmith

SiteSmith's stack router (Next.js/React-Vite/Astro) has no equivalent in this source, because
ponytail solves a different problem (simplicity discipline, language-agnostic) rather than
SiteSmith's problem (which framework's idioms apply). Nothing here should be read as evidence for
or against SiteSmith's own routing layer — this source is silent on that question. The one
transferable point is negative: ponytail achieves broad applicability specifically by *not*
building a router and instead trusting the model's own domain knowledge, which is the direction of
travel if SiteSmith's router is ever found to be doing work the model could do itself.
