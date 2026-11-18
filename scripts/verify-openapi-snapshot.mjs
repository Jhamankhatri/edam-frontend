/**
 * Verifies the pinned backend OpenAPI snapshot before code generation.
 *
 * The frontend CI never starts Spring Boot, PostgreSQL, or needs credentials.
 * The JSON is a byte-exact artifact downloaded from backend Actions run
 * 44395699755 and pinned by backend commit 620f7a795cc67a16e905115131f561bbd986af85.
 * See docs/PHASE1_STEP1_CONTRACT_NOTES.md §14 for the update procedure.
 */
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const specPath = resolve(root, 'openapi-spec/openapi-620f7a795cc67a16e905115131f561bbd986af85.json');
const metaPath = resolve(root, 'openapi-spec/openapi-620f7a795cc67a16e905115131f561bbd986af85.meta.txt');

const expectedSha256 = '9533c5a5a9ce3044b2543cabaa7db09952b26c9e8581e08baf9889c33df2843d';
const expectedSize = 229310;
const expectedBackendCommit = '620f7a795cc67a16e905115131f561bbd986af85';

const fail = (message) => {
  console.error(`OpenAPI snapshot verification failed: ${message}`);
  process.exit(1);
};

const [bytes, metaStat] = await Promise.all([
  readFile(specPath).catch(() => fail(`missing ${specPath}`)),
  stat(metaPath).catch(() => fail(`missing ${metaPath}`)),
]);
if (!metaStat.isFile()) fail('metadata is not a regular file');
if (bytes.length !== expectedSize) {
  fail(`expected ${expectedSize} bytes, found ${bytes.length}`);
}
const sha256 = createHash('sha256').update(bytes).digest('hex');
if (sha256 !== expectedSha256) {
  fail(`expected SHA-256 ${expectedSha256}, found ${sha256}`);
}

const meta = await readFile(metaPath, 'utf8');
const fields = new Map(
  meta
    .split(/\r?\n/)
    .filter((line) => line.includes('='))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
    }),
);
for (const [key, expected] of [
  ['backend_commit_sha', expectedBackendCommit],
  ['file_name', 'openapi-620f7a795cc67a16e905115131f561bbd986af85.json'],
  ['size_bytes', String(expectedSize)],
  ['sha256', expectedSha256],
  ['http_status', '200'],
  ['workflow_run_id', '44395699755'],
]) {
  if (fields.get(key) !== expected) {
    fail(`metadata ${key} expected ${expected}, found ${fields.get(key) ?? '(missing)'}`);
  }
}

console.log(`OpenAPI snapshot verified: ${bytes.length} bytes, SHA-256 ${sha256}, backend ${expectedBackendCommit}`);
