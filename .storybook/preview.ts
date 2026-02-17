import "./fonts.css";
import type { Preview } from "@nuxtjs/storybook";

// Inject Bunny CDN link for Poppins font (needed because @nuxt/fonts does not inject in Storybook)
// if (typeof window !== "undefined") {
//   const link = document.createElement("link");
//   link.href = "https://fonts.bunny.net/css?family=poppins:100,200,300,400,500,600,700,800,900";
//   link.rel = "stylesheet";
//   document.head.appendChild(link);
// }

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
