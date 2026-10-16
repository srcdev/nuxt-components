import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import ToggleSwitchField from "../ToggleSwitchField.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { FormUiTheme, LabelWeight } from "~/types/forms/types.forms.d";
import type { MediaCanvas } from "~/types/components";

interface StoryArgs {
  modelValue: string | number | boolean;
  name: string;
  label: string;
  layout: "stacked" | "inline";
  labelWeight: LabelWeight | undefined;
  required: boolean;
  errorMessage: string;
  fieldHasError: boolean;
  trueValue: string | number | boolean;
  falseValue: string | number | boolean;
  theme: FormUiTheme;
  round: boolean;
  styleClassPassthrough: string[];
  descriptionText: string;
  useCustomIcons: boolean;
}

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Toggle Switch/ToggleSwitchField",
  component: ToggleSwitchField,
  argTypes: {
    modelValue: { control: "boolean", table: { category: "Model" } },
    name: { control: "text", table: { category: "Basic" } },
    label: { control: "text", table: { category: "Basic" } },
    layout: { control: { type: "select" }, options: ["stacked", "inline"], table: { category: "Layout" } },
    labelWeight: {
      control: { type: "select" },
      options: [undefined, "normal", "semi-bold", "bold"],
      description: "Defaults to bold when stacked, normal when inline",
      table: { category: "Layout" },
    },
    required: { control: "boolean", table: { category: "Validation" } },
    errorMessage: { control: "text", table: { category: "Validation" } },
    fieldHasError: { control: "boolean", table: { category: "Validation" } },
    trueValue: { control: "text", table: { category: "Values" } },
    falseValue: { control: "text", table: { category: "Values" } },
    theme: {
      control: { type: "select" },
      options: ["default", "success", "error", "warning"],
      table: { category: "Styling" },
    },
    round: { control: "boolean", table: { category: "Styling" } },
    styleClassPassthrough: { control: "object", table: { category: "Styling" } },
    descriptionText: { control: "text", description: "Story-only: fills the descriptionText slot", table: { category: "Slots" } },
    useCustomIcons: {
      control: "boolean",
      description: "Story-only: fills the iconOn/iconOff slots",
      table: { category: "Slots" },
    },
  },
  args: {
    modelValue: false,
    name: "notifications",
    label: "Email notifications",
    layout: "stacked",
    labelWeight: undefined,
    required: false,
    errorMessage: "",
    fieldHasError: false,
    trueValue: true,
    falseValue: false,
    theme: "default",
    round: true,
    styleClassPassthrough: [],
    descriptionText: "",
    useCustomIcons: false,
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
          "Labelled switch: `InputLabel`, an optional description, `ToggleSwitch` and an error strip, linked through `aria-describedby`. `layout=\"stacked\"` (default) puts the label above the switch; `layout=\"inline\"` puts them on one row with the description and error below. `labelWeight` defaults to bold when stacked and normal when inline. `style-class-passthrough` lands on the `.toggle-switch-field` root only.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const render = (args: StoryArgs) => ({
  components: { ToggleSwitchField },
  setup() {
    const componentArgs = computed(() => {
      const { modelValue: _modelValue, descriptionText: _descriptionText, useCustomIcons: _useCustomIcons, ...rest } = args;
      return rest;
    });
    return { args, componentArgs };
  },
  template: `
    <ToggleSwitchField v-model="args.modelValue" v-bind="componentArgs">
      <template v-if="args.descriptionText" #descriptionText>{{ args.descriptionText }}</template>
      <template v-if="args.useCustomIcons" #iconOn><Icon name="mdi:check" /></template>
      <template v-if="args.useCustomIcons" #iconOff><Icon name="mdi:close" /></template>
    </ToggleSwitchField>
  `,
});

export const Default: Story = { render };

export const WithDescription: Story = { args: { descriptionText: "At most one email a week." }, render };

export const Inline: Story = {
  args: { layout: "inline", label: "Email me appointment reminders", descriptionText: "Sent the day before." },
  render,
  parameters: {
    docs: {
      description: {
        story: "`layout=\"inline\"`: label and switch on one row, description and error below. Replaces `ToggleSwitchWithLabelInline`.",
      },
    },
  },
};

export const WithCustomIcons: Story = { args: { useCustomIcons: true }, render };

export const ErrorState: Story = {
  args: { fieldHasError: true, errorMessage: "Please accept to continue", required: true },
  render,
};

export const InlineError: Story = {
  args: { layout: "inline", fieldHasError: true, errorMessage: "Please accept to continue" },
  render,
};

export const StringValues: Story = { args: { modelValue: "off", trueValue: "on", falseValue: "off" }, render };

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    layout: "inline",
    label:
      "🔔 Benachrichtigungenüberterminänderungenundsonderangeboteperemailerhalten https://example.com/a/very/long/unbroken/url <b>not bold</b> إشعارات",
    descriptionText: "يرجى تفعيل الإشعارات Sie erhalten höchstens eine Nachricht pro Woche, jederzeit abbestellbar.",
    errorMessage: "BittebestätigenSiedieEinstellungbevorSiefortfahren",
    fieldHasError: true,
    useCustomIcons: true,
  },
  render,
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "The inline layout with long unbroken German, URL, emoji, HTML-like and right-to-left copy in the label, description and error. Check at every canvas width: the label wraps beside the switch without pushing it out of the dashed outline, the switch keeps its size, and markup renders as text. Switch `layout` to stacked to check that too.",
      },
    },
  },
};
