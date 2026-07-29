# Round 7 — assignment-blinded, and the first round whose result is worth reading

Three pilots, built by three agents who never met, measured by two reviewers who saw only
scroll strips and a one-line brief, against a key held outside the repository and outside both
reviewer workspaces until after both of them had locked.

**7.67 / 10 across the portfolio. Zero of three reach 8. The round does not pass.**

## What "assignment-blinded" means, and what it does not

Call this **assignment-blinded**, not blind. The distinction is the whole point of the section.

**What is enforced.** The mapping from label to project was not in the repository, not in
either reviewer's workspace, and not in anything either reviewer was given. Each review is
bound by hash to this round's rubric, sheets and brief, and to its own body, and carries the
time it locked. `tools/open-key.mjs` would not release the mapping until all of that verified
and the last lock was already in the past. Those properties are checkable by anyone with the
repository, after the fact, without trusting this note.

**What is not enforced.** The reviewers ran as agents on this machine, with shell access, on
the same filesystem as the sealed key. Nothing technically stopped a reviewer from searching
for it. What stopped them was that they were told not to and had no reason to — which is a
procedure, not a boundary. A claim of technical blindness would require the review to run
somewhere the key cannot be reached from at all: a container with no mount, or another host.
That is what the Docker probes are for, and until they exist this is the honest word.

Rounds 3 to 6 do not even reach this bar. `KEY-MASTER.json` was **committed to the repository**
while those reviewers worked, so the mapping was inside the tree they were reading. "They were
not given the path" is not a withheld assignment; it is an unlocked door nobody mentioned.

Concretely, this round:

- the key was generated and moved out of the tree before either reviewer was dispatched;
- each reviewer got a fresh directory holding six JPEGs, one rubric, one `RUN.json` and three
  one-line briefs, and nothing else;
- `find` over both workspaces returns zero files matching `KEY*`;
- the sheets were committed **before** dispatch, so `sheet-sha256` can still be checked;
- each review carries the run id, the rubric, sheet and brief hashes, a hash of its own body,
  and the time it locked;
- `open-key.mjs` recorded the open time, and is tested in CI against six ways a review could
  be wrong.

Locks at 14:59:23Z and 15:00:32Z. Key opened at 15:02:31Z. In that order, on the record.

## The scores

| label | subject | U | V | combined | |
| --- | --- | --- | --- | --- | --- |
| SHEET-M2 | chandlery | 8.14 | 7.57 | **7.86** | below 8 |
| SHEET-R9 | foundry | 7.57 | 7.71 | **7.64** | below 8 |
| SHEET-W1 | cask console | 7.43 | 7.57 | **7.50** | below 8 |

Round 3 scored 6.5, 4 and 5. This is 7.86, 7.64 and 7.50. The three independent builds are a
large step up and still short of the bar.

The two reviewers land 0.14, 0.14 and 0.57 apart. Round 1's reviewers disagreed by whole
points and both were wrong about the same page for the same instrument reason. A measurement
this tight is worth acting on.

## What both reviewers marked down, by axis

| axis | M2 | R9 | W1 |
| --- | --- | --- | --- |
| direction | 9 / 8 | 9 / 9 | 9 / 9 |
| specificity | 8 / 9 | 8 / 9 | 9 / 9 |
| type | 9 / 8 | 8 / 8 | 8 / 8 |
| colour | 9 / 8 | 8 / 8 | 8 / 8 |
| **assets** | **7 / 6** | **6 / 6** | **6 / 6** |
| **hierarchy** | **7 / 6** | 7 / 8 | **6 / 6** |
| production-readiness | 8 / 8 | 7 / 6 | 6 / 7 |

Direction and specificity are 8 to 9 everywhere. Four reviewers across two rounds have now
agreed the pages are genuinely of their trade and not a template with the nouns swapped. That
part of the skill works.

**Assets is 6 on five of six reviews and 7 on the sixth.** It is the lowest axis on every
page, and no page scores above 7 on it. That is the finding.

`production-gate` reached the same conclusion from the other direction, without seeing a
sheet: it blocks all three because none of the three manifests has a logo row, and blocks the
foundry additionally for an inline `<svg>` with no `data-asset` id. Every one of the three
agents drew a mark. Not one of them recorded it as an asset.

Two instruments that cannot see each other both say the weakest thing about these sites is the
pictures and the record of the pictures.

## The specific asset criticisms, both reviewers

- **chandlery** — five constructions in a one-column list with ~240 px thumbnails, so the
  comparison the visitor came for cannot be held in the eye at once; the only real side-by-side
  is a text table with no images. One row drops its photograph and its whole left column, and
  reads as a failed image slot rather than the deliberate out-of-stock state. On desktop the
  establishing shot is squeezed to a ~125 px letterbox that crops the knife out; the mobile crop
  of the same photograph is correct.
- **foundry** — the only uncaptioned photograph on the sheet takes a third of two full desktop
  screens and reads as an out-of-focus wall, on a page that has twice taught you to expect a
  mono caption. Both reviewers also flag that the centrepiece tuning table loads with its
  METAL OFF column empty directly under a caption promising those weights.
- **cask console** — the pictogram counted one-per-cask is praised by both, and both still put
  assets at 6; the page's own footnote says CONDEMN sends a cask to scrap, and CONDEMN is drawn
  exactly like SOUND in all eleven row groups at both widths.

## And the portfolio question

Both reviewers, independently, and `portfolio-diversity` running on the rendered pages,
independently of both: one studio, one method, three executions. Hairlines as the only divider,
tabular figures as a motif, no elevation anywhere, one accent rationed to a single action, the
same mono label voice, and the same rhetorical move of headlining a refusal.

Three agents in separate contexts with no shared anything converged on a house style. That is
not agents copying agents. It is the skill having a hand of its own, and not knowing it.

## What this round does not do

It does not patch a page. The three pilots are exactly as their build agents left them, which
is the only reason the numbers above mean anything.
