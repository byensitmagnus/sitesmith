# Contributing

## The bar

**A rule that can't be demonstrated on a rendered page doesn't belong in the skill.**

If you propose "always use a 4px spacing scale", show two screenshots. If you propose a new AI tell,
show the page that exhibits it. Opinions are welcome in issues; the skill files take evidence.

## What we want

- **New tells.** Patterns that mark work as machine-generated, with an example. Say when the pattern
  is legitimate — a tell with no legitimate use is rare, and claiming otherwise makes the skill
  brittle.
- **Verification improvements.** `scripts/verify.mjs` currently checks screenshots, axe in both
  schemes, console errors, link targets, horizontal overflow, document structure and behaviour under
  a wider font. Font-loading shifts, tap-target sizes and reduced-motion compliance are not checked
  yet.
- **Growth in `v2/10-core.md`.** Sixty is a budget, not a target. A rule enters by displacing one,
  and the pull request says which.
- **Blocks.** Composition patterns for real sites, token-only, with variants and compatibility
  metadata. See [blocks/README.md](skills/sitesmith/blocks/README.md) for the format.
- **A fourth benchmark brief**, if it exercises something the three don't. The current three are a
  multi-page company site, a shop and an operator console.
- **Corrections.** If a reference file contradicts itself or the precedence order resolves wrongly,
  that's a bug.

## What we don't want

- Rules copied from another skill without checking its license. See `LICENSE-AUDIT.md` for how that
  check is done. Material with no traceable license does not go in, regardless of quality.
- Growth in `SKILL.md`. It is under 500 lines deliberately. New material goes in a reference file
  and gets one link.
- Framework preferences stated as rules. "Use Next.js" is a brief-level decision, not a design rule.
- Bans without conditions. Every pattern in section 4 of `SKILL.md` has a legitimate use, and the
  table says what it is.

## Changing a bundled reference

Every reference file says at the top which of two things it is.

**Verbatim from** — still the upstream text. A correction that is genuinely upstream's bug should
go upstream: [taste-skill](https://github.com/Leonxlnx/taste-skill),
[ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill),
[impeccable](https://github.com/pbakaus/impeccable). A change that is only right for sitesmith
converts the file to derived, which is fine — say so in the heading.

**Derived from … Modified for sitesmith** — ours to edit, provided the heading keeps naming the
source and keeps saying what changed. `Modified for sitesmith:` must describe the change, not
announce that one exists. `tools/check-repo.py` enforces the presence of the note; only review
enforces that it is honest.

What is not acceptable is a file that has been edited and still claims to be verbatim.

Why the repository stopped vendoring four intact voices, with the measurements: the 2026-07-27
addendum in [LICENSE-AUDIT.md](LICENSE-AUDIT.md) and [docs/v2/CONFLICTS.md](docs/v2/CONFLICTS.md).

`SKILL.md`, `06-redesign-audit.md`, `10-setup.md`, `12-design-system.md` and `blocks/` are original
work. Edit those directly.

## Running the checks

Structure, licences, docs and the search engine — no dependencies beyond Python 3.10+:

```bash
python tools/check-repo.py
```

Whether the output obeys the skill's own absolute rules. This is a ratchet: 105 existing
violations are recorded in `tools/conformance-baseline.json` and allowed; any increase fails.

```bash
node tools/conformance.mjs "benchmarks/*/index.html" "benchmarks/*/*/index.html" "index.html"
```

If you fix violations, re-record with `--write-baseline` so the count cannot climb back.
Why the debt exists, and which of those rules survive v2, is argued in
[docs/v2/CONFLICTS.md](docs/v2/CONFLICTS.md).

The benchmarks:

```bash
cd benchmarks
npm install && npx playwright install chromium
node serve.mjs 4321 . &
node ../skills/sitesmith/scripts/verify.mjs http://localhost:4321/01-saas-landing/ --out results/01-saas-landing
```

Then the same widths under a deliberately wide font, which is how a layout that only fits
under your system font gets caught here rather than on the runner:

```bash
node ../skills/sitesmith/scripts/verify.mjs http://localhost:4321/01-saas-landing/ --font-stress --no-axe
```

All nine benchmarks and the block harness must pass both. `06-redesign/before/` must **keep
failing** — it is the control, and a PR that fixes it will be closed.

CI runs both on every push. `verify.mjs` has an exit contract CI asserts directly: **0** clean,
**1** a blocking defect in the page, **2** it could not run at all. Keep them distinct — a script
that returns 1 when the dev server is down teaches everyone to ignore 1.

## Commit style

One change per commit, present tense, and say what it does rather than what you touched.

```
add tap-target size check to verify.mjs
```

not

```
update verify.mjs
```
