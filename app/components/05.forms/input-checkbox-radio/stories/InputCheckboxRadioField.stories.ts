import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import InputCheckboxRadioField from "../InputCheckboxRadioField.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms.d";
import type { MediaCanvas } from "~/types/components";

interface StoryArgs {
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

// Links in the canvas open in the Storybook manager (target="_top"), not inside the preview iframe.
const storyNoteStyle = "margin: 0 0 1.6rem; font-size: 1.4rem;";
const parentNote = `
  <p style="${storyNoteStyle}">
    Wrapped in a fieldset with a legend, description and error message, this is the
    <a href="/?path=/story/components-forms-input-checkbox-singlecheckbox--default" target="_top">SingleCheckbox</a>;
    a data-driven group of them is
    <a href="/?path=/story/components-forms-input-checkbox-multiplecheckboxes--default" target="_top">MultipleCheckboxes</a>
    or
    <a href="/?path=/story/components-forms-input-radio-multipleradiobuttons--default" target="_top">MultipleRadiobuttons</a>.
  </p>
`;

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Input Checkbox Radio/InputCheckboxRadioField",
  component: InputCheckboxRadioField,
  argTypes: {
    type: { control: { type: "select" }, options: ["checkbox", "radio"], table: { category: "Basic" } },
    name: { control: "text", table: { category: "Basic" } },
    label: { control: "text", table: { category: "Basic" } },
    required: { control: "boolean", table: { category: "Basic" } },
    useLabelSlot: {
      control: "boolean",
      description: "Story-only: use the labelContent slot (rich label with a link) instead of the label prop",
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
      description:
        "**Story control, not a prop.** Sets `--input-checkbox-label-color` on the story wrapper. In your CSS: `.my-form { --input-checkbox-label-color: #333; }`",
      table: { category: "CSS tokens (story only, set in your CSS)" },
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
  decorators: [
    (story, context) => ({
      components: { story, CanvasSwitcher },
      setup() {
        const canvasName = ref<MediaCanvas>(context.parameters.initialCanvas ?? "fullWidthCanvas");
        return { canvasName };
      },
      template: `
        <div style="padding: 1.2rem 1.6rem; border-block-end: 1px solid currentColor;">
          <CanvasSwitcher v-model:canvas-name="canvasName" />
        </div>
        <div :class="canvasName" style="margin-inline: auto; padding: 2rem; outline: 1px dashed currentColor;">
          <story />
        </div>
      `,
    }),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A `<label>` holding the checkbox or radio control and its text, so the whole row is clickable. It generates its own id with `useId()`. Props: `type`, `name`, `label`, `trueValue`/`falseValue`, `multipleOptions` (array model for a checkbox group), `required`, `fieldHasError`. Slots: `labelContent` (rich label), `checkedIcon`. Usually used through `SingleCheckbox`, `MultipleCheckboxes` or `MultipleRadiobuttons`: see the [SingleCheckbox](?path=/story/components-forms-input-checkbox-singlecheckbox--default) story.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const render = (args: StoryArgs) => ({
  components: { InputCheckboxRadioField },
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
    <div :style="tokenStyles">
      ${parentNote}
      <InputCheckboxRadioField v-bind="componentArgs" v-model="modelValue">
        <template v-if="args.useLabelSlot" #labelContent>
          I agree to the&nbsp;<a href="#terms">terms and conditions</a>
        </template>
      </InputCheckboxRadioField>
      <p style="margin-top: 2rem; font-family: monospace;">modelValue: {{ JSON.stringify(modelValue) }}</p>
    </div>
  `,
});

export const Checkbox: Story = { render };

export const RichLabel: Story = {
  args: { useLabelSlot: true },
  render,
  parameters: { docs: { description: { story: "The `labelContent` slot replaces the `label` prop, here with a link." } } },
};

export const Underlined: Story = {
  args: { inputVariant: "underlined" },
  render,
  parameters: { docs: { description: { story: "`inputVariant=\"underlined\"` squares off the checkbox." } } },
};

export const ErrorState: Story = {
  args: { fieldHasError: true, theme: "error" },
  render,
  parameters: { docs: { description: { story: "`fieldHasError` sets `data-invalid` on the label and `aria-invalid` on the input." } } },
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    label:
      "💇‍♀️ Datenschutzgrundverordnungseinwilligungsbestätigungserklärung https://example.com/privacy/policy/with/a/very/long/unbroken/path <b>not bold</b> قص الشعر",
  },
  render,
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "A label with emoji at the start, a long unbroken German word and URL, HTML-like text and right-to-left text. Check at every canvas width: the label wraps inside the dashed outline, the control keeps its size instead of being squashed, markup renders as text, and clicking anywhere on the label toggles the control. Also try an empty label and a single character, and switch `type` to `radio`.",
      },
    },
  },
};
