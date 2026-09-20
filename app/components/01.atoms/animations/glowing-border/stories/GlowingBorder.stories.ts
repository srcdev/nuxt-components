import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../GlowingBorder.vue";

const PX_OPTIONS = ["1px", "2px", "3px", "4px", "5px", "6px"] as const;
const DURATION_OPTIONS = ["5s", "6s", "7s", "8s", "9s", "10s", "11s", "12s", "13s", "14s", "15s"] as const;

type StoryArgs = {
  tag: "div" | "p" | "span" | "section" | "article" | "aside" | "header" | "footer" | "main" | "nav" | "ul" | "ol";
  variant: "subtle" | "vivid" | "silver" | "steel" | "green";
  content: string;
  borderWidth: (typeof PX_OPTIONS)[number];
  borderRadius: (typeof PX_OPTIONS)[number];
  animationDuration: (typeof DURATION_OPTIONS)[number];
};

export default {
  title: "Atoms/Effects/GlowingBorder",
  component: StorybookComponent,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "p", "span", "section", "article", "aside", "header", "footer", "main", "nav", "ul", "ol"],
      description: "Root element tag",
    },
    variant: {
      control: { type: "inline-radio" },
      options: ["subtle", "vivid", "silver", "steel", "green"],
      description: "Glow colour variant",
    },
    content: {
      control: { type: "text" },
      description: "Slot content",
    },
    borderWidth: {
      control: { type: "select" },
      options: PX_OPTIONS,
      description: "--glowing-border-width",
      table: { category: "CSS tokens" },
    },
    borderRadius: {
      control: { type: "select" },
      options: PX_OPTIONS,
      description: "--glowing-border-radius",
      table: { category: "CSS tokens" },
    },
    animationDuration: {
      control: { type: "select" },
      options: DURATION_OPTIONS,
      description: "--glowing-border-animation-duration",
      table: { category: "CSS tokens" },
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
    tag: "div",
    variant: "vivid",
    content: "This is default slot content for the GlowingBorder component. Any HTML content can be placed here.",
    borderWidth: "3px",
    borderRadius: "6px",
    animationDuration: "10s",
  },
} as Meta<StoryArgs>;

const Template: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 40px; background-color: var(--slate-10);">
      <StorybookComponent
        :tag="args.tag"
        :variant="args.variant"
        :style="{
          '--glowing-border-width': args.borderWidth,
          '--glowing-border-radius': args.borderRadius,
          '--glowing-border-animation-duration': args.animationDuration,
        }"
      >
        <div style="padding: 20px; color: var(--slate-02);">
          <h3 style="margin: 0 0 12px 0; font-size: 1.5rem; font-weight: 600;">GlowingBorder</h3>
          <p style="margin: 0; line-height: 1.6;">{{ args.content }}</p>
        </div>
      </StorybookComponent>
    </div>
  `,
});

export const Default = Template.bind({});

export const Vivid = Template.bind({});
Vivid.args = {
  variant: "vivid",
  content:
    "Vivid variant creates a bright, attention-grabbing glow effect perfect for highlighting important content or call-to-action elements.",
};

export const Subtle = Template.bind({});
Subtle.args = {
  variant: "subtle",
  content:
    "Subtle variant provides a gentle glow that adds visual interest without being overwhelming, ideal for elegant content presentation.",
};

export const Silver = Template.bind({});
Silver.args = {
  variant: "silver",
  content:
    "Silver variant offers a metallic, sophisticated glow that works well in professional or modern design contexts.",
};

export const Steel = Template.bind({});
Steel.args = {
  variant: "steel",
  content:
    "Steel variant provides a cool, industrial glow effect that's perfect for technical or utilitarian design themes.",
};

export const Green = Template.bind({});
Green.args = {
  variant: "green",
  content:
    "Green variant cycles through vibrant, saturated greens for a fresh, energetic glow effect.",
};

const CustomTokensTemplate: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 40px; background-color: var(--slate-10);">
      <StorybookComponent
        :tag="args.tag"
        :variant="args.variant"
        :style="{
          '--glowing-border-width': args.borderWidth,
          '--glowing-border-radius': args.borderRadius,
          '--glowing-border-animation-duration': args.animationDuration,
        }"
      >
        <div style="padding: 20px; color: var(--slate-02);">
          <p style="margin: 0; line-height: 1.6;">{{ args.content }}</p>
        </div>
      </StorybookComponent>
    </div>
  `,
});

export const CustomTokens = CustomTokensTemplate.bind({});
CustomTokens.args = {
  variant: "vivid",
  content: "Border width, radius, and animation speed all driven by the controls above.",
  borderWidth: "6px",
  borderRadius: "4px",
  animationDuration: "5s",
};
