import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { computed, ref } from "vue";
import StorybookComponent from "../InputCheckboxRadioField.vue";
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms.d";

interface InputCheckboxRadioFieldStoryArgs {
  type: "checkbox" | "radio";
  name: string;
  label: string;
  required: boolean;
  theme: FormUiTheme;
  fieldHasError: boolean;
  inputVariant: InputUiVariant;
  labelColor: string;
  useLabelSlot: boolean;
}

export default {
  title: "Components/Forms/Input Checkbox Radio/InputCheckboxRadioField",
  component: StorybookComponent,
  argTypes: {
    type: { control: { type: "select" }, options: ["checkbox", "radio"], table: { category: "Basic" } },
    name: { control: "text", table: { category: "Basic" } },
    label: { control: "text", table: { category: "Basic" } },
    required: { control: "boolean", table: { category: "Basic" } },
    useLabelSlot: {
      control: "boolean",
      description: "Use the labelContent slot (rich label with a link) instead of the label prop",
      table: { category: "Slots" },
    },
    fieldHasError: { control: "boolean", description: "Rendered as data-invalid", table: { category: "States" } },
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
    labelColor: {
      control: "color",
      description: "Sets --input-checkbox-label-color on the story wrapper",
      table: { category: "Tokens" },
    },
  },
  args: {
    type: "checkbox",
    name: "terms",
    label: "I agree to the terms and conditions",
    required: false,
    theme: "default",
    fieldHasError: false,
    inputVariant: "normal",
    labelColor: "",
    useLabelSlot: false,
  },
} as Meta<InputCheckboxRadioFieldStoryArgs>;

const Template: StoryFn<InputCheckboxRadioFieldStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const modelValue = ref<boolean | string>(false);
    const componentArgs = computed(() => {
      const { labelColor: _labelColor, useLabelSlot: _useLabelSlot, ...rest } = args;
      return rest;
    });
    const tokenStyles = computed(() => (args.labelColor ? { "--input-checkbox-label-color": args.labelColor } : {}));
    return { args, componentArgs, tokenStyles, modelValue };
  },
  template: `
    <div style="margin: 36px; max-width: 480px;" :style="tokenStyles">
      <StorybookComponent v-bind="componentArgs" v-model="modelValue">
        <template v-if="args.useLabelSlot" #labelContent>
          I agree to the&nbsp;<a href="#terms">terms and conditions</a>
        </template>
      </StorybookComponent>
      <p style="margin-top: 2rem; font-family: monospace;">modelValue: {{ JSON.stringify(modelValue) }}</p>
    </div>
  `,
});

export const Checkbox = Template.bind({});

export const RichLabel = Template.bind({});
RichLabel.args = { useLabelSlot: true };

export const Underlined = Template.bind({});
Underlined.args = { inputVariant: "underlined" };

export const ErrorState = Template.bind({});
ErrorState.args = { fieldHasError: true, theme: "error" };
