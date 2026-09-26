import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../FormFieldset.vue";

interface FormFieldsetStoryArgs {
  id: string;
  name: string;
  legend: string;
  groupRole: "group" | "radiogroup";
  required: boolean;
  fieldHasError: boolean;
  styleClassPassthrough: string;
}

export default {
  title: "Components/Forms/Form Fieldset/FormFieldset",
  component: StorybookComponent,
  argTypes: {
    id: { control: "text", table: { category: "Basic" } },
    name: { control: "text", table: { category: "Basic" } },
    legend: { control: "text", table: { category: "Basic" } },
    groupRole: {
      control: { type: "select" },
      options: ["group", "radiogroup"],
      description: "\"radiogroup\" for radio buttons, \"group\" (native fieldset role) for everything else",
      table: { category: "Accessibility" },
    },
    required: {
      control: "boolean",
      description: "Only produces aria-required when groupRole is radiogroup",
      table: { category: "Validation" },
    },
    fieldHasError: { control: "boolean", table: { category: "Validation" } },
    styleClassPassthrough: { control: "text", table: { category: "Styling" } },
  },
  args: {
    id: "contact-preference",
    name: "contactPreference",
    legend: "How should we contact you?",
    groupRole: "radiogroup",
    required: true,
    fieldHasError: false,
    styleClassPassthrough: "",
  },
} as Meta<FormFieldsetStoryArgs>;

const Template: StoryFn<FormFieldsetStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="margin: 3.6rem; max-width: 48rem;">
      <StorybookComponent
        :id="args.id"
        :name="args.name"
        :legend="args.legend"
        :group-role="args.groupRole"
        :required="args.required"
        :field-has-error="args.fieldHasError"
        :style-class-passthrough="args.styleClassPassthrough"
      >
        <template #content>
          <label style="display: block; font-size: 1.6rem;">
            <input type="radio" :name="args.name" value="email" /> Email
          </label>
          <label style="display: block; font-size: 1.6rem;">
            <input type="radio" :name="args.name" value="phone" /> Phone
          </label>
        </template>
      </StorybookComponent>
      <p style="font-size: 1.3rem; margin-top: 1.6rem;">
        Rendered by SingleCheckbox, MultipleCheckboxes and MultipleRadiobuttons. Inspect the fieldset to see role and aria-* output.
      </p>
    </div>
  `,
});

export const Default = Template.bind({});

export const CheckboxGroup = Template.bind({});
CheckboxGroup.args = { groupRole: "group", legend: "Interests", required: false };

export const WithError = Template.bind({});
WithError.args = { fieldHasError: true };
