import AlertMaskCore from "../AlertMaskCore.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof AlertMaskCore> = {
  title: "Atoms/AlertMaskCore",
  component: AlertMaskCore,
  argTypes: {
    config: {
      control: "object",
      description:
        "Border/background colour and geometry: backgroundColour, borderColour, radiusLeft, radiusRight, borderLeft, borderTop, borderRight, borderBottom",
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
          "Draws a border/background mask around slotted content via an SVG path, sized to the measured content. Colour and geometry are set via the `config` prop, not CSS tokens — see CONSUMER-STYLING.md.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AlertMaskCore>;

export const Default: Story = {
  args: {
    config: {},
  },
  render: (args) => ({
    components: { AlertMaskCore },
    setup() {
      return { args };
    },
    template: `
      <AlertMaskCore v-bind="args">
        <p style="margin: 0; padding: 1.6rem; color: white;">Default alert mask content</p>
      </AlertMaskCore>
    `,
  }),
};

export const CustomConfig: Story = {
  args: {
    config: {
      backgroundColour: "rgba(0, 0, 0, 0.3)",
      borderColour: "var(--theme-accent)",
      radiusLeft: 8,
      radiusRight: 4,
      borderLeft: 6,
      borderTop: 1,
      borderRight: 1,
      borderBottom: 1,
    },
  },
  render: (args) => ({
    components: { AlertMaskCore },
    setup() {
      return { args };
    },
    template: `
      <AlertMaskCore v-bind="args">
        <p style="margin: 0; padding: 1.6rem; color: white;">Custom accent-bar config, matching AlertMaskedContent's default shape</p>
      </AlertMaskCore>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "The accent-bar shape used by AlertMaskedContent: thick left radius/border, thin elsewhere.",
      },
    },
  },
};
