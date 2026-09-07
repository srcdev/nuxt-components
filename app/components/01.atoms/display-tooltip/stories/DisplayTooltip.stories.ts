import DisplayTooltip from "../DisplayTooltip.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof DisplayTooltip> = {
  title: "Atoms/DisplayTooltip",
  component: DisplayTooltip,
  argTypes: {
    tooltipId: {
      control: "text",
      description: "Id used to link the trigger button to the popover. Auto-generated when omitted.",
      table: { category: "Basic" },
    },
    hideTrigger: {
      control: "boolean",
      description: "Visually hides the trigger button (kept in the DOM) — e.g. while an equivalent trigger is provided via the triggerContent slot.",
      table: { category: "Basic" },
    },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    hideTrigger: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          "A trigger button that opens an anchor-positioned popover panel, built on the native Popover API and CSS anchor-positioning. See DisplayTooltipDefined for a structured title/body/action content variant.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DisplayTooltip>;

export const Default: Story = {
  render: (args) => ({
    components: { DisplayTooltip },
    setup() {
      return { args };
    },
    template: `
      <div style="padding: 8rem;">
        <DisplayTooltip v-bind="args">
          <template #tooltipContent>
            <p>This is some helpful additional information.</p>
          </template>
        </DisplayTooltip>
      </div>
    `,
  }),
};

export const WithTriggerContent: Story = {
  render: (args) => ({
    components: { DisplayTooltip },
    setup() {
      return { args };
    },
    template: `
      <div style="padding: 8rem;">
        <DisplayTooltip v-bind="args">
          <template #triggerContent>
            <span>Delivery cost</span>
          </template>
          <template #tooltipContent>
            <p>Free delivery on orders over £50.</p>
          </template>
        </DisplayTooltip>
      </div>
    `,
  }),
};

export const CustomColours: Story = {
  render: (args) => ({
    components: { DisplayTooltip },
    setup() {
      return { args };
    },
    template: `
      <div style="padding: 8rem;">
        <DisplayTooltip
          v-bind="args"
          style="--display-tooltip-popover-background-colour: #1a1a1a; --display-tooltip-popover-text-colour: white; --display-tooltip-popover-outline-colour: transparent;"
        >
          <template #tooltipContent>
            <p>Overriding the public tokens via inline custom properties.</p>
          </template>
        </DisplayTooltip>
      </div>
    `,
  }),
};
