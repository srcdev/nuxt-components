#!/usr/bin/env node
/**
 * CI check: runs the generator then fails if any generated file changed.
 * Usage: node scripts/check-ramps.mjs
 */

import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

const GENERATED = [
  "app/assets/styles/setup/02.colours/_blue.css",
  "app/assets/styles/setup/02.colours/_red.css",
  "app/assets/styles/setup/02.colours/_green.css",
  "app/assets/styles/setup/02.colours/_amber.css",
  "app/assets/styles/setup/02.colours/_orange.css",
  "app/assets/styles/setup/02.colours/_sunset.css",
  "app/assets/styles/setup/02.colours/_slate.css",
  "app/assets/styles/setup/02.colours/_theme-params.css",
  "app/assets/styles/setup/03.theming/theme-ramp.css",
];

console.log("Running generator…");
execSync("node scripts/generate-ramps.mjs", { cwd: ROOT, stdio: "inherit" });

console.log("Checking for diff…");
const diff = execSync(`git diff --name-only ${GENERATED.join(" ")}`, { cwd: ROOT }).toString().trim();

if (diff) {
  console.error("\n✗ Generated files are out of date. Run `npm run generate:ramps` and commit:\n");
  console.error(diff);
  process.exit(1);
}

// Also check for untracked generated files
const untracked = execSync(`git ls-files --others --exclude-standard ${GENERATED.join(" ")}`, { cwd: ROOT })
  .toString()
  .trim();

if (untracked) {
  console.error("\n✗ Generated files are new and untracked. Run `npm run generate:ramps` and commit:\n");
  console.error(untracked);
  process.exit(1);
}

console.log("✓ Generated files are up to date.");
