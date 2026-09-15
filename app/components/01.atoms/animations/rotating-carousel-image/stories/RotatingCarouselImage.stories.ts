import RotatingCarouselImage from "../RotatingCarouselImage.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { CarouselImageData } from "~/types/components";

type StoryArgs = {
  data?: CarouselImageData[];
  rotateX?: number;
  perspective?: number;
  translateZ?: number;
  pauseOnHover?: boolean;
  useParallaxEffect?: boolean;
  showControls?: boolean;
  respectReducedMotion?: boolean;
  ariaLabel?: string;
  ariaDescription?: string;
  playIcon?: string;
  pauseIcon?: string;
  playLabel?: string;
  pauseLabel?: string;
};

const carouselData: CarouselImageData[] = Array.from({ length: 8 }, (_, index) => ({
  src: `https://picsum.photos/seed/rotating-carousel-${index}/400/500`,
  alt: `Rotating carousel image ${index + 1}`,
}));

const meta: Meta<StoryArgs> = {
  title: "Atoms/Animations/RotatingCarouselImage",
  component: RotatingCarouselImage,
  argTypes: {
    data: {
      control: "object",
      description: "Array of `{ src, alt }` images rendered around the rotation",
      table: { category: "Content" },
    },
    rotateX: {
      control: { type: "range", min: -32, max: 32, step: 1 },
      description: "Static X-axis tilt in degrees — ignored while `useParallaxEffect` is true",
      table: { category: "Rotation" },
    },
    perspective: {
      control: { type: "range", min: 200, max: 3000, step: 50 },
      description: "CSS perspective distance in pixels",
      table: { category: "Rotation" },
    },
    translateZ: {
      control: { type: "range", min: 200, max: 3000, step: 50 },
      description: "Radius of the rotation — distance each item sits from the centre, in pixels",
      table: { category: "Rotation" },
    },
    pauseOnHover: {
      control: "boolean",
      description: "Pauses the rotation while the pointer hovers over the carousel",
      table: { category: "Interaction" },
    },
    useParallaxEffect: {
      control: "boolean",
      description: "Drives the tilt from scroll position instead of the static `rotateX` prop",
      table: { category: "Interaction" },
    },
    showControls: {
      control: "boolean",
      description: "Shows a visible pause/play button (required for WCAG 2.2.2 on any auto-rotating content)",
      table: { category: "Accessibility" },
    },
    respectReducedMotion: {
      control: "boolean",
      description: "Auto-pauses and disables the animation when the user has prefers-reduced-motion set",
      table: { category: "Accessibility" },
    },
    ariaLabel: {
      control: "text",
      table: { category: "Accessibility" },
    },
    ariaDescription: {
      control: "text",
      table: { category: "Accessibility" },
    },
    playIcon: {
      control: "text",
      description: "Iconify icon name shown on the control button while paused",
      table: { category: "Control button" },
    },
    pauseIcon: {
      control: "text",
      description: "Iconify icon name shown on the control button while playing",
      table: { category: "Control button" },
    },
    playLabel: {
      control: "text",
      description: "Control button aria-label while paused — override for localisation",
      table: { category: "Control button" },
    },
    pauseLabel: {
      control: "text",
      description: "Control button aria-label while playing — override for localisation",
      table: { category: "Control button" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A 3D rotating carousel of images. By default the tilt follows scroll position (`useParallaxEffect`); disable it to use a static `rotateX`. Supports keyboard pause (spacebar), an optional visible pause/play button, and respects prefers-reduced-motion.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const WithControls: Story = {
  args: {
    data: carouselData,
    rotateX: 0,
    perspective: 1000,
    translateZ: 1000,
    pauseOnHover: false,
    useParallaxEffect: false,
    showControls: true,
    respectReducedMotion: true,
    ariaLabel: "Rotating image carousel",
  },
  render: (args) => ({
    components: { RotatingCarouselImage },
    setup() {
      return { args };
    },
    template: `<RotatingCarouselImage v-bind="args" />`,
  }),
};

export const ScrollParallax: Story = {
  args: {
    data: carouselData,
    perspective: 1000,
    translateZ: 1000,
    useParallaxEffect: true,
    showControls: true,
  },
  render: (args) => ({
    components: { RotatingCarouselImage },
    setup() {
      return { args };
    },
    template: `
      <div>
        <p style="text-align: center; padding: 2rem;">Scroll this preview to tilt the carousel.</p>
        <div style="height: 60svh;"></div>
        <RotatingCarouselImage v-bind="args" />
        <div style="height: 60svh;"></div>
      </div>
    `,
  }),
};
