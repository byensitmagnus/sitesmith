# DESIGN-SYSTEM — Stalbridge cask desk

> Written **from direction A**. Every value answers one fact from `EVIDENCE.md` section 3:
> this screen is read standing up, from about four feet, in gloves, in poor light, with a
> dray waiting.

## 1. Ground and colour

Near-black with one amber. The amber is the only warm thing on the screen and it marks the
one thing the cellar is tracking — stock that is still out. Red is reserved for late, and
appears nowhere else, which matches the one colour that already means something in this
world: a condemned cask tag.

**Colour is never the whole signal.** Every state is also a word in a bordered chip. That is
anti-reference 2 and it is a hard rule here, not a preference.

## 2. Type

One family, four sizes, and the figures are large. Body text is 18px, not 16, because 16px at
four feet is a smudge. Cask counts are 26px mono; they are the number the cellarman is
actually reading.

There is no display face and no second family. A console that introduces a serif is a console
that has forgotten what it is for.

## 3. Space and hands

An 8px ramp, used at its tight end inside a row and its open end between sections — mode P's
density outcome is that a working unit of the job fits on screen, and here that unit is every
consignment still out.

**Every interactive control is at least 48px tall.** That is not a token, it is a floor, and
the journey asserts it.

## 4. Edge, elevation, motion

`--radius-edge: 3px` — just enough to read as a control rather than a table cell, and not
enough to look like a card. There are no cards on this screen.

`--elev-0: none`. Separation is a rule. A shadow on a dark ground at four feet is invisible.

Motion: a border colour on hover, 100ms. Nothing else moves. A screen in a cellar with a dray
waiting is not the place for a transition, and hover is not available on a wall mount anyway.

## 5. Documented one-offs

| Value | Where | Why |
| --- | --- | --- |
| `48px` | minimum height of every control | Gloves. A hand in a wet cellar glove is not a mouse pointer. |
| `3px` | focus outline | Thicker than the 2px elsewhere, for the same reason the type is larger. |
| `2px` | every border on a chip, a filter and a field | 1px disappears at four feet under a cellar light. This is the only site of the three where a hairline would be a defect. |

## 6. Header and footer contract

**Header** is a status line, not a hero: who this is, what day and shift it is, when the dray
arrives, and how many casks are out. Mode P's first-screen outcome is that the operator can
tell within a second whether the screen needs them, and that number is the answer.

**Footer** is one paragraph declaring that the brewery and the accounts are invented and the
duty rules are not.

## 7. Components and states

| Component | States |
| --- | --- |
| Filter button | unpressed, pressed, focus |
| Board row | on trade, due today, overdue, focus-within |
| Book-in panel | closed, open, blocked with a reason, ready |
| Count field | valid, above what went out |
| Ullage field | hidden, shown, empty, out of range |
| Board | populated, filtered to nothing, cellar clear |

## 8. The contract, in one block

```css contract
:root{
  --bg:#0e1012; --surface:#15181b; --surface-2:#1c2126; --surface-3:#242b31;
  --ink:#eceff1; --ink-2:#a4adb5; --ink-3:#8a939b;
  --line:#262b30; --line-2:#39424a;
  --accent:#f0a92c; --on-accent:#171308; --accent-soft:#33270f;
  --bad:#ff8168; --bad-soft:#331812; --ok:#7fd18d; --ok-soft:#12291a; --focus:#f0a92c;

  --font-body:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
  --font-display:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
  --font-mono:ui-monospace,'SF Mono','Cascadia Mono','Segoe UI Mono',monospace;
  --text-micro:.75rem; --text-small:.9375rem; --text-body:1.125rem;
  --text-figure:1.625rem; --text-h2:1.25rem;
  --leading-body:1.4; --measure:62ch;

  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px;
  --space-5:24px; --space-6:32px; --space-7:48px; --space-8:72px;
  --container:1500px; --gutter:26px;

  --radius-edge:3px;
  --elev-0:none;
  --motion-fast:100ms; --ease:cubic-bezier(.2,.6,.2,1);
}
@media (prefers-color-scheme:light){
  :root{
    --bg:#eceef0; --surface:#fbfbfc; --surface-2:#f1f3f5; --surface-3:#e4e8ea;
    --ink:#12161a; --ink-2:#4a525a; --ink-3:#586069; --line:#d2d7db; --line-2:#b4bcc3;
    --accent:#7a4d00; --on-accent:#ffffff; --accent-soft:#f7ecd6;
    --bad:#8f2711; --bad-soft:#f7e2dd; --ok:#1f5e2c; --ok-soft:#e0efe3; --focus:#12161a;
  }
}
```
