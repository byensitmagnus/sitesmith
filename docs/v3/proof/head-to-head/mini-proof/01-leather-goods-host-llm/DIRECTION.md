---
title: "DIRECTION — 01-leather-goods"
status: direction-engine-slice
ai_generated: "(C)"
---

# DIRECTION — 01-leather-goods

## Design thesis
Northline is a make-slot desk, not a boutique shelf: open on the Field Tote product plate with trade facts stamped on the plate edge; the argument is graded hide + a three-week make-slot request — never lifestyle hero, purple SaaS gradient, or star ratings.

## Subject grounding
Subject: Northline Leather Goods
Audience: people who buy small-batch bags and straps and care about hide grade.
Primary action: configure a bag and request a make-slot.
Products/work: Field Tote, Belt No. 2, Shoulder Strap
Materials: bridle leather, solid brass, vegetable tan
Brand palette cues: ink brown, cream, brass accent
Anti-references: purple SaaS gradient, stock handshake photos, fake 4.9★ rows; purple SaaS gradient, stock handshake photos, fake 4.9★ rows.

## Hierarchy
1) Field Tote product plate 2) material stamp facts (bridle / veg tan / solid brass) 3) hide grade choice 4) price band DKK 890–2.400 + 3-week lead 5) primary CTA Request make-slot 6) Belt No. 2 plate + Shoulder Strap text until plate exists — no testimonials, no fake star rows.

## Signature
Hide Grade Strip — horizontal hide-grade chips (material swatch wells + ink-brown labels) under the Field Tote plate; the single memorable control that ties plate → grade → make-slot.

## Primary risk
Cream + brown leather ecommerce can still read as generic artisan catalog if plates shrink and copy softens into luxury fluff; mitigate with plate-first fold, stamp facts, mono measurements, make-slot language, and brass only on the CTA.

## Axis record

- direction-version: 2.3
- composition: single object left, large type right
- type: Display: Barlow Condensed 600–700 for product names (workshop signage, tight tracking). Body: IBM Plex Sans 400–500 plain trade English 45–75ch. Utility: IBM Plex Mono for hide grade codes, stitch count when known, lead time, prices. No luxury serif display.
- colour: Warm cream ground; ink-brown type and rules; hide-mid secondary; brass only on CTA and hardware callouts; edge-bone plate rails; deep soot borders. Materials: bridle leather, solid brass, vegetable tan. No purple multi-stop SaaS gradients.
- imagery: Load-bearing product plates field-tote.webp and belt-no-2.webp on cream grounds, no model crops. stitch-macro.webp as single proof inset only when available (needed). Shoulder Strap as text+price until a plate exists. Deliberately no lifestyle models or stock handshakes.
- rhythm: hard vertical split then calm bands

- surface: open — subject earns space around the object
- labels: sentence case captions — retail voice stays human
- figures: proportional — price is content not motif
- depth: elevated — object lifts off ground slightly

- visual-density: 6
- motion-intensity: 2
- aesthetic-boldness: 6

- signature-selector: [data-signature="Hide Grade Strip — horizontal hide-grade chips (material swatch wells + ink-brown labels) under the Field Tote plate; the single memorable control that ties plate → grade → make-slot."]
- signature-min-share: 12

## Implementation notes
Tokenize cream/ink/brass/edge-bone; brass only on primary CTA and small hardware icons. Load only used weights of Barlow Condensed, IBM Plex Sans, IBM Plex Mono. First paint: Field Tote plate under slim site bar at 375px. Radiogroup for hide grades with visible focus. Fixed CTA copy Request make-slot. Specs limited to hide grade, materials, lead time 3 weeks, price band DKK 890–2.400, stitch count only if known. Absent strap plate → text row. No invented social proof blocks.

## Rejections
- alternative card (W2): withheld from build
- alternative card (W4): withheld from build