import { computed } from "vue";
import LayoutGridByCols from "../LayoutGridByCols.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

type StoryArgs = InstanceType<typeof LayoutGridByCols>["$props"] & { itemCount?: number };

const meta: Meta<StoryArgs> = {
  title: "Atoms/Content Wrappers/Layout Grid By Cols",
  component: LayoutGridByCols,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section"],
      description: "Semantic HTML tag for the root element — use section with a label for landmark regions",
      table: { category: "Semantic" },
    },
    label: {
      control: "text",
      description: "Accessible name when tag is section (rendered as a visually hidden element)",
      table: { category: "Semantic" },
    },
    itemCount: {
      control: { type: "range", min: 0, max: 18, step: 1 },
      description: "Story only: how many #item-{n} slots to pass",
      table: { category: "Story" },
    },
    columnCount: {
      control: { type: "range", min: 2, max: 6, step: 1 },
      description: "Equal columns above singleColBelow (2–6). Writes --layout-grid-by-cols-column-count.",
      table: { category: "Layout" },
    },
    gap: {
      control: "text",
      description: "Row and column gap, a single CSS length. Writes --layout-grid-by-cols-gap.",
      table: { category: "Layout" },
    },
    singleColBelow: {
      control: "text",
      description:
        "Grid width below which it collapses to one column. '0px' never collapses. Writes --layout-grid-by-cols-single-col-below.",
      table: { category: "Layout" },
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
  },
  args: {
    tag: "div",
    label: "",
    itemCount: 6,
    columnCount: 3,
    gap: "1rem",
    singleColBelow: "768px",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "A CSS grid of N equal columns, filled from named dynamic slots in document order. Collapses to one column when the grid is narrower than singleColBelow. Every layout prop writes a public --layout-grid-by-cols-* token inline; leave a prop off to set its token from CSS instead.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const colours = [
  { bg: "#dbeafe", fg: "#1e40af" },
  { bg: "#dcfce7", fg: "#166534" },
  { bg: "#fef3c7", fg: "#92400e" },
  { bg: "#ede9fe", fg: "#5b21b6" },
  { bg: "#fce7f3", fg: "#9d174d" },
  { bg: "#ffedd5", fg: "#9a3412" },
];

const cellStyle = (i: number) =>
  `padding: 2.4rem; background: ${colours[i % colours.length]?.bg}; color: ${colours[i % colours.length]?.fg}; border-radius: 0.8rem; font-family: sans-serif; height: 100%;`;

const renderGrid = (args: StoryArgs) => ({
  components: { LayoutGridByCols },
  setup() {
    const componentArgs = computed(() => {
      const { itemCount: _itemCount, ...rest } = args;
      return rest;
    });
    const items = computed(() => Array.from({ length: Number(args.itemCount ?? 0) }, (_, i) => i));
    return { componentArgs, items, cellStyle };
  },
  template: `
    <LayoutGridByCols v-bind="componentArgs">
      <template v-for="i in items" :key="i" #[\`item-\${i}\`]>
        <div :style="cellStyle(i)">
          <strong style="display: block; margin-bottom: 0.8rem;">Item {{ i + 1 }}</strong>
          <p style="margin: 0; font-size: 1.4rem; line-height: 1.6; opacity: 0.8;">Placeholder content for this grid cell.</p>
        </div>
      </template>
    </LayoutGridByCols>
  `,
});

export const Default: Story = {
  render: (args) => renderGrid(args),
};

export const SingleColBelow: Story = {
  name: "Single Column Below 600px",
  args: {
    singleColBelow: "600px",
  },
  render: (args) => renderGrid(args),
  parameters: {
    docs: {
      description: {
        story: "Below 600px of grid width the grid collapses to one column. Resize the canvas to see the switch.",
      },
    },
  },
};

export const NeverCollapse: Story = {
  name: "Never Collapse",
  args: {
    columnCount: 4,
    singleColBelow: "0px",
  },
  render: (args) => renderGrid(args),
};

export const CustomGap: Story = {
  name: "Custom Gap",
  args: {
    gap: "3.2rem",
  },
  render: (args) => renderGrid(args),
};

export const SemanticSection: Story = {
  name: "Semantic Section",
  args: {
    tag: "section",
    label: "Feature highlights",
  },
  render: (args) => renderGrid(args),
  parameters: {
    docs: {
      description: {
        story:
          "When tag is section, the label is rendered as a visually hidden element and linked with aria-labelledby.",
      },
    },
  },
};

export const CssTokens: Story = {
  name: "CSS Tokens (no layout props)",
  args: {
    columnCount: undefined,
    gap: undefined,
    singleColBelow: undefined,
  },
  render: (args) => {
    const inner = renderGrid(args);
    return {
      ...inner,
      template: `
        <div class="lgbc-story-tokens">
          <component is="style">
            .lgbc-story-tokens {
              --layout-grid-by-cols-column-count: 2;
              --layout-grid-by-cols-row-gap: 0.8rem;
              --layout-grid-by-cols-column-gap: 2.4rem;
              --layout-grid-by-cols-single-col-below: 480px;
            }
            @media (width >= 1024px) {
              .lgbc-story-tokens {
                --layout-grid-by-cols-column-count: 4;
              }
            }
          </component>
          ${inner.template}
        </div>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story:
          "No layout props are passed, so columns, gaps and the collapse threshold come from tokens on an ancestor: 2 columns, 4 from 1024px viewport, one column below 480px of grid width, separate row and column gaps.",
      },
    },
  },
};

export const ZeroItems: Story = {
  name: "Zero Items",
  args: {
    itemCount: 0,
  },
  render: (args) => renderGrid(args),
};
