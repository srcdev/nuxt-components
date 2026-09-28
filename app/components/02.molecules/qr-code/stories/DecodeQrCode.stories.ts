import type { Meta, StoryFn } from "@nuxtjs/storybook";
import DecodeQrCodeComponent from "../DecodeQrCode.vue";

const meta: Meta<typeof DecodeQrCodeComponent> = {
  title: "Molecules/QR Code/DecodeQrCode",
  component: DecodeQrCodeComponent,
  argTypes: {
    uploadLabel: {
      control: { type: "text" },
      description: "Visible label for the file input",
      table: { category: "Content" },
    },
    dropLabel: {
      control: { type: "text" },
      description: "Instruction text inside the drop zone",
      table: { category: "Content" },
    },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    uploadLabel: "Upload a QR code image",
    dropLabel: "Or drop a QR code image here",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "Decodes QR codes from an uploaded or dropped image (PNG, JPEG, WEBP and other common formats). Results are announced through a polite live region.",
      },
    },
  },
};

export default meta;

const Template: StoryFn<typeof DecodeQrCodeComponent> = (args) => ({
  components: { DecodeQrCodeComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 40px; max-width: 600px; margin: 0 auto;">
      <DecodeQrCodeComponent
        :upload-label="args.uploadLabel"
        :drop-label="args.dropLabel"
        :style-class-passthrough="args.styleClassPassthrough"
      />
    </div>
  `,
});

export const Default = Template.bind({});
