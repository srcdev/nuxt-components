import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { computed, ref } from "vue";
import StorybookComponent from "../MultipleRadiobuttons.vue";
import type { IFormMultipleOptions, InputUiVariant, OptionsLayout } from "~/types/forms/types.forms.d";

interface MultipleRadiobuttonsStoryArgs {
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
}

export default {
  title: "Components/Forms/Input Radio/MultipleRadiobuttons",
  component: StorybookComponent,
  argTypes: {
    name: { control: "text", description: "Shared name of every radio in the group", table: { category: "Basic" } },
    legend: { control: "text", table: { category: "Basic" } },
    errorMessage: { control: "text", table: { category: "Basic" } },
    required: { control: "boolean", table: { category: "Basic" } },
    descriptionText: { control: "text", description: "descriptionText slot", table: { category: "Slots" } },
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
      description: "Sets --multiple-radiobuttons-gap on the story wrapper",
      table: { category: "Tokens" },
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
  },
} as Meta<MultipleRadiobuttonsStoryArgs>;

const Template: StoryFn<MultipleRadiobuttonsStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const modelValue = ref<string>("");
    const fieldData = ref<IFormMultipleOptions>({
      data: [
        { id: "1", name: "enquiryType", value: "booking", label: "Booking" },
        { id: "2", name: "enquiryType", value: "consultation", label: "Consultation" },
        { id: "3", name: "enquiryType", value: "product", label: "Product advice" },
        { id: "4", name: "enquiryType", value: "other", label: "Something else" },
      ],
      total: 4,
      skip: 0,
      limit: 10,
    });
    const componentArgs = computed(() => {
      const { gap: _gap, descriptionText: _description, ...rest } = args;
      return rest;
    });
    const tokenStyles = computed(() => (args.gap ? { "--multiple-radiobuttons-gap": args.gap } : {}));
    return { args, componentArgs, tokenStyles, modelValue, fieldData };
  },
  template: `
    <div style="margin: 36px; max-width: 560px;" :style="tokenStyles">
      <StorybookComponent v-bind="componentArgs" v-model="modelValue" v-model:field-data="fieldData">
        <template v-if="args.descriptionText" #descriptionText>{{ args.descriptionText }}</template>
      </StorybookComponent>
      <p style="margin-top: 2rem; font-family: monospace;">modelValue: {{ JSON.stringify(modelValue) }}</p>
    </div>
  `,
});

export const Default = Template.bind({});

export const Buttons = Template.bind({});
Buttons.args = { isButton: true, optionsLayout: "inline" };

export const Pills = Template.bind({});
Pills.args = { isButton: true, isPill: true, optionsLayout: "inline" };

export const Block = Template.bind({});
Block.args = { optionsLayout: "block" };

export const ErrorState = Template.bind({});
ErrorState.args = { fieldHasError: true };
