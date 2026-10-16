import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import InputTextareaField from "../InputTextareaField.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms.d";
import type { MediaCanvas } from "~/types/components";

interface StoryArgs {
  modelValue: string;
  name: string;
  label: string;
  placeholder: string;
  maxlength: number;
  errorMessage: string;
  fieldHasError: boolean;
  required: boolean;
  readonly: boolean;
  theme: FormUiTheme;
  inputVariant: InputUiVariant;
  styleClassPassthrough: string[];
  descriptionText: string;
  descriptionHtml: string;
}

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Input Textarea/InputTextareaField",
  component: InputTextareaField,
  argTypes: {
    modelValue: { control: "text", table: { category: "Model" } },
    name: { control: "text", table: { category: "Basic" } },
    label: { control: "text", table: { category: "Basic" } },
    placeholder: { control: "text", table: { category: "Basic" } },
    maxlength: { control: "number", table: { category: "Basic" } },
    errorMessage: { control: "text", table: { category: "Validation" } },
    fieldHasError: { control: "boolean", table: { category: "Validation" } },
    required: { control: "boolean", table: { category: "Validation" } },
    readonly: { control: "boolean", table: { category: "States" } },
    theme: {
      control: { type: "select" },
      options: ["default", "success", "error", "warning"],
      table: { category: "Styling" },
    },
    inputVariant: {
      control: { type: "select" },
      options: ["normal", "outlined", "underlined"],
      table: { category: "Styling" },
    },
    styleClassPassthrough: { control: "object", table: { category: "Styling" } },
    descriptionText: { control: "text", description: "Story-only: fills the descriptionText slot", table: { category: "Slots" } },
    descriptionHtml: { control: "text", description: "Story-only: fills the descriptionHtml slot", table: { category: "Slots" } },
  },
  args: {
    modelValue: "",
    name: "message",
    label: "Your message",
    placeholder: "",
    maxlength: 1000,
    errorMessage: "",
    fieldHasError: false,
    required: false,
    readonly: false,
    theme: "default",
    inputVariant: "normal",
    styleClassPassthrough: [],
    descriptionText: "",
    descriptionHtml: "",
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
          <story />
        </div>
      `,
    }),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Labelled textarea field: `InputLabel`, an optional description (`descriptionText`/`descriptionHtml` slots, moved after the control for the `outlined` variant), `InputTextarea` and an error strip, linked through `aria-describedby`. `left`/`right` slots pass through to `InputTextarea`. `style-class-passthrough` lands on the `.input-textarea-field` root only.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const render = (args: StoryArgs) => ({
  components: { InputTextareaField },
  setup() {
    const componentArgs = computed(() => {
      const { modelValue: _modelValue, descriptionText: _text, descriptionHtml: _html, ...rest } = args;
      return rest;
    });
    return { args, componentArgs };
  },
  template: `
    <InputTextareaField v-model="args.modelValue" v-bind="componentArgs">
      <template v-if="args.descriptionText" #descriptionText>{{ args.descriptionText }}</template>
      <template v-if="args.descriptionHtml" #descriptionHtml><span v-html="args.descriptionHtml"></span></template>
    </InputTextareaField>
  `,
});

export const Default: Story = { render };

export const WithDescription: Story = { args: { descriptionText: "Tell us how we can help." }, render };

export const WithHtmlDescription: Story = {
  args: { descriptionHtml: "Keep it under <strong>1000 characters</strong>. <em>No personal details, please.</em>" },
  render,
};

export const WithError: Story = {
  args: { fieldHasError: true, errorMessage: "Please enter a message", required: true },
  render,
};

export const Required: Story = { args: { required: true }, render };

export const Outlined: Story = {
  args: { inputVariant: "outlined", descriptionText: "Tell us how we can help." },
  render,
  parameters: { docs: { description: { story: "The `outlined` variant renders the description after the control and error." } } },
};

export const Underlined: Story = { args: { inputVariant: "underlined" }, render };

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    maxlength: 5000,
    modelValue: "Kundenzufriedenheitsrückmeldungsformularausfüllanleitung https://example.com/a/very/long/unbroken/url\n<b>not bold</b> 🎉\n" + "Alex Morgan from Northtown wrote a long message. ".repeat(20),
    label: "💬 Ausführlichebeschreibungihresanliegensfürunserkundenserviceteam https://example.com/a/very/long/unbroken/url <b>not bold</b> رسالتك",
    descriptionText: "يرجى وصف طلبك بالتفصيل Bitte beschreiben Sie Ihr Anliegen so ausführlich wie möglich, damit wir Ihnen schnell helfen können.",
    errorMessage: "IhrenachrichtüberschreitetleiderdiezulässigeZeichenanzahlbittekürzenSiesie",
    fieldHasError: true,
    required: true,
  },
  render,
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "Long unbroken German, URL, emoji, HTML-like and right-to-left copy in the label, description, value and error, with a long multi-line value. Check at every canvas width: everything wraps inside the dashed outline, line breaks in the value are kept, and markup renders as text.",
      },
    },
  },
};
