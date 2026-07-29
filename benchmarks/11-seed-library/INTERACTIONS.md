# INTERACTIONS — The Cleeve Seed Library

The page has one interactive surface: **the borrowing slip**. There is no form, nothing is
sent, and the library takes no details. The slip is a list you build on the page and carry to
the drawers on a Tuesday or a Saturday — which is the real transaction, and the page should
not pretend to be it.

## Primary actions

| action | where | on success | on failure | reversible |
| --- | --- | --- | --- | --- |
| **Add to slip** | each of the nine index rows, and each of the nine seeds in the key by way of its row | the row's button becomes *Take it off*, a line appears on the slip carrying the crop, its seed drawing at 16px and the one sentence saying what it wants in autumn; `[data-slip-count]` in the masthead and on the slip both increment; `role="status"` announces *"Runner bean 'Czar' added. 1 of 6."* | at six packets, every remaining *Add to slip* is `aria-disabled="true"` and still focusable; clicking or pressing Enter on it changes nothing and `role="status"` says *"Six packets a visit. Take something off the slip first."* | yes — *Take it off* |
| **Take it off** | the slip line, and the row it came from | the line is removed, both counts decrement, the row's button returns to *Add to slip*, any capped buttons un-cap, `role="status"` announces *"Runner bean 'Czar' taken off. 2 of 6."* | n/a — the control only exists while the item is on the slip | yes — add it again |
| **Clear the slip** | foot of the slip, present only when the slip has something on it | every line is removed, both counts return to 0, the empty state returns, all nine buttons return to *Add to slip*, `role="status"` announces *"Slip cleared."* | n/a | no, and it says so: *"Clear the slip"* is a quiet button, not the heavy one |
| **Jump to a crop** | the nine seeds in the key | the browser moves to that row; the row is `tabindex="-1"` and receives focus, so a keyboard user lands on the entry and not above it | n/a | browser back |

## States per surface

**The slip.**

| state | what puts it there | what gets it out |
| --- | --- | --- |
| empty | first load, or *Clear the slip*, or taking the last item off | adding anything |
| partial (1–5) | adding an item | adding or removing |
| full (6) | adding a sixth | removing one |
| carrying at least one hard crop | adding kale, squash, beetroot or carrot | removing it |

The **empty** state says why it is empty and offers the thing that fills it: *"Nothing on the
slip yet. Add up to six packets from the drawers below — and if this is your first year,
take them from the five that come back true."* It links to the first row.

The **full** state is not an error. It reads *"Six packets — that is a visit's worth."* and
the accent is used once, on the count, because six is the whole shape of the primary action.

The **hard-crop** state is the honest one and it is why the slip exists at all. A line for a
crop drawn with a broken outline carries an extra sentence under it, in the accent, taken
verbatim from the stock table: *"Kale 'Pentland Brig' crosses with any brassica within a mile.
Grow it and eat it — the seed you save will be a cross."* It is a note, not a warning: the
library will still lend it, and the brief does not let the page pretend otherwise.

**The index rows.** rest · hover · `:focus-visible` · added (button reads *Take it off*) ·
capped (`aria-disabled`, reason in the status region). No loading state exists anywhere on
this page, and none is styled — nothing waits on anything.

**The page.** No error state and no partial state are possible: all content is in the HTML, no
request is made, and the slip works without JavaScript in the sense that matters — with
scripting off, the nine rows, their counts, their reasons and the whole return argument are
still on the page and still readable. Only the slip is lost, so the slip is written as an
enhancement and its heading is present either way.

## Keyboard and focus

- One focus treatment for the whole project: a 2px `--accent` outline at 3px offset. It is on
  links, on buttons and on the row that receives focus after a jump.
- Tab order is document order, which is masthead → statement → key (nine seeds, left to
  right, easy before hard) → index rows in packet order → slip → the rest of the argument →
  footer. Visual order and focus order are the same at all three widths, because the layout
  reorders nothing; the slip column is *positioned* after the index at every width and merely
  becomes sticky above 1100px.
- After **Add to slip**, focus stays on the button — which has become *Take it off*, so the
  next Enter is an undo and never a double-add.
- After **Take it off** from a slip line, focus moves to the slip heading, because the control
  the user was on has ceased to exist.
- After **Clear the slip**, focus moves to the slip heading for the same reason.
- After a **jump from the key**, focus moves to the target row.
- No shortcut is advertised, so none has to work.
- The whole primary task — read the split, choose six, understand the promise — completes from
  the keyboard alone.

## Journeys

| file | covers |
| --- | --- |
| `journeys/borrow-slip.spec.mjs` | 1440. The primary action end to end: empty state, add, the count and the announcement, the hard-crop note, the cap at six with its reason, undo, clear, and the keyboard path with a visible focus ring. |
| `journeys/phone-slip.spec.mjs` | 375. The masthead counter is the navigation on a phone: it reports the count, it links to the slip, adding from an index row updates it, and the document does not scroll sideways while any of it happens. |
