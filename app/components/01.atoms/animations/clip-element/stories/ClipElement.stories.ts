import ClipElement from "../ClipElement.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof ClipElement> = {
  title: "Atoms/Effects/ClipElement",
  component: ClipElement,
  argTypes: {
    maxClip: {
      control: { type: "number", min: 0, step: 10 },
      description: "Scroll distance (px) over which the element clips in as it enters the viewport, and clips further out as it scrolls above it.",
      table: { category: "Behaviour" },
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Clips its slot content in from the top edge as it scrolls into the viewport, using a scroll listener to drive a `clip-path: inset(...)` value. For a CSS-only, listener-free parallax reveal, prefer ScrollRevealFrame/ScrollRevealImage instead — reach for ClipElement only when you specifically need this scroll-position-driven clip behaviour.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ClipElement>;

// A fixed marker at the top of the viewport, since that's exactly where the
// clip finishes resolving (top === 0) — makes the effect's endpoint visible
// instead of something you have to guess at while scrolling.
const topMarker = `
  <div style="position: fixed; top: 0; left: 0; right: 0; height: 2px; background: #ff5c5c; z-index: 10;"></div>
  <div style="position: fixed; top: 6px; left: 12px; font-size: 1.2rem; color: #ff5c5c; z-index: 10;">clip fully resolves at this line ↑</div>
`;

// Horizontal rules baked into the image itself so the wipe boundary is
// visible against the photo, not just a subtle crop of pixels.
const rulerOverlayStyle = `
  background-image: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 49px,
    rgba(255, 92, 92, 0.6) 49px,
    rgba(255, 92, 92, 0.6) 50px
  );
`;

const scrollWrapper = (maxClip: number, inner: string) => `
  ${topMarker}
  <div style="padding-block: 30vh 6px; max-width: 860px; margin-inline: auto;">
    <p style="text-align: center; font-size: 1.4rem; opacity: 0.6; margin-block-end: 1rem;">
      Scroll slowly — the image clips in over the ${maxClip}px just before it reaches the red line.
    </p>
  </div>
  ${inner}
  <div style="height: 100vh;"></div>
`;

export const Default: Story = {
  args: {
    maxClip: 100,
  },
  render: (args) => ({
    components: { ClipElement },
    setup() {
      return { args };
    },
    template: scrollWrapper(
      args.maxClip ?? 100,
      `
      <div style="max-width: 860px; margin-inline: auto; position: relative;">
        <ClipElement v-bind="args">
          <div style="position: relative;">
            <img
              src="/images/page/hero/hero-blonde.jpg"
              alt="Blonde hair portrait"
              style="display: block; width: 100%;"
            />
            <div style="position: absolute; inset: 0; ${rulerOverlayStyle}"></div>
          </div>
        </ClipElement>
      </div>
    `
    ),
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Default props — the ruled overlay makes the clip boundary visible as it wipes in over the last 100px before the image reaches the top of the viewport (marked by the red line).",
      },
    },
  },
};

export const LargeClipDistance: Story = {
  args: {
    maxClip: 500,
  },
  render: (args) => ({
    components: { ClipElement },
    setup() {
      return { args };
    },
    template: scrollWrapper(
      args.maxClip ?? 500,
      `
      <div style="max-width: 860px; margin-inline: auto; position: relative;">
        <ClipElement v-bind="args">
          <div style="position: relative;">
            <img
              src="/images/page/hero/hero-blonde.jpg"
              alt="Blonde hair portrait"
              style="display: block; width: 100%;"
            />
            <div style="position: absolute; inset: 0; ${rulerOverlayStyle}"></div>
          </div>
        </ClipElement>
      </div>
    `
    ),
  }),
  parameters: {
    docs: {
      description: {
        story:
          "A much larger maxClip (500px) stretches the wipe over a longer, easier-to-watch scroll distance — useful for previewing the effect without scrolling pixel-by-pixel.",
      },
    },
  },
};
