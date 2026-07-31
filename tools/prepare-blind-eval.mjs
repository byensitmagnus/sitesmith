#!/usr/bin/env node
/**
 * Build blinded evaluation packs from screening DIRECTION-PACKET.json files.
 * Writes key + scrubbed candidates. Does not score.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const h2h = join(root, 'docs/v3/proof/head-to-head');
const screening = join(h2h, 'runs/screening');
const outRoot = join(h2h, 'eval/blind');

const briefs = ['01-leather-goods', '02-atelier-printworks', '03-passage-console'];
const arms = ['taste-skill', 'ui-ux-pro-max', 'frontend-design', 'impeccable', 'sitesmith'];

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

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

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

const masterKey = { createdAt: new Date().toISOString(), briefs: {}, criteria: CRITERIA };
const briefBriefText = {};

for (const briefId of briefs) {
  const packDir = join(h2h, 'briefs', briefId);
  const briefMd = readFileSync(join(packDir, 'BRIEF.md'), 'utf8');
  const evidenceMd = readFileSync(join(packDir, 'EVIDENCE.md'), 'utf8');
  const constraintsMd = readFileSync(join(packDir, 'CONSTRAINTS.md'), 'utf8');
  briefBriefText[briefId] = {
    brief: scrub(briefMd),
    evidence: scrub(evidenceMd),
    constraints: scrub(constraintsMd),
  };

  const candidates = [];
  for (const arm of arms) {
    const p = join(screening, briefId, arm, 'DIRECTION-PACKET.json');
    if (!existsSync(p)) throw new Error(`missing ${p}`);
    const pkt = JSON.parse(readFileSync(p, 'utf8'));
    candidates.push({ arm, packet: blindPacket(pkt), packetSha: createHash('sha256').update(readFileSync(p)).digest('hex') });
  }

  // Seeded shuffle unique per brief
  const seed = createHash('sha256').update(`blind-eval-v1:${briefId}`).digest();
  const rand = mulberry32(seed.readUInt32BE(0));
  const order = candidates.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  const labels = ['P', 'Q', 'R', 'S', 'T'];
  const blinded = [];
  const keyMap = {};
  order.forEach((idx, pos) => {
    const label = labels[pos];
    keyMap[label] = candidates[idx].arm;
    blinded.push({
      id: label,
      ...candidates[idx].packet,
    });
  });

  masterKey.briefs[briefId] = { keyMap, order: order.map((i) => candidates[i].arm) };

  const evalDir = join(outRoot, briefId);
  mkdirSync(evalDir, { recursive: true });
  writeFileSync(
    join(evalDir, 'EVAL-PACK.json'),
    `${JSON.stringify({
      briefId,
      instructions: {
        role: 'blind design-direction evaluator',
        scoreScale: '1-5 integers only (1=poor, 5=excellent)',
        criteria: CRITERIA,
        qualitative: [
          'wouldBuild',
          'mostGeneric',
          'bestGrounded',
          'strongestDirection',
        ],
        rules: [
          'Do not guess system identity',
          'Score only from the blinded packet + brief pack',
          'Do not invent facts not in brief/evidence',
          'unknown fields are a mild implementability risk, not automatic fail',
        ],
      },
      briefPack: briefBriefText[briefId],
      candidates: blinded,
    }, null, 2)}\n`,
  );
}

mkdirSync(outRoot, { recursive: true });
writeFileSync(join(outRoot, 'KEY.json'), `${JSON.stringify(masterKey, null, 2)}\n`);
// Do not put KEY in evaluator prompt paths under eval/blind/*/ only KEY at root
writeFileSync(
  join(outRoot, 'CRITERIA.md'),
  `# Blind eval criteria (1–5)\n\n${CRITERIA.map((c) => `- ${c}`).join('\n')}\n\nQualitative: wouldBuild, mostGeneric, bestGrounded, strongestDirection (candidate id P–T).\n`,
);

console.log(JSON.stringify({ ok: true, briefs: briefs.length, outRoot: 'docs/v3/proof/head-to-head/eval/blind', key: masterKey.briefs }, null, 2));
