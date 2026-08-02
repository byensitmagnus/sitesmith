# The look, Klokkestøberiet Hjelm

Written before any code, following `look.md`.

## 1. The visual thesis

> The world is a foundry floor at 11.14: cast bronze and loam under a single source of
> light that is molten metal, with everything else soot, sand and the dark above the
> rafters.

Swap test: put a bakery in it. A bakery has warmth and a single oven, so the sentence half
survives, which is a warning. Rewrite with the part only this subject has: **the light
source is the product**. A bakery's oven light is not the bread. Here the glow in the frame
is the bell before it is a bell. The sentence stands.

## 2. References, and what is not being taken

**ECM and Deutsche Grammophon sleeves.** Taking: the willingness to let one photographed
object own two thirds of the frame and crowd the type into what is left, rather than
centring both. Not taking: the yellow cartouche, the typeface, the logotype position, the
square format.

**Danish letterpress trade printing, roughly 1900 to 1950.** Taking: display serif set very
large with leading tighter than the type wants, and a rule that is heavy enough to be
structural rather than decorative. Not taking: any specific wordmark, ornament, or the
centred symmetry those jobs almost always used.

**Museum casting-hall interpretive panels.** Taking: a technical section used as the main
image rather than as a footnote, at a scale where a visitor reads the drawing before the
caption. Not taking: the panel's colour system, its icon set, its two-column body text.

## 3. The asset plan

Nothing was supplied by the client. No photograph of this foundry exists in the brief, so
none appears, and none is generated. Everything below is drawn here, which makes the
provenance this repository and the licence its licence.

| what | contributes | source | licence | state |
| --- | --- | --- | --- | --- |
| a1 bell section, full height | owns the first viewport. The object the whole day is about, cut open so the wall thickness at the sound bow is visible, because that thickness is what the overtone row measures | drawn here, inline SVG | original, MIT with this repository | ready |
| a2 the heat field | the single light source of the thesis. A radial field behind the bell mouth that rises as the page scrolls, so the page is lit by the metal rather than by nothing | drawn here, CSS radial gradient | original, MIT | ready |
| a3 sand and soot grain | materiality. A fine turbulence over the whole ground, so the page is a surface rather than a fill | drawn here, SVG feTurbulence | original, MIT | ready |
| a4 the overtone rings | the harmonic series as concentric rings struck from the sound bow, rather than as seven bars in a list | drawn here, inline SVG | original, MIT | ready |

Without a1 the page is a schedule with a heading. Without a2 it is a drawing on a dark
rectangle. Without a3 it is flat. Without a4 the seven ratios are a table nobody reads.

## 4. What owns the first viewport

The bell. Full bleed on the right, cropped by the edge, roughly two thirds of the width at
desktop and the whole width behind the type at mobile. The headline is crowded into the
left third, set large and tight, and the one number that matters, **11.14**, is set at
display size as an object rather than as text.

Not a heading with a subhead and a button.

## 5. Materiality

Cast surface and sand. One turbulence filter at low opacity over the ground, and the bell
itself carries a vertical gradient from soot at the crown to lit bronze at the mouth. The
rule under the header is 6px, because a letterpress rule is a piece of metal.

## 6. Critique

Filled in after the first render, in `CRITIQUE.md` beside this file.
