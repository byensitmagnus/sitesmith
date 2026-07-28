# ASSET-MANIFEST — Trelfall & Son

Every non-text thing the site needs. Nothing ships unless its state is `ready`.

| id | what | where | source | licence | state | focal | treatment |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `logo-primary` | Three strands in a right-hand lay; the mark of a three-strand rope seen from the side | header, footer, favicon | drawn for this project, `site/assets/logo.svg` | owned | ready | — | ink, single colour, 1.7 stroke |
| `favicon` | The mark at 32px | browser tab | derived from `logo-primary` | owned | ready | — | ink on paper |
| `metre-rule` | Boxwood bench rule, graduated in centimetres, brass end-cap worn | above the catalogue, full width | drawn for this project, `site/assets/metre-rule.svg` | owned | ready | 0% 50% | line and 7% fill in currentColor, 1.5 stroke |
| `sec-three-strand` | Cross-section, three-strand: three laid strands, yarn twist visible | catalogue row, product page | drawn for this project | owned | ready | 50% 50% | line drawing, currentColor, 1.4 stroke, 120 viewBox |
| `sec-double-braid` | Cross-section, double braid: braided cover over braided core | catalogue row, product page | drawn for this project | owned | ready | 50% 50% | as above |
| `sec-kernmantle` | Cross-section, kernmantle: woven sheath over parallel core fibres | catalogue row, product page | drawn for this project | owned | ready | 50% 50% | as above |
| `sec-eight-plait` | Cross-section, eight-plait: four pairs plaited square | catalogue row, product page | drawn for this project | owned | ready | 50% 50% | as above |

## Notes

**No photography.** The subject is fictional, so no honest photograph of its stock exists and
none was invented. This is not a substitute: a chandler's catalogue shows constructions as
drawings because a photograph of a coil of blue rope tells a buyer nothing about whether it
is spliceable, and the drawing tells them in one glance. It is the trade's own convention.

**The drawings are inlined, not `<img src>`.** `currentColor` does not inherit across an
`<img>` boundary, so an external SVG drawn in `currentColor` renders black wherever it is
placed. Inlining also lets one drawing be ink-on-paper in the table and paper-on-ink in the
order summary without a second file.

**The rule is the shop's instrument, not an ornament.** Rope is sold by the metre; every
price in the catalogue is a price per one of these. It runs the full width above the table
because that is what it does on the bench.

**Treatment is one treatment.** All four sections share viewBox, stroke weight, opacity ramp
and the same 52 px outer radius, so they read as one set rather than four illustrations.
