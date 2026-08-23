import Breadcrumb from "../Breadcrumb.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { BreadcrumbItem } from "~/types/components/breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Atoms/Navigation/Breadcrumb",
  component: Breadcrumb,
  argTypes: {
    items: {
      control: "object",
      description: "Ordered list of { label, to? } — items without `to` render as plain text (typically the last, current-page item)",
    },
    separator: {
      control: "text",
      description: "Character or short string rendered between items",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
    },
  },
  args: {
    separator: "/",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "Renders a `<nav aria-label=\"Breadcrumb\">` trail from an items array. Any item with a `to` renders as a NuxtLink; an item without one renders as plain text marked `aria-current=\"page\"` — routing decisions stay with the consumer, same as the rest of this library.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const items: BreadcrumbItem[] = [
  { label: "Services", to: "/services" },
  { label: "Balayage" },
];

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { items },
  render: (args) => ({
    components: { Breadcrumb },
    setup() {
      return { args };
    },
    template: `<Breadcrumb v-bind="args" />`,
  }),
};

export const ThreeLevels: Story = {
  name: "Three Levels",
  args: {
    items: [
      { label: "Home", to: "/" },
      { label: "Services", to: "/services" },
      { label: "Balayage" },
    ],
  },
  render: (args) => ({
    components: { Breadcrumb },
    setup() {
      return { args };
    },
    template: `<Breadcrumb v-bind="args" />`,
  }),
};

export const CustomSeparator: Story = {
  name: "Custom Separator",
  args: { items, separator: ">" },
  render: (args) => ({
    components: { Breadcrumb },
    setup() {
      return { args };
    },
    template: `<Breadcrumb v-bind="args" />`,
  }),
};
