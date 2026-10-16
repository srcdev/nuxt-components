import type { Meta, StoryObj } from "@nuxtjs/storybook";

interface DynamicBorderRadiusArgs {
  containerWidth: number;
  imageMaxWidth: number;
  radius: number;
  transition: boolean;
  duration: number;
}

const meta: Meta<DynamicBorderRadiusArgs> = {
  title: "Foundations/Utilities/Dynamic Border Radius",
  argTypes: {
    containerWidth: {
      control: { type: "range", min: 24, max: 120, step: 1 },
      description: "**Story control.** Width (rem) of the `container-type: inline-size` wrapper. You can also drag its corner.",
    },
    imageMaxWidth: {
      control: { type: "range", min: 20, max: 100, step: 1 },
      description: "**Story control.** `max-inline-size` (rem) of the image.",
    },
    radius: {
      control: { type: "range", min: 0, max: 10, step: 0.2 },
      description: "`--dynamic-border-radius` (rem): the radius while the element is narrower than its container. Default `5rem`.",
    },
    transition: {
      control: "boolean",
      description: "Adds `.dynamic-border-radius-transition` so the switch eases instead of snapping (skipped under `prefers-reduced-motion: reduce`). It reads the image's max width from `--dynamic-border-radius-max-width`, set here from `imageMaxWidth`.",
    },
    duration: {
      control: { type: "range", min: 100, max: 1500, step: 50 },
      description: "`--dynamic-border-radius-duration` (ms). Default `300ms`.",
      if: { arg: "transition" },
    },
  },
  args: {
    containerWidth: 80,
    imageMaxWidth: 50,
    radius: 5,
    transition: false,
    duration: 300,
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`.dynamic-border-radius` rounds an element's corners while it's narrower than its container and squares them once it spans the full container width, " +
          "so a capped image reads as a card on wide screens and as an edge-to-edge band on narrow ones. Needs an ancestor with `container-type: inline-size`. " +
          "See skill `css-dynamic-border-radius.md`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<DynamicBorderRadiusArgs>;

const imageStyle = "display: block; inline-size: 100%; block-size: auto; margin-inline: auto;";
const captionStyle = "margin: 0 0 1.2rem; font-family: sans-serif; font-size: 1.6rem; max-width: 70ch;";
const containerStyle =
  "container-type: inline-size; resize: horizontal; overflow: hidden; min-inline-size: 16rem; max-inline-size: 100%; padding-block: 1.6rem; outline: 1px dashed currentColor;";

/** Drag the container's corner (or the `containerWidth` control) below the image's max width and the corners square off. */
export const Default: Story = {
  render: (args) => ({
    setup() {
      return { args, imageStyle, captionStyle, containerStyle };
    },
    template: `
      <div>
        <p :style="captionStyle">
          Dashed outline: the container. Narrow it below the image's {{ args.imageMaxWidth }}rem max width and the
          image fills it, so the radius drops to 0. Widen it again and the {{ args.radius }}rem radius comes back.
        </p>
        <div :style="containerStyle + ' inline-size: ' + args.containerWidth + 'rem;'">
          <img
            class="dynamic-border-radius"
            :class="{ 'dynamic-border-radius-transition': args.transition }"
            src="/images/banners/video/lake-banner.jpg"
            alt=""
            width="1600"
            height="900"
            :style="imageStyle + (' max-inline-size: ' + args.imageMaxWidth + 'rem; --dynamic-border-radius-max-width: ' + args.imageMaxWidth + 'rem; --dynamic-border-radius: ' + args.radius + 'rem; --dynamic-border-radius-duration: ' + args.duration + 'ms;')"
          >
        </div>
      </div>
    `,
  }),
};

/** Same as Default with `.dynamic-border-radius-transition`: drag the container across the image's max width and the corners ease. The max width comes from `--dynamic-border-radius-max-width`, not `100%`, so shrinking the container doesn't flicker the radius. */
export const WithTransition: Story = {
  ...Default,
  name: "With Transition",
  args: { transition: true, duration: 400 },
};

/**
 * Side by side: a correct setup, the same image with no container ancestor, and the class on a
 * plain card instead of an image.
 */
export const Comparison: Story = {
  args: { containerWidth: 40, imageMaxWidth: 50 },
  render: (args) => ({
    setup() {
      return { args, imageStyle, captionStyle, containerStyle };
    },
    template: `
      <div style="display: grid; gap: 3.2rem; font-family: sans-serif;">
        <section>
          <p :style="captionStyle"><strong>Correct:</strong> wrapper has <code>container-type: inline-size</code>. The image fills the {{ args.containerWidth }}rem container, so its corners are square.</p>
          <div :style="containerStyle + ' inline-size: ' + args.containerWidth + 'rem;'">
            <img class="dynamic-border-radius" src="/images/page/hero/hero-blonde.jpg" alt="" width="1600" height="900"
              :style="imageStyle + ' max-inline-size: ' + args.imageMaxWidth + 'rem; --dynamic-border-radius: ' + args.radius + 'rem;'">
          </div>
        </section>
        <section>
          <p :style="captionStyle"><strong>No container ancestor:</strong> <code>100cqi</code> falls back to the viewport width, so the image stays rounded even though it fills its wrapper. It only squares when it's as wide as the screen.</p>
          <div :style="'inline-size: ' + args.containerWidth + 'rem; padding-block: 1.6rem; outline: 1px dashed currentColor;'">
            <img class="dynamic-border-radius" src="/images/page/hero/hero-blonde.jpg" alt="" width="1600" height="900"
              :style="imageStyle + ' max-inline-size: ' + args.imageMaxWidth + 'rem; --dynamic-border-radius: ' + args.radius + 'rem;'">
          </div>
        </section>
        <section>
          <p :style="captionStyle"><strong>Any element:</strong> the same class on a card. Drag the container narrower than the card's 40rem max width.</p>
          <div :style="containerStyle + ' inline-size: 60rem;'">
            <div class="dynamic-border-radius"
              :style="'max-inline-size: 40rem; margin-inline: auto; padding: 2.4rem; background: var(--theme-surface-subtle, #eef); color: var(--theme-text, #111); --dynamic-border-radius: ' + args.radius + 'rem;'">
              A card with <code>.dynamic-border-radius</code>.
            </div>
          </div>
        </section>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The middle panel is the common mistake: without a `container-type` ancestor the class doesn't error, it just measures the viewport instead.",
      },
    },
  },
};
