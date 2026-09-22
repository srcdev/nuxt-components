import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref, computed } from "vue";
import StorybookComponent from "../variants/InputSelectWithLabel.vue";
import type { FormUiTheme, InputUiVariant, IFormMultipleOptions } from "~/types/forms/types.forms.d";

interface InputSelectWithLabelStoryArgs {
  modelValue: string | number;
  name: string;
  label: string;
  placeholder: string;
  errorMessage: string;
  fieldHasError: boolean;
  required: boolean;
  theme: FormUiTheme;
  inputVariant: InputUiVariant;
  styleClassPassthrough: string[];
  useDescriptionSlot: boolean;
  descriptionContent: string;
}

export default {
  title: "Components/Forms/Input Select/InputSelectWithLabel",
  component: StorybookComponent,
  argTypes: {
    modelValue: { control: "text", table: { category: "Model" } },
    name: { control: "text", table: { category: "Basic" } },
    label: { control: "text", table: { category: "Basic" } },
    placeholder: { control: "text", table: { category: "Basic" } },
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
    useDescriptionSlot: { control: "boolean", table: { category: "Slots" } },
    descriptionContent: { control: "text", table: { category: "Slots" } },
  },
  args: {
    modelValue: "",
    name: "colour",
    label: "Favourite colour",
    placeholder: "Choose a colour",
    errorMessage: "",
    fieldHasError: false,
    required: false,
    theme: "default",
    inputVariant: "normal",
    styleClassPassthrough: [],
    useDescriptionSlot: false,
    descriptionContent: "Pick the colour you like best",
  },
} as Meta<InputSelectWithLabelStoryArgs>;

// `args` is Storybook's own reactive object — bind to it directly (`args.x`) rather than
// destructuring it into local variables/refs, which would snapshot the values once at setup()
// and stop reflecting later Controls-panel changes. `componentArgs` strips the non-prop
// slot-toggle args so they don't leak onto the component as unknown attributes.
const Template: StoryFn<InputSelectWithLabelStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const fieldData = ref<IFormMultipleOptions>({
      data: [
        { id: "1", name: "red", value: "red", label: "Red" },
        { id: "2", name: "blue", value: "blue", label: "Blue" },
        { id: "3", name: "green", value: "green", label: "Green" },
      ],
      total: 3,
      skip: 0,
      limit: 10,
    });

    const componentArgs = computed(() => {
      const { useDescriptionSlot, descriptionContent, ...rest } = args;
      return rest;
    });

    return { args, componentArgs, fieldData };
  },
  template: `
    <div style="margin: 36px; max-width: 320px;">
      <StorybookComponent v-model="args.modelValue" v-model:field-data="fieldData" v-bind="componentArgs">
        <template v-if="args.useDescriptionSlot" #descriptionText>{{ args.descriptionContent }}</template>
      </StorybookComponent>
    </div>
  `,
});

export const Default = Template.bind({});

export const WithError = Template.bind({});
WithError.args = {
  fieldHasError: true,
  errorMessage: "Please choose a colour",
  theme: "error",
};

export const Required = Template.bind({});
Required.args = { required: true };

export const WithDescription = Template.bind({});
WithDescription.args = { useDescriptionSlot: true };

export const Underlined = Template.bind({});
Underlined.args = { inputVariant: "underlined" };

export const Outlined = Template.bind({});
Outlined.args = { inputVariant: "outlined", useDescriptionSlot: true };
