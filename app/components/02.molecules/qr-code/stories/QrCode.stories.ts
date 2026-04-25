import type { Meta, StoryFn } from "@nuxtjs/storybook";
import CaptureQrCodeComponent from "../CaptureQrCode.vue";
import DecodeQrCodeComponent from "../DecodeQrCode.vue";

// ===== CAPTURE QR CODE =====

const CaptureQrCodeMeta: Meta<typeof CaptureQrCodeComponent> = {
  title: "Molecules/QR Code/CaptureQrCode",
  component: CaptureQrCodeComponent,
  argTypes: {
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "Interactive QR code scanner using device camera. Requires camera permissions to function properly. Features automatic detection, error handling, and camera management.",
      },
    },
  },
};

const CaptureTemplate: StoryFn<typeof CaptureQrCodeComponent> = (args) => ({
  components: { CaptureQrCodeComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 40px; max-width: 600px; margin: 0 auto;">
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; color: #374151;">Live Camera QR Scanner</h3>
        <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
          This component uses your device camera to scan QR codes in real-time.
          Make sure to allow camera access when prompted.
        </p>
        <div style="background: #fff3cd; padding: 12px; border-radius: 4px; border: 1px solid #ffeaa7;">
          <p style="margin: 0; color: #856404; font-size: 12px;">
            <strong>Features:</strong> Automatic detection, multiple code scanning, camera management, error recovery
          </p>
        </div>
      </div>
      <CaptureQrCodeComponent :style-class-passthrough="args.styleClassPassthrough" />
    </div>
  `,
});

export const CaptureDefault = CaptureTemplate.bind({});
export const CaptureDefaultMeta = CaptureQrCodeMeta;

// ===== DECODE QR CODE =====

const DecodeQrCodeMeta: Meta<typeof DecodeQrCodeComponent> = {
  title: "Molecules/QR Code/DecodeQrCode",
  component: DecodeQrCodeComponent,
  argTypes: {
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "Upload or drag-and-drop QR code images to decode their content. Supports various image formats including PNG, JPEG, WEBP, and more.",
      },
    },
  },
};

const DecodeTemplate: StoryFn<typeof DecodeQrCodeComponent> = (args) => ({
  components: { DecodeQrCodeComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 40px; max-width: 600px; margin: 0 auto;">
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; color: #374151;">QR Image Decoder</h3>
        <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
          Upload or drag QR code images to extract their content.
          Supports PNG, JPEG, WEBP, and other common image formats.
        </p>
        <div style="background: #d1ecf1; padding: 12px; border-radius: 4px; border: 1px solid #bee5eb;">
          <p style="margin: 0; color: #0c5460; font-size: 12px;">
            <strong>Supported formats:</strong> PNG, JPEG, WEBP, BMP, GIF • <strong>Methods:</strong> File upload, drag & drop
          </p>
        </div>
      </div>
      <DecodeQrCodeComponent :style-class-passthrough="args.styleClassPassthrough" />
    </div>
  `,
});

export const DecodeDefault = DecodeTemplate.bind({});
export const DecodeDefaultMeta = DecodeQrCodeMeta;

export default CaptureQrCodeMeta;
