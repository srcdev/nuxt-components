import { defineComponent } from "vue";
import type { Preview } from "@nuxtjs/storybook";

// Global NuxtImg mock for Storybook
const NuxtImgMock = defineComponent({
  props: ["src", "srcset", "alt", "width", "height", "class", "style"],
  computed: {
    staticSrc(): string {
      if (this.src && this.src.startsWith("/_vercel/image")) {
        const match = this.src.match(/url=([^&]+)/);
        if (match && match[1]) {
          const staticPath = decodeURIComponent(match[1]);
          // Log for debugging
          console.warn("NuxtImg mock rewriting src:", this.src, "→", staticPath);
          return staticPath;
        }
        // Log fallback
        console.warn("NuxtImg mock could not rewrite src:", this.src);
        return "/images/placeholder.png";
      }
      return this.src;
    },
    staticSrcset(): string {
      if (this.srcset && this.srcset.startsWith("/_vercel/image")) {
        const match = this.srcset.match(/url=([^&]+)/);
        if (match && match[1]) {
          const staticPath = decodeURIComponent(match[1]);
          console.warn("NuxtImg mock rewriting srcset:", this.srcset, "→", staticPath);
          return staticPath;
        }
        console.warn("NuxtImg mock could not rewrite srcset:", this.srcset);
        return "/images/placeholder.png";
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
