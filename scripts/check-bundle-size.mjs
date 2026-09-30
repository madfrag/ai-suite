#!/usr/bin/env node
// Bundle-size budget gate.
//
// Why this exists as a hand-rolled script rather than a marketplace action:
// third-party tools like `nextjs-bundle-analysis` parse Next's internal build
// manifest (.next/app-build-manifest.json), which this Next.js version no
// longer produces in that shape — and `next build`'s own stdout no longer
// prints a First Load JS table either. Both were verified empty/missing
// against this exact Next version before writing this. Reading the actual
// files Next ships to the browser (.next/static/chunks/**/*.js) is the one
// thing that can't silently drift out of sync with Next's internals.
//
// This measures total shipped client JS across the whole app (all routes
// combined), not true per-route "first load JS" — Next doesn't expose a
// stable, version-proof way to get that breakdown right now. It's a coarser
// signal, but a real one: a new heavy dependency moves this number.

import { gzipSync } from 'node:zlib';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const CHUNKS_DIR = '.next/static/chunks';
// ~350KB compressed JS is the commonly cited budget for a usable experience
// on a median global device/connection (Alex Russell, "The Performance
// Inequality Gap"). Current measured total here is ~270KB — this leaves
// deliberate headroom for legitimate growth without being toothless.
const BUDGET_BYTES = 350 * 1024;

function walk(dir) {
  let files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(walk(full));
    else if (entry.name.endsWith('.js')) files.push(full);
  }
  return files;
}

let files;
try {
  files = walk(CHUNKS_DIR);
} catch (err) {
  console.error(`Could not read ${CHUNKS_DIR} — did you run \`npm run build\` first?`);
  console.error(err.message);
  process.exit(1);
}

if (files.length === 0) {
  console.error(`No .js files found under ${CHUNKS_DIR}.`);
  process.exit(1);
}

const sized = files
  .map((file) => ({ file, gzip: gzipSync(readFileSync(file)).length, raw: statSync(file).size }))
  .sort((a, b) => b.gzip - a.gzip);

const totalGzip = sized.reduce((sum, f) => sum + f.gzip, 0);
const totalRaw = sized.reduce((sum, f) => sum + f.raw, 0);

const fmtKB = (bytes) => (bytes / 1024).toFixed(1) + ' KB';

console.log(`Client JS bundle — ${files.length} chunk(s) under ${CHUNKS_DIR}\n`);
console.log('Largest chunks:');
for (const { file, gzip, raw } of sized.slice(0, 10)) {
  console.log(`  ${fmtKB(gzip).padStart(9)} gzip  (${fmtKB(raw).padStart(9)} raw)  ${file}`);
}

const percent = ((totalGzip / BUDGET_BYTES) * 100).toFixed(1);
console.log(`\nTotal:  ${fmtKB(totalGzip)} gzip (${fmtKB(totalRaw)} raw)`);
console.log(`Budget: ${fmtKB(BUDGET_BYTES)} gzip — using ${percent}%`);

if (totalGzip > BUDGET_BYTES) {
  console.error(
    `\n✖ Bundle size ${fmtKB(totalGzip)} exceeds the ${fmtKB(BUDGET_BYTES)} budget by ${fmtKB(totalGzip - BUDGET_BYTES)}.`
  );
  process.exit(1);
}

console.log(`\n✓ Within budget (${fmtKB(BUDGET_BYTES - totalGzip)} to spare).`);
