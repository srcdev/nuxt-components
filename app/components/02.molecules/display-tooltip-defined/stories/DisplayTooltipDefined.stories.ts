import DisplayTooltipDefined from "../DisplayTooltipDefined.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { TooltipContentText } from "~/types/components";

const contentText: TooltipContentText = {
  tooltipTitle: { tag: "h4", text: "Free delivery" },
  tooltipContent: { tag: "p", text: "Orders over £50 qualify for free standard delivery." },
  tooltipAction: { tag: "span", text: "See delivery policy" },
};

const meta: Meta<typeof DisplayTooltipDefined> = {
  title: "Molecules/DisplayTooltipDefined",
  component: DisplayTooltipDefined,
  argTypes: {
    tooltipId: {
      control: "text",
      description: "Id used to link the trigger button to the popover. Auto-generated when omitted.",
      table: { category: "Basic" },
    },
    contentText: { table: { disable: true } },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    contentText,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Structured title/body/action content variant of DisplayTooltip, plus a built-in close button wired to the popover.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DisplayTooltipDefined>;

export const Default: Story = {
  render: (args) => ({
    components: { DisplayTooltipDefined },
    setup() {
      return { args };
    },
    template: `<div style="padding: 8rem;"><DisplayTooltipDefined v-bind="args" /></div>`,
  }),
};

export const TitleOnly: Story = {
  args: {
    contentText: { tooltipTitle: { tag: "h4", text: "Just a title" } },
  },
  render: (args) => ({
    components: { DisplayTooltipDefined },
    setup() {
      return { args };
    },
    template: `<div style="padding: 8rem;"><DisplayTooltipDefined v-bind="args" /></div>`,
  }),
};
