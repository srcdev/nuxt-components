#!/usr/bin/env node
/**
 * Generates colour ramp CSS from ramps.config.mjs.
 * Outputs:
 *   app/assets/styles/setup/02.colours/_{name}.css     — per-ramp literal values
 *   app/assets/styles/setup/02.colours/_theme-params.css — --palette-*-hue/chroma vars
 *   app/assets/styles/setup/03.theming/theme-ramp.css  — parametric --colour-theme-* slot
 */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const { LIGHTNESS, CHROMA_MULTIPLIERS, ramps } = await import(join(ROOT, "ramps.config.mjs"));

const COLOURS_DIR = join(ROOT, "app/assets/styles/setup/02.colours");
const THEMING_DIR = join(ROOT, "app/assets/styles/setup/03.theming");

const HEADER = "/* GENERATED — edit ramps.config.mjs, not this file */";

/** Round to at most `places` decimal places, stripping trailing zeros. */
function r(n, places = 4) {
  return parseFloat(n.toFixed(places));
}

// ─── Individual ramp files ───────────────────────────────────────────────────

for (const [name, cfg] of Object.entries(ramps)) {
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

// ─── _theme-params.css ────────────────────────────────────────────────────────

const paramLines = [HEADER, ":where(html) {"];
for (const [name, { hue, chroma, drift }] of Object.entries(ramps)) {
  paramLines.push(`  --palette-${name}-hue: ${hue};`);
  paramLines.push(`  --palette-${name}-chroma: ${chroma};`);
  if (drift !== undefined) paramLines.push(`  --palette-${name}-drift: ${drift};`);
}
paramLines.push("}");
writeFileSync(join(COLOURS_DIR, "_theme-params.css"), paramLines.join("\n") + "\n");
console.log("  ✓ _theme-params.css");

// ─── theme-ramp.css ───────────────────────────────────────────────────────────
// Declares --colour-theme-0..10 as oklch formulas on every element that can
// carry --theme-hue / --theme-chroma. The selector list must include every
// element that can redefine those vars so the formula re-evaluates there.
// --theme-hue-drift defaults to 0; set it (e.g. var(--palette-sunset-drift))
// to rotate hue linearly across steps, matching the ramp drift behaviour.

const rampLines = [
  HEADER,
  "/* Parametric theme-colour slot. Set --theme-hue and --theme-chroma on a",
  "   theme selector; these vars automatically pick up the right palette. */",
  ":where(html, [data-theme], [data-invalid]) {",
];

for (let i = 0; i <= 10; i++) {
  const L = LIGHTNESS[i];
  const M = CHROMA_MULTIPLIERS[i];
  const fraction = i === 0 ? "0" : i === 10 ? "1" : `${i} / 10`;
  rampLines.push(
    `  --colour-theme-${i}: oklch(${L}% calc(var(--theme-chroma) * ${M}) calc(var(--theme-hue) + var(--theme-hue-drift, 0) * (${fraction})));`,
  );
}

// Alias out-of-range indices used by older component code
rampLines.push("  /* Aliases for legacy --colour-theme-11 / -12 references */");
rampLines.push("  --colour-theme-11: var(--colour-theme-10);");
rampLines.push("  --colour-theme-12: var(--colour-theme-10);");
rampLines.push("}");

writeFileSync(join(THEMING_DIR, "theme-ramp.css"), rampLines.join("\n") + "\n");
console.log("  ✓ theme-ramp.css");

console.log("Done.");
