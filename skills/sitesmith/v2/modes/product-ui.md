# Mode P — product UI

> Original work, MIT. Dashboards, admin, consoles, multi-step forms, data entry. The visitor
> already committed. They are at work, they will see this screen a thousand times, and every
> decoration costs them a little each time.

Twelve decisions. Each is an answer, not a range.

---

## Contents

- [1. Argument shape](#1-argument-shape)
- [2. Hero family](#2-hero-family)
- [3. Density](#3-density)
- [4. Radius](#4-radius)
- [5. Imagery](#5-imagery)
- [6. Motion](#6-motion)
- [7. Colour emphasis](#7-colour-emphasis)
- [8. Proof](#8-proof)
- [9. Navigation](#9-navigation)
- [10. The primary action](#10-the-primary-action)
- [11. Content density](#11-content-density)
- [12. Failure modes](#12-failure-modes)

---

## 1. Argument shape

There is no argument. There is a **task**, and the screen is judged by how fast it completes.

1. **Where am I** — one line: the object, its state, and the one number that decides urgency.
2. **What needs deciding** — the exceptions first. A screen that shows everything equally has
   sorted nothing.
3. **The work surface** — the table, the form, the queue.
4. **What it reconciles to** — totals, counts, what remains. A grid without a reconciliation
   makes the user do arithmetic.
5. **How to act on it** — actions where the thing is, not in a toolbar three sections away.

**Multi-step form:** one question group per step, a visible position in the sequence, an
error summary before the fields, and a review step that shows every answer with a route back
to each.

## 2. Hero family

**None.** A cinematic hero on a dashboard is the clearest sign the wrong governance model was
applied. The first 46 to 64 pixels are a chrome bar carrying identity, context and state;
work starts immediately under it.

The nearest equivalent to a hero is the **status line**: object, state, and the number that
decides whether this screen needs attention now.

## 3. Density

**Tight, deliberately.** Base type 13–14px. Rows 28–34px. Spacing step **4px**, not 8 — a
30px row cannot afford an 8px ramp.

The ramp is the same ramp as everywhere else in the contract; density is which end of it is
in play. `--space-2` to `--space-5` here, where marketing lives at `--space-6` to `--space-9`.

Type scale ratio **1.2**. Many sizes, close together, most of them small.

Figures are tabular everywhere they are compared. A column that shifts under its own digits
is unreadable at this size.

## 4. Radius

**Minimal.** `--radius-inner: 3px`, `--radius-outer: 6px`, or `0` for both in a genuinely
utilitarian tool. At a 30px row height, an 8px radius eats the corner of the content.

Full-round only for status dots. A pill in a data grid reads as a control that can be
clicked, so it must be one.

## 5. Imagery

**Almost none.** Avatars, a brand mark, and thumbnails where identifying an item visually is
the task — a product row, an uploaded file, a photo attached to a report.

No decorative illustration. The one legitimate exception is the empty state, where a small
neutral glyph gives the message somewhere to sit, and even there the words do the work.

Charts are not imagery; they are data, and they follow the UX rules for charts:
keyboard-reachable, not colour-only, and labelled.

## 6. Motion

**Effectively none, and none at all during entry.**

- State change feedback only: a row saving, a value committing, a panel opening.
  `--motion-fast`, under 120ms.
- **Nothing animates while the user is typing or counting.** This is absolute in this mode.
- Loading states are required wherever an action takes more than 100ms, and they are
  specific: a skeleton that matches the shape of what is coming, not a spinner over the whole
  screen.
- No scroll-driven anything.

## 7. Colour emphasis

**One accent for the primary action and the current item. Semantic colour is a full,
separate group and it carries information.**

This is the mode where the one-accent rule is most often misread. A queue that marks rows
saved, needs-a-reason and to-count has not broken the rule three times; it has used three
semantic colours, which are declared separately in the contract from `--accent`.

Requirements on semantic colour here:

- Each state has a word as well as a colour. Colour-blind users are over-represented among
  people who read dashboards all day.
- Each clears AA against every surface it appears on, in both schemes.
- A signal colour that is legible on a dark chrome bar is often illegible as text on paper.
  Declare both — a saturated fill colour and a darkened text colour — and say which is which.

The rest of the screen is neutral. Colour in this mode is a scarce signal, and a decorative
use of it costs a real one.

## 8. Proof

Not applicable in the marketing sense. What replaces it is **legibility of state**:

- What was saved, and when.
- What is pending, and what will happen if the user leaves.
- What failed, why, and what to do.
- Whether the number on screen is current, and as of when.

A dashboard that cannot say how fresh its data is has an unanswerable trust problem.

## 9. Navigation

**Persistent, shallow, and out of the way.** Two levels at most. A top bar or a left rail —
pick one and keep it on every screen.

A rail is right when there are many destinations and the user moves between them constantly.
A top bar is right when there are few and the work surface needs the width.

Keyboard access to navigation is required, not optional. A power user should reach any
section without the mouse, and the shortcut should be visible somewhere — a shortcut nobody
can see is a shortcut nobody uses.

Below 960px the rail collapses; it does not disappear.

## 10. The primary action

**Where the work is.** Row actions on the row, form actions at the end of the form, bulk
actions in a bar that appears above the data when a selection exists — not floating over it.

The primary action states its consequence and its blockers: "Book in (2 lines unresolved)" is
better than a disabled button with no explanation. **A disabled control says why, or is not
disabled.**

Destructive actions are separated from constructive ones by position, not only by colour, and
they confirm.

## 11. Content density

**High, and complete.** Show every row, every column that matters, every specification. This
is the opposite of marketing: the user came for the data and hiding it to keep the screen calm
is a disservice.

Prose is minimal — a line of context, an error message, a note about what saving does.
Everything else is data and labels.

Where there is genuinely too much, the answer is filtering and sorting the user controls, not
a curated subset chosen by the designer.

## 12. Failure modes

1. **Marketing governance applied to a working screen.** A hero, generous spacing, an
   illustration, six rows of data. Every one of those is a decision borrowed from a page kind
   whose visitor had not decided yet.
2. **States missing.** Empty, error, partial and loading are the states this mode hits on day
   one, and they are the first thing generated work leaves out. `blocks/feedback/empty-state`
   exists because of exactly this.
3. **Keyboard path incomplete.** A scroller that no key reaches, a grid that cannot be
   traversed, a shortcut that exists and is documented nowhere. Nothing looks wrong at any
   width, and the screen is unusable to the person who lives in it.
