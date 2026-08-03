---
title: CONTEXT-STRATEGY — ponytail
ai_generated: "(C)"
---

# Baseline load: one filtered file, always on

Every session start injects exactly one thing: `skills/ponytail/SKILL.md` (120 lines), stripped of
YAML frontmatter and filtered to the active intensity level (`hooks/ponytail-instructions.js:11-41,
77-91`). At `full` (the default), the filter removes only the `lite`/`ultra` table rows and worked
examples — in practice the injected text is close to the full 120 lines every time. There is no
tiered/progressive loading of *content* here: it is one document, always fully present, just
trimmed by ~10-15 lines depending on mode.

# The five companion skills are load-on-invocation, not always-on

`ponytail-review`, `-audit`, `-debt`, `-gain`, `-help` (41-71 lines each) are separate skill files
loaded only when their slash command fires, not injected every turn alongside the core ruleset.
This is the one clear progressive-loading boundary in the package: baseline reasoning content is
always-on and small; task-specific tooling (review/audit/debt/scoreboard) is opt-in and loaded on
demand.

# Reference material (platform-native table) is documentation, not injected context

`docs/platform-native.md` (212 lines, 7 domain sections) is never injected by any hook — it exists
as a document a maintainer or a model consulting the repo directly might read, but the runtime
context-injection path (`ponytail-instructions.js`) never touches it. Its content lives implicitly
inside the model's own training knowledge (native APIs) rather than being paid for as context on
every turn. This is a genuinely proportional choice: a 212-line lookup table would roughly
double the always-on context cost for information the ladder only needs at rung 4, occasionally.

# Subagents get the same context, filterable by a regex escape hatch

`PONYTAIL_SUBAGENT_MATCHER` lets an installer exclude specific subagent types (e.g. read-only
search agents) from re-injection via `hooks/ponytail-subagent.js`, tested against `agent_type`
(README.md:255). Unset means inject into every subagent by default — the mechanism defaults to
maximum context propagation and lets the installer narrow it, rather than defaulting narrow and
requiring opt-in broadening.

# What this means for SiteSmith

The transferable shape is: **one small always-on reasoning file + several small load-on-demand
task skills + reference material that stays outside the injected path entirely**. SiteSmith's own
equivalent would be a compact always-on build-discipline core, separate load-on-demand audit/review
passes, and any native-platform-equivalents table (CSS-first knowledge) kept as documentation the
model draws on rather than context that is paid for every turn.
