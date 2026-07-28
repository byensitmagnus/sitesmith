---
reviewer: B
reviewer-id: reviewer-b-blind
run-id: preflight-e7a20b478917
label: SHEET-K7
locked: 2026-07-28T12:07:55Z
sha256: d6b0e1690f535cd80f20f63a4b0b3ba764a455e5113e28d73e5790c46f54fb74
brief-sha256: e06aafaf3f4a68092d5ab23aa3fb0c9513174cdabd803b865ef8c1005fad9d1e
rubric-sha256: d9932ed6dc486719d74e6884db7a087bc9563bea07006233790845e2d49cf4f8
sheet-sha256: 4db6a5e239e67f2a2885393c99e81d65b899a9691c758beb924438bac854cbc6
---
primary-criticism: On a page built to surface overdue casks and get them booked back in, the loudest thing in every row is a solid white "DUE TODAY" pill and the quietest is the "Book in" button — the overdue state is a mid-value coral that loses the contrast fight to the state that is not yet a problem, and the primary action is the faintest control on the screen.
direction: 6
specificity: 3
type: 6
colour: 5
assets: 2
hierarchy: 3
production-readiness: 2

notes:
- direction — desktop first screen: the one real idea, drawing each consignment as a cask sized to its measure with a coloured state rail down the left of the row, survives only inside the leftmost column; everything around it is stock dark-dashboard chrome, so the visual argument does not extend past that one element.
- specificity — desktop, whole page: with the copy removed this is a generic dark ops table (filter chips, status pills, left state rails, mono metadata, right-aligned counts), and the only subject-bearing asset is a plain line-drawn barrel that would carry no less meaning as a crate or a pallet.
- type — desktop, table body: the sans-plus-monospace pairing with oversized numerals is the default dashboard recipe applied evenly, and there is nothing in the setting that would be recognisable on a second page.
- colour — desktop, state pills: the value scale is inverted, pure white at maximum contrast is spent on "DUE TODAY" while "OVERDUE" gets a mid-value coral, so the state that needs action reads quieter than the state that does not.
- assets — mobile, every table row: the cask drawing is overprinted by three separate text elements, "Gyle 214 · kilderkin" is struck through by the barrel's top arc, the count numeral sits inside the barrel with a stave line running through it, "Today" / "3 d late" is crossed by the lower stave, the status pill overlaps the barrel's bottom edge, and the "Book in" label runs outside its own border box.
- hierarchy — desktop first screen: the biggest object in each row is the cask outline, which encodes only firkin-versus-kilderkin and repeats information already given as text beside the pub name, so the largest element carries the least information and only four rows fit in 900px.
- production-readiness — mobile, table rows: the desktop grid does not reflow, the columns stack on top of each other and collide, and the result is illegible at 390px; this cannot go in front of a cellarman tomorrow.

## What is working

There is a real idea here and it deserves saying plainly: each consignment is drawn as a cask
whose size reflects the measure, and each row carries a coloured rail down its left edge encoding
state — muted blue for due, coral for overdue, amber for on trade. That rail system is consistent
across all four rows and it is the one piece of the page that would still work if you squinted.
The copy is genuinely of the trade: gyle numbers, firkin and kilderkin, ullage, "dray in at 07:15",
"3 d late". The monospace is correctly reserved for codes and durations and the sans for names,
which is the right division of labour.

## What is wrong

**The contrast hierarchy contradicts the task.** The brief for this page is that a cellarman
needs to see what is overdue. On the desktop first screen the eye goes, in order, to two solid
white pills reading "DUE TODAY", then to an amber "ON TRADE", and only then to the coral
"OVERDUE" — because white on dark navy is the highest contrast pair available and it has been
assigned to the least urgent state. Meanwhile "Book in", the action the page exists to produce,
is a dark button with a thin border sitting immediately beside the pill that outshouts it. The
two things the visitor came for are the two quietest elements in the row.

**Mobile is broken, not merely compromised.** At 390px the row's columns do not reflow, they
stack. In the first consignment the barrel outline is drawn over the top of "Gyle 214 · kilderkin"
so the metadata line is cut through by the barrel's top arc; the numeral 4 sits inside the barrel
with a grey stave running across it; "Today" is crossed by the lower stave; the white "DUE TODAY"
pill overlaps the barrel's bottom-right corner. The second row repeats it exactly with "Gyle 212 ·
firkin" and "3 d late". Separately, the "Book in" control is a small square bordered box whose
label overflows past its own right edge in every row. This is not a fine-tuning note — the table
is unreadable on a phone, which is where a cellarman would use it.

**The page runs out before it finishes.** Below the four consignments the desktop page gives its
remaining third to "Booked in this week": six column heads — WHEN, SIZE, WHERE, CASKS, CONDITION,
ULLAGE — and one line of grey monospace reading "Nothing booked in yet this week." A table with
headers and no rows is scaffolding, and it is currently the second-largest region on the page.

**Take the copy off and there is nothing left that is about casks.** Dark navy panel, filter
chips with the active one in amber, left state rails, status pills, mono metadata, big numerals,
an outlined secondary button per row. Swap the barrel line-drawing for a pallet and this is a
freight dashboard; swap it for a hard drive and it is an asset tracker. The rubric's cap applies.
