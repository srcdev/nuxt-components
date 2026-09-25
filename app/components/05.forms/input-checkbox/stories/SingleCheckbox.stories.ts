import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref } from "vue";
import StorybookComponent from "../SingleCheckbox.vue";
import type { InputUiVariant } from "~/types/forms/types.forms.d";

interface SingleCheckboxStoryArgs {
  name: string;
  legend: string;
  label: string;
  errorMessage: string;
  required: boolean;
  fieldHasError: boolean;
  inputVariant: InputUiVariant;
}

export default {
  title: "Components/Forms/Input Checkbox/SingleCheckbox",
  component: StorybookComponent,
  argTypes: {
    name: { control: "text", table: { category: "Basic" } },
    legend: { control: "text", table: { category: "Basic" } },
    label: { control: "text", table: { category: "Basic" } },
    errorMessage: { control: "text", table: { category: "Basic" } },
    required: { control: "boolean", table: { category: "Basic" } },
    fieldHasError: { control: "boolean", table: { category: "States" } },
    inputVariant: {
      control: { type: "select" },
      options: ["normal", "outlined", "underlined"],
      table: { category: "Styling" },
    },
  },
  args: {
    name: "terms",
    legend: "Terms and conditions",
    label: "I agree to the terms",
    errorMessage: "You must agree to the terms",
    required: true,
    fieldHasError: false,
    inputVariant: "normal",
  },
} as Meta<SingleCheckboxStoryArgs>;

const Template: StoryFn<SingleCheckboxStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const modelValue = ref(false);
    return { args, modelValue };
  },
  template: `
    <div style="margin: 36px; max-width: 480px;">
      <StorybookComponent v-bind="args" v-model="modelValue" />
      <p style="margin-top: 2rem; font-family: monospace;">modelValue: {{ modelValue }}</p>
    </div>
  `,
});

export const Default = Template.bind({});

export const ErrorState = Template.bind({});
ErrorState.args = { fieldHasError: true };

export const RichLabel: StoryFn<SingleCheckboxStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const modelValue = ref(false);
    return { args, modelValue };
  },
  template: `
    <div style="margin: 36px; max-width: 480px;">
      <StorybookComponent v-bind="args" v-model="modelValue">
        <template #labelContent>I agree to the <a href="#">terms and conditions</a></template>
      </StorybookComponent>
    </div>
  `,
});
