# NATIVE — taste-skill · 02-atelier-printworks

Arm method: Design Read + dials  
Source commit: e988add20dab0fa97d7a76781c48961c8184288e  
Brief pack only. No peer arms. No invented awards or museum placements.

---

## 0. Design Read

**Reading this as:** characterful marketing / portfolio for curators and small brands commissioning limited runs, with a coastal letterpress / island-local language, leaning toward native CSS aesthetic (print-studio materiality — not an official product design system).

Signals used (pack only):
- Page kind: marketing / portfolio (coastal print studio)
- Audience: curators and small brands commissioning limited runs
- Primary action: enquire about a print edition
- Primary journey: view edition → read paper/edition facts → enquire
- Vibe: characterful; short, concrete, island-local voice
- Work proof: letterpress posters, map editions, shop bags for island shops; three named editions (Harbour Night, Chalk Path, Ferry Board)
- Brand tokens named: chalk white, harbour ink, one coral registration mark
- Anti-references: generic creative-agency blob gradients, stock loft photos
- Platform: desktop-tolerant marketing site
- Quiet constraints: do not invent awards or false museum placements; ferry-board.webp is needed/not have

No clarifying question: brief + brand + journey are sufficient to lock the read.

---

## 1. Dials

Brief-supplied intensity axes take precedence over taste baseline (8/6/4) and over generic portfolio preset (8/7/3).

| Dial | Value | Rationale from pack + taste inference |
| --- | --- | --- |
| `DESIGN_VARIANCE` | **7** | Maps aesthetic boldness 7; characterful portfolio without artsy chaos. Offset layouts (split / asymmetric whitespace), not perfect symmetry, not masonry chaos. |
| `MOTION_INTENSITY` | **3** | Pack motion intensity 3 → Static band: `:hover` / `:active` only; no scroll-hijack, no cinematic choreography. |
| `VISUAL_DENSITY` | **4** | Pack visual density 4 → Daily-app spacing (`py-16`–`py-24` scale), not art-gallery emptiness, not cockpit packing. |

Dial lock: **7 / 3 / 4**

---

## 2. Foundation (brief → system map)

Not a Fluent / Material / Carbon / Polaris / Primer / GOV.UK brief.  
**Aesthetic, not official system:** print-studio / characterful marketing — implement with **native CSS + utility CSS** (Tailwind acceptable). Honest comment in build: press-room materiality is aesthetic, not a licensed design system.

Reject as foundation:
- shadcn/ui default state shipped raw
- glassmorphism / blob-gradient agency defaults (anti-reference)
- warm beige + brass + espresso premium-consumer cliché (brand already names chalk white / harbour ink / coral — use those, do not substitute craft-beige)

---

## 3. Design engineering direction

### 3.1 Thesis

A desktop-tolerant press-room site for Atelier Møn Printworks: three named letterpress editions on press sheets as the product proof; chalk-white ground, harbour-ink type, one coral registration mark as the sole accent. Curators and small brands should see an edition, read paper/edition facts, then enquire — nothing else competes with that path.

### 3.2 Subject grounding (facts only)

- Subject: Atelier Møn Printworks
- Work: letterpress posters, map editions, shop bags for island shops
- Named editions: Harbour Night, Chalk Path, Ferry Board
- Press type allowed when stated: Heidelberg platen
- Allowed fact classes when known: paper stock names, edition sizes (values not supplied in pack → stay unknown until real copy exists)
- Forbidden: invented awards, false museum placements
- Voice: short, concrete, island-local
- Brand colour words: chalk white, harbour ink, coral registration mark

### 3.3 Composition (`DESIGN_VARIANCE: 7`)

- **Anti-center bias:** do not default to centered hero over mesh. Prefer **split** (edition object / type column) or **left-aligned content with asymmetric white space**.
- Hero must fit first viewport: headline ≤ 2 lines desktop; subtext ≤ 20 words; primary CTA visible without scroll.
- Page rhythm after hero: calm horizontal bands (density 4), not equal three-card feature row.
- Edition proof as primary grid: three edition slots (Harbour Night, Chalk Path, Ferry Board) — not generic “project cards” with stock loft photos.
- Mobile `<768px`: collapse asymmetric desktop layout to single column (`w-full`, sensible horizontal padding).

### 3.4 Information hierarchy

1. Identity + one-line what (coastal print studio / limited runs)
2. Primary path: **view edition** (three named editions)
3. Facts on selected edition: paper / edition size / press (Heidelberg platen) when known
4. Primary action: **enquire about a print edition** (one contact intent label site-wide)
5. Secondary: short studio note (island-local, concrete) — no fake awards block

No duplicate CTA intent: one enquire label in nav, hero, and footer.

### 3.5 Typography

- **Sans-first** (taste serif discipline): creative print studio is not an automatic serif brief. Display = strong sans grotesque (e.g. Cabinet Grotesk / Geist / Satoshi family — not Inter default; not Fraunces / Instrument_Serif).
- Body: quiet sans, `max-w-[65ch]`, relaxed leading; harbour-ink on chalk-white for AA contrast.
- **Mono** for edition numbers, press name, and any paper/edition figure rows (print-spec feel without inventing data).
- Emphasis inside headlines: italic/bold of **same** family only — no mixed-family kinetic serif injection.
- Italic display with descenders: min leading ~1.1 + clearance; no clipped `g/y/j/p/q`.

### 3.6 Colour and material model

- **Base:** chalk white ground
- **Ink:** harbour ink for type and structure
- **Single accent:** coral registration mark only (saturation restrained; max one accent)
- **Lock:** no second accent family (no teal status, no purple CTA, no AI-lila glow)
- **Materiality:** paper plane + hard registration geometry; cards only if elevation is needed for edition plates — prefer divide lines / borders tinted to ground hue over pure-black drop shadows
- **Shape lock:** one radius scale — prefer sharp / near-sharp (press-sheet, registration) over mixed pill/soft systems
- **Theme:** light-first (paper). If dual mode is implemented later, pick one token strategy and test both; do not invent a second brand palette for dark.

### 3.7 Imagery and asset strategy

Load-bearing (pack):
- Photographs of three editions on press sheets
- `harbour-night.webp` — have
- `chalk-path.webp` — have
- `ferry-board.webp` — **needed** (not declared have)

Optional:
- Registration mark diagram

Rules:
- Do not fill Ferry Board with stock loft photography or generic agency blobs
- Until `ferry-board.webp` exists: honest empty/needed slot or diagram placeholder — never fake press photography
- No invented award badges or museum wall captions on images

### 3.8 Interaction concept (`MOTION_INTENSITY: 3`)

- Static default: no auto-playing cinematic motion
- Edition cards / plates: `:hover` reveals or emphasizes a material fact line (paper / edition / press) via opacity/transform only
- Buttons: full state cycle — default / hover / active (`scale-[0.98]` or 1px press) / focus visible / disabled if needed
- Form (enquire): labels above inputs; helper optional in markup; errors below; no placeholder-as-label; WCAG AA on inputs, placeholders, focus rings
- `prefers-reduced-motion`: already the practical default at motion 3
- No scroll-driven timeline, no parallax, no `window` scroll listeners

### 3.9 Signature element

**Coral registration mark** — the single brand accent used as a recurring print-production motif (corner crop mark / register cross near edition plates and primary CTA adjacency). Must remain recognizable as registration geometry, not a decorative blob or gradient orb.

### 3.10 Layout discipline (hard)

- Hero in first viewport; CTA not below fold on desktop
- CTA labels single-line at desktop; primary enquire label ≤ ~3 words intent-clear
- Button contrast: harbour-ink or chalk-white on coral (or ink-filled solid) must pass AA; no white-on-white
- One accent colour locked page-wide

---

## 4. Anti-defaults (taste)

Do not ship: AI-purple gradients; centered hero on dark mesh; three equal generic feature cards; glassmorphism everywhere; infinite micro-loops; Inter + slate-900 as unexamined default; beige/brass/espresso craft cliché; stock loft photos; blob gradients (anti-reference).

---

## 5. Primary risk

`ferry-board.webp` is needed. If the third edition slot is faked with stock or omitted without an honest needed-state, the load-bearing three-edition proof collapses and the journey (view → facts → enquire) loses credibility.

---

## 6. Unknowns (stay unknown)

- Specific paper stock names (allowed class; values not in pack)
- Edition sizes (allowed class; values not in pack)
- Price / commercial terms
- Physical studio address, hours, phone (not in pack)
- Real photography treatment for Ferry Board until asset exists
- Any award or institutional placement (forbidden to invent)

---

## 7. Implementation guidance (for a later build handoff)

1. Declare Design Read + dials 7/3/4 in the build header comment.
2. Tokenize chalk white / harbour ink / coral registration; ban second accent.
3. Hero: asymmetric split — one edition plate + short concrete headline + single enquire CTA.
4. Editions band: three slots bound to Harbour Night, Chalk Path, Ferry Board; wire have assets; mark Ferry Board as needed.
5. Fact rows: only paper stock / edition size / Heidelberg platen when real copy is supplied — empty structure OK; invented numbers not OK.
6. Enquire form: one intent, labels above, AA contrast, success/error/empty states.
7. Verify: no awards/museums copy; no blob gradients; no loft stock; motion stays hover-only.
