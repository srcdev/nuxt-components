import type { Meta, StoryObj } from "@nuxtjs/storybook";
import AlertContent from "../AlertContent.vue";

const meta: Meta<typeof AlertContent> = {
  title: "Molecules/AlertContent",
  component: AlertContent,
  argTypes: {
    theme: {
      control: { type: "inline-radio" },
      options: ["info", "success", "warning", "error"],
      description: "Semantic theme — controls the accent colour and default icon",
      table: { category: "Appearance" },
    },
    customIcon: {
      control: "text",
      description: "Iconify icon name to override the default theme icon",
      table: { category: "Appearance" },
    },
    dismissible: {
      control: "boolean",
      description: "Show a close button (emits 'dismiss' on click)",
      table: { category: "Behaviour" },
    },
    contentId: { table: { disable: true } },
    ariaLive: { table: { disable: true } },
  },
  args: {
    theme: "info",
    dismissible: false,
  },
};

export default meta;
type Story = StoryObj<typeof AlertContent>;

/** Default — info theme with title and body content. */
export const Default: Story = {
  render: (args) => ({
    components: { AlertContent },
    setup() {
      return { args };
    },
    template: `
      <div :data-theme="args.theme" style="max-width: 600px; padding: 2rem;">
        <AlertContent v-bind="args">
          <template #title>Alert title</template>
          <template #content>This is the alert body. It describes what happened and what the user should do next.</template>
        </AlertContent>
      </div>
    `,
  }),
};

/** Dismissible — renders the close button and demonstrates the dismiss emit. */
export const Dismissible: Story = {
  args: { theme: "info", dismissible: true },
  render: (args) => ({
    components: { AlertContent },
    setup() {
      return { args };
    },
    template: `
      <div :data-theme="args.theme" style="max-width: 600px; padding: 2rem;">
        <AlertContent v-bind="args">
          <template #title>Dismissible alert</template>
          <template #content>Click the close button to emit the dismiss event.</template>
        </AlertContent>
      </div>
    `,
  }),
};

/** Title only — no body content slot. */
export const TitleOnly: Story = {
  name: "Title Only",
  args: { theme: "success" },
  render: (args) => ({
    components: { AlertContent },
    setup() {
      return { args };
    },
    template: `
      <div :data-theme="args.theme" style="max-width: 600px; padding: 2rem;">
        <AlertContent v-bind="args">
          <template #title>Your changes have been saved.</template>
        </AlertContent>
      </div>
    `,
  }),
};

/** Custom icon — overrides the default theme icon via the customIcon prop. */
export const CustomIcon: Story = {
  name: "Custom Icon",
  args: { theme: "info", customIcon: "akar-icons:star" },
  render: (args) => ({
    components: { AlertContent },
    setup() {
      return { args };
    },
    template: `
      <div :data-theme="args.theme" style="max-width: 600px; padding: 2rem;">
        <AlertContent v-bind="args">
          <template #title>Custom icon via prop</template>
          <template #content>The icon is overridden using the customIcon prop.</template>
        </AlertContent>
      </div>
    `,
  }),
};

/** All themes — all four semantic variants stacked. */
export const AllThemes: Story = {
  name: "All Themes",
  render: () => ({
    components: { AlertContent },
    setup() {
      return { themes: ["info", "success", "warning", "error"] as const };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.6rem; max-width: 600px; padding: 2rem;">
        <div v-for="theme in themes" :key="theme" :data-theme="theme">
          <AlertContent :theme="theme" :dismissible="true">
            <template #title>{{ theme.charAt(0).toUpperCase() + theme.slice(1) }}</template>
            <template #content>This is the {{ theme }} variant of the AlertContent component.</template>
          </AlertContent>
        </div>
      </div>
    `,
  }),
};
