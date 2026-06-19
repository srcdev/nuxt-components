import type { Meta, StoryObj } from "@nuxtjs/storybook";
import AlertMaskedContent from "../AlertMaskedContent.vue";

const meta: Meta<typeof AlertMaskedContent> = {
  title: "Molecules/AlertMaskedContent",
  component: AlertMaskedContent,
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
    maskConfig: { table: { disable: true } },
    contentId: { table: { disable: true } },
    ariaLive: { table: { disable: true } },
  },
  args: {
    theme: "info",
    dismissible: false,
  },
};

export default meta;
type Story = StoryObj<typeof AlertMaskedContent>;

const wrapperStyle = `
  max-width: 600px;
  padding: 2rem;
  background: linear-gradient(135deg, oklch(40% 0.15 250), oklch(25% 0.1 300));
  border-radius: 8px;
`;

/** Default — info theme over a coloured background to show the glass effect. */
export const Default: Story = {
  render: (args) => ({
    components: { AlertMaskedContent },
    setup() {
      return { args };
    },
    template: `
      <div :data-theme="args.theme" :style="'${wrapperStyle}'">
        <AlertMaskedContent v-bind="args">
          <template #title>Alert title</template>
          <template #content>This is the alert body. It describes what happened and what the user should do next.</template>
        </AlertMaskedContent>
      </div>
    `,
  }),
};

/** Dismissible — renders the close button. */
export const Dismissible: Story = {
  args: { theme: "info", dismissible: true },
  render: (args) => ({
    components: { AlertMaskedContent },
    setup() {
      return { args };
    },
    template: `
      <div :data-theme="args.theme" :style="'${wrapperStyle}'">
        <AlertMaskedContent v-bind="args">
          <template #title>Dismissible alert</template>
          <template #content>Click the close button to emit the dismiss event.</template>
        </AlertMaskedContent>
      </div>
    `,
  }),
};

/** All themes — all four semantic variants stacked over a shared background. */
export const AllThemes: Story = {
  name: "All Themes",
  render: () => ({
    components: { AlertMaskedContent },
    setup() {
      return { themes: ["info", "success", "warning", "error"] as const };
    },
    template: `
      <div style="${wrapperStyle} display: flex; flex-direction: column; gap: 1.2rem;">
        <div v-for="theme in themes" :key="theme" :data-theme="theme">
          <AlertMaskedContent :theme="theme" :dismissible="true">
            <template #title>{{ theme.charAt(0).toUpperCase() + theme.slice(1) }}</template>
            <template #content>This is the {{ theme }} masked variant.</template>
          </AlertMaskedContent>
        </div>
      </div>
    `,
  }),
};

/** Compared side-by-side with different background colours to show how the glass adapts. */
export const BackgroundVariants: Story = {
  name: "Background Variants",
  render: () => ({
    components: { AlertMaskedContent },
    setup() {
      return {
        backgrounds: [
          "linear-gradient(135deg, oklch(40% 0.15 250), oklch(25% 0.1 300))",
          "linear-gradient(135deg, oklch(35% 0.12 30), oklch(20% 0.08 60))",
          "linear-gradient(135deg, oklch(20% 0 0), oklch(10% 0 0))",
        ],
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.6rem;">
        <div
          v-for="(bg, i) in backgrounds"
          :key="i"
          :style="{ background: bg, padding: '2rem', borderRadius: '8px', maxWidth: '500px' }"
          data-theme="info"
        >
          <AlertMaskedContent theme="info" :dismissible="true">
            <template #title>Glass effect</template>
            <template #content>The masked border adapts to whatever sits behind it.</template>
          </AlertMaskedContent>
        </div>
      </div>
    `,
  }),
};
