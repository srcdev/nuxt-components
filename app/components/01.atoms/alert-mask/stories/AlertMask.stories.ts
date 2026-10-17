import { ref } from "vue";
import AlertMask from "../AlertMask.vue";
import CanvasSwitcher from "../../canvas-switcher/CanvasSwitcher.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { MediaCanvas } from "~/types/components";

const meta: Meta<typeof AlertMask> = {
  title: "Atoms/AlertMask",
  component: AlertMask,
  argTypes: {
    config: {
      control: "object",
      description:
        "Border/background colour and geometry: backgroundColour, borderColour, radiusLeft, radiusRight, borderLeft, borderTop, borderRight, borderBottom",
      table: { category: "Basic" },
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Draws a border and translucent fill around slotted content as an SVG path, sized to the measured content. Geometry (radii and per-side border widths) comes from the `config` prop; colours default from `--alert-mask-border-colour` and `--alert-mask-background-colour`, and `config` colours override them. [AlertMaskedContent](?path=/story/molecules-alertmaskedcontent--default) is the alert built on it.",
      },
    },
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
          <p style="margin: 0 0 1.6rem; font-size: 1.4rem;">
            The alert built on this mask is
            <a href="/?path=/story/molecules-alertmaskedcontent--default" target="_top">AlertMaskedContent</a>.
          </p>
          <story />
        </div>
      `,
    }),
  ],
};

export default meta;
type Story = StoryObj<typeof AlertMask>;

// The mask is a translucent fill plus a cut-out border, so it needs something busy behind it to read at all.
const backdrop =
  "background: url('/images/banners/video/lake-banner.jpg') center / cover; padding: 4rem 2.4rem; border-radius: 1.2rem; max-width: 60rem;";
const gradientBackdrop =
  "background: repeating-linear-gradient(45deg, oklch(100% 0 0 / 0.18) 0 1.2rem, transparent 1.2rem 2.4rem), linear-gradient(120deg, oklch(70% 0.2 30), oklch(65% 0.2 200) 60%, oklch(55% 0.22 300)); padding: 4rem 2.4rem; border-radius: 1.2rem; max-width: 60rem;";

export const Default: Story = {
  args: { config: {} },
  render: (args) => ({
    components: { AlertMask },
    setup() {
      return { args, gradientBackdrop };
    },
    template: `
      <div data-theme="info" :style="gradientBackdrop">
        <AlertMask v-bind="args">
          <p style="margin: 0; padding: 1.6rem;">Default geometry and token colours: an 8px theme-accent border and a translucent subtle-surface fill.</p>
        </AlertMask>
      </div>
    `,
  }),
  parameters: {
    docs: { description: { story: "No config: default radii and borders, colours from the CSS tokens and the surrounding `data-theme`." } },
  },
};

export const CustomConfig: Story = {
  args: {
    config: {
      backgroundColour: "rgba(0, 0, 0, 0.3)",
      borderColour: "var(--theme-accent)",
      radiusLeft: 8,
      radiusRight: 4,
      borderLeft: 6,
      borderTop: 1,
      borderRight: 1,
      borderBottom: 1,
    },
  },
  render: (args) => ({
    components: { AlertMask },
    setup() {
      return { args, backdrop };
    },
    template: `
      <div data-theme="info" :style="backdrop">
        <AlertMask v-bind="args">
          <p style="margin: 0; padding: 1.6rem; color: white;">Custom accent-bar config, matching AlertMaskedContent's default shape</p>
        </AlertMask>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "The accent-bar shape used by AlertMaskedContent: thick left radius/border, thin elsewhere.",
      },
    },
  },
};

export const OverGradient: Story = {
  args: {
    config: {
      backgroundColour: "rgba(0, 0, 0, 0.3)",
      borderColour: "white",
      radiusLeft: 16,
      radiusRight: 16,
      borderLeft: 4,
      borderTop: 4,
      borderRight: 4,
      borderBottom: 4,
    },
  },
  render: (args) => ({
    components: { AlertMask },
    setup() {
      return { args, gradientBackdrop };
    },
    template: `
      <div :style="gradientBackdrop">
        <AlertMask v-bind="args">
          <p style="margin: 0; padding: 1.6rem; color: white;">Even border all round: the stripes show through the fill and stop at the border's inner edge.</p>
        </AlertMask>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "A striped gradient behind an even 4px white border, so the translucent fill and the border's cut-out are both visible.",
      },
    },
  },
};

const stressConfigs = [
  { caption: "Radii far larger than the box (500)", config: { radiusLeft: 500, radiusRight: 500 } },
  { caption: "Negative borders and radius (clamped to 0)", config: { borderLeft: -10, borderTop: -4, radiusLeft: -8 } },
  { caption: "Huge borders (40px) round a single word", config: { borderLeft: 40, borderTop: 40, borderRight: 40, borderBottom: 40 } },
  { caption: "Fractional values", config: { borderLeft: 2.5, borderTop: 0.5, borderRight: 0.5, borderBottom: 0.5, radiusLeft: 6.25, radiusRight: 3.75 } },
  { caption: "Zero borders", config: { borderLeft: 0, borderTop: 0, borderRight: 0, borderBottom: 0 } },
];

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  render: () => ({
    components: { AlertMask },
    setup() {
      return { stressConfigs, gradientBackdrop };
    },
    template: `
      <div data-theme="info" :style="gradientBackdrop" style="display: grid; gap: 2.4rem;">
        <AlertMask :config="{ borderLeft: 6, borderTop: 1, borderRight: 1, borderBottom: 1, radiusLeft: 8, radiusRight: 4 }">
          <p style="margin: 0; padding: 1.6rem; overflow-wrap: anywhere;">
            📧 Datenschutzgrundverordnungskonformitätsbestätigung https://example.com/a/very/long/unbroken/url/that/should/wrap <b>not bold</b> &lt;b&gt;escaped&lt;/b&gt; يرجى إدخال بريدك الإلكتروني. Wir verwenden Ihre Adresse ausschließlich für Rückfragen zu Ihrer Bestellung bei Alex Morgan in Northtown.
          </p>
        </AlertMask>
        <div dir="rtl">
          <AlertMask :config="{ borderLeft: 6, borderTop: 1, borderRight: 1, borderBottom: 1, radiusLeft: 8, radiusRight: 4 }">
            <p style="margin: 0; padding: 1.6rem;">نص من اليمين إلى اليسار داخل القناع، مع شريط التمييز على اليسار</p>
          </AlertMask>
        </div>
        <AlertMask></AlertMask>
        <div v-for="item in stressConfigs" :key="item.caption">
          <p style="margin: 0 0 0.8rem; font-size: 1.4rem;">{{ item.caption }}</p>
          <AlertMask :config="item.config">
            <p style="margin: 0; padding: 0.8rem;">x</p>
          </AlertMask>
        </div>
      </div>
    `,
  }),
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      story: { inline: false, height: "1100px" },
      description: {
        story:
          "Long German copy with an unbroken compound word and URL, HTML-like and right-to-left text, an empty mask, then hostile config: oversized radii, negative and fractional values, huge and zero borders. Check at every canvas width: the frame always hugs its content inside the dashed outline, no path draws outside the box or inverts, the thick bar stays on the left in the right-to-left mask with the text clear of it, and the empty mask collapses to a border-only frame.",
      },
    },
  },
};
