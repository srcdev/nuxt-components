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
          "A system/light/dark theme switch wrapping TripleToggleSwitchCore, wired to useSettingsStore. Colour and sizing are entirely delegated to TripleToggleSwitchCore's public --triple-toggle-switch-* tokens — see CONSUMER-STYLING.md.",
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
