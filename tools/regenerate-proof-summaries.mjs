#!/usr/bin/env node
/** Mechanically regenerate DIRECTION/ROUTING/ABLATION summaries from committed runs or live engine. */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runDirectionEngine } from '../skills/sitesmith/scripts/direction-engine/index.mjs';
import { loadLedger } from '../skills/sitesmith/scripts/direction-engine/router.mjs';
import { readFileSync as read } from 'node:fs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const proofDir = join(root, 'docs', 'v3', 'proof');
const briefsDir = join(proofDir, 'briefs');
const policy = JSON.parse(read(join(root, 'skills/sitesmith/scripts/direction-engine/policy.json'), 'utf8'));

function engineCommit() {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function loadBriefInput(id) {
  const dir = join(briefsDir, id);
  const meta = JSON.parse(read(join(dir, 'engine-input.json'), 'utf8'));
  const readMd = (n) => (existsSync(join(dir, n)) ? read(join(dir, n), 'utf8') : '');
  return {
    brief: readMd('BRIEF.md'),
    evidence: readMd('EVIDENCE.md'),
    brand: readMd('BRAND.md'),
    assetPlan: readMd('ASSET-PLAN.md'),
    assetManifest: readMd('ASSET-MANIFEST.md'),
    mode: meta.mode,
    stack: meta.stack,
    projectName: meta.projectName ?? id,
    randomSeed: meta.randomSeed ?? null,
  };
}

const commit = engineCommit();
const briefs = readdirSync(briefsDir).filter((d) => existsSync(join(briefsDir, d, 'engine-input.json')));
const ledger = loadLedger();

const routing = { generatedAt: new Date().toISOString().slice(0, 10), engineCommit: commit, results: [] };
const direction = { generatedAt: new Date().toISOString().slice(0, 10), engineCommit: commit, results: [] };
const ablation = {
  generatedAt: new Date().toISOString().slice(0, 10),
  engineCommit: commit,
  brief: '01-leather-goods',
  arms: [],
};

for (const id of briefs) {
  const input = loadBriefInput(id);
  const outDir = join(proofDir, 'runs', id);
  mkdirSync(outDir, { recursive: true });
  const run = runDirectionEngine({
    input,
    userChoiceBlindId: 'L1',
    randomSeed: input.randomSeed,
    engineCommit: commit,
  });
  // If L1 invalid after shuffle, pick first blind
  let final = run;
  if (!run.ok || run.stage !== 'handoff-ready') {
    const pick = run.blinding?.blinded?.[0]?.blindId ?? 'L1';
    final = runDirectionEngine({
      input,
      userChoiceBlindId: pick,
      randomSeed: input.randomSeed,
      engineCommit: commit,
    });
  }
  writeFileSync(join(outDir, 'engine-result.json'), JSON.stringify(final, null, 2));
  if (final.designSpec) writeFileSync(join(outDir, 'DESIGNSPEC.json'), JSON.stringify(final.designSpec, null, 2));
  if (final.handoff) {
    writeFileSync(join(outDir, 'HANDOFF.json'), JSON.stringify(final.handoff, null, 2));
    if (final.handoff.directionMd) writeFileSync(join(outDir, 'DIRECTION.md'), final.handoff.directionMd);
  }

  routing.results.push({
    brief: id,
    mode: input.mode,
    selectedCount: final.route.selectedCount,
    totalAvailable: final.route.totalAvailable,
    decisionHash: final.route.decisionHash,
    loadedAll59: final.route.loadedAll59,
    selected: final.route.selected.map((s) => s.capabilityId),
    notLoadedCount: final.route.notLoaded.length,
    contextCost: final.route.totalContextCostTokens,
    domainRetrieval: final.route.domainRetrieval,
    inputHash: final.proofMeta?.inputHash,
    policyVersion: final.proofMeta?.policyVersion,
    randomSeed: final.proofMeta?.randomSeed,
  });

  direction.results.push({
    brief: id,
    ok: final.ok,
    stage: final.stage,
    worlds: final.direction?.worlds,
    cards: final.direction?.cards?.map((c) => ({
      worldId: c.worldId,
      thesis: c.thesis,
      composition: c.composition,
      surface: c.surface,
      labels: c.labels,
      figures: c.figures,
      depth: c.depth,
      signature: c.signatureElement,
    })),
    pairwise: final.direction?.pairwise,
    pairwisePass: final.direction?.pairwise?.every((p) => p.pass) ?? false,
    critic: {
      role: final.critic?.role,
      independence: final.critic?.independence,
      rejectAll: final.critic?.rejectAll,
      tie: final.critic?.tie,
    },
    handoffReady: final.stage === 'handoff-ready',
    proofMeta: final.proofMeta,
  });
}

const arms = [null, 'taste', 'uupm', 'frontend', 'impeccable', 'all'];
const leather = loadBriefInput('01-leather-goods');
for (const a of arms) {
  const run = runDirectionEngine({
    input: { ...leather, ablation: a },
    userChoiceBlindId: 'L1',
    randomSeed: 'ablation-leather',
    ablation: a,
    engineCommit: commit,
  });
  let final = run;
  if (run.ok && run.stage !== 'handoff-ready' && run.blinding?.blinded?.[0]) {
    final = runDirectionEngine({
      input: { ...leather, ablation: a },
      userChoiceBlindId: run.blinding.blinded[0].blindId,
      randomSeed: 'ablation-leather',
      ablation: a,
      engineCommit: commit,
    });
  }
  ablation.arms.push({
    ablation: a ?? 'full',
    ok: final.ok,
    selectedCount: final.route?.selectedCount,
    decisionHash: final.route?.decisionHash,
    cards: final.direction?.cards?.map((c) => ({
      id: c.worldId,
      labels: c.labels,
      depth: c.depth,
      thesis: String(c.thesis).slice(0, 80),
      semantic: c.semanticGroupEffects,
    })) ?? null,
    pairwisePass: final.direction?.pairwise?.every((p) => p.pass) ?? false,
    domainRetrieval: final.route?.domainRetrieval,
    problems: final.problems ?? null,
    // semantic note: only claim difference when group effects or treatments differ
  });
}

writeFileSync(join(proofDir, 'ROUTING-RESULTS.json'), JSON.stringify(routing, null, 2));
writeFileSync(join(proofDir, 'DIRECTION-RESULTS.json'), JSON.stringify(direction, null, 2));
writeFileSync(join(proofDir, 'ABLATION-RESULTS.json'), JSON.stringify(ablation, null, 2));
console.log(JSON.stringify({
  ok: true,
  briefs: briefs.length,
  engineCommit: commit,
  directionPass: direction.results.every((r) => r.pairwisePass),
}, null, 2));
