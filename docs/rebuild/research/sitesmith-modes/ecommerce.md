---
title: Mode E (e-commerce) — full extraction against the three-renditions test
state: S2_REPO_AUTOPSIES
source: skills/sitesmith/v2/modes/ecommerce.md (183 lines)
destination: skills/sitesmith-v3/floor/buy.md
lint: tools/floor-lint.mjs
ai_generated: "(C)"
---

# Mode E — what survives, what was appearance wearing an obligation's clothes

The first autopsy read fifteen mechanisms out of this repository and cited nothing from
`v2/modes/`. This file is the correction for one of the three mode files — the one the
nordrig A/B identified as SiteSmith's genuine win. `NORDRIG-AB-FORENSICS.md:130-134`:
build B lost on creative direction and still had the sounder commerce behaviour, and
every rule in B's list came from here.

The test applied to every numbered rule and every instruction: **can this be satisfied
three visually unrelated ways?** If yes it is an obligation and belongs in `floor/buy.md`.
If no it is appearance, it gets a line number and it gets left behind.

---

## Verdict first

**About 30% of the substantive body is pure appearance and must not cross into
`floor/buy.md`. A further ~15% states a real obligation in exactly one visual form and
has to be re-stated before it can be used. Roughly 55% survives close to intact — and
that 55% is the strongest commerce material in the repository.**

Substantive body is lines 28–183 (156 lines; lines 1–27 are title, blurb and a table of
contents). Section-level accounting:

| Section | Lines | Survives | Note |
| --- | --- | --- | --- |
| 1 Argument shape | 28–42 | ~75% | fixed 1–7 sequence and "a grid" are template, the information set is not |
| 2 The first screen | 44–58 | ~85% | best-argued section in the file; it names its own free axis |
| 3 Density | 60–73 | ~30% | spacing ramp, type rank and scale ratio are all appearance |
| 4 Radius | 75–87 | ~10% | **near-total loss** |
| 5 Imagery | 89–100 | ~85% | only the named aspect ratios fall |
| 6 Motion | 102–112 | ~85% | only the two-animation allowlist and the token name fall |
| 7 Colour emphasis | 114–124 | ~55% | the accent rule is appearance; what it protects is not |
| 8 Proof | 126–139 | ~95% | **strongest section in the file** |
| 9 Navigation | 141–152 | ~45% | mega-menu threshold and breadcrumbs are single renditions |
| 10 The primary action | 154–164 | ~60% | sticky panel + mobile bottom bar is one layout, and it is B's signature |
| 11 Content density | 166–172 | ~80% | line 171 is the best rule in the file |
| 12 Failure modes | 174–183 | ~95% | tests, not looks |

### The structural finding, which matters more than the percentage

Sections 3 and 4 (lines 60–87, 28 lines, 18% of the body) are near-total losses, and
they are not losses because someone wrote them badly. They are losses **because the mode
template required them**. `modes/README.md:29-34` obliges every mode file to answer
twelve fixed topics in order, and four of those twelve — Density (3), Radius (4), Colour
emphasis (7), and half of Imagery (5) — are appearance slots by construction. A file that
must answer "Radius" will answer it. Three sites built from three mode files that each
answered the same four appearance slots converged, which is what
`gallery/showcase.json` records as `portfolioDiversity: fail`.

So the convergence has a mechanical cause and it is not "the rules were bad". It is that
**the schema had appearance slots in it.** `floor/buy.md` must not inherit the twelve-topic
shape. It should be organised by what the buyer is doing — see it, price it, trust it,
commit to it, get back out — and it should have no slot that can only be filled with a
value.

The file half-knows this. Lines 53–57 and 80–82 explicitly refuse to set the value and
say where it comes from instead. That refusal is itself extractable and is recorded below
as `buy-name-the-free-axis`.

### On deleting the marketing mode file

**The deletion was right. Nothing in this file argues against it.**

Two lines reference mode M. Line 58 — "Home page: this is mode M. Route it there and keep
the same contract" — resolves under `SKILL.md:191-196` to "open nothing, sections 1 to 8
are the whole instruction", which is a coherent destination, not a dangling pointer. Line
172 — "a benefit with no corresponding spec is marketing that wandered into the wrong
mode" — is a **local** test: it is decidable on the product page alone, without a
marketing file existing to define the other side. It survives the deletion untouched.

One required edit follows from the deletion. Lines 49–52 argue the no-hero rule by
contrast with mode M ("a hero above a product is a screen of scrolling inserted between
wanting it and buying it"). With no mode M file, `floor/buy.md` must state that outcome on
its own terms. Line 46–47 already does exactly that, so the fix is to keep 46–47 and drop
the 49–52 rationale, not to rescue marketing.md.

---

## The split, rule by rule

Obligations are extracted as mechanisms below. Appearance rules are listed here with line
numbers and are not extracted.

| Line(s) | The instruction as written | Verdict | Why |
| --- | --- | --- | --- |
| 30–39 | Product page in this order: gallery/identity → panel → benefits → specifics → proof → logistics → related | **Split** | The *information set* is an obligation (a buyer cannot decide without all seven). The *fixed sequence* is a layout template: a stepped configurator, a tabular parts catalogue and a single full-bleed object all satisfy the set in three different orders. |
| 33 | "Sticky on desktop" | **Appearance** | One layout for the panel. |
| 35–36 | "Complete, not curated: an omitted spec reads as a hidden one" | **Obligation** | → `buy-specification-is-complete` |
| 37 | Reviews, with the bad ones present | **Obligation** | → `buy-proof-shows-its-shape` |
| 38 | Logistics stated before checkout, not inside it | **Obligation** | → `buy-total-commitment-legible` |
| 39 | Related: alternatives if wrong, complements if right, "say which" | **Obligation** | → `buy-related-states-the-relation` |
| 41 | "a grid" | **Appearance** | A grid is one rendition. A table, a map and a compare-view are three others. |
| 41 | Filters that reflect how the buyer thinks, and a count | **Obligation** | → `buy-result-set-is-navigable` |
| 42 | "Sort is secondary to filter" | **Appearance** | A prominence ranking, and not even generally true — a nine-item catalogue sorted by price has no filters worth building. |
| 42 | An empty result offers the nearest thing that exists | **Obligation** | → `buy-result-set-is-navigable` |
| 46–47 | The thing and the way to buy it are both on the first screen; on a listing the products start on the first screen | **Obligation** | → `buy-decision-and-control-together`. Stated as an outcome by the file's own choice, which is why it survives. |
| 49–52 | Rationale by contrast with a marketing hero; "a category band above roughly 200px costs the first row" | **Appearance** | 200px is a pinned dimension, not an accessibility minimum. Drop with the rationale (see deletion note above). |
| 53–57 | The arrangement is a direction-lab choice and is the axis the three comps must differ on | **Obligation (meta)** | → `buy-name-the-free-axis` |
| 58 | Home page routes to mode M | **Routing** | Already carried by `SKILL.md:191-196`. Not a floor rule. |
| 62–63 | A listing reads as one rhythm; the price is found without searching | **Obligation** | → `buy-comparison-is-a-glance`, `buy-price-is-found-not-hunted` |
| 66–67 | "the card interior sits at the tight end of the contract's ramp while the gaps between sections sit at the open end" | **Appearance** | A spacing signature. Two sites obeying it have the same spatial rhythm. |
| 67–68 | "Price is the second-largest type on the page after the name" | **Appearance** | A type-scale rank. In a stepped configurator the running total is the largest thing on screen; in a parts table price is the same size as everything else and legible by column. |
| 68–69, 71 | Prices are tabular | **Split** | Obligation: figures the buyer compares are comparable at a glance. "Tabular figures" is one rendition of it; decimal-aligned proportional figures and a one-price-per-screen layout are two others. |
| 71–73 | "the scale ratio is at the tight end of whatever the contract sets — a 1.5 ratio in a listing produces sizes with nothing between them" | **Appearance** | Explicitly a type scale. |
| 77–78 | "the product is the shape the eye reads, and nothing on the card competes with it" | **Obligation (weak)** | → `buy-the-object-is-the-subject`. Survives, but only just: it is one restatement away from being a card-chrome prescription. |
| 80–82 | Commerce lands tighter than marketing, "but the value comes from the direction and the photography, not from this file" | **Obligation (meta)** | → `buy-name-the-free-axis`. The best sentence in section 4 is the one where it declines to answer. |
| 84–86 | "full-round is for badges and stock dots only. A pill-shaped 'Add to basket' reads as a marketing button" | **Appearance** | A radius prescription on the primary action. `floor-lint` would not catch the word "pill", which makes this exactly the class of rule that got through last time. |
| 90 | The images are the product; imagery cannot be substituted here | **Obligation** | → `buy-the-object-is-the-subject` |
| 92 | Multiple angles; one lighting setup and one background across the catalogue | **Obligation** | → `buy-image-set-is-consistent`. Consistency of treatment is satisfiable as white-ground cutouts, as everything-on-the-same-bench, or as flatbed scans — three unrelated looks. |
| 93 | "square in the grid, 4:3 or 3:2 on the page" | **Appearance** | Named ratios. The *consistency per context* is the obligation; the ratios are a choice. |
| 94 | Alt text describes what the image shows | **Universal** | Already carried, `SKILL.md:172`. |
| 95 | Zoom or detail views where the material matters | **Obligation** | → `buy-image-set-is-consistent` |
| 96 | Scale is stated somewhere: dimensions, a hand, a known object | **Obligation** | → `buy-scale-is-stated`. The file supplies its own three unrelated renditions in the same sentence. |
| 98–100 | A labelled placeholder naming the required shot beats a generated approximation | **Obligation** | → `buy-missing-image-names-itself` |
| 104 | "Gallery transitions and a variant swap, both under `--motion-fast`. Nothing else moves" | **Appearance** | A two-item allowlist plus a named token from one design system. |
| 104, 107–108 | Never near money; nothing animates in the basket, at checkout, or on a price | **Obligation** | → `buy-nothing-moves-near-money` |
| 110–112 | Adding to basket, filtering and recalculating delivery need visible feedback within 100ms | **Obligation** | → `buy-committed-actions-answer-immediately`. 100ms is a perception threshold, not a look. |
| 115–116 | "One accent, reserved for the purchase path. Add to basket, checkout, and nothing else" | **Appearance** | The prompt names this correctly. It is a colour-allocation rule, and it is the single line most responsible for three shops looking alike. What it protects is real: → `buy-one-unmistakable-purchase-control`. |
| 118–122 | Semantic state is a separate group; must be legible in both schemes; must never be the only carrier ("low stock" says the words as well as being amber) | **Split** | "Never the only carrier" is true of every page → `universalRules` (and **not currently in `SKILL.md` section 8**). That stock, offer and delivery state must be *stated at the point of decision* is commerce-specific → `buy-availability-is-stated-in-words`. **The word "amber" on line 121 is a `named-colour` under `floor-lint.mjs:31` and must not survive the copy.** |
| 123–124 | Sale pricing shows both numbers, original struck and labelled, never invents a "was" | **Split** | "Struck" is one rendition. The obligation is that a reduction names a reference and the reference is real → `buy-reference-price-is-real`. |
| 130–131 | Show the distribution, not just the mean | **Obligation** | → `buy-proof-shows-its-shape` |
| 132–133 | Negative reviews stay | **Obligation** | → `buy-proof-shows-its-shape` |
| 134 | Reviews attributed to a verified purchase where supported | **Obligation** | → `buy-proof-shows-its-shape` |
| 135–136 | "Buyers who read specs are the ones who complete" | **Unsourced claim** | Ironic in a package whose `SKILL.md:150-155` says a claim needs a source. Cut the sentence; the obligation it decorates is already `buy-specification-is-complete`. |
| 138–139 | No reviews yet: say so plainly, with the reason. Inventing them loses the customer who checks | **Obligation** | → `buy-absent-proof-is-declared` |
| 143 | Category structure matches how buyers search, not how the warehouse is organised | **Obligation** | → `buy-structure-follows-the-buyer` |
| 145–147 | "A mega-menu is correct here above roughly twenty categories: two levels, grouped" | **Appearance** | A named component at a pinned threshold. Forty categories are equally well served by a search-first shell with no menu, or by a browsable index page. |
| 148–149 | Persistent search, basket with a count, account; on a phone search and basket stay, the menu collapses | **Split** | The component triad and the collapse behaviour are one navigation pattern. The obligation is that what the buyer has accumulated stays visible and reachable → `buy-the-basket-is-never-out-of-reach`. |
| 151–152 | Breadcrumbs on every product and category page | **Split** | Breadcrumbs are one rendition. A persistent "back to 47 results" chip and filter state held in the URL so browser-back works are two others. Obligation → `buy-the-way-back-to-the-set`. |
| 155–157 | Add to basket in the purchase panel, sticky through the specification on desktop, pinned to the bottom of the viewport on a phone | **Appearance** | One layout — and `NORDRIG-AB-FORENSICS.md:37-38` lists "sticky buy panel, mobile bottom bar" as a line item in build B's *method*, which is how a floor rule became a signature. Obligation → `buy-purchase-control-is-always-in-reach`. |
| 158–159 | One primary action per product page; Save for later and Compare are secondary | **Obligation** | → `buy-one-unmistakable-purchase-control` |
| 159–160 | The action states what happens: "Add to basket", not "Buy now" unless it skips the basket | **Universal** | Already carried, `SKILL.md:139-141` ("a control says what happens when it is used and keeps the same word all the way through"). Worth one worked example in `floor/buy.md`, not a mechanism. |
| 162–164 | Price, variant and delivery estimate inside the panel; "a buyer should never scroll to check what they are about to pay" | **Split** | "Inside the panel" is the appearance form. The second sentence is the obligation and it is the best line in the file → `buy-total-commitment-legible`. |
| 167–169 | Specs dense and complete; prose "two or three sentences per benefit" | **Split** | The sentence count is a pinned value. The obligation is that prose is subordinate to the spec, which is section 11's real content → `buy-every-claim-maps-to-a-spec-line`. |
| 171–172 | "Every claim about the product maps to a specification line" | **Obligation** | → `buy-every-claim-maps-to-a-spec-line`. The most valuable single rule in the file: it makes `SKILL.md:150-155`'s abstract "a claim needs a source" mechanically checkable on this surface, because the source is named and it is on the same page. |
| 176–178 | Failure: the specification is curated | **Obligation (test)** | Failure form of `buy-specification-is-complete` |
| 179–181 | Failure: proof invented or filtered | **Obligation (test)** | Failure form of `buy-proof-shows-its-shape` / `buy-absent-proof-is-declared` |
| 181–183 | Failure: the purchase path is decoration. "Everything on a product page is either helping the purchase or in its way" | **Obligation (test)** | → `buy-helping-or-in-the-way`. The mode's actual thesis, and it arrives on the last line. |

---

## What must be flagged before the copy into `floor/buy.md`

Read against `tools/floor-lint.mjs`:

1. **`amber` (line 121)** — matches `BANNED.named-colour` (`floor-lint.mjs:31`). Hard fail.
2. **`--motion-fast` (line 104)** — passes the regex but names a token in one design
   system. Same defect class, no lint coverage.
3. **`200px` (line 52), `4:3`, `3:2`, square (line 93), "twenty categories" (line 145),
   "two or three sentences" (line 168)** — all pass the regex. `ALLOWED_NUMBERS`
   (`floor-lint.mjs:41`) whitelists accessibility minima; it does not blacklist arbitrary
   pinned dimensions, so the lint cannot see these. **Recommendation: the purity check
   needs a fourth class — a pinned dimension that is not in `ALLOWED_NUMBERS` and is not
   inside a rendition example should be flagged.** Without it, `floor-lint` passes a file
   that pins a 200px band and a 4:3 crop, and two sites built from it match.
4. **"pill-shaped" (line 85), "full-round" (line 84), "second-largest type" (line 67),
   "tight end of the ramp" (line 66)** — appearance stated in words rather than values.
   Invisible to every regex in `BANNED`. This is the largest lint gap and it is where
   section 3 and section 4 live.
5. The renditions requirement (`floor-lint.mjs:43`) needs the literal phrase. None of the
   obligations below arrive with one; `floor/buy.md` has to supply the three renditions
   itself, which is what the `threeRenditions` field in this extraction is for.

---

## The obligations, with their three renditions

Each is written the way it should read in `floor/buy.md`: as a thing the surface must
achieve, followed by three renditions that share no visual language.

**1. `buy-decision-and-control-together` (46–47)** — the object and the means of acquiring
it are apprehensible together, without a screen of scrolling inserted between wanting and
buying. *Renditions:* a single full-bleed photograph with the price and one control set
into its lower corner; a two-column drawing-sheet layout with the object left and a spec
panel right; a dense tabular catalogue row where the price cell and the buy cell are part
of the same row and there is no product page at all.

**2. `buy-price-is-found-not-hunted` (62–63)** — the price is located without search on
every surface where the object appears. *Renditions:* price as a stamped mark on the
image; price in a fixed column position in a table, identical on every row; price spoken
in the running sentence of a configurator ("this configuration, 14 200 kr").

**3. `buy-total-commitment-legible` (38, 162–164)** — everything the buyer will actually
pay and wait for — price, variant, delivery cost, delivery time, return terms — is legible
at the moment of commitment without navigating away from it. *Renditions:* one panel
containing all of it beside the control; a running summary bar that restates the total as
choices are made; a confirm step that restates the whole commitment on its own page before
anything is charged.

**4. `buy-one-unmistakable-purchase-control` (115–116, 158–159)** — exactly one control on
the surface acquires the object, and it cannot be confused with any other control.
*Renditions:* it is the only filled control among outlines; it is the only control inside
the panel and every other control is a text link; it is physically larger and set apart by
a rule with nothing else in its band. **Not by colour reservation**, which is one rendition
of this and is the one that produced three identical shops.

**5. `buy-purchase-control-is-always-in-reach` (155–157)** — from any point where the buyer
might decide, the purchase control is reachable without hunting for it. *Renditions:* one
control that follows the viewport; the control repeated at the end of each argument block
so there is always one below; a configurator whose footer is the control and never leaves.

**6. `buy-specification-is-complete` (35–36, 176–178)** — every specification that exists is
shown. Curation reads as concealment. *Renditions:* one long table, grouped, all of it
visible; progressive disclosure where every group is present and collapsed, none omitted;
a downloadable data sheet linked from a summary, where the sheet is the complete record.

**7. `buy-every-claim-maps-to-a-spec-line` (171–172)** — every claim made about the object
resolves to a specification line on the same surface. A benefit with no spec behind it is
marketing in the wrong place. *Renditions:* benefit prose with a reference mark into the
table; two columns, claim left and its measurement right; no prose at all — the spec rows
carry captions and the captions are the argument.

**8. `buy-proof-shows-its-shape` (130–134, 37)** — proof is presented with its size, its
spread and its worst cases intact, and attributed where attribution is possible.
*Renditions:* a distribution histogram beside the mean; the count set at the same weight as
the score, with the lowest-rated review pinned first; no aggregate at all, just the reviews
in full with their dates.

**9. `buy-absent-proof-is-declared` (138–139)** — where proof does not exist, its absence is
stated plainly with the reason. It is never manufactured. *Renditions:* a sentence in the
proof slot saying so; the slot replaced by the date the object went on sale; the proof
section absent entirely and its absence noted in the specification.

**10. `buy-availability-is-stated-in-words` (118–122)** — stock, offer and delivery state
are stated in words at the point of decision, and are never carried by colour alone.
*Renditions:* a sentence under the price; a status column in a table; a dated line in the
spec block ("ships from stock, 3 to 7 working days"). *(The "never colour alone" half of
this is universal — see `universalRules`.)*

**11. `buy-reference-price-is-real` (123–124)** — a reduced price names the price it is
reduced from, that reference is a price the object was actually sold at, and both numbers
are readable. *Renditions:* strikethrough plus a "was" label; two labelled rows, list price
and your price; a percentage badge with the reference price stated in the footnote it
points to.

**12. `buy-nothing-moves-near-money` (104, 107–108)** — nothing animates on a price, in the
basket or at checkout. A number that counts up is a number the buyer re-checks.
*Renditions:* values swap instantly with no transition; the total is static and a separate
text line states what changed; the whole page reloads and the new total is simply there.

**13. `buy-committed-actions-answer-immediately` (110–112)** — adding to the basket,
applying a filter and recalculating delivery each produce visible feedback within 100ms,
whatever the server takes. *Renditions:* the control itself changes state in place;
the count increments optimistically and rolls back on failure; a full page transition with
a determinate progress indicator.

**14. `buy-the-way-back-to-the-set` (151–152)** — the buyer can return to the set they were
choosing from with their filters intact. It is the most common next action. *Renditions:* a
breadcrumb trail; a persistent chip reading back to the result count; filter state held in
the URL so browser-back is sufficient and no control is needed at all.

**15. `buy-the-basket-is-never-out-of-reach` (148–149)** — what the buyer has committed to
so far, and how many, is visible and reachable from every surface. *Renditions:* a
persistent header control with a count; a running list in a side rail on wide viewports and
a single line on narrow ones; a stated line at the top of every page ("3 items held, 4 210
kr") with no icon at all.

**16. `buy-result-set-is-navigable` (41–42)** — the buyer can narrow the set on the terms
they think in, always knows how many results they are looking at, and is never given a dead
end. *Renditions:* a faceted rail with a live count and a nearest-match row when empty;
a search field with typed refinements and a "no matches, closest three" block; a map or
index where narrowing is spatial and the empty case pans to the nearest cluster.

**17. `buy-structure-follows-the-buyer` (143)** — categories are named and grouped the way
buyers ask for things, not the way stock is organised. *Renditions:* a browsable hierarchy
in the buyer's nouns; a search-first shell with no hierarchy exposed; a task-based index
("replacing a broken one", "buying a first one").

**18. `buy-the-object-is-the-subject` (77–78, 90)** — on any surface where the object
appears, the object is the largest and most legible thing there; chrome does not compete
with it. *Renditions:* a full-bleed image with all text outside its frame; a hairline frame
with generous ground inside it; no frame at all, image and caption on the page ground.

**19. `buy-image-set-is-consistent` (92, 95)** — the object is shown from more than one
angle, treated identically across the whole catalogue, with detail views wherever the
material is part of the purchase. *Renditions:* white-ground cutouts throughout with a
macro strip; every object photographed on the same bench under the same light; flatbed
scans at a fixed resolution with a rule in frame.

**20. `buy-scale-is-stated` (96)** — physical scale is established, not left to the
photograph. *Renditions:* dimensions in the spec block; a hand or a known object in one
frame of the set; a scale bar or a drawn outline against a standard reference.

**21. `buy-missing-image-names-itself` (98–100)** — where the real photograph does not exist
yet, a labelled placeholder states the shot required. A generated approximation that will
not match the shipped catalogue is worse than an admitted gap. *Renditions:* a ruled box
with the shot specification set in it; a spec-block row naming the missing asset; a
caption-only slot where the caption is the brief.

**22. `buy-related-states-the-relation` (39)** — where other objects are shown, the page
says what their relation is: an alternative if this one is wrong, a complement if it is
right. *Renditions:* two labelled bands; a single band where each item carries its relation
as a caption; a decision line in prose that links three named objects by their difference.

**23. `buy-comparison-is-a-glance` (62–69, 71)** — repeated units in a set are consistent
enough, and compared figures aligned enough, that comparing two objects is a glance rather
than a task. *Renditions:* a table with figures in fixed columns; identical repeated cards
where every field is in the same place in each; one object per screen with a persistent
compare strip carrying the figures forward.

**24. `buy-name-the-free-axis` (53–57, 80–82)** — the floor names which decisions it does
**not** make and sends them to the direction, and it says which axis the alternatives must
differ on. *Renditions (of the format itself):* the arrangement axis named and left open
in section 2; the radius question answered with "the value comes from the direction and
the photography, not from this file" in section 4; the same discipline applied to every
remaining slot in `floor/buy.md`. This is the mechanism that should govern how the whole
floor file is written, not just a rule inside it.

**25. `buy-helping-or-in-the-way` (181–183)** — every element on the surface is either
helping the purchase or in its way, and the audit is to name which for each one.
*Renditions (of the test):* an annotated screenshot with each block marked; a list of
elements with a one-word verdict each; a build note that names what was removed and why.

---

## What belongs in `SKILL.md` section 8 instead

Three things in this file are true of every page regardless of surface. Two are already
carried; one is not and should be added.

- **Alt text describes what the image is doing there** (line 94) — carried,
  `SKILL.md:172`.
- **A control says what happens when it is used** (lines 159–160) — carried,
  `SKILL.md:139-141`.
- **Colour is never the only carrier of information** (line 121) — **not carried.**
  `SKILL.md:174-179` lists 4.5:1, 3:1, 44px, 24px, 16px, 320px and the focus-indicator
  rule, but nowhere states that a state signalled by colour must also be signalled some
  other way. It is a WCAG floor, it is true of every surface, and mode E is currently the
  only place in the package that says it. Move it up.

---

## Honest weaknesses in this extraction

- `buy-the-object-is-the-subject` (18) is the weakest survivor. It is derived from a
  section about corner radius and it is one careless restatement away from becoming a
  card-chrome prescription. If it cannot be written in `floor/buy.md` without implying a
  card, drop it — the imagery obligations already cover most of its work.
- The 55/30/15 split is a line count of substance, judged per instruction, not a metric.
  A different reader could plausibly land at 50% or 60%. What is not judgement-dependent is
  that sections 3 and 4 do not survive, and that four of the twelve template topics are
  appearance slots.
- Section 1's fixed seven-step order is called template rather than appearance. That is the
  softest call in the table. It is not a *look*, but it is a single arrangement, and three
  shops that follow it will have the same page skeleton — which is half of what
  `portfolioDiversity` measures.
