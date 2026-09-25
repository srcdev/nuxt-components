import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../InputNumberField.vue";
import type { FormUiTheme } from "~/types/forms/types.forms.d";

interface InputNumberFieldStoryArgs {
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
  inputVariant: string;
  stepDownLabel: string;
  stepUpLabel: string;
  useStepButtons: boolean;
}

export default {
  title: "Components/Forms/Input Number/InputNumberField",
  component: StorybookComponent,
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
    useStepButtons: { control: "boolean", description: "Render +/- step buttons via left/right slots", table: { category: "Slots" } },
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
  },
} as Meta<InputNumberFieldStoryArgs>;

const Template: StoryFn<InputNumberFieldStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="margin: 36px; max-width: 320px;">
      <StorybookComponent
        v-model="args.modelValue"
        :name="args.name"
        :label="args.label"
        :min="args.min"
        :max="args.max"
        :step="args.step"
        :placeholder="args.placeholder"
        :error-message="args.errorMessage"
        :field-has-error="args.fieldHasError"
        :required="args.required"
        :theme="args.theme"
        :input-variant="args.inputVariant"
        :step-down-label="args.stepDownLabel"
        :step-up-label="args.stepUpLabel"
      >
        <template v-if="args.useStepButtons" #left><span>−</span></template>
        <template v-if="args.useStepButtons" #right><span>+</span></template>
      </StorybookComponent>
    </div>
  `,
});

export const Default = Template.bind({});

export const WithStepButtons = Template.bind({});
WithStepButtons.args = { useStepButtons: true };

export const WithError = Template.bind({});
WithError.args = {
  fieldHasError: true,
  errorMessage: "Please enter a valid quantity",
  theme: "error",
};

export const Required = Template.bind({});
Required.args = { required: true };

export const LocalisedLabels = Template.bind({});
LocalisedLabels.args = {
  useStepButtons: true,
  stepDownLabel: "Diminuer",
  stepUpLabel: "Augmenter",
};

export const Underlined = Template.bind({});
Underlined.args = { inputVariant: "underlined", useStepButtons: true };
