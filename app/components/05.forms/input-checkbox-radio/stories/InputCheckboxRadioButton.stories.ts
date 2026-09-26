import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { defineComponent, ref } from "vue";
import StorybookComponent from "../InputCheckboxRadioButton.vue";

interface InputCheckboxRadioButtonStoryArgs {
  type: "checkbox" | "radio";
  label: string;
  isPill: boolean;
  fieldHasError: boolean;
  displayAsDisc: boolean;
  direction: "row" | "row-reverse";
}

export default {
  title: "Components/Forms/Input Checkbox Radio/InputCheckboxRadioButton",
  component: StorybookComponent,
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["checkbox", "radio"],
      table: { category: "Basic" },
    },
    label: { control: "text", table: { category: "Basic" } },
    isPill: { control: "boolean", table: { category: "Styling" } },
    fieldHasError: { control: "boolean", table: { category: "States" } },
    displayAsDisc: { control: "boolean", table: { category: "Styling" } },
    direction: {
      control: { type: "select" },
      options: ["row", "row-reverse"],
      description: "row-reverse puts the control on the right",
      table: { category: "Styling" },
    },
  },
  args: {
    type: "checkbox",
    label: "Balayage",
    isPill: false,
    fieldHasError: false,
    displayAsDisc: false,
    direction: "row",
  },
} as Meta<InputCheckboxRadioButtonStoryArgs>;

const Template: StoryFn<InputCheckboxRadioButtonStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const modelValue = ref(false);
    return { args, modelValue };
  },
  template: `
    <div style="margin: 36px; max-width: 260px;">
      <StorybookComponent
        id="single-option"
        name="single"
        :type="args.type"
        :label="args.label"
        :is-pill="args.isPill"
        :field-has-error="args.fieldHasError"
        :display-as-disc="args.displayAsDisc"
        :direction="args.direction"
        v-model="modelValue"
      />
    </div>
  `,
});

export const Default = Template.bind({});

// "Services of interest" pattern — the actual multi-option checkbox-pill layout this component
// is normally used in (as opposed to Default's single isolated control).
// Selection state lives in a child keyed on type, so switching checkbox/radio remounts it with
// the right empty value (an array for checkboxes, a string for radios). A watch on args.type
// isn't reliable here: the template sees the new arg, but the watcher doesn't fire.
const ServiceOptionGroup = defineComponent({
  components: { StorybookComponent },
  props: {
    type: { type: String as () => "checkbox" | "radio", required: true },
    isPill: Boolean,
    fieldHasError: Boolean,
    displayAsDisc: Boolean,
    direction: { type: String as () => "row" | "row-reverse", default: "row" },
  },
  setup(props) {
    const services = [
      "Balayage",
      "Highlights",
      "Half Head Highlights",
      "Full Colour",
      "Lowlights",
      "Toner & Gloss",
    ];
    const selected = ref<string[] | string>(props.type === "checkbox" ? [] : "");
    return { services, selected };
  },
  template: `
    <div>
      <div style="margin: 36px; max-width: 480px; display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
        <StorybookComponent
          v-for="service in services"
          :key="service"
          :id="'service-' + service"
          name="services"
          :type="type"
          :label="service"
          :true-value="service"
          :multiple-options="type === 'checkbox'"
          :is-pill="isPill"
          :field-has-error="fieldHasError"
          :display-as-disc="displayAsDisc"
          :direction="direction"
          v-model="selected"
        />
      </div>
      <p style="margin: 0 36px; font-family: monospace;">selected: {{ JSON.stringify(selected) }}</p>
    </div>
  `,
});

const OptionGroupTemplate: StoryFn<InputCheckboxRadioButtonStoryArgs> = (args) => ({
  components: { ServiceOptionGroup },
  setup() {
    return { args };
  },
  template: `
    <ServiceOptionGroup
      :key="args.type"
      :type="args.type"
      :is-pill="args.isPill"
      :field-has-error="args.fieldHasError"
      :display-as-disc="args.displayAsDisc"
      :direction="args.direction"
    />
  `,
});

export const OptionGroup = OptionGroupTemplate.bind({});
OptionGroup.argTypes = { label: { table: { disable: true } } };
