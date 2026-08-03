---
title: Mode P (product UI) — full extraction for floor/operate.md
state: S2_REPO_AUTOPSIES
status: complete
source: skills/sitesmith/v2/modes/product-ui.md (189 lines, read in full)
destination: skills/sitesmith-v3/floor/operate.md
ai_generated: "(C)"
---

# Mode P — product UI, extracted against the three-renditions test

The first autopsy extracted fifteen mechanisms from v2.3 and cited nothing under
`v2/modes/`. This file is the correction for one of the three mode files: 189 lines
that hold most of what an operated surface actually owes its user, wrapped in a
twelve-slot template that is the single best explanation of the convergence failure
in `gallery/showcase.json`.

The test applied to every numbered rule and every bolded instruction: **can this be
satisfied three visually unrelated ways?** If yes it is an obligation and belongs in
`floor/operate.md`. If no it is appearance and is named here so it can be left behind.
If it is true of every page regardless of surface it goes to `universalRules` and
belongs in SKILL.md section 8, not in a floor file.

---

## 0. The measurement that frames everything below

`tools/floor-lint.mjs` does not stop this file. Copied verbatim to
`floor/operate.md` with one sentence appended reading "Each rule above can be
satisfied three visually unrelated ways", it passes:

```
  ok   .../floor/operate.md

floor-lint: all clear
EXIT=0
```

Without the appended sentence it fails on the rendition hint alone — **zero purity
problems**. So the lint currently permits, in a floor file:

| Line | Text the lint allows | What it actually is |
| --- | --- | --- |
| 111 | "One accent for the primary action and the current item" | a colour system |
| 70 | "many type sizes, close together, most of them small, so the scale ratio is tight" | a type scale |
| 82 | "full-round is for status dots" | a radius rule |
| 105 | "a skeleton that matches the shape of what is coming" | a loading idiom |
| 142 | "A top bar or a left rail — pick one" | a layout |
| 126 | "The rest of the screen is neutral" | a palette |
| 62-64 | "a 30px row cannot afford an 8px ramp" | a spacing ramp |
| 152 | "Below 960px the rail collapses" | a breakpoint |

`BANNED` matches CSS tokens (`#hex`, `rgb(`, `font-family`, `border-radius`,
`box-shadow`, `font-size:`). Appearance stated in English is invisible to it. And
`RENDITION_HINT` fires on one match anywhere in the file, so a floor file with
twenty-five rules and one rendition paragraph is green. Both are gaps the rebuild
should close; neither is a reason to trust a green lint on this material.

---

## 1. The structural finding: a twelve-slot appearance questionnaire

Line 7: **"Twelve decisions. Each is an answer, not a range."**

Lines 13-24 are the twelve slots. They are byte-identical in heading across all
three mode files:

```
marketing.md   1 Argument shape  2 The first screen  3 Density  4 Radius  5 Imagery
ecommerce.md   6 Motion  7 Colour emphasis  8 Proof  9 Navigation
product-ui.md  10 The primary action  11 Content density  12 Failure modes
```

Five of the twelve slots — Density, Radius, Imagery, Motion, Colour emphasis — are
named after appearance properties. The mode files do not offer a design; they
administer a questionnaire whose questions are appearance questions, and then supply
the answer. And on the slot that decides the look hardest, the answers agree across
modes:

- `product-ui.md:111` — "**One accent** for the primary action and the current item."
- `marketing.md:133` — "**The accent works hard and appears rarely.** It is the primary
  action, the current nav item, and one deliberate accent moment."

Two files that exist to make marketing pages and dashboards different from each other
give the same answer to the colour question. `marketing.md:98` even says out loud
"There is no global radius rule in sitesmith" while eleven lines earlier
installing a global accent rule. `NORDRIG-AB-FORENSICS.md:84-91` records the losing
build landing on "dark ground, one saturated accent, everything else neutral" and
calls it the monoculture risk from `PALETTE-ANALYSIS.md` finding 4. The build did not
invent that. It was told.

**Verdict on the template: reject the twelve slots entirely.** Carry the obligations
across as obligations, in whatever order serves the operator, and never again ship a
file where "what colour" and "what radius" are numbered questions a build is expected
to answer before it has a thesis.

---

## 2. The obligation / appearance split

Every numbered rule and bolded instruction in the file, with line citations.
**O** = obligation, belongs in `floor/operate.md`. **A** = appearance, left behind.
**U** = universal, belongs in SKILL.md section 8. **D** = dead dependency.

| Lines | The text | Verdict | Why |
| --- | --- | --- | --- |
| 7 | "Twelve decisions. Each is an answer, not a range." | A | the questionnaire itself |
| 13-24 | the twelve-slot contents, shared verbatim with the other two modes | A | five slots are appearance properties |
| 30 | "There is no argument. There is a task, and the screen is judged by how fast it completes" | O | framing, but a real judging criterion |
| 32 | "one line: the object, its state, and the one number that decides urgency" | O + A | the three facts are the obligation; "one line" is a layout |
| 33-34 | "the exceptions first. A screen that shows everything equally has sorted nothing" | O | strongest single sentence in the file |
| 35 | "The work surface — the table, the form, the queue" | A | the 1-5 sequence read as a stacking order is a template |
| 36-37 | "What it reconciles to... A grid without a reconciliation makes the user do arithmetic" | O | |
| 38 | "actions where the thing is, not in a toolbar three sections away" | O | |
| 40-42 | multi-step form: one group per step, visible position, error summary before fields, review step with a route back | O | four obligations, all polymorphic |
| 46-47 | "work starts immediately, and the operator can tell within a second whether this screen needs them now" | O | |
| 49 | "A cinematic hero on a dashboard is the clearest sign the wrong governance model was applied" | A | names a look and forbids it; keep as rationale only |
| 50-51 | "What occupies the top is a chrome bar carrying identity, context and state, and under it the status line" | A | prescribes one arrangement — this is the operate-mode equivalent of a hero |
| 52-55 | "rail and pane, master and detail, a single table, a board — a direction-lab choice made from how the work is actually done. A dispatcher... and a clerk... do not get the same screen" | O | the only place in the file that supplies its own renditions |
| 59-60 | "a working unit of the operator's actual job is visible without scrolling — a shift's rows, a round's stops, a consignment's lines" | O | best mechanism in the file |
| 62-65 | the derivation chain: unit forces row height forces type size forces spacing step | O | the *derivation* survives |
| 62-64 | "a 30px row cannot afford an 8px ramp" | A | a spacing ramp in prose; lint does not catch it |
| 67-68 | "The ramp is the same ramp as everywhere else. Density is which end of it is in play, not a second system" | O | one system, density selects a region of it |
| 70-71 | "many type sizes, close together, most of them small, so the scale ratio is tight" | A | a type scale; cannot be satisfied three unrelated ways |
| 71-72 | "Figures that are compared are tabular everywhere — a column that shifts under its own digits is unreadable" | O | obligation is non-shifting comparison; "tabular" is one implementation |
| 76 | "the corner does not eat the content" | A | presupposes corners |
| 76-77, 82-83 | "a shape does not promise an interaction it cannot deliver... A pill in a data grid reads as a control that can be clicked, so it must be one" | O | affordance honesty, fully polymorphic |
| 79-81 | "a generous radius removes the corner of a cell... a tool with taller rows can afford more... may want none at all" | A | a radius budget |
| 82 | "full-round is for status dots" | A | a radius rule |
| 87-90 | "Almost none. Avatars, a brand mark, and thumbnails where identifying an item visually is the task" | O + A | obligation: an image earns its place by being the thing identified. "Almost none" is a quantity, and quantity is a look |
| 91-92 | "No decorative illustration... a small neutral glyph gives the message somewhere to sit" | A | prescribes an empty-state illustration |
| 92 | "even there the words do the work" | U | SKILL.md:143 already has "an empty state is an invitation, not an apology" |
| 94-96 | "Charts are not imagery; they are data... keyboard-reachable, not colour-only, and labelled" | U | true of any page carrying a chart; section 8 does not currently say it |
| 99 | "Effectively none" | A | a motion quantity |
| 99, 103 | "none at all during entry... Nothing animates while the user is typing or counting. This is absolute in this mode" | O | the most transferable rule in the file |
| 101 | "State change feedback only: a row saving, a value committing, a panel opening" | O | motion reports state, nothing else |
| 102 | "`--motion-fast`, under 120ms" | A + D | a token from a contract file that will not exist in v3 |
| 104-105 | "Loading states are required wherever an action takes more than 100ms" | O | a latency threshold is an obligation, not a look |
| 105-106 | "a skeleton that matches the shape of what is coming, not a spinner over the whole screen" | A | one loading idiom, and a well-known generic tell |
| 107 | "No scroll-driven anything" | O | |
| 111 | "One accent for the primary action and the current item" | A | **the top convergence suspect** — see section 1 |
| 112-116 | "Semantic colour is a full, separate group... has not broken the rule three times" | A | exists only to reconcile line 111 with reality |
| 119-120 | "Each state has a word as well as a colour" | U | never colour-alone is true of every page; section 8 lacks it |
| 121 | "Each clears AA against every surface it appears on, in both schemes" | U | section 8 has the numbers, not the every-surface sweep |
| 122-124 | "legible on a dark chrome bar is often illegible as text on paper. Declare both" | O + A | obligation: a signal is verified in every context it renders in. "dark chrome bar", "saturated fill", "darkened text" are appearance |
| 126 | "The rest of the screen is neutral" | A | a palette |
| 126-127 | "Colour in this mode is a scarce signal, and a decorative use of it costs a real one" | O | reservation is polymorphic; see the inversion in mechanism 16 |
| 133 | "What was saved, and when" | O | |
| 134 | "What is pending, and what will happen if the user leaves" | O | |
| 135 | "What failed, why, and what to do" | O | |
| 136-138 | "Whether the number on screen is current, and as of when" | O | freshness; section 8 has no equivalent |
| 142 | "Two levels at most... keep it on every screen" | O | depth budget + invariance |
| 142 | "A top bar or a left rail — pick one" | A | two options is not three unrelated ways; excludes palette, tabs, spatial |
| 144-145 | rail when many destinations, top bar when few | A | a decision rule about a layout |
| 147-150 | "Keyboard access to navigation is required... the shortcut should be visible somewhere — a shortcut nobody can see is a shortcut nobody uses" | O | discoverability half is rare and valuable |
| 152 | "Below 960px the rail collapses; it does not disappear" | O + A | obligation: navigation changes form and never vanishes. 960 and "rail" are appearance |
| 156 | "Row actions on the row, form actions at the end of the form" | O | co-location, restates line 38 |
| 157 | "bulk actions in a bar that appears above the data when a selection exists — not floating over it" | A | one placement |
| 159-161 | "states its consequence and its blockers... A disabled control says why, or is not disabled" | O | excellent; section 8 only requires the disabled state to exist |
| 163-164 | "Destructive actions are separated from constructive ones by position, not only by colour, and they confirm" | O | already written in non-appearance terms |
| 168-170 | "Show every row, every column that matters, every specification... hiding it to keep the screen calm is a disservice" | O | completeness |
| 168 | "High," | A | density as a register is a look; completeness is the obligation |
| 172-173 | "Prose is minimal... Everything else is data and labels" | A | a word budget; SKILL.md:135-138 owns copy register |
| 175-176 | "filtering and sorting the user controls, not a curated subset chosen by the designer" | O | reduction is the operator's, and reversible |
| 180-182 | "Marketing governance applied to a working screen. A hero, generous spacing, an illustration, six rows of data" | A | diagnostic restating 2/3/5 in look terms |
| 183-184 | "Empty, error, **partial** and loading are the states this mode hits on day one" | O | *partial* is the one state section 8 does not list |
| 185 | "`blocks/feedback/empty-state` exists because of exactly this" | D | path will not exist in v3 |
| 186-189 | "A scroller that no key reaches, a grid that cannot be traversed, a shortcut documented nowhere" | O | traversal, not focus visibility; section 8 covers only the latter |

---

## 3. The obligations, with three renditions each

Written the way `floor/operate.md` needs them: no appearance value, and each shown
satisfied **three visually unrelated ways**. These are real alternatives, not three
phrasings of one layout.

**1. The unit of work sets the density** (59-65, 67-68)
A working unit of the operator's actual job fits without scrolling, and every
dimension downstream is a consequence of that unit rather than a preference.
*(a)* a consignment of twelve lines rendered as twelve rows in one table screen;
*(b)* a dispatch round as a horizontal time ruler, one shift = one band, no rows at
all; *(c)* one record per screen, full bleed, paged by key, where the unit is the
record and the whole viewport is spent on it.

**2. Exceptions are sorted ahead of inventory** (33-34)
*(a)* a table default-sorted by exception with a needs-action column first; *(b)* a
triage queue that renders only exceptions and reduces the compliant remainder to a
single count behind a link; *(c)* a plan or map where only exception objects carry a
marker and the field is otherwise empty.

**3. A listing reconciles** (36-37)
The screen answers what the rows add up to, so the operator never does arithmetic.
*(a)* a sticky total row pinned to the foot of a table; *(b)* a headline figure
printed above the list that the list sums to; *(c)* a remaining-count meter beside
the filter that moves as the filter changes.

**4. The action is at the object** (38, 156)
*(a)* an inline control in the row it acts on; *(b)* a detail pane whose controls sit
with the record and no toolbar exists; *(c)* direct manipulation — the object is
dragged to a lane and there is no button anywhere.

**5. A multi-step form is navigable, summarised and reversible** (40-42)
One question group per step, position in the sequence is visible, errors are
summarised before the fields, and a review step shows every answer with a route back
to each. *(a)* a numbered stepper across the top with an error block above the
fieldset; *(b)* a single scrolling sheet where completed groups collapse to one
summary line each and the position is "3 of 7" in running text; *(c)* a
terminal-style prompt sequence where the transcript above is the review and any
earlier answer is re-editable in place.

**6. Orientation before work** (32, 46-47)
Within a second the operator knows the object, its state, and the number that decides
whether to act now. *(a)* a bar carrying identity and state with the deciding figure
inline; *(b)* the deciding figure set as the largest thing on the screen with the
object name subordinate to it; *(c)* orientation carried entirely by the list itself
— the first row is the exception and its state word is the first thing read.

**7. The arrangement comes from the shape of the work** (52-55)
A dispatcher watching six things and a clerk working one record do not get the same
screen, and the arrangement is argued from observed work rather than picked from a
menu. *(a)* rail and pane; *(b)* a single wide table with no chrome; *(c)* a board
where position encodes state. The file supplies these itself, which is why this rule
is the model for the rest.

**8. Compared figures do not shift** (71-72)
A column of numbers can be scanned without the digits moving under each other.
*(a)* proportional face with tabular figures enabled; *(b)* figures right-aligned to
a fixed decimal position; *(c)* magnitude carried by a bar with the value in a fixed
slot, so alignment is structural rather than typographic.

**9. A shape promises only what it delivers** (76-77, 82-83)
Anything that reads as operable is operable. *(a)* status as a plain word with no
control geometry, actions as explicit buttons; *(b)* the entire row operable, so
every shape inside it honestly is; *(c)* status as a gutter mark or leading edge that
carries no button geometry at all.

**10. An image is present because the image is the thing being judged** (87-90)
*(a)* a text-only ledger with no images; *(b)* an asset manager where the thumbnail
*is* the row and nothing else identifies the file; *(c)* a floor-plan console whose
only image is the plan, full bleed, because the plan is the data.

**11. Nothing moves while the operator is entering or counting** (99, 103)
Absolute. *(a)* a form where the only change during typing is the character
appearing; *(b)* a counting screen where the running total updates as a value swap
with no transition; *(c)* a console with no animation in the product at all, where
the rule is satisfied by construction.

**12. Motion reports state change and nothing else** (101, 107)
*(a)* a row that settles on commit; *(b)* a status word that swaps and nothing else
in the frame reacts; *(c)* no motion, and a written timestamp appears instead —
"Saved 12:04" — which reports the same state change with zero movement.

**13. Latency above the perception threshold is narrated, specifically** (104-105)
*(a)* a placeholder shaped like the thing arriving; *(b)* the acting row locked and
dimmed with a local indicator, the rest of the screen live; *(c)* a status line that
counts — "loading 340 of 1,200" — while the table fills progressively and nothing is
faked.

**14. A signal is verified in every context it renders in** (122-124)
Not once, on one surface, in one scheme. *(a)* two declared roles per state, one for
fill and one for text, each measured where it appears; *(b)* one value plus a rule
that states are only ever filled and never set as text, so the second context does
not arise; *(c)* states carried without hue — weight, gutter mark, position — so the
verification is of contrast against the ground and nothing else.

**15. A colour that carries meaning is not spent on decoration** (126-127)
*(a)* a near-monochrome field where three signal hues are the only colour present;
*(b)* a colour-saturated field where signals are carried by an unmistakable non-hue
device — a bracket, a rule, a change of case — because hue is already busy;
*(c)* an inverted field where everything is saturated and the signal is the only
*desaturated* thing. Note what (b) and (c) do that line 111 forbids: they let the
screen be colourful. That is the difference between an obligation and a house style.

**16. State is legible over time** (133-136)
What was saved and when; what is pending and what happens if the operator leaves;
what failed, why, and what to do; whether the number is current and as of when.
*(a)* a freshness caption under each figure and a pending badge in the chrome;
*(b)* an event log beside the work surface where saved, pending and failed are
entries with times, so the screen has no state indicators at all; *(c)* the listing
ordered by ingest time so staleness is positional, with failures held at the top
until acknowledged.

**17. Navigation is shallow, invariant, and never vanishes** (142, 152)
Two levels at most, in the same place on every screen, and at the narrowest width it
changes form rather than disappearing. *(a)* a rail that becomes an icon strip;
*(b)* a top bar that becomes a labelled select; *(c)* a command palette that is the
navigation at every width and therefore never needs to collapse.

**18. Keyboard reach is complete and discoverable** (147-150, 186-189)
Every destination, every scrollable region and every grid is reachable by key, and
the key is visible somewhere. *(a)* a palette on a documented key with the key
printed in the chrome; *(b)* rail items carrying their own access key as visible
text; *(c)* a roving-tabindex grid with an on-screen key legend, so traversal is
learnable from the screen.

**19. A blocked control says why** (159-161)
A disabled control says why, or is not disabled. *(a)* the blocker in the label —
"Book in (2 lines unresolved)"; *(b)* the control enabled, and activating it produces
an error summary that focuses the first blocker; *(c)* an adjacent checklist of
blockers that empties as they clear, and the control enables when it is empty.

**20. Destructive is separated by position and confirmed** (163-164)
*(a)* behind an overflow, requiring a second deliberate interaction; *(b)* on the
opposite edge with real distance from the constructive control; *(c)* on a separate
step entirely, with an undo window in place of a dialog.

**21. Nothing the operator needs is withheld, and reduction is theirs** (168-170,
175-176)
No editorial subset chosen by the designer; where there is too much, the operator
filters and sorts, and can get back. *(a)* a wide table scrolling horizontally inside
its own container with a column chooser and saved views; *(b)* master list plus a
detail pane that shows every field of one record; *(c)* a query bar where the
operator states the subset and the statement is visible and editable.

**22. Partial is a state** (183-184)
Empty, error, loading and disabled are in section 8. *Partial* is not, and it is the
state an operated surface reaches first: a bulk action where some rows succeeded.
*(a)* a result summary naming the count that succeeded and the count that did not,
with the failures still listed; *(b)* per-row outcome marks left in place after the
action so the surface itself is the report; *(c)* a queue where failed items return
to the queue and the completed ones leave, so partial is expressed by what remains.

---

## 4. What does not survive, and how much

**By line mass:** of roughly 162 content lines, about 55 are appearance, restatement
or dead dependency. That is **34% appearance**. The remaining two-thirds is real
obligation and it is good — better, per obligation, than anything in
`sitesmith-current/GOOD-PATTERNS.md`.

**By decision weight it is far worse than 34%.** The appearance is not scattered; it
occupies the slots that decide what the screen looks like:

- slot 2 (50-51) fixes the top of every screen,
- slot 3 (70-71) fixes the typographic register,
- slot 4 (74-83) is appearance almost end to end,
- slot 7 (111) fixes the colour system,
- slot 9 (142) fixes the navigation to one of two shapes,
- slot 6 (105-106) fixes the loading idiom.

A build that follows this file has had ground, accent, type register, corner,
navigation shape, top-of-screen arrangement and loading treatment decided for it
before it knows what the tool is for. **Every visual decision in the mode is
pre-made.** That is why three unrelated briefs produced one look while each passed
its own review, and it is a sharper account of the failure than "the craft floor
converged" in `NORDRIG-AB-FORENSICS.md:145-149`: the floor did not converge by
accident, it shipped the answers.

**The clean split:** twenty-two obligations survive and belong in
`floor/operate.md`; three rules are universal and belong in SKILL.md section 8;
twenty-five citations are appearance and are left behind; two are dead paths.

---

## 5. Was deleting the marketing mode file wrong?

No. The evidence is inside this file.

`product-ui.md:180-182` names failure mode one as "**marketing governance applied to
a working screen**" — a hero, generous spacing, an illustration, six rows of data.
Read carefully, that says marketing governance *is the absence of these obligations*.
It is not a competing set of duties; it is what you get when a page owes its visitor
nothing except sections 1 to 8. Which is precisely how `SKILL.md:193` routes it:
"Deciding whether to care, or reading → nothing. Sections 1 to 8 are the whole
instruction."

Checking `marketing.md` directly for obligations that would be lost: its slot 7
(133-135) is the same one-accent appearance rule, its slot 4 (88-98) is a radius
budget, its slot 3 (84-86) contributes one genuine obligation — body measure roughly
55 to 75 characters — which is true of every page with prose and therefore belongs in
section 8, not in a marketing floor. There is nothing in it that only a marketing
page owes.

**Deleting it was right, and it should not come back.** The one salvage is the
measure rule, which section 8 currently lacks.

---

## 6. Notes for whoever writes `floor/operate.md`

1. Do not carry the twelve headings. Order the obligations by when the operator meets
   them: orientation, then the work surface, then acting, then state over time.
2. `--motion-fast` (102) and `blocks/feedback/empty-state` (185) are dead paths in v3.
3. 120ms (102) and 100ms (104) are latency thresholds, not looks, but neither is in
   the lint's `ALLOWED_NUMBERS`. Either extend that list or state the threshold in
   words. 960px (152) and the 30px/8px pair (62-64) must not be carried at all.
4. `RENDITION_HINT` fires once per file. Green does not mean every rule was shown
   three ways. Write the renditions per rule anyway — they are section 3 above.
5. The lint cannot see appearance written in English. Line 111 would pass it today.
   Something must read the prose, or the same failure ships again with a green tick.
