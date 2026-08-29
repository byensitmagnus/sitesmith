# Frontend Design — native direction (screening-v2)

Arm: frontend-design @ b29e7cf65e5cb78a5ac33d582270551bc74a14eb  
Brief: Atelier Møn Printworks (02-atelier-printworks)  
Method: ground subject → creative thesis → compact plan → self-critique  
Mode: direction only (no build)  
ai_generated: "(C)"

---

## 1. Ground it in the subject

- **Subject:** Atelier Møn Printworks — coastal print studio; letterpress posters, map editions, shop bags for island shops.
- **Audience:** curators and small brands commissioning limited runs.
- **Page job (one):** view an edition → read paper / edition facts → enquire about a print edition.
- **Platform:** desktop-tolerant marketing site.
- **Vernacular (materials / instruments / artifacts):** Heidelberg platen, press sheets on the bed, gripper edges, registration crosses, chalk-white stock, harbour-dark ink, short island-local copy. Not creative-agency theatre, not loft lifestyle.
- **Proof editions:** Harbour Night, Chalk Path, Ferry Board.
- **Facts allowed only:** paper stock names, edition sizes, press type (Heidelberg platen) when content supplies them.
- **Facts forbidden:** invented awards, false museum placements.
- **Anti-references:** generic creative-agency blob gradients, stock loft photos.
- **Load-bearing assets:** photographs of three editions on press sheets — `harbour-night.webp` (have), `chalk-path.webp` (have), `ferry-board.webp` (needed). Optional: registration-mark diagram.
- **Brand pins:** chalk white, harbour ink, one coral registration mark.
- **Voice:** short, concrete, island-local.
- **Dials:** visual density 4 · motion intensity 3 · aesthetic boldness 7.

---

## 2. Design thesis (hero = thesis)

**The page is a locked chase on the platen, not a portfolio gallery.**

Open inside a thin harbour-ink chase frame. One real edition sheet sits in the forme (default: Harbour Night). The edition name is set large across the sheet edge as if locked in metal for the job. A job-ticket rail beside the forme holds only true press facts (stock, edition size, Heidelberg platen when present) and the primary action: **Enquire about this edition.** The coral registration cross is the sole accent and the system’s selection / focus device — not a decorative sprinkle.

Aesthetic risk that is justified: **treat the coral registration mark as UI grammar** (active edition, keyboard focus language, form success) so the brand mark does real work instead of sitting as a logo sticker.

No blob gradients. No loft stock. No award ribbons. No museum claims.

---

## 3. Compact plan (pass 1)

### Colour (5 named tokens — brand-locked)

| Token | Hex | Role |
| --- | --- | --- |
| Chalk White | `#F4F2EC` | Page ground — cool chalk stock, not warm cream default |
| Harbour Ink | `#15202B` | Primary type, chase rules, ink-heavy chrome |
| Ink Wash | `#5C6670` | Secondary body, captions, quiet meta |
| Sheet Edge | `#D9D4C8` | Soft sheet borders, shallow paper shadow (no glow) |
| Registration Coral | `#E85A4F` | Sole accent — registration mark, focus, active state, CTA underline/dot |

No secondary rainbow. No purple agency mesh. Dominant chalk + ink; coral is sharp and rare.

### Type (3 roles — type *is* identity)

| Role | Face direction | Use |
| --- | --- | --- |
| Display | Condensed jobbing grotesque (e.g. **Barlow Condensed** 600–700, tight tracking) | Edition titles, studio wordmark energy — poster/chase, used with restraint |
| Body | Quiet book serif (e.g. **Source Serif 4** 400/600) | Short island notes, about, form helpers — 45–75ch measure |
| Ticket | Tabular mono (e.g. **IBM Plex Mono** 400/500) | Stock, edition size, “Heidelberg platen”, field labels — work-ticket facts |

Avoid Inter / Space Grotesk / Roboto as identity. Display stays large but scarce; body never competes; ticket mono is the semantic layer for true press facts.

### Layout concept — “Locked chase”

Desktop: chase frame holds the press sheet left/center; ticket rail right. Below: three edition sheets in one calm grip-edge row (aligned left edges like stock waiting on the bed), not masonry chaos. Selected edition swaps forme + ticket. Final band: enquire form as an order slip.

ASCII (desktop):

```
┌──────────────────────────────────────────────────────────┐
│  Atelier Møn Printworks                 [Enquire]        │
├─────────────────────────────┬────────────────────────────┤
│ ┌─ chase ─────────────────┐ │  HARBOUR NIGHT             │
│ │                         │ │  ticket: stock / size /    │
│ │   [ press sheet photo ] │ │  Heidelberg platen         │
│ │   coral reg. cross      │ │  short island line         │
│ │                         │ │  [ Enquire this edition ]  │
│ └─────────────────────────┘ │                            │
├───────────┬───────────┬─────┴────────────────────────────┤
│ Harbour   │ Chalk     │ Ferry Board                      │
│ Night ●   │ Path      │ (pending plate if asset wait)    │
├───────────┴───────────┴──────────────────────────────────┤
│  Studio note (short)  ·  Enquire form as order slip      │
└──────────────────────────────────────────────────────────┘
```

Narrow: sheet, then ticket stack, then grip-edge strip, then form. Density 4: open chalk around the forme; do not pack newspaper columns.

### Information hierarchy

1. Active edition (sheet + name)  
2. Press facts (ticket mono)  
3. Enquire (primary)  
4. Other editions (selection set, not a tutorial sequence)  
5. Short studio note (secondary)

No decorative 01/02/03 markers — editions are a set, not process steps.

### Imagery & assets

- Hero and strip: only the three edition-on-sheet photographs.
- Ferry Board missing: honest chalk pending plate with ticket label “Ferry Board” until `ferry-board.webp` exists — no loft stock fill, no invented photo.
- Optional registration diagram only if it clarifies the mark system; never replaces real sheets.
- Crop for paper/ink reality (edge, ink density), not lifestyle context.

### Interaction & motion (intensity 3)

- One orchestrated load moment: sheet settles into the forme (~4–8px + soft opacity, ~300ms ease-out). `prefers-reduced-motion` → static.
- Edition hover/focus: 2px lift toward ticket rail; no parallax circus.
- Coral animates only as focus ring / active state, never ambient loop.
- Form voice: “Send enquiry” / success “Enquiry sent.”

### Signature element

**Coral registration cross** — precise hairline + center, reused as:

- corner overlay on the active press sheet  
- focus-indicator language  
- active-edition glyph on the grip-edge strip  

Everything else stays quiet chalk + harbour ink.

### Copy register

Short, concrete, island-local. Name editions, stock, runs. No agency slogans. No awards. No museum claims. CTA names the action: “Enquire about this edition.”

---

## 4. Self-critique (before any build)

| Probe | Risk | Decision |
| --- | --- | --- |
| AI cluster 1: cream + serif + terracotta | Brand pins chalk + ink + coral; easy to slide into warm luxury default. | Keep cool chalk; reject terracotta wash and high-contrast serif-as-only-display. Condensed jobbing + mono tickets. |
| AI cluster 2: near-black + acid accent | Tempting “ink-black studio” template. | Reject as identity. Light paper world; ink is type/rules, not full shell. |
| AI cluster 3: broadsheet dense columns | Heritage catalog AI tell. | Reject. Open chase + one ticket rail; density 4. |
| Agency blob gradient / loft stock | Explicit anti-ref. | Reject in thesis and asset rules. |
| Invented awards / museum | Explicit ban. | None. Facts = stock / size / Heidelberg platen only. |
| Decorative 01/02/03 | Generic structure. | No numbered edition markers. |
| Signature restraint | Two clever motifs dilute boldness 7. | One mark system only; cut second motif. |
| Ferry Board missing | Fake photo temptation. | Honest pending plate. |
| Would a generic “print studio portfolio” prompt yield this? | Template cards + soft cream. | Unlikely if chase frame + registration-as-UI + ticket mono stay locked. |

**Revision after critique:** Dropped any secondary accent hue. Dropped numbered section eyebrows. Locked Ferry Board to pending plate. Cut ambient coral particles (motion budget 3; signature must stay precise, not festive).

**Primary risk:** Coral-as-UI reads as generic red accent if the mark is not drawn as a true print registration cross, or if a second accent creeps in.

Quality floor (later build, not claimed done): usable stack on narrow viewports, visible focus, reduced-motion path, enquire always one step from active edition.

---

## 5. Implementation guidance (builder packet)

1. Tokenize the five colours only; never introduce a sixth brand hue without removing another.
2. Load only used weights of the three faces; metric fallbacks for condensed + serif + mono.
3. Edition state: selecting Chalk Path / Ferry Board swaps sheet + ticket facts; CTA stays “Enquire about this edition.”
4. Ticket rows bind only to real evidence fields; empty fact → omit row, do not invent stock names or sizes.
5. When `ferry-board.webp` arrives, replace pending plate without layout change.
6. No gradient fills on hero; paper is flat chalk + sheet-edge shadow at most.
7. Chase frame is a thin ink rule, not a heavy neo-brutal sticker border.
8. Do not add testimonial, award, or museum blocks.
