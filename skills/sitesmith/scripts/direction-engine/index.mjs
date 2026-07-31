#!/usr/bin/env node
/**
 * Direction Engine v3 vertical slice — CLI.
 * Produces route → grounded cards → preflight critic → DesignSpec → handoff.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { validateDirectionInput } from './input.mjs';
import { routeCapabilities, loadLedger } from './router.mjs';
import { generateDirectionCards, blindCandidates, assertNoBlindLeakage } from './worlds-and-cards.mjs';
import { critiqueBlindedCards, resolveChoice } from './critic.mjs';
import { compileDesignSpec, buildHandoffPackage, validateDesignSpec } from './designspec.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const defaultPolicy = JSON.parse(readFileSync(join(here, 'policy.json'), 'utf8'));
const root = join(here, '..', '..', '..', '..');

export function runDirectionEngine(options = {}) {
  const policy = { ...defaultPolicy, ...(options.policy ?? {}) };
  const rawInput = options.input ?? loadInputFromDir(options.dir);
  if (options.ablation) rawInput.ablation = options.ablation;

  const validated = validateDirectionInput(rawInput);
  if (!validated.ok) {
    return { ok: false, stage: 'input', status: validated.status, problems: validated.problems };
  }
  const input = validated.input;
  if (options.ablation) input.ablation = options.ablation;
  if (options.randomSeed != null) input.randomSeed = String(options.randomSeed);

  const ledger = options.ledger ?? loadLedger();
  const route = routeCapabilities(input, policy, ledger);
  if (!route.ok) return { ok: false, stage: 'routing', problems: route.problems };
  if (route.loadedAll59 && input.ablation !== 'all') {
    return { ok: false, stage: 'routing', problems: ['router loaded all 59 capabilities'] };
  }

  const generated = generateDirectionCards(input, route, policy);
  if (!generated.ok) {
    return { ok: false, stage: 'direction', problems: generated.problems, route };
  }

  const { blinded, key, independence, claim } = blindCandidates(
    generated.cards,
    input.randomSeed ?? input.projectName,
  );
  for (const b of blinded) {
    const leaks = assertNoBlindLeakage(b);
    if (leaks.length) {
      return { ok: false, stage: 'blinding', problems: [`blind leakage: ${leaks.join(',')}`] };
    }
  }

  const critic = critiqueBlindedCards(blinded, input, {
    externalRunEvidence: options.externalRunEvidence === true,
  });
  const choice = resolveChoice({
    critic,
    userChoiceBlindId: options.userChoiceBlindId ?? null,
    allowAdjudicator: options.allowAdjudicator === true,
    key,
  });

  if (choice.status === 'error') {
    return {
      ok: false,
      stage: 'choice',
      status: 'error',
      problems: choice.problems,
      route,
      direction: packDirection(generated),
      blinding: { independence, claim, key, blinded },
      critic,
      choice,
    };
  }

  let spec = null;
  let handoff = null;
  let selectedCard = null;
  let stage = choice.status;

  if (choice.status === 'selected') {
    if (!choice.selectedInternalId) {
      return {
        ok: false,
        stage: 'choice',
        problems: ['selected without selectedInternalId'],
        choice,
      };
    }
    selectedCard = generated.cards.find((c) => c.internalId === choice.selectedInternalId);
    if (!selectedCard) {
      return {
        ok: false,
        stage: 'choice',
        problems: [`selectedInternalId ${choice.selectedInternalId} not found`],
        choice,
      };
    }
    const compiled = compileDesignSpec({ input, card: selectedCard, route, policy, choice });
    if (!compiled.ok) return { ok: false, stage: 'designspec', problems: compiled.problems };
    const v = validateDesignSpec(compiled.spec);
    if (!v.ok) return { ok: false, stage: 'designspec', problems: v.problems };
    spec = compiled.spec;
    const rejected = generated.cards.filter((c) => c.internalId !== selectedCard.internalId);
    handoff = buildHandoffPackage({ input, spec, selectedCard, rejectedCards: rejected });
    if (!handoff) {
      return { ok: false, stage: 'handoff', problems: ['handoff missing'] };
    }
    stage = 'handoff-ready';
  }

  // Fail closed: never claim handoff-ready without all three
  if (stage === 'handoff-ready') {
    if (!selectedCard || !spec || !handoff || !choice.selectedInternalId) {
      return {
        ok: false,
        stage: 'handoff',
        problems: ['handoff-ready requires selectedCard + DesignSpec + handoff + selectedInternalId'],
      };
    }
  }

  const inputHash = createHash('sha256')
    .update(JSON.stringify({
      brief: input.brief,
      evidence: input.evidence,
      brand: input.brand,
      assetPlan: input.assetPlan,
      assetManifest: input.assetManifest,
      mode: input.mode,
      stack: input.stack,
      userConstraints: input.userConstraints,
      randomSeed: input.randomSeed,
    }))
    .digest('hex');

  let engineCommit = null;
  try {
    // optional — not required for local runs
    engineCommit = options.engineCommit ?? null;
  } catch {
    engineCommit = null;
  }

  return {
    ok: true,
    stage,
    policyVersion: policy.policyVersion,
    inputWarnings: input.warnings,
    proofMeta: {
      engineCommit,
      inputHash,
      policyVersion: policy.policyVersion,
      randomSeed: input.randomSeed,
      numericSeed: generated.numericSeed,
    },
    route,
    direction: packDirection(generated),
    blinding: { independence, claim, key, blinded },
    critic,
    choice,
    designSpec: spec,
    handoff,
  };
}

function packDirection(generated) {
  return {
    worlds: generated.worlds,
    cards: generated.cards,
    pairwise: generated.pairwise,
    entropy: generated.entropy,
    numericSeed: generated.numericSeed,
    eligibleSeedCount: generated.eligibleSeedCount,
  };
}

function loadInputFromDir(dir) {
  if (!dir) return {};
  const base = resolve(dir);
  const read = (name) => {
    const p = join(base, name);
    return existsSync(p) ? readFileSync(p, 'utf8') : '';
  };
  const metaPath = join(base, 'engine-input.json');
  const meta = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, 'utf8')) : {};
  return {
    brief: read('BRIEF.md'),
    evidence: read('EVIDENCE.md'),
    brand: read('BRAND.md'),
    assetPlan: read('ASSET-PLAN.md'),
    assetManifest: read('ASSET-MANIFEST.md'),
    mode: meta.mode,
    stack: meta.stack,
    userConstraints: meta.userConstraints ?? read('CONSTRAINTS.md'),
    projectName: meta.projectName ?? base.split(/[/\\]/).pop(),
    randomSeed: meta.randomSeed ?? null,
  };
}

function main(argv) {
  const args = [...argv];
  const cmd = args.shift() ?? 'help';
  if (cmd === 'help' || cmd === '--help') {
    console.log(`usage:
  node direction-engine/index.mjs run --dir <fixture> [--choose L1] [--ablation taste|uupm|frontend|impeccable|all] [--out <dir>] [--seed S]
`);
    process.exit(0);
  }
  const flag = (name) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : null;
  };
  const dir = flag('--dir');
  const out = flag('--out');
  const choose = flag('--choose');
  const ablation = flag('--ablation');
  const seed = flag('--seed');

  const result = runDirectionEngine({
    dir,
    userChoiceBlindId: choose,
    allowAdjudicator: args.includes('--adjudicate'),
    ablation,
    randomSeed: seed,
  });

  if (out) {
    mkdirSync(out, { recursive: true });
    writeFileSync(join(out, 'engine-result.json'), JSON.stringify(result, null, 2));
    if (result.handoff?.directionMd) writeFileSync(join(out, 'DIRECTION.md'), result.handoff.directionMd);
    if (result.designSpec) writeFileSync(join(out, 'DESIGNSPEC.json'), JSON.stringify(result.designSpec, null, 2));
    if (result.handoff) writeFileSync(join(out, 'HANDOFF.json'), JSON.stringify(result.handoff, null, 2));
  }

  if (!result.ok) {
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({
    ok: result.ok,
    stage: result.stage,
    selectedCount: result.route.selectedCount,
    decisionHash: result.route.decisionHash,
    domainRetrieval: result.route.domainRetrieval,
    cards: result.direction.cards.map((c) => c.worldId),
    pairwisePass: result.direction.pairwise.every((p) => p.pass),
    critic: {
      role: result.critic.role,
      independence: result.critic.independence,
      rejectAll: result.critic.rejectAll,
      tie: result.critic.tie,
    },
    choice: result.choice,
    handoffReady: result.stage === 'handoff-ready',
    proofMeta: result.proofMeta,
  }, null, 2));
}

const thisFile = fileURLToPath(import.meta.url);
const invokedAsCli = Boolean(process.argv[1])
  && pathToFileURL(resolve(process.argv[1])).href === pathToFileURL(thisFile).href;
if (invokedAsCli) main(process.argv.slice(2));
