#!/usr/bin/env node
/**
 * Three contracts that agree on nothing. Original work, MIT.
 *
 *   node tools/test-portfolio-contracts.mjs
 *
 * This is the check the design contract round rests on, and it is the one most likely to
 * fail later. A contract with fields is one bad afternoon away from being a template with
 * fields: the fields get filled the same way twice because the same person is filling them,
 * and the second page inherits the first page's answers without anybody deciding to.
 *
 * The round's own rule was that the three pilots may not share a palette strategy, a font
 * family, a signature kind, a first-viewport structure or a closing structure, and that the
 * differences have to come from the briefs rather than from a diversity quota. This can only
 * check the first half. The second half is why the briefs are committed next to the
 * contracts: a reader can see whether a glazier, a lock keeper and a seed bank were asking
 * for different things, or whether three different-looking pages were made to order.
 *
 * Round 8 of the cold builds failed on exactly this and passed every individual check while
 * doing it. That is the precedent.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

const PILOTS = [
  { name: '01-buy, glazier', path: 'evidence/pilot/record/contract.json' },
  { name: '02-operate, lock keeper', path: 'evidence/pilots/02-operate/record/contract.json' },
  { name: '03-read, seed bank', path: 'evidence/pilots/03-persuade/record/contract.json' },
];

const DIMENSIONS = [
  ['palette strategy', (c) => c.colour.strategy],
  ['ground', (c) => c.colour.primitives.find((p) => p.token === c.colour.roles.background)?.value],
  ['action colour', (c) => c.colour.primitives.find((p) => p.token === c.colour.roles.action)?.value],
  ['type pairing', (c) => c.typography.roles.map((r) => r.family).sort().join(' + ')],
  ['signature', (c) => c.layout.signature.selector],
  ['first viewport object', (c) => c.layout.firstViewportObject.selector],
  ['density', (c) => c.layout.density],
];

const rows = [];
for (const p of PILOTS) {
  rows.push({ pilot: p.name, contract: JSON.parse(await readFile(join(ROOT, p.path), 'utf8')) });
}

let failed = 0;
console.log('\n  three pilots, seven dimensions\n');

const table = rows.map((r) => Object.fromEntries([
  ['pilot', r.pilot],
  ...DIMENSIONS.map(([name, read]) => [name, read(r.contract)]),
]));
console.table(table);

for (const [name, read] of DIMENSIONS) {
  const values = rows.map((r) => read(r.contract));
  const unique = new Set(values.filter((v) => v !== undefined));
  if (unique.size !== rows.length) {
    console.log(`  FAIL  two pilots share the same ${name}: ${values.join(' | ')}`);
    failed++;
  } else {
    console.log(`  ok    ${name}: ${unique.size} of ${rows.length} distinct`);
  }
}

/* Font families are checked one by one rather than as a pairing, because two pilots sharing
   a body face while differing on the display face would pass the pairing check and would
   still be two pages written in the same voice. It happened once in this round: the seed
   bank inherited the lock console's body face and had to be given its own. */
const families = rows.flatMap((r) => r.contract.typography.roles.map((x) => x.family));
const shared = [...new Set(families.filter((f, i) => families.indexOf(f) !== i))];
if (shared.length) {
  console.log(`  FAIL  a font family appears in more than one pilot: ${shared.join(', ')}`);
  failed++;
} else {
  console.log(`  ok    ${families.length} font families across three pilots, none shared`);
}

/* Every contract has to be able to say what a competitor could also arrive at. A genericness
   risk that is empty, or the same sentence in two contracts, is the field going through the
   motions. */
const risks = rows.map((r) => r.contract.colour.genericnessRisk);
if (risks.some((r) => !r || r.length < 80)) {
  console.log('  FAIL  a contract states no real genericness risk for its palette');
  failed++;
} else if (new Set(risks).size !== risks.length) {
  console.log('  FAIL  two contracts state the same genericness risk');
  failed++;
} else {
  console.log('  ok    each contract names a different genericness risk, in its own terms');
}

console.log(`\n  ${failed ? `${failed} failing` : 'three contracts, no shared choice on any dimension'}\n`);
process.exit(failed ? 1 : 0);
