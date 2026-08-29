# Frontend-design native direction — Atelier Møn Printworks

Arm: frontend-design @ b29e7cf65e5cb78a5ac33d582270551bc74a14eb  
Workflow: creative thesis → compact plan → self-critique (screening only; no build)

---

## 1. Grounding

- **Subject:** Atelier Møn Printworks — coastal letterpress studio (posters, map editions, shop bags for island shops).
- **Audience:** curators and small brands commissioning limited runs.
- **Page job:** view an edition → read paper / edition facts → enquire about a print edition.
- **Vernacular (materials, instruments, artifacts):** Heidelberg platen, press sheets on the make-ready table, gripper edges, registration crosses, chalk-dust white stock, harbour-dark ink, short island-local copy. Not “creative agency,” not loft lifestyle.
- **Allowed facts only:** paper stock names, edition sizes, press type (Heidelberg platen) when present in content. **Forbidden:** invented awards, false museum placements.
- **Load-bearing assets:** photographs of three editions on press sheets — Harbour Night (have), Chalk Path (have), Ferry Board (needed). Optional registration-mark diagram.
- **Dials:** visual density 4 · motion intensity 3 · aesthetic boldness 7.

---

## 2. Design thesis (hero = thesis)

**The site is a make-ready table, not a portfolio carousel.**

Open on one real edition sheet (default: Harbour Night) laid full-bleed as if still on the table: paper edge, sheet crop, and a single coral registration cross as UI chrome. The edition name is set like a job ticket beside the sheet; one short concrete line in island voice; primary action is “Enquire about this edition.” No blob gradients, no stock loft photography, no award ribbons.

The aesthetic risk that is justified: **the coral registration mark is the only accent and the system’s focus / selection device** (active edition, keyboard focus ring language, form success tick) — not decoration sprayed everywhere.

---

## 3. Compact plan

### Colour (5 named tokens)

| Token | Hex | Role |
| --- | --- | --- |
| Chalk White | `#F4F2EC` | Page ground — cool chalk, not warm cream default |
| Harbour Ink | `#15202B` | Primary type, rules, ink-heavy UI |
| Ink Wash | `#5C6670` | Secondary body / captions |
| Sheet Edge | `#D9D4C8` | Soft borders, sheet shadows (no blur glow) |
| Registration Coral | `#E85A4F` | Sole accent — registration mark, focus, CTA underline/dot |

No secondary rainbow. No purple agency gradient. Dark mode is not required for this marketing surface; if present later, it stays ink-on-chalk inverted with the same coral mark.

### Type (3 roles)

| Role | Face direction | Use |
| --- | --- | --- |
| Display | Condensed jobbing grotesque (e.g. **Barlow Condensed** 600–700, tight tracking) | Edition titles, hero name — poster / chase energy |
| Body | Quiet book serif (e.g. **Source Serif 4** 400/600) | Edition notes, short about, form helper text — 45–75ch |
| Ticket | Tabular mono (e.g. **IBM Plex Mono** 400/500) | Stock, edition size, “Heidelberg platen”, labels — work-ticket facts |

Type *is* identity: display stays large and restrained in count; body never competes; ticket meta is the semantic layer for true press facts.

### Layout concept

Prose: horizontal **make-ready strip** — large sheet left/center, ticket column right on desktop; stacked sheet-then-ticket on narrow. Below: three edition sheets in a single calm row (not masonry chaos), each a press photograph on a paper plate. Selected edition expands facts in the ticket column. Final band: enquire form as an order slip.

ASCII (desktop):

```
┌──────────────────────────────────────────────────────────┐
│  Atelier Møn · Printworks          [Enquire]             │
├─────────────────────────────┬────────────────────────────┤
│                             │  HARBOUR NIGHT             │
│   [ press sheet photo ]     │  ticket meta (stock, size, │
│   coral reg. mark overlay   │   Heidelberg platen)       │
│                             │  short island line         │
│                             │  [ Enquire this edition ]  │
├───────────┬───────────┬─────┴────────────────────────────┤
│ Harbour   │ Chalk     │ Ferry Board (slot if asset wait) │
│ Night ●   │ Path      │                                  │
├───────────┴───────────┴──────────────────────────────────┤
│  About (short, concrete)  ·  Enquire form as order slip  │
└──────────────────────────────────────────────────────────┘
```

Information hierarchy (semantic, not decorative numbers):

1. Active edition (image + name)  
2. Press facts (ticket mono)  
3. Enquire (primary)  
4. Other editions (selection)  
5. Studio note (secondary)

Do **not** use 01/02/03 markers unless content is a true process sequence — editions are a set, not a tutorial.

### Imagery & assets

- Hero and grid: only the three edition-on-sheet photographs.
- Ferry Board: hold an honest “sheet pending” plate (chalk field + ticket label “Ferry Board”) until `ferry-board.webp` exists — no fake photo, no loft stock fill.
- Optional registration diagram only if it clarifies the mark system; never replace the real sheets.
- Crop to show paper/ink reality (edge, ink density), not lifestyle context.

### Interaction & motion (intensity 3)

- One orchestrated moment on load: sheet settles 4–8px with soft opacity (paper put-down), ~300ms ease-out; respect `prefers-reduced-motion` → static.
- Hover/focus on edition plates: 2px lift toward ticket (no parallax circus).
- Registration coral animates only as focus ring / active state, not ambient loop.
- Form: plain active voice — “Send enquiry”, success “Enquiry sent”.

### Signature element

**Coral registration cross** — drawn once as a precise mark (hairline + center), reused as:

- overlay corner on the active press sheet  
- focus indicator language  
- active-edition indicator on the strip  

Everything else stays quiet chalk + harbour ink.

### Copy register

Short, concrete, island-local. Name what people commission (edition, stock, run). No clever agency slogans. No awards. No museum claims.

---

## 4. Self-critique (pre-build)

| Check | Result |
| --- | --- |
| Generic AI look #1 cream+serif+terracotta? | Avoided — cool chalk, condensed jobbing display, coral is a *registration* system not terracotta wash. |
| Generic AI look #2 black + acid accent? | Avoided — light paper world. |
| Generic AI look #3 broadsheet dense columns? | Avoided — open make-ready space (density 4), not newspaper packing. |
| Agency blob gradient / loft stock? | Explicitly rejected in thesis and asset rules. |
| Invented awards / museum? | None. Facts stay stock / size / Heidelberg platen only. |
| Signature restraint? | One mark system; no second “clever” motif. |
| Ferry Board missing asset? | Honest pending plate — no invented photo. |
| Would a similar “portfolio for a studio” prompt yield this? | Unlikely: make-ready table + registration-as-UI + ticket mono is subject-vernacular, not template cards. |
| Revisions after critique | Dropped any secondary accent colour; dropped numbered section markers; locked Ferry Board to pending plate. |

Quality floor (for later build, not claimed done here): mobile stack, visible focus, reduced motion, enquire path always one click from active edition.

---

## 5. Implementation guidance (if built later)

1. Tokenize the five colours; never introduce a sixth brand hue without cutting another.
2. Load only used weights of the three faces; metric fallbacks for condensed + serif + mono.
3. Wire edition state: selecting Chalk Path / Ferry Board swaps sheet + ticket facts; CTA stays “Enquire about this edition.”
4. Ticket fields bind only to real evidence fields; empty fact → omit row, do not invent.
5. `ferry-board.webp` when available replaces pending plate without layout change.
6. No gradient fills on hero; paper is flat chalk + sheet edge shadow at most.
