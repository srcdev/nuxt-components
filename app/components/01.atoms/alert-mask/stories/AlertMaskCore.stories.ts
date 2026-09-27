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

// The mask is a translucent fill plus a cut-out border, so it needs something busy behind it to read at all.
const backdrop =
  "background: url('/images/banners/video/lake-banner.jpg') center / cover; padding: 4rem 2.4rem; border-radius: 1.2rem; max-width: 60rem;";
const gradientBackdrop =
  "background: repeating-linear-gradient(45deg, oklch(100% 0 0 / 0.18) 0 1.2rem, transparent 1.2rem 2.4rem), linear-gradient(120deg, oklch(70% 0.2 30), oklch(65% 0.2 200) 60%, oklch(55% 0.22 300)); padding: 4rem 2.4rem; border-radius: 1.2rem; max-width: 60rem;";

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
      return { args, backdrop };
    },
    template: `
      <div data-theme="info" :style="backdrop">
        <AlertMaskCore v-bind="args">
          <p style="margin: 0; padding: 1.6rem; color: white;">Custom accent-bar config, matching AlertMaskedContent's default shape</p>
        </AlertMaskCore>
      </div>
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

export const OverGradient: Story = {
  args: {
    config: {
      backgroundColour: "rgba(0, 0, 0, 0.3)",
      borderColour: "white",
      radiusLeft: 16,
      radiusRight: 16,
      borderLeft: 4,
      borderTop: 4,
      borderRight: 4,
      borderBottom: 4,
    },
  },
  render: (args) => ({
    components: { AlertMaskCore },
    setup() {
      return { args, gradientBackdrop };
    },
    template: `
      <div :style="gradientBackdrop">
        <AlertMaskCore v-bind="args">
          <p style="margin: 0; padding: 1.6rem; color: white;">Even border all round: the stripes show through the fill and stop at the border's inner edge.</p>
        </AlertMaskCore>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "A striped gradient behind an even 4px white border, so the translucent fill and the border's cut-out are both visible.",
      },
    },
  },
};
