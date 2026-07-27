/**
 * A ten-line glob, so the tools run on Node 18. Original work, MIT.
 *
 * `fs/promises.glob` arrived in Node 22. Depending on it made the checker crash
 * on the CI runner while passing on the machine it was written on, which is the
 * same class of bug the benchmarks exist to catch. Supports `*` within a single
 * path segment, which is all these patterns need.
 */

import { readdir } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';

const SKIP = new Set(['.git', 'node_modules', '.sitesmith', '__pycache__']);

async function walk(dir, base, out) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (SKIP.has(e.name)) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) await walk(full, base, out);
    else out.push(full.slice(base.length + 1).split(sep).join('/'));
  }
  return out;
}

function toRegExp(pattern) {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*');
  return new RegExp(`^${escaped}$`);
}

/** Resolve patterns against `root`, returning repo-relative POSIX paths, sorted. */
export async function expand(patterns, root) {
  const base = resolve(root);
  const literal = patterns.filter((p) => !p.includes('*'));
  const globs = patterns.filter((p) => p.includes('*')).map(toRegExp);
  if (!globs.length) return [...new Set(literal)].sort();

  const all = await walk(base, base, []);
  const matched = all.filter((f) => globs.some((rx) => rx.test(f)));
  return [...new Set([...literal, ...matched])].sort();
}
