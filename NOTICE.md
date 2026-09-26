# Third-party notices

sitesmith bundles material from four openly licensed projects in `skills/sitesmith/`. Each
Markdown reference states its source and licence inline. A whole-file copy is labelled separately
from an assembled excerpt or a modified derivative; modified files say what SiteSmith changed.
`tools/check-repo.py` enforces the attribution and change-note forms.

The complete Apache-2.0 text ships at
[`skills/sitesmith/LICENSES/Apache-2.0.txt`](skills/sitesmith/LICENSES/Apache-2.0.txt). Installed
provider bundles also carry that file and
[`THIRD-PARTY-NOTICES.md`](skills/sitesmith/THIRD-PARTY-NOTICES.md), so licences and notices do not
disappear when the skill is copied out of this repository. Exact historical commits, spans and
hashes are in [`docs/v3/LICENSE-DERIVATION-AUDIT.md`](docs/v3/LICENSE-DERIVATION-AUDIT.md).

---

## taste-skill — MIT

Source: https://github.com/Leonxlnx/taste-skill
Copyright (c) 2026 Leonxlnx

Used in: `01-brief-and-dials.md`, `02-architecture.md`, `03-design-engineering.md`,
`04-motion-and-performance.md`, `05-ai-tells.md` (all but the final section),
`08-pattern-vocabulary.md`, `09-block-library.md`.

**Changes made:** identified verbatim excerpts are assembled inside SiteSmith-authored wrappers;
`01-brief-and-dials.md` combines two upstream spans, and `05-ai-tells.md` also contains a separately
licensed frontend-design section. The seven SiteSmith files are not whole-file verbatim copies.

> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
> associated documentation files (the "Software"), to deal in the Software without restriction,
> including without limitation the rights to use, copy, modify, merge, publish, distribute,
> sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or
> substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
> NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
> NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
> DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT
> OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## ui-ux-pro-max-skill — MIT

Source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
Copyright (c) 2024 Next Level Builder

Used in: `07-ux-rules.md`, `11-search-engine.md`, the entire `data/` directory (28 CSV datasets) and
`scripts/search.py`, `scripts/core.py`, `scripts/design_system.py`.

Same MIT terms as above.

**Exact treatment:** `07-ux-rules.md` assembles two unmodified v2.9.0 excerpts;
`11-search-engine.md` is a documented derivative of historical blob `96a6fae`; all 28 CSV files are
an unmodified v2.11.0 snapshot; `core.py` and `design_system.py` retain their v2.9.0 bodies plus
attribution; `search.py` is a SiteSmith derivative of v2.9.0. Current-upstream differences are not
mislabelled as local edits. The separately licensed CLI siblings and fonts are not bundled.

## frontend-design — Apache License 2.0

Source: https://github.com/anthropics/claude-plugins-official
Copyright Anthropic PBC
Authors: Prithvi Rajasekaran, Alexander Bricken

Used in: the final section of `05-ai-tells.md`.

Licensed under the Apache License, Version 2.0. You may obtain a copy at
[`skills/sitesmith/LICENSES/Apache-2.0.txt`](skills/sitesmith/LICENSES/Apache-2.0.txt). Unless required by applicable law or agreed to in
writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

**Changes made:** the YAML frontmatter and its separator blank were removed; SiteSmith added the
local `## Æstetisk retning (frontend-design)` section heading. The source body is unmodified.

## impeccable — Apache License 2.0

Source: https://github.com/pbakaus/impeccable
Copyright Paul Bakaus

Used in: the entire `references/impeccable/` directory (35 files).

Licensed under the Apache License, Version 2.0, included at
[`skills/sitesmith/LICENSES/Apache-2.0.txt`](skills/sitesmith/LICENSES/Apache-2.0.txt).

**Changes made:** all 35 files trace to the Claude-provider output at upstream commit
`af78b1e512148e2a2f2d2ded6786d265ea420191`. SiteSmith added attribution headers. Thirty-four
bodies otherwise match that frozen output. In `_SKILL-original.md`, exactly 32
`reference/<file>.md` link targets were repointed to the same files in the flat local directory and
the file now carries a prominent modification notice. Ten differences from current upstream are
later upstream drift, not SiteSmith modifications.

**Upstream's own third-party notice, carried forward:** impeccable's `reference/ios.md` and
`reference/android.md` are distilled from [ehmo/platform-design-skills](https://github.com/ehmo/platform-design-skills)
(MIT), rewritten in impeccable's voice.

---

## Not included

| Source | Reason |
| --- | --- |
| `website-builder-setup` (tenfoldmarc) | No license file — no redistribution grant. Replaced by original `v2/tasks/setup.md`. |
| `redesign-skill` (no canonical source) | Provenance unverifiable. Replaced by original `v2/tasks/redesign-audit.md`. |
