---
title: "NATIVE — impeccable — 02-atelier-printworks"
status: screening-direction
ai_generated: "(C)"
arm: impeccable
armCommit: "6b342244e915d64b0d6e84d5eec448fd196ce6bb"
runId: screening-v2-02-atelier-printworks-impeccable
seedKey: h2h-atelier-2026-07-31
mode: persuade
phase: screening-v2
---

# NATIVE DIRECTION — impeccable · Atelier Møn Printworks

Method: new-work (create visual world) → concept-seed (`--scope direction --mode persuade`) → challenger fuse/weigh → commit one direction → pre-build critique. Screening only; no build, no DESIGN.md write, no visualize comps.

## 0. Settled product truth (pack only)

- **Subject:** Atelier Møn Printworks — coastal letterpress studio (posters, map editions, shop bags for island shops).
- **Audience:** curators and small brands commissioning limited runs.
- **Primary action:** enquire about a print edition.
- **Proof allowed:** three named editions (Harbour Night, Chalk Path, Ferry Board); paper stock names; edition sizes; Heidelberg platen. **Forbidden:** invented awards, false museum placements.
- **Brand:** chalk white, harbour ink, one coral registration mark. Voice: short, concrete, island-local.
- **Assets:** `harbour-night.webp` (have), `chalk-path.webp` (have), `ferry-board.webp` (needed). Load-bearing: photos of three editions on press sheets. Optional: registration mark diagram.
- **Anti-references:** generic creative-agency blob gradients, stock loft photos.
- **Dials:** visual density 4 · motion intensity 3 · aesthetic boldness 7.
- **Platform:** desktop-tolerant marketing site.
- **Mode:** Persuade (+ portfolio browse).

No DESIGN.md / PRODUCT.md in workspace → **no visual authority**; new world required. Brief facts are product truth, not a pinned composition.

## 1. Framing (new-work §3)

| Field | Statement |
| --- | --- |
| Unique mechanism | Limited letterpress editions with named paper, edition size, and Heidelberg platen facts — commission by enquiry, not cart. |
| Audience scene | A curator or small-brand buyer comparing real edition plates and paper facts before writing one concrete enquiry. |
| Cultural home | Danish island print culture: ferry terminals, harbour boards, small-press prospectuses, gallery wall cards, map sheets, make-ready ephemera. |
| First surface must prove | That three real editions exist with verifiable facts, and that enquiry is the only honest next step. |

### Ruts kept out of the seven-candidate list

- **Category always ships:** soft masonry portfolio grid + loft-studio about photo + footer contact.
- **Predictable opposite:** full-bleed parallax “immersive” scroll with floating serif over gradients.
- **Literal brief metaphor (capped at one candidate):** pure make-ready / registration-sheet as the entire site.

## 2. Grounded shortlist (resonance order, 7)

Families span print-publication, museum installation, cartography, transport signage, process, retail object (≥3 families).

1. **Gallery wall-card system** — curator-native labels; editions as hung spots with caption rails. *Why:* audience lives here daily.
2. **Edition colophon / proof plate** — paper, size, press as primary UI grammar. *Why:* facts earn belief.
3. **Small-press prospectus leaflet** — commission sequence as numbered pamphlet spreads. *Why:* limited-run commerce ritual.
4. **Coastal hydrographic chart** — map-edition + island place language. *Why:* Møn-local without loft cliché.
5. **Heidelberg make-ready sheet** *(literal brief, max one)* — gripper edge, registration crosses, work-and-turn bands. *Why:* press truth; spend only one die face.
6. **Ferry departure board** — editions as departures; island-local timetable ritual. *Why:* Møn ferry culture + named edition Ferry Board.
7. **Shop-bag stack / paper-goods counter** — merchandise stack as section rhythm. *Why:* island shops context; more retail than curator.

## 3. Concept seed (live roll)

```
node concept-seed.mjs --scope direction --mode persuade --from h2h-atelier-2026-07-31 --candidate-count 7
```

| Field | Value |
| --- | --- |
| Seed key | `h2h-atelier-2026-07-31` (from RUN-CONTEXT.randomSeed) |
| Scope / mode | direction / persuade |
| Source | **api** (`https://impeccable.style/api/roll?scope=direction&mode=persuade&key=h2h-atelier-2026-07-31&candidateCount=7`) |
| Pool revision | `94ff10ff20de` |
| Approved pool | 281 / 531 human-approved |
| Assigned index (local SHA-256 math) | **6** → build grounded candidate **#6 Ferry departure board** |
| Index formula | `3 + floor(u32be(sha256("direction:index:"+key)) / 0xffffffff * (7-2))` → unit ≈ 0.6954 → index **6** |
| Compositions dealt | spatial-navigation-miniature-glide · narrative-scroll-sticky-morph · first-viewport-pointer-protagonist |
| Staging commit | **first-viewport-pointer-protagonist** (board rows = selectable items; pointer/keyboard selects the active departure). Miniature-glide rejected (tourism flyover dilutes press truth). Sticky-morph held as optional alternate grammar only. |
| Telemetry | choice ping not sent (screening extract; no user pick UI) |

### Dealt challengers (fuse: challenger form + product facts; clarity wins)

1. **CRT Arcade Pixel Glow** (`medium-native-crt-arcade-pixel-glow`) — pixel/scanline stage.
2. **Split Flap Concourse** (`signals-instruments-split-flap-concourse`) — rail split-flap board cascade.
3. **Skate Deck Wall** (`pop-culture-shelf-skate-deck-wall`) — tall die-cut deck rack flip.
4. **Socialist Kiosk Print** (`vernacular-ephemera-socialist-kiosk-print`) — three permitted inks, kiosk cell grid, off-register.
5. **Brick Build Instructions** (`games-toys-physics-play-brick-build-instructions`) — numbered exploded steps.
6. **Cloud Quarry** (`dream-surreal-impossible-worlds-cloud-quarry`) — surreal weather architecture.

### Weigh (only two axes: audience identification · product clarity)

| Candidate | Audience ID | Product clarity | Outcome |
| --- | --- | --- | --- |
| **#6 Ferry departure board (assigned)** | High — island ferry ritual is local and memorable | High — rows = editions; columns = paper / size / press / enquire | **BUILD** |
| Split Flap Concourse (fused) | High — same instrument family as ferry board | High — destinations → edition names; cascade → status | **Absorb grammar into assigned** (not a replace). Flap cascade becomes motion/state law of the board. |
| Socialist Kiosk Print (fused) | High for print-culture curators | Medium-high after clarity override: challenger “no photograph” **loses** to load-bearing press-sheet assets; cells hold edition photos + three-ink system | **Named alternate** |
| Skate Deck Wall (fused) | Low for curators/commission brands | Medium portfolio flip | Lose |
| Brick Build Instructions (fused) | Medium process clarity | Medium commission steps; weak island identity | Lose |
| CRT Arcade / Cloud Quarry | Low | Low | Lose |

No factual re-roll: assigned carries product truth and task. Standing exit (category masonry portfolio) recorded, not recommended, not weighed.

## 4. COMMITTED DIRECTION — “Harbour Departures Board”

### World

The site is a **ferry-terminal departure board for limited print editions**, mounted on chalk white. Matte **harbour-ink** flap faces carry condensed caps; ruled rows and fixed columns are the composition; a single **coral registration mark** acts as the active-row / “boarding” lamp — brand accent, not decoration scatter. Island-local captions outside the board stay short and concrete. Split-flap cascade (from surviving instrument challenger) is the **state language**: selecting a row flips cells to paper stock, edition size, Heidelberg platen, then holds Enquire as the destination column.

Pointer-protagonist staging: the board plane is quiet until selection; hover/focus/keyboard moves the coral lamp and cascades the active row — the pointer (or keyboard) is the instrument of enquiry preparation, not a decorative cursor.

Not a logistics product: every row names a real edition plate. Not a creative-agency blob gradient. Not loft stock.

### First viewport

- Chalk white page field; thin top rail: atelier name (sentence case) + one text link “Editions” + primary “Enquire”.
- Hero is the **board**, not a marketing headline stack: dark panel ~70–80% viewport width, left-biased on desktop, with three live rows:
  1. **HARBOUR NIGHT** — edition size · paper stock · Heidelberg platen · ENQUIRE  
  2. **CHALK PATH** — same columns  
  3. **FERRY BOARD** — same columns; photo slot marked needed until asset exists  
- Coral registration mark seats on the focused row’s left margin (default: first row).
- One press-sheet photograph for the focused edition sits **beside or under** the board as evidence plate (not a loft interior). Diagram of registration mark optional, small.
- Hook line under board (island voice, one line): e.g. limited letterpress on Møn — enquire for a run. No awards. No museum fiction.

### Visitor path

1. **View edition** — scan board rows / focus a row (cascade reveal).  
2. **Read paper/edition facts** — columns + expanded plate caption (stock, size, press).  
3. **Enquire** — primary action in destination column and sticky/footer twin; short form or mailto — unknown contact channel remains **unknown** (not invented).

### Signature interaction

**Row cascade / flip:** activating a row runs a short character-or-cell cascade (motion intensity 3: brief, linear, `prefers-reduced-motion` → instant swap). Focused row shows coral registration mark; expanded evidence shows the corresponding press-sheet photo. Enquire is always visible in the destination column — never hidden behind a modal-only path.

### Cross-surface reach

Edition deep-links open the same board with one row expanded (URL-addressable row). Future “shop bags / maps” lists reuse row+column grammar, not a new card system.

### Colour strategy

**Restrained with one committed instrument field:** chalk white ground; harbour ink for board face and body type; coral **only** as registration/active lamp (and optional hairline registration on focus). Dark board is a scene object under Nordic daylight page, not a default “dark mode product.”

### Typography

- **Board / destinations:** condensed grotesque caps, fixed cell rhythm (instrument language — not display serif, not Inter-as-display).  
- **Island captions / body:** quiet humanist or neutral grotesque, sentence case, 45–75ch measure.  
- Avoid training-default stack (cream + Playfair/Fraunces + terracotta) — already refused by board grammar.

### Imagery & assets

- Load-bearing: three edition-on-press-sheet photos. Have two; **Ferry Board photo is needed** — ship row with labeled placeholder until asset arrives; do not invent a third loft photo.  
- Optional registration diagram for “how we print” quiet band.  
- No stock loft; no gradient blobs.

### Interaction / motion budget

Density 4: board is information-forward, not sparse luxury void. Motion 3: cascade on row change only; no scroll-jacking, no parallax. Boldness 7 lives in **commitment to the board instrument**, not in louder chrome.

### Honest risk

If edition facts or press-sheet photos lag, the board collapses into a generic timetable UI and product clarity dies. Mitigation: never ship a row without real edition name + at least one allowed fact column populated; photo gaps labeled, not faked.

### Direction contract (≤150 words — five blocks)

```
THESIS: Limited Møn letterpress editions listed as ferry departures — not a masonry portfolio, not immersive agency scroll.
OWN-WORLD: Chalk white page; harbour-ink matte board with condensed caps in fixed columns; one coral registration lamp on the active row; split-flap cascade as state language.
STORY: Visitor believes three real editions exist with paper/size/press facts and that enquiry is how a run starts.
FIRST VIEWPORT: Dark board hero with three named rows + evidence press-sheet for focused row; Enquire in destination column and top rail; pointer selects active row.
FORM: Grounded #6 Ferry departure board; seed key h2h-atelier-2026-07-31; staging first-viewport-pointer-protagonist; split-flap grammar absorbed; kiosk-print held as alternate.
```

## 5. Named alternates (not ranked menu of grounded list)

1. **Three-ink kiosk grid** (fused Socialist Kiosk Print) — editions as kiosk cells in chalk / harbour / coral only; slight registration-shift on active cell; press photos allowed as the goods (clarity override). Case: stronger pure print-ephemera craft bar if ferry metaphor ever feels too transport-literal.
2. **Re-roll** — optional one-line steer: e.g. “more gallery-wall, less transport board” would eliminate board+flap+kiosk already shown and force new grounded angles.

**Standing exit (user door only, not recommended):** straight category portfolio — masonry of three editions + about + contact, craft bar set by 2–3 real small-press peers if chosen.

## 6. Pre-build critique

⚠️ DEGRADED: single-context (no isolated Assessment A/B sub-agents; no built DOM target; detector N/A for direction-only screening).

### Design-specificity

Composition language is **subject-bound** (Møn ferry + named letterpress editions + coral registration). An unrelated SaaS could not reuse the board rows without lying. Pass on specificity if facts stay real.

### Holistic / hierarchy

Primary: board + focused edition evidence. Secondary: facts columns. Tertiary: atelier one-liner + enquire. Risk: top-rail chrome competing with board — keep rail thin.

### Cognitive load

Board columns must stay ≤4 data fields + enquire (name, paper, size, press, action). >4 visible options in chrome fails checklist — do not add shop/blog/awards nav.

### Emotional journey

Peak: recognizing a named edition plate beside real paper facts. End: clear enquire. Valley risk: missing Ferry Board photo — label honestly.

### Priority issues (fix if built)

1. Ferry Board asset gap.  
2. Cascade must not obscure Enquire.  
3. Contrast: white caps on harbour-ink board need measured AA.  
4. Do not invent contact endpoints or awards in copy.  
5. Reduced-motion path required for cascade.

### Strengths

1. Instrument world refuses both category ruts.  
2. Brand triad (chalk / harbour / coral registration) has a job, not a mood.  
3. Challenger fuse improved state language without abandoning island grounding.

### Persona red flags

- Curator sees “transit app” → evidence photos + paper columns failed to lead.  
- Small brand sees “artsy agency” → gradients or loft slipped back in.

## 7. Implementation guidance (screening handoff)

- HTML: semantic table or list with column headers (Edition, Paper, Size, Press, Action).  
- CSS: board panel, condensed type, coral marker on `[aria-selected=true]` row; cascade via short CSS/WAAPI; `prefers-reduced-motion: reduce` disables stagger.  
- Assets: wire `harbour-night.webp`, `chalk-path.webp`; Ferry Board placeholder with “photo needed”.  
- Copy: short, concrete, island-local; only allowed facts.  
- No blob gradients; no loft stock; no award lines.  
- Primary conversion: Enquire visible in first viewport.
- Selection: keyboard row focus + pointer; URL-addressable active row for deep links.

## 8. Unknowns (remain unknown)

- Exact paper stock names and edition sizes (allowed as facts when supplied; not invented here).  
- Contact channel (form endpoint, email, phone).  
- Pricing, lead times, client list, museum placements, awards.  
- Ferry Board photograph (needed).  
- Full typeface licensing choices beyond role description.
