---
title: FAILURE-MODES — ponytail
ai_generated: "(C)"
---

# The distribution surface is its own over-build

13 platform-adapter directories (`.agents .claude-plugin .clinerules .codex-plugin .cursor
.devin-plugin .kiro .openclaw .opencode .qoder .qoder-plugin .windsurf` + `.github/`) plus
`ponytail-mcp/`, `pi-extension/`, and 6 hook files (788 lines) exist to put ~1,700 tokens of prose
in front of ~20 different agent hosts. `scripts/check-rule-copies.js` exists solely because this
duplication makes 7+ copies of the same text driftable. This is real complexity, self-inflicted by
supporting every host that exists rather than the ones a given project actually uses — the same
shape of mistake as SiteSmith's own 630k-token package, just relocated from "the model's reasoning"
(where SiteSmith over-built) to "the delivery mechanism" (where ponytail over-built). See
`MECHANISMS.json` → `cross-platform-portability-plumbing`.

# One duplicate copy of the core text is *not* drift-checked

`hooks/ponytail-instructions.js:43-75` hardcodes a ~30-line JS-string paraphrase of
`skills/ponytail/SKILL.md`, used only when the real file fails to read. `check-rule-copies.js`
byte-compares `AGENTS.md` against 7 rule-file copies and substring-checks 8 invariant phrases —
but it does not check this fallback string at all. It is dead code in the common path, so it is
easy to forget, and nothing would catch it silently going stale. See `MECHANISMS.json` →
`hardcoded-fallback-duplicate-of-skill-text`.

# The intensity-mode filter is a second, fragile parsing layer over the same prose

`ponytail-instructions.js:11-41` (`filterSkillBodyForMode`) line-filters the SKILL.md body to strip
table rows and worked examples that don't match the active mode, using regex matches on markdown
table syntax (`^\|\s*\*\*(.+?)\*\*\s*\|`) and worked-example syntax (`^-\s*([^:]+):\s*"`). The code
comments acknowledge this is fragile: an ordinary rule bullet that happens to start with a word
that is also a mode name would be silently misclassified, which is why the second regex requires a
trailing quote. This is a mechanical parser bolted onto a document that is supposed to be prose —
exactly the kind of "move a decision into a script" pattern the SiteSmith rebuild should be
suspicious of, even though its blast radius here is small (formatting only, not decision content).

# Two benchmark generations, cost model changes between them, easy to misquote

The repo carries both the original single-shot benchmark (80-94% less code, promptfoo-based,
counts whole-answer lines including prose) and the later agentic benchmark (54% mean, git-diff
lines only). `benchmarks/README.md:106-108` explicitly warns that "cost reflects single-shot
calls... per-session cost can come out higher or lower than these numbers," and that a separate
measured A/B (issue #121) found ponytail can *raise* tool calls and cost on completion-forced
tasks. A casual reader citing only the headline README number ("~54% less code ... 20% cheaper")
without this caveat would overstate the claim — the source itself is careful, but the caveat lives
several paragraphs down from the bold headline.

# The `ponytail:` comment convention has no enforcement, only harvesting

Nothing detects an *unmarked* corner cut — `ponytail-debt` can only harvest shortcuts that were
already tagged (`skills/ponytail-debt/SKILL.md:11-13`). A model (or a distracted human) that
simplifies without leaving the comment produces silent, unlisted debt indistinguishable from a
change that was simply careful. The mechanism audits discipline, it does not create it.

# Independent benchmarks show the effect is genuinely workload-dependent

`benchmarks/README.md:73-88` links two independent, non-`ponytail`-team benchmarks. One
(RicardoCostaGit) found "leaner output but higher process cost (more tool calls/tokens) on large
completion-forced tasks." The repo's own conclusion states plainly that ponytail's LOC cut runs
"from ~0% (irreducible backend CRUD) to -94% (date picker)" — i.e., the mechanism's value is
concentrated in tasks with a genuine over-build trap and can be neutral-to-negative elsewhere. Any
reuse of this mechanism in SiteSmith should not assume a flat savings number applies to every task.
