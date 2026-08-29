# Design contract

Written from `.sitesmith/direction.md` after the direction was chosen and before
implementation. The record explains the decision; this is the decision as values.

- surface: **buy**
- subject: Glarmester Nordlys, a fictional glazier's workshop that cuts replacement panes to measure and prices them from the buyer's own two measurements.
- written against: `.sitesmith/direction.md` @ written-after-the-build

## Colour

**Strategy.** committed. The ground is float glass seen flat on in north light, which is a colour and not a neutral, and it is the material the whole business is about. A white page would have been a form about glass; this is a page made of it.

### Where the colours come from

| name | material | value | why |
| --- | --- | --- | --- |
| glasflade | 4 mm clear float glass laid flat and seen from above in north light, which is how a cut pane looks on the bench before it is wrapped | `#dbe3dd` | The one material every order is made of. It is the page's ground because it is the workshop's. |
| skaerebaenk | the grey felt on the cutting bench | `#c3cec6` | Everything in the workshop is laid on the felt, so everything on the page that holds numbers is laid on it too: the price list and the specification. |
| blyant | the pencil line on a cutting docket | `#1c2426` | The mark a glazier actually makes. Body text, headings and every measuring line are drawn in it. |
| rudekant | the green seen edge-on through the thickness of a sheet of float glass | `#16584a` | The only colour in the workshop that is not grey, and it is only visible at the edge, which is exactly where a glazier looks. It carries the action. |
| linoliekit | linseed putty, about two weeks old | `#cbb684` | The warm note in an otherwise cold room. Used at low opacity behind the things that are about time rather than measurement. |
| roedkridt | the red chalk a glazier marks a bad cut with | `#a33a1e` | In the workshop it means stop. On the page it means the same thing and nothing else: the error state and the 2.200 mm limit on the bench drawing. |
| friskkant | the white of a freshly cut edge held to the light | `#ffffff` | The only pure white in the palette, kept for what sits on the action. |

### Primitives

| token | value | renders as | from |
| --- | --- | --- | --- |
| `--glasflade` | `#dbe3dd` | `#dbe3dd` | glasflade |
| `--skaerebaenk` | `#c3cec6` | `#c3cec6` | skaerebaenk |
| `--blyant` | `#1c2426` | `#1c2426` | blyant |
| `--rudekant` | `#16584a` | `#16584a` | rudekant |
| `--linoliekit` | `#cbb684` | `#cbb684` | linoliekit |
| `--roedkridt` | `#a33a1e` | `#a33a1e` | roedkridt |
| `--friskkant` | `#ffffff` | `#ffffff` | friskkant |
| `--streg` | `rgba(28, 36, 38, 0.34)` | `#1c2426` | derived: blyant at 34 per cent, for rules and hairlines that separate without speaking |
| `--roedkridt-flade` | `rgba(163, 58, 30, 0.09)` | `#a33a1e` | derived: roedkridt at 9 per cent, the ground an error message sits on |
| `--kridt-flade` | `rgba(255, 255, 255, 0.55)` | `#ffffff` | derived: friskkant at 55 per cent, the chalked ground the docket itself is written on |

### Roles

- **background**: `--glasflade`
- **foreground**: `--blyant`
- **action**: `--rudekant`
- **onAction**: `--friskkant`
- **focusRing**: `--rudekant`
- **border**: `--blyant`
- **surface**: `--skaerebaenk`
- **onSurface**: `--blyant`
- **destructive**: `--roedkridt`
- **warning**: `--roedkridt`
- **muted**: `--streg`

### Pairs, measured

| pair | state | foreground on background | floor | measured | verdict |
| --- | --- | --- | --- | --- | --- |
| body on the ground | rest | `--blyant` on `--glasflade` | text | 12.07:1 | passes text |
| body on the bench | rest | `--blyant` on `--skaerebaenk` | text | 9.75:1 | passes text |
| the button | rest | `--friskkant` on `--rudekant` | text | 8.3:1 | passes text |
| the button, hovered | hover | `--friskkant` on `--blyant` | text | 15.79:1 | passes text |
| the focus ring | focus | `--rudekant` on `--glasflade` | nonText | 6.34:1 | passes nonText |
| the focus ring on the button | focus | `--blyant` on `--kridt-flade` over `--glasflade`, painted `#eff2f0` | nonText | 14.01:1 | passes nonText |
| the error message | error | `--roedkridt` on `--roedkridt-flade` over `--glasflade` over `--kridt-flade`, painted `#e8e1dd` | text | 5.11:1 | passes text |
| the invalid field's edge | error | `--roedkridt` on `--glasflade` | nonText | 5.04:1 | passes nonText |
| a field's edge at rest | rest | `--blyant` on `--glasflade` | nonText | 12.07:1 | passes nonText |

**Schemes.** light: yes, dark: no. The use scene is a person standing at a broken window with a tape measure, in daylight, holding a telephone. The page is read once, in the light, next to the thing it is about. A dark scheme would be a second palette nobody in that scene ever sees, and the ground is a material rather than a neutral, so there is no dark equivalent of it that is still float glass.

**Genericness risk.** A pale grey-green ground with near-black text is arrivable at by anyone reaching for calm, and the ground alone would not identify this workshop. What a competitor cannot arrive at is the reason each colour is here: red chalk means stop because it means stop on the bench, and the green is edge-on glass rather than a brand green. The risk is that the reasons live in this file and the page only shows the values.

## Typography

### display: Bahnschrift

- source: system, ships with Windows; the fallback stack carries the rest (system font, not redistributed)
- weights: `400`, `600`
- fallback: `DIN Alternate`, `Roboto Condensed`, `Segoe UI`, `sans-serif`, metric compatible: no
- languages: `da`, `en`, loading: `system`, line height 1.1
- why: The DIN-derived condensed grotesque is the hand that writes measurements on a technical drawing. It is used for headings and for every number that is a measurement, and for nothing else, so a number set in it is a claim that it is a measured value.
- genericness risk: A condensed grotesque for headings is a common move. What is not common is restricting it to measurements, so the typeface itself carries the difference between a number that was measured and a number that was written down.

### body: Sitka Text

- source: system, ships with Windows; the fallback stack carries the rest (system font, not redistributed)
- weights: `400`, `600`
- fallback: `Sitka`, `Charter`, `Iowan Old Style`, `Georgia`, `serif`, metric compatible: yes
- languages: `da`, `en`, loading: `system`, line height 1.55
- why: A text serif with a large x-height, designed to be read on screen at small sizes. The workshop's own words, falsmaal and kitfals and sombelist, are set in a face that reads like a trade manual rather than like an interface.
- genericness risk: Georgia as a fallback is the most-used screen serif there is, so on a machine with neither Sitka nor Charter the page loses most of what makes its text look like a trade manual. The stress case measures exactly that.

### Scale

| step | size | line height | role |
| --- | --- | --- | --- |
| t0 | 13px | 1.4 | the smallest label on a measuring line |
| t1 | 15px | 1.5 | captions, the error message, table cells |
| t2 | 17px | 1.55 | body |
| t3 | 21px | 1.3 | the button, and a measurement in a field |
| t4 | 27px | 1.2 | section headings |
| t5 | 32px | 1.15 | the total, and the second heading level, 38px from 900px |
| t6 | 38px | 1.05 | the page's own heading, 54px from 900px |

**Measure.** 66 characters, band 45 to 80.

### Stress

| case | expected | result | verdict |
| --- | --- | --- | --- |
| a heading three times its expected length, in Danish | It wraps to three lines and the drawing below it moves down. Nothing is clipped and the bench drawing does not shrink, because the drawing's height is set from its own aspect ratio and not from the space left over. | no overflow, nothing clipped, the page is the same height | held |
| the page at 200 per cent zoom at 1440 | The two columns become one, the same way they do at 375, because the layout switches on available width rather than on device. The bench drawing stays legible and its measuring numbers stay on their lines. | no overflow, nothing clipped, the page grew 50 per cent taller | held |
| the fallback stack, with Bahnschrift and Sitka Text both unavailable | Roboto Condensed and Georgia take over. The measuring numbers get wider, so the numbers sitting on the bench drawing's measuring lines are the case to check: they must stay on their lines and not overlap. | no overflow, nothing clipped, the page grew 3 per cent taller | held |
| aeoeaa and the Danish thousands separator, a full stop, in every face and size | 2.200 mm reads as two thousand two hundred and not as two point two, and ae, oe and aa render in both faces and in every fallback. | - | not run |

## Layout

**Path.** See the bench and its 2,4 m limit, enter two measurements in millimetres, watch the pane draw itself onto the bench at the right proportion, choose a glass and a handover, read the total and the falsmaal, then write the cutting specification.

- leading: `.baenk`, `.seddel`, `.skriv`
- supporting: `.glasliste`, `.uge`, `.fod`, `.folk`
- grouping: Everything that is a measurement is on the bench drawing or in the specification, and both are laid on the felt. Everything that is a fact about the workshop, the week, the people, the address, is on the glass ground with nothing under it. A visitor can tell what is theirs and what is the workshop's by what it is lying on.
- density: **measured**, A cutting docket is dense where the numbers are and empty everywhere else. The specification and the price list are packed; the bench drawing has air around it because a drawing needs room to be read as a drawing.
- rhythm: base 8px, which is the docket's own ruling, steps `4px`, `8px`, `16px`, `24px`, `40px`, `64px`, `88px`
- topology: Two columns on the wide view: a drawing that owns the left and a form that owns the right, with the drawing taller than the form so the eye starts on the bench. Below the fold the page is one column of workshop facts, each a band on the glass ground, with the week drawn as its own figure. On narrow the drawing goes full width and the form comes under it, so the order of the argument is the order of the scroll.
- container: The content stops at 1240px and centres. Nothing goes edge to edge except the bands' own grounds, which run full width so a band reads as a surface rather than as a card. Past 1240px the page gains margin and nothing else grows, because a measuring drawing scaled past its own annotation is a picture of a drawing.

**First viewport.** The measured drawing of the cutting bench, with the 2.200 mm limit set off in red chalk, and the visitor's own pane drawn onto it in proportion as soon as the first measurement is typed. `.baenk`
**Signature.** The same bench drawing: an SVG where the 2.200 mm is drawn once and for all and the visitor's pane is drawn onto it at the right proportion, with measuring lines and the numbers sitting on the lines. `.baenk`

### At each width

| width | becomes | departures |
| --- | --- | --- |
| 375 | One column. The bench drawing goes full width at the top and the form comes under it, so the reading order and the scroll order are the same. The drawing's measuring numbers drop from 72px to 19px and the tick weight from 4.5 to 1.2, because a drawing scaled down without redrawing its own annotation is a drawing nobody can read. | the navigation is set two by two rather than wrapping three and one, because a wrapped three and one reads as a missing menu item |
| 768 | Still one column, and the drawing keeps its full width, but the measuring numbers go to 34px and the tick weight to 2.2. The price list becomes a real table rather than stacked rows. | - |
| 1440 | Two columns. The drawing takes the left and roughly three fifths of the width; the form takes the right. The drawing is taller than the form, so the first thing the eye lands on is the bench and not the fields. | the workshop's week is drawn at full width below, and is the only element that ignores the two-column grid, because a week is seven days across and not five sevenths of the page |

**Focus order.** `.spring`, `#bredde`, `#hoejde`, `.skriv`

### Stress

| case | expected | result | verdict |
| --- | --- | --- | --- |
| empty, before any measurement is entered | The bench is drawn with its 2.200 limit and the pane is absent. The price area says what it will show rather than 0 kr, and the drawing reads as a bench waiting rather than as an image that failed to load. | - | not run |
| a measurement under 30 mm and one over 2.200 mm | The message appears under the field that caused it and names the falsmaal it would produce, or the 2,4 m bench. Nothing else on the page moves. | - | not run |
| the longest Danish glass name in the price list at 375 | It wraps within its cell and the price stays on its own line, right aligned, still readable as a column of prices. | - | not run |

**Squint.** Out of focus the page is one large pale rectangle with a darker horizontal band across it, which is the bench, and a lighter block to its right, which is the form. That shape is the argument: the bench is the thing, and the form is what you do to it. If the form were the darker block the page would be a calculator with a picture of a bench next to it, which is a different and worse page.

## Departures from the direction record

- **the direction record names six materials** to **seven primitives plus two derived**: The record counts the materials in the workshop. The contract counts the values the page needs, and two of them are the same materials with air in them: a hairline at 34 per cent and an error ground at 9 per cent. They are derived and say so.
