import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../DisplayCard.vue";

interface DisplayCardArgs {
  tag: "div" | "section" | "article" | "aside" | "main" | "nav";
  variant: "solid" | "subtle" | "soft" | "outline";
  hasDividers: boolean;
  noOutline: boolean;
  styleClassPassthrough: string[];
}

export default {
  title: "Atoms/Display Card/Display Card Dynamic",
  component: StorybookComponent,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "article", "aside", "main", "nav"],
      description: "HTML tag to render",
      table: { category: "Semantic" },
    },
    variant: {
      control: { type: "select" },
      options: ["solid", "subtle", "soft", "outline"],
      description: "Visual style variant",
      table: { category: "Appearance" },
    },
    hasDividers: {
      control: { type: "boolean" },
      description: "Add dividers between slot sections",
      table: { category: "Appearance" },
    },
    noOutline: {
      control: { type: "boolean" },
      description: "Remove border outline",
      table: { category: "Appearance" },
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
  },
  args: {
    tag: "div",
    variant: "solid",
    hasDividers: false,
    noOutline: false,
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "A dynamic display card that renders whatever named slots are provided. Any number of slots can be passed and each is wrapped in its own div.",
      },
    },
  },
} as Meta<DisplayCardArgs>;

const Template: StoryFn<DisplayCardArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 40px; max-width: 480px;">
      <StorybookComponent
        :tag="args.tag"
        :variant="args.variant"
        :has-dividers="args.hasDividers"
        :no-outline="args.noOutline"
        :style-class-passthrough="args.styleClassPassthrough"
      >
        <template #header>
          <div style="padding: 1.6rem; border-bottom: 1px solid transparent;">
            <p style="margin: 0; font-size: 1.2rem; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.6;">Category</p>
            <h2 style="margin: 0.4rem 0 0; font-size: 2rem; font-weight: 600;">Card Title</h2>
          </div>
        </template>
        <template #media>
          <div style="aspect-ratio: 16/9; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.4rem;">
            Media Slot
          </div>
        </template>
        <template #body>
          <div style="padding: 1.6rem;">
            <p style="margin: 0; line-height: 1.6; opacity: 0.8;">
              This is the body content. It can contain any markup — paragraphs, lists, or other components.
            </p>
          </div>
        </template>
        <template #footer>
          <div style="padding: 1.2rem 1.6rem; display: flex; gap: 0.8rem; justify-content: flex-end;">
            <button style="padding: 0.8rem 1.6rem; border-radius: 0.4rem; border: 1px solid currentColor; background: transparent; cursor: pointer; opacity: 0.7;">Cancel</button>
            <button style="padding: 0.8rem 1.6rem; border-radius: 0.4rem; border: none; background: #667eea; color: white; cursor: pointer;">Confirm</button>
          </div>
        </template>
      </StorybookComponent>
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {};

export const Subtle = Template.bind({});
Subtle.args = { variant: "subtle" };

export const Soft = Template.bind({});
Soft.args = { variant: "soft" };

export const Outline = Template.bind({});
Outline.args = { variant: "outline" };

export const WithDividers = Template.bind({});
WithDividers.args = { hasDividers: true };
WithDividers.parameters = {
  docs: {
    description: {
      story: "Adds visual dividers between each slot section.",
    },
  },
};

export const NoOutline = Template.bind({});
NoOutline.args = { noOutline: true };
NoOutline.parameters = {
  docs: {
    description: {
      story: "Card without a border or box shadow.",
    },
  },
};
