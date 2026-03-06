import HeroText from "../HeroText.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof HeroText> = {
  title: "Atoms/Text Blocks/HeroText",
  component: HeroText,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
      description: "HTML tag for the element",
      defaultValue: "h1",
    },
    axis: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
      description: "Layout axis",
      defaultValue: "horizontal",
    },
    fontSize: {
      control: { type: "select" },
      options: ["display", "title", "heading", "subheading", "label"],
      description: "Semantic font size",
      defaultValue: "title",
    },
    textContent: {
      control: "object",
      description: "Array of text segments with styleClass",
      defaultValue: [
        { text: "Designing", styleClass: "normal" },
        { text: "Artistry", styleClass: "accent" },
        { text: "at Home", styleClass: "normal" },
      ],
    },
    icon: {
      control: "text",
      description: "Icon name (e.g. 'lucide:sparkles'). Leave empty to hide.",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional classes",
      defaultValue: [],
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeroText>;
export const Default: Story = {
  args: {
    tag: "h1",
    axis: "horizontal",
    fontSize: "title",
    textContent: [
      { text: "Designing", styleClass: "normal" },
      { text: "Artistry", styleClass: "accent" },
      { text: "at Home", styleClass: "normal" },
    ],
    icon: "lucide:sparkles",
    styleClassPassthrough: [],
  },
  render: (args) => ({
    components: { HeroText },
    setup() {
      return { args };
    },
    template: `<HeroText v-bind="args" />`,
  }),
};
