#!/usr/bin/env node
import { readFileSync, writeFileSync, appendFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const h2h = join(root, 'docs/v3/proof/head-to-head');
const blind = join(h2h, 'eval/blind');
const key = JSON.parse(readFileSync(join(blind, 'KEY.json'), 'utf8'));
const criteria = key.criteria;
const briefs = Object.keys(key.briefs);

function load(p) {
  return JSON.parse(readFileSync(p, 'utf8'));
}

const report = {
  phase: 'blind-evaluation',
  completedAt: new Date().toISOString(),
  criteria,
  briefs: {},
  sitesmithBriefOutcomes: {},
  agreement: {},
  verdict: null,
  proofStatus: null,
};

let sitesmithWins = 0;
let sitesmithTies = 0;
let sitesmithLosses = 0;

for (const brief of briefs) {
  const A = load(join(blind, brief, 'SCORES-A.json'));
  const B = load(join(blind, brief, 'SCORES-B.json'));
  const km = key.briefs[brief].keyMap;

  const cand = {};
  for (const lab of ['P', 'Q', 'R', 'S', 'T']) {
    const arm = km[lab];
    const ta = A.scores[lab].total;
    const tb = B.scores[lab].total;
    const crit = {};
    for (const c of criteria) {
      const va = A.scores[lab][c];
      const vb = B.scores[lab][c];
      crit[c] = { A: va, B: vb, avg: (va + vb) / 2 };
    }
    cand[arm] = {
      label: lab,
      totalA: ta,
      totalB: tb,
      totalAvg: (ta + tb) / 2,
      criteria: crit,
      comments: {
        A: A.comments?.[lab] ?? null,
        B: B.comments?.[lab] ?? null,
      },
    };
  }

  const ranked = Object.entries(cand).sort((a, b) => b[1].totalAvg - a[1].totalAvg);
  const bestScore = ranked[0][1].totalAvg;
  const firstPlace = ranked.filter(([, v]) => Math.abs(v.totalAvg - bestScore) < 0.01).map(([a]) => a);
  const ss = cand.sitesmith.totalAvg;
  const ups = ranked.filter(([a]) => a !== 'sitesmith');
  const bestUp = ups[0];
  const bestUpScore = bestUp[1].totalAvg;

  let outcome;
  if (firstPlace.includes('sitesmith') && firstPlace.length === 1) {
    outcome = 'win';
    sitesmithWins += 1;
  } else if (firstPlace.includes('sitesmith') && firstPlace.length > 1) {
    outcome = 'tie-first';
    sitesmithTies += 1;
  } else if (Math.abs(ss - bestUpScore) < 0.01) {
    outcome = 'match';
    sitesmithTies += 1;
  } else if (ss > bestUpScore) {
    outcome = 'win';
    sitesmithWins += 1;
  } else {
    outcome = 'loss';
    sitesmithLosses += 1;
  }

  const unb = (q) => Object.fromEntries(Object.entries(q).map(([k, v]) => [k, km[v] ?? v]));
  const rankA = ['P', 'Q', 'R', 'S', 'T'].sort((x, y) => B.scores[y].total - A.scores[x].total);
  // fix rankA properly
  const rA = ['P', 'Q', 'R', 'S', 'T'].slice().sort((x, y) => A.scores[y].total - A.scores[x].total);
  const rB = ['P', 'Q', 'R', 'S', 'T'].slice().sort((x, y) => B.scores[y].total - B.scores[x].total);
  const top1Agree = rA[0] === rB[0];
  const wouldBuildAgree = A.qualitative.wouldBuild === B.qualitative.wouldBuild;

  report.briefs[brief] = {
    ranking: ranked.map(([a, v]) => ({
      arm: a,
      totalAvg: v.totalAvg,
      totalA: v.totalA,
      totalB: v.totalB,
      label: v.label,
    })),
    sitesmith: cand.sitesmith,
    bestUpstream: { arm: bestUp[0], totalAvg: bestUpScore },
    outcome,
    qualitativeA: unb(A.qualitative),
    qualitativeB: unb(B.qualitative),
    top1Agree,
    wouldBuildAgree,
    comments: Object.fromEntries(
      Object.entries(cand).map(([arm, v]) => [arm, v.comments]),
    ),
  };
  report.sitesmithBriefOutcomes[brief] = outcome;
  report.agreement[brief] = { top1Agree, wouldBuildAgree };
}

const matchOrWin = Object.values(report.sitesmithBriefOutcomes)
  .filter((o) => o === 'win' || o === 'match' || o === 'tie-first').length;
const disagree = Object.values(report.agreement).filter((a) => !a.top1Agree).length;

if (matchOrWin >= 2) {
  report.verdict = 'DIRECTION COMPARISON PASSED — BUILD PROOF REQUIRED';
  report.proofStatus = 'DIRECTION COMPARISON PASSED — BUILD PROOF REQUIRED';
} else if (sitesmithLosses >= 2 && matchOrWin === 0 && disagree === 0) {
  report.verdict = 'PROOF FAILED — UPSTREAM SUPERSET';
  report.proofStatus = 'PROOF FAILED — UPSTREAM SUPERSET';
} else {
  report.verdict = 'PROOF FAILED — DIRECTION QUALITY';
  report.proofStatus = 'PROOF FAILED — DIRECTION QUALITY';
}

report.summary = {
  sitesmithWins,
  sitesmithTiesOrMatch: sitesmithTies,
  sitesmithLosses,
  matchOrWinCount: matchOrWin,
  top1Disagreements: disagree,
};

mkdirSync(join(h2h, 'eval'), { recursive: true });
writeFileSync(join(h2h, 'eval/EVAL-REPORT.json'), `${JSON.stringify(report, null, 2)}\n`);

const lines = [
  '---',
  'title: Blind head-to-head evaluation report',
  'status: complete',
  'ai_generated: "(C)"',
  '---',
  '',
  '# Blind evaluation report',
  '',
  `**Verdict:** \`${report.verdict}\``,
  '',
  `SiteSmith match/win briefs: **${matchOrWin}/3**`,
  '',
  '## Per brief',
  '',
];

for (const brief of briefs) {
  const b = report.briefs[brief];
  lines.push(`### ${brief} — **${b.outcome}**`, '');
  lines.push('| Rank | Arm | Avg total | A | B |');
  lines.push('| --- | --- | --- | --- | --- |');
  b.ranking.forEach((row, i) => {
    lines.push(`| ${i + 1} | \`${row.arm}\` | ${row.totalAvg.toFixed(1)} | ${row.totalA} | ${row.totalB} |`);
  });
  lines.push('');
  lines.push(`- Best upstream: \`${b.bestUpstream.arm}\` (${b.bestUpstream.totalAvg.toFixed(1)})`);
  lines.push(`- SiteSmith avg: ${b.sitesmith.totalAvg.toFixed(1)}`);
  lines.push(`- Evaluator top-1 agree: ${b.top1Agree}`);
  lines.push(`- wouldBuild A→\`${b.qualitativeA.wouldBuild}\` B→\`${b.qualitativeB.wouldBuild}\``);
  lines.push('');
}

lines.push(
  '## Advancement rule',
  '',
  'SiteSmith needs match/win on ≥2/3 briefs vs best upstream.',
  `Result: **${matchOrWin}/3** → \`${report.verdict}\``,
  '',
  '## Not done',
  '',
  '- Replication round (optional unless required by mixed protocol)',
  '- Three v2.3 builds',
  '- Showcase (still 0/8)',
  '',
);
writeFileSync(join(h2h, 'eval/EVAL-REPORT.md'), `${lines.join('\n')}\n`);

const statePath = join(h2h, 'WORKFLOW-STATE.json');
const state = JSON.parse(readFileSync(statePath, 'utf8'));
state.previousState = state.state;
state.state = 'S7_SCREENING_DECISION';
state.proofStatus = report.proofStatus;
state.gates = state.gates || {};
state.gates.evaluators = 'complete';
state.gates.blind_eval = 'complete';
state.evalVerdict = report.verdict;
state.sitesmithBriefOutcomes = report.sitesmithBriefOutcomes;
state.lastTransitionReason = `Blind eval complete: ${report.verdict}`;
state.lastVerifiedAt = new Date().toISOString();
state.allowedNextStates = matchOrWin >= 2
  ? ['S10_BUILD_PROOF', 'S8_REPLICATION_OPTIONAL']
  : ['STOP_PROOF_FAILED', 'S8_REPLICATION_OPTIONAL'];
writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
appendFileSync(
  join(h2h, 'STATE-HISTORY.jsonl'),
  `${JSON.stringify({ at: state.lastVerifiedAt, state: state.state, verdict: report.verdict })}\n`,
);

// Also update PROOF-VERDICT if present
const pv = join(h2h, '../proof/PROOF-VERDICT.md');
try {
  // leave main proof verdict path
} catch { /* */ }

console.log(JSON.stringify({
  verdict: report.verdict,
  summary: report.summary,
  outcomes: report.sitesmithBriefOutcomes,
}, null, 2));
