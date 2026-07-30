#!/usr/bin/env node
/** Direction-memory contract. Original work, MIT. AI-generated additions: (C). */

import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { homedir, tmpdir } from 'node:os';
import { join, normalize } from 'node:path';
import {
  DEFAULT_HISTORY, compareWithHistory, devicesFromFingerprint, historyEntry, parseRecord,
  readHistory, recordProblems,
} from '../skills/sitesmith/scripts/direction-history.mjs';

let bad = 0;
const ok = (name, pass, detail = '') => {
  if (!pass) bad++;
  console.log(`  ${pass ? 'ok  ' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

const record = parseRecord([
  '- direction-version: 2.3',
  '- composition: object first',
  '- type: serif over sans',
  '- colour: light paper ground',
  '- imagery: photography-led',
  '- rhythm: alternating bands',
  '- surface: open whitespace — the object carries each section break',
  '- labels: sentence case — the audience reads prose, not codes',
  '- figures: proportional — numbers are supporting evidence only',
  '- depth: elevated — the purchase panel alone follows the reader',
].join('\n'));

const fp = (overrides = {}) => ({
  groundBand: 'light',
  displayClass: 'serif',
  displayFamily: 'Georgia',
  imageryBand: 'supporting',
  layout: 'prose+single',
  monoCaps: 0,
  hairlines: 0,
  strokeOnlySvgs: 0,
  rasterImages: 1,
  tabularNums: 0,
  shadowed: 2,
  cards: 0,
  ...overrides,
});

ok('the default ledger lives in the user home, not inside the installed skill',
  normalize(DEFAULT_HISTORY) === normalize(join(homedir(), '.sitesmith', 'direction-history.jsonl')),
  DEFAULT_HISTORY);
ok('a complete 2.3 record parses all four grammar fields',
  recordProblems(record).length === 0, recordProblems(record).join('; '));

const known = fp({ monoCaps: 4, hairlines: 20, tabularNums: 3, shadowed: 0 });
const knownVerdict = compareWithHistory({ project: 'new', record, fingerprint: known, history: [] });
ok('the round-8 flat technical-editorial recipe fails even with an empty history',
  knownVerdict.problems.some((problem) => /flat technical-editorial SiteSmith recipe/.test(problem)),
  knownVerdict.problems.join('; '));

const distinct = compareWithHistory({ project: 'new', record, fingerprint: fp(), history: [] });
ok('a render outside the known recipe passes an empty history', distinct.problems.length === 0,
  distinct.problems.join('; '));

const four = fp({
  displayClass: 'system-sans', displayFamily: 'system-ui', monoCaps: 5, hairlines: 25,
  shadowed: 2, cards: 4,
});
const fourPrior = fp({
  groundBand: 'dark', displayClass: 'system-sans', displayFamily: 'system-ui', monoCaps: 8,
  hairlines: 40, shadowed: 3, cards: 6,
});
const fourVerdict = compareWithHistory({
  project: 'new', record, fingerprint: four,
  history: [{ project: 'old', when: '2026-07-01', axes: {}, fingerprint: fourPrior }],
});
ok('four shared measured devices fail across projects',
  fourVerdict.problems.some((problem) => /shares 4 house-style devices/.test(problem)),
  fourVerdict.problems.join('; '));

const threePrior = { ...fourPrior, cards: 0 };
const threeVerdict = compareWithHistory({
  project: 'new', record, fingerprint: four,
  history: [{ project: 'old', when: '2026-07-01', axes: {}, fingerprint: threePrior }],
});
ok('three shared devices alone do not reject a direction',
  !threeVerdict.problems.some((problem) => /house-style devices/.test(problem)),
  threeVerdict.problems.join('; '));

const exactVerdict = compareWithHistory({
  project: 'new', record, fingerprint: fp(),
  history: [{ project: 'old', when: '2026-07-01', axes: {}, fingerprint: fp() }],
});
ok('an exact coarse render fingerprint still fails',
  exactVerdict.problems.some((problem) => /renders the same as/.test(problem)),
  exactVerdict.problems.join('; '));

const selfVerdict = compareWithHistory({
  project: 'same', record, fingerprint: fp(),
  history: [{ project: 'same', when: '2026-07-01', axes: {}, fingerprint: fp() }],
});
ok('rerunning the same project does not clash with itself', selfVerdict.problems.length === 0,
  selfVerdict.problems.join('; '));

ok('the known recipe exposes all four measured devices',
  ['mono-uppercase-labels', 'hairline-separators', 'tabular-figure-motif', 'flat-surfaces']
    .every((name) => devicesFromFingerprint(known).has(name)));

const stored = historyEntry({
  project: 'private-client', record, fingerprint: fp(), when: '2026-07-30',
});
ok('a stored direction contains no client URL', !Object.hasOwn(stored, 'url'), JSON.stringify(stored));

const corruptRoot = await mkdtemp(join(tmpdir(), 'sitesmith-history-'));
try {
  const corrupt = join(corruptRoot, 'history.jsonl');
  await writeFile(corrupt, '{"project":"ok"}\nnot-json\n');
  let message = '';
  try { await readHistory(corrupt); } catch (error) { message = error.message; }
  ok('a corrupt ledger fails closed instead of silently forgetting history',
    /cannot be trusted/.test(message), message);
} finally {
  await rm(corruptRoot, { recursive: true, force: true });
}

console.log(`\n  ${bad ? `${bad} failure(s)` : 'direction memory blocks the house style'}\n`);
process.exit(bad ? 1 : 0);
