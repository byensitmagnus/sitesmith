# Mode M — marketing

> Original work, MIT. Company sites, services, launches, portfolios, editorial. The visitor
> is deciding whether to care, and they will decide in about eight seconds.

Twelve decisions. Each is an answer, not a range.

---

## Contents

- [1. Argument shape](#1-argument-shape)
- [2. Hero family](#2-hero-family)
- [3. Density](#3-density)
- [4. Radius](#4-radius)
- [5. Imagery](#5-imagery)
- [6. Motion](#6-motion)
- [7. Colour emphasis](#7-colour-emphasis)
- [8. Proof](#8-proof)
- [9. Navigation](#9-navigation)
- [10. The primary action](#10-the-primary-action)
- [11. Content density](#11-content-density)
- [12. Failure modes](#12-failure-modes)

---

## 1. Argument shape

The page is an argument, in this order:

1. **What this is** — one sentence a stranger understands, above the fold.
2. **Why it matters to you** — the reader's problem, named in their words.
3. **How it works** — the mechanism, concretely enough to be doubted.
4. **Why believe it** — proof, in the form section 8 gives you.
5. **What it costs** — money, time or commitment. Not answering this is answering it badly.
6. **What to do next** — one action.

Six sections is a complete page. Nine is a page hiding an argument it has not made. Cut
before you add.

**The first screen must establish two things:** what this is, and who it is for. A headline
that could sit on a competitor's site has established neither.

## 2. The first screen

**The outcome:** a stranger knows what this is and who it is for, and the one action is
reachable, before they scroll. Everything else about the first screen is open.

There is no default arrangement here. The arrangement is chosen in the direction lab, from
the evidence, and it is the axis the three comps are *required* to differ on. Naming a
default is how nine subjects end up with the same hero — the default gets reached for, and
the alternatives are never built.

**How the arrangement is decided:** whatever the subject's strongest true material is, that
is what the first screen is built around.

| If the strongest true material is | The first screen is built around |
| --- | --- |
| Photography the client owns of the actual work | that photograph, at whatever size makes it evidence rather than decoration |
| A statement only this client could make | the words, at a size that makes them the object |
| The product's own interface, real and legible in one frame | that interface |
| An index of work, cases or writing | the index, starting immediately |
| A single object the client makes | the object |
| Nothing yet — assets are `needed` | the words, and the manifest says what will replace them |

Two consequences worth stating. A **div-built fake product screenshot is banned** — if the
interface is the material, it is a real screenshot or it is not that material. And an
arrangement chosen because it is what marketing pages look like is the failure in section 12
item 3, whichever arrangement it is.

**What holds regardless:** headline ≤ 2 lines at 1440, subtext ≤ 4 lines, the primary action
visible without scrolling. If the action needs a scroll, the first screen is too tall.

## 3. Density

**The outcome:** the argument reads as separated steps, and a visitor can tell where one
point ends and the next begins without a border telling them.

That is what space is doing in this mode, and it is why marketing sits at the open end of
whatever ramp the contract defines. The specific numbers come from the contract, which comes
from the winning comp — a page whose material is a full-bleed photograph and a page whose
material is a paragraph do not want the same measure or the same section gap.

**What holds regardless:** body measure between roughly 55 and 75 characters. Section gaps
from the same ramp as everything else, not picked by eye. Few type sizes, used hard — a
marketing page with nine sizes has a scale, not a hierarchy.

## 4. Radius

**The outcome:** edges look like a decision. Whether that decision is 16px, 2px or none is a
property of the direction, not of the mode.

**What holds regardless:** two values plus `full` for avatars, at most. **What is inside a
container is tighter than the container** — a button inside a card that shares the card's
radius reads as a mistake. And the value is declared in the contract, so the next page knows
it.

There is no global radius rule in sitesmith and there is no marketing radius either. A
practice whose work is precise and rectilinear and a nursery whose work is not should not
arrive at the same corner.

## 5. Imagery

**Images are mandatory in this mode.** A marketing page with no imagery is either editorial
(mode M, manifesto hero, where the type is the image) or unfinished.

Order of preference:

1. Real photography or real product shots the client owns.
2. Generated imagery, if a tool is available, art-directed to one treatment.
3. A seeded placeholder service, so the crop and colour are at least stable between loads.
4. An explicitly labelled placeholder slot, stating what belongs there.

**Never**: hand-rolled decorative SVG blobs, and never a div-built fake product screenshot.
A typeset excerpt of real output is allowed and must be labelled as an excerpt.

One treatment across the site: same crop logic, same aspect ratios, same colour handling. Two
photographic treatments on one page is two brands.

## 6. Motion

**Entrance only, and once.** A short fade-and-rise on first view, staggered by no more than
three elements. `--motion-base`. Everything else is still.

Scroll-driven effects are allowed for exactly one thing per page, and only when the motion
explains a relationship — a sequence revealing in order, a figure counting to its value.
Parallax on a decorative image is not that.

Nothing moves in a form. Nothing delays a click.

## 7. Colour emphasis

**The accent works hard and appears rarely.** It is the primary action, the current nav item,
and one deliberate accent moment. Three places on a page, not thirty.

Neutrals carry the page. If the accent is doing the layout's job, the layout is not working.

Semantic status colour is usually **not** in play in this mode. If a page needs success and
error states — a contact form — they come from the contract's semantic group and do not
count against the one-accent rule.

## 8. Proof

In descending order of strength, use the strongest you actually have:

1. **A named customer saying something specific**, with their role and company, that they
   would recognise as their own words.
2. **A number with a source** — measured, dated and attributable.
3. **A real logo wall**, actual customers, logos only, no category labels beneath them.
4. **A case, told briefly** — situation, what changed, what happened.
5. **Nothing.** A page with no proof is honest. A page with invented proof is the single
   clearest tell that a machine wrote it.

Fabricated testimonials, invented logos and made-up metrics are absolute. There is no brief
that makes them acceptable.

## 9. Navigation

One line at 1440, height ≤ 80px, five destinations at most plus one action. If the site needs
more than five, the sitemap is wrong, not the nav.

A mega-menu is legitimate above roughly twelve destinations — a large catalogue, a multi-brand
company. Below that it is furniture.

On a phone: a real disclosure, the current item marked, and the primary action visible
without opening it.

## 10. The primary action

Above the fold, repeated once at the end of the argument, and once more only if the page is
genuinely long. Three appearances maximum.

Label it with the outcome, not the mechanism: "Book a survey", not "Submit". Two actions with
the same intent — "Get in touch" and "Let's talk" on one page — is a page that could not
decide.

## 11. Content density

Two to four short paragraphs per section, or one paragraph and a list. A section exists to
make one point; if it makes two, it is two sections.

Sub-paragraphs under about 25 words. Headings that describe rather than label.

## 12. Failure modes

The three ways marketing pages go wrong here, in order of frequency:

1. **A beautiful hero over no argument.** Sections 2 to 5 of the shape are missing and
   replaced by three feature cards. Test: delete every image and panel, read what is left. If
   it does not persuade in plain text, the design was carrying an empty page.
2. **Invented proof.** Statistics that exist to fill a band. This is the tell that survives
   every other improvement.
3. **No signature.** Technically correct, tonally interchangeable. Ask what the page would
   lose if the accent were a different hue; if nothing, no direction was chosen.
