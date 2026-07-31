---
title: "NATIVE — impeccable direction — 03-passage-console"
status: screening-native
arm: impeccable
method: "impeccable seed+challengers+critique"
ai_generated: "(C)"
runId: screen-03-passage-console-impeccable
---

# Impeccable new-work — Passage Log Console

Mode: **Operate** (functional product UI · desktop web app)  
Brief pins: visual density 8 · motion intensity 1 · aesthetic boldness 3  
Brand pins: near-black shell · fog grey panels · signal amber for warnings only · operational short labels  
Assets: deliberately imageless (chrome + type are the content)  
Anti-references: consumer fintech gradients · playful illustration chrome  
Forbidden invention: fake throughput KPIs · customer logos  
Allowed fact: keyboard shortcut Ctrl+Enter

## 1. What is already true

No established DESIGN.md or shipped UI. Incomplete brand only: shell/panel/amber/voice from BRAND.md.  
Product truth from pack only: harbour masters log vessel passages (vessel, direction, time, notes/berth note).  
States that exist: empty log · validation error · success row · offline banner.  
Primary journey: open log form → fill required fields → save → see row.

## 2. Mechanism / scene / cultural home

- **Unique mechanism:** commit one passage record (vessel · inbound|outbound · timestamp · berth note) into a live operational log.
- **Audience scene:** harbour master on watch at a desk console — frequent short entries, not exploratory browsing.
- **Cultural home:** maritime operations desks — ledgers, AIS lists, notice boards, checklists, radio faceplates — not consumer SaaS marketing.
- **First surface must prove:** a passage can be logged correctly and appears as a success row; empty, invalid, and offline states remain legible without decoration.

## 3. Category rut (kept off the die)

- **Rut:** dark “ops dashboard” with KPI tiles, charts, and map chrome.
- **Predictable opposite:** multi-step empty wizard with playful empty-state illustration.
- Both excluded from the grounded candidate list.

## 4. Grounded candidate material (seven · ≥3 families)

Ordered by resonance for this mechanism:

1. **Bound vessel movement ledger** — ruled sequential entries; stamp-like status; columns over cards. (physical ritual)
2. **AIS / traffic list pane** — dense row table; direction marks; select → detail. (screen tradition)
3. **Bridge pilot checklist** — required fields as fail-closed sequence; short labels. (procedure)
4. **Port notice / NOTAM board** — chronological stack; amber caution strip only when live. (publication)
5. **VHF console faceplate** — labeled toggles for direction; fixed faceplate chrome. (hardware UI)
6. **Tide / movements chalkboard** — high-density white-on-dark tabular rewrite surface. (physical board)
7. **Berth allocation strip** — linear inbound/outbound lanes as structure for rows. (spatial board)

Families spanned: physical ritual · screen/list tradition · procedure · publication · hardware UI.

## 5. Concept seed (direction scope · Operate)

Script unavailable in this harness (`concept-seed.mjs` not present as executable path).  
**Degraded roll documented:** deterministic assign from grounded list using pack `randomSeed` `h2h-passage-2026-07-31` → index 0 of ordered list.

- **Assigned direction (build):** Bound vessel movement ledger → **“Watch Ledger”**
- **Dealt challengers (weigh only · not a ranked menu of own list):**
  - C1 · AIS / traffic list pane
  - C2 · Bridge pilot checklist
  - C3 · Port notice / NOTAM board (lighter alternate)

### Weighing (axes only: audience identification · product clarity)

| Candidate | Audience ID | Product clarity | Notes |
| --- | --- | --- | --- |
| **Watch Ledger (assigned)** | High — logbook is the real ritual | High — entry → row is the whole job | Density 8 fits ruled columns |
| C1 AIS traffic list | High — familiar on watch desks | Medium-high — can drift into multi-select tool chrome | Strong fused alternate |
| C2 Bridge checklist | Medium-high — procedure-true | High for requiredness | Risk: feels like a wizard, not a log |
| C3 NOTAM board | Medium — notices ≠ continuous log | Medium — weaker “save row” affordance | Secondary alternate only |

**Commit:** Watch Ledger (assigned). Challengers C1 and C2 survive as named alternates; C3 dropped for product clarity.

Standing exit (category standard, not recommended): generic dark admin table + form — present only as exit, not weighed.

## 6. Committed direction — Watch Ledger

### World

Near-black shell as night-watch frame. Fog-grey work panels as the ledger paper substitute. Type is UI workhorse (system stack or single neutral sans) with tabular figures for times; short operational labels. Signal amber appears **only** for offline banner and validation error — never as brand flourish or gradient. No imagery, no logos, no KPI figures. Motion near-zero (intensity 1): state changes, not decoration.

### First viewport (desktop)

Full-width operational console, not a marketing hero.

1. **Top status strip (thin):** product name “Passage Log Console” · connection state (online default; offline banner uses amber when that state is active).
2. **Primary work band — open entry ledger line (always visible, not a modal):**
   - Vessel (required)
   - Direction inbound | outbound (required)
   - Time (required; defaulting behaviour unknown — do not invent auto-now claims beyond “timestamp” field)
   - Berth note / notes (optional unless pack marks required — pack says “berth note” as job field; treat as part of the passage record)
   - Primary control: **Save** with visible **Ctrl+Enter** hint
3. **Log body (majority height):** dense chronological table/rows — vessel · direction · time · note · status mark.
4. **States in-composition:**
   - Empty log: quiet empty body under the entry line (“No passages logged” short copy) — no illustration
   - Validation error: field-level + summary; amber only for error signal
   - Success row: new row appears at top (or chronological position); no confetti
   - Offline banner: amber strip, operational wording only

### Visitor path (harbour master)

Land on console → focus vessel field → fill required → Ctrl+Enter or Save → see success row → ready for next entry without navigation.

### Signature interaction

**Always-on entry ledger line + Ctrl+Enter commit** — the form is a permanent first row of the log, not a separate page. That is the product-specific experience.

### Cross-surface reach

Same shell/panel/amber discipline for any future filters or detail drawers; density and short labels stay constant. No secondary marketing surfaces in scope.

### Direction contract (≤150 words · build-facing)

- **THESIS:** This is a watch ledger for committing passages, not an ops analytics dashboard. Refuse KPI tiles, maps, and fintech gradients.
- **OWN-WORLD:** Near-black shell; fog-grey panels; amber only for warning/error/offline; imageless chrome; dense tabular log + permanent entry line.
- **STORY:** Master opens console, logs vessel/direction/time/note, sees the row; empty/error/offline stay honest.
- **FIRST VIEWPORT:** Status strip → always-on entry band → dense log body; Save + Ctrl+Enter as primary action.
- **FORM:** Watch Ledger (bound vessel movement ledger); seed degraded-assign index 0 from ordered grounded list; staging: full-width single console (not split marketing).

### Primary risk

High visual density without imagery can collapse into a generic dark admin CRUD table if the **always-on entry line** and **state strip discipline** are not held — losing both audience identification (ledger ritual) and product clarity (log-a-passage journey).

### Critique snapshot (pre-build · single-context)

⚠️ DEGRADED: single-context (screening direction only; no built DOM for Assessment B detector/browser).

- Specificity: grounded in harbour log ritual + pack brand; not a free aesthetic lane.
- Operate fit: task, states, shortcut preserved; no invented KPIs/logos.
- Cognitive load risk: density 8 — keep visible options in the entry band ≤ required fields + one save.
- Honest gap: default time behaviour and exact requiredness of berth note are not fully specified beyond pack job wording — leave as unknowns if implementation needs more than “fields exist”.

## 7. Alternates (named · one-line case each)

- **C1 · AIS traffic list:** if masters already live in target-list UIs, fuse list selection + detail rail while keeping entry commit as primary.
- **C2 · Bridge checklist:** if validation-first culture dominates, gate Save until required fields pass — still no wizard chrome.

Re-roll: available on factual failure only (assigned world cannot carry log task); taste alone is not grounds.

## 8. Implementation guidance (pack-bound)

- Desktop web app; imageless.
- Shell near-black; panels fog grey; amber warnings only.
- Implement states: empty log, validation error, success row, offline banner.
- Expose Ctrl+Enter on the log form.
- Do not invent throughput KPIs or customer logos.
- Do not use consumer fintech gradients or playful illustration chrome.
- Voice: operational, short labels.
- Motion intensity 1; aesthetic boldness 3; visual density 8.
