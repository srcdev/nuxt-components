import { defineComponent } from "vue";
import type { Preview } from "@nuxtjs/storybook";

// Global NuxtImg mock for Storybook
const NuxtImgMock = defineComponent({
  props: ["src", "alt", "width", "height", "class", "style"],
  template: `<img :src="src" :alt="alt" :width="width" :height="height" :class="class" :style="style" />`,
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
