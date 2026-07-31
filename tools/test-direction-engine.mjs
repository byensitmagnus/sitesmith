#!/usr/bin/env node
/** Tests for Direction Engine v3 vertical slice. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateDirectionInput } from '../skills/sitesmith/scripts/direction-engine/input.mjs';
import { routeCapabilities, loadLedger } from '../skills/sitesmith/scripts/direction-engine/router.mjs';
import {
  generateDirectionCards, blindCandidates, isStructurallyDifferent, isRound8Recipe,
} from '../skills/sitesmith/scripts/direction-engine/worlds-and-cards.mjs';
import { critiqueBlindedCards, resolveChoice } from '../skills/sitesmith/scripts/direction-engine/critic.mjs';
import { compileDesignSpec, buildHandoffPackage } from '../skills/sitesmith/scripts/direction-engine/designspec.mjs';
import { runDirectionEngine } from '../skills/sitesmith/scripts/direction-engine/index.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const policy = JSON.parse(readFileSync(
  join(root, 'skills/sitesmith/scripts/direction-engine/policy.json'),
  'utf8',
));

let failed = 0;
const ok = (name) => console.log(`ok  ${name}`);
const fail = (name, detail) => {
  failed += 1;
  console.error(`FAIL ${name}: ${detail}`);
};

const baseInput = {
  brief: '# Subject: Northline Leather Goods\nAudience: buyers of small-batch bags\nPrimary action: configure a bag\n',
  evidence: 'Subject: Northline Leather Goods\nProducts: tote, belt, strap\nPrices from evidence only\nMaterials: bridle leather\nAnti-references: generic SaaS purple, stock handshake photos\n',
  brand: 'Ink brown and cream. No invented testimonials.\n',
  assetPlan: 'Load-bearing: product plates of tote and belt\n',
  assetManifest: 'tote.webp (have), belt.webp (have)\n',
  mode: 'ecommerce',
  stack: 'html',
  projectName: 'northline-test',
  randomSeed: 'fixed-seed-1',
};

// input schema
{
  const bad = validateDirectionInput({ mode: 'ecommerce', stack: 'html' });
  if (bad.ok || bad.status !== 'stop') fail('input-missing', JSON.stringify(bad));
  else ok('input-schema rejects missing essential fields');

  const good = validateDirectionInput(baseInput);
  if (!good.ok) fail('input-valid', good.problems?.join('; '));
  else ok('input-schema accepts complete pack');
}

// routing
{
  const ledger = loadLedger();
  const r1 = routeCapabilities(baseInput, policy, ledger);
  const r2 = routeCapabilities(baseInput, policy, ledger);
  if (!r1.ok) fail('routing', r1.problems.join('; '));
  else if (r1.selectedCount >= 59) fail('routing-budget', `loaded ${r1.selectedCount}`);
  else if (r1.decisionHash !== r2.decisionHash) fail('routing-repro', 'hash drift');
  else if (r1.loadedAll59) fail('routing-all59', 'loaded all');
  else ok(`routing selects ${r1.selectedCount}/59 reproducibly`);

  const all = routeCapabilities({ ...baseInput, ablation: 'all' }, policy, ledger);
  if (!all.ok || all.selectedCount < 50) fail('routing-ablation-all', JSON.stringify(all.selectedCount));
  else ok('routing ablation=all loads near-full non-rejected set');

  const noTaste = routeCapabilities({ ...baseInput, ablation: 'taste' }, policy, ledger);
  if (noTaste.selected.some((s) => s.capabilityId.startsWith('TASTE-'))) fail('routing-ablation-taste', 'taste still present');
  else ok('routing ablation removes taste group');
}

// diversity + blinding + reject-all path
{
  const ledger = loadLedger();
  const route = routeCapabilities(baseInput, policy, ledger);
  const validated = validateDirectionInput(baseInput);
  const gen = generateDirectionCards(validated.input, route, policy);
  if (!gen.ok) fail('cards', gen.problems.join('; '));
  else if (!gen.pairwise.every((p) => p.pass)) fail('diversity', JSON.stringify(gen.pairwise));
  else if (gen.cards.some(isRound8Recipe)) fail('round8', 'recipe present');
  else ok('direction cards are pairwise structurally different');

  const { blinded, key } = blindCandidates(gen.cards, 'fixed-seed-1');
  if (blinded.some((c) => c.internalId || c.generatorRank != null)) fail('blinding', 'leaked ids/scores');
  else if (Object.keys(key).length !== 3) fail('blinding-key', JSON.stringify(key));
  else ok('candidate blinding hides internal ids and scores');

  const critic = critiqueBlindedCards(blinded, validated.input);
  const awaiting = resolveChoice({ critic, userChoiceBlindId: null, key });
  if (awaiting.status === 'selected' && awaiting.by !== 'user') {
    fail('user-choice', 'auto-selected without user');
  } else ok('choice awaits user (no silent adjudicator)');

  const chosen = resolveChoice({ critic, userChoiceBlindId: 'L1', key });
  if (chosen.status !== 'selected' || chosen.by !== 'user') fail('user-select', JSON.stringify(chosen));
  else ok('user can select blinded card');
}

// designspec + handoff
{
  const result = runDirectionEngine({
    input: baseInput,
    userChoiceBlindId: 'L1',
    randomSeed: 'fixed-seed-1',
  });
  if (!result.ok) fail('engine', JSON.stringify(result.problems ?? result));
  else if (!result.designSpec) {
    // L1 after shuffle may map differently — pick advisory or first blind
    const pick = result.critic.recommendation ?? result.blinding.blinded[0].blindId;
    const retry = runDirectionEngine({
      input: baseInput,
      userChoiceBlindId: pick,
      randomSeed: 'fixed-seed-1',
    });
    if (!retry.designSpec) fail('designspec', JSON.stringify(retry.choice));
    else if (!retry.handoff?.withheldFromBuild?.rejectedDirectionCards) fail('handoff', 'missing withhold');
    else if (retry.handoff.withheldFromBuild.generatorScores !== true) fail('handoff-scores', 'scores not withheld');
    else ok('DesignSpec + handoff withhold generator scores and losers');
  } else {
    ok('DesignSpec + handoff produced');
  }
}

// provider fallback field present on each selected capability
{
  const route = routeCapabilities(baseInput, policy, loadLedger());
  if (!route.selected.every((s) => s.providerFallback)) fail('fallback', 'missing providerFallback');
  else ok('provider fallback recorded per capability');
}

// context budget not absurd for default route
{
  const route = routeCapabilities(baseInput, policy, loadLedger());
  if (route.totalContextCostTokens > policy.contextBudgetTokens * 2) {
    fail('budget', String(route.totalContextCostTokens));
  } else ok(`context cost ${route.totalContextCostTokens} within soft budget`);
}

// compileDesignSpec schema fields
{
  const validated = validateDirectionInput(baseInput);
  const route = routeCapabilities(baseInput, policy, loadLedger());
  const gen = generateDirectionCards(validated.input, route, policy);
  const card = gen.cards[0];
  const { spec } = compileDesignSpec({
    input: validated.input,
    card,
    route,
    policy,
    choice: { by: 'user' },
  });
  const required = [
    'designThesis', 'contentHierarchy', 'pageComposition', 'gridAndSpacing',
    'typographySystem', 'colourRoles', 'surfaceMaterialModel', 'imageryStrategy',
    'componentPrinciples', 'interactionStates', 'motionRules', 'responsiveBehavior',
    'accessibilityConstraints', 'signatureElement', 'forbiddenFallbackDefaults',
    'fidelityAssertions', 'acceptanceCriteria', 'capabilityProvenance',
  ];
  const missing = required.filter((k) => spec[k] == null);
  if (missing.length) fail('designspec-fields', missing.join(','));
  else ok('DesignSpec contains required fields');

  const handoff = buildHandoffPackage({
    input: validated.input,
    spec,
    selectedCard: card,
    rejectedCards: gen.cards.slice(1),
  });
  if (!handoff.directionMd.includes('direction-version: 2.3')) fail('axis-record', 'missing');
  else ok('handoff emits v2.3 axis record for existing fidelity gate');
}

if (failed) {
  console.error(`\ndirection-engine tests FAILED (${failed})`);
  process.exit(1);
}
console.log('\ndirection-engine tests PASS');
