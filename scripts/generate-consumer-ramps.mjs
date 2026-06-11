#!/usr/bin/env node
/**
 * Consumer colour ramp generator.
 *
 * Run from your consuming app's project root:
 *   node node_modules/srcdev-nuxt-components/scripts/generate-consumer-ramps.mjs
 *
 * Reads:   ramps.config.mjs in your project root
 * Writes:  app/assets/styles/setup/02.colours/ in your project root
 *
 * Your ramps.config.mjs can contain any combination of:
 *   - New palettes (e.g. gold, copper) — adds --gold-00..10 and --palette-gold-* vars
 *   - Built-in names (e.g. blue, red, green) — your generated file overrides the layer's
 *     values because consumer CSS loads after layer CSS in the cascade
 *
 * Example ramps.config.mjs:
 *   export const ramps = {
 *     gold: { hue: 85, chroma: 0.20 },
 *   };
 *
 * Produces:
 *   _gold.css          — --gold-00 … --gold-10 (literal oklch values)
 *   _palette-params.css — --palette-gold-hue, --palette-gold-chroma
 *
 * Import both in your app/assets/styles/setup/02.colours/index.css, then
 * reference --gold-09 etc. in your theme override files.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LAYER_ROOT = join(__dirname, "..");
const CONSUMER_ROOT = process.cwd();

// Lightness / chroma curves come from the layer so all ramps share the same curve shape
const { LIGHTNESS, CHROMA_MULTIPLIERS } = await import(pathToFileURL(join(LAYER_ROOT, "ramps.config.mjs")).href);

// Consumer's palette definitions
let consumerRamps;
try {
  const config = await import(pathToFileURL(join(CONSUMER_ROOT, "ramps.config.mjs")).href);
  consumerRamps = config.ramps;
  if (!consumerRamps || typeof consumerRamps !== "object") throw new Error("ramps export missing");
} catch {
  console.error("✗ Could not load ramps.config.mjs from your project root.");
  console.error("  Create one exporting a `ramps` object, e.g.:");
  console.error("    export const ramps = {");
  console.error("      gold: { hue: 85, chroma: 0.20 },");
  console.error("    };");
  process.exit(1);
}

const COLOURS_DIR = join(CONSUMER_ROOT, "app/assets/styles/setup/02.colours");
mkdirSync(COLOURS_DIR, { recursive: true });

const HEADER = "/* GENERATED — edit your ramps.config.mjs, not this file */";

/** Round to at most `places` decimal places, stripping trailing zeros. */
function r(n, places = 4) {
  return parseFloat(n.toFixed(places));
}

// ─── Individual colour files ──────────────────────────────────────────────────

for (const [name, cfg] of Object.entries(consumerRamps)) {
  const { hue, chroma, drift = 0 } = cfg;
  const lines = [HEADER, ":where(html) {"];

  for (let i = 0; i <= 10; i++) {
    const step = String(i).padStart(2, "0");
    const L = LIGHTNESS[i];
    const C = r(chroma * CHROMA_MULTIPLIERS[i]);
    const H = drift !== 0 ? r(hue + drift * (i / 10), 1) : hue;
    lines.push(`  --${name}-${step}: oklch(${L}% ${C} ${H});`);
  }

  lines.push("}");
  writeFileSync(join(COLOURS_DIR, `_${name}.css`), lines.join("\n") + "\n");
  console.log(`  ✓ _${name}.css`);
}

// ─── _palette-params.css ─────────────────────────────────────────────────────

const paramLines = [HEADER, ":where(html) {"];
for (const [name, { hue, chroma, drift }] of Object.entries(consumerRamps)) {
  paramLines.push(`  --palette-${name}-hue: ${hue};`);
  paramLines.push(`  --palette-${name}-chroma: ${chroma};`);
  if (drift !== undefined) paramLines.push(`  --palette-${name}-drift: ${drift};`);
}
paramLines.push("}");
writeFileSync(join(COLOURS_DIR, "_palette-params.css"), paramLines.join("\n") + "\n");
console.log("  ✓ _palette-params.css");

console.log("");
console.log("Done. Next steps:");
console.log("  1. Import generated files in app/assets/styles/setup/02.colours/index.css");
console.log("  2. Reference --palette-*-hue / --palette-*-chroma in your theme override");
console.log("  3. Use named steps (e.g. var(--gold-09)) in page-level token overrides");
