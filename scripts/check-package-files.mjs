#!/usr/bin/env node
/**
 * Release/CI check: the published package must contain every runtime file the layer needs.
 * Usage: node scripts/check-package-files.mjs
 *
 * Reads the real tarball file list (`npm pack --dry-run --json`, so `files` and its `!**\/tests/`
 * style exclusions are honoured exactly as on publish) and fails if:
 *   1. a git-tracked .vue file under app/ is not in the package. Nuxt auto-registers components,
 *      so a component the package drops fails only at runtime in consumers ("Failed to resolve
 *      component"), with no build error. Found 2026-11-25: ContactSection.vue had lived in its
 *      tests/ folder since it was created and vanished from every release from 9.9.2 on, when
 *      `!**\/tests/` was added to `files`.
 *   2. a shipped .vue/.ts/.js/.mjs/.css file imports a relative path that is not shipped.
 */

import { execSync } from "node:child_process";
import { readFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, posix } from "node:path";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const run = (cmd) => execSync(cmd, { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 }).toString();

// npm ≤11 prints an array of pack results; npm 12 prints an object keyed by package name.
const packJson = JSON.parse(run("npm pack --dry-run --json --ignore-scripts"));
const pack = Array.isArray(packJson) ? packJson[0] : Object.values(packJson)[0];
if (!pack?.files) throw new Error("Unrecognised `npm pack --json` output shape");
const shipped = new Set(pack.files.map((f) => f.path));
const problems = [];

// 1. Every component on disk (tracked or new, not ignored) is shipped.
const components = run("git ls-files --cached --others --exclude-standard -- 'app/**/*.vue'").split("\n");
for (const file of new Set(components.filter((f) => f && existsSync(join(ROOT, f))))) {
  if (!shipped.has(file)) problems.push(`not published: ${file}`);
}

// 2. Every relative import from a shipped source file resolves to a shipped file.
const SOURCE = /\.(vue|ts|js|mjs|css)$/;
const IMPORT = /(?:\bimport\b[^'"`]*?|\bfrom\s*|\bimport\s*\(\s*|@import\s+(?:url\()?)["']([^"']+)["']/g;
const EXTENSIONS = ["", ".ts", ".js", ".mjs", ".vue", ".json", ".css", "/index.ts", "/index.js", "/index.css"];

for (const file of shipped) {
  if (!SOURCE.test(file) || file.endsWith(".d.ts")) continue;
  // Drop block comments and whole-line // comments so commented-out imports don't count.
  const text = readFileSync(join(ROOT, file), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
  for (const [, spec] of text.matchAll(IMPORT)) {
    if (!spec.startsWith("./") && !spec.startsWith("../")) continue;
    const base = posix.normalize(posix.join(posix.dirname(file), spec.split("?")[0])).replace(/\/$/, "");
    const target = EXTENSIONS.map((ext) => base + ext).find((p) => {
      const abs = join(ROOT, p);
      return existsSync(abs) && statSync(abs).isFile();
    });
    // Imports that don't resolve on disk at all are the build's and linter's job, not this check's.
    if (target && !shipped.has(target)) problems.push(`${file} imports ${spec}, which is not published (${target})`);
  }
}

if (problems.length) {
  console.error(`Package contents check failed (${problems.length}):\n  ${problems.join("\n  ")}`);
  console.error("\nMove runtime files out of tests/, stories/ and playwright/ folders, or adjust `files` in package.json.");
  process.exit(1);
}
console.log(`Package contents OK: ${shipped.size} files, every component and relative import is published.`);
