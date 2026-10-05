import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { computed } from "vue";
import UiBlockDecorated from "../UiBlockDecorated.vue";

interface UiBlockDecoratedStoryArgs {
  tag: "div" | "p" | "span" | "section" | "article" | "aside" | "header" | "footer" | "main" | "nav" | "ul" | "ol";
  borderStrength: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  shadowStrength: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  innerShadowStrength: 0 | 1 | 2 | 3 | 4;
  label: string;
  borderColour: string;
  shadowColour: string;
  innerShadowColour: string;
  background: string;
  textColour: string;
}

export default {
  title: "Atoms/UiBlockDecorated",
  component: UiBlockDecorated,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "p", "span", "section", "article", "aside", "header", "footer", "main", "nav", "ul", "ol"],
      description: "Root element tag",
      table: { category: "Basic" },
    },
    borderStrength: {
      control: { type: "select" },
      options: [0, 1, 2, 3, 4, 5, 6],
      description: "Border strength level (0 = none)",
      table: { category: "Basic" },
    },
    shadowStrength: {
      control: { type: "select" },
      options: [0, 1, 2, 3, 4, 5, 6],
      description: "Drop shadow strength level (0 = none)",
      table: { category: "Basic" },
    },
    innerShadowStrength: {
      control: { type: "select" },
      options: [0, 1, 2, 3, 4],
      description: "Inner shadow strength level (0 = none)",
      table: { category: "Basic" },
    },
    label: { control: "text", description: "Story only: block text", table: { category: "Story" } },
    borderColour: {
      control: "color",
      description: "--ui-block-decorated-border-colour (empty = var(--theme-border))",
      table: { category: "Tokens" },
    },
    shadowColour: {
      control: "color",
      description: "--ui-block-decorated-shadow-colour (empty = black). Each strength level mixes in its own opacity.",
      table: { category: "Tokens" },
    },
    innerShadowColour: {
      control: "color",
      description: "--ui-block-decorated-inner-shadow-colour (empty = the shadow colour)",
      table: { category: "Tokens" },
    },
    background: {
      control: "color",
      description: "Story only: block background, for checking contrast (empty = none)",
      table: { category: "Story" },
    },
    textColour: {
      control: "color",
      description: "Story only: block text colour (empty = inherited)",
      table: { category: "Story" },
    },
  },
  args: {
    tag: "div",
    borderStrength: 0,
    shadowStrength: 0,
    innerShadowStrength: 0,
    label: "No decoration",
    borderColour: "",
    shadowColour: "",
    innerShadowColour: "",
    background: "",
    textColour: "",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A plain block wrapper that applies independent border / drop-shadow / inner-shadow strength levels via CSS custom properties (see CONSUMER-STYLING.md). Use the colour pickers under Tokens to recolour every strength level at once.",
      },
    },
  },
} as Meta<UiBlockDecoratedStoryArgs>;

const Template: StoryFn<UiBlockDecoratedStoryArgs> = (args) => ({
  components: { UiBlockDecorated },
  setup() {
    const blockStyle = computed(() => ({
      padding: "2rem",
      ...(args.borderColour ? { "--ui-block-decorated-border-colour": args.borderColour } : {}),
      ...(args.shadowColour ? { "--ui-block-decorated-shadow-colour": args.shadowColour } : {}),
      ...(args.innerShadowColour ? { "--ui-block-decorated-inner-shadow-colour": args.innerShadowColour } : {}),
      ...(args.background ? { background: args.background } : {}),
      ...(args.textColour ? { color: args.textColour } : {}),
    }));
    return { args, blockStyle };
  },
  template: `
    <UiBlockDecorated
      :tag="args.tag"
      :border-strength="args.borderStrength"
      :shadow-strength="args.shadowStrength"
      :inner-shadow-strength="args.innerShadowStrength"
      :style="blockStyle"
    >
      {{ args.label }}
    </UiBlockDecorated>
  `,
});

export const Default = Template.bind({});

export const Border = Template.bind({});
Border.args = { borderStrength: 3, label: "Border strength 3" };

export const Shadow = Template.bind({});
Shadow.args = { shadowStrength: 4, label: "Shadow strength 4" };

export const InnerShadow = Template.bind({});
InnerShadow.args = { innerShadowStrength: 3, label: "Inner shadow strength 3" };

export const AllCombined = Template.bind({});
AllCombined.args = { borderStrength: 2, shadowStrength: 3, innerShadowStrength: 2, label: "All three combined" };

export const BrandColours = Template.bind({});
BrandColours.args = {
  borderStrength: 2,
  shadowStrength: 4,
  innerShadowStrength: 2,
  label: "Brand colours via the colour tokens",
  borderColour: "#7c3aed",
  shadowColour: "#7c3aed",
  background: "#faf5ff",
  textColour: "#3b0764",
};
BrandColours.parameters = {
  docs: {
    description: {
      story:
        "`--ui-block-decorated-border-colour` and `--ui-block-decorated-shadow-colour` recolour every strength level; each shadow level keeps its own opacity. Background and text colour are story-only, for checking contrast.",
    },
  },
};

export const CustomTokens: StoryFn<UiBlockDecoratedStoryArgs> = (args) => ({
  components: { UiBlockDecorated },
  setup() {
    return { args };
  },
  template: `
    <UiBlockDecorated
      :shadow-strength="3"
      style="padding: 2rem; --ui-block-decorated-shadow-3: 0 6px 12px rgba(0, 0, 0, 0.25);"
    >
      Custom shadow-3 token
    </UiBlockDecorated>
  `,
});
CustomTokens.parameters = {
  controls: { disable: true },
  docs: {
    description: {
      story: "Overriding a whole strength level's token via an inline `--ui-block-decorated-*` custom property.",
    },
  },
};
