import type { Meta, StoryObj } from "@nuxtjs/storybook";
import InputCopy from "../InputCopy.vue";

const meta: Meta<typeof InputCopy> = {
  title: "Molecules/Input Copy",
  component: InputCopy,
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    buttonText: { control: "text" },
    copiedText: { control: "text" },
    copiedDuration: { control: "number" },
    isDisabled: { control: "boolean" },
  },
  args: {
    value: "sk_live_abc123defgh456xyz789uvw",
    label: "License key",
    description: "Your license key is ready to use. Copy it to embed in your application.",
    buttonText: "Copy",
    copiedText: "Copied!",
    copiedDuration: 2000,
    isDisabled: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          "A readonly input field with a copy-to-clipboard button. Displays a value that users can quickly copy to their clipboard. " +
          "Shows feedback ('Copied!') for a brief duration after successful copy. " +
          "Emits `copy` and `copied` events. Useful for license keys, API tokens, or any copyable identifier.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const storyWrapper = (args: Record<string, unknown>) => ({
  components: { InputCopy },
  setup() {
    const handleCopy = (value: string) => {
      console.log(`Copied: ${value}`);
    };
    const handleCopied = (value: string) => {
      console.log(`Copied event fired: ${value}`);
    };
    return { args, handleCopy, handleCopied };
  },
  template: `
    <div style="padding: 2rem; background: #f5f5f5; border-radius: 0.5rem; max-width: 600px;">
      <InputCopy v-bind="args" @copy="handleCopy" @copied="handleCopied" />
    </div>
  `,
});

export const Default: Story = {
  render: (args) => storyWrapper(args),
};

export const LicenseKey: Story = {
  args: {
    value: "gmh_lic_single_site_abc123def456ghi789",
    label: "License key",
    description: "Your GuideMyHair license key. Keep this safe and use it to embed the widget.",
  },
};

export const APIToken: Story = {
  args: {
    value: "ghp_16C7e42F292c6912E7710c838347Ae178B4a",
    label: "API token",
    description: "Your API token for authentication. Do not share this token.",
  },
};

export const ShortValue: Story = {
  args: {
    value: "ABC-123-XYZ",
    label: "Invite code",
    description: "Share this invite code with your team members.",
  },
};

export const Disabled: Story = {
  args: {
    value: "Disabled input",
    label: "License key",
    isDisabled: true,
    description: "This input is disabled and cannot be copied.",
  },
};

export const NoDescription: Story = {
  args: {
    value: "sk_test_51234567890abcdef",
    label: "Secret key",
    description: undefined,
  },
};

export const LongValue: Story = {
  args: {
    value: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.POdHyP_DQkT3WTZhu9qLWSwVe8ZlHfHEPBOzzVI3vFA",
    label: "JWT token",
    description: "Your JWT authentication token. This is a long-lived token used for API access.",
  },
};
