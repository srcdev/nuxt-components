import PriceList from "../PriceList.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const cuttingItems = [
  { description: "Cut & Blow Dry", price: "£45" },
  { description: "Restyle", price: "£65" },
  { description: "Wash & Blow Dry", price: "£35" },
  { description: "Trim & Tidy", price: "£25" },
  { description: "Keratin Treatment", price: "£120" },
];

const colouringItems = [
  { description: "Full Head Colour", price: "£75" },
  { description: "Half Head Highlights", price: "£65" },
  { description: "Full Head Highlights", price: "£85" },
  { description: "Balayage", price: "£95" },
  { description: "Toner", price: "£35" },
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
    priceListData: [
      { headingtext: "Cutting & Treatment", items: cuttingItems },
      { headingtext: "Hair Colouring", items: colouringItems },
    ],
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
    priceListData: [{ headingtext: "Cutting & Treatment", items: cuttingItems }],
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
    priceListData: [
      { headingtext: "Cutting & Treatment", items: [] },
      { headingtext: "Hair Colouring", items: [] },
    ],
  },
  render: (args) => ({
    components: { PriceList },
    setup() {
      return { args };
    },
    template: `<PriceList v-bind="args" />`,
  }),
};
