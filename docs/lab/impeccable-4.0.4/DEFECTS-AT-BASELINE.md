# Defects found at baseline, before any measurement

Every entry here was found by tracing code at the pins in `PINS.md`, before a single
build was made and before any preference was measured. That timing is the point: none
of these can later be dismissed as an excuse invented after a bad result, and none of
them may be quietly fixed mid-round to flatter a comparison.

**Nothing in this file is fixed yet.** The improvement loop takes one mechanism at a
time with measurement between, so a fix landing here without a measurement either side
would confound the round. Each entry carries where it sits in the queue.

Source: `BASELINE.md`, which records 47 mechanism claims of which 29 were refuted or
corrected by adversarial verifiers reading the same code.

---

## Blocking the measurement itself

### D1. `build`'s direction gate tests existence, not content

`commands.mjs:293-301, 362-367` exits 3 when `.sitesmith/direction.md` or
`.sitesmith/contract.json` is missing. A reader created both as 0-byte files in an empty
directory; `sitesmith build --surface buy` exited 0 with no blockers.

This matters for the round because the whole SiteSmith arm rests on the claim that a run
which skipped the direction step cannot pass. It can. Any A/B where a builder writes an
empty `direction.md` is measuring nothing.

Queue: **before the A/B**. This is not a mechanism improvement, it is the instrument.

### D2. The anti-repeat ledger runs in no documented step

`ledger.mjs check|commit` appears in no manifest, no `verify.md` release list and no
command. The only automated call in the repo is `ledger.mjs parse` in CI against one
pilot. `README.md:90` and `.claude-plugin/plugin.json:4` describe the capability.

So cross-build convergence is currently **untested, not absent**. A claim in either
direction about SiteSmith repeating itself has no instrument behind it today.

Queue: **before the portfolio test**, which is a promotion blocker.

---

## Measurement bugs inside SiteSmith's own machinery

### D3. The signature-material veto cannot fire

`measure()` returns twelve fields and none of them is a signature colour. `hueOf(undefined)`
is null, so `SIGNATURE_ARC` (30 degrees) and `SIGNATURE_DELTA` (16) are inert on every
rendered run. The comment at `ledger.mjs:838-840` asserts the hole was closed.

A comment claiming a closed hole over an open one is worse than the hole.

Queue: with D2.

### D4. The accent colour is a plain argmax over saturation

`ledger.mjs:617-624` scans every `body *` descendant and takes the most saturated, with no
coverage weight and no first-screen restriction. A reader rendered a probe page where a
1x1 px off-screen magenta span beat a colour covering 100 per cent of the first screen.

Queue: with D2. The two colour vetoes are only as good as this measurement.

### D5. `fingerprintOf()` returns six nulls when called directly

The three hues are computed one level up, in the CLI at `ledger.mjs:836-841`, not inside
`fingerprintOf()`. Anything calling `fingerprintOf(await measure(p))` gets nulls for
`groundHue`, `accentHue` and `signatureHue` and silently disarms both colour vetoes.

Queue: with D2.

### D6. A missing `Second reading` is unreportable on every record

`ADDED_AFTER_FIRST_RECORDS` holds one element, so `olderTemplate` is true exactly when
`Second reading` is absent, and the skip that follows then makes its absence unreportable
on every record, new or old. Only the blank-heading branch can fire.

The heading was added because reviewers praised what it produces. It is currently optional
by accident.

Queue: after the first A/B, since it changes what the direction record demands.

---

## Product-truth defects, outside the round's hypothesis

These reach shipped artefacts. They are recorded, not fixed here, because none of them
plausibly moves blind buyer preference and fixing them now would add noise.

### D7. Two engines invert the declared exit contract

`product/pipeline.json:341-347` declares 0 done / 1 measured defect / 2 usage / 3 not ready,
"stable across every command, so an automated caller can branch on it". `gate.mjs` inverts
1 and 2. `critique.mjs` inverts them and stretches 1 over invocation errors the contract
assigns to 2. `verify.mjs` folds withheld verdicts into 1 and has no 3. Only `contract.mjs`
implements what is declared.

It reaches the CLI (`sitesmith audit` returns `Math.max(inspect, gate)`) and
`tools/provider-pack.mjs:50` copies the declaration into every provider pack.
`tools/test-commands-exit.mjs` exercises only `init` and `build`.

### D8. The rule registry is incomplete and its own comment is misattributed

10 classes `gate.mjs` emits are absent from the 59-row registry: 5 literal and 5
`antipattern/*` built by template literal. A complete registry is 69 rules. The "every
refusal class the engines emit" wording lives in `pipeline.json:363` and `verify.yml:146`,
not in `rules.json`'s own `$comment` as previously recorded.

### D9. `verify.mjs` prints a band it is not using

`verify.mjs:416` overrides the measure lower bound to 28 ch below 600 px viewport width,
while the printed line still says "the 45 to 80 band". At the default 375 px viewport the
band in force is 28 to 80.

### D10. `run.md`'s ledger command exits 2 if typed literally

`run.md:32` omits the directory positional the CLI requires.

### D11. `contract.mjs new` can pin an empty hash and `check` says nothing

`writtenAgainst.hash` is set only `if (existsSync(record))`. Written before the record, it
stays `''` and `check` skips the comparison without a note. A contract written before its
direction record therefore reports as bound to it.

---

## Corrections to things previously recorded here as true

**`contract.mjs stress` uses anchored patterns.** It does not. All three are unanchored
substring matchers; the only real guard against writing a verdict onto the wrong case is
the GLYPHS exclusion. This was stated in the Design Contract round and was wrong.

---

## Candidate causes, not findings

### C1. The knowledge index writes design prescriptions into the manifest the agent works from

`commands.mjs:377-393` writes each retrieved record's full `mechanism` text into
`.sitesmith/RUN.md`, and `SKILL.md:40-42` orders the agent to work from that file. Some
records carry layout prescriptions: `anti-three-equal-feature-cards` says "Use 2-column
zig-zag, asymmetric grid, scroll-pinned, or horizontal-scroll alternative";
`cmp-label-above-input-error-below` says "Label ABOVE input ... Error text BELOW input ...
gap-2". `SKILL.md` tells the model that nothing suggests a look; the pipeline does supply
material of exactly that kind, before any thesis exists.

**This is a candidate, not a finding.** Running retrieval on six of the round's own briefs
across four surfaces returned six different top-3 sets:

| brief | surface | retrieved |
| --- | --- | --- |
| stannard-pattern-foundry | buy | configurator-prices-from-the-buyers-own-numbers, specification-not-payment, subjects-own-unknown |
| damgaard-estrik | buy | roles-come-after-the-colours, warm-every-route, hydration-and-image-failure-modes |
| kilvert-lock-room | experience | astro-build-time-values-freeze, four-conditions-for-a-sufficient-stack, subjects-own-unknown |
| marsk-stordyrpraksis | operate | a-number-owes-its-age, four-conditions-for-a-sufficient-stack, roles-come-after-the-colours |
| bjerrea-vandlobslaug | read | climb-before-you-write, a-colour-has-no-contrast-a-pair-does, reduced-motion-respected |
| nettleford-harbour-trust | operate | a-number-owes-its-age, four-conditions-for-a-sufficient-stack, motion-reports-state-not-scroll |

Neither prescriptive record surfaced for any of the six. The mechanism that could cause
convergence exists; convergence was not observed here. Whether it fires on the briefs the
A/B actually uses is a question the A/B can answer, and it stays a candidate until it does.
