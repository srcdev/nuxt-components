import HeroHeading from "../HeroHeading.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof HeroHeading> = {
  title: "Atoms/Text Blocks/HeroHeading",
  component: HeroHeading,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
      description: "HTML tag for the heading",
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
      options: ["large", "medium", "small"],
      description: "Font size",
      defaultValue: "medium",
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
    styleClassPassthrough: {
      control: "object",
      description: "Additional classes",
      defaultValue: [],
    },
  },
};

export default meta;

type Story = StoryObj<typeof HeroHeading>;

export const Default: Story = {
  args: {
    tag: "h1",
    axis: "horizontal",
    fontSize: "medium",
    textContent: [
      { text: "Designing", styleClass: "normal" },
      { text: "Artistry", styleClass: "accent" },
      { text: "at Home", styleClass: "normal" },
    ],
    styleClassPassthrough: [],
  },
  render: (args) => ({
    components: { HeroHeading },
    setup() {
      return { args };
    },
    template: `<HeroHeading v-bind="args" />`,
  }),
};

// export const Vertical: Story = {
//   args: {
//     ...Default.args,
//     axis: "vertical",
//   },
//   render: Default.render,
// };

// export const Large: Story = {
//   args: {
//     ...Default.args,
//     fontSize: "large",
//   },
//   render: Default.render,
// };

// export const Small: Story = {
//   args: {
//     ...Default.args,
//     fontSize: "small",
//   },
//   render: Default.render,
// };
