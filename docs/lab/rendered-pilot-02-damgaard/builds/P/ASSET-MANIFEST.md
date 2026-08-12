# Asset manifest — Damgaard Estrik

No photography exists and none may be implied to exist (brief, hard constraint). Every
non-text asset below is drawn for this project as inline SVG, themed with the colour
tokens so it renders correctly in both colour schemes.

| id | what | where | source | licence | state | focal | treatment |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `mark-depth` | Small drawn mark: a vertical hairline with a tick at 40% height, referencing the borehole-depth rule | header, footer | drawn for this project (inline SVG) | owned | **ready** | — | 1.5px stroke, `--ink`/`--accent` |
| `wordmark` | "Damgaard Estrik" set in the display face | header, footer | drawn for this project (CSS type, no image file) | owned | **ready** | — | `--font-display`, weight 700 |
| `favicon` | `mark-depth`, simplified to a 32px square | browser tab | derived from `mark-depth` | owned | **ready** | — | ink on paper, single colour |
| `diagram-depth` | Cross-section of a floor construction with the borehole and the 40%-of-depth measuring point marked | `/`, `/priser` | drawn for this project (inline SVG), values from `BRIEF.md` §"Tider og måletal" | owned | **ready** | — | line art, 1.5px stroke, `--accent` marks the read value |
| `diagram-timeline` | Horizontal axis, 18–45 døgn, measured every 7. døgn, with the three drying thresholds (trægulv 65% RF, klinker 85% RF, cementestrik 2,0 CM%) marked | `/`, `/priser` | drawn for this project (inline SVG), values from `BRIEF.md` §"Tider og måletal" | owned | **ready** | — | line art, matches `diagram-depth` |
| `diagram-area` | Concentric rings from Lemvig: 40 km (included driving) and 75 km (service limit, 14 kr/km surcharge zone between them) | `/`, `/priser` | drawn for this project (inline SVG), values from `BRIEF.md` §"Virksomheden" | owned | **ready** | — | line art, matches the other two diagrams |

No row is `needed` or `substitute` — every asset the built site references exists in the
repository as inline SVG at the point this manifest is written, matched by `data-asset`
attributes in the markup.
