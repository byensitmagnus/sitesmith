---
title: "Pilot brief: Slusevagten"
fictional: true
surface: operate
stack: astro
sealed: 2026-08-03
ai_generated: "(C)"
---

# Slusevagten

> **Everything in this brief is fictional.** The lock, the vessels, the crew, the readings
> and the times do not exist and were invented for this pilot. Nothing here may be presented
> as a fact about a real waterway, and the built page must say on the page that the operation
> is a fictional example.

The overnight console for one person keeping a single canal lock working: a screen they have
open on a second monitor from 22:00 to 06:00, looked at every few minutes, mostly not read.

## Who it is for

One lock keeper, on shift, alone. They know the lock better than any screen does. They are
not deciding whether to trust the equipment; they are deciding **what to walk out and look
at next**, in the dark, in the rain, with a torch. The screen's job is to rank the night.

## The problem the page must solve

The lock's own instruments each have their own display, in their own units, updated at their
own intervals, and none of them says which reading matters most right now. So the keeper
walks the length of the lock every hour whether anything needs it or not, and finds out about
a stuck gate when a skipper radios.

**This screen must sort the night by what is closest to going wrong, and be honest about
which readings it cannot vouch for.**

## Facts (the only facts; nothing else may be stated as true)

### The lock

- Bjerregaard Sluse, a single chamber on a fictional canal. Chamber 42 m long, 6,4 m wide.
- Two gate pairs: **Nord** and **Syd**. Each pair has a left and right leaf.
- Normal cycle: 11 minutes. Anything over 16 minutes is logged as slow.
- The keeper is on shift 22:00 to 06:00. One keeper, no relief.

### What is measured, and how often

| reading | unit | interval | what a bad value means |
| --- | --- | --- | --- |
| Kammervandstand | cm above datum | every 30 s | outside 210 to 340 the gates will not release |
| Portvinkel, per leaf | degrees, 0 closed to 83 open | every 10 s | a leaf under 80 when the pair reports open is a leaf that has not finished |
| Hydraulisk tryk | bar | every 10 s | under 118 bar a gate will stall halfway |
| Portmotor temperatur | degrees C | every 60 s | over 74 the motor cuts out and stays out until it cools |
| Vandtemperatur | degrees C | every 15 min | not operational; recorded for the biologists |

- Readings arrive over one radio link from the lock house. **When the link drops, the last
  value stays on screen and stops being true.** The screen must say how old every number is.
- The 22:00 to 06:00 shift is 8 hours. On a normal night the lock cycles 9 to 14 times.

### The night of 3 August, which is the night this screen shows

- 23:14, Syd right leaf reached 76 degrees and stopped. Cycle took 19 minutes. Logged slow.
- 01:02, hydraulic pressure dipped to 114 bar for 40 seconds during a cycle, then recovered.
- 02:40, the radio link dropped for 6 minutes. Four readings are missing from that window and
  are missing, not zero.
- 03:55, Nord motor reached 71 degrees, three under the cut-out, and has not come down.
- Everything else is ordinary. Eleven cycles completed. Chamber level has stayed between 244
  and 302 cm all night.

### What the keeper can do from this screen

- **Acknowledge** an item, which does not fix it and says so: it moves the item out of the
  top band and records who acknowledged it and when.
- **Request a hold** on the next cycle, which asks the lock house to not accept the next
  vessel until the keeper releases it. This is a request over the same radio link, so it can
  fail, and the screen must show it in flight and show it failing.
- Nothing else. This screen does not open gates, does not reset motors and does not silence
  alarms, and it must not appear to.

## The one journey the site exists for

**Rank the night, act on the top item, and see the act land or fail.** The keeper opens the
screen, reads what is closest to going wrong, acknowledges it or requests a hold, and watches
the request either reach the lock house or fail on the radio link.

## Required states

- **Empty.** Before any reading has arrived at all, at the start of a shift, the screen says
  what it is waiting for and from where, not zeroes.
- **Loading.** A request in flight is acknowledged locally within a tenth of a second and
  keeps its place, and the surface is never blanked.
- **Partial.** The radio window from 02:40 to 02:46 has no readings. That is missing, not
  zero, and the display must say which four readings are missing rather than interpolating.
- **Error.** A hold request that fails on the radio link says so on the item it was made
  against, says the request did not reach the lock house, and leaves the item unchanged.
- **Success.** An acknowledged item moves out of the top band, keeps its history, and shows
  who acknowledged it and at what time.
- **Stale.** Every number carries how old it is. Past two intervals it is marked as not
  current, and it stops being presented as a reading.

## Constraints

- Danish copy throughout.
- **Astro**, with a real production build. No CMS, no database, no live connection: the
  night of 3 August is fixed data in the page.
- Works at 375, 768 and 1440. The keeper uses it on a second monitor and on a telephone in a
  coat pocket, so both matter. Keyboard reachable throughout, visible focus.
- `prefers-reduced-motion` stops the work, not only the animation.
- No photography is supplied and none may be generated. Anything visual is CSS, SVG or type.
- No invented instrument readings beyond the ones above. No claims about safety, reliability
  or uptime.
- The page must state that Bjerregaard Sluse is a fictional example built to demonstrate
  SiteSmith.

## What this brief will not accept

- A dashboard of equal cards. The night is not equal and a screen that shows it equally has
  sorted nothing.
- A chart library's default palette carrying the difference between readings.
- A number with no age on it.
- A control that looks like it operates the lock.
