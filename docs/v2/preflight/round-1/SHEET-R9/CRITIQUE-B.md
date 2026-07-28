---
reviewer: B
reviewer-id: reviewer-b-blind
run-id: preflight-e7a20b478917
label: SHEET-R9
locked: 2026-07-28T12:07:55Z
sha256: 4df95882c9dafcb29dcc65feaa4fa28ae43f509d58c09e575602ae46d6630c07
brief-sha256: 8ba8d26a4670f9552b75837f13b6701635156dd9b7a6efd80f97c45f287c29f9
rubric-sha256: d9932ed6dc486719d74e6884db7a087bc9563bea07006233790845e2d49cf4f8
sheet-sha256: 4db6a5e239e67f2a2885393c99e81d65b899a9691c758beb924438bac854cbc6
---
primary-criticism: The page announces "STOCK, BY CONSTRUCTION — 5 OF 61 LINES", shows five, and then stops — there is no filter, no sort, no pagination and no "see the rest" anywhere on either view, so a rigger who came to compare constructions is shown eight per cent of the catalogue and given no way to reach the other fifty-six.
direction: 8
specificity: 8
type: 7
colour: 9
assets: 6
hierarchy: 7
production-readiness: 6

notes:
- type — desktop first screen, the two intro blocks: the left paragraph is set in the sans and the right in the monospace at almost the same size and leading, so they read as a mismatch rather than a pairing, and with no display size anywhere the whole page lives inside roughly 11–19px.
- assets — mobile header and mobile last stock row: the strapline "ROPE AND CORDAGE · CUT TO THE METRE · GRIMSBY" is clipped at the left viewport edge with the R cut and "£0.00" pressed flush against the right edge, and in the out-of-stock row "Next coil lands 12 August" wraps into five one-word lines beside an over-tall "Out of stock" box.
- production-readiness — desktop, the stock table: I would have to explain the 5-of-61 dead end and the clipped mobile header bar before showing this to the merchant, and the "Your order" ticket that receives every cut is a small dashed empty box below the fold.

## What is working

This is the most convincing of the three as a piece of design thinking, and the reason is that
every device on the page comes from the bench rather than from a component library.

The ground is a warm oatmeal paper rather than an off-white, and it carries a black-ink drawing
system with one stroke weight throughout. The cross-sections are the substance of the page: three
circles for three-strand, a concentric jacket-over-core for double braid, a bundled core inside a
sheath for kernmantle, an eight-lobe rosette for eight-plait. Each one is genuinely different and
each one encodes the construction it names, so the drawing is the comparison, not decoration of
it. Around each drawing sits a dashed circle standing for the overall diameter, which ties back to
the "Ø 12 mm" column — a real idea, quietly executed.

The bench rule is the best single element on the sheet: a full-width ruler graduated 0 to 100 with
a proper tick hierarchy, captioned "The bench rule. Every price below is per one of these, cut
while you wait." It does three jobs at once — it establishes the unit, it separates masthead from
catalogue, and it is the only place on the page where the metre is made physical.

Colour scores highest of anything I looked at in this set. There is exactly one hue on the page
beyond ink and paper, and it appears exactly once: the red on "They are not safe working loads."
An accent spent on the only sentence that could get somebody hurt, and spent nowhere else, is
accent discipline of a kind you almost never see. The "Out of stock" tag stays in ink and the
out-of-stock row's price and figures stay at full weight rather than being greyed out, which is
the right call for a merchant — you still want to compare a line you cannot buy today.

The mark is a mark: three interlocking circles read as a three-strand cross-section, which is the
same drawing language as the catalogue below it. Mobile reflow is handled properly, the row
becoming drawing-left with a labelled spec list right and the action beneath.

## What is holding it back

**The catalogue is a dead end.** Five lines of sixty-one, with the count stated in the section
head so the visitor knows exactly what is missing, and no control anywhere that would reach the
rest. There is no filter by diameter, no sort by breaking load, no next page. For a page whose
stated job is comparing constructions, that is the largest hole in it and it is a hole the page
itself points at.

**The order path is faint at both ends.** "Cut a length" is a hairline outlined box at the far
right of each row, no heavier than the column rules around it and no more prominent than the
price beside it, and the "Your order" panel that is supposed to receive the cut is a small dashed
rectangle low on the page holding placeholder text. Nothing on the first screen tells you the
ticket exists except a mono "ORDER 0 CUTS £0.00" in the masthead.

**Craft slips at the edges.** On mobile the header bar is the one region that does not respect the
page margin — the strapline is clipped at the left edge and the running total touches the right —
and the out-of-stock row breaks "Next coil lands 12 August" into five stacked single words. On
desktop there is roughly 380px of empty ground between the end of each rope's description and the
start of its figures, so relating a name to its numbers is a long horizontal jump across nothing.

**Type is consistent but has no top note.** The monospace-for-every-figure decision is right and
is applied without exception, but nothing on the page is set larger than about 19px, and the two
opening paragraphs sit side by side in two different faces at the same size, which reads as
indecision rather than as a pairing. The page has no first thing to read, only a first thing to
look at.
