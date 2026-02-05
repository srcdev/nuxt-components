import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../GlowingBorder.vue";

// Custom interface for story args
interface GlowingBorderStoryArgs {
  variant: "vivid" | "subtle" | "silver" | "steel";
  content: string;
  showDisplayCard: boolean;
  displayCardVariant: "solid" | "subtle" | "soft" | "outline";
}

export default {
  title: "Components/Playground/GlowingBorder",
  component: StorybookComponent,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["vivid", "subtle", "silver", "steel"],
      description: "GlowingBorder visual variant",
      table: {
        category: "Appearance",
      },
    },
    content: {
      control: { type: "text" },
      description: "Content to display inside the glowing border",
      table: {
        category: "Content",
      },
    },
    showDisplayCard: {
      control: { type: "boolean" },
      description: "Show content wrapped in a DisplayCard component",
      table: {
        category: "Content",
      },
    },
    displayCardVariant: {
      control: { type: "select" },
      options: ["solid", "subtle", "soft", "outline"],
      description: "DisplayCard variant when showDisplayCard is true",
      table: {
        category: "Content",
      },
    },
    // Hide internal props
    styleClassPassthrough: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    variant: "vivid",
    content:
      "This is default slot content for the GlowingBorder component. As it's a slot, any HTML content can be placed here.",
    showDisplayCard: false,
    displayCardVariant: "solid",
  },
} as Meta<GlowingBorderStoryArgs>;

const Template: StoryFn<GlowingBorderStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 40px;">
      <StorybookComponent
        :variant="args.variant"
        :style-class-passthrough="['storybook-demo']"
      >
        <div v-if="!args.showDisplayCard" style="padding: 20px;">
          <h3 style="margin: 0 0 12px 0; font-size: 1.5rem; font-weight: 600;">GlowingBorder Header</h3>
          <h4 style="margin: 0 0 16px 0; font-size: 1.25rem; font-weight: 500;">GlowingBorder Content</h4>
          <p style="margin: 0 0 12px 0; line-height: 1.6;">{{ args.content }}</p>
          <p style="margin: 0; font-size: 0.875rem; color: var(--gray-9);">GlowingBorder Footer</p>
        </div>

        <!-- DisplayCard version -->
        <DisplayCard
          v-else
          :variant="args.displayCardVariant"
          :has-dividers="true"
          :no-outline="false"
        >
          <template #header>
            <h2 style="margin: 0; font-size: 1.5rem; font-weight: 600;">DisplayCard Header</h2>
          </template>
          <template #default>
            <h3 style="margin: 0 0 12px 0; font-size: 1.25rem; font-weight: 500;">DisplayCard Content</h3>
            <p style="margin: 0 0 12px 0; line-height: 1.6;">{{ args.content }}</p>
            <p style="margin: 0; line-height: 1.6;">This demonstrates how GlowingBorder can wrap other components.</p>
          </template>
          <template #footer>
            <p style="margin: 0; font-size: 0.875rem; color: var(--gray-9);">DisplayCard Footer</p>
          </template>
        </DisplayCard>
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

export const WithDisplayCard = Template.bind({});
WithDisplayCard.args = {
  variant: "vivid",
  content:
    "This example shows how GlowingBorder can enhance other components like DisplayCard, creating layered visual effects.",
  showDisplayCard: true,
  displayCardVariant: "solid",
};
