#!/usr/bin/env node
// Copies the website export of ruarxive-db (data/datasets/site/, schema: docs/SITE_EXPORT.md there)
// into the site.
//
// Usage:
//   node scripts/sync-archive-data.mjs             # local clone at ../ruarxive-db
//   node scripts/sync-archive-data.mjs --db PATH   # local clone elsewhere
//   node scripts/sync-archive-data.mjs --remote    # main branch on GitHub
//   node scripts/sync-archive-data.mjs --remote --ref SHA
//     a specific commit; raw.githubusercontent.com caches branch heads for several minutes
//
// Outputs (both are committed):
//   src/data/archive-stats.json       summary.json with only the largest collections
//   static/data/archive-domains.json  resources.json as is

import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCHEMA_VERSION = 1;
const REMOTE_BASE = 'https://raw.githubusercontent.com/ruarxive/ruarxive-db';
const TOP_COLLECTIONS = 10;

const siteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const statsPath = path.join(siteDir, 'src/data/archive-stats.json');
const domainsPath = path.join(siteDir, 'static/data/archive-domains.json');

function parseArgs(argv) {
  const args = { db: null, remote: false, ref: 'main' };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--db') args.db = argv[++i];
    else if (argv[i] === '--remote') args.remote = true;
    else if (argv[i] === '--ref') args.ref = argv[++i] || 'main';
  }
  if (!args.db && !args.remote) args.db = path.resolve(siteDir, '../ruarxive-db');
  return args;
}

async function readExportFile(args, name) {
  if (args.remote) {
    const url = `${REMOTE_BASE}/${args.ref}/data/datasets/site/${name}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    return res.text();
  }
  const file = path.join(args.db, 'data/datasets/site', name);
  if (!existsSync(file)) {
    throw new Error(`${file} not found: run "python3 site_export.py" in ruarxive-db or use --remote`);
  }
  return fs.readFile(file, 'utf8');
}

function parseExport(text, name) {
  const data = JSON.parse(text);
  if (data.schemaVersion !== SCHEMA_VERSION) {
    throw new Error(`${name}: schemaVersion ${data.schemaVersion}, expected ${SCHEMA_VERSION}`);
  }
  return data;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const summary = parseExport(await readExportFile(args, 'summary.json'), 'summary.json');
  const resourcesText = await readExportFile(args, 'resources.json');
  parseExport(resourcesText, 'resources.json');

  const { collections, ...rest } = summary;
  const stats = { ...rest, topCollections: collections.slice(0, TOP_COLLECTIONS) };

  await fs.mkdir(path.dirname(statsPath), { recursive: true });
  await fs.mkdir(path.dirname(domainsPath), { recursive: true });
  await fs.writeFile(statsPath, JSON.stringify(stats, null, 2) + '\n');
  await fs.writeFile(domainsPath, resourcesText);

  const { totals } = summary;
  console.log(
    `ruarxive-db export of ${summary.generatedAt} (${args.remote ? `GitHub, ${args.ref}` : args.db}): ` +
      `${(totals.bytes / 1e12).toFixed(2)} TB, ${totals.files} files, ${totals.domains} resources, ` +
      `${totals.collections} collections`,
  );
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
