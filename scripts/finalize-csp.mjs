/**
 * Astro may inline a small bundled module even when CSS inlining is disabled.
 * Authorize only its exact SHA-256 digest, never unsafe-inline.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const filename = new URL('../dist/index.html', import.meta.url);
let html = readFileSync(filename, 'utf8');
const cspMeta = /<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"\s*>/i;
const match = html.match(cspMeta);
assert.ok(match, 'Security policy meta is missing from compiled output');
const initial = match[1];
assert.ok(initial.includes("script-src 'self';"), 'Base script policy must be self-only');
assert.ok(!initial.includes('unsafe-inline'), 'Do not permit all inline code');
const hashes = new Set();
for (const [, attributes, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
  if (/\bsrc\s*=/i.test(attributes) || !body.trim()) continue;
  assert.ok(body.length < 75000, 'Unexpectedly large inlined script');
  assert.doesNotMatch(body, /(?:\beval\s*\(|document\.write\s*\(|\.innerHTML\s*=)/i);
  const hash = createHash('sha256').update(body, 'utf8').digest('base64');
  hashes.add("'sha256-" + hash + "'");
}
const directive = "script-src 'self'" + (hashes.size ? " " + [...hashes].join(' ') : '') + ';';
const updated = initial.replace("script-src 'self';", directive);
assert.notEqual(updated, '', 'Unable to construct CSP');
html = html.replace(match[0], match[0].replace(initial, updated));
writeFileSync(filename, html);
console.log('CSP finalized; cryptographically authorized ' + hashes.size + ' inlined build script(s).');
