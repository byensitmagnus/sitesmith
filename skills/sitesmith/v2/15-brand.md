# 15 — brand and asset inventory

> Original work, MIT. Read after the evidence pack, before the direction lab.
> Output: `BRAND.md`, and the first rows of `ASSET-MANIFEST.md`.

Most subjects are not starting from nothing. They have a logo somewhere, a colour they have
used for nine years, a typeface on their van, and a folder of photographs. A pipeline that
goes straight from evidence to three fresh directions quietly throws all of it away and hands
the client a rebrand they did not ask for.

This step is where what already exists gets written down, so the direction lab works *with*
it instead of around it.

---

## When this step is short

A subject with no existing brand — a new company, a benchmark, a fictional pilot — gets a
`BRAND.md` that says so in three lines and moves on. That is a complete answer. What is not
acceptable is skipping the step and discovering at build time that the client had a logo.

## What `BRAND.md` records

### 1. What exists

| | |
| --- | --- |
| **Logo** | The files, their formats, whether there is a vector original, and what it is actually a picture of |
| **Colour** | Every colour the subject already uses, with where it comes from — a van, a sign, a previous site, a product |
| **Type** | Faces already in use, and whether they are licensed for web |
| **Photography** | How much, of what, who took it, and whether it can be used |
| **Voice** | How they already write about themselves, in their words |

For each: **owned**, **licensed** (with the terms), or **unknown**. Unknown is a finding, not
a blank.

### 2. What is fixed and what is open

The single most useful line in this file. An existing logo the client will not change is a
constraint the direction lab has to design around, and saying so before three comps are built
saves two of them.

> Fixed: the wordmark, the dark green (from the van, in use since 2011).
> Open: everything else. They have never had a website.

### 3. Reference board

Where the brief calls for one — a subject with a visual world, a client who thinks in
pictures, a redesign with something to react against — collect five to ten references with
one line each on *what specifically to take*: a grid, a way of setting figures, an edge
treatment, a crop. Not "the vibe".

The anti-references from `EVIDENCE.md` section 6 belong beside them. A board with only things
to imitate is half a board.

### 4. What has to be made

Everything the site needs that does not exist yet, straight into `ASSET-MANIFEST.md` as
`needed`. This is the moment the honest answer costs least.

---

## Extracting a palette from what exists

When a logo or a photograph is supplied, take the colours from it rather than choosing beside
it. A brand colour sampled from the client's own van is defensible; one chosen from a palette
site next to it is a second brand.

Record the source of every colour. A hex with no provenance is a preference, and preferences
are what the direction lab is for.

## What this step must not do

**It must not choose.** No direction, no type pairing, no palette decision. Inventory only.
The temptation is strong precisely because the material is right there — and a direction lab
that starts after the direction has already been half-chosen is a formality.

**It must not invent.** A subject with no logo does not get one here. It gets a `needed` row.

---

## When it is done

- Every category above is answered, including with "none".
- Fixed and open are separated, and the fixed list is short and specific.
- Every existing asset that will be used has a `ready` row in `ASSET-MANIFEST.md` with its
  real source and licence.
- Everything else that is needed has a `needed` row.
- No colour, face or arrangement has been *chosen*.

Then [`20-direction-lab.md`](20-direction-lab.md), which now has something to design with.
