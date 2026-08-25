import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref } from "vue";
import StorybookComponent from "../TripleToggleSwitchCore.vue";
import type { IFormMultipleOptions } from "~/types/forms/types.forms.d";

interface TripleToggleSwitchCoreStoryArgs {
  name: string;
  stepAnimationDuration: string;
}

// TripleToggleSwitchCore hardcodes three option *values* as CSS selectors — "system", "light",
// "dark" — rather than being value-agnostic (see CONSUMER-STYLING.md). This story uses exactly
// those values so the gradient marker behind each option actually fires; any other value falls
// back to --triple-toggle-switch-marker-surface with no gradient. DisplayThemeSwitch is the
// real-world consumer (light/dark/system colour-scheme picker) — this story exercises the bare
// component the same way, without the store wiring DisplayThemeSwitch adds on top.
export default {
  title: "Components/Forms/Triple Toggle Switch/TripleToggleSwitchCore",
  component: StorybookComponent,
  argTypes: {
    name: { control: "text", table: { category: "Basic" } },
    stepAnimationDuration: {
      control: "text",
      description: "CSS transition duration for the marker sliding between options",
      table: { category: "Styling" },
    },
  },
  args: {
    name: "colour-scheme",
    stepAnimationDuration: "250ms",
  },
} as Meta<TripleToggleSwitchCoreStoryArgs>;

const Template: StoryFn<TripleToggleSwitchCoreStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const modelValue = ref("system");
    const fieldData = ref<IFormMultipleOptions>({
      data: [
        { id: "system", name: args.name, value: "system", label: "System", icon: "material-symbols:night-sight-auto-sharp" },
        { id: "light", name: args.name, value: "light", label: "Light", icon: "radix-icons:sun" },
        { id: "dark", name: args.name, value: "dark", label: "Dark", icon: "radix-icons:moon" },
      ],
      total: 3,
      skip: 0,
      limit: 3,
    });
    return { args, modelValue, fieldData };
  },
  template: `
    <div style="margin: 36px;">
      <StorybookComponent
        v-model="modelValue"
        v-model:field-data="fieldData"
        :name="args.name"
        :step-animation-duration="args.stepAnimationDuration"
      />
      <div style="margin-top: 1.6rem; font-size: 1.4rem;">Current value: {{ modelValue }}</div>
    </div>
  `,
});

export const Default = Template.bind({});
