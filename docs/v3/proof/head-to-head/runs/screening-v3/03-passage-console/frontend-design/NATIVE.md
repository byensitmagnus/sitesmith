# Frontend Design — native direction (screening-v2)

Arm: frontend-design @ b29e7cf65e5cb78a5ac33d582270551bc74a14eb  
Brief: Passage Log Console (03-passage-console)  
Method: creative thesis → compact plan → self-critique → builder packet  
Phase: screening-v2  
ai_generated: "(C)"

---

## Subject pin

- **Subject:** Passage Log Console — desktop web app for harbour masters logging vessel passages.
- **Audience:** harbour masters at an operations desk (keyboard-forward, short labels).
- **Single job:** log a passage — vessel name, inbound/outbound, timestamp, berth note — then see the row.
- **Primary journey:** open log form → fill required fields → save → see row.
- **Allowed facts only:** field names, requiredness, keyboard shortcut Ctrl+Enter; states empty log, validation error, success row, offline banner.
- **Forbidden:** throughput KPIs, customer logos, decorative metrics, invented product claims.
- **Brand pins:** near-black shell, fog grey panels, signal amber for warnings only; operational short labels; deliberately imageless (asset plan/manifest: none).
- **Anti-references:** consumer fintech gradients, playful illustration chrome.
- **Dials from brief:** visual density 8 · motion intensity 1 · aesthetic boldness 3.

Subject vernacular: passage, vessel, berth, inbound, outbound, watch, channel. Materials: instrument shell, fog-lit panels, warning lamp — not consumer SaaS chrome.

Visitor mode (frontend-design): **Operate + Read** — stability, scanability, measure first; fixed role scale; no display-type performance.

---

## Design thesis

**Commit desk, not product dashboard.**  
The first screen *is* the work surface: a dense, full-width desktop instrument where a fixed **passage commit strip** (form + Log passage / Ctrl+Enter) sits above an append-only **passage tape** (mono ledger). Direction (inbound | outbound) is the only structural drama — a two-state lock, not a dropdown. Signal amber appears solely for offline and validation faults; never as brand decoration, never as a gradient mesh. No hero number, no KPI strip, no illustration. Chrome and type *are* the content.

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

Six tokens only. No secondary brand accent. No purple, no acid-green, no vermilion “tech” glow, no fintech gradient mesh.

### Type (roles — Operate + Read)

| Role | Face | Notes |
| --- | --- | --- |
| Utility / UI | **IBM Plex Sans** 400–600 | Labels, buttons, form chrome; short operational words; slightly tighter tracking on tool labels |
| Data / ledger | **IBM Plex Mono** 400–500 | Vessel names, timestamps, IN/OUT marks; tabular figures for time columns |

- **Scale (desktop, density 8):** label 12 / body 14 / row 13 mono / section 16 medium.
- No display/poster face — aesthetic boldness 3; personality lives in structure and mono data, not poster type.
- Light-on-dark compensation: slightly more line-height and tracking on ink roles; one step weight where the face thins.
- Fallbacks: `system-ui, sans-serif` / `ui-monospace, monospace` with metric-compatible loading; load only used weights.

### Layout concept — “Commit strip + passage tape”

Full-width desktop instrument. Single purpose, two bands:

1. **Top status rail** — product name “Passage Log”, offline banner slot (amber only when offline), minimal utility. No nav theatre.
2. **Commit strip (primary)** — fog-grey inset panel: vessel*, direction* lock, time*, berth note; primary action **Log passage** with visible **Ctrl+Enter** hint.
3. **Passage tape (ledger)** — same panel family: chronological mono rows; empty state invites first log; success appends a row without fanfare.

ASCII (desktop ~1440):

```
+------------------------------------------------------------------+
| PASSAGE LOG                              [offline banner slot]   |
+------------------------------------------------------------------+
| LOG PASSAGE                                              Ctrl+Enter|
| Vessel*  [________________________]                              |
| Direction*  [ Inbound | Outbound ]   ← signature lock            |
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

**Direction as a two-state lock (Inbound | Outbound).**  
Segmented control spanning the form’s key row — the only “bold” control in an otherwise quiet fog-grey panel. It encodes the real passage fact (direction) as structure, not decoration. Success rows echo the same IN/OUT mark in mono, so the ledger inherits the form’s language.

### Interaction

- Journey: open form → fill required fields → save (button or **Ctrl+Enter**) → success row appears in ledger.
- Motion intensity 1: no page-load choreography; optional focus ring / error outline only. `prefers-reduced-motion`: do nothing extra (already static).
- States:
  - **Empty log:** short invitation — “No passages yet — log the first above.”
  - **Validation error:** amber field outline + short field text (e.g. “Vessel is required”).
  - **Success row:** new mono row in tape; no confetti toast.
  - **Offline banner:** amber strip on status rail — “Offline — entries cannot be saved until connection returns.”
- Keyboard: visible focus; Ctrl+Enter submits when form is valid.

### Writing (interface)

Operational, short labels. Active verbs. Register examples (not invented product claims):

- Button: “Log passage”
- Empty: “No passages yet — log the first above.”
- Error pattern: “Vessel is required” / “Direction is required” — no apology, no marketing.
- Offline: “Offline — entries cannot be saved until connection returns.”

### Imagery and assets

Deliberately imageless. Asset manifest: none. UI chrome and type carry every first-screen job. No illustration, no stock harbour photos, no logo lockups.

### Information hierarchy

1. Commit strip — required fields + primary action (Log passage / Ctrl+Enter).
2. Offline / validation signal layer (amber, fault-only).
3. Passage tape — empty invitation → success rows.
4. Nothing else — no decorative metrics, logos, or secondary journeys.

---

## Self-critique (plan review before any build)

| Check | Finding | Revision |
| --- | --- | --- |
| Generic AI default #1 (cream + serif + terracotta)? | No — brand pins near-black + fog grey. | Keep brand shell/panels. |
| Generic AI default #2 (near-black + acid-green/vermilion accent)? | Risk: near-black shell is brief-required; neon would be the lazy accent. | **Revised:** amber only for faults; no decorative neon. Signature is structure (direction lock), not a glow colour. |
| Generic AI default #3 (broadsheet hairlines / fake ops newspaper)? | Density 8 could slide into editorial columns. | **Revised:** instrument panels with inset edges; no decorative rules as identity. |
| Consumer fintech gradients / playful chrome? | Explicit anti-references. | Rejected. Imageless. |
| Fake KPIs / logos? | Forbidden by pack. | Absent from plan. |
| Boldness overspent? | Boldness dial = 3; density = 8. | One signature only (direction lock). No display type, no motion spectacle. |
| Motion vs dial 1? | Plan is essentially static. | Confirmed: no ambient animation. |
| Does thesis fit product UI? | “Hero” = full work surface, not a poster. | Confirmed: first screen is the logging journey. |
| Typography Operate+Read? | Two families with clear roles; fixed scale. | Confirmed: Plex Sans UI + Plex Mono data; no third family. |

**Confirmed unique-to-brief:** harbour passage vernacular + brand shell/panel/amber discipline + direction-lock signature + mono passage tape + Ctrl+Enter, without KPI theatre.

---

## Implementation notes (if built later)

- Derive every colour from the six tokens; do not introduce a seventh “brand accent.”
- IBM Plex Sans + Mono (or metric-compatible fallbacks); load only used weights.
- Density 8: tight vertical rhythm, compact form grid, ledger rows scannable without card chrome.
- Desktop-first; still meet quality floor (focus visible, reduced-motion, no horizontal overflow, axe both schemes if dual theme later — default is dark instrument only unless evidence adds light).
- Do not invent throughput widgets, customer logos, or decorative illustrations.
- States must be implementable from pack only: empty, validation error, success row, offline banner.
- Unknowns stay unknown (see packet): no invented validation matrix, no fake multi-user model.
