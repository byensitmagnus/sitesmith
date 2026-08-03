#!/usr/bin/env node
/**
 * What is already installed that I should be building with? Original work, MIT.
 *
 *   node scripts/components.mjs detect [dir]        what this project already has
 *   node scripts/components.mjs plan <need> [dir]   reuse, adapt or write, with the reason
 *   node scripts/components.mjs --json
 *
 * Two upstream ideas, one layer, and the layer exists because both of them are only worth
 * anything conditionally.
 *
 * From `21st.dev Magic`: before writing a component, look for one that exists. Upstream
 * does that against a hosted registry behind an API key. This does it against the project
 * in front of it, because a key is spend, spend needs authorisation, and a check nobody
 * can run is not a check. If the user has shadcn/ui, Radix, MUI or a local component
 * directory, that is the registry, and it is already licensed, already themed and already
 * in the bundle they ship.
 *
 * From `21st.dev Agent Elements`: some products have a conversation in them, and those
 * have a component vocabulary of their own. Routed only when the brief actually asks for
 * one, because an ordinary website that acquires an agent-chat dependency has been sold
 * something.
 *
 * The refusal that makes this safe: nothing here installs anything, and nothing here
 * copies a component whose licence is not on disk. `plan` will say "write it" rather than
 * name a source it cannot prove the terms of. Reuse before invention is a good rule right
 * up until it becomes vendoring somebody's work without their notice.
 *
 * Exit codes: 0 answered, 1 refused, 2 the invocation was wrong.
 */

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const argv = process.argv.slice(2);
const verb = argv[0];
const JSON_OUT = argv.includes('--json');
const positional = argv.filter((a) => !a.startsWith('--'));

if (!['detect', 'plan'].includes(verb)) {
  console.error('usage: components.mjs <detect|plan> [need] [dir] [--json]');
  process.exit(2);
}

const dir = resolve(positional[verb === 'plan' ? 2 : 1] ?? '.');

/* Registries, in the order a project is likely to have adopted them. Each is identified
   by something that cannot be there by accident: a config file it owns, or a dependency
   name plus the directory it installs into. */
const REGISTRIES = [
  {
    id: 'shadcn/ui',
    licence: 'MIT',
    evidence: ['components.json'],
    where: ['components/ui', 'src/components/ui', 'app/components/ui'],
    note: 'components are copied into the project, so they are the project\'s own code and are yours to change',
  },
  { id: 'radix-ui', licence: 'MIT', dep: /^@radix-ui\//, note: 'unstyled primitives; the styling is where the direction lives' },
  { id: 'headlessui', licence: 'MIT', dep: /^@headlessui\//, note: 'unstyled primitives' },
  { id: 'mui', licence: 'MIT', dep: /^@mui\//, note: 'opinionated by design; expect to fight it for a signature' },
  { id: 'mantine', licence: 'MIT', dep: /^@mantine\//, note: 'opinionated by design' },
  { id: 'chakra-ui', licence: 'MIT', dep: /^@chakra-ui\//, note: 'opinionated by design' },
  { id: 'ant-design', licence: 'MIT', dep: /^antd$/, note: 'strongly opinionated; a distinctive page will be a fight' },
  { id: 'bootstrap', licence: 'MIT', dep: /^bootstrap$/, note: 'recognisable at a glance, which is the problem' },
];

/* Agent-interface components. Conditional on the brief, never on the stack: a project can
   have React and no conversation in it, which is most projects. */
const AGENT_UI = {
  id: '21st.dev agent-elements',
  licence: 'MIT',
  dep: /agent-elements/,
  vocabulary: [
    'a transcript that is a log and not a chat bubble, so it can be read after the fact',
    'a composer that says what it will do before it does it',
    'a tool call rendered as a record with a state, not as a spinner',
    'an interruption control that is reachable while the model is talking',
    'an empty state that says what this thing can do, in the product\'s own nouns',
  ],
};

async function readJson(p) {
  try {
    return JSON.parse(await readFile(p, 'utf8'));
  } catch {
    return null;
  }
}

async function detect() {
  const pkg = (await readJson(join(dir, 'package.json'))) ?? {};
  const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
  const names = Object.keys(deps);

  const found = [];
  for (const r of REGISTRIES) {
    const byFile = (r.evidence ?? []).some((f) => existsSync(join(dir, f)));
    const byDep = r.dep ? names.some((n) => r.dep.test(n)) : false;
    if (!byFile && !byDep) continue;
    const where = (r.where ?? []).filter((w) => existsSync(join(dir, w)));
    let count = 0;
    for (const w of where) {
      const files = await readdir(join(dir, w)).catch(() => []);
      count += files.filter((f) => /\.(tsx|jsx|vue|svelte)$/.test(f)).length;
    }
    found.push({ id: r.id, licence: r.licence, via: byFile ? 'config file' : 'dependency', where, components: count, note: r.note });
  }

  const agentUi = names.some((n) => AGENT_UI.dep.test(n));

  /* A local directory of the project's own components counts, and counts first. Nothing
     matches a project's direction better than the components it already wrote. */
  const localDirs = ['components', 'src/components', 'app/components', 'lib/components'];
  const local = [];
  for (const d of localDirs) {
    if (!existsSync(join(dir, d))) continue;
    const files = await readdir(join(dir, d), { withFileTypes: true }).catch(() => []);
    const own = files.filter((f) => f.isFile() && /\.(tsx|jsx|vue|svelte|astro)$/.test(f.name)).map((f) => f.name);
    if (own.length) local.push({ where: d, components: own.length, sample: own.slice(0, 6) });
  }

  return { dir, registries: found, local, agentUi, motion: names.filter((n) => /^(framer-motion|motion)$/.test(n)) };
}

const state = await detect();

if (verb === 'detect') {
  if (JSON_OUT) {
    console.log(JSON.stringify(state, null, 2));
    process.exit(0);
  }
  console.log(`\n  components, in ${state.dir}\n`);
  if (!state.registries.length && !state.local.length) {
    console.log('  nothing installed and no local component directory.');
    console.log('  Write what the page needs. Do not add a library to get three components.\n');
    process.exit(0);
  }
  for (const l of state.local) {
    console.log(`  own       ${l.where}  ${l.components} component(s): ${l.sample.join(', ')}`);
  }
  for (const r of state.registries) {
    console.log(`  library   ${r.id.padEnd(14)} ${r.licence.padEnd(5)} via ${r.via}${r.components ? `, ${r.components} copied in ${r.where.join(', ')}` : ''}`);
    console.log(`            ${r.note}`);
  }
  if (state.agentUi) console.log(`  agent-ui  ${AGENT_UI.id} is installed`);
  if (state.motion.length) console.log(`  motion    ${state.motion.join(', ')} is installed`);
  console.log('');
  process.exit(0);
}

/* plan: the actual decision, in one line, with the reason attached. */
const need = positional[1];
if (!need) {
  console.error('plan needs the thing you are about to build, e.g. "dialog", "tabs", "agent chat"');
  process.exit(2);
}

const AGENT_WORDS = /(agent|chat|assistant|conversation|transcript|copilot|prompt)/i;
const wantsAgentUi = AGENT_WORDS.test(need);

const own = state.local.find((l) => l.sample.some((f) => f.toLowerCase().includes(need.toLowerCase().slice(0, 6))));
const lib = state.registries[0];

const decision = (() => {
  if (wantsAgentUi) {
    if (state.agentUi) {
      return {
        verdict: 'reuse',
        what: AGENT_UI.id,
        why: 'the brief asks for an agent interface and the package is already a dependency, so its components are already licensed and already shipped',
        adapt: 'restyle to the direction record before using: these arrive with their own look, and their own look is not the client\'s',
      };
    }
    return {
      verdict: 'write',
      what: 'the agent surface, by hand',
      why: 'the brief asks for an agent interface and no agent-component package is installed. Adding one is a dependency decision, not a design one, and it belongs to whoever maintains this project',
      adapt: `build against this vocabulary rather than a chat metaphor:\n           - ${AGENT_UI.vocabulary.join('\n           - ')}`,
    };
  }
  if (own) {
    return {
      verdict: 'reuse',
      what: `${own.where}, the project's own`,
      why: 'the project already wrote one, so it already matches the project',
      adapt: 'change it in place if the direction needs it; do not add a second one beside it',
    };
  }
  if (lib) {
    return {
      verdict: 'adapt',
      what: lib.id,
      why: `${lib.id} is already a dependency under ${lib.licence}, so the primitive is free and the styling is the work`,
      adapt: 'take the behaviour and the accessibility, replace the appearance with the direction record\'s. A library\'s default look is the fastest way to a page that looks like everyone else\'s',
    };
  }
  return {
    verdict: 'write',
    what: `${need}, by hand`,
    why: 'nothing is installed. Adding a component library to get one component is a dependency the client maintains forever',
    adapt: 'plain HTML and CSS, with the states from verify.md',
  };
})();

if (JSON_OUT) {
  console.log(JSON.stringify({ need, ...decision, detected: state }, null, 2));
  process.exit(0);
}

console.log(`\n  ${need}\n`);
console.log(`  ${decision.verdict.toUpperCase()}  ${decision.what}`);
console.log(`         ${decision.why}`);
console.log(`         ${decision.adapt}`);
console.log('\n  Nothing was installed and nothing was copied. Licence terms travel with any code you take.\n');
process.exit(0);
