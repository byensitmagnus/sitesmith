/** Evidence-aware capability router for Direction Engine v3 slice. Original work, MIT. */

import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');

const PHASE = {
  creative: 'creative-direction',
  knowledge: 'knowledge',
  critique: 'critique',
  seed: 'seed',
  excluded: 'excluded',
};

const ALWAYS_EXCLUDE = new Set([
  'TASTE-CAP-013',
  'TASTE-CAP-019',
  'uupm.bundle.sibling-skills',
  'IMP-015',
]);

/** Base mode sets — then project signals add/remove. */
const MODE_BASE = {
  marketing: {
    required: [
      'TASTE-CAP-002', 'TASTE-CAP-003', 'TASTE-CAP-004', 'TASTE-CAP-005',
      'frontend.subject-vernacular', 'frontend.hero-thesis', 'frontend.type-as-identity',
      'frontend.anti-default-calibration', 'frontend.compact-plan-signature',
      'uupm.tune.design-dials', 'IMP-004', 'IMP-005', 'IMP-008',
    ],
    optional: ['TASTE-CAP-007', 'frontend.motion-intent', 'IMP-006', 'IMP-010'],
  },
  ecommerce: {
    required: [
      'TASTE-CAP-002', 'TASTE-CAP-003', 'TASTE-CAP-004', 'TASTE-CAP-006',
      'frontend.subject-vernacular', 'frontend.hero-thesis', 'frontend.semantic-structure',
      'frontend.interface-writing', 'frontend.anti-default-calibration',
      'uupm.classify.product-reasoning', 'uupm.tune.design-dials',
      'IMP-004', 'IMP-005', 'IMP-008',
    ],
    optional: ['uupm.lookup.stack-guidance', 'frontend.motion-intent', 'IMP-006', 'IMP-010'],
  },
  'product-ui': {
    required: [
      'TASTE-CAP-002', 'TASTE-CAP-003', 'TASTE-CAP-004',
      'frontend.subject-vernacular', 'frontend.semantic-structure', 'frontend.interface-writing',
      'frontend.restraint-quality-floor', 'frontend.anti-default-calibration',
      'uupm.tune.design-dials', 'IMP-004', 'IMP-005', 'IMP-008', 'IMP-010',
    ],
    optional: ['frontend.motion-intent', 'IMP-006', 'uupm.generate.design-system'],
  },
  portfolio: {
    required: [
      'TASTE-CAP-002', 'TASTE-CAP-003', 'TASTE-CAP-005',
      'frontend.subject-vernacular', 'frontend.hero-thesis', 'frontend.type-as-identity',
      'frontend.restraint-quality-floor', 'IMP-004', 'IMP-005', 'IMP-008',
    ],
    optional: ['TASTE-CAP-006', 'frontend.semantic-structure', 'IMP-006'],
  },
  editorial: {
    required: [
      'TASTE-CAP-002', 'TASTE-CAP-003', 'frontend.subject-vernacular', 'frontend.hero-thesis',
      'frontend.type-as-identity', 'frontend.semantic-structure', 'IMP-004', 'IMP-005', 'IMP-008',
    ],
    optional: ['TASTE-CAP-005', 'frontend.motion-intent'],
  },
  redesign: {
    required: [
      'TASTE-CAP-002', 'TASTE-CAP-003', 'TASTE-CAP-008',
      'frontend.subject-vernacular', 'frontend.anti-default-calibration', 'frontend.hero-thesis',
      'IMP-004', 'IMP-005', 'IMP-008', 'IMP-011',
    ],
    optional: ['TASTE-CAP-005', 'frontend.type-as-identity'],
  },
  component: {
    required: [
      'frontend.semantic-structure', 'frontend.interface-writing', 'frontend.restraint-quality-floor',
      'IMP-004', 'IMP-008', 'IMP-010',
    ],
    optional: ['TASTE-CAP-003', 'frontend.motion-intent'],
  },
  audit: {
    required: [
      'frontend.anti-default-calibration', 'frontend.restraint-quality-floor',
      'IMP-008', 'IMP-010', 'IMP-011',
    ],
    optional: ['TASTE-CAP-009', 'IMP-013'],
  },
};

const PHASE_FOR = {
  'TASTE-CAP-002': PHASE.creative, 'TASTE-CAP-003': PHASE.creative, 'TASTE-CAP-004': PHASE.creative,
  'TASTE-CAP-005': PHASE.creative, 'TASTE-CAP-006': PHASE.knowledge, 'TASTE-CAP-007': PHASE.creative,
  'TASTE-CAP-008': PHASE.critique, 'TASTE-CAP-009': PHASE.critique,
  'frontend.subject-vernacular': PHASE.creative, 'frontend.hero-thesis': PHASE.creative,
  'frontend.type-as-identity': PHASE.creative, 'frontend.semantic-structure': PHASE.creative,
  'frontend.motion-intent': PHASE.creative, 'frontend.anti-default-calibration': PHASE.creative,
  'frontend.compact-plan-signature': PHASE.creative, 'frontend.restraint-quality-floor': PHASE.critique,
  'frontend.interface-writing': PHASE.creative,
  'uupm.classify.product-reasoning': PHASE.knowledge, 'uupm.generate.design-system': PHASE.knowledge,
  'uupm.tune.design-dials': PHASE.creative, 'uupm.lookup.domain-knowledge': PHASE.knowledge,
  'uupm.lookup.stack-guidance': PHASE.knowledge, 'uupm.optional.browser-stack': PHASE.critique,
  'IMP-004': PHASE.seed, 'IMP-005': PHASE.seed, 'IMP-006': PHASE.seed,
  'IMP-008': PHASE.critique, 'IMP-010': PHASE.critique, 'IMP-011': PHASE.critique, 'IMP-013': PHASE.critique,
};

const TOKEN_COST = {
  creative: 400, knowledge: 500, critique: 300, seed: 200, excluded: 0,
};

export function loadLedger(ledgerPath = join(root, 'docs', 'v3', 'UPSTREAM-CAPABILITY-LEDGER.json')) {
  return JSON.parse(readFileSync(ledgerPath, 'utf8'));
}

export function upstreamOrigin(capabilityId, ledger) {
  const row = ledger.capabilities?.find((c) => c.capabilityId === capabilityId);
  if (!row) return { repository: 'unknown', commit: null };
  return { repository: row.sourceRepository ?? 'unknown', commit: row.sourceCommit ?? null };
}

/**
 * Optional local UUPM-style retrieval. Never claims consulted unless data exists and query ran.
 */
export function runDomainRetrieval(input) {
  const dataDir = join(root, 'skills', 'sitesmith', 'data');
  const csvCandidates = [
    join(dataDir, 'products.csv'),
    join(dataDir, 'ui-reasoning.csv'),
    join(dataDir, 'styles.csv'),
  ];
  const csvPath = csvCandidates.find((p) => existsSync(p));
  if (!csvPath) {
    return {
      consulted: false,
      reason: 'no local UUPM dataset found under skills/sitesmith/data',
      hits: [],
    };
  }
  const query = [
    input.signals?.subject,
    input.signals?.audience,
    input.mode,
    input.signals?.primaryAction,
  ].filter(Boolean).join(' ').toLowerCase();
  const tokens = query.match(/[a-z0-9æøå-]{3,}/g) ?? [];
  const text = readFileSync(csvPath, 'utf8');
  const lines = text.split(/\r?\n/).filter(Boolean).slice(0, 400);
  const hits = [];
  for (const line of lines) {
    const low = line.toLowerCase();
    let score = 0;
    for (const t of tokens) {
      if (low.includes(t)) score += 1;
    }
    if (score >= 2) hits.push({ line: line.slice(0, 160), score });
  }
  hits.sort((a, b) => b.score - a.score);
  const top = hits.slice(0, 5);
  return {
    consulted: true,
    reason: `BM25-lite keyword scan of ${csvPath.replace(root, '')}`,
    query,
    hits: top,
    datasetPath: csvPath,
  };
}

export function routeCapabilities(input, policy = {}, ledger = loadLedger()) {
  const mode = input.mode;
  const base = MODE_BASE[mode];
  if (!base) return { ok: false, problems: [`no route table for mode ${mode}`] };

  const max = policy.maxCapabilitiesLoaded ?? 18;
  const ablation = input.ablation ?? null;
  const signals = input.signals ?? input.subjectHints ?? {};
  const allIds = ledger.capabilities.map((c) => c.capabilityId);

  let selectedIds = [...base.required];
  const addReasons = new Map();

  const add = (id, reason, pointer, status = 'inferred') => {
    if (ALWAYS_EXCLUDE.has(id)) return;
    if (!selectedIds.includes(id) && selectedIds.length < max) {
      selectedIds.push(id);
      addReasons.set(id, { reason, pointer, status });
    } else if (selectedIds.includes(id) && !addReasons.has(id)) {
      addReasons.set(id, { reason, pointer, status });
    }
  };

  for (const id of base.required) {
    add(id, `mode ${mode} base required`, `mode:${mode}`, 'explicit');
  }
  for (const id of base.optional) {
    add(id, `mode ${mode} base optional`, `mode:${mode}`, 'inferred');
  }

  // Project signals
  if (signals.commerce || mode === 'ecommerce') {
    add('TASTE-CAP-006', 'commerce/product evidence present', 'evidence:products', 'inferred');
    add('uupm.classify.product-reasoning', 'product classification needed for commerce', 'evidence:products', 'inferred');
  }
  if (signals.operational || mode === 'product-ui') {
    add('frontend.interface-writing', 'operational UI needs action vocabulary', 'brief:job', 'inferred');
    add('frontend.semantic-structure', 'console/form structure from evidence', 'evidence:states', 'inferred');
    add('IMP-010', 'craft/harden loop for UI states', 'evidence:states', 'inferred');
  }
  if (signals.editorial || mode === 'portfolio' || mode === 'marketing') {
    add('frontend.hero-thesis', 'editorial/marketing needs subject-true opening', 'brief:subject', 'inferred');
    add('frontend.type-as-identity', 'characterful surface needs type identity', 'brief:mode', 'inferred');
  }
  if (signals.antiRefs?.length) {
    add('frontend.anti-default-calibration', 'anti-references present in evidence', 'evidence:anti-references', 'explicit');
    add('TASTE-CAP-005', 'anti-default discipline from anti-refs', 'evidence:anti-references', 'explicit');
  }
  if (signals.hasBrand) {
    add('TASTE-CAP-003', 'brand pack present', 'BRAND.md', 'explicit');
  }
  if (signals.hasAssetPlan || signals.hasManifest) {
    add('TASTE-CAP-006', 'asset plan/manifest present', 'ASSET-PLAN/MANIFEST', 'explicit');
  }
  if (signals.imageless) {
    // drop imagery-heavy generation pressure
    selectedIds = selectedIds.filter((id) => id !== 'TASTE-CAP-012');
  }
  // Stack-dependent only when relevant (force slot if budget full)
  if (input.stack && input.stack !== 'html' && (mode === 'product-ui' || mode === 'component')) {
    if (!selectedIds.includes('uupm.lookup.stack-guidance')) {
      if (selectedIds.length >= max) selectedIds.pop();
      selectedIds.push('uupm.lookup.stack-guidance');
      addReasons.set('uupm.lookup.stack-guidance', {
        reason: `stack-specific guidance for ${input.stack}`,
        pointer: `stack:${input.stack}`,
        status: 'explicit',
      });
    }
  }
  // Constraints: keep truth/discipline caps
  if (signals.constraints?.length) {
    add('TASTE-CAP-004', 'user constraints require brief discipline', 'CONSTRAINTS', 'explicit');
  }

  // Domain knowledge: only include if retrieval can run
  const retrieval = runDomainRetrieval(input);
  if (retrieval.consulted && retrieval.hits.length) {
    add('uupm.lookup.domain-knowledge', 'local UUPM dataset returned hits', retrieval.datasetPath, 'explicit');
  } else {
    selectedIds = selectedIds.filter((id) => id !== 'uupm.lookup.domain-knowledge');
  }

  selectedIds = selectedIds.filter((id) => !ALWAYS_EXCLUDE.has(id));

  if (ablation && ablation !== 'all' && ablation !== 'none') {
    selectedIds = selectedIds.filter((id) => !belongsToGroup(id, ablation));
  }
  if (ablation === 'all') {
    selectedIds = allIds.filter((id) => !ALWAYS_EXCLUDE.has(id));
  }

  if (selectedIds.length > max && ablation !== 'all') {
    selectedIds = selectedIds.slice(0, max);
  }

  if (ablation !== 'all' && selectedIds.length === allIds.length) {
    return { ok: false, problems: ['router refused to load all capabilities as the default set'] };
  }

  const selected = selectedIds.map((capabilityId) => {
    const origin = upstreamOrigin(capabilityId, ledger);
    const phase = PHASE_FOR[capabilityId] ?? PHASE.knowledge;
    const meta = addReasons.get(capabilityId) ?? {
      reason: `carried for mode ${mode}`,
      pointer: `mode:${mode}`,
      status: 'inferred',
    };
    return {
      capabilityId,
      upstreamOrigin: origin.repository,
      upstreamCommit: origin.commit,
      whyRelevant: projectWhy(capabilityId, input, meta.reason),
      evidencePointers: [meta.pointer].filter(Boolean),
      status: meta.status,
      phase,
      contextCostTokens: TOKEN_COST[phase] ?? 300,
      providerFallback: 'use local deterministic sketch if provider lacks this capability packet',
    };
  });

  const notLoaded = allIds
    .filter((id) => !selectedIds.includes(id))
    .map((capabilityId) => ({
      capabilityId,
      reason: ALWAYS_EXCLUDE.has(capabilityId)
        ? 'deliberate ledger reject / exclusion-only'
        : 'not selected by mode+signals/budget',
    }));

  const totalCost = selected.reduce((sum, row) => sum + row.contextCostTokens, 0);
  const decisionHash = createHash('sha256')
    .update(JSON.stringify({
      mode,
      stack: input.stack ?? null,
      policyVersion: policy.policyVersion ?? null,
      max,
      ablation,
      selectedIds,
      signals: {
        subject: signals.subject,
        audience: signals.audience,
        primaryAction: signals.primaryAction,
        antiRefs: signals.antiRefs,
        imageless: signals.imageless,
        commerce: signals.commerce,
        operational: signals.operational,
      },
      retrievalConsulted: retrieval.consulted,
      retrievalHitCount: retrieval.hits?.length ?? 0,
    }))
    .digest('hex');

  return {
    ok: true,
    mode,
    ablation: ablation ?? 'none',
    selectedCount: selected.length,
    totalAvailable: allIds.length,
    totalContextCostTokens: totalCost,
    decisionHash,
    selected,
    notLoaded,
    loadedAll59: selected.length >= 59,
    domainRetrieval: {
      consulted: retrieval.consulted,
      reason: retrieval.reason,
      hitCount: retrieval.hits?.length ?? 0,
      // do not claim more than we did
      claimAllowed: retrieval.consulted && (retrieval.hits?.length ?? 0) > 0,
    },
  };
}

function projectWhy(id, input, baseReason) {
  const s = input.signals ?? input.subjectHints ?? {};
  return `${baseReason} · subject=${s.subject ?? 'unknown'} · action=${s.primaryAction ?? 'unknown'}`;
}

function belongsToGroup(id, group) {
  if (group === 'taste') return id.startsWith('TASTE-');
  if (group === 'uupm') return id.startsWith('uupm.');
  if (group === 'frontend') return id.startsWith('frontend.');
  if (group === 'impeccable') return id.startsWith('IMP-');
  return false;
}
