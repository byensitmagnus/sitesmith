---
title: "Pilot brief: Glarmester Nordlys"
fictional: true
surface: buy
stack: astro
sealed: 2026-08-03
ai_generated: "(C)"
---

# Glarmester Nordlys

> **Everything in this brief is fictional.** The company, the people, the prices, the
> address and the telephone number do not exist and are invented for this pilot. Any
> resemblance to a real glazier is coincidental. Nothing here may be presented as a fact
> about a real business, and the built site must say on the page that the company is a
> fictional example.

A glazier's workshop that cuts replacement panes for old windows and greenhouses, and
sells them by post or for collection. Three people, one workshop.

## Who it is for

People with a broken pane in something old: a 1920s casement, a Victorian greenhouse, a
garden frame, a shed window. They have a hole in their house today. They do not know what
"4 mm float" means, but they can hold a tape measure, and they know what the old glass
looked like.

## The problem the page must solve

A glazier's price depends on four things the customer already knows: the two measurements,
the glass type, and whether they collect it. Every glazier's site hides this behind "call
for a quote", so the customer rings, describes the window badly, and is told a number they
cannot check. **This page must give a real price from the customer's own measurements
before anyone picks up a telephone.**

## Facts (the only facts; nothing else may be stated as true)

### The workshop

- Founded 1954 by Verner Nordlys. Now run by his granddaughter Solvej Nordlys with two
  glaziers, Rikke Damm and Tobias Bjerg.
- Address: Glarmestervej 8, 8700 Horsens. Telephone 75 62 11 09.
- Open Monday to Thursday 07:30 to 15:30, Friday 07:30 to 12:00. Closed weekends.
- The cutting bench is 2,4 m long, which is why nothing larger than 2.200 mm leaves it.

### The four glass types, priced per square metre of finished pane

| type | thickness | price per m² | what it is for |
| --- | --- | --- | --- |
| Klart float | 4 mm | 640 kr | ordinary replacement, single-glazed windows and frames |
| Klart float | 6 mm | 890 kr | anything over 0,7 m², and greenhouse roofs |
| Valset katedral | 4 mm | 1.150 kr | textured, for bathrooms and doors, one side smooth |
| Trukket antikglas | 3 mm | 2.480 kr | drawn glass with movement in it, for listed windows |

- Minimum charge is 0,15 m² per pane, whatever the measurements.
- Every pane is cut to the millimetre from the measurements given and is not returnable,
  because a cut pane fits one window only.
- Trukket antikglas is cut from stock sheets and the workshop holds 11 m² of it. When that
  is gone it is gone; there is no reorder date.

### Ordering and delivery

- Panes up to 1.000 x 700 mm ship in a wooden crate, 285 kr anywhere in Denmark, 3 working
  days from cutting.
- Anything larger is collection only, from the workshop, because a crate that size does not
  survive a courier.
- Cutting takes 2 working days for float and katedral, 5 for antikglas.
- Payment on collection or on invoice with the crate. No card payment on the site.

### The trade's own words, which the page may use

Rude, sprosse, kitfals, linoliekit, glarmesterdiamant, skæreolie, sømfals, bundglasliste,
falsdybde, vaterpas. A pane is measured to the **falsmål**: the opening between the rebates,
minus 3 mm on each side so it can move with the timber.

### What the workshop will not do

- It does not fit glass. It cuts it. Fitting is the customer's or their carpenter's.
- It does not do double glazing, safety glass or mirrors.
- It does not quote from a photograph.

## The one journey the site exists for

**Measure → price → order.** A visitor enters two measurements in millimetres, picks a
glass type, says collect or crate, and gets a real total. They then send that exact
specification to the workshop as an order.

The order is a written specification, not a payment: it produces something the workshop can
cut from, and it says plainly that nothing is charged until collection or invoice.

## Required states

- **Empty.** Before any measurement is entered, the price area says what it will show, not
  "0 kr".
- **Loading.** The price is computed locally and appears immediately; if anything is ever
  awaited, the shape of the answer holds its place rather than the layout jumping.
- **Error, on the field that caused it.** Under 30 mm, over 2.200 mm, non-numeric,
  antikglas ordered beyond the 11 m² in stock, or a crate asked for on a pane too large.
- **Success.** The written specification, with the falsmål, the glass type, the area to
  three decimals, the price, the lead time and how it will be handed over.

## Constraints

- Danish copy throughout.
- **Astro**, with a real production build. No CMS, no database, no payment provider.
- The price calculation runs in the browser with no network call.
- Works at 375, 768 and 1440. Keyboard reachable throughout, visible focus.
- `prefers-reduced-motion` stops the work, not only the animation.
- No photography is supplied and none may be generated. Anything visual is CSS, SVG or
  type. If the page would be better with a photograph, name it as a missing asset.
- No reviews, no customer names, no counts of panes cut, no claims about quality or
  craftsmanship beyond the facts above.
- The page must state that Glarmester Nordlys is a fictional example built to demonstrate
  SiteSmith.
