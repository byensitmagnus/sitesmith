# ASSET MANIFEST: Trelfall & Son

Every `id` below matches a `data-asset` attribute on the element that renders it in
`site/index.html`. Seven assets, seven rows, all `ready`. No asset is fetched from anywhere: the
photographs are local files, the mark is inline SVG, and the favicon is that same mark as a
`data:` URI, so the page makes zero network requests.

| id | what | where | source | licence | state | focal | treatment |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `bench-measure` | The cutting bench: boxwood and brass folding rule open along the boards, hot knife, pencilled ticket, coil of pale rope | Full-bleed band directly under the masthead, 80 px at 390 rising to 132 px at 1440 | Supplied and approved in `site/assets/`: `bench-960.webp` 960x540, `bench-1600.webp` 1600x900 | Provided with the brief for this build | ready | `46% 44%` | None in light. `brightness(.78) contrast(1.05) saturate(.9)` in dark so the band sits into the tarred ground instead of glaring off it |
| `rope-three-strand` | Cut end of 12 mm white three-strand polyester on worn oak, right-hand lay readable, end heat sealed | First band of the rack, 74 px tall at 390 and 152 px at 1440, cropped to a 2:1 strip | Supplied and approved: `rope-three-strand-390/640/1280.webp`, 390x390, 640x480, 1280x960 | Provided with the brief for this build | ready | `50% 47%` | None in light. `brightness(.86) contrast(1.03) saturate(.94)` in dark |
| `rope-double-braid` | Cut end of 12 mm white double braid polyester on the same bench, cover over a separate core, core showing at the cut | Second band of the rack, same crop and scale as every other band | Supplied and approved: `rope-double-braid-390/640/1280.webp` | Provided with the brief for this build | ready | `50% 44%` | Same as `rope-three-strand`. Focal raised 3 points because the rope lies higher in this frame |
| `rope-kernmantle` | Cut end of 11 mm low stretch kernmantle, woven sheath along the length, parallel core fibres out of the taped end | Third band of the rack | Supplied and approved: `rope-kernmantle-390/640/1280.webp` | Provided with the brief for this build | ready | `50% 46%` | Same as `rope-three-strand` |
| `rope-eight-plait` | Cut end of 14 mm eight-plait nylon, eight strands plaited over and under, end bound with whipping twine | Fourth band of the rack | Supplied and approved: `rope-eight-plait-390/640/1280.webp` | Provided with the brief for this build | ready | `50% 47%` | Same as the others plus a warming grade, `sepia(.3) saturate(1.55) hue-rotate(-7deg) brightness(1.03)`, because this one was shot on a cooler, greyer board and the rack only reads as one bench if the five boards match |
| `mark-lay` | The house mark: a rope seen end on, three strands packed inside the outer circle, which is what a three-strand cross section actually looks like | Inline SVG in the masthead, 30x30, stroked in `currentColor` so it flips with the scheme | Drawn for this build. One authored SVG on the page, and the only one | Original work for this build | ready | Centred on a 32 unit viewBox, outer r14, three inner r6.5 at 120 degrees | Stroke 2, no fill, `aria-hidden` because the wordmark beside it carries the name |
| `favicon` | The same mark, on the paper ground, as the browser tab icon | `<link rel="icon">` in the head, as a `data:image/svg+xml` URI | The identical artwork as `mark-lay`, serialised. Not a second drawing | Original work for this build | ready | Same geometry | Ink `#211A13` on paper `#EBE2CC` so it reads at 16 px in either browser theme |

## Notes

**On the focal values.** `VISUAL-SOURCE-PLAN.md` gives `62% 50%` for the rope studies and
`40% 55%` for the bench. Every band on this page crops a 4:3 source to a strip wider than 2:1,
and `object-fit: cover` on a strip wider than its source crops vertically only, so the
horizontal component of the plan's focal has no effect on what is shown. The vertical
components above were set per photograph so the rope runs through the middle of every band at
the same height, which is the whole point of stacking them.

**On the eight-plait grade.** It is a colour correction to match five photographs into one
bench, not a change to the subject. The eight strands, the plait, the diameter and the whipped
end are untouched, so the picture still shows the construction the row sells. This is the one
per-asset deviation from the single treatment, and it exists to produce the single treatment
rather than to escape it.

**On the missing fifth photograph.** The 14 mm three-strand polypropylene line has no coil on
the rack, so there is nothing to photograph. Its row carries no picture slot at all rather than
an empty box: the gap in the rack is the honest rendering of an empty rack space, and the row's
note says so in words.

**On the one SVG.** `mark-lay` and `favicon` are the same artwork used twice, once inline and
once serialised into a `data:` URI. There is no icon set on this page. Where an icon would
normally sit, the page uses a word: the checkbox is a drawn tick built from two CSS borders,
the unit after the length field is the letter `m`, and every control is labelled in language.
