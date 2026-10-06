import { computed, ref } from "vue";
import ServiceSummary from "../ServiceSummary.vue";
import CanvasSwitcher from "../../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import PageRow from "../../../../01.atoms/page-row/PageRow.vue";
import TextBlock from "../../../../01.atoms/text-block/TextBlock.vue";
import EyebrowText from "../../../../01.atoms/text-blocks/eyebrow-text/EyebrowText.vue";
import HeroText from "../../../../01.atoms/text-blocks/hero-text/HeroText.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { Service } from "~/types/types.services";
import type { MediaCanvas } from "~/types/components";

const meta: Meta<typeof ServiceSummary> = {
  title: "Organisms/Services/Service Summary",
  component: ServiceSummary,
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
    alignment: {
      control: { type: "select" },
      options: ["start", "center", "end"],
      description: "Vertical alignment of the info column relative to the image",
    },
    reverse: {
      control: { type: "boolean" },
      description: "Swap image and content columns",
    },
    pricePrefix: {
      control: { type: "text" },
      description: "Text before the price in its pill; override for localisation, empty shows the price alone",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
    },
  },
  args: {
    tag: "section",
    headerTag: "h2",
    alignment: "center",
    reverse: false,
    pricePrefix: "From",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "Renders a single service as a compact two-column preview: image on one side, eyebrow/title/price-duration pills/summary text on the other, with a summary-link slot for navigating to the full ServiceDetail page. Superseded ServicesSection's old full mode — a ServiceDetail page is the correct place for process/ideal-for/FAQ/CTA content now.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ServiceSummary>;

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

export const Default: Story = {
  name: "Default",
  render: (args) => ({
    components: { ServiceSummary },
    setup() {
      return { args, sampleService };
    },
    template: `
      <ServiceSummary v-bind="args" :service-data="sampleService">
        <template #summary-link="{ serviceData }">
          <a :href="'/services/' + serviceData.slug" style="color:inherit;">
            More about {{ serviceData.title }} →
          </a>
        </template>
      </ServiceSummary>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Eyebrow, title, price/duration pills, whatIsIt summary, and the summary-link slot.",
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
    components: { ServiceSummary },
    setup() {
      return { args, sampleService };
    },
    template: `<ServiceSummary v-bind="args" :service-data="sampleService" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: "Image on the right, content on the left — use on alternating items in a list.",
      },
    },
  },
};

export const FixedRowHeight: Story = {
  name: "Fixed Row Height",
  render: (args) => ({
    components: { ServiceSummary },
    setup() {
      return { args, sampleService };
    },
    template: `
      <div style="--service-summary-height-mobile: 24rem; --service-summary-height-tablet: 28rem; --service-summary-height-desktop: 32rem;">
        <ServiceSummary v-bind="args" :service-data="sampleService">
          <template #summary-link="{ serviceData }">
            <a :href="'/services/' + serviceData.slug" style="color:inherit;">
              More about {{ serviceData.title }} →
            </a>
          </template>
        </ServiceSummary>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "--service-summary-height-mobile/-tablet/-desktop set a fixed height for the whole row (both the image and the text column) per @container breakpoint, instead of the default auto — the image crops via object-fit: cover to fill it (--service-summary-image-aspect-ratio no longer has any visible effect once this is set), and the text column gets real leftover space for the alignment prop to position within. Useful for keeping every row in a list a consistent height regardless of each service's source photo dimensions.",
      },
    },
  },
};

export const CustomAspectRatio: Story = {
  name: "Custom Aspect Ratio",
  args: {
    alignment: "start",
  },
  render: (args) => ({
    components: { ServiceSummary },
    setup() {
      return { args, sampleService };
    },
    template: `
      <div style="--service-summary-image-aspect-ratio: 3 / 4;">
        <ServiceSummary v-bind="args" :service-data="sampleService">
          <template #summary-link="{ serviceData }">
            <a :href="'/services/' + serviceData.slug" style="color:inherit;">
              More about {{ serviceData.title }} →
            </a>
          </template>
        </ServiceSummary>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "--service-summary-image-aspect-ratio (default 1 / 1, square) controls the image's own shape when the row height is left auto (the default) — here overridden to a taller 3 / 4 portrait crop. This token only has a visible effect while no --service-summary-height-* override forces a definite row height.",
      },
    },
  },
};

export const FramedImage: Story = {
  name: "Framed Image (padding)",
  render: (args) => ({
    components: { ServiceSummary },
    setup() {
      return { args, sampleService };
    },
    template: `
      <div style="--service-summary-image-padding-block-mobile: 1.6rem; --service-summary-image-padding-inline-mobile: 1.6rem; background: #1a1a1a;">
        <ServiceSummary v-bind="args" :service-data="sampleService">
          <template #summary-link="{ serviceData }">
            <a :href="'/services/' + serviceData.slug" style="color:inherit;">
              More about {{ serviceData.title }} →
            </a>
          </template>
        </ServiceSummary>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "--service-summary-image-padding-block-*/-inline-* insets the image within .service-summary__image-wrapper instead of letting it fill edge-to-edge — the wrapper's own background shows through as a frame. Combine with a background colour set on the wrapper (via styleClassPassthrough) for a card-like look.",
      },
    },
  },
};

export const RealisticPageContext: Story = {
  name: "Realistic Page Context",
  render: (args) => ({
    components: { ServiceSummary, PageRow, TextBlock, EyebrowText, HeroText },
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
          <ServiceSummary v-bind="args" :service-data="sampleService">
            <template #summary-link="{ serviceData }">
              <a :href="'/services/' + serviceData.slug" style="color:inherit;">
                More about {{ serviceData.title }} →
              </a>
            </template>
          </ServiceSummary>
        </PageRow>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Matches a typical services listing page: a page hero (EyebrowText + HeroText inside PageRow/TextBlock) followed by a ServiceSummary. Use ServiceSummaryGrid for the full alternating listing — this story sanity-checks a single instance's layout in context.",
      },
    },
  },
};

// ─── Stress test ──────────────────────────────────────────────────────────────

type LineClamp = "none" | "1" | "2" | "3" | "4";

// Story-only arg: drives a CSS token, not a ServiceSummary prop. See the argTypes entry.
type StressArgs = InstanceType<typeof ServiceSummary>["$props"] & { bodyLineClamp: LineClamp };

const longGerman = "Haarverlängerungsbehandlungsberatungsterminvereinbarung";

const stressSummaries: Service[] = [
  {
    ...sampleService,
    slug: "long-german",
    subtitle: `Freihändige ${longGerman}`,
    title: `${longGerman} und ${longGerman}`,
    duration: "Ungefähr zweieinhalb bis dreieinhalb Stunden einschließlich ausführlicher Beratung",
    price: "95,00 € zuzüglich Pflegeprodukte nach individueller Absprache mit Ihrer Stylistin",
    whatIsIt: "Eine ausgesprochen lange Beschreibung, wie sie ein CMS liefert, wenn niemand die Zeichenanzahl prüft. ".repeat(8),
  },
  {
    ...sampleService,
    slug: "emoji-html",
    subtitle: "✨💇‍♀️ Colour",
    title: "<script>alert('xss')</script>",
    duration: "⏱",
    price: "£∞",
    whatIsIt: "🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈 <b>not bold</b> https://example.com/a/very/long/url/that/never/breaks/at/all",
  },
  {
    ...sampleService,
    slug: "rtl",
    subtitle: "تلوين الشعر",
    title: "تسريحات شعر جديدة لموسم الخريف",
    duration: "ساعتان",
    price: "١٢٠ جنيه",
    whatIsIt: "وصف طويل باللغة العربية يمتد عبر عدة أسطر للتحقق من أن النص من اليمين إلى اليسار يعرض بشكل صحيح.",
  },
  {
    ...sampleService,
    slug: "empty",
    image: "https://example.invalid/missing.jpg",
    subtitle: "",
    title: "",
    duration: "",
    price: "",
    whatIsIt: "",
  },
  {
    ...sampleService,
    slug: "single-chars",
    subtitle: "A",
    title: "B",
    duration: "1",
    price: "0",
    whatIsIt: "C",
  },
];

export const StressTest: StoryObj<StressArgs> = {
  name: "Stress Test (Worst-Case Data)",
  argTypes: {
    bodyLineClamp: {
      control: "select",
      options: ["none", "1", "2", "3", "4"] satisfies LineClamp[],
      description:
        "**Story control, not a prop.** Sets the `--service-summary-body-line-clamp` CSS token on a wrapper so you can try it here. " +
        "To use it in an app, set the token in your own CSS, e.g. `.services-page { --service-summary-body-line-clamp: 4; }`. " +
        "`1` is single-line ellipsis, `none` (the default) shows everything.",
      table: { category: "CSS tokens (story only, set in your CSS)", defaultValue: { summary: "none" } },
    },
  },
  args: {
    pricePrefix: "Ab einem Mindestpreis von",
    bodyLineClamp: "none",
  },
  render: (args) => ({
    components: { ServiceSummary },
    setup() {
      const componentArgs = computed(() => {
        const { bodyLineClamp: _bodyLineClamp, ...rest } = args;
        return rest;
      });
      const tokenStyles = computed(() => ({ "--service-summary-body-line-clamp": args.bodyLineClamp }));
      return { componentArgs, tokenStyles, stressSummaries };
    },
    template: `
      <div :style="tokenStyles" style="display:grid; gap:4rem;">
        <ServiceSummary
          v-for="(service, index) in stressSummaries"
          :key="service.slug"
          v-bind="componentArgs"
          :index="index"
          :reverse="index % 2 === 1"
          :service-data="service"
        >
          <template #summary-link="{ serviceData }">
            <a :href="'/services/' + serviceData.slug" style="color:inherit;">
              Mehr über {{ serviceData.title || "diese Behandlung" }} erfahren →
            </a>
          </template>
        </ServiceSummary>
      </div>
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
        <div :class="canvasName" style="margin-inline: auto; padding: 2rem; outline: 1px dashed currentColor;">
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
          "Deliberately hostile data to find breakage: long German copy and unbroken compound words in every field, a long " +
          "German price prefix, a very long duration and price (their pills cap at the column width and end in an ellipsis), " +
          "emoji, HTML-like text (must render as text), an unbroken URL, right-to-left Arabic, a broken image, single characters, " +
          "and a summary with every text field empty (no empty eyebrow, heading, pills or body is rendered, and a section root " +
          "drops its aria-labelledby). Check at every canvas width, in both column orders: no text runs out of its column, " +
          "the two columns stay balanced and stack on narrow canvases. Try the Body line clamp control too: it's a CSS token " +
          "set by the story, not a prop.",
      },
    },
  },
};
