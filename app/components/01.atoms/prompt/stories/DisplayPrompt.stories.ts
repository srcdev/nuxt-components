import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref } from "vue";
import StorybookComponent from "../DisplayPrompt.vue";

export default {
  title: "Atoms/DisplayPrompt",
  component: StorybookComponent,
  argTypes: {
    theme: {
      control: { type: "inline-radio" },
      options: ["info", "success", "warning", "error"],
      description: "Semantic theme for the prompt",
      table: { category: "Appearance" },
    },
    dismissible: {
      control: { type: "boolean" },
      description: "Show a close button to dismiss the prompt",
      table: { category: "Behaviour" },
    },
    useAutoFocus: {
      control: { type: "boolean" },
      description: "Focuses the prompt element on mount",
      table: { category: "Behaviour" },
    },
    styleClassPassthrough: {
      control: { type: "object" },
      description: "Extra classes applied to the prompt wrapper",
      table: { category: "Styling" },
    },
    modelValue: { table: { disable: true } },
  },
  args: {
    theme: "info",
    dismissible: false,
    useAutoFocus: false,
    styleClassPassthrough: [],
  },
} as Meta<typeof StorybookComponent>;

const Template: StoryFn<typeof StorybookComponent> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const model = ref(false);
    return { args, model };
  },
  template: `
    <div style="padding: 2rem; max-width: 640px;">
      <StorybookComponent
        v-model="model"
        :theme="args.theme"
        :dismissible="args.dismissible"
        :use-auto-focus="args.useAutoFocus"
        :style-class-passthrough="args.styleClassPassthrough"
      >
        <template #title>Prompt title</template>
        <template #content>This is the prompt content. It can contain any information you want to communicate to the user.</template>
      </StorybookComponent>
    </div>
  `,
});

export const Default = Template.bind({});

export const InfoTheme = Template.bind({});
InfoTheme.args = {
  theme: "info",
  dismissible: true,
};

export const SuccessTheme = Template.bind({});
SuccessTheme.args = {
  theme: "success",
  dismissible: true,
};

export const WarningTheme = Template.bind({});
WarningTheme.args = {
  theme: "warning",
  dismissible: true,
};

export const ErrorTheme = Template.bind({});
ErrorTheme.args = {
  theme: "error",
  dismissible: true,
};

export const Dismissible = Template.bind({});
Dismissible.args = {
  theme: "info",
  dismissible: true,
};

export const AllThemesDismissible: StoryFn<typeof StorybookComponent> = () => ({
  components: { StorybookComponent },
  setup() {
    return { themes: ["info", "success", "warning", "error"] as const };
  },
  template: `
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1.6rem; max-width: 640px;">
      <StorybookComponent
        v-for="theme in themes"
        :key="theme"
        :theme="theme"
        :dismissible="true"
      >
        <template #title>{{ theme.charAt(0).toUpperCase() + theme.slice(1) }} prompt</template>
        <template #content>This is the {{ theme }} variant of the prompt component.</template>
      </StorybookComponent>
    </div>
  `,
});
