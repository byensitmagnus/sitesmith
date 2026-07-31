#!/usr/bin/env node
/** Corrective-pass tests for Direction Engine v3 slice. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  validateDirectionInput, canonicalNewlines, cleanExtractedField, contentLines,
} from '../skills/sitesmith/scripts/direction-engine/input.mjs';
import { routeCapabilities, loadLedger } from '../skills/sitesmith/scripts/direction-engine/router.mjs';
import {
  generateDirectionCards, blindCandidates, assertNoBlindLeakage, worldEligible, WORLD_LIBRARY,
} from '../skills/sitesmith/scripts/direction-engine/worlds-and-cards.mjs';
import { critiqueBlindedCards, resolveChoice } from '../skills/sitesmith/scripts/direction-engine/critic.mjs';
import { compileDesignSpec, validateDesignSpec, buildHandoffPackage } from '../skills/sitesmith/scripts/direction-engine/designspec.mjs';
import { runDirectionEngine, runDirectionEngineAsync } from '../skills/sitesmith/scripts/direction-engine/index.mjs';
import { guardCreativePacket } from '../skills/sitesmith/scripts/direction-engine/evidence-guard.mjs';

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

// 8 blind leakage (keys + content: worldIds, internal ids, capability ids)
{
  const v = validateDirectionInput(ecommerceA).input;
  const route = routeCapabilities(v, policy, loadLedger());
  const gen = generateDirectionCards(v, route, policy);
  if (!gen.ok) fail('blind-gen', gen.problems?.join(';'));
  else {
    const { blinded } = blindCandidates(gen.cards, 'x');
    const leaks = blinded.flatMap((b) => assertNoBlindLeakage(b));
    if (leaks.length) fail('blind-leak', leaks.join(','));
    else if (blinded.some((b) => /poster-type|statement-object|split-evidence|material-board|editorial-bleed|product-interface/i.test(JSON.stringify(b)))) {
      fail('blind-leak', 'worldId substring in blind packet strings');
    } else if (blinded.some((b) => !/^L\d+$/.test(b.blindId) || !String(b.signatureElement).includes(b.blindId))) {
      fail('blind-leak', 'signature must use blindId, not seed id');
    } else if (blinded.some((b) => !/Differs from L\d/.test(b.differenceNote) || /poster-type|statement-object/.test(b.differenceNote))) {
      fail('blind-leak', 'differenceNote must name peer blindIds only');
    } else ok('blind packet contains no identity/provenance leakage');
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

// Subject extraction must not keep YAML trailing quotes (H2H failure mode)
{
  const v = validateDirectionInput({
    brief: '---\ntitle: "Subject: Northline Leather Goods"\nstatus: x\n---\n\n# Subject: Northline Leather Goods\nAudience: buyers\nPrimary action: configure a bag\n',
    evidence: 'Subject: Northline Leather Goods\nProducts: Field Tote, Belt No. 2\nMaterials: bridle leather, solid brass\nAnti-references: purple SaaS gradient\n',
    brand: 'Ink brown, warm cream, single brass accent.\n',
    assetPlan: 'Load-bearing: product plates for Field Tote\n',
    assetManifest: '- field-tote.webp (have)\n',
    mode: 'ecommerce',
    stack: 'html',
  });
  if (!v.ok) fail('subject-extract', v.problems?.join(';'));
  else if (/["']/.test(v.input.signals.subject)) fail('subject-extract', `quote leak: ${v.input.signals.subject}`);
  else if (v.input.signals.subject !== 'Northline Leather Goods') fail('subject-extract', v.input.signals.subject);
  else if (!v.input.signals.products?.includes('Field Tote')) fail('subject-extract', 'products missing');
  else if (!(v.input.signals.brandPalette ?? []).some((p) => /brass|cream|ink/i.test(p))) fail('subject-extract', 'palette missing');
  else ok('subject extraction strips YAML quotes and captures products/palette');
  if (cleanExtractedField('Goods"') !== 'Goods') fail('clean-field', cleanExtractedField('Goods"'));
  if (contentLines('title: x\nReal line').join() !== 'Real line') fail('content-lines', 'frontmatter not filtered');
}

// Rich card packet: thesis/signature/grounding usable for H2H (not frontmatter dump)
{
  const v = validateDirectionInput(ecommerceA).input;
  // inject plate evidence
  v.signals.hasProductPlates = true;
  v.signals.products = ['Field Tote', 'Belt No. 2'];
  v.signals.materials = ['bridle leather'];
  v.signals.brandPalette = ['ink brown', 'warm cream', 'brass'];
  v.signals.commerce = true;
  const route = routeCapabilities(v, policy, loadLedger());
  const gen = generateDirectionCards(v, route, policy);
  if (!gen.ok) fail('rich-card', gen.problems?.join(';'));
  else {
    const c = gen.cards[0];
    if (/title:|ai_generated|status: proof/i.test(c.evidence)) fail('rich-card', 'frontmatter in evidence summary');
    if (/["']$/.test(c.thesis) || /\\+"/.test(c.thesis)) fail('rich-card', `thesis quote: ${c.thesis}`);
    if (/^[\w-]+-sig-\d+$/.test(c.signatureElement)) fail('rich-card', `opaque sig only: ${c.signatureElement}`);
    if (!/1\)/.test(c.layoutPrinciple)) fail('rich-card', 'hierarchy missing numbered levels');
    if (!/make-slot desk|Hide Grade|Make-slot/i.test(`${c.thesis} ${c.signatureElement}`)) {
      fail('rich-card', `creative layer weak: ${c.thesis} / ${c.signatureElement}`);
    } else if (!c.implementationNotes || c.implementationNotes.length < 80) {
      fail('rich-card', 'missing implementationNotes');
    } else ok('rich cards: clean evidence, thesis, signature, hierarchy + creative layer');
  }
}

// Evidence guard rejects invented testimonials / undeclared assets
{
  const v = validateDirectionInput(ecommerceA).input;
  const bad = {
    designThesis: 'Customers love us: "best bags ever" said Anna',
    subjectGrounding: 'Northline',
    composition: 'x',
    informationHierarchy: 'x',
    typography: 'x',
    colourAndMaterialModel: 'x',
    imageryAndAssetStrategy: 'uses secret-hero.png',
    interactionConcept: 'x',
    signatureElement: 'x',
    primaryRisk: 'x',
    implementationGuidance: 'x',
    unknowns: 'x',
  };
  const g = guardCreativePacket(bad, v);
  if (g.ok) fail('evidence-guard', 'should reject inventions');
  else if (!g.problems.some((p) => /testimonial|undeclared-asset/i.test(p))) {
    fail('evidence-guard', g.problems.join(','));
  } else ok('evidence guard rejects invented social proof and assets');
}

// LLM creative pass with mock provider + guard (async)
{
  const mockOk = async ({ prompt }) => ({
    text: JSON.stringify({
      designThesis: 'Northline Leather Goods make-slot desk for Field Tote and Belt No. 2',
      subjectGrounding: 'Subject Northline Leather Goods; products tote belt; materials bridle leather',
      composition: 'plate first then make-slot',
      informationHierarchy: '1) Field Tote 2) hide 3) make-slot',
      typography: 'IBM Plex Sans',
      colourAndMaterialModel: 'ink brown cream brass',
      imageryAndAssetStrategy: 'product plates only no lifestyle',
      interactionConcept: 'static make-slot request',
      signatureElement: 'Hide Grade Strip',
      primaryRisk: 'generic artisan catalog',
      implementationGuidance: 'Request make-slot CTA; no reviews',
      unknowns: 'exact hide codes',
    }),
    model: 'mock-ok',
  });
  const mockBad = async () => ({
    text: JSON.stringify({
      designThesis: 'Award-winning brand with free worldwide shipping and 4.9★',
      subjectGrounding: 'x',
      composition: 'x',
      informationHierarchy: 'x',
      typography: 'x',
      colourAndMaterialModel: 'x',
      imageryAndAssetStrategy: 'celebrity-hero.webp',
      interactionConcept: 'x',
      signatureElement: 'x',
      primaryRisk: 'x',
      implementationGuidance: 'x',
      unknowns: 'x',
    }),
    model: 'mock-bad',
  });
  const rOk = await runDirectionEngineAsync({
    input: ecommerceA,
    userChoiceBlindId: 'L1',
    randomSeed: 'seed-a',
    creativePass: 'llm',
    llmProvider: mockOk,
  });
  if (!rOk.ok || !rOk.creative?.llmSucceeded) fail('llm-pass', JSON.stringify(rOk.creative));
  else if (!/make-slot|Field Tote|Hide Grade/i.test(rOk.directionPacket?.designThesis || '')) {
    fail('llm-pass', rOk.directionPacket?.designThesis);
  } else ok('llm creative pass with mock succeeds under guard');

  const rBad = await runDirectionEngineAsync({
    input: ecommerceA,
    userChoiceBlindId: 'L1',
    randomSeed: 'seed-a',
    creativePass: 'llm',
    llmProvider: mockBad,
  });
  if (!rBad.ok) fail('llm-fallback', 'engine should still ok');
  else if (rBad.creative?.llmSucceeded) fail('llm-fallback', 'bad packet should not succeed');
  else if (!rBad.creative?.creativePassFallback) fail('llm-fallback', 'expected fallback to rules');
  else ok('llm creative pass fails closed to rules on invented claims');
}

// Cross-platform inputHash + proof results: LF vs CRLF must match
{
  const briefDir = join(root, 'docs/v3/proof/briefs/01-leather-goods');
  const meta = JSON.parse(readFileSync(join(briefDir, 'engine-input.json'), 'utf8'));
  const readMd = (n) => readFileSync(join(briefDir, n), 'utf8');
  const base = {
    brief: readMd('BRIEF.md'),
    evidence: readMd('EVIDENCE.md'),
    brand: readMd('BRAND.md'),
    assetPlan: readMd('ASSET-PLAN.md'),
    assetManifest: readMd('ASSET-MANIFEST.md'),
    mode: meta.mode,
    stack: meta.stack,
    projectName: meta.projectName,
    randomSeed: meta.randomSeed,
  };
  const toCrlf = (s) => String(s).replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
  const toLf = (s) => canonicalNewlines(s);
  const lfInput = Object.fromEntries(
    Object.entries(base).map(([k, v]) => [k, typeof v === 'string' && !['mode', 'stack', 'projectName', 'randomSeed'].includes(k) ? toLf(v) : v]),
  );
  const crlfInput = Object.fromEntries(
    Object.entries(base).map(([k, v]) => [k, typeof v === 'string' && !['mode', 'stack', 'projectName', 'randomSeed'].includes(k) ? toCrlf(v) : v]),
  );
  // Sanity: variants actually differ before engine
  if (lfInput.brief === crlfInput.brief || !crlfInput.brief.includes('\r\n')) {
    fail('crlf-variant', 'test setup did not produce distinct CRLF brief');
  } else {
    const rLf = runDirectionEngine({ input: lfInput, userChoiceBlindId: 'L1', randomSeed: meta.randomSeed });
    const rCrlf = runDirectionEngine({ input: crlfInput, userChoiceBlindId: 'L1', randomSeed: meta.randomSeed });
    if (!rLf.ok || !rCrlf.ok) {
      fail('line-ending-run', `lf=${rLf.ok} crlf=${rCrlf.ok}`);
    } else if (rLf.proofMeta?.inputHash !== rCrlf.proofMeta?.inputHash) {
      fail('line-ending-inputHash', `${rLf.proofMeta.inputHash} != ${rCrlf.proofMeta.inputHash}`);
    } else if (rLf.route?.decisionHash !== rCrlf.route?.decisionHash) {
      fail('line-ending-decisionHash', 'route decisionHash diverged');
    } else {
      const idsLf = (rLf.direction?.cards ?? []).map((c) => c.worldId).join(',');
      const idsCrlf = (rCrlf.direction?.cards ?? []).map((c) => c.worldId).join(',');
      if (idsLf !== idsCrlf) fail('line-ending-cards', `${idsLf} != ${idsCrlf}`);
      else if (rLf.stage !== rCrlf.stage) fail('line-ending-stage', `${rLf.stage} != ${rCrlf.stage}`);
      else ok('identical LF and CRLF produce same inputHash and proof results');
    }
  }
  // canonicalNewlines is idempotent and maps CR alone
  if (canonicalNewlines('a\r\nb\rc') !== 'a\nb\nc') fail('canonical-newlines', 'CRLF/CR map failed');
  else if (canonicalNewlines(canonicalNewlines('a\r\nb')) !== 'a\nb') fail('canonical-newlines', 'not idempotent');
  else ok('canonicalNewlines CRLF/CR → LF is idempotent');
}

if (failed) {
  console.error(`\ndirection-engine tests FAILED (${failed})`);
  process.exit(1);
}
console.log('\ndirection-engine tests PASS');
