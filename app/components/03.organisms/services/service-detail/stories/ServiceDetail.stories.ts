import ServiceDetail from "../ServiceDetail.vue";
import InputButtonCore from "../../../../05.forms/input-button/InputButtonCore.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { Service } from "~/types/types.services";

const meta: Meta<typeof ServiceDetail> = {
  title: "Organisms/Services/Service Detail",
  component: ServiceDetail,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "article", "main"],
      description: "HTML element rendered as the root",
    },
    headerTag: {
      control: { type: "select" },
      options: ["h1", "h2", "h3"],
      description: "Heading element used for the service title in the hero banner",
    },
    subheadingTag: {
      control: { type: "select" },
      options: ["h2", "h3"],
      description: "Heading element used for every section subheading below the hero",
    },
    breadcrumbItems: {
      control: "object",
      description:
        "Items for the Breadcrumb atom. Defaults to a plain (non-linked) [category, title] trail built from serviceData when omitted",
    },
    heroImageVariant: {
      control: { type: "select" },
      options: ["full", "popout", "content", "inset-content"],
      description: "PageRow variant applied to the hero image layer",
    },
    heroContentVariant: {
      control: { type: "select" },
      options: ["full", "popout", "content", "inset-content"],
      description: "PageRow variant applied to the hero content layer (breadcrumb/title/pills over the image)",
    },
    bodyVariant: {
      control: { type: "select" },
      options: ["full", "popout", "content", "inset-content"],
      description: "PageRow variant applied to the two-column body (main content + sidebar)",
    },
    finalCtaVariant: {
      control: { type: "select" },
      options: ["full", "popout", "content", "inset-content"],
      description: "PageRow variant applied to the closing full-width CTA banner",
    },
    processHeading: { control: "text", description: "Heading text for the process section" },
    idealForHeading: { control: "text", description: "Heading text for the ideal-for section" },
    maintenanceHeading: { control: "text", description: "Heading text for the maintenance/aftercare section" },
    faqsHeading: { control: "text", description: "Heading text for the FAQs section" },
    bookingHeading: { control: "text", description: "Label above the sidebar booking card" },
    priceLabel: { control: "text", description: "Row label for the price in the sidebar booking card" },
    durationLabel: { control: "text", description: "Row label for the duration in the sidebar booking card" },
    locationLabel: { control: "text", description: "Row label for the location in the sidebar booking card" },
    location: { control: "text", description: "Location text — the row is hidden entirely when omitted" },
    relatedServicesHeading: { control: "text", description: "Heading above the 'You may also like' list" },
    relatedServices: { control: "object", description: "Services rendered in the 'You may also like' sidebar list" },
    finalCtaHeading: { control: "text", description: "Heading in the closing full-width CTA banner" },
    finalCtaBody: { control: "text", description: "Body text in the closing full-width CTA banner" },
    styleClassPassthrough: { control: "object", description: "Additional CSS classes applied to the root element" },
  },
  args: {
    tag: "article",
    headerTag: "h1",
    subheadingTag: "h2",
    heroImageVariant: "full",
    heroContentVariant: "content",
    bodyVariant: "content",
    finalCtaVariant: "content",
    styleClassPassthrough: [],
  },
  parameters: {
    backgrounds: {
      default: "storybook-canvas",
      options: {
        "storybook-canvas": { name: "Canvas", value: "oklch(0.163 0.005 17)" },
      },
    },
    docs: {
      description: {
        component:
          "Renders a full service detail page: a full-bleed hero banner (breadcrumb, eyebrow, title, price/duration pills over the service image), a two-column body (long-form content plus a sticky sidebar booking card and related-services list), and a closing full-width CTA banner. Routing (breadcrumb links, book-cta, related-service links, final-cta) is delegated to the consumer via slots, same pattern as ServiceSummary.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ServiceDetail>;

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const balayage: Service = {
  slug: "balayage",
  category: "Colour",
  title: "Balayage",
  subtitle: "Freehand colour artistry",
  price: "From £95",
  duration: "2.5 - 3.5 hours",
  image: "https://picsum.photos/seed/balayage/1600/900",
  shortDescription: "Freehand hand-painted colour for a soft, sun-kissed finish.",
  longDescription:
    "Balayage is a freehand hair colouring technique that creates a soft, natural-looking gradient of lightness through the hair. Unlike traditional highlights, balayage is painted on by hand without foils, allowing for a more blended and sun-kissed finish. It's perfect for those who want a low-maintenance style with depth and movement, as the regrowth line is less noticeable.",
  heroHeading: [{ text: "What is Balayage?", styleClass: "normal" }],
  whatIsIt:
    "The word 'balayage' comes from the French word meaning 'to sweep'. During the technique, colour is literally swept onto sections of hair by hand using a brush or paddle. This freehand approach means no two balayage results are ever identical — each is bespoke to your hair's natural fall, texture, and the placement that best frames your face.",
  process: [
    "We discuss your desired look, assess your natural colour and hair condition, and plan placement.",
    "Your hair is divided into panels based on where the lightness will have the most impact.",
    "Lightener is hand-painted onto the surface of each section, concentrating colour towards the ends for that graduated effect.",
    "The lightener develops (typically 30-45 minutes) with or without wrapping, depending on the desired intensity.",
    "Once lifted, a toner is applied to achieve the perfect shade: warm caramel, cool ash, honey blonde, or anything in between.",
    "A professional finish so you can see the full dimension and movement of your new colour.",
  ],
  idealFor: [
    "First-time colour clients who want a natural-looking result",
    "Anyone wanting low-maintenance colour that grows out gracefully",
    "Adding depth and dimension to flat or single-tone hair",
    "Creating a sun-kissed, lived-in look year-round",
  ],
  maintenance:
    "One of the biggest advantages of balayage is its low maintenance. Because the colour is graduated rather than starting at the root, regrowth is soft and natural. Most clients return every 12-16 weeks for a refresh, though some go even longer. Using colour-safe shampoo and a weekly hair mask will keep your balayage looking vibrant between appointments.",
  faqs: [
    {
      question: "Will balayage damage my hair?",
      answer:
        "All lightening processes involve some chemical change, but balayage is gentler than full-head bleaching because it's applied to selected sections only. I use professional-grade products with bond-strengthening technology to minimise damage and keep your hair healthy.",
    },
    {
      question: "Can I get balayage on dark hair?",
      answer:
        "Absolutely! Balayage looks stunning on dark hair. Warm toffee, rich caramel, and chestnut tones create beautiful contrast against a dark base. Very dark hair may require a two-session approach to lift gradually and avoid brassiness.",
    },
    {
      question: "How long does a balayage appointment take?",
      answer:
        "Allow 2.5 to 3.5 hours depending on hair length and thickness. This includes consultation, application, processing, toning, and styling.",
    },
  ],
  seoTitle: "Balayage | Luxury Locs by Natasha",
  seoDescription: "Balayage hair colouring — freehand, low-maintenance colour. Mobile service across Bath.",
};

const relatedServices: Service[] = [
  { ...balayage, slug: "highlights", title: "Highlights", price: "From £85" },
  { ...balayage, slug: "lowlights", title: "Lowlights", price: "From £75" },
  { ...balayage, slug: "toner-gloss", title: "Toner & Gloss", price: "From £35" },
];

// Story-only palette matching the design mock — cards, borders, and a gold accent, applied via
// ServiceDetail's own --service-detail-*/--glass-panel-*/--breadcrumb-* tokens (see
// CONSUMER-STYLING.md) rather than new component defaults.
const storyTheme = {
  "--glass-panel-bg": "oklch(0.216 0.006 40)",
  "--glass-panel-border-color": "oklch(0.283 0.008 44)",
  "--service-detail-process-divider-colour": "oklch(0.283 0.008 44)",
  "--service-detail-faq-divider-colour": "oklch(0.283 0.008 44)",
  "--service-detail-sidebar-row-divider-colour": "oklch(0.283 0.008 44)",
  "--service-detail-final-cta-divider-colour": "oklch(0.283 0.008 44)",
  "--service-detail-ideal-for-item-border-colour": "oklch(0.283 0.008 44)",
  "--service-detail-process-index-colour": "oklch(0.727 0.089 87)",
  "--service-detail-ideal-for-icon-colour": "oklch(0.727 0.089 87)",
  "--service-detail-hero-pill-border-colour": "oklch(0.727 0.089 87)",
  "--breadcrumb-colour-current": "oklch(0.727 0.089 87)",
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    components: { ServiceDetail, InputButtonCore },
    setup() {
      return { args, balayage, relatedServices, storyTheme };
    },
    template: `
      <ServiceDetail
        v-bind="args"
        :service-data="balayage"
        location="Mobile — across Bath"
        :related-services="relatedServices"
        :style="storyTheme"
      >
        <template #book-cta>
          <InputButtonCore tag="a" href="/contact" button-text="Book now" variant="primary" :style-class-passthrough="['mbs-16']" />
        </template>
        <template #sidebar-note>
          A patch test is required at least 48 hours before any colour treatment.
        </template>
        <template #final-cta>
          <InputButtonCore tag="a" href="/contact" button-text="Book now" variant="secondary" />
        </template>
      </ServiceDetail>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Matches the real service detail page mock: breadcrumb + hero image, full content, sticky sidebar with location, patch-test note, and 'You may also like' related services.",
      },
    },
  },
};

export const NoLocationOrRelated: Story = {
  name: "No Location / No Related Services",
  render: (args) => ({
    components: { ServiceDetail, InputButtonCore },
    setup() {
      return { args, balayage, storyTheme };
    },
    template: `
      <ServiceDetail v-bind="args" :service-data="balayage" :style="storyTheme">
        <template #book-cta>
          <InputButtonCore tag="a" href="/contact" button-text="Book now" variant="primary" :style-class-passthrough="['mbs-16']" />
        </template>
        <template #final-cta>
          <InputButtonCore tag="a" href="/contact" button-text="Book now" variant="secondary" />
        </template>
      </ServiceDetail>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Both the location row and the 'You may also like' block are optional — they simply don't render when `location` / `relatedServices` aren't passed.",
      },
    },
  },
};

export const CustomBreadcrumbAndHeadings: Story = {
  name: "Custom Breadcrumb & Headings",
  render: (args) => ({
    components: { ServiceDetail, InputButtonCore },
    setup() {
      return { args, balayage, relatedServices, storyTheme };
    },
    template: `
      <ServiceDetail
        v-bind="args"
        :service-data="balayage"
        :related-services="relatedServices"
        :breadcrumb-items="[{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }, { label: 'Balayage' }]"
        process-heading="How It Works"
        ideal-for-heading="Who Is This For"
        maintenance-heading="Aftercare"
        faqs-heading="FAQs"
        booking-heading="Reserve Your Slot"
        :style="storyTheme"
      >
        <template #book-cta>
          <InputButtonCore tag="a" href="/contact" button-text="Book now" variant="primary" :style-class-passthrough="['mbs-16']" />
        </template>
        <template #final-cta>
          <InputButtonCore tag="a" href="/contact" button-text="Book now" variant="secondary" />
        </template>
      </ServiceDetail>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Real breadcrumb routes and overridden section/booking copy, all via props — no hardcoded English text to fight.",
      },
    },
  },
};

export const CustomRelatedServiceLink: Story = {
  name: "Custom Related Service Link (slot override)",
  render: (args) => ({
    components: { ServiceDetail, InputButtonCore },
    setup() {
      return { args, balayage, relatedServices, storyTheme };
    },
    template: `
      <ServiceDetail v-bind="args" :service-data="balayage" :related-services="relatedServices" :style="storyTheme">
        <template #book-cta>
          <InputButtonCore tag="a" href="/contact" button-text="Book now" variant="primary" :style-class-passthrough="['mbs-16']" />
        </template>
        <template #related-service="{ service }">
          <a :href="'/services/' + service.slug" style="display:flex;gap:1.2rem;align-items:center;color:inherit;text-decoration:none;">
            <img :src="service.image" :alt="service.title" style="width:5.6rem;height:5.6rem;object-fit:cover;border-radius:0.4rem;" />
            <span>{{ service.title }} — {{ service.price }}</span>
          </a>
        </template>
        <template #final-cta>
          <InputButtonCore tag="a" href="/contact" button-text="Book now" variant="secondary" />
        </template>
      </ServiceDetail>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The related-service scoped slot replaces each related item's default (non-clickable) markup — use it to wrap the item in a real link, matching the pattern of ServiceSummary's summary-link slot.",
      },
    },
  },
};
