---
reviewer: G
reviewer-id: reviewer-g-blind
run-id: preflight-r3-68086aece618
label: SHEET-R9
locked: 2026-07-29T10:31:44Z
sha256: 9e3c6080ca05e62f032772af4f24f2621343545d74f82efa2022bc11c493f32a
brief-sha256: 882cea58700fc5fcb9c2feb28bb11f0e05a4a87d182e7e1e2779ef803b7365a6
rubric-sha256: d9932ed6dc486719d74e6884db7a087bc9563bea07006233790845e2d49cf4f8
sheet-sha256: 0152b16085a509eeee44fd41c03be6717f1a9e9096a4b96d78b537c5221057b2
---
primary-criticism: Booking one consignment back in prints it twice, in two adjacent boxes with the same green rule and the same fill — "2 x firkin from Sowerby Arms / gyle 212 · ullage short · ullage 11 pt" and then "2 x firkin back in from Sowerby Arms, ullage short, ullage 11 pt." — so the one screen whose job is an accurate count appears to show two entries for one book-in.
direction: 6
specificity: 5
type: 6
colour: 5
assets: 5
hierarchy: 6
production-readiness: 6

notes:
- direction — it is the operations-dashboard default rendered competently, and these are the parts that make it so: dark slate cards on a slightly darker ground, a coloured severity stripe down the left edge of each card, a solid status pill under the title, three stat tiles ranged right in the header, one white primary button per row. The subject-derived parts are the drawn cask glyph and the numeral-plus-unit lockup, and they are carried by the copy around them rather than by the chrome (desktop and mobile, screen 1).
- specificity — take the wordmark and the words off and the chrome would serve a returns desk, a parts queue or a delivery board without a single change; only the cask glyph and the "2 FIRKINS · 18 GAL" lockup survive the removal, where B4's photography and K7's brass-on-black would still name their trades (desktop, screen 1).
- colour — the four hues are not disjoint in meaning: amber is "due back today" and also the focus ring on an errored field, red is "late" and also the error sentence, and green is "booked in" and also the button on the row that has just refused to book. In the refused frame one card carries a red stripe, a red pill, an amber ring, a maroon fill, an orange-red message and a bright green button at once (desktop and mobile, "a book-in refused").
- assets — the only photograph, a brick cellar wall behind the header band, is darkened so far that it takes a brightness boost to see at all and contributes nothing at 100 % (desktop, screen 1); the "N KILDERKINS · 72 GAL" unit string wraps on two of the four rows so "GAL" hangs on its own line under the numeral and the lockup goes ragged row to row (desktop, screens 1 and 2); and on mobile the booked record's detail line wraps so "11 pt" drops below while "Undo" stays ranged right on the line above it ("the consignment booked back in").
- hierarchy — every desktop row has roughly 354 px of nothing between the status pill and the CONDITION label, about 29 % of the row width, so each row reads as two clusters at opposite ends rather than one line of information; the header band repeats the shape, wordmark hard left, counts hard right, some 700 px of empty texture between (desktop, screen 1). On mobile the validation message is placed after the submit button rather than under the field it refers to, so the sequence is errored select, green button, red sentence ("a book-in refused").
- production-readiness — the duplicated booked-in entry and the green button on a refused row are the two things I would have to explain before anyone used this; the rest of the screen I would ship as it stands.

What is right. The page fits the job: one screen, sorted late first, and every row can be closed where it sits without navigating away. The state changes are honest — booking Sowerby Arms in removes its row, takes LATE from 2 to 0 and CASKS OUT from 15 to 13, and leaves an Undo. The severity ramp reads correctly at a squint on both widths, and the mobile stack is clean, with no overflow and no clipped headings anywhere across five screens. The cask glyph is a genuine drawn mark, sized to the count beside it, used identically in every row and at both widths.
