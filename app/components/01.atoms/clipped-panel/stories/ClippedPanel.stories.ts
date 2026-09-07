import ClippedPanel from "../ClippedPanel.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof ClippedPanel> = {
  title: "Atoms/ClippedPanel",
  component: ClippedPanel,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "p", "span", "section", "article", "aside", "header", "footer", "main", "nav", "ul", "ol"],
      description: "Root element tag",
      table: { category: "Basic" },
    },
    variant: {
      control: { type: "select" },
      options: ["square", "rectangle", "circle-cutout"],
      description: "Which fixed-size notched shape to clip the panel to",
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
          "A panel clipped to a fixed-size notched shape via `clip-path: path(...)`. Each variant is a specific pixel-size shape (see CONSUMER-STYLING.md) — colour and outline are the only overridable surface.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ClippedPanel>;

export const Square: Story = {
  args: {
    tag: "div",
    variant: "square",
  },
  render: (args) => ({
    components: { ClippedPanel },
    setup() {
      return { args };
    },
    template: `<ClippedPanel v-bind="args">Square</ClippedPanel>`,
  }),
};

export const Rectangle: Story = {
  args: {
    tag: "div",
    variant: "rectangle",
  },
  render: (args) => ({
    components: { ClippedPanel },
    setup() {
      return { args };
    },
    template: `<ClippedPanel v-bind="args">Rectangle</ClippedPanel>`,
  }),
};

export const CircleCutout: Story = {
  args: {
    tag: "div",
    variant: "circle-cutout",
  },
  render: (args) => ({
    components: { ClippedPanel },
    setup() {
      return { args };
    },
    template: `<ClippedPanel v-bind="args">Circle cutout</ClippedPanel>`,
  }),
};

export const CustomColours: Story = {
  args: {
    tag: "div",
    variant: "square",
  },
  render: (args) => ({
    components: { ClippedPanel },
    setup() {
      return { args };
    },
    template: `
      <ClippedPanel
        v-bind="args"
        style="--clipped-panel-background-colour: #fef3e7; --clipped-panel-outline-colour: #b5651d; --clipped-panel-outline-width: 2px;"
      >
        Custom colours
      </ClippedPanel>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Overriding the public tokens via inline `--clipped-panel-*` custom properties.",
      },
    },
  },
};
