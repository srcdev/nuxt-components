import type { Meta, StoryFn } from "@nuxtjs/storybook";
import GridStackComponent from "../GridStack.vue";
import BannerVideoComponent from "../../../banner-video/BannerVideo.vue";

interface GridStackArgs {
  tag: "div" | "section" | "article" | "main";
  styleClassPassthrough: string[];
}

export default {
  title: "Atoms/Layout/GridStack",
  component: GridStackComponent,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "article", "main"],
      description: "HTML element rendered as the root",
      table: { category: "Markup" },
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
  },
  args: {
    tag: "div",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "Stacks slot content in the z-axis using `grid-template-areas` — no `position: absolute`. All named slots share a single grid area (`stack`), so they overlap in DOM order: the last slot renders on top. The container sizes to the tallest child (usually the base layer). Slot names are free-form; `layer-1`, `layer-2`, etc. is the conventional pattern.",
      },
    },
  },
} as Meta<GridStackArgs>;

// ── Two layers ──────────────────────────────────────────────────────────────

const TwoLayersTemplate: StoryFn<GridStackArgs> = (args) => ({
  components: { GridStackComponent },
  setup() {
    return { args };
  },
  template: `
    <GridStackComponent :tag="args.tag" :style-class-passthrough="args.styleClassPassthrough">
      <template #layer-1>
        <div style="display: flex; align-items: center; justify-content: center; min-block-size: 24rem; background: #e2e8f0; border-radius: 0.8rem; font-size: 1.4rem; font-weight: 600; color: #475569;">
          layer-1 (base)
        </div>
      </template>
      <template #layer-2>
        <div style="display: flex; align-items: flex-end; justify-content: flex-start; padding: 2rem; background: linear-gradient(to top, rgba(15,23,42,0.6) 0%, transparent 60%); border-radius: 0.8rem; pointer-events: none; color: white; font-size: 1.4rem; font-weight: 600;">
          layer-2 (overlay)
        </div>
      </template>
    </GridStackComponent>
  `,
});

export const TwoLayers = TwoLayersTemplate.bind({});
TwoLayers.args = {};
TwoLayers.parameters = {
  docs: {
    description: {
      story:
        "The most common use: a base layer that drives the container height, with a second layer overlaid on top. The overlay uses `pointer-events: none` so the base layer remains interactive.",
    },
  },
};

// ── Three layers ─────────────────────────────────────────────────────────────

const ThreeLayersTemplate: StoryFn<GridStackArgs> = (args) => ({
  components: { GridStackComponent },
  setup() {
    return { args };
  },
  template: `
    <GridStackComponent :tag="args.tag" :style-class-passthrough="args.styleClassPassthrough">
      <template #layer-1>
        <div style="display: flex; align-items: center; justify-content: center; min-block-size: 28rem; background: #e2e8f0; border-radius: 0.8rem; font-size: 1.4rem; font-weight: 600; color: #475569;">
          layer-1 (base)
        </div>
      </template>
      <template #layer-2>
        <div style="display: flex; align-items: center; justify-content: center; margin: 2rem; border-radius: 0.6rem; border: 2px dashed #f97316; background: rgba(249,115,22,0.1); color: #c2410c; font-size: 1.4rem; font-weight: 600;">
          layer-2 (mid)
        </div>
      </template>
      <template #layer-3>
        <div style="display: flex; align-items: flex-end; justify-content: flex-start; padding: 2rem; background: linear-gradient(to top, rgba(15,23,42,0.6) 0%, transparent 50%); border-radius: 0.8rem; pointer-events: none; color: white; font-size: 1.4rem; font-weight: 600;">
          layer-3 (top)
        </div>
      </template>
    </GridStackComponent>
  `,
});

export const ThreeLayers = ThreeLayersTemplate.bind({});
ThreeLayers.args = {};
ThreeLayers.parameters = {
  docs: {
    description: {
      story:
        "Three layers stacked in the same grid area. DOM order is z-order — layer-3 is always on top regardless of z-index. The dashed mid-layer shows how intermediate layers behave.",
    },
  },
};

// ── BannerVideo with overlay ──────────────────────────────────────────────────

const VideoOverlayTemplate: StoryFn<GridStackArgs> = (args) => ({
  components: { GridStackComponent, BannerVideoComponent },
  setup() {
    return { args };
  },
  template: `
    <GridStackComponent :tag="args.tag" :style-class-passthrough="args.styleClassPassthrough">
      <template #layer-1>
        <BannerVideoComponent
          src="/images/banners/video/lake-banner.mp4"
          poster="/images/banners/video/lake-banner.jpg"
          alt="A serene lake landscape"
          :img-width="1920"
          :img-height="1080"
          max-height="56rem"
          aspect-ratio="21/9"
          object-fit="cover"
          vertical-position="center"
          horizontal-position="center"
        />
      </template>
      <template #layer-2>
        <div style="display: grid; place-items: center; pointer-events: none;">
          <div style="text-align: center; padding: 2.4rem; pointer-events: auto;">
            <p style="font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: white; margin-block-end: 0.8rem; opacity: 0.8;">
              GridStack layer-2
            </p>
            <h2 style="font-size: 4rem; font-weight: 700; color: white; margin-block-end: 1.2rem; text-shadow: 0 2px 12px rgba(0,0,0,0.5);">
              Content over video
            </h2>
            <p style="font-size: 1.6rem; color: white; opacity: 0.9; text-shadow: 0 1px 6px rgba(0,0,0,0.4);">
              No <code style="font-family: monospace; background: rgba(0,0,0,0.3); padding: 0.1em 0.4em; border-radius: 0.3rem;">position: absolute</code> required.
            </p>
          </div>
        </div>
      </template>
    </GridStackComponent>
  `,
});

export const WithVideoOverlay = VideoOverlayTemplate.bind({});
WithVideoOverlay.args = {};
WithVideoOverlay.parameters = {
  docs: {
    description: {
      story:
        "The primary intended use case: a BannerVideo as the base layer with a content overlay on top. The overlay container uses `pointer-events: none` so the video remains interactive; `pointer-events: auto` is restored on the text content itself.",
    },
  },
};
