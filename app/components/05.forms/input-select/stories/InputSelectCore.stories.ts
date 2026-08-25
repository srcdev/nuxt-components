import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref } from "vue";
import StorybookComponent from "../InputSelectCore.vue";
import type { IFormMultipleOptions } from "~/types/forms/types.forms.d";

interface InputSelectCoreStoryArgs {
  id: string;
  name: string;
  placeholder: string;
  required: boolean;
  fieldHasError: boolean;
  inputVariant: "normal" | "outlined" | "underlined";
}

export default {
  title: "Components/Forms/Input Select/InputSelectCore",
  component: StorybookComponent,
  argTypes: {
    id: { control: "text", table: { category: "Basic" } },
    name: { control: "text", table: { category: "Basic" } },
    placeholder: { control: "text", table: { category: "Basic" } },
    required: { control: "boolean", table: { category: "Basic" } },
    fieldHasError: { control: "boolean", table: { category: "States" } },
    inputVariant: {
      control: { type: "select" },
      options: ["normal", "outlined", "underlined"],
      table: { category: "Styling" },
    },
  },
  args: {
    id: "select-default",
    name: "selectDefault",
    placeholder: "Choose a service",
    required: false,
    fieldHasError: false,
    inputVariant: "normal",
  },
} as Meta<InputSelectCoreStoryArgs>;

const Template: StoryFn<InputSelectCoreStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const modelValue = ref<string | number>("");
    const fieldData = ref<IFormMultipleOptions>({
      data: [
        { id: "1", name: "balayage", value: "balayage", label: "Balayage" },
        { id: "2", name: "highlights", value: "highlights", label: "Highlights" },
        { id: "3", name: "full-colour", value: "full-colour", label: "Full Colour" },
      ],
      total: 3,
      skip: 0,
      limit: 10,
    });
    return { args, modelValue, fieldData };
  },
  template: `
    <div style="margin: 36px; max-width: 320px;">
      <StorybookComponent v-bind="args" v-model="modelValue" v-model:field-data="fieldData" />
    </div>
  `,
});

export const Default = Template.bind({});

export const ErrorState = Template.bind({});
ErrorState.args = { fieldHasError: true };

export const Underlined = Template.bind({});
Underlined.args = { inputVariant: "underlined" };
