# Design contract

Written from `.sitesmith/direction.md` after the direction was chosen and before
implementation. The record explains the decision; this is the decision as values.

- surface: **operate**
- subject: Bjerregaard Sluse, a fictional canal lock. The overnight console for one lock keeper, 22:00 to 06:00.
- written against: `.sitesmith/direction.md` @ set-by-check

## Colour

**Strategy.** drenched. The keeper sits in a lock house at two in the morning with the lights down. A pale screen on a second monitor is a lamp pointed at their face for eight hours. Colour is the surface here, and the surface is the room: canal water at night under one lamp, wet chamber concrete, and the cone of a work lamp on it.

### Where the colours come from

| name | material | value | why |
| --- | --- | --- | --- |
| slusevand | canal water looked down into at night under one lamp | `#0f1a1f` | The page ground. It is what the keeper is looking at out of the window when they are not looking at the screen. |
| kammer | the chamber wall concrete below the waterline, wet | `#16242b` | The surface the ribbon and the ranked rows lie on. Wet concrete is not black; it is a colour, and one shade off the water. |
| lygte | the cone of a work lamp on wet concrete, which is a cool light and not a warm one | `#dfeae6` | Every reading and every line of text. It is the only light in the room and so it is the only light on the page. It was #e8ece4 first, and the gate refused it at 8 units from a cream the anti-tell palette names; a work lamp on wet concrete is genuinely cooler than a cream, so the material was looked at again rather than the check being waived. |
| messing | the brass plates on the gate motor housing, polished by hands | `#c9a227` | Brass is the one thing in a lock house that is neither grey nor green. It carries what is urgent, and it carries the one action. |
| tovvaerk | the greenish rope on the bollards | `#7f8f7a` | What is in order. Rope is the thing that is always fine until it is not. |
| rust | the rust on the gate fittings, wet and under the lamp | `#dd7050` | Failure and refusal. The dry rust #b4462a was written in the record first and measured 2.91 against the chamber concrete; the contract found it before a line of code was written. |

### Primitives

| token | value | renders as | from |
| --- | --- | --- | --- |
| `--slusevand` | `#0f1a1f` | `#0f1a1f` | slusevand |
| `--kammer` | `#16242b` | `#16242b` | kammer |
| `--lygte` | `#dfeae6` | `#dfeae6` | lygte |
| `--messing` | `#c9a227` | `#c9a227` | messing |
| `--tovvaerk` | `#7f8f7a` | `#7f8f7a` | tovvaerk |
| `--rust` | `#dd7050` | `#dd7050` | rust |
| `--taage-kant` | `rgba(223, 234, 230, 0.45)` | `#dfeae6` | derived: lygte at 45 per cent, for the rules that separate ranked items and therefore mean something |
| `--taage-flade` | `rgba(223, 234, 230, 0.09)` | `#dfeae6` | derived: lygte at 9 per cent, for surfaces that mean nothing |

### Roles

- **background**: `--slusevand`
- **foreground**: `--lygte`
- **action**: `--messing`
- **onAction**: `--slusevand`
- **focusRing**: `--messing`
- **border**: `--taage-kant`
- **surface**: `--kammer`
- **onSurface**: `--lygte`
- **warning**: `--messing`
- **destructive**: `--rust`
- **success**: `--tovvaerk`
- **muted**: `--tovvaerk`

### Pairs, measured

| pair | state | foreground on background | floor | measured | verdict |
| --- | --- | --- | --- | --- | --- |
| text on the ground | rest | `--lygte` on `--slusevand` | text | 14.35:1 | passes text |
| readings on the chamber | rest | `--lygte` on `--kammer` | text | 12.9:1 | passes text |
| what is urgent | rest | `--messing` on `--kammer` | text | 6.57:1 | passes text |
| what is in order | rest | `--tovvaerk` on `--kammer` | text | 4.63:1 | passes text |
| the action | rest | `--slusevand` on `--messing` | text | 7.31:1 | passes text |
| the focus ring | focus | `--messing` on `--slusevand` | nonText | 7.31:1 | passes nonText |
| the focus ring on the chamber | focus | `--messing` on `--kammer` | nonText | 6.57:1 | passes nonText |
| a rule between ranked items | rest | `--taage-kant` on `--kammer` | nonText | 3.73:1 | passes nonText |
| a failed request | error | `--rust` on `--kammer` | text | 4.93:1 | passes text |
| the edge of a failed control | error | `--rust` on `--kammer` | nonText | 4.93:1 | passes nonText |
| a reading that has gone stale | disabled | `--tovvaerk` on `--kammer` | text | 4.63:1 | passes text |
| a control in flight | active | `--slusevand` on `--tovvaerk` | text | 5.15:1 | passes text |
| an acknowledged item | selected | `--tovvaerk` on `--slusevand` | text | 5.15:1 | passes text |

**Schemes.** light: no, dark: yes. The use scene decides this, and it decides it the other way from most pages. One keeper, alone, from 22:00 to 06:00, in a lock house with the lights down, walking out into the dark every hour with a torch. A light screen destroys the night vision they need for the walk they are about to take. There is no light scheme because there is no daylight in the shift this page exists for, and the page says so rather than shipping a second unmeasured appearance. Every pair above is a dark-scheme pair.

**Data.** 5 series, categorical. Without colour: Each reading has its own row and its own lane on the ribbon, so the difference between them is position rather than hue. The gate angles are drawn as angles, the radio window is drawn as a physical gap, and every event on the ribbon carries its own time as text.

**Genericness risk.** A dark console with one warm accent is the most reproduced look in this category: half the dashboards on the internet are near-black with an amber alert colour, and this page will be mistaken for one of them at a glance. What a competitor cannot arrive at is why. The ground is canal water at night rather than a neutral; the surface is wet concrete one shade off it; the accent is the brass on the motor housing rather than an alert colour; and the reason the page is dark at all is the walk into the dark that follows reading it.

## Typography

### data: Cascadia Mono

- source: system, ships with Windows and with Visual Studio Code; the fallback stack carries the rest (SIL Open Font License 1.1, not redistributed here)
- weights: `400`, `600`
- fallback: `Consolas`, `SF Mono`, `ui-monospace`, `monospace`, metric compatible: yes
- languages: `da`, `en`, loading: `system`, line height 1.35
- why: Every number on this screen is a reading that has to be compared with the same reading ten minutes earlier. Numbers compared vertically have to line up vertically, and tabular figures are the entire reason this face is here rather than a proportional one.
- genericness risk: A monospace for numbers on a dark console is what every terminal-styled dashboard does. The difference here is that it is only on the readings: the prose is not monospace, so the face marks the boundary between what was measured and what was written.

### body: Segoe UI Variable Text

- source: system, ships with Windows 11; the fallback stack carries the rest (system font, not redistributed)
- weights: `400`, `600`
- fallback: `Segoe UI`, `system-ui`, `sans-serif`, metric compatible: yes
- languages: `da`, `en`, loading: `system`, line height 1.5
- why: The keeper's own language, set in what the screen they are already looking at is set in. A console read on a second monitor for eight hours is not the place for a face anyone notices.
- genericness risk: This is the highest genericness risk on the page and it is chosen anyway. Segoe UI is the most ordinary interface face in existence. The argument is that on this surface an unremarkable prose face is correct, and the typographic decision is carried by the monospace boundary rather than by the prose face.

### Scale

| step | size | line height | role |
| --- | --- | --- | --- |
| s0 | 12px | 1.35 | the age on a reading, and the column heads |
| s1 | 14px | 1.4 | a reading, and the log lines |
| s2 | 16px | 1.5 | body, and the sentence that sorted an item |
| s3 | 20px | 1.35 | the name of an item in the ranked list |
| s4 | 28px | 1.2 | section headings, and the top item's name |
| s5 | 44px | 1.05 | the one value that decides what is urgent, and nothing else on the page |

**Measure.** 62 characters, band 45 to 80.

### Stress

| case | expected | result | verdict |
| --- | --- | --- | --- |
| a reading name three times its expected length, in Danish | It wraps within its column and the reading and its age stay on the same line as each other. The ribbon does not move. | - | not run |
| the console at 200 per cent zoom at 1440 | The ranked list becomes the 375 arrangement: one column, the ribbon full width above it, the readings stacked under their names. Nothing is clipped, and the ribbon's hour labels drop to every second hour rather than shrinking. | - | not run |
| the fallback stack, with Cascadia Mono and Segoe UI Variable Text both unavailable | Consolas and Segoe UI take over. Both are metrically close, so the columns stay in line; the case to check is that the 44px figure still fits its line and that the ribbon's time labels do not collide. | - | not run |
| aeoeaa and the degree sign, in both faces and every fallback | 71 grader renders with its degree sign in the monospace, and slusevagt, portmotor and maaling render their ae, oe and aa in both faces. | - | not run |

## Layout

**Path.** See the shape of the night on the ribbon, read the top item and why it is top, act on it, watch the act land or fail, then read what happened and what is missing.

- leading: `.baand`, `.post-top`
- supporting: `.liste`, `.log`, `.slag`, `.fod`
- grouping: Everything measured is on the concrete: the ribbon, the rows, the log. Everything written by a person or by this page is on the water: the headings, the sentence that sorted an item, the footer. The keeper can tell an instrument from an interpretation by what it is lying on.
- density: **packed**, A keeper who looks every two minutes needs the whole shift on one screen at once. Air between rows is air that costs a row, and a row that is off screen is a row that is not ranked.
- rhythm: base 4px, because a row of readings is ruled paper and the ruling is tight, steps `4px`, `8px`, `12px`, `20px`, `32px`, `56px`
- topology: One column at every width, always. The ribbon spans the top, the ranked list runs under it with the top item full width and taller than the rest, the log runs under that with the newest first, and the cycles figure closes it. There are deliberately no side-by-side columns even at 1440: a keeper reads top to bottom, and two columns are two places to look.
- container: The content stops at 1100px and centres. Nothing goes edge to edge except the ribbon's own ground, which runs full width because a night does not have margins. Past 1100px the page gains margin and nothing grows, because a wider ribbon is not a longer night.

**First viewport.** The ribbon: eight hours of the shift drawn as one horizontal band with every event sitting at its own time, the eleven cycles marked at their real durations, and the radio window from 02:40 to 02:46 drawn as a physical gap with the four missing readings named in it. `.baand`
**Signature.** The same ribbon. Not a chart: a band where width is time and the hole is absence. `.baand`

### At each width

| width | becomes | departures |
| --- | --- | --- |
| 375 | The ribbon keeps its full width and drops its hour labels to every second hour, because eight labels in 375 pixels is eight labels nobody can read. The ranked rows lose their column layout and each becomes a small block: name, then the figure, then the age, then the sentence that sorted it. The log becomes one line per event with the time first. | the 44px figure drops to 32px, because at 375 a 44px number is a third of the screen and the ranking is what matters, not the size of one digit |
| 768 | The ribbon keeps every hour label. The ranked rows regain their columns: name, figure, age, and the sentence that sorted them, with the figure right aligned so the column can be read down. | - |
| 1440 | The same one column, held at 1100px and centred. The ribbon gains its half-hour grid between the hours, the rows gain a column for the reading's own limit so the sorting arithmetic can be checked against it, and the cycles figure gains its 11-minute norm line. | the page does not become two columns at any width, which is the departure from what a console is expected to do and is argued in the record |

**Focus order.** `.spring`, `a`, `#kvitter-motor`, `#hold-motor`

### Stress

| case | expected | result | verdict |
| --- | --- | --- | --- |
| empty, at the start of a shift before any reading has arrived | The ribbon is drawn with its eight hours and no events on it. Each reading says what it is waiting for and from where, not zero. The ranked list says there is nothing ranked yet, and why. | - | not run |
| partial: the radio window from 02:40 to 02:46 | The four missing readings are named as missing, in that window, on the ribbon and in the log. Nothing is interpolated across the gap, and the ribbon is drawn with an actual hole in it. | - | not run |
| a hold request that fails on the radio link | The failure lands on the item the request was made against, says the request did not reach the lock house, and leaves the item exactly as it was. The control returns to its rest state. | - | not run |
| the longest Danish reading name at 375 | It wraps within its block, and the figure and the age stay together on their own line. | - | not run |

**Squint.** Out of focus the page is a dark field with one bright horizontal band at the top, one bright block under it, and then a texture of small marks fading down. The band is the night, the block is the thing closest to going wrong, and the texture is everything that is fine. That shape is the argument: the night has a form, one thing in it needs a person, and the rest is a texture nobody has to read. If the texture were as bright as the block, the screen would have sorted nothing, which is the failure the brief names.

## Departures from the direction record

- **the record's rust, #b4462a** to **#dd7050**: The dry rust measured 2.91 against the chamber concrete, below the 4.5 floor for the error text it carries. Wet rust under a lamp is lighter than dry rust, so the material still holds. The contract caught it before implementation, which is the whole reason it is written before implementation.
- **the lamp light, #e8ece4** to **#dfeae6**: The gate refused it at 8 units from #efeae0, a cream that taste-skill names as the second-most-recurring AI tell. The escape hatch it offers is a line saying the brief pinned the palette, and the brief did not, so writing it would have been a lie. A work lamp on wet concrete is a cool light rather than a warm one, so the material was looked at again and the value moved 17 units away. The contrast on both grounds is unchanged to within a tenth.
- **the focus order first written into this contract, which put the two controls before the menu** to **.spring, then the menu anchors, then the controls**: The contract was wrong about the page and compare said so. The shell sits above the ranked list in the DOM, so the keyboard reaches the four section anchors before it reaches the top item's controls, and that is the right order: a keeper who tabs is navigating before they are acting. The skip link exists so they do not have to.
