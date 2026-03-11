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
    columns: {
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
    columns: 3,
    gap: "1rem",
    singleColBelow: "0px",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "A CSS grid wrapper driven by props. Content is placed via dynamic named slots (#item-0, #item-1, …). Pass an integer to columns for N equal columns, or a CSS width string for auto-fill behaviour. The grid collapses to a single column below singleColBelow using a CSS container query.",
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

// ─── Stories ──────────────────────────────────────────────────────────────────

/** Default — equal columns. Integer columns prop controls count; slider adjusts it live. */
export const Default: Story = {
  args: {
    itemCount: 6,
    columns: 3,
  },
  render: (args) => ({
    components: { LayoutGrid },
    setup() {
      return { args };
    },
    template: `
      <LayoutGrid v-bind="args">
        ${allSlots}
      </LayoutGrid>
    `,
  }),
};

/** Auto-fill — columns prop is a CSS width string; browser fills as many as fit. */
export const AutoFill: Story = {
  name: "Auto-fill (CSS width string)",
  args: {
    itemCount: 12,
    columns: "200px" as unknown as number,
  },
  render: (args) => ({
    components: { LayoutGrid },
    setup() {
      return { args };
    },
    template: `
      <LayoutGrid v-bind="args">
        ${allSlots}
      </LayoutGrid>
    `,
  }),
  parameters: {
    controls: { exclude: ["columns"] },
    docs: {
      description: {
        story:
          "columns set to a CSS width string ('200px') — the browser fills as many columns as fit, each at least 200px wide. Resize the canvas to see wrapping. The columns control is excluded here as a string value is not representable on the slider.",
      },
    },
  },
};

/** Single column below a breakpoint — collapses to stacked layout on narrow containers. */
export const SingleColBelow: Story = {
  name: "Single Column Below 600px",
  args: {
    itemCount: 6,
    columns: 3,
    singleColBelow: "600px",
  },
  render: (args) => ({
    components: { LayoutGrid },
    setup() {
      return { args };
    },
    template: `
      <LayoutGrid v-bind="args">
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
    columns: 3,
    gap: "3.2rem",
  },
  render: (args) => ({
    components: { LayoutGrid },
    setup() {
      return { args };
    },
    template: `
      <LayoutGrid v-bind="args">
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
    columns: 3,
  },
  render: (args) => ({
    components: { LayoutGrid },
    setup() {
      return { args };
    },
    template: `
      <LayoutGrid v-bind="args">
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
