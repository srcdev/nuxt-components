import { computed, ref } from "vue";
import ServicesCard from "../ServicesCard.vue";
import CanvasSwitcher from "../../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { Service } from "~/types/types.services";
import type { MediaCanvas } from "~/types/components";

const meta: Meta<typeof ServicesCard> = {
  title: "Organisms/Services/Services Card",
  component: ServicesCard,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "article"],
      description: "HTML element rendered as the root",
    },
    eyebrowConfig: {
      control: "object",
      description: "Override eyebrow tag and fontSize — omit keys to use defaults",
    },
    heroConfig: {
      control: "object",
      description: "Override hero tag and fontSize — omit keys to use defaults",
    },
    href: {
      control: "text",
      description: "When set and no actions slot is provided, the whole card becomes a link",
    },
    external: {
      control: "boolean",
      description: "Force a plain <a> instead of NuxtLink for an internal-looking href",
    },
    durationText: {
      control: "text",
      description: "Overrides serviceData.duration in the meta row",
    },
    priceText: {
      control: "text",
      description: "Overrides serviceData.price in the meta row",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
    },
  },
  args: {
    tag: "div",
    eyebrowConfig: {},
    heroConfig: {},
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "Portrait card for a single service: image, subtitle (eyebrow), title, short description, and an `actions` slot for CTA content. Heading levels and eyebrow sizing are configurable via `eyebrowConfig` and `heroConfig`. Usually consumed via `ServicesCardGrid`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ServicesCard>;

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const sampleService: Service = {
  slug: "locs-installation",
  category: "locs",
  title: "Locs Installation",
  subtitle: "Start your loc journey",
  price: "£120",
  duration: "3–4 hours",
  image: "https://picsum.photos/seed/locs-card/600/800",
  shortDescription:
    "Professional loc installation tailored to your hair type. We work with all textures and lengths to create beautiful, long-lasting locs.",
  longDescription: "Full description not used in card view.",
  heroHeading: [{ text: "Why choose locs?", styleClass: "normal" }],
  whatIsIt: "Locs are a protective hairstyle.",
  process: ["Consultation", "Cleanse", "Palm-roll", "Dry & finish"],
  idealFor: ["Natural hair", "Low maintenance seekers"],
  maintenance: "Re-twist every 4–6 weeks.",
  faqs: [{ question: "How long do locs take to mature?", answer: "12–18 months." }],
  seoTitle: "Locs Installation",
  seoDescription: "Professional locs installation service.",
};

const balayageService: Service = {
  slug: "balayage",
  category: "hair",
  title: "Balayage",
  subtitle: "Freehand Colour Artistry",
  price: "From £95",
  duration: "2.5 - 3.5 hours",
  image: "https://picsum.photos/seed/balayage-card/600/800",
  shortDescription: "Colour swept on by hand, bespoke to your hair's natural fall and texture.",
  longDescription: "Full description not used in card view.",
  heroHeading: [{ text: "Why choose balayage?", styleClass: "normal" }],
  whatIsIt: "A freehand colour technique for a natural, sun-kissed result.",
  process: ["Consultation", "Freehand application", "Toner", "Finish & style"],
  idealFor: ["Low-maintenance colour", "Natural-looking dimension"],
  maintenance: "Refresh every 3–4 months.",
  faqs: [{ question: "Does balayage damage hair?", answer: "No more than any other lightening service when done correctly." }],
  seoTitle: "Balayage",
  seoDescription: "Freehand balayage colour service.",
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const WithActions: Story = {
  name: "With Actions Slot",
  render: (args) => ({
    components: { ServicesCard },
    setup() {
      return { args, sampleService };
    },
    template: `
      <div style="max-width:320px">
        <ServicesCard v-bind="args" :service-data="sampleService">
          <template #actions="{ serviceData }">
            <a
              :href="'/services/' + serviceData.slug"
              style="display:inline-flex;align-items:center;gap:0.6rem;margin-top:1.6rem;padding:1.2rem 2.4rem;background:#333;color:#fff;border-radius:0.4rem;text-decoration:none;font-size:1.4rem;"
            >
              More about {{ serviceData.title }}
            </a>
          </template>
        </ServicesCard>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Standard usage — actions slot receives serviceData as a scoped prop for constructing hrefs and labels.",
      },
    },
  },
};

export const WithoutActions: Story = {
  name: "Without Actions Slot",
  render: (args) => ({
    components: { ServicesCard },
    setup() {
      return { args, sampleService };
    },
    template: `
      <div style="max-width:320px">
        <ServicesCard v-bind="args" :service-data="sampleService" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "The actions slot is optional — card renders cleanly without it.",
      },
    },
  },
};

export const ConfigOverrides: Story = {
  name: "Config Overrides",
  args: {
    eyebrowConfig: { tag: "p", fontSize: "small" },
    heroConfig: { tag: "h3", fontSize: "title" },
  },
  render: (args) => ({
    components: { ServicesCard },
    setup() {
      return { args, sampleService };
    },
    template: `
      <div style="max-width:320px">
        <ServicesCard v-bind="args" :service-data="sampleService">
          <template #actions="{ serviceData }">
            <a
              :href="'/services/' + serviceData.slug"
              style="display:inline-flex;margin-top:1.6rem;padding:1.2rem 2.4rem;background:#333;color:#fff;border-radius:0.4rem;text-decoration:none;font-size:1.4rem;"
            >
              Enquire
            </a>
          </template>
        </ServicesCard>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "eyebrowConfig and heroConfig let consumers adjust heading levels and text sizing without touching the component — useful when multiple cards are nested inside a page with its own heading hierarchy.",
      },
    },
  },
};

export const AsArticle: Story = {
  name: "As Article Element",
  args: {
    tag: "article",
    heroConfig: { tag: "h3" },
  },
  render: (args) => ({
    components: { ServicesCard },
    setup() {
      return { args, sampleService };
    },
    template: `
      <div style="max-width:320px">
        <ServicesCard v-bind="args" :service-data="sampleService">
          <template #actions="{ serviceData }">
            <a
              :href="'/services/' + serviceData.slug"
              style="display:inline-flex;margin-top:1.6rem;padding:1.2rem 2.4rem;background:#333;color:#fff;border-radius:0.4rem;text-decoration:none;font-size:1.4rem;"
            >
              View service
            </a>
          </template>
        </ServicesCard>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Use tag=\"article\" with heroConfig.tag=\"h3\" when cards are inside a section that already has an h2 — keeps the heading hierarchy correct.",
      },
    },
  },
};

export const DesignReplica: Story = {
  name: "Design Replica — Dark Card With Meta Row",
  render: (args) => ({
    components: { ServicesCard },
    setup() {
      return { args, balayageService };
    },
    template: `
      <div style="color-scheme:dark; background:#141414; max-width:360px; padding:2.4rem;">
        <ServicesCard v-bind="args" :service-data="balayageService" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Reproduces the reference design: dark background, no actions slot, and the duration/price meta row sourced from serviceData.duration/serviceData.price (uppercased via CSS).",
      },
    },
  },
};

const makeOverlayService = (
  slug: string,
  subtitle: string,
  title: string,
  shortDescription: string,
  duration: string,
  price: string
): Service => ({
  ...balayageService,
  slug,
  subtitle,
  title,
  shortDescription,
  duration,
  price,
  image: `https://picsum.photos/seed/overlay-${slug}/600/800`,
});

const overlayServices: Service[] = [
  makeOverlayService(
    "balayage",
    "Hair Colouring",
    "Balayage",
    "Hand-painted, sun-kissed colour with a soft regrowth line and low upkeep.",
    "2.5 - 3.5 hours",
    "From £95"
  ),
  makeOverlayService(
    "full-colour",
    "Hair Colouring",
    "Full Colour",
    "Complete colour coverage, from root touch-ups and natural tones to bold, fashion-forward shades.",
    "1.5 - 2.5 hours",
    "From £75"
  ),
  makeOverlayService(
    "restyle",
    "Cutting & Treatment",
    "Restyle",
    "A transformative cut that takes your hair in a new direction: a new shape, length, or style.",
    "1 - 1.5 hours",
    "£65"
  ),
  makeOverlayService(
    "keratin-treatment",
    "Cutting & Treatment",
    "Keratin Treatment",
    "Frizz-free smoothing sealed into the hair, with shine that lasts for months.",
    "2 - 3 hours",
    "£120"
  ),
];

export const DarkOverlayCards: Story = {
  name: "Dark Overlay Cards",
  render: (args) => ({
    components: { ServicesCard },
    setup() {
      return { args, overlayServices };
    },
    template: `
      <component is="style">
        .services-card.dark-overlay-card {
          --services-card-gap: 0;
          --services-card-border-radius: 0.4rem;
          --services-card-background-color: #1c1817;
          --services-card-background-color-hover: #211c1b;
          --services-card-border-colour: #2e2826;
          --services-card-border-colour-hover: #6b5a4e;
          --services-card-transform-hover: translateY(-0.4rem);

          --services-card-image-border-radius: 0;
          --services-card-image-zoom-transform: none;
          --services-card-image-details-scrim-colour: #141110;
          --services-card-image-details-text-colour: #f3ece4;
          --services-card-image-details-eyebrow-colour: #c9a24a;
          --services-card-image-details-gap: 0.4rem;
          --eyebrow-text-font-family: "Poppins", sans-serif;
          --eyebrow-text-font-style: normal;
          --eyebrow-text-font-weight: 600;
          --eyebrow-text-letter-spacing: 0.25em;
          --services-card-image-details-eyebrow-padding-inline: 3.6rem;
          --services-card-image-details-title-padding-block: 0 2.8rem;
          --services-card-image-details-title-padding-inline: 3.6rem;

          --services-card-details-padding-block: 3.6rem;
          --services-card-details-padding-inline: 3.6rem;
          --services-card-description-text-colour: #a39a94;
          --services-card-description-line-height: 1.75;
          --services-card-description-font-weight: 300;
          --services-card-meta-border-colour: #2e2826;
          --services-card-meta-padding-block: 2.4rem 0;
          --services-card-meta-text-colour: #8a817b;
          --services-card-meta-duration-font-weight: 400;
          --services-card-meta-price-font-weight: 400;
          --services-card-meta-letter-spacing: 0.15em;
          --services-card-meta-price-text-colour: #e8dfd6;
        }
      </component>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(26rem, 100%), 1fr)); gap:4rem; padding:2.4rem; background:#121010;">
        <ServicesCard
          v-for="service in overlayServices"
          :key="service.slug"
          v-bind="args"
          :service-data="service"
          :href="'#' + service.slug"
          titles-within-image-wrapper
          :style-class-passthrough="['dark-overlay-card']"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "A darker variant built from tokens: titles over the image with a dark scrim, a flush square-cornered image, a padded details panel, and a whole-card link whose hover lightens the border. Every value is a token, set on a class added with styleClassPassthrough; the eyebrow tokens are EyebrowText's own and inherit down into the card.",
      },
    },
  },
};

// ─── Stress test ──────────────────────────────────────────────────────────────

type LineClamp = "none" | "1" | "2" | "3" | "4";

// Story-only arg: drives a CSS token, not a ServicesCard prop. See the argTypes entry.
type StressArgs = InstanceType<typeof ServicesCard>["$props"] & { descriptionLineClamp: LineClamp };

const longGerman = "Haarverlängerungsbehandlungsberatungsterminvereinbarungsbestätigungsschreiben";
const longUrl =
  "https://example.com/services/a-very-long-path-with-no-spaces-at-all?utm_source=newsletter&utm_campaign=autumn-2026";

const stressService = (overrides: Partial<Service>): Service => ({ ...balayageService, ...overrides });

const stressServices: { service: Service; titlesWithinImageWrapper?: boolean; href?: string; action?: string }[] = [
  {
    service: stressService({
      slug: "long-german",
      subtitle: `Freihändige ${longGerman}`,
      title: longGerman,
      shortDescription:
        "Eine ausgesprochen lange Beschreibung, wie sie ein CMS liefert, wenn niemand die Zeichenanzahl prüft. ".repeat(6),
      duration: "Ungefähr zweieinhalb bis dreieinhalb Stunden einschließlich Beratung",
      price: "Ab 95,00 € zuzüglich Pflegeprodukte nach individueller Absprache",
    }),
  },
  {
    service: stressService({
      slug: "emoji-html",
      subtitle: "✨💇‍♀️ Colour",
      title: "<script>alert('xss')</script>",
      shortDescription: "🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈 <b>not bold</b>",
      duration: "⏱",
      price: "£∞",
    }),
    href: longUrl,
  },
  {
    service: stressService({
      slug: "rtl",
      subtitle: "تلوين الشعر",
      title: "تسريحات شعر جديدة لموسم الخريف",
      shortDescription: "وصف طويل باللغة العربية يمتد عبر عدة أسطر للتحقق من أن النص من اليمين إلى اليسار يعرض بشكل صحيح.",
      duration: "ساعتان",
      price: "١٢٠ جنيه",
    }),
  },
  {
    service: stressService({
      slug: "empty",
      subtitle: "",
      title: "",
      shortDescription: "",
      duration: "",
      price: "",
    }),
  },
  {
    service: stressService({
      slug: "broken-image",
      image: "https://example.invalid/missing.jpg",
      subtitle: "A",
      title: "B",
      shortDescription: "C",
      duration: "1",
      price: "£0",
    }),
  },
  {
    service: stressService({
      slug: "overlay-long",
      image: "https://picsum.photos/seed/stress-overlay/600/800",
      subtitle: longUrl,
      title: `${longGerman} ${longGerman}`,
      shortDescription: longUrl,
    }),
    titlesWithinImageWrapper: true,
    href: "#overlay-long",
  },
  {
    service: stressService({ slug: "long-action", title: "Long button label" }),
    action: `Jetzt ${longGerman} buchen`,
  },
];

export const StressTest: StoryObj<StressArgs> = {
  name: "Stress Test (Worst-Case Data)",
  argTypes: {
    descriptionLineClamp: {
      control: "select",
      options: ["none", "1", "2", "3", "4"] satisfies LineClamp[],
      description:
        "**Story control, not a prop.** Sets the `--services-card-description-line-clamp` CSS token on a wrapper so you can try it here. " +
        "To use it in an app, set the token in your own CSS, e.g. `.services-list { --services-card-description-line-clamp: 3; }`. " +
        "`1` is single-line ellipsis, `none` (the default) shows everything.",
      table: { category: "CSS tokens (story only, set in your CSS)", defaultValue: { summary: "none" } },
    },
  },
  args: {
    descriptionLineClamp: "none",
  },
  render: (args) => ({
    components: { ServicesCard },
    setup() {
      const componentArgs = computed(() => {
        const { descriptionLineClamp: _descriptionLineClamp, ...rest } = args;
        return rest;
      });
      const tokenStyles = computed(() => ({
        "--services-card-description-line-clamp": args.descriptionLineClamp,
      }));
      return { componentArgs, tokenStyles, stressServices };
    },
    template: `
      <div
        :style="tokenStyles"
        style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(25rem, 100%), 1fr)); gap:3.2rem;"
      >
        <ServicesCard
          v-for="item in stressServices"
          :key="item.service.slug"
          v-bind="componentArgs"
          :service-data="item.service"
          :href="item.href"
          :titles-within-image-wrapper="item.titlesWithinImageWrapper"
        >
          <template v-if="item.action" #actions>
            <a href="#long-action" style="display:inline-block; padding:1.2rem 2.4rem; background:#333; color:#fff; border-radius:0.4rem; text-decoration:none;">
              {{ item.action }}
            </a>
          </template>
        </ServicesCard>
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
          "Deliberately hostile data to find breakage, in a grid like ServicesCardGrid's: a long German compound word as title, " +
          "eyebrow and actions label, a long paragraph description, long duration and price strings, emoji, HTML-like text " +
          "(must render as text), right-to-left Arabic, a card with every text field empty (no empty eyebrow, heading, " +
          "description or meta row is rendered), a broken image URL (its alt text shows), single characters, a whole-card " +
          "link to a long URL, and long unbroken titles over the image. Check at every canvas width: no text runs out of its " +
          "card, every column stays the same width, a long duration/price wraps onto two lines rather than overflowing, and " +
          "the meta row and actions stay pinned to the bottom. Try the Description line clamp control too: it's a CSS token " +
          "set by the story, not a prop.",
      },
    },
  },
};
