import type { Meta, StoryFn } from "@nuxtjs/storybook";
import MasonryGrid from "../MasonryGrid.vue";

interface MasonryGridArgs {
  tag: "div" | "section" | "article" | "main";
  itemMinWidth: number;
  gap: number;
  unit: string;
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
      control: { type: "number" },
      description: "Minimum column width in pixels — drives `columns: auto <value>px`",
      table: { category: "Props" },
    },
    gap: {
      control: { type: "number" },
      description: "Gap between columns/items, in `unit`",
      table: { category: "Props" },
    },
    unit: {
      control: { type: "text" },
      description: "CSS unit applied to `gap` (e.g. `rem`, `px`)",
      table: { category: "Props" },
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
  },
  args: {
    tag: "div",
    itemMinWidth: 300,
    gap: 1.2,
    unit: "rem",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "A CSS `columns`-based masonry layout. Renders whatever slots the consumer passes — no " +
          "count/data prop needed (named dynamic slots, like `AutoGrid`/`GridStack`). Each item's " +
          "height is whatever its content needs; items flow into the shortest available column.",
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

// Each item shows its DOM order (slot index) as a numbered badge so you can see how masonry's
// column-fill algorithm actually orders items — it's not simple row-by-row order, so an item's
// position in the visual grid doesn't always match its number sequentially top-to-bottom.
const itemBadge = (n: number) => `<span style="${badgeStyle}">${n}</span><br />`;

const paragraphPool = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio praesent libero sed cursus ante.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores.",
];

interface DemoItem {
  slotName: string;
  index: number;
  bodyHtml: string;
}

// Generates a random number of paragraphs (1-4) per item so item heights vary unpredictably —
// closer to real content than a handful of hand-written examples, and enough items (12) to
// actually show multi-column masonry flow. Built once per mount, not on every render, so a
// Controls-panel change (itemMinWidth/gap) doesn't reshuffle the demo content underneath it.
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
        "12 items with a random 1-4 paragraphs each, flowing into auto-sized columns at least " +
        "300px wide. Each item is numbered with its slot/DOM order — resize the preview to change " +
        "the column count and see how the numbering no longer reads strictly top-to-bottom per " +
        "column once items wrap, since column-fill picks whichever column is currently shortest.",
    },
  },
};

export const NarrowColumns = Template.bind({});
NarrowColumns.args = { itemMinWidth: 160, gap: 0.8 };
NarrowColumns.parameters = {
  docs: {
    description: { story: "A smaller `itemMinWidth` fits more, narrower columns." },
  },
};

export const WideColumns = Template.bind({});
WideColumns.args = { itemMinWidth: 450, gap: 2 };
WideColumns.parameters = {
  docs: {
    description: { story: "A larger `itemMinWidth` fits fewer, wider columns." },
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
