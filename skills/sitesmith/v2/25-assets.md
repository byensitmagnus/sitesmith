# 25 — assets

> Original work, MIT. Started with the evidence pack, completed before the build is called
> finished. Output: `ASSET-MANIFEST.md`. Enforced by `scripts/production-gate.mjs`.

An asset plan that lives in someone's head becomes a hatched box with a caption explaining
what should have been there. Nine legacy pages carry one `<img>` between them, and three of
them ship an empty coloured square as the logo. Both are the same failure: assets were
treated as a detail to be resolved later, and later never arrived.

The manifest makes them a tracked deliverable with a state.

---

## The manifest

`ASSET-MANIFEST.md`, at the project root, listing every non-text thing the site needs —
including the logo, including the favicon, including any diagram.

One table. Every column is required.

| id | what | where | source | licence | state | focal | treatment |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `hero-roof` | Completed flat roof, from above, showing falls | home hero | client photo `IMG_2841.jpg` | owned | **ready** | 50% 38% | duotone ink/paper, 3:2 |
| `job-felt-lap` | Felt lapped at a joint, close | services | client photo `IMG_2903.jpg` | owned | **ready** | 46% 50% | as above |
| `logo-primary` | Wordmark, drawn | header, footer | drawn for this project | owned | **ready** | — | ink; single colour |
| `favicon` | Mark at 32px | tab | derived from `logo-primary` | owned | **ready** | — | ink on paper |
| `van-livery` | Van at a job | about | — | — | **needed** | — | as hero |

### The columns

- **id** — referenced from the markup as `data-asset="hero-roof"`, so the gate can match a
  manifest row to a rendered element.
- **what** — specific enough that someone else could shoot or draw it. "Hero image" is not.
- **where** — page and slot.
- **source** — the file, the shoot, the generator and its prompt, or the library and item.
- **licence** — `owned`, `client-owned`, `CC0`, `CC-BY + attribution shown at <location>`,
  `generated`, or a licence name. Blank is a failure, not a default.
- **state** — one of:
  - `ready` — the file exists, at the right size, in the repository.
  - `needed` — the site needs it, it does not exist, and someone must produce it.
  - `substitute` — a stand-in is in place and the row says what it stands in for.
- **focal** — the point that must survive every crop, as `x% y%`. Without it, a face or a
  joint gets cropped out at 375px and nobody notices.
- **treatment** — the one visual treatment from the direction. Same crop logic, same aspect
  ratios, same colour handling, across the whole site. Two photographic treatments on one
  page is two brands.

## The states, and what each permits

| state | comp | draft build | production |
| --- | --- | --- | --- |
| `ready` | yes | yes | **yes** |
| `substitute` | yes | yes | **no** |
| `needed` | yes, as a labelled slot | yes, as a labelled slot | **no** |

A build with any row not `ready` is a draft. It can be shown, reviewed and iterated on. It
cannot be called production-ready, and `scripts/production-gate.mjs --production` fails it.

This is deliberately blunt. The alternative — "the placeholder is clearly labelled, so it is
honest" — is how a labelled placeholder ends up occupying half the first viewport of a
product page in a set that was described as finished.

## Getting assets that do not exist

In order of preference:

1. **The client's own material.** Ask before assuming there is none. Most subjects have more
   photography than they think, on a phone, in a WhatsApp thread, on a supplier's site with
   permission.
2. **Originally generated**, if an image tool is available. Record the tool and the exact
   prompt in `source`, mark `licence: generated`, and art-direct all of them to one
   treatment. A generated set with five different lighting conditions is worse than none.
3. **Openly licensed**, with the licence recorded and any required attribution actually
   rendered on the page, not just written in the manifest.
4. **Drawn** — a diagram, a plan, a mark. For subjects whose world is not photogenic this is
   often the strongest answer and it is under-used.
5. **Designed out.** A legitimate direction, chosen deliberately, not fallen into: the page
   is typographic and imagery is not load-bearing. If this is the answer, `DIRECTION.md` says
   so and the manifest still lists the logo and the favicon, which cannot be designed out.

## The logo is an asset

A rounded rectangle filled with the accent colour is not a logo. It is the shape of a logo.

The manifest must carry a `logo-primary` row whose state is `ready`, and the gate checks that
the header mark is not an empty element with a background colour. Acceptable answers, in
order: the client's real logo file; a wordmark set in the site's display face with a
deliberate adjustment; a drawn mark. Any of the three is fine. An empty `<i>` or `<span>`
with `background: var(--accent)` is not.

The favicon is the same rule. Nine 32×32 rounded rectangles with two white strokes in them is
what happens when the favicon is treated as a checkbox.

## Checking

```bash
node scripts/production-gate.mjs "<page glob>" --manifest ASSET-MANIFEST.md          # draft
node scripts/production-gate.mjs "<page glob>" --manifest ASSET-MANIFEST.md --production
```

Draft mode reports. Production mode fails on:

- any manifest row not `ready`,
- any `<img>` in the rendered page without a manifest row,
- any placeholder language in the DOM,
- an empty element used as a brand mark,
- a missing or generic favicon,
- `(needed)` or `(inferred)` markers left in `EVIDENCE.md` that a `ready` asset row depends on.

The full placeholder list the gate matches on lives in the script, next to the code that uses
it, so the two cannot drift apart.
