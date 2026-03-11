import { computed } from "vue";
import LayoutGridByCols from "../LayoutGridByCols.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof LayoutGridByCols> = {
  title: "Atoms/Content Layouts/Layout Grid By Cols",
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
      description:
        "Accessible label for the grid — required when tag is section (rendered as a visually hidden element)",
      table: { category: "Semantic" },
    },
    itemCount: {
      control: { type: "range", min: 0, max: 18, step: 1 },
      description: "Number of grid cells to render — must match the number of #item-{n} slots provided",
    },
    columnCount: {
      control: { type: "range", min: 1, max: 8, step: 1 },
      description:
        "Integer → repeat(N, 1fr) equal columns. CSS string (e.g. '200px', '15rem') → repeat(auto-fill, minmax(value, 1fr)) wrapping columns.",
    },
    gap: {
      control: "text",
      description: "Grid gap — any valid CSS length (e.g. '1rem', '2.4rem', '16px')",
    },
    singleColBelow: {
      control: "text",
      description:
        "Container width below which the grid collapses to a single column — any valid CSS length (e.g. '600px', '40rem'). Default '0px' means never collapse.",
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
  },
  args: {
    tag: "div",
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
          "A CSS grid wrapper driven by props. Content is placed via dynamic named slots (#item-0, #item-1, …). Pass an integer to columnCount for N equal columns, or a CSS width string for auto-fill behaviour. The grid collapses to a single column below singleColBelow using a CSS container query.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LayoutGridByCols>;

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

// Normalise args: explicitly maps each prop so no raw slider number leaks through to the component.
// colWidth: 0 → undefined (not set), N → "Nrem" CSS string.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toStoryArgs = (args: any) =>
  computed(() => ({
    tag: args.tag as "div" | "section",
    label: args.label as string,
    itemCount: Number(args.itemCount),
    columnCount: args.columnCount as number,
    gap: args.gap as string,
    singleColBelow: args.singleColBelow as string,
    styleClassPassthrough: args.styleClassPassthrough as string[],
  }));

// ─── Stories ──────────────────────────────────────────────────────────────────

/** Default — equal columns. Adjust columns, colWidth and itemCount with the sliders. */
export const Default: Story = {
  args: {
    itemCount: 6,
    columnCount: 3,
  },
  render: (args) => ({
    components: { LayoutGridByCols },
    setup() {
      return { storyArgs: toStoryArgs(args) };
    },
    template: `
      <LayoutGridByCols v-bind="storyArgs">
        ${allSlots}
      </LayoutGridByCols>
    `,
  }),
};

/** Single column below a breakpoint — collapses to stacked layout on narrow containers. */
export const SingleColBelow: Story = {
  name: "Single Column Below 600px",
  args: {
    itemCount: 6,
    columnCount: 3,
    singleColBelow: "600px",
  },
  render: (args) => ({
    components: { LayoutGridByCols },
    setup() {
      return { storyArgs: toStoryArgs(args) };
    },
    template: `
      <LayoutGridByCols v-bind="storyArgs">
        ${allSlots}
      </LayoutGridByCols>
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
    columnCount: 3,
    gap: "3.2rem",
  },
  render: (args) => ({
    components: { LayoutGridByCols },
    setup() {
      return { storyArgs: toStoryArgs(args) };
    },
    template: `
      <LayoutGridByCols v-bind="storyArgs">
        ${allSlots}
      </LayoutGridByCols>
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
    columnCount: 3,
  },
  render: (args) => ({
    components: { LayoutGridByCols },
    setup() {
      return { storyArgs: toStoryArgs(args) };
    },
    template: `
      <LayoutGridByCols v-bind="storyArgs">
        ${allSlots}
      </LayoutGridByCols>
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
    components: { LayoutGridByCols },
    setup() {
      return { storyArgs: toStoryArgs(args) };
    },
    template: `<LayoutGridByCols v-bind="storyArgs" />`,
  }),
};
