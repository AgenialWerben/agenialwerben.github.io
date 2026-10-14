import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const load = (path) => readFileSync(join(root, path), 'utf8');
const pages = [
  ['Astro build', 'dist/index.html'],
  ['Legacy fallback', 'index.html']
];
for (const [label, path] of pages) {
  assert.ok(existsSync(join(root, path)), label + ': missing output');
  const html = load(path);
  const csp = html.match(/<meta\s+http-equiv="Content-Security-Policy"[^>]*content="([^"]+)"/i);
  assert.ok(csp, label + ': CSP meta missing');
  const policy = csp[1];
  for (const directive of ["default-src 'none'", "script-src 'self'", "style-src 'self'", "object-src 'none'", "base-uri 'none'", "connect-src 'none'"]) {
    assert.ok(policy.includes(directive), label + ': missing policy ' + directive);
  }
  assert.ok(/<meta name="referrer" content="no-referrer">/.test(html), label + ': referrer policy missing');
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  assert.ok(scripts.length > 0, label + ': script missing');
  for (const [, attrs, body] of scripts) {
    assert.match(attrs, /\bsrc\s*=\s*["'][^"']+["']/i, label + ': inline JS violates CSP');
    assert.equal(body.trim(), '', label + ': non-empty inline JS violates CSP');
    assert.doesNotMatch(attrs, /src\s*=\s*["']https?:\/\//i, label + ': external JS forbidden');
  }
  assert.doesNotMatch(html, /<style\b/i, label + ': inline CSS forbidden');
  assert.doesNotMatch(html, /\sstyle\s*=/i, label + ': inline style attributes forbidden');
  assert.doesNotMatch(html, /\son(?:click|load|error|mouse(?:over|enter)|focus|submit)\s*=/i, label + ': inline event handlers forbidden');
  assert.doesNotMatch(html, /\b(?:eval\s*\(|document\.write\s*\(|\.innerHTML\s*=)/i, label + ': suspicious JS sink');
  assert.ok(html.includes('translate="no"'), label + ': translation-safe brand missing');
  assert.ok(html.includes('The Fiven Or Community'), label + ': official studio name missing');
  assert.ok(html.includes('id="experience"'), label + ': project explanation missing');
}
for (const filename of ['dist/CNAME', 'dist/.well-known/security.txt', 'dist/assets/forest.webp']) {
  assert.ok(existsSync(join(root, filename)), 'missing expected static file: ' + filename);
}
for (const file of ['src/scripts/site.ts','scripts/tfoc-legacy.js']) {
  const js=load(file);
  assert.doesNotMatch(js, /\b(?:eval\s*\(|document\.write\s*\(|\.innerHTML\s*=|new Function\s*\()/i, file + ': unsafe JS sink');
}
console.log('TFOC security checks passed: strict CSP, no inline scripts/styles, trusted assets, brand, disclosure.');
