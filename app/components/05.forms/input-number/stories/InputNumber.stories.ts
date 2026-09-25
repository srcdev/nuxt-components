import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref } from "vue";
import StorybookComponent from "../InputNumber.vue";

interface InputNumberStoryArgs {
  id: string;
  name: string;
  min: number;
  max: number;
  step: number;
  placeholder: string;
  required: boolean;
  fieldHasError: boolean;
  weight: string;
  inputVariant: string;
}

export default {
  title: "Components/Forms/Input Number/InputNumber",
  component: StorybookComponent,
  argTypes: {
    id: { control: "text", table: { category: "Basic" } },
    name: { control: "text", table: { category: "Basic" } },
    min: { control: "number", table: { category: "Basic" } },
    max: { control: "number", table: { category: "Basic" } },
    step: { control: "number", table: { category: "Basic" } },
    placeholder: { control: "text", table: { category: "Basic" } },
    required: { control: "boolean", table: { category: "Basic" } },
    fieldHasError: { control: "boolean", table: { category: "States" } },
    weight: { control: "text", table: { category: "Styling" } },
    inputVariant: {
      control: { type: "select" },
      options: ["normal", "outlined", "underlined"],
      table: { category: "Styling" },
    },
  },
  args: {
    id: "number-default",
    name: "numberDefault",
    min: 0,
    max: 100,
    step: 1,
    placeholder: "",
    required: false,
    fieldHasError: false,
    weight: "normal",
    inputVariant: "normal",
  },
} as Meta<InputNumberStoryArgs>;

const Template: StoryFn<InputNumberStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const modelValue = ref(50);
    return { args, modelValue };
  },
  template: `
    <div style="margin: 36px; max-width: 320px;">
      <StorybookComponent v-bind="args" v-model="modelValue" />
    </div>
  `,
});

export const Default = Template.bind({});

export const ErrorState = Template.bind({});
ErrorState.args = { fieldHasError: true };

const WithStepButtonsTemplate: StoryFn<InputNumberStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const modelValue = ref(50);
    return { args, modelValue };
  },
  template: `
    <div style="margin: 36px; max-width: 320px;">
      <StorybookComponent v-bind="args" v-model="modelValue">
        <template #left>
          <button type="button" @click="modelValue = Math.max(args.min, modelValue - args.step)">−</button>
        </template>
        <template #right>
          <button type="button" @click="modelValue = Math.min(args.max, modelValue + args.step)">+</button>
        </template>
      </StorybookComponent>
    </div>
  `,
});

export const WithStepButtons = WithStepButtonsTemplate.bind({});

export const Underlined = WithStepButtonsTemplate.bind({});
Underlined.args = { inputVariant: "underlined" };
