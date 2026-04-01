import PageHeroHighlights from "../PageHeroHighlights.vue";
import PageHeroHighlightsHeader from "../PageHeroHighlightsHeader.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

type StoryArgs = {
  styleClassPassthrough?: string | string[];
};

const meta: Meta<StoryArgs> = {
  title: "Templates/PageHeroHighlightsHeader",
  component: PageHeroHighlightsHeader,
  argTypes: {
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
    },
  },
  args: {
    styleClassPassthrough: [],
  },
};

export default meta;
type Story = StoryObj<typeof PageHeroHighlightsHeader>;

/** Default — start slot only, fills full width. */
export const Default: Story = {
  render: (args: StoryArgs) => ({
    components: { PageHeroHighlights, PageHeroHighlightsHeader },
    setup() {
      return { args };
    },
    template: `
      <PageHeroHighlights tag="section" style="--header-row-background-colour: #2d4a35;">
        <template #header>
          <PageHeroHighlightsHeader v-bind="args">
            <template #start>
              <p class="page-heading-1" style="color: white;">Surplus needs</p>
              <p class="page-body-normal" style="color: white;">Let us know what you need help with so we can advertise your charity to our donor network.</p>
            </template>
          </PageHeroHighlightsHeader>
        </template>
      </PageHeroHighlights>
    `,
  }),
};

/** With actions — start slot for title/description, end slot for action buttons. */
export const WithActions: Story = {
  name: "With Actions",
  render: (args: StoryArgs) => ({
    components: { PageHeroHighlights, PageHeroHighlightsHeader },
    setup() {
      return { args };
    },
    template: `
      <PageHeroHighlights tag="section" style="--header-row-background-colour: #2d4a35;">
        <template #header>
          <PageHeroHighlightsHeader v-bind="args">
            <template #start>
              <p class="page-heading-1" style="color: white;">Surplus needs</p>
              <p class="page-body-normal" style="color: white;">Let us know what you need help with so we can advertise your charity to our donor network.</p>
            </template>
            <template #end>
              <button style="border: 2px solid white; color: white; background: transparent; border-radius: 50%; width: 4rem; height: 4rem; cursor: pointer;">?</button>
              <button style="border: 2px solid white; color: white; background: transparent; border-radius: 0.8rem; padding: 1rem 1.6rem; cursor: pointer;">Create new need</button>
            </template>
          </PageHeroHighlightsHeader>
        </template>
      </PageHeroHighlights>
    `,
  }),
};
