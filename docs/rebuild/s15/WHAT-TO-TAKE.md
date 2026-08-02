---
title: What to take from the six-arm holdout, and what it costs
state: S15_EXTRACTION
status: proposal, not applied
ai_generated: "(C)"
---

# What to take

Four proposals arrived, mining arms Q, T, U and S plus two motion skills. This ranks them
against two things the proposals could not see: **the per-axis scores**, and **the real
budget arithmetic**. Both change the order.

## The evidence that decides the order

Aggregate across the three judges, from `RAW-HOLDOUT.json`. Higher is better.

| arm | skill | distinct | subject | type | col&sig | copy | brief | craft | total |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| **P** | **sitesmith-v3 (ours)** | 24 | **27** | 22 | 23 | **24** | **24** | **24** | **168** |
| T | impeccable | **26** | 25 | **23** | **25** | **24** | 21 | 17 | 161 |
| U | sitesmith-v2 | 22 | 25 | 21 | 20 | 22 | 21 | 23 | 154 |
| Q | frontend-design | 19 | 20 | 21 | 18 | 19 | 21 | 20 | 138 |
| S | ui-ux-pro-max | 10 | 16 | 19 | 13 | 23 | **24** | 23 | 128 |

**Only T beats us on anything.** Distinctiveness +2, colour and signature +2, type +1.
Everything else in the pile is a technique mined from a page that lost to ours on the
axis the technique claims to fix:

- **Q's roll**, the device the judges liked most in isolation, sits on the arm that scored
  **18 on colour and signature against our 23**, and 138 against our 168. A device praised
  in isolation, carried by an arm that lost the signature axis by five points, is not
  evidence the technique transfers. Proposal 1 asks 350 tokens for the lighting kit behind
  it. That is the worst trade in the pile.
- **S's prose** is the subject of proposal 4's five techniques. S scored **23 on copy
  against our 24**. Per judge it is 9/8 to S, 7/8 to us, 7/8 to us. One point on one
  judge, the frightened-customer lens, and losses on the other two. That is noise, not a
  gap, and it does not buy 419 tokens of obligations.
- **U is our own v2**, MIT, in this repo. Nothing it does carries a licence question, and
  one of its techniques is a **regression check against ourselves** (below).

Where we actually lose, in the judges' own words, is narrow and specific. Judge 3, the
AI-tell hunter, on our arm: the ground is the most-named tell in the brief, and **"the
boxed A/B/C/D/E/F section letters encode nothing that 01/02/03 wouldn't"**. Judge 1
independently: **"the A-F letter tabs are arbitrary organisation"**. The same judge 3 on
T: **"The 01-06 numbering is load-bearing"**.

Measured on disk: **T's identifiers appear 7 to 11 times each. Ours appear once each, and
are `aria-hidden="true"`.** That is the one defect two judges named, and it is the top of
this list.

## The budget arithmetic the proposals got wrong

Run `node tools/context-budget.mjs skills/sitesmith-v3`. Three findings, all verified by
applying edits to a copy and running the gate.

1. **SKILL.md's headroom is not 5 tokens. It is 1.** SKILL.md is in every scenario, and
   `INSPECT = SKILL.md + verify.md = 4599 of 4600`. A +17 byte edit to SKILL.md passed
   ALWAYS at 3099 and **failed INSPECT at 4603**. Every SKILL.md proposal in this pile
   assumed 5 tokens of room. There is one.
2. **buy.md's ceiling is REDESIGN, not BUY.** BUY has 107 tokens spare, REDESIGN has 81,
   and buy.md is in both. Three proposals target buy.md at 136, 140 and 125 tokens. All
   three break REDESIGN.
3. **A conditionally opened file is not free.** `stacks/*` reserves the largest file in the
   directory, currently 722 tokens for `wordpress.md`, in every routine scenario. Proposal
   1's claim that `craft/surface.md` "costs nothing against the always ceiling" is true and
   irrelevant: it would cost about 350 tokens in whichever scenarios declare it, against
   REDESIGN's 81.

## 1. Ranked by what it buys per token

| # | Technique | Source | Target | Est tokens | Displaces | Why it is worth that |
| --- | --- | --- | --- | ---: | --- | --- |
| 1 | Drawings carry no literal colour and no per-shape stroke-width | U (ours, v2) | `scripts/gate.mjs` | **0** | nothing | Refuses our own first-place build. P ships 5 hex literals and 0 `var()` in its one drawing, so it can only declare `color-scheme:light`. v2 did it right with 17 `var()` attrs. This is a v3 regression against ourselves, caught for free. |
| 2 | The signature names its dependents | T (161) | `ledger.mjs` template + `gate.mjs` | **0** | nothing | Buys the axis we actually lose (col&sig 23 v 25). Our channel repeats in every section as an empty `aria-hidden` div with nothing attached to it. Costs one stripped format line, not prose. |
| 3 | An identifier is declared, worn, and said back | T (161) | `SKILL.md` §6 Structure + `gate.mjs` | **-1** | the colour-contrast sentence in §6 | The only defect two judges named in our winning page. 11:1 separation between T and P on disk. Net negative on the always surface. |
| 4 | Signature is a different thing at 375, not a smaller one | U (ours, v2) | `verify.md` question 3 | **0** | "There is always one." in question 2 | Judge 1: v2's rotation was "the single cleverest responsive move in the set". The displaced line is a fixed-count quota, which `verify.md`'s own report contract forbids. The displacement is itself a fix. |
| 5 | Drawings are a set before they are drawings | T (161) + U (ours) | `floor/buy.md` | **+73** | nothing | The only real cost here. Both arms with drawing conventions scored above 154; our one drawing carries a disclaimer. Fits REDESIGN with 9 tokens spare. |
| 6 | The signature declares a measure, spent on something not decorative | U (ours, v2) | `SKILL.md` §6 Signature | 59 | would need §6 colour evidence | **Deferred.** No judge named it. Item 3 spends the only SKILL.md slot, and this is the weaker of the two. |
| 7 | `Refusals` in the direction record | S (128) | `ledger.mjs` REQUIRED | 38 | nothing (code) | **Deferred.** Free in prose terms, but it invalidates every existing direction record in the repo and needs a migration decision. Source arm lost the copy axis to us. |
| 8 | `:target` is a state on a scriptless page | T (161) | `verify.md` state roster | 33 | would need two justifying clauses | **Deferred.** INSPECT has 2 tokens after item 4. Our zero-state static page was praised, not penalised. |
| 9 | Reduced-motion completeness (content stuck at opacity 0) | scroll-world | `scripts/verify.mjs` | 0 | nothing | **Deferred one round.** Real floor defect, zero prose cost, but needs prototyping against the six s15 builds before it may refuse. See section 4. |

Everything below the line is rejected outright. See section 3.

## 2. The five to build now, ready to paste

Verified: applying items 3, 4 and 5 to a copy and running `context-budget.mjs` gives
ALWAYS 3094, READ 5117, BUY 6165, OPERATE 6098, REDESIGN 7191, INSPECT 4598. **All six
pass, and four of the six get cheaper.**

### 1. Drawings live in the token system

`scripts/gate.mjs`, in the markup pass, immediately after `const scan = stripDataUris(mk);`
at line 412. `stripDataUris` already blanks `href="data:..."`, so a favicon's own
`fill='%23...'` is excluded without extra work. Run it on `scan`, never on `mk`.

```js
/* ── drawings live in the token system ─────────────────────────────────── */

/* A drawing that names its own colours cannot follow prefers-color-scheme, which is why
   the arm that hardcoded five of them could only declare color-scheme:light. That arm
   was ours, and our own v2 had already done it correctly with var() throughout, so this
   is a regression check before it is anything else. currentColor and none are the two
   correct literals and stay allowed. */
for (const svg of scan.matchAll(/<svg\b[\s\S]*?<\/svg>/gi)) {
  for (const a of svg[0].matchAll(/\s(?:fill|stroke)=["']([^"']+)["']/gi)) {
    const v = a[1].trim();
    if (/^(none|currentcolor|inherit|transparent)$/i.test(v) || /^(var|url)\(/i.test(v)) continue;
    refuse('render/drawing-carries-a-literal-colour', file, lineOf(src, svg.index + a.index),
      `${snip(a[0].trim())} inside an inline svg. A drawing outside the token system cannot follow the colour scheme.`);
  }
  for (const a of svg[0].matchAll(/\sstroke-width=["'][^"']+["']/gi)) {
    refuse('render/drawing-carries-a-stroke-width-attribute', file, lineOf(src, svg.index + a.index),
      `${snip(a[0].trim())} sets one shape's weight. One token on the group sets the whole drawing's.`);
  }
}
```

Measured against the six builds before writing it: **P refused (5 colour, 3 width), T
refused (18 colour, 14 width), S clean on colour (`currentColor` throughout) and refused
on 10 widths, U clean on both, Q and R have no inline svg.** The allowlist was chosen from
S's actual output, not invented.

Needs the same written-reason escape the typeface check already has, for the one honest
case: a drawing quoting a real brand's exact colours.

### 2. The signature names its dependents

`scripts/ledger.mjs`, inside `template()`. `parseDirection` already strips lines matching
`/^\s*(<!--|>\s*format:)/`, so this costs the record nothing at parse time. Note that
template() does not currently emit any format hints. This is the first.

```js
if (name === 'Signature') out.push('> format: Dependents: `<selector>` and the token it takes from the signature, one per line. An element that could be swapped without touching the signature is not one.', '')
```

`scripts/gate.mjs`, extending the existing signature block at line 913. `signatureSelector()`
at line 211 already pulls the backticked selector and line 1132 already looks it up in the
DOM, so both halves exist.

```js
} else if (!/^\s*Dependents:/m.test(direction.signature.value ?? '')) {
  refuse('direction/signature-names-no-dependents', DIRECTION_PATH, direction.signature.line,
    'the Signature block names no Dependents, so nothing on the page answers to it and the mark is furniture');
}
```

Retrieval and refusal only. The script never says which token or which element. Then, in
the render block where the selector is already resolved, refuse a named dependent selector
that is absent from the DOM, and refuse when the token named on a dependent line appears in
neither that selector's declarations nor the signature's. The both-blocks check is what
makes padding cost real edits.

### 3. SKILL.md §6 Structure

Replace the whole Structure paragraph. **Delete this sentence from the Colour paragraph to
pay for it**, four lines above:

> A saturated colour usually clears contrast against some of your values and not others.
> Measure before you set a paragraph in one.

It is the only rule in `SKILL.md` that a script already fully enforces and that section 8
already states numerically at 4.5:1. Removing it costs no coverage.

New Structure paragraph, 390 bytes against the 393 freed. `SKILL.md` ends 3 bytes smaller
than it started:

```markdown
**Structure.** A structural device must encode something true. Numbering, eyebrows,
dividers, tabs and markers each make a claim: `01/02/03` claims the content is
ordered. Cut the ones that claim nothing. An identifier that survives is declared once,
worn by what it names, and said back by the copy or a control that points with it. Used
once, it is a label, and forces nothing downstream.
```

The check in `scripts/gate.mjs`, on the built HTML it already parses. **It fires only on a
scheme that is already present**, so a page with no identifiers is untouched and no build
is ever pushed to grow a contents list. If it ever refuses a page for having no scheme, the
rule has inverted and must be pulled.

```js
/* ── the identifier used once ──────────────────────────────────────────── */

/* Counted on disk across the six-arm holdout: the second-placed arm carried 01 to 06 on a
   contents list, a tab rail, section badges and two in-copy citations, 7 to 11 appearances
   each. Ours carried A to F once each, aria-hidden, and two of three judges named them as
   encoding nothing. A scheme on one surface is a label, and a label forces nothing. */
const SCHEME = /^(\d{2}|\d{2}\.\d+|[A-Z])$/;
// tokens repeating across three or more headings or sibling elements form a scheme;
// per scheme count three roles, then refuse a scheme found at exactly one:
//   declared  the token set appears inside a nav or a list of in-page links
//   worn      the token appears in or beside the heading of the section it names
//   cited     the token appears in body prose outside its own section, or in a control label
// A scheme whose tokens prefix-match a passing scheme (02.1 under 02) inherits its
// declaration. Name the tokens in the refusal so the fix is obvious.
```

### 4. verify.md, render question 3

Two edits, net zero bytes. In question 2, delete three words:

> 2. **What reads as a template first?** Name it. ~~There is always one.~~

That line is a fixed-count quota, which this file's own report contract forbids in its
first sentence: every obligatory section admits an empty answer. Then replace question 3:

```markdown
3. **Visible at 1440, and at 375 a different thing rather than a smaller one?** A
   signature that lives only in the design record is not one.
```

**No check ships with this.** The obvious one, comparing the signature's box orientation
and aspect ratio at both widths, misfires on signatures that are correct to keep their
shape: a repeated stamp, a monospaced rule, a colour field. It needs the written-reason
escape and a prototype run against all six builds first. Prose with no check behind it is
the weakest form this repository has, and this is one, on purpose, for one round.

### 5. floor/buy.md, the imagery obligation

Append to the paragraph under `### Imagery says what a photograph cannot`, keeping
"Treatment is free." last so the file's obligation-then-free-axis shape holds:

```markdown
More than one angle, treated alike across the catalogue. Scale is established
explicitly. Where the real photograph does not exist, a labelled placeholder naming
subject, crop and ground is a finished answer and a generated one is not. Drawings are a
set before they are drawings: one weight and ink for the object, a second reserved for
the one thing asserted. A drawing carrying reference marks repeats them in the running
text, and its caption says which kind of drawing it is, so a schematic is never read as
a measurement. Treatment is free.
```

+292 bytes, +73 tokens, landing BUY at 6165 of 6200 and REDESIGN at 7191 of 7200.

Two objective refusals in `gate.mjs`, and no more, or the script starts choosing inks:

- an inline `<svg>` with `role="img"` and no `<title>`
- a caption or legend whose enumerated tokens have no matching `<text>` or `id` inside the
  drawing it captions, because a key that resolves to nothing is a false key

The per-drawing stroke and colour sets may be **reported** side by side so an incoherent
set is visible, under a heading that states these are observations with no target value.
Never gated. Any printed count becomes a target under pressure.

## 3. What is deliberately not taken

**The lighting kit, 350 tokens, and the lane-field technique, 90.** Proposal 1's two
largest items. Q scored 18 on colour and signature against our 23. The curvature overlay
plus off-centre specular is a skeuomorph recipe written as physics, and the proposal
concedes that written as a recipe it converges on shaded plates. The lane field is the
single most transplantable shape in the whole pile, and this repository has failed the
convergence test four times, most recently on five shared moves across three builds that
each passed individual review. Neither may enter at any price.

**Everything else from Q.** The ten stop lists, the brass hexes, the moving hero band, the
label-left content-right body, the `--stille` reuse trick. The proposal is right that its
own body is category furniture, and right that our `verify.md` question 6 would fail Q
honestly answered. The check we own is adequate.

**T's palette, condensed uppercase grotesque, zero radii, keyline rule, sticky tab rail and
perforated divider.** Taken together they are a house style, and this repository has blocked
exactly that shape once already. Take the citation rule, not the rail.

**T's variable-axis type line, 46 tokens into SKILL.md.** The proposal rates it 0.4 and says
take it last or not at all. It is one step from condensed uppercase headings on every build,
which is the round-8 style already blocked, and there is no SKILL.md room left after item 3.

**U's rail as a shape, the hanging-numeral margin, `section:target` recolouring, the
five-layer drawing stack, and `signature-min-share: 6`.** All praised, all rejected. The
share threshold rewards making the signature bigger, which is the one direction that needs
no encouragement, and a share threshold is a script deciding a design.

**All five of S's prose techniques, 419 tokens.** The limit in its own main clause, the
absent figure answered in position, headings as predications, the named failure branch, the
varied quiet link. Well argued and not supported: S scored 23 on copy to our 24, and two of
three judges preferred ours. The two buy.md obligations at 136 and 125 tokens also break
REDESIGN on their own.

**S's opening refusal and its phone-only contact.** The refusal works because the business
genuinely cannot diagnose remotely and sells the diagnosis. A model told to open with a
refusal will manufacture one. "Prefer phone" is wrong for most surfaces.

**S's em dashes.** Its best line depends on one. Our gate refuses them at `copy/em-dash` and
the ban stays absolute. The full-stop version is better under our own rule anyway.

Everything above that is praised and rejected shares one property: **it works for one
subject.** A device that only works for one subject belongs to that build. The four
portfolio failures were all caused by writing one build's answer into the skill.

## 4. The motion question, answered

**Correct scope limit, not a gap.** Keep "one deliberate moment or none". Four reasons, in
order of weight:

1. **The evidence runs the other way.** Our arm shipped zero motion and placed first, and
   the AI-tell hunter listed it as a credit: "Zero animation, and a reduced-motion rule
   stated as a guard against later additions." U, also static, placed third. No judge
   penalised either for it.
2. **There is no room.** The proposal is 730 tokens for four obligations in a new file.
   After the five items above, REDESIGN has 9 tokens spare, and a new file costs its
   scenario every run. This is not a question of merit.
3. **`floor/buy.md` already forbids motion near money**, and buy is the package's main
   scenario. A scene model would be opened least where it is loudest.
4. **The licence position is bad.** `remotion-skills` has **no licence** and may not be
   copied at all. `scroll-world` is MIT and would need a `THIRD-PARTY-NOTICES.md` line for
   any lifted code. Neither builds websites. `scrub-engine.js` ships a complete house style
   (sky gradient, drifting particles, pill nav, numbered eyebrow-title-body copy block,
   route rail) and any three briefs mounting it produce three pages that look alike. It is
   the exact liability that cost this repository a portfolio four times.

**The smallest honest version, and the only thing worth importing.** It is not a scene
model. It is the inverse of a check we already run.

`scripts/verify.mjs` already renders with `reducedMotion: 'reduce'` at line 510 and already
fails on animation that survives the preference. It cannot see the opposite and far more
common defect: **a scroll-reveal page under reduced motion where the JavaScript is correctly
disabled and the content therefore stays at opacity 0 forever.** That page passes every
motion check by being blank. No prose could catch it, which is exactly the case where a
check is the only enforcement.

Where it lives: `scripts/verify.mjs` only, inside the existing reduced-motion pass. Zero
tokens, because `verify.md`'s Release commands block already names `verify.mjs` as the thing
that runs the render matrix and floor measures, so the new measure arrives under a sentence
that already exists.

Ship it **report-only for one round.** It needs exclusions for content legitimately hidden:
closed `<details>`, `[hidden]`, `aria-hidden`, off-screen skip links, and anything inside a
collapsed disclosure. U's build uses `details/summary` throughout and would false-positive
on a careless implementation. Prototype against all six s15 builds, confirm it flags nothing
there, and only then let it refuse.

Nothing else from either motion source enters the package.

## 5. What would have to be measured

Four portfolio rounds have taught that an unmeasured improvement relocates rather than
lands. Three of the five items here are self-measuring against artefacts already on disk,
which means the first measurement costs nothing and happens before anything ships.

**Before merge, against the six s15 builds:**

1. **Each new check must separate the arms, and the separation must be predicted first.**
   Predictions, recorded now: the drawing-colour check refuses P and T, passes U, passes S
   on colour and refuses it on stroke-width, does not fire on Q or R. The identifier check
   refuses P and passes T. A check that refuses all six or none of them is measuring
   nothing and must not merge.
2. **`node scripts/test-gate.mjs` and `test-ledger.mjs` gain a case per refusal**, including
   a negative case per check. The drawing check needs the `currentColor` case from S and the
   data-URI favicon case, both of which are real files, not invented fixtures.
3. **`node tools/context-budget.mjs` passes all six scenarios.** Verified for items 3, 4 and
   5 already: ALWAYS 3094, READ 5117, BUY 6165, OPERATE 6098, REDESIGN 7191, INSPECT 4598.

**After merge, and this is the part that has failed before:**

4. **A sealed brief, three builds, one prediction stated before the run.** The prediction is
   specific and falsifiable: no build ships an identifier scheme appearing at exactly one
   role, and no build ships an inline drawing outside the token system. Both are countable
   from the artefact with `grep`, by someone who did not build it. If either recurs, the
   rule did not land and the prose is doing nothing the check is not.
5. **The convergence test on the same three builds, because it is the one that has always
   failed.** Count moves shared by all three. The round-8 failure was five shared moves
   across three builds that each passed individual review, so **individual review is not the
   measurement**. If the three builds now share a drawing convention, an identifier scheme
   at three roles, and a caption that states its kind, this extraction has manufactured a
   house style and items 3 and 5 must come back out. That is the specific risk of taking
   anything at all from a comparison, and it is why the two largest proposals were refused.
6. **One rerun of the holdout brief when a second sealed brief exists**, watching one number:
   judge 3's colour-and-signature score for our arm, which was 6, our lowest score on any
   axis with any judge. Items 2 and 3 are aimed at it. If it does not move, they bought
   nothing and the tokens should go back.

**What cannot be measured yet, stated so it is not claimed:** whether any of this improves a
page for a real client. One brief, one trade, one language, three model judges, none
validated against a known-good and known-bad reference pair first. The holdout's own honest
limits section says so, and nothing here is stronger than the study it came from.
