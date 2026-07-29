---
reviewer: Q
reviewer-id: reviewer-q-blind
run-id: preflight-r5-8c556c7f8775
label: SHEET-M2
locked: 2026-07-29T13:04:50Z
sha256: cfa358060fad6aef6c817618c1f491faec72262f92db94902a1855e5b492bff9
brief-sha256: 920215fe1c1775f7c1ba051699af0e231e283c0299538bccba9ceb060f195d98
rubric-sha256: d9932ed6dc486719d74e6884db7a087bc9563bea07006233790845e2d49cf4f8
sheet-sha256: 8aba70dd8e55687f624550599ef7a992f14f80ef6af22d2ac013084a88bcec6b
---
primary-criticism: "Book in" is the only action on the page and the reason the cellarman opened it, and on desktop it is the quietest thing in every row — a thin outlined ghost button in the same slate as the panel behind it — sitting a few hundred pixels from a solid orange "DUE BACK TODAY" chip that is only a label and does nothing.
direction: 6
specificity: 6
type: 5
colour: 6
assets: 6
hierarchy: 5
production-readiness: 6

notes:
- direction — the direction is carried entirely by the words. Strip the copy and the frame that is left — slate-navy ground, rounded card per item, 6px status bar down the left edge, pill chip top-right, a select plus a number field plus a button in an inset sub-panel — is the stock dark admin kit, unchanged. The only visual decision that comes from the trade is the small line-drawn cask glyph.
- specificity — following from the above: this design would drop onto any returns or check-in queue without a single change beyond the strings, which is the opposite of what the firkins, kilderkins, gyles and ullage in the copy deserve.
- type — one system sans at three weights plus a Windows mono for the identifiers, and nothing else. There is no display face; the largest type on the page is the row count numeral at roughly 28px, so a 1280px screen has no typographic event on it, and there is no setting anywhere that would be recognisable on a second page.
- colour — red/amber/steel-blue against slate is the default dashboard triad, and the header band carries a photographic wash at such low opacity (desktop and mobile, screen 1) that it reads as JPEG mottling rather than as a ground. The discipline is good — colour appears only for state, and the green only on the booked row — but the palette itself has not come from anywhere.
- assets — desktop screen 1, "gyle 212" sits about 4px above "firkins · 18 gal" on the same row so two secondary labels in one line are on different baselines; the booked-in confirmation reads "gyle 212 · ullage short · ullage 11 pt" with "ullage" twice in one string, and on mobile it breaks after the second "ullage", stranding "11 pt" alone on the next line with the "Undo" link floating on the line above it.
- hierarchy — the intro sentence says "Late first, then due today" instead of the list showing it: there are no group headings, so the boundary between late, due today and due in four days is carried only by a 6px colour bar and a chip, and a cellarman scanning at 06:40 has to read the sentence to know the sort order. On desktop the right half of every row's control panel is empty — roughly 590px of a 1130px panel, five times down the page — so the page is simultaneously half empty horizontally and cramped vertically.
- production-readiness — I would not ship the primary action as a ghost button quieter than the passive status chip beside it, nor the doubled "ullage" in the confirmation line, so there are two things to apologise for before it goes in front of anyone.

what is working, named: the states are complete and honest — a refusal that names the consequence rather than the rule ("Say what condition it came back in, it goes on the duty record"), an empty "Booked in this week" panel that explains what will appear there and that it survives a refresh, and a confirmation row with an Undo. Putting condition and ullage capture inline in the row rather than behind a modal is the right call for a bench task, and the one line of framing — "a cask coming back is a duty entry and not just a count" — earns the extra two fields. Mobile is better composed than desktop: "Book in" goes full width and finally reads as the action, and the row degrades to a sensible three-block stack at 390px. Colour is genuinely reserved for state and used nowhere decoratively.
