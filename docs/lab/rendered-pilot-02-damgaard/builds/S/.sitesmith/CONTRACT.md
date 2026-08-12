# Design contract

Written from `.sitesmith/direction.md` after the direction was chosen and before
implementation. The record explains the decision; this is the decision as values.

- surface: **buy**
- subject: Damgaard Estrik: book a fugtgennemgang, or find out in under thirty seconds why not.
- written against: `.sitesmith/direction.md` @ f882fd5c6bbc656c

## Colour

**Strategy.** restrained. The ground and the ink are the whole visual identity. The only saturated colours on the page are semantic, borrowed from a moisture meter's own dry and wet bands, and neither appears until the page has something to say with it: the dry mark only on a confirmed booking, the wet tone only once a submission has actually failed.

### Where the colours come from

| name | material | value | why |
| --- | --- | --- | --- |
| beton | afretningslag, cured, seen under a work light | `rgb(188, 187, 182)` | the page ground is this trade's own levelling layer, not a design-system grey |
| overflade | the drier top skin of the same slab, a few hours further into the same cure | `rgb(214, 213, 207)` | panels sit a shade lighter than the ground the way a drier surface reads lighter than a curing one |
| blaek | a måleteknikers notat i loggen, kuglepen på papir | `rgb(35, 33, 30)` | text and the one committed action are written in the same ink a reading gets logged in |
| papir | the pale field a measurement log's numbers sit inside | `rgb(224, 226, 231)` | the label on the filled control reads as ink on that same log paper |
| graense | a pencil line ruled against a straightedge on site paperwork | `rgb(140, 138, 132)` | purely decorative section dividers; never asked to carry meaning on its own |
| toerret | the green band on a fugtmåler's face once a reading is low enough to act on | `rgb(52, 110, 55)` | the one mark of a booking having gone through, taken from the instrument that decides when a floor is dry, not from a brand kit |
| fugtig | the same meter's red band, before that | `rgb(110, 42, 24)` | the Fejl state's colour, because it already means 'not yet' on the one instrument this trade actually reads |

### Primitives

| token | value | renders as | from |
| --- | --- | --- | --- |
| `--beton` | `rgb(188, 187, 182)` | `#bcbbb6` | beton |
| `--overflade` | `rgb(214, 213, 207)` | `#d6d5cf` | overflade |
| `--blaek` | `rgb(35, 33, 30)` | `#23211e` | blaek |
| `--papir` | `rgb(224, 226, 231)` | `#e0e2e7` | papir |
| `--graense` | `rgb(140, 138, 132)` | `#8c8a84` | graense |
| `--toerret` | `rgb(52, 110, 55)` | `#346e37` | toerret |
| `--fugtig` | `rgb(110, 42, 24)` | `#6e2a18` | fugtig |

### Roles

- **background**: `--beton`
- **foreground**: `--blaek`
- **action**: `--blaek`
- **onAction**: `--papir`
- **focusRing**: `--blaek`
- **border**: `--blaek`
- **surface**: `--overflade`
- **onSurface**: `--blaek`
- **success**: `--toerret`
- **destructive**: `--fugtig`
- **onDestructive**: `--papir`

### Pairs, measured

| pair | state | foreground on background | floor | measured | verdict |
| --- | --- | --- | --- | --- | --- |
| body-on-ground | rest | `--blaek` on `--beton` | text | 8.35:1 | passes text |
| body-on-surface | rest | `--blaek` on `--overflade` | text | 10.92:1 | passes text |
| cta-label | rest | `--papir` on `--blaek` | text | 12.39:1 | passes text |
| focus-ring-on-ground | focus | `--blaek` on `--beton` | nonText | 8.35:1 | passes nonText |
| focus-ring-on-surface | focus | `--blaek` on `--overflade` | nonText | 10.92:1 | passes nonText |
| input-border | rest | `--blaek` on `--overflade` | nonText | 10.92:1 | passes nonText |
| error-text-on-ground | error | `--fugtig` on `--beton` | text | 5.44:1 | passes text |
| error-text-on-surface | error | `--fugtig` on `--overflade` | text | 7.11:1 | passes text |
| success-mark-on-surface | success | `--toerret` on `--overflade` | nonText | 4.16:1 | passes nonText |

**Schemes.** light: yes, dark: no. The brief's own reading scene is a phone, the same evening a floor got wet, which is exactly when a screen is brightest against a dark room; this page is read once, to make one decision, not operated for hours at a workbench, so it does not carry the maintenance cost of a second scheme it has no evidence anyone needs.

**Genericness risk.** A neutral grey-and-ink palette is an easy place to end up by not deciding anything; what keeps this one specific is that the grey is named and sourced as cured screed, this trade's own material, rather than a generic design-system 'off-white' or 'slate', and both accents are borrowed from the one instrument this trade actually reads rather than chosen as a brand colour.

## Typography

### display: Space Grotesk

- source: Google Fonts, self-hosted at build time via next/font/google (SIL Open Font License 1.1)
- weights: `500`, `600`, `700`
- fallback: `ui-sans-serif`, `system-ui`, `Segoe UI`, `Arial`, `sans-serif`, metric compatible: yes
- languages: `da`, loading: `swap`, line height 1.1
- why: a geometric grotesk with a stencilled, site-sign character, used for headings and for the instrument's own numerals, closer to a marked steel plate than to a magazine display face
- genericness risk: a grotesk display face alone is a common technical-page reach; what is specific here is using it for the instrument's numerals as well as headings, and pairing it with a text serif rather than a second sans

### body: Source Serif 4

- source: Google Fonts, self-hosted at build time via next/font/google (SIL Open Font License 1.1)
- weights: `400`, `600`
- fallback: `Georgia`, `Times New Roman`, `serif`, metric compatible: yes
- languages: `da`, loading: `swap`, line height 1.6
- why: a working text serif for the long refusal and unknowns lists, chosen so the display face is not fighting a second sans for the same job; most pages in this category reach for the reverse pairing
- genericness risk: a serif body is unusual on a trades page specifically because the category defaults to sans; the risk is reading as a mismatch rather than a decision if the display face is not clearly doing a different job

### Scale

| step | size | line height | role |
| --- | --- | --- | --- |
| display-lg | clamp(2.25rem, 1.6rem + 2.6vw, 3.5rem) | 1.05 | h1 |
| display-md | clamp(1.5rem, 1.3rem + 0.9vw, 2rem) | 1.15 | h2, instrument readout numerals |
| body | 1rem | 1.6 | paragraph, list item, form label |
| small | 0.875rem | 1.5 | caption, legend, footer meta |

**Measure.** 66 characters, band 45 to 75.

### Stress

| case | expected | result | verdict |
| --- | --- | --- | --- |
| a heading three times its expected length | rendering "Udtørring og reetablering af gulvkonstruktioner efter skybrud, stormflod eller sprunget rør i Lemvig-området" as the h1 wraps to two or three lines at the display size with no truncation and no automatic shrink | no overflow, nothing clipped, the page grew 4 per cent taller | held |
| the page's own language at 200 per cent zoom | the layout stays single-column-safe with no horizontal scroll and no clipped or overlapping text, equivalent to a 320 CSS-pixel viewport | no overflow, nothing clipped, the page grew 12 per cent taller | held |
| the fallback stack, with the webfont blocked | next/font's automatic size-adjusted fallback keeps line count and box height the same as the real face; letterforms change, layout does not | no overflow, nothing clipped, the page is the same height | held |

## Layout

**Path.** Land on the disclaimer and the instrument together, read the price, the 75 km limit and the three refusals beside it, then either scroll to the booking form or leave inside thirty seconds; after a successful submission, land on the confirmation carrying the sagsnummer and the before-arrival list.

- leading: `.disclaimer`, `.instrument`, `h1`, `.hero-facts`, `.cta--book`
- supporting: `nav`, `.proces`, `.prisliste`, `.kapacitet`, `.regler`, `.ukendt`, `.raekkevidde`, `footer`
- grouping: Everything a visitor needs to self-select, the price, the radius and the three refusals, groups inside .hero-facts beside the instrument, ahead of the form. Everything about the mechanics of a booked job, the process, capacity, rules and unknowns, groups after the form, in the order a customer would actually reach those questions. Contact and the legal disclaimer group only in the footer, repeated from the top.
- density: **measured**, The brief's own argument is that withholding a fact costs a visitor a wasted evening, so more of this page carries a checkable fact than a typical landing page would; nothing is crammed, the numbered process and the price table both get room to read as a table, not squeezed into paragraphs.
- rhythm: base 1rem (16px) grid, steps `0.5rem`, `1rem`, `1.5rem`, `2.5rem`, `4rem`
- topology: a single scrolling column of stacked sections, each opening with a short heading and most closing with a repeated commit control, never a hub-and-spoke or a tabbed layout
- container: a single max-width column (max-width: 72rem) centred with fluid outer padding from clamp(1rem, 4vw, 4rem); nothing is full-bleed except the header and footer bands, which carry the same padding on their inner content instead

**First viewport.** the borehul cross-section diagram `.instrument`
**Signature.** the borehul cross-section diagram `.instrument`

### At each width

| width | becomes | departures |
| --- | --- | --- |
| 375 | single column throughout; .hero-facts stacks the price, the 75 km limit and the three refusals as full-width blocks in that order beneath .instrument; the header collapses to the wordmark plus one .cta--book; the price table stays two columns (ydelse, pris) since its cell text wraps rather than needing to stack | the plan named a simplified annotation density for .instrument at this width; the shipped drawing keeps every label at every width instead, because the SVG's own label count was already modest enough to stay legible scaled down, and a width-conditional label set was not built |
| 768 | .instrument and .hero-facts sit in two equal columns side by side, an even split rather than the 1440 ratio, because an uneven split left .hero-facts narrower than the 45-character measure floor at this width; .proces stays one column, each step's number beside its text; the price table is unchanged from 375 | the plan named .proces running two-up at this width; the shipped list stays one column at every width instead, because a narrower per-card column pushed the process text below the 45-character measure floor and stacking was the direct fix |
| 1440 | .instrument and .hero-facts return to the plan's 3:2 split, the instrument at roughly three-fifths width; .proces and the price table are unchanged from 768, since neither needed more columns and more columns would have narrowed their prose again | - |

**Focus order.** `.skip-link`, `.cta--book`, `#navn`, `.cta--book`

### Stress

| case | expected | result | verdict |
| --- | --- | --- | --- |
| a postnummer with no match in the distance table and no plausible nearest prefix (a mistyped three-digit value) | treated as invalid input and refused with a plain message asking for a real four-digit postnummer, never silently accepted as in-range | manually driven with Playwright (a browser render alone cannot submit a form and follow a redirect): postnummer "762" was refused server-side with "Skriv et rigtigt firecifret postnummer." and never reached /kvittering | held |
| no client-side JavaScript | the booking form still submits by an ordinary POST to the server action, and Tom, Fejl and Kvittering are all still reachable, because Fejl and Kvittering are simply what the same route renders after a real submission | manually driven with Playwright, javaScriptEnabled: false: a valid submission reached /kvittering, and postnummer 2200 produced the exact pinned Fejl text, both with the browser's JS disabled | held |

**Squint.** a dark diagram block top-left balanced by a lighter text block top-right, a hard grey rule, then a dense grey field of short lines (the fact lists) with one darker bar recurring at intervals, the repeated .cta--book. The instrument and the repeated commit control are what stays legible out of focus; that is the argument: look, then act.
