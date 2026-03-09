// utils/colour-scheme-init.ts
export const COLOUR_SCHEME_KEY = "colourScheme";
export type ColourScheme = "auto" | "dark" | "light";

export const getValidScheme = (value: string | null): ColourScheme => {
  if (value === "dark" || value === "light" || value === "auto") return value;
  return "auto";
};

export const applyColourScheme = (scheme: ColourScheme) => {
  const html = document.documentElement;
  // Class drives the legacy _dark.css selectors (html.dark)
  html.classList.remove("light", "dark");
  if (scheme !== "auto") html.classList.add(scheme);
  // color-scheme property drives light-dark() in the modern _modern.css files
  html.style.colorScheme = scheme === "auto" ? "light dark" : scheme;
};

export const initColourScheme = () => {
  const saved = localStorage.getItem(COLOUR_SCHEME_KEY);
  applyColourScheme(getValidScheme(saved));
};
