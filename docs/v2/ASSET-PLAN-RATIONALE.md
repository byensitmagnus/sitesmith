# Why there is now an asset plan

> The reasoning behind `skills/sitesmith/v2/24-asset-plan.md`, `scripts/asset-plan.mjs` and the
> two rewritten logo rules in `production-gate.mjs`. Written after the fact because the commit
> that carried them, `ada43db`, has a message about something else — a correction I owed — and
> the larger change went in underneath it unexplained. That is a bad commit boundary and this
> file is the repair, not an excuse for it.

## What the evidence actually said

Three sites, three agents who never met, three unrelated trades, one frozen skill. Two
assignment-blinded reviewers, seven criteria, 1–10.

| criterion | the six scores |
| --- | --- |
| direction | 9 8 9 9 9 9 |
| specificity | 8 9 8 9 9 9 |
| type | 9 8 8 8 8 8 |
| colour | 9 8 8 8 8 8 |
| **assets** | **7 6 6 6 6 6** |
| hierarchy | 7 6 7 8 6 6 |
| production-readiness | 8 8 7 6 6 7 |

Assets is the lowest criterion on every page and the only one where nothing reached 8. Direction
and specificity are 8–9 throughout: the part of the skill that makes a page belong to its trade
is working.

The first thing to rule out was that this was a sourcing failure, because that is where the
existing machinery lives. It was not. Every picture on all three pages existed, was licensed,
was recorded in the manifest with a focal point and a treatment, and was cropped correctly at
375 and 1440. `26-visual-assets.md` did its job completely.

Read the criticisms together and they are one criticism, and it is not about sourcing:

- Five rope constructions listed one per row, so the rigger who came to compare three-strand
  against eight-plait can never hold two in the eye at once. The only real side-by-side on the
  page is a text table with no pictures in it. **Both reviewers, independently, led with this.**
- A third of two full desktop screens given to an uncaptioned out-of-focus diagonal of metal, on
  a page that had twice taught the reader to expect a caption. Both reviewers called it a wall
  rather than a bell.
- A row that drops its photograph and its whole left column to mean "out of stock", which reads
  as a broken image slot rather than a deliberate state.

Nobody had written down what any of those pictures was supposed to do. That is one step earlier
than sourcing, and there was no step there.

## What was built

**`ASSET-PLAN.md`**, one block per asset, machine-readable in the same way the axis record is —
because the axis record taught us that an undocumented format costs a day and gets diagnosed as
a design fault. Per asset: `kind`, `carries`, `job`, `use`, `comparative`, `without-it`,
`evidence`.

`carries` is the load-bearing field. It is the one thing the visitor learns or can do because
the asset exists. The gate rejects the answers people give when there isn't one — "visual
interest", "builds trust", "breaks up the text", "makes the page look less empty" — not because
those phrases are banned words, but because an asset whose best defence is one of them is
decoration, and cutting it makes the page better.

`comparative` exists because of the chandlery. If any asset's job or argument involves choosing
between things, at least one asset has to be `comparative: yes`. A page that invites a
comparison and shows the options a screen apart has mentioned the comparison, not made it.

**The load-bearing rule has two doors and no third.** Either an asset carries the visitor's
primary job, or `DIRECTION.md` declares `imagery: deliberately imageless` and the typography
does that work. What fails is a page with four decorative photographs and a direction claiming
to be photography-led. Nothing here makes any component mandatory: there is no rule that a page
must have a hero image, a logo wall, or one asset of each kind.

## The two logo rules, which are opposites

They kept being called the same thing, so they were written as one rule, and the one rule was
wrong in both directions.

**The site's own mark.** If the page renders one it is an asset and it is a manifest row,
matched by the `data-asset` on the rendered element. The old rule demanded a manifest id
containing the word "logo" and failed three builds that had each recorded their mark correctly
under the name `mark`. See the correction in `preflight/round-7/GATES.md`.

**Other people's marks.** Customer logos, partner logos, certification badges: the strongest
proof a page can carry and the easiest to fabricate. Permitted only where `EVIDENCE.md` names
who lent each one; required when the brief has that evidence, because leaving real named
customers off the page throws away the best thing on it; never `substitute` or `needed`, because
a stand-in endorsement is a fabricated endorsement; never invented.

The existing rules against fabricated testimonials, invented metrics, unsourced prices and
unverifiable claims are unchanged and none of this weakens them.

## Rubric

`docs/v2/RUBRIC.md` is now the canonical copy. Criterion 5 changed and nothing else did — same
seven criteria, same 1–10 scale, same "under 7 needs a named finding" rule, same output format,
same portfolio question, no threshold moved.

It asked whether images were real and correctly cropped, which all six reviews could answer yes
to while scoring 6, and then said what was actually wrong in prose the criterion had no words
for. It now asks the question those reviewers were already answering. Rounds 1 to 7 keep frozen
copies, because their reviews are hash-bound to the file they were scored against.

## Fixtures

Nine new ones, and the suite is 73. Five on the plan: assets that each carry an argument; a page
that declares imagery is not load-bearing and means it; every field filled in with none of them
saying anything; a comparison invited and not enabled; borrowed marks resting on nothing. Four
on the gate: an unlisted mark, customers named on the page and nowhere in the evidence pack,
customers who agreed in writing to be named, and a stand-in where an endorsement should be.
