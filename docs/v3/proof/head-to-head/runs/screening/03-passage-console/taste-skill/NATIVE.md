# Native Design Read + Direction — Passage Log Console (taste-skill)

## Design Read

**Reading this as: desktop operational product UI for harbour masters, with a dense cockpit / maritime ops language, leaning toward monochrome industrial console + single signal-amber exception — not SaaS marketing chrome.**

Page kind is not landing/portfolio. It is a single-journey work surface: open log form → fill required fields → save (Ctrl+Enter) → see row. Audience is operational staff, not buyers. Quiet constraints: desk-side density, short labels, imageless chrome, forbidden consumer-fintech gradients and playful illustration.

---

## Dials (from brief; not re-inferred upward)

| Dial | Value | Drive |
|---|---|---|
| `VISUAL_DENSITY` | **8** | Cockpit: tight paddings, 1px rules not cards, mono for times/IDs/fields that behave as data |
| `MOTION_INTENSITY` | **1** | Static: no auto animations, no load cascades; `:hover` / `:focus` / `:active` only; reduced-motion is default |
| Aesthetic boldness (brief) | **3** | Maps to low `DESIGN_VARIANCE` (~3): predictable grid, equal rhythm, left-aligned work strip — no asymmetric hero theatre |

Baseline taste-skill marketing defaults (8/6/4 variance/motion/density) are **overridden** by this brief. Do not re-inflate motion or variance because “product UI usually has polish.”

---

## Anti-default discipline (what we refuse)

- No AI-purple / neon mesh / glassmorphism fintech shell
- No centered hero + three feature cards
- No Inter-as-identity (neutral UI sans OK; mono owns data)
- No card-stack dashboard of fake KPIs
- No playful illustration chrome (asset plan: deliberately imageless)
- No dual accent rainbow (amber is warnings only — not primary CTA candy)

---

## Direction thesis

Build a **single-screen passage desk**: near-black shell, fog-grey work panel, one primary form column, log list as the continuous record under or beside it. Hierarchy is “compose → commit → confirm row,” not “explore product.”

Signature: **signal strip** — a thin full-width status rail (online / offline banner, validation summary) that is the only place amber appears at full strength. Everything else is greyscale structure.

---

## Composition

Desktop-first app chrome (no marketing nav).

```
┌─────────────────────────────────────────────────────────────┐
│ app title · context (short)              [status strip]     │
├──────────────────────────┬──────────────────────────────────┤
│ LOG PASSAGE (form)       │ RECENT / LOG (table or rows)     │
│ vessel *                 │ empty | rows | success highlight │
│ direction *              │                                  │
│ time *                   │                                  │
│ berth note               │                                  │
│ [Save · Ctrl+Enter]      │                                  │
└──────────────────────────┴──────────────────────────────────┘
```

- Split ~40/60 or ~45/55: form left (action), log right (memory). On very wide viewports keep max content width so fields do not stretch into unreadability; densify vertically, not horizontally forever.
- No floating cards: panels are fog-grey slabs with 1px dividers on near-black shell (`VISUAL_DENSITY 8`).
- Form labels above inputs; requiredness marked on field labels only (vessel, direction, time per job). Notes optional.
- Keyboard fact: primary submit exposes **Ctrl+Enter** as secondary label next to Save — not a third CTA.

---

## Information hierarchy

1. **Compose** — required fields for one passage
2. **Commit** — Save (Ctrl+Enter)
3. **Confirm** — success row appears in log; transient success is the new row itself, not a confetti toast
4. **Correct** — validation errors inline under fields; form stays put
5. **Degrade** — offline banner on status strip; no invented recovery KPIs

States that exist (and only these invented-as-UI, not as fake metrics):

| State | Treatment |
|---|---|
| Empty log | Short operational empty copy + pointer to form; no illustration |
| Validation error | Inline under field; summary optional on strip; amber only if severity = warning pattern, else high-contrast error red reserved sparingly OR monochrome error with border — prefer structural red/amber per brand: amber = warnings only |
| Success row | New row inserted with quiet emphasis (background pulse forbidden at motion 1 — use static border or weight shift only) |
| Offline banner | Status strip, full width, non-dismiss as critical system state until online |

---

## Typography

- **UI labels / chrome:** one geometric or neo-grotesk sans (Geist, IBM Plex Sans, or similar — not Inter-as-brand). Short labels; operational voice.
- **Data (times, vessel identifiers when treated as codes, row keys):** `font-mono` mandatory at density 8 for numbers and time stamps.
- Scale: compact. No display-size H1. App title is toolbar-scale, not hero type.
- No serif. No mixed-family kinetic emphasis.

---

## Colour and material

- **Shell:** near-black
- **Panels:** fog grey
- **Accent:** signal amber — **warnings only** (offline severity if framed as warning; validation if brand maps warning there). Primary interactive elements stay high-contrast neutral (light text on dark controls or dark text on fog controls) — not amber buttons.
- One palette lock: cool greyscale + amber exception. No second brand accent.
- Materiality: flat industrial. 1px borders. No heavy multi-layer shadows. No glass.
- Corner radius: one scale, small or zero (predictable ops UI). Document once: e.g. all-sharp or 2–4px everywhere.

---

## Imagery and assets

Deliberately **imageless**. UI chrome is content. Empty states use type + structure only. No stock harbour photos, no logos, no vessel illustrations.

---

## Interaction concept

- Motion dial 1: no entrance choreography; no skeleton shimmer theatre unless needed for real async (prefer static disabled + short status text).
- Focus rings visible (keyboard-first desk work).
- `:active` may use 1px press (`scale-[0.98]` or translate) — no bounce.
- Form: label above, helper optional, error below; never placeholder-as-label.
- Primary journey is one screen; no multi-step wizard.

---

## Signature element

**Status strip + amber-as-exception.** The strip is always present (online quiet / offline loud). Amber is rationed so operators learn: colour = pay attention, greyscale = normal work. This is the distinctive ops mark without inventing brand mythology.

---

## Primary risk

Over-polishing into “dark SaaS dashboard” (cards, gradients, KPI tiles) or under-delivering density so the form feels like a marketing contact form. Second risk: using amber as CTA colour, which burns the warning signal.

---

## Implementation guidance (build notes)

1. Theme tokens: `--shell`, `--panel`, `--ink`, `--muted`, `--line`, `--warn-amber`, `--danger` (danger only if needed for validation; keep amber exclusive to warn).
2. Layout: CSS grid two columns desktop; stack form-then-log only if viewport forces it (brief is desktop web app — prioritize desktop).
3. Density: tight field spacing (`gap` small), table/row list with 1px rules, mono times.
4. States as first-class components: `EmptyLog`, `FieldError`, `SuccessRow`, `OfflineBanner`.
5. Save button: “Save” + `Ctrl+Enter` hint; do not invent other shortcuts.
6. Content: only field names/requiredness from evidence — vessel, direction (inbound/outbound), time, berth/notes. No fake throughput, no customer logos.
7. Anti-references enforced in review: any gradient mesh or illustration chrome is a fail.

---

## Unknowns (stay unknown)

- Exact berth taxonomy, vessel registry integration, multi-user presence, auth model, harbour map, historical analytics, branding beyond shell/panel/amber, light mode requirement (brief frames near-black shell as given — do not invent dual-mode marketing).

---

## Source pointers

- Arm: taste-skill  
- Method: Design Read + dials + design-engineering anti-slop  
- Pack: `docs/v3/proof/head-to-head/_agent-packs/03-passage-console.md`  
- Method pack: `docs/v3/proof/head-to-head/_agent-packs/_taste-skill.md`  
- Commit pin (run meta): `e988add20dab0fa97d7a76781c48961c8184288e`
