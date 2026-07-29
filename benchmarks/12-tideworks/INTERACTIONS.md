# INTERACTIONS — Tideworks duty board

One surface, one primary action. The board is read far more often than it is written to, so
almost all of it is static by design; the part that is not is the log, which is the one thing
the brief says the keeper does: *"The keeper on shift logs each passage with a time and
initials."*

---

## Primary actions

| action | where | on success | on failure | reversible |
| --- | --- | --- | --- | --- |
| **Log the passage** (primary) | the log form at the foot of the board | a row is prepended to the passage-log table; the log's empty state is removed; the boat leaves the priority queue and the remaining boats renumber; that lock's *waiting* count in the lock table decrements; `[role=status]` announces *"Logged — Marigold through Salter's Lode at 05:06, initials MO. 5 boats waiting."*; focus moves to that status message | nothing is written; an error summary appears first inside the form listing each problem as a link to its field; each field gets an inline message wired with `aria-describedby` and a `--bad` left border; focus moves to the summary heading | no — a passage is a record. A wrong entry is struck in the book, and the board says so in its conventions. |
| **Change the sheet** (secondary) | the chrome bar, right | every colour token on the page swaps between the night sheet and the day sheet; the button's own label becomes the sheet it now switches *to*; the choice is stored for that machine | none — it cannot fail; if storage is unavailable the switch still works for the session | yes, by pressing it again |

"On success" is four observable DOM changes plus an announcement, and the journeys assert all
of them by comparing before and after rather than by assuming.

## States per surface

### The log form

| state | how it is reached | how it is left |
| --- | --- | --- |
| rest | page load | — |
| hover | pointer over the button or a field | pointer out |
| `:focus-visible` | Tab, or Shift+Tab | focus moves on |
| active | mouse down / Space held on the button | release |
| **error** | submit with a missing field, a time that is not `HH:MM`, initials that are not two or three letters, or a time outside both of the chosen lock's windows today | fix the field and submit again; the summary is removed on the next successful submit |
| disabled | **never.** The button is always enabled. A disabled control has to say why, and the honest why here is "you have not filled it in yet", which the error summary says better and only when it is true. | — |
| loading | **not implemented.** The log is written into the page synchronously; there is no request, so there is no wait. A state with no way in is deleted, not drawn. | — |

Validation, in the order the summary lists it:

1. **Boat** — required. *Choose the boat that was worked.*
2. **Lock** — required. Welches Dam is present in the list and `disabled`, labelled *out of
   service since 2006*, because leaving it off the board makes people ask.
3. **Time** — required, `HH:MM`, 00:00–23:59. *A passage time is 24-hour, as 05:06.*
4. **Time against the lock's windows** — the time must fall inside one of that lock's two
   windows today. The message names both: *Denver's windows today are 01:12–09:12 and
   13:38–21:38. 23:15 is outside both.* This is the one domain rule the form enforces, and it
   is enforced because the whole board exists to stop a boat being worked outside its window.
5. **Initials** — required, two or three letters. *Initials are two or three letters, as MO.*

### The passage log

| state | how it is reached | what it says |
| --- | --- | --- |
| **empty** | page load — the brief records no passages for this shift, so none are invented | *No passages logged this shift. The first entry goes in when a boat clears the gate; the form below writes it.* |
| populated | any successful log | the table, newest first, with time, boat, lock and initials |

### The priority queue

| state | how it is reached | what it says |
| --- | --- | --- |
| populated | page load — six boats | the ordered list, renumbered after every log |
| partial | one to five boats logged | the remaining boats, renumbered, and the count in the section marker updates |
| **empty** | all six logged | *No boats waiting. The queue fills again as boats report to the keeper by VHF, by phone, or at the hut door.* |

### The lock table

Static for the whole shift except the *waiting* count under each lock name, which follows the
queue. One state deserves naming: the **over-the-sill check is deliberately partial.** The
board holds sill depths at mean low water and no tide heights at all, so it reports *"clear at
any state of tide"* where the draught is under the MLW figure, and *"needs 0.4 m of tide over
the sill"* where it is not — never a yes or a no it cannot support. That is a partial state
shown as one, not a gap.

### The instrument

No states. It is drawn from the tide and the tide does not respond to clicks. It is not
focusable and offers no interaction, because inviting one would be a lie.

## Keyboard and focus

- A skip link is the first focusable element and jumps to `#board`.
- Focus order is document order: skip link → the sheet button → the lock table's scroll region →
  the log table's scroll region once it exists → the log form's four fields → the submit button.
  That is nine stops on a loaded board and nothing else is focusable, because nothing else does
  anything. The board advertises no keyboard shortcut, so there is none to be broken.
- One focus treatment everywhere: `2px solid var(--accent)` with a `2px` offset.
- **The primary task completes from the keyboard alone**: Tab to *Boat*, choose with the arrow
  keys, Tab, Tab, type the time, Tab, type the initials, Enter. The journeys walk exactly that
  path with no pointer.
- After a successful submit, focus moves to the `[role=status]` message, which is inside a
  `tabindex="-1"` container so the announcement is also where the keyboard lands.
- After a failed submit, focus moves to the error summary heading, also `tabindex="-1"`. Every
  item in the summary is a real link to its field.
- Where a table needs to scroll sideways at 375px, its container is `tabindex="0"` with a
  `role="region"` and an accessible name, so a keyboard can reach the scroll.
- No shortcut is advertised, because none is implemented. The board prints no key legend it
  cannot honour.

## Journeys

| file | what it drives |
| --- | --- |
| `journeys/log-passage.spec.mjs` | The main task from empty to done, by pointer: read the empty log, log *Marigold* through Salter's Lode at 05:06, then assert the row exists, the empty state is gone, the queue lost a boat and renumbered, the lock's waiting count fell, the status announced it and focus landed on the announcement. |
| `journeys/validation-and-keyboard.spec.mjs` | The failure paths, the keyboard path and the two sheets: submit empty and assert the summary and the per-field wiring; submit a time outside both of Denver's windows and assert the message names both windows; assert a malformed time gets a different message from an out-of-window one; assert Welches Dam is present and disabled with its reason; complete the whole task with the keyboard only and assert the focus ring is visible; then assert the board opens on the night sheet, that the button changes the ground, and that it changes it back. |
