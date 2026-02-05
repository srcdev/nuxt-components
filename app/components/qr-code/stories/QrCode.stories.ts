import type { Meta, StoryFn } from "@nuxtjs/storybook";
import DisplayQrCodeComponent from "../DisplayQrCode.vue";
import CaptureQrCodeComponent from "../CaptureQrCode.vue";
import DecodeQrCodeComponent from "../DecodeQrCode.vue";
import type { QrCodeVariant } from "../../../types/components";

// Display QR Code Stories
const DisplayQrCodeMeta: Meta<typeof DisplayQrCodeComponent> = {
  title: "Components/UI/QR Code/DisplayQrCode",
  component: DisplayQrCodeComponent,
  argTypes: {
    // Content Configuration
    qrValue: {
      control: { type: "text" },
      description: "The value/content to encode in the QR code",
      table: {
        category: "Content",
      },
    },
    // Visual Configuration
    size: {
      control: { type: "text" },
      description: "Size of the QR code (CSS value like '256px', '10rem')",
      table: {
        category: "Appearance",
      },
    },
    radius: {
      control: { type: "range", min: 0, max: 20, step: 1 },
      description: "Border radius of the QR code corners",
      table: {
        category: "Appearance",
      },
    },
    blackColor: {
      control: { type: "color" },
      description: "Color of the QR code foreground elements",
      table: {
        category: "Appearance",
      },
    },
    whiteColor: {
      control: { type: "color" },
      description: "Color of the QR code background",
      table: {
        category: "Appearance",
      },
    },
    // Hide complex props from controls
    variant: {
      table: {
        disable: true,
      },
    },
    styleClassPassthrough: {
      table: {
        disable: true,
      },
    },
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

// Display QR Code Stories
export const DisplayDefault = DisplayTemplate.bind({});
export const DisplayDefaultMeta = DisplayQrCodeMeta;

export const DisplayWebsite = DisplayTemplate.bind({});
DisplayWebsite.args = {
  qrValue: "https://nuxt.com",
  radius: 8,
  blackColor: "#000000",
};
DisplayWebsite.parameters = {
  variant: {
    inner: "circle",
    marker: "rounded",
    pixel: "dots",
  },
};

export const DisplayWiFi = DisplayTemplate.bind({});
DisplayWiFi.args = {
  qrValue: "WIFI:T:WPA;S:MyNetwork;P:mypassword;H:false;",
  blackColor: "#1e40af",
  radius: 4,
};
DisplayWiFi.parameters = {
  variant: {
    inner: "rounded",
    marker: "circle",
    pixel: "default",
  },
};

export const DisplayContact = DisplayTemplate.bind({});
DisplayContact.args = {
  qrValue:
    "BEGIN:VCARD\\nVERSION:3.0\\nFN:John Doe\\nORG:Company\\nTEL:+1234567890\\nEMAIL:john@example.com\\nEND:VCARD",
  blackColor: "#059669",
  radius: 12,
};
DisplayContact.parameters = {
  variant: {
    inner: "dots",
    marker: "rounded",
    pixel: "circle",
  },
};

export const DisplaySMS = DisplayTemplate.bind({});
DisplaySMS.args = {
  qrValue: "sms:+1234567890?body=Hello from QR Code!",
  blackColor: "#dc2626",
};
DisplaySMS.parameters = {
  variant: {
    inner: "circle",
    marker: "dots",
    pixel: "rounded",
  },
};

export const DisplayEmail = DisplayTemplate.bind({});
DisplayEmail.args = {
  qrValue: "mailto:contact@example.com?subject=Hello&body=Message from QR Code",
  blackColor: "#7c3aed",
};
DisplayEmail.parameters = {
  variant: {
    inner: "rounded",
    marker: "default",
    pixel: "dots",
  },
};

export const DisplayLarge = DisplayTemplate.bind({});
DisplayLarge.args = {
  qrValue: "Large QR Code with lots of content to demonstrate sizing capabilities",
  size: "400px",
  radius: 16,
  blackColor: "#0ea5e9",
};
DisplayLarge.parameters = {
  variant: {
    inner: "circle",
    marker: "rounded",
    pixel: "dots",
  },
};

export const DisplaySmall = DisplayTemplate.bind({});
DisplaySmall.args = {
  qrValue: "Small QR",
  size: "128px",
  radius: 2,
  blackColor: "#f59e0b",
};
DisplaySmall.parameters = {
  variant: {
    inner: "dots",
    marker: "circle",
    pixel: "rounded",
  },
};

export const DisplayCustomColors = DisplayTemplate.bind({});
DisplayCustomColors.args = {
  qrValue: "Custom colored QR code with white background",
  blackColor: "#ec4899",
  whiteColor: "#ffffff",
  radius: 8,
};
DisplayCustomColors.parameters = {
  variant: {
    inner: "circle",
    marker: "rounded",
    pixel: "dots",
  },
};

// Capture QR Code Stories
const CaptureQrCodeMeta: Meta<typeof CaptureQrCodeComponent> = {
  title: "Components/UI/QR Code/CaptureQrCode",
  component: CaptureQrCodeComponent,
  argTypes: {
    styleClassPassthrough: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component: "Interactive QR code scanner using device camera. Requires camera permissions to function properly.",
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
        <h3 style="margin: 0 0 10px 0; color: #374151;">📱 Camera QR Scanner</h3>
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
          This component uses your device camera to scan QR codes.
          Make sure to allow camera access when prompted.
        </p>
      </div>
      <CaptureQrCodeComponent :style-class-passthrough="args.styleClassPassthrough" />
    </div>
  `,
});

export const CaptureDefault = CaptureTemplate.bind({});
export const CaptureDefaultMeta = CaptureQrCodeMeta;

// Decode QR Code Stories
const DecodeQrCodeMeta: Meta<typeof DecodeQrCodeComponent> = {
  title: "Components/UI/QR Code/DecodeQrCode",
  component: DecodeQrCodeComponent,
  argTypes: {
    styleClassPassthrough: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component: "Upload or drag-and-drop QR code images to decode their content. Supports various image formats.",
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
        <h3 style="margin: 0 0 10px 0; color: #374151;">📁 QR Image Decoder</h3>
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
          Upload or drag QR code images to extract their content.
          Supports PNG, JPEG, and other common image formats.
        </p>
      </div>
      <DecodeQrCodeComponent :style-class-passthrough="args.styleClassPassthrough" />
    </div>
  `,
});

export const DecodeDefault = DecodeTemplate.bind({});
export const DecodeDefaultMeta = DecodeQrCodeMeta;

// All-in-One Showcase
const ShowcaseTemplate: StoryFn = () => ({
  components: {
    DisplayQrCodeComponent,
    CaptureQrCodeComponent,
    DecodeQrCodeComponent,
  },
  setup() {
    const showcaseVariant: QrCodeVariant = {
      inner: "circle",
      marker: "rounded",
      pixel: "dots",
    };

    return { showcaseVariant };
  },
  template: `
    <div style="padding: 40px;">
      <div style="display: grid; gap: 40px; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));">

        <!-- Display QR Codes -->
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
          <h3 style="margin: 0 0 20px 0; color: #374151;">📄 Display QR Codes</h3>
          <div style="display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));">

            <div style="text-align: center;">
              <DisplayQrCodeComponent
                qrValue="https://nuxt.com"
                :variant="showcaseVariant"
                :radius="4"
                blackColor="#1e40af"
                size="120px"
              />
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">Website</p>
            </div>

            <div style="text-align: center;">
              <DisplayQrCodeComponent
                qrValue="WIFI:T:WPA;S:MyNetwork;P:password;"
                :variant="{ inner: 'rounded', marker: 'circle', pixel: 'default' }"
                :radius="8"
                blackColor="#059669"
                size="120px"
              />
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">WiFi</p>
            </div>

            <div style="text-align: center;">
              <DisplayQrCodeComponent
                qrValue="tel:+1234567890"
                :variant="{ inner: 'dots', marker: 'rounded', pixel: 'circle' }"
                :radius="12"
                blackColor="#dc2626"
                size="120px"
              />
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">Phone</p>
            </div>

          </div>
        </div>

        <!-- Interactive Components -->
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
          <h3 style="margin: 0 0 20px 0; color: #374151;">📱 Interactive Components</h3>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="background: white; padding: 16px; border-radius: 6px; border: 1px solid #e5e7eb;">
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Camera Scanner</h4>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Live camera QR code detection</p>
            </div>
            <div style="background: white; padding: 16px; border-radius: 6px; border: 1px solid #e5e7eb;">
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">File Upload</h4>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Upload or drag QR code images</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
});

export const QRCodeShowcase = ShowcaseTemplate.bind({});
QRCodeShowcase.parameters = {
  docs: {
    description: {
      story: "Complete showcase of all QR Code components and their capabilities.",
    },
  },
};

// Export the metas for each component
export default DisplayQrCodeMeta;
