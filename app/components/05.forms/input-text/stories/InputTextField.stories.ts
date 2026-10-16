import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import InputTextField from "../InputTextField.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { FormUiTheme, InputMode, InputTypesText, InputUiVariant } from "~/types/forms/types.forms.d";
import type { MediaCanvas } from "~/types/components";

interface StoryArgs {
  modelValue: string;
  name: string;
  label: string;
  type: InputTypesText;
  inputmode: InputMode;
  placeholder: string;
  min: string;
  max: string;
  autocomplete: string;
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
  title: "Components/Forms/Input Text/InputTextField",
  component: InputTextField,
  argTypes: {
    modelValue: { control: "text", table: { category: "Model" } },
    name: { control: "text", table: { category: "Basic" } },
    label: { control: "text", table: { category: "Basic" } },
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "number", "tel", "url", "date"],
      table: { category: "Basic" },
    },
    inputmode: {
      control: { type: "select" },
      options: ["text", "email", "tel", "url", "search", "numeric", "none", "decimal"],
      table: { category: "Basic" },
    },
    placeholder: { control: "text", table: { category: "Basic" } },
    min: { control: "text", table: { category: "Basic" } },
    max: { control: "text", table: { category: "Basic" } },
    autocomplete: { control: "text", description: "Native autocomplete token, e.g. `email`", table: { category: "Basic" } },
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
    name: "email",
    label: "Email address",
    type: "email",
    inputmode: "email",
    placeholder: "name@example.com",
    min: "",
    max: "",
    autocomplete: "email",
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
          "Labelled text field: `InputLabel`, an optional description (`descriptionText`/`descriptionHtml` slots, moved after the control for the `outlined` variant), `InputText` and an error strip, linked through `aria-describedby`. `left`/`right` slots pass through to `InputText`. `style-class-passthrough` lands on the `.input-text-field` root only.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const render = (args: StoryArgs) => ({
  components: { InputTextField },
  setup() {
    const componentArgs = computed(() => {
      const { modelValue: _modelValue, descriptionText: _text, descriptionHtml: _html, min, max, autocomplete, ...rest } = args;
      return { ...rest, min: min || undefined, max: max || undefined, autocomplete: autocomplete || undefined };
    });
    return { args, componentArgs };
  },
  template: `
    <InputTextField v-model="args.modelValue" v-bind="componentArgs">
      <template v-if="args.descriptionText" #descriptionText>{{ args.descriptionText }}</template>
      <template v-if="args.descriptionHtml" #descriptionHtml><span v-html="args.descriptionHtml"></span></template>
    </InputTextField>
    <p style="margin-block-start: 1.6rem; font-family: monospace;">modelValue: {{ JSON.stringify(args.modelValue) }}</p>
  `,
});

export const Default: Story = { render };

export const WithDescription: Story = { args: { descriptionText: "We only use it to reply to you." }, render };

export const WithHtmlDescription: Story = {
  args: {
    label: "Username",
    type: "text",
    inputmode: "text",
    autocomplete: "username",
    placeholder: "",
    descriptionHtml: "Use <strong>3 to 20</strong> letters, numbers or <em>underscores</em>.",
  },
  render,
};

export const Required: Story = { args: { required: true }, render };

export const WithError: Story = {
  args: { fieldHasError: true, errorMessage: "Please enter a valid email address", modelValue: "not-an-email" },
  render,
};

export const Readonly: Story = { args: { readonly: true, modelValue: "alex.morgan@example.com" }, render };

export const Outlined: Story = {
  args: { inputVariant: "outlined", descriptionText: "We only use it to reply to you." },
  render,
  parameters: { docs: { description: { story: "The `outlined` variant renders the description after the control and error." } } },
};

export const Underlined: Story = { args: { inputVariant: "underlined" }, render };

export const DateWithMinMax: Story = {
  args: {
    type: "date",
    inputmode: "text",
    label: "Appointment date",
    name: "appointmentDate",
    autocomplete: "",
    placeholder: "",
    min: new Date().toISOString().split("T")[0],
    max: "2027-12-31",
  },
  render,
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    modelValue: "alex.morgan.with.a.very.long.unbroken.address@subdomain.northtown-example.co.uk",
    label:
      "📧 Elektronischepostadressefürdiebenachrichtigungüberbestellungen https://example.com/a/very/long/unbroken/url <b>not bold</b> البريد",
    descriptionText: "يرجى إدخال بريدك الإلكتروني Wir verwenden Ihre Adresse ausschließlich für Rückfragen zu Ihrer Bestellung.",
    placeholder: "Bitte geben Sie Ihre vollständige E-Mail-Adresse ein",
    errorMessage: "DieseadresseistleiderungültigbitteüberprüfenSiedieSchreibweise",
    fieldHasError: true,
    required: true,
  },
  render,
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "Long unbroken German, URL, emoji, HTML-like and right-to-left copy in the label, description, value, placeholder and error. Check at every canvas width: the label, description and error wrap inside the dashed outline, the input never pushes past it, and markup renders as text.",
      },
    },
  },
};
