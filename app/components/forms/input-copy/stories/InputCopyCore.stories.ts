import InputCopyCore from "../InputCopyCore.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof InputCopyCore> = {
  title: "Components/Forms/Input Copy/InputCopyCore",
  component: InputCopyCore,
  argTypes: {
    id: {
      control: "text",
      description: "The id attribute for the input element",
      table: { category: "Content" },
    },
    value: {
      control: "text",
      description: "The text value to display and copy",
      table: { category: "Content" },
    },
    copyLabel: {
      control: "text",
      description: "Button label before copying",
      table: { category: "Behaviour" },
    },
    copiedLabel: {
      control: "text",
      description: "Button label shown after a successful copy",
      table: { category: "Behaviour" },
    },
    feedbackDuration: {
      control: { type: "number", min: 500, max: 5000, step: 500 },
      description: "How long (ms) to show the copied state before resetting",
      table: { category: "Behaviour" },
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
      table: { category: "Styling" },
    },
  },
  args: {
    id: "copy-input",
    value: "sk_live_abc123def456",
    copyLabel: "Copy",
    copiedLabel: "Copied!",
    feedbackDuration: 2000,
    styleClassPassthrough: [],
  },
};

export default meta;
type Story = StoryObj<typeof InputCopyCore>;

export const Default: Story = {
  render: (args) => ({
    components: { InputCopyCore },
    setup() {
      return { args };
    },
    template: `<div style="max-width: 420px; padding: 40px;"><InputCopyCore v-bind="args" /></div>`,
  }),
};

export const LongValue: Story = {
  name: "Long value",
  args: {
    value: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21lcklkIjoiY3VzdF8wMDEiLCJkb21haW5zIjpbImV4YW1wbGUuY29tIl0sInBsYW4iOiJzaW5nbGUtc2l0ZSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzMxNjI3MjAwfQ",
  },
  render: (args) => ({
    components: { InputCopyCore },
    setup() {
      return { args };
    },
    template: `<div style="max-width: 420px; padding: 40px;"><InputCopyCore v-bind="args" /></div>`,
  }),
};

export const CustomLabels: Story = {
  name: "Custom labels",
  args: {
    copyLabel: "Copy key",
    copiedLabel: "Key copied!",
  },
  render: (args) => ({
    components: { InputCopyCore },
    setup() {
      return { args };
    },
    template: `<div style="max-width: 420px; padding: 40px;"><InputCopyCore v-bind="args" /></div>`,
  }),
};
