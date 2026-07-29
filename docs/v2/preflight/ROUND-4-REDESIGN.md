# Round 4 — three component vocabularies, not three skins

> Authorised after round 3 failed at 6.5, 4 and 5. The blocker was not a defect list: two blind
> reviewers independently named the same five shared devices, and closing that needs three
> separately conceived vocabularies rather than one kit recoloured three ways.

## The five shared devices, and what replaces each

Both reviewers named these without being asked to look for them.

| shared device | chandlery gets | foundry gets | cask desk gets |
| --- | --- | --- | --- |
| one humanist body sans | **serif body**, the whole page set in it | condensed grot display over a **grotesque** body | a **neutral UI sans**, and only that |
| letterspaced small-caps label layer | **run-in labels**, inline in the sentence, no caps at all | labels **right-aligned against a rule**, in the display face | **lowercase micro labels**, because a cellarman reads values not labels |
| coloured-rule confirmation echo | the **ticket itself grows** — no separate confirmation block | the form is **replaced by** its receipt | **the row leaves the board and the counts move** — no confirmation block at all |
| control + value + primary button row | the control is **inside a sentence**: "Cut ⟨n⟩ m of this" | one **submit at the end of a column**, nothing inline | controls **in a strip across the card foot**, no primary |
| two-paragraph invented-subject footer | a **printed address block** | **one line** | a **status bar**, not prose |

## Per-site findings from round 3 that a redesign must also close

**Chandlery** (G 7, H 6). The ticket rail takes a quarter of the desktop width and is empty on a
first visit. The hero is a hard letterbox where the rope is a cropped sliver. No address,
telephone or email on a shop that says "cut at the counter". The ticket dead-ends after the
total. Five identical rows with no second idea. Mobile spec strip wraps badly.

**Foundry** (G 4, H 4). Both primary criticisms — the mobile hero clipping the headline, and the
Nominal cell rendering a lone comma — were closed in `503e87c` and are unreviewed. What is left:
section junctions lose padding on mobile, the footer hairline runs flush against the send
button, two words orphan on desktop.

**Cask desk** (G 6, H 4). "The ops-dashboard default rendered competently." The four hues are not
disjoint: amber is *due today* **and** the error ring; red is *late* **and** the error sentence;
green is *booked* **and** the button on the row that just refused. Each desktop row carries
~354px of nothing between the pill and the condition label. On mobile the validation message
sits after the submit button rather than under its field.

## Order of work

1. **Cask desk** — worst structural criticism, and the colour collision is a correctness problem
   as much as a design one.
2. **Chandlery** — the empty rail, the missing contact, the dead-end ticket.
3. **Foundry** — least to do; its two headline faults are already fixed and unreviewed.
4. Rebuild sheets, commit them, dispatch two reviewers who have not seen any earlier round.

## The rule for this round

No gate is weakened and no gate is added. Every frozen gate must still pass on all three, and
`portfolio-diversity` must still pass three ways. If a change makes a site better and a gate
worse, the change is wrong.
