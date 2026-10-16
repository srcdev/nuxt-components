import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import InputNumberField from "../InputNumberField.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms.d";
import type { MediaCanvas } from "~/types/components";

interface StoryArgs {
  modelValue: number;
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  placeholder: string;
  errorMessage: string;
  fieldHasError: boolean;
  required: boolean;
  theme: FormUiTheme;
  inputVariant: InputUiVariant;
  stepDownLabel: string;
  stepUpLabel: string;
  useStepButtons: boolean;
  descriptionText: string;
}

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Input Number/InputNumberField",
  component: InputNumberField,
  argTypes: {
    modelValue: { control: "number", table: { category: "Model" } },
    name: { control: "text", table: { category: "Basic" } },
    label: { control: "text", table: { category: "Basic" } },
    min: { control: "number", table: { category: "Basic" } },
    max: { control: "number", table: { category: "Basic" } },
    step: { control: "number", table: { category: "Basic" } },
    placeholder: { control: "text", table: { category: "Basic" } },
    errorMessage: { control: "text", table: { category: "Validation" } },
    fieldHasError: { control: "boolean", table: { category: "Validation" } },
    required: { control: "boolean", table: { category: "Validation" } },
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
    stepDownLabel: { control: "text", description: "Localisation override for the step-down button", table: { category: "Accessibility" } },
    stepUpLabel: { control: "text", description: "Localisation override for the step-up button", table: { category: "Accessibility" } },
    useStepButtons: {
      control: "boolean",
      description: "Story-only: render the +/- step buttons by filling the left/right slots",
      table: { category: "Slots" },
    },
    descriptionText: {
      control: "text",
      description: "Story-only: fills the descriptionText slot",
      table: { category: "Slots" },
    },
  },
  args: {
    modelValue: 5,
    name: "quantity",
    label: "Quantity",
    min: 0,
    max: 10,
    step: 1,
    placeholder: "",
    errorMessage: "",
    fieldHasError: false,
    required: false,
    theme: "default",
    inputVariant: "normal",
    stepDownLabel: "Step down",
    stepUpLabel: "Step up",
    useStepButtons: false,
    descriptionText: "",
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
          "Labelled number field: `InputLabel`, an optional description, `InputNumber` and an error strip. Filling the `left`/`right` slots with an icon adds step buttons: they step by `step`, round away floating-point drift, clamp to `min`/`max` (pulling a typed out-of-range value back in) and start from 0, clamped, when the field is empty. `stepDownLabel`/`stepUpLabel` localise their accessible names.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const render = (args: StoryArgs) => ({
  components: { InputNumberField },
  setup() {
    const componentArgs = computed(() => {
      const { modelValue: _modelValue, useStepButtons: _useStepButtons, descriptionText: _descriptionText, ...rest } = args;
      return rest;
    });
    return { args, componentArgs };
  },
  template: `
    <InputNumberField v-model="args.modelValue" v-bind="componentArgs">
      <template v-if="args.descriptionText" #descriptionText>{{ args.descriptionText }}</template>
      <template v-if="args.useStepButtons" #left><Icon name="mdi:minus" /></template>
      <template v-if="args.useStepButtons" #right><Icon name="mdi:plus" /></template>
    </InputNumberField>
    <p style="margin-block-start: 1.6rem; font-family: monospace;">modelValue: {{ JSON.stringify(args.modelValue) }}</p>
  `,
});

export const Default: Story = { render };

export const WithStepButtons: Story = {
  args: { useStepButtons: true },
  render,
  parameters: { docs: { description: { story: "Step buttons from the `left`/`right` slots. Step-down goes read-only at `min`, step-up at `max`." } } },
};

export const DecimalSteps: Story = {
  args: { useStepButtons: true, label: "Weight (kg)", modelValue: 0.2, min: 0, max: 2, step: 0.1 },
  render,
  parameters: {
    docs: { description: { story: "A fractional `step`: stepping up from 0.2 gives 0.3, not 0.30000000000000004, and the mobile keyboard is `decimal`." } },
  },
};

export const WithError: Story = {
  args: { fieldHasError: true, errorMessage: "Please enter a valid quantity", theme: "error" },
  render,
};

export const Required: Story = { args: { required: true }, render };

export const LocalisedLabels: Story = {
  args: { useStepButtons: true, stepDownLabel: "Diminuer", stepUpLabel: "Augmenter" },
  render,
};

export const Underlined: Story = { args: { inputVariant: "underlined", useStepButtons: true }, render };

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    useStepButtons: true,
    modelValue: 123456789012,
    min: -999999999999,
    max: 999999999999999,
    step: 0.0001,
    label:
      "🔢 Gewünschteanzahlderteilnehmendenpersonenfürdiegruppenbuchung https://example.com/a/very/long/unbroken/url <b>not bold</b> عدد",
    descriptionText: "يرجى إدخال رقم Geben Sie eine Zahl zwischen minus einer Billion und einer Billiarde ein.",
    placeholder: "Bitte eine sehr lange Platzhalterzahl eingeben",
    errorMessage: "DiesezahlliegtleideraußerhalbdeszulässigenBereichsbitteversuchenSieeserneut",
    fieldHasError: true,
    stepDownLabel: "Verringern 🔽",
    stepUpLabel: "Erhöhen 🔼",
  },
  render,
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "A 12-digit value, a min of minus a trillion, a 15-digit max and a 0.0001 step, with long unbroken German/URL/emoji/RTL/HTML-like copy. Check at every canvas width: the label, description and error wrap inside the dashed outline, the control's minimum width is capped (12em) so it fits a phone, the step buttons keep their size, and markup renders as text. Clear the field and press step-up (starts from 0), type 9999999999999999 and press step-down (clamps to max), and set `step` to 0 or a negative number.",
      },
    },
  },
};
