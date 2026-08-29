# Native Design Read + Direction — Passage Log Console (taste-skill)

## Design Read

**Reading this as: desktop operational product UI for harbour masters, with a dense cockpit / maritime ops language, leaning toward monochrome industrial console + single signal-amber exception — not SaaS marketing chrome, not landing aesthetics.**

Page kind is not landing/portfolio/redesign. It is a single-journey work surface: open log form → fill required fields → save → see row. Audience is desk-side operators, not buyers. Quiet constraints: visual density 8, motion 1, aesthetic boldness 3, deliberately imageless chrome, short operational labels, anti-references consumer fintech gradients and playful illustration.

---

## Dials (brief-forced; marketing baseline discarded)

| Dial | Value | Drive |
|---|---|---|
| `VISUAL_DENSITY` | **8** | Cockpit: tight paddings, 1px rules not card stacks, `font-mono` for times and data-like fields |
| `MOTION_INTENSITY` | **1** | Static: no auto animations, no load cascades; `:hover` / `:focus` / `:active` only |
| `DESIGN_VARIANCE` | **~3** | From aesthetic boldness 3: predictable grid, equal rhythm, left-aligned work strip — no asymmetric hero theatre |

taste-skill marketing baseline `8 / 6 / 4` (variance/motion/density) is **overridden**. Do not re-inflate motion or variance for “polish.” Trust-first / regulated density patterns win over landing presets.

---

## Anti-default discipline

- No AI-purple / neon mesh / glassmorphism fintech shell
- No centered hero + three feature cards
- No Inter-as-identity (neutral UI sans OK; mono owns data)
- No KPI card dashboard or fake throughput
- No playful illustration chrome (asset plan: deliberately imageless)
- No dual-accent rainbow; amber is warnings only — not primary CTA candy
- No serif “premium ops” flourish

---

## Direction thesis

One **passage desk** screen: near-black shell, fog-grey work panels, compose-form as the primary action surface, continuous log as commit memory. Hierarchy is compose → commit → confirm row — not explore product.

**Signature:** a persistent full-width **status strip** (quiet online / loud offline) is the only place signal amber appears at full strength. Greyscale carries normal work so colour means pay-attention.

---

## Composition

Desktop-first app chrome. No marketing nav.

```
┌─────────────────────────────────────────────────────────────┐
│ Passage Log · short context              [status strip]     │
├──────────────────────────┬──────────────────────────────────┤
│ LOG PASSAGE (form)       │ LOG (rows)                       │
│ vessel *                 │ empty | rows | success emphasis  │
│ direction * (in/out)     │                                  │
│ time *                   │                                  │
│ berth note               │                                  │
│ [Save · Ctrl+Enter]      │                                  │
└──────────────────────────┴──────────────────────────────────┘
```

- Split ~40–45% form / ~55–60% log. Cap content width on ultra-wide; densify vertically.
- Density 8: fog-grey slabs + 1px dividers on near-black shell — no floating card stack.
- Labels above inputs; required on vessel, direction, time; berth note optional.
- Primary submit: **Save** with **Ctrl+Enter** as secondary hint only (pack-allowed fact). Not a second CTA.

---

## Information hierarchy

1. **Compose** — required fields for one passage  
2. **Commit** — Save / Ctrl+Enter  
3. **Confirm** — success is the new log row (static weight/border; no confetti)  
4. **Correct** — validation errors inline under fields  
5. **Degrade** — offline banner on status strip  

| State | Treatment |
|---|---|
| Empty log | Short operational copy pointing to form; type only |
| Validation error | Inline under field; form stays put |
| Success row | New row with static emphasis only (motion 1 forbids pulse theatre) |
| Offline banner | Full-width status strip; system state until online |

No invented recovery KPIs, logos, or secondary journeys.

---

## Typography

- **Chrome / labels:** one geometric or neo-grotesk sans (Geist, IBM Plex Sans, or equivalent — not Inter-as-brand). Short operational labels.
- **Data:** `font-mono` mandatory at density 8 for timestamps and code-like identifiers.
- Scale: compact toolbar title — no display hero H1.
- No serif. No mixed-family kinetic emphasis.

---

## Colour and material

- **Shell:** near-black  
- **Panels:** fog grey  
- **Accent:** signal amber — **warnings only** (offline / warn patterns). Primary controls stay high-contrast neutral — never amber buttons.  
- One cool greyscale lock + amber exception. No second brand accent.  
- Flat industrial: 1px borders, minimal/no tinted shadows, no glass, no gradients.  
- Shape lock: one small radius scale (0–4px) everywhere.

---

## Imagery and assets

Deliberately **imageless**. UI chrome is content. Empty/error states = type + structure only. No harbour stock, logos, or vessel illustration.

---

## Interaction concept

- Motion 1: no entrance choreography; no skeleton shimmer theatre unless real async requires a static disabled + short status text.
- Visible focus rings (keyboard desk work).
- `:active` may use 1px press (`scale-[0.98]`) — no bounce.
- Form: label above, helper optional, error below; never placeholder-as-label.
- One screen; no multi-step wizard.

---

## Signature element

**Always-on status strip + amber-as-exception.** Colour = attention; greyscale = normal logging. Distinctive ops mark without invented brand mythology.

---

## Primary risk

(1) Dark SaaS dashboard drift — cards, mesh gradients, fake metrics.  
(2) Amber used as CTA colour, burning the warning signal.  
(3) Under-density that makes the form feel like a marketing contact form.

---

## Implementation guidance

1. Tokens: `--shell`, `--panel`, `--ink`, `--muted`, `--line`, `--warn-amber`; optional `--danger` for hard validation — amber stays warn-only.  
2. CSS grid two columns desktop; brief is desktop web app — prioritize desktop.  
3. Density 8: tight field gaps, 1px row rules, mono times.  
4. First-class states: `EmptyLog`, `FieldError`, `SuccessRow`, `OfflineBanner`.  
5. Save + Ctrl+Enter only shortcut claimed.  
6. Content limited to pack facts: vessel, direction (inbound/outbound), time, berth note; requiredness as above.  
7. Review fail: any consumer fintech gradient mesh or illustration chrome.

---

## Unknowns (stay unknown)

Berth taxonomy, vessel registry, multi-user/auth, harbour map, analytics, branding beyond shell/panel/amber, light-mode dual theme requirement, throughput claims.

---

## Source pointers

- Arm: taste-skill  
- Method: Design Read + dials + design-engineering anti-slop  
- Pack: `docs/v3/proof/head-to-head/_agent-packs/03-passage-console.md`  
- Method pack: `docs/v3/proof/head-to-head/_agent-packs/_taste-skill.md`  
- Commit: `e988add20dab0fa97d7a76781c48961c8184288e`  
- Phase: screening-v2  
- runId: screening-v2-03-passage-console-taste-skill
