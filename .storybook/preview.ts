import type { Preview } from "@nuxtjs/storybook";
import "./fonts.css";
import "./color-scheme.css";

// Stories default to the light colour scheme (off-white --slate-00 stage) regardless of the OS
// setting. The toolbar "Colour scheme" menu switches to dark or back to following the OS; it
// works by setting html[data-color-scheme], the same hook useColourScheme() sets in consumer apps.
// The layer itself ships light values only; dark values come from ./color-scheme.css, which
// keys purely on the attribute, so "Follow OS" resolves the OS preference to it here.
const osDarkQuery = window.matchMedia("(prefers-color-scheme: dark)");
let followOs = false;

const applyScheme = (scheme: string) => {
  followOs = scheme === "auto";
  const resolved = followOs ? (osDarkQuery.matches ? "dark" : "light") : scheme;
  document.documentElement.setAttribute("data-color-scheme", resolved);
};

osDarkQuery.addEventListener("change", () => {
  if (followOs) applyScheme("auto");
});

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ["Foundations", ["Colour Ramps", ["Setup Guide", "All Ramps", "*"]], "*"],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    colorScheme: {
      description: "Colour scheme for the preview",
      toolbar: {
        title: "Colour scheme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
          { value: "auto", title: "Follow OS" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    colorScheme: "light",
  },
  decorators: [
    (story, context) => {
      applyScheme(context.globals.colorScheme ?? "light");
      return story();
    },
  ],
};

export default preview;
