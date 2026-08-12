# What happened during pilot 02, written down as it happened

Recorded before the judge returned, so nothing here is shaped by the verdict.

## The two runs

| | S, built with SiteSmith | P, plain Sonnet |
| --- | --- | --- |
| output tokens | 1,633,489 | 528,869 |
| tool calls | 828 | 272 |
| wall time | 3 h 45 m | 1 h 29 m |
| attempts | 2 | 1 |
| routes built | 2 (`/`, `/kvittering`) | 5 (`/`, `/priser`, `/bestil`, `/kvittering`, `/icon.svg`) |

The wall-clock figure for S covers both attempts: the agent started at 18:21 and returned at
roughly 22:07, and the reported 13,496,033 ms matches that span, so the token and tool-call
figures are the full cost of the arm rather than of the surviving attempt alone.

**Multipliers, on the same brief: 3.1 times the tokens, 3.0 times the tool calls, 2.5 times
the wall clock.** Pilot 01's were 2.2 times the tokens and 1.8 times the clock. The gap did
not narrow.

## Three things went wrong that are worth keeping

**1. P killed every node process on the machine.** It reported this itself: it used
`taskkill /IM node.exe /T` once while restarting its dev server. S was running at the time.
S survived — verified while both were still in flight, not assumed afterwards — but a build
agent that reaches for a machine-wide kill is one bad moment away from destroying the other
arm of the experiment it is part of. Nothing about the harness prevented it.

**2. S deleted its own finished build, and the product's own layout is why.** In its words:
it read the sitesmith repo's `skills/sitesmith/` tree and took it for the current pipeline. It
is not; it is the legacy v2 tree, reachable only through `install --legacy-v2`, while the
default install pulls `skills/sitesmith-v3` through `product/pipeline.json`. On that premise it
deleted a complete build in its own workspace — `app/`, `lib/`, `journeys/`, the `.sitesmith`
state and the production report — and could not recover it. It then designed the site again
from the brief.

This is not a builder being careless with a tidy repo. Two sibling directories, one of them
live and one of them reachable only behind a flag, both named for the product, is a layout that
invites exactly this reading. It cost roughly half of arm S's budget. **It is a product defect
and it is recorded as one — not fixed here, because the product does not change during the
pilot.**

**3. The harness stalled S once.** `[stall] agent "S:sitesmith" stalled (no progress) after
8481s — retrying (1/5)`. The retry is what produced the surviving build.

## The instrument found something the product's own gate did not

S's own report says `verify.mjs` finished at **0 axe violations**. The external checker found
**6 serious violations, all on `/kvittering`** — `dlitem` and `listitem`, from
`<dl class="instrument-readout"><li><dt>…</dt><dd>…</dd></li>`, the exact invalid nesting the
build's own notes say it fixed. It fixed it in the hero on `/` and left it on the receipt.

The reason it was left is the interesting part. `/` does not link to `/kvittering` — checked by
hand, zero occurrences in the served HTML. The receipt is reachable only by completing the
booking. SiteSmith's verification walks the site from the entry, so **the page a customer sees
immediately after they commit was never rendered by the tool that certified the site**.

This checker only saw it because of the one change made after pilot 01: whatever page the
journey ends on gets the same static checks as everything the crawl found.

That is the same failure class as pilot 01, in a new place: not a wrong measurement, an
unmeasured state. It is the strongest candidate for the next P0 and it is deterministic —
provable in code, no model tokens needed to reproduce it.

## Instrument changes made during the pilot, and why each is symmetric

Both were made before the judge ran, and both were applied to both arms by re-running the same
file.

1. **The form driver filled an m² field with `Testsvar`,** so the valid booking never
   validated and P's receipt read as a defect it did not have. Fixed by filling every control
   by what it is rather than by what it is called. Found against P, fixed generically, and S
   was never measured with the broken version.
2. **The forbidden-claims list was missing four of the brief's own terms** —
   `akutberedskab`, `weekendudkald`, `godkendt af forsikringsselskaber`, `autorisation`,
   `branchegodkendelse`, `medlemskab`, `udtalelse`. Noticed while checking whether P's footer
   line `stiftet 2016` was a violation. It is not: the brief forbids experience claims *beyond*
   `stiftet 2016`, and names that phrase as the allowed one. Widening the list changed neither
   arm's result — both still assert zero — but the instrument now matches the brief it claims
   to enforce.

Neither change moved a threshold, and neither was made after seeing a result it would alter.
