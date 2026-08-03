#!/usr/bin/env node
/**
 * Three contracts that are not the same direction. Original work, MIT.
 *
 *   node tools/test-portfolio-contracts.mjs              the three real pilots
 *   node tools/test-portfolio-contracts.mjs --fixtures   the four cases this must get right
 *
 * What this checks, and what it deliberately does not.
 *
 * The first version failed as soon as any two pilots shared any single value: one font
 * family, one palette strategy, one density. That is a diversity quota, and a quota is worse
 * than the convergence it is meant to catch, because the next build satisfies it by choosing
 * an artificial difference rather than the right answer. Two subjects can honestly land on
 * `restrained`, and two pages can honestly be set in the same body face.
 *
 * So a single shared value is reported and never blocks. What blocks is **the same direction**:
 *
 *   1. an identical fingerprint across the six central axes, or
 *   2. a high weighted similarity across several of them, where the two contracts also give
 *      the same reason for the sharing.
 *
 * The second clause is the one that matters. Two contracts may share a palette strategy and a
 * density and still be two designs, if each says why in its own subject's terms. They are one
 * design when they share the values **and** the reasoning, because then nothing decided the
 * second page except the first one.
 *
 * Round 8 of the cold builds is the precedent: three pages passed every individual check and
 * were one studio using one recipe. Nothing here can settle whether the differences genuinely
 * come from the briefs. That is why the briefs are committed next to the contracts, and it
 * stays a person's judgement.
 */

import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

const PILOTS = [
  { name: '01-buy, glazier', path: 'evidence/pilot/record/contract.json' },
  { name: '02-operate, lock keeper', path: 'evidence/pilots/02-operate/record/contract.json' },
  { name: '03-read, seed bank', path: 'evidence/pilots/03-persuade/record/contract.json' },
];

/* The six central axes, weighted as a combination. A signature and a first viewport are what
   a reader meets; a palette system and a typography system are what the page is made of; the
   closing structure is how it lets go; density is the one that is hardest to vary honestly,
   so it carries the least. */
const AXES = [
  {
    key: 'palette system', weight: 2,
    value: (c) => [c.colour.strategy, tok(c, c.colour.roles.background), tok(c, c.colour.roles.action)].join(' / '),
    reason: (c) => c.colour.strategyWhy,
  },
  {
    key: 'typography system', weight: 2,
    value: (c) => c.typography.roles.map((r) => `${r.role}:${r.family}`).sort().join(' + '),
    reason: (c) => c.typography.roles.map((r) => r.why).join(' '),
  },
  {
    key: 'signature', weight: 2,
    value: (c) => `${c.layout.signature.selector} ${kind(c.layout.signature.what)}`,
    reason: (c) => c.layout.signature.what,
  },
  {
    key: 'first viewport', weight: 2,
    value: (c) => `${c.layout.firstViewportObject.selector} ${kind(c.layout.firstViewportObject.what)}`,
    reason: (c) => c.layout.firstViewportObject.what,
  },
  {
    key: 'closing structure', weight: 1.5,
    /* The footer is the last thing on every page ever written, so it is dropped: what is
       being compared is the last thing that carries an argument. */
    value: (c) => `${(c.layout.supporting ?? []).filter((s) => !/fod|foot/i.test(s)).at(-1) ?? 'none'} ${closing(c.layout.path)}`,
    reason: (c) => c.layout.path,
  },
  { key: 'density', weight: 1, value: (c) => c.layout.density, reason: (c) => c.layout.densityWhy },
];

const TOTAL = AXES.reduce((n, a) => n + a.weight, 0);

/* Two contracts are the same direction when they share most of the weight AND agree on why.
   0.6 of 10.5 needs four of the six axes; three of six is 0.55 and passes, which is the case
   the fixtures call "several shared choices, different briefs". */
const SAME_DIRECTION = 0.6;

/* Reasons this close are the same reason in different words. The threshold is the ledger's,
   for the same job: telling a second answer from a restatement of the first. */
const SAME_REASON = 0.4;

const tok = (c, name) => c.colour.primitives.find((p) => p.token === name)?.value ?? name;

/* A signature is a kind of thing before it is a selector: two pages with a drawn measurement
   are closer than a selector comparison would say. */
function kind(what = '') {
  const s = what.toLowerCase();
  if (/timeline|ribbon|band where|hours of/.test(s)) return '[timeline]';
  if (/drawing|drawn|svg|section through|scale bar/.test(s)) return '[drawing]';
  if (/table|list of|rows/.test(s)) return '[table]';
  if (/photograph|image/.test(s)) return '[photograph]';
  if (/type set|lettering|word/.test(s)) return '[type]';
  return '[other]';
}

/* How a page lets go: the last clause of the reading path, reduced to its verb. */
function closing(path = '') {
  const tail = path.split(/,|\bthen\b/).at(-1)?.trim().toLowerCase() ?? '';
  if (/send|enquir|write|order|specification/.test(tail)) return '[hands something over]';
  if (/read|see|understand|what happened|missing/.test(tail)) return '[leaves you reading]';
  if (/act|acknowledg|hold|request/.test(tail)) return '[leaves you acting]';
  return '[other]';
}

const STOP = new Set(('a an and are as at be because but by for from has have in into is it its of on or that the their them '
  + 'they this to was were what which who will with would you your not no so one two three page it s').split(' '));
const words = (s) => new Set(String(s ?? '').toLowerCase().match(/[a-zæøå0-9]{3,}/g)?.filter((w) => !STOP.has(w)) ?? []);
function jaccard(a, b) {
  const A = words(a); const B = words(b);
  if (!A.size || !B.size) return 0;
  let hit = 0;
  for (const w of A) if (B.has(w)) hit++;
  return hit / (A.size + B.size - hit);
}

export function fingerprint(c) {
  return createHash('sha256').update(AXES.map((a) => a.value(c)).join('|')).digest('hex').slice(0, 12);
}

/**
 * @returns {{blocking: string[], advisory: string[], pairs: object[], rows: object[]}}
 */
export function compare(entries) {
  const blocking = [];
  const advisory = [];
  const pairs = [];

  const rows = entries.map((e) => ({
    pilot: e.name,
    ...Object.fromEntries(AXES.map((a) => [a.key, a.value(e.contract)])),
    fingerprint: fingerprint(e.contract),
  }));

  const byPrint = new Map();
  for (const r of rows) byPrint.set(r.fingerprint, [...(byPrint.get(r.fingerprint) ?? []), r.pilot]);
  for (const [print, who] of byPrint) {
    if (who.length > 1) blocking.push(`identical design fingerprint ${print}: ${who.join(' and ')} are the same direction on all six central axes`);
  }

  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const [a, b] = [entries[i], entries[j]];
      const shared = [];
      let sameValue = 0;
      let sameValueAndReason = 0;
      for (const ax of AXES) {
        if (ax.value(a.contract) !== ax.value(b.contract)) continue;
        const overlap = jaccard(ax.reason(a.contract), ax.reason(b.contract));
        const justified = overlap < SAME_REASON;
        shared.push({ axis: ax.key, weight: ax.weight, overlap: Math.round(overlap * 100) / 100, justified });
        sameValue += ax.weight;
        if (!justified) sameValueAndReason += ax.weight;
      }
      const similarity = Math.round((sameValue / TOTAL) * 100) / 100;
      const converged = Math.round((sameValueAndReason / TOTAL) * 100) / 100;
      pairs.push({ a: a.name, b: b.name, shared, similarity, converged });

      if (shared.length === 1) {
        advisory.push(`${a.name} and ${b.name} share one axis, ${shared[0].axis}. One shared value is not convergence: two subjects can honestly land on the same answer.`);
      } else if (shared.length > 1 && converged < SAME_DIRECTION) {
        advisory.push(`${a.name} and ${b.name} share ${shared.length} axes (${shared.map((s) => s.axis).join(', ')}) at similarity ${similarity}, and each names its own reason. Worth a person looking at, not a failure.`);
      }
      if (converged >= SAME_DIRECTION) {
        blocking.push(`${a.name} and ${b.name} share ${shared.filter((s) => !s.justified).map((s) => s.axis).join(', ')} and give the same reason for it: ${converged} of the central weight. That is one direction wearing two names.`);
      }
    }
  }

  /* Reported and never blocking. A shared body face is a real thing to notice and a bad
     thing to fail on: it is one decision out of a design, and a page can be entirely its
     own with somebody else's text face in it. */
  const families = entries.flatMap((e) => e.contract.typography.roles.map((r) => ({ family: r.family, pilot: e.name })));
  const counted = new Map();
  for (const f of families) counted.set(f.family, [...(counted.get(f.family) ?? []), f.pilot]);
  for (const [family, who] of counted) {
    if (who.length > 1) advisory.push(`${family} is used by ${who.join(' and ')}. Advisory: check that each contract gives it its own reason.`);
  }

  return { blocking, advisory, pairs, rows };
}

/* ── fixtures ─────────────────────────────────────────────────────────────
   Four cases the contract of this check has to get right, and the first one is the case
   that made it wrong before: two honest projects sharing a body font. */

const base = () => ({
  colour: {
    strategy: 'restrained',
    strategyWhy: 'A quiet ground because the subject is quiet and the one colour has work to do.',
    roles: { background: 'ground', action: 'accent' },
    primitives: [{ token: 'ground', value: '#eeeeee' }, { token: 'accent', value: '#225533' }],
  },
  typography: { roles: [{ role: 'body', family: 'Corbel', why: 'old-style figures sit in the line like words' }] },
  layout: {
    signature: { selector: '.thing', what: 'a drawing of the bench, measured' },
    firstViewportObject: { selector: '.thing', what: 'the same drawing' },
    supporting: ['.list', '.fod'],
    path: 'see it, enter it, then write the cutting specification',
    density: 'measured',
    densityWhy: 'a docket is dense where the numbers are',
  },
});

const clone = (o) => JSON.parse(JSON.stringify(o));

function fixtures() {
  const cases = [];

  /* 1. Two different projects that legitimately share a body font. */
  {
    const a = clone(base());
    const b = clone(base());
    b.colour.strategy = 'drenched';
    b.colour.strategyWhy = 'The room is dark and the screen is read at two in the morning.';
    b.colour.primitives = [{ token: 'ground', value: '#101010' }, { token: 'accent', value: '#c9a227' }];
    b.typography.roles = [{ role: 'body', family: 'Corbel', why: 'a keeper reads prose in what the screen already sets' }];
    b.layout.signature = { selector: '.ribbon', what: 'eight hours drawn as one horizontal band, a timeline' };
    b.layout.firstViewportObject = { selector: '.ribbon', what: 'the same ribbon, a timeline of the night' };
    b.layout.supporting = ['.log', '.fod'];
    b.layout.path = 'see the shape of the night, then read what happened and what is missing';
    b.layout.density = 'packed';
    b.layout.densityWhy = 'a keeper who looks every two minutes needs the whole shift at once';
    cases.push({ name: 'two projects that legitimately share a body font', want: 'pass', wantAdvisory: /Corbel is used by/, entries: [{ name: 'A', contract: a }, { name: 'B', contract: b }] });
  }

  /* 2. Two projects with a near-identical overall direction. */
  {
    const a = clone(base());
    const b = clone(base());
    b.colour.primitives = [{ token: 'ground', value: '#eeeeee' }, { token: 'accent', value: '#225533' }];
    b.layout.signature = { selector: '.thing', what: 'a drawing of the bench, measured' };
    b.layout.density = 'measured';
    b.layout.densityWhy = 'a docket is dense where the numbers are, and this one is too';
    cases.push({ name: 'a near-identical overall direction', want: 'fail', entries: [{ name: 'A', contract: a }, { name: 'B', contract: b }] });
  }

  /* 3. Several shared choices, different brief requirements and different structures. */
  {
    const a = clone(base());
    const b = clone(base());
    b.colour.strategyWhy = 'A seed bank asks a stranger for access, and a loud page reads as a campaign rather than a request.';
    b.typography.roles = [{ role: 'body', family: 'Corbel', why: 'an approach to a landowner has to sound like a letter' }];
    b.layout.signature = { selector: '.morning', what: 'one morning drawn as a timeline from seven to twelve' };
    b.layout.firstViewportObject = { selector: '.morning', what: 'the same timeline, with twelve dots on it' };
    b.layout.supporting = ['.season', '.fod'];
    b.layout.path = 'understand the morning, then send the enquiry';
    b.layout.densityWhy = 'a page asking permission leaves room to say no';
    cases.push({ name: 'several shared choices, different briefs and structures', want: 'pass', entries: [{ name: 'A', contract: a }, { name: 'B', contract: b }] });
  }

  /* 4. An identical fingerprint. */
  {
    const a = clone(base());
    const b = clone(base());
    cases.push({ name: 'an identical fingerprint', want: 'fail', wantBlocking: /identical design fingerprint/, entries: [{ name: 'A', contract: a }, { name: 'B', contract: b }] });
  }

  let failed = 0;
  console.log('\n  the check itself, against four cases it has to get right\n');
  for (const c of cases) {
    const r = compare(c.entries);
    const got = r.blocking.length ? 'fail' : 'pass';
    let ok = got === c.want;
    let why = `wanted ${c.want}, got ${got}`;
    if (ok && c.wantAdvisory) {
      const hit = r.advisory.some((a) => c.wantAdvisory.test(a));
      if (!hit) { ok = false; why = `passed, and no advisory matched ${c.wantAdvisory}`; }
    }
    if (ok && c.wantBlocking) {
      const hit = r.blocking.some((b) => c.wantBlocking.test(b));
      if (!hit) { ok = false; why = `failed, and no blocking line matched ${c.wantBlocking}`; }
    }
    console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${c.name}${ok ? '' : `\n          ${why}\n          blocking: ${JSON.stringify(r.blocking)}\n          advisory: ${JSON.stringify(r.advisory)}`}`);
    if (!ok) failed++;
  }
  console.log(`\n  ${failed ? `${failed} failing` : 'the check blocks a shared direction and reports a shared value'}\n`);
  return failed;
}

/* ── run ──────────────────────────────────────────────────────────────────── */

if (process.argv.includes('--fixtures')) process.exit(fixtures() ? 1 : 0);

const entries = [];
for (const p of PILOTS) {
  entries.push({ name: p.name, contract: JSON.parse(await readFile(join(ROOT, p.path), 'utf8')) });
}

const { blocking, advisory, pairs, rows } = compare(entries);

console.log('\n  three pilots, six central axes\n');
console.table(rows);

console.log('  PAIRWISE');
for (const p of pairs) {
  console.log(`    ${p.a}  vs  ${p.b}`);
  console.log(`      similarity ${p.similarity} of 1, of which ${p.converged} also shares its reasoning`);
  if (p.shared.length) {
    for (const s of p.shared) {
      console.log(`      shared: ${s.axis} (weight ${s.weight}), reasons overlap ${s.overlap} ${s.justified ? 'so each names its own' : 'which is the same reason twice'}`);
    }
  } else console.log('      no shared axis');
}
console.log('');

if (advisory.length) {
  console.log('  ADVISORY, never blocking');
  for (const a of advisory) console.log(`    ${a}`);
  console.log('');
}

if (blocking.length) {
  console.log('  BLOCKING');
  for (const b of blocking) console.log(`    ${b}`);
  console.log('\n  Two contracts are one direction. Change the contract that has the weaker reason,');
  console.log('  from its own brief. Do not change a pilot to satisfy this check.\n');
  process.exit(1);
}

console.log('  no two contracts are the same direction\n');
console.log('  This cannot tell whether the differences come from the briefs. The briefs are');
console.log('  committed next to the contracts so a person can decide that.\n');
process.exit(0);
