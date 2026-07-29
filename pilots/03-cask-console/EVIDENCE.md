# EVIDENCE — Stalbridge cask desk

> Pilot 3, mode **P**. The console a small brewery's cellar team uses to track casks out on
> trade and coming back. Subject fictional; the trade and its rules are not.

## 1. Artefacts

- The **cask** itself: firkin (9 gallons), kilderkin (18), each with a **shive** and a **keystone**.
- The **cask label**: brew, gyle number, racking date, best-before.
- The **delivery note** and the returns docket the drayman brings back.
- The **cellar log**: what went out, to whom, when it is due back.
- A **duty return** to HMRC — beer duty is paid on what leaves the brewery.
- The **steam cleaner** and the cask washing line; a cask has a cleaning cycle before refill.

## 2. Vocabulary

Uses: firkin, kilderkin, pin, gyle, racked, shive, keystone, ullage, on trade, dray, drop,
collect, returned dirty, returned wet, condemn, re-shive, duty point, sale or return.

Does not use: units, SKU, inventory item, asset, journey, workflow.
A cellarman says "four firkins of gyle 214 dropped at the Feathers Tuesday, two back dirty".

## 3. Materials and surfaces

Stainless steel and aluminium casks, rubber shives, cardboard keystones. Cellar floors are wet
concrete. The console is used **standing up, on a wall-mounted screen in the cellar**, often by
someone in gloves, often in poor light, and often while a dray is waiting.

That is the single most important fact about this interface: it is read at arm's length and
operated in a hurry.

## 4. Colour that is already true

Stainless: cool mid-grey. Cellar walls: whitewashed brick. The beer: amber to near-black.
Chalk board behind the bar. Warning tape on the dray: yellow and black.

The one colour that already means something in this world is the **red of a condemned cask
tag** — nothing else in the cellar is red.

## 5. Constraints already in force

- **Duty is paid at the duty point.** A cask leaving the brewery is a taxable movement, so
  what is recorded is a legal record, not a note.
- A cask returned **wet** (still with beer in it) cannot be counted as empty; ullage has to be
  recorded before it is tipped.
- A cask cannot go back into the filling line until it has been through the wash. A refill
  before that is a contamination risk and the console must not let it happen quietly.
- Best-before is a date on the label, and a cask past it comes back for tipping, not resale.
- Glare and gloves: touch targets are large, the screen is high-contrast, and nothing depends
  on hover.

## 6. References and anti-references

**References**

1. **The cellar log book** — one line per movement, most recent at the top, the whole week
   visible on one page.
2. **Airport departure boards** — read at distance, few columns, state as a word not a colour.
3. **Weighbridge tickets**: figures at size, units fixed, no ornament.

**Anti-references**

1. **The SaaS dashboard**: KPI cards across the top, a donut chart, a sidebar of icons. It is
   what every inventory product looks like and it wastes the top of a screen the team reads
   from four feet away.
2. **A colour-only state.** A red row means nothing under a cellar light through a scratched
   screen, and nothing at all to a colourblind cellarman.
3. **Anything that needs hover.** Gloves.

## 7. Asset reality

| Item | Exists | Note |
| --- | --- | --- |
| Photography | **no** | And it would be wrong: this is a working screen, not a page about a brewery |
| Cask silhouettes by size | **drawn for this project** | Firkin and kilderkin differ by shape and the team reads them at a glance |
| Logo | **drawn for this project** | A shive and keystone, which is the pair every cask has |

Mode P is the one mode where "deliberately imageless" is usually the right answer. The two
drawings that exist earn their place by carrying information — cask size — that a word would
take longer to read at four feet.

---

## 8. The working week on the desk

The pack above ships the trade, the rules and one worked movement. A desk that shows one
consignment cannot show the ordering the brief demands, nor "how many casks are at each pub",
so the week below was constructed **from** the pack's own primitives and is recorded here so
that every figure printed on the screen is sourced in this file. Anchors are marked.

Board as at **Thursday 06:40**; the dray is expected at **07:15** (BRIEF).
Cask sizes are the trade's own: **firkin 9 gallons, kilderkin 18, barrel 36** (section 1, BRIEF).

### 8.1 Out on trade, by operational severity

| # | Pub | Gyle | Casks | Size | Gallons | Dropped | Due back | Days late |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | The Royal Oak | 211 | 6 | kilderkin | 108 | Thu | Fri | 6 |
| 2 | The Feathers | 214 | 2 | firkin | 18 | Tue | Mon | 3 |
| 3 | The Bell | 209 | 3 | firkin | 27 | Wed | Tue | 2 |
| 4 | The White Hart | 216 | 2 | barrel | 72 | Sat | Thu (today) | nil |
| 5 | The Crown | 217 | 5 | firkin | 45 | Sat | Thu (today) | nil |
| 6 | The Ship | 218 | 4 | kilderkin | 72 | Mon | Sat | nil |
| 7 | The Greyhound | 218 | 2 | firkin | 18 | Mon | Sat | nil |
| 8 | The Feathers | 219 | 6 | firkin | 54 | Tue | Mon | nil |
| 9 | The Swan | 220 | 3 | kilderkin | 54 | Wed | Tue | nil |

**Anchor.** Row 2 is section 2's own sentence: four firkins of gyle 214 dropped at the Feathers
Tuesday, two back dirty. The two that came back are entry 1 of the record below, which is why
two firkins of that consignment are still out.

Derived totals, arithmetic only:

- Late back: **3 consignments, 11 casks, 153 gallons**.
- Due today: **2 consignments, 7 casks, 117 gallons**.
- On trade, not yet due: **4 consignments, 15 casks, 198 gallons**.
- All out: **9 consignments, 33 casks, 468 gallons**.

### 8.2 The record, this week so far

| When | Pub | Gyle | Casks | Size | Condition | Ullage | To |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Wed 15:20 | The Feathers | 214 | 2 | firkin | dirty | nil | wash |
| Wed 11:05 | The Anchor | 210 | 3 | firkin | wet | 4 gallons | wash |
| Tue 16:40 | The Bell | 208 | 1 | kilderkin | condemned | 2 gallons | scrap |
| Tue 09:15 | The Ship | 212 | 4 | firkin | sound | nil | wash |

Booked back this week: **10 casks, 99 gallons**.

### 8.3 Rules the screen enforces, all from sections 1 to 5

- Ullage may not exceed the capacity of the casks being booked in: count x size, in gallons.
- A cask returned **wet** has beer in it, so its ullage may not be nil.
- Every booking goes **to the wash**; a **condemned** cask goes to scrap instead. Nothing goes
  back to the filling line from this screen.
- Condition and ullage are part of the booking, because the movement is a duty record.

Pub names are fictional, as the subject is. They are names, not figures.
