# 20 — the direction lab

> Original work, MIT. Read after the evidence pack, before the design-system contract.
> Output: `DIRECTION.md` and three comps under `directions/`.

Three directions. Structurally different, not three colourways. One is chosen with reasons,
the other two are recorded with the reason they lost. Then the contract is written from the
winner.

The order matters and it is the point. Fixing tokens first — a spacing step, a three-value
ink ramp, a radius pair — is how nine different subjects converge on one look: the system is
decided before anyone asks what the page should be, and every later choice fits the system.

---

## Contents

- [1. What "structurally different" means](#1-what-structurally-different-means)
- [The three visible dials](#the-three-visible-dials)
- [2. The five axes](#2-the-five-axes)
- [3. What a comp is](#3-what-a-comp-is)
- [4. Choosing](#4-choosing)
- [5. Recording the rejections](#5-recording-the-rejections)
- [6. The anti-repeat rule](#6-the-anti-repeat-rule)
- [7. Checking the three are actually different](#7-checking-the-three-are-actually-different)

---

## The three visible dials

Before searching for directions, record three integers from 1 to 10 in `BRIEF.md`:

- **Visual density** — 1 is gallery-airy; 10 is cockpit-packed.
- **Motion intensity** — 1 is static apart from state feedback; 10 is choreographed motion.
- **Aesthetic boldness** — 1 follows familiar conventions; 10 takes a controlled structural risk.

Infer them from the audience, task, evidence and platform. State one sentence of reasoning for
each. They are visible controls, not a universal preset hidden in the skill. Product UI normally
earns lower motion and boldness than a campaign page, but the brief decides.

Pass the same values to the candidate search. The search adds intent vocabulary before ranking,
so a quiet brief and a kinetic brief do not start from the same first candidate:

```bash
python scripts/search.py "<subject> <trade>" --candidates \
  --density <1-10> --motion <1-10> --boldness <1-10>
```

The chosen values are copied unchanged into `DIRECTION.md`. Changing a dial later is a direction
change, not polish.

---

## 1. What "structurally different" means

Three comps that share a layout and differ in hue are one direction rendered three times.
That is the failure this file exists to stop, so the requirement is mechanical:

**Two comps are structurally different when they differ on at least three of the five axes
in section 2, and one of those three is the first-screen composition.**

Three comps must be pairwise structurally different. A→B, B→C and A→C all have to clear the
bar. In practice this forces one of them to be uncomfortable, which is the intended effect:
the third comp is where the direction that would not have occurred to you goes.

## 2. The five axes

### Axis 1 — first-screen composition

*How the top of the page is arranged, and what carries it.*

Not a menu to pick from — these are named so two comps can be compared, and the list is not
closed. Statement-and-artefact; full-bleed image with type over it; type alone at scale; a
dense index that starts immediately; a split down a hard vertical rule; the product's real
interface, full width; a grid of many small things; a single object, centred, on a ground.

The only rule: whichever is used, it is chosen for this subject and the reason names the
subject. "It works because the eye lands on words first" is a reason about eyes. "It works
because the roof is the evidence and the words are not" is a reason about a roofer.

### Axis 2 — typographic system

Display face family and its relationship to the body face. Same family or contrasting.
Scale ratio and how many sizes are actually in play. Whether type is the material or the
label. Whether anything is set in a way that would be recognisable with the words removed.

Two comps in the same OS UI stack are the same on this axis whatever their sizes.

### Axis 3 — colour and ground

Light ground, dark ground, or a ground that is not near-white at all. One accent, two, or
none. Where the colour comes from — section 4 of the evidence pack. Whether colour separates
sections, or the page is one continuous field.

Two off-white grounds with a rotated accent hue are the same on this axis.

### Axis 4 — the role of imagery

Photography-led, diagram-led, data-led, object-led, or deliberately imageless. The crop
logic and the aspect ratios. Whether images sit inside containers or break out of them.
Whether the page still works with every image removed — and if the answer is yes for all
three comps, imagery was never load-bearing in any of them.

### Axis 5 — rhythm and edge

Section rhythm: alternating bands, one continuous field, a hard rule between sections, an
asymmetric column that runs the length of the page. Edge treatment: radius, hard corners,
hairlines, shadow, none of it. Density: how much of the page is empty and where.

## 3. What a comp is

A comp is a **single rendered HTML page of the subject's real first screen plus one more
section**, using real copy from the evidence pack. Not a mood board, not a description, not a
screenshot of somebody else's site.

- `directions/a/index.html`, `directions/b/index.html`, `directions/c/index.html`
- Self-contained. Inline CSS is correct here; these are throwaway.
- Real headline, real lede, real section heading — from the evidence, not `Lorem`.
- Assets: use what `ASSET-MANIFEST.md` says exists. Where an asset is `(needed)`, a comp may
  use a labelled slot, because a comp is explicitly a draft. **The production gate forbids
  this in the built site; it permits it here.** That difference is the whole reason the two
  gates are separate.
- 15 to 20 minutes each. A comp that takes an hour is a page, and building a page before the
  direction is chosen is what this file exists to prevent.

Each comp gets a `directions/<x>/NOTE.md`: one paragraph on what it is arguing, and its five
axis values as a list. The axis list is what section 7 checks.

## 4. Choosing

Score each comp against these, out of the evidence pack, and write the scores down:

1. **Does it come from the subject?** Could this comp exist for a different company in the
   same category with only copy changed? If yes, it scores zero here regardless of how it
   looks.
2. **Does it serve the brief's primary action?** A striking comp that buries the one thing
   the site is for loses to a plainer one that does not.
3. **Can it be built and maintained?** Including: do the assets it needs exist or can they be
   made. A direction that depends on photography nobody will take is not a direction.
4. **Does it avoid the anti-references?** From evidence section 6, by name.
5. **Is there one thing in it you would defend?** Name it. This is the visual signature and
   it goes into the contract.

Highest total wins. If two tie, the one whose signature is more specific to the subject wins;
if they still tie, take the one that is harder to rebadge.

**The winner is allowed to take one element from a loser.** Say which and why. A graft is not
a compromise as long as it is recorded — an unrecorded graft is how three directions quietly
become one average.

## 5. Recording the rejections

`DIRECTION.md` contains, for each of the three:

- the three visible dial values shared with `BRIEF.md`,
- its five axis values,
- its score on the five criteria,
- for the two that lost: **what specifically it did well, and the specific reason it lost.**

"Less strong overall" is not a reason. "The dark ground made the price list hard to scan in
daylight, which is where roofers read it" is.

This section exists so that a later reviewer — or the next agent to touch the site — can see
what was considered and does not have to re-derive it. It is also the honest record of
whether three directions were genuinely explored or two were built to lose.

## 6. The anti-repeat rule

The lab keeps a record. `directions/HISTORY.md` accumulates one line per chosen direction
across the whole project: date, page or site, and the five axis values of the winner.

**A new direction may not match a previous winner on all five axes.** If it does, either the
lab did not explore, or the subject genuinely wants the same treatment — in which case say so
explicitly and note that it is a repeat.

Across a benchmark set, a portfolio of client work, or a gallery, this is the mechanism that
stops the sixth site looking like the first. It is the direct answer to nine legacy pages
sharing one hero, one font stack and one palette recipe.

## 7. Checking the three are actually different

```bash
node scripts/direction-check.mjs directions/
```

Reads the axis lists from the three `NOTE.md` files, checks pairwise difference on at least
three axes including axis 1, renders all three, and reports measured differences it can see
in the DOM: ground luminance, display font stack, number of distinct type sizes, image count,
section-rhythm signature.

Where the declared axes and the measured page disagree, the measurement wins and the check
fails. A comp whose `NOTE.md` claims a dark ground and renders `#faf8f4` has not made the
choice it says it made.

The check is not a judgement of quality. Three genuinely different bad comps pass it. It only
answers whether three options were actually put on the table.

---

## When it is done

- Three comps exist, render, and use real copy.
- Pairwise structural difference holds, verified by the script.
- No winner repeats all five axes of a previous entry in `HISTORY.md`.
- `DIRECTION.md` names the winner, the signature, the graft if any, and the two rejections
  with specific reasons.

Then, and only then, [`30-contract.md`](30-contract.md). The contract is written **from the
winning comp** — its ground, its type, its rhythm — rather than the comp being adjusted to
fit a contract that already existed.

---

## The axis record, verbatim

`DIRECTION.md` must contain this block. `scripts/direction-fidelity.mjs` parses it and checks
the built page against every line, so the **shape is a contract, not a suggestion**:

```markdown
## Axis record

- direction-version: 2.2
- composition: <how the page is arranged>
- type: <display face> over <body face>, <what the figures are set in>
- colour: <ground>, <the one accent and what it is reserved for>
- imagery: <photography-led | diagram-led | object-led | deliberately imageless>, <treatment>
- rhythm: <how sections are separated>

- visual-density: <1-10>
- motion-intensity: <1-10>
- aesthetic-boldness: <1-10>

- signature-selector: <css selector>
- signature-min-share: <percent of the first screen it must occupy>
```

Five axis lines and three dial lines, each beginning `- ` and the field name, then a colon.
New directions declare `direction-version: 2.2`; that makes all three dial lines mandatory.
Prose headings such as
`- **Type and scale.** …` do not parse: the gate reads the axis as `undefined` and fails the
page for declaring nothing, which looks like a design fault and is a formatting one.

Two lines the parser reads literally:

- **`type`** — name the *display* face first. The parser reads the clause before the word
  `over`, so "condensed grotesque display over a system sans" checks the display face and
  ignores the body face. Writing "a system sans with a condensed display" checks the wrong one.
- **`colour`** — state the ground in words the parser can classify: `light`, `paper`, `white`,
  `off-white`, `cream`, `buff`, `stone`, `limewash` on one side; `dark`, `near-black`, `black`,
  `ink ground`, `inverted` on the other. A colour axis with no ground word is reported as
  unclassifiable and the ground is not checked at all.

Two independent builders wrote considered directions and produced documents the toolchain could
not read, because this block was never written down. That is what this section exists to stop.
