# ASSET MANIFEST — Stalbridge cask desk

Four rows, and three of them are the same drawing. The brief allows one authored SVG and the
mode allows almost no imagery, so the cask in profile does the whole job: it is the size glyph
that carries volume, the mark in the standing bar, and the favicon. There is no icon set, no
illustration and no photograph of a brewery, because this is a working screen rather than a page
about one.

Every `id` below appears as a `data-asset` attribute on the element that renders it.

| id | what | where | source | licence | state | focal | treatment |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `cask-glyph` | One cask drawn in profile, with two hoops and the shive on the belly, placed at three heights in the cube-root ratio of 9, 18 and 36 gallons: firkin 35px, kilderkin 44px, barrel 55px | The size tally under the pub name on every consignment row, one glyph per cask | Drawn in code for this project as a single inline `<symbol>`, reused by `<use>` | Original work, MIT | ready | 50% 50% | Flat, single colour, `currentColor`, `fill-rule:evenodd` for the hoops and the shive. No stroke, no gradient, no shadow. Scaled by volume and never recoloured; `aria-hidden` because the adjacent line already says "6 kilderkins, 108 gallons" |
| `mark` | The same drawing at 19 by 23, set beside the wordmark, which is type rather than a logotype | Standing bar, top left, beside `Stalbridge cask desk` | The `cask-glyph` symbol, placed a second time | Original work, MIT | ready | 50% 50% | Ink on the standing bar. No container, no radius, no lock-up box. It is the pair every cask has, which is what evidence section 7 asked a mark to be |
| `favicon` | The same drawing on the whitewash ground, as an inline SVG data URI, so the tab carries no request | Browser tab and bookmarks | The `cask-glyph` geometry, character for character, in a data URI | Original work, MIT | ready | 50% 50% | 40 by 48 viewBox, ink `#141310` on `#EAE6DD`. No text, no second shape, no extra geometry authored |
| `cellar-ground` | Damp whitewashed brick cellar wall, flat on, no objects, no people, no signage | Behind the standing bar only, as its `::before` layer. Never behind a figure | `site/assets/cellar-1600.webp` above 800px, `site/assets/cellar-800.webp` at or below it | Supplied with this brief for this project | ready | 50% 50% | `cover`, opacity `.17`, `grayscale(.55)`, sitting under the bar's own opaque `#E1DCD0`, so measured text contrast is the bar's colour and not the photograph's. Carries no claim and sits behind no number |

## What is deliberately absent

- No photography of a cellar, a pub, a pint or a dray. Evidence section 7 says it does not exist
  and would be wrong here.
- No icon set. Navigation, states and actions are words, because a word survives a scratched
  screen in poor light and an icon does not.
- No avatars, no logos of pubs, no chart.
- No placeholder, no `(needed)` row, no grey rectangle standing in for something later.
