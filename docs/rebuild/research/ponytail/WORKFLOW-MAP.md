---
title: WORKFLOW-MAP — ponytail
ai_generated: "(C)"
---

# Runtime flow (Claude Code / Codex host)

```
SessionStart
  └─ hooks/ponytail-activate.js
       ├─ getDefaultMode() → reads PONYTAIL_DEFAULT_MODE env / ~/.config/ponytail/config.json
       │   (hooks/ponytail-config.js)
       ├─ if mode == "off": clearMode(), exit                       (activate.js:27-32)
       ├─ else: setMode(mode) → writes flag file for statusline      (activate.js:34-39)
       ├─ getPonytailInstructions(mode) → reads skills/ponytail/SKILL.md,
       │   strips frontmatter, filters intensity-table rows/examples
       │   to the active mode                                        (ponytail-instructions.js:11-41)
       └─ emits filtered ruleset as hidden SessionStart context       (activate.js:92-96)

UserPromptSubmit (every turn)
  └─ hooks/ponytail-mode-tracker.js
       ├─ parses prompt for /ponytail[-review|-audit|-debt|-gain|-help] [lite|full|ultra|off]
       ├─ /ponytail default <mode>  → persists to config, does NOT switch this session (mode-tracker.js:38-45)
       ├─ /ponytail <mode>          → session-scoped switch, confirmation echoed          (:64-76)
       ├─ "stop ponytail"/"normal mode" → clearMode(), deactivated                        (:85-89)
       └─ Qoder-only: no SessionStart event, so this hook also does first-prompt activation (:96-113)

PreToolUse (Task/subagent spawn)
  └─ hooks/ponytail-subagent.js — re-injects the same ruleset into subagent context,
       filterable via PONYTAIL_SUBAGENT_MATCHER regex on agent_type (README.md:255)
```

# One-shot skill invocations (no persistent mode change)

```
/ponytail-review   → diff-scoped scan, tags: delete/stdlib/native/yagni/shrink, "net: -N lines"
/ponytail-audit    → same tags, whole-repo scope instead of diff
/ponytail-debt     → grep for `ponytail:` comment markers → ledger, flags "no-trigger" rot risk
/ponytail-gain     → static scoreboard from published benchmark medians, refuses per-repo numbers
/ponytail-help     → command reference
```

Each is declared "one-shot" and "changes nothing" in its own SKILL.md boundary section — there is
no shared state machine between them; each re-reads the ruleset fresh.

# Non-Claude-Code hosts (instruction-only fallback)

For ~13 hosts with no plugin/hook system (Cursor, Windsurf, Cline, Kiro, Amp, Jules, Junie …), the
entire flow above collapses to: host auto-loads `AGENTS.md` or a per-host rule file at session
start, no mode switching, no statusline, no subagent re-injection (`README.md:256-271`). This is
the ceiling of what a pure-prose skill can do without any host cooperation — relevant because
SiteSmith, as a single Claude Skill, sits exactly at this ceiling already.

# Build-time flow (repo maintenance, not runtime)

```
scripts/check-rule-copies.js  → byte-compares AGENTS.md against 7 per-host rule copies;
                                  substring-checks 8 "invariant" phrases survive in SKILL.md + AGENTS.md
scripts/build-openclaw-skills.js → regenerates .openclaw/skills/ from skills/, test suite fails if stale
node --test tests/*.test.js   → 14 test files exercise hook JSON I/O, plugin manifests, LOC/behavior gates
```
