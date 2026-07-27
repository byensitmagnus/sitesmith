# 05 — the evidence pack

> Original work, MIT. Read after the brief and before anything visual. Output: `EVIDENCE.md`.

A brief says what the site must do. It does not say what the subject *looks like*, and a page
designed from a brief alone can only look like the category it belongs to. That is the
mechanism that produces nine pages sharing one hero: nothing in the process ever went and
looked at the thing.

The evidence pack is that step. It is research, not design. Nothing here decides a colour.

---

## What it is for

Every real subject has a world: objects, documents, surfaces, vocabulary, colours that are
already true, and constraints that already exist. A roofing company has felt, standing water,
scaffold, a van, quotes on headed paper, and a phone that rings at seven. A film sound
designer has waveforms, field recorders, call sheets, and rooms with the lights off.

None of that is invented. It is found, written down, and later becomes the material a
direction is made from. **A direction that could have been reached without the evidence pack
is a direction the brief did not need.**

## The seven sections

`EVIDENCE.md` has these, in this order. Short is fine — one page total is normal. Empty is
not: an empty section is a finding, and it must say why it is empty.

### 1. Artefacts

The physical and digital things the subject makes, uses or hands over. Ten is plenty.

For each: what it is, where it would be seen, and whether it could appear on the site.

> Ridgeway Roofing — completed flat roof from above; a section of felt lapped at a joint; the
> van; a written quote on headed paper; a moisture meter reading; scaffold against a terrace.

### 2. Vocabulary

Twenty words or phrases the subject's people actually use, and five the category uses that
they do not. This is the difference between copy that sounds like the trade and copy that
sounds like a brochure about the trade.

> Uses: lap, upstand, ponding, torch-on, tingle, deck, drip edge, fall.
> Does not use: solutions, seamless, bespoke, journey.

### 3. Materials and surfaces

What the subject's world is physically made of, and what that implies for texture, weight and
edge. A joinery workshop and a compliance SaaS do not have the same natural surface even if
both end up on a light background.

### 4. Colour that is already true

Colours the subject already owns or is already surrounded by, with where they come from.
Existing brand colour if there is one, and if there is, it is not up for negotiation. Then:
the colour of the material, the machinery, the uniform, the packaging, the sky over the site.

This is not a palette. It is the raw stock a palette gets chosen from, and it is the reason a
palette can be defended.

### 5. Constraints already in force

Regulatory, contractual, technical and physical. Accessibility obligations, a parent brand,
a certification mark that must appear, a legally required disclosure, a product photographed
only in one orientation, a screen used in sunlight or in a cold store with gloves on.

### 6. References and anti-references

Three of each, named, with one line on why.

- **References** — specific sites, print, packaging, signage, film. What exactly to take:
  a grid, a way of setting figures, an edge treatment. Not "the vibe".
- **Anti-references** — what this must not resemble, and why. The nearest competitor usually
  belongs here. So does the category default: "must not look like the standard trades
  landing page, because every one of its competitors already does".

Anti-references do more work than references. They are what stops the first workable idea
becoming the only idea.

### 7. Asset reality

What actually exists, right now, that can go on the page. Photography, logo files, video,
diagrams, data. For each: does it exist, who owns it, what licence, what condition.

This section is the input to [`25-assets.md`](25-assets.md) and it is where the honest answer
"none of this exists yet" has to be written down rather than discovered at build time.

---

## Where the evidence comes from

In order of preference:

1. **Supplied by the client** — a folder, a website, a brochure, photos on a phone.
2. **The existing site or product**, read directly.
3. **Public material about that specific subject** — their listings, their trade body,
   their suppliers' catalogues, planning records, the standards they work to.
4. **The category's real practitioners**, not the category's marketing. Trade forums and
   supplier documentation say what a roof is made of; roofing landing pages do not.
5. **Stated as unknown.** An honest gap beats a plausible invention, and a plausible
   invention about a real subject is the failure this whole layer exists to prevent.

Nothing in `EVIDENCE.md` may be invented. If a fact is inferred rather than found, mark it
`(inferred)`. If it is a placeholder for something the client must supply, mark it `(needed)`.
Those two markers are read later by the production gate.

## Fictional subjects

A benchmark or a demo has no client to ask. The rules do not change: the subject still has a
real world, because the *category* is real. A fictional flat-roof contractor in Sheffield sits
in the same physical trade as a real one, and the evidence pack is built from that trade.

What is not allowed is inventing the parts that would be checkable — a real customer's name,
a certification the subject does not hold, a measured figure. Those stay `(needed)` and the
page is built to work without them.

## When it is done

- Every section has content or a stated reason it does not.
- At least three anti-references, each with a reason.
- The asset section distinguishes exists / needed / inferred for every item.
- Nothing in it is a design decision. If a hex code or a typeface appears here, it belongs in
  section 4 as something already true, with its source — not as a choice.

Then, and only then, [`20-direction-lab.md`](20-direction-lab.md).
