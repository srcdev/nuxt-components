import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import MultipleRadiobuttons from "../MultipleRadiobuttons.vue";
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
  inputVariant: InputUiVariant;
  gap: string;
  descriptionText: string;
  options: IFormMultipleOptions["data"];
}

const enquiryOptions: IFormMultipleOptions["data"] = [
  { id: "1", name: "enquiryType", value: "booking", label: "Booking" },
  { id: "2", name: "enquiryType", value: "consultation", label: "Consultation" },
  { id: "3", name: "enquiryType", value: "product", label: "Product advice" },
  { id: "4", name: "enquiryType", value: "other", label: "Something else" },
];

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Input Radio/MultipleRadiobuttons",
  component: MultipleRadiobuttons,
  argTypes: {
    name: { control: "text", description: "Shared name of every radio in the group", table: { category: "Basic" } },
    legend: { control: "text", table: { category: "Basic" } },
    errorMessage: { control: "text", table: { category: "Basic" } },
    required: { control: "boolean", table: { category: "Basic" } },
    descriptionText: { control: "text", description: "Story-only: fills the descriptionText slot", table: { category: "Slots" } },
    fieldHasError: { control: "boolean", table: { category: "States" } },
    isButton: { control: "boolean", table: { category: "Styling" } },
    isPill: { control: "boolean", description: "Only with isButton", table: { category: "Styling" } },
    optionsLayout: {
      control: { type: "select" },
      options: ["equal-widths", "inline", "block"],
      description: "Rendered as data-options-layout on the items container",
      table: { category: "Styling" },
    },
    direction: {
      control: { type: "select" },
      options: ["row", "row-reverse"],
      description: "Only with isButton",
      table: { category: "Styling" },
    },
    inputVariant: {
      control: { type: "select" },
      options: ["normal", "outlined", "underlined"],
      table: { category: "Styling" },
    },
    gap: {
      control: "text",
      description:
        "**Story control, not a prop.** Sets `--multiple-radiobuttons-gap` on the story wrapper. In your CSS: `.enquiry-form { --multiple-radiobuttons-gap: 0.6rem; }`",
      table: { category: "CSS tokens (story only, set in your CSS)" },
    },
    options: {
      control: "object",
      description: "Story-only: the `data` array of the `fieldData` model",
      table: { category: "Model" },
    },
  },
  args: {
    name: "enquiryType",
    legend: "What's your enquiry about?",
    errorMessage: "Choose an enquiry type",
    required: true,
    fieldHasError: false,
    isButton: false,
    isPill: false,
    optionsLayout: "equal-widths",
    direction: "row",
    inputVariant: "normal",
    gap: "",
    descriptionText: "Pick the closest match.",
    options: enquiryOptions,
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
          "A `radiogroup` fieldset of radios built from the `fieldData` model, bound to a single-value `v-model`. `isButton` swaps the labelled radios for button tiles (`isPill` rounds them), `optionsLayout` lays them out as equal-width columns, an inline wrap or a block column, and `errorMessage` with `fieldHasError` shows the error strip. `required` puts native `required` on every radio, which one checked radio satisfies. Slots: `descriptionText`, `descriptionHtml`, `checkedIcon`, `itemIcon`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const render = (args: StoryArgs) => ({
  components: { MultipleRadiobuttons },
  setup() {
    const componentArgs = computed(() => {
      const { gap: _gap, descriptionText: _descriptionText, options: _options, ...rest } = args;
      return rest;
    });
    const fieldData = computed<IFormMultipleOptions>(() => ({
      data: args.options,
      total: args.options.length,
      skip: 0,
      limit: args.options.length,
    }));
    const tokenStyles = computed(() => (args.gap ? { "--multiple-radiobuttons-gap": args.gap } : {}));
    const modelValue = ref<string>("");
    return { args, componentArgs, fieldData, tokenStyles, modelValue };
  },
  template: `
    <div :style="tokenStyles">
      <MultipleRadiobuttons v-bind="componentArgs" v-model="modelValue" :field-data="fieldData">
        <template v-if="args.descriptionText" #descriptionText>{{ args.descriptionText }}</template>
      </MultipleRadiobuttons>
      <p style="margin-block-start: 2rem; font-family: monospace; overflow-wrap: anywhere;">modelValue: {{ JSON.stringify(modelValue) }}</p>
    </div>
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
    docs: { description: { story: "`fieldHasError` shows the error message and links it to every radio with `aria-describedby`." } },
  },
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    name: "anfrage art",
    legend:
      "📞 Worumgehtesbeiihreranfragebittewählensiediepassendstekategorieaus https://example.com/a/very/long/unbroken/url/that/should/wrap/somewhere <script>alert(1)</script>",
    descriptionText:
      "نوع الاستفسار Wählen Sie die Kategorie, die am besten zu Ihrer Anfrage passt, damit wir Sie an die richtige Person weiterleiten können. <b>not bold</b>",
    errorMessage: "BittewählenSieeineAnfragekategorieausbevorSiedasFormularabsenden",
    fieldHasError: true,
    options: [
      { id: "1", name: "s", value: "a", label: "A" },
      { id: "2", name: "s", value: "", label: "" },
      { id: "3", name: "s", value: "long", label: "Terminvereinbarungsänderungsanfragebearbeitung" },
      { id: "4", name: "s", value: "url", label: "https://example.com/a/very/long/unbroken/url/that/should/wrap/somewhere" },
      { id: "5", name: "s", value: "has spaces <b>", label: "<b>Not bold</b> & <i>not italic</i>" },
      { id: "6", name: "s", value: "emoji", label: "💬 Something else 🤔" },
      { id: "7", name: "s", value: "rtl", label: "استشارة" },
      {
        id: "8",
        name: "s",
        value: "sentence",
        label: "A question about an existing booking, including changing the time, the stylist or the treatment",
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
          "30 options including an empty label, a single character, long unbroken German and URL labels, emoji, right-to-left text, HTML-like text and a value with spaces. Check at every canvas width: the legend, description, labels and error wrap inside the dashed outline, markup renders as text, the equal-width columns never get wider than the container, and clicking any label (including the odd ones) selects its own radio. Switch `optionsLayout` to `inline` and `block`, and turn on `isButton` and `isPill`: long button labels wrap inside their tile.",
      },
    },
  },
};
