import ServicesCard from "../ServicesCard.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { Service } from "~/types/types.services";

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
