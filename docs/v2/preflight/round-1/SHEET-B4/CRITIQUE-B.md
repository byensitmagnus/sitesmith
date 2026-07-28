---
reviewer: B
reviewer-id: reviewer-b-blind
run-id: preflight-e7a20b478917
label: SHEET-B4
locked: 2026-07-28T12:07:55Z
sha256: 29d309b56eeea870b9496c3154afd2152983e11933d079d04f982c49a226e8a9
brief-sha256: e4437f3adc4e24732b33600e6ec33d9609859edff66a982e355972297491c3e7
rubric-sha256: d9932ed6dc486719d74e6884db7a087bc9563bea07006233790845e2d49cf4f8
sheet-sha256: 4db6a5e239e67f2a2885393c99e81d65b899a9691c758beb924438bac854cbc6
---
primary-criticism: The two-column idea set up by the hero is abandoned the moment you scroll — from the tuning table down to the footer the desktop page is a single narrow column pinned to the right with the left 44% of the viewport left empty, roughly 2,000px of the 2,837px page running against dead ground.
direction: 8
specificity: 8
type: 7
colour: 8
assets: 7
hierarchy: 6
production-readiness: 6

notes:
- hierarchy — desktop, everything below the first screen: the tuning table, "What we will not do" and the enquiry form all sit in the right-hand column while the left column that held the bell section goes empty and stays empty to the footer, so the page reads as a mis-set single column rather than a composition.
- production-readiness — mobile first screen: the bell diagram and its caption consume the whole 390×844 view, pushing the wordmark, the nav and the H1 below the fold, so a visitor arriving on a phone sees a labelled drawing with no company name and no route to enquiries until they scroll.

## What is working

The direction is legible in one sentence and it is not a list of components: this is a measured
drawing plus a published set of before-and-after figures, and the argument of the page is "a
foundry that will not show you the before is asking you to take the after on trust." The
first screen enacts that — a bell section on the left with the five partials called out on
dimension lines, the claim on the right, and immediately under it the cents table with a
"metal off" column in kilograms.

Colour is disciplined. The ground is a warm brown-black rather than a neutral one, which reads
as bronze-adjacent rather than as a dark-mode default, and the gold appears in the mark, the
wordmark, the drawing, the section rules and then exactly one solid element on the entire
2,837px page — the "Send the enquiry" button. That is an accent used where it matters and
nowhere else.

Specificity holds up under the logo-off test better than most. Strip the wordmark and you still
have a bell profile with hum, prime, tierce, quint and nominal on dimension lines; a table
denominated in cents from equal temperament; a "What we will not do" section that refuses
cracked bells and unfaculted work; and enquiry fields asking for bells in the ring, faculty
position and "What is wrong with it". None of that is portable to another trade.

## What is holding it back

**Type (7).** Four registers are in play — a transitional serif in caps for display, letterspaced
serif caps for captions and section heads, a humanist sans for body, and a monospace for the
diagram callouts. Each has a job and the letterspaced serif caption under the plate is the one
setting I would recognise on a second page. But the body sans is the weak link: it is a neutral,
inherited-feeling humanist face doing nothing the serif system is doing, and on mobile the
"Menu" control is set sentence-case in that sans inside a plain bordered box, which is the only
place on either view that breaks the all-caps letterspaced register the rest of the page keeps.

**Assets and craft (7).** The bell section is a real, bespoke asset with one treatment, correctly
scaled at both widths. It is also the only asset on the page — nothing else is drawn, and the
mark beside the wordmark is a plain bell silhouette that could come from any icon set, so it is
a shape rather than a mark. The enquiry form is the other soft spot: the inputs are undecorated
rectangles and the "Faculty position" select carries the browser's own chevron, which sits oddly
against the care taken over the drawing above it.

**Hierarchy and rhythm (6).** Desktop order is right — headline, why, figures, limits, form —
and the H1 is unambiguously first. The rhythm underneath is the problem: five blocks stacked in
one column at one measure with one ground, no change of width, no change of value, and the empty
left half beside them for the whole run. It is not alternating bands, which is to its credit, but
it is also not doing anything.

**Production-readiness (6).** Nothing is broken and nothing overflows at either width. But I
would be apologising for two things before the client scrolled: the dead left half of the desktop
page, and the fact that on a phone the foundry's name does not appear until the second screen.
