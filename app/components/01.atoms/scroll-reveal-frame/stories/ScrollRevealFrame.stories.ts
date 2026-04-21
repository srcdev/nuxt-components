import ScrollRevealFrame from "../ScrollRevealFrame.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof ScrollRevealFrame> = {
  title: "Atoms/Effects/ScrollRevealFrame",
  component: ScrollRevealFrame,
  argTypes: {
    frameHeight: {
      control: "text",
      description: "Height of the visible clipping frame",
      table: { category: "Layout" },
    },
    parallaxOffset: {
      control: "text",
      description: "Distance the content travels vertically as the frame scrolls through the viewport",
      table: { category: "Layout" },
    },
    radius: {
      control: "text",
      description: "Border-radius applied to the clipping frame",
      table: { category: "Appearance" },
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Generic clipping frame that pans any slot content vertically as it scrolls through the viewport — driven entirely by CSS Scroll-driven Animations. No scroll listeners, no JS. Use this when you need the parallax reveal with arbitrary content (grids, video, etc.). For a single NuxtImg with optimisation and focal-point control, use ScrollRevealImage instead.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScrollRevealFrame>;

const scrollWrapper = (inner: string) => `
  <div style="padding-block: 60vh; max-width: 860px; margin-inline: auto;">
    <p style="text-align: center; font-size: 1.4rem; opacity: 0.5; margin-block-end: 4rem;">Scroll to see the parallax effect</p>
    ${inner}
  </div>
`;

export const Default: Story = {
  args: {
    frameHeight: "540px",
    parallaxOffset: "36rem",
    radius: "0px",
  },
  render: (args) => ({
    components: { ScrollRevealFrame },
    setup() {
      return { args };
    },
    template: scrollWrapper(`
      <ScrollRevealFrame v-bind="args">
        <img
          src="/images/page/hero/hero-blonde.jpg"
          alt="Blonde hair portrait"
          style="display: block; width: 100%; height: 100%; object-fit: cover;"
        />
      </ScrollRevealFrame>
    `),
  }),
  parameters: {
    docs: {
      description: {
        story: "Default props — a single image in the slot panning from top to bottom as the frame crosses the viewport.",
      },
    },
  },
};

export const ImageGrid: Story = {
  args: {
    frameHeight: "480px",
    parallaxOffset: "36rem",
    radius: "0px",
  },
  render: (args) => ({
    components: { ScrollRevealFrame },
    setup() {
      return { args };
    },
    template: scrollWrapper(`
      <ScrollRevealFrame v-bind="args">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(2, 1fr); gap: 4px; height: 100%;">
          <div style="overflow: hidden; min-height: 0;">
            <img src="/images/services/service-balayage.jpg" alt="Balayage" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
          </div>
          <div style="overflow: hidden; min-height: 0;">
            <img src="/images/services/service-colour.jpg" alt="Colour" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
          </div>
          <div style="overflow: hidden; min-height: 0;">
            <img src="/images/services/service-cut.jpg" alt="Cut" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
          </div>
          <div style="overflow: hidden; min-height: 0;">
            <img src="/images/services/service-highlights.jpg" alt="Highlights" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
          </div>
          <div style="overflow: hidden; min-height: 0;">
            <img src="/images/services/service-lowlights.jpg" alt="Lowlights" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
          </div>
          <div style="overflow: hidden; min-height: 0;">
            <img src="/images/services/service-toner.jpg" alt="Toner" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
          </div>
        </div>
      </ScrollRevealFrame>
    `),
  }),
  parameters: {
    docs: {
      description: {
        story: "A six-image CSS grid in the slot — all six images pan together as a single unit. This is the primary use case for ScrollRevealFrame over ScrollRevealImage.",
      },
    },
  },
};

export const RoundedCorners: Story = {
  args: {
    frameHeight: "480px",
    parallaxOffset: "36rem",
    radius: "2.4rem",
  },
  render: Default.render,
  parameters: {
    docs: {
      description: {
        story: "The radius prop applies border-radius to the clipping frame. The reveal stays contained within the rounded shape.",
      },
    },
  },
};

export const ShortFrame: Story = {
  args: {
    frameHeight: "320px",
    parallaxOffset: "24rem",
    radius: "0px",
  },
  render: (args) => ({
    components: { ScrollRevealFrame },
    setup() {
      return { args };
    },
    template: scrollWrapper(`
      <ScrollRevealFrame v-bind="args">
        <img
          src="/images/banners/banner-mid-brown.webp"
          alt="Mid brown hair banner"
          style="display: block; width: 100%; height: 100%; object-fit: cover;"
        />
      </ScrollRevealFrame>
    `),
  }),
  parameters: {
    docs: {
      description: {
        story: "A shallow banner frame. parallaxOffset is reduced proportionally to match the shorter frame height.",
      },
    },
  },
};
