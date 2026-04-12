import ServicesSection from "../ServicesSection.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { Service } from "~/types/types.services";

const meta: Meta<typeof ServicesSection> = {
  title: "Organisms/Services/Services Section",
  component: ServicesSection,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "article", "main"],
      description: "HTML element rendered as the root",
    },
    headerTag: {
      control: { type: "select" },
      options: ["h1", "h2", "h3"],
      description: "Heading element used for the service title",
    },
    isSummary: {
      control: { type: "boolean" },
      description: "Summary mode — compact view with summary-link slot",
    },
    summaryAlignment: {
      control: { type: "select" },
      options: ["start", "center", "end"],
      description: "Vertical alignment of the info column in summary mode",
    },
    reverse: {
      control: { type: "boolean" },
      description: "Swap image and content columns",
    },
    durationIcon: {
      control: { type: "text" },
      description: "Icon name for the duration row (any Iconify icon)",
    },
    priceIcon: {
      control: { type: "text" },
      description: "Icon name for the price row (any Iconify icon)",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
    },
  },
  args: {
    tag: "section",
    headerTag: "h2",
    isSummary: false,
    summaryAlignment: "center",
    reverse: false,
    durationIcon: "mdi:clock-time-four-outline",
    priceIcon: "mdi:currency-gbp",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "Renders a single service as a two-column section: image on one side, detailed content on the other. Two modes: summary (compact, with navigation slot) and full (complete content with CTA slot). Icon names for the price/duration row are configurable via `durationIcon` and `priceIcon` props.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ServicesSection>;

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const sampleService: Service = {
  slug: "locs-installation",
  title: "Locs Installation",
  subtitle: "Start your loc journey",
  price: "£120",
  duration: "3–4 hours",
  image: "https://picsum.photos/seed/locs/800/600",
  shortDescription: "Professional loc installation tailored to your hair type.",
  longDescription:
    "Our loc installation service covers everything from initial consultation through to the finished style. We work with all hair types and lengths to create beautiful, long-lasting locs.",
  heroHeading: [
    { text: "Why choose ", styleClass: "normal" },
    { text: "locs?", styleClass: "accent" },
  ],
  whatIsIt:
    "Locs are a protective hairstyle formed by allowing hair to naturally matt and coil over time. They require minimal daily maintenance and are suitable for all hair types.",
  process: [
    "Consultation to assess hair type and length",
    "Scalp preparation and cleanse",
    "Sectioning and palm-rolling",
    "Drying and finishing",
  ],
  idealFor: [
    "Anyone looking for a low-maintenance protective style",
    "Those with natural hair wanting a permanent style",
    "People seeking a versatile long-term hairstyle",
  ],
  maintenance:
    "Re-twist every 4–6 weeks to maintain neat roots. Keep scalp moisturised and protect hair at night with a satin bonnet.",
  faqs: [
    {
      question: "How long do locs take to mature?",
      answer: "Locs typically take 12–18 months to fully mature depending on hair type and texture.",
    },
    {
      question: "Can I wash my locs?",
      answer: "Yes — regular washing is encouraged. We recommend a residue-free shampoo every 1–2 weeks.",
    },
  ],
  seoTitle: "Locs Installation | Professional Hair Locs Service",
  seoDescription:
    "Professional locs installation service. Book a consultation today and start your loc journey with an experienced stylist.",
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const FullMode: Story = {
  name: "Full Mode",
  render: (args) => ({
    components: { ServicesSection },
    setup() {
      return { args, sampleService };
    },
    template: `
      <ServicesSection v-bind="args" :service-data="sampleService">
        <template #cta>
          <button style="margin-top:1.6rem;padding:1.2rem 2.4rem;background:#333;color:#fff;border:none;border-radius:0.4rem;cursor:pointer;">
            Book Now
          </button>
        </template>
      </ServicesSection>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Full mode (isSummary: false) — renders all content including process, ideal-for, FAQs, and the CTA GlassPanel.",
      },
    },
  },
};

export const SummaryMode: Story = {
  name: "Summary Mode",
  args: {
    isSummary: true,
  },
  render: (args) => ({
    components: { ServicesSection },
    setup() {
      return { args, sampleService };
    },
    template: `
      <ServicesSection v-bind="args" :service-data="sampleService">
        <template #summary-link="{ serviceData }">
          <a :href="'/services/' + serviceData.slug" style="color:inherit;">
            More about {{ serviceData.title }} →
          </a>
        </template>
      </ServicesSection>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Summary mode — compact view with eyebrow, title, price/duration, whatIsIt, and summary-link slot.",
      },
    },
  },
};

export const Reversed: Story = {
  name: "Reversed Layout",
  args: {
    reverse: true,
  },
  render: (args) => ({
    components: { ServicesSection },
    setup() {
      return { args, sampleService };
    },
    template: `<ServicesSection v-bind="args" :service-data="sampleService" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: "Image on the right, content on the left — use on alternating items in a list.",
      },
    },
  },
};

export const CustomIcons: Story = {
  name: "Custom Icons",
  args: {
    durationIcon: "mdi:timer-outline",
    priceIcon: "mdi:currency-eur",
  },
  render: (args) => ({
    components: { ServicesSection },
    setup() {
      return { args, sampleService };
    },
    template: `<ServicesSection v-bind="args" :service-data="sampleService" />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Custom icon names passed via durationIcon and priceIcon props — useful when the consuming app uses a different currency or wants a different clock style.",
      },
    },
  },
};
