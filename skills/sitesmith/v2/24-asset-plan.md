# 24 — the asset plan

> Original work, MIT. Written after the evidence pack and the brand inventory, and **before
> anything is sourced or generated** — the plan decides the picture, not the other way round.
> Output: `ASSET-PLAN.md`. Gated by `scripts/asset-plan.mjs`, and again at the production gate,
> where `DIRECTION.md` exists and the two can be held against each other.

## Contents

- [Why this step exists](#why-this-step-exists)
- [The four kinds, and what each is for](#the-four-kinds-and-what-each-is-for)
- [The plan, verbatim](#the-plan-verbatim)
- [The load-bearing rule](#the-load-bearing-rule)
- [Marks, and customer logos, which are not the same thing](#marks-and-customer-logos-which-are-not-the-same-thing)
- [What is never an answer](#what-is-never-an-answer)
- [Checking](#checking)

## Why this step exists

Three sites were built by three agents who never met, from three unrelated briefs, using every
other part of this skill. Two independent reviewers scored them on seven criteria. Assets came
back **6 out of 10 on five of the six reviews and 7 on the sixth** — the lowest criterion on
every page, and the only one where no page reached 8. `production-gate` reached the same place
from the other side without seeing a screenshot.

Read the criticisms together and they are one criticism:

- Five rope constructions listed one per row, so the rigger who came to *compare* three-strand
  against eight-plait can never hold two of them in the eye at once. The only real side-by-side
  on the page is a text table with no pictures in it.
- A third of two full desktop screens given to an out-of-focus diagonal of metal, uncaptioned,
  on a page that had twice taught the reader to expect a caption. Both reviewers, independently,
  said it read as a wall rather than a bell.
- A row that drops its photograph and its whole left column to signal "out of stock", which
  reads as a broken image slot rather than a deliberate state.

None of those is a sourcing problem. Every one of those pictures existed, was licensed, was
recorded, and was correctly cropped. `26-visual-assets.md` did its job. What was missing was
one step earlier: **nobody had written down what each picture was supposed to do.**

An asset plan is not a list of images. It is the argument each image is carrying, and the
visitor's job it serves. A picture that cannot answer that is decoration, and decoration is
what "AI-generated" looks like from across the room.

## The four kinds, and what each is for

| kind | what it is | what it earns |
| --- | --- | --- |
| `brand` | the mark, the favicon, the one device the site is recognisable by | recognition, and the sense that someone owns this |
| `product` | the thing being sold, made or operated, shown as it actually is | the visitor can tell one option from another |
| `editorial` | the trade, the place, the process, the people at work | the visitor believes the trade is real and knows what it feels like |
| `proof` | the drawing, the measurement, the certificate, the before and after | the visitor believes a specific claim, because it is shown |

The kinds are a checklist for *thinking*, not a quota. A page with no `product` assets is fine
if nothing is being chosen between. A page with no `editorial` assets is fine. A page with no
`proof` assets is fine right up until it makes a claim it expects to be taken on faith.

What is not fine is having no idea which kind a given picture is, because that is the state in
which a photograph of some metal ends up occupying two screens.

## The plan, verbatim

`ASSET-PLAN.md` carries one block per asset. As with the axis record, **the shape is a
contract**: `scripts/asset-plan.mjs` parses it, and prose headings do not parse.

```markdown
## `hero-rack`

- kind: product
- carries: that these are five different constructions, not five colours of one rope
- job: choose a construction for a named job
- use: one photograph, five ropes side by side at the same scale, above the spec table
- comparative: yes — five subjects in one frame
- without-it: the page asserts the constructions differ and never shows it
- evidence: EVIDENCE.md "five stock constructions, bench shoot 2026-07-14"
```

Every field is required and every one is a sentence, not a word:

- **kind** — one of `brand`, `product`, `editorial`, `proof`.
- **carries** — the one thing the visitor learns, or can do, because this exists. If the honest
  answer is "it makes the page look less empty", the asset is cut. That is the whole test.
- **job** — the visitor's job, taken from the brief. Not "build trust". A job from the brief.
- **use** — scale, placement, and what it sits next to. "Hero image" is not a use.
- **comparative** — `yes` or `no`. **If the visitor's job is to choose between things, at least
  one asset must be `comparative: yes`.** A page that invites a comparison and then shows the
  options one screen apart has not made the comparison possible; it has mentioned it.
- **without-it** — what the page loses. "Nothing" is a valid answer and it means: cut it.
- **evidence** — the `EVIDENCE.md` line this rests on, or `none — brand asset` / `none — drawn
  for this project`. A `proof` asset with `evidence: none` does not pass.

## The load-bearing rule

**At least one asset must be load-bearing for the visitor's primary job — or `DIRECTION.md`
must declare imagery is not load-bearing, and mean it.**

`imagery: deliberately imageless` is a real direction and a strong one for trades whose world
is not photogenic. Choosing it is honest. Drifting into it because the pictures were never
planned is what produced nine legacy pages carrying one `<img>` between them.

So the rule has two doors and no third. Either an asset carries the job, or the direction says
imagery does not carry it and the typography is doing that work instead. What fails is a page
with four decorative photographs and a direction that claims to be photography-led.

This is deliberately **not** a mandatory component. Nothing here says "you must have a hero
image", "you must have a logo wall", or "you must have four kinds". It says the assets on the
page must be the ones the page needs, and you must have written down which those are.

## Marks, and customer logos, which are not the same thing

Two rules that both get called "the logo rule" and are opposites.

**The site's own mark.** If the page renders a brand mark — and nearly every page does — it is
an asset and it is a manifest row. All three round-7 builds drew a mark. None of the three
recorded it. That is not three oversights, it is a missing instruction, and this is it.

A rounded rectangle filled with the accent colour is not a mark, it is the shape of a mark.
Acceptable, in order: the client's real logo file; a wordmark set in the display face with a
deliberate adjustment; a drawn mark. An empty `<i>` or `<span>` with `background: var(--accent)`
is not one of the three.

**Customer, partner and certification logos.** A row of other people's marks is the strongest
proof a page can carry and the easiest to fake, so:

- **Only when the brief carries real, named evidence.** A named client, a named partner, a
  named certification with a number, in `EVIDENCE.md`, sourced. Not "trusted by leading firms".
- **Then it is required, not optional.** If the brief hands you three named clients who agreed
  to be named, leaving them off is throwing away the best evidence on the page.
- **Never invented.** Not a plausible-sounding company. Not a generic shield that reads as a
  certification. Not a real company's mark without permission recorded in `licence`.
- **Never a substitute.** There is no `substitute` state for a customer logo. A stand-in
  customer logo is a fabricated endorsement, which is the same failure as a fabricated
  testimonial and is barred for the same reason.

If the brief has no such evidence, the page does not have a logo wall. It makes its case some
other way, which is usually a better page anyway.

## What is never an answer

These are barred outright, not scored down:

- **A generic mark.** A shape that would fit any business in the category. If swapping the
  wordmark for a competitor's name would leave the mark equally apt, it is not a mark.
- **Decorative filler.** An image whose `carries:` line cannot be written. Abstract gradients,
  unrelated stock, a texture occupying a third of the screen because the section felt short.
- **The AI-default composition.** The centred hero over a soft gradient; the three-up feature
  grid of circular icons; the isometric illustration of abstract figures; the dashboard
  screenshot floating at a slight angle with a drop shadow. These are not banned because they
  are ugly. They are banned because they are what every generated page produces, which means
  they carry no information about *this* subject at all.
- **A caption-shaped label that says nothing.** "Our work". "Quality you can trust". If the
  photograph needs a caption, the caption says what is in the photograph.

The rules against fabricated testimonials, invented metrics, unsourced prices and unverifiable
claims are unchanged and are not weakened by anything here. An asset is evidence, and evidence
that was made up is worse than no evidence.

## Checking

```bash
node scripts/asset-plan.mjs check ASSET-PLAN.md                       # shape and completeness
node scripts/asset-plan.mjs check ASSET-PLAN.md --manifest ASSET-MANIFEST.md --direction DIRECTION.md
```

The second form is the one that matters: it holds the plan against the manifest that must
deliver it and the direction that must permit it. The production gate runs it again at the end,
so a plan written and then quietly departed from fails before the build is called finished.
