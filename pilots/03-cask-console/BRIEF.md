# BRIEF — Stalbridge Brewery cask desk

> Verified input. Survives the rebuild. Nothing here describes a design.

## The subject

The cellar desk of a small brewery, tracking casks that are out on trade at pubs and need to
come back. The subject is fictional; the trade, the cask sizes and the duty rules are not, and
the working detail is in [`EVIDENCE.md`](EVIDENCE.md).

## What the site is

**A production product UI** — a tool somebody actually uses in a cellar at 06:40 with a dray
arriving at 07:15. Not a marketing page about a tool. There is no hero.

## Who uses it and what they came to do

A cellarman, standing, often in gloves, often at arm's length from the screen. They need to:

1. see **what is overdue**, first and unmistakably, before anything that is merely due;
2. see how many casks are at each pub and what size they are;
3. **book a consignment back in** — recording condition and ullage — without leaving the row;
4. have that booking persist, so the desk still shows it after a reload.

## Constraints that are not negotiable

- Operational severity is the order: **overdue, then due today, then on trade**. Any other
  ordering is wrong for the room.
- A cask booked in is a duty-relevant record. Condition and ullage are part of the booking, not
  optional extras.
- The figures — gyles, cask counts, sizes, days late — are the working week in `EVIDENCE.md`.
- Cask sizes are the trade's own: firkin 9 gallons, kilderkin 18, barrel 36.

## Success

A cellarman crossing the room can tell at a glance what is late, and can complete a book-in
**without scrolling and without opening anything to find the controls**.
