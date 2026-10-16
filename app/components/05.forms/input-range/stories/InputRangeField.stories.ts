import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import InputRangeField from "../InputRangeField.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { FormUiTheme } from "~/types/forms/types.forms.d";
import type { MediaCanvas } from "~/types/components";

interface StoryArgs {
  modelValue: number;
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  errorMessage: string;
  fieldHasError: boolean;
  required: boolean;
  theme: FormUiTheme;
  stepDownLabel: string;
  stepUpLabel: string;
  useStepButtons: boolean;
  descriptionText: string;
  datalistOptions: string[];
}

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Input Range/InputRangeField",
  component: InputRangeField,
  argTypes: {
    modelValue: { control: "number", table: { category: "Model" } },
    name: { control: "text", table: { category: "Basic" } },
    label: { control: "text", table: { category: "Basic" } },
    min: { control: "number", table: { category: "Basic" } },
    max: { control: "number", table: { category: "Basic" } },
    step: { control: "number", table: { category: "Basic" } },
    errorMessage: { control: "text", table: { category: "Validation" } },
    fieldHasError: { control: "boolean", table: { category: "Validation" } },
    required: { control: "boolean", table: { category: "Validation" } },
    theme: {
      control: { type: "select" },
      options: ["default", "success", "error", "warning"],
      table: { category: "Styling" },
    },
    stepDownLabel: { control: "text", description: "Localisation override for the step-down button", table: { category: "Accessibility" } },
    stepUpLabel: { control: "text", description: "Localisation override for the step-up button", table: { category: "Accessibility" } },
    useStepButtons: {
      control: "boolean",
      description: "Story-only: render the +/- step buttons by filling the left/right slots",
      table: { category: "Slots" },
    },
    descriptionText: { control: "text", description: "Story-only: fills the descriptionText slot", table: { category: "Slots" } },
    datalistOptions: {
      control: "object",
      description: "Story-only: option labels for a datalist spread evenly from min to max (empty for none)",
      table: { category: "Slots" },
    },
  },
  args: {
    modelValue: 50,
    name: "priceRange",
    label: "Price range",
    min: 0,
    max: 100,
    step: 1,
    errorMessage: "",
    fieldHasError: false,
    required: false,
    theme: "default",
    stepDownLabel: "Step down",
    stepUpLabel: "Step up",
    useStepButtons: false,
    descriptionText: "",
    datalistOptions: [],
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
          "Labelled range slider: `InputLabel`, an optional description, `InputRange` and an error strip. Filling the `left`/`right` slots with an icon adds step buttons: they step by `step`, round away floating-point drift and clamp to `min`/`max`. `markers` and `datalist` are forwarded to `InputRange` (the datalist slot passes its generated `datalistId` through). `stepDownLabel`/`stepUpLabel` localise the buttons' accessible names.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const render = (args: StoryArgs) => ({
  components: { InputRangeField },
  setup() {
    const componentArgs = computed(() => {
      const {
        modelValue: _modelValue,
        useStepButtons: _useStepButtons,
        descriptionText: _descriptionText,
        datalistOptions: _datalistOptions,
        ...rest
      } = args;
      return rest;
    });
    const datalist = computed(() => {
      const count = args.datalistOptions.length;
      return args.datalistOptions.map((label, index) => ({
        label,
        value: count > 1 ? args.min + ((args.max - args.min) * index) / (count - 1) : args.min,
      }));
    });
    return { args, componentArgs, datalist };
  },
  template: `
    <InputRangeField v-model="args.modelValue" v-bind="componentArgs">
      <template v-if="args.descriptionText" #descriptionText>{{ args.descriptionText }}</template>
      <template v-if="args.useStepButtons" #left><Icon name="mdi:minus" /></template>
      <template v-if="args.useStepButtons" #right><Icon name="mdi:plus" /></template>
      <template v-if="datalist.length" #datalist="{ datalistId }">
        <datalist :id="datalistId" class="input-range-datalist">
          <option v-for="option in datalist" :key="option.value" :value="option.value" :label="option.label"></option>
        </datalist>
      </template>
    </InputRangeField>
    <p style="margin-block-start: 1.6rem; font-family: monospace;">modelValue: {{ JSON.stringify(args.modelValue) }}</p>
  `,
});

export const Default: Story = { render };

export const WithStepButtons: Story = {
  args: { useStepButtons: true },
  render,
  parameters: { docs: { description: { story: "Step buttons from the `left`/`right` slots. Step-down goes read-only at `min`, step-up at `max`." } } },
};

export const DecimalSteps: Story = {
  args: { useStepButtons: true, label: "Opacity", modelValue: 0.2, min: 0, max: 1, step: 0.1 },
  render,
  parameters: { docs: { description: { story: "A fractional `step`: stepping up from 0.2 gives 0.3, not 0.30000000000000004." } } },
};

export const WithError: Story = {
  args: { fieldHasError: true, errorMessage: "Please choose a value within the allowed range", theme: "error" },
  render,
};

export const Required: Story = { args: { required: true }, render };

export const LocalisedLabels: Story = {
  args: { useStepButtons: true, stepDownLabel: "Diminuer", stepUpLabel: "Augmenter" },
  render,
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    useStepButtons: true,
    modelValue: 123456789,
    min: -999999999999,
    max: 999999999999,
    step: 0.0001,
    label:
      "🎚️ Maximalerpreisbereichfürdiegewünschtebehandlunginklusivezusatzleistungen https://example.com/a/very/long/unbroken/url <b>not bold</b> نطاق",
    descriptionText: "يرجى اختيار نطاق Ziehen Sie den Regler, um den gewünschten Preisbereich festzulegen.",
    errorMessage: "DieserWertliegtleideraußerhalbdeszulässigenBereichsbitteversuchenSieeserneut",
    fieldHasError: true,
    stepDownLabel: "Verringern 🔽",
    stepUpLabel: "Erhöhen 🔼",
    datalistOptions: ["Minimum", "Sehrniedrigerpreisbereich", "😀", "<b>Mitte</b>", "متوسط", "Hoch", "Maximum"],
  },
  render,
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "A range of minus to plus a trillion with a 0.0001 step, long unbroken German/URL/emoji/RTL/HTML-like copy, and a 7-option datalist with long and odd labels. Check at every canvas width: the label, description and error wrap inside the dashed outline, the slider shrinks to fit between step buttons that keep their size, and markup renders as text. Set `step` to 0 or a negative number and press the step buttons.",
      },
    },
  },
};
