import { ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import InputCheckboxRadio from "../InputCheckboxRadio.vue";
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms.d";

interface StoryArgs {
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

// Links in the canvas open in the Storybook manager (target="_top"), not inside the preview iframe.
const storyNoteStyle = "margin: 0 0 1.6rem; font-size: 1.4rem;";
const parentNote = `
  <p style="${storyNoteStyle}">
    This is the bare control with no label. With a text label it's the
    <a href="/?path=/story/components-forms-input-checkbox-radio-inputcheckboxradiofield--checkbox" target="_top">InputCheckboxRadioField</a>;
    drawn as a button or pill it's the
    <a href="/?path=/story/components-forms-input-checkbox-radio-inputcheckboxradiobutton--option-group" target="_top">InputCheckboxRadioButton</a>.
  </p>
`;

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Input Checkbox Radio/InputCheckboxRadio",
  component: InputCheckboxRadio,
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
  parameters: {
    docs: {
      description: {
        component:
          "The checkbox or radio control every form checkbox and radio is built from: a styled square or circle stacked over a hidden native input. It has no label, so pair its `id` with your own `label[for]`, or use `InputCheckboxRadioField` / `InputCheckboxRadioButton`. Slot: `checkedIcon`. No stress story here: the control renders no text, and long-label behaviour is covered by the Field and Button stress stories.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const render = (args: StoryArgs) => ({
  components: { InputCheckboxRadio },
  setup() {
    const modelValue = ref(false);
    return { args, modelValue };
  },
  template: `
    <div style="margin: 36px;">
      ${parentNote}
      <InputCheckboxRadio v-bind="args" v-model="modelValue" />
    </div>
  `,
});

export const Checkbox: Story = { args: { type: "checkbox" }, render };

export const Radio: Story = { args: { type: "radio" }, render };

export const CheckboxAsDisc: Story = {
  args: { type: "checkbox", isButton: true, displayAsDisc: true },
  render,
  parameters: { docs: { description: { story: "`displayAsDisc` rounds a checkbox, but only in button mode (`isButton`)." } } },
};

export const ErrorState: Story = {
  args: { type: "checkbox", fieldHasError: true, theme: "error" },
  render,
  parameters: { docs: { description: { story: "`fieldHasError` sets `aria-invalid` on the input and `data-invalid` on the root." } } },
};
