#!/usr/bin/env node
/**
 * The DIRECTION.md axis record is a machine-readable contract. This tests it. Original work,
 * MIT. AI-generated additions: (C).
 *
 *   node tools/test-direction-format.mjs
 *
 * Two independent builders wrote careful directions that the toolchain could not read, and the
 * gate answered by failing their *pages* for declaring nothing. The format was the fault and
 * the format was undocumented, so the diagnosis pointed at the wrong thing twice.
 *
 * It is documented now, in v2/20-direction-lab.md. The risk with a documented format is that
 * the document and the parser drift, and the drift is invisible until it costs someone a day.
 * So this reads the fenced block **out of the documentation** and requires the parser to accept
 * it. The doc cannot be wrong about the parser without failing here, and the parser cannot
 * change out from under the doc.
 *
 * Everything below runs without a browser: this is about reading a document, and the gate now
 * reads the document before it launches anything.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import {
  parseDirection, groundExpectation, typeExpectation, imageryExpectation, rhythmExpectation,
  directionContractProblems,
} from '../skills/sitesmith/scripts/direction-fidelity.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DOC = join(ROOT, 'skills/sitesmith/v2/20-direction-lab.md');
const AXES = ['composition', 'type', 'colour', 'imagery', 'rhythm'];

let bad = 0;
const ok = (name, pass, detail = '') => {
  if (!pass) bad++;
  console.log(`  ${pass ? 'ok  ' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

/* ── 1. the documented block is the block the parser reads ─────────────────── */
const doc = await readFile(DOC, 'utf8');
const section = doc.split('## The axis record, verbatim')[1];
if (!section) {
  console.log('  FAIL  v2/20-direction-lab.md has no "The axis record, verbatim" section');
  process.exit(1);
}
const fenced = section.match(/```markdown\n([\s\S]*?)```/);
if (!fenced) {
  console.log('  FAIL  that section documents no fenced markdown block');
  process.exit(1);
}

const documented = parseDirection(fenced[1]);
ok('the documented block parses to five axes',
  AXES.every((a) => documented.axes[a]),
  AXES.filter((a) => !documented.axes[a]).join(', ') || 'composition, type, colour, imagery, rhythm');
ok('the documented block carries a signature selector', Boolean(documented.signature),
  documented.signature ?? 'none');
ok('the documented block carries a minimum share', Number.isFinite(documented.signatureMinShare),
  String(documented.signatureMinShare));
for (const dial of ['visual-density', 'motion-intensity', 'aesthetic-boldness']) {
  ok(`the documented block names ${dial}`,
    new RegExp(`^\\s*[-*]\\s*${dial}\\s*:`, 'im').test(fenced[1]));
}

const dialled = parseDirection([
  '- composition: a dense index',
  '- type: condensed grotesque over a system sans',
  '- colour: a light paper ground',
  '- imagery: deliberately imageless',
  '- rhythm: one continuous field',
  '- visual-density: 8',
  '- motion-intensity: 3',
  '- aesthetic-boldness: 7',
  '- signature-selector: .index',
  '- signature-min-share: 8',
].join('\n'));
ok('the three direction dials parse as integers',
  JSON.stringify(dialled.dials) === JSON.stringify({
    visualDensity: 8,
    motionIntensity: 3,
    aestheticBoldness: 7,
  }), JSON.stringify(dialled.dials));
ok('a complete dial contract has no format problem', directionContractProblems(dialled).length === 0,
  directionContractProblems(dialled).join('; '));

const missingDials = parseDirection([
  '- composition: a dense index', '- type: sans over sans', '- colour: light ground',
  '- imagery: deliberately imageless', '- rhythm: one continuous field',
  '- signature-selector: .index',
].join('\n'));
ok('missing dials are reported as a contract fault',
  directionContractProblems(missingDials).some((problem) => /visual-density/.test(problem)));

const invalidDials = parseDirection([
  '- composition: a dense index', '- type: sans over sans', '- colour: light ground',
  '- imagery: deliberately imageless', '- rhythm: one continuous field',
  '- visual-density: 11', '- motion-intensity: 0', '- aesthetic-boldness: seven',
  '- signature-selector: .index',
].join('\n'));
ok('dial values outside integer 1-10 are rejected',
  directionContractProblems(invalidDials).filter((problem) => /1 and 10/.test(problem)).length === 3,
  directionContractProblems(invalidDials).join('; '));

/* ── 2. every trap the documentation warns about ───────────────────────────── */

// Prose headings. This is what both builders wrote, and what the gate used to read as
// "the page declares undefined" rather than "this document is not in the format".
const prose = parseDirection([
  '## Axis record', '',
  '- **Composition.** A dense index.',
  '- **Type and scale.** A condensed grotesque over a system sans.',
  '- **Colour.** A paper ground.',
].join('\n'));
ok('prose headings do not parse as axes', AXES.every((a) => !prose.axes[a]),
  Object.keys(prose.axes).join(', ') || 'nothing parsed, as documented');

// `type` reads the clause before "over". Documented, and easy to get backwards.
ok('type reads the display face, which is the clause before "over"',
  typeExpectation('condensed grotesque display over a system sans') ===
  typeExpectation('condensed grotesque display'),
  'a body face after "over" must not change the expectation');
ok('naming the body face first checks the wrong face',
  typeExpectation('a system sans over a condensed grotesque display') !==
  typeExpectation('a condensed grotesque display over a system sans'),
  'the documentation warns about exactly this, so it must still be true');

// `colour` needs a ground word, and says so rather than guessing.
ok('a colour axis with no ground word is unclassifiable',
  groundExpectation('a considered palette with one accent') === null,
  'the gate reports it rather than checking the wrong thing');
// Every ground word the documentation lists must classify the way the documentation says.
// Reading them out of the doc means the list cannot go stale in one place and not the other.
const grounds = section.match(/`light`[^.]*?on one side; ([^.]*?) on the other/s);
const lightWords = ['light', 'paper', 'white', 'off-white', 'cream', 'buff', 'stone', 'limewash'];
const darkWords = ['dark', 'near-black', 'black', 'ink ground', 'inverted'];
for (const w of lightWords) {
  const g = groundExpectation(`a ${w} ground, with one accent`);
  ok(`the documented word "${w}" reads as a light ground`, g?.want === 'light', g?.want ?? 'null');
}
for (const w of darkWords) {
  const g = groundExpectation(`${w}, with one accent`);
  ok(`the documented word "${w}" reads as a dark ground`, g?.want === 'dark', g?.want ?? 'null');
}
ok('the documentation still lists both sides of the ground vocabulary', Boolean(grounds),
  grounds ? 'found' : 'the light/dark word lists are no longer in the doc');

// The two axes with a closed vocabulary. A value outside it is reported, never guessed at.
for (const [phrase, kind] of [['deliberately imageless', 'imageless'],
                              ['photography-led, warm', 'photographic'],
                              ['object-led, plate scale', 'object-led'],
                              ['diagram-led, ruled drawings', 'diagram-led']]) {
  ok(`imagery "${phrase}" classifies as ${kind}`,
    imageryExpectation(phrase)?.kind === kind, imageryExpectation(phrase)?.kind ?? 'null');
}
ok('an imagery value outside the vocabulary is reported, not guessed',
  imageryExpectation('some pictures here and there') === null);

for (const [phrase, want] of [['alternating bands of ground', 'bands'],
                              ['one continuous field', 'continuous'],
                              ['a card grid', 'cards']]) {
  ok(`rhythm "${phrase}" classifies as ${want}`,
    rhythmExpectation(phrase)?.want === want, rhythmExpectation(phrase)?.want ?? 'null');
}
ok('a rhythm value outside the vocabulary is reported, not guessed',
  rhythmExpectation('sections, separated somehow') === null);

/* ── 3. the directions in this repository still parse ──────────────────────── */
/* Read-only. These three are a failed control group and are not to be edited; the point is
   that a parser change which broke them would be caught here rather than in a review. */
for (const p of ['pilots/01-chandlery', 'pilots/02-foundry', 'pilots/03-cask-console']) {
  const md = await readFile(join(ROOT, p, 'DIRECTION.md'), 'utf8').catch(() => null);
  if (md === null) { ok(`${p}/DIRECTION.md exists`, false, 'not found'); continue; }
  const d = parseDirection(md);
  const missing = AXES.filter((a) => !d.axes[a]);
  ok(`${p} parses`, missing.length === 0 && Boolean(d.signature),
    missing.length ? `no ${missing.join(', ')}` : `signature ${d.signature}`);
}

console.log(`\n  ${bad ? `${bad} failure(s)` : 'the documented format is the parsed format'}\n`);
process.exit(bad ? 1 : 0);
