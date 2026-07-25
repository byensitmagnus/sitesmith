# License audit

Performed 2026-07-25, before making this repository public. Every file that ships in
`skills/sitesmith/` was traced to an upstream source and checked for a redistribution grant.

## Verdicts

| Source | Upstream | License | May we redistribute? | Action taken |
| --- | --- | --- | --- | --- |
| taste-skill | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | MIT, © 2026 Leonxlnx | **Yes** — MIT permits copying, modification and distribution with the copyright notice | Kept verbatim. Attributed in `NOTICE.md`. |
| ui-ux-pro-max | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | MIT, © 2024 Next Level Builder | **Yes** — same terms | Kept verbatim, including `data/` and `scripts/`. Attributed in `NOTICE.md`. |
| frontend-design | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | Apache 2.0 (Anthropic) | **Yes** — Apache 2.0 permits redistribution with license text and change notice | Kept verbatim. Attributed in `NOTICE.md`. |
| impeccable | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Apache 2.0 (Paul Bakaus) | **Yes** — same terms | Kept verbatim. Attributed in `NOTICE.md`. Upstream's own `NOTICE.md` third-party credit to [ehmo/platform-design-skills](https://github.com/ehmo/platform-design-skills) (MIT) is carried forward. |
| website-builder-setup | [tenfoldmarc/website-builder-setup](https://github.com/tenfoldmarc/website-builder-setup) | **None** | **No** — a repository with no license grants no rights; default is all rights reserved | **Removed.** Replaced by originally written setup guidance. |
| redesign-skill | No canonical source found | **Unknown** | **No** — provenance unverifiable | **Removed.** Replaced by an originally written redesign audit. |

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

`SKILL.md`, `references/05-redesign-audit.md`, `references/09-setup.md`, this file, `NOTICE.md`,
`README.md` and all CI configuration are original work, released under **MIT** (see `LICENSE`).

## Re-audit triggers

Re-run this audit if: a new upstream source is added, an existing upstream changes its license, or
any reference file is replaced with material of unknown provenance.
