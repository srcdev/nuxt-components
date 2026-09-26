import type { Preview } from "@nuxtjs/storybook";
import "./fonts.css";

// Stories default to the light colour scheme (off-white --slate-00 stage) regardless of the OS
// setting. The toolbar "Colour scheme" menu switches to dark or back to following the OS; it
// works by setting html[data-color-scheme], the same hook consumer apps use (see _head.css).
const preview: Preview = {
  parameters: {
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
      const scheme = context.globals.colorScheme ?? "light";
      if (scheme === "auto") {
        document.documentElement.removeAttribute("data-color-scheme");
      } else {
        document.documentElement.setAttribute("data-color-scheme", scheme);
      }
      return story();
    },
  ],
};

export default preview;
