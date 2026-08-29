# Frontend Design — native direction (screening)

Arm: frontend-design @ b29e7cf65e5cb78a5ac33d582270551bc74a14eb  
Brief: Northline Leather Goods (01-leather-goods)  
Method: creative thesis → compact plan → self-critique → builder packet  
ai_generated: "(C)"

---

## Subject pin

- **Subject:** Northline Leather Goods — small-batch bags and straps in bridle leather, solid brass, vegetable tan.
- **Audience:** buyers who care about hide grade and make-slot lead time, not luxury theatre.
- **Single page job:** pick a product → choose hide grade → request a make-slot.
- **Platform:** mobile-first web.
- **Truth only:** Field Tote, Belt No. 2, Shoulder Strap; DKK 890–2.400; 3-week make-slot; no reviews, no celebrity clients, no free worldwide shipping, no lifestyle models.

---

## Design thesis

**Northline is a make-slot desk, not a boutique shelf.**  
Open on the load-bearing product plate (Field Tote), not a lifestyle hero. The first fold argues one thing: graded hide, trade facts on the plate edge, and a request for a three-week make-slot. Soft luxury, purple SaaS gradients, star ratings, and model photography are out of register for this shop.

---

## Compact plan (pass 1 → revised)

### Colour (brief-locked axis; named tokens)

| Token | Hex | Role |
| --- | --- | --- |
| warm-cream | `#F2EBE0` | page ground (brand: warm cream) |
| ink-brown | `#241912` | primary type / rules |
| hide-mid | `#5C4332` | secondary type, inactive chrome |
| brass | `#B08A3C` | single accent — CTA fill, hardware callouts only |
| edge-bone | `#E4D9C8` | plate rails, chip wells, quiet panels |
| soot | `#120E0B` | focus ring companion, deep borders |

No purple, no multi-stop SaaS gradients, no acid-neon on dark as identity. Brass is the only accent hue.

### Type

| Role | Face | Notes |
| --- | --- | --- |
| Display / product names | **Barlow Condensed** 600–700 | Workshop signage; tight tracking on short product names; restraint — not full-page shouting |
| Body / trade English | **IBM Plex Sans** 400–500 | Plain, legible 45–75ch; no luxury serif fluff |
| Utility / facts | **IBM Plex Mono** 400–500 | Hide grade codes, stitch count, lead time, price band |

Type *is* identity: condensed stamp + mono facts carry the trade voice. Display stays short (product + one line); body never performs poetry.

### Layout concept — “Bench stack”

Mobile-first vertical bench. Product plate is the object on the bench; controls sit under it like tools, not floating SaaS cards.

```
┌─────────────────────────────┐
│ NORTHLINE          Make-slots│
├─────────────────────────────┤
│                             │
│   [ Field Tote plate ]      │  ← full-bleed product plate
│                             │
│ BRIDLE · VEG TAN · BRASS    │  ← material stamp line (facts)
├─────────────────────────────┤
│ Hide grade                  │
│ [A] [B] [C]  ← grade chips  │  ← SIGNATURE
├─────────────────────────────┤
│ DKK … · 3-week make-slot    │
│ [ Request make-slot ]       │  ← brass CTA
├─────────────────────────────┤
│ Belt No. 2 plate (secondary)│
│ Shoulder Strap (list row)   │
├─────────────────────────────┤
│ Specs only (no reviews)     │
└─────────────────────────────┘
```

Desktop widens the plate and parks hide chips + CTA as a sticky rail under ~768px+ — still one bench, not a magazine spread.

### Signature element

**Hide Grade Strip** — a single horizontal strip of hide-grade chips under the primary product plate. Each chip is a small material swatch treatment (edge-bone well + ink-brown label + optional grade letter), not a lifestyle thumbnail. Selection quietly darkens the plate’s edge rail and updates the make-slot summary line (“Hide B · 3-week make-slot”). This is the one memorable control; everything else stays quiet.

### Motion (intensity 2)

- One orchestrated moment: plate edge rail responds to hide selection (120–180ms opacity/border).
- No scroll-jacking, no ambient particle leather dust, no staggered card cascades.
- `prefers-reduced-motion`: instant state swap, no transition.

### Information hierarchy

1. Product plate (Field Tote primary; Belt No. 2 secondary plate).
2. Material stamp facts (bridle / veg tan / solid brass) — truth only.
3. Hide grade choice (required before CTA enables, if interaction allows; else CTA still labels make-slot).
4. Price band + 3-week lead time.
5. Primary action: **Request make-slot**.
6. Secondary products and plain specs. No testimonial block (none on file). No fake ★ rows.

### Imagery and assets

- **Load-bearing:** `field-tote.webp`, `belt-no-2.webp` as product plates on cream/edge-bone grounds; square or near-square, no model crops.
- **Optional when available:** `stitch-macro.webp` as a single proof inset near specs — not a hero.
- **Forbidden:** lifestyle models, stock handshakes, invented review avatars.
- Shoulder Strap may appear as text + price until a plate exists (manifest does not list a strap plate as have).

### Interface writing (plain trade English)

- CTA: “Request make-slot” (not “Buy now”, not “Experience craftsmanship”).
- Empty/error: “Choose a hide grade to continue.” / “Make-slot request failed — try again.”
- Labels: Hide grade, Lead time, Price, Materials.
- No luxury fluff (“timeless”, “bespoke journey”, “crafted for the few”).

---

## Self-critique (anti-default pass)

| Probe | Risk | Decision |
| --- | --- | --- |
| Default cluster 1: cream + serif + terracotta | Brief locks warm cream + ink brown + brass. Cream alone is not a free aesthetic. | Keep cream/ink/brass. **Reject** high-contrast serif display and terracotta. Use condensed grotesque + mono facts. |
| Default cluster 2: near-black + acid accent | Tempting “premium dark leather” template. | **Reject** as identity. Stay light bench; soot only for type/borders. |
| Default cluster 3: broadsheet hairlines + dense columns | Easy “heritage catalog” AI tell. | **Reject** newspaper grid. Use bench stack + one signature strip. |
| Purple SaaS gradient / cookie cards | Explicit anti-reference. | **Reject**. No multi-hue gradients; no glassmorphism product cards. |
| Fake social proof | Explicit ban. | **No** reviews, stars, celebrity clients. |
| Lifestyle models | Asset plan forbids. | **Only** product plates + optional stitch macro. |
| Decorative numbering 01/02/03 | Generic AI structure. | **No** step numbers unless showing real make process sequence; primary path is plate → hide → slot, shown as controls not trophy numbers. |
| Boldness budget | Density 6 / boldness 6 / motion 2. | Spend boldness on **plate scale + Hide Grade Strip + brass CTA**; cut ornamental texture overlays and multi-font decoration. |

**Revision after critique:** Dropped an earlier idea of full-viewport embossed grain video (too atmospheric, motion over budget, weak truth). Dropped serif “heritage” display. Locked mono for all measurable facts so the page cannot drift into lifestyle catalog.

**Primary risk:** Cream + brown leather ecommerce still collapses into a generic “artisan goods” template if plates are small and copy goes soft. Mitigation: plate-first fold, stamp line of materials, make-slot language, mono facts, single brass accent.

---

## Implementation guidance (builder packet)

1. Mobile-first single column; first paint is Field Tote plate edge-to-edge under a slim site bar.
2. CSS tokens from the colour table; brass only on primary CTA and small hardware icons (if any).
3. Load Barlow Condensed + IBM Plex Sans + IBM Plex Mono (used weights only); metric fallbacks: Arial Narrow / system-ui / ui-monospace.
4. Hide Grade Strip: accessible radiogroup; selected state updates summary text and plate rail class; keyboard focus visible (ink-brown ring on cream).
5. CTA copy fixed: “Request make-slot”; secondary path may list Belt No. 2 plate and Shoulder Strap without inventing images.
6. Specs: hide grade, stitch count (if known), materials, lead time 3 weeks, price band DKK 890–2.400 — no invented claims.
7. Quality floor: usable at 375px, visible focus, reduced-motion path, no horizontal overflow, no console noise from missing assets (strap plate absent → text row).
8. Do not add testimonial or star-rating blocks “for conversion.”

---

## Unknowns (leave unknown)

- Exact hide grade labels/codes beyond the fact that grade is a choice dimension.
- Stitch-macro asset not yet `have` in manifest.
- Shoulder Strap plate not declared as have.
- Whether make-slot request is form-only or calendar of discrete slots (evidence states lead time 3 weeks, not a booking UI schema).
