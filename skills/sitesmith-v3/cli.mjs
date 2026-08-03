#!/usr/bin/env node
/**
 * The installed skill's own command line. Original work, MIT.
 *
 *   node <skill>/cli.mjs init | recommend | build | inspect | redesign | audit | verify
 *
 * The skill ships with its scripts and its knowledge index, so the seven commands work
 * from an installed copy with no repository behind it. `bin/sitesmith.mjs` in the
 * development repository imports the same router, so there is one implementation.
 */

import { fileURLToPath } from 'node:url';
import { route, usage } from './commands.mjs';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const args = process.argv.slice(2);
const cmd = args[0];

const code = await route(cmd, { root: ROOT, argv: args.slice(1) });
if (code !== null) process.exit(code);

console.log(usage());
process.exit(cmd === undefined || /^(--help|-h|help)$/.test(cmd) ? 0 : 2);
