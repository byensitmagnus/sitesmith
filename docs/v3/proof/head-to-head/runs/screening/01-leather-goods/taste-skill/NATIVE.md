# taste-skill native direction — 01-leather-goods

Arm: taste-skill  
Commit: e988add20dab0fa97d7a76781c48961c8184288e  
Method: Design Read + dials (brief-gated)  
Subject pack: Northline Leather Goods only

---

## 0. Design Read

Reading this as: mobile-first sensory ecommerce landing for people who buy small-batch bags and straps and care about hide grade, with a plain-trade premium-consumer language (not luxury fluff), leaning toward native CSS + Tailwind product-plate catalog aesthetic — no official design-system package.

### Signals used (pack only)

| Signal | Value |
| --- | --- |
| Page kind | Sensory ecommerce / configure-to-order landing |
| Audience | Hide-grade-conscious small-batch bag/strap buyers |
| Primary action | Configure a bag and request a make-slot |
| Platform | Mobile-first web |
| Vibe / voice | Plain trade English; sensory product truth |
| Brand assets | Ink brown, warm cream, single brass accent |
| Quiet constraints | Trust-first commerce; no fake social proof; no lifestyle models |
| Anti-references | Purple SaaS gradient; stock handshakes; fake 4.9★ rows |

### Clarifying question

None. Brief dials and brand palette are explicit; primary journey and truth bounds are stated. Proceed without guessing.

### Anti-default discipline (active)

- No AI-purple / mesh / glass defaults.
- No Inter + slate-900 as the system.
- No centered hero (DESIGN_VARIANCE > 4).
- No fake reviews, celebrity clients, free worldwide shipping, or testimonials (none on file).
- No lifestyle model photography.
- Premium-consumer palette ban **overridden** only because BRAND.md explicitly names ink brown + warm cream + single brass accent.

---

## 1. Three dials (from brief → taste dials)

Brief states: visual density 6 · motion intensity 2 · aesthetic boldness 6.

| Dial | Value | Inference |
| --- | ---: | --- |
| `DESIGN_VARIANCE` | **6** | Aesthetic boldness 6 → offset layouts (not artsy chaos). Split / left-heavy product + config, not perfect symmetry. |
| `MOTION_INTENSITY` | **2** | Brief motion 2 → static baseline; `:hover` / `:active` only; no scroll hijack, no load-in cascades as product. |
| `VISUAL_DENSITY` | **6** | Brief density 6 → daily-app spacing (`py-16`–`py-24` band), not gallery air and not cockpit packing. |

Preset cross-check: Landing (Premium consumer) would default 7/6/3; **brief overrides** motion down and density up. Brief wins.

### How dials gate this page

- **Variance 6:** desktop split (product plate + evidence left / configure action right); mobile collapses to single column (plate → truth strip → config).
- **Motion 2:** no auto animation; tactile press on CTA only (`scale-[0.98]` / `-translate-y-[1px]` on `:active`); honour `prefers-reduced-motion` as default mode.
- **Density 6:** readable product + spec blocks with standard section gaps; cards only where elevation marks the active configure panel.

---

## 2. Foundation

Aesthetic, not a named design system. Build with native CSS + Tailwind utilities + owned components. No Fluent / Material / Carbon / Polaris / shadcn-as-brand.

Honest family: **trade product catalog / material-board ecommerce** — product plates as load-bearing evidence, configure path as the only conversion spine.

---

## 3. Direction (design engineering, dial-gated)

### Composition

- Desktop: left-aligned content / right-aligned configure column (anti-center; variance 6).
- First fold must contain: product name, one primary plate (Field Tote), ≤20-word subtext, price band truth, primary CTA visible without scroll.
- Mobile (`<768px`): strict single column, full-width, standard horizontal padding — no residual asymmetric offsets.
- Secondary products (Belt No. 2, Shoulder Strap) as a later row/strip — not three equal feature cards as the hero pattern.

### Information hierarchy

1. **Identity** — Northline Leather Goods; plain trade line.
2. **Object** — Field Tote product plate (load-bearing).
3. **Truth strip** — hide grade · stitch count · materials (bridle leather, solid brass, vegetable tan) · price band DKK 890–2.400 · make-slot lead time 3 weeks.
4. **Primary journey** — pick product → choose hide → request make-slot.
5. **Secondary objects** — Belt No. 2 plate; Shoulder Strap listed without invented photography.
6. **No** testimonials / star rows / celebrity / shipping claims.

### Typography

- Display / UI: sans-serif display (rotate: Satoshi, Cabinet Grotesk, or Geist — not Inter default).
- Body: same family or tight pair; `text-base` · relaxed leading · `max-w-[65ch]`.
- Serif: **not used**. Brand voice is plain trade, not editorial manuscript; luxury-serif default is an AI tell here.
- Emphasis inside headlines: italic/bold of the **same** family only.
- Labels: sentence case for operational clarity (hide grade, make-slot, stitch count).
- Numbers (price, weeks, stitch count): tabular / mono optional for figures only.

### Colour and material model

- Base: warm cream ground; ink brown text and structure.
- Accent: **single brass** — primary CTA fill and active form focus only. One accent lock for the whole page.
- Borders / rules: ink brown at low opacity or brass hairline on the active configure panel only.
- Shadows: if used, tinted to cream ground — no pure-black drop shadow.
- Shape consistency: **all-sharp** (radius 0) for trade-catalog edges — buttons, plates, inputs share the rule.
- Dual mode: same hue family inverted; brass remains the only accent. Test both modes; brand default is light/cream.

### Imagery and asset strategy

- Load-bearing: `field-tote.webp`, `belt-no-2.webp` (have).
- Optional / needed: `stitch-macro.webp` — may show as a materials detail only if present; do not invent.
- Product plates only; **deliberately no lifestyle models**.
- No stock handshakes; no decorative mesh/gradient hero art.

### Interaction concept

- Primary journey only: pick product → choose hide → request make-slot.
- One CTA intent label site-wide: **Request make-slot** (nav/hero/footer same words).
- Form: labels above inputs; helper markup present; errors below; no placeholder-as-label.
- States: loading skeleton shaped like the configure panel; empty hide selection; inline field errors; success is confirmation of request — not fake shipping promise.
- Motion intensity 2: hover colour/border shift only; active press; no parallax, no scroll-driven choreography.
- Button contrast: brass fill must pass WCAG AA against label colour; ghost links need stroke or ink text.

### Signature element

**Product-plate spine + brass CTA lock** — the Field Tote plate occupies the proof column as the permanent evidence object; brass appears only on the request control. Signature is the trade catalog split (object proof vs make-slot action), not ornament.

### Primary risk

Brand palette (cream + ink + brass) matches the banned warm-craft LLM default; it is legal here only via explicit brand naming. If product plates or truth strip thin out, the page collapses into generic artisan cream. Secondary risk: missing stitch-macro leaves materials section weaker than the evidence claim set.

### Implementation guidance

- Stack: semantic HTML + Tailwind (or native CSS tokens); mobile-first.
- Hero fits initial viewport; headline ≤2 lines desktop; subtext ≤20 words.
- Section rhythm at density 6: product/config first fold, truth strip, secondary products, configure form completion — no quote/testimonial band.
- Price and lead time only as pack: DKK 890–2.400; 3 weeks make-slot.
- Products only as pack: Field Tote, Belt No. 2, Shoulder Strap.
- Materials only as pack: bridle leather, solid brass, vegetable tan.
- Pre-flight: no emoji icons; focus rings visible; 375 / 768 / 1440; both colour schemes; no purple SaaS gradient.

### Unknowns (stay unknown)

- Exact hide-grade option list and per-product stitch counts (facts may appear, values not supplied).
- Make-slot request backend / capacity calendar.
- Shipping policy (must not invent free worldwide shipping).
- Stitch-macro asset not declared as have.
- Full product photography for Shoulder Strap.
- Any review, rating, or client endorsement content.

---

## 4. Pre-flight (taste hard rules mapped)

- [ ] Hero CTA visible without scroll
- [ ] One CTA intent label only
- [ ] No serif default / no Fraunces / Instrument Serif
- [ ] One accent (brass) locked page-wide
- [ ] No testimonials / star rows / celebrity / invented shipping
- [ ] Product plates only; no lifestyle models
- [ ] Motion ≤ hover/active
- [ ] Mobile single-column collapse for asymmetric desktop
- [ ] WCAG AA on CTA and form chrome
- [ ] Both light and dark modes checked
