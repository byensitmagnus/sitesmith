# Pilot 04, Byens IT

The first pilot built with `skills/sitesmith-v3`, and the first one whose subject is a
real company rather than an invented one. Byens it ApS, CVR 46491661, builds gaming PCs
and runs business IT support from Ternevej 7 in Frederiksværk, with a second location in
Vanløse.

| | |
| --- | --- |
| Surface | buy |
| Stack | static |
| Motion | level 1, scroll storytelling in CSS and JS |
| `verify.mjs` | exit 0, no blockers, no measured findings |
| `gate.mjs` | exit 0, every check ran and none refused |

## What it is not

Not deployed, not staged, not a proposal, and not a replacement for byens-it.dk. One
page, built only from facts published on the live site on 2 August 2026, to see what the
skill produces on a real subject.

## The one number that expires

"Gaming-pc'er fra 5.549 kr." is a campaign price. The page says so in the sentence
itself. It has to be rechecked before this is shown to anyone outside the company.

## A claim this file made and got wrong

An earlier version of this README said `byens-it.dk` renders "FREE SHIPPING FOR ALL
ORDERS OF $150" on the front page. It does not, and the correction is worth keeping
because of how the mistake happened.

The string is in the HTML. It is not on the page. It sits inside
`div.whb-row.whb-top-bar.whb-not-sticky-row`, which computes to `display: none` at both
1440px and 375px, so it has no client rects and no offset parent. It is a second,
switched-off top bar row left over in the Woodmart header builder. The row that actually
renders says "2 års garanti", "14 dages fortrydelsesret" and "Hurtig og sikker fragt".

The claim came from a markdown extraction of the page, which flattens the DOM and cannot
tell a hidden node from a visible one. This repository's whole argument is that a page is
what a browser draws, and the check was made against a text dump instead. Rendered and
verified at both widths before this paragraph was written.

## Files

- `index.html`, the page
- `.sitesmith/direction.md`, the autopilot page that was not built, three theses, and the record
- `PRODUCTION-REPORT.md`, sources for every claim, run notes, findings and their dispositions
- `ASSET-MANIFEST.md`, one drawing, no image files
- `shots/`, 375, 1440, the reduced-motion render, and the case with its panel off
