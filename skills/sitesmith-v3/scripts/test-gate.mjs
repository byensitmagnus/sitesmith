#!/usr/bin/env node
// The test of the release gate.
//
//   node skills/sitesmith-v3/scripts/test-gate.mjs
//
// A gate that cannot fail is decoration, and a gate that cannot pass is noise. Every case
// below fixes its exit code before the gate runs, and most of them also fix the defect
// classes that must appear by name, because an exit code alone would let one check's
// refusal stand in for another's silence. Two cases exist only to pin the shape of the
// thing rather than a defect: `pass` must reach 0, and `pass` with no browser must reach 1
// and say a verdict is missing rather than reporting a pass it did not earn.
//
// Exit codes under test:
//   0  every check ran and none refused
//   2  refused
//   1  nothing refused and at least one verdict is missing

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const SCRIPTS = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPTS, '../../..');
const SKILL = join(SCRIPTS, '..');
const FIX = join(ROOT, 'docs/rebuild/s10/fixtures/scripts/gate');
const GATE = join(SCRIPTS, 'gate.mjs');

/* The render check needs a browser, and the browser has to be resolvable from the working
   directory the gate runs in, which is where `sitesmith install` puts it on a real project.
   If no installed copy can be found the render cases cannot run, and this suite says so and
   fails rather than reporting green on the cases it skipped. */
const WITH_BROWSER = ['benchmarks', 'tests/gates', 'skills/sitesmith/scripts', '.']
  .map((d) => join(ROOT, d))
  .find((d) => existsSync(join(d, 'node_modules/playwright')));

const NO_BROWSER = mkdtempSync(join(tmpdir(), 'sitesmith-gate-nobrowser-'));

const CASES = [
  {
    name: 'pass',
    fixture: 'pass', browser: true, expect: 0,
    must: ['WAIVED', 'antipattern/gradient-text', 'every check ran and none refused'],
    why: 'a build that keeps its word, with its one antipattern claimed on purpose in the direction record',
  },
  {
    name: 'pass, no browser',
    fixture: 'pass', browser: false, expect: 1,
    must: ['VERDICT MISSING', 'direction fidelity', 'This is not a pass'],
    mustNot: ['every check ran'],
    why: 'with nothing to render the direction verdict is missing, and a missing verdict is not a pass',
  },
  {
    name: 'dishonest page',
    fixture: 'refuse-dishonest', browser: true, expect: 2,
    must: ['honesty/placeholder-language', 'honesty/dummy-identifier', 'honesty/empty-brand-mark', 'honesty/unmanifested-asset'],
    mustNot: ['tokens/undeclared-literal'],
    why: 'honesty runs first and stops the gate, so the undeclared literal in the same stylesheet is named as a missing verdict rather than measured',
  },
  {
    name: 'em dash, elision, an uninstalled design system',
    fixture: 'refuse-source', browser: true, expect: 2,
    must: ['copy/em-dash', 'output/elision-placeholder', 'honesty/design-system-not-installed'],
    why: 'three source refusals that no flag and no allowlist can turn off',
  },
  {
    name: 'report accounting',
    fixture: 'refuse-report', browser: true, expect: 2,
    must: ['reads/outside-manifest', 'run-notes/no-reason-on-a-step-that-did-not-run', 'reconciliation/unreconciled-finding'],
    why: 'a read outside the declared scenario, a step that did not run and never said why, and a mechanical finding nobody dispositioned',
  },
  {
    name: 'token drift in emitted CSS',
    fixture: 'refuse-drift', browser: true, expect: 2,
    must: ['tokens/undeclared-literal'],
    why: 'literals at call sites in a stylesheet the build emitted, which is the blindness the v2.3 scanner had',
  },
  {
    name: 'the named tells',
    fixture: 'refuse-tells', browser: true, expect: 2,
    must: ['antipattern/gradient-text', 'antipattern/three-card-grid', 'antipattern/framework-default-scale', 'antipattern/icon-tile-row'],
    why: 'four tells, none of them claimed in the direction record',
  },
  {
    name: 'a page with nowhere to go and nothing saying who it is',
    fixture: 'no-shell', browser: true, expect: 2,
    must: ['look/no-way-out', 'look/no-shell'],
    // The cleanest correlation in the corpus: the four pages the owner rejected have one
    // anchor each, the skip link, and no nav and no footer between them. The one page he
    // accepted has eleven anchors, a nav and a footer. Nothing required it, so nobody
    // built it, and every gate was green four times.
    why: 'a reader who wants to know who this is, or to do anything, has to have somewhere to go',
  },
  {
    name: 'an experience surface whose first screen is words on a flat ground',
    fixture: 'look-unpainted', browser: true, expect: 2,
    must: ['look/first-viewport-unpainted', 'look/dead-field'],
    // The whole point of look.md, and the hole the S17 holdouts went through. Every other
    // check in this gate refuses a defect; these two refuse an absence, and nothing here
    // asked for anything to be present until they existed.
    why: 'three holdouts shipped an unpainted first screen with every gate green, and a page that is words on a flat ground has not started',
  },
  {
    name: 'the same page with something on it',
    fixture: 'look-painted', browser: true, expect: 0,
    must: ['every check ran and none refused'],
    mustNot: ['look/first-viewport-unpainted', 'look/dead-field'],
    why: 'the two fixtures differ by one drawn plate, so the refusal has to lift when the thing it asks for is there',
  },
  {
    name: 'a buy surface with nothing that drives it',
    fixture: 'buy-no-journeys', browser: true, expect: 2,
    must: ['journeys/none'],
    // verify.md promised this gate long before anything implemented it. Nothing here
    // clicks: verify.mjs renders and measures, its keyboard pass presses Tab and reads
    // computed style, and gate.mjs contained no occurrence of the word journey at all. A
    // product page whose add-to-cart handler never hydrates cleared every check.
    why: 'a page that sells has to be driven, and the two fixtures differ only by the presence of one spec file',
  },
  {
    name: 'the same surface with a journey beside it',
    fixture: 'buy-with-journey', browser: true, expect: 0,
    must: ['every check ran and none refused'],
    mustNot: ['journeys/none', 'journeys/empty'],
    why: 'the refusal has to lift when the thing it asks for is there, or it is not a gate, it is a wall',
  },
  {
    name: 'the record ledger.mjs writes is a record gate.mjs can read',
    fixture: 'canonical-record', browser: true, expect: 0,
    must: ['every check ran and none refused'],
    mustNot: ['direction/palette-not-declared', 'direction/type-not-declared', 'direction/signature-not-declared'],
    // run.md tells a builder to run `ledger.mjs new` and fill every heading it writes.
    // That template writes `## Colour`, `## Type` and `## Signature` as headings, and this
    // gate only ever looked for `Palette:`, `Type:` and `Signature:` as one-line fields,
    // so a build that followed the documented method refused here on three counts and no
    // correct build could pass. test-ledger.mjs asserts the other half: that the same
    // file parses. One artefact, two readers, one contract.
    why: 'a builder who follows run.md exactly must end up with a record both scripts accept, and until this case existed neither suite checked that they agreed',
  },
  {
    name: 'a banned ground and an AI purple, unclaimed',
    fixture: 'unpinned', browser: true, expect: 2,
    must: ['palette/premium-consumer-default', 'colour/ai-purple'],
    why: 'the same build as the pinned fixture in every respect except the two lines that claim the colours',
  },
  {
    name: 'the same colours, pinned by the brief',
    fixture: 'pinned-by-brief', browser: true, expect: 0,
    must: ['WAIVED', 'every check ran and none refused'],
    mustNot: ['palette/premium-consumer-default', 'colour/ai-purple'],
    // Both refusals name a way past and both tested direction.raw, which parseDirection
    // never set, so the escape hatch was unreachable and nothing in this suite noticed.
    // These two cases exist so it cannot go quiet again.
    why: 'a refusal that offers a way past has to honour it, and a client whose actual colour sits in a banned band is a real case rather than a hypothetical',
  },
  {
    name: 'the round-8 recipe',
    fixture: 'refuse-round8', browser: true, expect: 2,
    must: ['antipattern/round-8-recipe'],
    why: 'this studio shipped this exact combination three times and the portfolio failed on sameness',
  },
  {
    name: 'the render is not the direction',
    fixture: 'refuse-render', browser: true, expect: 2,
    must: ['direction/ground-outside-declared-band', 'direction/display-face-not-the-declared-one', 'direction/signature-does-not-render'],
    why: 'measured at 1440 in the default colour scheme, which is the view anyone was actually shown',
  },
  {
    name: 'a palette this gate cannot convert',
    fixture: 'withhold-oklch', browser: true, expect: 1,
    must: ['VERDICT MISSING', 'colour space this gate cannot convert'],
    mustNot: ['every check ran'],
    why: 'the ground verdict is withheld and named, and nothing is guessed from a colour space the gate has no conversion for',
  },
  {
    name: 'draft downgrades the manifest refusal',
    fixture: 'draft-build', args: ['--draft'], browser: true, expect: 0,
    must: ['WARNED', 'honesty/unmanifested-asset'],
    why: 'the same defect is a warning in a draft, and the report carries the flag',
  },
  {
    name: 'the same build without the flag',
    fixture: 'draft-build', browser: true, expect: 2,
    must: ['honesty/unmanifested-asset'],
    why: 'the downgrade is the flag, not the build',
  },
  {
    name: 'a record and a report that do not answer',
    fixture: 'refuse-record', browser: true, expect: 2,
    must: ['report/no-files-opened-list', 'run-notes/missing-field', 'reconciliation/false-positive-without-reason',
      'direction/one-off-without-a-reason', 'direction/palette-not-declared', 'direction/signature-not-declared'],
    why: 'the record declares no palette, type or signature, the one-off carries no reason, a run note is absent rather than answered, and a finding is dismissed as a false positive without saying why',
  },
  {
    name: 'a draft claiming release',
    fixture: 'refuse-draft-release', args: ['--draft'], browser: true, expect: 2,
    must: ['honesty/release-claimed-on-a-draft-build'],
    why: 'no build claiming release may have used --draft',
  },
];

let failed = 0;
const fail = (name, why) => { failed++; console.log(`  FAIL  ${name}\n          ${why}`); };

if (!WITH_BROWSER) {
  fail('browser discovery',
    'no installed playwright under benchmarks/, tests/gates/ or skills/sitesmith/scripts/. The render cases cannot run, so this suite has no verdict on them.');
}

for (const c of CASES) {
  if (c.browser && !WITH_BROWSER) continue;
  /* A holdout run installed playwright at the repository root, and this case stopped
     being able to simulate a missing browser because the gate simply found one. A test
     that depends on a directory being absent is a test that passes until someone runs
     npm install. The no-browser case now runs from a scratch directory that has no
     node_modules by construction. */
  const cwd = c.browser ? WITH_BROWSER : NO_BROWSER;
  const r = spawnSync(process.execPath,
    [GATE, join(FIX, c.fixture), '--skill', SKILL, ...(c.args ?? [])],
    /* SITESMITH_DEPS_DIR points the gate at a browser regardless of cwd, so the
       no-browser case has to unset it as well as run from a bare directory. Leaving it
       inherited made this case pass a build it was written to refuse. */
    { cwd, encoding: 'utf8', env: c.browser ? process.env : { ...process.env, SITESMITH_DEPS_DIR: '' } });
  const out = `${r.stdout ?? ''}${r.stderr ?? ''}`;

  const problems = [];
  if (r.status !== c.expect) problems.push(`exit ${r.status}, expected ${c.expect}`);
  for (const m of c.must ?? []) if (!out.includes(m)) problems.push(`stdout never names "${m}"`);
  for (const m of c.mustNot ?? []) if (out.includes(m)) problems.push(`stdout names "${m}" and should not`);

  /* The one number the gate prints and is not allowed to gate on. Every run must show it,
     and no run may ever turn it into a refusal. */
  if (!out.includes('world-derived token vocabulary')) problems.push('the world-derived token vocabulary measurement was not printed');
  if (/REFUSED[\s\S]*world-derived token vocabulary share/.test(out)) problems.push('the vocabulary measurement was reported as a refusal');

  if (problems.length) fail(`${c.name} (${c.fixture})`, `${problems.join('; ')}\n          expected because: ${c.why}`);
  else console.log(`  ok    ${c.name} -> exit ${r.status}  (${c.why})`);
}

console.log(failed ? `\n${failed} case(s) failed` : `\nall clear, ${CASES.length} case(s)`);
process.exit(failed ? 1 : 0);
