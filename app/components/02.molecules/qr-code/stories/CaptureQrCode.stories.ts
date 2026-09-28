import type { Meta, StoryFn } from "@nuxtjs/storybook";
import CaptureQrCodeComponent from "../CaptureQrCode.vue";

const meta: Meta<typeof CaptureQrCodeComponent> = {
  title: "Molecules/QR Code/CaptureQrCode",
  component: CaptureQrCodeComponent,
  argTypes: {
    cameraStoppedLabel: {
      control: { type: "text" },
      description: "Message shown while the camera is stopped (e.g. the tab is hidden)",
      table: { category: "Content" },
    },
    resetCameraLabel: {
      control: { type: "text" },
      description: "Reset button text in the error state",
      table: { category: "Content" },
    },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    cameraStoppedLabel: "Camera stopped",
    resetCameraLabel: "Reset camera",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "Live QR code scanner using the device camera. Needs camera permission; the camera stops when the tab is hidden or the route changes. Results are announced through a polite live region.",
      },
    },
  },
};

export default meta;

const Template: StoryFn<typeof CaptureQrCodeComponent> = (args) => ({
  components: { CaptureQrCodeComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 40px; max-width: 600px; margin: 0 auto;">
      <p style="margin: 0 0 16px; font-size: 14px; opacity: 0.8;">
        Allow camera access when prompted, then hold a QR code up to the camera.
      </p>
      <CaptureQrCodeComponent
        :camera-stopped-label="args.cameraStoppedLabel"
        :reset-camera-label="args.resetCameraLabel"
        :style-class-passthrough="args.styleClassPassthrough"
      />
    </div>
  `,
});

export const Default = Template.bind({});
