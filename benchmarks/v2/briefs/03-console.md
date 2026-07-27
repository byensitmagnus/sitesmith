# Brief 03 — product UI

> Handed to the agent verbatim, in both arms. Do not add context to one and not the other.

---

Build the operator console for **Tideway**, software used by the people who dispatch and
monitor water-quality sampling crews for a regional utility.

**Who uses it.** Two or three controllers per shift, on a fixed workstation, for eight hours
at a time. They have used the previous system for nine years and can drive it without
looking. Anything that slows a keystroke will be complained about within a day.

**The job.** Sampling rounds are scheduled the night before. Through the day the controller
watches which crews are on which rounds, which samples have been collected, which have failed
their hold time, and which sites need rescheduling. When a result comes back outside limits
they have to flag it, assign a re-sample and record why.

**What matters to them, in their words.** "The screen has to tell me what is going wrong
without me hunting for it. I do not need it to be pretty, I need to see the four rounds that
are late before I see anything else."

**Facts you may use.** Around 60 rounds a day across 400 sampling sites. Hold time is the
window between collection and analysis, and it varies by determinand: 6 hours for some, 24
for others, 72 for a few. A sample past its hold time is void and has to be re-collected,
which costs a crew visit. Crews are identified by a two-letter code and a number. Results
carry a determinand, a value, a unit and a limit.

**Constraints.** Keyboard first: the controllers rarely touch the mouse and expect to move
between rows, open a record, flag it and return without leaving the keyboard. The room is lit
badly and the monitors are old. Colour alone cannot carry state, because one of the current
controllers is colour-blind and has been for the whole nine years.

**Scope.** At minimum: the day's rounds with their state, one round opened showing its
samples, and the flow for flagging a result and assigning a re-sample. Include the empty,
error and loading states — they will be seen on the first morning.

Use whatever stack you think is right. It must run as static files served from a directory.
