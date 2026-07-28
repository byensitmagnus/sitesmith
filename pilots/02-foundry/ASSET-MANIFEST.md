# ASSET-MANIFEST — Marrow & Kell

| id | what | where | source | licence | state | focal | treatment |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `logo-primary` | The bell profile mirrored and reduced to a silhouette | header, footer, favicon | drawn for this project, `site/assets/mark.svg` | owned | ready | — | solid fill, currentColor |
| `favicon` | The mark at 32px | browser tab | derived from `logo-primary` | owned | ready | — | metal on near-black |
| `bell-profile` | Half-section, crown to lip, with the five partials at the heights they sound from | the standing left column on every page | drawn for this project, `site/assets/bell-profile.svg` | owned | ready | 50% 50% | line and 13% fill in currentColor, 1.7 stroke |

## Notes

**No photography, and it is not a substitute.** A bell in a tower can be photographed from
below, where you see the underside, or from the chamber, where you see the frame. Neither
shows the profile, which is the thing that makes one founder's bell sound unlike another's.
The half-section is the drawing the trade itself uses when a photograph will not do, and it
carries information a photograph could not.

**Inlined, not `<img src>`.** `currentColor` does not cross an `<img>` boundary, which is how
the same drawing is metal-on-black in the standing column and ink-on-paper in the print
stylesheet.

**One treatment.** Both drawings share stroke weight, fill opacity and the same construction:
the mark is the profile of the same bell, mirrored.
