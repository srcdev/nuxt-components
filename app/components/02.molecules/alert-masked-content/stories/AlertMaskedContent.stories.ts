import type { Meta, StoryObj } from "@nuxtjs/storybook";
import AlertMaskedContent from "../AlertMaskedContent.vue";
import AlertContent from "../../alert-content/AlertContent.vue";

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

const wrapperStyle =
  "max-width: 600px; padding: 2rem; background: linear-gradient(135deg, oklch(40% 0.15 250), oklch(25% 0.1 300)); border-radius: 8px;";

/** Default — info theme over a coloured background to show the glass effect. */
export const Default: Story = {
  render: (args) => ({
    components: { AlertMaskedContent },
    setup() {
      return { args, wrapperStyle };
    },
    template: `
      <div :data-theme="args.theme" :style="wrapperStyle">
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
      return { args, wrapperStyle };
    },
    template: `
      <div :data-theme="args.theme" :style="wrapperStyle">
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

const busyBackdrop = [
  "repeating-linear-gradient(45deg, oklch(100% 0 0 / 0.18) 0 1.2rem, transparent 1.2rem 2.4rem)",
  "linear-gradient(120deg, oklch(70% 0.2 30), oklch(75% 0.18 90) 35%, oklch(65% 0.2 200) 70%, oklch(55% 0.22 300))",
].join(", ");

/**
 * Over imagery — the mask only reads as a mask with something busy behind it. Each row pairs
 * the plain AlertContent (opaque surface) with AlertMaskedContent over the same backdrop, so the
 * translucent fill and the cut-out accent border are directly comparable.
 */
export const OverImagery: Story = {
  name: "Over Imagery (mask in action)",
  args: { theme: "info", dismissible: true },
  render: (args) => ({
    components: { AlertMaskedContent, AlertContent },
    setup() {
      const backdrops = [
        { label: "Photo", style: "background: url('/images/banners/video/lake-banner.jpg') center / cover;" },
        { label: "Photo", style: "background: url('/images/page/hero/hero-blonde.jpg') center 30% / cover;" },
        { label: "Striped gradient", style: `background: ${busyBackdrop};` },
      ];
      return { args, backdrops };
    },
    template: `
      <div style="display: grid; gap: 2.4rem; max-width: 110rem;">
        <p style="margin: 0; font-family: sans-serif; font-size: 1.4rem; max-width: 70ch;">
          Left: <strong>AlertContent</strong> (opaque surface). Right: <strong>AlertMaskedContent</strong>:
          the SVG mask draws only the accent border and a translucent fill, so the backdrop stays visible
          through the body and around the border's cut-out.
        </p>
        <div
          v-for="(backdrop, i) in backdrops"
          :key="i"
          :data-theme="args.theme"
          :style="backdrop.style + ' display: grid; grid-template-columns: repeat(auto-fit, minmax(32rem, 1fr)); gap: 2.4rem; padding: 4rem 2.4rem; border-radius: 1.2rem;'"
        >
          <AlertContent v-bind="args">
            <template #title>AlertContent ({{ backdrop.label }})</template>
            <template #content>Opaque surface: nothing behind it shows through.</template>
          </AlertContent>
          <AlertMaskedContent v-bind="args">
            <template #title>AlertMaskedContent ({{ backdrop.label }})</template>
            <template #content>Translucent fill and cut-out border: the backdrop shows through.</template>
          </AlertMaskedContent>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Photos and a striped gradient behind each pair. Compare the opaque AlertContent on the left with the masked variant on the right.",
      },
    },
  },
};

/** Token overrides — the public colour tokens set on a wrapper you own, over the same busy backdrop. */
export const TokenOverrides: Story = {
  name: "Token Overrides",
  args: { theme: "warning", dismissible: false },
  render: (args) => ({
    components: { AlertMaskedContent },
    setup() {
      return { args, busyBackdrop };
    },
    template: `
      <div :data-theme="args.theme" :style="'background: ' + busyBackdrop + '; padding: 4rem 2.4rem; border-radius: 1.2rem; display: grid; gap: 2.4rem; max-width: 60rem;'">
        <AlertMaskedContent v-bind="args">
          <template #title>Default tokens</template>
          <template #content>--theme-accent border, --theme-surface-subtle fill at 80%.</template>
        </AlertMaskedContent>
        <div style="--alert-masked-content-border-colour: white; --alert-masked-content-background: color-mix(in oklab, var(--theme-surface-subtle) 55%, transparent);">
          <AlertMaskedContent v-bind="args">
            <template #title>Overridden tokens</template>
            <template #content>White border, fill dropped to 55% so more of the backdrop shows (at some cost to contrast).</template>
          </AlertMaskedContent>
        </div>
      </div>
    `,
  }),
};
