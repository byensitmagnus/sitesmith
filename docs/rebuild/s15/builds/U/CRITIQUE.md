# CRITIQUE — Klinke & Datter

> Run after the technical gate went green, on the screenshots in `.sitesmith/shots/`, at 1440,
> 768 and 375 in both colour schemes. `(C)` — AI-generated working document.

## What this is and is not

`50-critique.md` asks for **two independent reviewers, assignment-blinded, locked before the
key is opened.** That ceremony did not run. This build had one builder and no second party, so
what follows is one named self-critique on the rendered screenshots, and the gate's pass
condition — *median production-readiness ≥ 8 across two blinded reviewers* — **cannot be
claimed**. Saying otherwise would be the exact failure the ceremony exists to prevent: the
person who made the page finding reasons for it to be better.

The scores below are therefore evidence, not a verdict.

## The primary criticism, before the scores

> **The drawing the whole mechanism section rests on is schematic to the point where a reader
> who has never seen inside a player piano may not be able to map it onto the instrument in
> their living room.**

It is a correct diagram and it is drawn to one treatment, but it is a chain of abstract shapes:
the striker pneumatic reads as a triangle, the hammer as a small rectangle, and the string as a
line at the right edge that is easy to miss entirely at 340px. The five numerals do their job —
they turn five unfamiliar words into five places — and that is why the section works at all.
What it does not yet do is *look like the inside of a piano*, and the page's whole argument for
spending 1.850 kr. is that the interior is knowable.

That is not the generic-template answer, which is the other thing this test is for.

## Scores

| # | Criterion | Score | The specific thing |
| --- | --- | --- | --- |
| 1 | Direction | 8 | One legible argument in the first screen: punched paper down the side, a serif statement against it, one red action. Describable in a sentence that is not a list of components. Held back from 9 because the direction is carried almost entirely by one device; remove the rail and the remaining page is a well-set document with no particular allegiance. |
| 2 | Specificity to the subject | 9 | With the wordmark and copy removed, the punched band and the pneumatic section still could not be another trade. The one thing keeping it from 10: the buff-and-ink palette on its own would suit a bookbinder. |
| 3 | Type | 7 | Fraunces over IBM Plex Sans is a chosen pair, not an inherited stack, and the scale is used hard — four sizes carry the whole page. But apart from the tracked numerals there is nothing in the *setting* that would be recognisable with the words removed; the headings are simply well set. |
| 4 | Colour and ground | 8 | The ground is roll paper and the accent is action felt, both traceable to `EVIDENCE.md` §4, and the accent appears exactly three times. Marked down because the dark scheme has to lift the felt red to a terracotta `#e2836a` to clear AA, and at that point it reads as a different, warmer brand. |
| 5 | Assets and craft | 7 | Two drawings, one treatment, one stroke weight, correct at all three widths, and a mark that is a wordmark rather than a coloured square. The drawing is the weak one — see the primary criticism — and the wordmark's only authored move is the dropped ampersand, which is modest. |
| 6 | Hierarchy and rhythm | 7 | Squinting at 1440, the headline is clearly first and the red action second. The hanging numerals give the page a left margin that reads as an index, and the drawing block breaking out into that margin is the one wide moment. Still: five of six sections are the same shape — heading, then a column of prose at the same measure — so the rhythm below the fold is carried by spacing alone. |
| 7 | Production-readiness | 8 | I would put this in front of this client's customers. The two things I would apologise for are the drawing and the fact that section 03 is three undifferentiated paragraphs. |

No criterion scored 1–3.

## What I would do next, in order

1. **Redraw `snit-pneumatik` closer to the object.** Give the case an outline, put the keyboard
   and one hammer in recognisable proportion, and let the reader find the front of their own
   instrument in it. This is criterion 5 and it points back to `24-asset-plan.md`, not to the
   direction lab — the plan for the picture was right and the execution is thin.
2. **Give section 03 a shape.** Verner's 1981 and Liv's 2011 are the only two dates on the page
   and they are buried mid-paragraph. Two figures set in the margin next to the prose would use
   the index column that already exists.
3. **Vary the rail.** It is one texture at one density for 7,000px. A real roll's punch pattern
   changes with the music; this one does not change with the argument.

## The five readings from `00-done.md`

1. **Squint at 1440.** The headline is first, and only it. The red call button is the heaviest
   interactive element on the screen. Pass.
2. **Delete every image and panel.** The argument survives in plain text: what they repair, what
   they do not, the five things that usually fail and what each part does, who the two people
   are, the wait, what an assessment costs and what you get for it, and the number to ring. This
   was the test the direction was chosen against and it is the one it passes most clearly.
3. **Open page two.** There is no page two. The rail, the hanging numerals and the paper ground
   are what would carry it, and `DESIGN-SYSTEM.md` §2 states the header and footer contract so
   that page two does not re-solve them. Untested, and honestly so.
4. **Point at any number.** 1.850, 340, 38, four to nine months, four instruments, 1981, 2011,
   66 12 47 09, 09:00–16:00, Havnegade 22, 5000 — every one is a line in the sealed brief. There
   is no number on the page that is not.
5. **Tab through the primary task.** Skip link, wordmark, five section links, call action. The
   focus ring is one treatment and it is visible on all of them. `journeys/ring-op.spec.mjs`
   asserts this at 375 and 1440 rather than my having looked once.
