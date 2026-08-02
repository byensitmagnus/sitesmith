---
title: Remotion, where the output is a video file
read: at run order step 3, after stack detection, before the first file is written
---

**This adapter is for a project whose output is video.** A `remotion` or
`@remotion/cli` dependency detects it. A website with a video on it is not this stack;
route that to the adapter for whatever renders its pages.

**Tokens live in a module the compositions import, not in a stylesheet.** Frames are
captured in a headless page the renderer drives, so a stylesheet reaches only what that
page loaded, and a custom property is unreadable to the timing maths that interpolates
between values. Export the values once from one file and let styles and animation read
the same source.

**A composition is registered with `<Composition>` inside the Root component**, and the
entry named in `remotion.config` mounts that Root. Id, dimensions, fps and length in
frames belong to the registration, not to the component. Read the Root before adding a
second one: the id is how a render is addressed, so an id registered twice, or named
differently on the command line, breaks the render and not the design.

**Fonts must be loaded and awaited before frames are captured.** There is no cache to
warm across a render, since a frame can be captured on a page that started cold. Load
the face through Remotion's own font loading, hold the frame with `delayRender` and
release it with `continueRender` once the face is ready. A link to a font host gives you
the fallback and no error.

**Verify targets a file, not a URL.** The studio is for working; the artefact comes from
`remotion render`. Your matrix is frames pulled from the output: the first, one inside
each transition, and the last. `verify.mjs` expects a served page, so run it against the
studio if you run it at all, and say plainly in the report that the browser gates did
not touch the artefact.

**Recorded here.** A composition is deterministic per frame, so anything read from the
clock, `Date.now()`, `Math.random()`, a running timer, renders differently every time
and no two frames agree; drive motion from `useCurrentFrame()` alone. A font arriving
asynchronously renders as fallback on the frames captured before it lands, and only
those, so the defect appears at the start of the file and nowhere you were looking. A
still is not proof that the sequence works: order, timing and anything that accumulates
across frames are all invisible in one.
