import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import InputText from "../InputText.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { FormUiTheme, InputMode, InputTypesText, InputUiVariant } from "~/types/forms/types.forms.d";
import type { MediaCanvas } from "~/types/components";

interface StoryArgs {
  modelValue: string;
  id: string;
  name: string;
  type: InputTypesText;
  inputmode: InputMode;
  placeholder: string;
  maxlength: number;
  min: string;
  max: string;
  autocomplete: string;
  required: boolean;
  readonly: boolean;
  fieldHasError: boolean;
  theme: FormUiTheme;
  inputVariant: InputUiVariant;
  styleClassPassthrough: string[];
  leftSlotContent: string;
  rightSlotContent: string;
}

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Input Text/InputText",
  component: InputText,
  argTypes: {
    modelValue: { control: "text", table: { category: "Model" } },
    id: { control: "text", table: { category: "Basic" } },
    name: { control: "text", table: { category: "Basic" } },
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "number", "tel", "url", "date"],
      table: { category: "Basic" },
    },
    inputmode: {
      control: { type: "select" },
      options: ["text", "email", "tel", "url", "search", "numeric", "none", "decimal"],
      description: "`numeric` also blocks typing anything but digits",
      table: { category: "Basic" },
    },
    placeholder: { control: "text", table: { category: "Basic" } },
    maxlength: { control: "number", table: { category: "Basic" } },
    min: { control: "text", description: 'Native min, e.g. the earliest date for type="date"', table: { category: "Basic" } },
    max: { control: "text", description: 'Native max, e.g. the latest date for type="date"', table: { category: "Basic" } },
    autocomplete: { control: "text", description: "Native autocomplete token, e.g. `email`", table: { category: "Basic" } },
    required: { control: "boolean", table: { category: "Validation" } },
    readonly: { control: "boolean", table: { category: "States" } },
    fieldHasError: { control: "boolean", table: { category: "Validation" } },
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
    leftSlotContent: { control: "text", description: "Story-only: fills the left slot", table: { category: "Slots" } },
    rightSlotContent: { control: "text", description: "Story-only: fills the right slot", table: { category: "Slots" } },
  },
  args: {
    modelValue: "",
    id: "example-input",
    name: "example",
    type: "text",
    inputmode: "text",
    placeholder: "Enter text",
    maxlength: 255,
    min: "",
    max: "",
    autocomplete: "",
    required: false,
    readonly: false,
    fieldHasError: false,
    theme: "default",
    inputVariant: "normal",
    styleClassPassthrough: [],
    leftSlotContent: "",
    rightSlotContent: "",
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
          "Bare native `<input>` for the `05.forms` text family: no label, description or error (use `InputTextField`, `InputPasswordField` or `InputTextAsNumberField` for those, or pair it with your own `<label for>`). `left`/`right` slots hold decorations or inline `InputButton`s. `inputmode=\"numeric\"` blocks non-digit typing. State is exposed as `data-*` attributes on `.input-text-wrapper`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const render = (args: StoryArgs) => ({
  components: { InputText },
  setup() {
    const componentArgs = computed(() => {
      const {
        modelValue: _modelValue,
        leftSlotContent: _left,
        rightSlotContent: _right,
        min,
        max,
        autocomplete,
        ...rest
      } = args;
      return { ...rest, min: min || undefined, max: max || undefined, autocomplete: autocomplete || undefined };
    });
    return { args, componentArgs };
  },
  template: `
    <InputText v-model="args.modelValue" v-bind="componentArgs">
      <template v-if="args.leftSlotContent" #left>{{ args.leftSlotContent }}</template>
      <template v-if="args.rightSlotContent" #right>{{ args.rightSlotContent }}</template>
    </InputText>
    <p style="margin-block-start: 1.6rem; font-family: monospace;">modelValue: {{ JSON.stringify(args.modelValue) }}</p>
  `,
});

export const Default: Story = { render };

export const WithSlots: Story = { args: { leftSlotContent: "📧", rightSlotContent: "🔍" }, render };

export const WithError: Story = { args: { fieldHasError: true, theme: "error" }, render };

export const Readonly: Story = {
  args: { readonly: true, modelValue: "en-GB", inputVariant: "underlined" },
  render,
  parameters: { docs: { description: { story: "`readonly` reaches the native input and sets `data-readonly` on the wrapper." } } },
};

export const NumericOnly: Story = {
  args: { inputmode: "numeric", placeholder: "Digits only" },
  render,
  parameters: {
    docs: { description: { story: "`inputmode=\"numeric\"` shows a number keypad on phones and blocks typing anything but digits." } },
  },
};

export const Underlined: Story = { args: { inputVariant: "underlined" }, render };

export const DateWithMinMax: Story = {
  args: { type: "date", name: "appointmentDate", min: new Date().toISOString().split("T")[0], max: "2027-12-31" },
  render,
  parameters: { docs: { description: { story: "A date input whose picker can't go before today." } } },
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    modelValue:
      "Donaudampfschifffahrtsgesellschaftskapitänswitwenrentenversicherung https://example.com/a/very/long/unbroken/url <b>not bold</b>",
    placeholder: "Bitte geben Sie hier Ihre vollständige Lieferadresse einschließlich Postleitzahl ein",
    leftSlotContent: "🔎🔎🔎",
    rightSlotContent: "عربى",
    fieldHasError: true,
  },
  render,
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "A long unbroken German, URL and HTML-like value with a long placeholder and text in both slots. Check at every canvas width: the input stays inside the dashed outline and scrolls its text instead of growing, the slots keep their size, and markup renders as text. Clear it to check the placeholder.",
      },
    },
  },
};
