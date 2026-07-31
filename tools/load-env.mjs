/** Load KEY=VALUE from .env files into process.env (does not override existing). */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export function loadEnvFiles(cwd = process.cwd()) {
  const files = ['.env', '.env.local', '.env.xai'];
  const loaded = [];
  for (const name of files) {
    const p = join(cwd, name);
    if (!existsSync(p)) continue;
    const text = readFileSync(p, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const m = t.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue;
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (process.env[m[1]] == null || process.env[m[1]] === '') process.env[m[1]] = v;
    }
    loaded.push(name);
  }
  return loaded;
}

export function hasCreativeApiKey() {
  return Boolean(process.env.XAI_API_KEY || process.env.GROK_API_KEY);
}
