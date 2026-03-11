import { computed } from "vue";
import LayoutGrid from "../LayoutGrid.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof LayoutGrid> = {
  title: "Atoms/Content Layouts/LayoutGrid",
  component: LayoutGrid,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section"],
      description: "Semantic HTML tag for the root element — use section with a label for landmark regions",
      table: { category: "Semantic" },
    },
    label: {
      control: "text",
      description: "Accessible label for the grid — required when tag is section (rendered as a visually hidden element)",
      table: { category: "Semantic" },
    },
    itemCount: {
      control: { type: "range", min: 0, max: 18, step: 1 },
      description: "Number of grid cells to render — must match the number of #item-{n} slots provided",
    },
    colCount: {
      control: { type: "range", min: 1, max: 8, step: 1 },
      description: "Number of columns — used when useMinMax is false",
    },
    colWidth: {
      control: { type: "range", min: 50, max: 500, step: 10 },
      description: "Column width in px — used as a fixed track size or as the minmax minimum when useMinMax is true",
    },
    useMinMax: {
      control: "boolean",
      description: "Switch to auto-fill mode: repeat(auto-fill, minmax(colWidth, 1fr)) — columns wrap naturally based on available space",
    },
    gap: {
      control: "text",
      description: "Grid gap — any valid CSS length (e.g. '1rem', '2.4rem', '16px')",
    },
    singleColBelow: {
      control: "text",
      description: "Container width below which the grid collapses to a single column — any valid CSS length (e.g. '600px', '40rem'). Default '0px' means never collapse.",
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
  },
  args: {
    tag: "div",
    itemCount: 6,
    colCount: 3,
    colWidth: 200 as unknown as string,
    useMinMax: false,
    gap: "1rem",
    singleColBelow: "0px",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "A CSS grid wrapper driven by props. Content is placed via dynamic named slots (#item-0, #item-1, …). Column layout is controlled by colCount/colWidth or auto-fill via useMinMax. The grid collapses to a single column below singleColBelow using a CSS container query.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LayoutGrid>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const colours = [
  { bg: "#dbeafe", fg: "#1e40af" },
  { bg: "#dcfce7", fg: "#166534" },
  { bg: "#fef3c7", fg: "#92400e" },
  { bg: "#ede9fe", fg: "#5b21b6" },
  { bg: "#fce7f3", fg: "#9d174d" },
  { bg: "#ffedd5", fg: "#9a3412" },
  { bg: "#f0fdf4", fg: "#14532d" },
  { bg: "#fdf4ff", fg: "#7e22ce" },
];

const cell = (label: string, index: number, body = "Placeholder content for this grid cell.") =>
  `<div style="padding: 2.4rem; background: ${colours[index % colours.length]?.bg}; border-radius: 0.8rem; color: ${colours[index % colours.length]?.fg}; font-family: sans-serif; height: 100%;">
    <strong style="display: block; margin-bottom: 0.8rem;">${label}</strong>
    <p style="margin: 0; font-size: 1.4rem; line-height: 1.6; opacity: 0.8;">${body}</p>
  </div>`;

// Pre-generate max slots — the component only renders up to itemCount, extras are ignored.
const allSlots = Array.from(
  { length: 18 },
  (_, i) => `<template #item-${i}>${cell(`Item ${i + 1}`, i)}</template>`
).join("\n        ");

// Merges all args and normalises colWidth from the slider number to a CSS string.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withPxColWidth = (args: any) =>
  computed(() => ({ ...args, colWidth: `${args.colWidth}px` }));

// ─── Stories ──────────────────────────────────────────────────────────────────

/** Default — three equal columns, adjust colCount, colWidth and itemCount with the controls. */
export const Default: Story = {
  args: {
    itemCount: 6,
    colCount: 3,
    colWidth: 200 as unknown as string,
  },
  render: (args) => ({
    components: { LayoutGrid },
    setup() {
      return { storyArgs: withPxColWidth(args) };
    },
    template: `
      <LayoutGrid v-bind="storyArgs">
        ${allSlots}
      </LayoutGrid>
    `,
  }),
};

/** Equal fractional columns — columns share space evenly regardless of viewport width. */
export const FractionalColumns: Story = {
  name: "Fractional Columns (1fr)",
  args: {
    itemCount: 8,
    colCount: 4,
  },
  render: (args) => ({
    components: { LayoutGrid },
    setup() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const storyArgs = computed(() => ({ ...(args as any), colWidth: "1fr" }));
      return { storyArgs };
    },
    template: `
      <LayoutGrid v-bind="storyArgs">
        ${allSlots}
      </LayoutGrid>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "colWidth set to '1fr' — all columns share available space equally.",
      },
    },
  },
};

/** Auto-fill — columns fill based on a minimum width, wrapping naturally. */
export const AutoFill: Story = {
  name: "Auto-fill (useMinMax)",
  args: {
    itemCount: 8,
    useMinMax: true,
    colWidth: 200 as unknown as string,
  },
  render: (args) => ({
    components: { LayoutGrid },
    setup() {
      return { storyArgs: withPxColWidth(args) };
    },
    template: `
      <LayoutGrid v-bind="storyArgs">
        ${allSlots}
      </LayoutGrid>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "With useMinMax enabled, columns are at least colWidth wide and stretch to fill available space. The number of columns adjusts automatically — resize the viewport to see wrapping.",
      },
    },
  },
};

/** Single column below a breakpoint — collapses to stacked layout on narrow containers. */
export const SingleColBelow: Story = {
  name: "Single Column Below 600px",
  args: {
    itemCount: 6,
    colCount: 3,
    colWidth: 200 as unknown as string,
    singleColBelow: "600px",
  },
  render: (args) => ({
    components: { LayoutGrid },
    setup() {
      return { storyArgs: withPxColWidth(args) };
    },
    template: `
      <LayoutGrid v-bind="storyArgs">
        ${allSlots}
      </LayoutGrid>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Below 600px container width the grid collapses to a single column via a CSS container query. Resize the canvas to see the switch.",
      },
    },
  },
};

/** Custom gap — wider spacing between cells. */
export const CustomGap: Story = {
  name: "Custom Gap",
  args: {
    itemCount: 6,
    colCount: 3,
    colWidth: 200 as unknown as string,
    gap: "3.2rem",
  },
  render: (args) => ({
    components: { LayoutGrid },
    setup() {
      return { storyArgs: withPxColWidth(args) };
    },
    template: `
      <LayoutGrid v-bind="storyArgs">
        ${allSlots}
      </LayoutGrid>
    `,
  }),
};

/** Semantic section — tag='section' with a visually hidden label for accessibility. */
export const SemanticSection: Story = {
  name: "Semantic Section",
  args: {
    tag: "section",
    label: "Feature highlights",
    itemCount: 6,
    colCount: 3,
    colWidth: 200 as unknown as string,
  },
  render: (args) => ({
    components: { LayoutGrid },
    setup() {
      return { storyArgs: withPxColWidth(args) };
    },
    template: `
      <LayoutGrid v-bind="storyArgs">
        ${allSlots}
      </LayoutGrid>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "When tag is section, an aria-labelledby attribute is added and the label is rendered as a visually hidden element for screen readers.",
      },
    },
  },
};

/** Zero items — renders an empty grid with no cells. */
export const ZeroItems: Story = {
  name: "Zero Items",
  args: {
    itemCount: 0,
  },
  render: (args) => ({
    components: { LayoutGrid },
    setup() {
      return { args };
    },
    template: `<LayoutGrid v-bind="args" />`,
  }),
};
