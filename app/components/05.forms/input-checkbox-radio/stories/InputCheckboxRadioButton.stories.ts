import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref, watch } from "vue";
import StorybookComponent from "../InputCheckboxRadioButton.vue";

interface InputCheckboxRadioButtonStoryArgs {
  type: "checkbox" | "radio";
  label: string;
  isPill: boolean;
  fieldHasError: boolean;
  displayAsDisc: boolean;
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
  },
  args: {
    type: "checkbox",
    label: "Balayage",
    isPill: false,
    fieldHasError: false,
    displayAsDisc: false,
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
        v-model="modelValue"
      />
    </div>
  `,
});

export const Default = Template.bind({});

// "Services of interest" pattern — the actual multi-option checkbox-pill layout this component
// is normally used in (as opposed to Default's single isolated control).
const OptionGroupTemplate: StoryFn<InputCheckboxRadioButtonStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const services = [
      "Balayage",
      "Highlights",
      "Half Head Highlights",
      "Full Colour",
      "Lowlights",
      "Toner & Gloss",
    ];
    // Checkbox groups hold an array of values, radio groups a single value.
    const emptySelection = () => (args.type === "checkbox" ? [] : "");
    const selected = ref<string[] | string>(emptySelection());
    watch(
      () => args.type,
      () => {
        selected.value = emptySelection();
      }
    );
    return { args, services, selected };
  },
  template: `
    <div style="margin: 36px; max-width: 480px; display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
      <StorybookComponent
        v-for="service in services"
        :key="service"
        :id="'service-' + service"
        name="services"
        :type="args.type"
        :label="service"
        :true-value="service"
        :multiple-options="args.type === 'checkbox'"
        :is-pill="args.isPill"
        :field-has-error="args.fieldHasError"
        :display-as-disc="args.displayAsDisc"
        v-model="selected"
      />
    </div>
    <p style="margin: 0 36px; font-family: monospace;">selected: {{ JSON.stringify(selected) }}</p>
  `,
});

export const OptionGroup = OptionGroupTemplate.bind({});
OptionGroup.argTypes = { label: { table: { disable: true } } };
