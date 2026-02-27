import EyebrowText from "../EyebrowText.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof EyebrowText> = {
  title: "Atoms/Text Blocks/EyebrowText",
  component: EyebrowText,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["p", "div", "span"],
      description: "HTML tag for the text element",
      defaultValue: "div",
    },
    fontSize: {
      control: { type: "select" },
      options: ["large", "medium", "small"],
      description: "Font size",
      defaultValue: "medium",
    },
    textContent: {
      control: "object",
      description: "Text content for the eyebrow text element",
      defaultValue: "Designing Artistry at Home",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional classes",
      defaultValue: [],
    },
  },
};

export default meta;
type Story = StoryObj<typeof EyebrowText>;
export const Default: Story = {
  args: {
    tag: "div",
    fontSize: "medium",
    textContent: "Designing Artistry at Home",
    styleClassPassthrough: [],
  },
  render: (args) => ({
    components: { EyebrowText },
    setup() {
      return { args };
    },
    template: `<EyebrowText v-bind="args" />`,
  }),
};
