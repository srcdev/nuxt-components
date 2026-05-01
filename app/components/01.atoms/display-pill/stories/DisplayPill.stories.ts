import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../DisplayPill.vue";

type StoryArgs = {
  tag: "span" | "div" | "button" | "a";
  label: string;
  size: "sm" | "md" | "lg";
  variant: "default" | "primary" | "success" | "warning" | "danger" | "neutral";
  reversed: boolean;
  showIcon: boolean;
};

export default {
  title: "Atoms/DisplayPill",
  component: StorybookComponent,
  argTypes: {
    tag: {
      control: { type: "inline-radio" },
      options: ["span", "div", "button", "a"],
      description: "Root element tag",
    },
    label: {
      control: { type: "text" },
      description: "Pill label text",
    },
    size: {
      control: { type: "inline-radio" },
      options: ["sm", "md", "lg"],
      description: "Pill size",
    },
    variant: {
      control: { type: "inline-radio" },
      options: ["default", "primary", "success", "warning", "danger", "neutral"],
      description: "Colour variant",
    },
    reversed: {
      control: { type: "boolean" },
      description: "Swap icon and label order",
    },
    showIcon: {
      control: { type: "boolean" },
      description: "Show icon slot",
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
    class: {
      table: { disable: true },
    },
    style: {
      table: { disable: true },
    },
  },
  args: {
    tag: "span",
    label: "Status",
    size: "md",
    variant: "default",
    reversed: false,
    showIcon: true,
  },
} as Meta<StoryArgs>;

const Template: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; gap: 1.6rem; flex-wrap: wrap;">
      <StorybookComponent
        :tag="args.tag"
        :label="args.label"
        :size="args.size"
        :variant="args.variant"
        :reversed="args.reversed"
      >
        <template v-if="args.showIcon" #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="12" r="5" />
          </svg>
        </template>
      </StorybookComponent>
    </div>
  `,
});

export const Default = Template.bind({});
