import PopOver from "../PopOver.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof PopOver> = {
  title: "Atoms/PopOver",
  component: PopOver,
  argTypes: {
    placement: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "Which side of the trigger the popover panel opens on.",
      table: { category: "Basic" },
    },
    triggerAriaLabel: {
      control: "text",
      description: "aria-label on the trigger button — set this when the trigger slot is icon-only.",
      table: { category: "Accessibility" },
    },
    popoverAriaLabel: {
      control: "text",
      description: "aria-label on the popover content region — set this when the content slot has no visible heading.",
      table: { category: "Accessibility" },
    },
    closeButtonAriaLabel: {
      control: "text",
      description: "aria-label on the close button — override for localisation.",
      table: { category: "Accessibility" },
    },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    placement: "right",
    closeButtonAriaLabel: "Close",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A generic anchor-positioned disclosure panel: fully consumer-supplied trigger and content slots, built on the native Popover API and CSS anchor-positioning. See DisplayTooltip for a fixed icon-trigger variant, or ActionMenu for one with menu semantics.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PopOver>;

export const Default: Story = {
  render: (args) => ({
    components: { PopOver },
    setup() {
      return { args };
    },
    template: `
      <div style="padding: 8rem;">
        <PopOver v-bind="args">
          <template #trigger>
            <span>Open popover</span>
          </template>
          <template #content>
            <p>This is some popover content.</p>
          </template>
        </PopOver>
      </div>
    `,
  }),
};

export const Placements: Story = {
  render: (args) => ({
    components: { PopOver },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; gap: 4rem; padding: 10rem;">
        <PopOver v-bind="args" placement="top">
          <template #trigger><span>Top</span></template>
          <template #content><p>Opens above the trigger.</p></template>
        </PopOver>
        <PopOver v-bind="args" placement="right">
          <template #trigger><span>Right</span></template>
          <template #content><p>Opens to the right of the trigger.</p></template>
        </PopOver>
        <PopOver v-bind="args" placement="bottom">
          <template #trigger><span>Bottom</span></template>
          <template #content><p>Opens below the trigger.</p></template>
        </PopOver>
        <PopOver v-bind="args" placement="left">
          <template #trigger><span>Left</span></template>
          <template #content><p>Opens to the left of the trigger.</p></template>
        </PopOver>
      </div>
    `,
  }),
};

export const IconTrigger: Story = {
  render: (args) => ({
    components: { PopOver },
    setup() {
      return { args };
    },
    template: `
      <div style="padding: 8rem;">
        <PopOver v-bind="args" trigger-aria-label="Show filters" popover-aria-label="Filter options">
          <template #trigger>
            <Icon name="lucide:filter" aria-hidden="true" />
          </template>
          <template #content>
            <p>Filter controls would go here.</p>
          </template>
        </PopOver>
      </div>
    `,
  }),
};

export const CustomColours: Story = {
  render: (args) => ({
    components: { PopOver },
    setup() {
      return { args };
    },
    template: `
      <div style="padding: 8rem;">
        <PopOver
          v-bind="args"
          style="--pop-over-background-colour: #1a1a1a; --pop-over-text-colour: white; --pop-over-border-colour: transparent;"
        >
          <template #trigger>
            <span>Open popover</span>
          </template>
          <template #content>
            <p>Overriding the public tokens via inline custom properties.</p>
          </template>
        </PopOver>
      </div>
    `,
  }),
};
