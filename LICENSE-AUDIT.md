# License audit

Performed 2026-07-25, before making this repository public. Every file that ships in
`skills/sitesmith/` was traced to an upstream source and checked for a redistribution grant.

## Verdicts

| Source | Upstream | License | May we redistribute? | Action taken |
| --- | --- | --- | --- | --- |
| taste-skill | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | MIT, © 2026 Leonxlnx | **Yes** — MIT permits copying, modification and distribution with the copyright notice | Exact excerpts assembled in seven SiteSmith wrappers; not whole-file verbatim. Attributed in `NOTICE.md`. |
| ui-ux-pro-max | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | MIT, © 2024 Next Level Builder | **Yes** for the mapped historical root-MIT subset | 28 exact v2.11.0 CSVs, two excerpt/derivative docs, two attributed v2.9.0 Python bodies and one SiteSmith Python derivative. Sibling CLI/skill/font licences are excluded. |
| frontend-design | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | Apache 2.0 (Anthropic) | **Yes** — Apache 2.0 permits redistribution with license text and change notice | Frozen body embedded without YAML frontmatter/separator blank and under a SiteSmith-added heading; attributed, modification-described and shipped with the complete Apache licence. |
| impeccable | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Apache 2.0 (Paul Bakaus) | **Yes** — same terms | 35 files pinned to historical provider output; attribution headers added and 32 links repointed in `_SKILL-original.md`. Complete Apache licence and upstream NOTICE credit ship with provider bundles. |
| website-builder-setup | [tenfoldmarc/website-builder-setup](https://github.com/tenfoldmarc/website-builder-setup) | **None** | **No** — a repository with no license grants no rights; default is all rights reserved | **Removed.** Replaced by originally written setup guidance. |
| redesign-skill | No canonical source found | **Unknown** | **No** — provenance unverifiable | **Removed.** Replaced by an originally written redesign audit. |

**2026-07-30 correction.** The original “kept verbatim” labels were too broad: they mixed exact
upstream bodies with SiteSmith wrappers, historical snapshots and real derivatives. The canonical
file/span/hash map is now [`docs/v3/LICENSE-DERIVATION-AUDIT.md`](docs/v3/LICENSE-DERIVATION-AUDIT.md),
and the complete Apache text ships at
[`skills/sitesmith/LICENSES/Apache-2.0.txt`](skills/sitesmith/LICENSES/Apache-2.0.txt).

## Why the two removals

**website-builder-setup** has no `LICENSE` file. Under the Berne Convention and GitHub's own terms,
absence of a license means the author retains all rights; forking on GitHub does not grant
redistribution rights outside GitHub. We cannot ship its text in a public repository.

**redesign-skill** was installed locally with no upstream metadata. A GitHub code search for two
distinctive strings from it returned **570 and 574 hits** across unrelated repositories, none of
which presents as the original author. Several of the copies carry MIT licenses, but a downstream
redistributor cannot grant rights it never held. With no identifiable copyright holder, there is no
license to rely on.

Both were replaced with material written from scratch for this repository. General design
principles — "limit line length", "use one accent colour", "add focus rings" — are facts and
techniques, not protected expression; what is protected is the specific wording, ordering and
selection of the original. The replacements share the underlying principles, which are common
knowledge in the field, and none of the original phrasing.

## Our own contributions

`SKILL.md`, `v2/tasks/redesign-audit.md`, `v2/tasks/setup.md`,
`references/12-design-system.md`, `blocks/`, `scripts/verify.mjs`, `scripts/token-drift.mjs`,
`tools/`, this file, `NOTICE.md`, `README.md`, the benchmarks and all CI configuration are original
work, released under **MIT** (see `LICENSE`).

---

## Addendum, 2026-07-27: from verbatim to derived

This section records the 2026-07-27 synthesis proposal. It does not override the current per-file
provenance map linked above; current labels describe what is actually distributed now.

**What changed.** The four sources are being rewritten and merged into one ruleset rather than
carried as four intact voices behind a router. Files that were "reproduced without modification"
become derived works.

**Why.** Measured with `tools/extract-rules.py`: the reference set carries **978 rules across 47
files, 735 prohibitions against 185 requirements** — four to one. `tools/find-conflicts.py` finds
**thirteen of fourteen subjects** with both a prohibition and a requirement across different files.
Corner radius is mandated as one scale in one file and listed as a defect in another. The skill
declares itself out of scope for dashboards, data tables and multi-step forms, which are three of
its own nine benchmarks. Full evidence with file and line: [docs/v2/CONFLICTS.md](docs/v2/CONFLICTS.md).

Four intact voices cannot be made to agree by adding a fifth that adjudicates between them. The
merge is the fix, and the merge requires modification.

**Does the grant still hold?** Yes, and this is not a close question.

| Source | Licence | Derivative works |
| --- | --- | --- |
| taste-skill | MIT | Permitted. "…to deal in the Software without restriction, including without limitation the rights to use, copy, **modify**, merge, publish, distribute…" Copyright and permission notice must be retained. |
| ui-ux-pro-max | MIT | Same terms. |
| frontend-design | Apache 2.0 | Permitted under §2 and §3. §4(b) requires modified files to carry prominent notices stating that we changed them. |
| impeccable | Apache 2.0 | Same terms. |

Both licences permit modification and redistribution of derivative works. Nothing here weakens the
audit's original conclusion; it changes what we do with the grant, not whether we have it.

**What we now owe.** Apache 2.0 §4(b) is the binding new obligation, and MIT attribution continues
unchanged. Every derived file carries this header block, which is ours:

```markdown
> Part of the **sitesmith** skill. Derived from [taste-skill](https://github.com/Leonxlnx/taste-skill) — MIT, © 2026 Leonxlnx.
> **Modified for sitesmith:** merged with 07-ux-rules and rewritten; the radius rule now states a
> scale rather than a single value, and the out-of-scope list is removed.
```

`Modified for sitesmith:` must say what changed, not that something did. `tools/check-repo.py`
fails the build if a file claims to be derived and does not carry one.

Files that are still untouched keep saying **Verbatim from**. Both forms are legitimate; what is not
legitimate is a file that has been edited and still claims to be verbatim, which is the state
`09-block-library.md` was briefly in before its heading was corrected.

**What does not change.** `website-builder-setup` and `redesign-skill` stay out. A licence that was
never granted cannot be relied on more heavily because we are now writing derivative works —
if anything the opposite. No material of unverified provenance enters the rewrite.

## Re-audit triggers

Re-run this audit if: a new upstream source is added, an existing upstream changes its license, or
any reference file is replaced with material of unknown provenance.
