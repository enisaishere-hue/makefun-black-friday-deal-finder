// Bargain Beacon entry for black-friday-deal-finder-01 (Node 22, stdlib only).
//
// The site lives in this repository's app/ folder as plain static files, and
// its screenshots live in screenshots/. This program hands both in: it empties
// the output directory's contents (leaving the directory itself and its own
// permissions untouched), copies app/ and screenshots/ into it, and writes
// dossier.json there with the vendored make.fun library, which the scorer
// rebuilds and compares byte for byte. Keep vendor/makefun-frontend.ts as the
// kit shipped it.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
for (const entry of readdirSync(outDir)) {
  rmSync(join(outDir, entry), { recursive: true, force: true });
}

cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// Caps from the competition's gate: the dossier text is capped at 160 KiB, at
// most 4 screenshots of 256 KiB each, app/ at most 993 entries and 16 MiB.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
