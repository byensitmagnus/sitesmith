---
reviewer: P
reviewer-id: reviewer-p-blind
run-id: preflight-r5-8c556c7f8775
label: SHEET-M2
locked: 2026-07-29T13:08:00Z
sha256: b7fbdfe20c659f7f083ec8b719d4c2adbcbec3fad2eba5b9629261226224dfb7
brief-sha256: 920215fe1c1775f7c1ba051699af0e231e283c0299538bccba9ceb060f195d98
rubric-sha256: d9932ed6dc486719d74e6884db7a087bc9563bea07006233790845e2d49cf4f8
sheet-sha256: 8aba70dd8e55687f624550599ef7a992f14f80ef6af22d2ac013084a88bcec6b
---
primary-criticism: On a screen whose one job is "show me what is overdue", the late cask and the due-today casks wear the same solid pill at the same size in the same position, so when you squint at desktop screen 1 what you see is a column of amber blocks with one orange one in it, and the amber wins on area.
direction: 8
specificity: 6
type: 6
colour: 6
assets: 5
hierarchy: 5
production-readiness: 6

notes:
- specificity — desktop screen 1: strip the copy and the mono gyle numbers and the shell is the dark admin-panel default — KPI trio top right, coloured left spine per row, filled status pill, inline row form. The trade lives entirely in the words (firkins, kilderkins, ullage in pints, duty record); almost none of it is in the shapes.
- type — both views: one interface sans plus a mono, and nothing in the setting would be recognisable on a second page. The mono-for-record-values rule (gyle 212, ullage 11 pt) is the single idea, and the letterspaced caps in the pills are the only voice; the rest is the face the framework came with.
- colour — desktop screen 1 header: the brick photograph behind the title is darkened so far into the navy that it registers as sensor noise rather than a cellar wall, and the green in the booked-in receipt (desktop screen 4) is the only green anywhere, introduced once at the very end.
- assets — both views, every row: the same barrel outline glyph sits beside counts of firkins and kilderkins alike, so the one column that could carry vessel size carries nothing. And the refusal bar on desktop screen 3 stretches the full container around eight words, leaving roughly 1100px of empty fill beside a message about a field that ends at 30% of the width; the booked-in receipt does the same to "Undo".
- hierarchy — desktop screen 1: the non-interactive status pill is the highest-contrast object on each row while "Book in", the only thing there is to do, is a low-contrast outline button that reads as disabled. The eye lands on the badge and has to hunt for the action.
- production-readiness — desktop screens 1 and 2: at 1280 this is the 390 list stretched, not re-composed. Each row leaves about 1100px of empty slate between the pub name and its pill, and the control strip clusters into the left 45% with the rest empty. I would have to ask a client to ignore how empty it looks on a monitor.

what is working, named:
- The order is the argument and it is stated out loud: "Late first, then due today." The rows obey it, three days late is at the top, and the reason is given in the same breath — "a cask coming back is a duty entry and not just a count."
- The header is the right header for 06:40 in a cellar: "Cask desk · Cellar, Thursday · 06:40 · dray in at 07:15", then Late 2 / Due today 7 / Casks out 15. Nothing decorative, nothing missing.
- The count leads each row and it counts the right thing: "2 firkins · 18 gal", "4 kilderkins · 72 gal". Quantity-of-vessel is the number a cellarman works from, and it is set largest.
- Booking in happens in the row, not behind a modal — Condition, Ullage pt, Book in, three controls inline under the consignment they belong to. That is the correct decision for a desk you stand at.
- The refusal is specific and consequential rather than a validation string: "Say what condition it came back in, it goes on the duty record", with a salmon ring on the field it means.
- The receipt is a receipt: "2 × firkin from Sowerby Arms / gyle 212 · ullage short · ullage 11 pt", with Undo, and an empty state beforehand that explains what will appear there and that it survives a refresh.
- The mobile adaptation is genuinely reworked, not squeezed: the pill drops under the pub name, Condition and Ullage sit side by side, Book in goes full width. At 390 the hierarchy is better than at 1280, which is unusual and to its credit.

what is holding it back, beyond the scores:
- Mobile screen 1: the header runs about 190px tall to carry two lines, with a wide empty band between the title and the counters.
- Both views: the coloured spine stops at the bottom of the row header rather than running the full card, so the "late" marker does not reach the controls it should be colouring.
- Both views: the "0" in Ullage, pt is dim enough to be ambiguous between a placeholder and an entered value, on a field that goes on a duty record.
- The footer prints "Invented brewery, invented cellar, invented week" under the client's name.
