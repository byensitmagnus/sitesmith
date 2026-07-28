# The three pilots converge, measured

Measured at 1440×900 in Chromium's **default** colour scheme — the one a screenshot shows and
a blind reviewer scores — on the pilots as committed at `7b59d8f`.

| | ground | luminance | display face | assets, share of first screen | mono caps | hairlines |
| --- | --- | --- | --- | --- | --- | --- |
| 01 chandlery | `rgb(242,236,224)` | **0.842** | Helvetica Neue Condensed | **2.06 %** | 21 | 88 |
| 02 foundry | `rgb(236,234,228)` | **0.823** | Optima | **4.47 %** | 14 | 59 |
| 03 cask console | `rgb(236,238,240)` | **0.853** | ui-sans-serif | **0.55 %** | 34 | 36 |

Three off-white grounds inside a 0.031 luminance band. Letterspaced uppercase mono labels in
all three. Hairline borders in all three. Imagery occupying between half a percent and four
and a half percent of the first screen in all three — which is to say, none of them is
carried by anything but type and rules.

## The mechanism

Pilots 02 and 03 both declare a **near-black ground** in `DIRECTION.md`. Both put that palette
in the CSS default and the light one behind `@media (prefers-color-scheme: light)`.

Chromium's default is light. So the direction those two chose is the one a viewer gets only if
their operating system happens to ask for it. The declared direction was real, the built site
did not have it, and every gate in the repository passed — because no gate compared the built
site to the direction it claimed.

`direction-fidelity.mjs` is that gate. Run against the three as they stand:

```
01 chandlery      FAIL — imagery 2.06 % against the 4 % a diagram-led direction commits to
                  FAIL — no signature-selector declared
02 foundry        FAIL — ground: declares near-black, renders 0.823
                  FAIL — imagery 4.47 % against the 12 % object-led commits to
                  FAIL — no signature-selector declared
03 cask console   FAIL — ground: declares near-black, renders 0.853
                  FAIL — imagery 0.55 % against 4 %
                  FAIL — no signature-selector declared
```

## What this says about the pilots

They are dry runs, not finished work. Each one passes technical verify, token drift, its
journey and the production gate, and each one is still an off-white technical-editorial page
with a small line drawing on it. Passing every gate that existed is exactly how three subjects
with genuinely different evidence packs arrived at one look — which is the same finding as the
legacy audit, reached a second time by a different route.

The gates that would have caught it did not exist until now.

---

# After one revision, measured the same way

Everything above is the before-baseline and is not edited. Below is the same measurement run
against the same three pilots after a single revision round. No gate was changed to let a
pilot through; the one gate edit in this round is a fix to a gate that was **wrongly blocking**
a pilot, and it is covered by a fixture that fails without it.

| | ground | luminance | display face | assets, share of first screen | mono caps | hairlines |
| --- | --- | --- | --- | --- | --- | --- |
| 01 chandlery | `rgb(242,236,224)` | 0.842 | Helvetica Neue Condensed | **7.74 %** | 21 | 88 |
| 02 foundry | `rgb(26,21,18)` | **0.008** | Optima | **17.81 %** | 0 | 59 |
| 03 cask console | `rgb(11,19,27)` | **0.006** | ui-sans-serif | **5.08 %** | 34 | 8 |

The luminance band went from 0.031 across three off-whites to 0.836 across one paper ground
and two different blacks — a warm one and a cool one, because a foundry is sooty and a cellar
is stainless steel under fluorescent light. Imagery went from 0.55–4.47 % to 5.08–17.81 %.

`direction-fidelity.mjs`, the gate that failed all three, now passes all three:

```
01 chandlery      PASS   ground light 0.842 · condensed · assets 7.74 % ≥ 4 %  · signature .sec, .bench 9.91 %
02 foundry        PASS   ground dark  0.008 · serif     · assets 17.81 % ≥ 12 % · signature .standing 30.56 %
03 cask console   PASS   ground dark  0.006 · sans      · assets 5.08 % ≥ 4 %  · signature .state 3.21 %
```

`portfolio-diversity.mjs` passes with no exception, at the shared-device limit rather than
under it: chandlery and cask still share mono caps and tabular figures; chandlery and foundry
still share hairlines and flat surfaces. Two per pair is the limit and no pair exceeds it.

## What each pilot actually changed

**01 chandlery** kept its direction and gained the object the trade is settled by. A graduated
boxwood bench rule now runs the full width above the catalogue, and the construction
cross-sections went from 72 px to 112 px — the size at which a lay is distinguishable from a
braid, which *is* the purchase decision in that trade. Nothing about the structure moved.

**02 foundry** was already the right idea in the wrong scheme. The light block was deleted
rather than reordered, so the near-black it declared is now the only ground it has. The bell
profile fills a 440 px column at full height (30.56 % of the first screen), the section drawing
carries more fill, and the mono eyebrows became cast inscription capitals — which is what the
evidence pack recorded in the first place and also removes a device all three shared.

**03 cask console** became an instrument instead of a page about one. State is a filled block
with a left-edge bar per row, the filters and the booking panel sit on real elevation, the
cask silhouettes are 128 px, and the ground is a cool slate that puts it in a different family
from the foundry for the reason the two rooms are different.

## The gate fix, stated plainly

The commerce check reads each published price and looks it up in `EVIDENCE.md`. Its price
pattern took the sentence-ending full stop with the figure, so a price written at the end of a
sentence was looked up as `£4.15.` and never found. A shop was blocked for stating a price it
had sourced. One line; fixture `production/pass-sourced-price-ends-sentence` fails without it.

