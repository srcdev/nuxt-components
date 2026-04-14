import ServicesCardGrid from "../ServicesCardGrid.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { Service } from "~/types/types.services";

const meta: Meta<typeof ServicesCardGrid> = {
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
  },
  args: {
    tag: "div",
    eyebrowConfig: {},
    heroConfig: {},
    hrefBase: "/services/",
    buttonTextPrefix: "Enquire about",
    styleClassPassthrough: [],
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
type Story = StoryObj<typeof ServicesCardGrid>;

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

// ─── Stories ──────────────────────────────────────────────────────────────────

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
