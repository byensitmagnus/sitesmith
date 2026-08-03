# The design contract

Open this after the direction record is filled and before the first line of the site is
written. It is the only file that turns the direction into values.

```bash
node <skill>/scripts/contract.mjs new <surface>     # the template, every field empty
# fill it
node <skill>/scripts/contract.mjs check --write     # measures every pair, writes CONTRACT.md
```

## Why it is not the direction record

The record explains the decision: three theses, the runner-up argued honestly, the risk and
its answer, the signature. That is the right shape for a decision, and nothing in it can be
compared against a build. A record can say *warm ground, one cold accent* while the page
ships its body text at 3.9:1, and the record is content and so is the gate.

The contract is the same decision as values. Which colour is the action. Which foreground
goes on which background, in which state, and what it measures. What the fallback stack is
when the webfont does not arrive. What the layout becomes at 375. Which selector the
keyboard reaches first. Every one of those is checkable, and `compare` checks them against
the page you actually built.

Do not restate the record here. A field that only repeats it is a field nobody will keep
current.

## Colour: the discovery does not change

Everything in `look.md` still holds and this file adds no shortcut to it.

- Colours come from the subject's **materials**. Each source names the material it was taken
  from. *The brand* is not a material; *linseed putty, about two weeks old* is.
- There is no palette for a trade. Two glaziers with different work get different pages, and
  a colour that arrived from a category table has no reason in it that anyone can read.
- There is no fixed count. Take the colours the subject has.
- Roles come **after** the colours, not before. You find what the thing is made of, then you
  decide which of those is the action.

The role names are fixed because a script has to check them, and only the names are fixed.
`background`, `foreground`, `action`, `onAction`, `focusRing` and `border` are owed by every
surface; `muted`, `accent`, `selection`, `destructive`, `onDestructive`, `success`,
`warning`, `surface` and `onSurface` when the page has them.

### Pairs, and why the contract asks for them

A colour has no contrast. A **pair** does. The contract asks which foreground sits on which
background, in which state, and what floor that pair owes, and then it measures every one of
them.

This is the check the browser pass cannot do. `verify.mjs` runs axe on the rendered page, so
it measures the pairs that were painted in the states the crawler reached. The pair that
fails is usually the one that only appears when a field is invalid, or when a button has
focus, and on a first render neither of those is on the screen.

**A translucent background is not a colour until you say what is behind it.** An error
message on a red at nine per cent, on a white at fifty-five per cent, on the page ground,
measures 1:1 written down and passes comfortably as painted. Give the pair a `backdrop`,
back to front, starting from something opaque. Without one the pair is refused rather than
guessed.

### States

`rest` and `focus` are owed by every surface. A page a keyboard can reach has a focus state
whether or not anyone chose one, and the one nobody chose is the browser's default ring on a
ground it was never picked against.

Every state also says **what carries it besides colour**. A border that thickens, a weight
that changes, a mark that appears, a position that moves. Colour alone is not a state for
anyone who cannot see the difference between the two colours.

### Light and dark

Answer from the use scene, not from habit. A page read once, in daylight, next to the broken
window it is about, does not owe a dark scheme. A page read at 02:00 by someone on call
does. Say which, and why, in `schemes.why`.

If you claim dark, the contract wants the pairs the dark scheme uses. A scheme claimed and
unpopulated is worse than one not claimed: it reads as covered.

## Typography: what the contract adds

The record names two faces. The contract asks the questions that decide whether they arrive.

- **Source and licence.** A licensed face with no licence recorded is not shippable, however
  good it looks.
- **The fallback stack**, ending in a generic family, and whether the first fallback is
  metrically compatible. `swap` with a metrically different fallback means the page reflows
  when the face lands, and that is a decision, not an accident.
- **Language coverage.** A Danish page needs ae, oe and aa in every face and every fallback.
  A page with a thousands separator needs to know whether 2.200 reads as two thousand two
  hundred.
- **The stress cases**, written before they are run: a heading three times its length, the
  page at 200 per cent zoom, the fallback stack with the webfont blocked. Write what you
  expect. Fill in the result afterwards. An empty result is honest; a wrong one is not.

## Layout: what the contract adds

`look.md` asks what owns the first screen. The contract asks what the page **becomes**.

- The **path**: the reading or task order, in one sentence.
- **Leading** and **supporting** elements, by selector. `compare` measures whether the
  leading ones are arranged differently at 375 and at 1440. Three widths that produce the
  same arrangement is a page that was designed once and allowed to reflow.
- **Responsive**: what the layout *is* at each of 375, 768 and 1440. Not "it stacks". If the
  drawing's annotation has to be redrawn at the small size, say so, because a drawing scaled
  down without redrawing its annotation is a drawing nobody can read.
- **Focus order**, by selector, in order. `compare` checks the tab order contains it, in that
  order. Anything else the page focuses is the page's business.
- **The squint test**, written down: with the page out of focus, what shape is left, and is
  that shape the argument. `compare` reports where the first screen's ink actually is, as a
  proxy, and never gates on it. A page can be right and fail it.

## What `compare` measures

```bash
node <skill>/scripts/contract.mjs compare --url <url> --write
```

Against a **served** build, not files on disk: a production build read through `file://`
cannot load its own stylesheets, and an unstyled document is not a design. The comparison
withholds rather than judging when that happens.

It checks that every primitive is declared on the page and renders as the contract's value,
that the first viewport object and the signature render and that the first is in the first
screen, that the focus order appears in the tab order, and that the layout genuinely changes
between 375 and 1440.

## It does not gate the run

`gate.mjs` is unchanged and this adds no refusal class to it. `contract.mjs check` refuses on
its own command, with exit 3, and the run continues or stops on the builder's judgement.

That is deliberate. `docs/GATE-POLICY.md` asks for a user-affecting defect, two independent
reproductions and a low-false-positive measurement before anything becomes a hard gate, and
the contract has one pilot behind it so far. It earns that or it does not.
