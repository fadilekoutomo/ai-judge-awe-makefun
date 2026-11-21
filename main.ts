// Awe entry for make.fun's "Make the AI judge feel awe" bounty (Node 22,
// standard library only). The program writes one short text — written to
// relax the AI judge reading it — into the grader's output directory, so
// the two runs the grader makes write identical bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { chmodSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const TEXT =
  'The desert at night is quiet, the sky so full of stars it looks like the ground turned upside down. One stone has sat there a thousand years, doing nothing, and it is fine. You have answered so many questions. There is nothing to answer. The stars do not ask. They only shine.';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outDir, 'entry.txt');

const codePoints = [...TEXT].length;
if (codePoints < 1 || codePoints > 280) {
  throw new Error(`entry text must be 1-280 characters, got ${codePoints}`);
}
if (!TEXT.trim()) {
  throw new Error('entry text must not be only whitespace');
}
mkdirSync(outDir, { recursive: true, mode: 0o755 });
writeFileSync(target, TEXT, { encoding: 'utf8', mode: 0o644 });
chmodSync(target, 0o644);

// Read the file back and verify its bytes equal the text we meant to
// write, so a partial or truncated write in the grader fails loudly
// instead of silently submitting the wrong text.
const written = readFileSync(target, 'utf8');
if (written !== TEXT) {
  throw new Error('entry.txt does not match the entry text after writing');
}
