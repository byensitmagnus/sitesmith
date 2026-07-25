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
  schemes, console errors, link targets and horizontal overflow. Font-loading shifts, tap-target
  sizes and reduced-motion compliance are not checked yet.
- **A seventh benchmark**, if it exercises something the six don't. Multi-step forms, long-form
  documentation and data-entry-heavy admin are all uncovered.
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

`references/01`–`05`, `07`–`09`, `11` and everything under `references/impeccable/` are reproduced
verbatim from upstream projects. **Fix those upstream, not here.** A correction merged here would
silently diverge from the source we credit. Open the PR against
[taste-skill](https://github.com/Leonxlnx/taste-skill),
[ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) or
[impeccable](https://github.com/pbakaus/impeccable), then open an issue here to pull the update in.

`SKILL.md`, `06-redesign-audit.md` and `10-setup.md` are ours. Edit those directly.

## Running the checks

```bash
cd benchmarks
npm install && npx playwright install chromium
node serve.mjs 4321 . &
node ../skills/sitesmith/scripts/verify.mjs http://localhost:4321/01-saas-landing/ --out results/01-saas-landing
```

All six benchmarks must pass. `06-redesign/before/` must **keep failing** — it is the control, and a
PR that fixes it will be closed.

CI runs the same thing on every push.

## Commit style

One change per commit, present tense, and say what it does rather than what you touched.

```
add tap-target size check to verify.mjs
```

not

```
update verify.mjs
```
