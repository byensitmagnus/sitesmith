#!/usr/bin/env node
/**
 * Execute mechanical screening arms: sitesmith | ui-ux-pro-max
 * Usage: node tools/run-h2h-screen-arm.mjs <briefId> <arm> [--force]
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync, readdirSync, statSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runDirectionEngine } from '../skills/sitesmith/scripts/direction-engine/index.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const h2h = join(root, 'docs/v3/proof/head-to-head');
const sources = JSON.parse(readFileSync(join(h2h, 'CANONICAL-SOURCES.json'), 'utf8'));
const schema = JSON.parse(readFileSync(join(h2h, 'OUTPUT-SCHEMA.json'), 'utf8'));

const briefId = process.argv[2];
const arm = process.argv[3];
const force = process.argv.includes('--force');

if (!briefId || !arm) {
  console.error('Usage: node tools/run-h2h-screen-arm.mjs <briefId> <arm>');
  process.exit(2);
}

const runId = `screen-${briefId}-${arm}`;
const outDir = join(h2h, 'runs/screening', briefId, arm);
const packDir = join(h2h, 'briefs', briefId);

function writeJson(p, obj) {
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, `${JSON.stringify(obj, null, 2)}\n`, 'utf8');
}
function writeText(p, s) {
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, String(s).replace(/\r\n/g, '\n'), 'utf8');
}
function appendLedger(row) {
  appendFileSync(join(h2h, 'RUN-LEDGER.jsonl'), `${JSON.stringify(row)}\n`, 'utf8');
}
function loadPack() {
  const read = (n) => readFileSync(join(packDir, n), 'utf8');
  return {
    brief: read('BRIEF.md'),
    evidence: read('EVIDENCE.md'),
    brand: read('BRAND.md'),
    assetPlan: read('ASSET-PLAN.md'),
    assetManifest: read('ASSET-MANIFEST.md'),
    constraints: read('CONSTRAINTS.md'),
    ctx: JSON.parse(read('RUN-CONTEXT.json')),
  };
}
function emptyPacket() {
  const p = {};
  for (const f of schema.requiredFields) p[f] = 'unknown';
  return p;
}
function findSearchPy() {
  const walk = (d, depth = 0) => {
    if (depth > 8) return null;
    let ents;
    try { ents = readdirSync(d); } catch { return null; }
    if (ents.includes('search.py')) return join(d, 'search.py');
    for (const e of ents) {
      if (e.startsWith('.') || e === 'node_modules') continue;
      const p = join(d, e);
      try {
        if (statSync(p).isDirectory()) {
          const hit = walk(p, depth + 1);
          if (hit) return hit;
        }
      } catch { /* */ }
    }
    return null;
  };
  return walk(join(root, 'skills/sitesmith')) || walk(join(root, 'src'));
}

if (existsSync(join(outDir, 'DIRECTION-PACKET.json')) && existsSync(join(outDir, 'RUN-META.json')) && !force) {
  console.log(JSON.stringify({ ok: true, skipped: true, runId }));
  process.exit(0);
}

const startedAt = new Date().toISOString();
const pack = loadPack();
const armCommit = sources.arms[arm]?.commit ?? null;
let native = null;
let packet = emptyPacket();
let modelCalls = 0;
let method = '';

if (arm === 'sitesmith') {
  method = 'direction-engine-v3-slice';
  modelCalls = 0;
  const input = {
    brief: pack.brief,
    evidence: pack.evidence,
    brand: pack.brand,
    assetPlan: pack.assetPlan,
    assetManifest: pack.assetManifest,
    userConstraints: pack.constraints,
    mode: pack.ctx.mode,
    stack: pack.ctx.stack,
    projectName: pack.ctx.projectName,
    randomSeed: pack.ctx.randomSeed,
  };
  let result = runDirectionEngine({
    input,
    userChoiceBlindId: 'L1',
    randomSeed: pack.ctx.randomSeed,
    engineCommit: sources.arms.sitesmith.commit,
  });
  if (!result.ok || result.stage !== 'handoff-ready') {
    const pick = result.blinding?.blinded?.[0]?.blindId ?? 'L1';
    result = runDirectionEngine({
      input,
      userChoiceBlindId: pick,
      randomSeed: pack.ctx.randomSeed,
      engineCommit: sources.arms.sitesmith.commit,
    });
  }
  if (!result.ok) {
    writeJson(join(outDir, 'RUN-META.json'), {
      runId, briefId, arm, status: 'failed', problems: result.problems, startedAt,
      finishedAt: new Date().toISOString(), modelCalls, method, armCommit,
    });
    appendLedger({ type: 'run-failed', runId, briefId, arm, at: new Date().toISOString(), problems: result.problems });
    console.error(JSON.stringify({ ok: false, runId, problems: result.problems }));
    process.exit(1);
  }
  const card = result.direction?.cards?.find((c) => c.internalId === result.choice?.selectedInternalId)
    ?? result.direction?.cards?.[0];
  const spec = result.designSpec ?? {};
  native = {
    kind: 'sitesmith-direction-engine',
    stage: result.stage,
    routeSelected: result.route?.selected?.map((s) => s.capabilityId),
    choice: result.choice,
    directionMd: result.handoff?.directionMd ?? null,
    designSpec: spec,
    selectedCard: card,
    proofMeta: result.proofMeta,
  };
  const g = card?.grounding ?? {};
  packet = {
    designThesis: card?.thesis ?? 'unknown',
    subjectGrounding: [
      g.subject && `Subject: ${g.subject}`,
      g.audience && `Audience: ${g.audience}`,
      g.primaryAction && `Action: ${g.primaryAction}`,
      (g.products ?? []).length && `Products: ${g.products.join(', ')}`,
      (g.materials ?? []).length && `Materials: ${g.materials.join(', ')}`,
      (g.brandPalette ?? []).length && `Palette: ${g.brandPalette.join(', ')}`,
      (g.antiRefs ?? []).length && `Anti-refs: ${g.antiRefs.join('; ')}`,
      card?.evidence && `Evidence: ${String(card.evidence).slice(0, 280)}`,
    ].filter(Boolean).join(' · ') || 'unknown',
    composition: card?.composition ?? 'unknown',
    informationHierarchy: card?.layoutPrinciple ?? card?.designIntent ?? 'unknown',
    typography: card?.type ?? card?.typographicPrinciple ?? 'unknown',
    colourAndMaterialModel: [
      card?.colour,
      (g.materials ?? []).length && `materials ${g.materials.join(', ')}`,
    ].filter(Boolean).join(' · ') || 'unknown',
    imageryAndAssetStrategy: card?.imagery ?? card?.assetStrategy ?? 'unknown',
    interactionConcept: card?.motionInteraction ?? card?.rhythm ?? 'unknown',
    signatureElement: card?.signatureElement ?? 'unknown',
    primaryRisk: card?.primaryRisk ?? 'unknown',
    implementationGuidance: result.handoff?.directionMd
      ? String(result.handoff.directionMd).slice(0, 2500)
      : 'unknown',
    unknowns: (result.inputWarnings ?? []).join('; ') || 'none declared',
    sourcePointers: {
      arm: 'sitesmith',
      commit: armCommit,
      enginePolicy: result.policyVersion,
      inputHash: result.proofMeta?.inputHash,
      selectedWorldId: card?.worldId,
      blindChoice: result.choice?.selectedBlindId,
    },
  };
  if (native.directionMd) writeText(join(outDir, 'NATIVE.md'), native.directionMd);
} else if (arm === 'ui-ux-pro-max') {
  method = 'uupm-search-py-design-system';
  modelCalls = 0;
  const subjectLine = pack.brief.split('\n').find((l) => l.startsWith('# '))?.replace(/^#\s*/, '') || briefId;
  const query = `${pack.ctx.modeLabel} ${subjectLine} ${pack.ctx.mode}`;
  const pyScript = findSearchPy();
  if (!pyScript) {
    console.error('search.py not found');
    process.exit(1);
  }
  let stdout = '';
  try {
    stdout = execFileSync('python', [pyScript, query, '--design-system'], {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 4 * 1024 * 1024,
      env: { ...process.env, PYTHONUTF8: '1' },
    });
  } catch (e) {
    stdout = `${e.stdout || ''}${e.stderr || e.message}`;
  }
  writeText(join(outDir, 'UUPM-RETRIEVAL.txt'), stdout);
  native = {
    kind: 'ui-ux-pro-max-search-design-system',
    query,
    searchScript: pyScript.replace(root, '').replace(/\\/g, '/'),
    commit: armCommit,
    note: 'Native generator output only; no extra model synthesis.',
    rawPreview: stdout.slice(0, 8000),
  };
  const style = stdout.match(/STYLE[\s\S]*?Name:\s*(.+)/i)?.[1]?.trim() || 'unknown';
  const pattern = stdout.match(/PATTERN[\s\S]*?Name:\s*(.+)/i)?.[1]?.trim() || 'unknown';
  const primary = stdout.match(/Primary:\s*([#][0-9A-Fa-f]{3,8})/)?.[1] || 'unknown';
  const secondary = stdout.match(/Secondary:\s*([#][0-9A-Fa-f]{3,8})/)?.[1] || 'unknown';
  const accent = stdout.match(/Accent\/CTA:\s*([#][0-9A-Fa-f]{3,8})/)?.[1] || 'unknown';
  const fonts = stdout.match(/TYPOGRAPHY[\s\S]*?\n\s*([^\n]+)/i)?.[1]?.trim() || 'unknown';
  const effects = stdout.match(/KEY EFFECTS[\s\S]*?\n\s*([^\n]+)/i)?.[1]?.trim() || 'unknown';
  const avoid = stdout.match(/AVOID[\s\S]*?\n\s*([^\n]+)/i)?.[1]?.trim() || 'unknown';
  const sections = stdout.match(/Sections:[\s\S]*?(?=├───|└|$)/i)?.[0]?.trim() || pattern;
  packet = {
    designThesis: `UUPM design-system recommendation: ${style} with ${pattern} pattern for ${subjectLine}`,
    subjectGrounding: `Query from frozen pack only: ${query}`,
    composition: pattern,
    informationHierarchy: sections,
    typography: fonts,
    colourAndMaterialModel: `primary ${primary}; secondary ${secondary}; accent ${accent}`,
    imageryAndAssetStrategy: 'unknown — design-system search path does not emit asset plan; obey pack ASSET-PLAN/CONSTRAINTS',
    interactionConcept: effects,
    signatureElement: style,
    primaryRisk: avoid,
    implementationGuidance: 'Implement from UUPM-RETRIEVAL.txt rows and checklist; do not invent beyond retrieval.',
    unknowns: 'Page-level composition beyond pattern; photography/asset strategy; brand-specific material finishes',
    sourcePointers: {
      arm: 'ui-ux-pro-max',
      commit: armCommit,
      query,
      retrievalFile: 'UUPM-RETRIEVAL.txt',
      method,
    },
  };
  writeText(join(outDir, 'NATIVE.md'), `# UUPM native retrieval\n\nQuery: ${query}\n\n\`\`\`\n${stdout.slice(0, 12000)}\n\`\`\`\n`);
} else {
  console.error(`Arm ${arm} is LLM-only; use isolated agent writer`);
  process.exit(2);
}

for (const f of schema.requiredFields) {
  if (packet[f] == null || packet[f] === '') packet[f] = 'unknown';
}

writeJson(join(outDir, 'NATIVE.json'), native);
writeJson(join(outDir, 'DIRECTION-PACKET.json'), packet);
const finishedAt = new Date().toISOString();
const meta = {
  runId,
  briefId,
  arm,
  status: 'completed',
  startedAt,
  finishedAt,
  modelCalls,
  method,
  armCommit,
  contextPackHash: pack.ctx.contextPackHash,
  packetSha256: createHash('sha256').update(JSON.stringify(packet)).digest('hex'),
  phase: 'screening',
  isolation: 'fresh-process-no-peer-outputs',
  model: modelCalls === 0 ? 'none-mechanical' : 'host-llm',
};
writeJson(join(outDir, 'RUN-META.json'), meta);
appendLedger({
  type: 'run-completed',
  runId,
  briefId,
  arm,
  at: finishedAt,
  modelCalls,
  method,
  packetSha256: meta.packetSha256,
});
console.log(JSON.stringify({ ok: true, runId, modelCalls, method }, null, 2));
