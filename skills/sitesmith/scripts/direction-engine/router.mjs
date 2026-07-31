/** Capability router for Direction Engine v3 slice. Original work, MIT. */

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');

/** Capabilities useful for direction generation only (not install/provider plumbing). */
const PHASE = {
  creative: 'creative-direction',
  knowledge: 'knowledge',
  critique: 'critique',
  seed: 'seed',
  excluded: 'excluded',
};

/** Deliberate ledger rejects — never load as strengths. */
const ALWAYS_EXCLUDE = new Set([
  'TASTE-CAP-013',
  'TASTE-CAP-019',
  'uupm.bundle.sibling-skills',
  'IMP-015',
]);

/**
 * Mode → preferred capability IDs (subsets of 59). Routing is deterministic given mode+policyVersion.
 * Full 59 must never be the default load set.
 */
const MODE_ROUTES = {
  marketing: {
    required: [
      'TASTE-CAP-002', 'TASTE-CAP-003', 'TASTE-CAP-004', 'TASTE-CAP-005',
      'frontend.subject-vernacular', 'frontend.hero-thesis', 'frontend.type-as-identity',
      'frontend.anti-default-calibration', 'frontend.compact-plan-signature',
      'uupm.lookup.domain-knowledge', 'uupm.tune.design-dials',
      'IMP-004', 'IMP-005', 'IMP-006', 'IMP-008',
    ],
    optional: ['TASTE-CAP-007', 'frontend.motion-intent', 'uupm.generate.design-system', 'IMP-010'],
  },
  portfolio: {
    required: [
      'TASTE-CAP-002', 'TASTE-CAP-003', 'TASTE-CAP-005',
      'frontend.subject-vernacular', 'frontend.hero-thesis', 'frontend.type-as-identity',
      'frontend.restraint-quality-floor', 'frontend.interface-writing',
      'uupm.lookup.domain-knowledge', 'IMP-004', 'IMP-005', 'IMP-008',
    ],
    optional: ['TASTE-CAP-006', 'frontend.semantic-structure', 'IMP-006'],
  },
  editorial: {
    required: [
      'TASTE-CAP-002', 'TASTE-CAP-003', 'frontend.subject-vernacular', 'frontend.hero-thesis',
      'frontend.type-as-identity', 'frontend.semantic-structure', 'frontend.restraint-quality-floor',
      'uupm.lookup.domain-knowledge', 'IMP-004', 'IMP-005', 'IMP-008',
    ],
    optional: ['TASTE-CAP-005', 'frontend.motion-intent'],
  },
  ecommerce: {
    required: [
      'TASTE-CAP-002', 'TASTE-CAP-003', 'TASTE-CAP-004', 'TASTE-CAP-006',
      'frontend.subject-vernacular', 'frontend.hero-thesis', 'frontend.semantic-structure',
      'frontend.interface-writing', 'frontend.anti-default-calibration',
      'uupm.classify.product-reasoning', 'uupm.lookup.domain-knowledge', 'uupm.tune.design-dials',
      'IMP-004', 'IMP-005', 'IMP-006', 'IMP-008',
    ],
    optional: ['uupm.lookup.stack-guidance', 'frontend.motion-intent', 'IMP-010'],
  },
  'product-ui': {
    required: [
      'TASTE-CAP-002', 'TASTE-CAP-003', 'TASTE-CAP-004',
      'frontend.subject-vernacular', 'frontend.semantic-structure', 'frontend.interface-writing',
      'frontend.restraint-quality-floor', 'frontend.anti-default-calibration',
      'uupm.lookup.stack-guidance', 'uupm.tune.design-dials', 'uupm.lookup.domain-knowledge',
      'IMP-004', 'IMP-005', 'IMP-008', 'IMP-010',
    ],
    optional: ['frontend.motion-intent', 'IMP-006', 'uupm.generate.design-system'],
  },
  redesign: {
    required: [
      'TASTE-CAP-002', 'TASTE-CAP-003', 'TASTE-CAP-008',
      'frontend.subject-vernacular', 'frontend.anti-default-calibration', 'frontend.hero-thesis',
      'uupm.lookup.domain-knowledge', 'IMP-004', 'IMP-005', 'IMP-008', 'IMP-011',
    ],
    optional: ['TASTE-CAP-005', 'frontend.type-as-identity', 'IMP-006'],
  },
  component: {
    required: [
      'frontend.semantic-structure', 'frontend.interface-writing', 'frontend.restraint-quality-floor',
      'uupm.lookup.stack-guidance', 'IMP-004', 'IMP-008', 'IMP-010',
    ],
    optional: ['TASTE-CAP-003', 'frontend.motion-intent'],
  },
  audit: {
    required: [
      'frontend.anti-default-calibration', 'frontend.restraint-quality-floor',
      'IMP-008', 'IMP-010', 'IMP-011', 'uupm.optional.browser-stack',
    ],
    optional: ['TASTE-CAP-009', 'IMP-013'],
  },
};

const PHASE_FOR = {
  'TASTE-CAP-002': PHASE.creative,
  'TASTE-CAP-003': PHASE.creative,
  'TASTE-CAP-004': PHASE.creative,
  'TASTE-CAP-005': PHASE.creative,
  'TASTE-CAP-006': PHASE.knowledge,
  'TASTE-CAP-007': PHASE.creative,
  'TASTE-CAP-008': PHASE.critique,
  'TASTE-CAP-009': PHASE.critique,
  'frontend.subject-vernacular': PHASE.creative,
  'frontend.hero-thesis': PHASE.creative,
  'frontend.type-as-identity': PHASE.creative,
  'frontend.semantic-structure': PHASE.creative,
  'frontend.motion-intent': PHASE.creative,
  'frontend.anti-default-calibration': PHASE.creative,
  'frontend.compact-plan-signature': PHASE.creative,
  'frontend.restraint-quality-floor': PHASE.critique,
  'frontend.interface-writing': PHASE.creative,
  'uupm.classify.product-reasoning': PHASE.knowledge,
  'uupm.generate.design-system': PHASE.knowledge,
  'uupm.tune.design-dials': PHASE.creative,
  'uupm.lookup.domain-knowledge': PHASE.knowledge,
  'uupm.lookup.stack-guidance': PHASE.knowledge,
  'uupm.optional.browser-stack': PHASE.critique,
  'IMP-004': PHASE.seed,
  'IMP-005': PHASE.seed,
  'IMP-006': PHASE.seed,
  'IMP-008': PHASE.critique,
  'IMP-010': PHASE.critique,
  'IMP-011': PHASE.critique,
  'IMP-013': PHASE.critique,
};

const TOKEN_COST = {
  creative: 400,
  knowledge: 500,
  critique: 300,
  seed: 200,
  excluded: 0,
};

export function loadLedger(ledgerPath = join(root, 'docs', 'v3', 'UPSTREAM-CAPABILITY-LEDGER.json')) {
  return JSON.parse(readFileSync(ledgerPath, 'utf8'));
}

export function upstreamOrigin(capabilityId, ledger) {
  const row = ledger.capabilities?.find((c) => c.capabilityId === capabilityId);
  if (!row) return { repository: 'unknown', commit: null };
  return {
    repository: row.sourceRepository ?? 'unknown',
    commit: row.sourceCommit ?? null,
  };
}

/**
 * @param {{ mode: string, stack?: string, ablation?: string|null }} input
 * @param {{ maxCapabilitiesLoaded?: number, policyVersion?: string }} policy
 */
export function routeCapabilities(input, policy = {}, ledger = loadLedger()) {
  const mode = input.mode;
  const route = MODE_ROUTES[mode];
  if (!route) {
    return {
      ok: false,
      problems: [`no route table for mode ${mode}`],
    };
  }

  const max = policy.maxCapabilitiesLoaded ?? 18;
  const ablation = input.ablation ?? null; // taste|uupm|frontend|impeccable|none|all
  const allIds = ledger.capabilities.map((c) => c.capabilityId);

  let selectedIds;
  if (ablation === 'all') {
    selectedIds = allIds.filter((id) => !ALWAYS_EXCLUDE.has(id));
  } else {
    selectedIds = [...route.required];
    for (const id of route.optional) {
      if (selectedIds.length >= max) break;
      if (!selectedIds.includes(id)) selectedIds.push(id);
    }
  }

  selectedIds = selectedIds.filter((id) => !ALWAYS_EXCLUDE.has(id));

  if (ablation && ablation !== 'all' && ablation !== 'none') {
    selectedIds = selectedIds.filter((id) => !belongsToGroup(id, ablation));
  }

  if (selectedIds.length > max && ablation !== 'all') {
    selectedIds = selectedIds.slice(0, max);
  }

  if (ablation !== 'all' && selectedIds.length === allIds.length) {
    return {
      ok: false,
      problems: ['router refused to load all capabilities as the default set'],
    };
  }

  const selected = selectedIds.map((capabilityId) => {
    const origin = upstreamOrigin(capabilityId, ledger);
    const phase = PHASE_FOR[capabilityId] ?? PHASE.knowledge;
    return {
      capabilityId,
      upstreamOrigin: origin.repository,
      upstreamCommit: origin.commit,
      whyRelevant: whyRelevant(capabilityId, mode),
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
        : ablation === 'all'
          ? 'should not appear'
          : 'not selected by mode route / budget',
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
  };
}

function belongsToGroup(id, group) {
  if (group === 'taste') return id.startsWith('TASTE-');
  if (group === 'uupm') return id.startsWith('uupm.');
  if (group === 'frontend') return id.startsWith('frontend.');
  if (group === 'impeccable') return id.startsWith('IMP-');
  return false;
}

function whyRelevant(id, mode) {
  if (id.startsWith('frontend.')) return `subject-grounded creative pressure for ${mode}`;
  if (id.startsWith('TASTE-')) return `brief/dials/anti-default discipline for ${mode}`;
  if (id.startsWith('uupm.')) return `searchable design knowledge for ${mode}`;
  if (id.startsWith('IMP-')) return `seed/shape/critique mechanics for ${mode}`;
  return `mode route for ${mode}`;
}

/** Reproducibility helper for tests. */
export function routeDecisionHash(input, policy, ledger) {
  const result = routeCapabilities(input, policy, ledger);
  return result.ok ? result.decisionHash : null;
}
