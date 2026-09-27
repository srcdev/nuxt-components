// Reference data for the Foundations/Colour Ramps stories. Everything is derived from the same
// sources the CSS is generated from (ramps.config.mjs) or read live from the library's own
// source files, so these pages can't drift from what actually ships.
import { LIGHTNESS, CHROMA_MULTIPLIERS, ramps } from "../../../ramps.config.mjs";

export interface RampConfig {
  hue: number;
  chroma: number;
  drift?: number;
}

export interface ThemeRole {
  theme: string;
  token: string;
  role: string;
  mode: "light" | "dark" | "both";
}

export interface RampStep {
  index: number;
  step: string;
  token: string;
  lightness: number;
  chroma: number;
  hue: number;
  oklch: string;
  hex: string;
  inGamut: boolean;
  contrastOnWhite: number;
  contrastOnBlack: number;
  themeRoles: ThemeRole[];
  usedBy: string[];
}

export const rampConfigs = ramps as Record<string, RampConfig>;
export const rampNames = Object.keys(rampConfigs);

// Matches the generator's rounding so the oklch strings are identical to the generated CSS.
const round = (n: number, places = 4) => parseFloat(n.toFixed(places));

// ─── oklch → sRGB ───────────────────────────────────────────────────────────

function oklchToLinearSrgb(l: number, c: number, h: number): [number, number, number] {
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);

  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const gammaEncode = (x: number) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);
const toHexByte = (x: number) =>
  Math.round(clamp01(gammaEncode(x)) * 255)
    .toString(16)
    .padStart(2, "0");

function relativeLuminance(linear: [number, number, number]) {
  const [r, g, b] = linear.map(clamp01) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

// ─── Theme roles (parsed from the theming CSS) ─────────────────────────────

const themingSources = import.meta.glob("../../../app/assets/styles/setup/03.theming/*.css", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const slotDescriptions: Record<string, string> = {
  "--theme-surface": "Filled button and chip surface",
  "--theme-surface-hover": "Hover state of a filled surface",
  "--theme-surface-inverted": "Inverted surface",
  "--theme-surface-subtle": "Subtle body surface (alerts, toasts, outline hover)",
  "--theme-accent": "Accent strip (alert and toast left edge)",
  "--theme-border": "Input and card border",
  "--theme-border-focus": "Focused border",
  "--theme-ring": "Focus ring",
  "--theme-on-surface": "Text and icons on a filled surface",
  "--theme-text": "Text on the page, outline element text",
  "--theme-text-inverted": "Text on an inverted surface",
};

interface SlotMapping {
  light: number;
  dark: number;
}

function parseSlotDeclarations(css: string): Record<string, SlotMapping> {
  const slots: Record<string, SlotMapping> = {};
  const lightDark = /(--theme-[\w-]+)\s*:\s*light-dark\(\s*var\(--colour-theme-(\d+)\)\s*,\s*var\(--colour-theme-(\d+)\)\s*\)/g;
  const fixed = /(--theme-[\w-]+)\s*:\s*var\(--colour-theme-(\d+)\)\s*;/g;
  for (const [, token, light, dark] of css.matchAll(lightDark)) {
    slots[token!] = { light: Number(light), dark: Number(dark) };
  }
  for (const [, token, step] of css.matchAll(fixed)) {
    slots[token!] = { light: Number(step), dark: Number(step) };
  }
  return slots;
}

function stripComments(css: string) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

const allThemingCss = Object.values(themingSources).map(stripComments).join("\n");
const baseSlots = parseSlotDeclarations(
  stripComments(Object.entries(themingSources).find(([path]) => path.endsWith("_theme-slots.css"))?.[1] ?? "")
);

function themeLabel(selector: string) {
  const themes = [...selector.matchAll(/data-theme="([\w-]+)"/g)].map((m) => `data-theme="${m[1]}"`);
  if (/data-invalid/.test(selector)) themes.push("[data-invalid]");
  if (themes.length) return themes.join(", ");
  if (/\bhtml\b/.test(selector)) return "Page default (html)";
  return selector.trim();
}

/** Palette name → the themes that use it, each with its resolved slot mapping. */
const themesByPalette: Record<string, { theme: string; slots: Record<string, SlotMapping> }[]> = {};
for (const [, selector, body] of allThemingCss.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const palette = body!.match(/--theme-hue\s*:\s*var\(--palette-([\w-]+)-hue\)/)?.[1];
  if (!palette) continue;
  (themesByPalette[palette] ??= []).push({
    theme: themeLabel(selector!),
    slots: { ...baseSlots, ...parseSlotDeclarations(body!) },
  });
}

export function themesForPalette(name: string) {
  return (themesByPalette[name] ?? []).map((t) => t.theme);
}

function themeRolesForStep(name: string, index: number): ThemeRole[] {
  const roles: ThemeRole[] = [];
  for (const { theme, slots } of themesByPalette[name] ?? []) {
    for (const [token, { light, dark }] of Object.entries(slots)) {
      if (light !== index && dark !== index) continue;
      roles.push({
        theme,
        token,
        role: slotDescriptions[token] ?? "",
        mode: light === index && dark === index ? "both" : light === index ? "light" : "dark",
      });
    }
  }
  return roles;
}

// ─── Named-step usage (scanned from library source) ────────────────────────

const componentSources = import.meta.glob(
  [
    "../../../app/**/*.vue",
    "../../../app/**/*.css",
    "!../../../app/**/stories/**",
    "!../../../app/**/tests/**",
  ],
  { query: "?raw", import: "default", eager: true }
) as Record<string, string>;

function sourceLabel(path: string) {
  const file = path.split("/").pop() ?? path;
  return file.endsWith(".vue") ? file.replace(/\.vue$/, "") : path.replace(/^.*\/app\/assets\/styles\//, "styles/");
}

function usageForToken(token: string) {
  const pattern = new RegExp(`${token}(?![\\w-])`);
  return Object.entries(componentSources)
    .filter(([, source]) => pattern.test(source))
    .map(([path]) => sourceLabel(path))
    .sort((a, b) => a.localeCompare(b));
}

// ─── Public API ────────────────────────────────────────────────────────────

export function buildRamp(name: string): RampStep[] {
  const cfg = rampConfigs[name];
  if (!cfg) return [];
  const { hue, chroma, drift = 0 } = cfg;

  return (LIGHTNESS as number[]).map((lightness, index) => {
    const step = String(index).padStart(2, "0");
    const c = round(chroma * (CHROMA_MULTIPLIERS as number[])[index]!);
    const h = drift !== 0 ? round(hue + drift * (index / 10), 1) : hue;
    const linear = oklchToLinearSrgb(lightness / 100, c, h);
    // Only flag steps where clipping to sRGB actually changes the hex, not rounding-level overshoot.
    const inGamut = linear.every((v) => {
      const byte = Math.round(gammaEncode(v) * 255);
      return byte >= 0 && byte <= 255;
    });
    const luminance = relativeLuminance(linear);
    const token = `--${name}-${step}`;

    return {
      index,
      step,
      token,
      lightness,
      chroma: c,
      hue: h,
      oklch: `oklch(${lightness}% ${c} ${h})`,
      hex: `#${linear.map(toHexByte).join("")}`,
      inGamut,
      contrastOnWhite: round(contrast(luminance, 1), 2),
      contrastOnBlack: round(contrast(luminance, 0), 2),
      themeRoles: themeRolesForStep(name, index),
      usedBy: usageForToken(token),
    };
  });
}
