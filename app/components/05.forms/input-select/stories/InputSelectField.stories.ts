import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import InputSelectField from "../InputSelectField.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { FormUiTheme, InputUiVariant, IFormMultipleOptions, IOptionsConfig } from "~/types/forms/types.forms.d";
import type { MediaCanvas } from "~/types/components";

interface StoryArgs {
  modelValue: string | number;
  name: string;
  label: string;
  placeholder: string;
  title: string;
  errorMessage: string;
  fieldHasError: boolean;
  required: boolean;
  theme: FormUiTheme;
  inputVariant: InputUiVariant;
  styleClassPassthrough: string[];
  descriptionText: string;
  options: IOptionsConfig[];
}

const colourOptions: IOptionsConfig[] = [
  { id: "1", name: "red", value: "red", label: "Red" },
  { id: "2", name: "blue", value: "blue", label: "Blue" },
  { id: "3", name: "green", value: "green", label: "Green" },
];

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Input Select/InputSelectField",
  component: InputSelectField,
  argTypes: {
    modelValue: { control: "text", table: { category: "Model" } },
    name: { control: "text", table: { category: "Basic" } },
    label: { control: "text", table: { category: "Basic" } },
    placeholder: { control: "text", table: { category: "Basic" } },
    title: { control: "text", description: "Native tooltip; pass translated copy", table: { category: "Accessibility" } },
    errorMessage: { control: "text", table: { category: "Validation" } },
    fieldHasError: { control: "boolean", table: { category: "Validation" } },
    required: { control: "boolean", table: { category: "Validation" } },
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
    styleClassPassthrough: { control: "object", table: { category: "Styling" } },
    descriptionText: {
      control: "text",
      description: "Story-only: fills the descriptionText slot",
      table: { category: "Slots" },
    },
    options: {
      control: "object",
      description: "Story-only: the `data` array of `v-model:field-data`",
      table: { category: "Model" },
    },
  },
  args: {
    modelValue: "",
    name: "colour",
    label: "Favourite colour",
    placeholder: "Choose a colour",
    title: "Please select an option",
    errorMessage: "",
    fieldHasError: false,
    required: false,
    theme: "default",
    inputVariant: "normal",
    styleClassPassthrough: [],
    descriptionText: "",
    options: colourOptions,
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
          "Labelled select field: `InputLabel`, an optional description (`descriptionText`/`descriptionHtml` slots, moved after the control for the `outlined` variant), `InputSelect` and an error strip linked through `aria-describedby`. `field-has-error` switches the control to the `error` theme. `style-class-passthrough` lands on the `.input-select-field` root only.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const render = (args: StoryArgs) => ({
  components: { InputSelectField },
  setup() {
    const fieldData = computed<IFormMultipleOptions>(() => ({
      data: args.options,
      total: args.options.length,
      skip: 0,
      limit: args.options.length,
    }));
    const componentArgs = computed(() => {
      const { modelValue: _modelValue, descriptionText: _descriptionText, options: _options, ...rest } = args;
      return rest;
    });
    return { args, componentArgs, fieldData };
  },
  template: `
    <InputSelectField v-model="args.modelValue" :field-data="fieldData" v-bind="componentArgs">
      <template v-if="args.descriptionText" #descriptionText>{{ args.descriptionText }}</template>
    </InputSelectField>
    <p style="margin-block-start: 1.6rem; font-family: monospace;">modelValue: {{ JSON.stringify(args.modelValue) }}</p>
  `,
});

export const Default: Story = { render };

export const WithError: Story = {
  args: { fieldHasError: true, errorMessage: "Please choose a colour" },
  render,
};

export const Required: Story = { args: { required: true }, render };

export const WithDescription: Story = { args: { descriptionText: "Pick the colour you like best" }, render };

export const Underlined: Story = { args: { inputVariant: "underlined" }, render };

export const Outlined: Story = {
  args: { inputVariant: "outlined", descriptionText: "Pick the colour you like best" },
  render,
  parameters: { docs: { description: { story: "The `outlined` variant renders the description after the control and error." } } },
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    modelValue: "long",
    label:
      "🎨 Bevorzugtefarbefürdiegesamtegestaltungderbenutzeroberfläche https://example.com/a/very/long/unbroken/url <b>not bold</b> اللون",
    descriptionText: "يرجى اختيار لون Wählen Sie bitte die Farbe, die Ihnen für die Oberfläche am besten gefällt.",
    placeholder: "Bitte wählen Sie eine Farbe aus der folgenden sehr langen Liste aus",
    errorMessage: "DieausgewähltefarbeistleidernichtverfügbarbitteversuchenSieeserneut",
    fieldHasError: true,
    required: true,
    options: [
      { id: "0", name: "zero", value: "0", label: "0" },
      { id: "1", name: "long", value: "long", label: "Dunkelblaugrüngrauschimmerndemitternachtsfarbemitmetallischemglanz" },
      { id: "2", name: "html", value: "html", label: "<i>italic?</i>" },
      { id: "3", name: "rtl", value: "rtl", label: "أزرق" },
      ...Array.from({ length: 20 }, (_, index) => ({
        id: `n${index}`,
        name: `n${index}`,
        value: `n${index}`,
        label: `Colour ${index + 1}`,
      })),
    ],
  },
  render,
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      story: { inline: false, height: "520px" },
      description: {
        story:
          "Long unbroken German, URL, emoji, HTML-like and right-to-left copy in the label, description, placeholder, error and options, with a long unbroken label selected. Check at every canvas width: the label, description and error wrap inside the dashed outline, the select never pushes past it, and markup renders as text.",
      },
    },
  },
};
