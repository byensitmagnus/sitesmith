---
title: "UI/UX Pro Max — Context Strategy"
ai_generated: "(C)"
---

## Always loaded (once the skill triggers)

Only `.claude/skills/ui-ux-pro-max/SKILL.md` itself. Everything else is explicitly deferred —
`SKILL.md` says so directly at line 18: *"The full rule text for every category lives in
`references/quick-reference.md` — read it on demand rather than loading it every time."*

Measured (character count / 4, as instructed):
- `SKILL.md`: 13,773 chars → **~3,443 tokens** always loaded when the skill activates.
- Frontmatter `description` alone (the part the host model matches against *before* deciding to
  trigger): 610 chars → **~153 tokens** — this is the true "cost of having the skill installed at
  all," paid on every turn regardless of relevance, standard for Claude Code skills.

## Conditional (read only when the workflow calls for it)

| File | Chars | ~Tokens (÷4) | Loaded when |
|---|---|---|---|
| `references/quick-reference.md` | 21,877 | ~5,469 | UX review/audit pass, or a category beyond the SKILL.md priority table (`SKILL.md:18,33`) |
| `references/pro-rules.md` | 9,694 | ~2,423 | Before delivering native/mobile app UI, or "doesn't look professional" and cause unclear (`pro-rules.md:3`) |
| `data/*.csv` (12 domain files) | ~486 KB combined (`google-fonts.csv` alone is 728 KB/1,924 rows — over half the data directory) | n/a — never read into the model's context directly | Only inside the `search.py` subprocess; the model sees only the formatted `Result N` block `search.py` prints (typically a handful of rows × ~10-20 output columns, truncated at 300 chars per field unless `--full`, `search.py:41,80-81`) |
| `data/stacks/*.csv` (22 files) | small, tens of rows each | n/a, same subprocess model | Only when `--stack <name>` is passed (`SKILL.md:139-145`) |

## Why the design matters

The CSV corpus is never loaded wholesale into the model's context window at all — it lives on disk
and is queried by a subprocess (`python search.py ...`) whose **stdout** (a short, pre-formatted
text block) is what actually enters context. This is the single most important context-efficiency
decision in the repo: a 2,989-row, ~1.2MB dataset costs the model roughly what one `search.py` call's
printed output costs (a few hundred tokens per call), not the size of the underlying data. Compare
this to a design that would try to keep style/color/typography tables in a loaded reference file —
this repo deliberately doesn't.

The tradeoff: this only works because a real Python (or Node, for `design-audit.mjs`) interpreter is
available in the run environment. If the target runtime can't shell out, this whole subprocess-based
retrieval pattern is unusable and the corpus would have to be loaded some other way (embedded
markdown tables, a smaller curated reference file, etc.) — see `MECHANISMS.json`'s
`bm25-csv-retrieval` entry for the `requiredContext` implication.
