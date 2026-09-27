import PriceList from "../PriceList.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const priceListData = [
  {
    headingtext: "Cutting & Treatment",
    headingIcon: "lucide:sparkles",
    items: [
      { description: "Cut & Blow Dry", price: "£45" },
      { description: "Restyle", price: "£65" },
      { description: "Wash & Blow Dry", price: "£35" },
      { description: "Trim & Tidy", price: "£25" },
      { description: "Keratin Treatment", price: "£120", from: true },
    ],
  },
  {
    headingtext: "Hair Colouring",
    headingIcon: "lucide:sparkles",
    items: [
      { description: "Full Head Colour", price: "£75" },
      { description: "Half Head Highlights", price: "£65" },
      { description: "Full Head Highlights", price: "£85" },
      { description: "Balayage", price: "£95", from: true },
      { description: "Toner", price: "£35" },
    ],
  },
];

const meta: Meta<typeof PriceList> = {
  title: "Molecules/PriceList",
  component: PriceList,
  argTypes: {
    priceListData: {
      control: "object",
      description: "Array of columns, each with a heading and list of items",
      table: { category: "Content" },
    },
    headingTag: {
      control: "select",
      options: ["h2", "h3", "h4", "h5", "h6"],
      description: "Heading level for each column title; pick to fit the surrounding page outline",
      table: { category: "Content", defaultValue: { summary: "h2" } },
    },
    fromLabel: {
      control: "text",
      description: "Text shown before a price whose item has `from: true`",
      table: { category: "Content", defaultValue: { summary: "from" } },
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
      table: { category: "Styling" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PriceList>;

export const Default: Story = {
  args: {
    priceListData,
    headingTag: "h2",
    fromLabel: "from",
    styleClassPassthrough: [],
  },
  render: (args) => ({
    components: { PriceList },
    setup() {
      return { args };
    },
    template: `<PriceList v-bind="args" />`,
  }),
};

export const SingleColumn: Story = {
  name: "Single Column",
  args: {
    priceListData: [priceListData[0]!],
  },
  render: (args) => ({
    components: { PriceList },
    setup() {
      return { args };
    },
    template: `<PriceList v-bind="args" />`,
  }),
};

export const EmptyState: Story = {
  name: "Empty State",
  args: {
    priceListData: priceListData.map(({ headingtext, headingIcon }) => ({ headingtext, headingIcon, items: [] })),
  },
  render: (args) => ({
    components: { PriceList },
    setup() {
      return { args };
    },
    template: `<PriceList v-bind="args" />`,
  }),
};

export const NoIcons: Story = {
  name: "No Icons",
  args: {
    priceListData: priceListData.map(({ headingtext, items }) => ({ headingtext, items })),
  },
  render: (args) => ({
    components: { PriceList },
    setup() {
      return { args };
    },
    template: `<PriceList v-bind="args" />`,
  }),
};
