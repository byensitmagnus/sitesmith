# Production report, Byens IT front page

Built with `skills/sitesmith-v3`, surface `buy`, stack `static`.

## Files opened

- `skills/sitesmith-v3/SKILL.md`
- `skills/sitesmith-v3/run.md`
- `skills/sitesmith-v3/floor/buy.md`
- `skills/sitesmith-v3/motion.md`
- `skills/sitesmith-v3/stacks/static.md`

## Where the facts came from

Every number and name on the page was read off `byens-it.dk` on 2 August 2026 and none
was supplied from general knowledge:

| Claim on the page | Source |
| --- | --- |
| 2 års garanti | byens-it.dk, stated on the front page |
| 14 dages fortrydelsesret | byens-it.dk, stated on the front page |
| Gaming-pc'er fra 5.549 kr. | byens-it.dk campaign line, "Gaming-PC'er fra 5.549 kr." |
| Ternevej 7, 3300 Frederiksværk, and Vanløse | byens-it.dk footer |
| CVR 46491661, 71 77 19 09 | byens-it.dk footer |
| Gaming and business IT are both the business | byens-it.dk service list and the erhverv page |
| Every outbound link | copied from byens-it.dk, not constructed from menu labels |

What is deliberately absent: number of builds, years in business, delivery times, staff
count, review scores. None of them is stated anywhere on the site, so none of them is on
this page. The visible source note at the bottom of JOB 03 says so to the reader.

The price is a campaign price, and the page says "i den kampagne, der kører nu" rather
than presenting it as a standing from-price. It has to be rechecked before this goes
anywhere near production.

## Motion

Level 1 from `motion.md`: scroll position becomes one number between 0 and 1, and every
moving expression is a pure function of that number. No library. Two segments, the rail
meter across the whole page and the side panel opening between 0.02 and 0.34.

Under `prefers-reduced-motion: reduce` the timeline is not slowed, it is switched off:
the scroll listener is never attached, the case is left open at its end state, and the
meter is full. Nothing on the page exists only for a reader who scrolls. `verify.mjs`
renders that state and checks it.

## Gates

- `verify.mjs` at 375, 768 and 1440, axe in both colour schemes, reduced-motion pass.
- `gate.mjs` over the build directory.

Both results are in `RUN-NOTES.md` beside this file rather than described here.

## What this is not

A staging deployment, a proposal, or a replacement for byens-it.dk. It is one page, built
from published facts, to see what the v3 skill produces on a real subject instead of an
invented one.

## Run notes

Scenario: buy

- viewports: 375, 768 and 1440 all rendered, none skipped
- axe both schemes: ran in light and dark, 0 violations
- live server: ran against a local static server on port 4322, not a file:// URL
- anti-slop linter: `gate.mjs` ran over this directory from `benchmarks/`, which is where a browser resolves on this machine; run from the repository root it withholds the direction verdict instead of passing it
- fallbacks: none taken, no check was degraded or waived on this run

## Mechanical findings

- rail-target-42px: four tap targets on the job rail measured 42px against the 44px floor at 375 and 768px
- rail-caption-contrast: three rail captions sat at 2.29:1 in light and 2.79:1 in dark
- skip-link-box: the skip link measured 27px before it is focused
- button-pair-gap: two buttons in a wrapped row sat 8px apart against the 24px floor
- ground-in-banned-band: ground `#eceee7` and dark ground `#191c1a` fell inside the premium-consumer band taste-skill names
- brand-purple-flagged: the brand colour was flagged as sitting in the AI purple region
- reduced-motion-clean: the reduced-motion render raised nothing

## Reconciliation

- rail-target-42px: confirmed. The first fix raised the padding and the measurement did not move, because 42px was the target's width, not its height: a rail link is as wide as the word in it, and "Gaming" is 42px. Fixed with a minimum width and trailing padding
- rail-caption-contrast: confirmed, fixed by moving the captions onto the body ink
- skip-link-box: confirmed, fixed by giving the unfocused state the same box as the focused one
- button-pair-gap: confirmed, fixed with a bottom margin so a wrapped pair keeps its gap
- ground-in-banned-band: confirmed, and not waived. The ground moved to the blue-grey of an antistatic mat, which is a material this workshop actually has, rather than pinning a colour nobody asked for
- brand-purple-flagged: false-positive. reason: `#ba01c4` is the company's registered brand colour and the standing instruction on this account names it explicitly, so the check is describing a real convention rather than a default. Pinned in the direction record with the wording it came from, not dismissed
- reduced-motion-clean: confirmed as clean, because the timeline is switched off rather than slowed and the end state renders complete

Nothing on this list is still open.

## Draft state

draft: yes

release: no

This build is a draft for one reason, and it is named rather than hidden: **no photograph
of the subject exists in the brief.** look.md section 3 puts a client photograph at the top
of the asset ladder and a drawing at the bottom, and it says a page about a physical
subject with no photograph of it is a draft. This is one.

What is missing, precisely: one photograph of the bench at Ternevej 7, and one of a finished machine before it leaves.

What happens next: ask for it. The drawings on this page are correct for what they are, a
section and a diagram, and they are the wrong answer for a thing that could be
photographed. Nothing here should be replaced by a generated image.
