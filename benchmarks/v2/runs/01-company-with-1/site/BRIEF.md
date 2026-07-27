# Kestrel Survey — brief

Items 1–6 of the sitesmith definition of done. Written before the first page.

---

## 1. Business goal and primary action

Kestrel Survey needs enquiries from property and asset managers who have already heard the
name, because the practice is chosen on recommendation and confirmed on the website. The
visitor's action is: **telephone or email with the building type and the deadline, and be
called back.**

One primary action sitewide, one label: **Talk to a surveyor**. It appears in the header, once
in the first screen of every page, and once at the end of the argument. On `contact.html` the
primary action is the telephone number itself, set as the heaviest element on the page.

**Deliberately no enquiry form.** The brief says it plainly: *"Not a form with fifteen fields;
they want to be called back."* A four-person practice taking around 180 instructions a year
does not need a queue; it needs the phone to ring with the building type and the date. The
contact page instead tells the reader exactly what to say, which is the useful half of a form
without the part that makes people leave.

## 2. Audience and brand direction

Property managers and asset managers at agencies. They arrive after a recommendation, or
comparing two or three firms. They are not price-shopping. They are checking three things, in
this order: is this firm real, have they done this kind of building, and will the report
survive their client's solicitor.

> **Direction.** A multi-page company site for commercial property professionals, in the
> language of the document the practice actually sells — a chartered surveyor's report.
> Ruled, numbered, set in a serif over warm paper, closer to a technical journal than to a
> professional-services website.

What the page would lose if the accent were another hue: the oxide red is the colour of red
lead paint on structural steel and of West Riding brick. Swap it for the sector-default blue
and the site becomes any consultancy in any city. It is used three times a page and never as
decoration.

## 3. Sitemap and information hierarchy

```
/                        home — the argument, in six sections
├── defect-diagnosis     the service they are known for; entry point for the other two
├── dilapidations        landlord and tenant, at lease end
├── building-surveys     pre-purchase, commercial
├── buildings            the building types they work on          ← added page, see below
├── practice             who the firm is, and how a report is written
└── contact             telephone, email, and what to tell us
404                      error page, reached by mistake rather than by link
```

Header navigation carries the five destinations in the order the reader needs them — defect
diagnosis first, because it is the service that brings the other two — plus the one action.

**The three things that matter most on the home page, in order:** what this firm is and who it
works for; that the practice is real and long-standing (2004, four chartered surveyors, RICS
regulated, around 180 instructions a year); and that reports are written to be defensible.

**Why `buildings` exists.** The brief names a question the reader asks that no service page
answers: *has this firm done this kind of building before?* Mill conversions, 1960s
concrete-frame offices, retail parks and listed industrial are four different problems, and a
manager with a 1968 frame wants to see that word before they ring. It is also the only page
whose content is genuinely photographic, so it is where the practice's own photographs of
surveyed buildings belong.

## 4. Content and asset plan

**Copy.** Written here from the brief and from ordinary chartered-practice terminology
(schedules of dilapidations, the Pre-Action Protocol, RICS home survey levels). Nothing is
attributed to a client, and no capability is claimed that the brief does not support.

**Every fact on the site, and where it comes from — all from the brief:**

| Fact | Used on |
| --- | --- |
| Founded 2004; twenty-second year | home, practice, footer |
| Four chartered surveyors, RICS regulated | home, practice, footer |
| Around 180 instructions a year | home, practice |
| Leeds office; work across Yorkshire and the North East | home, practice, contact, footer |
| Mill conversions, 1960s concrete-frame offices, retail parks, listed industrial | home, buildings, service pages |
| No residential homebuyer reports | home, building surveys, contact |
| *"We are not the cheapest…"* — the practice, in its own words | practice (pull quote), home (fees) |

**No client names anywhere.** Permission has not been asked for. The site says so rather than
leaving the absence to be noticed — a practice that will not name a client without asking is
making the same argument as a practice that will not write a report it cannot stand behind.

**No testimonials, no logo wall, no invented statistics.** The proof available is the firm's
own record, and that is what is used.

**Photography.** The practice owns photographs of buildings it has surveyed and is willing to
use them. Those files are not in hand, so every image is a **labelled plate**: a captioned
slot in the report's own visual language, stating the building type, the view and the crop
required. Dropping the real photograph in later is a one-line change per plate. No stock
photography of any kind, per the constraint — and none of handshakes or hard hats in
particular.

| Plate | Page | What belongs there |
| --- | --- | --- |
| 1 | home | Mill conversion, external elevation, daylight, 3:2 |
| 2 | home | 1960s concrete-frame office, corner elevation showing the frame, 3:2 |
| 3–6 | buildings | One per building type, elevation or defect detail, 3:2 |
| 7 | defect-diagnosis | A defect under investigation — opened-up detail, 3:2 |
| 8 | dilapidations | A commercial interior at lease end, 3:2 |
| 9 | building-surveys | A retail park or industrial unit, external, 3:2 |
| 10 | practice | The Leeds office or a survey in progress, 3:2 |

**Contact details are placeholders.** The brief supplies no telephone number, email address or
street address, and inventing them would put a fake fact on the page that matters most. The
number shown is inside the range Ofcom reserves for drama and cannot ring anyone; the site
says so, once per page, in the footer.

## 5. Page inventory

| Page | Purpose | Primary action | Blocks |
| --- | --- | --- | --- |
| `index.html` | The whole argument in six sections | Talk to a surveyor | masthead, hero-editorial, facts-strip, ruled-list ×2, plate-row, quote, cta-band, footer |
| `defect-diagnosis.html` | The flagship service: cause established, liability locatable | Talk to a surveyor | masthead, page-head, section ×4, plate, ruled-list, cta-band, footer |
| `dilapidations.html` | Schedules and responses at lease end, both sides | Talk to a surveyor | masthead, page-head, section ×4, plate, ruled-list, cta-band, footer |
| `building-surveys.html` | Pre-purchase commercial, and what it is not | Talk to a surveyor | masthead, page-head, section ×4, plate, ruled-list, cta-band, footer |
| `buildings.html` | Proof of building-type experience | Talk to a surveyor | masthead, page-head, plate-row ×4, cta-band, footer |
| `practice.html` | Is this firm real, and how is a report written | Talk to a surveyor | masthead, page-head, facts-strip, section ×3, quote, plate, cta-band, footer |
| `contact.html` | Get the call started with the right two facts | Telephone the practice | masthead, page-head, contact-panel, ruled-list, footer |
| `404.html` | Page-level error state | Return to the home page | masthead, page-head, ruled-list, footer |

## 6. Definition of done for this project

The generic list is `00-done.md`. Specific to this build:

- Static HTML and CSS served from a directory. No build step, no dependencies, no external
  requests — the site works offline and on a bare host.
- Every page renders without horizontal overflow at 375, 768 and 1440, and again under a
  substituted wider font.
- Zero console errors, zero failed requests, zero `href="#"`.
- AA contrast in both colour schemes, checked rather than assumed.
- Every value on every page comes from `DESIGN-SYSTEM.md` or its one-off table.
- **Not launchable until the practice supplies:** the telephone number, the enquiry inbox, the
  office address, the four surveyors' names and RICS status, and the ten photographs named
  above. Those are the five blanks, each marked as a placeholder on the page it appears on;
  nothing else is waiting on the client.
