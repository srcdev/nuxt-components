import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import InputTextAsNumberField from "../InputTextAsNumberField.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms.d";
import type { MediaCanvas } from "~/types/components";

interface StoryArgs {
  modelValue: number | undefined;
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
  styleClassPassthrough: string[];
  stepDownText: string;
  stepUpText: string;
  useStepButtons: boolean;
  descriptionText: string;
}

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Input Text/InputTextAsNumberField",
  component: InputTextAsNumberField,
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
    styleClassPassthrough: { control: "object", table: { category: "Styling" } },
    stepDownText: { control: "text", description: "Step-down button's accessible name", table: { category: "Accessibility" } },
    stepUpText: { control: "text", description: "Step-up button's accessible name", table: { category: "Accessibility" } },
    useStepButtons: {
      control: "boolean",
      description: "Story-only: render the step buttons by filling the left/right slots",
      table: { category: "Slots" },
    },
    descriptionText: { control: "text", description: "Story-only: fills the descriptionText slot", table: { category: "Slots" } },
  },
  args: {
    modelValue: 1,
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
    styleClassPassthrough: [],
    stepDownText: "Step down",
    stepUpText: "Step up",
    useStepButtons: true,
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
          "A number field built on a text input (`InputText`), for a compact stepper without the native number spinner. `v-model` is a number, or `undefined` when empty. Filling the `left`/`right` slots adds step buttons that step by `step`, round away floating-point drift, clamp to `min`/`max` and start from 0, clamped, when empty. Typing is digits-only for whole, non-negative ranges; a fractional `step` switches to a decimal keypad, and a negative `min` to a text keyboard so a minus sign can be typed.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const render = (args: StoryArgs) => ({
  components: { InputTextAsNumberField },
  setup() {
    const componentArgs = computed(() => {
      const { modelValue: _modelValue, useStepButtons: _useStepButtons, descriptionText: _descriptionText, ...rest } = args;
      return rest;
    });
    return { args, componentArgs };
  },
  template: `
    <InputTextAsNumberField v-model="args.modelValue" v-bind="componentArgs">
      <template v-if="args.descriptionText" #descriptionText>{{ args.descriptionText }}</template>
      <template v-if="args.useStepButtons" #left><Icon name="mdi:minus" /></template>
      <template v-if="args.useStepButtons" #right><Icon name="mdi:plus" /></template>
    </InputTextAsNumberField>
    <p style="margin-block-start: 1.6rem; font-family: monospace;">modelValue: {{ JSON.stringify(args.modelValue) }}</p>
  `,
});

export const Default: Story = { render };

export const WithoutStepButtons: Story = { args: { useStepButtons: false }, render };

export const DecimalSteps: Story = {
  args: { label: "Weight (kg)", modelValue: 0.2, min: 0, max: 2, step: 0.1 },
  render,
  parameters: {
    docs: { description: { story: "A fractional `step`: stepping up from 0.2 gives 0.3, not 0.30000000000000004, and phones show a decimal keypad." } },
  },
};

export const NegativeRange: Story = {
  args: { label: "Temperature offset", modelValue: 0, min: -10, max: 10 },
  render,
  parameters: { docs: { description: { story: "A negative `min`: the input accepts a typed minus sign." } } },
};

export const WithError: Story = {
  args: { fieldHasError: true, errorMessage: "Please choose between 0 and 10", modelValue: 12 },
  render,
};

export const LocalisedLabels: Story = { args: { stepDownText: "Diminuer", stepUpText: "Augmenter" }, render };

export const Underlined: Story = { args: { inputVariant: "underlined" }, render };

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    modelValue: 123456789012,
    min: -999999999999,
    max: 999999999999999,
    step: 0.0001,
    label: "🔢 Gewünschteanzahlderteilnehmendenpersonen https://example.com/a/very/long/unbroken/url <b>not bold</b> عدد",
    descriptionText: "يرجى إدخال رقم Geben Sie eine Zahl zwischen minus einer Billion und einer Billiarde ein.",
    errorMessage: "DiesezahlliegtleideraußerhalbdeszulässigenBereichsbitteversuchenSieeserneut",
    fieldHasError: true,
    stepDownText: "Verringern 🔽",
    stepUpText: "Erhöhen 🔼",
  },
  render,
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "A 12-digit value, a min of minus a trillion, a 15-digit max and a 0.0001 step, with long unbroken German/URL/emoji/RTL/HTML-like copy. Check at every canvas width: the copy wraps inside the dashed outline, the input's width is capped (12em) so it fits a phone, the step buttons keep their size, and markup renders as text. Clear the field and press step-up (starts from 0), type 9999999999999999 and press step-down (clamps to max), and set `step` to 0.",
      },
    },
  },
};
