# Design contract

Written from `.sitesmith/direction.md` after the direction was chosen and before
implementation. The record explains the decision; this is the decision as values.

- surface: **read**
- subject: Vestkystens Froebank, a fictional seed bank in Hvide Sande. One page whose whole job is to get a landowner to say yes to two people walking their dune for one morning in September.
- written against: `.sitesmith/direction.md` @ set-by-check

## Colour

**Strategy.** restrained. The page asks a stranger for something and has to leave room to say no. One colour works and it is the marram grass; everything else is the ground it grows out of and the ink a fieldworker writes in.

### Where the colours come from

| name | material | value | why |
| --- | --- | --- | --- |
| graaklit | lichen and moss on old grey dune, the landscape type the brief names, which is a cool grey-green and never white | `#dfe3d6` | The page ground. It is the thing the landowner owns, and it is what the two collectors will be standing on. Unbleached paper was here first and is the exact warm off-white every generated page lands on; the grey dune is as true to the subject and is nobody else's colour. |
| blaek | ink in a notebook out of doors | `#23272b` | Every line of text and every drawing. The whole method ends in a written record, so the page is written in the same thing. |
| marehalm | marram grass in August, dry and greyish | `#4a5535` | The one colour that works. It carries the season, the one action, and every mark that means something. |
| sand | dry dune sand | `#d3d2be` | The surface the three measured things lie on: the morning, the rule and the season. A landowner can tell what is measured from what is written by what it is lying on. |
| rev | the red in a rusted hinge on a dune gate | `#8f2f20` | Only errors. A rusted hinge is the thing a landowner notices when somebody has been through their gate. |

### Primitives

| token | value | renders as | from |
| --- | --- | --- | --- |
| `--graaklit` | `#dfe3d6` | `#dfe3d6` | graaklit |
| `--blaek` | `#23272b` | `#23272b` | blaek |
| `--marehalm` | `#4a5535` | `#4a5535` | marehalm |
| `--sand` | `#d3d2be` | `#d3d2be` | sand |
| `--rev` | `#8f2f20` | `#8f2f20` | rev |
| `--streg` | `rgba(35, 39, 43, 0.55)` | `#23272b` | derived: blaek at 55 per cent, for the rules that separate the page's own sections |
| `--streg-svag` | `rgba(35, 39, 43, 0.12)` | `#23272b` | derived: blaek at 12 per cent, for surfaces that carry nothing |

### Roles

- **background**: `--graaklit`
- **foreground**: `--blaek`
- **action**: `--marehalm`
- **onAction**: `--graaklit`
- **focusRing**: `--blaek`
- **border**: `--streg`
- **surface**: `--sand`
- **onSurface**: `--blaek`
- **destructive**: `--rev`
- **accent**: `--marehalm`
- **muted**: `--streg`

### Pairs, measured

| pair | state | foreground on background | floor | measured | verdict |
| --- | --- | --- | --- | --- | --- |
| body on the dune | rest | `--blaek` on `--graaklit` | text | 11.53:1 | passes text |
| body on the sand | rest | `--blaek` on `--sand` | text | 9.83:1 | passes text |
| the one action | rest | `--graaklit` on `--marehalm` | text | 6.09:1 | passes text |
| the season's own figure | rest | `--marehalm` on `--sand` | text | 5.2:1 | passes text |
| the focus ring | focus | `--blaek` on `--graaklit` | nonText | 11.53:1 | passes nonText |
| the focus ring on the form | focus | `--blaek` on `--sand` | nonText | 9.83:1 | passes nonText |
| a section rule | rest | `--streg` on `--graaklit` | nonText | 3.25:1 | passes nonText |
| a field's edge at rest | rest | `--blaek` on `--sand` | nonText | 9.83:1 | passes nonText |
| the error message | error | `--rev` on `--sand` | text | 5.29:1 | passes text |
| the invalid field's edge | error | `--rev` on `--sand` | nonText | 5.29:1 | passes nonText |
| the button in flight | active | `--blaek` on `--sand` | text | 9.83:1 | passes text |
| what was sent | success | `--blaek` on `--sand` | text | 9.83:1 | passes text |
| a field that cannot be used yet | disabled | `--blaek` on `--sand` | text | 9.83:1 | passes text |

**Schemes.** light: yes, dark: no. A landowner reads this once, on a telephone in a farmyard or at a kitchen table, in daylight, after somebody mentioned it. A second unmeasured appearance would be two palettes where the page needs one, and the ground is a landscape rather than a neutral: there is no dark version of a grey dune that is still a grey dune.

**Genericness risk.** A pale natural ground with one green accent and a serif for headings is what every conservation body on the internet looks like, and this page will be mistaken for one at a glance. What a competitor cannot arrive at is that the ground is the grey dune rather than paper, that the green is marram in August rather than a brand green, and that the only red on the page is a rusted gate hinge, because a gate left open is the landowner's actual fear.

## Typography

### display: Palatino Linotype

- source: system, ships with Windows; the fallback stack carries the rest (system font, not redistributed)
- weights: `400`, `700`
- fallback: `Book Antiqua`, `Palatino`, `Georgia`, `serif`, metric compatible: yes
- languages: `da`, `en`, loading: `system`, line height 1.25
- why: A book face with a calligraphic root, because the seed bank's own work is a record: a population, a date, a spot on a map. It sets the headings and every number that is a count.
- genericness risk: A serif for headings on a natural ground is the conservation-body default. It is chosen anyway, because the counts are the argument and a book face is what a count belongs in; the difference is that it is used on the numbers and not only on the headlines.

### body: Corbel

- source: system, ships with Windows since Vista; the fallback stack carries the rest (system font, not redistributed)
- weights: `400`, `600`
- fallback: `Candara`, `Optima`, `system-ui`, `sans-serif`, metric compatible: yes
- languages: `da`, `en`, loading: `system`, line height 1.6
- why: A humanist sans with old-style figures by default, so 214, 31, 19 and 50 sit in the line like words rather than like data. The page is an approach to a stranger and has to read as one: a publication face would make it a leaflet and an interface face would make it a form.
- genericness risk: Corbel is on every Windows machine and on almost no website, which is the opposite of the usual risk: the page will look slightly unfamiliar rather than slightly generic. On a machine without it the stack falls to Optima or the system face, and the old-style figures go with it, which is the one thing the choice was for.

### Scale

| step | size | line height | role |
| --- | --- | --- | --- |
| t0 | 13px | 1.4 | labels on a drawing, and the field hints |
| t1 | 15px | 1.5 | captions and the error messages |
| t2 | 17px | 1.6 | body |
| t3 | 21px | 1.4 | the lead paragraph and the counts inside a sentence |
| t4 | 27px | 1.25 | section headings |
| t5 | 40px | 1.1 | the five weeks, and nothing else on the page |

**Measure.** 66 characters, band 45 to 80.

### Stress

| case | expected | result | verdict |
| --- | --- | --- | --- |
| a heading three times its expected length, in Danish | It wraps to three lines in the display face and the drawing under it moves down. Nothing is clipped. | - | not run |
| the page at 200 per cent zoom at 1440 | One column throughout, which it already is, so the only change is that the drawings take their narrow annotation. The form stays usable and the labels stay above their fields. | - | not run |
| aeoeaa in both faces and every fallback, and the place names | Nymindegab, Thyboroen and Hvide Sande render with their ae, oe and aa in both faces and in every fallback. | - | not run |
| the fallback stack, with Palatino Linotype and Corbel both unavailable | Georgia and Optima or the system face take over. The old-style figures go with Corbel, so the case to check is that the counts still sit in their sentences and that the season band's week labels do not collide. | - | not run |

## Layout

**Path.** See the morning drawn as five hours with the work marked on it, read who comes and what they do, meet the rule that answers the fear, see what comes back, see the season, then send the enquiry.

- leading: `.formiddag`, `.regel`, `.forespoergsel`
- supporting: `.folk`, `.tilbage`, `.saeson`, `.sidste`, `.fod`
- grouping: The three measured things lie on the sand: the morning, the rule and the season. Everything the seed bank says in its own words lies on the dune ground with nothing under it. The form is the only thing on the page with an edge around it, because it is the only thing the visitor is asked to do.
- density: **sparse**, A page that asks a stranger for access has to leave room to say no. Crowding the argument is how a request starts to read as a campaign.
- rhythm: base 8px, the ruling of the notebook the whole method ends in, steps `8px`, `16px`, `24px`, `40px`, `64px`, `96px`
- topology: One column at every width, held at 720px and centred, with the three sand surfaces breaking out wider so a drawing has room to be a drawing. The morning is drawn first and its heading sits under it. The form closes the page and is the only bordered thing on it.
- container: The text column stops at 720px and centres. The three sand surfaces break out to 940px. Nothing goes edge to edge, because a page asking permission should not behave as if it owns the screen. Past 940px the page gains margin and nothing grows.

**First viewport.** The morning drawn as a timeline from 07:00 to 12:00 with the three to four hours of work marked as one continuous field, twelve dots for the twelve spots along it, and four metres set off as a scale bar at the first dot so a landowner can see how little four metres is. `.formiddag`
**Signature.** The same timeline. Not a chart: a drawing of one morning, where width is time and the scale bar is four metres. `.formiddag`

### At each width

| width | becomes | departures |
| --- | --- | --- |
| 375 | One column at full width. The morning keeps its full width and drops its hour labels to 07, 09 and 12, and the twelve dots stay, because the dots are the argument and the hours are the frame. The sand surfaces stop breaking out and sit flush with the text. | the 40px figure drops to 30px, because at 375 a 40px number is a quarter of the screen and the season is a fact and not a shout |
| 768 | One column at 720px, centred, and the sand surfaces begin to break out past it. The morning gains every hour label and the four-metre scale bar gains its own caption. | - |
| 1440 | The same one column at 720px, and the sand surfaces break out to 940px. The season band gains a marker per week rather than per fortnight, and the morning's twelve dots gain their own numbers. | the text column does not widen past 720px at any width, which is the departure from what a page with this much space usually does: a request is read once, and a long line is read once badly |

**Focus order.** `.spring`, `a`, `#sted`, `#maaned`, `#kontakt`, `.send`

### Stress

| case | expected | result | verdict |
| --- | --- | --- | --- |
| empty, before anything is typed | The form says what it will ask for and what happens after, so a landowner can decide before they start typing. No field shows a zero or a placeholder pretending to be a value. | - | not run |
| a missing location and an unreadable telephone number | Each message sits under the field that caused it and names what would be acceptable, not that the field is required. | - | not run |
| a month outside the five-week season | The field says which weeks exist and why, and the enquiry is not sent. | - | not run |
| the longest Danish place name on the coast at 375 | It wraps inside its field and the field's rule stays under the whole of it. | - | not run |

**Squint.** Out of focus the page is a pale field with three darker horizontal bands in it, evenly spaced, and one small green mark near the bottom. The bands are the morning, the rule and the season, which are the three things a landowner has to believe; the green mark is the one thing they can do. That shape is the argument. If the green mark were as large as the bands, the page would be a campaign asking for a conversion rather than a request that can be refused.

## Departures from the direction record

- **the record's first ground, unbleached paper #f2efe6** to **the grey dune #dfe3d6**: The gate refuses a colour within twelve units of the anti-tell palette's warm off-whites, and unbleached paper is five units from one of them. It was right to: a warm off-white ground is the single most reproduced choice there is. The brief names the grey dune as one of its two landscape types, so the material was changed rather than the check waived.
- **the muted rule colour on the disabled field's sentence** to **full ink**: It measured 3.1 to 1 and failed the 4.5 floor. WCAG exempts a disabled control, and it does not exempt the sentence telling a reader what would make the control usable: that is a message. The contract caught it before implementation.
- **Segoe UI Variable Text as the body face** to **Corbel**: The lock keeper's console already uses Segoe UI Variable Text for its prose. Two pilots sharing a face makes the difference between them a matter of colour rather than of voice, and Corbel's old-style figures are a better answer for a page whose argument is a handful of counts inside sentences.
