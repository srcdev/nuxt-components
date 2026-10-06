import { computed, ref } from "vue";
import ServiceDetail from "../ServiceDetail.vue";
import CanvasSwitcher from "../../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import InputButton from "../../../../05.forms/input-button/InputButton.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { Service } from "~/types/types.services";
import type { MediaCanvas } from "~/types/components";

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
    pricePrefix: { control: "text", description: "Text before the price in the hero pill; empty shows the price alone" },
    idealForIcon: { control: "text", description: "Icon shown on each ideal-for item" },
    breadcrumbAriaLabel: { control: "text", description: "aria-label on the breadcrumb nav (Breadcrumb's default when unset)" },
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
    pricePrefix: "From",
    idealForIcon: "mdi:diamond-stone",
    styleClassPassthrough: [],
  },
  parameters: {
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
  "--service-detail-process-divider-colour": "oklch(0.283 0.008 44)",
  "--service-detail-faq-divider-colour": "oklch(0.283 0.008 44)",
  "--service-detail-sidebar-row-divider-colour": "oklch(0.283 0.008 44)",
  "--service-detail-final-cta-divider-colour": "oklch(0.283 0.008 44)",
  "--service-detail-process-index-colour": "oklch(0.727 0.089 87)",
  "--service-detail-ideal-for-icon-colour": "oklch(0.727 0.089 87)",
  "--service-detail-hero-pill-border-colour": "oklch(0.727 0.089 87)",
  "--breadcrumb-colour-current": "oklch(0.727 0.089 87)",
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    components: { ServiceDetail, InputButton },
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
          <InputButton tag="a" href="/contact" button-text="Book now" variant="primary" :style-class-passthrough="['mbs-16']" />
        </template>
        <template #sidebar-note>
          A patch test is required at least 48 hours before any colour treatment.
        </template>
        <template #final-cta>
          <InputButton tag="a" href="/contact" button-text="Book now" variant="secondary" />
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
    components: { ServiceDetail, InputButton },
    setup() {
      return { args, balayage, storyTheme };
    },
    template: `
      <ServiceDetail v-bind="args" :service-data="balayage" :style="storyTheme">
        <template #book-cta>
          <InputButton tag="a" href="/contact" button-text="Book now" variant="primary" :style-class-passthrough="['mbs-16']" />
        </template>
        <template #final-cta>
          <InputButton tag="a" href="/contact" button-text="Book now" variant="secondary" />
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
    components: { ServiceDetail, InputButton },
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
          <InputButton tag="a" href="/contact" button-text="Book now" variant="primary" :style-class-passthrough="['mbs-16']" />
        </template>
        <template #final-cta>
          <InputButton tag="a" href="/contact" button-text="Book now" variant="secondary" />
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
    components: { ServiceDetail, InputButton },
    setup() {
      return { args, balayage, relatedServices, storyTheme };
    },
    template: `
      <ServiceDetail v-bind="args" :service-data="balayage" :related-services="relatedServices" :style="storyTheme">
        <template #book-cta>
          <InputButton tag="a" href="/contact" button-text="Book now" variant="primary" :style-class-passthrough="['mbs-16']" />
        </template>
        <template #related-service="{ service }">
          <a :href="'/services/' + service.slug" style="display:flex;gap:1.2rem;align-items:center;color:inherit;text-decoration:none;">
            <img :src="service.image" :alt="service.title" style="width:5.6rem;height:5.6rem;object-fit:cover;border-radius:0.4rem;" />
            <span>{{ service.title }} — {{ service.price }}</span>
          </a>
        </template>
        <template #final-cta>
          <InputButton tag="a" href="/contact" button-text="Book now" variant="secondary" />
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

// ─── Stress test ──────────────────────────────────────────────────────────────

type LineClamp = "none" | "1" | "2" | "3" | "4";

// Story-only args: each drives a CSS token, not a ServiceDetail prop. See the argTypes entries.
const lineClampTokens = {
  breadcrumbItemLineClamp: { token: "--breadcrumb-item-line-clamp", label: "Breadcrumb item" },
  heroEyebrowLineClamp: { token: "--service-detail-hero-eyebrow-line-clamp", label: "Hero eyebrow" },
  heroTitleLineClamp: { token: "--service-detail-hero-title-line-clamp", label: "Hero title" },
  sidebarLabelLineClamp: { token: "--service-detail-sidebar-label-line-clamp", label: "Sidebar label" },
  sidebarValueLineClamp: { token: "--service-detail-sidebar-value-line-clamp", label: "Sidebar value" },
  relatedTitleLineClamp: { token: "--service-detail-related-title-line-clamp", label: "Related title" },
  finalCtaHeadingLineClamp: { token: "--service-detail-final-cta-heading-line-clamp", label: "Final CTA heading" },
  finalCtaBodyLineClamp: { token: "--service-detail-final-cta-body-line-clamp", label: "Final CTA body" },
} as const;

type LineClampArg = keyof typeof lineClampTokens;

type StressArgs = InstanceType<typeof ServiceDetail>["$props"] & Record<LineClampArg, LineClamp>;

const longGerman = "Haarverlängerungsbehandlungsberatungsterminvereinbarung";
const longUrl = "https://example.com/a/very/long/path/that/never/breaks/because/it/has/no/spaces/at/all?utm_source=newsletter";
const germanParagraph = "Eine ausgesprochen lange Beschreibung, wie sie ein CMS liefert, wenn niemand die Zeichenanzahl prüft. ";

const stressService: Service = {
  ...balayage,
  slug: "stress",
  category: `Kategorie ${longGerman}`,
  subtitle: `Freihändige ${longGerman}`,
  title: `${longGerman} und ${longGerman}`,
  price: "95,00 € zuzüglich Pflegeprodukte nach individueller Absprache mit Ihrer Stylistin",
  duration: "Ungefähr zweieinhalb bis dreieinhalb Stunden einschließlich ausführlicher Beratung",
  longDescription: germanParagraph.repeat(10),
  heroHeading: [
    { text: "Warum", styleClass: "normal" },
    { text: longGerman, styleClass: "accent" },
  ],
  whatIsIt: `🌈✨ <b>not bold</b> <script>alert(1)</script> ${longUrl}`,
  process: [
    longGerman,
    "A",
    "وصف طويل باللغة العربية يمتد عبر عدة أسطر للتحقق من أن النص من اليمين إلى اليسار يعرض بشكل صحيح.",
    ...Array.from({ length: 9 }, (_, index) => `Schritt ${index + 4}: ${germanParagraph}`),
  ],
  idealFor: [longGerman, "😀 Emoji first", longUrl, "B", ...Array.from({ length: 8 }, (_, index) => `Filler ${index + 1}`)],
  maintenance: germanParagraph.repeat(3),
  faqs: [
    { question: `${longGerman}?`, answer: germanParagraph.repeat(4) },
    { question: "<i>Is this italic?</i>", answer: "" },
    { question: "", answer: "An answer with no question." },
  ],
};

const stressRelated: Service[] = [
  { ...balayage, slug: "related-long", title: `${longGerman} ${longGerman}`, price: "Ab 1.250,00 € pro Sitzung" },
  { ...balayage, slug: "related-long", title: "Duplicate slug", price: "£0" },
  { ...balayage, slug: "related-broken", title: "Broken image", image: "https://example.invalid/missing.jpg", price: "" },
];

export const StressTest: StoryObj<StressArgs> = {
  name: "Stress Test (Worst-Case Data)",
  argTypes: Object.fromEntries(
    Object.entries(lineClampTokens).map(([arg, { token, label }]) => [
      arg,
      {
        name: `${label} line clamp`,
        control: "select",
        options: ["none", "1", "2", "3", "4"] satisfies LineClamp[],
        description:
          `**Story control, not a prop.** Sets the \`${token}\` CSS token on the component so you can try it here. ` +
          `To use it in an app, set the token in your own CSS, e.g. \`.service-page { ${token}: 2; }\`. ` +
          "`1` is single-line ellipsis, `none` (the default) shows everything.",
        table: { category: "CSS tokens (story only, set in your CSS)", defaultValue: { summary: "none" } },
      },
    ])
  ),
  args: {
    tag: "section",
    pricePrefix: "Ab einem Mindestpreis von",
    idealForIcon: "this-icon:does-not-exist",
    location: `Mobil im gesamten Großraum ${longGerman}, nach Vereinbarung auch an Wochenenden`,
    bookingHeading: `Diese ${longGerman} jetzt buchen`,
    finalCtaHeading: `Bereit für Ihre ${longGerman}?`,
    finalCtaBody: germanParagraph.repeat(2),
    ...(Object.fromEntries(Object.keys(lineClampTokens).map((arg) => [arg, "none"])) as Record<LineClampArg, LineClamp>),
  },
  render: (args) => ({
    components: { ServiceDetail, InputButton },
    setup() {
      const componentArgs = computed(() =>
        Object.fromEntries(Object.entries(args).filter(([arg]) => !(arg in lineClampTokens)))
      );
      const tokenStyles = computed(() => ({
        ...storyTheme,
        ...Object.fromEntries(
          Object.entries(lineClampTokens).map(([arg, { token }]) => [token, args[arg as LineClampArg]])
        ),
      }));
      return { componentArgs, tokenStyles, stressService, stressRelated };
    },
    template: `
      <ServiceDetail v-bind="componentArgs" :service-data="stressService" :related-services="stressRelated" :style="tokenStyles">
        <template #book-cta>
          <InputButton tag="a" href="/contact" button-text="Jetzt unverbindlich einen Beratungstermin vereinbaren" variant="primary" />
        </template>
        <template #sidebar-note>
          Ein Allergietest ist mindestens 48 Stunden vor jeder Farbbehandlung erforderlich: ${longUrl}
        </template>
        <template #final-cta>
          <InputButton tag="a" href="/contact" button-text="Jetzt buchen" variant="secondary" />
        </template>
      </ServiceDetail>
    `,
  }),
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
        <div :class="canvasName" style="margin-inline: auto; outline: 1px dashed currentColor;">
          <story />
        </div>
      `,
    }),
  ],
  parameters: {
    layout: "fullscreen",
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "Deliberately hostile data to find breakage: a hero title of two 55-character German compound words (the hero " +
          "grows instead of clipping it), long German breadcrumb, eyebrow, pills, booking copy and location, a German price " +
          "prefix, emoji, HTML-like text (must render as text), an unbroken URL, right-to-left Arabic, 12 process steps and " +
          "12 ideal-for items, FAQs with an empty answer and an empty question, related services with a long title, a " +
          "duplicate slug, a broken image and an empty price, and a broken ideal-for icon name. Check at every canvas width: " +
          "no text runs out of its column, the sidebar values wrap and stay right-aligned, and the body switches to two " +
          "columns from 900px. Try the line clamp controls too (breadcrumb items, hero eyebrow and title, sidebar labels and values, related titles, final CTA heading and body): they set CSS tokens, they are not props. The final CTA button never shrinks or gets pushed out by long copy.",
      },
    },
  },
};
