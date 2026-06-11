// One source of truth for the oklch colour curve.
// Edit this file; run `npm run generate:ramps` to rebuild the CSS.

/** Lightness % at each step index 00–10 (light → dark) */
export const LIGHTNESS = [98, 94, 88, 80, 72, 64, 56, 48, 40, 32, 25];

/** Chroma multipliers at each step index 00–10.
 *  Actual chroma = ramp.chroma × multiplier.
 *  Ramps at mid-tone (06) reach full chroma; tapers toward both extremes. */
export const CHROMA_MULTIPLIERS = [0.045, 0.18, 0.32, 0.5, 0.68, 0.86, 1, 0.95, 0.86, 0.77, 0.64];

/**
 * Named ramps.
 *   hue     – oklch hue angle (degrees)
 *   chroma  – maximum chroma (at the 06 step)
 *   drift   – optional: rotates hue linearly across steps
 *             hue_i = hue + drift × (i / 10)
 *             e.g. drift -25 on hue 50 → step 00 = 50°, step 10 = 25°
 */
export const ramps = {
  blue:   { hue: 255, chroma: 0.22 },
  red:    { hue: 30,  chroma: 0.24 },
  green:  { hue: 157, chroma: 0.19 },
  amber:  { hue: 75,  chroma: 0.19 },
  orange: { hue: 60,  chroma: 0.15 },
  sunset: { hue: 50,  chroma: 0.22, drift: -25 },
  slate:  { hue: 260, chroma: 0.02 },
};
