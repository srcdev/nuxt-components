import EntryAnimation from "../EntryAnimation.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof EntryAnimation> = {
  title: "Components/Effects/EntryAnimation",
  component: EntryAnimation,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "article", "aside"],
      description: "HTML tag for the wrapper element",
      defaultValue: "div",
    },
    animationType: {
      control: { type: "select" },
      options: ["entry-slide-in", "entry-zoom-reveal", "entry-exit-blur"],
      description: "Type of entry animation",
      defaultValue: "entry-slide-in",
    },
    styleClassPassthrough: {
      control: { type: "text" },
      description: "Additional classes for styling",
      defaultValue: "",
    },
  },
};

export default meta;

export const EntrySlideIn: StoryObj<typeof EntryAnimation> = {
  args: {
    tag: "div",
    animationType: "entry-slide-in",
    styleClassPassthrough: "",
  },
  render: (args) => ({
    components: { EntryAnimation },
    setup() {
      return { args };
    },
    template: `
      <div style="height: 200px; background-color: red;">
        <label style="display: block; font-weight: bold; margin-bottom: 1rem;">Scroll down to reveal animation</label>
      </div>
      <div style="padding-block: 600px; background-color: green;  margin-bottom: 1000px;">
        <EntryAnimation v-bind="args">
          <template #default>
            <div style="padding: 2rem; background: #f0f0f0; border-radius: 8px;">
              Entry Animation Content
            </div>
          </template>
        </EntryAnimation>
      </div>
    `,
  }),
};

export const ZoomReveal: StoryObj<typeof EntryAnimation> = {
  args: {
    tag: "section",
    animationType: "entry-zoom-reveal",
    styleClassPassthrough: "",
  },
  render: EntrySlideIn.render,
};

export const EntryExitBlur: StoryObj<typeof EntryAnimation> = {
  args: {
    tag: "aside",
    animationType: "entry-exit-blur",
    styleClassPassthrough: "",
  },
  render: EntrySlideIn.render,
};
