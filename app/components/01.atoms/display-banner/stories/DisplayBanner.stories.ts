import DisplayBanner from "../DisplayBanner.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof DisplayBanner> = {
  title: "Atoms/DisplayBanner",
  component: DisplayBanner,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "p", "span", "section", "article", "aside", "header", "footer", "main", "nav", "ul", "ol"],
      description: "Root element tag",
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
          "Stacks a `canvas` slot (background media) and a `content` slot (overlaid text/CTAs) in a single grid area. Either slot may be omitted.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DisplayBanner>;

export const Default: Story = {
  args: {
    tag: "div",
  },
  render: (args) => ({
    components: { DisplayBanner },
    setup() {
      return { args };
    },
    template: `
      <DisplayBanner v-bind="args" style="--display-banner-min-height: 24rem;">
        <template #canvas>
          <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #5b8def, #8f5be9);"></div>
        </template>
        <template #content>
          <div style="display: grid; place-items: center; height: 100%; color: white;">
            <h2 style="margin: 0;">Banner content</h2>
          </div>
        </template>
      </DisplayBanner>
    `,
  }),
};

export const CanvasOnly: Story = {
  args: {
    tag: "div",
  },
  render: (args) => ({
    components: { DisplayBanner },
    setup() {
      return { args };
    },
    template: `
      <DisplayBanner v-bind="args" style="--display-banner-min-height: 16rem;">
        <template #canvas>
          <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #5b8def, #8f5be9);"></div>
        </template>
      </DisplayBanner>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "With no `content` slot, no empty `.content` wrapper is rendered.",
      },
    },
  },
};

export const ContentOnly: Story = {
  args: {
    tag: "div",
  },
  render: (args) => ({
    components: { DisplayBanner },
    setup() {
      return { args };
    },
    template: `
      <DisplayBanner v-bind="args" style="--display-banner-min-height: 16rem; background: #1a1a1a;">
        <template #content>
          <div style="display: grid; place-items: center; height: 100%; color: white;">
            <h2 style="margin: 0;">Content, no canvas</h2>
          </div>
        </template>
      </DisplayBanner>
    `,
  }),
};
