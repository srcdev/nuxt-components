import { defineComponent } from "vue";
import type { Preview } from "@nuxtjs/storybook";

// Decorator to globally mock NuxtImg for Storybook
export const decorators = [
  (story: any) =>
    defineComponent({
      components: { story },
      template: "<story />",
      setup() {
        // Register NuxtImg globally using Vue's globalThis
        if (typeof window !== "undefined" && (globalThis as any).$nuxt) {
          (globalThis as any).$nuxt.vueApp.component("NuxtImg", {
            props: ["src", "alt", "width", "height", "class", "style"],
            template: `<img :src="src" :alt="alt" :width="width" :height="height" :class="class" :style="style" />`,
          });
        }
      },
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
