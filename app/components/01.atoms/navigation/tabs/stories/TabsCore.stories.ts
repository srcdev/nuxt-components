import TabsCore from "../TabsCore.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof TabsCore> = {
  title: "Atoms/Navigation/TabsCore",
  component: TabsCore,
  argTypes: {
    axis: {
      control: "radio",
      options: ["x", "y"],
      description: "Layout axis — horizontal tab row or vertical tab column",
    },
    itemCount: {
      control: { type: "number", min: 1, max: 6, step: 1 },
      description: "Number of tabs — drives the tab-{n}-trigger / tab-{n}-content indexed slots",
    },
    transitionDuration: {
      control: { type: "range", min: 0, max: 600, step: 10 },
      description: "Duration (ms) of the moving indicator's transition",
    },
    trackHover: {
      control: "boolean",
      description: "Shows a moving highlight behind the hovered tab",
    },
    trackActive: {
      control: "boolean",
      description: "Shows a moving highlight behind the active tab",
    },
    trackIndicator: {
      control: "boolean",
      description: "Shows a moving underline/sideline indicator beneath the active tab",
    },
    ariaLabel: {
      control: "text",
      description: "aria-label on the tablist — override for localisation",
    },
  },
  args: {
    axis: "x",
    itemCount: 3,
    transitionDuration: 200,
    trackHover: true,
    trackActive: true,
    trackIndicator: true,
    ariaLabel: "Tabs",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A tablist built from indexed slots (tab-{n}-trigger / tab-{n}-content, driven by itemCount) with moving hover/active/underline indicators. Supports arrow-key navigation (Left/Right or Up/Down depending on axis, plus Home/End) per the WAI-ARIA Tabs pattern.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TabsCore>;

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const panels = [
  { label: "Overview", content: "A short summary of the product goes here." },
  { label: "Specs", content: "Technical specifications and dimensions." },
  { label: "Reviews", content: "Customer reviews and ratings." },
];

const tabSlots = panels
  .map(
    (panel, index) => `
    <template #tab-${index}-trigger>${panel.label}</template>
    <template #tab-${index}-content>
      <div style="padding: 1.6rem;">${panel.content}</div>
    </template>`
  )
  .join("\n");

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Horizontal: Story = {
  args: { itemCount: panels.length },
  render: (args) => ({
    components: { TabsCore },
    setup() {
      return { args };
    },
    template: `
      <TabsCore v-bind="args">
        ${tabSlots}
      </TabsCore>
    `,
  }),
};

export const Vertical: Story = {
  args: { itemCount: panels.length, axis: "y" },
  render: (args) => ({
    components: { TabsCore },
    setup() {
      return { args };
    },
    template: `
      <TabsCore v-bind="args">
        ${tabSlots}
      </TabsCore>
    `,
  }),
};

export const IndicatorsOff: Story = {
  name: "Indicators Off",
  args: { itemCount: panels.length, trackHover: false, trackActive: false, trackIndicator: false },
  render: (args) => ({
    components: { TabsCore },
    setup() {
      return { args };
    },
    template: `
      <TabsCore v-bind="args">
        ${tabSlots}
      </TabsCore>
    `,
  }),
};

export const IndicatorColours: Story = {
  name: "Indicator Colours (demo)",
  args: { itemCount: panels.length },
  parameters: {
    docs: {
      description: {
        story:
          "Each moving indicator given a distinct colour via its public CSS token, purely to make the three separate states (hover / active / underline) easy to tell apart. Hover a tab to see the green highlight move independently of the blue active highlight.",
      },
    },
  },
  render: (args) => ({
    components: { TabsCore },
    setup() {
      const indicatorColourVars = {
        "--tabs-hover-indicator-colour": "seagreen",
        "--tabs-hover-indicator-text-colour": "white",
        "--tabs-active-indicator-colour": "steelblue",
        "--tabs-active-indicator-text-colour": "white",
        "--tabs-underline-indicator-colour": "darkorange",
      };
      return { args, indicatorColourVars };
    },
    template: `
      <div :style="indicatorColourVars">
        <TabsCore v-bind="args">
          ${tabSlots}
        </TabsCore>
      </div>
    `,
  }),
};
