import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import InputSelect from "../InputSelect.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { FormUiTheme, IFormMultipleOptions, IOptionsConfig, InputUiVariant } from "~/types/forms/types.forms.d";
import type { MediaCanvas } from "~/types/components";

interface StoryArgs {
  modelValue: string | number;
  id: string;
  name: string;
  placeholder: string;
  title: string;
  required: boolean;
  fieldHasError: boolean;
  theme: FormUiTheme;
  inputVariant: InputUiVariant;
  options: IOptionsConfig[];
}

const colourOptions: IOptionsConfig[] = [
  { id: "1", name: "red", value: "red", label: "Red" },
  { id: "2", name: "blue", value: "blue", label: "Blue" },
  { id: "3", name: "green", value: "green", label: "Green" },
];

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Input Select/InputSelect",
  component: InputSelect,
  argTypes: {
    modelValue: { control: "text", table: { category: "Model" } },
    id: { control: "text", table: { category: "Basic" } },
    name: { control: "text", table: { category: "Basic" } },
    placeholder: { control: "text", table: { category: "Basic" } },
    title: { control: "text", description: "Native tooltip; pass translated copy", table: { category: "Accessibility" } },
    required: { control: "boolean", table: { category: "Basic" } },
    fieldHasError: { control: "boolean", table: { category: "States" } },
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
    options: {
      control: "object",
      description: "Story-only: the `data` array of `v-model:field-data`",
      table: { category: "Model" },
    },
  },
  args: {
    modelValue: "",
    id: "select-default",
    name: "selectDefault",
    placeholder: "Choose a colour",
    title: "Please select an option",
    required: false,
    fieldHasError: false,
    theme: "default",
    inputVariant: "normal",
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
          "Bare native `<select>` for the `05.forms` select family: no label, description or error (use `InputSelectField` for those). Options come from `v-model:field-data` (`{ data: IOptionsConfig[] }`), each with an optional decorative `icon`. `placeholder` adds a disabled first option. Where the browser supports `appearance: base-select` the open picker is styled too; elsewhere the native dropdown shows. State is exposed as `data-input-variant`, `data-invalid`, `data-dirty` and `data-active` on `.input-select-wrapper`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const render = (args: StoryArgs) => ({
  components: { InputSelect },
  setup() {
    const fieldData = computed<IFormMultipleOptions>(() => ({
      data: args.options,
      total: args.options.length,
      skip: 0,
      limit: args.options.length,
    }));
    const componentArgs = computed(() => {
      const { modelValue: _modelValue, options: _options, ...rest } = args;
      return rest;
    });
    return { args, componentArgs, fieldData };
  },
  template: `
    <InputSelect v-model="args.modelValue" :field-data="fieldData" v-bind="componentArgs" />
    <p style="margin-block-start: 1.6rem; font-family: monospace;">modelValue: {{ JSON.stringify(args.modelValue) }}</p>
  `,
});

export const Default: Story = { render };

export const WithIcons: Story = {
  args: {
    options: [
      { id: "1", name: "email", value: "email", label: "Email", icon: "mdi:email-outline" },
      { id: "2", name: "phone", value: "phone", label: "Phone", icon: "mdi:phone-outline" },
      { id: "3", name: "post", value: "post", label: "Post", icon: "mdi:mailbox-outline" },
    ],
    placeholder: "Contact preference",
  },
  render,
  parameters: {
    docs: {
      description: {
        story: "Options with an `icon`. The icon only shows in browsers that support `appearance: base-select`; the native dropdown shows the label alone.",
      },
    },
  },
};

export const ErrorState: Story = { args: { fieldHasError: true, theme: "error" }, render };

export const Underlined: Story = { args: { inputVariant: "underlined" }, render };

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    modelValue: "0",
    placeholder: "Bitte wählen Sie die gewünschte Zustellungsart für Ihre Bestellung aus der folgenden Liste aus",
    title: "Bitteeineoptionauswählenundanschließendbestätigen",
    fieldHasError: true,
    theme: "error",
    options: [
      { id: "0", name: "zero", value: "0", label: "0 (falsy-looking value)" },
      {
        id: "1",
        name: "long",
        value: "long",
        label: "Expresszustellungmitsendungsverfolgungundversicherungbiszueinemwarenwertvonzehntausendeuro",
      },
      { id: "2", name: "url", value: "url", label: "https://example.com/a/very/long/unbroken/url/that/never/wraps/anywhere" },
      { id: "3", name: "emoji", value: "emoji", label: "🚚 Delivery 📦", icon: "mdi:truck-outline" },
      { id: "4", name: "html", value: "html", label: "<b>not bold</b> <script>alert(1)</script>" },
      { id: "5", name: "rtl", value: "rtl", label: "التوصيل السريع إلى باب المنزل" },
      { id: "6", name: "one", value: "x", label: "x" },
      { id: "7", name: "empty", value: "empty", label: "" },
      ...Array.from({ length: 30 }, (_, index) => ({
        id: `n${index}`,
        name: `n${index}`,
        value: `n${index}`,
        label: `Option ${index + 1}`,
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
          "38 options: a `0` value (selected on load, not the placeholder), long unbroken German and URL labels, emoji, HTML-like text (must render as text), right-to-left text, a single character and an empty label, plus a very long placeholder. Check at every canvas width: the closed select stays inside the dashed outline, and in a `base-select` browser the open picker's long labels wrap instead of running off screen. The empty label renders as a blank row; that's the data, not a bug.",
      },
    },
  },
};
