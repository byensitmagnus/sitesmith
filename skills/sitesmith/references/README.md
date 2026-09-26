# references — upstream provenance

> Original work, MIT.
> **Not read during a build.** The canonical layer is [`../v2/`](../v2/README.md).

This directory holds the material sitesmith v1 was assembled from: four openly licensed
skills, vendored with attribution. It is kept because the attribution is owed, because the
measurements taken from it are cited in `docs/v2/`, and because a reader should be able to
see what the skill descends from.

It no longer decides output.

## Why it was demoted

Measured with `tools/extract-rules.py`, this set carries **978 rules across 47 files, 735
prohibitions against 185 requirements**. Four voices restating each other, occasionally
contradicting each other — a mandatory one-radius lock in `03-design-engineering.md:81`,
"identical border-radius on every element" listed as a defect in `../v2/tasks/redesign-audit.md:89` —
and between them no statement anywhere of what a finished website *has*.

An agent reading four bans for every requirement avoids specific failures competently and
builds nothing in particular. That is a structural property of the set, not a wording
problem, and it is not fixed by adding a fifth voice that adjudicates between the four.

The adjudications, with reasons and file references, are in
[`docs/v2/DECISIONS.md`](../../../docs/v2/DECISIONS.md). Seven subjects were real
disagreements; six were the measuring tool over-reporting.

## What is still true of these files

Every file states its source inline and keeps its licence. `09-block-library.md` Section 14
is a genuinely good pre-flight checklist and several v2 core rules descend from it.
`07-ux-rules.md` is the origin of most of v2's accessibility floor. The `data/` CSVs and
`scripts/search.py` are still live and still used at step 5.

Credit for those is in [`NOTICE.md`](../../../NOTICE.md). If sitesmith is useful, these four
are why:

- [taste-skill](https://github.com/Leonxlnx/taste-skill) — MIT
- [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — MIT
- [frontend-design](https://github.com/anthropics/claude-plugins-official) — Apache 2.0
- [impeccable](https://github.com/pbakaus/impeccable) — Apache 2.0

## Reading one deliberately

Nothing stops you. If a v2 rule is unclear and you want to see where it came from, open the
file it descends from. What you should not do is let one of these files answer a question
that [`../v2/modes/`](../v2/modes/README.md) answers for your mode — that is the failure v2
exists to end.
