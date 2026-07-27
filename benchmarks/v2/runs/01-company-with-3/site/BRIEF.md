# Kestrel Survey — brief

> Items 1–6 of the definition of done. Written before the first page.

## 1. Business goal and primary action

Kestrel Survey needs enquiries that arrive already carrying the building type and the
deadline, from property and asset managers who reached the site after a recommendation.
The visitor's action is: **call the practice, or email, with the building and the date.**

Per page, exactly one primary action. On every page except contact it is the header and
closing button **"Talk to a surveyor"**, which goes to `/contact.html`. On contact the
primary action is the telephone number itself, rendered as the heaviest element on the page;
the callback form is deliberately secondary.

The brief is explicit that a fifteen-field form is the wrong answer. The form here has three
required fields — building, deadline, how to reach you — which are the three things the
practice says it wants in an enquiry, and nothing else.

## 2. Audience and brand direction

Property managers and asset managers at agencies. They are not price-shopping. They are
checking three things: that the firm is real, that it has done this kind of building before,
and that the report will survive their client's solicitor.

> Multi-page company site for professionals who read documents for a living, in a ruled
> technical-document language — a survey report sheet, not a marketing page — leaning
> editorial rather than SaaS.

**What the page would lose if the accent were a different hue.** The accent is an oxide red
at the value a defect is circled in on a marked-up drawing. It means one thing on this site:
*act on this* — the primary action, links in prose, the current nav item, and one deliberate
accent rule per page. A blue would make the site read as a software product; a green as an
environmental consultancy. The red is the annotation the surveyor makes, and it is the only
colour on the page that is not stone.

## 3. Sitemap and information hierarchy

```
/                            Home
├── /services/defect-diagnosis.html    the service they are known for — listed first everywhere
├── /services/dilapidations.html
├── /services/building-surveys.html
├── /buildings.html                    the added page — see below
├── /about.html
└── /contact.html
```

Everything is one click from the header. Nothing is two clicks except the buildings detail,
which is also reachable from the home page.

**The three things that matter most on the home page, in order:**

1. What the practice does and that it is chartered and regulated — above the fold.
2. That defect diagnosis is the work they are known for, described concretely enough to be
   doubted.
3. That the building types on this site match the building the reader is holding.

**The page the brief needs, and why.** `/buildings.html`. The reader's second question —
*have they done this kind of building before* — does not belong inside any one service, and
it is the question a recommendation-checker actually arrives with. The brief names four
building types the practice is known for; each carries different failure modes and each
matters across all three services. Splitting it across three service pages would repeat it
three times and answer it in none. It is also the natural home for the client's own building
photographs once they are supplied.

## 4. Content and asset plan

**Copy.** Written from the brief only. Every fact on the site traces to one of:

| Fact used | Source |
| --- | --- |
| Founded 2004 | brief |
| Four chartered surveyors, RICS regulated | brief |
| Around 180 instructions a year | brief |
| Leeds base; Yorkshire and the North East | brief |
| Mill conversions, 1960s concrete-frame offices, retail parks, listed industrial | brief |
| No residential homebuyer reports | brief |
| "We are not the cheapest… we would rather turn down work than write something we cannot stand behind" | brief, quoted as the practice's own position |

Statutory and technical references — s.18(1) of the Landlord and Tenant Act 1927, the
Pre-Action Protocol for dilapidations, RICS Home Survey Levels — are public facts about the
discipline, not claims about this practice.

**No client is named and no testimonial appears**, because permission has not been asked for.
The site says so, on the home page, in place of a proof band. A page with no proof is honest;
a page with invented proof is the clearest tell there is.

**Images.** The practice owns photographs of buildings it has surveyed. None have been
supplied. Stock photography of handshakes or hard hats is excluded by the brief, and a
seeded placeholder service would put a stranger's building on a surveyor's site.

The resolution is two-part:

1. The home page uses an **editorial hero** — large type, no asset — because the statement
   carries the screen and there is no honest image to put beside it.
2. Every place a photograph belongs is a **labelled figure slot** in the report's own visual
   language: a ruled, hatched frame with a mono legend that states exactly which photograph
   goes there, at which crop. Eight slots across the site. They are the empty state for
   imagery: they say why they are empty and what would fill them.

**Values still pending from the practice**, all marked on the page where they appear:

| Pending | Where |
| --- | --- |
| Telephone number | contact, footer, CTA bands — currently `0113 496 0018`, from the Ofcom range reserved for fiction, so it cannot ring a real person |
| Email address | contact, footer — currently `enquiries@kestrelsurvey.co.uk` |
| Office address and hours | contact, footer |
| RICS firm registration number, PII insurer, complaints procedure | about |
| Eight building photographs | home (1), each service page (1), buildings (4) |
| Four surveyor profiles | about |

Structured data (`LocalBusiness` JSON-LD) is deliberately absent until the address and
telephone are real. Publishing placeholder contact details as machine-readable fact is worse
than publishing none.

## 5. Page inventory

| Page | Purpose | Primary action | Blocks |
| --- | --- | --- | --- |
| `/index.html` | Establish what the practice is, that defect diagnosis leads, and that the facts are checkable | Talk to a surveyor | site-bar, hero-editorial, facts-strip, sheet ×5, service-rows, building-cards, figure-slot, pull-quote, cta-band, footer-full |
| `/services/defect-diagnosis.html` | The service they are known for; what the work involves and what the report is built to survive | Talk to a surveyor | site-bar, page-head, sheet ×4, step-list, figure-slot, pull-quote, cta-band, footer-full |
| `/services/dilapidations.html` | Landlord and tenant work at lease end, and the conflict rule | Talk to a surveyor | site-bar, page-head, sheet ×4, step-list, figure-slot, cta-band, footer-full |
| `/services/building-surveys.html` | Pre-purchase commercial surveys, and the residential exclusion | Talk to a surveyor | site-bar, page-head, sheet ×4, step-list, figure-slot, cta-band, footer-full |
| `/buildings.html` | Answer "have you done this kind of building" with construction-level specifics | Talk to a surveyor | site-bar, page-head, sheet ×4, building-detail ×4, figure-slot ×4, cta-band, footer-full |
| `/about.html` | Establish the practice is real and regulated; carry the position on turning work down | Talk to a surveyor | site-bar, page-head, sheet ×5, facts-table, pull-quote, pending-panel ×2, cta-band, footer-full |
| `/contact.html` | Get a call or an email carrying the building and the deadline | Call the practice (the number itself) | site-bar, page-head, contact-panel, checklist, callback-form, exclusion-panel, footer-full |

## 6. Definition of done for this project

Beyond the generic fourteen:

- Static files served from a directory. No build step, no package install, no network
  request at runtime — the site renders identically offline.
- Rendered and read at 375, 768 and 1440, and again under a wider font substitution.
- Zero console errors, zero failed requests, zero dead links across all seven pages.
- axe clean in both colour schemes.
- No fact on any page that is not in the source table above, and every pending value visibly
  marked as pending on the page it appears on.
- Works with JavaScript disabled: the navigation is open rather than collapsed, and the
  contact page shows the email address in place of the form.
- **Signed off** when the practice has supplied the seven pending values in item 4. Until
  then the site is complete but not launchable, and the pending list is the handover.
