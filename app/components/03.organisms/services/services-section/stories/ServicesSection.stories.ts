import ServicesSection from "../ServicesSection.vue";
import PageRow from "../../../../01.atoms/page-row/PageRow.vue";
import TextBlock from "../../../../01.atoms/text-block/TextBlock.vue";
import EyebrowText from "../../../../01.atoms/text-blocks/eyebrow-text/EyebrowText.vue";
import HeroText from "../../../../01.atoms/text-blocks/hero-text/HeroText.vue";
import InputButtonCore from "../../../../05.forms/input-button/InputButtonCore.vue";
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
    processHeading: {
      control: { type: "text" },
      description: "Heading text for the process section",
    },
    idealForHeading: {
      control: { type: "text" },
      description: "Heading text for the ideal-for section",
    },
    maintenanceHeading: {
      control: { type: "text" },
      description: "Heading text for the maintenance/aftercare section",
    },
    faqsHeading: {
      control: { type: "text" },
      description: "Heading text for the FAQs section",
    },
    ctaHeading: {
      control: { type: "text" },
      description: "Heading text inside the default CTA glass panel — ignored if the cta-panel slot is used",
    },
    ctaBody: {
      control: { type: "text" },
      description: "Body text inside the default CTA glass panel — ignored if the cta-panel slot is used",
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
          "Renders a single service as a two-column section: image on one side, detailed content on the other. Two modes: summary (compact, with navigation slot) and full (complete content with CTA slot). Icon names for the price/duration row are configurable via `durationIcon` and `priceIcon` props. Section headings and the CTA panel copy are configurable via props (`processHeading`, `idealForHeading`, `maintenanceHeading`, `faqsHeading`, `ctaHeading`, `ctaBody`); the whole CTA panel can be replaced with the `cta-panel` scoped slot.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ServicesSection>;

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const sampleService: Service = {
  slug: "colour",
  category: "colour",
  title: "Full Colour",
  subtitle: "Rich, even colour from root to tip",
  price: "From £75",
  duration: "1.5–2.5 hours",
  image: "https://picsum.photos/seed/colour/800/600",
  shortDescription: "Full colour coverage in permanent, semi-permanent, or demi-permanent formulas.",
  longDescription:
    "Full colour service covering the entire head in a single, even shade — whether you're covering grey, going darker for the season, or refreshing your natural colour. We work with permanent, semi-permanent, and demi-permanent formulas depending on the level of commitment and colour result you're after.",
  heroHeading: [
    { text: "Full colour vs. ", styleClass: "normal" },
    { text: "highlights?", styleClass: "accent" },
  ],
  whatIsIt:
    "Full colour applies a single, even shade across the entire head, unlike highlights or balayage which lighten select sections. It's the go-to choice for full grey coverage, a complete colour change, or a rich, uniform base tone.",
  process: [
    "Consultation and shade selection",
    "Strand test for new clients",
    "Even application, root to tip",
    "Processing time — 25–45 minutes depending on the formula",
    "Rinse and conditioning treatment",
    "Blow-dry and finish",
  ],
  idealFor: [
    "Full grey coverage",
    "Going darker for the season",
    "Fashion colours needing a uniform base",
    "Root touch-ups between full appointments",
  ],
  maintenance:
    "Root regrowth typically becomes visible after 4–6 weeks. Book a maintenance appointment around this point, and use a colour-safe shampoo and conditioner to protect vibrancy between visits.",
  faqs: [
    {
      question: "What's the difference between permanent and semi-permanent colour?",
      answer:
        "Permanent colour lifts and deposits pigment for long-lasting, fade-resistant results. Semi-permanent colour sits on the hair's surface and gradually washes out over 4–8 weeks — a lower-commitment option if you're not sure about a change.",
    },
    {
      question: "Can full colour lighten my hair significantly?",
      answer:
        "Full colour can lighten by a few shades, but for a dramatic lift (going several shades lighter) a lightening service or highlights are usually a better fit — we'll advise at consultation.",
    },
    {
      question: "How effective is full colour at covering grey?",
      answer:
        "Very effective — permanent colour gives the most complete, long-lasting grey coverage. We'll match a shade that blends naturally with your regrowth pattern.",
    },
  ],
  seoTitle: "Full Colour | Luxury Locs by Natasha",
  seoDescription:
    "Full colour hair service — permanent, semi-permanent, and demi-permanent options for grey coverage, seasonal colour changes, and fashion shades. Mobile service across Bath.",
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const FullMode: Story = {
  name: "Full Mode",
  args: {
    ctaHeading: "Ready to book your appointment?",
    ctaBody: "Mobile service across Bath — I come to you.",
  },
  render: (args) => ({
    components: { ServicesSection, InputButtonCore },
    setup() {
      return { args, sampleService };
    },
    template: `
      <ServicesSection v-bind="args" :service-data="sampleService">
        <template #cta>
          <InputButtonCore tag="a" href="/contact" button-text="Book now" variant="primary" />
        </template>
      </ServicesSection>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Full mode (isSummary: false) — renders all content including a six-step process, ideal-for list, FAQs, and the CTA panel, matching the real service detail page content shape.",
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

export const CustomTextAndCta: Story = {
  name: "Custom Headings & CTA Copy",
  args: {
    processHeading: "How It Works",
    idealForHeading: "Who Is This For",
    maintenanceHeading: "Aftercare",
    faqsHeading: "FAQs",
    ctaHeading: "Ready to book your colour appointment?",
    ctaBody: "Mobile service across Bath — I come to you.",
  },
  render: (args) => ({
    components: { ServicesSection, InputButtonCore },
    setup() {
      return { args, sampleService };
    },
    template: `
      <ServicesSection v-bind="args" :service-data="sampleService">
        <template #cta>
          <InputButtonCore tag="a" href="/contact" button-text="Book now" variant="primary" />
        </template>
      </ServicesSection>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Section headings and CTA panel copy overridden via props — useful for wording specific to the consuming business rather than the library defaults. Note the heading names the actual service, avoiding the old bug where every service page said 'highlights appointment' regardless of which service it was.",
      },
    },
  },
};

export const RealisticPageContext: Story = {
  name: "Realistic Page Context",
  args: {
    ctaHeading: "Ready to book your appointment?",
    ctaBody: "Mobile service across Bath — I come to you.",
  },
  render: (args) => ({
    components: { ServicesSection, PageRow, TextBlock, EyebrowText, HeroText, InputButtonCore },
    setup() {
      return { args, sampleService };
    },
    template: `
      <div>
        <PageRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <TextBlock tag="div" :style-class-passthrough="['page-lead']">
            <EyebrowText font-size="large" text-content="Services" />
            <HeroText
              tag="h1"
              axis="vertical"
              font-size="display"
              :text-content="[
                { text: 'Expert colour & ', styleClass: 'normal' },
                { text: 'styling', styleClass: 'accent' },
                { text: 'at your door', styleClass: 'normal' },
              ]"
              :style-class-passthrough="['mb-20']"
            />
          </TextBlock>
        </PageRow>

        <PageRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <ServicesSection v-bind="args" :service-data="sampleService">
            <template #cta>
              <InputButtonCore tag="a" href="/contact" button-text="Book now" variant="primary" />
            </template>
          </ServicesSection>
        </PageRow>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Matches the real service detail page (app/pages/services/[slug].vue in the luxury-locs-by-natasha-nuxt3 project): a page hero (EyebrowText + HeroText inside PageRow/TextBlock) followed by ServicesSection with a real 'Book now' CTA button. Use this story to sanity-check layout and spacing changes against the actual consuming page rather than the bare component.",
      },
    },
  },
};

export const CustomCtaPanel: Story = {
  name: "Custom CTA Panel (slot override)",
  render: (args) => ({
    components: { ServicesSection },
    setup() {
      return { args, sampleService };
    },
    template: `
      <ServicesSection v-bind="args" :service-data="sampleService">
        <template #cta-panel="{ serviceData }">
          <div style="padding:2.4rem;border:2px dashed #333;border-radius:1rem;text-align:center;">
            <p style="margin:0 0 1.2rem;">Fully custom CTA block for {{ serviceData.title }} — not a GlassPanel at all.</p>
            <button style="padding:1.2rem 2.4rem;background:#333;color:#fff;border:none;border-radius:0.4rem;cursor:pointer;">
              Enquire Now
            </button>
          </div>
        </template>
      </ServicesSection>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The cta-panel scoped slot replaces the default GlassPanel entirely — use when a consumer needs a different component or layout for the closing call-to-action, not just different copy.",
      },
    },
  },
};
