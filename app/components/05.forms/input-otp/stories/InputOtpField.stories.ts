import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import InputOtpField from "../InputOtpField.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms.d";
import type { MediaCanvas } from "~/types/components";

interface StoryArgs {
  modelValue: string;
  name: string;
  label: string;
  length: number;
  autofocus: boolean;
  required: boolean;
  digitLabel: string;
  errorMessage: string;
  fieldHasError: boolean;
  theme: FormUiTheme;
  inputVariant: InputUiVariant;
  descriptionText: string;
}

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Input Otp/InputOtpField",
  component: InputOtpField,
  argTypes: {
    modelValue: { control: "text", table: { category: "Model" } },
    name: { control: "text", table: { category: "Basic" } },
    label: { control: "text", table: { category: "Basic" } },
    length: { control: { type: "number", min: 1, max: 12 }, table: { category: "Basic" } },
    autofocus: { control: "boolean", description: "Focus the first box on mount (applies on remount)", table: { category: "Basic" } },
    required: { control: "boolean", table: { category: "Validation" } },
    errorMessage: { control: "text", table: { category: "Validation" } },
    fieldHasError: { control: "boolean", table: { category: "Validation" } },
    digitLabel: { control: "text", description: "Per-box label; {index} and {length} are replaced", table: { category: "Accessibility" } },
    descriptionText: { control: "text", description: "Fills the descriptionText slot", table: { category: "Slots" } },
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
    name: "code",
    label: "Verification code",
    length: 6,
    autofocus: false,
    required: false,
    digitLabel: "Digit {index} of {length}",
    errorMessage: "",
    fieldHasError: false,
    theme: "default",
    inputVariant: "normal",
    descriptionText: "Enter the 6-digit code we sent to your email.",
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
          "Labelled one-time-code field: a fieldset legend, optional description, the `InputOtp` boxes and an error strip. Try typing, Backspace, the arrow keys, Home/End, Enter (submits the form) and pasting a code.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const render = (args: StoryArgs) => ({
  components: { InputOtpField },
  setup() {
    const componentArgs = computed(() => {
      const { modelValue: _modelValue, descriptionText: _descriptionText, ...rest } = args;
      return rest;
    });
    const submitted = ref("");
    const lastComplete = ref("");
    return { args, componentArgs, submitted, lastComplete };
  },
  template: `
    <form @submit.prevent="submitted = args.modelValue">
      <InputOtpField v-model="args.modelValue" v-bind="componentArgs" @complete="lastComplete = $event">
        <template v-if="args.descriptionText" #descriptionText>{{ args.descriptionText }}</template>
      </InputOtpField>
      <p style="margin-block-start: 1.6rem; overflow-wrap: anywhere;">
        Model: "{{ args.modelValue }}" · last complete: "{{ lastComplete }}" · submitted: "{{ submitted }}"
      </p>
    </form>
  `,
});

export const Default: Story = { render };

export const WithError: Story = {
  args: { modelValue: "482", fieldHasError: true, errorMessage: "That code is incorrect or has expired." },
  render,
};

export const LocalisedLabels: Story = {
  args: {
    label: "Code de vérification",
    digitLabel: "Chiffre {index} sur {length}",
    descriptionText: "Saisissez le code à 6 chiffres envoyé par e-mail.",
  },
  render,
};

export const Underlined: Story = { args: { inputVariant: "underlined" }, render };

export const NarrowContainer: Story = {
  args: { length: 8 },
  render,
  parameters: { initialCanvas: "mobileCanvas" },
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    length: 99,
    modelValue: "0a9<b>1234567890123456789",
    label:
      "🔐 Bestätigungscodeeingabefeldbeschriftungmitsehrlangemunumgebrochenemwort https://example.com/a/very/long/unbroken/url/that/should/wrap/somewhere <script>alert(1)</script>",
    descriptionText:
      "رمز التحقق Wir haben Ihnen einen Bestätigungscode an Ihre hinterlegte E-Mail-Adresse geschickt; geben Sie ihn innerhalb von zehn Minuten ein. <b>not bold</b>",
    digitLabel: "Ziffer {index} von {length} 🔢",
    fieldHasError: true,
    errorMessage: "Dieser BestätigungscodeistleiderabgelaufenodernichtkorrektbitteversuchenSieeserneut",
  },
  render,
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "Length 99 (clamped to 12), a model value with letters and markup (non-digits show as empty boxes, overflow is ignored), long unbroken German/URL/emoji/RTL/HTML-like copy. Check at every canvas width: the 12 boxes shrink to fit rather than overflow, the legend, description and error wrap, and the markup renders as text. Also set Length to 0 and 1.",
      },
    },
  },
};
