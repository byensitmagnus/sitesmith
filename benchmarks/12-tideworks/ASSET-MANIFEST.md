# ASSET-MANIFEST — Tideworks duty board

Every non-text thing the board needs. Three rows, and that is the whole list: `EVIDENCE.md`
section 7 records that no photography exists, none is owned and none is needed, and
`DIRECTION.md` declares `imagery: deliberately imageless`. What each one is *for* is in
`ASSET-PLAN.md`; this file is the record of what it is, where it came from and whether it
exists.

| id | what | where | source | licence | state | focal | treatment |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `tide-window-instrument` | Six-lane tide-window ruler: 01:00–09:30 axis, one lane per lock ordered by when its window shuts, each window drawn as an elapsed 4px line plus a remaining 14px solid bar, cut by a 2px "now" rule at 04:40 and a dashed high-water rule at 05:12 | board, directly under the status line | drawn for this project in HTML and CSS from the figures in `EVIDENCE.md` section 8; no image file, no SVG — percentages are computed from the brief's window times | owned | **ready** | 43% (the "now" rule — it survives every crop and every width) | flat, no radius, no shadow; bar colour is the lock's state (`--go` open, `--warn` closing) and is always paired with the word in the lock table; at widths under 720px the lane label moves above its own track and the ruler keeps full width |
| `mark-tideworks` | Wordmark TIDEWORKS at 13px with 0.18em tracking, preceded by a 24px drawn glyph: the board's own instrument in miniature — a thin elapsed line, a 2px "now" rule, a solid remaining bar | chrome bar, left, once per page | drawn for this project; inline SVG, `currentColor` for the two strokes and `--accent` for the bar, `aria-hidden` beside the word it labels | owned | **ready** | — | single weight, no fill on the strokes, no roundel, no container; the bar takes the accent so the mark carries the same one colour the board reserves for "workable now" |
| `favicon` | The same three-stroke glyph at 32×32, without the wordmark | browser tab | derived from `mark-tideworks`; `site/favicon.svg` | owned | **ready** | — | fixed colours rather than tokens, because a favicon file has no access to the sheet: the night ground, paper-white "now" rule, signal-green bar |

## Notes

- **No `<img>` on this page, and one `<svg>`** — the mark's glyph, which is `aria-hidden`
  because the word beside it is the accessible name. The instrument is HTML and CSS, so it
  reflows rather than scaling, and it carries `data-asset="tide-window-instrument"` on its
  `<figure>` so the row and the rendered element can be matched by hand.
- **No borrowed marks.** No customer, partner or certification logo appears, because
  `EVIDENCE.md` names nobody who lent one. There is no logo wall and there is no substitute
  for one.
- **Nothing is `needed` or `substitute`.** All three rows exist in the repository.
