/**
 * Load KEY=VALUE pairs from local .env files into process.env.
 * Never overwrites existing env. Never logs values. Original work, MIT.
 *
 * Search order (first file wins per key; already-set process.env always wins):
 *   1. SITESMITH_ENV_FILE (absolute or cwd-relative path)
 *   2. <startDir>/.env.local
 *   3. <startDir>/.env
 *   4. walk up to repo root markers (package.json + .git) for the same names
 *
 * Only loads plain assignments. Skips export keyword, comments, blank lines,
 * and quoted values have surrounding quotes stripped. Does not expand ${VAR}.
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';

const DEFAULT_NAMES = ['.env.local', '.env', '.env.xai'];
const ROOT_MARKERS = ['.git', 'package.json'];

function stripQuotes(v) {
  const s = String(v).trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

/**
 * Parse .env body → { key: value } (no mutations).
 * @param {string} text
 * @returns {Record<string, string>}
 */
export function parseEnvText(text) {
  const out = {};
  for (const rawLine of String(text ?? '').split(/\r?\n/)) {
    let line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith('export ')) line = line.slice(7).trim();
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
    out[key] = stripQuotes(line.slice(eq + 1));
  }
  return out;
}

function findRepoRoot(startDir) {
  let dir = resolve(startDir);
  for (let i = 0; i < 12; i += 1) {
    if (ROOT_MARKERS.some((m) => existsSync(join(dir, m)))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return resolve(startDir);
}

/**
 * Collect candidate .env file paths (may not exist).
 * @param {{ startDir?: string, fileNames?: string[] }} [opts]
 * @returns {string[]}
 */
export function envFileCandidates(opts = {}) {
  const startDir = resolve(opts.startDir ?? process.cwd());
  const names = opts.fileNames ?? DEFAULT_NAMES;
  const paths = [];
  const explicit = process.env.SITESMITH_ENV_FILE?.trim();
  if (explicit) {
    paths.push(isAbsolute(explicit) ? explicit : resolve(startDir, explicit));
  }
  for (const n of names) paths.push(join(startDir, n));
  const root = findRepoRoot(startDir);
  if (root !== startDir) {
    for (const n of names) paths.push(join(root, n));
  }
  // de-dupe preserve order
  const seen = new Set();
  return paths.filter((p) => {
    if (seen.has(p)) return false;
    seen.add(p);
    return true;
  });
}

/**
 * Load local env files into process.env (fill-only).
 * @param {{ startDir?: string, fileNames?: string[], onlyKeys?: string[]|null }} [opts]
 * @returns {{ loadedFiles: string[], setKeys: string[], skippedExisting: string[] }}
 */
export function loadLocalEnv(opts = {}) {
  const onlyKeys = opts.onlyKeys ?? null;
  const loadedFiles = [];
  const setKeys = [];
  const skippedExisting = [];
  const assigned = new Set();

  for (const file of envFileCandidates(opts)) {
    if (!existsSync(file)) continue;
    let text;
    try {
      text = readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    const parsed = parseEnvText(text);
    let used = false;
    for (const [key, value] of Object.entries(parsed)) {
      if (onlyKeys && !onlyKeys.includes(key)) continue;
      if (process.env[key] != null && String(process.env[key]).length > 0) {
        if (!skippedExisting.includes(key)) skippedExisting.push(key);
        continue;
      }
      if (assigned.has(key)) continue;
      process.env[key] = value;
      assigned.add(key);
      setKeys.push(key);
      used = true;
    }
    if (used || Object.keys(parsed).length > 0) loadedFiles.push(file);
  }

  return { loadedFiles, setKeys, skippedExisting };
}

/** Keys used by the LLM creative pass (presence-only reporting). */
export const CREATIVE_ENV_KEYS = ['XAI_API_KEY', 'GROK_API_KEY', 'SITESMITH_CREATIVE_MODEL'];

/**
 * Ensure creative-related keys are loaded from local .env if present.
 * Safe to call repeatedly.
 * @param {{ startDir?: string }} [opts]
 */
export function ensureCreativeEnv(opts = {}) {
  return loadLocalEnv({
    startDir: opts.startDir,
    onlyKeys: CREATIVE_ENV_KEYS,
  });
}

/**
 * Presence-only probe (never returns secret values).
 * @returns {{ XAI_API_KEY: boolean, GROK_API_KEY: boolean, SITESMITH_CREATIVE_MODEL: boolean, anyKey: boolean }}
 */
export function creativeKeyPresence() {
  const xai = Boolean(process.env.XAI_API_KEY?.trim());
  const grok = Boolean(process.env.GROK_API_KEY?.trim());
  return {
    XAI_API_KEY: xai,
    GROK_API_KEY: grok,
    SITESMITH_CREATIVE_MODEL: Boolean(process.env.SITESMITH_CREATIVE_MODEL?.trim()),
    anyKey: xai || grok,
  };
}
