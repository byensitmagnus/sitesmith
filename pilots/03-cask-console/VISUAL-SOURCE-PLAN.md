# Visual source plan — Stalbridge cask desk

> Written before anything is generated. Media strategy: **functional UI, domain icons, and one
> discreet piece of environmental material** — nothing else. This is a tool, not a page about a
> tool, and the brief forbids forcing photography into it.

## The strategy in one line

Almost no imagery at all, on purpose: three cask-size glyphs that carry a real quantity, and one
low-contrast cellar texture behind the standing header so the tool feels like it lives in a
room. Everything else on the screen is information.

## Why this is the honest answer here, and not a repeat of the old failure

The old pilots defaulted to "designed out" because nothing could make a picture. This is
different: the engine now can, a cost preflight exists, and the answer is still almost none —
because a cellarman at 06:40 needs to read what is late from across the room, and a photograph
in that space would be decoration competing with the only thing that matters.

The difference from the old page is that the glyphs here carry **size**, which is data. A firkin
is 9 gallons, a kilderkin 18, a barrel 36, and the three glyphs are drawn to those proportions,
so the shape of the row tells a cellarman how much beer is at that pub before they read a digit.

## What is deliberately **not** here

- No hero. No marketing photograph of a cellar, a pub, a pint or a dray.
- No line-drawn technical illustration as a page-carrying asset. That is the chandlery's old
  failure and the foundry's old failure, and both were called one shared studio method.
- No stock photography of beer.

---

## `cask-glyphs`

- role: the size indicator at the head of every row, drawn to real relative volume
- why: cask size is a quantity, and a glyph proportioned to that quantity is read faster than a word — at arm's length the row's shape says how much beer is out before a digit is read
- strategy: drawn
- medium: drawing, flat vector glyph set, drawn in code rather than by a model
- subject: three cask silhouettes — firkin 9 gallons, kilderkin 18, barrel 36 — with heights in the cube-root ratio of their volumes so the difference is true rather than decorative
- materials: none; flat single-colour vector
- composition: each glyph centred in its own square viewBox, shive bung and one hoop line, no perspective
- lighting: none; flat
- aspect-ratios: 1:1
- crops: 96x96; 64x64
- focal: 50% 50%
- anti-references: a foaming pint glass; a wooden barrel with a rustic tap; anything with a highlight or gradient
- must-not-change: the relative heights, because they are the data the glyph exists to carry
- factual-risk: glyphs of equal size would tell a cellarman that four firkins and four barrels are the same amount of beer, which is wrong by a factor of four
- max-attempts: 2
- candidates: 0
- capability: text-to-image

## `cellar-ground`

- role: a very low-contrast texture behind the standing header bar only, never behind data
- why: the one concession to the room. A tool that runs in a cold brick cellar can say so quietly without becoming a page about cellars
- strategy: generate
- medium: photograph, texture
- subject: damp painted brick cellar wall in low light, no objects, no casks, no people, no signage
- materials: whitewashed brick; damp; flaking paint
- composition: flat on, filling the frame, no focal subject, usable tiled or cropped anywhere
- lighting: dim, even, cold — a single fluorescent tube out of frame
- aspect-ratios: 16:9
- crops: 1600x400
- focal: 50% 50%
- anti-references: a warm atmospheric pub cellar with barrels stacked; anything with a light source in frame; any recognisable object
- must-not-change: it must stay legible as a wall and never become a picture of something
- factual-risk: none material; it carries no claim and sits behind no figure
- max-attempts: 2
- candidates: 3
- capability: text-to-image
