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
