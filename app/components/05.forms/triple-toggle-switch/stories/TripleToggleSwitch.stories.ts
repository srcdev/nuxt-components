import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref } from "vue";
import StorybookComponent from "../TripleToggleSwitch.vue";
import type { IFormMultipleOptions } from "~/types/forms/types.forms.d";

interface TripleToggleSwitchStoryArgs {
  name: string;
  ariaLabel: string;
  stepAnimationDuration: string;
}

// TripleToggleSwitch keys its marker gradients off three option *values*: "system", "light",
// "dark" (see CONSUMER-STYLING.md). This story uses exactly those values so each gradient fires;
// any other value falls back to --triple-toggle-switch-marker-surface. DisplayThemeSwitch is the
// real-world consumer and adds the useSettingsStore wiring on top.
export default {
  title: "Components/Forms/Triple Toggle Switch/TripleToggleSwitch",
  component: StorybookComponent,
  argTypes: {
    name: { control: "text", table: { category: "Basic" } },
    ariaLabel: {
      control: "text",
      description: "Accessible name for the radiogroup",
      table: { category: "Accessibility" },
    },
    stepAnimationDuration: {
      control: "text",
      description: "CSS transition duration for the marker sliding between options",
      table: { category: "Styling" },
    },
  },
  args: {
    name: "colour-scheme",
    ariaLabel: "Colour scheme",
    stepAnimationDuration: "250ms",
  },
} as Meta<TripleToggleSwitchStoryArgs>;

const buildOptions = (): IFormMultipleOptions => ({
  data: [
    { id: "system", name: "colour-scheme", value: "system", label: "System", icon: "material-symbols:night-sight-auto-sharp" },
    { id: "light", name: "colour-scheme", value: "light", label: "Light", icon: "radix-icons:sun" },
    { id: "dark", name: "colour-scheme", value: "dark", label: "Dark", icon: "radix-icons:moon" },
  ],
  total: 3,
  skip: 0,
  limit: 3,
});

const Template: StoryFn<TripleToggleSwitchStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const modelValue = ref("system");
    const fieldData = ref<IFormMultipleOptions>(buildOptions());
    return { args, modelValue, fieldData };
  },
  template: `
    <div style="margin: 36px;">
      <StorybookComponent
        v-model="modelValue"
        v-model:field-data="fieldData"
        :name="args.name"
        :aria-label="args.ariaLabel"
        :step-animation-duration="args.stepAnimationDuration"
      />
      <div style="margin-top: 1.6rem; font-size: 1.4rem;">Current value: {{ modelValue }}</div>
    </div>
  `,
});

export const Default = Template.bind({});

const CustomTokensTemplate: StoryFn<TripleToggleSwitchStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const modelValue = ref("light");
    const fieldData = ref<IFormMultipleOptions>(buildOptions());
    return { args, modelValue, fieldData };
  },
  template: `
    <div
      style="
        margin: 36px;
        --triple-toggle-switch-gap: 0.4rem;
        --triple-toggle-switch-padding: 0.4rem;
        --triple-toggle-switch-icon-size: 1.6rem;
        --triple-toggle-switch-marker-gradient-system: linear-gradient(135deg, #0ea5e9, #6366f1);
        --triple-toggle-switch-marker-gradient-light: linear-gradient(135deg, #facc15, #f97316);
        --triple-toggle-switch-marker-gradient-dark: linear-gradient(135deg, #1e293b, #475569);
      "
    >
      <StorybookComponent
        v-model="modelValue"
        v-model:field-data="fieldData"
        :name="args.name"
        :aria-label="args.ariaLabel"
        :step-animation-duration="args.stepAnimationDuration"
      />
      <div style="margin-top: 1.6rem; font-size: 1.4rem;">Current value: {{ modelValue }}</div>
    </div>
  `,
});

export const CustomTokens = CustomTokensTemplate.bind({});
