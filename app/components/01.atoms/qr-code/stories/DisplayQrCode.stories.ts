import { computed } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import DisplayQrCode from "../DisplayQrCode.vue";
import type { QrCodeVariant } from "../../../../types/components";

type SvgVariant = QrCodeVariant["pixel"];

interface StoryArgs {
  qrValue: string;
  size: string;
  radius: number;
  blackColor: string;
  whiteColor: string;
  ariaLabel: string;
  variantInner: SvgVariant;
  variantMarker: SvgVariant;
  variantPixel: SvgVariant;
}

const variantOptions: SvgVariant[] = ["default", "circle", "rounded", "dots", "pixelated"];

const variantArgType = (part: string) => ({
  control: { type: "select" as const },
  options: variantOptions,
  description: `Story-only: sets \`variant.${part}\` on the \`variant\` prop.`,
  table: { category: "Variant (story-only)" },
});

const meta: Meta<StoryArgs> = {
  title: "Atoms/QR Code/DisplayQrCode",
  component: DisplayQrCode,
  argTypes: {
    qrValue: {
      control: { type: "text" },
      description: "The value to encode. Over about 2.9KB it can't be encoded, and the `fallback` slot renders instead.",
      table: { category: "Content" },
    },
    size: {
      control: { type: "text" },
      description: "Width of the code as any CSS length; `--display-qr-code-size` overrides it. Never wider than its container.",
      table: { category: "Appearance" },
    },
    radius: {
      control: { type: "range", min: 0, max: 1, step: 0.05 },
      description: "Corner rounding for the rounded, circle and dots shapes, from 0 to 1 (the library clamps anything outside).",
      table: { category: "Appearance" },
    },
    blackColor: {
      control: { type: "color" },
      description: "Colour of the dark modules. Defaults to `currentColor`.",
      table: { category: "Appearance" },
    },
    whiteColor: {
      control: { type: "color" },
      description: "Colour of the light modules. Defaults to `transparent`.",
      table: { category: "Appearance" },
    },
    ariaLabel: {
      control: { type: "text" },
      description: "Accessible name for the QR image (override with a more specific or translated label)",
      table: { category: "Accessibility" },
    },
    variantInner: variantArgType("inner"),
    variantMarker: variantArgType("marker"),
    variantPixel: variantArgType("pixel"),
  },
  args: {
    qrValue: "https://example.com",
    size: "256px",
    radius: 0,
    blackColor: "#000000",
    whiteColor: "transparent",
    ariaLabel: "QR code",
    variantInner: "default",
    variantMarker: "default",
    variantPixel: "default",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Renders a value as an SVG QR code with `role=\"img\"` and an `ariaLabel`. `size`, `radius`, `blackColor`, `whiteColor` and `variant` (separate shapes for the inner markers, outer markers and pixels) style it. A value too long to encode renders the `fallback` slot and emits `error` instead of breaking the page.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const storySetup = (args: StoryArgs) => {
  const componentArgs = computed(() => {
    const { variantInner, variantMarker, variantPixel, ...rest } = args;
    return { ...rest, variant: { inner: variantInner, marker: variantMarker, pixel: variantPixel } };
  });
  return { componentArgs };
};

const render: Story["render"] = (args) => ({
  components: { DisplayQrCode },
  setup: () => storySetup(args),
  template: `
    <div style="padding: 4rem; display: flex; align-items: center; justify-content: center; background: #f5f5f5; border-radius: 0.8rem;">
      <DisplayQrCode v-bind="componentArgs" />
    </div>
  `,
});

const story = (description: string, args: Partial<StoryArgs> = {}): Story => ({
  render,
  args,
  parameters: { docs: { description: { story: description } } },
});

export const Default = story("Default styling. Use the Controls panel to try every prop, including the three variant shapes.");

export const Website = story("A URL with circle inner markers, rounded outer markers and dot pixels.", {
  qrValue: "https://nuxt.com",
  radius: 0.5,
  variantInner: "circle",
  variantMarker: "rounded",
  variantPixel: "dots",
});

export const VariantCircle = story("Every part in the circle shape.", {
  qrValue: "Circle variant style",
  radius: 0.5,
  blackColor: "#1e40af",
  variantInner: "circle",
  variantMarker: "circle",
  variantPixel: "circle",
});

export const VariantRounded = story("Every part in the rounded shape, at full radius.", {
  qrValue: "Rounded variant style",
  radius: 1,
  blackColor: "#059669",
  variantInner: "rounded",
  variantMarker: "rounded",
  variantPixel: "rounded",
});

export const VariantDots = story("Every part in the dots shape.", {
  qrValue: "Dots variant style",
  radius: 0.5,
  blackColor: "#dc2626",
  variantInner: "dots",
  variantMarker: "dots",
  variantPixel: "dots",
});

export const VariantPixelated = story("Every part in the pixelated shape.", {
  qrValue: "Pixelated variant style",
  blackColor: "#7c3aed",
  variantInner: "pixelated",
  variantMarker: "pixelated",
  variantPixel: "pixelated",
});

export const WiFiConnection = story("A Wi-Fi join string, which phone cameras offer to connect to.", {
  qrValue: "WIFI:T:WPA;S:NorthtownGuest;P:example-password;H:false;",
  blackColor: "#1e40af",
  radius: 0.25,
  variantInner: "rounded",
  variantMarker: "circle",
});

export const VCardContact = story("A vCard contact. Longer values produce a denser code.", {
  qrValue:
    "BEGIN:VCARD\nVERSION:3.0\nFN:Alex Morgan\nORG:Northtown Studio\nTEL:+441234567890\nEMAIL:alex@example.com\nURL:https://example.com\nEND:VCARD",
  blackColor: "#059669",
  radius: 0.75,
  variantInner: "dots",
  variantMarker: "rounded",
  variantPixel: "circle",
});

export const SmallSize = story("`size` at 128px.", { size: "128px" });

export const LargeSize = story("`size` at 400px. In a narrower container the code shrinks to fit.", {
  size: "400px",
  radius: 0.5,
  blackColor: "#0ea5e9",
  variantInner: "circle",
  variantMarker: "rounded",
  variantPixel: "dots",
});

export const HighContrast = story("Black on an opaque white background, the most reliable combination for scanning.", {
  whiteColor: "#ffffff",
});

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  render: () => ({
    components: { DisplayQrCode },
    setup() {
      const nearCapacity = "x".repeat(2900);
      const overCapacity = "https://example.com/?q=" + "x".repeat(4000);
      return { nearCapacity, overCapacity };
    },
    template: `
      <div style="display: grid; gap: 2.4rem; padding: 2.4rem; font-size: 1.4rem;">
        <p style="margin: 0;">An empty value, a single character, and emoji with right-to-left text: each still renders a code.</p>
        <div style="display: flex; flex-wrap: wrap; gap: 2.4rem;">
          <DisplayQrCode qr-value="" size="12rem"></DisplayQrCode>
          <DisplayQrCode qr-value="a" size="12rem"></DisplayQrCode>
          <DisplayQrCode qr-value="😀 التوصيل المجاني" size="12rem"></DisplayQrCode>
        </div>

        <p style="margin: 0;">2,900 characters, just under capacity: the densest code the encoder makes.</p>
        <DisplayQrCode :qr-value="nearCapacity" size="32rem"></DisplayQrCode>

        <p style="margin: 0;">Over capacity: the <code>fallback</code> slot renders in place of the code (left), or nothing (right) when the slot is empty.</p>
        <div style="display: flex; flex-wrap: wrap; gap: 2.4rem; align-items: start;">
          <DisplayQrCode :qr-value="overCapacity" size="16rem" style="outline: 0.1rem dashed currentColor;">
            <template #fallback>
              <span style="padding: 1.2rem; text-align: center;">Thislinkistoolongtoshowasaqrcodepleaseusethebuttonbelow</span>
            </template>
          </DisplayQrCode>
          <DisplayQrCode :qr-value="overCapacity" size="16rem" style="outline: 0.1rem dashed currentColor;"></DisplayQrCode>
        </div>

        <p style="margin: 0;">An 80rem <code>size</code> inside an 18rem column: the code shrinks to the column.</p>
        <div style="inline-size: 18rem; outline: 0.1rem dashed currentColor;">
          <DisplayQrCode qr-value="https://example.com" size="80rem"></DisplayQrCode>
        </div>

        <p style="margin: 0;">Out-of-range radius (-1 and 5): the library clamps it to 0 and 1.</p>
        <div style="display: flex; flex-wrap: wrap; gap: 2.4rem;">
          <DisplayQrCode qr-value="https://example.com" size="12rem" :radius="-1" :variant="{ inner: 'rounded', marker: 'rounded', pixel: 'rounded' }"></DisplayQrCode>
          <DisplayQrCode qr-value="https://example.com" size="12rem" :radius="5" :variant="{ inner: 'rounded', marker: 'rounded', pixel: 'rounded' }"></DisplayQrCode>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      story: { inline: false, height: "1400px" },
      description: {
        story:
          "Worst-case values. Check: empty, single-character, emoji and right-to-left values all render a code; the near-capacity code renders without errors; an over-capacity value shows the `fallback` slot (with its unbroken text wrapping inside the box) or an empty box, never an error; an oversized `size` shrinks to its container; an out-of-range radius renders as 0 and 1.",
      },
    },
  },
};
