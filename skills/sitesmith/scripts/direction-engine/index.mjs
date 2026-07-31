#!/usr/bin/env node
/**
 * Direction Engine v3 vertical slice — CLI.
 * Does not replace v2.3 install/build/audit. Produces route → cards → critic → DesignSpec → handoff.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { validateDirectionInput } from './input.mjs';
import { routeCapabilities, loadLedger } from './router.mjs';
import { generateDirectionCards, blindCandidates } from './worlds-and-cards.mjs';
import { critiqueBlindedCards, resolveChoice } from './critic.mjs';
import { compileDesignSpec, buildHandoffPackage } from './designspec.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const defaultPolicy = JSON.parse(readFileSync(join(here, 'policy.json'), 'utf8'));

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

  const { blinded, key, independence } = blindCandidates(generated.cards, input.randomSeed ?? input.projectName);
  const critic = critiqueBlindedCards(blinded, input);
  const choice = resolveChoice({
    critic,
    userChoiceBlindId: options.userChoiceBlindId ?? null,
    allowAdjudicator: options.allowAdjudicator === true,
    key,
  });

  let spec = null;
  let handoff = null;
  let selectedCard = null;

  if (choice.status === 'selected' && choice.selectedInternalId) {
    selectedCard = generated.cards.find((c) => c.internalId === choice.selectedInternalId);
    const compiled = compileDesignSpec({ input, card: selectedCard, route, policy, choice });
    if (!compiled.ok) return { ok: false, stage: 'designspec', problems: compiled.problems };
    spec = compiled.spec;
    const rejected = generated.cards.filter((c) => c.internalId !== selectedCard.internalId);
    handoff = buildHandoffPackage({ input, spec, selectedCard, rejectedCards: rejected });
  }

  return {
    ok: true,
    stage: choice.status === 'selected' ? 'handoff-ready' : choice.status,
    policyVersion: policy.policyVersion,
    inputWarnings: input.warnings,
    route,
    direction: {
      worlds: generated.worlds,
      cards: generated.cards,
      pairwise: generated.pairwise,
      entropy: generated.entropy,
      numericSeed: generated.numericSeed,
    },
    blinding: { independence, key, blinded },
    critic,
    choice,
    designSpec: spec,
    handoff,
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
  node direction-engine/index.mjs run --dir <fixture> [--choose L1] [--ablation taste|uupm|frontend|impeccable|all] [--out <dir>]
  node direction-engine/index.mjs route --dir <fixture>
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
    if (result.handoff?.directionMd) {
      writeFileSync(join(out, 'DIRECTION.md'), result.handoff.directionMd);
    }
    if (result.designSpec) {
      writeFileSync(join(out, 'DESIGNSPEC.json'), JSON.stringify(result.designSpec, null, 2));
    }
    if (result.handoff) {
      writeFileSync(join(out, 'HANDOFF.json'), JSON.stringify(result.handoff, null, 2));
    }
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
    cards: result.direction.cards.map((c) => c.worldId),
    pairwisePass: result.direction.pairwise.every((p) => p.pass),
    critic: {
      rejectAll: result.critic.rejectAll,
      tie: result.critic.tie,
      recommendation: result.critic.recommendation,
    },
    choice: result.choice,
    handoffReady: Boolean(result.handoff),
  }, null, 2));
}

const thisFile = fileURLToPath(import.meta.url);
const invokedAsCli = Boolean(process.argv[1])
  && pathToFileURL(resolve(process.argv[1])).href === pathToFileURL(thisFile).href;

if (invokedAsCli) {
  main(process.argv.slice(2));
}
