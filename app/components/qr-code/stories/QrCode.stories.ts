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

// ===== BASIC DISPLAY STORIES =====

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

// ===== VARIANT SHOWCASE STORIES =====

export const VariantDefault = DisplayTemplate.bind({});
VariantDefault.args = {
  qrValue: "Default variant style",
  radius: 4,
};
VariantDefault.parameters = {
  variant: { inner: "default", marker: "default", pixel: "default" },
};

export const VariantCircle = DisplayTemplate.bind({});
VariantCircle.args = {
  qrValue: "Circle variant style",
  radius: 8,
  blackColor: "#1e40af",
};
VariantCircle.parameters = {
  variant: { inner: "circle", marker: "circle", pixel: "circle" },
};

export const VariantRounded = DisplayTemplate.bind({});
VariantRounded.args = {
  qrValue: "Rounded variant style",
  radius: 12,
  blackColor: "#059669",
};
VariantRounded.parameters = {
  variant: { inner: "rounded", marker: "rounded", pixel: "rounded" },
};

export const VariantDots = DisplayTemplate.bind({});
VariantDots.args = {
  qrValue: "Dots variant style",
  radius: 6,
  blackColor: "#dc2626",
};
VariantDots.parameters = {
  variant: { inner: "dots", marker: "dots", pixel: "dots" },
};

export const VariantMixed = DisplayTemplate.bind({});
VariantMixed.args = {
  qrValue: "Mixed variants for creative styling",
  radius: 10,
  blackColor: "#7c3aed",
};
VariantMixed.parameters = {
  variant: { inner: "circle", marker: "rounded", pixel: "dots" },
};

// ===== REAL-WORLD USE CASE STORIES =====

export const WiFiConnection = DisplayTemplate.bind({});
WiFiConnection.args = {
  qrValue: "WIFI:T:WPA;S:MyHomeNetwork;P:mySecurePassword123;H:false;",
  blackColor: "#1e40af",
  radius: 4,
};
WiFiConnection.parameters = {
  variant: { inner: "rounded", marker: "circle", pixel: "default" },
  docs: {
    description: {
      story: "WiFi connection QR code that allows users to automatically connect to a network.",
    },
  },
};

export const VCardContact = DisplayTemplate.bind({});
VCardContact.args = {
  qrValue:
    "BEGIN:VCARD\\nVERSION:3.0\\nFN:John Doe\\nORG:Acme Corp\\nTITLE:Software Engineer\\nTEL:+1234567890\\nEMAIL:john.doe@acme.com\\nURL:https://johndoe.dev\\nEND:VCARD",
  blackColor: "#059669",
  radius: 12,
};
VCardContact.parameters = {
  variant: { inner: "dots", marker: "rounded", pixel: "circle" },
  docs: {
    description: {
      story: "Business card QR code containing complete contact information in vCard format.",
    },
  },
};

export const SMSMessage = DisplayTemplate.bind({});
SMSMessage.args = {
  qrValue: "sms:+1234567890?body=Hello! I scanned your QR code.",
  blackColor: "#dc2626",
};
SMSMessage.parameters = {
  variant: { inner: "circle", marker: "dots", pixel: "rounded" },
  docs: {
    description: {
      story: "SMS QR code that pre-fills a text message when scanned.",
    },
  },
};

export const EmailTemplate = DisplayTemplate.bind({});
EmailTemplate.args = {
  qrValue: "mailto:support@company.com?subject=Customer Inquiry&body=Hello, I have a question about...",
  blackColor: "#7c3aed",
};
EmailTemplate.parameters = {
  variant: { inner: "rounded", marker: "default", pixel: "dots" },
  docs: {
    description: {
      story: "Email QR code with pre-filled subject and body content.",
    },
  },
};

export const CalendarEvent = DisplayTemplate.bind({});
CalendarEvent.args = {
  qrValue:
    "BEGIN:VCALENDAR\\nVERSION:2.0\\nBEGIN:VEVENT\\nSUMMARY:Team Meeting\\nDTSTART:20260301T140000Z\\nDTEND:20260301T150000Z\\nLOCATION:Conference Room A\\nDESCRIPTION:Weekly team sync meeting\\nEND:VEVENT\\nEND:VCALENDAR",
  blackColor: "#f59e0b",
  radius: 8,
};
CalendarEvent.parameters = {
  variant: { inner: "circle", marker: "rounded", pixel: "dots" },
  docs: {
    description: {
      story: "Calendar event QR code that adds an event to the user's calendar when scanned.",
    },
  },
};

export const GeolocationPin = DisplayTemplate.bind({});
GeolocationPin.args = {
  qrValue: "geo:37.7749,-122.4194?q=37.7749,-122.4194(San Francisco Office)",
  blackColor: "#ec4899",
  radius: 6,
};
GeolocationPin.parameters = {
  variant: { inner: "dots", marker: "circle", pixel: "rounded" },
  docs: {
    description: {
      story: "Location QR code that opens maps application with specific coordinates.",
    },
  },
};

// ===== SIZE AND STYLING STORIES =====

export const SmallSize = DisplayTemplate.bind({});
SmallSize.args = {
  qrValue: "Small QR for tight spaces",
  size: "128px",
  radius: 2,
  blackColor: "#f59e0b",
};
SmallSize.parameters = {
  variant: { inner: "dots", marker: "circle", pixel: "rounded" },
};

export const LargeSize = DisplayTemplate.bind({});
LargeSize.args = {
  qrValue: "Large QR for posters and signage with detailed content",
  size: "400px",
  radius: 16,
  blackColor: "#0ea5e9",
};
LargeSize.parameters = {
  variant: { inner: "circle", marker: "rounded", pixel: "dots" },
};

export const CustomBranding = DisplayTemplate.bind({});
CustomBranding.args = {
  qrValue: "https://brand.example.com",
  blackColor: "#ec4899",
  whiteColor: "#ffffff",
  radius: 8,
  size: "300px",
};
CustomBranding.parameters = {
  variant: { inner: "circle", marker: "rounded", pixel: "dots" },
  docs: {
    description: {
      story: "QR code with custom brand colors and styling for marketing materials.",
    },
  },
};

export const HighContrast = DisplayTemplate.bind({});
HighContrast.args = {
  qrValue: "High contrast for accessibility",
  blackColor: "#000000",
  whiteColor: "#ffffff",
  radius: 0,
  size: "256px",
};
HighContrast.parameters = {
  variant: { inner: "default", marker: "default", pixel: "default" },
  docs: {
    description: {
      story: "High contrast QR code optimized for accessibility and scanning reliability.",
    },
  },
};

// ===== INTERACTIVE PLAYGROUND STORY =====

const PlaygroundTemplate: StoryFn<QrStoryArgs> = (args) => ({
  components: { DisplayQrCodeComponent },
  setup() {
    const qrValue = ref(args.qrValue);
    const variant = ref<QrCodeVariant>({
      inner: "circle",
      marker: "rounded",
      pixel: "dots",
    });
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

    return {
      qrValue,
      variant,
      radius,
      blackColor,
      whiteColor,
      sizeValue,
      size,
      presetValues,
      variantOptions,
    };
  },
  template: `
    <div style="padding: 40px;">
      <div style="display: grid; grid-template-columns: 1fr 300px; gap: 40px; align-items: start;">

        <!-- QR Code Display -->
        <div style="display: flex; align-items: center; justify-content: center; min-height: 400px; background: #f8fafc; border-radius: 8px; padding: 40px;">
          <DisplayQrCodeComponent
            :qrValue="qrValue"
            :variant="variant"
            :radius="radius"
            :blackColor="blackColor"
            :whiteColor="whiteColor"
            :size="size"
          />
        </div>

        <!-- Controls Panel -->
        <div style="background: white; padding: 24px; border-radius: 8px; border: 1px solid #e5e7eb;">
          <h3 style="margin: 0 0 20px 0; color: #374151; font-size: 18px;">QR Code Playground</h3>

          <!-- Content Presets -->
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Quick Presets:</label>
            <select @change="qrValue = $event.target.value" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              <option value="">Select a preset...</option>
              <option v-for="preset in presetValues" :key="preset.label" :value="preset.value">
                {{ preset.label }}
              </option>
            </select>
          </div>

          <!-- Custom Content -->
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Custom Content:</label>
            <textarea
              v-model="qrValue"
              rows="3"
              style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-family: monospace; font-size: 12px;"
              placeholder="Enter QR code content..."
            />
          </div>

          <!-- Variant Controls -->
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Style Variants:</label>
            <div style="display: grid; gap: 8px;">
              <div>
                <label style="font-size: 12px; color: #6b7280;">Inner:</label>
                <select v-model="variant.inner" style="width: 100%; padding: 4px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px;">
                  <option v-for="option in variantOptions" :key="option" :value="option">{{ option }}</option>
                </select>
              </div>
              <div>
                <label style="font-size: 12px; color: #6b7280;">Marker:</label>
                <select v-model="variant.marker" style="width: 100%; padding: 4px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px;">
                  <option v-for="option in variantOptions" :key="option" :value="option">{{ option }}</option>
                </select>
              </div>
              <div>
                <label style="font-size: 12px; color: #6b7280;">Pixel:</label>
                <select v-model="variant.pixel" style="width: 100%; padding: 4px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px;">
                  <option v-for="option in variantOptions" :key="option" :value="option">{{ option }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Visual Controls -->
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Appearance:</label>
            <div style="display: grid; gap: 12px;">
              <div>
                <label style="font-size: 12px; color: #6b7280;">Size: {{ sizeValue }}px</label>
                <input v-model.number="sizeValue" type="range" min="128" max="400" step="16" style="width: 100%;" />
              </div>
              <div>
                <label style="font-size: 12px; color: #6b7280;">Radius: {{ radius }}px</label>
                <input v-model.number="radius" type="range" min="0" max="20" step="1" style="width: 100%;" />
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div>
                  <label style="font-size: 12px; color: #6b7280;">Foreground:</label>
                  <input v-model="blackColor" type="color" style="width: 100%; height: 32px; border: 1px solid #d1d5db; border-radius: 4px;" />
                </div>
                <div>
                  <label style="font-size: 12px; color: #6b7280;">Background:</label>
                  <input v-model="whiteColor" type="color" style="width: 100%; height: 32px; border: 1px solid #d1d5db; border-radius: 4px;" />
                </div>
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
InteractivePlayground.parameters = {
  docs: {
    description: {
      story:
        "Interactive playground to experiment with QR code content, variants, and styling options. Try different presets or enter custom content.",
    },
  },
};

// ===== CAPTURE QR CODE STORIES =====

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
        <h3 style="margin: 0 0 10px 0; color: #374151;">📱 Live Camera QR Scanner</h3>
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

// ===== DECODE QR CODE STORIES =====

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
        <h3 style="margin: 0 0 10px 0; color: #374151;">📁 QR Image Decoder</h3>
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

// ===== COMPREHENSIVE INTEGRATION STORIES =====

const IntegrationTemplate: StoryFn = () => ({
  components: {
    DisplayQrCodeComponent,
    CaptureQrCodeComponent,
    DecodeQrCodeComponent,
  },
  setup() {
    const selectedDemo = ref("display");
    const qrValue = ref("https://github.com/srcdev/nuxt-components");

    const businessCardVariant: QrCodeVariant = {
      inner: "circle",
      marker: "rounded",
      pixel: "dots",
    };

    const wifiVariant: QrCodeVariant = {
      inner: "rounded",
      marker: "circle",
      pixel: "default",
    };

    const contactVariant: QrCodeVariant = {
      inner: "dots",
      marker: "rounded",
      pixel: "circle",
    };

    return {
      selectedDemo,
      qrValue,
      businessCardVariant,
      wifiVariant,
      contactVariant,
    };
  },
  template: `
    <div style="padding: 40px;">
      <!-- Demo Selector -->
      <div style="text-align: center; margin-bottom: 40px;">
        <h2 style="margin: 0 0 20px 0; color: #374151;">QR Code Component Suite</h2>
        <div style="display: inline-flex; background: #f3f4f6; border-radius: 8px; padding: 4px;">
          <button
            @click="selectedDemo = 'display'"
            :style="{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: selectedDemo === 'display' ? '#fff' : 'transparent',
              color: selectedDemo === 'display' ? '#374151' : '#6b7280',
              cursor: 'pointer',
              fontWeight: selectedDemo === 'display' ? '500' : '400'
            }"
          >
            Display Examples
          </button>
          <button
            @click="selectedDemo = 'interactive'"
            :style="{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: selectedDemo === 'interactive' ? '#fff' : 'transparent',
              color: selectedDemo === 'interactive' ? '#374151' : '#6b7280',
              cursor: 'pointer',
              fontWeight: selectedDemo === 'interactive' ? '500' : '400'
            }"
          >
            Interactive Tools
          </button>
          <button
            @click="selectedDemo = 'showcase'"
            :style="{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: selectedDemo === 'showcase' ? '#fff' : 'transparent',
              color: selectedDemo === 'showcase' ? '#374151' : '#6b7280',
              cursor: 'pointer',
              fontWeight: selectedDemo === 'showcase' ? '500' : '400'
            }"
          >
            Complete Showcase
          </button>
        </div>
      </div>

      <!-- Display Examples -->
      <div v-if="selectedDemo === 'display'" style="display: grid; gap: 32px;">

        <!-- Business Use Cases -->
        <div style="background: #f8fafc; padding: 24px; border-radius: 8px;">
          <h3 style="margin: 0 0 20px 0; color: #374151;">Business & Marketing</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; text-align: center;">

            <div>
              <DisplayQrCodeComponent
                qrValue="https://company.com/promo2024"
                :variant="businessCardVariant"
                :radius="8"
                blackColor="#1e40af"
                size="160px"
              />
              <h4 style="margin: 12px 0 4px 0; font-size: 14px; color: #374151;">Promotional Campaign</h4>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Marketing materials & ads</p>
            </div>

            <div>
              <DisplayQrCodeComponent
                qrValue="BEGIN:VCARD
VERSION:3.0
FN:Jane Smith
ORG:Tech Solutions Inc
TITLE:Senior Developer
TEL:+1-555-0123
EMAIL:jane@techsolutions.com
URL:https://linkedin.com/in/janesmith
END:VCARD"
                :variant="contactVariant"
                :radius="12"
                blackColor="#059669"
                size="160px"
              />
              <h4 style="margin: 12px 0 4px 0; font-size: 14px; color: #374151;">Digital Business Card</h4>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Contact information sharing</p>
            </div>

            <div>
              <DisplayQrCodeComponent
                qrValue="WIFI:T:WPA;S:CompanyGuest;P:Welcome2024!;H:false;"
                :variant="wifiVariant"
                :radius="6"
                blackColor="#dc2626"
                size="160px"
              />
              <h4 style="margin: 12px 0 4px 0; font-size: 14px; color: #374151;">Guest WiFi Access</h4>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Easy network connection</p>
            </div>

          </div>
        </div>

        <!-- Event & Social -->
        <div style="background: #f8fafc; padding: 24px; border-radius: 8px;">
          <h3 style="margin: 0 0 20px 0; color: #374151;">Events & Social</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; text-align: center;">

            <div>
              <DisplayQrCodeComponent
                qrValue="BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Product Launch Event
DTSTART:20260315T180000Z
DTEND:20260315T210000Z
LOCATION:Convention Center Hall A
DESCRIPTION:Join us for the biggest product launch of the year!
END:VEVENT
END:VCALENDAR"
                :variant="{ inner: 'circle', marker: 'rounded', pixel: 'dots' }"
                :radius="10"
                blackColor="#7c3aed"
                size="160px"
              />
              <h4 style="margin: 12px 0 4px 0; font-size: 14px; color: #374151;">Event Registration</h4>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Calendar integration</p>
            </div>

            <div>
              <DisplayQrCodeComponent
                qrValue="sms:+1-555-0199?body=I'm interested in learning more about your services!"
                :variant="{ inner: 'rounded', marker: 'dots', pixel: 'circle' }"
                :radius="8"
                blackColor="#f59e0b"
                size="160px"
              />
              <h4 style="margin: 12px 0 4px 0; font-size: 14px; color: #374151;">Quick Contact</h4>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Pre-filled SMS message</p>
            </div>

            <div>
              <DisplayQrCodeComponent
                qrValue="geo:40.7589,-73.9851?q=40.7589,-73.9851(Times Square, New York)"
                :variant="{ inner: 'dots', marker: 'circle', pixel: 'rounded' }"
                :radius="4"
                blackColor="#ec4899"
                size="160px"
              />
              <h4 style="margin: 12px 0 4px 0; font-size: 14px; color: #374151;">Location Sharing</h4>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">GPS coordinates</p>
            </div>

          </div>
        </div>

      </div>

      <!-- Interactive Tools -->
      <div v-if="selectedDemo === 'interactive'" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 32px;">

        <div style="background: #f8fafc; padding: 24px; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0; color: #374151; display: flex; align-items: center;">
            📱 <span style="margin-left: 8px;">Camera Scanner</span>
          </h3>
          <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">
            Real-time QR code detection using device camera. Perfect for mobile apps and kiosks.
          </p>
          <div style="border: 2px dashed #d1d5db; border-radius: 8px; padding: 20px; text-align: center;">
            <p style="margin: 0; color: #9ca3af;">Interactive camera component would appear here</p>
            <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">Requires camera permissions in live environment</p>
          </div>
        </div>

        <div style="background: #f8fafc; padding: 24px; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0; color: #374151; display: flex; align-items: center;">
            📁 <span style="margin-left: 8px;">File Decoder</span>
          </h3>
          <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">
            Upload or drag QR code images for instant decoding. Supports all major image formats.
          </p>
          <div style="border: 2px dashed #d1d5db; border-radius: 8px; padding: 20px; text-align: center; min-height: 120px; display: flex; align-items: center; justify-content: center;">
            <div>
              <p style="margin: 0; color: #9ca3af;">Drop QR code images here</p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">or click to upload</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Complete Showcase -->
      <div v-if="selectedDemo === 'showcase'">
        <div style="display: grid; gap: 40px;">

          <!-- Style Variants Matrix -->
          <div style="background: #f8fafc; padding: 24px; border-radius: 8px;">
            <h3 style="margin: 0 0 20px 0; color: #374151;">Style Variant Matrix</h3>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; text-align: center;">

              <div>
                <DisplayQrCodeComponent
                  qrValue="Default Style"
                  :variant="{ inner: 'default', marker: 'default', pixel: 'default' }"
                  :radius="0"
                  blackColor="#000000"
                  size="120px"
                />
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">Default</p>
              </div>

              <div>
                <DisplayQrCodeComponent
                  qrValue="Circle Style"
                  :variant="{ inner: 'circle', marker: 'circle', pixel: 'circle' }"
                  :radius="8"
                  blackColor="#1e40af"
                  size="120px"
                />
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">Circle</p>
              </div>

              <div>
                <DisplayQrCodeComponent
                  qrValue="Rounded Style"
                  :variant="{ inner: 'rounded', marker: 'rounded', pixel: 'rounded' }"
                  :radius="12"
                  blackColor="#059669"
                  size="120px"
                />
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">Rounded</p>
              </div>

              <div>
                <DisplayQrCodeComponent
                  qrValue="Dots Style"
                  :variant="{ inner: 'dots', marker: 'dots', pixel: 'dots' }"
                  :radius="6"
                  blackColor="#dc2626"
                  size="120px"
                />
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">Dots</p>
              </div>

            </div>
          </div>

          <!-- Size Variations -->
          <div style="background: #f8fafc; padding: 24px; border-radius: 8px;">
            <h3 style="margin: 0 0 20px 0; color: #374151;">Size Variations</h3>
            <div style="display: flex; align-items: center; justify-content: space-around; flex-wrap: wrap; gap: 20px;">

              <div style="text-align: center;">
                <DisplayQrCodeComponent
                  qrValue="Small 96px"
                  :variant="businessCardVariant"
                  :radius="4"
                  blackColor="#7c3aed"
                  size="96px"
                />
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">Small (96px)</p>
              </div>

              <div style="text-align: center;">
                <DisplayQrCodeComponent
                  qrValue="Medium 160px"
                  :variant="businessCardVariant"
                  :radius="6"
                  blackColor="#7c3aed"
                  size="160px"
                />
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">Medium (160px)</p>
              </div>

              <div style="text-align: center;">
                <DisplayQrCodeComponent
                  qrValue="Large 240px"
                  :variant="businessCardVariant"
                  :radius="8"
                  blackColor="#7c3aed"
                  size="240px"
                />
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">Large (240px)</p>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  `,
});

export const ComponentIntegration = IntegrationTemplate.bind({});
ComponentIntegration.parameters = {
  docs: {
    description: {
      story:
        "Complete integration showcase of all QR Code components with real-world examples, interactive tools, and comprehensive styling options. Switch between different demo modes to explore all capabilities.",
    },
  },
};

// Export the meta for the main component
export default DisplayQrCodeMeta;
