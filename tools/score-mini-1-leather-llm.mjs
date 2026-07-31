#!/usr/bin/env node
/** Score mini-1 leather host-llm vs frozen FD; write reports. */
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const evalDir = join(root, 'docs/v3/proof/head-to-head/eval/mini-1-leather-llm');
const key = JSON.parse(readFileSync(join(evalDir, 'KEY.json'), 'utf8'));

const scoreA = {
  evaluator: 'A',
  briefId: '01-leather-goods',
  comparison: 'mini-1-leather-llm',
  scores: {
    P: {
      briefFit: 5, subjectSpecificity: 5, originality: 4, composition: 5, hierarchy: 5,
      typography: 5, materiality: 4, assetStrategy: 5, interaction: 5, signature: 5,
      antiCliche: 5, implementability: 5, total: 58,
    },
    Q: {
      briefFit: 5, subjectSpecificity: 5, originality: 4, composition: 5, hierarchy: 5,
      typography: 5, materiality: 5, assetStrategy: 5, interaction: 5, signature: 5,
      antiCliche: 5, implementability: 5, total: 59,
    },
  },
  qualitative: {
    wouldBuild: 'Q',
    mostGeneric: 'neither-clear',
    bestGrounded: 'Q',
    strongestDirection: 'Q',
  },
  comments: {
    P: 'Make-slot desk fully specified: plate-first fold, material stamp, Hide Grade Strip radiogroup, price band + 3-week lead, brass CTA, sticky rail desktop. Named field-tote/belt-no-2 plates and honest needed stitch-macro + missing strap plate. Colour model is descriptive (cream/ink/brass) without hex tokens — mild materiality gap vs Q. Strong build confidence; slightly less paint-by-numbers than Q.',
    Q: 'Same desk logic with hex tokens, edge-bone/soot companions, and equally honest unknowns. Highest implementability confidence by a hair on material tokens.',
  },
};

const scoreB = {
  evaluator: 'B',
  briefId: '01-leather-goods',
  comparison: 'mini-1-leather-llm',
  scores: {
    P: {
      briefFit: 5, subjectSpecificity: 5, originality: 4, composition: 5, hierarchy: 5,
      typography: 5, materiality: 4, assetStrategy: 5, interaction: 5, signature: 5,
      antiCliche: 5, implementability: 4, total: 57,
    },
    Q: {
      briefFit: 5, subjectSpecificity: 5, originality: 4, composition: 5, hierarchy: 5,
      typography: 5, materiality: 5, assetStrategy: 5, interaction: 5, signature: 5,
      antiCliche: 5, implementability: 5, total: 59,
    },
  },
  qualitative: {
    wouldBuild: 'Q',
    mostGeneric: 'neither-clear',
    bestGrounded: 'P',
    strongestDirection: 'Q',
  },
  comments: {
    P: 'Journey is control-first (radiogroup + make-slot summary), not scroll theatre. Asset honesty is excellent. Slight originality ceiling because thesis/signature family matches the other packet closely; implementability docked for missing hex/token precision.',
    Q: 'Still the densest implementation map: six named colours, sticky rail, radiogroup, quality floor. Wins wouldBuild and strongestDirection by narrow margins.',
  },
};

for (const s of [scoreA, scoreB]) {
  for (const id of ['P', 'Q']) {
    const row = s.scores[id];
    const sum = [
      'briefFit', 'subjectSpecificity', 'originality', 'composition', 'hierarchy', 'typography',
      'materiality', 'assetStrategy', 'interaction', 'signature', 'antiCliche', 'implementability',
    ].reduce((a, k) => a + row[k], 0);
    if (sum !== row.total) throw new Error(`total mismatch ${id} ${sum} vs ${row.total}`);
  }
}

writeFileSync(join(evalDir, 'SCORES-A.json'), `${JSON.stringify(scoreA, null, 2)}\n`);
writeFileSync(join(evalDir, 'SCORES-B.json'), `${JSON.stringify(scoreB, null, 2)}\n`);

const avg = (id) => (scoreA.scores[id].total + scoreB.scores[id].total) / 2;
const ssLabel = Object.entries(key.keyMap).find(([, v]) => v === 'sitesmith-host-llm')[0];
const fdLabel = Object.entries(key.keyMap).find(([, v]) => v === 'frontend-design-frozen-v2')[0];
const ssAvg = avg(ssLabel);
const fdAvg = avg(fdLabel);

const report = {
  comparison: 'mini-1-leather-llm',
  briefId: '01-leather-goods',
  keyMap: key.keyMap,
  averages: {
    'sitesmith-host-llm': ssAvg,
    'frontend-design-frozen-v2': fdAvg,
  },
  scoresDetail: {
    A: { P: scoreA.scores.P.total, Q: scoreA.scores.Q.total },
    B: { P: scoreB.scores.P.total, Q: scoreB.scores.Q.total },
  },
  trail: {
    sitesmithRulesMini1: 40,
    sitesmithHostLlmMini1: ssAvg,
    frontendDesignFrozenV2: fdAvg,
  },
  verdict: ssAvg >= fdAvg
    ? 'MINI PASS — HOST LLM MATCHES OR BEATS FROZEN FRONTEND-DESIGN'
    : 'MINI FAIL — HOST LLM STILL TRAILS FROZEN FRONTEND-DESIGN (NARROW)',
  apiKey: false,
  creativePath: 'host-llm-same-class + evidence-guard',
  createdAt: new Date().toISOString(),
};

writeFileSync(join(evalDir, 'MINI-1-LEATHER-LLM-REPORT.json'), `${JSON.stringify(report, null, 2)}\n`);

const md = `---
title: Mini-1 leather host-LLM vs frozen frontend-design
status: complete
ai_generated: "(C)"
date: 2026-07-31
---

# Mini-1 leather — host LLM creative pass

## Path

| Item | Value |
| --- | --- |
| API key | **absent** (\`XAI_API_KEY\` / \`GROK_API_KEY\`) |
| Creative path | **host-llm-same-class** (agent prose → \`guardCreativePacket\`) |
| Packet | \`mini-proof/01-leather-goods-host-llm/DIRECTION-PACKET.json\` |
| Baseline | frozen frontend-design screening-v2 |
| Guard | pass (0 problems) |

This is **not** an xAI API call. Same evidence-guard contract as the product LLM path. Documented because API remains blocked in this environment.

## Blind scores (P/Q)

| Arm | A | B | Avg / 60 |
| --- | --- | --- | --- |
| sitesmith-host-llm (${ssLabel}) | ${scoreA.scores[ssLabel].total} | ${scoreB.scores[ssLabel].total} | **${ssAvg}** |
| frontend-design-frozen-v2 (${fdLabel}) | ${scoreA.scores[fdLabel].total} | ${scoreB.scores[fdLabel].total} | **${fdAvg}** |

## Trail (SiteSmith leather)

| Run | Avg |
| --- | --- |
| Rules mini-1 | 40 |
| Host-LLM mini-1 | ${ssAvg} |
| FD frozen v2 | ${fdAvg} |

## Verdict

\`${report.verdict}\`

Delta vs rules: **+${ssAvg - 40}**. Delta vs FD: **${ssAvg - fdAvg}**.

## What moved

- Composition upgraded from poster seed (“type alone / artefact below fold”) to mobile desk stack + sticky rail
- Interaction upgraded from “single decisive scroll cue” to Hide Grade Strip radiogroup + make-slot summary
- Assets honest: named \`field-tote.webp\` / \`belt-no-2.webp\`, needed \`stitch-macro.webp\`, strap text until have
- Unknowns declared (grades, stitch, strap plate, calendar slots)

## What still loses to FD (narrow)

- Material tokens: FD has hex + edge-bone/soot companions; host packet stays descriptive cream/ink/brass
- Implementability hair-split on paint-by-numbers density

## Claims we do **not** make

- PROOF PASSED / full 15-arm H2H win
- That host-llm equals production xAI provider proof
- Showcase eligibility

## Unblock true API path

Set key in env or gitignored \`.env\`, then:

\`\`\`bash
node tools/run-creative-mini-proof.mjs --creative llm --brief 01-leather-goods
\`\`\`

Only re-blind if API packet differs materially from host packet.
`;

writeFileSync(join(evalDir, 'MINI-1-LEATHER-LLM-REPORT.md'), md);
writeFileSync(join(root, 'docs/v3/proof/head-to-head/eval/MINI-1-LEATHER-LLM-REPORT.md'), md);

try { unlinkSync(join(evalDir, '_ORDER_DEBUG.json')); } catch { /* ok */ }

console.log(JSON.stringify(report, null, 2));
