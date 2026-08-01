# PRODUCTION-REPORT

Scenario: buy
Target: docs/rebuild/s12/builds/A
Stack: none detected. `stack.mjs detect` found no package.json and no framework config, so
run.md section 12 governs: plain HTML and CSS, no build step, one self-contained file.

## Files opened

- SKILL.md
- run.md
- floor/buy.md
- stacks/static.md
- verify.md
- scripts/ledger.mjs
- scripts/gate.mjs
- scripts/stack.mjs

## Direction, as the ledger read it

- thesis 1: A rebuild log: the page is the record of what was done to each frame, and the price is the last line of the log.
- thesis 2: A telephone call written down: what the workshop would tell you on 97 22 08 41, in the order it comes out, with the numbers left in.
- thesis 3: Three machines standing on the workshop floor with the price on the arm of each.
- thesis 4: A parts catalogue page: dense, every mechanism named, nothing sold.
- built: thesis 2 on the axis of who the page is spoken from
- runner-up argued: thesis 1
- signature: a machine part drawn head on, `.naalefelt`
- risk: no photograph and no form. The only committing control is a telephone number.

## Run notes

- viewports: captured measurements at 320 (in an iframe, because the pane would not size
  below 375), 375, 768 and 1440. No horizontal scroll at any of them: scrollWidth equals
  clientWidth at 320, 375 and 1440, and no element extends past the client width.
- axe both schemes: not run. reason: axe-core is not installed on this host and no network
  install was made for a check. Instead a contrast walk was scripted over every rendered
  p, li, dt, dd, a, h1, h2, figcaption and span, comparing computed colour against the
  nearest painted ancestor at the 4.5:1 and 3:1 thresholds. Zero failures in the default
  scheme and zero with prefers-color-scheme forced to dark. Keyboard focus, skip link and
  heading order were walked by hand in the same session. Axe would still find things this
  walk cannot, and that gap is not claimed as covered.
- live server: reachable. `npx http-server` on 127.0.0.1:8971 served the directory and the
  page was driven there rather than from file://.
- anti-slop linter: run. `gate.mjs` is the linter in this package and its output is under
  Mechanical findings below. The world-derived token vocabulary measurement printed 0 of 29
  declared custom-property names taken from the framework vocabulary.
- fallbacks: none.

## What was measured on the built page

- Ground renders rgb(237, 231, 218), which is `--laminatbord` as declared.
- Largest heading renders in Bevan, body in Newsreader, both as declared.
- `.naalefelt` renders three times, 520 by 304 at 1440, each with a title element and a
  data-asset id answered by ASSET-MANIFEST.md.
- The three thread strokes render rgb(179, 36, 59), rgb(31, 78, 121) and rgb(46, 107, 69),
  and each machine's closing rule renders the same value, so the divider is the thread.
- Keyboard: first stop is the skip link, which moves from off-screen to 0,0 at 186 by 56 in
  chalk on ink and points at an id that exists. Focus indicator is a solid 3px
  rgb(179, 36, 59) outline at 3px offset, measured at 5.9:1 against the surface it sits on.
- Touch targets: every link is at least 48px tall, the index rows are 82px.
- Console: no errors and no warnings.

## State roster

- Rest, hover, focus-visible, active: present on every link, including the three committing
  controls and the three index rows. Hover is never the only affordance; the index rows also
  carry an underline on the name and the committing controls are the only filled surfaces.
- Disabled: skipped. reason: no control on this page can be unavailable. There is no state in
  which calling the workshop is not possible, so nothing carries a disabled attribute and
  nothing imitates one.
- Loading: skipped. reason: no asynchronous work exists. The page has no script.
- Empty: skipped. reason: the content is fixed and the count is three. There is no query, no
  filter and no list that can come back empty.
- Error: skipped. reason: there is no input on the page, so there is no field for a message
  to attach to. This was checked against the brief rather than assumed: no form endpoint,
  email address or booking mechanism was supplied.
- Partial: skipped. reason: nothing is fetched, so no view can arrive half-filled. The one
  external resource is the Google Fonts stylesheet, and both faces name a local fallback so
  the page reads in Georgia if it never arrives.

## Design record, written from the shipped file

- Ten custom properties carry every colour and none of them is named for a role. Seven are
  workshop materials and three are thread. The three saturated values exist because there are
  three machines, which is the reason the palette is not one accent plus greys.
- Type is two families and three weights in total: Bevan 400 on the h1 and the three name
  plates only, Newsreader 400 and 600 everywhere else. No uppercase transform anywhere and no
  positive letter-spacing anywhere, both checked in the shipped stylesheet.
- Every font-size, colour, radius and shadow at a call site is a var(). The stylesheet
  contains no literal at a call site, which is why the One-offs block in the direction record
  is empty and absent rather than long.
- No transition, transform, animation or keyframe exists in the shipped file. The
  prefers-reduced-motion block is present and zeroes animation, transition and
  scroll-behavior, so a later edit that adds motion is stopped rather than only hidden.
- Divergence from the plan, recorded: the plan said the Brother rule would be a double line.
  Shipped first as a 3px box with 3px borders, which collapsed under border-box to a single
  6px band with no gap. Corrected to a 9px box so the chalk gap between the two 3px lines is
  visible. One edit, inside the cap.
- Defect this build carries: the drawings are checked by reading the DOM and the computed
  styles, not by looking at a rendered image. The Browser pane on this host would not
  composite frames, so no screenshot was taken at any viewport. Geometry inside the three
  SVGs is therefore verified by construction and by measurement, not by eye. That is written
  here as a gap in this build, not as a method the next build should inherit.

## Mechanical findings

The model's own judgment above was formed before `gate.mjs` was run. The gate then reported:

- `report/missing`: PRODUCTION-REPORT.md had no "## Files opened" list, because the report had
  not been written when the gate was first run.
- `direction/signature-names-no-selector`: the Signature line in the direction record wrapped,
  and the backticked selector fell onto the second line where the gate does not read.
- `direction-fidelity-withheld`: playwright is not installed on this host, so the palette,
  type and signature render verdicts are missing rather than passed.
- `ledger-parse`: no finding. `ledger.mjs parse` returned verdict complete on the first run
  and again after the signature edit.

## Reconciliation

- `report/missing`: confirmed. The report is now written and carries the Files opened list,
  the Run notes block and this section.
- `direction/signature-names-no-selector`: confirmed. The selector was moved onto the
  Signature line itself. Missed by the model, which had read the record as complete because
  the selector was present in the file, and the gate is right that presence in the file is
  not presence on the line a parser reads.
- `direction-fidelity-withheld`: confirmed. Nothing was installed to make it pass, and the
  gate's exit 1 stands. The ground, the display face and the body face were measured by hand
  in the live browser and agree with the record, but that measurement is written here as
  evidence rather than substituted for the withheld verdict.
- `ledger-parse`: confirmed as a clean result, dispositioned so the empty answer carries a
  line rather than an absence.

## Unresolved

- The direction fidelity verdict is withheld and stays withheld. Installing playwright was
  not done, because stacks/static.md forbids adding to the stack beyond its four conditions
  without being asked, and because a gate that is made to pass by installing its dependency
  under time pressure is a gate nobody read.
- No screenshot exists at 375, 768 or 1440. The pane on this host does not composite, so
  every visual judgment in this report is a measurement and none is a look.
