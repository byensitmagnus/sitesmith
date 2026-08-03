# The vertical pilot: Glarmester Nordlys

One website, built end to end by a coding agent that had nothing but a SiteSmith
installation and a brief. **The company is fictional.** Every price, person, address and
telephone number in it was invented for this pilot, the brief says so, and the page says so.

The point of the pilot was not the website. It was to find out whether the product works
when a stranger uses it, and it found nine defects that no test in this repository could
have found, because every one of them lived in the space between two things that each
worked alone.

## What was built

An Astro site: a glazier who cuts replacement panes to measure. The visitor enters two
measurements in millimetres, picks a glass type and a handover, and gets a real price
computed in the browser. The conversion is a written cutting specification, not a payment,
because the fictional workshop takes orders by telephone and the page does not pretend
otherwise.

- `site/` — the source. `npm install && npm run dev`, or `npm run build` for the static output.
- `record/` — the direction record, the run manifest, the locked critique, the asset
  manifest and the production report.
- `renders/` — 375, 768 and 1440, plus the reduced-motion pass.
- `BRIEF.md` — the input, unchanged.

## The journey, measured

600 x 900 mm entered, falsmål 594 x 894, area 0,531 m², Klart float 4 mm at 640 kr/m²,
total **340 kr**, ready in 2 working days. 20 mm is refused on the field that caused it and
names the falsmål it would produce; 2.400 mm is refused against the 2,4 m bench.

## What the checks said

```
production build   green, 1 page, 556 ms
verify             PASS, nothing blocking. axe 0 violations in both colour schemes,
                   0 console errors, 0 dead links, 0 horizontal overflow at 375/768/1440
critique           ACCEPT, locked to render d4a3dbccd412bc07, one correction round
journey            44 assertions, green against dev and against the production build
gate --draft       every check ran and none refused
gate               one refusal, look/no-photograph, which the brief itself explains
```

## The nine product defects the pilot found

Everything here was fixed at its root cause in SiteSmith, not worked around in the pilot.

1. **`knowledge/` was not distributed.** `sitesmith recommend` is a documented command and
   the index lived only in the development repository. A new user installed a skill without
   it.
2. **The CLI was not distributed.** `commands.mjs` sat in `bin/`, which the installer does
   not copy, so seven documented commands did not exist for an installed user.
3. **A hole in the index.** A buy surface with a price calculator and an order
   specification, the most ordinary commerce shape there is, returned "no good match".
4. **The scorer punished long briefs.** The same question scored 0.295 typed as a sentence
   and 0.092 pasted as its brief, so `build` found nothing while `recommend` found the right
   post first.
5. **`build` printed advice instead of an order of work.** It now writes `RUN.json` and
   `RUN.md`: the resolved brief, surface, stack and where the stack came from, the retrieved
   posts **in full text**, the files to read in order, the artefacts to write, every command,
   the blockers and the one next step.
6. **SiteSmith wrote the em dash it forbids absolutely into the file it generates.** A build
   that followed the skill exactly could not pass the gate on its own project directory.
7. **`ledger.mjs new <surface>` was the documented command and it exits 2.** The manifest
   handed the agent a command that does not run.
8. **The template `ledger.mjs new` writes could not be read by `gate.mjs`.** A blank line
   under `## One-offs` ended the row block, so every record had two headings the gate parsed
   as empty. Two scripts in one package disagreeing about their own file format.
9. **The gate measured an unstyled document and called it a design.** Pointed at a
   production build on disk, `file://` cannot resolve Astro's absolute `/_astro/…` paths, the
   stylesheet never loaded, and the gate reported a lopsided form, one layout worn three
   times, a fieldset 397px wider than its content and a white ground, on a page that has
   none of them. It now watches the load and withholds instead, naming the fix.

Number nine is the one worth remembering. A gate that reports nothing is annoying. A gate
that reports four specific, confident, false design defects is worse than no gate, and it
took a real build on a real stack to see it.

## Reproducing this

```bash
node tools/install-sitesmith.mjs --to <empty dir>
cd <empty dir>
npm i -D playwright @axe-core/playwright
node sitesmith/cli.mjs init --name "<name>"
node sitesmith/cli.mjs recommend "<one sentence about the job>" --surface buy
node sitesmith/cli.mjs build --surface buy      # writes .sitesmith/RUN.md
# the coding agent reads RUN.md and builds from it
node sitesmith/scripts/verify.mjs <url>
node sitesmith/scripts/critique.mjs packet      # answer from the images alone, then lock
node sitesmith/scripts/journey.mjs journeys --base <url>
node sitesmith/scripts/gate.mjs --url <url>
```

The last line matters: pass `--url` against a served build. A production build read from
the filesystem cannot load its own stylesheets, and since defect nine the gate says so
rather than judging the page without them.
