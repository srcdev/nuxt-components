// utils/colour-scheme-init.ts
export const COLOUR_SCHEME_KEY = "colourScheme";
export type ColourScheme = "auto" | "dark" | "light";

export const getValidScheme = (value: string | null): ColourScheme => {
  if (value === "dark" || value === "light" || value === "auto") return value;
  return "auto";
};

export const applyColourScheme = (scheme: ColourScheme) => {
  document.documentElement.dataset.colorScheme = scheme;
};

export const initColourScheme = () => {
  const saved = localStorage.getItem(COLOUR_SCHEME_KEY);
  applyColourScheme(getValidScheme(saved));
};
