# Visual audit of the nine legacy benchmark pages

What was examined: `benchmarks/01`–`09` as they stand at `f73fb89`, rendered at 1440×900 in
Chromium, both as first-viewport captures and as full-page captures, and read at source
level for typography, palette, markup and script. The nine pages are ten HTML files —
`06-redesign` carries a `before/` control that is supposed to fail.

This audit is about what the pages look like and what they are made of. The technical gate
is separate and is not being re-litigated here: these pages pass it, and passing it is what
makes the problem visible. A set can be responsive, accessible in both colour schemes, free
of console errors and internally consistent, and still be nine variations of one template
with the nouns changed.

**Verdict.** Six of the nine pages could be rebadged for a different company by editing the
logo and the copy, with no change to the layout, the type or the palette recipe. All nine
use the same operating-system font stack. All nine build their palette from the same
five-token recipe with one hue rotated. Three ship an empty coloured square as the brand
mark. Zero contain a photograph, an illustration, a diagram or any drawn asset. Zero contain
a line of JavaScript, so no interaction journey in the set has ever been exercised — every
state visible in the screenshots is painted, not reached.

---

## 1. Repeated hero structures

Five of the nine marketing-shaped pages open with the same object. Left column: a
letterspaced uppercase eyebrow, a large headline of three or four lines, a lede paragraph,
a pair of buttons (one filled, one outlined), and a small qualifying line under them. Right
column: a single card, inset from the top, holding a monospaced artifact.

| Page | Eyebrow | Headline | Two buttons | Right-hand card |
| --- | --- | --- | --- | --- |
| 01 saas-landing | `INCIDENT REVIEW, FOR TEAMS WHO…` | 3 lines | Connect a channel · See a finished review | incident log |
| 04 local-service | — | 4 lines | Call 0114… · See typical prices | hatched image placeholder |
| 06 redesign/after | `ROTA SOFTWARE FOR SHIFT-BASED TEAMS` | 4 lines | Book a walkthrough · See what we can prove | rota grid |
| 05 editorial | `SOUND DESIGN & FIELD RECORDING — OSLO` | 4 lines | — | text column |
| 02 product-page | `1440P / HIGH REFRESH` | product name | Add to basket · See the test results | buy box (the card *is* the right column) |

01 and 06 are the same page. Same header (wordmark left, three links and one button right),
same split hero, same alternating off-white bands, same numbered or labelled list section,
same hairline definition table, same closing band with a heading on the left and two buttons
on the right, same footer with a disclaimer line on the right. They differ in hue and in
whether the display face is a serif. Put the two full-page captures side by side and the
section rhythm matches band for band.

04 and 05 are the same skeleton with pieces removed rather than a different idea about how
the page should be built.

The three pages that escape — 07 (civic form), 08 (documentation shell), 09 (goods-in
console) — escape because their *surface* dictates a layout, not because a direction was
chosen. 07's layout is the GOV.UK service pattern; 08's is the standard three-column docs
shell; 09's is a dense operational table. Each is competent and appropriate. None of them
is an art-direction decision that could have gone another way.

## 2. Repeated typographic moves

The finding here is not "similar", it is "identical".

```
--sans: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif   ×9
--mono: ui-monospace, 'SF Mono'/'Cascadia', 'Segoe UI Mono', monospace            ×8
--serif/--display: 'Iowan Old Style', 'Palatino Linotype', Palatino, …            ×2
```

Nine pages, one sans stack. Every headline in the set is the reader's operating-system UI
font. The single typographic decision made anywhere in the nine is the Iowan Old Style
serif, and it is the same serif in both places it appears (01 and 05). 04 reorders the
stack to put `'Segoe UI'` first; that is the extent of the variation.

The same three devices recur:

1. **Letterspaced uppercase mono eyebrow** above the headline or above a section heading.
   Present in eight of nine (`text-transform: uppercase` plus `letter-spacing` in the same
   rule: 01×2, 02×2, 03×2, 05×1, 06×2, 07×4, 08×5, 09×3). It is the set's signature move
   and it is doing the same job every time: signalling "considered" without committing to
   anything.
2. **Tight negative tracking on the wordmark** — `letter-spacing:-.03em` on 03, `-.03em` on
   04, `-.035em` on 06.
3. **One accent word or number in the accent colour** inside an otherwise monochrome
   headline or figure (05's italic *before*, 06's `99.94%`, 01's `checkout-p99`).

## 3. Repeated colour and surface patterns

Every page is built from the same five-token recipe:

```
--paper / --bg / --page   one off-white
--ink, --ink-2, --ink-3   a three-step neutral ramp, always exactly three
--accent                  one hue
--accent-soft             a pale tint of that hue for badges and row highlights
@media (prefers-color-scheme: dark)  the same tokens, re-declared
```

The nine light backgrounds: `#faf8f4`, `#f4f6f8`, `#f7f8f9`, `#fdfcf8`, `#f7f5ef`,
`#f5f3f0`, `#f3f2f1`, `#fdfcf9`, `#f1f1ee`. Seven are warm near-white; two are cool
near-white. Nothing in the set is saturated, dark by default, high-contrast, duotone,
paper-textured, or anything other than an off-white page with dark text on it.

The accents do vary — ember `#b8441f`, acid `#b6f24e`, teal `#0e4f4a`, forest `#163a2b`,
mark-red `#d4553a`, navy `#1f4d7a`, rust `#9a3410`, amber `#6d4a00` — but each is deployed
by the same rule:
one hue, one soft tint, brightened for dark mode, used on the primary button, one link
colour and one badge. Rotating the hue is not art direction. It is a variable.

Surfaces are equally uniform: a white or near-white card on a slightly darker band, one
hairline, a radius somewhere between 5 and 10px, and either no shadow or one soft shadow.
No page uses a border as a structural device, a full-bleed image, an overlap, a rule-based
grid you can see, or a hard edge instead of a radius.

## 4. Placeholders

Two kinds, and the second is worse than the first.

**Labelled placeholders — honest, but still placeholders.**

| Page | Where | Text |
| --- | --- | --- |
| 02 product-page | main product shot + 4 thumbnails | "Placeholder render. Product photography is not included in this benchmark build." |
| 04 local-service | hero image | "Photograph of a completed flat roof would sit here" |

Both render as a diagonally hatched box. In 02 the hatched box occupies roughly half the
first viewport of a product page, which is to say the page omits the one thing a product
page exists to show.

**Unlabelled placeholders — presented as if they were the finished mark.**

| Page | Markup | Rendered |
| --- | --- | --- |
| 03 dashboard | `.mark span{width:19px;height:19px;border-radius:5px;background:var(--teal)}` | empty teal square |
| 04 local-service | `.logo i{width:26px;height:26px;border-radius:5px;background:var(--forest)}` | empty green square |
| 06 redesign/after | `.mark i{width:22px;height:22px;border-radius:5px;background:var(--blue)}` | empty navy square |

Three pages ship a blank coloured box next to the company name and call it a logo. Nothing
labels these as unfinished, so unlike the hatched image boxes they do not read as "asset
pending" — they read as "this is the identity". The favicons are the same idea taken one
step further: all nine are a 32×32 `<rect>` filled with the brand colour carrying one to
three white strokes, six of them with a 6–8px corner radius. It is the generic app-icon
construction, drawn nine times, and it is the most repeated visual device in the set.

Every page also carries a footer disclaimer — "A fictional product, built as a design
benchmark", "Kestrel, the suppliers and every figure here are invented for this benchmark",
"Relay is a fictional service written for this benchmark". These are correct and should
stay. They are noted here only because they are the ninth repeated element: the same
sentence, in the same position, in the same muted grey, on all nine pages.

## 5. Missing subject-world material

The subject's world is present in all nine pages **as copy** and in none of them **as visual
material**.

The writing is genuinely specific and is the strongest thing in the set: `PM-1150 Fluting
medium 105gsm`, `hollis-lane-cafe-PL-schedule.pdf`, "the bit above your kitchen extension",
"leave it another two winters", `TX-4471-902 · Northgate Logistics · 31 days`. Someone
thought about these businesses.

Nothing followed that thinking into the visual layer:

| Page | Subject | What its world looks like | What the page shows |
| --- | --- | --- | --- |
| 01 | incident review tool | terminals, graphs, Slack threads, oncall pagers | one mono log card |
| 02 | custom PC retailer | the machine, components, the test bench, packaging | hatched boxes |
| 04 | flat-roof contractor | roofs, felt, standing water, a van, hands | hatched box |
| 05 | film sound designer | waveforms, field kit, locations, film stills | nothing |
| 06 | rota software | shift boards, ward corridors, printouts | one table card |

`<img>` elements across the nine pages: **one**, and it is the placeholder in 02.
Background images: **zero**. Illustrations, diagrams, textures, drawn marks: **zero**.

For 07, 08 and 09 this is defensible — a council form, an API reference and a warehouse
console are legitimately made of text and data, and adding photography would be worse. For
01, 02, 04, 05 and 06 it is the central failure. A roofing company with no photograph of a
roof is not a design decision; it is an unfinished page with a note explaining that it is
unfinished.

## 6. Missing interaction journeys

```
<script> tags across all ten HTML files: 0
```

Every interactive-looking element in the set is painted:

- **02** has five radio inputs and an "Add to basket — £1,689" button. Selecting *2 TB NVMe
  (+£74)* changes nothing; the price in the button is a string.
- **03** has "All / Over 14 days / Flagged" filter buttons and an "Auto-match term deposits"
  action. None of them filters or acts. The disabled "Bulk match (select rows)" state is
  drawn, not derived.
- **07** shows an error summary, a completed upload with a "SCANNED, CLEAN" tag, and a field
  in its error state. It is step 3 of 4, permanently. There is no step 2 and no step 4.
- **09** shows a row mid-edit with an `EDITING` badge, two selected rows, a reason-code
  prompt and a keyboard legend (`Enter edit count`, `R reason code`, `Space select`). None
  of those keys does anything.

This is the finding with the widest consequences. The pages that show states — and 07 and 09
show them unusually well — are showing a *screenshot* of a state. Nothing verifies that the
state is reachable, that the transition into it works, that focus lands anywhere sensible,
or that the empty, loading, error and success variants are consistent with each other. There
is no journey in the set to test, so the existing verification has never tested one.

## 7. The rebadge test

Could this page be reused for a different company by changing only the logo and the copy?

| Page | Rebadgeable | What would have to change | Why |
| --- | --- | --- | --- |
| 01 saas-landing | **yes** | copy only | swap the log lines for support tickets and it is a helpdesk product |
| 02 product-page | **yes** | copy only | the canonical PDP; works for any configurable good |
| 03 dashboard | **yes** | copy only | KPI row, table, two panels — any back-office queue |
| 04 local-service | **yes** | copy only | works unchanged for a plumber, an electrician, a glazier |
| 06 redesign/after | **yes** | copy only | structurally the same page as 01 |
| 08 documentation | **yes** | copy only | the standard docs shell; any API |
| 05 editorial | **partly** | copy, and the index rows survive | the numbered index and the italic accent do carry a view; still transfers to an architect or a photographer unchanged |
| 07 multistep-form | **no** | the whole pattern | the GOV.UK vocabulary means "government"; rebadging it as a private company would be a lie. But the direction is borrowed, not authored |
| 09 data-entry | **no** | the table would have to be rebuilt | expected/counted/variance/reason-code is the actual shape of goods-in work |

**Six of nine transfer with a logo and a copy edit. One transfers with a small amount of
work. Two do not** — and in both of those cases the reason is that the domain forced the
information architecture, not that anyone chose a look.

---

## What this changes

The nine pages are evidence for one claim and against another.

They demonstrate that a page can be produced which is responsive, accessible in both colour
schemes, semantically structured, internally consistent and specifically written. That part
holds.

They also demonstrate that none of that produces a *direction*. There is no point in these
nine files at which anything decided what the page should look like as opposed to how it
should be built. The type is the operating system's. The palette is one recipe with a
rotating hue. The hero is one arrangement. The assets do not exist. The interactions were
never wired, so the states are illustrations of themselves.

Concretely, this is what a v2.1 gate would have to catch before any of these nine could pass:

1. **No unlabelled placeholder may ship.** Three empty coloured squares presented as logos
   would fail. A labelled hatched box would also fail production-readiness, though it can
   pass an explicitly marked draft.
2. **Assets are a deliverable, not a footnote.** A subject whose world is visual must arrive
   with real or originally generated material, inventoried before the page is built.
3. **Direction must be chosen from alternatives.** Nine pages sharing one hero arrangement
   and one font stack is what happens when the first workable idea is also the last.
4. **The design-system contract must come after that choice.** Fixing tokens first is
   precisely how nine subjects converge on one three-step ink ramp.
5. **At least one journey per surface must be exercised, not painted.** Every state shown in
   07 and 09 is a claim that has never been executed.
