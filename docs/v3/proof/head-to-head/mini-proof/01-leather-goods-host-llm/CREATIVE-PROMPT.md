You are a design director. Produce ONE direction packet as pure JSON.

RULES:
- Use ONLY facts from the pack below. Do not invent testimonials, awards, ratings, free shipping, logos, KPIs, or image files not listed.
- Prefer a bold, specific thesis and a named signature element (like a control or mark), not generic SaaS.
- Honour anti-references and asset constraints.
- unknowns must list genuine unknowns, not invent fillers.

PACK:
--- BRIEF ---
---
title: "Subject: Northline Leather Goods"
status: proof-fixture
ai_generated: "(C)"
---

# Subject: Northline Leather Goods

Mode intent: sensory ecommerce with real product choices.

Audience: people who buy small-batch bags and straps and care about hide grade.
Primary action: configure a bag and request a make-slot.
Platform: mobile-first web.

Visual density: 6
Motion intensity: 2
Aesthetic boldness: 6

--- EVIDENCE ---
---
title: "Evidence — Northline Leather Goods"
status: proof-fixture
ai_generated: "(C)"
---

# Evidence — Northline Leather Goods

Subject: Northline Leather Goods
Products (truth): Field Tote, Belt No. 2, Shoulder Strap
Price band (truth): DKK 890–2.400 from supplier sheet 2026-07
Materials: bridle leather, solid brass, vegetable tan
Facts that may appear: hide grade, stitch count, make-slot lead time (3 weeks)
Facts that must not be invented: reviews, celebrity clients, free worldwide shipping

Anti-references: purple SaaS gradient, stock handshake photos, fake 4.9★ rows
Primary journey: pick product → choose hide → request make-slot

--- BRAND ---
---
title: "Brand"
status: proof-fixture
ai_generated: "(C)"
---

# Brand

Ink brown, warm cream, single brass accent.
Voice: plain trade English, no luxury fluff.
No testimonials on file.

--- ASSET PLAN ---
---
title: "Asset plan"
status: proof-fixture
ai_generated: "(C)"
---

# Asset plan

Load-bearing: product plates for Field Tote and Belt No. 2.
Optional: stitch macro.
Deliberately no lifestyle models.

--- ASSET MANIFEST ---
---
title: "Asset manifest"
status: proof-fixture
ai_generated: "(C)"
---

# Asset manifest

- field-tote.webp (have)
- belt-no-2.webp (have)
- stitch-macro.webp (needed)

--- CONSTRAINTS ---
---
title: Constraints — Northline Leather Goods
status: frozen-benchmark-input
ai_generated: "(C)"
---

# Constraints

Source: existing proof brief evidence/brand/asset plan only. Unknowns stay unknown.

- Do not invent reviews, celebrity clients, or free worldwide shipping.
- Anti-references: purple SaaS gradient, stock handshake photos, fake 4.9★ rows.
- No testimonials on file (brand).
- Deliberately no lifestyle models (asset plan).
- Load-bearing assets: product plates for Field Tote and Belt No. 2; stitch macro is needed/not declared as have.
- Platform: mobile-first web (brief).
- Price band and make-slot lead time only as stated in evidence.

SKELETON (structure from SiteSmith engine — improve prose, do not ignore constraints):
{
  "designThesis": "Northline Leather Goods is a make-slot desk, not a boutique shelf: open on Field Tote, Belt No. 2, Shoulder Strap with trade facts on the plate edge; primary argument is material truth + “configure a bag and request a make-slot.” — never lifestyle hero; ban purple SaaS gradient, stock handshake photos, fake 4.9★ rows.",
  "subjectGrounding": "Subject: Northline Leather Goods · Audience: people who buy small-batch bags and straps and care about hide grade. · Action: configure a bag and request a make-slot. · Products: Field Tote, Belt No. 2, Shoulder Strap · Materials: bridle leather, solid brass, vegetable tan · Palette: ink brown, cream, brass accent · Anti-refs: purple SaaS gradient, stock handshake photos, fake 4.9★ rows; purple SaaS gradient, stock handshake photos, fake 4.9★ rows.",
  "composition": "single object left, large type right",
  "informationHierarchy": "1) Field Tote, Belt No. 2, Shoulder Strap plate recognition 2) bridle leather, solid brass, vegetable tan 3) choice control (grade/size if evidenced) 4) configure a bag and request a make-slot. 5) secondary SKUs — no fake ★/testimonials",
  "typography": "Display: Barlow Condensed 600–700 (product names / workshop signage). Body: IBM Plex Sans 400–500 (plain trade English, 45–75ch). Utility: IBM Plex Mono 400–500 (grades, lead times, prices). Seed structure: condensed display grotesque over quiet sans.",
  "colourAndMaterialModel": "cream; type/rules in ink brown; accent only on primary CTA/hardware (brass accent). Materials in play: bridle leather, solid brass, vegetable tan. Seed note: ink brown, cream, brass accent — brand evidence only; single reserved accent",
  "imageryAndAssetStrategy": "Object-led plates only for Field Tote, Belt No. 2, Shoulder Strap (have in manifest/plan). No lifestyle models, no stock handshakes. Needed-only assets stay labelled slots.",
  "interactionConcept": "hover reveals material fact on the object",
  "signatureElement": "Hide Grade Strip under Field Tote plate — chips bind plate → grade → make-slot",
  "primaryRisk": "Must not drift into banned tropes (purple SaaS gradient, stock handshake photos, fake 4.9★ rows; purple SaaS gradie); signature may overfit if evidence is thin.",
  "implementationGuidance": "Thesis lock: Northline Leather Goods is a make-slot desk, not a boutique shelf: open on Field Tote, Belt No. 2, Shoulder Strap with trade facts on the plate edge; primary argument is material truth + “configure a bag and request a make-slot.” — never lifestyle hero; ban purple SaaS gradient, stock handshake photos, fake 4.9★ rows. Signature selector: [data-signature] implements “Hide Grade Strip under Field Tote plate — chips bind plate → grade → make-slot”. Hierarchy: 1) Field Tote, Belt No. 2, Shoulder Strap plate recognition 2) bridle leather, solid brass, vegetable tan 3) choice control (grade/size if evidenced) 4) configure a bag and request a make-slot. 5) secondary SKUs — no fake ★/testimonials Type: Display: Barlow Condensed 600–700 (product names / workshop signage). Body: IBM Plex Sans 400–500 (plain trade English, 45–75ch). Utility: IBM Plex Mono 400–500 (grades, lead times, prices). Seed structure: condensed display grotesque over quiet sans. Colour/material: cream; type/rules in ink brown; accent only on primary CTA/hardware (brass accent). Materials in play: bridle leather, solid brass, vegetable tan. Seed note: ink brown, cream, brass accent — brand evidence only; single reserved accent Imagery: Object-led plates only for Field Tote, Belt No. 2, Shoulder Strap (have in manifest/plan). No lifestyle models, no stock handshakes. Needed-only assets stay labelled slots. Interaction: hover reveals material fact on the object; honour dials if explicit on brief. CTA language stays pack-true: “configure a bag and request a make-slot.”. Fail closed: no invented reviews, awards, KPIs, logos, or free shipping. Anti-refs enforced: purple SaaS gradient, stock handshake photos, fake 4.9★ rows; purple SaaS gradient, stock handshake photos, fake 4.9★ rows.",
  "unknowns": "none declared",
  "sourcePointers": {
    "arm": "sitesmith",
    "creativePass": "skeleton"
  }
}

Return ONLY a JSON object with exactly these keys:
designThesis, subjectGrounding, composition, informationHierarchy, typography, colourAndMaterialModel, imageryAndAssetStrategy, interactionConcept, signatureElement, primaryRisk, implementationGuidance, unknowns
All values strings.