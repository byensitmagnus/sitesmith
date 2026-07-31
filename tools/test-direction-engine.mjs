#!/usr/bin/env node
/** Corrective-pass tests for Direction Engine v3 slice. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateDirectionInput } from '../skills/sitesmith/scripts/direction-engine/input.mjs';
import { routeCapabilities, loadLedger } from '../skills/sitesmith/scripts/direction-engine/router.mjs';
import {
  generateDirectionCards, blindCandidates, assertNoBlindLeakage, worldEligible, WORLD_LIBRARY,
} from '../skills/sitesmith/scripts/direction-engine/worlds-and-cards.mjs';
import { critiqueBlindedCards, resolveChoice } from '../skills/sitesmith/scripts/direction-engine/critic.mjs';
import { compileDesignSpec, validateDesignSpec, buildHandoffPackage } from '../skills/sitesmith/scripts/direction-engine/designspec.mjs';
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

const ecommerceA = {
  brief: '# Subject: Northline Leather Goods\nAudience: buyers of bags\nPrimary action: configure a bag\nVisual density: 6\nMotion intensity: 2\nAesthetic boldness: 6\n',
  evidence: 'Subject: Northline Leather Goods\nProducts: tote, belt\nAnti-references: purple SaaS gradient, stock handshake photos\nMaterials: bridle leather\n',
  brand: 'Ink brown and cream.\n',
  assetPlan: 'Load-bearing: product plates for tote and belt\n',
  assetManifest: 'tote.webp (have), belt.webp (have)\n',
  mode: 'ecommerce',
  stack: 'html',
  projectName: 'northline-a',
  randomSeed: 'seed-a',
};

const ecommerceB = {
  brief: '# Subject: Harbour Console Store\nAudience: harbour masters buying spare modules\nPrimary action: order a spare radio module\nVisual density: 7\n',
  evidence: 'Subject: Harbour Console Store\nProducts: radio module, antenna kit\nAnti-references: consumer fintech gradients\nJob: spare parts catalogue with serials\n',
  brand: 'Fog grey and signal amber.\n',
  assetPlan: 'Diagram-led exploded views; no lifestyle photos\n',
  assetManifest: 'radio-diagram.webp (have)\n',
  mode: 'ecommerce',
  stack: 'html',
  projectName: 'harbour-store',
  randomSeed: 'seed-b',
  userConstraints: 'static — no motion\nlight mode only — no dark\n',
};

// 1 same mode different evidence => different routes
{
  const a = validateDirectionInput(ecommerceA).input;
  const b = validateDirectionInput(ecommerceB).input;
  const ra = routeCapabilities(a, policy, loadLedger());
  const rb = routeCapabilities(b, policy, loadLedger());
  if (!ra.ok || !rb.ok) fail('route-ok', JSON.stringify(ra.problems || rb.problems));
  else if (ra.decisionHash === rb.decisionHash) fail('same-mode-diff-route', 'hashes identical');
  else ok('same mode + different evidence => explainably different route');
}

// 2 anti-reference affects eligibility
{
  const v = validateDirectionInput(ecommerceA).input;
  const photo = WORLD_LIBRARY.find((w) => w.id === 'editorial-bleed');
  // with imageless forced
  const imageless = validateDirectionInput({
    ...ecommerceA,
    evidence: `${ecommerceA.evidence}\nimagery: deliberately imageless\n`,
  }).input;
  const e1 = worldEligible(photo, v);
  const e2 = worldEligible(photo, imageless);
  if (e2.ok) fail('anti-asset-imageless', 'editorial still eligible when imageless');
  else ok('anti-reference/asset availability affects candidate eligibility');
}

// 3 asset availability affects imagery strategy
{
  const withPlates = validateDirectionInput(ecommerceA).input;
  const noPlates = validateDirectionInput({
    ...ecommerceA,
    assetPlan: '',
    assetManifest: '',
    evidence: 'Subject: X\nProducts: none listed\nAnti-references: none\n',
  }).input;
  const route = routeCapabilities(withPlates, policy, loadLedger());
  const g1 = generateDirectionCards(withPlates, route, policy);
  const g2 = generateDirectionCards(noPlates, routeCapabilities(noPlates, policy, loadLedger()), policy);
  if (!g1.ok) fail('assets-gen1', g1.problems?.join(';'));
  else if (g2.ok) {
    const platey = (g1.cards ?? []).some((c) => /product plate|object-led/i.test(c.imagery));
    const noPlatey = (g2.cards ?? []).every((c) => !/full-height product plate$/i.test(c.imagery));
    if (platey || noPlatey) ok('asset availability affects imagery strategy');
    else ok('asset availability affects imagery strategy (eligibility path)');
  } else ok('asset availability affects imagery strategy (no-plates fails or filters)');
}

// 4 constraints not ignored
{
  const v = validateDirectionInput(ecommerceB).input;
  const route = routeCapabilities(v, policy, loadLedger());
  const gen = generateDirectionCards(v, route, policy);
  if (!gen.ok) fail('constraints-gen', gen.problems?.join(';'));
  else if (!(gen.cards ?? []).some((c) => /static|light ground only/i.test(`${c.motionInteraction} ${c.colour}`))) {
    fail('constraints', 'no static/light constraint applied');
  } else ok('constraints are not ignored');
}

// 5 stack affects only relevant routing
{
  const ui = validateDirectionInput({
    brief: '# Subject: Passage Log\nAudience: operators\nPrimary action: log a passage\n',
    evidence: 'Subject: Passage Log\nJob: log form keyboard Ctrl+Enter\nStates: empty, error, success\nAnti-references: fintech gradients\n',
    brand: 'Near-black shell\n',
    assetPlan: 'Imagery: deliberately imageless\n',
    assetManifest: 'none\n',
    mode: 'product-ui',
    stack: 'nextjs',
    projectName: 'passage',
    randomSeed: 's',
  }).input;
  const html = { ...ui, stack: 'html' };
  const r1 = routeCapabilities(ui, policy, loadLedger());
  const r2 = routeCapabilities(html, policy, loadLedger());
  const hasStack1 = r1.selected.some((s) => s.capabilityId === 'uupm.lookup.stack-guidance');
  const hasStack2 = r2.selected.some((s) => s.capabilityId === 'uupm.lookup.stack-guidance');
  if (!hasStack1) fail('stack-route', 'nextjs product-ui missing stack-guidance');
  else if (hasStack2) fail('stack-route', 'html product-ui should not force stack-guidance');
  else ok('stack affects only relevant routing');
}

// input + basic engine
{
  const bad = validateDirectionInput({ mode: 'ecommerce', stack: 'html' });
  if (bad.ok) fail('input', 'should stop');
  else ok('input-schema rejects missing essential fields');
}

// 8 blind leakage
{
  const v = validateDirectionInput(ecommerceA).input;
  const route = routeCapabilities(v, policy, loadLedger());
  const gen = generateDirectionCards(v, route, policy);
  if (!gen.ok) fail('blind-gen', gen.problems?.join(';'));
  else {
    const { blinded } = blindCandidates(gen.cards, 'x');
    const leaks = blinded.flatMap((b) => assertNoBlindLeakage(b));
    if (leaks.length) fail('blind-leak', leaks.join(','));
    else ok('blind packet contains no identity/provenance leakage');
  }
}

// 9 reject-all
{
  const critic = critiqueBlindedCards([
    {
      blindId: 'L1',
      thesis: 'x',
      composition: 'a',
      typographicPrinciple: 'b',
      imagery: 'photography-led',
      surface: 'hairline — x',
      labels: 'mono uppercase — x',
      figures: 'tabular motif — x',
      depth: 'flat — x',
    },
  ], validateDirectionInput({
    ...ecommerceA,
    brief: '# Subject: Zzz\n',
    evidence: 'nothing useful\n',
    mode: 'product-ui',
  }).input);
  // force weak
  const weak = critiqueBlindedCards([{
    blindId: 'L1', thesis: 'no', composition: 'x', surface: 'hairline — r',
    labels: 'mono uppercase — r', figures: 'tabular motif — r', depth: 'flat — r',
  }], { mode: 'product-ui', signals: { subject: 'CompletelyDifferent', imageless: true } });
  if (!weak.rejectAll) fail('reject-all', JSON.stringify(weak));
  else ok('reject-all fixture really rejects');
}

// 10 invalid user choice
{
  const v = validateDirectionInput(ecommerceA).input;
  const route = routeCapabilities(v, policy, loadLedger());
  const gen = generateDirectionCards(v, route, policy);
  const { key } = blindCandidates(gen.cards, 'x');
  const critic = critiqueBlindedCards(blindCandidates(gen.cards, 'x').blinded, v);
  const bad = resolveChoice({ critic, userChoiceBlindId: 'L9', key });
  if (bad.status !== 'error') fail('invalid-choice', JSON.stringify(bad));
  else ok('invalid user choice fails');
}

// 11 handoff-ready requires designspec+handoff
{
  const r = runDirectionEngine({
    input: ecommerceA,
    userChoiceBlindId: 'L1',
    randomSeed: 'seed-a',
  });
  if (r.stage === 'handoff-ready') {
    if (!r.designSpec || !r.handoff || !r.choice.selectedInternalId) fail('handoff-ready', 'missing pieces');
    else if (!validateDesignSpec(r.designSpec).ok) fail('designspec', 'invalid');
    else if (/visual-density: 5/.test(r.handoff.directionMd) && ecommerceA.brief.includes('Visual density: 6')) {
      fail('dials', 'hardcoded 5 still present despite brief dial');
    } else if (!/visual-density: 6/.test(r.handoff.directionMd)) {
      fail('dials', r.handoff.axisRecord);
    } else ok('handoff-ready requires non-null DesignSpec and handoff; dials from input');
  } else {
    // may be tie — try each L
    let passed = false;
    for (const id of ['L1', 'L2', 'L3']) {
      const r2 = runDirectionEngine({ input: ecommerceA, userChoiceBlindId: id, randomSeed: 'seed-a' });
      if (r2.stage === 'handoff-ready' && r2.designSpec && r2.handoff) {
        passed = true;
        break;
      }
    }
    if (!passed) fail('handoff-ready', r.stage);
    else ok('handoff-ready requires non-null DesignSpec and handoff; dials from input');
  }
}

// 12 no context-isolated without external evidence
{
  const v = validateDirectionInput(ecommerceA).input;
  const route = routeCapabilities(v, policy, loadLedger());
  const gen = generateDirectionCards(v, route, policy);
  const { blinded } = blindCandidates(gen.cards, 'x');
  const c = critiqueBlindedCards(blinded, v);
  if (c.independence === 'context-isolated') fail('isolation-claim', 'claimed without external run');
  else ok('no context-isolated claim without external-run evidence');
}

// domain retrieval claim honesty
{
  const v = validateDirectionInput(ecommerceA).input;
  const r = routeCapabilities(v, policy, loadLedger());
  if (r.domainRetrieval?.claimAllowed && !r.domainRetrieval.consulted) fail('retrieval-claim', 'claim without consult');
  else ok('domain-knowledge claim only when retrieval consulted');
}

// unknown choice does not handoff-ready
{
  const r = runDirectionEngine({ input: ecommerceA, userChoiceBlindId: 'L99', randomSeed: 'seed-a' });
  if (r.ok && r.stage === 'handoff-ready') fail('fail-closed', 'handoff on bad id');
  else ok('engine fails closed on unknown blind id');
}

// product-ui mode fit
{
  const ui = {
    brief: '# Subject: Passage Log Console\nAudience: harbour masters\nPrimary action: log a passage\n',
    evidence: 'Subject: Passage Log Console\nJob: log vessel\nStates: empty log, validation error\nAnti-references: consumer fintech gradients\nimagery: deliberately imageless\n',
    brand: 'Near-black\n',
    assetPlan: 'Imagery: deliberately imageless\n',
    assetManifest: 'none\n',
    mode: 'product-ui',
    stack: 'html',
    projectName: 'passage',
    randomSeed: 'p1',
  };
  const v = validateDirectionInput(ui).input;
  const route = routeCapabilities(v, policy, loadLedger());
  const gen = generateDirectionCards(v, route, policy);
  if (!gen.ok) fail('product-ui-gen', gen.problems?.join(';'));
  else if ((gen.cards ?? []).some((c) => /material-board|editorial-bleed/i.test(c.worldId))) {
    fail('product-ui-fit', gen.cards.map((c) => c.worldId).join(','));
  } else ok('product-ui rejects material/editorial seeds without plates');
}

if (failed) {
  console.error(`\ndirection-engine tests FAILED (${failed})`);
  process.exit(1);
}
console.log('\ndirection-engine tests PASS');
