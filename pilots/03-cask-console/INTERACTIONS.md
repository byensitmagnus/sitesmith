# INTERACTIONS — Stalbridge cask desk

## Primary actions

| action | where | on success | on failure | reversible |
| --- | --- | --- | --- | --- |
| Filter the board | the three buttons | the board narrows, the caption recounts, the pressed button says so with `aria-pressed` | a filter that matches nothing shows an empty state saying where the rest went | yes |
| Book a consignment in | any row | the count comes down, the consignment leaves the board when it reaches zero, a `role=status` line names the casks, the pub, the ullage and the wash, and the row appears in the week log | see below | no — it is a duty record |
| Record ullage | inside the panel, when the condition is *wet* | the confirm button enables | blocked with a reason: a wet cask is not empty and duty is worked out from the ullage | yes, before confirming |

## States per surface

**Board row** — on trade, due today, overdue; each written as a word inside a bordered chip.
Never colour alone: a red row means nothing under a cellar light through a scratched screen,
and nothing at all to a colourblind cellarman.

**Booking panel** — closed; open with the full count pre-filled; ullage hidden until the
condition is *wet*; blocked with a reason; ready.

**Count field** — valid, or above what went out, which is refused with the real number in the
message rather than "invalid".

**Board** — populated; filtered to nothing, which says where the rest are; and empty, which
says the cellar is clear and what will fill it again. All three are reachable from the real
data on the page: the empty state is reached by booking every consignment in.

## Keyboard, focus and hands

- Every control is at least 48px tall. The team wears gloves.
- **Nothing depends on hover.** Hover changes a border and nothing else, because a
  wall-mounted screen has no pointer.
- Opening a panel moves focus to the count. Closing it returns focus to the button.
- Confirming moves focus to the filter group, because the row that had focus has gone.
- Focus is a 3px outline, thicker than the 2px used elsewhere, for the same reason the type
  is large.
- No shortcut is advertised, so none needs to work.

## Journeys

`journeys/book-in.spec.mjs` — 24 assertions: filter and recount, two distinct refusals, save
and persist into the week log, the empty state reached by clearing the cellar, every visible
control over 44px, and state readable as a word.
