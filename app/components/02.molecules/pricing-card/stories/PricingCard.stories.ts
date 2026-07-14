import type { Meta, StoryObj } from "@nuxtjs/storybook";
import PricingCard from "../PricingCard.vue";

const meta: Meta<typeof PricingCard> = {
  title: "Molecules/Pricing Card",
  component: PricingCard,
  tags: ["autodocs"],
  argTypes: {
    planName: { control: "text" },
    price: { control: "number" },
    billingPeriod: { control: "text" },
    description: { control: "text" },
    isHighlighted: { control: "boolean" },
    ctaText: { control: "text" },
    ctaDisabled: { control: "boolean" },
  },
  args: {
    planName: "Single Site",
    price: 99,
    billingPeriod: "one-time",
    description: "Perfect for freelancers and solo practitioners.",
    features: ["Embed on one domain", "Unlimited consultations", "Email support", "Monthly updates"],
    isHighlighted: false,
    ctaText: "Get started",
    ctaDisabled: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          "A SaaS pricing plan card displaying plan name, price, features, and a CTA button. " +
          "Supports a 'Most Popular' highlight state with scaled/emphasized styling. " +
          "Emits a `select` event when the CTA button is clicked. " +
          "Use multiple cards in a grid layout to build a pricing comparison table.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const storyWrapper = (args: Record<string, unknown>, handleSelect: (planName: string) => void) => ({
  components: { PricingCard },
  setup() {
    return { args, handleSelect };
  },
  template: `
    <div style="padding: 2rem; background: #f5f5f5; border-radius: 0.5rem;">
      <PricingCard v-bind="args" @select="handleSelect" />
    </div>
  `,
});

export const Default: Story = {
  render: (args) => {
    const handleSelect = (planName: string) => {
      console.log(`Selected plan: ${planName}`);
    };
    return storyWrapper(args, handleSelect);
  },
};

export const Highlighted: Story = {
  args: {
    planName: "Agency",
    price: 299,
    description: "Best for growing teams managing multiple sites.",
    features: ["Embed on up to 3 domains", "Unlimited consultations", "Priority email support", "Weekly updates"],
    isHighlighted: true,
  },
  render: (args) => {
    const handleSelect = (planName: string) => {
      console.log(`Selected plan: ${planName}`);
    };
    return storyWrapper(args, handleSelect);
  },
};

export const Unlimited: Story = {
  args: {
    planName: "Unlimited",
    price: 799,
    description: "Enterprise plan for unlimited growth.",
    features: [
      "Unlimited domains",
      "Unlimited consultations",
      "24/7 priority support",
      "Real-time updates",
      "Custom integrations",
    ],
    isHighlighted: false,
  },
  render: (args) => {
    const handleSelect = (planName: string) => {
      console.log(`Selected plan: ${planName}`);
    };
    return storyWrapper(args, handleSelect);
  },
};

export const Disabled: Story = {
  args: {
    planName: "Coming Soon",
    price: 199,
    description: "New plan launching soon.",
    features: ["Feature 1", "Feature 2", "Feature 3"],
    ctaDisabled: true,
    ctaText: "Coming soon",
  },
  render: (args) => {
    const handleSelect = (planName: string) => {
      console.log(`Selected plan: ${planName}`);
    };
    return storyWrapper(args, handleSelect);
  },
};

export const ThreeCardComparison: Story = {
  render: () => ({
    components: { PricingCard },
    setup() {
      const handleSelect = (planName: string) => {
        console.log(`Selected plan: ${planName}`);
      };
      return { handleSelect };
    },
    template: `
      <div style="padding: 2rem; background: #f5f5f5; border-radius: 0.5rem;">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;">
          <PricingCard
            planName="Single Site"
            :price="99"
            billingPeriod="one-time"
            description="Perfect for freelancers and solo practitioners."
            :features="['Embed on one domain', 'Unlimited consultations', 'Email support', 'Monthly updates']"
            @select="handleSelect"
          />
          <PricingCard
            planName="Agency"
            :price="299"
            billingPeriod="one-time"
            description="Best for growing teams managing multiple sites."
            :features="['Embed on up to 3 domains', 'Unlimited consultations', 'Priority email support', 'Weekly updates']"
            :isHighlighted="true"
            @select="handleSelect"
          />
          <PricingCard
            planName="Unlimited"
            :price="799"
            billingPeriod="one-time"
            description="Enterprise plan for unlimited growth."
            :features="['Unlimited domains', 'Unlimited consultations', '24/7 priority support', 'Real-time updates', 'Custom integrations']"
            @select="handleSelect"
          />
        </div>
      </div>
    `,
  }),
};
