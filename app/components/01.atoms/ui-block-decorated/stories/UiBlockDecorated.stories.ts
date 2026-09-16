import UiBlockDecorated from "../UiBlockDecorated.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof UiBlockDecorated> = {
  title: "Atoms/UiBlockDecorated",
  component: UiBlockDecorated,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "p", "span", "section", "article", "aside", "header", "footer", "main", "nav", "ul", "ol"],
      description: "Root element tag",
      table: { category: "Basic" },
    },
    borderStrength: {
      control: { type: "select" },
      options: [0, 1, 2, 3, 4, 5, 6],
      description: "Border strength level (0 = none)",
      table: { category: "Basic" },
    },
    shadowStrength: {
      control: { type: "select" },
      options: [0, 1, 2, 3, 4, 5, 6],
      description: "Drop shadow strength level (0 = none)",
      table: { category: "Basic" },
    },
    innerShadowStrength: {
      control: { type: "select" },
      options: [0, 1, 2, 3, 4],
      description: "Inner shadow strength level (0 = none)",
      table: { category: "Basic" },
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A plain block wrapper that applies independent border / drop-shadow / inner-shadow strength levels via CSS custom properties (see CONSUMER-STYLING.md).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof UiBlockDecorated>;

const blockStyle = "padding: 2rem; background: var(--theme-surface, #fff);";

export const Default: Story = {
  args: {
    tag: "div",
  },
  render: (args) => ({
    components: { UiBlockDecorated },
    setup() {
      return { args, blockStyle };
    },
    template: `<UiBlockDecorated v-bind="args" :style="blockStyle">No decoration</UiBlockDecorated>`,
  }),
};

export const Border: Story = {
  args: {
    tag: "div",
    borderStrength: 3,
  },
  render: (args) => ({
    components: { UiBlockDecorated },
    setup() {
      return { args, blockStyle };
    },
    template: `<UiBlockDecorated v-bind="args" :style="blockStyle">Border strength 3</UiBlockDecorated>`,
  }),
};

export const Shadow: Story = {
  args: {
    tag: "div",
    shadowStrength: 4,
  },
  render: (args) => ({
    components: { UiBlockDecorated },
    setup() {
      return { args, blockStyle };
    },
    template: `<UiBlockDecorated v-bind="args" :style="blockStyle">Shadow strength 4</UiBlockDecorated>`,
  }),
};

export const InnerShadow: Story = {
  args: {
    tag: "div",
    innerShadowStrength: 3,
  },
  render: (args) => ({
    components: { UiBlockDecorated },
    setup() {
      return { args, blockStyle };
    },
    template: `<UiBlockDecorated v-bind="args" :style="blockStyle">Inner shadow strength 3</UiBlockDecorated>`,
  }),
};

export const AllCombined: Story = {
  args: {
    tag: "div",
    borderStrength: 2,
    shadowStrength: 3,
    innerShadowStrength: 2,
  },
  render: (args) => ({
    components: { UiBlockDecorated },
    setup() {
      return { args, blockStyle };
    },
    template: `<UiBlockDecorated v-bind="args" :style="blockStyle">All three combined</UiBlockDecorated>`,
  }),
};

export const CustomTokens: Story = {
  args: {
    tag: "div",
    shadowStrength: 3,
  },
  render: (args) => ({
    components: { UiBlockDecorated },
    setup() {
      return { args, blockStyle };
    },
    template: `
      <UiBlockDecorated
        v-bind="args"
        :style="blockStyle + ' --ui-block-decorated-shadow-3: 0 6px 12px rgba(0, 0, 0, 0.25);'"
      >
        Custom shadow-3 token
      </UiBlockDecorated>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Overriding a strength level's token via an inline `--ui-block-decorated-*` custom property.",
      },
    },
  },
};
