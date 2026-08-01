---
title: "UI/UX Pro Max — Licence"
ai_generated: "(C)"
---

## Verified facts

- Root `LICENSE` file present, full text read directly (not assumed from the repo brief).
- Text is the standard MIT License template. Copyright line: `Copyright (c) 2024 Next Level
  Builder`. No SPDX identifier string literally present in the file (MIT licenses typically don't
  include one inline), but the text is byte-for-byte the canonical MIT License wording, so the
  correct SPDX identifier is **`MIT`**.
- Matches the task brief's stated `licence: MIT` exactly — cross-checked, not taken on faith.
- `.claude/skills/ui-styling/LICENSE.txt` (a *sibling* skill in the same repo, out of scope for this
  autopsy) is a **separate** file and was not read for this report; do not assume it carries the
  same terms without checking independently if that skill is evaluated later.

## Notice requirements

MIT requires: *"The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software."* Practically: if we copy verbatim code or data
files (not recommended per the task's own instructions, and not recommended by SiteSmith's project
`CLAUDE.md` either, which limits verbatim reuse to four named upstream sources), the copyright
notice must travel with that copy. Re-expressing the *ideas* (BM25 retrieval shape, the
zero-result-honesty instruction pattern, the Master+Overrides persistence pattern, the design-review
7-phase structure) in our own words carries no notice obligation — ideas and mechanisms are not
copyrightable; the specific CSV data rows and the specific Python/Markdown text are.

## What we may copy verbatim vs. must re-express

**May copy verbatim (MIT permits it, notice attached):** none of it is being copied verbatim by
this report or recommended for verbatim copying into SiteSmith, per this task's explicit
instructions ("Do NOT copy long verbatim passages... quote at most a line or two"). MIT would
*legally* permit verbatim reuse of the CSV data, the Python scripts, or the reference markdown with
attribution — but SiteSmith's own `CLAUDE.md` policy is narrower: it names four specific upstream
sources it has cleared for verbatim reuse (`taste-skill`, `ui-ux-pro-max`, `frontend-design`,
`impeccable`) and this repo (`ui-ux-pro-max`) **is** one of the four. So verbatim reuse of small,
clearly-attributed snippets (e.g. a single CSV row as an example, a short rule from
`pro-rules.md`) would be permitted under both MIT and the project's own policy, provided the MIT
notice is preserved wherever the copied text lands.

**Must re-express (this report's own choice, tightened beyond what MIT requires):** the CSV
databases in bulk (they are the artifact most directly responsible for the house-style risk
identified in `FAILURE-MODES.md` and `MECHANISMS.json` — copying them forward would import the
sameness problem, not just a licensing question), the design-system generator's logic, and the
`SKILL.md` workflow prose — all summarized/paraphrased above and in the other files in this folder,
not reproduced.

## Bottom line

No licensing blocker. MIT is one of SiteSmith's four cleared verbatim-reuse sources. The reasons to
re-express rather than copy are about avoiding the house-style/mechanical-creativity failure modes
this source exhibits, not about legal risk.
