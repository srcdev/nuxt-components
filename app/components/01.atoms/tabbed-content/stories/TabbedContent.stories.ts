import { ref } from "vue";
import TabbedContent from "../TabbedContent.vue";
import CanvasSwitcher from "../../canvas-switcher/CanvasSwitcher.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { MediaCanvas } from "~/types/components";

const meta: Meta<typeof TabbedContent> = {
  title: "Atoms/TabbedContent",
  component: TabbedContent,
  argTypes: {
    axis: {
      control: "radio",
      options: ["x", "y"],
      description: "Layout axis — horizontal tab row or vertical tab column",
    },
    itemCount: {
      control: "inline-radio",
      options: [1, 2, 3, 4, 5, 6],
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
    overflowMode: {
      control: "radio",
      options: ["menu", "scroll"],
      description: "axis x only: tabs that don't fit move into a More menu, or the tab row scrolls sideways",
    },
    moreLabel: {
      control: "text",
      description: "Accessible name of the More button and its menu (override for localisation)",
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
    overflowMode: "menu",
    moreLabel: "More tabs",
  },
  decorators: [
    (story, context) => ({
      components: { story, CanvasSwitcher },
      setup() {
        const canvasName = ref<MediaCanvas>(context.parameters.initialCanvas ?? "fullWidthCanvas");
        return { canvasName };
      },
      template: `
        <div style="padding: 1.2rem 1.6rem; border-block-end: 1px solid currentColor;">
          <CanvasSwitcher v-model:canvas-name="canvasName" />
        </div>
        <div :class="canvasName" style="margin-inline: auto; padding: 2rem; outline: 1px dashed currentColor;">
          <story />
        </div>
      `,
    }),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Tabbed content: a tablist and its panels, built from indexed slots (tab-{n}-trigger / tab-{n}-content, driven by itemCount) with moving hover/active/underline indicators. Supports arrow-key navigation (Left/Right or Up/Down depending on axis, plus Home/End) per the WAI-ARIA Tabs pattern.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TabbedContent>;

// ─── Fixtures ─────────────────────────────────────────────────────────────────

// Slot content for every tab the itemCount control allows (max 6), so raising itemCount never
// shows empty tabs. Each story only renders as many as its itemCount asks for.
const panels = [
  { label: "Overview", content: "A short summary of the product goes here." },
  { label: "Specs", content: "Technical specifications and dimensions." },
  { label: "Reviews", content: "Customer reviews and ratings." },
  { label: "Shipping", content: "Delivery estimates and carrier options." },
  { label: "Returns", content: "Return window and refund policy." },
  { label: "FAQ", content: "Answers to common questions." },
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
  args: { itemCount: 3 },
  render: (args) => ({
    components: { TabbedContent },
    setup() {
      return { args };
    },
    template: `
      <TabbedContent v-bind="args">
        ${tabSlots}
      </TabbedContent>
    `,
  }),
};

export const Vertical: Story = {
  args: { itemCount: 3, axis: "y" },
  render: (args) => ({
    components: { TabbedContent },
    setup() {
      return { args };
    },
    template: `
      <TabbedContent v-bind="args">
        ${tabSlots}
      </TabbedContent>
    `,
  }),
};

export const IndicatorsOff: Story = {
  name: "Indicators Off",
  args: { itemCount: 3, trackHover: false, trackActive: false, trackIndicator: false },
  render: (args) => ({
    components: { TabbedContent },
    setup() {
      return { args };
    },
    template: `
      <TabbedContent v-bind="args">
        ${tabSlots}
      </TabbedContent>
    `,
  }),
};

export const FiveTabs: Story = {
  name: "Five Tabs (regression check)",
  args: { itemCount: 5 },
  parameters: {
    docs: {
      description: {
        story:
          "itemCount raised to 5 as a regression check — the original hand-rolled version of this component had an indicator-positioning issue that only showed up with more than 3 tabs. Try hovering quickly across several tabs in a row, then clicking a tab several positions away from the active one (e.g. tab 1 → tab 5), to confirm the hover/active/underline indicators land in the right place without jumping or lagging behind.",
      },
    },
  },
  render: (args) => ({
    components: { TabbedContent },
    setup() {
      return { args };
    },
    template: `
      <TabbedContent v-bind="args">
        ${tabSlots}
      </TabbedContent>
    `,
  }),
};

export const IndicatorColours: Story = {
  name: "Indicator Colours (demo)",
  args: { itemCount: 3 },
  parameters: {
    docs: {
      description: {
        story:
          "Each moving indicator given a distinct colour via its public CSS token, purely to make the three separate states (hover / active / underline) easy to tell apart. Hover a tab to see the green highlight, with a thin orange hover underline beneath it, move independently of the blue active highlight and its thick orange underline — the label text stays white against both backgrounds via the matching --tabs-hover-indicator-text-colour / --tabs-active-indicator-text-colour tokens (see CONSUMER-STYLING.md), which previously had no effect since they were wired to the wrong element.",
      },
    },
  },
  render: (args) => ({
    components: { TabbedContent },
    setup() {
      const indicatorColourVars = {
        "--tabs-hover-indicator-colour": "seagreen",
        "--tabs-hover-indicator-text-colour": "white",
        "--tabs-active-indicator-colour": "steelblue",
        "--tabs-active-indicator-text-colour": "white",
        "--tabs-underline-indicator-colour": "darkorange",
        "--tabs-hover-underline-indicator-height": "0.2rem",
      };
      return { args, indicatorColourVars };
    },
    template: `
      <div :style="indicatorColourVars">
        <TabbedContent v-bind="args">
          ${tabSlots}
        </TabbedContent>
      </div>
    `,
  }),
};

// ─── Stress test ──────────────────────────────────────────────────────────────

const stressTabs = [
  {
    label: "Datenschutzgrundverordnungskonformitätsbescheinigung",
    content:
      "Lange deutsche Überschrift ohne Leerzeichen, und ein langer Absatz: Die Verarbeitung personenbezogener Daten erfolgt ausschließlich im Rahmen der gesetzlichen Bestimmungen und wird regelmäßig überprüft.",
  },
  {
    label: "https://example.com/a/very/long/unbroken/url/that/never/wraps/on/its/own",
    content: "https://example.com/a/very/long/unbroken/url/that/never/wraps/on/its/own/and/keeps/going/and/going",
  },
  { label: "🎉 Party", content: "Emoji at the start of the label." },
  { label: "<b>not bold</b>", content: "<script>alert('x')</script> must render as text." },
  { label: "المراجعات", content: "نص عربي من اليمين إلى اليسار في لوحة التبويب." },
  { label: "X", content: "Single-character label." },
  { label: "", content: "Empty trigger label: the tab still takes keyboard focus and is announced by its position." },
  { label: "Icon inside", icon: "lucide:star", content: "Clicking the icon inside the trigger must still switch tabs." },
];

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: { itemCount: stressTabs.length, ariaLabel: "Produktinformationen und rechtliche Hinweise" },
  argTypes: {
    itemCount: { control: "inline-radio", options: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
  },
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "Deliberately hostile data to find breakage: eight tabs, a long German compound label, an unbroken URL label " +
          "and panel, emoji, HTML-like text (must render as text), right-to-left Arabic, a single character, an empty " +
          "label, and an icon inside a trigger (clicking the icon must still switch tabs). Try itemCount below 8 " +
          "(including 0) and switch axis to y. Check at every canvas width: the page never scrolls sideways (tabs that don't fit move into the More " +
          "menu, or with overflowMode scroll the tab row scrolls inside itself), long labels wrap inside a tab or " +
          "menu item rather than stretching it past --tabs-list-item-max-inline-size, picking a tab from the menu " +
          "moves the indicators onto the More button, and panel text wraps inside the panel.",
      },
    },
  },
  render: (args) => ({
    components: { TabbedContent },
    setup() {
      return { args, stressTabs };
    },
    template: `
      <TabbedContent v-bind="args">
        <template v-for="(tab, index) in stressTabs" :key="index" #[\`tab-\${index}-trigger\`]>
          <Icon v-if="tab.icon" :name="tab.icon" style="vertical-align: middle; margin-inline-end: 0.6rem;" />{{ tab.label }}
        </template>
        <template v-for="(tab, index) in stressTabs" :key="'c' + index" #[\`tab-\${index}-content\`]>
          <div style="padding: 1.6rem;">{{ tab.content }}</div>
        </template>
      </TabbedContent>
    `,
  }),
};
