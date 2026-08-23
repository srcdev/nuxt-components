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
  styleClassPassthrough?: string | string[];
  /** Story-only — not a real ServicesCardGrid prop, see useStorySetup below. */
  lineClamp?: number;
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
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
    },
    lineClamp: {
      control: { type: "number", min: 1, max: 10, step: 1 },
      description:
        "Story-only control — sets ServicesCard's --description-line-clamp custom property on the grid wrapper (not a real component prop) to demo description clamping across cards",
    },
  },
  args: {
    tag: "div",
    eyebrowConfig: {},
    heroConfig: {},
    hrefBase: "/services/",
    buttonTextPrefix: "Enquire about",
    styleClassPassthrough: [],
    lineClamp: 3,
  },
  parameters: {
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

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * lineClamp is a story-only control (not a real ServicesCardGrid prop) that sets
 * --description-line-clamp on the grid wrapper — the global custom property each
 * ServicesCard's .description reads for its -webkit-line-clamp value.
 */
function useStorySetup(args: StoryArgs) {
  const clampStyle = computed(() => ({
    "--description-line-clamp": String(args.lineClamp ?? 3),
  }));
  const componentArgs = computed(() => {
    const { lineClamp: _lineClamp, ...rest } = args;
    return rest;
  });
  return { clampStyle, componentArgs };
}

export const Default: Story = {
  render: (args) => ({
    components: { ServicesCardGrid },
    setup() {
      return { args, sampleServices };
    },
    template: `<ServicesCardGrid v-bind="args" :services-data="sampleServices" />`,
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
  name: "Custom Button Text",
  args: {
    hrefBase: "/services/",
    buttonTextPrefix: "More about",
  },
  render: (args) => ({
    components: { ServicesCardGrid },
    setup() {
      return { args, sampleServices };
    },
    template: `<ServicesCardGrid v-bind="args" :services-data="sampleServices" />`,
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
  name: "Config Overrides",
  args: {
    eyebrowConfig: { tag: "p", fontSize: "small" },
    heroConfig: { tag: "h3", fontSize: "title" },
  },
  render: (args) => ({
    components: { ServicesCardGrid },
    setup() {
      return { args, sampleServices };
    },
    template: `<ServicesCardGrid v-bind="args" :services-data="sampleServices" />`,
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
  name: "Single Card",
  render: (args) => ({
    components: { ServicesCardGrid },
    setup() {
      return { args, sampleServices };
    },
    template: `<ServicesCardGrid v-bind="args" :services-data="[sampleServices[0]]" />`,
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
  name: "Empty Data",
  render: (args) => ({
    components: { ServicesCardGrid },
    setup() {
      return { args };
    },
    template: `<ServicesCardGrid v-bind="args" :services-data="[]" />`,
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
      <div :style="clampStyle">
        <ServicesCardGrid v-bind="componentArgs" :services-data="lineClampServices" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Six cards with progressively longer shortDescription text, all sharing one --description-line-clamp value set via the lineClamp control. Use the control to see how the same clamp value affects a one-line description (no visible clamping) versus a long paragraph (clamped with an ellipsis) — card heights stay equal since the meta row and actions slot sit below the clamped description rather than growing with it.",
      },
    },
  },
};
