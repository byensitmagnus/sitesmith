# INTERACTIONS — Trelfall & Son

## Primary actions

| action | where | on success | on failure | reversible |
| --- | --- | --- | --- | --- |
| Open the cut controls for a line | catalogue row | the row expands, `aria-expanded` flips, focus moves to the length input | — | yes, the same control closes it |
| Set a cut length | row, length input | the line total in the last column updates on every keystroke | below the 3 m minimum or above the coil remaining: the input goes invalid, an error appears under it naming the limit, and the add button disables with the reason | yes, change the number |
| Add the cut to the order | row | order count and order total both change, a `role=status` line announces the cut in words, the row collapses | if the length is invalid the button is disabled and describes why | yes, remove the line |
| Remove a line | order summary | count and total change, `role=status` announces it, the empty state returns at zero | — | no |

Every "on success" names something observable: a number that changes, or text in a live region.

## States per surface

**Catalogue row** — default; hover (ground shifts one step); focus-within (a 2px ink rule on
the left edge); expanded, reached by the toggle; out of stock, reached from the data, where
the controls never render and the row says when the next coil lands.

**Length input** — empty (add disabled, no error, because a form that shouts before you have
typed is hostile); valid; below minimum, reached by entering under 3; above remaining,
reached by entering more than the coil holds; disabled, only on an out-of-stock line.

**Order summary** — empty, the state the page loads in, which says what the order will show
rather than "no items"; one or more lines; and each removal re-renders the total.

Nothing is styled that cannot be reached. The out-of-stock line is real data on the page
(`PP14-8`), not a class applied to demonstrate a state.

## Keyboard and focus

- The catalogue is a table; the toggles, inputs and buttons are in reading order.
- Opening a row moves focus to the length input. Closing it returns focus to the toggle.
- Adding a cut leaves focus on the toggle of the row just added, not on a button that has
  disappeared.
- Removing a line moves focus to the summary heading, because the button that had focus is
  gone.
- Focus is a 2px `--focus` outline with a 2px offset everywhere. No element removes it.
- No shortcut is advertised anywhere on this site, so none needs to work.

## Journeys

`journeys/cut-and-order.spec.mjs` — the whole reason the site exists: open a line, price it,
be refused for a length the coil cannot take, correct it, add it, and see the order change.
Asserts the four required things: something changed, it was announced, the failure path, and
the keyboard path.
