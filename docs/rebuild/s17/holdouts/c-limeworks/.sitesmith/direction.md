# Direction record

## Surface
operate

## Subject
The kiln watch desk at a lime works. Four shafts, one operator per shift, read at four metres with gloves on.

## Constraints in force
Only the works' own band limits and watch log may appear. Danish copy with the Danish letters. The room is dark and the screen is on a wall.

## Assets that exist
Nothing. No plant photography, no logo.

## Nouns
skakt, traek, ilaegning, kvittering, baand, spjaeld, vagt

## The page I would have made on autopilot, and did not build
A dark dashboard with four gradient cards, a sparkline in each, a donut chart of uptime, coloured dots for status and a sidebar of icons. It is the default admin template, and its failure is specific: status carried by colour alone is unreadable to the operator with the deuteranopia this industry is full of.

## Theses
1. the board, four shafts side by side, each showing the one number that decides the next action
2. the trace, the page is a timeline of the shift and the current state is its right hand edge
3. the queue, the page is a list of what needs doing, ordered by urgency

## Case for the runner-up
For: 3

A queue is what an operator actually holds in their head, and ordering by urgency would have put shaft 4 first without anyone reading a number. It lost because a queue hides the shafts that are fine, and the question this desk answers most often is whether anything is wrong, not what is next.

Thesis 2 was rejected: a trace needs history the desk does not store.

## Built
Built: 1, axis: board over feed, because four shafts is a number a person can hold at once, and the answer to the most common question is the shape of the whole board rather than any one item

## Colour
- ground: `#0d1620`, the wall of a dark control room, in every colour scheme. There is no light variant: the room is dark around the clock, the screen is on a wall, and a light board would exist only for someone looking at it from an office. Two attempts at a light scheme were made and both were refused, one for landing in the banned premium-consumer band and one for landing on the same ground family as another site in this portfolio. The third answer was that the page did not need one.
- state: `#57c98a` inside band, `#f0b429` over band, `#ff6b5e` stop charging, each with a matched dark plate behind it
- action: `#0b47b8`, only on the button that commits

## Type
- display: "Segoe UI", the system face, because a control screen is not typeset
- body: "Segoe UI", the same face
- machine: "ui-monospace" with tabular numerals, every temperature, pressure and time, so the digits do not move as they change

## Density, motion and boldness
Very dense, entirely still. Nothing animates, ever. A control screen that moves is a control screen that is read wrong.

## Structure
A status bar, then four equal shaft panels across the width, then the watch log as a single ordered list.

## First screen
The four temperatures, large enough to read from the door, each with its state as a bordered word underneath.

## Imagery treatment
No images and no charts. A number and a word are the whole vocabulary.

## Argument order
What each shaft is doing, then what has been done this shift.

## Signature
the state word in a bordered chip (`.tilstand`). Its kind is a stamped label, not a badge, and the border means the state survives being printed in grey or seen by someone who cannot separate the hues.

## Risk
Four large numbers and no chart may read as unfinished to a manager who wants trends. Accepted: this screen is for the operator, and the manager has a different screen.

## Assumptions
Assumed the band limits are the works' own and current. Assumed a shift is eight hours, which the status bar states.

## Originality pass
Swapped the subject for a district heating plant: the board held, which said the idea was about a small fixed number of vessels rather than about lime, so the acknowledgement column was rebuilt from what this works actually records, a name and a minute. Swapped it for a delivery fleet with forty vehicles and it collapsed outright, which is the answer that mattered.

## One-offs
- `44px` the temperature is set to be legible at four metres, not to a type scale
- `74px` and `96px` the log columns are set to the widest time and shaft label

## Deliberate
- `none` this build claims no antipattern on purpose
