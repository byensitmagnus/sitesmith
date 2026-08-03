#!/usr/bin/env node
/**
 * The product layer. Original work, MIT.
 *
 *   node bin/sitesmith.mjs install [--to <dir>] [--provider claude|codex|cursor|openai|all]
 *   node bin/sitesmith.mjs update  [--to <dir>]
 *   node bin/sitesmith.mjs doctor  [--to <dir>]
 *   node bin/sitesmith.mjs pack    --provider <p> --out <dir>
 *
 * A skill nobody can install is a repository. This is the one command that puts SiteSmith
 * where an agent will find it, the one that refreshes it, and the one that says whether the
 * machine can actually run the gates — because "it didn't work" almost always means Playwright
 * is missing, and the honest answer is to say so by name.
 *
 * Provider packs are **generated from product/pipeline.json**, never hand-written, and never
 * from anywhere else. One file is the journey. Four hand-maintained copies of it drift apart
 * within a week and the drift is invisible until someone follows the wrong one.
 *
 * Everything below marked v2 is history. It is reachable only through `--legacy-v2`, and the
 * code that reads skills/sitesmith/PIPELINE.json is kept for that route alone.
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

/* v2 only. The current provider table lives in tools/provider-pack.mjs and is read from
   product/pipeline.json; this one is reached only through --legacy-v2. */
const PROVIDERS = {
  claude: { dir: '.claude/skills/sitesmith', entry: 'SKILL.md',
            what: 'Claude Code reads SKILL.md frontmatter to decide when to load a skill.' },
  codex:  { dir: '.agents/skills/sitesmith', entry: 'AGENTS.md',
            what: 'Codex reads AGENTS.md; the pack generates it from the same pipeline.' },
  cursor: { dir: '.cursor/rules/sitesmith', entry: 'sitesmith.mdc',
            what: 'Cursor reads .mdc rule files with frontmatter globs.' },
};

let installFailed = false;
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
async function doctor(target, { onlyTarget = false } = {}) {
  const rows = [];
  const add = (name, ok, detail) => rows.push({ name, ok, detail });

  const node = process.versions.node;
  add('node', Number(node.split('.')[0]) >= 20, `${node} — 20 or newer`);

  /* The target first, and when a target was named, only the target.
     This looked in this repository's benchmarks/node_modules first, so `doctor --to <empty
     dir>` reported every gate ready by finding a copy that the target could never load.
     Doctor answers one question: can the gates run where you are about to run them. When
     nobody names a where, falling back to the repository's own copy is right, because that
     is the repository checking itself. */
  const candidates = onlyTarget
    ? [join(target ?? '.', 'node_modules/playwright')]
    : [join(target ?? '.', 'node_modules/playwright'), join(ROOT, 'benchmarks/node_modules/playwright')];
  let pw = null;
  for (const p of candidates) {
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

  /* Ask the question verify.mjs asks, by the specifier verify.mjs uses.
     This used to test whether an `axe-core` directory existed. axe-core is a transitive
     dependency of the wrapper, so it is on disk in projects where '@axe-core/playwright'
     is not, and doctor reported the accessibility gate ready in exactly the case where it
     could not run. A readiness check that resolves a different name than the thing it is
     vouching for is not a check. */
  const axe = spawnSync(process.execPath, ['-e',
    'require.resolve("@axe-core/playwright");require.resolve("axe-core");console.log("ok")'],
    { cwd: pw ? dirname(dirname(pw)) : (target ?? '.'), encoding: 'utf8' });
  add('@axe-core/playwright', axe.status === 0, axe.status === 0
    ? 'resolves, and so does the axe-core engine under it'
    : 'not resolvable — verify.mjs skips the accessibility scan, and fails closed rather than passing');

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

/* ── packs, v2 ────────────────────────────────────────────────────────────
   Generated from skills/sitesmith/PIPELINE.json, which is the legacy pipeline. The current
   one is product/pipeline.json and tools/provider-pack.mjs renders it. */
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
    `**Default journey:** ${p.defaultJourney.join(' → ')}`,
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
  for (const s of p.steps.filter((item) => item.scope !== 'lab')) {
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
  /* The gates need playwright and @axe-core/playwright, and the installer used to place
     neither, so a fresh project ran verify, read 'axe violations: not run', and shipped.
     verify fails closed on that now. But printing the npm command and trusting someone to
     run it is the same bet one step later: the pinned manifest was written, the command was
     printed, and the project still had no axe. So it installs them. */
  const deps = JSON.parse(await readFile(join(SKILL, 'scripts/package.json'), 'utf8'));
  const pinned = Object.entries(deps.devDependencies).map(([k, v]) => `${k}@${v}`);
  await writeFile(join(target, 'sitesmith-gates.package.json'),
    JSON.stringify(deps, null, 2) + '\n');

  if (has('no-deps')) {
    if (!quiet) {
      say('');
      say('  --no-deps: the gates are not installed. Without them verify cannot check');
      say('  accessibility, and it will fail closed rather than pass an unchecked page:');
      say(`    npm i -D ${pinned.join(' ')} && npx playwright install chromium`);
    }
    return manifest;
  }

  if (!quiet) say(`\n  installing the pinned gate dependencies into ${target}`);
  /* npm is a .cmd on Windows, and since Node 20 spawning a .cmd without a shell fails with
     EINVAL by design. The first version passed an args array with shell:true, which works but
     concatenates rather than escapes (DEP0190); dropping shell:true then installed nothing at
     all, silently, which is worse. Both are avoided by handing the shell one already-safe
     string: every argument here is a literal or a `name@version`, and the only path involved
     is cwd, which is passed out of band. */
  const run = (line) => spawnSync(line, {
    cwd: target, encoding: 'utf8', shell: true,
    stdio: quiet ? 'ignore' : 'inherit',
  });

  const r = run(`npm install --save-dev --no-audit --no-fund ${pinned.join(' ')}`);
  const b = r.status === 0 ? run('npx playwright install chromium') : { status: 1 };

  /* Then check, rather than trust the exit code. An install that reports success and leaves
     the target unable to resolve what verify imports is the exact failure this change exists
     to stop, so the last word goes to the resolver rather than to npm. */
  const resolves = spawnSync(process.execPath, ['-e',
    Object.keys(deps.devDependencies).map((d) => `require.resolve(${JSON.stringify(d)})`).join(';')],
    { cwd: target, encoding: 'utf8' }).status === 0;

  if (!resolves) {
    say('');
    say(`  the gate dependencies did not install into ${target}` +
        (r.status === 0 ? '.' : ` (npm exited ${r.status}).`));
    say('  run this there, and every gate will work:');
    say(`    npm i -D ${pinned.join(' ')} && npx playwright install chromium`);
    installFailed = true;
    return manifest;
  }
  if (b.status !== 0 && !quiet) {
    say('\n  chromium did not download; everything else resolves. `npx playwright install chromium`');
  }
  if (!quiet) say(`\n  gate dependencies resolve in ${target}: ${pinned.join(', ')}`);

  await writeFile(join(target, '.sitesmith-install.json'),
    JSON.stringify({ installed: providers, manifest,
      skillFiles: Object.fromEntries(await Promise.all(
        files.map(async (f) => [f, sha(await readFile(join(SKILL, f))).slice(0, 16)]))) },
      null, 2) + '\n');
  return manifest;
}

/* ── run ──────────────────────────────────────────────────────────────────── */
const target = flag('to', process.cwd() === ROOT ? homedir() : process.cwd());

/* The seven product commands live in commands.mjs and share one router there. This file
   keeps the four that put the skill on a machine. One entry point, so there is one command
   to learn. */
{
  const { route, usage } = await import('../skills/sitesmith-v3/commands.mjs');
  const code = await route(cmd, { root: ROOT, argv: args.slice(1) });
  if (code !== null) process.exit(code);
  if (cmd === undefined || cmd === '--help' || cmd === '-h' || cmd === 'help') {
    say(usage());
    process.exit(0);
  }
}

/* A normal install is v3, and it goes through the installer that knows v3, with the
   provider packs generated from product/pipeline.json. v2 is history and explicit legacy
   support: it is reachable, it is labelled, and it is never what someone gets by default.
   Before this, `install` without a flag delegated to v3 while `install --provider` still
   read v2's PIPELINE.json, so no provider pack anyone received came from the current
   contract. */
if ((cmd === 'install' || cmd === 'update') && !has('legacy-v2')) {
  const { spawnSync } = await import('node:child_process');
  const passthrough = args.slice(1).filter((a, i, all) =>
    a === '--to' || all[i - 1] === '--to' || a === '--provider' || all[i - 1] === '--provider'
    || a === '--force' || a === '--dry-run');
  const r = spawnSync(process.execPath,
    [join(ROOT, 'tools/install-sitesmith.mjs'), ...passthrough, ...(cmd === 'update' ? ['--force'] : [])],
    { stdio: 'inherit' });
  process.exit(r.status ?? 1);
}

if (cmd === 'doctor') {
  process.exit(await doctor(target, { onlyTarget: args.includes('--to') }));
} else if (cmd === 'install' || cmd === 'update') {
  const want = flag('provider', 'all');
  const providers = want === 'all' ? Object.keys(PROVIDERS) : want.split(',').map((s) => s.trim());
  const bad = providers.filter((p) => !PROVIDERS[p]);
  if (bad.length) { console.error(`unknown provider: ${bad.join(', ')}`); process.exit(2); }

  say(`\n  sitesmith ${cmd} --legacy-v2 → ${target}\n`);
  await install(target, providers);
  say(`\n  ${cmd === 'install' ? 'installed' : 'updated'} the v2 skill. Its packs are generated ` +
      "from skills/sitesmith/PIPELINE.json, which is legacy and defines no current journey.\n");
  const rc = has('no-doctor') ? 0 : await doctor(target, { onlyTarget: args.includes('--to') });
  /* An install that could not place what the gates need has installed nothing usable, and
     reporting that with exit 0 is how CI goes green over a broken environment. */
  process.exit(installFailed ? 1 : rc);
} else if (cmd === 'pack') {
  const provider = flag('provider');
  const out = flag('out');
  /* v2's pack is still reachable behind the same explicit flag as its install, so the two
     legacy routes are named the same way and neither is the default. */
  if (has('legacy-v2')) {
    if (!PROVIDERS[provider] || !out) {
      console.error('usage: sitesmith.mjs pack --legacy-v2 --provider claude|codex|cursor --out <dir>');
      process.exit(2);
    }
    say(await buildPack(provider, out));
  } else {
    const { PROVIDERS: P3, providerNames, loadPipeline, packFiles } = await import('../tools/provider-pack.mjs');
    if (!P3[provider] || !out) {
      console.error(`usage: sitesmith.mjs pack --provider ${providerNames().join('|')} --out <dir>`);
      process.exit(2);
    }
    const files = packFiles(provider, await loadPipeline());
    await mkdir(out, { recursive: true });
    for (const [f, body] of Object.entries(files)) {
      await mkdir(dirname(join(out, f)), { recursive: true });
      await writeFile(join(out, f), body);
      say(join(out, f));
    }
    if (!files[P3[provider].entry]) {
      say(`  entry ${P3[provider].entry} is the skill's own file; install copies it.`);
    }
  }
} else {
  console.error(`usage:
  sitesmith.mjs install [--to <dir>] [--provider claude|codex|cursor|openai|all] [--force]
  sitesmith.mjs update  [--to <dir>]
  sitesmith.mjs doctor  [--to <dir>]
  sitesmith.mjs pack    --provider <p> --out <dir>

legacy, v2 only, never the default:
  sitesmith.mjs install --legacy-v2 [--provider claude|codex|cursor|all] [--no-doctor] [--no-deps]
  sitesmith.mjs pack    --legacy-v2 --provider <p> --out <dir>`);
  process.exit(2);
}
