---
title: TESTING — ponytail
ai_generated: "(C)"
---

# Two entirely separate testing tiers, for two entirely different claims

1. **Artifact tests** (`tests/*.test.js`, 14 files, run via `node --test`): assert on the *shape* of
   shipped files — hook JSON I/O (`tests/hooks.test.js`, 462 lines), plugin manifests
   (`tests/copilot-plugin.test.js`, `tests/qoder-plugin.test.js`, `tests/gemini-extension.test.js`,
   `tests/hermes-plugin.test.js`), command registration (`tests/commands.test.js`), and package
   metadata (`tests/package.test.js`, `tests/package-scripts.test.js`). These are deterministic unit
   tests over code and config, not over model behavior.
2. **Behavioral/benchmark tests** (`benchmarks/`): measure what the *model* actually does when the
   skill is active, via promptfoo (single-shot) and a custom harness (`benchmarks/agentic/`,
   real Claude Code sessions). These cannot be deterministic unit tests because the subject is LLM
   output, so the repo instead uses (a) execution-based gates where possible, (b) an
   externally-validated LLM judge where not, and (c) repeated runs with medians (n=4 to n=30)
   instead of single-sample claims.

# Correctness is gated by execution, not estimated

`benchmarks/correctness.js` (287 lines) is a promptfoo assertion module: extracts fenced code
blocks from a model completion, and for 3 of 5 tasks (email validator, debounce, CSV sum) actually
*executes* the generated code with real assertions appended, reading pass/fail from process exit
code. The other 2 (React countdown, FastAPI rate-limit) fall back to structural/keyword regex
checks, explicitly flagged as weaker in `benchmarks/README.md:98`. `loc.js` is the paired
measurement-only metric — the repo is explicit that a metric (LOC) and a gate (correctness) are
different things and both are reported together, never LOC alone.

# The over-engineering judge is validated before it is trusted

`benchmarks/agentic/judge.py --selftest` (lines 89-137) requires the judge to rank a hand-written
over-engineered reference above a hand-written minimal one, for two different tasks, before any
real run is scored. `--run` refuses to proceed if `--selftest` fails first (line 179-181). This is
the strongest testing-methodology idea in the source: don't trust an LLM judge's verdict on real
data until you've proven it can tell known-different-quality apart.

# Drift between duplicated text is a CI-level test, not an LLM test

`scripts/check-rule-copies.js` runs as part of `npm test` implicitly via the development workflow
(README.md:300-304) and is a plain string-diff test: byte-equality on 7 host rule-file copies
against `AGENTS.md`, plus substring presence of 8 named "invariant" phrases in both `AGENTS.md` and
`SKILL.md`. It explicitly chose canary substrings over full-text equality for the `SKILL.md`
comparison because that file is longer than the compact copies and can't be byte-matched
(`check-rule-copies.js:39-43`) — a pragmatic, cheap-but-imperfect test design worth noting: it
catches wording changes to load-bearing rules, not all possible drift.

# What is NOT tested

- The core `SKILL.md` ladder's actual effect on model output is tested only via the benchmark
  harness, not via any assertion in `tests/`. There is no unit test that "the skill produces less
  code" — that claim lives entirely in the (separately reproducible, but not CI-gated) benchmark
  results.
- The hardcoded fallback duplicate in `hooks/ponytail-instructions.js:43-75` (see
  `FAILURE-MODES.md`) has no test asserting it stays in sync with `SKILL.md`.

# Relevance to SiteSmith's own testing gate

SiteSmith's `scripts/verify.mjs` (screenshots, axe, console errors, dead links, overflow) is
already in the same family as `correctness.js` — an execution-based gate rather than an LLM
self-report. The one addition worth taking from ponytail is the *validated-judge* pattern for
claims verify.mjs cannot check deterministically (house-style/genericness): require the judge to
pass a selftest on a known-generic vs. known-distinctive pair before trusting it on a real build.
