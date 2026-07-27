# v2 — adjudication of the split subjects

`tools/find-conflicts.py` flagged thirteen of fourteen subjects as carrying both a
prohibition and a requirement across more than one file. Each was then read.

**Seven are real. Six are not.** The tool is a candidate finder: it classifies by verb, so a
contrast threshold reads as advice and a logo rule reads as a requirement, and a subject
lands in the split column without anything actually disagreeing. Reporting thirteen
contradictions would have been repeating a machine's output as a finding, which is the
mistake this whole audit exists to stop.

Two of the seven are not contradictions but **gaps**: nothing in the set says the thing that
needs saying, so the agent guesses and guesses badly. Those matter as much.

---

## Real — contradiction

### 1. Corner radius · owner: `03-design-engineering.md`

| Side | Source |
| --- | --- |
| One scale, everywhere | `03-design-engineering.md:81` — "SHAPE CONSISTENCY LOCK (mandatory): Pick ONE corner-radius scale for the page and stick to it." |
| One value everywhere is a defect | `06-redesign-audit.md:89` — "Identical border-radius on every element → Tighter inside, softer outside." |

**Decision.** One radius *system*, not one radius *value*. The system states an inside/outside
relationship: a control inside a panel is tighter than the panel. `12-design-system.md`
already ships this as `--radius-inner` / `--radius-outer` / `--radius-full`. Both sources
were reaching for it; neither said it. `06`'s line stays as the audit symptom; `03`'s becomes
a pointer to the contract.

### 2. Scope · owner: `SKILL.md`

`09-block-library.md:101-111` declares the skill out of scope for dashboards, dense product
UI, data tables and multi-step wizards. Three of the nine benchmarks are exactly those.

**Decision.** Already applied: the heading of `09` records that Section 13 describes
taste-skill's remit, not sitesmith's, and that the routing table in `SKILL.md` is the
authority. The list itself stays in the verbatim body until that file is rewritten.

### 3. Div-built product previews · owner: `05-ai-tells.md`

Banned in three places (`03:154`, `05:54`, `05:84`) in terms that cannot distinguish a faked
browser chrome from a typeset excerpt of real output. `benchmarks/01-saas-landing` contains
the second and reads, correctly, as a violation of a rule written for the first.

**Decision.** Split the rule. *Simulated application chrome is banned — window frames,
traffic lights, fake sidebars, fake terminals. A typeset excerpt of output is allowed and
must be labelled as an excerpt.* Then `01` either complies or is rebuilt against a rule that
means something.

### 4. Em-dashes · owner: the conformance gate

`09-block-library.md:125` calls zero em-dashes non-negotiable. Eighty-six shipped.

**Decision.** An absolute that is never checked teaches everyone that absolutes are
decorative. Now ratcheted in `tools/conformance.mjs` against a recorded baseline: existing
debt allowed, any increase fails. The rule keeps its force by being enforced, not by being
restated.

### 5. Icons · owner: `12-design-system.md`

`09-block-library.md:178` — icons from a library only, no hand-rolled SVG paths. All nine
benchmarks author one, because all nine need a brand mark and no library ships yours.

**Decision.** The rule is right for icon *sets* and wrong for a brand mark. *An icon set
comes from a library. A brand mark may be authored, and it is the only authored SVG on the
page.* The conformance gate encodes exactly this: one `<path>` passes, a set does not.

---

## Real — gap

### 6. One accent versus semantic status colour · owner: `12-design-system.md`

`03-design-engineering.md:54` — "COLOR CONSISTENCY LOCK (mandatory): Once an accent color is
chosen for a page, it is used on the WHOLE page." Read literally, a queue that marks rows
saved, needs-a-reason and to-count has broken the lock three times.

Nothing in the set distinguishes an **accent**, which is a choice, from **semantic colour**,
which is information. So the agent either breaks a mandatory rule or ships a status column in
one colour, and both are wrong.

**Decision.** They are different token groups and the lock applies only to the accent.
`12-design-system.md` declares `--accent` / `--on-accent` separately from `--ok` / `--warn` /
`--bad`. A page may use exactly one accent and as many semantic colours as it has states to
name — and each of those must clear AA in both schemes, which is the constraint that
actually matters.

### 7. Dark mode as a default · owner: `12-design-system.md`

The set treats two schemes as near-mandatory (`09:182`, `07:374-375`, `11:286`) and says
nothing about when one controlled theme is the right answer. A brand with a single
controlled environment — a kiosk, a bay console under fixed lighting, a printed-adjacent
editorial site — is pushed into shipping a second theme nobody asked for and nobody tests.

**Decision.** Two schemes remain the default because the reader's system decides, not the
designer. *A single theme is legitimate when the environment is controlled, and the contract
must say which and why.* The requirement moves from "ship dark mode" to "state the theme
decision in the contract and meet AA in every theme you ship" — which is checkable, where
the current phrasing is not.

---

## Not a contradiction

Read and dismissed, with the reason. These stay as they are.

| Subject | Why it flagged | Verdict |
| --- | --- | --- |
| images | 39 rules, coherent: gen tool first, then a seeded placeholder, then an explicit placeholder slot; never a fake screenshot, never decorative hand-rolled SVG. The split came from an accessibility-label line reading as advice. | The benchmarks' labelled placeholders sit in the third permitted tier. No change. |
| dark mode | Contrast thresholds classed as advice, logo rendering as a requirement. Every rule agrees: define tokens, test both, do not invert mechanically, do not desaturate the brand. | No contradiction. The *gap* is item 7. |
| cards | "Do not default to three equal cards", "generic cards banned above density 7", "omit cards in favour of spacing". One position, stated three times. | No change. |
| accent colour | Three restatements of one lock plus one preset mentioning neon. | No contradiction. The *gap* is item 6. |
| motion | 47 prohibitions, 17 requirements, across 18 files — the largest surface, and almost all of it is "motion must be motivated" said many ways. | Verbose, not contradictory. Folds into the rewrite. |
| eyebrow | A mechanical cap on eyebrow count plus prohibitions on specific eyebrow forms. | No change. |

`gradient` (15 prohibitions, 0 requirements) and `cursor` (3, 0) did not flag as split, but
both are bare bans with no stated legitimate use, which contradicts `SKILL.md:111`:
"Anti-slop is judgement, not a ban list… Each one is fine when the brand, the content or the
function asks for it." **Decision:** in the rewrite every prohibition states its legitimate
case or becomes a preference. A ban with no exception is a ban that will be broken by the
first brief that needs it, and then all of them look optional.

---

## What this changes about the rewrite

The 4:1 prohibition-to-requirement ratio is not mostly caused by disagreement. It is caused
by the same position being restated in four voices, and by prohibitions written without
their exception. Both are merge problems, not adjudication problems — which means the
rewrite is mostly **deduplication and inversion**, not arbitration.

That is a smaller and more tractable job than thirteen contradictions would have been.
