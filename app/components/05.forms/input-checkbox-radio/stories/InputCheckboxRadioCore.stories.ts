import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref } from "vue";
import StorybookComponent from "../InputCheckboxRadioCore.vue";
import type { FormUiTheme } from "~/types/forms/types.forms.d";

interface InputCheckboxRadioCoreStoryArgs {
  type: "checkbox" | "radio";
  id: string;
  name: string;
  required: boolean;
  theme: FormUiTheme;
  fieldHasError: boolean;
  displayAsDisc: boolean;
}

export default {
  title: "Components/Forms/Input Checkbox Radio/InputCheckboxRadioCore",
  component: StorybookComponent,
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["checkbox", "radio"],
      description: "Control type",
      table: { category: "Basic" },
    },
    id: { control: "text", table: { category: "Basic" } },
    name: { control: "text", table: { category: "Basic" } },
    required: { control: "boolean", table: { category: "Basic" } },
    theme: {
      control: { type: "select" },
      options: ["default", "success", "error", "warning"],
      table: { category: "Styling" },
    },
    fieldHasError: { control: "boolean", table: { category: "States" } },
    displayAsDisc: {
      control: "boolean",
      description: "Checkbox only — render as a filled disc instead of a check icon",
      table: { category: "Styling" },
    },
  },
  args: {
    type: "checkbox",
    id: "core-checkbox",
    name: "coreCheckbox",
    required: false,
    theme: "default",
    fieldHasError: false,
    displayAsDisc: false,
  },
} as Meta<InputCheckboxRadioCoreStoryArgs>;

const Template: StoryFn<InputCheckboxRadioCoreStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const modelValue = ref(false);
    return { args, modelValue };
  },
  template: `
    <div style="margin: 36px;">
      <StorybookComponent v-bind="args" v-model="modelValue" />
    </div>
  `,
});

export const Checkbox = Template.bind({});
Checkbox.args = { type: "checkbox" };

export const Radio = Template.bind({});
Radio.args = { type: "radio" };

export const CheckboxAsDisc = Template.bind({});
CheckboxAsDisc.args = { type: "checkbox", displayAsDisc: true };

export const ErrorState = Template.bind({});
ErrorState.args = { type: "checkbox", fieldHasError: true, theme: "error" };
