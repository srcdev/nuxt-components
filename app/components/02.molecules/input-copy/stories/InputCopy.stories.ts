import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import InputCopy from "../InputCopy.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { MediaCanvas } from "~/types/components";

type LineClamp = "none" | "1" | "2" | "3" | "4";

// Story-only arg: drives a CSS token, not an InputCopy prop. See its argTypes entry.
type StoryArgs = InstanceType<typeof InputCopy>["$props"] & {
  descriptionLineClamp: LineClamp;
};

const meta: Meta<StoryArgs> = {
  title: "Molecules/Input Copy",
  component: InputCopy,
  argTypes: {
    value: { control: "text", description: "The text copied to the clipboard", table: { category: "Content" } },
    label: {
      control: "text",
      description: "Accessible name for the input (not rendered visibly) and the default button aria-label",
      table: { category: "Content" },
    },
    description: {
      control: "text",
      description: "Helper text below the input, linked to it with aria-describedby",
      table: { category: "Content" },
    },
    buttonText: { control: "text", description: "Button label", table: { category: "Content" } },
    copiedText: {
      control: "text",
      description: "Button label and status announcement after a successful copy",
      table: { category: "Content" },
    },
    ariaLabel: {
      control: "text",
      description: "Accessible name for the input; overrides label",
      table: { category: "Accessibility" },
    },
    buttonAriaLabel: {
      control: "text",
      description: "Accessible name for the button. Defaults to `Copy <label> to clipboard`; pass translated copy in other languages.",
      table: { category: "Accessibility" },
    },
    icon: { control: "text", description: "Iconify name for the resting icon", table: { category: "Appearance" } },
    copiedIcon: {
      control: "text",
      description: "Iconify name shown after a successful copy",
      table: { category: "Appearance" },
    },
    copiedDuration: {
      control: "number",
      description: "Milliseconds the copied state lasts",
      table: { category: "Behaviour" },
    },
    isDisabled: { control: "boolean", description: "Disables the copy button", table: { category: "Behaviour" } },
    id: {
      control: "text",
      description: "Defaults to an auto-generated id; pass one only if something needs to target this input.",
      table: { category: "Form" },
    },
    name: { control: "text", description: "Defaults to the resolved id", table: { category: "Form" } },
    styleClassPassthrough: {
      control: "object",
      description: "Extra classes on the root element",
      table: { category: "Styling" },
    },
    descriptionLineClamp: {
      control: "select",
      options: ["none", "1", "2", "3", "4"] satisfies LineClamp[],
      description:
        "**Story control, not a prop.** Sets the `--input-copy-description-line-clamp` CSS token on a wrapper so you can try it here. " +
        "To use it in an app, set the token in your own CSS, e.g. `.account-page { --input-copy-description-line-clamp: 2; }`. " +
        "`1` is single-line ellipsis, `none` (the default) shows everything.",
      table: { category: "CSS tokens (story only, set in your CSS)", defaultValue: { summary: "none" } },
    },
  },
  args: {
    value: "sk_live_abc123defgh456xyz789uvw",
    label: "License key",
    description: "Your license key is ready to use. Copy it to embed in your application.",
    buttonText: "Copy",
    copiedText: "Copied!",
    icon: "lucide:copy",
    copiedIcon: "lucide:check",
    copiedDuration: 2000,
    isDisabled: false,
    styleClassPassthrough: [],
    descriptionLineClamp: "none",
  },
  decorators: [
    (story, context) => ({
      components: { story, CanvasSwitcher },
      setup() {
        const canvasName = ref<MediaCanvas>(context.parameters.initialCanvas ?? "tabletCanvas");
        return { canvasName };
      },
      template: `
        <div style="padding: 1.2rem 1.6rem; border-block-end: 1px solid currentColor;">
          <CanvasSwitcher v-model:canvas-name="canvasName" />
        </div>
        <div :class="canvasName" style="margin-inline: auto; padding: 2rem; outline: 1px dashed currentColor;">
          <story />
        </div>
      `,
    }),
  ],
  render: (args) => ({
    components: { InputCopy },
    setup() {
      const componentArgs = computed(() => {
        const { descriptionLineClamp: _descriptionLineClamp, ...rest } = args;
        return rest;
      });
      const tokenStyles = computed(() => ({ "--input-copy-description-line-clamp": args.descriptionLineClamp }));
      const log = (event: string) => (value: string) => console.log(`${event}: ${value}`);
      return { componentArgs, tokenStyles, log };
    },
    template: `
      <div :style="tokenStyles">
        <InputCopy v-bind="componentArgs" @copy="log('copy')" @copied="log('copied')" />
      </div>
    `,
  }),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A readonly input with a copy-to-clipboard button, for license keys, API tokens or any copyable identifier. " +
          "The button is an inline `InputButton`; after a successful copy it shows `copiedText` and `copiedIcon` for `copiedDuration` ms, " +
          "announces `copiedText` through a status region and stays focusable (aria-disabled) so focus isn't lost. " +
          "Below 48rem of its own width the button shows only its icon. Emits `copy` and `copied` after the clipboard write succeeds.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Default: Story = {};

export const APIToken: Story = {
  args: {
    value: "example_token_not_real_0123456789abcdef",
    label: "API token",
    description: "Your API token for authentication. Do not share this token.",
    buttonText: "Copy token",
    copiedText: "Token copied!",
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

export const WithExplicitIdAndName: Story = {
  args: {
    id: "checkout-license-key",
    name: "licenseKey",
    description: "Passes an explicit id and name instead of relying on the auto-generated one.",
  },
};

export const LongValue: Story = {
  args: {
    value:
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggTW9yZ2FuIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.POdHyP_DQkT3WTZhu9qLWSwVe8ZlHfHEPBOzzVI3vFA",
    label: "JWT token",
    description: "Your JWT authentication token. This is a long-lived token used for API access.",
  },
};

const stressCases = [
  {
    key: "german",
    value: "Lizenzschlüssel-Einzelplatz-Nordstadt-2026-ABCDEF-123456",
    label: "Lizenzschlüssel",
    buttonText: "In die Zwischenablage kopieren",
    copiedText: "Erfolgreich in die Zwischenablage kopiert!",
    buttonAriaLabel: "Lizenzschlüssel in die Zwischenablage kopieren",
    description:
      "Ihr Lizenzschlüssel ist einsatzbereit. Kopieren Sie ihn und fügen Sie ihn in die Einstellungen Ihrer Anwendung ein, um die Komponente zu aktivieren. Bewahren Sie ihn sicher auf.",
  },
  {
    key: "unbroken",
    value: "x".repeat(240),
    label: "Token",
    buttonText: "Zwischenablagekopiervorgangsbestätigung",
    copiedText: "Kopiert",
    description: "https://example.com/a-very-long-path-segment-without-any-spaces-at-all-in-it/and-another-one-after-it",
  },
  {
    key: "emoji-html",
    value: "🔑 <script>alert('xss')</script>",
    label: "<b>Key</b>",
    buttonText: "📋 <i>Copy</i>",
    copiedText: "✅",
    description: "🙂 <em>HTML-like</em> text must render as text & never as markup.",
  },
  {
    key: "rtl",
    value: "مفتاح-الترخيص-١٢٣٤٥",
    label: "مفتاح الترخيص",
    buttonText: "نسخ",
    copiedText: "تم النسخ!",
    buttonAriaLabel: "نسخ مفتاح الترخيص",
    description: "مفتاح الترخيص جاهز للاستخدام. انسخه وأضفه إلى تطبيقك.",
    dir: "rtl",
  },
  {
    key: "minimal",
    value: "",
    label: "",
    buttonText: "",
    copiedText: "",
    description: "A",
  },
];

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  render: (args) => ({
    components: { InputCopy },
    setup() {
      const tokenStyles = computed(() => ({ "--input-copy-description-line-clamp": args.descriptionLineClamp }));
      return { args, tokenStyles, stressCases };
    },
    template: `
      <div :style="tokenStyles" style="display: grid; gap: 2.4rem;">
        <div v-for="item in stressCases" :key="item.key" :dir="item.dir">
          <InputCopy
            :value="item.value"
            :label="item.label"
            :button-text="item.buttonText"
            :copied-text="item.copiedText"
            :button-aria-label="item.buttonAriaLabel"
            :description="item.description"
            :copied-duration="args.copiedDuration"
          />
        </div>
        <InputCopy value="x" description="Broken icon names: the button must still render and work." icon="not-a-real:icon" copied-icon="also-not:real" />
      </div>
    `,
  }),
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "Hostile data: long German value, label, button text, copied text and description; a 240-character unbroken value with an unbroken " +
          "button label and a long URL as the description; emoji and HTML-like text (must render as text); right-to-left Arabic; an empty " +
          "value, label and button text; and broken icon names. Check at every CanvasSwitcher width that the input never collapses to " +
          "nothing (the button is capped at half the row and its label wraps), the description wraps instead of overflowing, the button " +
          "drops to icon-only below 48rem, and copying still shows the copied state. Try the description line-clamp control (a CSS token).",
      },
    },
  },
};
