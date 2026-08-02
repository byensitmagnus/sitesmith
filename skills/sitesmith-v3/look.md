# The look

Open this on every build before any code. The rest of this package tells you what must not
happen. This file is the only one that asks for something to be there.

## 1. The visual thesis, in one sentence

Before any layout, write one sentence naming the **visual world** this subject lives in.
Not the argument, which is the direction record's `Built:` line. The world: what it is made
of, what light it is under, what it would feel like to touch.

> The world is a foundry floor at eleven in the morning: cast bronze, loam, sand, and one
> source of light that is molten metal.

Test it by swapping the subject. If the sentence still fits a bakery, it is not a world, it
is an adjective. Write it again.

## 2. Two or three references, and what you are not taking

Name two or three existing pieces of work in the world you just described, from any medium:
a book jacket, a signage system, a museum catalogue, a record sleeve, another website. For
each, one line on the **principle** you are taking.

Then one line naming what you are **not** taking. This is the important half. A reference
becomes a copy at the point where you take its specific solution rather than its principle,
and writing the boundary down is what keeps you on the right side of it.

> Taking: the Deutsche Grammophon sleeves' willingness to let one photographic object own
> two thirds of the cover with the type crowded into the remaining third.
> Not taking: the yellow cartouche, the typeface, the centred logotype.

## 3. The asset plan, before the first line of code

List every visual element the page needs, with what it contributes and where it comes from.
An asset is not decoration; each row must say what the page loses without it.

| what | contributes | source | licence | state |

Sources, in order of preference:

1. **Supplied by the client.** Use these first. A real photograph of the real thing beats
   anything you can make.
2. **Drawn here.** An SVG, a CSS composition, a canvas figure. Original work, so the
   provenance is this repository and the licence is its licence. This is the honest answer
   when the client supplied nothing, and it is a real answer rather than a fallback: a
   drawn section, a diagram, a mark, a texture.
3. **Licensed and sourced.** Only with the licence recorded and the source named. A
   photograph with no traceable licence is not an option, whatever it looks like.

If a required asset cannot be obtained, the build is a **draft** and says so. It does not
proceed with an empty rectangle where the thing was going to be. It does not generate a
photograph of a place that exists.

## 4. The first viewport has to carry

The first screen is the whole argument in one frame. Before you build it, decide what
**object** owns it. Not a heading with a subhead and a button: an object. A drawn form, a
photograph, a diagram, a piece of type set large enough to be an image, a field of texture
with one thing on it.

Three things it must have, and `verify.mjs` measures the first two:

- **Painted matter.** Something other than running text occupies a real share of the first
  screen. A page whose first screen is words on a flat ground has not started yet.
- **No dead field.** No large rectangle of untouched ground. Whitespace is a decision and
  it looks like one; dead canvas is an absence and it looks like that.
- **One thing that is unmistakably this subject.** If the first screen could be cropped
  into a competitor's site without anyone noticing, build another one.

## 5. Materiality

Flat is a choice and it is the one every default makes. Ask what this subject is made of
and let the page be made of it too: a paper grain, a cast surface, a printed halftone, an
enamel, a woven texture, the grain of a screen in a dark room. One material, used
consistently, at a strength you would notice only if it were removed.

The cheapest honest version is a single SVG turbulence filter or a repeating gradient at
low opacity. The most expensive is a photograph. Both count. Nothing does not.

## 6. Look at it

When the page renders, take the screenshot and **look at it**, at 1440 and at 390. Then
write the critique, in this order, one sentence each. Be specific and be unkind: a critique
that could have been written without opening the image is not a critique.

1. What is the first thing the eye lands on, and is that the thing that should own it?
2. Where does the eye go second and third? Is that the argument order?
3. Which area is dead? Name it by its element.
4. What is the weakest join: a gap that does not mean anything, a rhythm that breaks, a
   size that is neither one thing nor the other?
5. If a competent designer saw this, what is the first thing they would say?

Then **one correction round**. Fix what the critique found, re-render, look again, and stop.
A second round is where a page gets sanded flat. If the second look is still wrong, the
thesis was wrong, and the answer is to say so in the report rather than to keep polishing.

## 7. What this file will not do

It will not name a colour, a typeface, a layout or a device. Every attempt to help by
listing good options produces the same page across unrelated briefs, which is the failure
the rest of this package exists to prevent. This file asks questions and sets floors. The
answers come from the subject, every time.
