#!/usr/bin/env node
/**
 * Mini-1 leather: blind pack for sitesmith-rules vs frozen frontend-design (screening-v2).
 * Not a full H2H — two packets only.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const h2h = join(root, 'docs/v3/proof/head-to-head');
const briefId = '01-leather-goods';
const mini = join(h2h, 'mini-proof');
const evalDir = join(h2h, 'eval', 'mini-1-leather');

const CRITERIA = [
  'briefFit',
  'subjectSpecificity',
  'originality',
  'composition',
  'hierarchy',
  'typography',
  'materiality',
  'assetStrategy',
  'interaction',
  'signature',
  'antiCliche',
  'implementability',
];

function scrub(text) {
  let s = String(text ?? '');
  const ban = [
    /sitesmith/gi,
    /direction engine/gi,
    /taste-skill/gi,
    /ui-ux-pro-max/gi,
    /uupm/gi,
    /frontend-design/gi,
    /impeccable/gi,
    /worldId/gi,
    /poster-type|statement-object|split-evidence|material-board|editorial-bleed|product-interface/gi,
    /e988add[0-9a-f]*/gi,
    /4857a2c[0-9a-f]*/gi,
    /b29e7cf[0-9a-f]*/gi,
    /6b34224[0-9a-f]*/gi,
    /b92cdab[0-9a-f]*/gi,
    /TASTE-CAP-\d+/gi,
    /local-world-library-seed/gi,
    /UUPM-RETRIEVAL/gi,
    /search\.py/gi,
    /Design Read/gi,
    /challenger/gi,
    /capabilityId/gi,
    /proofMeta/gi,
    /engine-result/gi,
    /northline-sig-L\d/gi,
    /creativePass/gi,
    /screening-v2/gi,
  ];
  for (const re of ban) s = s.replace(re, '[redacted]');
  return s;
}

function blindPacket(pkt) {
  const fields = [
    'designThesis',
    'subjectGrounding',
    'composition',
    'informationHierarchy',
    'typography',
    'colourAndMaterialModel',
    'imageryAndAssetStrategy',
    'interactionConcept',
    'signatureElement',
    'primaryRisk',
    'implementationGuidance',
    'unknowns',
  ];
  const out = {};
  for (const f of fields) {
    const v = pkt[f];
    if (v == null) out[f] = 'unknown';
    else if (typeof v === 'object') out[f] = scrub(JSON.stringify(v));
    else out[f] = scrub(v);
  }
  return out;
}

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const fdSrc = join(h2h, 'runs/screening-v2', briefId, 'frontend-design', 'DIRECTION-PACKET.json');
const fdDir = join(mini, `${briefId}-frontend-design-frozen-v2`);
mkdirSync(fdDir, { recursive: true });
copyFileSync(fdSrc, join(fdDir, 'DIRECTION-PACKET.json'));
writeFileSync(
  join(fdDir, 'SOURCE.json'),
  `${JSON.stringify(
    {
      arm: 'frontend-design',
      phase: 'screening-v2',
      path: 'docs/v3/proof/head-to-head/runs/screening-v2/01-leather-goods/frontend-design/DIRECTION-PACKET.json',
      role: 'frozen-baseline-for-mini-1',
    },
    null,
    2,
  )}\n`,
);

const sitesmithPath = join(mini, `${briefId}-rules`, 'DIRECTION-PACKET.json');
const fdPath = join(fdDir, 'DIRECTION-PACKET.json');
const ssPkt = JSON.parse(readFileSync(sitesmithPath, 'utf8'));
const fdPkt = JSON.parse(readFileSync(fdPath, 'utf8'));

const candidates = [
  {
    arm: 'sitesmith-rules',
    packet: blindPacket(ssPkt),
    packetSha: createHash('sha256').update(readFileSync(sitesmithPath)).digest('hex'),
    rawPath: 'mini-proof/01-leather-goods-rules/DIRECTION-PACKET.json',
  },
  {
    arm: 'frontend-design-frozen-v2',
    packet: blindPacket(fdPkt),
    packetSha: createHash('sha256').update(readFileSync(fdPath)).digest('hex'),
    rawPath: 'mini-proof/01-leather-goods-frontend-design-frozen-v2/DIRECTION-PACKET.json',
  },
];

const seed = createHash('sha256').update('blind-eval-mini-1:01-leather-goods').digest();
const rand = mulberry32(seed.readUInt32BE(0));
const order = candidates.map((_, i) => i);
for (let i = order.length - 1; i > 0; i -= 1) {
  const j = Math.floor(rand() * (i + 1));
  [order[i], order[j]] = [order[j], order[i]];
}

const labels = ['M', 'N'];
const keyMap = {};
const blinded = [];
order.forEach((idx, pos) => {
  const label = labels[pos];
  keyMap[label] = candidates[idx].arm;
  blinded.push({ id: label, ...candidates[idx].packet });
});

const packDir = join(h2h, 'briefs', briefId);
const briefPack = {
  brief: scrub(readFileSync(join(packDir, 'BRIEF.md'), 'utf8')),
  evidence: scrub(readFileSync(join(packDir, 'EVIDENCE.md'), 'utf8')),
  constraints: scrub(readFileSync(join(packDir, 'CONSTRAINTS.md'), 'utf8')),
};

mkdirSync(evalDir, { recursive: true });
writeFileSync(
  join(evalDir, 'EVAL-PACK.json'),
  `${JSON.stringify(
    {
      briefId,
      comparison: 'mini-1-leather',
      packets: [
        'sitesmith-rules (orchestrator creative=rules)',
        'frontend-design frozen screening-v2',
      ],
      instructions: {
        role: 'blind design-direction evaluator',
        scoreScale: '1-5 integers only (1=poor, 5=excellent)',
        criteria: CRITERIA,
        qualitative: ['wouldBuild', 'mostGeneric', 'bestGrounded', 'strongestDirection'],
        rules: [
          'Do not guess system identity',
          'Score only from the blinded packet + brief pack',
          'Do not invent facts not in brief/evidence',
          'unknown fields are a mild implementability risk, not automatic fail',
          'Two candidates only (M/N) — mini fair compare, not full H2H',
        ],
      },
      briefPack,
      candidates: blinded,
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  join(evalDir, 'KEY.json'),
  `${JSON.stringify(
    {
      createdAt: new Date().toISOString(),
      comparison: 'mini-1-leather',
      briefId,
      keyMap,
      order: order.map((i) => candidates[i].arm),
      packetShas: Object.fromEntries(order.map((i, pos) => [labels[pos], candidates[i].packetSha])),
      sources: Object.fromEntries(order.map((i, pos) => [labels[pos], candidates[i].rawPath])),
      criteria: CRITERIA,
      llmCreative: 'blocked — see mini-proof/LLM-BLOCKED.md',
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  join(evalDir, 'CRITERIA.md'),
  `# Mini-1 blind criteria (1–5)\n\n${CRITERIA.map((c) => `- ${c}`).join('\n')}\n\nQualitative: wouldBuild, mostGeneric, bestGrounded, strongestDirection (candidate id M|N).\n`,
);

console.log(JSON.stringify({ ok: true, keyMap, order: order.map((i) => candidates[i].arm), evalDir: 'docs/v3/proof/head-to-head/eval/mini-1-leather' }, null, 2));
