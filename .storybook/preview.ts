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
  // Every story file gets a generated Docs page; opt one out with tags: ["!autodocs"] in its meta.
  tags: ["autodocs"],
  parameters: {
    options: {
      // Top-level groups in tier order, everything below them alphabetical. Entries within one
      // component keep their file order, with the Docs page first. Storybook serialises this
      // function source and evals it as plain JS: no type annotations, no outside references.
      // @ts-expect-error -- parameters are untyped and annotations would break that eval.
      storySort: (a, b) => {
        const groupOrder = ["Foundations", "Atoms", "Molecules", "Organisms", "Templates", "Components", "Patterns"];

        if (a.title === b.title) {
          if (a.type === b.type) return 0;
          return a.type === "docs" ? -1 : 1;
        }

        const aParts = a.title.split("/");
        const bParts = b.title.split("/");
        const aRank = groupOrder.indexOf(aParts[0]);
        const bRank = groupOrder.indexOf(bParts[0]);
        const groupDiff = (aRank === -1 ? groupOrder.length : aRank) - (bRank === -1 ? groupOrder.length : bRank);
        if (groupDiff !== 0) return groupDiff;

        for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
          const diff = (aParts[i] ?? "").localeCompare(bParts[i] ?? "", undefined, { sensitivity: "base" });
          if (diff !== 0) return diff;
        }
        return aParts.length - bParts.length;
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
