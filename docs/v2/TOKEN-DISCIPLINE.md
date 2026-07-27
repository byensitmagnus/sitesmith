# v2 — the pages have a colour system and nothing else

Measured with `skills/sitesmith/scripts/token-drift.mjs` on `main`. Companion to
[CONFLICTS.md](CONFLICTS.md), which measures the rules; this measures the output.

## What was measured

For each page: how many distinct values it uses per dimension, and how many of those appear
only as literals rather than behind a declared custom property. Zero and hairlines (`0`,
`1px`) are excluded from spacing, because `padding: 0` and a 1px border are not scale
decisions.

A high **distinct** count is not automatically wrong — a chart legitimately needs many
colours. A high **loose** count is: it means the value was chosen at the call site, which is
the decision a design system exists to have already made.

```
  page                tokens  colour     radius     spacing    font-size  shadow   families
  01-saas-landing         15  16/ 1       4/ 4      29/29      16/16       6/ 3         0
  02-product-page         14  21/ 1       5/ 5      22/22      19/19       1/ 0         0
  03-dashboard            15  23/ 1       7/ 7      21/21      12/12       0/ 0         0
  04-local-service        12  20/ 1       6/ 6      21/21      19/19       3/ 0         0
  05-editorial            10  16/ 2       0/ 0      12/12      20/20       0/ 0         0
  06-redesign/after       14  23/ 1       5/ 5      16/16      21/21       5/ 3         0
  06-redesign/before       0  14/14       2/ 2      16/16       6/ 6       2/ 2         1
  07-multistep-form       16  23/ 3       0/ 0      13/13      17/17       2/ 1         0
  08-documentation        26  37/ 0       7/ 7      27/27      20/20       1/ 0         0
  09-data-entry           62  34/ 0       0/ 0       0/ 0       0/ 0       0/ 0         0
  index.html              18  29/ 0       7/ 7      27/27      22/22       0/ 0         0
```

## The shape of it

**Colour is the one dimension that works.** Nought to three loose values on every sitesmith
page; the control, which declares no tokens at all, is 14 of 14. That gap is real and the
skill earns it: the palette is the one part of the system `design_system.py` actually
returns, and the `:root` plus dark-mode habit carries it into the page.

**Everything else is chosen at the call site.** Spacing: 29 of 29, 22 of 22, 21 of 21, all
the way down. Font size: 16 of 16, 19 of 19, 12 of 12. Radius: 100% loose wherever it
exists, despite `03-design-engineering.md:81` — "SHAPE CONSISTENCY LOCK (mandatory): Pick
ONE corner-radius scale for the page and stick to it." Seven distinct radii on the
dashboard, seven on the documentation page, seven on the gallery. The lock has never once
engaged.

07 declares a `--step` token and then hardcodes thirteen spacing values beside it, which is
the whole problem in one page: the intention was there and nothing held it.

On spacing the control scores 16 of 16 and the builds score 12 to 29 — also fully loose.
There the skill's output is not measurably more disciplined than the page it exists to beat.
It is only bigger.

### A correction

An earlier revision of this file reported colour as roughly half loose, and singled out 08
for "37 distinct colours, 13 outside any token". That was a bug in the measuring tool, not
in the pages: `declaredTokens` kept a Map keyed by token name, so a token declared in
`:root` and again in the dark-mode block lost its light value, and every light-mode colour
on a themed page looked undeclared. Fixed by keeping every declared value. The numbers above
are the corrected ones.

## What v2 has to produce, and the first proof that it can

A per-project design-system artifact, written before any page and checked after every page.
The format is [`references/12-design-system.md`](../../skills/sitesmith/references/12-design-system.md).

| Must carry | Produced by |
| --- | --- |
| palette, font pairing, section order | `design_system.py` |
| spacing step and ramp | **the contract** |
| type scale with named roles | **the contract** |
| radius scale, inside vs outside | **the contract** |
| elevation scale | **the contract** |
| grid and container | **the contract** |
| button variants with all six states | **the contract**, in prose |
| form control specs | **the contract**, in prose |
| header and footer contract | **the contract**, in prose |
| image treatment and copy register | **the contract**, in prose |

`benchmarks/09-data-entry/` is the first page rebuilt against one.
[`DESIGN-SYSTEM.md`](../../benchmarks/09-data-entry/DESIGN-SYSTEM.md) declares 61 tokens;
the page was then rewritten to use nothing else.

| | before | after |
| --- | ---: | ---: |
| undeclared values against the contract | 67 | **0** |
| loose spacing values | 16 | **0** |
| loose font sizes | 14 | **0** |
| loose radii | 6 | **0** |
| tokens declared | 23 | 62 |

The rendered page is unchanged to the eye, and still passes `verify.mjs` at 375/768/1440
with axe clean in both schemes. That is the point: the contract did not change the design,
it removed the arbitrariness. Sixteen spacing values collapsed to a nine-step ramp of which
the page uses six, because ten of them were never decisions.

Eighteen declared tokens go unused on that page, which the tool reports. For a one-page
project that is over-specification; for the second page it is the reason page two looks like
page one.

## Reproduce

```bash
node skills/sitesmith/scripts/token-drift.mjs "benchmarks/*/index.html" "benchmarks/*/*/index.html" "index.html"
node skills/sitesmith/scripts/token-drift.mjs benchmarks/09-data-entry/index.html \
  --contract benchmarks/09-data-entry/DESIGN-SYSTEM.md
```
