# Critique of the first render

Written against `pilot-first-1440.png` and `pilot-first-390.png`, following `look.md`
section 6. One correction round follows, and then it stops.

**1. What the eye lands on first, and should it?**
The headline, then the glow behind it. The order is right and the atmosphere is right: this
reads as a foundry rather than as a website about a foundry, which the rejected version
never did.

**2. Where does it go second and third?**
Second to the glow, third to the drawing on the right, and there it stops and asks what it
is looking at. That is the failure. The drawing does not read as a bell. It reads as two
blades, or a rocket fin, because the outer profile never closes into a shoulder and the
waist does not flare. The single most important object on the page is illegible.

**3. Which area is dead?**
The upper centre and right, between the last line of the headline and the top of the
drawing. Roughly a third of the screen is unbroken ground with nothing in it, and it is
dead rather than open because nothing is placed against it.

**4. The weakest join.**
The headline column is set to 20ch and the type to 6.4vw, so at 1440 it breaks into nine
lines of one and two words. The rag is bad, the leading fights the descenders, and the
result pushes `11.14` and its caption off the bottom of the first screen. A number that is
supposed to be the object of the page is cut in half by the viewport.

**5. What a competent designer would say first.**
"Your drawing doesn't look like a bell, and your headline is falling off the screen."

## The one correction round

- Redraw the bell as a real section: crown block, shoulder, waist, flare, and a sound bow
  thick enough to read as the place the clapper strikes. Drawn as one half profile and
  mirrored, so the symmetry is exact rather than hand-matched.
- Make it much larger and crop it against the right edge, as the look file said it would
  be and the first build was not. That is also what removes the dead field, because the
  drawing then occupies the area that was empty.
- Widen the text column and drop the headline size so the first screen holds the headline,
  the number and the caption without clipping.

Nothing else. A second round is where a page gets sanded flat.
