import { defineComponent } from "vue";
import type { Preview } from "@nuxtjs/storybook";

// Global NuxtImg mock for Storybook
const NuxtImgMock = defineComponent({
  props: ["src", "srcset", "alt", "width", "height", "class", "style"],
  computed: {
    staticSrc(): string {
      // If src starts with /_vercel/image, rewrite to static path
      if (this.src && this.src.startsWith("/_vercel/image")) {
        // Extract the original image path from the query string
        const match = this.src.match(/url=([^&]+)/);
        if (match && match[1]) {
          return decodeURIComponent(match[1]);
        }
      }
      return this.src;
    },
    staticSrcset(): string {
      // If srcset starts with /_vercel/image, rewrite to static path
      if (this.srcset && this.srcset.startsWith("/_vercel/image")) {
        const match = this.srcset.match(/url=([^&]+)/);
        if (match && match[1]) {
          return decodeURIComponent(match[1]);
        }
      }
      return this.srcset;
    },
  },
  template: `<img :src="staticSrc" :srcset="staticSrcset" :alt="alt" :width="width" :height="height" :class="class" :style="style" />`,
});

export const decorators = [
  (story: () => unknown) =>
    defineComponent({
      components: { story, NuxtImg: NuxtImgMock },
      template: "<story />",
    }),
];

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
