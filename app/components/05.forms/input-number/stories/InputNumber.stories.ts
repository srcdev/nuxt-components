import { ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import InputNumber from "../InputNumber.vue";
import InputButton from "../../input-button/InputButton.vue";
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms.d";

interface StoryArgs {
  id: string;
  name: string;
  min: number;
  max: number;
  step: number;
  placeholder: string;
  required: boolean;
  fieldHasError: boolean;
  theme: FormUiTheme;
  weight: string;
  inputVariant: InputUiVariant;
}

// Links in the canvas open in the Storybook manager (target="_top"), not inside the preview iframe.
const storyNoteStyle = "margin: 0 0 1.6rem; font-size: 1.4rem;";
const parentNote = `
  <p style="${storyNoteStyle}">
    With a label, description, error message and clamped step buttons wired up, this is the
    <a href="/?path=/story/components-forms-input-number-inputnumberfield--with-step-buttons" target="_top">InputNumberField</a>.
  </p>
`;

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Input Number/InputNumber",
  component: InputNumber,
  argTypes: {
    id: { control: "text", table: { category: "Basic" } },
    name: { control: "text", table: { category: "Basic" } },
    min: { control: "number", table: { category: "Basic" } },
    max: { control: "number", table: { category: "Basic" } },
    step: { control: "number", table: { category: "Basic" } },
    placeholder: { control: "text", table: { category: "Basic" } },
    required: { control: "boolean", table: { category: "Basic" } },
    fieldHasError: { control: "boolean", table: { category: "States" } },
    theme: {
      control: { type: "select" },
      options: ["default", "success", "error", "warning"],
      table: { category: "Styling" },
    },
    weight: { control: "text", description: "Adds an `input-number--{weight}` class; nothing styles it yet", table: { category: "Styling" } },
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
    theme: "default",
    weight: "normal",
    inputVariant: "normal",
  },
  parameters: {
    docs: {
      description: {
        component:
          "The bare native `<input type=\"number\">` with `left`/`right` slots for embedded step buttons. No label, description or error: that's `InputNumberField`. `inputmode` follows `min` and `step` (`numeric`, `decimal`, or none when negatives are allowed). Hooks: `data-input-variant`, `data-theme`, `data-invalid`, `data-has-left-slot`, `data-has-right-slot`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const render = (args: StoryArgs) => ({
  components: { InputNumber },
  setup() {
    const modelValue = ref(50);
    return { args, modelValue };
  },
  template: `
    <div style="margin: 36px; max-width: 320px;">
      ${parentNote}
      <InputNumber v-bind="args" v-model="modelValue" />
    </div>
  `,
});

const renderWithSlots = (args: StoryArgs) => ({
  components: { InputNumber, InputButton },
  setup() {
    const modelValue = ref(50);
    return { args, modelValue };
  },
  template: `
    <div style="margin: 36px; max-width: 320px;">
      ${parentNote}
      <InputNumber v-bind="args" v-model="modelValue">
        <template #left>
          <InputButton type="button" button-text="Step down" variant="inline" @click="modelValue = Math.max(args.min, modelValue - args.step)">
            <template #iconOnly><Icon name="mdi:minus" /></template>
          </InputButton>
        </template>
        <template #right>
          <InputButton type="button" button-text="Step up" variant="inline" @click="modelValue = Math.min(args.max, modelValue + args.step)">
            <template #iconOnly><Icon name="mdi:plus" /></template>
          </InputButton>
        </template>
      </InputNumber>
    </div>
  `,
});

export const Default: Story = { render };

export const ErrorState: Story = {
  args: { fieldHasError: true },
  render,
  parameters: { docs: { description: { story: "`fieldHasError` sets `data-invalid` on the wrapper." } } },
};

export const WithStepButtons: Story = {
  render: renderWithSlots,
  parameters: {
    docs: {
      description: {
        story:
          "Inline `InputButton`s in the `left`/`right` slots become flush segments of the control. The wiring here is deliberately minimal; `InputNumberField` does it properly (clamping, rounding, empty field).",
      },
    },
  },
};

export const Underlined: Story = {
  args: { inputVariant: "underlined" },
  render: renderWithSlots,
  parameters: { docs: { description: { story: "`inputVariant=\"underlined\"` keeps only a bottom border." } } },
};
