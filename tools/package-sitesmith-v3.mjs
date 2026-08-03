#!/usr/bin/env node
/**
 * Build the two distributable SiteSmith v3 ZIP archives from one canonical source.
 *
 *   node tools/package-sitesmith-v3.mjs
 *
 * Outputs:
 *   dist/sitesmith-v3.zip       full source package, including package tests
 *   dist/sitesmith-install.zip  user install package, excluding package-only tests
 *   dist/SHA256SUMS              integrity hashes for both archives
 *
 * No npm dependency is used. The ZIP writer intentionally stores files without
 * compression so identical source bytes produce identical archives on Node 20 across
 * operating systems. The package is small enough that reproducibility matters more than
 * saving a few hundred kilobytes.
 */

import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, posix } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCE = join(ROOT, 'skills', 'sitesmith-v3');
const DIST = join(ROOT, 'dist');
const FIXED_DOS_TIME = 0;
const FIXED_DOS_DATE = 33; // 1980-01-01, the first date representable by ZIP.

if (!existsSync(join(SOURCE, 'SKILL.md'))) {
  console.error(`Missing canonical source: ${join(SOURCE, 'SKILL.md')}`);
  process.exit(2);
}

const SKIP_DIRS = new Set(['node_modules', '.git', '.sitesmith', '__pycache__']);
const INSTALL_SKIP = /^(?:test-.*\.mjs|.*\.log)$/;

async function collect(dir, base = dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await collect(full, base, out);
    } else {
      out.push({
        absolute: full,
        relative: relative(base, full).replace(/\\/g, '/'),
        mode: (await stat(full)).mode,
      });
    }
  }
  return out;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function u16(value) {
  const out = Buffer.allocUnsafe(2);
  out.writeUInt16LE(value & 0xffff, 0);
  return out;
}

function u32(value) {
  const out = Buffer.allocUnsafe(4);
  out.writeUInt32LE(value >>> 0, 0);
  return out;
}

async function buildZip({ name, rootName, filter = () => true }) {
  const files = (await collect(SOURCE))
    .filter(({ relative: path }) => filter(path))
    .sort((a, b) => a.relative.localeCompare(b.relative));

  const local = [];
  const central = [];
  let offset = 0;

  for (const file of files) {
    const data = await readFile(file.absolute);
    const path = Buffer.from(posix.join(rootName, file.relative), 'utf8');
    const crc = crc32(data);

    const localHeader = Buffer.concat([
      u32(0x04034b50),
      u16(20),       // version needed
      u16(0x0800),   // UTF-8 filename
      u16(0),        // store, no compression
      u16(FIXED_DOS_TIME),
      u16(FIXED_DOS_DATE),
      u32(crc),
      u32(data.length),
      u32(data.length),
      u16(path.length),
      u16(0),
      path,
    ]);

    local.push(localHeader, data);

    const unixMode = (file.mode & 0o111) ? 0o100755 : 0o100644;
    central.push(Buffer.concat([
      u32(0x02014b50),
      u16((3 << 8) | 20), // made by Unix, ZIP 2.0
      u16(20),
      u16(0x0800),
      u16(0),
      u16(FIXED_DOS_TIME),
      u16(FIXED_DOS_DATE),
      u32(crc),
      u32(data.length),
      u32(data.length),
      u16(path.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(unixMode << 16),
      u32(offset),
      path,
    ]));

    offset += localHeader.length + data.length;
  }

  const centralBuffer = Buffer.concat(central);
  const archive = Buffer.concat([
    ...local,
    centralBuffer,
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(files.length),
    u16(files.length),
    u32(centralBuffer.length),
    u32(offset),
    u16(0),
  ]);

  await mkdir(DIST, { recursive: true });
  const output = join(DIST, name);
  await writeFile(output, archive);

  return {
    output,
    name,
    files: files.length,
    bytes: archive.length,
    sha256: createHash('sha256').update(archive).digest('hex'),
  };
}

const source = await buildZip({
  name: 'sitesmith-v3.zip',
  rootName: 'sitesmith-v3',
});

const install = await buildZip({
  name: 'sitesmith-install.zip',
  rootName: 'sitesmith',
  filter: (path) => !INSTALL_SKIP.test(path.split('/').at(-1)),
});

await writeFile(
  join(DIST, 'SHA256SUMS'),
  [source, install].map((item) => `${item.sha256}  ${item.name}`).join('\n') + '\n',
);

for (const item of [source, install]) {
  console.log(
    `${relative(ROOT, item.output).replace(/\\/g, '/')}: ` +
    `${item.files} files, ${item.bytes} bytes, sha256 ${item.sha256}`,
  );
}
