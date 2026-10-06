import ServiceSummaryGrid from "../ServiceSummaryGrid.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { Service } from "~/types/types.services";

const meta: Meta<typeof ServiceSummaryGrid> = {
  title: "Organisms/Services/Service Summary Grid",
  component: ServiceSummaryGrid,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "main"],
      description: "HTML element rendered as the root",
    },
    useAlternateReverse: {
      control: { type: "boolean" },
      description: "Alternate image/content column order on every other section",
    },
    alignment: {
      control: { type: "select" },
      options: ["start", "center", "end"],
      description: "Vertical alignment of the info column in each section",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
    },
  },
  args: {
    tag: "div",
    useAlternateReverse: false,
    alignment: "center",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "Renders a vertical stack of `ServiceSummary` components from a `Service[]` array. Each summary includes a summary-link slot. Alternate image/content column order is controlled via `useAlternateReverse`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ServiceSummaryGrid>;

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
  whatIsIt: `${title} is a popular protective style suitable for all hair types.`,
  process: ["Consultation", "Preparation", "Application", "Finishing"],
  idealFor: ["Natural hair", "All textures"],
  maintenance: "Regular maintenance recommended every 4–6 weeks.",
  faqs: [{ question: "How long does it last?", answer: "Results vary by hair type and aftercare." }],
  seoTitle: title,
  seoDescription: `Book a ${title.toLowerCase()} appointment today.`,
});

const sampleServices: Service[] = [
  makeService("locs-installation", "Locs Installation", "Start your loc journey", "https://picsum.photos/seed/locs-a/800/600"),
  makeService("locs-retwist", "Locs Retwist", "Keep your locs fresh", "https://picsum.photos/seed/locs-b/800/600"),
  makeService("colour-treatment", "Colour Treatment", "Add dimension and depth", "https://picsum.photos/seed/colour/800/600"),
];

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    components: { ServiceSummaryGrid },
    setup() {
      return { args, sampleServices };
    },
    template: `
      <ServiceSummaryGrid v-bind="args" :services-data="sampleServices">
        <template #summary-link="{ serviceData }">
          <a
            :href="'/services/' + serviceData.slug"
            style="display:inline-flex;align-items:center;gap:0.4rem;margin-top:1.6rem;color:inherit;"
          >
            More about {{ serviceData.title }} →
          </a>
        </template>
      </ServiceSummaryGrid>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "summary-link slot receives serviceData as a scoped prop so the href and label can be built from the service slug and title.",
      },
    },
  },
};

export const AlternateReverse: Story = {
  name: "Alternate Reverse",
  args: {
    useAlternateReverse: true,
  },
  render: (args) => ({
    components: { ServiceSummaryGrid },
    setup() {
      return { args, sampleServices };
    },
    template: `
      <ServiceSummaryGrid v-bind="args" :services-data="sampleServices">
        <template #summary-link="{ serviceData }">
          <a :href="'/services/' + serviceData.slug" style="display:inline-flex;margin-top:1.6rem;color:inherit;">
            More about {{ serviceData.title }} →
          </a>
        </template>
      </ServiceSummaryGrid>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "useAlternateReverse — odd-indexed sections flip image/content columns, creating a zigzag layout for visual variety.",
      },
    },
  },
};

export const NoSlots: Story = {
  name: "No Slots (empty sections)",
  render: (args) => ({
    components: { ServiceSummaryGrid },
    setup() {
      return { args, sampleServices };
    },
    template: `<ServiceSummaryGrid v-bind="args" :services-data="sampleServices" />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Without slots provided the summary-link and cta areas render empty — use this to verify layout before wiring up navigation.",
      },
    },
  },
};

export const SingleService: Story = {
  name: "Single Service",
  render: (args) => ({
    components: { ServiceSummaryGrid },
    setup() {
      return { args, sampleServices };
    },
    template: `
      <ServiceSummaryGrid v-bind="args" :services-data="[sampleServices[0]]">
        <template #summary-link="{ serviceData }">
          <a :href="'/services/' + serviceData.slug" style="display:inline-flex;margin-top:1.6rem;color:inherit;">
            More about {{ serviceData.title }} →
          </a>
        </template>
      </ServiceSummaryGrid>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Grid with a single service item.",
      },
    },
  },
};

export const EmptyData: Story = {
  name: "Empty Data",
  render: (args) => ({
    components: { ServiceSummaryGrid },
    setup() {
      return { args };
    },
    template: `<ServiceSummaryGrid v-bind="args" :services-data="[]" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: "When servicesData is empty the grid renders with no children — pass an empty array as a safe fallback while data loads.",
      },
    },
  },
};

// ─── Stress test ──────────────────────────────────────────────────────────────

const stressServices: Service[] = [
  ...Array.from({ length: 7 }, (_, index) =>
    makeService(`stress-${index}`, `Service ${index + 1}`, "Grid stress", `https://picsum.photos/seed/summary-stress-${index}/800/600`)
  ),
  makeService("stress-0", "Duplicate slug", "Same slug as the first row", "https://picsum.photos/seed/summary-stress-dup/800/600"),
];

const longLinkLabel =
  "Mehr über diese außergewöhnlich ausführliche Haarverlängerungsbehandlungsberatung erfahren und einen Termin vereinbaren";

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    useAlternateReverse: true,
  },
  render: (args) => ({
    components: { ServiceSummaryGrid },
    setup() {
      return { args, stressServices, longLinkLabel };
    },
    template: `
      <ServiceSummaryGrid v-bind="args" :services-data="stressServices">
        <template #summary-link="{ serviceData }">
          <a :href="'/services/' + serviceData.slug" style="display:inline-block;margin-top:1.6rem;color:inherit;overflow-wrap:anywhere;">
            {{ longLinkLabel }}
          </a>
        </template>
      </ServiceSummaryGrid>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Grid-level worst case: eight rows (an odd count of distinct services, so alternate-reverse ends on a " +
          "non-reversed row), two rows sharing a slug, and a long German summary-link label in every row. Check that " +
          "rows alternate correctly all the way down, the duplicate slug renders both rows, and the slot content stays " +
          "inside its column. Field-level worst-case data (long titles, empty fields, emoji) belongs to ServiceSummary's " +
          "own stress story, since every field is rendered there.",
      },
    },
  },
};
