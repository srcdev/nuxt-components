import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../GlowingBorder.vue";

// Custom interface for story args
interface GlowingBorderStoryArgs {
  variant: "vivid" | "subtle" | "silver" | "steel";
  content: string;
  showCardCore: boolean;
  cardCoreVariant: "solid" | "subtle" | "soft" | "outline";
}

export default {
  title: "Components/Effects/GlowingBorder",
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
    showCardCore: {
      control: { type: "boolean" },
      description: "Show content wrapped in a CardCore component",
      table: {
        category: "Content",
      },
    },
    cardCoreVariant: {
      control: { type: "select" },
      options: ["solid", "subtle", "soft", "outline"],
      description: "CardCore variant when showCardCore is true",
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
    showCardCore: false,
    cardCoreVariant: "solid",
  },
} as Meta<GlowingBorderStoryArgs>;

const Template: StoryFn<GlowingBorderStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 40px; background-color: var(--slate-10);">
      <StorybookComponent
        :variant="args.variant"
        :style-class-passthrough="['storybook-demo']"
      >
        <div v-if="!args.showCardCore" style="padding: 20px; color: var(--slate-02);">
          <h3 style="margin: 0 0 12px 0; font-size: 1.5rem; font-weight: 600;">GlowingBorder Header</h3>
          <h4 style="margin: 0 0 16px 0; font-size: 1.25rem; font-weight: 500;">GlowingBorder Content</h4>
          <p style="margin: 0 0 12px 0; line-height: 1.6;">{{ args.content }}</p>
          <p style="margin: 0; font-size: 0.875rem; color: var(--slate-09);">GlowingBorder Footer</p>
        </div>

        <!-- CardCore version -->
        <CardCore
          v-else
          :variant="args.cardCoreVariant"
          :has-dividers="true"
          :no-outline="false"
        >
          <template #header>
            <h2 style="margin: 0; font-size: 1.5rem; font-weight: 600;">CardCore Header</h2>
          </template>
          <template #default>
            <h3 style="margin: 0 0 12px 0; font-size: 1.25rem; font-weight: 500; color: var(--slate-02);">CardCore Content</h3>
            <p style="margin: 0 0 12px 0; line-height: 1.6; color: var(--slate-02);">{{ args.content }}</p>
            <p style="margin: 0; line-height: 1.6; color: var(--slate-02);">This demonstrates how GlowingBorder can wrap other components.</p>
          </template>
          <template #footer>
            <p style="margin: 0; font-size: 0.875rem; color: var(--slate-02);">CardCore Footer</p>
          </template>
        </CardCore>
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

export const WithCardCore = Template.bind({});
WithCardCore.args = {
  variant: "vivid",
  content:
    "This example shows how GlowingBorder can enhance other components like CardCore, creating layered visual effects.",
  showCardCore: true,
  cardCoreVariant: "solid",
};
