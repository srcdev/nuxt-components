import type { Meta, StoryFn } from "@nuxtjs/storybook";
import DisplayQrCodeComponent from "../DisplayQrCode.vue";
import type { QrCodeVariant } from "../../../../types/components";

const meta: Meta<typeof DisplayQrCodeComponent> = {
  title: "Atoms/QR Code/DisplayQrCode",
  component: DisplayQrCodeComponent,
  argTypes: {
    qrValue: {
      control: { type: "text" },
      description: "The value/content to encode in the QR code",
      table: { category: "Content" },
    },
    size: {
      control: { type: "text" },
      description: "Size of the QR code (CSS value like '256px', '10rem')",
      table: { category: "Appearance" },
    },
    radius: {
      control: { type: "range", min: 0, max: 20, step: 1 },
      description: "Border radius of the QR code corners",
      table: { category: "Appearance" },
    },
    blackColor: {
      control: { type: "color" },
      description: "Color of the QR code foreground elements",
      table: { category: "Appearance" },
    },
    whiteColor: {
      control: { type: "color" },
      description: "Color of the QR code background",
      table: { category: "Appearance" },
    },
    variant: { table: { disable: true } },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    qrValue: "https://github.com/srcdev/nuxt-components",
    size: "256px",
    radius: 0,
    blackColor: "#000000",
    whiteColor: "transparent",
    styleClassPassthrough: [],
  },
};

export default meta;

interface QrStoryArgs {
  qrValue: string;
  size: string;
  radius: number;
  blackColor: string;
  whiteColor: string;
  styleClassPassthrough: string[];
}

const DisplayTemplate: StoryFn<QrStoryArgs> = (args, { parameters }) => ({
  components: { DisplayQrCodeComponent },
  setup() {
    const variant: QrCodeVariant = parameters?.variant || {
      inner: "default",
      marker: "default",
      pixel: "default",
    };
    return { args, variant };
  },
  template: `
    <div style="padding: 40px; display: flex; align-items: center; justify-content: center; background: #f5f5f5; border-radius: 8px;">
      <DisplayQrCodeComponent
        :qrValue="args.qrValue"
        :variant="variant"
        :radius="args.radius"
        :blackColor="args.blackColor"
        :whiteColor="args.whiteColor"
        :size="args.size"
        :style-class-passthrough="args.styleClassPassthrough"
      />
    </div>
  `,
});

export const Default = DisplayTemplate.bind({});

export const Website = DisplayTemplate.bind({});
Website.args = { qrValue: "https://nuxt.com", radius: 8, blackColor: "#000000" };
Website.parameters = { variant: { inner: "circle", marker: "rounded", pixel: "dots" } };

export const VariantDefault = DisplayTemplate.bind({});
VariantDefault.args = { qrValue: "Default variant style", radius: 4 };
VariantDefault.parameters = { variant: { inner: "default", marker: "default", pixel: "default" } };

export const VariantCircle = DisplayTemplate.bind({});
VariantCircle.args = { qrValue: "Circle variant style", radius: 8, blackColor: "#1e40af" };
VariantCircle.parameters = { variant: { inner: "circle", marker: "circle", pixel: "circle" } };

export const VariantRounded = DisplayTemplate.bind({});
VariantRounded.args = { qrValue: "Rounded variant style", radius: 12, blackColor: "#059669" };
VariantRounded.parameters = { variant: { inner: "rounded", marker: "rounded", pixel: "rounded" } };

export const VariantDots = DisplayTemplate.bind({});
VariantDots.args = { qrValue: "Dots variant style", radius: 6, blackColor: "#dc2626" };
VariantDots.parameters = { variant: { inner: "dots", marker: "dots", pixel: "dots" } };

export const VariantMixed = DisplayTemplate.bind({});
VariantMixed.args = { qrValue: "Mixed variants for creative styling", radius: 10, blackColor: "#7c3aed" };
VariantMixed.parameters = { variant: { inner: "circle", marker: "rounded", pixel: "dots" } };

export const WiFiConnection = DisplayTemplate.bind({});
WiFiConnection.args = { qrValue: "WIFI:T:WPA;S:MyHomeNetwork;P:mySecurePassword123;H:false;", blackColor: "#1e40af", radius: 4 };
WiFiConnection.parameters = { variant: { inner: "rounded", marker: "circle", pixel: "default" } };

export const VCardContact = DisplayTemplate.bind({});
VCardContact.args = {
  qrValue: "BEGIN:VCARD\\nVERSION:3.0\\nFN:John Doe\\nORG:Acme Corp\\nTITLE:Software Engineer\\nTEL:+1234567890\\nEMAIL:john.doe@acme.com\\nURL:https://johndoe.dev\\nEND:VCARD",
  blackColor: "#059669",
  radius: 12,
};
VCardContact.parameters = { variant: { inner: "dots", marker: "rounded", pixel: "circle" } };

export const SmallSize = DisplayTemplate.bind({});
SmallSize.args = { qrValue: "Small QR for tight spaces", size: "128px", radius: 2, blackColor: "#f59e0b" };
SmallSize.parameters = { variant: { inner: "dots", marker: "circle", pixel: "rounded" } };

export const LargeSize = DisplayTemplate.bind({});
LargeSize.args = { qrValue: "Large QR for posters and signage", size: "400px", radius: 16, blackColor: "#0ea5e9" };
LargeSize.parameters = { variant: { inner: "circle", marker: "rounded", pixel: "dots" } };

export const HighContrast = DisplayTemplate.bind({});
HighContrast.args = { qrValue: "High contrast for accessibility", blackColor: "#000000", whiteColor: "#ffffff", radius: 0, size: "256px" };
HighContrast.parameters = { variant: { inner: "default", marker: "default", pixel: "default" } };

const PlaygroundTemplate: StoryFn<QrStoryArgs> = (args) => ({
  components: { DisplayQrCodeComponent },
  setup() {
    const qrValue = ref(args.qrValue);
    const variant = ref<QrCodeVariant>({ inner: "circle", marker: "rounded", pixel: "dots" });
    const radius = ref(args.radius);
    const blackColor = ref(args.blackColor);
    const whiteColor = ref(args.whiteColor);
    const sizeValue = ref(256);
    const size = computed(() => `${sizeValue.value}px`);
    const presetValues = [
      { label: "Website URL", value: "https://nuxt.com" },
      { label: "WiFi Network", value: "WIFI:T:WPA;S:MyNetwork;P:password123;" },
      { label: "Phone Number", value: "tel:+1234567890" },
      { label: "Email", value: "mailto:hello@example.com" },
      { label: "SMS", value: "sms:+1234567890?body=Hello!" },
      { label: "Location", value: "geo:40.7128,-74.0060" },
    ];
    const variantOptions = ["default", "circle", "rounded", "dots"];
    return { qrValue, variant, radius, blackColor, whiteColor, sizeValue, size, presetValues, variantOptions };
  },
  template: `
    <div style="padding: 40px;">
      <div style="display: grid; grid-template-columns: 1fr 300px; gap: 40px; align-items: start;">
        <div style="display: flex; align-items: center; justify-content: center; min-height: 400px; background: #f8fafc; border-radius: 8px; padding: 40px;">
          <DisplayQrCodeComponent :qrValue="qrValue" :variant="variant" :radius="radius" :blackColor="blackColor" :whiteColor="whiteColor" :size="size" />
        </div>
        <div style="background: white; padding: 24px; border-radius: 8px; border: 1px solid #e5e7eb;">
          <h3 style="margin: 0 0 20px 0; color: #374151; font-size: 18px;">QR Code Playground</h3>
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Quick Presets:</label>
            <select @change="qrValue = $event.target.value" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              <option value="">Select a preset...</option>
              <option v-for="preset in presetValues" :key="preset.label" :value="preset.value">{{ preset.label }}</option>
            </select>
          </div>
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Custom Content:</label>
            <textarea v-model="qrValue" rows="3" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-family: monospace; font-size: 12px;" placeholder="Enter QR code content..." />
          </div>
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Style Variants:</label>
            <div style="display: grid; gap: 8px;">
              <div><label style="font-size: 12px; color: #6b7280;">Inner:</label><select v-model="variant.inner" style="width: 100%; padding: 4px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px;"><option v-for="option in variantOptions" :key="option" :value="option">{{ option }}</option></select></div>
              <div><label style="font-size: 12px; color: #6b7280;">Marker:</label><select v-model="variant.marker" style="width: 100%; padding: 4px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px;"><option v-for="option in variantOptions" :key="option" :value="option">{{ option }}</option></select></div>
              <div><label style="font-size: 12px; color: #6b7280;">Pixel:</label><select v-model="variant.pixel" style="width: 100%; padding: 4px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px;"><option v-for="option in variantOptions" :key="option" :value="option">{{ option }}</option></select></div>
            </div>
          </div>
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Appearance:</label>
            <div style="display: grid; gap: 12px;">
              <div><label style="font-size: 12px; color: #6b7280;">Size: {{ sizeValue }}px</label><input v-model.number="sizeValue" type="range" min="128" max="400" step="16" style="width: 100%;" /></div>
              <div><label style="font-size: 12px; color: #6b7280;">Radius: {{ radius }}px</label><input v-model.number="radius" type="range" min="0" max="20" step="1" style="width: 100%;" /></div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div><label style="font-size: 12px; color: #6b7280;">Foreground:</label><input v-model="blackColor" type="color" style="width: 100%; height: 32px; border: 1px solid #d1d5db; border-radius: 4px;" /></div>
                <div><label style="font-size: 12px; color: #6b7280;">Background:</label><input v-model="whiteColor" type="color" style="width: 100%; height: 32px; border: 1px solid #d1d5db; border-radius: 4px;" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
});

export const InteractivePlayground = PlaygroundTemplate.bind({});
InteractivePlayground.args = {
  qrValue: "https://github.com/srcdev/nuxt-components",
  radius: 8,
  blackColor: "#000000",
  whiteColor: "transparent",
  size: "256px",
  styleClassPassthrough: [],
};
