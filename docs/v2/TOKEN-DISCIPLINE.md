# v2 — the pages have no design system

Measured with `tools/token-drift.mjs` on `main`. Companion to
[CONFLICTS.md](CONFLICTS.md), which measures the rules; this measures the output.

## What was measured

For each page: how many distinct values it uses per dimension, and how many of those
appear only as literals rather than behind a declared custom property. Zero and hairlines
(`0`, `1px`) are excluded from spacing, because `padding: 0` and a 1px border are not
scale decisions.

A high **distinct** count is not automatically wrong — a chart legitimately needs many
colours. A high **loose** count is: it means the value was chosen at the call site, which
is the decision a design system exists to have already made.

```
  page                tokens  colour     radius     spacing    font-size  shadow   families
  01-saas-landing         15  16/ 8       4/ 4      29/29      16/16       6/ 3         0
  02-product-page         14  21/11       5/ 5      22/22      19/19       1/ 0         0
  03-dashboard            15  23/12       7/ 7      21/21      12/12       0/ 0         0
  04-local-service        12  20/10       6/ 6      21/21      19/19       3/ 0         0
  05-editorial            10  16/ 9       0/ 0      12/12      20/20       0/ 0         0
  06-redesign/after       14  23/12       5/ 5      16/16      21/21       5/ 3         0
  06-redesign/before       0  14/14       2/ 2      16/16       6/ 6       2/ 2         1
  07-multistep-form       16  23/11       0/ 0      13/13      17/17       2/ 1         0
  08-documentation        26  37/13       7/ 7      27/27      20/20       1/ 0         0
  09-data-entry           23  35/17       6/ 6      16/16      14/14       2/ 0         0
  index.html              18  29/15       7/ 7      27/27      22/22       0/ 0         0
```

## Three findings

**1. Not one page has a spacing scale.** Every spacing value on every page is a literal:
29 of 29, 22 of 22, 21 of 21, and so on down the column. Nine sites, one gallery, one
control, and zero spacing systems. 07 declares a `--step` token and then hardcodes thirteen
values anyway.

**2. Not one page has a type scale.** Same column, same result: 16 of 16, 19 of 19, 12 of
12. Every font size was picked where it was used.

**3. Radius is 100% loose wherever it exists**, despite
`03-design-engineering.md:81` — "SHAPE CONSISTENCY LOCK (mandatory): Pick ONE corner-radius
scale for the page and stick to it." Seven distinct radii on the dashboard, seven on the
documentation page, seven on the gallery. The lock has never once engaged.

Only colour has partial discipline, and only because a `:root` block with a dark-mode
override is a habit these pages picked up. Even there, 08 uses 37 distinct colours with 13
outside any token, and 09 uses 35 with 17 outside.

## Why this is the finding that matters

The control — the page written to be bad — scores **16/16 on spacing**. The nine sitesmith
builds score 12 to 29, all fully loose. On the two dimensions that most decide whether a
site feels designed or assembled, the skill's output is not measurably more disciplined
than the page it exists to beat. It is only bigger.

That is the mechanism behind "consistent across a whole site: 3/10". There is no artifact
that carries the scale from one page to the next, so there is nothing to be consistent
*with*. `design_system.py` returns a palette, a font pairing and a section order — it does
not return a spacing step, a type ramp, a radius scale, an elevation scale, button
variants, form control specs, or a header and footer contract.

`SKILL.md:60` already asks for exactly that: *"Type scale, one accent, neutral family,
spacing step, grid, radius scale, elevation scale, image treatment, motion budget. Write
them as tokens, not as values scattered through components."* The instruction is right, no
tool produces it, and nothing checks it. Eleven for eleven, the pages scattered the values
through the components.

## What v2 has to produce

A per-project design-system artifact that is **written before any page and checked after
every page**:

| Must carry | Currently produced by |
| --- | --- |
| spacing step and the ramp derived from it | nothing |
| type scale with named roles | nothing |
| radius scale, inside vs outside | nothing |
| elevation scale | nothing |
| grid and container widths | nothing |
| button variants with all six states | nothing |
| form control specs | nothing |
| header and footer contract | nothing |
| image treatment | nothing |
| copy register | nothing |
| palette | `design_system.py` |
| font pairing | `design_system.py` |
| section order for one page kind | `design_system.py` |

The checker already exists in prototype: `token-drift.mjs` reports loose values today. It
becomes a gate once there is a contract to check against — a page may only use values the
project's design system declares.

## Reproduce

```bash
node tools/token-drift.mjs "benchmarks/*/index.html" "benchmarks/*/*/index.html" "index.html"
node tools/token-drift.mjs benchmarks/09-data-entry/index.html --json
```
