# INTERACTIONS — Klinke & Datter

> `(C)` — AI-generated working document. One page, no JavaScript at all. Every state below is
> reached with HTML and CSS the browser already implements, and every one of them is driven by
> the journeys in `journeys/`.

## Primary actions

| action | where | on success | on failure | reversible |
| --- | --- | --- | --- | --- |
| Ring 66 12 47 09 | header, end of the hero, contact section, footer | the `tel:` URL is handed to the operating system; the link is `aria-label`led with the full sentence so a screen reader hears what will happen before it happens | there is no failure path inside the page — a device with no dialler is the operating system's dialogue, not ours, which is why the number is also rendered as selectable text beside every instance | n/a |
| Open one of the five failures | section 02 | the `<details>` panel expands, `aria-expanded` flips to `true` on the summary, focus stays on the summary, and the panel takes `--elev-inset` so an open item reads as pressed in | none — a disclosure cannot fail | yes, activating the summary again closes it |
| Jump to a section | header nav, five links | the section becomes `:target`; its numeral turns `--accent` and gains a slot rule, so the reader can see which of the five they asked for | a link to an id that does not exist would scroll nowhere — all five ids are asserted by `journeys/naevigation.spec.mjs` | yes, the browser's back button |
| Skip to content | first tab stop | focus moves to `<main>`, which is `tabindex="-1"`, and the link becomes visible only while focused | none | n/a |

## States per surface

**The call action** — rest, hover, `:focus-visible`, active. No disabled state and no loading
state exist, and neither is drawn: a phone number is never unavailable and a `tel:` hand-off has
no pending phase. `10-core.md` F8 is satisfied because there is no dead control on the page.

**The five disclosures** — closed (the page's initial state, all five closed), open, hover,
`:focus-visible`, active. All five open independently; there is no accordion behaviour, because
a reader comparing two failures should be able to hold both open.

**The sections** — untargeted and `:target`. Getting in: a nav link, or a URL with a fragment.
Getting out: navigating to another section, or the back button.

**Page-level empty, error and partial states** — none exist and none are drawn. The page has no
data source, no query, no query string and no list that can be empty. `10-core.md` F3 requires
these "wherever the data can be absent, wrong or incomplete", and here it cannot be.

## Keyboard and focus

Tab order, which matches the visual order at every width: skip link → wordmark → the five
section links → the call action in the header → the call action at the end of the hero → the
five disclosure summaries in order → the call action in the contact section → the phone link in
the footer.

One focus treatment for the whole page: a 3px `--accent` outline at 3px offset. It is the same
on a link, a summary and a button, so it is learned once.

- After activating the skip link, focus is on `<main>` and the next Tab goes to the first link
  inside the content, not back to the header.
- After opening a disclosure, focus stays on the summary. The panel is not focusable and
  nothing scrolls, so a keyboard user does not lose their place in a list of five.
- Nothing traps focus. There is no modal, no dropdown and no sticky bar on this page.
- No keyboard shortcut is advertised anywhere, so there is none that does nothing.

## Journeys

| file | what it drives |
| --- | --- |
| `journeys/ring-op.spec.mjs` | the primary action end to end — the call link is present above the fold at 375 and 1440, carries a real `tel:` href with the number from the brief, is reachable by keyboard with a visible focus ring, and the same number is rendered as readable text so it survives a device with no dialler |
| `journeys/fejl-udfoldning.spec.mjs` | the five disclosures — all five closed on load, one opened by keyboard, `aria-expanded` observed changing, the panel text observed appearing, focus asserted to have stayed on the summary, and the item closed again |
| `journeys/navigation.spec.mjs` | the five section links — every href resolves to an element that exists, the target section becomes `:target` and its numeral changes colour, and the document does not scroll horizontally at 375 while doing it |

The marketing mode asks for the enquiry submitted, validated and confirmed. There is no enquiry
form on this page and there is no address to send one to, so the journey that would exercise it
does not exist. That is recorded here rather than faked, and it is repeated in
`PRODUCTION-REPORT.md`.
