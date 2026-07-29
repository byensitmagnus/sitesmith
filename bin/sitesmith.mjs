#!/usr/bin/env node
/**
 * The product layer. Original work, MIT.
 *
 *   node bin/sitesmith.mjs install [--to <dir>] [--provider claude|codex|cursor|all]
 *   node bin/sitesmith.mjs update  [--to <dir>]
 *   node bin/sitesmith.mjs doctor  [--to <dir>]
 *   node bin/sitesmith.mjs pack    --provider <p> --out <dir>
 *
 * A skill nobody can install is a repository. This is the one command that puts SiteSmith
 * where an agent will find it, the one that refreshes it, and the one that says whether the
 * machine can actually run the gates — because "it didn't work" almost always means Playwright
 * is missing, and the honest answer is to say so by name.
 *
 * Provider packs are **generated from PIPELINE.json**, never hand-written. The pipeline is the
 * single source of truth for what the commands are and what each step reads, produces and
 * gates on; three hand-maintained copies of that would drift apart within a week, and the drift
 * would be invisible until someone followed the wrong one.
 */

import { readFile, writeFile, mkdir, readdir, stat, rm, cp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join, dirname, relative } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SKILL = join(ROOT, 'skills/sitesmith');

const args = process.argv.slice(2);
const cmd = args[0];
const flag = (n, d = null) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 && i + 1 < args.length && !args[i + 1].startsWith('--') ? args[i + 1] : d;
};
const has = (n) => args.includes(`--${n}`);

/* Where each provider looks. A pack that lands anywhere else is a file, not an install. */
const PROVIDERS = {
  claude: { dir: '.claude/skills/sitesmith', entry: 'SKILL.md',
            what: 'Claude Code reads SKILL.md frontmatter to decide when to load a skill.' },
  codex:  { dir: '.agents/skills/sitesmith', entry: 'AGENTS.md',
            what: 'Codex reads AGENTS.md; the pack generates it from the same pipeline.' },
  cursor: { dir: '.cursor/rules/sitesmith', entry: 'sitesmith.mdc',
            what: 'Cursor reads .mdc rule files with frontmatter globs.' },
};

const say = (s = '') => console.log(s);
const sha = (b) => createHash('sha256').update(b).digest('hex');

async function walk(dir, base = dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '__pycache__' || e.name.startsWith('.')) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) await walk(full, base, out);
    else out.push(relative(base, full).replace(/\\/g, '/'));
  }
  return out;
}

/* ── doctor ───────────────────────────────────────────────────────────────
   Names what is missing rather than reporting that something went wrong. */
async function doctor(target) {
  const rows = [];
  const add = (name, ok, detail) => rows.push({ name, ok, detail });

  const node = process.versions.node;
  add('node', Number(node.split('.')[0]) >= 20, `${node} — 20 or newer`);

  let pw = null;
  for (const p of [join(ROOT, 'benchmarks/node_modules/playwright'), join(target ?? '.', 'node_modules/playwright')]) {
    if (existsSync(p)) { pw = p; break; }
  }
  add('playwright', Boolean(pw), pw ? relative(ROOT, pw).replace(/\\/g, '/') || pw
    : 'not found — `npm i -D playwright && npx playwright install chromium`');

  if (pw) {
    const r = spawnSync(process.execPath, ['-e',
      'import("playwright").then(m=>m.chromium.launch()).then(b=>b.close()).then(()=>console.log("ok"),e=>{console.error(String(e).split("\\n")[0]);process.exit(1)})'],
      { cwd: dirname(dirname(pw)), encoding: 'utf8', timeout: 60000 });
    add('chromium', r.status === 0, r.status === 0 ? 'launches'
      : 'installed but will not launch — `npx playwright install chromium`');
  } else add('chromium', false, 'cannot check without playwright');

  const axe = existsSync(join(dirname(pw ?? ''), 'axe-core')) ||
              existsSync(join(ROOT, 'benchmarks/node_modules/axe-core'));
  add('axe-core', axe, axe ? 'present' : 'not found — the accessibility gate cannot run');

  add('git', spawnSync('git', ['--version'], { encoding: 'utf8' }).status === 0,
    'used to record what a run was built from');

  /* An image provider is optional and the engine says so. Reporting its absence as a failure
     would be wrong: the ladder's first two rungs spend nothing and need no provider at all. */
  add('image provider', true,
    'optional — see v2/26-visual-assets.md. Without one, the run writes ASSET-REQUESTS.md ' +
    'and stays a draft rather than inventing pictures.');

  say('\n  sitesmith doctor\n');
  for (const r of rows) say(`  ${r.ok ? 'ok  ' : 'MISS'}  ${r.name.padEnd(15)} ${r.detail}`);
  const bad = rows.filter((r) => !r.ok);
  say(`\n  ${bad.length ? `${bad.length} thing(s) missing — the gates above them cannot run`
                        : 'everything the gates need is here'}\n`);
  return bad.length ? 1 : 0;
}

/* ── packs ────────────────────────────────────────────────────────────────
   Generated from PIPELINE.json. Editing a pack by hand is how three copies drift. */
async function buildPack(provider, outDir) {
  const p = JSON.parse(await readFile(join(SKILL, 'PIPELINE.json'), 'utf8'));
  const cmds = Object.entries(p.commands).filter(([k]) => !k.startsWith('$'));
  const step = (id) => p.steps.find((s) => s.id === id);

  const body = [
    '# SiteSmith',
    '',
    '> Generated from `PIPELINE.json`. Do not edit — regenerate with',
    '> `node bin/sitesmith.mjs pack --provider ' + provider + ' --out <dir>`.',
    '',
    'Design, build, audit and polish websites that do not look AI-generated.',
    '',
    '## Always loaded',
    '',
    ...p.alwaysLoaded.map((f) => `- \`${f}\``),
    '',
    'Everything else is read when its step runs. Loading the whole skill up front is how a',
    'skill becomes a context tax rather than a tool.',
    '',
    '## Commands',
    '',
    '| command | steps | what it produces |',
    '| --- | --- | --- |',
    ...cmds.map(([name, c]) => `| \`${name}\` | ${c.steps.join(' → ')} | ${c.summary} |`),
    '',
    '## Steps',
    '',
  ];
  for (const s of p.steps) {
    body.push(`### ${s.id} — ${s.name}`, '',
      `**Reads.** ${(s.reads ?? []).map((r) => `\`${r}\``).join(', ') || '—'}`, '',
      `**Produces.** ${(s.produces ?? []).map((r) => `\`${r}\``).join(', ') || '—'}`, '',
      `**Gate.** ${s.gate ? `\`${s.gate}\`` : 'none — this step is judgement, and the next gate catches it'}`, '',
      s.note ? `${s.note}` : '', '');
  }
  if (p.principles) {
    body.push('## Where this comes from', '',
      typeof p.principles === 'string' ? p.principles : JSON.stringify(p.principles, null, 2), '');
  }

  const head = {
    claude: `---\nname: sitesmith\ndescription: >-\n  Design, build, redesign, audit and polish websites and web apps that do not look\n  AI-generated. Triggers on: build a website, make a landing page, design a page, redesign\n  this, make it look better, this looks generic, pick a style, design review, UI audit.\n---\n\n`,
    codex: `# AGENTS.md — SiteSmith\n\n`,
    cursor: `---\ndescription: SiteSmith — build websites that do not look AI-generated\nglobs: ["**/*.html","**/*.css","**/*.tsx","**/*.jsx","**/*.vue","**/*.astro"]\nalwaysApply: false\n---\n\n`,
  }[provider];

  await mkdir(outDir, { recursive: true });
  const file = join(outDir, PROVIDERS[provider].entry);
  await writeFile(file, head + body.filter((l) => l !== undefined).join('\n'));
  return file;
}

/* ── install ──────────────────────────────────────────────────────────────
   Copies the skill, then generates the provider entry point on top of it. */
async function install(target, providers, { quiet = false } = {}) {
  const files = await walk(SKILL);
  const manifest = {};
  for (const [name, cfg] of Object.entries(PROVIDERS)) {
    if (!providers.includes(name)) continue;
    const dest = join(target, cfg.dir);
    await rm(dest, { recursive: true, force: true });
    await mkdir(dest, { recursive: true });
    for (const f of files) {
      await mkdir(dirname(join(dest, f)), { recursive: true });
      await cp(join(SKILL, f), join(dest, f));
    }
    const entry = await buildPack(name, dest);
    manifest[name] = { dir: cfg.dir, entry: relative(target, entry).replace(/\\/g, '/'),
                       files: files.length + 1 };
    if (!quiet) say(`  ${name.padEnd(7)} → ${cfg.dir}  (${files.length + 1} files)`);
  }
  /* The gates need playwright and axe-core, and the installer used to place neither, so a
     fresh project ran verify, read 'axe violations: not run', and shipped. verify now fails
     closed on that, and this puts the pinned manifest where one npm command fixes it. */
  const deps = JSON.parse(await readFile(join(SKILL, 'scripts/package.json'), 'utf8'));
  const pinned = Object.entries(deps.devDependencies).map(([k, v]) => `${k}@${v}`);
  await writeFile(join(target, 'sitesmith-gates.package.json'),
    JSON.stringify(deps, null, 2) + '\n');
  if (!quiet) {
    say('');
    say('  the gates need these, pinned in sitesmith-gates.package.json:');
    say(`    npm i -D ${pinned.join(' ')} && npx playwright install chromium`);
    say('  verify.mjs fails closed without axe-core, so an unchecked page will not pass.');
  }

  await writeFile(join(target, '.sitesmith-install.json'),
    JSON.stringify({ installed: providers, manifest,
      skillFiles: Object.fromEntries(await Promise.all(
        files.map(async (f) => [f, sha(await readFile(join(SKILL, f))).slice(0, 16)]))) },
      null, 2) + '\n');
  return manifest;
}

/* ── run ──────────────────────────────────────────────────────────────────── */
const target = flag('to', process.cwd() === ROOT ? homedir() : process.cwd());

if (cmd === 'doctor') {
  process.exit(await doctor(target));
} else if (cmd === 'install' || cmd === 'update') {
  const want = flag('provider', 'all');
  const providers = want === 'all' ? Object.keys(PROVIDERS) : want.split(',').map((s) => s.trim());
  const bad = providers.filter((p) => !PROVIDERS[p]);
  if (bad.length) { console.error(`unknown provider: ${bad.join(', ')}`); process.exit(2); }

  say(`\n  sitesmith ${cmd} → ${target}\n`);
  await install(target, providers);
  say(`\n  ${cmd === 'install' ? 'installed' : 'updated'}. Each pack's entry point is generated ` +
      'from PIPELINE.json, so the three cannot drift.\n');
  if (!has('no-doctor')) await doctor(target);
} else if (cmd === 'pack') {
  const provider = flag('provider');
  const out = flag('out');
  if (!PROVIDERS[provider] || !out) {
    console.error('usage: sitesmith.mjs pack --provider claude|codex|cursor --out <dir>');
    process.exit(2);
  }
  say(await buildPack(provider, out));
} else {
  console.error(`usage:
  sitesmith.mjs install [--to <dir>] [--provider claude|codex|cursor|all] [--no-doctor]
  sitesmith.mjs update  [--to <dir>]
  sitesmith.mjs doctor  [--to <dir>]
  sitesmith.mjs pack    --provider <p> --out <dir>`);
  process.exit(2);
}
