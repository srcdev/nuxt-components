import ScrollParallaxSection from "../ScrollParallaxSection.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof ScrollParallaxSection> = {
  title: "Atoms/Effects/ScrollParallaxSection",
  component: ScrollParallaxSection,
  argTypes: {
    tag: {
      control: "select",
      options: ["div", "section", "article", "aside"],
      description: "HTML element rendered as the container",
      table: { category: "Layout" },
    },
    backgroundImage: {
      control: "text",
      description: "Path or URL of the background image",
      table: { category: "Image" },
    },
    parallaxStrength: {
      control: { type: "range", min: 0, max: 2, step: 0.1 },
      description:
        "Multiplier for the parallax offset. 0 = no movement, 1 = standard, 2 = very dramatic. Also controls the image bleed (inset) so the full image fills the frame at all scroll positions.",
      table: { category: "Layout" },
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A section with a fixed-background parallax effect implemented via `requestAnimationFrame` and `IntersectionObserver`. The background image bleeds beyond the container bounds and is translated vertically as the component scrolls through the viewport. Height is controlled via the `--scroll-parallax-section-height` CSS custom property (default `25svh`). Slot content is layered above the background at `z-index: 1`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScrollParallaxSection>;

const scrollWrapper = (inner: string) => `
  <div style="padding-block: 60vh; max-width: 960px; margin-inline: auto;">
    <p style="text-align: center; font-size: 1.4rem; opacity: 0.5; margin-block-end: 4rem;">Scroll to see the parallax effect</p>
    ${inner}
  </div>
`;

export const Default: Story = {
  args: {
    backgroundImage: "/images/banners/banner-mid-brown.webp",
    parallaxStrength: 1,
    tag: "div",
  },
  render: (args) => ({
    components: { ScrollParallaxSection },
    setup() {
      return { args };
    },
    template: scrollWrapper(`<ScrollParallaxSection v-bind="args" />`),
  }),
  parameters: {
    docs: {
      description: {
        story: "Default configuration — standard parallax strength with no slot content.",
      },
    },
  },
};

export const SubtleEffect: Story = {
  args: {
    backgroundImage: "/images/banners/banner-light-brunette.webp",
    parallaxStrength: 0.4,
    tag: "div",
  },
  render: Default.render,
  parameters: {
    docs: {
      description: {
        story: "A low parallaxStrength (0.4) gives a gentle, understated movement — good for hero banners where content legibility matters.",
      },
    },
  },
};

export const DramaticEffect: Story = {
  args: {
    backgroundImage: "/images/banners/banner-ginger.webp",
    parallaxStrength: 1.8,
    tag: "div",
  },
  render: Default.render,
  parameters: {
    docs: {
      description: {
        story: "A high parallaxStrength (1.8) creates a dramatic sweep — the image travels a much larger distance relative to the scroll position.",
      },
    },
  },
};

export const WithSlotContent: Story = {
  args: {
    backgroundImage: "/images/page/hero/hero-dark.jpg",
    parallaxStrength: 1,
    tag: "section",
  },
  render: (args) => ({
    components: { ScrollParallaxSection },
    setup() {
      return { args };
    },
    template: scrollWrapper(`
      <ScrollParallaxSection v-bind="args" style="--scroll-parallax-section-height: 40svh; display: flex; align-items: center; justify-content: center;">
        <p style="color: white; font-size: 2.4rem; font-weight: 600; text-align: center; text-shadow: 0 2px 8px rgba(0,0,0,0.6); padding: 2rem;">
          Slot content sits above the parallax background
        </p>
      </ScrollParallaxSection>
    `),
  }),
  parameters: {
    docs: {
      description: {
        story: "Slot content is placed at `z-index: 1` above the parallax layer. Height is increased via the `--scroll-parallax-section-height` CSS custom property to accommodate the text.",
      },
    },
  },
};

export const TallSection: Story = {
  args: {
    backgroundImage: "/images/page/hero/hero-blonde.jpg",
    parallaxStrength: 1,
    tag: "div",
  },
  render: (args) => ({
    components: { ScrollParallaxSection },
    setup() {
      return { args };
    },
    template: scrollWrapper(`<ScrollParallaxSection v-bind="args" style="--scroll-parallax-section-height: 60svh;" />`),
  }),
  parameters: {
    docs: {
      description: {
        story: "The `--scroll-parallax-section-height` custom property overrides the default `25svh` height. Here it is set to `60svh` for a tall banner.",
      },
    },
  },
};
