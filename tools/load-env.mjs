/**
 * Thin tools-side wrapper around direction-engine load-local-env.
 * Prefer importing load-local-env directly from engine code.
 */
import {
  loadLocalEnv,
  ensureCreativeEnv,
  creativeKeyPresence,
  parseEnvText,
} from '../skills/sitesmith/scripts/direction-engine/load-local-env.mjs';

/** @deprecated use ensureCreativeEnv / loadLocalEnv — kept for older call sites */
export function loadEnvFiles(cwd = process.cwd()) {
  const r = loadLocalEnv({
    startDir: cwd,
    fileNames: ['.env.local', '.env', '.env.xai'],
  });
  return r.loadedFiles.map((p) => p.split(/[/\\]/).pop());
}

export function hasCreativeApiKey() {
  ensureCreativeEnv();
  return creativeKeyPresence().anyKey;
}

export { loadLocalEnv, ensureCreativeEnv, creativeKeyPresence, parseEnvText };
