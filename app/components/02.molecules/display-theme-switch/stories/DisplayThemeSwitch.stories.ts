import { ref } from "vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { MediaCanvas } from "~/types/components";
import DisplayThemeSwitch from "../DisplayThemeSwitch.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof DisplayThemeSwitch> = {
  title: "Molecules/DisplayThemeSwitch",
  component: DisplayThemeSwitch,
  argTypes: {
    styleClassPassthrough: {
      control: "object",
      description: "Extra classes — pass \"small\" for a compact size",
      table: { category: "Styling" },
    },
    ariaLabel: {
      control: "text",
      description: "Accessible name for the radiogroup",
      table: { category: "Labels" },
    },
    systemLabel: {
      control: "text",
      description: "Accessible label for the system option",
      table: { category: "Labels" },
    },
    lightLabel: {
      control: "text",
      description: "Accessible label for the light option",
      table: { category: "Labels" },
    },
    darkLabel: {
      control: "text",
      description: "Accessible label for the dark option",
      table: { category: "Labels" },
    },
    systemIcon: {
      control: "text",
      description: "Icon name for the system option",
      table: { category: "Icons" },
    },
    lightIcon: {
      control: "text",
      description: "Icon name for the light option",
      table: { category: "Icons" },
    },
    darkIcon: {
      control: "text",
      description: "Icon name for the dark option",
      table: { category: "Icons" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A system/light/dark theme switch wrapping SegmentedControl, wired to useSettingsStore. Colour and sizing are entirely delegated to SegmentedControl's public --segmented-control-* tokens — see CONSUMER-STYLING.md.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DisplayThemeSwitch>;

export const Default: Story = {
  args: {},
  render: (args) => ({
    components: { DisplayThemeSwitch },
    setup() {
      return { args };
    },
    template: `<DisplayThemeSwitch v-bind="args" />`,
  }),
};

export const Small: Story = {
  args: {
    styleClassPassthrough: "small",
  },
  render: (args) => ({
    components: { DisplayThemeSwitch },
    setup() {
      return { args };
    },
    template: `<DisplayThemeSwitch v-bind="args" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: "Compact sizing for use in a tight header/nav slot.",
      },
    },
  },
};

export const InNavigation: Story = {
  args: {
    styleClassPassthrough: "small",
  },
  render: (args) => ({
    components: { DisplayThemeSwitch },
    setup() {
      return { args };
    },
    template: `
      <nav style="display: flex; align-items: center; justify-content: space-between; padding: 1.6rem 2.4rem; background: var(--theme-surface); border-radius: 0.8rem; border: 1px solid var(--theme-border);">
        <div style="display: flex; align-items: center; gap: 1.6rem;">
          <span style="font-weight: 600; color: var(--theme-text);">My App</span>
          <a href="#" style="color: var(--theme-text); text-decoration: none;">Home</a>
          <a href="#" style="color: var(--theme-text); text-decoration: none;">About</a>
        </div>
        <DisplayThemeSwitch v-bind="args" />
      </nav>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Example of the theme switch integrated into a navigation bar context.",
      },
    },
  },
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    ariaLabel: "Farbschema für die gesamte Website auswählen <b>not bold</b>",
    systemLabel: "Systemeinstellung des Betriebssystems übernehmen",
    lightLabel: "🌞",
    darkLabel: "داكن",
    lightIcon: "",
  },
  decorators: [
    (story, context) => ({
      components: { story, CanvasSwitcher },
      setup() {
        const canvasName = ref<MediaCanvas>(context.parameters.initialCanvas ?? "mobileCanvas");
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
  render: (args) => ({
    components: { DisplayThemeSwitch },
    setup() {
      return { args };
    },
    template: `
      <div style="display: grid; gap: 1.6rem; justify-items: start;">
        <DisplayThemeSwitch v-bind="args" />
        <DisplayThemeSwitch v-bind="args" style-class-passthrough="small" />
        <div dir="rtl"><DisplayThemeSwitch v-bind="args" /></div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Long, HTML-like, emoji and right-to-left labels (screen-reader text only), an empty light icon, the small size and a right-to-left container, all bound to the one site colour scheme. Check at every canvas width: the switch stays inside the dashed outline, the empty-icon option still renders as a clickable circle, the marker follows the scheme in every copy, and it slides the right way in right-to-left.",
      },
    },
  },
};
