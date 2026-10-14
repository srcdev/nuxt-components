import { computed, ref } from "vue";
import PricingCard from "../PricingCard.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { MediaCanvas } from "~/types/components";

type LineClamp = "none" | "1" | "2" | "3" | "4";

// Story-only args: drive CSS tokens, not PricingCard props. See the argTypes entries.
type StoryArgs = InstanceType<typeof PricingCard>["$props"] & {
  nameLineClamp: LineClamp;
  descriptionLineClamp: LineClamp;
  featureLineClamp: LineClamp;
};

const lineClampControl = (token: string, example: string) => ({
  control: "select" as const,
  options: ["none", "1", "2", "3", "4"] satisfies LineClamp[],
  description:
    `**Story control, not a prop.** Sets the \`${token}\` CSS token on a wrapper so you can try it here. ` +
    `To use it in an app, set the token in your own CSS, e.g. \`${example}\`. ` +
    "`1` is single-line ellipsis, `none` (the default) shows everything.",
  table: { category: "CSS tokens (story only, set in your CSS)", defaultValue: { summary: "none" } },
});

const meta: Meta<StoryArgs> = {
  title: "Molecules/Pricing Card",
  component: PricingCard,
  argTypes: {
    nameLineClamp: lineClampControl("--pricing-card-name-line-clamp", ".pricing-page { --pricing-card-name-line-clamp: 1; }"),
    descriptionLineClamp: lineClampControl(
      "--pricing-card-description-line-clamp",
      ".pricing-page { --pricing-card-description-line-clamp: 2; }"
    ),
    featureLineClamp: lineClampControl(
      "--pricing-card-feature-line-clamp",
      ".pricing-page { --pricing-card-feature-line-clamp: 1; }"
    ),
    tag: { control: "select", options: ["div", "section", "article"], table: { category: "Semantics" } },
    headingTag: {
      control: "select",
      options: ["h2", "h3", "h4", "h5", "h6"],
      description: "Heading level for the plan name; pick to fit the surrounding page outline",
      table: { category: "Semantics", defaultValue: { summary: "h3" } },
    },
    planName: { control: "text", table: { category: "Content" } },
    price: { control: "number", table: { category: "Content" } },
    currencySymbol: { control: "text", table: { category: "Content" } },
    billingPeriod: { control: "text", table: { category: "Content" } },
    description: { control: "text", table: { category: "Content" } },
    features: { control: "object", table: { category: "Content" } },
    isHighlighted: { control: "boolean", table: { category: "Highlight" } },
    badgeText: { control: "text", table: { category: "Highlight" } },
    ribbonText: { control: "text", table: { category: "Highlight" } },
    ctaText: { control: "text", table: { category: "CTA" } },
    ctaDisabled: { control: "boolean", table: { category: "CTA" } },
    styleClassPassthrough: { control: "object", table: { category: "Styling" } },
  },
  args: {
    nameLineClamp: "none",
    descriptionLineClamp: "none",
    featureLineClamp: "none",
    tag: "article",
    headingTag: "h3",
    planName: "Single Site",
    price: 99,
    currencySymbol: "£",
    billingPeriod: "one-time",
    description: "Perfect for freelancers and solo practitioners.",
    features: ["Embed on one domain", "Unlimited consultations", "Email support", "Monthly updates"],
    isHighlighted: false,
    badgeText: "Most Popular",
    ctaText: "Get started",
    ctaDisabled: false,
    ribbonText: undefined,
  },
  decorators: [
    (story, context) => ({
      components: { story, CanvasSwitcher },
      setup() {
        const canvasName = ref<MediaCanvas>(context.parameters.initialCanvas ?? "fullWidthCanvas");
        return { canvasName };
      },
      template: `
        <div style="padding: 1.2rem 1.6rem; border-block-end: 1px solid currentColor;">
          <CanvasSwitcher v-model:canvas-name="canvasName" />
        </div>
        <div :class="canvasName" style="margin-inline: auto; padding: 3.2rem 2rem; outline: 1px dashed currentColor;">
          <story />
        </div>
      `,
    }),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A pricing plan card showing plan name, price, features and a CTA button. " +
          "`is-highlighted` adds a top-centred badge and a scaled, emphasised border. " +
          "`ribbon-text` renders a diagonal corner ribbon for marketing callouts like a discount; leave it unset for no ribbon. " +
          "Emits `select` with the plan name when the CTA is clicked; replace the button entirely with the `#cta` slot. " +
          "Put several cards in a grid to build a comparison table.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

function useStorySetup(args: StoryArgs) {
  const componentArgs = computed(() => {
    const {
      nameLineClamp: _nameLineClamp,
      descriptionLineClamp: _descriptionLineClamp,
      featureLineClamp: _featureLineClamp,
      ...rest
    } = args;
    return rest;
  });
  const tokenStyles = computed(() => ({
    "--pricing-card-name-line-clamp": args.nameLineClamp,
    "--pricing-card-description-line-clamp": args.descriptionLineClamp,
    "--pricing-card-feature-line-clamp": args.featureLineClamp,
  }));
  const handleSelect = (planName: string) => {
    console.log(`Selected plan: ${planName}`);
  };
  return { componentArgs, tokenStyles, handleSelect };
}

const render = (args: StoryArgs) => ({
  components: { PricingCard },
  setup() {
    return useStorySetup(args);
  },
  template: `
    <div :style="tokenStyles" style="max-inline-size: 36rem;">
      <PricingCard v-bind="componentArgs" @select="handleSelect" />
    </div>
  `,
});

export const Default: Story = { render };

export const Highlighted: Story = {
  args: {
    planName: "Agency",
    price: 299,
    description: "Best for growing teams managing multiple sites.",
    features: ["Embed on up to 3 domains", "Unlimited consultations", "Priority email support", "Weekly updates"],
    isHighlighted: true,
  },
  render,
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
  render,
};

export const WithDiscountRibbon: Story = {
  args: {
    planName: "Annual",
    price: 49,
    billingPeriod: "per year",
    description: "Early adopter pricing on the annual plan.",
    features: ["Embed on one domain", "Unlimited consultations", "Email support", "Priced annually"],
    ribbonText: "EARLYBIRD50 · 50% off",
  },
  render,
};

const comparisonPlans = [
  {
    planName: "Single Site",
    price: 99,
    description: "Perfect for freelancers and solo practitioners.",
    features: ["Embed on one domain", "Unlimited consultations", "Email support", "Monthly updates"],
  },
  {
    planName: "Agency",
    price: 299,
    description: "Best for growing teams managing multiple sites.",
    features: ["Embed on up to 3 domains", "Unlimited consultations", "Priority email support", "Weekly updates"],
    isHighlighted: true,
  },
  {
    planName: "Unlimited",
    price: 799,
    description: "Enterprise plan for unlimited growth.",
    features: ["Unlimited domains", "Unlimited consultations", "24/7 priority support", "Real-time updates", "Custom integrations"],
  },
];

export const ThreeCardComparison: Story = {
  name: "Three Card Comparison",
  render: (args) => ({
    components: { PricingCard },
    setup() {
      return { ...useStorySetup(args), comparisonPlans };
    },
    template: `
      <div
        :style="tokenStyles"
        style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 26rem), 1fr)); gap: 2.4rem; align-items: stretch;"
      >
        <PricingCard
          v-for="plan in comparisonPlans"
          :key="plan.planName"
          v-bind="plan"
          currency-symbol="£"
          @select="handleSelect"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Cards in an auto-fit grid. On a narrow canvas they stack; set `--pricing-card-highlight-scale: 1` there " +
          "if the scaled highlighted card shouldn't overhang the column.",
      },
    },
  },
};

// ─── Stress test ──────────────────────────────────────────────────────────────

const unbroken = "Superkalifragilistischexpialigetischesunbegrenztespaket";
const longGerman =
  "Unbegrenzter Zugang zu allen Beratungsfunktionen einschließlich Prioritätsunterstützung und vierteljährlicher Strategiegespräche";

const stressCards: InstanceType<typeof PricingCard>["$props"][] = [
  {
    planName: `${unbroken}${unbroken}`,
    price: 123456789012.345,
    currencySymbol: "CHF ",
    billingPeriod: "pro Monat, jährliche Abrechnung, zuzüglich Mehrwertsteuer",
    description: `${longGerman}. ${longGerman}.`,
    features: [
      longGerman,
      "https://example.com/a/very/long/path/that/never/breaks/segmentsegmentsegmentsegment",
      "💇‍♀️💅🏽 Emoji first",
      "<script>alert('xss')</script> renders as text",
      "",
      "X",
    ],
    isHighlighted: true,
    badgeText: "Am beliebtesten bei Teams mit mehreren Standorten",
    ribbonText: `${unbroken} 50% Rabatt`,
    ctaText: "Jetzt mit dem unbegrenzten Paket beginnen und sparen",
  },
  {
    planName: "X",
    price: 0,
    billingPeriod: "",
    description: "",
    features: [],
    ctaText: "",
  },
  {
    planName: "خطة الأعمال",
    price: -9.5,
    currencySymbol: "",
    billingPeriod: "شهريا",
    description: "<b>Not bold</b> &amp; HTML-like text",
    features: Array.from({ length: 20 }, (_, i) => `Feature ${i + 1}`),
    ribbonText: "!",
    ctaDisabled: true,
  },
];

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  render: (args) => ({
    components: { PricingCard },
    setup() {
      const { tokenStyles, handleSelect } = useStorySetup(args);
      return { tokenStyles, handleSelect, stressCards };
    },
    template: `
      <div
        :style="tokenStyles"
        style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 26rem), 1fr)); gap: 3.2rem; align-items: start;"
      >
        <PricingCard
          v-for="(card, index) in stressCards"
          :key="index"
          v-bind="card"
          :dir="index === 2 ? 'rtl' : undefined"
          @select="handleSelect"
        />
      </div>
    `,
  }),
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "Worst-case data, checked at every canvas width. Card 1: unbroken plan name, a 12-digit fractional price, " +
          "long German copy in every text prop, a long badge, an unbroken ribbon and a URL feature. Card 2: one-character " +
          "name, zero price, and every optional field empty. Card 3: right-to-left text, negative fractional price, no " +
          "currency symbol, HTML-like copy (renders as text) and 20 features. Nothing should overflow the card, the badge " +
          "should stay centred on the top border, the ribbon caps at two lines and the plan name keeps clear of it. " +
          "Try the line-clamp controls (CSS tokens, story only) to shorten the name, description and features.",
      },
    },
  },
};
