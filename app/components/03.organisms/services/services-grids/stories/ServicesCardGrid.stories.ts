import { computed } from "vue";
import ServicesCardGrid from "../ServicesCardGrid.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { Service } from "~/types/types.services";

type StoryArgs = {
  tag?: "div" | "section" | "main";
  eyebrowConfig?: { tag?: "p" | "div" | "span"; fontSize?: "large" | "medium" | "small" };
  heroConfig?: {
    tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    fontSize?: "display" | "title" | "heading" | "subheading" | "label";
  };
  hrefBase?: string;
  buttonTextPrefix?: string;
  buttonIcon?: string;
  styleClassPassthrough?: string | string[];
  /** Story-only — not a real ServicesCardGrid prop, see useStorySetup below. */
  lineClamp?: 1 | 2 | 3 | 4 | 5;
  /** Story-only — sets --services-card-grid-column-min-width on the wrapper, see useStorySetup below. */
  cardMinWidth?: "200px" | "250px" | "300px" | "350px" | "400px";
};

const meta: Meta<StoryArgs> = {
  title: "Organisms/Services/Services Card Grid",
  component: ServicesCardGrid,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "main"],
      description: "HTML element rendered as the root",
    },
    eyebrowConfig: {
      control: "object",
      description: "Override eyebrow tag and fontSize on every card — omit keys to use defaults",
    },
    heroConfig: {
      control: "object",
      description: "Override hero tag and fontSize on every card — omit keys to use defaults",
    },
    hrefBase: {
      control: { type: "text" },
      description: "Base path for each card's CTA button — appended with the service slug",
    },
    buttonTextPrefix: {
      control: { type: "text" },
      description: "Prefix for each card's CTA button text — appended with the service title",
    },
    buttonIcon: {
      control: { type: "text" },
      description: "Icon on each card's CTA button",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
    },
    lineClamp: {
      control: { type: "inline-radio" },
      options: [1, 2, 3, 4, 5],
      description:
        "Story-only control — sets ServicesCard's --services-card-description-line-clamp custom property on the grid wrapper (not a real component prop) to demo description clamping across cards",
    },
    cardMinWidth: {
      control: { type: "inline-radio" },
      options: ["200px", "250px", "300px", "350px", "400px"],
      description:
        "Story-only control — sets --services-card-grid-column-min-width on the grid wrapper (not a real component prop). Cards never go narrower than this; auto-fit then stretches each column to share the leftover space",
    },
  },
  args: {
    tag: "div",
    eyebrowConfig: {},
    heroConfig: {},
    hrefBase: "/services/",
    buttonTextPrefix: "Enquire about",
    buttonIcon: "mdi:arrow-right",
    styleClassPassthrough: [],
    lineClamp: 3,
    cardMinWidth: "250px",
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
          "Responsive auto-fit grid of `ServicesCard` components from a `Service[]` array. Button hrefs and text are built from `hrefBase` + `service.slug` and `buttonTextPrefix` + `service.title`. Typography is configured once via `eyebrowConfig` and `heroConfig` and applied to every card.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const makeService = (slug: string, title: string, subtitle: string, image: string): Service => ({
  slug,
  category: "locs",
  title,
  subtitle,
  price: "£120",
  duration: "3–4 hours",
  image,
  shortDescription: `Professional ${title.toLowerCase()} service tailored to your hair type and style goals.`,
  longDescription: "Full description available on the service detail page.",
  heroHeading: [{ text: `Why choose ${title}?`, styleClass: "normal" }],
  whatIsIt: `${title} is a popular protective style.`,
  process: ["Consultation", "Preparation", "Application", "Finishing"],
  idealFor: ["Natural hair", "All textures"],
  maintenance: "Regular maintenance recommended every 4–6 weeks.",
  faqs: [{ question: "How long does it last?", answer: "Results vary by hair type." }],
  seoTitle: title,
  seoDescription: `Book a ${title.toLowerCase()} appointment today.`,
});

const sampleServices: Service[] = [
  makeService("locs-installation", "Locs Installation", "Start your loc journey", "https://picsum.photos/seed/card-a/600/800"),
  makeService("locs-retwist", "Locs Retwist", "Keep your locs fresh", "https://picsum.photos/seed/card-b/600/800"),
  makeService("colour-treatment", "Colour Treatment", "Add dimension and depth", "https://picsum.photos/seed/card-c/600/800"),
];

const makeServiceWithDescription = (
  slug: string,
  title: string,
  subtitle: string,
  image: string,
  shortDescription: string
): Service => ({ ...makeService(slug, title, subtitle, image), shortDescription });

// Six cards with progressively longer shortDescription text, to demo how the same
// lineClamp value clips each card's description at a different point.
const lineClampServices: Service[] = [
  makeServiceWithDescription(
    "one-liner",
    "Fringe Trim",
    "A quick refresh",
    "https://picsum.photos/seed/clamp-1/600/800",
    "A quick tidy-up."
  ),
  makeServiceWithDescription(
    "short-desc",
    "Blow Dry",
    "Salon finish, fast",
    "https://picsum.photos/seed/clamp-2/600/800",
    "A smooth, voluminous blow dry finished with a light-hold spray for lasting body."
  ),
  makeServiceWithDescription(
    "medium-desc",
    "Balayage",
    "Freehand colour artistry",
    "https://picsum.photos/seed/clamp-3/600/800",
    "Colour swept on by hand, bespoke to your hair's natural fall and texture. Creates soft, sun-kissed dimension that grows out gracefully with minimal upkeep."
  ),
  makeServiceWithDescription(
    "long-desc",
    "Locs Installation",
    "Start your loc journey",
    "https://picsum.photos/seed/clamp-4/600/800",
    "Professional loc installation tailored to your hair type. We work with all textures and lengths to create beautiful, long-lasting locs, with a full consultation beforehand to agree size, style, and maintenance schedule."
  ),
  makeServiceWithDescription(
    "very-long-desc",
    "Keratin Treatment",
    "Smooth, frizz-free hair",
    "https://picsum.photos/seed/clamp-5/600/800",
    "A deep-conditioning keratin treatment that smooths the hair cuticle, reduces frizz, and cuts down on daily styling time. Results typically last three to five months depending on hair type, porosity, and aftercare routine, and can be combined with a colour service for a full transformation."
  ),
  makeServiceWithDescription(
    "extra-long-desc",
    "Full Colour Correction",
    "Rebuild from the roots",
    "https://picsum.photos/seed/clamp-6/600/800",
    "A multi-session colour correction service for hair that's had previous colour go wrong — box dye build-up, uneven tone, brassiness, or over-processed ends. We start with a full strand test and consultation, then work in stages to lift, tone, and rebuild condition safely, protecting hair integrity at every step rather than rushing to a single-visit result that risks further damage."
  ),
];

// Twelve cards (divides evenly into 2, 3, 4 and 6 columns) to demo how cardMinWidth
// changes the column count as the canvas resizes.
const cardWidthServices: Service[] = [
  ...sampleServices,
  ...lineClampServices,
  makeService("silk-press", "Silk Press", "Sleek, glossy straightening", "https://picsum.photos/seed/width-1/600/800"),
  makeService("box-braids", "Box Braids", "Classic protective style", "https://picsum.photos/seed/width-2/600/800"),
  makeService("scalp-treatment", "Scalp Treatment", "Healthy hair starts here", "https://picsum.photos/seed/width-3/600/800"),
];

// ─── Stories ──────────────────────────────────────────────────────────────────

// Hides the story-only lineClamp/cardMinWidth controls on stories whose fixtures can't
// show them (3 or fewer cards never wrap under auto-fit, and two-line descriptions
// never clamp) — use the Description Line Clamp and Card Width stories for those.
const hideDemoControls = {
  lineClamp: { table: { disable: true } },
  cardMinWidth: { table: { disable: true } },
};

/**
 * lineClamp and cardMinWidth are story-only controls (not real ServicesCardGrid props).
 * They set --services-card-description-line-clamp (read by each ServicesCard's .description) and
 * --services-card-grid-column-min-width (the grid's minmax() floor) on a wrapper div,
 * and are stripped from the args bound to the component so they don't leak as attributes.
 */
function useStorySetup(args: StoryArgs) {
  const wrapperStyle = computed(() => ({
    "--services-card-description-line-clamp": String(args.lineClamp ?? 3),
    "--services-card-grid-column-min-width": args.cardMinWidth ?? "250px",
  }));
  const componentArgs = computed(() => {
    const { lineClamp: _lineClamp, cardMinWidth: _cardMinWidth, ...rest } = args;
    return rest;
  });
  return { wrapperStyle, componentArgs };
}

export const Default: Story = {
  argTypes: hideDemoControls,
  render: (args) => ({
    components: { ServicesCardGrid },
    setup() {
      return { ...useStorySetup(args), sampleServices };
    },
    template: `
      <div :style="wrapperStyle">
        <ServicesCardGrid v-bind="componentArgs" :services-data="sampleServices" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Default three-card grid — columns auto-fit above the 250px minimum width.",
      },
    },
  },
};

export const CustomButtonText: Story = {
  argTypes: hideDemoControls,
  name: "Custom Button Text",
  args: {
    hrefBase: "/services/",
    buttonTextPrefix: "More about",
  },
  render: (args) => ({
    components: { ServicesCardGrid },
    setup() {
      return { ...useStorySetup(args), sampleServices };
    },
    template: `
      <div :style="wrapperStyle">
        <ServicesCardGrid v-bind="componentArgs" :services-data="sampleServices" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Override hrefBase and buttonTextPrefix to match the consuming app's route structure and copy.",
      },
    },
  },
};

export const ConfigOverrides: Story = {
  argTypes: hideDemoControls,
  name: "Config Overrides",
  args: {
    eyebrowConfig: { tag: "p", fontSize: "small" },
    heroConfig: { tag: "h3", fontSize: "title" },
  },
  render: (args) => ({
    components: { ServicesCardGrid },
    setup() {
      return { ...useStorySetup(args), sampleServices };
    },
    template: `
      <div :style="wrapperStyle">
        <ServicesCardGrid v-bind="componentArgs" :services-data="sampleServices" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "eyebrowConfig and heroConfig are applied uniformly to every card — set heroConfig.tag to h3 when the page already has an h2 above the grid.",
      },
    },
  },
};

export const SingleCard: Story = {
  argTypes: hideDemoControls,
  name: "Single Card",
  render: (args) => ({
    components: { ServicesCardGrid },
    setup() {
      return { ...useStorySetup(args), sampleServices };
    },
    template: `
      <div :style="wrapperStyle">
        <ServicesCardGrid v-bind="componentArgs" :services-data="[sampleServices[0]]" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Grid with a single service — the card expands to fill the full column width.",
      },
    },
  },
};

export const EmptyData: Story = {
  argTypes: hideDemoControls,
  name: "Empty Data",
  render: (args) => ({
    components: { ServicesCardGrid },
    setup() {
      return { ...useStorySetup(args) };
    },
    template: `
      <div :style="wrapperStyle">
        <ServicesCardGrid v-bind="componentArgs" :services-data="[]" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "When servicesData is empty the grid renders with no children — pass an empty array as a safe fallback while data loads.",
      },
    },
  },
};

export const DescriptionLineClamp: Story = {
  name: "Description Line Clamp",
  args: {
    lineClamp: 3,
  },
  render: (args) => ({
    components: { ServicesCardGrid },
    setup() {
      return { ...useStorySetup(args), lineClampServices };
    },
    template: `
      <div :style="wrapperStyle">
        <ServicesCardGrid v-bind="componentArgs" :services-data="lineClampServices" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Six cards with progressively longer shortDescription text, all sharing one --services-card-description-line-clamp value set via the lineClamp control. Use the control to see how the same clamp value affects a one-line description (no visible clamping) versus a long paragraph (clamped with an ellipsis) — card heights stay equal since the meta row and actions slot sit below the clamped description rather than growing with it.",
      },
    },
  },
};

export const CardWidth: Story = {
  name: "Card Width",
  args: {
    cardMinWidth: "300px",
  },
  render: (args) => ({
    components: { ServicesCardGrid },
    setup() {
      return { ...useStorySetup(args), cardWidthServices };
    },
    template: `
      <div :style="wrapperStyle">
        <ServicesCardGrid v-bind="componentArgs" :services-data="cardWidthServices" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Twelve cards with the cardMinWidth control driving --services-card-grid-column-min-width. The value is a floor, not a fixed width: auto-fit fits as many columns as that minimum allows, then stretches them to fill the row. Change the control or resize the canvas to see the column count change.",
      },
    },
  },
};
