import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import InputPasswordField from "../InputPasswordField.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms.d";
import type { MediaCanvas } from "~/types/components";

interface StoryArgs {
  modelValue: string;
  name: string;
  label: string;
  placeholder: string;
  maxlength: number;
  autocomplete: string;
  errorMessage: string;
  fieldHasError: boolean;
  required: boolean;
  theme: FormUiTheme;
  inputVariant: InputUiVariant;
  styleClassPassthrough: string[];
  showPasswordText: string;
  hidePasswordText: string;
  descriptionText: string;
}

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Input Text/InputPasswordField",
  component: InputPasswordField,
  argTypes: {
    modelValue: { control: "text", table: { category: "Model" } },
    name: { control: "text", table: { category: "Basic" } },
    label: { control: "text", table: { category: "Basic" } },
    placeholder: { control: "text", table: { category: "Basic" } },
    maxlength: { control: "number", table: { category: "Basic" } },
    autocomplete: {
      control: { type: "select" },
      options: ["current-password", "new-password", "off"],
      table: { category: "Basic" },
    },
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
    showPasswordText: { control: "text", description: "Toggle's accessible name while hidden", table: { category: "Accessibility" } },
    hidePasswordText: { control: "text", description: "Toggle's accessible name while shown", table: { category: "Accessibility" } },
    descriptionText: { control: "text", description: "Story-only: fills the descriptionText slot", table: { category: "Slots" } },
  },
  args: {
    modelValue: "",
    name: "password",
    label: "Password",
    placeholder: "",
    maxlength: 255,
    autocomplete: "current-password",
    errorMessage: "",
    fieldHasError: false,
    required: false,
    theme: "default",
    inputVariant: "normal",
    styleClassPassthrough: [],
    showPasswordText: "Show password",
    hidePasswordText: "Hide password",
    descriptionText: "",
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
          "`InputTextField` with a show/hide toggle (an inline `InputButton` in the right slot) that switches the input between `password` and `text`. `showPasswordText`/`hidePasswordText` localise the toggle's accessible name. `autocomplete` defaults to `current-password`; use `new-password` on sign-up and change-password forms.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const render = (args: StoryArgs) => ({
  components: { InputPasswordField },
  setup() {
    const componentArgs = computed(() => {
      const { modelValue: _modelValue, descriptionText: _descriptionText, ...rest } = args;
      return rest;
    });
    return { args, componentArgs };
  },
  template: `
    <InputPasswordField v-model="args.modelValue" v-bind="componentArgs">
      <template v-if="args.descriptionText" #descriptionText>{{ args.descriptionText }}</template>
    </InputPasswordField>
  `,
});

export const Default: Story = { render };

export const NewPassword: Story = {
  args: { label: "Choose a password", autocomplete: "new-password", descriptionText: "At least 12 characters." },
  render,
  parameters: { docs: { description: { story: "Sign-up use: `autocomplete=\"new-password\"` lets password managers offer a generated one." } } },
};

export const WithError: Story = {
  args: { fieldHasError: true, errorMessage: "Password is too short", modelValue: "weak" },
  render,
};

export const LocalisedToggleText: Story = {
  args: { label: "Mot de passe", showPasswordText: "Afficher le mot de passe", hidePasswordText: "Masquer le mot de passe" },
  render,
};

export const Underlined: Story = { args: { inputVariant: "underlined" }, render };

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    modelValue: "correcthorsebatterystaplecorrecthorsebatterystaplecorrecthorsebatterystaple🔑<script>",
    label: "🔐 Persönlicheskennwortfürdenzugangzumkundenkontoundallenverbundenendiensten <b>not bold</b> كلمة المرور",
    descriptionText: "Mindestens zwölf Zeichen, davon eine Ziffer. يجب أن تتكون كلمة المرور من اثني عشر حرفًا على الأقل",
    errorMessage: "DaskennwortentsprichtleidernichtdenSicherheitsanforderungen",
    fieldHasError: true,
    showPasswordText: "Kennwort im Klartext anzeigen",
    hidePasswordText: "Kennwort wieder verbergen",
  },
  render,
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "A long unbroken value with emoji and HTML-like text, long German/RTL copy everywhere and long toggle labels. Check at every canvas width: the toggle button keeps its size at the right edge, the copy wraps inside the dashed outline, and toggling shows the value as plain text.",
      },
    },
  },
};
