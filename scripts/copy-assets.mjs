import { cp, mkdir, stat } from 'node:fs/promises';
const source = new URL('../assets/', import.meta.url);
const destination = new URL('../dist/assets/', import.meta.url);
await stat(source);
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true, force: true });
console.log('Copied prototype screenshots into Astro output.');
