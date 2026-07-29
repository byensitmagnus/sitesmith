# ASSET MANIFEST — Marrow & Kell

Every row is `ready`. Every `id` matches a `data-asset` attribute on the rendered element in
`site/index.html`, except the favicon and the mark, which are inline in the document head and
masthead and are noted as such.

One photographic treatment across all three: long lens, one hard working source, everything
unlit falling to near-black, no fill, no grade toward gold. Sizes are served with `<picture>`
and `media` rather than `srcset` widths, because the 390 crops are a different aspect ratio from
the 800 and 1400 crops and a width descriptor would let a wide viewport pick a square.

| id | what | where | source | licence | state | focal | treatment |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `swarf` | A curl of bronze swarf lifting off the cutting tool inside a bell, cutting fluid catching the light, bright cut against dark patina | Hero, full-bleed right column at 1000px and up; full-width band under the copy below that. `site/assets/swarf-{390,800,1400}.webp` | Generated for this project to `VISUAL-SOURCE-PLAN.md`; approved and supplied in the workspace | Project-owned, cleared for this build | ready | `34% 46%` | `object-fit: cover`, no filter, no overlay except the caption scrim at the foot |
| `bell-on-the-machine` | A church bell mouth up on the bed of a vertical boring machine, tool head lowered into it, foundry dark behind | Full-bleed band closing "One bell, five notes, five heights". `site/assets/bell-{390,800,1400}.webp` | Generated for this project to `VISUAL-SOURCE-PLAN.md`; approved and supplied in the workspace | Project-owned, cleared for this build | ready | `48% 58%` | `object-fit: cover`, no filter, caption scrim at the foot |
| `bronze-after` | The inside wall of a bell after tuning: bright machined bands crossing older dark patina, tool marks reading as texture | Right column of the enquiry, sticky full-height at 1000px and up; band above the enquiry heading below that. `site/assets/bronze-{390,800,1400}.webp` | Generated for this project to `VISUAL-SOURCE-PLAN.md`; approved and supplied in the workspace | Project-owned, cleared for this build | ready | `50% 50%` | `object-fit: cover`, plus a one-directional scrim from the ground colour on the edge that meets the form, so the type has a quiet field to sit against |
| `mark` | The brand mark: five rules of graduated length against one vertical datum, drawn from the 1904 column of St Æthelburga's tuning book. The only authored SVG on the page | Masthead, inline SVG in `.mark`, 34px tall | Drawn for this project | Project-owned | ready | n/a, vector | `stroke: currentColor`, 2.8 and 1.3 units, butt caps, no fill |
| `favicon` | The same mark on the ground colour, as a `data:image/svg+xml` URI so the page makes no external request | `<link rel="icon">` in the head | Drawn for this project, same geometry as `mark` | Project-owned | ready | n/a, vector | Strokes `#e8e3d7` on `#0b0d0c` |

## Notes

- **Why the mark is not a bell.** A reviewer named the previous bell glyph as generic, and it
  was. This mark is the foundry's own tuning book reduced to six strokes: the five partials of a
  14 cwt tenor as it came in, ruled against true. It is the same object as the chart in the
  middle of the page, so the identity and the argument are one thing.
- **No icon set, no decorative vector.** Numbering, rules and hairlines are type and borders.
- **Nothing generated during this build.** The three photographs were already made and approved;
  they are used as supplied, cropped only by `object-position`.
- **No external request of any kind.** No webfont, no CDN, no analytics, no remote image. Type is
  a system grotesque and a system monospace, and the character comes from the setting.
