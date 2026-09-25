import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref } from "vue";
import StorybookComponent from "../MultipleCheckboxes.vue";
import type { IFormMultipleOptions, InputUiVariant, OptionsLayout } from "~/types/forms/types.forms.d";

interface MultipleCheckboxesStoryArgs {
  name: string;
  legend: string;
  errorMessage: string;
  required: boolean;
  fieldHasError: boolean;
  isButton: boolean;
  isPill: boolean;
  optionsLayout: OptionsLayout;
  direction: "row" | "row-reverse";
  displayAsDisc: boolean;
  inputVariant: InputUiVariant;
}

export default {
  title: "Components/Forms/Input Checkbox/MultipleCheckboxes",
  component: StorybookComponent,
  argTypes: {
    name: { control: "text", table: { category: "Basic" } },
    legend: { control: "text", table: { category: "Basic" } },
    errorMessage: { control: "text", table: { category: "Basic" } },
    required: { control: "boolean", table: { category: "Basic" } },
    fieldHasError: { control: "boolean", table: { category: "States" } },
    isButton: { control: "boolean", table: { category: "Styling" } },
    isPill: { control: "boolean", description: "Only with isButton", table: { category: "Styling" } },
    optionsLayout: {
      control: { type: "select" },
      options: ["equal-widths", "inline", "block"],
      table: { category: "Styling" },
    },
    direction: {
      control: { type: "select" },
      options: ["row", "row-reverse"],
      description: "Only with isButton",
      table: { category: "Styling" },
    },
    displayAsDisc: { control: "boolean", table: { category: "Styling" } },
    inputVariant: {
      control: { type: "select" },
      options: ["normal", "outlined", "underlined"],
      table: { category: "Styling" },
    },
  },
  args: {
    name: "services",
    legend: "Services of interest",
    errorMessage: "Choose at least one service",
    required: false,
    fieldHasError: false,
    isButton: false,
    isPill: false,
    optionsLayout: "equal-widths",
    direction: "row",
    displayAsDisc: false,
    inputVariant: "normal",
  },
} as Meta<MultipleCheckboxesStoryArgs>;

const Template: StoryFn<MultipleCheckboxesStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const modelValue = ref<string[]>([]);
    const fieldData = ref<IFormMultipleOptions>({
      data: [
        { id: "1", name: "services", value: "cut", label: "Cut" },
        { id: "2", name: "services", value: "colour", label: "Colour" },
        { id: "3", name: "services", value: "balayage", label: "Balayage" },
        { id: "4", name: "services", value: "styling", label: "Styling" },
        { id: "5", name: "services", value: "treatment", label: "Conditioning treatment" },
      ],
      total: 5,
      skip: 0,
      limit: 10,
    });
    return { args, modelValue, fieldData };
  },
  template: `
    <div style="margin: 36px; max-width: 560px;">
      <StorybookComponent v-bind="args" v-model="modelValue" v-model:field-data="fieldData">
        <template #descriptionText>Select all that apply.</template>
      </StorybookComponent>
      <p style="margin-top: 2rem; font-family: monospace;">modelValue: {{ JSON.stringify(modelValue) }}</p>
    </div>
  `,
});

export const Default = Template.bind({});

export const Buttons = Template.bind({});
Buttons.args = { isButton: true, optionsLayout: "inline" };

export const Pills = Template.bind({});
Pills.args = { isButton: true, isPill: true, optionsLayout: "inline" };

export const Block = Template.bind({});
Block.args = { optionsLayout: "block" };

export const ErrorState = Template.bind({});
ErrorState.args = { fieldHasError: true };
