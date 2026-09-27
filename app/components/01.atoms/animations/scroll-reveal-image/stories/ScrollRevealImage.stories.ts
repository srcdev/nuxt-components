import ScrollRevealImage from "../ScrollRevealImage.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof ScrollRevealImage> = {
  title: "Atoms/Effects/ScrollRevealImage",
  component: ScrollRevealImage,
  argTypes: {
    src: {
      control: "text",
      description: "Image source path",
      table: { category: "Image" },
    },
    alt: {
      control: "text",
      description: "Alt text for the image",
      table: { category: "Image" },
    },
    imgWidth: {
      control: { type: "number" },
      description: "Intrinsic width of the source image — required for NuxtImg optimisation",
      table: { category: "Image" },
    },
    imgHeight: {
      control: { type: "number" },
      description: "Intrinsic height of the source image — required for NuxtImg optimisation",
      table: { category: "Image" },
    },
    frameHeight: {
      control: "text",
      description: "Height of the visible clipping frame",
      table: { category: "Layout" },
    },
    parallaxOffset: {
      control: "text",
      description: "Distance the image travels vertically as the frame scrolls through the viewport",
      table: { category: "Layout" },
    },
    focalX: {
      control: "text",
      description: "Horizontal focal point — CSS object-position x-axis value (e.g. '50%', 'left', '30%')",
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
          "Single-image parallax reveal built on ScrollRevealFrame. Adds NuxtImg optimisation (src, alt, intrinsic dimensions) and a horizontal focal-point prop (focalX). For arbitrary slot content — grids, video, etc. — use ScrollRevealFrame directly.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScrollRevealImage>;

const scrollWrapper = (inner: string) => `
  <div style="padding-block: 60vh; max-width: 860px; margin-inline: auto;">
    <p style="text-align: center; font-size: 1.4rem; opacity: 0.5; margin-block-end: 4rem;">Scroll to see the parallax effect</p>
    ${inner}
  </div>
`;

export const Default: Story = {
  args: {
    src: "/images/page/hero/hero-blonde.jpg",
    alt: "Blonde hair portrait",
    imgWidth: 1280,
    imgHeight: 1920,
    frameHeight: "540px",
    parallaxOffset: "36rem",
    focalX: "50%",
    radius: "0px",
  },
  render: (args) => ({
    components: { ScrollRevealImage },
    setup() {
      return { args };
    },
    template: scrollWrapper(`<ScrollRevealImage v-bind="args" />`),
  }),
  parameters: {
    docs: {
      description: {
        story: "A portrait image panning from top to bottom as the frame crosses the viewport. The sizing values shown match the CSS defaults.",
      },
    },
  },
};

export const ShortFrame: Story = {
  args: {
    src: "/images/banners/banner-mid-brown.webp",
    alt: "Mid brown hair banner",
    imgWidth: 1920,
    imgHeight: 800,
    frameHeight: "320px",
    parallaxOffset: "24rem",
    focalX: "50%",
    radius: "0px",
  },
  render: Default.render,
  parameters: {
    docs: {
      description: {
        story: "A shallow banner frame with a wide landscape image. parallaxOffset is reduced proportionally to match the shorter frame height.",
      },
    },
  },
};

export const RoundedCorners: Story = {
  args: {
    src: "/images/banners/banner-ginger.webp",
    alt: "Ginger hair banner",
    imgWidth: 1920,
    imgHeight: 800,
    frameHeight: "480px",
    parallaxOffset: "36rem",
    focalX: "50%",
    radius: "2.4rem",
  },
  render: Default.render,
  parameters: {
    docs: {
      description: {
        story: "The radius prop applies border-radius to the clipping frame. The image reveal stays contained within the rounded shape.",
      },
    },
  },
};

export const FocalPoint: Story = {
  args: {
    src: "/images/page/hero/hero-red.jpg",
    alt: "Red hair portrait",
    imgWidth: 1280,
    imgHeight: 1920,
    frameHeight: "540px",
    parallaxOffset: "36rem",
    focalX: "75%",
    radius: "0px",
  },
  render: Default.render,
  parameters: {
    docs: {
      description: {
        story: "focalX pins the horizontal crop axis. Here it is pushed right to keep the subject centred in a narrower frame.",
      },
    },
  },
};

export const TallFrame: Story = {
  args: {
    src: "/images/page/hero/hero-hair.jpg",
    alt: "Hair portrait",
    imgWidth: 1280,
    imgHeight: 1920,
    frameHeight: "70vh",
    parallaxOffset: "60rem",
    focalX: "50%",
    radius: "0px",
  },
  render: Default.render,
  parameters: {
    docs: {
      description: {
        story: "A tall frame combined with a large parallaxOffset creates the most dramatic reveal — nearly the full image height is traversed as you scroll.",
      },
    },
  },
};

export const CssTokens: Story = {
  args: {
    src: "/images/page/hero/hero-red.jpg",
    alt: "Red hair portrait",
    imgWidth: 1280,
    imgHeight: 1920,
  },
  render: (args) => ({
    components: { ScrollRevealImage },
    setup() {
      return { args };
    },
    template: `
      <div style="padding-block: 60vh; max-width: 860px; margin-inline: auto;">
        <component is="style">
          .sri-story-tokens {
            --scroll-reveal-frame-height: 320px;
            --scroll-reveal-frame-parallax-offset: 20rem;
            --scroll-reveal-image-focal-x: 70%;
            --scroll-reveal-image-focal-y: 40%;
          }
          @media (width >= 768px) {
            .sri-story-tokens {
              --scroll-reveal-frame-height: 540px;
              --scroll-reveal-frame-parallax-offset: 36rem;
              --scroll-reveal-image-focal-x: 50%;
              --scroll-reveal-image-focal-y: 0%;
            }
          }
        </component>
        <p style="text-align: center; font-size: 1.4rem; opacity: 0.5; margin-block-end: 4rem;">
          Resize below/above 768px and scroll: frame size and crop point come from CSS tokens, no props passed
        </p>
        <div class="sri-story-tokens">
          <ScrollRevealImage v-bind="args" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Only the image props are passed, so frame size and crop point come from --scroll-reveal-frame-* and --scroll-reveal-image-focal-x/-y on an ancestor, changing at 768px. A prop, when passed, is written inline and wins.",
      },
    },
  },
};
