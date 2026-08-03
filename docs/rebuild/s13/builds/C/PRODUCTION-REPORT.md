# Production report

Build: Orgelværkstedet Hvidbjerg, forsiden.
Target: `docs/rebuild/s13/builds/C/index.html`, one self-contained file, no build step.

- Scenario: read
- draft: no
- release: no

`stack.mjs detect` named no adapter, so run.md section 12 governs and the stack is plain
HTML and CSS. That is also what the brief asked for.

## Files opened

- `SKILL.md`
- `run.md`
- `stacks/static.md`
- `verify.md`
- `scripts/ledger.mjs`
- `scripts/gate.mjs`

Run.md step 5 selects the floor file from what the visitor is doing. This visitor is a
parish council reading and deciding, not buying at a price and not operating a tool, so
step 5 selects nothing and sections 1 to 8 of SKILL.md are the whole instruction. Neither
`floor/buy.md` nor `floor/operate.md` was opened, and neither is declared for this
scenario.

The brief at `docs/rebuild/s11/briefs/C-orgler.md` was read. Nothing else under
`docs/rebuild/` was opened.

## Run notes

- viewports: 375, 768 and 1440 rendered by `scripts/verify.mjs` against a local server, all HTTP 200. 320 and 1440 additionally rendered by hand for the horizontal-overflow measurement. Screenshots written to the scratchpad `verify/` directory.
- axe both schemes: ran in light and dark, 0 violations and 0 serious or critical in both. The page declares `color-scheme: light` and paints one fixed palette, so both schemes render the same document; the dark pass is therefore a check that nothing depends on a scheme rather than a check of a second design.
- live server: reachable. A minimal static server on 127.0.0.1:8799 served the build directory, because `verify.mjs` refuses a `file:` origin. First attempt used port 8791 and returned 404 from a stale listener left by an earlier `npx http-server`; the port was changed and the run repeated.
- anti-slop linter: ran as `scripts/gate.mjs`, which carries the antipattern detector, the em dash ban, the honesty checks and token drift. Result recorded under Mechanical findings.
- fallbacks: none. Every step ran on this host.

`scripts/journey.mjs` is listed in `verify.md` and does not exist in
`skills/sitesmith-v3/scripts/`. It was not run and no journey was written. This surface is
a reading surface with no form, no state change and nothing to announce, so there is no
path that could assert the four things a journey owes. Recorded here rather than reported
as a pass or a silent skip.

## Commands run

```text
node scripts/stack.mjs detect <build>                      no adapter named
node scripts/ledger.mjs new <build> read                   wrote 19 empty headings
node scripts/ledger.mjs parse <build>                      complete
node scripts/verify.mjs http://127.0.0.1:8799/ --out ...    PASS, nothing blocking
node scripts/ledger.mjs check <build> --ledger <ledger>    refused once, then passed
node scripts/ledger.mjs commit <build> --ledger <ledger>   recorded
node scripts/gate.mjs <build> --skill <skill>              see Mechanical findings
```

## The direction, as `ledger.mjs parse` reads it

```text
thesis 1: Et snit gennem instrumentet: siden åbner orglet og følger vinden fra bælg til
          pibemund, og hver slags arbejde ligger der hvor den fysisk foregår.
thesis 2: En tilstandsrapport skrevet før nogen har bestilt noget: siden er den genstand
          rådet får efter det gratis besøg, og den sælger ved at vise sagen frem i stedet
          for at beskrive den.
thesis 3: Fire pladser om året: siden er en kalender, hvor tid er materialet og alt andet
          er en fodnote.
built: thesis 2 on the axis of how much of the page is made of things only these two
       people have
reason: the report and the refusal are theirs while a cutaway of an organ belongs to the
        whole trade
runner-up argued: thesis 1
signature: `.bælgelæder`, a piece of tawed bellows skin cut by hand and laid on the
           casting bench
risk: the ground is mid-dark cast metal where the category is warm paper
originality pass: both swaps changed something; the second changed the page's order to
                  the path of the wind
```

## Mechanical findings

- `ledger/accent-hue-veto`: the first render was refused. The emphatic accent `--mønje` #8b1f26 at hue 356 measured 10 degrees from a record already in the ledger, and 20 degrees is the arc the ledger refuses. The ground, at hue 219 in the mid-dark band, was not refused.
- `verify/duplicate-label`: two controls carry the label "Ring 97 87 12 06", at 375, 768 and 1440.
- `verify/same-target-different-labels`: three controls resolve to `tel:+4597871206` with two different labels, at 375, 768 and 1440.
- `verify/tap-target-under-44`: three controls measured under the 44px floor before the fix, the brand link at 41px and two inline links at 16px.
- `verify/target-spacing-under-24`: nine pairs of adjacent targets measured under the 24px floor before the fix, all of them in the header.
- `verify/control-label-wraps`: the link "Læs om første besøg" wrapped onto two lines at 768 and 1440 before the fix.
- `gate/clean`: `scripts/gate.mjs` reported no refusal. See Reconciliation for what it measured and did not gate.

## Reconciliation

The judgement below was formed from the rendered page before the checker output was read,
and every mechanical finding is dispositioned.

- `ledger/accent-hue-veto`: confirmed. The refusal was acted on, not argued with. Red lead was removed from the palette entirely and replaced from the same noun list by `--klæde` #17603a, the green wool baize that goes under the keys and along the joints. Its contrast was measured from scratch: 4.8:1 on the leather it sits on and 2.5:1 on the metal bench, so it never touches the bench. One further line changed as a consequence, `.dæk nav a:active`, which had been taking the accent as text on the metal at 2.5:1 and now takes the dark of the case at 5.1:1. The record carries the whole account under Originality pass.
- `verify/tap-target-under-44`: confirmed and fixed. The brand link now has `padding-block: 0.6rem` and `min-height: 44px`. The link "Læs om første besøg" was moved out of the middle of a sentence onto its own line as an inline-block with `padding-block: 0.8rem`, which fixed its height and its two-line wrap at the same time. The telephone number in the footer was made plain text, because the same number is already a control twice above it and a third control inside a sentence was redundancy rather than access. Re-measured: zero controls under 44px at any of the three widths.
- `verify/target-spacing-under-24`: confirmed and fixed. The header row gap went from `0.6rem` to `1.5rem` and the nav row gap from `0.1rem` to `1.5rem`, and the nav column gap floor from `0.9rem` to `1.6rem`. Re-measured: zero pairs under 24px at any of the three widths.
- `verify/control-label-wraps`: confirmed and fixed by the same change that fixed the tap target. Re-measured: gone at all three widths.
- `verify/duplicate-label`: false-positive. reason: the two controls carrying "Ring 97 87 12 06" are the same action offered at the two points where the reader decides, the first screen and the section about the free visit, and SKILL.md section 7 requires a control to keep the same word all the way through. Giving the second one a different label to satisfy a uniqueness count would break the rule the label is obeying.
- `verify/same-target-different-labels`: false-positive. reason: two of the three are controls and say "Ring 97 87 12 06". The third is not a second phrasing of a control, it is the telephone number itself as the value of a definition list whose term is "Telefon", where the accessible name in context is the number. Prefixing it with a verb would make the contact list read as a row of buttons rather than as an address.
- `gate/clean`: confirmed. Nothing to disposition.

## The design record, written from the shipped stylesheet

Not from `.sitesmith/direction.md`. This is what the code does.

**Ground.** `body` paints `--orgelmetal` #8b9099, relative luminance 0.277, which the
ledger files as the mid-dark band at hue 219. Over it are four `radial-gradient` layers at
tile sizes 743x617, 611x523, 877x719 and 691x587 pixels, whose sizes share no common
divisor so the repeat does not fall inside a page, plus a `repeating-linear-gradient` of
one-pixel scratches at 24 degrees. The darkest tile is `rgba(88,93,99,.10)`, which takes
the local ground to about luminance 0.257 in the worst case, where pencil ink still
measures 4.9:1.

**Ink.** `--blyant` #1b1e23 on the ground at 5.2:1 and on the leather at 10.7:1.

**Panels.** `.bælgelæder` #dccdb0 with a two-layer speckle at 13x11 and 17x14 pixel tiles
for the pores, two very faint large clouds for a light and a dark side, a `clip-path`
polygon per panel with edge deviations under one percent, and a `filter: drop-shadow` on
the wrapper because `clip-path` clips a `box-shadow` away. A ten-pixel strip of `--klæde`
runs along the lower edge inside the clip, so it is cut by the same edge as the skin.

**Emphatic accent.** `--klæde` #17603a. It appears as the strip on every panel, the
telephone button, the rule under every section eyebrow and the underline colour of the one
secondary link. It never appears on the metal ground, where it measures 2.5:1.

**Second saturated value.** `--hudlim` #a1712c, used only as a rule on the dark bands at
3.8:1 and as the glue seam inside the drawing. It carries no prose anywhere.

**Type.** Display is Grenze at 400, and 500 on the h1. Body is Archivo at 400, 500 and
700. Sizes are custom properties, mostly `clamp`, and no size is a literal at a call site.
There is no `text-transform: uppercase` and no `letter-spacing` anywhere in the sheet.

**Corners and shadows.** No `border-radius` is declared anywhere. Two shadows exist: the
hard `5px 5px 0` offset under the telephone button, which reads as a plate resting on the
bench, and the drop shadow under each leather panel.

**Motion.** One `@keyframes`, a 1.4 degree rotation of the fold group inside the drawing
over nine seconds, declared only inside `@media (prefers-reduced-motion: no-preference)`,
so under `reduce` the animation does not exist rather than being hidden.

**Divergences from the plan.** Two. The accent is green baize and not red lead, for the
reason under `ledger/accent-hue-veto`. And the drawing's crease is the dark of the case
rather than hide-glue amber, because amber on leather measures 2.7:1 and the crease is
what makes the drawing readable as a fold; the amber moved to the glue seam along the
lower edge, where it is a detail rather than the thing that carries the shape. The record
was corrected to match the code rather than the other way round.

**Defects this build carries, not rules the next build inherits.** None from section 5 of
SKILL.md shipped. The autopilot recipe was written down first and none of it survived: the
ground is not paper, there are no hairline rules, no uppercase, no tabular figures, no
card grid, no numbered steps, no stroke-only drawing, and a shadow exists.

## The state roster

Walked against the built page, not the plan.

- **Rest, hover, focus-visible, active:** present on every link and on both telephone buttons. Hover is never the only affordance: every control is also underlined, filled or ruled at rest. Focus-visible is a 3px `--blyant` outline with a 4px offset on the light ground, measuring 5.2:1 against the metal and 10.7:1 against the leather, and a `--bælgelæder` outline on the dark bands at 10.3:1. The keyboard sweep found 10 stops at each of the three widths.
- **Disabled:** does not exist, and none was invented. There is no control on this page that can be unavailable. A styled element carrying no `disabled` attribute would be the bug this state exists to prevent.
- **Loading:** does not exist. The page has no JavaScript, no fetch and no navigation that waits. Nothing moves between an intent and its result: a telephone link resolves immediately.
- **Empty:** does not exist as a runtime state. The page has no list that can arrive empty, no search and no user content.
- **Error:** does not exist. There is no input and therefore no trust boundary and no failure path. This is a consequence of the brief supplying no email address, which is recorded as an assumption in the direction record rather than solved with an invented recipient.
- **Partial:** the only external resource is the two web fonts. They are loaded with `display: swap` and the stack falls back to Georgia and Helvetica, so a partial arrival renders the whole page in the fallback faces with the layout intact.

## Claims audit

Every sentence on the page was tested against the brief. What appears:

Two people, Aase and Thorbjørn. Together since 1998. Four or five instruments a year. A
full restoration over eight to eighteen months. The five kinds of work, named exactly as
the brief names them. That they do not install electronic organs and say so. That the
first visit is free and takes half a day. That a condition report is written afterwards
whether or not the job goes ahead. Hvidbjerg in Thy, travelling anywhere in Denmark.
Telephone 97 87 12 06. Kirkevej 4, 7790 Hvidbjerg.

What was cut for having no source: any description of what the condition report contains,
any lead time to a first visit, any price or travel charge, any statement about what a
customer may do while they wait, any outcome claimed for any of the five operations, and
any sub-copy under the work list at all. The five items ship as bare names because the
alternative was inventing what each one involves.

The page carries no proof section, no testimonial, no certification and no logo wall,
because none was supplied. It has no contact form, because no address exists to send one
to, and it says so in plain words rather than leaving the absence unexplained.

## Unresolved

- `journeys/`: no journey was written and `scripts/journey.mjs` does not exist in this package. Reasoning above under Run notes. If a journey is required for this surface, the surface has no qualifying path and the requirement would have to be satisfied by adding an interaction the brief does not ask for.
- The drawing's fold reads as a folded corner of skin at 1440 and 768. At 375 it is small enough that the fold shadow and the crease merge into one dark diagonal. Two edit attempts were spent on this element, so it ships as it is rather than a third.
