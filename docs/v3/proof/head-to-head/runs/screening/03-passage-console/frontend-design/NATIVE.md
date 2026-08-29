# Frontend Design — native direction
**Brief:** Passage Log Console  
**Arm method:** thesis → compact plan → self-critique  
**Mode:** direction only (no build)

---

## Grounding

- **Subject:** Passage Log Console — desktop web app for harbour masters logging vessel passages.
- **Audience:** harbour masters at an operations desk.
- **Single job:** log a passage — vessel name, inbound/outbound, timestamp, berth note — then see the row.
- **Allowed facts only:** field names, requiredness, keyboard shortcut Ctrl+Enter; states empty log, validation error, success row, offline banner.
- **Forbidden:** throughput KPIs, customer logos, decorative metrics.
- **Brand pins:** near-black shell, fog grey panels, signal amber for warnings only; operational short labels; deliberately imageless.
- **Dials from brief:** visual density 8 · motion intensity 1 · aesthetic boldness 3.

Subject vernacular: channel, berth, inbound, outbound, passage, watch. Materials: instrument shell, fog-lit panels, warning lamp — not consumer chrome.

---

## Design thesis

**Night-watch instrument, not product marketing UI.**  
The first screen *is* the work: a dense, full-width console where the log form and the passage ledger share one continuous surface. Direction (inbound | outbound) is the only structural drama. Signal amber appears solely for offline and validation faults — never as brand decoration, never as a gradient. No hero number, no KPI strip, no illustration. Chrome and type *are* the content.

---

## Compact plan

### Colour (named tokens — brand-pinned)

| Token | Hex | Role |
| --- | --- | --- |
| shell | `#0B0C0E` | near-black app shell |
| panel | `#1A1D22` | fog-grey work panels |
| panel-edge | `#2A2F38` | inset panel boundaries |
| ink | `#E6E8EC` | primary labels / values |
| ink-muted | `#9AA3B2` | secondary metadata, empty hints |
| signal-amber | `#E5A00D` | warnings only (offline banner, field errors) |

No secondary brand accent. No purple, no acid-green, no vermilion “tech” glow, no fintech gradient mesh.

### Type (roles)

- **Utility / UI:** IBM Plex Sans — labels, buttons, form chrome. Short operational words; slightly tighter tracking on tool labels.
- **Data / ledger:** IBM Plex Mono — vessel names, timestamps, direction codes (IN/OUT). Tabular figures for time columns.
- **Scale (desktop, density 8):** label 12 / body 14 / row 13 mono / section title 16 medium. No display face — aesthetic boldness 3; personality lives in structure and mono data, not poster type.

### Layout concept

Full-width desktop instrument. Asymmetric but single-purpose:

1. **Top status rail** — product name “Passage Log”, offline banner slot (amber only when offline), minimal utility.
2. **Primary work band** — fog-grey panel: the log form (vessel, direction, time, berth note) with primary action **Log passage** and visible **Ctrl+Enter** hint.
3. **Ledger band below** — same panel family: chronological passage rows; empty state invites first log; success appends a row without fanfare.

ASCII (desktop ~1440):

```
+------------------------------------------------------------------+
| PASSAGE LOG                              [offline banner slot]   |
+------------------------------------------------------------------+
| LOG PASSAGE                                              Ctrl+Enter|
| Vessel*  [________________________]                              |
| Direction* ( ) Inbound  ( ) Outbound                             |
| Time*    [____:____ ____-__-__]                                  |
| Berth note [____________________________________________]        |
|                                           [ Log passage ]        |
+------------------------------------------------------------------+
| PASSAGES                                                         |
| (empty)  No passages yet — log the first above.                  |
| --- after success ---                                            |
| TIME       DIR   VESSEL              BERTH NOTE                  |
| 14:02 ...  OUT   MV Example          Berth 3 clear               |
+------------------------------------------------------------------+
```

Not a marketing hero + feature cards. Not a three-column KPI dashboard. Form → save → row is the spine.

### Signature element

**Direction as a two-state lock, not a dropdown.**  
Inbound | Outbound rendered as a segmented lock control spanning the form’s key row — the only “bold” control in an otherwise quiet fog-grey panel. It encodes the real passage fact (direction) as structure, not decoration. Success rows echo the same IN/OUT mark in mono, so the ledger inherits the form’s language.

### Interaction

- Journey: open form → fill required fields → save (button or **Ctrl+Enter**) → success row appears in ledger.
- Motion intensity 1: no page-load choreography; optional 1-frame focus ring / error outline only. Respect reduced-motion by doing nothing extra.
- States: empty log copy is an invitation; validation errors are amber + short field text (what failed); offline banner is amber strip, operational voice; success is a new row, not a confetti toast.
- Keyboard: visible focus; Ctrl+Enter submits when form is valid.

### Writing (interface)

Operational, short labels. Active verbs. Examples of register (not invented product claims):

- Button: “Log passage”
- Empty: “No passages yet — log the first above.”
- Error pattern: field-level “Vessel is required” / “Direction is required” — no apology, no marketing.
- Offline: “Offline — entries cannot be saved until connection returns.”

---

## Self-critique (plan review before any build)

| Check | Finding | Revision |
| --- | --- | --- |
| Generic AI default #1 (cream + serif + terracotta)? | No — brand pins near-black + fog grey. | Keep brand shell/panels. |
| Generic AI default #2 (near-black + acid-green/vermilion accent)? | Risk: near-black shell is brief-required; acid/vermilion would be the lazy accent. | **Revised:** amber only for faults; no decorative neon accent. Signature is structure (direction lock), not a glow colour. |
| Generic AI default #3 (broadsheet hairlines, zero radius, newspaper columns)? | Density 8 could slide into fake “ops newspaper.” | **Revised:** instrument panels with inset edges, not editorial columns; no decorative rules as identity. |
| Consumer fintech gradients / playful chrome? | Explicit anti-references. | Rejected. Imageless. |
| Fake KPIs / logos? | Forbidden by pack. | Absent from plan. |
| Boldness overspent? | Boldness dial = 3; density = 8. | One signature only (direction lock). No display type, no motion spectacle. |
| Motion vs dial 1? | Plan is essentially static. | Confirmed: no ambient animation. |
| Does hero thesis fit product UI? | “Hero” = full work surface, not a poster. | Confirmed: first screen is the logging journey. |

**Confirmed unique-to-brief:** harbour passage vernacular + brand shell/panel/amber discipline + direction-lock signature + mono ledger + Ctrl+Enter, without KPI theatre.

---

## Implementation notes (if built later)

- Derive every colour from the six tokens; do not introduce a seventh “brand accent.”
- IBM Plex Sans + Mono (or metric-compatible fallbacks); load only used weights.
- Density 8: tight vertical rhythm, compact form grid, ledger rows scannable without card chrome.
- Desktop-first; still meet quality floor (focus visible, reduced-motion, no horizontal overflow).
- Do not invent throughput widgets, customer logos, or decorative illustrations.
