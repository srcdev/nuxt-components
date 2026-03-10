import ContentColumns2 from "../ContentColumns2.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof ContentColumns2> = {
  title: "Atoms/Content Layouts/ContentColumns2",
  component: ContentColumns2,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "article", "main"],
      description: "Semantic HTML tag for the root element",
      table: { category: "Semantic" },
    },
    dataTestid: {
      control: { type: "text" },
      description: "Test ID for the root element",
      table: { category: "Testing" },
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A responsive two-column layout using CSS Container Queries. Stacks to a single column below 768px container width, switching to equal-width columns above that threshold.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContentColumns2>;

const placeholder = (label: string, bg: string, color: string) =>
  `<div style="padding: 2.4rem; background: ${bg}; border-radius: 0.8rem; color: ${color}; font-family: sans-serif;">
    <strong style="display:block; margin-bottom: 0.8rem;">${label}</strong>
    <p style="margin: 0; font-size: 1.4rem; line-height: 1.6; opacity: 0.8;">Placeholder content for this column slot.</p>
  </div>`;

export const Default: Story = {
  args: {
    tag: "div",
    dataTestid: "content-columns-2",
  },
  render: (args) => ({
    components: { ContentColumns2 },
    setup() {
      return { args };
    },
    template: `
      <ContentColumns2 v-bind="args">
        <template #slot1>${placeholder("Column 1", "#dbeafe", "#1e40af")}</template>
        <template #slot2>${placeholder("Column 2", "#dcfce7", "#166534")}</template>
      </ContentColumns2>
    `,
  }),
};

export const SingleColumn: Story = {
  args: {
    tag: "div",
    dataTestid: "content-columns-2",
  },
  render: (args) => ({
    components: { ContentColumns2 },
    setup() {
      return { args };
    },
    template: `
      <ContentColumns2 v-bind="args">
        <template #slot1>${placeholder("Column 1 only", "#fef3c7", "#92400e")}</template>
      </ContentColumns2>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "When only one slot is provided, that column renders alone with no empty space reserved for the other.",
      },
    },
  },
};

export const SemanticSection: Story = {
  args: {
    tag: "section",
    dataTestid: "content-columns-2",
  },
  render: (args) => ({
    components: { ContentColumns2 },
    setup() {
      return { args };
    },
    template: `
      <ContentColumns2 v-bind="args">
        <template #slot1>${placeholder("Left", "#ede9fe", "#5b21b6")}</template>
        <template #slot2>${placeholder("Right", "#fce7f3", "#9d174d")}</template>
      </ContentColumns2>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Rendered as a <code>&lt;section&gt;</code> for thematic content groupings.",
      },
    },
  },
};
