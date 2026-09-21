import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../InputRangeDefault.vue";
import type { FormUiTheme } from "~/types/forms/types.forms.d";

interface InputRangeDefaultStoryArgs {
  modelValue: number;
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  errorMessage: string;
  fieldHasError: boolean;
  required: boolean;
  theme: FormUiTheme;
  stepDownLabel: string;
  stepUpLabel: string;
  useStepButtons: boolean;
}

export default {
  title: "Components/Forms/Input Range/InputRangeDefault",
  component: StorybookComponent,
  argTypes: {
    modelValue: { control: "number", table: { category: "Model" } },
    name: { control: "text", table: { category: "Basic" } },
    label: { control: "text", table: { category: "Basic" } },
    min: { control: "number", table: { category: "Basic" } },
    max: { control: "number", table: { category: "Basic" } },
    step: { control: "number", table: { category: "Basic" } },
    errorMessage: { control: "text", table: { category: "Validation" } },
    fieldHasError: { control: "boolean", table: { category: "Validation" } },
    required: { control: "boolean", table: { category: "Validation" } },
    theme: {
      control: { type: "select" },
      options: ["default", "success", "error", "warning"],
      table: { category: "Styling" },
    },
    stepDownLabel: { control: "text", description: "Localisation override for the step-down button", table: { category: "Accessibility" } },
    stepUpLabel: { control: "text", description: "Localisation override for the step-up button", table: { category: "Accessibility" } },
    useStepButtons: { control: "boolean", description: "Render +/- step buttons via left/right slots", table: { category: "Slots" } },
  },
  args: {
    modelValue: 50,
    name: "priceRange",
    label: "Price range",
    min: 0,
    max: 100,
    step: 1,
    errorMessage: "",
    fieldHasError: false,
    required: false,
    theme: "default",
    stepDownLabel: "Step down",
    stepUpLabel: "Step up",
    useStepButtons: false,
  },
} as Meta<InputRangeDefaultStoryArgs>;

const Template: StoryFn<InputRangeDefaultStoryArgs> = (args) => ({
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
        :error-message="args.errorMessage"
        :field-has-error="args.fieldHasError"
        :required="args.required"
        :theme="args.theme"
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
  errorMessage: "Please choose a value within the allowed range",
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
