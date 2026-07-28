# INTERACTIONS — Marrow & Kell

## Primary actions

| action | where | on success | on failure | reversible |
| --- | --- | --- | --- | --- |
| Send an enquiry | the enquiry section | the confirmation appears in a `role=status` region repeating the ring, the tower, the faculty position and the address we will reply to; focus moves to it; the send button disables | an error summary appears above the form listing every problem, each linking to its field; focus moves to the summary; each field is marked `aria-invalid` and carries its own message | no — it is an email, and saying so is better than pretending |
| Open the mobile navigation | header, below 900px | the nav appears, `aria-expanded` flips to true, focus moves to the first destination | — | yes: Escape or the toggle, and focus returns to the toggle |

## States per surface

**Fields** — empty, valid, invalid. Validation runs on submit and not on keystroke: a form
that turns red while you are still typing your email address is hostile, and this one is four
fields long.

**Error summary** — hidden, or shown with one entry per failure. Each entry is a link to its
field and moves focus there. Reached by submitting an incomplete form.

**Confirmation** — hidden, or shown and announced. Reached by submitting a complete one. The
send button disables afterwards, because the only thing worse than not sending an enquiry is
sending it four times.

Every message names the actual limit or the actual expectation: "between 1 and 16", "a
dedication and a village is enough". None of them says "this field is required", which tells
the reader something they can already see.

## Keyboard and focus

- Skip link first, then the wordmark, the nav, the content, the form in reading order.
- Submit with an invalid form: focus to the summary, which is `tabindex="-1"`.
- A summary link: focus to the field it names.
- Submit with a valid form: focus to the confirmation, which is `tabindex="-1"` and
  `role="status"`.
- Escape inside the open mobile nav: closed, focus back on the toggle.
- No shortcut is advertised, so none needs to work.

## Journeys

`journeys/enquiry.spec.mjs` — 21 assertions covering both journeys mode M requires: the
enquiry end to end including two distinct failure paths, and the mobile navigation opening,
closing by keyboard and returning focus.
