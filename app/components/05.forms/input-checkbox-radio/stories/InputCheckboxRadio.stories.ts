import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref } from "vue";
import StorybookComponent from "../InputCheckboxRadio.vue";
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms.d";

interface InputCheckboxRadioStoryArgs {
  type: "checkbox" | "radio";
  id: string;
  name: string;
  required: boolean;
  theme: FormUiTheme;
  fieldHasError: boolean;
  displayAsDisc: boolean;
  isButton: boolean;
  inputVariant: InputUiVariant;
}

export default {
  title: "Components/Forms/Input Checkbox Radio/InputCheckboxRadio",
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
      description: "Checkbox in button mode only: round the box into a disc",
      table: { category: "Styling" },
    },
    isButton: {
      control: "boolean",
      description: "Set by InputCheckboxRadioButton: drops the focus outline (the button draws its own) and enables displayAsDisc",
      table: { category: "Styling" },
    },
    inputVariant: {
      control: { type: "select" },
      options: ["normal", "outlined", "underlined"],
      description: "underlined squares off a checkbox",
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
    isButton: false,
    inputVariant: "normal",
  },
} as Meta<InputCheckboxRadioStoryArgs>;

const Template: StoryFn<InputCheckboxRadioStoryArgs> = (args) => ({
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
CheckboxAsDisc.args = { type: "checkbox", isButton: true, displayAsDisc: true };

export const ErrorState = Template.bind({});
ErrorState.args = { type: "checkbox", fieldHasError: true, theme: "error" };
