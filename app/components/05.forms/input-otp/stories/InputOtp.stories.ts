import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import InputOtp from "../InputOtp.vue";
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms.d";

interface StoryArgs {
  modelValue: string;
  id: string;
  name: string;
  length: number;
  autofocus: boolean;
  required: boolean;
  groupLabel: string;
  digitLabel: string;
  fieldHasError: boolean;
  theme: FormUiTheme;
  inputVariant: InputUiVariant;
}

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Input Otp/InputOtp",
  component: InputOtp,
  argTypes: {
    modelValue: { control: "text", table: { category: "Model" } },
    id: { control: "text", table: { category: "Basic" } },
    name: { control: "text", description: "Name of the hidden input holding the full code", table: { category: "Basic" } },
    length: { control: { type: "number", min: 1, max: 12 }, table: { category: "Basic" } },
    autofocus: { control: "boolean", description: "Focus the first box on mount (applies on remount)", table: { category: "Basic" } },
    required: { control: "boolean", table: { category: "Validation" } },
    fieldHasError: { control: "boolean", table: { category: "Validation" } },
    groupLabel: { control: "text", description: "Names the group when used without InputOtpField", table: { category: "Accessibility" } },
    digitLabel: { control: "text", description: "Per-box label; {index} and {length} are replaced", table: { category: "Accessibility" } },
    theme: {
      control: { type: "select" },
      options: ["default", "success", "error", "warning"],
      table: { category: "Styling" },
    },
    inputVariant: {
      control: { type: "select" },
      options: ["normal", "underlined"],
      table: { category: "Styling" },
    },
  },
  args: {
    modelValue: "",
    id: "otp",
    name: "code",
    length: 6,
    autofocus: false,
    required: false,
    groupLabel: "Verification code",
    digitLabel: "Digit {index} of {length}",
    fieldHasError: false,
    theme: "default",
    inputVariant: "normal",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Bare one-time-code control: a row of single-digit boxes. Most consumers want `InputOtpField`, which adds the legend, description and error.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const render = (args: StoryArgs) => ({
  components: { InputOtp },
  setup() {
    const componentArgs = computed(() => {
      const { modelValue: _modelValue, ...rest } = args;
      return rest;
    });
    const lastComplete = ref("");
    return { args, componentArgs, lastComplete };
  },
  template: `
    <div style="margin: 3.6rem;">
      <InputOtp v-model="args.modelValue" v-bind="componentArgs" @complete="lastComplete = $event" />
      <p style="margin-block-start: 1.6rem;">Model: "{{ args.modelValue }}" · last complete: "{{ lastComplete }}"</p>
    </div>
  `,
});

export const Default: Story = { render };

export const Prefilled: Story = {
  args: { modelValue: "012345" },
  render,
  parameters: { docs: { description: { story: "A leading zero is kept: the model is a string, never a number." } } },
};

export const FourDigits: Story = { args: { length: 4 }, render };

export const WithError: Story = { args: { fieldHasError: true, modelValue: "123" }, render };

export const Underlined: Story = { args: { inputVariant: "underlined" }, render };
