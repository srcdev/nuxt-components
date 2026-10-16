import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import MultipleCheckboxes from "../MultipleCheckboxes.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { IFormMultipleOptions, InputUiVariant, OptionsLayout } from "~/types/forms/types.forms.d";
import type { MediaCanvas } from "~/types/components";

interface StoryArgs {
  name: string;
  legend: string;
  errorMessage: string;
  required: boolean;
  fieldHasError: boolean;
  isButton: boolean;
  isPill: boolean;
  optionsLayout: OptionsLayout;
  direction: "row" | "row-reverse";
  displayAsDisc: boolean;
  inputVariant: InputUiVariant;
  descriptionText: string;
  options: IFormMultipleOptions["data"];
}

const serviceOptions: IFormMultipleOptions["data"] = [
  { id: "1", name: "services", value: "cut", label: "Cut" },
  { id: "2", name: "services", value: "colour", label: "Colour" },
  { id: "3", name: "services", value: "balayage", label: "Balayage" },
  { id: "4", name: "services", value: "styling", label: "Styling" },
  { id: "5", name: "services", value: "treatment", label: "Conditioning treatment" },
];

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Input Checkbox/MultipleCheckboxes",
  component: MultipleCheckboxes,
  argTypes: {
    name: { control: "text", table: { category: "Basic" } },
    legend: { control: "text", table: { category: "Basic" } },
    errorMessage: { control: "text", table: { category: "Basic" } },
    required: { control: "boolean", table: { category: "Basic" } },
    fieldHasError: { control: "boolean", table: { category: "States" } },
    isButton: { control: "boolean", table: { category: "Styling" } },
    isPill: { control: "boolean", description: "Only with isButton", table: { category: "Styling" } },
    optionsLayout: {
      control: { type: "select" },
      options: ["equal-widths", "inline", "block"],
      table: { category: "Styling" },
    },
    direction: {
      control: { type: "select" },
      options: ["row", "row-reverse"],
      description: "Only with isButton",
      table: { category: "Styling" },
    },
    displayAsDisc: { control: "boolean", table: { category: "Styling" } },
    inputVariant: {
      control: { type: "select" },
      options: ["normal", "outlined", "underlined"],
      table: { category: "Styling" },
    },
    descriptionText: {
      control: "text",
      description: "Story-only: fills the descriptionText slot",
      table: { category: "Slots" },
    },
    options: {
      control: "object",
      description: "Story-only: the `data` array of the `fieldData` model",
      table: { category: "Model" },
    },
  },
  args: {
    name: "services",
    legend: "Services of interest",
    errorMessage: "Choose at least one service",
    required: false,
    fieldHasError: false,
    isButton: false,
    isPill: false,
    optionsLayout: "equal-widths",
    direction: "row",
    displayAsDisc: false,
    inputVariant: "normal",
    descriptionText: "Select all that apply.",
    options: serviceOptions,
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
          "A fieldset of checkboxes built from the `fieldData` model, bound to an array `v-model`. `isButton` swaps the labelled checkboxes for button tiles (`isPill` rounds them), `optionsLayout` lays them out as equal-width columns, an inline wrap or a block column, and `errorMessage` with `fieldHasError` shows the error strip. Slots: `descriptionText`, `descriptionHtml`, `checkedIcon`, `itemIcon`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const render = (args: StoryArgs) => ({
  components: { MultipleCheckboxes },
  setup() {
    const componentArgs = computed(() => {
      const { descriptionText: _descriptionText, options: _options, ...rest } = args;
      return rest;
    });
    const fieldData = computed<IFormMultipleOptions>(() => ({
      data: args.options,
      total: args.options.length,
      skip: 0,
      limit: args.options.length,
    }));
    const modelValue = ref<string[]>([]);
    return { args, componentArgs, fieldData, modelValue };
  },
  template: `
    <MultipleCheckboxes v-bind="componentArgs" v-model="modelValue" :field-data="fieldData">
      <template v-if="args.descriptionText" #descriptionText>{{ args.descriptionText }}</template>
    </MultipleCheckboxes>
    <p style="margin-block-start: 2rem; font-family: monospace; overflow-wrap: anywhere;">modelValue: {{ JSON.stringify(modelValue) }}</p>
  `,
});

export const Default: Story = { render };

export const Buttons: Story = {
  args: { isButton: true, optionsLayout: "inline" },
  render,
  parameters: { docs: { description: { story: "Button tiles in an inline wrap, each with the `itemIcon` decorator." } } },
};

export const Pills: Story = {
  args: { isButton: true, isPill: true, optionsLayout: "inline" },
  render,
  parameters: { docs: { description: { story: "Button tiles with `isPill` for fully rounded ends." } } },
};

export const Block: Story = {
  args: { optionsLayout: "block" },
  render,
  parameters: { docs: { description: { story: "`optionsLayout=\"block\"` stacks the options in one column." } } },
};

export const ErrorState: Story = {
  args: { fieldHasError: true },
  render,
  parameters: {
    docs: { description: { story: "`fieldHasError` shows the error message and links it to every checkbox with `aria-describedby`." } },
  },
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    name: "dienstleistungen auswahl",
    legend:
      "🎨 Gewünschte Dienstleistungsauswahlmöglichkeitenbeschreibungsüberschrift https://example.com/a/very/long/unbroken/url/that/should/wrap/somewhere <script>alert(1)</script>",
    descriptionText:
      "اختر الخدمات Wählen Sie alle zutreffenden Dienstleistungen aus, die Sie bei Ihrem nächsten Besuch in Anspruch nehmen möchten. <b>not bold</b>",
    errorMessage: "BittewählenSiemindestenseineDienstleistungausbevorSiedasFormularabsenden",
    fieldHasError: true,
    required: true,
    options: [
      { id: "1", name: "s", value: "a", label: "A" },
      { id: "2", name: "s", value: "", label: "" },
      { id: "3", name: "s", value: "long", label: "Haarverlängerungsberatungstermindienstleistungspaket" },
      { id: "4", name: "s", value: "url", label: "https://example.com/a/very/long/unbroken/url/that/should/wrap/somewhere" },
      { id: "5", name: "s", value: "has spaces <b>", label: "<b>Not bold</b> & <i>not italic</i>" },
      { id: "6", name: "s", value: "emoji", label: "💇‍♀️ Colour + cut 🌈" },
      { id: "7", name: "s", value: "rtl", label: "قص الشعر وتصفيفه" },
      {
        id: "8",
        name: "s",
        value: "sentence",
        label: "A conditioning treatment with a scalp massage, a hot towel and a blow-dry finish, booked as one appointment",
      },
      ...Array.from({ length: 22 }, (_, index) => ({
        id: `extra-${index}`,
        name: "s",
        value: `extra-${index}`,
        label: `Option ${index + 9}`,
      })),
    ],
  },
  render,
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      story: { inline: false, height: "900px" },
      description: {
        story:
          "30 options including an empty label, a single character, long unbroken German and URL labels, emoji, right-to-left text, HTML-like text and a value with spaces. Check at every canvas width: the legend, description, labels and error wrap inside the dashed outline, markup renders as text, the equal-width columns never get wider than the container, and clicking any label (including the odd ones) toggles its own checkbox. Switch `optionsLayout` to `inline` and `block`, and turn on `isButton`..",
      },
    },
  },
};
