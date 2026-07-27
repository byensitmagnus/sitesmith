# BRIEF — Kestrel Survey

Items 1 to 6 of `00-done.md`. Written before the first page.

**Mode: M (marketing).** Every page on this site is a company/service page. No catalogue, no
authenticated product surface.

---

## 1. Business goal and primary action

Kestrel Survey needs enquiries that arrive already scoped, because the practice's cost is the
twenty calls a week it spends telling people it does not do residential homebuyer reports, and
because a defect instruction it cannot meet the deadline on is one it would rather decline on
the first call than deliver late.

**The visitor's action is: send an enquiry naming the building and the deadline** — by phone
first, by email second, by a four-field callback request third.

One primary action per page:

| Page | Primary action |
| --- | --- |
| `index.html` | Start an enquiry |
| `defect-diagnosis.html` | Start an enquiry |
| `dilapidations.html` | Start an enquiry |
| `pre-purchase-surveys.html` | Start an enquiry |
| `buildings.html` | Start an enquiry |
| `about.html` | Start an enquiry |
| `contact.html` | Call the practice — the enquiry form is the secondary route |

Secondary actions (read a service page, call instead of writing) are link-weight. The only
filled button on any page is the primary action.

## 2. Audience and brand direction

Property and asset managers at agencies. They arrive on a recommendation with a name already
in mind, or with two or three firms to separate. They are not price-shopping. In eight seconds
they are answering three questions: **is this firm real, has it seen this kind of building
before, and will the report survive being disagreed with.**

> Reading this as: a small chartered practice's company site for property managers who will be
> forwarding the report to a solicitor, in a documentary language closer to a surveyor's
> written finding than to a professional-services marketing site.

**What the page would lose if the accent were a different hue.** The accent is a muted oxide
brick — the colour of the buildings this practice is called to in Leeds and of a surveyor's
marking crayon. Turn it blue and the site becomes any consultancy; turn it bright and it
contradicts a firm whose whole pitch is that it is sober enough to be believed. It is warm,
old, and slightly severe, which is the register of the client's own quote.

## 3. Sitemap and information hierarchy

```
index.html                  home — the argument
├── defect-diagnosis.html   service 01 (lead service)
├── dilapidations.html      service 02
├── pre-purchase-surveys.html  service 03
├── buildings.html          building types — the "have you done one of these" page
├── about.html              the practice
└── contact.html            the enquiry
```

Everything is one click from the header. Nothing is two.

**The three things that matter most on the home page, in order:**

1. What this is and who it is for — including, immediately, what it is *not* (no residential).
2. Defect diagnosis first. The brief is explicit that it is the service they are known for and
   the one that brings the other two, so it leads the nav, leads the services section, and gets
   the weighted row.
3. That the reports hold up — the standard, the facts, and the refusal to publish client names.

**The extra page, and why.** `buildings.html` is beyond the stated minimum. The brief says the
reader is checking whether the firm "has done this kind of building before", and separately
that no client may be named because permission has not been asked. Those two facts collide:
the normal answer (case studies) is unavailable. A page organised by *building type* rather
than by client answers the question without naming anyone, and it is the only page where the
practice's own photographs of surveyed buildings belong.

## 4. Content and asset plan

**Copy** is written from the brief and from general building-surveying practice. It is the
practice's to approve before launch.

**Facts used, and their source.** Everything below is from the brief:

| Fact on the site | Source |
| --- | --- |
| Founded 2004 | brief |
| Four chartered surveyors, RICS regulated | brief |
| About 180 instructions a year | brief |
| Leeds; work across Yorkshire and the North East | brief |
| Mill conversions, 1960s concrete-frame offices, retail parks, listed industrial | brief |
| No residential homebuyer reports | brief |
| "We are not the cheapest…" pull quote, `about.html` and `index.html` | brief, verbatim |

**Nothing else is a fact about this practice.** There are no client names, no logos, no
testimonials, no completion counts, no response times and no fee figures anywhere on the site,
because none were supplied and inventing them is the thing that would make the site useless to
the reader it is written for.

**Statements that are professional-practice background, not claims about Kestrel** — these
describe how this kind of work is done generally, and are marked here so the practice can
confirm they match how it actually works:

- Reports prepared for proceedings are written to CPR Part 35 and the expert's duty is to the
  court. *(Confirm the practice takes expert instructions.)*
- The dilapidations pre-action protocol, the surveyor's endorsement, and the usual 56-day
  convention. *(Standard; confirm the practice quotes 56 days.)*
- Section 18(1) of the Landlord and Tenant Act 1927 caps damages at the diminution in the value
  of the reversion. *(Statute; no confirmation needed.)*
- The practice does not act for both sides on the same building. *(Confirm.)*
- RICS-regulated firms hold professional indemnity insurance and operate a complaints handling
  procedure. *(Requirement of RICS regulation; confirm the wording.)*
- "If you need references, ask us on the phone." *(Confirm the practice is willing.)*

**Contact details are placeholders.** The telephone number is in the Ofcom drama range
(`0113 496 0xxx`), reserved so that published numbers cannot ring a real subscriber. The email
address and the absence of a street address are placeholders too. This is stated on
`contact.html` and in the footer of every page. **Replace before launch.**

**Assets.** Photography only, and only the practice's own photographs of buildings it has
surveyed. No stock, no handshakes, no hard hats, no illustration, no decorative SVG. Because
the photographs have not been supplied, `buildings.html` carries four **labelled** slots, each
naming the exact photograph that belongs there — subject, viewpoint, aspect ratio and light.
Every other page is set type; that is a decision, not a shortfall, and it is why the hero is
editorial rather than split.

## 5. Page inventory

| Page | Purpose | Primary action | Blocks |
| --- | --- | --- | --- |
| `index.html` | The whole argument in five numbered sections | Start an enquiry | masthead, stamp, hero (`--home`), nope, facts, sec, rows (`is-lead`), quote, band, footer |
| `defect-diagnosis.html` | The lead service, in enough detail to be doubted | Start an enquiry | masthead, stamp, hero, sec, rows, steps, faq, band, footer |
| `dilapidations.html` | Both sides of a lease-end schedule | Start an enquiry | masthead, stamp, hero, sec, rows, steps, faq, band, footer |
| `pre-purchase-surveys.html` | What an acquisition report covers and excludes | Start an enquiry | masthead, stamp, hero, sec, rows, steps, faq, band, footer |
| `buildings.html` | "Have you done one of these" without naming clients | Start an enquiry | masthead, stamp, hero, sec, pair, slot, checks, band, footer |
| `about.html` | Is this firm real | Start an enquiry | masthead, stamp, hero, facts, sec, quote, nope, tbc, band, footer |
| `contact.html` | The enquiry itself | Call the practice | masthead, stamp, hero, sec, btn (`--big`), checks, tbc, form, summary, done, rows, footer |

## 6. Definition of done for this project

Beyond `00-done.md`:

- **Browsers.** Current Chrome, Safari, Firefox and Edge. No build step, no framework, no
  dependency the practice would have to keep patched — the site is HTML and one stylesheet, and
  a general practice surveyor can edit a paragraph in it.
- **Locale.** en-GB. British spelling, DD Month YYYY dates, £ before the figure.
- **Legal.** Company registration number, VAT number, registered office and the RICS firm
  regulation number all need to be added to the footer before launch. They are named as missing
  rather than invented.
- **Analytics.** None. Nothing is loaded from a third-party origin, so the site sets no cookies
  and needs no consent banner. If the practice later wants numbers, that is a decision with a
  cookie notice attached.
- **Launched means:** real contact details in, four photographs in, the six background
  statements above confirmed, and the copy signed off by the practice.
- **Signed off by:** the practice.
