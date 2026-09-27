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
          <Icon name="material-symbols:check-circle-outline" />
        </template>
      </StorybookComponent>
    </div>
  `,
});

export const Default = Template.bind({});

const variants = ["default", "primary", "success", "warning", "danger", "neutral"] as const;

export const AllVariants: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args, variants };
  },
  template: `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; gap: 1.6rem; flex-wrap: wrap;">
      <StorybookComponent
        v-for="variant in variants"
        :key="variant"
        :tag="args.tag"
        :label="variant"
        :size="args.size"
        :variant="variant"
        :reversed="args.reversed"
      >
        <template v-if="args.showIcon" #icon>
          <Icon name="material-symbols:check-circle-outline" />
        </template>
      </StorybookComponent>
    </div>
  `,
});
AllVariants.argTypes = { variant: { table: { disable: true } }, label: { table: { disable: true } } };

export const OutlinedViaBaseTokens: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args, variants };
  },
  template: `
    <div
      style="
        display: flex; align-items: center; justify-content: center; min-height: 100vh; gap: 1.6rem; flex-wrap: wrap;
        --display-pill-background: transparent;
        --display-pill-text-colour: #1e293b;
        --display-pill-border-colour: currentColor;
      "
    >
      <StorybookComponent v-for="variant in variants" :key="variant" :label="variant" :size="args.size" :variant="variant" />
    </div>
  `,
});
OutlinedViaBaseTokens.storyName = "Outlined (base tokens override every variant)";
OutlinedViaBaseTokens.parameters = {
  docs: {
    description: {
      story:
        "Setting only the base --display-pill-background/-text-colour/-border-colour on an ancestor restyles every variant. A variant-specific token (e.g. --display-pill-success-background) would still win for that variant.",
    },
  },
};
