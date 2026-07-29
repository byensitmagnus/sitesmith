# INTERACTIONS.md — Falkner & Vane

Two interactive surfaces on one page, and one job split between them: choose a hide, and know
when it can ship.

## Primary actions

| action | where | on success | on failure | reversible |
| --- | --- | --- | --- | --- |
| Write the enquiry | `#enquiry` | `#enq-note` (`role=status`) is revealed carrying the leather, its measured thickness, the quantity, what it is for and the lead time dated to July 2026; focus moves to it | `#enq-summary` (`role=alert`) is revealed listing one entry per unfinished field, each a link that moves focus to its field; every bad field gets `aria-invalid` and an error wired with `aria-describedby`; focus moves to the summary | yes, **Start again** empties the form, hides both the summary and the note, and returns focus to the leather select |
| Lay one leather over another | `#compare` | the two chosen rows are marked `data-picked` and tagged A and B, the other four dim, each chosen row gains a dashed overlay drawn at the other one's thickness on the same baseline, and `[data-out]` (`role=status`) states the difference in millimetres, the difference in temper, the two grains and the two lead times | choosing the same leather twice clears the overlay and `[data-out]` takes `data-state=error` with *"Choose two different leathers"*; **Clear** stays enabled so the state has an exit | yes, **Clear** empties both selects, restores the plate and returns focus to the first select |
| Go to the enquiry | masthead, and the nav | the page scrolls to `#enquiry`, which is the one action repeated in the header | n/a | n/a |

Secondary, and it looks secondary: the four nav links, which move to a section and mark
themselves current.

## States per surface

### The plate and its compare control

| state | how it is reached | how it is left |
| --- | --- | --- |
| resting: six rows at full strength, no tag, no overlay, Clear disabled | page load, or Clear | choosing in either select |
| comparing: two rows marked, four dimmed, two overlays drawn | both selects hold different leathers | Clear, or changing a select |
| refused: no overlay, error readout, Clear enabled | the same leather is chosen in both selects | choosing a different one, or Clear |

There is no loading state and no empty state here: the six rows are in the markup and are
never fetched, so neither state has a way in and neither is drawn. There is no partial state
either; one select filled and the other empty is the resting state with an instruction in it.

### The enquiry

| state | how it is reached | how it is left |
| --- | --- | --- |
| empty: no errors, no note, quantity pre-set to 1 | page load, or Start again | submitting |
| prefilled: the leather select already holds the leather laid as A on the plate | choosing A in the compare control while the enquiry select is still unset | choosing another leather by hand |
| invalid: summary, field errors, no note | submitting with a missing leather, an empty use, an empty name, or a quantity that is not a whole number of one or more | correcting and submitting again, or Start again |
| written: the note is shown and focus is in it | submitting a complete form | Start again |

The quantity field is the one place a wrong value is possible rather than a missing one, so it
carries its own message: *"A whole number of hides, one or more."* The minimum order of one
hide is stated in the hint before anyone can get it wrong, not only after.

### The specification table

Wider than 375px at its narrowest useful setting, so it scrolls inside its own container. The
container is focusable, has `role=group` and is named by the section heading, per H3, and the
document itself never scrolls sideways at any width.

## Keyboard and focus

- Tab order follows reading order throughout: skip link, mark, enquiry action, four nav links,
  the two compare selects, Clear, the table region, the four enquiry fields, submit, Start
  again, footer mark.
- One focus treatment for the whole page: 2px `--accent` outline at 3px offset.
- After **Write the enquiry** succeeds, focus moves to `#enq-note`, which is `tabindex="-1"`
  so it can receive focus without entering the tab order.
- After a failed submit, focus moves to `#enq-summary`, also `tabindex="-1"`. Each summary
  entry is a real link and activating it moves focus to the field it names.
- After **Clear**, focus returns to `#cmp-a`. After **Start again**, focus returns to
  `#enq-leather`. Neither leaves focus on a button that has just removed the thing it acted on.
- A skip link is the first focusable thing and goes to `#main`.
- No keyboard shortcut is advertised anywhere on the page, so there is none to be broken.
- Nothing traps focus: there is no dialog, no drawer and no mobile menu. The nav is four links
  that wrap onto a second line at 375, which is a real answer rather than a disclosure that
  would need one.

## Journeys

| file | covers |
| --- | --- |
| `journeys/choose-a-hide.spec.mjs` | the resting state, the goat against calf comparison the brief names, the announcement, what changed in the drawing, the overlay geometry, the carry-over into the enquiry, the refusal path, and the whole thing again from the keyboard including the focus ring |
| `journeys/write-the-enquiry.spec.mjs` | submit empty, the summary and its links, field-level errors and their wiring, one wrong value rather than a missing one, then the happy path driven from the keyboard, the written note and its contents, the way back out, and a check that no price appears anywhere on the page in any state |

```bash
node ../skills/sitesmith/scripts/journey.mjs 10-tannery/journeys/ --base http://127.0.0.1:4701
```
