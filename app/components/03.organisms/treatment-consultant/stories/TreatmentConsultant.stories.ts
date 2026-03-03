import type { Meta, StoryObj } from "@nuxtjs/storybook";
import TreatmentConsultant from "../TreatmentConsultant.vue";

const meta: Meta<typeof TreatmentConsultant> = {
  title: "Organisms/TreatmentConsultant",
  component: TreatmentConsultant,
  argTypes: {
    autoAdvance: {
      control: "boolean",
      description: "Automatically advance to the next step after selection",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TreatmentConsultant>;

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    autoAdvance: true,
  },
  render: (args) => ({
    components: { TreatmentConsultant },
    setup() {
      return { args };
    },
    template: `
      <TreatmentConsultant v-bind="args" />
    `,
  }),
};
