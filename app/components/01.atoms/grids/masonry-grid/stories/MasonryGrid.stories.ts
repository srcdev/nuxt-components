import { ref } from "vue";
import type { Meta, StoryFn } from "@nuxtjs/storybook";
import type { MediaCanvas } from "~/types/components";
import CanvasSwitcher from "../../../canvas-switcher/CanvasSwitcher.vue";
import MasonryGrid from "../MasonryGrid.vue";

interface MasonryGridArgs {
  tag: "div" | "section" | "article" | "main";
  itemMinWidth: number;
  gap: number;
  fixedWidth: boolean;
  justify: "left" | "center" | "right";
  styleClassPassthrough: string[];
}

const meta: Meta<MasonryGridArgs> = {
  title: "Atoms/Grids/MasonryGrid",
  component: MasonryGrid,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "article", "main"],
      description: "HTML tag to render as",
      table: { category: "Props" },
    },
    itemMinWidth: {
      control: { type: "select" },
      options: [160, 200, 240, 300, 360, 450],
      description: "Minimum tile width in pixels — also the fixed tile width when fixedWidth is set",
      table: { category: "Props" },
    },
    gap: {
      control: { type: "select" },
      options: [0, 4, 8, 12, 16, 24, 32],
      description: "Gap between tiles in pixels",
      table: { category: "Props" },
    },
    fixedWidth: {
      control: { type: "boolean" },
      description: "Keep every tile at exactly itemMinWidth instead of stretching to fill each column",
      table: { category: "Props" },
    },
    justify: {
      control: { type: "select" },
      options: ["left", "center", "right"],
      description: "How the block of tiles aligns within the wrapper — only visible when fixedWidth is set",
      table: { category: "Props" },
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
  },
  args: {
    tag: "div",
    itemMinWidth: 300,
    gap: 12,
    fixedWidth: false,
    justify: "left",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "A real masonry layout: each item is measured and placed into whichever column is " +
          "currently shortest (a greedy bin-pack), not CSS `columns`' column-fill. Renders " +
          "whatever slots the consumer passes, in natural DOM/reading order — no count/data prop " +
          "needed, and no reordering trick required (unlike a `columns`-based masonry) since " +
          "placement already follows the order items were authored in. Resize-reactive: items " +
          "animate into their new position (respecting `prefers-reduced-motion`) as the container " +
          "resizes. See `ColumnFlowGrid` for the lighter, non-measuring CSS `columns` alternative.",
      },
    },
  },
};

export default meta;

const itemStyle =
  "padding: 1.6rem; background: white; border-radius: 0.6rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08);";
const badgeStyle =
  "display: inline-flex; align-items: center; justify-content: center; width: 2.4rem; height: 2.4rem; " +
  "margin-bottom: 0.8rem; border-radius: 50%; background: #111827; color: white; font-weight: 700; " +
  "font-size: 1.3rem; font-family: monospace;";

// Each item shows its DOM/reading order as a numbered badge. Unlike a reading-order effect based
// on rearranging DOM order to match a visual grid, here the number is simply the authoring order —
// tab/screen-reader order always reads 1, 2, 3... regardless of which column an item's measured
// height ends up placing it in visually.
const paragraphPool = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio praesent libero sed cursus ante.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
];

const itemBadge = (n: number) => `<span style="${badgeStyle}">${n}</span><br />`;

interface DemoItem {
  slotName: string;
  index: number;
  bodyHtml: string;
}

// Built once per mount (not on every render) so a Controls-panel change doesn't reshuffle the
// demo content underneath it. Random paragraph counts (1-4) give genuinely uneven heights —
// necessary to actually see the shortest-column packing at work, unlike uniform-height tiles.
function buildDemoItems(count: number): DemoItem[] {
  return Array.from({ length: count }, (_, i) => {
    const paragraphCount = Math.floor(Math.random() * 4) + 1; // 1-4
    const bodyHtml = Array.from(
      { length: paragraphCount },
      () => `<p style="margin: 0 0 0.8rem;">${paragraphPool[Math.floor(Math.random() * paragraphPool.length)]}</p>`
    ).join("");
    return { slotName: `item-${i + 1}`, index: i + 1, bodyHtml };
  });
}

const Template: StoryFn<MasonryGridArgs> = (args) => ({
  components: { MasonryGrid },
  setup() {
    const items = buildDemoItems(12);
    return { args, items };
  },
  template: `
    <div style="padding: 3.2rem; background: #f9fafb;">
      <MasonryGrid v-bind="args">
        <template v-for="item in items" :key="item.slotName" #[item.slotName]>
          <div style="${itemStyle}">
            <span style="${badgeStyle}">{{ item.index }}</span><br />
            <div v-html="item.bodyHtml"></div>
          </div>
        </template>
      </MasonryGrid>
    </div>
  `,
});

export const Default = Template.bind({});
Default.parameters = {
  docs: {
    description: {
      story:
        "12 numbered items with 1-4 random paragraphs each, flowing into whichever column is " +
        "currently shortest. Resize the preview panel — items animate into their new positions, " +
        "and DOM/tab order always stays 1, 2, 3... regardless of which column each ends up in.",
    },
  },
};

export const NarrowColumns = Template.bind({});
NarrowColumns.args = { itemMinWidth: 160, gap: 8 };
NarrowColumns.parameters = {
  docs: {
    description: { story: "A smaller `itemMinWidth` fits more, narrower columns." },
  },
};

export const WideColumns = Template.bind({});
WideColumns.args = { itemMinWidth: 450, gap: 16 };
WideColumns.parameters = {
  docs: {
    description: { story: "A larger `itemMinWidth` fits fewer, wider columns." },
  },
};

export const FixedWidthCentered = Template.bind({});
FixedWidthCentered.storyName = "Fixed Width, Centered";
FixedWidthCentered.args = { fixedWidth: true, justify: "center", itemMinWidth: 240 };
FixedWidthCentered.parameters = {
  docs: {
    description: {
      story:
        "`fixedWidth` keeps every tile at exactly `itemMinWidth` instead of stretching to fill " +
        "each column — `justify` then controls how the resulting (narrower) block of tiles " +
        "aligns within the available width.",
    },
  },
};

export const TwoItems: StoryFn<MasonryGridArgs> = (args) => ({
  components: { MasonryGrid },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 3.2rem; background: #f9fafb;">
      <MasonryGrid v-bind="args">
        <template #item-1>
          <div style="${itemStyle}">${itemBadge(1)}Only two items provided</div>
        </template>
        <template #item-2>
          <div style="${itemStyle}">
            ${itemBadge(2)}No count prop to keep in sync — the grid just renders whichever
            slots you give it.
          </div>
        </template>
      </MasonryGrid>
    </div>
  `,
});
TwoItems.storyName = "Two Items (no count prop needed)";

export const StressTest: StoryFn = () => ({
  components: { MasonryGrid },
  template: `
    <MasonryGrid :item-min-width="220" :gap="12">
          <template #item-1><div style="padding: 1.2rem; background: var(--theme-surface-subtle); outline: 1px dashed currentColor;"><h3 style="margin: 0;">Supercalifragilisticexpialidociousandthensomemoretextwithoutanyspaces</h3><p style="margin: 0;">https://example.com/a/very/long/unbroken/path/that/never/wraps/on/its/own</p></div></template>
          <template #item-2><div style="padding: 1.2rem; background: var(--theme-surface-subtle); outline: 1px dashed currentColor;"><p style="margin: 0;">Ein sehr langer Beschreibungstext aus Northtown, der auf schmalen Bildschirmen mehrfach umbrechen muss, ohne das Raster zu sprengen oder die Nachbarspalten zusammenzudrücken.</p></div></template>
          <template #item-3><div style="padding: 1.2rem; background: var(--theme-surface-subtle); outline: 1px dashed currentColor;"><img src="/images/banners/banner-1.webp" width="1600" height="400" alt="" style="display: block; max-inline-size: 100%; block-size: auto;"></div></template>
          <template #item-4><div style="padding: 1.2rem; background: var(--theme-surface-subtle); outline: 1px dashed currentColor;"><p style="margin: 0;">🙂 👍🏽 👨‍👩‍👧 &lt;b&gt;Not bold&lt;/b&gt;</p></div></template>
          <template #item-5><div style="padding: 1.2rem; background: var(--theme-surface-subtle); outline: 1px dashed currentColor;"><p style="margin: 0;" dir="rtl">مرحبا بالعالم، نص طويل من اليمين إلى اليسار</p></div></template>
          <template #item-6><div style="padding: 1.2rem; background: var(--theme-surface-subtle); outline: 1px dashed currentColor;"></div></template>
          <template #item-7><div style="padding: 1.2rem; background: var(--theme-surface-subtle); outline: 1px dashed currentColor;"><p style="margin: 0;">x</p></div></template>
          <template #item-8><div style="padding: 1.2rem; background: var(--theme-surface-subtle); outline: 1px dashed currentColor;"><h3 style="margin: 0;">Supercalifragilisticexpialidociousandthensomemoretextwithoutanyspaces</h3><p style="margin: 0;">https://example.com/a/very/long/unbroken/path/that/never/wraps/on/its/own</p></div></template>
          <template #item-9><div style="padding: 1.2rem; background: var(--theme-surface-subtle); outline: 1px dashed currentColor;"><p style="margin: 0;">Ein sehr langer Beschreibungstext aus Northtown, der auf schmalen Bildschirmen mehrfach umbrechen muss, ohne das Raster zu sprengen oder die Nachbarspalten zusammenzudrücken.</p></div></template>
        </MasonryGrid>
  `,
});
StressTest.storyName = "Stress Test (Worst-Case Data)";
StressTest.decorators = [
    (story, context) => ({
      components: { story, CanvasSwitcher },
      setup() {
        const canvasName = ref<MediaCanvas>(context.parameters.initialCanvas ?? "mobileCanvas");
        return { canvasName };
      },
      template: `
        <div style="padding: 1.2rem 1.6rem; border-block-end: 1px solid currentColor;">
          <CanvasSwitcher v-model:canvas-name="canvasName" />
        </div>
        <div :class="canvasName" style="margin-inline: auto; padding: 2rem; outline: 1px dashed currentColor;">
          <story />
        </div>
      `,
    }),
  ];
StressTest.parameters = {
    layout: "fullscreen",
    docs: {
      story: { inline: false, height: "720px" },
      description: {
        story:
          "Oversized and hostile slot content at every `CanvasSwitcher` width. Check that: the unbroken heading and URL wrap inside their cell instead of widening it; the German paragraph wraps; the 1600px image scales down to its cell; emoji, `<b>` and right-to-left text render as text; the empty and one-character cells keep their place; no neighbouring cell is squeezed to nothing and nothing scrolls sideways. When a tile changes height after the first layout (a late-loading font or image, or text re-wrapping), the tiles below it re-pack instead of overlapping; until 2026-10-21 only a container width change re-packed.",
      },
    },
  };
