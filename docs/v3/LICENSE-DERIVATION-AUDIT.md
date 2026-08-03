---
title: SiteSmith v3 licence and derivation audit
status: complete
date: 2026-07-30
mappedBaselineCommit: 80d4030780a4cab18f3baa16dfd354269f83971c
licenceGate: closed-for-exact-mapped-baseline-only
provenanceManifest: ../../skills/sitesmith/THIRD-PARTY-PROVENANCE.json
ai_generated: "(C)"
---

# SiteSmith v3 licence and derivation audit

## Contents

- [1. Decision](#1-decision)
- [2. Current distribution truth](#2-current-distribution-truth)
- [3. Exact source map](#3-exact-source-map)
- [4. Apache compliance remediation](#4-apache-compliance-remediation)
- [5. v3 integration policy](#5-v3-integration-policy)
- [6. Gate](#6-gate)

## 1. Decision

SiteSmith's original code may remain MIT, but the repository is not an MIT-only distribution while
it ships MIT and Apache-2.0 third-party material. Every redistributed component retains its own
licence. A root MIT licence is compatible with inclusion of Apache-2.0 work only when Apache's
redistribution conditions are also met; it does not replace them.

No new upstream prose, code, dataset, template, font or generated provider asset enters v3 until it
has a source commit, file-level provenance, licence decision and update strategy in the capability
ledger. Attribution is an input to architecture, not release cleanup.

## 2. Current distribution truth

At baseline [`80d4030`](https://github.com/byensitmagnus/sitesmith/tree/80d4030780a4cab18f3baa16dfd354269f83971c),
the installable skill contains the following material. The last column records the baseline defect;
the remediation made in this uncommitted audit worktree is recorded separately below.

| Source | Material currently shipped | Licence | Baseline treatment |
| --- | --- | --- | --- |
| taste-skill | Seven reference documents assembled from Taste material | MIT | Inline copyright/permission attribution existed, but several headers overclaimed that assembled files were verbatim. |
| ui-ux-pro-max | `07-ux-rules.md`, `11-search-engine.md`, 28 CSV files and three Python search/generator files | MIT for the mapped source subset; sibling/font surfaces have separate terms | Inline MIT attribution existed, but the assembled/excerpted and derivative files did not describe their transformations precisely. |
| historical frontend-design | The 3,956-character LF-normalised source body at `05-ai-tells.md` L139–174; the L137 heading is SiteSmith-authored | Apache-2.0 | Inline source/change description and `NOTICE.md`, but no complete Apache licence copy in SiteSmith. |
| impeccable | 34 reference documents plus `_SKILL-original.md`; `live-setup.md` is not copied | Apache-2.0, with upstream third-party MIT notices for platform material | Inline attribution and `NOTICE.md`; complete Apache licence copy is missing and `_SKILL-original.md` needs a file-local modification notice for its changed links. |

The audit worktree closes those mapped defects: it corrects file-local derivation labels, adds the
complete [`Apache-2.0.txt`](../../skills/sitesmith/LICENSES/Apache-2.0.txt), adds the install-shipping
[`THIRD-PARTY-NOTICES.md`](../../skills/sitesmith/THIRD-PARTY-NOTICES.md), and verifies both through
the repository and installer gates. The root [`LICENSE`](../../LICENSE) correctly remains the MIT
licence for SiteSmith-original material; it does not relicense third-party work.

## 3. Exact source map

### 3.1 taste-skill

The comparison unit is
[`Leonxlnx/taste-skill@e988add`](https://github.com/Leonxlnx/taste-skill/tree/e988add20dab0fa97d7a76781c48961c8184288e).
All copied Taste expression below comes from `skills/taste-skill/SKILL.md` at that commit (Git blob
`b72132fcd466da605623ffe96e370b3991fc5285`, whole-file SHA-256
`2E064E92ACA020B2E0BAD69326FE7EA55D59005ED53D1A8CBCE1BD135D44B8B3`).
The distributed SiteSmith side is pinned to baseline
[`80d4030`](https://github.com/byensitmagnus/sitesmith/tree/80d4030780a4cab18f3baa16dfd354269f83971c).

**OBSERVED:** ordinal line comparison passed for all eight copied spans. Source and target are UTF-8
without BOM, use CRLF and end in a newline. The span hashes below are SHA-256 over the exact target
excerpt, including CRLF after its final line; the matching source excerpt produces the same hash.
No whitespace or punctuation normalisation was used for the equality decision.

| Distributed SiteSmith span | Exact Taste source span | Exact excerpt SHA-256 | Derivation status and SiteSmith additions |
| --- | --- | --- | --- |
| [`01-brief-and-dials.md` L34–147](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/references/01-brief-and-dials.md#L34-L147) | [`SKILL.md` L8–121](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L8-L121) | `D3C519C1A8AB8458F1A5D058E1DA403744718FC04860F3EEB7329C47F086C677` | **Verbatim excerpt in a modified assembly.** SiteSmith L1–33 adds title, attribution, generated contents/anchors and separators. |
| [`01-brief-and-dials.md` L148–192](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/references/01-brief-and-dials.md#L148-L192) | [`SKILL.md` L549–593](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L549-L593) | `735E45CCE6EE8466AFD3C28BC31BBE621A998CCAA47051F0F2DC83A71BF76E04` | **Verbatim second excerpt in the same modified assembly.** The file joins two non-contiguous Taste ranges; it is not a contiguous upstream copy. |
| [`02-architecture.md` L8–45](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/references/02-architecture.md#L8-L45) | [`SKILL.md` L122–159](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L122-L159) | `B56439163F1498BBE2842379624FA28624C6E3AD0061846EE21B7C3FD710BF49` | **Verbatim Taste body with SiteSmith wrapper.** SiteSmith L1–7 adds title, attribution and separator. |
| [`03-design-engineering.md` L25–214](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/references/03-design-engineering.md#L25-L214) | [`SKILL.md` L161–350](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L161-L350) | `5DEA3FFABE9522A114204585F5EE15529FEB55B94D6A30E9FB587DC0B3D68C33` | **Verbatim Taste body with modified wrapper.** SiteSmith L1–24 adds title, attribution, generated contents/anchors and separators. |
| [`04-motion-and-performance.md` L25–223](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/references/04-motion-and-performance.md#L25-L223) | [`SKILL.md` L352–550](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L352-L550) | `C6036EBB00179C6745D96BA731327ABA702CE68468A68084DFAD849DEF0F053C` | **Verbatim Taste body with modified wrapper.** SiteSmith L1–24 adds title, attribution, generated contents/anchors and separators. |
| [`05-ai-tells.md` L24–133](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/references/05-ai-tells.md#L24-L133) | [`SKILL.md` L595–704](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L595-L704) | `53827E0CED8ED5BC6E3FE1B8F9E6F47D96FD5680602116117E33300493984061` | **Verbatim Taste excerpt inside a modified, multi-licence file.** SiteSmith L1–23 adds title, dual-source attribution and contents; L134–136 are separators; L137–174 is not Taste and is mapped separately in §3.3. |
| [`08-pattern-vocabulary.md` L8–84](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/references/08-pattern-vocabulary.md#L8-L84) | [`SKILL.md` L705–781](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L705-L781) | `08E753A7F1333BAC2D2734FD2B46E5A8F38864B3348A29B30D410E0E4177FACB` | **Verbatim Taste body with SiteSmith wrapper.** SiteSmith L1–7 adds title, attribution and separator. |
| [`09-block-library.md` L50–421](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/references/09-block-library.md#L50-L421) | [`SKILL.md` L835–1206](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L835-L1206) | `6E7D680893CD6F0E847218C27D6A07E9E59B329AF1D5079C422EC7AEC5AAED17` | **Verbatim Taste body with substantial SiteSmith wrapper.** SiteSmith L1–49 adds title, attribution, block-location/out-of-scope corrections, generated contents and separators. |

Consequently, none of the seven distributed files is a byte-for-byte copy of one complete upstream
file. Every mapped Taste span is verbatim, but each local file is a wrapper or composite. The
current sentence “Reproduced without modification; only the heading above and file name are ours”
overstates whole-file identity: it is materially inaccurate for 01, 03, 04, 05 and 09, and it omits
the attribution/separator wrapper even in 02 and 08. The precise replacement is: “Contains
unmodified excerpts from `Leonxlnx/taste-skill@e988add`; exact ranges are recorded in
`docs/v3/LICENSE-DERIVATION-AUDIT.md`. SiteSmith added the title, attribution, navigation and notes
identified there.”

Taste's frozen root licence is MIT, Copyright (c) 2026 Leonxlnx.
[`LICENSE` L1–20](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/LICENSE#L1-L20).
It permits copying, modification, merging, publication, distribution, sublicensing and sale, but
requires the copyright and permission notice in all copies or substantial portions
([`L3–13`](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/LICENSE#L3-L13)).
MIT does not require a modified-file notice, but SiteSmith must not call an assembled file wholly
verbatim. Existing per-file attribution and [`NOTICE.md`](../../NOTICE.md) retain the required
identity/notice directionally; the labels must be narrowed as above. Taste's MIT licence does not
license separately named packages, fonts, logos, photos, image-provider output, Stitch, or the
Apache-licensed frontend-design body in file 05.

### 3.2 ui-ux-pro-max

The current comparison unit is
[`nextlevelbuilder/ui-ux-pro-max-skill@4857a2c`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/4857a2c5ef989794751a0f66b8545a4a49566286),
but current-tree inequality does not prove that SiteSmith modified a file. Historical commits,
blobs and line spans below distinguish SiteSmith edits from later upstream drift. The historical
SiteSmith derivation baseline is
[`80d4030`](https://github.com/byensitmagnus/sitesmith/tree/80d4030780a4cab18f3baa16dfd354269f83971c).
The machine-readable manifest records the currently distributed file hashes, including later
attribution-only corrections; the baseline links below identify the expression whose provenance was
mapped, not a claim that every current wrapper/header is byte-identical to that commit.

Unless a Git blob is named explicitly, hashes in this subsection are SHA-256 over UTF-8 after BOM
removal and CRLF→LF normalisation. Whole-file hashes retain the file's terminal LF. Span hashes are
over the named lines joined by LF without a synthetic terminal LF. This makes Windows checkout
line endings irrelevant while preserving every textual character and line boundary. The
`uupm-data` manifest tree uses its declared
`sha256-sorted-relative-path-null-canonical-file-sha-lf-v1` mode: full group-relative path, NUL,
lowercase canonical file SHA-256 and LF, sorted by path. Its 28-file tree hash is
`334255FA61BD0CB96AE10872119DB0FC34348CF989599F85432A8433226A76B4`.

#### 3.2.1 Licence surfaces are distinct

| Surface | Frozen evidence | Licence conclusion |
| --- | --- | --- |
| Repository root and the historically copied core/data | Root [`LICENSE` L1–13](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/LICENSE#L1-L13), Git blob `1e71cbf26660f31903807d099fe902c098fc7e4c`, SHA-256 `738F69DFA83DB5C347C678FB9D90E560877059F0DE93A327C39001BFF92DC014`. | MIT, Copyright © 2024 Next Level Builder. Copies/substantial portions must retain copyright and permission notice. MIT permits SiteSmith modifications; it does not require Apache-style §4(b) notices. |
| CLI package | [`cli/package.json` L40–46](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/cli/package.json#L40-L46) says MIT, while [`cli/README.md` L97–99](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/cli/README.md#L97-L99) says CC-BY-NC-4.0. | Internally conflicting metadata. SiteSmith must not infer a clean grant for wholesale CLI redistribution from either line alone. The mapped SiteSmith subset is traced separately to root-MIT historical files. |
| Installed `ui-styling` sibling | Frontmatter says MIT/claudekit in [`SKILL.md` L1–8](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/.claude/skills/ui-styling/SKILL.md#L1-L8), while its complete [`LICENSE.txt`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/.claude/skills/ui-styling/LICENSE.txt) is Apache-2.0 (blob `7a4a3ea2424c09fbe48d455aed1eaa94d9124835`). | A separate, contradictory component boundary. It is not part of SiteSmith's mapped 07/11/data/scripts subset and cannot be flattened into the root MIT notice. |
| Bundled canvas fonts | The sibling tree carries 27 per-font `*-OFL.txt` files; for example [`ArsenalSC-OFL.txt` L1–9](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/.claude/skills/ui-styling/canvas-fonts/ArsenalSC-OFL.txt#L1-L9), blob `1dad6ca6de2b041ef35c0f5009239ede4567e1f4`. | SIL OFL-1.1 obligations are font-specific. SiteSmith does not currently copy these fonts; importing the full seven-skill bundle would require an asset-by-asset manifest and retained OFL texts. |

No blanket “ui-ux-pro-max is MIT” statement is therefore sufficient for the whole frozen product.
It is sufficient for the exact historical core/data expression mapped below, subject to retaining
the root MIT notice.

#### 3.2.2 Reference-file provenance

`07-ux-rules.md` is not a current-tree copy and is not a wholly modified paraphrase. It is two
unmodified historical excerpts assembled under a SiteSmith wrapper. The source is upstream
[`v2.9.0`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/65e23199492fa911af32d9078e627ab4de01f4c8),
whose `.claude/skills/ui-ux-pro-max/SKILL.md` is Git blob
`08a354b59b9e73307b51cc6794058a7f037af0ca`.

| Distributed SiteSmith span | Exact historical source span | Canonical excerpt SHA-256 | Status |
| --- | --- | --- | --- |
| [`07-ux-rules.md` L35–289](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/references/07-ux-rules.md#L35-L289) | [`v2.9.0 SKILL.md` L47–301](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/65e23199492fa911af32d9078e627ab4de01f4c8/.claude/skills/ui-ux-pro-max/SKILL.md#L47-L301) | `7C5488FBAF6423475774AEBDF07B732F0ADC1B0405AEA2E277739596643FEDCA` | Exact line sequence after newline normalisation. |
| [`07-ux-rules.md` L290–393](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/references/07-ux-rules.md#L290-L393) | [`v2.9.0 SKILL.md` L577–680](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/65e23199492fa911af32d9078e627ab4de01f4c8/.claude/skills/ui-ux-pro-max/SKILL.md#L577-L680) | `426D181C9650DE1C04126214BE47D9E6DFC918213DFBEFB040E95C2702A87590` | Exact second, non-contiguous excerpt. |

The complete distributed `07-ux-rules.md` is SiteSmith blob
`72af2c984246f0cc9b0442be25373a3b9fa19ac9`, canonical SHA-256
`556BE2653BAC4B3B014DC24F3A92E01B95B8EA7056A1D04D2BB70A14F30927CC`.
SiteSmith L1–34 adds title, attribution, contents and separators, and joins the two spans. Later
changes in frozen `v2.11.3` templates are **upstream drift**, not SiteSmith edits to these bodies.
The accurate label is “contains unmodified excerpts from `ui-ux-pro-max-skill@65e2319` in a
SiteSmith assembly”, not whole-file “reproduced without modification”.

`11-search-engine.md` is different: it is a real SiteSmith derivative of historical template blob
`96a6faea745895a6417ddb0d3a79cfb6afb5fe6d`, SHA-256
`00DF1A36535738B3BB3A07D6C2A537725F817EBF5B218AC91274F2804123388F`. That identical blob occurs
in both upstream
[`v2.4.0`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/13789290064c88039ad8fc5376412e8d22e491d7/cli/assets/templates/base/skill-content.md)
and [`v2.5.0`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/07f4ef3ac2568c25a3b0c8ef5165a86abc3e56e4/cli/assets/templates/base/skill-content.md);
repository evidence cannot distinguish which tag SiteSmith used, so the tag is explicitly
**unresolved** while the source blob is exact.

The distributed [`11-search-engine.md`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/references/11-search-engine.md)
is blob `f90449bb4ba5cb18eab6d9ecb3b0ec5afffc364a`, canonical SHA-256
`A39E2743F7FD3DD375F9E6CCBBAB2D03D903E2866E48D8D67C29CD810A65B5F7`.
Against the exact source blob, SiteSmith:

- adds L1–33 and replaces source L1–5 with target L34–40;
- translates/changes the six mixed-language examples at target L73–78;
- rewrites twelve script-path lines at target L98, L109, L117, L126, L151, L176, L220, L229,
  L232, L238, L251 and L254;
- adds lookup rows at L164–165 and L194, and changes punctuation at L209; and
- omits source L252–353. All remaining aligned body lines derive from source L6–251.

Its current “reproduced without modification” header is therefore false against both possible
historical tags, not merely different from today's frozen upstream.

#### 3.2.3 Exact 28-file data snapshot

Every distributed CSV is text-identical to a file at upstream
[`v2.11.0`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/6142b073958df645d0fb27e682428e69599386dc).
Nineteen remain identical in the frozen `v2.11.3` source. The nine rows marked **upstream drift**
match only the historical `.claude/skills/ui-ux-pro-max/data/...` copy at `v2.11.0`; upstream later
changed them. None of those nine inequalities is evidence of a SiteSmith modification.
Each manifest row binds that revision, its exact source path and Git blob, the upstream canonical
SHA-256 and the distributed canonical SHA-256; the verbatim-data gate requires the two SHA-256
values to be identical.

| Distributed SiteSmith file | Exact `v2.11.0` source | Canonical SHA-256 | Frozen `v2.11.3` relation |
| --- | --- | --- | --- |
| [`app-interface.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/app-interface.csv) | [`src/.../app-interface.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/src/ui-ux-pro-max/data/app-interface.csv) | `2A17EF810DAB715CE1F339861817A8FBE3CCC38142B70517301E874803E838AC` | Identical. |
| [`charts.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/charts.csv) | [`src/.../charts.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/src/ui-ux-pro-max/data/charts.csv) | `A70EF7460B0EAAEA8614F86A0D09A4BC38B467804179762464B5CA45B491BAAC` | Identical. |
| [`colors.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/colors.csv) | [`.claude/.../colors.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/.claude/skills/ui-ux-pro-max/data/colors.csv) | `5A6CB6C5D6F19B5F5E51865AE1E643E4BAA05D04304D0BAB976F064632149A6A` | **Upstream drift.** |
| [`google-fonts.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/google-fonts.csv) | [`src/.../google-fonts.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/src/ui-ux-pro-max/data/google-fonts.csv) | `3FD2898FB0FDD31BA758BF05CFCD2B58CD0F038A20CF08E417D09E5A8A4A509E` | Identical. |
| [`icons.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/icons.csv) | [`src/.../icons.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/src/ui-ux-pro-max/data/icons.csv) | `F376C29FB4DF37B4BDB366A5AA70CB211BA3DD8B435390AAA03152A64B07D2E8` | Identical. |
| [`landing.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/landing.csv) | [`src/.../landing.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/src/ui-ux-pro-max/data/landing.csv) | `121A2CAC7CF21050234B5F80E7B4E182F10123536032E0F9AD862AD3AEC9677D` | Identical. |
| [`products.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/products.csv) | [`.claude/.../products.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/.claude/skills/ui-ux-pro-max/data/products.csv) | `9FD9E776BA847CF44C1EA78F95FE5E33B2C56BB7E186E3CFFF9C49BC7FCB691B` | **Upstream drift.** |
| [`react-performance.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/react-performance.csv) | [`src/.../react-performance.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/src/ui-ux-pro-max/data/react-performance.csv) | `904C8AFCDA229629545912DDE0E8AC37503757131F0169F80B016F1F58C4FD3F` | Identical. |
| [`stacks/angular.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/stacks/angular.csv) | [`.claude/.../angular.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/.claude/skills/ui-ux-pro-max/data/stacks/angular.csv) | `DD7CC2A2B34CD8F0508BD05B067545E7A44F7724440C432D491D92A61A8FB6C1` | **Upstream drift.** |
| [`stacks/astro.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/stacks/astro.csv) | [`.claude/.../astro.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/.claude/skills/ui-ux-pro-max/data/stacks/astro.csv) | `AD18DAE3AB6D148D37D144592DF80DC1825B6C9E86D9D2D68FDDA77434206A37` | **Upstream drift.** |
| [`stacks/flutter.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/stacks/flutter.csv) | [`src/.../flutter.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/src/ui-ux-pro-max/data/stacks/flutter.csv) | `FE36D404C799781E8BA6E9A8179B45799ED5126A545528550CD2EB0F2346E8C5` | Identical. |
| [`stacks/html-tailwind.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/stacks/html-tailwind.csv) | [`src/.../html-tailwind.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/src/ui-ux-pro-max/data/stacks/html-tailwind.csv) | `7AEF38E75C53559470AFCFA91580A9917CA8B7DBF8B92110389E23E93703AC52` | Identical. |
| [`stacks/jetpack-compose.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/stacks/jetpack-compose.csv) | [`src/.../jetpack-compose.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/src/ui-ux-pro-max/data/stacks/jetpack-compose.csv) | `6C8FD4B0391C342C12B0AF15610CD5BECBECCAEF0BBE8DCFC01D928C3195D93E` | Identical. |
| [`stacks/laravel.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/stacks/laravel.csv) | [`.claude/.../laravel.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/.claude/skills/ui-ux-pro-max/data/stacks/laravel.csv) | `50E11E60A64B30F329AF25AE71F4B8BBDB43BAFC1865451B74F9F540A88964D5` | **Upstream drift.** |
| [`stacks/nextjs.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/stacks/nextjs.csv) | [`src/.../nextjs.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/src/ui-ux-pro-max/data/stacks/nextjs.csv) | `E828CCC04843742F52F545A068E8A9AB0D2B97C0E771F7E93BF0CEF74DA05554` | Identical. |
| [`stacks/nuxt-ui.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/stacks/nuxt-ui.csv) | [`.claude/.../nuxt-ui.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/.claude/skills/ui-ux-pro-max/data/stacks/nuxt-ui.csv) | `05D6E74501B2B6A636FAED32450622759F49A5BCAFAD971F5F4E7EBA0EB7BE71` | **Upstream drift.** |
| [`stacks/nuxtjs.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/stacks/nuxtjs.csv) | [`src/.../nuxtjs.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/src/ui-ux-pro-max/data/stacks/nuxtjs.csv) | `F7A3F2D9542856D00199F85C6C023B7C284CC698E2E6E12D61AFCE2EDACB24D6` | Identical. |
| [`stacks/react-native.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/stacks/react-native.csv) | [`src/.../react-native.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/src/ui-ux-pro-max/data/stacks/react-native.csv) | `077AEFC81D194895ECF7936B3ED298B978E36961F183E3A275F8ACDA19B5F621` | Identical. |
| [`stacks/react.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/stacks/react.csv) | [`src/.../react.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/src/ui-ux-pro-max/data/stacks/react.csv) | `E5624AB41D33427D88E41D07581CE4ECA59B37B36AB72A6AD43A9C8E2D0A1C72` | Identical. |
| [`stacks/shadcn.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/stacks/shadcn.csv) | [`src/.../shadcn.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/src/ui-ux-pro-max/data/stacks/shadcn.csv) | `395C2E415EF6F48A474ACCCDC8EB2C7258A6ED751A5037BA171A2D8823E02DED` | Identical. |
| [`stacks/svelte.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/stacks/svelte.csv) | [`src/.../svelte.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/src/ui-ux-pro-max/data/stacks/svelte.csv) | `71AF52D64F266C88070B91DBBAA900C2F8074B6BAAE9F35EAEA6BA9CEC6FD803` | Identical. |
| [`stacks/swiftui.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/stacks/swiftui.csv) | [`src/.../swiftui.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/src/ui-ux-pro-max/data/stacks/swiftui.csv) | `C9C2D2510F8E66281A2514E8DD0125A6B653B9EF53A71281B5E7DFE003D5B569` | Identical. |
| [`stacks/threejs.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/stacks/threejs.csv) | [`.claude/.../threejs.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/.claude/skills/ui-ux-pro-max/data/stacks/threejs.csv) | `F1C05F8F269FC4784170C837F4FF43B50042F00BBD6BA7DBEF2896081A052544` | **Upstream drift.** |
| [`stacks/vue.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/stacks/vue.csv) | [`src/.../vue.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/src/ui-ux-pro-max/data/stacks/vue.csv) | `C2724915D3C11CD67263F25896CFF721F787A0FDD8326002D31E9F5806DFD8F8` | Identical. |
| [`styles.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/styles.csv) | [`.claude/.../styles.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/.claude/skills/ui-ux-pro-max/data/styles.csv) | `F37EB20E7403A715D440EFD45CE6952EA6A445D6143FD130C52E219A4BEC9911` | **Upstream drift.** |
| [`typography.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/typography.csv) | [`.claude/.../typography.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/.claude/skills/ui-ux-pro-max/data/typography.csv) | `DBEA262A54E3BFA2E6C3B15989A365D5EF4C43349316AFF46635E82CA825ADCE` | **Upstream drift.** |
| [`ui-reasoning.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/ui-reasoning.csv) | [`src/.../ui-reasoning.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/src/ui-ux-pro-max/data/ui-reasoning.csv) | `06E4369445388BA9B7A57347510B125B7A2145BBF8546A327BA50292503B204A` | Identical. |
| [`ux-guidelines.csv`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/data/ux-guidelines.csv) | [`src/.../ux-guidelines.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6142b073958df645d0fb27e682428e69599386dc/src/ui-ux-pro-max/data/ux-guidelines.csv) | `E01943C433B2CAD3040F19389B3B0455673758A569B7A927B5BEDF65C989CB96` | Identical. |

This establishes a coherent historical dataset pin even though SiteSmith bundles only the 28 files
reachable by its older runtime rather than all files now present upstream. It does not establish
row-level provenance for third-party facts or cure the 66 duplicate-key `Decision_Rules` cells;
those are separate data-quality gates.

#### 3.2.4 Python fork provenance

All three Python baselines come from upstream `v2.9.0` commit
[`65e2319`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/65e23199492fa911af32d9078e627ab4de01f4c8).
The table separates each exact historical body from the currently distributed local additions.
The baseline links identify the mapped derivation snapshot; the distributed hashes and line numbers
include the current provenance-header correction.

| Distributed file | Exact historical baseline | Upstream blob / canonical SHA-256 | Distributed blob / canonical SHA-256 | SiteSmith change |
| --- | --- | --- | --- | --- |
| [`core.py`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/scripts/core.py) | [`v2.9.0 core.py`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/65e23199492fa911af32d9078e627ab4de01f4c8/.claude/skills/ui-ux-pro-max/scripts/core.py) | `8d02065480ecab6978935133371658789782e093` / `772B4D567C7A948C5D4A10343473B4123FEC04238D250C9FFCE31D0733F752C0` | `0eb4f74476da540101399f23e5a2c537c0e469b1` / `93253C8CCE815F77E16EDDCD66CC4FB3C9F36A027CB22BCBF257C48AB84A66BB` | Historical lines are unchanged; SiteSmith inserts attribution at local L5–7. |
| [`design_system.py`](https://github.com/byensitmagnus/sitesmith/blob/80d4030780a4cab18f3baa16dfd354269f83971c/skills/sitesmith/scripts/design_system.py) | [`v2.9.0 design_system.py`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/65e23199492fa911af32d9078e627ab4de01f4c8/.claude/skills/ui-ux-pro-max/scripts/design_system.py) | `d3152e5fb6cd284d03f4169ce63b91f3df40b32d` / `F7A21E83739C5AC6CA3738846220F6A9EB7F3C1AE7A44989C5AAA2061CA60310` | `cce119c6d52039ac519dcaee9ab27e3b3711f6a8` / `5B01B4DC43CBE4249DD13C6076A9CC38C7C325772CADA3D08434D7890EDDD975` | Historical lines are unchanged; SiteSmith inserts attribution at local L6–8. |
| [`search.py`](../../skills/sitesmith/scripts/search.py) | [`v2.9.0 search.py`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/65e23199492fa911af32d9078e627ab4de01f4c8/.claude/skills/ui-ux-pro-max/scripts/search.py) | `ee1e340eb64c904398d9936ee0ff26fdde4ec3e8` / `211546B262FB14D397228DBF982E32254C938D364B6386DA69B62E7C3805B319` | `e9523a8ca7af28eecbda7b5b8e54f2f2456695e5` / `65147AC6D38E4F90D05935A920318546D6CBA321E1E5E578A786244FA684372E` | Real derivative: current provenance/attribution L6–11; static help replaced at L17 and L64–72; candidates/dials/record options at L74–84; execution/state branch at L98–126. |

`core.py` and `design_system.py` are therefore historical upstream bodies with a transparent local
attribution insertion. `search.py` contains separate SiteSmith product logic and must be described
as modified/derived. Frozen `v2.11.3` growth in all three upstream files is version drift and is not
part of the local change set.

#### 3.2.5 Required labels and v3 treatment

At mapped baseline `80d403`, root [`NOTICE.md`](../../NOTICE.md) and the original
[`LICENSE-AUDIT.md`](../../LICENSE-AUDIT.md) described every remaining UI/UX file as verbatim. The
current notices and file headers implement the narrower correction supported by this exact map:

| Current component | Correct present-tense label | v3 treatment |
| --- | --- | --- |
| `07-ux-rules.md` | SiteSmith assembly containing two unmodified `v2.9.0` excerpts plus local wrapper/navigation. | **principle-only / reimplement.** Keep the legacy file only with corrected span-level notice; do not load the entire historical prompt into v3 standing context. |
| `11-search-engine.md` | Modified derivative of exact source blob `96a6fae`; source tag is unresolved between identical v2.4.0/v2.5.0 blobs. | **replace with original operator documentation.** Preserve historical attribution in the audit; remove stale package-manager/React-Native-only instructions from v3. |
| 28 CSV files | Unmodified, versioned `v2.11.0` snapshot; nine differences from frozen current are upstream drift. | **vendored behind an adapter and manifest for separately retained knowledge rows.** Ship commit/path/hash/MIT notice, strict schema and duplicate-key rejection; expose records as evidence only, never as the clean-room classifier implementation or top-one visual direction. |
| `core.py` / `design_system.py` | `v2.9.0` bodies plus local attribution insertion. | **adapter/clean-room boundary.** Preserve MIT and the exact historical baseline for any retained legacy file, but v3's `uupm.classify.product-reasoning` successor receives only the observable coverage contract and fixtures—not upstream classifier code, data expression, or prompt expression. Other evidence-index and DesignSpec capabilities retain their own typed derivation decisions. |
| `search.py` | SiteSmith-modified `v2.9.0` derivative containing local candidate/state logic. | **split ownership.** Reimplement provider-neutral candidate/state behaviour as SiteSmith code; keep any copied BM25/CLI expression separately attributed and pinned. |
| Upstream CLI, siblings and fonts | Not part of the currently copied subset; conflicting MIT/CC-BY-NC, Apache-frontmatter and OFL surfaces remain separate. | **exclude by default.** SiteSmith implements its own provider/install/update layer. Any optional sibling/font integration requires separate licence, source, hash and shipped-notice gates. |

Because the mapped upstream expression is MIT, the legal obligation is notice retention, not an
Apache §4(b) modified-file declaration. Truthful “assembled” and “modified” labels are still a
release requirement: they make the provenance reproducible and prevent current-upstream drift from
being misreported as a SiteSmith edit. No public pack may claim the UI/UX derivation closed until
the legacy headers, root NOTICE and machine-readable vendoring manifest agree with this map.

### 3.3 frontend-design historical source

Current capability comparison uses
[`anthropics/skills@b29e7cf`](https://github.com/anthropics/skills/tree/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design),
but SiteSmith's copied expression predates that comparison unit. Git history identifies the exact
source as
[`claude-plugins-official@df5224b`](https://github.com/anthropics/claude-plugins-official/blob/df5224ba07bcc260c4c6bcd7ce2c5a6cff533c4a/plugins/frontend-design/skills/frontend-design/SKILL.md).
The next commit changed that skill; therefore citing only a later frozen revision would not prove
the provenance of the text SiteSmith actually distributes.

**OBSERVED:** the historical source is Git blob `600b6db41fac7e2081c7528ec6982960892c819d`,
canonical SHA-256 `D39ADF3A983DE7DAFC75991590D54F091755F7E4163D5A5ED085ECD719157184`.
It has YAML frontmatter, one separator blank and then no Markdown title. Removing the frontmatter and
that blank leaves a 3,956-character LF-normalised body, SHA-256
`83F5375C2F158E628421CC578FE9DB67BC5031E2E05BBF473EC2D47E56EB4073`, which matches
`skills/sitesmith/references/05-ai-tells.md` L139–174 byte-for-byte. SiteSmith adds the local L137
`## Æstetisk retning (frontend-design)` heading and the file-level attribution/navigation; it does
not alter the source body. The historical plugin README identifies Prithvi Rajasekaran and Alexander
Bricken as authors.
[`README.md` L28–31 at `df5224b`](https://github.com/anthropics/claude-plugins-official/blob/df5224ba07bcc260c4c6bcd7ce2c5a6cff533c4a/plugins/frontend-design/README.md#L28-L31),
[`LICENSE` §4](https://github.com/anthropics/claude-plugins-official/blob/df5224ba07bcc260c4c6bcd7ce2c5a6cff533c4a/plugins/frontend-design/LICENSE#L90-L129).

### 3.4 impeccable

#### 3.4.1 Historical source and exact transformation

Current capability comparison uses
[`pbakaus/impeccable@6b342244`](https://github.com/pbakaus/impeccable/tree/6b342244e915d64b0d6e84d5eec448fd196ce6bb),
but that tree is not the provenance baseline for SiteSmith's copied expression. The 35 local files
first entered SiteSmith in
[`6eb8ef8`](https://github.com/byensitmagnus/sitesmith/commit/6eb8ef8f334c71926d0c22006dbece79ef00337f).
After line-ending normalisation, every imported body matches Impeccable's generated Claude-provider
output at
[`af78b1e5`](https://github.com/pbakaus/impeccable/tree/af78b1e512148e2a2f2d2ded6786d265ea420191/.claude/skills/impeccable):

- `_SKILL-original.md` maps to `.claude/skills/impeccable/SKILL.md`;
- every other local `<name>.md` maps to `.claude/skills/impeccable/reference/<name>.md`; and
- the generated provider output, rather than canonical `skill/reference`, is the correct comparison
  surface because provider generation can substitute paths and placeholders.

SiteSmith commit
[`84d79e3`](https://github.com/byensitmagnus/sitesmith/commit/84d79e310a49448ed73d84a1d528e0e6d85cc2cf)
then added one attribution header to all 35 files. Removing that header restores the exact historical
body for all 34 references. [`_SKILL-original.md`](../../skills/sitesmith/references/impeccable/_SKILL-original.md)
has three additional, bounded transformations: exactly 32 `reference/<file>.md` links were repointed
to the same files in SiteSmith's flat directory, a prominent change note was added with the header,
and the current wrapper carries one terminal LF that the upstream blob does not. Reversing the
header, the 32 repoints and that terminal LF restores the `af78b1e5` source exactly, canonical
SHA-256 `2EF091BBAC46B573BEF1C8BCA0EED3BA1F5A54B76988E475249194BAB16EF20C`.

| Distributed group | Exact import source | SiteSmith change after import | Relation to frozen current `6b342244` |
| --- | --- | --- | --- |
| `_SKILL-original.md` | `af78b1e5:.claude/skills/impeccable/SKILL.md` | Attribution plus prominent modified-file note; exactly 32 link-target repoints and one terminal LF | **Upstream drift.** Current skill version/body changed after import. |
| `adapt.md`, `adapt.native.md`, `android.md`, `animate.md`, `audit.native.md`, `bolder.md`, `clarify.md`, `colorize.md`, `craft.md`, `critique.md`, `delight.md`, `distill.md`, `doctor.md`, `document.md`, `extract.md`, `hooks.md`, `ios.md`, `layout.md`, `onboard.md`, `operate.md`, `polish.md`, `quieter.md`, `routing.md`, `shape.md`, `typeset.md` | Each maps by basename to `af78b1e5:.claude/skills/impeccable/reference/<name>` | Attribution header only; remaining body exact | No body drift after normalisation. |
| `audit.md`, `craft-floor.md`, `harden.md`, `init.md`, `live.md`, `new-work.md`, `optimize.md`, `overdrive.md`, `visualize.md` | Each maps by basename to `af78b1e5:.claude/skills/impeccable/reference/<name>` | Attribution header only; remaining body exact to the import source | **Upstream drift.** These nine changed upstream after import. |

This accounts for all 35 files: 35/35 exact import bodies; 34/35 still exact after removing only the
added header; and `_SKILL-original.md` exact after additionally reversing the 32 link repoints and
one terminal LF. The ten differences from frozen current are the nine reference files named above plus
`_SKILL-original.md`. They are later upstream evolution, not undocumented SiteSmith edits.

#### 3.4.2 `live-setup.md` is a later addition

At `af78b1e5`, the provider tree contained the 34 reference files SiteSmith imported and did not
contain `live-setup.md`. Upstream added that file later in
[`b4f1c178`](https://github.com/pbakaus/impeccable/commit/b4f1c1786e7f23b55923f55f9661c640fb11e3f7).
SiteSmith's historical `live.md` does not reference it. Its absence is therefore not an import
omission. A future refresh to current `live.md`, which does reference the setup file, must import
`live-setup.md` in the same change.
[`live.md` L66 and L327](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/reference/live.md#L66-L327).

#### 3.4.3 Apache-2.0 §4 and upstream NOTICE

Impeccable's governing licence is Apache-2.0. Its redistribution conditions require a licence copy,
prominent change notices on modified files, retention of applicable source notices and propagation
of relevant NOTICE attribution.
[`LICENSE` §4(a)–(d)](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/LICENSE#L90-L122).
The current SiteSmith working tree maps those conditions as follows (compliance classification is an
engineering audit, not legal advice):

| Apache condition | Applicable SiteSmith evidence | Current state |
| --- | --- | --- |
| §4(a): give recipients a copy of the licence | Complete [`Apache-2.0.txt`](../../skills/sitesmith/LICENSES/Apache-2.0.txt) is inside the installable skill tree. | **Implemented.** |
| §4(b): modified files carry prominent notices | All 35 files identify the SiteSmith-added header. `_SKILL-original.md` now explicitly says **Modified for sitesmith** and records the 32 repoints. | **Implemented for the mapped changes.** Current-upstream drift does not create a SiteSmith change notice. |
| §4(c): retain applicable source notices | File headers, root [`NOTICE.md`](../../NOTICE.md) and the bundled notice retain Impeccable, Paul Bakaus and Apache-2.0 attribution. | **Implemented for the mapped subset.** |
| §4(d): carry applicable upstream NOTICE text | Upstream [`NOTICE.md` L1–11](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/NOTICE.md#L1-L11) credits `ehmo/platform-design-skills` (MIT) for the iOS/Android material. SiteSmith carries that attribution in root NOTICE and [`THIRD-PARTY-NOTICES.md`](../../skills/sitesmith/THIRD-PARTY-NOTICES.md). | **Implemented for the distributed platform references.** |

#### 3.4.4 Distribution proof and remaining boundary

The remediation is not repository-root-only. [`check-repo.py`](../../tools/check-repo.py) requires a
complete Apache text plus the bundled owners, licence path and ehmo notice. The install-flow test in
[`test-product-flow.mjs`](../../tools/test-product-flow.mjs) installs a Codex provider bundle into a
temporary directory, then reads `LICENSES/Apache-2.0.txt` and `THIRD-PARTY-NOTICES.md` from the
installed tree and requires the Apache file's exact official SHA-256 plus the manifested notice
hashes. That proves notice carriage through the current installer path, not merely source-tree presence.

Any later Impeccable refresh remains a new derivation event: pin its source commit, compare generated
provider output, record every transformation, include newly referenced files such as
`live-setup.md`, preserve Apache/NOTICE material and rerun the install-carriage gate.

## 4. Apache compliance remediation

The two defects found at baseline are closed in this worktree:

1. The complete Apache-2.0 text now ships at
    [`skills/sitesmith/LICENSES/Apache-2.0.txt`](../../skills/sitesmith/LICENSES/Apache-2.0.txt) and is
   linked from the root and installed notice surfaces. Its canonical SHA-256 is the official
   `CFC7749B96F63BD31C3C42B5C471BF756814053E847C10F3EB003417BC523D30`, including the Appendix.
2. [`_SKILL-original.md`](../../skills/sitesmith/references/impeccable/_SKILL-original.md) now carries
   a prominent `Modified for sitesmith` notice and identifies the 32 reference-link repoints.

[`check-repo.py`](../../tools/check-repo.py) verifies source-tree carriage and required attribution;
[`test-product-flow.mjs`](../../tools/test-product-flow.mjs) performs an isolated provider install
and verifies the licence and notices inside the installed tree. This closes the identified
architecture blocker for the mapped material. It is an engineering compliance result, not legal
advice or a blanket clearance for future upstream updates, fonts, images, packages or templates.
No historical benchmark evidence was removed or rewritten.

## 5. v3 integration policy

Every supremacy-matrix row has exactly one primary integration category. The category is an
engineering provenance and implementation decision; it is not a legal conclusion. The allowed
taxonomy and current 59-row matrix state are:

| Primary category | Binding meaning | Current rows |
| --- | --- | ---: |
| `direct dependency` | Consume an independently versioned package at a pinned version/hash under its own licence and runtime boundary. | 0 |
| `git submodule` | Consume a pinned repository boundary while retaining its independent history, licence, and update surface. | 0 |
| `adapter` | Call an independently supplied local/runtime capability through a typed boundary without vendoring its implementation. | 0 |
| `provider-plugin` | Keep an optional provider-owned executable integration outside release authority and pin its source/config/licence. | 1 |
| `vendored component` | Redistribute an exact file-level manifested subset with source commit, hashes, licence, attribution, and owned update review. | 2 |
| `spec-compatible reimplementation` | Implement SiteSmith-owned logic against the recorded behavioural contract without importing the upstream runtime as a dependency. | 30 |
| `clean-room reimplementation` | Rebuild the capability from the ledger outcome contract/tests without copying upstream implementation, data expression, runtime expression, or prompt expression; require positive successor proof plus a separate old-mechanism negative fixture. | 19 |
| `principle-only inspiration` | Preserve a prompt-level behaviour target while copying neither source expression nor a purported deterministic mechanism. | 3 |
| `deliberate rejection` | Exclude the source mechanism, set successor to `none`, name the deliberate strength loss, and keep the exact negative fixture and reconsideration gate explicit; make no preservation, replacement, or non-inferiority claim. | 4 |

No current core capability requires a git submodule or an unbounded direct dependency. If a future
capability chooses either, the matrix and lock manifest must record the exact revision, checksum,
licence, offline fallback, update owner and breaking-change policy before implementation.

“Clean-room” here is a forward implementation rule, not a retroactive claim about existing copied
files. Implementers receive the capability contract and tests, not upstream expressive text; the
audit trail records who had access. General ideas and observable behaviour can be reimplemented,
but copied expression remains governed by its source licence.

## 6. Gate

The architecture licence gate requires:

- every current third-party file has exact source commit/path/hash and a correct local label;
- the full Apache text and modified-file notices are present;
- every matrix integration-treatment cell begins with exactly one of the nine primary categories
  defined in §5;
- the pack/install checker proves all required licence and NOTICE files ship;
- an upstream update cannot silently change copied files or licences.

The current matrix satisfies the taxonomy condition 59/59 with counts
`0/0/0/1/2/30/19/3/4` in the §5 order. The five engineering requirements are satisfied for the
currently mapped and distributed material, so the licence-and-derivation subgate is **closed for that exact mapped baseline only**.
This does not itself pass the separate v3 architecture-review
gate. It is not legal advice, a legal clearance, or a blanket conclusion about future imports.
Every future import or upstream refresh opens a new file-level derivation review; this result is not
inherited automatically.

The installable [machine-readable provenance manifest](../../skills/sitesmith/THIRD-PARTY-PROVENANCE.json)
is the enforcement surface for that narrow conclusion. It binds the 75 distributed third-party
files, the one declared disjoint-span overlap, source revisions, normalized file/span/tree hashes,
and the repository/install licence and NOTICE carriage. The repository checker rejects an orphan,
overlap, byte drift, source reconstruction drift, baseline mismatch, or carriage mismatch; the
product-flow test revalidates every `shipsWithInstall` hash after provider installation.

Every manifest `sourcePath` is resolved fail-closed from the exact GitHub repository/path at every
full audited revision over HTTPS. The checker batches those immutable coordinates. It recomputes
declared raw Git blob IDs and canonical SHA-256 values; re-hashes every declared source-line span;
applies the frontend-design body selector again; and compares all 35 reconstructed Impeccable files
with their fetched upstream files. An unavailable source, redirect, object mismatch, range mismatch
or content mismatch fails the audit. Consequently this documentation/provenance gate has an
explicit network dependency and never treats a matching local object, manifest-only hash or source
absence as revision/path verification.
